import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import GlobalErrorBoundary from './components/GlobalErrorBoundary.jsx';

// Direct imports to eliminate lazy-loading conflicts during the emergency phase
import Home from './components/page/Home.jsx';
import About from './components/page/About.jsx';
import Service from './components/page/Service.jsx';
import Contact from './components/page/Contact.jsx';
import MainLayout from './components/MainLayout.jsx';
import NotFound from './components/page/NotFound.jsx';
import LoginPage from './components/page/LoginPage.jsx';
import RegisterPage from './components/page/RegisterPage.jsx';
import ParcelDetail from './components/page/ParcelDetail.jsx';
import Preloader from './components/Preloader.jsx';
import PageTransition from './components/PageTransition.jsx';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Admin imports
import DashboardLayout from './components/admin/DashboardLayout.jsx';
import Dashboard from './components/admin/Dashboard.jsx';
import ViewParcel from './components/admin/ViewParcel.jsx';
import ActivityLogs from './components/admin/ActivityLogs.jsx';
import Wallet from './components/admin/Wallet.jsx';
import ChangePassword from './components/admin/ChangePassword.jsx';
import ReceiptPage from './components/admin/receiptPage.jsx';
import UpdateParcelForm from './components/admin/UpdateParcelModal.jsx';

function AppContent() {
    const location = useLocation();
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // Global visual preloader sequence
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2400);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-blue-50 w-full min-h-screen relative overflow-x-hidden">
            {/* Massive Global Startup Preloader */}
            <AnimatePresence mode="wait">
                {isLoading && <Preloader key="global-preloader" />}
            </AnimatePresence>

            {!isLoading && (
              <AnimatePresence mode="wait">
                <PageTransition key={location.pathname}>
                  <Routes location={location}>
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="service" element={<Service />} />
                    <Route path="contact" element={<Contact />} />
                </Route>

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/parcels/:trackingNumber" element={<ParcelDetail />} />

                <Route path="/admin" element={<DashboardLayout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="parcel_view" element={<ViewParcel />} />
                    <Route path="activity-logs" element={<ActivityLogs />} />
                    <Route path="wallet" element={<Wallet />} />
                    <Route path="receipt" element={<ReceiptPage />} />
                    <Route path="parcel_update" element={<UpdateParcelForm />} />
                    <Route path="change-password" element={<ChangePassword />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
             </PageTransition>
          </AnimatePresence>
        )}
      </div>
    );
}

function App() {
    return (
        <Router>
            <GlobalErrorBoundary>
                <AppContent />
            </GlobalErrorBoundary>
        </Router>
    );
}

export default App;
