import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import RecommendationPanel from "@/components/RecommendationPanel";
import CategoryTabs from "@/components/CategoryTabs";
import LessonGrid from "@/components/LessonGrid";
import MakharijGrid from "@/components/MakharijGrid";
import ArabicSoundsGrid from "@/components/ArabicSoundsGrid";
import SimilarSoundsGrid from "@/components/SimilarSoundsGrid";
import BubbleDecoration from "@/components/BubbleDecoration";
import AdminPanel from "@/components/AdminPanel";
import ExerciseModal from "@/components/ExerciseModal";
import { Exercise } from "@/contexts/ExercisesContext";
import ProgressView from "@/components/views/ProgressView";
import SettingsView from "@/components/views/SettingsView";
import HelpView from "@/components/views/HelpView";
import LessonsView from "@/components/views/LessonsView";
import AchievementsView from "@/components/views/AchievementsView";
import FavoritesView from "@/components/views/FavoritesView";
import HearingTestView from "@/components/views/HearingTestView";
import SoundLibraryView from "@/components/views/SoundLibraryView";
import SkillMapView from "@/components/views/SkillMapView";

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
      <div className="mr-20 relative z-10">
        <Header onManageGuide={() => setAdminOpen(true)} />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {activeSection === "home" || activeSection === "exercises" ? (
              <>
                {/* Hero + Recommendation Grid */}
                <div className="grid grid-cols-3 gap-6 mb-8 items-stretch">
                  <div className="col-span-2 h-full">
                    <HeroSection />
                  </div>
                  <div className="col-span-1 h-full">
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

                {/* Lesson Grid or Custom Grids */}
                {activeCategory === "makharij" ? (
                  <MakharijGrid onExerciseClick={handleExerciseClick} />
                ) : activeCategory === "arabic-sounds" ? (
                  <ArabicSoundsGrid />
                ) : activeCategory === "similar-sounds" ? (
                  <SimilarSoundsGrid />
                ) : (
                  <LessonGrid category={activeCategory} onExerciseClick={handleExerciseClick} />
                )}
              </>
            ) : activeSection === "progress" ? (
              <ProgressView />
            ) : activeSection === "settings" ? (
              <SettingsView />
            ) : activeSection === "help" ? (
              <HelpView />
            ) : activeSection === "lessons" ? (
              <LessonsView />
            ) : activeSection === "skillmap" ? (
              <SkillMapView onBack={() => setActiveSection("home")} />
            ) : activeSection === "achievements" ? (
              <AchievementsView />
            ) : activeSection === "favorites" ? (
              <FavoritesView />
            ) : activeSection === "hearing" ? (
              <HearingTestView />
            ) : activeSection === "sounds" ? (
              <SoundLibraryView />
            ) : null}
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
