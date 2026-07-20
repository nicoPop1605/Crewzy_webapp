
import { useState, useEffect, useCallback } from "react";
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from "recharts";
import {
    LayoutDashboard, CalendarDays, Building2, Megaphone,
    TrendingUp, Users, Eye, ArrowUpRight, Plus,
     Bell, UserPlus,
    Edit2, Trash2, Send, Check, ScanLine,
    MoreHorizontal, MapPin, Phone, Globe, Mail, Upload,
     Shield, Zap, 
    CalendarPlus, ToggleLeft, ToggleRight, Wifi
} from "lucide-react";

// ─── Mock Data & Helpers ──────────────────────────────────────────────────

const API_URL = 'http://127.0.0.1:4000';
const ADMIN_ID = "ADMIN_USER_123";

const fetchGraphQL = async (query: string, variables = {}) => {
    // Debug: Vezi ce trimiți exact către server
    console.log("--- TRIMIT CĂTRE SERVER ---");
    console.log("Query:", query);
    console.log("Variables:", variables);

    const response = await fetch(`${API_URL}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();

    if (result.errors) {
        // Debug: Vezi motivul specific pentru care serverul a dat 400
        console.error("--- EROARE DETALIATĂ ---", result.errors);
        throw new Error(result.errors[0].message);
    }
    return result.data;
};

const rsvpTrendData = [
    { day: "Mon", rsvp: 12, views: 45 },
    { day: "Tue", rsvp: 19, views: 62 },
    { day: "Wed", rsvp: 28, views: 88 },
    { day: "Thu", rsvp: 35, views: 110 },
    { day: "Fri", rsvp: 67, views: 189 },
    { day: "Sat", rsvp: 94, views: 241 },
    { day: "Sun", rsvp: 72, views: 198 },
];

const peakHoursData = [
    { hour: "6pm", signups: 8 },
    { hour: "7pm", signups: 22 },
    { hour: "8pm", signups: 47 },
    { hour: "9pm", signups: 63 },
    { hour: "10pm", signups: 55 },
    { hour: "11pm", signups: 31 },
    { hour: "12am", signups: 14 },
];

const mockEvents = [
    {
        id: "1", name: "Friday Karaoke Night", date: "Fri, Jul 18", time: "9 PM",
        rsvp: 87, capacity: 120, views: 341, category: "Karaoke",
        status: "active", color: "#a855f7"
    },
    {
        id: "2", name: "Salsa & Cocktails", date: "Sat, Jul 19", time: "8 PM",
        rsvp: 120, capacity: 120, views: 512, category: "Dance",
        status: "full", color: "#3b82f6"
    }
];

const attendees = [
    { id: 1, name: "Alex Ionescu", avatar: "AI", checkedIn: true, rsvpTime: "2d ago" },
    { id: 2, name: "Maria Popescu", avatar: "MP", checkedIn: true, rsvpTime: "1d ago" },
];

const staff = [
    { id: 1, name: "Mihai Dumitrescu", role: "Manager", access: "full", status: "active" },
    { id: 2, name: "Ana Stoica", role: "Event Host", access: "events", status: "active" },
];

const categories = ["Karaoke", "DJ Set", "Live Music", "Dance", "Comedy", "Trivia", "Happy Hour", "Themed Party"];

// ─── Subcomponents ───────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, delta, color }: {
    icon: React.ElementType; label: string; value: string; delta: string; color: string;
}) {
    return (
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-white/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl`} style={{ background: `${color}18` }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <ArrowUpRight className="w-3 h-3" />
                    {delta}
                </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
        </div>
    );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
    );
}

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface TooltipPayload {
    color: string;
    name: string;
    value: string | number;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900/90 backdrop-blur text-white text-xs px-3 py-2 rounded-lg shadow-xl">
                <p className="font-medium mb-1">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
                ))}
            </div>
        );
    }
    return null;
};

// ─── Section: Dashboard ──────────────────────────────────────────────────────

function DashboardSection() {
    const [fakerStatus, setFakerStatus] = useState("Oprit");

    const toggleFaker = async (action: 'start' | 'stop') => {
        try {
            const res = await fetch(`${API_URL}/api/${action}-loop`);
            const text = await res.text();
            setFakerStatus(action === 'start' ? "Pornește (Generare activă...)" : "Oprit");
            alert(text);
        } catch (error) {
            alert("Eroare la conectarea cu simulatorul!");
        }
    };

    return (
        <div className="space-y-8">
            <SectionTitle title="Overview" subtitle="Friday Karaoke Night — Jul 18, 2026" />

            {/* --- PANOUL DE CONTROL SIMULATOR --- */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100 shadow-sm mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-red-900 text-lg flex items-center gap-2">
                            <Zap className="w-5 h-5 text-red-500" />
                            Traffic Simulator (Faker Bot)
                        </h3>
                        <p className="text-sm text-red-700 mt-1">Stare: <span className="font-mono font-bold">{fakerStatus}</span></p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => toggleFaker('start')} className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition">
                            START GENERATOR
                        </button>
                        <button onClick={() => toggleFaker('stop')} className="px-5 py-2.5 bg-gray-800 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-gray-900 transition">
                            STOP
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Total RSVPs" value="87" delta="+12%" color="#a855f7" />
                <StatCard icon={TrendingUp} label="Capacity Filled" value="73%" delta="+8%" color="#3b82f6" />
                <StatCard icon={Eye} label="Page Views" value="341" delta="+24%" color="#ec4899" />
                <StatCard icon={Zap} label="Conversion Rate" value={`25%`} delta="+3%" color="#f59e0b" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* RSVP vs Views Trend */}
                <div className="lg:col-span-2 bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-gray-900 text-sm">RSVPs vs. Page Views</h3>
                            <p className="text-xs text-gray-400 mt-0.5">This week</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />RSVPs</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />Views</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={rsvpTrendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="rsvpGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="views" name="Views" stroke="#3b82f6" strokeWidth={2} fill="url(#viewsGrad)" />
                            <Area type="monotone" dataKey="rsvp" name="RSVPs" stroke="#a855f7" strokeWidth={2.5} fill="url(#rsvpGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Peak Hours */}
                <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-sm">
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 text-sm">Peak Signup Hours</h3>
                        <p className="text-xs text-gray-400 mt-0.5">When people RSVP most</p>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={peakHoursData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="signups" name="Signups" fill="#a855f7" radius={[4, 4, 0, 0]}>
                                {peakHoursData.map((entry, index) => (
                                    <Cell key={index} fill={entry.signups === 63 ? "#7c3aed" : "#c4b5fd"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Event Engagement Table (Mocked) */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-sm">All Events Performance</h3>
                    <button className="text-xs text-purple-600 font-medium hover:text-purple-800 transition-colors">View all</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="text-left text-xs font-medium text-gray-400 px-6 py-3">Event</th>
                                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Date</th>
                                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">RSVPs / Cap.</th>
                                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Views</th>
                                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockEvents.map((event) => {
                                const fill = Math.round((event.rsvp / event.capacity) * 100);
                                return (
                                    <tr key={event.id} className="border-b border-gray-50 hover:bg-purple-50/40 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                                                    style={{ background: `linear-gradient(135deg, ${event.color}, ${event.color}88)` }}>
                                                    {event.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 text-xs leading-tight">{event.name}</p>
                                                    <p className="text-gray-400 text-xs">{event.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-xs text-gray-500">{event.date}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-gray-900">{event.rsvp}/{event.capacity}</span>
                                                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full rounded-full" style={{ width: `${fill}%`, background: fill >= 100 ? "#ef4444" : "#a855f7" }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-xs text-gray-500">{event.views}</td>
                                        <td className="px-4 py-4">
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${event.status === "full"
                                                ? "bg-red-50 text-red-600"
                                                : "bg-emerald-50 text-emerald-600"
                                                }`}>
                                                {event.status === "full" ? "Sold Out" : "Active"}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ─── Section: Events (GraphQL Integration) ────────────────────────────────────

function EventsSection() {
    const [showForm, setShowForm] = useState(false);
    const [dbEvents, setDbEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [recurringEnabled, setRecurringEnabled] = useState(false);
    const [waitlistEnabled, setWaitlistEnabled] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Karaoke");

    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [capacity, setCapacity] = useState(100);

    const loadEvents = useCallback(async () => {
        setLoading(true);
        const offset = 0; // Fix: definit local
        const limit = 50; // Fix: definit local
        try {
            const query = `
                query GetEvents($scope: String, $userId: String, $offset: Int, $limit: Int) {
                    getEvents(scope: $scope, userId: $userId, offset: $offset, limit: $limit) {
                        id title date time location description
                    }
                }
            `;
            const variables = { scope: "ADMIN", userId: ADMIN_ID, offset, limit };
            const data = await fetchGraphQL(query, variables);
            setDbEvents(data.getEvents || []);
        } catch (error) {
            console.error("Nu am putut încărca evenimentele", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadEvents(); }, [loadEvents]);
   

    const handleCreateEvent = async () => {
        if (!title.trim()) return alert("Titlul este obligatoriu!");

        try {
            const mutation = `
            mutation AddAdminEvent($title: String!, $date: String, $time: String, $location: String, $description: String, $capacity: Int, $adminId: String!) {
                addAdminEvent(title: $title, date: $date, time: $time, location: $location, description: $description, capacity: $capacity, adminId: $adminId) {
                    id
                }
            }
        `;
            // adminId vine din constanta ADMIN_ID definită sus în fișier
            const variables = { title, date, time, location, description, capacity, adminId: ADMIN_ID };

            await fetchGraphQL(mutation, variables);
            alert("Eveniment creat cu succes!");
            setShowForm(false);
            setTitle(''); setDate(''); setTime(''); setLocation(''); setDescription(''); setCapacity(100);
            loadEvents();
        } catch (error: any) {
            alert(`Eroare backend: ${error.message}`);
        }
    };

    const handleDeleteEvent = async (id: string) => {
        if (!window.confirm("Sigur vrei să ștergi acest eveniment?")) return;
        try {
            const mutation = `
                mutation DeleteEvent($id: ID!) {
                    deleteEvent(id: $id)
                }
            `;
            await fetchGraphQL(mutation, { id });
            loadEvents();
        } catch (error) {
            alert("Nu am putut șterge evenimentul.");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <SectionTitle title="Event Management" subtitle="Create, edit and manage your upcoming events" />
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-purple-200"
                >
                    <Plus className="w-4 h-4" />
                    New Event
                </button>
            </div>

            {showForm && (
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-purple-100 shadow-lg shadow-purple-100/40">
                    <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <CalendarPlus className="w-4 h-4 text-purple-500" />
                        Create New Event
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Event Name</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Friday Karaoke Night"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Capacity</label>
                            <input
                                type="number"
                                value={capacity}
                                onChange={(e) => setCapacity(parseInt(e.target.value))}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Time</label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Category</label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${selectedCategory === cat
                                            ? "bg-purple-600 text-white shadow-sm"
                                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Location</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Event Location"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
                            <textarea
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your event, rules, dress code..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition resize-none"
                            />
                        </div>

                        {/* Toggles */}
                        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                            <div>
                                <p className="text-sm font-medium text-gray-800">Recurring Event</p>
                                <p className="text-xs text-gray-400">Repeat weekly / monthly</p>
                            </div>
                            <button onClick={() => setRecurringEnabled(!recurringEnabled)} className="transition-colors">
                                {recurringEnabled ? <ToggleRight className="w-8 h-8 text-purple-600" /> : <ToggleLeft className="w-8 h-8 text-gray-300" />}
                            </button>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                            <div>
                                <p className="text-sm font-medium text-gray-800">Enable Waitlist</p>
                                <p className="text-xs text-gray-400">Auto-queue when full</p>
                            </div>
                            <button onClick={() => setWaitlistEnabled(!waitlistEnabled)} className="transition-colors">
                                {waitlistEnabled ? <ToggleRight className="w-8 h-8 text-purple-600" /> : <ToggleLeft className="w-8 h-8 text-gray-300" />}
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button onClick={handleCreateEvent} className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-purple-200">
                            Publish Event
                        </button>
                        <button onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Event List from Database */}
            {loading ? (
                <div className="text-center py-10 text-gray-500">Se încarcă evenimentele...</div>
            ) : dbEvents.length === 0 ? (
                <div className="text-center py-10 text-gray-500">Niciun eveniment găsit.</div>
            ) : (
                <div className="space-y-3">
                    {dbEvents.map((event) => {
                        const rsvpCount = event.attendees?.length || 0;
                        const bgColor = event.color ? event.color.replace('bg-', '').replace('-500', '') : 'purple';

                        return (
                            <div key={event.id} className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-white/60 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
                                        style={{ backgroundColor: event.color?.startsWith('#') ? event.color : '#a855f7' }}>
                                        {event.title ? event.title[0].toUpperCase() : 'E'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-gray-900 text-sm truncate">{event.title}</h4>
                                        </div>
                                        <p className="text-xs text-gray-400">{event.date} · {event.time} · {event.location || "N/A"}</p>
                                    </div>
                                    <div className="flex items-center gap-6 flex-shrink-0">
                                        <div className="text-center hidden md:block">
                                            <p className="text-sm font-bold text-gray-900">{rsvpCount}</p>
                                            <p className="text-xs text-gray-400">RSVPs</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDeleteEvent(event.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ─── Section: Venue Profile ───────────────────────────────────────────────────

function VenueSection() {
    const [activeTab, setActiveTab] = useState<"profile" | "staff">("profile");
    const [editMode, setEditMode] = useState(false);

    return (
        <div className="space-y-8">
            <SectionTitle title="Venue Profile" subtitle="Manage your business information and team access" />

            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
                {(["profile", "staff"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setActiveTab(t)}
                        className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === t ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {t === "profile" ? "Business Profile" : "Staff Management"}
                    </button>
                ))}
            </div>

            {activeTab === "profile" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Venue Photo */}
                    <div className="md:col-span-1 space-y-4">
                        <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 relative group">
                            <img
                                src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400&h=400&fit=crop&auto=format"
                                alt="Venue interior"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button className="bg-white text-gray-900 text-xs font-medium px-4 py-2 rounded-xl flex items-center gap-2">
                                    <Upload className="w-3.5 h-3.5" />
                                    Change Photo
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Business Info */}
                    <div className="md:col-span-2 bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-sm space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 text-sm">Business Information</h3>
                            <button
                                onClick={() => setEditMode(!editMode)}
                                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${editMode ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {editMode ? "Save Changes" : "Edit Profile"}
                            </button>
                        </div>

                        {[
                            { label: "Venue Name", value: "Club Neon Bucharest", icon: Building2 },
                            { label: "Address", value: "Str. Academiei 14, Sector 1, București", icon: MapPin },
                            { label: "Phone", value: "+40 21 315 6789", icon: Phone },
                            { label: "Website", value: "www.clubneon.ro", icon: Globe },
                            { label: "Email", value: "events@clubneon.ro", icon: Mail },
                        ].map(({ label, value, icon: Icon }) => (
                            <div key={label}>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
                                <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
                                    <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    {editMode
                                        ? <input defaultValue={value} className="flex-1 bg-transparent text-sm text-gray-800 focus:outline-none" />
                                        : <span className="text-sm text-gray-800">{value}</span>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "staff" && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">{staff.length} team members</p>
                        <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl text-xs font-medium hover:opacity-90 transition-opacity shadow-lg shadow-purple-200">
                            <UserPlus className="w-3.5 h-3.5" />
                            Invite Staff
                        </button>
                    </div>

                    <div className="space-y-3">
                        {staff.map((member) => (
                            <div key={member.id} className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-sm flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                                    {member.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                                    <p className="text-xs text-gray-400">{member.role}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${member.access === "full"
                                        ? "bg-purple-50 text-purple-700"
                                        : member.access === "events"
                                            ? "bg-blue-50 text-blue-700"
                                            : "bg-gray-100 text-gray-600"
                                        }`}>
                                        {member.access === "full" ? "Full Access" : member.access === "events" ? "Events Only" : "Check-in Only"}
                                    </span>
                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${member.status === "active" ? "bg-emerald-400" : "bg-gray-300"
                                        }`} />
                                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Section: Communications ─────────────────────────────────────────────────

function CommsSection() {
    const [activeTab, setActiveTab] = useState<"broadcast" | "checkin">("broadcast");
    const [message, setMessage] = useState("");
    const [checkedIn, setCheckedIn] = useState<number[]>([1, 2, 5, 8]);
    const [scannerActive, setScannerActive] = useState(false);
    const [broadcastSent, setBroadcastSent] = useState(false);
    const [filterValue, setFilterValue] = useState("all");

    const toggleCheckIn = (id: number) => {
        setCheckedIn(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const filteredAttendees = attendees.filter(a => {
        if (filterValue === "checkedin") return checkedIn.includes(a.id);
        if (filterValue === "pending") return !checkedIn.includes(a.id);
        return true;
    });

    const handleSend = () => {
        if (!message.trim()) return;
        setBroadcastSent(true);
        setTimeout(() => setBroadcastSent(false), 3000);
        setMessage("");
    };

    return (
        <div className="space-y-8">
            <SectionTitle title="Communications & Operations" subtitle="Broadcast updates and manage check-ins" />

            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
                {(["broadcast", "checkin"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setActiveTab(t)}
                        className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {t === "broadcast" ? "Attendee Broadcasts" : "Check-in System"}
                    </button>
                ))}
            </div>

            {activeTab === "broadcast" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-sm space-y-5">
                        <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                            <Megaphone className="w-4 h-4 text-purple-500" />
                            New Broadcast
                        </h3>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Message</label>
                            <textarea
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Quick update for tonight: doors open at 8:30 PM..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition resize-none"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleSend}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${broadcastSent
                                    ? "bg-emerald-500 text-white"
                                    : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 shadow-lg shadow-purple-200"
                                    }`}
                            >
                                {broadcastSent ? <><Check className="w-4 h-4" /> Sent!</> : <><Send className="w-4 h-4" /> Send Broadcast</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "checkin" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Scanner Panel */}
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-sm flex flex-col items-center gap-5">
                        <h3 className="font-semibold text-gray-900 text-sm self-start">QR Scanner</h3>
                        <div className={`w-48 h-48 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${scannerActive
                            ? "bg-gradient-to-br from-purple-600 to-blue-600 shadow-xl shadow-purple-300/50"
                            : "bg-gray-100 border-2 border-dashed border-gray-300"
                            }`}>
                            <ScanLine className={`w-12 h-12 ${scannerActive ? "text-white" : "text-gray-400"}`} />
                            <p className={`text-xs font-medium ${scannerActive ? "text-white/80" : "text-gray-400"}`}>
                                {scannerActive ? "Scanning..." : "Scanner Off"}
                            </p>
                        </div>
                        <button
                            onClick={() => setScannerActive(!scannerActive)}
                            className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${scannerActive
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 shadow-lg shadow-purple-200"
                                }`}
                        >
                            {scannerActive ? "Stop Scanner" : "Start Scanner"}
                        </button>
                    </div>

                    {/* Attendee List */}
                    <div className="md:col-span-2 bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 text-sm">Attendees</h3>
                        </div>
                        <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
                            {filteredAttendees.map((person) => {
                                const isIn = checkedIn.includes(person.id);
                                return (
                                    <div key={person.id} className={`px-6 py-3.5 flex items-center gap-4 transition-colors ${isIn ? "bg-emerald-50/40" : "hover:bg-gray-50/60"}`}>
                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-300 to-blue-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                            {person.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{person.name}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => toggleCheckIn(person.id)}
                                                className={`p-2 rounded-xl transition-all ${isIn
                                                    ? "bg-emerald-100 text-emerald-600 hover:bg-red-100 hover:text-red-500"
                                                    : "bg-gray-100 text-gray-400 hover:bg-purple-100 hover:text-purple-600"
                                                    }`}
                                            >
                                                {isIn ? <Check className="w-4 h-4" /> : <ScanLine className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

type AdminTab = "dashboard" | "events" | "venue" | "comms";

const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "events", label: "Events", icon: CalendarDays },
    { id: "venue", label: "Venue Profile", icon: Building2 },
    { id: "comms", label: "Communications", icon: Megaphone },
];

export function AdminPage() {
    const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-gradient-to-br from-purple-50/80 via-blue-50/60 to-white/80">
            {/* Top Header */}
            <div className="flex-shrink-0 px-8 pt-8 pb-0">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                Business Admin
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Wifi className="w-3 h-3 text-emerald-500" />
                                Live
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Club Neon Bucharest</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Manage your venue, events, and guests</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2.5 bg-white/80 backdrop-blur rounded-xl border border-white/60 shadow-sm text-gray-500 hover:text-gray-700 hover:bg-white transition-all">
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-200">
                            CN
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-0 border-b border-gray-200/60">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all -mb-px ${activeTab === id
                                ? "border-purple-600 text-purple-700"
                                : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-8">
                {activeTab === "dashboard" && <DashboardSection />}
                {activeTab === "events" && <EventsSection />}
                {activeTab === "venue" && <VenueSection />}
                {activeTab === "comms" && <CommsSection />}
            </div>
        </div>
    );
}

