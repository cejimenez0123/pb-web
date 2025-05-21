import React, { useState } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker
} from '@react-google-maps/api';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng
} from 'use-places-autocomplete';

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
  const [marker, setMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState(center);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    debounce: 300
  });
console.log(data)
  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (data) => {
    let description = data.description
    setValue(data.description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description,placeId:data.placeId });
      const { lat, lng } = await getLatLng(results[0]);
      const locale = {lat,lng}
      console.log(JSON.stringify(locale))
      const location = { lat, lng, address: description };
console.log("GLGL",JSON.stringify(results))
console.log("GLGD",JSON.stringify({ lat, lng }))
      setMapCenter({ lat, lng });
      setMarker({ lat, lng });

      if (onLocationSelected) onLocationSelected(location);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  return (
 
      <div className="mb-4">
        <input
            value={value || ""}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search a place"
          className="w-full  bg-transparent p-2 text-lg border border-gray-300 rounded"
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
