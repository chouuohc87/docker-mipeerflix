var request = require('request');

request({
	url: 'https://ipecho.net/plain',
	headers: {
		'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
	}
}, function(error, response, body) {
	if (!error && response.statusCode == 200) {
		console.log(body);
	}
});
