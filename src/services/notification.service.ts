import { Platform } from 'react-native';
import { STORAGE_KEYS } from '@/constants';
import { readJSON, writeJSON } from '@/lib/storage';

export interface NotificationSettings {
  mealRemindersEnabled: boolean;
  breakfastHour: number;
  breakfastMin: number;
  lunchHour: number;
  lunchMin: number;
  dinnerHour: number;
  dinnerMin: number;
  waterReminderEnabled: boolean;
  waterIntervalHours: number;
}

const DEFAULTS: NotificationSettings = {
  mealRemindersEnabled: false,
  breakfastHour: 8,
  breakfastMin: 0,
  lunchHour: 13,
  lunchMin: 0,
  dinnerHour: 20,
  dinnerMin: 0,
  waterReminderEnabled: false,
  waterIntervalHours: 2,
};

export const notificationService = {
  async getSettings(): Promise<NotificationSettings> {
    const saved = await readJSON<NotificationSettings>(STORAGE_KEYS.notifications);
    return { ...DEFAULTS, ...saved };
  },

  async saveSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const current = await notificationService.getSettings();
    const updated = { ...current, ...settings };
    await writeJSON(STORAGE_KEYS.notifications, updated);
    return updated;
  },

  async requestPermission(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    try {
      const { default: Notifications } = await import('expo-notifications');
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch {
      return false;
    }
  },

  async scheduleAll(settings: NotificationSettings): Promise<void> {
    if (Platform.OS === 'web') return;
    try {
      const { default: Notifications } = await import('expo-notifications');
      await Notifications.cancelAllScheduledNotificationsAsync();

      if (!settings.mealRemindersEnabled && !settings.waterReminderEnabled) return;

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });

      if (settings.mealRemindersEnabled) {
        const meals = [
          { label: '🍳 Breakfast', hour: settings.breakfastHour, minute: settings.breakfastMin },
          { label: '🥗 Lunch time!', hour: settings.lunchHour, minute: settings.lunchMin },
          { label: '🍽️ Dinner reminder', hour: settings.dinnerHour, minute: settings.dinnerMin },
        ];
        for (const meal of meals) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: meal.label,
              body: 'Time to log your meal in NutraScan 🥦',
              sound: true,
            },
            trigger: {
              type: 'calendar' as never,
              hour: meal.hour,
              minute: meal.minute,
              repeats: true,
            },
          });
        }
      }

      if (settings.waterReminderEnabled) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '💧 Time to hydrate!',
            body: `Drink a glass of water. Stay on track with your ${2500}ml goal!`,
            sound: true,
          },
          trigger: {
            type: 'timeInterval' as never,
            seconds: settings.waterIntervalHours * 3600,
            repeats: true,
          },
        });
      }
    } catch (e) {
      console.warn('Notification schedule error:', e);
    }
  },

  async cancelAll(): Promise<void> {
    if (Platform.OS === 'web') return;
    try {
      const { default: Notifications } = await import('expo-notifications');
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch {}
  },
};
