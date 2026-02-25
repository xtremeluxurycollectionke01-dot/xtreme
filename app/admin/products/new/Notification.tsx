import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { NotificationState } from "./product.types";

interface NotificationProps {
  notification: NotificationState | null;
}

export const Notification: React.FC<NotificationProps> = ({ notification }) => {
  const getIcon = () => {
    switch (notification?.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  const getBgColor = () => {
    switch (notification?.type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/50 text-green-500';
      case 'error':
        return 'bg-red-500/10 border-red-500/50 text-red-500';
      default:
        return 'bg-blue-500/10 border-blue-500/50 text-blue-500';
    }
  };

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${getBgColor()}`}
        >
          {getIcon()}
          <p>{notification.message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};