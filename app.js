const apiKey = "aa2ead71cdb370f50fc4c5f0c6b28eec"; // Replace with your actual API key
let city = "Kolkata"; // You can change this city name
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; // Added units=metric for Celsius

//accessing the DOM elements************************************************************************************************
const searchInput = document.querySelector(".search-area input");
const cityWithCountry = document.querySelector(".city-name");
const todayDate = document.querySelector(".date");
const weatherIcon = document.querySelector(".weather-visual");
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

async function info() {
  const data = await fetchData(apiUrl);
  const cityName = `${data.data.name}, ${data.data.sys.country}`;
  const today = new Date();
  const temp = data.data.main.temp;
  const description = data.data.weather[0].description;
  const iconCode = data.data.weather[0].icon;
  const maxTemp = data.data.main.temp_max;
  const minTemp = data.data.main.temp_min;
  const humidityDetail = data.data.main.humidity;
  const windDetail = data.data.wind.speed * 3.6; //converting to km/h from m/s since api returns m/s units
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

async function updateUI() {
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
  } = await info(); //destructuring the incoming data - useful
  cityWithCountry.innerHTML = cityName;
  todayDate.innerHTML = `${formatDate(today)}`;
  mainTemp.innerHTML = `${temp}°`;
  mainWeatherDescription.innerHTML = description;
  highTemp.innerHTML = `${maxTemp}°C`;
  lowTemp.innerHTML = `${minTemp}°C`;
  humidity.innerHTML = `${humidityDetail}%`;
  wind.innerHTML = `${windDetail} km/h`;
  cloud.innerHTML = `${cloudDetail}%`;
}

//adding the event listeners ************************************************************************************************
searchInput.addEventListener("change", (e) => {
  const enteredName = e.currentTarget.value;
  console.log(enteredName);
  city = enteredName;
  updateUI();
});

// updateUI(); //to gather default city's weather data on page load
