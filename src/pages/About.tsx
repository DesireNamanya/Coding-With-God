import React from 'react';
import { Shield, Sparkles, Heart, Compass } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div style={{ paddingTop: '40px' }}>
      {/* Page Header */}
      <section className="container section" style={{ paddingBottom: '40px', textAlign: 'center' }}>
        <div className="animate-fade-in">
          <div className="hero-badge">
            <Compass size={14} />
            <span>Our Mission</span>
          </div>
          <h1 className="text-gradient-primary" style={{ marginBottom: '24px' }}>
            Driven by Purpose, Guided by Faith
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto' }}>
            Coding With God was founded to bridge the gap between technical excellence and ethical software development. We write clean code to solve real-world problems, building software that respects users, protects privacy, and serves with integrity.
          </p>
        </div>
      </section>

      {/* Core Values / Pillars */}
      <section className="container section">
        <div className="section-header">
          <h2 className="text-gradient">Our Core Pillars</h2>
          <p>The foundational principles that guide every single line of code we write and every client relationship we build.</p>
        </div>

        <div className="grid-cols-3">
          {/* Card 1 */}
          <div className="glass-card">
            <div className="icon-box" style={{ color: 'var(--secondary)' }}>
              <Shield size={24} />
            </div>
            <h3 className="card-title">Absolute Integrity</h3>
            <p>
              We operate in full light. No hidden costs, no shortcut implementations, and transparent communication. We value truth above all else in our business operations and engineering decisions.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card">
            <div className="icon-box" style={{ color: 'var(--accent-purple)' }}>
              <Sparkles size={24} />
            </div>
            <h3 className="card-title">Stewardship of Talent</h3>
            <p>
              We view coding as a God-given creative skill. Therefore, we hone our crafts daily, adopting modern tech stacks, type safety, and efficient architectures to present our very best work.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card">
            <div className="icon-box" style={{ color: '#ec4899' }}>
              <Heart size={24} />
            </div>
            <h3 className="card-title">Stewardship of Service</h3>
            <p>
              We measure our achievements by the height of our service. Our team prioritizes projects that empower businesses, non-profits, and communities to succeed in their respective missions.
            </p>
          </div>
        </div>
      </section>

      {/* How We Work (Chronology / Timeline) */}
      <section className="section" style={{ background: 'rgba(90, 6, 22, 0.015)', borderTop: '1px solid rgba(90, 6, 22, 0.06)', borderBottom: '1px solid rgba(90, 6, 22, 0.06)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="text-gradient-cyan">Our Collaborative Process</h2>
            <p>From initial design discussions to production-level deployment, here is how we ensure project success.</p>
          </div>

          <div style={styles.timeline}>
            {/* Timeline Item 1 */}
            <div className="glass-card" style={styles.timelineCard}>
              <div style={styles.timelineHeader}>
                <span style={styles.stepNum}>01</span>
                <h3 style={styles.stepTitle}>Discovery & Strategy</h3>
              </div>
              <p style={{ fontSize: '0.95rem' }}>
                We align on your mission, target users, and functional requirements. We create a thorough architectural plan and choose the optimal tech stack before writing any code.
              </p>
            </div>

            {/* Timeline Item 2 */}
            <div className="glass-card" style={styles.timelineCard}>
              <div style={styles.timelineHeader}>
                <span style={styles.stepNum}>02</span>
                <h3 style={styles.stepTitle}>Iterative Engineering</h3>
              </div>
              <p style={{ fontSize: '0.95rem' }}>
                Our team develops modules utilizing React, TypeScript, and Node.js. We push code iteratively, keeping you updated with demo environments for feedback.
              </p>
            </div>

            {/* Timeline Item 3 */}
            <div className="glass-card" style={styles.timelineCard}>
              <div style={styles.timelineHeader}>
                <span style={styles.stepNum}>03</span>
                <h3 style={styles.stepTitle}>Testing & QA</h3>
              </div>
              <p style={{ fontSize: '0.95rem' }}>
                We write rigorous automated tests and perform manual audits to check load times, accessibility standards, edge cases, and mobile responsiveness.
              </p>
            </div>

            {/* Timeline Item 4 */}
            <div className="glass-card" style={styles.timelineCard}>
              <div style={styles.timelineHeader}>
                <span style={styles.stepNum}>04</span>
                <h3 style={styles.stepTitle}>Launch & Support</h3>
              </div>
              <p style={{ fontSize: '0.95rem' }}>
                We deploy your system securely. Once live, we offer continuous monitoring, database optimization, and software updates to ensure long-term stability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="container section" style={{ textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ fontStyle: 'italic', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: '1.6' }}>
            "For even the Son of Man came not to be served but to serve, and to give his life as a ransom for many."
          </p>
          <span style={{ color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
            Mark 10:45 (The inspiration behind our tagline)
          </span>
        </div>
      </section>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  timeline: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
    marginTop: '40px',
  },
  timelineCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '24px',
  },
  timelineHeader: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
  },
  stepNum: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '1.8rem',
    fontWeight: '800',
    color: 'var(--primary)',
    opacity: 0.8,
  },
  stepTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '1.15rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  }
};

export default About;
