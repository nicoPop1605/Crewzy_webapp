import { Search, Bell, ChevronDown, SlidersHorizontal, Grid3x3, List, Calendar as CalendarIcon } from 'lucide-react';

export function CalendarHeader() {
  return (
    <div className="bg-white/60 backdrop-blur-sm px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white rounded-full" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
        </div>

        {/* User Profile and Notifications */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-semibold">
              M
            </div>
            <span className="text-sm font-medium text-gray-900">Moment</span>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Left side - Tabs and Search */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white rounded-full p-1 shadow-sm">
            <button className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-full">
              Events
            </button>
            <button className="px-5 py-2 text-sm font-medium bg-gray-900 text-white rounded-full">
              Schedules
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm min-w-[300px]">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events"
              className="flex-1 text-sm outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <span className="text-sm font-medium text-gray-900">Sort</span>
            <CalendarIcon className="w-4 h-4 text-gray-600" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <span className="text-sm font-medium text-gray-900">Filter</span>
            <SlidersHorizontal className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
              <Grid3x3 className="w-4 h-4 text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
              <List className="w-4 h-4 text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
              <CalendarIcon className="w-4 h-4 text-gray-900" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
