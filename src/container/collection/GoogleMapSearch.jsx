import React, { useState } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng
} from 'use-places-autocomplete';
import check from "../../images/icons/check.svg"
const libraries = ['places'];

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 40.73061,
  lng: -73.935242
};

export default function PlacesSearchMap({ onLocationSelected }) {
  const [desc,setDesc]=useState("")
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    debounce: 300
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (data) => {

     const description = data[0].description
     setDesc(description)
    setValue(data.description, false);
    clearSuggestions();

    try {
      getGeocode({ address: description }).then((results) => {
        const { lat, lng } = getLatLng(results[0]);
      
    
           onLocationSelected({ latitude:lat,longitude:lng})

    
        setMapCenter({ lat, lng });
        setMarker({ lat, lng });
      }).catch(err=>console.log(err))
  

      if (onLocationSelected) onLocationSelected(location);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  return (
 
      <div className="mb-4">
        <div>
          <label className='mx-4'>{desc}</label>
        </div>
        <input
            value={value || ""}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search a place"
          className="w-full  bg-transparent p-2 text-lg rounded-full border border-gray-300 rounded"
        />
        {status === 'OK' && (
          <ul className="border border-gray-200 mt-1 rounded shadow">
            {data.map(({ place_id, description }) => (

              <li
                key={place_id}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelect(data)}
              >
                {description}
              </li>
            ))}
          </ul>
        )}
      </div>
    
  );
}
