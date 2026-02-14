import './globals.css';

export const metadata = {
  metadataBase: new URL('https://bpao-2026.vercel.app'), // Placeholder, should be updated with actual domain
  title: {
    default: 'องค์การบริหารส่วนจังหวัดบุรีรัมย์ | Buriram PAO',
    template: '%s | องค์การบริหารส่วนจังหวัดบุรีรัมย์',
  },
  description: 'เว็บไซต์ทางการขององค์การบริหารส่วนจังหวัดบุรีรัมย์ — บริการประชาชน ข่าวสาร กิจกรรม และข้อมูลการบริหารงาน',
  keywords: 'อบจ.บุรีรัมย์, องค์การบริหารส่วนจังหวัดบุรีรัมย์, Buriram PAO, บุรีรัมย์, งานบริหารส่วนท้องถิ่น, ข่าวบุรีรัมย์',
  authors: [{ name: 'องค์การบริหารส่วนจังหวัดบุรีรัมย์' }],
  creator: 'องค์การบริหารส่วนจังหวัดบุรีรัมย์',
  publisher: 'องค์การบริหารส่วนจังหวัดบุรีรัมย์',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'องค์การบริหารส่วนจังหวัดบุรีรัมย์',
    description: 'เว็บไซต์ทางการขององค์การบริหารส่วนจังหวัดบุรีรัมย์ — บริการประชาชน ข่าวสาร กิจกรรม',
    url: 'https://bpao-2026.vercel.app',
    siteName: 'องค์การบริหารส่วนจังหวัดบุรีรัมย์',
    images: [
      {
        url: 'https://bpao-2026.vercel.app/og-home.png',
        width: 1200,
        height: 630,
        alt: 'องค์การบริหารส่วนจังหวัดบุรีรัมย์',
      },
    ],
    locale: 'th_TH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'องค์การบริหารส่วนจังหวัดบุรีรัมย์',
    description: 'เว็บไซต์ทางการขององค์การบริหารส่วนจังหวัดบุรีรัมย์',
    images: ['https://bpao-2026.vercel.app/og-home.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'GovernmentOrganization',
  name: 'องค์การบริหารส่วนจังหวัดบุรีรัมย์',
  alternateName: 'Buriram PAO',
  url: 'https://bpao-2026.vercel.app',
  logo: 'https://bpao-2026.vercel.app/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+66-44-611144',
    contactType: 'customer service',
    areaServed: 'TH',
    availableLanguage: 'Thai',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ถนนจิระ ตำบลในเมือง',
    addressLocality: 'อำเภอเมืองบุรีรัมย์',
    addressRegion: 'จังหวัดบุรีรัมย์',
    postalCode: '31000',
    addressCountry: 'TH',
  },
  sameAs: [
    'https://www.facebook.com/BuriramPAO',
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
