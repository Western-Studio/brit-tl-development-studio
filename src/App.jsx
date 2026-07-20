import React, { useState, useEffect, useRef } from "react";
import {
  Home, ClipboardList, Users, BarChart3, MessageCircle, Send, X,
  ArrowLeft, ArrowRight, ArrowUpRight, Plus, ShieldAlert, CheckCircle,
  ChevronDown, Sparkles, Search, Bot, Lock, GraduationCap, ClipboardCheck
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend
} from "recharts";

/* ------------------------------------------------------------------ *
 *  BRAND + FRAMEWORK CONSTANTS
 * ------------------------------------------------------------------ */
const BRAND = {
  magenta: "#AD227E",
  pink: "#F8F1F6",
  green: "#46B749",
  ink: "#2A1E27",
  grey: "#6B5E66",
  line: "#EADCE6",
  developing: "#B9A7B4",   // soft, neutral — not a "fail" red
  embedded: "#AD227E",     // brand magenta
  transformational: "#46B749", // brand green
};

// The BRIT framework — its four areas ("strands" is reserved for departments).
// "What can you see, hear, and how does it feel?"
const STRANDS = [
  {
    key: "Belonging",
    letter: "B",
    accent: "#AD227E",
    pastel: "#F8E9F2",
    focus: "Inclusion and culture",
    ts: "TS 1 · 5",
    desc: "Inclusion and culture — every student is known, expected, and safe enough to take creative risks.",
    practice: [
      "Every student is known and greeted — nobody is invisible at the back",
      "Access is proactively planned for neurodiversity and quiet learners",
      "The room reflects who is in it: identities, voices, a range of work on show",
      "It is safe to take creative risks — and to fail",
      "Names are used — in greetings, questions and feedback",
      "Every voice is drawn in, not just the confident ones",
    ],
    research: [
      { name: "Psychological safety — Amy Edmondson", note: "An environment free from interpersonal fear, so students will experiment creatively." },
      { name: "Attachment & trauma-informed pedagogy", note: "Relational security as the foundation for academic and artistic engagement." },
    ],
    levels: {
      Developing: "Warm moments are appearing. Some students are known and greeted; a few can still drift to the edges unseen.",
      Embedded: "Every student is known, greeted and expected. Access for neurodiversity and quieter learners is planned as a matter of routine.",
      Transformational: "The room visibly reflects who is in it — identities, voices and work on show — and it is genuinely safe to take creative risks and fail.",
    },
  },
  {
    key: "Room",
    letter: "R",
    accent: "#8447B0",
    pastel: "#F2ECF8",
    focus: "The physical and digital environment, and how it is used",
    ts: "TS 5 · 7",
    desc: "The physical and digital environment — the space works for the task before learning starts.",
    practice: [
      "The spatial layout actively fits the technical and creative task",
      "Sightlines work — everyone can see the board, screen, device or demonstration",
      "Resources, cables, floor space and kit are safe, accessible and ready",
      "The environment is set before learning starts, not during it",
      "Digital tools genuinely support the task, not distract from it",
      "Transitions are quick — no learning time lost to the space",
    ],
    research: [
      { name: "Reggio Emilia — the “third teacher”", note: "The physical environment as a teacher in its own right. Rooted in Early Years, highly relevant to 14–19 studio pedagogy." },
      { name: "Vocational studio ergonomics", note: "Industry-standard workspace setups that build professional accountability, health and safety awareness, and technical discipline." },
    ],
    levels: {
      Developing: "The space is functional, but layout or resources sometimes work against the task — set-up can eat into learning time.",
      Embedded: "The layout fits the technical and creative task, sightlines work for everyone, and kit is safe, accessible and ready before learning starts.",
      Transformational: "The room works as a third teacher — an industry-standard environment that students help to own, run and reset.",
    },
  },
  {
    key: "Intent",
    letter: "I",
    accent: "#C2651A",
    pastel: "#FAF0E4",
    focus: "Rigour and standards",
    ts: "TS 3 · 4",
    desc: "Rigour and standards — it is transparent what is being learned and why, and excellence is visible in the room.",
    practice: [
      "It is transparent what is being learned and why — not just what is being “done”",
      "Living models of excellence are visible in the room",
      "Professional, vocational and academic standards stay aspirational and rigorous",
      "Pitch stretches the strongest without losing anyone",
      "Success criteria are concrete, not vague",
      "The why connects to industry, audience or assessment",
    ],
    research: [
      { name: "Visible Learning — John Hattie", note: "Clear learning intentions so students can explicitly monitor their own progress." },
      { name: "Expert modelling", note: "Living exemplars of high-level vocational and academic outcomes that scaffold student ambition." },
    ],
    levels: {
      Developing: "Students can say what they are doing, but not always what they are learning — or why it matters — yet.",
      Embedded: "What is being learned, and why, is transparent. Visible models of excellence keep standards aspirational and rigorous.",
      Transformational: "Excellence drives the room. Pitch stretches the strongest without losing anyone, and students hold the standard for themselves.",
    },
  },
  {
    key: "Travel",
    letter: "T",
    accent: "#46B749",
    pastel: "#EAF6EB",
    focus: "Cognitive processing",
    ts: "TS 2 · 4 · 6",
    desc: "Cognitive processing — students do the heavy thinking, feedback lands in the lesson, and progress is visible in the work.",
    practice: [
      "Students do the heavy cognitive thinking and creative work — not just watching it happen",
      "Direct, purposeful dialogue and targeted questioning dig past surface answers",
      "Formative feedback lands and is acted on within the lesson",
      "Progress is visible in the work — all have moved forward",
      "Students can say how their work has improved",
      "Misconceptions are caught and unpicked in the moment",
    ],
    research: [
      { name: "Principles of Instruction — Barak Rosenshine", note: "Effective questioning, checking for understanding, and guiding student practice." },
      { name: "Formative assessment — Dylan Wiliam", note: "Immediate, actionable feedback cycles that let students refine their work in the moment." },
    ],
    levels: {
      Developing: "The teacher is still doing much of the heavy thinking; progress is hard to see in the work within the session.",
      Embedded: "Students do the heavy cognitive and creative work. Questioning digs past surface answers and feedback is acted on in the lesson.",
      Transformational: "Progress is unmistakable in the work. Every student has moved forward — and can name their own next step.",
    },
  },
];

const RATINGS = ["Developing", "Embedded", "Transformational"];
const RATING_COLOUR = {
  Developing: BRAND.developing,
  Embedded: BRAND.embedded,
  Transformational: BRAND.transformational,
};
const RATING_TAGLINE = {
  Developing: "taking root",
  Embedded: "everyday practice",
  Transformational: "lifts the whole room",
};

const TERMS = ["Term 1", "Term 2", "Term 3", "Term 4", "Term 5"];
const DEPARTMENTS = [
  "English", "Maths", "Science", "Humanities",
  "Theatre", "Applied Theatre", "Musical Theatre", "Music", "Dance",
  "Music Technology", "Visual Art & Design", "Fashion, Styling & Textiles",
  "Production Arts", "Film & Media Production", "Digital Arts",
];

// Simulated staff directory. In production this syncs from BromCom — names,
// levels and line management — and the app sits behind staff login.
const STAFF = [
  { name: "Kerry Western", role: "Director of Teaching & Learning", level: "Leadership", department: "Teaching & Learning", manager: null },
  { name: "Daniel Price", role: "Head of Performing Arts", level: "Leadership", department: "Theatre", manager: "Kerry Western" },
  { name: "Sofia Andrews", role: "Head of Creative Industries", level: "Leadership", department: "Visual Art & Design", manager: "Kerry Western" },
  { name: "Nicola Grant", role: "Head of National Curriculum", level: "Leadership", department: "English", manager: "Kerry Western" },
  { name: "Priya Nair", role: "Lead Teacher", level: "UPS", department: "Dance", manager: "Daniel Price" },
  { name: "Amara Okafor", role: "Teacher", level: "Main scale", department: "Theatre", manager: "Daniel Price" },
  { name: "Grace Adeyemi", role: "Teacher", level: "ECT Year 2", department: "Musical Theatre", manager: "Daniel Price" },
  { name: "Marcus Bell", role: "Teacher", level: "UPS", department: "Music", manager: "Daniel Price" },
  { name: "Jordan Mackey", role: "Teacher", level: "Main scale", department: "Music Technology", manager: "Daniel Price" },
  { name: "Leah Sturrock", role: "Teacher", level: "Main scale", department: "Digital Arts", manager: "Sofia Andrews" },
  { name: "Yusuf Rahman", role: "Teacher", level: "ECT Year 1", department: "Film & Media Production", manager: "Sofia Andrews" },
  { name: "Elena Petrova", role: "Teacher", level: "Main scale", department: "Production Arts", manager: "Sofia Andrews" },
  { name: "Tom Whitfield", role: "Teacher", level: "Main scale", department: "Maths", manager: "Nicola Grant" },
  { name: "Rachel Okon", role: "Teacher", level: "UPS", department: "Science", manager: "Nicola Grant" },
];
const staffByName = (name) => STAFF.find((s) => s.name === name);

const FORMS = [
  {
    id: "peer-review",
    name: "Peer Review",
    blurb: "Developmental review against the four BRIT framework areas, with comments per area.",
    icon: ClipboardCheck,
    profile: "staff",
    active: true,
  },
  {
    id: "learning-walk",
    name: "Learning Walk",
    blurb: "Lighter-touch walk rated against the four areas, with a single overall observation.",
    icon: Users,
    profile: "staff",
    active: true,
  },
  {
    id: "aen-review",
    name: "AEN Review",
    blurb: "",
    icon: ShieldAlert,
    profile: "pupil",
    active: false,
  },
];

// v3: reseeded for the BromCom-style directory, Terms 1-5 and the real
// department list. The key bump makes browsers holding an old seed reseed.
const STORAGE_KEY = "brit-tl-studio-submissions-v3";

/* ------------------------------------------------------------------ *
 *  SEED DATA (so the SLT view is alive on first open)
 * ------------------------------------------------------------------ */
// pick("Belonging", 0, 3) → the 1st and 4th practice look-fors for that strand,
// so seed data always matches the framework text exactly.
const pick = (key, ...idx) => {
  const practice = STRANDS.find((s) => s.key === key).practice;
  return idx.map((i) => practice[i]);
};

function mk(id, formType, date, term, faculty, reviewee, reviewer, ratings, comments, extra = {}) {
  const strands = {};
  STRANDS.forEach((s, i) => {
    strands[s.key] = {
      rating: ratings[i],
      comment: comments[i] || "",
      noticed: extra.noticed?.[s.key] || [],
    };
  });
  return {
    id, formType, submittedAt: date,
    date, term, academicYear: "2026/27", faculty, reviewee, reviewer, strands,
    focus: extra.focus || "",
    celebrate: extra.celebrate || "",
    nextStep: extra.nextStep || "",
    links: extra.links || [],
    overall: formType === "learning-walk" ? (comments[4] || "") : "",
  };
}

const SEED = [
  mk("s1", "peer-review", "2026-09-18", "Term 1", "Theatre", "Amara Okafor", "Daniel Price",
    ["Embedded", "Embedded", "Embedded", "Developing"],
    ["Every student greeted by name at the door, and the register doubled as a check-in. Two quieter students had planned entry points into the devising task — nobody was invisible at the back.",
     "",
     "Students could articulate the why of the devising task without prompting.",
     "Progress within the lesson clear, though the longer arc was less visible in one visit."],
    {
      focus: "Belonging",
      noticed: { Belonging: pick("Belonging", 0, 1, 3), Travel: pick("Travel", 2) },
      celebrate: "The check-in ritual at the door — students visibly arrived ready because someone expected them.",
      nextStep: "Try handing the warm-down reflection to a student to lead, once a fortnight.",
    }),
  mk("s2", "peer-review", "2026-09-22", "Term 1", "Digital Arts", "Leah Sturrock", "Priya Nair",
    ["Developing", "Embedded", "Transformational", "Developing"],
    ["A few students on the edges, less drawn in during the brief.",
     "Dual-screen setup worked well for the pipeline demo.",
     "The sprint was framed against a live client brief with last year's showreel running as a living model of excellence — students could say exactly what they were learning and why it mattered.",
     ""],
    {
      focus: "Intent",
      noticed: { Intent: pick("Intent", 0, 1), Room: pick("Room", 1) },
      celebrate: "The client framing — the room believed the work was real, because it was.",
      nextStep: "A two-minute scan for who's drifting at the back during briefings.",
      links: ["https://docs.google.com/document/d/demo-sprint-brief"],
    }),
  mk("s3", "peer-review", "2026-10-02", "Term 2", "Music", "Marcus Bell", "Sofia Andrews",
    ["Transformational", "Transformational", "Embedded", "Embedded"],
    ["Genuine ensemble culture — every student contributed, and risk-taking in the improvisation felt completely safe. The wall of work-in-progress made the room feel owned by the people in it.",
     "Configured for both rehearsal and feedback without a reset — seamless.",
     "Intent clear; the link to the assessment brief could be sharpened.",
     ""],
    {
      focus: "Belonging",
      noticed: { Belonging: pick("Belonging", 0, 2, 3), Room: pick("Room", 2), Travel: pick("Travel", 3) },
      celebrate: "An ensemble where it is visibly safe to fail — that culture takes years to build, and it shows.",
    }),
  mk("s4", "peer-review", "2026-10-09", "Term 2", "Film & Media Production", "Yusuf Rahman", "Daniel Price",
    ["Embedded", "Developing", "Transformational", "Embedded"],
    ["Strong rapport, inclusive questioning.",
     "Kit distribution ate the first ten minutes and the space felt tight for the group size. Once running, sightlines to the edit demo worked well — set-up before the lesson would buy that time back.",
     "Learning purpose exceptionally clear and student-owned.",
     "Progress evident across the edit task."],
    {
      focus: "Room",
      noticed: { Room: pick("Room", 1), Intent: pick("Intent", 0), Travel: pick("Travel", 3) },
      celebrate: "The edit demo itself was superb — clear, well paced, and students leaned in.",
      nextStep: "Stage the kit trolleys before the lesson, so the environment is set before learning starts.",
    }),
  mk("s5", "peer-review", "2026-10-14", "Term 2", "Dance", "Priya Nair", "Amara Okafor",
    ["Embedded", "Embedded", "Embedded", "Transformational"],
    ["Inclusive — quieter students given planned space.",
     "",
     "Purpose shared and understood.",
     "Students did the heavy thinking throughout. Feedback from the mid-point showing landed and was acted on before the end, and every dancer could name their own next step."],
    {
      focus: "Travel",
      noticed: { Travel: pick("Travel", 0, 2, 3), Belonging: pick("Belonging", 1) },
      celebrate: "The moment the dancers self-corrected after the showing without being told — that is Travel.",
    }),
  mk("s6", "peer-review", "2026-11-05", "Term 2", "Visual Art & Design", "Sofia Andrews", "Leah Sturrock",
    ["Developing", "Embedded", "Transformational", "Developing"],
    ["Belonging building; a couple of students disengaged early.",
     "",
     "Critique was framed with real purpose against professional exemplars on the wall — standards felt aspirational without being out of reach.",
     "The journey across the project was less visible in a single visit."],
    {
      focus: "Intent",
      noticed: { Intent: pick("Intent", 1, 2) },
      celebrate: "The critique culture — generous, rigorous, and completely student-led by the end.",
      nextStep: "Name the learning (not just the task) at the top of the session, so the why is as visible as the what.",
    }),
  mk("s7", "learning-walk", "2026-09-25", "Term 1", "Musical Theatre", "Grace Adeyemi", "Kerry Western",
    ["Embedded", "Embedded", "Transformational", "Embedded"],
    ["", "", "", "", "Mobile-phones check-in walk across three rooms: policy landing well. Intent strong everywhere; belonging solid; travel visible in the vocal work."]),
  mk("s8", "learning-walk", "2026-10-08", "Term 2", "Production Arts", "Elena Petrova", "Kerry Western",
    ["Developing", "Developing", "Embedded", "Developing"],
    ["", "", "", "", "Belonging-focus walk: students arrived to an unset space and a quiet welcome — environment and greeting both need attention. Intent clear; travel hard to read on a walk."]),
  mk("s9", "peer-review", "2026-11-12", "Term 2", "Music Technology", "Jordan Mackey", "Yusuf Rahman",
    ["Transformational", "Embedded", "Transformational", "Embedded"],
    ["Genuinely inclusive pair programming — rotations planned so quieter students took the driving seat, and every voice mattered in the stand-up.",
     "Lab set up for pairing before students arrived.",
     "Intent razor-sharp, tied to a live brief.",
     "Good gains; students could self-assess against the brief."],
    {
      focus: "Belonging",
      noticed: { Belonging: pick("Belonging", 0, 1), Intent: pick("Intent", 0), Travel: pick("Travel", 1) },
      celebrate: "Quieter students literally in the driving seat — inclusion by design, not by luck.",
    }),
  mk("s10", "peer-review", "2026-11-18", "Term 2", "Musical Theatre", "Grace Adeyemi", "Sofia Andrews",
    ["Embedded", "Transformational", "Embedded", "Developing"],
    ["Strong belonging, clear rituals.",
     "The studio transformed for the promenade piece — zones, sightlines and safety all considered, and students reset the space themselves like a working company.",
     "Purpose understood; articulation could be pushed further.",
     ""],
    {
      focus: "Room",
      noticed: { Room: pick("Room", 0, 1, 3), Belonging: pick("Belonging", 3) },
      celebrate: "A room run like a professional company — the students owned the space.",
      nextStep: "Capture the reset routine as a one-page company call sheet other groups could borrow.",
    }),
  mk("s11", "learning-walk", "2026-11-20", "Term 2", "Music", "Marcus Bell", "Kerry Western",
    ["Embedded", "Transformational", "Transformational", "Embedded"],
    ["", "", "", "", "Rooms-focus walk: both studios set before learning started, kit ready, sightlines clean. Intent excellent; travel evident in the composition task."]),
];

/* ------------------------------------------------------------------ *
 *  STORAGE HELPERS
 * ------------------------------------------------------------------ */
// Standalone build uses localStorage. (The artifact version used window.storage,
// which only exists inside Claude's artifact runtime.)
async function loadSubmissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // no saved data yet, fall through and seed
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
  } catch (e) { /* ignore */ }
  return SEED;
}
async function saveSubmissions(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) { /* ignore — in-memory state still works */ }
}

/* ------------------------------------------------------------------ *
 *  SMALL UI PRIMITIVES
 * ------------------------------------------------------------------ */
const Card = ({ children, style, ...p }) => (
  <div style={{ background: "#fff", border: `1px solid ${BRAND.line}`, borderRadius: 16, ...style }} {...p}>
    {children}
  </div>
);

const Pill = ({ active, colour, children, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "8px 14px", borderRadius: 999, fontSize: 13, fontWeight: 600,
      border: `1.5px solid ${active ? colour : BRAND.line}`,
      background: active ? colour : "#fff",
      color: active ? "#fff" : BRAND.grey,
      cursor: "pointer", transition: "all .15s",
    }}
  >
    {children}
  </button>
);

const Field = ({ label, children }) => (
  <label style={{ display: "block" }}>
    <span style={{ fontSize: 12, fontWeight: 600, color: BRAND.grey, textTransform: "uppercase", letterSpacing: ".04em" }}>
      {label}
    </span>
    <div style={{ marginTop: 6 }}>{children}</div>
  </label>
);

const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 10,
  border: `1px solid ${BRAND.line}`, fontSize: 14, fontFamily: "inherit",
  color: BRAND.ink, background: "#fff", boxSizing: "border-box",
};

/* ------------------------------------------------------------------ *
 *  STAFF: FORM SELECTOR
 * ------------------------------------------------------------------ */
const FORM_ACCENT = { "peer-review": "#AD227E", "learning-walk": "#8447B0", "aen-review": "#C0392B" };

function OutlinePill({ children, colour = "#fff" }) {
  return (
    <span style={{
      display: "inline-block", padding: "7px 16px", borderRadius: 999,
      border: `1.5px solid ${colour}`, color: colour, fontSize: 13, fontWeight: 600,
      width: "fit-content",
    }}>{children}</span>
  );
}

function FormSelector({ onSelect }) {
  return (
    <div>
      {/* statement panel + BRIT framework tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18, marginBottom: 30 }}>
        <div style={{
          background: BRAND.magenta, borderRadius: 28, padding: "28px 30px 32px", color: "#fff",
          display: "flex", flexDirection: "column", minHeight: 340,
        }}>
          <OutlinePill>How we see teaching</OutlinePill>
          <div style={{ flex: 1, minHeight: 40 }} />
          <h2 style={{ fontSize: "clamp(28px, 3.4vw, 40px)", fontWeight: 900, letterSpacing: "-.03em", lineHeight: 1.05, margin: "0 0 14px" }}>
            More than a framework.<br />A shared language.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0, opacity: 0.94 }}>
            <strong>The BRIT framework asks three questions of every room: what can you see,
            what can you hear — and how does it feel?</strong> Reviews here grow practice
            through conversation between colleagues, and it unfolds, lesson by lesson.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 12 }}>
          {STRANDS.map((s) => (
            <div key={s.key} style={{
              background: s.accent, borderRadius: 20, padding: "16px 18px", color: "#fff",
              display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 130,
            }}>
              <div style={{ fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-.02em" }}>{s.letter}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{s.key}</div>
                <div style={{ fontSize: 11.5, opacity: 0.9, marginTop: 2, lineHeight: 1.35 }}>{s.focus}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-.03em", color: BRAND.ink, margin: "0 0 4px" }}>Choose a form</h2>
      <p style={{ color: BRAND.grey, margin: "0 0 24px", fontSize: 14 }}>
        Every form opens with the same core details, so the data lines up across forms and across years.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 }}>
        {FORMS.map((f, i) => {
          const disabled = !f.active;
          const accent = FORM_ACCENT[f.id] || BRAND.magenta;
          return (
            <div
              key={f.id}
              onClick={() => f.active && onSelect(f.id)}
              style={{
                background: "#fff", borderRadius: 20, padding: 20,
                border: `1.5px solid ${disabled ? BRAND.line : BRAND.ink}`,
                boxShadow: disabled ? "none" : `6px 6px 0 ${accent}`,
                cursor: f.active ? "pointer" : "default",
                opacity: disabled ? 0.7 : 1,
                display: "flex", flexDirection: "column", minHeight: 170,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 800, fontSize: 14, color: BRAND.ink }}>{String(i + 1).padStart(2, "0")}</span>
                {f.active ? <ArrowUpRight size={19} color={BRAND.ink} /> : <Lock size={15} color="#C0392B" />}
              </div>
              <div style={{ flex: 1, minHeight: 26 }} />
              <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-.01em", color: BRAND.ink }}>{f.name}</div>
              <div style={{ fontSize: 13, color: BRAND.grey, marginTop: 6, lineHeight: 1.5 }}>{f.blurb}</div>
              {f.profile === "pupil" && (
                <div style={{ marginTop: 12, fontSize: 11, fontWeight: 600, color: "#C0392B", display: "flex", alignItems: "center", gap: 6 }}>
                  <Lock size={13} /> Held under separate governance
                </div>
              )}
            </div>
          );
        })}
        <div style={{
          borderRadius: 20, padding: 20, display: "grid", placeItems: "center",
          border: `1.5px dashed ${BRAND.grey}`, color: BRAND.grey, minHeight: 170,
        }}>
          <div style={{ textAlign: "center" }}>
            <Plus size={22} color={BRAND.grey} />
            <div style={{ fontSize: 13, marginTop: 8, fontWeight: 600 }}>Add a form<br />(future years)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  SHARED SPINE FIELDS
 * ------------------------------------------------------------------ */
function SpineFields({ v, set }) {
  const reviewee = staffByName(v.reviewee);
  const pickReviewee = (name) => {
    set("reviewee", name);
    const s = staffByName(name);
    if (s && DEPARTMENTS.includes(s.department)) set("faculty", s.department);
  };
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 14 }}>
        <Field label="Date">
          <input type="date" style={inputStyle} value={v.date} onChange={(e) => set("date", e.target.value)} />
        </Field>
        <Field label="Term">
          <select style={inputStyle} value={v.term} onChange={(e) => set("term", e.target.value)}>
            <option value="">Select…</option>
            {TERMS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Academic year">
          <input style={inputStyle} value={v.academicYear} onChange={(e) => set("academicYear", e.target.value)} />
        </Field>
        <Field label="Staff member reviewed">
          <select style={inputStyle} value={v.reviewee} onChange={(e) => pickReviewee(e.target.value)}>
            <option value="">Select…</option>
            {STAFF.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
        </Field>
        <Field label="Department">
          <select style={inputStyle} value={v.faculty} onChange={(e) => set("faculty", e.target.value)}>
            <option value="">Select…</option>
            {DEPARTMENTS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </Field>
        <Field label="Reviewer">
          <select style={inputStyle} value={v.reviewer} onChange={(e) => set("reviewer", e.target.value)}>
            <option value="">Select…</option>
            {STAFF.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
        </Field>
      </div>
      {reviewee && (
        <div style={{
          marginTop: 14, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          background: BRAND.pink, borderRadius: 10, padding: "10px 14px", fontSize: 12.5, color: BRAND.grey,
        }}>
          <span style={{ fontWeight: 700, color: BRAND.ink }}>{reviewee.name}</span>
          <span>{reviewee.role}</span>·<span>{reviewee.level}</span>
          {reviewee.manager && <><span>·</span><span>Line manager: {reviewee.manager}</span></>}
          <span style={{
            marginLeft: "auto", fontSize: 10, fontWeight: 700, letterSpacing: ".08em",
            border: `1px solid ${BRAND.line}`, borderRadius: 999, padding: "3px 9px",
          }}>BROMCOM · DEMO SYNC</span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  PDF EXPORT — opens a clean print view; the browser's print dialog
 *  offers "Save as PDF" on every platform.
 * ------------------------------------------------------------------ */
function printRecord(rec) {
  const esc = (t) => String(t ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const person = staffByName(rec.reviewee);
  const formName = FORMS.find((f) => f.id === rec.formType)?.name || "Review";
  const row = (k, val) => (val ? `<tr><td>${k}</td><td>${esc(val)}</td></tr>` : "");
  const areas = STRANDS.map((a) => {
    const cell = rec.strands?.[a.key] || {};
    return `<div class="area" style="border-left:6px solid ${a.accent}">
      <h3>${a.letter} · ${a.key}
        ${cell.rating ? `<span class="tag" style="background:${RATING_COLOUR[cell.rating]}">${esc(cell.rating)}</span>` : ""}
        ${rec.focus === a.key ? `<span class="spot">Spotlight</span>` : ""}</h3>
      ${cell.noticed?.length ? `<p class="noticed">Noticed: ${cell.noticed.map(esc).join(" · ")}</p>` : ""}
      ${cell.comment ? `<p>${esc(cell.comment)}</p>` : ""}
    </div>`;
  }).join("");
  const html = `<title>${esc(formName)} — ${esc(rec.reviewee)} — ${esc(rec.date)}</title>
  <style>
    body{font-family:Arial,Helvetica,sans-serif;color:#2A1E27;margin:36px auto;max-width:700px;padding:0 16px}
    h1{margin:0;letter-spacing:-.02em} .sub{color:#6B5E66;margin:4px 0 22px;font-size:14px}
    table{border-collapse:collapse;width:100%;margin-bottom:22px;font-size:13.5px}
    td{border:1px solid #EADCE6;padding:7px 10px} td:first-child{font-weight:bold;width:36%;background:#F8F1F6}
    .area{margin:0 0 14px;padding:10px 14px;background:#FAF7F9;border-radius:6px}
    .area h3{margin:0 0 6px;font-size:15px}
    .tag{color:#fff;border-radius:99px;padding:2px 10px;font-size:11px;margin-left:8px;font-weight:normal}
    .spot{border:1px solid #2A1E27;border-radius:99px;padding:2px 10px;font-size:11px;margin-left:6px;font-weight:normal}
    .noticed{font-size:12px;color:#6B5E66} p{font-size:13.5px;line-height:1.55;margin:4px 0}
    .box{background:#FDFBF6;border:1px solid #EFE3C8;border-radius:6px;padding:10px 14px;margin-bottom:10px;font-size:13.5px}
    a{color:#AD227E} .foot{margin-top:26px;font-size:11px;color:#6B5E66}
  </style>
  <h1>${esc(formName)}</h1>
  <div class="sub">BRIT T&amp;L Development Studio · BRIT framework · ${esc(rec.academicYear)}</div>
  <table>
    ${row("Staff member reviewed", rec.reviewee)}
    ${person ? row("Role", `${person.role} · ${person.level}`) : ""}
    ${person?.manager ? row("Line manager", person.manager) : ""}
    ${row("Department", rec.faculty)}
    ${row("Reviewer", rec.reviewer)}
    ${row("Date", rec.date)}${row("Term", rec.term)}
    ${row("Spotlight area", rec.focus)}
  </table>
  ${areas}
  ${rec.overall ? `<div class="box"><strong>Overall observation:</strong> ${esc(rec.overall)}</div>` : ""}
  ${rec.celebrate ? `<div class="box"><strong>Shout-out:</strong> ${esc(rec.celebrate)}</div>` : ""}
  ${rec.nextStep ? `<div class="box"><strong>One idea worth trying:</strong> ${esc(rec.nextStep)}</div>` : ""}
  ${rec.links?.length ? `<p><strong>Linked documents</strong><br>${rec.links.map((l) => `<a href="${esc(l)}">${esc(l)}</a>`).join("<br>")}</p>` : ""}
  <div class="foot">Generated by the BRIT T&amp;L Development Studio</div>`;
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 400);
}

function PdfButton({ rec, subtle }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); printRecord(rec); }} style={{
      padding: subtle ? "5px 12px" : "10px 20px", borderRadius: 999, cursor: "pointer", fontFamily: "inherit",
      border: `1.5px solid ${BRAND.ink}`, background: "#fff", color: BRAND.ink,
      fontWeight: 700, fontSize: subtle ? 12 : 14, width: "fit-content",
    }}>Save as PDF</button>
  );
}

/* ------------------------------------------------------------------ *
 *  FORMS
 * ------------------------------------------------------------------ */
function StrandBadge({ s, size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: Math.round(size * 0.3), background: s.accent,
      color: "#fff", display: "grid", placeItems: "center", flexShrink: 0,
      fontWeight: 800, fontSize: Math.round(size * 0.45),
    }}>{s.letter}</div>
  );
}

function DescriptorPicker({ s, value, onPick }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 10 }}>
      {RATINGS.map((r) => {
        const active = value === r;
        return (
          <button key={r} onClick={() => onPick(r)} style={{
            textAlign: "left", padding: "12px 14px", borderRadius: 12, cursor: "pointer",
            border: `2px solid ${active ? RATING_COLOUR[r] : "#fff"}`,
            background: "#fff",
            transition: "all .15s", fontFamily: "inherit",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: RATING_COLOUR[r], flexShrink: 0 }} />
              <span style={{ fontWeight: 700, fontSize: 13, color: BRAND.ink }}>{r}</span>
              <span style={{ fontSize: 11, color: BRAND.grey, fontStyle: "italic" }}>{RATING_TAGLINE[r]}</span>
            </div>
            <div style={{ fontSize: 12.5, color: BRAND.grey, lineHeight: 1.55, marginTop: 7 }}>{s.levels[r]}</div>
          </button>
        );
      })}
    </div>
  );
}

function StrandCard({ s, data, isFocus, onRate, onComment, onToggleNoticed }) {
  return (
    <Card style={{
      padding: 22, marginBottom: 16, background: s.pastel,
      border: `${isFocus ? 2 : 1}px solid ${isFocus ? s.accent : BRAND.line}`,
      boxShadow: isFocus ? `0 4px 20px ${s.accent}22` : "none",
    }}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <StrandBadge s={s} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 17, fontWeight: 800, color: BRAND.ink }}>{s.key}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: BRAND.grey, border: `1px solid ${BRAND.line}`, borderRadius: 999, padding: "2px 9px", letterSpacing: ".03em" }}>{s.ts}</span>
            {isFocus && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "#fff", background: s.accent, borderRadius: 999, padding: "3px 10px" }}>
                <Sparkles size={12} /> Today's spotlight
              </span>
            )}
          </div>
          <div style={{ fontSize: 13, color: BRAND.grey, marginTop: 3 }}>{s.focus}</div>
        </div>
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, color: BRAND.grey, textTransform: "uppercase", letterSpacing: ".04em", margin: "16px 0 8px" }}>
        In the room you might notice… <span style={{ textTransform: "none", fontWeight: 500, letterSpacing: 0 }}>(tap what you saw)</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {s.practice.map((p) => {
          const on = data.noticed?.includes(p);
          return (
            <button key={p} onClick={() => onToggleNoticed(s.key, p)} style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px",
              borderRadius: 999, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit",
              border: `1.5px solid ${on ? s.accent : "#fff"}`,
              background: on ? s.accent : "#fff",
              color: on ? "#fff" : BRAND.grey, fontWeight: on ? 650 : 500,
              transition: "all .15s", textAlign: "left",
            }}>
              {on && <CheckCircle size={13} />}{p}
            </button>
          );
        })}
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, color: BRAND.grey, textTransform: "uppercase", letterSpacing: ".04em", margin: "0 0 8px" }}>
        Where does practice sit today?
      </div>
      <DescriptorPicker s={s} value={data.rating} onPick={(r) => onRate(s.key, r)} />

      <textarea
        style={{ ...inputStyle, minHeight: 70, resize: "vertical", marginTop: 14, border: "1px solid #fff" }}
        placeholder={isFocus
          ? `This is the spotlight area — what did you see and hear, and how did it feel? Be generous with detail.`
          : `Anything you noticed for ${s.key} (optional)`}
        value={data.comment}
        onChange={(e) => onComment(s.key, e.target.value)}
      />
    </Card>
  );
}

function ReviewForm({ formId, onBack, onSubmit }) {
  const isWalk = formId === "learning-walk";
  const meta = FORMS.find((f) => f.id === formId);
  const [spine, setSpine] = useState({
    date: "", term: "", academicYear: "2026/27", faculty: "", reviewee: "", reviewer: "",
  });
  const [strands, setStrands] = useState(
    STRANDS.reduce((a, s) => ({ ...a, [s.key]: { rating: "", comment: "", noticed: [] } }), {})
  );
  const [focusStrand, setFocusStrand] = useState("");
  const [celebrate, setCelebrate] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [links, setLinks] = useState([""]);
  const [overall, setOverall] = useState("");
  const [done, setDone] = useState(null);

  const setSpineField = (k, val) => setSpine((s) => ({ ...s, [k]: val }));
  const setRating = (k, r) => setStrands((s) => ({ ...s, [k]: { ...s[k], rating: r } }));
  const setComment = (k, c) => setStrands((s) => ({ ...s, [k]: { ...s[k], comment: c } }));
  const toggleNoticed = (k, p) => setStrands((s) => {
    const cur = s[k].noticed || [];
    return { ...s, [k]: { ...s[k], noticed: cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p] } };
  });

  const complete =
    Object.values(spine).every((x) => x.trim()) &&
    STRANDS.every((s) => strands[s.key].rating) &&
    (isWalk || (focusStrand && celebrate.trim() && nextStep.trim()));

  const submit = () => {
    const record = {
      id: "r" + Date.now(),
      formType: formId,
      submittedAt: new Date().toISOString().slice(0, 10),
      ...spine,
      strands,
      focus: isWalk ? "" : focusStrand,
      celebrate: isWalk ? "" : celebrate,
      nextStep: isWalk ? "" : nextStep,
      links: isWalk ? [] : links.map((l) => l.trim()).filter(Boolean),
      overall: isWalk ? overall : "",
    };
    onSubmit(record);
    setDone(record);
  };

  if (done) {
    return (
      <Card style={{ padding: 40, textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#EAF7EC", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
          <CheckCircle size={30} color={BRAND.green} />
        </div>
        <h3 style={{ margin: "0 0 8px", color: BRAND.ink }}>Review submitted</h3>
        <p style={{ color: BRAND.grey, fontSize: 14, margin: "0 0 20px" }}>
          It has been added to the {meta.name.toLowerCase()} record and is visible on the SLT dashboard.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onBack} style={{
            padding: "10px 20px", borderRadius: 999, border: "none", background: BRAND.magenta,
            color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14, fontFamily: "inherit",
          }}>Back to forms</button>
          <PdfButton rec={done} />
        </div>
      </Card>
    );
  }

  return (
    <div>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: BRAND.magenta, cursor: "pointer", fontSize: 14, fontWeight: 600, marginBottom: 16, padding: 0 }}>
        <ArrowLeft size={16} /> All forms
      </button>
      <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-.03em", color: BRAND.ink, margin: "0 0 4px" }}>{meta.name}</h2>
      <p style={{ color: BRAND.grey, margin: "0 0 22px", fontSize: 14 }}>
        What can you see, hear — and how does it feel?
      </p>

      <Card style={{ padding: 22, marginBottom: 20 }}>
        <SpineFields v={spine} set={setSpineField} />
      </Card>

      {!isWalk && (
        <Card style={{ padding: 22, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Sparkles size={16} color={BRAND.magenta} />
            <h3 style={{ margin: 0, fontSize: 15, color: BRAND.ink }}>Today's spotlight</h3>
          </div>
          <p style={{ fontSize: 13, color: BRAND.grey, margin: "0 0 14px", lineHeight: 1.5 }}>
            Peer reviews work best with one narrow focus, agreed together before the lesson.
            Pick the area under the spotlight — you'll still glance across all four.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {STRANDS.map((s) => {
              const on = focusStrand === s.key;
              return (
                <button key={s.key} onClick={() => setFocusStrand(s.key)} style={{
                  display: "inline-flex", alignItems: "center", gap: 9, padding: "8px 16px 8px 9px",
                  borderRadius: 999, cursor: "pointer", fontFamily: "inherit",
                  border: `2px solid ${on ? s.accent : BRAND.line}`,
                  background: on ? `${s.accent}12` : "#fff", transition: "all .15s",
                }}>
                  <StrandBadge s={s} size={26} />
                  <span style={{ fontSize: 13.5, fontWeight: on ? 750 : 600, color: on ? s.accent : BRAND.grey }}>{s.key}</span>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {STRANDS.map((s) => isWalk ? (
        <Card key={s.key} style={{ padding: 22, marginBottom: 16, background: s.pastel }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 6 }}>
            <StrandBadge s={s} size={34} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: BRAND.ink }}>{s.key}</div>
              <div style={{ fontSize: 12.5, color: BRAND.grey }}>{s.focus}</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: BRAND.grey, margin: "4px 0 14px", lineHeight: 1.5 }}>{s.desc}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {RATINGS.map((r) => (
              <Pill key={r} active={strands[s.key].rating === r} colour={RATING_COLOUR[r]} onClick={() => setRating(s.key, r)}>
                {r}
              </Pill>
            ))}
          </div>
        </Card>
      ) : (
        <StrandCard
          key={s.key}
          s={s}
          data={strands[s.key]}
          isFocus={focusStrand === s.key}
          onRate={setRating}
          onComment={setComment}
          onToggleNoticed={toggleNoticed}
        />
      ))}

      {isWalk && (
        <Card style={{ padding: 22, marginBottom: 16 }}>
          <Field label="Overall observation">
            <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} value={overall}
              placeholder="One reflection across the walk" onChange={(e) => setOverall(e.target.value)} />
          </Field>
        </Card>
      )}

      {!isWalk && (
        <Card style={{ padding: 22, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <ClipboardList size={16} color={BRAND.magenta} />
            <h3 style={{ margin: 0, fontSize: 15, color: BRAND.ink }}>Linked documents</h3>
          </div>
          <p style={{ fontSize: 13, color: BRAND.grey, margin: "0 0 12px", lineHeight: 1.5 }}>
            Paste links to anything that supports the review — lesson plans, slides, the brief, photos of the work. Optional.
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {links.map((l, i) => (
              <input key={i} style={inputStyle} type="url" placeholder="https://…" value={l}
                onChange={(e) => setLinks((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))} />
            ))}
          </div>
          <button onClick={() => setLinks((prev) => [...prev, ""])} style={{
            marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px",
            borderRadius: 999, border: `1.5px solid ${BRAND.line}`, background: "#fff", cursor: "pointer",
            fontFamily: "inherit", fontSize: 12.5, fontWeight: 650, color: BRAND.magenta,
          }}><Plus size={14} /> Add another link</button>
        </Card>
      )}

      {!isWalk && (
        <Card style={{ padding: 22, marginBottom: 16, background: "#FDFBF6", borderColor: "#EFE3C8" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <MessageCircle size={16} color="#B8860B" />
            <h3 style={{ margin: 0, fontSize: 15, color: BRAND.ink }}>Close with care</h3>
          </div>
          <p style={{ fontSize: 13, color: BRAND.grey, margin: "0 0 14px", lineHeight: 1.5 }}>
            Reviews end as conversations between colleagues, not verdicts. Send your colleague away with something to feel good about.
          </p>
          <div style={{ display: "grid", gap: 14 }}>
            <Field label="Shout-out — something your colleague should feel proud of">
              <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={celebrate}
                placeholder="The moment worth celebrating from this lesson…" onChange={(e) => setCelebrate(e.target.value)} />
            </Field>
            <Field label="One idea worth trying — small, concrete, kind">
              <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={nextStep}
                placeholder="A single practical suggestion for your colleague to take away…" onChange={(e) => setNextStep(e.target.value)} />
            </Field>
          </div>
        </Card>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8 }}>
        <button disabled={!complete} onClick={submit} style={{
          padding: "12px 24px", borderRadius: 999, border: "none",
          background: complete ? BRAND.magenta : BRAND.line,
          color: complete ? "#fff" : BRAND.grey, fontWeight: 700, fontSize: 14,
          cursor: complete ? "pointer" : "not-allowed",
        }}>Submit review</button>
        {!complete && (
          <span style={{ fontSize: 13, color: BRAND.grey }}>
            {isWalk
              ? "Complete all details and a descriptor for each area."
              : "Complete the details, pick a spotlight, choose a descriptor for each area, and add a shout-out and an idea worth trying."}
          </span>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  SLT DASHBOARD
 * ------------------------------------------------------------------ */
function StrandBar({ strand, counts }) {
  const total = RATINGS.reduce((a, r) => a + counts[r], 0) || 1;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontWeight: 700, color: BRAND.ink, fontSize: 14 }}>{strand}</span>
        <span style={{ color: BRAND.grey, fontSize: 13 }}>{total} review{total !== 1 ? "s" : ""}</span>
      </div>
      <div style={{ display: "flex", height: 26, borderRadius: 8, overflow: "hidden", border: `1px solid ${BRAND.line}` }}>
        {RATINGS.map((r) => {
          const w = (counts[r] / total) * 100;
          if (!counts[r]) return null;
          return (
            <div key={r} title={`${r}: ${counts[r]}`} style={{
              width: `${w}%`, background: RATING_COLOUR[r], display: "grid", placeItems: "center",
              color: "#fff", fontSize: 12, fontWeight: 700,
            }}>{counts[r]}</div>
          );
        })}
      </div>
    </div>
  );
}

function SLTDashboard({ submissions }) {
  const [formFilter, setFormFilter] = useState("all");
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [exStrand, setExStrand] = useState("Intent");
  const [exRating, setExRating] = useState("Transformational");

  const filtered = submissions.filter((s) =>
    (formFilter === "all" || s.formType === formFilter) &&
    (facultyFilter === "all" || s.faculty === facultyFilter)
  );

  // per-strand counts
  const strandCounts = {};
  STRANDS.forEach((s) => {
    strandCounts[s.key] = { Developing: 0, Embedded: 0, Transformational: 0 };
  });
  filtered.forEach((sub) => {
    STRANDS.forEach((s) => {
      const r = sub.strands?.[s.key]?.rating;
      if (r) strandCounts[s.key][r]++;
    });
  });

  const chartData = STRANDS.map((s) => ({ strand: s.key, ...strandCounts[s.key] }));

  // comment explorer
  const matches = [];
  filtered.forEach((sub) => {
    const cell = sub.strands?.[exStrand];
    if (cell && cell.rating === exRating && cell.comment) {
      matches.push({ ...sub, comment: cell.comment });
    }
  });

  const totalT = STRANDS.reduce((a, s) => a + strandCounts[s.key].Transformational, 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-.03em", color: BRAND.ink, margin: "0 0 4px" }}>Analytics</h2>
          <p style={{ color: BRAND.grey, margin: 0, fontSize: 14 }}>Thematic and developmental — no scores, no league tables.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <select style={{ ...inputStyle, width: "auto" }} value={formFilter} onChange={(e) => setFormFilter(e.target.value)}>
            <option value="all">All forms</option>
            {FORMS.filter((f) => f.active).map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
          <select style={{ ...inputStyle, width: "auto" }} value={facultyFilter} onChange={(e) => setFacultyFilter(e.target.value)}>
            <option value="all">All departments</option>
            {DEPARTMENTS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
      </div>

      {/* stat row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 14, marginBottom: 22 }}>
        {[
          { label: "Reviews in view", value: filtered.length, bg: BRAND.magenta },
          { label: "Transformational ratings", value: totalT, bg: BRAND.green },
          { label: "Departments covered", value: new Set(filtered.map((s) => s.faculty)).size, bg: "#8447B0" },
        ].map((stat) => (
          <div key={stat.label} style={{ background: stat.bg, borderRadius: 20, padding: "18px 20px", color: "#fff" }}>
            <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: "-.03em", lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.88, marginTop: 8 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px,1fr))", gap: 18, marginBottom: 22 }}>
        <Card style={{ padding: 22 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, color: BRAND.ink }}>Where each area sits</h3>
          {STRANDS.map((s) => <StrandBar key={s.key} strand={s.key} counts={strandCounts[s.key]} />)}
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            {RATINGS.map((r) => (
              <span key={r} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: BRAND.grey }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: RATING_COLOUR[r] }} /> {r}
              </span>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 22 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, color: BRAND.ink }}>Distribution</h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={chartData} margin={{ left: -20 }}>
              <XAxis dataKey="strand" tick={{ fontSize: 12, fill: BRAND.grey }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: BRAND.grey }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {RATINGS.map((r) => (
                <Bar key={r} dataKey={r} stackId="a" fill={RATING_COLOUR[r]} radius={r === "Transformational" ? [4, 4, 0, 0] : 0} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* comment explorer */}
      <Card style={{ padding: 22, marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Search size={16} color={BRAND.magenta} />
          <h3 style={{ margin: 0, fontSize: 15, color: BRAND.ink }}>Comment explorer</h3>
        </div>
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 14, color: BRAND.grey }}>Show every comment where</span>
          <select style={{ ...inputStyle, width: "auto" }} value={exStrand} onChange={(e) => setExStrand(e.target.value)}>
            {STRANDS.map((s) => <option key={s.key}>{s.key}</option>)}
          </select>
          <span style={{ fontSize: 14, color: BRAND.grey }}>was rated</span>
          <select style={{ ...inputStyle, width: "auto" }} value={exRating} onChange={(e) => setExRating(e.target.value)}>
            {RATINGS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        {matches.length === 0 ? (
          <p style={{ color: BRAND.grey, fontSize: 14, margin: 0 }}>No comments match this combination in the current view.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {matches.map((m) => (
              <div key={m.id} style={{ padding: "12px 14px", background: BRAND.pink, borderRadius: 10, borderLeft: `3px solid ${RATING_COLOUR[exRating]}` }}>
                <div style={{ fontSize: 14, color: BRAND.ink, lineHeight: 1.5 }}>{m.comment}</div>
                <div style={{ fontSize: 12, color: BRAND.grey, marginTop: 6 }}>
                  {m.reviewee} · {m.faculty} · {m.term} · {FORMS.find((f) => f.id === m.formType)?.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* submissions list */}
      <Card style={{ padding: 22 }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 15, color: BRAND.ink }}>Submissions ({filtered.length})</h3>
        <div style={{ display: "grid", gap: 8 }}>
          {filtered.slice().reverse().map((s) => (
            <details key={s.id} style={{ border: `1px solid ${BRAND.line}`, borderRadius: 10, padding: "10px 14px" }}>
              <summary style={{ cursor: "pointer", fontSize: 14, color: BRAND.ink, display: "flex", justifyContent: "space-between", gap: 10 }}>
                <span><strong>{s.reviewee}</strong> · {s.faculty}</span>
                <span style={{ color: BRAND.grey, fontSize: 13 }}>{s.date} · {FORMS.find((f) => f.id === s.formType)?.name}</span>
              </summary>
              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                {STRANDS.map((st) => (
                  <div key={st.key} style={{ fontSize: 13 }}>
                    <span style={{ display: "inline-block", width: 90, fontWeight: 700, color: BRAND.magenta }}>{st.key}</span>
                    <span style={{ display: "inline-block", padding: "1px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700, color: "#fff", background: RATING_COLOUR[s.strands[st.key].rating] || BRAND.grey, marginRight: 8 }}>
                      {s.strands[st.key].rating}
                    </span>
                    <span style={{ color: BRAND.grey }}>{s.strands[st.key].comment}</span>
                  </div>
                ))}
                {s.overall && <div style={{ fontSize: 13, color: BRAND.grey, marginTop: 4 }}><em>{s.overall}</em></div>}
                {s.celebrate && <div style={{ fontSize: 13, color: BRAND.ink, marginTop: 4, padding: "8px 12px", background: "#FDFBF6", borderRadius: 8 }}><strong>Shout-out:</strong> {s.celebrate}</div>}
                {s.nextStep && <div style={{ fontSize: 13, color: BRAND.grey, marginTop: 4 }}><strong>Worth trying:</strong> {s.nextStep}</div>}
                {s.links?.length > 0 && (
                  <div style={{ fontSize: 13, marginTop: 4 }}>
                    <strong style={{ color: BRAND.grey }}>Linked documents:</strong>{" "}
                    {s.links.map((l, i) => (
                      <a key={i} href={l} target="_blank" rel="noreferrer" style={{ color: BRAND.magenta, marginRight: 10, wordBreak: "break-all" }}>{l}</a>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: 12, color: BRAND.grey, marginTop: 4, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <span>Reviewer: {s.reviewer}{s.focus ? ` · Spotlight: ${s.focus}` : ""}</span>
                  <PdfButton rec={s} subtle />
                </div>
              </div>
            </details>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  LINE MANAGER DASHBOARD
 * ------------------------------------------------------------------ */
function ManagerDashboard({ submissions }) {
  const managers = STAFF.filter((s) => STAFF.some((x) => x.manager === s.name));
  const [who, setWho] = useState("Daniel Price");
  const reports = STAFF.filter((s) => s.manager === who);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
        <div>
          <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-.03em", color: BRAND.ink, margin: "0 0 4px" }}>My team</h2>
          <p style={{ color: BRAND.grey, margin: 0, fontSize: 14 }}>
            Reviews and walks for the colleagues you line-manage.
          </p>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: BRAND.grey }}>
          Viewing as
          <select style={{ ...inputStyle, width: "auto" }} value={who} onChange={(e) => setWho(e.target.value)}>
            {managers.map((m) => <option key={m.name} value={m.name}>{m.name}</option>)}
          </select>
        </label>
      </div>
      <div style={{
        fontSize: 12, color: BRAND.grey, background: "#fff", border: `1px dashed ${BRAND.line}`,
        borderRadius: 10, padding: "8px 14px", marginBottom: 20,
      }}>
        Demo view — in production this page sits behind staff login, and names, levels and line management sync from BromCom.
      </div>

      {reports.length === 0 ? (
        <p style={{ color: BRAND.grey, fontSize: 14 }}>No direct reports found for {who}.</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {reports.map((r) => {
            const subs = submissions
              .filter((x) => x.reviewee === r.name)
              .slice()
              .sort((a, b) => (a.date < b.date ? 1 : -1));
            const latest = subs[0];
            return (
              <Card key={r.name} style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12, background: BRAND.magenta, color: "#fff",
                    display: "grid", placeItems: "center", fontWeight: 800, fontSize: 15,
                  }}>{r.name.split(" ").map((w) => w[0]).join("")}</div>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: BRAND.ink }}>{r.name}</div>
                    <div style={{ fontSize: 12.5, color: BRAND.grey }}>{r.role} · {r.level} · {r.department}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    {latest && STRANDS.map((a) => {
                      const rating = latest.strands?.[a.key]?.rating;
                      return (
                        <span key={a.key} title={`${a.key}: ${rating || "—"}`} style={{
                          width: 22, height: 22, borderRadius: 7, display: "grid", placeItems: "center",
                          background: rating ? RATING_COLOUR[rating] : BRAND.line, color: "#fff",
                          fontSize: 11, fontWeight: 800,
                        }}>{a.letter}</span>
                      );
                    })}
                    <span style={{
                      fontSize: 12, fontWeight: 700, color: subs.length ? BRAND.ink : "#C0392B",
                      border: `1.5px solid ${subs.length ? BRAND.line : "#E7C9C9"}`, borderRadius: 999, padding: "4px 12px",
                    }}>
                      {subs.length ? `${subs.length} review${subs.length !== 1 ? "s" : ""}` : "No reviews yet"}
                    </span>
                  </div>
                </div>

                {subs.length > 0 && (
                  <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
                    {subs.map((s) => (
                      <details key={s.id} style={{ border: `1px solid ${BRAND.line}`, borderRadius: 10, padding: "10px 14px" }}>
                        <summary style={{ cursor: "pointer", fontSize: 13.5, color: BRAND.ink, display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 650 }}>{FORMS.find((f) => f.id === s.formType)?.name}{s.focus ? ` · Spotlight: ${s.focus}` : ""}</span>
                          <span style={{ color: BRAND.grey, fontSize: 12.5 }}>{s.date} · {s.term} · by {s.reviewer}</span>
                        </summary>
                        <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                          {STRANDS.map((a) => {
                            const cell = s.strands?.[a.key] || {};
                            return (
                              <div key={a.key} style={{ fontSize: 13 }}>
                                <span style={{ display: "inline-block", width: 86, fontWeight: 700, color: a.accent }}>{a.key}</span>
                                <span style={{ display: "inline-block", padding: "1px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700, color: "#fff", background: RATING_COLOUR[cell.rating] || BRAND.grey, marginRight: 8 }}>{cell.rating}</span>
                                <span style={{ color: BRAND.grey }}>{cell.comment}</span>
                              </div>
                            );
                          })}
                          {s.overall && <div style={{ fontSize: 13, color: BRAND.grey }}><em>{s.overall}</em></div>}
                          {s.celebrate && <div style={{ fontSize: 13, color: BRAND.ink, padding: "8px 12px", background: "#FDFBF6", borderRadius: 8 }}><strong>Shout-out:</strong> {s.celebrate}</div>}
                          {s.nextStep && <div style={{ fontSize: 13, color: BRAND.grey }}><strong>Worth trying:</strong> {s.nextStep}</div>}
                          {s.links?.length > 0 && (
                            <div style={{ fontSize: 13 }}>
                              <strong style={{ color: BRAND.grey }}>Linked documents:</strong>{" "}
                              {s.links.map((l, i) => (
                                <a key={i} href={l} target="_blank" rel="noreferrer" style={{ color: BRAND.magenta, marginRight: 10, wordBreak: "break-all" }}>{l}</a>
                              ))}
                            </div>
                          )}
                          <div><PdfButton rec={s} subtle /></div>
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  HELP BOT (wired to Claude API)
 * ------------------------------------------------------------------ */
const BOT_SYSTEM = `You are the BRIT T&L Development Studio assistant for an arts and performing-arts specialist institution. You help staff understand and complete the BRIT lesson framework and its peer review process.

The BRIT framework is the shared, non-judgmental professional language for reviews, learning walks and quality assurance. It answers "what does excellent teaching and learning look like here?" through three lenses: what can you see, what can you hear, and how does it feel? It has four areas:

- Belonging (inclusion and culture; teaching standards 1 and 5): every student is known and greeted — nobody is invisible at the back. Access is proactively planned for neurodiversity and quiet learners. The room reflects who is in it: identities, voices, and a range of work on show. It is safe to take creative risks and fail. Grounded in psychological safety (Amy Edmondson) and attachment and trauma-informed pedagogy.
- Room (the physical and digital environment and how it is used; standards 5 and 7): the spatial layout actively fits the technical and creative tasks. Sightlines work so everyone can see the board, screen, device or demonstration. Resources, cables, floor space and kit are safe, accessible and ready before learning starts. Grounded in the Reggio Emilia idea of the environment as "third teacher" and vocational studio ergonomics.
- Intent (rigour and standards; standards 3 and 4): it is transparent what is being learned and why, not just what is being "done". Living models of excellence are visible, keeping professional, vocational and academic standards aspirational and rigorous. Pitch stretches the strongest without losing anyone. Grounded in Visible Learning (John Hattie) and expert modelling.
- Travel (cognitive processing; standards 2, 4 and 6): students do the heavy cognitive thinking and creative work rather than watching it happen. Direct, purposeful dialogue and targeted questioning dig past surface answers. Formative feedback lands and is acted on in the lesson. Progress is visible in the work — all have moved forward. Grounded in Rosenshine's Principles of Instruction and Dylan Wiliam's formative assessment.

Reviews use three DEVELOPMENTAL DESCRIPTORS, not grades: Developing (practice is taking root), Embedded (consistent everyday practice), Transformational (practice that lifts the whole room). They describe where practice currently sits on an area — never a mark or judgement of the person.

The peer review process: reviews run termly by curriculum area, with pairings built with heads of department around staff availability. Before the lesson, the pair agree ONE narrow focus area — the spotlight. The reviewer records the shared details (date, term, faculty, colleague, reviewer), taps the practice points they noticed, chooses a descriptor for each area, comments in depth on the spotlight area, and closes with a shout-out (something to feel proud of) and optionally one small idea worth trying. At the end of term, staff log a two-minute "Micro-Insight" reflection on the digital reflections noticeboard. Learning Walks are lighter: descriptors per area plus one overall observation.

Important terminology: at this school "strands" means the vocational departments, so never call the four framework areas "strands" — call them areas. Answer in British English, warmly and concisely. If asked about something you do not have — a specific policy detail, a calendar date, a named person's data — say you do not have that and suggest checking with the T&L team. Never invent specifics. Keep answers to a few sentences unless more is genuinely needed.`;

function HelpBot({ open, setOpen }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi — I can help with anything about the BRIT framework and the review process. What do the four areas mean, how do the descriptors work, how to complete a review. What would you like to know?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const starters = [
    "What does the Intent area mean?",
    "What's the difference between Embedded and Transformational?",
    "How do I complete a peer review?",
  ];

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    const next = [...messages, { role: "user", content: q }];
    setMessages(next);
    setInput("");
    setLoading(true);

    // In a standalone deployment the Claude API must be called from a small
    // backend that holds the API key. Set VITE_CHAT_PROXY_URL to that endpoint.
    // See the README for a minimal proxy example.
    const proxyUrl = import.meta.env.VITE_CHAT_PROXY_URL;
    if (!proxyUrl) {
      setMessages((m) => [...m, {
        role: "assistant",
        content: "The assistant isn't wired up in this deployment yet. Everything else in the Studio works without it. To switch it on, add a small backend proxy holding an Anthropic API key and set VITE_CHAT_PROXY_URL. The README explains how.",
      }]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(proxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: BOT_SYSTEM,
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      setMessages((m) => [...m, { role: "assistant", content: text || "Sorry — I couldn't generate a reply just then. Try again?" }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: "Something went wrong reaching the assistant. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        position: "fixed", bottom: 66, right: 24, width: 58, height: 58, borderRadius: "50%",
        background: BRAND.magenta, border: "none", cursor: "pointer", boxShadow: "0 6px 20px rgba(173,34,126,.35)",
        display: "grid", placeItems: "center", zIndex: 50,
      }}>
        <MessageCircle size={26} color="#fff" />
      </button>
    );
  }

  return (
    <div style={{
      position: "fixed", bottom: 66, right: 24, width: 380, maxWidth: "calc(100vw - 32px)", height: 540, maxHeight: "calc(100vh - 110px)",
      background: "#fff", borderRadius: 18, boxShadow: "0 12px 40px rgba(42,30,39,.25)", display: "flex", flexDirection: "column", zIndex: 50,
      border: `1px solid ${BRAND.line}`, overflow: "hidden",
    }}>
      <div style={{ background: BRAND.magenta, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff" }}>
          <Bot size={20} /> <span style={{ fontWeight: 700, fontSize: 15 }}>Process assistant</span>
        </div>
        <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <X size={20} color="#fff" />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 16, background: BRAND.pink }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            <div style={{
              maxWidth: "82%", padding: "10px 13px", borderRadius: 14, fontSize: 14, lineHeight: 1.5,
              whiteSpace: "pre-wrap",
              background: m.role === "user" ? BRAND.magenta : "#fff",
              color: m.role === "user" ? "#fff" : BRAND.ink,
              border: m.role === "user" ? "none" : `1px solid ${BRAND.line}`,
            }}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 4, padding: "10px 13px" }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: BRAND.magenta, opacity: 0.5, animation: `bounce 1s ${i * 0.15}s infinite` }} />
            ))}
          </div>
        )}
        {messages.length === 1 && (
          <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
            {starters.map((s) => (
              <button key={s} onClick={() => send(s)} style={{
                textAlign: "left", padding: "8px 12px", borderRadius: 10, border: `1px solid ${BRAND.line}`,
                background: "#fff", color: BRAND.magenta, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
              }}>{s}</button>
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ padding: 12, borderTop: `1px solid ${BRAND.line}`, display: "flex", gap: 8 }}>
        <input
          style={{ ...inputStyle, borderRadius: 999 }}
          placeholder="Ask about the process…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={() => send()} disabled={loading} style={{
          width: 42, height: 42, borderRadius: "50%", border: "none", background: BRAND.magenta,
          cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0,
        }}>
          <Send size={18} color="#fff" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  ROOT
 * ------------------------------------------------------------------ */
function useNarrow(query = "(max-width: 940px)") {
  const [narrow, setNarrow] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const fn = (e) => setNarrow(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, [query]);
  return narrow;
}

function NavTile({ num, label, colour, active, onClick, narrow }) {
  const base = active
    ? { background: BRAND.pink, color: BRAND.ink, border: `1.5px solid ${BRAND.ink}` }
    : { background: colour, color: "#fff", border: `1.5px solid ${colour}` };
  return (
    <button onClick={onClick} style={{
      ...base, borderRadius: 16, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
      padding: narrow ? "10px 14px" : "14px 14px 16px",
      display: "flex", flexDirection: narrow ? "row" : "column",
      alignItems: narrow ? "center" : "stretch", gap: narrow ? 8 : 0,
      flex: narrow ? "1 1 auto" : undefined,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <span style={{ fontWeight: 800, fontSize: 13 }}>{num}</span>
        {!narrow && (active ? <ArrowRight size={16} /> : <ArrowUpRight size={16} />)}
      </div>
      <span style={{ fontWeight: 750, fontSize: narrow ? 13 : 14.5, marginTop: narrow ? 0 : 40, lineHeight: 1.25 }}>{label}</span>
    </button>
  );
}

const TICKER_ITEMS = [
  "Belonging", "Room", "Intent", "Travel",
  "What can you see?", "What can you hear?", "How does it feel?",
];

function Ticker() {
  const half = (dup) => (
    <div aria-hidden={dup} style={{ display: "flex", alignItems: "center", gap: 28, paddingRight: 28, flexShrink: 0 }}>
      {TICKER_ITEMS.map((t, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 28, whiteSpace: "nowrap" }}>
          <span>{t}</span>
          <span style={{ fontSize: 9, opacity: 0.8 }}>{i % 2 ? "✦" : "◆"}</span>
        </span>
      ))}
    </div>
  );
  return (
    <div style={{
      position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 40, overflow: "hidden",
      background: "#8447B0", color: BRAND.pink, padding: "10px 0",
    }}>
      <div style={{
        display: "flex", width: "max-content", animation: "marquee 32s linear infinite",
        fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: ".08em",
      }}>
        {half(false)}{half(true)}
      </div>
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState("staff");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [botOpen, setBotOpen] = useState(false);
  const narrow = useNarrow();

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent =
      "@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}" +
      "@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}";
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    loadSubmissions().then((list) => { setSubmissions(list); setLoading(false); });
  }, []);

  const addSubmission = (rec) => {
    setSubmissions((prev) => {
      const next = [...prev, rec];
      saveSubmissions(next);
      return next;
    });
  };

  const font = "'Archivo','Helvetica Neue',Arial,sans-serif";
  const nav = [
    { key: "staff", num: "01", label: "All Staff", colour: BRAND.magenta },
    { key: "slt", num: "02", label: "SLT", colour: "#46B749" },
    { key: "manager", num: "03", label: "Line Manager", colour: "#8447B0" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: BRAND.pink, fontFamily: font, color: BRAND.ink }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: narrow ? "16px 16px 90px" : "26px 28px 100px",
        display: "flex", gap: narrow ? 16 : 28,
        flexDirection: narrow ? "column" : "row",
        alignItems: "flex-start",
      }}>
        {/* rail */}
        <aside style={{
          width: narrow ? "100%" : 176, flexShrink: 0,
          position: narrow ? "static" : "sticky", top: 26,
          display: "flex", flexDirection: narrow ? "row" : "column",
          flexWrap: narrow ? "wrap" : "nowrap",
          gap: 12, alignItems: narrow ? "center" : "stretch",
        }}>
          <div style={{ padding: narrow ? "0 4px" : "4px 2px 12px", marginRight: narrow ? 8 : 0 }}>
            <div style={{ fontWeight: 900, fontSize: narrow ? 26 : 34, letterSpacing: "-.04em", lineHeight: 1 }}>
              studio<span style={{ color: BRAND.magenta }}>.</span>
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".16em", color: BRAND.grey, marginTop: 5 }}>
              BRIT T&amp;L DEVELOPMENT
            </div>
          </div>
          {nav.map((n) => (
            <NavTile key={n.key} {...n} narrow={narrow} active={role === n.key}
              onClick={() => { setRole(n.key); setSelectedForm(null); }} />
          ))}
          <NavTile num="04" label="Ask the assistant" colour="#C2651A" narrow={narrow}
            active={false} onClick={() => setBotOpen(true)} />
          {!narrow && (
            <div style={{ fontSize: 10.5, fontWeight: 600, color: BRAND.grey, letterSpacing: ".06em", padding: "6px 2px" }}>
              BRIT FRAMEWORK · PROTOTYPE
            </div>
          )}
        </aside>

        {/* body */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <p style={{ color: BRAND.grey }}>Loading…</p>
          ) : role === "staff" ? (
            selectedForm
              ? <ReviewForm formId={selectedForm} onBack={() => setSelectedForm(null)} onSubmit={addSubmission} />
              : <FormSelector onSelect={setSelectedForm} />
          ) : role === "manager" ? (
            <ManagerDashboard submissions={submissions} />
          ) : (
            <SLTDashboard submissions={submissions} />
          )}
        </main>
      </div>

      <Ticker />
      <HelpBot open={botOpen} setOpen={setBotOpen} />
    </div>
  );
}
