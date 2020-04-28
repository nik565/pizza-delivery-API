/**
 * Primary file for the API
 */

// Dependencies
const server = require('./lib/server');
const cli = require('./lib/cli');

// Declare the application
const app = {};

// initialize the application
app.init = () => {

    // Start the server
    server.init();

    // Start the CLI, but make sure it starts last
    setTimeout(() => {
        cli.init();
    }, 50);

};

// Execute the application
app.init();