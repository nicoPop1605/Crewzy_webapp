import { MoreVertical, UserMinus, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export interface Friend {
    id: string;
    name: string;
    username: string;
    avatar: string;
    status: 'online' | 'offline';
}

interface FriendCardProps {
    friend: Friend;
    onRemove: (id: string) => void;
    onChat: () => void; // Am adăugat onChat în interfață
}

export function FriendCard({ friend, onRemove, onChat }: FriendCardProps) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
                {/* Avatar Section */}
                <div className="relative">
                    <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-14 h-14 rounded-full object-cover border border-gray-100"
                    />
                    {friend.status === 'online' && (
                        <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                    )}
                </div>

                {/* Info Section */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{friend.name}</h3>
                    <p className="text-sm text-gray-500 truncate">@{friend.username}</p>
                </div>

                {/* Actions Section */}
                <div className="flex items-center gap-2">
                    {/* Butonul de Chat - Acum funcțional */}
                    <button
                        onClick={onChat}
                        className="p-2.5 hover:bg-purple-50 rounded-xl transition-colors group"
                        title="Send Message"
                    >
                        <MessageCircle className="w-5 h-5 text-gray-600 group-hover:text-purple-600" />
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>

                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowMenu(false)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl z-20 py-2 border border-gray-100">
                                    <button
                                        onClick={() => {
                                            onRemove(friend.id);
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                    >
                                        <UserMinus className="w-4 h-4" />
                                        Remove Friend
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}