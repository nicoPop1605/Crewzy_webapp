import { X, UserPlus, UserMinus, Search } from 'lucide-react';
import { useState } from 'react';
import { Friend } from './FriendCard';
import { Group } from './GroupCard';

interface ManageMembersModalProps {
  isOpen: boolean;
  group: Group | null;
  friends: Friend[];
  onClose: () => void;
  onAddMember: (groupId: string, friendId: string) => void;
  onRemoveMember: (groupId: string, memberId: string) => void;
}

export function ManageMembersModal({
  isOpen,
  group,
  friends,
  onClose,
  onAddMember,
  onRemoveMember,
}: ManageMembersModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'add' | 'members'>('add');

  if (!isOpen || !group) return null;

  // Mock current members (in a real app, this would come from the group data)
  const currentMembers = friends.slice(0, 3);
  const availableFriends = friends.filter(
    (friend) => !currentMembers.find((member) => member.id === friend.id)
  );

  const filteredFriends = availableFriends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMembers = currentMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{group.name}</h2>
              <p className="text-sm text-gray-600 mt-1">Manage group members</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setActiveTab('add')}
              className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'add'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Add Members
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'members'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Current Members
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'add' ? 'Search friends...' : 'Search members...'}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'add' ? (
            <div className="space-y-3">
              {filteredFriends.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {searchQuery ? 'No friends found' : 'All friends are already in this group'}
                </div>
              ) : (
                filteredFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{friend.name}</h3>
                      <p className="text-sm text-gray-500 truncate">@{friend.username}</p>
                    </div>
                    <button
                      onClick={() => onAddMember(group.id, friend.id)}
                      className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMembers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No members found
                </div>
              ) : (
                filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
                      <p className="text-sm text-gray-500 truncate">@{member.username}</p>
                    </div>
                    <button
                      onClick={() => onRemoveMember(group.id, member.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
