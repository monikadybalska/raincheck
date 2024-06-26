import { useState } from "react";
import { APIProvider, ControlPosition, Map } from "@vis.gl/react-google-maps";

import { CustomMapControl } from "./MapControl";
import MapHandler from "./MapHandler";

export type AutocompleteMode = { id: string; label: string };

export default function Mapbox() {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
      <Map
        defaultZoom={3}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        style={{ height: "100vh" }}
      />

      <CustomMapControl
        controlPosition={ControlPosition.LEFT}
        onPlaceSelect={setSelectedPlace}
      />

      <MapHandler place={selectedPlace} />
    </APIProvider>
  );
}
