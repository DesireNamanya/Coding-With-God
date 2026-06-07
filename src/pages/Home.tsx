import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Terminal,
  Cpu,
  Database,
  ArrowRight,
  
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";

export const Home: React.FC = () => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      setMouseOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <header className="hero-section" style={{ position: "relative" }}>
        {/* Floating Parallax Badges - hidden on mobile/tablet via CSS */}
        <div
          className="floating-hero-card"
          style={{
            left: "6%",
            top: "25%",
            transform: `translate3d(${mouseOffset.x * -24}px, ${
              mouseOffset.y * -24
            }px, 0)`,
            transition: "transform 0.15s ease-out",
          }}
        >
          <div className="icon-box">
            <ShieldCheck size={20} />
          </div>
          <div className="floating-hero-card-content">
            <span className="card-tag">Security First</span>
            <span className="card-text">Type-Safe TypeScript</span>
          </div>
        </div>

        <div
          className="floating-hero-card"
          style={{
            right: "6%",
            top: "20%",
            transform: `translate3d(${mouseOffset.x * -36}px, ${
              mouseOffset.y * -36
            }px, 0)`,
            transition: "transform 0.15s ease-out",
          }}
        >
          <div className="icon-box">
            <Cpu size={20} />
          </div>
          <div className="floating-hero-card-content">
            <span className="card-tag">Scale & Performance</span>
            <span className="card-text">High-throughput Node.js</span>
          </div>
        </div>

        <div
          className="floating-hero-card"
          style={{
            left: "10%",
            bottom: "22%",
            transform: `translate3d(${mouseOffset.x * -18}px, ${
              mouseOffset.y * -18
            }px, 0)`,
            transition: "transform 0.15s ease-out",
          }}
        >
          <div className="icon-box">
            <HeartHandshake size={20} />
          </div>
          <div className="floating-hero-card-content">
            <span className="card-tag">Our Motto</span>
            <span className="card-text">Technology that serves</span>
          </div>
        </div>

        {/* Foreground Hero Content */}
        <div
          className="hero-content animate-fade-in"
          style={{
            transform: `translate3d(${mouseOffset.x * 10}px, ${
              mouseOffset.y * 10
            }px, 0)`,
            transition: "transform 0.15s ease-out",
          }}
        >
          <div className="hero-badge">
            <span>Coding With God</span>
          </div>
          <h1 className="hero-title text-gradient-primary">
            Technology That Serves
          </h1>
          <p className="hero-description">
            We engineer high-performance web applications, resilient cloud
            systems, and optimized database solutions. Driven by purpose and
            committed to technical excellence.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary">
              Explore Our Products
              <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Get in Touch
            </Link>
          </div>
        </div>
      </header>

      {/* Featured Services Grid */}
      <section className="section container">
        <div className="section-header">
          <h2 className="text-gradient">Engineered for Impact</h2>
          <p>
            We deliver comprehensive, end-to-end software engineering solutions
            that scale with your mission.
          </p>
        </div>

        <div className="grid-cols-3">
          {/* Card 1 */}
          <div className="glass-card">
            <div className="icon-box">
              <Terminal size={24} />
            </div>
            <h3 className="card-title">Exquisite Frontends</h3>
            <p>
              Stunning, responsive user interfaces built with React and
              TypeScript. Fast load times, smooth micro-animations, and
              unmatched accessibility.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card">
            <div className="icon-box">
              <Cpu size={24} />
            </div>
            <h3 className="card-title">Resilient Backends</h3>
            <p>
              High-throughput Node.js APIs and microservices. Secure,
              containerized server logic that guarantees 99.9% uptime and low
              latency.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card">
            <div className="icon-box">
              <Database size={24} />
            </div>
            <h3 className="card-title">Scalable Data</h3>
            <p>
              Relational and NoSQL database schemas tailored for quick
              read/write actions. Data integrity, encryption at rest, and search
              optimization.
            </p>
          </div>
        </div>
      </section>

      {/* Core Ethos split layout */}
      <section
        className="section"
        style={{
          background: "rgba(255,255,255,0.01)",
          borderTop: "1px solid rgba(255,255,255,0.03)",
          borderBottom: "1px solid rgba(255,255,255,0.03)",
        }}
      >
        <div className="container grid-cols-2">
          <div>
            <h2 className="text-gradient-cyan" style={{ marginBottom: "24px" }}>
              Crafted in Faith, Delivered in Excellence
            </h2>
            <p style={{ fontSize: "1.1rem", marginBottom: "32px" }}>
              We believe technology is more than just tools and commands. It is
              a avenue to serve communities, streamline operations, and bring
              ideas to fruition. We approach software engineering with a
              commitment to clean architecture and absolute integrity.
            </p>
            <Link to="/about" className="btn btn-secondary">
              Learn About Our Ethos
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div className="ethos-item">
              <div className="ethos-number">01</div>
              <div className="ethos-content">
                <h4>Uncompromising Integrity</h4>
                <p>
                  We believe in absolute transparency, clear communication, and
                  delivering exactly what we promise with clean codebases.
                </p>
              </div>
            </div>

            <div className="ethos-item">
              <div className="ethos-number">02</div>
              <div className="ethos-content">
                <h4>Pursuit of Excellence</h4>
                <p>
                  From linting configurations to production load testing, we
                  follow the highest industry standards for software
                  reliability.
                </p>
              </div>
            </div>

            <div className="ethos-item">
              <div className="ethos-number">03</div>
              <div className="ethos-content">
                <h4>A Heart for Service</h4>
                <p>
                  We measure our success not just by KPIs, but by the positive
                  impact our software has on our clients and their end users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section container" style={{ textAlign: "center" }}>
        <div
          className="glass-card"
          style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 40px" }}
        >
          <h2 className="text-gradient" style={{ marginBottom: "16px" }}>
            Ready to build something meaningful?
          </h2>
          <p
            style={{
              maxWidth: "600px",
              margin: "0 auto 32px",
              fontSize: "1.1rem",
            }}
          >
            Let's discuss how we can bring your software vision to life using
            best-in-class frameworks, custom tools, and scalable structures.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Start Your Project
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};
export default Home;
