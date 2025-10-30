import React, { useState, useEffect, useCallback } from 'react';
import EmotionalLog from './components/EmotionalLog';
import Insights from './components/Insights';
import FirstAidKit from './components/FirstAidKit';
import type { LogEntry } from './types';

type View = 'log' | 'insights';

const App: React.FC = () => {
    const [view, setView] = useState<View>('log');
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isFirstAidOpen, setIsFirstAidOpen] = useState(false);
    const [pendingCheckIn, setPendingCheckIn] = useState<LogEntry | null>(null);
    
    useEffect(() => {
        try {
            const savedLogs = localStorage.getItem('mindfulMorselLogs');
            if (savedLogs) {
                const parsedLogs: LogEntry[] = JSON.parse(savedLogs);
                setLogs(parsedLogs);
                
                // Check for pending post-meal check-in
                if (parsedLogs.length > 0) {
                    const latestLog = parsedLogs[0];
                    if (latestLog && !latestLog.postMealFeeling) {
                        const timeSinceLog = Date.now() - latestLog.timestamp;
                        const fifteenMinutes = 15 * 60 * 1000;
                        const twoHours = 2 * 60 * 60 * 1000;
                        if (timeSinceLog > fifteenMinutes && timeSinceLog < twoHours) {
                            setPendingCheckIn(latestLog);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Failed to load or parse logs from localStorage", error);
        }
    }, []);

    useEffect(() => {
        try {
            // Avoid saving an empty array on initial load
            if (logs.length > 0 || localStorage.getItem('mindfulMorselLogs')) {
               localStorage.setItem('mindfulMorselLogs', JSON.stringify(logs));
            }
        } catch (error) {
            console.error("Failed to save logs to localStorage", error);
        }
    }, [logs]);

    const addLog = useCallback((logData: Omit<LogEntry, 'id' | 'timestamp'>) => {
        const newLog: LogEntry = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            ...logData
        };
        setLogs(prevLogs => [newLog, ...prevLogs]);
    }, []);

    const updateLog = useCallback((updatedLog: LogEntry) => {
        setLogs(prevLogs => prevLogs.map(log => log.id === updatedLog.id ? updatedLog : log));
    }, []);

    const clearPendingCheckIn = useCallback(() => {
        setPendingCheckIn(null);
    }, []);

    // FIX: Refactored NavItem to use React.FC for better type inference, resolving issues with the 'children' prop.
    const NavItem: React.FC<{ activeView: View; targetView: View; children: React.ReactNode; }> = ({ activeView, targetView, children }) => (
        <button
            onClick={() => setView(targetView)}
            className={`flex-1 flex flex-col items-center justify-center p-2 transition-colors ${activeView === targetView ? 'text-brand-primary' : 'text-brand-text-light'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="min-h-screen flex flex-col font-sans text-brand-text">
            <main className="flex-grow flex flex-col justify-center items-center">
                {view === 'log' && (
                    <EmotionalLog
                        addLog={addLog}
                        requestFirstAid={() => setIsFirstAidOpen(true)}
                        pendingCheckIn={pendingCheckIn}
                        updateLog={updateLog}
                        clearPendingCheckIn={clearPendingCheckIn}
                    />
                )}
                {view === 'insights' && <Insights logs={logs} />}
            </main>

            <nav className="sticky bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex h-16">
                <NavItem activeView={view} targetView='log'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    <span className="text-xs font-medium">记录</span>
                </NavItem>
                <NavItem activeView={view} targetView='insights'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
                    <span className="text-xs font-medium">洞察</span>
                </NavItem>
            </nav>

            <FirstAidKit isOpen={isFirstAidOpen} onClose={() => setIsFirstAidOpen(false)} />
        </div>
    );
};

export default App;
