import { API } from '../_api';

export const getPsychologists = async () => {
  try {
    const { data } = await API.get('/psychologists');
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getPsychologist = async (id) => {
  try {
    const { data } = await API.get(`/psychologists/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getAvailablePsychologists = async (filter = 'all') => {
  try {
    const { data } = await API.get(`/psychologists/available?status=${filter}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Functions untuk psikiater (dashboard & management)
export const getPsychologistDashboardStats = async () => {
  try {
    const { data } = await API.get('/psychologist/dashboard-stats');
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getRecentConsultations = async () => {
  try {
    const { data } = await API.get('/psychologist/recent-consultations');
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const updatePsychologistStatus = async (statusData) => {
  try {
    const { data } = await API.put('/psychologists/status', statusData);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getPsychologistConsultations = async (filter = 'all') => {
  try {
    const { data } = await API.get(`/psychologist/consultations?filter=${filter}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getPsychologistConsultationDetail = async (id) => {
  try {
    const { data } = await API.get(`/psychologist/consultation/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const startConsultation = async (consultationId) => {
  try {
    const { data } = await API.post(`/consultation/${consultationId}/start`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const endConsultation = async (consultationId) => {
  try {
    const { data } = await API.post(`/consultation/${consultationId}/end`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getPsychologistProfile = async () => {
  try {
    const { data } = await API.get('/psychologist/profile');
    return data;
  } catch (error) {
    console.log('Error fetching current psychologist profile:', error);
    throw error;
  }
}

export const updatePsychologistProfile = async (profileData) => {
  try {
    const { data } = await API.put('/psychologist/profile', profileData);
    return data;
  } catch (error) {
    console.log('Error updating psychologist profile:',error);
    throw error;
  }
}

export const getPsychologistEarnings = async (period = 'monthly') => {
  try {
    const { data } = await API.get(`/psychologist/earnings?period=${period}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getPsychologistSchedule = async () => {
  try {
    const { data } = await API.get('/psychologist/schedule');
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const updatePsychologistSchedule = async (scheduleData) => {
  try {
    const { data } = await API.put('/psychologist/schedule', scheduleData);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getPsychologistReviews = async () => {
  try {
    const { data } = await API.get('/psychologists/reviews');
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Export object untuk easier imports (optional)
export const psychologistService = {
  // Untuk user
  getPsychologists,
  getPsychologist,
  getAvailablePsychologists,
  
  // Dashboard
  getDashboardStats: getPsychologistDashboardStats,
  getRecentConsultations,
  updateStatus: updatePsychologistStatus,
  
  // Consultations
  getConsultations: getPsychologistConsultations,
  getConsultationDetail: getPsychologistConsultationDetail,
  startConsultation,
  endConsultation,
  
  // Profile & Settings
  getProfile: getPsychologistProfile,
  updateProfile: updatePsychologistProfile,
  getEarnings: getPsychologistEarnings,
  getSchedule: getPsychologistSchedule,
  updateSchedule: updatePsychologistSchedule,
  getReviews: getPsychologistReviews,
};