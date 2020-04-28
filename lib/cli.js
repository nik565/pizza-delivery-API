/**
 *  CLI-Related tasks
 */

// Depenedecies
const readline = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const _data = require('./data');
const menu = require('../data/menu/pizza.json');
const events = require('events');
class _events extends events { };
const e = new _events();

// Instantiate the CLI module
const cli = {};

// Input handlers
e.on('man', str => {
    cli.handlers.help();
});

e.on('help', str => {
    cli.handlers.help();
});

e.on('exit', str => {
    cli.handlers.exit();
});

e.on('list users', str => {
    cli.handlers.listUsers(str);
});

e.on('more user info', str => {
    cli.handlers.moreUserInfo(str);
});

e.on('list menu', str => {
    cli.handlers.listMenu();
});

e.on('list orders', str => {
    cli.handlers.listOrders();
});

e.on('more order info', str => {
    cli.handlers.moreOrderInfo(str);
});

// Responders object
cli.handlers = {};

// Man / Help
cli.handlers.help = () => {
    const commands = {
        'exit': 'Kill the CLI (and the rest of the application)',
        'man': 'Show this help page',
        'help': 'Alias of the "man" command',
        'list users': 'Show the list of all the users who have signed within 24 hours',
        'more user info --{emailId}': 'Show details of a specific user',
        'list menu': 'Show the list of all the menu items available',
        'list orders': 'Show a list of all the orders placed within 24 hours',
        'more order info --{orderId}': 'Show details of a specific order'
    };

    // Show a header for the help page that is as wide as screen
    cli.horizontalLine();
    cli.centered('CLI Manual');
    cli.horizontalLine();
    cli.verticalSpace(2);

    // Show each command, followed by its explanation, in white and yellow respectively
    for (const key in commands) {
        if (commands.hasOwnProperty(key)) {
            const value = commands[key];
            let line = `\x1b[33m${key}\x1b[0m`;
            const padding = 60 - line.length;
            for (let i = 0; i < padding; i++) {
                line += ' ';
            }
            line += value;
            console.log(line);
            cli.verticalSpace();
        }
    }
    cli.verticalSpace(1);

    // End with another horizintal line
    cli.horizontalLine();
}

// Create a vertical space
cli.verticalSpace = (lines) => {

    lines = typeof (lines) == 'number' && lines > 0 ? lines : 1;
    for (let i = 0; i < lines; i++) {
        console.log('');
    }
};

// Create a horizontal lines across the screen
cli.horizontalLine = () => {

    // Get the available screen size
    const width = process.stdout.columns;

    let line = '';
    for (let i = 0; i < width; i++) {
        line += '-';
    }

    console.log(line);
};

// Create centered text on the screen
cli.centered = (str) => {

    // Sanity check
    str = typeof (str) == 'string' && str.trim().length > 0 ? str : '';

    // Get the available screen size
    const width = process.stdout.columns;

    // Calculate the left padding there should be
    const leftPadding = Math.floor((width - str.length) / 2);

    // Put in left padded spaces before the string itself
    let line = '';
    for (let i = 0; i < leftPadding; i++) {
        line += ' ';
    }
    line += str;

    console.log(line);
}

// Exit
cli.handlers.exit = () => {
    process.exit(0);
}

// More user info
cli.handlers.moreUserInfo = (str) => {
    
    // Get ID from the string
    const arr = str.split('--');
    const emailId = typeof (arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;

    if(emailId) {
        
        const emailIdInLowerCase = emailId.toLowerCase();
        // Lookup the user
        _data.read('users', emailIdInLowerCase, (err, userData) => {
            if(!err && userData) {
                
                // Delete the hashed password
                delete userData.password;

                // Print the user with text highlighting
                console.dir(userData, {'colors': true});
                cli.verticalSpace();
            } else {
                console.log('Not a valid User!');
                cli.verticalSpace();
            }
        });
    }
}

// List Menu
cli.handlers.listMenu = () => {

    cli.verticalSpace();
    console.dir(menu.items, {'colors': true});
    cli.verticalSpace();
};

// List orders
cli.handlers.listOrders = () => {

    _data.list('orders', (err, orderIds) => {
        if (!err && orderIds && orderIds.length > 0) {
            cli.verticalSpace();
            orderIds.forEach(orderId => {
                _data.read('orders', orderId, (err, orderData) => {
                    if (!err && orderData) {
                        const orderCreationTimestamp = orderData.creationDate;
                        const creationDateWithinDate24Hours = (orderCreationTimestamp + 1000 * 60 * 60 * 24) - Date.now();
                        if(creationDateWithinDate24Hours > 0) {
                            const line = `OrderId: ${orderData.id}`;                            
                            console.log(line);
                            cli.verticalSpace();
                        }                        
                    }
                });
            });
        } else {
            console.log('Curently there are no Orders!');
            cli.verticalSpace();
        }
    });
}

// List more order info
cli.handlers.moreOrderInfo = (str) => {

    // Get ID from the string
    const arr = str.split('--');
    const orderId = typeof (arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;

    if(orderId) {
        
        // Lookup the user
        _data.read('orders', orderId, (err, orderData) => {
            if(!err && orderData) {

                // Print the user with text highlighting
                console.dir(orderData, {'colors': true});
                cli.verticalSpace();
            } else {
                console.log('Not a valid OrderID!');
                cli.verticalSpace();
            }
        });
    }
}

// List Users
cli.handlers.listUsers = (str) => {

    _data.list('users', (err, userEmailIds) => {
        if (!err && userEmailIds && userEmailIds.length > 0) {
            cli.verticalSpace();
            userEmailIds.forEach(emailId => {
                _data.read('users', emailId, (err, userData) => {
                    if (!err && userData) {
                        const userCreationTimestamp = userData.creationDate;
                        const creationDateWithinDate24Hours = (userCreationTimestamp + 1000 * 60 * 60 * 24) - Date.now();
                        if(creationDateWithinDate24Hours > 0) {
                            const line = `Name: ${userData.name} , EmailId: ${userData.emailId}`;                            
                            console.log(line);
                            cli.verticalSpace();
                        }                        
                    }
                });
            });
        } else {
            console.log('Curently there are no Users!');
            cli.verticalSpace();
        }
    });
}

// Input processor
cli.processInput = str => {

    // Sanity check
    str = typeof (str) == 'string' && str.trim().length > 0 ? str.trim().toLowerCase() : false;

    // Only process the inout if the user actually wrote something, otherwise ignore it
    if (str) {
        // Codify the unique strings that identify the unique questions allowed to be asked
        const uniqueStrings = [
            'man',
            'help',
            'exit',
            'list menu',
            'list users',
            'more user info',
            'list orders',
            'more order info',
        ];

        // Go through the possible input and emit an even when a match is found
        let matchFound = false;
        let counter = 0;

        uniqueStrings.some(input => {
            if (str.indexOf(input) > -1) {
                matchFound = true;

                // emit an even matching the unique input, and include the full string given by the user
                e.emit(input, str);
                return true;
            }
        });

        // If no match found, tell the user to try again
        if (!matchFound) {
            console.log('Sorry, try again!');
        }
    }
}

// Init Script
cli.init = () => {

    // Send the start message to the console, in dark blue
    console.log('\x1b[34m%s\x1b[0m', 'The CLI is running');

    // Strat the interface
    const _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: ''
    });

    // Create an initial prompt
    _interface.prompt();
    console.log('type "man" or "help" for list of available commands. Type "exit" to Exit the CLI');
    // Handle each line of input separately
    _interface.on('line', str => {

        // Send to the input processor
        cli.processInput(str);

        // Re-initialize the prompt afterwards
        _interface.prompt();
    });

    // If the user stops the CLI, kill the associated process
    _interface.on('close', () => {
        process.exit(0);
    });
}


// Export the module
module.exports = cli;