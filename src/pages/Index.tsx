import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import RecommendationPanel from "@/components/RecommendationPanel";
import CategoryTabs from "@/components/CategoryTabs";
import LessonGrid from "@/components/LessonGrid";
import BubbleDecoration from "@/components/BubbleDecoration";
import AdminPanel from "@/components/AdminPanel";
import ExerciseModal from "@/components/ExerciseModal";
import { Exercise } from "@/data/exercises";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [activeCategory, setActiveCategory] = useState("tones");
  const [adminOpen, setAdminOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setExerciseModalOpen(true);
  };

  const handleExerciseClose = () => {
    setExerciseModalOpen(false);
    setSelectedExercise(null);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <BubbleDecoration />

      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-primary/5 via-transparent to-turquoise/5 pointer-events-none z-0" />

      {/* Sidebar */}
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main Content */}
      <div className="mr-16 relative z-10">
        <Header onManageGuide={() => setAdminOpen(true)} />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Hero + Recommendation Grid */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="col-span-2">
                <HeroSection />
              </div>
              <div className="col-span-1">
                <RecommendationPanel />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="mb-6">
              <CategoryTabs 
                activeCategory={activeCategory} 
                onCategoryChange={setActiveCategory} 
              />
            </div>

            {/* Lesson Grid */}
            <LessonGrid category={activeCategory} onExerciseClick={handleExerciseClick} />
          </div>
        </main>
      </div>

      {/* Admin Panel */}
      <AdminPanel open={adminOpen} onOpenChange={setAdminOpen} />

      {/* Exercise Modal */}
      <ExerciseModal
        exercise={selectedExercise}
        open={exerciseModalOpen}
        onClose={handleExerciseClose}
      />
    </div>
  );
};

export default Index;
