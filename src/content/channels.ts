import type { IconName } from "@/components/ui/Icon";
import type { ChannelType } from "@/lib/catalogue/types";

export const channels: { id: ChannelType; label: string; icon: IconName; description: string }[] = [
  { id: "supermarkets", label: "Supermarkets", icon: "supermarket", description: "Modern retail and organised trade" },
  { id: "wholesalers", label: "Wholesalers", icon: "wholesale", description: "Trade volumes for onward distribution" },
  { id: "retailers", label: "Retailers", icon: "retail", description: "Neighbourhood shops and stores" },
  { id: "open-markets", label: "Open markets", icon: "market", description: "Traders across Abuja's markets" },
  { id: "hotels", label: "Hotels", icon: "hotel", description: "Hospitality operations" },
  { id: "restaurants", label: "Restaurants", icon: "restaurant", description: "Kitchens and food service" },
  { id: "caterers", label: "Caterers", icon: "catering", description: "Events and contract catering" },
  { id: "institutional", label: "Institutional buyers", icon: "institution", description: "Organisations buying for their people" },
];

export const partnerTypes: { id: string; label: string; icon: IconName; description: string }[] = [
  {
    id: "manufacturer",
    label: "Manufacturers",
    icon: "factory",
    description: "Get your products into Abuja's modern trade, open market and HORECA channels.",
  },
  { id: "producer", label: "Producers", icon: "leaf", description: "Reach trade buyers who need dependable supply of what you produce." },
  {
    id: "brand-owner",
    label: "Brand owners",
    icon: "tag",
    description: "Build presence and demand for your brand with a partner on the ground.",
  },
  { id: "importer", label: "Importers", icon: "ship", description: "Move imported products from stock to shelves across the FCT." },
];
