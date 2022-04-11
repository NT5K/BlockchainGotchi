const disableButtons = () => {
    document.querySelectorAll('#token_numbers_body button').forEach(elem => {
        elem.disabled = true;
    });
    document.querySelectorAll('#sidebarToggle button').forEach(elem => {
        elem.disabled = false;
    });
    refresh_button.hidden = true
    // $('#token_numbers_body:button').prop('disabled', true);
    // $('#sidebarToggle').prop('disabled', false);
}
const enableButtons = () => {
    document.querySelectorAll('#token_numbers_body button').forEach(elem => {
        elem.disabled = false;
    });
    refresh_button.hidden = false
    // $('#token_numbers_body:button').prop('disabled', false);
}


const ethereumButton = document.querySelector('.enableEthereumButton');
const connectWithoutID = document.querySelector('.connectWithoutID');

const current_generation_ = document.querySelector('current_generation_');
const currentGeneration = document.querySelector('currentGeneration');

const showAccount = document.querySelector('#showAccount');
const showBalance = document.querySelector('#showBalance');

const loadDataButtonDiv = document.querySelector('#enableMeta');
const loadDataButton = document.querySelector('#buttonmeta');

const loadNewDataDiv = document.querySelector('#load_new_data_div');
const loadNewDataButton = document.querySelector('#load_new_data');

const buy_ppet_button = document.querySelector('#buy_ppet_button');

const connectWithout_ID_Button = document.querySelector('#buttonmeta2');

const sidebar_device_info_div = document.querySelector('#sidebar_device_info_div');
const account_balances_menu_div = document.querySelector('#account_balances_menu_div');

const dateOfNextFeeding = document.querySelector('#dateOfNextWatering');
const timeUntilNextFeeding = document.querySelector('#time');

const feedWindow = document.querySelector('#feed_window');
const playsLeftUntilGenUp = document.querySelector('#nextGeneration');
const nextRewardSize = document.querySelector('#nextRewardSize');
const generationsLeft = document.querySelector('#generationsLeft');
const currentPrestige = document.querySelector('#currentPrestige');
const rewardsCountId = document.querySelector('#rewards');
const freeDaysId = document.querySelector('#freeDays');

const timeUntilNextPlay = document.querySelector('#nextAvailablePlay');

const purchase_div_toggle = document.querySelector('#purchase_div_toggle');
const collapseLayouts2 = document.querySelector('#collapseLayouts2');

const redeemButton = document.querySelector('#redeemButton');
const purchaseButtonDiv = document.querySelector('#purchaseButtonDiv');
const purchaseButton = document.querySelector('#purchaseButton');
const purchaseButton_Button = document.querySelector('#purchaseButton_Button');
const purchaseButton_Button_in_body = document.querySelector('#purchaseButton_Button_in_body');

const NFT_ID_NUMBER = document.querySelector('#NFT_ID_NUMBER');
const openseaLink = document.querySelector('#openseaLink');

const prestigeButton = document.querySelector('#prestigeButton');
const rewardWithdrawButton = document.querySelector('#rewardWithdrawButton');

const normal_hatch_info = document.querySelector('#normal_hatch_info');
const initial_hatch_info = document.querySelector('#initial_hatch_info');

const next_generation_ = document.querySelector('#next_generation_');
const next_reward_ = document.querySelector('#next_reward_');
const next_prestige_ = document.querySelector('#next_prestige_');
const next_play_ = document.querySelector('#next_play_');
const current_prestige_ = document.querySelector('#current_prestige_');
const redeemable_rewards_ = document.querySelector('#redeemable_rewards_');

const date_of_next_watering_ = document.querySelector('#date_of_next_watering_');
const feed_countdown_ = document.querySelector('#feed_countdown_');
const feed_window_ = document.querySelector('#feed_window_');

const if_rewards_redeemable = document.querySelector('#if_rewards_redeemable');
const if_needs_revival = document.querySelector('#if_needs_revival');

const accountBalance = document.querySelector('#AccountBalance');

const error_message_div_ID = document.querySelector('#error_message_div_ID');
const error_message_div = document.querySelector('#error_message_div');
const not_the_owner_in_menu = document.querySelector('#not_the_owner_in_menu');

const feed_div_buttons = document.querySelector('#feed_div_buttons');
const play_div_buttons = document.querySelector('#play_div_buttons');
const redeem_div_buttons = document.querySelector('#redeem_div_buttons');

const feed_button = document.querySelector('#feed_button');
const feedButton = document.querySelector('#feedButton');
const hatchButton = document.querySelector('#hatchButton');
const resetButton = document.querySelector('#resetButton');
const playButton = document.querySelector('#playButton');
const playButtonDiv = document.querySelector('#playButtonDiv');
const get_rewards_button_in_feed_div = document.querySelector('#get_rewards_button_in_feed_div');
const getRewardsButtonFeedDivButton = document.querySelector('#getRewardsButtonFeedDivButton');


const approveButtonNav = document.querySelector('#approveButtonNav');
const approveButton = document.querySelector('#approveButton');

const tokenId_input = document.querySelector('#tokenId');

const resetAmount = document.querySelector('#resetAmount');
const feedLevel_Amount = document.querySelector('#feedLevel');

const feed_row = document.querySelector('#feed_row');
const play_row = document.querySelector('#play_row');
const pass_row = document.querySelector('#pass_row');

const load_NFT_card = document.querySelector('#load_NFT_card');
const load_dud_card_1 = document.querySelector('#load_dud_card_1');
const load_dud_card_2 = document.querySelector('#load_dud_card_2');

const refresh_button = document.querySelector('#refresh_button');


const MAX_TIMESTAMP = "115792089237316195423570985008687907853269984665640564039457584007913129639935"
const eggImage = "./assets/images/pepes/states/egg.gif";
const eggJSON = "ipfs://QmUp7ofupmsHtYMaBNCNUAidoMmWZnzoL4xo7cJhaThL8t/egg.json";
let currentAccount = '0x0000000000000000000000000000000000000000';
let tokenId;
let iteration;
// console.log(tokenId)
let changingNumber = 0;

let mint_transaction = "";
let purchase_transaction = "";
let hatch_transaction = "";
let reward_transaction = "";
let revive_transaction = "";
let play_transaction = "";

const TokenInfoArrayOfObjects = []

const setTempData = (innerHtml_) => {
    playsLeftUntilGenUp.innerHTML = innerHtml_
    timeUntilNextPlay.innerHTML = innerHtml_
    document.getElementById('dateOfNextWatering').innerHTML = innerHtml_
    document.getElementById('time').innerHTML = innerHtml_
    document.getElementById('rewards').innerHTML = innerHtml_
    document.getElementById('nextGeneration').innerHTML = innerHtml_
    document.getElementById('freeDays').innerHTML = innerHtml_
    document.getElementById('feed_window').innerHTML = innerHtml_
    nextRewardSize.innerHTML = innerHtml_
    generationsLeft.innerHTML = innerHtml_
    currentPrestige.innerHTML = innerHtml_
}
