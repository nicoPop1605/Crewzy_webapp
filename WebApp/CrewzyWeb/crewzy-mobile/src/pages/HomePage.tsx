import { Calendar, Compass, Users, Sparkles, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LogoWithText } from '../components/Logo';

export function HomePage() {
    const features = [
        {
            icon: Compass,
            title: 'Discover Events',
            description: 'Find the hottest events at bars and restaurants near you. From karaoke nights to beer pong tournaments.',
            image: 'https://images.unsplash.com/photo-1750763539354-e47282c369cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBldmVudCUyMGNyb3dkfGVufDF8fHx8MTc3MzY4NDI3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
            color: 'bg-purple-500',
        },
        {
            icon: Calendar,
            title: 'Plan Together',
            description: 'Create events and invite your friends or groups. Choose dates, times, and locations collaboratively.',
            image: 'https://images.unsplash.com/photo-1771199303579-47244153939b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxlbmRhciUyMHBsYW5uaW5nJTIwc2NoZWR1bGV8ZW58MXx8fHwxNzczNjIzMTY1fDA&ixlib=rb-4.1.0&q=80&w=1080',
            color: 'bg-blue-500',
        },
        {
            icon: Users,
            title: 'Connect with Friends',
            description: 'Manage your friends and groups. Create group events or share with everyone. Stay connected and organized.',
            image: 'https://images.unsplash.com/photo-1529156349890-84021ffa9107?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMGZyaWVuZHMlMjB0b2dldGhlcnxlbnwxfHx8fDE3NzM2ODQyNzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
            color: 'bg-pink-500',
        },
    ];

    const benefits = [
        'Never miss out on local events',
        'Coordinate group plans effortlessly',
        'Let friends suggest locations',
        'Track who\'s coming to your events',
        'Discover new venues and activities',
        'Keep all your social plans in one place',
    ];

    return (
        <div className="flex-1 overflow-auto bg-gray-50/50 pb-20 md:pb-0">
            {/* Hero Section */}
            <div className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center px-4 md:px-8 py-12 md:py-20">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1768726049669-02d56884a86a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwY2VsZWJyYXRpbmclMjBwYXJ0eXxlbnwxfHx8fDE3NzM2ODQyNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Friends celebrating"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-50 to-purple-100" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-4xl text-center">
                    {/* Logo Badge */}
                    <div className="flex justify-center mb-4 md:mb-6">
                        <div className="bg-white/60 backdrop-blur-md rounded-full p-2 md:p-3 border border-purple-200/50 shadow-lg scale-75 md:scale-100">
                            <LogoWithText size={64} showText={false} />
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-purple-100/80 backdrop-blur-md rounded-full text-purple-900 mb-4 md:mb-6 border border-purple-200/50 shadow-sm">
                        <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="text-xs md:text-sm font-medium">Your Social Life, Simplified</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                        Discover, Plan <br className="md:hidden" /> & Connect
                    </h1>

                    <p className="text-base md:text-xl text-gray-700 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
                        The ultimate platform for finding local events, planning hangouts with friends,
                        and making every social moment unforgettable.
                    </p>

                    {/* Butoanele de hero: lăsate exact cum ai cerut, una lângă alta (flex-row) */}
                    <div className="flex flex-row items-center justify-center gap-2 md:gap-4 px-2 md:px-0">
                        <Link
                            to="/discover"
                            className="group flex items-center justify-center gap-1.5 md:gap-2 px-4 py-3 md:px-8 md:py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all shadow-lg text-sm md:text-base whitespace-nowrap"
                        >
                            <span>Explore Events</span>
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/calendar"
                            className="flex items-center justify-center gap-1.5 md:gap-2 px-4 py-3 md:px-8 md:py-4 bg-white/80 backdrop-blur-md text-gray-900 rounded-full font-semibold hover:bg-white transition-all border border-gray-200 shadow-lg text-sm md:text-base whitespace-nowrap"
                        >
                            <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                            <span>View Calendar</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="px-4 md:px-8 py-12 md:py-20 bg-white/40 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10 md:mb-16">
                        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                            Everything You Need to Stay Social
                        </h2>
                        <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
                            From discovering the latest events to planning with your crew, we've got you covered
                        </p>
                    </div>

                    {/* Magia pentru 2 rânduri pe mobil: grid-cols-2 */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-md md:shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 border border-gray-100"
                            >
                                <div className="relative h-28 md:h-48 overflow-hidden">
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className={`absolute bottom-2 left-2 md:bottom-4 md:left-4 p-2 md:p-3 ${feature.color} rounded-lg md:rounded-xl shadow-sm`}>
                                        <feature.icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                                    </div>
                                </div>
                                <div className="p-3 md:p-6">
                                    <h3 className="text-sm md:text-xl font-semibold text-gray-900 mb-1 md:mb-3 line-clamp-1 md:line-clamp-none">{feature.title}</h3>
                                    <p className="text-[11px] md:text-base text-gray-600 leading-relaxed line-clamp-3 md:line-clamp-none">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="px-4 md:px-8 py-12 md:py-20">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-xl border border-gray-100">
                        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                            <div>
                                <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
                                    Why Choose Our Platform?
                                </h2>
                                <p className="text-sm md:text-lg text-gray-600 mb-6 md:mb-8">
                                    We make it easy to stay connected with your friends and discover amazing experiences together.
                                </p>
                                <div className="space-y-3 md:space-y-4">
                                    {benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-sm">
                                                <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                            </div>
                                            <span className="text-sm md:text-base text-gray-700 font-medium">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative mt-8 md:mt-0">
                                <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1529156349890-84021ffa9107?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMGZyaWVuZHMlMjB0b2dldGhlcnxlbnwxfHx8fDE3NzM2ODQyNzd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                                        alt="Friends together"
                                        className="w-full h-48 md:h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent" />
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-500 rounded-full opacity-20 blur-2xl" />
                                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500 rounded-full opacity-20 blur-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="px-4 md:px-8 py-16 md:py-20 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-base md:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl mx-auto">
                        Join thousands of people making plans and creating memories together
                    </p>
                    <div className="flex flex-row items-center justify-center gap-2 md:gap-4 px-2 md:px-0">
                        <Link
                            to="/friends"
                            className="group flex items-center justify-center gap-1.5 md:gap-2 px-4 py-3 md:px-8 md:py-4 bg-white text-gray-900 rounded-xl md:rounded-full font-semibold hover:bg-gray-100 transition-all shadow-xl text-sm md:text-base whitespace-nowrap"
                        >
                            <Users className="w-4 h-4 md:w-5 md:h-5" />
                            <span>Connect Friends</span>
                        </Link>
                        <Link
                            to="/discover"
                            className="flex items-center justify-center gap-1.5 md:gap-2 px-4 py-3 md:px-8 md:py-4 bg-white/10 backdrop-blur-md text-white rounded-xl md:rounded-full font-semibold hover:bg-white/20 transition-all border border-white/30 text-sm md:text-base whitespace-nowrap"
                        >
                            <Compass className="w-4 h-4 md:w-5 md:h-5" />
                            <span>Browse Events</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="px-4 md:px-8 py-12 md:py-20 bg-white/40 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-10 md:mb-16">
                        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                            How It Works
                        </h2>
                        <p className="text-sm md:text-lg text-gray-600">
                            Get started in three simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        <div className="text-center bg-white/60 md:bg-transparent p-6 md:p-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-gray-100 md:border-none">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold mx-auto mb-4 md:mb-6 shadow-md">
                                1
                            </div>
                            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">Discover or Create</h3>
                            <p className="text-sm md:text-base text-gray-600">
                                Browse local events or create your own hangout plan with custom details
                            </p>
                        </div>

                        <div className="text-center bg-white/60 md:bg-transparent p-6 md:p-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-gray-100 md:border-none">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold mx-auto mb-4 md:mb-6 shadow-md">
                                2
                            </div>
                            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">Invite Friends</h3>
                            <p className="text-sm md:text-base text-gray-600">
                                Share with all friends or specific groups. Let them join and suggest locations
                            </p>
                        </div>

                        <div className="text-center bg-white/60 md:bg-transparent p-6 md:p-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-gray-100 md:border-none">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-pink-500 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold mx-auto mb-4 md:mb-6 shadow-md">
                                3
                            </div>
                            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">Make Memories</h3>
                            <p className="text-sm md:text-base text-gray-600">
                                Track RSVPs, coordinate details, and enjoy unforgettable experiences together
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}