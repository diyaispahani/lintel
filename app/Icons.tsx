// Small line icons used on listing cards and details (16px, inherit text colour).

const base = { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const IconBed = () => <svg {...base}><path d="M1.5 12.5v-7M1.5 10h13v2.5M14.5 10V8a2 2 0 0 0-2-2H7v4M3.5 8a1.3 1.3 0 1 0 2.6 0 1.3 1.3 0 0 0-2.6 0" /></svg>;
export const IconArea = () => <svg {...base}><path d="M8 1.5 14.5 8 8 14.5 1.5 8z" /></svg>;
export const IconCalendar = () => <svg {...base}><rect x="2" y="3" width="12" height="11" rx="2" /><path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" /></svg>;
export const IconLock = () => <svg {...base}><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5 7V5a3 3 0 0 1 6 0v2" /></svg>;
export const IconRupee = () => <svg {...base}><path d="M4 3h8M4 6h8M6 3c3 0 3.5 6-1.5 6L11 14" /></svg>;
export const IconCar = () => <svg {...base}><path d="M2.5 11V8.5l1.5-4h8l1.5 4V11M2.5 11h11M2.5 11v1.5M13.5 11v1.5" /><circle cx="5" cy="9" r=".6" /><circle cx="11" cy="9" r=".6" /></svg>;
export const IconPin = () => <svg {...base}><path d="M8 14.5s5-4.5 5-8.5a5 5 0 0 0-10 0c0 4 5 8.5 5 8.5z" /><circle cx="8" cy="6" r="1.8" /></svg>;
export const IconUsers = () => <svg {...base}><circle cx="6" cy="5" r="2.3" /><path d="M1.5 13.5c.5-2.5 2.3-4 4.5-4s4 1.5 4.5 4M11 3a2.2 2.2 0 0 1 0 4.4M12.5 9.6c1.1.6 1.8 2 2 3.9" /></svg>;
export const IconCheck = () => <svg {...base}><path d="M3 8.5 6.5 12 13 4.5" /></svg>;
