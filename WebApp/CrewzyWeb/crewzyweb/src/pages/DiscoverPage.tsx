import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { EventCard, Event } from '../components/EventCard';
import { EventDetailModal } from '../components/EventDetailModal';
import { CreateEventModal } from '../components/CreateEventModal';
import { Group } from '../components/GroupCard';

// ─── API Helpers ──────────────────────────────────────────────────────────
const API_URL = 'http://127.0.0.1:4000';

const fetchGraphQL = async (query: string, variables = {}) => {
    const response = await fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
    });
    const result = await response.json();
    if (result.errors) {
        console.error("GraphQL Errors:", result.errors);
        throw new Error(result.errors[0].message);
    }
    return result.data;
};

// ─── Mock Data for Groups (păstrat doar pentru Creare Eveniment) ────────
const mockGroups: Group[] = [
    {
        id: '1',
        name: 'Weekend Warriors',
        description: 'Friends who love weekend adventures',
        members: 8,
        isAdmin: true,
        avatars: [],
    },
];

const categories = ['All', 'Karaoke', 'Beer Pong', 'Party', 'Live Music', 'Trivia', 'Sports'];

// Funcție inteligentă care ghicește categoria pe baza titlului și descrierii
const guessCategory = (title: string, description: string) => {
    const text = `${title} ${description}`.toLowerCase();

    if (text.includes('karaoke') || text.includes('sing')) return 'Karaoke';
    if (text.includes('beer') || text.includes('pong')) return 'Beer Pong';
    if (text.includes('live') || text.includes('music') || text.includes('band')) return 'Live Music';
    if (text.includes('trivia') || text.includes('quiz')) return 'Trivia';
    if (text.includes('sport') || text.includes('match') || text.includes('game')) return 'Sports';

    // Dacă nu găsește cuvinte cheie, îl pune la Party
    return 'Party';
};

// ─── Componenta Principală ────────────────────────────────────────────────

export function DiscoverPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [showCreateEventModal, setShowCreateEventModal] = useState(false);
    const [selectedEventLink, setSelectedEventLink] = useState('');

    // Preluăm evenimentele din baza de date
    useEffect(() => {
        const loadEventsFromDB = async () => {
            setIsLoading(true);
            try {
                const query = `
          query GetEvents($scope: String, $offset: Int, $limit: Int) {
            getEvents(scope: $scope, offset: $offset, limit: $limit) {
              id title date time location description rsvpCount
            }
          }
        `;
                const variables = { scope: 'DISCOVER', offset: 0, limit: 50 };
                const data = await fetchGraphQL(query, variables);

                if (data.getEvents) {
                    const dbEventsMapped: Event[] = data.getEvents.map((e: any) => ({
                        id: e.id,
                        title: e.title || 'Eveniment Fără Titlu',
                        venue: e.location || 'Locație Necunoscută',
                        date: e.date || 'Data TBA',
                        time: e.time || 'Timpul TBA',
                        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJ0eXxlbnwxfHx8fDE3NzM2MzM2NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',

                        // Folosim funcția noastră inteligentă pentru a seta categoria!
                        category: guessCategory(e.title || '', e.description || ''),

                        attendees: e.rsvpCount || 0,
                        description: e.description || 'Vino și distrează-te alături de noi!',
                        price: 'Free',
                        address: e.location || ''
                    }));

                    setEvents(dbEventsMapped);
                }
            } catch (error) {
                console.error("Eroare la preluarea evenimentelor:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadEventsFromDB();
    }, []);

    const handleCreateEventFromDiscover = (event: Event) => {
        setSelectedEventLink(`${event.venue} - ${event.title}`);
        setShowCreateEventModal(true);
        setSelectedEvent(null);
    };

    // Logica de filtrare a listei pe baza tab-ului selectat
    const filteredEvents = activeCategory === 'All'
        ? events
        : events.filter(event => event.category === activeCategory);

    return (
        <div className="flex-1 overflow-auto">
            {/* Header */}
            <div className="bg-white/60 backdrop-blur-sm px-8 py-6 sticky top-0 z-10">
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">Discover Events</h1>
                    <p className="text-gray-600">Explore exclusive events hosted by our partners</p>
                </div>

                {/* Search and Filter */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-5 py-3 shadow-sm">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search events, venues, or locations..."
                            className="flex-1 text-sm outline-none bg-transparent"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-5 py-3 bg-white rounded-full hover:bg-gray-50 transition-colors shadow-sm">
                        <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">Filters</span>
                    </button>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === category
                                    ? 'bg-gray-900 text-white shadow-lg'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Events Grid */}
            <div className="p-8">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        <span className="ml-3 text-gray-500 font-medium">Se caută evenimente...</span>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-lg font-medium">Nu am găsit evenimente în această categorie.</p>
                        <p className="text-sm mt-2">Adaugă cuvinte precum "{activeCategory}" în titlul evenimentului tău!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onClick={() => setSelectedEvent(event)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Event Detail Modal */}
            <EventDetailModal
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
                onCreateEvent={handleCreateEventFromDiscover}
            />

            {/* Create Event Modal */}
            <CreateEventModal
                isOpen={showCreateEventModal}
                onClose={() => {
                    setShowCreateEventModal(false);
                    setSelectedEventLink('');
                }}
                onCreate={() => {
                    setShowCreateEventModal(false);
                    setSelectedEventLink('');
                }}
                groups={mockGroups}
                discoverEventLink={selectedEventLink}
            />
        </div>
    );
}