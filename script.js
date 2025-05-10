const WEATHER_API_KEY = 'd3fa06a20a1674fb79c5ac38b0078bfe';
const searchInputEl = document.querySelector('.search-input');
const searchClearButtonEl = document.querySelector(
  '.search-input__clear-button',
);
const mainContainer = document.querySelector('.main-container');
const searchForm = document.querySelector('.search-form');

searchClearButtonEl.addEventListener('click', () => {
  searchInputEl.value = '';
  searchInputEl.focus();
});

const days = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

const selectedCityEl = document.querySelector('.selected-city-output');
searchForm.addEventListener('submit', e => {
  e.preventDefault();
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${searchInputEl.value.trim()}&units=metric&appid=${WEATHER_API_KEY}`,
  )
    .then(r => r.json())
    .then(data => {
      if (data.cod !== '200') {
        selectedCityEl.textContent = data.message;
        selectedCityEl.classList.add('error');
      }

      if (data.cod === '200') {
        try {
          selectedCityEl.classList.remove('error');
        } catch {}
        selectedCityEl.textContent = `Selected: ${data.city.name}, ${data.city.country}`;

        const currentData = data.list[0];

        try {
          const futureWeatherList =
            mainContainer.querySelectorAll('.future-weather');
          const currentWeather = document
            .querySelector('.current-weather-container')
            .remove();
          for (const item of futureWeatherList) {
            item.remove();
          }
        } catch {}
        mainContainer.insertAdjacentHTML(
          'beforeend',
          `<article class="current-weather-container">
    <div class="current-weather__temperature-container">
      <p class="current-weather__temperature">${Math.round(
        currentData.main.temp,
      )}°C</p>
    </div>
    <div class="current-weather__weather-location-container">
      <p class="current-weather__weather">${currentData.weather[0].main}</p>
      <p class="current-weather__location">${data.city.name}, ${
            data.city.country
          }</p>
    </div>
    <div class="">
    <img class="current-weather__icon" width="52px" height="70px" src="./images/${currentData.weather[0].main.toLowerCase()}-icon.svg" alt="" />
    </div>
  </article>`,
        );

        let nightTemp = 0;
        let dayTemp = 0;

        for (let i = 0; i < data.list.length; i += 1) {
          const date = data.list[i].dt_txt;
          const dayOfWeek = new Date(date).getDay();

          if (new Date(data.list[0].dt_txt).getDay() === dayOfWeek) {
            continue;
          } else {
            if (data.list[i].dt_txt.slice(11, 13) === '00') {
              nightTemp = Math.round(data.list[i].main.temp);
            }

            if (data.list[i].dt_txt.slice(11, 13) === '12') {
              dayTemp = Math.round(data.list[i].main.temp);

              mainContainer.insertAdjacentHTML(
                'beforeend',
                `<article class="future-weather">
          <p class="future-weather__day-of-week">${days[dayOfWeek]
            .slice(0, 3)
            .toUpperCase()}</p>
            <div class="future-weather__image-container">
          <img class="future-weather__weather-icon" src="./images/${data.list[
            i
          ].weather[0].main.toLowerCase()}-icon.svg" alt="weather icon" />
          </div>
          <p class="future-weather__weather">${data.list[i].weather[0].main}</p>
          <div class="future-weather__day-night-temperature-container">
            <p class="future-weather__temperature">Day</p>
            <p class="future-weather__temperature-value">${dayTemp}°C</p>
            <p class="future-weather__temperature-value">${nightTemp}°C</p>
            <p class="future-weather__temperature">Night</p>
          </div>
        </article>`,
              );
            }
          }
        }
      }
    });
});
