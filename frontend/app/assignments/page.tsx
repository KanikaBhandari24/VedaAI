'use client';
import { useEffect, useState } from 'react';
import { useAssignmentStore } from '@/store/assignmentStore';
import AssignmentCard from '@/components/AssignmentCard';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Search, Filter } from 'lucide-react';

export default function AssignmentsPage() {
  const { assignments, fetchAssignments, isLoading } = useAssignmentStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const filtered = assignments.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar assignmentCount={assignments.length} />
      <main className="flex-1 flex flex-col">
        <Navbar title="Assignment" />
        <div className="p-6 flex-1">

          {/* Title */}
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
            <h1 className="text-xl font-bold text-gray-900">Assignments</h1>
          </div>
          <p className="text-sm text-gray-500 mb-5 ml-4">
            Manage and create assignments for your classes.
          </p>

          {/* Filter + Search */}
          <div className="flex items-center gap-3 mb-5">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 shadow-sm">
              <Filter size={14} /> Filter By
            </button>
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Assignment"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white shadow-sm"
              />
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
              Loading...
            </div>
          ) : assignments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-semibold text-gray-900 mb-1">No assignments yet</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-sm">
                Create your first assignment to start collecting and grading student submissions.
              </p>
              <Link
                href="/assignments/create"
                className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition"
              >
                + Create Your First Assignment
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {filtered.map((a) => (
                <AssignmentCard key={a._id} assignment={a} />
              ))}
            </div>
          )}
        </div>

        {assignments.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
            <Link
              href="/assignments/create"
              className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition shadow-lg"
            >
              + Create Assignment
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}