import api from './axios'

export const submitEnquiry = (data) => api.post('/enquiries', data)
export const getServices   = ()     => api.get('/services')

export const getEnquiries       = (status) => api.get('/admin/enquiries', { params: status ? { status } : {} })
export const getEnquiryById     = (id)     => api.get(`/admin/enquiries/${id}`)
export const replyToEnquiry     = (id, reply) => api.put(`/admin/enquiries/${id}/reply`, { reply })
export const discardEnquiry     = (id)     => api.put(`/admin/enquiries/${id}/discard`)
export const getNotificationCount = ()     => api.get('/admin/notifications/count')
export const getInsights        = ()       => api.get('/admin/insights')

export const adminLogin = (username, password) => api.post('/admin/login', { username, password })
