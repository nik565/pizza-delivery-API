/**
 *  Request handlers
 */

// Dependencies
const _data = require('../lib/data');
const helpers = require('./helpers');
const config = require('./config');
const pizzaMenus = require('../data/menu/pizza.json');
const util = require('util');
const debug = util.debuglog('handlers');

//Define the handler
const handlers = {};

// Users handler
handlers.users = (data, done) => {
    const acceptableMethods = ['post', 'get', 'delete', 'put'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, done);
    } else {
        done(405);
    }
};

// Container for the users submethods
handlers._users = {};

/**
 *  HTML Handlers
 */

// Index handler
handlers.index = (data, done) => {

    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        const templateData = {
            'head.title': 'Pizza Aquare',
            'head.description': `No matter what the situation, pizza always helps.`,
            'body.class': 'index'
        };

        // Get template as a string
        getTemplate('index', templateData, done);
    } else {
        done(405, undefined, 'html');
    }
}

// Create Account
handlers.accountCreate = (data, done) => {

    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        const templateData = {
            'head.title': 'Create an account',
            'head.description': 'Sign up is easy and only takes a few seconds.',
            'body.class': 'accountCreate'
        };

        // Get template as a string
        getTemplate('accountCreate', templateData, done);
    } else {
        done(405, undefined, 'html');
    }
}

// Create New Session
handlers.sessionCreate = (data, done) => {

    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        const templateData = {
            'head.title': 'Login to your Account',
            'head.description': 'Please enter your Email ID and password to access your account.',
            'body.class': 'sessionCreate'
        };

        // Get template as a string
        getTemplate('sessionCreate', templateData, done);
    } else {
        done(405, undefined, 'html');
    }
}

// Session has been deleted
handlers.sessionDeleted = (data, done) => {

    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        const templateData = {
            'head.title': 'Logged Out',
            'head.description': 'You have been logged out of your account.',
            'body.class': 'sessionDeleted'
        };

        // Get template as a string
        getTemplate('sessionDeleted', templateData, done);
    } else {
        done(405, undefined, 'html');
    }
}

// Edit your account
handlers.accountEdit = (data, done) => {

    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        const templateData = {
            'head.title': 'Account Edit',
            'body.class': 'accountEdit'
        };

        // Get template as a string
        getTemplate('accountEdit', templateData, done);
    } else {
        done(405, undefined, 'html');
    }
}

// Account has been deleted
handlers.accountDeleted = (data, done) => {

    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        const templateData = {
            'head.title': 'Account Deleted',
            'head.description': 'Your account has been deleted',
            'body.class': 'accountDeleted'
        };

        // Get template as a string
        getTemplate('accountDeleted', templateData, done);
    } else {
        done(405, undefined, 'html');
    }
}

// Load menu page
handlers.getMenu = (data, done) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        const templateData = {
            'head.title': 'Menu',
            'body.class': 'menuPage'
        };

        // Get template as a string
        getTemplate('menuPage', templateData, done);
    } else {
        done(405, undefined, 'html');
    }
}

// Users cart page
handlers.cartPage = (data, done) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        const templateData = {
            'head.title': 'Cart',
            'body.class': 'cartPage'
        };

        // Get template as a string
        getTemplate('cartPage', templateData, done);
    } else {
        done(405, undefined, 'html');
    }
}

// Create Order Page
handlers.createOrder = (data, done) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        const templateData = {
            'head.title': 'Place Order',
            'body.class': 'orderCreatePage'
        };

        // Get template as a string
        getTemplate('orderCreatePage', templateData, done);
    } else {
        done(405, undefined, 'html');
    }
}

// payment success page
handlers.orderSuccessfulPage = (data, done) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Prepare data for interpolation
        const templateData = {
            'head.title': 'Success',
            'body.class': 'orderSuccess'
        };

        // Get template as a string
        getTemplate('orderSuccess', templateData, done);
    } else {
        done(405, undefined, 'html');
    }
}

// Favicon
handlers.favicon = (data, done) => {

    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Read in favicon's data
        helpers.getStaticAsset('favicon.ico', (err, data) => {

            if (!err && data) {

                done(200, data, 'favicon');
            } else {
                done(500);
            }
        });
    } else {
        done(405);
    }
}

// Public assets
handlers.public = (data, done) => {

    // Reject any request that isn't a GET
    if (data.method == 'get') {

        // Get the fileName being requested
        const trimmedAssestName = data.trimmedPath.replace('public/', '').trim();
        if (trimmedAssestName.length > 0) {

            // Read in the asset's data
            helpers.getStaticAsset(trimmedAssestName, (err, data) => {

                if (!err && data) {

                    // Determine the content type (defaut to plain text)
                    let contentType = 'plain';

                    if (trimmedAssestName.indexOf('.css') > -1) {
                        contentType = 'css';
                    }

                    if (trimmedAssestName.indexOf('.png') > -1) {
                        contentType = 'png';
                    }

                    if (trimmedAssestName.indexOf('.jpg') > -1) {
                        contentType = 'jpg';
                    }

                    if (trimmedAssestName.indexOf('.ico') > -1) {
                        contentType = 'favicon';
                    }

                    // Return the data
                    done(200, data, contentType);
                } else {
                    done(404);
                }
            });
        } else {
            done(404);
        }
    } else {
        done(405);
    }
}

/**
 *  JSON API handlers
 */

// Users - post
// Required data: name, emailId, street_Address, password
// Optional data: none
handlers._users.post = (data, done) => {

    // Check that all required fields are filled out
    const name = typeof (data.payload.name) == 'string' &&
        data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
    const emailId = typeof (data.payload.emailId) == 'string' &&
        data.payload.emailId.trim().length > 0 ? data.payload.emailId.trim() : false;
    const street_Address = typeof (data.payload.street_Address) == 'string' &&
        data.payload.street_Address.trim().length > 0 ? data.payload.street_Address.trim() : false;
    const password = typeof (data.payload.password) == 'string' &&
        data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (name && password && emailId && street_Address) {

        const emailIdInLowerCase = emailId.toLowerCase();
        // Make sure the user doesn't already exist
        _data.read('users', emailIdInLowerCase, (err, data) => {
            if (err) {
                // Hash the password
                const hashedPassword = helpers.hash(password);
                if (hashedPassword) {
                    // Create the user Object
                    const userObject = {
                        'name': name,
                        'emailId': emailIdInLowerCase,
                        'password': hashedPassword,
                        'street_Address': street_Address,
                        'cart': [],
                        'ordersPlaced': [],
                        'creationDate': Date.now()
                    };

                    // Strore the user
                    _data.create('users', emailIdInLowerCase, userObject, err => {
                        if (!err) {
                            done(200);
                        } else {
                            debug(err);
                            done(500, { 'Error': 'Could not create the new user' });
                        }
                    });
                } else {
                    done(500, { 'Error': 'Could hash the user\'s password' });
                }
            } else {
                done(400, { 'Error': 'A user with that email address already exists!' });
            }
        });

    } else {
        done(400, { 'Error': 'Missing required fields' });
    }

};

// Users - get
// Requires data: emailId
// Optional data: none
handlers._users.get = (data, done) => {

    // Check that the emailId provided is valid
    const emailId = typeof (data.queryStringObject.emailId) == 'string' &&
        data.queryStringObject.emailId.trim().length > 0 ? data.queryStringObject.emailId.trim() : false;

    if (emailId) {

        const emailIdInLowerCase = emailId.toLowerCase();

        // Get the token from the headers
        const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

        // Verfiy that the given token is valid for the given user
        handlers._tokens.verify(token, emailIdInLowerCase, tokenIsValid => {
            if (tokenIsValid) {
                // Lookup the user
                _data.read('users', emailIdInLowerCase, (err, data) => {
                    if (!err && data) {
                        // Remove the hashed password from the user object before returning it to the requester
                        delete data.password;
                        delete data.ordersPlaced;
                        done(200, data);
                    } else {
                        done(404);
                    }
                });
            } else {
                done(403, { 'Error': 'Missing required token in header or the token is invalid' });
            }
        });
    } else {
        done(400, { 'Error': 'Missing required field' });
    }
};

// Users - put
// Required data: emailId
// Optional data: name, street_Address, password, cartItem (at least one must be present)
handlers._users.put = (data, done) => {

    // Check for the required field
    const emailId = typeof (data.payload.emailId) == 'string' &&
        data.payload.emailId.trim().length > 0 ? data.payload.emailId.trim() : false;

    // Check for optional field
    const name = typeof (data.payload.name) == 'string' &&
        data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
    const password = typeof (data.payload.password) == 'string' &&
        data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    const street_Address = typeof (data.payload.street_Address) == 'string' &&
        data.payload.street_Address.trim().length > 0 ? data.payload.street_Address.trim() : false;
    // const cartItem = typeof (data.payload.cartItem) == 'string' &&
    //     data.payload.cartItem.trim().length > 0 ? data.payload.cartItem.trim() : false;

    // Error if emailId is invalid
    if (emailId) {
        // Error if nothing is sent to update
        if (name || password || street_Address) {

            const emailIdInLowerCase = emailId.toLowerCase();

            // Get the token from the headers
            const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

            // Verfiy that the given token is valid for the given user

            handlers._tokens.verify(token, emailIdInLowerCase, tokenIsValid => {
                if (tokenIsValid) {
                    // Lookup the user
                    _data.read('users', emailIdInLowerCase, (err, userData) => {
                        if (!err && userData) {
                            // update the fields necessary
                            if (name) {
                                userData.name = name;
                            }
                            if (street_Address) {
                                userData.street_Address = street_Address;
                            }
                            if (password) {
                                userData.password = helpers.hash(password);
                            }

                            // Store the new updates
                            _data.update('users', emailIdInLowerCase, userData, err => {
                                if (!err) {
                                    done(200);
                                } else {
                                    debug(err);
                                    done(500, { 'Error': 'Could not update the user' });
                                }
                            });
                        } else {
                            done(400, { 'Error': 'The specified user doesn\'t exist' });
                        }
                    });
                } else {
                    done(403, { 'Error': 'Missing required token in header or the token is invalid' });
                }
            });

        } else {
            done(400, { 'Error': 'Missing fields to update' });
        }
    } else {
        done(400, { 'Error': 'Missing required field' });
    }
};

// Users - delete
// Required data: emailId
handlers._users.delete = (data, done) => {

    // Check for the required field
    const emailId = typeof (data.queryStringObject.emailId) == 'string' &&
        data.queryStringObject.emailId.trim().length > 0 ? data.queryStringObject.emailId.trim() : false;

    if (emailId) {

        const emailIdInLowerCase = emailId.toLowerCase();

        // Get the token from the headers
        const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

        // Verfiy that the given token is valid for the given user
        handlers._tokens.verify(token, emailIdInLowerCase, tokenIsValid => {
            if (tokenIsValid) {
                // Check if User exists
                _data.read('users', emailIdInLowerCase, (err, userData) => {
                    if (!err && userData) {
                        // Delete the user
                        _data.delete('users', emailIdInLowerCase, err => {
                            if (!err) {

                                // Delete all the orders created by the user
                                const userOrders = typeof (userData.ordersPlaced) == 'object' &&
                                    userData.ordersPlaced instanceof Array ? userData.ordersPlaced : [];
                                const ordersToDelete = userOrders.length;

                                if (ordersToDelete > 0) {
                                    let deletionErrors = false;
                                    let ordersDeleted = 0;

                                    userOrders.forEach(orderId => {
                                        _data.delete('orders', orderId, err => {
                                            if (err) {
                                                deletionErrors = true;
                                            }
                                            ordersDeleted++;
                                            if (ordersDeleted == ordersToDelete) {
                                                if (!deletionErrors) {
                                                    done(200);
                                                } else {
                                                    done(500, { 'Error': 'Errors encountered while atempting to delete user\'s order, all orders may not have been deleted from the system' });
                                                }
                                            }
                                        });
                                    });
                                } else {
                                    done(200);
                                }

                            } else {
                                done(500, { 'Error': 'Couldn\'t delete the specified user' });
                            }
                        });
                    } else {
                        done(400, { 'Error': 'The specified user doesn\'t exist' });
                    }
                });
            } else {
                done(403, { 'Error': 'Missing required token in header or the token is invalid' });
            }
        });
    } else {
        done(400, { 'Error': 'Missing required field' });
    }
};

// Cart
handlers.cart = (data, done) => {
    const acceptableMethods = ['post', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._cart[data.method](data, done);
    } else {
        done(405);
    }
}

// Container for all cart sub methods
handlers._cart = {};

// Cart - post
// Required data: emailId, itemId
// Optional data: none
handlers._cart.post = (data, done) => {

    // Check that all required fields are filled out
    const emailId = typeof (data.payload.emailId) == 'string' &&
        data.payload.emailId.trim().length > 0 ? data.payload.emailId.trim() : false;
    const itemId = typeof (data.payload.itemId) == 'number' ?
        data.payload.itemId : false;


    if (emailId && itemId) {

        // Get the token from the headers
        const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

        const emailIdInLowerCase = emailId.toLowerCase();

        // Verfiy that the given token is valid for the given user
        handlers._tokens.verify(token, emailIdInLowerCase, tokenIsValid => {
            if (tokenIsValid) {
                // Make sure the user exists
                _data.read('users', emailIdInLowerCase, (err, userData) => {
                    if (!err && data) {

                        const item = pizzaMenus.items.find(item => item.id === itemId);
                        userData.cart.push(item);
                        // Store the new updates
                        _data.update('users', emailIdInLowerCase, userData, err => {
                            if (!err) {
                                done(200);
                            } else {
                                debug(err);
                                done(500, { 'Error': 'Could not update the user' });
                            }
                        });
                    } else {
                        done(404, { 'Error': 'User does not exist!' });
                    }
                });
            } else {
                done(403, { 'Error': 'Missing required token in header or the token is invalid' });
            }
        });
    } else {
        done(400, { 'Error': 'Missing required fields' });
    }

};

// Cart - delete
// Required data: emailId, itemId
// Optional data: none
handlers._cart.delete = (data, done) => {

    // Check that all required fields are filled out
    const emailId = typeof (data.payload.emailId) == 'string' &&
        data.payload.emailId.trim().length > 0 ? data.payload.emailId.trim() : false;
    const itemId = typeof (data.payload.itemId) == 'number' ?
        data.payload.itemId : false;

    if (emailId && itemId) {


        // Get the token from the headers
        const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

        const emailIdInLowerCase = emailId.toLowerCase();

        // Verfiy that the given token is valid for the given user
        handlers._tokens.verify(token, emailIdInLowerCase, tokenIsValid => {
            if (tokenIsValid) {
                // Make sure the user exists
                _data.read('users', emailIdInLowerCase, (err, userData) => {
                    if (!err && data) {

                        const index = userData.cart.findIndex(item => item.id == itemId)
                        userData.cart.splice(index, 1);
                        // Store the new updates
                        _data.update('users', emailIdInLowerCase, userData, err => {
                            if (!err) {
                                done(200);
                            } else {
                                debug(err);
                                done(500, { 'Error': 'Could not update the user' });
                            }
                        });
                    } else {
                        done(404, { 'Error': 'User does not exist!' });
                    }
                });
            } else {
                done(403, { 'Error': 'Missing required token in header or the token is invalid' });
            }
        });

    } else {
        done(400, { 'Error': 'Missing required fields' });
    }

};

// tokens haldnler
handlers.tokens = (data, done) => {
    const acceptableMethods = ['post', 'get', 'delete', 'put'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, done);
    } else {
        done(405);
    }
};

// Container for all the tokens submethod
handlers._tokens = {};

// tokens - post
// Required data : emailId, password
// Optional data : none
handlers._tokens.post = (data, done) => {

    // Check for the required fields
    const emailId = typeof (data.payload.emailId) == 'string' &&
        data.payload.emailId.trim().length > 0 ? data.payload.emailId.trim() : false;
    const password = typeof (data.payload.password) == 'string' &&
        data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (emailId && password) {

        const emailIdInLowerCase = emailId.toLowerCase();
        // Lookup the user
        _data.read('users', emailIdInLowerCase, (err, userData) => {
            if (!err && userData) {

                // Hash the password
                const hashedPassword = helpers.hash(password);
                if (hashedPassword == userData.password) {

                    // If valid, Generate a new token with random name, and set the expiry of 1 hour in future
                    const tokenId = helpers.createRandomString(20);
                    const expires = Date.now() + 1000 * 60 * 60;
                    const tokenObject = {
                        'emailId': emailIdInLowerCase,
                        'id': tokenId,
                        'expires': expires
                    };

                    // Strore the token
                    _data.create('tokens', tokenId, tokenObject, err => {
                        if (!err) {
                            done(200, tokenObject);
                        } else {
                            done(500, { 'Error': 'Could not create the token' });
                        }
                    });
                } else {
                    done(400, { 'Error': 'Password did not match' });
                }
            } else {
                done(400, { 'Error': 'Could not find the specified user' });
            }
        });
    } else {
        done(400, { 'Error': 'Missing required fields' });
    }
};

// tokens - get
// Required data: id
// Optional data: none
handlers._tokens.get = (data, done) => {

    // Check if the id is valid
    const id = typeof (data.queryStringObject.id) == 'string' &&
        data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id : false;

    if (id) {

        // Look up the token
        _data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                done(200, tokenData);
            } else {
                done(404);
            }
        });
    } else {
        done(400, { 'Error': 'Missing required fields' });
    }
};

// tokens - put
// Required data: id, extend
// Optional data: none
handlers._tokens.put = (data, done) => {

    // Sanity check the payload
    const id = typeof (data.payload.id) == 'string' &&
        data.payload.id.trim().length == 20 ? data.payload.id : false;
    const extend = typeof (data.payload.extend) == 'boolean' &&
        data.payload.extend == true ? true : false;

    if (id && extend) {

        // Look up the token
        _data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                // Check to make sure that token isn't already expired
                if (tokenData.expires > Date.now()) {
                    //  Set the expiration an hour from now
                    tokenData.expires = Date.now() + 1000 * 60 * 60;
                    // Store the new token
                    _data.update('tokens', id, tokenData, err => {
                        if (!err) {
                            done(200);
                        } else {
                            done(500, { 'Error': 'Could not update the token\'s expiration' });
                        }
                    });
                } else {
                    done(400, { 'Error': 'The token has already expired and cannnot be extended' });
                }
            } else {
                done(400, { 'Error': 'The specified token does not exsit' });
            }
        });
    } else {
        done(400, { 'Error': 'Missing required field(s) or field(s) are invalid' });
    }
};

// tokens - delete
// Required data: id
// Optional data: none
handlers._tokens.delete = (data, done) => {

    // Sanity check the id
    const id = typeof (data.queryStringObject.id) == 'string' &&
        data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;

    if (id) {

        // Look up the token
        _data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {

                // Delete the token
                _data.delete('tokens', id, err => {
                    if (!err) {
                        done(200);
                    } else {
                        done(500, { 'Error': 'Could not delete the token' });
                    }
                })
            } else {
                done(400, { 'Error': 'The specified token does not exist' });
            }
        })
    } else {
        done(400, { 'Error': 'Missing required field' });
    }
};

// Verify that a given token id is currently valid for a given user
handlers._tokens.verify = (id, emailId, done) => {

    // Lookup the token
    _data.read('tokens', id, (err, tokenData) => {

        if (!err && tokenData) {
            // Check that the token is for the given user and has not expired
            if (tokenData.emailId == emailId && tokenData.expires > Date.now()) {
                done(true);
            } else {
                done(false);
            }
        } else {
            done(false);
        }
    });
};

// Menu handler - GET
// Required data: emailId
// Optional data: none
handlers.menu = (data, done) => {
    if (data.method == 'get') {

        // Check for the required field
        const emailId = typeof (data.queryStringObject.emailId) == 'string' &&
            data.queryStringObject.emailId.trim().length > 0 ? data.queryStringObject.emailId.trim() : false;

        if (emailId) {

            const emailIdInLowerCase = emailId.toLowerCase();

            // Get the token from the headers
            const token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

            handlers._tokens.verify(token, emailIdInLowerCase, isTokenValid => {

                if (isTokenValid) {
                    done(false, pizzaMenus);
                } else {
                    done(400, { 'Error': 'Missing required token or token is invalid' });
                }
            });
        } else {
            done(400, { 'Error': 'Missing required field' });
        }
    } else {
        done(405);
    }
}

// Checkout
handlers.checkout = (data, done) => {
    const acceptableMethods = ['post'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._checkout[data.method](data, done);
    } else {
        done(405);
    }
}

// Container for checkout methods
handlers._checkout = {};

// checkout - GET
// Required Data: emailId,
// Optional data: none
handlers._checkout.post = (data, done) => {

    const emailId = typeof (data.payload.emailId) == 'string' &&
        data.payload.emailId.trim().length > 0 ? data.payload.emailId : false;

    if (emailId) {

        const emailIdInLowerCase = emailId.toLowerCase();

        _data.read('users', emailIdInLowerCase, (err, userData) => {
            if (!err && userData) {

                const cartData = userData.cart;
                const amount = helpers.calculateCheckoutAmount(cartData);

                // make the payment
                helpers.makePayment(amount, 'payment towards Dominos', 'usd', err => {

                    if (!err) {

                        // Update orders directory with order details
                        const orderId = helpers.createRandomString(20);
                        const orderObject = {
                            'id': orderId,
                            'creationDate': Date.now(),
                            'placedByUser': userData.name,
                            'userEmailId': userData.emailId,
                            'items': Array.from(userData.cart),
                            'totalAmount': amount
                        };

                        // Save the order
                        _data.create('orders', orderId, orderObject, err => {
                            if (!err) {

                                // Update user's cart and oders data and save it
                                userData.cart = [];
                                userData.ordersPlaced.push(orderId);
                                _data.update('users', emailIdInLowerCase, userData, err => {
                                    if (!err) {

                                        debug('Payment success!');
                                        // mail invoice to user (could have been done as the background proccess)
                                        const invoiceMsg = `Dear ${userData.name}!
                                    Thank you for choosing Pizza Square!.
                                    
                                    You have successfully paid ${amount}$ for your order on ${new Date().toLocaleDateString()}.
                                    
                                    With Regards,
                                    John
                                    Pizza Square Team`;
                                        const data = {
                                            msg: invoiceMsg,
                                            userEmailId: emailIdInLowerCase,
                                            subject: 'INVOICE',
                                        };
                                        helpers.sendMail(data, err => {
                                            if (!err) {
                                                debug('Mail sent successfully to the user');
                                            } else {
                                                debug('Error while sending mail to the user');
                                            }
                                            done(200);
                                        })
                                    } else {
                                        done(400, { 'Error': 'Could not update users cart' });
                                    }
                                });
                            } else {
                                debug(err);
                                done(500, { 'Error': 'Could not create the new user' });
                            }
                        });
                    } else {
                        console.error('Payment failed!');
                        done(400, { 'Error': 'Payment failed' });
                    }
                })
            } else {
                done(404);
            }
        })
    } else {
        done(400, { 'Error': 'Missing required fields' });
    }
}

// Not Found Handler
handlers.notFound = (data, done) => {
    done(404, { 'Error': 'Page Not Found' });
};

// Generic method to get Template
const getTemplate = (templateName, templateData, done) => {

    // Read in a template as a string
    helpers.getTemplate(templateName, templateData, (err, str) => {

        // Add universal header and footer
        if (!err && str) {

            helpers.addUniversalTemplates(str, templateData, (err, pageString) => {

                if (!err && pageString) {

                    // Return that page as HTML
                    done(200, pageString, 'html');
                } else {
                    done(500, undefined, 'html');
                }
            });
        } else {
            done(500, undefined, 'html');
        }
    });
};

// export the module
module.exports = handlers;