const axios = require('axios');

exports.getWeather = async (req, res) => {
  const { city, lat, lon } = req.query;

  // If neither city nor coordinates provided
  if (!city && (!lat || !lon)) {
    return res.status(400).json({ message: 'Provide either city name or latitude & longitude' });
  }

  try {
    const apiKey = process.env.WEATHER_API_KEY;
    let url = '';

    if (city) {
      // Use city name
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    } else {
      // Use coordinates
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    }

    const response = await axios.get(url);

    const weatherData = {
      location: response.data.name,
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      weather: response.data.weather[0].main,
      description: response.data.weather[0].description,
      windSpeed: response.data.wind.speed
    };

    res.status(200).json(weatherData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching weather data', error: err.message });
  }
};
