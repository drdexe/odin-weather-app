import "./styles.css";

const form = document.querySelector("form");
const locationInput = document.querySelector("#location");
const timeImage = document.querySelector(".image > img");
const timeDiv = document.querySelector(".time");
const icon = document.querySelector(".icon > img");
const locationDiv = document.querySelector(".location");
const conditionsDiv = document.querySelector(".conditions");
const temperatureSpan = document.querySelector(".temperature > .value");
const feelslikeSpan = document.querySelector(".feelslike > .value");
const precipitationSpan = document.querySelector(".precipitation > .value");
const humiditySpan = document.querySelector(".humidity > .value");
const windSpan = document.querySelector(".wind > .value");

let data = null;

async function getWeatherData(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=YFAJNKRV8EGSL33G9R8Z2WC3Y`,
    );
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

function getFormattedTime(datetime) {
  const hour = +datetime.slice(0, 2);
  if (hour === 0) return "12 AM";
  else if (hour < 12) return hour + " AM";
  else if (hour === 12) return "12 PM";
  else return hour - 12 + " PM";
}

function isDay(datetimeEpoch, sunriseEpoch, sunsetEpoch) {
  return sunriseEpoch < datetimeEpoch && datetimeEpoch < sunsetEpoch;
}

function showTimeImage(isDay) {
  if (isDay) {
    timeImage.style.left = 0;
    timeImage.alt = "day";
  } else {
    timeImage.style.right = 0;
    timeImage.alt = "night";
  }
}

function showWeatherIcon(iconName) {
  import(`./assets/images/${iconName}.svg`).then((module) => {
    icon.src = module.default;
    icon.alt = iconName;
  });
}

function getCelsiusTemp(temp) {
  return Math.round((((temp - 32) * 5) / 9) * 10) / 10;
}

function getProcessedWeatherData(data) {
  const currentConditions = data.currentConditions;
  return {
    location: data.address,
    time: getFormattedTime(currentConditions.datetime),
    isDay: isDay(
      currentConditions.datetimeEpoch,
      currentConditions.sunriseEpoch,
      currentConditions.sunsetEpoch,
    ),
    tempF: currentConditions.temp,
    tempC: getCelsiusTemp(currentConditions.temp),
    feelslikeF: currentConditions.feelslike,
    feelslikeC: getCelsiusTemp(currentConditions.feelslike),
    humidity: currentConditions.humidity,
    precipprob: currentConditions.precipprob,
    windspeed: currentConditions.windspeed,
    conditions: currentConditions.conditions,
    icon: currentConditions.icon,
  };
}

function populateCard(data) {
  timeDiv.textContent = data.time;
  showTimeImage(data.isDay);
  showWeatherIcon(data.icon);
  locationDiv.textContent = data.location;
  conditionsDiv.textContent = data.conditions;
  temperatureSpan.textContent = data.tempC;
  feelslikeSpan.textContent = data.feelslikeC;
  precipitationSpan.textContent = data.precipprob;
  humiditySpan.textContent = data.humidity;
  windSpan.textContent = data.windspeed;
}

function updateTempUnit(e) {
  if (!data) return;

  const celsiusButton = document.querySelector("#celsius");
  const fahrenheitButton = document.querySelector("#fahrenheit");
  const feelslikeUnit = document.querySelector(".feelslike > .unit");

  switch (e.target.id) {
    case "celsius":
      temperatureSpan.textContent = data.tempC;
      feelslikeSpan.textContent = data.feelslikeC;

      celsiusButton.style.fontWeight = "bold";
      fahrenheitButton.style.fontWeight = "normal";
      feelslikeUnit.textContent = "°C";
      break;
    case "fahrenheit":
      temperatureSpan.textContent = data.tempF;
      feelslikeSpan.textContent = data.feelslikeF;

      celsiusButton.style.fontWeight = "normal";
      fahrenheitButton.style.fontWeight = "bold";
      feelslikeUnit.textContent = "°F";
      break;
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const weatherData = await getWeatherData(locationInput.value);
  data = getProcessedWeatherData(weatherData);
  populateCard(data);
  console.log(weatherData);
  console.log(data);
});

document.querySelector(".units").addEventListener("click", updateTempUnit);
