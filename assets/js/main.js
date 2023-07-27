"use strict";

import { apiKey } from "./api.js";

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
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityInput.value}&limit=1&appid=${apiKey}`)
  .then(response => {
    if (!response.ok) {
      new Error("responese not ok")
    }
    return response.json()})
    .then(data => {
      // console.log(data)
      lat = data[0].lat
      lon = data[0].lon
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
      .then(response => response.json())
      .then(curWeather => {
        console.log(curWeather)
        name.textContent = curWeather.name
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${curWeather.weather[0].icon}.png`)
        tempreture.textContent = `${curWeather.main.temp.toFixed(1)} °C`
        description.textContent = curWeather.weather[0].description
        const dt = new Date(curWeather.dt * 1000)
        const dtDateLocation = new Date(Date.now() + curWeather.timezone * 1000).toLocaleString(undefined, {timeZone: "UTC", day:"2-digit", month:"short", year:"numeric"})
        const dtDateUser = dt.toLocaleString(undefined, {day:"2-digit", month:"short", year:"numeric"})
        const dtTimeLocation = new Date(Date.now() + curWeather.timezone * 1000).toLocaleString(undefined, {timeZone: "UTC", hour12:false, hour:"2-digit", minute:"2-digit"})
        const dtTimeUser = dt.toLocaleString(undefined, {hour12:false, hour:"2-digit", minute:"2-digit"})
        obtainTime.textContent = `Obtained at ${dtTimeUser}, ${dtDateUser}`
        localTime.textContent = `${dtTimeLocation}, ${dtDateLocation}`
        wind.textContent = `${curWeather.wind.speed} m/s`
        cloudiness.textContent = curWeather.weather[0].description
        pressure.textContent = `${curWeather.main.pressure} hPA`
        humidity.textContent = `${curWeather.main.humidity} %`
        sunrise.textContent = new Date((curWeather.sys.sunrise + curWeather.timezone) * 1000).toLocaleString(undefined, {timeZone: "UTC", hour12:false, hour:"2-digit", minute:"2-digit"})
        sunset.textContent = new Date((curWeather.sys.sunset + curWeather.timezone) * 1000).toLocaleString(undefined, {timeZone: "UTC", hour12:false, hour:"2-digit", minute:"2-digit"})
        geoCoords.textContent = `[${curWeather.coord.lon.toFixed(2)}, ${curWeather.coord.lat.toFixed(2)}]`
      })
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(response => {
      if (!response.ok) {
        new Error("responese not ok")
      }
      return response.json()})
      // .then(data5day => console.log(data5day))
    })
    .catch(error => console.log(error))
  }
  
  document.querySelector("#weather").addEventListener("click", getWeather)
  // 1 general infos 
  // City; infos created at dt
  // 2 Day Info
  // heading with date weekday monthDay month
  // 3 every 3 hour information
  // UserTime °C light rain wind humidity
  // repeat 3 till end of day
  // repeat from 2 till no data left