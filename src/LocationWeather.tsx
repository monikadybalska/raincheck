import "./index.css";
import { WeatherData } from "./App";
import { weatherCodes } from "./weatherCodes";
import HourlyWeather from "./HourlyWeather";
import DailyWeather from "./DailyWeather";
import Divider from "./Divider";

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
  return (
    <div
      className={`Weather ${
        weatherCodes.weatherCode[currentData.values.weatherCode]
      }`}
    >
      <span className="material-symbols-outlined xl">
        {getIcon(weatherCodes.weatherCode[currentData.values.weatherCode])}
      </span>
      <h3>
        {displayedWeather.google?.results[0].address_components[0].short_name ??
          "Location name not found"}
      </h3>
      <h2>{currentData.values.temperature} °C</h2>
      <h3>{weatherCodes.weatherCode[currentData.values.weatherCode]}</h3>
      <Divider />
      <HourlyWeather data={displayedWeather} />
      <Divider />
      <DailyWeather data={displayedWeather} />
    </div>
  );
}
