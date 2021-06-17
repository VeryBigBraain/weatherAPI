const weatherForm = document.querySelector('.weather__form');
const cityInput = document.querySelector('.weather__input');

let city = 'Moscow';

// Get weather data
function weatherBalloon( cityName ) {
	var key = 'c41e73df32237141c5d0e605eb7aa984';
	reqUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName+ '&appid=' + key;

	fetch(reqUrl)  
		.then(resp => resp.json()) // Convert data to json
		.then(data => {
			drawWeather(data);
			console.log(data);
		})
		.catch(err => console.log(err));
}

// Default
window.onload = function() {
	weatherBalloon(city);
  }

// Show weather data
function drawWeather( d ) {
	let celcius = Math.round(parseFloat(d.main.temp) - 273.15);
	let fahrenheit = Math.round(((parseFloat(d.main.temp) - 273.15) * 1.8) + 32); 
	let description = d.weather[0].description;
	
	document.querySelector('.weather__description').innerHTML = d.weather[0].description;
	document.querySelector('.weather__temp').innerHTML = celcius + '&deg;';
	document.querySelector('.weather__humidity').innerHTML = 'Humidity ' + d.main.humidity + '%';
	document.querySelector('.weather__wind').innerHTML = 'Wind speed ' + d.wind.speed + 'm/s';
	document.querySelector('.weather__location').innerHTML = d.name;

	if( description.indexOf('rain') > 0 ) {
		document.querySelector('.weather').classList.add('rainy');
	} else if( description.indexOf('cloud') > 0 ) {
		document.querySelector('.weather').classList.add('cloudy');
	} else if( description.indexOf('sunny') > 0 ) {
		document.querySelector('.weather').classList.add('sunny');
	}
}

// Show users city
cityInput.addEventListener('change', (e) => {
	city = e.target.value;
});
weatherForm.addEventListener('submit', (e) => {
	e.preventDefault();
	weatherBalloon(city);
	cityInput.value = "";
});