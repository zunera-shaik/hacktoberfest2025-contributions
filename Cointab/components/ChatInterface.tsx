"use client";

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import axios from 'axios';

interface Message {
  id: number;
  chat_id: number;
  role: string;
  content: string;
  created_at: string;
}

interface ChatInterfaceProps {
  chatId: string;
  onTitleUpdate?: () => void;
}

const ChatInterface = ({ chatId, onTitleUpdate }: ChatInterfaceProps) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingResponse, setStreamingResponse] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingResponse]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/chat/${chatId}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    if (e.key === 'Escape') {
      handleStopGeneration();
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isStreaming) return;

    const messageToSend = inputValue.trim();
    setInputValue('');
    setIsStreaming(true);
    setIsTyping(true);
    setStreamingResponse('');

    // Add user message to UI immediately
    const userMessage: Message = {
      id: Date.now(),
      chat_id: parseInt(chatId),
      role: 'user',
      content: messageToSend,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Create abort controller for this request
      abortControllerRef.current = new AbortController();
      
      const response = await fetch(`/api/chat/${chatId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageToSend }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No readable stream');

      const decoder = new TextDecoder();
      let fullResponse = '';

      setIsTyping(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.chunk) {
                fullResponse += data.chunk;
                setStreamingResponse(fullResponse);
              }
              if (data.done) {
                setIsStreaming(false);
                setStreamingResponse('');
                await fetchMessages();
                onTitleUpdate?.();
                return;
              }
              if (data.error) {
                throw new Error(data.error);
              }
            } catch (parseError) {
              console.error('Error parsing stream data:', parseError);
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error sending message:', error);
        setStreamingResponse('Error: Failed to get response');
      }
    } finally {
      setIsStreaming(false);
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    try {
      await axios.post(`/api/chat/${chatId}/stop`);
    } catch (error) {
      console.error('Error stopping generation:', error);
    }
    
    setIsStreaming(false);
    setIsTyping(false);
    setStreamingResponse('');
  };

  const retryLastMessage = () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      setInputValue(lastUserMessage.content);
    }
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => (
      <div key={index}>
        {line}
        <br />
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-full bg-gray-800">
      {/* Chat Title */}
      <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
        <h2 className="text-xl font-semibold text-white">Chat #{chatId}</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3/4 p-3 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-100'
            }`}>
              <div className="text-sm font-medium mb-1 capitalize">
                {message.role === 'user' ? 'You' : 'Assistant'}
              </div>
              <div>{formatMessage(message.content)}</div>
            </div>
          </div>
        ))}
        
        {/* Streaming Response */}
        {streamingResponse && (
          <div className="flex justify-start">
            <div className="max-w-3/4 p-3 rounded-lg bg-gray-700 text-gray-100">
              <div className="text-sm font-medium mb-1">Assistant</div>
              <div>{formatMessage(streamingResponse)}</div>
              <div className="typing-indicator mt-2">▊</div>
            </div>
          </div>
        )}
        
        {/* Typing Indicator */}
        {isTyping && !streamingResponse && (
          <div className="flex justify-start">
            <div className="max-w-3/4 p-3 rounded-lg bg-gray-700 text-gray-100">
              <div className="text-sm font-medium mb-1">Assistant</div>
              <div className="typing-dots">
                <span>•</span>
                <span>•</span>
                <span>•</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-gray-700 border-t border-gray-600 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Enter to send, Esc to stop)"
            className="flex-1 bg-gray-800 text-white p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            disabled={isStreaming}
          />
          
          {isStreaming ? (
            <button
              onClick={handleStopGeneration}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
            >
              Stop
            </button>
          ) : (
            <>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Send
              </button>
              {messages.length > 0 && (
                <button
                  onClick={retryLastMessage}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-3 rounded-lg font-medium transition-colors"
                  title="Retry last message"
                >
                  ↻
                </button>
              )}
            </>
          )}
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Press Enter to send • Esc to stop generation • ↻ to retry last message
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

