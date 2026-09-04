const pptxgen = require("./frontend/node_modules/pptxgenjs");
const fs = require("fs");
const path = require("path");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_16x9";
pptx.author = "FoodLine Campus Founders";
pptx.company = "FoodLine Campus Inc. • Sanjivani University Incubator";
pptx.title = "FoodLine — Zero-Queue Campus Dining & Express Pickup Ecosystem";
pptx.subject = "Investor Pitch Deck & Campus Deployment Strategy";

// Palette Tokens
const BG_DARK = "09070B";
const CARD_BG = "14121E";
const CARD_BORDER = "28253A";
const TEXT_LIGHT = "FFFFFF";
const TEXT_MUTED = "9E9EAF";
const ORANGE = "FF6B2C";
const AMBER = "FFA834";
const GREEN = "00D4AA";
const GOLD = "D4AF37";
const PURPLE = "8B5CF6";
const ROSE = "FF3366";
const BLUE = "3B82F6";

const ASSETS_DIR = path.join(__dirname, "extracted_assets");

function getImage(name) {
  const p = path.join(ASSETS_DIR, name);
  return fs.existsSync(p) ? p : null;
}

// Utility to create a standardized header
function addSlideHeader(slide, tagText, titleText, slideNumStr, tagColor = ORANGE) {
  // Slide Tag
  slide.addText(tagText.toUpperCase(), {
    x: 0.8,
    y: 0.5,
    w: 8.0,
    h: 0.3,
    fontSize: 10,
    fontFace: "Arial",
    bold: true,
    color: tagColor,
    letterSpacing: 2
  });

  // Slide Title
  slide.addText(titleText, {
    x: 0.8,
    y: 0.8,
    w: 10.5,
    h: 0.65,
    fontSize: 24,
    fontFace: "Trebuchet MS",
    bold: true,
    color: TEXT_LIGHT
  });

  // Slide Number Badge
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 11.7,
    y: 0.55,
    w: 0.85,
    h: 0.35,
    fill: { color: "181525" },
    line: { color: "332E4A", width: 1 },
    rectRadius: 0.1
  });
  slide.addText(slideNumStr, {
    x: 11.7,
    y: 0.55,
    w: 0.85,
    h: 0.35,
    fontSize: 10,
    fontFace: "Courier New",
    bold: true,
    color: TEXT_MUTED,
    align: "center",
    valign: "middle"
  });
}

// Utility to add footer branding
function addFooter(slide) {
  slide.addText("🍔 FOODLINE CAMPUS • SANJIVANI UNIVERSITY CAFE @7 PILOT", {
    x: 0.8,
    y: 7.05,
    w: 6.5,
    h: 0.3,
    fontSize: 9,
    fontFace: "Arial",
    bold: true,
    color: "55516E"
  });
  slide.addText("PROPRIETARY 60-SLOT THROTTLER • 100% ONLINE DIRECTPAY", {
    x: 7.5,
    y: 7.05,
    w: 5.0,
    h: 0.3,
    fontSize: 9,
    fontFace: "Arial",
    bold: true,
    color: "55516E",
    align: "right"
  });
}

// =============================================================================
// SLIDE 1: HERO & VISION
// =============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: BG_DARK };

  // Background glow card / image
  const heroImg = getImage("image-1-1.jpeg");
  if (heroImg) {
    s.addImage({
      path: heroImg,
      x: 7.2,
      y: 0.8,
      w: 5.3,
      h: 5.8,
      rounding: true
    });
  }

  // Left Content Card
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 0.8,
    w: 6.1,
    h: 5.8,
    fill: { color: CARD_BG },
    line: { color: ORANGE, width: 1.5 },
    rectRadius: 0.2
  });

  s.addText("CAMPUS DINING REIMAGINED", {
    x: 1.2,
    y: 1.2,
    w: 5.3,
    h: 0.3,
    fontSize: 11,
    fontFace: "Arial",
    bold: true,
    color: ORANGE,
    letterSpacing: 2
  });

  s.addText("FoodLine — Zero-Queue Campus Express Pickup", {
    x: 1.2,
    y: 1.6,
    w: 5.3,
    h: 1.2,
    fontSize: 28,
    fontFace: "Trebuchet MS",
    bold: true,
    color: TEXT_LIGHT,
    lineSpacingMultiple: 1.1
  });

  s.addText(
    "Turning 15-minute campus recess queue bottlenecks into 30-second express handovers. Students pre-order from class desks, receive an optical QR pass, and bypass 200-student crowds straight to the express counter.",
    {
      x: 1.2,
      y: 2.9,
      w: 5.3,
      h: 1.1,
      fontSize: 13,
      fontFace: "Arial",
      color: TEXT_MUTED,
      lineSpacingMultiple: 1.2
    }
  );

  // Stats Box 1 (15 Min Break)
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.2,
    y: 4.2,
    w: 2.5,
    h: 1.2,
    fill: { color: "1B1828" },
    line: { color: "35304C", width: 1 },
    rectRadius: 0.15
  });
  s.addText("15 MIN", {
    x: 1.3,
    y: 4.3,
    w: 2.3,
    h: 0.5,
    fontSize: 22,
    fontFace: "Trebuchet MS",
    bold: true,
    color: ROSE
  });
  s.addText("Average Recess\n(80% wasted in line)", {
    x: 1.3,
    y: 4.8,
    w: 2.3,
    h: 0.5,
    fontSize: 10,
    fontFace: "Arial",
    color: TEXT_MUTED
  });

  // Stats Box 2 (30 Sec FoodLine)
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 3.9,
    y: 4.2,
    w: 2.6,
    h: 1.2,
    fill: { color: "1B1828" },
    line: { color: GREEN, width: 1.2 },
    rectRadius: 0.15
  });
  s.addText("30 SEC", {
    x: 4.0,
    y: 4.3,
    w: 2.4,
    h: 0.5,
    fontSize: 22,
    fontFace: "Trebuchet MS",
    bold: true,
    color: GREEN
  });
  s.addText("Express Pickup\n(Pre-batched meals ready)", {
    x: 4.0,
    y: 4.8,
    w: 2.4,
    h: 0.5,
    fontSize: 10,
    fontFace: "Arial",
    color: TEXT_MUTED
  });

  // Pilot Pill
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.2,
    y: 5.6,
    w: 5.3,
    h: 0.6,
    fill: { color: "182622" },
    line: { color: GREEN, width: 1 },
    rectRadius: 0.1
  });
  s.addText("✨ LIVE PILOT: SANJIVANI UNIVERSITY, KOPARGAON • CAFE @7", {
    x: 1.2,
    y: 5.6,
    w: 5.3,
    h: 0.6,
    fontSize: 11,
    fontFace: "Arial",
    bold: true,
    color: GREEN,
    align: "center",
    valign: "middle"
  });

  addFooter(s);
  s.addNotes(
    "Open with high energy! Good morning everyone! Today I want to show you FoodLine — the smart campus pre-ordering platform that makes canteen queues completely disappear. At Sanjivani University, students get a short 15-minute recess, but spend up to 12 minutes trapped in line. FoodLine changes that forever with 30-Second Express Pickup."
  );
}

// =============================================================================
// SLIDE 2: THE CAMPUS PROBLEM
// =============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: BG_DARK };
  addSlideHeader(s, "01 · The Problem", "Why Recess Lines Ruin Every Student's Break", "02 / 15", ROSE);

  const problems = [
    {
      title: "12-Minute Push & Shove",
      tag: "80% Break Wasted",
      tagColor: ROSE,
      desc: "Recess is only 15 minutes. Students spend 12 minutes trapped in a packed crowd waving notes, leaving just 3 minutes to eat before the next lecture bell.",
      stat: "12 MIN",
      icon: "⏳"
    },
    {
      title: "\"Bhaiya Samosa Khatam!\"",
      tag: "Blind Queuing",
      tagColor: AMBER,
      desc: "After waiting 10 minutes in the rush, students reach the counter only to discover their favorite snack is sold out. Hungry students return to class empty-handed.",
      stat: "40% DROP",
      icon: "❌"
    },
    {
      title: "₹5,000/Day Screenshot Fraud",
      tag: "Severe Canteen Losses",
      tagColor: ROSE,
      desc: "During intense 15-minute rushes, cashiers cannot verify hundreds of digital payments. Dishonest students flash fake Google Pay screenshots and walk away.",
      stat: "₹5,000/DAY",
      icon: "💸"
    }
  ];

  problems.forEach((p, i) => {
    const x = 0.8 + i * 4.0;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x,
      y: 1.8,
      w: 3.7,
      h: 4.8,
      fill: { color: CARD_BG },
      line: { color: p.tagColor === ROSE ? "4A1E28" : "4A3B1E", width: 1.5 },
      rectRadius: 0.2
    });

    s.addText(p.icon, { x: x + 0.3, y: 2.1, w: 1.0, h: 0.6, fontSize: 32 });
    s.addText(p.stat, {
      x: x + 1.4,
      y: 2.1,
      w: 2.0,
      h: 0.6,
      fontSize: 22,
      fontFace: "Trebuchet MS",
      bold: true,
      color: p.tagColor,
      align: "right"
    });

    s.addText(p.title, {
      x: x + 0.3,
      y: 2.9,
      w: 3.1,
      h: 0.7,
      fontSize: 18,
      fontFace: "Trebuchet MS",
      bold: true,
      color: TEXT_LIGHT
    });

    s.addText(p.desc, {
      x: x + 0.3,
      y: 3.7,
      w: 3.1,
      h: 1.8,
      fontSize: 12.5,
      fontFace: "Arial",
      color: TEXT_MUTED,
      lineSpacingMultiple: 1.25
    });

    // Badge
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.3,
      y: 5.8,
      w: 3.1,
      h: 0.45,
      fill: { color: p.tagColor === ROSE ? "261418" : "262014" },
      line: { color: p.tagColor, width: 1 },
      rectRadius: 0.1
    });
    s.addText(p.tag.toUpperCase(), {
      x: x + 0.3,
      y: 5.8,
      w: 3.1,
      h: 0.45,
      fontSize: 10,
      fontFace: "Arial",
      bold: true,
      color: p.tagColor,
      align: "center",
      valign: "middle"
    });
  });

  addFooter(s);
  s.addNotes(
    "Emphasize the shared student pain! Every student experiences the frustration of pushing through crowds, waiting the whole recess, only to hear: 'Samosa sold out!' Meanwhile, canteen owners lose thousands of rupees every week because cashiers can't verify fake Google Pay screenshots during the rush."
  );
}

// =============================================================================
// SLIDE 3: THE 4-STEP SOLUTION (THE EXPRESS PASS)
// =============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: BG_DARK };
  addSlideHeader(s, "02 · The Solution", "The Zero-Wait VIP Express Pass in 4 Steps", "03 / 15", GREEN);

  const steps = [
    { num: "01", title: "Pick Break Slot", desc: "Select 10:15 AM or 11:50 AM break on your phone before the lecture bell." },
    { num: "02", title: "Pay 100% Online", desc: "Direct UPI payment with instant 12-digit UTR validation. Zero COD lines." },
    { num: "03", title: "Get Optical Pass", desc: "Screen displays glowing high-contrast QR pass + unique 4-digit pickup OTP." },
    { num: "04", title: "30s Express Grab", desc: "Walk to the VIP express counter, scan code, and grab hot food immediately." }
  ];

  steps.forEach((st, i) => {
    const x = 0.8 + i * 3.0;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x,
      y: 1.8,
      w: 2.8,
      h: 3.4,
      fill: { color: CARD_BG },
      line: { color: "2D3B38", width: 1.5 },
      rectRadius: 0.2
    });

    // Step Number Badge
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.3,
      y: 2.1,
      w: 0.8,
      h: 0.5,
      fill: { color: GREEN },
      rectRadius: 0.1
    });
    s.addText(st.num, {
      x: x + 0.3,
      y: 2.1,
      w: 0.8,
      h: 0.5,
      fontSize: 14,
      fontFace: "Trebuchet MS",
      bold: true,
      color: "000000",
      align: "center",
      valign: "middle"
    });

    s.addText(st.title, {
      x: x + 0.3,
      y: 2.8,
      w: 2.2,
      h: 0.6,
      fontSize: 16,
      fontFace: "Trebuchet MS",
      bold: true,
      color: TEXT_LIGHT
    });

    s.addText(st.desc, {
      x: x + 0.3,
      y: 3.5,
      w: 2.2,
      h: 1.4,
      fontSize: 12,
      fontFace: "Arial",
      color: TEXT_MUTED,
      lineSpacingMultiple: 1.2
    });
  });

  // Callout Banner below steps
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 5.5,
    w: 11.8,
    h: 1.1,
    fill: { color: "11231E" },
    line: { color: GREEN, width: 1.5 },
    rectRadius: 0.15
  });

  s.addText("🎟️ THE OPTICAL EXPRESS PASS: ORDER FL-1793 • OTP: 6065", {
    x: 1.1,
    y: 5.65,
    w: 7.5,
    h: 0.4,
    fontSize: 14,
    fontFace: "Courier New",
    bold: true,
    color: GREEN
  });
  s.addText("Zero paper tickets. Sub-400ms optical scanning. 100% verified campus handover.", {
    x: 1.1,
    y: 6.05,
    w: 7.5,
    h: 0.4,
    fontSize: 11.5,
    fontFace: "Arial",
    color: TEXT_MUTED
  });
  s.addText("30 SECONDS\nAVERAGE HANDOVER", {
    x: 9.0,
    y: 5.65,
    w: 3.2,
    h: 0.8,
    fontSize: 13,
    fontFace: "Trebuchet MS",
    bold: true,
    color: TEXT_LIGHT,
    align: "right"
  });

  addFooter(s);
  s.addNotes(
    "Count with your fingers 1, 2, 3, 4 as you explain the 4 steps: 1. Choose your break slot in advance on your phone. 2. Add snacks and pay via direct UPI with automated 12-digit UTR checks. 3. Receive your high-contrast optical QR pass with a 4-digit OTP. 4. Walk to the express counter, scan, and pick up your hot food in 30 seconds!"
  );
}

// =============================================================================
// SLIDE 4: PROPRIETARY TECH 1 — 60-SLOT THROTTLER
// =============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: BG_DARK };
  addSlideHeader(s, "03 · Proprietary Tech", "The 60-Order Slot Throttler (Zero Kitchen Choke)", "04 / 15", ORANGE);

  // Left Card: Problem & Capacity Cap
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 1.8,
    w: 5.7,
    h: 4.8,
    fill: { color: CARD_BG },
    line: { color: ORANGE, width: 1.5 },
    rectRadius: 0.2
  });

  s.addText("🛡️ Controlled Kitchen Flow", {
    x: 1.1,
    y: 2.1,
    w: 5.1,
    h: 0.4,
    fontSize: 18,
    fontFace: "Trebuchet MS",
    bold: true,
    color: TEXT_LIGHT
  });

  s.addText(
    "Traditional canteens crash when 400 students rush the counter at once. FoodLine caps each 15-minute break slot to exactly 60 orders so food is cooked fresh, packaged in advance, and handed over in 30 seconds without kitchen bottlenecks.",
    {
      x: 1.1,
      y: 2.6,
      w: 5.1,
      h: 1.2,
      fontSize: 12.5,
      fontFace: "Arial",
      color: TEXT_MUTED,
      lineSpacingMultiple: 1.25
    }
  );

  // Live Capacity Meter Graphic
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.1,
    y: 4.0,
    w: 5.1,
    h: 1.5,
    fill: { color: "181525" },
    line: { color: "352C48", width: 1 },
    rectRadius: 0.15
  });

  s.addText("⚡ LIVE SLOT 11:15 AM CAPACITY", {
    x: 1.3,
    y: 4.15,
    w: 3.0,
    h: 0.3,
    fontSize: 10,
    fontFace: "Arial",
    bold: true,
    color: TEXT_MUTED
  });
  s.addText("56 / 60 BOOKED", {
    x: 4.2,
    y: 4.15,
    w: 1.8,
    h: 0.3,
    fontSize: 10,
    fontFace: "Courier New",
    bold: true,
    color: GREEN,
    align: "right"
  });

  // Capacity Bar
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.3,
    y: 4.55,
    w: 4.7,
    h: 0.25,
    fill: { color: "2B253D" },
    rectRadius: 0.1
  });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.3,
    y: 4.55,
    w: 4.38, // ~93%
    h: 0.25,
    fill: { color: ORANGE },
    rectRadius: 0.1
  });

  s.addText("🟢 Slot Throttler Active: 4 Slots Remaining • Zero Overbooking", {
    x: 1.3,
    y: 4.9,
    w: 4.7,
    h: 0.4,
    fontSize: 10,
    fontFace: "Arial",
    color: GREEN
  });

  // Right Card: Concurrency & Real-Time IST Auto-Time Sync
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.9,
    y: 1.8,
    w: 5.7,
    h: 4.8,
    fill: { color: CARD_BG },
    line: { color: GREEN, width: 1.5 },
    rectRadius: 0.2
  });

  s.addText("⚡ Campus Clock & Atomic Concurrency", {
    x: 7.2,
    y: 2.1,
    w: 5.1,
    h: 0.4,
    fontSize: 18,
    fontFace: "Trebuchet MS",
    bold: true,
    color: TEXT_LIGHT
  });

  s.addText(
    "PostgreSQL row-level transactional locks guarantee that even during class dismissal when 2,000 students tap 'Pay' simultaneously, the 60-order cap is never exceeded.",
    {
      x: 7.2,
      y: 2.6,
      w: 5.1,
      h: 1.0,
      fontSize: 12.5,
      fontFace: "Arial",
      color: TEXT_MUTED,
      lineSpacingMultiple: 1.25
    }
  );

  // Auto Time Sync Feature Box
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 7.2,
    y: 3.8,
    w: 5.1,
    h: 2.3,
    fill: { color: "112421" },
    line: { color: GREEN, width: 1 },
    rectRadius: 0.15
  });

  s.addText("🕒 LIVE CAMPUS CLOCK AUTO-SYNC", {
    x: 7.4,
    y: 4.0,
    w: 4.7,
    h: 0.3,
    fontSize: 11,
    fontFace: "Arial",
    bold: true,
    color: GREEN
  });
  s.addText(
    "• Auto-detects real-time IST at Sanjivani University, Kopargaon.\n• Expired break slots close automatically the minute class begins.\n• Automatically rolls over into 'Tomorrow Pre-Order' so students can plan morning breakfast without waiting in line.",
    {
      x: 7.4,
      y: 4.4,
      w: 4.7,
      h: 1.5,
      fontSize: 11.5,
      fontFace: "Arial",
      color: TEXT_LIGHT,
      lineSpacingMultiple: 1.3
    }
  );

  addFooter(s);
  s.addNotes(
    "What happens if 500 students order at once? That's where our 60-Order Slot Throttler shines. By capping each 15-minute break slot to 60 orders using atomic database transactions, the kitchen never gets overwhelmed, food is always cooked hot, and pickups happen smoothly."
  );
}

// =============================================================================
// SLIDE 5: PROPRIETARY TECH 2 — 12-DIGIT UTR ANTI-FRAUD SHIELD
// =============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: BG_DARK };
  addSlideHeader(s, "04 · Payment Integrity", "12-Digit Bank UTR & Replay Anti-Fraud Shield", "05 / 15", GREEN);

  const pillars = [
    {
      icon: "🔍",
      title: "12-Digit UTR Capture",
      desc: "Every genuine UPI transaction generates a unique 12-digit bank reference number recorded by NPCI with timestamp and amount.",
      badge: "Zero Manual Auditing",
      color: GREEN
    },
    {
      icon: "🚫",
      title: "Duplicate Replay Lock",
      desc: "Attempting to reuse a friend's old payment screenshot triggers instant cryptographic rejection and security audit log.",
      badge: "100% Anti-Fraud",
      color: ROSE
    },
    {
      icon: "💰",
      title: "Direct-to-Canteen UPI",
      desc: "Zero Cash on Delivery lines. Payments settle directly into Cafe @7's bank account with 0% gateway holding delay.",
      badge: "Instant Liquidity",
      color: AMBER
    }
  ];

  pillars.forEach((p, i) => {
    const x = 0.8 + i * 4.0;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x,
      y: 1.8,
      w: 3.7,
      h: 4.8,
      fill: { color: CARD_BG },
      line: { color: p.color === GREEN ? "1C3D34" : p.color === ROSE ? "4A1E28" : "4A3B1E", width: 1.5 },
      rectRadius: 0.2
    });

    s.addText(p.icon, { x: x + 0.3, y: 2.1, w: 1.0, h: 0.5, fontSize: 32 });
    s.addText(p.title, {
      x: x + 0.3,
      y: 2.7,
      w: 3.1,
      h: 0.6,
      fontSize: 18,
      fontFace: "Trebuchet MS",
      bold: true,
      color: TEXT_LIGHT
    });

    s.addText(p.desc, {
      x: x + 0.3,
      y: 3.4,
      w: 3.1,
      h: 1.6,
      fontSize: 12,
      fontFace: "Arial",
      color: TEXT_MUTED,
      lineSpacingMultiple: 1.25
    });

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.3,
      y: 5.7,
      w: 3.1,
      h: 0.45,
      fill: { color: "181525" },
      line: { color: p.color, width: 1 },
      rectRadius: 0.1
    });
    s.addText(p.badge.toUpperCase(), {
      x: x + 0.3,
      y: 5.7,
      w: 3.1,
      h: 0.45,
      fontSize: 10,
      fontFace: "Arial",
      bold: true,
      color: p.color,
      align: "center",
      valign: "middle"
    });
  });

  addFooter(s);
  s.addNotes(
    "Highlight financial peace of mind! Next is our Anti-Fraud UPI Shield. Every real bank transaction generates a unique 12-digit reference number. FoodLine checks this instantly and prevents replay attacks. Canteen owners receive 100% genuine payments directly into their accounts with zero fraudulent screenshot losses."
  );
}

// =============================================================================
// SLIDE 6: KITCHEN OPERATIONS — TABLET KDS & AUDIO ANNOUNCEMENTS
// =============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: BG_DARK };
  addSlideHeader(s, "05 · Kitchen Hardware", "Kitchen KDS Tablet & Audio Chime TV Display", "06 / 15", PURPLE);

  const kdsItems = [
    {
      title: "Cook's Realtime Tablet KDS",
      desc: "Organizes high-velocity orders into 3 columns: Preparing, Ready, Collected via live Server-Sent Events (SSE).",
      icon: "👨‍🍳"
    },
    {
      title: "Audio Announcement Chimes",
      desc: "Built-in Web Audio API chimes announce completed tokens: 'Token FL-1793 is Ready at Counter 1!'",
      icon: "🔊"
    },
    {
      title: "1-Tap Stockout Toggle",
      desc: "Eliminates 'bhaiya samosa khatam' by locking sold-out items across every student phone in 400ms.",
      icon: "⚡"
    }
  ];

  kdsItems.forEach((k, i) => {
    const x = 0.8 + i * 4.0;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x,
      y: 1.8,
      w: 3.7,
      h: 4.8,
      fill: { color: CARD_BG },
      line: { color: "352A54", width: 1.5 },
      rectRadius: 0.2
    });

    s.addText(k.icon, { x: x + 0.3, y: 2.1, w: 1.0, h: 0.6, fontSize: 32 });
    s.addText(k.title, {
      x: x + 0.3,
      y: 2.8,
      w: 3.1,
      h: 0.6,
      fontSize: 18,
      fontFace: "Trebuchet MS",
      bold: true,
      color: TEXT_LIGHT
    });

    s.addText(k.desc, {
      x: x + 0.3,
      y: 3.5,
      w: 3.1,
      h: 2.4,
      fontSize: 12.5,
      fontFace: "Arial",
      color: TEXT_MUTED,
      lineSpacingMultiple: 1.25
    });
  });

  addFooter(s);
  s.addNotes(
    "In the cafeteria kitchen, chefs manage orders on an intuitive tablet interface called the KDS. When food is packed and ready, a single tap triggers the suspended counter TV screen with audible chime announcements: 'Token FL-1793 is Ready at Counter 1!'"
  );
}

// =============================================================================
// SLIDE 7: STUDENT ORDER TRAY & 1-TAP FAST REORDER
// =============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: BG_DARK };
  addSlideHeader(s, "06 · Student Experience", "Live Order Tray & 1-Tap Instant Fast Reorder", "07 / 15", AMBER);

  const features = [
    {
      title: "Real-Time Order Progression",
      desc: "Visual steppers display exact prep milestones: Order Received ➜ In the Kitchen ➜ Ready for Pickup.",
      icon: "📱"
    },
    {
      title: "Offline-Resilient Optical Pass",
      desc: "QR code and 4-digit OTP persist securely in client storage; works flawlessly even in college dead zones.",
      icon: "🎟️"
    },
    {
      title: "1-Tap Favorite Meal Reorder",
      desc: "One touch instantly recreates past combos (e.g. Vada Pav + Cutting Chai) without browsing 44 dishes.",
      icon: "⚡"
    }
  ];

  features.forEach((f, i) => {
    const x = 0.8 + i * 4.0;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x,
      y: 1.8,
      w: 3.7,
      h: 4.8,
      fill: { color: CARD_BG },
      line: { color: "42321E", width: 1.5 },
      rectRadius: 0.2
    });

    s.addText(f.icon, { x: x + 0.3, y: 2.1, w: 1.0, h: 0.6, fontSize: 32 });
    s.addText(f.title, {
      x: x + 0.3,
      y: 2.8,
      w: 3.1,
      h: 0.6,
      fontSize: 18,
      fontFace: "Trebuchet MS",
      bold: true,
      color: TEXT_LIGHT
    });

    s.addText(f.desc, {
      x: x + 0.3,
      y: 3.5,
      w: 3.1,
      h: 2.4,
      fontSize: 12.5,
      fontFace: "Arial",
      color: TEXT_MUTED,
      lineSpacingMultiple: 1.25
    });
  });

  addFooter(s);
  s.addNotes(
    "For students, FoodLine provides a complete Order History dashboard. You can track live preparation status, retrieve optical QR tokens anytime, and use our 1-Tap Fast Reorder button to buy your favorite lunch combo without re-browsing menus."
  );
}

// =============================================================================
// SLIDE 8: LIVE PILOT PROOF — CAFE @7 SANJIVANI UNIVERSITY
// =============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: BG_DARK };
  addSlideHeader(s, "07 · Pilot Proof", "The Pilot Is Live Right Now at Cafe @7", "08 / 15", GREEN);

  const metrics = [
    { num: "44", label: "Canteen Dishes Cataloged", sub: "8 categories loaded with pricing & images", color: ORANGE },
    { num: "18s", label: "Average Pickup Time", sub: "Down from 12 minutes in the line rush", color: GREEN },
    { num: "0%", label: "Overbooking Incidents", sub: "65 burst stress tests handled cleanly", color: BLUE },
    { num: "100%", label: "Anti-Fraud Success", sub: "Zero fraudulent UPI screenshots accepted", color: GOLD }
  ];

  metrics.forEach((m, i) => {
    const x = 0.8 + i * 3.0;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x,
      y: 1.8,
      w: 2.8,
      h: 4.8,
      fill: { color: CARD_BG },
      line: { color: "25253A", width: 1.5 },
      rectRadius: 0.2
    });

    s.addText(m.num, {
      x: x + 0.2,
      y: 2.4,
      w: 2.4,
      h: 0.9,
      fontSize: 38,
      fontFace: "Trebuchet MS",
      bold: true,
      color: m.color,
      align: "center"
    });

    s.addText(m.label, {
      x: x + 0.2,
      y: 3.5,
      w: 2.4,
      h: 0.6,
      fontSize: 15,
      fontFace: "Trebuchet MS",
      bold: true,
      color: TEXT_LIGHT,
      align: "center"
    });

    s.addText(m.sub, {
      x: x + 0.2,
      y: 4.3,
      w: 2.4,
      h: 1.4,
      fontSize: 12,
      fontFace: "Arial",
      color: TEXT_MUTED,
      align: "center",
      lineSpacingMultiple: 1.2
    });
  });

  addFooter(s);
  s.addNotes(
    "Speak with pride about the Sanjivani University deployment! We have all 44 menu dishes loaded, 4 daily break slots configured, and 100% paperless optical QR tokens. Students don't even have to install a heavy app — it loads instantly in any browser as a PWA."
  );
}

// =============================================================================
// SLIDE 9: UNIT ECONOMICS & REVENUE MODEL
// =============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: BG_DARK };
  addSlideHeader(s, "08 · Business Model", "Three High-Margin Revenue Streams", "09 / 15", GOLD);

  const streams = [
    {
      num: "01",
      title: "Fast-Pass Convenience Fee",
      rate: "3.5% PER ORDER",
      desc: "Small student convenience fee on digital express orders (₹6 on a ₹50 meal combo). Canteen retains full item margin with zero cashier headache.",
      color: GOLD
    },
    {
      num: "02",
      title: "Canteen SaaS Subscription",
      rate: "₹2,499 / MONTH",
      desc: "Fixed monthly software fee per canteen covering KDS kitchen tablets, TV queue announcements, automated inventory tracking, and fraud defense.",
      color: ORANGE
    },
    {
      num: "03",
      title: "Sponsored Tray Placements",
      rate: "₹15,000 / BRAND",
      desc: "FMCG beverage and snack brands pay to feature promoted food pairing recommendations inside the digital tray checkout screen.",
      color: GREEN
    }
  ];

  streams.forEach((st, i) => {
    const x = 0.8 + i * 4.0;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x,
      y: 1.8,
      w: 3.7,
      h: 4.8,
      fill: { color: CARD_BG },
      line: { color: "3A3222", width: 1.5 },
      rectRadius: 0.2
    });

    s.addText(st.num, {
      x: x + 0.3,
      y: 2.1,
      w: 1.0,
      h: 0.5,
      fontSize: 20,
      fontFace: "Trebuchet MS",
      bold: true,
      color: st.color
    });

    s.addText(st.rate, {
      x: x + 0.3,
      y: 2.6,
      w: 3.1,
      h: 0.4,
      fontSize: 14,
      fontFace: "Courier New",
      bold: true,
      color: st.color
    });

    s.addText(st.title, {
      x: x + 0.3,
      y: 3.1,
      w: 3.1,
      h: 0.6,
      fontSize: 18,
      fontFace: "Trebuchet MS",
      bold: true,
      color: TEXT_LIGHT
    });

    s.addText(st.desc, {
      x: x + 0.3,
      y: 3.8,
      w: 3.1,
      h: 2.2,
      fontSize: 12.5,
      fontFace: "Arial",
      color: TEXT_MUTED,
      lineSpacingMultiple: 1.25
    });
  });

  addFooter(s);
  s.addNotes(
    "Keep the economics simple: on every ₹50 order, the canteen owner retains ₹44 with zero cashier headaches, and FoodLine earns ₹6. Because queues vanish, the canteen serves 40% more students every single day without hiring extra workers."
  );
}

// =============================================================================
// SLIDE 10: ROBUST MODERN TECH ARCHITECTURE
// =============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: BG_DARK };
  addSlideHeader(s, "09 · Tech Architecture", "Built for 2,500 RPS Class Dismissal Bursts", "10 / 15", BLUE);

  const tech = [
    { title: "Next.js 15 & PWA", desc: "Zero app-store friction. Sub-second loads on campus 4G/WiFi with Service Worker offline caching.", icon: "⚡" },
    { title: "PostgreSQL Row Locks", desc: "Atomic transactions prevent overselling during 2,000-student class transition dismissal bells.", icon: "🔒" },
    { title: "Realtime SSE Streams", desc: "Sub-50ms live order status push to cooks' KDS tablets and counter TV displays.", icon: "📡" },
    { title: "Google Sheets Auth", desc: "Live integration with campus directory spreadsheets for instant student PRN resolution.", icon: "📊" }
  ];

  tech.forEach((t, i) => {
    const x = 0.8 + (i % 2) * 6.0;
    const y = 1.8 + Math.floor(i / 2) * 2.5;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x,
      y: y,
      w: 5.7,
      h: 2.2,
      fill: { color: CARD_BG },
      line: { color: "253248", width: 1.5 },
      rectRadius: 0.2
    });

    s.addText(t.icon, { x: x + 0.3, y: y + 0.3, w: 0.8, h: 0.5, fontSize: 26 });
    s.addText(t.title, {
      x: x + 1.2,
      y: y + 0.3,
      w: 4.2,
      h: 0.4,
      fontSize: 17,
      fontFace: "Trebuchet MS",
      bold: true,
      color: TEXT_LIGHT
    });
    s.addText(t.desc, {
      x: x + 1.2,
      y: y + 0.8,
      w: 4.2,
      h: 1.1,
      fontSize: 12,
      fontFace: "Arial",
      color: TEXT_MUTED,
      lineSpacingMultiple: 1.2
    });
  });

  addFooter(s);
  s.addNotes(
    "Highlight high reliability under 2,500 requests per second. Under the hood, FoodLine is built on Next.js 15, PostgreSQL database, and Server-Sent Events (SSE). It handles thousands of simultaneous student clicks during class dismissal bells with zero lag."
  );
}

// =============================================================================
// SLIDE 11: COMPETITIVE MOAT (FOODLINE VS COMPETITORS)
// =============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: BG_DARK };
  addSlideHeader(s, "10 · Competitive Moat", "FoodLine vs. Delivery Apps vs. Old Canteen", "11 / 15", GREEN);

  const contenders = [
    {
      title: "FoodLine Express",
      badge: "Campus Winner",
      badgeColor: GREEN,
      borderColor: GREEN,
      points: [
        "⏱️ 30-Sec Pickup (Guaranteed)",
        "💰 ₹0 Delivery • ₹6 VIP Pass",
        "📍 Inside Quad Counter Handover",
        "🕒 Synced to 15-Min Break Slots",
        "🛡️ 100% Anti-Fraud 12-Digit UTR"
      ]
    },
    {
      title: "Swiggy & Zomato",
      badge: "Off-Campus Friction",
      badgeColor: ROSE,
      borderColor: "4A1E28",
      points: [
        "⏱️ 35-50 Min Delays (Misses recess)",
        "💰 ₹40-₹65 Delivery & Surge Fees",
        "📍 Barred at college security gate",
        "🕒 Zero break-time scheduling",
        "❌ High minimum order fees"
      ]
    },
    {
      title: "Traditional Canteen",
      badge: "Daily Bottleneck",
      badgeColor: AMBER,
      borderColor: "4A3B1E",
      points: [
        "⏱️ 12-15 Min push & shove line",
        "💰 Hidden cost: 80% break lost",
        "📍 Trapped in 200-student mob",
        "🕒 Kitchen crashes during rush",
        "❌ Frequent 'samosa khatam'"
      ]
    }
  ];

  contenders.forEach((c, i) => {
    const x = 0.8 + i * 4.0;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x,
      y: 1.8,
      w: 3.7,
      h: 4.8,
      fill: { color: CARD_BG },
      line: { color: c.borderColor, width: 1.5 },
      rectRadius: 0.2
    });

    s.addText(c.title, {
      x: x + 0.25,
      y: 2.1,
      w: 3.2,
      h: 0.5,
      fontSize: 17,
      fontFace: "Trebuchet MS",
      bold: true,
      color: c.badgeColor === GREEN ? GREEN : TEXT_LIGHT
    });

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.25,
      y: 2.7,
      w: 3.2,
      h: 0.35,
      fill: { color: c.badgeColor === GREEN ? "142822" : c.badgeColor === ROSE ? "261418" : "262014" },
      line: { color: c.badgeColor, width: 1 },
      rectRadius: 0.08
    });
    s.addText(c.badge.toUpperCase(), {
      x: x + 0.25,
      y: 2.7,
      w: 3.2,
      h: 0.35,
      fontSize: 9.5,
      fontFace: "Arial",
      bold: true,
      color: c.badgeColor,
      align: "center",
      valign: "middle"
    });

    c.points.forEach((pt, ptIdx) => {
      s.addText(pt, {
        x: x + 0.25,
        y: 3.3 + ptIdx * 0.65,
        w: 3.2,
        h: 0.55,
        fontSize: 12,
        fontFace: "Arial",
        color: TEXT_LIGHT,
        lineSpacingMultiple: 1.15
      });
    });
  });

  addFooter(s);
  s.addNotes(
    "Why can't Swiggy or Zomato work here? Because outside delivery drivers aren't allowed inside college corridors, they charge ₹40+ fees, and take 45 minutes! FoodLine is engineered specifically for campus recess — ₹0 delivery fee, 30-second pickup, and guaranteed hot food."
  );
}

// =============================================================================
// SLIDE 12: STUDENT LOGIN & INSTANT EXPRESS PRE-ORDERING
// (Replacing 5 canteens per user rule!)
// =============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: BG_DARK };
  addSlideHeader(s, "11 · Student Access", "Student Login & Instant Express Pre-Ordering", "12 / 15", ORANGE);

  const loginFeatures = [
    {
      title: "1-Tap PRN Auto-Resolution",
      desc: "Students log in instantly with their Sanjivani PRN or Google Auth. System auto-resolves branch, semester, and profile in 200ms.",
      icon: "🎓",
      tag: "Instant Campus Auth"
    },
    {
      title: "Direct Cafe @7 Express Lane",
      desc: "1-tap entry into Cafe @7's full 44-dish menu. Intelligent break-time slot recommendation prevents queuing during recess peak.",
      icon: "⚡",
      tag: "Pre-Order Fast-Pass"
    },
    {
      title: "Google Sheets Master Sync",
      desc: "Direct integration with university directory spreadsheets. Zero rogue accounts, automatic verification, and live admin sync.",
      icon: "📊",
      tag: "Zero Friction Setup"
    },
    {
      title: "Live Token Tray & 1-Tap Reorder",
      desc: "Track kitchen prep in real-time, view optical QR passes with 4-digit OTP, and re-order favorite daily meal combos with one tap.",
      icon: "📦",
      tag: "Smart Student Tray"
    }
  ];

  loginFeatures.forEach((lf, i) => {
    const x = 0.8 + i * 3.0;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x,
      y: 1.8,
      w: 2.8,
      h: 4.8,
      fill: { color: CARD_BG },
      line: { color: i === 0 ? ORANGE : i === 1 ? GREEN : "2E2A42", width: 1.5 },
      rectRadius: 0.2
    });

    s.addText(lf.icon, { x: x + 0.3, y: 2.1, w: 1.0, h: 0.6, fontSize: 32 });
    s.addText(lf.title, {
      x: x + 0.3,
      y: 2.8,
      w: 2.2,
      h: 0.7,
      fontSize: 16,
      fontFace: "Trebuchet MS",
      bold: true,
      color: TEXT_LIGHT
    });

    s.addText(lf.desc, {
      x: x + 0.3,
      y: 3.6,
      w: 2.2,
      h: 1.8,
      fontSize: 12,
      fontFace: "Arial",
      color: TEXT_MUTED,
      lineSpacingMultiple: 1.25
    });

    // Badge
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.3,
      y: 5.8,
      w: 2.2,
      h: 0.45,
      fill: { color: i === 0 ? "2D1C16" : i === 1 ? "142822" : "181525" },
      line: { color: i === 0 ? ORANGE : i === 1 ? GREEN : "423E56", width: 1 },
      rectRadius: 0.1
    });
    s.addText(lf.tag.toUpperCase(), {
      x: x + 0.3,
      y: 5.8,
      w: 2.2,
      h: 0.45,
      fontSize: 9.5,
      fontFace: "Arial",
      bold: true,
      color: i === 0 ? ORANGE : i === 1 ? GREEN : TEXT_LIGHT,
      align: "center",
      valign: "middle"
    });
  });

  addFooter(s);
  s.addNotes(
    "Onboarding students is effortless with our 1-Tap PRN Campus Login. Students simply enter their Sanjivani PRN or sign in via Google. FoodLine verifies their campus credentials via Google Sheets master directory sync, routing them directly into Cafe @7's live menu with automated break slot recommendations."
  );
}

// =============================================================================
// SLIDE 13: DYNAMIC THEME ENGINE & ROYAL IVORY-GOLD LUXURY THEME
// =============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: BG_DARK };
  addSlideHeader(s, "12 · Personalization", "Day/Night Modes & Royal Ivory-Gold Luxury Theme 👑", "13 / 15", GOLD);

  const themes = [
    {
      title: "Royal Ivory & Gold 👑",
      desc: "Porcelain ivory canvas paired with imperial gold and champagne accents for executive presentations.",
      badge: "Luxury Preset",
      color: GOLD
    },
    {
      title: "Sunlit Day Mode ☀️",
      desc: "High-contrast, glare-free aesthetic calibrated for outdoor campus courtyards and bright lecture halls.",
      badge: "Glare-Free",
      color: AMBER
    },
    {
      title: "OLED Night Mode 🌙",
      desc: "Deep battery-saving dark glassmorphism tailored for late-night hostel cram sessions and study marathons.",
      badge: "Battery Saver",
      color: PURPLE
    },
    {
      title: "Custom Palette Studio 🎨",
      desc: "Students and universities customize primary and highlight tokens to match college departmental colors.",
      badge: "User Freedom",
      color: GREEN
    }
  ];

  themes.forEach((th, i) => {
    const x = 0.8 + i * 3.0;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x,
      y: 1.8,
      w: 2.8,
      h: 4.8,
      fill: { color: CARD_BG },
      line: { color: i === 0 ? GOLD : "28253A", width: 1.5 },
      rectRadius: 0.2
    });

    s.addText(th.title, {
      x: x + 0.3,
      y: 2.2,
      w: 2.2,
      h: 0.8,
      fontSize: 16,
      fontFace: "Trebuchet MS",
      bold: true,
      color: th.color
    });

    s.addText(th.desc, {
      x: x + 0.3,
      y: 3.2,
      w: 2.2,
      h: 2.2,
      fontSize: 12,
      fontFace: "Arial",
      color: TEXT_MUTED,
      lineSpacingMultiple: 1.25
    });

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.3,
      y: 5.8,
      w: 2.2,
      h: 0.45,
      fill: { color: "181525" },
      line: { color: th.color, width: 1 },
      rectRadius: 0.1
    });
    s.addText(th.badge.toUpperCase(), {
      x: x + 0.3,
      y: 5.8,
      w: 2.2,
      h: 0.45,
      fontSize: 10,
      fontFace: "Arial",
      bold: true,
      color: th.color,
      align: "center",
      valign: "middle"
    });
  });

  addFooter(s);
  s.addNotes(
    "Notice our adaptive design system! We offer full Day and Night modes along with our new Royal Ivory & Gold luxury theme. Students can enjoy glare-free outdoor browsing during sunny breaks or deep dark OLED modes during evening study hours."
  );
}

// =============================================================================
// SLIDE 14: 40-SECOND VIRAL VIDEO AD CAMPAIGN
// =============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: BG_DARK };
  addSlideHeader(s, "13 · Viral Adoption", "40-Second Video Campaign: 'Own Your Recess'", "14 / 15", ROSE);

  const scenes = [
    {
      time: "0:00 - 0:08",
      title: "The Panic",
      desc: "Loud bell rings. 40 students jam the Cafe @7 counter waving notes as the clock ticks away.",
      badge: "The Problem"
    },
    {
      time: "0:08 - 0:20",
      title: "The Hack",
      desc: "Smart student on phone desk taps Cafe @7, selects 11:50 AM slot, pays via UPI in 5 seconds.",
      badge: "The Solution"
    },
    {
      time: "0:20 - 0:32",
      title: "The Flex",
      desc: "Student walks past crowded line to VIP pickup lane. Flashes QR code, grabs hot samosa in 18s.",
      badge: "The VIP Pass"
    },
    {
      time: "0:32 - 0:40",
      title: "The Drop",
      desc: "\"Stop waiting. Start eating. Pre-order on FoodLine now.\" QR code links directly to app.",
      badge: "Viral Call to Action"
    }
  ];

  scenes.forEach((sc, i) => {
    const x = 0.8 + i * 3.0;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x,
      y: 1.8,
      w: 2.8,
      h: 4.8,
      fill: { color: CARD_BG },
      line: { color: "3A222B", width: 1.5 },
      rectRadius: 0.2
    });

    s.addText(sc.time, {
      x: x + 0.3,
      y: 2.1,
      w: 2.2,
      h: 0.3,
      fontSize: 11,
      fontFace: "Courier New",
      bold: true,
      color: ROSE
    });

    s.addText(sc.title, {
      x: x + 0.3,
      y: 2.5,
      w: 2.2,
      h: 0.5,
      fontSize: 18,
      fontFace: "Trebuchet MS",
      bold: true,
      color: TEXT_LIGHT
    });

    s.addText(sc.desc, {
      x: x + 0.3,
      y: 3.2,
      w: 2.2,
      h: 2.2,
      fontSize: 12,
      fontFace: "Arial",
      color: TEXT_MUTED,
      lineSpacingMultiple: 1.25
    });

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.3,
      y: 5.8,
      w: 2.2,
      h: 0.45,
      fill: { color: "24151B" },
      line: { color: ROSE, width: 1 },
      rectRadius: 0.1
    });
    s.addText(sc.badge.toUpperCase(), {
      x: x + 0.3,
      y: 5.8,
      w: 2.2,
      h: 0.45,
      fontSize: 9.5,
      fontFace: "Arial",
      bold: true,
      color: ROSE,
      align: "center",
      valign: "middle"
    });
  });

  addFooter(s);
  s.addNotes(
    "To acquire students rapidly, we launched our viral 40-Second Student Video Campaign called 'Own Your Recess'. It shows students how to order in 5 seconds from class and breeze past 40 people waiting in line to grab hot food in 18 seconds."
  );
}

// =============================================================================
// SLIDE 15: GRAND VISION & EXPANSION ROADMAP
// =============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: BG_DARK };
  addSlideHeader(s, "14 · The Vision", "From Single Canteen to Statewide Campus Network", "15 / 15", GREEN);

  const roadmap = [
    {
      phase: "PHASE 1 — CURRENT",
      title: "Cafe @7 Live Pilot",
      desc: "Sanjivani University Cafe @7 live deployment. 44 dishes, 4 break slots, 100% online UPI, 60-slot throttler.",
      badge: "Operational Live",
      color: GREEN
    },
    {
      phase: "PHASE 2 — 2026",
      title: "Regional Cluster",
      desc: "15 Engineering & Medical colleges across Pune, Nashik, Ahmednagar with student ambassador network.",
      badge: "15 Campuses",
      color: ORANGE
    },
    {
      phase: "PHASE 3 — 2027",
      title: "Statewide Standard",
      desc: "50+ Universities, 100,000+ active student users, AI meal recommendations, and ₹50 Lakh monthly GMV.",
      badge: "Standard in Dining",
      color: GOLD
    }
  ];

  roadmap.forEach((r, i) => {
    const x = 0.8 + i * 4.0;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x,
      y: 1.8,
      w: 3.7,
      h: 4.8,
      fill: { color: CARD_BG },
      line: { color: r.color === GREEN ? "1C3D34" : r.color === ORANGE ? "4A2E1C" : "4A3D1E", width: 1.5 },
      rectRadius: 0.2
    });

    s.addText(r.phase, {
      x: x + 0.3,
      y: 2.1,
      w: 3.1,
      h: 0.3,
      fontSize: 10.5,
      fontFace: "Courier New",
      bold: true,
      color: r.color
    });

    s.addText(r.title, {
      x: x + 0.3,
      y: 2.5,
      w: 3.1,
      h: 0.6,
      fontSize: 19,
      fontFace: "Trebuchet MS",
      bold: true,
      color: TEXT_LIGHT
    });

    s.addText(r.desc, {
      x: x + 0.3,
      y: 3.2,
      w: 3.1,
      h: 2.0,
      fontSize: 12.5,
      fontFace: "Arial",
      color: TEXT_MUTED,
      lineSpacingMultiple: 1.25
    });

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.3,
      y: 5.7,
      w: 3.1,
      h: 0.45,
      fill: { color: "181525" },
      line: { color: r.color, width: 1 },
      rectRadius: 0.1
    });
    s.addText(r.badge.toUpperCase(), {
      x: x + 0.3,
      y: 5.7,
      w: 3.1,
      h: 0.45,
      fontSize: 10,
      fontFace: "Arial",
      bold: true,
      color: r.color,
      align: "center",
      valign: "middle"
    });
  });

  addFooter(s);
  s.addNotes(
    "Our vision is to expand FoodLine to 50+ college campuses across Maharashtra. We are giving students their break time back — hot food, zero queues, and pure convenience. Thank you so much! We would love to answer your questions!"
  );
}

// Generate the PPTX
const outDocs = "/home/darkkakashi/Documents/FoodLine-Zero-Queue-Campus-Dining-and-Express-Pickup-Ecosystem-Creative.pptx";
const outLocal = path.join(__dirname, "FoodLine_Creative_Pitch_Deck.pptx");

console.log("Writing creative presentations...");
pptx.writeFile({ fileName: outDocs }).then(() => {
  console.log(`✅ Creative PPTX generated in Documents: ${outDocs}`);
  return pptx.writeFile({ fileName: outLocal });
}).then(() => {
  console.log(`✅ Creative PPTX generated in Workspace: ${outLocal}`);
}).catch(err => {
  console.error("Error generating PPTX:", err);
  process.exit(1);
});
