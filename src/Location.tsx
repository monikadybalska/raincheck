import { weatherCodes } from "./weatherCodes";
import { useContext } from "react";
import { WeatherData, LocationsContextType } from "./types/Interfaces";
import { LocationsContext } from "./App";
import { getIcon } from "./LocationWeather";

export default function Location({
  locationCoordinates,
  locationWeather,
  currentLocation,
}: {
  locationCoordinates: string;
  locationWeather: WeatherData;
  currentLocation: boolean;
}) {
  const context = useContext(LocationsContext) as LocationsContextType;
  const localStorageData = context.localStorageData;
  const locations = context.locations;
  const setLocations = context.setLocations;
  const setDisplayedWeather = context.setDisplayedWeather;
  const handleLocationClick = context.handleLocationClick;

  const handleDeleteLocation = (location: string) => {
    if (localStorageData !== null) {
      if (localStorageData.length > 1) {
        const index = localStorageData.indexOf(location);
        const newLocationsArray = localStorageData.toSpliced(index, 1);
        const newLocations = new Map(locations);
        newLocations.delete(location);
        setLocations && setLocations(newLocations);
        localStorage.setItem("locations", JSON.stringify(newLocationsArray));
      } else {
        localStorage.removeItem("locations");
        setLocations(null);
      }
      setDisplayedWeather(null);
    } else {
      console.log("Error");
    }
  };

  const currentDate = new Date(Date.now()).toISOString();
  const currentData = locationWeather.timelines.hourly.filter(
    (timestamp) => timestamp.time.slice(0, 13) === currentDate.slice(0, 13)
  )[0];

  return (
    <div
      key={locationCoordinates}
      className={`location ${
        weatherCodes.weatherCode[currentData.values.weatherCode]
      }`}
    >
      <div
        className="location-content"
        onClick={() => handleLocationClick(locationCoordinates)}
      >
        {/* {currentLocation && (
          <div className="location-row" style={{ paddingBottom: 0 }}>
            <div className="label">
              <span className="material-symbols-outlined s">near_me</span>
              location
            </div>
          </div>
        )} */}
        <span className="material-symbols-outlined m illustration">
          {getIcon(weatherCodes.weatherCode[currentData.values.weatherCode])}
        </span>
        <div className="location-row">
          {currentLocation && (
            <span
              className="material-symbols-outlined"
              style={{ paddingRight: "0.3rem" }}
            >
              location_on
            </span>
          )}
          <div className="location-text">
            {locationWeather.google?.results[0].address_components[0]
              .short_name ?? "Location name not found"}
          </div>
        </div>
        <div className="location-row">
          <div className="location-text temperature">
            {currentData.values.temperature} °C
          </div>
        </div>
        <div className="location-row">
          <div className="location-text">
            {weatherCodes.weatherCode[currentData.values.weatherCode]}
          </div>
        </div>
        {!currentLocation && (
          <span
            className="material-symbols-outlined location-button"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteLocation(locationCoordinates);
            }}
          >
            delete
          </span>
        )}
      </div>
      {/* <div
        className="location-button"
        onClick={() => handleDeleteLocation(locationCoordinates)}
      > */}
      {/* Delete
      </div> */}
    </div>
  );
}
