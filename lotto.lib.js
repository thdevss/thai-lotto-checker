require('dotenv').config()
const axios = require('axios')

const { createClient } = require('redis');

var client = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
})
if(process.env.REDIS_HOST != '') {
    client.on('error', (err) => console.log('Redis Client Error', err));
    client.connect();
}

const BASE_URL = `https://news.sanook.com/lotto`;

const getDataFromOrigin = async function(endpoint, cache_time = 3600) {

    
    const url = `${BASE_URL}${endpoint}`;

    if(process.env.REDIS_HOST != '') {
        const cached = await client.get(url);
        if (cached) {
            console.log('origin - using cache')
            return cached;
        }
    }
    
    const response = await axios.get(url);
    console.log('origin - using origin')

    if(process.env.REDIS_HOST != '') {
        await client.set(url, response.data, {
            EX: cache_time,
            NX: true
        });
    }
    
    return response.data;

}


const getLottoResultPerDate = async function(lottoDate) {
    if(lottoDate.length != 8 || (/^\d+$/.test(lottoDate) != true) ) {
        return {}
    }

    const cache_name = `lotto-${lottoDate}`

    if(process.env.REDIS_HOST != '') {
        const cached = await client.get(cache_name);
        if (cached) {
            console.log('using cache')
            return JSON.parse(cached);
        }
    }

    const response = await getDataFromOrigin(`/check/${lottoDate}/`)
    var lottoResult;

    try {
        lottoResult = JSON.parse(response.split(`lottoResult = `)[1].split(`;`)[0])

        lottoResult.info = {
            key: lottoDate,
            title: response.split(`<h2 class="content__title--sub">`)[1].split('</h2>')[0].trim()
        };

        if(process.env.REDIS_HOST != '') {
            await client.set(cache_name, JSON.stringify(lottoResult), {
                EX: 3600,
                NX: true
            });
        }
    } catch (error) {
        console.warn("can't get lotto result")
    }
    

    return lottoResult;


}


const getLottoDateList = async function() {
    const cache_name = 'lotto-lists'

    if(process.env.REDIS_HOST != '') {
        const cached = await client.get(cache_name);
        if (cached) {
            console.log('using cache')
            return JSON.parse(cached);
        }
    }


    const response = await getDataFromOrigin('/')
    var lottoDates = [];

    try {
        response.split(`issue_date">`)[1].split(`</select>`)[0].split("</option>").forEach(ele => {
            var rele = ele.split(">")
            if(rele.length == 2) {
                lottoDates.push({
                    key: rele[0].replace('<option value="', "").replace('"', '').trim(),
                    val: rele[1]
                })   
            }     
        });

        if(process.env.REDIS_HOST != '') {
            await client.set(cache_name, JSON.stringify(lottoDates), {
                EX: 3600,
                NX: true
            });
        }
    } catch (error) {
        console.warn("can't get lotto date")
    }
    

    return lottoDates;
}

const checkNumberHasPrize = function(check_number, lottoResult) {

    if(check_number.length != 6 || (/^\d+$/.test(check_number) != true) ) {
        return {
            hasPrize: false,
            prizeStep: 0
        }
    }
    
    var hasPrize = false;
    var prizeStep = 0;
    var resultTxt = {
        message: 'คุณไม่ถูกรางวัล',
        prize: 0
    };

    if(lottoResult.prize.prize_5.filter(function(item) {
        return item == check_number;
    }).length == 1) {
        prizeStep = "5"
        hasPrize = true;
        resultTxt = lottoResult.wording.prize_5;
    }

    if(lottoResult.prize.prize_4.filter(function(item) {
        return item == check_number;
    }).length == 1) {
        prizeStep = "4"
        hasPrize = true;
        resultTxt = lottoResult.wording.prize_4;
    }

    if(lottoResult.prize.prize_3.filter(function(item) {
        return item == check_number;
    }).length == 1) {
        prizeStep = "3"
        hasPrize = true;
        resultTxt = lottoResult.wording.prize_3;
    }

    if(lottoResult.prize.prize_2.filter(function(item) {
        return item == check_number;
    }).length == 1) {
        prizeStep = "2"
        hasPrize = true;
        resultTxt = lottoResult.wording.prize_2;
    }

    if(lottoResult.prize.prize1_close.filter(function(item) {
        return item == check_number;
    }).length == 1) {
        prizeStep = "1_close"
        hasPrize = true;
        resultTxt = lottoResult.wording.prize1_close;
    }

    if(lottoResult.prize.prize_1 == check_number) {
        prizeStep = "1"
        hasPrize = true;
        resultTxt = lottoResult.wording.prize_1;
    }

    if(lottoResult.prize.prize_last3.filter(function(item) {
        return item == check_number.substring(3, 6);
    }).length == 1 && !hasPrize) {
        prizeStep = "_last3"
        hasPrize = true;
        resultTxt = lottoResult.wording.prize_last3;
    }

    if(lottoResult.prize.prize_first3.filter(function(item) {
        return item == check_number.substring(0, 3);
    }).length == 1 && !hasPrize) {
        prizeStep = "_first3"
        hasPrize = true;
        resultTxt = lottoResult.wording.prize_first3;
    }


    if(lottoResult.prize.prize_last2 == check_number.substring(4) && !hasPrize) {
        prizeStep = "_last2"
        hasPrize = true;
        resultTxt = lottoResult.wording.prize_last2;
    }


    return {
        hasPrize: hasPrize,
        prizeStep: prizeStep,
        resultTxt: resultTxt
    }
}


module.exports = {
    getLottoResultPerDate,
    getLottoDateList,
    checkNumberHasPrize
};