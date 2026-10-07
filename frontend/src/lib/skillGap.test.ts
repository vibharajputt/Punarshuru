import test from 'node:test'
import assert from 'node:assert/strict'
import { computeSkillGap, clearSkillGapCache } from './skillGap.ts'

test('computeSkillGap returns identical output when called twice with identical inputs', () => {
  clearSkillGapCache()

  const mockProfile = {
    id: 'demo-priya',
    name: 'Priya Sharma',
    user_type: 'returner' as const,
    city: 'Pune',
    current_role: 'Ex-Java Developer (4yr Gap)',
    target_role: 'GenAI Engineer',
    skills_raw: ['Java', 'Spring Boot', 'MySQL', 'REST APIs'],
    experience_years: 5,
    career_gap_years: 4,
    current_salary_lpa: 8.0,
    disruption_score: 72,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  }

  const targetRole = 'GenAI Engineer'

  // Call 1
  const result1 = computeSkillGap(mockProfile as any, targetRole)

  // Call 2
  const result2 = computeSkillGap(mockProfile as any, targetRole)

  // Referential equality (due to memoization)
  assert.strictEqual(result1, result2, 'Calling with identical inputs should return the exact memoized instance')

  // Deep structural equality
  assert.deepStrictEqual(result1, result2, 'Outputs must be structurally identical')
  assert.strictEqual(result1.match_pct, result2.match_pct)
  assert.deepStrictEqual(result1.have_skills, result2.have_skills)
  assert.deepStrictEqual(result1.partial_skills, result2.partial_skills)
  assert.deepStrictEqual(result1.missing_skills, result2.missing_skills)
  assert.deepStrictEqual(result1.role_required_skills, result2.role_required_skills)
  assert.deepStrictEqual(result1.radar, result2.radar)
})

test('computeSkillGap produces identical output without cache when called twice', () => {
  const mockProfile = {
    id: 'demo-arjun',
    name: 'Arjun Mehta',
    user_type: 'laid_off' as const,
    city: 'Bengaluru',
    current_role: 'Manual QA Engineer',
    target_role: 'Automation QA / SDET',
    skills_raw: ['Manual QA', 'JIRA', 'Agile', 'SQL Basics'],
    experience_years: 6,
    career_gap_years: 0.5,
    current_salary_lpa: 8.0,
    disruption_score: 78,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  }

  const targetRole = 'Automation QA / SDET'

  clearSkillGapCache()
  const result1 = computeSkillGap(mockProfile as any, targetRole)

  clearSkillGapCache() // Force re-computation from scratch
  const result2 = computeSkillGap(mockProfile as any, targetRole)

  assert.deepStrictEqual(result1, result2, 'Pure calculation must be 100% deterministic even with cold cache')
  assert.strictEqual(result1.match_pct, result2.match_pct)
  assert.deepStrictEqual(result1.have_skills, result2.have_skills)
  assert.deepStrictEqual(result1.missing_skills, result2.missing_skills)
})
