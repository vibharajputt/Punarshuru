export interface CityCostData {
  city: string
  col_index: number
  rent_1bhk_inr: number
  rent_2bhk_inr: number
  commute_monthly_inr: number
  avg_meal_inr: number
  region?: string
}

export const CITY_COSTS: Record<string, CityCostData> = {
  bengaluru: {
    city: 'Bengaluru',
    col_index: 2.4,
    rent_1bhk_inr: 22000,
    rent_2bhk_inr: 36000,
    commute_monthly_inr: 3500,
    avg_meal_inr: 120,
    region: 'South',
  },
  mumbai: {
    city: 'Mumbai',
    col_index: 2.8,
    rent_1bhk_inr: 28000,
    rent_2bhk_inr: 50000,
    commute_monthly_inr: 2800,
    avg_meal_inr: 150,
    region: 'West',
  },
  delhi: {
    city: 'Delhi',
    col_index: 2.2,
    rent_1bhk_inr: 18000,
    rent_2bhk_inr: 32000,
    commute_monthly_inr: 2200,
    avg_meal_inr: 100,
    region: 'North',
  },
  gurugram: {
    city: 'Gurugram',
    col_index: 2.3,
    rent_1bhk_inr: 20000,
    rent_2bhk_inr: 35000,
    commute_monthly_inr: 3000,
    avg_meal_inr: 130,
    region: 'North',
  },
  hyderabad: {
    city: 'Hyderabad',
    col_index: 2.0,
    rent_1bhk_inr: 16000,
    rent_2bhk_inr: 28000,
    commute_monthly_inr: 2500,
    avg_meal_inr: 100,
    region: 'South',
  },
  pune: {
    city: 'Pune',
    col_index: 1.9,
    rent_1bhk_inr: 15000,
    rent_2bhk_inr: 26000,
    commute_monthly_inr: 2000,
    avg_meal_inr: 90,
    region: 'West',
  },
  chennai: {
    city: 'Chennai',
    col_index: 1.8,
    rent_1bhk_inr: 14000,
    rent_2bhk_inr: 24000,
    commute_monthly_inr: 2000,
    avg_meal_inr: 90,
    region: 'South',
  },
  noida: {
    city: 'Noida',
    col_index: 1.7,
    rent_1bhk_inr: 12000,
    rent_2bhk_inr: 22000,
    commute_monthly_inr: 2500,
    avg_meal_inr: 90,
    region: 'North',
  },
  jaipur: {
    city: 'Jaipur',
    col_index: 1.3,
    rent_1bhk_inr: 9000,
    rent_2bhk_inr: 16000,
    commute_monthly_inr: 1500,
    avg_meal_inr: 70,
    region: 'North',
  },
  lucknow: {
    city: 'Lucknow',
    col_index: 1.2,
    rent_1bhk_inr: 7500,
    rent_2bhk_inr: 13000,
    commute_monthly_inr: 1200,
    avg_meal_inr: 60,
    region: 'North',
  },
  mohali: {
    city: 'Mohali',
    col_index: 1.0,
    rent_1bhk_inr: 6000,
    rent_2bhk_inr: 10000,
    commute_monthly_inr: 1000,
    avg_meal_inr: 55,
    region: 'North',
  },
  ahmedabad: {
    city: 'Ahmedabad',
    col_index: 1.5,
    rent_1bhk_inr: 10000,
    rent_2bhk_inr: 18000,
    commute_monthly_inr: 1500,
    avg_meal_inr: 75,
    region: 'West',
  },
}

export const DEFAULT_CITY_COST: CityCostData = {
  city: 'Bengaluru',
  col_index: 1.5,
  rent_1bhk_inr: 12000,
  rent_2bhk_inr: 20000,
  commute_monthly_inr: 2000,
  avg_meal_inr: 80,
}

/**
 * Calculates Real Purchasing Power Salary:
 * Real CTC = (Nominal Salary - Rent - Commute) / City Cost-of-Living Index
 * 
 * Guarantee: Real CTC is always <= Nominal Salary.
 */
export function calculateRealSalaryLpa(
  nominalSalaryLpa: number | null | undefined,
  cityName: string = 'Bengaluru',
  bhk: number = 1
): number {
  const nominal = Math.max(0, Number(nominalSalaryLpa) || 0)
  if (nominal <= 0) return 0

  const key = (cityName || '').trim().toLowerCase()
  const cityData = CITY_COSTS[key] || DEFAULT_CITY_COST

  const colIndex = Math.max(0.1, cityData.col_index || 1.5)
  const monthlyRent = bhk === 2 ? cityData.rent_2bhk_inr : cityData.rent_1bhk_inr
  const monthlyCommute = cityData.commute_monthly_inr

  const annualRentLpa = (monthlyRent * 12) / 100000
  const annualCommuteLpa = (monthlyCommute * 12) / 100000

  const disposableLpa = Math.max(0, nominal - annualRentLpa - annualCommuteLpa)
  const realLpa = Number((disposableLpa / colIndex).toFixed(1))

  // Invariant: Real CTC is cost-of-living adjusted and must strictly be <= nominal salary
  return Math.min(nominal, realLpa)
}

/**
 * Returns canonical baseline nominal salary for different archetypes when not specified.
 */
export function getDefaultNominalSalaryLpa(userType?: string): number {
  switch (userType) {
    case 'student':
      return 0
    case 'gig':
      return 2.4
    case 'stagnant':
      return 4.5
    case 'laid_off':
    case 'returner':
      return 8.0
    default:
      return 6.0
  }
}
