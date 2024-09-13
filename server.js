const express = require('express');
const request = require('request'); // Or axios if you prefer
const app = express();
const port = 3000;

// Serve static files from the "public" folder
app.use(express.static('public'));

// Weather route to get weather data
app.get('/weather', (req, res) => {
    const city = req.query.city;
    const apiKey = ''; // Use your OpenWeather API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
   

    request(weatherUrl, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const data = JSON.parse(body);
            res.json({
                description: data.weather[0].description,
                temperature: data.main.temp,
                humidity: data.main.humidity,
                country: data.sys.country // This is where you get the country code
            });

            
        } else {
            res.json({ error: 'Error fetching weather data' });
        }
    });
    
});
app.get('/news', (req, res) => {
    const country = req.query.country; // Expect the country parameter from the client-side
    const newsApiKey = ''; // Replace with your Mediastack API key
    const newsUrl = `https://api.mediastack.com/v1/news?access_key=${newsApiKey}&countries=${country}`;

    request(newsUrl, (error, response, body) => {
        if (error) {
            res.json({ error: 'Error fetching news data' });
        } else {
            
            const data = JSON.parse(body);
            const topThreeArticles = data.data.slice(0, 3).map(article => ({
                author: article.author,
                title: article.title,
                description: article.description,
                url: article.url,
                source: article.source,
                image: article.image
            }));
            console.log(topThreeArticles);
            // Send the simplified data to the frontend
            res.json({ articles: topThreeArticles });
        }
    });
});
// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
