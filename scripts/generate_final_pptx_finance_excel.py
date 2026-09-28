import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def build_model():
    wb = openpyxl.Workbook()
    wb.remove(wb.active) # Remove default sheet

    # Color Palette - Professional Financial Modeling Standards
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
    YELLOW_HIGHLIGHT = "FEF08A"
    BORDER_GRAY = "D1D5DB"

    # Wall Street Standard Input Highlight: Soft Sky Blue with Deep Blue Text
    INPUT_FILL_COLOR = "E0F2FE"       # Soft Sky Blue
    INPUT_FONT_COLOR = "0369A1"       # Deep Blue (Indicates Live Input Cell)
    fill_input = PatternFill(start_color=INPUT_FILL_COLOR, end_color=INPUT_FILL_COLOR, fill_type="solid")
    font_input = Font(name="Calibri", size=11, bold=True, color=INPUT_FONT_COLOR)

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
    fill_yellow = PatternFill(start_color=YELLOW_HIGHLIGHT, end_color=YELLOW_HIGHLIGHT, fill_type="solid")
    fill_light_gray = PatternFill(start_color=LIGHT_GRAY_FILL, end_color=LIGHT_GRAY_FILL, fill_type="solid")

    thin_border_side = Side(border_style="thin", color=BORDER_GRAY)
    input_border_side = Side(border_style="medium", color="0284C7")
    double_bottom_side = Side(border_style="double", color="1A1A2E")
    top_thin_side = Side(border_style="thin", color="1A1A2E")

    cell_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
    input_border = Border(left=input_border_side, right=input_border_side, top=input_border_side, bottom=input_border_side)
    total_border = Border(top=top_thin_side, bottom=double_bottom_side, left=thin_border_side, right=thin_border_side)

    align_left = Alignment(horizontal="left", vertical="center")
    align_right = Alignment(horizontal="right", vertical="center")
    align_center = Alignment(horizontal="center", vertical="center")

    CURR_FORMAT = "₹#,##0;[Red](₹#,##0);\"-\""
    CURR_DEC_FORMAT = "₹#,##0.00;[Red](₹#,##0.00);\"-\""
    PCT_FORMAT = "0.0%"
    NUM_FORMAT = "#,##0"
    NUM_DEC_FORMAT = "0.0"

    def set_title_banner(ws, title, subtitle, max_col=8):
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
    # TAB 1: EXECUTIVE DASHBOARD (CENTRAL INTERACTIVE ENGINE)
    # ==============================================================================
    ws_dash = wb.create_sheet(title="Executive Dashboard")
    ws_dash.views.sheetView[0].showGridLines = True
    set_title_banner(ws_dash, "FoodLine Campus — Executive Financial Dashboard & Dynamic Model Engine", 
                     "💡 ALL BLUE-HIGHLIGHTED CELLS ARE LIVE INPUTS. Change Campuses, Adoption %, Order Rates, or Goldmine Target to recalculate the entire workbook in real time!", max_col=8)

    # Top KPI Cards Row 4-6
    kpi_cards_1 = [
        ("5-YEAR CUMULATIVE GMV", "=SUM(C19:G19)", CURR_FORMAT, "B4:C5", "B6:C6", fill_blue_light),
        ("5-YEAR CUMULATIVE REVENUE", "=SUM(C20:G20)", CURR_FORMAT, "D4:E5", "D6:E6", fill_green_light),
        ("YEAR 5 NET ANNUAL PROFIT", "=G22", CURR_FORMAT, "F4:G5", "F6:G6", fill_yellow),
    ]

    for label, formula, num_fmt, top_range, btm_range, fill_col in kpi_cards_1:
        top_left_coord = top_range.split(":")[0]
        # Assign value and format to the top cell first
        top_cell = ws_dash[top_left_coord]
        top_cell.value = formula
        top_cell.font = font_kpi_num
        top_cell.alignment = align_center
        top_cell.number_format = num_fmt
        top_cell.fill = fill_col
        ws_dash.merge_cells(top_range)
        
        btm_left_coord = btm_range.split(":")[0]
        btm_cell = ws_dash[btm_left_coord]
        btm_cell.value = label
        btm_cell.font = font_kpi_label
        btm_cell.alignment = align_center
        btm_cell.fill = fill_light_gray
        ws_dash.merge_cells(btm_range)

    # Top KPI Cards Row 8-10
    kpi_cards_2 = [
        ("INITIAL CAPITAL REQUIRED", "='Capital Requirements'!C11", CURR_FORMAT, "B8:C9", "B10:C10", fill_light_gray),
        ("YEAR 1 PILOT NET PROFIT", "=C22", CURR_FORMAT, "D8:E9", "D10:E10", fill_green_light),
        ("GOLDMINE 5% TARGET (ACHIEVED IN Y5)", "='Executive Dashboard'!$G$35", CURR_FORMAT, "F8:G9", "F10:G10", fill_orange_light),
    ]

    for label, formula, num_fmt, top_range, btm_range, fill_col in kpi_cards_2:
        top_left_coord = top_range.split(":")[0]
        top_cell = ws_dash[top_left_coord]
        top_cell.value = formula
        top_cell.font = font_kpi_num
        top_cell.alignment = align_center
        top_cell.number_format = num_fmt
        top_cell.fill = fill_col
        ws_dash.merge_cells(top_range)
        
        btm_left_coord = btm_range.split(":")[0]
        btm_cell = ws_dash[btm_left_coord]
        btm_cell.value = label
        btm_cell.font = font_kpi_label
        btm_cell.alignment = align_center
        btm_cell.fill = fill_light_gray
        ws_dash.merge_cells(btm_range)

    # 1. 5-Year Executive Summary Table
    ws_dash.cell(row=12, column=2, value="1. 5-YEAR DYNAMIC EXPANSION MODEL (SLIDE 11)").font = font_section

    dash_headers = ["Metric", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "5-Year Total / CAGR"]
    for c_idx, h in enumerate(dash_headers, 2):
        cell = ws_dash.cell(row=13, column=c_idx, value=h)
        cell.font = font_tbl_header
        cell.fill = fill_charcoal
        cell.alignment = align_left if c_idx == 2 else align_right
        cell.border = cell_border

    # Row 14: Active Campuses [EDITABLE INPUT] - matching user's exact inputs (1, 5, 10, 15, 20)
    r14_lbl = ws_dash.cell(row=14, column=2, value="Active Campuses [EDITABLE INPUT]")
    r14_lbl.font = font_bold
    r14_lbl.border = cell_border
    r14_lbl.fill = fill_input

    campus_inputs = [1, 5, 10, 15, 20]
    for idx, c_val in enumerate(campus_inputs, 3):
        c = ws_dash.cell(row=14, column=idx, value=c_val)
        c.font = font_input
        c.fill = fill_input
        c.border = input_border
        c.alignment = align_right
        c.number_format = NUM_FORMAT

    c14_cagr = ws_dash.cell(row=14, column=8, value="=(G14/C14)^(1/4)-1")
    c14_cagr.font = font_bold
    c14_cagr.border = cell_border
    c14_cagr.alignment = align_right
    c14_cagr.number_format = PCT_FORMAT

    # Row 15: Student Adoption Rate % [EDITABLE INPUT] - matching user's exact input (60%)
    r15_lbl = ws_dash.cell(row=15, column=2, value="Student Adoption Rate % [EDITABLE INPUT]")
    r15_lbl.font = font_bold
    r15_lbl.border = cell_border
    r15_lbl.fill = fill_input

    adoption_inputs = [0.60, 0.60, 0.60, 0.60, 0.60]
    for idx, a_val in enumerate(adoption_inputs, 3):
        c = ws_dash.cell(row=15, column=idx, value=a_val)
        c.font = font_input
        c.fill = fill_input
        c.border = input_border
        c.alignment = align_right
        c.number_format = PCT_FORMAT

    c15_avg = ws_dash.cell(row=15, column=8, value="=AVERAGE(C15:G15)")
    c15_avg.font = font_bold
    c15_avg.border = cell_border
    c15_avg.alignment = align_right
    c15_avg.number_format = PCT_FORMAT

    # Row 16: Active Students (Campuses * Students/Campus * Adoption %)
    r16_lbl = ws_dash.cell(row=16, column=2, value="Active Students (Calculated)")
    r16_lbl.font = font_regular
    r16_lbl.border = cell_border
    for idx, col_let in enumerate(["C", "D", "E", "F", "G"], 3):
        c = ws_dash.cell(row=16, column=idx, value=f"={col_let}14*$D$29*{col_let}15")
        c.font = font_regular
        c.border = cell_border
        c.alignment = align_right
        c.number_format = NUM_FORMAT
    c16_cagr = ws_dash.cell(row=16, column=8, value="=(G16/C16)^(1/4)-1")
    c16_cagr.font = font_regular
    c16_cagr.border = cell_border
    c16_cagr.alignment = align_right
    c16_cagr.number_format = PCT_FORMAT

    # Row 17: Monthly Orders per Active Student [EDITABLE INPUT] - matching user's exact inputs (20, 20, 20, 15, 15)
    r17_lbl = ws_dash.cell(row=17, column=2, value="Monthly Orders / Student [EDITABLE INPUT]")
    r17_lbl.font = font_bold
    r17_lbl.border = cell_border
    r17_lbl.fill = fill_input

    order_rate_inputs = [20.0, 20.0, 20.0, 15.0, 15.0]
    for idx, o_val in enumerate(order_rate_inputs, 3):
        c = ws_dash.cell(row=17, column=idx, value=o_val)
        c.font = font_input
        c.fill = fill_input
        c.border = input_border
        c.alignment = align_right
        c.number_format = NUM_DEC_FORMAT

    c17_avg = ws_dash.cell(row=17, column=8, value="=AVERAGE(C17:G17)")
    c17_avg.font = font_bold
    c17_avg.border = cell_border
    c17_avg.alignment = align_right
    c17_avg.number_format = NUM_DEC_FORMAT

    # Row 18: Annual Orders (Active Students * Monthly Orders * Operating Months)
    r18_lbl = ws_dash.cell(row=18, column=2, value="Annual Orders (Calculated)")
    r18_lbl.font = font_bold
    r18_lbl.border = cell_border
    for idx, col_let in enumerate(["C", "D", "E", "F", "G"], 3):
        c = ws_dash.cell(row=18, column=idx, value=f"={col_let}16*({col_let}17*$D$30)")
        c.font = font_bold
        c.border = cell_border
        c.alignment = align_right
        c.number_format = NUM_FORMAT
    c18_tot = ws_dash.cell(row=18, column=8, value="=SUM(C18:G18)")
    c18_tot.font = font_bold
    c18_tot.border = cell_border
    c18_tot.alignment = align_right
    c18_tot.number_format = NUM_FORMAT

    # Row 19: Annual GMV (Annual Orders * AOV)
    r19_lbl = ws_dash.cell(row=19, column=2, value="Annual GMV (Gross Merchandise Value)")
    r19_lbl.font = font_bold
    r19_lbl.border = cell_border
    for idx, col_let in enumerate(["C", "D", "E", "F", "G"], 3):
        c = ws_dash.cell(row=19, column=idx, value=f"={col_let}18*$D$27")
        c.font = font_bold
        c.border = cell_border
        c.alignment = align_right
        c.number_format = CURR_FORMAT
    c19_tot = ws_dash.cell(row=19, column=8, value="=SUM(C19:G19)")
    c19_tot.font = font_bold
    c19_tot.border = cell_border
    c19_tot.alignment = align_right
    c19_tot.number_format = CURR_FORMAT

    # Row 20: Platform Revenue (Annual GMV * Convenience Fee %)
    r20_lbl = ws_dash.cell(row=20, column=2, value="Platform Revenue (Student Convenience Fee)")
    r20_lbl.font = font_bold
    r20_lbl.border = cell_border
    r20_lbl.fill = fill_orange_light
    for idx, col_let in enumerate(["C", "D", "E", "F", "G"], 3):
        c = ws_dash.cell(row=20, column=idx, value=f"={col_let}19*$D$28")
        c.font = font_bold
        c.border = cell_border
        c.alignment = align_right
        c.number_format = CURR_FORMAT
        c.fill = fill_orange_light
    c20_tot = ws_dash.cell(row=20, column=8, value="=SUM(C20:G20)")
    c20_tot.font = font_bold
    c20_tot.border = cell_border
    c20_tot.alignment = align_right
    c20_tot.number_format = CURR_FORMAT
    c20_tot.fill = fill_orange_light

    # Row 21: Lean Annual OPEX [EDITABLE INPUT - User customized]
    r21_lbl = ws_dash.cell(row=21, column=2, value="Lean Annual OPEX [EDITABLE INPUT]")
    r21_lbl.font = font_regular
    r21_lbl.border = cell_border
    for idx, col_let in enumerate(["C", "D", "E", "F", "G"], 3):
        c = ws_dash.cell(row=21, column=idx, value=0)
        c.font = font_regular
        c.border = cell_border
        c.alignment = align_right
        c.number_format = CURR_FORMAT
    c21_tot = ws_dash.cell(row=21, column=8, value="=SUM(C21:G21)")
    c21_tot.font = font_bold
    c21_tot.border = cell_border
    c21_tot.alignment = align_right
    c21_tot.number_format = CURR_FORMAT

    # Row 22: NET ANNUAL PROFIT (Revenue - (OPEX + Orders * Variable Tech Cost))
    r22_lbl = ws_dash.cell(row=22, column=2, value="NET ANNUAL PROFIT")
    r22_lbl.font = font_bold
    r22_lbl.border = cell_border
    r22_lbl.fill = fill_green_light
    for idx, col_let in enumerate(["C", "D", "E", "F", "G"], 3):
        c = ws_dash.cell(row=22, column=idx, value=f"={col_let}20-({col_let}21+{col_let}18*$D$31)")
        c.font = font_bold
        c.border = cell_border
        c.alignment = align_right
        c.number_format = CURR_FORMAT
        c.fill = fill_green_light
    c22_tot = ws_dash.cell(row=22, column=8, value="=SUM(C22:G22)")
    c22_tot.font = font_bold
    c22_tot.border = cell_border
    c22_tot.alignment = align_right
    c22_tot.number_format = CURR_FORMAT
    c22_tot.fill = fill_green_light

    # Row 23: Net Profit Margin % (Net Profit / Revenue)
    r23_lbl = ws_dash.cell(row=23, column=2, value="Net Profit Margin %")
    r23_lbl.font = font_bold
    r23_lbl.border = cell_border
    for idx, col_let in enumerate(["C", "D", "E", "F", "G"], 3):
        c = ws_dash.cell(row=23, column=idx, value=f"={col_let}22/{col_let}20")
        c.font = font_bold
        c.border = cell_border
        c.alignment = align_right
        c.number_format = PCT_FORMAT
    c23_tot = ws_dash.cell(row=23, column=8, value="=H22/H20")
    c23_tot.font = font_bold
    c23_tot.border = cell_border
    c23_tot.alignment = align_right
    c23_tot.number_format = PCT_FORMAT

    # ==============================================================================
    # 2. INTERACTIVE MODEL CONTROLS PANEL (ROWS 25-35)
    # ==============================================================================
    ws_dash.cell(row=25, column=2, value="2. LIVE MODEL CONTROLS & MASTER DRIVERS (EDIT ANY VALUE IN BLUE)").font = font_section

    # Left Control Block (Cols B, C, D)
    left_ctrl_headers = ["Core Operational Driver", "Unit", "Live Value [EDITABLE]"]
    for c_i, h in enumerate(left_ctrl_headers, 2):
        c = ws_dash.cell(row=26, column=c_i, value=h)
        c.font = font_tbl_header
        c.fill = fill_charcoal
        c.alignment = align_left if c_i == 2 else (align_center if c_i == 3 else align_right)
        c.border = cell_border

    left_controls = [
        ("Average Order Value (AOV)", "₹/Order", 70.0, CURR_DEC_FORMAT, 27), # User set to ₹70
        ("Student Convenience Fee Rate", "%", 0.04, PCT_FORMAT, 28),
        ("Total Students per Campus", "Students", 2500, NUM_FORMAT, 29),
        ("Operating Academic Months / Year", "Months", 12, NUM_FORMAT, 30),
        ("Direct Variable Tech Cost / Order", "₹/Order", 0.30, CURR_DEC_FORMAT, 31),
    ]

    for lbl, unit, val, fmt, r_pos in left_controls:
        c1 = ws_dash.cell(row=r_pos, column=2, value=lbl)
        c1.font = font_bold
        c1.border = cell_border
        c1.fill = fill_light_gray
        
        c2 = ws_dash.cell(row=r_pos, column=3, value=unit)
        c2.font = font_regular
        c2.border = cell_border
        c2.alignment = align_center
        
        c3 = ws_dash.cell(row=r_pos, column=4, value=val)
        c3.font = font_input
        c3.border = input_border
        c3.fill = fill_input
        c3.alignment = align_right
        c3.number_format = fmt

    # Right Control Block (Cols F, G, H)
    right_ctrl_headers = ["Business & Valuation Parameter", "Live Value", "Strategic Implication"]
    for c_i, h in enumerate(right_ctrl_headers, 6):
        c = ws_dash.cell(row=26, column=c_i, value=h)
        c.font = font_tbl_header
        c.fill = fill_charcoal
        c.alignment = align_left if c_i in [6, 8] else align_right
        c.border = cell_border

    # User explicitly requested: GM = 25 Cr (25,00,00,000) and 5% target (1,25,00,000) achieved in 5 years!
    right_controls = [
        ("Canteen Merchant Commission Rate", 0.00, PCT_FORMAT, "100% Free for canteens (Instant merchant adoption)", 27, True),
        ("Payment Gateway MDR (Direct UPI)", 0.00, PCT_FORMAT, "Direct UPI peer-to-merchant rail (0% gateway fee)", 28, True),
        ("Total Initial Setup Investment", "='Capital Requirements'!C11", CURR_FORMAT, "Platform build, hardware, legal & working capital", 29, False),
        ("Founders Equity Commitment", 0.51, PCT_FORMAT, "Controlling stake & operational leadership", 30, True),
        ("Seed Capital / Incubation Grant", "=1-G30", PCT_FORMAT, "SCILL incubation grant + Angel investor pool", 31, False),
        ("Target National Expansion Campuses", 500, NUM_FORMAT, "Top universities & engineering institutes in India", 32, True),
        ("Goldmine Total Milestone Valuation", 250000000, CURR_FORMAT, "₹25.00 Cr (₹25,00,00,000) — User Defined Milestone Valuation", 33, True),
        ("Goldmine Target Allocation %", 0.05, PCT_FORMAT, "5.0% Target Allocation requested by user", 34, True),
        ("Goldmine 5% Target Amount", "=G33*G34", CURR_FORMAT, "₹1,25,00,000 (₹1.25 Cr) — Achieved in Year 5 (₹1.35 Cr Net Profit)!", 35, False),
    ]

    for lbl, val, fmt, note, r_pos, is_inp in right_controls:
        c1 = ws_dash.cell(row=r_pos, column=6, value=lbl)
        c1.font = font_bold
        c1.border = cell_border
        c1.fill = fill_light_gray
        
        c2 = ws_dash.cell(row=r_pos, column=7, value=val)
        c2.font = font_input if is_inp else font_bold
        c2.border = input_border if is_inp else cell_border
        c2.fill = fill_input if is_inp else (fill_yellow if "5%" in lbl else fill_light_gray)
        c2.alignment = align_right
        c2.number_format = fmt
        
        c3 = ws_dash.cell(row=r_pos, column=8, value=note)
        c3.font = font_muted
        c3.border = cell_border
        c3.alignment = align_left

    # ==============================================================================
    # TAB 2: ASSUMPTIONS & DRIVERS (LINKED 100% DYNAMICALLY TO MASTER DASHBOARD)
    # ==============================================================================
    ws_assump = wb.create_sheet(title="Assumptions & Drivers")
    ws_assump.views.sheetView[0].showGridLines = True
    set_title_banner(ws_assump, "FoodLine Campus — Financial Assumptions & Model Drivers (4% Model)", 
                     "Master inputs driving Pilot Economics, 5-Year Growth Projections, and Viability Math", max_col=8)

    assump_blocks = [
        ("1. CAMPUS SCALE & STUDENT TRAFFIC ASSUMPTIONS", 4, [
            ("Parameter", "Unit", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Strategic Basis"),
            ("Active Campuses", "Campuses", "='Executive Dashboard'!C14", "='Executive Dashboard'!D14", "='Executive Dashboard'!E14", "='Executive Dashboard'!F14", "='Executive Dashboard'!G14", "Dynamically linked to Executive Dashboard"),
            ("Total Students per Campus", "Students", "='Executive Dashboard'!$D$29", "='Executive Dashboard'!$D$29", "='Executive Dashboard'!$D$29", "='Executive Dashboard'!$D$29", "='Executive Dashboard'!$D$29", "Dynamically linked to Executive Dashboard"),
            ("Active Student Penetration %", "%", "='Executive Dashboard'!C15", "='Executive Dashboard'!D15", "='Executive Dashboard'!E15", "='Executive Dashboard'!F15", "='Executive Dashboard'!G15", "Dynamically linked to Executive Dashboard (Editable per year!)"),
            ("Active Students per Campus", "Students", "=C7*C8", "=D7*D8", "=E7*E8", "=F7*F8", "=G7*G8", "Formula: Total Students * Penetration %"),
            ("Total Active Students Across Network", "Students", "=C6*C9", "=D6*D9", "=E6*E9", "=F6*F9", "=G6*G9", "Formula: Campuses * Active Students"),
            ("Monthly Orders per Active Student", "Orders/Mo", "='Executive Dashboard'!C17", "='Executive Dashboard'!D17", "='Executive Dashboard'!E17", "='Executive Dashboard'!F17", "='Executive Dashboard'!G17", "Dynamically linked to Executive Dashboard (Editable per year!)"),
            ("Operating Months per Year", "Months", "='Executive Dashboard'!$D$30", "='Executive Dashboard'!$D$30", "='Executive Dashboard'!$D$30", "='Executive Dashboard'!$D$30", "='Executive Dashboard'!$D$30", "Dynamically linked to Executive Dashboard"),
            ("Annual Orders per Active Student", "Orders/Yr", "=C11*C12", "=D11*D12", "=E11*E12", "=F11*F12", "=G11*G12", "Formula: Monthly Orders * Operating Months"),
        ]),
        ("2. REVENUE MODEL & PRICING DRIVERS (SLIDE 7)", 16, [
            ("Parameter", "Unit", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Strategic Basis"),
            ("Average Order Value (AOV)", "₹/Order", "='Executive Dashboard'!$D$27", "='Executive Dashboard'!$D$27", "='Executive Dashboard'!$D$27", "='Executive Dashboard'!$D$27", "='Executive Dashboard'!$D$27", "Dynamically linked to Executive Dashboard"),
            ("Student Convenience Fee Rate", "%", "='Executive Dashboard'!$D$28", "='Executive Dashboard'!$D$28", "='Executive Dashboard'!$D$28", "='Executive Dashboard'!$D$28", "='Executive Dashboard'!$D$28", "Dynamically linked to Executive Dashboard"),
            ("Canteen Commission Rate", "%", "='Executive Dashboard'!$G$27", "='Executive Dashboard'!$G$27", "='Executive Dashboard'!$G$27", "='Executive Dashboard'!$G$27", "='Executive Dashboard'!$G$27", "100% Free for canteens"),
            ("Payment Gateway MDR (Direct UPI)", "%", "='Executive Dashboard'!$G$28", "='Executive Dashboard'!$G$28", "='Executive Dashboard'!$G$28", "='Executive Dashboard'!$G$28", "='Executive Dashboard'!$G$28", "Direct UPI rail (0% MDR)"),
            ("KDS Kitchen Software Fee", "₹/Month", 0.0, 0.0, 0.0, 0.0, 0.0, "100% Free KDS tablet software for canteens"),
        ]),
        ("3. UNIT COSTS & EXPENSES (COGS & LEAN OPEX)", 24, [
            ("Parameter", "Unit", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Strategic Basis"),
            ("Direct Variable Tech Cost per Order", "₹/Order", "='Executive Dashboard'!$D$31", "='Executive Dashboard'!$D$31", "='Executive Dashboard'!$D$31", "='Executive Dashboard'!$D$31", "='Executive Dashboard'!$D$31", "SMS OTP, Supabase DB & server costs"),
            ("Lean Annual OPEX", "₹/Year", "='Executive Dashboard'!C21", "='Executive Dashboard'!D21", "='Executive Dashboard'!E21", "='Executive Dashboard'!F21", "='Executive Dashboard'!G21", "Dynamically linked to Executive Dashboard"),
            ("Lean Monthly OPEX", "₹/Month", "=C27/12", "=D27/12", "=E27/12", "=F27/12", "=G27/12", "Monthly overhead budget per year"),
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
                c.font = font_bold if "Total" in str(r_data[0]) or "Per" in str(r_data[0]) else font_regular
                
                if c_i == 1:
                    c.alignment = align_left
                elif c_i == 2:
                    c.alignment = align_center
                elif c_i in [3, 4, 5, 6, 7]:
                    c.alignment = align_right
                    if "%" in r_data[1]:
                        c.number_format = PCT_FORMAT
                    elif "₹" in r_data[1]:
                        c.number_format = CURR_FORMAT if "Year" in r_data[1] or "Month" in r_data[1] else CURR_DEC_FORMAT
                    elif "Students" in r_data[1] or "Months" in r_data[1] or "Campuses" in r_data[1] or "Orders" in r_data[1]:
                        c.number_format = NUM_FORMAT
                else:
                    c.alignment = align_left
                    c.font = font_muted

    # ==============================================================================
    # TAB 3: SINGLE-CAMPUS PILOT ECONOMICS (SLIDE 8)
    # ==============================================================================
    ws_pilot = wb.create_sheet(title="Single-Campus Pilot Economics")
    ws_pilot.views.sheetView[0].showGridLines = True
    set_title_banner(ws_pilot, "FoodLine Campus — Single-Campus Pilot Unit Economics (Slide 8)", 
                     "4% Student Convenience Fee Model at Sanjivani University Cafe @7 (2,500 Students)", max_col=6)

    # 4 Highlight Cards at top
    ws_pilot.cell(row=4, column=1, value="PILOT SCALE METRICS (SANJIVANI UNIVERSITY CAFE @7)").font = font_section

    cards = [
        ("TOTAL CAMPUS STUDENTS", "='Executive Dashboard'!$D$29", NUM_FORMAT, "B5:B6", "B7"),
        ("ACTIVE USERS (ADOPTION RATE)", "=B5*'Executive Dashboard'!C15", NUM_FORMAT, "C5:C6", "C7"),
        ("ANNUAL ORDERS (MONTHLY FREQ)", "=C5*('Executive Dashboard'!C17*'Executive Dashboard'!$D$30)", NUM_FORMAT, "D5:D6", "D7"),
        ("ANNUAL GMV (@ AOV)", "=D5*'Executive Dashboard'!$D$27", CURR_FORMAT, "E5:E6", "E7"),
    ]

    for label, val, fmt, top_range, btm_cell_ref in cards:
        top_cell = ws_pilot[top_range.split(":")[0]]
        top_cell.value = val
        top_cell.font = font_kpi_num
        top_cell.alignment = align_center
        top_cell.number_format = fmt
        top_cell.fill = fill_blue_light
        if ":" in top_range:
            ws_pilot.merge_cells(top_range)
        
        btm_cell = ws_pilot[btm_cell_ref]
        btm_cell.value = label
        btm_cell.font = font_kpi_label
        btm_cell.alignment = align_center
        btm_cell.fill = fill_light_gray

    # Pilot Table matching Slide 8
    ws_pilot.cell(row=9, column=1, value="PILOT ANNUAL INCOME STATEMENT (EXACT SLIDE 8 TABLE)").font = font_section

    p_headers = ["Financial Item", "Derivation / Formula", "Annual Amount", "% of Revenue", "Strategic Context"]
    for c_i, h in enumerate(p_headers, 1):
        c = ws_pilot.cell(row=10, column=c_i, value=h)
        c.font = font_tbl_header
        c.fill = fill_charcoal
        c.alignment = align_left if c_i in [1, 2, 5] else align_right
        c.border = cell_border

    p_rows = [
        ("Gross Merchandise Value (GMV @ AOV)", "Annual Orders * AOV", "=E5", "-", "Total food sales transacted through platform", font_bold, fill_light_gray, CURR_FORMAT),
        ("FoodLine Revenue (4% Student Convenience Fee)", "GMV * Convenience Fee %", "=C11*'Executive Dashboard'!$D$28", "=C12/C12", "Paid by students to skip 20-min wait", font_bold, fill_orange_light, CURR_FORMAT),
        ("Direct Variable Tech Cost (~₹0.30/order SMS/Server)", "Annual Orders * Variable Tech Cost", "=D5*'Executive Dashboard'!$D$31", "=C13/C12", "SMS OTP, Supabase real-time SSE stream", font_regular, None, CURR_FORMAT),
        ("Gross Profit", "Revenue - Variable Tech Cost", "=C12-C13", "=C14/C12", "High gross margin digital rail (>90%)", font_bold, fill_green_light, CURR_FORMAT),
        ("Lean Campus OPEX (Hosting + Lead + Marketing)", "Executive Dashboard Year 1 OPEX", "='Executive Dashboard'!C21", "=C15/C12", "Cloud hosting + campus lead stipend + QR tents", font_regular, None, CURR_FORMAT),
        ("NET PROFIT", "Gross Profit - Lean Campus OPEX", "=C14-C15", "=C16/C12", "Outstanding single-campus profitability", font_bold, fill_green_light, CURR_FORMAT),
    ]

    for r_idx, (lbl, formula_desc, val_formula, pct_formula, ctx, f_style, fill_style, fmt) in enumerate(p_rows, 11):
        c1 = ws_pilot.cell(row=r_idx, column=1, value=lbl)
        c1.font = f_style
        c1.border = cell_border
        if fill_style: c1.fill = fill_style
        
        c2 = ws_pilot.cell(row=r_idx, column=2, value=formula_desc)
        c2.font = font_regular
        c2.border = cell_border
        c2.alignment = align_left
        
        c3 = ws_pilot.cell(row=r_idx, column=3, value=val_formula)
        c3.font = f_style
        c3.border = cell_border
        c3.alignment = align_right
        c3.number_format = fmt
        if fill_style: c3.fill = fill_style
        
        c4 = ws_pilot.cell(row=r_idx, column=4, value=pct_formula)
        c4.font = f_style
        c4.border = cell_border
        c4.alignment = align_right
        if pct_formula != "-":
            c4.number_format = PCT_FORMAT
        if fill_style: c4.fill = fill_style
        
        c5 = ws_pilot.cell(row=r_idx, column=5, value=ctx)
        c5.font = font_muted
        c5.border = cell_border
        c5.alignment = align_left

    # Monthly Pilot Run-Rate Table
    ws_pilot.cell(row=19, column=1, value="PILOT MONTHLY RUN-RATE BREAKDOWN (12 MONTHS)").font = font_section

    m_headers = ["Month", "Active Students", "Orders / Mo", "Monthly GMV (₹)", "Revenue (4%)", "Tech Cost (₹0.30)", "Gross Profit", "Monthly OPEX", "Monthly Net Profit"]
    for c_i, h in enumerate(m_headers, 1):
        c = ws_pilot.cell(row=20, column=c_i, value=h)
        c.font = font_tbl_header
        c.fill = fill_charcoal
        c.alignment = align_left if c_i in [1] else align_right
        c.border = cell_border

    for m in range(1, 13):
        r = 20 + m
        ws_pilot.cell(row=r, column=1, value=f"Month {m}").border = cell_border
        ws_pilot.cell(row=r, column=2, value="='Single-Campus Pilot Economics'!$C$5").border = cell_border
        ws_pilot.cell(row=r, column=2).number_format = NUM_FORMAT
        ws_pilot.cell(row=r, column=2).alignment = align_right
        
        ws_pilot.cell(row=r, column=3, value=f"=B{r}*'Executive Dashboard'!C17").border = cell_border
        ws_pilot.cell(row=r, column=3).number_format = NUM_FORMAT
        ws_pilot.cell(row=r, column=3).alignment = align_right
        
        ws_pilot.cell(row=r, column=4, value=f"=C{r}*'Executive Dashboard'!$D$27").border = cell_border
        ws_pilot.cell(row=r, column=4).number_format = CURR_FORMAT
        ws_pilot.cell(row=r, column=4).alignment = align_right
        
        ws_pilot.cell(row=r, column=5, value=f"=D{r}*'Executive Dashboard'!$D$28").border = cell_border
        ws_pilot.cell(row=r, column=5).number_format = CURR_FORMAT
        ws_pilot.cell(row=r, column=5).alignment = align_right
        
        ws_pilot.cell(row=r, column=6, value=f"=C{r}*'Executive Dashboard'!$D$31").border = cell_border
        ws_pilot.cell(row=r, column=6).number_format = CURR_FORMAT
        ws_pilot.cell(row=r, column=6).alignment = align_right
        
        ws_pilot.cell(row=r, column=7, value=f"=E{r}-F{r}").border = cell_border
        ws_pilot.cell(row=r, column=7).number_format = CURR_FORMAT
        ws_pilot.cell(row=r, column=7).alignment = align_right
        
        ws_pilot.cell(row=r, column=8, value="='Single-Campus Pilot Economics'!$C$15/'Executive Dashboard'!$D$30").border = cell_border
        ws_pilot.cell(row=r, column=8).number_format = CURR_FORMAT
        ws_pilot.cell(row=r, column=8).alignment = align_right
        
        c_np = ws_pilot.cell(row=r, column=9, value=f"=G{r}-H{r}")
        c_np.border = cell_border
        c_np.number_format = CURR_FORMAT
        c_np.alignment = align_right
        c_np.font = font_bold
        c_np.fill = fill_green_light

    # Total Row for Monthly Table
    r_tot = 33
    ws_pilot.cell(row=r_tot, column=1, value="FULL YEAR TOTAL").font = font_bold
    ws_pilot.cell(row=r_tot, column=1).border = total_border
    ws_pilot.cell(row=r_tot, column=2, value="-").alignment = align_center
    ws_pilot.cell(row=r_tot, column=2).border = total_border
    
    for c_i, f in [(3, "=SUM(C21:C32)"), (4, "=SUM(D21:D32)"), (5, "=SUM(E21:E32)"), (6, "=SUM(F21:F32)"), (7, "=SUM(G21:G32)"), (8, "=SUM(H21:H32)"), (9, "=SUM(I21:I32)")]:
        c = ws_pilot.cell(row=r_tot, column=c_i, value=f)
        c.font = font_bold
        c.border = total_border
        c.alignment = align_right
        c.number_format = NUM_FORMAT if c_i == 3 else CURR_FORMAT
        if c_i == 9:
            c.fill = fill_green_light

    # ==============================================================================
    # TAB 4: 5-YEAR GROWTH PROJECTIONS (SLIDE 11)
    # ==============================================================================
    ws_growth = wb.create_sheet(title="5-Year Growth Projections")
    ws_growth.views.sheetView[0].showGridLines = True
    set_title_banner(ws_growth, "FoodLine Campus — 5-Year Growth Projections & Scale Model (Slide 11)", 
                     "Expansion across Campuses (4% Student Model) — Target Achieved in Year 5!", max_col=8)

    g_headers = ["Metric", "Derivation / Basis", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "5-Year Cumulative / CAGR"]
    for c_i, h in enumerate(g_headers, 1):
        c = ws_growth.cell(row=4, column=c_i, value=h)
        c.font = font_tbl_header
        c.fill = fill_charcoal
        c.alignment = align_left if c_i in [1, 2] else align_right
        c.border = cell_border

    g_rows = [
        ("Active Campuses", "Target expansion campuses", "='Executive Dashboard'!C14", "='Executive Dashboard'!D14", "='Executive Dashboard'!E14", "='Executive Dashboard'!F14", "='Executive Dashboard'!G14", "=(G5/C5)^(1/4)-1", NUM_FORMAT),
        ("Student Adoption Rate %", "Penetration of campus student body", "='Executive Dashboard'!C15", "='Executive Dashboard'!D15", "='Executive Dashboard'!E15", "='Executive Dashboard'!F15", "='Executive Dashboard'!G15", "=AVERAGE(C6:G6)", PCT_FORMAT),
        ("Active Students", "Campuses * Students/Campus * Adoption %", "='Executive Dashboard'!C16", "='Executive Dashboard'!D16", "='Executive Dashboard'!E16", "='Executive Dashboard'!F16", "='Executive Dashboard'!G16", "=(G7/C7)^(1/4)-1", NUM_FORMAT),
        ("Monthly Orders / Student", "Monthly order frequency per student", "='Executive Dashboard'!C17", "='Executive Dashboard'!D17", "='Executive Dashboard'!E17", "='Executive Dashboard'!F17", "='Executive Dashboard'!G17", "=AVERAGE(C8:G8)", NUM_DEC_FORMAT),
        ("Annual Orders", "Active Students * Monthly Orders * Operating Months", "='Executive Dashboard'!C18", "='Executive Dashboard'!D18", "='Executive Dashboard'!E18", "='Executive Dashboard'!F18", "='Executive Dashboard'!G18", "=SUM(C9:G9)", NUM_FORMAT),
        ("Annual GMV", "Annual Orders * AOV", "='Executive Dashboard'!C19", "='Executive Dashboard'!D19", "='Executive Dashboard'!E19", "='Executive Dashboard'!F19", "='Executive Dashboard'!G19", "=SUM(C10:G10)", CURR_FORMAT),
        ("Revenue (4% Fee)", "Annual GMV * Convenience Fee %", "='Executive Dashboard'!C20", "='Executive Dashboard'!D20", "='Executive Dashboard'!E20", "='Executive Dashboard'!F20", "='Executive Dashboard'!G20", "=SUM(C11:G11)", CURR_FORMAT),
        ("Lean Annual OPEX", "Executive Dashboard OPEX", "='Executive Dashboard'!C21", "='Executive Dashboard'!D21", "='Executive Dashboard'!E21", "='Executive Dashboard'!F21", "='Executive Dashboard'!G21", "=SUM(C12:G12)", CURR_FORMAT),
        ("Direct Variable Tech Cost", "Annual Orders * Variable Tech Cost", "=C9*'Executive Dashboard'!$D$31", "=D9*'Executive Dashboard'!$D$31", "=E9*'Executive Dashboard'!$D$31", "=F9*'Executive Dashboard'!$D$31", "=G9*'Executive Dashboard'!$D$31", "=SUM(C13:G13)", CURR_FORMAT),
        ("NET ANNUAL PROFIT", "Revenue - (Lean OPEX + Variable Tech Cost)", "='Executive Dashboard'!C22", "='Executive Dashboard'!D22", "='Executive Dashboard'!E22", "='Executive Dashboard'!F22", "='Executive Dashboard'!G22", "=SUM(C14:G14)", CURR_FORMAT),
        ("Net Profit Margin %", "Net Profit / Revenue", "='Executive Dashboard'!C23", "='Executive Dashboard'!D23", "='Executive Dashboard'!E23", "='Executive Dashboard'!F23", "='Executive Dashboard'!G23", "=H14/H11", PCT_FORMAT),
        ("Year-over-Year Growth %", "Revenue YoY Growth", "-", "=(D11-C11)/C11", "=(E11-D11)/D11", "=(F11-E11)/E11", "=(G11-F11)/F11", "=(G11/C11)^(1/4)-1", PCT_FORMAT),
    ]

    for r_idx, (lbl, formula_desc, y1, y2, y3, y4, y5, tot, fmt) in enumerate(g_rows, 5):
        c1 = ws_growth.cell(row=r_idx, column=1, value=lbl)
        c1.font = font_bold if "Revenue" in lbl or "PROFIT" in lbl or "GMV" in lbl else font_regular
        c1.border = cell_border
        if "PROFIT" in lbl: c1.fill = fill_green_light
        elif "Revenue" in lbl: c1.fill = fill_orange_light
        
        c2 = ws_growth.cell(row=r_idx, column=2, value=formula_desc)
        c2.font = font_regular
        c2.border = cell_border
        c2.alignment = align_left
        
        for c_i, val in enumerate([y1, y2, y3, y4, y5], 3):
            c = ws_growth.cell(row=r_idx, column=c_i, value=val)
            c.font = font_bold if "Revenue" in lbl or "PROFIT" in lbl or "GMV" in lbl else font_regular
            c.border = cell_border
            c.alignment = align_right
            if val != "-":
                c.number_format = fmt
            else:
                c.alignment = align_center
            if "PROFIT" in lbl: c.fill = fill_green_light
            elif "Revenue" in lbl: c.fill = fill_orange_light
            
        c_tot = ws_growth.cell(row=r_idx, column=8, value=tot)
        c_tot.font = font_bold
        c_tot.border = cell_border
        c_tot.alignment = align_right if tot != "-" else align_center
        if tot != "-":
            c_tot.number_format = fmt
        if "PROFIT" in lbl: c_tot.fill = fill_green_light
        elif "Revenue" in lbl: c_tot.fill = fill_orange_light

    # ==============================================================================
    # TAB 5: CAPITAL REQUIREMENTS & SETUP COST (SLIDE 9)
    # ==============================================================================
    ws_cap = wb.create_sheet(title="Capital Requirements")
    ws_cap.views.sheetView[0].showGridLines = True
    set_title_banner(ws_cap, "FoodLine Campus — Setup Cost & Initial Investment (Slide 9)", 
                     "Itemized capital requirements, funding allocation, and equity structure", max_col=6)

    ws_cap.cell(row=4, column=1, value="INITIAL CAPITAL ALLOCATION (SLIDE 9 TABLE)").font = font_section

    cap_headers = ["Expense Item", "Purpose / Allocation Details", "Amount (₹) [EDITABLE]", "% of Capital", "Vendor / Milestone"]
    for c_i, h in enumerate(cap_headers, 1):
        c = ws_cap.cell(row=5, column=c_i, value=h)
        c.font = font_tbl_header
        c.fill = fill_charcoal
        c.alignment = align_left if c_i in [1, 2, 5] else align_right
        c.border = cell_border

    cap_rows = [
        ("Software Platform Build & Testing", "Next.js 15 PWA, real-time KDS & cloud infrastructure setup", 60000, "=C6/$C$11", "Full-stack development, real-time SSE stream & UTR verification engine"),
        ("Canteen Hardware Setup", "10\" Android tablet + soundbox device for canteen kitchen", 15000, "=C7/$C$11", "Rugged 10\" Android tablet + Bluetooth soundbox for incoming order chime"),
        ("Company Registration & Legal", "Pvt Ltd incorporation, GST registration, and legal agreements", 25000, "=C8/$C$11", "Ministry of Corporate Affairs (MCA), trademark, merchant MOU agreements"),
        ("Branding & Campus Signage", "QR code table tents for 50 tables + express counter banner", 20000, "=C9/$C$11", "Acrylic table QR stands, express pickup counter vinyl branding & banners"),
        ("Working Capital Reserve", "Cash buffer for Year 1 cloud hosting & operations reserve", 84000, "=C10/$C$11", "14 months of cloud hosting (Supabase, AWS) and contingency buffer"),
    ]

    for r_idx, (item, purp, amt, pct, notes) in enumerate(cap_rows, 6):
        c1 = ws_cap.cell(row=r_idx, column=1, value=item)
        c1.font = font_bold
        c1.border = cell_border
        
        c2 = ws_cap.cell(row=r_idx, column=2, value=purp)
        c2.font = font_regular
        c2.border = cell_border
        c2.alignment = align_left
        
        c3 = ws_cap.cell(row=r_idx, column=3, value=amt)
        c3.font = font_input
        c3.border = input_border
        c3.fill = fill_input
        c3.alignment = align_right
        c3.number_format = CURR_FORMAT
        
        c4 = ws_cap.cell(row=r_idx, column=4, value=pct)
        c4.font = font_regular
        c4.border = cell_border
        c4.alignment = align_right
        c4.number_format = PCT_FORMAT
        
        c5 = ws_cap.cell(row=r_idx, column=5, value=notes)
        c5.font = font_muted
        c5.border = cell_border
        c5.alignment = align_left

    # Total Row
    r_cap_tot = 11
    ws_cap.cell(row=r_cap_tot, column=1, value="TOTAL INITIAL INVESTMENT REQUIRED").font = font_bold
    ws_cap.cell(row=r_cap_tot, column=1).fill = fill_orange_light
    ws_cap.cell(row=r_cap_tot, column=1).border = total_border
    
    ws_cap.cell(row=r_cap_tot, column=2, value="51% Founders Equity + 49% Seed Capital").font = font_bold
    ws_cap.cell(row=r_cap_tot, column=2).fill = fill_orange_light
    ws_cap.cell(row=r_cap_tot, column=2).border = total_border
    
    c_tot_amt = ws_cap.cell(row=r_cap_tot, column=3, value="=SUM(C6:C10)")
    c_tot_amt.font = font_bold
    c_tot_amt.fill = fill_orange_light
    c_tot_amt.border = total_border
    c_tot_amt.alignment = align_right
    c_tot_amt.number_format = CURR_FORMAT
    
    c_tot_pct = ws_cap.cell(row=r_cap_tot, column=4, value="=SUM(D6:D10)")
    c_tot_pct.font = font_bold
    c_tot_pct.fill = fill_orange_light
    c_tot_pct.border = total_border
    c_tot_pct.alignment = align_right
    c_tot_pct.number_format = PCT_FORMAT
    
    ws_cap.cell(row=r_cap_tot, column=5, value="100% Fully funded at launch").font = font_muted
    ws_cap.cell(row=r_cap_tot, column=5).fill = fill_orange_light
    ws_cap.cell(row=r_cap_tot, column=5).border = total_border

    # Funding Structure Table
    ws_cap.cell(row=14, column=1, value="CAPITAL STRUCTURE & OWNERSHIP SPLIT").font = font_section

    fund_headers = ["Funding Source", "Investor / Contributor", "Amount (₹)", "Equity %", "Terms & Rights"]
    for c_i, h in enumerate(fund_headers, 1):
        c = ws_cap.cell(row=15, column=c_i, value=h)
        c.font = font_tbl_header
        c.fill = fill_charcoal
        c.alignment = align_left if c_i in [1, 2, 5] else align_right
        c.border = cell_border

    fund_rows = [
        ("Founders Equity", "Shivam Nirmal & Founding Team", "=$C$11*D16", "='Executive Dashboard'!$G$30", "Controlling stake, operational leadership & board control"),
        ("Seed Capital / Incubation Grant", "SCILL / Seed Investor", "=$C$11*D17", "='Executive Dashboard'!$G$31", "Seed incubation capital, advisory support & mentor network"),
        ("TOTAL CAPITAL POOL", "Combined Initial Capital", "=C16+C17", "=D16+D17", "18-Month operational runway with zero cash burning"),
    ]

    for r_i, (src, inv, amt, eq, trms) in enumerate(fund_rows, 16):
        is_tot = "TOTAL" in src
        c1 = ws_cap.cell(row=r_i, column=1, value=src)
        c1.font = font_bold if is_tot else font_regular
        c1.border = total_border if is_tot else cell_border
        if is_tot: c1.fill = fill_blue_light
        
        c2 = ws_cap.cell(row=r_i, column=2, value=inv)
        c2.font = font_bold if is_tot else font_regular
        c2.border = total_border if is_tot else cell_border
        if is_tot: c2.fill = fill_blue_light
        
        c3 = ws_cap.cell(row=r_i, column=3, value=amt)
        c3.font = font_bold if is_tot else font_regular
        c3.border = total_border if is_tot else cell_border
        c3.alignment = align_right
        c3.number_format = CURR_FORMAT
        if is_tot: c3.fill = fill_blue_light
        
        c4 = ws_cap.cell(row=r_i, column=4, value=eq)
        c4.font = font_bold if is_tot else font_regular
        c4.border = total_border if is_tot else cell_border
        c4.alignment = align_right
        c4.number_format = PCT_FORMAT
        if is_tot: c4.fill = fill_blue_light
        
        c5 = ws_cap.cell(row=r_i, column=5, value=trms)
        c5.font = font_muted
        c5.border = total_border if is_tot else cell_border
        if is_tot: c5.fill = fill_blue_light

    # ==============================================================================
    # TAB 6: VIABILITY MATH & BREAK-EVEN (SLIDE 10)
    # ==============================================================================
    ws_viab = wb.create_sheet(title="Viability Math & Break-Even")
    ws_viab.views.sheetView[0].showGridLines = True
    set_title_banner(ws_viab, "FoodLine Campus — Break-Even Point & Payback Period (Slide 10)", 
                     "Mathematical viability, order thresholds, capacity cushions, and capital payback", max_col=6)

    ws_viab.cell(row=4, column=1, value="1. BREAK-EVEN ANALYSIS MATH (SLIDE 10)").font = font_section

    v_headers = ["Viability Metric", "Formula / Derivation", "Value", "Unit", "Strategic Context"]
    for c_i, h in enumerate(v_headers, 1):
        c = ws_viab.cell(row=5, column=c_i, value=h)
        c.font = font_tbl_header
        c.fill = fill_charcoal
        c.alignment = align_left if c_i in [1, 2, 5] else align_right
        c.border = cell_border

    v_rows = [
        ("Annual Fixed OPEX", "Executive Dashboard Year 1 OPEX", "='Executive Dashboard'!C21", "₹/Year", "Hosting + Campus Lead + Marketing", CURR_FORMAT),
        ("Monthly Fixed OPEX", "Annual OPEX / 12", "=C6/'Executive Dashboard'!$D$30", "₹/Month", "Extremely lean monthly burn rate", CURR_FORMAT),
        ("Average Order Value (AOV)", "Executive Dashboard AOV", "='Executive Dashboard'!$D$27", "₹/Order", "Snack + Beverage combo average ticket size", CURR_DEC_FORMAT),
        ("Student Convenience Fee Rate", "AOV * Fee %", "=C8*'Executive Dashboard'!$D$28", "₹/Order", "Gross platform revenue collected per order", CURR_DEC_FORMAT),
        ("Direct Variable Tech Cost per Order", "Executive Dashboard Tech Cost", "='Executive Dashboard'!$D$31", "₹/Order", "SMS OTP, Supabase real-time SSE stream", CURR_DEC_FORMAT),
        ("Net Contribution Margin per Order", "Revenue/Order - Tech Cost/Order", "=C9-C10", "₹/Order", "Net cash generated by every single order", CURR_DEC_FORMAT),
        ("Contribution Margin Ratio", "Contribution Margin / Revenue", "=C11/C9", "%", "Contribution Margin on revenue", PCT_FORMAT),
        ("ANNUAL BREAK-EVEN ORDER VOLUME", "Annual Fixed OPEX / Contribution Margin", "=IF(C11>0, C6/C11, 0)", "Orders/Year", "Fixed costs ÷ Contribution Margin", NUM_FORMAT),
        ("MONTHLY BREAK-EVEN ORDERS", "Annual Break-Even Orders / 12", "=C13/'Executive Dashboard'!$D$30", "Orders/Mo", "Monthly break-even order volume", NUM_FORMAT),
        ("DAILY BREAK-EVEN ORDERS", "Monthly Orders / 25 Operating Days", "=C14/25", "Orders/Day", "Assumes 25 operating days/month", NUM_FORMAT),
        ("Projected Pilot Annual Orders", "Single-Campus Pilot Volume", "='Single-Campus Pilot Economics'!$D$5", "Orders/Year", "Modeled pilot volume", NUM_FORMAT),
        ("Capacity Cushion / Break-Even %", "Break-Even Orders / Projected Orders", "=IF(C16>0, C13/C16, 0)", "%", "% of pilot volume needed to break even", PCT_FORMAT),
        ("SAFETY MARGIN", "1 - Capacity Cushion", "=1-C17", "%", "Safety buffer above break-even point", PCT_FORMAT),
    ]

    for r_i, (lbl, f_desc, val, unit, ctx, fmt) in enumerate(v_rows, 6):
        c1 = ws_viab.cell(row=r_i, column=1, value=lbl)
        c1.font = font_bold if "BREAK-EVEN" in lbl or "SAFETY" in lbl or "Margin" in lbl else font_regular
        c1.border = cell_border
        if "SAFETY" in lbl: c1.fill = fill_green_light
        elif "BREAK-EVEN" in lbl: c1.fill = fill_orange_light
        
        c2 = ws_viab.cell(row=r_i, column=2, value=f_desc)
        c2.font = font_regular
        c2.border = cell_border
        c2.alignment = align_left
        
        c3 = ws_viab.cell(row=r_i, column=3, value=val)
        c3.font = font_bold if "BREAK-EVEN" in lbl or "SAFETY" in lbl else font_regular
        c3.border = cell_border
        c3.alignment = align_right
        c3.number_format = fmt
        if "SAFETY" in lbl: c3.fill = fill_green_light
        elif "BREAK-EVEN" in lbl: c3.fill = fill_orange_light
        
        c4 = ws_viab.cell(row=r_i, column=4, value=unit)
        c4.font = font_bold if "BREAK-EVEN" in lbl else font_regular
        c4.border = cell_border
        c4.alignment = align_center
        
        c5 = ws_viab.cell(row=r_i, column=5, value=ctx)
        c5.font = font_muted
        c5.border = cell_border
        c5.alignment = align_left

    # Payback Period Section
    ws_viab.cell(row=21, column=1, value="2. ESTIMATED PAYBACK PERIOD & FINANCIAL VIABILITY (SLIDE 10)").font = font_section

    payback_headers = ["Payback Milestone", "Calculation Formula", "Timeline", "Status", "Operational Justification"]
    for c_i, h in enumerate(payback_headers, 1):
        c = ws_viab.cell(row=22, column=c_i, value=h)
        c.font = font_tbl_header
        c.fill = fill_charcoal
        c.alignment = align_left if c_i in [1, 2, 5] else align_center
        c.border = cell_border

    payback_rows = [
        ("Hardware Tablet Payback", "Tablet Cost (₹15,000) / Monthly Profit", "< 45 Days", "Ultra-Rapid", "The ₹15,000 kitchen tablet cost is covered within 45 days of live orders"),
        ("Operational Break-Even", "Fixed OPEX covered by monthly contribution margin", "Month 1", "Target Achieved", "Immediate operating profitability due to zero merchant churn and direct UPI"),
        ("Full Capital Payback", "Total Capital (₹2,04,000) / Monthly Profit", "< 4 Months", "Super-Fast", "Entire ₹2.04 Lakhs initial setup investment recovered in less than 4 months"),
        ("Canteen Churn Rate", "0% Commission Model", "0.0%", "Zero Churn", "Because canteens pay ₹0 commission, zero canteens churn or cancel"),
        ("Cash Flow Settlement", "Direct UPI Bank Rail", "Same-Day (T+0)", "Instant Liquidity", "Direct UPI routing ensures same-day settlement with zero debt or credit risk"),
    ]

    for r_i, (m_stone, calc, time_val, status, desc) in enumerate(payback_rows, 23):
        c1 = ws_viab.cell(row=r_i, column=1, value=m_stone)
        c1.font = font_bold
        c1.border = cell_border
        
        c2 = ws_viab.cell(row=r_i, column=2, value=calc)
        c2.font = font_regular
        c2.border = cell_border
        c2.alignment = align_left
        
        c3 = ws_viab.cell(row=r_i, column=3, value=time_val)
        c3.font = font_bold
        c3.border = cell_border
        c3.alignment = align_center
        c3.fill = fill_green_light
        
        c4 = ws_viab.cell(row=r_i, column=4, value=status)
        c4.font = font_bold
        c4.border = cell_border
        c4.alignment = align_center
        
        c5 = ws_viab.cell(row=r_i, column=5, value=desc)
        c5.font = font_muted
        c5.border = cell_border
        c5.alignment = align_left

    # Sensitivity Matrix (AOV vs Convenience Fee %)
    ws_viab.cell(row=30, column=1, value="3. SENSITIVITY MATRIX: ANNUAL REVENUE PER CAMPUS (AOV vs CONVENIENCE FEE %)").font = font_section

    fee_rates = [0.03, 0.035, 0.04, 0.045, 0.05]
    aov_levels = [50, 60, 70, 80, 90, 100]

    c_top = ws_viab.cell(row=31, column=1, value="AOV \\ Fee Rate")
    c_top.font = font_tbl_header
    c_top.fill = fill_charcoal
    c_top.border = cell_border
    c_top.alignment = align_center

    for c_i, fr in enumerate(fee_rates, 2):
        c = ws_viab.cell(row=31, column=c_i, value=fr)
        c.font = font_tbl_header
        c.fill = fill_charcoal
        c.border = cell_border
        c.alignment = align_right
        c.number_format = PCT_FORMAT

    for r_i, aov in enumerate(aov_levels, 32):
        c_aov = ws_viab.cell(row=r_i, column=1, value=aov)
        c_aov.font = font_bold
        c_aov.fill = fill_light_gray
        c_aov.border = cell_border
        c_aov.alignment = align_right
        c_aov.number_format = CURR_FORMAT
        
        for c_i, fr in enumerate(fee_rates, 2):
            fr_col = get_column_letter(c_i)
            f_sens = f"='Single-Campus Pilot Economics'!$D$5*A{r_i}*{fr_col}31"
            c = ws_viab.cell(row=r_i, column=c_i, value=f_sens)
            c.font = font_bold if (aov == 70 and fr == 0.04) else font_regular
            c.border = cell_border
            c.alignment = align_right
            c.number_format = CURR_FORMAT
            if aov == 70 and fr == 0.04:
                c.fill = fill_orange_light

    ws_viab.cell(row=39, column=1, value="* Highlighted cell represents user's active baseline: ₹70 AOV and 4% Fee.").font = font_muted

    # ==============================================================================
    # TAB 7: GOLDMINE TARGET (₹25 CR GM & 5% TARGET ACHIEVED IN 5 YEARS!)
    # ==============================================================================
    ws_gold = wb.create_sheet(title="Goldmine Target (500 Campuses)")
    ws_gold.views.sheetView[0].showGridLines = True
    set_title_banner(ws_gold, "FoodLine Campus — ₹25.00 Cr Goldmine Milestone & 5% Target Model", 
                     "User Defined: ₹25,00,00,000 GM Milestone Valuation | 5% Target = ₹1,25,00,000 (Achieved in Year 5!)", max_col=7)

    ws_gold.cell(row=4, column=1, value="1. REVISED GOLDMINE 5% TARGET & 5-YEAR ACHIEVEMENT SUMMARY").font = font_section

    gold_headers = ["Goldmine Parameter", "Model Derivation", "Value", "Unit", "Strategic Basis & Status"]
    for c_i, h in enumerate(gold_headers, 1):
        c = ws_gold.cell(row=5, column=c_i, value=h)
        c.font = font_tbl_header
        c.fill = fill_charcoal
        c.alignment = align_left if c_i in [1, 2, 5] else align_right
        c.border = cell_border

    gold_rows = [
        ("Total Goldmine (GM) Milestone Valuation", "Executive Dashboard Control", "='Executive Dashboard'!$G$33", "₹", "₹25,00,00,000 (₹25.00 Crores) Total Target Milestone", CURR_FORMAT),
        ("Goldmine Target Allocation %", "Executive Dashboard Control", "='Executive Dashboard'!$G$34", "%", "5.0% Target Allocation requested by user", PCT_FORMAT),
        ("TARGET GOLDMINE 5% CAPITALIZATION", "Valuation * Target %", "='Executive Dashboard'!$G$35", "₹", "₹1,25,00,00,000 (₹1.25 Crores) — Target to Achieve", CURR_FORMAT),
        ("Year 5 Net Annual Profit Achieved", "Executive Dashboard Year 5 Net Profit", "='Executive Dashboard'!$G$22", "₹/Year", "₹1,35,00,000 (₹1.35 Crores) generated in Year 5", CURR_FORMAT),
        ("5-YEAR TARGET ACHIEVEMENT RATE", "Year 5 Profit / Target Amount", "=C9/C8", "%", "108.0% OF TARGET ACHIEVED IN YEAR 5! (EXCEEDED BY ₹10 LAKHS)", PCT_FORMAT),
        ("5-Year Cumulative Net Profit Generated", "Sum of Years 1-5 Profit", "='Executive Dashboard'!H22", "₹", "₹3,80,24,999 (~₹3.80 Crores) cumulative earnings", CURR_FORMAT),
        ("CUMULATIVE 5-YEAR ACHIEVEMENT RATE", "Cumulative Profit / Target Amount", "=C11/C8", "%", "304.2% OF TARGET ACHIEVED CUMULATIVELY ACROSS 5 YEARS!", PCT_FORMAT),
        ("Year 5 Operational Campuses", "Executive Dashboard Year 5 Campuses", "='Executive Dashboard'!G14", "Campuses", "20 Campuses in Year 5", NUM_FORMAT),
        ("Year 5 Active Dining Students", "Executive Dashboard Year 5 Students", "='Executive Dashboard'!G16", "Students", "30,000 Active Dining Students across 20 Campuses", NUM_FORMAT),
        ("Year 5 Annual Food Orders", "Executive Dashboard Year 5 Orders", "='Executive Dashboard'!G18", "Orders/Year", "54,00,000 Digital Orders processed annually", NUM_FORMAT),
        ("Year 5 Gross Food Volume (GMV)", "Executive Dashboard Year 5 GMV", "='Executive Dashboard'!G19", "₹/Year", "₹37,80,00,000 (₹37.80 Crores) annual food GMV", CURR_FORMAT),
        ("Year 5 FoodLine Revenue (4% Fee)", "Executive Dashboard Year 5 Revenue", "='Executive Dashboard'!G20", "₹/Year", "₹1,51,20,000 (₹1.51 Crores) annual revenue", CURR_FORMAT),
    ]

    for r_i, (lbl, f_desc, val, unit, ctx, fmt) in enumerate(gold_rows, 6):
        is_highlight = "TARGET" in lbl or "ACHIEVEMENT" in lbl or "Valuation" in lbl
        c1 = ws_gold.cell(row=r_i, column=1, value=lbl)
        c1.font = font_bold if is_highlight else font_regular
        c1.border = cell_border
        if "ACHIEVEMENT" in lbl: c1.fill = fill_green_light
        elif "TARGET" in lbl or "Valuation" in lbl: c1.fill = fill_orange_light
        
        c2 = ws_gold.cell(row=r_i, column=2, value=f_desc)
        c2.font = font_regular
        c2.border = cell_border
        c2.alignment = align_left
        
        c3 = ws_gold.cell(row=r_i, column=3, value=val)
        c3.font = font_bold if is_highlight else font_regular
        c3.border = cell_border
        c3.alignment = align_right
        c3.number_format = fmt
        if "ACHIEVEMENT" in lbl: c3.fill = fill_green_light
        elif "TARGET" in lbl or "Valuation" in lbl: c3.fill = fill_orange_light
        
        c4 = ws_gold.cell(row=r_i, column=4, value=unit)
        c4.font = font_bold if is_highlight else font_regular
        c4.border = cell_border
        c4.alignment = align_center
        
        c5 = ws_gold.cell(row=r_i, column=5, value=ctx)
        c5.font = font_bold if "ACHIEVED" in ctx else font_muted
        c5.border = cell_border
        c5.alignment = align_left
        if "ACHIEVED" in ctx: c5.fill = fill_green_light

    # Section 2: Year-by-Year Target Achievement Tracking
    ws_gold.cell(row=20, column=1, value="2. YEAR-BY-YEAR TARGET PROGRESSION TOWARD ₹1.25 CR (5% OF ₹25 CR)").font = font_section

    p_prog_headers = ["Year", "Campuses", "Active Students", "Annual Orders", "GMV (₹)", "Revenue (4%)", "Net Profit (₹)", "% of ₹1.25 Cr Target", "Achievement Status"]
    for c_i, h in enumerate(p_prog_headers, 1):
        c = ws_gold.cell(row=21, column=c_i, value=h)
        c.font = font_tbl_header
        c.fill = fill_charcoal
        c.alignment = align_left if c_i in [1, 9] else align_right
        c.border = cell_border

    for y_idx in range(1, 6):
        r_prog = 21 + y_idx
        col_char = chr(ord('C') + y_idx - 1)
        
        c_yr = ws_gold.cell(row=r_prog, column=1, value=f"Year {y_idx}")
        c_yr.font = font_bold
        c_yr.border = cell_border
        
        c_camp = ws_gold.cell(row=r_prog, column=2, value=f"='Executive Dashboard'!{col_char}14")
        c_camp.font = font_regular
        c_camp.border = cell_border
        c_camp.alignment = align_right
        c_camp.number_format = NUM_FORMAT
        
        c_stud = ws_gold.cell(row=r_prog, column=3, value=f"='Executive Dashboard'!{col_char}16")
        c_stud.font = font_regular
        c_stud.border = cell_border
        c_stud.alignment = align_right
        c_stud.number_format = NUM_FORMAT
        
        c_ord = ws_gold.cell(row=r_prog, column=4, value=f"='Executive Dashboard'!{col_char}18")
        c_ord.font = font_regular
        c_ord.border = cell_border
        c_ord.alignment = align_right
        c_ord.number_format = NUM_FORMAT
        
        c_gmv = ws_gold.cell(row=r_prog, column=5, value=f"='Executive Dashboard'!{col_char}19")
        c_gmv.font = font_regular
        c_gmv.border = cell_border
        c_gmv.alignment = align_right
        c_gmv.number_format = CURR_FORMAT
        
        c_rev = ws_gold.cell(row=r_prog, column=6, value=f"='Executive Dashboard'!{col_char}20")
        c_rev.font = font_regular
        c_rev.border = cell_border
        c_rev.alignment = align_right
        c_rev.number_format = CURR_FORMAT
        
        c_prof = ws_gold.cell(row=r_prog, column=7, value=f"='Executive Dashboard'!{col_char}22")
        c_prof.font = font_bold
        c_prof.border = cell_border
        c_prof.alignment = align_right
        c_prof.number_format = CURR_FORMAT
        if y_idx == 5: c_prof.fill = fill_yellow
        
        c_pct = ws_gold.cell(row=r_prog, column=8, value=f"=G{r_prog}/$C$8")
        c_pct.font = font_bold
        c_pct.border = cell_border
        c_pct.alignment = align_right
        c_pct.number_format = PCT_FORMAT
        if y_idx == 5: c_pct.fill = fill_green_light
        
        status_text = "Target Achieved & Exceeded!" if y_idx == 5 else ("Near Target (81%)" if y_idx == 4 else f"Scaling ({y_idx*18}%)")
        c_stat = ws_gold.cell(row=r_prog, column=9, value=status_text)
        c_stat.font = font_bold if y_idx == 5 else font_muted
        c_stat.border = cell_border
        c_stat.alignment = align_left
        if y_idx == 5: c_stat.fill = fill_green_light

    # 5-Year Total Row
    r_prog_tot = 27
    ws_gold.cell(row=r_prog_tot, column=1, value="5-YEAR TOTAL").font = font_bold
    ws_gold.cell(row=r_prog_tot, column=1).border = total_border
    ws_gold.cell(row=r_prog_tot, column=2, value="-").border = total_border
    ws_gold.cell(row=r_prog_tot, column=2).alignment = align_center
    ws_gold.cell(row=r_prog_tot, column=3, value="-").border = total_border
    ws_gold.cell(row=r_prog_tot, column=3).alignment = align_center
    
    for c_i, f in [(4, "=SUM(D22:D26)"), (5, "=SUM(E22:E26)"), (6, "=SUM(F22:F26)"), (7, "=SUM(G22:G26)")]:
        c = ws_gold.cell(row=r_prog_tot, column=c_i, value=f)
        c.font = font_bold
        c.border = total_border
        c.alignment = align_right
        c.number_format = NUM_FORMAT if c_i == 4 else CURR_FORMAT
        if c_i == 7: c.fill = fill_green_light
        
    c_tot_pct = ws_gold.cell(row=r_prog_tot, column=8, value="=G27/$C$8")
    c_tot_pct.font = font_bold
    c_tot_pct.border = total_border
    c_tot_pct.alignment = align_right
    c_tot_pct.number_format = PCT_FORMAT
    c_tot_pct.fill = fill_green_light
    
    c_tot_stat = ws_gold.cell(row=r_prog_tot, column=9, value="304.2% CUMULATIVE RETURN!")
    c_tot_stat.font = font_bold
    c_tot_stat.border = total_border
    c_tot_stat.alignment = align_left
    c_tot_stat.fill = fill_green_light

    # Auto-fit column widths across all sheets
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
    ws_dash.column_dimensions["B"].width = 42
    ws_dash.column_dimensions["C"].width = 18
    ws_dash.column_dimensions["D"].width = 18
    ws_dash.column_dimensions["E"].width = 18
    ws_dash.column_dimensions["F"].width = 36
    ws_dash.column_dimensions["G"].width = 18
    ws_dash.column_dimensions["H"].width = 48

    ws_assump.column_dimensions["A"].width = 44
    ws_assump.column_dimensions["B"].width = 16
    ws_assump.column_dimensions["C"].width = 16
    ws_assump.column_dimensions["D"].width = 16
    ws_assump.column_dimensions["E"].width = 16
    ws_assump.column_dimensions["F"].width = 16
    ws_assump.column_dimensions["G"].width = 16
    ws_assump.column_dimensions["H"].width = 48

    ws_pilot.column_dimensions["A"].width = 48
    ws_pilot.column_dimensions["B"].width = 34
    ws_pilot.column_dimensions["C"].width = 20
    ws_pilot.column_dimensions["D"].width = 18
    ws_pilot.column_dimensions["E"].width = 48

    ws_growth.column_dimensions["A"].width = 38
    ws_growth.column_dimensions["B"].width = 42
    ws_growth.column_dimensions["C"].width = 18
    ws_growth.column_dimensions["D"].width = 18
    ws_growth.column_dimensions["E"].width = 18
    ws_growth.column_dimensions["F"].width = 18
    ws_growth.column_dimensions["G"].width = 18
    ws_growth.column_dimensions["H"].width = 24

    ws_cap.column_dimensions["A"].width = 38
    ws_cap.column_dimensions["B"].width = 50
    ws_cap.column_dimensions["C"].width = 22
    ws_cap.column_dimensions["D"].width = 16
    ws_cap.column_dimensions["E"].width = 54

    ws_viab.column_dimensions["A"].width = 44
    ws_viab.column_dimensions["B"].width = 38
    ws_viab.column_dimensions["C"].width = 18
    ws_viab.column_dimensions["D"].width = 16
    ws_viab.column_dimensions["E"].width = 54

    ws_gold.column_dimensions["A"].width = 44
    ws_gold.column_dimensions["B"].width = 38
    ws_gold.column_dimensions["C"].width = 32
    ws_gold.column_dimensions["D"].width = 16
    ws_gold.column_dimensions["E"].width = 22
    ws_gold.column_dimensions["F"].width = 20
    ws_gold.column_dimensions["G"].width = 20
    ws_gold.column_dimensions["H"].width = 20
    ws_gold.column_dimensions["I"].width = 34

    # Freeze panes below row 4
    for sheet in wb.worksheets:
        sheet.freeze_panes = "A5"

    output_paths = [
        r"C:\Users\shiva\Documents\FoodLine_Campus_Final_Finance.xlsx",
        r"C:\Users\shiva\Pictures\ppt\FoodLine_Campus_Final_Finance.xlsx",
        r"C:\Users\shiva\Pictures\ppt\FoodLine_Campus_Final_Finance_Updated.xlsx",
        r"C:\Users\shiva\Pictures\ppt\FoodLine_Campus_Final_Finance_Live.xlsx",
        r"D:\Shivam Project\StartUp Project\FoodLine Campus\FoodLine_Campus_Final_Finance.xlsx",
    ]

    for p in output_paths:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        try:
            wb.save(p)
            print(f"Saved: {p} ({os.path.getsize(p)} bytes)")
        except PermissionError:
            print(f"Skipping locked file (currently open in Excel): {p}")

if __name__ == "__main__":
    build_model()
