const PptxGenJS = require('../frontend/node_modules/pptxgenjs');
const fs = require('fs');
const path = require('path');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 13.333" x 7.5" 16:9 Widescreen

// -------------------------------------------------------------
// DESIGN PALETTE: Ultra-Clean, Simple Executive Theme
// Large typography, high contrast, generous whitespace
// -------------------------------------------------------------
const FONT_HEAD = 'Outfit';
const FONT_BODY = 'Segoe UI';

const BG_COLOR = 'F8FAFC';
const CARD_BG = 'FFFFFF';
const CARD_BORDER = 'E2E8F0';
const TEXT_DARK = '0F172A';
const TEXT_BODY = '334155';
const TEXT_MUTED = '64748B';

const PRIMARY_GREEN = '059669';
const ACCENT_GREEN = '10B981';
const LIGHT_GREEN = 'ECFDF5';
const BORDER_GREEN = 'A7F3D0';

const ACCENT_BLUE = '2563EB';
const LIGHT_BLUE = 'EFF6FF';
const BORDER_BLUE = 'BFDBFE';

const ACCENT_AMBER = 'D97706';
const LIGHT_AMBER = 'FFFBEB';
const BORDER_AMBER = 'FDE68A';

const ACCENT_RED = 'DC2626';
const LIGHT_RED = 'FEF2F2';
const BORDER_RED = 'FECACA';

const LOGO_PATH = path.join(__dirname, '../foodline-campus-logo.png');
const HAS_LOGO = fs.existsSync(LOGO_PATH);

// Simple header helper
function addHeader(slide, kicker, title) {
  // Category Kicker
  slide.addText(kicker.toUpperCase(), {
    x: 0.8, y: 0.5, w: 7.0, h: 0.3,
    fontSize: 11, bold: true, color: PRIMARY_GREEN, fontFace: FONT_HEAD
  });

  // Top right simple label
  slide.addText('FOODLINE CAMPUS', {
    x: 8.5, y: 0.5, w: 4.0, h: 0.3,
    fontSize: 10, bold: true, color: TEXT_MUTED, align: 'right', fontFace: FONT_HEAD
  });

  // Main Slide Title
  slide.addText(title, {
    x: 0.8, y: 0.85, w: 11.7, h: 0.65,
    fontSize: 26, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
  });
}

// Simple footer helper
function addFooter(slide, slideNum, totalSlides = 12) {
  slide.addShape(pptx.shapes.LINE, {
    x: 0.8, y: 6.85, w: 11.7, h: 0,
    line: { color: CARD_BORDER, width: 1 }
  });
  slide.addText('FoodLine Campus • Executive Business Plan (Zero-Commission Canteen Model)', {
    x: 0.8, y: 6.95, w: 7.5, h: 0.3,
    fontSize: 9.5, color: TEXT_MUTED, fontFace: FONT_BODY
  });
  slide.addText(`${slideNum} / ${totalSlides}`, {
    x: 10.0, y: 6.95, w: 2.5, h: 0.3,
    fontSize: 10, bold: true, color: TEXT_MUTED, align: 'right', fontFace: FONT_HEAD
  });
}

console.log('Generating Simple 12-Slide Executive Business Plan PPTX (4% Student Model)...');

// ==============================================================================
// SLIDE 1: COVER
// ==============================================================================
let s1 = pptx.addSlide();
s1.background = { color: BG_COLOR };

s1.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 13.333, h: 0.15,
  fill: { color: PRIMARY_GREEN }, line: { color: PRIMARY_GREEN }
});

if (HAS_LOGO) {
  s1.addImage({ path: LOGO_PATH, x: 0.8, y: 0.6, w: 1.8, h: 0.8 });
}

s1.addText('BUSINESS PLAN', {
  x: 0.8, y: 1.55, w: 11.7, h: 0.35,
  fontSize: 14, bold: true, color: PRIMARY_GREEN, fontFace: FONT_HEAD
});

s1.addText('FoodLine Campus', {
  x: 0.8, y: 1.9, w: 11.7, h: 0.9,
  fontSize: 42, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
});

s1.addText('Zero-Queue Express Food Ordering & Kitchen Automation for Colleges', {
  x: 0.8, y: 2.85, w: 11.7, h: 0.45,
  fontSize: 17, color: TEXT_BODY, fontFace: FONT_BODY
});

// Simple Card with Core Value Proposition & Goldmine Target
s1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 3.45, w: 11.7, h: 3.15,
  fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1.5 }, rectRadius: 0.1
});

const s1Bullets = [
  '• Presented By: Shivam & FoodLine Core Team',
  '• Pilot Campus: Sanjivani University (Cafe @7 Outlet), Kopargaon, Maharashtra',
  '• Disruption Model: 100% FREE for Canteens (0% Commission) • Students Pay 4% Express Fee (~₹3.20/order)',
  '• Pilot Unit Economics: ₹48L GMV • ₹1.92L Revenue • 90.6% Gross Margin • ₹1.02L Net Annual Profit',
  '• Goldmine Milestone (10% Target): This business plan is designed to generate ₹34,45,78,180 (₹34.46 Cr) — 10% of our total Goldmine Target (₹3,44,57,81,800)'
];
s1.addText(s1Bullets.join('\n\n'), {
  x: 1.2, y: 3.65, w: 10.9, h: 2.75,
  fontSize: 13.5, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD, lineSpacingMultiple: 1.15
});

addFooter(s1, 1);
s1.addNotes('SLIDE 1: Cover slide. FoodLine Campus is a zero-queue express ordering rail. 100% free for canteens (0% commission) with a tiny 4% convenience fee from students. Designed to generate ₹34,45,78,180 (₹34.46 Cr), representing 10% of our total Goldmine Target of ₹3,44,57,81,800.');


// ==============================================================================
// SLIDE 2: VISION & MISSION
// ==============================================================================
let s2 = pptx.addSlide();
s2.background = { color: BG_COLOR };
addHeader(s2, 'FOUNDATION', 'Vision & Mission');

// Vision Card
s2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.8, w: 5.7, h: 4.7,
  fill: { color: CARD_BG }, line: { color: BORDER_GREEN, width: 2 }, rectRadius: 0.12
});
s2.addText('OUR VISION', {
  x: 1.2, y: 2.1, w: 4.9, h: 0.35,
  fontSize: 13, bold: true, color: PRIMARY_GREEN, fontFace: FONT_HEAD
});
s2.addText('To eliminate dining queues across 500+ Indian university campuses, generating ₹34.46 Cr (10% of our ₹344.58 Cr Goldmine milestone).', {
  x: 1.2, y: 2.6, w: 4.9, h: 1.4,
  fontSize: 17, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD, lineSpacingMultiple: 1.2
});
s2.addText('• 100% Cashless and fraud-proof dining\n• Every meal collected in under 30 seconds\n• 100% FREE technology for every campus canteen', {
  x: 1.2, y: 4.3, w: 4.9, h: 1.8,
  fontSize: 13, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.3
});

// Mission Card
s2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.8, y: 1.8, w: 5.7, h: 4.7,
  fill: { color: CARD_BG }, line: { color: BORDER_BLUE, width: 2 }, rectRadius: 0.12
});
s2.addText('OUR MISSION', {
  x: 7.2, y: 2.1, w: 4.9, h: 0.35,
  fontSize: 13, bold: true, color: ACCENT_BLUE, fontFace: FONT_HEAD
});
s2.addText('To give students back their 15-minute break for just ~₹3 pocket-change, while helping canteen operators double sales with zero commission.', {
  x: 7.2, y: 2.6, w: 4.9, h: 1.4,
  fontSize: 18, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD, lineSpacingMultiple: 1.2
});
s2.addText('• 10-Second order flow from classroom desks\n• Paced kitchen preparation with slot throttling\n• Canteen keeps 100% of their food earnings', {
  x: 7.2, y: 4.3, w: 4.9, h: 1.8,
  fontSize: 13, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.3
});

addFooter(s2, 2);
s2.addNotes('SLIDE 2: Vision and Mission. Students get their 15-minute break back for only 4% (~₹3), and canteens pay zero commission.');


// ==============================================================================
// SLIDE 3: THE PROBLEM
// ==============================================================================
let s3 = pptx.addSlide();
s3.background = { color: BG_COLOR };
addHeader(s3, 'MARKET FRICTION', 'The 15-Minute Campus Break Trap');

const probItems = [
  {
    num: '01',
    title: 'Short Recess, Long Lines',
    desc: 'Recess is only 15 minutes, but canteen lines take 18+ minutes. Over 50% of students skip meals or arrive late to class.',
    color: ACCENT_RED, tint: LIGHT_RED, border: BORDER_RED
  },
  {
    num: '02',
    title: 'Kitchen Rush-Hour Panic',
    desc: 'Cooks are overwhelmed by 50–100 students yelling orders at once. Food burns, mistakes happen, and service collapses.',
    color: ACCENT_AMBER, tint: LIGHT_AMBER, border: BORDER_AMBER
  },
  {
    num: '03',
    title: 'Fake UPI Payment Scams',
    desc: 'Students flash fake gallery screenshots in dense crowds. Canteens lose ₹1,000 to ₹3,000 every single week.',
    color: ACCENT_RED, tint: LIGHT_RED, border: BORDER_RED
  },
  {
    num: '04',
    title: 'High Commissions Fail',
    desc: 'Swiggy/Zomato take 25-30% cuts which canteens refuse. Furthermore, outside delivery riders are stopped at university gates.',
    color: ACCENT_BLUE, tint: LIGHT_BLUE, border: BORDER_BLUE
  }
];

probItems.forEach((pi, idx) => {
  const x = 0.8 + (idx * 3.0);
  s3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 1.8, w: 2.8, h: 4.7,
    fill: { color: CARD_BG }, line: { color: pi.border, width: 1.5 }, rectRadius: 0.1
  });

  s3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.25, y: 2.05, w: 0.7, h: 0.35,
    fill: { color: pi.tint }, line: { color: pi.border, width: 1 }, rectRadius: 0.08
  });
  s3.addText(pi.num, {
    x: x + 0.25, y: 2.05, w: 0.7, h: 0.35,
    fontSize: 11, bold: true, color: pi.color, align: 'center', fontFace: FONT_HEAD
  });

  s3.addText(pi.title, {
    x: x + 0.25, y: 2.6, w: 2.3, h: 0.65,
    fontSize: 15, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
  });

  s3.addText(pi.desc, {
    x: x + 0.25, y: 3.4, w: 2.3, h: 2.8,
    fontSize: 12, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.25
  });
});

addFooter(s3, 3);
s3.addNotes('SLIDE 3: The Problem. Canteens operate on thin margins and refuse 25% commissions. Students face long lines and canteens face fake UPI screenshots.');


// ==============================================================================
// SLIDE 4: THE SOLUTION
// ==============================================================================
let s4 = pptx.addSlide();
s4.background = { color: BG_COLOR };
addHeader(s4, 'THE SOLUTION', 'FoodLine Campus: Express Ordering Rail');

const solSteps = [
  {
    step: 'STEP 1',
    title: 'Pre-Order & 4% Fee',
    desc: 'Student orders from lecture hall 5 mins before break. Pays UPI seamlessly with a tiny 4% fee (~₹3 on an ₹80 snack).',
    icon: '📱'
  },
  {
    step: 'STEP 2',
    title: 'Paced Cooking (KDS)',
    desc: 'Kitchen Display System (KDS) paces orders. Slot throttling caps orders to grill capacity, preventing stampedes.',
    icon: '🍳'
  },
  {
    step: 'STEP 3',
    title: '30-Sec Counter Pickup',
    desc: 'Cook taps "Ready". Student walks to express counter, shows 4-digit OTP pass, and grabs hot food in 30 seconds.',
    icon: '⚡'
  }
];

solSteps.forEach((st, idx) => {
  const x = 0.8 + (idx * 4.0);
  s4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 1.8, w: 3.7, h: 3.2,
    fill: { color: CARD_BG }, line: { color: BORDER_GREEN, width: 2 }, rectRadius: 0.12
  });

  s4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.3, y: 2.1, w: 1.8, h: 0.35,
    fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.08
  });
  s4.addText(st.step, {
    x: x + 0.3, y: 2.1, w: 1.8, h: 0.35,
    fontSize: 10.5, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: FONT_HEAD
  });

  s4.addText(st.title, {
    x: x + 0.3, y: 2.65, w: 3.1, h: 0.45,
    fontSize: 17, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
  });

  s4.addText(st.desc, {
    x: x + 0.3, y: 3.25, w: 3.1, h: 1.5,
    fontSize: 12.5, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.25
  });
});

// Bottom Highlight Banner
s4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 5.3, w: 11.7, h: 1.2,
  fill: { color: LIGHT_GREEN }, line: { color: PRIMARY_GREEN, width: 1.5 }, rectRadius: 0.12
});

s4.addText('WIN-WIN DISRUPTION: 0% CANTEEN COMMISSION + 100% FRAUD ELIMINATION', {
  x: 1.2, y: 5.45, w: 10.9, h: 0.3,
  fontSize: 11, bold: true, color: PRIMARY_GREEN, fontFace: FONT_HEAD
});
s4.addText('Canteens pay ₹0 commission and keep 100% of their sales price, while our bank UTR verification completely stops fake UPI screenshots.', {
  x: 1.2, y: 5.8, w: 10.9, h: 0.55,
  fontSize: 13, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
});

addFooter(s4, 4);
s4.addNotes('SLIDE 4: The Solution. Canteens pay 0% commission, and students pay only 4% (~₹3) to skip the crowd.');


// ==============================================================================
// SLIDE 5: PRODUCT ECOSYSTEM
// ==============================================================================
let s5 = pptx.addSlide();
s5.background = { color: BG_COLOR };
addHeader(s5, 'PRODUCT', 'The 4 Core Platform Rails');

const prodRails = [
  {
    title: 'Student Mobile Web & App',
    bullets: [
      'Zero-install instant PWA & Android app',
      'Live digital menu with pricing',
      'Direct UPI payment with transparent 4% fee',
      'Digital pickup pass with 4-digit OTP'
    ],
    tint: LIGHT_GREEN, border: BORDER_GREEN, color: PRIMARY_GREEN
  },
  {
    title: 'Kitchen Display System (KDS)',
    bullets: [
      '100% Free for canteens on any 10" tablet',
      'Color-coded tickets: Yellow ➔ Green',
      'Loud sound alert on incoming orders',
      '1-Tap meal ready notification to student'
    ],
    tint: LIGHT_BLUE, border: BORDER_BLUE, color: ACCENT_BLUE
  },
  {
    title: 'Smart Slot Throttling Engine',
    bullets: [
      'Caps orders to kitchen fryer/grill speed',
      'E.g. max 25 orders every 10 minutes',
      'Automatically smooths peak 15-min rush',
      'Zero food spoilage or kitchen panic'
    ],
    tint: LIGHT_AMBER, border: BORDER_AMBER, color: ACCENT_AMBER
  },
  {
    title: 'Manager Portal & Dual Sync',
    bullets: [
      'Real-time daily sales & payout tracking',
      'Automated bank UTR fraud verification',
      'Live 2-way Google Sheets sync',
      'Instant toggle for sold-out menu items'
    ],
    tint: LIGHT_GREEN, border: BORDER_GREEN, color: PRIMARY_GREEN
  }
];

prodRails.forEach((pr, idx) => {
  const x = 0.8 + (idx * 3.0);
  s5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 1.8, w: 2.8, h: 4.7,
    fill: { color: CARD_BG }, line: { color: pr.border, width: 1.5 }, rectRadius: 0.1
  });

  s5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.25, y: 2.05, w: 2.3, h: 0.32,
    fill: { color: pr.tint }, line: { color: pr.border, width: 1 }, rectRadius: 0.08
  });
  s5.addText(`RAIL 0${idx+1}`, {
    x: x + 0.25, y: 2.05, w: 2.3, h: 0.32,
    fontSize: 10, bold: true, color: pr.color, align: 'center', fontFace: FONT_HEAD
  });

  s5.addText(pr.title, {
    x: x + 0.25, y: 2.55, w: 2.3, h: 0.55,
    fontSize: 14, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
  });

  const bText = pr.bullets.map(b => `• ${b}`).join('\n\n');
  s5.addText(bText, {
    x: x + 0.25, y: 3.25, w: 2.3, h: 3.0,
    fontSize: 11.5, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.25
  });
});

addFooter(s5, 5);
s5.addNotes('SLIDE 5: Product Rails. Our software connects students, cooks, and canteen managers seamlessly with zero friction.');


// ==============================================================================
// SLIDE 6: COMPETITIVE ADVANTAGE
// ==============================================================================
let s6 = pptx.addSlide();
s6.background = { color: BG_COLOR };
addHeader(s6, 'COMPETITIVE POSITION', 'Why FoodLine Wins: The Zero-Commission Model');

const compData = [
  [
    { text: 'FEATURE', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: 'FOODLINE CAMPUS', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'center' } },
    { text: 'SWIGGY / ZOMATO', options: { bold: true, color: 'FFFFFF', fill: { color: '475569' }, align: 'center' } },
    { text: 'MANUAL CANTEEN LINE', options: { bold: true, color: 'FFFFFF', fill: { color: '475569' }, align: 'center' } }
  ],
  [
    { text: 'Canteen Commission', options: { bold: true } },
    { text: '0% (100% Free for Canteen)', options: { color: PRIMARY_GREEN, bold: true, align: 'center' } },
    { text: '25% – 30% Commission', options: { color: ACCENT_RED, align: 'center' } },
    { text: '0%', options: { align: 'center' } }
  ],
  [
    { text: 'Student Extra Fee', options: { bold: true } },
    { text: 'Only 4% (~₹3 on ₹80 order)', options: { color: PRIMARY_GREEN, bold: true, align: 'center' } },
    { text: '₹40 – ₹60 delivery fee', options: { color: ACCENT_RED, align: 'center' } },
    { text: '₹0 (Costs 20 min time)', options: { align: 'center' } }
  ],
  [
    { text: 'Pickup Wait Time', options: { bold: true } },
    { text: '30 Seconds (Express)', options: { color: PRIMARY_GREEN, bold: true, align: 'center' } },
    { text: '35–45 Minutes', options: { color: ACCENT_RED, align: 'center' } },
    { text: '18–25 Minutes (Queue)', options: { color: ACCENT_RED, align: 'center' } }
  ],
  [
    { text: 'Campus Gate Access', options: { bold: true } },
    { text: 'Inside Campus Rail', options: { color: PRIMARY_GREEN, bold: true, align: 'center' } },
    { text: 'Blocked at Main Gate', options: { color: ACCENT_RED, align: 'center' } },
    { text: 'Inside Canteen', options: { align: 'center' } }
  ],
  [
    { text: 'Fake UPI Scam Risk', options: { bold: true } },
    { text: '0% (Bank UTR Shield)', options: { color: PRIMARY_GREEN, bold: true, align: 'center' } },
    { text: 'N/A', options: { align: 'center' } },
    { text: 'High (Fake screenshots)', options: { color: ACCENT_RED, align: 'center' } }
  ]
];

s6.addTable(compData, {
  x: 0.8, y: 1.8, w: 11.7, h: 4.7,
  colW: [2.9, 3.1, 2.8, 2.9],
  rowH: [0.65, 0.75, 0.75, 0.75, 0.75, 0.75],
  border: { color: CARD_BORDER, width: 1 },
  fill: { color: 'FFFFFF' },
  fontSize: 12,
  fontFace: FONT_BODY
});

addFooter(s6, 6);
s6.addNotes('SLIDE 6: Competitive Advantage. Zero commission means 100% canteen adoption. 4% student fee means instant affordability for students.');


// ==============================================================================
// SLIDE 7: BUSINESS & REVENUE MODEL (4% STUDENT FEE)
// ==============================================================================
let s7 = pptx.addSlide();
s7.background = { color: BG_COLOR };
addHeader(s7, 'REVENUE MODEL', 'The 4% Student Convenience Fee Architecture');

const revStreams = [
  {
    num: 'CANTEEN SIDE',
    title: '100% Free for Canteens',
    rate: '0% Commission',
    desc: 'Canteens keep 100% of their earnings. No setup fee, no commission, and free KDS kitchen software. Result: Instant canteen adoption.',
    annual: 'Zero Resistance',
    tint: LIGHT_BLUE, border: BORDER_BLUE, color: ACCENT_BLUE
  },
  {
    num: 'STUDENT SIDE',
    title: '4% Express Convenience Fee',
    rate: '4% of Order Value',
    desc: 'Students happily pay a tiny 4% fee to skip the 20-minute crowd.\n• On ₹40 Poha = ₹1.60\n• On ₹80 Meal = ₹3.20\n• On ₹100 Thali = ₹4.00',
    annual: '₹1,92,000 / yr',
    tint: LIGHT_GREEN, border: BORDER_GREEN, color: PRIMARY_GREEN
  },
  {
    num: 'PAYMENT RAIL',
    title: 'Direct UPI Rail (0% MDR)',
    rate: '0% Gateway Charges',
    desc: 'Compliant direct UPI peer-to-merchant routing avoids high 2% card/gateway fees. FoodLine retains >90% of fee as gross profit.',
    annual: '>90% Gross Margin',
    tint: LIGHT_AMBER, border: BORDER_AMBER, color: ACCENT_AMBER
  }
];

revStreams.forEach((rs, idx) => {
  const x = 0.8 + (idx * 4.0);
  s7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 1.8, w: 3.7, h: 4.7,
    fill: { color: CARD_BG }, line: { color: rs.border, width: 2 }, rectRadius: 0.12
  });

  s7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.3, y: 2.1, w: 1.8, h: 0.35,
    fill: { color: rs.tint }, line: { color: rs.border, width: 1 }, rectRadius: 0.08
  });
  s7.addText(rs.num, {
    x: x + 0.3, y: 2.1, w: 1.8, h: 0.35,
    fontSize: 10, bold: true, color: rs.color, align: 'center', fontFace: FONT_HEAD
  });

  s7.addText(rs.title, {
    x: x + 0.3, y: 2.65, w: 3.1, h: 0.45,
    fontSize: 16, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
  });

  s7.addText(rs.rate, {
    x: x + 0.3, y: 3.2, w: 3.1, h: 0.4,
    fontSize: 14, bold: true, color: rs.color, fontFace: FONT_HEAD
  });

  s7.addText(rs.desc, {
    x: x + 0.3, y: 3.75, w: 3.1, h: 1.6,
    fontSize: 12, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.25
  });

  s7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.3, y: 5.5, w: 3.1, h: 0.7,
    fill: { color: rs.tint }, line: { color: rs.border, width: 1 }, rectRadius: 0.08
  });
  s7.addText(`Pilot Yield: ${rs.annual}`, {
    x: x + 0.3, y: 5.65, w: 3.1, h: 0.4,
    fontSize: 12, bold: true, color: rs.color, align: 'center', fontFace: FONT_HEAD
  });
});

addFooter(s7, 7);
s7.addNotes('SLIDE 7: Business Model. We take 0% from canteens and 4% from students. With 0% MDR on UPI, our gross profit margin is over 90%.');


// ==============================================================================
// SLIDE 8: PILOT UNIT ECONOMICS (4% STUDENT MODEL)
// ==============================================================================
let s8 = pptx.addSlide();
s8.background = { color: BG_COLOR };
addHeader(s8, 'FINANCIAL MODEL', 'Single-Campus Pilot Unit Economics (4% Student Model)');

// Left Column: 4 Key Numbers
const keyStats = [
  { val: '2,500', lbl: 'Total Campus Students' },
  { val: '1,000', lbl: 'Active Users (40% Adoption)' },
  { val: '60,000', lbl: 'Orders / Year (5 orders/mo)' },
  { val: '₹48 LAKH', lbl: 'Annual GMV (@ ₹80 AOV)' }
];

keyStats.forEach((ks, idx) => {
  const y = 1.8 + (idx * 1.15);
  s8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: y, w: 4.8, h: 1.0,
    fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1.5 }, rectRadius: 0.1
  });
  s8.addText(ks.val, {
    x: 1.1, y: y + 0.15, w: 2.2, h: 0.45,
    fontSize: 22, bold: true, color: PRIMARY_GREEN, fontFace: FONT_HEAD
  });
  s8.addText(ks.lbl, {
    x: 1.1, y: y + 0.58, w: 4.2, h: 0.3,
    fontSize: 11, color: TEXT_MUTED, fontFace: FONT_BODY
  });
});

// Right Column: Clean P&L Table (4% Student Model)
const pnlData = [
  [
    { text: 'FINANCIAL ITEM', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: 'ANNUAL AMOUNT', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'right' } }
  ],
  [
    { text: 'Gross Merchandise Value (GMV @ ₹80 AOV)' },
    { text: '₹48,00,000', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'FoodLine Revenue (4% Student Convenience Fee)', options: { bold: true, color: PRIMARY_GREEN } },
    { text: '₹1,92,000', options: { bold: true, color: PRIMARY_GREEN, align: 'right' } }
  ],
  [
    { text: 'Direct Variable Tech Cost (~₹0.30/order SMS/Server)' },
    { text: '(₹18,000)', options: { color: ACCENT_RED, align: 'right' } }
  ],
  [
    { text: 'Gross Profit (90.62% Gross Margin)', options: { bold: true } },
    { text: '₹1,74,000', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'Lean Campus OPEX (Hosting + Lead + Marketing)' },
    { text: '(₹72,000)', options: { align: 'right' } }
  ],
  [
    { text: 'NET PROFIT (53.1% Net Margin)', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: '₹1,02,000', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'right' } }
  ]
];

s8.addTable(pnlData, {
  x: 6.0, y: 1.8, w: 6.5, h: 4.7,
  colW: [4.3, 2.2],
  rowH: [0.65, 0.65, 0.7, 0.65, 0.7, 0.65, 0.7],
  border: { color: CARD_BORDER, width: 1 },
  fill: { color: 'FFFFFF' },
  fontSize: 11.5,
  fontFace: FONT_BODY
});

addFooter(s8, 8);
s8.addNotes('SLIDE 8: Pilot Unit Economics. On a single campus, 4% fee brings ₹1,92,000 in revenue. After ₹18K direct tech costs and ₹72K lean OPEX, net profit is ₹1,02,000 (53% margin).');


// ==============================================================================
// SLIDE 9: SETUP COST & CAPITAL REQUIREMENTS
// ==============================================================================
let s9 = pptx.addSlide();
s9.background = { color: BG_COLOR };
addHeader(s9, 'CAPITAL REQUIREMENTS', 'Setup Cost & Initial Investment');

const setupData = [
  [
    { text: 'EXPENSE ITEM', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: 'PURPOSE / ALLOCATION', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: 'AMOUNT (₹)', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'right' } }
  ],
  [
    { text: 'Software Platform Build & Testing', options: { bold: true } },
    { text: 'Next.js 15 PWA, real-time KDS & cloud infrastructure setup' },
    { text: '₹60,000', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'Canteen Hardware Setup', options: { bold: true } },
    { text: '10" Android tablet + soundbox device for canteen kitchen' },
    { text: '₹15,000', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'Company Registration & Legal', options: { bold: true } },
    { text: 'Pvt Ltd incorporation, GST registration, and legal agreements' },
    { text: '₹25,000', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'Branding & Campus Signage', options: { bold: true } },
    { text: 'QR code table tents for 50 tables + express counter banner' },
    { text: '₹20,000', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'Working Capital Reserve', options: { bold: true, color: ACCENT_BLUE } },
    { text: 'Cash buffer for Year 1 cloud hosting & operations reserve' },
    { text: '₹84,000', options: { bold: true, color: ACCENT_BLUE, align: 'right' } }
  ],
  [
    { text: 'TOTAL INITIAL INVESTMENT REQUIRED', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: '51% Founders Equity (₹1.04L) + 49% Seed Capital (₹1.00L)', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: '₹2,04,000', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'right' } }
  ]
];

s9.addTable(setupData, {
  x: 0.8, y: 1.8, w: 11.7, h: 4.7,
  colW: [4.2, 5.3, 2.2],
  rowH: [0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.75],
  border: { color: CARD_BORDER, width: 1 },
  fill: { color: 'FFFFFF' },
  fontSize: 12,
  fontFace: FONT_BODY
});

addFooter(s9, 9);
s9.addNotes('SLIDE 9: Setup Cost. Total initial requirement is ₹2,04,000 including working capital reserve. Extremely lean and asset-light.');


// ==============================================================================
// SLIDE 10: BREAK-EVEN & PAYBACK PERIOD
// ==============================================================================
let s10 = pptx.addSlide();
s10.background = { color: BG_COLOR };
addHeader(s10, 'VIABILITY MATH', 'Break-Even Point & Payback Period (4% Model)');

// Left Box: Break-Even Math
s10.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.8, w: 5.7, h: 4.7,
  fill: { color: CARD_BG }, line: { color: BORDER_GREEN, width: 2 }, rectRadius: 0.12
});
s10.addText('BREAK-EVEN ANALYSIS', {
  x: 1.2, y: 2.1, w: 4.9, h: 0.35,
  fontSize: 12, bold: true, color: PRIMARY_GREEN, fontFace: FONT_HEAD
});

const beLines = [
  '• Annual Lean Fixed OPEX: ₹72,000 (₹6,000/mo)',
  '• Contribution Margin / Order: ₹2.90',
  '  (₹3.20 Revenue − ₹0.30 Variable Tech Cost)',
  '',
  'BREAK-EVEN ORDER VOLUME:',
  '= ₹72,000 ÷ ₹2.90',
  '= 24,828 Orders / Year (~2,069 orders/month)',
  '',
  '• Capacity Cushion: Only 41% of pilot volume needed!',
  '• 59% Safety Margin: Project remains profitable even if student volume drops by half.'
];
s10.addText(beLines.join('\n'), {
  x: 1.2, y: 2.6, w: 4.9, h: 3.6,
  fontSize: 13, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD, lineSpacingMultiple: 1.2
});

// Right Box: Payback Period
s10.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.8, y: 1.8, w: 5.7, h: 4.7,
  fill: { color: CARD_BG }, line: { color: BORDER_BLUE, width: 2 }, rectRadius: 0.12
});
s10.addText('ESTIMATED PAYBACK PERIOD', {
  x: 7.2, y: 2.1, w: 4.9, h: 0.35,
  fontSize: 12, bold: true, color: ACCENT_BLUE, fontFace: FONT_HEAD
});

s10.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.2, y: 2.6, w: 4.9, h: 1.1,
  fill: { color: LIGHT_GREEN }, line: { color: PRIMARY_GREEN, width: 1.5 }, rectRadius: 0.1
});
s10.addText('OPERATIONAL BREAK-EVEN: MONTH 5\nCapital Payback: ~18 Months', {
  x: 7.2, y: 2.8, w: 4.9, h: 0.7,
  fontSize: 16, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: FONT_HEAD
});

const payNarrative = [
  '• 0% Canteen Churn: Because canteens pay ₹0 commission, zero canteens churn or cancel.',
  '• Hardware Payback in < 45 Days: The ₹15,000 kitchen tablet cost is covered within 45 days of orders.',
  '• Strong Cash Flow: Direct UPI transactions ensure same-day settlement with zero debt or credit risk.'
];
s10.addText(payNarrative.join('\n\n'), {
  x: 7.2, y: 3.9, w: 4.9, h: 2.4,
  fontSize: 12, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.25
});

addFooter(s10, 10);
s10.addNotes('SLIDE 10: Break-Even Math. Break-even requires only 24,828 orders/year (41% capacity). Operational break-even reached in Month 5.');


// ==============================================================================
// SLIDE 11: 5-YEAR GROWTH PROJECTIONS & GOLDMINE TARGET (10% ALLOCATION)
// ==============================================================================
let s11 = pptx.addSlide();
s11.background = { color: BG_COLOR };
addHeader(s11, 'SCALE & EXPANSION', '5-Year Growth Projections & Goldmine Target (10% Allocation)');

const projData = [
  [
    { text: 'METRIC', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: 'YEAR 1', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'center' } },
    { text: 'YEAR 2', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'center' } },
    { text: 'YEAR 3', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'center' } },
    { text: 'YEAR 4', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'center' } },
    { text: 'YEAR 5', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'center' } }
  ],
  [
    { text: 'Active Campuses', options: { bold: true } },
    { text: '1', options: { align: 'center' } },
    { text: '5', options: { align: 'center' } },
    { text: '15', options: { align: 'center' } },
    { text: '30', options: { align: 'center' } },
    { text: '50', options: { align: 'center', bold: true, color: PRIMARY_GREEN } }
  ],
  [
    { text: 'Active Students', options: { bold: true } },
    { text: '1,000', options: { align: 'center' } },
    { text: '5,000', options: { align: 'center' } },
    { text: '15,000', options: { align: 'center' } },
    { text: '30,000', options: { align: 'center' } },
    { text: '50,000', options: { align: 'center', bold: true } }
  ],
  [
    { text: 'Annual Orders', options: { bold: true } },
    { text: '60,000', options: { align: 'center' } },
    { text: '300,000', options: { align: 'center' } },
    { text: '900,000', options: { align: 'center' } },
    { text: '1.8 Million', options: { align: 'center' } },
    { text: '3.0 Million', options: { align: 'center', bold: true } }
  ],
  [
    { text: 'Annual GMV', options: { bold: true } },
    { text: '₹48.0 L', options: { align: 'center' } },
    { text: '₹2.40 Cr', options: { align: 'center' } },
    { text: '₹7.20 Cr', options: { align: 'center' } },
    { text: '₹14.40 Cr', options: { align: 'center' } },
    { text: '₹24.00 Cr', options: { align: 'center', bold: true, color: PRIMARY_GREEN } }
  ],
  [
    { text: 'Revenue (4% Fee)', options: { bold: true, color: PRIMARY_GREEN } },
    { text: '₹1.92 L', options: { align: 'center', bold: true } },
    { text: '₹9.60 L', options: { align: 'center', bold: true } },
    { text: '₹28.80 L', options: { align: 'center', bold: true } },
    { text: '₹57.60 L', options: { align: 'center', bold: true } },
    { text: '₹96.00 L', options: { align: 'center', bold: true, color: PRIMARY_GREEN } }
  ],
  [
    { text: 'Lean Annual OPEX', options: { bold: true } },
    { text: '₹0.72 L', options: { align: 'center' } },
    { text: '₹2.40 L', options: { align: 'center' } },
    { text: '₹6.50 L', options: { align: 'center' } },
    { text: '₹14.00 L', options: { align: 'center' } },
    { text: '₹24.00 L', options: { align: 'center' } }
  ],
  [
    { text: 'NET ANNUAL PROFIT', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: '₹1.02 L', options: { align: 'center', bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: '₹6.30 L', options: { align: 'center', bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: '₹19.60 L', options: { align: 'center', bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: '₹38.20 L', options: { align: 'center', bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: '₹63.00 L', options: { align: 'center', bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } }
  ]
];

s11.addTable(projData, {
  x: 0.8, y: 1.7, w: 11.7, h: 3.75,
  colW: [2.9, 1.76, 1.76, 1.76, 1.76, 1.76],
  rowH: [0.55, 0.45, 0.45, 0.45, 0.48, 0.48, 0.45, 0.55],
  border: { color: CARD_BORDER, width: 1 },
  fill: { color: 'FFFFFF' },
  fontSize: 11,
  fontFace: FONT_BODY
});

// Goldmine Callout Banner
s11.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 5.65, w: 11.7, h: 1.05,
  fill: { color: LIGHT_GREEN }, line: { color: PRIMARY_GREEN, width: 1.5 }, rectRadius: 0.1
});
s11.addText('GOLDMINE TARGET (10% ALLOCATION): ₹34,45,78,180 (₹34.46 CRORES)', {
  x: 1.1, y: 5.75, w: 11.1, h: 0.3,
  fontSize: 12, bold: true, color: PRIMARY_GREEN, fontFace: FONT_HEAD
});
s11.addText('Expanding to 500+ university campuses nationally unlocks ₹240+ Cr GMV with zero canteen churn, generating ₹34,45,78,180 (10% of our total ₹344.58 Cr Goldmine milestone).', {
  x: 1.1, y: 6.08, w: 11.1, h: 0.5,
  fontSize: 11.5, color: TEXT_DARK, fontFace: FONT_BODY
});

addFooter(s11, 11);
s11.addNotes('SLIDE 11: 5-Year Scaling and Goldmine Target. By Year 5, 50 campuses yield ₹96L revenue and ₹63L net profit. Scaling to 500+ campuses generates ₹34,45,78,180, fulfilling 10% of our total ₹344.58 Cr Goldmine milestone.');


// ==============================================================================
// SLIDE 12: PILOT ROLLOUT & CONTACT
// ==============================================================================
let s12 = pptx.addSlide();
s12.background = { color: BG_COLOR };

s12.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 13.333, h: 0.15,
  fill: { color: PRIMARY_GREEN }, line: { color: PRIMARY_GREEN }
});

if (HAS_LOGO) {
  s12.addImage({ path: LOGO_PATH, x: 5.7, y: 0.6, w: 1.9, h: 0.8 });
}

s12.addText('Thank You', {
  x: 0.8, y: 1.45, w: 11.7, h: 0.6,
  fontSize: 36, bold: true, color: TEXT_DARK, align: 'center', fontFace: FONT_HEAD
});

s12.addText('FoodLine Campus Technologies Pvt. Ltd.', {
  x: 0.8, y: 2.1, w: 11.7, h: 0.35,
  fontSize: 17, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: FONT_HEAD
});

s12.addText('Zero-Queue Express Food Ordering & Kitchen Automation\n"100% Free for Canteens. Just Order, Grab, and Go."', {
  x: 0.8, y: 2.5, w: 11.7, h: 0.55,
  fontSize: 12.5, color: TEXT_MUTED, align: 'center', fontFace: FONT_BODY
});

// Pilot Card
s12.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 1.5, y: 3.2, w: 10.3, h: 1.9,
  fill: { color: CARD_BG }, line: { color: BORDER_GREEN, width: 2 }, rectRadius: 0.12
});

s12.addText('PILOT LAUNCH & GOLDMINE ROADMAP:', {
  x: 1.8, y: 3.35, w: 9.7, h: 0.28,
  fontSize: 11, bold: true, color: PRIMARY_GREEN, fontFace: FONT_HEAD
});
s12.addText('• Pilot Ready: Sanjivani University (Cafe @7 Outlet), Kopargaon, Maharashtra\n• Architecture: Next.js 15 PWA + Android APK + Live KDS Screen (Deployment Ready)\n• Target Goldmine Milestone: ₹34,45,78,180 (₹34.46 Cr — 10% of ₹344.58 Cr Goal) across 500+ Campuses', {
  x: 1.8, y: 3.7, w: 9.7, h: 1.25,
  fontSize: 12.5, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD, lineSpacingMultiple: 1.25
});

// Contact Row
const contacts12 = [
  { label: 'CO-FOUNDER', val: 'Shivam & Core Team' },
  { label: 'PHONE', val: '+91 76669 05482' },
  { label: 'EMAIL', val: 'foodlinecampus@gmail.com' }
];

contacts12.forEach((c, idx) => {
  const x = 1.5 + (idx * 3.6);
  s12.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 5.3, w: 3.1, h: 1.1,
    fill: { color: 'FFFFFF' }, line: { color: CARD_BORDER, width: 1 }, rectRadius: 0.08
  });
  s12.addText(c.label, {
    x: x + 0.2, y: 5.45, w: 2.7, h: 0.25,
    fontSize: 9.5, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: FONT_HEAD
  });
  s12.addText(c.val, {
    x: x + 0.2, y: 5.75, w: 2.7, h: 0.45,
    fontSize: 12, bold: true, color: TEXT_DARK, align: 'center', fontFace: FONT_HEAD
  });
});

addFooter(s12, 12);
s12.addNotes('SLIDE 12: Contact and pilot rollout. We are ready to launch at Sanjivani University with 0% commission for canteens and 4% fee from students.');


// ==============================================================================
// SAVE PPTX FILE (With resilient fallback if PowerPoint has files open)
// ==============================================================================
async function saveWithFallbacks() {
  const candidates = [
    path.join(__dirname, '../FoodLine_Campus_Simple_Executive_Plan.pptx'),
    path.join(__dirname, '../FoodLine_Campus_Simple_Executive_Plan_4Percent.pptx'),
    path.join(__dirname, '../FoodLine_Campus_Simple_Executive_Plan_Goldmine.pptx')
  ];

  for (const fPath of candidates) {
    try {
      const savedPath = await pptx.writeFile({ fileName: fPath });
      console.log(`\n🎉 SUCCESS: Simple 12-Slide Executive Business Plan PPTX created successfully at:\n${savedPath}\n`);
      return;
    } catch (err) {
      if (err.code === 'EBUSY') {
        console.warn(`File ${path.basename(fPath)} is currently open/locked in PowerPoint, trying next filename...`);
      } else {
        throw err;
      }
    }
  }
}

saveWithFallbacks().catch(err => {
  console.error('❌ Fatal error writing PPTX:', err);
  process.exit(1);
});
