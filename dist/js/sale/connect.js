const web3Instance = new Web3(window['ethereum']);

if (typeof window.ethereum !== 'undefined') {
    console.log('metamask is installed!')
} else {
    console.log('install metamask')
    document.querySelector('.enableEthereumButton')
        .innerHTML = '<a target="_blank" href="https://www.metamask.io">Install Metamask</a>'
}