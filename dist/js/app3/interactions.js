
function feedTheFrog() {
    CRYPTOGOTCHI_Contract.methods.feed(tokenId).send({ from: currentAccount })
        .on('transactionHash', tx => {
            console.log("Transaction: ", tx);
            // document.getElementById('feed_transaction').innerHTML = process;
            disableButtons()
            document.getElementById('feed_button').disabled = true
            document.getElementById('feed_button').innerHTML =
                '<div class="spinner-border spinner-border-sm" role="status">' +
                '<span class="sr-only">Loading...</span>' +
                '</div>'
        })
        .then(receipt => {
            // console.log('Mined', receipt)
            if (receipt.status == '0x1' || receipt.status == 1) {
                // console.log(Object.keys(receipt.events)[0])

                console.log("Transaction Successful")
                document.getElementById('feed_button').disabled = true
                document.getElementById('feed_button').innerHTML = "Success!"
                enableButtons()
                updateOnlyUnitAndTokenURIObject(tokenId, iteration)
                setTimeout(function () {
                    document.getElementById('feed_button').innerHTML = "Feed"
                }, 3000);
            }
            else {
                console.log('Transaction Failed')
                document.getElementById('feed_button').innerHTML = "Failed!"
                setTimeout(function () {
                    document.getElementById('feed_button').innerHTML = "Feed"
                    document.getElementById('feed_button').disabled = false
                }, 3000);
            }
        })
        .catch(err => {
            console.log('Error', err)
            document.getElementById('feed_button').innerHTML = "Error!"
            setTimeout(function () {
                document.getElementById('feed_button').innerHTML = "Feed"
                document.getElementById('feed_button').disabled = false
            }, 3000);
        })
        .finally(() => {
            document.getElementById('feed_button').disabled = true
            return
        })
}

function playWithTheFrog() {
    const ID = tokenId;
    const currentIteration = iteration
    CRYPTOGOTCHI_Contract.methods.play(tokenId).send({
        from: currentAccount, 
        maxPriorityFeePerGas: null,
        maxFeePerGas: null
    })
    .on('transactionHash', tx => {
        console.log("Transaction: ", tx);
        play_transaction = tx;
        disableButtons()

        document.getElementById('nextAvailablePlay').innerHTML = "Playing Now!"
        document.getElementById('playButton').disabled = true
        document.getElementById('playButton').innerHTML =
            '<div class="spinner-border spinner-border-sm" role="status">' +
            '<span class="sr-only">Loading...</span>' +
            '</div>'
    })
    .on("receipt", receipt => {
        // console.log('Mined', receipt)
        if (receipt.status == '0x1' || receipt.status == 1) {
            console.log("Transaction Successful")
            document.getElementById('playButton').innerHTML = "Success!"
            enableButtons()
            
            updateOnlyUnitAndTokenURIObject(tokenId, iteration)
            setTimeout(function () {
                document.getElementById('playButton').innerHTML = "Play"
            }, 3000);
        }
        else {
            console.log('Transaction Failed')
            document.getElementById('playButton').innerHTML = "Failed"
            setTimeout(function () {
                document.getElementById('playButton').innerHTML = "Play"
                document.getElementById('playButton').disabled = false
            }, 3000);
        }
    })
    .catch(err => {
        console.log('Error', err)
        document.getElementById('playButton').innerHTML = "Canceled"
        setTimeout(function () {
            document.getElementById('playButton').innerHTML = "Play"
            document.getElementById('playButton').disabled = false
        }, 3000);
    })
    .finally(() => {
        return
    })
}

const reset = () => {
    CRYPTOGOTCHI_Contract.methods.revival(tokenId).send({ from: currentAccount })
    .on('transactionHash', tx => {
        console.log("Transaction: ", tx);
        revive_transaction = tx;
        disableButtons()
        document.getElementById('resetAmount').disabled = true
        document.getElementById('resetAmount').innerHTML =
            '<div class="spinner-border spinner-border-sm" role="status">' +
            '<span class="sr-only">Loading...</span>' +
            '</div>'
        // return
    })
    .then(receipt => {
        console.log('Mined', receipt)
    })
    .catch(err => {
        console.log('Error', err)
        setTimeout(function () {

        }, 3000);
    })
    .finally(() => {
        console.log('revive function finished. is this showing?')
        return
    })
}

const getTokenReward = () => {
    CRYPTOGOTCHI_Contract.methods.getReward(tokenId).send({ from: currentAccount })
    .on('transactionHash', tx => {
        console.log("Transaction: ", tx);
        reward_transaction = tx;
        disableButtons()
        
        document.getElementById('rewardWithdrawButton').disabled = true
        document.getElementById('rewardWithdrawButton').innerHTML =
            '<div class="spinner-border spinner-border-sm" role="status">' +
            '<span class="sr-only">Loading...</span>' +
            '</div>'
            
        document.getElementById('getRewardsButtonFeedDivButton').innerHTML =
            '<div class="spinner-border spinner-border-sm" role="status">' +
            '<span class="sr-only">Loading...</span>' +
            '</div>'

    })
    .then(() => {
        // console.log("test")
    })
    .finally(() => {
            console.log("test, is this returning?")
            return
    })
}

const hatch = () => {
    CRYPTOGOTCHI_Contract.methods.hatch(tokenId).send({ from: currentAccount })
        .on('transactionHash', tx => {
            console.log("Transaction: ", tx);
            disableButtons()
            hatch_transaction = tx;
            // console.log(x)
            x = true
            // InitialHatch.subscribe(function (error, success) {
            //     if (success)
            //         console.log('Successfully subscribed!');
            // }).catch(err => {
            //     console.log(err)
            // })
            document.getElementById('hatch_button').disabled = true
            document.getElementById('hatch_button').innerHTML =
                '<div class="spinner-border spinner-border-sm" role="status">' +
                '<span class="sr-only">Loading...</span>' +
                '</div>'
            document.getElementById('dateOfNextWatering').innerHTML = "Hatching Now!"
            document.getElementById('time').innerHTML = "Hatching Now!"
            document.getElementById('nextGeneration').innerHTML = "Hatching Now!"
            document.getElementById('nextAvailablePlay').innerHTML = "Hatching Now!"
        })
        .then(receipt => {
            if (receipt.status == '0x1' || receipt.status == 1) {
                console.log("Transaction Successful")
            }
            else {
                console.log('Transaction Failed')
                document.getElementById('hatch_button').innerHTML = "Failed"
                setTimeout(function () {
                    document.getElementById('hatch_button').innerHTML = "Hatch"
                    document.getElementById('hatch_button').disabled = false
                }, 3000);
            }
        })
        .catch(err => {
            console.log('Error', err)
            document.getElementById('hatch_button').innerHTML = "Canceled"
            setTimeout(function () {
                document.getElementById('hatch_button').innerHTML = "Hatch"
                document.getElementById('hatch_button').disabled = false
            }, 3000);
        })
        .finally(() => {
            console.log('hatch function finished, returning')
            return
        })
}

const purchase = () => {
    const amount = document.getElementById("purchaseAmount").value
    console.log(tokenId)
    CRYPTOGOTCHI_Contract.methods.purchasePass(tokenId, amount).send({ from: currentAccount })
    .on('transactionHash', tx => {
        // console.log("Transaction: ", tx);
        console.log('purchase pass doesnt use tx')
        purchase_transaction = tx;
        disableButtons()
        document.getElementById('purchaseButton').disabled = true
        document.getElementById('purchaseButton').innerHTML =
            '<div class="spinner-border spinner-border-sm" role="status">' +
            '<span class="sr-only">Loading...</span>' +
            '</div>'
    })
    .then(receipt => {
        // console.log('Mined', receipt)
        if (receipt.status == '0x1' || receipt.status == 1) {
            console.log("Transaction Successful")
        }
        else {
            console.log('Transaction Failed')
        }
    })
    .catch(err => {
        console.log('Error', err)
        setTimeout(function () {
        }, 3000);
    })
    .finally(() => {
        console.log('is this returning? purchase pass finished')
        return
    })
}

const redeem = () => {
    const amount = document.getElementById("freeDaysNumber").value

    CRYPTOGOTCHI_Contract.methods.redeemPass(tokenId, amount).send({ from: currentAccount })
    .on('transactionHash', tx => {
        // console.log("Transaction: ", tx);
        console.log('redeem pass does not use tx')
        disableButtons()
        
        document.getElementById('rewardWithdrawButton').disabled = true
        document.getElementById('redeemButton').innerHTML =
            '<div class="spinner-border spinner-border-sm" role="status">' +
            '<span class="sr-only">Loading...</span>' +
            '</div>'
    })
    .then(receipt => {
        // console.log('Mined', receipt)
        if (receipt.status == '0x1' || receipt.status == 1) {
            console.log("Transaction Successful")
            document.getElementById('redeemButton').innerHTML = "Success!"
            document.getElementById('rewardWithdrawButton').disabled = false
            setTimeout(function () {
                document.getElementById('redeemButton').innerHTML = "Redeem"

            }, 3000);
        }
        else {
            console.log('Transaction Failed')
            document.getElementById('redeemButton').innerHTML = "Failed!"
            setTimeout(function () {
                document.getElementById('redeemButton').innerHTML = "Redeem"
                document.getElementById('rewardWithdrawButton').disabled = false
            }, 3000);
        }
    })
    .catch(err => {
        console.log('Error', err)
        document.getElementById('redeemButton').innerHTML = "Error!"
        setTimeout(function () {
            document.getElementById('redeemButton').innerHTML = "Redeem"
            document.getElementById('rewardWithdrawButton').disabled = false
        }, 3000);
    })
    .finally(() => {
        console.log("redeem pass function finished")
        enableButtons()
        updateOnlyUnitAndTokenURIObject(tokenId, iteration)
    })
}

const prestige = () => {
    CRYPTOGOTCHI_Contract.methods.prestige(tokenId).send({ from: currentAccount })
    .on('transactionHash', tx => {
        // console.log("Transaction: ", tx);
        console.log('prestige does not use tx')
        disableButtons()
        document.getElementById('prestige_button').disabled = false
        document.getElementById('prestige_button').innerHTML =
            '<div class="spinner-border spinner-border-sm" role="status">' +
            '<span class="sr-only">Loading...</span>' +
            '</div>'
    })
    .then(receipt => {
        // console.log('Mined', receipt)
        if (receipt.status == '0x1' || receipt.status == 1) {
            console.log("Transaction Successful")
            enableButtons()
            updateOnlyUnitAndTokenURIObject(tokenId, iteration)
            document.getElementById("prestigeButton").hidden = true;
            document.getElementById("playButtonDiv").hidden = false;
            document.getElementById('prestige_button').innerHTML = "Prestige"
            console.log('successful prestige for token # ', tokenId)
            return
        }
        else {
            console.log('Transaction Failed')
            document.getElementById('prestige_button').innerHTML = "Failed!"
            setTimeout(function () {
                document.getElementById('prestige_button').innerHTML = "Prestige"
                document.getElementById('prestige_button').disabled = false
                return
            }, 3000);
        }
    })
    .catch(err => {
        console.log('Transaction Failed')
        document.getElementById('prestige_button').innerHTML = "Error!"
        setTimeout(function () {
            document.getElementById('prestige_button').innerHTML = "Prestige"
            document.getElementById('prestige_button').disabled = false
            return
        }, 3000);
    })
    .finally(() => {
        console.log("prestige finished")
        return
    })
}

function approveLP_account() {
    QSM_Contract.methods.approve(CRYPTOGOTCHI_address, "100000000000000000000000000").send({ from: currentAccount })
    .on('transactionHash', tx => {
        // console.log("Transaction: ", tx);
        console.log('approve does not use tx')
        disableButtons()
        document.getElementById('approve_button_main').disabled = true
        document.getElementById('approve_button_body').disabled = true
        document.getElementById('approve_button_main').innerHTML =
            '<div class="spinner-border spinner-border-sm" role="status">' +
            '<span class="sr-only">Loading...</span>' +
            '</div>'
        document.getElementById('approve_button_body').innerHTML =
            '<div class="spinner-border spinner-border-sm" role="status">' +
            '<span class="sr-only">Loading...</span>' +
            '</div>'
    })
    .then(receipt => {
        // console.log('Mined', receipt)
        if (receipt.status == '0x1' || receipt.status == 1) {
            console.log('Transaction Successful')
            document.getElementById('approve_button_main').innerHTML = "Success!"
            document.getElementById('approve_button_body').innerHTML = "Success!"
            arrayOfDataObjects = []
            getAccount()
            
            setTimeout(function () {
                document.getElementById('approveButtonNav').hidden = true
                document.getElementById('approveButton').hidden = true
                document.getElementById('approve_button_main').innerHTML = "Approve"
                document.getElementById('approve_button_body').innerHTML = "Approve"
                console.log("approved account for purchases")
                return
            }, 3000);
        }
        else {
            console.log('Transaction Failed')
            document.getElementById('approve_button_main').innerHTML = "Failed!"
            document.getElementById('approve_button_body').innerHTML = "Failed!"
            setTimeout(function () {
                document.getElementById('approve_button_main').innerHTML = "Approve"
                document.getElementById('approve_button_body').innerHTML = "Approve"
                document.getElementById('approve_button_main').disabled = true
                document.getElementById('approve_button_body').disabled = true
                return
            }, 3000);
        }
    })
    .catch(err => {
        console.log('Error', err)
    })
    .finally(() => {
        console.log('approve function finished, returning')
        return
    })
}

function purchaseDevice() {
    CRYPTOGOTCHI_Contract.methods.purchaseNFT(1).send({ from: currentAccount })
    .on('transactionHash', tx => {
        console.log("Transaction: ", tx);
        mint_transaction = tx;
        console.log('mint_transaction: ', mint_transaction)
        disableButtons()
        
        document.getElementById("purchaseButton_Button").disabled = true
        document.getElementById('purchaseButton_Button').innerHTML =
        '<div class="spinner-border spinner-border-sm" role="status">' +
        '<span class="sr-only">Loading...</span>' +
        '</div>'
        document.getElementById("purchaseButton_Button_in_body").disabled = true
        document.getElementById('purchaseButton_Button_in_body').innerHTML =
            '<div class="spinner-border spinner-border-sm" role="status">' +
                '<span class="sr-only">Loading...</span>' +
            '</div>'

        document.getElementById("purchaseInfoDiv2").hidden = false
        document.getElementById("justPurchasedTokenId").hidden = true
        document.getElementById("newPurchaseInfo").innerHTML = "<a target='_blank' href='https://rinkeby.etherscan.io/tx/" + tx + "'>View Transaction</a>"
        return;
    })
    .then(receipt => {
        // console.log('Mined', receipt)
    })
    .catch(err => {
        console.log('Error', err)
    })
    .finally(() => {
        console.log('is this returning? purchase nft function finished')
        return
    })
}


const changeName = () => {
    const newName = document.getElementById("newName").value
    CRYPTOGOTCHI_Contract.methods.setName(tokenId, newName).send({ from: currentAccount })
        .on('transactionHash', tx => {
            // console.log("Transaction: ", tx);
            console.log('setting new name = ', newName)
            disableButtons()

            document.getElementById('changeNameButton').disabled = true
            document.getElementById('changeNameButton').innerHTML =
                '<div class="spinner-border spinner-border-sm" role="status">' +
                '<span class="sr-only">Loading...</span>' +
                '</div>'
        })
        .then(receipt => {
            // console.log('Mined', receipt)
            if (receipt.status == '0x1' || receipt.status == 1) {
                console.log("Transaction Successful")
                // document.getElementById('redeemButton').innerHTML = "Success!"
                document.getElementById('change_name_card').hidden = true
                document.getElementById('changeNameButton').disabled = false

                getAccount()
                document.getElementById('set_name_card').hidden = false
                document.getElementById('changeNameButton').innerHTML = "Change"
            }
            else {
                console.log('Transaction Failed')
                document.getElementById('redeemButton').innerHTML = "Failed!"
                setTimeout(function () {
                    document.getElementById('redeemButton').innerHTML = "Redeem"
                    document.getElementById('rewardWithdrawButton').disabled = false
                }, 3000);
            }
        })
        .catch(err => {
            console.log('Error', err)
            document.getElementById('redeemButton').innerHTML = "Error!"
            setTimeout(function () {
                document.getElementById('redeemButton').innerHTML = "Redeem"
                document.getElementById('rewardWithdrawButton').disabled = false
            }, 3000);
        })
        .finally(() => {
            console.log("redeem pass function finished")
            enableButtons()
            updateOnlyUnitAndTokenURIObject(tokenId, iteration)
        })
}

function batchPlay() {
    CRYPTOGOTCHI_Contract.methods.batchPlay().send({ from: currentAccount })
    .on('transactionHash', tx => {
        console.log("Transaction: ", tx);
        disableButtons()
    })
    .then(receipt => {
        console.log('Mined', receipt)
        document.getElementById("pets_to_play").innerHTML = "&nbsp;"
        getAccount()
        enableButtons()
    })
    .catch(err => {
        console.log('Error', err)
    })
    .finally(() => {
        console.log('is this returning?')
        return
    })
}
function batchFeed() {
    CRYPTOGOTCHI_Contract.methods.batchFeed().send({ from: currentAccount })
    .on('transactionHash', tx => {
        console.log("Transaction: ", tx);
        disableButtons()
    })
    .then(receipt => {
        console.log('Mined', receipt)
        document.getElementById("pets_to_feed").innerHTML = "&nbsp;"
        getAccount()
        enableButtons()
    })
    .catch(err => {
        console.log('Error', err)
    })
    .finally(() => {
        console.log('is this returning?')
        return
    })
}
function batchPrestige() {
    CRYPTOGOTCHI_Contract.methods.batchPrestige().send({ from: currentAccount })
    .on('transactionHash', tx => {
        console.log("Transaction: ", tx);
        disableButtons()
    })
    .then(receipt => {
        console.log('Mined', receipt)
        document.getElementById("pets_to_prestige").innerHTML = "&nbsp;"
        getAccount()
    })
    .catch(err => {
        console.log('Error', err)
    })
    .finally(() => {
        console.log('is this returning?')
        return
    })
}
function batchRewards() {
    CRYPTOGOTCHI_Contract.methods.batchGetReward().send({ from: currentAccount })
    .on('transactionHash', tx => {
        console.log("Transaction: ", tx);
        reward_transaction = tx;
        disableButtons()
    })
    .then(receipt => {
        console.log('Mined', receipt)
        document.getElementById("pets_to_get_reward").innerHTML = "&nbsp;"
        getAccount()
    })
    .catch(err => {
        console.log('Error', err)
    })
    .finally(() => {
        console.log('is this returning?')
        return
    })
}