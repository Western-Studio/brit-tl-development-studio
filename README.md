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

**Demo content.** The sample submissions on the SLT and line-manager
dashboards are invented (`SEED` in `src/App.jsx`), and the staff directory
(`STAFF`) is a simulation of a BromCom sync — in production, names, levels
and line management would come from the BromCom API and the app would sit
behind staff login. The framework text itself (the `STRANDS` array and the
bot's knowledge) reflects the real BRIT framework.

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

The browser sends the conversation to a proxy; the proxy adds the API key and
calls Claude. The proxy lives in this repo at `api/chat.js` and deploys
automatically when the repo is imported into Vercel. It restricts requests to
known origins (GitHub Pages and localhost), pins the model and token limits
server-side, and never exposes the API key to the browser.

To switch the bot on:

1. Import this repo into Vercel and set `ANTHROPIC_API_KEY` as an environment
   variable there (get a key from console.anthropic.com).
2. Set `VITE_CHAT_PROXY_URL` to the deployed function URL
   (`https://<project>.vercel.app/api/chat`) — as a GitHub Actions repository
   variable for the Pages build, or in a `.env.local` file for local testing.

A note that connects to the wider plan: standing this up properly, with staff
data and an AI layer, is the point where hosting, a data processing agreement,
and a DPIA come back into play. This proxy is the smallest possible version to
make the prototype's bot respond. It is not the production design.
