import React, { useState } from 'react';
import type { LogEntry, Mood, PostMealFeeling } from '../types';
import { MOODS, POST_MEAL_FEELINGS } from '../constants';

interface EmotionalLogProps {
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  requestFirstAid: () => void;
  pendingCheckIn: LogEntry | null;
  updateLog: (log: LogEntry) => void;
  clearPendingCheckIn: () => void;
}

const PostMealCheckIn: React.FC<{
    log: LogEntry;
    updateLog: (log: LogEntry) => void;
    onClose: () => void;
}> = ({ log, updateLog, onClose }) => {
    
    const handleFeelingSelect = (feeling: PostMealFeeling) => {
        const updatedLog = {
            ...log,
            postMealFeeling: feeling,
            postMealTimestamp: Date.now()
        };
        updateLog(updatedLog);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-slideInUp">
                <h2 className="text-xl font-bold text-brand-text mb-2">记录餐后感受</h2>
                <p className="text-brand-text-light mb-6">刚才吃完东西，感觉怎么样？</p>
                <div className="flex justify-center space-x-4">
                    {POST_MEAL_FEELINGS.map(({name, icon}) => (
                         <button
                            key={name}
                            onClick={() => handleFeelingSelect(name)}
                            className="flex flex-col items-center space-y-2 text-brand-text hover:text-brand-primary transition-colors"
                         >
                            <span className="text-4xl">{icon}</span>
                            <span className="font-medium">{name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}


const EmotionalLog: React.FC<EmotionalLogProps> = ({ addLog, requestFirstAid, pendingCheckIn, updateLog, clearPendingCheckIn }) => {
  const [step, setStep] = useState(1);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [hungerLevel, setHungerLevel] = useState(5);
  const [whatAte, setWhatAte] = useState('');
  const [isCustomMood, setIsCustomMood] = useState(false);
  const [customMoodText, setCustomMoodText] = useState('');

  const resetLog = () => {
    setStep(1);
    setCurrentMood(null);
    setHungerLevel(5);
    setWhatAte('');
    setIsCustomMood(false);
    setCustomMoodText('');
  };

  const handleMoodSelect = (mood: Mood) => {
    if (mood === '其他') {
      setIsCustomMood(true);
    } else {
      setCurrentMood(mood);
      setStep(2);
    }
  };

  const handleCustomMoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customMoodText.trim()) {
        setCurrentMood(customMoodText.trim());
        setStep(2);
    }
  };
  
  const handleHungerSubmit = () => {
    setStep(3);
  };
  
  const handleFoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMood) {
      addLog({ mood: currentMood, physicalHunger: hungerLevel, whatAte });
      if (hungerLevel <= 4) { // low physical hunger = high emotional hunger
        requestFirstAid();
      }
      resetLog();
    }
  };

  if (pendingCheckIn) {
    return <PostMealCheckIn log={pendingCheckIn} updateLog={updateLog} onClose={clearPendingCheckIn} />;
  }
  
  const renderStep = () => {
    switch (step) {
      case 1:
        if (isCustomMood) {
            return (
                <div className="text-center animate-fadeIn">
                    <button onClick={() => setIsCustomMood(false)} className="text-brand-primary mb-6">&larr; 返回选择情绪</button>
                    <h2 className="text-2xl font-bold text-brand-text mb-2">可以具体说说您的感受吗？</h2>
                    <p className="text-brand-text-light mb-8">请用一两个词来描述它。</p>
                    <form onSubmit={handleCustomMoodSubmit} className="bg-white p-6 rounded-xl shadow-md">
                        <input
                            type="text"
                            value={customMoodText}
                            onChange={(e) => setCustomMoodText(e.target.value)}
                            placeholder="例如：沮丧，兴奋..."
                            className="w-full p-3 border rounded-lg shadow-inner focus:ring-2 focus:ring-brand-primary"
                            required
                            autoFocus
                        />
                        <button type="submit" className="mt-6 bg-brand-primary text-white font-bold py-3 px-6 rounded-full w-full max-w-xs hover:bg-blue-600 transition-colors">下一步</button>
                    </form>
                </div>
            )
        }
        return (
          <div className="text-center animate-fadeIn">
            <h2 className="text-2xl font-bold text-brand-text mb-2">您现在感觉如何？</h2>
            <p className="text-brand-text-light mb-8">请选择一种情绪，开始记录吧。</p>
            <div className="grid grid-cols-3 gap-4">
              {MOODS.map((mood) => (
                <button
                  key={mood.name}
                  onClick={() => handleMoodSelect(mood.name)}
                  className={`p-4 rounded-xl flex flex-col items-center justify-center space-y-2 transition-transform transform hover:scale-105 bg-white shadow-md hover:shadow-lg ${mood.color}`}
                >
                  {mood.icon}
                  <span className="font-semibold text-brand-text">{mood.name}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="text-center animate-fadeIn">
            <button onClick={() => { setIsCustomMood(false); setStep(1); }} className="text-brand-primary mb-6">&larr; 返回选择情绪</button>
            <h2 className="text-2xl font-bold text-brand-text mb-2">感觉一下，您的身体饿了吗？</h2>
            <p className="text-brand-text-light mb-8">是肚子饿了，还是心饿了？</p>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <label htmlFor="hunger" className="block text-lg font-medium text-brand-text">身体饥饿感: <span className="font-bold text-brand-primary">{hungerLevel}</span></label>
                <input
                    id="hunger"
                    type="range"
                    min="1"
                    max="10"
                    value={hungerLevel}
                    onChange={(e) => setHungerLevel(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-4"
                />
                <div className="flex justify-between text-xs text-brand-text-light mt-2 px-1">
                    <span>很饱</span>
                    <span>适中</span>
                    <span>很饿</span>
                </div>
            </div>
            <button onClick={handleHungerSubmit} className="mt-8 bg-brand-primary text-white font-bold py-3 px-6 rounded-full w-full max-w-xs hover:bg-blue-600 transition-colors">下一步</button>
          </div>
        );
      case 3:
        return (
             <div className="text-center animate-fadeIn">
                <button onClick={() => setStep(2)} className="text-brand-primary mb-6">&larr; 返回修改饥饿感</button>
                <h2 className="text-2xl font-bold text-brand-text mb-2">您吃了什么，或者想吃什么？</h2>
                <p className="text-brand-text-light mb-8">（诚实记录就好）</p>
                <form onSubmit={handleFoodSubmit} className="bg-white p-6 rounded-xl shadow-md">
                    <input
                        type="text"
                        value={whatAte}
                        onChange={(e) => setWhatAte(e.target.value)}
                        placeholder="例如：巧克力、薯片、一顿饭..."
                        className="w-full p-3 border rounded-lg shadow-inner focus:ring-2 focus:ring-brand-primary"
                        required
                    />
                    <button type="submit" className="mt-6 bg-brand-secondary text-white font-bold py-3 px-6 rounded-full w-full max-w-xs hover:bg-teal-400 transition-colors">记录此刻</button>
                </form>
             </div>
        )
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-6 w-full max-w-2xl mx-auto flex flex-col justify-center min-h-full">
      {step === 1 && !isCustomMood ? (
        <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-brand-text">觅食记</h1>
            <p className="text-brand-text-light text-lg mt-2">觉察 · 理解 · 疗愈</p>
        </header>
      ) : null}
      <main>
          {renderStep()}
      </main>
    </div>
  );
};

export default EmotionalLog;