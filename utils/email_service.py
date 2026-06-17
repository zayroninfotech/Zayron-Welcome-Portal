from django.core.mail import EmailMultiAlternatives
from django.conf import settings


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

    html_body = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {{ font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 0; }}
    .container {{ max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }}
    .header {{ background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 40px 30px; text-align: center; }}
    .header h1 {{ color: white; margin: 0; font-size: 24px; }}
    .header p {{ color: #bfdbfe; margin: 8px 0 0; font-size: 14px; }}
    .body {{ padding: 40px 30px; }}
    .body h2 {{ color: #1e40af; margin-top: 0; }}
    .body p {{ color: #374151; line-height: 1.7; }}
    .btn {{ display: inline-block; margin: 24px 0; padding: 14px 36px; background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; }}
    .info-box {{ background: #f0f4ff; border-left: 4px solid #3b82f6; padding: 16px 20px; border-radius: 6px; margin: 20px 0; }}
    .info-box p {{ margin: 4px 0; color: #1e40af; font-size: 14px; }}
    .footer {{ background: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb; }}
    .footer p {{ color: #9ca3af; font-size: 13px; margin: 4px 0; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Zayron Infotech Pvt. Ltd.</h1>
      <p>Employee Onboarding Portal</p>
    </div>
    <div class="body">
      <h2>Welcome, {employee.name}!</h2>
      <p>We are delighted to welcome you to the Zayron Infotech family. We look forward to having you contribute to our team.</p>
      <p>To complete your onboarding process, please click the button below to review and sign your Non-Disclosure Agreement and submit your personal details.</p>
      <div class="info-box">
        <p><strong>Department:</strong> {employee.department}</p>
        <p><strong>Designation:</strong> {employee.designation}</p>
        <p><strong>Joining Date:</strong> {employee.joining_date}</p>
        <p><strong>Employee Type:</strong> {employee.get_employee_type_display()}</p>
      </div>
      <center>
        <a href="{onboarding_link}" class="btn">Complete Onboarding</a>
      </center>
      <p style="font-size:13px; color:#6b7280;">If the button doesn't work, copy and paste this link in your browser:<br>
      <a href="{onboarding_link}" style="color:#3b82f6;">{onboarding_link}</a></p>
      <p>Thank you for joining our team.</p>
      <p>Regards,<br><strong>HR Team</strong><br>Zayron Infotech Pvt. Ltd.</p>
    </div>
    <div class="footer">
      <p>This is an automated email. Please do not reply.</p>
      <p>&copy; 2024 Zayron Infotech Pvt. Ltd. All rights reserved.</p>
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
  <style>
    body {{ font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 0; }}
    .container {{ max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }}
    .header {{ background: linear-gradient(135deg, #059669, #10b981); padding: 40px 30px; text-align: center; }}
    .header h1 {{ color: white; margin: 0; font-size: 24px; }}
    .body {{ padding: 40px 30px; }}
    .body p {{ color: #374151; line-height: 1.7; }}
    .success-box {{ background: #ecfdf5; border-left: 4px solid #10b981; padding: 16px 20px; border-radius: 6px; margin: 20px 0; }}
    .footer {{ background: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb; }}
    .footer p {{ color: #9ca3af; font-size: 13px; margin: 4px 0; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>&#10003; NDA Successfully Signed</h1>
    </div>
    <div class="body">
      <p>Dear <strong>{employee.name}</strong>,</p>
      <div class="success-box">
        <p>&#10003; Your Non-Disclosure Agreement has been successfully signed and recorded.</p>
      </div>
      <p>A copy of your signed NDA is attached to this email for your records. Please keep this for future reference.</p>
      <p>Please continue with the next step of your onboarding process — submitting your personal details and documents.</p>
      <p>If you have any questions, please contact the HR team.</p>
      <p>Regards,<br><strong>HR Team</strong><br>Zayron Infotech Pvt. Ltd.</p>
    </div>
    <div class="footer">
      <p>This is an automated email. Please do not reply.</p>
      <p>&copy; 2024 Zayron Infotech Pvt. Ltd. All rights reserved.</p>
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
