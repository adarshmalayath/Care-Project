package com.carehome.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Email service — sends HTML emails to customers when admin replies.
 * Uses async dispatch so it never blocks the HTTP response thread.
 * Gracefully disabled when app.mail.enabled=false or SMTP is unreachable.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:CareHome Services <adarshmalayath2000@gmail.com>}")
    private String fromAddress;

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Sends an HTML reply email to the customer asynchronously.
     * If email sending fails (e.g. no SMTP creds), logs a warning but does not
     * propagate the exception — the admin reply is still saved to the DB.
     *
     * @param toEmail       customer email address
     * @param customerName  customer's full name
     * @param serviceName   the service they enquired about
     * @param adminReply    the reply text from the admin
     */
    @Async
    public void sendReplyEmail(String toEmail, String customerName,
                               String serviceName, String adminReply) {
        if (!mailEnabled) {
            log.info("Email sending is disabled (app.mail.enabled=false). Skipping email to {}", toEmail);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromAddress);
            helper.setTo(toEmail);
            helper.setSubject("Re: Your " + serviceName + " Enquiry — CareHome Services");
            helper.setText(buildHtmlEmail(customerName, serviceName, adminReply), true);

            mailSender.send(message);
            log.info("Reply email sent successfully to {}", toEmail);

        } catch (MessagingException ex) {
            log.warn("Failed to send reply email to {} — {}", toEmail, ex.getMessage());
        } catch (Exception ex) {
            log.warn("Unexpected error sending email to {} — {}", toEmail, ex.getMessage());
        }
    }

    /**
     * Sends a confirmation email to the customer after they submit an enquiry.
     */
    @Async
    public void sendEnquiryConfirmationEmail(String toEmail, String customerName, String serviceName) {
        if (!mailEnabled) return;

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromAddress);
            helper.setTo(toEmail);
            helper.setSubject("Enquiry Received — CareHome Services");
            helper.setText(buildConfirmationEmail(customerName, serviceName), true);

            mailSender.send(message);
            log.info("Confirmation email sent to {}", toEmail);

        } catch (Exception ex) {
            log.warn("Failed to send confirmation email to {} — {}", toEmail, ex.getMessage());
        }
    }

    // ─────────────────────────────────────────────
    // HTML Template Builders
    // ─────────────────────────────────────────────

    private String buildHtmlEmail(String customerName, String serviceName, String adminReply) {
        String firstName = customerName.contains(" ")
                ? customerName.substring(0, customerName.indexOf(' '))
                : customerName;

        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8"/>
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
              <title>CareHome Reply</title>
            </head>
            <body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 20px;">
                <tr><td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

                    <!-- Header -->
                    <tr>
                      <td style="background:linear-gradient(135deg,#1E3A6E 0%%,#2563EB 100%%);padding:36px 40px;">
                        <table width="100%%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td>
                              <div style="display:inline-flex;align-items:center;gap:10px;">
                                <span style="font-size:28px;">💙</span>
                                <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">CareHome Services</span>
                              </div>
                              <p style="color:#93C5FD;margin:8px 0 0;font-size:13px;">Compassionate Care Across the UK</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="padding:40px;">
                        <p style="color:#1E293B;font-size:22px;font-weight:700;margin:0 0 8px;">Hello, %s 👋</p>
                        <p style="color:#64748B;font-size:15px;margin:0 0 28px;line-height:1.6;">
                          Thank you for your enquiry about our <strong style="color:#2563EB;">%s</strong> service.
                          One of our care coordinators has responded to your enquiry:
                        </p>

                        <!-- Reply Box -->
                        <div style="background:#EFF6FF;border-left:4px solid #2563EB;border-radius:8px;padding:24px;margin-bottom:28px;">
                          <p style="color:#1E40AF;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">
                            📨 Message from CareHome Team
                          </p>
                          <p style="color:#1E293B;font-size:15px;line-height:1.8;margin:0;white-space:pre-line;">%s</p>
                        </div>

                        <!-- CTA -->
                        <p style="color:#64748B;font-size:14px;line-height:1.6;margin:0 0 24px;">
                          If you have any further questions or would like to discuss your care needs in more detail,
                          please don't hesitate to get in touch with us.
                        </p>

                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="background:linear-gradient(135deg,#2563EB,#06B6D4);border-radius:8px;padding:14px 28px;">
                              <a href="tel:07721445027"
                                 style="color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">
                                📞 Call Us: 07721 445027
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                      <td style="padding:0 40px;">
                        <hr style="border:none;border-top:1px solid #E2E8F0;margin:0;"/>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding:28px 40px;background:#F8FAFC;">
                        <table width="100%%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td>
                              <p style="color:#94A3B8;font-size:13px;margin:0 0 4px;">CareHome Services</p>
                              <p style="color:#94A3B8;font-size:12px;margin:0;">
                                📧 adarshmalayath2000@gmail.com &nbsp;|&nbsp; 📞 07721 445027
                              </p>
                              <p style="color:#CBD5E1;font-size:11px;margin:12px 0 0;">
                                This email was sent in response to your enquiry. Please do not reply directly
                                to this email — contact us using the details above.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                  </table>
                </td></tr>
              </table>
            </body>
            </html>
            """.formatted(firstName, serviceName, adminReply);
    }

    private String buildConfirmationEmail(String customerName, String serviceName) {
        String firstName = customerName.contains(" ")
                ? customerName.substring(0, customerName.indexOf(' '))
                : customerName;

        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8"/>
              <title>Enquiry Received</title>
            </head>
            <body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 20px;">
                <tr><td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

                    <tr>
                      <td style="background:linear-gradient(135deg,#1E3A6E 0%%,#2563EB 100%%);padding:36px 40px;">
                        <span style="font-size:28px;">💙</span>
                        <span style="color:#ffffff;font-size:22px;font-weight:700;margin-left:10px;">CareHome Services</span>
                        <p style="color:#93C5FD;margin:8px 0 0;font-size:13px;">Compassionate Care Across the UK</p>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:40px;">
                        <p style="color:#1E293B;font-size:22px;font-weight:700;margin:0 0 8px;">Thank you, %s! ✅</p>
                        <p style="color:#64748B;font-size:15px;margin:0 0 24px;line-height:1.6;">
                          We've received your enquiry about our <strong style="color:#2563EB;">%s</strong> service.
                          One of our care coordinators will review your request and get back to you within
                          <strong>24 hours</strong>.
                        </p>
                        <div style="background:#F0FDF4;border-left:4px solid #16A34A;border-radius:8px;padding:20px;margin-bottom:24px;">
                          <p style="color:#15803D;font-size:14px;margin:0;font-weight:600;">
                            ✓ Your enquiry has been successfully submitted
                          </p>
                        </div>
                        <p style="color:#64748B;font-size:14px;margin:0;">
                          Need to speak to us urgently? Call us on
                          <a href="tel:07721445027" style="color:#2563EB;font-weight:700;">07721 445027</a>
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:20px 40px 28px;background:#F8FAFC;">
                        <p style="color:#94A3B8;font-size:12px;margin:0;">
                          📧 adarshmalayath2000@gmail.com &nbsp;|&nbsp; 📞 07721 445027
                        </p>
                      </td>
                    </tr>

                  </table>
                </td></tr>
              </table>
            </body>
            </html>
            """.formatted(firstName, serviceName);
    }
}
