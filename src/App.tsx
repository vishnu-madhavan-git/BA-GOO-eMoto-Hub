import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NewPage from "./pages/NewPage";
import UsedPage from "./pages/UsedPage";
import CertifiedPage from "./pages/CertifiedPage";
import ModLabPage from "./pages/ModLabPage";
import TradeInPage from "./pages/TradeInPage";
import ServicePage from "./pages/ServicePage";
import RoutesPage from "./pages/RoutesPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import BuildSheetPage from "./pages/BuildSheetPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/new" element={<NewPage />} />
          <Route path="/used" element={<UsedPage />} />
          <Route path="/certified" element={<CertifiedPage />} />
          <Route path="/mod-lab" element={<ModLabPage />} />
          <Route path="/trade-in" element={<TradeInPage />} />
          <Route path="/service" element={<ServicePage />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/product/:id/build-sheet" element={<BuildSheetPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
