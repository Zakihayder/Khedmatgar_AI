# Khedmatgar AI (خدمتگار) 🚍🤖

### "Apni Zaroorat Batao — Baaki Hum Karein" 
*(Tell us your need — we'll handle the rest)*

Khedmatgar AI is a production-grade agentic AI platform built for Pakistan's informal service economy. It automates the complete lifecycle of a service request—from understanding a multilingual user query to intelligently matching providers, dynamic pricing, booking simulation, real-time tracking, and post-service dispute resolution.

Built for the **AISeekho2026 Antigravity Hackathon** organized by InnoVista, Telenor Pakistan, Google for Developers, and the Ministry of IT & Telecom.

---

## 🏗️ System Architecture

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
│  │ (NLU)    │ │(Discovery│ │(Ranking) │ │(Pricing) │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  Waqt    │ │Book Karo │ │Yaad Dila │ │Masla Hal │  │
│  │  Agent   │ │  Agent   │ │  Agent   │ │  Agent   │  │
│  │(Schedule)│ │(Booking) │ │(Follow-up│ │(Dispute) │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└────────────────────┬────────────────────────────────────┘
│
┌────────────────────▼────────────────────────────────────┐
│                 DATA & SERVICES LAYER                   │
│                                                         │
│  Supabase DB │ Google Maps │ Gemini AI │ Places API     │
│  Gmail API   │ Slack Webhook │ Web Push │ Supabase Storage│
└─────────────────────────────────────────────────────────┘


---

## 🗂️ Page Structure

| Page Route | Description |
| :--- | :--- |
| `Landing/` | Hero section, platform stats, features, and live booking feed. |
| `Sign Up/auth/signup` | Email + Google OAuth user registration. |
| `Login/auth/login` | Supabase session authentication interface. |
| `Service Request/request` | Multilingual conversational chat UI + live agent trace panel. |
| `Map & Results/results` | Fully integrated Google Map view + ranked provider info cards. |
| `Booking Flow/book/[providerId]` | Slot management selector, pricing breakdowns, and checkout confirmation. |
| `Live Tracking/track/[bookingId]` | Real-time animated provider movement updates tracked on maps. |
| `Feedback/feedback/[bookingId]` | Interactive rating entry & automated dispute trigger mechanism. |
| `Dashboard/dashboard` | Administrative performance overview metrics, active feeds. |
| `Agent Trace/trace` | Comprehensive multi-agent workplan Directed Acyclic Graph (DAG) for evaluation. |
| `Stress Test/demo` | Sandbox module executing 6 custom operational edge cases. |
| `Profile/profile` | End-user transaction history log, preferences portal. |

---

## 🔐 Authentication — Supabase

* **Provider Backend:** Powered securely via Supabase Auth infrastructure.
* **Authentication Vectors:** Supports standard **Email + Password** (with validation hooks) and one-click **Google OAuth 2.0** verification schemes.
* **Architecture Implementation:**
  * Client initialization parameters encapsulated securely inside `lib/supabase/client.ts`.
  * Server-side rendering session handling built over the `@supabase/ssr` module stack.
  * Router rules enforced via `middleware.ts` protecting all internal sub-paths except static pages and `/auth/*`.
  * Automated user profile creation mapped dynamically to the `profiles` relational scheme using automated database triggers during initialization.
  * Secure cross-tab real-time session tracking synchronized natively over Supabase Realtime layers.

### Managed Relational Data Schema
* `profiles`: Houses secure customer meta-data, usage tier flags, and reward metrics.
* `bookings`: State engine ledger maintaining life-cycle steps of all transaction records.
* `providers`: Spatial indices containing both structural static mocks and live commercial data feeds.
* `disputes`: Relational store holding ticket resolutions and validation rules.
* `notifications`: Distributed transactional dispatch history ledger mapped per unique user ID.
* `feedback`: Normalized storage for raw client review metrics and structured textual sentiments.

---

## 🗺️ Google Maps Integration (Real)

Engineered directly on top of the native `@googlemaps/js-api-loader` package layer.

### Enabled Production Endpoints
* **Maps JavaScript API:** Renders cross-platform fluid canvas layers themed explicitly to match the dark application aesthetic.
* **Places API:** Orchestrates geographic autocomplete functions and contextual multi-category lookups.
* **Distance Matrix API:** Calculates live absolute routing constraints and transit durations between nodes.
* **Directions API:** Plots linear tracking coordinates mapping active route legs dynamically.
* **Geocoding API:** Resolves address string inputs into spatial latitude and longitude elements.

### Specialized UI Implementations
* Geolocation API context loops tracking user boundaries dynamically.
* Animated vector category map flags mapping custom domain properties per item type.
* Clickable tracking flags triggering comprehensive overview details including names, cost targets, and distance metrics.
* Bounded coverage overlays rendering customizable contextual perimeter highlights (1km / 3km / 5km increments).
* Interactive pick-up tracking allowing users to modify absolute address parameters directly on-map via draggable pin elements.

### Real Business Analytics via Places API
When an operational profile references retail or healthcare classifications (e.g., medical suppliers, local merchants), the engine passes current coordinate boundaries and target category keys to the search engine. This translates raw structural components seamlessly alongside existing metadata for consolidated evaluation via the ranking system.

---

## 🤖 8 AI Agents — Detailed

### Agent 1 — Samajh Agent (Intent Parser)
* **Role:** High-performance multilingual Natural Language Understanding (NLU) & slot extraction engine.
* **Model Pipeline:** Powered directly via Google Gemini 1.5 Flash.
* **Input Context:** Handles arbitrary textual string queries across Urdu (Arabic script), Roman Urdu, English, and code-switched phrases.
* **Extracted Entities:** Resolves fields including `service_type`, spatial `location`, target `time`, `urgency` tier (1–5 ranking scales), `budget_sensitivity`, and custom constraint vectors.
* **Safety Protocols:** Assigns explicit confidence quotients (0.0 to 1.0 scales). Values falling below a 0.75 floor immediately route to conversational diagnostic validation layers. It rolls back to a high-speed string heuristic framework if upstream server components throw timeout exceptions.
* **Output Format:** Emits clean, validated JSON schemas containing parsed parameters.

### Agent 2 — Dhundho Agent (Provider Discovery)
* **Role:** Resolves geographic candidate arrays matching structural target properties.
* **Data Sources:** Merges static database nodes with programmatic responses from the live Places API.
* **Execution Logic:** References upstream context parsing flags to determine optimal database targets.
* **Filtering Logic:** Screens elements based on availability parameters, target radius parameters, and active configuration statuses.
* **Output Format:** Generates an unstructured candidate array bounding up to 10 distinct entities.

### Agent 3 — Chunno Agent (Matching & Ranking)
* **Role:** Multi-criteria optimization and text reasoning generation.
* **Scoring Matrix:** Computes ranking variables according to the following mathematical model:

$$\text{Match Score} = (\text{Distance} \times 0.20) + (\text{Rating} \times 0.20) + (\text{Availability} \times 0.15) + (\text{Reliability} \times 0.15) + (\text{Specialization} \times 0.15) + (\text{Price Fit} \times 0.10) + (\text{Recency} \times 0.05)$$

* **Fault Protection:** Penalizes provider entries presenting an active delivery failure rate above a 35% performance ceiling.
* **Output Format:** Delivers sorted candidate collections backed by structured, plain-language reasoning descriptions generated natively via Gemini.

### Agent 4 — Daam Agent (Dynamic Pricing)
* **Role:** Provides auditable, fair price optimization across fluid operational bounds.
* **Pricing Formula:** Compiles absolute baseline price matrices using a standard multi-variable calculation:

$$\text{Total Fee} = \left[(\text{Hourly Rate} \times \text{Hours}) + (\text{Distance}_{\text{km}} \times 50) + \text{Urgency Penalty}\right] \times \text{Demand Multiplier} - \text{Loyalty Deduction}$$

* *Urgency Parameters:* Increments calculated at +10% for concurrent day requests, +20% for targets within 6 hours, and +35% for critical constraints under 2 hours.
* *Demand Parameters:* Assesses a 1.3x scaling factor during identified rush periods, and a 0.9x modifier during off-peak windows.
* **Safety Protocol:** Identifies budget threshold breaches dynamically and references alternative configurations to lower friction points.
* **Output Format:** Exposes a granular itemized cost receipt payload showing minimum and maximum price ranges.

### Agent 5 — Waqt Agent (Scheduling)
* **Role:** Conflict resolution and time allocation engine.
* **Functional Scope:** Enforces a rigid 45-minute spatial transportation buffer block between bookings, actively blocks duplicate requests, and handles fallback waitlist states.
* **Error Mitigation:** Yields 3 sorted alternative scheduling windows if the initial choice is unavailable.
* **Output Format:** Emits verified reservation targets alongside structured calendar payload configurations.

### Agent 6 — Book Karo Agent (Booking Execution)
* **Role:** Manages the transaction state engine and registers live bookings.
* **Pipeline Sequence:**
  1. Compiles standard identifier hashes structured as: `KHD-YYYYMMDD-XXXX`.
  2. Persists verified parameters directly down to the Supabase database layers.
  3. Updates operational availability flags inside active relational tables.
  4. Dispatches HTML summary notifications via the Google Workspace endpoints.
  5. Triggers contextual real-time device notifications.
  6. Passes transactional JSON summaries through secure Slack incoming integration lines.
  7. Builds standard `.ics` tracking blocks for user records.
* **Output Format:** Emits structural transaction records alongside all associated tracking metadata.

### Agent 7 — Yaad Dilao Agent (Follow-up Automation)
* **Role:** Tracks execution progress and manages life-cycle alerts.
* **Trigger Milestones:** Maps notifications across specific operational timelines, including:
  * `T-60min`: Dispatches a push notification reminder to the client.
  * `T-15min`: Updates dispatch parameters to an active transit state.
  * `T+0`: Marks execution timelines as officially started.
  * `T+duration`: Prompts the interface to present a completion form.
  * `T+1hr`: Initiates an automated feedback collection prompt.
* **Presentation Mode:** Leverages a unified scheduling engine to safely simulate the execution cycle during live demonstrations.

### Agent 8 — Masla Hal Karo Agent (Dispute Resolution)
* **Role:** Resolves post-transaction tickets and tracks platform safety parameters.
* **Classifications:** Maps issues across identified problem models like provider absence, service discrepancies, excess charging, and partial execution.
* **Resolution Rules Engine:**
  * Provider Absence $\rightarrow$ Triggers full refund processes and increments internal warning metrics.
  * Price Discrepancies $> 30\% \rightarrow$ Issues partial structural balance returns and triggers an investigation flag.
* **Escalation Protocol:** Gemini reviews text context metrics; cases presenting financial risk thresholds above PKR 5,000 route directly to high-priority verification queues.
* **Output Format:** Generates resolution confirmation schemas alongside updated provider evaluation updates.

---

## 🔗 Integrations Implemented

* **Supabase Core Layers:** Handles account states, transaction management records, real-time sync states, and dynamic statistics panels across active dashboard components.
* **Google Gemini AI Engine:** Utilizing `gemini-1.5-flash` to execute language parsing tasks, generate ranking descriptions, evaluate semantic sentiment scores, and classify dispute text logs. Outputs flow via Server-Sent Events (SSE) stream components to the tracing dashboard interface.
* **Google Maps API Environment:** Generates spatial canvas displays, plots routing indicators, processes address auto-fills, and executes geo-distance math.
* **Gmail API Wrapper:** Dispatches transactional summaries, life-cycle tracking reminders, and escalation tickets inside responsive HTML message templates.
* **Slack Webhooks:** Translates new transactions immediately into dedicated channel updates, including context cards and interactive acceptance components.
* **Web Push Notifications:** Implements service worker architectures (`public/sw.js`) to process transactional tracking status cards even when the application is minimized.
* **Web Speech API Component:** Connects to native client parsing engines to accept speech inputs in Urdu (`ur-PK`) and English (`en-US`), handling quiet phases to submit texts automatically.

---

## 📊 Mock vs Real Data Matrix

| Target Feature | Applied Engine Type | Practical Notes |
| :--- | :--- | :--- |
| **Traditional Providers** | Synthetic Dataset Matrix | 25 production profiles built around realistic regional data metrics. |
| **Commercial Entities** | Live Integration Service | Populates details directly using Nearby Search features from Google. |
| **User Assessment Metrics** | Live Integration Service | Reads active review data from Google Places response tables. |
| **Semantic Text Analysis** | Live Integration Service | Evaluates customer sentiment parameters across imported Google reviews using Gemini. |
| **Routing Math Calculations** | Hybrid Execution Engine | Uses Google's Distance Matrix API, falling back to Haversine algorithms if throttled. |
| **System Transaction Stores** | Production Database | Writes parameters down to structured tables, persisting values across user sessions. |

---

## ⚙️ Setup Instructions

Follow these steps to deploy and execute Khedmatgar AI locally:

### 1. Repository Setup & Dependencies
```bash
git clone [https://github.com/yourteam/khedmatgar-ai](https://github.com/yourteam/khedmatgar-ai)
cd khedmatgar-ai
npm install
2. Environment Variables Configuration
Create a .env.local file in the root directory and populate the required keys:

Bash
cp .env.example .env.local
Ensure the following fields are defined:

NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY

GOOGLE_GEMINI_API_KEY

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, & GMAIL_REFRESH_TOKEN

SLACK_WEBHOOK_URL

NEXT_PUBLIC_VAPID_PUBLIC_KEY & VAPID_PRIVATE_KEY

3. Database Initialization
Execute the setup scripts located inside supabase/schema.sql directly inside your Supabase SQL Editor panel to initialize the relational framework.

4. VAPID Keys Generation
Bash
npx web-push generate-vapid-keys
5. Launch the Development Environment
Bash
npm run dev
Open http://localhost:3000 inside your browser to interact with the platform.

💰 Cost & Scalability Analysis
Estimated Cost Metrics Per Single Complete Lifecycle Sequence
Gemini LLM Overhead (NLU + Contextual Reasoning Logic): ~$0.002

Google Maps Distance Matrix Routing Computations: ~$0.001

Google Places Nearby Search Commercial Lookup Calls: ~$0.002

Supabase Transactions & Push Notification Targets: ~$0.000 (Covered under Free Tier limits)

Total Estimated Compute Cost Per Service Sequence: ~$0.005

Defined Scaling Architecture Lifecycle
10x Operational Multipliers (1,000 active users/day): Current serverless architecture effortlessly scales within standard baseline allowances.

100x Operational Multipliers (10,000 active users/day): Introduce a high-speed Redis caching architecture to capture identical discovery calls, shift data models to premium database tiers, and deploy isolation limits across micro-routing structures.

1,000x Operational Multipliers (100,000+ active users/day): Decouple individual agent processes into fully containerized services, map transactions across a distributed queue architecture (e.g., BullMQ), and apply localized edge endpoints.

🔒 Privacy & Operational Assumptions
All localized provider entities are entirely synthetic; any similarities to actual companies or individuals are purely coincidental.

Client email elements are protected natively inside Supabase Auth systems using modern encryption structures.

Geographic location parameters are requested strictly when the user grants permission inside the client browser.

Voice translation actions are calculated over the browser's native Web Speech API endpoints and are not written to persistent servers.

This platform is an architectural simulation tool built for optimization analysis; no real financial clearings or legal service fulfillments occur.
