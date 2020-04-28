/**
 *  Helpers for varios tasks
 */

//Dependencies
const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const queryString = require('querystring');
const pizzaMenus = require('../data/menu/pizza.json');
const path = require('path');
const fs = require('fs');

// Container for all helpers
const helpers = {};

// Create a SHA256 hash
helpers.hash = str => {
    if (typeof (str) == 'string' && str.length > 0) {
        return crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    } else {
        return false;
    }
};

// Parse a JSON string to an object in all cases, without thrwing any error
helpers.parseJsonToObject = str => {
    try {
        return JSON.parse(str);
    } catch (error) {
        console.log('Error parsing body: ', error);
        return {};
    }
};

// Generate a string of random alphanumeric characters, of a given length
helpers.createRandomString = strLength => {

    // Sanity check of strLength
    strLength = typeof (strLength) == 'number' && strLength > 0 ? strLength : false;

    if (strLength) {

        // Define all possible characters that could go in to the string
        const possibleCharactersString = 'abcdefghijklmnopqrstuvwxyz0123456789';

        // Start the final string
        let str = '';
        let count = 0;
        while (count < 20) {
            // Get a random character from the possibleCharacters string
            const randomSCharacter = possibleCharactersString.charAt(Math.floor(Math.random() * possibleCharactersString.length));
            // Append this chracter to the final string
            str += randomSCharacter;
            count++;
        }

        // Return the string;
        return str;
    } else {
        return false;
    }

};

// Make payment via stripe.com
helpers.makePayment = (amount, desc, currency, done) => {

    // Verify the input (Minimum amount allowed is 50 USD)
    amount = typeof (amount) == 'number' && amount > 50 ? amount : false;

    const payload = {
        'amount': amount,
        'currency': currency,
        'description': desc,
        'source': 'tok_visa'
    }

    const stringPayload = queryString.stringify(payload);

    const requestDetails = {
        'protocol': 'https:',
        'hostname': 'api.stripe.com',
        'method': 'POST',
        'path': '/v1/charges',
        'auth': `${config.stripe.test_key}`
    }

    const req = https.request(requestDetails, res => {
        // Grab the status of the sent request
        const status = res.statusCode;

        // console.log('Stripes response: ', res.statusCode);

        // Callback if the request successfully went through
        if (status == 200 || status == 201) {
            done(false);
        } else {
            done(`Status code returned was ${status}`);
        }
    });

    // Bind to the error event so it doesn't get thrown
    req.on('error', err => {
        done(err);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();
};


// Sending mail via mailgun
helpers.sendMail = (data, done) => {

    const payload = {
        from: 'mailgun@sandboxa1d116d3083241ad8e3b92f35528a92b.mailgun.org',
        to: data.userEmailId,
        subject: data.subject,
        text: data.msg
    }

    const stringPayload =  queryString.stringify(payload);

    const requestDetails = {
        'protocol': 'https:',
        'hostname': 'api.mailgun.net',
        'method': 'POST',
        'path': '/v3/sandboxa1d116d3083241ad8e3b92f35528a92b.mailgun.org/messages',
        'auth': `api:${config.mailgun.api_key}`,
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(stringPayload)
        }
    }

    const req = https.request(requestDetails, res => {
        // Grab the status of the sent request
        const status = res.statusCode;

        // console.log('Mailgun response: ', res.statusMessage);

        // Callback if the request successfully went through
        if (status == 200 || status == 201) {
            done(false);
        } else {
            done(`Status code returned was ${status}`);
        }
    });

    // Bind to the error event so it doesn't get thrown
    req.on('error', err => {
        done(err);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();
}

// Calculate toatal checkout amount
helpers.calculateCheckoutAmount = (cartData) => {

    let totalAmount = 0;

    cartData.forEach(item => {
        totalAmount += item['price'];
    });

    return totalAmount;
}

// Get the string content of a template
helpers.getTemplate = (templateName, data, done) => {

    // Sanity check the input
    templateName = typeof (templateName) == 'string' && templateName.length > 0 ? templateName : false;
    data = typeof (data) == 'object' && data !== null ? data : {};

    if (templateName) {

        const templateDir = path.join(__dirname, '/../templates/');
        fs.readFile(`${templateDir}${templateName}.html`, 'utf8', (err, str) => {

            if (!err && str.length > 0) {

                // Do interpolation on the string
                const finalString = helpers.interpolate(str, data);
                done(false, finalString);
            } else {
                done('No template could be found');
            }
        });
    } else {
        done('A valid template name is not specified');
    }
}

// Add the universal header and footer to a string, and pass the provided data object to the header and footer for interpolation
helpers.addUniversalTemplates = (str, data, done) => {

    // Sanity check the input
    templateName = typeof (templateName) == 'string' && templateName.length > 0 ? templateName : false;
    data = typeof (data) == 'object' && data !== null ? data : {};

    // Get the Header
    helpers.getTemplate('_header', data, (err, headerString) => {

        if(!err && headerString) {

            // Get the Footer
            helpers.getTemplate('_footer', data, (err, footerString) => {

                if(!err && footerString) {

                    // Add them all together
                    const fullString = headerString + str + footerString;
                    done(false, fullString);
                } else {
                    done('Could not find the footer template');
                }
            });
        } else {
            done('Could not find the header template');
        }
    });
}

// Take a given string and a data object and find/replace all the keys within it
helpers.interpolate = (str, data) => {

    // Sanity check
    str = typeof (str) == 'string' && str.length > 0 ? str : '';
    data = typeof (data) == 'object' && data !== null ? data : {};

    // Add the templateGlobals to the data object, prepending their key name with "global"
    for (const key in config.templateGlobals) {
        if (config.templateGlobals.hasOwnProperty(key)) {
            data[`global.${key}`] = config.templateGlobals[key];
        }
    }

    // For each key in the data object, insert it's value into the string at the coresponding placeholder
    for (const key in data) {
        if (data.hasOwnProperty(key) && typeof data[key] == 'string') {
            const replace = data[key];
            const find = '{' + key + '}';
            str = str.replace(find, replace);
        }
    }

    return str;
}

// Get the contents of a static (public) asset
helpers.getStaticAsset = (fileName, done) => {

    // Santiy check
    fileName = typeof (fileName) == 'string' && fileName.length > 0 ? fileName : false;

    if(fileName) {

        const publicDir = path.join(__dirname, '/../public/');
        fs.readFile(`${publicDir}${fileName}`, (err, data) => {

            if(!err && data) {

                done(false, data);
            } else {
                done('No file could be found');
            }
        });
    } else {
        done('A valid file name was not specified');
    }
}

// Export the module
module.exports = helpers;


