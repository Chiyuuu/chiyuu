import React, { useMemo } from 'react';
import type { LogEntry } from '../types';
import { getMostFrequentTrigger, getHighRiskTime, generateSuggestion } from '../services/analysis';
import { MOODS } from '../constants';

interface InsightsProps {
  logs: LogEntry[];
}

// FIX: Replaced JSX.Element with React.ReactNode to fix "Cannot find namespace 'JSX'" error.
const InsightCard: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white rounded-xl shadow-md p-6 animate-fadeIn">
        <div className="flex items-center mb-3">
            <div className="text-brand-primary mr-3">{icon}</div>
            <h3 className="font-bold text-lg text-brand-text">{title}</h3>
        </div>
        <div className="text-brand-text-light">{children}</div>
    </div>
);

const Insights: React.FC<InsightsProps> = ({ logs }) => {
  const analysis = useMemo(() => {
    const trigger = getMostFrequentTrigger(logs);
    const riskTime = getHighRiskTime(logs);
    const suggestion = generateSuggestion(trigger, riskTime);
    return { trigger, riskTime, suggestion };
  }, [logs]);

  if (logs.length < 1) {
    return (
        <div className="text-center p-8 flex flex-col items-center h-full justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-brand-text-light mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
            <h2 className="text-xl font-bold text-brand-text">您的洞察报告</h2>
            <p className="text-brand-text-light mt-2 max-w-xs">开始记录一个时刻，发现您的个人模式。</p>
        </div>
    )
  }

  const triggerMood = MOODS.find(m => m.name === analysis.trigger);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold text-brand-text">您的个人模式</h1>

       <InsightCard 
            title="最强触发器"
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51-2.222m2.51 2.222l2.222-2.51m-2.222 2.51l2.222 2.51M3.34 16.6s.055-.165.055-.386c0-.13-0.011-.256-.055-.386m13.344 0c-.044.13-.055.256-.055.386 0 .221.011.346.055.386m-13.344 0a3.752 3.752 0 013.75-3.75h6.75a3.752 3.752 0 013.75 3.75m-14.25 0h15" /></svg>}
        >
        {analysis.trigger ? (
            <div className="flex items-center">
                {triggerMood && <span className={`mr-3 ${triggerMood.color}`}>{triggerMood.icon}</span>}
                <p>我们发现，<span className="font-bold">“{analysis.trigger}”</span> 的感觉常常与您的进食行为相关联。</p>
            </div>
            ) : <p>数据不足。请继续记录，以发现您的主要触发器！</p>}
      </InsightCard>

       <InsightCard 
            title="高危时刻"
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        >
        {analysis.riskTime ? (
            <p>您似乎最可能在 <span className="font-bold">{analysis.riskTime.day}{analysis.riskTime.time}</span> 经历情绪性进食。</p>
        ) : <p>我们仍在学习您的每周节律。更多的记录将揭示您的高危时段。</p>}
      </InsightCard>
      
       <InsightCard 
            title="一个积极的改变"
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311l-3.75 0M12 12.75h.008v.008H12v-.008z" /></svg>}
        >
         <p>{analysis.suggestion}</p>
      </InsightCard>

    </div>
  );
};

export default Insights;
