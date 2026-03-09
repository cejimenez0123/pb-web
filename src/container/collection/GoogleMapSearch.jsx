import React, { useEffect, useState } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
  getDetails
} from 'use-places-autocomplete';
import check from "../../images/icons/check.svg"

import { LoadScript } from "@react-google-maps/api";
import { get } from 'lodash';


const libraries = ['places'];

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 40.73061,
  lng: -73.935242
};
 function PlacesSearchMap({initLocationName,onLocationSelected }) {
  const [desc,setDesc]=useState(initLocationName??"")
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
  useEffect(()=>{
    setDesc(initLocationName);
  },[initLocationName])
  const handleSelect = async (data) => {

     const description = data[0].description
     setDesc(description)
    setValue(data.description, false);
    clearSuggestions();

    try {
      getGeocode({ address: description }).then(async(results) => {
        
        const { lat, lng } = getLatLng(results[0]);
      
        const details = await getDetails({ placeId: results[0].place_id })
       
        
           onLocationSelected({ latitude:lat,longitude:lng,name:details["name"],address:details["formatted_address"]})

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
        <div className="relative w-full">
  <input
    value={value || ""}
    onChange={handleInput}
    disabled={!ready}
    placeholder="Search a place"
    className="w-[100%] bg-transparent p-2 text-lg rounded-full border border-gray-300"
  />

  {status === 'OK' && (
    <ul className="absolute z-20 bg-white w-full border border-gray-200 mt-1 rounded shadow max-h-60 overflow-auto">
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
</div>
    
  );
}


export default function GoogleMapSearch({ initLocationName,onLocationSelected }) {
  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <PlacesSearchMap initLocationName={initLocationName} onLocationSelected={onLocationSelected} />
    </LoadScript>
  );
}