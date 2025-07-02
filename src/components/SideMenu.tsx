import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { AuthContext } from '@/App';
import { useContext } from 'react';

type MenuItem = {
  icon: string;
  name: string;
  path: string;
};

type UserInfo = {
  avatar: string;
  name: string;
  syncStatus: 'synced' | 'syncing' | 'not_synced';
};

const menuItems: MenuItem[] = [
  { icon: 'fa-solid fa-house', name: '主页', path: '/' },
  { icon: 'fa-solid fa-list-check', name: '任务管理', path: '/tasks' },
  { icon: 'fa-solid fa-chart-line', name: '数据统计', path: '/stats' },
  { icon: 'fa-solid fa-gear', name: '设置', path: '/settings' },
];

const syncStatusMap = {
  synced: { text: '已同步', icon: 'fa-solid fa-check-circle', color: 'text-green-500' },
  syncing: { text: '同步中...', icon: 'fa-solid fa-spinner fa-spin', color: 'text-yellow-500' },
  not_synced: { text: '未同步', icon: 'fa-solid fa-exclamation-circle', color: 'text-red-500' },
};

type SideMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    avatar: '',
    name: '未登录用户',
    syncStatus: 'not_synced',
  });

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.side-menu')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Update user info when auth status changes
  useEffect(() => {
    if (isAuthenticated) {
      setUserInfo({
        avatar: '',
        name: '用户' + Math.floor(Math.random() * 1000),
        syncStatus: 'synced',
      });
    } else {
      setUserInfo({
        avatar: '',
        name: '未登录用户',
        syncStatus: 'not_synced',
      });
    }
  }, [isAuthenticated]);

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Side Menu */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              'side-menu fixed top-0 left-0 h-full w-64 z-50',
              isDark ? 'bg-gray-800' : 'bg-white'
            )}
          >
            {/* User Info */}
            <div className={cn(
              'p-4 border-b',
              isDark ? 'border-gray-700' : 'border-gray-200'
            )}>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-tomato flex items-center justify-center text-white">
                  <i className="fa-solid fa-user"></i>
                </div>
                <div>
                  <div className="font-medium">{userInfo.name}</div>
                  <div className="text-sm flex items-center">
                    <i className={cn(
                      syncStatusMap[userInfo.syncStatus].icon,
                      syncStatusMap[userInfo.syncStatus].color,
                      'mr-1'
                    )}></i>
                    {syncStatusMap[userInfo.syncStatus].text}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {menuItems.map((item) => (
                <motion.div
                  key={item.path}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMenuItemClick(item.path)}
                  className={cn(
                    'flex items-center p-3 rounded-lg cursor-pointer mb-1',
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  )}
                >
                  <i className={cn(item.icon, 'mr-3 w-6 text-center')}></i>
                  <span>{item.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
