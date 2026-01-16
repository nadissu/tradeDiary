import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage: React.FC = () => {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-header">
                    <div className="brand">
                        <span className="brand-icon">📊</span>
                        <span className="brand-name">Trade Diary</span>
                    </div>
                    <div className="auth-buttons">
                        <Link to="/login" className="btn-login">Giriş Yap</Link>
                        <Link to="/register" className="btn-register">Kayıt Ol</Link>
                    </div>
                </div>

                <div className="hero-content">
                    <h1 className="hero-title">
                        Duygularını Sustur,<br />
                        <span className="gradient-text">Gerçeği Gör</span>
                    </h1>
                    <p className="hero-subtitle">
                        Trade'lerini kaydeden, hatalarını analiz eden, seni gelişmeye zorlayan günlük.
                    </p>
                    <div className="hero-cta">
                        <Link to="/register" className="btn-primary-large">
                            Ücretsiz Başla 🚀
                        </Link>
                        <p className="cta-note">Kredi kartı gerektirmez</p>
                    </div>
                </div>

                <div className="hero-stats">
                    <div className="stat-item">
                        <div className="stat-number">📈</div>
                        <div className="stat-label">Her İşlemi Kaydet</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">🧠</div>
                        <div className="stat-label">AI İçgörüleri</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">📊</div>
                        <div className="stat-label">Detaylı Analiz</div>
                    </div>
                </div>
            </div>

            {/* Problem Section */}
            <div className="problem-section">
                <h2>🤔 Tanıdık Geliyor mu?</h2>
                <div className="problems-grid">
                    <div className="problem-card">
                        <span className="problem-icon">❓</span>
                        <h3>"Bugün neden zarar ettim?"</h3>
                        <p>→ Bilmiyorum...</p>
                    </div>
                    <div className="problem-card">
                        <span className="problem-icon">🤷</span>
                        <h3>"Hangi strateji çalışıyor?"</h3>
                        <p>→ Sanki şu... Ama emin değilim</p>
                    </div>
                    <div className="problem-card">
                        <span className="problem-icon">😰</span>
                        <h3>"Nerede hata yapıyorum?"</h3>
                        <p>→ Genelde psikoloji ama...</p>
                    </div>
                </div>
                <div className="problem-reason">
                    <h3>📌 Çünkü:</h3>
                    <ul>
                        <li>✗ Hafızana güveniyorsun</li>
                        <li>✗ Not almıyorsun</li>
                        <li>✗ Objektif verin yok</li>
                    </ul>
                </div>
            </div>

            {/* Solution Section */}
            <div className="solution-section">
                <h2>✅ Çözüm: Trade Diary</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📝</div>
                        <h3>Manuel & Bot Trade Kaydı</h3>
                        <p>İster elle gir, ister bot'tan import et. Her trade kaydedilir, hiçbiri kaybolmaz.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎭</div>
                        <h3>Duygu Analizi</h3>
                        <p><strong>"FOMO ile açtığın işlemlerin %70'i zararda"</strong> - Tokat etkisi.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Grafik & İstatistikler</h3>
                        <p>Coin, strateji, zaman bazlı performans. Neyin çalışıp neyin çalışmadığını gör.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🧠</div>
                        <h3>Akıllı İçgörüler</h3>
                        <p>Sistem seni tanıyor: "Gece trade yapma", "Bu coin sana uymuyor", "Revenge trade'den uzak dur".</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🤖</div>
                        <h3>Bot Import</h3>
                        <p>Bot'un yaptığı yüzlerce trade'i tek tıkla içeri aktar. Hangi saatlerde verimsiz olduğunu gör.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎯</div>
                        <h3>Strateji Takibi</h3>
                        <p>DCA mı, Scalping mi, Swing mi? Hangi strateji karlı, hangisi değil - hepsi net.</p>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="how-section">
                <h2>🎬 Nasıl Çalışır?</h2>
                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <h3>Trade'leri Kaydet</h3>
                        <p>Manuel veya bot import ile işlemlerini sisteme ekle</p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">2</div>
                        <h3>Duygularını İşaretle</h3>
                        <p>FOMO mu, Fear mi, Confident mi? Hangi durumdaydın?</p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">3</div>
                        <h3>İçgörüleri Al</h3>
                        <p>Sistem sana gerçekleri söyler. Acı ama gerekli.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">4</div>
                        <h3>Gelişmeye Başla</h3>
                        <p>Hangi hatayı tekrarlıyorsan, artık biliyorsun.</p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="final-cta-section">
                <h2>🚀 Duygularını Değil, Verileri Takip Et</h2>
                <p>Başarılı trader'lar not alır. Sen de al.</p>
                <Link to="/register" className="btn-primary-large">
                    Ücretsiz Başla
                </Link>
                <p className="cta-note">Hesap oluşturmak 30 saniye sürer</p>
            </div>

            {/* Footer */}
            <div className="landing-footer">
                <p>Trade Diary © 2026 - Daha iyi trader ol.</p>
            </div>
        </div>
    );
};

export default LandingPage;
