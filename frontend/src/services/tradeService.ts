import api from './api';
import { Trade, CreateTradeDto } from '../types';

export const tradeService = {
    async getTrades(filters?: {
        coin?: string;
        direction?: number;
        emotion?: number;
        strategy?: string;
        isFromBot?: boolean;
        startDate?: string;
        endDate?: string;
        page?: number;
        pageSize?: number;
    }): Promise<Trade[]> {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, String(value));
                }
            });
        }
        const response = await api.get<Trade[]>(`/trades?${params.toString()}`);
        return response.data;
    },

    async getTrade(id: string): Promise<Trade> {
        const response = await api.get<Trade>(`/trades/${id}`);
        return response.data;
    },

    async createTrade(trade: CreateTradeDto): Promise<Trade> {
        const response = await api.post<Trade>('/trades', trade);
        return response.data;
    },

    async updateTrade(id: string, trade: Partial<CreateTradeDto>): Promise<Trade> {
        const response = await api.put<Trade>(`/trades/${id}`, trade);
        return response.data;
    },

    async deleteTrade(id: string): Promise<void> {
        await api.delete(`/trades/${id}`);
    },

    async importBotTrades(trades: any[]): Promise<{ message: string; trades: Trade[] }> {
        const response = await api.post<{ message: string; trades: Trade[] }>('/trades/import', trades);
        return response.data;
    }
};
