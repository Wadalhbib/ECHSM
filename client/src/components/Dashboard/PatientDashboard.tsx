import React from 'react';
import {
  Calendar,
  FileText,
  MessageCircle,
  MapPin,
  AlertTriangle,
  Heart,
  Clock,
  TrendingUp,
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';

const PatientDashboard: React.FC = () => {
  const { user } = useAuthStore();

  const stats = [
    {
      title: 'Upcoming Appointments',
      value: '3',
      icon: Calendar,
      color: 'bg-primary-500',
      change: '+2 this week',
    },
    {
      title: 'Health Records',
      value: '12',
      icon: FileText,
      color: 'bg-secondary-500',
      change: '2 new entries',
    },
    {
      title: 'AI Consultations',
      value: '8',
      icon: MessageCircle,
      color: 'bg-accent-500',
      change: '3 this month',
    },
    {
      title: 'Health Score',
      value: '85%',
      icon: Heart,
      color: 'bg-success-500',
      change: '+5% improved',
    },
  ];

  const quickActions = [
    {
      title: 'Book Appointment',
      description: 'Schedule a consultation with our healthcare providers',
      icon: Calendar,
      href: '/patient/appointments',
      color: 'bg-primary-50 text-primary-600 border-primary-200',
    },
    {
      title: 'AI Health Assistant',
      description: 'Get instant symptom analysis and health guidance',
      icon: MessageCircle,
      href: '/patient/chatbot',
      color: 'bg-accent-50 text-accent-600 border-accent-200',
    },
    {
      title: 'Find Mobile Clinic',
      description: 'Locate nearest mobile health services',
      icon: MapPin,
      href: '/patient/mobile-clinics',
      color: 'bg-secondary-50 text-secondary-600 border-secondary-200',
    },
    {
      title: 'Emergency Services',
      description: 'Request immediate medical assistance',
      icon: AlertTriangle,
      href: '/patient/emergency',
      color: 'bg-error-50 text-error-600 border-error-200',
    },
  ];

  const recentAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'confirmed',
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'General Practice',
      date: '2024-01-18',
      time: '2:30 PM',
      status: 'scheduled',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-primary-100 mt-2">
              Your health is our priority. Here's your dashboard overview.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-success-600 mt-1 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.change}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={action.href}
                className={`block p-6 rounded-xl border-2 border-dashed hover:shadow-lg transition-all duration-200 ${action.color} hover:scale-105`}
              >
                <action.icon className="h-8 w-8 mb-4" />
                <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                <p className="text-sm opacity-80">{action.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
            <Link to="/patient/appointments" className="text-primary-600 hover:text-primary-700 font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{appointment.doctor}</h4>
                  <p className="text-sm text-gray-600">{appointment.specialty}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {appointment.date} at {appointment.time}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    appointment.status === 'confirmed'
                      ? 'bg-success-100 text-success-800'
                      : 'bg-warning-100 text-warning-800'
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Health Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Health Insights</h3>
            <Link to="/patient/records" className="text-primary-600 hover:text-primary-700 font-medium">
              View details
            </Link>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-success-50 rounded-lg border border-success-200">
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-success-600" />
                <div>
                  <p className="font-medium text-success-900">Great Progress!</p>
                  <p className="text-sm text-success-700">Your health metrics have improved by 5% this month</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-warning-50 rounded-lg border border-warning-200">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-warning-600" />
                <div>
                  <p className="font-medium text-warning-900">Reminder</p>
                  <p className="text-sm text-warning-700">Don't forget to take your medication today</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientDashboard;