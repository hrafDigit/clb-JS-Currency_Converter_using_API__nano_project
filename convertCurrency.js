document.addEventListener('DOMContentLoaded', () => {
    const baseUrl = "https://api.frankfurter.app";
    const fromAmount = document.getElementById('fromAmount');
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');
    const toAmount = document.getElementById('toAmount');
    const warning = document.getElementById('warning');

    async function fetchCurrencies() {
        const response = await fetch(`${baseUrl}/currencies`);
        const data = await response.json();
        return data;
    }

    async function generateSelectOptions() {
        const currencies = await fetchCurrencies();
        const keysInCurrenciesArray = Object.keys(currencies);
        keysInCurrenciesArray.forEach(currencyCode => {
            const currencyName = currencies[currencyCode];
            const option = document.createElement('option');
            option.value = currencyCode;
            option.textContent = `${currencyCode} (${currencyName})`;
            fromCurrencySelect.appendChild(option.cloneNode(true));
            toCurrencySelect.appendChild(option);
        });
    }

    generateSelectOptions();

    async function fetchRates(base = 'EUR') {
        const response = await fetch(`${baseUrl}/latest?base=${base}`);
        const data = await response.json();
        return data.rates;
    }

    async function convert() {
        try {
            const rates = await fetchRates();
            const fromCurrency = fromCurrencySelect.value;
            const toCurrency = toCurrencySelect.value;

            if (fromCurrency === 'empty' || toCurrency === 'empty') {
                throw new Error("N'oubliez pas de choisir toutes les devises");
            }

            const conversionRate = rates[toCurrency];
            if (!conversionRate) {
                throw new Error("Les taux de change ne sont pas valables pour la devise séléctionnée");
            }

            const userInput = parseFloat(fromAmount.value);
            if (isNaN(userInput)) {
                throw new Error("Saisisez un nombre pour convertir !");
            }
            else if (userInput <= 0) {
                throw new Error("Saisisez un montant supérieur à 0 !");
            }
            else if (userInput <= 0) {
                throw new Error("Saisisez un montant à convertir !");
            }

            const convertedAmount = userInput * conversionRate;
            toAmount.value = convertedAmount.toFixed(2);
            warning.textContent = '';
        } catch (error) {
            warning.textContent = error.message;
            toAmount.value = '';
        }
    }

    fromAmount.addEventListener('input', convert);
    fromCurrencySelect.addEventListener('change', convert);
    toCurrencySelect.addEventListener('change', convert);
});
