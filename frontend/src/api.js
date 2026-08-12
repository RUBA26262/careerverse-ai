const BASE = '/api'

async function request(path, options = {}) {
  const token = localStorage.getItem('cv_token')

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
      ...(options.headers || {})
    }
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({
      detail: 'Something went wrong'
    }))

    throw new Error(body.detail || 'Request failed')
  }

  return res.json()
}

async function uploadFile(path, formData) {
  const token = localStorage.getItem('cv_token')

  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: {
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {})
    },
    body: formData
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({
      detail: 'Something went wrong'
    }))

    throw new Error(body.detail || 'Request failed')
  }

  return res.json()
}

export const api = {
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

  getQuestions: () =>
    request('/assessment/questions'),

  submitAssessment: (answers) =>
    request('/assessment/submit', {
      method: 'POST',
      body: JSON.stringify({ answers })
    }),

  getLatestAssessment: () =>
    request('/assessment/latest'),

  getCareerMatch: () =>
    request('/careers/match'),

  getCareer: (id) =>
    request(`/careers/${id}`),

  getRoadmap: (careerId) =>
    request(`/roadmap/${careerId}`),

  sendMentorMessage: (message, history) =>
    request('/mentor/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        history
      })
    }),

  analyzeResume: (file, targetRole) => {
    const formData = new FormData()

    formData.append('file', file)
    formData.append('target_role', targetRole)

    return uploadFile(
      '/resume/analyze',
      formData
    )
  },

  getResumeHistory: () =>
    request('/resume/history')
}