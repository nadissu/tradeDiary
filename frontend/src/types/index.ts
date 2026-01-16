export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export enum TradeDirection {
  Long = 0,
  Short = 1
}

export enum TradeEmotion {
  FOMO = 0,
  Fear = 1,
  Greed = 2,
  Revenge = 3,
  Confident = 4,
  Uncertain = 5,
  Calm = 6,
  Excited = 7,
  Anxious = 8
}

export const EmotionLabels: Record<TradeEmotion, { label: string; emoji: string }> = {
  [TradeEmotion.FOMO]: { label: 'FOMO', emoji: '😰' },
  [TradeEmotion.Fear]: { label: 'Korku', emoji: '😨' },
  [TradeEmotion.Greed]: { label: 'Açgözlülük', emoji: '🤑' },
  [TradeEmotion.Revenge]: { label: 'İntikam', emoji: '😤' },
  [TradeEmotion.Confident]: { label: 'Güvenli', emoji: '😎' },
  [TradeEmotion.Uncertain]: { label: 'Kararsız', emoji: '🤔' },
  [TradeEmotion.Calm]: { label: 'Sakin', emoji: '😌' },
  [TradeEmotion.Excited]: { label: 'Heyecanlı', emoji: '🤩' },
  [TradeEmotion.Anxious]: { label: 'Endişeli', emoji: '😟' }
};

export const DirectionLabels: Record<TradeDirection, string> = {
  [TradeDirection.Long]: 'Long',
  [TradeDirection.Short]: 'Short'
};

export interface Trade {
  id: string;
  coin: string;
  entryPrice: number;
  exitPrice: number | null;
  leverage: number;
  positionSize: number;
  direction: TradeDirection;
  entryTime: string;
  exitTime: string | null;
  pnL: number | null;
  pnLPercent: number | null;
  timeframe: string;
  strategy: string | null;
  emotion: TradeEmotion | null;
  notes: string | null;
  isFromBot: boolean;
  botName: string | null;
  createdAt: string;
}

export interface CreateTradeDto {
  coin: string;
  entryPrice: number;
  positionSize: number;
  direction: TradeDirection;
  entryTime: string;
  exitPrice?: number;
  leverage?: number;
  exitTime?: string;
  timeframe?: string;
  strategy?: string;
  emotion?: TradeEmotion;
  notes?: string;
  isFromBot?: boolean;
  botName?: string;
}

export interface AnalyticsSummary {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnL: number;
  averagePnL: number;
  bestTrade: number;
  worstTrade: number;
  averageWin: number;
  averageLoss: number;
}

export interface PerformanceByEmotion {
  emotion: TradeEmotion;
  tradeCount: number;
  winRate: number;
  totalPnL: number;
  averagePnL: number;
}

export interface PerformanceByCoin {
  coin: string;
  tradeCount: number;
  winRate: number;
  totalPnL: number;
  averagePnL: number;
}

export interface PerformanceByStrategy {
  strategy: string;
  tradeCount: number;
  winRate: number;
  totalPnL: number;
  averagePnL: number;
}

export interface PerformanceByTime {
  hour: number;
  tradeCount: number;
  winRate: number;
  totalPnL: number;
}

export interface Insight {
  type: 'Warning' | 'Tip' | 'Achievement';
  title: string;
  message: string;
  emoji: string | null;
}

export interface AnalyticsInsights {
  insights: Insight[];
}
