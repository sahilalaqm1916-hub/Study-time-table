import React from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  X,
  Calendar,
  ListTodo,
  RotateCcw,
  Award,
  Flame,
  Settings,
} from 'lucide-react';
import { NotificationItem, UserProfile } from '../types';
import { Language, translations } from '../utils/translations';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  profile: UserProfile;
  language: Language;
  onMarkAllAsRead: () => void;
  onToggleReminderSetting: (key: keyof UserProfile['reminderSettings']) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  profile,
  language,
  onMarkAllAsRead,
  onToggleReminderSetting,
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'timetable':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'homework':
        return <ListTodo className="w-4 h-4 text-amber-500" />;
      case 'revision':
        return <RotateCcw className="w-4 h-4 text-purple-500" />;
      case 'test':
        return <Award className="w-4 h-4 text-emerald-500" />;
      case 'streak':
        return <Flame className="w-4 h-4 text-orange-500" />;
      default:
        return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Notifications & Reminders
            </h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
                {unreadCount} new
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between py-2.5 text-xs text-slate-500 shrink-0 border-b border-slate-100 dark:border-slate-800">
          <span>Recent Alerts</span>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto space-y-2.5 py-3">
          {notifications.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">
              No notifications at this moment. You are all set!
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-2xl border text-xs flex items-start gap-3 transition-colors ${
                  !n.read
                    ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900'
                    : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                }`}
              >
                <div className="mt-0.5 p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-2xs shrink-0">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                      {n.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {n.timestamp}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reminder Settings Toggles */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Reminder Preferences
          </span>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.reminderSettings?.studySessions ?? true}
                onChange={() => onToggleReminderSetting('studySessions')}
                className="w-3.5 h-3.5 rounded text-blue-600"
              />
              <span className="text-slate-700 dark:text-slate-300">Study Sessions</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.reminderSettings?.homeworkAlerts ?? true}
                onChange={() => onToggleReminderSetting('homeworkAlerts')}
                className="w-3.5 h-3.5 rounded text-blue-600"
              />
              <span className="text-slate-700 dark:text-slate-300">Homework Alerts</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.reminderSettings?.revisionAlerts ?? true}
                onChange={() => onToggleReminderSetting('revisionAlerts')}
                className="w-3.5 h-3.5 rounded text-blue-600"
              />
              <span className="text-slate-700 dark:text-slate-300">Revision Alerts</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.reminderSettings?.testAlerts ?? true}
                onChange={() => onToggleReminderSetting('testAlerts')}
                className="w-3.5 h-3.5 rounded text-blue-600"
              />
              <span className="text-slate-700 dark:text-slate-300">Test Reminders</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
