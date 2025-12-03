"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Map, {
  Marker,
  Popup,
  type MapMouseEvent,
  type MapRef,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import Pin from "@/components/pin";
import { PinData, fetchPins, createPin, deletePin } from "@/lib/pins";

const SearchBox = dynamic(
  () => import("@mapbox/search-js-react").then((mod) => mod.SearchBox),
  { ssr: false }
);

type NewPinLocation = {
  latitude: number;
  longitude: number;
};

export default function HomePage() {
  const mapRef = useRef<MapRef>(null);
  const [pins, setPins] = useState<PinData[]>([]);
  const [newPinLocation, setNewPinLocation] = useState<NewPinLocation | null>(
    null
  );
  const [selectedPin, setSelectedPin] = useState<PinData | null>(null);
  const [newDescription, setNewDescription] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    async function loadPins() {
      const data = await fetchPins();
      setPins(data);
    }
    loadPins();
  }, []);

  const handleMapClick = useCallback((event: MapMouseEvent) => {
    const { lng, lat } = event.lngLat;
    setSelectedPin(null);
    setNewPinLocation({ longitude: lng, latitude: lat });
    setNewDescription("");
    setNewImageUrl("");
  }, []);

  const handleCreatePin = useCallback(async () => {
    if (newPinLocation && newDescription.trim()) {
      const newPin = await createPin({
        latitude: newPinLocation.latitude,
        longitude: newPinLocation.longitude,
        description: newDescription.trim(),
        imageUrl: newImageUrl.trim() || undefined,
      });

      if (newPin) {
        setPins((curr) => [newPin, ...curr]);
      }
      setNewPinLocation(null);
      setNewDescription("");
      setNewImageUrl("");
    }
  }, [newPinLocation, newDescription, newImageUrl]);

  const handleCancelNewPin = useCallback(() => {
    setNewPinLocation(null);
    setNewDescription("");
    setNewImageUrl("");
  }, []);

  const handlePinClick = useCallback((pin: PinData) => {
    setNewPinLocation(null);
    setSelectedPin(pin);
  }, []);

  const handleDeletePin = useCallback(async (pinId: string) => {
    const success = await deletePin(pinId);
    if (success) {
      setPins((curr) => curr.filter((p) => p.id !== pinId));
      setSelectedPin(null);
    }
  }, []);

  const handleClosePopup = useCallback(() => {
    setSelectedPin(null);
  }, []);

  const handleSearchResult = useCallback((result: any) => {
    if (result?.features?.[0]?.geometry?.coordinates) {
      const [lng, lat] = result.features[0].geometry.coordinates;
      mapRef.current?.flyTo({
        center: [lng, lat],
        zoom: 17,
        duration: 3000,
      });
    }
  }, []);

  return (
    <div className="relative w-screen h-screen">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 w-96">
        <div className="bg-white/70 backdrop-blur-md rounded-full px-4 py-2 shadow-lg">
          <SearchBox
            accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!}
            onRetrieve={handleSearchResult}
            placeholder="Search for a location..."
            theme={{
              variables: {
                fontFamily: "inherit",
                unit: "16px",
                padding: "0.5em",
                borderRadius: "24px",
                boxShadow: "none",
                border: "none",
                colorBackground: "transparent",
                colorBackgroundHover: "transparent",
                colorBackgroundActive: "transparent",
              },
              cssText: `
                .Results {
                  background-color: rgba(255, 255, 255, 0.7) !important;
                  backdrop-filter: blur(12px);
                  -webkit-backdrop-filter: blur(12px);
                  border-radius: 12px;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }`,
            }}
          />
        </div>
      </div>
      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 14,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/standard"
        onClick={handleMapClick}
      >
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            longitude={pin.longitude}
            latitude={pin.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              handlePinClick(pin);
            }}
          >
            <Pin />
          </Marker>
        ))}

        {newPinLocation && (
          <Popup
            longitude={newPinLocation.longitude}
            latitude={newPinLocation.latitude}
            anchor="bottom"
            onClose={handleCancelNewPin}
            closeOnClick={false}
            className="min-w-[300px]"
          >
            <div className="p-2 min-w-[250px]">
              <h3 className="m-0 mb-3 text-base font-bold">Add New Pin</h3>
              <div className="mb-3">
                <label className="block mb-1 text-sm">Description *</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Enter a description..."
                  className="w-full p-2 rounded border border-gray-300 resize-y min-h-[60px] text-sm"
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1 text-sm">Image URL</label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-2 rounded border border-gray-300 text-sm"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleCancelNewPin}
                  className="px-4 py-2 rounded border border-gray-300 bg-white cursor-pointer text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePin}
                  disabled={!newDescription.trim()}
                  className={`px-4 py-2 rounded border-none text-white text-sm ${
                    newDescription.trim()
                      ? "bg-blue-500 cursor-pointer hover:bg-blue-600"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Add Pin
                </button>
              </div>
            </div>
          </Popup>
        )}

        {selectedPin && (
          <Popup
            longitude={selectedPin.longitude}
            latitude={selectedPin.latitude}
            anchor="bottom"
            onClose={handleClosePopup}
            closeOnClick={false}
            className="min-w-[300px]"
          >
            <div className="p-2 min-w-[250px] max-w-[300px]">
              {selectedPin.imageUrl && (
                <div className="relative w-full h-[150px] mb-3">
                  <Image
                    src={selectedPin.imageUrl}
                    alt="Pin"
                    fill
                    className="object-cover rounded"
                    unoptimized
                  />
                </div>
              )}
              <p className="m-0 mb-3 text-sm leading-relaxed">
                {selectedPin.description}
              </p>
              <button
                onClick={() => handleDeletePin(selectedPin.id)}
                className="w-full px-4 py-2 rounded border-none bg-red-500 text-white cursor-pointer text-sm hover:bg-red-600"
              >
                Delete Pin
              </button>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
