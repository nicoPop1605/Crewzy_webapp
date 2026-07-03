import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { EventCard, Event } from '../components/EventCard';
import { EventDetailModal } from '../components/EventDetailModal';
import { CreateEventModal } from '../components/CreateEventModal';
import { Group } from '../components/GroupCard';

export function DiscoverPage() {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [showCreateEventModal, setShowCreateEventModal] = useState(false);
    const [selectedEventLink, setSelectedEventLink] = useState('');

    // Mock groups data
    const groups: Group[] = [
        {
            id: '1',
            name: 'Weekend Warriors',
            description: 'Friends who love weekend adventures',
            members: 8,
            isAdmin: true,
            avatars: [],
        },
    ];

    const handleCreateEventFromDiscover = (event: Event) => {
        setSelectedEventLink(`${event.venue} - ${event.title}`);
        setShowCreateEventModal(true);
        setSelectedEvent(null);
    };

    const events: Event[] = [
        {
            id: '1',
            title: 'Karaoke Night Extravaganza',
            venue: 'The Velvet Lounge',
            date: 'March 18, 2026',
            time: '8:00 PM - 1:00 AM',
            image: 'https://images.unsplash.com/photo-1760598742492-7ad941e658e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXJhb2tlJTIwbmlnaHQlMjBiYXJ8ZW58MXx8fHwxNzczNjc5MjY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
            category: 'Karaoke',
            attendees: 45,
            description: 'Join us for an unforgettable karaoke night! Sing your heart out to your favorite songs, enjoy delicious cocktails, and make new friends. Private rooms available for groups. Professional sound system and over 10,000 songs to choose from!',
            price: '$10',
            address: '123 Music Ave, Downtown'
        },
        {
            id: '2',
            title: 'Ultimate Beer Pong',
            venue: 'Brew Brothers Bar',
            date: 'March 20, 2026',
            time: '7:00 PM - 11:00 PM',
            image: 'https://images.unsplash.com/photo-1578976014665-66120ffbb89d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVyJTIwcG9uZyUyMHBhcnR5fGVufDF8fHx8MTc3MzY4MTE2MXww&ixlib=rb-4.1.0&q=80&w=1080',
            category: 'Beer Pong',
            attendees: 62,
            description: 'Compete in our monthly beer pong championship! Teams of 2 battle it out for the grand prize. Free entry with drink purchase. Amazing prizes for winners including a $500 bar tab!',
            price: 'Free',
            address: '456 Party Blvd, Midtown'
        },
        {
            id: '3',
            title: 'Saturday Fever Party',
            venue: 'Neon Nights Club',
            date: 'March 21, 2026',
            time: '10:00 PM - 3:00 AM',
            image: 'https://images.unsplash.com/photo-1625612446042-afd3fe024131?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBwYXJ0eSUyMGxpZ2h0c3xlbnwxfHx8fDE3NzM2MzM2NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
            category: 'Party',
            attendees: 128,
            description: 'The biggest party of the month! DJ spinning the hottest tracks, premium bottle service, and VIP sections available. Dress to impress and dance the night away with state-of-the-art light shows and sound systems.',
            price: '$15',
            address: '789 Club Street, Entertainment District'
        },
        {
            id: '4',
            title: 'Live Jazz & Blues',
            venue: 'The Blue Note',
            date: 'March 22, 2026',
            time: '9:00 PM - 12:00 AM',
            image: 'https://images.unsplash.com/photo-1643940881576-459719634a4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwbXVzaWMlMjBiYW5kJTIwY29uY2VydHxlbnwxfHx8fDE3NzM2ODExNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
            category: 'Live Music',
            attendees: 85,
            description: 'Experience smooth jazz and soulful blues performed by local legends. Intimate venue with excellent acoustics. Full dinner menu and craft cocktails available. Reserve your table early!',
            price: '$20',
            address: '321 Melody Lane, Arts Quarter'
        },
        {
            id: '5',
            title: 'Trivia Tuesday',
            venue: 'The Brainy Pub',
            date: 'March 19, 2026',
            time: '7:30 PM - 10:00 PM',
            image: 'https://images.unsplash.com/photo-1615775742347-946c60d3e3a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdWIlMjBxdWl6JTIwbmlnaHR8ZW58MXx8fHwxNzczNjgxMTY1fDA&ixlib=rb-4.1.0&q=80&w=1080',
            category: 'Trivia',
            attendees: 54,
            description: 'Test your knowledge across multiple categories! Form a team or join one at the venue. Prizes for top 3 teams including gift cards and bragging rights. Happy hour specials during the event!',
            price: '$5',
            address: '654 Smart Street, University Area'
        },
        {
            id: '6',
            title: 'March Madness',
            venue: 'Champion Sports Bar',
            date: 'March 23, 2026',
            time: '5:00 PM - 11:00 PM',
            image: 'https://images.unsplash.com/photo-1671368913134-c211bc02487f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBiYXIlMjB3YXRjaGluZyUyMGdhbWV8ZW58MXx8fHwxNzczNjgxMTYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
            category: 'Sports',
            attendees: 95,
            description: 'Watch all the games on our 50+ HD screens! Food and drink specials all night. Free wings during halftime. Come support your team with fellow fans in the ultimate sports watching experience!',
            price: 'Free',
            address: '987 Stadium Drive, Sports Complex'
        },
    ];

    const categories = ['All', 'Karaoke', 'Beer Pong', 'Party', 'Live Music', 'Trivia', 'Sports'];

    const filteredEvents = activeCategory === 'All'
        ? events
        : events.filter(event => event.category === activeCategory);

    return (
        <div className="flex-1 overflow-auto bg-gray-50/50">
            {/* Header - am micșorat padding-urile pe mobil (p-4 vs p-8) */}
            <div className="bg-white/80 backdrop-blur-md px-4 py-4 md:px-8 md:py-6 sticky top-0 z-10 border-b border-gray-100">

                <div className="mb-4 md:mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">Discover Events</h1>
                    <p className="text-sm md:text-base text-gray-600 line-clamp-1 md:line-clamp-none">Find the hottest events at bars and restaurants near you</p>
                </div>

                {/* Search and Filter */}
                <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
                    <div className="flex-1 flex items-center gap-2 bg-gray-100/80 rounded-xl px-3 py-2 md:px-5 md:py-3 shadow-inner">
                        <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="flex-1 text-sm outline-none bg-transparent"
                        />
                    </div>
                    <button className="flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-5 md:py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors shadow-sm">
                        <SlidersHorizontal className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-sm font-medium hidden md:inline">Filters</span>
                    </button>
                </div>

                {/* Category Pills - mai mici pe mobil */}
                <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-all ${activeCategory === category
                                    ? 'bg-purple-600 text-white shadow-md'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Events Grid */}
            <div className="p-3 md:p-8 pb-24 md:pb-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {filteredEvents.map((event) => (
                        <div key={event.id} className="h-full">
                            <EventCard
                                event={event}
                                onClick={() => setSelectedEvent(event)}
                            />
                        </div>
                    ))}
                </div>
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
                groups={groups}
                discoverEventLink={selectedEventLink}
            />
        </div>
    );
}