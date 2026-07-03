import React, { useState, useEffect } from "react";
import "./App.css";
import AddEventForm from "./components/AddEventForm/AddEventForm";
import WeeklyCalendar from "./components/WeeklyCalendar/WeeklyCalendar";
import CreateGroupForm from "./components/CreateGroupForm/CreateGroupForm";
import Modal from "./components/Modal/Modal";

function App() {
    // 1. Toate stările necesare (Fixează erorile de 'not defined')
    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]); // Rezolvă eroarea de la linia 84 și 150
    const [currentUser, setCurrentUser] = useState(null);
    const [groups, setGroups] = useState([]);

    const [activeView, setActiveView] = useState("calendar");
    const [editingEvent, setEditingEvent] = useState(null);
    const [editingGroup, setEditingGroup] = useState(null);
    const [preselectedDate, setPreselectedDate] = useState("");

    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

    // 2. Funcția de încărcare date
    const refreshAllData = async () => {
        try {
            const [evRes, userRes, groupRes] = await Promise.all([
                fetch("http://localhost:8080/events"),
                fetch("http://localhost:8080/users"),
                fetch("http://localhost:8080/groups")
            ]);
            const evData = await evRes.json();
            const userData = await userRes.json();
            const groupData = await groupRes.json();

            setEvents(Array.isArray(evData) ? evData : []);
            setUsers(Array.isArray(userData) ? userData : []);
            setGroups(Array.isArray(groupData) ? groupData : []);

            if (userData.length > 0 && !currentUser) {
                setCurrentUser(userData[0]);
            }
        } catch (err) { console.error("Error loading data:", err); }
    };

    useEffect(() => { refreshAllData(); }, []);

    // 3. Logica de Schimbare Cont (Switch Account)
    const handleSwitchAccount = (userId) => {
        const newUser = users.find(u => u.id === parseInt(userId));
        if (newUser) {
            setCurrentUser(newUser);
            setActiveView("calendar");
            refreshAllData();
        }
    };

    // 4. Funcția de Creare Utilizator (Rezolvă eroarea de la linia 157)
    const handleCreateUser = async () => {
        const name = prompt("Username:");
        const email = prompt("Email:");
        if (!name || !email) return;
        try {
            const res = await fetch("http://localhost:8080/users", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name, email}),
            });
            if (res.ok) refreshAllData();
        } catch (err) { alert("Error creating user"); }
    };

    // 5. Logica Leave Group (Necesită PUT în Backend)
    const handleLeaveGroup = async (group) => {
        if (group.adminId === currentUser.id) {
            alert("Administratorii nu pot părăsi grupul. Șterge hub-ul.");
            return;
        }
        if (!window.confirm(`Vrei să părăsești hub-ul ${group.name}?`)) return;

        const updatedMembers = group.members
            .filter(m => m.id !== currentUser.id)
            .map(m => ({ id: m.id }));

        try {
            const res = await fetch(`http://localhost:8080/groups/${group.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...group, members: updatedMembers }),
            });
            if (res.ok) await refreshAllData();
            else alert("Eroare Server: Verifică @PutMapping în Java");
        } catch (err) { alert("Network Error!"); }
    };

    const handleDeleteGroup = async (groupId) => {
        if (!window.confirm("Ștergi Hub-ul definitiv?")) return;
        try {
            await fetch(`http://localhost:8080/groups/${groupId}`, { method: "DELETE" });
            refreshAllData();
        } catch (err) { alert("Network Error la ștergere."); }
    };

    const handleDeleteEvent = async (eventId) => {
        // Confirmare pentru a evita ștergerile accidentale
        if (!window.confirm("Sigur vrei să ștergi acest plan?")) return;

        try {
            const res = await fetch(`http://localhost:8080/events/${eventId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                // Reîncărcăm datele de la server pentru a actualiza calendarul
                await refreshAllData();
            } else {
                const errorText = await res.text();
                alert("Eroare la ștergere: " + errorText);
            }
        } catch (err) {
            console.error("Network Error:", err);
            alert("Eroare de rețea! Verifică dacă backend-ul rulează.");
        }
    };

    const handleAddOrUpdateEvent = async (eventData) => {
        try {
            // Determinăm dacă este POST (nou) sau PUT (update)
            const isUpdate = !!editingEvent;
            const url = isUpdate
                ? `http://localhost:8080/events/${editingEvent.id}`
                : "http://localhost:8080/events";

            const res = await fetch(url, {
                method: isUpdate ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(eventData),
            });

            if (res.ok) {
                // 1. Închidem modalul imediat
                setIsEventModalOpen(false);
                // 2. Curățăm starea de editare
                setEditingEvent(null);
                // 3. Forțăm reîncărcarea listei din backend
                await refreshAllData();
            } else {
                const errorText = await res.text();
                alert("Eroare server: " + errorText);
            }
        } catch (err) {
            alert("Network Error! Verifică dacă backend-ul este pornit.");
        }
    };

    const handleJoinEvent = async (eventId) => {
        try {
            const res = await fetch(`http://localhost:8080/events/${eventId}/join/${currentUser.id}`, {
                method: "POST"
            });
            if (res.ok) refreshAllData();
        } catch (err) { console.error("Join error:", err); }
    };

    const handleLeaveEvent = async (eventId) => {
        try {
            const res = await fetch(`http://localhost:8080/events/${eventId}/leave/${currentUser.id}`, {
                method: "POST"
            });
            if (res.ok) refreshAllData();
        } catch (err) { console.error("Leave error:", err); }
    };



    return (
        <div className="app-container">
            <header className="glass-header">
                <h1>Hangout Planner 🥂</h1>
            </header>

            <main className="view-section">
                {currentUser ? (
                    <>
                        {activeView === "discovery" && <div className="view-animate"><h2>🔎 Discovery</h2><p>Coming Soon...</p></div>}

                        {activeView === "calendar" && (
                            <div className="view-animate">
                                <WeeklyCalendar
                                    events={events}
                                    currentUser={currentUser}
                                    onDelete={handleDeleteEvent}
                                    onEdit={(ev) => { setEditingEvent(ev); setIsEventModalOpen(true); }}
                                    onQuickAdd={(date) => { setPreselectedDate(date); setIsEventModalOpen(true); }}
                                    onJoin={handleJoinEvent}
                                    onLeave={handleLeaveEvent}
                                />
                            </div>
                        )}

                        {activeView === "social" && (
                            <div className="view-animate">
                                <div className="social-card">
                                    <div className="card-header">
                                        <h3>Hub-urile Mele 🏘️</h3>
                                        <button className="btn-add" onClick={() => { setEditingGroup(null); setIsGroupModalOpen(true); }}>+ Nou</button>
                                    </div>
                                    <div className="group-list">
                                        {groups?.filter(g => g.members?.some(m => m.id === currentUser.id)).map(g => (
                                            <div key={g.id} className="group-row">
                                                <div className="group-info">
                                                    <span className="group-name">{g.name}</span>
                                                    <span className="group-meta">{g.members?.length} participanți</span>
                                                </div>
                                                <div className="group-actions">
                                                    {g.adminId === currentUser.id ? (
                                                        <>
                                                            <button onClick={() => { setEditingGroup(g); setIsGroupModalOpen(true); }}>✏️</button>
                                                            <button className="danger" onClick={() => handleDeleteGroup(g.id)}>🗑️</button>
                                                        </>
                                                    ) : (
                                                        <button className="leave-link" onClick={() => handleLeaveGroup(g)}>Leave</button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeView === "profile" && (
                            <div className="view-animate">
                                <div className="social-card profile-card">
                                    <div className="profile-avatar">{currentUser.name[0]}</div>
                                    <h2>{currentUser.name}</h2>
                                    <div className="switch-section">
                                        <label>Switch Account 🔄</label>
                                        <select
                                            className="modern-select"
                                            value={currentUser.id}
                                            onChange={(e) => handleSwitchAccount(e.target.value)}
                                        >
                                            {users.map(u => (
                                                <option key={u.id} value={u.id}>{u.name}</option>
                                            ))}
                                        </select>
                                        <button onClick={handleCreateUser} className="btn-add-account">+ New Account</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : <div className="loader">Connecting...</div>}
            </main>

            <nav className="bottom-nav">
                <button className={`nav-item ${activeView === 'discovery' ? 'active' : ''}`} onClick={() => setActiveView("discovery")}>🔎</button>
                <button className={`nav-item ${activeView === 'calendar' ? 'active' : ''}`} onClick={() => setActiveView("calendar")}>📅</button>
                <button className="plan-center-btn" onClick={() => { setEditingEvent(null); setPreselectedDate(new Date().toISOString().slice(0, 16)); setIsEventModalOpen(true); }}>🔥</button>
                <button className={`nav-item ${activeView === 'social' ? 'active' : ''}`} onClick={() => setActiveView("social")}>👥</button>
                <button className={`nav-item ${activeView === 'profile' ? 'active' : ''}`} onClick={() => setActiveView("profile")}>👤</button>
            </nav>

            <Modal isOpen={isEventModalOpen} onClose={() => {setIsEventModalOpen(false); setEditingEvent(null);}} title="Plan">
                <AddEventForm
                    onAdd={handleAddOrUpdateEvent} // Schimbă de la () => refresh... la funcția de salvare
                    editingEvent={editingEvent}
                    preselectedDate={preselectedDate}
                    groups={groups}
                />
            </Modal>
            <Modal isOpen={isGroupModalOpen} onClose={() => {setIsGroupModalOpen(false); setEditingGroup(null);}} title="Hub">
                <CreateGroupForm currentUser={currentUser} editingGroup={editingGroup} onGroupCreated={() => { refreshAllData(); setIsGroupModalOpen(false); }} />
            </Modal>
        </div>
    );
}

export default App;