//using the open-meteo.com API for this activity
"use strict";

let conditions = {
	"0" : { "desc" : "Clear Sky", "path" : "images/sun.svg" },
	"1" : { "desc" : "Mostly Clear", "path" : "images/sun.svg" },
	"2" : { "desc": "Partly Cloudy", "path": "images/cloudy.svg" },
	"3" : { "desc": "Overcast", "path": "images/overcast.svg" },
	"45" : { "desc": "Fog", "path": "images/overcast.svg" },
	"48" : { "desc" : "Depositing Rime Fog", "path": "images/overcast.svg" },
	"51" : { "desc" : "Light Drizzle", "path": "images/rain.svg" },
	"53" : { "desc" : "Moderate Drizzle", "path": "images/rain.svg" },
	"55" : { "desc" : "Heavy Drizzle", "path": "images/rain.svg" },
	"56" : { "desc" : "Light Freezing Drizzle", "path": "images/rain.svg" },
	"57" : { "desc" : "Heavy Freezing Drizzle", "path": "images/rain.svg" },
	"61" : { "desc" : "Light Rain", "path": "images/rain.svg" },
	"63" : { "desc" : "Moderate Rain", "path": "images/rain.svg" },
	"65" : { "desc" : "Heavy Rain", "path": "images/rain.svg" },
	"66" : { "desc" : "Light Freezing Rain", "path": "images/rain.svg" },
	"67" : { "desc" : "Heavy Freezing Rain", "path": "images/rain.svg" },
	"71" : { "desc" : "Light Snowfall", "path": "images/snow.svg" },
	"73" : { "desc" : "Moderate Snowfall", "path": "images/snow.svg" },
	"75" : { "desc" : "Heavy Snowfall", "path": "images/snow.svg" },
	"77" : { "desc" : "Snow Grains", "path": "images/snow.svg" },
	"80" : { "desc" : "Light Rain Showers", "path": "images/rain.svg" },
	"81" : { "desc" : "Moderate Rain Showers", "path": "images/rain.svg" },
	"82" : { "desc" : "Violent Rain Showers", "path": "images/rain.svg" },
	"85" : { "desc" : "Light Snow Showers", "path": "images/snow.svg" },
	"86" : { "desc" : "Heavy Snow Showers", "path": "images/snow.svg" },
	"95" : { "desc" : "Slight Thunderstorm", "path": "images/thunderstorm.svg" },
	"96" : { "desc" : "Thunderstorm with Light Hail", "path": "images/thunderstorm.svg" },
	"99" : { "desc" : "Thunderstorm with Heavy Hail", "path": "images/thunderstorm.svg" }
};

function displayData(data){
	let current = document.getElementById("current");
	let forecast = document.getElementById("forecast");

	if(data.error){
		current.innerHTML = `<p>There was an error: ${data.reason || "Unable to fetch weather"}. Please try again later.</p>`;
	}else{
		let today = new Date();
		let code = data.current.weather_code;
		let desc = conditions[code].desc;
		let icon = conditions[code].path;

		let currentHTML = `<h3>${data.timezone || "Your Location"}</h3>
							<p>${today.toLocaleDateString("en-us", {weekday: "long"})}, ${today.toLocaleDateString("en-us", {month: "long"})} ${today.getDate()}</p>
							<img src="${conditions[data.current.weather_code].path}" alt="${conditions[data.current.weather_code].desc}">
							<p><b>Current Weather: </b>${Math.round(data.current.temperature_2m)}&deg; and ${conditions[data.current.weather_code].desc}</p>`;
		current.innerHTML = currentHTML;

		let forecastHTML = "";
		for(let i = 0; i < 8; i++){
			let date = new Date(data.daily.time[i]);
			let fCode = data.daily.weather_code[i];
			let fDesc = conditions[fCode].desc;
			let fIcon = conditions[fCode].path;

			forecastHTML += `<section class="day">
								<h3><span>${date.toLocaleDateString(undefined, optionsDay)}</span> ${date.toLocaleDateString(undefined, optionsMonth)} ${date.getDate()}</h3>
								<img src="${fIcon}" alt="${fDesc}">
								<p><b>High: </b>${Math.round(data.daily.temperature_2m_max[i])}&deg;</p>
								<p><b>Low: </b>${Math.round(data.daily.temperature_2m_min[i])}&deg;</p>
								<p>${fDesc}</p>
							</section>`;
		}
		forecast.innerHTML = forecastHTML;
	}
}

async function getWeather(location){
	let latitude = location.coords.latitude;
	let longitude = location.coords.longitude;

	let endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_min,temperature_2m_max,weather_code&forecast_days=8&hourly=temperature_2m&timezone=America%2FDenver&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`;

	try {
		let response = await fetch(endpoint);
		let data = await response.json();
		displayData(data);
	} catch (error) {
		displayData({ error: true, reason: error.message });
	}
}

function loadFallbackWeather(){
	let location = {
		coords: {
			latitude: 45.8150,  // Zagreb latitude
			longitude: 15.9819 // Zagreb longitude
		}
	};
	getWeather(location);
}

await fetch(endpoint)
	.then(Response => Response.json())
	.then(data => {
		displayData(data);
		console.log(data);
	})

	.catch(err => {
		console.error(err);
	})

window.addEventListener("load", function(){
	if(!navigator.geolocation) {
		document.getElementById("forecast").textContent = 'Geolocation is not supported by your browser';
		loadFallbackWeather();
	} else {
		navigator.geolocation.getCurrentPosition(getWeather, loadFallbackWeather);
	}

	let now = new Date();
	let span = document.querySelector("footer span");
	span.innerHTML = now.getFullYear();
});