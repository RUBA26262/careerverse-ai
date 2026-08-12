import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import GlassCard from '../components/GlassCard'
import { api } from '../api'

const starters = [
  "I love maths but hate coding.",
  "I like drawing more than studying.",
  "My parents want me to become a doctor.",
  "I'm weak in Physics — what fits me better?"
]

export default function Mentor() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi, I'm your AI career mentor. Tell me what you enjoy, what you're good at, or what's worrying you about the future — I'll help you think it through." }
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(text) {
    const content = (text ?? input).trim()
    if (!content || busy) return
    const next = [...messages, { role: 'user', content }]
    setMessages(next)
    setInput('')
    setBusy(true)
    try {
      const res = await api.sendMentorMessage(content, next)
      setMessages((m) => [...m, { role: 'assistant', content: res.reply }])
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', content: "I couldn't reach my reasoning engine just now — try again in a moment." }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-2xl font-bold mb-1">AI Career Mentor</h1>
        <p className="text-starlight/60 text-sm mb-6">
          Speak naturally — this isn't a form. (Running on rule-based stub responses until an LLM key is connected.)
        </p>
      </motion.div>

      <GlassCard className="flex flex-col h-[65vh]">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-nebula to-aurora text-white rounded-br-sm'
                    : 'bg-white/5 border border-white/10 rounded-bl-sm'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {busy && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-starlight/50 font-mono">
                thinking…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length < 2 && (
          <div className="px-6 pb-2 flex flex-wrap gap-2">
            {starters.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="focus-ring text-xs px-3 py-1.5 rounded-full border border-white/15 text-starlight/60 hover:text-starlight hover:border-aurora/40 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); send() }}
          className="border-t border-white/10 p-4 flex gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type what's on your mind…"
            className="focus-ring flex-1 bg-white/5 border border-white/15 rounded-full px-4 py-2.5 text-sm"
          />
          <button
            type="submit"
            disabled={busy}
            className="focus-ring px-5 py-2.5 rounded-full bg-gradient-to-r from-nebula to-aurora font-medium text-sm hover:brightness-110 transition-all disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </GlassCard>
    </main>
  )
}
