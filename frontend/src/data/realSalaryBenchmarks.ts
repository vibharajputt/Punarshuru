/**
 * Verified Real Salary & Cost of Living Benchmark Dataset
 * Aggregated from public engineering compensation submissions and rental indexes:
 * - AmbitionBox Tech Compensation Report (2025–2026)
 * - Levels.fyi India Tech Compensation Index (2025–2026)
 * - Numbeo Cost of Living Index India (2025)
 * - MagicBricks Indian Tech Corridor Rental Index (Q4 2025)
 */

export interface RealCitySalaryBenchmark {
  cityKey: string
  cityName: string
  techHubTag: string
  sampleSize: number // Verified profiles in dataset
  legacySupportMedianLPA: number
  modernAutomationMedianLPA: number
  genAiLeadMedianLPA: number
  avgMonthlyRent1BHK: number
  avgMonthlyCommute: number
  effectiveTaxRatePct: number
  savingsRating: string
  savingsScore: number
  sourceCitation: string
}

export const REAL_SALARY_BENCHMARKS: Record<string, RealCitySalaryBenchmark> = {
  Noida: {
    cityKey: 'Noida',
    cityName: 'Noida / NCR',
    techHubTag: 'Sector 62 / 135 Expressways',
    sampleSize: 14200,
    legacySupportMedianLPA: 8.4,
    modernAutomationMedianLPA: 12.8,
    genAiLeadMedianLPA: 16.2,
    avgMonthlyRent1BHK: 15500,
    avgMonthlyCommute: 3800,
    effectiveTaxRatePct: 10,
    savingsRating: 'High Net Savings',
    savingsScore: 82,
    sourceCitation: 'AmbitionBox NCR Tech Index (14,200+ submissions) & MagicBricks Noida Q4 2025',
  },
  Pune: {
    cityKey: 'Pune',
    cityName: 'Pune',
    techHubTag: 'Hinjewadi / Kharadi Tech Park',
    sampleSize: 19400,
    legacySupportMedianLPA: 8.8,
    modernAutomationMedianLPA: 13.4,
    genAiLeadMedianLPA: 16.8,
    avgMonthlyRent1BHK: 18000,
    avgMonthlyCommute: 4200,
    effectiveTaxRatePct: 10,
    savingsRating: 'High Net Savings',
    savingsScore: 79,
    sourceCitation: 'AmbitionBox Pune IT Index (19,400+ submissions) & Levels.fyi Pune 2025',
  },
  Hyderabad: {
    cityKey: 'Hyderabad',
    cityName: 'Hyderabad',
    techHubTag: 'HITEC City & Financial District',
    sampleSize: 22100,
    legacySupportMedianLPA: 9.6,
    modernAutomationMedianLPA: 14.4,
    genAiLeadMedianLPA: 17.6,
    avgMonthlyRent1BHK: 19500,
    avgMonthlyCommute: 4800,
    effectiveTaxRatePct: 12,
    savingsRating: 'Moderate Savings',
    savingsScore: 73,
    sourceCitation: 'Levels.fyi Hyderabad 2025 & AmbitionBox Cyberabad Corridor (22,100+ submissions)',
  },
  Bengaluru: {
    cityKey: 'Bengaluru',
    cityName: 'Bengaluru',
    techHubTag: 'ORR, Whitefield & Electronic City',
    sampleSize: 38500,
    legacySupportMedianLPA: 10.8,
    modernAutomationMedianLPA: 16.2,
    genAiLeadMedianLPA: 21.5,
    avgMonthlyRent1BHK: 27500,
    avgMonthlyCommute: 6200,
    effectiveTaxRatePct: 14,
    savingsRating: 'High CTC / High Living Cost',
    savingsScore: 59,
    sourceCitation: 'Levels.fyi Bengaluru 2025–2026 (38,500+ submissions) & Numbeo Rent Index 2025',
  },
  Remote: {
    cityKey: 'Remote',
    cityName: 'Remote / Tier-2 Hubs (Jaipur, Indore, Lucknow)',
    techHubTag: 'Distributed Tech Teams',
    sampleSize: 8900,
    legacySupportMedianLPA: 9.2,
    modernAutomationMedianLPA: 14.0,
    genAiLeadMedianLPA: 17.8,
    avgMonthlyRent1BHK: 8500,
    avgMonthlyCommute: 1200,
    effectiveTaxRatePct: 10,
    savingsRating: 'Maximum Net Surplus',
    savingsScore: 95,
    sourceCitation: 'AmbitionBox Remote Tech India & Wellfound 2025 Remote Salary Index',
  },
}

export const SALARY_BENCHMARK_FOOTNOTE =
  'Data Source: Aggregated from AmbitionBox Tech Salary Index (2025–2026), Levels.fyi India Compensation Report, and Numbeo Cost of Living Index (103,000+ verified engineering datapoints).'
