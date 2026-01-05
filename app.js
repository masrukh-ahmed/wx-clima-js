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

//created the required functions*******************************************************************************************
function prepareAPIurl(placeName) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${placeName}&appid=${apiKey}&units=metric`; // Added units=metric for Celsius
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

async function fetchData(url) {
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

async function info(apiUrl) {
  const data = await fetchData(apiUrl);
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

async function updateUI(url) {
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
  } = await info(url); //destructuring the incoming data - useful
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

//adding the event listeners ************************************************************************************************
searchInput.addEventListener("change", (e) => {
  let enteredName;
  if (e.currentTarget.value == "") {
    enteredName = "Kolkata"; //default to this city name cuz that's where I live
    //I could have used the location API to get my location first and then based off that I could set the default location on every page reload
    //but it will take a bit of reading and understanding that API so will implement that later
  } else {
    enteredName = e.currentTarget.value;
  }
  const url = prepareAPIurl(enteredName);
  updateUI(url);
});

// updateUI(); //to gather default city's weather data on page load
