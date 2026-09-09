export const DEFAULT_SEO = {
  title: 'Cambodia Taxi Cab | Private Taxi & Tour Driver Fleet in Cambodia',
  description: 'Welcome to Cambodia Taxi Cab (cambodiataxicab.com). Reliable private transportation around Phnom Penh & across Cambodia: 24/7 airport transfers, custom sightseeing tours, and intercity transfers.',
  siteUrl: 'https://cambodiataxicab.com',
  businessName: 'Cambodia Taxi Cab',
  driverName: 'Cambodia Taxi Cab Team',
  phone: '+855 16 509 371',
  address: '#61, Oknha Chrun Youhak (294), Boeung Keng Kang I, Chamkarmon, Phnom Penh 12302, Cambodia',
};

export function generateStructuredData() {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'TaxiService',
    'name': DEFAULT_SEO.businessName,
    'description': DEFAULT_SEO.description,
    'telephone': DEFAULT_SEO.phone,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '#61, Oknha Chrun Youhak (294)',
      'addressLocality': 'Phnom Penh',
      'addressRegion': 'Chamkarmon',
      'postalCode': '12302',
      'addressCountry': 'KH'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '11.5518',
      'longitude': '104.9282'
    },
    'areaServed': [
      'Phnom Penh',
      'Siem Reap',
      'Battambang',
      'Kampot',
      'Kep',
      'Sihanoukville',
      'Koh Rong'
    ],
    'priceRange': '$$',
    'provider': {
      '@type': 'Organization',
      'name': DEFAULT_SEO.businessName,
    }
  };

  return JSON.stringify(localBusinessSchema);
}
