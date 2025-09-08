const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your OpenWeatherMap API key
const weatherDiv = document.getElementById('weather');

// On load, try geolocation
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      getWeatherByCoords(position.coords.latitude, position.coords.longitude);
    }, () => {
      weatherDiv.innerHTML = '<p>Location access denied. Enter a city manually.</p>';
    });
  } else {
    weatherDiv.innerHTML = '<p>Geolocation is not supported by your browser.</p>';
  }
};

function getWeatherByCoords(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => displayWeather(data))
    .catch(error => {
      weatherDiv.innerHTML = '<p>Error fetching weather data.</p>';
      console.error(error);
    });
}

function getWeatherByCity() {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) return;

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      if (data.cod === 200) {
        displayWeather(data);
      } else {
        weatherDiv.innerHTML = `<p>City not found: "${city}"</p>`;
      }
    })
    .catch(error => {
      weatherDiv.innerHTML = '<p>Error fetching weather data.</p>';
      console.error(error);
    });
}

function displayWeather(data) {
  const { name, main, weather, wind } = data;
  const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  weatherDiv.innerHTML = `
    <h2>Weather in ${name}</h2>
    <img src="${icon}" alt="${weather[0].description}">
    <p><strong>${weather[0].main}</strong> - ${weather[0].description}</p>
    <p>🌡️ Temp: ${main.temp}°C</p>
    <p>💧 Humidity: ${main.humidity}%</p>
    <p>🌬️ Wind Speed: ${wind.speed} m/s</p>
  `;
}
