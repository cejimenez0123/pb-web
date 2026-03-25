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

  useEffect(() => {
    if (initLocationName) {
      setDesc(initLocationName);
      setValue(initLocationName, false);
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
console.log("CITY<",description)
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
          className="input input-bordered w-full"
        />

        {/* {status === "OK" && ( */}
{/* <div className="dropdown w-full">
  <input
    tabIndex={0}
    className="input input-bordered w-full"
    value={value || ""}
    onChange={handleInput}
    placeholder="Search a place"
  /> */}

  {status === "OK" && (
  
  <div className="bg-white border rounded-box shadow max-h-60 overflow-auto">
    {data.map((suggestion) => (
      <div
        key={suggestion.place_id}
        className="p-3 cursor-pointer hover:bg-base-200"
        onClick={() => handleSelect(suggestion)}
      >
        {suggestion.description}
      </div>
    ))}
  </div>

    // <ul
    //   tabIndex={0}
    //   className="dropdown-content  menu p-2 shadow bg-white rounded-box w-full max-h-60 overflow-auto"
    // >
    //   {data.map((suggestion) => (
    //     <li key={suggestion.place_id}>
    //       <button
    //         onClick={() => handleSelect(suggestion)}
    //         className="text-left"
    //       >
    //         {suggestion.description}
    //       </button>
    //     </li>
    //   ))}
    // </ul>
  // 
// </div>
          // <ul className="absolute z-20 bg-white w-full border border-gray-200 mt-1 rounded-box shadow max-h-60 overflow-auto">

          //   {data.map((suggestion) => (

          //     <li
          //       key={suggestion.place_id}
          //       className="p-3 cursor-pointer hover:bg-base-200"
          //       onClick={() => handleSelect(suggestion)}
          //     >
          //       {suggestion.description}
          //     </li>

          //   ))}

          // </ul>

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