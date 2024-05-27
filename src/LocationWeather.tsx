import "./index.css";
import { LocationsContextType, WeatherData } from "./types/Interfaces";
import { weatherCodes } from "./weatherCodes";
import HourlyWeather from "./HourlyWeather";
import DailyWeather from "./DailyWeather";
import Divider from "./Divider";
import { LocationsContext } from "./App";
import { useContext } from "react";

export function getIcon(weatherMain: string) {
  let icon: string = "";
  switch (weatherMain) {
    case "Cloudy":
    case "Mostly Cloudy":
    case "Partly Cloudy":
      icon = "cloud";
      break;
    case "Clear":
    case "Clear, Sunny":
    case "Mostly Clear":
      icon = "sunny";
      break;
    case "Rain":
    case "Drizzle":
    case "Light Rain":
    case "Heavy Rain":
    case "Freezing Rain":
    case "Heavy Freezing Rain":
    case "Light Freezing Drizzle":
    case "Light Freezing Rain":
    case "Freezing Drizzle":
      icon = "rainy";
      break;
    case "Thunderstorm":
      icon = "thunderstorm";
      break;
    case "Tornado":
      icon = "tornado";
      break;
    case "Snow":
    case "Flurries":
    case "Light Snow":
    case "Heavy Snow":
    case "Ice Pellets":
    case "Light Ice Pellets":
    case "Heavy Ice Pellets":
      icon = "snowing";
      break;
    case "Mist":
    case "Fog":
    case "Light Fog":
      icon = "mist";
      break;
    default:
      icon = "thermostat";
  }
  return icon;
}

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
      {/* {currentLocation && (
        <div
          className="location-row"
          style={{ paddingBottom: 0, paddingLeft: 0 }}
        >
          <div className="label">
            <span className="material-symbols-outlined s">near_me</span>Your
            location
          </div>
        </div>
      )} */}
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
