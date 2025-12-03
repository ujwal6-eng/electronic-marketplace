import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

// Eager load critical pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Lazy load non-critical pages for code splitting
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Services = lazy(() => import("./pages/Services"));
const ServiceBooking = lazy(() => import("./pages/ServiceBooking"));
const TechnicianProfile = lazy(() => import("./pages/TechnicianProfile"));
const ProfileEdit = lazy(() => import("./pages/ProfileEdit"));
const Orders = lazy(() => import("./pages/Orders"));
const SellerDashboard = lazy(() => import("./pages/SellerDashboard"));
const TechnicianDashboard = lazy(() => import("./pages/TechnicianDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Forum = lazy(() => import("./pages/Forum"));
const ForumCategory = lazy(() => import("./pages/ForumCategory"));
const ForumPost = lazy(() => import("./pages/ForumPost"));
const ForumCreate = lazy(() => import("./pages/ForumCreate"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const ReturnsRefunds = lazy(() => import("./pages/ReturnsRefunds"));
const ShippingInfo = lazy(() => import("./pages/ShippingInfo"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <AuthProvider>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/services/book/:category" element={<ServiceBooking />} />
                  <Route path="/technician/:id" element={<TechnicianProfile />} />
                  <Route path="/forum" element={<Forum />} />
                  <Route path="/forum/category/:category" element={<ForumCategory />} />
                  <Route path="/forum/post/:id" element={<ForumPost />} />
                  <Route path="/forum/create" element={<ForumCreate />} />
                  <Route path="/profile/edit" element={<ProfileEdit />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/seller/dashboard" element={<SellerDashboard />} />
                  <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/help-center" element={<HelpCenter />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                  <Route path="/returns-refunds" element={<ReturnsRefunds />} />
                  <Route path="/shipping-info" element={<ShippingInfo />} />
                  <Route path="/terms-conditions" element={<TermsConditions />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
