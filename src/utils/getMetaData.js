const axios = require('axios');
module.exports = (symbols) => {

    return axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/info', {
        params:{
            symbol: symbols
        },
        headers:{
            'X-CMC_PRO_API_KEY': '153b7674-87f4-4648-87a3-1c282cad2931'
        }
    });
}