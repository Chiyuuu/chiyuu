export type Mood = '焦虑' | '无聊' | '压力' | '孤独' | '疲惫' | '其他';
export type PostMealFeeling = '满足' | '内疚' | '平静';

export interface LogEntry {
  id: string;
  timestamp: number;
  mood: string; // Using string to allow for custom user-input moods
  physicalHunger: number; // 1-10
  whatAte: string;
  postMealFeeling?: PostMealFeeling;
  postMealTimestamp?: number;
}
