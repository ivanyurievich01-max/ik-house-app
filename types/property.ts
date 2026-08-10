export type Shore = "north" | "south";

export type PropertyType =
  | "cottage"
  | "guesthouse"
  | "resort"
  | "villa"
  | "apartment"
  | "house"
  | "room";

export type Amenity =
  | "wifi"
  | "parking"
  | "kitchen"
  | "ac"
  | "bbq"
  | "pool"
  | "beach"
  | "breakfast"
  | "tv"
  | "washer"
  | "terrace"
  | "shower"
  | "bath"
  | "balcony"
  | "playground"
  | "lake_view"
  | "mountain_view";

export interface Owner {
  name: string;
  role: string;
  phone: string; // формат +996...
  whatsapp: string; // цифры без + для wa.me
  avatar: string;
  responseTime?: string;
}

export interface Review {
  id: string;
  name: string;
  city: string;
  rating: number;
  date: string;
  text: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  type: PropertyType;
  location: string; // населённый пункт
  shore: Shore;
  address: string;
  distanceToBeach: number; // метры
  rating: number;
  reviewsCount: number;
  pricePerNight: number; // сом
  oldPrice?: number;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  description: string;
  amenities: Amenity[];
  images: string[];
  featured: boolean;
  popular: boolean;
  available: boolean;
  blockedDates?: string[]; // ISO yyyy-mm-dd
  owner: Owner;
  coordinates: { lat: number; lng: number };
  reviews?: Review[];
}

export interface BookingPayload {
  propertyId: string;
  propertyName: string;
  name: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  totalPrice: number;
  comment?: string;
}
