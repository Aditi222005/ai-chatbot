import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Paperclip,
  Mic,
  PhoneCall,
  Settings,
  MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Message {
  id: string;
  content: string | string[]; // updated to support list responses
  isBot: boolean;
  timestamp: Date;
  isImage?: boolean;
}

interface ChatBotProps {
  title?: string;
  placeholder?: string;
}

const ChatBot: React.FC<ChatBotProps> = ({
  title = 'AI Assistant',
  placeholder = 'Ask me anything...'
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateBotResponse = async (userMessage: string) => {
    setIsTyping(true);
    try {
      const res = await fetch('http://localhost:3000/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
        credentials: 'include'
      });

      const data = await res.json();

      const botMessage: Message = {
        id: Date.now().toString() + '-bot',
        content: data.response || "Sorry, I couldn't generate a response.",
        isBot: true,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: Date.now().toString() + '-bot',
        content: '⚠️ Error connecting to AI service.',
        isBot: true,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: trimmed,
      isBot: false,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    simulateBotResponse(trimmed);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageMessage: Message = {
        id: Date.now().toString(),
        content: reader.result as string,
        isBot: false,
        isImage: true,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, imageMessage]);

      const botReply: Message = {
        id: Date.now().toString() + '-bot',
        content: [
          'Please provide the image.',
          'I cannot receive images directly.',
          'You can upload it to an image hosting site (e.g., Imgur) and share the link.'
        ],
        isBot: true,
        timestamp: new Date()
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, botReply]);
      }, 1000);
    };

    reader.readAsDataURL(file);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm rounded-t-xl mx-4 mt-6">
        <div className="flex items-center space-x-2">
          <Avatar className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600">
            <AvatarFallback className="bg-transparent text-white">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
            <p className="text-sm text-green-500">● Active now</p>
          </div>
        </div>
        <div className="flex gap-3 text-slate-500">
          <PhoneCall className="w-5 h-5" />
          <Settings className="w-5 h-5" />
          <MoreVertical className="w-5 h-5" />
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-6 py-6 space-y-4 overflow-y-auto mx-4 mt-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div className="flex items-end space-x-2">
              {message.isBot && (
                <Avatar className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600">
                  <AvatarFallback className="bg-transparent text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl relative ${
                  message.isBot
                    ? 'bg-white text-slate-800 border border-slate-200'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {message.isImage ? (
                  <img
                    src={message.content as string}
                    alt="upload"
                    className="rounded-lg max-w-full"
                  />
                ) : Array.isArray(message.content) ? (
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {message.content.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
                <p className="text-xs mt-1 text-right">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {!message.isBot && (
                <Avatar className="h-8 w-8 bg-gradient-to-r from-green-500 to-teal-600">
                  <AvatarFallback className="bg-transparent text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600">
              <AvatarFallback className="bg-transparent text-white">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex space-x-1 bg-white px-4 py-2 rounded-2xl shadow border">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
              <div
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.1s' }}
              />
              <div
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input */}
      <div className="px-6 py-3 bg-white border-t shadow-sm rounded-b-xl mx-4 mb-4">
        <div className="flex items-center space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button variant="ghost" size="icon" onClick={openFileDialog}>
            <Paperclip className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Mic className="w-5 h-5" />
          </Button>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            className="flex-1"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
