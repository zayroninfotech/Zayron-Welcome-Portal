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
    logo_tag = f'<img src="data:image/png;base64,{logo_b64}" alt="Zayron Infotech" style="height:60px;width:auto;display:block;margin:0 auto 10px;" />' if logo_b64 else ''

    html_body = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#e8edf5;font-family:'Segoe UI',Arial,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#e8edf5;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(30,64,175,0.12);">

        <!-- HEADER -->
        <tr>
          <td style="background:linear-gradient(135deg,#0c2461 0%,#1e40af 55%,#2563eb 100%);padding:36px 30px 30px;text-align:center;">
            {logo_tag}
            <div style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;margin-bottom:4px;">Zayron Infotech Pvt. Ltd.</div>
            <div style="color:#bfdbfe;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;">Employee Onboarding Portal</div>
            <div style="width:50px;height:3px;background:rgba(255,255,255,0.35);border-radius:2px;margin:14px auto 0;"></div>
          </td>
        </tr>

        <!-- GREETING BANNER -->
        <tr>
          <td style="background:#f0f5ff;padding:20px 32px;border-bottom:1px solid #dde8ff;">
            <div style="font-size:19px;font-weight:700;color:#0c2461;">&#128075; Welcome, {employee.name}!</div>
            <div style="font-size:13px;color:#4b5563;margin-top:4px;">We are excited to have you join the Zayron Infotech family.</div>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:30px 32px;">
            <p style="color:#374151;font-size:15px;line-height:1.75;margin:0 0 16px;">
              Dear <strong>{employee.name}</strong>,<br><br>
              Congratulations on joining <strong>Zayron Infotech Pvt. Ltd.</strong> We are delighted to welcome you to our team and look forward to your valuable contributions.
            </p>
            <p style="color:#374151;font-size:15px;line-height:1.75;margin:0 0 24px;">
              To get started, please complete your onboarding process by reviewing and digitally signing your <strong>Non-Disclosure Agreement (NDA)</strong> and submitting your personal details and documents.
            </p>

            <!-- INFO TABLE -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f8ff;border:1px solid #c7d8ff;border-radius:10px;overflow:hidden;margin-bottom:28px;">
              <tr style="background:#1e40af;">
                <td colspan="2" style="padding:10px 18px;color:#ffffff;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Your Employment Details</td>
              </tr>
              <tr style="border-bottom:1px solid #dde8ff;">
                <td style="padding:11px 18px;color:#1e40af;font-weight:600;font-size:13px;width:45%;">&#128188; Department</td>
                <td style="padding:11px 18px;color:#111827;font-size:13px;">{employee.department}</td>
              </tr>
              <tr style="background:#eef3ff;border-bottom:1px solid #dde8ff;">
                <td style="padding:11px 18px;color:#1e40af;font-weight:600;font-size:13px;">&#127891; Designation</td>
                <td style="padding:11px 18px;color:#111827;font-size:13px;">{employee.designation}</td>
              </tr>
              <tr style="border-bottom:1px solid #dde8ff;">
                <td style="padding:11px 18px;color:#1e40af;font-weight:600;font-size:13px;">&#128197; Joining Date</td>
                <td style="padding:11px 18px;color:#111827;font-size:13px;">{employee.joining_date}</td>
              </tr>
              <tr style="background:#eef3ff;">
                <td style="padding:11px 18px;color:#1e40af;font-weight:600;font-size:13px;">&#128100; Employee Type</td>
                <td style="padding:11px 18px;color:#111827;font-size:13px;">{employee.get_employee_type_display()}</td>
              </tr>
            </table>

            <!-- BUTTON -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding:10px 0 28px;">
                  <a href="{onboarding_link}"
                     style="display:inline-block;background:linear-gradient(135deg,#0c2461,#2563eb);color:#ffffff;text-decoration:none;padding:16px 52px;border-radius:10px;font-size:16px;font-weight:700;letter-spacing:0.4px;box-shadow:0 4px 18px rgba(30,64,175,0.4);">
                    &#9654;&nbsp; Complete Onboarding
                  </a>
                </td>
              </tr>
            </table>

            <!-- DIVIDER -->
            <div style="height:1px;background:#e5e7eb;margin:4px 0 24px;"></div>

            <!-- SIGN OFF -->
            <p style="color:#374151;font-size:14px;line-height:1.8;margin:0;">
              If you have any questions, feel free to reach out to us at
              <a href="mailto:info@zayron.in" style="color:#2563eb;text-decoration:none;">info@zayron.in</a>
            </p>
            <p style="color:#374151;font-size:14px;line-height:1.8;margin:16px 0 0;">
              Warm Regards,<br>
              <strong style="color:#0c2461;font-size:15px;">HR Team</strong><br>
              <span style="color:#2563eb;font-weight:600;">Zayron Infotech Pvt. Ltd.</span>
            </p>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#0c2461;padding:20px 32px;text-align:center;">
            <div style="color:#93c5fd;font-size:12px;margin-bottom:6px;">
              &#128231; info@zayron.in &nbsp;|&nbsp; &#127760; www.zayron.in
            </div>
            <div style="color:#3b82f6;font-size:11px;">
              &copy; 2026 Zayron Infotech Pvt. Ltd. All rights reserved.
            </div>
            <div style="color:#1d4ed8;font-size:11px;margin-top:4px;">
              This is an automated email. Please do not reply directly.
            </div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

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
