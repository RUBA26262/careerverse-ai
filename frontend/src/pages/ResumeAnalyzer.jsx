import { useState } from 'react'
import { motion } from 'framer-motion'
import GlassCard from '../components/GlassCard'
import { api } from '../api'

const roles = [
  'Software Developer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Business Analyst',
  'Data Scientist',
  'UI/UX Designer'
]

// =====================================================
// SCORE CIRCLE
// =====================================================

function ScoreCircle({ score }) {
  const safeScore = Math.max(
    0,
    Math.min(100, Number(score) || 0)
  )

  const circumference =
    2 * Math.PI * 50

  const offset =
    circumference *
    (1 - safeScore / 100)

  return (
    <div className="relative w-40 h-40 mx-auto">

      <svg
        viewBox="0 0 120 120"
        className="w-full h-full -rotate-90"
      >

        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="10"
        />

        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="url(#resumeScore)"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />

        <defs>

          <linearGradient
            id="resumeScore"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >

            <stop
              offset="0%"
              stopColor="#3AA6FF"
            />

            <stop
              offset="100%"
              stopColor="#6C4FF0"
            />

          </linearGradient>

        </defs>

      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">

        <span className="font-display text-4xl font-bold">
          {safeScore}
        </span>

        <span className="text-xs text-starlight/50">
          / 100
        </span>

      </div>

    </div>
  )
}

// =====================================================
// PROGRESS BAR
// =====================================================

function ProgressBar({
  label,
  value
}) {
  const safeValue = Math.max(
    0,
    Math.min(100, Number(value) || 0)
  )

  return (
    <div>

      <div className="flex justify-between text-sm mb-2">

        <span className="text-starlight/70">
          {label}
        </span>

        <span className="font-semibold">
          {safeValue}%
        </span>

      </div>

      <div className="h-2 rounded-full bg-white/10 overflow-hidden">

        <motion.div
          initial={{
            width: 0
          }}
          animate={{
            width: `${safeValue}%`
          }}
          transition={{
            duration: 0.8
          }}
          className="h-full bg-gradient-to-r from-aurora to-nebula"
        />

      </div>

    </div>
  )
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function ResumeAnalyzer() {

  // ===================================================
  // RESUME STATES
  // ===================================================

  const [file, setFile] =
    useState(null)

  const [targetRole, setTargetRole] =
    useState('Software Developer')

  const [result, setResult] =
    useState(null)

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  // ===================================================
  // JOB MATCH STATES
  // ===================================================

  const [jobDescription, setJobDescription] =
    useState('')

  const [jobMatchResult, setJobMatchResult] =
    useState(null)

  const [jobMatchLoading, setJobMatchLoading] =
    useState(false)

  const [jobMatchError, setJobMatchError] =
    useState('')

  // ===================================================
  // RESUME IMPROVER STATES
  // ===================================================

  const [improveResult, setImproveResult] =
    useState(null)

  const [improveLoading, setImproveLoading] =
    useState(false)

  const [improveError, setImproveError] =
    useState('')

  // ===================================================
  // FILE CHANGE
  // ===================================================

  function handleFileChange(event) {

    const selectedFile =
      event.target.files?.[0]

    setError('')
    setResult(null)

    setJobMatchResult(null)
    setJobMatchError('')

    setImproveResult(null)
    setImproveError('')

    if (!selectedFile) {
      setFile(null)
      return
    }

    if (
      selectedFile.type !==
        'application/pdf' &&
      !selectedFile.name
        .toLowerCase()
        .endsWith('.pdf')
    ) {

      setError(
        'Please upload a PDF resume.'
      )

      setFile(null)
      return
    }

    if (
      selectedFile.size >
      5 * 1024 * 1024
    ) {

      setError(
        'Resume must be smaller than 5 MB.'
      )

      setFile(null)
      return
    }

    setFile(selectedFile)
  }

  // ===================================================
  // ANALYZE RESUME
  // ===================================================

  async function handleAnalyze() {

    if (!file) {

      setError(
        'Please select your PDF resume first.'
      )

      return
    }

    setLoading(true)
    setError('')

    setResult(null)
    setJobMatchResult(null)
    setJobMatchError('')
    setImproveResult(null)
    setImproveError('')

    try {

      const data =
        await api.analyzeResume(
          file,
          targetRole
        )

      setResult(data)

    } catch (err) {

      setError(
        err.message ||
        'Unable to analyze the resume.'
      )

    } finally {

      setLoading(false)

    }
  }

  // ===================================================
  // ANALYZE JOB MATCH
  // ===================================================

  async function handleJobMatch() {

    setJobMatchError('')
    setJobMatchResult(null)

    if (!result) {

      setJobMatchError(
        'Please analyze your resume first.'
      )

      return
    }

    if (
      !jobDescription.trim()
    ) {

      setJobMatchError(
        'Please enter a job description.'
      )

      return
    }

    const resumeText =
      result.resume_text ||
      result.text ||
      result.extracted_text ||
      ''

    if (!resumeText.trim()) {

      setJobMatchError(
        'Resume text was not returned by the analyzer.'
      )

      return
    }

    setJobMatchLoading(true)

    try {

      const data =
        await api.jobMatch(
          resumeText,
          jobDescription,
          targetRole
        )

      setJobMatchResult(data)

    } catch (err) {

      setJobMatchError(
        err.message ||
        'Unable to analyze job match.'
      )

    } finally {

      setJobMatchLoading(false)

    }
  }

  // ===================================================
  // IMPROVE RESUME
  // ===================================================

  async function handleImproveResume() {

    setImproveError('')
    setImproveResult(null)

    if (!result) {

      setImproveError(
        'Please analyze your resume first.'
      )

      return
    }

    const resumeText =
      result.resume_text ||
      result.text ||
      result.extracted_text ||
      ''

    if (!resumeText.trim()) {

      setImproveError(
        'Resume text was not returned by the analyzer.'
      )

      return
    }

    setImproveLoading(true)

    try {

      const data =
        await api.improveResume(
          resumeText,
          jobDescription,
          targetRole
        )

      setImproveResult(data)

    } catch (err) {

      setImproveError(
        err.message ||
        'Unable to improve the resume.'
      )

    } finally {

      setImproveLoading(false)

    }
  }

  // ===================================================
  // COPY
  // ===================================================

  async function copyText(text) {

    if (!text) return

    try {

      await navigator.clipboard.writeText(
        text
      )

    } catch {

      setImproveError(
        'Unable to copy text.'
      )

    }
  }

  // ===================================================
  // PAGE
  // ===================================================

  return (

    <main className="max-w-6xl mx-auto px-6 py-14">

      {/* ===============================================
          HEADER
      =============================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 15
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
      >

        <p className="text-aurora text-sm font-medium uppercase tracking-widest">
          AI Career Tools
        </p>

        <h1 className="font-display text-4xl font-bold mt-2">

          AI Resume{' '}

          <span className="text-gradient">
            Analyzer
          </span>

        </h1>

        <p className="text-starlight/60 mt-3 max-w-2xl">

          Analyze your resume, compare it with a job
          description and improve it with AI.

        </p>

      </motion.div>

      {/* ===============================================
          MAIN GRID
      =============================================== */}

      <div className="grid lg:grid-cols-3 gap-6 mt-10">

        {/* =============================================
            UPLOAD CARD
        ============================================= */}

        <GlassCard className="p-6">

          <h2 className="font-display text-xl font-semibold">
            Analyze your resume
          </h2>

          <p className="text-sm text-starlight/50 mt-2">
            Upload a text-based PDF resume.
          </p>

          {/* TARGET ROLE */}

          <label className="block mt-6">

            <span className="text-sm text-starlight/70">
              Target role
            </span>

            <select
              value={targetRole}
              onChange={(e) =>
                setTargetRole(
                  e.target.value
                )
              }
              className="w-full mt-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-starlight outline-none focus:border-aurora/50"
            >

              {roles.map((role) => (

                <option
                  key={role}
                  value={role}
                  className="bg-ink"
                >
                  {role}
                </option>

              ))}

            </select>

          </label>

          {/* FILE */}

          <label className="block mt-5">

            <span className="text-sm text-starlight/70">
              Resume PDF
            </span>

            <div className="mt-2 border border-dashed border-white/20 rounded-2xl p-6 text-center hover:border-aurora/50 transition-colors">

              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={
                  handleFileChange
                }
                className="w-full text-sm"
              />

              <p className="text-xs text-starlight/40 mt-3">
                Maximum file size: 5 MB
              </p>

            </div>

          </label>

          {/* FILE NAME */}

          {file && (

            <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-4">

              <p className="text-sm font-medium truncate">
                📄 {file.name}
              </p>

              <p className="text-xs text-starlight/40 mt-1">

                {(
                  file.size /
                  1024 /
                  1024
                ).toFixed(2)}{' '}
                MB

              </p>

            </div>

          )}

          {/* ERROR */}

          {error && (

            <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">

              {error}

            </div>

          )}

          {/* BUTTON */}

          <button
            onClick={handleAnalyze}
            disabled={
              loading ||
              !file
            }
            className="w-full mt-6 rounded-xl bg-gradient-to-r from-nebula to-aurora py-3 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all"
          >

            {loading
              ? 'Analyzing resume...'
              : 'Analyze Resume →'}

          </button>

        </GlassCard>

        {/* =============================================
            RESULTS
        ============================================= */}

        {!result ? (

          <GlassCard className="p-8 lg:col-span-2 flex items-center justify-center min-h-[430px]">

            <div className="text-center max-w-md">

              <div className="text-5xl mb-5">
                📄
              </div>

              <h2 className="font-display text-2xl font-semibold">
                Your resume report will appear here
              </h2>

              <p className="text-sm text-starlight/50 mt-3">

                Upload your PDF, choose a target role
                and analyze your resume.

              </p>

            </div>

          </GlassCard>

        ) : (

          <div className="lg:col-span-2 space-y-6">

            {/* =========================================
                ATS SCORE
            ========================================= */}

            <GlassCard className="p-6">

              <div className="grid md:grid-cols-2 gap-8 items-center">

                <div className="text-center">

                  <p className="text-xs uppercase tracking-widest text-starlight/40">
                    ATS Score
                  </p>

                  <div className="mt-3">

                    <ScoreCircle
                      score={
                        result.ats_score
                      }
                    />

                  </div>

                  <p className="text-sm text-starlight/60 mt-2">

                    Target:{' '}

                    {result.target_role ||
                      targetRole}

                  </p>

                </div>

                <div className="space-y-6">

                  <ProgressBar
                    label="Skills"
                    value={
                      result.skill_score
                    }
                  />

                  <ProgressBar
                    label="Resume Sections"
                    value={
                      result.section_score
                    }
                  />

                  <div className="grid grid-cols-2 gap-3">

                    <div className="rounded-xl bg-white/5 p-4">

                      <p className="text-xs text-starlight/40">
                        Pages
                      </p>

                      <p className="text-xl font-semibold mt-1">
                        {result.pages}
                      </p>

                    </div>

                    <div className="rounded-xl bg-white/5 p-4">

                      <p className="text-xs text-starlight/40">
                        Words
                      </p>

                      <p className="text-xl font-semibold mt-1">
                        {result.word_count}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </GlassCard>

            {/* =========================================
                SKILLS
            ========================================= */}

            <div className="grid md:grid-cols-2 gap-6">

              <GlassCard className="p-6">

                <h2 className="font-display font-semibold">
                  Detected Skills
                </h2>

                <div className="flex flex-wrap gap-2 mt-4">

                  {result.skills?.length > 0 ? (

                    result.skills.map(
                      (skill) => (

                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-full bg-aurora/10 border border-aurora/20 text-sm text-aurora"
                        >
                          ✓ {skill}
                        </span>

                      )
                    )

                  ) : (

                    <p className="text-sm text-starlight/50">
                      No known technical skills detected.
                    </p>

                  )}

                </div>

              </GlassCard>

              <GlassCard className="p-6">

                <h2 className="font-display font-semibold">
                  Missing Skills
                </h2>

                <div className="flex flex-wrap gap-2 mt-4">

                  {result.missing_skills?.length > 0 ? (

                    result.missing_skills.map(
                      (skill) => (

                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-full bg-red-400/10 border border-red-400/20 text-sm text-red-200"
                        >
                          + {skill}
                        </span>

                      )
                    )

                  ) : (

                    <p className="text-sm text-aurora">
                      Great! No major role-specific skills are missing.
                    </p>

                  )}

                </div>

              </GlassCard>

            </div>

            {/* =========================================
                CHECKLIST
            ========================================= */}

            <GlassCard className="p-6">

              <h2 className="font-display font-semibold">
                Resume Checklist
              </h2>

              <div className="grid sm:grid-cols-2 gap-3 mt-5">

                {Object.entries(
                  result.sections || {}
                ).map(
                  ([section, present]) => (

                    <div
                      key={section}
                      className="flex items-center gap-3 rounded-xl bg-white/5 p-3"
                    >

                      <span
                        className={
                          present
                            ? 'text-aurora'
                            : 'text-red-300'
                        }
                      >

                        {present
                          ? '✓'
                          : '×'}

                      </span>

                      <span className="text-sm">
                        {section}
                      </span>

                    </div>

                  )
                )}

              </div>

            </GlassCard>

            {/* =========================================
                SUGGESTIONS
            ========================================= */}

            <GlassCard className="p-6">

              <h2 className="font-display font-semibold">
                AI Improvement Suggestions
              </h2>

              <div className="space-y-3 mt-5">

                {result.suggestions?.length > 0 ? (

                  result.suggestions.map(
                    (
                      suggestion,
                      index
                    ) => (

                      <div
                        key={index}
                        className="flex gap-3 rounded-xl bg-white/5 p-4"
                      >

                        <span className="text-aurora">
                          {index + 1}
                        </span>

                        <p className="text-sm text-starlight/70">
                          {suggestion}
                        </p>

                      </div>

                    )
                  )

                ) : (

                  <p className="text-sm text-starlight/50">
                    No additional suggestions.
                  </p>

                )}

              </div>

            </GlassCard>

            {/* =========================================
                JOB DESCRIPTION
            ========================================= */}

            <GlassCard className="p-6">

              <div className="flex items-start gap-3">

                <div className="w-11 h-11 rounded-2xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-xl">
                  🎯
                </div>

                <div>

                  <p className="text-xs uppercase tracking-widest text-purple-300">
                    Job Targeting
                  </p>

                  <h2 className="font-display text-xl font-semibold mt-1">
                    Add Job Description
                  </h2>

                </div>

              </div>

              <p className="text-sm text-starlight/50 mt-4">

                Paste the job description for the position
                you want to apply for.

              </p>

              <textarea
                value={jobDescription}
                onChange={(e) => {
                  setJobDescription(
                    e.target.value
                  )

                  setJobMatchResult(null)
                  setJobMatchError('')
                  setImproveResult(null)
                  setImproveError('')
                }}
                placeholder="Paste the complete job description here..."
                rows={9}
                className="w-full mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-starlight placeholder:text-starlight/30 outline-none focus:border-purple-400/50 resize-none"
              />

              <div className="flex justify-between items-center mt-2">

                <p className="text-xs text-starlight/30">

                  {jobDescription.length} characters

                </p>

                <p className="text-xs text-starlight/30">

                  Include responsibilities and required skills.

                </p>

              </div>

              {/* JOB MATCH BUTTON */}

              <button
                onClick={
                  handleJobMatch
                }
                disabled={
                  jobMatchLoading ||
                  !jobDescription.trim()
                }
                className="w-full mt-5 rounded-xl bg-gradient-to-r from-purple-600 to-nebula py-3 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all"
              >

                {jobMatchLoading
                  ? '🔍 Analyzing Job Match...'
                  : '🔍 Analyze Job Match'}

              </button>

              {/* JOB MATCH ERROR */}

              {jobMatchError && (

                <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">

                  {jobMatchError}

                </div>

              )}

            </GlassCard>

            {/* =========================================
                JOB MATCH RESULT
            ========================================= */}

            {jobMatchResult && (

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
              >

                <GlassCard className="p-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-xs uppercase tracking-widest text-purple-300">
                        AI Job Matching
                      </p>

                      <h2 className="font-display text-2xl font-semibold mt-1">
                        Your Job Match
                      </h2>

                    </div>

                    <div className="text-right">

                      <div className="font-display text-4xl font-bold text-gradient">

                        {jobMatchResult.match_score ??
                          jobMatchResult.job_match_score ??
                          0}%

                      </div>

                      <p className="text-xs text-starlight/40">
                        Match Score
                      </p>

                    </div>

                  </div>

                  {/* MATCHED + MISSING */}

                  <div className="grid md:grid-cols-2 gap-6 mt-7">

                    {/* MATCHED */}

                    <div>

                      <h3 className="font-semibold text-aurora">
                        ✅ Matching Skills
                      </h3>

                      <div className="flex flex-wrap gap-2 mt-4">

                        {(
                          jobMatchResult.matched_skills ||
                          jobMatchResult.matching_skills ||
                          []
                        ).length > 0 ? (

                          (
                            jobMatchResult.matched_skills ||
                            jobMatchResult.matching_skills ||
                            []
                          ).map(
                            (skill) => (

                              <span
                                key={skill}
                                className="px-3 py-1.5 rounded-full bg-aurora/10 border border-aurora/20 text-sm text-aurora"
                              >
                                ✓ {skill}
                              </span>

                            )
                          )

                        ) : (

                          <p className="text-sm text-starlight/40">
                            No matching skills detected.
                          </p>

                        )}

                      </div>

                    </div>

                    {/* MISSING */}

                    <div>

                      <h3 className="font-semibold text-red-300">
                        ❌ Missing Skills
                      </h3>

                      <div className="flex flex-wrap gap-2 mt-4">

                        {(
                          jobMatchResult.missing_skills ||
                          []
                        ).length > 0 ? (

                          (
                            jobMatchResult.missing_skills ||
                            []
                          ).map(
                            (skill) => (

                              <span
                                key={skill}
                                className="px-3 py-1.5 rounded-full bg-red-400/10 border border-red-400/20 text-sm text-red-200"
                              >
                                + {skill}
                              </span>

                            )
                          )

                        ) : (

                          <p className="text-sm text-aurora">
                            Excellent! No major missing skills.
                          </p>

                        )}

                      </div>

                    </div>

                  </div>

                  {/* RECOMMENDATIONS */}

                  {(
                    jobMatchResult.recommendations ||
                    []
                  ).length > 0 && (

                    <div className="mt-7">

                      <h3 className="font-display font-semibold">
                        💡 Recommendations
                      </h3>

                      <div className="space-y-3 mt-4">

                        {jobMatchResult.recommendations.map(
                          (
                            recommendation,
                            index
                          ) => (

                            <div
                              key={index}
                              className="flex gap-3 rounded-xl bg-white/5 p-4"
                            >

                              <span className="text-purple-300 font-semibold">
                                {index + 1}
                              </span>

                              <p className="text-sm text-starlight/65 leading-6">
                                {recommendation}
                              </p>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  )}

                  {/* IMPROVE BUTTON */}

                  <div className="mt-7 pt-6 border-t border-white/10">

                    <p className="text-sm text-starlight/50 mb-4">

                      Ready to optimize your resume for
                      this position?

                    </p>

                    <button
                      onClick={
                        handleImproveResume
                      }
                      disabled={
                        improveLoading
                      }
                      className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 py-3 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all"
                    >

                      {improveLoading
                        ? '✨ Improving Resume...'
                        : '✨ Improve My Resume'}

                    </button>

                  </div>

                </GlassCard>

              </motion.div>

            )}

            {/* =========================================
                IMPROVER ERROR
            ========================================= */}

            {improveError && (

              <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">

                {improveError}

              </div>

            )}

            {/* =========================================
                IMPROVEMENT RESULT
            ========================================= */}

            {improveResult && (

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                className="space-y-6"
              >

                {/* HEADER */}

                <GlassCard className="p-6">

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-2xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-xl">
                      ✨
                    </div>

                    <div>

                      <p className="text-xs uppercase tracking-widest text-purple-300">
                        AI Resume Improvement
                      </p>

                      <h2 className="font-display text-2xl font-semibold mt-1">
                        Your Improved Resume Content
                      </h2>

                    </div>

                  </div>

                </GlassCard>

                {/* SUMMARY */}

                {improveResult.improved_summary && (

                  <GlassCard className="p-6">

                    <div className="flex justify-between items-start gap-4">

                      <h3 className="font-display font-semibold">
                        ✍️ Improved Professional Summary
                      </h3>

                      <button
                        onClick={() =>
                          copyText(
                            improveResult.improved_summary
                          )
                        }
                        className="shrink-0 text-xs px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition"
                      >
                        Copy
                      </button>

                    </div>

                    <p className="text-sm text-starlight/70 leading-7 mt-4">

                      {improveResult.improved_summary}

                    </p>

                  </GlassCard>

                )}

                {/* BULLETS */}

                {improveResult.improved_bullets?.length > 0 && (

                  <GlassCard className="p-6">

                    <h3 className="font-display font-semibold">
                      🚀 Improved Resume Bullets
                    </h3>

                    <p className="text-xs text-starlight/40 mt-2">

                      Stronger versions of your existing
                      resume statements.

                    </p>

                    <div className="space-y-5 mt-5">

                      {improveResult.improved_bullets.map(
                        (item, index) => (

                          <div
                            key={index}
                            className="rounded-xl border border-white/10 overflow-hidden"
                          >

                            {/* CURRENT */}

                            <div className="p-4 bg-white/5">

                              <p className="text-xs uppercase tracking-wider text-starlight/40">
                                Current Version
                              </p>

                              <p className="text-sm text-starlight/60 mt-2 leading-6">

                                {item.original}

                              </p>

                            </div>

                            {/* IMPROVED */}

                            <div className="p-4">

                              <div className="flex justify-between items-start gap-4">

                                <div>

                                  <p className="text-xs uppercase tracking-wider text-aurora">
                                    Suggested Version
                                  </p>

                                  <p className="text-sm text-starlight/80 mt-2 leading-6">

                                    {item.improved}

                                  </p>

                                </div>

                                <button
                                  onClick={() =>
                                    copyText(
                                      item.improved
                                    )
                                  }
                                  className="shrink-0 text-xs px-3 py-2 rounded-lg bg-aurora/10 border border-aurora/20 text-aurora hover:bg-aurora/20 transition"
                                >
                                  Copy
                                </button>

                              </div>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  </GlassCard>

                )}

                {/* KEYWORDS */}

                {improveResult.keywords_to_add?.length > 0 && (

                  <GlassCard className="p-6">

                    <h3 className="font-display font-semibold">
                      🎯 Keywords To Consider
                    </h3>

                    <p className="text-xs text-starlight/40 mt-2">

                      Only include keywords that genuinely
                      match your skills and experience.

                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">

                      {improveResult.keywords_to_add.map(
                        (keyword) => (

                          <span
                            key={keyword}
                            className="px-3 py-1.5 rounded-full bg-purple-400/10 border border-purple-400/20 text-purple-300 text-sm"
                          >
                            + {keyword}
                          </span>

                        )
                      )}

                    </div>

                  </GlassCard>

                )}

                {/* RECOMMENDATIONS */}

                {improveResult.recommendations?.length > 0 && (

                  <GlassCard className="p-6">

                    <h3 className="font-display font-semibold">
                      💡 Resume Recommendations
                    </h3>

                    <div className="space-y-3 mt-4">

                      {improveResult.recommendations.map(
                        (
                          recommendation,
                          index
                        ) => (

                          <div
                            key={index}
                            className="flex gap-3 rounded-xl bg-white/5 p-4"
                          >

                            <span className="text-purple-300 font-semibold">
                              {index + 1}
                            </span>

                            <p className="text-sm text-starlight/65 leading-6">
                              {recommendation}
                            </p>

                          </div>

                        )
                      )}

                    </div>

                  </GlassCard>

                )}

              </motion.div>

            )}

          </div>

        )}

      </div>

    </main>
  )
}