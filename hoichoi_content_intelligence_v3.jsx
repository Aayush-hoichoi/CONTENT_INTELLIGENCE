import { useState, useCallback } from "react";

const C = {
  bg: "#08080D", surface: "#111118", card: "#16161F", cardHover: "#1C1C28",
  border: "#252530", borderLight: "#2E2E3A",
  red: "#C8102E", redGlow: "rgba(200,16,46,0.12)", redSoft: "#E8354E", redDark: "#8B0A1E",
  text: "#F0F0F2", textSec: "#A0A0B8", textDim: "#5E5E74",
  green: "#34C759", greenBg: "rgba(52,199,89,0.12)",
  orange: "#FF9F0A", orangeBg: "rgba(255,159,10,0.12)",
  purple: "#BF5AF2", purpleBg: "rgba(191,90,242,0.12)",
  blue: "#64D2FF", blueBg: "rgba(100,210,255,0.12)",
  gold: "#D4A853", goldBg: "rgba(212,168,83,0.12)",
  pink: "#FF6B8A", teal: "#30D5C8", cyan: "#5AC8FA", magenta: "#FF2D78",
};

const FONT = "'DM Sans', -apple-system, sans-serif";
const TOTAL_DUR = 1885;
function fmtTime(sec) { const m = Math.floor(sec / 60); const s = Math.floor(sec % 60); return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`; }
function pctT(sec) { return (sec / TOTAL_DUR) * 100; }

// ===== MOCK DATA =====
const libraryShows = [
  { id: 1, title: "Indubala Bhaater Hotel", season: "S1", eps: 8, genre: "Drama", year: 2025, scenes: 52, shots: 264, frames: 1134, status: "Analysed" },
  { id: 2, title: "Karagar", season: "S1", eps: 6, genre: "Thriller", year: 2024, scenes: 78, shots: 412, frames: 2340, status: "Analysed" },
  { id: 3, title: "Byomkesh Bakshi", season: "S4", eps: 2, genre: "Mystery", year: 2025, scenes: 134, shots: 680, frames: 4120, status: "Analysed" },
  { id: 4, title: "Robindronath Ekhane Kawkhono Khete Asenni", season: "Film", eps: 1, genre: "Drama", year: 2025, scenes: 96, shots: 520, frames: 3200, status: "Analysed" },
  { id: 5, title: "Mandaar", season: "S1", eps: 8, genre: "Thriller", year: 2024, scenes: 88, shots: 390, frames: 2100, status: "Analysed" },
];

const characters = [
  { name: "Subhashree Ganguly", role: "Indubala Mallick", color: "#C8102E" },
  { name: "Parijat Chaudhuri", role: "Young Indubala", color: "#D4A853" },
  { name: "Pratik Dutta", role: "Ratanlal Mallick", color: "#34C759" },
  { name: "Sneha Chatterjee", role: "Lachhmi", color: "#BF5AF2" },
  { name: "Angana Royy", role: "Sanchari", color: "#FF9F0A" },
  { name: "Debdutta Raha", role: "Monirul", color: "#64D2FF" },
  { name: "Mithu Chakrabarty", role: "Indubala's Mother", color: "#FF6B8A" },
  { name: "Debapratim Dasgupta", role: "Dhananjay", color: "#8B0A1E" },
];

const scenes = [
  { id: 1, tc: "00:03:17", dur: "31.1s", title: "Indubala's Heartfelt Call", emotion: "Sadness", actors: ["Subhashree Ganguly"], location: "Home", shotType: "Close up", score: 0.59 },
  { id: 2, tc: "00:08:48", dur: "33.2s", title: "Mother-in-Law: A Sweet Scorn", emotion: "Disgust", actors: ["Mithu Chakrabarty", "Subhashree Ganguly"], location: "Kitchen", shotType: "Mid shot", score: 0.31 },
  { id: 3, tc: "00:19:42", dur: "39.1s", title: "The Unspoken Promise", emotion: "Happy", actors: ["Subhashree Ganguly", "Pratik Dutta"], location: "Farmhouse", shotType: "Wide", score: 0.35 },
  { id: 4, tc: "00:20:22", dur: "1m 2s", title: "Lachhmi's Tilapia Tussle", emotion: "Anger", actors: ["Sneha Chatterjee"], location: "Kitchen", shotType: "Close up", score: 0.46 },
  { id: 5, tc: "00:23:24", dur: "49.2s", title: "Generational Tensions in Kolkata", emotion: "Anger", actors: ["Subhashree Ganguly", "Mithu Chakrabarty"], location: "Home", shotType: "Mid shot", score: 0.27 },
  { id: 6, tc: "00:25:58", dur: "29.3s", title: "Ratanlal's Quiet Confession", emotion: "Sadness", actors: ["Pratik Dutta"], location: "Cellar", shotType: "Close up", score: 0.22 },
  { id: 7, tc: "00:28:44", dur: "35.7s", title: "Sanchari's Secret Revealed", emotion: "Surprise", actors: ["Angana Royy", "Debdutta Raha"], location: "Home", shotType: "Wide", score: 0.38 },
  { id: 8, tc: "00:30:10", dur: "20.1s", title: "A Night of Quiet Reflection", emotion: "Sadness", actors: ["Subhashree Ganguly"], location: "Meadow", shotType: "Wide", score: 0.21 },
];

const timelineTracks = [
  { label: "Scene", color: C.red, segments: [
    { start: 0, end: 12, name: "7: Heartfelt Call" }, { start: 12, end: 22, name: "8: Mother-in-Law" },
    { start: 22, end: 35, name: "9: Kitchen Drama" }, { start: 35, end: 50, name: "10: The Promise" },
    { start: 50, end: 68, name: "11: Tilapia Tussle" }, { start: 68, end: 82, name: "12: Tensions" },
    { start: 82, end: 92, name: "13: Confession" }, { start: 92, end: 100, name: "14: Reflection" },
  ]},
  { label: "Shot", color: C.gold, segments: Array.from({length: 28}, (_, i) => ({ start: i * 3.57, end: (i + 1) * 3.57, name: `Shot ${154680 + i * 18340}` })) },
  { label: "Person", color: C.purple, segments: [
    { start: 0, end: 18, name: "Subhashree G." }, { start: 20, end: 35, name: "Mithu C." },
    { start: 22, end: 42, name: "Subhashree G." }, { start: 45, end: 58, name: "Sneha C." },
    { start: 60, end: 75, name: "Subhashree G." }, { start: 78, end: 90, name: "Pratik D." },
    { start: 88, end: 100, name: "Angana R." },
  ]},
  { label: "Speech", color: C.green, segments: [
    { start: 2, end: 8, name: "Speech #38" }, { start: 10, end: 16, name: "Speech #39" },
    { start: 18, end: 22, name: "Speech #40" }, { start: 25, end: 32, name: "Speech #41" },
    { start: 35, end: 40, name: "Speech #42" }, { start: 44, end: 52, name: "Speech #43" },
    { start: 55, end: 60, name: "Speech #44" }, { start: 63, end: 70, name: "Speech #45" },
    { start: 74, end: 80, name: "Speech #46" }, { start: 85, end: 92, name: "Speech #47" },
    { start: 95, end: 100, name: "Speech #48" },
  ]},
  { label: "Emotion", color: C.orange, segments: [
    { start: 0, end: 15, name: "Sadness" }, { start: 15, end: 30, name: "Disgust" },
    { start: 30, end: 45, name: "Happy" }, { start: 45, end: 65, name: "Anger" },
    { start: 65, end: 80, name: "Anger" }, { start: 80, end: 92, name: "Sadness" },
    { start: 92, end: 100, name: "Sadness" },
  ]},
  { label: "Music", color: C.pink, segments: [
    { start: 5, end: 14, name: "Music #170" }, { start: 18, end: 28, name: "Music #171" },
    { start: 38, end: 48, name: "Music #172" }, { start: 62, end: 72, name: "Music #173" },
    { start: 82, end: 95, name: "Music #174" },
  ]},
  { label: "NSFW", color: "#FF3355", segments: [{ start: 48, end: 50, name: "NS" }] },
  { label: "Object", color: C.blue, segments: [
    { start: 8, end: 12, name: "Painting" }, { start: 32, end: 36, name: "Cigarette" },
    { start: 55, end: 58, name: "Gun" }, { start: 75, end: 78, name: "Bottle" },
  ]},
  { label: "Place", color: "#88CCAA", segments: [
    { start: 0, end: 18, name: "Home" }, { start: 18, end: 35, name: "Kitchen" },
    { start: 35, end: 50, name: "Farmhouse" }, { start: 50, end: 68, name: "Kitchen" },
    { start: 68, end: 82, name: "Home" }, { start: 82, end: 92, name: "Cellar" },
    { start: 92, end: 100, name: "Meadow" },
  ]},
  { label: "Sound", color: "#AAB8FF", segments: [
    { start: 3, end: 6, name: "Door" }, { start: 15, end: 17, name: "Utensils" },
    { start: 42, end: 44, name: "Splash" }, { start: 60, end: 62, name: "Footsteps" },
    { start: 85, end: 87, name: "Wind" },
  ]},
];

const snpFlags = [
  { tc: "00:08:12", type: "Copyright", sev: "High", desc: "Brand logo on packaged food product visible in kitchen", rule: "CR-08", resolved: false },
  { tc: "00:23:11", type: "S&P", sev: "High", desc: "Smoking scene — missing 'Smoking Kills' disclaimer", rule: "SP-19", resolved: false },
  { tc: "00:32:05", type: "Copyright", sev: "Medium", desc: "Background music needs license verification", rule: "CR-01", resolved: true },
  { tc: "00:45:18", type: "S&P", sev: "Low", desc: "Real phone number on wall poster", rule: "SP-02", resolved: false },
  { tc: "01:02:30", type: "S&P", sev: "Medium", desc: "Footwear in temple scene — check compliance", rule: "SP-11", resolved: false },
  { tc: "01:15:44", type: "S&P", sev: "High", desc: "Child actor in mature dialogue scene", rule: "SP-23", resolved: false },
];

// ===== TIMELINE ANALYSER DATA =====
const tlTracks = [
  { id: "scene", label: "Scene", color: C.red, segments: [
    { s: 0, e: 68, name: "1: Opening — Morning Ritual", meta: { genre: "Drama", mood: "Calm", characters: ["Subhashree Ganguly"] } },
    { s: 68, e: 197, name: "2: Courtyard Gossip", meta: { genre: "Comedy", mood: "Light", characters: ["Sneha Chatterjee", "Angana Royy"] } },
    { s: 197, e: 310, name: "3: Heartfelt Call", meta: { genre: "Drama", mood: "Emotional", characters: ["Subhashree Ganguly"] } },
    { s: 310, e: 425, name: "4: Kitchen Preparations", meta: { genre: "Family", mood: "Warm", characters: ["Sneha Chatterjee", "Mithu Chakrabarty"] } },
    { s: 425, e: 528, name: "5: Mother-in-Law's Scorn", meta: { genre: "Drama", mood: "Tense", characters: ["Mithu Chakrabarty", "Subhashree Ganguly"] } },
    { s: 528, e: 680, name: "6: Ratanlal Arrives", meta: { genre: "Drama", mood: "Neutral", characters: ["Pratik Dutta", "Subhashree Ganguly"] } },
    { s: 680, e: 820, name: "7: The Unspoken Promise", meta: { genre: "Romance", mood: "Tender", characters: ["Subhashree Ganguly", "Pratik Dutta"] } },
    { s: 820, e: 990, name: "8: Tilapia Tussle", meta: { genre: "Drama", mood: "Angry", characters: ["Sneha Chatterjee"] } },
    { s: 990, e: 1120, name: "9: Temple Prayer", meta: { genre: "Family", mood: "Spiritual", characters: ["Subhashree Ganguly"] } },
    { s: 1120, e: 1280, name: "10: Generational Tensions", meta: { genre: "Drama", mood: "Heated", characters: ["Subhashree Ganguly", "Mithu Chakrabarty"] } },
    { s: 1280, e: 1420, name: "11: Secret Visit", meta: { genre: "Thriller", mood: "Suspense", characters: ["Debdutta Raha", "Angana Royy"] } },
    { s: 1420, e: 1560, name: "12: Sanchari's Confession", meta: { genre: "Drama", mood: "Emotional", characters: ["Angana Royy"] } },
    { s: 1560, e: 1700, name: "13: Night Reflection", meta: { genre: "Drama", mood: "Melancholic", characters: ["Subhashree Ganguly"] } },
    { s: 1700, e: 1885, name: "14: Dawn Over Hotel", meta: { genre: "Drama", mood: "Hopeful", characters: ["Subhashree Ganguly", "Pratik Dutta"] } },
  ]},
  { id: "shot", label: "Shot", color: C.gold, segments: Array.from({ length: 52 }, (_, i) => ({ s: Math.floor(i*(TOTAL_DUR/52)), e: Math.floor((i+1)*(TOTAL_DUR/52)), name: `Shot ${154680+i*18340}`, meta: { type: ["Wide","Mid","Close up","Over shoulder","Aerial","Dutch"][i%6], movement: ["Static","Pan","Tilt","Dolly","Handheld","Crane"][i%6] } })) },
  { id: "person", label: "Person", color: C.purple, segments: [
    { s: 0, e: 120, name: "Subhashree Ganguly", meta: { character: "Indubala Mallick", confidence: "98%" } },
    { s: 68, e: 197, name: "Sneha Chatterjee", meta: { character: "Lachhmi", confidence: "96%" } },
    { s: 68, e: 180, name: "Angana Royy", meta: { character: "Sanchari", confidence: "94%" } },
    { s: 197, e: 380, name: "Subhashree Ganguly", meta: { character: "Indubala Mallick", confidence: "98%" } },
    { s: 310, e: 528, name: "Mithu Chakrabarty", meta: { character: "Indubala's Mother", confidence: "97%" } },
    { s: 528, e: 820, name: "Pratik Dutta", meta: { character: "Ratanlal Mallick", confidence: "97%" } },
    { s: 528, e: 740, name: "Subhashree Ganguly", meta: { character: "Indubala Mallick", confidence: "99%" } },
    { s: 820, e: 990, name: "Sneha Chatterjee", meta: { character: "Lachhmi", confidence: "96%" } },
    { s: 990, e: 1200, name: "Subhashree Ganguly", meta: { character: "Indubala Mallick", confidence: "98%" } },
    { s: 1120, e: 1340, name: "Subhashree Ganguly", meta: { character: "Indubala Mallick", confidence: "98%" } },
    { s: 1280, e: 1420, name: "Debdutta Raha", meta: { character: "Monirul", confidence: "93%" } },
    { s: 1280, e: 1560, name: "Angana Royy", meta: { character: "Sanchari", confidence: "95%" } },
    { s: 1560, e: 1885, name: "Subhashree Ganguly", meta: { character: "Indubala Mallick", confidence: "99%" } },
    { s: 1700, e: 1885, name: "Pratik Dutta", meta: { character: "Ratanlal Mallick", confidence: "96%" } },
  ]},
  { id: "speech", label: "Speech", color: C.green, segments: [
    { s: 15, e: 42, name: "Speech #1", meta: { speaker: "Subhashree Ganguly", transcript: "\u0986\u099C\u0995\u09C7\u09B0 \u09A6\u09BF\u09A8\u099F\u09BE \u09AD\u09BE\u09B2\u09CB \u09B9\u09AC\u09C7...", translation: "Today will be a good day..." } },
    { s: 78, e: 105, name: "Speech #2", meta: { speaker: "Sneha Chatterjee", transcript: "\u09B8\u09C7\u0987 \u09AE\u09BE\u099B\u099F\u09BE \u0995\u09CB\u09A5\u09BE\u09AF\u09BC \u0997\u09C7\u09B2?", translation: "Where did that fish go?" } },
    { s: 210, e: 265, name: "Speech #4", meta: { speaker: "Subhashree Ganguly", transcript: "May no one ever leave Indubala's hotel without a meal.", translation: "May no one ever leave Indubala's hotel without a meal." } },
    { s: 330, e: 370, name: "Speech #5", meta: { speaker: "Mithu Chakrabarty", transcript: "\u09B0\u09BE\u09A8\u09CD\u09A8\u09BE\u0998\u09B0\u09C7 \u0995\u09C7 \u09A2\u09C1\u0995\u09A4\u09C7 \u09A6\u09BF\u09B2\u09CB?", translation: "Who let you enter the kitchen?" } },
    { s: 440, e: 495, name: "Speech #6", meta: { speaker: "Mithu Chakrabarty", transcript: "You think cooking is so easy?", translation: "You think cooking is so easy?" } },
    { s: 545, e: 590, name: "Speech #7", meta: { speaker: "Pratik Dutta", transcript: "\u0986\u09AE\u09BF \u09AB\u09BF\u09B0\u09C7 \u098F\u09B8\u09C7\u099B\u09BF\u0964", translation: "I have returned." } },
    { s: 700, e: 760, name: "Speech #8", meta: { speaker: "Subhashree Ganguly", transcript: "\u09A4\u09C1\u09AE\u09BF \u0995\u09BF \u0986\u09AE\u09BE\u0995\u09C7 \u09AD\u09BE\u09B2\u09CB\u09AC\u09BE\u09B8\u09CB?", translation: "Do you love me?" } },
    { s: 840, e: 910, name: "Speech #9", meta: { speaker: "Sneha Chatterjee", transcript: "The tilapia was for the guests! How dare you!", translation: "The tilapia was for the guests!" } },
    { s: 1010, e: 1060, name: "Speech #10", meta: { speaker: "Subhashree Ganguly", transcript: "\u0988\u09B6\u09CD\u09AC\u09B0 \u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u09B0\u0995\u09CD\u09B7\u09BE \u0995\u09B0\u09C1\u09A8\u0964", translation: "May God protect us." } },
    { s: 1140, e: 1210, name: "Speech #11", meta: { speaker: "Mithu Chakrabarty", transcript: "In this house, my word is final.", translation: "In this house, my word is final." } },
    { s: 1300, e: 1365, name: "Speech #12", meta: { speaker: "Debdutta Raha", transcript: "\u0995\u09C7\u0989 \u099C\u09BE\u09A8\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7 \u09A8\u09BE\u0964", translation: "No one will find out." } },
    { s: 1440, e: 1520, name: "Speech #13", meta: { speaker: "Angana Royy", transcript: "I can't take it anymore... truth must come out.", translation: "I can't take it anymore..." } },
    { s: 1580, e: 1650, name: "Speech #14", meta: { speaker: "Subhashree Ganguly", transcript: "This hotel is my life.", translation: "This hotel is my life." } },
    { s: 1720, e: 1800, name: "Speech #15", meta: { speaker: "Subhashree Ganguly", transcript: "New morning... new beginning.", translation: "New morning... new beginning." } },
  ]},
  { id: "emotion", label: "Emotion", color: C.orange, segments: [
    { s: 0, e: 68, name: "Neutral", meta: { intensity: 0.3 } }, { s: 68, e: 197, name: "Happy", meta: { intensity: 0.6 } },
    { s: 197, e: 380, name: "Sadness", meta: { intensity: 0.78 } }, { s: 380, e: 528, name: "Disgust", meta: { intensity: 0.52 } },
    { s: 528, e: 680, name: "Neutral", meta: { intensity: 0.25 } }, { s: 680, e: 820, name: "Happy", meta: { intensity: 0.72 } },
    { s: 820, e: 990, name: "Anger", meta: { intensity: 0.85 } }, { s: 990, e: 1120, name: "Neutral", meta: { intensity: 0.2 } },
    { s: 1120, e: 1280, name: "Anger", meta: { intensity: 0.7 } }, { s: 1280, e: 1420, name: "Fear", meta: { intensity: 0.65 } },
    { s: 1420, e: 1560, name: "Sadness", meta: { intensity: 0.82 } }, { s: 1560, e: 1700, name: "Sadness", meta: { intensity: 0.6 } },
    { s: 1700, e: 1885, name: "Happy", meta: { intensity: 0.55 } },
  ]},
  { id: "music", label: "Music", color: C.pink, segments: [
    { s: 0, e: 60, name: "Opening Theme", meta: { type: "Instrumental", bpm: 72 } }, { s: 200, e: 300, name: "Emotional Piano", meta: { type: "Piano Solo", bpm: 60 } },
    { s: 520, e: 610, name: "Homecoming", meta: { type: "Orchestral", bpm: 90 } }, { s: 680, e: 810, name: "Love Theme", meta: { type: "Vocal + Sitar", bpm: 68 } },
    { s: 990, e: 1100, name: "Temple Bells", meta: { type: "Devotional", bpm: 55 } }, { s: 1280, e: 1400, name: "Tension Build", meta: { type: "Strings", bpm: 110 } },
    { s: 1560, e: 1690, name: "Night Melody", meta: { type: "Flute Solo", bpm: 65 } }, { s: 1750, e: 1885, name: "Closing Theme", meta: { type: "Orchestra", bpm: 80 } },
  ]},
  { id: "place", label: "Place", color: C.teal, segments: [
    { s: 0, e: 68, name: "Bedroom", meta: { type: "Interior" } }, { s: 68, e: 197, name: "Courtyard", meta: { type: "Exterior" } },
    { s: 197, e: 310, name: "Living Room", meta: { type: "Interior" } }, { s: 310, e: 528, name: "Kitchen", meta: { type: "Interior" } },
    { s: 528, e: 680, name: "Hotel Entrance", meta: { type: "Exterior" } }, { s: 680, e: 820, name: "Farmhouse", meta: { type: "Exterior" } },
    { s: 820, e: 990, name: "Kitchen", meta: { type: "Interior" } }, { s: 990, e: 1120, name: "Temple", meta: { type: "Exterior" } },
    { s: 1120, e: 1280, name: "Dining Hall", meta: { type: "Interior" } }, { s: 1280, e: 1420, name: "Cellar", meta: { type: "Interior" } },
    { s: 1420, e: 1560, name: "Garden", meta: { type: "Exterior" } }, { s: 1560, e: 1700, name: "Kitchen", meta: { type: "Interior" } },
    { s: 1700, e: 1885, name: "Hotel Rooftop", meta: { type: "Exterior" } },
  ]},
  { id: "object", label: "Object", color: C.blue, segments: [
    { s: 45, e: 68, name: "Picture Frame", meta: { confidence: "92%", position: "Background" } },
    { s: 150, e: 175, name: "Bicycle", meta: { confidence: "88%", position: "Mid-frame" } },
    { s: 320, e: 400, name: "Cooking Pot", meta: { confidence: "95%", position: "Center" } },
    { s: 550, e: 580, name: "Suitcase", meta: { confidence: "93%", position: "Floor" } },
    { s: 700, e: 730, name: "Oil Lamp", meta: { confidence: "96%", position: "Table" } },
    { s: 850, e: 910, name: "Fish (Tilapia)", meta: { confidence: "89%", position: "Counter" } },
    { s: 1000, e: 1050, name: "Incense Sticks", meta: { confidence: "87%", position: "Altar" } },
    { s: 1300, e: 1350, name: "Bottle (Alcohol)", meta: { confidence: "90%", position: "Hand", flagged: true } },
    { s: 1600, e: 1640, name: "Clock", meta: { confidence: "92%", position: "Wall" } },
  ]},
  { id: "nsfw", label: "NSFW", color: C.magenta, segments: [
    { s: 735, e: 755, name: "Intimate Scene", meta: { type: "Partial nudity", severity: "Medium", action: "Review" } },
  ]},
  { id: "sound", label: "Sound FX", color: "#AAB8FF", segments: [
    { s: 5, e: 12, name: "Door Creak", meta: { type: "Foley" } }, { s: 72, e: 78, name: "Birdsong", meta: { type: "Ambient" } },
    { s: 325, e: 340, name: "Utensils", meta: { type: "Foley" } }, { s: 390, e: 400, name: "Sizzling Oil", meta: { type: "Foley" } },
    { s: 700, e: 708, name: "Crickets", meta: { type: "Ambient" } }, { s: 860, e: 875, name: "Plate Smash", meta: { type: "Foley" } },
    { s: 1005, e: 1020, name: "Bell", meta: { type: "Foley" } }, { s: 1580, e: 1590, name: "Rain", meta: { type: "Ambient" } },
    { s: 1750, e: 1760, name: "Rooster", meta: { type: "Ambient" } },
  ]},
  { id: "face", label: "Face", color: "#FFB347", segments: [
    { s: 10, e: 65, name: "Subhashree — CU", meta: { expression: "Thoughtful", eyeContact: "No" } },
    { s: 220, e: 280, name: "Subhashree — CU", meta: { expression: "Crying", eyeContact: "No" } },
    { s: 340, e: 390, name: "Mithu — Mid", meta: { expression: "Stern", eyeContact: "Direct" } },
    { s: 450, e: 510, name: "Mithu — CU", meta: { expression: "Angry", eyeContact: "Direct" } },
    { s: 570, e: 620, name: "Pratik — Mid", meta: { expression: "Tired", eyeContact: "No" } },
    { s: 710, e: 780, name: "Subhashree — CU", meta: { expression: "Loving", eyeContact: "Yes" } },
    { s: 845, e: 905, name: "Sneha — CU", meta: { expression: "Furious", eyeContact: "Direct" } },
    { s: 1150, e: 1220, name: "Subhashree — CU", meta: { expression: "Defiant", eyeContact: "Direct" } },
    { s: 1310, e: 1370, name: "Debdutta — Mid", meta: { expression: "Secretive", eyeContact: "Averted" } },
    { s: 1460, e: 1530, name: "Angana — CU", meta: { expression: "Tearful", eyeContact: "No" } },
    { s: 1770, e: 1860, name: "Subhashree — CU", meta: { expression: "Hopeful", eyeContact: "Yes" } },
  ]},
  { id: "audio_int", label: "Audio Peak", color: "#FF5555", segments: [
    { s: 250, e: 270, name: "Emotional Cry", meta: { dB: "-8 dB" } }, { s: 460, e: 500, name: "Argument", meta: { dB: "-6 dB" } },
    { s: 860, e: 920, name: "Kitchen Fight", meta: { dB: "-5 dB" } }, { s: 1150, e: 1210, name: "Shouting", meta: { dB: "-7 dB" } },
    { s: 1440, e: 1510, name: "Crying", meta: { dB: "-9 dB" } },
  ]},
];
function getTagsAt(sec) { const t = []; tlTracks.forEach(tr => { tr.segments.forEach(sg => { if (sec >= sg.s && sec < sg.e) t.push({ track: tr.label, trackColor: tr.color, name: sg.name, meta: sg.meta, from: sg.s, to: sg.e }); }); }); return t; }

const uploadSteps = [
  { step: 1, label: "Upload Content", desc: "Upload film or series episode(s)", icon: "↑" },
  { step: 2, label: "Pre-Register Characters", desc: "Add actor images & character names", icon: "◉" },
  { step: 3, label: "Set S&P Rules", desc: "Select applicable compliance rules", icon: "⚑" },
  { step: 4, label: "AI Analysis", desc: "System analyses all frames + audio", icon: "◈" },
  { step: 5, label: "S&P Report", desc: "Review compliance flags", icon: "⊘" },
  { step: 6, label: "Subtitling", desc: "Auto-generate subtitles", icon: "≡" },
  { step: 7, label: "Technical QC", desc: "Run quality checks", icon: "✓" },
  { step: 8, label: "Encode & Deliver", desc: "Export to partner formats", icon: "→" },
];

// ===== COMPONENTS =====
function Av({ initials, color, size = 40 }) {
  return <div style={{ width: size, height: size, borderRadius: "50%", background: color || C.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.32, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{initials}</div>;
}

function Badge({ text, color = C.red }) {
  return <span style={{ display: "inline-block", padding: "2px 9px", borderRadius: 12, fontSize: 10, fontWeight: 600, background: color + "20", color: color, whiteSpace: "nowrap" }}>{text}</span>;
}

function Chip({ label, active, onClick, color }) {
  return <button onClick={onClick} style={{ padding: "5px 13px", borderRadius: 16, border: `1px solid ${active ? (color || C.red) : C.border}`, background: active ? (color || C.red) + "18" : "transparent", color: active ? (color || C.redSoft) : C.textDim, fontSize: 11, fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}>{label}</button>;
}

function Stat({ label, value, sub, accent }) {
  return <div style={{ background: C.surface, borderRadius: 10, padding: "16px 18px", border: `1px solid ${C.border}`, flex: 1, minWidth: 130 }}>
    <div style={{ fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5 }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 700, color: accent || C.text }}>{value}</div>
    {sub && <div style={{ fontSize: 10, color: C.textDim, marginTop: 3 }}>{sub}</div>}
  </div>;
}

function Btn({ children, primary, color, onClick, small }) {
  return <button onClick={onClick} style={{ padding: small ? "6px 14px" : "9px 20px", borderRadius: 8, border: primary ? "none" : `1px solid ${color || C.border}`, background: primary ? (color || C.red) : "transparent", color: primary ? "#fff" : (color || C.textSec), fontSize: small ? 11 : 12, fontWeight: 600, cursor: "pointer" }}>{children}</button>;
}

// ===== TIMELINE COMPONENT =====
function Timeline({ tracks, height = 32 }) {
  const [hoveredSeg, setHoveredSeg] = useState(null);
  const [playheadPos, setPlayheadPos] = useState(15);
  const tcs = ["00:00", "03:08", "06:17", "09:25", "12:34", "15:42", "18:51", "21:59", "25:08", "28:16", "31:25"];

  return <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
    {/* Track toggles */}
    <div style={{ display: "flex", gap: 4, padding: "10px 14px", borderBottom: `1px solid ${C.border}`, flexWrap: "wrap" }}>
      {tracks.map(t => <span key={t.label} style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 4, background: t.color + "18", color: t.color, cursor: "pointer" }}>{t.label}</span>)}
    </div>

    {/* Timecode ruler */}
    <div style={{ display: "flex", padding: "6px 14px 0", position: "relative" }}>
      <div style={{ width: 72, flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", justifyContent: "space-between", position: "relative" }}>
        {tcs.map(t => <span key={t} style={{ fontSize: 9, color: C.textDim, fontFamily: "monospace" }}>{t}</span>)}
        {/* Playhead */}
        <div style={{ position: "absolute", left: `${playheadPos}%`, top: 0, bottom: -tracks.length * (height + 4) - 20, width: 2, background: C.red, zIndex: 10, pointerEvents: "none" }}>
          <div style={{ width: 10, height: 10, background: C.red, borderRadius: "50%", marginLeft: -4, marginTop: -2 }} />
        </div>
      </div>
    </div>

    {/* Tracks */}
    <div style={{ padding: "6px 14px 14px", cursor: "crosshair" }}
      onClick={e => { const rect = e.currentTarget.getBoundingClientRect(); const x = e.clientX - rect.left - 72; const w = rect.width - 72; if (x > 0) setPlayheadPos(Math.max(0, Math.min(100, (x / w) * 100))); }}>
      {tracks.map((track, ti) => (
        <div key={track.label} style={{ display: "flex", alignItems: "center", gap: 0, height: height, marginBottom: 4 }}>
          <div style={{ width: 72, flexShrink: 0, fontSize: 10, fontWeight: 600, color: track.color, paddingRight: 8, textAlign: "right" }}>{track.label}</div>
          <div style={{ flex: 1, height: "100%", position: "relative", background: C.card, borderRadius: 4, overflow: "hidden" }}>
            {track.segments.map((seg, si) => {
              const key = `${ti}-${si}`;
              const isHovered = hoveredSeg === key;
              return <div key={si}
                onMouseEnter={() => setHoveredSeg(key)}
                onMouseLeave={() => setHoveredSeg(null)}
                style={{
                  position: "absolute", left: `${seg.start}%`, width: `${Math.max(seg.end - seg.start, 0.8)}%`,
                  height: "100%", background: isHovered ? track.color + "88" : track.color + "55",
                  borderRadius: 3, display: "flex", alignItems: "center", paddingLeft: 4,
                  transition: "background 0.1s", cursor: "pointer", overflow: "hidden",
                  borderLeft: `2px solid ${track.color}`,
                }}>
                {(seg.end - seg.start) > 6 && <span style={{ fontSize: 8, color: "#fff", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{seg.name}</span>}
                {isHovered && <div style={{
                  position: "absolute", bottom: "110%", left: 0, background: C.card, border: `1px solid ${C.border}`,
                  padding: "6px 10px", borderRadius: 6, zIndex: 100, whiteSpace: "nowrap", pointerEvents: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{seg.name}</div>
                  <div style={{ fontSize: 9, color: C.textDim, marginTop: 2 }}>{track.label} · {seg.start.toFixed(0)}% — {seg.end.toFixed(0)}%</div>
                </div>}
              </div>;
            })}
          </div>
        </div>
      ))}
    </div>
  </div>;
}

// ===== VIEWS =====

function DashboardView({ setView }) {
  return <div>
    <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
      <Stat label="Total Assets" value="142" sub="Films & Series" />
      <Stat label="Scenes Indexed" value="8,421" sub="Across all content" />
      <Stat label="S&P Pending" value="23" sub="This month" accent={C.orange} />
      <Stat label="Clips Exported" value="1,847" sub="For social media" />
    </div>
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>Recent Assets</div>
        {libraryShows.map(s => <div key={s.id} onClick={() => setView("library")} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 8, cursor: "pointer", transition: "border 0.15s" }}>
          <div style={{ width: 48, height: 30, borderRadius: 5, background: `linear-gradient(135deg, ${C.red}40, ${C.card})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: C.textSec, fontWeight: 700 }}>{s.season}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{s.title}</div>
            <div style={{ fontSize: 10, color: C.textDim }}>{s.eps} ep · {s.year} · {s.scenes} scenes · {s.shots} shots</div>
          </div>
          <Badge text={s.genre} color={C.purple} />
          <Badge text={s.status} color={C.green} />
        </div>)}
      </div>
      <div style={{ width: 280, flexShrink: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>Quick Actions</div>
        {[{ label: "Upload New Content", desc: "Start S&P + analysis workflow", icon: "↑", view: "new" },
          { label: "Search Library", desc: "Find scenes across all content", icon: "⌕", view: "library" },
          { label: "S&P Reviews", desc: "23 pending flags to review", icon: "⚑", view: "snp" },
          { label: "Clip Intelligence", desc: "New recommendations available", icon: "◈", view: "clips" }
        ].map(a => <div key={a.label} onClick={() => setView(a.view)} style={{ display: "flex", gap: 12, padding: "14px 16px", background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 8, cursor: "pointer" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: C.redGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: C.redSoft }}>{a.icon}</div>
          <div><div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{a.label}</div><div style={{ fontSize: 10, color: C.textDim }}>{a.desc}</div></div>
        </div>)}
      </div>
    </div>
  </div>;
}

function LibraryView() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedScene, setSelectedScene] = useState(0);
  const allFilters = ["All", "People", "Props", "Genres", "Emotions", "Location", "Shot type", "Sound"];
  const sel = scenes[selectedScene];

  return <div style={{ display: "flex", gap: 16, height: "calc(100vh - 170px)", minHeight: 600 }}>
    {/* Left: Search + Results */}
    <div style={{ width: 320, flexShrink: 0, display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
      <div style={{ background: C.surface, borderRadius: 10, padding: 14, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>Indubala Bhaater Hotel</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: C.textDim, background: C.card, padding: "3px 8px", borderRadius: 4 }}>Frames: 1134</div>
          <div style={{ fontSize: 10, color: C.textDim, background: C.card, padding: "3px 8px", borderRadius: 4 }}>Shots: 264</div>
          <div style={{ fontSize: 10, color: C.textDim, background: C.card, padding: "3px 8px", borderRadius: 4 }}>Scenes: 52</div>
          <div style={{ fontSize: 10, color: C.textDim, background: C.card, padding: "3px 8px", borderRadius: 4 }}>Ch: 9</div>
        </div>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search scene, dialogue, actor, prop..."
          style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 12, outline: "none", boxSizing: "border-box", marginBottom: 8 }} />
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {allFilters.map(f => <Chip key={f} label={f} active={filter === f} onClick={() => setFilter(f)} />)}
        </div>
      </div>

      {/* Characters */}
      <div style={{ background: C.surface, borderRadius: 10, padding: 12, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: C.textSec, marginBottom: 8 }}>People · {characters.length}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {characters.map(c => <div key={c.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", width: 50 }}>
            <Av initials={c.name.split(" ").map(w => w[0]).join("")} color={c.color} size={36} />
            <div style={{ fontSize: 8, color: C.textDim, textAlign: "center", lineHeight: 1.2 }}>{c.name.split(" ")[0]}</div>
          </div>)}
        </div>
      </div>

      {/* Scene results */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: C.textSec, padding: "0 4px" }}>Top Scene Highlights · Sorted by Relevance</div>
        {scenes.map((s, i) => <div key={s.id} onClick={() => setSelectedScene(i)} style={{
          padding: "10px 12px", borderRadius: 8, background: selectedScene === i ? C.redGlow : C.surface,
          border: `1px solid ${selectedScene === i ? C.red + "44" : C.border}`, cursor: "pointer",
          display: "flex", gap: 10, alignItems: "center", transition: "all 0.15s",
        }}>
          <div style={{ width: 50, height: 32, borderRadius: 4, background: `linear-gradient(135deg, ${C.red}30, ${C.card})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: C.textSec, fontFamily: "monospace", fontWeight: 600, flexShrink: 0 }}>{s.tc}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</div>
            <div style={{ fontSize: 9, color: C.textDim }}>{s.dur} · {s.emotion} · {s.location} · {s.shotType}</div>
          </div>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: `conic-gradient(${C.red} ${s.score * 360}deg, ${C.border} 0deg)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: selectedScene === i ? "#1a1020" : C.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: C.text }}>{(s.score * 100).toFixed(0)}</div>
          </div>
        </div>)}
      </div>
    </div>

    {/* Right: Player + Timeline */}
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
      {/* Video player */}
      <div style={{ height: 280, borderRadius: 12, background: "#000", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a0a0e 0%, #0a0a0f 50%, #0e0a1a 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 16px", background: "linear-gradient(transparent, rgba(0,0,0,0.8))", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{sel.title}</div>
            <div style={{ fontSize: 11, color: "#aaa" }}>Scene {sel.id} · {sel.tc} · {sel.dur} · {sel.shotType}</div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ fontSize: 10, color: "#888", background: "rgba(255,255,255,0.1)", padding: "4px 10px", borderRadius: 4 }}>1080p · 25fps · H.264</div>
          </div>
        </div>
        {/* Play button */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 60, height: 60, borderRadius: "50%", background: "rgba(200,16,46,0.8)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <span style={{ fontSize: 24, color: "#fff", marginLeft: 3 }}>▶</span>
        </div>
      </div>

      {/* Scene info bar */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Badge text={sel.emotion} color={sel.emotion === "Sadness" ? C.blue : sel.emotion === "Anger" ? C.red : sel.emotion === "Happy" ? C.gold : sel.emotion === "Surprise" ? C.orange : C.purple} />
        <Badge text={sel.location} color="#88CCAA" />
        <Badge text={sel.shotType} color={C.gold} />
        {sel.actors.map(a => <Badge key={a} text={a} color={C.purple} />)}
      </div>

      {/* Transcript popup */}
      <div style={{ background: C.surface, borderRadius: 8, padding: "10px 14px", border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: C.textDim, marginBottom: 4 }}>TRANSCRIPT · Speech #{38 + selectedScene}</div>
        <div style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>
          {selectedScene === 0 ? "\"May no one ever leave Indubala's hotel without a meal. That is my only wish.\"" :
           selectedScene === 1 ? "\"You think cooking is so easy? Come, I'll show you what it takes to run this kitchen.\"" :
           selectedScene === 3 ? "\"The tilapia was meant for the guests! How dare you serve it to the workers first!\"" :
           "\"আমি তোমাকে ভালোবাসি\" — Bengali dialogue (auto-transcribed)"}
        </div>
        <div style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>Speaker: {sel.actors[0]} · Duration: {sel.dur}</div>
      </div>

      {/* TIMELINE */}
      <div style={{ flex: 1, overflow: "auto", minHeight: 300 }}>
        <Timeline tracks={timelineTracks} height={26} />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, flexShrink: 0, paddingTop: 4 }}>
        <Btn primary>Export Clip</Btn>
        <Btn>Export XML</Btn>
        <Btn>Add to Collection</Btn>
        <Btn>Download SRT</Btn>
      </div>
    </div>
  </div>;
}

function NewContentView() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);

  return <div>
    {/* Workflow steps */}
    <div style={{ background: C.surface, borderRadius: 12, padding: 20, border: `1px solid ${C.border}`, marginBottom: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 16 }}>Content Processing Workflow</div>
      <div style={{ display: "flex", gap: 0, alignItems: "flex-start" }}>
        {uploadSteps.map((s, i) => (
          <div key={s.step} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
            {i > 0 && <div style={{ position: "absolute", left: "-50%", top: 18, width: "100%", height: 2, background: i < currentStep ? C.red : C.border }} />}
            <div onClick={() => setCurrentStep(s.step)} style={{
              width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: s.step === currentStep ? C.red : s.step < currentStep ? C.green : C.card,
              border: `2px solid ${s.step === currentStep ? C.red : s.step < currentStep ? C.green : C.border}`,
              color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", position: "relative", zIndex: 2,
              transition: "all 0.2s",
            }}>{s.step < currentStep ? "✓" : s.icon}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: s.step === currentStep ? C.text : C.textDim, marginTop: 8, textAlign: "center" }}>{s.label}</div>
            <div style={{ fontSize: 9, color: C.textDim, textAlign: "center", maxWidth: 90, marginTop: 2, lineHeight: 1.3 }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </div>

    <div style={{ display: "flex", gap: 20 }}>
      {/* Main content area based on step */}
      <div style={{ flex: 1 }}>
        {currentStep === 1 && <div style={{ background: C.surface, borderRadius: 12, padding: 28, border: `2px dashed ${C.border}`, textAlign: "center", minHeight: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: C.redGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: C.redSoft }}>↑</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>Upload Content</div>
          <div style={{ fontSize: 13, color: C.textSec, maxWidth: 400 }}>Drag & drop your film or series episodes here. Supported formats: MP4, MOV, MKV, ProRes. Maximum file size: 50GB per file.</div>
          <Btn primary onClick={() => setCurrentStep(2)}>Select Files</Btn>
          <div style={{ fontSize: 11, color: C.textDim, marginTop: 8 }}>or paste a link to cloud storage (S3, Google Drive)</div>
        </div>}

        {currentStep === 2 && <div style={{ background: C.surface, borderRadius: 12, padding: 24, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 6 }}>Pre-Register Characters</div>
          <div style={{ fontSize: 12, color: C.textSec, marginBottom: 20 }}>Upload actor headshots and assign character names. This ensures accurate face recognition and tagging throughout the content.</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            {characters.slice(0, 6).map(c => <div key={c.name} style={{ background: C.card, borderRadius: 10, padding: 14, border: `1px solid ${C.border}`, textAlign: "center" }}>
              <Av initials={c.name.split(" ").map(w => w[0]).join("")} color={c.color} size={52} />
              <div style={{ fontSize: 11, fontWeight: 600, color: C.text, marginTop: 8 }}>{c.name}</div>
              <div style={{ fontSize: 10, color: C.textDim }}>as {c.role}</div>
              <Badge text="Registered" color={C.green} />
            </div>)}
            <div style={{ background: C.card, borderRadius: 10, padding: 14, border: `2px dashed ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <div style={{ fontSize: 28, color: C.textDim }}>+</div>
              <div style={{ fontSize: 10, color: C.textDim }}>Add Character</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={() => setCurrentStep(1)}>← Back</Btn>
            <Btn primary onClick={() => setCurrentStep(3)}>Continue to S&P Rules →</Btn>
          </div>
        </div>}

        {currentStep === 3 && <div style={{ background: C.surface, borderRadius: 12, padding: 24, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 6 }}>Select S&P Rules</div>
          <div style={{ fontSize: 12, color: C.textSec, marginBottom: 20 }}>Choose which compliance rules should be applied to this content. All rules are selected by default.</div>
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.orange, marginBottom: 10 }}>Copyright Rules (13)</div>
              {["Songs/Music/BGM rights", "Lyrics as dialogue", "Scenes from existing movies/TV", "Poems usage", "Copyrighted characters", "Radio broadcast NOC", "Audio-video clips rights", "Brand logos/products", "Dialogue from other works", "Likeness of real/fictional characters", "Famous personalities reference", "Copyrighted titles", "Artwork in frame"].map((r, i) =>
                <label key={i} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 0", fontSize: 11, color: C.text, cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: C.red }} />
                  <span>CR-{String(i + 1).padStart(2, "0")}: {r}</span>
                </label>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.purple, marginBottom: 10 }}>S&P Rules (24)</div>
              {["National Anthem usage", "Real addresses/phone numbers", "Competitor OTT endorsement", "National flag/emblems", "Incorrect map boundaries", "Personal sentiments", "Self-harm depiction", "Acid attack shown", "Bomb/weapon making details", "Harmful product names", "Footwear in religious spots", "Buddha idols in clothing"].map((r, i) =>
                <label key={i} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 0", fontSize: 11, color: C.text, cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: C.red }} />
                  <span>SP-{String(i + 1).padStart(2, "0")}: {r}</span>
                </label>
              )}
              <div style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>+ 12 more rules...</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            <Btn onClick={() => setCurrentStep(2)}>← Back</Btn>
            <Btn primary onClick={() => setCurrentStep(4)}>Start Analysis →</Btn>
          </div>
        </div>}

        {currentStep === 4 && <div style={{ background: C.surface, borderRadius: 12, padding: 28, border: `1px solid ${C.border}`, textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>AI Analysis in Progress</div>
          <div style={{ fontSize: 12, color: C.textSec, marginBottom: 24 }}>Analysing Indubala Bhaater Hotel · S01E03 · 00:31:25</div>
          <div style={{ width: "80%", margin: "0 auto 20px", height: 8, borderRadius: 4, background: C.card, overflow: "hidden" }}>
            <div style={{ width: "67%", height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${C.red}, ${C.redSoft})`, transition: "width 0.5s" }} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.redSoft, marginBottom: 20 }}>67% Complete</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, textAlign: "left" }}>
            {[{ label: "Visual Analysis", status: "Complete", icon: "✓", color: C.green },
              { label: "Dialogue Transcription", status: "Complete", icon: "✓", color: C.green },
              { label: "Emotion Detection", status: "Processing...", icon: "◈", color: C.orange },
              { label: "S&P Scan", status: "Queued", icon: "○", color: C.textDim },
            ].map(s => <div key={s.label} style={{ background: C.card, padding: 14, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 14, color: s.color, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{s.label}</div>
              <div style={{ fontSize: 10, color: s.color }}>{s.status}</div>
            </div>)}
          </div>
        </div>}

        {currentStep >= 5 && <div style={{ background: C.surface, borderRadius: 12, padding: 24, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16 }}>
            {currentStep === 5 ? "S&P Report Ready" : currentStep === 6 ? "Subtitles Generated" : currentStep === 7 ? "QC Results" : "Encoding Complete"}
          </div>
          {currentStep === 5 && <div>
            {snpFlags.map((f, i) => <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", background: C.card, borderRadius: 8, border: `1px solid ${f.sev === "High" ? C.red + "33" : C.border}`, marginBottom: 6, alignItems: "center" }}>
              <div style={{ fontSize: 11, fontFamily: "monospace", color: C.textSec, width: 64, flexShrink: 0, fontWeight: 600 }}>{f.tc}</div>
              <div style={{ flex: 1, fontSize: 12, color: C.text }}>{f.desc}</div>
              <Badge text={f.type} color={f.type === "Copyright" ? C.purple : C.orange} />
              <Badge text={f.sev} color={f.sev === "High" ? C.red : f.sev === "Medium" ? C.orange : C.gold} />
              <Badge text={f.resolved ? "Resolved" : "Open"} color={f.resolved ? C.green : C.textDim} />
            </div>)}
          </div>}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <Btn onClick={() => setCurrentStep(currentStep - 1)}>← Back</Btn>
            {currentStep < 8 && <Btn primary onClick={() => setCurrentStep(currentStep + 1)}>
              {currentStep === 5 ? "Proceed to Subtitling →" : currentStep === 6 ? "Run QC →" : "Encode & Deliver →"}
            </Btn>}
            {currentStep === 8 && <Btn primary color={C.green}>✓ All Done — Ready for Release</Btn>}
          </div>
        </div>}
      </div>

      {/* Right sidebar: content info */}
      <div style={{ width: 260, flexShrink: 0 }}>
        <div style={{ background: C.surface, borderRadius: 10, padding: 16, border: `1px solid ${C.border}`, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 10 }}>Content Info</div>
          {[["Title", "Indubala Bhaater Hotel"], ["Season", "1"], ["Episode", "3"], ["Duration", "00:31:25"], ["Resolution", "1920 × 1080"], ["Frame Rate", "25fps"], ["Codec", "H.264 / AAC"], ["File Size", "4.2 GB"]].map(([k, v]) =>
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 11, color: C.textDim }}>{k}</span>
              <span style={{ fontSize: 11, color: C.text, fontWeight: 500 }}>{v}</span>
            </div>
          )}
        </div>
        <div style={{ background: C.surface, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 10 }}>Processing Log</div>
          {[{ time: "8:32 PM", msg: "Upload complete", color: C.green },
            { time: "8:33 PM", msg: "6 characters registered", color: C.green },
            { time: "8:34 PM", msg: "37 S&P rules selected", color: C.green },
            { time: "8:35 PM", msg: "Analysis started", color: C.orange },
            { time: "8:42 PM", msg: "Visual analysis done", color: C.green },
            { time: "8:48 PM", msg: "Transcription done", color: C.green },
          ].map((l, i) => <div key={i} style={{ display: "flex", gap: 8, padding: "4px 0", alignItems: "center" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: l.color, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: C.textDim, width: 50, flexShrink: 0 }}>{l.time}</span>
            <span style={{ fontSize: 10, color: C.text }}>{l.msg}</span>
          </div>)}
        </div>
      </div>
    </div>
  </div>;
}

function SNPView() {
  return <div>
    <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
      <Stat label="Total Flags" value="6" />
      <Stat label="High Severity" value="3" accent={C.red} />
      <Stat label="Resolved" value="1" accent={C.green} />
      <Stat label="Status" value="In Review" accent={C.orange} />
    </div>
    <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>S&P Report — Indubala Bhaater Hotel S01E03</div>
    {snpFlags.map((f, i) => <div key={i} style={{ display: "flex", gap: 14, padding: "14px 18px", background: C.surface, borderRadius: 10, border: `1px solid ${f.sev === "High" ? C.red + "33" : C.border}`, marginBottom: 8, alignItems: "center" }}>
      <div style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 600, color: C.text, background: C.card, padding: "6px 10px", borderRadius: 6, width: 70, textAlign: "center", flexShrink: 0 }}>{f.tc}</div>
      <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 3 }}>{f.desc}</div><div style={{ display: "flex", gap: 6 }}><Badge text={f.type} color={f.type === "Copyright" ? C.purple : C.orange} /><Badge text={f.sev} color={f.sev === "High" ? C.red : f.sev === "Medium" ? C.orange : C.gold} /><span style={{ fontSize: 10, color: C.textDim }}>Rule: {f.rule}</span></div></div>
      <Btn small primary={!f.resolved} color={f.resolved ? C.green : undefined}>{f.resolved ? "✓ Resolved" : "Resolve"}</Btn>
      <Btn small>View</Btn>
    </div>)}
    <div style={{ display: "flex", gap: 8, marginTop: 16 }}><Btn primary>Generate Full Report</Btn><Btn color={C.green}>Approve & Clear</Btn></div>
  </div>;
}

function ClipIntelView() {
  const clips = [
    { tc: "00:12:30 — 00:15:42", title: "Lachhmi's Kitchen Confrontation", conf: 92, reason: "High-emotion conflict + popular actor + food hook", views: "~2.4M" },
    { tc: "00:23:11 — 00:25:08", title: "Generational Clash at Dinner", conf: 87, reason: "Family drama + strong dialogue + relatable theme", views: "~1.8M" },
    { tc: "00:03:17 — 00:04:48", title: "Indubala's Emotional Phone Call", conf: 81, reason: "Sadness peak + lead actor + strong opening hook", views: "~1.5M" },
    { tc: "00:28:44 — 00:30:12", title: "Sanchari's Secret Revealed", conf: 78, reason: "Plot twist + surprise emotion + high audio intensity", views: "~1.2M" },
  ];
  return <div>
    <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
      <Stat label="Clips Analysed" value="1,247" /><Stat label="Avg Views" value="2.1M" accent={C.gold} /><Stat label="Recommendations" value="4" /><Stat label="Accuracy" value="78%" accent={C.green} />
    </div>
    <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>Recommended Clips — Indubala Bhaater Hotel S01E03</div>
    {clips.map((c, i) => <div key={i} style={{ display: "flex", gap: 16, padding: "16px 20px", background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, marginBottom: 10, alignItems: "center" }}>
      <div style={{ width: 50, height: 50, borderRadius: 10, background: `conic-gradient(${C.red} ${c.conf * 3.6}deg, ${C.border} 0deg)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: C.text }}>{c.conf}</div>
      </div>
      <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>{c.title}</div><div style={{ fontSize: 10, color: C.textSec, fontFamily: "monospace", marginBottom: 3 }}>{c.tc}</div><div style={{ fontSize: 10, color: C.textDim }}>{c.reason}</div></div>
      <div style={{ textAlign: "right" }}><div style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>{c.views}</div><Btn small>Export</Btn></div>
    </div>)}
  </div>;
}

// ===== TIMELINE ANALYSER VIEW =====
function TimelineAnalyserView() {
  const [playhead, setPlayhead] = useState(230);
  const [selectedSeg, setSelectedSeg] = useState(null);
  const [trackVis, setTrackVis] = useState(() => { const v = {}; tlTracks.forEach(t => v[t.id] = true); return v; });
  const tagsAtPH = getTagsAt(playhead);
  const visTracks = tlTracks.filter(t => trackVis[t.id]);
  const handleTLClick = useCallback((e) => { const r = e.currentTarget.getBoundingClientRect(); const x = e.clientX - r.left; setPlayhead(Math.floor(Math.max(0, Math.min(TOTAL_DUR, (x / r.width) * TOTAL_DUR)))); setSelectedSeg(null); }, []);
  const handleSegClick = useCallback((e, track, seg) => { e.stopPropagation(); setSelectedSeg({ track: track.label, trackColor: track.color, ...seg }); setPlayhead(seg.s); }, []);

  return <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
    {/* Left: Video + Tags */}
    <div style={{ width: 320, flexShrink: 0, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ height: 190, background: "#000", position: "relative", flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a0a0e 0%, #080810 50%, #0e0a1a 100%)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${C.red}cc`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", cursor: "pointer" }}><span style={{ fontSize: 18, color: "#fff", marginLeft: 2 }}>▶</span></div>
          <div style={{ fontSize: 10, color: "#888" }}>1080p · 25fps · H.264</div>
        </div>
        <div style={{ position: "absolute", bottom: 8, left: 10, background: "rgba(0,0,0,0.7)", padding: "3px 10px", borderRadius: 5 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.red, fontFamily: "monospace" }}>{fmtTime(playhead)}</span>
          <span style={{ fontSize: 10, color: "#666", marginLeft: 6 }}>/ {fmtTime(TOTAL_DUR)}</span>
        </div>
      </div>
      <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, background: C.surface, flexShrink: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: 0.8 }}>All Tags at {fmtTime(playhead)} · {tagsAtPH.length} active</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tagsAtPH.length === 0 && <div style={{ padding: 16, textAlign: "center", color: C.textDim, fontSize: 11 }}>No tags at this position</div>}
        {tagsAtPH.map((tag, i) => (
          <div key={i} onClick={() => setSelectedSeg({ track: tag.track, trackColor: tag.trackColor, s: tag.from, e: tag.to, name: tag.name, meta: tag.meta })} style={{ padding: "9px 14px", borderBottom: `1px solid ${C.border}08`, display: "flex", gap: 8, alignItems: "flex-start", cursor: "pointer", background: selectedSeg && selectedSeg.name === tag.name && selectedSeg.track === tag.track ? C.redGlow : "transparent" }}>
            <div style={{ width: 3, minHeight: 32, borderRadius: 2, background: tag.trackColor, flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 2 }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: tag.trackColor, textTransform: "uppercase", letterSpacing: 0.5 }}>{tag.track}</span>
                <span style={{ fontSize: 8, color: C.textDim }}>{fmtTime(tag.from)}—{fmtTime(tag.to)}</span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.text, marginBottom: 2 }}>{tag.name}</div>
              {tag.meta && <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {Object.entries(tag.meta).map(([k, v]) => <span key={k} style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, background: C.card, color: C.textSec }}>{k}: {Array.isArray(v) ? v.join(", ") : String(v)}</span>)}
              </div>}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Right: Full Timeline */}
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "8px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.textDim, marginRight: 6 }}>TRACKS</span>
        {tlTracks.map(t => <button key={t.id} onClick={() => setTrackVis(p => ({...p, [t.id]: !p[t.id]}))} style={{ padding: "3px 10px", borderRadius: 12, border: `1px solid ${trackVis[t.id] ? t.color+"66" : C.border}`, background: trackVis[t.id] ? t.color+"18" : "transparent", color: trackVis[t.id] ? t.color : C.textDim, fontSize: 9, fontWeight: 600, cursor: "pointer" }}>{t.label}</button>)}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 9, color: C.textDim }}>{visTracks.length}/{tlTracks.length} visible</span>
      </div>

      {/* Timecodes */}
      <div style={{ padding: "6px 16px 0", display: "flex", flexShrink: 0 }}>
        <div style={{ width: 80, flexShrink: 0 }} />
        <div style={{ flex: 1, display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${C.border}`, paddingBottom: 4 }}>
          {Array.from({ length: 16 }, (_, i) => <span key={i} style={{ fontSize: 8, color: C.textDim, fontFamily: "monospace" }}>{fmtTime(Math.floor(i*(TOTAL_DUR/15)))}</span>)}
        </div>
      </div>

      {/* Tracks */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 16px 16px" }}>
        {visTracks.map(track => (
          <div key={track.id} style={{ display: "flex", alignItems: "center", height: 30, marginBottom: 2 }}>
            <div style={{ width: 80, flexShrink: 0, fontSize: 9, fontWeight: 700, color: track.color, textAlign: "right", paddingRight: 10, whiteSpace: "nowrap" }}>{track.label}</div>
            <div style={{ flex: 1, height: "100%", position: "relative", background: C.card, borderRadius: 3, cursor: "crosshair" }} onClick={handleTLClick}>
              <div style={{ position: "absolute", left: `${pctT(playhead)}%`, top: 0, bottom: 0, width: 2, background: C.red, zIndex: 20, pointerEvents: "none" }} />
              {track.segments.map((seg, si) => {
                const l = pctT(seg.s), w = pctT(seg.e - seg.s);
                const isSel = selectedSeg && selectedSeg.name === seg.name && selectedSeg.track === track.label && selectedSeg.s === seg.s;
                return <div key={si} onClick={e => handleSegClick(e, track, seg)} style={{
                  position: "absolute", left: `${l}%`, width: `${Math.max(w, 0.3)}%`, height: "100%",
                  background: isSel ? track.color + "aa" : track.color + "55", borderRadius: 3,
                  display: "flex", alignItems: "center", paddingLeft: 3, cursor: "pointer", overflow: "hidden",
                  borderLeft: `2px solid ${track.color}`, boxShadow: isSel ? `0 0 8px ${track.color}44` : "none", zIndex: isSel ? 10 : 1,
                }}>{w > 3 && <span style={{ fontSize: 7, color: "#fff", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", opacity: 0.9 }}>{seg.name}</span>}</div>;
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected detail */}
      {selectedSeg && <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}`, background: C.surface, flexShrink: 0, display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ width: 3, height: 44, borderRadius: 2, background: selectedSeg.trackColor, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: selectedSeg.trackColor, textTransform: "uppercase" }}>{selectedSeg.track}</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{selectedSeg.name}</span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 5 }}>
            <span style={{ fontSize: 11, fontFamily: "monospace", color: C.textSec, background: C.card, padding: "2px 8px", borderRadius: 4 }}>{fmtTime(selectedSeg.s)} — {fmtTime(selectedSeg.e)}</span>
            <span style={{ fontSize: 10, color: C.textDim }}>Duration: {selectedSeg.e - selectedSeg.s}s</span>
          </div>
          {selectedSeg.meta && <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {Object.entries(selectedSeg.meta).map(([k, v]) => <div key={k} style={{ padding: "3px 8px", borderRadius: 5, background: C.card, border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 8, color: C.textDim, textTransform: "uppercase" }}>{k}: </span>
              <span style={{ fontSize: 10, color: C.text, fontWeight: 500 }}>{Array.isArray(v) ? v.join(", ") : String(v)}</span>
            </div>)}
          </div>}
        </div>
        <button onClick={() => setSelectedSeg(null)} style={{ background: "none", border: "none", color: C.textDim, fontSize: 16, cursor: "pointer", padding: 3 }}>✕</button>
      </div>}
    </div>
  </div>;
}

// ===== MAIN APP =====
const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "⊞" },
  { key: "library", label: "Library Explorer", icon: "⌕" },
  { key: "timeline", label: "Timeline Analyser", icon: "☰" },
  { key: "new", label: "New Content", icon: "↑" },
  { key: "snp", label: "S&P Review", icon: "⚑" },
  { key: "clips", label: "Clip Intelligence", icon: "◈" },
];

export default function App() {
  const [view, setView] = useState("dashboard");
  return <div style={{ display: "flex", height: "100vh", background: C.bg, color: C.text, fontFamily: FONT, overflow: "hidden" }}>
    {/* Sidebar */}
    <div style={{ width: 210, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "18px 10px", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 28, padding: "0 8px" }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${C.red}, ${C.redDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff" }}>h</div>
        <div><div style={{ fontSize: 14, fontWeight: 800, color: C.text, lineHeight: 1.1 }}>hoichoi</div><div style={{ fontSize: 8, color: C.textDim, letterSpacing: 1.2, textTransform: "uppercase" }}>Content Intelligence</div></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map(n => <button key={n.key} onClick={() => setView(n.key)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 11px", borderRadius: 7, border: "none", cursor: "pointer", textAlign: "left", background: view === n.key ? C.redGlow : "transparent", color: view === n.key ? C.redSoft : C.textDim, fontSize: 12, fontWeight: view === n.key ? 600 : 500, transition: "all 0.15s" }}>
          <span style={{ fontSize: 15, width: 18, textAlign: "center" }}>{n.icon}</span>{n.label}
        </button>)}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 8px", borderTop: `1px solid ${C.border}`, marginTop: 10 }}>
        <Av initials="MB" color={C.red} size={30} />
        <div><div style={{ fontSize: 11, fontWeight: 600, color: C.text }}>Mandar B.</div><div style={{ fontSize: 9, color: C.textDim }}>Creative Head</div></div>
      </div>
    </div>
    {/* Main */}
    <div style={{ flex: 1, overflow: "auto", padding: view === "timeline" ? 0 : 24, display: "flex", flexDirection: "column" }}>
      {view !== "timeline" && <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: C.text }}>{navItems.find(n => n.key === view)?.label}</h1>
          <p style={{ fontSize: 11, color: C.textDim, margin: "3px 0 0" }}>Post-Production & Content Intelligence Platform</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn onClick={() => setView("new")}>Upload Content</Btn>
          <Btn primary onClick={() => setView("new")}>New Analysis</Btn>
        </div>
      </div>}
      {view === "dashboard" && <DashboardView setView={setView} />}
      {view === "library" && <LibraryView />}
      {view === "timeline" && <TimelineAnalyserView />}
      {view === "new" && <NewContentView />}
      {view === "snp" && <SNPView />}
      {view === "clips" && <ClipIntelView />}
    </div>
  </div>;
}
