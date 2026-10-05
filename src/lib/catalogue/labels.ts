import type { Availability, ChannelType } from "./types";

export const channelLabels: Record<ChannelType, string> = {
  supermarkets: "Supermarkets",
  wholesalers: "Wholesalers",
  retailers: "Retailers",
  "open-markets": "Open markets",
  hotels: "Hotels",
  restaurants: "Restaurants",
  caterers: "Caterers",
  institutional: "Institutional buyers",
};

export const availabilityLabels: Record<Availability, string> = {
  available: "Available",
  limited: "Limited availability",
  "on-request": "Available on request",
  "coming-soon": "Coming soon",
  unconfirmed: "Availability to be confirmed",
};
