import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

inputEl.addEventListener(
  'input',
  debounce(() => {
    fetchCountries(inputEl.value).then(renderInfoCountry).catch(showError);
    cleanHtml();
  }),
  DEBOUNCE_DELAY
);

function renderInfoCountry() {
  const name = inputEl.value.trim();
  if (name !== '') {
    fetchCountries(name).then(name => {
      if (name.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (name.length === 0) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      } else if (name.length >= 2 && name.length <= 10) {
        renderCountryList(name);
      } else if (name.length === 1) {
        renderOneCountry(name);
      }
    });
  }
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
  listEl.innerHTML = markup;
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
  listEl.innerHTML = markup;
}

function showError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function cleanHtml() {
  listEl.innerHTML = '';
  infoEl.innerHTML = '';
}
