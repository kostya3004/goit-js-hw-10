import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector("#search-box")
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
    const inputValue = evt.target.value.trim();
    if (!inputValue) {
        clearAllMarkup();
        return;
    }
        fetchCountries(inputValue).then(data => {
        createMarkup(data)
     })
        .catch(err => {
        countryInfo.innerHTML = null;
        countryList.innerHTML = null;
        return Notiflix.Notify.failure("Oops, there is no country with that name")
    });
}

function createMarkup(array) {
    if (array.length > 10) {
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.")}
    else if (array.length > 1) {
        const markupList = array.map(({flags, name}) => 
            `<li class="country-item">
                <img class="country-img" src="${flags.svg}" alt="Flag of ${name.official}">
                <h3 class="country-name">${name.official}</h3>
            </li>`
        ).join("")
        countryList.innerHTML = markupList;
        countryInfo.innerHTML = null;
    }
    else {
        const markupInfo = array.map(({ flags, name, capital, languages, population }) => 
    `   <img class="country-img-big" src=${flags.svg} alt="Flag of ${name.official}">
        <h3 class="country-name-big">${name.official}</h3>
    <ul>
        <li class="country-item-big"><p><b>Capital:</b> ${capital[0]}</p></li>
        <li class="country-item-big"><p><b>Population:</b> ${population}</p></li>
        <li class="country-item-big"><p><b>Languages:</b> ${Object.values(languages)}</p></li>
    </ul>`
    ).join("");
        countryList.innerHTML = null;
        countryInfo.innerHTML = markupInfo;
    }
} 
    
function clearAllMarkup() {
  countryList.innerHTML = null;
  countryInfo.innerHTML = null;
}

/////////////