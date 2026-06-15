import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  path: string;
  ogType?: string;
  ogImage?: string;
  schema?: Record<string, unknown>;
}

const SITE_NAME = 'Coding With God Technologies';
const SITE_URL = 'https://codingwithgod.com';
const DEFAULT_OG_IMAGE = '/og-image.png';

const pagesSchema: Record<string, Record<string, unknown>> = {
  '/': {
    '@type': 'WebPage',
    name: 'Custom Software Development & Full-Stack Engineering',
    description:
      'Premium software development agency specializing in high-performance web applications, resilient cloud systems, and custom SaaS solutions. Expert React & Node.js development.',
  },
  '/about': {
    '@type': 'AboutPage',
    name: 'About Our Software Engineering Agency — Technical Excellence',
    description:
      'Learn about Coding With God, a software development company driven by technical craft and ethical integrity. We build scalable, secure, and purpose-driven applications.',
  },
  '/products': {
    '@type': 'CollectionPage',
    name: 'Custom SaaS Products & Software Solutions',
    description:
      'Explore our enterprise software products including the Watchman attendance system. Custom software engineering for security, analytics, and cloud infrastructure.',
  },
  '/contact': {
    '@type': 'ContactPage',
    name: 'Hire Software Developers — Start Your Project Today',
    description:
      'Contact our expert software engineering team for full-stack development, cloud architecture, or database optimization. Free technical consulting and project estimates.',
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
    logo: `${SITE_URL}/logo.svg`,
    description:
      'Premium software development company building responsive web applications, secure backends, and optimized database systems.',
    foundingDate: '2026',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+256766145678',
      contactType: 'sales',
      email: 'cwgtechnologies@gmail.com',
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
      <meta property="og:image:secure_url" content={`${SITE_URL}${ogImage}`} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={`${SITE_NAME} Logo`} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE_URL}${ogImage}`} />
      <meta name="twitter:image:alt" content={`${SITE_NAME} Logo`} />

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
