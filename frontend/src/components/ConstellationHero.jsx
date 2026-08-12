import { motion } from 'framer-motion'

const nodes = [
  { id: 'personality', label: 'Personality', x: 90, y: 70 },
  { id: 'interests', label: 'Interests', x: 480, y: 40 },
  { id: 'skills', label: 'Skills', x: 500, y: 260 },
  { id: 'aptitude', label: 'Aptitude', x: 70, y: 260 }
]
const center = { x: 285, y: 165 }

const lineVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.1, delay: 0.3 + i * 0.15, ease: 'easeInOut' }, opacity: { duration: 0.3, delay: 0.3 + i * 0.15 } }
  })
}

const nodeVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i) => ({
    scale: 1,
    opacity: 1,
    transition: { delay: 0.2 + i * 0.15, type: 'spring', stiffness: 200, damping: 14 }
  })
}

export default function ConstellationHero() {
  return (
    <svg viewBox="0 0 570 330" className="w-full h-auto max-w-xl" role="img" aria-label="Diagram showing personality, interests, skills and aptitude converging into a personalized career map">
      {nodes.map((n, i) => (
        <motion.line
          key={`line-${n.id}`}
          x1={n.x} y1={n.y} x2={center.x} y2={center.y}
          stroke="url(#lineGrad)"
          strokeWidth="1.5"
          custom={i}
          initial="hidden"
          animate="visible"
          variants={lineVariants}
        />
      ))}

      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3AA6FF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6C4FF0" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6FA5" />
          <stop offset="100%" stopColor="#6C4FF0" />
        </radialGradient>
      </defs>

      {nodes.map((n, i) => (
        <motion.g key={n.id} custom={i} initial="hidden" animate="visible" variants={nodeVariants}>
          <circle cx={n.x} cy={n.y} r="5" fill="#3AA6FF" />
          <circle cx={n.x} cy={n.y} r="10" fill="#3AA6FF" opacity="0.15" />
          <text
            x={n.x}
            y={n.x < center.x ? n.y - 16 : n.y - 16}
            textAnchor="middle"
            className="fill-starlight/70"
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.04em' }}
          >
            {n.label}
          </text>
        </motion.g>
      ))}

      <motion.circle
        cx={center.x} cy={center.y} r="26"
        fill="url(#centerGlow)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.1, type: 'spring', stiffness: 180, damping: 12 }}
      />
      <motion.text
        x={center.x} y={center.y + 4}
        textAnchor="middle"
        className="fill-starlight font-display font-semibold"
        style={{ fontSize: '13px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        YOU
      </motion.text>
    </svg>
  )
}
