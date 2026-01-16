import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tradeService } from '../services/tradeService';
import { TradeDirection, TradeEmotion, EmotionLabels, CreateTradeDto } from '../types';
import './NewTradePage.css';

const timeframes = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'];
const strategies = ['Scalping', 'Day Trading', 'Swing Trading', 'DCA', 'Breakout', 'RSI', 'MACD', 'EMA Cross', 'Support/Resistance', 'Diğer'];

const NewTradePage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        coin: '',
        direction: TradeDirection.Long,
        entryPrice: '',
        exitPrice: '',
        positionSize: '',
        leverage: '1',
        entryTime: new Date().toISOString().slice(0, 16),
        exitTime: '',
        timeframe: '1h',
        strategy: '',
        emotion: null as TradeEmotion | null,
        notes: '',
        isFromBot: false,
        botName: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleEmotionSelect = (emotion: TradeEmotion) => {
        setFormData(prev => ({
            ...prev,
            emotion: prev.emotion === emotion ? null : emotion
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const trade: CreateTradeDto = {
                coin: formData.coin.toUpperCase(),
                direction: formData.direction,
                entryPrice: parseFloat(formData.entryPrice),
                positionSize: parseFloat(formData.positionSize),
                entryTime: new Date(formData.entryTime).toISOString(),
                leverage: parseInt(formData.leverage),
                timeframe: formData.timeframe,
                strategy: formData.strategy || undefined,
                emotion: formData.emotion ?? undefined,
                notes: formData.notes || undefined,
                isFromBot: formData.isFromBot,
                botName: formData.isFromBot ? formData.botName : undefined
            };

            if (formData.exitPrice) {
                trade.exitPrice = parseFloat(formData.exitPrice);
            }
            if (formData.exitTime) {
                trade.exitTime = new Date(formData.exitTime).toISOString();
            }

            await tradeService.createTrade(trade);
            navigate('/trades');
        } catch (err: any) {
            setError(err.response?.data?.message || 'İşlem kaydedilemedi. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page container fade-in">
            <div className="new-trade-header">
                <h1>Yeni İşlem Ekle</h1>
            </div>

            <form onSubmit={handleSubmit} className="trade-form glass-card">
                {error && <div className="form-error">{error}</div>}

                {/* Basic Info */}
                <div className="form-section">
                    <h3>📊 Temel Bilgiler</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Coin *</label>
                            <input
                                type="text"
                                name="coin"
                                className="form-input"
                                value={formData.coin}
                                onChange={handleChange}
                                placeholder="BTC, ETH, SOL..."
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Yön *</label>
                            <div className="direction-toggle">
                                <button
                                    type="button"
                                    className={`direction-btn ${formData.direction === TradeDirection.Long ? 'active long' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, direction: TradeDirection.Long }))}
                                >
                                    📈 Long
                                </button>
                                <button
                                    type="button"
                                    className={`direction-btn ${formData.direction === TradeDirection.Short ? 'active short' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, direction: TradeDirection.Short }))}
                                >
                                    📉 Short
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trade Details */}
                <div className="form-section">
                    <h3>💰 İşlem Detayları</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Giriş Fiyatı *</label>
                            <input
                                type="number"
                                name="entryPrice"
                                className="form-input"
                                value={formData.entryPrice}
                                onChange={handleChange}
                                placeholder="0.00"
                                step="any"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Çıkış Fiyatı</label>
                            <input
                                type="number"
                                name="exitPrice"
                                className="form-input"
                                value={formData.exitPrice}
                                onChange={handleChange}
                                placeholder="0.00"
                                step="any"
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Pozisyon Büyüklüğü ($) *</label>
                            <input
                                type="number"
                                name="positionSize"
                                className="form-input"
                                value={formData.positionSize}
                                onChange={handleChange}
                                placeholder="100"
                                step="any"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Kaldıraç</label>
                            <input
                                type="number"
                                name="leverage"
                                className="form-input"
                                value={formData.leverage}
                                onChange={handleChange}
                                min="1"
                                max="125"
                            />
                        </div>
                    </div>
                </div>

                {/* Timing */}
                <div className="form-section">
                    <h3>⏱️ Zamanlama</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Giriş Zamanı *</label>
                            <input
                                type="datetime-local"
                                name="entryTime"
                                className="form-input"
                                value={formData.entryTime}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Çıkış Zamanı</label>
                            <input
                                type="datetime-local"
                                name="exitTime"
                                className="form-input"
                                value={formData.exitTime}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Timeframe</label>
                            <select
                                name="timeframe"
                                className="form-select"
                                value={formData.timeframe}
                                onChange={handleChange}
                            >
                                {timeframes.map(tf => (
                                    <option key={tf} value={tf}>{tf}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Strategy */}
                <div className="form-section">
                    <h3>🎯 Strateji</h3>
                    <div className="form-group">
                        <label className="form-label">Strateji</label>
                        <select
                            name="strategy"
                            className="form-select"
                            value={formData.strategy}
                            onChange={handleChange}
                        >
                            <option value="">Seçiniz...</option>
                            {strategies.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Emotion */}
                <div className="form-section">
                    <h3>🎭 Duygu Durumu</h3>
                    <p className="section-hint">Bu işlemi açarken nasıl hissediyordun?</p>
                    <div className="emotion-picker">
                        {Object.entries(EmotionLabels).map(([key, { label, emoji }]) => (
                            <button
                                key={key}
                                type="button"
                                className={`emotion-option ${formData.emotion === parseInt(key) ? 'selected' : ''}`}
                                onClick={() => handleEmotionSelect(parseInt(key) as TradeEmotion)}
                            >
                                <span className="emotion-emoji">{emoji}</span>
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notes */}
                <div className="form-section">
                    <h3>📝 Notlar</h3>
                    <div className="form-group">
                        <textarea
                            name="notes"
                            className="form-textarea"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Neden bu işlemi açtın? Ne gördün? Neyi farklı yapardın?"
                            rows={4}
                        />
                    </div>
                </div>

                {/* Bot Info */}
                <div className="form-section">
                    <h3>🤖 Bot Bilgisi</h3>
                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="isFromBot"
                                checked={formData.isFromBot}
                                onChange={handleChange}
                            />
                            <span>Bu işlem bir bot tarafından açıldı</span>
                        </label>
                    </div>
                    {formData.isFromBot && (
                        <div className="form-group">
                            <label className="form-label">Bot Adı</label>
                            <input
                                type="text"
                                name="botName"
                                className="form-input"
                                value={formData.botName}
                                onChange={handleChange}
                                placeholder="Bot adı..."
                            />
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/trades')}>
                        İptal
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Kaydediliyor...' : '💾 İşlemi Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewTradePage;
