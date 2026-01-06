const apiKey = "aa2ead71cdb370f50fc4c5f0c6b28eec"; // Replace with your actual API key

//accessing the DOM elements************************************************************************************************
const searchInput = document.querySelector(".search-area input");
const cityWithCountry = document.querySelector(".city-name");
const todayDate = document.querySelector(".date");
const weatherIcon = document.querySelector(".weather-visual img");
const mainTemp = document.querySelector(
  ".temp-display-description .temp-value"
);
const mainWeatherDescription = document.querySelector(
  ".temp-display-description .weather-description"
);
const highTemp = document.querySelector(".temp-high .temp-value");
const lowTemp = document.querySelector(".temp-low .temp-value");
const humidity = document.querySelector(".humidity-details .detail-value");
const wind = document.querySelector(".wind-details .detail-value");
const cloud = document.querySelector(".cloud-details .detail-value");
const todayForecastCards = Array.from(
  document.querySelectorAll(".today-forecast-section .hourly-card")
);
const forecastContainer = document.querySelector(".forecast-list");

//created the required functions*******************************************************************************************
function prepareWeatherAPIurl(placeName) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${placeName}&appid=${apiKey}&units=metric`; // Added units=metric for Celsius
  return apiUrl;
}
function prepareForecastAPIurl(placeName) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${placeName}&appid=${apiKey}&units=metric`; // Added units=metric for Celsius
  return apiUrl;
}

function fetchCustomWeatherIcon(weatherCode) {
  const iconPack = {
    "01d": "01d.svg",
    "01n": "01n.svg",
    "02d": "02d.svg",
    "02n": "02n.svg",
    "03d": "03d.svg",
    "03n": "03n.svg",
    "04d": "04d.svg",
    "04n": "04n.svg",
    "09d": "09d.svg",
    "09n": "09n.svg",
    "10d": "10d.svg",
    "10n": "10n.svg",
    "11d": "11d.svg",
    "11n": "11n.svg",
    "13d": "13d.svg",
    "13n": "13n.svg",
    "50d": "50d.svg",
    "50n": "50n.svg",
  };
  let iconFileName = `${iconPack[weatherCode]}` || "01d.svg"; //mistake here - understood the difference between object bracket notation and dot notation and where each is needed
  return `assets/icons/${iconFileName}`;
}

async function fetchWeatherData(url) {
  const fetchedData = await axios.get(url);
  // console.log(fetchedData); for testing
  return fetchedData;
}
async function fetchForecastData(url) {
  const fetchedData = await axios.get(url);
  // console.log(fetchedData); for testing
  return fetchedData;
}

function formatDate(givenDate) {
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  return givenDate.toLocaleDateString("en-US", options); //learnt this for the first time, very useful for formatting date into required formats
}

async function weatherInfo(apiUrl) {
  const data = await fetchWeatherData(apiUrl);
  const cityName = `${data.data.name}, ${data.data.sys.country}`;
  const today = new Date();
  const temp = Math.round(data.data.main.temp);
  const description = data.data.weather[0].description;
  const iconCode = data.data.weather[0].icon;
  const maxTemp = data.data.main.temp_max.toFixed(1);
  const minTemp = data.data.main.temp_min.toFixed(1);
  const humidityDetail = data.data.main.humidity;
  const windDetail = (data.data.wind.speed * 3.6).toFixed(1); //converting to km/h from m/s since api returns m/s units
  const cloudDetail = data.data.clouds.all;
  // console.log({
  //   cityName,
  //   today,
  //   temp,
  //   description,
  //   iconCode,
  //   maxTemp,
  //   minTemp,
  //   humidityDetail,
  //   windDetail,
  //   cloudDetail,
  // }); //for testing
  return {
    cityName,
    today,
    temp,
    description,
    iconCode,
    maxTemp,
    minTemp,
    humidityDetail,
    windDetail,
    cloudDetail,
  };
}
async function forecastInfo(apiUrl) {
  const forecastData = await fetchForecastData(apiUrl);
  const next6hours = forecastData.data.list.slice(0, 6);
  const next5days = forecastData.data.list
    .filter((eachDayData) => {
      if (eachDayData.dt_txt.split(" ")[1].slice(0, 5) == "12:00") {
        return eachDayData;
      }
    })
    .map((eachData) => {
      return {
        time: eachData.dt_txt,
        iconCode: eachData.weather[0].icon,
        temp: eachData.main.temp.toFixed(1),
        tempDescription: eachData.weather[0].description,
      };
    }); // my first time combining array methods on top of each other - proud of myself
  const hourlyData = next6hours.map((data) => {
    return {
      time: data.dt_txt.split(" ")[1].slice(0, 5),
      iconCode: data.weather[0].icon,
      temp: data.main.temp.toFixed(1),
    };
  });

  return { hourlyData, next5days };
}

async function updateWeatherUI(url) {
  let {
    cityName,
    today,
    temp,
    description,
    iconCode,
    maxTemp,
    minTemp,
    humidityDetail,
    windDetail,
    cloudDetail,
  } = await weatherInfo(url); //destructuring the incoming data - useful
  //ui updation of each part of the weather detail card
  cityWithCountry.innerHTML = cityName;
  todayDate.innerHTML = `${formatDate(today)}`;
  mainTemp.innerHTML = `${temp}°`;
  weatherIcon.src = `${fetchCustomWeatherIcon(iconCode)}`;
  mainWeatherDescription.innerHTML = description;
  highTemp.innerHTML = `${maxTemp}°C`;
  lowTemp.innerHTML = `${minTemp}°C`;
  humidity.innerHTML = `${humidityDetail}%`;
  wind.innerHTML = `${windDetail} km/h`;
  cloud.innerHTML = `${cloudDetail}%`;
}
async function updateForecastUI(url) {
  const { hourlyData, next5days } = await forecastInfo(url);

  //updating today's hourly forecast UI section
  todayForecastCards.forEach((card, index) => {
    let time = card.querySelector(".hourly-time"); //used these method of selecting elements in DOM -  discovered myself
    let icon = card.querySelector(".hourly-icon");
    let temp = card.querySelector(".hourly-temp");
    time.innerHTML = hourlyData[index].time;
    icon.src = fetchCustomWeatherIcon(hourlyData[index].iconCode);
    temp.innerHTML = `${hourlyData[index].temp}°`;
  });
  //updating 5 day forecast UI section
  forecastContainer.innerHTML = next5days
    .map((data) => {
      const day = new Date(data.time).toLocaleDateString("en-US", {
        //learnt that for changing dates they need to be a date object, no string will work for the localeDateString method
        weekday: "short",
      });
      const iconCode = data.iconCode;
      const temp = data.temp;
      const description = data.tempDescription;
      return `
      <div class="forecast-item">
            <span class="forecast-day">${day}</span>
            <div class="forecast-icon">
              <img src="/assets/icons/${iconCode}.svg" alt="weather" />
            </div>
            <span class="forecast-temp">${temp}°C</span>
            <span class="forecast-description">${description}</span>
          </div>
      `;
    })
    .join("");
}

//adding the event listeners ************************************************************************************************
searchInput.addEventListener("change", (e) => {
  let enteredName;
  if (e.currentTarget.value == "") {
    enteredName = "Kolkata"; //default to this city name cuz that's where I live
  } else {
    enteredName = e.currentTarget.value;
  }
  const weatherUrl = prepareWeatherAPIurl(enteredName);
  const forecastUrl = prepareForecastAPIurl(enteredName);
  updateWeatherUI(weatherUrl);
  updateForecastUI(forecastUrl);
});

window.addEventListener("load", () => {
  //to gather default city (Kolkata) weather data on page load
  //I could have used the location API to get my location first and then based off that I could set the default location on every page reload
  //but it will take a bit of reading and understanding that API so will implement that later cuz I am in a hurry
  const weatherUrl = prepareWeatherAPIurl("Kolkata");
  const forecastUrl = prepareForecastAPIurl("Kolkata");
  updateWeatherUI(weatherUrl);
  updateForecastUI(forecastUrl);
});
