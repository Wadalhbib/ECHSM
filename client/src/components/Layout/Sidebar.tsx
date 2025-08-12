import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Calendar,
  FileText,
  MessageCircle,
  Users,
  BarChart3,
  Settings,
  MapPin,
  AlertTriangle,
  Stethoscope,
  Shield,
  Activity
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const sidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/patient/dashboard',
    icon: BarChart3,
    roles: [UserRole.PATIENT],
  },
  {
    name: 'Appointments',
    href: '/patient/appointments',
    icon: Calendar,
    roles: [UserRole.PATIENT],
  },
  {
    name: 'Medical Records',
    href: '/patient/records',
    icon: FileText,
    roles: [UserRole.PATIENT],
  },
  {
    name: 'AI Health Assistant',
    href: '/patient/chatbot',
    icon: MessageCircle,
    roles: [UserRole.PATIENT],
  },
  {
    name: 'Mobile Clinics',
    href: '/patient/mobile-clinics',
    icon: MapPin,
    roles: [UserRole.PATIENT],
  },
  {
    name: 'Emergency Services',
    href: '/patient/emergency',
    icon: AlertTriangle,
    roles: [UserRole.PATIENT],
  },
  // Provider routes
  {
    name: 'Dashboard',
    href: '/provider/dashboard',
    icon: Activity,
    roles: [UserRole.DOCTOR, UserRole.NURSE],
  },
  {
    name: 'Patients',
    href: '/provider/patients',
    icon: Users,
    roles: [UserRole.DOCTOR, UserRole.NURSE],
  },
  {
    name: 'Appointments',
    href: '/provider/appointments',
    icon: Calendar,
    roles: [UserRole.DOCTOR, UserRole.NURSE],
  },
  {
    name: 'Medical Records',
    href: '/provider/records',
    icon: FileText,
    roles: [UserRole.DOCTOR, UserRole.NURSE],
  },
  {
    name: 'Consultations',
    href: '/provider/consultations',
    icon: Stethoscope,
    roles: [UserRole.DOCTOR],
  },
  // Admin routes
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: BarChart3,
    roles: [UserRole.ADMIN],
  },
  {
    name: 'User Management',
    href: '/admin/users',
    icon: Users,
    roles: [UserRole.ADMIN],
  },
  {
    name: 'System Analytics',
    href: '/admin/analytics',
    icon: Activity,
    roles: [UserRole.ADMIN],
  },
  {
    name: 'Mobile Clinics',
    href: '/admin/mobile-clinics',
    icon: MapPin,
    roles: [UserRole.ADMIN],
  },
  {
    name: 'Emergency Services',
    href: '/admin/emergency',
    icon: AlertTriangle,
    roles: [UserRole.ADMIN],
  },
  {
    name: 'System Settings',
    href: '/admin/settings',
    icon: Settings,
    roles: [UserRole.ADMIN],
  },
  {
    name: 'Security & Audit',
    href: '/admin/security',
    icon: Shield,
    roles: [UserRole.ADMIN],
  },
];

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const { user } = useAuthStore();

  const filteredItems = sidebarItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {filteredItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive
                      ? 'bg-primary-100 border-primary-500 text-primary-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium border-l-4 transition-colors`}
                >
                  <item.icon
                    className={`${
                      isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 h-6 w-6 transition-colors`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;