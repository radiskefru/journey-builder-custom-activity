'use strict';

const axios = require('axios');
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', '..', 'lib', 'jwtDecoder.js'));
const helper = require(Path.join(__dirname, '..', 'helper.js'));

exports.edit = function (req, res) {
    helper.logData(req);
    res.send(200, 'Edit');
};

exports.save = function (req, res) {
    helper.logData(req);
    res.send(200, 'Save');
};

exports.execute = function (req, res) {
    JWT(req.body, process.env.jwtSecret, (err, decoded) => {
        if (err) {
            console.error(err);
            return res.status(401).end();
        }

        if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
            var decodedArgs = decoded.inArguments[0];
            console.log('inArguments', JSON.stringify(decoded.inArguments));
            console.log('decodedArgs', JSON.stringify(decodedArgs));

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Key ${process.env.BLIPAUTHORIZATIONKEY}`
            }

            const phoneNumber = decodedArgs['phoneNumber'];
            const templateName = decodedArgs['templateName'];

            const guid_id = helper.uuid();

            const post_save = {
                "id": guid_id,
                "to": "postmaster@wa.gw.msging.net",
                "method": "get",
                "uri": `lime://wa.gw.msging.net/accounts/+${phoneNumber}`
            }

            axios.post('https://msging.net/commands', post_save, { headers: headers }).then((res) => {
                const post_hsm = {
                    "id": guid_id,
                    "to": `${phoneNumber}@wa.gw.msging.net`,
                    "type": "application/json",
                    "content": {
                        "type": "hsm",
                        "hsm": {
                            "namespace": "0cf88f37_b88f_d3bd_b5be_f22588aabf89",
                            "element_name": templateName,
                            "fallback_lg": "pt",
                            "fallback_lc": "BR",
                            "localizable_params": []
                        }
                    }
                }

                axios.post('https://msging.net/messages', post_hsm, { headers: headers }).then((res) => {
                    console.log(`Success send whatsapp to ${phoneNumber}`);
                }).catch((err) => {
                    console.log(`ERROR send whatsapp to ${phoneNumber}: ${err}`)
                })
            }).catch((err) => {
                console.log(`ERROR verify whatsapp to ${phoneNumber}: ${err}`)
            })


            helper.logData(req);
            res.send(200, 'Execute');
        } else {
            console.error('inArguments invalid.');
            return res.status(400).end();
        }
    });
};

exports.publish = function (req, res) {
    helper.logData(req);
    res.send(200, 'Publish');
};

exports.validate = function (req, res) {
    helper.logData(req);
    res.send(200, 'Validate');
};