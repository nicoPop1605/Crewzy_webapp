import { useState } from 'react';
import { UserPlus, Users as UsersIcon, Search } from 'lucide-react';
import { FriendCard, Friend } from '../components/FriendCard';
import { GroupCard, Group } from '../components/GroupCard';
import { AddFriendModal } from '../components/AddFriendModal';
import { CreateGroupModal } from '../components/CreateGroupModal';
import { ManageMembersModal } from '../components/ManageMembersModal';
import { ChatWindow } from '../components/ChatWindow';

export function FriendsPage() {
    const [activeTab, setActiveTab] = useState<'friends' | 'groups'>('friends');
    const [showAddFriendModal, setShowAddFriendModal] = useState(false);
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [chattingWith, setChattingWith] = useState<Friend | null>(null);

    const [friends, setFriends] = useState<Friend[]>([
        {
            id: '1',
            name: 'Sarah Johnson',
            username: 'sarahj',
            avatar: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=400',
            status: 'online',
        },
        {
            id: '2',
            name: 'Michael Chen',
            username: 'mchen',
            avatar: 'https://images.unsplash.com/photo-1600080695930-6af670ad44fb?w=400',
            status: 'online',
        },
        {
            id: '3',
            name: 'Emma Williams',
            username: 'emmaw',
            avatar: 'https://images.unsplash.com/photo-1594318223885-20dc4b889f9e?w=400',
            status: 'offline',
        }
    ]);

    const [groups, setGroups] = useState<Group[]>([
        {
            id: '1',
            name: 'Weekend Warriors',
            description: 'Friends who love weekend adventures',
            members: 8,
            isAdmin: true,
            avatars: ['https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=100'],
        }
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
            avatar: 'https://images.unsplash.com/photo-1689910651250-89c8334c9f30?w=400',
            status: 'offline',
        };
        setFriends([...friends, newFriend]);
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

    return (
        <div className="flex-1 overflow-auto relative">
            {/* Header Section */}
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
                            <><UserPlus className="w-5 h-5" /> <span className="font-medium">Add Friend</span></>
                        ) : (
                            <><UsersIcon className="w-5 h-5" /> <span className="font-medium">Create Group</span></>
                        )}
                    </button>
                </div>

                {/* Search & Tabs */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 bg-white rounded-full p-1 shadow-sm w-fit">
                        <button
                            onClick={() => setActiveTab('friends')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'friends' ? 'bg-gray-900 text-white' : 'text-gray-600'
                                }`}
                        >
                            Friends
                        </button>
                        <button
                            onClick={() => setActiveTab('groups')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'groups' ? 'bg-gray-900 text-white' : 'text-gray-600'
                                }`}
                        >
                            Groups
                        </button>
                    </div>

                    <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-5 py-3 shadow-sm max-w-md border border-transparent focus-within:border-gray-200">
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
            </div>

            {/* Main Grid Content */}
            <div className="p-8">
                {activeTab === 'friends' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredFriends.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500">No friends found.</div>
                        ) : (
                            filteredFriends.map((friend) => (
                                <FriendCard
                                    key={friend.id}
                                    friend={friend}
                                    onRemove={handleRemoveFriend}
                                    onChat={() => setChattingWith(friend)}
                                />
                            ))
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGroups.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500">No groups found.</div>
                        ) : (
                            filteredGroups.map((group) => (
                                <GroupCard
                                    key={group.id}
                                    group={group}
                                    onLeave={(id) => setGroups(groups.filter(g => g.id !== id))}
                                    onDelete={(id) => setGroups(groups.filter(g => g.id !== id))}
                                    onManageMembers={setSelectedGroup}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* --- CHAT OVERLAY --- */}
            {chattingWith && (
                <ChatWindow
                    targetUser={chattingWith}
                    onClose={() => setChattingWith(null)}
                />
            )}

            {/* --- MODALS --- */}
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
                onAddMember={(gid, fid) => console.log('Add', fid, 'to', gid)}
                onRemoveMember={(gid, mid) => console.log('Remove', mid, 'from', gid)}
            />
        </div>
    );
}