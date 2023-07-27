"use strict";

import { apiKey } from "./api.js";

const weatherButton = document.querySelector("#get-weather")
const cityInput = document.querySelector("#city")
const weatherCurrent = document.querySelector(".current-weather")
const weatherForecast = document.querySelector(".weather-forecast")

const secondsToMs = 1000
const dateFormatDateUTC = { timeZone: "UTC", day: "2-digit", month: "short", year: "numeric" }
const dateFormatTimeUTC = { timeZone: "UTC", hour12: false, hour: "2-digit", minute: "2-digit" }

function getWeatherAll() {
  getWeatherCurrent()
  getWeatherForcast()
}

function getGeoLocation() {
  if (!cityInput.value) return

  // ? Geo location API
  return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityInput.value}&limit=1&appid=${apiKey}`)
    .then(response => {
      if (!response.ok) new Error("Geo response not ok")

      return response.json()
    })
    .then(data => {
      return { lat: data[0].lat, lon: data[0].lon }
    })
    .catch(error => console.log(error))
}


async function getWeatherCurrent() {
  const { lat, lon } = await getGeoLocation()

  // ? Current Weather API
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    .then(response => {
      if (!response.ok) new Error("Current Weather response not ok")

      return response.json()
    })

    .then(curWeather => {
      const dt = new Date(curWeather.dt * secondsToMs)
      const timezone = curWeather.timezone

      const dtDateLocation = new Date(Date.now() + timezone * secondsToMs).toLocaleString(undefined, dateFormatDateUTC)
      const dtTimeLocation = new Date(Date.now() + timezone * secondsToMs).toLocaleString(undefined, dateFormatTimeUTC)
      const dtDateUser = dt.toLocaleString(undefined, { day: "2-digit", month: "short", year: "numeric" })
      const dtTimeUser = dt.toLocaleString(undefined, { hour12: false, hour: "2-digit", minute: "2-digit" })
      const sunriseTimeLocal = new Date((curWeather.sys.sunrise + timezone) * secondsToMs).toLocaleString(undefined, dateFormatTimeUTC)
      const sunsetTimeLocal = new Date((curWeather.sys.sunset + timezone) * secondsToMs).toLocaleString(undefined, dateFormatTimeUTC)

      const currentWeatherHTML = `
        <h1>Weather in <span class="name">${curWeather.name}</span></h1>
        <p>
          <img src=${`https://openweathermap.org/img/wn/${curWeather.weather[0].icon}.png`} alt="" /> <span>${curWeather.main.temp.toFixed(1)} °C</span>
        </p>
        <p>${curWeather.weather[0].description}</p>
        <p>Obtained at ${dtTimeUser}, ${dtDateUser}</p>
        <div>
        <p>Local Time ${dtTimeLocation}, ${dtDateLocation}</p>
        <p>Wind ${curWeather.wind.speed} m/s</p>
        <p>Cloudiness ${curWeather.weather[0].description}</p>
        <p>Pressure ${curWeather.main.pressure} hPA</p>
        <p>Humidity ${curWeather.main.humidity} %</p>
        <p>Sunrise ${sunriseTimeLocal}</p>
        <p>Sunset ${sunsetTimeLocal}</p>
        <p>Geo coords [${curWeather.coord.lon.toFixed(2)}, ${curWeather.coord.lat.toFixed(2)}]</p>
        </div>
        `
      weatherCurrent.innerHTML = ""
      weatherCurrent.insertAdjacentHTML("beforeend", currentWeatherHTML)
    })
    .catch(error => console.log(error))
}

async function getWeatherForcast() {
  const { lat, lon } = await getGeoLocation()

  // ? Forecast API
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(response => {
      if (!response.ok) new Error("Weather Forecast response not ok")

      return response.json()
    })

    .then(data5day => {
      let dayInfo = ""
      weatherForecast.innerHTML = ""
      weatherForecast.insertAdjacentHTML("afterbegin", `<div>
        <h3>${data5day.city.name} weather forecast<h3>
        </div>`)

      data5day.list.forEach((weather3Hour, index) => {
        const dayDate = new Date(weather3Hour.dt * 1000)
        let dayCount = dayDate.getUTCDate()
        if (dayDate.getUTCHours() == 0 || index == weather3Hour.length - 1) {
          weatherForecast.insertAdjacentHTML("beforeend", `
            <div class="forecast-day-${dayCount}">
            <h3>${dayDate.toLocaleString(undefined, { timeZone: "UTC", day: "2-digit", month: "short", year: "2-digit" })}</h3>
            </div>
            `)
          document.querySelector(`.forecast-day-${dayCount}`).insertAdjacentHTML("beforeend", dayInfo)
          dayInfo = ""
        }

        dayInfo += `
          <div class="forecast-hours">
          <p>Time ${dayDate.toLocaleString(undefined, dateFormatTimeUTC)}</p>
          <p>Temprature ${weather3Hour.main.temp.toFixed(1)}</p>
          <p>${weather3Hour.weather[0].description}</p>
          <p>Wind ${weather3Hour.wind.speed}</p>
          <p>Humidity ${weather3Hour.main.humidity}</p>
          </div>
          `;

      })
    })
    .catch(error => console.log(error))
}


weatherButton.addEventListener("click", getWeatherAll)