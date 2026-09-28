import os
import shutil
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

def update_presentation(pptx_path, output_paths):
    print(f"Loading base presentation: {pptx_path}")
    prs = pptx.Presentation(pptx_path)

    # Colors
    COLOR_HEADER_FILL = RGBColor(0x37, 0x41, 0x51)      # Charcoal #374151
    COLOR_WHITE = RGBColor(0xFF, 0xFF, 0xFF)            # White
    COLOR_ALT_ROW = RGBColor(0xF3, 0xF4, 0xF6)          # Light Gray #F3F4F6
    COLOR_GREEN_FILL = RGBColor(0xDC, 0xFC, 0xE7)       # Light Green #DCFCE7
    COLOR_YELLOW_FILL = RGBColor(0xFE, 0xF0, 0x8A)      # Light Yellow #FEF08A
    COLOR_DARK_GREEN_TXT = RGBColor(0x16, 0x65, 0x34)   # Dark Green #166534
    COLOR_DARK_TEXT = RGBColor(0x11, 0x18, 0x27)        # Dark Charcoal #111827

    def format_cell(cell, text, bold=False, font_size=9.5, text_color=COLOR_DARK_TEXT, fill_color=None, align=PP_ALIGN.RIGHT):
        if fill_color:
            cell.fill.solid()
            cell.fill.fore_color.rgb = fill_color
        cell.text_frame.word_wrap = True
        cell.text_frame.margin_left = Inches(0.08)
        cell.text_frame.margin_right = Inches(0.08)
        cell.text_frame.margin_top = Inches(0.04)
        cell.text_frame.margin_bottom = Inches(0.04)
        
        p = cell.text_frame.paragraphs[0]
        p.text = text
        p.alignment = align
        p.font.name = "Calibri"
        p.font.size = Pt(font_size)
        p.font.bold = bold
        p.font.color.rgb = text_color

    def replace_table(slide, rows_data, left, top, width, height, col_widths, highlight_last_col_in_totals=True):
        old_table_shape = None
        for s in slide.shapes:
            if s.has_table:
                old_table_shape = s
                break
        
        if old_table_shape:
            sp = old_table_shape._element
            sp.getparent().remove(sp)

        num_rows = len(rows_data)
        num_cols = len(col_widths)
        new_shape = slide.shapes.add_table(num_rows, num_cols, left, top, width, height)
        t = new_shape.table
        
        for c_i, w in enumerate(col_widths):
            t.columns[c_i].width = w

        for r_i, row in enumerate(rows_data):
            is_header = (r_i == 0)
            is_total = (r_i == num_rows - 1) or ("Total" in str(row[0])) or ("Net" in str(row[0]))
            
            for c_i, val in enumerate(row):
                cell = t.cell(r_i, c_i)
                align = PP_ALIGN.LEFT if c_i == 0 else (PP_ALIGN.CENTER if is_header else PP_ALIGN.RIGHT)
                bold = is_header or is_total or (c_i == 0 and "•" not in str(val))
                
                if is_header:
                    f_col = COLOR_HEADER_FILL
                    t_col = COLOR_WHITE
                    f_size = 10.0
                elif is_total:
                    f_col = COLOR_YELLOW_FILL if (highlight_last_col_in_totals and c_i == num_cols - 1) else COLOR_GREEN_FILL
                    t_col = COLOR_DARK_GREEN_TXT if not (highlight_last_col_in_totals and c_i == num_cols - 1) else COLOR_DARK_TEXT
                    f_size = 10.0
                else:
                    f_col = COLOR_ALT_ROW if (r_i % 2 == 0) else COLOR_WHITE
                    t_col = COLOR_DARK_TEXT
                    f_size = 9.5

                format_cell(cell, str(val), bold=bold, font_size=f_size, text_color=t_col, fill_color=f_col, align=align)
        
        return new_shape

    # ==============================================================================
    # SLIDE 1: INCOME STATEMENT (5-YEAR PROJECTIONS: 2027 - 2031)
    # ==============================================================================
    slide1 = prs.slides[0]
    for s in slide1.shapes:
        if s.has_text_frame:
            txt = s.text_frame.text.strip()
            if "INCOME STATEMENT" in txt:
                s.text_frame.text = "INCOME STATEMENT ( 2027 – 2031 : 5-YEAR PROJECTIONS )"
                s.text_frame.paragraphs[0].font.name = "Calibri"
                s.text_frame.paragraphs[0].font.size = Pt(20)
                s.text_frame.paragraphs[0].font.bold = True
            elif "Projected Revenue" in txt:
                s.text_frame.text = "Projected Revenue, Expenses and Net Profit Margins (P&L) — Target Achieved in Year 5!"
                s.text_frame.paragraphs[0].font.name = "Calibri"
                s.text_frame.paragraphs[0].font.size = Pt(11)

    s1_rows = [
        ["PARTICULARS", "2027 (FY 26-27)", "2028 (FY 27-28)", "2029 (FY 28-29)", "2030 (FY 29-30)", "2031 (FY 30-31)"],
        ["Gross Merchandise Value (GMV @ ₹70 AOV)", "₹2,52,00,000", "₹12,60,00,000", "₹25,20,00,000", "₹28,35,00,000", "₹37,80,00,000"],
        ["FoodLine Revenue (4% Student Convenience Fee)", "₹10,08,000", "₹50,40,000", "₹1,00,80,000", "₹1,13,40,000", "₹1,51,20,000"],
        ["• Active Campuses / Active Dining Students", "1 Campus (1.5K)", "5 Campuses (7.5K)", "10 Campuses (15K)", "15 Campuses (22.5K)", "20 Campuses (30K)"],
        ["• Annual Digital Orders Transacted", "3,60,000 Orders", "18,00,000 Orders", "36,00,000 Orders", "40,50,000 Orders", "54,00,000 Orders"],
        ["Operating Expenses :", "", "", "", "", ""],
        ["• Direct Variable Tech Cost (~₹0.30/order SMS/Cloud)", "₹1,08,000", "₹5,40,000", "₹10,80,000", "₹12,15,000", "₹16,20,000"],
        ["• Cloud Hosting, Real-time SSE & Database", "Included in Tech", "Included in Tech", "Included in Tech", "Included in Tech", "Included in Tech"],
        ["• Canteen Software & Merchant Fee (0% Comm.)", "₹0 (100% Free)", "₹0 (100% Free)", "₹0 (100% Free)", "₹0 (100% Free)", "₹0 (100% Free)"],
        ["• Payment Gateway MDR (Direct UPI 0% Rail)", "₹0 (0% MDR)", "₹0 (0% MDR)", "₹0 (0% MDR)", "₹0 (0% MDR)", "₹0 (0% MDR)"],
        ["Total Operating Expenses", "₹1,08,000", "₹5,40,000", "₹10,80,000", "₹12,15,000", "₹16,20,000"],
        ["Net Annual Profit (89.3% Net Margin)", "+₹9,00,000 (Pilot)", "+₹45,00,000 (Scale)", "+₹90,00,000 (Scale)", "+₹1,01,25,000", "+₹1,35,00,000 (108% Target!)"]
    ]

    col_widths_6 = [Inches(3.23), Inches(1.70), Inches(1.70), Inches(1.70), Inches(1.70), Inches(1.70)]
    replace_table(slide1, s1_rows, Inches(0.8), Inches(1.87), Inches(11.73), Inches(3.87), col_widths_6, highlight_last_col_in_totals=True)

    # ==============================================================================
    # SLIDE 2: CASHFLOW STATEMENT (2027 - 2031)
    # ==============================================================================
    slide2 = prs.slides[1]
    for s in slide2.shapes:
        if s.has_text_frame:
            txt = s.text_frame.text.strip()
            if "CASHFLOW STATEMENT" in txt:
                s.text_frame.text = "CASHFLOW STATEMENT ( 2027 – 2031 : 5-YEAR INFLOWS )"
                s.text_frame.paragraphs[0].font.name = "Calibri"
                s.text_frame.paragraphs[0].font.size = Pt(20)
                s.text_frame.paragraphs[0].font.bold = True
            elif "Projected Total Cash Inflows" in txt:
                s.text_frame.text = "Projected Total Cash Inflows Across 5 Operating Years"
                s.text_frame.paragraphs[0].font.name = "Calibri"
                s.text_frame.paragraphs[0].font.size = Pt(11)
            elif "INFLOW HIGHLIGHTS & CAPITAL TRAJECTORY" in txt:
                pass
            elif "• Year 1 (2027):" in txt or "Initial liquidity established" in txt:
                s.text_frame.text = (
                    "• Year 1 (2027): Initial setup fully funded through ₹1.04L founders' commitment (51%) and ₹1.00L SCILL incubation grant (49%), covering the ₹2.04 Lakhs setup capital with zero debt.\n"
                    "• 100% Free for Canteens (0% commission) eliminates all merchant resistance, while students happily pay a 4% express convenience fee (avg ₹2.80 on ₹70 AOV) to skip 20-min cafeteria queues.\n"
                    "• Self-Funding Scale: Cash inflows surge 15x from ₹10.08 Lakhs in Year 1 to ₹1.51 Crores in Year 5 across 20 campuses, eliminating any further equity dilution."
                )
                for p in s.text_frame.paragraphs:
                    p.font.name = "Calibri"
                    p.font.size = Pt(10)

    s2_rows = [
        ["Particular", "2027 (FY 26-27)", "2028 (FY 27-28)", "2029 (FY 28-29)", "2030 (FY 29-30)", "2031 (FY 30-31)"],
        ["Founders Equity Investment (51%)", "₹1,04,040", "-", "-", "-", "-"],
        ["Seed Capital / Incubation Grant (49%)", "₹99,960", "-", "-", "-", "-"],
        ["Platform Revenue (4% Student Convenience Fee)", "₹10,08,000", "₹50,40,000", "₹1,00,80,000", "₹1,13,40,000", "₹1,51,20,000"],
        ["Canteen Commission & KDS Software (100% Free)", "₹0 (0% Comm)", "₹0 (0% Comm)", "₹0 (0% Comm)", "₹0 (0% Comm)", "₹0 (0% Comm)"],
        ["Total Cash Inflows", "₹12,12,000", "₹50,40,000", "₹1,00,80,000", "₹1,13,40,000", "₹1,51,20,000"]
    ]
    replace_table(slide2, s2_rows, Inches(0.8), Inches(2.2), Inches(11.73), Inches(2.67), col_widths_6, highlight_last_col_in_totals=False)

    # ==============================================================================
    # SLIDE 3: CASH OUTFLOW & NET CASHFLOW (2027 - 2031)
    # ==============================================================================
    slide3 = prs.slides[2]
    for s in slide3.shapes:
        if s.has_text_frame:
            txt = s.text_frame.text.strip()
            if "CASH OUTFLOW" in txt:
                s.text_frame.text = "CASH OUTFLOW & NET CASHFLOW ( 2027 – 2031 )"
                s.text_frame.paragraphs[0].font.name = "Calibri"
                s.text_frame.paragraphs[0].font.size = Pt(20)
                s.text_frame.paragraphs[0].font.bold = True
            elif "Capital Deployment" in txt:
                s.text_frame.text = "Capital Deployment, Operating Costs and Net Cash Surplus"
                s.text_frame.paragraphs[0].font.name = "Calibri"
                s.text_frame.paragraphs[0].font.size = Pt(11)
            elif "CASH POSITION & LIQUIDITY ANALYSIS" in txt:
                pass
            elif "FoodLine operates with positive net cash flow" in txt:
                s.text_frame.text = (
                    "• Cash Flow Positive from Month 1: Direct UPI peer-to-merchant routing enables same-day settlement with zero debt, credit risk, or payment gateway MDR fees.\n"
                    "• Rapid Capital Payback: The entire ₹2.04 Lakhs initial setup capital is recovered within 4 months from Year 1 pilot net profit (₹9.00 Lakhs).\n"
                    "• Liquidity & Reserves: Accumulated net cash surplus exceeds ₹3.70 Crores over 5 years, providing massive liquidity to reach the ₹25.00 Cr Goldmine Milestone."
                )
                for p in s.text_frame.paragraphs:
                    p.font.name = "Calibri"
                    p.font.size = Pt(10)

    s3_rows = [
        ["Cash OutFlow Item", "2027 (FY 26-27)", "2028 (FY 27-28)", "2029 (FY 28-29)", "2030 (FY 29-30)", "2031 (FY 30-31)"],
        ["Software Platform Build & Testing (Next.js/PWA)", "₹60,000", "-", "-", "-", "-"],
        ["Canteen Kitchen Tablets & Soundboxes", "₹15,000 (1 Camp)", "₹60,000 (4 Camp)", "₹75,000 (5 Camp)", "₹75,000 (5 Camp)", "₹75,000 (5 Camp)"],
        ["Company Registration, Legal & Compliance", "₹25,000", "₹10,000", "₹15,000", "₹20,000", "₹25,000"],
        ["Campus Branding & Acrylic QR Stands", "₹20,000", "₹80,000", "₹1,00,000", "₹1,00,000", "₹1,00,000"],
        ["Direct Variable Tech Cost (~₹0.30/order)", "₹1,08,000", "₹5,40,000", "₹10,80,000", "₹12,15,000", "₹16,20,000"],
        ["Working Capital & Operations Reserve", "₹84,000", "₹50,000", "₹75,000", "₹75,000", "₹1,00,000"],
        ["Total Cash OutFlows", "₹3,12,00,000" if False else "₹3,12,000", "₹7,40,000", "₹13,45,000", "₹14,85,000", "₹19,20,000"],
        ["Net CashFlow Surplus (Inflows - Outflows)", "+₹9,00,000", "+₹43,00,000", "+₹87,35,000", "+₹98,55,000", "+₹1,32,00,000 (Y5 Surplus)"]
    ]
    replace_table(slide3, s3_rows, Inches(0.8), Inches(1.87), Inches(11.73), Inches(3.09), col_widths_6, highlight_last_col_in_totals=True)

    # ==============================================================================
    # SLIDE 4: CONCLUSION & 5-YEAR PROGRESSION
    # ==============================================================================
    slide4 = prs.slides[3]
    for s in slide4.shapes:
        if s.has_text_frame:
            txt = s.text_frame.text.strip()
            if "CONCLUSION" in txt:
                s.text_frame.text = "CONCLUSION & 5-YEAR PROGRESSION"
                s.text_frame.paragraphs[0].font.name = "Calibri"
                s.text_frame.paragraphs[0].font.size = Pt(20)
                s.text_frame.paragraphs[0].font.bold = True
            elif "Key Financial Milestones" in txt:
                s.text_frame.text = "Key Financial Milestones from Campus Pilot to ₹25.00 Cr Goldmine Milestone (5% Target Achieved!)"
                s.text_frame.paragraphs[0].font.name = "Calibri"
                s.text_frame.paragraphs[0].font.size = Pt(11)
            # Box 1 Header
            elif "Year 2027 : Foundation" in txt:
                s.text_frame.text = "Year 1 (2027) : Foundation & Pilot Proof of Concept"
                s.text_frame.paragraphs[0].font.name = "Calibri"
                s.text_frame.paragraphs[0].font.size = Pt(13)
                s.text_frame.paragraphs[0].font.bold = True
            # Box 1 Body
            elif "With initial founder investment" in txt or "Proves 100% operational viability" in txt:
                s.text_frame.text = (
                    "o  Funded via ₹1.04L founders' equity (51%) and ₹1.00L SCILL incubation grant (49%), fully covering the ₹2.04 Lakhs setup cost.\n"
                    "o  Proves 100% operational viability at Sanjivani University Cafe @7: 1,500 active students (60% adoption) generating 3,60,000 orders/yr.\n"
                    "o  Delivers ₹2.52 Cr GMV, ₹10.08L platform revenue, and ₹9.00L net profit (89.3% margin) with operational break-even in Month 1!"
                )
                for p in s.text_frame.paragraphs:
                    p.font.name = "Calibri"
                    p.font.size = Pt(10)
            # Box 2 Header
            elif "Year 2028 : Regional Growth" in txt:
                s.text_frame.text = "Years 2–3 (2028–2029) : Regional Scale & Network Expansion"
                s.text_frame.paragraphs[0].font.name = "Calibri"
                s.text_frame.paragraphs[0].font.size = Pt(13)
                s.text_frame.paragraphs[0].font.bold = True
            # Box 2 Body
            elif "Revenue expands over 6.3x" in txt or "Deploys automated batch-cooking" in txt:
                s.text_frame.text = (
                    "o  Network expands from 5 campuses (7,500 students) in Year 2 to 10 campuses (15,000 students) across Maharashtra in Year 3.\n"
                    "o  Annual GMV expands 10x from ₹12.60 Crores to ₹25.20 Crores; platform revenue crosses ₹1.00 Crore with zero merchant churn.\n"
                    "o  Net annual profit surges to ₹45.00 Lakhs in Year 2 and ₹90.00 Lakhs in Year 3, establishing an unshakeable regional competitive moat."
                )
                for p in s.text_frame.paragraphs:
                    p.font.name = "Calibri"
                    p.font.size = Pt(10)
            # Box 3 Header
            elif "Year 2029 : National Scale" in txt:
                s.text_frame.text = "Year 5 (2031) : Goldmine Target Achieved (108% of ₹1.25 Cr Target)"
                s.text_frame.paragraphs[0].font.name = "Calibri"
                s.text_frame.paragraphs[0].font.size = Pt(13)
                s.text_frame.paragraphs[0].font.bold = True
            # Box 3 Body
            elif "Business stabilizes as India's premier" in txt or "Generates ₹12.50 Crores" in txt:
                s.text_frame.text = (
                    "o  Scales to 20 prime campuses with 30,000 active students generating 54,00,000 digital orders and ₹37.80 Crores in annual food GMV.\n"
                    "o  Delivers ₹1,35,00,000 (₹1.35 Crores) Net Annual Profit in Year 5 — achieving 108.0% of the ₹1.25 Cr target (5% of ₹25.00 Cr Goldmine)!\n"
                    "o  Cumulative 5-year net profit reaches ₹3,80,24,999 (~₹3.80 Crores), delivering a 304.2% milestone return with zero debt."
                )
                for p in s.text_frame.paragraphs:
                    p.font.name = "Calibri"
                    p.font.size = Pt(10)

    for out_p in output_paths:
        try:
            prs.save(out_p)
            print(f"Successfully saved updated presentation: {out_p}")
        except Exception as e:
            print(f"Could not save to {out_p} (might be currently open): {e}")

if __name__ == "__main__":
    desktop_ppt = r"C:\Users\shiva\Desktop\main finance\ppt.pptx"
    out_paths = [
        r"C:\Users\shiva\Desktop\main finance\ppt_updated.pptx",
        r"C:\Users\shiva\Desktop\main finance\FoodLine_Campus_Final_Finance_Presentation.pptx",
        desktop_ppt
    ]
    update_presentation(desktop_ppt, out_paths)
