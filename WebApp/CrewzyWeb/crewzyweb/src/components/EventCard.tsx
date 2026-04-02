import { Calendar, MapPin, Users, Clock } from 'lucide-react';

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
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'karaoke':
        return 'bg-purple-500';
      case 'beer pong':
        return 'bg-amber-500';
      case 'party':
        return 'bg-pink-500';
      case 'live music':
        return 'bg-blue-500';
      case 'trivia':
        return 'bg-green-500';
      case 'sports':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className={`absolute top-4 left-4 ${getCategoryColor(event.category)} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
          {event.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
          {event.title}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{event.date}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{event.time}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{event.attendees} going</span>
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {event.price}
          </div>
        </div>
      </div>
    </div>
  );
}
