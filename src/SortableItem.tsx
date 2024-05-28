import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Location from "./Location";
import { LocationsContext } from "./App";
import { LocationsContextType, WeatherData } from "../lib/types/Interfaces";
import React, { useContext } from "react";
import { Modifier } from "@dnd-kit/core";

export function SortableItem(props: {
  id: string;
  locationWeather: WeatherData | undefined;
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
  modifiers: Modifier[];
}) {
  const context = useContext(LocationsContext) as LocationsContextType;
  const handleLocationClick = context.handleLocationClick;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => handleLocationClick(props.id)}
      {...attributes}
      {...listeners}
    >
      <Location
        key={props.id}
        locationCoordinates={props.id}
        locationWeather={props.locationWeather}
        currentLocation={false}
        setItems={props.setItems}
      />
    </div>
  );
}
