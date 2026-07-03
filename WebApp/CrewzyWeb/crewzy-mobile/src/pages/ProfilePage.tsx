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
            title: 'Beer Pong Tourney',
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
        <div className="flex-1 overflow-auto bg-gray-50/50">
            {/* Reducem padding-ul pe mobil la p-4 */}
            <div className="max-w-5xl mx-auto p-4 md:p-8 pb-24 md:pb-8">

                {/* Header Card */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-xl overflow-hidden mb-6 md:mb-8 border border-gray-100">

                    {/* Cover Image - Mai scundă pe mobil */}
                    <div className="relative h-32 md:h-48 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500">
                        <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* Profile Info */}
                    <div className="relative px-4 md:px-8 pb-6 md:pb-8">

                        {/* Avatar - Pozitionat mai sus si putin mai mic pe mobil */}
                        <div className="relative -mt-16 md:-mt-20 mb-4 md:mb-6">
                            <div className="relative inline-block">
                                <img
                                    src="https://images.unsplash.com/photo-1613145997970-db84a7975fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBwcm9maWxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzczNjg0OTQwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                                    alt="Profile"
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl object-cover"
                                />
                                <button className="absolute bottom-0 right-0 p-1.5 md:p-2 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors">
                                    <Camera className="w-4 h-4 md:w-4 md:h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Flex-col pe mobil pentru a pune butoanele sub nume */}
                        <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4 md:gap-0">
                            <div className="flex-1">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="text-2xl md:text-3xl font-bold text-gray-900 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 outline-none mb-2 w-full"
                                    />
                                ) : (
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">{name}</h1>
                                )}
                                {isEditing ? (
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="text-sm md:text-base text-gray-600 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 outline-none w-full resize-none"
                                        rows={3}
                                    />
                                ) : (
                                    <p className="text-sm md:text-base text-gray-600">{bio}</p>
                                )}
                            </div>

                            {/* Butoanele de edit - pe toată lățimea pe mobil */}
                            <div className="flex gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 md:px-6 md:py-3 bg-gray-900 text-white rounded-xl text-sm md:text-base font-medium hover:bg-gray-800 transition-colors shadow-md"
                                >
                                    <Edit className="w-4 h-4" />
                                    {isEditing ? 'Save' : 'Edit Profile'}
                                </button>
                                <button className="p-2.5 md:p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors border border-gray-200 shadow-sm">
                                    <Settings className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Stats - Păstrăm pe un rând, dar micșorăm textul pe mobil */}
                        <div className="grid grid-cols-3 gap-2 md:gap-6 mb-6 md:mb-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center p-2 md:p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
                                    <div className="text-lg md:text-2xl font-bold text-gray-900 mb-0.5 md:mb-1">{stat.value}</div>
                                    <div className="text-[10px] md:text-sm text-gray-600 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Contact Info - Pe un singur rând (vertical) pe mobil, 2 rânduri pe web */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <div className="flex items-center gap-3 p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                                </div>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex-1 bg-white rounded-lg px-3 py-2 border border-gray-200 outline-none text-sm w-full"
                                    />
                                ) : (
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[10px] md:text-xs text-gray-500 mb-0.5 md:mb-1">Email</div>
                                        <div className="text-xs md:text-sm font-medium text-gray-900 truncate">{email}</div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3 p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                                </div>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="flex-1 bg-white rounded-lg px-3 py-2 border border-gray-200 outline-none text-sm w-full"
                                    />
                                ) : (
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[10px] md:text-xs text-gray-500 mb-0.5 md:mb-1">Phone</div>
                                        <div className="text-xs md:text-sm font-medium text-gray-900 truncate">{phone}</div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3 p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                                </div>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="flex-1 bg-white rounded-lg px-3 py-2 border border-gray-200 outline-none text-sm w-full"
                                    />
                                ) : (
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[10px] md:text-xs text-gray-500 mb-0.5 md:mb-1">Location</div>
                                        <div className="text-xs md:text-sm font-medium text-gray-900 truncate">{location}</div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3 p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[10px] md:text-xs text-gray-500 mb-0.5 md:mb-1">Member Since</div>
                                    <div className="text-xs md:text-sm font-medium text-gray-900 truncate">January 2026</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Events */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-8 mb-6 md:mb-8 border border-gray-100">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Recent Events</h2>

                    {/* Aici am pus grid-cols-2 pentru mobil și grid-cols-3 pentru desktop */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                        {recentEvents.map((event) => (
                            <div key={event.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-24 md:h-32 object-cover"
                                />
                                <div className="p-2 md:p-4 flex-1 flex flex-col justify-between">
                                    <h3 className="text-xs md:text-base font-bold text-gray-900 mb-0.5 md:mb-1 line-clamp-2">{event.title}</h3>
                                    <p className="text-[10px] md:text-sm text-gray-500">{event.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Logout Button */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-6 border border-gray-100">
                    <Link
                        to="/login"
                        className="flex items-center justify-center gap-2 w-full py-2.5 md:py-3 text-red-600 font-semibold text-sm md:text-base bg-red-50 hover:bg-red-100 rounded-xl transition-colors shadow-sm"
                    >
                        <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                        <span>Log Out</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}