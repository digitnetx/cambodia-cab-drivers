export interface Translations {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    airportTab: string;
    cityTab: string;
    tourTab: string;
    pickupLabel: string;
    pickupPlaceholder: string;
    destLabel: string;
    destPlaceholder: string;
    dateLabel: string;
    timeLabel: string;
    paxLabel: string;
    getQuoteBtn: string;
    whatsAppCta: string;
    telegramCta: string;
    responseSpeed: string;
  };
  airport: {
    badge: string;
    title: string;
    subtitle: string;
    bookBtn: string;
    features: {
      flightTracking: string;
      nameCard: string;
      fixedPrice: string;
      availability: string;
      noHidden: string;
      luggageHelp: string;
    };
  };
  routes: {
    badge: string;
    title: string;
    subtitle: string;
    allFilter: string;
    airportFilter: string;
    intercityFilter: string;
    bookRouteBtn: string;
    sedan: string;
    suv: string;
    van: string;
  };
  vehicles: {
    badge: string;
    title: string;
    subtitle: string;
    passengers: string;
    luggage: string;
    from: string;
    bookThisVehicle: string;
  };
  driver: {
    badge: string;
    title: string;
    greeting: string;
    bio1: string;
    bio2: string;
    chatWhatsApp: string;
    experienceBadge: string;
    licenseBadge: string;
    ratingBadge: string;
    trustedBy: string;
  };
  sareth: {
    badge: string;
    title: string;
    greeting: string;
    bio: string;
    experienceBadge: string;
    licenseBadge: string;
    ratingBadge: string;
    trustedBy: string;
  };
  whyDirect: {
    badge: string;
    title: string;
    subtitle: string;
    reason1Title: string;
    reason1Desc: string;
    reason2Title: string;
    reason2Desc: string;
    reason3Title: string;
    reason3Desc: string;
    reason4Title: string;
    reason4Desc: string;
    reason5Title: string;
    reason5Desc: string;
    reason6Title: string;
    reason6Desc: string;
    benefits: Array<{ title: string; desc: string }>;
  };
  reviews: {
    badge: string;
    title: string;
    subtitle: string;
    ratingText: string;
    readAll: string;
    bookDirect: string;
  };
  cta: {
    title: string;
    subtitle: string;
    bookRide: string;
    chatWhatsApp: string;
  };
  nav: {
    home: string;
    airportTransfers: string;
    routes: string;
    popularRoutes: string;
    vehicles: string;
    tours: string;
    destinations: string;
    meetSareth: string;
    aboutDriver: string;
    book: string;
    bookRide: string;
    contact: string;
  };
  mobileBar: {
    home: string;
    routes: string;
    book: string;
    whatsapp: string;
  };
}

export const translations: Record<'en' | 'km', Translations> = {
  en: {
    hero: {
      badge: 'Private Taxi & Driver Service in Cambodia',
      title: 'Private Taxi & Driver Service in Cambodia',
      subtitle: 'Airport Transfers • Phnom Penh • Siem Reap • Sihanoukville • Private Tours',
      airportTab: '✈️ Airport Transfer',
      cityTab: '🚗 City Transfer',
      tourTab: '🗺️ Private Tour',
      pickupLabel: 'Pickup Location',
      pickupPlaceholder: 'e.g. Phnom Penh Airport, Hotel...',
      destLabel: 'Destination',
      destPlaceholder: 'e.g. Siem Reap, Hotel, Kep...',
      dateLabel: 'Date',
      timeLabel: 'Time',
      paxLabel: 'Passengers',
      getQuoteBtn: 'GET A QUOTE / BOOK NOW',
      whatsAppCta: 'WhatsApp Direct — Fast Response',
      telegramCta: 'Telegram Direct Chat',
      responseSpeed: '⚡ Direct reply usually within 5–15 minutes',
    },
    airport: {
      badge: 'Cambodia Airport Transfers (#1 Service)',
      title: 'Reliable Cambodia Airport Pickups & Transfers',
      subtitle: 'Door-to-door, 24/7 private transfers with flight tracking and personalized greeting terminal pickup across all Cambodian airports.',
      bookBtn: 'Book Airport Transfer →',
      features: {
        flightTracking: 'Real-Time Flight Tracking',
        nameCard: 'Name-Card Greeting in Terminal',
        fixedPrice: 'Fixed Transparent Price',
        availability: '24/7 Flight Arrival Pickup',
        noHidden: 'Zero Hidden Tolls or Parking Fees',
        luggageHelp: 'Door-to-Door Luggage Assistance',
      },
    },
    routes: {
      badge: 'Transparent Pricing Matrix',
      title: 'Popular Cambodia Taxi Routes & Pricing',
      subtitle: 'Fixed rates with no hidden fees. All transfers include private AC vehicle, fuel, highway tolls, and cold bottled water.',
      allFilter: 'All Routes',
      airportFilter: 'Airport Transfers',
      intercityFilter: 'Intercity Travel',
      bookRouteBtn: 'Book Route →',
      sedan: 'Sedan (1-3 pax)',
      suv: 'SUV (1-4 pax)',
      van: 'Van (5-10 pax)',
    },
    vehicles: {
      badge: 'Our Modern Fleet',
      title: 'Choose Your Private Vehicle',
      subtitle: 'Clean, modern, air-conditioned vehicles inspected daily for safety and maximum comfort across Cambodian roads.',
      passengers: 'passengers',
      luggage: 'bags',
      from: 'from',
      bookThisVehicle: 'Book This Vehicle →',
    },
    driver: {
      badge: 'Our Professional Fleet',
      title: 'Professional English-Speaking Tourist Drivers',
      greeting: 'Welcome to Cambodia Taxi Cab!',
      bio1: 'We are a dedicated team of professional, licensed, and English-speaking private drivers based in Cambodia with over 10 years of collective experience chauffeuring international travelers across the Kingdom. Whether you need an airport pickup or an overland journey, we ensure your ride is safe, comfortable, and punctual.',
      bio2: 'Our modern fleet of sedans, SUVs, and executive vans is equipped with powerful air conditioning and verified for safety. We take pride in sharing authentic local insights and flexible stops along your journey.',
      chatWhatsApp: 'Chat on WhatsApp',
      experienceBadge: '10+ Years Safe Driving Record',
      licenseBadge: 'Licensed & Registered Tourist Drivers',
      ratingBadge: '5.0 Star Rated on Google & Reviews',
      trustedBy: 'Trusted by international travelers visiting Cambodia',
    },
    sareth: {
      badge: 'Our Professional Fleet',
      title: 'Professional English-Speaking Tourist Drivers',
      greeting: 'Welcome to Cambodia Taxi Cab!',
      bio: 'We are a dedicated team of professional, licensed, and English-speaking private drivers based in Cambodia with over 10 years of collective experience chauffeuring international travelers across the Kingdom.',
      experienceBadge: '10+ Years Safe Driving Record',
      licenseBadge: 'Licensed & Registered Tourist Drivers',
      ratingBadge: '5.0 Star Rated on Google & Reviews',
      trustedBy: 'Trusted by international travelers visiting Cambodia',
    },
    whyDirect: {
      badge: 'The Direct Booking Advantage',
      title: 'Why Book Direct With Us?',
      subtitle: 'Skip expensive booking platform commissions and communicate directly with our professional driver fleet.',
      reason1Title: 'No Platform Commissions',
      reason1Desc: 'Save 15-25% compared to online travel agencies and hotel tour desks.',
      reason2Title: 'Fixed Transparent Prices',
      reason2Desc: 'No taxi meters running in traffic jams, and zero hidden toll or parking fees.',
      reason3Title: 'Direct WhatsApp Coordination',
      reason3Desc: 'Coordinate directly before arrival for stress-free, seamless pickup.',
      reason4Title: 'Custom Stops Included',
      reason4Desc: 'Stop for coffee, bathroom breaks, or scenic roadside photo spots along the way.',
      reason5Title: 'Pay Driver Directly',
      reason5Desc: 'No advance credit card deposit required. Pay in cash upon reaching your destination.',
      reason6Title: '10+ Years Trust & Safety',
      reason6Desc: 'Trusted by hundreds of international travelers with 5-star Google ratings.',
      benefits: [
        { title: 'No Platform Commissions', desc: 'Save 15-25% compared to online travel agencies and hotel desk markups.' },
        { title: 'Direct WhatsApp Communication', desc: 'Coordinate directly before arrival for smooth coordination.' },
        { title: 'Fixed Transparent Prices', desc: 'No meters running in traffic, no surprise highway toll or parking fees.' },
        { title: 'Local English-Speaking Driver', desc: 'Fluent communication, local recommendations, and authentic travel insights.' },
        { title: 'Private & Clean Vehicle', desc: 'Comfortable air conditioning, cold bottled water, and phone charging ports.' },
        { title: '100% Flexible Itinerary', desc: 'Stop for coffee, bathroom breaks, or scenic photos whenever you wish.' },
      ],
    },
    reviews: {
      badge: 'Traveler Testimonials',
      title: '★★★★★ 5.0 Google Reviews',
      subtitle: 'See what international travelers say about their rides and tours with our driver team.',
      ratingText: '5.0 Star Driver Rating on Google',
      readAll: 'Read All Google Reviews →',
      bookDirect: 'Book Directly With Us',
    },
    cta: {
      title: 'Arriving in Cambodia? Let Us Take Care of Your Journey.',
      subtitle: 'Book your private airport transfer, city taxi, or custom tour with our English-speaking drivers today.',
      bookRide: 'BOOK YOUR RIDE NOW',
      chatWhatsApp: 'WhatsApp Direct (+855 16 509 371)',
    },
    nav: {
      home: 'Home',
      airportTransfers: 'Airport Transfers',
      routes: 'Popular Routes',
      popularRoutes: 'Popular Routes',
      vehicles: 'Vehicles',
      tours: 'Tours',
      destinations: 'Destinations',
      meetSareth: 'Driver Fleet',
      aboutDriver: 'Driver Fleet',
      book: 'Book Ride',
      bookRide: 'Book Ride',
      contact: 'Contact',
    },
    mobileBar: {
      home: 'Home',
      routes: 'Routes',
      book: 'Book',
      whatsapp: 'WhatsApp',
    },
  },
  km: {
    hero: {
      badge: 'សេវាកម្មតាក់ស៊ីឯកជន និងអ្នកបើកបរបរទេសនៅកម្ពុជា',
      title: 'សេវាកម្មតាក់ស៊ី និងអ្នកបើកបរឯកជននៅកម្ពុជា',
      subtitle: 'ផ្ទេរព្រលានយន្តហោះ • ភ្នំពេញ • សៀមរាប • ព្រះសីហនុ • ដំណើរកម្សាន្តឯកជន',
      airportTab: '✈️ ព្រលានយន្តហោះ',
      cityTab: '🚗 ធ្វើដំណើរឆ្លងខេត្ត',
      tourTab: '🗺️ ដំណើរកម្សាន្ត',
      pickupLabel: 'ទីតាំងទទួល',
      pickupPlaceholder: 'ឧ. ព្រលានយន្តហោះភ្នំពេញ ឬ សណ្ឋាគារ...',
      destLabel: 'ទិសដៅទៅដល់',
      destPlaceholder: 'ឧ. សៀមរាប, កំពត, កែប...',
      dateLabel: 'កាលបរិច្ឆេទ',
      timeLabel: 'ពេលវេលា',
      paxLabel: 'ចំនួនអ្នកដំណើរ',
      getQuoteBtn: 'ទទួលបានតម្លៃ / កក់ឥឡូវនេះ',
      whatsAppCta: 'ទាក់ទងតាម WhatsApp — ឆ្លើយតបរហ័ស',
      telegramCta: 'ផ្ញើសារតាម Telegram',
      responseSpeed: '⚡ ឆ្លើយតបផ្ទាល់ក្នុងរយៈពេល ៥–១៥ នាទី',
    },
    airport: {
      badge: 'សេវាកម្មផ្ទេរព្រលានយន្តហោះកម្ពុជា (#១)',
      title: 'សេវាទទួល និងជូនដំណើរព្រលានយន្តហោះកម្ពុជា',
      subtitle: 'សេវាកម្មទទួលផ្ទាល់ ២៤ម៉ោង/៧ថ្ងៃ ជាមួយនឹងការតាមដានជើងហោះហើរ និងកាន់ស្លាកឈ្មោះទទួលនៅគ្រប់ព្រលានយន្តហោះ។',
      bookBtn: 'កក់សេវាព្រលានយន្តហោះ →',
      features: {
        flightTracking: 'តាមដានម៉ោងចុះចតជើងហោះហើរផ្ទាល់',
        nameCard: 'កាន់ស្លាកឈ្មោះទទួលក្នុងស្ថានីយ',
        fixedPrice: 'តម្លៃកំណត់ច្បាស់លាស់ គ្មានការបន្ថែម',
        availability: 'ទទួលដំណើរគ្រប់ពេល ២៤/៧',
        noHidden: 'គ្មានការគិតថ្លៃផ្លូវល្បឿនលឿនបន្ថែម',
        luggageHelp: 'ជួយលើកដាក់អីវ៉ាន់ដោយឥតគិតថ្លៃ',
      },
    },
    routes: {
      badge: 'តារាងតម្លៃច្បាស់លាស់',
      title: 'ផ្លូវតាក់ស៊ីពេញនិយមនៅកម្ពុជា និងតម្លៃ',
      subtitle: 'តម្លៃកំណត់ច្បាស់លាស់រួមបញ្ចូលទាំងរថយន្តម៉ាស៊ីនត្រជាក់ ប្រេងឥន្ធនៈ ថ្លៃផ្លូវ និងទឹកសុទ្ធត្រជាក់។',
      allFilter: 'គ្រប់ផ្លូវទាំងអស់',
      airportFilter: 'ព្រលានយន្តហោះ',
      intercityFilter: 'ឆ្លងខេត្ត',
      bookRouteBtn: 'កក់ផ្លូវនេះ →',
      sedan: 'សេដាន (១-៣ នាក់)',
      suv: 'SUV (១-៤ នាក់)',
      van: 'វ៉ាន់ (៥-១០ នាក់)',
    },
    vehicles: {
      badge: 'ប្រភេទរថយន្តទំនើប',
      title: 'ជ្រើសរើសរថយន្តសម្រាប់ដំណើរកម្សាន្តរបស់អ្នក',
      subtitle: 'រថយន្តស្អាត ទំនើប ម៉ាស៊ីនត្រជាក់ត្រជាក់ខ្លាំង ពិនិត្យសុវត្ថិភាពជារៀងរាល់ថ្ងៃ។',
      passengers: 'អ្នកដំណើរ',
      luggage: 'វ៉ាលី',
      from: 'ចាប់ពី',
      bookThisVehicle: 'កក់រថយន្តនេះ →',
    },
    driver: {
      badge: 'ក្រុមអ្នកបើកបរអាជីព',
      title: 'អ្នកបើកបរឯកជនអាជីពនិយាយភាសាអង់គ្លេស',
      greeting: 'សូមស្វាគមន៍មកកាន់ Cambodia Taxi Cab!',
      bio1: 'យើងខ្ញុំជាក្រុមអ្នកបើកបរឯកជនអាជីពនិយាយភាសាអង់គ្លេសនៅកម្ពុជា ដែលមានបទពិសោធន៍ជាង ១០ ឆ្នាំក្នុងការបើកបរជូនភ្ញៀវទេសចរទូទាំងប្រទេសកម្ពុជា។',
      bio2: 'យើងខ្ញុំប្រើប្រាស់រថយន្តទំនើប ស្អាត និងមានម៉ាស៊ីនត្រជាក់ត្រជាក់ខ្លាំង ព្រមទាំងផ្តល់នូវសុវត្ថិភាពខ្ពស់ និងការធ្វើដំណើរទាន់ពេលវេលា។',
      chatWhatsApp: 'ជជែកតាម WhatsApp',
      experienceBadge: 'បទពិសោធន៍បើកបរប្រកបដោយសុវត្ថិភាពជាង ១០ ឆ្នាំ',
      licenseBadge: 'មានប័ណ្ណបើកបរ និងការអនុញ្ញាតត្រឹមត្រូវ',
      ratingBadge: 'ការវាយតម្លៃផ្កាយ ៥.០ នៅលើ Google',
      trustedBy: 'ទទួលបានការជឿទុកចិត្តពីភ្ញៀវទេសចរអន្តរជាតិជុំវិញពិភពលោក',
    },
    sareth: {
      badge: 'ក្រុមអ្នកបើកបរអាជីព',
      title: 'អ្នកបើកបរឯកជនអាជីពនិយាយភាសាអង់គ្លេស',
      greeting: 'សូមស្វាគមន៍មកកាន់ Cambodia Taxi Cab!',
      bio: 'យើងខ្ញុំជាក្រុមអ្នកបើកបរឯកជនអាជីពនិយាយភាសាអង់គ្លេសនៅកម្ពុជា ដែលមានបទពិសោធន៍ជាង ១០ ឆ្នាំក្នុងការបើកបរជូនភ្ញៀវទេសចរទូទាំងប្រទេសកម្ពុជា។',
      experienceBadge: 'បទពិសោធន៍បើកបរប្រកបដោយសុវត្ថិភាពជាង ១០ ឆ្នាំ',
      licenseBadge: 'មានប័ណ្ណបើកបរ និងការអនុញ្ញាតត្រឹមត្រូវ',
      ratingBadge: 'ការវាយតម្លៃផ្កាយ ៥.០ នៅលើ Google',
      trustedBy: 'ទទួលបានការជឿទុកចិត្តពីភ្ញៀវទេសចរអន្តរជាតិជុំវិញពិភពលោក',
    },
    whyDirect: {
      badge: 'អត្ថប្រយោជន៍នៃការកក់ផ្ទាល់',
      title: 'ហេតុអ្វីត្រូវកក់ផ្ទាល់ជាមួយយើងខ្ញុំ?',
      subtitle: 'ជៀសវាងការបង់កម្រៃជើងសារទៅកាន់វេទិកាកក់ និងទាក់ទងផ្ទាល់ជាមួយក្រុមអ្នកបើកបរពិតប្រាកដ។',
      reason1Title: 'មិនមានកម្រៃជើងសារវេទិកា',
      reason1Desc: 'សន្សំសំចៃ ១៥-២៥% បើធៀបនឹងការកក់តាមក្រុមហ៊ុនកណ្តាល ឬសណ្ឋាគារ។',
      reason2Title: 'តម្លៃច្បាស់លាស់ គ្មានការលាក់កំបាំង',
      reason2Desc: 'គ្មានការគិតលុយតាមម៉ែត្រពេលស្ទះចរាចរណ៍ និងគ្មានថ្លៃផ្លូវបន្ថែម។',
      reason3Title: 'ទាក់ទងផ្ទាល់តាម WhatsApp',
      reason3Desc: 'ជជែកពិភាក្សាផ្ទាល់មុនពេលមកដល់យ៉ាងងាយស្រួល។',
      reason4Title: 'ឈប់សម្រាកតាមចិត្តដោយឥតគិតថ្លៃ',
      reason4Desc: 'អាចឈប់សម្រាក ញ៉ាំកាហ្វេ បន្ទប់ទឹក ឬថតរូបតាមចំណង់ចំណូលចិត្ត។',
      reason5Title: 'ទូទាត់ប្រាក់ផ្ទាល់ពេលដល់',
      reason5Desc: 'មិនចាំបាច់កក់ប្រាក់មុនតាមកាតឡើយ។ បង់ប្រាក់សុទ្ធជូនអ្នកបើកបរពេលដល់។',
      reason6Title: 'ទំនុកចិត្ត និងសុវត្ថិភាព ១០+ ឆ្នាំ',
      reason6Desc: 'ទទួលបានការវាយតម្លៃផ្កាយ ៥ ពីភ្ញៀវទេសចរអន្តរជាតិរាប់រយនាក់។',
      benefits: [
        { title: 'មិនមានកម្រៃជើងសារវេទិកា', desc: 'សន្សំសំចៃ ១៥-២៥% បើធៀបនឹងការកក់តាមក្រុមហ៊ុនកណ្តាល។' },
        { title: 'ទាក់ទងផ្ទាល់តាម WhatsApp', desc: 'ជជែកពិភាក្សាផ្ទាល់មុនពេលមកដល់យ៉ាងងាយស្រួល។' },
        { title: 'តម្លៃច្បាស់លាស់', desc: 'គ្មានការគិតថ្លៃលាក់កំបាំង ឬថ្លៃផ្លូវបន្ថែមឡើយ។' },
        { title: 'អ្នកបើកបរចេះភាសាអង់គ្លេស', desc: 'ទំនាក់ទំនងងាយស្រួល ផ្តល់អនុសាសន៍ល្អៗសម្រាប់ដំណើរកម្សាន្ត។' },
        { title: 'រថយន្តស្អាត និងមានផាសុកភាព', desc: 'ម៉ាស៊ីនត្រជាក់ល្អ ទឹកបរិសុទ្ធត្រជាក់ និងកន្លែងសាកថ្មទូរស័ព្ទ។' },
        { title: 'កាលវិភាគបត់បែន ១០០%', desc: 'អាចឈប់សម្រាក ញ៉ាំកាហ្វេ ឬថតរូបតាមចំណង់ចំណូលចិត្ត។' },
      ],
    },
    reviews: {
      badge: 'ការវាយតម្លៃពីភ្ញៀវ',
      title: '★★★★★ 5.0 Google Reviews',
      subtitle: 'មើលមតិកែលម្អពីភ្ញៀវទេសចរអន្តរជាតិដែលបានធ្វើដំណើរជាមួយក្រុមអ្នកបើកបរយើងខ្ញុំ។',
      ratingText: 'ការវាយតម្លៃផ្កាយ ៥.០ លើ Google',
      readAll: 'អានការវាយតម្លៃទាំងអស់ →',
      bookDirect: 'កក់ផ្ទាល់ជាមួយយើងខ្ញុំ',
    },
    cta: {
      title: 'មកដល់កម្ពុជាមែនទេ? ទុកឱ្យយើងខ្ញុំមើលថែដំណើរកម្សាន្តរបស់អ្នក។',
      subtitle: 'កក់សេវាតាក់ស៊ីព្រលានយន្តហោះ ធ្វើដំណើរឆ្លងខេត្ត ឬដំណើរកម្សាន្តឯកជនថ្ងៃនេះ។',
      bookRide: 'កក់ដំណើរកម្សាន្តឥឡូវនេះ',
      chatWhatsApp: 'WhatsApp ផ្ទាល់ (+855 16 509 371)',
    },
    nav: {
      home: 'ទំព័រដើម',
      airportTransfers: 'ព្រលានយន្តហោះ',
      routes: 'ផ្លូវពេញនិយម',
      popularRoutes: 'ផ្លូវពេញនិយម',
      vehicles: 'រថយន្ត',
      tours: 'ដំណើរកម្សាន្ត',
      destinations: 'ទិសដៅទេសចរណ៍',
      meetSareth: 'ក្រុមអ្នកបើកបរ',
      aboutDriver: 'ក្រុមអ្នកបើកបរ',
      book: 'កក់រថយន្ត',
      bookRide: 'កក់រថយន្ត',
      contact: 'ទំនាក់ទំនង',
    },
    mobileBar: {
      home: 'ទំព័រដើម',
      routes: 'ផ្លូវធ្វើដំណើរ',
      book: 'កក់រថយន្ត',
      whatsapp: 'WhatsApp',
    },
  },
};
