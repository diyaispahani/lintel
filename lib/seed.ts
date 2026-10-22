// Demo data so the prototype is never empty, even right after a restart.
// All names and numbers are made up (numbers start with 90000).
// Every seed listing's dashboard is at /owner/<id>?key=demo

import type { Listing, Request } from "./store";

const day = 24 * 60 * 60 * 1000;
const now = Date.now();

// Sensible defaults; each listing below overrides what's different.
const base: Omit<Listing, "id" | "dealType" | "title" | "society" | "area" | "price" | "ownerName" | "ownerPhone" | "createdAt"> = {
  ownerKey: "demo",
  bhk: 2,
  propertyType: "Apartment",
  areaSqft: 1000,
  furnishing: "Semi-furnished",
  availableFrom: "2026-12-01",
  depositMonths: null,
  lockInMonths: null,
  maintenance: 0,
  tenantPreference: "Any",
  petsAllowed: false,
  carParking: 1,
  amenities: ["Lift", "Power backup", "24x7 security"],
  possession: "Ready to move",
  reraRegistered: false,
  details: "",
  mygateVerified: false,
};

let n = 0;
const L = (fields: Partial<Listing> & Pick<Listing, "id" | "dealType" | "title" | "society" | "area" | "price" | "ownerName">): Listing => ({
  ...base,
  ownerPhone: `90000 000${String(++n).padStart(2, "0")}`,
  createdAt: now - n * day,
  ...fields,
});

export const seedListings: Listing[] = [
  L({
    id: "hsr-2bhk", dealType: "rent", title: "Sunny 2BHK, semi-furnished", society: "Prestige Lakeside", area: "HSR Layout, Bengaluru",
    price: 32000, areaSqft: 1150, depositMonths: 3, lockInMonths: 11, maintenance: 0, tenantPreference: "Family", petsAllowed: true,
    amenities: ["Lift", "Power backup", "24x7 security", "Gym", "Gated society"], ownerName: "Priya", mygateVerified: true,
    details: "3rd floor, covered parking, families preferred, pets OK. 5 min walk to Agara Lake.",
  }),
  L({
    id: "whitefield-3bhk-sale", dealType: "sale", title: "3BHK resale with clubhouse", society: "Brigade Cosmopolis", area: "Whitefield, Bengaluru",
    price: 18500000, bhk: 3, areaSqft: 1650, furnishing: "Unfurnished", availableFrom: "2027-01-15", carParking: 2, reraRegistered: true,
    amenities: ["Lift", "Power backup", "24x7 security", "Gym", "Swimming pool", "Clubhouse", "Gated society"], ownerName: "Rahul", mygateVerified: true,
    details: "11th floor, 2 car parks, OC received. Clear title, bank loan approved project.",
  }),
  L({
    id: "koramangala-office", dealType: "lease", title: "Ground-floor office / clinic space", society: "Sona Towers", area: "Koramangala, Bengaluru",
    price: 85000, bhk: null, propertyType: "Office", areaSqft: 1200, furnishing: "Bare shell", availableFrom: "2026-11-15",
    depositMonths: 6, lockInMonths: 36, maintenance: 6000, tenantPreference: "Company", carParking: 2, amenities: ["Power backup", "24x7 security", "Visitor parking"],
    ownerName: "Anand", details: "Road-facing, 3-phase power, 2 washrooms. 5% escalation every year.",
  }),
  L({
    id: "indiranagar-1bhk", dealType: "rent", title: "Cosy 1BHK near metro", society: "Ashirwad Apartments", area: "Indiranagar, Bengaluru",
    price: 24000, bhk: 1, areaSqft: 600, furnishing: "Fully furnished", availableFrom: "2026-11-20", depositMonths: 2, lockInMonths: 6,
    maintenance: 1500, tenantPreference: "Bachelors", carParking: 0, amenities: ["Lift", "Power backup"], ownerName: "Meera", mygateVerified: true,
    details: "Walk to Indiranagar metro. Fridge, washing machine, beds included. Working professionals welcome.",
  }),
  L({
    id: "powai-2bhk-sale", dealType: "sale", title: "Lake-view 2BHK", society: "Hiranandani Gardens", area: "Powai, Mumbai",
    price: 26000000, areaSqft: 950, availableFrom: "2027-02-01", reraRegistered: true,
    amenities: ["Lift", "Power backup", "24x7 security", "Gym", "Swimming pool", "Clubhouse"], ownerName: "Farhan",
    details: "14th floor, lake view, 1 covered parking.",
  }),
  L({
    id: "sarjapur-villa", dealType: "rent", title: "4BHK villa with private garden", society: "Adarsh Palm Retreat", area: "Sarjapur Road, Bengaluru",
    price: 120000, bhk: 4, propertyType: "Villa", areaSqft: 3600, furnishing: "Semi-furnished", depositMonths: 6, lockInMonths: 11, maintenance: 8000,
    tenantPreference: "Family", petsAllowed: true, carParking: 2, ownerName: "Vikrant", mygateVerified: true,
    amenities: ["Power backup", "24x7 security", "Gym", "Swimming pool", "Clubhouse", "Gated society"],
    details: "Corner villa, private garden, servant room, solar water heater.",
  }),
  L({
    id: "baner-2bhk", dealType: "rent", title: "Bright 2BHK with balcony", society: "Kumar Prospera", area: "Baner, Pune",
    price: 28000, areaSqft: 1050, furnishing: "Unfurnished", depositMonths: 2, lockInMonths: 0, maintenance: 2500, tenantPreference: "Any",
    ownerName: "Sneha", details: "East-facing, two balconies, close to Balewadi High Street.",
  }),
  L({
    id: "gachibowli-3bhk-sale", dealType: "sale", title: "Under-construction 3BHK, tower B", society: "My Home Avatar", area: "Gachibowli, Hyderabad",
    price: 14200000, bhk: 3, areaSqft: 1800, furnishing: "Unfurnished", availableFrom: "2028-06-30", possession: "Under construction", reraRegistered: true,
    amenities: ["Lift", "Power backup", "24x7 security", "Gym", "Swimming pool", "Clubhouse", "Gated society"], ownerName: "Kiran",
    details: "Original allotment, resale of booking. 40% paid, builder NOC available.",
  }),
  L({
    id: "golf-course-shop", dealType: "lease", title: "High-street retail shop", society: "Galleria Market", area: "DLF Phase 4, Gurugram",
    price: 150000, bhk: null, propertyType: "Shop", areaSqft: 450, furnishing: "Bare shell", depositMonths: 10, lockInMonths: 24, maintenance: 0,
    tenantPreference: "Company", carParking: 0, amenities: ["Power backup", "24x7 security", "Visitor parking"], ownerName: "Rohit",
    details: "Ground floor, double-height glass frontage, high footfall. Suits café or boutique.",
  }),
  L({
    id: "jp-nagar-house", dealType: "rent", title: "Independent 3BHK house", society: "Independent house", area: "JP Nagar, Bengaluru",
    price: 45000, bhk: 3, propertyType: "Independent house", areaSqft: 1900, depositMonths: 5, lockInMonths: 11, maintenance: 0,
    tenantPreference: "Family", petsAllowed: true, carParking: 1, amenities: ["Power backup"], ownerName: "Lalitha",
    details: "Ground + first floor, terrace, quiet residential street near the park.",
  }),
  L({
    id: "andheri-1bhk-sale", dealType: "sale", title: "Compact 1BHK near metro", society: "Lokhandwala Residency", area: "Andheri West, Mumbai",
    price: 9500000, bhk: 1, areaSqft: 480, furnishing: "Semi-furnished", carParking: 0, reraRegistered: false,
    amenities: ["Lift", "Power backup", "24x7 security"], ownerName: "Ayesha",
    details: "6 min walk to Andheri metro, society redevelopment approved for 2029.",
  }),
  L({
    id: "hsr-office-lease", dealType: "lease", title: "Furnished 30-seat office", society: "27th Main Business Park", area: "HSR Layout, Bengaluru",
    price: 210000, bhk: null, propertyType: "Office", areaSqft: 2400, furnishing: "Fully furnished", depositMonths: 8, lockInMonths: 12,
    maintenance: 15000, tenantPreference: "Company", carParking: 4, amenities: ["Lift", "Power backup", "24x7 security", "Visitor parking"],
    ownerName: "Suresh", mygateVerified: true, details: "30 workstations, 2 cabins, meeting room, pantry. Plug and play.",
  }),
];

export const seedRequests: Request[] = [
  {
    id: "req-hsr-family",
    key: "demo",
    dealType: "rent",
    area: "HSR Layout",
    maxBudget: 35000,
    bhk: 2,
    note: "Couple with a dog, moving from Pune in December.",
    name: "Kavya",
    phone: "90000 00111",
    invitedTo: [],
    createdAt: now - 1 * day,
  },
  {
    id: "req-whitefield-buy",
    key: "demo",
    dealType: "sale",
    area: "Whitefield",
    maxBudget: 20000000,
    bhk: 3,
    note: "First home, home loan pre-approved.",
    name: "Arjun",
    phone: "90000 00112",
    invitedTo: [],
    createdAt: now - 2 * day,
  },
  {
    id: "req-clinic-lease",
    key: "demo",
    dealType: "lease",
    area: "Koramangala",
    maxBudget: 90000,
    bhk: null,
    note: "Dental clinic, need ground floor and 5-year lease.",
    name: "Dr. Sana",
    phone: "90000 00113",
    invitedTo: [],
    createdAt: now - 3 * day,
  },
];
