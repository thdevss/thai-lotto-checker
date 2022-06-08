const express = require('express')


const app = express();

app.get('/lotto/all', async(req, res) => {
    // get all lottoDate lists
})

app.get('/lotto/:lottoDate', async(req, res) => {
    // get lotto result from req.params.lottoDate
})

app.get('/lotto/:lottoDate/:lottoNumber', async(req, res) => {
    // check lotto result from req.params.lottoDate & eq.params.lottoNumber
})

app.listen(8888, () => {
    console.log('app running at port: 8888');
})