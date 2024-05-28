import { WeatherData } from "../lib/types/Interfaces";
import { getIcon } from "../lib/utils";
import { weatherCodes } from "../lib/types/weatherCodes";
import "./index.css";

export default function DailyWeather({ data }: { data: WeatherData }) {
  const currentDate = new Date(Date.now()).toISOString();
  const dailyData = data.timelines.daily.filter(
    (day) => day.time.slice(0, 11) >= currentDate.slice(0, 11)
  );
  return (
    <div className="DailyWeather">
      {dailyData.map((day) => (
        <div className="DailyWeatherElement">
          <p className="primary">
            {day.time.slice(0, 11) === currentDate.slice(0, 11)
              ? "Today"
              : new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
                  new Date(day.time)
                )}
          </p>
          <div className="DailyWeatherElementTemperature">
            <span className="material-symbols-outlined">
              {getIcon(weatherCodes.weatherCode[day.values.weatherCodeMax])}
            </span>
            <p className="primary">{Math.round(day.values.temperatureMax)}°</p>
            <p className="primary">{Math.round(day.values.temperatureMin)}°</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// export default function DailyWeather({data} : {data: WeatherType}) {
//     const dailyData = data.list.filter((timestamp) => timestamp.dt_txt.split(" ")[0] !== data.list[0].dt_txt.split(" ")[0])
//     const getUniqueDates = function(){
//         const uniqueDates: string[] = []
//         for(let i = 0; i < dailyData.length; i++) {
//             let date = new Date(dailyData[i].dt * 1000).toISOString().slice(0, 10)
//             // let day = new Intl.DateTimeFormat("en-US", {weekday: "long"}).format(date)
//             if (!uniqueDates.includes(date)) uniqueDates.push(date)
//         }
//         const uniqueDatesData = uniqueDates.map((date) => {
//             return dailyData.filter((day) => day.dt_txt.split(" ")[0] === date)
//         })
//         return uniqueDatesData
//     }
//     const dataPerDay = getUniqueDates()
//     console.log(dataPerDay[0][0])
//     // const temps = dataPerDay.map((el): number[] => el.main.temp).map((el) => Math.max(...el))
//     return <div className="DailyWeather">
//         {dataPerDay.map((day) => <div className="DailyWeatherElement">
//             <p>{new Intl.DateTimeFormat("en-US", {weekday: "long"}).format(new Date(day[0].dt * 1000))}</p>
//             {/* <p>{day.dt}</p> */}
//             {/* <span className="material-symbols-outlined">{getIcon(day.weather[0].main)}</span> */}
//             </div>)}
//     </div>
// }
