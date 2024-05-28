import { useState, useEffect, createContext } from "react";
import LocationWeather from "./LocationWeather";
import Locations from "./Locations";
import { LocationsContextType, WeatherData } from "../lib/types/Interfaces";
import { fetchGeolocationData, fetchLocalData } from "../lib/utils";

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
  const [geolocation, setGeolocation] = useState<Map<
    string,
    WeatherData
  > | null>(null);
  const [locations, setLocations] = useState<Map<string, WeatherData> | null>(
    null
  );
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handleLocationClick = (location: string) => {
    if (locations && locations.has(location)) {
      const locationData = locations.get(location);
      locationData !== undefined && setDisplayedWeather(locationData);
      setSelectedLocation(location);
    } else if (geolocation && geolocation.has(location)) {
      const locationData = geolocation.get(location);
      locationData !== undefined && setDisplayedWeather(locationData);
      setSelectedLocation(location);
    }
  };

  const fetchData = async () => {
    const [geolocationData, localData] = await Promise.all([
      fetchGeolocationData(),
      fetchLocalData(localStorageData),
    ]);
    return { geolocationData: geolocationData, localData: localData };
  };

  useEffect(() => {
    async function load() {
      const { geolocationData, localData } = await fetchData();
      setGeolocation(geolocationData);
      setLocations(localData);
      if (geolocationData) {
        setDisplayedWeather(geolocationData.values().next().value);
      } else if (localData) {
        setDisplayedWeather(localData.values().next().value);
      } else setDisplayedWeather(null);
      setIsLoading(false);
    }
    load();
  }, []);

  return (
    <LocationsContext.Provider
      value={{
        localStorageData,
        geolocation,
        setGeolocation,
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
        <div className="footer">© 2024 Monika Dybalska</div>
      </div>
    </LocationsContext.Provider>
  );
}
