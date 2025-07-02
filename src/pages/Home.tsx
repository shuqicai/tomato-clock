import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

type HomeProps = {
  onMenuOpen: () => void;
};

export default function Home({ onMenuOpen }: HomeProps) {
  const { theme, toggleTheme, isDark } = useTheme();
  const [isWorking, setIsWorking] = useState(true);
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [currentTask, setCurrentTask] = useState({
    id: '1',
    name: '专注工作',
    category: '工作'
  });

  // Format time to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer logic
  useEffect(() => {
    let interval: number;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer completed
      setIsActive(false);
      toast.success(isWorking ? '工作时间结束！开始休息' : '休息时间结束！开始工作');
      setIsWorking(!isWorking);
      setTimeLeft(isWorking ? BREAK_TIME : WORK_TIME);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, isWorking]);

  const handleStart = useCallback(() => {
    setIsActive(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsActive(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsActive(false);
    setTimeLeft(isWorking ? WORK_TIME : BREAK_TIME);
  }, [isWorking]);

  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-screen p-4",
      isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
    )}>
      {/* Header */}
      <div className="flex justify-between w-full max-w-md mb-8">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500"
        >
          <i className={isDark ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
        </button>
        <button 
          onClick={onMenuOpen}
          className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      </div>

      {/* Timer Display */}
      <motion.div
        key={timeLeft}
        initial={{ scale: 0.9, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "text-8xl font-bold mb-8",
          isWorking ? "text-tomato" : "text-green-500"
        )}
      >
        {formatTime(timeLeft)}
      </motion.div>

      {/* Task Display */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => toast('跳转到任务编辑')}
        className={cn(
          "mb-8 px-6 py-3 rounded-full cursor-pointer",
          isDark ? "bg-gray-800" : "bg-gray-100"
        )}
      >
        <div className="text-lg font-medium">{currentTask.name}</div>
        <div className="text-sm opacity-70">{currentTask.category}</div>
      </motion.div>

      {/* Control Buttons */}
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={isActive ? handlePause : handleStart}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center text-white",
            isWorking ? "bg-tomato" : "bg-green-500"
          )}
        >
          <i className={isActive ? "fa-solid fa-pause" : "fa-solid fa-play"}></i>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleReset}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-500 text-white"
        >
          <i className="fa-solid fa-rotate-right"></i>
        </motion.button>
      </div>
    </div>
  );
}