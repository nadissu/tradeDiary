import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tradeService } from '../services/tradeService';
import { TradeDirection } from '../types';
import './ImportPage.css';

interface ImportRow {
    coin: string;
    entryPrice: string;
    exitPrice: string;
    positionSize: string;
    direction: 'Long' | 'Short';
    entryTime: string;
    exitTime: string;
    leverage: string;
    botName: string;
}

const ImportPage: React.FC = () => {
    const navigate = useNavigate();
    const [csvData, setCsvData] = useState('');
    const [parsedRows, setParsedRows] = useState<ImportRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const sampleCSV = `coin,entryPrice,exitPrice,positionSize,direction,entryTime,exitTime,leverage,botName
BTC,42000,43500,1000,Long,2024-01-15 10:30,2024-01-15 14:30,10,GridBot
ETH,2200,2150,500,Short,2024-01-15 11:00,2024-01-15 13:00,5,DCABot
SOL,95,102,300,Long,2024-01-15 09:00,2024-01-15 16:00,3,ScalpBot`;

    const parseCSV = (csv: string) => {
        const lines = csv.trim().split('\n');
        if (lines.length < 2) {
            setError('CSV en az başlık ve bir veri satırı içermelidir.');
            return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const requiredHeaders = ['coin', 'entryprice', 'exitprice', 'positionsize', 'direction', 'entrytime', 'exittime'];

        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
            setError(`Eksik sütunlar: ${missingHeaders.join(', ')}`);
            return;
        }

        const rows: ImportRow[] = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length < headers.length) continue;

            const row: any = {};
            headers.forEach((header, index) => {
                row[header] = values[index];
            });

            rows.push({
                coin: row.coin || '',
                entryPrice: row.entryprice || '',
                exitPrice: row.exitprice || '',
                positionSize: row.positionsize || '',
                direction: row.direction?.toLowerCase() === 'short' ? 'Short' : 'Long',
                entryTime: row.entrytime || '',
                exitTime: row.exittime || '',
                leverage: row.leverage || '1',
                botName: row.botname || 'Unknown Bot'
            });
        }

        setParsedRows(rows);
        setError('');
    };

    const handleParse = () => {
        if (!csvData.trim()) {
            setError('CSV verisini giriniz.');
            return;
        }
        parseCSV(csvData);
    };

    const handleImport = async () => {
        if (parsedRows.length === 0) {
            setError('Import edilecek veri bulunamadı.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const trades = parsedRows.map(row => ({
                coin: row.coin,
                entryPrice: parseFloat(row.entryPrice),
                exitPrice: parseFloat(row.exitPrice),
                positionSize: parseFloat(row.positionSize),
                direction: row.direction === 'Short' ? TradeDirection.Short : TradeDirection.Long,
                entryTime: new Date(row.entryTime).toISOString(),
                exitTime: new Date(row.exitTime).toISOString(),
                leverage: parseInt(row.leverage) || 1,
                botName: row.botName
            }));

            const result = await tradeService.importBotTrades(trades);
            setSuccess(result.message);
            setParsedRows([]);
            setCsvData('');

            setTimeout(() => {
                navigate('/trades');
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Import başarısız. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    const handleUseSample = () => {
        setCsvData(sampleCSV);
        parseCSV(sampleCSV);
    };

    return (
        <div className="page container fade-in">
            <div className="import-header">
                <h1>🤖 Bot Trade Import</h1>
                <p className="import-subtitle">Bot işlemlerinizi CSV formatında import edin</p>
            </div>

            <div className="import-content">
                <div className="import-section glass-card">
                    <h3>CSV Verisi</h3>
                    <p className="section-hint">
                        İşlemlerinizi CSV formatında yapıştırın. Gerekli sütunlar: coin, entryPrice, exitPrice, positionSize, direction, entryTime, exitTime
                    </p>

                    <textarea
                        className="form-textarea csv-input"
                        value={csvData}
                        onChange={(e) => setCsvData(e.target.value)}
                        placeholder="coin,entryPrice,exitPrice,positionSize,direction,entryTime,exitTime,leverage,botName&#10;BTC,42000,43500,1000,Long,2024-01-15 10:30,2024-01-15 14:30,10,GridBot"
                        rows={8}
                    />

                    <div className="import-actions">
                        <button className="btn btn-secondary" onClick={handleUseSample}>
                            📋 Örnek Veri Kullan
                        </button>
                        <button className="btn btn-primary" onClick={handleParse}>
                            🔍 CSV'yi Ayrıştır
                        </button>
                    </div>
                </div>

                {error && <div className="import-error">{error}</div>}
                {success && <div className="import-success">{success}</div>}

                {parsedRows.length > 0 && (
                    <div className="preview-section glass-card">
                        <div className="preview-header">
                            <h3>📊 Önizleme ({parsedRows.length} işlem)</h3>
                            <button
                                className="btn btn-success"
                                onClick={handleImport}
                                disabled={loading}
                            >
                                {loading ? 'Import ediliyor...' : '✅ Import Et'}
                            </button>
                        </div>

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Coin</th>
                                        <th>Yön</th>
                                        <th>Giriş</th>
                                        <th>Çıkış</th>
                                        <th>Size</th>
                                        <th>Leverage</th>
                                        <th>Bot</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {parsedRows.map((row, index) => (
                                        <tr key={index}>
                                            <td><strong>{row.coin}</strong></td>
                                            <td>
                                                <span className={`direction-badge direction-${row.direction.toLowerCase()}`}>
                                                    {row.direction}
                                                </span>
                                            </td>
                                            <td>${row.entryPrice}</td>
                                            <td>${row.exitPrice}</td>
                                            <td>${row.positionSize}</td>
                                            <td>{row.leverage}x</td>
                                            <td>{row.botName}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="format-guide glass-card">
                    <h3>📖 CSV Format Rehberi</h3>
                    <div className="format-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Sütun</th>
                                    <th>Zorunlu</th>
                                    <th>Açıklama</th>
                                    <th>Örnek</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>coin</td>
                                    <td>✅</td>
                                    <td>Coin sembolü</td>
                                    <td>BTC, ETH, SOL</td>
                                </tr>
                                <tr>
                                    <td>entryPrice</td>
                                    <td>✅</td>
                                    <td>Giriş fiyatı</td>
                                    <td>42000</td>
                                </tr>
                                <tr>
                                    <td>exitPrice</td>
                                    <td>✅</td>
                                    <td>Çıkış fiyatı</td>
                                    <td>43500</td>
                                </tr>
                                <tr>
                                    <td>positionSize</td>
                                    <td>✅</td>
                                    <td>Pozisyon büyüklüğü ($)</td>
                                    <td>1000</td>
                                </tr>
                                <tr>
                                    <td>direction</td>
                                    <td>✅</td>
                                    <td>Long veya Short</td>
                                    <td>Long</td>
                                </tr>
                                <tr>
                                    <td>entryTime</td>
                                    <td>✅</td>
                                    <td>Giriş zamanı</td>
                                    <td>2024-01-15 10:30</td>
                                </tr>
                                <tr>
                                    <td>exitTime</td>
                                    <td>✅</td>
                                    <td>Çıkış zamanı</td>
                                    <td>2024-01-15 14:30</td>
                                </tr>
                                <tr>
                                    <td>leverage</td>
                                    <td>❌</td>
                                    <td>Kaldıraç (varsayılan: 1)</td>
                                    <td>10</td>
                                </tr>
                                <tr>
                                    <td>botName</td>
                                    <td>❌</td>
                                    <td>Bot adı</td>
                                    <td>GridBot</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImportPage;
