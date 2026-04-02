import { useState } from 'react';
import { Plus, Users, UserCheck, Zap, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Bell, Search, CheckCircle, HelpCircle} from 'lucide-react';
//import { LayoutGrid, List as ListIcon } from 'lucide-react';

import { CreateEventModal } from '../components/CreateEventModal';
//import { MyEventCard } from '../components/MyEventCard';
import { EventsTable } from '../components/EventsTable';
import { EventDetailsModal } from '../components/EventDetailsModal';
import { Logo } from '../components/Logo';

import type { NewEvent } from '../components/CreateEventModal';
import type { MyEvent } from '../components/MyEventCard';
import type { Group } from '../components/GroupCard';
import type { Friend } from '../components/FriendCard';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

let globalMyEvents: MyEvent[] = [
    {
        id: '1',
        title: 'Team Lunch',
        date: '2026-03-20',
        time: '12:00 PM',
        location: 'The Velvet Lounge',
        locationType: 'text',
        visibility: 'all-friends',
        description: 'Monthly team lunch gathering',
        attendees: [
            { id: 'me', name: 'Me', avatar: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=100', status: 'accepted' },
            { id: '2', name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=100', status: 'accepted' },
        ],
        color: 'bg-purple-500',
    },
];

interface FreeDay {
    date: string;
    status: 'free' | 'maybe';
    message?: string;
}

interface FriendAvailability {
    id: string;
    name: string;
    avatar: string;
    date: string;
    status: 'free' | 'maybe';
    message?: string;
}

export function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 17));
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<MyEvent | null>(null);
    const [eventToEdit, setEventToEdit] = useState<MyEvent | null>(null);
    const [rsvpFilter, setRsvpFilter] = useState<'all' | 'accepted' | 'pending' | 'declined'>('all');
    //const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const [freeDays, setFreeDays] = useState<FreeDay[]>([
        { date: '2026-03-17', status: 'free', message: 'Free all day! Anyone down for coffee?' },
        { date: '2026-03-20', status: 'free', message: 'Free evening after 6pm' },
        { date: '2026-03-22', status: 'maybe' },
    ]);

    const [myEvents, setMyEvents] = useState<MyEvent[]>(globalMyEvents);

    const [friendsAvailability] = useState<FriendAvailability[]>([
        { id: '1', name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=100', date: '2026-03-17', status: 'free', message: 'Down for anything!' },
    ]);

    const groups: Group[] = [{ id: '1', name: 'Weekend Warriors', description: 'Friends who love weekend adventures', members: 8, isAdmin: true, avatars: [] }];
    const friends: Friend[] = [{ id: '1', name: 'Sarah Johnson', username: 'sarahj', avatar: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=100', status: 'online' }];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const formatDateKey = (day: number) => {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        return `${year}-${month}-${dayStr}`;
    };

    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
    };

    const getDayStatus = (day: number) => {
        const dateKey = formatDateKey(day);
        return freeDays.find((fd) => fd.date === dateKey);
    };

    
    const getEventsOnDay = (day: number) => {
        const dateKey = formatDateKey(day);
        return myEvents.filter(event => event.date === dateKey);
    };

    const handleDayClick = (day: number) => {
        const dateKey = formatDateKey(day);
        setSelectedDate(dateKey);
    };

    const toggleFreeStatus = (status: 'free' | 'maybe', message?: string) => {
        if (!selectedDate) return;
        const existingIndex = freeDays.findIndex((fd) => fd.date === selectedDate);
        if (existingIndex >= 0) {
            if (freeDays[existingIndex].status === status) {
                setFreeDays(freeDays.filter((fd) => fd.date !== selectedDate));
            } else {
                setFreeDays(freeDays.map((fd) => fd.date === selectedDate ? { ...fd, status, message } : fd));
            }
        } else {
            setFreeDays([...freeDays, { date: selectedDate, status, message }]);
        }
    };

    const markTodayFree = () => {
        const today = new Date();
        const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const existingIndex = freeDays.findIndex((fd) => fd.date === dateKey);
        if (existingIndex >= 0) {
            setFreeDays(freeDays.filter((fd) => fd.date !== dateKey));
        } else {
            setFreeDays([...freeDays, { date: dateKey, status: 'free', message: 'Free today! Who wants to hang out?' }]);
            setSelectedDate(dateKey);
        }
    };

    const handleCreateOrEditEvent = (newEventData: NewEvent) => {
        let updatedEvents;

        if (eventToEdit) {
            updatedEvents = myEvents.map(event => event.id === eventToEdit.id ? { ...event, ...newEventData } : event);
        } else {
            const event: MyEvent = {
                id: Date.now().toString(),
                title: newEventData.title,
                date: newEventData.date,
                time: newEventData.time,
                location: newEventData.location,
                locationType: newEventData.locationType,
                visibility: newEventData.visibility,
                description: newEventData.description,
                attendees: [{ id: 'me', name: 'Me', avatar: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=100', status: 'accepted' }],
                color: 'bg-blue-500',
            };
            updatedEvents = [...myEvents, event];
        }

        globalMyEvents = updatedEvents;
        setMyEvents(updatedEvents);

        setEventToEdit(null);
        setShowCreateModal(false);
    };

    const handleDeleteEvent = (id: string) => {
        const updatedEvents = myEvents.filter((event) => event.id !== id);
        globalMyEvents = updatedEvents; 
        setMyEvents(updatedEvents);
    };


    const handleOpenEdit = (event: MyEvent) => {
        setEventToEdit(event);
        setShowCreateModal(true);
    };

    const handleJoinEvent = (eventId: string) => {
        setMyEvents(myEvents.map((event) => event.id === eventId ? { ...event, attendees: [...event.attendees, { id: 'me', name: 'Me', avatar: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=100', status: 'accepted' }] } : event));
    };

    const handleLeaveEvent = (eventId: string) => {
        setMyEvents(myEvents.map((event) => event.id === eventId ? { ...event, attendees: event.attendees.filter((a) => a.id !== 'me') } : event));
    };

    const days = getDaysInMonth(currentDate);
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const selectedDayData = selectedDate
        ? {
            day: parseInt(selectedDate.split('-')[2]),
            status: freeDays.find((fd) => fd.date === selectedDate),
            friends: friendsAvailability.filter((fa) => fa.date === selectedDate),
        }
        : null;


    // --- START LOGICA GOLD CHALLENGE ---
    // 1. Aflăm evenimentele vizibile în tabel în funcție de filtru
    const visibleEvents = myEvents.filter((event) =>
        rsvpFilter === 'all' ? true : event.attendees.some((a) => a.status === rsvpFilter)
    );

    // 2. Calculăm statisticile RSVP pentru grafic (se actualizează live când ștergi/adaugi/filtrezi)
    const rsvpStats = visibleEvents.reduce((acc, event) => {
        event.attendees.forEach(a => {
            if (a.status === 'accepted') acc.accepted++;
            else if (a.status === 'pending') acc.pending++;
            else if (a.status === 'declined') acc.declined++;
        });
        return acc;
    }, { accepted: 0, pending: 0, declined: 0 });

    const chartData = [
        { name: 'Accepted', value: rsvpStats.accepted, color: '#22c55e' }, // Verde
        { name: 'Pending', value: rsvpStats.pending, color: '#eab308' },   // Galben
        { name: 'Declined', value: rsvpStats.declined, color: '#ef4444' }, // Roșu
    ].filter(item => item.value > 0); // Arătăm în grafic doar ce are valoare > 0
    // --- END LOGICA GOLD CHALLENGE ---

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            {/* Header */}
            <div className="bg-white/60 backdrop-blur-md border-b border-gray-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Logo size={40} />
                        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Bell className="w-6 h-6 text-gray-700" />
                        </button>
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            M
                        </div>
                        <button
                            onClick={() => {
                                setEventToEdit(null);
                                setShowCreateModal(true);
                            }}
                            className="p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Second Row - My Plans and Search */}
                <div className="flex items-center gap-4 mt-4">
                    <button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                        My Plans
                    </button>
                    <div className="flex-1 relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search events"
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-400 transition-colors"
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-8">
                {/* Quick Action Banner */}
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-6 mb-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-white">
                                <h3 className="text-xl font-bold mb-1">Free Today?</h3>
                                <p className="text-white/90 text-sm">Let your friends know you're available to hang out!</p>
                            </div>
                        </div>
                        <button
                            onClick={markTodayFree}
                            className="px-8 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg"
                        >
                            I'm Free Today!
                        </button>
                    </div>
                </div>

                {/* Calendar Section */}
                <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-xl mb-6">
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-4xl font-bold text-gray-900">
                                    {monthName} {year}
                                </h2>
                                <p className="text-gray-600 text-lg">Mark your free days and see who's available</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                                    className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={() => setCurrentDate(new Date())}
                                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors text-lg"
                                >
                                    Today
                                </button>
                                <button
                                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                                    className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-4">
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                                <div key={day} className="text-center font-bold text-gray-700 py-3 text-base">
                                    {day}
                                </div>
                            ))}

                            {days.map((day, index) => {
                                if (!day) return <div key={`empty-${index}`} className="aspect-square" />;

                                const status = getDayStatus(day);
                                const eventsToday = getEventsOnDay(day);
                                const today = isToday(day);

                                return (
                                    <button
                                        key={day}
                                        onClick={() => handleDayClick(day)}
                                        className={`
                      aspect-square rounded-2xl p-4 relative transition-all flex flex-col items-start
                      ${today ? 'ring-4 ring-gray-900' : ''}
                      ${status?.status === 'free' ? 'bg-green-100 hover:bg-green-200' : ''}
                      ${status?.status === 'maybe' ? 'bg-yellow-100 hover:bg-yellow-200' : ''}
                      ${!status ? 'hover:bg-gray-100' : ''}
                    `}
                                    >
                                        <div className="text-xl font-semibold text-gray-900 mb-1">{day}</div>

                                        <div className="flex flex-col gap-1 w-full mt-auto">
                                            {eventsToday.slice(0, 2).map(ev => (
                                                <div key={ev.id} className={`w-full text-left truncate text-xs font-medium px-2 py-1 rounded-md text-white ${ev.color}`}>
                                                    {ev.title}
                                                </div>
                                            ))}
                                            {eventsToday.length > 2 && (
                                                <div className="text-xs text-gray-500 font-medium">+{eventsToday.length - 2} more</div>
                                            )}
                                        </div>

                                        {status && (
                                            <div className="absolute top-2 right-2">
                                                <UserCheck className={`w-4 h-4 ${status.status === 'free' ? 'text-green-600' : 'text-yellow-600'}`} />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-center gap-8 text-base">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-green-100 rounded border border-green-200" />
                            <span className="text-gray-700 font-medium">I'm Free</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-yellow-100 rounded border border-yellow-200" />
                            <span className="text-gray-700 font-medium">Maybe Free</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded border-4 border-gray-900" />
                            <span className="text-gray-700 font-medium">Today</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-700 font-medium">Friends Available</span>
                        </div>
                    </div>
                </div>

                {/* My Events Section - GOLD CHALLENGE */}
                {myEvents.length > 0 && (
                    <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-xl p-8 mb-8 transition-all duration-500 hover:shadow-2xl">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">My Upcoming Events</h2>

                            {/* RSVP Filter Buttons */}
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => setRsvpFilter('all')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${rsvpFilter === 'all' ? 'bg-gray-900 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    All Events
                                </button>
                                <button
                                    onClick={() => setRsvpFilter('accepted')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${rsvpFilter === 'accepted' ? 'bg-green-500 text-white shadow-md scale-105' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                                >
                                    <CheckCircle className="w-4 h-4" /> Accepted
                                </button>
                                <button
                                    onClick={() => setRsvpFilter('pending')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${rsvpFilter === 'pending' ? 'bg-yellow-500 text-white shadow-md scale-105' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                                >
                                    <HelpCircle className="w-4 h-4" /> Pending
                                </button>
                            </div>
                        </div>

                        {/* SIDE-BY-SIDE LAYOUT (Responsive) */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* LEFT SIDE: TABEL (Ocupă 2/3 din ecran pe desktop) */}
                            <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-gray-100 bg-white/50 shadow-inner">
                                <EventsTable
                                    events={visibleEvents}
                                    onEdit={handleOpenEdit}
                                    onDelete={handleDeleteEvent}
                                    onViewDetails={setSelectedEvent}
                                />
                                {visibleEvents.length === 0 && (
                                    <div className="text-center py-12 text-gray-500 animate-pulse">
                                        No events found for this filter.
                                    </div>
                                )}
                            </div>

                            {/* RIGHT SIDE: GRAFIC REACTIV (Ocupă 1/3 din ecran pe desktop) */}
                            <div className="lg:col-span-1 flex flex-col items-center justify-center bg-white/80 p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">RSVP Overview</h3>
                                <p className="text-sm text-gray-500 mb-6 text-center">Real-time status based on tabular data</p>

                                {chartData.length > 0 ? (
                                    <div className="w-full h-[250px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={chartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    animationBegin={0}
                                                    animationDuration={800}
                                                >
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                />
                                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-[250px] flex items-center justify-center text-gray-400 font-medium">
                                        No data to display
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                )}
            </div>

            {/* Day Details Modal */}
            {selectedDayData && !showCreateModal && ( // <-- Ascundem fereastra zilei dacă deschidem formularul
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {monthName} {selectedDayData.day}
                                </h2>
                                <button
                                    onClick={() => setSelectedDate(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <span className="text-gray-500 hover:text-gray-700 text-2xl">✕</span>
                                </button>
                            </div>

                            {/* Mark Availability */}
                            <div className="space-y-3 mb-6">
                                <p className="text-sm font-semibold text-gray-700 mb-3">Mark Your Availability:</p>
                                <button
                                    onClick={() => toggleFreeStatus('free', 'Who wants to hang out?')}
                                    className={`
                    w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all text-lg
                    ${selectedDayData.status?.status === 'free'
                                            ? 'bg-green-500 text-white shadow-lg'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                        }
                  `}
                                >
                                    <UserCheck className="w-6 h-6" />
                                    I'm Free
                                </button>
                                <button
                                    onClick={() => toggleFreeStatus('maybe')}
                                    className={`
                    w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all text-lg
                    ${selectedDayData.status?.status === 'maybe'
                                            ? 'bg-yellow-500 text-white shadow-lg'
                                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                        }
                  `}
                                >
                                    Maybe Free
                                </button>
                                {selectedDayData.status && (
                                    <button
                                        onClick={() => {
                                            setFreeDays(freeDays.filter((fd) => fd.date !== selectedDate));
                                        }}
                                        className="w-full px-4 py-3 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
                                    >
                                        Clear Status
                                    </button>
                                )}
                            </div>

                            {selectedDayData.status?.message && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-700 font-medium">{selectedDayData.status.message}</p>
                                </div>
                            )}

                            {/* Friends Available */}
                            {selectedDayData.friends.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                                        <Users className="w-6 h-6" />
                                        Friends Available ({selectedDayData.friends.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedDayData.friends.map((friend) => (
                                            <div
                                                key={friend.id}
                                                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={friend.avatar}
                                                        alt={friend.name}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-gray-900">{friend.name}</div>
                                                        {friend.message && (
                                                            <div className="text-sm text-gray-600 mt-1">{friend.message}</div>
                                                        )}
                                                    </div>
                                                    <div
                                                        className={`
                              px-3 py-1 rounded-full text-xs font-semibold
                              ${friend.status === 'free' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                            `}
                                                    >
                                                        {friend.status === 'free' ? 'Free' : 'Maybe'}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedDayData.friends.length === 0 && !selectedDayData.status && (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <CalendarIcon className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 mb-1 font-medium">
                                        No friends available yet
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        Mark yourself as free to let them know!
                                    </p>
                                </div>
                            )}

                            {/* NOU: Butonul de Create Event (Mereu vizibil la finalul listei) */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        setEventToEdit(null);
                                        setShowCreateModal(true); // Deschide formularul de creare
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors text-lg shadow-md"
                                >
                                    <Plus className="w-6 h-6" />
                                    Create Event on this Day
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <CreateEventModal
                isOpen={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    setEventToEdit(null);
                    setSelectedDate(null); // Închidem și ziua curentă ca să ne întoarcem direct la calendar
                }}
                onCreate={handleCreateOrEditEvent}
                groups={groups}
                eventToEdit={eventToEdit}
                initialDate={selectedDate} // NOU: Trimitem data selectată!
            />

            <EventDetailsModal
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
                currentUserId="me"
                isCreator={selectedEvent?.attendees[0]?.id === 'me'}
                onJoin={handleJoinEvent}
                onLeave={handleLeaveEvent}
                friends={friends}
            />
        </div>
    );
}