import { useState, useEffect, useRef, createContext, useContext } from "react";
import Weather from "./Weather";
import Mapbox from "./Mapbox";
import Locations from "./Locations";

export type Hourly = {
  time: string;
  values: {
    cloudBase: number;
    cloudCeiling: number;
    cloudCover: number;
    dewPoint: number;
    evapotranspiration: number;
    freezingRainIntensity: number;
    humidity: number;
    iceAccumulation: number;
    iceAccumulationLwe: number;
    precipitationProbability: number;
    pressureSurfaceLevel: number;
    rainAccumulation: number;
    rainAccumulationLwe: number;
    rainIntensity: number;
    sleetAccumulation: number;
    sleetAccumulationLwe: number;
    sleetIntensity: number;
    snowAccumulation: number;
    snowAccumulationLwe: number;
    snowIntensity: number;
    temperature: number;
    temperatureApparent: number;
    uvHealthConcern: number;
    uvIndex: number;
    visibility: number;
    weatherCode: number;
    windDirection: number;
    windGust: number;
    windSpeed: number;
  };
};

export type Daily = {
  time: string;
  values: {
    cloudBaseAvg: number;
    cloudBaseMax: number;
    cloudBaseMin: number;
    cloudCeilingAvg: number;
    cloudCeilingMax: number;
    cloudCeilingMin: number;
    cloudCoverAvg: number;
    cloudCoverMax: number;
    cloudCoverMin: number;
    dewPointAvg: number;
    dewPointMax: number;
    dewPointMin: number;
    evapotranspirationAvg: number;
    evapotranspirationMax: number;
    evapotranspirationMin: number;
    evapotranspirationSum: number;
    freezingRainIntensityAvg: number;
    freezingRainIntensityMax: number;
    freezingRainIntensityMin: number;
    humidityAvg: number;
    humidityMax: number;
    humidityMin: number;
    iceAccumulationAvg: number;
    iceAccumulationLweAvg: number;
    iceAccumulationLweMax: number;
    iceAccumulationLweMin: number;
    iceAccumulationLweSum: number;
    iceAccumulationMax: number;
    iceAccumulationMin: number;
    iceAccumulationSum: number;
    moonriseTime: null;
    moonsetTime: null;
    precipitationProbabilityAvg: number;
    precipitationProbabilityMax: number;
    precipitationProbabilityMin: number;
    pressureSurfaceLevelAvg: number;
    pressureSurfaceLevelMax: number;
    pressureSurfaceLevelMin: number;
    rainAccumulationAvg: number;
    rainAccumulationLweAvg: number;
    rainAccumulationLweMax: number;
    rainAccumulationLweMin: number;
    rainAccumulationMax: number;
    rainAccumulationMin: number;
    rainAccumulationSum: number;
    rainIntensityAvg: number;
    rainIntensityMax: number;
    rainIntensityMin: number;
    sleetAccumulationAvg: number;
    sleetAccumulationLweAvg: number;
    sleetAccumulationLweMax: number;
    sleetAccumulationLweMin: number;
    sleetAccumulationLweSum: number;
    sleetAccumulationMax: number;
    sleetAccumulationMin: number;
    sleetIntensityAvg: number;
    sleetIntensityMax: number;
    sleetIntensityMin: number;
    snowAccumulationAvg: number;
    snowAccumulationLweAvg: number;
    snowAccumulationLweMax: number;
    snowAccumulationLweMin: number;
    snowAccumulationLweSum: number;
    snowAccumulationMax: number;
    snowAccumulationMin: number;
    snowAccumulationSum: number;
    snowIntensityAvg: number;
    snowIntensityMax: number;
    snowIntensityMin: number;
    sunriseTime: string;
    sunsetTime: string;
    temperatureApparentAvg: number;
    temperatureApparentMax: number;
    temperatureApparentMin: number;
    temperatureAvg: number;
    temperatureMax: number;
    temperatureMin: number;
    uvHealthConcernAvg: number;
    uvHealthConcernMax: number;
    uvHealthConcernMin: number;
    uvIndexAvg: number;
    uvIndexMax: number;
    uvIndexMin: number;
    visibilityAvg: number;
    visibilityMax: number;
    visibilityMin: number;
    weatherCodeMax: number;
    weatherCodeMin: number;
    windDirectionAvg: number;
    windGustAvg: number;
    windGustMax: number;
    windGustMin: number;
    windSpeedAvg: number;
    windSpeedMax: number;
    windSpeedMin: number;
  };
};

export type WeatherType = {
  timelines: {
    hourly: Hourly[];
    daily: Daily[];
  };
  location: {
    lat: number;
    lon: number;
  };
  google: {
    plus_code: {
      compound_code: string;
      global_code: string;
    };
    results: {
      address_components: {
        long_name: string;
        short_name: string;
        types: string[];
      }[];
      formatted_address: string;
      geometry: {
        bounds: {
          northeast: {
            lat: string;
            lng: string;
          };
          southwest: {
            lat: string;
            lng: string;
          };
        };
        location: {
          lat: string;
          lng: string;
        };
        location_type: string;
        viewport: {
          northeast: {
            lat: string;
            lng: string;
          };
          southwest: {
            lat: string;
            lng: string;
          };
        };
      };
      place_id: string;
      types: string[];
    }[];
    status: string;
  };
};

function App() {
  const [location, setLocation] = useState<string | null>(null);
  const [data, setData] = useState<WeatherType | null>(null);
  const [formData, setFormData] = useState<string>("");
  const [message, setMessage] = useState<string>("Wait");
  const [locationsToggle, setLocationsToggle] = useState<boolean>(false);
  const ref = useRef<HTMLInputElement>(null);

  function updateLocations(locationName: string) {
    const locationsString = localStorage.getItem("locations");
    const locationsArray = locationsString
      ? JSON.parse(locationsString)
      : undefined;
    if (locationsArray && !locationsArray.includes(locationName)) {
      locationsArray.push(locationName);
    }
    locationsString
      ? localStorage.setItem("locations", JSON.stringify(locationsArray))
      : localStorage.setItem("locations", `["${locationName}"]`);
  }

  const fetchData = async (query?: string) => {
    if (!query) {
      async function success(position: GeolocationPosition) {
        setLocation(`${position.coords.latitude},${position.coords.longitude}`);
        await fetch(
          `https://api.tomorrow.io/v4/weather/forecast?location=${location}&timesteps=1h&timesteps=1d&apikey=${
            import.meta.env.VITE_TOMORROW_API_KEY
          }`
        )
          .then((res) => res.json())
          .then((result: WeatherType) => {
            setData(result);
          });
      }

      function error() {
        setMessage(
          "Unable to retrieve your location. Please try enabling geolocation services in your browser or select a location below."
        );
      }

      if (!navigator.geolocation) {
        setMessage(
          "This browser doesn't support geolocation. Please add a new location below."
        );
      } else {
        setMessage("Checking location...");
        navigator.geolocation.getCurrentPosition(success, error);
      }
    } else {
      await fetch(`http://localhost:3000/${query}`)
        .then((res) => res.json())
        .then((result) => {
          updateLocations(query);
          setData(result);
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(formData.toLowerCase());
  };

  const handleLocationsClick = () => {
    setLocationsToggle(!locationsToggle);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>RainCheck</h1>
      </div>
      <div className="locations" onClick={() => handleLocationsClick()}>
        <span className="material-symbols-outlined m">location_on</span>
        <p>Manage locations</p>
      </div>
      {locationsToggle && <Locations data={data} setData={setData} />}
      {data === null ? (
        <div className="status">{message}</div>
      ) : (
        <Weather data={data} />
      )}
      <div className="footer">© 2024 Chryja</div>
    </div>
  );
}

export default App;
