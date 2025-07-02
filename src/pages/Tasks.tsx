import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';

type Priority = 'high' | 'medium' | 'low';
type Task = {
  id: string;
  name: string;
  category: string;
  priority: Priority;
  createTime: number;
};

const priorityColors = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500'
};

type TasksProps = {
  onMenuOpen: () => void;
};

export default function Tasks({ onMenuOpen }: TasksProps) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>(['工作', '学习', '生活']);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('pomodoro-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTask = (task: Omit<Task, 'id' | 'createTime'>) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createTime: Date.now()
    };
    setTasks([...tasks, newTask]);
    toast.success('任务添加成功');
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    toast.success('任务更新成功');
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success('任务删除成功');
  };

  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
      toast.success('分类添加成功');
    }
  };

  return (
    <div className={cn(
      "min-h-screen",
      isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
    )}>
      {/* Header */}
      <div className={cn(
        "sticky top-0 z-10 p-4 flex items-center justify-between border-b",
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      )}>
        <button 
          onClick={onMenuOpen}
          className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="text-xl font-bold">任务管理</h1>
        <button 
          onClick={() => navigate('/')}
          className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500"
        >
          <i className="fa-solid fa-home"></i>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className={cn(
          "flex items-center px-4 py-2 rounded-full",
          isDark ? "bg-gray-800" : "bg-gray-100"
        )}>
          <i className="fa-solid fa-search mr-2 opacity-50"></i>
          <input
            type="text"
            placeholder="搜索任务..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "w-full bg-transparent outline-none",
              isDark ? "placeholder-gray-500" : "placeholder-gray-400"
            )}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="p-4 space-y-3">
        <AnimatePresence>
          {filteredTasks.map(task => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "p-4 rounded-xl flex items-center justify-between",
                isDark ? "bg-gray-800" : "bg-gray-100"
              )}
            >
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${priorityColors[task.priority]} mr-3`}></div>
                <div>
                  <div className="font-medium">{task.name}</div>
                  <div className="text-sm opacity-70">{task.category}</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    setCurrentTask(task);
                    setIsFormOpen(true);
                  }}
                  className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500"
                >
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-2 rounded-full hover:bg-opacity-20 hover:bg-red-500"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Task Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setCurrentTask(null);
          setIsFormOpen(true);
        }}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-white",
          isDark ? "bg-tomato" : "bg-tomato"
        )}
      >
        <i className="fa-solid fa-plus"></i>
      </motion.button>

      {/* Task Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className={cn(
                "w-full max-w-md p-6 rounded-xl",
                isDark ? "bg-gray-800" : "bg-white"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">
                {currentTask ? '编辑任务' : '新建任务'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">任务名称</label>
                  <input
                    type="text"
                    value={currentTask?.name || ''}
                    onChange={(e) => currentTask && setCurrentTask({
                      ...currentTask,
                      name: e.target.value
                    })}
                    className={cn(
                      "w-full p-2 border rounded",
                      isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                    )}
                  />
                </div>
                
                <div>
                  <label className="block mb-1">分类</label>
                  <div className="flex space-x-2">
                    <select
                      value={currentTask?.category || ''}
                      onChange={(e) => currentTask && setCurrentTask({
                        ...currentTask,
                        category: e.target.value
                      })}
                      className={cn(
                        "flex-1 p-2 border rounded",
                        isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                      )}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        const newCategory = prompt('请输入新分类名称');
                        if (newCategory) {
                          handleAddCategory(newCategory);
                        }
                      }}
                      className={cn(
                        "px-3 py-2 rounded border",
                        isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                      )}
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1">优先级</label>
                  <div className="flex space-x-2">
                    {(['high', 'medium', 'low'] as Priority[]).map(priority => (
                      <button
                        key={priority}
                        onClick={() => currentTask && setCurrentTask({
                          ...currentTask,
                          priority
                        })}
                        className={cn(
                          "flex-1 p-2 rounded border flex items-center justify-center",
                          isDark ? "border-gray-600" : "border-gray-300",
                          currentTask?.priority === priority ? priorityColors[priority] : ''
                        )}
                      >
                        {priority === 'high' && '高'}
                        {priority === 'medium' && '中'}
                        {priority === 'low' && '低'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setIsFormOpen(false)}
                  className={cn(
                    "px-4 py-2 rounded border",
                    isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                  )}
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    if (currentTask) {
                      if (currentTask.id) {
                        handleUpdateTask(currentTask);
                      } else {
                        handleAddTask(currentTask);
                      }
                      setIsFormOpen(false);
                    }
                  }}
                  className={cn(
                    "px-4 py-2 rounded text-white",
                    isDark ? "bg-tomato" : "bg-tomato"
                  )}
                >
                  {currentTask?.id ? '更新' : '添加'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}