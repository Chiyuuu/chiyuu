import type { LogEntry } from '../types';

export function getMostFrequentTrigger(logs: LogEntry[]): string | null {
  if (logs.length === 0) return null;

  const moodCounts = logs.reduce((acc, log) => {
    acc[log.mood] = (acc[log.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostFrequentMood = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b);
  
  return mostFrequentMood;
}

export function getHighRiskTime(logs: LogEntry[]): { day: string; time: string } | null {
    if (logs.length < 3) return null; // Need some data to find a pattern

    const timeSlots: Record<string, number> = {};

    const daysOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const timeOfDayMap = [
        { name: '上午', start: 5, end: 12 },
        { name: '下午', start: 12, end: 17 },
        { name: '晚上', start: 17, end: 21 },
        { name: '深夜', start: 21, end: 24 },
        { name: '凌晨', start: 0, end: 5 },
    ];

    logs.forEach(log => {
        const date = new Date(log.timestamp);
        const day = daysOfWeek[date.getDay()];
        const hour = date.getHours();
        const timePeriod = timeOfDayMap.find(p => hour >= p.start && hour < p.end)?.name || '某个时段';
        const key = `${day} ${timePeriod}`;
        timeSlots[key] = (timeSlots[key] || 0) + 1;
    });

    if (Object.keys(timeSlots).length === 0) return null;

    const mostFrequentSlot = Object.keys(timeSlots).reduce((a, b) => timeSlots[a] > timeSlots[b] ? a : b);
    
    const [day, time] = mostFrequentSlot.split(' ');
    return { day, time: time };
}

export function generateSuggestion(trigger: string | null, riskTime: { day: string; time: string } | null): string {
    if (!trigger && !riskTime) {
        return "请继续记录，探索您的专属模式。您做得很棒！";
    }
    if (riskTime) {
        return `数据显示，${riskTime.day}${riskTime.time}对您来说可能是一个挑战。下周当这个时刻来临时，不妨先试试‘暂停’呼吸练习，看看会不会有新的发现。`;
    }
    if (trigger) {
        return `看起来‘${trigger}’是您常见的情绪诱因。当这种感觉出现时，试试用‘感官转移’工具，让自己和当下重新连接吧。`;
    }
    return "每一次记录，都是一次更深的自我探索。继续加油！";
}