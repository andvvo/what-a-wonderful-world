import { supabase } from "./supabase";

export type PinData = {
  id: string;
  latitude: number;
  longitude: number;
  description: string;
  imageUrl: string;
  createdAt: string;
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
}): Promise<PinData | null> {
  const { data, error } = await supabase
    .from("pins")
    .insert({
      latitude: pin.latitude,
      longitude: pin.longitude,
      description: pin.description,
      image_url: pin.imageUrl || null,
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
  };
}
