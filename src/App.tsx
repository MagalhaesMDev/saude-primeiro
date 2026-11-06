import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import { ThemeProvider } from "next-themes";
import { useAuthStore } from "@/store/authStore";
import LegalInfoPage from "./pages/LegalInfo";

function AppRoutes() {
  const location = useLocation();
  const isAuthRoute = ["/login", "/cadastro", "/esqueci-senha"].includes(location.pathname);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/meu-seguro" element={<MeuSeguroPage />} />
        <Route path="/cuidar" element={<CuidarPage />} />
        <Route path="/aprender" element={<AprenderPage />} />
        <Route path="/saude-feminina" element={<SaudeFemininaPage />} />
        <Route path="/privacidade" element={<LegalInfoPage />} />
        <Route path="/termos" element={<LegalInfoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<LoginPage />} />
        <Route path="/esqueci-senha" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAuthRoute && (
        <>
          <BottomNav />
          <FloatingSupportButton />
        </>
      )}
    </div>
  );
}

export default function App() {
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="saude-primeiro-theme">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}