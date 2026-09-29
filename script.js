const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const refreshBtn = document.getElementById("refreshBtn");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const weatherDashboard = document.getElementById("weatherDashboard");

const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");

const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const feelsLike = document.getElementById("feelsLike");
const precipitation = document.getElementById("precipitation");

const weatherDescription =
    document.getElementById("weatherDescription");

const weatherIcon =
    document.getElementById("weatherIcon");

const latitude =
    document.getElementById("latitude");

const longitude =
    document.getElementById("longitude");

const timezone =
    document.getElementById("timezone");

const updatedTime =
    document.getElementById("updatedTime");


// Search button

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city === "") {

        showError("Please enter a city name.");

        return;
    }

    getWeather(city);
});


// Enter key

cityInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {

        searchBtn.click();
    }

});


// Refresh button

refreshBtn.addEventListener("click", () => {

    const city = cityName.textContent;

    if (city) {

        getWeather(city);
    }

});


// Main function

async function getWeather(city) {

    try {

        showLoading();

        hideError();
        weatherDashboard.style.display = "none";


        // STEP 1:
        // Convert city name into coordinates

        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse =
            await fetch(geoURL);


        if (!geoResponse.ok) {

            throw new Error(
                "Unable to search for the city."
            );
        }


        const geoData =
            await geoResponse.json();


        if (!geoData.results ||
            geoData.results.length === 0) {

            throw new Error(
                "City not found. Please try another city."
            );
        }


        const location =
            geoData.results[0];


        const lat =
            location.latitude;

        const lon =
            location.longitude;


        // STEP 2:
        // Get weather data

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=auto`;


        const weatherResponse =
            await fetch(weatherURL);


        if (!weatherResponse.ok) {

            throw new Error(
                "Weather service is unavailable."
            );
        }


        const weatherData =
            await weatherResponse.json();


        // STEP 3:
        // Display data

        displayWeather(
            location,
            weatherData
        );
        weatherDashboard.style.display = "block";


    } catch (error) {

        console.error(error);
        weatherDashboard.style.display = "none";

        showError(
            error.message ||
            "Something went wrong. Please try again."
        );

    } finally {

        hideLoading();
    }
}


// Display weather

function displayWeather(location, data) {

    const current =
        data.current;


    cityName.textContent =
        location.name;


    countryName.textContent =
        location.country || "Unknown";


    temperature.textContent =
        Math.round(current.temperature_2m);


    humidity.textContent =
        current.relative_humidity_2m;


    windSpeed.textContent =
        current.wind_speed_10m;


    feelsLike.textContent =
        Math.round(
            current.apparent_temperature
        );


    precipitation.textContent =
        current.precipitation;


    latitude.textContent =
        location.latitude.toFixed(4);


    longitude.textContent =
        location.longitude.toFixed(4);


    timezone.textContent =
        location.timezone;


    updatedTime.textContent =
        formatTime(current.time);


    // Weather description

    const weatherInfo =
        getWeatherInfo(
            current.weather_code
        );


    weatherIcon.textContent =
        weatherInfo.icon;


    weatherDescription.textContent =
        weatherInfo.description;
}


// Weather code function

function getWeatherInfo(code) {

    if (code === 0) {

        return {
            icon: "☀️",
            description: "Clear sky"
        };

    }

    if (code === 1 ||
        code === 2 ||
        code === 3) {

        return {
            icon: "⛅",
            description: "Partly cloudy"
        };

    }

    if (code === 45 ||
        code === 48) {

        return {
            icon: "🌫️",
            description: "Foggy"
        };

    }

    if (
        code >= 51 &&
        code <= 67
    ) {

        return {
            icon: "🌧️",
            description: "Rain"
        };

    }

    if (
        code >= 71 &&
        code <= 77
    ) {

        return {
            icon: "❄️",
            description: "Snow"
        };

    }

    if (
        code >= 80 &&
        code <= 82
    ) {

        return {
            icon: "🌦️",
            description: "Rain showers"
        };

    }

    if (
        code >= 95 &&
        code <= 99
    ) {

        return {
            icon: "⛈️",
            description: "Thunderstorm"
        };

    }

    return {
        icon: "🌤️",
        description: "Weather information"
    };
}


// Format time

function formatTime(time) {

    const date =
        new Date(time);

    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// Loading functions

function showLoading() {

    loading.style.display = "block";
}


function hideLoading() {

    loading.style.display = "none";
}


// Error functions

function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.style.display =
        "block";
}


function hideError() {

    errorMessage.style.display =
        "none";
}


// Load default city

getWeather("Ahmedabad");