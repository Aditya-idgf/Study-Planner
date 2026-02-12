import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { StudyProvider } from "@/contexts/StudyContext";
import StudyDashboard from "./pages/StudyDashboard";
import StudyAnalytics from "./pages/StudyAnalytics";
import TopicDetail from "./pages/TopicDetail";
import NotFound from "./pages/NotFound";

const App = () => (
  <StudyProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<StudyDashboard />} />
        <Route path="/analytics" element={<StudyAnalytics />} />
        <Route path="/topic/:id" element={<TopicDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </StudyProvider>
);

export default App;
