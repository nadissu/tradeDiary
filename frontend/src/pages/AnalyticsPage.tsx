import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie, Legend
} from 'recharts';
import { analyticsService } from '../services/analyticsService';
import {
    AnalyticsSummary,
    PerformanceByEmotion,
    PerformanceByCoin,
    PerformanceByStrategy,
    PerformanceByTime,
    EmotionLabels
} from '../types';
import './AnalyticsPage.css';

const AnalyticsPage: React.FC = () => {
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [byEmotion, setByEmotion] = useState<PerformanceByEmotion[]>([]);
    const [byCoin, setByCoin] = useState<PerformanceByCoin[]>([]);
    const [byStrategy, setByStrategy] = useState<PerformanceByStrategy[]>([]);
    const [byTime, setByTime] = useState<PerformanceByTime[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'emotion' | 'coin' | 'strategy' | 'time'>('emotion');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [summaryData, emotionData, coinData, strategyData, timeData] = await Promise.all([
                analyticsService.getSummary(),
                analyticsService.getByEmotion(),
                analyticsService.getByCoin(),
                analyticsService.getByStrategy(),
                analyticsService.getByTime()
            ]);
            setSummary(summaryData);
            setByEmotion(emotionData);
            setByCoin(coinData);
            setByStrategy(strategyData);
            setByTime(timeData);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(value);
    };

    const getEmotionChartData = () => {
        return byEmotion.map(item => ({
            name: EmotionLabels[item.emotion]?.emoji + ' ' + EmotionLabels[item.emotion]?.label || 'Unknown',
            pnl: item.totalPnL,
            winRate: item.winRate,
            trades: item.tradeCount
        }));
    };

    const getCoinChartData = () => {
        return byCoin.map(item => ({
            name: item.coin,
            pnl: item.totalPnL,
            winRate: item.winRate,
            trades: item.tradeCount
        }));
    };

    const getStrategyChartData = () => {
        return byStrategy.map(item => ({
            name: item.strategy,
            pnl: item.totalPnL,
            winRate: item.winRate,
            trades: item.tradeCount
        }));
    };

    const getTimeChartData = () => {
        return byTime.map(item => ({
            name: `${item.hour}:00`,
            pnl: item.totalPnL,
            winRate: item.winRate,
            trades: item.tradeCount
        }));
    };

    if (loading) {
        return (
            <div className="page container">
                <div className="loading-state">
                    <span className="loading-icon">📊</span>
                    <p>Analiz yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page container fade-in">
            <div className="analytics-header">
                <h1>Analiz & İstatistikler</h1>
            </div>

            {/* Summary Cards */}
            <div className="summary-grid">
                <div className="summary-card">
                    <div className="summary-icon">📈</div>
                    <div className="summary-content">
                        <div className="summary-value">{summary?.totalTrades || 0}</div>
                        <div className="summary-label">Toplam İşlem</div>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon">🎯</div>
                    <div className="summary-content">
                        <div className={`summary-value ${(summary?.winRate || 0) >= 50 ? 'positive' : 'negative'}`}>
                            %{(summary?.winRate || 0).toFixed(1)}
                        </div>
                        <div className="summary-label">Win Rate</div>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon">💰</div>
                    <div className="summary-content">
                        <div className={`summary-value ${(summary?.totalPnL || 0) >= 0 ? 'positive' : 'negative'}`}>
                            {formatCurrency(summary?.totalPnL || 0)}
                        </div>
                        <div className="summary-label">Toplam P/L</div>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon">📊</div>
                    <div className="summary-content">
                        <div className={`summary-value ${(summary?.averagePnL || 0) >= 0 ? 'positive' : 'negative'}`}>
                            {formatCurrency(summary?.averagePnL || 0)}
                        </div>
                        <div className="summary-label">Ortalama P/L</div>
                    </div>
                </div>
            </div>

            {/* Chart Tabs */}
            <div className="chart-section glass-card">
                <div className="chart-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'emotion' ? 'active' : ''}`}
                        onClick={() => setActiveTab('emotion')}
                    >
                        🎭 Duygu Bazlı
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'coin' ? 'active' : ''}`}
                        onClick={() => setActiveTab('coin')}
                    >
                        💎 Coin Bazlı
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'strategy' ? 'active' : ''}`}
                        onClick={() => setActiveTab('strategy')}
                    >
                        🎯 Strateji Bazlı
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'time' ? 'active' : ''}`}
                        onClick={() => setActiveTab('time')}
                    >
                        ⏰ Saat Bazlı
                    </button>
                </div>

                <div className="chart-container">
                    {activeTab === 'emotion' && (
                        <div className="chart-wrapper">
                            <h3>Duygu Durumuna Göre P/L</h3>
                            {byEmotion.length === 0 ? (
                                <p className="no-data">Duygu verisi bulunamadı. İşlemlerinize duygu ekleyin!</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={getEmotionChartData()}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                                        <XAxis dataKey="name" stroke="#a0a0b0" fontSize={12} />
                                        <YAxis stroke="#a0a0b0" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{ background: '#1a1a25', border: '1px solid #2a2a35', borderRadius: '8px' }}
                                            labelStyle={{ color: '#fff' }}
                                        />
                                        <Bar dataKey="pnl" name="P/L">
                                            {getEmotionChartData().map((entry, index) => (
                                                <Cell key={index} fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    )}

                    {activeTab === 'coin' && (
                        <div className="chart-wrapper">
                            <h3>Coin Bazlı Performans</h3>
                            {byCoin.length === 0 ? (
                                <p className="no-data">Coin verisi bulunamadı.</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={getCoinChartData()}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                                        <XAxis dataKey="name" stroke="#a0a0b0" fontSize={12} />
                                        <YAxis stroke="#a0a0b0" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{ background: '#1a1a25', border: '1px solid #2a2a35', borderRadius: '8px' }}
                                            labelStyle={{ color: '#fff' }}
                                        />
                                        <Bar dataKey="pnl" name="P/L">
                                            {getCoinChartData().map((entry, index) => (
                                                <Cell key={index} fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    )}

                    {activeTab === 'strategy' && (
                        <div className="chart-wrapper">
                            <h3>Strateji Bazlı Performans</h3>
                            {byStrategy.length === 0 ? (
                                <p className="no-data">Strateji verisi bulunamadı. İşlemlerinize strateji ekleyin!</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={getStrategyChartData()}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                                        <XAxis dataKey="name" stroke="#a0a0b0" fontSize={12} />
                                        <YAxis stroke="#a0a0b0" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{ background: '#1a1a25', border: '1px solid #2a2a35', borderRadius: '8px' }}
                                            labelStyle={{ color: '#fff' }}
                                        />
                                        <Bar dataKey="pnl" name="P/L">
                                            {getStrategyChartData().map((entry, index) => (
                                                <Cell key={index} fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    )}

                    {activeTab === 'time' && (
                        <div className="chart-wrapper">
                            <h3>Saat Bazlı Performans</h3>
                            {byTime.length === 0 ? (
                                <p className="no-data">Zaman verisi bulunamadı.</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={getTimeChartData()}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                                        <XAxis dataKey="name" stroke="#a0a0b0" fontSize={12} />
                                        <YAxis stroke="#a0a0b0" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{ background: '#1a1a25', border: '1px solid #2a2a35', borderRadius: '8px' }}
                                            labelStyle={{ color: '#fff' }}
                                        />
                                        <Bar dataKey="pnl" name="P/L">
                                            {getTimeChartData().map((entry, index) => (
                                                <Cell key={index} fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Data Tables */}
            <div className="tables-grid">
                {activeTab === 'emotion' && byEmotion.length > 0 && (
                    <div className="data-table glass-card">
                        <h3>Duygu Detayları</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Duygu</th>
                                    <th>İşlem</th>
                                    <th>Win Rate</th>
                                    <th>Toplam P/L</th>
                                </tr>
                            </thead>
                            <tbody>
                                {byEmotion.map((item, index) => (
                                    <tr key={index}>
                                        <td>{EmotionLabels[item.emotion]?.emoji} {EmotionLabels[item.emotion]?.label}</td>
                                        <td>{item.tradeCount}</td>
                                        <td className={item.winRate >= 50 ? 'text-success' : 'text-danger'}>
                                            %{item.winRate.toFixed(1)}
                                        </td>
                                        <td className={item.totalPnL >= 0 ? 'text-success' : 'text-danger'}>
                                            {formatCurrency(item.totalPnL)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'coin' && byCoin.length > 0 && (
                    <div className="data-table glass-card">
                        <h3>Coin Detayları</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Coin</th>
                                    <th>İşlem</th>
                                    <th>Win Rate</th>
                                    <th>Toplam P/L</th>
                                </tr>
                            </thead>
                            <tbody>
                                {byCoin.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.coin}</td>
                                        <td>{item.tradeCount}</td>
                                        <td className={item.winRate >= 50 ? 'text-success' : 'text-danger'}>
                                            %{item.winRate.toFixed(1)}
                                        </td>
                                        <td className={item.totalPnL >= 0 ? 'text-success' : 'text-danger'}>
                                            {formatCurrency(item.totalPnL)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'strategy' && byStrategy.length > 0 && (
                    <div className="data-table glass-card">
                        <h3>Strateji Detayları</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Strateji</th>
                                    <th>İşlem</th>
                                    <th>Win Rate</th>
                                    <th>Toplam P/L</th>
                                </tr>
                            </thead>
                            <tbody>
                                {byStrategy.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.strategy}</td>
                                        <td>{item.tradeCount}</td>
                                        <td className={item.winRate >= 50 ? 'text-success' : 'text-danger'}>
                                            %{item.winRate.toFixed(1)}
                                        </td>
                                        <td className={item.totalPnL >= 0 ? 'text-success' : 'text-danger'}>
                                            {formatCurrency(item.totalPnL)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsPage;
