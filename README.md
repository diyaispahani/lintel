# Lintel

**Every door, owner to you.** Lintel is a broker-free property platform for India: rent, buy or lease directly from owners. An AI screens every enquiry so brokers and sales calls never reach the owner, and phone numbers are shared only when both sides say yes.

- **Live:** https://lintelhomes.vercel.app
- **Built by:** Diya Ispahani

---

## The problem

Owners who list on free portals (99acres, MagicBricks, NoBroker, Housing.com) publish their phone number, and within minutes it's flooded with calls from brokers and portal sales teams. Real tenants and buyers are hard to find among them, and seekers often end up paying a broker a month's rent anyway.

## What Lintel does

| For seekers | For owners |
|---|---|
| Browse owner-listed homes with filters for rent / buy / lease, budget, deposit, lock-in, pets, possession, RERA and more | List a property in two minutes, or in one tap from a MyGate move-out notice |
| Tap **I'm interested** and answer 4 quick questions in a chat | The number stays hidden. Brokers and sales pitches are filtered out automatically |
| Post a **Looking for…** request so matching owners can invite you | A private dashboard shows a shortlist with a 2-line summary and the AI's reason for each enquiry |
| Get the owner's number only when they choose you | Tap **Connect**: both sides get each other's number |

### Also on every home

- **Map view** of all homes (OpenStreetMap + Leaflet), with filters applied
- **Neighbourhood:** nearest bus stop, metro, railway station and airport, plus hospitals, medical stores, schools, colleges, grocery stores, gyms and salons with distances (OpenStreetMap data, cached per home)
- **360° street view** button that opens Google Street View at the home
- **Home-loan EMI calculator** on homes for sale
- **Family / Bachelors / Company** filter and tags
- **KYC badges** for owners and seekers (simulated phone OTP + DigiLocker step; no ID numbers collected)

Sample homes are marked **Sample**; homes listed by real owners are not.

## What's AI and what's plain code

| Step | Who | Why |
|---|---|---|
| Interview the seeker (questions adapt to rent / buy / lease, English or Hinglish) | **AI** | Free-text answers; the next question depends on the last |
| Label the enquiry Genuine / Broker / Sales pitch / Unclear, with a reason and summary | **AI** | Brokers pose as tenants; it takes reading intent |
| Confidence under 70% → Unclear; hide brokers and sales | Rules | Fixed policy |
| One enquiry per phone per listing | Rules | Fixed policy |
| Match "Looking for…" requests to listings | Rules | Deal, area, budget, size comparisons |
| Reveal numbers only after the owner taps Connect | Rules | Must be guaranteed |

The AI never sees anyone's name or phone number.

## Tech

- **Next.js 16** (App Router, TypeScript), deployed on **Vercel**
- **Upstash Redis** (via Vercel Marketplace) for listings, enquiries, connections and requests; in-memory fallback for local dev
- **Google Gemini 3.7 Flash via OpenRouter** for the screening chat and classification (structured JSON output)
- No UI framework: hand-written CSS design system, Instrument Serif + Plus Jakarta Sans, SVG illustrations and a CSS-only brand animation

## Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Environment variables (never committed):

| Name | What |
|---|---|
| `OPENROUTER_API_KEY` | OpenRouter key for the AI chat |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Upstash Redis (optional locally; without them data is kept in memory) |

## Try the demo

- Browse: https://lintelhomes.vercel.app/listings
- Enquire on a home: https://lintelhomes.vercel.app/l/hsr-2bhk
- Owner dashboard for that home: https://lintelhomes.vercel.app/owner/hsr-2bhk?key=demo
- MyGate one-tap listing: https://lintelhomes.vercel.app/mygate

## Prototype limits

- **MyGate data is simulated.** There's no public MyGate API; the move-out feed and verified badge show how a partnership would work.
- No login: owners and seekers use private links.
- Sample homes are demo data, marked "Sample" on the site (phone numbers starting 90000 are fake).
- KYC is simulated; a real version needs a licensed provider (DigiLocker / Aadhaar OTP).
- Street view opens in Google Maps; embedding it would need a Google Maps API key.
