const { getContract, callContract } = require('../helper');

(async function () {
  const messengerAddress = process.env.MESSENGER_ADDRESS;
  if (!messengerAddress) {
    throw new Error('No messenger address');
  }

//   const result = await getContract(
//     'Messenger',
//     messengerAddress,
//     'verifyMessageII',
//     '0x0504db8f200758d506f9360cf644291f4b6d4e7826b4f45430b7329ac1e217e8',
//     '0x1d36f549a90d4c39596142a9114275de58e1401528a3920a6ffb58760c2816bc6fda4e857efd607568742d58aa8f81d4c611d3f0fb54fcd7ebf285cb7756d3681b'
//   );
//     console.log(result);
    
//     const result2 = await getContract(
//         'Messenger',
//         messengerAddress,
//         'verifyNoExt',
//         '0x0504db8f200758d506f9360cf644291f4b6d4e7826b4f45430b7329ac1e217e8',
//         '0x1d36f549a90d4c39596142a9114275de58e1401528a3920a6ffb58760c2816bc6fda4e857efd607568742d58aa8f81d4c611d3f0fb54fcd7ebf285cb7756d3681b'
//     );
//     console.log(result2)
  
//     const address = await getContract(
//         'Messenger',
//         messengerAddress,
//         'getPrimary'
//     );
//     console.log("address: ", address)
    
    const result = await callContract(
        'Messenger',
        messengerAddress,
        'sendMessage',
        '0x0405445e08a912f1d786266caa02e78111e281a9a5b788febbbf531cecc26e15'
    );
    console.log("result: ", result)


    const sender = await getContract(
        'Messenger',
        messengerAddress,
        'msgSender'
    );
    console.log("address1: ", sender)

    const sender2 = await getContract(
        'Messenger',
        messengerAddress,
        'msgSenderAddr'
    );
    console.log("address1: ", sender2)

    

})();
