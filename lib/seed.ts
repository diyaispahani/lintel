// Demo data so the prototype is never empty, even right after a restart.
// All names and numbers are made up (numbers start with 90000).
// Every seed listing's dashboard is at /owner/<id>?key=demo

import { coordsFor } from "./places";
import type { Listing, PropertyType, Request, TenantPreference } from "./store";

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
  kycVerified: true,
  lat: null,
  lng: null,
};

let n = 0;
const L = (fields: Partial<Listing> & Pick<Listing, "id" | "dealType" | "title" | "society" | "area" | "price" | "ownerName">): Listing => ({
  ...base,
  ownerPhone: `90000 000${String(++n).padStart(2, "0")}`,
  createdAt: now - n * day,
  ...fields,
});

const core: Listing[] = [
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

// More sample homes so the map has something to show in every city.
// [id, deal, type, bhk, title, society, area, price, sqft, furnishing, tenants, pets, deposit, lock-in, maintenance, possession, rera, owner, mygate, kyc]
type Row = [string, Listing["dealType"], PropertyType, number | null, string, string, string, number, number, string, TenantPreference, boolean, number | null, number | null, number, Listing["possession"], boolean, string, boolean, boolean];
const ROWS: Row[] = [
  ["koramangala-2bhk", "rent", "Apartment", 2, "Quiet 2BHK off 80 Feet Road", "Raheja Residency", "Koramangala, Bengaluru", 42000, 1100, "Semi-furnished", "Family", false, 3, 11, 2500, "Ready to move", false, "Nisha", true, true],
  ["jayanagar-1bhk", "rent", "Independent house", 1, "1BHK portion with terrace access", "Independent house", "Jayanagar, Bengaluru", 18000, 550, "Unfurnished", "Bachelors", false, 2, 6, 0, "Ready to move", false, "Ramesh", false, true],
  ["hebbal-3bhk", "rent", "Apartment", 3, "Lake-facing 3BHK, high floor", "Brigade Lakefront", "Hebbal, Bengaluru", 65000, 1750, "Fully furnished", "Family", true, 4, 11, 5000, "Ready to move", false, "Arvind", true, true],
  ["ecity-studio", "rent", "Apartment", 1, "Compact 1BHK near Infosys gate", "Ajmera Infinity", "Electronic City, Bengaluru", 15000, 520, "Fully furnished", "Bachelors", false, 2, 6, 1500, "Ready to move", false, "Kiran", false, true],
  ["bellandur-2bhk-sale", "sale", "Apartment", 2, "2BHK in a gated community", "Salarpuria Greenage", "Bellandur, Bengaluru", 11500000, 1240, "Semi-furnished", "Any", false, null, null, 3500, "Ready to move", true, "Sunita", true, true],
  ["marathahalli-pg-house", "rent", "Independent house", 4, "4BHK house, ideal for sharing", "Independent house", "Marathahalli, Bengaluru", 55000, 2200, "Semi-furnished", "Bachelors", false, 5, 11, 0, "Ready to move", false, "Prakash", false, false],
  ["malleshwaram-3bhk-sale", "sale", "Independent house", 3, "Heritage-style 3BHK house", "Independent house", "Malleshwaram, Bengaluru", 32000000, 2400, "Unfurnished", "Any", false, null, null, 0, "Ready to move", false, "Geetha", false, true],
  ["whitefield-office", "lease", "Office", null, "60-seat office near ITPL", "Prestige Shantiniketan", "Whitefield, Bengaluru", 360000, 4200, "Fully furnished", "Company", false, 8, 36, 30000, "Ready to move", false, "Manoj", false, true],
  ["sarjapur-2bhk-sale", "sale", "Apartment", 2, "Under-construction 2BHK, tower C", "Godrej Splendour", "Sarjapur Road, Bengaluru", 9800000, 1150, "Unfurnished", "Any", false, null, null, 0, "Under construction", true, "Varun", false, true],
  ["jpnagar-shop", "lease", "Shop", null, "Corner shop on 24th Main", "JP Plaza", "JP Nagar, Bengaluru", 70000, 380, "Bare shell", "Company", false, 6, 24, 0, "Ready to move", false, "Shobha", false, true],
  ["powai-1bhk", "rent", "Apartment", 1, "1BHK with lake glimpse", "Hiranandani Gardens", "Powai, Mumbai", 48000, 520, "Semi-furnished", "Bachelors", false, 3, 11, 3500, "Ready to move", false, "Zoya", true, true],
  ["andheri-2bhk", "rent", "Apartment", 2, "2BHK walking distance to metro", "Lokhandwala Complex", "Andheri West, Mumbai", 75000, 780, "Fully furnished", "Family", true, 3, 11, 4000, "Ready to move", false, "Imran", false, true],
  ["bandra-3bhk-sale", "sale", "Apartment", 3, "Sea-breeze 3BHK near Carter Road", "Sea Queen", "Bandra West, Mumbai", 72000000, 1450, "Semi-furnished", "Any", false, null, null, 12000, "Ready to move", true, "Cyrus", true, true],
  ["thane-2bhk-sale", "sale", "Apartment", 2, "2BHK with clubhouse access", "Lodha Amara", "Thane, Mumbai", 13500000, 690, "Unfurnished", "Any", false, null, null, 3000, "Under construction", true, "Pooja", false, true],
  ["bandra-cafe", "lease", "Shop", null, "Ground-floor café space", "Pali Hill Arcade", "Bandra West, Mumbai", 280000, 650, "Bare shell", "Company", false, 10, 36, 0, "Ready to move", false, "Dinesh", false, true],
  ["kothrud-2bhk", "rent", "Apartment", 2, "2BHK near Karve Road", "Mayur Colony", "Kothrud, Pune", 26000, 950, "Semi-furnished", "Family", false, 2, 11, 1500, "Ready to move", false, "Anjali", true, true],
  ["hinjewadi-1bhk", "rent", "Apartment", 1, "1BHK next to Phase 1", "Megapolis Sparklet", "Hinjewadi, Pune", 17000, 600, "Fully furnished", "Bachelors", false, 2, 6, 1200, "Ready to move", false, "Rohit", false, true],
  ["baner-3bhk-sale", "sale", "Apartment", 3, "3BHK with two balconies", "Rohan Abhilasha", "Baner, Pune", 16500000, 1500, "Semi-furnished", "Any", false, null, null, 4000, "Ready to move", true, "Mahesh", true, true],
  ["madhapur-2bhk", "rent", "Apartment", 2, "2BHK near Hitech City", "Aparna Towers", "Madhapur, Hyderabad", 38000, 1200, "Semi-furnished", "Any", true, 2, 11, 2500, "Ready to move", false, "Lakshman", false, true],
  ["kondapur-3bhk", "rent", "Villa", 3, "3BHK villa with garden", "Lanco Hills", "Kondapur, Hyderabad", 85000, 2600, "Semi-furnished", "Family", true, 3, 11, 6000, "Ready to move", false, "Swathi", true, true],
  ["gachibowli-office", "lease", "Office", null, "Plug-and-play office, 40 seats", "SLN Terminus", "Gachibowli, Hyderabad", 240000, 3000, "Fully furnished", "Company", false, 6, 24, 20000, "Ready to move", false, "Venkat", false, true],
  ["madhapur-1bhk-sale", "sale", "Apartment", 1, "1BHK investment flat", "My Home Vihanga", "Madhapur, Hyderabad", 6800000, 640, "Unfurnished", "Any", false, null, null, 2000, "Ready to move", true, "Ravi", false, false],
  ["dlf4-3bhk", "rent", "Apartment", 3, "3BHK near Galleria Market", "Ridgewood Estate", "DLF Phase 4, Gurugram", 70000, 1800, "Semi-furnished", "Family", true, 2, 11, 6000, "Ready to move", false, "Neha", true, true],
  ["dlf4-1bhk", "rent", "Apartment", 1, "1BHK studio for professionals", "Princeton Estate", "DLF Phase 4, Gurugram", 32000, 650, "Fully furnished", "Bachelors", false, 2, 6, 2500, "Ready to move", false, "Kunal", false, true],
  ["saket-3bhk-sale", "sale", "Independent house", 3, "Builder floor, 3BHK", "Independent house", "Saket, New Delhi", 42000000, 1800, "Semi-furnished", "Any", false, null, null, 0, "Ready to move", false, "Amit", false, true],
  ["saket-2bhk", "rent", "Independent house", 2, "2BHK first floor near Select City", "Independent house", "Saket, New Delhi", 45000, 1100, "Semi-furnished", "Family", false, 2, 11, 0, "Ready to move", false, "Ritu", false, true],
  ["adyar-2bhk", "rent", "Apartment", 2, "2BHK near Theosophical Society", "Gandhi Nagar Apartments", "Adyar, Chennai", 35000, 1050, "Semi-furnished", "Family", false, 5, 11, 2000, "Ready to move", false, "Lakshmi", true, true],
  ["annanagar-3bhk-sale", "sale", "Apartment", 3, "3BHK close to Tower Park", "Jains Avantika", "Anna Nagar, Chennai", 19500000, 1550, "Unfurnished", "Any", false, null, null, 3500, "Ready to move", true, "Senthil", false, true],
  ["annanagar-1bhk", "rent", "Apartment", 1, "1BHK near the metro", "Shanthi Colony", "Anna Nagar, Chennai", 16000, 520, "Unfurnished", "Bachelors", false, 3, 6, 800, "Ready to move", false, "Karthik", false, true],
  ["adyar-clinic", "lease", "Shop", null, "Ground-floor clinic space", "LB Road Complex", "Adyar, Chennai", 90000, 900, "Bare shell", "Company", false, 6, 36, 0, "Ready to move", false, "Revathi", false, true],
];

const extra: Listing[] = ROWS.map(([id, dealType, propertyType, bhk, title, society, area, price, areaSqft, furnishing, tenantPreference, petsAllowed, depositMonths, lockInMonths, maintenance, possession, reraRegistered, ownerName, mygateVerified, kycVerified]) =>
  L({ id, dealType, propertyType, bhk, title, society, area, price, areaSqft, furnishing, tenantPreference, petsAllowed, depositMonths, lockInMonths, maintenance, possession, reraRegistered, ownerName, mygateVerified, kycVerified }),
);

export const seedListings: Listing[] = [...core, ...extra].map((l) => ({ ...l, ...(coordsFor(l.area, l.id) ?? {}) }));

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
