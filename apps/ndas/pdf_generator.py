import base64
import os
from io import BytesIO
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, Image, KeepTogether
from reportlab.platypus import Frame, PageTemplate, BaseDocTemplate


PAGE_W, PAGE_H = A4
L_MARGIN = R_MARGIN = 20 * mm
T_MARGIN = 18 * mm
B_MARGIN = 22 * mm  # extra space for footer


def _footer(canvas, doc):
    canvas.saveState()
    canvas.setFont('Helvetica', 7)
    canvas.setFillColor(colors.HexColor('#6b7280'))
    canvas.drawString(L_MARGIN, 12 * mm, 'Zayron Infotech Pvt. Ltd. - Confidential')
    canvas.drawRightString(PAGE_W - R_MARGIN, 12 * mm, f'Page {canvas.getPageNumber()} of {doc._total_pages}')
    canvas.restoreState()


def generate_nda_pdf(nda_document):
    buf = BytesIO()

    doc = SimpleDocTemplate(
        buf,
        pagesize=A4,
        rightMargin=R_MARGIN,
        leftMargin=L_MARGIN,
        topMargin=T_MARGIN,
        bottomMargin=B_MARGIN,
    )

    styles = getSampleStyleSheet()

    body_style = ParagraphStyle('Body', parent=styles['Normal'],
        fontSize=9, fontName='Helvetica', leading=14, alignment=TA_JUSTIFY, spaceAfter=6)
    heading_style = ParagraphStyle('Heading', parent=styles['Normal'],
        fontSize=10, fontName='Helvetica-Bold', spaceAfter=4, spaceBefore=10)
    label_style = ParagraphStyle('Label', parent=styles['Normal'],
        fontSize=9, fontName='Helvetica-Bold', textColor=colors.HexColor('#374151'))
    value_style = ParagraphStyle('Value', parent=styles['Normal'],
        fontSize=9, fontName='Helvetica', textColor=colors.HexColor('#111827'))
    bullet_style = ParagraphStyle('Bullet', parent=styles['Normal'],
        fontSize=9, fontName='Helvetica', leading=14, alignment=TA_JUSTIFY,
        leftIndent=12, spaceAfter=4)
    section_head_style = ParagraphStyle('SHead', parent=styles['Normal'],
        fontSize=10, fontName='Helvetica-Bold', spaceAfter=3, spaceBefore=10,
        textColor=colors.HexColor('#111827'))

    employee = nda_document.employee
    emp_type_label = 'Permanent Employee' if employee.employee_type == 'permanent' else 'Contract Employee'

    elements = []

    # ── HEADER ──
    from django.conf import settings
    logo_path = os.path.join(settings.BASE_DIR, 'static', 'img', 'logo1.png')

    h_title = ParagraphStyle('HT', fontSize=16, fontName='Helvetica-Bold', alignment=TA_CENTER, spaceAfter=2)
    h_sub   = ParagraphStyle('HS', fontSize=11, fontName='Helvetica-Bold', alignment=TA_CENTER,
                              textColor=colors.HexColor('#1e40af'), spaceAfter=1)
    h_sub2  = ParagraphStyle('HS2', fontSize=10, fontName='Helvetica', alignment=TA_CENTER,
                              textColor=colors.HexColor('#374151'), spaceAfter=4)

    title_block = [
        Paragraph('ZAYRON INFOTECH PVT. LTD.', h_title),
        Paragraph('NON-DISCLOSURE AGREEMENT', h_sub),
        Paragraph(f'({emp_type_label})', h_sub2),
    ]

    if os.path.exists(logo_path):
        try:
            logo_img = Image(logo_path, width=30 * mm, height=30 * mm)
            header_row = Table([[logo_img, title_block]], colWidths=[34 * mm, 142 * mm])
            header_row.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('ALIGN', (0, 0), (0, 0), 'LEFT'),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                ('TOPPADDING', (0, 0), (-1, -1), 0),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
            ]))
            elements.append(header_row)
        except Exception:
            for el in title_block:
                elements.append(el)
    else:
        for el in title_block:
            elements.append(el)

    elements.append(HRFlowable(width='100%', thickness=1.5, color=colors.HexColor('#1e40af'), spaceAfter=10))

    # ── EMPLOYEE INFO TABLE ──
    info_data = [
        [Paragraph('Employee Name', label_style), Paragraph(nda_document.full_name, value_style),
         Paragraph('Employee Type', label_style), Paragraph(emp_type_label, value_style)],
        [Paragraph('Department', label_style), Paragraph(employee.department, value_style),
         Paragraph('Designation', label_style), Paragraph(employee.designation, value_style)],
        [Paragraph('Mobile', label_style), Paragraph(nda_document.mobile, value_style),
         Paragraph('Joining Date', label_style), Paragraph(str(employee.joining_date), value_style)],
        [Paragraph('Aadhaar No', label_style), Paragraph(nda_document.aadhaar_number, value_style),
         Paragraph('Date Signed', label_style), Paragraph(str(nda_document.signed_date), value_style)],
        [Paragraph('Address', label_style), Paragraph(nda_document.address, value_style),
         Paragraph('Emergency Contact', label_style), Paragraph(nda_document.emergency_contact, value_style)],
    ]

    info_table = Table(info_data, colWidths=[32 * mm, 60 * mm, 38 * mm, 46 * mm])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f4ff')),
        ('BACKGROUND', (2, 0), (2, -1), colors.HexColor('#f0f4ff')),
        ('BACKGROUND', (1, 0), (1, -1), colors.white),
        ('BACKGROUND', (3, 0), (3, -1), colors.white),
        ('BOX', (0, 0), (-1, -1), 0.8, colors.HexColor('#1e40af')),
        ('INNERGRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#c7d2fe')),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 10))

    # ── NDA CONTENT ──
    from apps.ndas.nda_content import PERMANENT_NDA, CONTRACT_NDA
    nda_text = PERMANENT_NDA if employee.employee_type == 'permanent' else CONTRACT_NDA

    # Parse intro paragraph (before clause 1)
    lines = nda_text.strip().split('\n')
    i = 0

    # First line is the NDA title heading
    elements.append(Paragraph('TERMS AND CONDITIONS', heading_style))

    while i < len(lines):
        line = lines[i].strip()
        if not line:
            elements.append(Spacer(1, 3))
            i += 1
        elif line.startswith('(') and len(line) < 80:
            # sub-item like (a) ...
            elements.append(Paragraph(f'&#8211; {line}', bullet_style))
            i += 1
        elif line[0].isdigit() and '.' in line[:4]:
            # Numbered clause — keep heading + first paragraph together
            group = [Paragraph(line, section_head_style)]
            i += 1
            while i < len(lines) and lines[i].strip() and not (lines[i].strip()[0].isdigit() and '.' in lines[i].strip()[:4]):
                next_line = lines[i].strip()
                if next_line.startswith('('):
                    group.append(Paragraph(f'&#9679; {next_line}', bullet_style))
                else:
                    group.append(Paragraph(next_line, body_style))
                i += 1
            elements.append(KeepTogether(group))
        elif line.isupper():
            elements.append(Paragraph(line, heading_style))
            i += 1
        else:
            elements.append(Paragraph(line, body_style))
            i += 1

    elements.append(HRFlowable(width='100%', thickness=0.5, color=colors.grey, spaceAfter=10, spaceBefore=10))

    # ── SIGNATURE SECTION ──
    sig_cell_content = Paragraph('[Digital Signature on File]', value_style)
    if nda_document.signature:
        try:
            sig_b64 = nda_document.signature
            if ',' in sig_b64:
                sig_b64 = sig_b64.split(',')[1]
            sig_bytes = base64.b64decode(sig_b64)
            sig_img = Image(BytesIO(sig_bytes), width=80 * mm, height=28 * mm)
            sig_cell_content = sig_img
        except Exception:
            pass

    sig_data = [
        [Paragraph('Employee Name', label_style), Paragraph(nda_document.full_name, value_style)],
        [Paragraph('Date Signed', label_style), Paragraph(str(nda_document.signed_date), value_style)],
        [Paragraph('Digital Signature', label_style), sig_cell_content],
    ]

    sig_table = Table(sig_data, colWidths=[45 * mm, 131 * mm], rowHeights=[None, None, 32 * mm])
    sig_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.8, colors.HexColor('#1e40af')),
        ('INNERGRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#c7d2fe')),
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f4ff')),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))

    elements.append(KeepTogether([
        Paragraph('ACKNOWLEDGMENT & SIGNATURE', heading_style),
        sig_table,
    ]))

    elements.append(Spacer(1, 14))
    elements.append(HRFlowable(width='100%', thickness=0.5, color=colors.HexColor('#c7d2fe'), spaceAfter=5))
    elements.append(Paragraph(
        'This document was generated electronically by Zayron Infotech Pvt. Ltd. Onboarding System.',
        ParagraphStyle('Foot', parent=styles['Normal'], fontSize=7, textColor=colors.grey, alignment=TA_CENTER)
    ))
    elements.append(Paragraph(
        f'Generated on: {datetime.now().strftime("%d %B %Y at %I:%M %p")}',
        ParagraphStyle('Foot2', parent=styles['Normal'], fontSize=7, textColor=colors.grey, alignment=TA_CENTER)
    ))

    # Use a deferred total-page approach via canvas
    doc._total_pages = 0

    class PageCountCanvas:
        """Wraps canvas to inject total page count after first pass."""
        pass

    # Build with placeholder, then patch total pages using a workaround
    total_holder = [0]

    def footer_with_total(canvas, doc):
        canvas.saveState()
        canvas.setFont('Helvetica', 7)
        canvas.setFillColor(colors.HexColor('#6b7280'))
        canvas.drawString(L_MARGIN, 12 * mm, 'Zayron Infotech Pvt. Ltd. - Confidential')
        canvas.drawRightString(PAGE_W - R_MARGIN, 12 * mm, f'Page {canvas.getPageNumber()} of {total_holder[0] or "—"}')
        canvas.restoreState()

    def on_last_page(canvas, doc):
        total_holder[0] = canvas.getPageNumber()
        footer_with_total(canvas, doc)

    doc.build(elements, onFirstPage=footer_with_total, onLaterPages=footer_with_total)
    buf.seek(0)
    return buf
