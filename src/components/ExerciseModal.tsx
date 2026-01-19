import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, Play, CheckCircle, XCircle, RotateCcw, ChevronRight, Zap, Lock } from "lucide-react";
import { Exercise } from "@/contexts/ExercisesContext";

interface ExerciseModalProps {
  exercise: Exercise | null;
  open: boolean;
  onClose: () => void;
}

const ExerciseModal = ({ exercise, open, onClose }: ExerciseModalProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [revealedCount, setRevealedCount] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Load voices when available
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  if (!exercise) return null;

  const answeredCount = Object.values(answers).filter(a => a !== null).length;
  const score = Object.entries(answers).reduce((acc, [qIndex, answerIndex]) => {
    const question = exercise.questions[parseInt(qIndex)];
    if (question && answerIndex === question.correctAnswer) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const handlePlayAudio = (text?: string) => {
    if (isPlaying) return;

    const question = exercise.questions[Object.keys(answers).length < exercise.questions.length
      ? Math.max(0, revealedCount - 1)
      : 0];
    const textToSpeak = text || question?.audioPlaceholder || "";

    if (!textToSpeak) {
      console.warn("No text to speak");
      return;
    }

    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Chrome workaround: resume if paused
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.6; // Slower for clarity
      utterance.pitch = 1;
      utterance.volume = 1;

      // Find Arabic voice - try multiple patterns
      const currentVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
      const arabicVoice = currentVoices.find(voice =>
        voice.lang.startsWith('ar') ||
        voice.lang.includes('AR') ||
        voice.name.toLowerCase().includes('arab')
      );

      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      setIsPlaying(true);

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = (e) => {
        console.error("Speech error:", e);
        setIsPlaying(false);
      };

      // Small delay to ensure speech synthesis is ready
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 50);
    } else {
      console.warn("Speech synthesis not supported");
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 1000);
    }
  };

  const handleSelectAnswer = (qIndex: number, answerIndex: number) => {
    if (answers[qIndex] !== undefined) return;

    setAnswers(prev => ({ ...prev, [qIndex]: answerIndex }));

    // Reveal next question
    if (qIndex + 1 < exercise.questions.length && qIndex + 1 >= revealedCount) {
      setTimeout(() => {
        setRevealedCount(prev => Math.max(prev, qIndex + 2));
        setTimeout(() => {
          questionRefs.current[qIndex + 1]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 100);
      }, 400);
    }
  };

  const handleSubmit = () => {
    setCompleted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setRevealedCount(1);
    setCompleted(false);
  };

  const handleClose = () => {
    handleRestart();
    onClose();
  };

  const xpEarned = completed ? (score * 10) + 25 : 0;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="bg-background overflow-auto"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: '5rem',
            bottom: 0,
            height: '100vh',
            zIndex: 9999,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="max-w-4xl mx-auto pb-8 px-4">
            {/* Header */}
            <motion.div
              className="flex items-center gap-3 mb-6 sticky top-4 bg-card/95 backdrop-blur-sm py-4 px-4 z-20 rounded-3xl shadow-sm border border-border/50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                onClick={handleClose}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Volume2 className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl font-bold truncate">{exercise.title}</h1>
                  <p className="text-xs text-muted-foreground truncate">{exercise.description}</p>
                </div>
              </div>
              <div className="flex-shrink-0 text-center min-w-[60px]">
                <p className="text-xs text-muted-foreground">التقدم</p>
                <p className="text-base font-bold">{answeredCount}/{exercise.questions.length}</p>
              </div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
            >
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-l from-primary to-yellow shadow-lg shadow-primary/50 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(answeredCount / exercise.questions.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </motion.div>

            {/* Results Banner */}
            {completed && (() => {
              const percentage = (score / exercise.questions.length) * 100;
              const gradeColor = percentage >= 80 ? 'green' : percentage >= 50 ? 'yellow' : 'red';
              const bgClass = gradeColor === 'green'
                ? 'from-green-500/20 to-primary/20'
                : gradeColor === 'yellow'
                ? 'from-yellow-500/20 to-primary/20'
                : 'from-red-500/20 to-primary/20';
              const textClass = gradeColor === 'green'
                ? 'text-green-500'
                : gradeColor === 'yellow'
                ? 'text-yellow-500'
                : 'text-red-500';

              return (
                <motion.div
                  className={`bg-gradient-to-l ${bgClass} rounded-3xl p-6 mb-6`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold mb-1">النتيجة</h2>
                      <p className={`text-4xl font-bold ${textClass}`}>{score}/{exercise.questions.length}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {score === exercise.questions.length
                          ? "ممتاز! إجابات صحيحة بالكامل"
                          : score >= exercise.questions.length / 2
                          ? "جيد جداً! استمر في التدريب"
                          : "حاول مرة أخرى للتحسن"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-yellow/20 px-4 py-2 rounded-2xl">
                      <Zap className="w-6 h-6 text-yellow" />
                      <span className="text-xl font-bold text-yellow">+{xpEarned} XP</span>
                    </div>
                  </div>
                </motion.div>
              );
            })()}

            {/* Questions - Progressive Mode */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {exercise.questions.map((question, qIndex) => {
                  const selectedAnswer = answers[qIndex];
                  const isRevealed = qIndex < revealedCount || completed;
                  const isAnswered = selectedAnswer !== undefined && selectedAnswer !== null;
                  const isCorrect = selectedAnswer === question.correctAnswer;
                  const isLatest = qIndex === revealedCount - 1 && !completed;

                  if (!isRevealed) return null;

                  return (
                    <motion.div
                      key={question.id || qIndex}
                      ref={el => questionRefs.current[qIndex] = el}
                      className={`bg-card rounded-3xl overflow-hidden ${
                        isLatest ? "ring-2 ring-primary/50 shadow-lg" : ""
                      }`}
                      initial={{ opacity: 0, y: 50, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <div className="p-8">
                        <div className="flex items-start gap-4 mb-6">
                          <span className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                            isAnswered
                              ? isCorrect ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-400"
                              : "bg-primary text-primary-foreground"
                          }`}>
                            {isAnswered ? (
                              isCorrect ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />
                            ) : qIndex + 1}
                          </span>
                          <p className="text-xl font-medium pt-2">{question.prompt}</p>
                        </div>

                        {/* Audio Player */}
                        <div className="flex justify-center mb-6">
                          <motion.button
                            onClick={() => handlePlayAudio(question.audioPlaceholder)}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                              isPlaying ? "bg-primary/80" : "bg-primary hover:bg-primary/80"
                            }`}
                            animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}
                          >
                            {isPlaying ? (
                              <Volume2 className="w-7 h-7 text-primary-foreground" />
                            ) : (
                              <Play className="w-7 h-7 text-primary-foreground mr-[-2px]" />
                            )}
                          </motion.button>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-2 gap-3 mr-16">
                          {question.options.map((option, optIndex) => {
                            const isSelected = selectedAnswer === optIndex;
                            const isCorrectOption = optIndex === question.correctAnswer;
                            let buttonStyle = "bg-muted hover:bg-muted/80 border-transparent";
                            if (isAnswered) {
                              if (isCorrectOption) buttonStyle = "bg-green-500/20 border-green-500 text-green-500";
                              else if (isSelected) buttonStyle = "bg-red-500/20 border-red-500 text-red-400";
                              else buttonStyle = "bg-muted/50 border-transparent opacity-50";
                            }

                            return (
                              <motion.button
                                key={optIndex}
                                onClick={() => handleSelectAnswer(qIndex, optIndex)}
                                className={`p-4 rounded-2xl text-right font-medium border-2 transition-all min-h-[60px] flex items-center justify-end ${buttonStyle}`}
                                whileHover={!isAnswered ? { scale: 1.02 } : {}}
                                whileTap={!isAnswered ? { scale: 0.98 } : {}}
                                disabled={isAnswered}
                              >
                                <span className="flex items-center gap-2">
                                  {isAnswered && isCorrectOption && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                                  {isAnswered && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
                                  {option}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>

                        {/* Result Message */}
                        {isAnswered && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-6 p-4 rounded-2xl text-center ${
                              isCorrect ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-400"
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
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {!completed && revealedCount < exercise.questions.length && (
                <motion.div className="flex items-center justify-center gap-3 py-8 text-muted-foreground">
                  <Lock className="w-5 h-5" />
                  <span>{exercise.questions.length - revealedCount} أسئلة متبقية</span>
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            {!completed && (
              <motion.div
                className="sticky bottom-4 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.button
                  onClick={handleSubmit}
                  disabled={answeredCount < exercise.questions.length}
                  className={`w-full py-4 rounded-3xl font-bold text-lg shadow-lg transition-all ${
                    answeredCount === exercise.questions.length
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                  whileHover={answeredCount === exercise.questions.length ? { scale: 1.02 } : {}}
                  whileTap={answeredCount === exercise.questions.length ? { scale: 0.98 } : {}}
                >
                  {answeredCount === exercise.questions.length
                    ? "تسليم الإجابات"
                    : `أجب على جميع الأسئلة (${answeredCount}/${exercise.questions.length})`}
                </motion.button>
              </motion.div>
            )}

            {/* Back Button */}
            {completed && (
              <div className="flex gap-3 mt-6">
                <motion.button
                  onClick={handleRestart}
                  className="flex-1 py-4 bg-muted hover:bg-muted/80 rounded-3xl font-bold text-lg flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RotateCcw className="w-5 h-5" />
                  إعادة التمرين
                </motion.button>
                <motion.button
                  onClick={handleClose}
                  className="flex-1 py-4 bg-primary text-primary-foreground rounded-3xl font-bold text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  إنهاء
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ExerciseModal;
