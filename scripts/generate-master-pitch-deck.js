const PptxGenJS = require('../frontend/node_modules/pptxgenjs');
const fs = require('fs');
const path = require('path');

const pptx = new PptxGenJS();

// Standard 16:9 Widescreen (13.333" x 7.5")
pptx.layout = 'LAYOUT_WIDE';

// -------------------------------------------------------------
// DESIGN PALETTE: Clean Modern Light Theme
// Soft warm paper white (#F8FAFC), Charcoal (#0F172A), Slate (#475569)
// Fresh Emerald Green (#059669 / #10B981), Amber (#D97706), Red (#DC2626)
// -------------------------------------------------------------
const BG_COLOR = 'F8FAFC';       // Soft clean paper white
const CARD_BG = 'FFFFFF';        // Pure white card
const CARD_BORDER = 'E2E8F0';    // 1px crisp subtle border
const TEXT_DARK = '0F172A';      // Deep charcoal headline text
const TEXT_BODY = '334155';      // Slate gray body text
const TEXT_MUTED = '64748B';     // Cool muted label text

const PRIMARY_GREEN = '059669';  // Fresh Emerald Green
const ACCENT_GREEN = '10B981';   // Bright Emerald Accent
const LIGHT_GREEN = 'ECFDF5';    // Emerald Tint Card
const BORDER_GREEN = 'A7F3D0';   // Emerald Card Border

const ACCENT_AMBER = 'D97706';   // Amber Highlight
const LIGHT_AMBER = 'FFFBEB';    // Amber Tint Card
const BORDER_AMBER = 'FDE68A';   // Amber Card Border

const ACCENT_RED = 'DC2626';     // Warning Crimson
const LIGHT_RED = 'FEF2F2';      // Red Tint Card
const BORDER_RED = 'FECACA';     // Red Card Border

const ACCENT_BLUE = '2563EB';    // Technology Blue
const LIGHT_BLUE = 'EFF6FF';     // Blue Tint Card
const BORDER_BLUE = 'BFDBFE';    // Blue Card Border

const LOGO_PATH = path.join(__dirname, '../foodline-campus-logo.png');
const HAS_LOGO = fs.existsSync(LOGO_PATH);

// Helper function for consistent header styling
function addHeader(slide, category, title, subtitle) {
  // Category Tag Pill
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 0.45, w: 3.2, h: 0.32,
    fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.08
  });
  slide.addText(category.toUpperCase(), {
    x: 0.8, y: 0.45, w: 3.2, h: 0.32,
    fontSize: 10, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: 'Arial'
  });

  // Top right brand badge
  slide.addText('FOODLINE CAMPUS', {
    x: 10.0, y: 0.45, w: 2.5, h: 0.32,
    fontSize: 10, bold: true, color: TEXT_MUTED, align: 'right', fontFace: 'Arial'
  });

  // Main Slide Title
  slide.addText(title, {
    x: 0.8, y: 0.85, w: 11.7, h: 0.55,
    fontSize: 24, bold: true, color: TEXT_DARK, fontFace: 'Arial'
  });

  // Subtitle / Narrative Anchor
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.8, y: 1.4, w: 11.7, h: 0.38,
      fontSize: 13, color: TEXT_MUTED, fontFace: 'Arial'
    });
  }
}

// Helper function for slide footer
function addFooter(slide, slideNum, totalSlides = 12) {
  slide.addText(`FoodLine Campus • Master Pitch Deck 2026`, {
    x: 0.8, y: 7.05, w: 6.0, h: 0.3,
    fontSize: 9, color: TEXT_MUTED, fontFace: 'Arial'
  });
  slide.addText(`${slideNum} / ${totalSlides}`, {
    x: 10.0, y: 7.05, w: 2.5, h: 0.3,
    fontSize: 9, bold: true, color: TEXT_MUTED, align: 'right', fontFace: 'Arial'
  });
}

// ==============================================================================
// SLIDE 1: COVER SLIDE
// ==============================================================================
let slide1 = pptx.addSlide();
slide1.background = { color: BG_COLOR };

// Decorative soft accent strip at the top
slide1.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 13.333, h: 0.15,
  fill: { color: PRIMARY_GREEN }, line: { color: PRIMARY_GREEN }
});

// Category Badge
slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 0.8, w: 4.6, h: 0.36,
  fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.1
});
slide1.addText('FOODLINE CAMPUS • 2026 INVESTOR & PARTNER DECK', {
  x: 0.8, y: 0.8, w: 4.6, h: 0.36,
  fontSize: 10, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: 'Arial'
});

// Logo on top right if present
if (HAS_LOGO) {
  slide1.addImage({ path: LOGO_PATH, x: 11.0, y: 0.6, w: 1.5, h: 0.6 });
}

// Main Title & Subtitle
slide1.addText('FoodLine Campus', {
  x: 0.8, y: 1.35, w: 11.7, h: 0.85,
  fontSize: 40, bold: true, color: TEXT_DARK, fontFace: 'Arial'
});

slide1.addText('Zero-Queue Express Food Ordering & Kitchen Automation for College Campuses', {
  x: 0.8, y: 2.2, w: 11.7, h: 0.5,
  fontSize: 18, bold: true, color: PRIMARY_GREEN, fontFace: 'Arial'
});

slide1.addText('Target Audience: Financers, Angel Investors & Canteen Operations Partners', {
  x: 0.8, y: 2.7, w: 11.7, h: 0.35,
  fontSize: 12, color: TEXT_MUTED, fontFace: 'Arial'
});

// Hero Banner Card
slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 3.25, w: 11.7, h: 1.1,
  fill: { color: 'FFFFFF' }, line: { color: CARD_BORDER, width: 1 }, rectRadius: 0.12
});
slide1.addText('"No More Waiting in Lines. Just Order, Grab, and Go."', {
  x: 1.1, y: 3.35, w: 11.1, h: 0.45,
  fontSize: 20, bold: true, color: TEXT_DARK, fontFace: 'Arial'
});
slide1.addText('Transforming chaotic university canteens into frictionless, 30-second digital pickup rails.', {
  x: 1.1, y: 3.8, w: 11.1, h: 0.4,
  fontSize: 13, color: TEXT_BODY, fontFace: 'Arial'
});

// Two Side-by-Side Highlight Cards
// Left: For Students
slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 4.55, w: 5.7, h: 2.3,
  fill: { color: 'FFFFFF' }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.12
});
slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 1.1, y: 4.75, w: 2.5, h: 0.3,
  fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.08
});
slide1.addText('FOR STUDENTS', {
  x: 1.1, y: 4.75, w: 2.5, h: 0.3,
  fontSize: 10, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: 'Arial'
});
slide1.addText('• Order meals during the last 5 minutes of lecture\n• 100% Upfront UPI payment with instant confirmation\n• 30-Second grab-and-go pickup at dedicated express counter\n• Never skip a meal or arrive late to class again', {
  x: 1.1, y: 5.15, w: 5.1, h: 1.5,
  fontSize: 12, color: TEXT_BODY, fontFace: 'Arial', lineSpacingMultiple: 1.2
});

// Right: For Canteens & Financers
slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.8, y: 4.55, w: 5.7, h: 2.3,
  fill: { color: 'FFFFFF' }, line: { color: BORDER_BLUE, width: 1 }, rectRadius: 0.12
});
slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.1, y: 4.75, w: 3.2, h: 0.3,
  fill: { color: LIGHT_BLUE }, line: { color: BORDER_BLUE, width: 1 }, rectRadius: 0.08
});
slide1.addText('FOR CANTEENS & INVESTORS', {
  x: 7.1, y: 4.75, w: 3.2, h: 0.3,
  fontSize: 10, bold: true, color: ACCENT_BLUE, align: 'center', fontFace: 'Arial'
});
slide1.addText('• 40% Increase in rush-hour order processing capacity\n• 100% Fraud-Proof: Cryptographic UTR bank verification\n• Zero delivery fleet, zero drivers, zero kitchen Capex\n• Sticky, high-frequency daily campus cashflow', {
  x: 7.1, y: 5.15, w: 5.1, h: 1.5,
  fontSize: 12, color: TEXT_BODY, fontFace: 'Arial', lineSpacingMultiple: 1.2
});

addFooter(slide1, 1);
slide1.addNotes(`SLIDE 1 SPEAKER SCRIPT:
"Welcome everyone. Today we are introducing FoodLine Campus — the zero-queue express food ordering and kitchen automation system built specifically for college universities.

Every single day, thousands of students have only 15 minutes between lectures to eat. Canteens get completely flooded with 200 students pushing at the counter at the exact same minute. FoodLine fixes this forever — with a simple 30-second pickup system."`);


// ==============================================================================
// SLIDE 2: THE PROBLEM (EXPLAINED LIKE A 10-YEAR-OLD)
// ==============================================================================
let slide2 = pptx.addSlide();
slide2.background = { color: BG_COLOR };
addHeader(slide2, 'THE RUSH-HOUR CRISIS', 'The 15-Minute Break Trap', '"The bell rings at 1:00 PM. By 1:02 PM, the canteen is an unmanageable battlefield."');

// Left Box: What Happens Right Now (Red Card)
slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.9, w: 5.7, h: 3.8,
  fill: { color: LIGHT_RED }, line: { color: BORDER_RED, width: 1.5 }, rectRadius: 0.12
});
slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 1.1, y: 2.1, w: 3.0, h: 0.32,
  fill: { color: 'FFFFFF' }, line: { color: BORDER_RED, width: 1 }, rectRadius: 0.08
});
slide2.addText('WHAT HAPPENS RIGHT NOW', {
  x: 1.1, y: 2.1, w: 3.0, h: 0.32,
  fontSize: 10, bold: true, color: ACCENT_RED, align: 'center', fontFace: 'Arial'
});

slide2.addText('The Crowd Rush\n500 hungry students rush to the single counter at the exact same minute.\n\nThe Lost Lunch\nWaiting in line takes 18 minutes. But the break is only 15 minutes! Over 50% of students either skip food or arrive late to class.\n\nThe Cook\'s Nightmare\nThe canteen manager has 2 hands and 50 shouting people. Cooked food burns, wrong orders get handed out, and tempers flare.', {
  x: 1.1, y: 2.55, w: 5.1, h: 3.0,
  fontSize: 12, color: TEXT_DARK, fontFace: 'Arial', lineSpacingMultiple: 1.15
});

// Right Box: The Reality Check (Neutral Card)
slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.8, y: 1.9, w: 5.7, h: 3.8,
  fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1.5 }, rectRadius: 0.12
});
slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.1, y: 2.1, w: 2.6, h: 0.32,
  fill: { color: LIGHT_AMBER }, line: { color: BORDER_AMBER, width: 1 }, rectRadius: 0.08
});
slide2.addText('THE REALITY CHECK', {
  x: 7.1, y: 2.1, w: 2.6, h: 0.32,
  fontSize: 10, bold: true, color: ACCENT_AMBER, align: 'center', fontFace: 'Arial'
});

slide2.addText('For Hungry Students\nSkipped meals lead to afternoon exhaustion. Standing in crowds wastes 100% of their social and relaxation time.\n\nFor Canteen Owners\nPhysical counter congestion caps sales. The canteen loses 40% to 60% of potential daily revenue simply because lines move too slowly.\n\nFor College Administration\nCorridors get blocked, students enter lectures late, and campus gates experience friction and noise.', {
  x: 7.1, y: 2.55, w: 5.1, h: 3.0,
  fontSize: 12, color: TEXT_DARK, fontFace: 'Arial', lineSpacingMultiple: 1.15
});

// Bottom Callout Banner (Analogy)
slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 5.85, w: 11.7, h: 1.0,
  fill: { color: 'FFFFFF' }, line: { color: CARD_BORDER, width: 1 }, rectRadius: 0.1
});
slide2.addText('THE 5-SECOND ANALOGY:', {
  x: 1.1, y: 5.95, w: 11.1, h: 0.25,
  fontSize: 11, bold: true, color: PRIMARY_GREEN, fontFace: 'Arial'
});
slide2.addText('"Think of a school bell ringing. If 500 kids all try to squeeze through one narrow door at the same second, everyone gets stuck. That is exactly what happens at campus canteens today."', {
  x: 1.1, y: 6.25, w: 11.1, h: 0.45,
  fontSize: 13, bold: true, color: TEXT_DARK, fontFace: 'Arial'
});

addFooter(slide2, 2);
slide2.addNotes(`SLIDE 2 SPEAKER SCRIPT:
"Think of a school bell ringing. If 500 kids all try to squeeze through one narrow door at the same second, everyone gets stuck. That is what happens at campus canteens today.

The break is only 15 minutes long, but the physical queue takes 18 minutes. Half the students turn back hungry or end up late to class. Meanwhile, the canteen owner loses hundreds of sales every single afternoon."`);


// ==============================================================================
// SLIDE 3: WHY SWIGGY & ZOMATO CAN'T SOLVE THIS
// ==============================================================================
let slide3 = pptx.addSlide();
slide3.background = { color: BG_COLOR };
addHeader(slide3, 'CAMPUS-SPECIFIC DYNAMICS', 'Why Commercial Delivery Apps Fail on Campus', '"Ordering a ₹20 Vada Pav with a ₹40 delivery fee makes zero economic sense."');

// 3 Warning Pillar Cards
const pillarsSlide3 = [
  {
    num: '01',
    badge: 'SECURITY RESTRICTIONS',
    title: 'Outside Bikes Are Blocked',
    detail: 'University security strictly prohibits outside delivery riders from entering campus gates or classroom corridors for student safety.\n\nRiders wait at distant main gates — 10 to 15 minutes walk away. Walking to the gate defeats the entire purpose of a quick break snack.',
    tint: LIGHT_RED,
    border: BORDER_RED,
    color: ACCENT_RED
  },
  {
    num: '02',
    badge: 'UNVIABLE UNIT ECONOMICS',
    title: 'Delivery Costs More Than Food',
    detail: 'A college student spending ₹20 on a Vada Pav or ₹30 on a Samosa cannot pay ₹40 to ₹60 extra in delivery charges, packaging surcharges, and tips.\n\nStudents live on tight pocket budgets. Commercial food delivery apps are built for luxury adult salaries, not campus pockets.',
    tint: LIGHT_AMBER,
    border: BORDER_AMBER,
    color: ACCENT_AMBER
  },
  {
    num: '03',
    badge: 'MISSED RECESS WINDOW',
    title: 'Delivery Takes 40+ Minutes',
    detail: 'Off-campus restaurant preparation, rider dispatch, and traffic takes 35 to 45 minutes.\n\nCampus recess is only 15 to 20 minutes! The food arrives long after the student has already returned to the lecture hall, leaving the delivery abandoned.',
    tint: LIGHT_RED,
    border: BORDER_RED,
    color: ACCENT_RED
  }
];

pillarsSlide3.forEach((item, idx) => {
  const x = 0.8 + (idx * 4.0);
  slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 1.9, w: 3.7, h: 3.8,
    fill: { color: 'FFFFFF' }, line: { color: item.border, width: 1.5 }, rectRadius: 0.12
  });

  slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.3, y: 2.1, w: 3.1, h: 0.3,
    fill: { color: item.tint }, line: { color: item.border, width: 1 }, rectRadius: 0.08
  });
  slide3.addText(item.badge, {
    x: x + 0.3, y: 2.1, w: 3.1, h: 0.3,
    fontSize: 9, bold: true, color: item.color, align: 'center', fontFace: 'Arial'
  });

  slide3.addText(item.title, {
    x: x + 0.3, y: 2.55, w: 3.1, h: 0.5,
    fontSize: 16, bold: true, color: TEXT_DARK, fontFace: 'Arial'
  });

  slide3.addText(item.detail, {
    x: x + 0.3, y: 3.15, w: 3.1, h: 2.3,
    fontSize: 12, color: TEXT_BODY, fontFace: 'Arial', lineSpacingMultiple: 1.15
  });
});

// Bottom Insight Card
slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 5.85, w: 11.7, h: 1.0,
  fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1.5 }, rectRadius: 0.1
});
slide3.addText('THE CORE REALIZATION:', {
  x: 1.1, y: 5.95, w: 11.1, h: 0.25,
  fontSize: 11, bold: true, color: PRIMARY_GREEN, fontFace: 'Arial'
});
slide3.addText('"The food is already cooked 200 meters away inside their campus canteen. Students don\'t need a motorbike rider. They just need an express digital pickup lane."', {
  x: 1.1, y: 6.25, w: 11.1, h: 0.45,
  fontSize: 13, bold: true, color: TEXT_DARK, fontFace: 'Arial'
});

addFooter(slide3, 3);
slide3.addNotes(`SLIDE 3 SPEAKER SCRIPT:
"Commercial food apps are built for cities, not university campuses. Students don't need a motorbike rider. The food is already cooked 200 meters away in their campus canteen. They just need an express lane.

Delivery bikes cannot enter campus gates, delivery fees double the price of a snack, and deliveries take 40 minutes when the break is only 15 minutes."`);


// ==============================================================================
// SLIDE 4: THE SOLUTION — MEET FOODLINE
// ==============================================================================
let slide4 = pptx.addSlide();
slide4.background = { color: BG_COLOR };
addHeader(slide4, 'THE BREAKTHROUGH RAIL', 'The FoodLine Solution', '"Turn campus canteens into a 30-second express digital pickup rail."');

// Left Column: 3 Core Pillars
const pillarsSlide4 = [
  {
    title: 'Order From the Desk (Classroom Pre-Ordering)',
    detail: 'Students browse live canteen menu and pre-order during the final 5 minutes of class. No rushing out the lecture door to beat the queue.',
    icon: '📱'
  },
  {
    title: '100% Pre-Paid Instant UPI (Zero Counter Cashiering)',
    detail: 'Every rupee is paid upfront with verified 12-digit bank reference (UTR). Zero cash exchanges, zero loose change delays, zero counter confusion.',
    icon: '💳'
  },
  {
    title: '30-Second Express Pickup (Boarding Pass Model)',
    detail: 'Walk straight to the FoodLine express pickup counter, flash the 4-digit code on phone screen, grab packed meal, and enjoy the break.',
    icon: '⚡'
  }
];

pillarsSlide4.forEach((p, idx) => {
  const y = 1.9 + (idx * 1.3);
  slide4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: y, w: 6.6, h: 1.15,
    fill: { color: 'FFFFFF' }, line: { color: CARD_BORDER, width: 1 }, rectRadius: 0.1
  });

  slide4.addText(p.title, {
    x: 1.1, y: y + 0.15, w: 6.0, h: 0.35,
    fontSize: 14, bold: true, color: PRIMARY_GREEN, fontFace: 'Arial'
  });
  slide4.addText(p.detail, {
    x: 1.1, y: y + 0.52, w: 6.0, h: 0.55,
    fontSize: 11, color: TEXT_BODY, fontFace: 'Arial'
  });
});

// Right Column: Digital Boarding Pass Mockup Card
slide4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.7, y: 1.9, w: 4.8, h: 4.85,
  fill: { color: 'FFFFFF' }, line: { color: BORDER_GREEN, width: 2 }, rectRadius: 0.15
});

// Card Header
slide4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 8.0, y: 2.15, w: 4.2, h: 0.4,
  fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.08
});
slide4.addText('DIGITAL PICKUP PASS • READY FOR COLLECTION', {
  x: 8.0, y: 2.15, w: 4.2, h: 0.4,
  fontSize: 10, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: 'Arial'
});

// Big OTP Code Box
slide4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 8.5, y: 2.75, w: 3.2, h: 1.1,
  fill: { color: LIGHT_GREEN }, line: { color: PRIMARY_GREEN, width: 2 }, rectRadius: 0.12
});
slide4.addText('PICKUP CODE', {
  x: 8.5, y: 2.85, w: 3.2, h: 0.25,
  fontSize: 10, bold: true, color: TEXT_MUTED, align: 'center', fontFace: 'Arial'
});
slide4.addText('OTP: 4819', {
  x: 8.5, y: 3.12, w: 3.2, h: 0.6,
  fontSize: 28, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: 'Arial'
});

// Pass details
slide4.addText('Order #FL-1042 • Paid via UPI (UTR Confirmed)', {
  x: 8.0, y: 4.05, w: 4.2, h: 0.3,
  fontSize: 11, bold: true, color: TEXT_DARK, align: 'center', fontFace: 'Arial'
});

slide4.addText('Meal: 2x Bun Maska + 1x Masala Chai\nPickup Slot: 1:15 PM Recess Window\nDesignated Counter: Express Lane 2\nStatus: Packed & Steaming Hot in Kitchen', {
  x: 8.2, y: 4.45, w: 3.8, h: 1.2,
  fontSize: 11, color: TEXT_BODY, fontFace: 'Arial', lineSpacingMultiple: 1.2
});

slide4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 8.2, y: 5.9, w: 3.8, h: 0.6,
  fill: { color: PRIMARY_GREEN }, line: { color: PRIMARY_GREEN }, rectRadius: 0.08
});
slide4.addText('⚡ Flash Code at Counter 2 (30-Sec Pickup)', {
  x: 8.2, y: 5.9, w: 3.8, h: 0.6,
  fontSize: 12, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Arial'
});

// Left Column Bottom Note
slide4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 5.9, w: 6.6, h: 0.85,
  fill: { color: LIGHT_BLUE }, line: { color: BORDER_BLUE, width: 1 }, rectRadius: 0.1
});
slide4.addText('THE AIRPORT ANALOGY: "FoodLine is like a digital boarding pass for your lunch. You pre-book, arrive at the gate, show your pass, and board without waiting in line."', {
  x: 1.0, y: 6.0, w: 6.2, h: 0.65,
  fontSize: 11, bold: true, color: ACCENT_BLUE, fontFace: 'Arial'
});

addFooter(slide4, 4);
slide4.addNotes(`SLIDE 4 SPEAKER SCRIPT:
"FoodLine is like an airport boarding pass for your lunch. You pre-book, you arrive, you show your pass, and you pick up your hot snack without waiting a single minute.

Students order during the last 5 minutes of class, pay upfront via UPI, and simply walk up to Counter 2, flash the 4-digit code, and grab their fresh meal in 30 seconds."`);


// ==============================================================================
// SLIDE 5: HOW IT WORKS IN 3 EASY STEPS
// ==============================================================================
let slide5 = pptx.addSlide();
slide5.background = { color: BG_COLOR };
addHeader(slide5, 'FRICTIONLESS FLOW', '3 Simple Steps: From Pocket to Plate', '"As easy and natural as sending a WhatsApp message."');

const steps = [
  {
    step: 'STEP 01',
    badge: 'TAP & ORDER',
    loc: 'In Classroom / Hostel',
    color: PRIMARY_GREEN,
    tint: LIGHT_GREEN,
    border: BORDER_GREEN,
    bullets: [
      'Student opens FoodLine on phone browser or Android app.',
      'Browses live canteen menu (Sandwiches, Dabeli, Misal, Chai).',
      'Selects their specific break time slot (e.g., 1:15 PM).',
      'Pre-pays with one tap via UPI (GPay, PhonePe, Paytm).'
    ]
  },
  {
    step: 'STEP 02',
    badge: 'COOK & PACK',
    loc: 'Inside Canteen Kitchen',
    color: ACCENT_BLUE,
    tint: LIGHT_BLUE,
    border: BORDER_BLUE,
    bullets: [
      'Kitchen tablet screen receives clear, color-coded ticket.',
      'Cook prepares and packs food 5-10 minutes ahead of rush.',
      'Cook taps "READY" button on the kitchen display tablet.',
      'Student gets automated instant alert: "Meal ready at Counter 2!"'
    ]
  },
  {
    step: 'STEP 03',
    badge: 'FLASH & GRAB',
    loc: 'At Express Pickup Counter',
    color: ACCENT_AMBER,
    tint: LIGHT_AMBER,
    border: BORDER_AMBER,
    bullets: [
      'Student walks straight to dedicated FoodLine express counter.',
      'Shows 4-digit OTP or digital QR code on phone.',
      'Staff hands over hot, packed meal in under 30 seconds.',
      'Zero lines, zero waiting, zero friction. Food enjoyed on time!'
    ]
  }
];

steps.forEach((s, idx) => {
  const x = 0.8 + (idx * 4.0);
  slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 1.9, w: 3.7, h: 4.0,
    fill: { color: 'FFFFFF' }, line: { color: s.border, width: 1.5 }, rectRadius: 0.12
  });

  // Step Number Badge
  slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.3, y: 2.1, w: 1.4, h: 0.32,
    fill: { color: s.tint }, line: { color: s.border, width: 1 }, rectRadius: 0.08
  });
  slide5.addText(s.step, {
    x: x + 0.3, y: 2.1, w: 1.4, h: 0.32,
    fontSize: 10, bold: true, color: s.color, align: 'center', fontFace: 'Arial'
  });

  // Location Tag
  slide5.addText(s.loc, {
    x: x + 1.8, y: 2.1, w: 1.6, h: 0.32,
    fontSize: 9, color: TEXT_MUTED, align: 'right', fontFace: 'Arial'
  });

  // Step Title
  slide5.addText(s.badge, {
    x: x + 0.3, y: 2.55, w: 3.1, h: 0.45,
    fontSize: 18, bold: true, color: TEXT_DARK, fontFace: 'Arial'
  });

  // Bullets
  const bulletText = s.bullets.map(b => `• ${b}`).join('\n\n');
  slide5.addText(bulletText, {
    x: x + 0.3, y: 3.1, w: 3.1, h: 2.6,
    fontSize: 11, color: TEXT_BODY, fontFace: 'Arial', lineSpacingMultiple: 1.15
  });
});

// Bottom Flow Indicator Bar
slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 6.05, w: 11.7, h: 0.8,
  fill: { color: 'FFFFFF' }, line: { color: CARD_BORDER, width: 1 }, rectRadius: 0.1
});
slide5.addText('TOTAL TURNAROUND COMPARISON:', {
  x: 1.1, y: 6.15, w: 3.5, h: 0.25,
  fontSize: 10, bold: true, color: PRIMARY_GREEN, fontFace: 'Arial'
});
slide5.addText('Traditional Manual Counter: 18+ Minutes in Chaos  ➔  FoodLine Campus Rail: 30 Seconds Express Pickup', {
  x: 1.1, y: 6.4, w: 11.1, h: 0.35,
  fontSize: 13, bold: true, color: TEXT_DARK, fontFace: 'Arial'
});

addFooter(slide5, 5);
slide5.addNotes(`SLIDE 5 SPEAKER SCRIPT:
"Step 1: You choose what you want to eat while in class.
Step 2: The kitchen packs it while you walk over to the canteen.
Step 3: You grab your food in 30 seconds and eat peacefully.

It is completely frictionless for both the student and the kitchen team."`);


// ==============================================================================
// SLIDE 6: FOR CANTEEN MANAGERS — NO MORE KITCHEN PANIC
// ==============================================================================
let slide6 = pptx.addSlide();
slide6.background = { color: BG_COLOR };
addHeader(slide6, 'KITCHEN CAPACITY MANAGEMENT', 'Peace in the Kitchen: Smart Slot Throttling', '"Never get overwhelmed by 200 orders shouting at your counter all at once."');

// Left: Uncontrolled Rush (Red Card)
slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.9, w: 5.7, h: 3.8,
  fill: { color: LIGHT_RED }, line: { color: BORDER_RED, width: 1.5 }, rectRadius: 0.12
});
slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 1.1, y: 2.1, w: 3.2, h: 0.32,
  fill: { color: 'FFFFFF' }, line: { color: BORDER_RED, width: 1 }, rectRadius: 0.08
});
slide6.addText('UNCONTROLLED COUNTER RUSH', {
  x: 1.1, y: 2.1, w: 3.2, h: 0.32,
  fontSize: 10, bold: true, color: ACCENT_RED, align: 'center', fontFace: 'Arial'
});

slide6.addText('• 100+ students push and scream at 1:05 PM at the exact same minute.\n\n• Grill and sandwich toasters hit bottleneck; wait times balloon to 25+ minutes.\n\n• Kitchen helpers panic, items burn, orders get mixed up, customer disputes flare.\n\n• Leftover over-preparation leads to food spoilage and wasted inventory expenses.', {
  x: 1.1, y: 2.6, w: 5.1, h: 2.9,
  fontSize: 12, color: TEXT_DARK, fontFace: 'Arial', lineSpacingMultiple: 1.2
});

// Right: FoodLine Smart Capacity Throttling (Emerald Card)
slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.8, y: 1.9, w: 5.7, h: 3.8,
  fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1.5 }, rectRadius: 0.12
});
slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.1, y: 2.1, w: 3.6, h: 0.32,
  fill: { color: 'FFFFFF' }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.08
});
slide6.addText('FOODLINE SMART CAPACITY THROTTLING', {
  x: 7.1, y: 2.1, w: 3.6, h: 0.32,
  fontSize: 10, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: 'Arial'
});

slide6.addText('• Built-In Grill Limits: If the kitchen grill can only toast 30 sandwiches in 10 minutes, FoodLine only accepts 30 orders for that slot.\n\n• Automatic Slot Shifting: Once a slot reaches 100% capacity, the app automatically guides next orders to the subsequent 10-minute break window.\n\n• 20-Minute Head-Start: Chefs see exact batch requirements 20 minutes before the rush.\n\n• Zero Food Waste: Kitchen cooks exactly what is confirmed and pre-paid.', {
  x: 7.1, y: 2.6, w: 5.1, h: 2.9,
  fontSize: 12, color: TEXT_DARK, fontFace: 'Arial', lineSpacingMultiple: 1.2
});

// Bottom Insight Card
slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 5.85, w: 11.7, h: 1.0,
  fill: { color: 'FFFFFF' }, line: { color: CARD_BORDER, width: 1 }, rectRadius: 0.1
});
slide6.addText('THE KITCHEN TRAFFIC POLICE:', {
  x: 1.1, y: 5.95, w: 11.1, h: 0.25,
  fontSize: 11, bold: true, color: PRIMARY_GREEN, fontFace: 'Arial'
});
slide6.addText('"To our canteen managers: FoodLine stops the 1:05 PM screaming rush. The software acts like a smart traffic police officer, letting in only as many orders as your kitchen equipment can cook comfortably."', {
  x: 1.1, y: 6.25, w: 11.1, h: 0.45,
  fontSize: 13, bold: true, color: TEXT_DARK, fontFace: 'Arial'
});

addFooter(slide6, 6);
slide6.addNotes(`SLIDE 6 SPEAKER SCRIPT:
"To our canteen managers: You know that feeling when 100 students scream at your counter at 1:05 PM? FoodLine stops that. The app acts like a smart traffic police officer, letting in only as many orders as your kitchen can cook comfortably.

If your grill can only make 30 sandwiches in 10 minutes, the app caps the slot at 30. No more burnt food, no panic, and zero food wastage."`);


// ==============================================================================
// SLIDE 7: FOR CANTEEN MANAGERS — ZERO UPI FRAUD
// ==============================================================================
let slide7 = pptx.addSlide();
slide7.background = { color: BG_COLOR };
addHeader(slide7, 'FINANCIAL INTEGRITY & RECONCILIATION', '100% Guaranteed Money: Zero Fake Screenshots', '"Every single rupee is bank-verified before the cook even touches the pan."');

// Left Box: The Old Scam
slide7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.9, w: 5.7, h: 3.8,
  fill: { color: LIGHT_RED }, line: { color: BORDER_RED, width: 1.5 }, rectRadius: 0.12
});
slide7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 1.1, y: 2.1, w: 3.5, h: 0.32,
  fill: { color: 'FFFFFF' }, line: { color: BORDER_RED, width: 1 }, rectRadius: 0.08
});
slide7.addText('THE CANTEEN FRAUD PROBLEM', {
  x: 1.1, y: 2.1, w: 3.5, h: 0.32,
  fontSize: 10, bold: true, color: ACCENT_RED, align: 'center', fontFace: 'Arial'
});

slide7.addText('Fake Gallery Screenshots\nIn dense crowds, dishonest students show fake payment screenshots or old video recordings from their phone gallery.\n\nStaff Under Pressure\n"Bhaiya paise bhej diye!" Staff has zero time to check bank SMS alerts on their phone while 50 students push at the counter.\n\nThe Weekly Cash Loss\nBusy college canteens lose ₹1,000 to ₹3,000 every single week to undetected fake payment tricks.', {
  x: 1.1, y: 2.55, w: 5.1, h: 3.0,
  fontSize: 12, color: TEXT_DARK, fontFace: 'Arial', lineSpacingMultiple: 1.15
});

// Right Box: The FoodLine Shield
slide7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.8, y: 1.9, w: 5.7, h: 3.8,
  fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1.5 }, rectRadius: 0.12
});
slide7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.1, y: 2.1, w: 3.8, h: 0.32,
  fill: { color: 'FFFFFF' }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.08
});
slide7.addText('THE FOODLINE ANTI-FRAUD SHIELD', {
  x: 7.1, y: 2.1, w: 3.8, h: 0.32,
  fontSize: 10, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: 'Arial'
});

slide7.addText('12-Digit Bank Reference (UTR) Match\nEvery order requires a valid 12-digit UTR reference code issued directly by the banking system.\n\nReplay Attack Prevention\nFoodLine tracks every reference code in a secure cryptographic log. If the same UTR is submitted twice, it is instantly blocked.\n\nZero Ticket Without Real Money\nIf the payment isn\'t verified and settled, the kitchen ticket is physically NEVER spawned. No guesswork, 100% money in bank.', {
  x: 7.1, y: 2.55, w: 5.1, h: 3.0,
  fontSize: 12, color: TEXT_DARK, fontFace: 'Arial', lineSpacingMultiple: 1.15
});

// Bottom Callout
slide7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 5.85, w: 11.7, h: 1.0,
  fill: { color: 'FFFFFF' }, line: { color: CARD_BORDER, width: 1 }, rectRadius: 0.1
});
slide7.addText('ZERO SCREENSHOT NONSENSE:', {
  x: 1.1, y: 5.95, w: 11.1, h: 0.25,
  fontSize: 11, bold: true, color: PRIMARY_GREEN, fontFace: 'Arial'
});
slide7.addText('"No more students holding up their phone in a crowd claiming \'Bhaiya, paise bhej diye!\' while showing an old screenshot. With FoodLine, if the money isn\'t safely in the canteen\'s bank account, the food does not get cooked."', {
  x: 1.1, y: 6.25, w: 11.1, h: 0.45,
  fontSize: 13, bold: true, color: TEXT_DARK, fontFace: 'Arial'
});

addFooter(slide7, 7);
slide7.addNotes(`SLIDE 7 SPEAKER SCRIPT:
"No more students holding up their phone in a crowd claiming 'Bhaiya, paise bhej diye!' while showing an old screenshot.

With FoodLine, every order requires a real 12-digit bank reference. If someone tries to reuse an old transaction ID, our system immediately rejects it. If the money isn't safely confirmed in the canteen's account, the kitchen ticket is not even created."`);


// ==============================================================================
// SLIDE 8: THE LIVE KITCHEN DISPLAY SCREEN (KDS)
// ==============================================================================
let slide8 = pptx.addSlide();
slide8.background = { color: BG_COLOR };
addHeader(slide8, 'OPERATIONAL EXCELLENCE', 'The Live Kitchen Display Screen (KDS)', '"Clean, big, color-coded buttons that any kitchen helper can use in 2 minutes."');

// 3 Ticket Cards (Mockup of KDS)
const kdsTickets = [
  {
    status: 'PREPARING (COOKING)',
    ticket: '#1042',
    time: 'Slot: 1:15 PM (4 min left)',
    items: '2x Bun Maska\n1x Special Masala Chai',
    action: 'TAP TO MARK READY',
    actionBg: ACCENT_AMBER,
    tint: LIGHT_AMBER,
    border: BORDER_AMBER,
    color: ACCENT_AMBER
  },
  {
    status: 'READY FOR PICKUP',
    ticket: '#1040',
    time: 'OTP: 5197 (Counter 2)',
    items: '1x Cheese Grill Sandwich\n1x Cold Coffee (Bottled)',
    action: 'AUTO-NOTIFIED VIA APP',
    actionBg: PRIMARY_GREEN,
    tint: LIGHT_GREEN,
    border: BORDER_GREEN,
    color: PRIMARY_GREEN
  },
  {
    status: 'COLLECTED & COMPLETED',
    ticket: '#1038',
    time: 'Collected in 22 seconds',
    items: '1x Special Misal Pav\n1x Sweet Lassi',
    action: 'LOGGED IN DAILY LEDGER',
    actionBg: '64748B',
    tint: 'F1F5F9',
    border: 'CBD5E1',
    color: TEXT_MUTED
  }
];

kdsTickets.forEach((t, idx) => {
  const x = 0.8 + (idx * 4.0);
  slide8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 1.9, w: 3.7, h: 3.8,
    fill: { color: 'FFFFFF' }, line: { color: t.border, width: 1.5 }, rectRadius: 0.12
  });

  // Ticket Header
  slide8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.3, y: 2.1, w: 3.1, h: 0.35,
    fill: { color: t.tint }, line: { color: t.border, width: 1 }, rectRadius: 0.08
  });
  slide8.addText(t.status, {
    x: x + 0.3, y: 2.1, w: 3.1, h: 0.35,
    fontSize: 10, bold: true, color: t.color, align: 'center', fontFace: 'Arial'
  });

  // Ticket Number & Timing
  slide8.addText(`Ticket ${t.ticket}`, {
    x: x + 0.3, y: 2.6, w: 3.1, h: 0.35,
    fontSize: 18, bold: true, color: TEXT_DARK, fontFace: 'Arial'
  });
  slide8.addText(t.time, {
    x: x + 0.3, y: 2.95, w: 3.1, h: 0.25,
    fontSize: 10, bold: true, color: t.color, fontFace: 'Arial'
  });

  // Items List
  slide8.addText('ORDER ITEMS:', {
    x: x + 0.3, y: 3.3, w: 3.1, h: 0.25,
    fontSize: 9, bold: true, color: TEXT_MUTED, fontFace: 'Arial'
  });
  slide8.addText(t.items, {
    x: x + 0.3, y: 3.55, w: 3.1, h: 1.2,
    fontSize: 13, bold: true, color: TEXT_DARK, fontFace: 'Arial', lineSpacingMultiple: 1.2
  });

  // Action Button
  slide8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.3, y: 4.95, w: 3.1, h: 0.55,
    fill: { color: t.actionBg }, line: { color: t.actionBg }, rectRadius: 0.08
  });
  slide8.addText(t.action, {
    x: x + 0.3, y: 4.95, w: 3.1, h: 0.55,
    fontSize: 11, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Arial'
  });
});

// Bottom 3 Feature Pills
const kdsPills = [
  '⚡ Large 1-Tap Buttons: Helpers with wet hands can tap a 10" tablet screen with zero errors',
  '📄 Zero Paper Receipts: No missing slips of paper or tokens blowing away in kitchen wind',
  '🌐 Multi-Language Ready: Simple Hindi, Marathi & English UI for kitchen helper ease'
];

kdsPills.forEach((pill, idx) => {
  const x = 0.8 + (idx * 4.0);
  slide8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 5.9, w: 3.7, h: 0.9,
    fill: { color: 'FFFFFF' }, line: { color: CARD_BORDER, width: 1 }, rectRadius: 0.08
  });
  slide8.addText(pill, {
    x: x + 0.2, y: 5.95, w: 3.3, h: 0.8,
    fontSize: 10, color: TEXT_BODY, fontFace: 'Arial'
  });
});

addFooter(slide8, 8);
slide8.addNotes(`SLIDE 8 SPEAKER SCRIPT:
"The staff doesn't need to learn complicated computers. It's just two big buttons: 'Cooking' and 'Ready'.

When the cook taps 'Ready', the student's phone automatically beeps to tell them to come pick it up at Counter 2. No lost paper slips, no confusion."`);


// ==============================================================================
// SLIDE 9: FOR FINANCERS — THE BUSINESS MODEL & REVENUE
// ==============================================================================
let slide9 = pptx.addSlide();
slide9.background = { color: BG_COLOR };
addHeader(slide9, 'FINANCIAL ARCHITECTURE', 'How FoodLine Makes Money: High Volume, Zero Inventory', '"High daily transaction volume, zero inventory risk, and predictable campus cash flow."');

const revPillars = [
  {
    num: 'PILLAR 01',
    title: 'Micro-Convenience Fee',
    subtitle: 'Paid by Students per Order',
    highlight: '₹2 to ₹3 / order',
    desc: 'Students happily pay a tiny ₹2 to ₹3 convenience fee to skip 20 minutes of standing in chaotic lines.\n\nDaily Math:\n3,000 orders/day × ₹2.50 avg fee\n= ₹7,500 daily revenue\n= ₹1.87 Lakhs monthly platform revenue from just ONE campus!',
    tint: LIGHT_GREEN,
    border: BORDER_GREEN,
    color: PRIMARY_GREEN
  },
  {
    num: 'PILLAR 02',
    title: 'Canteen SaaS & Commission',
    subtitle: 'Paid by Canteen Operators',
    highlight: '3% - 5% Commission',
    desc: 'Canteens pay a small software commission because FoodLine boosts their daily order processing capacity by 40%.\n\nTurnover Growth:\nFaster counter throughput generates ₹35,000+ extra monthly net profit for the canteen owner with zero extra staff.',
    tint: LIGHT_BLUE,
    border: BORDER_BLUE,
    color: ACCENT_BLUE
  },
  {
    num: 'PILLAR 03',
    title: 'Campus Brand Partnerships',
    subtitle: 'Sponsored Perks & Sampling',
    highlight: '100% Asset-Light',
    desc: 'National FMCG brands, beverage giants, and campus student deals pay for featured slots and coupon drops.\n\nZero Fleet Capex:\nZero delivery bikes, zero fuel bills, zero drivers to insure. FoodLine is a 100% asset-light software rail connecting students to kitchens.',
    tint: LIGHT_AMBER,
    border: BORDER_AMBER,
    color: ACCENT_AMBER
  }
];

revPillars.forEach((p, idx) => {
  const x = 0.8 + (idx * 4.0);
  slide9.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 1.9, w: 3.7, h: 4.85,
    fill: { color: 'FFFFFF' }, line: { color: p.border, width: 1.5 }, rectRadius: 0.12
  });

  slide9.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.3, y: 2.1, w: 1.5, h: 0.3,
    fill: { color: p.tint }, line: { color: p.border, width: 1 }, rectRadius: 0.08
  });
  slide9.addText(p.num, {
    x: x + 0.3, y: 2.1, w: 1.5, h: 0.3,
    fontSize: 9, bold: true, color: p.color, align: 'center', fontFace: 'Arial'
  });

  slide9.addText(p.title, {
    x: x + 0.3, y: 2.5, w: 3.1, h: 0.35,
    fontSize: 16, bold: true, color: TEXT_DARK, fontFace: 'Arial'
  });
  slide9.addText(p.subtitle, {
    x: x + 0.3, y: 2.85, w: 3.1, h: 0.25,
    fontSize: 10, color: TEXT_MUTED, fontFace: 'Arial'
  });

  slide9.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.3, y: 3.2, w: 3.1, h: 0.45,
    fill: { color: p.tint }, line: { color: p.border, width: 1 }, rectRadius: 0.08
  });
  slide9.addText(p.highlight, {
    x: x + 0.3, y: 3.2, w: 3.1, h: 0.45,
    fontSize: 14, bold: true, color: p.color, align: 'center', fontFace: 'Arial'
  });

  slide9.addText(p.desc, {
    x: x + 0.3, y: 3.8, w: 3.1, h: 2.7,
    fontSize: 11, color: TEXT_BODY, fontFace: 'Arial', lineSpacingMultiple: 1.15
  });
});

addFooter(slide9, 9);
slide9.addNotes(`SLIDE 9 SPEAKER SCRIPT:
"For our financial partners: FoodLine does not own kitchens, buy vegetables, or pay bike riders. We are an asset-light software rail.

With 3,000 orders every day on a single campus, saving students 20 minutes creates a high-margin, sticky daily revenue stream across micro-convenience fees, canteen revenue shares, and brand sponsorships."`);


// ==============================================================================
// SLIDE 10: UNIT ECONOMICS (ONE CAMPUS BENCHMARK)
// ==============================================================================
let slide10 = pptx.addSlide();
slide10.background = { color: BG_COLOR };
addHeader(slide10, 'PROVEN UNIT ECONOMICS', 'The Math Behind the Campus Model (Single Campus Benchmark)', '"Real numbers modeled from a typical 5,000 to 8,000 student university campus."');

// Left Table: Financial Metrics
const tableData = [
  [
    { text: 'CAMPUS OPERATIONAL METRIC', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: 'BENCHMARK VALUE', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'right' } }
  ],
  [
    { text: 'Total Students on Campus', options: { color: TEXT_DARK, bold: true } },
    { text: '5,000 – 8,000 Students', options: { color: TEXT_BODY, align: 'right' } }
  ],
  [
    { text: 'Daily Food & Snack Orders', options: { color: TEXT_DARK, bold: true } },
    { text: '2,500 Orders / Day', options: { color: TEXT_BODY, align: 'right' } }
  ],
  [
    { text: 'Average Order Value (AOV)', options: { color: TEXT_DARK, bold: true } },
    { text: '₹45 (Tea, Vada Pav, Thali, Sandwich)', options: { color: TEXT_BODY, align: 'right' } }
  ],
  [
    { text: 'Daily Gross Merchandise Value (GMV)', options: { color: TEXT_DARK, bold: true } },
    { text: '₹1,12,500 / Day', options: { color: PRIMARY_GREEN, bold: true, align: 'right' } }
  ],
  [
    { text: 'Monthly Platform GMV (25 operational days)', options: { color: TEXT_DARK, bold: true } },
    { text: '₹28,12,500 / Month', options: { color: PRIMARY_GREEN, bold: true, align: 'right' } }
  ],
  [
    { text: 'Monthly Platform Revenue (Fees + SaaS)', options: { color: TEXT_DARK, bold: true } },
    { text: '₹1,50,000 – ₹2,25,000 / Campus', options: { color: PRIMARY_GREEN, bold: true, align: 'right' } }
  ]
];

slide10.addTable(tableData, {
  x: 0.8, y: 1.9, w: 6.8, h: 3.5,
  colW: [3.8, 3.0],
  rowH: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  border: { color: CARD_BORDER, width: 1 },
  fill: { color: 'FFFFFF' },
  fontSize: 11,
  fontFace: 'Arial'
});

// Left Table Note
slide10.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 5.6, w: 6.8, h: 1.15,
  fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.1
});
slide10.addText('HIGH-FREQUENCY CAPTIVE AUDIENCE:', {
  x: 1.0, y: 5.7, w: 6.4, h: 0.25,
  fontSize: 10, bold: true, color: PRIMARY_GREEN, fontFace: 'Arial'
});
slide10.addText('College students attend campus 22 to 26 days per month and eat 2 to 3 times per day. Unlike city apps with volatile retention, campus density ensures immediate organic repeat usage without costly discount subsidies.', {
  x: 1.0, y: 5.95, w: 6.4, h: 0.7,
  fontSize: 11, color: TEXT_BODY, fontFace: 'Arial'
});

// Right Column: Capex & Expansion Horizon
slide10.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.9, y: 1.9, w: 4.6, h: 4.85,
  fill: { color: 'FFFFFF' }, line: { color: CARD_BORDER, width: 1.5 }, rectRadius: 0.12
});

slide10.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 8.2, y: 2.15, w: 4.0, h: 0.35,
  fill: { color: LIGHT_AMBER }, line: { color: BORDER_AMBER, width: 1 }, rectRadius: 0.08
});
slide10.addText('CAPEX & CAPITAL EFFICIENCY', {
  x: 8.2, y: 2.15, w: 4.0, h: 0.35,
  fontSize: 10, bold: true, color: ACCENT_AMBER, align: 'center', fontFace: 'Arial'
});

const capexItems = [
  { label: 'Kitchen Hardware Setup:', val: 'Under ₹15,000 (1 Android Tablet + Soundbox)' },
  { label: 'Customer Acquisition Cost:', val: 'Near ₹0 (Physical campus posters & word-of-mouth)' },
  { label: 'Kitchen Payback Period:', val: 'Under 30 Days per outlet!' },
  { label: 'Gross Margin on Platform Fees:', val: '88% – 92% (Asset-light software rail)' },
  { label: '50-Campus Scale Projection:', val: '₹75 Lakhs – ₹1.1 Crore Monthly Revenue' }
];

capexItems.forEach((ci, idx) => {
  const y = 2.65 + (idx * 0.75);
  slide10.addText(ci.label, {
    x: 8.2, y: y, w: 4.0, h: 0.25,
    fontSize: 10, bold: true, color: TEXT_MUTED, fontFace: 'Arial'
  });
  slide10.addText(ci.val, {
    x: 8.2, y: y + 0.25, w: 4.0, h: 0.45,
    fontSize: 12, bold: true, color: TEXT_DARK, fontFace: 'Arial'
  });
});

slide10.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 8.2, y: 6.0, w: 4.0, h: 0.55,
  fill: { color: PRIMARY_GREEN }, line: { color: PRIMARY_GREEN }, rectRadius: 0.08
});
slide10.addText('⚡ Payback Period: Under 30 Days', {
  x: 8.2, y: 6.0, w: 4.0, h: 0.55,
  fontSize: 12, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Arial'
});

addFooter(slide10, 10);
slide10.addNotes(`SLIDE 10 SPEAKER SCRIPT:
"Here is the simple math: A university campus is a captive audience. Students eat 2 to 3 times a day, 25 days a month.

Because the hardware cost per kitchen is so tiny (just one tablet and soundbox under ₹15,000), every single new campus becomes profitable in its very first month. At 50 campuses, this is a ₹1 Crore monthly run-rate business."`);


// ==============================================================================
// SLIDE 11: FULLY BUILT, TESTED & PRODUCTION-READY
// ==============================================================================
let slide11 = pptx.addSlide();
slide11.background = { color: BG_COLOR };
addHeader(slide11, 'ENGINEERING MATURITY', 'Not an Idea — A Working Reality', '"Tested, battle-hardened, and ready to launch at the canteen counter tomorrow morning."');

// 4 Architecture Proof Cards (2x2 Grid)
const techCards = [
  {
    badge: 'FRONTEND & MOBILE',
    title: 'Production Web App & Android APK',
    desc: '• High-speed Next.js 15 responsive PWA application\n• Installable Android APK built for spotty campus 4G\n• Instant QR menu navigation with zero app install required\n• Sub-second client-side optimistic UI state transitions',
    color: PRIMARY_GREEN,
    tint: LIGHT_GREEN,
    border: BORDER_GREEN
  },
  {
    badge: 'KITCHEN AUTOMATION',
    title: 'Live Kitchen Display System (KDS)',
    desc: '• Real-time SSE event streaming for zero-latency orders\n• Instant audio chimes alert chefs when new tickets arrive\n• 1-Tap status updates: Cooking ➔ Ready ➔ Collected\n• Live kitchen capacity monitoring and slot throttle gauges',
    color: ACCENT_BLUE,
    tint: LIGHT_BLUE,
    border: BORDER_BLUE
  },
  {
    badge: 'SECURITY ASSURANCE',
    title: '23/23 Automated Security Audits Passed',
    desc: '• Cryptographic protection against fake UPI replay attacks\n• SHA-256 integrity checks on every transaction token\n• Strict CORS boundaries, rate-limiting, and sanitized inputs\n• Zero vulnerability to screen tampering or ticket forging',
    color: ACCENT_RED,
    tint: LIGHT_RED,
    border: BORDER_RED
  },
  {
    badge: 'DATA REDUNDANCY',
    title: 'PostgreSQL + Google Sheets Dual-Sync',
    desc: '• Enterprise Supabase PostgreSQL transactional database\n• Real-time two-way synchronization to Google Sheets\n• Zero-training interface for canteen owners to check sales\n• Full offline resilience during intermittent campus Wi-Fi',
    color: ACCENT_AMBER,
    tint: LIGHT_AMBER,
    border: BORDER_AMBER
  }
];

techCards.forEach((tc, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + (col * 6.0);
  const y = 1.9 + (row * 2.45);

  slide11.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: y, w: 5.7, h: 2.25,
    fill: { color: 'FFFFFF' }, line: { color: tc.border, width: 1.5 }, rectRadius: 0.12
  });

  slide11.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.3, y: y + 0.18, w: 2.8, h: 0.28,
    fill: { color: tc.tint }, line: { color: tc.border, width: 1 }, rectRadius: 0.08
  });
  slide11.addText(tc.badge, {
    x: x + 0.3, y: y + 0.18, w: 2.8, h: 0.28,
    fontSize: 9, bold: true, color: tc.color, align: 'center', fontFace: 'Arial'
  });

  slide11.addText(tc.title, {
    x: x + 0.3, y: y + 0.52, w: 5.1, h: 0.35,
    fontSize: 14, bold: true, color: TEXT_DARK, fontFace: 'Arial'
  });

  slide11.addText(tc.desc, {
    x: x + 0.3, y: y + 0.9, w: 5.1, h: 1.25,
    fontSize: 11, color: TEXT_BODY, fontFace: 'Arial', lineSpacingMultiple: 1.15
  });
});

addFooter(slide11, 11);
slide11.addNotes(`SLIDE 11 SPEAKER SCRIPT:
"We are not here with just a slide deck and an idea. The software is completely coded, tested with 23 automated security audits, and ready for deployment at the canteen tomorrow.

We have a live Android APK, a fast web app, a Kitchen Display System, and dual-sync architecture that keeps working even if campus Wi-Fi fluctuates."`);


// ==============================================================================
// SLIDE 12: THE WIN-WIN SUMMARY & NEXT STEPS
// ==============================================================================
let slide12 = pptx.addSlide();
slide12.background = { color: BG_COLOR };
addHeader(slide12, 'THE WIN-WIN ECOSYSTEM', 'Everyone Wins with FoodLine Campus', '"Happy Students, Relaxed Canteen Owners, High-Growth Business."');

// 3 Stakeholder Cards
const stakeholders = [
  {
    tag: 'FOR STUDENTS',
    title: 'Zero Queue Anxiety',
    bullets: [
      'Bypass 20-minute counter lines completely.',
      'Enjoy hot, freshly prepared food every break.',
      'Never arrive late to lectures or skip lunch.'
    ],
    tint: LIGHT_GREEN,
    border: BORDER_GREEN,
    color: PRIMARY_GREEN
  },
  {
    tag: 'FOR CANTEEN OWNERS',
    title: 'Higher Profits & Peace',
    bullets: [
      'Zero 1:05 PM crowd screaming chaos.',
      '40% more daily order processing volume.',
      '100% fraud-proof, guaranteed UPI payments.'
    ],
    tint: LIGHT_BLUE,
    border: BORDER_BLUE,
    color: ACCENT_BLUE
  },
  {
    tag: 'FOR INVESTORS',
    title: 'High-Margin Scale Rail',
    bullets: [
      '100% Asset-light, zero delivery fleet overhead.',
      'Captive audience with high daily repeat usage.',
      'Ready to replicate across 500+ college campuses.'
    ],
    tint: LIGHT_AMBER,
    border: BORDER_AMBER,
    color: ACCENT_AMBER
  }
];

stakeholders.forEach((sh, idx) => {
  const x = 0.8 + (idx * 4.0);
  slide12.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 1.9, w: 3.7, h: 2.8,
    fill: { color: 'FFFFFF' }, line: { color: sh.border, width: 1.5 }, rectRadius: 0.12
  });

  slide12.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.3, y: 2.1, w: 2.2, h: 0.3,
    fill: { color: sh.tint }, line: { color: sh.border, width: 1 }, rectRadius: 0.08
  });
  slide12.addText(sh.tag, {
    x: x + 0.3, y: 2.1, w: 2.2, h: 0.3,
    fontSize: 9, bold: true, color: sh.color, align: 'center', fontFace: 'Arial'
  });

  slide12.addText(sh.title, {
    x: x + 0.3, y: 2.5, w: 3.1, h: 0.35,
    fontSize: 16, bold: true, color: TEXT_DARK, fontFace: 'Arial'
  });

  const bText = sh.bullets.map(b => `• ${b}`).join('\n\n');
  slide12.addText(bText, {
    x: x + 0.3, y: 2.95, w: 3.1, h: 1.6,
    fontSize: 11, color: TEXT_BODY, fontFace: 'Arial', lineSpacingMultiple: 1.15
  });
});

// Big Call to Action Banner
slide12.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 4.9, w: 11.7, h: 1.95,
  fill: { color: LIGHT_GREEN }, line: { color: PRIMARY_GREEN, width: 2 }, rectRadius: 0.15
});

slide12.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 1.1, y: 5.1, w: 3.5, h: 0.32,
  fill: { color: 'FFFFFF' }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.08
});
slide12.addText('PILOT LAUNCH: SANJIVANI UNIVERSITY', {
  x: 1.1, y: 5.1, w: 3.5, h: 0.32,
  fontSize: 10, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: 'Arial'
});

slide12.addText('Pilot Launch Outlet: Cafe @7 (Engineering & MBA Campus)', {
  x: 1.1, y: 5.5, w: 11.1, h: 0.35,
  fontSize: 18, bold: true, color: TEXT_DARK, fontFace: 'Arial'
});

slide12.addText('Target: 1,500+ Daily Express Meals • 10-Minute Canteen Staff Onboarding • Immediate Positive Unit Cashflow', {
  x: 1.1, y: 5.9, w: 11.1, h: 0.3,
  fontSize: 12, color: TEXT_BODY, fontFace: 'Arial'
});

slide12.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 1.1, y: 6.3, w: 5.5, h: 0.45,
  fill: { color: PRIMARY_GREEN }, line: { color: PRIMARY_GREEN }, rectRadius: 0.08
});
slide12.addText('🚀 Let\'s Power the Future of Campus Dining Together', {
  x: 1.1, y: 6.3, w: 5.5, h: 0.45,
  fontSize: 12, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Arial'
});

slide12.addText('Contact: Shivam & FoodLine Core Team • foodlinecampus@gmail.com', {
  x: 6.8, y: 6.35, w: 5.4, h: 0.35,
  fontSize: 11, bold: true, color: PRIMARY_GREEN, align: 'right', fontFace: 'Arial'
});

addFooter(slide12, 12);
slide12.addNotes(`SLIDE 12 SPEAKER SCRIPT:
"FoodLine makes life better for the student, makes more money for the canteen owner, and creates a reliable, fast-growing business for our investors.

Our pilot is ready for rollout at Sanjivani University's Cafe @7 outlet. Let's make campus lunchtime simple, stress-free, and profitable together. Thank you!"`);


// ==============================================================================
// SAVE FILE
// ==============================================================================
const OUTPUT_FILE = path.join(__dirname, '../FoodLine_Campus_Master_Pitch_Deck.pptx');

pptx.writeFile({ fileName: OUTPUT_FILE })
  .then(fileName => {
    console.log(`✅ Pitch Deck PPTX successfully created at: ${fileName}`);
  })
  .catch(err => {
    console.error('❌ Error generating PPTX:', err);
    process.exit(1);
  });
