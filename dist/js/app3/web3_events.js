
window.ethereum.on('accountsChanged', function (accounts) {
    arrayOfDataObjects = []
    iteration = undefined
    tokenId = undefined
    document.getElementById("token_numbers_body").innerHTML = ""
    timeUntilNextFeeding.innerHTML = "&nbsp;"
    document.getElementById("token_numbers").hidden = true
    document.getElementById("enableMeta").hidden = false

    $('#image').attr("src", "./../../assets/images/Blobs2/states/egg.gif")
    feedButton.hidden = true
    hatchButton.hidden = true
    playButtonDiv.hidden = true

    // feed_row.hidden = true;
    play_row.hidden = false;
    // pass_row.hidden = true;
    normal_hatch_info.hidden = true
    initial_hatch_info.hidden = true
    playTimer.stop()
    feedTimer.stop()

    setTempData("")

    // getAccount()
})

window.ethereum.on('networkChanged', function (networkId) {
    console.log('networkChanged', networkId);
    const stringNetworkId = networkId.toString()
    if (stringNetworkId !== "4") {
        // console.log(false)
        buy_ppet_button.hidden = true;
        purchaseButtonDiv.hidden = true;

        feed_row.hidden = true;
        play_row.hidden = true;
        pass_row.hidden = true;

        // console.log('wrong network, stopping counters, awaiting new data')
        arrayOfDataObjects = []
        iteration = ''
        tokenId = ''
        document.getElementById("token_numbers_body").innerHTML = ""
        document.getElementById("token_numbers").hidden = true
        document.getElementById("enableMeta").hidden = true
        $('#image').attr("src", "./../../assets/images/Blobs2/states/egg.gif")
        error_message_div.hidden = false
        // tokenID = undefined
        // tempTokenId = undefined
        // setTempData("Wrong Network")
    }
    if (stringNetworkId === "4") {
        // console.log(true)
        buy_ppet_button.hidden = false;
        if (typeof (networkId) === typeof (0)) {
            // console.log("network id is a number")
            purchaseButtonDiv.hidden = true;
        } else {
            purchaseButtonDiv.hidden = false;
            // console.log('getting data after network changed')
        }
        tokenID = undefined
        // tempTokenId = undefined
        // feed_row.hidden = false;
        // play_row.hidden = false;
        // pass_row.hidden = false;
        // console.log('correct network')
        error_message_div.hidden = true
        document.getElementById("enableMeta").hidden = false

        // setTempData("Load Account")


    }
    
});

async function getNetworkId() {
    const network = await web3Instance.eth.net.getId()
    const stringNetworkId = network.toString()
    // console.log(typeof(network.toString()), "network id type")
    if (stringNetworkId !== "4") {
        // console.log(false)
        buy_ppet_button.hidden = true;
        purchaseButtonDiv.hidden = true;

        feed_row.hidden = true;
        play_row.hidden = true;
        pass_row.hidden = true;

        // console.log('wrong network, stopping counters, awaiting new data')
        arrayOfDataObjects = []
        iteration = ''
        tokenId = ''
        document.getElementById("token_numbers_body").innerHTML = ""
        document.getElementById("token_numbers").hidden = true
        document.getElementById("enableMeta").hidden = true
        $('#image').attr("src", "./../../assets/images/Blobs2/states/egg.gif")
        error_message_div.hidden = false
        tokenID = undefined
        tempTokenId = undefined
        // setTempData("Wrong Network")
    }
    if (stringNetworkId === "4") {
        // console.log(true)
        buy_ppet_button.hidden = false;
        if (typeof (networkId) === typeof (0)) {
            // console.log("network id is a number")
            purchaseButtonDiv.hidden = true;
        } else {
            purchaseButtonDiv.hidden = false;
            // console.log('getting data after network changed')
        }
        tokenID = undefined
        // tempTokenId = undefined
        // feed_row.hidden = false;
        // play_row.hidden = false;
        // pass_row.hidden = false;
        // console.log('correct network')
        error_message_div.hidden = true
        document.getElementById("enableMeta").hidden = false

        // setTempData("Load Account")


    }
}
getNetworkId()