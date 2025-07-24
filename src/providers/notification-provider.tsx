import { markNotificationAsRead } from "@/actions/database/notifications";
import { Notifications } from "@/lib/prisma/generated";
import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";

interface NotificationContextType {
  notifications: Notifications[];
  addNotification: (notification: Notifications) => void;
  markAsRead: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return ctx;
};

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notifications[]>([]);

  const addNotification = (notification: Notifications) => {
    setNotifications((prev) => [...prev, notification]);
    toast.info(notification.message, {
      description: notification.description,
    });
  };

  const markAsRead = async (id: string) => {
    try {
      const { data, error } = await markNotificationAsRead(id);
      if (error) {
        throw new Error(error);
      }
      setNotifications((prev) => prev.map((n) => (n.id === id ? data : n)));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
