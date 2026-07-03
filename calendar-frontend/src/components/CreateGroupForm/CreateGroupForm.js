import React, { useState } from "react";
import styles from "./CreateGroupForm.module.css";

function CreateGroupForm({ currentUser, onGroupCreated, editingGroup }) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [groupName, setGroupName] = useState(editingGroup ? editingGroup.name : "");
    const [selectedFriends, setSelectedFriends] = useState(
        editingGroup ? editingGroup.members.filter(m => m.id !== currentUser.id).map(m => m.id) : []
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        const allMembers = [{ id: currentUser.id }, ...selectedFriends.map(id => ({ id }))];

        const url = editingGroup ? `http://localhost:8080/groups/${editingGroup.id}` : "http://localhost:8080/groups";
        const method = editingGroup ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: groupName,
                    adminId: currentUser.id,
                    members: allMembers
                }),
            });
            if (response.ok) onGroupCreated();
        } catch (err) { alert("Eroare!"); }
    };

    // Funcție pentru a bifa/debifa un prieten
    const toggleFriend = (friendId) => {
        if (selectedFriends.includes(friendId)) {
            setSelectedFriends(selectedFriends.filter(id => id !== friendId));
        } else {
            setSelectedFriends([...selectedFriends, friendId]);
        }
    };



    return (
        <div className={styles.container}>
            {/* Bara de Progres */}
            <div className={styles.progressContainer}>
                <div className={styles.progressBar} style={{ width: step === 1 ? "50%" : "100%" }}></div>
            </div>

            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <div className={styles.stepAnimate}>
                        <label className={styles.label}>Cum se numește Hub-ul? 🏘️</label>
                        <input
                            type="text"
                            placeholder="Ex: Echipa de Fotbal / Family"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className={styles.input}
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            disabled={!groupName.trim()}
                            className={styles.button}
                            style={{ marginTop: "10px" }}
                        >
                            Continuă la invitații
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className={styles.stepAnimate}>
                        <label className={styles.label}>Cine face parte din grup? 👥</label>
                        <div className={styles.friendsList}>
                            {currentUser.friends && currentUser.friends.length > 0 ? (
                                currentUser.friends.map(friend => (
                                    <div
                                        key={friend.id}
                                        className={`${styles.friendItem} ${selectedFriends.includes(friend.id) ? styles.selectedFriend : ""}`}
                                        onClick={() => toggleFriend(friend.id)}
                                    >
                                        <span className={styles.avatar}>{friend.name[0]}</span>
                                        <span className={styles.friendName}>{friend.name}</span>
                                        <input
                                            type="checkbox"
                                            readOnly
                                            checked={selectedFriends.includes(friend.id)}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p className={styles.emptyText}>Nu ai prieteni în listă pentru a-i adăuga.</p>
                            )}
                        </div>

                        <div className={styles.buttonRow}>
                            <button type="button" onClick={() => setStep(1)} className={styles.backBtn}>Înapoi</button>
                            <button
                                type="submit"
                                className={styles.buttonSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Se creează..." : "Finalizează Hub ✨"}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}

export default CreateGroupForm;