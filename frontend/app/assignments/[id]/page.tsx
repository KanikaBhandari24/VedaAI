'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAssignment } from '@/lib/api';
import { AssignmentWithResult } from '@/types';
import QuestionPaper from '@/components/QuestionPaper';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function AssignmentOutputPage() {
  const { id } = useParams();
  const router = useRouter();
  const [assignment, setAssignment] = useState<AssignmentWithResult | null>(null);
  const [status, setStatus] = useState<string>('pending');

  useEffect(() => {
    if (!id) return;

    const ws = new WebSocket(`ws://localhost:4000?id=${id}`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStatus(data.status);
      if (data.status === 'completed') fetchAssignment();
    };

    fetchAssignment();
    return () => ws.close();
  }, [id]);

  const fetchAssignment = async () => {
    try {
      const data = await getAssignment(id as string);
      setAssignment(data);
      setStatus(data.status);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Navbar title="Create New" />
        <div className="p-6 flex-1">
          {status === 'pending' || status === 'processing' ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600 text-sm">
                {status === 'pending' ? 'Queuing your assignment...' : 'Generating your question paper...'}
              </p>
            </div>
          ) : status === 'failed' ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="text-4xl">❌</div>
              <p className="text-red-600 text-sm">Generation failed. Please try again.</p>
              <button
                onClick={() => router.push('/assignments/create')}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm hover:bg-gray-800 transition"
              >
                Try Again
              </button>
            </div>
          ) : assignment?.result ? (
            <div>
              {/* Top bar */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Your question paper for <span className="font-semibold">{assignment.title}</span> is ready!
                </p>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  ⬇ Download as PDF
                </button>
              </div>
              <QuestionPaper paper={assignment.result} />
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}