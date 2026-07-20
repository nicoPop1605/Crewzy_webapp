import { X, Search, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface AddFriendModalProps {
    isOpen: boolean;
    onClose: () => void;
    // IMPORTANT: onAdd trebuie să returneze un Promise pentru a prinde eroarea de la backend
    onAdd: (username: string) => Promise<void>;
}

export function AddFriendModal({ isOpen, onClose, onAdd }: AddFriendModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    // Curățăm erorile și input-ul la închidere
    const handleClose = () => {
        setSearchQuery('');
        setError('');
        onClose();
    };

    const handleAdd = async () => {
        if (!searchQuery.trim()) {
            setError('Introdu un nume sau email valid.');
            return;
        }

        setIsLoading(true);
        setError(''); // Resetăm eroarea anterioară

        try {
            // Așteptăm ca părintele (FriendsPage) să comunice cu baza de date
            await onAdd(searchQuery.trim());

            // Dacă a reușit (nu a dat eroare), închidem modalul
            handleClose();
        } catch (err: any) {
            // Dacă backend-ul a zis "Utilizatorul nu există!", o prindem aici
            setError(err.message || 'Eroare la adăugarea prietenului.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleClose}>
            <div
                className="bg-white rounded-3xl max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Add Friend</h2>
                        <button
                            onClick={handleClose}
                            disabled={isLoading}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Search Input cu Error State */}
                    <div className="mb-2">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Username or Email
                        </label>
                        <div className={`flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border transition-colors ${error ? 'border-red-500 focus-within:border-red-600' : 'border-gray-200 focus-within:border-gray-900'
                            }`}
                        >
                            <Search className={`w-5 h-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    if (error) setError(''); // Ascundem eroarea când utilizatorul începe să scrie din nou
                                }}
                                placeholder="Enter username or email..."
                                className="flex-1 bg-transparent outline-none text-sm"
                                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Mesaj de eroare roșu */}
                    <div className="h-5 mb-4">
                        {error && (
                            <div className="flex items-center gap-1.5 mt-1 text-red-500 text-xs font-medium">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1 py-3 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            disabled={isLoading}
                            className="flex-1 py-3 rounded-xl font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <UserPlus className="w-4 h-4" />
                            )}
                            {isLoading ? 'Searching...' : 'Add Friend'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}