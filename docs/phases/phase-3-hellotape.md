# Phase 3 — HelloTape

## Goal
The mixtape module. A user sends a curated tape to another user in a way that restores the intentionality and discovery experience of a physical mixtape.

---

## The idea
Digital playlist sharing is instant and frictionless — the opposite of what made mixtapes special. The magic was in the *deliberateness*: someone spent time, made choices, put it in your hands. HelloTape recreates that transaction.

---

## Three design principles

### 1. The "Seal & Send" flow
The sender builds the playlist, but it gets sealed before sending. The recipient gets a notification that a tape is waiting — but they can't see the tracklist until they "pop it in." Discovery is preserved.

### 2. The physical metaphor UI
The send action isn't a button — it's a gesture. You drag the playlist into a cassette shape, it snaps shut, you address it to someone. Slow and intentional on purpose. The PHIL 9000 aesthetic makes this sing.

### 3. Constraints that create meaning
- You can only send one tape at a time
- Side A / Side B structure (approx. 45 min each)
- A runtime check enforces the 90-minute tape limit
- Artificial limits that force curation the way a physical tape did

---

## The send flow (4 steps)

1. **Name your tape** — the sender gives the tape a title. This is what the recipient sees first.
2. **Side A / Side B** — tracks arranged across two sides. Runtime counter shows total against 90-min limit.
3. **Address it** — pick a recipient (username or email), optional message. Tape is sealed and locked.
4. **Sealed & sent** — recipient gets a notification: *"you have a tape waiting."* No tracklist, no preview.

---

## The recipient experience (to design)
- A "tape waiting" notification moment
- A "pop it in" gesture to begin
- Tracklist reveals itself track by track as the tape plays — not all at once
- No skipping ahead (optional hard constraint)

---

## Key UX details

| Detail | Why it matters |
|---|---|
| Tracklist hidden until play | Preserves the discovery experience |
| Name the tape before sending | Forces intentionality; it's a gift, not a forward |
| Optional message field | Recreates the liner note tradition |
| One tape at a time limit | Makes each send feel significant |
| Runtime check against 90 min | Enforces curation like a physical tape |
| Tracklist reveals track by track | The tape "plays" — not a list dump |

---

## Anti-scope-creep note
> "I built this and it was fun. You try it."

Ship the sealed send + recipient reveal. That's the feature. Resist adding: collaborative tapes, public tape walls, tape reactions, tape analytics. The intimacy is the point.

---

## Open questions
- Does the sender see when the recipient plays it? (The "read receipt" question — could cheapen it)
- Hard runtime limit or soft warning?
- Can a tape be declined / returned unplayed?
- PHIL 9000 treatment: does the cassette UI live in a dedicated "tape deck" view, or is it a modal?

---

## Dependencies
Requires Phase 1 and Phase 2 to be complete. Requires user accounts and auth (not present in earlier phases).
