import { motion } from "framer-motion";
import { BookOpen, Clock, Star, ChevronLeft } from "lucide-react";
import { useLessons } from "@/contexts/LessonsContext";

const LessonsView = () => {
  const { lessons } = useLessons();
  const completedCount = lessons.filter(l => l.completed).length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">الدروس</h1>
        <p className="text-muted-foreground">تعلم أساسيات التدريب السمعي خطوة بخطوة</p>
      </motion.div>

      {/* Progress Summary */}
      <motion.div
        className="bg-gradient-to-br from-primary/20 to-turquoise/20 rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">تقدمك في الدروس</p>
            <p className="text-2xl font-bold">{completedCount} من {lessons.length} مكتمل</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">{progressPercent}٪</span>
          </div>
        </div>
        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${progressPercent}%` }} />
        </div>
      </motion.div>

      {/* Lessons List */}
      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <motion.div
            key={lesson.id}
            className="bg-card rounded-2xl p-6 cursor-pointer hover:bg-muted/50 transition-colors group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                lesson.completed
                  ? "bg-mint text-mint-foreground"
                  : lesson.progress > 0
                    ? "bg-yellow text-yellow-foreground"
                    : "bg-muted text-muted-foreground"
              }`}>
                {lesson.completed ? (
                  <Star className="w-6 h-6 fill-current" />
                ) : (
                  <BookOpen className="w-6 h-6" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">{lesson.title}</h3>
                  <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">{lesson.description}</p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{lesson.duration}</span>
                  </div>

                  {lesson.progress > 0 && !lesson.completed && (
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow rounded-full"
                          style={{ width: `${lesson.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{lesson.progress}٪</span>
                    </div>
                  )}

                  {lesson.completed && (
                    <span className="text-sm text-mint font-medium">مكتمل</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LessonsView;
