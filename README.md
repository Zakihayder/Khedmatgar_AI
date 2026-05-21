# Khedmatgar AI (خدمتگار)

> **"Apni Zaroorat Batao — Baaki Hum Karein"**
> *(Tell us your need — we'll handle the rest)*

**Khedmatgar AI** is a production-grade agentic AI platform built for Pakistan's informal service economy. It automates the complete lifecycle of a service request — from understanding a multilingual user query to intelligently matching providers, dynamic pricing, booking simulation, real-time tracking, and post-service dispute resolution.

Built for the **AISeekho2026 Antigravity Hackathon** organized by InnoVista, Telenor Pakistan, Google for Developers, and Ministry of IT & Telecom.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Page Structure](#3-page-structure)
4. [Authentication — Supabase](#4-authentication--supabase)
5. [Google Maps Integration](#5-google-maps-integration-real)
6. [8 AI Agents — Detailed](#6-8-ai-agents--detailed)
7. [Integrations Implemented](#7-integrations-implemented)
8. [Mock vs Real Data](#8-mock-vs-real-data)
9. [Setup Instructions](#9-setup-instructions)
10. [Cost & Scalability](#10-cost--scalability)
11. [Baseline Comparison](#11-baseline-comparison)
12. [Privacy & Assumptions](#12-privacy--assumptions)
13. [Limitations](#13-limitations)
14. [Agentic Workflow Evidence](#14-agentic-workflow-evidence)

---

## 1. Project Overview

The informal service economy in Pakistan — plumbers, electricians, AC technicians, tutors, beauticians — operates almost entirely through WhatsApp groups, phone calls, and word-of-mouth referrals. This results in missed opportunities, poor provider matching, unpredictable pricing, and zero automation.

**Khedmatgar AI** replaces this chaos with an 8-agent autonomous system that:

- Understands requests in **Urdu, Roman Urdu, English, and mixed/code-switched language**
- Discovers and ranks providers using a **7-factor scoring algorithm**
- Generates **dynamic, transparent price quotes** with full breakdown
- Simulates complete **end-to-end booking with real notifications** (Gmail, Push, Slack)
- Manages **follow-up reminders, live tracking, and dispute resolution**
- Shows **full agent reasoning traces** — every decision is explainable and logged

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                         │
│         Next.js 14 App Router + TailwindCSS             │
│    (Web Browser + Mobile Responsive PWA)                │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                 AUTH LAYER                              │
│         Supabase Auth (Email + Google OAuth)            │
│      Session Management + Protected Routes              │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│           ANTIGRAVITY ORCHESTRATION ENGINE              │
│                                                         │
│  WorkPlan Creator → Task Dispatcher → SSE Streamer      │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Samajh   │ │ Dhundho  │ │ Chunno   │ │  Daam    │  │
│  │ Agent    │ │ Agent    │ │ Agent    │ │  Agent   │  │
│  │  (NLU)  │ │(Discovery│ │(Ranking) │ │(Pricing) │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  Waqt   │ │Book Karo │ │Yaad Dila │ │Masla Hal │  │
│  │  Agent  │ │  Agent   │ │  Agent   │ │  Agent   │  │
│  │(Schedule│ │(Booking) │ │(Follow-up│ │(Dispute) │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                 DATA & SERVICES LAYER                   │
│                                                         │
│  Supabase DB │ Google Maps │ Gemini AI │ Places API     │
│  Gmail API   │ Slack Webhook │ Web Push │ Supabase Storage│
└─────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | TailwindCSS v3 + Custom Glassmorphism CSS |
| Animations | Framer Motion + GSAP ScrollTrigger |
| 3D Elements | Three.js (hero section) |
| Maps | Google Maps JavaScript API |
| AI / NLU | Google Gemini 1.5 Flash |
| Database + Auth | Supabase (PostgreSQL + Auth + Realtime) |
| Notifications | Web Push API + Gmail API + Slack Webhook |
| Voice Input | Web Speech API (browser native) |
| Deployment | Vercel |

---

## 3. Page Structure

| Page | Route | Description |
|---|---|---|
| Landing | `/` | Hero with 3D animations, live stats, feature showcase |
| Sign Up | `/auth/signup` | Email + Google OAuth registration |
| Login | `/auth/login` | Supabase authentication |
| Service Request | `/request` | Chat interface + live agent reasoning panel |
| Map & Results | `/results` | Real Google Map + ranked provider cards |
| Booking Flow | `/book/[providerId]` | Slot picker, pricing breakdown, confirmation |
| Live Tracking | `/track/[bookingId]` | Animated provider movement on real map |
| Feedback | `/feedback/[bookingId]` | Star rating + dispute trigger |
| Dashboard | `/dashboard` | Admin view, live stats, real-time booking feed |
| Agent Trace | `/trace` | Full workplan DAG viewer for judges |
| Stress Test | `/demo` | 6 edge case scenarios with baseline comparison |
| Profile | `/profile` | User booking history, preferences, loyalty points |

---

## 4. Authentication — Supabase

**Provider:** Supabase Auth

**Methods supported:**
- Email + Password (with email verification flow)
- Google OAuth 2.0 (one-click sign-in)

**Implementation details:**
- Supabase client initialized in `lib/supabase/client.ts`
- Server-side session management via `@supabase/ssr` package
- `middleware.ts` protects all routes except `/` and `/auth/*`
- On signup: user profile auto-created in `profiles` table via Supabase database trigger
- Session persisted in HTTP-only cookies (not localStorage) for SSR compatibility
- Auth state synced across browser tabs via Supabase Realtime channels

**Database tables:**

```sql
profiles        -- user info, preferences, loyalty points
bookings        -- all booking records with full state
providers       -- service provider data (25 mock providers)
disputes        -- dispute records and resolution outcomes
notifications   -- notification log per user per booking
feedback        -- star ratings and written reviews
```

---

## 5. Google Maps Integration (Real)

**Package:** `@googlemaps/js-api-loader`

### APIs Enabled

| API | Usage |
|---|---|
| Maps JavaScript API | Full interactive dark-themed map rendering |
| Places API | Real business search + address autocomplete |
| Distance Matrix API | Travel time calculation between user and providers |
| Directions API | Animated route polyline from user to selected provider |
| Geocoding API | Convert address text to lat/lng coordinates |

### Map Features Implemented

- Custom dark map style matching app theme (deep navy background)
- User GPS location detection via browser Geolocation API
- Google Places Autocomplete on all location input fields
- Custom animated SVG provider pins per service category (AC unit, wrench, bolt, scissors)
- Clickable provider pins with info bubble: name, rating, distance, price, availability badge
- Animated polyline route drawn from user location to selected provider
- Service radius circle overlay with 1 km / 3 km / 5 km toggle
- Demand heatmap layer showing request density by area
- Provider cluster groups for high-density zones
- Draggable user location marker for precise service address input
- Street View button on provider info bubbles

### Real Business Search via Google Places

When a user searches for restaurants, pharmacies, salons, or any formal business:

1. System calls `Places Nearby Search` with: `{ location, radius: 3000, keyword, opennow }`
2. Fetches live data: business name, Google rating, photos, opening hours
3. Normalizes response to match mock provider card format
4. Applies our multi-factor scoring on top of real Google data
5. Shows **Best Choice**, **Fastest**, **Top Rated** badges based on composite score

For informal services (plumber, AC technician, electrician, tutor): uses mock provider database.

---

## 6. 8 AI Agents — Detailed

### Agent 1 — Samajh Agent (Intent Parser)

| Property | Detail |
|---|---|
| Role | Multilingual NLU and entity extraction |
| Model | Google Gemini 1.5 Flash |
| Input | Raw user text (any language or script) |
| Output | Structured JSON intent object |

**Extracts:** `service_type`, `location`, `time_preference`, `urgency (1–5)`, `budget_sensitivity`, `special_requirements`

**Languages:** Urdu (Arabic script), Roman Urdu, English, code-switched mixed input

**Confidence scoring:** 0.0–1.0. Below 0.75 → returns a clarification question in the detected language.

**Fallback:** Rule-based keyword matching when Gemini API is unavailable.

**Example term mappings:**

| User says | Mapped to |
|---|---|
| "bijli" / "light nahi" | `ELECTRICIAN` |
| "paani" / "nala band" | `PLUMBER` |
| "thanda" / "AC" | `AC_REPAIR` |
| "parhai" / "teacher" | `TUTOR` |

---

### Agent 2 — Dhundho Agent (Provider Discovery)

| Property | Detail |
|---|---|
| Role | Find and filter relevant providers by service and location |
| Data Sources | Mock JSON database (informal services) + Google Places API (businesses) |
| Filter Criteria | Active status, service category match, area proximity |
| Output | Raw candidate list (up to 10 providers) |

Automatically selects data source based on `service_type` classification from Agent 1.

---

### Agent 3 — Chunno Agent (Matching & Ranking)

| Property | Detail |
|---|---|
| Role | Multi-factor intelligent provider scoring and ranking |
| Anomaly Detection | Penalizes providers where rating > 4.5 AND cancellation_rate > 35% |
| Reasoning | Gemini generates plain-language explanation for top 3 picks |
| Output | Ranked provider list with individual scores and reasoning text |

**Scoring Formula:**

```
MATCH_SCORE =
  distance_score     × 0.20    (normalized: closer = higher)
  rating_score       × 0.20    (star rating / 5.0)
  availability_score × 0.15    (slot match quality 0–1)
  reliability_score  × 0.15    (on_time_score / 100)
  specialization     × 0.15    (job complexity match depth)
  price_fit_score    × 0.10    (budget alignment)
  recency_score      × 0.05    (reviews in last 30 days / total)
```

---

### Agent 4 — Daam Agent (Dynamic Pricing)

| Property | Detail |
|---|---|
| Role | Transparent, fair price estimation with itemized breakdown |
| Budget Sensitivity | Suggests cheaper alternative if total exceeds user budget signal |
| Output | Itemized price card with min/max range + budget-friendly option |

**Pricing Formula:**

```
BASE_PRICE   = provider.hourly_rate × estimated_hours
DISTANCE_FEE = distance_km × PKR 50
URGENCY      = +10% same day | +20% <6hrs | +35% <2hrs | +0% tomorrow+
DEMAND       = ×1.3 peak hours (8–10am, 5–8pm) | ×1.0 normal | ×0.9 off-peak
LOYALTY      = −10% returning users

TOTAL = (BASE + DISTANCE + URGENCY) × DEMAND − LOYALTY
```

---

### Agent 5 — Waqt Agent (Scheduling)

| Property | Detail |
|---|---|
| Role | Intelligent slot management and conflict resolution |
| Travel Buffer | Minimum 45-minute gap enforced between consecutive provider jobs |
| Conflict Handling | Suggests next 3 available slots if requested time is already taken |
| Auto-Reschedule | Finds replacement provider or next open slot if original cancels |
| Output | Confirmed slot + 3 alternatives + `.ics` calendar event data |

---

### Agent 6 — Book Karo Agent (Booking Execution)

| Property | Detail |
|---|---|
| Role | Simulate complete booking transaction with all side effects |
| Booking ID Format | `KHD-YYYYMMDD-XXXX` |
| Output | Complete booking object + all confirmation artifacts |

**Actions performed (all logged with timestamps in agent trace):**

1. Generates unique Booking ID
2. Writes record to Supabase `bookings` table
3. Updates provider availability in database
4. Sends Gmail HTML confirmation email (if user opted in)
5. Fires browser push notification via Web Push API
6. Posts Slack webhook alert to provider channel
7. Generates `.ics` Google Calendar event string
8. Logs complete action trace for `/trace` viewer

---

### Agent 7 — Yaad Dilao Agent (Follow-up Automation)

| Property | Detail |
|---|---|
| Role | Post-booking lifecycle and notification scheduling |
| Output | Notification timeline object with all scheduled triggers |

**Trigger schedule:**

| Trigger | Type | Message |
|---|---|---|
| T−60min | Push notification | "Technician 1 ghante mein pohonchega" |
| T−15min | Status update | "Provider en route — 15 minutes away" |
| T+0 | Confirmation | "Service has started" |
| T+duration | Completion prompt | "Service complete — please confirm" |
| T+1hr | Feedback request | "Rate your experience" |
| T+24hr | Email reminder | Receipt + rating nudge |

> *Demo mode: `setTimeout` chain simulates all triggers live during presentation.*

---

### Agent 8 — Masla Hal Karo Agent (Dispute Resolution)

| Property | Detail |
|---|---|
| Role | Post-service issue classification and automated resolution |
| Classification | Google Gemini classifies dispute type and severity |
| Escalation Threshold | PKR > 5,000 OR repeated complaints → Gmail escalation to admin |
| Provider Impact | Updates `risk_score`; 3 verified strikes → `is_blacklisted = true` |
| Output | Resolution decision + reasoning + provider reputation update |

**Auto-resolution rules:**

| Dispute Type | Resolution |
|---|---|
| `no_show` | Full refund simulated + provider strike added |
| `overcharging > 30%` | Partial refund + investigation flag set |
| `quality_issue` | Discount code on next booking |
| `incomplete_work` | Provider must-return simulation triggered |

---

## 7. Integrations Implemented

### Supabase — Database, Auth & Realtime

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

- User authentication (Email + Google OAuth)
- Booking persistence across sessions
- Provider and dispute record storage
- **Realtime:** Dashboard subscribes to `bookings` table INSERT events — new bookings animate into the feed live

### Google Gemini AI

| Key | Value |
|---|---|
| `GOOGLE_GEMINI_API_KEY` | From Google AI Studio |

- **Model:** `gemini-1.5-flash`
- Intent extraction (Samajh Agent)
- Ranking reasoning text generation (Chunno Agent)
- Review sentiment scoring
- Dispute type classification (Masla Hal Karo Agent)
- **Streaming:** Token-by-token responses streamed via Server-Sent Events to frontend trace panel

### Google Maps Platform

| Key | Value |
|---|---|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | From Google Cloud Console |

- APIs enabled: Maps JavaScript, Places, Distance Matrix, Directions, Geocoding
- Interactive dark-themed map with animated provider pins
- Real business search via Places Nearby Search
- Animated route polyline drawing
- Address autocomplete on all location fields

### Gmail API

| Key | Value |
|---|---|
| `GMAIL_CLIENT_ID` | From Google Cloud Console OAuth |
| `GMAIL_CLIENT_SECRET` | From Google Cloud Console OAuth |
| `GMAIL_REFRESH_TOKEN` | From OAuth Playground |

- Booking confirmation emails (branded HTML template)
- T−1hr reminder emails
- Dispute escalation emails to admin
- **Fallback:** Beautiful email preview card shown in UI when OAuth not configured

### Slack Webhook

| Key | Value |
|---|---|
| `SLACK_WEBHOOK_URL` | From api.slack.com/apps |

- Provider job alert on every new booking
- Message includes: service type, customer area, time, estimated earnings, Accept/Decline buttons
- **Fallback:** "Slack notification simulated" logged in agent trace with preview card

### Web Push Notifications

| Key | Value |
|---|---|
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Generated via `npx web-push generate-vapid-keys` |
| `VAPID_PRIVATE_KEY` | Generated via `npx web-push generate-vapid-keys` |

- `public/sw.js` service worker handles background push when tab is closed
- Booking confirmation, reminders, en-route alerts, completion prompts
- **Fallback:** In-app toast notifications if browser permission denied

### Web Speech API (Voice Input)

- No API key required — browser-native API
- Languages: `ur-PK` (Urdu), `en-US` (English)
- Real-time transcript display as user speaks
- Auto-submit triggered on silence detection
- Requires Chrome or Chromium-based browser

---

## 8. Mock vs Real Data

| Data Type | Source | Notes |
|---|---|---|
| Informal providers (plumber, AC, etc.) | Mock JSON — 25 providers | Realistic Pakistani names, Islamabad sectors G-13 to F-8, synthetic coordinates |
| Business search (restaurants, pharmacies) | **Real Google Places API** | Live data fetched at request time |
| Provider ratings for businesses | **Real Google Reviews** | Via Places API `rating` + `user_ratings_total` fields |
| Review sentiment analysis | **Real Gemini API** | Runs on fetched review text in real time |
| Distance calculations | **Real Distance Matrix API** | Falls back to Haversine formula on quota/API failure |
| Booking records | **Real Supabase database** | Persisted across sessions, survives browser refresh |
| User accounts | **Real Supabase Auth** | Email verification + Google OAuth |
| Push notifications | **Real Web Push API** | Requires VAPID keys + browser permission grant |
| Email notifications | **Real Gmail API** | Falls back gracefully to simulation preview |
| Slack alerts | **Real Slack Webhook** | Falls back gracefully to simulated trace log |

---

## 9. Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Cloud Console project with APIs enabled
- Supabase project (free tier sufficient)
- Vercel account (for deployment)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/yourteam/khedmatgar-ai
cd khedmatgar-ai

# 2. Install all dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Open .env.local and fill in all API keys (see table below)

# 4. Set up Supabase database
# Go to: your Supabase project → SQL Editor
# Run the full contents of: supabase/schema.sql

# 5. Generate VAPID keys for push notifications
npx web-push generate-vapid-keys
# Copy the output Public Key and Private Key into .env.local

# 6. Start development server
npm run dev
# Open http://localhost:3000

# 7. Deploy to production
vercel --prod
```

### Environment Variables Reference

```dotenv
# ── Google ─────────────────────────────────────────────
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=      # console.cloud.google.com
GOOGLE_GEMINI_API_KEY=                # aistudio.google.com

# ── Supabase ───────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=             # supabase.com → Settings → API
NEXT_PUBLIC_SUPABASE_ANON_KEY=        # supabase.com → Settings → API

# ── Gmail OAuth (optional) ─────────────────────────────
GMAIL_CLIENT_ID=                      # Google Cloud Console → OAuth
GMAIL_CLIENT_SECRET=                  # Google Cloud Console → OAuth
GMAIL_REFRESH_TOKEN=                  # developers.google.com/oauthplayground

# ── Slack (optional) ───────────────────────────────────
SLACK_WEBHOOK_URL=                    # api.slack.com/apps → Incoming Webhooks

# ── Web Push Notifications ─────────────────────────────
NEXT_PUBLIC_VAPID_PUBLIC_KEY=         # npx web-push generate-vapid-keys
VAPID_PRIVATE_KEY=                    # npx web-push generate-vapid-keys

# ── App ────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note:** The app runs with only `GOOGLE_MAPS_API_KEY`, `GOOGLE_GEMINI_API_KEY`, and `SUPABASE_*` keys. Gmail and Slack fall back to simulation automatically if not configured.

---

## 10. Cost & Scalability

### Estimated Cost Per Booking Operation

| Operation | Estimated Cost |
|---|---|
| Gemini API — NLU + reasoning generation | ~$0.002 |
| Google Maps Distance Matrix call | ~$0.001 |
| Google Places Nearby Search call | ~$0.002 |
| Supabase DB write (free tier) | ~$0.000 |
| Web Push notification | ~$0.000 |
| **Total per booking end-to-end** | **~$0.005** |

### Scaling Path

| Scale | Users/Day | Approach |
|---|---|---|
| **Current** | ~200 | Vercel serverless + Supabase free tier |
| **10x** | ~1,000 | Same architecture, well within free tier limits |
| **100x** | ~10,000 | Redis caching for provider queries, Supabase Pro, Vercel Pro edge functions |
| **1,000x** | ~100,000 | Microservices per agent, BullMQ distributed task queue, CDN for map tiles, Supabase read replicas |

### Latency Targets

| Step | Target |
|---|---|
| Intent extraction (Gemini) | < 1.5 seconds |
| Provider ranking (7-factor, in-memory) | < 200 ms |
| Full booking pipeline (all 8 agents) | < 5 seconds end-to-end |

---

## 11. Baseline Comparison

| Metric | Without Khedmatgar AI | With Khedmatgar AI |
|---|---|---|
| Time to book | 30–45 minutes | < 10 seconds |
| User steps required | 7+ manual actions | 1 input (text or voice) |
| Language support | WhatsApp text only | Urdu + Roman Urdu + English + Voice |
| Provider selection logic | Whoever replies first | 7-factor AI-scored ranking |
| Price transparency | Unknown until provider calls back | Itemized estimate before booking |
| Booking confirmation | Verbal only | Email + Push + Slack + PDF receipt |
| Follow-up reminders | None | Fully automated at T−60min, T−15min, T+completion |
| Live tracking | None | Animated provider movement on Google Maps |
| Dispute resolution | No formal process | Automated classification + email escalation |

---

## 12. Privacy & Assumptions

- No real personal data used — all provider data is fully synthetic
- User emails stored only in Supabase Auth with encryption at rest
- Google Maps accesses device location only after explicit user permission grant
- Voice input processed locally by browser Web Speech API — audio never sent to our servers
- All bookings are simulations — no real financial transactions occur
- Slack webhook posts to a demo workspace controlled by the team
- Mock provider phone numbers follow Pakistani format (`+92-3XX-XXXXXXX`) but are not real active numbers
- Provider photos use generated placeholder avatars only — no real individuals depicted

---

## 13. Limitations

- Gmail OAuth flow is complex to configure — demo gracefully falls back to email preview simulation card in UI
- Web Speech API voice input requires Chrome or a Chromium-based browser to function
- Google Places API has daily quota limits — mock provider data used as an automatic fallback when the quota is exceeded
- Real-time provider GPS tracking is simulated — no actual GPS device data from providers
- Push notifications require HTTPS in production (automatic on Vercel, not available on plain `http://localhost`)
- Urdu voice recognition accuracy depends on browser implementation and microphone quality
- Scheduling conflict resolution uses in-memory state — would require a distributed lock (e.g., Redis) for safe concurrent user handling in production
- Supabase free tier has 500 MB database limit and 2 GB bandwidth/month — sufficient for hackathon demo scale

---

## 14. Agentic Workflow Evidence

The system demonstrates all six required agentic behaviors:

| Behavior | How It Is Demonstrated |
|---|---|
| **Observes** | Reads raw user input, detects language and script, reads provider database, checks real-time slot availability |
| **Reasons** | Gemini generates explicit written reasoning for provider selection; confidence score calculated for every NLU output |
| **Decides** | Chunno Agent selects best provider with explainable weighted scoring; Masla Hal Karo auto-classifies and resolves disputes |
| **Acts** | Books slot in Supabase, sends Gmail email, fires push notification, posts Slack alert, updates provider calendar |
| **Evaluates** | Anomaly detection on provider data (high rating + high cancellation); confidence threshold triggers clarification |
| **Adapts** | Auto-reschedules if provider cancels; suggests slot alternatives if conflict; falls back gracefully on any API failure |
