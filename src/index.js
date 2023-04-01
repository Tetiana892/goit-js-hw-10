import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(renderInfoCountry, DEBOUNCE_DELAY));

function renderInfoCountry(e) {
  e.preventDefault();
  const inputValue = e.target.value.trim();
  if (!inputValue) {
    cleanHtml();
    return;
  }
  fetchCountries(inputValue).then(renderCountry).catch(showError);
}

function renderCountryList(country) {
  const markup = country
    .map(country => {
      return `<li>
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="60" hight="30">
         <h2>${country.name.official}</h2>
                </li>`;
    })
    .join('');
  return listEl.insertAdjacentHTML('beforeend', markup);
}

function renderOneCountry(country) {
  const markup = country
    .map(country => {
      return `<li >
      <img src="${country.flags.svg}" alt="Flag of ${
        country.name.official
      }" width="30" hight="20">
         <b>${country.name.official}</b></p>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages)} </p>
                </li>`;
    })
    .join('');
  return listEl.insertAdjacentHTML('beforeend', markup);
}

function renderCountry(country) {
  if (country.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (country.length >= 2 && country.length <= 10) {
    renderCountryList(country);
  } else {
    renderOneCountry(country);
  }
  return;
}

function showError() {
  cleanHtml();
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function cleanHtml() {
  listEl.innerHTML = '';
  infoEl.innerHTML = '';
}
