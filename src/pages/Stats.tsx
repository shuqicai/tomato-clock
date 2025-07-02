import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, PieChart, Pie, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';

type TimeRange = 'day' | 'week' | 'month';
type Record = {
  date: string;
  count: number;
  duration: number;
  tasks: string[];
};

const COLORS = ['#FF6347', '#4CAF50', '#2196F3', '#FFC107', '#9C27B0'];

const generateMockData = (range: TimeRange): Record[] => {
  const now = new Date();
  const data: Record[] = [];
  
  if (range === 'day') {
    for (let i = 0; i < 24; i++) {
      data.push({
        date: `${i}:00`,
        count: Math.floor(Math.random() * 5),
        duration: Math.floor(Math.random() * 120),
        tasks: ['工作', '学习', '生活'].filter(() => Math.random() > 0.5)
      });
    }
  } else if (range === 'week') {
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        count: Math.floor(Math.random() * 10),
        duration: Math.floor(Math.random() * 300),
        tasks: ['工作', '学习', '生活'].filter(() => Math.random() > 0.5)
      });
    }
  } else {
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      data.push({
        date: `${date.getFullYear()}/${date.getMonth() + 1}`,
        count: Math.floor(Math.random() * 20),
        duration: Math.floor(Math.random() * 600),
        tasks: ['工作', '学习', '生活'].filter(() => Math.random() > 0.5)
      });
    }
  }
  
  return data;
};

const getCategoryData = (data: Record[]) => {
  const categoryCount: Record<string, number> = {};
  
  data.forEach(record => {
    record.tasks.forEach(task => {
      categoryCount[task] = (categoryCount[task] || 0) + record.count;
    });
  });
  
  return Object.entries(categoryCount).map(([name, value]) => ({
    name,
    value
  }));
};

type StatsProps = {
  onMenuOpen: () => void;
};

export default function Stats({ onMenuOpen }: StatsProps) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [category, setCategory] = useState<string>('all');
  const [data, setData] = useState<Record[]>([]);
  const [categoryData, setCategoryData] = useState<{name: string; value: number}[]>([]);

  useEffect(() => {
    const mockData = generateMockData(timeRange);
    setData(mockData);
    setCategoryData(getCategoryData(mockData));
  }, [timeRange]);

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
  };

  const filteredData = category === 'all' 
    ? data 
    : data.filter(item => item.tasks.includes(category));

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
        <h1 className="text-xl font-bold">数据统计</h1>
        <button 
          onClick={() => navigate('/')}
          className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500"
        >
          <i className="fa-solid fa-home"></i>
        </button>
      </div>

      {/* Filter Section */}
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm opacity-70">时间范围:</span>
          {(['day', 'week', 'month'] as TimeRange[]).map(range => (
            <button
              key={range}
              onClick={() => handleTimeRangeChange(range)}
              className={cn(
                "px-3 py-1 text-sm rounded-full",
                timeRange === range 
                  ? "bg-tomato text-white" 
                  : isDark 
                    ? "bg-gray-700" 
                    : "bg-gray-100"
              )}
            >
              {range === 'day' && '日'}
              {range === 'week' && '周'}
              {range === 'month' && '月'}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm opacity-70">任务分类:</span>
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className={cn(
              "px-3 py-1 text-sm rounded-full",
              isDark ? "bg-gray-700" : "bg-gray-100"
            )}
          >
            <option value="all">全部</option>
            {Array.from(new Set(data.flatMap(item => item.tasks))).map(task => (
              <option key={task} value={task}>{task}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Charts Section */}
      <div className="p-4 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "p-4 rounded-xl",
            isDark ? "bg-gray-800" : "bg-gray-100"
          )}
        >
          <h2 className="text-lg font-medium mb-4">番茄钟趋势</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#FF6347"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  name="番茄钟数量"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={cn(
            "p-4 rounded-xl",
            isDark ? "bg-gray-800" : "bg-gray-100"
          )}
        >
          <h2 className="text-lg font-medium mb-4">任务分类占比</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}