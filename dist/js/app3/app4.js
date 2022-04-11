
let arrayOfDataObjects = []

const refreshAccount = () => {
    console.log('refresh account')
    getAccount()
    disableButtons2()
}

// var resetTimer = new easytimer.Timer();
$("#refresh_button").on('click', function () {
    refreshAccount()
});



// resetTimer.addEventListener('secondsUpdated', function (e) {
//     seconds = resetTimer.getTimeValues().seconds
//     if (seconds !== 0) {
//         document.getElementById('refresh_countdown').innerHTML =  60 - seconds
//         return
//     }
// })

ethereumButton.addEventListener('click', () => {
    document.getElementById('enableMeta').hidden = true
    console.log('getting account')
    // feed_row.hidden = true
    // play_row.hidden = true
    // pass_row.hidden = true
    // updateOnlyButtonColors() 
    getAccount()
})
let tempTokenId;
const loadNFTData =(tokenID) => {
    // console.log('load data function')
    if (tokenId === undefined) {
        // console.log('undefinied token id, initial click')
        tempTokenId = tokenID
        document.getElementById(tokenID).style.borderColor = "white"

    } else {
        // console.log(typeof(tokenID), typeof(tempTokenId))
        if (tokenID !== tempTokenId) {
            document.getElementById(tempTokenId).style.borderColor = "#3E4145"
            tempTokenId = tokenID
        }
        document.getElementById(tempTokenId).style.borderColor = "white"
    }
    tokenId = tokenID;
    console.log('set token id')
    // console.log(typeof(tokenId))
    document.getElementById('nextAvailablePlay').innerHTML = "&nbsp;"
    document.getElementById('sidebar_device_info_div').hidden = false

    loadDataFromArrayOfData(tokenID)
    openseaLink.innerHTML = "<a href='https://testnets.opensea.io/assets/" + CRYPTOGOTCHI_address + "/" + tokenID + "' target='_blank'>View on OpenSea</a><br>"
    document.getElementById('NFT_ID_NUMBER').innerHTML = tokenID
}

function disableButtons2() {
    document.getElementById('refresh_button').hidden = true
    document.getElementById('refresh_countdown').hidden = false
    setTimeout(function () {
        document.getElementById('refresh_button').hidden = false
        document.getElementById('refresh_countdown').hidden = true
    }, 60000); // every 5 seconds update account

}
async function getAccount() {
    const network = await web3Instance.eth.net.getId()
    console.log(network)
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = accounts[0]
    console.log('account: ', account)
    currentAccount = account
    console.log('currentAccount: ', currentAccount)

    const balance = await window.ethereum
        .request({
            method: 'eth_getBalance',
            params: [account, "latest"]
        })
    const read = parseInt(balance) / 10 ** 18
    // console.log(tokenId," tokenid")
    let _ownerIds, _isApprovedFor, _tokenBalance, _feedBatch, _playBatch, _prestigeBatch, _rewardBatch
    _ownerIds = promisify(ownerIds_ => CRYPTOGOTCHI_Contract.methods.getOwnersTokenIds(currentAccount).call(ownerIds_))
    _feedBatch = promisify(feedBatch_ => CRYPTOGOTCHI_Contract.methods.returnReadyTokens(1, account).call(feedBatch_))
    _playBatch = promisify(playBatch_ => CRYPTOGOTCHI_Contract.methods.returnReadyTokens(2, account).call(playBatch_))
    _prestigeBatch = promisify(prestigeBatch_ => CRYPTOGOTCHI_Contract.methods.returnReadyTokens(3, account).call(prestigeBatch_))
    _rewardBatch = promisify(rewardBatch_ => CRYPTOGOTCHI_Contract.methods.returnReadyTokens(4, account).call(rewardBatch_))
    _isApprovedFor = promisify(isApprovedFor_ => QSM_Contract.methods.allowance(currentAccount, CRYPTOGOTCHI_address).call(isApprovedFor_))
    _tokenBalance = promisify(tokenBalance_ => QSM_Contract.methods.balanceOf(currentAccount).call(tokenBalance_))
    Promise.all([_ownerIds, _isApprovedFor, _tokenBalance, _feedBatch, _playBatch, _prestigeBatch, _rewardBatch])
        .then(function ([ownerIds, isApprovedFor, tokenBalance , feedBatch, playBatch, prestigeBatch, rewardBatch]) {
        

        let feedDisplayArray = []
        let playDisplayArray = []
        let prestigeDisplayArray = []
        let rewardDisplayArray = []
        console.log(ownerIds, " owner id's")
            console.log(feedBatch, playBatch, prestigeBatch, rewardBatch)
        const formattedBalance = Web3.utils.fromWei(tokenBalance, 'ether');
        const formattedApprove = Web3.utils.fromWei(isApprovedFor, 'ether');
        const read = formattedBalance.split('.')

        if (!feedBatch.hasBatch) {
            document.getElementById("batch_feed_button").disabled = true;
        } else {
            document.getElementById("batch_feed_button").disabled = false;
            for (i = 0; i < feedBatch.batchArray.length; i++) {
                if (feedBatch.batchArray[i] != 0) {
                    feedDisplayArray.push("#" + feedBatch.batchArray[i])
                }
            }
            document.getElementById("pets_to_feed").innerHTML = feedDisplayArray;

        }
        if (!playBatch.hasBatch) {
            document.getElementById("batch_play_button").disabled = true;
        } else {
            document.getElementById("batch_play_button").disabled = false;
            for (i = 0; i < playBatch.batchArray.length; i++) {
                if (playBatch.batchArray[i] != 0) {
                    playDisplayArray.push("#" + playBatch.batchArray[i])
                }
            }
            document.getElementById("pets_to_play").innerHTML = playDisplayArray;

        }
        if (!prestigeBatch.hasBatch) {
            document.getElementById("batch_prestige_button").disabled = true;
        } else {
            document.getElementById("batch_prestige_button").disabled = false;
            for (i = 0; i < prestigeBatch.batchArray.length; i++) {
                if (prestigeBatch.batchArray[i] != 0) {
                    prestigeDisplayArray.push("#" + prestigeBatch.batchArray[i])
                }
            }
            document.getElementById("pets_to_prestige").innerHTML = prestigeDisplayArray;

        }
        if (!rewardBatch.hasBatch) {
            document.getElementById("batch_reward_button").disabled = true;
        } else {
            document.getElementById("batch_reward_button").disabled = false;
            for (i = 0; i < rewardBatch.batchArray.length; i++) {
                if (rewardBatch.batchArray[i] != 0) {
                    rewardDisplayArray.push("#" + rewardBatch.batchArray[i])
                }
            }
            document.getElementById("pets_to_get_reward").innerHTML = rewardDisplayArray;

        }

        accountBalance.innerHTML = "<p>QSM Tokens:<br>" + read[0] + "</p>"
        if (read[0] >= 3630 && formattedApprove >= 3630) {
            purchaseButton_Button.hidden = false
            purchaseButton_Button.disabled = false
            document.getElementById("purchase_button_in_body").disabled = false
            document.getElementById("purchaseButton_Button_in_body").disabled = false
        } else {
            purchaseButton_Button.disabled = true
            purchaseButton_Button.hidden = true
            document.getElementById("purchase_button_in_body").disabled = true
            document.getElementById("purchaseButton_Button_in_body").disabled = true
        }
        // console.log(isApprovedFor, " approved for")
        if (isApprovedFor >= 10000000000000000000000) {
            approveButton.hidden = true
            approveButtonNav.hidden = true
        } else {
            approveButton.hidden = false
            approveButtonNav.hidden = false
        }
        if (ownerIds.length == 0) {
            document.getElementById("purchase_button_in_body").hidden = false
            document.getElementById("id_states").hidden = true
            purchaseButton_Button.hidden = false
            // feed_row.hidden = true;
            // play_row.hidden = true;
            // pass_row.hidden = true;
            feedButton.hidden = true
            hatchButton.hidden = true
            playButtonDiv.hidden = true
            $('#image').attr("src", "./../../assets/images/Blobs2/states/egg.gif")
            // console.log('dont own any nfts')
            // display purchase card with info above image
        } else {
            // feedButton.hidden = false
            // hatchButton.hidden = false
            // playButtonDiv.hidden = false
            // feed_row.hidden = false;
            // play_row.hidden = false;
            // pass_row.hidden = false;
            // load_NFT_card.hidden = false
            // load_dud_card_1.hidden = false
            // load_dud_card_2.hidden = false
            
            document.getElementById("id_states").hidden = false
            document.getElementById("purchase_button_in_body").hidden = true
            document.getElementById("token_numbers_body").hidden = false
            purchaseButton_Button.hidden = false
            document.getElementById("token_numbers_body").innerHTML = "";
            // if (document.getElementById(token_numbers_body).hidden === true) {

            // }
            for (i = 0; i <= ownerIds.length - 1; i++) {
                const button = document.createElement("button");
                button.className = 'btn btn-sm btn-primary m-2 border-2';
                button.style = 'border-color: #3E4145;'
                button.setAttribute('onclick', 'loadNFTData(' + ownerIds[i] +')')

                button.id = ownerIds[i]
                button.innerHTML = ownerIds[i]
                document.getElementById("token_numbers_body").appendChild(button);
                getDataAndPutIntoObject(ownerIds[i], i)
                // console.log(ownerIds[i], 'ownerIds[i]')
                // console.log('gettingdata')
            }
            // setTempData("Load NFT#")
            // console.log(arrayOfDataObjects)
        }
    document.getElementById('token_numbers').hidden = false
    // getDeviceOwnersQSMBalance(currentAccount)
    })
    showAccount.innerHTML = "<p>Wallet:<br>" + account.match(/.{1,15}/g)[0] + "...</p>"

    if (network === 4) { // rinkeby=4  matic=137 mumbai = 80001
        showBalance.innerHTML = "<p>Rinkeby ETH:<br>" + read.toFixed(5) + "</p>"
        purchaseButtonDiv.hidden = false;
        // getInfoByTokenId()
        // getStrengthInfoByTokenId()
        // getOwnerOFToken()
        return currentAccount;
    } else {
        loadDataButton.innerHTML = "Switch to Rinkeby Network and Try Again"
    }
}

const getDataAndPutIntoObject = (ID, i) => {
    const btn = document.getElementById(ID)
    let _alive, _info, _growthStage, _times
    _alive = promisify(alive_ => CRYPTOGOTCHI_Contract.methods.alive(ID).call(alive_))
    _info = promisify(info_ => CRYPTOGOTCHI_Contract.methods.Unit(ID).call(info_))
    _growthStage = promisify(growthStage_ => CRYPTOGOTCHI_Contract.methods.growthStage(ID).call(growthStage_))
    _times = promisify(times_ => DATA_Contract.methods.getTimeData(ID).call(times_))
    Promise.all([_alive, _info, _growthStage, _times]).then(function ([alive, info, growthStage, times]) {
        const { isItPlayTime_, secondsUntilNextPlay_, timeBetweenPlays_, playsPerGeneration_, isInFeedWindow_, secondsUntilNextFeed_, secondsLeftInFeedWindow_ } = times
        // console.log('is it play time: ', isItPlayTime_)
        // console.log('is it feed time: ', isInFeedWindow_)

        const {
            name_, createdAt_, feedLevel_,
            generation_, generationTicker_,
            lastPlayTime_, dayPasses_,
            prestige_, rewards_, tokensToRevive_, packChoice_, pet_
        } = info
        // console.log(i, " i")
        let objectOfData = {}
        objectOfData.iteration = i
        objectOfData.tokenID = ID
        objectOfData.name = name_
        objectOfData.alive = alive
        objectOfData.createdAt = createdAt_
        objectOfData.feedLevel = feedLevel_
        objectOfData.generation = generation_
        objectOfData.generationTicker = generationTicker_
        objectOfData.lastPlayTime = lastPlayTime_
        objectOfData.availableFreeDays = dayPasses_
        objectOfData.prestige = prestige_
        objectOfData.rewards = rewards_
        objectOfData.tokensToRevive = tokensToRevive_
        objectOfData.packChoice = packChoice_
        objectOfData.pet = pet_
        objectOfData.growthStage = growthStage

        arrayOfDataObjects[i] = objectOfData
        // if (color === "0" && createdAt !== "115792089237316195423570985008687907853269984665640564039457584007913129639935") {
        //     btn.style = "background-color: orange; border-color: white;"
        // }   
        if (packChoice_ > 0 && pet_ == 0 && growthStage == 1 && createdAt_ === MAX_TIMESTAMP) {// chainlink egg
            btn.style = "background-color: orange; border-color: #3E4145;"
        } 
        if (packChoice_ > 0 && pet_ > 1 && growthStage == 1 &&  createdAt_ === MAX_TIMESTAMP ||
            packChoice_ == 0 && pet_ > 0 && growthStage == 1 && createdAt_ === MAX_TIMESTAMP) {// normal egg
            btn.style = "background-color: orange; border-color: #3E4145;"
        } 
        if (growthStage == 2 && isItPlayTime_ && isInFeedWindow_) {  // play time and feed time
            btn.style = "background-color: red; border-color: #3E4145;"
        }
        if (growthStage == 2 && isItPlayTime_ && isInFeedWindow_) {                 // play time and feed time
            btn.style = "background-color: red; border-color: #3E4145;"
        }
        if (growthStage == 2 && !isItPlayTime_ && isInFeedWindow_) {                // only feed time
            btn.style = "background-color: red; border-color: #3E4145;"
        }
        if (growthStage == 2 && !isInFeedWindow_ && isItPlayTime_) {                // only play time
            btn.style = "background-color: green; border-color: #3E4145;"
        }
        if(!alive) {                                            // dead
            btn.style = "background-color: black; border-color: #3E4145;"
        }
        if (packChoice_ > 0 && pet_ == 0 && growthStage == 1 && createdAt_ !== "115792089237316195423570985008687907853269984665640564039457584007913129639935") {
            btn.style = "background-color: orange; border-color: white;"
            btn.disabled = true
        }
        
    })
    // console.log(arrayOfDataObjects)
}

const updateOnlyUnitAndTokenURIObject = (ID, i) => {
    const btn = document.getElementById(ID)
    let _info, _alive, _growthStage, _times
    _info = promisify(info_ => CRYPTOGOTCHI_Contract.methods.Unit(ID).call(info_))
    _growthStage = promisify(growthStage_ => CRYPTOGOTCHI_Contract.methods.growthStage(ID).call(growthStage_))
    _alive = promisify(alive_ => CRYPTOGOTCHI_Contract.methods.alive(ID).call(alive_))
    _times = promisify(times_ => DATA_Contract.methods.getTimeData(ID).call(times_))

    Promise.all([_info, _alive, _growthStage, _times]).then(function ([info, alive, growthStage, times]) {

        console.log(growthStage)
        const { isItPlayTime_, isInFeedWindow_} = times
        const {
            name_, createdAt_, feedLevel_,
            generation_, generationTicker_,
            lastPlayTime_, dayPasses_,
            prestige_, rewards_, tokensToRevive_, packChoice_, pet_
        } = info
        arrayOfDataObjects[i].name = name_
        arrayOfDataObjects[i].alive = alive
        arrayOfDataObjects[i].createdAt = createdAt_
        arrayOfDataObjects[i].feedLevel = feedLevel_
        arrayOfDataObjects[i].generation = generation_
        arrayOfDataObjects[i].generationTicker = generationTicker_
        arrayOfDataObjects[i].lastPlayTime = lastPlayTime_
        arrayOfDataObjects[i].availableFreeDays = dayPasses_
        arrayOfDataObjects[i].prestige = prestige_
        arrayOfDataObjects[i].rewards = rewards_
        arrayOfDataObjects[i].tokensToRevive = tokensToRevive_
        arrayOfDataObjects[i].packChoice = packChoice_
        arrayOfDataObjects[i].pet = pet_
        arrayOfDataObjects[i].growthStage = growthStage
        
        console.log(arrayOfDataObjects[i])
        // console.log(arrayOfDataObjects)

        console.log("arrayofdataobjects ", i, " updated" )
        // if (color === "0" && isInFeedWindow_) {
        //     btn.style = "background-color: orange; border-color: white;"
        //     getTokenInfo(ID, i)
        //     getSetTimers(ID, i)
        //     return
        // }       
        if (growthStage == 2 && !isItPlayTime_ && !isInFeedWindow_) {
            btn.style = "background-color: #0d6efd; border-color: white;" 
             // nothing to do
        }
        else if (growthStage == 1 && !isItPlayTime_ && !isInFeedWindow_) {   //egg
            btn.style = "background-color: orange; border-color: white;"
        }
        else if (isItPlayTime_ && isInFeedWindow_) {                        // play time and feed time
            btn.style = "background-color: red; border-color: white;"
        }
        else if (!isItPlayTime_ && isInFeedWindow_) {                       // only feed time
            btn.style = "background-color: red; border-color: white;"
        }
        else if (!isInFeedWindow_ && isItPlayTime_) {                       // only play time
            btn.style = "background-color: green; border-color: white;"
        }
        else if (!alive) {                                                  // dead
            btn.style = "background-color: black; border-color: white;"
        }
        else {
            btn.style = "background-color: #0d6efd; border-color: white;"  // nothing to do
        }
        getTokenInfo(ID, i)
        getSetTimers(ID, i)
    })

}

var feedTimer = new easytimer.Timer();
var playTimer = new easytimer.Timer();
// let myTimer;
feedTimer.addEventListener('secondsUpdated', function (e) {
    days = feedTimer.getTimeValues().days
    hours = feedTimer.getTimeValues().hours
    minutes = feedTimer.getTimeValues().minutes
    seconds = feedTimer.getTimeValues().seconds

    // days = days < 10 ? "0" + days : days
    // hours = hours < 10 ? "0" + hours : hours
    // minutes = minutes < 10 ? "0" + minutes : minutes;
    // seconds = seconds < 10 ? "0" + seconds : seconds;
    if (days == 0 && hours == 0 && minutes == 0 && seconds == 0 || days === "00" && hours === "00" && minutes === "00" && seconds == "00") {
        // document.getElementById('nextAvailablePlay').innerHTML = "It's Play Time!"
        // document.getElementById('playButton').disabled = false
        feedTimer.stop();
        playTimer.stop();
        getSetTimers(tokenId, iteration)
        return
    }
    if (days == 0 && hours == 0 && minutes == 0 || days === "00" && hours === "00" && minutes === "00") {
        document.getElementById('time').innerHTML = seconds + " seconds"
        return
    }
    else if (days == 0 && hours == 0 || days == 0 && hours === "0") {
        document.getElementById('time').innerHTML = minutes + " minutes " + seconds + " seconds"
        return
    }
    else if (days == 0 || days === "00") {
        document.getElementById('time').innerHTML = hours + " hrs " + minutes + " mins " + seconds + " secs"
        return
    }
    else {
        if (days == 1){
            document.getElementById('time').innerHTML = days + " day " + hours + " hrs " + minutes + " mins " + seconds + " secs"
            return 
        } else {
            document.getElementById('time').innerHTML = days + " days " + hours + " hrs " + minutes + " mins " + seconds + " secs"
            return
        }
    }
})
playTimer.addEventListener('secondsUpdated', function (e) {
    days = playTimer.getTimeValues().days
    hours = playTimer.getTimeValues().hours
    minutes = playTimer.getTimeValues().minutes
    seconds = playTimer.getTimeValues().seconds

    // days = days < 10 ? "0" + days : days
    // hours = hours < 10 ? "0" + hours : hours
    // minutes = minutes < 10 ? "0" + minutes : minutes;
    // seconds = seconds < 10 ? "0" + seconds : seconds;

    if (days == 0 && hours == 0 && minutes == 0 && seconds == 0 || days === "00" && hours === "00" && minutes === "00" && seconds == "00") {
        document.getElementById('nextAvailablePlay').innerHTML = "It's Play Time!"
        document.getElementById('playButton').disabled = false
        playTimer.stop();
        return  
    } 
    if (days == 0 && hours == 0 && minutes == 0 || days === "00" && hours === "00" && minutes === "00") {
        document.getElementById('nextAvailablePlay').innerHTML = seconds + " seconds"
        return  
    } 
    else if (days == 0 && hours == 0 || days == 0 && hours === "0") {
        document.getElementById('nextAvailablePlay').innerHTML = minutes + " mins " + seconds + " secs"
        return
    }
    else if (days == 0 || days === "00") { 
        document.getElementById('nextAvailablePlay').innerHTML = hours + ":" + minutes + ":" + seconds
        return
    }
    else {
        document.getElementById('nextAvailablePlay').innerHTML = days + ":" + hours + ":" + minutes + ":" + seconds
        return
    }
})

const loadDataFromArrayOfData = (ID) => {
    for (i = 0; i < arrayOfDataObjects.length; i++) {
        // console.log(typeof(arrayOfDataObjects[i].tokenID))
        if (arrayOfDataObjects[i].tokenID === ID.toString()) {
            iteration = i
            // console.log('loadDataFromArrayOfData function')
            // load_NFT_card.hidden = true
            // load_dud_card_1.hidden = true
            // load_dud_card_2.hidden = true
            // feed_row.hidden = false
            // play_row.hidden = false
            // pass_row.hidden = false
            // if (arrayOfDataObjects[i].name !== "egg") {
            //     getSetTimers(ID, iteration)
            //     console.log('setting timers')
            // }
            getTokenInfo(ID, iteration)
            console.log('loading id# data')
            return


        }
    }
}

const getTokenInfo = (ID, i) => {
    // console.log(i, ' iteration, starting getTokenInfo()')
    const basePrestige = 16
    const {
        tokenID,name,alive,createdAt,
        feedLevel,generation,generationTicker,
        lastPlayTime,availableFreeDays,prestige,
        rewards, tokensToRevive, packChoice, pet, growthStage
    } = arrayOfDataObjects[i]
    
    const nextFeedingUnix = createdAt * 1000 + 86400000 * feedLevel // 10 minutes
    const nextFeedDate = new Date(nextFeedingUnix);
    const convertedTime = moment(nextFeedDate).format('MMMM Do YYYY, h:mm:ss a');

    const formattedTokensToRevive = Web3.utils.fromWei(tokensToRevive, 'ether');

    const feedWindow = (generation * 1) + 1
    const rewardCount = Web3.utils.fromWei(rewards, 'ether');

    // console.log(name)
    // const read = formattedBalance.split('.')
    // console.log(alive, " state of device, alive/dead")
    if (!alive) {
        console.log('dead')
        feedButton.hidden = true
        playButtonDiv.hidden = true
        hatchButton.hidden = true
        redeem_div_buttons.hidden = true // passes

        next_generation_.hidden = true
        next_reward_.hidden = true
        next_prestige_.hidden = true
        next_play_.hidden = true

        date_of_next_watering_.hidden = true
        feed_countdown_.hidden = true
        feed_window_.hidden = true

        normal_hatch_info.hidden = true
        initial_hatch_info.hidden = true

        resetAmount.disabled = false
        document.getElementById('time').hidden = true
        redeemButton.disabled = true

        
        // console.log(parseInt(rewards))
        if (parseInt(rewards) > 0) {
            console.log('greater than 0')
            setTempData("Withdraw rewards first then revive")
            
            if_rewards_redeemable.hidden = false
            if_needs_revival.hidden = true

            get_rewards_button_in_feed_div.hidden = false // rewards
            resetButton.hidden = true
            redeemable_rewards_.hidden = false

            getRewardsButtonFeedDivButton.innerHTML = "Redeem " + rewardCount + " QSM"
        } 
        else {
            console.log('zero redeemable rewards')
            setTempData("Revive to continue")

            if_rewards_redeemable.hidden = true
            if_needs_revival.hidden = false

            redeemable_rewards_.hidden = true

            get_rewards_button_in_feed_div.hidden = true // rewards
            resetButton.hidden = false
        }

        document.getElementById('freeDays').innerHTML = availableFreeDays
        document.getElementById('rewards').innerHTML = rewardCount
        resetAmount.innerHTML = "Revive for " + formattedTokensToRevive + " QSM"
        currentPrestige.innerHTML = prestige

        getImages(packChoice, pet, growthStage)
        return;
    }
    if (growthStage == 1) {
        console.log('egg')
        feedButton.hidden = true
        playButtonDiv.hidden = true
        resetButton.hidden = true
        get_rewards_button_in_feed_div.hidden = true

        if_rewards_redeemable.hidden = true
        if_needs_revival.hidden = true

        // document.getElementById('time').hidden = true
        // document.getElementById('time').innerHTML = ""

        hatchButton.hidden = false
        redeem_div_buttons.hidden = false
        redeemButton
        // console.log(color === "0")
        if (packChoice > 0 && pet == 0) {
            console.log('frog color = 0')
            // setTempData("Initial Hatching!")
            normal_hatch_info.hidden = true
            initial_hatch_info.hidden = false
            current_prestige_.hidden = true
            // document.getElementById('time').hidden = true
            // document.getElementById('time').innerHTML = ""
            playButtonDiv.hidden = true
            redeemable_rewards_.hidden = true
            play_row.hidden = true
            redeemButton.disabled = true
            

        } else {
            console.log('egg but frog pet is greater than 1')
            // setTempData("Normal Hatch!")
            normal_hatch_info.hidden = false
            initial_hatch_info.hidden = true
            
            play_row.hidden = false

            current_prestige_.hidden = false
            currentPrestige.innerHTML = prestige
            

            playButtonDiv.hidden = true
            redeemable_rewards_.hidden = true

        }
        next_generation_.hidden = true
        next_reward_.hidden = true
        next_prestige_.hidden = true
        next_play_.hidden = true

        date_of_next_watering_.hidden = true
        feed_countdown_.hidden = true
        feed_window_.hidden = true
        
        document.getElementById('freeDays').innerHTML = availableFreeDays
        document.getElementById('rewards').innerHTML = rewardCount

        getImages(packChoice, pet, growthStage)
        console.log('egg data set, images loaded')
        return
    }
    if(alive && name !== "egg"){
        // if (feedWindow == 1) {
        //     document.getElementById('feed_window').innerHTML = feedWindow + " hr"
        // } else {
        //     document.getElementById('feed_window').innerHTML = feedWindow + " hrs"
        // }
        // console.log(name, " alive")
        if (generation == "11") {
            if (parseInt(rewards) > 0) {
                console.log(rewards)
                console.log('withdraw rewards first')
                prestige_button.disabled = true
            } else {
                prestige_button.disabled = false
            }
            playButtonDiv.hidden = true
            prestigeButton.hidden = false
        } else {
            playButtonDiv.hidden = false
            prestigeButton.hidden = true
        }
        console.log('alive and not egg')
        getSetTimers(ID, iteration)
        console.log('setting timers')
        hatchButton.hidden = true
        resetButton.hidden = true
        get_rewards_button_in_feed_div.hidden = true

        if_rewards_redeemable.hidden = true
        if_needs_revival.hidden = true

        normal_hatch_info.hidden = true
        initial_hatch_info.hidden = true

        next_generation_.hidden = false
        next_reward_.hidden = false
        next_prestige_.hidden = false
        next_play_.hidden = false

        date_of_next_watering_.hidden = false
        feed_countdown_.hidden = false
        feed_window_.hidden = false

        timeUntilNextFeeding.hidden = false
        
        redeemable_rewards_.hidden = false

        feedButton.hidden = false
        // playButtonDiv.hidden = false
        play_row.hidden = false
        redeem_div_buttons.hidden = false // passes
        redeemButton.disabled = false

        if (parseInt(rewards) > 0) {
            console.log('rewards available')
            rewardWithdrawButton.innerHTML = "Redeem " + rewardCount + " QSM"
            rewardWithdrawButton.hidden = false // rewards
        } else {
            console.log("no rewards")
            rewardWithdrawButton.hidden = true // rewards
        }
        if (name != "") {
            document.getElementById('set_name').innerHTML = name
            document.getElementById('change_name_card').hidden = true
            document.getElementById('set_name_card').hidden = false

        } else {
            document.getElementById('change_name_card').hidden = false
            document.getElementById('set_name_card').hidden = true
        }
        document.getElementById('dateOfNextWatering').innerHTML = convertedTime
        document.getElementById('rewards').innerHTML = rewardCount + " QSM"
        document.getElementById('nextGeneration').innerHTML = generation-generationTicker + " Plays"
        document.getElementById('nextRewardSize').innerHTML = ((generation-1) * 1) * (prestige+1) + 1 + " QSM"
        document.getElementById('generationsLeft').innerHTML = 10 - generation + " Generations"
        document.getElementById('currentPrestige').innerHTML = prestige
        document.getElementById('freeDays').innerHTML = availableFreeDays + " Days"
        document.getElementById('currentGeneration').innerHTML = generation
        getImages(packChoice, pet, growthStage)
        console.log('nft data set, images loaded')
        return
    } else {
        // resetAmount.innerHTML = "Revive for " + formattedTokensToRevive + " QSM"
        return
    }
}

const getSetTimers = (ID, i) => {
    // console.log(arrayOfDataObjects[i].tokenID === ID.toString(), ID, "this id is loaded now")
    const { name, alive, generation, packChoice, pet, growthStage} = arrayOfDataObjects[i]
    const feedWindow = generation
    // console.log(name, "nameee")
    // console.log('gettimersfunction passed ID: ', ID)
    // console.log('gettimersfunction passed increment: ', i)
    let _times
    _times = promisify(times_ => DATA_Contract.methods.getTimeData(ID).call(times_))
    Promise.all([_times]).then(function ([times]) {
        const { secondsUntilNextPlay_, secondsUntilNextFeed_, secondsLeftInFeedWindow_ } = times
        timeUntilNextFeeding.innerHTML = "&nbsp;"
        console.log(times)
        // document.getElementById('time').innerHTML = "&nbsp;"
        if (!alive) {
            console.log('dead, stop times')
            feedTimer.stop();
            playTimer.stop();
            getImages(packChoice, pet, growthStage)
            return
        }
        else if (secondsUntilNextPlay_ === "115792089237316195423570985008687907853269984665640564039457584007913129639935") {
            console.log('not hatched yet')
            feedTimer.stop();
            playTimer.stop();
            getImages(packChoice, pet, growthStage)
            return
        } else if (growthStage == 1 ) {
            console.log('egg, stop times')
            feedTimer.stop();
            playTimer.stop();
            getImages(packChoice, pet, growthStage)
            return 
        } else {
            feedTimer.stop();
            if (parseInt(secondsUntilNextFeed_) !== 0) {
                console.log('not feed time yet')
                feedTimer.start({ countdown: true, startValues: { seconds: secondsUntilNextFeed_ } });
                document.getElementById('feed_button').disabled = true
                feed_button.className = "";
                feed_button.className = "btn btn-primary";
                if (feedWindow == 1) {
                    document.getElementById('feed_window').innerHTML = feedWindow + " hr"
                } else {
                    document.getElementById('feed_window').innerHTML = feedWindow + " hrs"
                }
                
            } else {
                if (parseInt(secondsLeftInFeedWindow_) !== 0) {
                    console.log('in feed time')
                    feedTimer.start({ countdown: true, startValues: { seconds: secondsLeftInFeedWindow_ } });
                    // document.getElementById('nextAvailablePlay').style = "white;"
                    feed_button.className = "";
                    feed_button.className = "btn btn-warning";
                    document.getElementById('feed_button').disabled = false
                    dateOfNextFeeding.innerHTML = 'Its Feed Time Now!'
                    document.getElementById('feed_window').innerHTML = "Currently in " + feedWindow + " hour feed window. Feed Now!"
                    // feedWindow.innerHTML = "Currently in " + feedWindow + " hour feed window. Feed Now!"
                } else {
                    console.log('dead')
                    feed_button.className = "";
                    feed_button.className = "btn btn-primary";
                    feedTimer.stop();
                }
                // console.log('in feed window')
                // feedTimer.start({ countdown: true, startValues: { seconds: secondsLeftInFeedWindow_ } });
            }
            playTimer.stop();
            if (parseInt(secondsUntilNextPlay_) !== 0) {
                console.log('not play time yet')
                playTimer.start({ countdown: true, startValues: { seconds: secondsUntilNextPlay_ } });
                // document.getElementById('nextAvailablePlay').style = "white;"
                document.getElementById('playButton').disabled = true
                playButton.className = "";
                playButton.className = "btn btn-primary";
            } else {
                console.log('its play time now')
                // document.getElementById('nextAvailablePlay').style = "color: rgb(17, 73, 0);"
                document.getElementById('nextAvailablePlay').innerHTML = "It's Play Time!"
                document.getElementById('playButton').disabled = false
                playButton.className = "";
                playButton.className = "btn btn-warning";
                playTimer.stop();
            }
        }
    })
}


// const updateOnlyButtonColors = () => {
//     getAccount()
//     setTimeout(function () {
//         arrayOfDataObjects = []
//         updateOnlyButtonColors()
//         console.log('getting account info')
//     }, 60000); // every 60 seconds update account
    
// }



// const batchPlay = () => {
//     let _ownerIds
//     _ownerIds = promisify(ownerIds_ => CRYPTOGOTCHI_Contract.methods.getOwnersTokenIds(currentAccount).call(ownerIds_))
    
//     Promise.all([_ownerIds]).then(function ([ownerIds]) {
//         for (i = 0; i < ownerIds.length; i++) {
//             let id = ownerIds[i]
//             let _times
//             _times = promisify(times_ => CRYPTOGOTCHI_Contract.methods.getTimeData(id).call(times_))
//                 Promise.all([_times]).then(function ([times]) {
//                     console.log(times)
//                     if (!times.isItPlayTime_ && !times.isInFeedWindow_)
//                         playArray.push(id)
//                 })
//         }
//     })
    
// }   