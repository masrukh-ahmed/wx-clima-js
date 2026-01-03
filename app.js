const apiKey = "aa2ead71cdb370f50fc4c5f0c6b28eec"; // Replace with your actual API key
const city = "Berlin"; // You can change this city name
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; // Added units=metric for Celsius

async function fetchData(url) {
  const fetchedData = await axios.get(url);
  console.log(fetchedData);
  return fetchedData;
}

async function info() {
  const data = await fetchData(apiUrl);
  const location = `${data.data.name}, ${data.data.sys.country}`;
  const date = new Date();
  const temp = data.data.main.temp;
  const description = data.data.weather[0].description;
  const iconCode = data.data.weather[0].icon;
  const maxTemp = data.data.main.temp_max;
  const minTemp = data.data.main.temp_min;
  const humidity = data.data.main.humidity;
  const wind = data.data.wind.speed;
  const rain = data.data.clouds.all;
  return {
    location,
    date,
    temp,
    description,
    iconCode,
    maxTemp,
    minTemp,
    humidity,
    wind,
    rain,
  };
}
