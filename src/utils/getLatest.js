const axios = require('axios');

 module.exports = axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
    params:{
        start: '1',
        limit: '1000',
        convert: 'USD',
        sort: 'market_cap'
    },
    headers:{
        'X-CMC_PRO_API_KEY': '153b7674-87f4-4648-87a3-1c282cad2931'
    }
});
