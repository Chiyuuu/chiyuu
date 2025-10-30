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
        return "请继续记录您的时刻以发现您的模式。您做得很好！";
    }
    if (riskTime) {
        return `您的数据显示，${riskTime.day}${riskTime.time}可能是一个充满挑战的时刻。下周，当那个时候到来时，也许可以先尝试一次“暂停”呼吸练习。这可能会带来不同。`;
    }
    if (trigger) {
        return `看起来“${trigger}”是一种常见的情绪触发器。当您注意到这种感觉时，请尝试使用“感官转移”工具之一，与当下重新建立联系。`;
    }
    return "每一次记录都有助于您更好地了解自己。请继续加油！";
}
