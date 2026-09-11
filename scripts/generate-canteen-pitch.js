const PptxGenJS = require('../frontend/node_modules/pptxgenjs');
const fs = require('fs');

const pptx = new PptxGenJS();

pptx.layout = 'LAYOUT_16x9';

// Color Palette
const BG_DARK = '07070B';
const CARD_BG = '12121A';
const ACCENT_GREEN = '00D4AA'; // Profit Green
const ACCENT_ORANGE = 'FF6B2C'; // Brand Orange
const ACCENT_AMBER = 'FFB347'; // Amber Highlight
const TEXT_WHITE = 'FFFFFF';
const TEXT_MUTED = 'A1A1AA';
const BORDER_COLOR = '2A2A38';

// Helper function for header styling
function addHeader(slide, category, title) {
  slide.addText(category.toUpperCase(), {
    x: 0.8, y: 0.5, w: 11.5, h: 0.3,
    fontSize: 12, bold: true, color: ACCENT_GREEN, fontFace: 'Arial'
  });
  slide.addText(title, {
    x: 0.8, y: 0.8, w: 11.5, h: 0.6,
    fontSize: 26, bold: true, color: TEXT_WHITE, fontFace: 'Arial'
  });
}

// -------------------------------------------------------------
// SLIDE 1: Cover Slide
// -------------------------------------------------------------
let slide1 = pptx.addSlide();
slide1.background = { color: BG_DARK };

slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.2, w: 4.8, h: 0.4,
  fill: { color: '1A2E26' }, line: { color: ACCENT_GREEN, width: 1 }, rectRadius: 0.2
});
slide1.addText('📈 CANTEEN PROFIT & GROWTH PITCH', {
  x: 0.8, y: 1.2, w: 4.8, h: 0.4,
  fontSize: 11, bold: true, color: ACCENT_GREEN, align: 'center', fontFace: 'Arial'
});

slide1.addText('Double Your Daily Canteen Sales &\nEliminate Break-Time Queue Losses', {
  x: 0.8, y: 1.8, w: 11.5, h: 1.6,
  fontSize: 34, bold: true, color: TEXT_WHITE, fontFace: 'Arial'
});

slide1.addText('FoodLine Campus — The #1 Express Pre-Ordering & Kitchen Automation Rail for Campus Canteens', {
  x: 0.8, y: 3.5, w: 11.5, h: 0.6,
  fontSize: 16, color: ACCENT_AMBER, fontFace: 'Arial'
});

slide1.addShape(pptx.shapes.RECTANGLE, {
  x: 0.8, y: 4.5, w: 11.7, h: 1.8,
  fill: { color: CARD_BG }, line: { color: BORDER_COLOR, width: 1 }, rectRadius: 0.1
});

slide1.addText('🚀 CANTEEN MANAGER PROMISE:', {
  x: 1.1, y: 4.7, w: 11.0, h: 0.3,
  fontSize: 12, bold: true, color: ACCENT_GREEN, fontFace: 'Arial'
});
slide1.addText('• Capture 100% of rush-hour orders from students before break bell rings.\n• 100% upfront payment with 12-digit UTR verification — ZERO fake screenshot fraud.\n• Zero upfront investment • Free Kitchen Display System (KDS) • 10-Minute staff setup.', {
  x: 1.1, y: 5.1, w: 11.0, h: 1.0,
  fontSize: 13, color: TEXT_WHITE, fontFace: 'Arial'
});


// -------------------------------------------------------------
// SLIDE 2: The Problem - Lost Sales
// -------------------------------------------------------------
let slide2 = pptx.addSlide();
slide2.background = { color: BG_DARK };
addHeader(slide2, 'THE RUSH-HOUR CRISIS', 'Where Is Your Canteen Losing Money Every Single Day?');

// Card 1
slide2.addShape(pptx.shapes.RECTANGLE, {
  x: 0.8, y: 1.8, w: 3.6, h: 4.8,
  fill: { color: CARD_BG }, line: { color: 'E53E3E', width: 1 }
});
slide2.addText('🔴 60% Student Turnback', {
  x: 1.0, y: 2.1, w: 3.2, h: 0.4, fontSize: 16, bold: true, color: 'FF6B6B', fontFace: 'Arial'
});
slide2.addText('With only 15-20 minutes of recess, over half the students leave or skip buying food because the counter line is 25+ students deep.', {
  x: 1.0, y: 2.7, w: 3.2, h: 3.5, fontSize: 13, color: TEXT_MUTED, fontFace: 'Arial'
});

// Card 2
slide2.addShape(pptx.shapes.RECTANGLE, {
  x: 4.8, y: 1.8, w: 3.6, h: 4.8,
  fill: { color: CARD_BG }, line: { color: 'DD6B20', width: 1 }
});
slide2.addText('🟠 Counter Bottleneck', {
  x: 5.0, y: 2.1, w: 3.2, h: 0.4, fontSize: 16, bold: true, color: ACCENT_AMBER, fontFace: 'Arial'
});
slide2.addText('Manual cash exchange, scanning individual QR codes, and shouting token numbers eats up 45 seconds per student. You can only serve ~150 meals per break.', {
  x: 5.0, y: 2.7, w: 3.2, h: 3.5, fontSize: 13, color: TEXT_MUTED, fontFace: 'Arial'
});

// Card 3
slide2.addShape(pptx.shapes.RECTANGLE, {
  x: 8.8, y: 1.8, w: 3.7, h: 4.8,
  fill: { color: CARD_BG }, line: { color: 'E53E3E', width: 1 }
});
slide2.addText('🔴 Fake Screenshot Losses', {
  x: 9.0, y: 2.1, w: 3.3, h: 0.4, fontSize: 16, bold: true, color: 'FF6B6B', fontFace: 'Arial'
});
slide2.addText('During peak rush, staff cannot check every UPI bank statement. Fraudulent screenshots cause 5-10% daily revenue loss in busy canteens.', {
  x: 9.0, y: 2.7, w: 3.3, h: 3.5, fontSize: 13, color: TEXT_MUTED, fontFace: 'Arial'
});


// -------------------------------------------------------------
// SLIDE 3: The Solution
// -------------------------------------------------------------
let slide3 = pptx.addSlide();
slide3.background = { color: BG_DARK };
addHeader(slide3, 'THE FOODLINE SOLUTION', 'Transform Your Canteen into a High-Speed 30-Sec Express Station');

// 4 Step Process
const steps = [
  { num: '01', title: 'Pre-Orders From Class', desc: 'Students order & pay via UPI 15 mins before break bell rings.' },
  { num: '02', title: 'Instant KDS Notification', desc: 'Orders land on your kitchen display screen sorted by preparation time.' },
  { num: '03', title: 'Batch Preparation', desc: 'Cook exact quantities hot and fresh right as break starts.' },
  { num: '04', title: '30-Sec Express Pickup', desc: 'Student scans optical QR pass at counter and collects hot meal.' }
];

steps.forEach((step, i) => {
  const xPos = 0.8 + (i * 2.95);
  slide3.addShape(pptx.shapes.RECTANGLE, {
    x: xPos, y: 1.8, w: 2.8, h: 4.8,
    fill: { color: CARD_BG }, line: { color: ACCENT_GREEN, width: 1 }
  });
  slide3.addText(step.num, {
    x: xPos + 0.2, y: 2.1, w: 2.4, h: 0.6, fontSize: 32, bold: true, color: ACCENT_GREEN, fontFace: 'Arial'
  });
  slide3.addText(step.title, {
    x: xPos + 0.2, y: 2.8, w: 2.4, h: 0.8, fontSize: 16, bold: true, color: TEXT_WHITE, fontFace: 'Arial'
  });
  slide3.addText(step.desc, {
    x: xPos + 0.2, y: 3.7, w: 2.4, h: 2.6, fontSize: 12, color: TEXT_MUTED, fontFace: 'Arial'
  });
});


// -------------------------------------------------------------
// SLIDE 4: Profit Pillar 1 - 3x Daily Orders
// -------------------------------------------------------------
let slide4 = pptx.addSlide();
slide4.background = { color: BG_DARK };
addHeader(slide4, 'CANTEEN PROFIT PILLAR #1', 'Serve 3x More Students With the Exact Same Kitchen Staff');

slide4.addShape(pptx.shapes.RECTANGLE, {
  x: 0.8, y: 1.8, w: 5.6, h: 4.8,
  fill: { color: CARD_BG }, line: { color: BORDER_COLOR, width: 1 }
});
slide4.addText('WITHOUT FOODLINE', {
  x: 1.1, y: 2.1, w: 5.0, h: 0.4, fontSize: 14, bold: true, color: 'FF6B6B', fontFace: 'Arial'
});
slide4.addText('• Maximum ~150-180 orders served during 20-min break.\n• Physical counter bottleneck stops sales.\n• Long wait times frustrate students.\n• Unsold food wasted if prepared specs fail.\n• Daily Revenue Ceiling: ~₹8,000 / day.', {
  x: 1.1, y: 2.7, w: 5.0, h: 3.5, fontSize: 13, color: TEXT_MUTED, fontFace: 'Arial'
});

slide4.addShape(pptx.shapes.RECTANGLE, {
  x: 6.8, y: 1.8, w: 5.7, h: 4.8,
  fill: { color: CARD_BG }, line: { color: ACCENT_GREEN, width: 2 }
});
slide4.addText('WITH FOODLINE CAMPUS', {
  x: 7.1, y: 2.1, w: 5.1, h: 0.4, fontSize: 14, bold: true, color: ACCENT_GREEN, fontFace: 'Arial'
});
slide4.addText('• 450 to 600+ orders fulfilled per break!\n• Pre-orders enable batch preparation before bell rings.\n• Express counter hands over meals in <30 seconds.\n• 0% student turnbacks — every student gets served.\n• Daily Revenue Potential: ₹30,000+ / day!', {
  x: 7.1, y: 2.7, w: 5.1, h: 3.5, fontSize: 13, color: TEXT_WHITE, fontFace: 'Arial'
});


// -------------------------------------------------------------
// SLIDE 5: Profit Pillar 2 - Zero Payment Losses
// -------------------------------------------------------------
let slide5 = pptx.addSlide();
slide5.background = { color: BG_DARK };
addHeader(slide5, 'CANTEEN PROFIT PILLAR #2', '12-Digit Instant UTR Verification — 100% Secured Payments');

slide5.addShape(pptx.shapes.RECTANGLE, {
  x: 0.8, y: 1.8, w: 11.7, h: 4.8,
  fill: { color: CARD_BG }, line: { color: ACCENT_GREEN, width: 1 }
});

slide5.addText('🔒 Zero Fraud & Instant Bank Reconciliation', {
  x: 1.2, y: 2.1, w: 11.0, h: 0.5, fontSize: 20, bold: true, color: ACCENT_GREEN, fontFace: 'Arial'
});

const securityPoints = [
  '• Automatic 12-Digit UTR Replay Guard: Every UPI payment transaction reference is verified before the order reaches your kitchen.',
  '• Upfront Payment Guarantee: Money is credited before food is prepared. No cash handling, no fake screenshots, no unpaid meals.',
  '• Instant Canteen Manager Dashboard: View total daily cash flow, UPI breakdown, and dish sales in real-time on your phone or tablet.',
  '• Direct Canteen Settlement: Money lands straight in your canteen UPI bank account with clear automated ledger records.'
];

securityPoints.forEach((point, idx) => {
  slide5.addText(point, {
    x: 1.2, y: 2.8 + (idx * 0.9), w: 10.8, h: 0.7, fontSize: 14, color: TEXT_WHITE, fontFace: 'Arial'
  });
});


// -------------------------------------------------------------
// SLIDE 6: Profit Pillar 3 - Zero Food Waste
// -------------------------------------------------------------
let slide6 = pptx.addSlide();
slide6.background = { color: BG_DARK };
addHeader(slide6, 'CANTEEN PROFIT PILLAR #3', 'Smart Pre-Order Inventory — Cut Food Waste by 80%');

slide6.addShape(pptx.shapes.RECTANGLE, {
  x: 0.8, y: 1.8, w: 5.6, h: 4.8,
  fill: { color: CARD_BG }, line: { color: BORDER_COLOR, width: 1 }
});
slide6.addText('🎯 Exact Demand Forecasting', {
  x: 1.1, y: 2.1, w: 5.0, h: 0.4, fontSize: 18, bold: true, color: ACCENT_AMBER, fontFace: 'Arial'
});
slide6.addText('No more guessing how many Samosas, Misal Pav, or Sandwiches to make. Your KDS shows exact quantities pre-ordered 15 minutes in advance, so your chef cooks precisely what is needed.', {
  x: 1.1, y: 2.7, w: 5.0, h: 3.5, fontSize: 13, color: TEXT_MUTED, fontFace: 'Arial'
});

slide6.addShape(pptx.shapes.RECTANGLE, {
  x: 6.8, y: 1.8, w: 5.7, h: 4.8,
  fill: { color: CARD_BG }, line: { color: ACCENT_GREEN, width: 1 }
});
slide6.addText('💰 Boost Net Profit Margins', {
  x: 7.1, y: 2.1, w: 5.1, h: 0.4, fontSize: 18, bold: true, color: ACCENT_GREEN, fontFace: 'Arial'
});
slide6.addText('Eliminating unsold food directly adds 5% to 8% straight to your canteen\'s net monthly profit margin. Higher average order values from combo pre-orders boost total ticket size by 30%.', {
  x: 7.1, y: 2.7, w: 5.1, h: 3.5, fontSize: 13, color: TEXT_WHITE, fontFace: 'Arial'
});


// -------------------------------------------------------------
// SLIDE 7: Kitchen Display System (KDS)
// -------------------------------------------------------------
let slide7 = pptx.addSlide();
slide7.background = { color: BG_DARK };
addHeader(slide7, 'FREE CANTEEN AUTOMATION', 'Kitchen Display System (KDS) — Built for Fast Kitchens');

const kdsFeatures = [
  { icon: '📱', title: '1-Tap Status Updates', desc: 'Tap "PREPARING" → "READY" → "DISPATCHED". Student receives instant SMS/WhatsApp & app alert.' },
  { icon: '🔊', title: 'Soundbox & Voice Pass', desc: 'Optional audio chime alerts kitchen staff when new pre-orders arrive during rush hour.' },
  { icon: '📊', title: 'Dish Morning Prep Mode', desc: 'See total dish preparation targets (e.g. "Prep 120 Vada Pav & 80 Cold Coffees") at a glance.' },
  { icon: '⚡', title: 'No Paper Tokens Needed', desc: 'Go 100% digital. Student shows optical QR pass on phone for 2-second scan verification.' }
];

kdsFeatures.forEach((feat, idx) => {
  const row = Math.floor(idx / 2);
  const col = idx % 2;
  const x = 0.8 + (col * 5.9);
  const y = 1.8 + (row * 2.5);

  slide7.addShape(pptx.shapes.RECTANGLE, {
    x: x, y: y, w: 5.6, h: 2.2,
    fill: { color: CARD_BG }, line: { color: BORDER_COLOR, width: 1 }
  });
  slide7.addText(`${feat.icon} ${feat.title}`, {
    x: x + 0.3, y: y + 0.2, w: 5.0, h: 0.4, fontSize: 16, bold: true, color: ACCENT_GREEN, fontFace: 'Arial'
  });
  slide7.addText(feat.desc, {
    x: x + 0.3, y: y + 0.7, w: 5.0, h: 1.3, fontSize: 12, color: TEXT_WHITE, fontFace: 'Arial'
  });
});


// -------------------------------------------------------------
// SLIDE 8: Canteen Financial Projection Table
// -------------------------------------------------------------
let slide8 = pptx.addSlide();
slide8.background = { color: BG_DARK };
addHeader(slide8, 'CANTEEN FINANCIAL GAINS', 'Estimated Monthly Canteen Revenue & Net Profit Comparison');

const tableHeader = [
  { text: 'BUSINESS METRIC', options: { fill: '1A2E26', color: ACCENT_GREEN, bold: true, fontSize: 12 } },
  { text: 'TRADITIONAL COUNTER', options: { fill: '1E1E2A', color: TEXT_MUTED, bold: true, fontSize: 12 } },
  { text: 'WITH FOODLINE CAMPUS', options: { fill: '00D4AA', color: '000000', bold: true, fontSize: 12 } },
  { text: 'YOUR CANTEEN PROFIT GAIN', options: { fill: 'FF6B2C', color: '000000', bold: true, fontSize: 12 } }
];

const tableRows = [
  ['Daily Break Meals Served', '180 Meals', '550 Meals', '+370 Extra Meals / Day'],
  ['Average Order Value (AOV)', '₹45 / Meal', '₹65 (Pre-Order Combos)', '+₹20 Basket Growth'],
  ['Daily Canteen Revenue', '₹8,100 / Day', '₹35,750 / Day', '+₹27,650 / Day Revenue'],
  ['Monthly Canteen Revenue (22 Days)', '₹1.78 Lakhs / Mo', '₹7.86 Lakhs / Mo', '+₹6.08 Lakhs / Month'],
  ['Est. Net Canteen Monthly Profit', '₹44,500 / Month', '₹1,96,500 / Month', '+₹1,52,000 Net Profit / Month']
];

const formattedTable = [
  tableHeader,
  ...tableRows.map((row, idx) => row.map((cell, cIdx) => ({
    text: cell,
    options: {
      fill: idx % 2 === 0 ? CARD_BG : '181824',
      color: cIdx === 3 ? ACCENT_GREEN : (cIdx === 2 ? TEXT_WHITE : TEXT_MUTED),
      bold: cIdx === 3 || cIdx === 0,
      fontSize: 11
    }
  })))
];

slide8.addTable(formattedTable, {
  x: 0.8, y: 1.8, w: 11.7, colW: [3.2, 2.7, 2.8, 3.0]
});


// -------------------------------------------------------------
// SLIDE 9: Zero Risk Setup
// -------------------------------------------------------------
let slide9 = pptx.addSlide();
slide9.background = { color: BG_DARK };
addHeader(slide9, 'EASY 10-MINUTE ONBOARDING', 'Zero Upfront Cost • Zero Hardware Purchase • Zero Risk');

const onboardingSteps = [
  { step: 'STEP 1', title: 'Free Menu Digitization', detail: 'We upload your complete canteen menu, photos, prices, and categories into FoodLine.' },
  { step: 'STEP 2', title: 'Any Phone or Tablet', detail: 'Use your existing Android phone or canteen tablet. No expensive machines or POS needed.' },
  { step: 'STEP 3', title: '10-Min Kitchen Training', detail: 'Our operational team trains your canteen staff on 1-tap order updates on-site.' },
  { step: 'STEP 4', title: '7-Day Risk-Free Trial', detail: 'Test FoodLine in your canteen with zero commitment. See the sales jump yourself!' }
];

onboardingSteps.forEach((s, idx) => {
  const y = 1.8 + (idx * 1.2);
  slide9.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8, y: y, w: 11.7, h: 1.0,
    fill: { color: CARD_BG }, line: { color: BORDER_COLOR, width: 1 }
  });
  slide9.addText(s.step, {
    x: 1.1, y: y + 0.35, w: 1.5, h: 0.3, fontSize: 13, bold: true, color: ACCENT_GREEN, fontFace: 'Arial'
  });
  slide9.addText(s.title, {
    x: 2.8, y: y + 0.18, w: 3.5, h: 0.3, fontSize: 15, bold: true, color: TEXT_WHITE, fontFace: 'Arial'
  });
  slide9.addText(s.detail, {
    x: 2.8, y: y + 0.52, w: 9.3, h: 0.4, fontSize: 12, color: TEXT_MUTED, fontFace: 'Arial'
  });
});


// -------------------------------------------------------------
// SLIDE 10: Call To Action
// -------------------------------------------------------------
let slide10 = pptx.addSlide();
slide10.background = { color: BG_DARK };

slide10.addShape(pptx.shapes.RECTANGLE, {
  x: 0.8, y: 0.8, w: 11.7, h: 5.8,
  fill: { color: CARD_BG }, line: { color: ACCENT_GREEN, width: 2 }, rectRadius: 0.2
});

slide10.addText('🤝 Let\'s Partner to Grow Your Canteen Business Today!', {
  x: 1.2, y: 1.2, w: 11.0, h: 0.6, fontSize: 26, bold: true, color: ACCENT_GREEN, fontFace: 'Arial'
});

slide10.addText('Start Serving 3x More Students With Zero Queue Chaos & Higher Monthly Net Profit', {
  x: 1.2, y: 1.8, w: 11.0, h: 0.5, fontSize: 16, color: TEXT_WHITE, fontFace: 'Arial'
});

slide10.addText('• Direct UPI Settlement to Your Canteen Account\n• 100% Free Staff Training & On-Site Launch Support\n• Live Pilot Proven: 544+ meals delivered with <45s average pickup time!', {
  x: 1.2, y: 2.5, w: 11.0, h: 1.5, fontSize: 14, color: TEXT_MUTED, fontFace: 'Arial'
});

slide10.addShape(pptx.shapes.RECTANGLE, {
  x: 1.2, y: 4.2, w: 10.9, h: 1.8,
  fill: { color: '1A2E26' }, line: { color: ACCENT_GREEN, width: 1 }
});

slide10.addText('📞 Contact Operations Team For Immediate Onboarding:', {
  x: 1.5, y: 4.4, w: 10.3, h: 0.3, fontSize: 14, bold: true, color: ACCENT_GREEN, fontFace: 'Arial'
});
slide10.addText('Shivam Nirmal — Founder & Operations Lead | FoodLine Campus\nPhone: +91 99600 91371 | Email: support@foodlinecampus.in\nPortal: https://foodline-campus.vercel.app', {
  x: 1.5, y: 4.8, w: 10.3, h: 1.0, fontSize: 14, color: TEXT_WHITE, fontFace: 'Arial'
});

// Save PPTX
const outputPath = '/run/media/darkkakashi/PC NVME/StartUp Project (FOODLINE CAMPUS)/PPT OTHER TASKES/FoodLine_Canteen_Manager_Pitch.pptx';

pptx.writeFile({ fileName: outputPath }).then(() => {
  console.log('✅ PowerPoint generated successfully at:', outputPath);
}).catch(err => {
  console.error('❌ Error generating PPTX:', err);
});
