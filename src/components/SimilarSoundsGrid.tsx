import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, Play, Clock, BarChart3 } from "lucide-react";
import { exercises, Exercise } from "@/data/exercises";
import ExerciseModal from "./ExerciseModal";

const SimilarSoundsGrid = () => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Get similar-sounds exercises
  const similarSoundsExercises = exercises.filter(e => e.category === "similar-sounds");

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedExercise(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-turquoise/20 text-turquoise";
      case "intermediate":
        return "bg-yellow/20 text-yellow";
      case "advanced":
        return "bg-primary/20 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "مبتدئ";
      case "intermediate":
        return "متوسط";
      case "advanced":
        return "متقدم";
      default:
        return difficulty;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold">تمييز الأصوات المتشابهة</h2>
        <p className="text-sm text-muted-foreground">تدرب على التمييز بين الأصوات المتقاربة في النطق</p>
      </motion.div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {similarSoundsExercises.map((exercise, index) => (
          <motion.button
            key={exercise.id}
            onClick={() => handleExerciseClick(exercise)}
            className="p-5 rounded-xl bg-card hover:bg-card/80 border border-border hover:border-primary/30 transition-all text-right"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <Volume2 className="w-6 h-6 text-primary" />
            </div>

            {/* Title */}
            <h3 className="font-bold text-lg mb-2">{exercise.title}</h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {exercise.description}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-3 text-xs">
              <span className={`px-2 py-1 rounded-full ${getDifficultyColor(exercise.difficulty)}`}>
                {getDifficultyLabel(exercise.difficulty)}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3 h-3" />
                {exercise.duration}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <BarChart3 className="w-3 h-3" />
                {exercise.questions.length} أسئلة
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Exercise Modal */}
      <ExerciseModal
        exercise={selectedExercise}
        open={modalOpen}
        onClose={handleClose}
      />
    </div>
  );
};

export default SimilarSoundsGrid;
