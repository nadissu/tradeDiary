import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';
import { tradeService } from '../services/tradeService';
import { AnalyticsSummary, Insight, Trade } from '../types';
import TradeCard from '../components/TradeCard';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [insights, setInsights] = useState<Insight[]>([]);
    const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [summaryData, insightsData, tradesData] = await Promise.all([
                analyticsService.getSummary(),
                analyticsService.getInsights(),
                tradeService.getTrades({ pageSize: 5 })
            ]);
            setSummary(summaryData);
            setInsights(insightsData.insights);
            setRecentTrades(tradesData);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(value);
    };

    if (loading) {
        return (
            <div className="page container">
                <div className="loading-state">
                    <span className="loading-icon">📊</span>
                    <p>Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page container fade-in">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <Link to="/trades/new" className="btn btn-primary">
                    + Yeni İşlem
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Toplam İşlem</div>
                    <div className="stat-value">{summary?.totalTrades || 0}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Win Rate</div>
                    <div className={`stat-value ${(summary?.winRate || 0) >= 50 ? 'positive' : 'negative'}`}>
                        %{(summary?.winRate || 0).toFixed(1)}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Toplam P/L</div>
                    <div className={`stat-value ${(summary?.totalPnL || 0) >= 0 ? 'positive' : 'negative'}`}>
                        {formatCurrency(summary?.totalPnL || 0)}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Ortalama P/L</div>
                    <div className={`stat-value ${(summary?.averagePnL || 0) >= 0 ? 'positive' : 'negative'}`}>
                        {formatCurrency(summary?.averagePnL || 0)}
                    </div>
                </div>
            </div>

            {/* Secondary Stats */}
            <div className="stats-grid-secondary">
                <div className="stat-card-mini">
                    <span className="stat-emoji">🏆</span>
                    <div>
                        <div className="stat-mini-label">En İyi Trade</div>
                        <div className="stat-mini-value positive">{formatCurrency(summary?.bestTrade || 0)}</div>
                    </div>
                </div>
                <div className="stat-card-mini">
                    <span className="stat-emoji">📉</span>
                    <div>
                        <div className="stat-mini-label">En Kötü Trade</div>
                        <div className="stat-mini-value negative">{formatCurrency(summary?.worstTrade || 0)}</div>
                    </div>
                </div>
                <div className="stat-card-mini">
                    <span className="stat-emoji">✅</span>
                    <div>
                        <div className="stat-mini-label">Kazanan</div>
                        <div className="stat-mini-value">{summary?.winningTrades || 0}</div>
                    </div>
                </div>
                <div className="stat-card-mini">
                    <span className="stat-emoji">❌</span>
                    <div>
                        <div className="stat-mini-label">Kaybeden</div>
                        <div className="stat-mini-value">{summary?.losingTrades || 0}</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                {/* Insights */}
                <div className="dashboard-section">
                    <h2 className="section-title">💡 İçgörüler</h2>
                    {insights.length === 0 ? (
                        <div className="empty-state">
                            <p>Henüz yeterli veri yok. İşlem eklemeye başla!</p>
                        </div>
                    ) : (
                        <div className="insights-list">
                            {insights.map((insight, index) => (
                                <div
                                    key={index}
                                    className={`insight-card ${insight.type.toLowerCase()}`}
                                >
                                    <span className="insight-emoji">{insight.emoji}</span>
                                    <div className="insight-content">
                                        <div className="insight-title">{insight.title}</div>
                                        <div className="insight-message">{insight.message}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Trades */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">📈 Son İşlemler</h2>
                        <Link to="/trades" className="view-all">Tümünü Gör →</Link>
                    </div>
                    {recentTrades.length === 0 ? (
                        <div className="empty-state">
                            <p>Henüz işlem yok.</p>
                            <Link to="/trades/new" className="btn btn-secondary">İlk Trade'ini Ekle</Link>
                        </div>
                    ) : (
                        <div className="trades-list">
                            {recentTrades.map((trade) => (
                                <TradeCard key={trade.id} trade={trade} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
