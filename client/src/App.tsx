import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import PatientDashboard from './components/Dashboard/PatientDashboard';
import ChatInterface from './components/Chatbot/ChatInterface';
import { useAuthStore } from './store/authStore';
import { UserRole } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRoles: UserRole[];
}> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public routes */}
              <Route 
                index 
                element={
                  isAuthenticated ? (
                    <Navigate to="/patient/dashboard" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                } 
              />
              <Route path="login" element={<LoginForm />} />
              <Route path="register" element={<RegisterForm />} />

              {/* Patient routes */}
              <Route 
                path="patient/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.PATIENT]}>
                    <PatientDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="patient/chatbot" 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.PATIENT]}>
                    <div>
                      <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">AI Health Assistant</h1>
                        <p className="text-gray-600 mt-2">
                          Get instant symptom analysis and health guidance powered by AI
                        </p>
                      </div>
                      <ChatInterface />
                    </div>
                  </ProtectedRoute>
                } 
              />

              {/* Placeholder routes for development */}
              <Route 
                path="patient/*" 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.PATIENT]}>
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-bold text-gray-900">Coming Soon</h2>
                      <p className="text-gray-600 mt-2">This feature is under development</p>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="provider/*" 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.DOCTOR, UserRole.NURSE]}>
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-bold text-gray-900">Provider Dashboard</h2>
                      <p className="text-gray-600 mt-2">Healthcare provider features coming soon</p>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="admin/*" 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
                      <p className="text-gray-600 mt-2">Administrative features coming soon</p>
                    </div>
                  </ProtectedRoute>
                } 
              />

              {/* Error routes */}
              <Route 
                path="unauthorized" 
                element={
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-error-600">Unauthorized</h2>
                    <p className="text-gray-600 mt-2">You don't have permission to access this page</p>
                  </div>
                } 
              />
              
              <Route 
                path="*" 
                element={
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
                    <p className="text-gray-600 mt-2">The page you're looking for doesn't exist</p>
                  </div>
                } 
              />
            </Route>
          </Routes>
        </div>
      </Router>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
};

export default App;