import { WeatherType } from "./App";
import Mapbox from "./Mapbox";
import { useEffect, useState, useContext, createContext } from "react";

type LocationsContextType = {
  ["locations"]: string[] | null;
  ["setLocations"]: React.Dispatch<React.SetStateAction<string[] | null>>;
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
  // const locationsArray = locationsString ? JSON.parse(locationsString) : null;
  const [locations, setLocations] = useState<string[] | null>(
    locationsString ? JSON.parse(locationsString) : null
  );

  const handleLocationClick = async (location: string) => {
    await fetch(`http://localhost:3000/${location}`)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      });
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

  function handleDeleteLocation(location: string) {
    if (locations !== null) {
      const index = locations.indexOf(location);
      const newLocations = locations.toSpliced(index, 1);
      setLocations(newLocations);
      localStorage.setItem("locations", JSON.stringify(newLocations));
    } else {
      console.log("Error");
    }
  }

  // useEffect(() => {
  //   // locationsArray ? fetchLocationNames() : setLocations(null);
  // }, []);

  return (
    <LocationsContext.Provider value={{ locations, setLocations }}>
      <div>
        {locations &&
          locations.map((location) => (
            <div className="location">
              <div
                className="location-name"
                onClick={() => handleLocationClick(location.toLowerCase())}
              >
                {location}
              </div>
              <span
                className="material-symbols-outlined location-button"
                onClick={() => handleDeleteLocation(location.toLowerCase())}
              >
                delete
              </span>
            </div>
          ))}
        <div className="new location" onClick={handleMapboxOpen}>
          <p>Add new location</p>
          <span className="material-symbols-outlined">
            {mapboxToggle ? "remove" : "add"}
          </span>
        </div>
        {mapboxToggle && <Mapbox />}
      </div>
    </LocationsContext.Provider>
  );
}

// https://maps.googleapis.com/maps/api/geocode/json?latlng=52.3563,4.8096&result_type=locality&key=VITE_GOOGLE_API_KEY
