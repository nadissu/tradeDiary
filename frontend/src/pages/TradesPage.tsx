import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tradeService } from '../services/tradeService';
import { Trade, TradeDirection, TradeEmotion, EmotionLabels, DirectionLabels } from '../types';
import TradeCard from '../components/TradeCard';
import './TradesPage.css';

const TradesPage: React.FC = () => {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        coin: '',
        direction: '' as '' | '0' | '1',
        emotion: '',
        isFromBot: '' as '' | 'true' | 'false'
    });

    useEffect(() => {
        loadTrades();
    }, [filters]);

    const loadTrades = async () => {
        setLoading(true);
        try {
            const filterParams: any = {};
            if (filters.coin) filterParams.coin = filters.coin;
            if (filters.direction !== '') filterParams.direction = parseInt(filters.direction);
            if (filters.emotion !== '') filterParams.emotion = parseInt(filters.emotion);
            if (filters.isFromBot !== '') filterParams.isFromBot = filters.isFromBot === 'true';

            const data = await tradeService.getTrades(filterParams);
            setTrades(data);
        } catch (error) {
            console.error('Failed to load trades:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu işlemi silmek istediğinize emin misiniz?')) return;

        try {
            await tradeService.deleteTrade(id);
            setTrades(trades.filter(t => t.id !== id));
        } catch (error) {
            console.error('Failed to delete trade:', error);
        }
    };

    return (
        <div className="page container fade-in">
            <div className="trades-header">
                <h1>İşlemler</h1>
                <Link to="/trades/new" className="btn btn-primary">
                    + Yeni İşlem
                </Link>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <input
                    type="text"
                    className="form-input filter-input"
                    placeholder="Coin ara..."
                    value={filters.coin}
                    onChange={(e) => setFilters({ ...filters, coin: e.target.value })}
                />
                <select
                    className="form-select filter-select"
                    value={filters.direction}
                    onChange={(e) => setFilters({ ...filters, direction: e.target.value as '' | '0' | '1' })}
                >
                    <option value="">Tüm Yönler</option>
                    <option value="0">Long</option>
                    <option value="1">Short</option>
                </select>
                <select
                    className="form-select filter-select"
                    value={filters.emotion}
                    onChange={(e) => setFilters({ ...filters, emotion: e.target.value })}
                >
                    <option value="">Tüm Duygular</option>
                    {Object.entries(EmotionLabels).map(([key, { label, emoji }]) => (
                        <option key={key} value={key}>{emoji} {label}</option>
                    ))}
                </select>
                <select
                    className="form-select filter-select"
                    value={filters.isFromBot}
                    onChange={(e) => setFilters({ ...filters, isFromBot: e.target.value as '' | 'true' | 'false' })}
                >
                    <option value="">Tüm Kaynaklar</option>
                    <option value="false">Manuel</option>
                    <option value="true">Bot</option>
                </select>
            </div>

            {/* Trades List */}
            {loading ? (
                <div className="loading-state">
                    <p className="loading">Yükleniyor...</p>
                </div>
            ) : trades.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>Henüz işlem bulunamadı.</p>
                    <Link to="/trades/new" className="btn btn-primary">İlk Trade'ini Ekle</Link>
                </div>
            ) : (
                <div className="trades-grid">
                    {trades.map((trade) => (
                        <div key={trade.id} className="trade-wrapper">
                            <TradeCard trade={trade} />
                            <button
                                className="delete-btn"
                                onClick={() => handleDelete(trade.id)}
                                title="Sil"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TradesPage;
