export interface Hourly {
  time: string;
  values: {
    cloudBase: number;
    cloudCeiling: number;
    cloudCover: number;
    dewPoint: number;
    evapotranspiration: number;
    freezingRainIntensity: number;
    humidity: number;
    iceAccumulation: number;
    iceAccumulationLwe: number;
    precipitationProbability: number;
    pressureSurfaceLevel: number;
    rainAccumulation: number;
    rainAccumulationLwe: number;
    rainIntensity: number;
    sleetAccumulation: number;
    sleetAccumulationLwe: number;
    sleetIntensity: number;
    snowAccumulation: number;
    snowAccumulationLwe: number;
    snowIntensity: number;
    temperature: number;
    temperatureApparent: number;
    uvHealthConcern: number;
    uvIndex: number;
    visibility: number;
    weatherCode: number;
    windDirection: number;
    windGust: number;
    windSpeed: number;
  };
}
export interface Daily {
  time: string;
  values: {
    cloudBaseAvg: number;
    cloudBaseMax: number;
    cloudBaseMin: number;
    cloudCeilingAvg: number;
    cloudCeilingMax: number;
    cloudCeilingMin: number;
    cloudCoverAvg: number;
    cloudCoverMax: number;
    cloudCoverMin: number;
    dewPointAvg: number;
    dewPointMax: number;
    dewPointMin: number;
    evapotranspirationAvg: number;
    evapotranspirationMax: number;
    evapotranspirationMin: number;
    evapotranspirationSum: number;
    freezingRainIntensityAvg: number;
    freezingRainIntensityMax: number;
    freezingRainIntensityMin: number;
    humidityAvg: number;
    humidityMax: number;
    humidityMin: number;
    iceAccumulationAvg: number;
    iceAccumulationLweAvg: number;
    iceAccumulationLweMax: number;
    iceAccumulationLweMin: number;
    iceAccumulationLweSum: number;
    iceAccumulationMax: number;
    iceAccumulationMin: number;
    iceAccumulationSum: number;
    moonriseTime: null;
    moonsetTime: null;
    precipitationProbabilityAvg: number;
    precipitationProbabilityMax: number;
    precipitationProbabilityMin: number;
    pressureSurfaceLevelAvg: number;
    pressureSurfaceLevelMax: number;
    pressureSurfaceLevelMin: number;
    rainAccumulationAvg: number;
    rainAccumulationLweAvg: number;
    rainAccumulationLweMax: number;
    rainAccumulationLweMin: number;
    rainAccumulationMax: number;
    rainAccumulationMin: number;
    rainAccumulationSum: number;
    rainIntensityAvg: number;
    rainIntensityMax: number;
    rainIntensityMin: number;
    sleetAccumulationAvg: number;
    sleetAccumulationLweAvg: number;
    sleetAccumulationLweMax: number;
    sleetAccumulationLweMin: number;
    sleetAccumulationLweSum: number;
    sleetAccumulationMax: number;
    sleetAccumulationMin: number;
    sleetIntensityAvg: number;
    sleetIntensityMax: number;
    sleetIntensityMin: number;
    snowAccumulationAvg: number;
    snowAccumulationLweAvg: number;
    snowAccumulationLweMax: number;
    snowAccumulationLweMin: number;
    snowAccumulationLweSum: number;
    snowAccumulationMax: number;
    snowAccumulationMin: number;
    snowAccumulationSum: number;
    snowIntensityAvg: number;
    snowIntensityMax: number;
    snowIntensityMin: number;
    sunriseTime: string;
    sunsetTime: string;
    temperatureApparentAvg: number;
    temperatureApparentMax: number;
    temperatureApparentMin: number;
    temperatureAvg: number;
    temperatureMax: number;
    temperatureMin: number;
    uvHealthConcernAvg: number;
    uvHealthConcernMax: number;
    uvHealthConcernMin: number;
    uvIndexAvg: number;
    uvIndexMax: number;
    uvIndexMin: number;
    visibilityAvg: number;
    visibilityMax: number;
    visibilityMin: number;
    weatherCodeMax: number;
    weatherCodeMin: number;
    windDirectionAvg: number;
    windGustAvg: number;
    windGustMax: number;
    windGustMin: number;
    windSpeedAvg: number;
    windSpeedMax: number;
    windSpeedMin: number;
  };
}
export interface WeatherData {
  timelines: {
    hourly: Hourly[];
    daily: Daily[];
  };
  location: {
    lat: number;
    lon: number;
  };
  google?: GoogleGeocodingData;
}
export interface GoogleGeocodingData {
  plus_code: {
    compound_code: string;
    global_code: string;
  };
  results: {
    address_components: {
      long_name: string;
      short_name: string;
      types: string[];
    }[];
    formatted_address: string;
    geometry: {
      bounds: {
        northeast: {
          lat: string;
          lng: string;
        };
        southwest: {
          lat: string;
          lng: string;
        };
      };
      location: {
        lat: string;
        lng: string;
      };
      location_type: string;
      viewport: {
        northeast: {
          lat: string;
          lng: string;
        };
        southwest: {
          lat: string;
          lng: string;
        };
      };
    };
    place_id: string;
    types: string[];
  }[];
  status: string;
}
export interface LocationsContextType {
  ["localStorageData"]: string[] | null;
  ["locations"]: Map<string, WeatherData> | null;
  ["setLocations"]: React.Dispatch<
    React.SetStateAction<Map<string, WeatherData> | null>
  >;
  ["selectedLocation"]: string | null;
  ["setSelectedLocation"]: React.Dispatch<React.SetStateAction<string | null>>;
  ["handleLocationClick"]: (location: string) => void;
  ["displayedWeather"]: WeatherData | null;
  ["setDisplayedWeather"]: React.Dispatch<
    React.SetStateAction<WeatherData | null>
  >;
}
