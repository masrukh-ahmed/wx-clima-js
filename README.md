## Weather App (WX Clima JS) – Learnings & Key Takeaways

This project is a small weather application built using vanilla JavaScript and the OpenWeatherMap API (Mobile-First-Design). The main goal of this project was not just to display weather data, but to **apply and solidify multiple JavaScript and DOM concepts together** since I jsut finished the JS30 series and wanted to see how much I have improved. While working on this, I clearly noticed a shift in how I think about frontend logic compared to when I started.

---

### Understanding the Overall Flow

One of the biggest improvements I made in this project was learning to **separate responsibilities** in my code. Instead of writing everything in one place, I divided the logic into clear parts:

- Creating API URLs
- Fetching data
- Processing and reshaping data
- Updating the UI
- Handling user interactions

This helped me understand that **APIs do not exist for the UI directly**. The UI should only receive clean, ready-to-use data. Anything extra coming from the API should be filtered and transformed before reaching the DOM.

---

### API Handling and Data Fetching

I learned how to dynamically build API URLs based on the city name entered by the user. I also understood why adding query parameters like `units=metric` is important to avoid unnecessary conversions later.

While fetching data, I used `async/await` with Axios, which made the asynchronous flow easier to read and reason about. At this stage, my focus was on the making the default app work (since I was in a rush for backend classes), so error handling is minimal, but I now understand that proper error handling is a critical next step for production-level code.

---

### Working With API Data (Data Shaping)

A major learning point was realizing that **API responses are noisy**. They contain a lot of data that the UI does not need.

To solve this, I created helper functions that:

- Extract only the required values
- Rename them into meaningful variables
- Return a clean object that the UI layer can use directly

```js
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
```

This made UI update functions much simpler and easier to debug. It also helped me understand that reshaping data is a normal and expected part of frontend development.

---

### Dates, Time, and Formatting

This project was my first real exposure to formatting dates properly using `Date` objects and `toLocaleDateString`. I learned that locale-based formatting **only works with Date objects**, not raw strings, which cleared up a lot of confusion I had earlier.

This helped me format:

- Today’s date in a readable format

```js
function formatDate(givenDate) {
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  return givenDate.toLocaleDateString("en-US", options);
}
```

- Weekday names for the 5-day forecast

```js
const day = new Date(data.time).toLocaleDateString("en-US", {
  weekday: "short",
});
```

---

### DOM Selection and UI Updates

I improved my DOM skills by:

- Selecting elements once and reusing them
- Querying child elements inside components instead of relying on global selectors
- Updating only the required parts of the UI instead of re-rendering everything

```js
todayForecastCards.forEach((card, index) => {
  let time = card.querySelector(".hourly-time");
  let icon = card.querySelector(".hourly-icon");
  let temp = card.querySelector(".hourly-temp");
  time.innerHTML = hourlyData[index].time;
  icon.src = fetchCustomWeatherIcon(hourlyData[index].iconCode);
  temp.innerHTML = `${hourlyData[index].temp}°`;
});
```

This made the code more readable and closer to how real UI updates work in larger applications.

---

### Array Methods and Data Transformation

For the forecast data, I used a combination of `slice`, `filter`, and `map` to extract:

- The next 6 hours of hourly forecast
- One forecast per day for the 5-day section

```js
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
  });
```

This was my first time confidently chaining array methods together, and it helped me understand how powerful and readable this approach is when used correctly.

---

### Custom Weather Icons and Object Access

While mapping weather codes to custom icons, I made (and fixed) a mistake related to object access. This helped me clearly understand the difference between **dot notation and bracket notation**, and when each one is required.

```js
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
  let iconFileName = `${iconPack[weatherCode]}` || "01d.svg";
  return `assets/icons/${iconFileName}`;
}
```

This was a small bug, but it reinforced an important JavaScript concept that I’m unlikely to forget now.

---

### Event Handling and User Interaction

I handled user input using the `change` event on the search field and set a default city for page load. This helped me understand how to:

- Safely read values from inputs
- Provide fallback behavior
- Trigger multiple updates from a single user action

I also intentionally postponed using the Geolocation API to avoid rushing through something I didn’t fully understand yet.

## Areas for Improvement & Next Steps

While this project helped me solidify many core JavaScript and DOM concepts, it also made it clear that there are several areas where my understanding and implementation can be improved. These are not mistakes, but gaps that I consciously identified while building the app.

---

### Error Handling and Edge Cases

At the moment, the app assumes that all API requests succeed and that the user always enters a valid city name. There is no handling for scenarios such as invalid input, network failure, API rate limits, or unexpected API responses. Improving this would involve adding proper `try/catch` blocks, displaying user-friendly error messages, and handling fallback states in the UI instead of failing silently.

---

### Reducing Code Duplication

Some parts of the code, especially API fetching logic, are repetitive. While this was acceptable for clarity during learning, the next improvement would be to generalize repeated logic into reusable functions. This would make the codebase smaller, easier to maintain, and closer to production-quality structure.

---

### Better Separation Between Logic and UI

Currently, some functions both process data and update the DOM. A more scalable approach would be to separate these concerns further, so that UI update functions only receive prepared data and do not need to know how that data was fetched or transformed. This would make the app easier to extend or refactor later.

---

### Performance and Optimization

The app re-renders parts of the UI every time new data is fetched, without checking whether the data has actually changed. While this is fine for a small project, improving this would involve minimizing unnecessary DOM updates and thinking more carefully about performance as the application grows.

---

### Accessibility and UX Improvements

The current focus was primarily on functionality and layout. Accessibility aspects such as keyboard navigation, screen-reader support, and proper ARIA attributes are not fully addressed yet. Improving these would make the app more usable and closer to real-world standards.

---

### Using Browser APIs More Effectively

Although the app defaults to a hardcoded city on page load, a better approach would be to use the Geolocation API to detect the user’s location automatically. I intentionally postponed this to avoid rushing through an API I didn’t fully understand, but this remains a planned improvement.

---

### Cleaner Naming and Stronger Abstractions

Some function and variable names are slightly verbose and could be refined as my understanding of abstraction improves. With more experience, I expect to write code that communicates intent more clearly with fewer words.

---

### Writing More Defensive Code

The app currently follows a happy-path approach. Future improvements include validating inputs, checking data existence before access, and writing code that assumes things can go wrong rather than always go right.

---

## Closing Note

This project helped me clearly see where I stand and what skills I need to strengthen next. The goal moving forward is to focus not just on making things work, but on making them **robust, scalable, and maintainable**.
