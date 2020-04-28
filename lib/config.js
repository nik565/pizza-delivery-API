/**
 * Create and export configuration variables
 */

 // Container for all environments
 const environments = {};

 //Staging {default} environment
 environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging',
    'hashingSecret': 'IronMan',
    'mailgun': {
       'api_key': 'mailgun_sandbox_api_key'
    },
    'stripe': {
       'test_key': 'stripe_test_key'
    },
    'templateGlobals': {
       'appName': 'PizzaSquare',
       'companyName': 'PizzaSquare, Inc',
       'yearCreated': '2020',
       'baseUrl': 'http://localhost:3000/'
    }
 };

 //Production environment
 environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashingSecret': 'CaptainAmerica',
    'mailgun': {
       'api_key': ''
    },
    'stripe': {
       'prod_key': ''
    },
    'templateGlobals': {
       'appName': 'PizzaSquare',
       'companyName': 'PizzaSquare, Inc',
       'yearCreated': '2020',
       'baseUrl': 'http://localhost:5000/'
    }
 };

 // Determine which environment was passed as command-line argument
 const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

 // Check that currnent environment is one of the environment above, if not, default to staging
const environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;