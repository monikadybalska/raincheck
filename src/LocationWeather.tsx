import "./index.css";
import { LocationsContextType, WeatherData } from "../lib/types/Interfaces";
import { weatherCodes } from "../lib/types/weatherCodes";
import HourlyWeather from "./HourlyWeather";
import DailyWeather from "./DailyWeather";
import Divider from "./Divider";
import { LocationsContext } from "./App";
import { useContext } from "react";
import { getIcon } from "../lib/utils";

export default function LocationWeather({
  displayedWeather,
}: {
  displayedWeather: WeatherData;
}) {
  const currentDate = new Date(Date.now()).toISOString();
  const currentData = displayedWeather.timelines.hourly.filter(
    (timestamp) => timestamp.time.slice(0, 13) === currentDate.slice(0, 13)
  )[0];
  const context = useContext(LocationsContext) as LocationsContextType;
  const geolocation = context.geolocation;
  const currentLocation = geolocation
    ? Array.from(geolocation.values())[0] === displayedWeather
    : false;
  return (
    <div
      className={`Weather ${
        weatherCodes.weatherCode[currentData.values.weatherCode]
      }`}
    >
      <div className="weather-overview">
        <div className="location-row">
          {currentLocation && (
            <span
              className="material-symbols-outlined"
              style={{ paddingRight: "0.3rem" }}
            >
              location_on
            </span>
          )}
          <div className="location-text s">
            {displayedWeather.google?.results[0].address_components[0]
              .short_name ?? "Location name not found"}
          </div>
        </div>
        <div className="location-row">
          <h2>{currentData.values.temperature} °C</h2>
        </div>
        <span className="material-symbols-outlined illustration main">
          {getIcon(weatherCodes.weatherCode[currentData.values.weatherCode])}
        </span>
        <div className="location-row">
          <div className="location-text s">
            {weatherCodes.weatherCode[currentData.values.weatherCode]}
          </div>
        </div>
      </div>
      <Divider />
      <HourlyWeather data={displayedWeather} />
      <Divider />
      <DailyWeather data={displayedWeather} />
    </div>
  );
}
