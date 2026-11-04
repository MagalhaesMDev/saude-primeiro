import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndexPage from "./pages/Index";
import MeuSeguroPage from "./pages/MeuSeguro";
import CuidarPage from "./pages/Cuidar";
import AprenderPage from "./pages/Aprender";
import SaudeFemininaPage from "./pages/SaudeFeminina";
import LoginPage from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { FloatingSupportButton } from "@/components/layout/FloatingSupportButton";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export default function App() {
  const { isLoading } = useAuthStore();

  useEffect(() => {
    // Inicialização do auth store
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header />
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/meu-seguro" element={<MeuSeguroPage />} />
          <Route path="/cuidar" element={<CuidarPage />} />
          <Route path="/aprender" element={<AprenderPage />} />
          <Route path="/saude-feminina" element={<SaudeFemininaPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
        <FloatingSupportButton />
      </div>
    </BrowserRouter>
  );
}