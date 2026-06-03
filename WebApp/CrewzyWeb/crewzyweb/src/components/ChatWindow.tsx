import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client'; // Am adăugat tipul Socket
import { Send, X, User } from 'lucide-react';

const currentHost = window.location.hostname;
// Tipizăm instanța de socket
const socket: Socket = io(`https://${currentHost}:4000`);

interface Message {
    userId: string;
    userName: string;
    text: string;
    timestamp: string;
}

interface ChatWindowProps {
    targetUser: {
        id: string;
        name: string;
        avatar: string;
    };
    onClose: () => void;
}

export function ChatWindow({ targetUser, onClose }: ChatWindowProps) {
    // Specificația tipului aici elimină eroarea "any"
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    useEffect(() => {
        socket.disconnect();
        socket.connect();

        socket.on('chat_history', (history: Message[]) => {
            setMessages(history);
        });

        socket.on('receive_message', (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off('chat_history');
            socket.off('receive_message');
        };
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser.id) return;

        const messageData = {
            userId: currentUser.id,
            userName: currentUser.name,
            text: newMessage,
            timestamp: new Date().toISOString()
        };

        socket.emit('send_message', messageData);
        setNewMessage('');
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="w-full max-w-md h-[600px] max-h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-gray-900 p-4 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img src={targetUser.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-white/20" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">{targetUser.name}</p>
                            <p className="text-[10px] text-gray-400">Real-time Chat</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Mesaje */}
                <div className="flex-1 h-[400px] overflow-y-auto p-6 space-y-4 bg-gray-50">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-400 mt-10">
                            <User className="mx-auto mb-2 opacity-20" size={40} />
                            <p className="text-sm">Începe o conversație cu {targetUser.name}</p>
                        </div>
                    )}
                    {messages.map((msg, index) => {
                        const isMe = msg.userId === currentUser.id;
                        return (
                            <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    <span className="text-[10px] text-gray-400 mb-1 px-1">
                                        {isMe ? 'Tu' : msg.userName}
                                    </span>
                                    <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${isMe
                                            ? 'bg-purple-600 text-white rounded-tr-none'
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={scrollRef} />
                </div>

                {/* Input */}
                <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Scrie un mesaj..."
                        className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 transition-all shadow-md active:scale-95"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}