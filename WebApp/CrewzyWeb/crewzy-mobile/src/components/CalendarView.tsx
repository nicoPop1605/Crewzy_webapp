import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  startDate: number;
  endDate: number;
  color: string;
  dateLabel: string;
  row: number;
}

export function CalendarView() {
  const [currentMonth] = useState('August');
  
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Upcoming Games',
      startDate: 28,
      endDate: 28,
      color: 'purple',
      dateLabel: 'Jul 28',
      row: 0
    },
    {
      id: '2',
      title: 'Latest Gam...',
      startDate: 6,
      endDate: 6,
      color: 'yellow',
      dateLabel: 'Aug 6',
      row: 1
    },
    {
      id: '3',
      title: 'Your Week...',
      startDate: 6,
      endDate: 6,
      color: 'yellow',
      dateLabel: 'Aug 6',
      row: 1
    },
    {
      id: '4',
      title: 'Hot Matches...',
      startDate: 6,
      endDate: 6,
      color: 'yellow',
      dateLabel: 'Aug 6',
      row: 1
    },
    {
      id: '5',
      title: 'Your Weekly Basketball Matchups',
      startDate: 7,
      endDate: 9,
      color: 'pink',
      dateLabel: 'Aug 7 - Aug 9',
      row: 1
    },
    {
      id: '6',
      title: 'Your Week...',
      startDate: 10,
      endDate: 10,
      color: 'yellow',
      dateLabel: 'Aug 10',
      row: 1
    },
    {
      id: '7',
      title: 'Basketball Action Coming Up',
      startDate: 22,
      endDate: 22,
      color: 'blue',
      dateLabel: 'Aug 22',
      row: 3
    }
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // August 2024 calendar grid layout
  const weeks = [
    [
      { date: 29, month: 'prev', dayIndex: 0 },
      { date: 30, month: 'prev', dayIndex: 1 },
      { date: 31, month: 'prev', dayIndex: 2 },
      { date: 1, month: 'current', dayIndex: 3 },
      { date: 2, month: 'current', dayIndex: 4 },
      { date: 3, month: 'current', dayIndex: 5 },
      { date: 4, month: 'current', dayIndex: 6 },
    ],
    [
      { date: 5, month: 'current', dayIndex: 0 },
      { date: 6, month: 'current', dayIndex: 1 },
      { date: 7, month: 'current', dayIndex: 2 },
      { date: 8, month: 'current', dayIndex: 3 },
      { date: 9, month: 'current', dayIndex: 4 },
      { date: 10, month: 'current', dayIndex: 5 },
      { date: 11, month: 'current', dayIndex: 6 },
    ],
    [
      { date: 12, month: 'current', dayIndex: 0 },
      { date: 13, month: 'current', dayIndex: 1 },
      { date: 14, month: 'current', dayIndex: 2 },
      { date: 15, month: 'current', dayIndex: 3 },
      { date: 16, month: 'current', dayIndex: 4 },
      { date: 17, month: 'current', dayIndex: 5 },
      { date: 18, month: 'current', dayIndex: 6 },
    ],
    [
      { date: 19, month: 'current', dayIndex: 0 },
      { date: 20, month: 'current', dayIndex: 1 },
      { date: 21, month: 'current', dayIndex: 2 },
      { date: 22, month: 'current', dayIndex: 3 },
      { date: 23, month: 'current', dayIndex: 4 },
      { date: 24, month: 'current', dayIndex: 5 },
      { date: 25, month: 'current', dayIndex: 6 },
    ],
    [
      { date: 26, month: 'current', dayIndex: 0 },
      { date: 27, month: 'current', dayIndex: 1 },
      { date: 28, month: 'current', dayIndex: 2 },
      { date: 29, month: 'current', dayIndex: 3 },
      { date: 30, month: 'current', dayIndex: 4 },
      { date: 31, month: 'current', dayIndex: 5 },
      { date: null, month: 'next', dayIndex: 6 },
    ],
  ];

  const getEventColor = (color: string) => {
    switch (color) {
      case 'purple':
        return 'bg-purple-200/90 text-purple-900';
      case 'yellow':
        return 'bg-amber-200/90 text-amber-900';
      case 'pink':
        return 'bg-pink-300/90 text-pink-900';
      case 'blue':
        return 'bg-blue-200/90 text-blue-900';
      default:
        return 'bg-gray-200 text-gray-900';
    }
  };
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getEventsForWeek = (_week: any[], weekIndex: number) => {
    return events.filter(event => event.row === weekIndex);
  };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getEventPosition = (event: CalendarEvent, week: any[]) => {
    const startDay = week.findIndex(day => day.date === event.startDate);
    if (startDay === -1) return null;
    
    const endDay = week.findIndex(day => day.date === event.endDate);
    const span = endDay >= startDay ? endDay - startDay + 1 : 1;
    
    return { startDay, span };
  };

  return (
    <div className="flex-1 p-8 overflow-auto">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">{currentMonth}</h2>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/50 rounded-lg transition-colors">
          <span className="text-sm font-medium text-gray-900">Month</span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-3 mb-4">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-600 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Weeks */}
        <div className="space-y-3">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="relative">
              {/* Week Grid */}
              <div className="grid grid-cols-7 gap-3">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`bg-white rounded-xl p-4 min-h-[140px] ${
                      day.month === 'prev' || day.date === null ? 'opacity-30' : ''
                    }`}
                  >
                    {day.date && (
                      <div className="text-sm font-medium text-gray-900">
                        {day.date}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Events Overlay */}
              <div className="absolute inset-0 pointer-events-none px-0 py-0">
                <div className="grid grid-cols-7 gap-3 h-full">
                  {week.map((_day, dayIndex) => {
                    const weekEvents = getEventsForWeek(week, weekIndex);
                    const dayEvents = weekEvents.filter(event => {
                      const pos = getEventPosition(event, week);
                      return pos && pos.startDay === dayIndex;
                    });

                    return (
                      <div key={`events-${weekIndex}-${dayIndex}`} className="relative pt-8">
                        {dayEvents.map((event) => {
                          const pos = getEventPosition(event, week);
                          if (!pos) return null;

                          return (
                            <div
                              key={event.id}
                              className={`${getEventColor(event.color)} rounded-lg p-3 mb-2 pointer-events-auto cursor-pointer hover:opacity-90 transition-opacity`}
                              style={{
                                width: pos.span > 1 ? `calc(${pos.span * 100}% + ${(pos.span - 1) * 12}px)` : '100%',
                              }}
                            >
                              <div className="flex items-center gap-1 mb-1">
                                <CalendarIcon className="w-3 h-3" />
                                <span className="text-[10px] font-medium">
                                  {event.dateLabel}
                                </span>
                              </div>
                              <div className="text-xs font-semibold line-clamp-2">
                                {event.title}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}