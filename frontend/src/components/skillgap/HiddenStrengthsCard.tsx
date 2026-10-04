import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface HiddenStrengthsCardProps {
  currentRole?: string
  skills?: string[]
}

export default function HiddenStrengthsCard({
  currentRole = 'Java Developer',
  skills = ['Java', 'Spring Boot', 'MySQL', 'REST APIs'],
}: HiddenStrengthsCardProps) {
  const { t, i18n } = useTranslation()
  const isHi = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('hi')

  const isReturnerOrJava = skills.some((s) => s.toLowerCase().includes('java'))
  const isGig = skills.some((s) => s.toLowerCase().includes('route') || s.toLowerCase().includes('customer'))
  const isQA = skills.some((s) => s.toLowerCase().includes('qa') || s.toLowerCase().includes('testing'))

  const hiddenStrengths = isGig
    ? isHi
      ? [
          {
            strength: 'रियल-टाइम ऑपरेशनल डिस्पैच',
            crossover: 'टेक ऑपरेशन्स, लॉजिस्टिक्स एनालिटिक्स और सप्लाई चेन डैशबोर्ड्स के लिए अत्यंत उपयोगी और आसानी से ट्रांसफर होने योग्य।',
            target: 'लॉजिस्टिक्स टेक एनालिस्ट',
          },
          {
            strength: 'द्विभाषी फील्ड कम्युनिकेशन',
            crossover: 'भारतीय क्षेत्रीय भाषाओं में एआई चैटबॉट क्वालिटी एश्योरेंस और कस्टमर ऑप्स के लिए सीधा लाभ।',
            target: 'एआई ऑपरेशन्स एसोसिएट',
          },
        ]
      : [
          {
            strength: 'Real-Time Operational Dispatch',
            crossover: 'High transferability to Tech Operations, Logistics Dispatch Analytics, and Supply Chain Dashboards.',
            target: 'Logistics Tech Analyst',
          },
          {
            strength: 'Bilingual Field Communication',
            crossover: 'Direct advantage for Indian Vernacular AI Chatbot Quality Assurance and Customer Success Ops.',
            target: 'AI Operations Associate',
          },
        ]
    : isQA
    ? isHi
      ? [
          {
            strength: 'डिफ़ेक्ट रूट-कॉज़ अंतर्ज्ञान',
            crossover: 'गहरा SDLC ज्ञान नए फ्रेशर्स की तुलना में ऑटोमेटेड Playwright/Selenium टेस्ट फ्रेमवर्क निर्माण को 3 गुना तेज करता है।',
            target: 'ऑटोमेशन क्यूए / एसडीईटी',
          },
          {
            strength: 'एजाइल और JIRA वर्कफ़्लो प्रवाह',
            crossover: 'स्क्रम मास्टर और क्वालिटी इंजीनियरिंग टीम लीडरशिप में सहज बदलाव।',
            target: 'लीड क्यूए इंजीनियर',
          },
        ]
      : [
          {
            strength: 'Defect Root-Cause Intuition',
            crossover: 'Deep SDLC domain knowledge makes automated Playwright/Selenium test framework authoring 3x faster than freshers.',
            target: 'Automation QA / SDET',
          },
          {
            strength: 'Agile & JIRA Workflow Fluency',
            crossover: 'Seamless transition into Scrum Master and Quality Engineering team leadership.',
            target: 'Lead QA Engineer',
          },
        ]
    : isReturnerOrJava
    ? isHi
      ? [
          {
            strength: 'ऑब्जेक्ट-ओरिएंटेड और कॉनकरेंसी गहराई',
            crossover: 'जावा मल्टी-थ्रेडिंग अनुभव आसानी से पायथन एसिंक्रोनस पाइपलाइन और हाई-थ्रूपुट एलएलएम सर्विंग सिस्टम में काम आता है।',
            target: 'एआई इंफ्रास्ट्रक्चर इंजीनियर',
          },
          {
            strength: 'रिलेशनल डेटाबेस स्कीमा डिज़ाइन',
            crossover: 'MySQL/PostgreSQL में निपुणता हाइब्रिड सर्च (SQL + वेक्टर सर्च) के क्रियान्वयन को अत्यधिक गति प्रदान करती है।',
            target: 'बैकएंड और डेटा इंजीनियर',
          },
        ]
      : [
          {
            strength: 'Object-Oriented & Concurrency Depth',
            crossover: 'Java multi-threading experience translates seamlessly into Python asynchronous pipeline and high-throughput LLM serving systems.',
            target: 'AI Infrastructure Engineer',
          },
          {
            strength: 'Relational Database Schema Design',
            crossover: 'MySQL/PostgreSQL mastery accelerates Hybrid Search (SQL + Vector Search) implementation.',
            target: 'Backend & Data Engineer',
          },
        ]
    : isHi
    ? [
        {
          strength: 'बुनियादी कंप्यूटर साइंस फंडामेंटल्स',
          crossover: 'एल्गोरिदम और एपीआई डिज़ाइन एक ऐसा मजबूत आधार प्रदान करते हैं जो तेजी से बदलते रुझानों में भी सुरक्षित रहता है।',
          target: 'फुल स्टैक इंजीनियर',
        },
      ]
    : [
        {
          strength: 'Foundational CS Fundamentals',
          crossover: 'Algorithms and API design provide a resilient baseline that outlasts fast-changing frontend/backend trends.',
          target: 'Full Stack Engineer',
        },
      ]

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-indigo-50/60 via-white to-sky-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border border-indigo-100 dark:border-indigo-900/60 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-indigo-900 dark:text-sky-300 font-extrabold text-base">
        <Lightbulb size={20} className="text-[#F26B1D]" />
        <span>{t('skill_gap.hidden_strengths', 'Hidden Strengths & Crossover Accelerators')}</span>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        {isHi
          ? `${currentRole} में आपके अनुभव के वे कौशल जिन्हें भर्तीकर्ता अतिरिक्त लाभ मानते हैं:`
          : `Skills from your background in ${currentRole} that hiring managers value as unfair advantages:`}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {hiddenStrengths.map((hs, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-2 flex flex-col justify-between shadow-2xs"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#0B4F9C] dark:text-sky-300 flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#F26B1D]" /> {hs.strength}
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {hs.crossover}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-slate-500 border-t border-slate-100 dark:border-slate-700/60">
              <span>
                {t('skill_gap.adjacent_move', 'Adjacent Move:')}{' '}
                <span className="text-slate-800 dark:text-slate-200">{hs.target}</span>
              </span>
              <Link to="/path" className="text-[#0B4F9C] dark:text-sky-400 hover:underline flex items-center gap-0.5">
                {t('skill_gap.path', 'Path')} <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
