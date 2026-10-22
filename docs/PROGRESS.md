# Lintel: proof of progress

How Lintel went from a research note to a live, tested product. Every build step below links to a real commit in this repository.

**Live:** https://lintelhomes.vercel.app · **Built by:** Diya Ispahani

## Timeline

| When | Milestone | Commit |
|---|---|---|
| 21 Oct 2026 | **Research and MVP scope.** 40 Reddit posts scraped from r/IndianRealEstate (6 relevant); problem, current state, impact estimate and MVP scope written up. | (document) |
| 22 Oct, 12:30 | **First working prototype ("Shush").** Number-free listing, AI screening chat, owner shortlist with Share number. | `09f5860` |
| 22 Oct, 12:50 | **Full broker-free platform.** Rent / buy / lease, MyGate move-out import (simulated), deal-aware AI questions, duplicate blocking, two-way Connect, "Looking for…" requests with matching and invites. | `e257551` |
| 22 Oct, 14:43 | **Website.** Landing page with the brand animation, listings explorer with 20 filters (deposit, lock-in, tenant preference, RERA, amenities…), richer data model, 12 sample homes in 5 cities. | `aa6ece0` |
| 22 Oct, 15:05 | **Design iteration 1.** Dark premium palette and editorial type, after feedback. | `5873db9` |
| 22 Oct, 15:37 | **Design iteration 2.** Warm cream pages with dark forest and espresso panels, floating illustrated tiles, listings carousel, tilted stat cards, neighbourhood skylines. | `ec4187c`, `4cd5a4f` |
| 22 Oct, 15:51 | **Rename to Lintel and real database.** New name, logo and tagline; Upstash Redis so data persists across Vercel servers. | `b800eaa` |

## Decisions along the way

- **AI only where judgement is needed.** The AI interviews and labels; everything with one right answer (hiding numbers, duplicate blocking, matching, Connect) is plain code.
- **Brokers are hidden, not deleted.** Owners can open the blocked list and see the AI's reason, so a wrong call is visible.
- **The AI never sees phone numbers or names**, so a seeker can't trick it into revealing the owner's number.
- **Illustrations instead of stock photos**, so nothing on the site pretends to be a real home that isn't.
- **A database was added after testing live.** The first deployment kept data in server memory; a live test showed a new listing returning 404 on the next request, which led to Upstash Redis.

## Testing done

**AI screening** (scripted conversations, real AI calls):

| Deal | Seeker | Result |
|---|---|---|
| Rent | Couple moving from Pune | Genuine (98%), shown |
| Rent | "I have 5 families looking" | Broker (100%), hidden |
| Rent | Portal premium-plan salesperson | Sales pitch (100%), hidden |
| Buy | First-home buyer with pre-approved loan | Genuine (98%), shown |
| Buy | "I deal in resale, I have 3 buyers" | Broker (100%), hidden |
| Lease | Dentist opening a clinic | Genuine (98%), shown |
| Lease | Interiors company pitch | Sales pitch (100%), hidden |

**Live end-to-end test on lintelhomes.vercel.app** (each step repeated to hit different servers): create listing; open it (6/6); see it in listings (4/4); owner dashboard (6/6); AI chat to completion; enquiry visible to owner (5/5); duplicate phone blocked; no number before Connect; both numbers after Connect (4/4); request page (4/4); request matches the flat; invite visible to the seeker. **All passed.**

**Also checked:** filters return the right homes (e.g. deposit ≤ 3 months + pets allowed → exactly one home); every page fits a phone screen with no sideways scroll; no phone numbers appear on public pages; no keys in any commit.
