'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TeacherSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed?: boolean;
}

export default function TeacherSidebar({ isOpen, onToggle, isCollapsed = false }: TeacherSidebarProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/teacher/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
        </svg>
      )
    },
    {
      id: 'courses',
      label: 'CRUD Course',
      href: '/teacher/courses',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    }
  ];

  // Determine sidebar width - mobile always full width, desktop responsive to collapsed state
  const sidebarWidth = isMobile ? '280px' : (isCollapsed ? '80px' : '280px');
  // On mobile, collapsed state should be ignored for proper UX
  const shouldShowCollapsed = !isMobile && isCollapsed;

  return (
    <>
      {/* Sidebar Overlay - Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-30 h-full bg-white shadow-xl transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0`}
        style={{ width: sidebarWidth }}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className={`flex items-center ${shouldShowCollapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-gray-200`}>
            <Link href="/teacher/dashboard" className={`flex items-center ${shouldShowCollapsed ? 'justify-center' : 'space-x-2'}`}>
              <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              {!shouldShowCollapsed && (
                <span className="text-xl font-bold text-[var(--color-text-dark-primary)]">
                  MentorIT
                </span>
              )}
            </Link>
            
            {/* Mobile close button - Always show on mobile, hide only on desktop when collapsed */}
            {(!shouldShowCollapsed || isMobile) && (
              <button
                onClick={onToggle}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <div key={item.id} className="relative group">
                    <Link
                      href={item.href}
                      onClick={() => {
                        // Close mobile menu on navigation
                        if (isMobile) {
                          onToggle();
                        }
                      }}
                      className={`flex items-center ${shouldShowCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'text-[var(--color-text-dark-secondary)] hover:bg-gray-50 hover:text-[var(--color-text-dark-primary)]'
                      }`}
                      title={shouldShowCollapsed ? item.label : undefined}
                    >
                      <span className={`${isActive ? 'text-white' : 'text-gray-400'} flex-shrink-0`}>
                        {item.icon}
                      </span>
                      {!shouldShowCollapsed && <span>{item.label}</span>}
                    </Link>

                    {/* Tooltip for collapsed state - only on desktop */}
                    {shouldShowCollapsed && (
                      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                        {item.label}
                        <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}