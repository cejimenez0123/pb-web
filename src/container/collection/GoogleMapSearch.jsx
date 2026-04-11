import React, { useEffect, useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng
} from "use-places-autocomplete";

// import { LoadScript } from "@react-google-maps/api";



function PlacesSearchMap({ initLocationName, onLocationSelected }) {

  const [desc, setDesc] = useState(initLocationName ?? "");

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    debounce: 300
  });
// console.log("INIT LOCATION NAME:", initLocationName)
 useEffect(() => {
    if (initLocationName) {
      setDesc(initLocationName);
      setValue(initLocationName, false); // false prevents triggering suggestions
    }
  }, [initLocationName, setValue]);

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (suggestion) => {

    const description = suggestion.description;

    setDesc(description);
    setValue(description, false);
    clearSuggestions();

    try {

      const results = await getGeocode({ address: description });

      const { lat, lng } = getLatLng(results[0]);

      if (onLocationSelected) {
        onLocationSelected({
          latitude: lat,
          longitude: lng,
          name: description,
          address: description
        });
      }

    } catch (err) {
      console.error("Geocode error:", err);
    }
  };

  return (

    <div className="mb-4">

      <label className="mx-4 text-sm text-gray-600">
        {desc}
      </label>

      <div className="relative w-full">

        <input
          value={value || ""}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search a place"
          className="input bg-base-bg w-[100%] border border-1 border-earth input-bordered "
        />



  {status === "OK" && (
  
  <div className="bg-base-bg border rounded-box shadow max-h-60 overflow-auto">
    {data.map((suggestion) => (
      <div
        key={suggestion.place_id}
        className="p-3 cursor-pointer text-soft hover:bg-sky-200"
        onClick={() => handleSelect(suggestion)}
      >
        {suggestion.description}
      </div>
    ))}
  </div>


        )}

      </div>

    </div>
  );
}

export default function GoogleMapSearch({ initLocationName, onLocationSelected }) {

  return (


      <PlacesSearchMap
        initLocationName={initLocationName}
        onLocationSelected={onLocationSelected}
      />


  );
}