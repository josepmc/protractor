let baseConfig = require('./config/register')({
    env: 'local',
    browser: 'chrome'
});

exports.config = {
    ...baseConfig.config,
    specs: [
	// Add your tests here
    ],
}
