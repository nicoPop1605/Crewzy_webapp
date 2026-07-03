import { MapPin, Calendar, Clock, Users } from 'lucide-react';

export interface Event {
    id: string;
    title: string;
    venue: string;
    date: string;
    time: string;
    image: string;
    category: string;
    attendees: number;
    description: string;
    price: string;
    address: string;
}

interface EventCardProps {
    event: Event;
    onClick: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl md:rounded-3xl shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-gray-100 flex flex-col h-full group"
        >
            {/* Imaginea mai mică pe mobil */}
            <div className="relative h-24 md:h-48 overflow-hidden shrink-0">
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-white/90 backdrop-blur-sm px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                    <span className="text-[9px] md:text-sm font-semibold text-gray-900">{event.category}</span>
                </div>
            </div>

            {/* Conținutul text - super compact pe mobil */}
            <div className="p-2.5 md:p-5 flex flex-col flex-1">
                {/* Titlu: limitat la 2 rânduri ca să nu lungească excesiv cardul */}
                <h3 className="text-xs md:text-xl font-bold text-gray-900 mb-1.5 md:mb-3 line-clamp-2 leading-tight">
                    {event.title}
                </h3>

                <div className="space-y-1 md:space-y-2 mb-2 flex-1">
                    <div className="flex items-center text-gray-600">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 shrink-0 text-gray-400" />
                        <span className="text-[10px] md:text-sm truncate">{event.venue}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 shrink-0 text-gray-400" />
                        <span className="text-[10px] md:text-sm truncate">{event.date}</span>
                    </div>
                    {/* Pe mobil ascundem complet ora ca să salvăm spațiu (opțional, dar recomandat) */}
                    <div className="hidden md:flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2 shrink-0 text-gray-400" />
                        <span className="text-sm truncate">{event.time}</span>
                    </div>
                </div>

                {/* Footer-ul cu preț și participanți */}
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                    <div className="flex items-center text-gray-500">
                        <Users className="w-3 h-3 md:w-4 md:h-4 mr-1 shrink-0" />
                        <span className="text-[9px] md:text-sm font-medium">{event.attendees}</span>
                    </div>
                    <div className="text-[11px] md:text-lg font-bold text-gray-900">
                        {event.price}
                    </div>
                </div>
            </div>
        </div>
    );
}