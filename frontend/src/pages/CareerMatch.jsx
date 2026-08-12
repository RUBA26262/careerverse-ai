import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  RadialLinearScale, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, Filler, Tooltip, Legend
} from 'chart.js'
import { Radar, Bar } from 'react-chartjs-2'
import GlassCard from '../components/GlassCard'
import { api } from '../api'

ChartJS.register(RadialLinearScale, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler, Tooltip, Legend)

const gridColor = 'rgba(255,255,255,0.08)'
const textColor = 'rgba(247,248,252,0.6)'

export default function CareerMatch() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.getCareerMatch()
      .then(setData)
      .catch(() => setError('Complete the assessment first to see your matches.'))
  }, [])

  if (error) {
    return (
      <main className="max-w-lg mx-auto px-6 py-24 text-center">
        <GlassCard className="p-8">
          <p className="text-starlight/70 mb-6">{error}</p>
          <button
            onClick={() => navigate('/assessment')}
            className="focus-ring px-6 py-2.5 rounded-full bg-gradient-to-r from-nebula to-aurora font-medium"
          >
            Take the assessment
          </button>
        </GlassCard>
      </main>
    )
  }

  if (!data) {
    return <main className="max-w-2xl mx-auto px-6 py-24 text-center text-starlight/50 font-mono text-sm">Loading your matches…</main>
  }

  const radarData = {
    labels: data.traits.map((t) => t.label),
    datasets: [{
      label: 'Your profile',
      data: data.traits.map((t) => t.score),
      backgroundColor: 'rgba(108,79,240,0.25)',
      borderColor: '#6C4FF0',
      pointBackgroundColor: '#3AA6FF'
    }]
  }

  const barData = {
    labels: data.matches.map((m) => m.name),
    datasets: [{
      label: 'Match %',
      data: data.matches.map((m) => m.score),
      backgroundColor: data.matches.map((_, i) => i === 0 ? '#3AA6FF' : 'rgba(108,79,240,0.5)'),
      borderRadius: 8
    }]
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold">
        Your Career Match
      </motion.h1>
      <p className="text-starlight/60 mt-2">Based on your assessment, here's what fits — and why.</p>

      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <GlassCard className="p-6">
          <h2 className="font-display font-semibold mb-4">Your Profile</h2>
          <Radar
            data={radarData}
            options={{
              scales: {
                r: {
                  angleLines: { color: gridColor },
                  grid: { color: gridColor },
                  pointLabels: { color: textColor, font: { size: 11 } },
                  ticks: { display: false, backdropColor: 'transparent' },
                  suggestedMin: 0, suggestedMax: 100
                }
              },
              plugins: { legend: { display: false } }
            }}
          />
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="font-display font-semibold mb-4">Top Career Matches</h2>
          <Bar
            data={barData}
            options={{
              indexAxis: 'y',
              scales: {
                x: { grid: { color: gridColor }, ticks: { color: textColor }, suggestedMax: 100 },
                y: { grid: { display: false }, ticks: { color: textColor } }
              },
              plugins: { legend: { display: false } }
            }}
          />
        </GlassCard>
      </div>

      <h2 className="font-display font-semibold text-xl mt-12 mb-4">Why these fit you</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {data.matches.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
          >
            <GlassCard className="p-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display font-semibold">{m.name}</h3>
                <p className="text-sm text-starlight/60 mt-1">{m.reason}</p>
                <Link to={`/roadmap/${m.id}`} className="text-xs text-aurora hover:underline mt-3 inline-block">
                  View roadmap →
                </Link>
              </div>
              <div className="font-mono text-lg font-semibold text-gradient shrink-0">{m.score}%</div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </main>
  )
}
