import { useState, useEffect } from "react"
import Weather from "./Weather"

export type Hourly = {
  "time": string,
  "values": {
  "cloudBase": number,
  "cloudCeiling": number,
  "cloudCover": number,
  "dewPoint": number,
  "evapotranspiration": number,
  "freezingRainIntensity": number,
  "humidity": number,
  "iceAccumulation": number,
  "iceAccumulationLwe": number,
  "precipitationProbability": number,
  "pressureSurfaceLevel": number,
  "rainAccumulation": number,
  "rainAccumulationLwe": number,
  "rainIntensity": number,
  "sleetAccumulation": number,
  "sleetAccumulationLwe": number,
  "sleetIntensity": number,
  "snowAccumulation": number,
  "snowAccumulationLwe": number,
  "snowIntensity": number,
  "temperature": number,
  "temperatureApparent": number,
  "uvHealthConcern": number,
  "uvIndex": number,
  "visibility": number,
  "weatherCode": number,
  "windDirection": number,
  "windGust": number,
  "windSpeed": number
  }
}

export type Daily = {
  "time": string,
  "values": {
    "cloudBaseAvg": number,
    "cloudBaseMax": number,
    "cloudBaseMin": number,
    "cloudCeilingAvg": number,
    "cloudCeilingMax": number,
    "cloudCeilingMin": number,
    "cloudCoverAvg": number,
    "cloudCoverMax": number,
    "cloudCoverMin": number,
    "dewPointAvg": number,
    "dewPointMax": number,
    "dewPointMin": number,
    "evapotranspirationAvg": number,
    "evapotranspirationMax": number,
    "evapotranspirationMin": number,
    "evapotranspirationSum": number,
    "freezingRainIntensityAvg": number,
    "freezingRainIntensityMax": number,
    "freezingRainIntensityMin": number,
    "humidityAvg": number,
    "humidityMax": number,
    "humidityMin": number,
    "iceAccumulationAvg": number,
    "iceAccumulationLweAvg": number,
    "iceAccumulationLweMax": number,
    "iceAccumulationLweMin": number,
    "iceAccumulationLweSum": number,
    "iceAccumulationMax": number,
    "iceAccumulationMin": number,
    "iceAccumulationSum": number,
    "moonriseTime": null,
    "moonsetTime": null,
    "precipitationProbabilityAvg": number,
    "precipitationProbabilityMax": number,
    "precipitationProbabilityMin": number,
    "pressureSurfaceLevelAvg": number,
    "pressureSurfaceLevelMax": number,
    "pressureSurfaceLevelMin": number,
    "rainAccumulationAvg": number,
    "rainAccumulationLweAvg": number,
    "rainAccumulationLweMax": number,
    "rainAccumulationLweMin": number,
    "rainAccumulationMax": number,
    "rainAccumulationMin": number,
    "rainAccumulationSum": number,
    "rainIntensityAvg": number,
    "rainIntensityMax": number,
    "rainIntensityMin": number,
    "sleetAccumulationAvg": number,
    "sleetAccumulationLweAvg": number,
    "sleetAccumulationLweMax": number,
    "sleetAccumulationLweMin": number,
    "sleetAccumulationLweSum": number,
    "sleetAccumulationMax": number,
    "sleetAccumulationMin": number,
    "sleetIntensityAvg": number,
    "sleetIntensityMax": number,
    "sleetIntensityMin": number,
    "snowAccumulationAvg": number,
    "snowAccumulationLweAvg": number,
    "snowAccumulationLweMax": number,
    "snowAccumulationLweMin": number,
    "snowAccumulationLweSum": number,
    "snowAccumulationMax": number,
    "snowAccumulationMin": number,
    "snowAccumulationSum": number,
    "snowIntensityAvg": number,
    "snowIntensityMax": number,
    "snowIntensityMin": number,
    "sunriseTime": string,
    "sunsetTime": string,
    "temperatureApparentAvg": number,
    "temperatureApparentMax": number,
    "temperatureApparentMin": number,
    "temperatureAvg": number,
    "temperatureMax": number,
    "temperatureMin": number,
    "uvHealthConcernAvg": number,
    "uvHealthConcernMax": number,
    "uvHealthConcernMin": number,
    "uvIndexAvg": number,
    "uvIndexMax": number,
    "uvIndexMin": number,
    "visibilityAvg": number,
    "visibilityMax": number,
    "visibilityMin": number,
    "weatherCodeMax": number,
    "weatherCodeMin": number,
    "windDirectionAvg": number,
    "windGustAvg": number,
    "windGustMax": number,
    "windGustMin": number,
    "windSpeedAvg": number,
    "windSpeedMax": number,
    "windSpeedMin": number
}
}

export type WeatherType = {
  "timelines": {
      "hourly": Hourly[]
      "daily": Daily[]
  },
  "location": {
      "lat": number,
      "lon": number
  }
}

function App() {
  const [location, setLocation] = useState<string | null>(null);
  const [data, setData] = useState<WeatherType | null>(null);
  const [formData, setFormData] = useState<string>("")
  const [message, setMessage] = useState<string>("Wait")

  // localStorage.setItem("locations", JSON.stringify((JSON.parse(locations)).push(locationName)))

  function updateLocations(locationName: string) {
    const locationsString = localStorage.getItem("locations")
    const locationsArray = locationsString ? JSON.parse(locationsString): undefined
    if(locationsArray && !locationsArray.includes(locationName)) {
      locationsArray.push(locationName)
    }
    locationsString ? localStorage.setItem("locations", JSON.stringify(locationsArray)) : localStorage.setItem("locations", `["${locationName}"]`)
  }

  const fetchData = async (query?: string) => {
    if (!query) {
      async function success(position: GeolocationPosition) {
        setLocation(`${position.coords.latitude},${position.coords.longitude}`)
        await fetch(`https://api.tomorrow.io/v4/weather/forecast?location=${location}&timesteps=1h&timesteps=1d&apikey=${import.meta.env.VITE_API_KEY}`)
        .then(res => res.json())
        .then((result: WeatherType) => {
          setData(result)
        })
      }
    
      function error() {
        setMessage("Unable to retrieve your location. Please try enabling geolocation services in your browser or type in a location below.")
      }

      if(!navigator.geolocation) {
        setMessage("This browser doesn't support geolocation. Please type in a location below.")
      } else {
        setMessage("Checking location...")
        navigator.geolocation.getCurrentPosition(success, error)
      }
    } else {
        await fetch(`http://localhost:3000/${query}`)
        .then(res => res.json())
        .then(result => {
          updateLocations(`${result.location.lat},${result.location.lon}`)
          setData(result)
        })

      }
    }

  useEffect(() => {
    fetchData();
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchData(formData.toLowerCase())
  }

  return (
    <div className="container">
      <div className="header"><h1>RainCheck</h1></div>
      {data === null ? <div className="status">{message}</div> : 
        <Weather data={data} />
      }
      <form onSubmit={handleSubmit} className="footer">
        <label htmlFor="location">Check the weather in your location:</label>
        <input type="text" name="location" id="location" onChange={handleChange} value={formData} autoComplete="country"/>
        <button>Check</button>
      </form>
    </div>
  )
}

export default App

// import { useState, useEffect } from "react"
// import Weather from "./Weather"
// import { fetchWeatherApi } from 'openmeteo';

// type WeatherType = {
//   current: {
//     time: Date;
//     temperature: number;
//     weatherCode: number;
//     windSpeed: number;
//     windDirection: number;
//   };
//   hourly: {
//     time: Date[];
//     temperature: Float32Array;
//     precipitation: Float32Array;
//   };
//   daily: {
//     time: Date[];
//     weatherCode: Float32Array;
//     temperatureMax: Float32Array;
//     temperatureMin: Float32Array;
//   };
// }

// function App() {
//   const [lat, setLat] = useState(52.36);
//   const [lon, setLon] = useState(4.90);
//   const [data, setData] = useState([]);
//   const [formData, setFormData] = useState({ location: "" })

//   const getLocation = async () => {
//     await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${formData.location}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`)
//       .then(res => res.json())
//       .then(result => {
//         setLat(result.features[0].geometry.coordinates[1])
//         setLon(result.features[0].geometry.coordinates[0])
//       })
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       const params = {
//         latitude: [lat],
//         longitude: [lon],
//         current: 'temperature_2m,weather_code,wind_speed_10m,wind_direction_10m',
//         hourly: 'temperature_2m,precipitation',
//         daily: 'weather_code,temperature_2m_max,temperature_2m_min'
//       };
//       const url = 'https://api.open-meteo.com/v1/forecast';
//       const responses = await fetchWeatherApi(url, params)

//       // Helper function to form time ranges
//       const range = (start: number, stop: number, step: number) =>
//         Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

//       // Process first location. Add a for-loop for multiple locations or weather models
//       const response = responses[0];

//       // Attributes for timezone and location
//       const utcOffsetSeconds = response.utcOffsetSeconds();

//       const current = response.current()!;
//       const hourly = response.hourly()!;
//       const daily = response.daily()!;

//       // Note: The order of weather variables in the URL query and the indices below need to match!
//       const weatherData = {
//         current: {
//           time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
//           temperature: current.variables(0)!.value(), // Current is only 1 value, therefore `.value()`
//           weatherCode: current.variables(1)!.value(),
//           windSpeed: current.variables(2)!.value(),
//           windDirection: current.variables(3)!.value()
//         },
//         hourly: {
//           time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
//             (t) => new Date((t + utcOffsetSeconds) * 1000)
//           ),
//           temperature: hourly.variables(0)!.valuesArray()!, // `.valuesArray()` get an array of floats
//           precipitation: hourly.variables(1)!.valuesArray()!,
//         },
//         daily: {
//           time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
//             (t) => new Date((t + utcOffsetSeconds) * 1000)
//           ),
//           weatherCode: daily.variables(0)!.valuesArray()!,
//           temperatureMax: daily.variables(1)!.valuesArray()!,
//           temperatureMin: daily.variables(2)!.valuesArray()!,
//         }
//       };
//       // `weatherData` now contains a simple structure with arrays for datetime and weather data
//       setData(weatherData)
//     }
//     fetchData()
//   }, [lat, lon])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((currFormData) => {
//       return { ...currFormData, [e.target.name]: e.target.value }
//     })
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     getLocation()
//   }

//   return (
//     <div className="container">
//       <div className="header"><h1>RainCheck</h1></div>
//       {Array.isArray(data) ? <h2>Loading weather...</h2> :
//         <Weather data={data} />
//       }
//       <form onSubmit={handleSubmit} className="footer">
//         <label htmlFor="location">Check the weather in your location:</label>
//         <input type="text" name="location" id="location" onChange={handleChange} value={formData.location} />
//         <button>Check</button>
//       </form>
//     </div>
//   )
// }

// export default App

// export type Timestamp = {
//   "dt": number,
//   "main": {
//     "temp": number,
//     "feels_like": number,
//     "temp_min": number,
//     "temp_max": number,
//     "pressure": number,
//     "sea_level": number,
//     "grnd_level": number,
//     "humidity": number,
//     "temp_kf": number
//   },
//   "weather": [
//     {
//       "id": number,
//       "main": string,
//       "description": string,
//       "icon": string
//     }
//   ],
//   "clouds": {
//     "all": number
//   },
//   "wind": {
//     "speed": number,
//     "deg": number,
//     "gust": number
//   },
//   "visibility": number,
//   "pop": number,
//   "rain": {
//     "3h": number
//   },
//   "sys": {
//     "pod": string
//   },
//   "dt_txt": string
// }

// export type WeatherType = {
//   "cod": string,
//   "message": 0,
//   "cnt": number,
//   "list": Timestamp[],
//   "city": {
//     "id": number,
//     "name": string,
//     "coord": {
//       "lat": number,
//       "lon": number
//     },
//     "country": string,
//     "population": number,
//     "timezone": number,
//     "sunrise": number,
//     "sunset": number
//   }
// }

// const fetchData = async () => {
//   await fetch(`${import.meta.env.VITE_API_URL}/forecast/?lat=${lat}&lon=${lon}&units=metric&APPID=${import.meta.env.VITE_API_KEY}`)
//     .then(res => res.json())
//     .then(result => {
//       setData(result)
//       console.log(result);
//     })
// }

// const getLocation = async () => {
//   await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${formData.location}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`)
//     .then(res => res.json())
//     .then(result => {
//       setLat(result.features[0].geometry.coordinates[1])
//       setLon(result.features[0].geometry.coordinates[0])
//     })
// }