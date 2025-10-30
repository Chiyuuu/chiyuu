import React, { useState, useMemo } from 'react';
import type { LogEntry } from '../types';
import { MOODS, POST_MEAL_FEELINGS } from '../constants';

interface JournalProps {
  logs: LogEntry[];
}

const LogCard: React.FC<{ log: LogEntry }> = ({ log }) => {
    const moodInfo = MOODS.find(m => m.name === log.mood);
    const feelingInfo = POST_MEAL_FEELINGS.find(f => f.name === log.postMealFeeling);

    const formattedDate = new Date(log.timestamp).toLocaleString('zh-CN', {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="bg-white p-4 rounded-xl shadow-md animate-fadeIn transition-transform transform hover:scale-105">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                    {moodInfo ? (
                        <span className={`mr-3 ${moodInfo.color}`}>{moodInfo.icon}</span>
                    ) : (
                        <span className="mr-3 w-8 h-8 flex items-center justify-center text-2xl">✍️</span>
                    )}
                    <span className="font-bold text-lg text-brand-text">{log.mood}</span>
                </div>
                <span className="text-xs text-brand-text-light whitespace-nowrap">{formattedDate}</span>
            </div>
            <div className="space-y-3 text-brand-text">
                <p><span className="font-semibold">食物：</span>{log.whatAte}</p>
                <div>
                    <label className="font-semibold text-sm">身体饥饿感：{log.physicalHunger}/10</label>
                    <progress className="w-full h-2 rounded-lg [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-slate-200 [&::-webkit-progress-value]:bg-brand-primary [&::-moz-progress-bar]:bg-brand-primary" value={log.physicalHunger} max="10"></progress>
                </div>
                 {feelingInfo && (
                    <p className="flex items-center"><span className="font-semibold">餐后感觉：</span><span className="ml-2 text-2xl">{feelingInfo.icon}</span> {feelingInfo.name}</p>
                )}
            </div>
        </div>
    );
};

const Journal: React.FC<JournalProps> = ({ logs }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMood, setSelectedMood] = useState('all');

    const uniqueMoods = useMemo(() => {
        const moods = new Set(logs.map(log => log.mood));
        return Array.from(moods);
    }, [logs]);

    const filteredLogs = useMemo(() => {
        if (!logs) return [];
        return logs.filter(log => {
            const searchMatch = log.whatAte.toLowerCase().includes(searchQuery.toLowerCase());
            const moodMatch = selectedMood === 'all' || log.mood === selectedMood;
            return searchMatch && moodMatch;
        });
    }, [logs, searchQuery, selectedMood]);

    if (logs.length === 0) {
        return (
            <div className="text-center p-8 flex flex-col items-center h-full justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-brand-text-light mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                <h2 className="text-xl font-bold text-brand-text">您的日记还是空的</h2>
                <p className="text-brand-text-light mt-2 max-w-xs">开始记录，来填充您的专属时间线吧。</p>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 w-full h-full max-w-4xl mx-auto flex flex-col">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-brand-text mb-4">我的日记</h1>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="search"
                        placeholder="搜索食物..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-grow p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary"
                    />
                    <select
                        value={selectedMood}
                        onChange={(e) => setSelectedMood(e.target.value)}
                         className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary bg-white"
                    >
                        <option value="all">所有情绪</option>
                        {uniqueMoods.map(mood => <option key={mood} value={mood}>{mood}</option>)}
                    </select>
                </div>
            </header>
            <main className="flex-grow overflow-y-auto space-y-4 pb-16">
                 {filteredLogs.length > 0 ? (
                    filteredLogs.map(log => <LogCard key={log.id} log={log} />)
                ) : (
                    <p className="text-center text-brand-text-light mt-8">没有找到匹配的记录。</p>
                )}
            </main>
        </div>
    );
};

export default Journal;