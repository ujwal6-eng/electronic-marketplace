import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Profile from "./pages/Profile";
import Marketplace from "./pages/Marketplace";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Services from "./pages/Services";
import ServiceBooking from "./pages/ServiceBooking";
import TechnicianProfile from "./pages/TechnicianProfile";
import ProfileEdit from "./pages/ProfileEdit";
import Orders from "./pages/Orders";
import SellerDashboard from "./pages/SellerDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Forum from "./pages/Forum";
import ForumCategory from "./pages/ForumCategory";
import ForumPost from "./pages/ForumPost";
import ForumCreate from "./pages/ForumCreate";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
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
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
