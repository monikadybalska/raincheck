import { useState, useEffect, createContext } from "react";
import LocationWeather from "./LocationWeather";
import Locations from "./Locations";

export interface Hourly {
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
}
export interface Daily {
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
}
export interface WeatherData {
  timelines: {
    hourly: Hourly[];
    daily: Daily[];
  };
  location: {
    lat: number;
    lon: number;
  };
  google?: GoogleGeocodingData;
}
export interface GoogleGeocodingData {
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
}
export interface LocationsContextType {
  ["localStorageData"]: string[] | null;
  ["locations"]: Map<string, WeatherData> | null;
  ["setLocations"]: React.Dispatch<
    React.SetStateAction<Map<string, WeatherData> | null>
  >;
  ["selectedLocation"]: string | null;
  ["setSelectedLocation"]: React.Dispatch<React.SetStateAction<string | null>>;
  ["handleLocationClick"]: (location: string) => void;
  ["displayedWeather"]: WeatherData | null;
  ["setDisplayedWeather"]: React.Dispatch<
    React.SetStateAction<WeatherData | null>
  >;
}
export const LocationsContext = createContext<LocationsContextType | null>(
  null
);

export default function App() {
  const [loadingLocalStorageData, setLoadingLocalStorageData] = useState(true);
  // const [loadingGeolocation, setLoadingGeolocation] = useState(true);
  const [displayedWeather, setDisplayedWeather] = useState<WeatherData | null>(
    null
  );
  const [message, setMessage] = useState<string>("Wait");
  const localStorageString = localStorage.getItem("locations");
  const localStorageData: string[] | null = localStorageString
    ? JSON.parse(localStorageString)
    : null;
  const [locations, setLocations] = useState<Map<string, WeatherData> | null>(
    null
  );
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handleLocationClick = (location: string) => {
    locations && setDisplayedWeather(locations.get(location) ?? null);
    setSelectedLocation(location);
  };

  function getCurrentPosition(): Promise<GeolocationPosition> | null {
    if (!navigator.geolocation) {
      setMessage(
        "This browser doesn't support geolocation. Please add a new location below."
      );
      return null;
    } else {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    }
  }

  const fetchData = async () => {
    const currentLocations = new Map(locations);
    const fetchGeolocationData = async () => {
      try {
        const position = await getCurrentPosition();
        if (!position) return null;
        const google = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
            position.coords.latitude
          },${position.coords.longitude}&result_type=locality&key=${
            import.meta.env.VITE_GOOGLE_API_KEY
          }`
        ).then((res) => res.json());
        const weather: WeatherData = await fetch(
          "http://localhost:3000/52.3563,4.8096"
        ).then((res) => res.json());
        currentLocations.set(
          `${position.coords.latitude},${position.coords.longitude}`,
          { ...weather, google }
        );
        return currentLocations;
      } catch (e: unknown) {
        return null;
      }
    };

    const fetchLocalData = async () => {
      if (localStorageData) {
        const dataPromises = [];
        const namesPromises = [];
        for (let i = 0; i < localStorageData.length; i++) {
          dataPromises.push(
            fetch(`http://localhost:3000/${localStorageData[i]}`).then((res) =>
              res.json()
            )
          );
          namesPromises.push(
            fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
                localStorageData[i]
              }&result_type=locality&key=${import.meta.env.VITE_GOOGLE_API_KEY}`
            ).then((res) => res.json())
          );
        }
        const resolvedDataPromises = await Promise.all(dataPromises);
        const resolvedNamePromises = await Promise.all(namesPromises);
        for (let i = 0; i < localStorageData.length; i++) {
          currentLocations.set(localStorageData[i], {
            ...resolvedDataPromises[i],
            google: resolvedNamePromises[i],
          });
        }
        console.log("local data done!");
        return currentLocations;
      }
      return null;
    };

    const currentLocation = await fetchGeolocationData();
    const localData = await fetchLocalData();
    if (!currentLocation && !localData) {
      return null;
    } else if (!localData) {
      return new Map(currentLocation);
    } else if (!currentLocation) {
      return new Map(localData);
    } else return new Map([...currentLocation, ...localData]);
  };

  useEffect(() => {
    async function load() {
      const newLocations = await fetchData();
      setLocations(newLocations);
      newLocations
        ? setDisplayedWeather(newLocations.values().next().value)
        : setDisplayedWeather(null);
      setLoadingLocalStorageData(false);
    }
    load();
  }, []);

  return (
    <LocationsContext.Provider
      value={{
        localStorageData,
        locations,
        setLocations,
        displayedWeather,
        setDisplayedWeather,
        selectedLocation,
        setSelectedLocation,
        handleLocationClick,
      }}
    >
      <div className="container">
        <div className="header">
          <span className="material-symbols-outlined menu">menu</span>
          <h1 onClick={() => setDisplayedWeather(null)}>RainCheck</h1>
        </div>
        {/* {loadingGeolocation ? (
          <div className="status">{message}</div>
        ) : ( */}
        {/* <> */}
        {loadingLocalStorageData ? (
          <div className="status">Loading...</div>
        ) : (
          <>
            {displayedWeather === null || displayedWeather === undefined ? (
              <Locations />
            ) : (
              <LocationWeather displayedWeather={displayedWeather} />
            )}
          </>
        )}
        {/* </>
        )} */}
        <div className="footer">© 2024 Chryja</div>
      </div>
    </LocationsContext.Provider>
  );
}
// https://api.tomorrow.io/v4/weather/forecast?location=52.3563,4.8096&timesteps=1h&timesteps=1d&apikey={{VITE_API_KEY}}
