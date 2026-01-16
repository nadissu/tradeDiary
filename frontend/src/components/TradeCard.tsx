import React from 'react';
import { Trade, TradeDirection, TradeEmotion, EmotionLabels, DirectionLabels } from '../types';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import './TradeCard.css';

interface TradeCardProps {
    trade: Trade;
    onClick?: () => void;
}

const TradeCard: React.FC<TradeCardProps> = ({ trade, onClick }) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(value);
    };

    const formatPercent = (value: number) => {
        return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
    };

    return (
        <div className="trade-card" onClick={onClick}>
            <div className="trade-header">
                <div className="trade-coin">
                    <span className="coin-name">{trade.coin}</span>
                    <span className={`direction-badge direction-${trade.direction === TradeDirection.Long ? 'long' : 'short'}`}>
                        {DirectionLabels[trade.direction]}
                    </span>
                    {trade.isFromBot && (
                        <span className="bot-badge">🤖 {trade.botName || 'Bot'}</span>
                    )}
                </div>
                <div className="trade-time">
                    {format(new Date(trade.entryTime), 'dd MMM yyyy HH:mm', { locale: tr })}
                </div>
            </div>

            <div className="trade-details">
                <div className="detail-row">
                    <span className="detail-label">Entry</span>
                    <span className="detail-value">{formatCurrency(trade.entryPrice)}</span>
                </div>
                {trade.exitPrice && (
                    <div className="detail-row">
                        <span className="detail-label">Exit</span>
                        <span className="detail-value">{formatCurrency(trade.exitPrice)}</span>
                    </div>
                )}
                <div className="detail-row">
                    <span className="detail-label">Leverage</span>
                    <span className="detail-value">{trade.leverage}x</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Size</span>
                    <span className="detail-value">{formatCurrency(trade.positionSize)}</span>
                </div>
            </div>

            {trade.pnL !== null && (
                <div className={`trade-pnl ${trade.pnL >= 0 ? 'positive' : 'negative'}`}>
                    <span className="pnl-value">{formatCurrency(trade.pnL)}</span>
                    <span className="pnl-percent">{formatPercent(trade.pnLPercent || 0)}</span>
                </div>
            )}

            <div className="trade-footer">
                {trade.emotion !== null && (
                    <span className="trade-emotion">
                        {EmotionLabels[trade.emotion].emoji} {EmotionLabels[trade.emotion].label}
                    </span>
                )}
                {trade.strategy && (
                    <span className="trade-strategy">{trade.strategy}</span>
                )}
                <span className="trade-timeframe">{trade.timeframe}</span>
            </div>
        </div>
    );
};

export default TradeCard;
