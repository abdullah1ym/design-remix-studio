import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, Play, CheckCircle, XCircle, RotateCcw, ChevronLeft } from "lucide-react";
import { Exercise, Question } from "@/data/exercises";

interface ExerciseModalProps {
  exercise: Exercise | null;
  open: boolean;
  onClose: () => void;
}

const ExerciseModal = ({ exercise, open, onClose }: ExerciseModalProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!exercise) return null;

  const question = exercise.questions[currentQuestion];
  const isLastQuestion = currentQuestion === exercise.questions.length - 1;
  const isCorrect = selectedAnswer === question.correctAnswer;

  const handlePlayAudio = () => {
    setIsPlaying(true);
    // Simulate audio playing
    setTimeout(() => setIsPlaying(false), 2000);
  };

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setCompleted(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompleted(false);
  };

  const handleClose = () => {
    handleRestart();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-card rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl font-bold">{exercise.title}</h2>
                  <p className="text-sm text-muted-foreground">{exercise.description}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-3 bg-muted/30">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>السؤال {currentQuestion + 1} من {exercise.questions.length}</span>
                <span className="text-turquoise font-medium">النتيجة: {score}/{exercise.questions.length}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-turquoise"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + (showResult ? 1 : 0)) / exercise.questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {!completed ? (
                <>
                  {/* Question */}
                  <div className="text-center mb-8">
                    <p className="text-lg font-medium mb-6">{question.prompt}</p>

                    {/* Audio Player Placeholder */}
                    <motion.div
                      className="inline-flex flex-col items-center gap-4 p-6 bg-muted/50 rounded-2xl"
                      whileHover={{ scale: 1.02 }}
                    >
                      <motion.button
                        onClick={handlePlayAudio}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                          isPlaying ? "bg-turquoise" : "bg-primary hover:bg-primary/80"
                        }`}
                        animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}
                      >
                        {isPlaying ? (
                          <Volume2 className="w-8 h-8 text-turquoise-foreground" />
                        ) : (
                          <Play className="w-8 h-8 text-primary-foreground mr-[-4px]" />
                        )}
                      </motion.button>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">اضغط للاستماع</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          [{question.audioPlaceholder}]
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-2 gap-3">
                    {question.options.map((option, index) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrectOption = index === question.correctAnswer;

                      let buttonStyle = "bg-muted hover:bg-muted/80 border-transparent";
                      if (showResult) {
                        if (isCorrectOption) {
                          buttonStyle = "bg-turquoise/20 border-turquoise text-turquoise";
                        } else if (isSelected && !isCorrectOption) {
                          buttonStyle = "bg-red-500/20 border-red-500 text-red-400";
                        } else {
                          buttonStyle = "bg-muted/50 border-transparent opacity-50";
                        }
                      } else if (isSelected) {
                        buttonStyle = "bg-primary/20 border-primary";
                      }

                      return (
                        <motion.button
                          key={index}
                          onClick={() => handleSelectAnswer(index)}
                          className={`p-4 rounded-xl text-center font-medium border-2 transition-all ${buttonStyle}`}
                          whileHover={!showResult ? { scale: 1.02 } : {}}
                          whileTap={!showResult ? { scale: 0.98 } : {}}
                        >
                          <span className="flex items-center justify-center gap-2">
                            {showResult && isCorrectOption && (
                              <CheckCircle className="w-5 h-5 text-turquoise" />
                            )}
                            {showResult && isSelected && !isCorrectOption && (
                              <XCircle className="w-5 h-5 text-red-400" />
                            )}
                            {option}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Result Message */}
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-6 p-4 rounded-xl text-center ${
                        isCorrect ? "bg-turquoise/20 text-turquoise" : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      <p className="font-bold text-lg">
                        {isCorrect ? "إجابة صحيحة!" : "إجابة خاطئة"}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm mt-1">
                          الإجابة الصحيحة: {question.options[question.correctAnswer]}
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* Next Button */}
                  {showResult && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={handleNext}
                      className="w-full mt-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                    >
                      {isLastQuestion ? "عرض النتيجة" : "السؤال التالي"}
                    </motion.button>
                  )}
                </>
              ) : (
                /* Completion Screen */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    className="w-24 h-24 mx-auto mb-6 rounded-full bg-turquoise/20 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle className="w-12 h-12 text-turquoise" />
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-2">أحسنت!</h3>
                  <p className="text-muted-foreground mb-6">لقد أكملت التمرين</p>

                  <div className="bg-muted/50 rounded-xl p-6 mb-6">
                    <p className="text-4xl font-bold text-turquoise mb-2">
                      {score}/{exercise.questions.length}
                    </p>
                    <p className="text-muted-foreground">
                      {score === exercise.questions.length
                        ? "ممتاز! إجابات صحيحة بالكامل"
                        : score >= exercise.questions.length / 2
                        ? "جيد جداً! استمر في التدريب"
                        : "حاول مرة أخرى للتحسن"}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      onClick={handleRestart}
                      className="flex-1 py-3 bg-muted hover:bg-muted/80 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RotateCcw className="w-5 h-5" />
                      إعادة التمرين
                    </motion.button>
                    <motion.button
                      onClick={handleClose}
                      className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      إنهاء
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExerciseModal;
