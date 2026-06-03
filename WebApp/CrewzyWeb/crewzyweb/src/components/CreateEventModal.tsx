/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/set-state-in-effect */
import { X, Calendar, Clock, MapPin, Users, Link as LinkIcon, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Group } from './GroupCard';
import type { MyEvent } from './MyEventCard';

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (event: NewEvent) => void;
    groups: Group[];
    discoverEventLink?: string;
    eventToEdit?: MyEvent | null;
    initialDate?: string | null;
}

export interface NewEvent {
    title: string;
    date: string;
    time: string;
    location: string;
    locationType: 'link' | 'text' | 'suggestions';
    visibility: 'all-friends' | string;
    description: string;
}

// Interface for tracking form validation errors
interface FormErrors {
    title?: string;
    date?: string;
    time?: string;
    location?: string;
    description?: string;
}

export function CreateEventModal({ isOpen, onClose, onCreate, groups, discoverEventLink, eventToEdit, initialDate }: CreateEventModalProps) {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState(discoverEventLink || '');
    const [locationType, setLocationType] = useState<'link' | 'text' | 'suggestions'>(
        discoverEventLink ? 'link' : 'text'
    );
    const [visibility, setVisibility] = useState<'all-friends' | string>('all-friends');
    const [description, setDescription] = useState('');

    const [errors, setErrors] = useState<FormErrors>({});
    const isEditing = !!eventToEdit;

    useEffect(() => {
        if (isOpen) {
            setErrors({});
            if (eventToEdit) {
                setTitle(eventToEdit.title);
                setDate(eventToEdit.date);
                setTime(eventToEdit.time);
                setLocation(eventToEdit.location);
                setLocationType(eventToEdit.locationType);
                setVisibility(eventToEdit.visibility);
                setDescription(eventToEdit.description);
            } else {
                setTitle('');
                setDate(initialDate || '');
                setTime('');
                setLocation(discoverEventLink || '');
                setLocationType(discoverEventLink ? 'link' : 'text');
                setVisibility('all-friends');
                setDescription('');
            }
        }
    }, [eventToEdit, isOpen, discoverEventLink, initialDate]);

    if (!isOpen) return null;

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;

        if (!title.trim()) {
            newErrors.title = 'Event title is required';
            isValid = false;
        } else if (title.length > 50) {
            newErrors.title = 'Title must be 50 characters or less';
            isValid = false;
        }

        if (!date) {
            newErrors.date = 'Date is required';
            isValid = false;
        } else {
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                newErrors.date = 'Date cannot be in the past';
                isValid = false;
            }
        }

        if (!time) {
            newErrors.time = 'Time is required';
            isValid = false;
        }

        if (locationType === 'text' && !location.trim()) {
            newErrors.location = 'Location is required';
            isValid = false;
        } else if (locationType === 'link') {
            const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            if (!location.trim()) {
                newErrors.location = 'A link is required';
                isValid = false;
            } else if (!urlPattern.test(location)) {
                newErrors.location = 'Please enter a valid URL';
                isValid = false;
            }
        }

        if (description.length > 500) {
            newErrors.description = 'Description must be 500 characters or less';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleCreate = () => {
        if (validateForm()) {
            onCreate({
                title,
                date,
                time,
                location: locationType === 'suggestions' ? '' : location,
                locationType,
                visibility,
                description,
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-semibold text-gray-900">{isEditing ? 'Edit Event' : 'Create Event'}</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-gray-600" /></button>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="text-sm font-semibold text-gray-900 mb-2 block">Event Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors({ ...errors, title: undefined }); }}
                                placeholder="Enter event title..."
                                className={`w-full bg-gray-50 rounded-xl px-4 py-3 border outline-none transition-colors ${errors.title ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-gray-900'}`}
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.title}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-900 mb-2 block flex items-center gap-2"><Calendar className="w-4 h-4" />Date *</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => { setDate(e.target.value); if (errors.date) setErrors({ ...errors, date: undefined }); }}
                                    className={`w-full bg-gray-50 rounded-xl px-4 py-3 border outline-none transition-colors ${errors.date ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-gray-900'}`}
                                />
                                {errors.date && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.date}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-900 mb-2 block flex items-center gap-2"><Clock className="w-4 h-4" />Time *</label>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => { setTime(e.target.value); if (errors.time) setErrors({ ...errors, time: undefined }); }}
                                    className={`w-full bg-gray-50 rounded-xl px-4 py-3 border outline-none transition-colors ${errors.time ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-gray-900'}`}
                                />
                                {errors.time && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.time}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-900 mb-2 block flex items-center gap-2"><MapPin className="w-4 h-4" />Location</label>
                            <div className="flex gap-2 mb-3">
                                <button onClick={() => setLocationType('text')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${locationType === 'text' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}><MapPin className="w-4 h-4" />Enter Location</button>
                                <button onClick={() => setLocationType('link')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${locationType === 'link' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}><LinkIcon className="w-4 h-4" />Event Link</button>
                                <button onClick={() => setLocationType('suggestions')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${locationType === 'suggestions' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}><MessageSquare className="w-4 h-4" />Let Others Suggest</button>
                            </div>

                            {locationType !== 'suggestions' && (
                                <div>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => { setLocation(e.target.value); if (errors.location) setErrors({ ...errors, location: undefined }); }}
                                        placeholder={locationType === 'link' ? 'Paste event link from Discover...' : 'Enter location...'}
                                        className={`w-full bg-gray-50 rounded-xl px-4 py-3 border outline-none transition-colors ${errors.location ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-gray-900'}`}
                                    />
                                    {errors.location && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.location}</p>}
                                </div>
                            )}
                            {locationType === 'suggestions' && <div className="bg-purple-50 rounded-xl p-4 text-sm text-purple-900">Friends will be able to suggest locations for this event</div>}
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-900 mb-2 block flex items-center gap-2"><Users className="w-4 h-4" />Who Can See This Event *</label>
                            <select value={visibility} onChange={(e) => setVisibility(e.target.value)} className="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus:border-gray-900 outline-none transition-colors">
                                <option value="all-friends">All Friends</option>
                                {groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-900">Description</label>
                                <span className={`text-xs ${description.length > 500 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>{description.length}/500</span>
                            </div>
                            <textarea
                                value={description}
                                onChange={(e) => { setDescription(e.target.value); if (errors.description) setErrors({ ...errors, description: undefined }); }}
                                placeholder="Add event details..."
                                className={`w-full bg-gray-50 rounded-xl px-4 py-3 border outline-none transition-colors resize-none h-24 ${errors.description ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-gray-900'}`}
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.description}</p>}
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button onClick={onClose} className="flex-1 py-3 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
                        <button onClick={handleCreate} className="flex-1 py-3 rounded-xl font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors">{isEditing ? 'Save Changes' : 'Create Event'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}