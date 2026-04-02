import { Camera, Mail, Phone, MapPin, Calendar, LogOut, Edit, Settings } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@example.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [location, setLocation] = useState('San Francisco, CA');
  const [bio, setBio] = useState('Event enthusiast | Always down for karaoke | Weekend explorer');

  const stats = [
    { label: 'Events Attended', value: '47' },
    { label: 'Friends', value: '128' },
    { label: 'Groups', value: '8' },
  ];

  const recentEvents = [
    {
      id: '1',
      title: 'Karaoke Night',
      date: 'March 15, 2026',
      image: 'https://images.unsplash.com/photo-1750763539354-e47282c369cf?w=100',
    },
    {
      id: '2',
      title: 'Beer Pong Tournament',
      date: 'March 10, 2026',
      image: 'https://images.unsplash.com/photo-1768726049669-02d56884a86a?w=100',
    },
    {
      id: '3',
      title: 'Live Jazz Evening',
      date: 'March 5, 2026',
      image: 'https://images.unsplash.com/photo-1529156349890-84021ffa9107?w=100',
    },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header Card */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden mb-8">
          {/* Cover Image */}
          <div className="relative h-48 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500">
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Profile Info */}
          <div className="relative px-8 pb-8">
            {/* Avatar */}
            <div className="relative -mt-20 mb-6">
              <div className="relative inline-block">
                <img
                  src="https://images.unsplash.com/photo-1613145997970-db84a7975fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBwcm9maWxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzczNjg0OTQwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-start justify-between mb-6">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-3xl font-bold text-gray-900 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 outline-none mb-2"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
                )}
                {isEditing ? (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="text-gray-600 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 outline-none w-full resize-none"
                    rows={2}
                  />
                ) : (
                  <p className="text-gray-600">{bio}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  {isEditing ? 'Save' : 'Edit Profile'}
                </button>
                <button className="p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="p-2 bg-white rounded-lg">
                  <Mail className="w-5 h-5 text-gray-700" />
                </div>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white rounded-lg px-3 py-2 border border-gray-200 outline-none text-sm"
                  />
                ) : (
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">Email</div>
                    <div className="text-sm font-medium text-gray-900">{email}</div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="p-2 bg-white rounded-lg">
                  <Phone className="w-5 h-5 text-gray-700" />
                </div>
                {isEditing ? (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 bg-white rounded-lg px-3 py-2 border border-gray-200 outline-none text-sm"
                  />
                ) : (
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">Phone</div>
                    <div className="text-sm font-medium text-gray-900">{phone}</div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="p-2 bg-white rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-700" />
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 bg-white rounded-lg px-3 py-2 border border-gray-200 outline-none text-sm"
                  />
                ) : (
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">Location</div>
                    <div className="text-sm font-medium text-gray-900">{location}</div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="p-2 bg-white rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Member Since</div>
                  <div className="text-sm font-medium text-gray-900">January 2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Events</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {recentEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-xl p-6">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 w-full py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
