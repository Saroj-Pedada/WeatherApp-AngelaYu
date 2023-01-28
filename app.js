const express = require("express");
const https = require("https");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function (req, res) {
    const query = req.body.cityName;
    const unit = "metric";
    const appKey = "45321788ba3e6e9e4494e70ba22b9f1d";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + appKey + "&units=" + unit;
    https.get(url, function (response) {
        console.log(response.statusCode);
        if (response.statusCode != 200) {
            res.send("<h1>ERROR 404</h1><p>Can't find the location, you have asked for!</p>");
        }
        if (response.statusCode == 200) {
            response.on("data", function (data) {
                const weatherData = JSON.parse(data);
                const temp = Math.round(weatherData.main.temp);
                const weatherDescription = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const otherURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                res.send("<p>The weather is currently " + weatherDescription + "</p><h1>The temperature in " + query + " is : " + temp + " degrees celsius</h1><img src=" + otherURL + ">");
            })
        }
    })
})

app.listen(3000, function () {
    console.log("Server is running on port 3000...");
})