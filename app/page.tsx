"use client";

import { useState, useCallback } from "react";
import Map, { Marker, type MapMouseEvent } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import Pin from "../components/pin";

type Pin = {
  latitude: number;
  longitude: number;
};

export default function HomePage() {
  const [pins, setPins] = useState<Pin[]>([]);

  const handleMapClick = useCallback((event: MapMouseEvent) => {
    const { lng, lat } = event.lngLat;
    setPins((curr) => [...curr, { longitude: lng, latitude: lat }]);
  }, []);

  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/standard"
      onClick={handleMapClick}
    >
      {pins.map((pin, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={pin.longitude}
          latitude={pin.latitude}
          anchor="bottom"
        >
          <Pin />
        </Marker>
      ))}
    </Map>
  );
}
