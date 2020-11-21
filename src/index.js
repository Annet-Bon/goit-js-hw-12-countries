import './styles.css';
import fetchCountries from './js/fetchCountries.js';
import countriesListTemplate from './templates/countries-list.hbs';
import countryTemplate from './templates/country.hbs';
import error from './js/pnotify.js'

const debounce = require('lodash.debounce');
const refs = {
    countriesContainer: document.querySelector('.js-countries__wrapper'),
    countriesList: document.querySelector('.js-countries__list'),
    searchCountry: document.querySelector('.js-input'),
};

refs.searchCountry.addEventListener('input', debounce(onSearchInput, 500));

function renderCountryCard(countries) {
    let markup = null;
    if (countries.length === 1) {
        markup = countryTemplate(countries);
        return refs.countriesContainer.insertAdjacentHTML('beforeend', markup);
    } else if (countries.length <= 10 || countries.length > 1) {
        markup = countriesListTemplate(countries);
        return refs.countriesList.insertAdjacentHTML('beforeend', markup);
    }
}

function onSearchInput(event) {
    let inputValue = event.target.value;

    refs.countriesContainer.innerHTML = '';
    refs.countriesList.innerHTML = '';

    if (inputValue.length > 1) {
        fetchCountries(inputValue)
            .then(data => {
                if (data.length > 0 && data.length <= 10) {
                    renderCountryCard(data);
                } else if (data.length > 10) {
                    error('Too many matches found. Please enter a more specific query!');
                } else {
                    error('Sorry. No found country!');
                }
            })
            .catch(error => (console.log(error)));
    }
}