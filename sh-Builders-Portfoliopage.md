SH BUILDERS
—
Digital Transformation Initiative
Project Scope · Detailed Plan · Proposal

Prepared for	SH Builders — Leadership Team
Prepared by	Project Delivery Partner (the "Partner")
Document version	1.0
Date	May 01, 2026

Reference prototype: sh-builders.vercel.app
 
Table of Contents
Right-click and select "Update Field" to populate the table of contents.

After opening this document in Word, click anywhere in the table above and press F9 to populate page numbers.
 
1. Executive Summary
SH Builders is a custom luxury home builder whose work — its craftsmanship, materials, and client relationships — already meets a standard well above the local market. The opportunity this document addresses is bringing the digital experience of the brand up to the same standard, and giving the operations team the tooling to run a growing slate of builds without losing control of quality, schedule, or budget.
We propose a single, coordinated initiative that delivers four interlocking products: a new corporate website that converts qualified leads, a content admin portal that lets the team publish properties without engineering involvement, a construction project-management application that gives every active build a real-time view of phases, tasks, and materials, and a structured social and email marketing system that keeps the funnel full.
The four workstreams share a common design system, data model, and delivery cadence so the team is never paying for the same work twice. A working prototype of the corporate website is already live at sh-builders.vercel.app and is referenced throughout this document as the visual and functional baseline.
What success looks like
•	Lead-quality contact form submissions through the new website increase materially within the first quarter post-launch.
•	Property publishing time drops from days (engineering ticket) to under 30 minutes (self-serve via the admin portal).
•	Every active build has a single, current source of truth visible to office and field teams.
•	Marketing posting cadence is consistent and measurable, with attribution from social/email all the way to qualified lead.
 
2. Project Scope
2.1 Background and Context
SH Builders has built its reputation on custom luxury homes where finish, material selection, and process matter as much as the final structure. The current public web presence does not reflect that standard, content updates require engineering effort, and project tracking lives across spreadsheets, text threads, and verbal updates. As the build pipeline grows, those gaps compound into missed leads, slower publishing, and avoidable coordination overhead.
The prototype at sh-builders.vercel.app demonstrates the visual direction and confirms feasibility of the front-end aesthetic. This engagement productionizes that direction and adds the three supporting systems — admin portal, construction PM app, and marketing operations — needed to make the site a sustainable, lead-generating asset.
2.2 Vision and Objectives
By the end of this engagement, SH Builders will operate the following:
•	A high-performance corporate website that converts qualified leads and reflects the brand's craft.
•	An internal admin portal that gives the team direct, no-code control of website content.
•	A construction project management app that tracks every active build through standardized phases.
•	A repeatable social and email marketing operation built around five content pillars and measurable KPIs.
2.3 Target Audiences
Audience	Need	Touchpoint
High-net-worth prospects	Inspiration, social proof, way to start a conversation	Corporate website, Instagram, email drip
Existing & past clients	Status visibility, brand connection, referrals	Email newsletter, project updates
SH Builders office team	Publish content, manage portfolio, track builds	Admin portal, PM app dashboard
SH Builders field team & subs	Task list, materials status, drawings	PM app (mobile-friendly)
Local trade & referral network	Brand visibility, partnership signals	Social channels, Facebook community posts
2.4 Workstream Overview
#	Workstream	Primary outcome
1	Corporate Website	Conversion-optimized public site with portfolio, process, and lead capture
2	Admin Portal	Self-serve CMS for properties, media, testimonials, team
3	Construction PM App	Kanban-driven project tracking with phases, tasks, materials, inventory
4	Social & Marketing Ops	Brand voice, content calendar, drip emails, and KPI reporting
2.5 Workstream 1 — Corporate Website
In scope
•	Information architecture across Home, About, Portfolio, Property Detail, Services, Process, Contact, and Testimonials.
•	Brand-aligned visual design system: deep navy / charcoal, champagne gold accent, warm stone neutrals; serif display + sans-serif body pairing.
•	Component library: header, footer, hero, featured properties, process steps, testimonial carousel, CTA bands, property grid, property filter, gallery/lightbox.
•	Filterable portfolio (Contemporary, Traditional, Mountain, Coastal, Transitional, Farmhouse) with lazy-loaded imagery.
•	Individual property detail pages with image gallery, specs (sq ft, beds, baths, year, location, style), description, and inquiry CTA.
•	Lead capture form with name, email, phone, budget range, and message, integrated with email delivery and a CRM-ready handoff.
•	SEO foundation: per-page titles & meta descriptions, Open Graph tags, JSON-LD (LocalBusiness, RealEstateAgent), sitemap, robots.txt, image alt text.
•	Core Web Vitals targets: LCP under 2.5s, CLS under 0.1, INP under 200ms.
•	Accessibility: WCAG 2.1 AA, keyboard navigation, visible focus states, reduced-motion support.
•	Responsive across 375px, 768px, 1280px, 1440px breakpoints.
•	Analytics: Google Analytics 4 + Vercel Analytics with conversion event configuration.
Out of scope (this workstream)
•	E-commerce or transactional checkout.
•	Multilingual or multi-region content.
•	Client portal / authenticated client dashboards (treated separately if requested).
Deliverables
•	Production website deployed on Vercel (or Azure Static Web Apps) with CI/CD from GitHub.
•	Design system documented in Figma + code (Tailwind tokens).
•	Component library in code with Storybook-style usage notes.
•	SEO checklist signed off and analytics dashboards live.
2.6 Workstream 2 — Admin Portal
In scope
•	Authenticated portal at admin.sh-builders.com (or /admin route group) with email/password login and optional MFA.
•	Property CRUD: create, edit, publish/unpublish, archive; rich-text descriptions; style tags; SEO override fields.
•	Photo upload pipeline: drag-and-drop multi-image upload, server-side EXIF stripping, three size variants (thumb 400px, medium 1200px, full 2400px), WebP conversion with original as fallback, max 20MB per file.
•	Media library: masonry grid, search by filename / alt text, filter by usage and property, in-place alt-text editing.
•	Testimonial manager and team manager (bios, headshots, display order).
•	Role-based access: Admin (full) and Editor (content only).
•	Activity log of who changed what, with timestamps.
•	Public read API used by the corporate website to render published content.
Recommended fast path
If time-to-value is the priority, the Partner recommends standing up Sanity Studio with schemas for property, mediaAsset, testimonial, and teamMember. This removes the need to build authentication, image pipeline, and CRUD screens from scratch and shortens the workstream by approximately three weeks. Sanity's free tier supports the team size and traffic profile of SH Builders for the foreseeable future. The custom Next.js + Prisma + Postgres path remains available if data ownership requirements rule out a managed CMS.
Deliverables
•	Deployed admin portal with at least two seeded users (Admin, Editor).
•	Documented schema (TypeScript interfaces) and API routes.
•	Migration of any existing property data into the new schema.
•	Editor-facing how-to guide and 60-minute training session, recorded.
2.7 Workstream 3 — Construction PM App
In scope
•	Project Dashboard listing all active builds with status, current phase, % complete, next milestone.
•	Per-project Kanban board with columns: Not Started, Todo, In Progress, Blocked, Completed.
•	Task cards: title, description, phase, assignee, priority, due date, tags, attachments, estimated and actual hours.
•	Construction phases (site prep, foundation, framing, roofing, MEP, insulation, drywall, finishes, fixtures, exterior, punch list, closeout) with phase-level progress and date tracking.
•	Materials list per project: quantity needed/ordered/on-site/installed, supplier, expected delivery, order status (not_ordered, quote_requested, ordered, partially_delivered, delivered, installed, returned).
•	Inventory view across projects: what's on-site, what's pending delivery, what's needed.
•	Activity log per project: status changes, comments, assignments, with author and timestamp.
•	Mobile-friendly UI for field use on phone/tablet — read and update tasks from the job site.
•	Read-only subcontractor view: shareable link scoped to that sub's tasks for a given project.
•	Notifications: due-soon and overdue alerts via email (Slack integration optional).
•	File attachments on tasks (drawings, RFIs, photos) backed by Azure Blob Storage.
Out of scope (this workstream)
•	Accounting / invoicing / payroll integration.
•	Bid management or estimate-generation tooling.
•	Client-facing portal (planned as a possible Phase 2 add-on).
Deliverables
•	Deployed PM application (web, mobile-responsive) with seed projects loaded.
•	Schema (TypeScript + Prisma) and REST API documented.
•	Keyboard shortcut reference and field-team quick-start guide.
•	Two training sessions: office team (90 min) and field team (45 min).
2.8 Workstream 4 — Social Media and Marketing Operations
In scope
•	Brand voice and tone guide (elevated, confident, warm, specific, purposeful) with do/don't examples.
•	Five content pillars: Portfolio Showcase, Process & Craft, Lifestyle & Aspiration, Education, Social Proof — each with formats, frequencies, and example posts.
•	Per-platform playbooks: Instagram (4 feed/wk, daily Stories, 2 Reels/wk, weekly Carousel), Facebook (3 feed/wk + albums + ads), TikTok (3–5 videos/wk).
•	Caption and hook formulas, hashtag strategy across brand / local / craft / discovery buckets.
•	Email marketing: monthly newsletter template; six-step welcome drip (Day 0, 3, 7, 14, 21, 30); list segmentation (cold leads, warm leads, past clients, VIP prospects).
•	Property launch campaign blueprint: teaser → launch day → long-tail (2–4 weeks).
•	UTM tracking convention so social and email traffic is attributable in GA4.
•	Monthly KPI report template covering reach, engagement, follower growth, leads generated, and what's planned for next month.
•	Initial 60-day editorial calendar populated with concrete posts.
Out of scope (this workstream)
•	Ongoing managed posting beyond the initial 60-day calendar (available as retainer if requested).
•	Paid media spend (the Partner sets up and trains; SH Builders funds and approves spend).
•	Influencer / partnership negotiation.
Deliverables
•	Brand voice and content guide (PDF + Notion).
•	60-day editorial calendar in Airtable or Notion, fully populated.
•	Templates: caption skeletons, hook bank, hashtag sets, email layouts.
•	Mailchimp / Klaviyo account configured: drip sequence live, segments created, brand templates uploaded.
•	Meta Pixel and GA4 events instrumented and verified.
2.9 Cross-Cutting Out-of-Scope
•	ERP, accounting, or HR systems.
•	Custom mobile applications (iOS/Android binaries). All apps in scope are web-based and mobile-responsive.
•	Hardware procurement (cameras, drones, on-site networking).
•	Photography and videography production (the Partner can recommend vendors).
•	Long-term content production beyond the initial 60-day editorial calendar.
2.10 Assumptions
•	SH Builders will identify a single internal sponsor ("Project Owner") empowered to make decisions and approve milestones.
•	SH Builders will provide brand assets (logo files, existing photography, client testimonials, awards) within two weeks of kickoff.
•	Existing domains, DNS, and email infrastructure are accessible to the Partner during configuration.
•	The current prototype at sh-builders.vercel.app reflects the agreed visual direction; major redesign is not part of this engagement.
•	Hosting accounts (Vercel, Azure, Sanity, Mailchimp/Klaviyo, Meta Business Suite) will be created in SH Builders' name and ownership.
2.11 Dependencies
Dependency	Owner	Needed by
Brand assets (logos, fonts, colors confirmed)	SH Builders	Week 1
Property photography & content for first 6 portfolio entries	SH Builders	Week 3
Domain access (DNS / email)	SH Builders	Week 4
Hosting & CMS account creation (Vercel, Sanity, etc.)	Partner, with SH Builders sign-in	Week 1
Initial subcontractor & supplier list for PM app seeding	SH Builders	Week 5
Marketing platform credentials (Meta, GA4, Mailchimp)	SH Builders	Week 6
2.12 Constraints
•	All systems hosted in commercial cloud regions appropriate to U.S. operations; no on-prem deployment.
•	Image and personally-identifiable data must be handled per the privacy posture defined in Section 3.7 (EXIF stripping, scoped access, audit logging).
•	All third-party services in use must offer at least a 99.9% SLA on their paid tiers.
2.13 Success Criteria and KPIs
Workstream	KPI	Target (first 90 days post-launch)
Corporate Website	Qualified contact form submissions / month	Baseline +50% vs current
Corporate Website	Core Web Vitals (LCP / CLS / INP)	All "Good" on mobile and desktop
Admin Portal	Time to publish a new property	< 30 minutes self-serve
Admin Portal	Engineering tickets for content changes	Reduced to zero
PM App	Active builds tracked in the system	100% of in-flight projects
PM App	Tasks updated within 24h of change	> 90%
Marketing	Email open rate / click-through rate	Open > 35%, CTR > 4%
Marketing	Instagram reach growth	+10% MoM
Marketing	Attributed leads from social/email	Tracked end-to-end via UTMs
 
3. Detailed Project Plan
3.1 Delivery Approach
Delivery follows a hybrid agile model: a short upfront Discovery to lock scope and design decisions, followed by two-week build sprints across all four workstreams running in parallel. Each sprint ends with a working demo and a formal acceptance step, which keeps risk visible and prevents big-bang surprises at the end. A final Stabilization sprint covers bug fixes, performance tuning, training, and handover before formal go-live.
3.2 Phase Breakdown
Phase	Duration	Outcome
P0 — Discovery & Alignment	2 weeks	Signed-off scope, design system, technical architecture, sprint backlog
P1 — Design & Foundations	2 weeks	Visual design + tech foundations: repos, CI/CD, hosting, base components
P2 — Build Sprint 1	2 weeks	Corporate website pages built; Admin portal property CRUD; PM app project + kanban skeleton; Brand voice and content pillars finalized
P3 — Build Sprint 2	2 weeks	Portfolio + property detail pages; Media library + photo pipeline; Tasks + phases on PM app; First IG/FB/TikTok posts live
P4 — Build Sprint 3	2 weeks	Lead form + analytics; Testimonials + team; Materials + inventory; Email drip sequence live
P5 — Build Sprint 4	2 weeks	SEO finalization; Subcontractor view; Activity log; Notifications; Property launch campaign rehearsal
P6 — Stabilization & Launch	2 weeks	UAT, performance tuning, training, content load, go-live, handover
3.3 Master Timeline (14-Week Indicative Schedule)
Weeks indicate calendar weeks from kickoff. Workstreams progress in parallel.
Weeks 1–7
Workstream	W1	W2	W3	W4	W5	W6	W7
Corporate Website	Discovery	Discovery	Design	Design	Build	Build	Build
Admin Portal	Discovery	Discovery	Foundations	Foundations	Property CRUD	Property CRUD	Media Library
PM App	Discovery	Discovery	Schema	Foundations	Project + Kanban	Project + Kanban	Tasks + Phases
Social & Marketing	Voice + Pillars	Voice + Pillars	Calendar setup	Calendar setup	First posts	First posts	Drip build
Weeks 8–14
Workstream	W8	W9	W10	W11	W12	W13	W14
Corporate Website	Build	Build	Build	Build	Build	Stabilize	Launch
Admin Portal	Media Library	Test/Team	SEO Fields	Roles + Audit	Migration	UAT	Launch
PM App	Tasks + Phases	Materials	Inventory	Sub View + Notif	Mobile QA	UAT	Launch
Social & Marketing	Drip build	Newsletter 1	Newsletter 1	Launch campaign	Launch campaign	Reporting setup	Launch
3.4 Workstream-Level Plans
Corporate Website
Sprint	Deliverables	Acceptance
P1 Design	Final visual design in Figma, design tokens, component library kickoff	Stakeholder sign-off on Home + Portfolio + Property Detail comps
P2 Build	Header, Footer, Home, About, Services, Process pages; base components	Pages render at all four breakpoints; passes axe accessibility scan
P3 Build	Portfolio grid + filters; property detail; gallery/lightbox	Six seed properties browseable end-to-end
P4 Build	Contact form, CRM integration, GA4 events, OG tags, sitemap, robots.txt	Lead form delivers to CRM/email; analytics events confirmed in GA4
P5 Build	JSON-LD schema, performance tuning, Lighthouse pass	LCP < 2.5s, CLS < 0.1, INP < 200ms on mobile + desktop
Admin Portal
Sprint	Deliverables	Acceptance
P1 Foundations	Auth, schema migration, base layout (sidebar, top nav)	Admin + Editor users can log in; CSRF + session expiry verified
P2 Property CRUD	Property list, editor with rich text, slug, style tags, status	Create/edit/publish flow works end-to-end with live preview link
P3 Media Library	Photo upload, EXIF strip, WebP conversion, three size variants	10 test uploads land with thumb/medium/full URLs and correct alt text
P4 Testimonials + Team	Testimonial manager, team bios, display order	Items appear correctly on website after publish
P5 Roles + Audit	Editor role permissions; activity log	Role enforcement spot-checked; audit log shows all admin actions
Construction PM App
Sprint	Deliverables	Acceptance
P1 Foundations	Schema, auth, project dashboard skeleton	User can log in and see seeded projects
P2 Kanban	Project detail with kanban (Not Started / Todo / In Progress / Blocked / Completed)	Drag-and-drop persists across reloads
P3 Tasks + Phases	Task cards, task drawer, phase grouping, progress bar	Phase % complete updates as tasks move; due dates and priorities visible
P4 Materials + Inventory	Materials per project, inventory view across projects	Order status transitions; quantities reconcile (needed - ordered - on-site - installed)
P5 Mobile + Sub View + Notif	Mobile responsive QA, read-only subcontractor link, due/overdue email alerts	Field test: foreman updates 3 tasks from phone; sub link scoped correctly
Social and Marketing Operations
Sprint	Deliverables	Acceptance
P1 Foundations	Brand voice guide, content pillars, hashtag bank, hook library	Voice guide approved by SH Builders
P2 Calendar	Notion/Airtable calendar, first 30 days populated, scheduling tool connected	First week of posts scheduled and live
P3 Drip + Templates	Welcome drip (Day 0, 3, 7, 14, 21, 30), monthly newsletter template	Test send from Mailchimp/Klaviyo passes spam check; drip triggers correctly
P4 Property Launch	Property launch playbook + first dry run (teaser → launch → long-tail)	Playbook executed against one current build; metrics captured
P5 Reporting	GA4 + Meta Business Suite dashboards; UTM convention; monthly report template	Lead attributed end-to-end from Instagram → website → contact form
3.5 Team Structure and RACI
R = Responsible, A = Accountable, C = Consulted, I = Informed.
Activity	Project Owner (SH)	Engineering Lead (Partner)	Design Lead (Partner)	Content Lead (Partner)	Field Foreman (SH)
Scope & milestone sign-off	A	C	C	C	I
Visual design	C	I	R/A	C	I
Website build & deployment	I	R/A	C	I	I
Admin portal build	I	R/A	C	I	I
PM app build	C	R/A	I	I	C
Brand voice & content calendar	C	I	C	R/A	I
Email drip & newsletter	C	I	C	R/A	I
Field-team UX of PM app	C	C	I	I	R
Go-live decision	A	C	C	C	C
3.6 Tooling and Environments
Layer	Choice	Rationale
Website framework	Next.js (App Router) or Astro	SSG performance + strong SEO; matches the prototype direction
Styling	Tailwind CSS	Utility-first; matches design tokens cleanly
CMS	Sanity.io (recommended)	Fastest path; team-friendly editing; integrates with Next.js via next-sanity
Admin auth	Clerk or NextAuth.js v5	Clerk simplifies MFA + roles; NextAuth if SH Builders prefers self-host
Image storage	Cloudinary or Azure Blob + CDN	Auto-resize, WebP, signed URLs
PM database	PostgreSQL (Neon or Azure DB)	Relational fit for tasks/phases/materials; backups out-of-the-box
ORM	Prisma	Type-safe schema + migrations
Drag-and-drop	@dnd-kit/core	Accessible, modern, well-maintained
Hosting	Vercel (web/admin) + Azure App Service (PM app)	Best-in-class DX for Next.js; Azure aligns with SH Builders' likely Microsoft footprint
Email	Resend (transactional) + Mailchimp/Klaviyo (campaigns)	Resend for forms; Mailchimp/Klaviyo for drips and newsletter
Analytics	Google Analytics 4 + Vercel Analytics + Meta Pixel	End-to-end attribution
Editorial calendar	Notion or Airtable	Lightweight, easy collaboration
Scheduling	Later or Buffer	Multi-platform scheduling + analytics
Environments: Local → Preview (per pull request) → Staging → Production. All four products use the same promotion model with protected main branches and required review.
3.7 Quality Assurance Plan
•	Automated: unit tests on critical logic (auth, image pipeline, kanban state, materials math); component snapshot tests; type-checks (TypeScript strict).
•	End-to-end: Playwright smoke tests for the lead form, login, property publish, task move, photo upload.
•	Performance: Lighthouse CI on every deploy; budget enforcement on JS payload and image weight.
•	Accessibility: axe-core scans in CI; manual keyboard pass on each release.
•	Security: dependency audit on every build; secrets in vaulted env vars only; CSRF on all admin forms; file-type and size validation on uploads; signed URLs for media.
•	UAT: each sprint demo doubles as a UAT checkpoint; final UAT in P6 covers full user journeys for office and field teams.
3.8 Risk Register
Risk	Likelihood	Impact	Mitigation
Photography or content not ready when needed	Medium	High	Lock content needs in Discovery; use placeholder seed data; escalate at weekly review if slipping
Scope expansion (e.g., client portal, accounting)	Medium	Medium	Formal change-control process; out-of-scope items logged for Phase 2 backlog
Field team adoption of PM app is slow	Medium	High	Co-design with foreman in Discovery; mobile-first build; on-site training during Stabilization
Decision-maker availability	Low	High	Single empowered Project Owner; weekly 30-min status; escalation path defined upfront
Third-party outage (Sanity, Vercel, Mailchimp)	Low	Medium	Multi-provider envelope; backups; documented incident playbook
SEO regression on launch	Low	Medium	301 map for any changing URLs; pre-launch crawl + post-launch monitoring
Data migration errors (existing properties)	Low	Medium	Staged migration with sample set first; rollback plan; manual spot-check before cutover
3.9 Change Management
Any request that adds scope, moves a milestone, or changes an acceptance criterion is captured as a Change Request. The Partner provides an impact assessment within two business days; SH Builders' Project Owner approves or defers. Approved Change Requests are appended to the scope log and reflected in the next sprint plan.
3.10 Governance and Cadence
Ceremony	Cadence	Participants	Output
Daily async standup	Daily, written	Partner team	Slack/Teams thread
Weekly status review	Mondays, 30 min	Project Owner + Partner leads	Status doc + risk update
Sprint demo	End of every 2 weeks	Project Owner + relevant SH Builders SMEs	Demo recording + acceptance sign-off
Sprint planning	Start of every 2 weeks	Partner team + Project Owner	Updated sprint backlog
Steering meeting	Monthly, 60 min	SH Builders leadership + Partner principal	Strategic decisions, scope changes
3.11 Acceptance Criteria
Each workstream has a defined Definition of Done. The engagement is considered complete when all four are accepted and the handover artifacts in Section 4.6 have been delivered.
Definition of Done — Corporate Website
•	All in-scope pages live on production domain.
•	Lighthouse mobile + desktop scores: Performance, Accessibility, Best Practices, SEO all ≥ 90.
•	Lead form delivers to CRM/inbox; tested end-to-end.
•	Analytics events firing (page view, contact submission, portfolio view).
•	JSON-LD validates against schema.org (LocalBusiness, RealEstateAgent).
Definition of Done — Admin Portal
•	Admin and Editor roles enforce permissions correctly.
•	All existing properties migrated and visible.
•	Photo upload pipeline produces three variants and strips EXIF on test set.
•	Two-user training delivered and recorded.
Definition of Done — Construction PM App
•	All current active projects loaded with at least their current phase + key tasks.
•	Foreman successfully completes a real on-site task update from a mobile device.
•	Materials inventory reconciles for at least one in-flight project.
•	Subcontractor read-only link tested with one trade partner.
Definition of Done — Marketing Operations
•	60-day editorial calendar populated and approved.
•	Welcome drip live; tested with internal email.
•	First newsletter sent successfully.
•	GA4 + Meta dashboards show end-to-end attribution for at least one campaign.
 
4. Proposal
4.1 Why this matters now
Every season SH Builders runs without a strong digital presence is a season of lost qualified leads — buyers who are researching builders on Instagram and Google and won't make it to the call. Every active build run on spreadsheets and texts is a coordination tax paid in foreman time and material errors. The work proposed here is not a vanity rebuild; it is the operating system the business needs to scale the next decade of builds without scaling overhead at the same rate.
4.2 Our Approach
Three principles guide this engagement:
1. Ship working software every two weeks
Every two weeks, SH Builders will see real, demoable progress in a staging environment — not slides about progress. This keeps risk visible and makes course correction cheap.
2. Build for the team that will run it
The systems are designed for the actual humans who will use them: a foreman with muddy gloves on a phone, an office manager adding a new property between calls, a marketing lead who needs to send a newsletter without help. Adoption is the success metric, not feature count.
3. Own the platform, rent the plumbing
All accounts (hosting, CMS, email, analytics) are created in SH Builders' name. Code lives in an SH Builders GitHub organization. The Partner is the implementer, not a gatekeeper. If SH Builders ever wants to take over operations or change vendors, there is no lock-in.
4.3 Why Us
•	Demonstrated direction. The prototype at sh-builders.vercel.app already proves visual fit and feasibility — there is no learning curve on aesthetic.
•	End-to-end depth. One Partner team owns design, front-end, back-end, content systems, and marketing operations, eliminating handoff seams between vendors.
•	Construction-domain understanding. The PM app schema and phase taxonomy in this document reflect how custom homes actually get built (not generic project management).
•	Operating discipline. Every commitment in this document is testable, with named owners and dates. No vague "we'll figure it out."
4.4 Engagement Model
Aspect	Detail
Engagement type	Fixed-scope, fixed-timeline delivery (commercials addressed in a separate Statement of Work)
Duration	14 weeks (Discovery → Stabilization & Launch)
Sprint length	2 weeks
Delivery model	Remote with on-site visits at kickoff, design sign-off, and go-live
Communication	Shared Slack/Teams channel + weekly written status + sprint demos
Code & assets	All source in SH Builders' GitHub org, all accounts in SH Builders' name
Post-launch support	30-day stabilization included; optional retainer thereafter
4.5 Communication and Reporting
•	A shared Slack or Teams channel for day-to-day questions; expected response within 4 working hours.
•	A short written status every Monday: what shipped, what's planned, what's blocked, key decisions needed.
•	A live sprint demo every two weeks, recorded, with explicit acceptance from the Project Owner.
•	A monthly steering meeting with SH Builders leadership covering scope, risk, and any change requests.
4.6 Knowledge Transfer and Handover
By the end of the engagement, SH Builders will own:
•	All source code in SH Builders' GitHub organization, with README and contributor docs.
•	All accounts (Vercel, Sanity, Cloudinary, Mailchimp/Klaviyo, GA4, Meta Business Suite) in SH Builders' name.
•	A runbook covering deploy, rollback, common admin tasks, and on-call escalation.
•	Recorded training sessions for office team, field team, and marketing lead.
•	A 30-day post-launch backlog already triaged with priorities.
4.7 Next Steps
1.	Confirm the workstreams and scope captured in Section 2 are correct.
2.	Identify the Project Owner and any subject-matter experts who will participate in Discovery.
3.	Sign the Statement of Work that accompanies this document (separate, covering commercials and contracting).
4.	Schedule a kickoff workshop (half day, on-site preferred) to start Discovery.

On signature, the Partner can begin Discovery within five business days.
 
Appendix A — Tech Stack Summary
A consolidated view of the technology selections referenced throughout this document.
Workstream	Layer	Selection
Corporate Website	Framework	Next.js (App Router) or Astro
Corporate Website	Styling	Tailwind CSS
Corporate Website	Hosting	Vercel
Corporate Website	Forms / email	React Hook Form + Resend
Corporate Website	Analytics	GA4 + Vercel Analytics
Admin Portal	Stack (recommended)	Sanity Studio + next-sanity
Admin Portal	Stack (alternative)	Next.js + Prisma + Postgres + Clerk
Admin Portal	Image storage	Cloudinary or Azure Blob + CDN
PM App	Frontend	Next.js or React + Vite
PM App	UI	Tailwind + shadcn/ui + @dnd-kit/core
PM App	Backend / DB	Next.js API + Prisma + PostgreSQL
PM App	Auth	Clerk or NextAuth
PM App	File storage	Azure Blob Storage
Marketing	Email	Mailchimp or Klaviyo
Marketing	Scheduling	Later or Buffer
Marketing	Editorial calendar	Notion or Airtable
Marketing	Ads + analytics	Meta Business Suite + GA4
 
Appendix B — Glossary
Term	Meaning
Phase	A major construction stage (e.g., Foundation, Framing, MEP)
Task	A unit of work within a phase, tracked on the kanban board
Material	A specific item required for a task or phase, with quantity tracking
MEP	Mechanical, Electrical, Plumbing rough-in
EXIF	Metadata stored in a photo file (camera, GPS, date) — stripped on upload for privacy
WebP	Modern image format with better compression than JPEG/PNG
UTM	URL parameters used to attribute traffic to a specific source/medium/campaign
Drip sequence	An automated series of emails triggered when a lead enters the list
Pillar	A category of content with a consistent purpose and tone
LCP / CLS / INP	Google's Core Web Vitals — Largest Contentful Paint, Cumulative Layout Shift, Interaction to Next Paint
 
Confidentiality
This document is confidential and is provided for the sole purpose of evaluation by SH Builders. It contains proposed approaches, data structures, and operational practices that represent the Partner's professional work product. Distribution outside of SH Builders' authorized review team requires written consent.
