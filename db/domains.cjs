globalThis._ = { 'www': { 'publicKeys': { 'encryption': ``, 'signing': `` }, 'status': `active` }, 'aral': { 'publicKeys': { 'encryption': ``, 'signing': `` }, 'status': `active` }, 'laura': { 'publicKeys': { 'encryption': ``, 'signing': `` }, 'status': `active` }, 'haluk': { 'publicKeys': { 'encryption': ``, 'signing': `` }, 'status': `active` }, 'mehlika': { 'publicKeys': { 'encryption': ``, 'signing': `` }, 'status': `active` }, 'oskar': { 'publicKeys': { 'encryption': ``, 'signing': `` }, 'status': `active` }, 'margo': { 'publicKeys': { 'encryption': ``, 'signing': `` }, 'status': `active` }, 'moo': { 'publicKeys': { 'encryption': ``, 'signing': `` }, 'status': `active` }, 'test-20210602-1117': { 'publicKeys': { 'signing': `302865fe443c6367866d2cf8aab5f7d73825ed201ee5b5af8291268d92b69d39`, 'encryption': `559ce91d56b778c3d8679e0140ef9072a8c877312ac012efe93aa5009ccae331` }, 'status': `active` }, 'tue-test': { 'publicKeys': { 'signing': `7ce2c70494c8409686c64f850e71353b0e8485c035b324542ac3ee5ec9fa2434`, 'encryption': `a7370f220fcd436cb7ea124ebd0ded43fbd429e305003a125aab0930d2e0d555` }, 'status': `active` }, 'owncast': { 'publicKeys': { 'signing': `23ddb78eb2c7b4afafd57fec3bd1e28b9111b3deee482c91d639eadbd74fb194`, 'encryption': `ef710cd7b85e921c507a700a9b4175da7a1237222fd590312f16590d5994b960` }, 'status': `active` }, 'thu-jun-17': { 'publicKeys': { 'signing': `d55f4b0156427c731746ed3cb96c070f65322a23afb201b78251d6530390d54a`, 'encryption': `a0d9096d989db7efe0c4a81d17d3522632582269241c726e63675426e1a68b09` }, 'status': `active` }, 'thu-owncast': { 'publicKeys': { 'signing': `94df185278c9c280cf19a1563a07b65a71539bf0d2d867e475d72e01c154c581`, 'encryption': `16ad27222a20aa031e14f36d2bff8b44aed62ab039d7c9b35c885706cf58cf28` }, 'status': `setup-domain-created` }, 'thu-jun-17-owncast': { 'publicKeys': { 'signing': `fbe5e47a05ee4354f76baf7c301cdd1bee8aa1a813928abe0792bb3e266ff72a`, 'encryption': `5faecdfb6058a51f132bef56c02fd82cb48965095440fca397c93cba46f6041b` }, 'status': `active` }, 'small-is-beautiful': { 'publicKeys': { 'signing': `2153ad794e789132c958f3229e766325aa62fde90edf9a43ee8d03b565d08d20`, 'encryption': `42b3ce5d4913b9ffef3970b1e4d1008270bd9be5d59ac11e2b3a5114e73ff56d` }, 'status': `active` }, 'smallcast': { 'publicKeys': { 'signing': `a5baf0ddbee860002382f882d9c1b449aaf2ef940ca504190805d35ceab7aff1`, 'encryption': `4ed3287eac44f1c46c15adf093ad37a3c0a5f1bb0c26dd03eef1c271cb29c603` }, 'status': `active` }, 'owncast-small-is-beautiful': { 'publicKeys': { 'signing': `8488b356f9fbdfd60ad687a4e0faa888ee9dd13b5e65eef72c87d879183d81b4`, 'encryption': `42148e9199773f8fa1781a3073ba126060819611cce02f42a4b91ff20cbcba00` }, 'status': `active` }, 'tue-jun-22-1557': { 'publicKeys': { 'signing': `9776dab8ab2c3b7fe96079857f0b5597f5bbff4a3acc598b4a03b9167ad836f6`, 'encryption': `e28c21b4c2349a6bc4a910ae3aba0f778021cd778de367f0a97b6982850bf44b` }, 'status': `active` }, 'tue-jun-22-1605': { 'publicKeys': { 'signing': `7874407182770eb55ad47ff420dcb6ae68e54159ef234c886787d5c7aadb0831`, 'encryption': `d116a64c0d5b1ade81609859dbb3be53a0773777c0aad0f1ba81b9a09a479a3d` }, 'status': `active` }, 'wed-jun-23-1952': { 'publicKeys': { 'signing': `9a4627da00ec3ab9c0beb58518f4e353c8a07a799f9a3118f08d30d316e8c17f`, 'encryption': `878d29c428d1dbe2c7af38eb9eaf547a6f52c3118a78e0ed1384452b0584294a` }, 'status': `active` }, 'thu-jun-24-2021-1007': { 'publicKeys': { 'signing': `3ae7dfc7dff1c164687d0ec71ff84558b5dba0bb63d0572bcdf34769658d8b24`, 'encryption': `3ca7c576d99c88bca7f710332e57612b94fe97aa966d4f8df98315417b305d64` }, 'status': `setup-vps-created` }, 'thu-jun-24-2021-1015': { 'publicKeys': { 'signing': `e64255b472cad38f0753b6a03924ac14909aa7511b16dd8ec37aadd23b37e5a0`, 'encryption': `e0511c70cb45113056334949128480614d1d543e91b2599a6aea0780115b350d` }, 'status': `active` } };
(function () { if (typeof define === 'function' && define.amd) { define([], globalThis._); } else if (typeof module === 'object' && module.exports) { module.exports = globalThis._ } else { globalThis.domains = globalThis._ } })();