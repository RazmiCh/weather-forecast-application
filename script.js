const apiKey = "f00c38e0279b7bc85480c3fe775d518c";
// Function to fetch weather data based on city name
async function fetchWeather(city) {
  if (!city) city = document.getElementById("cityInput").value;
  if (!city) return alert("Please enter a city name");

  // Fetch weather data from OpenWeather API
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
  );
  const data = await response.json();
  // If the API response code is not 200 (successful), show an alert
  if (data.cod !== "200") {
    alert("City not found");
    return;
  }
  // Extract current weather and five-day forecast
  const currentWeather = data.list[0];
  const fiveDayForecast = data.list.filter((item, index) => index % 8 === 0);
   // Update the HTML to display weather data
  document.getElementById("weatherResult").innerHTML = `
              <div class='bg-blue-500 text-white p-4 rounded-lg shadow-lg mt-5 flex items-center justify-between'>
                    <div>
                        <h2 class='text-xl font-bold'>${data.city.name} (${currentWeather.dt_txt.split(" ")[0]})</h2>
                        <p>Temperature: ${currentWeather.main.temp}°C</p>
                        <p>Wind: ${currentWeather.wind.speed} M/S</p>
                        <p>Humidity: ${currentWeather.main.humidity}%</p>
                    </div>
                     <img src="https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png" alt="Weather Icon">
                </div>
                 <h3 class='text-lg font-bold mt-5 text-[#ec6e4c] bg-gray-700 bg-opacity-50 backdrop-blur-md p-2 rounded-lg'>5-Days Forecast</h3>
                <div class='grid grid-cols-2 md:grid-cols-5 gap-3 mt-3'>
                    ${fiveDayForecast.map(day => `
                         <div class='bg-gray-700 bg-opacity-50 backdrop-blur-md text-white p-3 rounded-lg shadow-lg flex flex-col items-center'>
                            <p>${day.dt_txt.split(" ")[0]}</p>
                             <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather Icon">
                            <p>Temp: ${day.main.temp}°C</p>
                            <p>Wind: ${day.wind.speed} M/S</p>
                            <p>Humidity: ${day.main.humidity}%</p>
                        </div>
                    `).join('')}
                </div>
            `;           
}
// Function to get weather based on the user's current location
function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    },
    () => alert("Unable to retrieve location")
  );
}
// Function to fetch weather data using latitude and longitude
async function fetchWeatherByCoords(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  );
  const data = await response.json();
  fetchWeather(data.city.name);// Use city name obtained from coordinates to fetch weather
}

