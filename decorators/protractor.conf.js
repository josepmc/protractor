let baseConfig = require('./config/register')({
    env: 'local',
    browser: 'puppeteer'
});

exports.config = {
    ...baseConfig.config,
    specs: [
        // Add your tests here
        'tests/google.feature'
    ],
}
