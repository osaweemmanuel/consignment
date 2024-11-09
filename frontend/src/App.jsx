// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes,useLocation } from 'react-router-dom';
// import './App.css';
// import Preloader from './components/Preloader.jsx';
// import Home from './components/page/Home.jsx';
// import ParcelDetail from './components/page/ParcelDetail.jsx';
// import RegisterPage from './components/page/RegisterPage.jsx';
// import LoginPage from './components/page/LoginPage.jsx';
// import MainLayout from './components/MainLayout.jsx';
// import DashboardLayout from './components/admin/DashboardLayout.jsx';
// import Dashboard from './components/admin/Dashboard.jsx';
// import ProtectedRoute from './components/page/ProtectedRoute.jsx';
// import ViewParcel from './components/admin/ViewParcel.jsx';
// import NotFound from './components/page/NotFound.jsx';
// import Wallet from './components/admin/Wallet.jsx';
// import UpdateParcelModal from './components/admin/UpdateParcelModal.jsx';
// import { Receipt } from '@mui/icons-material';
// import ChangePassword from './components/admin/ChangePassword.jsx';


// function App() {
//     const [loading, setLoading] = useState(true);
//     const location=useLocation();

//     useEffect(() => {
//         const timeout = setTimeout(() => {
//             setLoading(false);
//         }, 3000);

//         return () => clearTimeout(timeout);
//     }, [location]);

//     return (
//         <Router>
//             {loading ? (
//                 <Preloader />
//             ) : (
//                 <Routes>
//                     {/* Public Routes */}
//                     <Route path="/" element={<MainLayout />}>
//                         <Route index={true} element={<Home />} />
//                         <Route path="/register" element={<RegisterPage />} />
//                         <Route path="/login" element={<LoginPage />} />
//                         <Route path="/parcels/:trackingNumber" element={<ParcelDetail />} />
//                     </Route>

//                     {/* Admin Protected Routes */}
//                         <Route path="/admin" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
//                             <Route index element={<Dashboard />} /> // Default route for /admin
//                             <Route path="dashboard" element={<Dashboard />} /> // Route for /admin/dashboard
//                             <Route path='/admin/parcel_view' element={<ViewParcel />} />
//                             <Route path='/admin/parcel_update' element={<UpdateParcelModal/>}/>
//                             <Route path="wallet" element={<Wallet/>}/>
//                             <Route path='receipt' element={<Receipt/>}/>
//                             <Route path="change-password" element={<ChangePassword/>}/>
                          
//                         </Route>

//                     {/* Fallback for NotFound */}
//                     <Route path="*" element={<NotFound />} />
//                 </Routes>
//             )}
//         </Router>
//     );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Preloader from './components/Preloader.jsx';
import Home from './components/page/Home.jsx';
import ParcelDetail from './components/page/ParcelDetail.jsx';
import RegisterPage from './components/page/RegisterPage.jsx';
import LoginPage from './components/page/LoginPage.jsx';
import MainLayout from './components/MainLayout.jsx';
import DashboardLayout from './components/admin/DashboardLayout.jsx';
import Dashboard from './components/admin/Dashboard.jsx';
import ProtectedRoute from './components/page/ProtectedRoute.jsx';
import ViewParcel from './components/admin/ViewParcel.jsx';
import NotFound from './components/page/NotFound.jsx';
import Wallet from './components/admin/Wallet.jsx';
import UpdateParcelModal from './components/admin/UpdateParcelModal.jsx';
import ChangePassword from './components/admin/ChangePassword.jsx';
import ReceiptPage from './components/admin/receiptPage.jsx';
import ViewReceipt from './components/admin/ViewReceipt.jsx';
import UpdateReceiptModal from './components/admin/UpdateReceiptModal.jsx';

function AppContent() {
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        setLoading(true); // Set loading to true when the route changes
        const timeout = setTimeout(() => {
            setLoading(false); // Set loading to false after a delay
        }, 1000); // Change duration as needed

        return () => clearTimeout(timeout);
    }, [location]);

    return (
        <>
            {loading ? (
                <Preloader />
            ) : (
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<MainLayout />}>
                        <Route index={true} element={<Home />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/parcels/:trackingNumber" element={<ParcelDetail />} />
                    </Route>

                    {/* Admin Protected Routes */}
                    <Route path="/admin" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                        <Route index element={<Dashboard />} /> {/* Default route for /admin */}
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path='/admin/parcel_view' element={<ViewParcel />} />
                        <Route path='/admin/parcel_update' element={<UpdateParcelModal />} />
                        <Route path="/admin/review_receipt" element={<ViewReceipt/>}/>
                        <Route path="/admin/receipt_update" element={<UpdateReceiptModal/>}/>
                        <Route path="wallet" element={<Wallet />} />
                        <Route path='receipt' element={<ReceiptPage />} />
                        <Route path="change-password" element={<ChangePassword />} />
                    </Route>

                    {/* Fallback for NotFound */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            )}
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
