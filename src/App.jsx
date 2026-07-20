import React, { useState, useEffect, useRef } from "react";
import {
  Home, ClipboardList, Users, BarChart3, MessageCircle, Send, X,
  ArrowLeft, Plus, ShieldAlert, CheckCircle, ChevronDown, Sparkles,
  Search, Bot, Lock, GraduationCap, ClipboardCheck
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

const STRANDS = [
  {
    key: "Belonging",
    // NOTE: placeholder descriptor — replace with the real BRIT framework definition
    desc: "Every student feels seen, safe and part of the group; relationships and inclusion are visible in the room.",
  },
  {
    key: "Room",
    desc: "The learning environment — physical, digital and emotional — is set up so students can do their best work.",
  },
  {
    key: "Intent",
    desc: "The purpose of the learning is clear, shared and worth pursuing; students understand why they are doing what they are doing.",
  },
  {
    key: "Travel",
    desc: "Learning moves forward; students make progress and can see how far they have come and where they are going.",
  },
];

const RATINGS = ["Developing", "Embedded", "Transformational"];
const RATING_COLOUR = {
  Developing: BRAND.developing,
  Embedded: BRAND.embedded,
  Transformational: BRAND.transformational,
};

const TERMS = ["Autumn 1", "Autumn 2", "Spring 1", "Spring 2", "Summer 1", "Summer 2"];
const FACULTIES = [
  "Theatre", "Musical Theatre", "Music", "Dance",
  "Film & Media Production", "Games Design & VFX",
  "Visual Arts & Design", "Production Arts", "Interactive Digital Design",
];

const FORMS = [
  {
    id: "peer-review",
    name: "Peer Review",
    blurb: "Developmental review against the four BRIT framework strands, with comments per strand.",
    icon: ClipboardCheck,
    profile: "staff",
    active: true,
  },
  {
    id: "learning-walk",
    name: "Learning Walk",
    blurb: "Lighter-touch walk rated against the strands, with a single overall observation.",
    icon: Users,
    profile: "staff",
    active: true,
  },
  {
    id: "aen-review",
    name: "AEN Review",
    blurb: "Captures pupil additional-needs information — different data profile, held separately.",
    icon: ShieldAlert,
    profile: "pupil",
    active: false,
  },
];

const STORAGE_KEY = "brit-tl-studio-submissions-v1";

/* ------------------------------------------------------------------ *
 *  SEED DATA (so the SLT view is alive on first open)
 * ------------------------------------------------------------------ */
function mk(id, formType, date, term, faculty, reviewee, reviewer, ratings, comments) {
  const strands = {};
  STRANDS.forEach((s, i) => {
    strands[s.key] = { rating: ratings[i], comment: comments[i] || "" };
  });
  return {
    id, formType, submittedAt: date,
    date, term, academicYear: "2026/27", faculty, reviewee, reviewer, strands,
    overall: formType === "learning-walk" ? (comments[4] || "") : "",
  };
}

const SEED = [
  mk("s1", "peer-review", "2026-09-18", "Autumn 1", "Theatre", "Amara Okafor", "Daniel Price",
    ["Embedded", "Embedded", "Transformational", "Developing"],
    ["Warm start, names used throughout, clear routines.",
     "Studio reset quickly between exercises, sightlines good.",
     "Students could articulate the why of the devising task without prompting.",
     "Progress within the lesson clear, though longer-arc journey less visible."]),
  mk("s2", "peer-review", "2026-09-22", "Autumn 1", "Games Design & VFX", "Leah Sturrock", "Priya Nair",
    ["Developing", "Embedded", "Transformational", "Developing"],
    ["A few students on the edges, less drawn in during the brief.",
     "Dual-screen setup worked well for the pipeline demo.",
     "Purpose of the sprint framed brilliantly against a real client scenario.",
     "Hard to see individual progress across the session."]),
  mk("s3", "peer-review", "2026-10-02", "Music", "Autumn 2", "Marcus Bell", "Sofia Andrews",
    ["Transformational", "Transformational", "Embedded", "Embedded"], // note: term/faculty order handled below
    ["Every student contributed; genuine ensemble belonging.",
     "Room configured for both rehearsal and feedback, seamless.",
     "Intent clear, could sharpen the link to the assessment brief.",
     "Good visible gains on the arrangement task."]),
  mk("s4", "peer-review", "2026-10-09", "Autumn 2", "Film & Media Production", "Yusuf Rahman", "Daniel Price",
    ["Embedded", "Developing", "Transformational", "Embedded"],
    ["Strong rapport, inclusive questioning.",
     "Kit distribution ate into time; space felt tight for the group size.",
     "Learning purpose exceptionally clear and student-owned.",
     "Progress evident across the edit task."]),
  mk("s5", "peer-review", "2026-10-14", "Autumn 2", "Dance", "Priya Nair", "Amara Okafor",
    ["Embedded", "Embedded", "Embedded", "Transformational"],
    ["Inclusive, quieter students given space.",
     "Studio well used, clear zones.",
     "Purpose shared and understood.",
     "Exceptional visible travel — students named their own next steps."]),
  mk("s6", "peer-review", "2026-11-05", "Autumn 2", "Visual Arts & Design", "Sofia Andrews", "Leah Sturrock",
    ["Developing", "Embedded", "Transformational", "Developing"],
    ["Belonging building; a couple of students disengaged early.",
     "Studio set up well for independent work.",
     "Intent outstanding — critique framed with real purpose.",
     "Journey across the project less visible in a single visit."]),
  mk("s7", "learning-walk", "2026-09-25", "Autumn 1", "Musical Theatre", "Daniel Price", "Kerry Western",
    ["Embedded", "Embedded", "Transformational", "Embedded"],
    ["", "", "", "", "Purpose strong across all three rooms; belonging solid; travel visible in the vocal work."]),
  mk("s8", "learning-walk", "2026-10-08", "Autumn 2", "Production Arts", "Marcus Bell", "Kerry Western",
    ["Developing", "Developing", "Embedded", "Developing"],
    ["", "", "", "", "Environment and belonging need attention; intent clear but travel hard to read on a walk."]),
  mk("s9", "peer-review", "2026-11-12", "Autumn 2", "Interactive Digital Design", "Amara Okafor", "Yusuf Rahman",
    ["Transformational", "Embedded", "Transformational", "Embedded"],
    ["Genuinely inclusive, every voice mattered.",
     "Lab set up for pair programming, worked well.",
     "Intent razor-sharp, tied to a live brief.",
     "Good gains, students could self-assess."]),
  mk("s10", "peer-review", "2026-11-18", "Autumn 2", "Theatre", "Leah Sturrock", "Sofia Andrews",
    ["Embedded", "Transformational", "Embedded", "Developing"],
    ["Strong belonging, clear rituals.",
     "Studio transformed for the promenade piece — superb use of space.",
     "Purpose understood, could push articulation further.",
     "Travel less clear within the single session."]),
  mk("s11", "learning-walk", "2026-11-20", "Autumn 2", "Music", "Priya Nair", "Kerry Western",
    ["Embedded", "Transformational", "Transformational", "Embedded"],
    ["", "", "", "", "Room and intent both excellent; belonging embedded; travel evident in the composition task."]),
];
// Fix the two seed rows where I put faculty/term in swapped order for readability
SEED[2].term = "Autumn 2"; SEED[2].faculty = "Music";

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
function FormSelector({ onSelect }) {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: BRAND.ink, margin: "0 0 4px" }}>Choose a form</h2>
      <p style={{ color: BRAND.grey, margin: "0 0 24px", fontSize: 14 }}>
        Every form opens with the same core details, so the data lines up across forms and across years.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
        {FORMS.map((f) => {
          const Icon = f.icon;
          const disabled = !f.active;
          return (
            <Card
              key={f.id}
              onClick={() => f.active && onSelect(f.id)}
              style={{
                padding: 20, cursor: f.active ? "pointer" : "default",
                opacity: disabled ? 0.72 : 1, position: "relative",
                borderColor: f.profile === "pupil" ? "#E7C9C9" : BRAND.line,
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center",
                background: f.profile === "pupil" ? "#FBEDED" : BRAND.pink, marginBottom: 14,
              }}>
                <Icon size={22} color={f.profile === "pupil" ? "#C0392B" : BRAND.magenta} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: BRAND.ink }}>{f.name}</div>
              <div style={{ fontSize: 13, color: BRAND.grey, marginTop: 6, lineHeight: 1.5 }}>{f.blurb}</div>
              {f.profile === "pupil" && (
                <div style={{ marginTop: 12, fontSize: 11, fontWeight: 600, color: "#C0392B", display: "flex", alignItems: "center", gap: 6 }}>
                  <Lock size={13} /> Held under separate governance
                </div>
              )}
            </Card>
          );
        })}
        <Card style={{ padding: 20, display: "grid", placeItems: "center", borderStyle: "dashed", color: BRAND.grey }}>
          <div style={{ textAlign: "center" }}>
            <Plus size={22} color={BRAND.grey} />
            <div style={{ fontSize: 13, marginTop: 8 }}>Add a form<br />(future years)</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  SHARED SPINE FIELDS
 * ------------------------------------------------------------------ */
function SpineFields({ v, set }) {
  return (
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
      <Field label="Faculty / subject">
        <select style={inputStyle} value={v.faculty} onChange={(e) => set("faculty", e.target.value)}>
          <option value="">Select…</option>
          {FACULTIES.map((f) => <option key={f}>{f}</option>)}
        </select>
      </Field>
      <Field label="Staff member reviewed">
        <input style={inputStyle} value={v.reviewee} placeholder="Full name" onChange={(e) => set("reviewee", e.target.value)} />
      </Field>
      <Field label="Reviewer">
        <input style={inputStyle} value={v.reviewer} placeholder="Full name" onChange={(e) => set("reviewer", e.target.value)} />
      </Field>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  FORMS
 * ------------------------------------------------------------------ */
function ReviewForm({ formId, onBack, onSubmit }) {
  const isWalk = formId === "learning-walk";
  const meta = FORMS.find((f) => f.id === formId);
  const [spine, setSpine] = useState({
    date: "", term: "", academicYear: "2026/27", faculty: "", reviewee: "", reviewer: "",
  });
  const [strands, setStrands] = useState(
    STRANDS.reduce((a, s) => ({ ...a, [s.key]: { rating: "", comment: "" } }), {})
  );
  const [overall, setOverall] = useState("");
  const [done, setDone] = useState(false);

  const setSpineField = (k, val) => setSpine((s) => ({ ...s, [k]: val }));
  const setRating = (k, r) => setStrands((s) => ({ ...s, [k]: { ...s[k], rating: r } }));
  const setComment = (k, c) => setStrands((s) => ({ ...s, [k]: { ...s[k], comment: c } }));

  const complete =
    Object.values(spine).every((x) => x.trim()) &&
    STRANDS.every((s) => strands[s.key].rating);

  const submit = () => {
    const record = {
      id: "r" + Date.now(),
      formType: formId,
      submittedAt: new Date().toISOString().slice(0, 10),
      ...spine,
      strands,
      overall: isWalk ? overall : "",
    };
    onSubmit(record);
    setDone(true);
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
        <button onClick={onBack} style={{
          padding: "10px 20px", borderRadius: 999, border: "none", background: BRAND.magenta,
          color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14,
        }}>Back to forms</button>
      </Card>
    );
  }

  return (
    <div>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: BRAND.magenta, cursor: "pointer", fontSize: 14, fontWeight: 600, marginBottom: 16, padding: 0 }}>
        <ArrowLeft size={16} /> All forms
      </button>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: BRAND.ink, margin: "0 0 4px" }}>{meta.name}</h2>
      <p style={{ color: BRAND.grey, margin: "0 0 22px", fontSize: 14 }}>
        The three descriptors below describe practice developmentally. They are not grades.
      </p>

      <Card style={{ padding: 22, marginBottom: 20 }}>
        <SpineFields v={spine} set={setSpineField} />
      </Card>

      {STRANDS.map((s) => (
        <Card key={s.key} style={{ padding: 22, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: BRAND.magenta }}>{s.key}</div>
          </div>
          <div style={{ fontSize: 13, color: BRAND.grey, margin: "4px 0 14px", lineHeight: 1.5 }}>{s.desc}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: isWalk ? 0 : 14 }}>
            {RATINGS.map((r) => (
              <Pill key={r} active={strands[s.key].rating === r} colour={RATING_COLOUR[r]} onClick={() => setRating(s.key, r)}>
                {r}
              </Pill>
            ))}
          </div>
          {!isWalk && (
            <textarea
              style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
              placeholder={`What did you notice for ${s.key}?`}
              value={strands[s.key].comment}
              onChange={(e) => setComment(s.key, e.target.value)}
            />
          )}
        </Card>
      ))}

      {isWalk && (
        <Card style={{ padding: 22, marginBottom: 16 }}>
          <Field label="Overall observation">
            <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} value={overall}
              placeholder="One reflection across the walk" onChange={(e) => setOverall(e.target.value)} />
          </Field>
        </Card>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8 }}>
        <button disabled={!complete} onClick={submit} style={{
          padding: "12px 24px", borderRadius: 999, border: "none",
          background: complete ? BRAND.magenta : BRAND.line,
          color: complete ? "#fff" : BRAND.grey, fontWeight: 700, fontSize: 14,
          cursor: complete ? "pointer" : "not-allowed",
        }}>Submit review</button>
        {!complete && <span style={{ fontSize: 13, color: BRAND.grey }}>Complete all details and a rating for each strand.</span>}
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
          <h2 style={{ fontSize: 22, fontWeight: 700, color: BRAND.ink, margin: "0 0 4px" }}>Analytics</h2>
          <p style={{ color: BRAND.grey, margin: 0, fontSize: 14 }}>Thematic and developmental — no scores, no league tables.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <select style={{ ...inputStyle, width: "auto" }} value={formFilter} onChange={(e) => setFormFilter(e.target.value)}>
            <option value="all">All forms</option>
            {FORMS.filter((f) => f.active).map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
          <select style={{ ...inputStyle, width: "auto" }} value={facultyFilter} onChange={(e) => setFacultyFilter(e.target.value)}>
            <option value="all">All faculties</option>
            {FACULTIES.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
      </div>

      {/* stat row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 14, marginBottom: 22 }}>
        {[
          { label: "Reviews in view", value: filtered.length },
          { label: "Transformational ratings", value: totalT, colour: BRAND.green },
          { label: "Faculties covered", value: new Set(filtered.map((s) => s.faculty)).size },
        ].map((stat) => (
          <Card key={stat.label} style={{ padding: 18 }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: stat.colour || BRAND.magenta }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: BRAND.grey, marginTop: 2 }}>{stat.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px,1fr))", gap: 18, marginBottom: 22 }}>
        <Card style={{ padding: 22 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, color: BRAND.ink }}>Where each strand sits</h3>
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
                <div style={{ fontSize: 12, color: BRAND.grey, marginTop: 4 }}>Reviewer: {s.reviewer}</div>
              </div>
            </details>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  HELP BOT (wired to Claude API)
 * ------------------------------------------------------------------ */
const BOT_SYSTEM = `You are the BRIT T&L Development Studio assistant for an arts and performing-arts specialist institution. You help staff understand and complete the BRIT framework peer review process.

The BRIT framework is developmental and UNGRADED. It has four strands:
- Belonging: every student feels seen, safe and part of the group; relationships and inclusion are visible.
- Room: the learning environment (physical, digital and emotional) is set up so students can do their best work.
- Intent: the purpose of the learning is clear, shared and worth pursuing; students understand why.
- Travel: learning moves forward; students make progress and can see how far they have come.

Reviews use three DEVELOPMENTAL DESCRIPTORS, not grades: Developing, Embedded, Transformational. These describe where practice currently sits on a strand — they are not scores and must never be framed as a mark or judgement of the person.

The process: a reviewer observes a colleague, records the shared details (date, term, faculty, staff member reviewed, reviewer), then for each of the four strands selects a descriptor and writes a short comment on what they noticed. Learning Walks are lighter and rate the strands with a single overall observation.

(These strand definitions are working placeholders in this prototype and may differ from the institution's final wording.)

Answer in British English, warmly and concisely. If asked about something you do not have — a specific policy detail, a calendar date, a named person's data — say you do not have that and suggest checking with the T&L team. Never invent specifics. Keep answers to a few sentences unless more is genuinely needed.`;

function HelpBot({ open, setOpen }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi — I can help with anything about the BRIT framework and the review process. What do the strands mean, how do the descriptors work, how to complete a review. What would you like to know?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const starters = [
    "What does the Intent strand mean?",
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
        position: "fixed", bottom: 24, right: 24, width: 58, height: 58, borderRadius: "50%",
        background: BRAND.magenta, border: "none", cursor: "pointer", boxShadow: "0 6px 20px rgba(173,34,126,.35)",
        display: "grid", placeItems: "center", zIndex: 50,
      }}>
        <MessageCircle size={26} color="#fff" />
      </button>
    );
  }

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, width: 380, maxWidth: "calc(100vw - 32px)", height: 540, maxHeight: "calc(100vh - 48px)",
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
export default function App() {
  const [role, setRole] = useState("staff");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [botOpen, setBotOpen] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = "@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}";
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

  const font = "'Jost','Century Gothic','Futura',sans-serif";

  return (
    <div style={{ minHeight: "100vh", background: BRAND.pink, fontFamily: font, color: BRAND.ink }}>
      {/* header */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BRAND.line}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: BRAND.magenta, display: "grid", placeItems: "center" }}>
              <GraduationCap size={22} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-.01em" }}>BRIT T&amp;L Development Studio</div>
              <div style={{ fontSize: 12, color: BRAND.grey }}>BRIT framework · prototype</div>
            </div>
          </div>
          <div style={{ display: "flex", background: BRAND.pink, borderRadius: 999, padding: 4 }}>
            {[["staff", "All Staff", ClipboardList], ["slt", "SLT", BarChart3]].map(([key, label, Icon]) => (
              <button key={key} onClick={() => { setRole(key); setSelectedForm(null); }} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 999, border: "none",
                cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "inherit",
                background: role === key ? "#fff" : "transparent",
                color: role === key ? BRAND.magenta : BRAND.grey,
                boxShadow: role === key ? "0 1px 4px rgba(0,0,0,.08)" : "none",
              }}>
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* body */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px 80px" }}>
        {loading ? (
          <p style={{ color: BRAND.grey }}>Loading…</p>
        ) : role === "staff" ? (
          selectedForm
            ? <ReviewForm formId={selectedForm} onBack={() => setSelectedForm(null)} onSubmit={addSubmission} />
            : <FormSelector onSelect={setSelectedForm} />
        ) : (
          <SLTDashboard submissions={submissions} />
        )}
      </div>

      <HelpBot open={botOpen} setOpen={setBotOpen} />
    </div>
  );
}
