import { useState, useEffect, createContext } from "react";
import LocationWeather from "./LocationWeather";
import Locations from "./Locations";
import { LocationsContextType, WeatherData } from "./types/Interfaces";

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
