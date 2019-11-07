'use strict';

const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
const util = require('util');
const axios = require('axios');

exports.logExecuteData = [];

function logData(req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path,
        host: req.host,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    console.log("body: " + util.inspect(req.body));
    console.log("headers: " + util.inspect(req.headers));
    console.log("trailers: " + req.trailers);
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.host);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);
}

exports.edit = function (req, res) {
    logData(req);
    res.send(200, 'Edit');
};

exports.save = function (req, res) {
    logData(req);
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
            console.log('decodedArgs', JSON.stringify());

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Key ${process.env.BLIPAUTHORIZATIONKEY}`
            }

            const phoneNumber = decodedArgs['phoneNumber'];
            console.log('phoneNumber', phoneNumber);

            const post_data = {
                "id": "123e4567-e89b-12d3-a456-426655440002",
                "to": `${phoneNumber}@wa.gw.msging.net`,
                "type": "application/json",
                "content": {
                    "type": "hsm",
                    "hsm": {
                        "namespace": "0cf88f37_b88f_d3bd_b5be_f22588aabf89",
                        "element_name": "ticket_template1",
                        "fallback_lg": "pt",
                        "fallback_lc": "BR",
                        "localizable_params": []
                    }
                }
            }

            axios.post('https://msging.net/messages', post_data, { headers: headers }).then((res) => {
                console.log(`Sucess send whatsapp to ${phoneNumber}`);
            }).catch((err) => {
                console.log(`ERROR send whatsapp to ${phoneNumber}: ${err}`)
            })

            logData(req);
            res.send(200, 'Execute');
        } else {
            console.error('inArguments invalid.');
            return res.status(400).end();
        }
    });
};

exports.publish = function (req, res) {
    logData(req);
    res.send(200, 'Publish');
};

exports.validate = function (req, res) {
    logData(req);
    res.send(200, 'Validate');
};