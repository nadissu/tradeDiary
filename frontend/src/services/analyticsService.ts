import api from './api';
import {
    AnalyticsSummary,
    PerformanceByEmotion,
    PerformanceByCoin,
    PerformanceByStrategy,
    PerformanceByTime,
    AnalyticsInsights
} from '../types';

export const analyticsService = {
    async getSummary(startDate?: string, endDate?: string): Promise<AnalyticsSummary> {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        const response = await api.get<AnalyticsSummary>(`/analytics/summary?${params.toString()}`);
        return response.data;
    },

    async getByEmotion(): Promise<PerformanceByEmotion[]> {
        const response = await api.get<PerformanceByEmotion[]>('/analytics/by-emotion');
        return response.data;
    },

    async getByCoin(): Promise<PerformanceByCoin[]> {
        const response = await api.get<PerformanceByCoin[]>('/analytics/by-coin');
        return response.data;
    },

    async getByStrategy(): Promise<PerformanceByStrategy[]> {
        const response = await api.get<PerformanceByStrategy[]>('/analytics/by-strategy');
        return response.data;
    },

    async getByTime(): Promise<PerformanceByTime[]> {
        const response = await api.get<PerformanceByTime[]>('/analytics/by-time');
        return response.data;
    },

    async getInsights(): Promise<AnalyticsInsights> {
        const response = await api.get<AnalyticsInsights>('/analytics/insights');
        return response.data;
    }
};
