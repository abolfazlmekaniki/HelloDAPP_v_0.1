web3Provider = null;
contracts = {};
url = "http://127.0.0.1:7545";
currentAccount = null;
owner = null;
$(function(){
    $(window).load(function(){
        init();
        
    });
});

function init() {
    // راه اندازی اولیه پروژه
    return initWeb3();
}

async function initWeb3() {
    const provider = await detectEthereumProvider()
    if (!provider) {
        // handle no provider
        alert('Please install and login to Metamask!');
        return;
    }

    // اتصال به شبکه بلاکچین
    if(typeof web3 !== 'undefined') {
        // یک اتصال فعال به بلاکچین وجود دارد
        web3Provider = provider;
    } else {
        web3Provider = new Web3.providers.HttpProvider(url);
    }

    web3 = new Web3(web3Provider);

    ethereum.on('accountsChanged', handleAccountChanged);
    ethereum.on('chainChanged', handleChainChanged);

    // ست کردن اکانت پیش فرض
    handleAccountChanged();

    // پر کردن آدرس اکانت ها
    populateAddresses();

    return initContract();
}

function handleAccountChanged() {
    ethereum.request({method: 'eth_requestAccounts'}).then(function(accounts) {
        currentAccount = accounts[0];
        web3.eth.defaultAccount = currentAccount;
        setCurrentAccount();
        console.log('Account Changed: ', currentAccount);
    });
}

async function handleChainChanged() {
    // رفرش کردن صفحه
    window.location.reload();
}

function setCurrentAccount() {
    $('#current_account').text("Current Account: " + currentAccount);
}

function populateAddresses() {
    // اگر از وب3 موجود استفاده کنیم فقط اکانت کانکت شده به سایت را نشان خواهد داد
    web3 = new Web3(new Web3.providers.HttpProvider(url));
    web3.eth.getAccounts(function(err, accounts){
        //console.log(accounts);
        jQuery.each(accounts, function(idx){
            //console.log(accounts[idx]);
            var tag = '<option value="' + accounts[idx] + '">' + accounts[idx] + '</option>';

            $('#enter_address').append(tag);
            $('#enter_buy_address').append(tag);
        });
    });
}


function initContract() {
    $.getJSON('Hello.json', function(artifact){
        var lottoryArtifact = artifact;
        contracts.Hello = TruffleContract(lottoryArtifact);
        contracts.Hello.setProvider(web3Provider);
    }).then(function(){
        setCurrentAccount();
    });
    
    return bindEvents();
}

// function getOwner() {
//     var lottoryInstance;
//     contracts.lottory.deployed().then(function(instance){
//         lottoryInstance = instance;
//         return lottoryInstance.owner();
//     }).then(function(result){
//         owner = result;
//         $('#owner').text("Owner: " + owner);
//     });
// }

// function toEth(value) {
//     return value.toNumber()/Math.pow(10,18);
// }

function bindEvents() {
    $(document).on('click', '#HELLO', _show_winner);

}

// function _register() {
//     if($('#enter_address').val() == "") {
//         alert('Please select an Address!');
//         return false;
//     }
//     var lottoryInstance;
//     contracts.lottory.deployed().then(function(instance){
//         lottoryInstance = instance;
//         var addr2 = $('#buy_T').text();
//         var txObj={

//             from : currentAccount,

//             gas : 500000
//     }
//         return lottoryInstance.register(addr2,txObj);
//     }).then(function(result){
//         console.log("result is :", result);
//     });
// }

// function _buy__ticket() {
//     if($('#enter_buy_address').val() == "") {
//         alert('Please enter all fields!');
//         return false;
//     }
//     var lotooryInstance;
//     contracts.lottory.deployed().then(function(instance){
//         lottoryInstance = instance;
//         var addr = $('#enter_buy_address').val();
//         var txObj={

//                 from : addr,
//                 value: 3e18,
//                 gas: 500000
//         }
//         return lottoryInstance.buy__ticket(txObj);
//     }).then(function(result){
//         //console.log(result);
//         var status = '';
//         if(result.receipt.status == '0x1')
//             status = 'Success';
//         else if(result.receipt.status == '0x0')
//             status = 'Failure';
//         console.log('buy_Token(): ', status);
//     }).catch(function(err){
//         alert(err.message);
//     });
// }

/*
                            ----- result :  {tx, receipt, logs} ----
{
    "tx": "0xd33f628463e08ebfbec0652d69f09c7391db34e180ed527c82f7b78a1904f955",
    "receipt": {
        "transactionHash": "0xd33f628463e08ebfbec0652d69f09c7391db34e180ed527c82f7b78a1904f955",
        "transactionIndex": 0,
        "blockHash": "0x949cd39f0b389025d30e13cf892988279b422123768a343497149cd3597b98c7",
        "blockNumber": 5,
        "from": "0xa6f4789fcb1632859ab33920f117d7afe7446959",
        "to": "0x81dae0c132d9b9216f60de082a3834eb0024351f",
        "gasUsed": 52204,
        "cumulativeGasUsed": 52204,
        "contractAddress": null,
        "logs": [
            {
                "logIndex": 0,
                "transactionIndex": 0,
                "transactionHash": "0xd33f628463e08ebfbec0652d69f09c7391db34e180ed527c82f7b78a1904f955",
                "blockHash": "0x949cd39f0b389025d30e13cf892988279b422123768a343497149cd3597b98c7",
                "blockNumber": 5,
                "address": "0x81dae0c132d9b9216f60de082a3834eb0024351f",
                "data": "0x",
                "topics": [
                    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                    "0x0000000000000000000000000000000000000000000000000000000000000000",
                    "0x000000000000000000000000f5ee36fd0ff286fb4dea0d33e07e680144ac7145",
                    "0x00000000000000000000000000000000000000000000000000000000000003e8"
                ],
                "type": "mined"
            }
        ],
        "status": "0x1",
        "logsBloom": "0x00000000000000000000000020000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000008000000000000000000000000000000000000000000000000020000000000000000000800000000000000000000000010000000000000000200040000000000000000000000000000000040000000000000000000000a00000000000000000000000000000000004000000000000000000000000000000002000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000"
    },
    "logs": [
        {
            "logIndex": 0,
            "transactionIndex": 0,
            "transactionHash": "0xd33f628463e08ebfbec0652d69f09c7391db34e180ed527c82f7b78a1904f955",
            "blockHash": "0x949cd39f0b389025d30e13cf892988279b422123768a343497149cd3597b98c7",
            "blockNumber": 5,
            "address": "0x81dae0c132d9b9216f60de082a3834eb0024351f",
            "type": "mined",
            "event": "Transfer",
            "args": {
                "From_address": "0x0000000000000000000000000000000000000000",
                "To_address": "0xf5ee36fd0ff286fb4dea0d33e07e680144ac7145",
                "amount": "1000"
            }
        }
    ]
}
*/

// function _lot_start() {
//     var lottoryInstance;
//     contracts.lottory.deployed().then(function(instance){
//         lottoryInstance = instance;
//         var txObj={

//             from : currentAccount,

//             gas : 500000
//     }
//         return lottoryInstance.lot_start(txObj);
//     }).then(function(result){
//         console.log("result is :", result);
//     });
// }

function _show_winner() {
    // console.log("result is :");
    var lottoryInstance;
    contracts.Hello.deployed().then(function(instance){
        lottoryInstance = instance;
        return lottoryInstance.name();
    }).then(function(result){
        console.log("result is :", result);
        $('#display_winner').text( result);
    });
}


