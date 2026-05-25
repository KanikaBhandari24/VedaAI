'use client';
import { Assignment } from '@/types';
import { useRouter } from 'next/navigation';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { deleteAssignment } from '@/lib/api';

export default function AssignmentCard({ assignment }: { assignment: Assignment }) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm('Are you sure you want to delete this assignment?');
    if (!confirmed) return;
    try {
      await deleteAssignment(assignment._id);
      window.location.reload();
    } catch {
      alert('Failed to delete assignment');
    }
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition cursor-pointer relative flex flex-col justify-between min-h-[120px]"
      onClick={() => router.push(`/assignments/${assignment._id}`)}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <h3 className="font-bold text-gray-900 text-base">{assignment.title}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1 hover:bg-gray-100 rounded ml-2 flex-shrink-0"
        >
          <MoreVertical size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Bottom row */}
      <div className="flex items-center gap-6 text-xs text-gray-500 mt-4">
        <span>
          <span className="font-semibold text-gray-700">Assigned on</span> :{' '}
          {new Date(assignment.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}
        </span>
        <span>
          <span className="font-semibold text-gray-700">Due</span> :{' '}
          {new Date(assignment.dueDate).toLocaleDateString('en-GB').replace(/\//g, '-')}
        </span>
      </div>

      {showMenu && (
        <div className="absolute right-4 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-[140px]">
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/assignments/${assignment._id}`);
            }}
          >
            View Assignment
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}