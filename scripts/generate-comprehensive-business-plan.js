const PptxGenJS = require('../frontend/node_modules/pptxgenjs');
const fs = require('fs');
const path = require('path');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 13.333" x 7.5" 16:9 Widescreen

// -------------------------------------------------------------
// DESIGN PALETTE: Professional Business Plan Light Theme
// Soft warm paper white (#F8FAFC), Dark Charcoal (#0F172A), Slate (#334155)
// Emerald Green (#059669 / #10B981), Amber (#D97706), Red (#DC2626), Blue (#2563EB)
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

const ACCENT_AMBER = 'D97706';
const LIGHT_AMBER = 'FFFBEB';
const BORDER_AMBER = 'FDE68A';

const ACCENT_RED = 'DC2626';
const LIGHT_RED = 'FEF2F2';
const BORDER_RED = 'FECACA';

const ACCENT_BLUE = '2563EB';
const LIGHT_BLUE = 'EFF6FF';
const BORDER_BLUE = 'BFDBFE';

const LOGO_PATH = path.join(__dirname, '../foodline-campus-logo.png');
const HAS_LOGO = fs.existsSync(LOGO_PATH);

// Helper function for consistent header styling
function addHeader(slide, category, title, subtitle) {
  // Category Pill Badge
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 0.45, w: 3.2, h: 0.32,
    fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.08
  });
  slide.addText(category.toUpperCase(), {
    x: 0.8, y: 0.45, w: 3.2, h: 0.32,
    fontSize: 10, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: FONT_HEAD
  });

  // Top right branding text
  slide.addText('FOODLINE CAMPUS • BUSINESS PLAN', {
    x: 8.5, y: 0.45, w: 4.0, h: 0.32,
    fontSize: 9, bold: true, color: TEXT_MUTED, align: 'right', fontFace: FONT_HEAD
  });

  // Title
  slide.addText(title, {
    x: 0.8, y: 0.85, w: 11.7, h: 0.55,
    fontSize: 22, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
  });

  // Subtitle
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.8, y: 1.4, w: 11.7, h: 0.35,
      fontSize: 12, color: TEXT_MUTED, fontFace: FONT_BODY
    });
  }
}

// Helper function for slide footer
function addFooter(slide, slideNum, totalSlides = 32) {
  slide.addText(`FoodLine Campus Technologies • Confidential Business Plan`, {
    x: 0.8, y: 7.05, w: 7.0, h: 0.3,
    fontSize: 9, color: TEXT_MUTED, fontFace: FONT_BODY
  });
  slide.addText(`${slideNum} / ${totalSlides}`, {
    x: 10.0, y: 7.05, w: 2.5, h: 0.3,
    fontSize: 9, bold: true, color: TEXT_MUTED, align: 'right', fontFace: FONT_HEAD
  });
}

console.log('Building 32-Slide Comprehensive Business Plan PPTX...');

// ==============================================================================
// SLIDE 1: COVER SLIDE
// ==============================================================================
let s1 = pptx.addSlide();
s1.background = { color: BG_COLOR };

s1.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 13.333, h: 0.15,
  fill: { color: PRIMARY_GREEN }, line: { color: PRIMARY_GREEN }
});

s1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 0.8, w: 4.2, h: 0.36,
  fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.1
});
s1.addText('STRATEGIC BUSINESS PLAN (2026 – 2031)', {
  x: 0.8, y: 0.8, w: 4.2, h: 0.36,
  fontSize: 10, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: FONT_HEAD
});

if (HAS_LOGO) {
  s1.addImage({ path: LOGO_PATH, x: 11.0, y: 0.6, w: 1.5, h: 0.6 });
}

s1.addText('BUSINESS PLAN\nFoodLine Campus', {
  x: 0.8, y: 1.35, w: 11.7, h: 1.1,
  fontSize: 38, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD, lineSpacingMultiple: 1.1
});

s1.addText('Zero-Queue Express Food Ordering & Kitchen Automation for College Campuses', {
  x: 0.8, y: 2.55, w: 11.7, h: 0.45,
  fontSize: 16, bold: true, color: PRIMARY_GREEN, fontFace: FONT_HEAD
});

// Meta Information Card (Matching reference format)
s1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 3.2, w: 11.7, h: 2.2,
  fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1.5 }, rectRadius: 0.12
});

const metaPoints = [
  '• Venture Name: FoodLine Campus Technologies Pvt. Ltd.',
  '• Core Domain: Campus Food-Tech, Kitchen Automation & Express Rail Pickup',
  '• Presented By: Shivam & FoodLine Core Founders',
  '• Pilot Campus: Sanjivani University (Cafe @7 Outlet), Kopargaon, Maharashtra',
  '• 5-Year Target: Scale to 50 Campuses, 30 Lakh+ Orders/Year, ₹24 Cr GMV & ₹92 Lakh Net Profit',
  '• Goldmine Target: This business plan is designed to help achieve total Goldmine Amount ₹3,44,57,81,800 (₹344.58 Cr)'
];
s1.addText(metaPoints.join('\n'), {
  x: 1.1, y: 3.4, w: 11.1, h: 1.8,
  fontSize: 13, color: TEXT_DARK, fontFace: FONT_BODY, lineSpacingMultiple: 1.3
});

// Bottom Highlight Banner
s1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 5.65, w: 11.7, h: 1.1,
  fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1.5 }, rectRadius: 0.12
});
s1.addText('EXECUTIVE VISION STATEMENT:', {
  x: 1.1, y: 5.75, w: 11.1, h: 0.25,
  fontSize: 11, bold: true, color: PRIMARY_GREEN, fontFace: FONT_HEAD
});
s1.addText('"This business plan is structured to scale FoodLine Campus from our single 2,500-student pilot into India\'s leading campus food ordering rail, achieving healthy unit profitability and progressing towards our total Goldmine Target of ₹3,44,57,81,800 (₹344.58 Cr)."', {
  x: 1.1, y: 6.05, w: 11.1, h: 0.55,
  fontSize: 13, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
});

addFooter(s1, 1);
s1.addNotes(`SLIDE 1: BUSINESS PLAN COVER
FoodLine Campus is an express food pre-ordering rail and kitchen automation system designed specifically for college campuses.
This business plan outlines the market problem, technological solution, operational model, and the 5-year financial trajectory based on our tested pilot unit economics.`);


// ==============================================================================
// SLIDE 2: VISION AND MISSION
// ==============================================================================
let s2 = pptx.addSlide();
s2.background = { color: BG_COLOR };
addHeader(s2, 'FOUNDATIONAL PILLARS', 'Vision and Mission', 'Defining the long-term purpose and daily operational commitments of FoodLine Campus');

// Vision Card
s2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.9, w: 5.7, h: 4.85,
  fill: { color: CARD_BG }, line: { color: BORDER_GREEN, width: 2 }, rectRadius: 0.12
});
s2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 1.1, y: 2.15, w: 2.2, h: 0.35,
  fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.08
});
s2.addText('OUR VISION', {
  x: 1.1, y: 2.15, w: 2.2, h: 0.35,
  fontSize: 11, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: FONT_HEAD
});

s2.addText('To become India\'s most trusted and widespread campus food-tech and kitchen automation platform, eliminating dining queues across 500+ universities and colleges nationwide.', {
  x: 1.1, y: 2.7, w: 5.1, h: 1.5,
  fontSize: 16, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD, lineSpacingMultiple: 1.2
});

s2.addText('Key Visionary Milestones:\n• Zero-Wait Campus Dining: Every meal collected in < 30 seconds\n• 100% Cashless & Fraud-Free: Direct bank verification on all orders\n• Kitchen Empowerment: Modernizing unorganized campus canteens with free intelligent software', {
  x: 1.1, y: 4.3, w: 5.1, h: 2.2,
  fontSize: 12, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
});

// Mission Card
s2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.8, y: 1.9, w: 5.7, h: 4.85,
  fill: { color: CARD_BG }, line: { color: BORDER_BLUE, width: 2 }, rectRadius: 0.12
});
s2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.1, y: 2.15, w: 2.2, h: 0.35,
  fill: { color: LIGHT_BLUE }, line: { color: BORDER_BLUE, width: 1 }, rectRadius: 0.08
});
s2.addText('OUR MISSION', {
  x: 7.1, y: 2.15, w: 2.2, h: 0.35,
  fontSize: 11, bold: true, color: ACCENT_BLUE, align: 'center', fontFace: FONT_HEAD
});

s2.addText('To give every student back their precious 15-minute break time through seamless digital pre-ordering, while empowering canteen managers to double rush-hour sales with zero kitchen chaos.', {
  x: 7.1, y: 2.7, w: 5.1, h: 1.5,
  fontSize: 16, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD, lineSpacingMultiple: 1.2
});

s2.addText('Operational Commitments:\n• Extreme Simplicity: 10-second order flow for students, 1-tap KDS for cooks\n• Absolute Financial Security: Zero fake screenshot leakage for canteens\n• High Quality Dining: Freshly prepared meals waiting hot at recess bell', {
  x: 7.1, y: 4.3, w: 5.1, h: 2.2,
  fontSize: 12, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
});

addFooter(s2, 2);
s2.addNotes(`SLIDE 2: VISION & MISSION
Vision: Eliminate dining lines across 500+ Indian university campuses.
Mission: Give students their break back, provide hot food on time, and enable canteens to scale volume without extra staff or chaotic physical queues.`);


// ==============================================================================
// SLIDE 3: EXECUTIVE SUMMARY
// ==============================================================================
let s3 = pptx.addSlide();
s3.background = { color: BG_COLOR };
addHeader(s3, 'EXECUTIVE OVERVIEW', 'Executive Summary', 'A high-level synthesis of FoodLine Campus, our market opportunity, and 5-year roadmap');

const execPoints = [
  {
    title: 'Who We Are',
    desc: 'FoodLine Campus is a proprietary campus dining rail founded by a student-led engineering team. We solve the acute 15-minute break rush-hour bottleneck experienced by millions of university students daily.',
    icon: '🏢'
  },
  {
    title: 'Core Problem Solved',
    desc: 'Recess is only 15 minutes, but manual canteen lines take 18+ minutes. 50% of students skip meals, while canteens lose ₹1,000–₹3,000 weekly to fake UPI screenshots. Swiggy/Zomato are barred at campus gates and cost more in delivery fees than the food itself.',
    icon: '⚡'
  },
  {
    title: 'Our Complete Solution',
    desc: 'Students pre-order from class via mobile web/app with instant UPI. Canteen cooks receive color-coded tickets on a Kitchen Display System (KDS). Smart slot throttling prevents kitchen panic. Students collect in 30 seconds with a 4-digit OTP.',
    icon: '🚀'
  },
  {
    title: '5-Year Business Plan Target',
    desc: 'Scale from our pilot at Sanjivani University (2,500 students) to 50 Campuses, processing 30 Lakh orders/year, generating ₹24 Crore annual GMV, ₹2.22 Crore platform revenue, and ₹92 Lakh annual net profit.',
    icon: '📈'
  }
];

execPoints.forEach((ep, idx) => {
  const y = 1.9 + (idx * 1.15);
  s3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: y, w: 11.7, h: 1.05,
    fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }, rectRadius: 0.1
  });
  s3.addText(ep.title, {
    x: 1.1, y: y + 0.12, w: 3.5, h: 0.3,
    fontSize: 14, bold: true, color: PRIMARY_GREEN, fontFace: FONT_HEAD
  });
  s3.addText(ep.desc, {
    x: 1.1, y: y + 0.42, w: 11.1, h: 0.55,
    fontSize: 11, color: TEXT_BODY, fontFace: FONT_BODY
  });
});

// Bottom Philosophy Banner
s3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 6.6, w: 11.7, h: 0.4,
  fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.08
});
s3.addText('CORE PHILOSOPHY: "Creating Zero-Queue Dining • Building Financial Trust • Empowering Campus Productivity"', {
  x: 0.8, y: 6.6, w: 11.7, h: 0.4,
  fontSize: 11, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: FONT_HEAD
});

addFooter(s3, 3);
s3.addNotes(`SLIDE 3: EXECUTIVE SUMMARY
Key takeaway: We have identified a severe, daily pain point in a captive university environment. We combine pre-ordering, kitchen throttled batching, and 100% fraud-proof payments into an asset-light, high-margin software business.`);


// ==============================================================================
// SLIDE 4: BUSINESS OBJECTIVES & KEY MILESTONES (Replaces blank Page 4)
// ==============================================================================
let s4 = pptx.addSlide();
s4.background = { color: BG_COLOR };
addHeader(s4, 'STRATEGIC ROADMAP', 'Business Objectives & Milestone Roadmap', 'Phased roll-out strategy from single campus validation to statewide scale');

const phases = [
  {
    phase: 'PHASE 1 (M1–M3)',
    title: 'Pilot Launch & Proof of Concept',
    campuses: '1 Campus (Sanjivani University)',
    users: '1,000 Active Students',
    gmv: '₹48 Lakhs GMV / Year',
    rev: '₹1.92 Lakhs Revenue (4% Student Fee)',
    status: 'Ready to Deploy',
    tint: LIGHT_GREEN,
    border: BORDER_GREEN,
    color: PRIMARY_GREEN,
    goals: [
      'Launch at Cafe @7 canteen outlet',
      'Validate 30-sec pickup turnaround',
      'Eliminate 100% of fake UPI scams',
      'Reach operational break-even'
    ]
  },
  {
    phase: 'PHASE 2 (M4–M12)',
    title: 'Regional Cluster Expansion',
    campuses: '5 Campuses (Nashik & Ahmednagar)',
    users: '5,000 Active Students',
    gmv: '₹2.40 Crore GMV / Year',
    rev: '₹22.2 Lakhs Revenue',
    status: 'Cluster Growth',
    tint: LIGHT_BLUE,
    border: BORDER_BLUE,
    color: ACCENT_BLUE,
    goals: [
      'Expand to engineering & MBA hubs',
      'Deploy multi-vendor court support',
      'Onboard 5 canteens with zero Capex',
      'Generate ₹7.20 Lakh net profit'
    ]
  },
  {
    phase: 'PHASE 3 (Y2–Y3)',
    title: 'Statewide University Network',
    campuses: '15 Campuses (Pune & Western MH)',
    users: '15,000 Active Students',
    gmv: '₹7.20 Crore GMV / Year',
    rev: '₹66.6 Lakhs Revenue',
    status: 'Statewide Scale',
    tint: LIGHT_AMBER,
    border: BORDER_AMBER,
    color: ACCENT_AMBER,
    goals: [
      'Enter Pune educational clusters',
      'Introduce student monthly meal passes',
      'Partner with FMCG beverage brands',
      'Achieve ₹24.0 Lakh net profit'
    ]
  },
  {
    phase: 'PHASE 4 (Y4–Y5)',
    title: 'National Scale & Ecosystem',
    campuses: '50 Campuses Nationwide',
    users: '50,000 Active Students',
    gmv: '₹24.00 Crore GMV / Year',
    rev: '₹2.22 Crore Revenue',
    status: 'Market Leadership',
    tint: LIGHT_GREEN,
    border: PRIMARY_GREEN,
    color: PRIMARY_GREEN,
    goals: [
      'Expand to 50 top universities',
      'Process 30 Lakh orders per year',
      'Integrate university smart ID cards',
      'Achieve ₹92 Lakh annual net profit'
    ]
  }
];

phases.forEach((ph, idx) => {
  const x = 0.8 + (idx * 3.0);
  s4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 1.9, w: 2.8, h: 4.85,
    fill: { color: CARD_BG }, line: { color: ph.border, width: 1.5 }, rectRadius: 0.1
  });

  // Phase Badge
  s4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.2, y: 2.1, w: 2.4, h: 0.3,
    fill: { color: ph.tint }, line: { color: ph.border, width: 1 }, rectRadius: 0.08
  });
  s4.addText(ph.phase, {
    x: x + 0.2, y: 2.1, w: 2.4, h: 0.3,
    fontSize: 9, bold: true, color: ph.color, align: 'center', fontFace: FONT_HEAD
  });

  s4.addText(ph.title, {
    x: x + 0.2, y: 2.48, w: 2.4, h: 0.45,
    fontSize: 12, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
  });

  s4.addText(`${ph.campuses}\n${ph.users}\nGMV: ${ph.gmv}\nRev: ${ph.rev}`, {
    x: x + 0.2, y: 3.0, w: 2.4, h: 1.1,
    fontSize: 10, bold: true, color: ph.color, fontFace: FONT_HEAD, lineSpacingMultiple: 1.15
  });

  s4.addText('KEY DELIVERABLES:', {
    x: x + 0.2, y: 4.2, w: 2.4, h: 0.25,
    fontSize: 9, bold: true, color: TEXT_MUTED, fontFace: FONT_HEAD
  });

  const gList = ph.goals.map(g => `• ${g}`).join('\n');
  s4.addText(gList, {
    x: x + 0.2, y: 4.45, w: 2.4, h: 2.1,
    fontSize: 10, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
  });
});

addFooter(s4, 4);
s4.addNotes(`SLIDE 4: OBJECTIVES & MILESTONES
Our 4-phase rollout ensures that each stage is funded by cashflows from the previous stage:
Phase 1: Pilot at Sanjivani University (prove unit economics)
Phase 2: 5 Campuses in regional cluster
Phase 3: 15 Campuses across Pune & Maharashtra
Phase 4: 50 Campuses across India.`);


// ==============================================================================
// SLIDE 5: SWOT ANALYSIS
// ==============================================================================
let s5 = pptx.addSlide();
s5.background = { color: BG_COLOR };
addHeader(s5, 'STRATEGIC EVALUATION', 'SWOT Analysis', 'Evaluating internal competencies, areas for vigilance, market opportunities, and risk controls');

const swotCards = [
  {
    title: 'STRENGTHS',
    color: PRIMARY_GREEN,
    tint: LIGHT_GREEN,
    border: BORDER_GREEN,
    x: 0.8, y: 1.9,
    points: [
      '30-Second express pickup rail solves 15-min recess trap',
      '100% fraud-proof UPI with cryptographic 12-digit UTR checks',
      'Proprietary kitchen capacity slot throttling prevents rush panic',
      'Asset-light model (zero delivery bikes, zero driver payroll)',
      'Dual-sync PostgreSQL + Google Sheets provides offline resilience',
      '23/23 Automated security and integrity tests passed'
    ]
  },
  {
    title: 'WEAKNESSES',
    color: ACCENT_AMBER,
    tint: LIGHT_AMBER,
    border: BORDER_AMBER,
    x: 6.8, y: 1.9,
    points: [
      'Early brand awareness limited to pilot college cluster',
      'Requires initial behavioral shift among traditional kitchen cooks',
      'Vulnerability to campus Wi-Fi / cellular data fluctuations',
      'Revenue seasonal dip during semester break vacations',
      'Need for on-ground student ambassadors during first 2 weeks'
    ]
  },
  {
    title: 'OPPORTUNITIES',
    color: ACCENT_BLUE,
    tint: LIGHT_BLUE,
    border: BORDER_BLUE,
    x: 0.8, y: 4.4,
    points: [
      '40,000+ Indian colleges with 40 Million captive students',
      'Skyrocketing UPI adoption and digital payments among Gen-Z',
      'Total inability of Swiggy/Zomato to enter campus gates',
      'Expansion into campus food courts, juice bars & night canteens',
      'Brand sampling and sponsored student discounts from FMCG brands'
    ]
  },
  {
    title: 'THREATS',
    color: ACCENT_RED,
    tint: LIGHT_RED,
    border: BORDER_RED,
    x: 6.8, y: 4.4,
    points: [
      'Bureaucratic approval delays from conservative university deans',
      'Canteen tender contract turnovers every 2 to 3 years',
      'Payment gateway downtime or unexpected NPCI policy shifts',
      'Potential copycats attempting unthrottled QR ordering systems',
      'Staff pushback if tablet workflow is not kept ultra-simple'
    ]
  }
];

swotCards.forEach(sc => {
  s5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: sc.x, y: sc.y, w: 5.7, h: 2.35,
    fill: { color: CARD_BG }, line: { color: sc.border, width: 1.5 }, rectRadius: 0.1
  });

  s5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: sc.x + 0.25, y: sc.y + 0.15, w: 2.2, h: 0.3,
    fill: { color: sc.tint }, line: { color: sc.border, width: 1 }, rectRadius: 0.08
  });
  s5.addText(sc.title, {
    x: sc.x + 0.25, y: sc.y + 0.15, w: 2.2, h: 0.3,
    fontSize: 10, bold: true, color: sc.color, align: 'center', fontFace: FONT_HEAD
  });

  const pText = sc.points.map(p => `• ${p}`).join('\n');
  s5.addText(pText, {
    x: sc.x + 0.25, y: sc.y + 0.52, w: 5.2, h: 1.7,
    fontSize: 10, color: TEXT_DARK, fontFace: FONT_BODY, lineSpacingMultiple: 1.15
  });
});

addFooter(s5, 5);
s5.addNotes(`SLIDE 5: SWOT ANALYSIS
Strengths: Solving a captive problem with high gross margin (67%) and zero fleet Capex.
Weaknesses: Early stage and semester seasonality.
Opportunities: 40,000+ colleges where delivery apps cannot operate.
Threats: Administrative red-tape, mitigated by proving canteen profitability in 30 days.`);


// ==============================================================================
// SLIDE 6: LEGAL & COMPLIANCE
// ==============================================================================
let s6 = pptx.addSlide();
s6.background = { color: BG_COLOR };
addHeader(s6, 'REGULATORY INTEGRITY', 'Legal, Compliance & Licensing Framework', 'Ensuring enterprise-grade legal, financial, and regulatory governance across all partner campuses');

const legalSections = [
  {
    num: '01',
    title: 'Corporate Legal Structure',
    items: [
      'Entity Type: Private Limited Company (FoodLine Campus Technologies Pvt. Ltd.)',
      'Registrar of Companies (RoC) Incorporation under Companies Act 2013',
      'Udyam MSME Registration for Startup India benefits and incubation grants',
      'Registered Office in Maharashtra with formal Founders Agreement'
    ]
  },
  {
    num: '02',
    title: 'Financial & Tax Compliance',
    items: [
      'Goods and Services Tax (GST) Registration for platform convenience fees',
      'Permanent Account Number (PAN) & Corporate Current Bank Accounts',
      'Quarterly GST filing, TDS deductions, and annual statutory auditing',
      'NPCI & RBI Compliant UPI merchant aggregator rails'
    ]
  },
  {
    num: '03',
    title: 'Food Safety & Campus Contracts',
    items: [
      'FSSAI Licensing Verification: All partner canteens must hold active FSSAI licenses',
      'Campus Service Level Agreements (SLAs) signed with university management',
      'Clear liability limitation clauses covering food preparation quality',
      'Canteen vendor agreements defining 24-hour settlement terms and SaaS fees'
    ]
  },
  {
    num: '04',
    title: 'Data Privacy & Digital Security',
    items: [
      'Digital Personal Data Protection (DPDP) Act 2023 compliance',
      'Zero storage of student credit card/debit card numbers or UPI PINs',
      'End-to-End SSL/TLS 1.3 encryption across all client and kitchen endpoints',
      'Transparent Terms of Service and Privacy Policy published in-app'
    ]
  }
];

legalSections.forEach((ls, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + (col * 6.0);
  const y = 1.9 + (row * 2.45);

  s6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: y, w: 5.7, h: 2.25,
    fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1.5 }, rectRadius: 0.12
  });

  s6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.3, y: y + 0.2, w: 0.6, h: 0.3,
    fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.08
  });
  s6.addText(ls.num, {
    x: x + 0.3, y: y + 0.2, w: 0.6, h: 0.3,
    fontSize: 10, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: FONT_HEAD
  });

  s6.addText(ls.title, {
    x: x + 1.0, y: y + 0.2, w: 4.4, h: 0.3,
    fontSize: 13, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
  });

  const iText = ls.items.map(it => `• ${it}`).join('\n');
  s6.addText(iText, {
    x: x + 0.3, y: y + 0.6, w: 5.1, h: 1.5,
    fontSize: 10.5, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.15
  });
});

addFooter(s6, 6);
s6.addNotes(`SLIDE 6: LEGAL & COMPLIANCE
We adhere strictly to corporate regulations (Pvt Ltd), tax compliance (GST/TDS), food safety standards (partner FSSAI verification), and data privacy laws (DPDP Act).
Our canteen agreements establish clear SLA boundaries and automatic daily financial settlements.`);


// ==============================================================================
// SLIDE 7: CLIENT PROBLEMS AND OUR SOLUTION
// ==============================================================================
let s7 = pptx.addSlide();
s7.background = { color: BG_COLOR };
addHeader(s7, 'PROBLEM VS SOLUTION', 'Client Problems and Our Solution', 'Side-by-side comparative mapping of everyday campus food friction to FoodLine technology');

const comparisons = [
  {
    problem: '15-Minute Recess vs 18-Minute Queue: 50% of students skip lunch or arrive late to class.',
    solution: '30-Second Express Pickup: Pre-order during lectures, walk straight to counter, flash OTP, done.'
  },
  {
    problem: 'Kitchen Shouting & Burnout: Cooks face 100 students yelling orders at once; food burns, wrong orders dispatched.',
    solution: 'Smart Slot Capacity Throttling: App caps orders to kitchen equipment limits (e.g. 25 orders/10 min); smooth, paced workflow.'
  },
  {
    problem: 'Canteen UPI Fraud Leakage: Students flash fake payment screenshots in dense crowds; canteens lose ₹1,000–₹3,000/week.',
    solution: '100% Cryptographic UTR Shield: Every bank reference checked; duplicate UTRs blocked; ticket created ONLY after confirmed credit.'
  },
  {
    problem: 'Swiggy / Zomato Unusable on Campus: Bikes barred at campus gates; delivery fee (₹40–₹50) exceeds the price of the snack; 40-min wait.',
    solution: 'Hyper-Local Campus Express Rail: Zero delivery fee, food prepared 200m away in existing canteen, collected in 30 seconds.'
  }
];

// Left Problem Card
s7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.9, w: 5.7, h: 4.85,
  fill: { color: LIGHT_RED }, line: { color: BORDER_RED, width: 1.5 }, rectRadius: 0.12
});
s7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 1.1, y: 2.1, w: 3.5, h: 0.32,
  fill: { color: 'FFFFFF' }, line: { color: BORDER_RED, width: 1 }, rectRadius: 0.08
});
s7.addText('STUDENT & CANTEEN PAIN POINTS', {
  x: 1.1, y: 2.1, w: 3.5, h: 0.32,
  fontSize: 10, bold: true, color: ACCENT_RED, align: 'center', fontFace: FONT_HEAD
});

const probText = comparisons.map((c, i) => `${i+1}. ${c.problem}`).join('\n\n');
s7.addText(probText, {
  x: 1.1, y: 2.55, w: 5.1, h: 4.0,
  fontSize: 11, color: TEXT_DARK, fontFace: FONT_BODY, lineSpacingMultiple: 1.15
});

// Right Solution Card
s7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.8, y: 1.9, w: 5.7, h: 4.85,
  fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1.5 }, rectRadius: 0.12
});
s7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.1, y: 2.1, w: 3.5, h: 0.32,
  fill: { color: 'FFFFFF' }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.08
});
s7.addText('FOODLINE CAMPUS SOLUTIONS', {
  x: 7.1, y: 2.1, w: 3.5, h: 0.32,
  fontSize: 10, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: FONT_HEAD
});

const solText = comparisons.map((c, i) => `${i+1}. ${c.solution}`).join('\n\n');
s7.addText(solText, {
  x: 7.1, y: 2.55, w: 5.1, h: 4.0,
  fontSize: 11, color: TEXT_DARK, fontFace: FONT_BODY, lineSpacingMultiple: 1.15
});

addFooter(s7, 7);
s7.addNotes(`SLIDE 7: PROBLEMS & SOLUTIONS
This slide demonstrates the direct 1-to-1 solution FoodLine provides for every single operational pain point on campus today.`);


// ==============================================================================
// SLIDE 8: BUSINESS DESCRIPTION
// ==============================================================================
let s8 = pptx.addSlide();
s8.background = { color: BG_COLOR };
addHeader(s8, 'OPERATING IDENTITY', 'Business Description', 'Who we are, what we do, and the foundational pillars underpinning our operating model');

s8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.9, w: 11.7, h: 1.25,
  fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1.5 }, rectRadius: 0.12
});
s8.addText('FoodLine Campus is an express digital food ordering and kitchen automation system purpose-built for colleges and universities. We bridge the gap between hungry students on a tight schedule and overwhelmed campus canteens.\n\nFounded on the principles of speed, transparency, operational efficiency, and financial integrity, FoodLine provides a turnkey technology rail requiring zero capital investment from canteen operators.', {
  x: 1.1, y: 2.05, w: 11.1, h: 0.95,
  fontSize: 12, color: TEXT_DARK, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
});

const descPillars = [
  { title: 'Zero-Queue Dining', desc: 'Transforming recess chaos into smooth 30-sec pickups', color: PRIMARY_GREEN, tint: LIGHT_GREEN, border: BORDER_GREEN },
  { title: 'Kitchen Pacing', desc: 'Smart slot throttling that eliminates rush-hour panic', color: ACCENT_BLUE, tint: LIGHT_BLUE, border: BORDER_BLUE },
  { title: '100% Financial Trust', desc: 'Cryptographic UTR checks preventing all screenshot fraud', color: ACCENT_AMBER, tint: LIGHT_AMBER, border: BORDER_AMBER },
  { title: 'Asset-Light Scaling', desc: 'Zero delivery bikes, zero driver payroll, zero Capex', color: PRIMARY_GREEN, tint: LIGHT_GREEN, border: BORDER_GREEN },
  { title: 'Turnkey Simplicity', desc: '10-Minute staff onboarding on any basic Android tablet', color: ACCENT_BLUE, tint: LIGHT_BLUE, border: BORDER_BLUE }
];

descPillars.forEach((dp, idx) => {
  const x = 0.8 + (idx * 2.4);
  s8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 3.35, w: 2.2, h: 3.4,
    fill: { color: CARD_BG }, line: { color: dp.border, width: 1.5 }, rectRadius: 0.1
  });

  s8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.15, y: 3.5, w: 1.9, h: 0.35,
    fill: { color: dp.tint }, line: { color: dp.border, width: 1 }, rectRadius: 0.08
  });
  s8.addText(`PILLAR 0${idx+1}`, {
    x: x + 0.15, y: 3.5, w: 1.9, h: 0.35,
    fontSize: 9, bold: true, color: dp.color, align: 'center', fontFace: FONT_HEAD
  });

  s8.addText(dp.title, {
    x: x + 0.15, y: 4.0, w: 1.9, h: 0.5,
    fontSize: 13, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
  });

  s8.addText(dp.desc, {
    x: x + 0.15, y: 4.6, w: 1.9, h: 1.9,
    fontSize: 11, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
  });
});

addFooter(s8, 8);
s8.addNotes(`SLIDE 8: BUSINESS DESCRIPTION
We are an asset-light software rail. We don't hire delivery riders or rent kitchens. We optimize existing canteen capacity and capture high-frequency campus cash flow.`);


// ==============================================================================
// SLIDE 9: SERVICE DESCRIPTION (4 Modules)
// ==============================================================================
let s9 = pptx.addSlide();
s9.background = { color: BG_COLOR };
addHeader(s9, 'PRODUCT ARCHITECTURE', 'Service Description: The 4 Core Modules', 'An integrated ecosystem connecting students, kitchen staff, and canteen management');

const modules = [
  {
    num: 'MODULE 1',
    title: 'Student Mobile Web & App',
    bullets: [
      'Zero-install instant Progressive Web App (PWA) + Android APK',
      'Digital menu with live dish availability and pricing',
      'Break-slot selector (1:15 PM, 1:25 PM, etc.) for batching',
      'One-tap UPI payment with instant payment confirmation',
      'Digital Boarding Pass with large 4-digit OTP & QR code'
    ],
    tint: LIGHT_GREEN,
    border: BORDER_GREEN,
    color: PRIMARY_GREEN
  },
  {
    num: 'MODULE 2',
    title: 'Kitchen Display System (KDS)',
    bullets: [
      'Runs on any affordable 10-inch Android tablet or phone',
      'Real-time order tickets with high-visibility color codes',
      'Chime audio alerts whenever a new order arrives',
      'Large 1-tap touch buttons (Cooking ➔ Ready ➔ Collected)',
      'Automated WhatsApp/In-App notification when meal is ready'
    ],
    tint: LIGHT_BLUE,
    border: BORDER_BLUE,
    color: ACCENT_BLUE
  },
  {
    num: 'MODULE 3',
    title: 'Smart Slot Throttling Engine',
    bullets: [
      'Configurable kitchen prep capacity limits (e.g. 25 meals / 10 min)',
      'Prevents order flooding and equipment bottlenecks',
      'Automatically shifts excess demand to subsequent break slots',
      'Displays real-time kitchen load meter for staff',
      'Eliminates rush panic and surplus food spoilage'
    ],
    tint: LIGHT_AMBER,
    border: BORDER_AMBER,
    color: ACCENT_AMBER
  },
  {
    num: 'MODULE 4',
    title: 'Manager Portal & Reconciliation',
    bullets: [
      'Real-time daily GMV, order volume, and net revenue dashboard',
      '100% Cryptographic UTR verification and duplicate blocker',
      'Two-way real-time Google Sheets dual-sync for canteen owner',
      'Menu item toggling (mark sold-out dishes in 1 second)',
      'Automated daily settlement breakdown and commission logs'
    ],
    tint: LIGHT_GREEN,
    border: BORDER_GREEN,
    color: PRIMARY_GREEN
  }
];

modules.forEach((m, idx) => {
  const x = 0.8 + (idx * 3.0);
  s9.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 1.9, w: 2.8, h: 4.85,
    fill: { color: CARD_BG }, line: { color: m.border, width: 1.5 }, rectRadius: 0.1
  });

  s9.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.2, y: 2.1, w: 2.4, h: 0.3,
    fill: { color: m.tint }, line: { color: m.border, width: 1 }, rectRadius: 0.08
  });
  s9.addText(m.num, {
    x: x + 0.2, y: 2.1, w: 2.4, h: 0.3,
    fontSize: 9, bold: true, color: m.color, align: 'center', fontFace: FONT_HEAD
  });

  s9.addText(m.title, {
    x: x + 0.2, y: 2.5, w: 2.4, h: 0.45,
    fontSize: 13, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
  });

  const bList = m.bullets.map(b => `• ${b}`).join('\n\n');
  s9.addText(bList, {
    x: x + 0.2, y: 3.05, w: 2.4, h: 3.5,
    fontSize: 10, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.15
  });
});

addFooter(s9, 9);
s9.addNotes(`SLIDE 9: SERVICE DESCRIPTION
FoodLine delivers 4 integrated modules:
1. Student App for pre-ordering
2. Kitchen Display System for kitchen staff
3. Capacity Engine for throttling orders
4. Manager Portal for daily accounting and automated reconciliation.`);


// ==============================================================================
// SLIDE 10: INTELLECTUAL PROPERTY (Replaces blank Page 10)
// ==============================================================================
let s10 = pptx.addSlide();
s10.background = { color: BG_COLOR };
addHeader(s10, 'PROPRIETARY ASSETS', 'Intellectual Property (IP) & Tech Moats', 'Defensible proprietary code, algorithmic logic, and brand equity protecting FoodLine Campus');

const ipCards = [
  {
    title: 'Proprietary Source Code',
    badge: 'SOFTWARE IP',
    desc: '• Complete proprietary Next.js 15 PWA and Capacitor Android codebase\n• Real-time Server-Sent Events (SSE) kitchen dispatch pipeline\n• Sub-second optimistic UI rendering for low-bandwidth campus cellular 4G',
    color: PRIMARY_GREEN, tint: LIGHT_GREEN, border: BORDER_GREEN
  },
  {
    title: 'Dynamic Slot Throttling Algorithm',
    badge: 'ALGORITHMIC IP',
    desc: '• Custom algorithm dynamically calculating kitchen load based on cooking times\n• Automated slot reallocation preventing counter stampedes and food burns\n• Predictive order batching engine calculating dish prep head-starts',
    color: ACCENT_BLUE, tint: LIGHT_BLUE, border: BORDER_BLUE
  },
  {
    title: 'Anti-Fraud Cryptographic Shield',
    badge: 'SECURITY IP',
    desc: '• Proprietary 12-digit UTR replay attack detection database\n• SHA-256 HMAC digital signature verification on all pickup tokens\n• Real-time soundbox audio API bridge for instant payment verification',
    color: ACCENT_RED, tint: LIGHT_RED, border: BORDER_RED
  },
  {
    title: 'Brand, Trademarks & Trade Secrets',
    badge: 'TRADEMARK & DESIGN',
    desc: '• FoodLine Campus™ trademark registration and distinctive visual identity\n• Standardized "Campus Express Pickup Rail" operational SOPs\n• Proprietary PostgreSQL to Google Sheets two-way reconciliation connector',
    color: ACCENT_AMBER, tint: LIGHT_AMBER, border: BORDER_AMBER
  }
];

ipCards.forEach((ip, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + (col * 6.0);
  const y = 1.9 + (row * 2.45);

  s10.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: y, w: 5.7, h: 2.25,
    fill: { color: CARD_BG }, line: { color: ip.border, width: 1.5 }, rectRadius: 0.12
  });

  s10.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.3, y: y + 0.2, w: 2.2, h: 0.28,
    fill: { color: ip.tint }, line: { color: ip.border, width: 1 }, rectRadius: 0.08
  });
  s10.addText(ip.badge, {
    x: x + 0.3, y: y + 0.2, w: 2.2, h: 0.28,
    fontSize: 9, bold: true, color: ip.color, align: 'center', fontFace: FONT_HEAD
  });

  s10.addText(ip.title, {
    x: x + 0.3, y: y + 0.55, w: 5.1, h: 0.35,
    fontSize: 14, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
  });

  s10.addText(ip.desc, {
    x: x + 0.3, y: y + 0.95, w: 5.1, h: 1.2,
    fontSize: 11, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.15
  });
});

addFooter(s10, 10);
s10.addNotes(`SLIDE 10: INTELLECTUAL PROPERTY
Our IP moats consist of proprietary full-stack code, dynamic slot throttling algorithms, cryptographic payment verification, and the operational blueprint for zero-Capex campus deployment.`);


// ==============================================================================
// SLIDE 11: LOCATION & OPERATIONAL REACH
// ==============================================================================
let s11 = pptx.addSlide();
s11.background = { color: BG_COLOR };
addHeader(s11, 'GEOGRAPHIC FOOTPRINT', 'Location & Operational Reach', 'Strategic pilot launch site in Kopargaon and cluster expansion across Maharashtra');

// Left Card: Head Office & Pilot Hub
s11.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.9, w: 5.7, h: 4.85,
  fill: { color: CARD_BG }, line: { color: BORDER_GREEN, width: 2 }, rectRadius: 0.12
});
s11.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 1.1, y: 2.15, w: 3.0, h: 0.35,
  fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.08
});
s11.addText('HEADQUARTERS & PILOT SITE', {
  x: 1.1, y: 2.15, w: 3.0, h: 0.35,
  fontSize: 10, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: FONT_HEAD
});

s11.addText('Pilot Launch Campus:\nSanjivani University (Cafe @7 Outlet)\nKopargaon, Ahmednagar District, Maharashtra\nPin Code: 423603', {
  x: 1.1, y: 2.65, w: 5.1, h: 1.2,
  fontSize: 13, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD, lineSpacingMultiple: 1.2
});

s11.addText('Campus Characteristics:\n• 2,500+ Engineering, MBA & Polytechnic Students\n• High peak rush density between 1:00 PM – 1:30 PM\n• High student UPI adoption (> 95% smartphone users)\n• Single high-traffic central canteen (Cafe @7) with peak congestion', {
  x: 1.1, y: 4.0, w: 5.1, h: 2.4,
  fontSize: 12, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.25
});

// Right Card: Regional Cluster Expansion
s11.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.8, y: 1.9, w: 5.7, h: 4.85,
  fill: { color: CARD_BG }, line: { color: BORDER_BLUE, width: 2 }, rectRadius: 0.12
});
s11.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.1, y: 2.15, w: 3.0, h: 0.35,
  fill: { color: LIGHT_BLUE }, line: { color: BORDER_BLUE, width: 1 }, rectRadius: 0.08
});
s11.addText('EXPANSION CORRIDORS', {
  x: 7.1, y: 2.15, w: 3.0, h: 0.35,
  fontSize: 10, bold: true, color: ACCENT_BLUE, align: 'center', fontFace: FONT_HEAD
});

s11.addText('Immediate Expansion Cluster (Months 4–12):\n• Nashik Education Hub: Sandip University, MET Bhujbal City, KK Wagh Engineering\n• Ahmednagar & Shirdi Cluster: Pravara Rural Engineering, Sangamner Institutes\n• 5 Campuses within 90-minute driving radius', {
  x: 7.1, y: 2.65, w: 5.1, h: 1.5,
  fontSize: 12, color: TEXT_DARK, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
});

s11.addText('Statewide Scale Corridor (Years 2–3):\n• Pune Knowledge City: 120+ Engineering & Management Campuses\n• Chhatrapati Sambhajinagar (Aurangabad) Cluster\n• Mumbai Metropolitan College Hubs\n• Over 500 potential partner campuses in Maharashtra alone', {
  x: 7.1, y: 4.3, w: 5.1, h: 2.1,
  fontSize: 12, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
});

addFooter(s11, 11);
s11.addNotes(`SLIDE 11: LOCATION & OPERATIONAL REACH
We launch at Sanjivani University where we have direct operational access and high student density.
Our cluster strategy focuses on expanding across the Nashik-Ahmednagar corridor before scaling into the massive Pune university market.`);


// ==============================================================================
// SLIDE 12: MANAGEMENT AND PERSONNEL (Replaces blank Page 12)
// ==============================================================================
let s12 = pptx.addSlide();
s12.background = { color: BG_COLOR };
addHeader(s12, 'ORGANIZATIONAL STRUCTURE', 'Management and Personnel', 'Agile, high-velocity leadership team combining engineering capability and campus relationships');

const teamRoles = [
  {
    role: 'FOUNDER & CHIEF EXECUTIVE OFFICER (CEO)',
    name: 'Shivam & Core Founding Team',
    desc: 'Leads strategic vision, university partnerships, canteen negotiations, and financial governance.\nDirect connection with campus students and operational ground reality.',
    tint: LIGHT_GREEN, border: BORDER_GREEN, color: PRIMARY_GREEN
  },
  {
    role: 'CHIEF TECHNOLOGY OFFICER (CTO) & ENG LEAD',
    name: 'Full-Stack Software Architecture',
    desc: 'Directs Next.js 15 frontend, KDS real-time SSE streaming, database security, and offline dual-sync.\nEnsures 99.9% uptime and zero payment vulnerabilities.',
    tint: LIGHT_BLUE, border: BORDER_BLUE, color: ACCENT_BLUE
  },
  {
    role: 'HEAD OF CAMPUS OPERATIONS & CANTEEN SUCCESS',
    name: 'Field Operations & QA',
    desc: 'Manages canteen onboarding, kitchen staff training on tablet UI, hardware setup, and daily SLA compliance.\nEnsures meal pickup turnaround remains strictly under 30 seconds.',
    tint: LIGHT_AMBER, border: BORDER_AMBER, color: ACCENT_AMBER
  },
  {
    role: 'CAMPUS AMBASSADORS & COMMUNITY LEADS',
    name: 'Student Community Leads (Part-Time)',
    desc: 'Student council representatives and club leads driving peer awareness, QR standee placement, and viral referral adoption across classes.',
    tint: LIGHT_GREEN, border: BORDER_GREEN, color: PRIMARY_GREEN
  }
];

teamRoles.forEach((tr, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + (col * 6.0);
  const y = 1.9 + (row * 2.45);

  s12.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: y, w: 5.7, h: 2.25,
    fill: { color: CARD_BG }, line: { color: tr.border, width: 1.5 }, rectRadius: 0.12
  });

  s12.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.3, y: y + 0.2, w: 5.1, h: 0.3,
    fill: { color: tr.tint }, line: { color: tr.border, width: 1 }, rectRadius: 0.08
  });
  s12.addText(tr.role, {
    x: x + 0.3, y: y + 0.2, w: 5.1, h: 0.3,
    fontSize: 9.5, bold: true, color: tr.color, align: 'center', fontFace: FONT_HEAD
  });

  s12.addText(tr.name, {
    x: x + 0.3, y: y + 0.58, w: 5.1, h: 0.35,
    fontSize: 14, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
  });

  s12.addText(tr.desc, {
    x: x + 0.3, y: y + 0.95, w: 5.1, h: 1.15,
    fontSize: 11, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
  });
});

addFooter(s12, 12);
s12.addNotes(`SLIDE 12: MANAGEMENT & PERSONNEL
Our lean organizational structure combines full-stack technology execution with ground-level campus presence.
Low headcount overhead keeps our operating expenses under ₹15,000/month during pilot.`);


// ==============================================================================
// SLIDE 13: INSURANCE & RISK MITIGATION
// ==============================================================================
let s13 = pptx.addSlide();
s13.background = { color: BG_COLOR };
addHeader(s13, 'RISK MANAGEMENT', 'Insurance & Risk Mitigation Framework', 'Proactive risk containment across physical hardware, digital transactions, and operational continuity');

const risks = [
  {
    cat: 'HARDWARE & ASSET PROTECTION',
    title: 'Canteen Tablet & Soundbox Cover',
    desc: '• Accidental damage & spill protection for kitchen tablets\n• Quick-swap device pool maintaining spare tablets on campus\n• Low device Capex (< ₹15,000 total) minimizes financial exposure',
    tint: LIGHT_AMBER, border: BORDER_AMBER, color: ACCENT_AMBER
  },
  {
    cat: 'CYBER & TRANSACTION PROTECTION',
    title: 'Payment Gateway Indemnity',
    desc: '• Direct settlement through RBI-licensed payment aggregators\n• Cryptographic UTR logs eliminate fake screenshot liabilities\n• Zero customer card/banking credential storage on our servers',
    tint: LIGHT_GREEN, border: BORDER_GREEN, color: PRIMARY_GREEN
  },
  {
    cat: 'OPERATIONAL CONTINUITY',
    title: 'Dual-Sync Cloud & Offline Failover',
    desc: '• Supabase PostgreSQL paired with live Google Sheets backup\n• Works smoothly during local campus Wi-Fi or 4G disconnects\n• Automated SMS alerts fallback if WhatsApp notification delays',
    tint: LIGHT_BLUE, border: BORDER_BLUE, color: ACCENT_BLUE
  },
  {
    cat: 'COMMERCIAL LEGAL PROTECTION',
    title: 'Contractual SLA & Indemnity',
    desc: '• Formal university partner MOUs defining operating rights\n• Clear vendor contracts specifying canteen preparation responsibility\n• Standardized consumer terms of service limiting third-party liability',
    tint: LIGHT_GREEN, border: BORDER_GREEN, color: PRIMARY_GREEN
  }
];

risks.forEach((r, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + (col * 6.0);
  const y = 1.9 + (row * 2.45);

  s13.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: y, w: 5.7, h: 2.25,
    fill: { color: CARD_BG }, line: { color: r.border, width: 1.5 }, rectRadius: 0.12
  });

  s13.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.3, y: y + 0.2, w: 3.8, h: 0.28,
    fill: { color: r.tint }, line: { color: r.border, width: 1 }, rectRadius: 0.08
  });
  s13.addText(r.cat, {
    x: x + 0.3, y: y + 0.2, w: 3.8, h: 0.28,
    fontSize: 9, bold: true, color: r.color, align: 'center', fontFace: FONT_HEAD
  });

  s13.addText(r.title, {
    x: x + 0.3, y: y + 0.55, w: 5.1, h: 0.35,
    fontSize: 13, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
  });

  s13.addText(r.desc, {
    x: x + 0.3, y: y + 0.95, w: 5.1, h: 1.2,
    fontSize: 11, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.15
  });
});

addFooter(s13, 13);
s13.addNotes(`SLIDE 13: INSURANCE & RISK MITIGATION
We de-risk physical assets with low Capex hardware and replacement pools, de-risk financial flows through bank UTR verification, and ensure platform uptime with dual-sync database architecture.`);


// ==============================================================================
// SLIDE 14: SECURITY AND DATA PROTECTION (Replaces blank Page 14)
// ==============================================================================
let s14 = pptx.addSlide();
s14.background = { color: BG_COLOR };
addHeader(s14, 'DIGITAL DEFENSE', 'Security and Data Protection Architecture', '23/23 Automated security audits passed: Military-grade protection against fraud and data compromise');

const secCards = [
  {
    title: 'Anti-Replay UTR Verification',
    badge: 'PAYMENT INTEGRITY',
    desc: '• Real 12-digit bank reference (UTR) verification on every order\n• Cryptographic index blocks duplicate reuse of transaction IDs\n• Kitchen ticket created ONLY after confirmed bank settlement\n• Eliminates 100% of fake screenshot scams in crowded canteens',
    tint: LIGHT_GREEN, border: BORDER_GREEN, color: PRIMARY_GREEN
  },
  {
    title: 'SHA-256 HMAC Token Signing',
    badge: 'ORDER AUTHENTICITY',
    desc: '• Every digital pickup boarding pass signed with SHA-256 HMAC\n• Tamper-proof 4-digit OTP generated specifically for student phone\n• Staff verifies OTP on tablet; prevents unauthorized meal collections\n• Zero risk of forged tickets or order hijacking',
    tint: LIGHT_BLUE, border: BORDER_BLUE, color: ACCENT_BLUE
  },
  {
    title: 'Network & API Perimeter Security',
    badge: 'INFRASTRUCTURE DEFENSE',
    desc: '• Enforced TLS 1.3 encryption across all web and mobile endpoints\n• Strict Cross-Origin Resource Sharing (CORS) & Content Security Policy\n• API rate-limiting against automated bot attacks and DDoS spam\n• Automated daily vulnerability scans and penetration audits',
    tint: LIGHT_AMBER, border: BORDER_AMBER, color: ACCENT_AMBER
  },
  {
    title: 'DPDP Privacy & Access Governance',
    badge: 'DATA GOVERNANCE',
    desc: '• Full compliance with India\'s Digital Personal Data Protection Act 2023\n• Role-Based Access Control (RBAC) on all staff and kitchen tablets\n• Zero collection or storage of student credit cards or payment PINs\n• Automated session expiration and encrypted audit trail logs',
    tint: LIGHT_GREEN, border: BORDER_GREEN, color: PRIMARY_GREEN
  }
];

secCards.forEach((sc, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + (col * 6.0);
  const y = 1.9 + (row * 2.45);

  s14.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: y, w: 5.7, h: 2.25,
    fill: { color: CARD_BG }, line: { color: sc.border, width: 1.5 }, rectRadius: 0.12
  });

  s14.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.3, y: y + 0.2, w: 3.2, h: 0.28,
    fill: { color: sc.tint }, line: { color: sc.border, width: 1 }, rectRadius: 0.08
  });
  s14.addText(sc.badge, {
    x: x + 0.3, y: y + 0.2, w: 3.2, h: 0.28,
    fontSize: 9, bold: true, color: sc.color, align: 'center', fontFace: FONT_HEAD
  });

  s14.addText(sc.title, {
    x: x + 0.3, y: y + 0.55, w: 5.1, h: 0.35,
    fontSize: 13, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
  });

  s14.addText(sc.desc, {
    x: x + 0.3, y: y + 0.95, w: 5.1, h: 1.2,
    fontSize: 10.5, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.15
  });
});

addFooter(s14, 14);
s14.addNotes(`SLIDE 14: SECURITY & DATA PROTECTION
Security is our primary technological moat. With 23/23 passed automated security audits, our cryptographic UTR matching guarantees 100% clean payments with zero fake screenshot leakage.`);


// ==============================================================================
// SLIDE 15: MARKETING STRATEGY (Replaces blank Page 15)
// ==============================================================================
let s15 = pptx.addSlide();
s15.background = { color: BG_COLOR };
addHeader(s15, 'GO-TO-MARKET EXECUTION', 'Marketing Strategy & Customer Acquisition', 'Zero-ad-spend viral campus growth driving 40% student penetration within 30 days');

const mktPillars = [
  {
    num: '01',
    title: 'Physical Point-of-Sale Signage',
    desc: '• QR Code Table Tents placed on all 50+ dining tables in canteen\n• High-visibility "FoodLine Express Counter" hanging overhead banner\n• Standees at classroom entrance corridors announcing "Skip The Line"',
    tint: LIGHT_GREEN, border: BORDER_GREEN, color: PRIMARY_GREEN
  },
  {
    num: '02',
    title: 'Student Ambassador Network',
    desc: '• Class representatives and campus club leads as certified ambassadors\n• Peer-to-peer live ordering demonstrations during morning break\n• Free snack perk for ambassadors driving 50+ peer orders',
    tint: LIGHT_BLUE, border: BORDER_BLUE, color: ACCENT_BLUE
  },
  {
    num: '03',
    title: 'Digital & WhatsApp Virality',
    desc: '• Official university WhatsApp and Telegram student channel broadcasts\n• Instagram Reels highlighting "18-Min Line vs 30-Sec FoodLine Pickup"\n• Viral peer referrals with instant ₹5 discount on first order',
    tint: LIGHT_AMBER, border: BORDER_AMBER, color: ACCENT_AMBER
  },
  {
    num: '04',
    title: 'College Fest & Recess Activations',
    desc: '• Exclusive express ordering rail during annual college cultural festivals\n• Sponsored beverage drops and snack combos with partner canteens\n• Official endorsement from College Student Council and Dean of Student Affairs',
    tint: LIGHT_GREEN, border: BORDER_GREEN, color: PRIMARY_GREEN
  }
];

mktPillars.forEach((mp, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + (col * 6.0);
  const y = 1.9 + (row * 2.45);

  s15.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: y, w: 5.7, h: 2.25,
    fill: { color: CARD_BG }, line: { color: mp.border, width: 1.5 }, rectRadius: 0.12
  });

  s15.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.3, y: y + 0.2, w: 0.6, h: 0.3,
    fill: { color: mp.tint }, line: { color: mp.border, width: 1 }, rectRadius: 0.08
  });
  s15.addText(mp.num, {
    x: x + 0.3, y: y + 0.2, w: 0.6, h: 0.3,
    fontSize: 10, bold: true, color: mp.color, align: 'center', fontFace: FONT_HEAD
  });

  s15.addText(mp.title, {
    x: x + 1.0, y: y + 0.2, w: 4.4, h: 0.3,
    fontSize: 13, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
  });

  s15.addText(mp.desc, {
    x: x + 0.3, y: y + 0.6, w: 5.1, h: 1.5,
    fontSize: 10.5, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
  });
});

addFooter(s15, 15);
s15.addNotes(`SLIDE 15: MARKETING STRATEGY
Because college campuses have dense captive foot traffic, Customer Acquisition Cost (CAC) is near ₹0. Physical table standees and student ambassador word-of-mouth drive 40% adoption within the first 30 days.`);


// ==============================================================================
// SLIDE 16: COMPETITORS
// ==============================================================================
let s16 = pptx.addSlide();
s16.background = { color: BG_COLOR };
addHeader(s16, 'COMPETITIVE LANDSCAPE', 'Competitors Analysis', 'Benchmarking FoodLine Campus against delivery aggregators, manual lines, and legacy POS');

const compTableData = [
  [
    { text: 'FEATURE / PARAMETER', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: 'FOODLINE CAMPUS', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'center' } },
    { text: 'SWIGGY / ZOMATO', options: { bold: true, color: 'FFFFFF', fill: { color: '475569' }, align: 'center' } },
    { text: 'MANUAL CANTEEN LINE', options: { bold: true, color: 'FFFFFF', fill: { color: '475569' }, align: 'center' } },
    { text: 'LEGACY POS SOFTWARE', options: { bold: true, color: 'FFFFFF', fill: { color: '475569' }, align: 'center' } }
  ],
  [
    { text: 'Turnaround Time', options: { bold: true } },
    { text: '30 Seconds (Express)', options: { color: PRIMARY_GREEN, bold: true, align: 'center' } },
    { text: '35–45 Minutes', options: { color: ACCENT_RED, align: 'center' } },
    { text: '18–25 Minutes', options: { color: ACCENT_RED, align: 'center' } },
    { text: '3–5 Min per student', options: { align: 'center' } }
  ],
  [
    { text: 'Customer Extra Fee', options: { bold: true } },
    { text: '₹2 – ₹3 micro-fee', options: { color: PRIMARY_GREEN, bold: true, align: 'center' } },
    { text: '₹40 – ₹60 delivery fee', options: { color: ACCENT_RED, align: 'center' } },
    { text: '₹0 (Lost time cost)', options: { align: 'center' } },
    { text: '₹0', options: { align: 'center' } }
  ],
  [
    { text: 'Campus Gate Access', options: { bold: true } },
    { text: 'Inside Campus Rail', options: { color: PRIMARY_GREEN, bold: true, align: 'center' } },
    { text: 'Blocked at Main Gate', options: { color: ACCENT_RED, align: 'center' } },
    { text: 'Inside Canteen', options: { align: 'center' } },
    { text: 'At Counter Only', options: { align: 'center' } }
  ],
  [
    { text: 'Fake UPI Screenshot Risk', options: { bold: true } },
    { text: '0% (Bank UTR Shield)', options: { color: PRIMARY_GREEN, bold: true, align: 'center' } },
    { text: 'N/A (App Pre-pay)', options: { align: 'center' } },
    { text: 'High (₹1K–₹3K/wk loss)', options: { color: ACCENT_RED, align: 'center' } },
    { text: 'High at busy hours', options: { color: ACCENT_RED, align: 'center' } }
  ],
  [
    { text: 'Hardware Setup Capex', options: { bold: true } },
    { text: '₹0 for Canteen (Free KDS)', options: { color: PRIMARY_GREEN, bold: true, align: 'center' } },
    { text: 'N/A', options: { align: 'center' } },
    { text: '₹0', options: { align: 'center' } },
    { text: '₹40,000 – ₹70,000 POS', options: { color: ACCENT_RED, align: 'center' } }
  ],
  [
    { text: 'Kitchen Capacity Throttling', options: { bold: true } },
    { text: 'Yes (Smart Slot Engine)', options: { color: PRIMARY_GREEN, bold: true, align: 'center' } },
    { text: 'No (Overwhelms cooks)', options: { color: ACCENT_RED, align: 'center' } },
    { text: 'No (Stampede)', options: { color: ACCENT_RED, align: 'center' } },
    { text: 'No throttling', options: { align: 'center' } }
  ]
];

s16.addTable(compTableData, {
  x: 0.8, y: 1.9, w: 11.7, h: 4.85,
  colW: [2.7, 2.4, 2.2, 2.2, 2.2],
  rowH: [0.55, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65],
  border: { color: CARD_BORDER, width: 1 },
  fill: { color: 'FFFFFF' },
  fontSize: 10.5,
  fontFace: FONT_BODY
});

addFooter(s16, 16);
s16.addNotes(`SLIDE 16: COMPETITORS ANALYSIS
FoodLine sits in a clear blue ocean on college campuses: delivery aggregators are blocked by gates and high fees, while manual counters and legacy POS machines suffer from queues and fraud.`);


// ==============================================================================
// SLIDE 17: COMPETITIVE ADVANTAGES
// ==============================================================================
let s17 = pptx.addSlide();
s17.background = { color: BG_COLOR };
addHeader(s17, 'STRATEGIC MOATS', 'Competitive Advantages (8 Unfair Advantages)', 'The technological and operational strengths that make FoodLine Campus unbeatable in universities');

const advPoints = [
  { num: '01', title: '30-Second Express Pickup', desc: 'Pre-ordered meals bagged and ready before the bell rings, reducing counter lines from 18 min to 30 sec.' },
  { num: '02', title: 'Smart Slot Throttling', desc: 'Prevents kitchen panic by capping incoming orders to exact grill and fryer preparation capacity.' },
  { num: '03', title: '100% Fraud-Proof UTR Shield', desc: 'Cryptographic validation of 12-digit bank reference eliminates ₹1,000–₹3,000 weekly fake screenshot losses.' },
  { num: '04', title: 'Zero Hardware Capex for Canteens', desc: 'Canteens onboard with any existing Android tablet or phone in under 10 minutes with zero upfront machine cost.' },
  { num: '05', title: 'Dual-Sync Offline Resilience', desc: 'Supabase PostgreSQL syncs live to Google Sheets; canteens continue processing even with fluctuating Wi-Fi.' },
  { num: '06', title: 'Asset-Light High Gross Margin', desc: '67.03% gross margin with zero delivery bikes, zero driver payroll, and zero food inventory depreciation.' },
  { num: '07', title: 'Captive High-Frequency Audience', desc: 'Students eat 2–3 times daily for 25 days a month, creating organic recurring cash flow with near-zero CAC.' },
  { num: '08', title: 'Rapid 30-Day Payback Period', desc: 'Low pilot setup cost (₹1.20L) is recovered in ~14 months, with individual kitchen hardware paid off in 30 days.' }
];

advPoints.forEach((ap, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + (col * 6.0);
  const y = 1.9 + (row * 1.2);

  s17.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: y, w: 5.7, h: 1.1,
    fill: { color: CARD_BG }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.08
  });

  s17.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.2, y: y + 0.15, w: 0.6, h: 0.3,
    fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.08
  });
  s17.addText(ap.num, {
    x: x + 0.2, y: y + 0.15, w: 0.6, h: 0.3,
    fontSize: 10, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: FONT_HEAD
  });

  s17.addText(ap.title, {
    x: x + 0.9, y: y + 0.15, w: 4.5, h: 0.3,
    fontSize: 12, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
  });

  s17.addText(ap.desc, {
    x: x + 0.9, y: y + 0.45, w: 4.5, h: 0.55,
    fontSize: 10, color: TEXT_BODY, fontFace: FONT_BODY
  });
});

addFooter(s17, 17);
s17.addNotes(`SLIDE 17: COMPETITIVE ADVANTAGES
Our 8 core advantages ensure sticky customer retention, zero canteen churn, and superior unit economics compared to any generic food tech solution.`);


// ==============================================================================
// SLIDE 18: INDUSTRY AND MARKET TRENDS
// ==============================================================================
let s18 = pptx.addSlide();
s18.background = { color: BG_COLOR };
addHeader(s18, 'MARKET TAILWINDS', 'Industry and Market Trends', 'Macro trends driving the rapid adoption of digital express campus food rails in India');

const trends = [
  {
    num: '01',
    title: 'Surging Campus UPI Penetration',
    desc: 'Over 14 Billion monthly UPI transactions processed in India. Indian college students are 98% smartphone-enabled and carry zero physical cash, relying exclusively on UPI for daily food payments.',
    tint: LIGHT_GREEN, border: BORDER_GREEN, color: PRIMARY_GREEN
  },
  {
    num: '02',
    title: 'University Digital Mandates',
    desc: 'Higher education councils and university deans actively mandate digital, cash-free campus operations to improve student hygiene, reduce lunch congestion, and modernize student amenities.',
    tint: LIGHT_BLUE, border: BORDER_BLUE, color: ACCENT_BLUE
  },
  {
    num: '03',
    title: 'Quick-Commerce Mindset Shift',
    desc: 'Gen-Z students accustomed to 10-minute grocery delivery refuse to stand 20 minutes in hot, crowded lines for a ₹30 snack. Convenience has become a non-negotiable expectation.',
    tint: LIGHT_AMBER, border: BORDER_AMBER, color: ACCENT_AMBER
  },
  {
    num: '04',
    title: 'Canteen Margin Pressures',
    desc: 'Rising food ingredient prices force canteen owners to maximize daily throughput. They cannot physically hire more cashiers; they urgently require digital queue automation to grow revenue.',
    tint: LIGHT_GREEN, border: BORDER_GREEN, color: PRIMARY_GREEN
  }
];

trends.forEach((t, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + (col * 6.0);
  const y = 1.9 + (row * 2.45);

  s18.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: y, w: 5.7, h: 2.25,
    fill: { color: CARD_BG }, line: { color: t.border, width: 1.5 }, rectRadius: 0.12
  });

  s18.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.3, y: y + 0.2, w: 0.6, h: 0.3,
    fill: { color: t.tint }, line: { color: t.border, width: 1 }, rectRadius: 0.08
  });
  s18.addText(t.num, {
    x: x + 0.3, y: y + 0.2, w: 0.6, h: 0.3,
    fontSize: 10, bold: true, color: t.color, align: 'center', fontFace: FONT_HEAD
  });

  s18.addText(t.title, {
    x: x + 1.0, y: y + 0.2, w: 4.4, h: 0.3,
    fontSize: 13, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
  });

  s18.addText(t.desc, {
    x: x + 0.3, y: y + 0.6, w: 5.1, h: 1.5,
    fontSize: 11, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
  });
});

addFooter(s18, 18);
s18.addNotes(`SLIDE 18: INDUSTRY TRENDS
Digital payments, quick-commerce habits, and canteen cost pressures create a perfect storm of adoption for FoodLine Campus.`);


// ==============================================================================
// SLIDE 19: SERVICES AND SALES PROCESS
// ==============================================================================
let s19 = pptx.addSlide();
s19.background = { color: BG_COLOR };
addHeader(s19, 'EXPANSION PIPELINE', 'Services and Sales Process: Canteen Onboarding', 'Our repeatable 4-stage funnel for closing campus partnerships and activating outlets');

const salesSteps = [
  {
    step: 'STAGE 01',
    title: 'Campus Lead & Canteen Pitch',
    desc: '• Meet university canteen manager during off-peak hours\n• Demonstrate 40% sales increase & zero fake UPI losses\n• Secure Dean / Campus Director pilot endorsement',
    tint: LIGHT_GREEN, border: BORDER_GREEN, color: PRIMARY_GREEN
  },
  {
    step: 'STAGE 02',
    title: 'Menu Digitization (1 Hour)',
    desc: '• Photograph and upload canteen menu, categories & prices\n• Set kitchen equipment slot capacities (e.g. 25 orders/10 min)\n• Generate outlet-specific QR standees and table tents',
    tint: LIGHT_BLUE, border: BORDER_BLUE, color: ACCENT_BLUE
  },
  {
    step: 'STAGE 03',
    title: 'Kitchen Staff Training (10 Min)',
    desc: '• Set up low-cost Android tablet on counter or wall mount\n• Train kitchen cooks on 1-tap "Cooking" & "Ready" buttons\n• Conduct mock test order to verify audio chime and soundbox',
    tint: LIGHT_AMBER, border: BORDER_AMBER, color: ACCENT_AMBER
  },
  {
    step: 'STAGE 04',
    title: 'Go-Live & Student Activation',
    desc: '• Place QR banners at entrance and table tents on 50 tables\n• Launch announcement on campus WhatsApp channels\n• Student ambassadors guide first-time users at express counter',
    tint: LIGHT_GREEN, border: BORDER_GREEN, color: PRIMARY_GREEN
  }
];

salesSteps.forEach((ss, idx) => {
  const x = 0.8 + (idx * 3.0);
  s19.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 1.9, w: 2.8, h: 4.85,
    fill: { color: CARD_BG }, line: { color: ss.border, width: 1.5 }, rectRadius: 0.1
  });

  s19.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.2, y: 2.1, w: 2.4, h: 0.3,
    fill: { color: ss.tint }, line: { color: ss.border, width: 1 }, rectRadius: 0.08
  });
  s19.addText(ss.step, {
    x: x + 0.2, y: 2.1, w: 2.4, h: 0.3,
    fontSize: 9, bold: true, color: ss.color, align: 'center', fontFace: FONT_HEAD
  });

  s19.addText(ss.title, {
    x: x + 0.2, y: 2.5, w: 2.4, h: 0.5,
    fontSize: 13, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
  });

  s19.addText(ss.desc, {
    x: x + 0.2, y: 3.15, w: 2.4, h: 3.4,
    fontSize: 11, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.25
  });
});

addFooter(s19, 19);
s19.addNotes(`SLIDE 19: SERVICES & SALES PROCESS
Canteens can be onboarded in less than 24 hours. Because we require zero Capex and offer free KDS software, canteen managers readily agree to a 7-day trial.`);


// ==============================================================================
// SLIDE 20: CLIENT SERVICE PROCESS & ORDER LIFECYCLE
// ==============================================================================
let s20 = pptx.addSlide();
s20.background = { color: BG_COLOR };
addHeader(s20, 'OPERATIONAL PROTOCOL', 'Client Service Process & Order Lifecycle', 'The exact 5-phase journey of an order from student classroom desk to 30-second meal pickup');

const lifecycle = [
  { step: 'PHASE 1', title: 'Pre-Order from Desk', detail: 'Student selects dishes and break slot (e.g. 1:15 PM) 5 minutes before lecture ends.', time: 'T-5 min' },
  { step: 'PHASE 2', title: '100% Verified UPI', detail: 'Student pays via UPI; 12-digit UTR validated against bank database.', time: 'T-4 min' },
  { step: 'PHASE 3', title: 'Kitchen Batching', detail: 'KDS displays ticket; cook prepares and bags meal according to slot capacity.', time: 'T-2 min' },
  { step: 'PHASE 4', title: 'Cook Taps "Ready"', detail: 'Student receives instant notification: "Meal hot and packed at Counter 2!"', time: 'T-0 min' },
  { step: 'PHASE 5', title: '30-Sec Express Pickup', detail: 'Student shows 4-digit OTP; staff hands over meal bag; ticket auto-archived.', time: '+30 sec' }
];

lifecycle.forEach((lc, idx) => {
  const y = 1.9 + (idx * 0.95);
  s20.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: y, w: 11.7, h: 0.85,
    fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }, rectRadius: 0.08
  });

  s20.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.1, y: y + 0.15, w: 1.2, h: 0.28,
    fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.06
  });
  s20.addText(lc.step, {
    x: 1.1, y: y + 0.15, w: 1.2, h: 0.28,
    fontSize: 9, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: FONT_HEAD
  });

  s20.addText(lc.time, {
    x: 2.4, y: y + 0.15, w: 1.2, h: 0.28,
    fontSize: 9, bold: true, color: ACCENT_AMBER, fontFace: FONT_HEAD
  });

  s20.addText(lc.title, {
    x: 3.7, y: y + 0.15, w: 2.8, h: 0.3,
    fontSize: 13, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
  });

  s20.addText(lc.detail, {
    x: 6.6, y: y + 0.15, w: 5.6, h: 0.55,
    fontSize: 11, color: TEXT_BODY, fontFace: FONT_BODY
  });
});

// Bottom Summary Box
s20.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 6.0, w: 11.7, h: 0.85,
  fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.08
});
s20.addText('TOTAL TURNAROUND COMPARISON:', {
  x: 1.1, y: 6.1, w: 3.5, h: 0.25,
  fontSize: 10, bold: true, color: PRIMARY_GREEN, fontFace: FONT_HEAD
});
s20.addText('Manual Canteen Lines: 18–25 Minutes in Chaos  ➔  FoodLine Campus Rail: 30 Seconds Express Pickup', {
  x: 1.1, y: 6.35, w: 11.1, h: 0.4,
  fontSize: 13, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
});

addFooter(s20, 20);
s20.addNotes(`SLIDE 20: CLIENT SERVICE PROCESS
By shifting order entry and payment into the classroom, the actual counter experience becomes a rapid 30-second handover, completely eliminating queue buildup.`);


// ==============================================================================
// SLIDE 21: COMMUNICATION PLAN (Internal & External)
// ==============================================================================
let s21 = pptx.addSlide();
s21.background = { color: BG_COLOR };
addHeader(s21, 'STAKEHOLDER SYNC', 'Communication Plan: Internal & External', 'Standardized protocols ensuring operational alignment across technical, operational, and student touchpoints');

// Left: Internal Communication
s21.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.9, w: 5.7, h: 4.85,
  fill: { color: CARD_BG }, line: { color: BORDER_BLUE, width: 1.5 }, rectRadius: 0.12
});
s21.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 1.1, y: 2.15, w: 3.2, h: 0.32,
  fill: { color: LIGHT_BLUE }, line: { color: BORDER_BLUE, width: 1 }, rectRadius: 0.08
});
s21.addText('INTERNAL COMMUNICATION', {
  x: 1.1, y: 2.15, w: 3.2, h: 0.32,
  fontSize: 10, bold: true, color: ACCENT_BLUE, align: 'center', fontFace: FONT_HEAD
});

const internalComms = [
  '• Daily Operations Standup: 15-minute morning review between tech lead and campus field team',
  '• Real-Time KDS Telemetry: Automated system alerts for order latency or payment gateway errors',
  '• Weekly Menu & Inventory Review: Analyzing sold-out trends and item preparation bottlenecks',
  '• Developer Sprint Reviews: Bi-weekly feature releases, UI enhancements, and performance optimizations'
];
s21.addText(internalComms.join('\n\n'), {
  x: 1.1, y: 2.65, w: 5.1, h: 3.9,
  fontSize: 11.5, color: TEXT_DARK, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
});

// Right: External Communication
s21.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.8, y: 1.9, w: 5.7, h: 4.85,
  fill: { color: CARD_BG }, line: { color: BORDER_GREEN, width: 1.5 }, rectRadius: 0.12
});
s21.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.1, y: 2.15, w: 3.2, h: 0.32,
  fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.08
});
s21.addText('EXTERNAL COMMUNICATION', {
  x: 7.1, y: 2.15, w: 3.2, h: 0.32,
  fontSize: 10, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: FONT_HEAD
});

const externalComms = [
  '• Instant Student Order Alerts: Real-time WhatsApp and in-app push alerts when meals are marked "Ready"',
  '• Daily Canteen Settlement Ledger: Automated Google Sheets update detailing GMV, commission, and payouts',
  '• University Administration Briefings: Monthly campus congestion reduction and dining satisfaction reports',
  '• Customer Support Channel: In-app WhatsApp support chat for instant resolution of any order discrepancies'
];
s21.addText(externalComms.join('\n\n'), {
  x: 7.1, y: 2.65, w: 5.1, h: 3.9,
  fontSize: 11.5, color: TEXT_DARK, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
});

addFooter(s21, 21);
s21.addNotes(`SLIDE 21: COMMUNICATION PLAN
Clear communication channels ensure smooth operational synchronization internally among developers and operators, and externally with students and canteen managers.`);


// ==============================================================================
// SLIDE 22: FINANCE - SETUP COST (FROM FINANCIAL MODEL)
// ==============================================================================
let s22 = pptx.addSlide();
s22.background = { color: BG_COLOR };
addHeader(s22, 'CAPITAL REQUIREMENTS', 'Finance: Setup Cost & Initial Build Investment', 'Detailed itemization of pilot capital deployment matching our audited financial model');

const setupTableData = [
  [
    { text: 'SETUP ITEM / CAPITAL DEPLOYMENT', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: 'CATEGORY', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: 'AMOUNT (₹)', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'right' } }
  ],
  [
    { text: 'Software Platform Build & PWA Testing', options: { bold: true } },
    { text: 'Technology / Cloud Setup' },
    { text: '₹60,000', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'Canteen Hardware Setup (10" Tablet + Soundbox)', options: { bold: true } },
    { text: 'Kitchen Equipment' },
    { text: '₹15,000', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'Company Incorporation, Legal & GST Registration', options: { bold: true } },
    { text: 'Compliance & Legal' },
    { text: '₹25,000', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'Branding, QR Table Tents & Launch Standees', options: { bold: true } },
    { text: 'Physical POS Marketing' },
    { text: '₹20,000', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'TOTAL INITIAL FIXED SETUP COST', options: { bold: true, color: PRIMARY_GREEN } },
    { text: 'Capex Total', options: { bold: true, color: PRIMARY_GREEN } },
    { text: '₹1,20,000', options: { bold: true, color: PRIMARY_GREEN, align: 'right' } }
  ],
  [
    { text: 'Working Capital Reserve (Year 1 Operations)', options: { bold: true } },
    { text: 'Operational Reserve' },
    { text: '₹84,000', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'TOTAL INITIAL INVESTMENT REQUIRED', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: 'Total Funding Needed', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: '₹2,04,000', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'right' } }
  ]
];

s22.addTable(setupTableData, {
  x: 0.8, y: 1.9, w: 11.7, h: 4.2,
  colW: [5.2, 3.5, 3.0],
  rowH: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.55],
  border: { color: CARD_BORDER, width: 1 },
  fill: { color: 'FFFFFF' },
  fontSize: 11,
  fontFace: FONT_BODY
});

// Note Box
s22.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 6.25, w: 11.7, h: 0.65,
  fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.08
});
s22.addText('CAPITAL EFFICIENCY NOTE: "Because FoodLine utilizes standard Android tablets and an asset-light cloud architecture, initial capital outlay is only ₹2,04,000 — enabling 100% self-reliance and fast break-even."', {
  x: 1.0, y: 6.32, w: 11.3, h: 0.5,
  fontSize: 11, bold: true, color: PRIMARY_GREEN, fontFace: FONT_HEAD
});

addFooter(s22, 22);
s22.addNotes(`SLIDE 22: FINANCE - SETUP COST
Our initial investment requirement is ₹2,04,000, covering software build (₹60K), canteen hardware (₹15K), legal/GST setup (₹25K), launch branding (₹20K), and a working capital reserve (₹84K).`);


// ==============================================================================
// SLIDE 23: FINANCE - WORKING CAPITAL (FROM FINANCIAL MODEL)
// ==============================================================================
let s23 = pptx.addSlide();
s23.background = { color: BG_COLOR };
addHeader(s23, 'OPERATIONAL BUDGET', 'Finance: Working Capital & Operating Expenses', 'Audited monthly and annual fixed operating expense structure for the single-campus pilot');

const opexTableData = [
  [
    { text: 'OPERATING EXPENSE CATEGORY', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: 'OPERATIONAL SCOPE', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: 'MONTHLY (₹)', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'right' } },
    { text: 'ANNUAL (₹)', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'right' } }
  ],
  [
    { text: 'Campus Operations & Support', options: { bold: true } },
    { text: 'On-ground operational oversight & canteen coordination' },
    { text: '₹5,000', options: { align: 'right' } },
    { text: '₹60,000', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'Software Hosting & Cloud Tools', options: { bold: true } },
    { text: 'Supabase PostgreSQL, Vercel hosting, domain & API tools' },
    { text: '₹2,000', options: { align: 'right' } },
    { text: '₹24,000', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'Marketing & Campus Awareness', options: { bold: true } },
    { text: 'Fresh table tents, student ambassador rewards & promotions' },
    { text: '₹2,500', options: { align: 'right' } },
    { text: '₹30,000', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'Support & Administration', options: { bold: true } },
    { text: 'In-app student query resolution & administrative accounting' },
    { text: '₹3,000', options: { align: 'right' } },
    { text: '₹36,000', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'Miscellaneous & Contingency Buffer', options: { bold: true } },
    { text: 'Spare hardware peripherals, printing & unexpected costs' },
    { text: '₹2,500', options: { align: 'right' } },
    { text: '₹30,000', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'TOTAL OPERATING EXPENSES (OPEX)', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: 'Pilot Campus Fixed Cost Total', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: '₹15,000 / mo', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'right' } },
    { text: '₹1,80,000 / yr', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'right' } }
  ]
];

s23.addTable(opexTableData, {
  x: 0.8, y: 1.9, w: 11.7, h: 4.2,
  colW: [3.8, 4.3, 1.8, 1.8],
  rowH: [0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.6],
  border: { color: CARD_BORDER, width: 1 },
  fill: { color: 'FFFFFF' },
  fontSize: 10.5,
  fontFace: FONT_BODY
});

s23.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 6.25, w: 11.7, h: 0.65,
  fill: { color: LIGHT_AMBER }, line: { color: BORDER_AMBER, width: 1 }, rectRadius: 0.08
});
s23.addText('FIXED COST CONTAINMENT: "Total fixed monthly overhead is kept strictly at ₹15,000/month (₹1.80 Lakh/year). The canteen SaaS fee (₹24,000/year) directly subsidizes cloud hosting, ensuring a low breakeven threshold."', {
  x: 1.0, y: 6.32, w: 11.3, h: 0.5,
  fontSize: 11, bold: true, color: ACCENT_AMBER, fontFace: FONT_HEAD
});

addFooter(s23, 23);
s23.addNotes(`SLIDE 23: WORKING CAPITAL
Fixed monthly costs are ₹15,000, totaling ₹1,80,000 annually. This includes campus operations, cloud hosting, ongoing promotions, and support.`);


// ==============================================================================
// SLIDE 24: INCOME AND EXPENSE PROJECTIONS (4% STUDENT FEE MODEL)
// ==============================================================================
let s24 = pptx.addSlide();
s24.background = { color: BG_COLOR };
addHeader(s24, 'UNIT ECONOMICS MODEL', 'Income and Expense Projections: Single-Campus Pilot', '4% student convenience fee model with 0% canteen commission and direct UPI routing');

// Left Column: Assumptions & Order Volume
s24.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.9, w: 5.7, h: 4.85,
  fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1.5 }, rectRadius: 0.12
});
s24.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 1.1, y: 2.15, w: 3.2, h: 0.32,
  fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.08
});
s24.addText('CORE CAMPUS ASSUMPTIONS', {
  x: 1.1, y: 2.15, w: 3.2, h: 0.32,
  fontSize: 10, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: FONT_HEAD
});

const assumptionsText = [
  '• Total Students on Campus: 2,500 students',
  '• Active Users (40% Adoption): 1,000 active students',
  '• Order Frequency: 5 orders / user / month (~once a week)',
  '• Monthly Order Volume: 5,000 orders / month',
  '• Annual Order Volume: 60,000 orders / year',
  '• Average Order Value (AOV): ₹80 per meal',
  '• Annual GMV Processed: ₹48,00,000 (₹48 Lakhs/year)',
  '• Canteen Commission: ₹0 (100% Free for Canteen)',
  '• Student Convenience Fee: 4% on order (~₹3.20/order)',
  '• Direct UPI Routing: 0% MDR payment gateway fees',
  '• Variable Tech Cost: ~₹0.30 per order (SMS/Cloud compute)',
  '• Net Contribution: ₹2.90 per order (90.6% Gross Margin)'
];
s24.addText(assumptionsText.join('\n'), {
  x: 1.1, y: 2.65, w: 5.1, h: 3.9,
  fontSize: 10.5, color: TEXT_DARK, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
});

// Right Column: Revenue, COGS, Profit Table
const pnlTableData = [
  [
    { text: 'FINANCIAL LINE ITEM', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: 'ANNUAL (₹)', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'right' } }
  ],
  [
    { text: 'Gross Merchandise Value (GMV @ ₹80 AOV)' },
    { text: '₹48,00,000', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'Canteen Commission (100% Free for Canteen)' },
    { text: '₹0 (0%)', options: { align: 'right' } }
  ],
  [
    { text: 'Student Convenience Fee (4% on GMV)' },
    { text: '₹1,92,000', options: { bold: true, color: PRIMARY_GREEN, align: 'right' } }
  ],
  [
    { text: 'TOTAL PLATFORM REVENUE', options: { bold: true, color: PRIMARY_GREEN } },
    { text: '₹1,92,000', options: { bold: true, color: PRIMARY_GREEN, align: 'right' } }
  ],
  [
    { text: 'Payment Gateway MDR (Direct UPI Rail 0%)' },
    { text: '₹0', options: { align: 'right' } }
  ],
  [
    { text: 'Direct Variable Tech Cost (~₹0.30/order)' },
    { text: '(₹18,000)', options: { align: 'right' } }
  ],
  [
    { text: 'GROSS PROFIT (90.62% Margin)', options: { bold: true } },
    { text: '₹1,74,000', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'Lean Fixed OPEX (Cloud + Lead + Mktg)', options: { bold: true } },
    { text: '(₹72,000)', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'ANNUAL NET PROFIT (53.1% Net Margin)', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: '₹1,02,000', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'right' } }
  ]
];

s24.addTable(pnlTableData, {
  x: 6.8, y: 1.9, w: 5.7, h: 4.85,
  colW: [4.0, 1.7],
  rowH: [0.45, 0.4, 0.4, 0.4, 0.45, 0.4, 0.4, 0.45, 0.45, 0.55],
  border: { color: CARD_BORDER, width: 1 },
  fill: { color: 'FFFFFF' },
  fontSize: 10.5,
  fontFace: FONT_BODY
});

addFooter(s24, 24);
s24.addNotes(`SLIDE 24: INCOME AND EXPENSES
Single-campus pilot unit economics under the 4% student fee model:
- GMV: ₹48 Lakhs
- Canteen Commission: ₹0 (Zero friction onboarding)
- Revenue: ₹1.92 Lakhs (4% convenience fee from students)
- Direct Tech COGS: ₹18,000
- Gross Profit: ₹1.74 Lakhs (90.6% gross margin)
- Lean Fixed OPEX: ₹72,000
- Net Profit: ₹1.02 Lakhs (53.1% net margin)`);

// SLIDE 25: FINANCE - 5 YEARS REVENUE PROJECTION (4% MODEL)
// ==============================================================================
let s25 = pptx.addSlide();
s25.background = { color: BG_COLOR };
addHeader(s25, 'LONG-TERM FINANCIAL TRAJECTORY', 'Finance: 5 Years Growth & Revenue Projections (4% Model)', 'Scaling from a single pilot campus to a 50-campus nationwide network over 5 years');

const projectionTableData = [
  [
    { text: 'PARTICULARS', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
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
    { text: 'Active Students (Users)', options: { bold: true } },
    { text: '1,000', options: { align: 'center' } },
    { text: '5,000', options: { align: 'center' } },
    { text: '15,000', options: { align: 'center' } },
    { text: '30,000', options: { align: 'center' } },
    { text: '50,000', options: { align: 'center', bold: true } }
  ],
  [
    { text: 'Annual Orders Processed', options: { bold: true } },
    { text: '60,000', options: { align: 'center' } },
    { text: '300,000', options: { align: 'center' } },
    { text: '900,000', options: { align: 'center' } },
    { text: '1.80 Million', options: { align: 'center' } },
    { text: '3.00 Million', options: { align: 'center', bold: true } }
  ],
  [
    { text: 'Gross Merchandise Value (GMV)', options: { bold: true } },
    { text: '₹48.0 L', options: { align: 'center' } },
    { text: '₹2.40 Cr', options: { align: 'center' } },
    { text: '₹7.20 Cr', options: { align: 'center' } },
    { text: '₹14.40 Cr', options: { align: 'center' } },
    { text: '₹24.00 Cr', options: { align: 'center', bold: true, color: PRIMARY_GREEN } }
  ],
  [
    { text: 'Revenue (4% Student Fee)', options: { bold: true, color: PRIMARY_GREEN } },
    { text: '₹1.92 L', options: { align: 'center', bold: true } },
    { text: '₹9.60 L', options: { align: 'center', bold: true } },
    { text: '₹28.80 L', options: { align: 'center', bold: true } },
    { text: '₹57.60 L', options: { align: 'center', bold: true } },
    { text: '₹96.00 L', options: { align: 'center', bold: true, color: PRIMARY_GREEN } }
  ],
  [
    { text: 'Direct Variable Tech Cost', options: { bold: true } },
    { text: '₹0.18 L', options: { align: 'center' } },
    { text: '₹0.90 L', options: { align: 'center' } },
    { text: '₹2.70 L', options: { align: 'center' } },
    { text: '₹5.40 L', options: { align: 'center' } },
    { text: '₹9.00 L', options: { align: 'center' } }
  ],
  [
    { text: 'Operating Expenses (OPEX)', options: { bold: true } },
    { text: '₹0.72 L', options: { align: 'center' } },
    { text: '₹2.40 L', options: { align: 'center' } },
    { text: '₹6.50 L', options: { align: 'center' } },
    { text: '₹14.00 L', options: { align: 'center' } },
    { text: '₹24.00 L', options: { align: 'center' } }
  ],
  [
    { text: 'ESTIMATED NET PROFIT', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: '₹1.02 L', options: { align: 'center', bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: '₹6.30 L', options: { align: 'center', bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: '₹19.60 L', options: { align: 'center', bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: '₹38.20 L', options: { align: 'center', bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: '₹63.00 L', options: { align: 'center', bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } }
  ]
];

s25.addTable(projectionTableData, {
  x: 0.8, y: 1.9, w: 11.7, h: 4.85,
  colW: [3.2, 1.7, 1.7, 1.7, 1.7, 1.7],
  rowH: [0.55, 0.45, 0.45, 0.45, 0.5, 0.5, 0.45, 0.45, 0.6],
  border: { color: CARD_BORDER, width: 1 },
  fill: { color: 'FFFFFF' },
  fontSize: 10.5,
  fontFace: FONT_BODY
});

addFooter(s25, 25);
s25.addNotes(`SLIDE 25: 5-YEAR PROJECTIONS
Our 5-year growth path takes us from:
- Year 1: 1 campus, ₹48L GMV, ₹1.92L revenue, ₹1.02L profit
- Year 2: 5 campuses, ₹2.4Cr GMV, ₹9.60L revenue, ₹6.30L profit
- Year 3: 15 campuses, ₹7.2Cr GMV, ₹28.80L revenue, ₹19.60L profit
- Year 4: 30 campuses, ₹14.4Cr GMV, ₹57.60L revenue, ₹38.20L profit
- Year 5: 50 campuses, ₹24.0Cr GMV, ₹96.00L revenue, ₹63.00L profit
Targeting the long-term ₹344,57,81,800 Goldmine enterprise valuation across 500+ Indian campuses.`);

// SLIDE 26: FINANCE - OPERATING EXPENSE PLAN
// ==============================================================================
let s26 = pptx.addSlide();
s26.background = { color: BG_COLOR };
addHeader(s26, 'COST GOVERNANCE', 'Finance: Operating Expense Growth Plan', 'Phased operational expenditure scaling responsibly with network campus footprint');

const opexStages = [
  [
    { text: 'STAGE / YEAR', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: 'NETWORK FOOTPRINT', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: 'OPERATIONAL FOCUS & EXPENSE COMPOSITION', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: 'ANNUAL OPEX', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'right' } }
  ],
  [
    { text: 'Year 1', options: { bold: true } },
    { text: '1 Pilot Campus' },
    { text: 'Founder-led operations, local student ambassadors, basic cloud servers & POS collateral' },
    { text: '₹1,80,000', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'Year 2', options: { bold: true } },
    { text: '5 Campuses (Cluster)' },
    { text: 'Dedicated field coordinator, regional travel, automated SMS tooling & enhanced cloud hosting' },
    { text: '₹7,50,000', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'Year 3', options: { bold: true } },
    { text: '15 Campuses (Statewide)' },
    { text: 'Regional hub managers, 2 support engineers, automated reconciliation software & university promotions' },
    { text: '₹20,00,000', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'Year 4', options: { bold: true } },
    { text: '30 Campuses' },
    { text: 'Full tech & operations team, round-the-clock student support, enterprise cloud infrastructure & brand marketing' },
    { text: '₹38,00,000', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'Year 5', options: { bold: true } },
    { text: '50 Campuses (National)' },
    { text: 'Corporate HQ, multi-city field leads, AI-driven dispatch optimization & national campus sponsorships' },
    { text: '₹60,00,000', options: { bold: true, color: PRIMARY_GREEN, align: 'right' } }
  ]
];

s26.addTable(opexStages, {
  x: 0.8, y: 1.9, w: 11.7, h: 4.85,
  colW: [1.8, 2.5, 5.6, 1.8],
  rowH: [0.55, 0.85, 0.85, 0.85, 0.85, 0.9],
  border: { color: CARD_BORDER, width: 1 },
  fill: { color: 'FFFFFF' },
  fontSize: 11,
  fontFace: FONT_BODY
});

addFooter(s26, 26);
s26.addNotes(`SLIDE 26: OPERATING EXPENSE PLAN
Operating expenses grow steadily from ₹1.80L in Year 1 to ₹60.0L in Year 5 as we hire regional operations coordinators and scale cloud infrastructure.`);


// ==============================================================================
// SLIDE 27: FINANCE - SOURCES OF FUND
// ==============================================================================
let s27 = pptx.addSlide();
s27.background = { color: BG_COLOR };
addHeader(s27, 'CAPITAL STRUCTURE', 'Finance: Sources of Funds', 'Balanced capitalization structure combining founders equity commitment with seed investment');

const sourcesTableData = [
  [
    { text: 'SOURCE OF CAPITAL', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: 'CATEGORY / INSTRUMENT', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: 'AMOUNT (₹)', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'right' } },
    { text: 'SHARE (%)', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'right' } }
  ],
  [
    { text: 'Founders / Promoters Equity', options: { bold: true } },
    { text: 'Personal Savings & Sweat Equity' },
    { text: '₹1,04,000', options: { bold: true, align: 'right' } },
    { text: '50.98%', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'Angel / Seed Investor / Incubation Grant', options: { bold: true } },
    { text: 'Equity / Convertible Note / Startup Grant' },
    { text: '₹1,00,000', options: { bold: true, align: 'right' } },
    { text: '49.02%', options: { bold: true, align: 'right' } }
  ],
  [
    { text: 'TOTAL INITIAL FUNDING', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: 'Combined Seed Capitalization', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN } } },
    { text: '₹2,04,000', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'right' } },
    { text: '100.00%', options: { bold: true, color: 'FFFFFF', fill: { color: PRIMARY_GREEN }, align: 'right' } }
  ]
];

s27.addTable(sourcesTableData, {
  x: 0.8, y: 1.9, w: 11.7, h: 2.5,
  colW: [4.2, 3.8, 2.0, 1.7],
  rowH: [0.6, 0.6, 0.6, 0.7],
  border: { color: CARD_BORDER, width: 1 },
  fill: { color: 'FFFFFF' },
  fontSize: 11,
  fontFace: FONT_BODY
});

// Capital Deployment Split Cards
const fundUse = [
  { label: 'Technology Build', amount: '₹60,000', pct: '29.4%', color: PRIMARY_GREEN, tint: LIGHT_GREEN, border: BORDER_GREEN },
  { label: 'Canteen Hardware', amount: '₹15,000', pct: '7.4%', color: ACCENT_BLUE, tint: LIGHT_BLUE, border: BORDER_BLUE },
  { label: 'Legal & Company Setup', amount: '₹25,000', pct: '12.3%', color: ACCENT_AMBER, tint: LIGHT_AMBER, border: BORDER_AMBER },
  { label: 'Marketing & POS Signage', amount: '₹20,000', pct: '9.8%', color: PRIMARY_GREEN, tint: LIGHT_GREEN, border: BORDER_GREEN },
  { label: 'Working Capital Reserve', amount: '₹84,000', pct: '41.1%', color: ACCENT_BLUE, tint: LIGHT_BLUE, border: BORDER_BLUE }
];

fundUse.forEach((fu, idx) => {
  const x = 0.8 + (idx * 2.4);
  s27.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 4.8, w: 2.2, h: 1.9,
    fill: { color: CARD_BG }, line: { color: fu.border, width: 1.5 }, rectRadius: 0.1
  });

  s27.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.15, y: 4.95, w: 1.9, h: 0.3,
    fill: { color: fu.tint }, line: { color: fu.border, width: 1 }, rectRadius: 0.08
  });
  s27.addText(fu.pct, {
    x: x + 0.15, y: 4.95, w: 1.9, h: 0.3,
    fontSize: 10, bold: true, color: fu.color, align: 'center', fontFace: FONT_HEAD
  });

  s27.addText(fu.amount, {
    x: x + 0.15, y: 5.35, w: 1.9, h: 0.45,
    fontSize: 16, bold: true, color: TEXT_DARK, align: 'center', fontFace: FONT_HEAD
  });

  s27.addText(fu.label, {
    x: x + 0.15, y: 5.85, w: 1.9, h: 0.7,
    fontSize: 10.5, color: TEXT_BODY, align: 'center', fontFace: FONT_BODY
  });
});

addFooter(s27, 27);
s27.addNotes(`SLIDE 27: SOURCES OF FUNDS
Our funding structure is 51% Founder Equity (₹1.04L) and 49% Seed Capital (₹1.00L). Over 41% of funds remain in cash reserve as working capital.`);


// ==============================================================================
// SLIDE 28: REPAYMENT / RETURN TO INVESTORS
// ==============================================================================
let s28 = pptx.addSlide();
s28.background = { color: BG_COLOR };
addHeader(s28, 'INVESTOR VALUE CREATION', 'Repayment & Return to Investors (ROI)', 'Attractive payback timeline, sustainable profit distributions, and scalable equity value');

const roiPoints = [
  {
    title: 'Seed Investment Amount',
    val: '₹1,00,000',
    sub: 'For 10% to 15% seed equity / convertible structure',
    tint: LIGHT_GREEN, border: BORDER_GREEN, color: PRIMARY_GREEN
  },
  {
    title: 'Year 1 Projected Net Profit',
    val: '₹1,17,600',
    sub: '117.6% of initial angel check size generated in Year 1',
    tint: LIGHT_BLUE, border: BORDER_BLUE, color: ACCENT_BLUE
  },
  {
    title: 'Year 2 Projected Net Profit',
    val: '₹7,20,000',
    sub: 'Rapid 6x net profit expansion across 5-campus cluster',
    tint: LIGHT_AMBER, border: BORDER_AMBER, color: ACCENT_AMBER
  },
  {
    title: '5-Year Projected ROI',
    val: '15x – 25x',
    sub: 'Backed by ₹2.22 Cr platform revenue & ₹92L profit run-rate',
    tint: LIGHT_GREEN, border: PRIMARY_GREEN, color: PRIMARY_GREEN
  }
];

roiPoints.forEach((rp, idx) => {
  const x = 0.8 + (idx * 3.0);
  s28.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 1.9, w: 2.8, h: 2.2,
    fill: { color: CARD_BG }, line: { color: rp.border, width: 1.5 }, rectRadius: 0.12
  });

  s28.addText(rp.title, {
    x: x + 0.2, y: 2.1, w: 2.4, h: 0.35,
    fontSize: 11, bold: true, color: TEXT_MUTED, align: 'center', fontFace: FONT_HEAD
  });

  s28.addText(rp.val, {
    x: x + 0.2, y: 2.5, w: 2.4, h: 0.6,
    fontSize: 24, bold: true, color: rp.color, align: 'center', fontFace: FONT_HEAD
  });

  s28.addText(rp.sub, {
    x: x + 0.2, y: 3.2, w: 2.4, h: 0.75,
    fontSize: 10, color: TEXT_BODY, align: 'center', fontFace: FONT_BODY
  });
});

// Investor Return Strategy Card
s28.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 4.4, w: 11.7, h: 2.35,
  fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1.5 }, rectRadius: 0.12
});
s28.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 1.1, y: 4.6, w: 3.2, h: 0.3,
  fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.08
});
s28.addText('INVESTOR EXIT & DIVIDEND STRATEGY', {
  x: 1.1, y: 4.6, w: 3.2, h: 0.3,
  fontSize: 10, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: FONT_HEAD
});

const returnBullets = [
  '• Capital Preservation: Low Capex and asset-light operations safeguard investor principal with immediate cash flow.',
  '• Dividend Distribution: Beginning in Year 2, up to 25% of annual net profits may be distributed as cash dividends.',
  '• Secondary Exit Opportunities: Strategic acquisition potential by national food aggregators, POS conglomerates, or university ERP providers seeking campus monopoly.',
  '• Institutional Series A: High-growth metrics allow angel investors to exit at 10x+ valuation during Series A expansion.'
];
s28.addText(returnBullets.join('\n'), {
  x: 1.1, y: 5.0, w: 11.1, h: 1.6,
  fontSize: 11.5, color: TEXT_DARK, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
});

addFooter(s28, 28);
s28.addNotes(`SLIDE 28: INVESTOR REPAYMENT & ROI
With Year 1 net profit matching initial seed capital, investors experience rapid de-risking and exceptional upside as the network scales to 50 campuses.`);


// ==============================================================================
// SLIDE 29: BREAK-EVEN POINT AND PERIOD (4% STUDENT MODEL)
// ==============================================================================
let s29 = pptx.addSlide();
s29.background = { color: BG_COLOR };
addHeader(s29, 'FINANCIAL VIABILITY', 'Break-Even Point and Payback Period', 'Mathematical calculation of unit-level viability and capital recovery under the 4% student model');

// Left Box: Break-Even Math
s29.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.9, w: 5.7, h: 4.85,
  fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1.5 }, rectRadius: 0.12
});
s29.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 1.1, y: 2.15, w: 3.2, h: 0.32,
  fill: { color: LIGHT_GREEN }, line: { color: BORDER_GREEN, width: 1 }, rectRadius: 0.08
});
s29.addText('BREAK-EVEN FORMULA & MATH', {
  x: 1.1, y: 2.15, w: 3.2, h: 0.32,
  fontSize: 10, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: FONT_HEAD
});

const beFormulaPoints = [
  '• Annual Lean Fixed OPEX: ₹72,000 (₹6,000/month)',
  '• Revenue per Order (4% of ₹80): ₹3.20',
  '• Direct Variable Cost per Order: ₹0.30',
  '• Net Contribution Margin / Order: ₹2.90 per order',
  '',
  'BREAK-EVEN ORDER VOLUME:',
  '= Fixed OPEX ÷ Contribution Margin',
  '= ₹72,000 ÷ ₹2.90',
  '= 24,828 Orders / Year (~2,069 orders / month)',
  '',
  'CAPACITY UTILIZATION AT BREAK-EVEN:',
  '= 24,828 ÷ 60,000 = 41.38% of Pilot Capacity',
  '',
  '• 58.6% Safety Margin: Business stays profitable even if 58% of expected order volume fails to materialize.'
];
s29.addText(beFormulaPoints.join('\n'), {
  x: 1.1, y: 2.65, w: 5.1, h: 3.9,
  fontSize: 10.5, color: TEXT_DARK, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
});

// Right Box: Payback Period & Highlights
s29.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.8, y: 1.9, w: 5.7, h: 4.85,
  fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1.5 }, rectRadius: 0.12
});
s29.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.1, y: 2.15, w: 3.2, h: 0.32,
  fill: { color: LIGHT_BLUE }, line: { color: BORDER_BLUE, width: 1 }, rectRadius: 0.08
});
s29.addText('ESTIMATED PAYBACK PERIOD', {
  x: 7.1, y: 2.15, w: 3.2, h: 0.32,
  fontSize: 10, bold: true, color: ACCENT_BLUE, align: 'center', fontFace: FONT_HEAD
});

s29.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.1, y: 2.65, w: 5.1, h: 1.1,
  fill: { color: LIGHT_GREEN }, line: { color: PRIMARY_GREEN, width: 1.5 }, rectRadius: 0.1
});
s29.addText('OPERATIONAL BREAK-EVEN: MONTH 5\nCapital Payback: ~18 Months', {
  x: 7.1, y: 2.85, w: 5.1, h: 0.7,
  fontSize: 15, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: FONT_HEAD
});

const beNarrative = [
  '• Rapid Hardware Payback: The ₹15,000 canteen hardware setup is recouped in < 45 days of live ordering.',
  '• Zero Canteen Resistance: Because canteens pay ₹0 commission, campus acquisition velocity is 3x faster than conventional B2B food-tech.',
  '• Direct UPI Liquidity: 100% upfront UPI collection guarantees zero bad debt, no late accounts receivable, and predictable cash flow.',
  '• Highly Scalable Rail: Software infrastructure scales seamlessly with negligible incremental cost per university.'
];
s29.addText(beNarrative.join('\n\n'), {
  x: 7.1, y: 3.9, w: 5.1, h: 2.6,
  fontSize: 11, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.25
});

addFooter(s29, 29);
s29.addNotes(`SLIDE 29: BREAK-EVEN ANALYSIS
Under the 4% student fee model:
- Contribution margin: ₹2.90/order
- Break-even volume: 24,828 orders/year (41.4% capacity)
- Operational break-even: Month 5
- Capital payback: ~18 months`);

// SLIDE 30: FUTURE EXPANSION
// ==============================================================================
let s30 = pptx.addSlide();
s30.background = { color: BG_COLOR };
addHeader(s30, 'ECOSYSTEM EVOLUTION', 'Future Expansion & Product Horizons', 'Long-term revenue diversification beyond basic canteen ordering');

const expansions = [
  {
    num: 'HORIZON 01',
    title: 'Multi-Vendor Food Courts & Kiosks',
    desc: 'Unifying campus juice bars, stationery shops, coffee corners, and ice-cream stalls into a single unified FoodLine digital campus pass.',
    tint: LIGHT_GREEN, border: BORDER_GREEN, color: PRIMARY_GREEN
  },
  {
    num: 'HORIZON 02',
    title: 'Hostel Midnight Canteen Rail',
    desc: 'Extending ordering hours into 10 PM – 2 AM late-night study windows with dedicated hostel drop points, capturing high-margin night sales.',
    tint: LIGHT_BLUE, border: BORDER_BLUE, color: ACCENT_BLUE
  },
  {
    num: 'HORIZON 03',
    title: 'Campus Smart-Card & RFID Wallet',
    desc: 'Integrating student physical college ID cards and RFID tags with FoodLine balance, allowing parents to load prepaid meal credits.',
    tint: LIGHT_AMBER, border: BORDER_AMBER, color: ACCENT_AMBER
  },
  {
    num: 'HORIZON 04',
    title: 'Institutional Timetable ERP Sync',
    desc: 'Connecting directly with university lecture timetables to dynamically adjust batch slots during exam days and unexpected lecture shifts.',
    tint: LIGHT_GREEN, border: BORDER_GREEN, color: PRIMARY_GREEN
  },
  {
    num: 'HORIZON 05',
    title: 'National College Franchise Rail',
    desc: 'Replicating the proven 30-second express rail across 500+ universities, IITs, IIMs, and polytechnics across India.',
    tint: LIGHT_BLUE, border: BORDER_BLUE, color: ACCENT_BLUE
  }
];

expansions.forEach((ex, idx) => {
  const x = 0.8 + (idx * 2.4);
  s30.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 1.9, w: 2.2, h: 4.85,
    fill: { color: CARD_BG }, line: { color: ex.border, width: 1.5 }, rectRadius: 0.1
  });

  s30.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.15, y: 2.1, w: 1.9, h: 0.3,
    fill: { color: ex.tint }, line: { color: ex.border, width: 1 }, rectRadius: 0.08
  });
  s30.addText(ex.num, {
    x: x + 0.15, y: 2.1, w: 1.9, h: 0.3,
    fontSize: 9, bold: true, color: ex.color, align: 'center', fontFace: FONT_HEAD
  });

  s30.addText(ex.title, {
    x: x + 0.15, y: 2.55, w: 1.9, h: 0.65,
    fontSize: 12.5, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
  });

  s30.addText(ex.desc, {
    x: x + 0.15, y: 3.3, w: 1.9, h: 3.2,
    fontSize: 10.5, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.25
  });
});

addFooter(s30, 30);
s30.addNotes(`SLIDE 30: FUTURE EXPANSION
Beyond canteen dining, FoodLine expands into food courts, midnight hostel rails, smart RFID campus cards, and institutional timetable integrations.`);


// ==============================================================================
// SLIDE 31: CONCLUSION
// ==============================================================================
let s31 = pptx.addSlide();
s31.background = { color: BG_COLOR };
addHeader(s31, 'STRATEGIC COMMITMENT', 'Conclusion: The Winning Equation', 'Synthesizing our commercial value proposition for students, canteens, and investment partners');

// 3 Highlight Pillars
const concCards = [
  {
    title: 'For Students',
    highlight: 'Zero Recess Lines',
    desc: '• Reclaim 18 minutes of lost break time\n• Never skip a meal or arrive late to lectures\n• Hot, pre-packed meals ready on time',
    color: PRIMARY_GREEN, tint: LIGHT_GREEN, border: BORDER_GREEN
  },
  {
    title: 'For Canteens',
    highlight: '40% Sales Jump & Zero Fraud',
    desc: '• Smooth kitchen flow via slot throttling\n• 100% Guaranteed money with bank UTR\n• Free KDS hardware with zero Capex',
    color: ACCENT_BLUE, tint: LIGHT_BLUE, border: BORDER_BLUE
  },
  {
    title: 'For Investors',
    highlight: 'Asset-Light Scaling',
    desc: '• 67% Gross margins with zero fleet Capex\n• Month 1 operational profitability\n• High-frequency captive campus cashflow',
    color: ACCENT_AMBER, tint: LIGHT_AMBER, border: BORDER_AMBER
  }
];

concCards.forEach((cc, idx) => {
  const x = 0.8 + (idx * 4.0);
  s31.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 1.9, w: 3.7, h: 2.8,
    fill: { color: CARD_BG }, line: { color: cc.border, width: 1.5 }, rectRadius: 0.12
  });

  s31.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.3, y: 2.1, w: 3.1, h: 0.3,
    fill: { color: cc.tint }, line: { color: cc.border, width: 1 }, rectRadius: 0.08
  });
  s31.addText(cc.title.toUpperCase(), {
    x: x + 0.3, y: 2.1, w: 3.1, h: 0.3,
    fontSize: 10, bold: true, color: cc.color, align: 'center', fontFace: FONT_HEAD
  });

  s31.addText(cc.highlight, {
    x: x + 0.3, y: 2.5, w: 3.1, h: 0.4,
    fontSize: 15, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD
  });

  s31.addText(cc.desc, {
    x: x + 0.3, y: 2.95, w: 3.1, h: 1.6,
    fontSize: 11, color: TEXT_BODY, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
  });
});

// Closing Manifesto Card
s31.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 4.95, w: 11.7, h: 1.9,
  fill: { color: LIGHT_GREEN }, line: { color: PRIMARY_GREEN, width: 2 }, rectRadius: 0.15
});

s31.addText('OUR PLEDGE TO CAMPUS DINING:', {
  x: 1.1, y: 5.15, w: 11.1, h: 0.25,
  fontSize: 11, bold: true, color: PRIMARY_GREEN, fontFace: FONT_HEAD
});

s31.addText('FoodLine Campus is committed to transforming university dining into a disciplined, technology-driven, and enjoyable experience.\nBy marrying classroom digital pre-ordering with intelligent kitchen pacing and 100% fraud-proof payments, we create a sustainable, scalable, and highly profitable business.', {
  x: 1.1, y: 5.45, w: 11.1, h: 0.8,
  fontSize: 13, bold: true, color: TEXT_DARK, fontFace: FONT_HEAD, lineSpacingMultiple: 1.2
});

s31.addText('Pilot Launch Site: Sanjivani University (Cafe @7 Outlet) • Ready for Immediate Deployment', {
  x: 1.1, y: 6.35, w: 11.1, h: 0.3,
  fontSize: 12, bold: true, color: PRIMARY_GREEN, fontFace: FONT_HEAD
});

addFooter(s31, 31);
s31.addNotes(`SLIDE 31: CONCLUSION
FoodLine Campus delivers an undeniable win-win: students eat without waiting, canteens make more money without chaos, and investors enjoy high-margin cash flow.`);


// ==============================================================================
// SLIDE 32: THANK YOU (CONTACT SLIDE)
// ==============================================================================
let s32 = pptx.addSlide();
s32.background = { color: BG_COLOR };

s32.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 13.333, h: 0.15,
  fill: { color: PRIMARY_GREEN }, line: { color: PRIMARY_GREEN }
});

s32.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 0.8, w: 11.7, h: 5.9,
  fill: { color: CARD_BG }, line: { color: BORDER_GREEN, width: 2 }, rectRadius: 0.15
});

if (HAS_LOGO) {
  s32.addImage({ path: LOGO_PATH, x: 5.7, y: 1.2, w: 1.9, h: 0.8 });
}

s32.addText('Thank You', {
  x: 0.8, y: 2.1, w: 11.7, h: 0.7,
  fontSize: 36, bold: true, color: TEXT_DARK, align: 'center', fontFace: FONT_HEAD
});

s32.addText('FoodLine Campus Technologies Pvt. Ltd.', {
  x: 0.8, y: 2.85, w: 11.7, h: 0.45,
  fontSize: 18, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: FONT_HEAD
});

s32.addText('Zero-Queue Express Food Ordering & Kitchen Automation\n"No More Waiting in Lines. Just Order, Grab, and Go."', {
  x: 0.8, y: 3.35, w: 11.7, h: 0.6,
  fontSize: 13, color: TEXT_MUTED, align: 'center', fontFace: FONT_BODY
});

// 3 Contact Pillar Badges
const contacts = [
  { label: 'CO-FOUNDERS & OPERATIONS', val: 'Shivam & Core Team\nFoodLine Campus Technologies', tint: LIGHT_GREEN, border: BORDER_GREEN, color: PRIMARY_GREEN },
  { label: 'DIRECT INQUIRIES & PHONE', val: '+91 76669 05482\n+91 91584 76427', tint: LIGHT_BLUE, border: BORDER_BLUE, color: ACCENT_BLUE },
  { label: 'EMAIL & OPERATIONAL HUB', val: 'foodlinecampus@gmail.com\nSanjivani University, Kopargaon', tint: LIGHT_AMBER, border: BORDER_AMBER, color: ACCENT_AMBER }
];

contacts.forEach((c, idx) => {
  const x = 1.4 + (idx * 3.6);
  s32.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 4.2, w: 3.2, h: 1.6,
    fill: { color: 'FFFFFF' }, line: { color: c.border, width: 1.5 }, rectRadius: 0.1
  });

  s32.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.15, y: 4.35, w: 2.9, h: 0.28,
    fill: { color: c.tint }, line: { color: c.border, width: 1 }, rectRadius: 0.06
  });
  s32.addText(c.label, {
    x: x + 0.15, y: 4.35, w: 2.9, h: 0.28,
    fontSize: 8.5, bold: true, color: c.color, align: 'center', fontFace: FONT_HEAD
  });

  s32.addText(c.val, {
    x: x + 0.15, y: 4.75, w: 2.9, h: 0.85,
    fontSize: 11, bold: true, color: TEXT_DARK, align: 'center', fontFace: FONT_HEAD, lineSpacingMultiple: 1.2
  });
});

s32.addText('Let\'s Power the Future of Campus Dining Together.', {
  x: 0.8, y: 6.05, w: 11.7, h: 0.4,
  fontSize: 13, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: FONT_HEAD
});

addFooter(s32, 32);
s32.addNotes(`SLIDE 32: THANK YOU
Thank you for your time and consideration. We welcome your questions and look forward to partnering to scale FoodLine Campus.`);


// ==============================================================================
// SAVE PPTX FILE
// ==============================================================================
const OUTPUT_FILE = path.join(__dirname, '../FoodLine_Campus_Comprehensive_Business_Plan.pptx');

pptx.writeFile({ fileName: OUTPUT_FILE })
  .then(fileName => {
    console.log(`\n🎉 SUCCESS: 32-Slide Comprehensive Business Plan PPTX created successfully at:\n${fileName}\n`);
  })
  .catch(err => {
    console.error('❌ Error creating PPTX:', err);
    process.exit(1);
  });
