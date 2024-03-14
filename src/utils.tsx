import { WeatherData } from "./types/Interfaces";

export function getCurrentPosition(): Promise<GeolocationPosition> | null {
  if (!navigator.geolocation) {
    // setMessage(
    //   "This browser doesn't support geolocation. Please add a new location below."
    // );
    return null;
  } else {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
}

export const fetchGeolocationData = async () => {
  try {
    const position = await getCurrentPosition();
    if (!position) return null;
    const google = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
        position.coords.latitude
      },${position.coords.longitude}&result_type=locality&key=${
        import.meta.env.VITE_GOOGLE_API_KEY
      }`
    ).then((res) => res.json());
    const weather: WeatherData = await fetch(
      "http://localhost:3000/52.3675734,4.9041389"
    ).then((res) => res.json());
    // newLocations.set(
    //   `${position.coords.latitude},${position.coords.longitude}`,
    //   { ...weather, google }
    // );
    return new Map([
      [
        `${position.coords.latitude},${position.coords.longitude}`,
        { ...weather, google },
      ],
    ]);
  } catch (e: unknown) {
    return null;
  }
};

export const fetchLocalData = async (localStorageData: string[] | null) => {
  const newLocations = new Map();
  if (localStorageData) {
    const dataPromises = [];
    const namesPromises = [];
    for (let i = 0; i < localStorageData.length; i++) {
      dataPromises.push(
        fetch(`http://localhost:3000/${localStorageData[i]}`).then((res) =>
          res.json()
        )
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
