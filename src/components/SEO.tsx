import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  path: string;
  ogType?: string;
  ogImage?: string;
  schema?: Record<string, unknown>;
}

const SITE_NAME = 'Coding With God';
const SITE_URL = 'https://codingwithgod.com';
const DEFAULT_OG_IMAGE = '/og-image.png';

const pagesSchema: Record<string, Record<string, unknown>> = {
  '/': {
    '@type': 'WebPage',
    name: 'Technology That Serves — Software Development',
    description:
      'We engineer high-performance web applications, resilient cloud systems, and optimized database solutions. Type-safe React, Node.js, and cloud-native architecture.',
  },
  '/about': {
    '@type': 'AboutPage',
    name: 'About Coding With God — Driven by Purpose, Guided by Faith',
    description:
      'Founded to bridge technical excellence with ethical software development. Clean architecture, absolute integrity, and technology that serves communities.',
  },
  '/products': {
    '@type': 'CollectionPage',
    name: 'Software Products & Custom Solutions — Coding With God',
    description:
      'Explore Watchman attendance system and custom software engineering. SaaS, security infrastructure, cloud deployment, and bespoke full-stack development.',
  },
  '/contact': {
    '@type': 'ContactPage',
    name: 'Contact Coding With God — Start Your Software Project',
    description:
      'Reach out for full-stack development, cloud architecture, database optimization, or technical consulting. Free scope alignment calls.',
  },
};

export function SEO({ title, description, path, ogType = 'website', ogImage = DEFAULT_OG_IMAGE, schema }: SEOProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;
  const pageSchema = pagesSchema[path] || {};
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description:
      'Premium software development company building responsive web applications, secure backends, and optimized database systems.',
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+256766145678',
      contactType: 'sales',
      email: 'serve@codingwithgod.com',
    },
    sameAs: [
      'https://github.com/DesireNamanya/Coding-With-God',
    ],
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    name: `Breadcrumb: ${title}`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    ].concat(
      path !== '/'
        ? [
            {
              '@type': 'ListItem' as const,
              position: 2,
              name: title,
              item: url,
            },
          ]
        : []
    ),
  };
  const combinedSchema = {
    '@context': 'https://schema.org',
    ...(schema || pageSchema),
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={`${SITE_URL}${ogImage}`} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE_URL}${ogImage}`} />

      <script type="application/ld+json">
        {JSON.stringify(orgSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(combinedSchema)}
      </script>
    </Helmet>
  );
}
