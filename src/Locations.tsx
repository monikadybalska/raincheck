import { WeatherType } from "./App";
import Mapbox from "./Mapbox";
import { useEffect, useState, useContext, createContext } from "react";
import { weatherCodes } from "./weatherCodes";

type LocationsContextType = {
  ["locations"]: { [key: string]: WeatherType } | null;
  ["setLocations"]: React.Dispatch<
    React.SetStateAction<{ [key: string]: WeatherType } | null>
  >;
  ["setSelectedLocation"]: React.Dispatch<React.SetStateAction<string | null>>;
  ["handleLocationClick"]: (location: string) => Promise<void>;
};

export const LocationsContext = createContext<LocationsContextType | null>(
  null
);

export default function Locations({
  data,
  setData,
}: {
  data: WeatherType | null;
  setData: React.Dispatch<React.SetStateAction<WeatherType | null>>;
}) {
  const [mapboxToggle, setMapboxToggle] = useState<boolean>(false);
  const locationsString = localStorage.getItem("locations");
  const locationsArray: string[] | null = locationsString
    ? JSON.parse(locationsString)
    : null;
  const [locations, setLocations] = useState<{
    [key: string]: WeatherType;
  } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const fetchLocationsData = async () => {
    if (locationsArray) {
      const locationData: { [key: string]: WeatherType } = {};
      for (let i = 0; i < locationsArray.length; i++) {
        await fetch(`http://localhost:3000/${locationsArray[i]}`)
          .then((res) => res.json())
          .then((result) => {
            locationData[locationsArray[i]] = result;
          });
      }
      console.log(locationData);
      setLocations(locationData);
    } else setLocations(null);
  };

  useEffect(() => {
    fetchLocationsData();
  }, []);

  const handleLocationClick = async (location: string) => {
    await fetch(`http://localhost:3000/${location}`)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      });
    setSelectedLocation(location);
  };

  const handleMapboxOpen = () => {
    setMapboxToggle(!mapboxToggle);
  };

  // async function fetchLocationNames() {
  //   for (let i = 0; i < locationsArray.length; i++) {
  //     await fetch(`http://localhost:3000/${locationsArray[i]}`)
  //       .then((res: Response) => res.json())
  //       .then((result: any) => {
  //         locationNames.push(
  //           result.google.results[0].address_components[0].short_name
  //         );
  //       });
  //   }
  //   setLocations(locationNames);
  // }

  // function addLocation(location: string) {
  //   if (locations && !locations.includes(location)) {
  //     const newLocations = locations.slice();
  //     newLocations.push(location);
  //     setLocations(newLocations);
  //   }
  //   locationsString
  //     ? localStorage.setItem("locations", JSON.stringify(locations))
  //     : localStorage.setItem("locations", `["${location}"]`);
  // }

  const handleDeleteLocation = (location: string) => {
    if (locations !== null && locationsArray !== null) {
      if (Object.keys(locations).length > 1) {
        const index = locationsArray.indexOf(location);
        const newLocationsArray = locationsArray.toSpliced(index, 1);
        const newLocations = { ...locations };
        delete newLocations.location;
        setLocations(newLocations);
        localStorage.setItem("locations", JSON.stringify(newLocationsArray));
      } else {
        localStorage.removeItem("locations");
        setLocations(null);
      }
      if (selectedLocation === location) {
        setData(null);
      }
    } else {
      console.log("Error");
    }
  };

  return (
    <LocationsContext.Provider
      value={{
        locations,
        setLocations,
        setSelectedLocation,
        handleLocationClick,
      }}
    >
      <div className="locations">
        {locations &&
          Object.keys(locations).map((location) => (
            <div
              key={location}
              className={
                selectedLocation === location ? "location selected" : "location"
              }
            >
              <div
                className="location-content"
                onClick={() => handleLocationClick(location.toLowerCase())}
              >
                <div className="location-row">
                  <div className="location-text">{location}</div>
                </div>
                <div className="location-row">
                  <div className="location-text temperature">
                    {locations[location].timelines.hourly[0].values.temperature}{" "}
                    °C
                  </div>
                </div>
                <div className="location-row">
                  <div className="location-text">
                    {
                      weatherCodes.weatherCode[
                        locations[location].timelines.hourly[0].values
                          .weatherCode
                      ]
                    }
                  </div>
                </div>
              </div>
              <div
                className="location-button"
                onClick={() => handleDeleteLocation(location.toLowerCase())}
              >
                <span className="material-symbols-outlined ">delete</span>
                Delete
              </div>
            </div>
          ))}
      </div>
      <div className="browse-locations" onClick={handleMapboxOpen}>
        <div className="browse-locations-text">Browse more locations</div>
        <span className="material-symbols-outlined browse-locations-button">
          {mapboxToggle ? "remove" : "add"}
        </span>
      </div>
      {mapboxToggle && <Mapbox />}
    </LocationsContext.Provider>
  );
}

// https://maps.googleapis.com/maps/api/geocode/json?latlng=52.3563,4.8096&result_type=locality&key=VITE_GOOGLE_API_KEY
