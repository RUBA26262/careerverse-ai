import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import GlassCard from '../components/GlassCard'

export default function ComingSoon({ title, description }) {
  return (
    <main className="max-w-lg mx-auto px-6 py-28 text-center">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <GlassCard className="p-10">
          <span className="text-xs font-mono text-comet/80 tracking-widest">MAPPED, NOT BUILT YET</span>
          <h1 className="font-display text-2xl font-bold mt-3 mb-2">{title}</h1>
          <p className="text-starlight/60 text-sm">{description}</p>
          <Link to="/dashboard" className="focus-ring inline-block mt-8 px-6 py-2.5 rounded-full border border-white/15 hover:bg-white/5 transition-colors text-sm">
            Back to dashboard
          </Link>
        </GlassCard>
      </motion.div>
    </main>
  )
}
