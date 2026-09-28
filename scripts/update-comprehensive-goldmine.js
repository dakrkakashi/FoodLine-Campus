const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'generate-comprehensive-business-plan.js');
let code = fs.readFileSync(targetFile, 'utf8');

// 1. Update Slide 1 metaPoints
code = code.replace(
  `  '• 5-Year Target: Scale to 50 Campuses, 30 Lakh+ Orders/Year, ₹24 Cr GMV & ₹92 Lakh Net Profit'`,
  `  '• 5-Year Target: Scale to 50 Campuses, 30 Lakh+ Orders/Year, ₹24 Cr GMV & ₹92 Lakh Net Profit',\n  '• Goldmine Target: This business plan is designed to help achieve total Goldmine Amount ₹3,44,57,81,800 (₹344.58 Cr)'`
);

// 2. Update Slide 1 vision statement
code = code.replace(
  `achieving healthy unit profitability from Month 1."',`,
  `achieving healthy unit profitability and progressing towards our total Goldmine Target of ₹3,44,57,81,800 (₹344.58 Cr)."',`
);

// 3. Update Save logic to have fallback
code = code.replace(
  `const OUTPUT_FILE = path.join(__dirname, '../FoodLine_Campus_Comprehensive_Business_Plan.pptx');\n\npptx.writeFile({ fileName: OUTPUT_FILE })`,
  `const PRIMARY_OUTPUT = path.join(__dirname, '../FoodLine_Campus_Comprehensive_Business_Plan.pptx');\nconst FALLBACK_OUTPUT = path.join(__dirname, '../FoodLine_Campus_Comprehensive_Business_Plan_Goldmine.pptx');\n\npptx.writeFile({ fileName: PRIMARY_OUTPUT })\n  .then(fileName => {\n    console.log('\\n🎉 SUCCESS: 32-Slide Comprehensive Business Plan PPTX created successfully at:\\n' + fileName + '\\n');\n  })\n  .catch(err => {\n    if (err.code === 'EBUSY') {\n      console.warn('\\n⚠️ Note: Primary file is currently open in PowerPoint. Saving to fallback...');\n      return pptx.writeFile({ fileName: FALLBACK_OUTPUT }).then(fbName => {\n        console.log('\\n🎉 SUCCESS: Saved to fallback path with Goldmine Amount:\\n' + fbName + '\\n');\n      });\n    } else {\n      throw err;\n    }\n  })`
);

fs.writeFileSync(targetFile, code, 'utf8');
console.log('Successfully updated generate-comprehensive-business-plan.js with Goldmine amount!');
