import { useState, useEffect, createContext } from "react";
import LocationWeather from "./LocationWeather";
import Locations from "./Locations";
import { LocationsContextType, WeatherData } from "./types/Interfaces";
import { fetchGeolocationData, fetchLocalData } from "./utils";

export const LocationsContext = createContext<LocationsContextType | null>(
  null
);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [displayedWeather, setDisplayedWeather] = useState<WeatherData | null>(
    null
  );
  const [message, setMessage] = useState<string>(
    "You currently have no saved locations. Try enabling geolocation in your browser or add a new location below."
  );
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

  const fetchData = async () => {
    const newLocations = new Map(locations);
    // const currentLocation = await fetchGeolocationData(newLocations);
    // const localData = await fetchLocalData(localStorageData, newLocations);
    const [currentLocation, localData] = await Promise.all([
      fetchGeolocationData(),
      fetchLocalData(localStorageData),
    ]);
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
      const locationsData = await fetchData();
      setLocations(locationsData);
      locationsData
        ? setDisplayedWeather(locationsData.values().next().value)
        : setDisplayedWeather(null);
      setIsLoading(false);
    }
    load();
  }, []);

  // useEffect(() => {
  //   async function load() {
  //     const [currentLocation, localData] = await Promise.all([
  //       fetchGeolocationData(newLocations),
  //       fetchLocalData(localStorageData, newLocations),
  //     ]);
  //     setIsLoading(false);
  //     if (currentLocation && localData) {
  //       setLocations(new Map([...currentLocation, ...localData]));
  //       setDisplayedWeather(currentLocation.values().next().value);
  //     } else if (currentLocation) {
  //       setLocations(new Map(currentLocation));
  //       setDisplayedWeather(currentLocation.values().next().value);
  //     } else if (localData) {
  //       setLocations(new Map(localData));
  //       setDisplayedWeather(localData.values().next().value);
  //     } else {
  //       setLocations(null);
  //       setDisplayedWeather(null);
  //     }
  //     console.log(locations);
  //   }
  //   load();
  // }, []);

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
        message,
        setMessage,
      }}
    >
      <div className="container">
        <div className="header">
          <span
            className="material-symbols-outlined menu"
            onClick={() => setDisplayedWeather(null)}
          >
            menu
          </span>
          <h1>RainCheck</h1>
        </div>
        {isLoading ? (
          <div className="status">Loading weather...</div>
        ) : (
          <>
            {displayedWeather === null || displayedWeather === undefined ? (
              <Locations />
            ) : (
              <LocationWeather displayedWeather={displayedWeather} />
            )}
          </>
        )}
        <div className="footer">© 2024 Chryja</div>
      </div>
    </LocationsContext.Provider>
  );
}
// https://api.tomorrow.io/v4/weather/forecast?location=52.3563,4.8096&timesteps=1h&timesteps=1d&apikey={{VITE_API_KEY}}
