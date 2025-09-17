import { useState, useEffect } from 'react';
import axios from 'axios';

const useNotifications = (user, sessions) => {
  const [notifications, setNotifications] = useState([]);

  // Generate notifications based on upcoming and completed sessions
  useEffect(() => {
    if (!user || !sessions) return;

    const generateNotifications = () => {
      const now = new Date();
      const newNotifications = [];

      sessions.forEach(session => {
        const sessionDate = new Date(session.date);
        const timeDiff = sessionDate - now;
        const daysUntilSession = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        // Pre-procedure notifications
        if (daysUntilSession > 0 && daysUntilSession <= 3) {
          const preNotification = {
            id: `pre-${session._id}`,
            type: 'pre',
            title: `Upcoming ${session.therapyType} Session`,
            message: getProcedurePrecautions(session.therapyType, 'pre'),
            date: session.date,
            time: session.startTime,
            isRead: false
          };
          newNotifications.push(preNotification);
        }

        // Post-procedure notifications
        if (daysUntilSession < 0 && daysUntilSession >= -3) {
          const postNotification = {
            id: `post-${session._id}`,
            type: 'post',
            title: `Post ${session.therapyType} Care`,
            message: getProcedurePrecautions(session.therapyType, 'post'),
            date: session.date,
            time: session.startTime,
            isRead: false
          };
          newNotifications.push(postNotification);
        }
      });

      setNotifications(prevNotifications => {
        // Merge with existing notifications, avoiding duplicates
        const existingIds = new Set(prevNotifications.map(n => n.id));
        const uniqueNew = newNotifications.filter(n => !existingIds.has(n.id));
        return [...prevNotifications, ...uniqueNew];
      });
    };

    generateNotifications();
    // Update notifications every hour
    const interval = setInterval(generateNotifications, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user, sessions]);

  const getProcedurePrecautions = (therapyType, stage) => {
    const precautions = {
      Virechana: {
        pre: [
          "Fast for 4 hours before the procedure",
          "Stay hydrated with warm water",
          "Avoid cold foods and heavy meals",
          "Get adequate rest the night before",
          "Wear loose, comfortable clothing"
        ],
        post: [
          "Rest for at least 2 hours after the procedure",
          "Follow the prescribed dietary restrictions",
          "Take warm water only when thirsty",
          "Avoid strenuous activities for 24 hours",
          "Monitor and report any unusual symptoms"
        ]
      },
      Vamana: {
        pre: [
          "Follow the prescribed preparatory diet",
          "No food or drink after midnight",
          "Get good sleep the night before",
          "Arrive on time for the procedure",
          "Bring comfortable clothing"
        ],
        post: [
          "Follow post-procedure dietary guidelines strictly",
          "Rest adequately for the next 24 hours",
          "Keep yourself warm",
          "Avoid cold beverages and foods",
          "Take medications as prescribed"
        ]
      }
    };

    return precautions[therapyType]?.[stage]?.join("\n") || 
           "Please follow general Ayurvedic guidelines and practitioner's instructions.";
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  return {
    notifications,
    markAsRead,
    setNotifications
  };
};

export default useNotifications;