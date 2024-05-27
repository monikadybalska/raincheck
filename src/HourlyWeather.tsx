import { WeatherData, Hourly } from "./types/Interfaces";
import { getIcon } from "./LocationWeather";
import { weatherCodes } from "./weatherCodes";
import { useRef } from "react";
import "./index.css";

export default function HourlyWeather({ data }: { data: WeatherData }) {
  const ref = useRef<HTMLDivElement>(null);
  function handleScroll(offset: number) {
    if (ref.current) {
      ref.current.scrollLeft += offset;
    }
  }
  const currentHour = new Date(Date.now()).toISOString();
  const isCurrentHour = (element: Hourly) =>
    element.time.slice(0, 13) === currentHour.slice(0, 13);
  const currentHourIndex = data.timelines.hourly.findIndex(isCurrentHour);
  const hourlyData = data.timelines.hourly.slice(
    currentHourIndex + 2,
    currentHourIndex + 2 + 24
  );
  return (
    <div className="HourlyWeather">
      <div
        className="material-symbols-outlined arrow-back"
        onClick={() => handleScroll(-80)}
        style={{ cursor: "pointer" }}
      >
        arrow_back_ios
      </div>
      <div className="HourlyWeatherWrapper" ref={ref}>
        {hourlyData.map((timestamp) => (
          <div className="HourlyWeatherElement">
            <p>{timestamp.time.slice(11, 16)}</p>
            <span className="material-symbols-outlined">
              {getIcon(weatherCodes.weatherCode[timestamp.values.weatherCode])}
            </span>
            <p className="primary">{timestamp.values.temperature}°</p>
          </div>
        ))}
      </div>
      <div
        className="material-symbols-outlined arrow-forward"
        onClick={() => handleScroll(80)}
        style={{ cursor: "pointer" }}
      >
        arrow_forward_ios
      </div>
    </div>
  );
}

// export default function HourlyWeather({data} : {data: WeatherData}) {
//     const hourlyData = data.list.filter((timestamp) => data.list[0].dt_txt.split(" ")[0] === timestamp.dt_txt.split(" ")[0])

//     return <div className="HourlyWeather">
//         {hourlyData.map((timestamp) => <div className="HourlyWeatherElement">
//             <p>{timestamp.dt_txt.split(" ")[1].slice(0, -3)}</p>
//             <span className="material-symbols-outlined">{getIcon(timestamp.weather[0].main)}</span>
//             <p>{timestamp.main.temp} °C</p>
//             </div>)}
//     </div>
// }
