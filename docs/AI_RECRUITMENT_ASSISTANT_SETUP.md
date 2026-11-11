# Ali Hamza AI Recruitment Assistant — Deployment & Calendar Setup

**Portfolio route:** https://docvelio.com/ali-hamza/  
**Source repository:** https://github.com/Ali-1999/docvelio  
**Worker:** Cloudflare Worker `docvelio`, entry point `src/excel-formula-worker.js`  
**Date:** 11 November 2026

## Implemented in source

- Floating recruiter chat on the standalone portfolio; the Docvelio global header/footer are not injected.
- CV-grounded AI responses using the existing Cloudflare Workers AI binding (`AI`) and Llama 3.1 8B instruct model.
- System instructions prevent invented experience, dates, certifications, salary, notice period, visa sponsorship or unsupported claims.
- Public facts from the supplied 10 November 2026 Full Stack Developer CV and portfolio are embedded in the Worker prompt. It also recognises the warehouse role from the separate CV/portfolio and explicitly avoids inventing an explanation for the overlap between the two roles.
- Recruiter form captures name, work email, company, role, interview type, date and slot.
- Live Google Calendar FreeBusy lookup; 30-minute slots, Monday–Friday, 09:00–17:00 Asia/Riyadh, next 30 days, at least one hour in advance.
- Server rechecks availability immediately before inserting the event. Successful insert sends Google Calendar invitations to recruiter and Ali. Online bookings request a Google Meet conference.
- No interview is reported as booked until Google Calendar returns a successful event response.
- Messages are not persisted by this feature. The browser holds the current chat transcript in memory only. Do not enter sensitive personal data.
- Basic in-memory per-isolate rate limits and request validation are included. Add Cloudflare WAF/rate-limiting rules before heavy public traffic.

## API routes

- `GET /api/recruitment/status` — AI and calendar readiness.
- `POST /api/recruitment/chat` — CV-grounded Q&A.
- `GET /api/recruitment/availability?date=YYYY-MM-DD` — live free/busy-derived slots.
- `POST /api/recruitment/book` — recheck and create an event.

All APIs are served by the existing Cloudflare Worker. `wrangler.jsonc` already routes `/api/*` through the Worker and binds Workers AI as `AI`.

## Required Google Calendar configuration

**Calendar booking is not operational until these Google credentials are configured as Cloudflare Worker variables/secrets.** Never put secrets in GitHub, HTML, browser JavaScript, chat messages or this document.

### 1. Choose the Google account/calendar

Use the Google account whose calendar should control Ali's interview availability. Confirm that this account is the one you intend to use; the candidate contact address in the CV is `alihamzasbr@gmail.com`, but the code does not assume that this mailbox owns the calendar.

Use the calendar ID `primary` if you want the account's primary calendar.

### 2. Enable Google Calendar API

1. Open https://console.cloud.google.com/
2. Create/select a Google Cloud project.
3. Enable **Google Calendar API**.
4. Configure the OAuth consent screen and add the calendar owner as a test user while testing.
5. Create an OAuth Client ID of type **Web application**.
6. For OAuth Playground flow, add `https://developers.google.com/oauthplayground` as an authorised redirect URI.
7. In OAuth Playground settings, enable **Use your own OAuth credentials**, then enter that OAuth Client ID and secret.
8. Authorise the scope `https://www.googleapis.com/auth/calendar` for the calendar owner, exchange the code, and obtain a refresh token.
9. For a durable production integration, publish/configure the OAuth consent screen appropriately. A refresh token issued while an external OAuth app is in Testing can expire after seven days. Google verification may be required depending on the consent-screen configuration and audience.

OAuth Playground: https://developers.google.com/oauthplayground

### 3. Add Cloudflare Worker settings

In Cloudflare Dashboard:

1. Open **Workers & Pages → docvelio → Settings → Variables and Secrets**.
2. Add this non-secret variable:
   - `GOOGLE_CALENDAR_ID` = `primary` (or the exact calendar ID).
3. Add these as **encrypted secrets**, not plain text variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REFRESH_TOKEN`
4. Save changes and redeploy the Worker.

Do not send these credentials to ChatGPT or commit them to the repository. If using Wrangler locally, use `wrangler secret put` for each secret and enter the value only in your own terminal.

## Production verification checklist

After secrets are set and the Worker is redeployed:

1. Open `https://docvelio.com/ali-hamza/` and confirm the **Ask Ali's AI** launcher appears.
2. Ask: “Summarise Ali's professional experience.” Verify the answer is CV-grounded.
3. Open the interview booking form and choose a weekday within the next 30 days.
4. Confirm the slot list changes based on actual Google Calendar busy periods.
5. Create a controlled test booking using an email address you control.
6. Confirm the event exists in the selected Google Calendar and invitation emails reach both attendees.
7. Confirm an Online booking has a Google Meet link; if Google does not return one, do not promise a meeting link.
8. Test a conflicting slot, invalid email, weekend, past date, and calendar API outage. None may be reported as booked.
9. Delete the test event after verification.

## Known limits / honest status

- GitHub source changes do not, by themselves, prove the Cloudflare deployment has completed.
- This integration uses the existing Workers AI binding. If that binding is disabled or its model quota is exhausted, chat returns a service error rather than fabricating an answer.
- Calendar booking requires the three OAuth secrets and calendar ID above. Until then, chat can answer CV questions but the booking form will show that calendar setup is pending.
- Availability is displayed in Asia/Riyadh time, not the recruiter's local timezone.
- The app does not yet have a separate admin dashboard, recruiter CRM, persistent chat history, or email-based custom reminder workflow. Google Calendar is the booking record.
- The supplied Full Stack CV lists Degenrex as Aug 2024–Present, while the separate warehouse CV/portfolio lists Lx Pantos as Jun 2026–Present. The assistant is instructed to disclose that both appear in the supplied materials and not speculate about the arrangement.


## Response performance monitoring

The assistant includes optional, privacy-minimised performance instrumentation for the Cloudflare Analytics Engine dataset `recruitment_performance`. The deployment does not require this account feature to be enabled: chat and booking continue to work without the optional dataset.

Recorded for each chat request:
- Status: success or error.
- Time to first generated token (milliseconds).
- Total time until the stream finishes (milliseconds).
- Response character count.
- Model identifier and feature label.

The monitoring endpoint does **not** collect recruiter questions, generated answer text, names, email addresses, IP addresses or booking details. A metric is sent after each chat request; it does not delay displaying the answer.

### Enable and inspect

The `RECRUITMENT_ANALYTICS` binding is intentionally omitted from the current `wrangler.jsonc` because Cloudflare returned API error 10089 when the account feature was disabled. This prevents an optional monitoring service from blocking production deployments. Chat and booking remain available; metrics are not persisted while the binding is absent. To restore monitoring later, enable Analytics Engine for the Cloudflare account, add the binding in `wrangler.jsonc`, and redeploy. The API status response exposes `analyticsConfigured` so this can be checked.

### Metric fields

- `blob1`: feature (`chat`)
- `blob2`: result (`success` or `error`)
- `blob3`: model identifier
- `double1`: time to first token in milliseconds
- `double2`: total response time in milliseconds
- `double3`: response character count
- `index1`: `portfolio`

Use the dataset's SQL/API explorer to calculate request count, error rate, average and P95 for `double1` and `double2`. Treat the three-second first-token objective as achieved only after a meaningful live sample confirms it.
