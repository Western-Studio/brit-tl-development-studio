# BRIT T&L Development Studio (prototype)

A prototype built around the BRIT framework. Staff select a form
(Peer Review or Learning Walk), complete it against the four strands
(Belonging, Room, Intent, Travel) using the developmental descriptors
Developing / Embedded / Transformational, and submit. An SLT view aggregates
the results and lets you pull comments by strand and rating. A process help
bot answers questions about how the framework and the review work.

This is a design and demonstration tool, not deployment-ready infrastructure.
Read the two caveats below before relying on it for anything real.

## What runs, and what does not

**Persistence.** Submissions are stored in the browser via `localStorage`.
That is fine for a demo on a single machine. It is not multi-user and it is
not institutional storage. Clearing site data wipes it.

**The bot.** The help bot needs the Claude API, and the API cannot be called
safely from the browser because that would expose an API key. So the bot is
wired to call a backend proxy at the URL in `VITE_CHAT_PROXY_URL`. If that
variable is not set, everything else in the Studio works and the bot shows a
short message explaining it is not switched on. See "Wiring up the bot" below.

**Placeholder content.** The four strand descriptions, and the sample
submissions on the SLT dashboard, are placeholders. Replace the strand text
in `src/App.jsx` (the `STRANDS` array, and the `BOT_SYSTEM` prompt) with the
real BRIT framework strand definitions. The seed data in the `SEED` array is invented and
can be deleted once real submissions exist.

## Running it locally

Requires Node 18 or newer.

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

## Putting it on GitHub

From this folder, once you have created an empty repository on GitHub:

```bash
git init
git add .
git commit -m "Initial commit: BRIT T&L Development Studio prototype"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/brit-tl-development-studio.git
git push -u origin main
```

If you use the GitHub CLI, `gh repo create brit-tl-development-studio --source=. --push`
does the create and push in one step.

## Wiring up the bot

The browser sends the conversation to your proxy; the proxy adds the API key
and calls Claude. A minimal serverless function (for example on Vercel, as
`api/chat.js`) looks like this:

```js
export default async function handler(req, res) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(req.body),
  });
  const data = await r.json();
  res.status(r.status).json(data);
}
```

Set `ANTHROPIC_API_KEY` as a secret on the host, and set
`VITE_CHAT_PROXY_URL` to the deployed function URL (for local testing, put it
in a `.env.local` file).

A note that connects to the wider plan: standing this up properly, with staff
data and an AI layer, is the point where hosting, a data processing agreement,
and a DPIA come back into play. This proxy is the smallest possible version to
make the prototype's bot respond. It is not the production design.
