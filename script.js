const weatherForm = document.querySelector('.weather__form');
const cityInput = document.querySelector('.weather__input');
const weatherIcon = document.querySelector('.weather__icon');
const weatherBtn = document.querySelector('.weather__btn');
const weatherContent = document.querySelector('.weather__content');
const loader = document.querySelector('.lds-ring');
const lifeTime = 600000;

let city = 'Moscow';
let pretendWeatherState = 'clear';
loader.style.opacity = 0;

// Get weather data
function weatherBalloon( cityName ) {
	var key = 'c41e73df32237141c5d0e605eb7aa984';
	reqUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName+ '&appid=' + key;
	weatherContent.style.opacity = 0;
	loader.style.opacity = 100;
	
	fetch(reqUrl)  
		.then(resp => resp.json()) // Convert data to json
		.then(data => {
			drawWeather(data);
			setLocalStorage(data, cityName);
		})
	.catch(err => console.log(err));
}

// Setting item to LocalStorage
function setLocalStorage(data, cityName) {
	const now = new Date()

	const item = {
		data,
		expiry: now.getTime() + lifeTime
	};
	localStorage.setItem(cityName, JSON.stringify(item));
};

// Getting item from LocalStorage
function getLocalStorage(city) {
	const cityItem = localStorage.getItem(city);
	// Check item in localStorage
	if (cityItem) {
		const item = JSON.parse(cityItem)
		const now = new Date()

		if (now.getTime() > item.expiry) {
			// If the item is expired, delete the item from storage
			// and add new one
			localStorage.removeItem(city);
			weatherBalloon(city);
		} else {
			drawWeather(item.data);
		}
	} else {
		weatherBalloon(city);
	}

	return null;
};

// Show weather data
function drawWeather( d ) {
	// Finish loading animation
	weatherContent.style.opacity = 100;
	loader.style.opacity = 0;

	let celcius = Math.round(parseFloat(d.main.temp) - 273.15);
	let fahrenheit = Math.round(((parseFloat(d.main.temp) - 273.15) * 1.8) + 32); 
	let description = d.weather[0].description;
	
	document.querySelector('.weather__description').innerHTML = d.weather[0].description;
	document.querySelector('.weather__temp').innerHTML = celcius + '&deg;';
	document.querySelector('.weather__humidity').innerHTML = '<span>humidity: </span>' + d.main.humidity + '%';
	document.querySelector('.weather__wind').innerHTML = '<span>wind speed: </span>' + d.wind.speed + 'm/s';
	document.querySelector('.weather__location').innerHTML = d.name;

	if( description.indexOf('rain') > 0 ) {
		document.querySelector('.weather').classList.remove(pretendWeatherState);
		document.querySelector('.weather').classList.add('rainy');
		weatherIcon.innerHTML = `
			<div class="icon rainy">
				<div class="cloud"></div>
				<div class="rain"></div>
			</div>
		`;
		weatherIcon.style.color = "#76a5a2";
		pretendWeatherState = 'rainy';
	} else if( description.indexOf('cloud') > 0 ) {
		document.querySelector('.weather').classList.remove(pretendWeatherState);
		document.querySelector('.weather').classList.add('cloudy');
		weatherIcon.innerHTML = `
			<div class="icon cloudy">
                <div class="cloud"></div>
                <div class="cloud"></div>
            </div>
		`;
		weatherIcon.style.color = "#637c7b";
		pretendWeatherState = 'cloudy';
	} else if( description.indexOf('sunny') > 0 ) {
		document.querySelector('.weather').classList.remove(pretendWeatherState);
		document.querySelector('.weather').classList.add('sunny');
		weatherIcon.innerHTML = `
			<div class="icon sunny">
				<div class="sun">
					<div class="rays"></div>
				</div>
			</div>
		`;
		weatherIcon.style.color = "#ff713e";
		pretendWeatherState = 'sunny';
	} else {
		document.querySelector('.weather').classList.remove(pretendWeatherState);
		document.querySelector('.weather').classList.add('clear');
		weatherIcon.innerHTML = `
			<div class="icon cloudy">
                <div class="cloud"></div>
                <div class="cloud"></div>
            </div>
		`;
		weatherIcon.style.color = "#b3dbd9";
		pretendWeatherState = 'clear';
	}
}

// Show users city
cityInput.addEventListener('change', (e) => {
	city = e.target.value;
});
weatherBtn.addEventListener('click', (e) => {
	e.preventDefault();
	getLocalStorage(city);
	cityInput.value = "";
});

// Default
window.onload = function() {
	getLocalStorage(city);
};