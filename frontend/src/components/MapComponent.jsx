

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default Leaflet icon not showing up in Webpack builds
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ setCurrentPosition }) => {
  const map = useMapEvents({
    locationfound(e) {
      setCurrentPosition(e.latlng, e.heading); // Update current position state
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return null;
};

const MapComponent = ({ parcelLatitude, parcelLongitude, parcelDestination }) => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [heading, setHeading] = useState(0);

  const lat = !isNaN(parcelLatitude) ? parseFloat(parcelLatitude) : 51.505; 
  const lng = !isNaN(parcelLongitude) ? parseFloat(parcelLongitude) : -0.09;
  const center = [lat, lng];

  // Update current position and heading
  const updatePosition = (position, heading) => {
    setCurrentPosition(position);
    setHeading(heading);
  };

  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: '400px', width: '80%', margin: 'auto' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Marker for parcel location */}
      <Marker position={center}>
        <Popup>
          Parcel Location:<br />
          Latitude: {parcelLatitude}<br />
          Longitude: {parcelLongitude}<br />
          Destination: {parcelDestination}<br/>
          {currentPosition && (
            <>
              <hr />
              Current Location:<br />
              Latitude: {currentPosition.lat}<br />
              Longitude: {currentPosition.lng}<br/>
            </>
          )}
        </Popup>
      </Marker>

      {/* Marker for user's current location with rotation */}
      {currentPosition && (
        <Marker
          position={currentPosition}
          icon={L.divIcon({
            className: 'custom-icon',
            html: `<div style="transform: rotate(${heading}deg);"><img src="${icon}" /></div>`,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })}
        >
          <Popup>
            You are here:<br />
            Latitude: {currentPosition.lat}<br />
            Longitude: {currentPosition.lng}
          </Popup>
        </Marker>
      )}

      <LocationMarker setCurrentPosition={updatePosition} />
    </MapContainer>
  );
};

export default MapComponent;

