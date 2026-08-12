import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ConstellationHero from '../components/ConstellationHero'
import GlassCard from '../components/GlassCard'

const stats = [
  { value: '4', label: 'Assessment dimensions' },
  { value: '20+', label: 'Careers mapped' },
  { value: '1', label: 'Roadmap, built for you' }
]

const features = [
  { title: 'AI Career Mentor', desc: 'Talk in plain language about what you love and struggle with — get counsel back, not a form.' },
  { title: 'Psychometric Analysis', desc: 'A Big-Five-inspired read on your personality, interests and learning style, visualized clearly.' },
  { title: 'Career Match Score', desc: 'Your answers become a ranked list of careers, each with a match percentage and a reason.' },
  { title: 'Personalized Roadmap', desc: 'Every matched career unlocks a concrete, ordered path from where you are to where you\'re headed.' }
]

const steps = [
  { n: '01', title: 'Talk to your AI mentor', desc: 'Share what you enjoy, what you\'re good at, and what worries you about the future.' },
  { n: '02', title: 'Take the assessment', desc: 'A short, honest psychometric and interest profile — no right answers.' },
  { n: '03', title: 'See your matches', desc: 'A ranked, visual breakdown of careers that fit who you actually are.' },
  { n: '04', title: 'Get your roadmap', desc: 'A step-by-step plan to move toward your top match, starting today.' }
]

export default function Landing() {
  return (
    <main>
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-mono tracking-widest text-aurora/90 border border-aurora/30 rounded-full px-3 py-1 mb-6">
            BUILT FOR SDG 4 · QUALITY EDUCATION
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            Discover yourself.
            <br />
            <span className="text-gradient">Design your future.</span>
          </h1>
          <p className="mt-6 text-starlight/70 text-lg max-w-md">
            CareerVerse AI reads your personality, interests and skills — through
            real conversation and real assessment — then maps the careers that
            actually fit you.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              to="/signup"
              className="focus-ring px-6 py-3 rounded-full bg-gradient-to-r from-nebula to-aurora font-medium hover:brightness-110 transition-all"
            >
              Get started free
            </Link>
            <a
              href="#how-it-works"
              className="focus-ring px-6 py-3 rounded-full border border-white/15 text-starlight/80 hover:bg-white/5 transition-colors"
            >
              See how it works
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-2xl font-bold text-gradient">{s.value}</div>
                <div className="text-xs text-starlight/50 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <GlassCard className="p-8">
            <ConstellationHero />
          </GlassCard>
        </motion.div>
      </section>

      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="font-display text-3xl font-bold text-center mb-4">How it works</h2>
        <p className="text-center text-starlight/60 mb-14 max-w-lg mx-auto">
          Four steps, no guesswork — each one feeds the next.
        </p>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <GlassCard className="p-6 h-full">
                <div className="font-mono text-aurora/70 text-sm mb-3">{s.n}</div>
                <h3 className="font-display font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-starlight/60 leading-relaxed">{s.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="font-display text-3xl font-bold text-center mb-4">What's inside</h2>
        <p className="text-center text-starlight/60 mb-14 max-w-lg mx-auto">
          The core of CareerVerse — with plenty more mapped out for what's next.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <GlassCard className="p-6 h-full hover:border-aurora/40 transition-colors">
                <h3 className="font-display font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-starlight/60 leading-relaxed">{f.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-4 gap-4 mt-6">
          {['Parent Dashboard', 'Teacher Dashboard', 'Admin Console', 'Career Simulations'].map((label) => (
            <Link
              key={label}
              to={`/${label.toLowerCase().includes('parent') ? 'parent' : label.toLowerCase().includes('teacher') ? 'teacher' : label.toLowerCase().includes('admin') ? 'admin' : 'simulations'}`}
              className="focus-ring"
            >
              <GlassCard className="p-4 text-center text-sm text-starlight/50 border-dashed hover:text-starlight/80 transition-colors">
                {label}
                <div className="text-xs text-comet/70 mt-1 font-mono">coming soon</div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <GlassCard className="p-12">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to map your future?</h2>
          <p className="text-starlight/60 mb-8 max-w-md mx-auto">
            It takes ten minutes to start. Your career map keeps building from there.
          </p>
          <Link
            to="/signup"
            className="focus-ring inline-block px-8 py-3 rounded-full bg-gradient-to-r from-nebula to-aurora font-medium hover:brightness-110 transition-all"
          >
            Create your free account
          </Link>
        </GlassCard>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-starlight/40">
        CareerVerse AI — built for a National Level Hackathon · SDG 4: Quality Education
      </footer>
    </main>
  )
}
