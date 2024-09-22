
import './App.css';
import { useEffect, useState } from 'react';
import searchIcon from './assets/search.png';
import humidityIcon from './assets/humidity.png';
import windIcon from './assets/wind.gif';
import clearIcon from './assets/clear.png';
import drizzleIcon from './assets/drizzle.gif';
import snowIcon from './assets/snow.gif';
import rainIcon from './assets/rain.gif';
import cloudyIcon from './assets/cloudy.gif';
import PropTypes from "prop-types";
const WeatherInfo = ({ icon, temp, city, country, lat, log ,humidity, wind}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="Image" />
      </div>
      <div className='temp'>{temp}°C</div>
      <div className='location'>{city}</div>
      <div className='country'>{country}</div>
      <div className='cord'>
        <div>
          <span className='lat'>Latitude </span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='log'>Longitude </span>
          <span>{log}</span>
        </div>
      </div>
      <div className='data-container'>
        <div className='element'>
          <img src={humidityIcon} alt='humidity' className='icon' />
          <div className='data'>
            <div className='percent'>{humidity}%</div>
            <div className='text'>Humidity</div>
          </div>
        </div>
        <div className='element'>
          <img src={windIcon} alt='wind' className='icon' />
          <div className='data'>
            <div className='percent'>{wind} km/h</div>
            <div className='text'>Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  )
};

WeatherInfo.propTypes={
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  humidity:PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
  lat:PropTypes.number.isRequired,
  log:PropTypes.number.isRequired
}

function App() {
  let api_key="9af4efdd02c0bb4d5390a049b376ae10";

  const [icon, setIcon] = useState(clearIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  const [text,setText]=useState("Chennai");
  const [loading,setLoading] =useState(false);
  const [cityNotFound,setCityNotFound] =useState(false);
  const[error,setError]=useState(null);
  
  const weatherIconData={
    "01d":clearIcon,
    "01n":clearIcon,
    "02d":cloudyIcon,
    "02n":cloudyIcon,
    "03d":drizzleIcon,
    "03n":drizzleIcon,
    "04d":drizzleIcon,
    "04n":drizzleIcon,
    "09d":rainIcon,
    "09n":rainIcon,
    "10d":rainIcon,
    "10n":rainIcon,
    "13d":snowIcon,
    "13n":snowIcon
  }
  const search= async()=>{
    setLoading(true);
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;
    try{
      let res=await fetch(url);
      let data=await res.json();
      if(data.cod=="404")
      {
        console.log("City Not found");
        setCityNotFound(true);
        setLoading(false); 
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIcon=data.weather[0].icon;
      setIcon(weatherIconData[weatherIcon]||clearIcon);
      setCityNotFound(false);
      console.log(data);
    }catch(err)
    {
      console.error("An error occured", err.message);
      setError("An error occurred while fetching data");
    }
    finally{
      setLoading(false);
    }
  }

  const cityName=(e)=>{
    setText(e.target.value);
  }

  const keyDown=(e)=>{
    if(e.key=="Enter")
    {
      search();
    }
  }

  useEffect(function(){
    search();
  },[])
  return (
    <div className="container" >
      <div className="input-container">
        <input type="text" 
        className='cityInput' 
        placeholder='Search city' 
        onChange={cityName} 
        value={text}
        onKeyDown={keyDown}/>
        <div className='search-icon' onClick={()=>{
          search();
        }}>
          <img src={searchIcon} alt='Search' />
        </div>
      </div>

      {loading && <div className="loading-msg">Loading...</div>}
      {error && <div className="error-msg">{error}</div>}
      {cityNotFound && <div className="cityNotFound">City Not found</div>}

      {!loading && !cityNotFound && <WeatherInfo icon={icon} temp={temp} city={city} 
      country={country} lat={lat} log={log} 
      humidity={humidity} wind={wind}/>}
      <p className='copyright'>
        Designed by <span>Janavi S</span>
      </p>
    </div>
  );
}

export default App;