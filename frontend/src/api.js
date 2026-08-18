const BASE = '/api'

/*
 * Convert backend errors into a readable message.
 * Prevents errors such as "[object Object]"
 */
function getErrorMessage(body) {
  if (!body) {
    return 'Something went wrong'
  }

  // FastAPI/string error
  if (typeof body.detail === 'string') {
    return body.detail
  }

  // Backend returns: { detail: { message: "..." } }
  if (
    body.detail &&
    typeof body.detail === 'object' &&
    typeof body.detail.message === 'string'
  ) {
    return body.detail.message
  }

  // Backend returns: { message: "..." }
  if (typeof body.message === 'string') {
    return body.message
  }

  // FastAPI validation errors
  if (Array.isArray(body.detail)) {
    return body.detail
      .map((error) => {
        if (typeof error === 'string') {
          return error
        }

        if (error?.msg) {
          return error.msg
        }

        return JSON.stringify(error)
      })
      .join(', ')
  }

  // Any other object
  if (body.detail && typeof body.detail === 'object') {
    return JSON.stringify(body.detail)
  }

  return 'Request failed'
}


/*
 * General API request function
 */
async function request(path, options = {}) {
  const token = localStorage.getItem('cv_token')

  const res = await fetch(`${BASE}${path}`, {
    ...options,

    headers: {
      'Content-Type': 'application/json',

      ...(token
        ? {
            Authorization: `Bearer ${token}`
          }
        : {}),

      ...(options.headers || {})
    }
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({
      detail: 'Something went wrong'
    }))

    throw new Error(getErrorMessage(body))
  }

  return res.json()
}


/*
 * File upload request function
 */
async function uploadFile(path, formData) {
  const token = localStorage.getItem('cv_token')

  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',

    headers: {
      ...(token
        ? {
            Authorization: `Bearer ${token}`
          }
        : {})
    },

    body: formData
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({
      detail: 'Something went wrong'
    }))

    throw new Error(getErrorMessage(body))
  }

  return res.json()
}


/*
 * CareerVerse AI API
 */
export const api = {

  // =========================
  // AUTH
  // =========================

  signup: (data) =>
    request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  login: (data) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  me: () =>
    request('/auth/me'),


  // =========================
  // ASSESSMENT
  // =========================

  getQuestions: () =>
    request('/assessment/questions'),

  submitAssessment: (answers) =>
    request('/assessment/submit', {
      method: 'POST',
      body: JSON.stringify({
        answers
      })
    }),

  getLatestAssessment: () =>
    request('/assessment/latest'),


  // =========================
  // CAREER
  // =========================

  getCareerMatch: () =>
    request('/careers/match'),

  getCareer: (id) =>
    request(`/careers/${id}`),


  // =========================
  // ROADMAP
  // =========================

  getRoadmap: (careerId) =>
    request(`/roadmap/${careerId}`),


  // =========================
  // AI MENTOR
  // =========================

  sendMentorMessage: (message, history) =>
    request('/mentor/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        history
      })
    }),


  // =========================
  // RESUME ANALYZER
  // =========================

  analyzeResume: (file, targetRole) => {
    const formData = new FormData()

    formData.append('file', file)
    formData.append('target_role', targetRole)

    return uploadFile(
      '/resume/analyze',
      formData
    )
  },


  // =========================
  // JOB DESCRIPTION MATCH
  // =========================

  jobMatch: (
    jobDescription,
    resumeText,
    targetRole
  ) =>
    request('/resume/job-match', {
      method: 'POST',
      body: JSON.stringify({
        job_description: jobDescription,
        resume_text: resumeText,
        target_role: targetRole
      })
    }),


  // =========================
  // RESUME HISTORY
  // =========================

  getResumeHistory: () =>
    request('/resume/history'),


  // =========================
  // RESUME IMPROVER
  // =========================

  improveResume: (
    resumeText,
    jobDescription,
    targetRole
  ) =>
    request('/resume/improve', {
      method: 'POST',
      body: JSON.stringify({
        resume_text: resumeText,
        job_description: jobDescription,
        target_role: targetRole
      })
    })
}