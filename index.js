const express = require('express')
const lotto = require('./lotto.lib.js')

const app = express();

app.get('/', async(req, res) => {
    // get all lottoDate lists

    var resp = await lotto.getLottoDateList();

    res.json({
        status: true,
        data: resp
    });

})

app.get('/:lottoDate', async(req, res) => {
    // get lotto result from req.params.lottoDate

    var resp = await lotto.getLottoResultPerDate(req.params.lottoDate);
    
    res.json({
        status: true,
        data: resp
    });
})

app.get('/:lottoDate/:lottoNumber', async(req, res) => {
    // check lotto result from req.params.lottoDate & req.params.lottoNumber

    var resp = await lotto.getLottoResultPerDate(req.params.lottoDate);
    var result = lotto.checkNumberHasPrize(req.params.lottoNumber, resp);
    
    res.json({
        status: true,
        data: {
            key: req.params.lottoDate,
            number: req.params.lottoNumber,
            result: result
        }
    });
})

app.listen(8888, () => {
    console.log('app running at port: 8888');
})