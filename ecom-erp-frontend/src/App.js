import React from 'react';
// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
// Add this early in your app to catch errors
import { DataGrid as OriginalDataGrid } from '@mui/x-data-grid';
// Layouts

// Auth Context + Protected Route
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
// Monkey patch for debugging
const DataGrid = (props) => {
  React.useEffect(() => {
    if (props.rows && props.rows.length > 0) {
      const firstRow = props.rows[0];
      if (!firstRow.id && !firstRow._id) {
        console.error('⚠️ DATA GRID ERROR: Row without id found!');
        console.error('Component props:', props);
        console.error('Problematic row:', firstRow);

        // Log the component stack trace
        console.trace('Component stack:');
      }
    }
  }, [props.rows]);

  return (
    <OriginalDataGrid
      {...props}
      getRowId={(row) => row._id || row.id || Math.random().toString(36).substr(2, 9)}
    />
  );
};

// Replace the original DataGrid
window.DataGrid = DataGrid;

// Lazy-loaded pages (improves performance)


// User pages
const Layout = lazy(() => import('./components/customer/layout/Layout'));
const Home = lazy(() => import('./pages/Home'));
const Cart = lazy(() => import('./pages/Cart'));
const Product = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./components/customer/products/ProductDetail'));
// Auth pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

//admin
const DashboardLayout = lazy(() => import('./components/admin/DashboardLayout'));
const DashboardHome = lazy(() => import('./components/admin/dashboard/DashboardHome'));
const ProductsManager = lazy(() => import('./components/admin/ecommerce/ProductsManager'));
const OrdersManager = lazy(() => import('./components/admin/ecommerce/OrdersManager'));
const CustomersManager = lazy(() => import('./components/admin/ecommerce/CustomersManager'));
const InventoryManager = lazy(() => import('./components/admin/erp/InventoryManager'));
const SuppliersManager = lazy(() => import('./components/admin/erp/SuppliersManager'));
const ProcurementManager = lazy(() => import('./components/admin/erp/ProcurementManager'));
const SalesReports = lazy(() => import('./components/admin/reports/SalesReports'));
const InventoryReports = lazy(() => import('./components/admin/reports/InventoryReports'));
const FinancialReports = lazy(() => import('./components/admin/reports/FinancialReports'));
const SettingsPanel = lazy(() => import('./components/admin/system/SettingsPanel'));
const UserManagement = lazy(() => import('./components/admin/system/UserManagement'));
const AuditLogs = lazy(() => import('./components/admin/system/AuditLogs'));
const Profile = lazy(() => import('./pages/Profile'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const Checkout = lazy(() => import('./pages/Checkout'));
function App() {
  return (
    <AuthProvider>
      <CartProvider>

        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* Public / User routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Product />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Admin nested routes */}
              <Route path="/admin" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="products" element={<ProductsManager />} />
                <Route path="orders" element={<OrdersManager />} />
                <Route path="customers" element={<CustomersManager />} />
                <Route path="inventory" element={<InventoryManager />} />
                <Route path="suppliers" element={<SuppliersManager />} />
                <Route path="procurement" element={<ProcurementManager />} />
                <Route path="reports/sales" element={<SalesReports />} />
                <Route path="reports/inventory" element={<InventoryReports />} />
                <Route path="reports/financial" element={<FinancialReports />} />
                <Route path="settings" element={<SettingsPanel />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="audit-logs" element={<AuditLogs />} />
              </Route>


              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
