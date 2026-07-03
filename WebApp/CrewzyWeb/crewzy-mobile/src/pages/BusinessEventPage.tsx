import { useState } from 'react';
import { Plus, Calendar as CalendarIcon, Clock, Users, Edit, Trash2, TrendingUp, Building2 } from 'lucide-react';

// Tipul de date pentru un eveniment de business
interface BusinessEvent {
    id: string;
    title: string;
    date: string;
    time: string;
    image: string;
    category: string;
    attendees: number;
    status: 'upcoming' | 'past';
    revenue?: string;
}

export function BusinessEventsPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Date de test pentru localul logat (ex: The Velvet Lounge)
    const [events, setEvents] = useState<BusinessEvent[]>([
        {
            id: '1',
            title: 'Karaoke Night Extravaganza',
            date: 'April 30, 2026',
            time: '8:00 PM - 1:00 AM',
            image: 'https://images.unsplash.com/photo-1760598742492-7ad941e658e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
            category: 'Karaoke',
            attendees: 145,
            status: 'upcoming'
        },
        {
            id: '2',
            title: 'Neon Friday Party',
            date: 'May 05, 2026',
            time: '10:00 PM - 4:00 AM',
            image: 'https://images.unsplash.com/photo-1625612446042-afd3fe024131?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
            category: 'Party',
            attendees: 320,
            status: 'upcoming'
        },
        {
            id: '3',
            title: 'Acoustic Sunday',
            date: 'April 12, 2026',
            time: '7:00 PM - 10:00 PM',
            image: 'https://images.unsplash.com/photo-1643940881576-459719634a4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
            category: 'Live Music',
            attendees: 85,
            status: 'past',
            revenue: '$1,250'
        }
    ]);

    const handleDelete = (id: string) => {
        setEvents(events.filter(event => event.id !== id));
    };

    return (
        <div className="flex-1 overflow-auto bg-gray-50/50 pb-24 md:pb-8">
            {/* Header-ul specific pentru Business */}
            <div className="bg-white/80 backdrop-blur-md px-4 py-6 md:px-8 md:py-8 sticky top-0 z-10 border-b border-gray-100 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Building2 className="w-5 h-5 text-purple-600" />
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Venue Dashboard</h1>
                        </div>
                        <p className="text-sm md:text-base text-gray-600">Manage your events and track RSVPs</p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl md:rounded-full font-semibold hover:bg-gray-800 transition-all shadow-lg w-full md:w-auto"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Event
                    </button>
                </div>

                {/* Statistici rapide */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-6">
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                        <div className="text-purple-600 text-xs md:text-sm font-semibold mb-1">Total Upcoming</div>
                        <div className="text-2xl md:text-3xl font-bold text-gray-900">2</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <div className="text-blue-600 text-xs md:text-sm font-semibold mb-1">Total RSVPs</div>
                        <div className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                            465 <TrendingUp className="w-4 h-4 text-green-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de Evenimente */}
            <div className="p-4 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 md:mb-6">Your Events</h2>

                {/* Folosim grid-cols-1 pe mobil (să fie carduri mari și ușor de editat) și pe desktop mai multe coloane */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    {events.map((event) => (
                        <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col">
                            <div className="relative h-40 overflow-hidden shrink-0">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className={`w-full h-full object-cover ${event.status === 'past' ? 'grayscale' : ''}`}
                                />
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                                    <span className="text-xs font-semibold text-gray-900">{event.category}</span>
                                </div>
                                {event.status === 'past' && (
                                    <div className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <span className="text-xs font-semibold text-white">Past Event</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 flex flex-col flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">{event.title}</h3>

                                <div className="space-y-2 mb-4 flex-1">
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <CalendarIcon className="w-4 h-4 mr-2 shrink-0 text-purple-500" />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <Clock className="w-4 h-4 mr-2 shrink-0 text-purple-500" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <Users className="w-4 h-4 mr-2 shrink-0 text-blue-500" />
                                        <span className="font-semibold text-gray-900">{event.attendees}</span>
                                        <span className="ml-1">people going</span>
                                    </div>
                                </div>

                                {/* Butoane de acțiune pentru proprietar */}
                                <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-auto">
                                    <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors text-sm">
                                        <Edit className="w-4 h-4" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event.id)}
                                        className="flex items-center justify-center p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Placeholder simplu pentru Modal-ul de creare - se afișează când dai click pe buton */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Publish New Event</h2>
                        <p className="text-gray-500 text-sm mb-6">This event will appear on the Discover page for all users.</p>

                        <div className="space-y-4">
                            <input type="text" placeholder="Event Title (e.g. Neon Party)" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
                            <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-500" />
                            <input type="time" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-500" />
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors">
                                Cancel
                            </button>
                            <button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors shadow-lg">
                                Publish Event
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}