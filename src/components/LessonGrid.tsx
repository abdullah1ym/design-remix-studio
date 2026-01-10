import { motion } from "framer-motion";
import { Play, Info, Volume2, Clock } from "lucide-react";
import { getExercisesByCategory, Exercise } from "@/data/exercises";

interface LessonGridProps {
  category: string;
  onExerciseClick: (exercise: Exercise) => void;
}

const categoryNames: Record<string, string> = {
  "tones": "تمييز النغمات",
  "words": "الكلمات والمقاطع",
  "sentences": "الجمل والحوارات",
  "environment": "الأصوات البيئية",
  "advanced": "التدريب المتقدم",
};

const difficultyLabels: Record<string, string> = {
  "beginner": "مبتدئ",
  "intermediate": "متوسط",
  "advanced": "متقدم",
};

const difficultyColors: Record<string, string> = {
  "beginner": "bg-turquoise text-turquoise-foreground",
  "intermediate": "bg-yellow text-yellow-foreground",
  "advanced": "bg-coral text-coral-foreground",
};

const LessonGrid = ({ category, onExerciseClick }: LessonGridProps) => {
  const exercises = getExercisesByCategory(category);

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div>
          <h2 className="text-2xl font-bold">{categoryNames[category] || category}</h2>
          <p className="text-sm text-muted-foreground">{exercises.length} تمارين متاحة</p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            className="flex items-center gap-2 px-4 py-2.5 bg-card rounded-xl text-sm font-semibold hover:bg-muted transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Info className="w-4 h-4" />
            معلومات الوحدة
          </motion.button>

          {exercises.length > 0 && (
            <motion.button
              onClick={() => onExerciseClick(exercises[0])}
              className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-4 h-4 fill-current" />
              ابدأ التمارين
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.map((exercise, index) => (
          <motion.div
            key={exercise.id}
            onClick={() => onExerciseClick(exercise)}
            className="bg-card rounded-2xl p-6 cursor-pointer group hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Volume2 className="w-6 h-6 text-primary" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[exercise.difficulty]}`}>
                {difficultyLabels[exercise.difficulty]}
              </span>
            </div>

            {/* Content */}
            <h3 className="font-bold text-lg mb-2">{exercise.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {exercise.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{exercise.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{exercise.questions.length} أسئلة</span>
              </div>
            </div>

            {/* Play Overlay */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                <Play className="w-4 h-4 fill-current" />
                <span>ابدأ التمرين</span>
              </div>
            </div>
          </motion.div>
        ))}

        {exercises.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Volume2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>لا توجد تمارين في هذا القسم حالياً</p>
            <p className="text-sm">سيتم إضافة تمارين جديدة قريباً</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonGrid;
