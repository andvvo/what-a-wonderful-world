import { supabase } from "./supabase";

export type PinColor = "red" | "blue" | "green" | "yellow" | "purple" | "orange";

export const PIN_COLORS: { value: PinColor; label: string; hex: string }[] = [
  { value: "red", label: "Red", hex: "#EF4444" },
  { value: "blue", label: "Blue", hex: "#3B82F6" },
  { value: "green", label: "Green", hex: "#22C55E" },
  { value: "yellow", label: "Yellow", hex: "#EAB308" },
  { value: "purple", label: "Purple", hex: "#A855F7" },
  { value: "orange", label: "Orange", hex: "#F97316" },
];

export type PinData = {
  id: string;
  latitude: number;
  longitude: number;
  description: string;
  imageUrl: string;
  createdAt: string;
  color: PinColor;
};

export async function fetchPins(): Promise<PinData[]> {
  const { data, error } = await supabase
    .from("pins")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pins:", error);
    return [];
  }

  return data.map((pin) => ({
    id: pin.id,
    latitude: pin.latitude,
    longitude: pin.longitude,
    description: pin.description,
    imageUrl: pin.image_url || "",
    createdAt: pin.created_at,
    color: pin.color || "red",
  }));
}

export async function deletePin(pinId: string): Promise<boolean> {
  const { error } = await supabase.from("pins").delete().eq("id", pinId);

  if (error) {
    console.error("Error deleting pin:", error);
    return false;
  }

  return true;
}

export async function createPin(pin: {
  latitude: number;
  longitude: number;
  description: string;
  imageUrl?: string;
  color?: PinColor;
}): Promise<PinData | null> {
  const { data, error } = await supabase
    .from("pins")
    .insert({
      latitude: pin.latitude,
      longitude: pin.longitude,
      description: pin.description,
      image_url: pin.imageUrl || null,
      color: pin.color || "red",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating pin:", error);
    return null;
  }

  return {
    id: data.id,
    latitude: data.latitude,
    longitude: data.longitude,
    description: data.description,
    imageUrl: data.image_url || "",
    createdAt: data.created_at,
    color: data.color || "red",
  };
}
