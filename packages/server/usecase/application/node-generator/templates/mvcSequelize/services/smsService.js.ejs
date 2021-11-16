const axios = require('axios')
const sendSms = async (obj) => {
    console.log('SMS---', obj);
    if (obj.to) {
        obj.mobiles = obj.to;
    }
    let mobiles;
    if (Array.isArray(obj.mobiles)) {
        obj.mobiles = obj.mobiles.map((m) => {
            let tmpNo = m.split('+');
            return tmpNo[1] ? tmpNo[1] : tmpNo[0];
        });
        mobiles = obj.mobiles.join(',');
    }
    else {
        let tmpNo = obj.mobiles.split('+');
        mobiles = tmpNo[1] ? tmpNo[1] : tmpNo[0];
    }
    const message = obj.message
    const userid = ""
    const password = escape("You Password")
    const v = 1.1
    const method = "sendMessage"
    const msg_type = "text"
    const send_to = mobiles
    return await new Promise((resolve, reject) => {
        axios(
            {
                url: `http://enterprise.smsgupshup.com/GatewayAPI/rest?msg=${message}&v=${v}&userid=${userid}&password=${password}&method=${method}&send_to=${send_to}&msg_type=${msg_type}`,
                method: 'GET',
            })
            .then(function (response) {
                let response1 = response.data.split('|');
                console.log(response.data)
                if (response1.length) {
                    if (response1[0].trim() === 'error') {
                        reject(response)
                    } else {
                        resolve(response)
                    }
                }
            })
            .catch(function (error) {
                reject(error)
            });
    });
}
module.exports = sendSms