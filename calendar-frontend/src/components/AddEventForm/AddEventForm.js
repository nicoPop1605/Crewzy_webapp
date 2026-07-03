import React, { useState, useEffect } from "react";
import styles from "./AddEventForm.module.css";

function AddEventForm({ onAdd, editingEvent, preselectedDate, groups }) {
    const [step, setStep] = useState(1);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");
    const [location, setLocation] = useState("");
    const [selectedGroupId, setSelectedGroupId] = useState("");

    useEffect(() => {
        if (editingEvent) {
            setTitle(editingEvent.title || "");
            setDescription(editingEvent.description || "");
            setStartDateTime(editingEvent.startDateTime || "");
            setEndDateTime(editingEvent.endDateTime || "");
            setLocation(editingEvent.location || "");
            setSelectedGroupId(editingEvent.group?.id || "");
        } else if (preselectedDate) {
            setStartDateTime(preselectedDate);
            // Calculăm data de final fără toISOString pentru a păstra ora locală
            const end = new Date(preselectedDate);
            end.setHours(end.getHours() + 2);

            const year = end.getFullYear();
            const month = String(end.getMonth() + 1).padStart(2, '0');
            const day = String(end.getDate()).padStart(2, '0');
            const hours = String(end.getHours()).padStart(2, '0');
            const minutes = String(end.getMinutes()).padStart(2, '0');

            setEndDateTime(`${year}-${month}-${day}T${hours}:${minutes}`);
        }
    }, [editingEvent, preselectedDate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Obiectul de date pe care backend-ul îl așteaptă
        const finalData = {
            title,
            description: description || title, // Esențial: trimitem descrierea chiar dacă e egală cu titlul
            startDateTime,
            endDateTime,
            location,
            group: selectedGroupId ? { id: Number(selectedGroupId) } : null
        };

        console.log("Trimitere date către App.js:", finalData);
        onAdd(finalData);
    };

    return (
        <div className={styles.container}>
            <div className={styles.progressContainer}>
                <div className={styles.progressBar} style={{ width: `${(step / 4) * 100}%` }}></div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                {step === 1 && (
                    <div className={styles.stepAnimate}>
                        <label className={styles.label}>Ce facem? 🍻</label>
                        <input type="text" placeholder="Titlu Plan" value={title} onChange={e => setTitle(e.target.value)} className={styles.input} required />
                        <input type="text" placeholder="Descriere scurtă" value={description} onChange={e => setDescription(e.target.value)} className={styles.input} style={{marginTop: '10px'}} />
                        <button type="button" onClick={() => setStep(2)} disabled={!title} className={styles.button}>Next</button>
                    </div>
                )}

                {step === 2 && (
                    <div className={styles.stepAnimate}>
                        <label className={styles.label}>Când? ⏰</label>
                        <input type="datetime-local" value={startDateTime} onChange={e => setStartDateTime(e.target.value)} className={styles.input} required />
                        <input type="datetime-local" value={endDateTime} onChange={e => setEndDateTime(e.target.value)} className={styles.input} style={{marginTop: '10px'}} required />
                        <div className={styles.buttonRow}>
                            <button type="button" onClick={() => setStep(1)} className={styles.backBtn}>Back</button>
                            <button type="button" onClick={() => setStep(3)} className={styles.button}>Next</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className={styles.stepAnimate}>
                        <label className={styles.label}>Unde? 📍</label>
                        <input type="text" placeholder="Locația" value={location} onChange={e => setLocation(e.target.value)} className={styles.input} required />
                        <div className={styles.buttonRow}>
                            <button type="button" onClick={() => setStep(2)} className={styles.backBtn}>Back</button>
                            <button type="button" onClick={() => setStep(4)} disabled={!location} className={styles.button}>Next</button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className={styles.stepAnimate}>
                        <label className={styles.label}>Cu cine? 👥</label>
                        <select className={styles.input} value={selectedGroupId} onChange={e => setSelectedGroupId(e.target.value)}>
                            <option value="">Personal Plan</option>
                            {groups && groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                        <div className={styles.buttonRow}>
                            <button type="button" onClick={() => setStep(3)} className={styles.backBtn}>Back</button>
                            <button type="submit" className={styles.buttonSubmit}>Finalizează ✨</button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}

export default AddEventForm;