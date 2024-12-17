import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { IoNotificationsOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';

interface NotificationItem {
  id: string;
  title: string;
  content: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS';
  isRead: boolean;
  createdAt: string;
}

export function Notification() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(showAll ? 50 : 5);

        if (error) throw error;
        setNotifications(data || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [showAll]);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-gradient-to-b from-purple-900/40 to-black/40 rounded-xl p-6">
        <div className="h-6 bg-purple-900/30 rounded w-1/4 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-purple-900/30 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-purple-900/40 to-black/40 rounded-xl p-6 backdrop-blur-sm border border-purple-500/20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <IoNotificationsOutline className="text-purple-400" />
          {t('Notifications')}
        </h2>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-purple-400 hover:text-purple-300"
        >
          {showAll ? t('Show Less') : t('Show All')}
        </button>
      </div>

      <AnimatePresence>
        <div className="space-y-4">
          {notifications.map(notification => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`
                p-4 rounded-lg backdrop-blur-sm border
                ${notification.isRead 
                  ? 'bg-purple-900/20 border-purple-500/10' 
                  : 'bg-purple-900/30 border-purple-500/20'
                }
              `}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium mb-1">{notification.title}</h3>
                  <p className="text-sm text-gray-400">{notification.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-purple-400 hover:text-purple-300"
                    title={t('Mark as read')}
                    aria-label={t('Mark notification as read')}
                  >
                    <IoCheckmarkCircleOutline size={20} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {notifications.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          {t('No notifications')}
        </div>
      )}
    </div>
  );
} 