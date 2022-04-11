
// console.log(block)
const selectElement = document.querySelector('#volume');
const ethereumButton = document.querySelector('.enableEthereumButton');
let currentAccount;
let purchase_transaction = "";
let claim_transaction = "";
let approve_transaction = "";

window.ethereum.on('accountsChanged', function (accounts) {
    getAccount()
})

selectElement.addEventListener('change', (event) => {
    let {value} = event.target
    const result = document.querySelector('#current_volume');
    const price = document.querySelector('#current_price');
    result.textContent = `${value}`;
    if (value == 1) { price.innerHTML = "0.03" }
    if (value == 2) { price.innerHTML = "0.06" }
    if (value == 3) { price.innerHTML = "0.9" }
    if (value == 4) { price.innerHTML = "0.12" }
    if (value == 5) { price.innerHTML = "0.15" }
});

ethereumButton.addEventListener('click', () => {
    getAccount()
})

async function getAccount() {
    const network = await web3Instance.eth.net.getId()
    if (network !== 137) { // rinkeby=4  matic=137 mumbai = 80001
        ethereumButton.innerHTML = "Switch to Polygon"
        return
    } else {
        console.log('connected to polygon')
        document.getElementById('my_wallet').hidden = false
        document.getElementById('buttonmeta').hidden = true

        document.getElementById('purchace_title').hidden = false
        document.getElementById('number_range').hidden = false
        document.getElementById('purchase_approve_buttons').hidden = false
        document.getElementById('currently_minting').hidden = false
        document.getElementById('hr_above_mint').hidden = false

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = accounts[0]
        var trimmedString = account.substring(0, 12);
        document.getElementById('address').innerHTML = trimmedString
        currentAccount = account

        const balance = await window.ethereum
        .request({
            method: 'eth_getBalance',
            params: [account, "latest"]
        })
    const read = parseInt(balance) / 10 ** 18
        const fixedDecimals = read.toFixed(3)
        document.getElementById('matic_balance').innerHTML = fixedDecimals
    let _wethBalace, _gotchis, _totalSupply, _allowance
        _allowance = promisify(allowance_ => WETH_Contract.methods.allowance(currentAccount, GENESIS_EGG_address).call(allowance_))
        _wethBalace = promisify(wethBalace_ => WETH_Contract.methods.balanceOf(currentAccount).call(wethBalace_))
        _gotchis = promisify(gotchis_ => GENESIS_EGG_Contract.methods.getOwnersTokenIds(currentAccount).call(gotchis_))
        _totalSupply = promisify(totalSupply_ => GENESIS_EGG_Contract.methods.totalSupply().call(totalSupply_))
        Promise.all([_wethBalace, _gotchis, _totalSupply, _allowance]).then(function ([wethBalace, gotchis, totalSupply, allowance]) {
            console.log(gotchis)
            const wETHbalance = parseInt(wethBalace) / 10 ** 18
            document.getElementById('weth_balance').innerHTML = wETHbalance
            // let gotchiArray = []
            document.getElementById("token_numbers_body").innerHTML = ""
            if (gotchis.length != 0) {
                document.getElementById("egg_explination").hidden = false
                document.getElementById("egg_title").hidden = false
            } else  {
                document.getElementById("egg_explination").hidden = true
                document.getElementById("egg_title").hidden = true
            }
            for (i = 0; i < gotchis.length; i++) {
                // gotchiArray[0] = ""
                let div;
                if (i == gotchis.length - 1) {
                    div = "<a target='_blank' href='https://opensea.io/assets/matic/" + GENESIS_EGG_address + "/" + gotchis[i] + "'>" + gotchis[i] + "</a>"
                } else {

                    div = "<a target='_blank' href='https://opensea.io/assets/matic/" + GENESIS_EGG_address + "/" + gotchis[i] + "'>" + gotchis[i] + "</a>, "
                }
                document.getElementById("token_numbers_body").innerHTML += div;
            }

            // check allowance
            console.log(allowance)
            if (allowance >= 175000000000000000) {
                document.getElementById('purchase_button').hidden = false
                document.getElementById('approve_button').hidden = true
            } else {
                document.getElementById('purchase_button').hidden = true
                document.getElementById('approve_button').hidden = false
            }

            const rainbow_image = document.getElementById('rainbow_image')
            const flight_image = document.getElementById('flight_image')
            const death_star_image = document.getElementById('death_star_image')

            // set sold gotchis
            // const fakeTotalSupply = 1050
            if (totalSupply < 250) {
                document.getElementById("minted_rainbow").innerHTML = 200 - (totalSupply-50) + " NFT's"
                document.getElementById("minted_flight").innerHTML = "300";
                document.getElementById("minted_deathstar").innerHTML = "200";

                document.getElementById("active_state_rainbow").style.color = "greenyellow";
                document.getElementById("active_state_flight").style.color = "grey";
                document.getElementById("active_state_deathstar").style.color = "grey";

                document.getElementById("active_state_rainbow").innerHTML = "Active";
                document.getElementById("active_state_flight").innerHTML = "Locked";
                document.getElementById("active_state_deathstar").innerHTML = "Locked";

                document.getElementById('currently_minting').innerHTML = 
                "<b>Currently Minting:</b> Rainbow Cryptogotchis with 700 Day Passes. There will only ever be 200 Rainbow Cryptogotchis in existence." +
                " There are <span> " + parseInt(200 - (totalSupply - 50)) + "</span>" +
                " Rainbow pets left until the First in Flight Cryptogotchi will be unlocked."

                rainbow_image.style.opacity = "100%"
                death_star_image.style.opacity = "50%"
                flight_image.style.opacity = "50%"
                
            }
            if (totalSupply >= 250 && totalSupply < 550) {
                document.getElementById("minted_rainbow").innerHTML = "0";
                document.getElementById("minted_flight").innerHTML = 300 - (totalSupply - 250) + " NFT's"
                document.getElementById("minted_deathstar").innerHTML = "200";

                document.getElementById("active_state_rainbow").style.color = "red";
                document.getElementById("active_state_flight").style.color = "greenyellow";
                document.getElementById("active_state_deathstar").style.color = "grey";

                document.getElementById("active_state_rainbow").innerHTML = "Sold Out";
                document.getElementById("active_state_flight").innerHTML = "Active";
                document.getElementById("active_state_deathstar").innerHTML = "Locked";

                document.getElementById('currently_minting').innerHTML =
                    "<b>Currently Minting:</b> First in Flight Cryptogotchis with 600 Day Passes. There will only ever be 300 Rainbow Cryptogotchis in existence." +
                    " There are <span> " + parseInt(300 - (totalSupply - 250)) + "</span>" +
                    " First in Flight pets left until the Death Star Cryptogotchi will be unlocked."

                flight_image.style.opacity = "100%"
                rainbow_image.style.opacity = "50%"
                death_star_image.style.opacity = "50%"
            }
            if (totalSupply >= 550 && totalSupply < 1050) {
                document.getElementById("minted_rainbow").innerHTML = "0";
                document.getElementById("minted_flight").innerHTML = "0";
                document.getElementById("minted_deathstar").innerHTML = 500 - (totalSupply - 550) + " NFT's"

                document.getElementById("active_state_rainbow").style.color = "red";
                document.getElementById("active_state_flight").style.color = "red";
                document.getElementById("active_state_deathstar").style.color = "greenyellow";

                document.getElementById('currently_minting').innerHTML =
                    "<b>Currently Minting:</b> Death Star Cryptogotchis with 500 Day Passes. There will only ever be 500 Rainbow Cryptogotchis in existence." +
                " There are <span> " + parseInt(500 - (totalSupply - 550)) + "</span>" +
                    " These are the last Genesis Eggs ever to be minted."

                document.getElementById("active_state_rainbow").innerHTML = "Sold Out";
                document.getElementById("active_state_flight").innerHTML = "Sold Out";
                document.getElementById("active_state_deathstar").innerHTML = "Active";
                
                death_star_image.style.opacity = "100%"
                rainbow_image.style.opacity = "50%"
                flight_image.style.opacity = "50%"
            }
            if (totalSupply == 1050) {
                document.getElementById("minted_rainbow").innerHTML = "0";
                document.getElementById("minted_flight").innerHTML = "0";
                document.getElementById("minted_deathstar").innerHTML = "0";

                document.getElementById("active_state_rainbow").style.color = "red";
                document.getElementById("active_state_flight").style.color = "red";
                document.getElementById("active_state_deathstar").style.color = "red";

                document.getElementById('currently_minting').innerHTML = "All Genesis Eggs Minted!!"

                document.getElementById("active_state_rainbow").innerHTML = "Sold Out";
                document.getElementById("active_state_flight").innerHTML = "Sold Out";
                document.getElementById("active_state_deathstar").innerHTML = "Sold Out";


                rainbow_image.style.opacity = "50%"
                flight_image.style.opacity = "50%"
                death_star_image.style.opacity = "50%"
                document.getElementById("purchase_button").disabled = true;
                document.getElementById("approve_button").disabled = true;
            }
        })
    }
}


function claim() {
    const tokenId = document.getElementById("claim_input").value
    GENESIS_EGG_Contract.methods.claimCryptogotchi(tokenId).send({ from: currentAccount })
        .on('transactionHash', tx => {
            console.log("Transaction", tx)
            claim_transaction = tx
            document.getElementById('claim_button').disabled = true
            document.getElementById('claim_button').innerHTML =
                '<div class="spinner-border spinner-border-sm" role="status">' +
                '<span class="sr-only">Loading...</span>' +
                '</div>'
        })
        .then(receipt => {
            // console.log('Mined', receipt)
            if (receipt.status == '0x1' || receipt.status == 1) {
                console.log('Transaction Successful callback')
                document.getElementById('claim_button').innerHTML = "Success!"
                getAccount()
                setTimeout(function () {
                    document.getElementById('claim_button').innerHTML = "Claim"
                    return
                }, 3000);
                document.getElementById('claim_button').disabled = false
            }
            else {
                console.log('Transaction Failed')
                document.getElementById('claim_button').innerHTML = "Failed!"
                setTimeout(function () {
                    document.getElementById('claim_button').innerHTML = "Claim"
                    return
                }, 3000);
            }
        })
        .catch(err => {
            console.log('Error', err)
        })
        .finally(() => {
            console.log('claim function finished')
            return
        })
}
function approve() {
    WETH_Contract.methods.approve(GENESIS_EGG_address, "2000000000000000000").send({ from: currentAccount })
        .on('transactionHash', tx => {
            console.log("Transaction", tx)
            approve_transaction = tx
            document.getElementById('approve_button').disabled = true
            document.getElementById('approve_button').innerHTML =
                '<div class="spinner-border spinner-border-sm" role="status">' +
                '<span class="sr-only">Loading...</span>' +
                '</div>'
        })
        .then(receipt => {
            // console.log('Mined', receipt)
            if (receipt.status == '0x1' || receipt.status == 1) {
                console.log('Transaction Successful')
                document.getElementById('approve_button').innerHTML = "Approve"
                document.getElementById('approve_button').hidden = true
                document.getElementById('purchase_button').hidden = false
            }
            else {
                console.log('Transaction Failed')
                document.getElementById('approve_button').innerHTML = "Failed!"
                setTimeout(function () {
                    document.getElementById('approve_button').innerHTML = "Approve"
                    return
                }, 3000);
            }
        })
        .catch(err => {
            console.log('Error', err)
        })
        .finally(() => {
            console.log('approve function finished')
            return
        })
}
function purchase() {
    const amount = document.getElementById("volume").value
    console.log(amount)
    GENESIS_EGG_Contract.methods.mintNFT(amount).send({ from: currentAccount })
        .on('transactionHash', tx => {
            console.log("Transaction", tx)
            purchase_transaction = tx;

            document.getElementById('external_transaction').hidden = false
            document.getElementById('external_transaction').innerHTML = "<a target='_blank' href='https://polygonscan.com/tx/" + purchase_transaction + "'>View Transaction</a>"

            document.getElementById('purchase_button').disabled = true
            document.getElementById('purchase_button').innerHTML =
                '<div class="spinner-border spinner-border-sm" role="status">' +
                '<span class="sr-only">Loading...</span>' +
                '</div>'
        })
        .then(receipt => {
            // console.log('Mined', receipt)
            if (receipt.status == '0x1' || receipt.status == 1) {
                console.log('Transaction Successful')
                document.getElementById('purchase_button').innerHTML = "Purchase"
                document.getElementById('purchase_button').disabled = false
                getAccount()
            }
            else {
                console.log('Transaction Failed')
                document.getElementById('purchase_button').innerHTML = "Failed!"
                setTimeout(function () {
                    document.getElementById('purchase_button').innerHTML = "Purchase"
                    return
                }, 3000);
            }
        })
        .catch(err => {
            console.log('Error', err)
        })
        .finally(() => {
            console.log('Purchase function finished')
            return
        })
}

let options = {
    fromBlock: null,
    address: [],  
    topics: [null] 
};

const wss3 = new Web3(new Web3.providers.WebsocketProvider('wss://ws-matic-mainnet.chainstacklabs.com'));

wss3.eth.subscribe('logs', options, function (error, result) {})
    .on("data", function (data) {
        if (data.transactionHash == purchase_transaction) {
            console.log(data)
            purchase_transaction = ''
            document.getElementById('purchase_button').innerHTML = "Success!"
            setTimeout(function () {
                // getAccount()
                document.getElementById('purchase_button').disabled = false
                document.getElementById('purchase_button').innerHTML = "Purchase"
                return
            }, 5000);
            setTimeout(function () {
                getAccount()
            }, 15000);
        }
        if (data.transactionHash == approve_transaction) {
            console.log(data, 'approve data from subscription')
            approve_transaction = ''
            document.getElementById('approve_button').innerHTML = "Approve"
            document.getElementById('approve_button').hidden = true
            document.getElementById('purchase_button').hidden = false
        }
    })