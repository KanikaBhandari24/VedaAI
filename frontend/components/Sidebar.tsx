'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, FileText, Wrench, Clock, Settings } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'My Groups', href: '/groups', icon: Users },
  { label: 'Assignments', href: '/assignments', icon: FileText },
  { label: "AI Teacher's Toolkit", href: '/toolkit', icon: Wrench },
  { label: 'My Library', href: '/library', icon: Clock },
];

export default function Sidebar({ assignmentCount = 0 }: { assignmentCount?: number }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-300 flex flex-col shadow-xl rounded-2xl m-2 sticky top-6 h-[calc(100vh-50px)]">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="font-bold text-[28px] text-gray-900">VedaAI</span>
        </div>
      </div>

      {/* Create Button - with orange border like Figma */}
      <div className="px-4 pb-5">
        <Link
          href="/assignments/create"
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-full text-sm font-medium w-full justify-center hover:bg-gray-800 transition border-3 border-orange-500 mt-8"
        >
          <span>✦</span> Create Assignment
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition ${
                isActive
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={16} />
              <span className="flex-1">{label}</span>
              {label === 'Assignments' && assignmentCount > 0 && (
                <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[22px] text-center font-medium">
                  {assignmentCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="px-3 pb-2">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
        >
          <Settings size={16} />
          Settings
        </Link>
      </div>

      {/* Footer - School */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
            <span className="text-orange-600 font-bold text-sm">D</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Delhi Public School</p>
            <p className="text-xs text-gray-500">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </aside>
  );
}