const axios = require('axios');
const openrates_url = 'https://api.openrates.io/latest?base=';

const rates = {}
const to = null;

function getRates(currency) {
	if (!rates[currency]) {
		const result = await axios.get(openrates_url + currency.toUpperCase())

		result.data.rates.forEach((rate, currency) => {
			if (!rates[result.data.base]) {
				rates[result.data.base] = {}
			}

			rates[result.data.base][currency] = rate;
			rates[currency][result.data.base] = 1 / rate;
		});
	}
}

module.exports.to = function(currency) {
	getRates(currency);

	to = currency;

	return this;
}

module.exports.from = function(amount, currency) {
	getRates(currency);

	return amount * rates[currency][to];
}
