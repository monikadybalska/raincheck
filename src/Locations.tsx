import { LocationsContext } from "./App";
import { LocationsContextType } from "./types/Interfaces";
import Mapbox from "./Mapbox";
import { useState, useContext } from "react";
import Location from "./Location";

export default function Locations() {
  const [mapboxToggle, setMapboxToggle] = useState<boolean>(false);

  const context = useContext(LocationsContext) as LocationsContextType;
  const locations = context.locations;
  const message = context.message;

  const handleMapboxOpen = () => {
    setMapboxToggle(!mapboxToggle);
  };

  return (
    <div className="locations">
      {locations ? (
        Array.from(locations).map(([locationCoordinates, locationWeather]) => (
          <Location
            key={locationCoordinates}
            locationCoordinates={locationCoordinates}
            locationWeather={locationWeather}
          />
        ))
      ) : (
        <div className="status">{message}</div>
      )}
      <div className="browse-locations" onClick={handleMapboxOpen}>
        <div className="browse-locations-text">Add location</div>
        <span className="material-symbols-outlined browse-locations-button">
          {mapboxToggle ? "remove" : "add"}
        </span>
      </div>
      {mapboxToggle && <Mapbox />}
    </div>
  );
}

// https://maps.googleapis.com/maps/api/geocode/json?latlng=52.3563,4.8096&result_type=locality&key=VITE_GOOGLE_API_KEY
