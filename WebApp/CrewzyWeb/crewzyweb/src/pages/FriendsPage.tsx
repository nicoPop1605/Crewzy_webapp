import { useState, useEffect, useCallback } from 'react';
import { UserPlus, Users as UsersIcon, Search } from 'lucide-react';
import { FriendCard, Friend } from '../components/FriendCard';
import { GroupCard, Group } from '../components/GroupCard';
import { AddFriendModal } from '../components/AddFriendModal';
import { CreateGroupModal } from '../components/CreateGroupModal';
import { ManageMembersModal } from '../components/ManageMembersModal';
import { ChatWindow } from '../components/ChatWindow';

interface FriendRequest {
    id: string;
    sender: { name: string; email: string };
}

const API_URL = 'http://127.0.0.1:4000';

const fetchGraphQL = async (query: string, variables = {}) => {
    const response = await fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
    });
    const result = await response.json();
    if (result.errors) throw new Error(result.errors[0].message);
    return result.data;
};

export function FriendsPage() {
    // REVENIM LA LOCAL STORAGE pentru a menține sesiunea stabilă!
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const realUserId = currentUser ? currentUser.id : null;

    const [activeTab, setActiveTab] = useState<'friends' | 'groups'>('friends');
    const [showAddFriendModal, setShowAddFriendModal] = useState(false);
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [chattingWith, setChattingWith] = useState<Friend | null>(null);

    const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
    const [friends, setFriends] = useState<Friend[]>([]); // Pornește GOL, încarcă doar din Baza de Date
    const [groups, setGroups] = useState<Group[]>([]);

    const loadPendingRequests = useCallback(async () => {
        if (!realUserId) return;
        try {
            const query = `query GetRequests($userId: String!) { getPendingRequests(userId: $userId) { id sender { name email } } }`;
            const data = await fetchGraphQL(query, { userId: realUserId });
            setPendingRequests(data?.getPendingRequests || []);
        } catch (_err) { console.error("Eroare cereri"); }
    }, [realUserId]);

    const loadFriends = useCallback(async () => {
        if (!realUserId) return;
        try {
            const query = `query GetFriends($userId: String!) { getFriends(userId: $userId) { id name username avatar status } }`;
            const data = await fetchGraphQL(query, { userId: realUserId });
            setFriends(data?.getFriends || []);
        } catch (_err) { console.error("Eroare prieteni"); }
    }, [realUserId]);

    useEffect(() => {
        loadPendingRequests();
        loadFriends();
    }, [loadPendingRequests, loadFriends]);

    const handleAccept = async (requestId: string) => {
        await fetchGraphQL(`mutation Accept($id: String!) { acceptFriend(requestId: $id) }`, { id: requestId });
        loadPendingRequests();
        loadFriends();
    };

    const handleReject = async (requestId: string) => {
        await fetchGraphQL(`mutation Reject($id: String!) { rejectFriend(requestId: $id) }`, { id: requestId });
        loadPendingRequests();
    };

    // AICI ESTE REPARATĂ LOGICA: Nu mai forțăm afișarea în listă
    const handleAddFriend = async (query: string) => {
        if (!realUserId) return alert("Nu ești logat!");
        try {
            const mutation = `mutation AddFriend($userId: String!, $friendQuery: String!) { addFriend(userId: $userId, friendQuery: $friendQuery) }`;
            await fetchGraphQL(mutation, { userId: realUserId, friendQuery: query });
            alert("Cerere de prietenie trimisă cu succes!");
            setShowAddFriendModal(false);
        } catch (err: any) {
            alert("Eroare: " + err.message);
        }
    };

    const handleRemoveFriend = async (friendId: string) => {
        if (!window.confirm("Are you sure you want to remove this friend?")) return;
        if (!realUserId) return;

        try {
            const mutation = `
                mutation RemoveFriend($userId: String!, $friendId: String!) { 
                    removeFriend(userId: $userId, friendId: $friendId) 
                }
            `;
            await fetchGraphQL(mutation, { userId: realUserId, friendId });
            loadFriends(); // Reîncărcăm lista imediat după ștergere
        } catch (err: any) {
            alert("Error removing friend: " + err.message);
        }
    };

    const handleCreateGroup = (name: string, description: string) => {
        const newGroup: Group = {
            id: Date.now().toString(),
            name, description, members: 1, isAdmin: true, avatars: [],
        };
        setGroups([...groups, newGroup]);
        setShowCreateGroupModal(false);
    };

    const filteredFriends = friends.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="flex-1 overflow-auto relative">
            <div className="bg-white/60 backdrop-blur-sm px-8 py-6 sticky top-0 z-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Friends</h1>
                        <p className="text-gray-600">Manage your friends and groups</p>
                    </div>
                    <button onClick={() => activeTab === 'friends' ? setShowAddFriendModal(true) : setShowCreateGroupModal(true)} className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors shadow-lg">
                        <UserPlus className="w-5 h-5" /> <span>{activeTab === 'friends' ? 'Add Friend' : 'Create Group'}</span>
                    </button>
                </div>

                {activeTab === 'friends' && pendingRequests.length > 0 && (
                    <div className="mb-8 bg-purple-50 p-6 rounded-3xl border border-purple-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Pending Requests ({pendingRequests.length})</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            {pendingRequests.map((req) => (
                                <div key={req.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="font-semibold">{req.sender.name}</p>
                                        <p className="text-xs text-gray-500">{req.sender.email}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleAccept(req.id)} className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600">Accept</button>
                                        <button onClick={() => handleReject(req.id)} className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200">Decline</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-4 mb-6">
                    <button onClick={() => setActiveTab('friends')} className={`px-6 py-2 rounded-full ${activeTab === 'friends' ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}>Friends</button>
                    <button onClick={() => setActiveTab('groups')} className={`px-6 py-2 rounded-full ${activeTab === 'groups' ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}>Groups</button>
                    <div className="flex-1 flex items-center bg-white rounded-full px-5 py-3 shadow-sm border border-gray-200">
                        <Search className="w-5 h-5 text-gray-400 mr-2" />
                        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full outline-none bg-transparent" />
                    </div>
                </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeTab === 'friends'
                    ? (filteredFriends.length === 0
                        ? <p className="text-gray-500">You haven't added any friends yet.</p>
                        : filteredFriends.map(f => (
                            <FriendCard
                                key={f.id}
                                friend={f}
                                onRemove={() => handleRemoveFriend(f.id)}
                                onChat={() => setChattingWith(f)}
                            />
                        ))
                    )
                    : (filteredGroups.length === 0
                        ? <p className="text-gray-500">You are not in any groups.</p>
                        : filteredGroups.map(g => (
                            <GroupCard
                                key={g.id}
                                group={g}
                                onLeave={() => { }}
                                onDelete={() => { }}
                                onManageMembers={setSelectedGroup}
                            />
                        ))
                    )
                }
            </div>

            {chattingWith && <ChatWindow targetUser={chattingWith} onClose={() => setChattingWith(null)} />}
            <AddFriendModal isOpen={showAddFriendModal} onClose={() => setShowAddFriendModal(false)} onAdd={handleAddFriend} />
            <CreateGroupModal isOpen={showCreateGroupModal} onClose={() => setShowCreateGroupModal(false)} onCreate={handleCreateGroup} />
        </div>
    );
}