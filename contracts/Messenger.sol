// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IGasOracle} from "./interfaces/IGasOracle.sol";
import {IMessenger} from "./interfaces/IMessenger.sol";
import {GasUsage} from "./GasUsage.sol";
import {HashUtils} from "./libraries/HashUtils.sol";

/**
 * @dev This contract implements the Allbridge messenger cross-chain communication protocol.
 */
contract Messenger is Ownable, GasUsage, IMessenger {
    using HashUtils for bytes32;
    // current chain ID
    uint public immutable chainId;
    // supported destination chain IDs
    bytes32 public otherChainIds;

    // the primary account that is responsible for validation that a message has been sent on the source chain
    address private primaryValidator;
    // the secondary accounts that are responsible for validation that a message has been sent on the source chain
    mapping(address => bool) private secondaryValidators;
    mapping(bytes32 messageHash => uint blockNumber) public override sentMessagesBlock;
    mapping(bytes32 messageHash => uint isReceived) public override receivedMessages;

    event MessageSent(bytes32 indexed message);
    event MessageReceived(bytes32 indexed message);

    /**
     * @dev Emitted when the contract receives native gas tokens (e.g. Ether on the Ethereum network).
     */
    event Received(address, uint);

    /**
     * @dev Emitted when the mapping of secondary validators is updated.
     */
    event SecondaryValidatorsSet(address[] oldValidators, address[] newValidators);

    constructor(
        uint chainId_,
        bytes32 otherChainIds_,
        IGasOracle gasOracle_,
        address primaryValidator_,
        address[] memory validators
    ) GasUsage(gasOracle_) {
        chainId = chainId_;
        otherChainIds = otherChainIds_;
        primaryValidator = primaryValidator_;

        uint length = validators.length;
        for (uint index; index < length; ) {
            secondaryValidators[validators[index]] = true;
            unchecked {
                index++;
            }
        }
    }

    /**
     * @notice Sends a message to another chain.
     * @dev Emits a {MessageSent} event, which signals to the off-chain messaging service to invoke the `receiveMessage`
     * function on the destination chain to deliver the message.
     *
     * Requirements:
     *
     * - the first byte of the message must be the current chain ID.
     * - the second byte of the message must be the destination chain ID.
     * - the same message cannot be sent second time.
     * - messaging fee must be payed. (See `getTransactionCost` of the `GasUsage` contract).
     * @param message The message to be sent to the destination chain.
     */
    function sendMessage(bytes32 message) external payable override {
        require(uint8(message[0]) == chainId, "Messenger: wrong chainId");
        require(otherChainIds[uint8(message[1])] != 0, "Messenger: wrong destination");

        bytes32 messageWithSender = message.hashWithSenderAddress(msg.sender);

        require(sentMessagesBlock[messageWithSender] == 0, "Messenger: has message");
        sentMessagesBlock[messageWithSender] = block.number;

        require(msg.value >= this.getTransactionCost(uint8(message[1])), "Messenger: not enough fee");

        emit MessageSent(messageWithSender);
    }

    function sendMessageTron(bytes32 message) external payable {
        require(uint8(message[0]) == chainId, "Messenger: wrong chainId");
        require(otherChainIds[uint8(message[1])] != 0, "Messenger: wrong destination");

        bytes32 messageWithSender = message.hashWithSender(message);

        require(sentMessagesBlock[messageWithSender] == 0, "Messenger: has message");
        sentMessagesBlock[messageWithSender] = block.number;

        require(msg.value >= this.getTransactionCost(uint8(message[1])), "Messenger: not enough fee");

        emit MessageSent(messageWithSender);
    }

    function msgSender() external view returns (address) {
        return msg.sender;
    } 

    function msgSenderAddr() external view returns (address) {
        return address(msg.sender);
    }

    /**
     * @notice Delivers a message to the destination chain.
     * @dev Emits an {MessageReceived} event indicating the message has been delivered.
     *
     * Requirements:
     *
     * - a valid signature of the primary validator.
     * - a valid signature of one of the secondary validators.
     * - the second byte of the message must be the current chain ID.
     */
    function receiveMessage(
        bytes32 message,
        uint v1v2,
        bytes32 r1,
        bytes32 s1,
        bytes32 r2,
        bytes32 s2
    ) external override {
        bytes32 hashedMessage = message.hashed();
        require(ecrecover(hashedMessage, uint8(v1v2 >> 8), r1, s1) == primaryValidator, "Messenger: invalid primary");
        require(secondaryValidators[ecrecover(hashedMessage, uint8(v1v2), r2, s2)], "Messenger: invalid secondary");

        require(uint8(message[1]) == chainId, "Messenger: wrong chainId");

        receivedMessages[message] = 1;

        emit MessageReceived(message);
    }

    function verifyMessage(
        bytes32 message,
        bytes memory signature1
    ) external {
        bytes32 hashedMessage = message.getEthSignedMessageHash();
        (bytes32 r1, bytes32 s1, uint8 v1) = splitSignature(signature1);
        require(ecrecover(hashedMessage, v1, r1, s1) == primaryValidator, "Messenger: invalid primary");

        require(uint8(message[1]) == chainId, "Messenger: wrong chainId");

        receivedMessages[message] = 1;

        emit MessageReceived(message);
    }

    function verifyMessageTron(
        bytes32 message,
        bytes memory signature1
    ) external {
        bytes32 hashedMessage = message.getTronSignedMessageHash();
        (bytes32 r1, bytes32 s1, uint8 v1) = splitSignature(signature1);
        require(ecrecover(hashedMessage, v1, r1, s1) == primaryValidator, "Messenger: invalid primary");

        require(uint8(message[1]) == chainId, "Messenger: wrong chainId");

        receivedMessages[message] = 1;

        emit MessageReceived(message);
    }

    function splitSignature(
        bytes memory sig
    ) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "invalid signature length");

        assembly {
            /*
            First 32 bytes stores the length of the signature

            add(sig, 32) = pointer of sig + 32
            effectively, skips first 32 bytes of signature

            mload(p) loads next 32 bytes starting at the memory address p into memory
            */

            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }
    }

    /**
     * @dev Allows the admin to withdraw the messaging fee collected in native gas tokens.
     */
    function withdrawGasTokens(uint amount) external onlyOwner {
        payable(msg.sender).transfer(amount);
    }

    /**
     * @dev Allows the admin to set the primary validator address.
     */
    function setPrimaryValidator(address value) external onlyOwner {
        primaryValidator = value;
    }

    /**
     * @dev Allows the admin to set the addresses of secondary validators.
     */
    function setSecondaryValidators(address[] memory oldValidators, address[] memory newValidators) external onlyOwner {
        uint length = oldValidators.length;
        uint index;
        for (; index < length; ) {
            secondaryValidators[oldValidators[index]] = false;
            unchecked {
                index++;
            }
        }
        length = newValidators.length;
        index = 0;
        for (; index < length; ) {
            secondaryValidators[newValidators[index]] = true;
            unchecked {
                index++;
            }
        }
        emit SecondaryValidatorsSet(oldValidators, newValidators);
    }

    /**
     * @dev Allows the admin to update a list of supported destination chain IDs
     * @param value Each byte of the `value` parameter represents whether a chain ID with such index is supported
     *              as a valid message destination.
     */
    function setOtherChainIds(bytes32 value) external onlyOwner {
        otherChainIds = value;
    }

    fallback() external payable {
        revert("Unsupported");
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}
