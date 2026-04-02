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
}

export function FriendCard({ friend, onRemove }: FriendCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          <img
            src={friend.avatar}
            alt={friend.name}
            className="w-14 h-14 rounded-full object-cover"
          />
          {friend.status === 'online' && (
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{friend.name}</h3>
          <p className="text-sm text-gray-500 truncate">@{friend.username}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MessageCircle className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl z-20 py-2">
                  <button
                    onClick={() => {
                      onRemove(friend.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
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
