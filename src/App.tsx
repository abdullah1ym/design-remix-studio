import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SkillsProvider } from "@/contexts/SkillsContext";
import { ExercisesProvider } from "@/contexts/ExercisesContext";
import { LessonsProvider } from "@/contexts/LessonsContext";
import { SoundProgressProvider } from "@/contexts/SoundProgressContext";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SkillsProvider>
      <ExercisesProvider>
        <LessonsProvider>
          <SoundProgressProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/admin" element={<Admin />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </SoundProgressProvider>
        </LessonsProvider>
      </ExercisesProvider>
    </SkillsProvider>
  </QueryClientProvider>
);

export default App;
