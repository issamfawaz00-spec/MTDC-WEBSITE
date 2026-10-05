import type { IconName } from "@/components/ui/Icon";

export interface Service {
  id: string;
  title: string;
  icon: IconName;
  summary: string;
  detail: string;
  points: string[];
}

/** MTDC services. Wording describes approach, not claims; edit as approved. */
export const services: Service[] = [
  {
    id: "distribution",
    title: "Distribution",
    icon: "network",
    summary: "Taking products from brand owners to the trade buyers who reach consumers in Abuja / FCT.",
    detail:
      "MTDC sits between the people who make or import products and the businesses that sell them. We hold stock, take orders and supply trade customers, giving brands a single, accountable partner in the market.",
    points: [
      "One distribution partner for Abuja / FCT",
      "Supply across modern trade, general trade and HORECA",
      "Clear communication with brand partners",
    ],
  },
  {
    id: "route-to-market",
    title: "Route-to-Market",
    icon: "route",
    summary: "Planning which channels, buyers and outlets a product should reach, and how.",
    detail:
      "Every product needs the right path to its customers. We work with brand owners to decide which channels to prioritise, how products should be presented and how supply should flow to sustain availability.",
    points: [
      "Channel prioritisation for each product range",
      "Market entry planning for brands new to Abuja",
      "Plans agreed with the brand before execution",
    ],
  },
  {
    id: "modern-trade",
    title: "Modern Trade",
    icon: "supermarket",
    summary: "Supplying supermarkets and organised retail with consistent, well-presented stock.",
    detail:
      "Supermarkets and organised retailers expect dependable replenishment and professional account handling. We manage supply to modern trade accounts so products stay available and visible on shelf.",
    points: [
      "Regular replenishment to agreed schedules",
      "Support with listings and shelf presence",
      "Account-level communication on stock and deliveries",
    ],
  },
  {
    id: "open-market-wholesale",
    title: "Open Market & Wholesale",
    icon: "market",
    summary: "Reaching wholesalers, retailers and open-market traders in trade quantities.",
    detail:
      "A large share of everyday purchasing in Abuja happens through wholesalers, neighbourhood retailers and open markets. We supply these customers in trade quantities so products reach consumers wherever they shop.",
    points: [
      "Trade-quantity supply for onward sale",
      "Coverage of wholesalers, retailers and market traders",
      "Relationships built through regular contact",
    ],
  },
  {
    id: "horeca",
    title: "HORECA Supply",
    icon: "hotel",
    summary: "Hotels, restaurants and caterers supplied around their service and event schedules.",
    detail:
      "Hospitality and food-service buyers need the right products when the kitchen or event needs them. We supply hotels, restaurants, caterers and institutional buyers with the same care as retail accounts.",
    points: [
      "Supply for hotels, restaurants and caterers",
      "Deliveries planned around service schedules",
      "Institutional buyers served through the same channel",
    ],
  },
  {
    id: "warehousing-logistics",
    title: "Warehousing & Logistics",
    icon: "truck",
    summary: "Local storage and delivery that keep stock close to the market and moving.",
    detail:
      "Holding stock in Abuja keeps products close to customers. We store, handle and dispatch products to trade customers across Abuja / FCT, delivering them in saleable condition.",
    points: [
      "Local storage for the brands we distribute",
      "Organised dispatch to trade customers",
      "Products handled with care from warehouse to outlet",
    ],
  },
  {
    id: "sales-execution",
    title: "Sales Execution",
    icon: "target",
    summary: "Selling in to trade customers and making sure products are ordered, stocked and seen.",
    detail:
      "Distribution only works when products are actively sold. Our team takes products to trade customers, follows up on orders and pays attention to how products are stocked and presented in outlets.",
    points: [
      "Active selling to trade and HORECA customers",
      "Order follow-up and outlet visits",
      "In-outlet attention to availability and visibility",
    ],
  },
  {
    id: "brand-development",
    title: "Brand Development",
    icon: "megaphone",
    summary: "Building visibility and demand so products sell through, not just sell in.",
    detail:
      "We work with brand owners to grow awareness and demand in Abuja: introducing products to new buyers, supporting visibility in outlets and sharing what we learn from the market.",
    points: [
      "Introducing brands to new trade buyers",
      "In-outlet visibility and trade engagement",
      "Market feedback shared with brand partners",
    ],
  },
];
