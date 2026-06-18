import base64
import os
from io import BytesIO
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, Image
from reportlab.lib.utils import ImageReader


def generate_nda_pdf(nda_document):
    buf = BytesIO()
    doc = SimpleDocTemplate(
        buf,
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('Title', parent=styles['Normal'],
        fontSize=16, fontName='Helvetica-Bold', alignment=TA_CENTER, spaceAfter=4)
    subtitle_style = ParagraphStyle('Subtitle', parent=styles['Normal'],
        fontSize=11, fontName='Helvetica-Bold', alignment=TA_CENTER, spaceAfter=2, textColor=colors.HexColor('#1e40af'))
    body_style = ParagraphStyle('Body', parent=styles['Normal'],
        fontSize=9, fontName='Helvetica', leading=14, alignment=TA_JUSTIFY, spaceAfter=8)
    heading_style = ParagraphStyle('Heading', parent=styles['Normal'],
        fontSize=10, fontName='Helvetica-Bold', spaceAfter=4, spaceBefore=8)
    label_style = ParagraphStyle('Label', parent=styles['Normal'],
        fontSize=9, fontName='Helvetica-Bold', textColor=colors.HexColor('#374151'))
    value_style = ParagraphStyle('Value', parent=styles['Normal'],
        fontSize=9, fontName='Helvetica', textColor=colors.HexColor('#111827'))

    employee = nda_document.employee
    emp_type_label = 'Permanent Employee' if employee.employee_type == 'permanent' else 'Contract Employee'

    elements = []

    # Header with logo
    from django.conf import settings
    logo_path = os.path.join(settings.BASE_DIR, 'static', 'img', 'logo1.png')
    header_content = []
    if os.path.exists(logo_path):
        try:
            logo_img = Image(logo_path, width=18 * mm, height=18 * mm)
            logo_img.hAlign = 'CENTER'
            header_content.append(logo_img)
        except Exception:
            pass

    header_title_style = ParagraphStyle('HTitle', parent=styles['Normal'],
        fontSize=16, fontName='Helvetica-Bold', alignment=TA_CENTER, spaceAfter=2, spaceBefore=4)
    header_sub_style = ParagraphStyle('HSub', parent=styles['Normal'],
        fontSize=11, fontName='Helvetica-Bold', alignment=TA_CENTER, spaceAfter=1,
        textColor=colors.HexColor('#1e40af'))
    header_sub2_style = ParagraphStyle('HSub2', parent=styles['Normal'],
        fontSize=10, fontName='Helvetica-Bold', alignment=TA_CENTER, spaceAfter=6,
        textColor=colors.HexColor('#1e40af'))

    header_content += [
        Paragraph('ZAYRON INFOTECH PVT. LTD.', header_title_style),
        Paragraph('NON-DISCLOSURE AGREEMENT', header_sub_style),
        Paragraph(f'({emp_type_label})', header_sub2_style),
    ]

    for el in header_content:
        elements.append(el)
    elements.append(HRFlowable(width='100%', thickness=2, color=colors.HexColor('#1e40af'), spaceAfter=12))

    # Employee info table
    info_data = [
        [Paragraph('<b>Employee Name:</b>', label_style), Paragraph(nda_document.full_name, value_style),
         Paragraph('<b>Employee Type:</b>', label_style), Paragraph(emp_type_label, value_style)],
        [Paragraph('<b>Department:</b>', label_style), Paragraph(employee.department, value_style),
         Paragraph('<b>Designation:</b>', label_style), Paragraph(employee.designation, value_style)],
        [Paragraph('<b>Mobile:</b>', label_style), Paragraph(nda_document.mobile, value_style),
         Paragraph('<b>Joining Date:</b>', label_style), Paragraph(str(employee.joining_date), value_style)],
        [Paragraph('<b>Aadhaar No:</b>', label_style), Paragraph(nda_document.aadhaar_number, value_style),
         Paragraph('<b>Date Signed:</b>', label_style), Paragraph(str(nda_document.signed_date), value_style)],
    ]

    info_table = Table(info_data, colWidths=[38 * mm, 55 * mm, 38 * mm, 55 * mm])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f0f4ff')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#c7d2fe')),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 10))

    # Address
    elements.append(Paragraph('<b>Address:</b>', label_style))
    elements.append(Paragraph(nda_document.address, value_style))
    elements.append(Paragraph(f'<b>Emergency Contact:</b> {nda_document.emergency_contact}', value_style))
    elements.append(HRFlowable(width='100%', thickness=0.5, color=colors.grey, spaceAfter=8, spaceBefore=8))

    # NDA content
    from apps.ndas.nda_content import PERMANENT_NDA, CONTRACT_NDA
    nda_text = PERMANENT_NDA if employee.employee_type == 'permanent' else CONTRACT_NDA

    elements.append(Paragraph('TERMS AND CONDITIONS', heading_style))
    for line in nda_text.strip().split('\n'):
        line = line.strip()
        if not line:
            elements.append(Spacer(1, 4))
        elif line.isupper() or (len(line) < 60 and line[0].isdigit()):
            elements.append(Paragraph(line, heading_style))
        else:
            elements.append(Paragraph(line, body_style))

    elements.append(HRFlowable(width='100%', thickness=0.5, color=colors.grey, spaceAfter=12, spaceBefore=12))

    # Signature section
    elements.append(Paragraph('ACKNOWLEDGMENT & SIGNATURE', heading_style))

    sig_data = [[
        Paragraph('Employee Name:', label_style),
        Paragraph(nda_document.full_name, value_style),
    ], [
        Paragraph('Date:', label_style),
        Paragraph(str(nda_document.signed_date), value_style),
    ]]

    # Try to embed signature image
    sig_cell_content = Paragraph('[Digital Signature on File]', value_style)
    if nda_document.signature:
        try:
            sig_b64 = nda_document.signature
            if ',' in sig_b64:
                sig_b64 = sig_b64.split(',')[1]
            sig_bytes = base64.b64decode(sig_b64)
            sig_img = Image(BytesIO(sig_bytes), width=60 * mm, height=20 * mm)
            sig_cell_content = sig_img
        except Exception:
            pass

    sig_data.append([Paragraph('Digital Signature:', label_style), sig_cell_content])

    sig_table = Table(sig_data, colWidths=[50 * mm, 126 * mm])
    sig_table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#c7d2fe')),
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f4ff')),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    elements.append(sig_table)

    elements.append(Spacer(1, 16))
    elements.append(HRFlowable(width='100%', thickness=1, color=colors.HexColor('#1e40af'), spaceAfter=6))
    elements.append(Paragraph(
        'This document was generated electronically by Zayron Infotech Pvt. Ltd. Onboarding System.',
        ParagraphStyle('Footer', parent=styles['Normal'], fontSize=7, textColor=colors.grey, alignment=TA_CENTER)
    ))
    elements.append(Paragraph(
        f'Generated on: {datetime.now().strftime("%d %B %Y at %I:%M %p")}',
        ParagraphStyle('Footer2', parent=styles['Normal'], fontSize=7, textColor=colors.grey, alignment=TA_CENTER)
    ))

    doc.build(elements)
    buf.seek(0)
    return buf
