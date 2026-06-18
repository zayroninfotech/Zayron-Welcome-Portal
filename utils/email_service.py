import base64
import os
from django.core.mail import EmailMultiAlternatives
from django.conf import settings


def _logo_base64():
    logo_path = os.path.join(settings.BASE_DIR, 'static', 'img', 'logo1.png')
    try:
        with open(logo_path, 'rb') as f:
            return base64.b64encode(f.read()).decode('utf-8')
    except Exception:
        return ''


def send_onboarding_email(employee):
    subject = 'Welcome to Zayron Infotech Pvt. Ltd.'
    onboarding_link = employee.onboarding_link

    text_body = f"""Dear {employee.name},

Welcome to Zayron Infotech Pvt. Ltd.

We are pleased to have you join our organization. To complete your onboarding process, please review and complete the required documents using the link below.

Onboarding Link: {onboarding_link}

Thank you for joining our team.

Regards,
HR Team
Zayron Infotech Pvt. Ltd.
"""

    logo_b64 = _logo_base64()
    logo_tag = f'<img src="data:image/png;base64,{logo_b64}" alt="Zayron Infotech" style="height:56px;width:auto;object-fit:contain;" />' if logo_b64 else '<span style="color:white;font-size:20px;font-weight:700;">Zayron Infotech</span>'

    html_body = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {{ font-family: 'Segoe UI', Arial, sans-serif; background-color: #eef2f7; margin: 0; padding: 0; }}
    .wrapper {{ padding: 40px 16px; background-color: #eef2f7; }}
    .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(30,64,175,0.13); }}
    .header {{ background: linear-gradient(135deg, #0f2d6b 0%, #1e40af 60%, #2563eb 100%); padding: 36px 30px 28px; text-align: center; }}
    .header-divider {{ width: 48px; height: 3px; background: rgba(255,255,255,0.4); border-radius: 2px; margin: 14px auto 0; }}
    .header-sub {{ color: #bfdbfe; margin: 10px 0 0; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase; }}
    .body {{ padding: 36px 32px; }}
    .greeting {{ font-size: 22px; font-weight: 700; color: #0f2d6b; margin: 0 0 6px; }}
    .body p {{ color: #4b5563; line-height: 1.75; margin: 12px 0; font-size: 15px; }}
    .info-box {{ background: #f0f5ff; border: 1px solid #c7d8ff; border-radius: 10px; padding: 18px 22px; margin: 22px 0; }}
    .info-row {{ padding: 7px 0; border-bottom: 1px solid #e0e9ff; font-size: 13px; }}
    .info-row:last-child {{ border-bottom: none; }}
    .info-label {{ color: #1e40af; font-weight: 600; display: inline-block; min-width: 130px; }}
    .info-value {{ color: #111827; }}
    .btn-wrap {{ text-align: center; margin: 28px 0 20px; }}
    .btn {{ display: inline-block; padding: 15px 42px; background: linear-gradient(135deg, #0f2d6b, #2563eb); color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; letter-spacing: 0.3px; box-shadow: 0 4px 16px rgba(30,64,175,0.35); }}
    .divider {{ height: 1px; background: #e5e7eb; margin: 24px 0; }}
    .footer {{ background: #f8faff; padding: 20px 32px; text-align: center; border-top: 1px solid #e0e9ff; }}
    .footer p {{ color: #9ca3af; font-size: 12px; margin: 4px 0; }}
    .footer .brand {{ color: #1e40af; font-weight: 600; font-size: 13px; }}
  </style>
</head>
<body>
  <div class="wrapper">
  <div class="container">
    <div class="header">
      {logo_tag}
      <div class="header-divider"></div>
      <p class="header-sub">Employee Onboarding Portal</p>
    </div>
    <div class="body">
      <div class="greeting">Welcome, {employee.name}! &#128075;</div>
      <p>We are delighted to welcome you to the <strong>Zayron Infotech</strong> family. We look forward to your valuable contribution to our team.</p>
      <p>Please complete your onboarding by reviewing and signing your Non-Disclosure Agreement and submitting your personal details.</p>
      <div class="info-box">
        <div class="info-row"><span class="info-label">&#128188; Department</span><span class="info-value">{employee.department}</span></div>
        <div class="info-row"><span class="info-label">&#127891; Designation</span><span class="info-value">{employee.designation}</span></div>
        <div class="info-row"><span class="info-label">&#128197; Joining Date</span><span class="info-value">{employee.joining_date}</span></div>
        <div class="info-row"><span class="info-label">&#128100; Employee Type</span><span class="info-value">{employee.get_employee_type_display()}</span></div>
      </div>
      <div class="btn-wrap">
        <a href="{onboarding_link}" class="btn">&#9654; Complete Onboarding</a>
      </div>
      <div class="divider"></div>
      <p>Thank you for joining our team. We are excited to have you on board!</p>
      <p>Warm regards,<br><strong>HR Team</strong><br>Zayron Infotech Pvt. Ltd.</p>
    </div>
    <div class="footer">
      <p class="brand">Zayron Infotech Pvt. Ltd.</p>
      <p>This is an automated email. Please do not reply directly.</p>
      <p>&copy; 2026 Zayron Infotech Pvt. Ltd. All rights reserved.</p>
    </div>
  </div>
  </div>
</body>
</html>
"""

    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[employee.email],
    )
    msg.attach_alternative(html_body, 'text/html')
    msg.send()


def send_nda_copy_email(nda_document):
    employee = nda_document.employee
    subject = 'Your NDA Copy – Zayron Infotech Pvt. Ltd.'

    text_body = f"""Dear {employee.name},

Thank you for completing and signing your Non-Disclosure Agreement with Zayron Infotech Pvt. Ltd.

A copy of your signed NDA is attached to this email for your records.

Please proceed to the next step of your onboarding process using your onboarding link.

Regards,
HR Team
Zayron Infotech Pvt. Ltd.
"""

    html_body = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {{ font-family: 'Segoe UI', Arial, sans-serif; background-color: #eef2f7; margin: 0; padding: 0; }}
    .wrapper {{ padding: 40px 16px; background-color: #eef2f7; }}
    .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(30,64,175,0.13); }}
    .header {{ background: linear-gradient(135deg, #065f46 0%, #059669 60%, #10b981 100%); padding: 36px 30px 28px; text-align: center; }}
    .logo-wrap {{ margin-bottom: 14px; }}
    .logo-wrap img {{ height: 56px; width: auto; object-fit: contain; }}
    .header-title {{ color: #ffffff; font-size: 20px; font-weight: 700; margin: 8px 0 0; }}
    .header-divider {{ width: 48px; height: 3px; background: rgba(255,255,255,0.4); border-radius: 2px; margin: 10px auto 0; }}
    .body {{ padding: 36px 32px; }}
    .body p {{ color: #4b5563; line-height: 1.75; margin: 12px 0; font-size: 15px; }}
    .success-box {{ background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 10px; padding: 16px 20px; margin: 20px 0; }}
    .success-box p {{ color: #065f46; font-weight: 600; margin: 0; font-size: 14px; }}
    .divider {{ height: 1px; background: #e5e7eb; margin: 24px 0; }}
    .footer {{ background: #f8faff; padding: 20px 32px; text-align: center; border-top: 1px solid #e0e9ff; }}
    .footer p {{ color: #9ca3af; font-size: 12px; margin: 4px 0; }}
    .footer .brand {{ color: #1e40af; font-weight: 600; font-size: 13px; }}
  </style>
</head>
<body>
  <div class="wrapper">
  <div class="container">
    <div class="header">
      <div class="logo-wrap">
        <img src="{settings.BASE_URL}/static/img/logo1.png" alt="Zayron Infotech" />
      </div>
      <div class="header-title">&#10003; NDA Successfully Signed</div>
      <div class="header-divider"></div>
    </div>
    <div class="body">
      <p>Dear <strong>{employee.name}</strong>,</p>
      <div class="success-box">
        <p>&#10003; Your Non-Disclosure Agreement has been successfully signed and recorded by Zayron Infotech Pvt. Ltd.</p>
      </div>
      <p>A copy of your signed NDA is <strong>attached to this email</strong> for your records. Please keep it for future reference.</p>
      <p>Please continue with the next step of your onboarding process — submitting your personal details and required documents.</p>
      <p>If you have any questions, feel free to reach out to the HR team at <a href="mailto:info@zayron.in" style="color:#2563eb;">info@zayron.in</a>.</p>
      <div class="divider"></div>
      <p>Warm regards,<br><strong>HR Team</strong><br>Zayron Infotech Pvt. Ltd.</p>
    </div>
    <div class="footer">
      <p class="brand">Zayron Infotech Pvt. Ltd.</p>
      <p>This is an automated email. Please do not reply directly.</p>
      <p>&copy; 2026 Zayron Infotech Pvt. Ltd. All rights reserved.</p>
    </div>
  </div>
  </div>
</body>
</html>
"""

    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[employee.email],
    )
    msg.attach_alternative(html_body, 'text/html')

    # Attach PDF if available
    if nda_document.pdf_file:
        try:
            with nda_document.pdf_file.open('rb') as f:
                msg.attach(
                    f'NDA_{employee.name.replace(" ", "_")}.pdf',
                    f.read(),
                    'application/pdf'
                )
        except Exception:
            pass

    msg.send()
