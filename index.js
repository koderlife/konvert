const axios = require('axios');
const openrates_url = 'https://api.openrates.io/latest?base=';

const rates = {}
const to = null;

async function getRates(currency) {
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

module.exports = async function(amount, currency, dest = to) {
	await getRates(dest);

	return amount * rates[currency][dest];
}

module.exports.to = function(currency) {
	to = currency;

	return this;
}
