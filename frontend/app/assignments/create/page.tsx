import CreateAssignmentForm from '@/components/CreateAssignmentForm';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function CreateAssignmentPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Navbar title="Assignment" />
        <div className="p-6 flex-1">
          <CreateAssignmentForm />
        </div>
      </main>
    </div>
  );
}