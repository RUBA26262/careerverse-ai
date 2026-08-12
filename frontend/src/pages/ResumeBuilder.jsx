import { useState } from 'react'

const emptyExperience = {
  company: '',
  role: '',
  duration: '',
  description: ''
}

const emptyProject = {
  name: '',
  technologies: '',
  description: ''
}

export default function ResumeBuilder() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    summary: '',
    skills: '',
    education: '',
    certifications: '',
    achievements: '',
    experience: [emptyExperience],
    projects: [emptyProject]
  })

  const updateField = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateExperience = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      experience: prev.experience.map((item, i) =>
        i === index
          ? { ...item, [field]: value }
          : item
      )
    }))
  }

  const addExperience = () => {
    setForm(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { ...emptyExperience }
      ]
    }))
  }

  const removeExperience = (index) => {
    setForm(prev => ({
      ...prev,
      experience: prev.experience.filter(
        (_, i) => i !== index
      )
    }))
  }

  const updateProject = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      projects: prev.projects.map((item, i) =>
        i === index
          ? { ...item, [field]: value }
          : item
      )
    }))
  }

  const addProject = () => {
    setForm(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        { ...emptyProject }
      ]
    }))
  }

  const removeProject = (index) => {
    setForm(prev => ({
      ...prev,
      projects: prev.projects.filter(
        (_, i) => i !== index
      )
    }))
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen px-6 py-10">

      {/* HEADER */}

      <div className="max-w-7xl mx-auto mb-10">

        <p className="text-aurora text-sm uppercase tracking-widest">
          Career Tool
        </p>

        <h1 className="font-display text-4xl font-bold mt-2">
          Resume <span className="text-gradient">Builder</span>
        </h1>

        <p className="text-starlight/60 mt-3">
          Build a professional, ATS-friendly resume
          and preview it live.
        </p>

      </div>

      {/* MAIN */}

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">

        {/* =========================================
            FORM
        ========================================= */}

        <div className="space-y-6 print:hidden">

          {/* PERSONAL INFORMATION */}

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">

            <h2 className="font-display text-xl font-semibold">
              👤 Personal Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mt-5">

              <input
                placeholder="Full Name"
                value={form.name}
                onChange={e =>
                  updateField('name', e.target.value)
                }
                className="input-style"
              />

              <input
                placeholder="Email"
                value={form.email}
                onChange={e =>
                  updateField('email', e.target.value)
                }
                className="input-style"
              />

              <input
                placeholder="Phone"
                value={form.phone}
                onChange={e =>
                  updateField('phone', e.target.value)
                }
                className="input-style"
              />

              <input
                placeholder="Location"
                value={form.location}
                onChange={e =>
                  updateField('location', e.target.value)
                }
                className="input-style"
              />

              <input
                placeholder="LinkedIn URL"
                value={form.linkedin}
                onChange={e =>
                  updateField('linkedin', e.target.value)
                }
                className="input-style"
              />

              <input
                placeholder="GitHub URL"
                value={form.github}
                onChange={e =>
                  updateField('github', e.target.value)
                }
                className="input-style"
              />

            </div>

          </section>

          {/* SUMMARY */}

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">

            <h2 className="font-display text-xl font-semibold">
              🎯 Professional Summary
            </h2>

            <textarea
              rows="5"
              placeholder="Write a short professional summary..."
              value={form.summary}
              onChange={e =>
                updateField(
                  'summary',
                  e.target.value
                )
              }
              className="input-style mt-4 resize-none"
            />

          </section>

          {/* SKILLS */}

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">

            <h2 className="font-display text-xl font-semibold">
              💻 Skills
            </h2>

            <textarea
              rows="4"
              placeholder="Python, JavaScript, React, SQL, HTML, CSS..."
              value={form.skills}
              onChange={e =>
                updateField(
                  'skills',
                  e.target.value
                )
              }
              className="input-style mt-4 resize-none"
            />

            <p className="text-xs text-starlight/40 mt-2">
              Separate skills using commas.
            </p>

          </section>

          {/* EDUCATION */}

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">

            <h2 className="font-display text-xl font-semibold">
              🎓 Education
            </h2>

            <textarea
              rows="5"
              placeholder="Degree | College | Year | CGPA"
              value={form.education}
              onChange={e =>
                updateField(
                  'education',
                  e.target.value
                )
              }
              className="input-style mt-4 resize-none"
            />

          </section>

          {/* EXPERIENCE */}

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">

            <div className="flex justify-between items-center">

              <h2 className="font-display text-xl font-semibold">
                💼 Experience
              </h2>

              <button
                onClick={addExperience}
                className="px-3 py-2 rounded-lg bg-aurora/10 text-aurora text-sm"
              >
                + Add
              </button>

            </div>

            <div className="space-y-5 mt-5">

              {form.experience.map(
                (experience, index) => (

                  <div
                    key={index}
                    className="border border-white/10 rounded-xl p-4"
                  >

                    <div className="grid md:grid-cols-2 gap-4">

                      <input
                        placeholder="Company"
                        value={experience.company}
                        onChange={e =>
                          updateExperience(
                            index,
                            'company',
                            e.target.value
                          )
                        }
                        className="input-style"
                      />

                      <input
                        placeholder="Role"
                        value={experience.role}
                        onChange={e =>
                          updateExperience(
                            index,
                            'role',
                            e.target.value
                          )
                        }
                        className="input-style"
                      />

                      <input
                        placeholder="Duration"
                        value={experience.duration}
                        onChange={e =>
                          updateExperience(
                            index,
                            'duration',
                            e.target.value
                          )
                        }
                        className="input-style"
                      />

                    </div>

                    <textarea
                      rows="4"
                      placeholder="Describe your responsibilities and achievements..."
                      value={experience.description}
                      onChange={e =>
                        updateExperience(
                          index,
                          'description',
                          e.target.value
                        )
                      }
                      className="input-style mt-4 resize-none"
                    />

                    {form.experience.length > 1 && (

                      <button
                        onClick={() =>
                          removeExperience(index)
                        }
                        className="text-red-300 text-sm mt-3"
                      >
                        Remove
                      </button>

                    )}

                  </div>

                )
              )}

            </div>

          </section>

          {/* PROJECTS */}

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">

            <div className="flex justify-between items-center">

              <h2 className="font-display text-xl font-semibold">
                🚀 Projects
              </h2>

              <button
                onClick={addProject}
                className="px-3 py-2 rounded-lg bg-aurora/10 text-aurora text-sm"
              >
                + Add
              </button>

            </div>

            <div className="space-y-5 mt-5">

              {form.projects.map(
                (project, index) => (

                  <div
                    key={index}
                    className="border border-white/10 rounded-xl p-4"
                  >

                    <input
                      placeholder="Project Name"
                      value={project.name}
                      onChange={e =>
                        updateProject(
                          index,
                          'name',
                          e.target.value
                        )
                      }
                      className="input-style"
                    />

                    <input
                      placeholder="Technologies"
                      value={project.technologies}
                      onChange={e =>
                        updateProject(
                          index,
                          'technologies',
                          e.target.value
                        )
                      }
                      className="input-style mt-4"
                    />

                    <textarea
                      rows="4"
                      placeholder="Project description..."
                      value={project.description}
                      onChange={e =>
                        updateProject(
                          index,
                          'description',
                          e.target.value
                        )
                      }
                      className="input-style mt-4 resize-none"
                    />

                    {form.projects.length > 1 && (

                      <button
                        onClick={() =>
                          removeProject(index)
                        }
                        className="text-red-300 text-sm mt-3"
                      >
                        Remove
                      </button>

                    )}

                  </div>

                )
              )}

            </div>

          </section>

          {/* CERTIFICATIONS */}

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">

            <h2 className="font-display text-xl font-semibold">
              📜 Certifications
            </h2>

            <textarea
              rows="4"
              placeholder="Certification | Issuing Organization | Year"
              value={form.certifications}
              onChange={e =>
                updateField(
                  'certifications',
                  e.target.value
                )
              }
              className="input-style mt-4 resize-none"
            />

          </section>

          {/* ACHIEVEMENTS */}

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">

            <h2 className="font-display text-xl font-semibold">
              🏆 Achievements
            </h2>

            <textarea
              rows="4"
              placeholder="Awards, competitions, achievements..."
              value={form.achievements}
              onChange={e =>
                updateField(
                  'achievements',
                  e.target.value
                )
              }
              className="input-style mt-4 resize-none"
            />

          </section>

          {/* DOWNLOAD */}

          <button
            onClick={handlePrint}
            className="w-full rounded-xl bg-gradient-to-r from-nebula to-aurora py-4 font-semibold"
          >
            📄 Download / Print Resume
          </button>

        </div>

        {/* =========================================
            LIVE PREVIEW
        ========================================= */}

        <div className="lg:sticky lg:top-6 h-fit">

          <div className="mb-3 flex justify-between items-center print:hidden">

            <h2 className="font-display text-xl font-semibold">
              👀 Live Preview
            </h2>

            <span className="text-xs text-starlight/40">
              Updates automatically
            </span>

          </div>

          <div
            id="resume-preview"
            className="bg-white text-black rounded-xl shadow-2xl p-8 min-h-[900px]"
          >

            {/* NAME */}

            <header className="border-b border-gray-300 pb-5">

              <h1 className="text-3xl font-bold">

                {form.name ||
                  'Your Name'}

              </h1>

              <div className="text-sm text-gray-600 mt-2 flex flex-wrap gap-x-4 gap-y-1">

                {form.email && (
                  <span>
                    {form.email}
                  </span>
                )}

                {form.phone && (
                  <span>
                    {form.phone}
                  </span>
                )}

                {form.location && (
                  <span>
                    {form.location}
                  </span>
                )}

              </div>

              <div className="text-sm text-blue-700 mt-2 flex flex-wrap gap-4">

                {form.linkedin && (
                  <span>
                    {form.linkedin}
                  </span>
                )}

                {form.github && (
                  <span>
                    {form.github}
                  </span>
                )}

              </div>

            </header>

            {/* SUMMARY */}

            {form.summary && (

              <ResumeSection
                title="PROFESSIONAL SUMMARY"
              >

                <p className="text-sm leading-6">
                  {form.summary}
                </p>

              </ResumeSection>

            )}

            {/* SKILLS */}

            {form.skills && (

              <ResumeSection
                title="TECHNICAL SKILLS"
              >

                <p className="text-sm leading-6">
                  {form.skills}
                </p>

              </ResumeSection>

            )}

            {/* EDUCATION */}

            {form.education && (

              <ResumeSection
                title="EDUCATION"
              >

                <p className="text-sm leading-6 whitespace-pre-line">
                  {form.education}
                </p>

              </ResumeSection>

            )}

            {/* EXPERIENCE */}

            {form.experience.some(
              item =>
                item.company ||
                item.role ||
                item.description
            ) && (

              <ResumeSection
                title="EXPERIENCE"
              >

                {form.experience.map(
                  (experience, index) => (

                    <div
                      key={index}
                      className="mb-5"
                    >

                      <div className="flex justify-between">

                        <div>

                          <h3 className="font-bold">
                            {experience.role}
                          </h3>

                          <p className="text-sm font-medium">
                            {experience.company}
                          </p>

                        </div>

                        <p className="text-sm text-gray-600">
                          {experience.duration}
                        </p>

                      </div>

                      {experience.description && (

                        <p className="text-sm leading-6 mt-2 whitespace-pre-line">
                          {experience.description}
                        </p>

                      )}

                    </div>

                  )
                )}

              </ResumeSection>

            )}

            {/* PROJECTS */}

            {form.projects.some(
              project =>
                project.name ||
                project.description
            ) && (

              <ResumeSection
                title="PROJECTS"
              >

                {form.projects.map(
                  (project, index) => (

                    <div
                      key={index}
                      className="mb-5"
                    >

                      <h3 className="font-bold">
                        {project.name}
                      </h3>

                      {project.technologies && (

                        <p className="text-xs text-gray-600 mt-1">
                          Technologies: {project.technologies}
                        </p>

                      )}

                      {project.description && (

                        <p className="text-sm leading-6 mt-2 whitespace-pre-line">
                          {project.description}
                        </p>

                      )}

                    </div>

                  )
                )}

              </ResumeSection>

            )}

            {/* CERTIFICATIONS */}

            {form.certifications && (

              <ResumeSection
                title="CERTIFICATIONS"
              >

                <p className="text-sm leading-6 whitespace-pre-line">
                  {form.certifications}
                </p>

              </ResumeSection>

            )}

            {/* ACHIEVEMENTS */}

            {form.achievements && (

              <ResumeSection
                title="ACHIEVEMENTS"
              >

                <p className="text-sm leading-6 whitespace-pre-line">
                  {form.achievements}
                </p>

              </ResumeSection>

            )}

          </div>

        </div>

      </div>

      {/* PRINT STYLES */}

      <style>{`

        .input-style {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          padding: 0.75rem 1rem;
          color: white;
          outline: none;
        }

        .input-style::placeholder {
          color: rgba(255,255,255,0.3);
        }

        .input-style:focus {
          border-color: rgba(58,166,255,0.6);
        }

        @media print {

          body {
            background: white !important;
          }

          #resume-preview {
            box-shadow: none !important;
            border-radius: 0 !important;
            width: 100%;
          }

        }

      `}</style>

    </div>
  )
}

// =====================================================
// RESUME SECTION
// =====================================================

function ResumeSection({
  title,
  children
}) {

  return (

    <section className="mt-6">

      <h2 className="text-sm font-bold tracking-widest border-b border-gray-300 pb-2 mb-3">
        {title}
      </h2>

      {children}

    </section>

  )
}