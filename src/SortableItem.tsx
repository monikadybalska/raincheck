import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Location from "./Location";
import { LocationsContext } from "./App";
import { LocationsContextType } from "./types/Interfaces";
import { useContext } from "react";

export function SortableItem(props: any) {
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
        items={props.items}
        setItems={props.setItems}
      />
    </div>
  );
}
