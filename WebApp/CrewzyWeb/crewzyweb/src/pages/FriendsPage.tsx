import { useState } from 'react';
import { UserPlus, Users as UsersIcon, Search } from 'lucide-react';
import { FriendCard, Friend } from '../components/FriendCard';
import { GroupCard, Group } from '../components/GroupCard';
import { AddFriendModal } from '../components/AddFriendModal';
import { CreateGroupModal } from '../components/CreateGroupModal';
import { ManageMembersModal } from '../components/ManageMembersModal';

export function FriendsPage() {
  const [activeTab, setActiveTab] = useState<'friends' | 'groups'>('friends');
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [friends, setFriends] = useState<Friend[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      username: 'sarahj',
      avatar: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHlvdW5nJTIwd29tYW58ZW58MXx8fHwxNzczNTg1MTY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      status: 'online',
    },
    {
      id: '2',
      name: 'Michael Chen',
      username: 'mchen',
      avatar: 'https://images.unsplash.com/photo-1600080695930-6af670ad44fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHlvdW5nJTIwbWFufGVufDF8fHx8MTc3MzYwOTUzOXww&ixlib=rb-4.1.0&q=80&w=1080',
      status: 'online',
    },
    {
      id: '3',
      name: 'Emma Williams',
      username: 'emmaw',
      avatar: 'https://images.unsplash.com/photo-1594318223885-20dc4b889f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHNtaWxpbmclMjB3b21hbnxlbnwxfHx8fDE3NzM2ODIxOTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      status: 'offline',
    },
    {
      id: '4',
      name: 'David Martinez',
      username: 'dmartinez',
      avatar: 'https://images.unsplash.com/photo-1554765345-6ad6a5417cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHByb2Zlc3Npb25hbCUyMG1hbnxlbnwxfHx8fDE3NzM2NTQ0Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      status: 'online',
    },
    {
      id: '5',
      name: 'Lisa Anderson',
      username: 'lisaa',
      avatar: 'https://images.unsplash.com/photo-1595436222774-4b1cd819aada?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHByb2Zlc3Npb25hbCUyMHBlcnNvbnxlbnwxfHx8fDE3NzM1ODAzODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      status: 'offline',
    },
    {
      id: '6',
      name: 'James Wilson',
      username: 'jwilson',
      avatar: 'https://images.unsplash.com/photo-1689910651250-89c8334c9f30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGNhc3VhbCUyMHBlcnNvbnxlbnwxfHx8fDE3NzM2ODIyMDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      status: 'online',
    },
  ]);

  const [groups, setGroups] = useState<Group[]>([
    {
      id: '1',
      name: 'Weekend Warriors',
      description: 'Friends who love weekend adventures and outdoor activities',
      members: 8,
      isAdmin: true,
      avatars: [
        'https://images.unsplash.com/photo-1546961329-78bef0414d7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHlvdW5nJTIwd29tYW58ZW58MXx8fHwxNzczNTg1MTY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1600080695930-6af670ad44fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHlvdW5nJTIwbWFufGVufDF8fHx8MTc3MzYwOTUzOXww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1594318223885-20dc4b889f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHNtaWxpbmclMjB3b21hbnxlbnwxfHx8fDE3NzM2ODIxOTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1554765345-6ad6a5417cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHByb2Zlc3Npb25hbCUyMG1hbnxlbnwxfHx8fDE3NzM2NTQ0Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
    },
    {
      id: '2',
      name: 'Book Club',
      description: 'Monthly book discussions and literary adventures',
      members: 12,
      isAdmin: false,
      avatars: [
        'https://images.unsplash.com/photo-1595436222774-4b1cd819aada?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHByb2Zlc3Npb25hbCUyMHBlcnNvbnxlbnwxfHx8fDE3NzM1ODAzODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1689910651250-89c8334c9f30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGNhc3VhbCUyMHBlcnNvbnxlbnwxfHx8fDE3NzM2ODIyMDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1546961329-78bef0414d7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHlvdW5nJTIwd29tYW58ZW58MXx8fHwxNzczNTg1MTY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1600080695930-6af670ad44fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHlvdW5nJTIwbWFufGVufDF8fHx8MTc3MzYwOTUzOXww&ixlib=rb-4.1.0&q=80&w=1080',
      ],
    },
    {
      id: '3',
      name: 'Fitness Squad',
      description: 'Stay motivated and share workout tips',
      members: 15,
      isAdmin: true,
      avatars: [
        'https://images.unsplash.com/photo-1594318223885-20dc4b889f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHNtaWxpbmclMjB3b21hbnxlbnwxfHx8fDE3NzM2ODIxOTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1554765345-6ad6a5417cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHByb2Zlc3Npb25hbCUyMG1hbnxlbnwxfHx8fDE3NzM2NTQ0Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1595436222774-4b1cd819aada?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHByb2Zlc3Npb25hbCUyMHBlcnNvbnxlbnwxfHx8fDE3NzM1ODAzODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1689910651250-89c8334c9f30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGNhc3VhbCUyMHBlcnNvbnxlbnwxfHx8fDE3NzM2ODIyMDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
    },
  ]);

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveFriend = (id: string) => {
    setFriends(friends.filter((friend) => friend.id !== id));
  };

  const handleAddFriend = (username: string) => {
    const newFriend: Friend = {
      id: Date.now().toString(),
      name: username,
      username: username.toLowerCase().replace(/\s+/g, ''),
      avatar: 'https://images.unsplash.com/photo-1689910651250-89c8334c9f30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGNhc3VhbCUyMHBlcnNvbnxlbnwxfHx8fDE3NzM2ODIyMDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      status: 'offline',
    };
    setFriends([...friends, newFriend]);
  };

  const handleLeaveGroup = (id: string) => {
    setGroups(groups.filter((group) => group.id !== id));
  };

  const handleDeleteGroup = (id: string) => {
    setGroups(groups.filter((group) => group.id !== id));
  };

  const handleCreateGroup = (name: string, description: string) => {
    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      description,
      members: 1,
      isAdmin: true,
      avatars: [friends[0]?.avatar || ''],
    };
    setGroups([...groups, newGroup]);
  };

  const handleManageMembers = (group: Group) => {
    setSelectedGroup(group);
  };

  const handleAddMember = (groupId: string, friendId: string) => {
    // In a real app, this would add the friend to the group
    console.log('Adding friend', friendId, 'to group', groupId);
  };

  const handleRemoveMember = (groupId: string, memberId: string) => {
    // In a real app, this would remove the member from the group
    console.log('Removing member', memberId, 'from group', groupId);
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm px-8 py-6 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Friends</h1>
            <p className="text-gray-600">Manage your friends and groups</p>
          </div>
          <button
            onClick={() => activeTab === 'friends' ? setShowAddFriendModal(true) : setShowCreateGroupModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors shadow-lg"
          >
            {activeTab === 'friends' ? (
              <>
                <UserPlus className="w-5 h-5" />
                <span className="font-medium">Add Friend</span>
              </>
            ) : (
              <>
                <UsersIcon className="w-5 h-5" />
                <span className="font-medium">Create Group</span>
              </>
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-white rounded-full p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('friends')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'friends'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Friends
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'groups'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Groups
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-5 py-3 shadow-sm max-w-md">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'friends' ? 'Search friends...' : 'Search groups...'}
              className="flex-1 text-sm outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="text-sm">
            <span className="font-semibold text-gray-900">{friends.length}</span>
            <span className="text-gray-600"> friends</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-900">{groups.length}</span>
            <span className="text-gray-600"> groups</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-900">
              {friends.filter((f) => f.status === 'online').length}
            </span>
            <span className="text-gray-600"> online</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {activeTab === 'friends' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFriends.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-gray-500">
                {searchQuery ? 'No friends found' : 'No friends yet. Add some friends to get started!'}
              </div>
            ) : (
              filteredFriends.map((friend) => (
                <FriendCard key={friend.id} friend={friend} onRemove={handleRemoveFriend} />
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-gray-500">
                {searchQuery ? 'No groups found' : 'No groups yet. Create a group to get started!'}
              </div>
            ) : (
              filteredGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onLeave={handleLeaveGroup}
                  onDelete={handleDeleteGroup}
                  onManageMembers={handleManageMembers}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddFriendModal
        isOpen={showAddFriendModal}
        onClose={() => setShowAddFriendModal(false)}
        onAdd={handleAddFriend}
      />
      <CreateGroupModal
        isOpen={showCreateGroupModal}
        onClose={() => setShowCreateGroupModal(false)}
        onCreate={handleCreateGroup}
      />
      <ManageMembersModal
        isOpen={selectedGroup !== null}
        group={selectedGroup}
        friends={friends}
        onClose={() => setSelectedGroup(null)}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
      />
    </div>
  );
}
