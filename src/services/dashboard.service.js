import apiClient from '../lib/axios';

export const getDashboardKpis = async () => {
  try {
    const { data } = await apiClient.get('/dashboard/kpis');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch KPIs');
  }
};

export const getRecentTransactions = async () => {
  try {
    const { data } = await apiClient.get('/dashboard/recent-transactions');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch recent transactions');
  }
};

export const getRevenueTrends = async () => {
  try {
    const { data } = await apiClient.get('/dashboard/revenue-trends');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch revenue trends');
  }
};

export const getTodaysReservations = async () => {
  try {
    const { data } = await apiClient.get('/dashboard/todays-reservations');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch today\'s reservations');
  }
};

export const getTopPerformingVendors = async () => {
  try {
    const { data } = await apiClient.get('/vendors/top-performing');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch top performing vendors');
  }
};
