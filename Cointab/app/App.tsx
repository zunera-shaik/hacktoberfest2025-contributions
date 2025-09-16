"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import ChatInterface from '@/components/ChatInterface';

interface Chat {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  last_message_at: string;
}

const App = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingChatId, setEditingChatId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/chats');
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initiateNewChat = async () => {
    try {
      const response = await axios.post('/api/chats', { title: 'New Chat' });
      setCurrentChatId(response.data.id);
      await fetchChats();
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const deleteChat = async (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this chat?')) {
      try {
        await axios.delete(`/api/chat/${chatId}`);
        if (currentChatId === chatId) {
          setCurrentChatId(null);
        }
        await fetchChats();
      } catch (error) {
        console.error('Error deleting chat:', error);
      }
    }
  };

  const startEditingTitle = (chat: Chat, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
  };

  const saveTitle = async (chatId: number) => {
    try {
      await axios.patch(`/api/chat/${chatId}`, { title: editingTitle });
      setEditingChatId(null);
      await fetchChats();
    } catch (error) {
      console.error('Error updating chat title:', error);
    }
  };

  const cancelEditing = () => {
    setEditingChatId(null);
    setEditingTitle('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-80 bg-gray-950 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={initiateNewChat}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-lg">+</span>
            New Chat
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">Loading chats...</div>
          ) : chats.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              No chats yet. Create your first chat!
            </div>
          ) : (
            <div className="p-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group relative p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                    currentChatId === chat.id
                      ? 'bg-gray-800 border-l-4 border-blue-500'
                      : 'hover:bg-gray-800'
                  }`}
                  onClick={() => setCurrentChatId(chat.id)}
                >
                  {editingChatId === chat.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="flex-1 bg-gray-700 text-white px-2 py-1 rounded text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            saveTitle(chat.id);
                          } else if (e.key === 'Escape') {
                            cancelEditing();
                          }
                        }}
                        autoFocus
                      />
                      <button
                        onClick={() => saveTitle(chat.id)}
                        className="text-green-500 hover:text-green-400 text-sm"
                      >
                        ✓
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="text-red-500 hover:text-red-400 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm truncate pr-2">
                          {chat.title}
                        </h3>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <button
                            onClick={(e) => startEditingTitle(chat, e)}
                            className="text-gray-400 hover:text-white text-xs p-1"
                            title="Rename chat"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => deleteChat(chat.id, e)}
                            className="text-gray-400 hover:text-red-400 text-xs p-1"
                            title="Delete chat"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(chat.updated_at)} • {chat.message_count} messages
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
          <div className="mb-2">
            <strong>Local ChatGPT-style App</strong>
          </div>
          <div>Powered by Ollama • gemma:2b</div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChatId ? (
          <ChatInterface chatId={`${currentChatId}`} onTitleUpdate={fetchChats} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-800">
            <div className="text-center max-w-md">
              <h1 className="text-4xl font-bold mb-4 text-white">Welcome to Chat</h1>
              <p className="text-gray-400 mb-8">
                This is a local ChatGPT-style application powered by Ollama's gemma:2b model.
                Create a new chat or select an existing one to start chatting!
              </p>
              <div className="space-y-4 text-sm text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <span>💬</span>
                  <span>Real-time streaming responses</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span>🔄</span>
                  <span>Stop generation anytime</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span>⌨️</span>
                  <span>Keyboard shortcuts (Enter, Esc)</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span>📝</span>
                  <span>Rename and manage chats</span>
                </div>
              </div>
              <button
                onClick={initiateNewChat}
                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Start Your First Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

