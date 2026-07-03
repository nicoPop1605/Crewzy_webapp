import React, { useState } from "react";
import styles from "./WeeklyCalendar.module.css";

const WeeklyCalendar = ({ events, onDelete, onEdit, onQuickAdd, currentUser, onJoin, onLeave }) => {
    const [baseDate, setBaseDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    // Move this here, to the top level of the component
    const [expandedEventId, setExpandedEventId] = useState(null);

    const getWeekDays = (start) => {
        const days = [];
        const tempDate = new Date(start);
        const dayOfWeek = tempDate.getDay();
        const diff = tempDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const monday = new Date(tempDate.setDate(diff));

        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            days.push(d);
        }
        return days;
    };

    const weekDays = getWeekDays(baseDate);

    const isSameDay = (d1, d2) =>
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();

    const dayEvents = events.filter(event =>
        isSameDay(new Date(event.startDateTime), selectedDate)
    );

    const handleQuickAdd = () => {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        const timeStr = "19:00";

        onQuickAdd(`${dateStr}T${timeStr}`);
    };

    return (
        <div className={styles.calendarWrapper}>
            <div className={styles.navHeader}>
                <button onClick={() => {
                    const d = new Date(baseDate);
                    d.setDate(d.getDate() - 7);
                    setBaseDate(d);
                }} className={styles.navBtn}>⬅️</button>

                <span className={styles.monthName}>
                    {baseDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>

                <button onClick={() => {
                    const d = new Date(baseDate);
                    d.setDate(d.getDate() + 7);
                    setBaseDate(d);
                }} className={styles.navBtn}>➡️</button>
            </div>

            <div className={styles.datePicker}>
                {weekDays.map((date, i) => (
                    <div
                        key={i}
                        className={`${styles.dateBtn} ${isSameDay(date, selectedDate) ? styles.activeDate : ""}`}
                        onClick={() => setSelectedDate(date)}
                    >
                        <span className={styles.dayLabel}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        <span className={styles.dateLabel}>{date.getDate()}</span>
                        {events.some(e => isSameDay(new Date(e.startDateTime), date)) && (
                            <span className={styles.eventDot}></span>
                        )}
                    </div>
                ))}
            </div>

            <div className={styles.agendaList}>
                <div className={styles.agendaHeader}>
                    <h3>{isSameDay(selectedDate, new Date()) ? "Today" : selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</h3>
                    <button onClick={handleQuickAdd} className={styles.quickAddBtn}>+ Add Plan</button>
                </div>

                {dayEvents.length > 0 ? (
                    dayEvents.map(event => {
                        const isJoined = event.participants?.some(p => p.id === currentUser?.id);
                        const pCount = event.participants?.length || 0;
                        const isExpanded = expandedEventId === event.id;

                        return (
                            <div key={event.id} className={styles.eventCard}>
                                <div className={styles.eventInfo}>
                                    <div onClick={() => onEdit(event)} className={styles.clickableInfo}>
                                        <span className={styles.eventEmoji}>📍</span>
                                        <div>
                                            <div className={styles.eventTitle}>{event.title}</div>
                                            <div className={styles.eventMeta}>
                                                <span className={styles.eventTime}>
                                                    {new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <span
                                        className={styles.participantCount}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setExpandedEventId(isExpanded ? null : event.id);
                                        }}
                                    >
                                        • 👥 {pCount} {isExpanded ? '▲' : '▼'}
                                    </span>
                                </div>

                                {isExpanded && pCount > 0 && (
                                    <div className={styles.participantsList}>
                                        <h6>Participanți:</h6>
                                        <ul>
                                            {event.participants.map(p => (
                                                <li key={p.id}>✨ {p.name} {p.id === currentUser?.id ? "(Tu)" : ""}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className={styles.actionsGroup}>
                                    {isJoined ? (
                                        <button className={styles.leaveBtn} onClick={() => onLeave(event.id)}>Leave</button>
                                    ) : (
                                        <button className={styles.joinBtn} onClick={() => onJoin(event.id)}>Join</button>
                                    )}
                                    <button className={styles.deleteBtn} onClick={() => onDelete(event.id)}>✕</button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className={styles.emptyState}>No plans. Tap + to create one!</div>
                )}
            </div>
        </div>
    );
};

export default WeeklyCalendar;