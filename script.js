const timeE1 = document.getElementById('time');
const dateE1 = document.getElementById('date');
const currentWeatherItemsE1 = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone')
const countryE1 = document.getElementById('country');
const weatherForecastE1 = document.getElementById('weather-forecast');
const currentTempE1 = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = '250a0772c7b3edc284d1fbd54085dced';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour ;
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeE1.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0' +minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`

    dateE1.innerHTML = days[day] + ', ' + date+ ' ' + months[month];

}, 1000);

getWeatherData()
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {

        let {latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data)
            showWeatherData(data);
        })
    });
}

function showWeatherData (data){
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;

    timezone.innerHTML = data.timezone;
    countryE1.innerHTML = data.lat + 'N ' + data.lon+ 'E '

    currentWeatherItemsE1.innerHTML =
     `<div class="weather-item">
        <p>Humidity</p>
        <p>${humidity} %</p>
    </div>
    <div class="weather-item">
        <p>Pressure</p>
        <p>${pressure} hPa</p>
    </div>
    <div class="weather-item">
        <p>Wind speed </p>
        <p>${wind_speed }m/s</p>
    </div>
    <div class="weather-item">
        <p>Sunrise</p>
        <p>${window.moment(sunrise * 1000).format('HH:mm a')}</p>
    </div>
    <div class="weather-item">
        <p>Sunset</p>
        <p>${window.moment(sunset * 1000).format('HH:mm a')}</p>
    </div>`;

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0) {
            currentTempE1.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt * 1000).format('dddd')}</div>
                <div class="temp">Day ~ ${day.temp.day}&#176; C</div>
                <div class="temp">Night ~ ${day.temp.night}&#176; C</div>
            </div>
            `
        } else {
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Day  ~   ${day.temp.day}&#176; C</div>
                <div class="temp">Night  ~  ${day.temp.night}&#176; C</div>
            </div>
            `
        }
    });

    weatherForecastE1.innerHTML = otherDayForcast;
}
