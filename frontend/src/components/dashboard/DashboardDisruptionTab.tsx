import DisruptionScoreCard from '@/components/dashboard/DisruptionScoreCard'
import RisksStrengthsCard from '@/components/dashboard/RisksStrengthsCard'
import Skeleton from '@/components/common/Skeleton'
import type { DisruptionResponse, Profile } from '@/types'

interface DashboardDisruptionTabProps {
  profile: Profile | null
  disruptionData: DisruptionResponse | null
  isDisruptLoading: boolean
  currentScore: number
}

export default function DashboardDisruptionTab({
  profile,
  disruptionData,
  isDisruptLoading,
  currentScore,
}: DashboardDisruptionTabProps) {
  return (
    <div className="space-y-6">
      {isDisruptLoading && !disruptionData ? (
        <Skeleton variant="card" className="h-72" />
      ) : (
        <DisruptionScoreCard
          disruption={disruptionData || null}
          score={currentScore}
          userName={profile?.name || 'Priya Sharma'}
          currentRole={profile?.current_role || 'Java Developer'}
        />
      )}

      <RisksStrengthsCard
        risks={disruptionData?.breakdown?.top_risks || profile?.disruption_breakdown?.top_risks || []}
        strengths={disruptionData?.breakdown?.strengths || profile?.disruption_breakdown?.strengths || []}
      />
    </div>
  )
}
