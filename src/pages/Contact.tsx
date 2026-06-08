import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Mail,
  Clock,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { SEO } from "../components/SEO";

interface FormFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  general?: string;
}

export const Contact: React.FC = () => {
  const location = useLocation();

  const [fields, setFields] = useState<FormFields>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Pre-fill fields if navigating from product interest
  useEffect(() => {
    const state = location.state as { productInterest?: string } | null;
    if (state?.productInterest) {
      setFields((prev) => ({
        ...prev,
        subject: `Inquiry about ${state.productInterest}`,
        message: `Hi Coding With God team,\n\nI am interested in learning more about "${state.productInterest}" for my business. Let's discuss details.`,
      }));
    }
  }, [location]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!fields.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!fields.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!fields.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!fields.message.trim()) {
      newErrors.message = "Message is required";
    } else if (fields.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const isProduction = import.meta.env.PROD;
      const apiEndpoint = isProduction
        ? "/api/contact"
        : "http://localhost:5001/api/contact";

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });

      let data: Record<string, unknown>;
      try {
        data = await response.json();
      } catch {
        const text = await response.text();
        data = { message: text || "Server returned an error." };
      }

      if (response.ok && (data as any).success) {
        setIsSuccess(true);
      } else {
        if ((data as any).errors) {
          setErrors((data as any).errors);
        } else {
          setErrors({ general: (data as any).message || "Failed to send message." });
        }
      }
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setErrors({
        general:
          "Could not connect to the server. Please check your internet connection or try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ paddingTop: "40px" }}>
      <SEO
        title="Contact — Start Your Software Project"
        description="Reach out to Coding With God for full-stack development, cloud architecture, database optimization, or technical consulting. Free scope alignment calls. Let's build something meaningful."
        path="/contact"
      />
      <section className="container section">
        <div className="section-header">
          <h1
            className="text-gradient-primary"
            style={{ marginBottom: "24px" }}
          >
            Let's Work Together
          </h1>
          <p>
            Have an idea or a project that needs technical craft? Drop us a
            line. We are here to serve.
          </p>
        </div>

        <div className="contact-grid">
          {/* Left Column: Contact details */}
          <div>
            <h2 className="text-gradient-cyan" style={{ marginBottom: "20px" }}>
              Reach Out
            </h2>
            <p
              style={{
                marginBottom: "40px",
                fontSize: "1.05rem",
                lineHeight: "1.7",
              }}
            >
              Whether you need to outsource full-stack product engineering,
              secure cloud architecture setup, or optimize an existing database
              layer, we offer free scope alignment calls to understand how we
              can help.
            </p>

            <div className="contact-info-list">
              {/* Item 1 */}
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <Mail size={20} />
                </div>
                <div className="contact-info-text">
                  <h4>Call Us or WhatsApp</h4>
                  <p>
                    <a href="tel:+256766145678" style={{ color: 'var(--text-primary)' }}>
                      +256766145678
                    </a>
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <Clock size={20} />
                </div>
                <div className="contact-info-text">
                  <h4>Hours of Service</h4>
                  <p>Monday – Friday: 9:00 AM – 6:00 PM EST</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <MapPin size={20} />
                </div>
                <div className="contact-info-text">
                  <h4>Location</h4>
                  <p>Remote First — Supporting partners globally.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="glass-card">
            {isSuccess ? (
              <div className="form-success-message">
                <div className="success-icon-wrapper">
                  <CheckCircle size={36} />
                </div>
                <h3 className="text-gradient">Message Sent Successfully!</h3>
                <p
                  style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}
                >
                  Thank you, <strong>{fields.name}</strong>. We have received
                  your inquiry regarding <em>"{fields.subject}"</em>. Our team
                  will review the details and get back to you within 24 hours.
                  God bless!
                </p>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setFields({
                      name: "",
                      email: "",
                      subject: "",
                      message: "",
                    });
                  }}
                  className="btn btn-secondary"
                  style={{ marginTop: "16px" }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                {errors.general && (
                  <div
                    className="form-error"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px",
                      background: "rgba(220, 38, 38, 0.08)",
                      borderRadius: "8px",
                      border: "1px solid rgba(220, 38, 38, 0.15)",
                      marginBottom: "8px",
                    }}
                  >
                    <AlertCircle size={16} /> <span>{errors.general}</span>
                  </div>
                )}
                {/* Name */}
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={fields.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="John Doe"
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <span
                      className="form-error"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <AlertCircle size={12} /> {errors.name}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={fields.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="john@example.com"
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <span
                      className="form-error"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <AlertCircle size={12} /> {errors.email}
                    </span>
                  )}
                </div>

                {/* Subject */}
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={fields.subject}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="How can we serve you?"
                    disabled={isSubmitting}
                  />
                  {errors.subject && (
                    <span
                      className="form-error"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <AlertCircle size={12} /> {errors.subject}
                    </span>
                  )}
                </div>

                {/* Message */}
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={fields.message}
                    onChange={handleChange}
                    rows={5}
                    className="form-control"
                    placeholder="Please write details about your software project, timeline, and goals..."
                    disabled={isSubmitting}
                    style={{ resize: "vertical" }}
                  />
                  {errors.message && (
                    <span
                      className="form-error"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <AlertCircle size={12} /> {errors.message}
                    </span>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{ width: "100%", padding: "14px", marginTop: "8px" }}
                >
                  {isSubmitting ? (
                    "Sending Message..."
                  ) : (
                    <>
                      Send Message
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
