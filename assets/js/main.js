"use strict";
// https://openweathermap.org/img/wn/10d.png Icon URL 10d is the icon
// .weather-obtain is ts

const cityInput = document.querySelector("#city")
const name = document.querySelector(".name")
const weatherIcon = document.querySelector(".weather-icon")
const tempreture = document.querySelector(".tempreture")
const description = document.querySelector(".weather-description")
const obtainTime = document.querySelector(".weather-obtain")
const localTime = document.querySelector(".local-time")
const wind = document.querySelector(".wind")
const cloudiness = document.querySelector(".cloudiness")
const pressure = document.querySelector(".pressure")
const humidity = document.querySelector(".humidity")
const sunrise = document.querySelector(".sunrise")
const sunset = document.querySelector(".sunset")
const geoCoords = document.querySelector(".geo-coords")

function getWeather() {
  if (!cityInput.value) {
    return
  }
  let lat
  let lon
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityInput.value}&limit=1&appid=f3d1da0ea9111723536a1969023bbeef`)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    lat = data[0].lat
    lon = data[0].lon
  })
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=48.26&lon=11.40&units=metric&appid=f3d1da0ea9111723536a1969023bbeef`)
    .then(response => response.json())
    .then(curWeather => {
      name.textContent = curWeather.name
      weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${curWeather.weather[0].icon}.png`)
      tempreture.textContent = `${curWeather.main.temp.toFixed(1)} °C`
      description.textContent = curWeather.weather[0].description
      const dt = new Date(curWeather.dt * 1000)
      const dtDateUTC = dt.toLocaleString(undefined, {timeZone: "UTC", day:"2-digit", month:"short", year:"numeric", timeZoneName:"long"})
      const dtDateLocale = dt.toLocaleString(undefined, {day:"2-digit", month:"short", year:"numeric"})
      const dtTimeUTC = dt.toLocaleString(undefined, {timeZone: "UTC", hour12:false, hour:"2-digit", minute:"2-digit"})
      const dtTimeLocale = dt.toLocaleString(undefined, {hour12:false, hour:"2-digit", minute:"2-digit"})
      obtainTime.textContent = `Obtained at ${dtTimeUTC}, ${dtDateUTC}`
      localTime.textContent = `${dtTimeLocale}, ${dtDateLocale}`
      wind.textContent = `${curWeather.wind.speed} m/s`
      cloudiness.textContent = curWeather.weather[0].description
      pressure.textContent = `${curWeather.main.pressure} hPA`
      humidity.textContent = `${curWeather.main.humidity} %`
      sunrise.textContent = new Date(curWeather.sys.sunrise * 1000).toLocaleString(undefined, {hour12:false, hour:"2-digit", minute:"2-digit"})
      sunset.textContent = new Date(curWeather.sys.sunset * 1000).toLocaleString(undefined, {hour12:false, hour:"2-digit", minute:"2-digit"})
      geoCoords.textContent = `[${curWeather.coord.lon.toFixed(2)}, ${curWeather.coord.lat.toFixed(2)}]`
    })
    .catch(error => console.log(error))
}