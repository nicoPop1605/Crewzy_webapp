import { X, Calendar, MapPin, Users, Clock, DollarSign, Share2, Bookmark, Plus } from 'lucide-react';
import type { Event } from './EventCard';

interface EventDetailModalProps {
  event: Event | null;
  onClose: () => void;
  onCreateEvent?: (event: Event) => void;
}

export function EventDetailModal({ event, onClose, onCreateEvent }: EventDetailModalProps) {
  if (!event) return null;

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-80">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <X className="w-5 h-5 text-gray-900" />
          </button>
          <div className={`absolute top-6 left-6 ${getCategoryColor(event.category)} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
            {event.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">
            {event.title}
          </h2>

          {/* Event Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="p-2 bg-white rounded-lg">
                <Calendar className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Date</div>
                <div className="text-sm font-semibold text-gray-900">{event.date}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="p-2 bg-white rounded-lg">
                <Clock className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Time</div>
                <div className="text-sm font-semibold text-gray-900">{event.time}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="p-2 bg-white rounded-lg">
                <MapPin className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Venue</div>
                <div className="text-sm font-semibold text-gray-900">{event.venue}</div>
                <div className="text-xs text-gray-500 mt-1">{event.address}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="p-2 bg-white rounded-lg">
                <DollarSign className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Price</div>
                <div className="text-sm font-semibold text-gray-900">{event.price}</div>
              </div>
            </div>
          </div>

          {/* Attendees */}
          <div className="flex items-center gap-3 mb-8 p-4 bg-purple-50 rounded-xl">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-semibold text-purple-900">
              {event.attendees} people are going
            </span>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About this event</h3>
            <p className="text-gray-600 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
              Register Now
            </button>
            {onCreateEvent && (
              <button 
                onClick={() => onCreateEvent(event)}
                className="px-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Create My Event</span>
              </button>
            )}
            <button className="p-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}