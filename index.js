const express = require('express')
const lotto = require('./lotto.lib.js')

const app = express();

app.get('/', async(req, res) => {
    // get all lottoDate lists

    var resp = await lotto.getLottoDateList();

    res.json({
        status: true,
        message: `thai-lotto-checker v 1.2`,
        data: resp
    });

})

app.get('/:lottoDate', async(req, res) => {
    // get lotto result from req.params.lottoDate
    if(
        req.params.lottoDate.length != 8 || (/^\d+$/.test(req.params.lottoDate) != true)
    ) {
        res.json({
            status: false,
            message: `input not valid`
        })
        return;
    }

    var resp = await lotto.getLottoResultPerDate(req.params.lottoDate);
    
    res.json({
        status: true,
        message: `successful`,
        data: resp
    });
})

app.get('/:lottoDate/:lottoNumber', async(req, res) => {
    // check lotto result from req.params.lottoDate & req.params.lottoNumber
    if(
        (
            req.params.lottoNumber.length != 6 || (/^\d+$/.test(req.params.lottoNumber) != true)
        ) ||
        (
            req.params.lottoDate.length != 8 || (/^\d+$/.test(req.params.lottoDate) != true)
        )
    ) {
        res.json({
            status: false,
            message: `input not valid`
        })
        return;
    }

    var resp = await lotto.getLottoResultPerDate(req.params.lottoDate);
    var result = lotto.checkNumberHasPrize(req.params.lottoNumber, resp);
    
    res.json({
        status: true,
        message: `successful`,
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