import React, {
  useEffect,
  useState,
  useCallback,
  FormEvent,
  useContext,
} from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { LocationsContext } from "./Locations";

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

// This is a custom built autocomplete component using the "Autocomplete Service" for predictions
// and the "Places Service" for place details
export const AutocompleteCustom = ({ onPlaceSelect }: Props) => {
  const map = useMap();
  const places = useMapsLibrary("places");

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompleteSessionToken
  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken>();

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);

  // https://developers.google.com/maps/documentation/javascript/reference/places-service
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);

  const [predictionResults, setPredictionResults] = useState<
    Array<google.maps.places.AutocompletePrediction>
  >([]);

  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (!places || !map) return;

    setAutocompleteService(new places.AutocompleteService());
    setPlacesService(new places.PlacesService(map));
    setSessionToken(new places.AutocompleteSessionToken());

    return () => setAutocompleteService(null);
  }, [map, places]);

  const fetchPredictions = useCallback(
    async (inputValue: string) => {
      if (!autocompleteService || !inputValue) {
        setPredictionResults([]);
        return;
      }

      const request = { input: inputValue, sessionToken };
      const response = await autocompleteService.getPlacePredictions(request);

      setPredictionResults(response.predictions);
    },
    [autocompleteService, sessionToken]
  );

  const onInputChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      const value = (event.target as HTMLInputElement)?.value;

      setInputValue(value);
      fetchPredictions(value);
    },
    [fetchPredictions]
  );

  const handleSuggestionClick = useCallback(
    (placeId: string) => {
      if (!places) return;

      const detailRequestOptions = {
        placeId,
        fields: ["geometry", "name", "formatted_address"],
        sessionToken,
      };

      const detailsRequestCallback = (
        placeDetails: google.maps.places.PlaceResult | null
      ) => {
        onPlaceSelect(placeDetails);
        setPredictionResults([]);
        setInputValue(placeDetails?.formatted_address ?? "");
        setSessionToken(new places.AutocompleteSessionToken());
      };

      placesService?.getDetails(detailRequestOptions, detailsRequestCallback);
    },
    [onPlaceSelect, places, placesService, sessionToken]
  );

  const locations = useContext(LocationsContext)?.locations;
  const setLocations = useContext(LocationsContext)?.setLocations;
  const setSelectedLocation = useContext(LocationsContext)?.setSelectedLocation;
  const handleLocationClick = useContext(LocationsContext)?.handleLocationClick;

  const handleLocationAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (setLocations) {
      console.log("here");
      if (locations) {
        if (!locations.includes(inputValue.toLowerCase())) {
          const newLocations = locations.slice();
          newLocations.push(inputValue.toLowerCase());
          setLocations(newLocations);
          localStorage.setItem("locations", JSON.stringify(newLocations));
        }
      } else {
        setLocations([`${inputValue.toLowerCase()}`]);
        localStorage.setItem(
          "locations",
          JSON.stringify([`${inputValue.toLowerCase()}`])
        );
      }
      if (handleLocationClick) {
        handleLocationClick(inputValue.toLowerCase());
      }
    }
  };

  return (
    <div className="map-search">
      <div className="autocomplete-container">
        <input
          value={inputValue}
          onInput={(event: FormEvent<HTMLInputElement>) => onInputChange(event)}
          placeholder="Search for a place"
          className="map-search-input text"
        />
        <div className="predictions">
          {predictionResults.length > 0 && (
            <ul className="custom-list">
              {predictionResults.map(({ place_id, description }) => {
                return (
                  <li
                    key={place_id}
                    className="custom-list-item"
                    onClick={() => handleSuggestionClick(place_id)}
                  >
                    <span className="material-symbols-outlined s">
                      location_on
                    </span>
                    {description}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <button onClick={handleLocationAdd} className="map-search-input button">
        Add to locations
      </button>
    </div>
  );
};
