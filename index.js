const axios = require('axios');
const openrates_url = 'https://api.openrates.io/latest?base=';

const rates = {}

let to = null;

async function getRates(currency) {
	if (!rates[currency]) {
		const result = await axios.get(openrates_url + currency)

		Object.keys(result.data.rates).forEach(currency => {
			const rate = result.data.rates[currency];

			rates[result.data.base] = rates[result.data.base] || {}
			rates[currency] = rates[currency] || {}

			rates[result.data.base][currency] = rate;
			rates[currency][result.data.base] = 1 / rate;
		});
	}
}

module.exports.from = async function(amount, currency, dest = to) {
	currency = currency.toUpperCase();
	dest = dest.toUpperCase();
	await getRates(dest);

	return amount * rates[currency][dest];
}

module.exports.to = function(currency) {
	to = currency.toUpperCase();

	return this;
}
