# BRIT T&L Development Studio — Handover

This document is for whoever takes over the BRIT T&L Development Studio. It
explains what the system is, where every part lives, and exactly what to do so
nothing is lost when the current owner leaves. **It contains no passwords or
keys** — only what to do and who to ask.

Keep this file up to date. Fill in the **> FILL IN** placeholders.

---

## 1. What it is

A web app for teacher development built around the BRIT framework (four areas:
**Belonging, Room, Intent, Travel**). Staff complete peer reviews, learning
walks, device walks, trustee walks and departmental reviews; they share
practice on a Share Board; SLT and line managers see aggregated pictures.

- **Live site:** https://western-studio.github.io/brit-tl-development-studio/
- **Sign-in:** Google, restricted to `@brit.croydon.sch.uk` **and** to people in
  the staff directory (so students, who share the domain, cannot get in).

## 2. How it is built (the moving parts)

| Part | What it is | Where it lives |
|---|---|---|
| **Code** | Vite + React single-page app (`src/App.jsx`) | GitHub repo `western-studio/brit-tl-development-studio` |
| **Hosting** | Static site auto-deployed on every push to `main` | GitHub Pages (via `.github/workflows/deploy.yml`) |
| **Login** | Google sign-in, school-domain locked | Firebase Authentication |
| **Database** | All reviews, posts, drafts and the staff directory | Firebase Firestore, project **`brit-tl-studio`** |
| **Assistant** (optional) | Chat helper | Needs a small backend proxy holding an Anthropic API key (`VITE_CHAT_PROXY_URL`); off unless configured |

**Firestore collections:** `submissions` (reviews & walks), `reflections`
(share-board posts), `drafts` (private per-user), `staff` (the directory:
role, department, line manager, T&L flag, form invites).

## 3. Accounts you must have access to

> FILL IN the account names/owners for your school.

- **Firebase / Google Cloud** project `brit-tl-studio` — currently owned by
  **> FILL IN (the school Google account that created it)**.
- **GitHub** repo `western-studio/brit-tl-development-studio` — currently under
  **> FILL IN (personal/`western-studio` account)**.
- **A build tool** to make code changes — currently Claude Code, connected to
  the GitHub account above.

---

## 4. Handover checklist (do these before departure)

### 🔴 CRITICAL — Firebase ownership (protects all the data)
The database lives in the Firebase project, which is tied to one Google
account. If that account is deactivated, the project and **all data** can be
lost.

1. Go to https://console.firebase.google.com → project **brit-tl-studio**.
2. ⚙ **Project settings → Users and permissions → Add member**.
3. Add a **school-owned shared/role account** (e.g. a T&L or IT team account,
   not an individual) with the **Owner** role.
4. Confirm the new owner can sign in and see the project.

*Why a shared account: it survives the next person leaving too. Ask IT to
create or nominate one.*

### 🟠 IMPORTANT — App admin continuity
1. Sign in to the Studio → **Manage Staff**.
2. Set your successor (and ideally one more trusted colleague) to
   **role = SLT** and **T&L = yes**.
3. This lets them manage staff, run the year-end archive, and see everything.

### 🟡 Code / development handover
1. **Transfer the GitHub repo** to a school-owned GitHub org, *or* add the
   successor as an owner/collaborator (GitHub repo → Settings → Collaborators,
   or Settings → General → Transfer ownership).
2. If the site's web address changes as a result, two things must be updated:
   - Firebase → **Authentication → Settings → Authorized domains** (add the new
     domain).
   - The app's base path in `vite.config.js` (`base: "/<repo-name>/"`).
3. The successor connects their own build tool (their own Claude Code account,
   or any web developer) to the repo to keep making changes.

### 🟢 Safety net — keep an offline backup
- In **Manage Staff → End of academic year → Download archive (Excel)**, save a
  copy periodically and before any big change. It's a readable, account-
  independent copy of everything.

---

## 5. Keeping it running vs. keeping it changing

- **Running** needs only: the Firebase project alive + at least one SLT/T&L
  admin. The site is static, so it keeps working with no maintenance.
- **Changing** needs: access to the GitHub repo + a developer tool. If nobody
  takes this on, the app simply stays as it is — nothing breaks.

## 6. Roles & permissions (how access works)

Set per person in **Manage Staff**. Role + the T&L flag decide access:

| Role | Can do |
|---|---|
| **Teacher** | Peer review, Share Board, own dashboard |
| **Assistant Director** | + Line Manager view of their own direct reports |
| **Director (HoD)** / **SENCO** | + Departmental Review, Line Manager view of their whole team |
| **SLT** / anyone with **T&L = yes** | Everything, including Manage Staff and all walk forms |

Individuals can also be **invited to specific walks** (e.g. guest reviewers)
via the walk toggles in Manage Staff, regardless of role.

## 7. Common tasks

- **Add/edit staff:** Manage Staff → add a person, or **Import from CSV** (fill
  the Excel template with dropdowns, save as CSV, upload).
- **Remove the demo/sample people:** Manage Staff → **Clear demo staff**.
- **End of year:** Manage Staff → **Archive & reset** (downloads an Excel
  archive + a restore file, then clears reviews and posts; staff are kept).
- **Change who's an admin:** set another person to SLT or T&L = yes.

## 8. Security & data protection notes

- **Never** commit secrets. The Firebase *web* config in `src/firebase.js` is
  public by design and is fine in the repo; a Firebase **service-account key**
  is a real secret and must never be downloaded or committed.
- Access is enforced two ways: the app UI (directory allow-list) **and** the
  Firestore security rules (require a `staff` record on the school domain).
- Real staff data is personal data — keep the school's **DPIA / data-processing**
  records current, and keep the Firebase project owned by a **school** account.

## 9. Who to ask

> FILL IN
- School IT / network lead (Google Workspace, shared accounts): …
- Current/outgoing owner: …
- Anything about how the app was built: this repo's commit history is a full
  record; a developer can pick it up from `src/App.jsx`.
