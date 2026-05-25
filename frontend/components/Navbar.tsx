import { Bell, ChevronDown } from 'lucide-react';

export default function Navbar({ title = 'Assignment' }: { title?: string }) {
  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="text-gray-400">⊞</span>
        <span className="font-medium text-gray-700">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
            J
          </div>
          <span className="text-sm font-medium text-gray-700">John Doe</span>
          <ChevronDown size={14} className="text-gray-500" />
        </div>
      </div>
    </header>
  );
}