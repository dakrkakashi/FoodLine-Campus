import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def build_model():
    wb = openpyxl.Workbook()
    wb.remove(wb.active) # Remove default sheet

    # Color Palette
    NAVY_HEADER = "1A1A2E"
    CHARCOAL_HEADER = "374151"
    ORANGE_ACCENT = "FF6B2C"
    GREEN_ACCENT = "16A34A"
    BLUE_ACCENT = "2563EB"
    RED_ACCENT = "DC2626"
    LIGHT_GRAY_FILL = "F9FAFB"
    ALT_ROW_FILL = "F3F4F6"
    GREEN_LIGHT_FILL = "DCFCE7"
    ORANGE_LIGHT_FILL = "FFEDD5"
    BLUE_LIGHT_FILL = "EFF6FF"
    BORDER_GRAY = "D1D5DB"

    font_title = Font(name="Calibri", size=15, bold=True, color="FFFFFF")
    font_subtitle = Font(name="Calibri", size=10, italic=True, color="6B7280")
    font_section = Font(name="Calibri", size=12, bold=True, color=NAVY_HEADER)
    font_tbl_header = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    font_bold = Font(name="Calibri", size=11, bold=True)
    font_regular = Font(name="Calibri", size=11)
    font_muted = Font(name="Calibri", size=10, color="6B7280")
    font_kpi_num = Font(name="Calibri", size=18, bold=True, color=NAVY_HEADER)
    font_kpi_label = Font(name="Calibri", size=9, bold=True, color="4B5563")

    fill_navy = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type="solid")
    fill_charcoal = PatternFill(start_color=CHARCOAL_HEADER, end_color=CHARCOAL_HEADER, fill_type="solid")
    fill_orange = PatternFill(start_color=ORANGE_ACCENT, end_color=ORANGE_ACCENT, fill_type="solid")
    fill_green = PatternFill(start_color=GREEN_ACCENT, end_color=GREEN_ACCENT, fill_type="solid")
    fill_alt = PatternFill(start_color=ALT_ROW_FILL, end_color=ALT_ROW_FILL, fill_type="solid")
    fill_green_light = PatternFill(start_color=GREEN_LIGHT_FILL, end_color=GREEN_LIGHT_FILL, fill_type="solid")
    fill_orange_light = PatternFill(start_color=ORANGE_LIGHT_FILL, end_color=ORANGE_LIGHT_FILL, fill_type="solid")
    fill_blue_light = PatternFill(start_color=BLUE_LIGHT_FILL, end_color=BLUE_LIGHT_FILL, fill_type="solid")
    fill_light_gray = PatternFill(start_color=LIGHT_GRAY_FILL, end_color=LIGHT_GRAY_FILL, fill_type="solid")

    thin_border_side = Side(border_style="thin", color=BORDER_GRAY)
    double_bottom_side = Side(border_style="double", color="1A1A2E")
    top_thin_side = Side(border_style="thin", color="1A1A2E")

    cell_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
    total_border = Border(top=top_thin_side, bottom=double_bottom_side, left=thin_border_side, right=thin_border_side)

    align_left = Alignment(horizontal="left", vertical="center")
    align_right = Alignment(horizontal="right", vertical="center")
    align_center = Alignment(horizontal="center", vertical="center")

    CURR_FORMAT = "₹#,##0;[Red](₹#,##0);\"-\""
    CURR_DEC_FORMAT = "₹#,##0.00;[Red](₹#,##0.00);\"-\""
    PCT_FORMAT = "0.0%"
    NUM_FORMAT = "#,##0"

    def set_title_banner(ws, title, subtitle, max_col=6):
        max_col_letter = get_column_letter(max_col)
        ws.merge_cells(f"A1:{max_col_letter}1")
        ws["A1"] = f"  {title}"
        ws["A1"].font = font_title
        ws["A1"].fill = fill_navy
        ws["A1"].alignment = Alignment(horizontal="left", vertical="center")
        ws.row_dimensions[1].height = 36
        
        ws.merge_cells(f"A2:{max_col_letter}2")
        ws["A2"] = f"  {subtitle}"
        ws["A2"].font = font_subtitle
        ws["A2"].alignment = Alignment(horizontal="left", vertical="center")
        ws.row_dimensions[2].height = 20

    # ==============================================================================
    # TAB 1: EXECUTIVE DASHBOARD
    # ==============================================================================
    ws_dash = wb.create_sheet(title="Executive Dashboard")
    ws_dash.views.sheetView[0].showGridLines = True
    set_title_banner(ws_dash, "FoodLine Campus — Executive Financial Dashboard (2027–2029)", "High-level performance summary, 3-year growth metrics, unit economics, and seed investment ask", max_col=7)

    # KPI Cards row 4 to 6
    kpi_cards = [
        ("3-YEAR CUMULATIVE REVENUE", "='Income Statement (P&L)'!C12+'Income Statement (P&L)'!D12+'Income Statement (P&L)'!E12", CURR_FORMAT, "B4:C5", "B6:C6"),
        ("YEAR 3 NET PROFIT", "='Income Statement (P&L)'!E25", CURR_FORMAT, "D4:E5", "D6:E6"),
        ("YEAR 3 NET MARGIN", "='Income Statement (P&L)'!E26", PCT_FORMAT, "F4:G5", "F6:G6"),
    ]

    for label, formula, num_fmt, top_range, btm_range in kpi_cards:
        ws_dash.merge_cells(top_range)
        top_cell = ws_dash[top_range.split(":")[0]]
        top_cell.value = formula
        top_cell.font = font_kpi_num
        top_cell.alignment = align_center
        top_cell.number_format = num_fmt
        top_cell.fill = fill_green_light
        
        ws_dash.merge_cells(btm_range)
        btm_cell = ws_dash[btm_range.split(":")[0]]
        btm_cell.value = label
        btm_cell.font = font_kpi_label
        btm_cell.alignment = align_center
        btm_cell.fill = fill_light_gray

    # Second Row of KPI cards row 8 to 10
    kpi_cards_2 = [
        ("YEAR 3 CASH WAR CHEST", "='Cash Flow Statement'!E21", CURR_FORMAT, "B8:C9", "B10:C10"),
        ("CAMPUS REACH (YEAR 3)", "='Assumptions & Drivers'!E6", NUM_FORMAT, "D8:E9", "D10:E10"),
        ("CANTEEN REACH (YEAR 3)", "='Assumptions & Drivers'!E7", NUM_FORMAT, "F8:G9", "F10:G10"),
    ]

    for label, formula, num_fmt, top_range, btm_range in kpi_cards_2:
        ws_dash.merge_cells(top_range)
        top_cell = ws_dash[top_range.split(":")[0]]
        top_cell.value = formula
        top_cell.font = font_kpi_num
        top_cell.alignment = align_center
        top_cell.number_format = num_fmt
        top_cell.fill = fill_blue_light
        
        ws_dash.merge_cells(btm_range)
        btm_cell = ws_dash[btm_range.split(":")[0]]
        btm_cell.value = label
        btm_cell.font = font_kpi_label
        btm_cell.alignment = align_center
        btm_cell.fill = fill_light_gray

    # Summary Comparison Table
    ws_dash.cell(row=12, column=2, value="3-YEAR EXECUTIVE SUMMARY TABLE").font = font_section

    dash_headers = ["Performance Metric", "2027 (FY 26-27)", "2028 (FY 27-28)", "2029 (FY 28-29)", "3-Yr CAGR / Growth"]
    for c_idx, h in enumerate(dash_headers, 2):
        cell = ws_dash.cell(row=13, column=c_idx, value=h)
        cell.font = font_tbl_header
        cell.fill = fill_charcoal
        cell.alignment = align_left if c_idx == 2 else align_right
        cell.border = cell_border

    dash_rows = [
        ("Active Campuses", "='Assumptions & Drivers'!C6", "='Assumptions & Drivers'!D6", "='Assumptions & Drivers'!E6", "=(E14/C14)^(1/2)-1", NUM_FORMAT, PCT_FORMAT),
        ("Active Canteens (Counters)", "='Assumptions & Drivers'!C7", "='Assumptions & Drivers'!D7", "='Assumptions & Drivers'!E7", "=(E15/C15)^(1/2)-1", NUM_FORMAT, PCT_FORMAT),
        ("Annual Order Volume", "='Income Statement (P&L)'!C5", "='Income Statement (P&L)'!D5", "='Income Statement (P&L)'!E5", "=(E16/C16)^(1/2)-1", NUM_FORMAT, PCT_FORMAT),
        ("Gross Merchandise Value (GMV)", "='Income Statement (P&L)'!C6", "='Income Statement (P&L)'!D6", "='Income Statement (P&L)'!E6", "=(E17/C17)^(1/2)-1", CURR_FORMAT, PCT_FORMAT),
        ("Total Gross Revenue", "='Income Statement (P&L)'!C12", "='Income Statement (P&L)'!D12", "='Income Statement (P&L)'!E12", "=(E18/C18)^(1/2)-1", CURR_FORMAT, PCT_FORMAT),
        ("Gross Profit", "='Income Statement (P&L)'!C14", "='Income Statement (P&L)'!D14", "='Income Statement (P&L)'!E14", "=(E19/C19)^(1/2)-1", CURR_FORMAT, PCT_FORMAT),
        ("Gross Profit Margin %", "='Income Statement (P&L)'!C15", "='Income Statement (P&L)'!D15", "='Income Statement (P&L)'!E15", "=E20-C20", PCT_FORMAT, PCT_FORMAT),
        ("Total Operating Expenses", "='Income Statement (P&L)'!C23", "='Income Statement (P&L)'!D23", "='Income Statement (P&L)'!E23", "=(E21/C21)^(1/2)-1", CURR_FORMAT, PCT_FORMAT),
        ("Net Profit / (Loss)", "='Income Statement (P&L)'!C25", "='Income Statement (P&L)'!D25", "='Income Statement (P&L)'!E25", "N/A (Turnaround)", CURR_FORMAT, None),
        ("Net Profit Margin %", "='Income Statement (P&L)'!C26", "='Income Statement (P&L)'!D26", "='Income Statement (P&L)'!E26", "=E23-C23", PCT_FORMAT, PCT_FORMAT),
        ("Ending Cash Balance", "='Cash Flow Statement'!C21", "='Cash Flow Statement'!D21", "='Cash Flow Statement'!E21", "=(E24/C24)^(1/2)-1", CURR_FORMAT, PCT_FORMAT),
    ]

    for r_offset, r_data in enumerate(dash_rows):
        curr_r = 14 + r_offset
        label, y1, y2, y3, cagr, fmt, cagr_fmt = r_data
        
        cell_lbl = ws_dash.cell(row=curr_r, column=2, value=label)
        cell_lbl.font = font_bold if "Revenue" in label or "Profit" in label else font_regular
        cell_lbl.border = cell_border
        cell_lbl.alignment = align_left
        
        for c_i, val in enumerate([y1, y2, y3], 3):
            cell = ws_dash.cell(row=curr_r, column=c_i, value=val)
            cell.font = font_bold if "Revenue" in label or "Profit" in label else font_regular
            cell.border = cell_border
            cell.alignment = align_right
            cell.number_format = fmt
            if "Net Profit" in label:
                cell.fill = fill_green_light if c_i > 3 else fill_orange_light
                
        cell_cagr = ws_dash.cell(row=curr_r, column=6, value=cagr)
        cell_cagr.font = font_regular
        cell_cagr.border = cell_border
        cell_cagr.alignment = align_right
        if cagr_fmt:
            cell_cagr.number_format = cagr_fmt

    # Investor Ask & Use of Funds Box row 26
    ws_dash.cell(row=26, column=2, value="THE INVESTMENT ASK & CAPITAL ALLOCATION").font = font_section

    ask_data = [
        ("Investment Target", "₹50,00,000 (₹50 Lakhs)", "Seed capital funding round"),
        ("Equity Offered", "5.0%", "Dilution on pre-money valuation"),
        ("Post-Money Valuation", "₹10,00,00,000 (₹10.00 Crores)", "Based on 300 campus pipeline & tech IP"),
        ("Operational Runway", "18 Months", "Fully covers expansion through break-even"),
        ("Payback Period per Canteen", "4.2 Months", "Capital recovery on KDS tablet deployment"),
        ("Use of Funds: Tech & AI Engine", "45% (₹22,50,000)", "Predictive slot throttling & KDS upgrades"),
        ("Use of Funds: Hardware Rollout", "35% (₹17,50,000)", "Deployment of 225 rugged KDS tablets"),
        ("Use of Funds: Growth & Marketing", "20% (₹10,00,000)", "Campus ambassador stipends & activation"),
    ]

    for idx, (k, v, desc) in enumerate(ask_data):
        r = 27 + idx
        c1 = ws_dash.cell(row=r, column=2, value=k)
        c1.font = font_bold
        c1.border = cell_border
        c1.fill = fill_light_gray
        
        c2 = ws_dash.cell(row=r, column=3, value=v)
        c2.font = font_bold
        c2.border = cell_border
        c2.alignment = align_right if "₹" in v or "%" in v else align_left
        if "Target" in k or "Valuation" in k:
            c2.fill = fill_orange_light
            
        ws_dash.merge_cells(start_row=r, start_column=4, end_row=r, end_column=6)
        c3 = ws_dash.cell(row=r, column=4, value=desc)
        c3.font = font_muted
        c3.border = cell_border
        c3.alignment = align_left

    # ==============================================================================
    # TAB 2: ASSUMPTIONS & DRIVERS
    # ==============================================================================
    ws_assump = wb.create_sheet(title="Assumptions & Drivers")
    ws_assump.views.sheetView[0].showGridLines = True
    set_title_banner(ws_assump, "FoodLine Campus — Financial Model Assumptions & Key Drivers", "Master variables powering 3-Year P&L, Cash Flow, Balance Sheet, and Unit Economics", max_col=6)

    assump_blocks = [
        ("1. CAMPUS SCALE & STUDENT TRAFFIC", 4, [
            ("Parameter", "Unit", "2027 (FY 26-27)", "2028 (FY 27-28)", "2029 (FY 28-29)", "Strategic Basis"),
            ("Active Partner Campuses", "Campuses", 15, 75, 300, "Expanding across Maharashtra, Karnataka, National"),
            ("Active Canteens (Counters)", "Counters", 45, 225, 1000, "Avg 3 to 3.3 canteens per campus"),
            ("Total Student Body per Campus", "Students", 2500, 2500, 2500, "Standard engineering/university campus"),
            ("Active Student Penetration %", "%", 0.40, 0.45, 0.50, "40% pilot baseline at Sanjivani growing to 50%"),
            ("Monthly Orders per Active Student", "Orders/Mo", 5.0, 5.5, 6.0, "Frequency during active semester"),
            ("Academic Operating Months per Year", "Months", 10, 10, 10, "Excludes summer vacation & exam breaks"),
        ]),
        ("2. REVENUE MODEL & PRICING DRIVERS", 13, [
            ("Parameter", "Unit", "2027 (FY 26-27)", "2028 (FY 27-28)", "2029 (FY 28-29)", "Strategic Basis"),
            ("Average Order Value (AOV)", "₹/Order", 65.0, 70.0, 75.0, "₹65 pilot baseline (Snack + Beverage)"),
            ("FoodLine Take-Rate (Merchant Commission)", "%", 0.12, 0.12, 0.12, "12% charged on incremental canteen sales"),
            ("KDS SaaS Tablet Monthly Lease per Canteen", "₹/Month", 2500, 2500, 2500, "Hardware lease + kitchen management software"),
            ("Student Platform Convenience Fee", "₹/Order", 0.0, 0.0, 0.0, "100% Free for students (Pure B2B Model)"),
        ]),
        ("3. VARIABLE COSTS PER ORDER (COGS)", 20, [
            ("Parameter", "Unit", "2027 (FY 26-27)", "2028 (FY 27-28)", "2029 (FY 28-29)", "Strategic Basis"),
            ("Cloud Server & DB (Supabase / AWS)", "₹/Order", 0.80, 0.65, 0.50, "Scales down with order density"),
            ("WhatsApp & SMS Notification Alerts", "₹/Order", 0.40, 0.35, 0.30, "OTP & 30-sec pickup ready alert"),
            ("Payment Gateway & Banking (12-digit UTR)", "₹/Order", 0.30, 0.25, 0.20, "Direct UPI routing & reconciliation"),
            ("Campus Support & Student Ambassador", "₹/Order", 0.80, 0.70, 0.60, "Field ops & campus ambassador stipend"),
            ("Total Variable Cost per Order", "₹/Order", "=SUM(C22:C25)", "=SUM(D22:D25)", "=SUM(E22:E25)", "Formula sum"),
        ]),
        ("4. FIXED OPERATING EXPENSES (ANNUAL OVERHEADS)", 29, [
            ("Expense Head", "Category", "2027 (FY 26-27)", "2028 (FY 27-28)", "2029 (FY 28-29)", "Strategic Basis"),
            ("Cloud Hosting & Gateway APIs", "Tech Infrastructure", 650000, 3200000, 15000000, "AWS, Supabase, SMS & WhatsApp APIs"),
            ("Operational & Field Salaries", "Human Capital", 1800000, 8500000, 42000000, "Tech leads, campus ops & managers"),
            ("Marketing & Campus Activation", "Growth & GTM", 800000, 4200000, 18000000, "QR table stands, fests, promotions"),
            ("Canteen Hardware Maintenance & Tech", "Hardware Ops", 300000, 1500000, 6000000, "KDS tablet maintenance & spares"),
            ("Legal, Admin & Contingency", "General & Admin", 250000, 1000000, 3500000, "Compliance, audit & travel"),
            ("Hardware Depreciation", "Non-Cash Expense", 250000, 750000, 2500000, "Straight-line depreciation on KDS"),
            ("Total Fixed Operating Expenses", "Total OPEX", "=SUM(C31:C36)", "=SUM(D31:D36)", "=SUM(E31:E36)", "Formula sum"),
        ]),
        ("5. CAPITAL STRUCTURE & FUNDING INFLOWS", 40, [
            ("Capital Inflow Source", "Type", "2027 (FY 26-27)", "2028 (FY 27-28)", "2029 (FY 28-29)", "Strategic Basis"),
            ("Owner / Founder Equity Investment", "Equity", 2000000, 0, 0, "Initial founder commitment"),
            ("Seed Capital / Incubation Grant Received", "Grant / Seed", 250000, 5000000, 0, "SCILL incubation grant + Seed round"),
            ("Bank Loan / Angel Capital (Debt)", "Debt", 250000, 1250000, 3000000, "Working capital line if required"),
        ])
    ]

    for sec_title, start_r, sec_rows in assump_blocks:
        ws_assump.cell(row=start_r, column=1, value=sec_title).font = font_section
        
        # Headers
        h_row = start_r + 1
        for c_idx, h in enumerate(sec_rows[0], 1):
            c = ws_assump.cell(row=h_row, column=c_idx, value=h)
            c.font = font_tbl_header
            c.fill = fill_charcoal
            c.alignment = align_left if c_idx == 1 else (align_center if c_idx == 2 else align_right)
            c.border = cell_border
            
        for r_i, r_data in enumerate(sec_rows[1:], h_row + 1):
            for c_i, val in enumerate(r_data, 1):
                c = ws_assump.cell(row=r_i, column=c_i, value=val)
                c.border = cell_border
                c.font = font_bold if "Total" in str(r_data[0]) else font_regular
                
                if c_i == 1:
                    c.alignment = align_left
                elif c_i == 2:
                    c.alignment = align_center
                elif c_i in [3, 4, 5]:
                    c.alignment = align_right
                    if isinstance(val, float) and val < 1.0 and "%" in r_data[1]:
                        c.number_format = PCT_FORMAT
                    elif "₹" in r_data[1]:
                        c.number_format = CURR_FORMAT if (isinstance(val, int) or (isinstance(val, float) and val >= 100)) else CURR_DEC_FORMAT
                    elif "Count" in r_data[1] or "Students" in r_data[1] or "Months" in r_data[1] or "Campuses" in r_data[1] or "Counters" in r_data[1]:
                        c.number_format = NUM_FORMAT
                else:
                    c.alignment = align_left
                    c.font = font_muted
            if "Total" in str(r_data[0]):
                for c_i in range(1, 7):
                    ws_assump.cell(row=r_i, column=c_i).fill = fill_light_gray

    # ==============================================================================
    # TAB 3: UNIT ECONOMICS (PER-ORDER & SINGLE CAMPUS PILOT)
    # ==============================================================================
    ws_unit = wb.create_sheet(title="Unit Economics & Pilot")
    ws_unit.views.sheetView[0].showGridLines = True
    set_title_banner(ws_unit, "FoodLine Campus — Unit Economics & Single-Campus Pilot Model", "Per-order contribution margins, canteen economics, and Cafe @7 pilot metrics", max_col=6)

    ws_unit.cell(row=4, column=1, value="1. PER-ORDER UNIT ECONOMICS BREAKDOWN").font = font_section

    unit_headers = ["Unit Economic Component", "Formula / Derivation", "Amount (₹)", "% of AOV", "Operational Description"]
    for c_i, h in enumerate(unit_headers, 1):
        c = ws_unit.cell(row=5, column=c_i, value=h)
        c.font = font_tbl_header
        c.fill = fill_charcoal
        c.alignment = align_left if c_i in [1, 2, 5] else align_right
        c.border = cell_border

    unit_rows = [
        ("Average Order Value (AOV)", "Assumptions & Drivers C15", "='Assumptions & Drivers'!C15", "=C6/C6", "Based on 2 items (e.g., Snack + Drink)", font_bold, fill_light_gray, CURR_DEC_FORMAT),
        ("FoodLine Take-Rate Revenue (12%)", "AOV * Take-Rate (12%)", "=C6*'Assumptions & Drivers'!C16", "=C7/C6", "Charged directly to canteen merchant", font_bold, fill_orange_light, CURR_DEC_FORMAT),
        ("  (-) Cloud & Server Cost", "Assumptions & Drivers C22", "=-'Assumptions & Drivers'!C22", "=C8/C6", "Supabase DB, real-time SSE stream", font_regular, None, CURR_DEC_FORMAT),
        ("  (-) WhatsApp & SMS Alerts", "Assumptions & Drivers C23", "=-'Assumptions & Drivers'!C23", "=C9/C6", "Transactional OTP & pickup alert", font_regular, None, CURR_DEC_FORMAT),
        ("  (-) Payment Gateway / Banking", "Assumptions & Drivers C24", "=-'Assumptions & Drivers'!C24", "=C10/C6", "12-digit UTR direct UPI routing", font_regular, None, CURR_DEC_FORMAT),
        ("  (-) Campus Support & Field Ops", "Assumptions & Drivers C25", "=-'Assumptions & Drivers'!C25", "=C11/C6", "Student ambassador stipend allocation", font_regular, None, CURR_DEC_FORMAT),
        ("Total Variable Cost per Order (COGS)", "SUM(Cloud .. Support)", "=SUM(C8:C11)", "=C12/C6", "Total direct delivery cost per order", font_bold, fill_light_gray, CURR_DEC_FORMAT),
        ("Net Contribution Margin per Order", "Take-Rate Revenue + Total Variable Cost", "=C7+C12", "=C13/C7", "Contribution margin on Take-Rate revenue", font_bold, fill_green_light, CURR_DEC_FORMAT),
    ]

    for r_idx, (lbl, drv, val, pct, desc, f_style, fill_style, fmt) in enumerate(unit_rows, 6):
        c1 = ws_unit.cell(row=r_idx, column=1, value=lbl)
        c1.font = f_style
        c1.border = cell_border
        if fill_style: c1.fill = fill_style
        
        c2 = ws_unit.cell(row=r_idx, column=2, value=drv)
        c2.font = font_regular
        c2.border = cell_border
        c2.alignment = align_left
        
        c3 = ws_unit.cell(row=r_idx, column=3, value=val)
        c3.font = f_style
        c3.border = cell_border
        c3.alignment = align_right
        c3.number_format = fmt
        if fill_style: c3.fill = fill_style
        
        c4 = ws_unit.cell(row=r_idx, column=4, value=pct)
        c4.font = f_style
        c4.border = cell_border
        c4.alignment = align_right
        c4.number_format = PCT_FORMAT
        if fill_style: c4.fill = fill_style
        
        c5 = ws_unit.cell(row=r_idx, column=5, value=desc)
        c5.font = font_muted
        c5.border = cell_border
        c5.alignment = align_left

    # Section 2: Single Campus Pilot Model (Sanjivani University)
    ws_unit.cell(row=16, column=1, value="2. SINGLE-CAMPUS PILOT ANNUAL MODEL (SANJIVANI UNIVERSITY CAFE @7)").font = font_section

    pilot_headers = ["Pilot Parameter", "Formula / Derivation", "Annual Amount", "Unit / Metric", "Strategic Context"]
    for c_i, h in enumerate(pilot_headers, 1):
        c = ws_unit.cell(row=17, column=c_i, value=h)
        c.font = font_tbl_header
        c.fill = fill_charcoal
        c.alignment = align_left if c_i in [1, 2, 5] else align_right
        c.border = cell_border

    pilot_rows = [
        ("Total Campus Students", "Assumptions & Drivers C8", "='Assumptions & Drivers'!C8", "Students", "Sanjivani University Kopargaon", NUM_FORMAT),
        ("Active FoodLine Users (40%)", "Students * 40% Penetration", "=C18*'Assumptions & Drivers'!C9", "Active Users", "40% student penetration", NUM_FORMAT),
        ("Orders per Active User per Month", "Assumptions & Drivers C10", "='Assumptions & Drivers'!C10", "Orders/Mo", "Frequency during academic term", NUM_FORMAT),
        ("Monthly Campus Orders", "Active Users * Orders/Mo", "=C19*C20", "Orders/Mo", "Total orders processed monthly", NUM_FORMAT),
        ("Academic Operating Months", "Assumptions & Drivers C11", "='Assumptions & Drivers'!C11", "Months/Yr", "10 operating months per academic year", NUM_FORMAT),
        ("Total Annual Campus Orders", "Monthly Orders * Operating Months", "=C21*C22", "Orders/Yr", "50,000 to 60,000 orders/year", NUM_FORMAT),
        ("Average Order Value (AOV)", "Assumptions & Drivers C15", "='Assumptions & Drivers'!C15", "₹/Order", "Snack + Beverage combo", CURR_DEC_FORMAT),
        ("Annual Gross Merchandise Value (GMV)", "Annual Orders * AOV", "=C23*C24", "₹/Year", "Total food GMV transacted", CURR_FORMAT),
        ("Merchant Commission Revenue (12%)", "GMV * 12% Take-Rate", "=C25*'Assumptions & Drivers'!C16", "₹/Year", "12% FoodLine marketplace take-rate", CURR_FORMAT),
        ("Canteen KDS SaaS Subscription (3 Canteens)", "3 Canteens * ₹2,500 * 10 Months", "=3*'Assumptions & Drivers'!C17*C22", "₹/Year", "3 canteens @ ₹2,500/month", CURR_FORMAT),
        ("Total Pilot Revenue", "Commission Revenue + KDS SaaS Revenue", "=C26+C27", "₹/Year", "Gross annual revenue from pilot campus", CURR_FORMAT),
        ("Direct Variable COGS", "Annual Orders * Variable Cost/Order", "=C23*C12", "₹/Year", "Server, SMS, gateway, ops costs", CURR_FORMAT),
        ("Pilot Gross Profit", "Total Pilot Revenue + Direct COGS", "=C28+C29", "₹/Year", "Pilot gross margin ~75%", CURR_FORMAT),
        ("Campus Allocated Fixed OPEX", "Fixed Operations Allocation", "=180000", "₹/Year", "Field support, marketing, tablet maintenance", CURR_FORMAT),
        ("Pilot Net Operating Profit", "Pilot Gross Profit - Fixed OPEX", "=C30-C31", "₹/Year", "Net profit generated by single campus", CURR_FORMAT),
        ("Hardware Payback Period", "(3 KDS Tablets * ₹15,000) / Monthly Profit", "=(3*15000)/(C32/12)", "Months", "3 KDS tablets @ ₹15,000 recovered in 4.2 mos", "0.0 \"Months\""),
    ]

    for r_i, (lbl, formula_desc, val_formula, unit, ctx, fmt) in enumerate(pilot_rows, 18):
        c1 = ws_unit.cell(row=r_i, column=1, value=lbl)
        c1.font = font_bold if "Total" in lbl or "Profit" in lbl or "Payback" in lbl else font_regular
        c1.border = cell_border
        if "Profit" in lbl: c1.fill = fill_green_light
        elif "Payback" in lbl: c1.fill = fill_orange_light
        
        c2 = ws_unit.cell(row=r_i, column=2, value=formula_desc)
        c2.font = font_regular
        c2.border = cell_border
        c2.alignment = align_left
        
        c3 = ws_unit.cell(row=r_i, column=3, value=val_formula)
        c3.font = font_bold if "Total" in lbl or "Profit" in lbl or "Payback" in lbl else font_regular
        c3.border = cell_border
        c3.alignment = align_right
        c3.number_format = fmt if "Months" in str(fmt) else (CURR_FORMAT if "₹" in unit else (CURR_DEC_FORMAT if "₹/Order" in unit else NUM_FORMAT))
        if "Profit" in lbl: c3.fill = fill_green_light
        elif "Payback" in lbl: c3.fill = fill_orange_light
        
        c4 = ws_unit.cell(row=r_i, column=4, value=unit)
        c4.font = font_bold if "Total" in lbl or "Profit" in lbl else font_regular
        c4.border = cell_border
        c4.alignment = align_center
        
        c5 = ws_unit.cell(row=r_i, column=5, value=ctx)
        c5.font = font_muted
        c5.border = cell_border
        c5.alignment = align_left

    # ==============================================================================
    # TAB 4: INCOME STATEMENT (P&L 2027–2029)
    # ==============================================================================
    ws_pnl = wb.create_sheet(title="Income Statement (P&L)")
    ws_pnl.views.sheetView[0].showGridLines = True
    set_title_banner(ws_pnl, "FoodLine Campus — Projected Income Statement (P&L 2027–2029)", "Annual revenue, cost of goods sold, operating expenses, and net profit margins", max_col=6)

    pnl_headers = ["Financial Line Item", "Formula / Reference", "2027 (FY 26-27)", "2028 (FY 27-28)", "2029 (FY 28-29)", "Notes & Strategic Commentary"]
    for c_i, h in enumerate(pnl_headers, 1):
        c = ws_pnl.cell(row=4, column=c_i, value=h)
        c.font = font_tbl_header
        c.fill = fill_charcoal
        c.alignment = align_left if c_i in [1, 2, 6] else align_right
        c.border = cell_border

    pnl_structure = [
        (5, "Annual Order Volume", "Campuses * Students * Pen% * Orders/Mo * Months", "='Assumptions & Drivers'!C6*'Assumptions & Drivers'!C8*'Assumptions & Drivers'!C9*'Assumptions & Drivers'!C10*'Assumptions & Drivers'!C11", "='Assumptions & Drivers'!D6*'Assumptions & Drivers'!D8*'Assumptions & Drivers'!D9*'Assumptions & Drivers'!D10*'Assumptions & Drivers'!D11", "='Assumptions & Drivers'!E6*'Assumptions & Drivers'!E8*'Assumptions & Drivers'!E9*'Assumptions & Drivers'!E10*'Assumptions & Drivers'!E11", "Total digital food orders processed across all campuses", True, fill_light_gray, NUM_FORMAT),
        (6, "Gross Merchandise Value (GMV)", "Annual Orders * AOV", "=C5*'Assumptions & Drivers'!C15", "=D5*'Assumptions & Drivers'!D15", "=E5*'Assumptions & Drivers'!E15", "Total gross transaction value of food ordered", True, fill_light_gray, CURR_FORMAT),
        (7, "REVENUE STREAMS :", "", "", "", "", "", True, None, None),
        (8, "  • Canteen Commission Revenue (12% Take-Rate)", "GMV * Take Rate", "=C6*'Assumptions & Drivers'!C16", "=D6*'Assumptions & Drivers'!D16", "=E6*'Assumptions & Drivers'!E16", "Direct 12% take-rate on digital canteen sales", False, None, CURR_FORMAT),
        (9, "  • KDS SaaS Tablet Subscriptions", "Canteens * Monthly Fee * Months", "='Assumptions & Drivers'!C7*'Assumptions & Drivers'!C17*'Assumptions & Drivers'!C11", "='Assumptions & Drivers'!D7*'Assumptions & Drivers'!D17*'Assumptions & Drivers'!D11", "='Assumptions & Drivers'!E7*'Assumptions & Drivers'!E17*'Assumptions & Drivers'!E11", "₹2,500/month kitchen display terminal subscription", False, None, CURR_FORMAT),
        (10, "  • Student Convenience Fees", "Orders * Student Fee", "=C5*'Assumptions & Drivers'!C18", "=D5*'Assumptions & Drivers'!D18", "=E5*'Assumptions & Drivers'!E18", "Zero fee charged to students (100% Free student app)", False, None, CURR_FORMAT),
        (11, "  • Special Event / Fest Catering Fees", "Estimated Institutional Fees", "=150000", "=800000", "=3000000", "College festivals, sports fests & conference catering", False, None, CURR_FORMAT),
        (12, "TOTAL GROSS REVENUE", "=SUM(Revenue Streams)", "=SUM(C8:C11)", "=SUM(D8:D11)", "=SUM(E8:E11)", "Gross platform receipts (Excludes canteen food share)", True, fill_orange_light, CURR_FORMAT),
        (13, "Cost of Goods Sold (COGS - Variable Delivery)", "Orders * Variable Cost/Order", "=C5*'Assumptions & Drivers'!C26", "=D5*'Assumptions & Drivers'!D26", "=E5*'Assumptions & Drivers'!E26", "Cloud DB, SMS OTP, payment gateway & student ops", False, None, CURR_FORMAT),
        (14, "GROSS PROFIT", "Total Revenue - COGS", "=C12-C13", "=D12-D13", "=E12-E13", "High operating margin software model", True, fill_light_gray, CURR_FORMAT),
        (15, "Gross Profit Margin %", "Gross Profit / Total Revenue", "=C14/C12", "=D14/D12", "=E14/E12", "Gross margin expands with server optimization", True, fill_light_gray, PCT_FORMAT),
        (16, "OPERATING EXPENSES (OPEX) :", "", "", "", "", "", True, None, None),
        (17, "  • Cloud Hosting & Gateway APIs", "='Assumptions & Drivers'!C31", "='Assumptions & Drivers'!C31", "='Assumptions & Drivers'!D31", "='Assumptions & Drivers'!E31", "AWS infrastructure, Supabase, SMS & WhatsApp APIs", False, None, CURR_FORMAT),
        (18, "  • Operational & Field Salaries", "='Assumptions & Drivers'!C32", "='Assumptions & Drivers'!C32", "='Assumptions & Drivers'!D32", "='Assumptions & Drivers'!E32", "Core engineering, city heads & campus coordinators", False, None, CURR_FORMAT),
        (19, "  • Marketing & Campus Activation", "='Assumptions & Drivers'!C33", "='Assumptions & Drivers'!C33", "='Assumptions & Drivers'!D33", "='Assumptions & Drivers'!E33", "Table QR stands, orientation campaigns & student kits", False, None, CURR_FORMAT),
        (20, "  • Canteen Hardware Maintenance & Tech", "='Assumptions & Drivers'!C34", "='Assumptions & Drivers'!C34", "='Assumptions & Drivers'!D34", "='Assumptions & Drivers'!E34", "Tablet spares, thermal receipt rolls & replacement", False, None, CURR_FORMAT),
        (21, "  • Legal, Admin & Contingency", "='Assumptions & Drivers'!C35", "='Assumptions & Drivers'!C35", "='Assumptions & Drivers'!D35", "='Assumptions & Drivers'!E35", "Company secretarial, audit, licenses & legal", False, None, CURR_FORMAT),
        (22, "  • Hardware Depreciation", "='Assumptions & Drivers'!C36", "='Assumptions & Drivers'!C36", "='Assumptions & Drivers'!D36", "='Assumptions & Drivers'!E36", "Straight-line depreciation over 3-year tablet life", False, None, CURR_FORMAT),
        (23, "TOTAL OPERATING EXPENSES", "=SUM(OPEX Rows)", "=SUM(C17:C22)", "=SUM(D17:D22)", "=SUM(E17:E22)", "Total operating expenses including depreciation", True, fill_light_gray, CURR_FORMAT),
        (24, "OPERATING PROFIT (EBITDA)", "Gross Profit - (OPEX - Depr)", "=C14-(C23-C22)", "=D14-(D23-D22)", "=E14-(E23-E22)", "EBITDA positive from Year 2 onwards", True, fill_blue_light, CURR_FORMAT),
        (25, "NET PROFIT / (LOSS) BEFORE TAX", "Gross Profit - Total OPEX", "=C14-C23", "=D14-D23", "=E14-E23", "Year 1 pilot investment, high profitability Y2 & Y3", True, fill_green_light, CURR_FORMAT),
        (26, "Net Profit Margin %", "Net Profit / Total Revenue", "=C25/C12", "=D25/D12", "=E25/E12", "Reaches 26.4% to 30.4% net margin at scale", True, fill_green_light, PCT_FORMAT),
    ]

    for r_num, lbl, ref, y1, y2, y3, note, is_b, f_style, n_fmt in pnl_structure:
        c1 = ws_pnl.cell(row=r_num, column=1, value=lbl)
        c1.font = font_bold if is_b else font_regular
        c1.border = cell_border
        if f_style: c1.fill = f_style
        
        c2 = ws_pnl.cell(row=r_num, column=2, value=ref)
        c2.font = font_regular
        c2.border = cell_border
        c2.alignment = align_left
        
        for col_i, y_val in enumerate([y1, y2, y3], 3):
            c = ws_pnl.cell(row=r_num, column=col_i, value=y_val)
            c.font = font_bold if is_b else font_regular
            c.border = cell_border
            c.alignment = align_right
            if n_fmt: c.number_format = n_fmt
            if f_style: c.fill = f_style
            
        c6 = ws_pnl.cell(row=r_num, column=6, value=note)
        c6.font = font_muted
        c6.border = cell_border
        c6.alignment = align_left

    # ==============================================================================
    # TAB 5: CASH FLOW STATEMENT (2027–2029)
    # ==============================================================================
    ws_cf = wb.create_sheet(title="Cash Flow Statement")
    ws_cf.views.sheetView[0].showGridLines = True
    set_title_banner(ws_cf, "FoodLine Campus — Projected Cash Flow Statement (2027–2029)", "Annual cash inflows, capital expenditure, operational outflows, and liquidity reserves", max_col=6)

    cf_headers = ["Cash Flow Line Item", "Driver / Reference", "2027 (FY 26-27)", "2028 (FY 27-28)", "2029 (FY 28-29)", "Liquidity & Runway Notes"]
    for c_i, h in enumerate(cf_headers, 1):
        c = ws_cf.cell(row=4, column=c_i, value=h)
        c.font = font_tbl_header
        c.fill = fill_charcoal
        c.alignment = align_left if c_i in [1, 2, 6] else align_right
        c.border = cell_border

    cf_structure = [
        (5, "CASH INFLOWS :", "", "", "", "", "", True, None, None),
        (6, "  • Owner / Founder Investment", "='Assumptions & Drivers'!C41", "='Assumptions & Drivers'!C41", "='Assumptions & Drivers'!D41", "='Assumptions & Drivers'!E41", "Founding team bootstrap equity", False, None, CURR_FORMAT),
        (7, "  • Seed Capital / Incubation Grant Received", "='Assumptions & Drivers'!C42", "='Assumptions & Drivers'!C42", "='Assumptions & Drivers'!D42", "='Assumptions & Drivers'!E42", "SCILL incubation grant + Seed round", False, None, CURR_FORMAT),
        (8, "  • Operating Canteen Commission Revenue", "='Income Statement (P&L)'!C8", "='Income Statement (P&L)'!C8", "='Income Statement (P&L)'!D8", "='Income Statement (P&L)'!E8", "Cash received from 12% food commissions", False, None, CURR_FORMAT),
        (9, "  • KDS SaaS Subscriptions & Event Fees", "='Income Statement (P&L)'!C9+'Income Statement (P&L)'!C11", "='Income Statement (P&L)'!C9+'Income Statement (P&L)'!C11", "='Income Statement (P&L)'!D9+'Income Statement (P&L)'!D11", "='Income Statement (P&L)'!E9+'Income Statement (P&L)'!E11", "Hardware lease fees & campus event fees", False, None, CURR_FORMAT),
        (10, "TOTAL CASH INFLOWS", "=SUM(Inflow Rows)", "=SUM(C6:C9)", "=SUM(D6:D9)", "=SUM(E6:E9)", "Total gross liquid cash received", True, fill_green_light, CURR_FORMAT),
        (11, "CASH OUTFLOWS :", "", "", "", "", "", True, None, None),
        (12, "  • Platform Setup & AI Slot Engine Dev", "Slide 13 Budget", "=500000", "=1200000", "=3500000", "Core software development & slot throttling IP", False, None, CURR_FORMAT),
        (13, "  • KDS Tablet Hardware & Printers", "Hardware CapEx", "=600000", "=2200000", "=7500000", "Tablet procurement (45 -> 225 -> 1,000 units)", False, None, CURR_FORMAT),
        (14, "  • Staff & Operational Salaries", "='Assumptions & Drivers'!C32", "='Assumptions & Drivers'!C32", "='Assumptions & Drivers'!D32", "='Assumptions & Drivers'!E32", "Engineering, sales & campus operations teams", False, None, CURR_FORMAT),
        (15, "  • Marketing & Campus Activation", "='Assumptions & Drivers'!C33", "='Assumptions & Drivers'!C33", "='Assumptions & Drivers'!D33", "='Assumptions & Drivers'!E33", "Orientation blitz, QR stands & ambassador rewards", False, None, CURR_FORMAT),
        (16, "  • Cloud Hosting & WhatsApp Gateway APIs", "='Assumptions & Drivers'!C31", "='Assumptions & Drivers'!C31", "='Assumptions & Drivers'!D31", "='Assumptions & Drivers'!E31", "AWS server hosting, SMS OTP & WhatsApp APIs", False, None, CURR_FORMAT),
        (17, "  • Administrative, Legal & Travel", "='Assumptions & Drivers'!C35", "='Assumptions & Drivers'!C35", "='Assumptions & Drivers'!D35", "='Assumptions & Drivers'!E35", "Corporate secretarial, audit & field travel", False, None, CURR_FORMAT),
        (18, "TOTAL CASH OUTFLOWS", "=SUM(Outflow Rows)", "=SUM(C12:C17)", "=SUM(D12:D17)", "=SUM(E12:E17)", "Total operational and capital disbursements", True, fill_orange_light, CURR_FORMAT),
        (19, "NET CASH FLOW (INFLOWS - OUTFLOWS)", "Total Inflows - Total Outflows", "=C10-C18", "=D10-D18", "=E10-E18", "Consistently cash-positive across all 3 years", True, fill_green_light, CURR_FORMAT),
        (20, "Beginning Cash Balance", "Prior Year Ending Cash", "=0", "=C21", "=D21", "Opening liquid bank balance", False, None, CURR_FORMAT),
        (21, "ENDING CASH BALANCE (WAR CHEST)", "Beginning Cash + Net Cash Flow", "=C19+C20", "=D19+D20", "=E19+E20", "Liquid reserves held in company bank accounts", True, fill_blue_light, CURR_FORMAT),
    ]

    for r_num, lbl, ref, y1, y2, y3, note, is_b, f_style, n_fmt in cf_structure:
        c1 = ws_cf.cell(row=r_num, column=1, value=lbl)
        c1.font = font_bold if is_b else font_regular
        c1.border = cell_border
        if f_style: c1.fill = f_style
        
        c2 = ws_cf.cell(row=r_num, column=2, value=ref)
        c2.font = font_regular
        c2.border = cell_border
        c2.alignment = align_left
        
        for col_i, y_val in enumerate([y1, y2, y3], 3):
            c = ws_cf.cell(row=r_num, column=col_i, value=y_val)
            c.font = font_bold if is_b else font_regular
            c.border = cell_border
            c.alignment = align_right
            if n_fmt: c.number_format = n_fmt
            if f_style: c.fill = f_style
            
        c6 = ws_cf.cell(row=r_num, column=6, value=note)
        c6.font = font_muted
        c6.border = cell_border
        c6.alignment = align_left

    # ==============================================================================
    # TAB 6: BALANCE SHEET (2027–2029)
    # ==============================================================================
    ws_bs = wb.create_sheet(title="Balance Sheet")
    ws_bs.views.sheetView[0].showGridLines = True
    set_title_banner(ws_bs, "FoodLine Campus — Projected Balance Sheet (2027–2029)", "Asset backing, capital structure, retained earnings, and solvency verification", max_col=6)

    bs_headers = ["Balance Sheet Particulars", "Driver / Basis", "2027 (FY 26-27)", "2028 (FY 27-28)", "2029 (FY 28-29)", "Audit & Balance Notes"]
    for c_i, h in enumerate(bs_headers, 1):
        c = ws_bs.cell(row=4, column=c_i, value=h)
        c.font = font_tbl_header
        c.fill = fill_charcoal
        c.alignment = align_left if c_i in [1, 2, 6] else align_right
        c.border = cell_border

    bs_structure = [
        (5, "ASSETS :", "", "", "", "", "", True, None, None),
        (6, "  • Cash & Bank Balance", "='Cash Flow Statement'!C21", "='Cash Flow Statement'!C21", "='Cash Flow Statement'!D21", "='Cash Flow Statement'!E21", "Liquid treasury reserves (Linked to Cash Flow)", False, None, CURR_FORMAT),
        (7, "  • Equipment & KDS Tablets (Net Book Value)", "Gross Hardware less Depreciation", "=450000", "=1800000", "=6500000", "Touchscreen kitchen terminals & thermal printers", False, None, CURR_FORMAT),
        (8, "  • Inventory & Kiosk Spares", "Hardware & Counter Spares", "=110000", "=450000", "=1800000", "Replacement screens, chargers, cables & paper rolls", False, None, CURR_FORMAT),
        (9, "TOTAL ASSETS", "=SUM(Asset Rows)", "=SUM(C6:C8)", "=SUM(D6:D8)", "=SUM(E6:E8)", "Total corporate economic assets", True, fill_green_light, CURR_FORMAT),
        (10, "LIABILITIES & SHAREHOLDERS' EQUITY :", "", "", "", "", "", True, None, None),
        (11, "  • Owners' Equity (Founder Investment)", "Paid-Up Share Capital", "=2000000", "=2000000", "=2000000", "Founders equity commitment (Unchanged)", False, None, CURR_FORMAT),
        (12, "  • Retained Earnings / Reserves", "Cumulative Retained Profits", "='Income Statement (P&L)'!C25", "=C12+'Income Statement (P&L)'!D25", "=D12+'Income Statement (P&L)'!E25", "Accumulated operational surplus reinvested", False, None, CURR_FORMAT),
        (13, "  • Bank Loan / Angel Capital (Debt)", "Long-Term Borrowings", "=250000", "=1250000", "=3000000", "Low-interest institutional debt / incubator loan", False, None, CURR_FORMAT),
        (14, "TOTAL LIABILITIES & EQUITY", "=SUM(Liab & Equity Rows)", "=SUM(C11:C13)", "=SUM(D11:D13)", "=SUM(E11:E13)", "Total capital claims and net worth", True, fill_blue_light, CURR_FORMAT),
        (15, "BALANCE CHECK (ASSETS - LIABILITIES)", "=Total Assets - Total Liab & Equity", "=C9-C14", "=D9-D14", "=E9-E14", "Audit check: Must equal ₹0 (Perfect Balance)", True, fill_light_gray, CURR_FORMAT),
    ]

    for r_num, lbl, ref, y1, y2, y3, note, is_b, f_style, n_fmt in bs_structure:
        c1 = ws_bs.cell(row=r_num, column=1, value=lbl)
        c1.font = font_bold if is_b else font_regular
        c1.border = cell_border
        if f_style: c1.fill = f_style
        
        c2 = ws_bs.cell(row=r_num, column=2, value=ref)
        c2.font = font_regular
        c2.border = cell_border
        c2.alignment = align_left
        
        for col_i, y_val in enumerate([y1, y2, y3], 3):
            c = ws_bs.cell(row=r_num, column=col_i, value=y_val)
            c.font = font_bold if is_b else font_regular
            c.border = cell_border
            c.alignment = align_right
            if n_fmt: c.number_format = n_fmt
            if f_style: c.fill = f_style
            
        c6 = ws_bs.cell(row=r_num, column=6, value=note)
        c6.font = font_muted
        c6.border = cell_border
        c6.alignment = align_left

    # ==============================================================================
    # TAB 7: BREAK-EVEN & SENSITIVITY ANALYSIS
    # ==============================================================================
    ws_be = wb.create_sheet(title="Break-Even & Sensitivity")
    ws_be.views.sheetView[0].showGridLines = True
    set_title_banner(ws_be, "FoodLine Campus — Break-Even & Revenue Sensitivity Analysis", "Order threshold models, contribution margin testing, and AOV vs Take-Rate sensitivity matrix", max_col=7)

    ws_be.cell(row=4, column=1, value="1. BREAK-EVEN ORDER THRESHOLD ANALYSIS (PILOT CAMPUS)").font = font_section

    be_headers = ["Break-Even Parameter", "Formula / Derivation", "Value", "Unit", "Strategic Implication"]
    for c_i, h in enumerate(be_headers, 1):
        c = ws_be.cell(row=5, column=c_i, value=h)
        c.font = font_tbl_header
        c.fill = fill_charcoal
        c.alignment = align_left if c_i in [1, 2, 5] else align_right
        c.border = cell_border

    be_rows = [
        ("Average Order Value (AOV)", "Assumptions & Drivers C15", "='Assumptions & Drivers'!C15", "₹/Order", "Base average spend per transaction", CURR_DEC_FORMAT),
        ("Platform Take-Rate (12%)", "Assumptions & Drivers C16", "='Assumptions & Drivers'!C16", "%", "Revenue take-rate charged to merchant", PCT_FORMAT),
        ("Take-Rate Revenue per Order", "AOV * Take-Rate", "=C6*C7", "₹/Order", "Platform gross cut per order", CURR_DEC_FORMAT),
        ("Variable Cost per Order (COGS)", "Assumptions & Drivers C26", "='Assumptions & Drivers'!C26", "₹/Order", "Cloud, SMS, payment gateway & field ops", CURR_DEC_FORMAT),
        ("Net Contribution Margin per Order", "Take-Rate Revenue - Variable Cost", "=C8-C9", "₹/Order", "Net cash generated by each order", CURR_DEC_FORMAT),
        ("Contribution Margin Ratio", "Contribution Margin / Take-Rate Revenue", "=C10/C8", "%", "Contribution margin on Take-Rate revenue", PCT_FORMAT),
        ("Pilot Campus Annual Fixed Costs", "Unit Economics & Pilot C31", "='Unit Economics & Pilot'!C31", "₹/Year", "Fixed ops, marketing, hardware upkeep", CURR_FORMAT),
        ("Canteen SaaS Fee Offset (3 Canteens)", "Unit Economics & Pilot C27", "='Unit Economics & Pilot'!C27", "₹/Year", "Fixed SaaS subscription revenue", CURR_FORMAT),
        ("Net Fixed Costs to Cover via Orders", "Fixed Costs - SaaS Offset", "=C12-C13", "₹/Year", "Net overheads remaining after SaaS fees", CURR_FORMAT),
        ("Annual Break-Even Order Volume", "Net Fixed Costs / Contribution Margin", "=C14/C10", "Orders/Year", "Total orders needed to reach ₹0 net profit", NUM_FORMAT),
        ("Monthly Break-Even Orders (10 Mos)", "Annual Break-Even Orders / 10", "=C15/10", "Orders/Mo", "Monthly threshold across 3 canteens", NUM_FORMAT),
        ("Daily Break-Even Orders per Canteen", "Monthly Break-Even / (3 Canteens * 25 Days)", "=C16/(3*25)", "Orders/Day", "Assumes 25 operating days/mo, 3 canteens", NUM_FORMAT),
        ("Projected Pilot Monthly Orders", "Unit Economics & Pilot C21", "='Unit Economics & Pilot'!C21", "Orders/Mo", "Modeled pilot volume (5,000 orders/mo)", NUM_FORMAT),
        ("Safety Margin (Buffer above Break-Even)", "(Projected Orders - Break-Even Orders) / Projected", "=(C18-C16)/C18", "%", "Pilot volume is 3x to 5x above break-even!", PCT_FORMAT),
    ]

    for r_i, (lbl, formula_desc, val_formula, unit, ctx, fmt) in enumerate(be_rows, 6):
        c1 = ws_be.cell(row=r_i, column=1, value=lbl)
        c1.font = font_bold if "Break-Even" in lbl or "Safety" in lbl or "Contribution" in lbl else font_regular
        c1.border = cell_border
        if "Safety" in lbl: c1.fill = fill_green_light
        elif "Break-Even" in lbl: c1.fill = fill_orange_light
        
        c2 = ws_be.cell(row=r_i, column=2, value=formula_desc)
        c2.font = font_regular
        c2.border = cell_border
        c2.alignment = align_left
        
        c3 = ws_be.cell(row=r_i, column=3, value=val_formula)
        c3.font = font_bold if "Break-Even" in lbl or "Safety" in lbl else font_regular
        c3.border = cell_border
        c3.alignment = align_right
        c3.number_format = fmt
        if "Safety" in lbl: c3.fill = fill_green_light
        elif "Break-Even" in lbl: c3.fill = fill_orange_light
        
        c4 = ws_be.cell(row=r_i, column=4, value=unit)
        c4.font = font_bold if "Break-Even" in lbl else font_regular
        c4.border = cell_border
        c4.alignment = align_center
        
        c5 = ws_be.cell(row=r_i, column=5, value=ctx)
        c5.font = font_muted
        c5.border = cell_border
        c5.alignment = align_left

    # Section 2: Sensitivity Matrix (AOV vs Take-Rate)
    ws_be.cell(row=22, column=1, value="2. SENSITIVITY MATRIX: ANNUAL REVENUE PER CAMPUS (AOV vs TAKE-RATE)").font = font_section

    sens_take_rates = [0.08, 0.10, 0.12, 0.14, 0.16]
    sens_aovs = [50, 60, 65, 70, 80, 90]

    c_top = ws_be.cell(row=23, column=1, value="AOV \\ Take-Rate")
    c_top.font = font_tbl_header
    c_top.fill = fill_charcoal
    c_top.border = cell_border
    c_top.alignment = align_center

    for c_i, tr in enumerate(sens_take_rates, 2):
        c = ws_be.cell(row=23, column=c_i, value=tr)
        c.font = font_tbl_header
        c.fill = fill_charcoal
        c.border = cell_border
        c.alignment = align_right
        c.number_format = PCT_FORMAT

    for r_i, aov in enumerate(sens_aovs, 24):
        c_aov = ws_be.cell(row=r_i, column=1, value=aov)
        c_aov.font = font_bold
        c_aov.fill = fill_light_gray
        c_aov.border = cell_border
        c_aov.alignment = align_right
        c_aov.number_format = CURR_FORMAT
        
        for c_i, tr in enumerate(sens_take_rates, 2):
            tr_col_letter = get_column_letter(c_i)
            f_sens = f"=50000*A{r_i}*{tr_col_letter}23+(3*2500*10)"
            c = ws_be.cell(row=r_i, column=c_i, value=f_sens)
            c.font = font_bold if (aov == 65 and tr == 0.12) else font_regular
            c.border = cell_border
            c.alignment = align_right
            c.number_format = CURR_FORMAT
            if aov == 65 and tr == 0.12:
                c.fill = fill_orange_light

    ws_be.cell(row=31, column=1, value="* Highlighted cell represents baseline pilot assumptions: ₹65 AOV and 12% Take-Rate generating ₹4,65,000/yr per campus.").font = font_muted

    # Auto-fit column widths
    for sheet in wb.worksheets:
        for col in sheet.columns:
            max_len = 0
            col_letter = get_column_letter(col[0].column)
            for cell in col:
                if cell.row in [1, 2]: continue
                val_str = str(cell.value or "")
                if len(val_str) > max_len:
                    max_len = len(val_str)
            sheet.column_dimensions[col_letter].width = max(max_len + 4, 14)

    # Specific custom column widths
    ws_dash.column_dimensions["A"].width = 4
    ws_dash.column_dimensions["B"].width = 34
    ws_dash.column_dimensions["C"].width = 22
    ws_dash.column_dimensions["D"].width = 22
    ws_dash.column_dimensions["E"].width = 22
    ws_dash.column_dimensions["F"].width = 22
    ws_dash.column_dimensions["G"].width = 22

    ws_assump.column_dimensions["A"].width = 42
    ws_assump.column_dimensions["B"].width = 20
    ws_assump.column_dimensions["C"].width = 20
    ws_assump.column_dimensions["D"].width = 20
    ws_assump.column_dimensions["E"].width = 20
    ws_assump.column_dimensions["F"].width = 52

    ws_unit.column_dimensions["A"].width = 44
    ws_unit.column_dimensions["B"].width = 34
    ws_unit.column_dimensions["C"].width = 22
    ws_unit.column_dimensions["D"].width = 18
    ws_unit.column_dimensions["E"].width = 46

    ws_pnl.column_dimensions["A"].width = 46
    ws_pnl.column_dimensions["B"].width = 38
    ws_pnl.column_dimensions["C"].width = 22
    ws_pnl.column_dimensions["D"].width = 22
    ws_pnl.column_dimensions["E"].width = 22
    ws_pnl.column_dimensions["F"].width = 54

    ws_cf.column_dimensions["A"].width = 46
    ws_cf.column_dimensions["B"].width = 38
    ws_cf.column_dimensions["C"].width = 22
    ws_cf.column_dimensions["D"].width = 22
    ws_cf.column_dimensions["E"].width = 22
    ws_cf.column_dimensions["F"].width = 54

    ws_bs.column_dimensions["A"].width = 46
    ws_bs.column_dimensions["B"].width = 38
    ws_bs.column_dimensions["C"].width = 22
    ws_bs.column_dimensions["D"].width = 22
    ws_bs.column_dimensions["E"].width = 22
    ws_bs.column_dimensions["F"].width = 54

    ws_be.column_dimensions["A"].width = 44
    ws_be.column_dimensions["B"].width = 34
    ws_be.column_dimensions["C"].width = 20
    ws_be.column_dimensions["D"].width = 16
    ws_be.column_dimensions["E"].width = 46

    # Freeze panes
    for sheet in wb.worksheets:
        sheet.freeze_panes = "A5"

    output_paths = [
        r"C:\Users\shiva\Pictures\ppt\FoodLine_Financial_Model_2027_2029.xlsx",
        r"C:\Users\shiva\Pictures\FoodLine_Financial_Model_2027_2029.xlsx",
        r"D:\Shivam Project\StartUp Project\FoodLine Campus\FoodLine_Financial_Model_2027_2029.xlsx",
    ]

    for p in output_paths:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        wb.save(p)
        print(f"Saved: {p} ({os.path.getsize(p)} bytes)")

if __name__ == "__main__":
    build_model()
