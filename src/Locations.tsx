import { LocationsContext } from "./App";
import { LocationsContextType, WeatherData } from "../lib/types/Interfaces";
import Mapbox from "./Mapbox";
import { useState, useContext } from "react";
import Location from "./Location";
import { SortableItem } from "./SortableItem";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";

export default function Locations() {
  const [mapboxToggle, setMapboxToggle] = useState<boolean>(false);

  const context = useContext(LocationsContext) as LocationsContextType;
  const geolocation = context.geolocation;
  const locations = context.locations;
  const setLocations = context.setLocations;
  const message = context.message;

  const handleMapboxOpen = () => {
    setMapboxToggle(!mapboxToggle);
  };

  const [items, setItems] = useState<string[]>(
    locations ? Array.from(locations.keys()) : [""]
  );
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 50 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      if (locations) {
        setItems((items) => {
          const oldIndex = Array.from(locations?.keys()).indexOf(
            active.id.toString()
          );
          const newIndex = items.indexOf(over?.id.toString() || "");
          const newArray = arrayMove(items, oldIndex, newIndex);
          const newArrayMapped: [string, WeatherData][] = newArray.map(
            (location): [string, WeatherData] => [
              location,
              locations.get(location) as WeatherData,
            ]
          );
          localStorage.setItem("locations", JSON.stringify(newArray));
          newArrayMapped && setLocations(new Map(newArrayMapped));

          return newArray;
        });
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="locations">
          {geolocation && (
            <Location
              key={Array.from(geolocation.keys())[0]}
              locationCoordinates={Array.from(geolocation.keys())[0]}
              locationWeather={Array.from(geolocation.values())[0]}
              currentLocation={true}
              setItems={setItems}
            />
          )}
          {locations &&
            items.map((id) => (
              <SortableItem
                key={id}
                id={id}
                locationWeather={locations.get(id)}
                setItems={setItems}
                modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
              />
            ))}
          {!geolocation && !locations && (
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
      </SortableContext>
    </DndContext>
  );
}

// https://maps.googleapis.com/maps/api/geocode/json?latlng=52.3563,4.8096&result_type=locality&key=VITE_GOOGLE_API_KEY
