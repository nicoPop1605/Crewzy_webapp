import { Calendar, Clock, MapPin, MoreVertical, Trash2, Edit2, Link as LinkIcon, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export interface MyEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  locationType: 'link' | 'text' | 'suggestions';
  visibility: string;
  description: string;
  attendees: Array<{ id: string; name: string; avatar: string; status: 'accepted' | 'declined' | 'pending' }>;
  color: string;
}

interface MyEventCardProps {
  event: MyEvent;
    onDelete: (id: string) => void;
    onEdit: (event: MyEvent) => void;
    onViewDetails: (event: MyEvent) => void;
}

export function MyEventCard({ event, onDelete, onEdit, onViewDetails }: MyEventCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={() => onViewDetails(event)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-1 h-12 ${event.color} rounded-full`} />
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{event.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{event.date}</span>
              <Clock className="w-3.5 h-3.5 ml-2" />
              <span>{event.time}</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl z-20 py-2">
              <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(event);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Event
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(event.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Event
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        {event.locationType === 'link' && <LinkIcon className="w-4 h-4" />}
        {event.locationType === 'text' && <MapPin className="w-4 h-4" />}
        {event.locationType === 'suggestions' && <MessageSquare className="w-4 h-4" />}
        <span className="line-clamp-1">
          {event.locationType === 'suggestions'
            ? 'Location suggestions open'
            : event.location || 'No location set'}
        </span>
      </div>

      {/* Attendees */}
      {event.attendees.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {event.attendees.slice(0, 4).map((attendee, index) => (
              <img
                key={index}
                src={attendee.avatar}
                alt={attendee.name}
                className="w-7 h-7 rounded-full border-2 border-white object-cover"
              />
            ))}
            {event.attendees.length > 4 && (
              <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                +{event.attendees.length - 4}
              </div>
            )}
          </div>
          <span className="text-sm text-gray-600">{event.attendees.length} attending</span>
        </div>
      )}
    </div>
  );
}