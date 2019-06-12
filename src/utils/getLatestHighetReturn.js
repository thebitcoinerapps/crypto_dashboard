const axios = require('axios');

 module.exports = axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
    params:{
        start: '10',
        limit: '10',
        convert: 'USD',
        sort: "percent_change_7d"
    },
    headers:{
        'X-CMC_PRO_API_KEY': '153b7674-87f4-4648-87a3-1c282cad2931'
    }
});