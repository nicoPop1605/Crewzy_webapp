import { X, Calendar, Clock, MapPin, Users, Check, UserPlus, UserMinus, Link as LinkIcon, MessageSquare, ExternalLink, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import type { MyEvent } from './MyEventCard';
import { useState } from 'react';
import type { Friend } from './FriendCard';

interface EventDetailsModalProps {
  event: MyEvent | null;
  onClose: () => void;
  currentUserId: string;
  isCreator: boolean;
  onJoin: (eventId: string) => void;
  onLeave: (eventId: string) => void;
  friends: Friend[];
}

export function EventDetailsModal({
  event,
  onClose,
  currentUserId,
  isCreator,
  onJoin,
  onLeave,
  
}: EventDetailsModalProps) {
  const [locationSuggestion, setLocationSuggestion] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  if (!event) return null;

  const isAttending = event.attendees.some((a) => a.id === currentUserId);

  // Group attendees by status
  const acceptedAttendees = event.attendees.filter((a) => a.status === 'accepted');
  const declinedAttendees = event.attendees.filter((a) => a.status === 'declined');
  const pendingAttendees = event.attendees.filter((a) => a.status === 'pending');

  const handleSuggestLocation = () => {
    if (locationSuggestion.trim()) {
      setSuggestions([...suggestions, locationSuggestion]);
      setLocationSuggestion('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-3xl font-semibold text-gray-900 mb-2">{event.title}</h2>
              <span className="text-sm px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                {event.visibility === 'all-friends' ? 'All Friends' : event.visibility}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Event Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
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
          </div>

          {/* Location */}
          <div className="mb-6">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="p-2 bg-white rounded-lg">
                {event.locationType === 'link' && <LinkIcon className="w-5 h-5 text-gray-700" />}
                {event.locationType === 'text' && <MapPin className="w-5 h-5 text-gray-700" />}
                {event.locationType === 'suggestions' && <MessageSquare className="w-5 h-5 text-gray-700" />}
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">Location</div>
                {event.locationType === 'suggestions' ? (
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-gray-900">Location suggestions open</div>
                    
                    {/* Suggestions List */}
                    {suggestions.length > 0 && (
                      <div className="space-y-2">
                        {suggestions.map((suggestion, index) => (
                          <div key={index} className="text-sm bg-white p-2 rounded-lg text-gray-700">
                            📍 {suggestion}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Suggestion */}
                    {!isCreator && isAttending && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={locationSuggestion}
                          onChange={(e) => setLocationSuggestion(e.target.value)}
                          placeholder="Suggest a location..."
                          className="flex-1 text-sm bg-white px-3 py-2 rounded-lg border border-gray-200 outline-none"
                          onKeyDown={(e) => e.key === 'Enter' && handleSuggestLocation()}
                        />
                        <button
                          onClick={handleSuggestLocation}
                          className="px-3 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                        >
                          Suggest
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold text-gray-900 flex-1">
                      {event.location}
                    </div>
                    {event.locationType === 'link' && (
                      <a
                        href={event.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4 text-gray-600" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">About this event</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
            </div>
          )}

          {/* Attendees */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Attendees
            </h3>

            {/* Accepted */}
            {acceptedAttendees.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <h4 className="text-sm font-semibold text-gray-900">
                    Accepted ({acceptedAttendees.length})
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {acceptedAttendees.map((attendee) => (
                    <div key={attendee.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                      <img
                        src={attendee.avatar}
                        alt={attendee.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">{attendee.name}</div>
                      </div>
                      {attendee.id === currentUserId && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending */}
            {pendingAttendees.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <HelpCircle className="w-4 h-4 text-yellow-600" />
                  <h4 className="text-sm font-semibold text-gray-900">
                    Pending ({pendingAttendees.length})
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {pendingAttendees.map((attendee) => (
                    <div key={attendee.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                      <img
                        src={attendee.avatar}
                        alt={attendee.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">{attendee.name}</div>
                      </div>
                      {attendee.id === currentUserId && (
                        <Check className="w-4 h-4 text-yellow-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Declined */}
            {declinedAttendees.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <h4 className="text-sm font-semibold text-gray-900">
                    Declined ({declinedAttendees.length})
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {declinedAttendees.map((attendee) => (
                    <div key={attendee.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                      <img
                        src={attendee.avatar}
                        alt={attendee.name}
                        className="w-10 h-10 rounded-full object-cover opacity-60"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-500 truncate">{attendee.name}</div>
                      </div>
                      {attendee.id === currentUserId && (
                        <Check className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {!isCreator && (
            <div className="flex gap-3">
              {isAttending ? (
                <button
                  onClick={() => onLeave(event.id)}
                  className="flex-1 py-3 rounded-xl font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <UserMinus className="w-5 h-5" />
                  Leave Event
                </button>
              ) : (
                <button
                  onClick={() => onJoin(event.id)}
                  className="flex-1 py-3 rounded-xl font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Join Event
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}