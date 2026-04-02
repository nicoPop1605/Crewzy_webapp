import { MoreVertical,  LogOut, Trash2, UserPlus } from 'lucide-react';
import { useState } from 'react';

export interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  isAdmin: boolean;
  avatars: string[];
}

interface GroupCardProps {
  group: Group;
  onLeave: (id: string) => void;
  onDelete: (id: string) => void;
  onManageMembers: (group: Group) => void;
}

export function GroupCard({ group, onLeave, onDelete, onManageMembers }: GroupCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-gray-900">{group.name}</h3>
            {group.isAdmin && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                Admin
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl z-20 py-2">
                {group.isAdmin && (
                  <>
                    <button
                      onClick={() => {
                        onManageMembers(group);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Manage Members
                    </button>
                    <button
                      onClick={() => {
                        onDelete(group.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Group
                    </button>
                  </>
                )}
                {!group.isAdmin && (
                  <button
                    onClick={() => {
                      onLeave(group.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Leave Group
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Members */}
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {group.avatars.slice(0, 4).map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt="Member"
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
          ))}
          {group.members > 4 && (
            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
              +{group.members - 4}
            </div>
          )}
        </div>
        <span className="text-sm text-gray-600">{group.members} members</span>
      </div>
    </div>
  );
}
