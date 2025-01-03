import React, { useState } from 'react';

const LocationAccess = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setLoading(false);
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError("Unable to retrieve location. Please allow location access.");
        setLoading(false);
      }
    );
  };

  return (
    <div>
      <button onClick={getLocation} disabled={loading}>
        {loading ? "Requesting..." : "Request Location"}
      </button>
      {location && (
        <p>
          Your location: Latitude: {location.latitude}, Longitude: {location.longitude}
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LocationAccess;