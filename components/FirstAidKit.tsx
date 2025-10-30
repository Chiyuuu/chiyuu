import React, { useState, useEffect } from 'react';

interface FirstAidKitProps {
  isOpen: boolean;
  onClose: () => void;
}

const BreathingAnimator = () => {
    const [text, setText] = useState('准备...');
    const totalDuration = 8000; // 8 seconds for a full cycle
    const inhaleTime = 3000; // 3 seconds
    const holdTime = 1000; // 1 second
    const exhaleTime = 4000; // 4 seconds

    useEffect(() => {
        const cycle = () => {
            setText('吸气...');
            setTimeout(() => {
                setText('保持');
                setTimeout(() => {
                    setText('呼气...');
                }, holdTime);
            }, inhaleTime);
        };
        cycle();
        const interval = setInterval(cycle, totalDuration);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="relative w-48 h-48 flex items-center justify-center">
                <div className="absolute w-full h-full bg-brand-primary rounded-full animate-breathe"></div>
                <div className="absolute w-full h-full bg-brand-secondary rounded-full animate-breathe animation-delay-4000"></div>
                <span className="relative text-white font-semibold text-lg z-10">{text}</span>
            </div>
            <p className="mt-6 text-brand-text-light">专注呼吸60秒。让情绪如浮云飘过。</p>
        </div>
    );
};


const SensoryShift = () => {
    const prompts = [
        { type: "听", instruction: "闭上眼睛，仔细听周围3种不同的声音。", icon: "👂" },
        { type: "看", instruction: "环顾四周，在您所处的环境中找出5种不同的颜色。", icon: "👁️" },
        { type: "感受", instruction: "感受您的双脚与地面的接触，以及背部靠着椅子的感觉。让自己扎根于此。", icon: "✋" }
    ];
    const [currentPrompt, setCurrentPrompt] = useState(0);

    return (
        <div className="text-center p-4 flex flex-col items-center">
            <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-sm">
                <p className="text-5xl mb-4">{prompts[currentPrompt].icon}</p>
                <h3 className="text-xl font-bold text-brand-primary mb-2">{prompts[currentPrompt].type}</h3>
                <p className="text-brand-text h-24">{prompts[currentPrompt].instruction}</p>
            </div>
            <button
                onClick={() => setCurrentPrompt((p) => (p + 1) % prompts.length)}
                className="mt-4 bg-brand-primary text-white font-bold py-2 px-4 rounded-full hover:bg-blue-600 transition-colors"
            >
                下一个练习
            </button>
        </div>
    );
};

const EmotionVent = () => {
    const [text, setText] = useState('');
    return (
        <div className="p-4 flex flex-col items-center">
             <h3 className="text-xl font-bold text-brand-primary mb-2 text-center">一个私密空间</h3>
            <p className="text-brand-text-light text-center mb-4">写下您的烦恼，然后释放它。这里的内容不会被保存。</p>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full max-w-sm h-40 p-3 border rounded-lg shadow-inner focus:ring-2 focus:ring-brand-primary"
                placeholder="尽情倾诉..."
            ></textarea>
            <button
                onClick={() => setText('')}
                className="mt-4 bg-brand-accent text-white font-bold py-2 px-4 rounded-full hover:bg-orange-500 transition-colors disabled:bg-gray-300"
                disabled={!text}
            >
                释放它
            </button>
        </div>
    );
};


const FirstAidKit: React.FC<FirstAidKitProps> = ({ isOpen, onClose }) => {
  const [activeTool, setActiveTool] = useState<'breathing' | 'sensory' | 'vent'>('breathing');

  useEffect(() => {
    if (isOpen) {
      setActiveTool('breathing');
    }
  }, [isOpen]);
  
  if (!isOpen) return null;

  const renderTool = () => {
    switch(activeTool) {
        case 'breathing': return <BreathingAnimator />;
        case 'sensory': return <SensoryShift />;
        case 'vent': return <EmotionVent />;
        default: return null;
    }
  };

  const ToolButton = ({ tool, label }: { tool: 'breathing' | 'sensory' | 'vent', label: string }) => (
    <button
      onClick={() => setActiveTool(tool)}
      className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeTool === tool ? 'bg-brand-primary text-white' : 'text-brand-text-light bg-gray-200'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn p-4">
      <div className="bg-brand-background rounded-2xl shadow-2xl w-full max-w-md mx-auto flex flex-col animate-slideInUp">
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-brand-text">急救工具箱</h2>
          <button onClick={onClose} className="text-brand-text-light hover:text-brand-text text-2xl leading-none">&times;</button>
        </header>
        <main className="p-4 flex-grow">
            <div className="flex justify-center space-x-2 mb-6">
                <ToolButton tool="breathing" label="暂停" />
                <ToolButton tool="sensory" label="转移" />
                <ToolButton tool="vent" label="倾诉" />
            </div>
            {renderTool()}
        </main>
      </div>
    </div>
  );
};

export default FirstAidKit;
