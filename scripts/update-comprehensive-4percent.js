const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'generate-comprehensive-business-plan.js');
let code = fs.readFileSync(targetFile, 'utf8');

// 1. Update Executive Summary Slide 3 rev text
code = code.replace(
  `rev: '₹4.44 Lakhs Revenue',`,
  `rev: '₹1.92 Lakhs Revenue (4% Student Fee)',`
);

// 2. Update Slide 16 feature table: 0% canteen commission vs competitors
code = code.replace(
  `{ text: 'Customer Extra Fee', options: { bold: true } },\n    { text: '₹2 – ₹3 micro-fee', options: { color: PRIMARY_GREEN, bold: true, align: 'center' } },`,
  `{ text: 'Customer Extra Fee', options: { bold: true } },\n    { text: '4% Express Fee (~₹3.20)', options: { color: PRIMARY_GREEN, bold: true, align: 'center' } },`
);

// 3. Update Slide 24: Assumptions & P&L
const oldS24 = code.substring(code.indexOf('// SLIDE 24: INCOME AND EXPENSE PROJECTIONS'), code.indexOf('// SLIDE 25: FINANCE - 5 YEARS'));

const newS24 = `// SLIDE 24: INCOME AND EXPENSE PROJECTIONS (4% STUDENT FEE MODEL)
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
  fontSize: 10, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: 'Arial'
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
s24.addText(assumptionsText.join('\\n'), {
  x: 1.1, y: 2.65, w: 5.1, h: 3.9,
  fontSize: 10.5, color: TEXT_DARK, fontFace: 'Arial', lineSpacingMultiple: 1.2
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
  fontFace: 'Arial'
});

addFooter(s24, 24);
s24.addNotes(\`SLIDE 24: INCOME AND EXPENSES
Single-campus pilot unit economics under the 4% student fee model:
- GMV: ₹48 Lakhs
- Canteen Commission: ₹0 (Zero friction onboarding)
- Revenue: ₹1.92 Lakhs (4% convenience fee from students)
- Direct Tech COGS: ₹18,000
- Gross Profit: ₹1.74 Lakhs (90.6% gross margin)
- Lean Fixed OPEX: ₹72,000
- Net Profit: ₹1.02 Lakhs (53.1% net margin)\`);

`;

code = code.replace(oldS24, newS24);

// 4. Update Slide 25 (5 Years Projections)
const oldS25 = code.substring(code.indexOf('// SLIDE 25: FINANCE - 5 YEARS'), code.indexOf('// SLIDE 26: FINANCE - OPERATING'));

const newS25 = `// SLIDE 25: FINANCE - 5 YEARS REVENUE PROJECTION (4% MODEL)
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
  fontFace: 'Arial'
});

addFooter(s25, 25);
s25.addNotes(\`SLIDE 25: 5-YEAR PROJECTIONS
Our 5-year growth path takes us from:
- Year 1: 1 campus, ₹48L GMV, ₹1.92L revenue, ₹1.02L profit
- Year 2: 5 campuses, ₹2.4Cr GMV, ₹9.60L revenue, ₹6.30L profit
- Year 3: 15 campuses, ₹7.2Cr GMV, ₹28.80L revenue, ₹19.60L profit
- Year 4: 30 campuses, ₹14.4Cr GMV, ₹57.60L revenue, ₹38.20L profit
- Year 5: 50 campuses, ₹24.0Cr GMV, ₹96.00L revenue, ₹63.00L profit
Targeting the long-term ₹344,57,81,800 Goldmine enterprise valuation across 500+ Indian campuses.\`);

`;

code = code.replace(oldS25, newS25);

// 5. Update Slide 29: Break-even analysis
const oldS29 = code.substring(code.indexOf('// SLIDE 29: BREAK-EVEN POINT'), code.indexOf('// SLIDE 30: FUTURE EXPANSION'));

const newS29 = `// SLIDE 29: BREAK-EVEN POINT AND PERIOD (4% STUDENT MODEL)
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
  fontSize: 10, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: 'Arial'
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
s29.addText(beFormulaPoints.join('\\n'), {
  x: 1.1, y: 2.65, w: 5.1, h: 3.9,
  fontSize: 10.5, color: TEXT_DARK, fontFace: 'Arial', lineSpacingMultiple: 1.2
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
  fontSize: 10, bold: true, color: ACCENT_BLUE, align: 'center', fontFace: 'Arial'
});

s29.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.1, y: 2.65, w: 5.1, h: 1.1,
  fill: { color: LIGHT_GREEN }, line: { color: PRIMARY_GREEN, width: 1.5 }, rectRadius: 0.1
});
s29.addText('OPERATIONAL BREAK-EVEN: MONTH 5\\nCapital Payback: ~18 Months', {
  x: 7.1, y: 2.85, w: 5.1, h: 0.7,
  fontSize: 15, bold: true, color: PRIMARY_GREEN, align: 'center', fontFace: 'Arial'
});

const beNarrative = [
  '• Rapid Hardware Payback: The ₹15,000 canteen hardware setup is recouped in < 45 days of live ordering.',
  '• Zero Canteen Resistance: Because canteens pay ₹0 commission, campus acquisition velocity is 3x faster than conventional B2B food-tech.',
  '• Direct UPI Liquidity: 100% upfront UPI collection guarantees zero bad debt, no late accounts receivable, and predictable cash flow.',
  '• Highly Scalable Rail: Software infrastructure scales seamlessly with negligible incremental cost per university.'
];
s29.addText(beNarrative.join('\\n\\n'), {
  x: 7.1, y: 3.9, w: 5.1, h: 2.6,
  fontSize: 11, color: TEXT_BODY, fontFace: 'Arial', lineSpacingMultiple: 1.25
});

addFooter(s29, 29);
s29.addNotes(\`SLIDE 29: BREAK-EVEN ANALYSIS
Under the 4% student fee model:
- Contribution margin: ₹2.90/order
- Break-even volume: 24,828 orders/year (41.4% capacity)
- Operational break-even: Month 5
- Capital payback: ~18 months\`);

`;

code = code.replace(oldS29, newS29);

// 6. Update Save logic with fallbacks
const oldSaveMarker = '// ==============================================================================\n// SAVE PPTX FILE';
const idxSave = code.indexOf(oldSaveMarker);
if (idxSave !== -1) {
  const newSaveBlock = `// ==============================================================================
// SAVE PPTX FILE (With resilient fallback if PowerPoint has files open)
// ==============================================================================
async function saveWithFallbacks() {
  const candidates = [
    path.join(__dirname, '../FoodLine_Campus_Comprehensive_Business_Plan_4Percent.pptx'),
    path.join(__dirname, '../FoodLine_Campus_Comprehensive_Plan_Latest.pptx'),
    path.join(__dirname, '../FoodLine_Campus_Comprehensive_Business_Plan.pptx'),
    path.join(__dirname, '../FoodLine_Campus_Comprehensive_Business_Plan_Goldmine.pptx')
  ];

  for (const fPath of candidates) {
    try {
      const savedPath = await pptx.writeFile({ fileName: fPath });
      console.log(\`\\n🎉 SUCCESS: 32-Slide Comprehensive Business Plan PPTX created successfully at:\\n\${savedPath}\\n\`);
      return;
    } catch (err) {
      if (err.code === 'EBUSY') {
        console.warn(\`File \${path.basename(fPath)} is open in PowerPoint, trying next fallback filename...\`);
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
`;
  code = code.substring(0, idxSave) + newSaveBlock;
}

fs.writeFileSync(targetFile, code, 'utf8');
console.log('Successfully updated generate-comprehensive-business-plan.js with 4% student fee model!');
