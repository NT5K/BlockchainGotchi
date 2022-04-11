
// const updateOpensea = id => {
//     const URL = '/test/' + CRYPTOGOTCHI_address + '/' + id
//     axios.get(URL).then(
//         function (response) {
//             console.log(response, " updated on opensea")
//             return;
//         }
//     )
// }

CRYPTOGOTCHI_Contract.events.Minted({fromBlock: "latest"})
    .on("connected", function (subscriptionId) {
        console.log('callback')
        console.log(subscriptionId);
        return;
    })
    .on('data', function (event) {
        if (event.transactionHash.toUpperCase() === mint_transaction.toUpperCase()) {
            mint_transaction = ''
            console.log('data')
            console.log(event); // same results as the optional callback above
            // updateOpensea(event.returnValues.NewTokenId)
            const { newTokenId, mintType, owner } = event.returnValues;
            document.getElementById('purchaseButton_Button').innerHTML = "Purchase Device"
            document.getElementById('purchaseButton_Button_in_body').innerHTML = "Purchase Device"
            document.getElementById('purchase_button_in_body').hidden = true

            document.getElementById("justPurchasedTokenId").hidden = false
            document.getElementById("justPurchasedTokenId").innerHTML = "Cryptogotchi Minted! <br><code>NFT ID#</code> <span style='color:yellow;'>" + newTokenId + "</span>"

            arrayOfDataObjects = []
            getAccount()
            enableButtons()
            return
        }
    })
    .on('changed', function (event) {
        // remove event from local database
    })
    .on('error', function (error, receipt) { // If the 
});

CRYPTOGOTCHI_Contract.events.PassPurchased({ fromBlock: "latest" })
    .on("connected", function (subscriptionId) {
        console.log('callback')
        console.log(subscriptionId);
        return;
    })
    .on('data', function (event) {
        if (event.transactionHash.toUpperCase() === purchase_transaction.toUpperCase()) {
            purchase_transaction = ''
            console.log('data: ', event); // same results as the optional callback above
            document.getElementById('purchaseButton').innerHTML = "Success!"
            updateOnlyUnitAndTokenURIObject(tokenId, iteration)
            enableButtons()
            setTimeout(function () {
                document.getElementById('purchaseButton').disabled = false
                document.getElementById('purchaseButton').innerHTML = "Purchase"
                return
            }, 5000);
        }
        return
    })
    .on('changed', function (event) {
        // remove event from local database
    })
    .on('error', function (error, receipt) { // If the 
});

CRYPTOGOTCHI_Contract.events.RandomNumberRequest({ fromBlock: "latest" })
    .on("connected", function (subscriptionId) {
        console.log('callback')
        console.log(subscriptionId);
        return;
    })
    .on('data', function (event) {
        if (event.transactionHash.toUpperCase() === hatch_transaction.toUpperCase()) {
            hatch_transaction = ''
            console.log('data: ', event); // same results as the optional callback above
            dateOfNextFeeding.innerHTML = "Choosing Color"
            timeUntilNextFeeding.innerHTML = "Please Wait While Getting Data"
            document.getElementById('nextGeneration').innerHTML = "Getting Data"
            document.getElementById('nextAvailablePlay').innerHTML = "Getting Data"
            document.getElementById('initial_hatch_info').innerHTML = 
            '<p>' +
                'Your feed time is set! Choosing a random color and pet type now...</p>' +
                '<p>Please wait up to 5 minutes before attempting to refresh page to allow time for Chainlink to return a random number.' +
            '</p>' +
            '<h6>Odds:</h6>' +
            '<div class="row text-center justify-content-between">' +
                '<div class="col-12 col-md-6">' +
                    '<table class="table" style = "color: white;" >' +
                        '<tbody class="">' +
                            '<tr id="">' +
                                '<th scope="row" class="w-50" style="color: purple;background-color: black;">Purple<span style="color: white;"> = 40%</span></th>' +
                                '<td id="" class="w-50">Ghost = 40%</td>' +
                            '</tr>' +
                            '<tr id="">' +
                                '<th scope="row" class="w-50" style="color:#00ff00;background-color: black;">Green<span style="color: white;"> = 30%</span></th>' +
                                '<td id="" class="w-50">Worm = 30%</td>' +
                            '</tr>' +
                            '<tr id="">' +
                                '<th scope="row" style="color: orange;background-color: black;">Orange<span style="color: white;"> = 15%</span></th>' +
                                '<td id="">Creature = 15%</td>' +
                            '</tr>' +
                            '<tr id=" class="">' +
                                '<th scope="row" class="w-50" style="color: blue;background-color: black;">Blue<span style="color: white;"> = 10%</span></th>' +
                                '<td id="" class="w-50">Walrus = 10%</td>' +
                            '</tr>' +
                            '<tr id="">' +
                                '<th scope="row" class="w-50" style="color: yellow;background-color: black;">Yellow<span style="color: white;"> = 5%</span></th>' +
                                '<td id="" class="w-50">Dragon = 5%</td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table >' +
                '</div>' +
            '</div>'
            return
        }
        return
    })
    .on('changed', function (event) {
        // remove event from local database
    })
    .on('error', function (error, receipt) { // If the 
});

CRYPTOGOTCHI_Contract.events.Hatched({ fromBlock: "latest" })
    .on("connected", function (subscriptionId) {
        console.log('callback')
        console.log(subscriptionId);
        return;
    })
    .on('data', function (event) {
        if (event.transactionHash.toUpperCase() === hatch_transaction.toUpperCase()) {
            hatch_transaction = ''
            console.log('data: ', event); // same results as the optional callback above
            // const btn = document.getElementById(tokenId)
            // console.log(btn)
            // updateOpensea(event.returnValues.NewTokenId)
            enableButtons()
            updateOnlyUnitAndTokenURIObject(tokenId, iteration)
            getAccount()
            document.getElementById('hatchButton').hidden = true
            document.getElementById('hatch_button').disabled = false
            document.getElementById('hatch_button').innerHTML = "Hatch"
            // btn.style.backgroundColor = "#0d6efd"
            document.getElementById('playButtonDiv').hidden = false
            return
        }
        return
    })
    .on('changed', function (event) {
        // remove event from local database
    })
    .on('error', function (error, receipt) { // If the 
});


let x;
CRYPTOGOTCHI_Contract.events.InitialHatch({ fromBlock: "latest" })
    .on("connected", function (subscriptionId) {
        console.log('callback')
        console.log(subscriptionId);
        return;
    })
    .on('data', function (event) {
        if (currentAccount.toUpperCase() === event.returnValues.tokenOwner.toUpperCase() && x) {
            x = false
        //    function (error, success) {
        //         if (success)
        //             console.log('Successfully unsubscribed!');
        //     }); InitialHatch.unsubscribe(
            console.log('data: ', event); // same results as the optional callback above
            // const btn = document.getElementById(tokenId)
            // console.log(btn)
            document.getElementById('hatchButton').hidden = true
            document.getElementById('hatch_button').disabled = false
            document.getElementById('hatch_button').innerHTML = "Hatch"
            document.getElementById('playButtonDiv').hidden = false
            document.getElementById('feedButton').hidden = false
            document.getElementById('initial_hatch_info').innerHTML = "<p>This is an initial hatch! The color of your Cryptogotchi will be selected at random. Hatching sets your pets daily required feeding time. Choose wisely!</p>"
            // btn.style.backgroundColor = "#0d6efd"

            enableButtons()
            updateOnlyUnitAndTokenURIObject(event.returnValues.tokenId, iteration)
            getAccount()

            // updateOpensea(event.returnValues.tokenId)
            return
        }
        return
    })
    .on('changed', function (event) {
        // remove event from local database
    })
    .on('error', function (error, receipt) { // If the 
});

CRYPTOGOTCHI_Contract.events.Revive({ fromBlock: "latest" })
    .on("connected", function (subscriptionId) {
        console.log('callback')
        console.log(subscriptionId);
        return;
    })
    .on('data', function (event) {
        if (event.transactionHash.toUpperCase() === revive_transaction.toUpperCase()) {
            revive_transaction = ''
            console.log('data: ', event); // same results as the optional callback above
            enableButtons()
            updateOnlyUnitAndTokenURIObject(event.returnValues.tokenId, iteration) 
            getAccount()
            document.getElementById('resetButton').hidden = true;
            document.getElementById('hatchButton').hidden = false;
            document.getElementById('resetAmount').innerHTML = "Revive"
            document.getElementById('hatch_button').innerHTML = "Hatch"
            resetAmount.hidden = false
            return
        }
        return
    })
    .on('changed', function (event) {
        // remove event from local database
    })
    .on('error', function (error, receipt) { // If the 
});

CRYPTOGOTCHI_Contract.events.RewardDistributed({ fromBlock: "latest" })
    .on("connected", function (subscriptionId) {
        console.log('callback')
        console.log(subscriptionId);
        return;
    })
    .on('data', function (event) {
        if (event.transactionHash.toUpperCase() === reward_transaction.toUpperCase()) {
            reward_transaction = ''
            console.log('data: ', event); // same results as the optional callback above
            document.getElementById('rewardWithdrawButton').innerHTML = "Success!"
            updateOnlyUnitAndTokenURIObject(tokenId, iteration)
            getAccount()
            // getAccount()
            enableButtons()
            resetAmount.disabled = false
            setTimeout(function () {
                document.getElementById('rewardWithdrawButton').innerHTML = "Redeem Accumulated BYTE Tokens"
                document.getElementById('rewardWithdrawButton').hidden = true
                return;
            }, 5000);
        }
        return
    })
    .on('changed', function (event) {
        // remove event from local database
    })
    .on('error', function (error, receipt) { // If the 
    });