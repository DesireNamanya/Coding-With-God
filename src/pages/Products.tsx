import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Layers, 
  ArrowRight
} from 'lucide-react';
import { SEO } from '../components/SEO';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  techStack: string[];
  features: string[];
}

export const Products: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'saas' | 'infrastructure' | 'security'>('all');

  const products: Product[] = [
    {
      id: 'cms',
      name: 'Watchman',
      category: 'saas',
      description: 'Institutional attendance at the speed of real-time. Browser-native QR scanning, biometric gates, and multi-factor session verification with API-first reporting.',
      icon: <Layers size={24} />,
      techStack: ['Geofencing (GPS/WiFi/Beacon)', 'React', 'Node.js', 'PostgreSQL', 'REST/GraphQL APIs'],
      features: [
        'Multi-factor session verification: geofence + biometric + rotating security codes',
        'Real-time at-risk detection and compliance dashboards',
        'Audit trails and institutional governance workflows',
        'Browser-native QR + PIN fallback — works offline'
      ]
    },
    /*{
      id: 'identity',
      name: 'Aegis Security Gateway',
      category: 'security',
      description: 'An enterprise-grade, identity provider gateway supporting OAuth2/OIDC. Secure your systems with customizable auth policies and token logic.',
      icon: <ShieldCheck size={24} />,
      techStack: ['Node.js', 'TypeScript', 'Redis', 'Docker', 'OIDC Standards'],
      features: [
        'Single Sign-On (SSO) & Social identity federation',
        'Built-in Multi-Factor Authentication (MFA)',
        'JSON Web Token (JWT) verification middlewares',
        'Real-time fraud and anomalous login detection'
      ]
    },
    {
      id: 'analytics',
      name: 'Sanctuary Data Pipeline',
      category: 'saas',
      description: 'A sub-second analytical events collector that transforms raw user interaction data into clear, actionable dashboards and charts.',
      icon: <BarChart3 size={24} />,
      techStack: ['TypeScript', 'ClickHouse', 'Apache Kafka', 'React', 'D3.js'],
      features: [
        'Real-time ingestion of millions of events per hour',
        'Custom visualization dashboard generator',
        'Automated database maintenance & indexing jobs',
        'GDPR and CCPA compliant anonymization tools'
      ]
    },
    {
      id: 'cloud',
      name: 'Eden Cloud Deployer',
      category: 'infrastructure',
      description: 'Automate multi-region cloud infrastructures using Infrastructure as Code (IaC) templates. Safe configurations, self-healing setups, and low costs.',
      icon: <CloudLightning size={24} />,
      techStack: ['Terraform', 'AWS / GCP', 'TypeScript', 'Kubernetes', 'Github Actions'],
      features: [
        'Automatic multi-region database replication setup',
        'Zero-downtime containerized deployments',
        'Integrated resource monitor and budget alerts',
        'Preconfigured secure VPC and firewall configurations'
      ]
    }*/
  ];

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div style={{ paddingTop: '40px' }}>
      <SEO
        title="Custom SaaS Products & Software Solutions"
        description="Explore our enterprise software products including the Watchman attendance system. Custom software engineering for security, analytics, and cloud infrastructure."
        path="/products"
      />
      {/* Page Header */}
      <section className="container section" style={{ paddingBottom: '40px', textAlign: 'center' }}>
        <div className="animate-fade-in">
          <div className="hero-badge">
            <span>Our Catalog</span>
          </div>
          <h1 className="text-gradient-primary" style={{ marginBottom: '24px' }}>
            Products & Custom Solutions
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto' }}>
            Explore our pre-built software suites designed for security, content management, analytics, and DevOps. Need something bespoke? We also engineer custom platforms from the ground up.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="container" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
        <div style={styles.filterContainer}>
          <button 
            onClick={() => setFilter('all')} 
            style={{ ...styles.filterTab, ...(filter === 'all' ? styles.filterTabActive : {}) }}
          >
            All Products
          </button>
          <button 
            onClick={() => setFilter('saas')} 
            style={{ ...styles.filterTab, ...(filter === 'saas' ? styles.filterTabActive : {}) }}
          >
            SaaS & Web
          </button>
          <button 
            onClick={() => setFilter('security')} 
            style={{ ...styles.filterTab, ...(filter === 'security' ? styles.filterTabActive : {}) }}
          >
            Security
          </button>
          <button 
            onClick={() => setFilter('infrastructure')} 
            style={{ ...styles.filterTab, ...(filter === 'infrastructure' ? styles.filterTabActive : {}) }}
          >
            Infrastructure
          </button>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container section" style={{ paddingTop: 0 }}>
        <div style={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <div key={product.id} className="glass-card product-card">
              <div className="icon-box">
                {product.icon}
              </div>
              <h3 className="card-title">{product.name}</h3>
              <p style={{ fontSize: '0.95rem', marginBottom: '16px', flexGrow: 1 }}>
                {product.description}
              </p>

              {/* Tech Stack Badges */}
              <div className="badge-group">
                {product.techStack.map((tech) => (
                  <span key={tech} className="badge-tech">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Features Checklist */}
              <ul className="product-features-list">
                {product.features.map((feat, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={16} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <Link 
                to="/contact" 
                state={{ productInterest: product.name }} 
                className="btn btn-secondary" 
                style={{ width: '100%', marginTop: 'auto' }}
              >
                Inquire About {product.name}
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Request Banner */}
      <section className="container section" style={{ textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(90, 6, 22, 0.04)' }}>
          <h2 className="text-gradient-cyan" style={{ marginBottom: '16px' }}>Need a completely custom solution?</h2>
          <p style={{ maxWidth: '700px', margin: '0 auto 32px' }}>
            Every business is unique. We provide customized software engineering consulting to design, code, and deploy platforms specifically matching your workflow. Let's work together to write your success story.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Request Custom Development
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* FAQ Section for AI Search Optimization */}
      <section className="container section" style={{ paddingTop: '60px' }}>
        <div className="section-header">
          <h2 className="text-gradient">Frequently Asked Questions</h2>
          <p>Common questions about our software development services and process.</p>
        </div>
        <div className="faq-grid" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-card" style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>What type of software do you build?</h3>
            <p>We build full-stack web applications, cloud infrastructure, database systems, and API integrations. Our expertise spans React, Node.js, TypeScript, PostgreSQL, and cloud-native deployments on AWS and GCP.</p>
          </div>
          <div className="glass-card" style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>How long does a typical project take?</h3>
            <p>Timelines vary by scope. A standard MVP can be delivered in 4–8 weeks, while larger enterprise platforms take 3–6 months. We provide a detailed timeline during the Discovery & Strategy phase.</p>
          </div>
          <div className="glass-card" style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Do you offer post-launch support?</h3>
            <p>Yes. We provide ongoing monitoring, database optimization, security updates, and feature enhancements after launch. Our support plans ensure long-term stability and performance.</p>
          </div>
          <div className="glass-card" style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>What is your pricing model?</h3>
            <p>We offer both fixed-price project quotes and hourly consulting. Every engagement starts with a free scope alignment call to understand your needs and provide a transparent estimate with no hidden costs.</p>
          </div>
          <div className="glass-card" style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Can you work with our existing codebase?</h3>
            <p>Absolutely. We regularly audit, refactor, and extend existing codebases. Our team follows clean architecture principles to ensure maintainability regardless of whether we start from scratch or inherit a project.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  filterContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    background: 'rgba(90, 6, 22, 0.03)',
    border: '1px solid rgba(90, 6, 22, 0.08)',
    padding: '6px',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
  },
  filterTab: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.9rem',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    background: 'none',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  filterTabActive: {
    color: 'var(--bg-color)',
    backgroundColor: 'var(--primary)',
    boxShadow: '0 2px 10px rgba(90, 6, 22, 0.25)',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '32px',
  }
};

export default Products;
