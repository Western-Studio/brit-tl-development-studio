import React, { useState, useEffect, useRef } from "react";
import {
  Home, ClipboardList, Users, BarChart3, MessageCircle, Send, X,
  ArrowLeft, ArrowRight, ArrowUpRight, Plus, ShieldAlert, CheckCircle,
  ChevronDown, Sparkles, Search, Bot, Lock, GraduationCap, ClipboardCheck,
  Camera, Lightbulb
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend
} from "recharts";
import "@fontsource/archivo/400.css";
import "@fontsource/archivo/500.css";
import "@fontsource/archivo/600.css";
import "@fontsource/archivo/700.css";
import "@fontsource/archivo/800.css";
import "@fontsource/archivo/900.css";
import "@fontsource/anton/400.css";

/* ------------------------------------------------------------------ *
 *  BRAND + FRAMEWORK CONSTANTS
 * ------------------------------------------------------------------ */
const BRAND = {
  magenta: "#AD227E",
  pink: "#F8F1F6",
  green: "#46B749",
  ink: "#2A1E27",
  grey: "#6B5E66",
  line: "#DCC7D4",
  developing: "#B9A7B4",   // soft, neutral - not a "fail" red
  embedded: "#AD227E",     // brand magenta
  transformational: "#46B749", // brand green
};

// The BRIT framework - its four areas ("strands" is reserved for departments).
// "What can you see, hear, and how does it feel?"
const STRANDS = [
  {
    key: "Belonging",
    letter: "B",
    accent: "#AD227E",
    pastel: "#F8E9F2",
    focus: "Inclusion and culture",
    ts: "TS 1 · 5",
    desc: "Inclusion and culture - every student is known, expected, and safe enough to take creative risks.",
    practice: [
      "Every student is known and greeted - nobody is invisible at the back",
      "Access is proactively planned for neurodiversity and quiet learners",
      "The room reflects who is in it: identities, voices, a range of work on show",
      "It is safe to take creative risks - and to fail",
      "Names are used - in greetings, questions and feedback",
      "Every voice is drawn in, not just the confident ones",
      "The learning facilitator is introduced and collaborated with - a teaching partnership, not an extra pair of hands",
      "Students work as a company - leading, following, negotiating, building trust",
    ],
    research: [
      { name: "Psychological safety - Amy Edmondson", note: "An environment free from interpersonal fear, so students will experiment creatively." },
      { name: "Attachment & trauma-informed pedagogy", note: "Relational security as the foundation for academic and artistic engagement." },
    ],
    levels: {
      Developing: "Warm moments are appearing. Some students are known and greeted; a few can still drift to the edges unseen.",
      Embedded: "Every student is known, greeted and expected. Access for neurodiversity and quieter learners is planned as a matter of routine.",
      Transformational: "The room visibly reflects who is in it - identities, voices and work on show - and it is genuinely safe to take creative risks and fail.",
    },
  },
  {
    key: "Room",
    letter: "R",
    accent: "#8447B0",
    pastel: "#F2ECF8",
    focus: "The physical and digital environment, and how it is used",
    ts: "TS 5 · 7",
    desc: "The physical and digital environment - the space works for the task before learning starts.",
    practice: [
      "The spatial layout actively fits the technical and creative task",
      "Sightlines work - everyone can see the board, screen, device or demonstration",
      "Resources, cables, floor space and kit are safe, accessible and ready",
      "The environment is set before learning starts, not during it",
      "Digital tools genuinely support the task, not distract from it",
      "The room is neuroinclusive - sensory load is considered, and every learner has a way to engage comfortably",
      "What's on the walls reflects the learners in the room, and models excellence",
      "The digital space is as organised as the physical one - Google Classroom is accessible and easy to navigate",
      "AI supports access to learning - a NotebookLM or Gem puts the course resources at students' fingertips",
      "Access tools are a normal part of the room - text-to-speech, dictation, visual timetables",
    ],
    research: [
      { name: "Reggio Emilia - the “third teacher”", note: "The physical environment as a teacher in its own right. Rooted in Early Years, highly relevant to 14–19 studio pedagogy." },
      { name: "Vocational studio ergonomics", note: "Industry-standard workspace setups that build professional accountability, health and safety awareness, and technical discipline." },
    ],
    levels: {
      Developing: "The space is functional but not yet working for every learner - set-up can eat into learning time, sensory load isn't yet considered, and the digital space takes effort to navigate.",
      Embedded: "Physical and digital spaces are both set before learning starts - layout, sightlines and kit fit the task, sensory load is planned for, the walls reflect the learners and model excellence, and Google Classroom is organised enough for students to help themselves.",
      Transformational: "The room works as a third teacher - a neuroinclusive, multi-sensory, industry-standard environment that students help to own, run and reset, with AI-supported digital access (NotebookLM, Gems) so every learner can reach the course independently.",
    },
  },
  {
    key: "Intent",
    letter: "I",
    accent: "#C2651A",
    pastel: "#FAF0E4",
    focus: "Rigour and standards",
    ts: "TS 3 · 4",
    desc: "Rigour and standards - it is transparent what is being learned and why, and excellence is visible in the room.",
    practice: [
      "It is transparent what is being learned and why - not just what is being “done”",
      "Living models of excellence are visible in the room",
      "Professional, vocational and academic standards stay aspirational and rigorous",
      "Pitch stretches the strongest without losing anyone",
      "Success criteria are concrete, not vague",
      "The why connects to industry, audience or assessment",
      "The work has an audience beyond the teacher - performed, published, pitched or used",
      "Redrafting is normal - critique makes the work better",
    ],
    research: [
      { name: "Visible Learning - John Hattie", note: "Clear learning intentions so students can explicitly monitor their own progress." },
      { name: "Expert modelling", note: "Living exemplars of high-level vocational and academic outcomes that scaffold student ambition." },
    ],
    levels: {
      Developing: "Students can say what they are doing, but not always what they are learning - or why it matters - yet.",
      Embedded: "What is being learned, and why, is transparent and connects to industry, audience or assessment. Visible models of excellence keep standards aspirational.",
      Transformational: "The work matters to someone beyond the room - performed, published, pitched or used - and students hold the standard for themselves because the audience is real.",
    },
  },
  {
    key: "Travel",
    letter: "T",
    accent: "#46B749",
    pastel: "#EAF6EB",
    focus: "Cognitive processing",
    ts: "TS 2 · 4 · 6",
    desc: "Cognitive processing - students do the heavy thinking, feedback lands in the lesson, and progress is visible in the work.",
    practice: [
      "Students do the heavy cognitive thinking and creative work - not just watching it happen",
      "Direct, purposeful dialogue and targeted questioning dig past surface answers",
      "Formative feedback lands and is acted on within the lesson",
      "Progress is visible in the work - all have moved forward",
      "Students can say how their work has improved",
      "Misconceptions are caught and unpicked in the moment",
      "Students make real choices about how they work",
      "Ideas travel - learning from one context shows up in another",
      "Struggle is healthy - being stuck is treated as part of learning",
      "Learning is multi-sensory - seeing, hearing, moving and doing all have a place",
      "Students create with digital tools, not just consume",
      "Transitions keep everyone learning - including those who finish first",
    ],
    research: [
      { name: "Principles of Instruction - Barak Rosenshine", note: "Effective questioning, checking for understanding, and guiding student practice." },
      { name: "Formative assessment - Dylan Wiliam", note: "Immediate, actionable feedback cycles that let students refine their work in the moment." },
    ],
    levels: {
      Developing: "The teacher is still doing much of the heavy thinking, and the next step usually comes from them.",
      Embedded: "Students do the heavy cognitive and creative work, make real choices about how they work, and act on feedback in the lesson.",
      Transformational: "Students set direction and manage the journey - making decisions, recovering from mistakes, and carrying learning into new contexts. Every student can name their own next step. Crew, not passengers.",
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

// Simulated staff directory. In production this syncs from BromCom - names,
// levels and line management - and the app sits behind staff login.
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
    id: "device-walk",
    name: "Device & Phone Walk",
    blurb: "Is the phone-box policy landing - and what is the impact on teaching and learning?",
    icon: Lock,
    profile: "staff",
    active: true,
  },
  {
    id: "dept-review",
    name: "Departmental Review",
    blurb: "Termly department-level review by the head of department, across the four areas.",
    icon: Home,
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

// v4: adds the Device & Phone Walk seeds and walk spotlight foci. The key
// bump makes browsers holding an old seed reseed (demo data resets).
const STORAGE_KEY = "brit-tl-studio-submissions-v4";

// The device & phone policy, as checked on a Device & Phone Walk.
const POLICY_CHECKS = [
  { key: "phoneBox", label: "Phones in the box at the start of the lesson" },
  { key: "headphones", label: "Headphones off and away unless directed" },
  { key: "chromebookOnly", label: "No smart devices other than Chromebooks" },
];
const DEVICE_SCALE = [
  { label: "In place", colour: "#46B749" },
  { label: "Mostly - needed a nudge", colour: "#C2651A" },
  { label: "Not yet", colour: "#C0392B" },
];
const CLASSTOOLS_SCALE = [
  { label: "Working well", colour: "#46B749" },
  { label: "Patchy", colour: "#C2651A" },
  { label: "Not really working", colour: "#C0392B" },
];

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
    inquiry: extra.inquiry || "",
    lessonFocus: extra.lessonFocus || "",
    priorContext: extra.priorContext || "",
    yearGroup: extra.yearGroup || "",
    className: extra.className || "",
    lessonTitle: extra.lessonTitle || "",
    aen: extra.aen || "",
    celebrate: extra.celebrate || "",
    evenBetterIf: extra.evenBetterIf || "",
    nextStep: extra.nextStep || "",
    links: extra.links || [],
    walkEntries: extra.walkEntries || [],
    supportNeeded: extra.supportNeeded || "",
    overall: formType === "learning-walk" ? (comments[4] || "") : "",
  };
}

const SEED = [
  mk("s1", "peer-review", "2026-09-18", "Term 1", "Theatre", "Amara Okafor", "Daniel Price",
    ["Embedded", "Embedded", "Embedded", "Developing"],
    ["Every student greeted by name at the door, and the register doubled as a check-in. Two quieter students had planned entry points into the devising task - nobody was invisible at the back.",
     "",
     "Students could articulate the why of the devising task without prompting.",
     "Progress within the lesson clear, though the longer arc was less visible in one visit."],
    {
      focus: "Belonging",
      noticed: { Belonging: pick("Belonging", 0, 1, 3), Travel: pick("Travel", 2) },
      celebrate: "The check-in ritual at the door - students visibly arrived ready because someone expected them.",
      nextStep: "Try handing the warm-down reflection to a student to lead, once a fortnight.",
    }),
  mk("s2", "peer-review", "2026-09-22", "Term 1", "Digital Arts", "Leah Sturrock", "Priya Nair",
    ["Developing", "Embedded", "Transformational", "Developing"],
    ["A few students on the edges, less drawn in during the brief.",
     "Dual-screen setup worked well for the pipeline demo.",
     "The sprint was framed against a live client brief with last year's showreel running as a living model of excellence - students could say exactly what they were learning and why it mattered.",
     ""],
    {
      focus: "Intent",
      inquiry: "I want to investigate how framing project briefs around live clients affects how clearly students can articulate what they're learning and why.",
      yearGroup: "Year 13", className: "13A Digital Arts", lessonTitle: "Client sprint - motion identity", aen: "4",
      lessonFocus: "Students can pitch their motion-identity concept against the client brief, justifying design choices in industry language.",
      priorContext: "Second week of the sprint; two students joined the course late and are still finding the pipeline.",
      noticed: { Intent: pick("Intent", 0, 1), Room: pick("Room", 1) },
      celebrate: "The client framing - the room believed the work was real, because it was.",
      nextStep: "A two-minute scan for who's drifting at the back during briefings.",
      links: ["https://docs.google.com/document/d/demo-sprint-brief"],
    }),
  mk("s3", "peer-review", "2026-10-02", "Term 2", "Music", "Marcus Bell", "Sofia Andrews",
    ["Transformational", "Transformational", "Embedded", "Embedded"],
    ["Genuine ensemble culture - every student contributed, and risk-taking in the improvisation felt completely safe. The wall of work-in-progress made the room feel owned by the people in it.",
     "Configured for both rehearsal and feedback without a reset - seamless.",
     "Intent clear; the link to the assessment brief could be sharpened.",
     ""],
    {
      focus: "Belonging",
      noticed: { Belonging: pick("Belonging", 0, 2, 3), Room: pick("Room", 2), Travel: pick("Travel", 3) },
      celebrate: "An ensemble where it is visibly safe to fail - that culture takes years to build, and it shows.",
    }),
  mk("s4", "peer-review", "2026-10-09", "Term 2", "Film & Media Production", "Yusuf Rahman", "Daniel Price",
    ["Embedded", "Developing", "Transformational", "Embedded"],
    ["Strong rapport, inclusive questioning.",
     "Kit distribution ate the first ten minutes and the space felt tight for the group size. Once running, sightlines to the edit demo worked well - set-up before the lesson would buy that time back.",
     "Learning purpose exceptionally clear and student-owned.",
     "Progress evident across the edit task."],
    {
      focus: "Room",
      inquiry: "I want to explore how the first ten minutes of set-up affect how quickly students settle into focused edit work.",
      yearGroup: "Year 12", className: "12B Film", lessonTitle: "Editing rhythm - montage sequences", aen: "3",
      lessonFocus: "Students can make deliberate pacing decisions in a montage edit and explain why they made them.",
      noticed: { Room: pick("Room", 1), Intent: pick("Intent", 0), Travel: pick("Travel", 3) },
      celebrate: "The edit demo itself was superb - clear, well paced, and students leaned in.",
      nextStep: "Stage the kit trolleys before the lesson, so the environment is set before learning starts.",
    }),
  mk("s5", "peer-review", "2026-10-14", "Term 2", "Dance", "Priya Nair", "Amara Okafor",
    ["Embedded", "Embedded", "Embedded", "Transformational"],
    ["Inclusive - quieter students given planned space.",
     "",
     "Purpose shared and understood.",
     "Students did the heavy thinking throughout. Feedback from the mid-point showing landed and was acted on before the end, and every dancer could name their own next step."],
    {
      focus: "Travel",
      noticed: { Travel: pick("Travel", 0, 2, 3), Belonging: pick("Belonging", 1) },
      celebrate: "The moment the dancers self-corrected after the showing without being told - that is Travel.",
    }),
  mk("s6", "peer-review", "2026-11-05", "Term 2", "Visual Art & Design", "Sofia Andrews", "Leah Sturrock",
    ["Developing", "Embedded", "Transformational", "Developing"],
    ["Belonging building; a couple of students disengaged early.",
     "",
     "Critique was framed with real purpose against professional exemplars on the wall - standards felt aspirational without being out of reach.",
     "The journey across the project was less visible in a single visit."],
    {
      focus: "Intent",
      noticed: { Intent: pick("Intent", 1, 2) },
      celebrate: "The critique culture - generous, rigorous, and completely student-led by the end.",
      nextStep: "Name the learning (not just the task) at the top of the session, so the why is as visible as the what.",
    }),
  mk("s7", "learning-walk", "2026-09-25", "Term 1", "Musical Theatre", "Grace Adeyemi", "Kerry Western",
    ["Embedded", "Embedded", "Transformational", "Embedded"],
    ["", "", "", "", "Mobile-phones check-in walk across three rooms: policy landing well. Intent strong everywhere; belonging solid; travel visible in the vocal work."],
    { focus: "Room", className: "Across three rooms" }),
  mk("s8", "learning-walk", "2026-10-08", "Term 2", "Production Arts", "Elena Petrova", "Kerry Western",
    ["Developing", "Developing", "Embedded", "Developing"],
    ["", "", "", "", "Belonging-focus walk: students arrived to an unset space and a quiet welcome - environment and greeting both need attention. Intent clear; travel hard to read on a walk."],
    { focus: "Belonging", className: "13C Production Arts" }),
  mk("s9", "peer-review", "2026-11-12", "Term 2", "Music Technology", "Jordan Mackey", "Yusuf Rahman",
    ["Transformational", "Embedded", "Transformational", "Embedded"],
    ["Genuinely inclusive pair programming - rotations planned so quieter students took the driving seat, and every voice mattered in the stand-up.",
     "Lab set up for pairing before students arrived.",
     "Intent razor-sharp, tied to a live brief.",
     "Good gains; students could self-assess against the brief."],
    {
      focus: "Belonging",
      noticed: { Belonging: pick("Belonging", 0, 1), Intent: pick("Intent", 0), Travel: pick("Travel", 1) },
      celebrate: "Quieter students literally in the driving seat - inclusion by design, not by luck.",
    }),
  mk("s10", "peer-review", "2026-11-18", "Term 2", "Musical Theatre", "Grace Adeyemi", "Sofia Andrews",
    ["Embedded", "Transformational", "Embedded", "Developing"],
    ["Strong belonging, clear rituals.",
     "The studio transformed for the promenade piece - zones, sightlines and safety all considered, and students reset the space themselves like a working company.",
     "Purpose understood; articulation could be pushed further.",
     ""],
    {
      focus: "Room",
      noticed: { Room: pick("Room", 0, 1, 3), Belonging: pick("Belonging", 3) },
      celebrate: "A room run like a professional company - the students owned the space.",
      nextStep: "Capture the reset routine as a one-page company call sheet other groups could borrow.",
    }),
  mk("d1", "dept-review", "2026-11-27", "Term 1", "Theatre", "Theatre - department", "Daniel Price",
    ["Embedded", "Embedded", "Transformational", "Embedded"],
    ["New Year 12s are settling faster than last year; the buddy system is doing quiet, good work.",
     "Studio timetabling still squeezes changeover time between groups.",
     "The autumn showcase brief has given every class a living model of excellence - ambition is visibly up across the department.",
     "Feedback culture strong in rehearsal; we want it just as strong in written work."],
    {
      focus: "Intent",
      noticed: { Intent: pick("Intent", 1, 2, 5), Belonging: pick("Belonging", 0), Travel: pick("Travel", 2) },
      celebrate: "The showcase brief landing in every classroom - shared ambition you can feel in the corridor.",
      nextStep: "Bring the rehearsal feedback culture into written coursework - one modelled redraft per group before Christmas.",
      supportNeeded: "Ten minutes of changeover time between studio groups - needs a timetable tweak we can't make ourselves.",
      walkEntries: [
        { id: "we1", teacher: "Amara Okafor", className: "12A Theatre", yearGroup: "Year 12", ratings: { Belonging: "Embedded", Room: "Embedded", Intent: "Transformational", Travel: "Embedded" }, note: "Devising brief landing well" },
        { id: "we2", teacher: "Amara Okafor", className: "13B Theatre", yearGroup: "Year 13", ratings: { Belonging: "Transformational", Intent: "Embedded", Travel: "Developing" }, note: "" },
        { id: "we3", teacher: "Grace Adeyemi", className: "10C Drama", yearGroup: "Year 10", ratings: { Belonging: "Embedded", Room: "Developing", Intent: "Embedded", Travel: "Embedded" }, note: "Room reset ate into the start" },
      ],
    }),
  mk("s11", "learning-walk", "2026-11-20", "Term 2", "Music", "Marcus Bell", "Kerry Western",
    ["Embedded", "Transformational", "Transformational", "Embedded"],
    ["", "", "", "", "Rooms-focus walk: both studios set before learning started, kit ready, sightlines clean. Intent excellent; travel evident in the composition task."],
    { focus: "Room", className: "Both music studios" }),
  {
    id: "dw1", formType: "device-walk", submittedAt: "2026-11-21", date: "2026-11-21", term: "Term 2",
    academicYear: "2026/27", faculty: "Music Technology", reviewee: "Jordan Mackey", reviewer: "Kerry Western",
    className: "12A Music Tech",
    deviceChecks: { phoneBox: "In place", headphones: "Mostly - needed a nudge", chromebookOnly: "In place" },
    impact: "Starts are noticeably cleaner - the box by the door is routine now and the first task landed a good five minutes earlier than this time last term. Two students reached for headphones out of habit during independent work and self-corrected with one look.",
    classTools: { used: true, rating: "Working well", note: "Screens paused for the demo without fuss - students knew the drill." },
    overall: "Policy visibly bedding in; the impact shows most in the first ten minutes.",
    links: [], walkEntries: [],
  },
  {
    id: "dw2", formType: "device-walk", submittedAt: "2026-11-26", date: "2026-11-26", term: "Term 2",
    academicYear: "2026/27", faculty: "Science", reviewee: "Rachel Okon", reviewer: "Kerry Western",
    className: "11B Science",
    deviceChecks: { phoneBox: "Mostly - needed a nudge", headphones: "In place", chromebookOnly: "Not yet" },
    impact: "The box is used but not yet automatic - three phones went in after a reminder. One smartwatch and a personal tablet out during the practical; attention visibly fragmented at that bench compared with the rest of the room.",
    classTools: { used: false, rating: "", note: "" },
    overall: "Worth a follow-up walk in two weeks once the routine has had time to stick.",
    links: [], walkEntries: [],
  },
];

/* ------------------------------------------------------------------ *
 *  REFLECTIONS SHARE BOARD SEED
 * ------------------------------------------------------------------ */
const REFLECTIONS_KEY = "brit-tl-studio-reflections-v1";

// Abstract placeholder images for the seed posts (real posts carry photos).
const seedArt = (a, b) => `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='340'>` +
  `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
  `<stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs>` +
  `<rect width='600' height='340' fill='url(#g)'/></svg>`
)}`;

const REFLECTION_SEED = [
  {
    id: "n1", name: "Priya Nair", date: "2026-11-14",
    text: "Tried the silent showing protocol from the EduCoach session - dancers wrote feedback on sticky notes before anyone spoke. The quietest student in the room gave the sharpest note.",
    photo: seedArt("#AD227E", "#8447B0"),
  },
  {
    id: "n2", name: "Yusuf Rahman", date: "2026-11-06",
    text: "Week 9 of my ECT year. My mentor's tip about narrating edit decisions out loud has changed my demos - students now ask about the why, not just the how.",
    photo: seedArt("#C2651A", "#AD227E"),
  },
  {
    id: "n3", name: "Jordan Mackey", date: "2026-10-21",
    text: "Rebuilt the studio patch bay with student engineers on a rota - the Room area of the framework in action. Set-up time has halved and the kit gets treated like it's theirs, because it is.",
    photo: seedArt("#46B749", "#8447B0"),
  },
  {
    id: "n4", name: "Yusuf Rahman", date: "2026-11-24",
    text: "Update on my idea worth trying: trolleys now get staged at break before every shoot lesson. We start the edit demo eight minutes earlier and the room feels calm from the first minute.",
    photo: seedArt("#8447B0", "#46B749"),
    action: { recId: "s4", idea: "Stage the kit trolleys before the lesson, so the environment is set before learning starts.", outcome: "Becoming habit" },
  },
];

// Coaching questions from the peer review toolkit - they script the
// conversation in five phases. Ask, don't tell: a mirror, not a critic.
const COACHING_QUESTIONS = [
  {
    phase: "Opening on strengths",
    qs: [
      "Which three things were you pleased with in that lesson? How could you develop those further?",
      "What were you excited about in that lesson?",
      "There were some really good examples of [X] - which were you most pleased with?",
      "What would you like to share and celebrate from that session?",
    ],
  },
  {
    phase: "Students & learning",
    qs: [
      "Which points in the session were the students most engaged in? Why do you think that was?",
      "What do you think the students learnt - was it what you were expecting them to learn?",
      "Who do you think struggled the most? What would have supported them further?",
      "I noticed [student] wasn't involved at the start. What usually works to draw them in?",
      "Where did they freeze - and where did they take off?",
      "What fascinates this class - and what drains them?",
    ],
  },
  {
    phase: "Teaching decisions",
    qs: [
      "In the lesson I noticed that… - did you notice it too, and what did you make of it?",
      "You chose to… - what did you want to achieve there?",
      "Can you talk me through the staging of the lesson - how it links back, and what it previews?",
      "If we'd filmed that lesson, which parts would look lively and which quiet? How effective was that balance?",
      "Who is the audience for this work - and do the students know?",
    ],
  },
  {
    phase: "The what-ifs",
    qs: [
      "What would have happened if you had… in that situation?",
      "What else could you have done when…?",
      "What would happen if you…?",
      "Where were the opportunities to respond to equality and diversity in that lesson?",
    ],
  },
  {
    phase: "Action planning",
    qs: [
      "What would you like to change, and what options do you have?",
      "What small steps could you make to improve [X] - and what do you need to make that happen?",
      "If you could improve one thing about that lesson, what would it be?",
      "What are the three biggest learning points you're taking away?",
      "What will you solve next?",
    ],
  },
];

// Coaching sentence-starters for the reflection composer - tap to begin.
const COACH_PROMPTS = [
  "I tried",
  "What changed for my students was",
  "What surprised me was",
  "I'm still wrestling with",
  "Next, I'm going to",
];

// How a colleague evaluates their idea worth trying when ticking it off.
const IDEA_OUTCOMES = [
  { label: "Becoming habit", colour: "#46B749" },
  { label: "Tried it - refining", colour: "#AD227E" },
  { label: "Adapted it", colour: "#C2651A" },
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
  } catch (e) { /* ignore - in-memory state still works */ }
}

/* ------------------------------------------------------------------ *
 *  DRAFTS + "WHO AM I" (per-browser, like everything else in the demo)
 * ------------------------------------------------------------------ */
const DRAFTS_KEY = "brit-tl-studio-drafts-v1";
const ME_KEY = "brit-tl-studio-me";

function loadDrafts() {
  try { return JSON.parse(localStorage.getItem(DRAFTS_KEY)) || []; } catch (e) { return []; }
}
function saveDrafts(list) {
  try { localStorage.setItem(DRAFTS_KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
}
function removeDraft(id) {
  if (id) saveDrafts(loadDrafts().filter((d) => d.id !== id));
}
// Stored copies of the seed posts refresh their artwork and any seed posts
// added since first visit get appended - but deleted seeds stay deleted
// (tombstoned) and edited text survives. Real staff posts pass through.
const DELETED_SEEDS_KEY = "brit-tl-studio-deleted-seeds-v1";
function deletedSeeds() {
  try { return JSON.parse(localStorage.getItem(DELETED_SEEDS_KEY)) || []; } catch (e) { return []; }
}
function tombstoneSeed(id) {
  if (!REFLECTION_SEED.some((s) => s.id === id)) return;
  try { localStorage.setItem(DELETED_SEEDS_KEY, JSON.stringify([...new Set([...deletedSeeds(), id])])); } catch (e) { /* ignore */ }
}
function refreshSeedArt(list) {
  const gone = deletedSeeds();
  const synced = list.map((p) => {
    const seed = REFLECTION_SEED.find((s) => s.id === p.id);
    return seed ? { ...p, photo: seed.photo } : p;
  });
  const missing = REFLECTION_SEED.filter((s) => !list.some((p) => p.id === s.id) && !gone.includes(s.id));
  return [...synced, ...missing];
}
function loadReflections() {
  try {
    const r = JSON.parse(localStorage.getItem(REFLECTIONS_KEY));
    if (r) return refreshSeedArt(r);
  } catch (e) { /* fall through */ }
  return REFLECTION_SEED;
}
// Follow-through: a peer review's "one idea worth trying" stays open until
// its owner pins a share board post linked to it.
function openIdeasFor(name, submissions, posts) {
  return submissions
    .filter((r) => r.formType === "peer-review" && r.reviewee === name && r.nextStep)
    .filter((r) => !posts.some((p) => p.action?.recId === r.id))
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/* ------------------------------------------------------------------ *
 *  SMALL UI PRIMITIVES
 * ------------------------------------------------------------------ */
const Card = ({ children, style, ...p }) => (
  <div style={{ background: "#fff", border: `1.5px solid ${BRAND.line}`, borderRadius: 16, ...style }} {...p}>
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
    <span style={{ fontSize: 12, fontWeight: 600, color: BRAND.grey, letterSpacing: ".02em" }}>
      {label}
    </span>
    <div style={{ marginTop: 6 }}>{children}</div>
  </label>
);

const inputStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 10,
  border: `1px solid ${BRAND.line}`, fontSize: 14, fontFamily: "inherit",
  color: BRAND.ink, background: "#fff", boxSizing: "border-box",
};

/* ------------------------------------------------------------------ *
 *  STAFF: FORM SELECTOR
 * ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ *
 *  REFLECTIONS SHARE BOARD - staff share practice & development posts
 * ------------------------------------------------------------------ */
function ReflectionsBoard({ submissions }) {
  const [posts, setPosts] = useState([]);
  const [who, setWho] = useState("");
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState("");
  const [linkIdea, setLinkIdea] = useState(true);
  const [ideaId, setIdeaId] = useState("");
  const [outcome, setOutcome] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const fileRef = useRef(null);

  const openIdeas = who ? openIdeasFor(who, submissions, posts) : [];
  const idea = linkIdea ? (openIdeas.find((r) => r.id === ideaId) || openIdeas[0]) : null;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(REFLECTIONS_KEY);
      if (raw) { setPosts(refreshSeedArt(JSON.parse(raw))); return; }
    } catch (e) { /* fall through to seed */ }
    setPosts(REFLECTION_SEED);
    try { localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(REFLECTION_SEED)); } catch (e) { /* ignore */ }
  }, []);

  const onPhoto = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, 900 / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        setPhoto(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(f);
  };

  const share = () => {
    if (!canShare) return;
    const post = {
      id: "n" + Date.now(), name: who, date: new Date().toISOString().slice(0, 10), text: text.trim(), photo,
      ...(idea ? { action: { recId: idea.id, idea: idea.nextStep, outcome } } : {}),
    };
    const next = [post, ...posts];
    setPosts(next);
    try { localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(next)); } catch (e) { /* photo too large for storage - post stays in memory */ }
    setText(""); setPhoto(""); setOutcome(""); setIdeaId(""); setLinkIdea(true);
    setComposerOpen(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const canShare = who && text.trim() && (!idea || outcome);

  return (
    <div>
      <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-.03em", color: BRAND.ink, margin: "0 0 10px" }}>The share board</h2>
      <p style={{ color: BRAND.grey, margin: "0 0 24px", fontSize: 14 }}>
        Micro-insights, wins and works-in-progress - share anything about your practice or development, with a photo if you have one.
      </p>

      <Card style={{ padding: "22px 28px", marginBottom: 26, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: BRAND.ink }}>Got something you tried, noticed or learned?</div>
          <div style={{ fontSize: 13, color: BRAND.grey, marginTop: 3 }}>
            Pin it to the board - and if you have an idea worth trying open, tick it off while you're here.
          </div>
        </div>
        <button onClick={() => setComposerOpen(true)} style={{
          display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 999,
          border: "none", background: BRAND.magenta, color: "#fff", fontWeight: 700, fontSize: 14,
          cursor: "pointer", fontFamily: "inherit",
        }}><Plus size={16} /> Add a reflection</button>
      </Card>

      {composerOpen && (
      <div onClick={() => setComposerOpen(false)} style={{
        position: "fixed", inset: 0, background: "rgba(42,30,39,.5)", zIndex: 200,
        display: "grid", placeItems: "center", padding: 18,
      }}>
        <div onClick={(e) => e.stopPropagation()} style={{
          background: "#fff", borderRadius: 24, border: `1.5px solid ${BRAND.ink}`,
          boxShadow: `8px 8px 0 ${BRAND.magenta}`, maxWidth: 660, width: "100%",
          maxHeight: "88vh", overflowY: "auto", padding: 28,
        }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ margin: 0, fontSize: 21, fontWeight: 900, letterSpacing: "-.02em", color: BRAND.ink }}>Add a reflection</h3>
          <button onClick={() => setComposerOpen(false)} style={{
            width: 30, height: 30, borderRadius: "50%", border: "none", background: BRAND.pink,
            color: BRAND.ink, cursor: "pointer", display: "grid", placeItems: "center", padding: 0,
          }}><X size={16} /></button>
        </div>
        <div style={{ display: "grid", gap: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18 }}>
            <Field label="Who's sharing?">
              <select style={inputStyle} value={who} onChange={(e) => { setWho(e.target.value); setIdeaId(""); setOutcome(""); setLinkIdea(true); }}>
                <option value="">Select…</option>
                {STAFF.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </Field>
          </div>

          {who && openIdeas.length > 0 && (
            <div style={{ border: `2px solid ${linkIdea ? BRAND.green : BRAND.line}`, borderRadius: 16, padding: "16px 18px", background: linkIdea ? "#F2FAF3" : "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Lightbulb size={16} color="#C2651A" />
                <span style={{ fontSize: 13.5, fontWeight: 800, color: BRAND.ink }}>Your idea worth trying</span>
                <span style={{ fontSize: 12, color: BRAND.grey }}>· pulled through from your review{openIdeas.length > 1 ? "s" : ""}</span>
              </div>
              {openIdeas.length > 1 ? (
                <select style={{ ...inputStyle, marginBottom: 10 }} value={(idea || openIdeas[0]).id} onChange={(e) => setIdeaId(e.target.value)}>
                  {openIdeas.map((r) => <option key={r.id} value={r.id}>{r.term} · {r.nextStep}</option>)}
                </select>
              ) : (
                <p style={{ fontSize: 14, color: BRAND.ink, fontStyle: "italic", margin: "0 0 4px", lineHeight: 1.5 }}>
                  “{openIdeas[0].nextStep}”
                </p>
              )}
              <p style={{ fontSize: 12, color: BRAND.grey, margin: "0 0 12px" }}>
                {(idea || openIdeas[0]).term} peer review · suggested by {(idea || openIdeas[0]).reviewer}
              </p>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 650, color: BRAND.ink, cursor: "pointer" }}>
                <input type="checkbox" checked={linkIdea} onChange={(e) => { setLinkIdea(e.target.checked); if (!e.target.checked) setOutcome(""); }} />
                This post is my update on the idea - tick it off
              </label>
              {linkIdea && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                  <span style={{ fontSize: 12.5, color: BRAND.grey, alignSelf: "center" }}>How did it go?</span>
                  {IDEA_OUTCOMES.map((o) => {
                    const on = outcome === o.label;
                    return (
                      <button key={o.label} onClick={() => setOutcome(o.label)} style={{
                        padding: "6px 14px", borderRadius: 999, cursor: "pointer", fontFamily: "inherit",
                        fontSize: 12.5, fontWeight: on ? 750 : 600,
                        border: `2px solid ${on ? o.colour : BRAND.line}`,
                        background: on ? o.colour : "#fff", color: on ? "#fff" : BRAND.grey,
                      }}>{o.label}</button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".08em", color: BRAND.grey, marginBottom: 8 }}>
              Need a way in? Tap a prompt to start a sentence
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {COACH_PROMPTS.map((c) => (
                <button key={c} onClick={() => setText((t) => (t ? t.trimEnd() + "\n\n" : "") + c + " ")} style={{
                  padding: "6px 14px", borderRadius: 999, border: `1.5px solid ${BRAND.line}`, background: "#fff",
                  cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, fontWeight: 650, color: BRAND.magenta,
                }}>{c}…</button>
              ))}
            </div>
          </div>
          <Field label={idea ? "How did it go? What changed?" : "Your reflection"}>
            <textarea style={{ ...inputStyle, minHeight: 110, resize: "vertical" }} value={text}
              placeholder="Something you tried, noticed, learned - or are still wrestling with…"
              onChange={(e) => setText(e.target.value)} />
          </Field>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <label style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 999,
              border: `1.5px solid ${BRAND.line}`, cursor: "pointer", fontSize: 13, fontWeight: 650, color: BRAND.magenta,
            }}>
              <Camera size={15} /> {photo ? "Change photo" : "Add a photo"}
              <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} style={{ display: "none" }} />
            </label>
            {photo && (
              <span style={{ position: "relative", display: "inline-block" }}>
                <img src={photo} alt="preview" style={{ height: 52, borderRadius: 8, display: "block" }} />
                <button onClick={() => { setPhoto(""); if (fileRef.current) fileRef.current.value = ""; }} style={{
                  position: "absolute", top: -8, right: -8, width: 20, height: 20, borderRadius: "50%",
                  border: "none", background: BRAND.ink, color: "#fff", cursor: "pointer",
                  display: "grid", placeItems: "center", padding: 0,
                }}><X size={12} /></button>
              </span>
            )}
            <button disabled={!canShare} onClick={share} style={{
              marginLeft: "auto", padding: "10px 22px", borderRadius: 999, border: "none",
              background: canShare ? BRAND.magenta : BRAND.line,
              color: canShare ? "#fff" : BRAND.grey, fontWeight: 700, fontSize: 14,
              cursor: canShare ? "pointer" : "not-allowed", fontFamily: "inherit",
            }}>Pin it to the board</button>
          </div>
        </div>
        </div>
      </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 22 }}>
        {posts.map((post) => {
          const author = staffByName(post.name);
          return (
            <div key={post.id} style={{
              background: "#fff", borderRadius: 20, overflow: "hidden",
              border: `1.5px solid ${BRAND.ink}`, boxShadow: `5px 5px 0 ${BRAND.line}`,
              display: "flex", flexDirection: "column",
            }}>
              {post.action && (
                <div style={{ background: "#EAF6EB", padding: "10px 16px", borderBottom: `1.5px solid ${BRAND.ink}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, letterSpacing: ".06em", color: "#2E7D32" }}>
                    <CheckCircle size={13} /> Idea ticked off · {post.action.outcome}
                  </div>
                  <div style={{ fontSize: 12, color: BRAND.grey, marginTop: 4, fontStyle: "italic", lineHeight: 1.45 }}>“{post.action.idea}”</div>
                </div>
              )}
              {post.photo && <img src={post.photo} alt="" style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }} />}
              <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
                <p style={{ fontSize: 13.5, color: BRAND.ink, lineHeight: 1.55, margin: 0, flex: 1 }}>{post.text}</p>
                <div style={{ marginTop: 12, fontSize: 12, color: BRAND.grey }}>
                  <strong style={{ color: BRAND.magenta }}>{post.name}</strong>
                  {author && <> · {author.department}</>} · {post.date}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const FORM_ACCENT = { "peer-review": "#AD227E", "learning-walk": "#8447B0", "device-walk": "#C2651A", "dept-review": "#46B749", "aen-review": "#C0392B" };

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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 22, marginBottom: 30 }}>
        <div style={{
          background: BRAND.magenta, borderRadius: 28, padding: "36px 38px 42px", color: "#fff",
          display: "flex", flexDirection: "column", minHeight: 340,
        }}>
          <OutlinePill>How we see teaching</OutlinePill>
          <div style={{ flex: 1, minHeight: 40 }} />
          <h2 style={{ fontSize: "clamp(28px, 3.4vw, 40px)", fontWeight: 900, letterSpacing: "-.03em", lineHeight: 1.05, margin: "0 0 14px" }}>
            A shared language.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0, opacity: 0.94 }}>
            <strong>The BRIT framework asks three questions of every room: what can you see,
            what can you hear - and how does it feel?</strong> Reviews here grow practice
            through conversation between colleagues, and it unfolds, lesson by lesson.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 12 }}>
          {STRANDS.map((s) => (
            <div key={s.key} style={{
              background: s.accent, borderRadius: 20, padding: "20px 22px", color: "#fff",
              display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 130,
            }}>
              <div style={{
                fontFamily: "'Anton',sans-serif", fontWeight: 400, lineHeight: 1,
                fontSize: "clamp(44px, 5vw, 66px)",
                color: ["B", "I"].includes(s.letter) ? "#fff" : "transparent",
                WebkitTextStroke: ["B", "I"].includes(s.letter) ? "0" : "2px #fff",
              }}>{s.letter}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{s.key}</div>
                <div style={{ fontSize: 11.5, opacity: 0.9, marginTop: 2, lineHeight: 1.35 }}>{s.focus}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* what developmental success looks like */}
      <Card style={{ padding: "30px 32px 32px", marginBottom: 30 }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-.03em", color: BRAND.ink, margin: "0 0 22px" }}>
          What developmental success looks like
        </h2>

        {/* the descriptor journey */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(215px, 1fr))", gap: 14, marginBottom: 26 }}>
          {[
            { name: "Developing", colour: BRAND.developing, bg: "#F5F1F4", line: "Practice is emerging - deliberate, sometimes uneven, always moving." },
            { name: "Embedded", colour: BRAND.embedded, bg: "#F8E9F2", line: "Practice is consistent - part of how the room simply runs." },
            { name: "Transformational", colour: BRAND.transformational, bg: "#EAF6EB", line: "Practice spreads - students lead it, colleagues borrow it." },
          ].map((stage, i) => (
            <div key={stage.name} style={{ position: "relative", background: stage.bg, borderRadius: 16, padding: "18px 20px", border: `1.5px solid ${stage.colour}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontFamily: "'Anton',sans-serif", fontSize: 26, lineHeight: 1, color: stage.colour }}>{i + 1}</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: BRAND.ink }}>{stage.name}</span>
                {i < 2 && <ArrowRight size={16} color={stage.colour} style={{ marginLeft: "auto" }} />}
              </div>
              <div style={{ fontSize: 12.5, color: BRAND.grey, lineHeight: 1.5 }}>{stage.line}</div>
            </div>
          ))}
        </div>

        {/* the follow-through loop */}
        <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: ".08em", color: BRAND.grey, marginBottom: 12 }}>
          And the loop that proves it's moving
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(165px, 1fr))", gap: 12 }}>
          {[
            { n: "01", colour: BRAND.magenta, text: "A colleague reviews your practice against the four areas" },
            { n: "02", colour: "#C2651A", text: "You take away one idea worth trying - small, concrete, kind" },
            { n: "03", colour: "#8447B0", text: "You try it, then share how it went on the Share board" },
            { n: "04", colour: BRAND.green, text: "The idea is ticked off - and the patterns and picture of T&L across BRIT emerge and can be shared" },
          ].map((step, i) => (
            <div key={step.n} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{
                width: 30, height: 30, borderRadius: "50%", flexShrink: 0, background: step.colour,
                display: "grid", placeItems: "center", color: "#fff", fontSize: 12, fontWeight: 800,
              }}>{step.n}</span>
              <span style={{ fontSize: 12.5, color: BRAND.ink, lineHeight: 1.45, paddingTop: 2 }}>
                {step.text}{i === 3 && <CheckCircle size={13} color={BRAND.green} style={{ marginLeft: 5, verticalAlign: "-2px" }} />}
              </span>
            </div>
          ))}
        </div>

      </Card>

      <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-.03em", color: BRAND.ink, margin: "0 0 28px" }}>Choose a form</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 22 }}>
        {FORMS.map((f, i) => {
          const disabled = !f.active;
          const accent = FORM_ACCENT[f.id] || BRAND.magenta;
          return (
            <div
              key={f.id}
              onClick={() => f.active && onSelect(f.id)}
              style={{
                background: "#fff", borderRadius: 20, padding: 26,
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
          borderRadius: 20, padding: 26, display: "grid", placeItems: "center",
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
function SpineFields({ v, set, dept, classCtx, walk }) {
  const reviewee = staffByName(v.reviewee);
  const HEADS = STAFF.filter((s) => s.role.startsWith("Head") || s.role.startsWith("Director"));
  if (dept) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 18 }}>
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
        <Field label="Department">
          <select style={inputStyle} value={v.faculty} onChange={(e) => set("faculty", e.target.value)}>
            <option value="">Select…</option>
            {DEPARTMENTS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </Field>
        <Field label="Completed by (Head of Department)">
          <select style={inputStyle} value={v.reviewer} onChange={(e) => set("reviewer", e.target.value)}>
            <option value="">Select…</option>
            {HEADS.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
        </Field>
      </div>
    );
  }
  const pickReviewee = (name) => {
    set("reviewee", name);
    const s = staffByName(name);
    if (s && DEPARTMENTS.includes(s.department)) set("faculty", s.department);
  };
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 18 }}>
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
        {walk && (
          <Field label="Class">
            <input style={inputStyle} value={v.className || ""} placeholder="e.g. 12B Film"
              onChange={(e) => set("className", e.target.value)} />
          </Field>
        )}
      </div>
      {classCtx && (
        <div style={{ marginTop: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 18 }}>
            <Field label="Year group">
              <select style={inputStyle} value={v.yearGroup || ""} onChange={(e) => set("yearGroup", e.target.value)}>
                <option value="">Select…</option>
                {["Year 10", "Year 11", "Year 12", "Year 13", "Mixed"].map((y) => <option key={y}>{y}</option>)}
              </select>
            </Field>
            <Field label="Class name">
              <input style={inputStyle} value={v.className || ""} placeholder="e.g. 12B Film"
                onChange={(e) => set("className", e.target.value)} />
            </Field>
            <Field label="Lesson title">
              <input style={inputStyle} value={v.lessonTitle || ""} placeholder="e.g. Editing rhythm - montage"
                onChange={(e) => set("lessonTitle", e.target.value)} />
            </Field>
            <Field label="AEN learners in the class">
              <input style={inputStyle} type="number" min="0" value={v.aen || ""} placeholder="e.g. 3"
                onChange={(e) => set("aen", e.target.value)} />
            </Field>
          </div>
        </div>
      )}
      {reviewee && (
        <div style={{
          marginTop: 14, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          background: BRAND.pink, borderRadius: 10, padding: "14px 16px", fontSize: 12.5, color: BRAND.grey,
        }}>
          <span style={{ fontWeight: 700, color: BRAND.ink }}>{reviewee.name}</span>
          <span>{reviewee.role}</span>·<span>{reviewee.level}</span>
          {reviewee.manager && <><span>·</span><span>Line manager: {reviewee.manager}</span></>}
          <span style={{
            marginLeft: "auto", fontSize: 10, fontWeight: 700, letterSpacing: ".08em",
            border: `1px solid ${BRAND.line}`, borderRadius: 999, padding: "3px 9px",
          }}>BromCom · demo sync</span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  PDF EXPORT - opens a clean print view; the browser's print dialog
 *  offers "Save as PDF" on every platform.
 * ------------------------------------------------------------------ */
function printRecord(rec) {
  const esc = (t) => String(t ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const person = staffByName(rec.reviewee);
  const formName = FORMS.find((f) => f.id === rec.formType)?.name || "Review";
  const row = (k, val) => (val ? `<tr><td>${k}</td><td>${esc(val)}</td></tr>` : "");
  const areas = rec.strands == null ? "" : STRANDS.map((a) => {
    const cell = rec.strands?.[a.key] || {};
    return `<div class="area" style="border-left:6px solid ${a.accent}">
      <h3>${a.letter} · ${a.key}
        ${cell.rating ? `<span class="tag" style="background:${RATING_COLOUR[cell.rating]}">${esc(cell.rating)}</span>` : ""}
        ${rec.focus === a.key ? `<span class="spot">Spotlight</span>` : ""}</h3>
      ${cell.noticed?.length ? `<p class="noticed">Noticed: ${cell.noticed.map(esc).join(" · ")}</p>` : ""}
      ${cell.comment ? `<p>${esc(cell.comment)}</p>` : ""}
    </div>`;
  }).join("");
  const html = `<title>${esc(formName)} - ${esc(rec.reviewee)} - ${esc(rec.date)}</title>
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
  <div class="sub">BRIT T&amp;L Studio · BRIT framework · ${esc(rec.academicYear)}</div>
  <table>
    ${row("Staff member reviewed", rec.reviewee)}
    ${person ? row("Role", `${person.role} · ${person.level}`) : ""}
    ${person?.manager ? row("Line manager", person.manager) : ""}
    ${row("Department", rec.faculty)}
    ${row("Reviewer", rec.reviewer)}
    ${row("Date", rec.date)}${row("Term", rec.term)}
    ${row("Spotlight area", rec.focus)}
    ${row("Year group", rec.yearGroup)}
    ${row("Class", rec.className)}
    ${row("Lesson", rec.lessonTitle)}
    ${row("AEN learners in the class", rec.aen)}
  </table>
  ${rec.lessonFocus ? `<div class="box"><strong>Lesson focus:</strong> ${esc(rec.lessonFocus)}</div>` : ""}
  ${rec.priorContext ? `<div class="box"><strong>Prior context and considerations:</strong> ${esc(rec.priorContext)}</div>` : ""}
  ${rec.inquiry ? `<div class="box"><strong>Inquiry question:</strong> ${esc(rec.inquiry)}</div>` : ""}
  ${areas}
  ${rec.deviceChecks ? `<div class="box"><strong>Device &amp; phone policy:</strong><br>${POLICY_CHECKS.filter((c) => rec.deviceChecks[c.key]).map((c) => `${esc(c.label)}: <strong>${esc(rec.deviceChecks[c.key])}</strong>`).join("<br>")}</div>` : ""}
  ${rec.impact ? `<div class="box"><strong>Impact on teaching and learning:</strong> ${esc(rec.impact)}</div>` : ""}
  ${rec.classTools ? `<div class="box"><strong>Class Tools:</strong> ${rec.classTools.used ? `in use - ${esc(rec.classTools.rating)}${rec.classTools.note ? ` (${esc(rec.classTools.note)})` : ""}` : "not in use this lesson"}</div>` : ""}
  ${rec.overall ? `<div class="box"><strong>Overall observation:</strong> ${esc(rec.overall)}</div>` : ""}
  ${rec.celebrate ? `<div class="box"><strong>Shout-out:</strong> ${esc(rec.celebrate)}</div>` : ""}
  ${rec.evenBetterIf ? `<div class="box"><strong>Even better if:</strong> ${esc(rec.evenBetterIf)}</div>` : ""}
  ${rec.nextStep ? `<div class="box"><strong>${rec.formType === "dept-review" ? "Priority for next term" : "One idea worth trying"}:</strong> ${esc(rec.nextStep)}</div>` : ""}
  ${rec.supportNeeded ? `<div class="box"><strong>Support needed from SLT / T&amp;L:</strong> ${esc(rec.supportNeeded)}</div>` : ""}
  ${rec.walkEntries?.length ? `<div class="box"><strong>Department walk log (${rec.walkEntries.length} class${rec.walkEntries.length !== 1 ? "es" : ""}):</strong><br>${rec.walkEntries.map((e) => `${esc(e.teacher)} · ${esc([e.className, e.yearGroup].filter(Boolean).join(" · "))}${STRANDS.filter((a) => e.ratings?.[a.key]).map((a) => ` · ${a.letter}: ${esc(e.ratings[a.key])}`).join("")}${e.note ? ` — ${esc(e.note)}` : ""}`).join("<br>")}</div>` : ""}
  ${rec.links?.length ? `<p><strong>Linked documents</strong><br>${rec.links.map((l) => `<a href="${esc(l)}">${esc(l)}</a>`).join("<br>")}</p>` : ""}
  <div class="foot">Generated by the BRIT T&amp;L Studio</div>`;
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
      fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: Math.round(size * 0.52),
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
            textAlign: "left", padding: "14px 16px", borderRadius: 12, cursor: "pointer",
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

function StrandCard({ s, data, isFocus, onRate, onComment, onToggleNoticed, noticePrompt }) {
  return (
    <Card style={{
      padding: 28, marginBottom: 22, background: s.pastel,
      border: `${isFocus ? 2 : 1.5}px solid ${isFocus ? s.accent : BRAND.line}`,
      boxShadow: isFocus ? `0 4px 20px ${s.accent}22` : "none",
    }}>
      <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
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

      <div style={{ fontSize: 12, fontWeight: 600, color: BRAND.grey, letterSpacing: ".02em", margin: "20px 0 10px" }}>
        {noticePrompt || "In the room you might notice…"} <span style={{ fontWeight: 500, letterSpacing: 0 }}>(tap what you saw)</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
        {s.practice.map((p) => {
          const on = data.noticed?.includes(p);
          return (
            <button key={p} onClick={() => onToggleNoticed(s.key, p)} style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px",
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

      <div style={{ fontSize: 12, fontWeight: 600, color: BRAND.grey, letterSpacing: ".02em", margin: "0 0 10px" }}>
        Where does practice sit today?
      </div>
      <DescriptorPicker s={s} value={data.rating} onPick={(r) => onRate(s.key, r)} />

      <textarea
        style={{ ...inputStyle, minHeight: 70, resize: "vertical", marginTop: 14, border: "1px solid #fff" }}
        placeholder={isFocus
          ? `This is the spotlight area - what did you see and hear, and how did it feel? Be generous with detail.`
          : `Anything you noticed for ${s.key} (optional)`}
        value={data.comment}
        onChange={(e) => onComment(s.key, e.target.value)}
      />
    </Card>
  );
}

// Auto-insight from a set of department walk entries.
function walkInsight(entries) {
  if (entries.length < 2) return "";
  const score = {};
  STRANDS.forEach((s) => {
    let total = 0, count = 0;
    entries.forEach((e) => {
      const r = e.ratings?.[s.key];
      if (r) { count++; total += r === "Transformational" ? 2 : r === "Embedded" ? 1 : 0; }
    });
    score[s.key] = count ? total / count : -1;
  });
  const rated = STRANDS.filter((s) => score[s.key] >= 0);
  if (rated.length < 2) return "";
  const best = rated.reduce((a, b) => (score[b.key] > score[a.key] ? b : a));
  const watch = rated.reduce((a, b) => (score[b.key] < score[a.key] ? b : a));
  if (best.key === watch.key) return "";
  const teachers = new Set(entries.map((e) => e.teacher)).size;
  return `${entries.length} classes across ${teachers} teacher${teachers !== 1 ? "s" : ""}: ${best.key} is the department's strength on this walk, while ${watch.key} shows the most room to grow - a candidate for next term's focus.`;
}

function DeptWalkLog({ entries, setEntries, faculty }) {
  const deptStaff = STAFF.filter((s) => s.department === faculty);
  const others = STAFF.filter((s) => s.department !== faculty);
  const [teacher, setTeacher] = useState("");
  const [className, setClassName] = useState("");
  const [yearGroup, setYearGroup] = useState("");
  const [ratings, setRatings] = useState({});
  const [note, setNote] = useState("");

  const canAdd = teacher && className.trim() && Object.values(ratings).some(Boolean);
  const add = () => {
    if (!canAdd) return;
    setEntries([...entries, { id: "we" + Date.now(), teacher, className: className.trim(), yearGroup, ratings, note: note.trim() }]);
    setTeacher(""); setClassName(""); setYearGroup(""); setRatings({}); setNote("");
  };

  const agg = {};
  STRANDS.forEach((s) => { agg[s.key] = { Developing: 0, Embedded: 0, Transformational: 0 }; });
  entries.forEach((e) => STRANDS.forEach((s) => { const r = e.ratings?.[s.key]; if (r) agg[s.key][r]++; }));
  const insight = walkInsight(entries);

  return (
    <Card style={{ padding: 28, marginBottom: 26 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <ClipboardCheck size={16} color={BRAND.magenta} />
        <h3 style={{ margin: 0, fontSize: 15, color: BRAND.ink }}>Walk the department - log each class</h3>
      </div>
      <p style={{ fontSize: 13, color: BRAND.grey, margin: "0 0 16px", lineHeight: 1.5 }}>
        Log each class individually - teacher, class, and what you saw against the four areas. The picture
        builds itself below.
      </p>

      {entries.length > 0 && (
        <div style={{ display: "grid", gap: 8, marginBottom: 18 }}>
          {entries.map((e) => (
            <div key={e.id} style={{
              display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
              border: `1px solid ${BRAND.line}`, borderRadius: 12, padding: "10px 14px",
            }}>
              <span style={{ fontWeight: 700, fontSize: 13.5, color: BRAND.ink }}>{e.teacher}</span>
              <span style={{ fontSize: 12.5, color: BRAND.grey }}>{[e.className, e.yearGroup].filter(Boolean).join(" · ")}</span>
              <span style={{ display: "flex", gap: 5 }}>
                {STRANDS.map((a) => e.ratings?.[a.key] ? (
                  <span key={a.key} title={`${a.key}: ${e.ratings[a.key]}`} style={{
                    width: 20, height: 20, borderRadius: 6, display: "grid", placeItems: "center",
                    background: RATING_COLOUR[e.ratings[a.key]], color: "#fff", fontSize: 10.5, fontWeight: 800,
                  }}>{a.letter}</span>
                ) : null)}
              </span>
              {e.note && <span style={{ fontSize: 12.5, color: BRAND.grey, fontStyle: "italic" }}>“{e.note}”</span>}
              <button onClick={() => setEntries(entries.filter((x) => x.id !== e.id))} style={{
                marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: BRAND.grey,
                display: "grid", placeItems: "center", padding: 4,
              }}><X size={15} /></button>
            </div>
          ))}
        </div>
      )}

      <div style={{ border: `1.5px dashed ${BRAND.line}`, borderRadius: 14, padding: "16px 18px", marginBottom: entries.length > 1 ? 18 : 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px,1fr))", gap: 14, marginBottom: 14 }}>
          <Field label="Teacher">
            <select style={inputStyle} value={teacher} onChange={(e) => setTeacher(e.target.value)}>
              <option value="">Select…</option>
              {deptStaff.length > 0 && (
                <optgroup label={faculty || "This department"}>
                  {deptStaff.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
                </optgroup>
              )}
              <optgroup label="Everyone else">
                {others.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
              </optgroup>
            </select>
          </Field>
          <Field label="Class">
            <input style={inputStyle} value={className} placeholder="e.g. 12A Theatre"
              onChange={(e) => setClassName(e.target.value)} />
          </Field>
          <Field label="Year group">
            <select style={inputStyle} value={yearGroup} onChange={(e) => setYearGroup(e.target.value)}>
              <option value="">Select…</option>
              {["Year 10", "Year 11", "Year 12", "Year 13", "Mixed"].map((y) => <option key={y}>{y}</option>)}
            </select>
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 10, marginBottom: 14 }}>
          {STRANDS.map((s) => (
            <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <StrandBadge s={s} size={24} />
              <span style={{ fontSize: 12.5, fontWeight: 650, color: BRAND.ink, width: 74 }}>{s.key}</span>
              <span style={{ display: "flex", gap: 4 }}>
                {RATINGS.map((r) => {
                  const on = ratings[s.key] === r;
                  return (
                    <button key={r} title={r} onClick={() => setRatings((prev) => ({ ...prev, [s.key]: on ? "" : r }))} style={{
                      width: 26, height: 26, borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
                      fontSize: 11, fontWeight: 800, border: `1.5px solid ${on ? RATING_COLOUR[r] : BRAND.line}`,
                      background: on ? RATING_COLOUR[r] : "#fff", color: on ? "#fff" : BRAND.grey,
                    }}>{r[0]}</button>
                  );
                })}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <input style={{ ...inputStyle, flex: 1, minWidth: 200 }} value={note} placeholder="One-line note (optional)"
            onChange={(e) => setNote(e.target.value)} />
          <button disabled={!canAdd} onClick={add} style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 999,
            border: "none", background: canAdd ? BRAND.magenta : BRAND.line,
            color: canAdd ? "#fff" : BRAND.grey, fontWeight: 700, fontSize: 13,
            cursor: canAdd ? "pointer" : "not-allowed", fontFamily: "inherit",
          }}><Plus size={15} /> Log this class</button>
        </div>
        <p style={{ fontSize: 11.5, color: BRAND.grey, margin: "8px 0 0" }}>
          D = Developing · E = Embedded · T = Transformational. Rate what you saw - leave an area blank if you didn't see it.
        </p>
      </div>

      {entries.length > 1 && (
        <div style={{ background: BRAND.pink, borderRadius: 14, padding: "16px 18px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".07em", color: BRAND.magenta, marginBottom: 12 }}>
            What the walk is saying
          </div>
          {STRANDS.map((s) => <StrandBar key={s.key} strand={s.key} counts={agg[s.key]} />)}
          {insight && <p style={{ fontSize: 13, color: BRAND.ink, margin: "4px 0 0", lineHeight: 1.55 }}>{insight}</p>}
        </div>
      )}
    </Card>
  );
}

// Groups form sections under a phase label; passes children straight
// through on forms that don't use phases.
function FormGroup({ label, active, children }) {
  if (!active) return children;
  return (
    <section style={{ border: `1.5px solid ${BRAND.line}`, borderRadius: 26, padding: "22px 22px 4px", marginBottom: 30 }}>
      <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-.01em", color: BRAND.ink, margin: "0 4px 18px" }}>{label}</div>
      {children}
    </section>
  );
}

function CoachingQuestionsCard() {
  const [open, setOpen] = useState(false);
  return (
    <Card style={{ padding: "20px 28px", marginBottom: 26 }}>
      <button onClick={() => setOpen((o) => !o)} style={{
        display: "flex", alignItems: "center", gap: 8, width: "100%", background: "none",
        border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
      }}>
        <MessageCircle size={16} color={BRAND.magenta} />
        <h3 style={{ margin: 0, fontSize: 15, color: BRAND.ink }}>Coaching questions for the conversation</h3>
        <span style={{ fontSize: 12.5, color: BRAND.grey, fontStyle: "italic" }}>ask, don't tell</span>
        <ChevronDown size={17} color={BRAND.grey} style={{
          marginLeft: "auto", transition: "transform .2s", transform: open ? "rotate(180deg)" : "none",
        }} />
      </button>
      {open && (
        <>
          <p style={{ fontSize: 13, color: BRAND.grey, margin: "10px 0 16px", lineHeight: 1.5 }}>
            You and your partner are equals in this - be a mirror, not a critic, and keep the conversation
            on the learning, not the person. Borrow whatever helps.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 18 }}>
            {COACHING_QUESTIONS.map((g) => (
              <div key={g.phase}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".07em", color: BRAND.magenta, marginBottom: 8 }}>
                  {g.phase}
                </div>
                <ul style={{ margin: 0, paddingLeft: 16, display: "grid", gap: 7 }}>
                  {g.qs.map((q) => (
                    <li key={q} style={{ fontSize: 12.5, color: BRAND.grey, lineHeight: 1.45 }}>{q}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}

function ReviewForm({ formId, onBack, onSubmit, draft, submissions = [] }) {
  const isWalk = formId === "learning-walk";
  const isDept = formId === "dept-review";
  const isDevice = formId === "device-walk";
  const meta = FORMS.find((f) => f.id === formId);
  const [draftId, setDraftId] = useState(draft?.id || null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [spine, setSpine] = useState(draft?.spine || {
    date: "", term: "", academicYear: "2026/27", faculty: "", reviewee: "", reviewer: "",
    yearGroup: "", className: "", lessonTitle: "", aen: "",
  });
  const [strands, setStrands] = useState(draft?.strands ||
    STRANDS.reduce((a, s) => ({ ...a, [s.key]: { rating: "", comment: "", noticed: [] } }), {})
  );
  const [focusStrand, setFocusStrand] = useState(draft?.focusStrand || "");
  const [inquiry, setInquiry] = useState(draft?.inquiry || "");
  const [lessonFocus, setLessonFocus] = useState(draft?.lessonFocus || "");
  const [priorContext, setPriorContext] = useState(draft?.priorContext || "");
  const [celebrate, setCelebrate] = useState(draft?.celebrate || "");
  const [evenBetterIf, setEvenBetterIf] = useState(draft?.evenBetterIf || "");
  const [nextStep, setNextStep] = useState(draft?.nextStep || "");
  const [supportNeeded, setSupportNeeded] = useState(draft?.supportNeeded || "");
  const [links, setLinks] = useState(draft?.links?.length ? draft.links : [""]);
  const [walkEntries, setWalkEntries] = useState(draft?.walkEntries || []);
  const [deviceChecks, setDeviceChecks] = useState(draft?.deviceChecks || {});
  const [impact, setImpact] = useState(draft?.impact || "");
  const [ctUsed, setCtUsed] = useState(draft?.classTools?.used || false);
  const [ctRating, setCtRating] = useState(draft?.classTools?.rating || "");
  const [ctNote, setCtNote] = useState(draft?.classTools?.note || "");
  const [overall, setOverall] = useState(draft?.overall || "");
  const [done, setDone] = useState(null);

  const saveDraft = () => {
    const id = draftId || "d" + Date.now();
    const record = {
      id, formId, editOf: draft?.editOf, savedAt: new Date().toISOString().slice(0, 10),
      spine, strands, focusStrand, inquiry, lessonFocus, priorContext, celebrate, evenBetterIf, nextStep, supportNeeded, links, walkEntries,
      deviceChecks, impact, classTools: { used: ctUsed, rating: ctRating, note: ctNote }, overall,
    };
    saveDrafts([record, ...loadDrafts().filter((x) => x.id !== id)]);
    setDraftId(id);
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2500);
  };

  const setSpineField = (k, val) => setSpine((s) => ({ ...s, [k]: val }));
  const setRating = (k, r) => setStrands((s) => ({ ...s, [k]: { ...s[k], rating: r } }));
  const setComment = (k, c) => setStrands((s) => ({ ...s, [k]: { ...s[k], comment: c } }));
  const toggleNoticed = (k, p) => setStrands((s) => {
    const cur = s[k].noticed || [];
    return { ...s, [k]: { ...s[k], noticed: cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p] } };
  });

  const spineComplete = isDept
    ? [spine.date, spine.term, spine.academicYear, spine.faculty, spine.reviewer].every((x) => (x ?? "").trim())
    : [
        spine.date, spine.term, spine.academicYear, spine.faculty, spine.reviewee, spine.reviewer,
        ...(isWalk || isDevice ? [spine.className] : [spine.yearGroup, spine.className, spine.lessonTitle, String(spine.aen ?? "")]),
      ].every((x) => (x ?? "").trim());
  const complete = isDevice
    ? spineComplete &&
      POLICY_CHECKS.every((c) => deviceChecks[c.key]) &&
      impact.trim() &&
      (!ctUsed || ctRating)
    : spineComplete &&
      STRANDS.every((s) => strands[s.key].rating) &&
      focusStrand &&
      (isWalk || (celebrate.trim() && nextStep.trim() && (isDept || (inquiry.trim() && lessonFocus.trim()))));

  const submit = () => {
    const record = {
      id: draft?.editOf || "r" + Date.now(),
      formType: formId,
      submittedAt: new Date().toISOString().slice(0, 10),
      ...spine,
      reviewee: isDept ? `${spine.faculty} - department` : spine.reviewee,
      strands: isDevice ? undefined : strands,
      focus: isDevice ? "" : focusStrand,
      inquiry: isWalk || isDept || isDevice ? "" : inquiry.trim(),
      lessonFocus: isWalk || isDept || isDevice ? "" : lessonFocus.trim(),
      priorContext: isWalk || isDept || isDevice ? "" : priorContext.trim(),
      celebrate: isWalk || isDevice ? "" : celebrate,
      evenBetterIf: isWalk || isDevice ? "" : evenBetterIf,
      nextStep: isWalk || isDevice ? "" : nextStep,
      links: isWalk || isDevice ? [] : links.map((l) => l.trim()).filter(Boolean),
      walkEntries: isDept ? walkEntries : [],
      supportNeeded: isDept ? supportNeeded : "",
      deviceChecks: isDevice ? deviceChecks : undefined,
      impact: isDevice ? impact.trim() : "",
      classTools: isDevice ? { used: ctUsed, rating: ctUsed ? ctRating : "", note: ctUsed ? ctNote.trim() : "" } : undefined,
      overall: isWalk || isDevice ? overall : "",
    };
    onSubmit(record);
    removeDraft(draftId);
    setDone(record);
  };

  if (done) {
    return (
      <Card style={{ padding: 40, textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#EAF7EC", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
          <CheckCircle size={30} color={BRAND.green} />
        </div>
        <h3 style={{ margin: "0 0 10px", color: BRAND.ink }}>{draft?.editOf ? "Review updated" : "Review submitted"}</h3>
        <p style={{ color: BRAND.grey, fontSize: 14, margin: "0 0 24px" }}>
          {draft?.editOf
            ? `The ${meta.name.toLowerCase()} record has been updated everywhere it appears.`
            : `It has been added to the ${meta.name.toLowerCase()} record and is visible on the SLT dashboard.`}
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
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: BRAND.magenta, cursor: "pointer", fontSize: 14, fontWeight: 600, marginBottom: 22, padding: 0 }}>
        <ArrowLeft size={16} /> All forms
      </button>
      <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-.03em", color: BRAND.ink, margin: "0 0 26px" }}>{meta.name}</h2>

      <FormGroup label="To discuss before the review" active={!isWalk && !isDept && !isDevice}>
      <Card style={{ padding: 28, marginBottom: 26 }}>
        <SpineFields v={spine} set={setSpineField} dept={isDept} classCtx={!isWalk && !isDept && !isDevice} walk={isWalk || isDevice} />
      </Card>

      {!isWalk && !isDept && !isDevice && spine.reviewee && (() => {
        const prev = submissions
          .filter((r) => r.formType === "peer-review" && r.reviewee === spine.reviewee && r.nextStep)
          .slice()
          .sort((a, b) => (a.date < b.date ? 1 : -1))[0];
        if (!prev) return null;
        const update = loadReflections().find((p) => p.action?.recId === prev.id);
        return (
          <Card style={{ padding: 28, marginBottom: 26, background: update ? "#F2FAF3" : "#FDFBF6", borderColor: update ? BRAND.green : "#EFE3C8" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Lightbulb size={16} color="#C2651A" />
              <h3 style={{ margin: 0, fontSize: 15, color: BRAND.ink }}>Check in on last time's idea</h3>
            </div>
            <p style={{ fontSize: 14, color: BRAND.ink, fontStyle: "italic", margin: "0 0 6px", lineHeight: 1.5 }}>“{prev.nextStep}”</p>
            <p style={{ fontSize: 12, color: BRAND.grey, margin: "0 0 10px" }}>{prev.term} peer review · suggested by {prev.reviewer}</p>
            {update ? (
              <div style={{ fontSize: 13, color: BRAND.ink, display: "flex", alignItems: "flex-start", gap: 8 }}>
                <CheckCircle size={16} color={BRAND.green} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>
                  <strong>Ticked off on the share board · {update.action.outcome}.</strong>{" "}
                  <span style={{ color: BRAND.grey }}>“{update.text}”</span>
                </span>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: BRAND.grey, margin: 0 }}>
                Not ticked off yet - ask how it went. Trying it matters more than ticking the box.
              </p>
            )}
          </Card>
        );
      })()}

      {!isWalk && !isDept && !isDevice && (
        <Card style={{ padding: 28, marginBottom: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <GraduationCap size={17} color="#46B749" />
            <h3 style={{ margin: 0, fontSize: 15, color: BRAND.ink }}>Lesson focus</h3>
          </div>
          <div style={{ display: "grid", gap: 18 }}>
            <Field label="What do you want the students to learn - and why?">
              <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={lessonFocus}
                placeholder="The intended learning in your colleague's words, and why it matters now…"
                onChange={(e) => setLessonFocus(e.target.value)} />
            </Field>
            <Field label="Prior context and considerations (optional)">
              <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={priorContext}
                placeholder="Where the class is coming from, group dynamics, AEN needs, anything the reviewer should know…"
                onChange={(e) => setPriorContext(e.target.value)} />
            </Field>
          </div>
        </Card>
      )}

      {!isDevice && (
        <Card style={{ padding: 28, marginBottom: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Sparkles size={16} color={BRAND.magenta} />
            <h3 style={{ margin: 0, fontSize: 15, color: BRAND.ink }}>{isDept ? "This term's focus" : "Spotlight"}</h3>
          </div>
          <p style={{ fontSize: 13, color: BRAND.grey, margin: "0 0 14px", lineHeight: 1.5 }}>
            {isDept
              ? "Pick this term's focus - you'll still take stock of all four."
              : isWalk
                ? "Pick the area this walk is looking for - you'll still rate all four."
                : "Pick the area under the spotlight, agreed together before the lesson - you'll still glance across all four."}
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
          {!isDept && !isWalk && (
            <div style={{ marginTop: 18 }}>
              <Field label="Our inquiry question - agreed together before the lesson">
                <textarea style={{ ...inputStyle, minHeight: 54, resize: "vertical" }} value={inquiry}
                  placeholder={`Coach the focus into a question worth investigating: "I want to explore how…" or "I want to investigate how…"`}
                  onChange={(e) => setInquiry(e.target.value)} />
              </Field>
              <p style={{ fontSize: 12, color: BRAND.grey, margin: "8px 0 0", lineHeight: 1.5 }}>
                “I want to work on behaviour” becomes “I want to investigate how clearer transition routines
                affect how quickly Year 10 start independent tasks.” Will it genuinely stretch the practice?
              </p>
            </div>
          )}
        </Card>
      )}

      {!isWalk && !isDept && !isDevice && <CoachingQuestionsCard />}

      {isDept && <DeptWalkLog entries={walkEntries} setEntries={setWalkEntries} faculty={spine.faculty} />}

      {!isWalk && !isDevice && (
        <Card style={{ padding: 28, marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <ClipboardList size={16} color={BRAND.magenta} />
            <h3 style={{ margin: 0, fontSize: 15, color: BRAND.ink }}>Linked documents</h3>
          </div>
          <p style={{ fontSize: 13, color: BRAND.grey, margin: "0 0 12px", lineHeight: 1.5 }}>
            Paste links to anything that supports the review - lesson plans, slides, the brief, photos of the work. Optional.
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
      </FormGroup>

      <FormGroup label="To record during the review" active={!isWalk && !isDept && !isDevice}>
      {isDevice && (
        <>
          <Card style={{ padding: 28, marginBottom: 26 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Lock size={16} color="#C2651A" />
              <h3 style={{ margin: 0, fontSize: 15, color: BRAND.ink }}>The policy - what did you see?</h3>
            </div>
            <p style={{ fontSize: 13, color: BRAND.grey, margin: "0 0 16px", lineHeight: 1.5 }}>
              Three expectations, one honest reading of each.
            </p>
            <div style={{ display: "grid", gap: 16 }}>
              {POLICY_CHECKS.map((c) => (
                <div key={c.key}>
                  <div style={{ fontSize: 13.5, fontWeight: 650, color: BRAND.ink, marginBottom: 8 }}>{c.label}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {DEVICE_SCALE.map((o) => {
                      const on = deviceChecks[c.key] === o.label;
                      return (
                        <button key={o.label} onClick={() => setDeviceChecks((prev) => ({ ...prev, [c.key]: o.label }))} style={{
                          padding: "7px 16px", borderRadius: 999, cursor: "pointer", fontFamily: "inherit",
                          fontSize: 13, fontWeight: on ? 750 : 600,
                          border: `2px solid ${on ? o.colour : BRAND.line}`,
                          background: on ? o.colour : "#fff", color: on ? "#fff" : BRAND.grey,
                        }}>{o.label}</button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ padding: 28, marginBottom: 26 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <BarChart3 size={16} color={BRAND.magenta} />
              <h3 style={{ margin: 0, fontSize: 15, color: BRAND.ink }}>Impact on teaching and learning</h3>
            </div>
            <p style={{ fontSize: 13, color: BRAND.grey, margin: "0 0 12px", lineHeight: 1.5 }}>
              What difference did you see - starts, focus, independence, the feel of the room?
            </p>
            <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} value={impact}
              placeholder="What you noticed about attention, pace and engagement with devices out of the picture…"
              onChange={(e) => setImpact(e.target.value)} />
          </Card>

          <Card style={{ padding: 28, marginBottom: 26 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <ClipboardCheck size={16} color="#8447B0" />
              <h3 style={{ margin: 0, fontSize: 15, color: BRAND.ink }}>Class Tools</h3>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 650, color: BRAND.ink, cursor: "pointer" }}>
              <input type="checkbox" checked={ctUsed} onChange={(e) => { setCtUsed(e.target.checked); if (!e.target.checked) { setCtRating(""); setCtNote(""); } }} />
              Class Tools was being used in this lesson
            </label>
            {ctUsed && (
              <div style={{ marginTop: 14 }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 12.5, color: BRAND.grey }}>How's it going?</span>
                  {CLASSTOOLS_SCALE.map((o) => {
                    const on = ctRating === o.label;
                    return (
                      <button key={o.label} onClick={() => setCtRating(o.label)} style={{
                        padding: "6px 14px", borderRadius: 999, cursor: "pointer", fontFamily: "inherit",
                        fontSize: 12.5, fontWeight: on ? 750 : 600,
                        border: `2px solid ${on ? o.colour : BRAND.line}`,
                        background: on ? o.colour : "#fff", color: on ? "#fff" : BRAND.grey,
                      }}>{o.label}</button>
                    );
                  })}
                </div>
                <input style={inputStyle} value={ctNote} placeholder="One-line note on how it was used (optional)"
                  onChange={(e) => setCtNote(e.target.value)} />
              </div>
            )}
          </Card>
        </>
      )}

      {!isDevice && STRANDS.map((s) => isWalk ? (
        <Card key={s.key} style={{ padding: 28, marginBottom: 22, background: s.pastel }}>
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
          noticePrompt={isDept ? "Across the department you might notice…" : undefined}
        />
      ))}

      {(isWalk || isDevice) && (
        <Card style={{ padding: 28, marginBottom: 22 }}>
          <Field label={isDevice ? "Overall observation (optional)" : "Overall observation"}>
            <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} value={overall}
              placeholder="One reflection across the walk" onChange={(e) => setOverall(e.target.value)} />
          </Field>
        </Card>
      )}

      {!isWalk && !isDevice && (
        <Card style={{ padding: 28, marginBottom: 22, background: "#FDFBF6", borderColor: "#EFE3C8" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <MessageCircle size={16} color="#B8860B" />
            <h3 style={{ margin: 0, fontSize: 15, color: BRAND.ink }}>Close with care</h3>
          </div>
          <p style={{ fontSize: 13, color: BRAND.grey, margin: "0 0 14px", lineHeight: 1.5 }}>
            {isDept
              ? "Close the review looking forward - celebrate what's working, and name what would move the department on."
              : "Send your colleague away with something real to feel good about."}
          </p>
          <p style={{ fontSize: 12, color: "#B8860B", fontWeight: 650, margin: "-6px 0 14px" }}>
            The golden rules: specific, not waffly · linked to the why · future-proofed.
          </p>
          <div style={{ display: "grid", gap: 18 }}>
            <Field label={isDept ? "Proudest practice - what should the department feel proud of?" : "Shout-out - something your colleague should feel proud of"}>
              <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={celebrate}
                placeholder={isDept ? "The practice worth celebrating across the department…" : "The moment worth celebrating from this lesson…"}
                onChange={(e) => setCelebrate(e.target.value)} />
            </Field>
            <Field label="Even better if… (optional)">
              <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={evenBetterIf}
                placeholder={isDept ? "One shift that would lift the whole department…" : "One tweak that would lift this lesson even further…"}
                onChange={(e) => setEvenBetterIf(e.target.value)} />
            </Field>
            <Field label={isDept ? "One priority for next term - small, concrete, shared" : "One idea worth trying - small, concrete, kind"}>
              <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={nextStep}
                placeholder={isDept ? "The single priority the department will carry into next term…" : "A single practical suggestion for your colleague to take away…"}
                onChange={(e) => setNextStep(e.target.value)} />
            </Field>
            {isDept && (
              <Field label="Support needed from SLT / T&L (optional)">
                <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={supportNeeded}
                  placeholder="Anything the department needs that it can't fix alone - time, kit, training, a decision…"
                  onChange={(e) => setSupportNeeded(e.target.value)} />
              </Field>
            )}
          </div>
        </Card>
      )}
      </FormGroup>

      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 8, flexWrap: "wrap" }}>
        <button disabled={!complete} onClick={submit} style={{
          padding: "12px 24px", borderRadius: 999, border: "none",
          background: complete ? BRAND.magenta : BRAND.line,
          color: complete ? "#fff" : BRAND.grey, fontWeight: 700, fontSize: 14,
          cursor: complete ? "pointer" : "not-allowed", fontFamily: "inherit",
        }}>Submit review</button>
        <button onClick={saveDraft} style={{
          padding: "12px 24px", borderRadius: 999, cursor: "pointer", fontFamily: "inherit",
          border: `1.5px solid ${BRAND.ink}`, background: "#fff", color: BRAND.ink,
          fontWeight: 700, fontSize: 14,
        }}>Save draft</button>
        {draftSaved && <span style={{ fontSize: 13, fontWeight: 700, color: BRAND.green }}>Draft saved - find it on My Dashboard</span>}
        {!complete && (
          <span style={{ fontSize: 13, color: BRAND.grey }}>
            {isDevice
              ? "Complete the details, a reading for each policy expectation, and the impact on teaching and learning."
              : isWalk
              ? "Complete all details, pick the walk's focus, and a descriptor for each area."
              : isDept
                ? "Complete the details, pick this term's focus, choose a descriptor for each area, and add the proudest practice and a priority."
                : "Complete the details and class context, set the lesson focus, pick a spotlight, agree your inquiry question, choose a descriptor for each area, and add a shout-out and an idea worth trying."}
          </span>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  SLT DASHBOARD
 * ------------------------------------------------------------------ */
function StrandBar({ strand, counts, unit = "review" }) {
  const total = RATINGS.reduce((a, r) => a + counts[r], 0) || 1;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontWeight: 700, color: BRAND.ink, fontSize: 14 }}>{strand}</span>
        <span style={{ color: BRAND.grey, fontSize: 13 }}>{total} {unit}{total !== 1 ? "s" : ""}</span>
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

  // by year group: descriptor ratings from peer reviews (record-level year
  // group) and department walk-log entries, all four areas combined
  const yearCounts = {};
  const bumpYear = (yg, r) => {
    if (!yg || !r) return;
    (yearCounts[yg] ||= { Developing: 0, Embedded: 0, Transformational: 0 })[r]++;
  };
  filtered.forEach((sub) => {
    if (sub.yearGroup) STRANDS.forEach((s) => bumpYear(sub.yearGroup, sub.strands?.[s.key]?.rating));
    (sub.walkEntries || []).forEach((e) => STRANDS.forEach((s) => bumpYear(e.yearGroup, e.ratings?.[s.key])));
  });
  const yearRows = ["Year 10", "Year 11", "Year 12", "Year 13", "Mixed"].filter((y) => yearCounts[y]);

  // team-by-team: each line manager's reports, profiled against the four areas
  const teams = STAFF
    .filter((m) => STAFF.some((x) => x.manager === m.name))
    .map((m) => {
      const reports = STAFF.filter((x) => x.manager === m.name);
      const subs = filtered.filter((x) => reports.some((r) => r.name === x.reviewee));
      const counts = {};
      STRANDS.forEach((s) => { counts[s.key] = { Developing: 0, Embedded: 0, Transformational: 0 }; });
      subs.forEach((sub) => {
        STRANDS.forEach((s) => {
          const r = sub.strands?.[s.key]?.rating;
          if (r) counts[s.key][r]++;
        });
      });
      return { manager: m, reports, subs, counts };
    });

  // follow-through: every peer-review "idea worth trying" vs share board tick-offs
  const boardPosts = loadReflections();
  const ideas = filtered
    .filter((r) => r.formType === "peer-review" && r.nextStep)
    .map((r) => ({ rec: r, update: boardPosts.find((p) => p.action?.recId === r.id) }));
  const ticked = ideas.filter((i) => i.update);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 26 }}>
        <div>
          <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-.03em", color: BRAND.ink, margin: "0 0 10px" }}>Analytics</h2>
          <p style={{ color: BRAND.grey, margin: 0, fontSize: 14 }}>Patterns by area, department, team and year group.</p>
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 18, marginBottom: 30 }}>
        {[
          { label: "Reviews in view", value: filtered.length, bg: BRAND.magenta },
          { label: "Transformational ratings", value: totalT, bg: BRAND.green },
          { label: "Departments covered", value: new Set(filtered.map((s) => s.faculty)).size, bg: "#8447B0" },
          { label: "Ideas ticked off", value: `${ticked.length}/${ideas.length}`, bg: "#C2651A" },
        ].map((stat) => (
          <div key={stat.label} style={{ background: stat.bg, borderRadius: 20, padding: "26px 28px", color: "#fff" }}>
            <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: "-.03em", lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.88, marginTop: 8 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px,1fr))", gap: 22, marginBottom: 30 }}>
        <Card style={{ padding: 28 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, color: BRAND.ink }}>Where each area sits</h3>
          {STRANDS.map((s) => <StrandBar key={s.key} strand={s.key} counts={strandCounts[s.key]} />)}
          <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
            {RATINGS.map((r) => (
              <span key={r} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: BRAND.grey }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: RATING_COLOUR[r] }} /> {r}
              </span>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 28 }}>
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

        <Card style={{ padding: 28 }}>
          <h3 style={{ margin: "0 0 4px", fontSize: 15, color: BRAND.ink }}>By year group</h3>
          <p style={{ fontSize: 12.5, color: BRAND.grey, margin: "0 0 16px", lineHeight: 1.5 }}>
            All four areas combined, drawn from peer reviews and department walk logs - only records
            that name a year group are counted.
          </p>
          {yearRows.length === 0 ? (
            <p style={{ color: BRAND.grey, fontSize: 14, margin: 0 }}>No year-group data in the current view.</p>
          ) : (
            yearRows.map((y) => <StrandBar key={y} strand={y} counts={yearCounts[y]} unit="rating" />)
          )}
        </Card>
      </div>

      {/* team by team */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 6px" }}>
        <Users size={16} color={BRAND.magenta} />
        <h3 style={{ margin: 0, fontSize: 15, color: BRAND.ink }}>Team by team</h3>
      </div>
      <p style={{ fontSize: 13, color: BRAND.grey, margin: "0 0 16px", lineHeight: 1.5 }}>
        Every line manager's team, profiled against the four areas. Filters above apply here too.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 22, marginBottom: 30 }}>
        {teams.map(({ manager, reports, subs, counts }) => (
          <Card key={manager.name} style={{ padding: 26 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 4 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 11, background: BRAND.ink, color: "#fff",
                display: "grid", placeItems: "center", fontWeight: 800, fontSize: 13.5,
              }}>{manager.name.split(" ").map((w) => w[0]).join("")}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: BRAND.ink }}>{manager.name}'s team</div>
                <div style={{ fontSize: 12, color: BRAND.grey }}>
                  {reports.length} colleague{reports.length !== 1 ? "s" : ""} · {subs.length} review{subs.length !== 1 ? "s" : ""} in view
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "10px 0 16px" }}>
              {reports.map((r) => {
                const n = subs.filter((s) => s.reviewee === r.name).length;
                return (
                  <span key={r.name} style={{
                    fontSize: 11.5, fontWeight: 650, color: n ? BRAND.ink : BRAND.grey,
                    border: `1.5px solid ${n ? BRAND.line : "#EDE4EA"}`, borderRadius: 999, padding: "3px 10px",
                  }}>{r.name}{n ? ` · ${n}` : ""}</span>
                );
              })}
            </div>
            {subs.length === 0 ? (
              <p style={{ color: BRAND.grey, fontSize: 13, margin: 0 }}>No reviews for this team in the current view.</p>
            ) : (
              STRANDS.map((s) => <StrandBar key={s.key} strand={s.key} counts={counts[s.key]} />)
            )}
          </Card>
        ))}
      </div>

      {/* follow-through */}
      <Card style={{ padding: 28, marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Lightbulb size={16} color="#C2651A" />
          <h3 style={{ margin: 0, fontSize: 15, color: BRAND.ink }}>Follow-through - do ideas get tried?</h3>
        </div>
        <p style={{ fontSize: 13, color: BRAND.grey, margin: "0 0 16px", lineHeight: 1.5 }}>
          Every peer review closes with one idea worth trying. Colleagues tick theirs off on the share board
          with a short reflection on how it went.
        </p>
        {ideas.length === 0 ? (
          <p style={{ color: BRAND.grey, fontSize: 14, margin: 0 }}>No ideas issued in the current view.</p>
        ) : (
          <>
            <div style={{ display: "flex", height: 26, borderRadius: 8, overflow: "hidden", border: `1px solid ${BRAND.line}`, marginBottom: 18 }}>
              {ticked.length > 0 && (
                <div style={{ width: `${(ticked.length / ideas.length) * 100}%`, background: BRAND.green, display: "grid", placeItems: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                  {ticked.length} ticked off
                </div>
              )}
              {ideas.length - ticked.length > 0 && (
                <div style={{ flex: 1, background: "#B9A7B4", display: "grid", placeItems: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                  {ideas.length - ticked.length} still open
                </div>
              )}
            </div>
            {ticked.length > 0 && (
              <div style={{ display: "grid", gap: 10, marginBottom: ideas.length > ticked.length ? 16 : 0 }}>
                {ticked.map(({ rec, update }) => {
                  const oc = IDEA_OUTCOMES.find((o) => o.label === update.action.outcome);
                  return (
                    <div key={rec.id} style={{ padding: "12px 14px", background: "#F2FAF3", borderRadius: 10, borderLeft: `3px solid ${BRAND.green}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                        <strong style={{ fontSize: 13.5, color: BRAND.ink }}>{rec.reviewee}</strong>
                        <span style={{ fontSize: 12, color: BRAND.grey }}>{rec.faculty} · idea from {rec.term}</span>
                        <span style={{ padding: "1px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, color: "#fff", background: oc?.colour || BRAND.green }}>
                          {update.action.outcome}
                        </span>
                      </div>
                      <div style={{ fontSize: 12.5, color: BRAND.grey, fontStyle: "italic", marginBottom: 4 }}>“{rec.nextStep}”</div>
                      <div style={{ fontSize: 13.5, color: BRAND.ink, lineHeight: 1.5 }}>{update.text}</div>
                    </div>
                  );
                })}
              </div>
            )}
            {ideas.length > ticked.length && (
              <div style={{ fontSize: 13, color: BRAND.grey, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontWeight: 700 }}>Still open:</span>
                {ideas.filter((i) => !i.update).map(({ rec }) => (
                  <span key={rec.id} style={{ padding: "3px 12px", borderRadius: 999, border: `1.5px solid ${BRAND.line}`, fontSize: 12.5 }}>
                    {rec.reviewee} · {rec.term}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </Card>

      {/* comment explorer */}
      <Card style={{ padding: 28, marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Search size={16} color={BRAND.magenta} />
          <h3 style={{ margin: 0, fontSize: 15, color: BRAND.ink }}>Comment explorer</h3>
        </div>
        <div style={{ display: "flex", gap: 12, marginBottom: 22, flexWrap: "wrap", alignItems: "center" }}>
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
      <Card style={{ padding: 28 }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 15, color: BRAND.ink }}>Submissions ({filtered.length})</h3>
        <div style={{ display: "grid", gap: 8 }}>
          {filtered.slice().reverse().map((s) => (
            <details key={s.id} style={{ border: `1px solid ${BRAND.line}`, borderRadius: 10, padding: "14px 16px" }}>
              <summary style={{ cursor: "pointer", fontSize: 14, color: BRAND.ink, display: "flex", justifyContent: "space-between", gap: 10 }}>
                <span><strong>{s.reviewee}</strong> · {s.faculty}</span>
                <span style={{ color: BRAND.grey, fontSize: 13 }}>{s.date} · {FORMS.find((f) => f.id === s.formType)?.name}</span>
              </summary>
              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                <DeviceSummary s={s} />
                {s.strands && STRANDS.map((st) => (
                  <div key={st.key} style={{ fontSize: 13 }}>
                    <span style={{ display: "inline-block", width: 90, fontWeight: 700, color: BRAND.magenta }}>{st.key}</span>
                    <span style={{ display: "inline-block", padding: "1px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700, color: "#fff", background: RATING_COLOUR[s.strands[st.key].rating] || BRAND.grey, marginRight: 8 }}>
                      {s.strands[st.key].rating}
                    </span>
                    <span style={{ color: BRAND.grey }}>{s.strands[st.key].comment}</span>
                  </div>
                ))}
                {s.overall && <div style={{ fontSize: 13, color: BRAND.grey, marginTop: 4 }}><em>{s.overall}</em></div>}
                {s.className && <div style={{ fontSize: 13, color: BRAND.grey, marginTop: 4 }}><strong>Class:</strong> {[s.yearGroup, s.className, s.lessonTitle].filter(Boolean).join(" · ")}{s.aen ? ` · ${s.aen} AEN learner${s.aen === "1" ? "" : "s"}` : ""}</div>}
                {s.lessonFocus && <div style={{ fontSize: 13, color: BRAND.grey, marginTop: 4 }}><strong>Lesson focus:</strong> {s.lessonFocus}</div>}
                {s.priorContext && <div style={{ fontSize: 13, color: BRAND.grey, marginTop: 4 }}><strong>Prior context:</strong> {s.priorContext}</div>}
                {s.inquiry && <div style={{ fontSize: 13, color: BRAND.grey, marginTop: 4 }}><strong>Inquiry:</strong> <em>{s.inquiry}</em></div>}
                {s.celebrate && <div style={{ fontSize: 13, color: BRAND.ink, marginTop: 4, padding: "8px 12px", background: "#FDFBF6", borderRadius: 8 }}><strong>Shout-out:</strong> {s.celebrate}</div>}
                {s.evenBetterIf && <div style={{ fontSize: 13, color: BRAND.grey, marginTop: 4 }}><strong>Even better if:</strong> {s.evenBetterIf}</div>}
                {s.nextStep && <div style={{ fontSize: 13, color: BRAND.grey, marginTop: 4 }}><strong>{s.formType === "dept-review" ? "Priority for next term" : "Worth trying"}:</strong> {s.nextStep}</div>}
                {s.supportNeeded && <div style={{ fontSize: 13, color: "#C0392B", marginTop: 4 }}><strong>Support needed:</strong> {s.supportNeeded}</div>}
                <WalkLogSummary entries={s.walkEntries} />
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
 *  MY DASHBOARD - your forms, drafts and share board posts
 * ------------------------------------------------------------------ */
const POLICY_SHORT = { phoneBox: "Phone box", headphones: "Headphones", chromebookOnly: "Chromebooks only" };
function DeviceSummary({ s }) {
  if (s.formType !== "device-walk") return null;
  const colour = (label, scale) => scale.find((o) => o.label === label)?.colour || BRAND.grey;
  return (
    <div style={{ fontSize: 13, color: BRAND.grey, display: "grid", gap: 6 }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {POLICY_CHECKS.map((c) => s.deviceChecks?.[c.key] ? (
          <span key={c.key} title={c.label} style={{
            padding: "2px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, color: "#fff",
            background: colour(s.deviceChecks[c.key], DEVICE_SCALE),
          }}>{POLICY_SHORT[c.key]}: {s.deviceChecks[c.key]}</span>
        ) : null)}
      </div>
      {s.impact && <div><strong>Impact on T&L:</strong> {s.impact}</div>}
      <div>
        <strong>Class Tools:</strong>{" "}
        {s.classTools?.used ? (
          <>
            in use · <span style={{ color: colour(s.classTools.rating, CLASSTOOLS_SCALE), fontWeight: 700 }}>{s.classTools.rating}</span>
            {s.classTools.note ? ` - ${s.classTools.note}` : ""}
          </>
        ) : "not in use this lesson"}
      </div>
    </div>
  );
}

function WalkLogSummary({ entries }) {
  if (!entries?.length) return null;
  const insight = walkInsight(entries);
  return (
    <div style={{ fontSize: 13, color: BRAND.grey }}>
      <strong>Department walk log ({entries.length} class{entries.length !== 1 ? "es" : ""}):</strong>
      <div style={{ display: "grid", gap: 5, marginTop: 6 }}>
        {entries.map((e) => (
          <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ color: BRAND.ink, fontWeight: 650 }}>{e.teacher}</span>
            <span>{[e.className, e.yearGroup].filter(Boolean).join(" · ")}</span>
            <span style={{ display: "flex", gap: 4 }}>
              {STRANDS.map((a) => e.ratings?.[a.key] ? (
                <span key={a.key} title={`${a.key}: ${e.ratings[a.key]}`} style={{
                  width: 18, height: 18, borderRadius: 5, display: "grid", placeItems: "center",
                  background: RATING_COLOUR[e.ratings[a.key]], color: "#fff", fontSize: 10, fontWeight: 800,
                }}>{a.letter}</span>
              ) : null)}
            </span>
            {e.note && <span style={{ fontStyle: "italic" }}>“{e.note}”</span>}
          </div>
        ))}
      </div>
      {insight && <div style={{ marginTop: 6, color: BRAND.ink }}>{insight}</div>}
    </div>
  );
}

const smallActionBtn = (danger) => ({
  padding: "5px 14px", borderRadius: 999, cursor: "pointer", fontFamily: "inherit",
  fontSize: 12, fontWeight: 700, background: "#fff",
  border: `1.5px solid ${danger ? "#E7C9C9" : BRAND.line}`,
  color: danger ? "#C0392B" : BRAND.magenta,
});

function SubmissionDetail({ s, onEdit, onDelete }) {
  return (
    <details style={{ border: `1px solid ${BRAND.line}`, borderRadius: 10, padding: "14px 16px" }}>
      <summary style={{ cursor: "pointer", fontSize: 13.5, color: BRAND.ink, display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontWeight: 650 }}>
          {FORMS.find((f) => f.id === s.formType)?.name} · {s.reviewee}{s.focus ? ` · Spotlight: ${s.focus}` : ""}
        </span>
        <span style={{ color: BRAND.grey, fontSize: 12.5 }}>{s.date} · {s.term} · by {s.reviewer}</span>
      </summary>
      <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
        <DeviceSummary s={s} />
        {s.strands && STRANDS.map((a) => {
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
        {s.className && <div style={{ fontSize: 13, color: BRAND.grey }}><strong>Class:</strong> {[s.yearGroup, s.className, s.lessonTitle].filter(Boolean).join(" · ")}{s.aen ? ` · ${s.aen} AEN learner${s.aen === "1" ? "" : "s"}` : ""}</div>}
        {s.lessonFocus && <div style={{ fontSize: 13, color: BRAND.grey }}><strong>Lesson focus:</strong> {s.lessonFocus}</div>}
        {s.priorContext && <div style={{ fontSize: 13, color: BRAND.grey }}><strong>Prior context:</strong> {s.priorContext}</div>}
        {s.inquiry && <div style={{ fontSize: 13, color: BRAND.grey }}><strong>Inquiry:</strong> <em>{s.inquiry}</em></div>}
        {s.celebrate && <div style={{ fontSize: 13, color: BRAND.ink, padding: "8px 12px", background: "#FDFBF6", borderRadius: 8 }}><strong>Shout-out:</strong> {s.celebrate}</div>}
        {s.evenBetterIf && <div style={{ fontSize: 13, color: BRAND.grey }}><strong>Even better if:</strong> {s.evenBetterIf}</div>}
        {s.nextStep && <div style={{ fontSize: 13, color: BRAND.grey }}><strong>{s.formType === "dept-review" ? "Priority for next term" : "Worth trying"}:</strong> {s.nextStep}</div>}
        {s.supportNeeded && <div style={{ fontSize: 13, color: "#C0392B" }}><strong>Support needed:</strong> {s.supportNeeded}</div>}
        <WalkLogSummary entries={s.walkEntries} />
        {s.links?.length > 0 && (
          <div style={{ fontSize: 13 }}>
            <strong style={{ color: BRAND.grey }}>Linked documents:</strong>{" "}
            {s.links.map((l, i) => (
              <a key={i} href={l} target="_blank" rel="noreferrer" style={{ color: BRAND.magenta, marginRight: 10, wordBreak: "break-all" }}>{l}</a>
            ))}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <PdfButton rec={s} subtle />
          {onEdit && <button onClick={() => onEdit(s)} style={smallActionBtn(false)}>Edit</button>}
          {onDelete && (
            <button onClick={() => { if (window.confirm("Delete this review? This can't be undone.")) onDelete(s.id); }}
              style={smallActionBtn(true)}>Delete</button>
          )}
        </div>
      </div>
    </details>
  );
}

function MyDashboard({ submissions, onResumeDraft, onEditSubmission, onDeleteSubmission }) {
  const [me, setMe] = useState(() => {
    try { return localStorage.getItem(ME_KEY) || "Amara Okafor"; } catch (e) { return "Amara Okafor"; }
  });
  const [drafts, setDrafts] = useState(loadDrafts());
  const [reflections, setReflections] = useState(loadReflections());
  const [editingPost, setEditingPost] = useState(null);
  const [editText, setEditText] = useState("");
  const saveReflections = (next) => {
    setReflections(next);
    try { localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(next)); } catch (e) { /* ignore */ }
  };
  const deletePost = (id) => {
    if (!window.confirm("Delete this post from the share board? This can't be undone.")) return;
    tombstoneSeed(id);
    saveReflections(reflections.filter((p) => p.id !== id));
  };
  const savePostEdit = (id) => {
    if (!editText.trim()) return;
    saveReflections(reflections.map((p) => (p.id === id ? { ...p, text: editText.trim() } : p)));
    setEditingPost(null); setEditText("");
  };
  const person = staffByName(me);
  const pickMe = (n) => {
    setMe(n);
    try { localStorage.setItem(ME_KEY, n); } catch (e) { /* ignore */ }
  };

  const byDate = (a, b) => (a.date < b.date ? 1 : -1);
  const myDrafts = drafts.filter((d) => !d.spine?.reviewer || d.spine.reviewer === me);
  const aboutMe = submissions.filter((s) => s.reviewee === me).slice().sort(byDate);
  const byMe = submissions.filter((s) => s.reviewer === me).slice().sort(byDate);
  const myPosts = reflections.filter((x) => x.name === me);
  const discard = (id) => { removeDraft(id); setDrafts(loadDrafts()); };

  const sectionH = { margin: "0 0 14px", fontSize: 15, color: BRAND.ink };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
        <div>
          <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-.03em", color: BRAND.ink, margin: "0 0 8px" }}>My dashboard</h2>
          <p style={{ color: BRAND.grey, margin: 0, fontSize: 14 }}>
            {person ? `${person.role} · ${person.level} · ${person.department}` : "Your forms, drafts and posts in one place."}
          </p>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: BRAND.grey }}>
          This is you
          <select style={{ ...inputStyle, width: "auto" }} value={me} onChange={(e) => pickMe(e.target.value)}>
            {STAFF.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
        </label>
      </div>
      <div style={{
        fontSize: 12, color: BRAND.grey, background: "#fff", border: `1px dashed ${BRAND.line}`,
        borderRadius: 10, padding: "8px 14px", marginBottom: 26,
      }}>
        Demo view - with staff login, this page would simply know who you are.
      </div>

      {/* stat tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 18, marginBottom: 30 }}>
        {[
          { label: "In progress", value: myDrafts.length, bg: "#C2651A" },
          { label: "Reviews of my practice", value: aboutMe.length, bg: BRAND.magenta },
          { label: "Reviews I've written", value: byMe.length, bg: "#8447B0" },
          { label: "Share board posts", value: myPosts.length, bg: BRAND.green },
        ].map((stat) => (
          <div key={stat.label} style={{ background: stat.bg, borderRadius: 20, padding: "26px 28px", color: "#fff" }}>
            <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: "-.03em", lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.88, marginTop: 8 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* drafts */}
      <Card style={{ padding: 28, marginBottom: 22 }}>
        <h3 style={sectionH}>In progress</h3>
        {myDrafts.length === 0 ? (
          <p style={{ color: BRAND.grey, fontSize: 13.5, margin: 0 }}>
            Nothing in progress. Start a form from All Staff and use “Save draft” to park it here.
          </p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {myDrafts.map((d) => (
              <div key={d.id} style={{
                display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
                border: `1px solid ${BRAND.line}`, borderRadius: 12, padding: "12px 16px",
              }}>
                <span style={{
                  fontSize: 10.5, fontWeight: 800, letterSpacing: ".08em", color: "#C2651A",
                  border: "1.5px solid #C2651A", borderRadius: 999, padding: "3px 10px",
                }}>Draft</span>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: BRAND.ink }}>
                    {FORMS.find((f) => f.id === d.formId)?.name}
                    {d.spine?.reviewee ? ` - reviewing ${d.spine.reviewee}` : ""}
                  </div>
                  <div style={{ fontSize: 12, color: BRAND.grey }}>Saved {d.savedAt}{d.spine?.term ? ` · ${d.spine.term}` : ""}</div>
                </div>
                <button onClick={() => onResumeDraft(d)} style={{
                  padding: "8px 18px", borderRadius: 999, border: "none", background: BRAND.magenta,
                  color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                }}>Continue</button>
                <button onClick={() => discard(d.id)} style={{
                  padding: "8px 14px", borderRadius: 999, border: `1.5px solid ${BRAND.line}`, background: "#fff",
                  color: BRAND.grey, fontWeight: 650, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                }}>Discard</button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* reviews about me */}
      <Card style={{ padding: 28, marginBottom: 22 }}>
        <h3 style={sectionH}>Reviews of my practice</h3>
        {aboutMe.length === 0 ? (
          <p style={{ color: BRAND.grey, fontSize: 13.5, margin: 0 }}>No reviews yet this year.</p>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>{aboutMe.map((s) => <SubmissionDetail key={s.id} s={s} />)}</div>
        )}
      </Card>

      {/* reviews I wrote */}
      <Card style={{ padding: 28, marginBottom: 22 }}>
        <h3 style={sectionH}>Reviews I've written</h3>
        {byMe.length === 0 ? (
          <p style={{ color: BRAND.grey, fontSize: 13.5, margin: 0 }}>None yet - your turn will come around.</p>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {byMe.map((s) => <SubmissionDetail key={s.id} s={s} onEdit={onEditSubmission} onDelete={onDeleteSubmission} />)}
          </div>
        )}
      </Card>

      {/* my posts */}
      <Card style={{ padding: 28 }}>
        <h3 style={sectionH}>My share board posts</h3>
        {myPosts.length === 0 ? (
          <p style={{ color: BRAND.grey, fontSize: 13.5, margin: 0 }}>Nothing shared yet - pin something to the Share board.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
            {myPosts.map((post) => (
              <div key={post.id} style={{ border: `1px solid ${BRAND.line}`, borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {post.photo && <img src={post.photo} alt="" style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }} />}
                <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", flex: 1 }}>
                  {editingPost === post.id ? (
                    <>
                      <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical", fontSize: 13 }} value={editText}
                        onChange={(e) => setEditText(e.target.value)} />
                      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                        <button onClick={() => savePostEdit(post.id)} disabled={!editText.trim()} style={{
                          ...smallActionBtn(false), background: editText.trim() ? BRAND.magenta : BRAND.line,
                          color: editText.trim() ? "#fff" : BRAND.grey, border: "none",
                        }}>Save</button>
                        <button onClick={() => { setEditingPost(null); setEditText(""); }} style={smallActionBtn(false)}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: 13, color: BRAND.ink, lineHeight: 1.5, margin: 0, flex: 1 }}>{post.text}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11.5, color: BRAND.grey, marginRight: "auto" }}>{post.date}</span>
                        <button onClick={() => { setEditingPost(post.id); setEditText(post.text); }} style={smallActionBtn(false)}>Edit</button>
                        <button onClick={() => deletePost(post.id)} style={smallActionBtn(true)}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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

  // team profile: every review of a direct report, counted per area
  const teamSubs = submissions.filter((x) => reports.some((r) => r.name === x.reviewee));
  const teamCounts = {};
  STRANDS.forEach((s) => { teamCounts[s.key] = { Developing: 0, Embedded: 0, Transformational: 0 }; });
  teamSubs.forEach((sub) => {
    STRANDS.forEach((s) => {
      const r = sub.strands?.[s.key]?.rating;
      if (r) teamCounts[s.key][r]++;
    });
  });
  const teamChart = STRANDS.map((s) => ({ strand: s.key, ...teamCounts[s.key] }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
        <div>
          <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-.03em", color: BRAND.ink, margin: "0 0 10px" }}>My team</h2>
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
        borderRadius: 10, padding: "8px 14px", marginBottom: 26,
      }}>
        Demo view - in production this page sits behind staff login, and names, levels and line management sync from BromCom.
      </div>

      {teamSubs.length > 0 && (
        <Card style={{ padding: 28, marginBottom: 26 }}>
          <h3 style={{ margin: "0 0 4px", fontSize: 15, color: BRAND.ink }}>What T&L looks like across the team</h3>
          <p style={{ fontSize: 13, color: BRAND.grey, margin: "0 0 14px", lineHeight: 1.5 }}>
            Every review and walk of your {reports.length} direct report{reports.length !== 1 ? "s" : ""} this year,
            by area - {teamSubs.length} review{teamSubs.length !== 1 ? "s" : ""} in total.
          </p>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={teamChart} margin={{ left: -20 }}>
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
      )}

      {reports.length === 0 ? (
        <p style={{ color: BRAND.grey, fontSize: 14 }}>No direct reports found for {who}.</p>
      ) : (
        <div style={{ display: "grid", gap: 20 }}>
          {reports.map((r) => {
            const subs = submissions
              .filter((x) => x.reviewee === r.name)
              .slice()
              .sort((a, b) => (a.date < b.date ? 1 : -1));
            const latest = subs[0];
            return (
              <Card key={r.name} style={{ padding: 26 }}>
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
                        <span key={a.key} title={`${a.key}: ${rating || "-"}`} style={{
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
                      <details key={s.id} style={{ border: `1px solid ${BRAND.line}`, borderRadius: 10, padding: "14px 16px" }}>
                        <summary style={{ cursor: "pointer", fontSize: 13.5, color: BRAND.ink, display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 650 }}>{FORMS.find((f) => f.id === s.formType)?.name}{s.focus ? ` · Spotlight: ${s.focus}` : ""}</span>
                          <span style={{ color: BRAND.grey, fontSize: 12.5 }}>{s.date} · {s.term} · by {s.reviewer}</span>
                        </summary>
                        <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                          <DeviceSummary s={s} />
                          {s.strands && STRANDS.map((a) => {
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
                          {s.className && <div style={{ fontSize: 13, color: BRAND.grey }}><strong>Class:</strong> {[s.yearGroup, s.className, s.lessonTitle].filter(Boolean).join(" · ")}{s.aen ? ` · ${s.aen} AEN learner${s.aen === "1" ? "" : "s"}` : ""}</div>}
        {s.lessonFocus && <div style={{ fontSize: 13, color: BRAND.grey }}><strong>Lesson focus:</strong> {s.lessonFocus}</div>}
        {s.priorContext && <div style={{ fontSize: 13, color: BRAND.grey }}><strong>Prior context:</strong> {s.priorContext}</div>}
        {s.inquiry && <div style={{ fontSize: 13, color: BRAND.grey }}><strong>Inquiry:</strong> <em>{s.inquiry}</em></div>}
        {s.celebrate && <div style={{ fontSize: 13, color: BRAND.ink, padding: "8px 12px", background: "#FDFBF6", borderRadius: 8 }}><strong>Shout-out:</strong> {s.celebrate}</div>}
                          {s.evenBetterIf && <div style={{ fontSize: 13, color: BRAND.grey }}><strong>Even better if:</strong> {s.evenBetterIf}</div>}
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
const BOT_SYSTEM = `You are the T&L Assistant, the BRIT T&L Development Studio's built-in helper for an arts and performing-arts specialist institution. You help staff understand and complete the BRIT lesson framework and its peer review process.

The BRIT framework is the shared, non-judgmental professional language for reviews, learning walks and quality assurance. It answers "what does excellent teaching and learning look like here?" through three lenses: what can you see, what can you hear, and how does it feel? It has four areas:

- Belonging (inclusion and culture; teaching standards 1 and 5): every student is known and greeted - nobody is invisible at the back. Access is proactively planned for neurodiversity and quiet learners. The room reflects who is in it: identities, voices, and a range of work on show. It is safe to take creative risks and fail. Grounded in psychological safety (Amy Edmondson) and attachment and trauma-informed pedagogy.
- Room (the physical and digital environment and how it is used; standards 5 and 7): the spatial layout actively fits the technical and creative tasks. Sightlines work so everyone can see the board, screen, device or demonstration. Resources, cables, floor space and kit are safe, accessible and ready before learning starts. Grounded in the Reggio Emilia idea of the environment as "third teacher" and vocational studio ergonomics.
- Intent (rigour and standards; standards 3 and 4): it is transparent what is being learned and why, not just what is being "done". Living models of excellence are visible, keeping professional, vocational and academic standards aspirational and rigorous. Pitch stretches the strongest without losing anyone. At the top end, the work has an audience beyond the teacher - performed, published, pitched or used - and redrafting is normal because critique makes the work better. Grounded in Visible Learning (John Hattie) and expert modelling.
- Travel (cognitive processing; standards 2, 4 and 6): students do the heavy cognitive thinking and creative work rather than watching it happen. Direct, purposeful dialogue and targeted questioning dig past surface answers. Formative feedback lands and is acted on in the lesson. Progress is visible in the work - all have moved forward. At the top end, students make real choices about how they work, recover from mistakes, and carry learning from one context into another - crew, not passengers. Grounded in Rosenshine's Principles of Instruction and Dylan Wiliam's formative assessment.

Reviews use three DEVELOPMENTAL DESCRIPTORS: Developing (practice is taking root), Embedded (consistent everyday practice), Transformational (practice that lifts the whole room). They describe where practice currently sits on an area, as stages of a journey.

Framework vocabulary, for coaching conversations: agency with guardrails (structure with real choice inside it - crew, not passengers); authentic audience (work that is performed, published, pitched or used beyond the room - at the top end, feedback sounds like "this works" or "this breaks" rather than a mark); craftsmanship (redrafting is normal, critique makes the work better); healthy struggle (being stuck is treated as part of learning); the three Cs (competence - work that holds up; chemistry - working well with others, leading and following; character - how you respond when the work is difficult); and access-first rooms (access tools like text-to-speech and dictation are a normal part of the room and let ability surface). Use this vocabulary when helping a reviewer picture what the top end of an area looks like. An example of coaching a focus into an agency-flavoured inquiry: "I want to investigate how offering three routes through the task affects how many students start without prompting."

The peer review process: reviews run termly by curriculum area, with pairings built with heads of department around staff availability. Before the lesson, the pair agree ONE narrow focus area - the spotlight. The reviewer records the shared details (date, term, faculty, colleague, reviewer, class context) and the lesson focus (what the students should learn and why, plus prior context and considerations), taps the practice points they noticed, chooses a descriptor for each area, comments in depth on the spotlight area, and closes with a shout-out (something to feel proud of), an optional "even better if" reflection, and one small idea worth trying. At the end of term, staff log a two-minute "Micro-Insight" reflection on the digital reflections share board - the share board has its own page in the Studio's navigation, where staff can share reflections about their practice or development (with a photo) at any time. Learning Walks are lighter: the class being visited, a spotlight focus (the area the walk is looking for), descriptors per area, plus one overall observation. There is also a Device & Phone Walk, checking how the new device policy is landing and its impact on teaching and learning. The policy: phones go in the box at the start of the lesson, headphones are off and away unless directed, and no smart devices other than Chromebooks. The walk rates each expectation (In place / Mostly - needed a nudge / Not yet), records the impact on teaching and learning in the walker's words, and ticks whether Class Tools was being used in the lesson and how well that's going (Working well / Patchy / Not really working). It is a policy check whose results SLT sees - it reads how the roll-out is landing, not the teacher's capability. Heads of department also complete a termly Departmental Review: the same four areas at department level, closing with the department's proudest practice, a priority for next term, and any support needed from SLT or the T&L team. The Departmental Review includes a department walk log: when a head of department walks their own department, they log each class individually - teacher, class, year group, a quick descriptor per area they saw, and a one-line note. The form aggregates the entries live into a per-area picture with an automatic insight (the department's strength on the walk, and the area with most room to grow), which informs the head of department's overall stock-take. The walk log travels with the record to the SLT dashboard and the PDF export. Forms can be saved as drafts and finished later, and every member of staff has a My Dashboard page showing their drafts in progress, reviews of their practice, reviews they have written, and their share board posts. From My Dashboard, staff can also edit or delete their own work: share board posts can be edited in place or deleted, and reviews they have written can be reopened in the form (pre-filled), corrected and resubmitted - the update replaces the original everywhere it appears - or deleted entirely. Reviews of your practice written by someone else are theirs, not yours - only the reviewer can edit or delete a review.

The coaching model: peer reviews run on a genuine spirit of enquiry - the pair are equals, and the reviewer's job is to ask, not tell. Be a mirror, not a critic: describe what you saw and ask your partner to interpret it. Keep the conversation on the learning, not the person, and build rapport before challenge. Before the lesson, the pair coach a vague focus into a specific inquiry question - "I want to work on behaviour" becomes "I want to investigate how clearer transition routines at the start of the lesson affect how quickly Year 10 start independent tasks" - recorded in the required inquiry field on the form's spotlight card. Always ask: will this focus genuinely stretch the practice? The peer review's shared details also require class context - year group, class name, lesson title and the number of AEN learners in the class - so the pair know where the inquiry will be answered and who needs planning for. The Peer Review form carries a collapsible bank of coaching questions in five phases: opening on strengths ("Which three things were you pleased with in that lesson?"), students & learning ("Which points were students most engaged in, and why?", "Who struggled most, and what would have supported them?"), teaching decisions ("You chose to… - what did you want to achieve there?", "If we'd filmed that lesson, which parts would look lively and which quiet?"), the what-ifs ("What would have happened if you had…?", "What else could you have done when…?"), and action planning ("What small steps could you make, and what do you need to make that happen?", "What are the three biggest learning points you're taking away?"). The golden rules of feedback: be specific not waffly (say what you noticed and its measurable effect, not "good"), link it to the why (the impact on learners), and future-proof it (where can this apply next?). If a review includes student voice, useful learner questions include: "What do you expect to learn in this lesson?", "Can you explain what you are doing and why?", "How is this helping you learn - what helps you most?", "How well do you think you are doing, and how do you know?", and "Are the comments on your work helpful - how?". When someone asks you for coaching help, act as a coach: offer one or two questions at a time matched to where their conversation is, rather than reciting the whole bank.

The follow-through loop: every peer review ends with one idea worth trying, and that idea stays open until its owner closes it. When a colleague with an open idea selects their name on the share board, the idea is pulled through automatically - they post a short update on how it went, evaluate it (Becoming habit / Tried it - refining / Adapted it) and tick it off. The next reviewer of that colleague sees last time's idea at the top of the form and asks how it went - trying the idea matters more than ticking the box. Ticked-off ideas and their reflections feed the SLT dashboard's follow-through view. Developmental success in this framework means movement: area profiles shifting from Developing toward Embedded and Transformational over time, every teacher engaged in the cycle, and ideas from reviews actually getting tried - the All Staff page has a "What developmental success looks like" panel explaining exactly this.

If staff ask how the data is used or who can see it, answer factually and briefly, without editorialising in either direction: reviews and descriptors are visible on the SLT dashboard (which any staff member can open), line managers see their team's reviews, and the data aggregates by area, department, team and year group. Do not claim the system keeps no data or that nothing is tracked, and equally do not lecture anyone about quality assurance - just describe what the Studio does and let people draw their own conclusions.

Important terminology: at this school "strands" means the vocational departments, so never call the four framework areas "strands" - call them areas. Answer in British English, warmly and concisely. If asked about something you do not have - a specific policy detail, a calendar date, a named person's data - say you do not have that and suggest checking with the T&L team. Never invent specifics. Keep answers to a few sentences unless more is genuinely needed.`;

function HelpBot({ open, setOpen, raised }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi - I can help with anything about the BRIT framework and the review process. What do the four areas mean, how do the descriptors work, how to complete a review. What would you like to know?" },
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
      setMessages((m) => [...m, { role: "assistant", content: text || "Sorry - I couldn't generate a reply just then. Try again?" }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: "Something went wrong reaching the assistant. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        position: "fixed", bottom: raised ? 66 : 20, right: 24, width: 58, height: 58, borderRadius: "50%",
        background: BRAND.magenta, border: "none", cursor: "pointer", boxShadow: "0 6px 20px rgba(173,34,126,.35)",
        display: "grid", placeItems: "center", zIndex: 50,
      }}>
        <MessageCircle size={26} color="#fff" />
      </button>
    );
  }

  return (
    <div style={{
      position: "fixed", bottom: raised ? 66 : 20, right: 24, width: 380, maxWidth: "calc(100vw - 32px)", height: 540, maxHeight: "calc(100vh - 110px)",
      background: "#fff", borderRadius: 18, boxShadow: "0 12px 40px rgba(42,30,39,.25)", display: "flex", flexDirection: "column", zIndex: 50,
      border: `1px solid ${BRAND.line}`, overflow: "hidden",
    }}>
      <div style={{ background: BRAND.magenta, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff" }}>
          <Bot size={20} /> <span style={{ fontWeight: 700, fontSize: 15 }}>T&amp;L Assistant</span>
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
function useNarrow(query = "(max-width: 700px)") {
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
      padding: narrow ? "12px 16px" : "16px 16px 18px",
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
  const [resumeDraft, setResumeDraft] = useState(null);
  const [botOpen, setBotOpen] = useState(false);
  const narrow = useNarrow();

  useEffect(() => {
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
      const exists = prev.some((x) => x.id === rec.id);
      const next = exists ? prev.map((x) => (x.id === rec.id ? rec : x)) : [...prev, rec];
      saveSubmissions(next);
      return next;
    });
  };

  const deleteSubmission = (id) => {
    setSubmissions((prev) => {
      const next = prev.filter((x) => x.id !== id);
      saveSubmissions(next);
      return next;
    });
  };

  // Reopen a submitted record in its form, pre-filled; submitting replaces it.
  const editSubmission = (rec) => {
    setResumeDraft({
      id: rec.id, formId: rec.formType, editOf: rec.id,
      spine: {
        date: rec.date || "", term: rec.term || "", academicYear: rec.academicYear || "",
        faculty: rec.faculty || "", reviewee: rec.formType === "dept-review" ? "" : (rec.reviewee || ""),
        reviewer: rec.reviewer || "", yearGroup: rec.yearGroup || "", className: rec.className || "",
        lessonTitle: rec.lessonTitle || "", aen: rec.aen || "",
      },
      strands: rec.strands, focusStrand: rec.focus || "", inquiry: rec.inquiry || "",
      lessonFocus: rec.lessonFocus || "", priorContext: rec.priorContext || "",
      celebrate: rec.celebrate || "", evenBetterIf: rec.evenBetterIf || "", nextStep: rec.nextStep || "",
      supportNeeded: rec.supportNeeded || "", links: rec.links?.length ? rec.links : [""],
      walkEntries: rec.walkEntries || [], overall: rec.overall || "",
      deviceChecks: rec.deviceChecks || {}, impact: rec.impact || "",
      classTools: rec.classTools || { used: false, rating: "", note: "" },
    });
    setSelectedForm(rec.formType);
    setRole("staff");
  };

  const font = "'Archivo','Helvetica Neue',Arial,sans-serif";
  const nav = [
    { key: "staff", num: "01", label: "All Staff", colour: BRAND.magenta },
    { key: "me", num: "02", label: "My Dashboard", colour: "#46B749" },
    { key: "board", num: "03", label: "Share board", colour: "#C2651A" },
    { key: "slt", num: "04", label: "SLT", colour: "#8447B0" },
    { key: "manager", num: "05", label: "Line Manager", colour: BRAND.ink },
  ];

  return (
    <div style={{ minHeight: "100vh", background: BRAND.pink, fontFamily: font, color: BRAND.ink }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: narrow ? "20px 18px 96px" : "34px 38px 112px",
        display: "flex", gap: narrow ? 20 : 36,
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
          <div style={{ padding: narrow ? "0 4px" : "6px 2px 14px", flexBasis: narrow ? "100%" : "auto" }}>
            <svg width={narrow ? 100 : 136} viewBox="0 0 142 202" role="img" aria-label="BRIT T&L Development Studio" style={{ display: "block", overflow: "visible" }}>
              <text x="0" y="54" textLength="142" lengthAdjust="spacingAndGlyphs"
                style={{ fontFamily: "'Anton',sans-serif", fontSize: 74, fill: BRAND.magenta }}>BRIT</text>
              <text x="0" y="127" textLength="142" lengthAdjust="spacingAndGlyphs"
                style={{ fontFamily: "'Anton',sans-serif", fontSize: 84, fill: "none", stroke: BRAND.ink, strokeWidth: 2 }}>T&amp;L</text>
              <text x="0" y="157" textLength="142" lengthAdjust="spacingAndGlyphs"
                style={{ fontFamily: "'Anton',sans-serif", fontSize: 24, fill: BRAND.ink }}>DEVELOPMENT</text>
              <text x="0" y="198" textLength="142" lengthAdjust="spacingAndGlyphs"
                style={{ fontFamily: "'Anton',sans-serif", fontSize: 38, fill: "none", stroke: BRAND.magenta, strokeWidth: 1.7 }}>STUDIO<tspan style={{ fill: BRAND.magenta, stroke: "none" }}>.</tspan></text>
            </svg>
          </div>
          {nav.map((n) => (
            <NavTile key={n.key} {...n} narrow={narrow} active={role === n.key}
              onClick={() => { setRole(n.key); setSelectedForm(null); setResumeDraft(null); }} />
          ))}
          <NavTile num="06" label="T&L Assistant" colour={BRAND.magenta} narrow={narrow}
            active={false} onClick={() => setBotOpen(true)} />
          {!narrow && (
            <div style={{ fontSize: 10.5, fontWeight: 600, color: BRAND.grey, letterSpacing: ".06em", padding: "6px 2px" }}>
              BRIT framework · prototype
            </div>
          )}
        </aside>

        {/* body */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <p style={{ color: BRAND.grey }}>Loading…</p>
          ) : role === "staff" ? (
            selectedForm
              ? <ReviewForm key={resumeDraft ? resumeDraft.id : selectedForm} formId={selectedForm} draft={resumeDraft}
                  submissions={submissions}
                  onBack={() => { setSelectedForm(null); setResumeDraft(null); }} onSubmit={addSubmission} />
              : <FormSelector onSelect={setSelectedForm} />
          ) : role === "me" ? (
            <MyDashboard submissions={submissions}
              onResumeDraft={(d) => { setResumeDraft(d); setSelectedForm(d.formId); setRole("staff"); }}
              onEditSubmission={editSubmission} onDeleteSubmission={deleteSubmission} />
          ) : role === "board" ? (
            <ReflectionsBoard submissions={submissions} />
          ) : role === "manager" ? (
            <ManagerDashboard submissions={submissions} />
          ) : (
            <SLTDashboard submissions={submissions} />
          )}
        </main>
      </div>

      {role === "staff" && !selectedForm && <Ticker />}
      <HelpBot open={botOpen} setOpen={setBotOpen} raised={role === "staff" && !selectedForm} />
    </div>
  );
}
