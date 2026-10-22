// SIMULATED MyGate data. MyGate has no public API, so this stands in for a future
// partnership: MyGate knows which flats are being vacated and who really lives there.

import type { DealType } from "./store";

export type MoveOutNotice = {
  id: string;
  society: string;
  area: string;
  flat: string;
  bhk: number;
  movingOut: string;
  ownerName: string;
  ownerPhone: string; // as MyGate has it for the resident owner
  suggestedDeal: DealType;
};

export const moveOutNotices: MoveOutNotice[] = [
  {
    id: "mg-1204",
    society: "Prestige Lakeside",
    area: "HSR Layout, Bengaluru",
    flat: "B-1204",
    bhk: 3,
    movingOut: "2026-11-30",
    ownerName: "Sunil",
    ownerPhone: "90000 00021",
    suggestedDeal: "rent",
  },
  {
    id: "mg-0507",
    society: "Sobha Dream Acres",
    area: "Panathur, Bengaluru",
    flat: "T5-0507",
    bhk: 2,
    movingOut: "2026-12-10",
    ownerName: "Lakshmi",
    ownerPhone: "90000 00022",
    suggestedDeal: "rent",
  },
  {
    id: "mg-1802",
    society: "Brigade Cosmopolis",
    area: "Whitefield, Bengaluru",
    flat: "C-1802",
    bhk: 3,
    movingOut: "2027-01-05",
    ownerName: "Deepak",
    ownerPhone: "90000 00023",
    suggestedDeal: "sale",
  },
];

export const getNotice = (id: string) => moveOutNotices.find((n) => n.id === id);
