import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      app_name: 'Punarshuru',
      tagline: 'Detect the disruption. Understand the gap. Find the next move.',
      nav: {
        dashboard: 'Dashboard',
        skill_gap: 'Skill Gap',
        market: 'Market',
        pathways: 'Pathways',
        compensation: 'Compensation',
        passport: 'Passport',
      },
      landing: {
        hero_title: 'Detect the Disruption. Understand the Gap. Find the Next Move.',
        hero_subtitle: 'AI-powered career intelligence for career-break returners, gig workers, laid-off professionals, stagnant employees, and students in India.',
        cta_start: 'Audit My Career (Free)',
        cta_demo: 'Try Demo Personas',
        built_for_bharat: 'Built for India’s Workforce Realities',
        zero_cost: '100% Free Public Courses',
        real_ctc: 'Real Purchasing Power Index',
      },
      onboarding: {
        title: 'Career Intelligence Wizard',
        step1: 'Career Archetype',
        step2: 'Background & Experience',
        step3: 'Skill Taxonomy',
        step4: 'Target Goals & Role',
        analyzing: 'Analysing Career Intelligence Profile...',
      },
      dashboard: {
        title: 'Career Intelligence Dashboard',
        disruption_score: 'Disruption Score Audit',
        risks_strengths: 'Risks & Strengths Breakdown',
        modules: 'Intelligence Deep-Dives',
        next_actions: 'Next 3 High-Impact Actions',
        switch_persona: 'Switch Demo Persona',
      },
      skill_gap: {
        title: 'Skill Gap & Competency Radar',
        have: 'Have Skills',
        partial: 'Partial / Transferable',
        missing: 'Missing Focus',
        hidden_strengths: 'Hidden Strengths & Crossover Accelerators',
      },
      market: {
        title: 'Market Intelligence & Salary Index',
        rising_skills: 'Rising Skills (GenAI & Cloud)',
        declining_skills: 'Declining / Automation Exposure',
        city_salary: 'Salary Benchmarks by City',
      },
      pathways: {
        title: 'Personalized Learning Pathways',
        safe: 'Safe Pathway',
        stretch: 'Stretch Pathway',
        pivot: 'Pivot Pathway',
        free_courses: 'Free SWAYAM / NPTEL Courses',
      },
      compensation: {
        title: 'Real Compensation & City Arbitrage',
        formula: 'Real CTC = (Nominal Salary - Rent - Commute) / CoL Index',
        compare_offers: 'Multi-Offer Comparison',
        five_year: '5-Year Wealth Growth Projection',
      },
      passport: {
        title: 'AI Talent Passport & QR Credential',
        verified: 'Cryptographically Verified',
        evidence: 'Verified Proof of Work',
        share: 'Share Credential',
      },
      health: {
        status_ok: 'System Online',
        status_error: 'System Offline',
      },
      common: {
        loading: 'Loading...',
        error: 'Something went wrong',
        retry: 'Try Again',
        lpa: 'LPA',
        per_month: '/month',
        continue: 'Continue',
        previous: 'Previous',
      },
    },
  },
  hi: {
    translation: {
      app_name: 'पुनःशुरू',
      tagline: 'बाधा को पहचानें। अंतर समझें। अगला कदम खोजें।',
      nav: {
        dashboard: 'डैशबोर्ड',
        skill_gap: 'स्किल गैप',
        market: 'बाज़ार रुझान',
        pathways: 'कैरियर मार्ग',
        compensation: 'वास्तविक आय',
        passport: 'टैलेंट पासपोर्ट',
      },
      landing: {
        hero_title: 'बाधा को पहचानें। अंतर समझें। अगला कदम खोजें।',
        hero_subtitle: 'करियर ब्रेक, गिग वर्कर्स, छंटनी प्रभावित और कॉलेज छात्रों के लिए AI करियर इंटेलिजेंस।',
        cta_start: 'कैरियर ऑडिट करें (निःशुल्क)',
        cta_demo: 'डेमो देखें (5 प्रोफाइल्स)',
        built_for_bharat: 'भारत 2.0 की आवश्यकताओं के अनुरूप',
        zero_cost: '100% मुफ्त सरकारी कोर्स (NPTEL/SWAYAM)',
        real_ctc: 'वास्तविक क्रय शक्ति सूचकांक',
      },
      onboarding: {
        title: 'कैरियर इंटेलिजेंस विज़ार्ड',
        step1: 'कैरियर प्रकार',
        step2: 'अनुभव और विवरण',
        step3: 'कौशल चयन',
        step4: 'लक्ष्य और भूमिका',
        analyzing: 'कैरियर प्रोफाइल का विश्लेषण हो रहा है...',
      },
      dashboard: {
        title: 'कैरियर इंटेलिजेंस डैशबोर्ड',
        disruption_score: 'कैरियर व्यवधान ऑडिट',
        risks_strengths: 'जोखिम और क्षमताएं',
        modules: 'विस्तृत इंटेलिजेंस मॉड्यूल्स',
        next_actions: 'अगले 3 मुख्य कदम',
        switch_persona: 'डेमो प्रोफाइल बदलें',
      },
      skill_gap: {
        title: 'स्किल गैप और राडार विश्लेषण',
        have: 'उपलब्ध कौशल',
        partial: 'आंशिक / संबंधित',
        missing: 'सीखने योग्य कौशल',
        hidden_strengths: 'छिपी हुई क्षमताएं',
      },
      market: {
        title: 'मार्केट इंटेलिजेंस और सैलरी बेंचमार्क',
        rising_skills: 'बढ़ते कौशल (GenAI & क्लाउड)',
        declining_skills: 'घटते / ऑटोमेशन जोखिम वाले कौशल',
        city_salary: 'शहर अनुसार औसत वेतन',
      },
      pathways: {
        title: 'व्यक्तिगत शिक्षण मार्ग',
        safe: 'सुरक्षित मार्ग (Safe)',
        stretch: 'उच्च वृद्धि मार्ग (Stretch)',
        pivot: 'क्षेत्र परिवर्तन मार्ग (Pivot)',
        free_courses: 'मुफ्त SWAYAM / NPTEL कोर्सेज',
      },
      compensation: {
        title: 'वास्तविक आय और शहर तुलना',
        formula: 'वास्तविक आय = (वेतन - किराया - यात्रा) / जीवन यापन लागत',
        compare_offers: 'जॉब ऑफर्स की तुलना',
        five_year: '5 वर्ष की बचत का अनुमान',
      },
      passport: {
        title: 'AI टैलेंट पासपोर्ट और QR क्रेडेंशियल',
        verified: 'सत्यापित प्रमाण-पत्र',
        evidence: 'प्रमाणित प्रोजेक्ट्स और अनुभव',
        share: 'पासपोर्ट साझा करें',
      },
      health: {
        status_ok: 'सिस्टम चालू',
        status_error: 'सिस्टम बंद',
      },
      common: {
        loading: 'लोड हो रहा है...',
        error: 'कुछ गलत हुआ',
        retry: 'पुनः प्रयास करें',
        lpa: 'LPA',
        per_month: '/माह',
        continue: 'आगे बढ़ें',
        previous: 'पीछे जाएं',
      },
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
