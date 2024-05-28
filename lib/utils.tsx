import { GoogleGeocodingData, WeatherData } from "./types/Interfaces";

export function getCurrentPosition(): Promise<GeolocationPosition> | null {
  if (!navigator.geolocation) {
    return null;
  } else {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
}

export const fetchGeolocationData: () => Promise<Map<
  string,
  WeatherData
> | null> = async () => {
  try {
    const position = await getCurrentPosition();
    if (!position) return null;
    const googlePromise: Promise<GoogleGeocodingData> = fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
        position.coords.latitude
      },${position.coords.longitude}&result_type=locality&key=${
        import.meta.env.VITE_GOOGLE_API_KEY
      }`
    ).then((res) => res.json());
    const weatherPromise: Promise<WeatherData> = fetch(
      `https://api.tomorrow.io/v4/weather/forecast?location=${position.coords.latitude},${position.coords.longitude}&timesteps=1h&timesteps=1d&apikey=2Od20wd3nAGbpzeQ1DFblpd10rTR5ODi`
    ).then((res) => res.json());
    const [google, weather] = await Promise.all([
      googlePromise,
      weatherPromise,
    ]);
    return new Map([
      [
        `${position.coords.latitude},${position.coords.longitude}`,
        { google: google, ...weather },
      ],
    ]);
  } catch (e: unknown) {
    return null;
  }
};

export const fetchLocalData = async (localStorageData: string[] | null) => {
  const newLocations: Map<string, WeatherData> = new Map();
  if (localStorageData) {
    const dataPromises: Promise<WeatherData>[] = [];
    const namesPromises: Promise<GoogleGeocodingData>[] = [];
    for (let i = 0; i < localStorageData.length; i++) {
      dataPromises.push(
        fetch(
          `https://api.tomorrow.io/v4/weather/forecast?location=${
            localStorageData[i]
          }&timesteps=1h&timesteps=1d&apikey=${
            import.meta.env.VITE_TOMORROW_API_KEY
          }`
        ).then((res) => res.json())
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
      newLocations.set(localStorageData[i], {
        ...resolvedDataPromises[i],
        google: resolvedNamePromises[i],
      });
    }
    console.log(newLocations);
    return newLocations;
  }
  return null;
};

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
