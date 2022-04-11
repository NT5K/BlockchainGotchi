const path = require('path');
// const cors = require('cors')
const express = require('express');
const router = express.Router();
var axios = require("axios")


module.exports = router;

router.get('/', (__, res) => {
    res.sendFile(path.join(__dirname, '/../dist/html/index.html'));
});
router.get('/instructions', (__, res) => {
    res.sendFile(path.join(__dirname, '/../dist/html/instructions.html'));
});
router.get('/device', (__, res) => {
    res.sendFile(path.join(__dirname, '/../dist/html/app4.html'));
});
router.get('/sale', (__, res) => {
    res.sendFile(path.join(__dirname, '/../dist/html/sale.html'));
});
router.get('/test/:contract/:id', (req, res) => {
    const {contract, id} = req.params;
    const URL2 = 'https://rinkeby-api.opensea.io/asset/' + contract + '/' + id + '/?force_update=true&format=json'

    axios.get(URL2).then(
        function (response) {
            // console.log(response.data.token_id, "test")
            res.json(response.data.token_id)
        }
    ).catch(error => {
        console.log(error)
    })
});

