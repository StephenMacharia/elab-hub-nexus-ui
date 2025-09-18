
import React from 'react';
import { motion } from 'framer-motion';
import ChatInterface from '@/components/Chat/ChatInterface';

interface ChatProps {
  userRole: 'admin' | 'technician' | 'patient';
  userName: string;
}

const Chat = ({ userRole, userName }: ChatProps) => {
  const getChatRecipient = () => {
    switch (userRole) {
      case 'admin':
        return { name: 'Dr. Sarah Wilson', role: 'Lab Manager' };
      case 'technician':
        return { name: 'Dr. Martinez', role: 'Chief Physician' };
      case 'patient':
        return { name: 'Dr. Sarah Wilson', role: 'Lab Technician' };
      default:
        return { name: 'Support Team', role: 'Customer Service' };
    }
  };

  const recipient = getChatRecipient();

  return (
    <div className="h-[calc(100vh-8rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h2 className="text-2xl font-bold text-gray-900">Chat</h2>
        <p className="text-gray-600">Communicate with lab staff and get support</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="h-[calc(100%-4rem)]"
      >
        <ChatInterface
          recipientName={recipient.name}
          recipientRole={recipient.role}
          isOnline={true}
        />
      </motion.div>
    </div>
  );
};

export default Chat;
