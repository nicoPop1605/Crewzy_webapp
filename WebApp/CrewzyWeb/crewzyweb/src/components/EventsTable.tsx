import { useState } from 'react';
import { Edit2, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import type { MyEvent } from './MyEventCard';

interface EventsTableProps {
    events: MyEvent[];
    onEdit: (event: MyEvent) => void;
    onDelete: (id: string) => void;
    onViewDetails: (event: MyEvent) => void;
}

export function EventsTable({ events, onEdit, onDelete, onViewDetails }: EventsTableProps) {
    // Logica de paginare
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Câte evenimente arătăm pe o pagină

    // Calculăm câte pagini avem în total
    const totalPages = Math.ceil(events.length / itemsPerPage);

    // Tăiem lista mare ca să luăm doar evenimentele pentru pagina curentă
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedEvents = events.slice(startIndex, startIndex + itemsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    if (events.length === 0) {
        return <div className="text-center py-8 text-gray-500">No events to display.</div>;
    }

    return (
        <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Tabelul efectiv */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="p-4 text-sm font-semibold text-gray-600">Event Title</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Date & Time</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Location</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedEvents.map((event) => (
                            <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="font-semibold text-gray-900">{event.title}</div>
                                    <div className="text-xs text-gray-500">{event.visibility}</div>
                                </td>
                                <td className="p-4 text-sm text-gray-700">
                                    <div>{event.date}</div>
                                    <div className="text-gray-500">{event.time}</div>
                                </td>
                                <td className="p-4 text-sm text-gray-700">
                                    {event.locationType === 'suggestions' ? 'Suggestions open' : event.location || '-'}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => onViewDetails(event)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="View Details">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => onEdit(event)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Edit">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => onDelete(event.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Controalele de paginare */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50">
                <span className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, events.length)} of {events.length} entries
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50 hover:bg-gray-50"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 text-sm font-medium">
                        Page {currentPage} of {totalPages || 1}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50 hover:bg-gray-50"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}