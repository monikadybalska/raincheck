import React, {
  useEffect,
  useState,
  useCallback,
  FormEvent,
  useContext,
} from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { LocationsContext } from "./App";
import { WeatherData, LocationsContextType } from "./types/Interfaces";

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

export const AutocompleteCustom = ({ onPlaceSelect }: Props) => {
  const map = useMap();
  const places = useMapsLibrary("places");

  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken>();

  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);

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

  const context = useContext(LocationsContext) as LocationsContextType;
  const localStorageData = context.localStorageData;
  const locations = context.locations;
  const setLocations = context.setLocations;
  const setDisplayedWeather = context.setDisplayedWeather;

  const handleLocationAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const google = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${inputValue}&result_type=locality&key=${
        import.meta.env.VITE_GOOGLE_API_KEY
      }`
    ).then((res) => res.json());
    await fetch(`http://localhost:3000/${inputValue}`)
      .then((res) => res.json())
      .then((result: WeatherData) => {
        const newLocations = new Map(locations);
        newLocations.set(inputValue, { ...result, google });
        setLocations(newLocations);
        setDisplayedWeather({ ...result, google });
      });
    if (localStorageData) {
      if (!localStorageData?.includes(inputValue)) {
        localStorageData.push(inputValue);
        localStorage.setItem("locations", JSON.stringify(localStorageData));
      }
    } else {
      localStorage.setItem("locations", JSON.stringify([`${inputValue}`]));
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
