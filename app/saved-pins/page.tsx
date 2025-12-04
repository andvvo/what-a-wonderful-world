"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PinData,
  PinColor,
  PIN_COLORS,
  fetchPins,
  deletePin,
} from "@/lib/pins";

export default function SavedPinsPage() {
  const [pins, setPins] = useState<PinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [colorFilter, setColorFilter] = useState<Set<PinColor>>(new Set());

  const toggleColorFilter = (color: PinColor) => {
    setColorFilter((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(color)) {
        newSet.delete(color);
      } else {
        newSet.add(color);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setColorFilter(new Set());
  };

  useEffect(() => {
    async function loadPins() {
      const data = await fetchPins();
      setPins(data);
      setLoading(false);
    }
    loadPins();
  }, []);

  const filteredPins = useMemo(() => {
    if (colorFilter.size === 0) return pins;
    return pins.filter((pin) => colorFilter.has(pin.color));
  }, [pins, colorFilter]);

  const handleDeletePin = async (pinId: string) => {
    const success = await deletePin(pinId);
    if (success) {
      setPins((curr) => curr.filter((p) => p.id !== pinId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Saved Pins</h1>
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading pins...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end items-center mb-8">
          <Link
            href="/"
            className="px-4 py-2 z-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Map
          </Link>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Color{" "}
            {colorFilter.size > 0 && `(${colorFilter.size} selected)`}
          </label>
          <div className="flex gap-2 flex-wrap items-center">
            <button
              onClick={clearFilters}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                colorFilter.size === 0
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              All Colors
            </button>
            {PIN_COLORS.map((colorOption) => (
              <button
                key={colorOption.value}
                onClick={() => toggleColorFilter(colorOption.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  colorFilter.has(colorOption.value)
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: colorOption.hex }}
                />
                {colorOption.label}
              </button>
            ))}
          </div>
        </div>

        {filteredPins.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg mb-4">
              {colorFilter.size === 0
                ? "No saved pins yet"
                : `No pins found with selected colors`}
            </p>
            {colorFilter.size === 0 ? (
              <Link
                href="/"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                Go to the map to create your first pin
              </Link>
            ) : (
              <button
                onClick={clearFilters}
                className="text-blue-500 hover:text-blue-600 underline"
              >
                Clear filters to see all pins
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPins.map((pin) => (
              <div
                key={pin.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {pin.imageUrl ? (
                  <div className="relative w-full h-48">
                    <Image
                      src={pin.imageUrl}
                      alt="Pin image"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div
                      className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-white shadow-md"
                      style={{
                        backgroundColor:
                          PIN_COLORS.find((c) => c.value === pin.color)?.hex ||
                          "#EF4444",
                      }}
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <span className="text-6xl">📍</span>
                    <div
                      className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-white shadow-md"
                      style={{
                        backgroundColor:
                          PIN_COLORS.find((c) => c.value === pin.color)?.hex ||
                          "#EF4444",
                      }}
                    />
                  </div>
                )}
                <div className="p-4">
                  <p className="text-gray-800 mb-3 line-clamp-3">
                    {pin.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>
                      {pin.latitude.toFixed(4)}, {pin.longitude.toFixed(4)}
                    </span>
                  </div>
                  {pin.createdAt && (
                    <p className="text-xs text-gray-400 mb-3">
                      {new Date(pin.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                  <button
                    onClick={() => handleDeletePin(pin.id)}
                    className="w-full px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 transition-colors text-sm"
                  >
                    Delete Pin
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
