import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Trash2, Mail, Clock } from 'lucide-react';
import { useMessages } from '../../hooks/useFirebaseData';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

const MessagesManager: React.FC = () => {
  const { messages, loading } = useMessages();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleMarkAsRead = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'messages', id), { read: !currentStatus });
      toast.success(currentStatus ? 'Marked as unread' : 'Marked as read');
    } catch (error) {
      console.error('Error updating message status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'messages', id));
      toast.success('Message deleted permanently');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-text-primary" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-surface rounded-2xl border border-border">
        <Mail className="w-12 h-12 text-text-muted mb-4" />
        <h3 className="text-xl font-bold text-text-primary mb-2">Inbox Empty</h3>
        <p className="text-text-secondary text-sm">You haven't received any messages yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Inbox</h2>
          <p className="text-text-muted text-sm mt-1">Manage inquiries from your contact form.</p>
        </div>
        <div className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-500/20">
          {messages.filter(m => !m.read).length} Unread
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                msg.read 
                  ? 'bg-surface/50 border-border opacity-75' 
                  : 'bg-surface border-blue-500/30 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.1)]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${msg.read ? 'bg-border' : 'bg-blue-500 animate-pulse'}`} />
                      <h3 className="text-lg font-bold text-text-primary">
                        {msg.subject || 'No Subject'}
                      </h3>
                    </div>
                    <span className="flex items-center text-xs font-medium text-text-faint">
                      <Clock className="w-3 h-3 mr-1" />
                      {msg.createdAt.toLocaleDateString()}
                    </span>
                  </div>

                  {/* Sender Info */}
                  <div className="flex items-center space-x-3 text-sm text-text-secondary">
                    <span className="font-semibold text-text-primary">{msg.name}</span>
                    <span className="text-text-faint">•</span>
                    <a href={`mailto:${msg.email}`} className="text-blue-400 hover:underline">
                      {msg.email}
                    </a>
                  </div>

                  {/* Message Body */}
                  <div className="p-4 bg-bg rounded-xl border border-border">
                    <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-3 justify-end border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 shrink-0">
                  <button
                    onClick={() => handleMarkAsRead(msg.id, msg.read)}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      msg.read 
                        ? 'bg-surface-alt hover:bg-border text-text-secondary'
                        : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {msg.read ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  
                  <button
                    onClick={() => handleDelete(msg.id)}
                    disabled={deletingId === msg.id}
                    className="flex items-center justify-center px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {deletingId === msg.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MessagesManager;
