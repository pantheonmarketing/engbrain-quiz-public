# Engbrain Quiz Worker

Mobile-first Engbrain Kids Phonics Academy quiz for KruBow. The frontend lives in `public/` and a Cloudflare Worker handles secure lead capture at `/api/lead`.

## What this app does

- Shows a React quiz loaded from CDN scripts in `public/index.html`.
- Routes parents, moms, and teachers through the quiz/contact flow.
- Recommends an Engbrain course in `public/src/results.jsx`.
- Submits lead data to the Worker endpoint `/api/lead`.
- Stores leads in Cloudflare KV.
- Sends a Telegram notification from the Worker, not from the browser.
- Scores each lead as HOT, WARM, or NURTURE for the sales team.
- Adds a sales angle, next action, and suggested reply so staff can follow up without re-asking the same qualifying questions.

## Sales workflow

The quiz is designed to replace repetitive intake questions in Messenger/LINE/phone follow-up.

When a parent finishes the quiz, the Worker now creates a sales qualification block:

- **Priority**: HOT, WARM, or NURTURE based on timeline, preferred format, budget, goals, and whether LINE was captured.
- **Summary**: quick read of why the lead matters, e.g. ready now, wants 1:1, budget range, goal.
- **Sales angle**: how to position the recommended course from the quiz result.
- **Next action**: whether to call fast, send helpful explanation, or use a lower-pressure nurture follow-up.
- **Suggested reply**: a ready-to-send opener personalized with the parent/child name and recommended course.

Salespeople should use the quiz result as the opener:

> “Hi Nok, thanks for completing the Engbrain quiz. Based on Prim’s answers, KruBow recommends Jolly Phonics Level 1…”

This keeps the conversation consultative while moving straight to the best-fit course instead of repeating the whole questionnaire.

## Local development

Install dependencies once:

```bash
npm install
```

Run tests:

```bash
npm test
```

Run with Wrangler so `/api/lead` is available locally:

```bash
npm run dev
```

Static-only preview, without the Worker API:

```bash
npm start
```

## Required Cloudflare setup

### 1. Rotate the old Telegram bot token

A Telegram bot token was previously exposed in frontend JavaScript. Treat it as compromised and rotate it in BotFather before deploying this version.

### 2. Create KV namespaces

```bash
npx wrangler kv namespace create LEADS_KV
npx wrangler kv namespace create LEADS_KV --preview
```

Copy the returned IDs into `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "LEADS_KV"
id = "...production id..."
preview_id = "...preview id..."
```

### 3. Set Worker secrets

```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
```

Recommended chat ID is the private/internal KruBow/Jonny lead alert destination, not a public group.

## Deploy

```bash
npm run deploy
```

After deployment, verify:

- The quiz loads.
- Completing the contact form returns a successful `/api/lead` request in the browser network tab.
- A Telegram alert arrives.
- A lead record appears in KV with a `lead:` key.
- The deployed frontend source no longer contains `api.telegram.org/bot`.

## Security notes

- Do not put Telegram bot tokens, Cloudflare API tokens, or chat secrets in frontend files.
- The frontend sends only quiz data to `/api/lead`.
- The Worker sanitizes expected fields, stores the lead in KV, and sends Telegram server-side.
- Rate limit is 5 submissions per IP per 15 minutes using KV bucket keys.

## Key files

- `wrangler.toml` - Worker, static assets, KV binding config.
- `src/worker.js` - `/api/lead`, KV storage, rate limiting, Telegram notification.
- `public/src/app.jsx` - quiz orchestration and frontend lead submit.
- `public/src/quiz.jsx` - quiz questions and contact form.
- `public/src/results.jsx` - result matching and CTAs.
- `test/worker.test.js` - Worker behavior tests.
