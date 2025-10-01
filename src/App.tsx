import { Provider } from 'react-redux';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { createBrowserHistory } from 'history';
import { store } from "./store/store";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { FullPageLoader } from "./components/ui/loading-spinner";
import Login from "./pages/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Clients from "./pages/Clients";
import Plans from "./pages/Plans";
import Support from "./pages/Support";
import Invoices from "./pages/Invoices";
import Portfolio from "./pages/Portfolio";
import Reviews from "./pages/Reviews";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ClientProfile from "./pages/ClientProfile";

const queryClient = new QueryClient();

// Create a custom history object
const history = createBrowserHistory();

const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter {...routerConfig}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/users" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Users />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/clients" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Clients />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/clients/:clientId" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ClientProfile />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/plans" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Plans />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/support" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Support />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/invoices" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Invoices />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/portfolio" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Portfolio />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/reviews" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Reviews />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/settings" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
