import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';
import { AuthContext } from '@/App';

type SoundOption = 'bell' | 'chime' | 'ding' | 'none';
type SettingsType = {
  sound: SoundOption;
  vibration: boolean;
};

type AccountInfo = {
  username: string;
  syncStatus: 'synced' | 'syncing' | 'not_synced';
};

type SettingsProps = {
  onMenuOpen: () => void;
};

export default function Settings({ onMenuOpen }: SettingsProps) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SettingsType>(() => {
    const saved = localStorage.getItem('pomodoro-settings');
    return saved ? JSON.parse(saved) : { sound: 'bell', vibration: true };
  });
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    username: '',
    syncStatus: 'not_synced'
  });

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pomodoro-settings');
    if (saved) {
      setSettings(JSON.parse(saved) as SettingsType);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoro-settings', JSON.stringify(settings));
  }, [settings]);

  const handleSoundChange = (sound: SoundOption) => {
    setSettings({ ...settings, sound });
    toast.success('提醒铃声已更新');
  };

  const toggleVibration = () => {
    setSettings({ ...settings, vibration: !settings.vibration });
    toast.success(`震动提醒已${!settings.vibration ? '开启' : '关闭'}`);
  };

  const handleLogin = () => {
    setAccountInfo({
      username: '用户' + Math.floor(Math.random() * 1000),
      syncStatus: 'synced'
    });
    toast.success('登录成功');
  };

  const handleLogout = () => {
    setAccountInfo({
      username: '',
      syncStatus: 'not_synced'
    });
    toast.success('已登出');
  };

  const handleBackup = () => {
    toast.success('数据已备份到云端');
  };

  const handleRestore = () => {
    toast.success('数据已从云端恢复');
  };

  const handleExport = () => {
    toast.success('数据已导出');
  };

  const soundOptions: { value: SoundOption; label: string }[] = [
    { value: 'bell', label: '铃声' },
    { value: 'chime', label: '钟声' },
    { value: 'ding', label: '叮咚声' },
    { value: 'none', label: '无声音' }
  ];

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
        <h1 className="text-xl font-bold">设置</h1>
        <button 
          onClick={() => navigate('/')}
          className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500"
        >
          <i className="fa-solid fa-home"></i>
        </button>
      </div>

      {/* Settings List */}
      <div className="p-4 space-y-6">
        {/* Sound Setting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-4 rounded-xl",
            isDark ? "bg-gray-800" : "bg-gray-100"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">提醒铃声</div>
            <select
              value={settings.sound}
              onChange={(e) => handleSoundChange(e.target.value as SoundOption)}
              className={cn(
                "px-3 py-1 rounded-full",
                isDark ? "bg-gray-700" : "bg-gray-200"
              )}
            >
              {soundOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm opacity-70">选择专注时间结束时的提醒声音</div>
        </motion.div>

        {/* Vibration Setting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "p-4 rounded-xl",
            isDark ? "bg-gray-800" : "bg-gray-100"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">震动提醒</div>
            <button
              onClick={toggleVibration}
              className={cn(
                "w-12 h-6 rounded-full p-1 transition-colors",
                settings.vibration ? "bg-tomato" : "bg-gray-400",
                isDark && !settings.vibration ? "bg-gray-600" : ""
              )}
            >
              <motion.div
                className="w-4 h-4 rounded-full bg-white"
                animate={{ x: settings.vibration ? 18 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
          <div className="text-sm opacity-70">开启/关闭震动提醒功能</div>
        </motion.div>

        {/* Account Setting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "p-4 rounded-xl",
            isDark ? "bg-gray-800" : "bg-gray-100"
          )}
          onClick={accountInfo.username ? handleLogout : handleLogin}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">账号</div>
            <div className="flex items-center">
              <div className={cn(
                "text-sm mr-2",
                accountInfo.username ? "text-tomato" : "text-gray-500"
              )}>
                {accountInfo.username || '未登录'}
              </div>
              <i className={accountInfo.username ? "fa-solid fa-sign-out-alt" : "fa-solid fa-sign-in-alt"}></i>
            </div>
          </div>
          <div className="text-sm opacity-70">
            {accountInfo.username ? '点击退出当前账号' : '点击登录账号'}
          </div>
        </motion.div>

        {/* Data Backup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={cn(
            "p-4 rounded-xl",
            isDark ? "bg-gray-800" : "bg-gray-100"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">数据备份</div>
            <button
              onClick={handleBackup}
              className={cn(
                "px-3 py-1 rounded-full",
                isDark ? "bg-gray-700" : "bg-gray-200"
              )}
            >
              <i className="fa-solid fa-cloud-upload-alt mr-1"></i>
              备份
            </button>
          </div>
          <div className="text-sm opacity-70">将数据备份到云端</div>
        </motion.div>

        {/* Data Restore */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={cn(
            "p-4 rounded-xl",
            isDark ? "bg-gray-800" : "bg-gray-100"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">数据恢复</div>
            <button
              onClick={handleRestore}
              className={cn(
                "px-3 py-1 rounded-full",
                isDark ? "bg-gray-700" : "bg-gray-200"
              )}
            >
              <i className="fa-solid fa-cloud-download-alt mr-1"></i>
              恢复
            </button>
          </div>
          <div className="text-sm opacity-70">从云端恢复数据</div>
        </motion.div>

        {/* Data Export */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={cn(
            "p-4 rounded-xl",
            isDark ? "bg-gray-800" : "bg-gray-100"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">数据导出</div>
            <button
              onClick={handleExport}
              className={cn(
                "px-3 py-1 rounded-full",
                isDark ? "bg-gray-700" : "bg-gray-200"
              )}
            >
              <i className="fa-solid fa-file-export mr-1"></i>
              导出
            </button>
          </div>
          <div className="text-sm opacity-70">导出数据到本地文件</div>
        </motion.div>
      </div>
    </div>
  );
}
