import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle,
  XCircle,
  RotateCcw,
  ChevronLeft,
  Lightbulb,
  Volume2,
  ArrowLeft,
  Lock,
  Star,
  Target,
  AlertCircle
} from "lucide-react";
import { useSoundProgress } from "@/contexts/SoundProgressContext";
import { smartJudge, JudgeOutput } from "@/services/smart-judge";
import {
  generateExercise,
  getAvailableSounds,
  generateSimilarSoundsReview
} from "@/data/auditory-exercises";
import { getSoundById } from "@/data/arabic-sounds";
import {
  AuditoryExercise,
  AuditoryQuestion,
  TrainingLevel,
  TRAINING_LEVEL_NAMES,
  TRAINING_LEVEL_ORDER
} from "@/types/arabic-sounds";

interface SoundExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSoundId?: string;
  initialLevel?: TrainingLevel;
}

type ViewState = "select-sound" | "select-level" | "exercise" | "results" | "review-similar";

const SoundExerciseModal = ({
  isOpen,
  onClose,
  initialSoundId,
  initialLevel
}: SoundExerciseModalProps) => {
  const {
    recordAnswer,
    getSoundProgress,
    getSoundMasteryStatus,
    getRecommendations
  } = useSoundProgress();

  const [viewState, setViewState] = useState<ViewState>("select-sound");
  const [selectedSoundId, setSelectedSoundId] = useState<string | null>(initialSoundId || null);
  const [selectedLevel, setSelectedLevel] = useState<TrainingLevel | null>(initialLevel || null);
  const [exercise, setExercise] = useState<AuditoryExercise | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [judgeResult, setJudgeResult] = useState<JudgeOutput | null>(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [sessionErrors, setSessionErrors] = useState<Array<{
    targetSound: string;
    selectedSound?: string;
    question: AuditoryQuestion;
  }>>([]);

  // Initialize with props
  useEffect(() => {
    if (initialSoundId && initialLevel) {
      setSelectedSoundId(initialSoundId);
      setSelectedLevel(initialLevel);
      const ex = generateExercise(initialSoundId, initialLevel);
      if (ex) {
        setExercise(ex);
        setViewState("exercise");
      }
    }
  }, [initialSoundId, initialLevel]);

  const availableSounds = getAvailableSounds();

  const handleSelectSound = (soundId: string) => {
    setSelectedSoundId(soundId);
    setViewState("select-level");
  };

  const handleSelectLevel = (level: TrainingLevel) => {
    if (!selectedSoundId) return;

    const status = getSoundMasteryStatus(selectedSoundId, level);
    if (status === 'locked') return;

    setSelectedLevel(level);
    const ex = generateExercise(selectedSoundId, level);
    if (ex) {
      setExercise(ex);
      setViewState("exercise");
      resetExerciseState();
    }
  };

  const resetExerciseState = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setJudgeResult(null);
    setScore(0);
    setShowHint(false);
    setSessionErrors([]);
  };

  const handleSelectAnswer = (index: number) => {
    if (showResult || !exercise) return;

    setSelectedAnswer(index);
    setShowResult(true);

    const question = exercise.questions[currentQuestion];

    // Use smart judge
    const result = smartJudge({
      targetSound: question.targetSound,
      selectedAnswer: index,
      correctAnswer: question.correctAnswer,
      options: question.options,
      level: exercise.level,
      position: question.soundPosition
    });

    setJudgeResult(result);

    if (result.isCorrect) {
      setScore(score + 1);
    } else {
      // Track error
      setSessionErrors(prev => [...prev, {
        targetSound: question.targetSound,
        selectedSound: result.selectedSound || undefined,
        question
      }]);
    }

    // Record in progress context
    if (selectedSoundId) {
      recordAnswer(
        selectedSoundId,
        exercise.level,
        result.isCorrect,
        question.soundPosition,
        result.confusedWith
      );
    }
  };

  const handleNext = () => {
    if (!exercise) return;

    if (currentQuestion === exercise.questions.length - 1) {
      setViewState("results");
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setJudgeResult(null);
      setShowHint(false);
    }
  };

  const handleRestart = () => {
    if (selectedSoundId && selectedLevel) {
      const ex = generateExercise(selectedSoundId, selectedLevel);
      if (ex) {
        setExercise(ex);
        setViewState("exercise");
        resetExerciseState();
      }
    }
  };

  const handleReviewSimilarSounds = () => {
    if (!judgeResult?.confusedWith || !selectedSoundId) return;

    const sound = getSoundById(selectedSoundId);
    if (!sound) return;

    const reviewExercise = generateSimilarSoundsReview(
      sound.letter,
      judgeResult.confusedWith
    );

    if (reviewExercise) {
      setExercise(reviewExercise);
      setViewState("exercise");
      resetExerciseState();
    }
  };

  const handleBack = () => {
    switch (viewState) {
      case "select-level":
        setViewState("select-sound");
        setSelectedSoundId(null);
        break;
      case "exercise":
      case "results":
        setViewState("select-level");
        setExercise(null);
        resetExerciseState();
        break;
      default:
        onClose();
    }
  };

  const handleClose = () => {
    setViewState("select-sound");
    setSelectedSoundId(null);
    setSelectedLevel(null);
    setExercise(null);
    resetExerciseState();
    onClose();
  };

  const getLevelIcon = (level: TrainingLevel, status: string) => {
    if (status === 'locked') return <Lock className="w-4 h-4" />;
    if (status === 'mastered') return <Star className="w-4 h-4 text-yellow" />;
    if (status === 'in_progress') return <Target className="w-4 h-4 text-turquoise" />;
    return null;
  };

  const getLevelColor = (status: string) => {
    switch (status) {
      case 'locked': return 'bg-muted/50 text-muted-foreground cursor-not-allowed';
      case 'mastered': return 'bg-yellow/20 text-yellow border-yellow/30 hover:bg-yellow/30';
      case 'in_progress': return 'bg-turquoise/20 text-turquoise border-turquoise/30 hover:bg-turquoise/30';
      default: return 'bg-muted hover:bg-muted/80 border-transparent';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-bold">تدريبات الأصوات العربية</h2>
                <p className="text-sm text-muted-foreground">
                  {viewState === "select-sound" && "اختر الصوت للتدريب"}
                  {viewState === "select-level" && selectedSoundId && `صوت ${getSoundById(selectedSoundId)?.letter}`}
                  {viewState === "exercise" && exercise && exercise.title}
                  {viewState === "results" && "نتيجة التمرين"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            {/* Sound Selection */}
            {viewState === "select-sound" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <h3 className="font-bold mb-4">اختر الصوت:</h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {availableSounds.map((sound) => {
                    const progress = getSoundProgress(sound.id);
                    const hasProgress = progress && progress.overallAccuracy > 0;

                    return (
                      <motion.button
                        key={sound.id}
                        onClick={() => handleSelectSound(sound.id)}
                        className={`p-4 rounded-xl text-center transition-colors border-2 ${
                          hasProgress
                            ? 'bg-turquoise/10 border-turquoise/30 hover:bg-turquoise/20'
                            : 'bg-muted hover:bg-muted/80 border-transparent'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-3xl font-bold">{sound.letter}</span>
                        {hasProgress && (
                          <div className="mt-1 text-xs text-turquoise">
                            {progress.overallAccuracy}%
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Recommendations */}
                {getRecommendations().length > 0 && (
                  <div className="mt-6 p-4 bg-primary/10 rounded-xl">
                    <h4 className="font-bold mb-2">اقتراحات:</h4>
                    {getRecommendations().slice(0, 2).map((rec, i) => (
                      <p key={i} className="text-sm text-muted-foreground">• {rec.message}</p>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Level Selection */}
            {viewState === "select-level" && selectedSoundId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {/* Sound Info */}
                {(() => {
                  const sound = getSoundById(selectedSoundId);
                  if (!sound) return null;

                  return (
                    <div className="p-4 bg-primary/10 rounded-xl mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
                          <span className="text-4xl font-bold">{sound.letter}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{sound.name}</h3>
                          <p className="text-sm text-muted-foreground">{sound.articulationDescription}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm">{sound.trainingTip}</p>
                    </div>
                  );
                })()}

                <h3 className="font-bold">اختر المرحلة:</h3>
                <div className="space-y-2">
                  {TRAINING_LEVEL_ORDER.map((level) => {
                    const status = getSoundMasteryStatus(selectedSoundId, level);
                    const isLocked = status === 'locked';

                    return (
                      <motion.button
                        key={level}
                        onClick={() => handleSelectLevel(level)}
                        disabled={isLocked}
                        className={`w-full p-4 rounded-xl text-right transition-colors border-2 flex items-center justify-between ${getLevelColor(status)}`}
                        whileHover={!isLocked ? { scale: 1.01 } : {}}
                        whileTap={!isLocked ? { scale: 0.99 } : {}}
                      >
                        <div className="flex items-center gap-3">
                          {getLevelIcon(level, status)}
                          <span className="font-medium">{TRAINING_LEVEL_NAMES[level]}</span>
                        </div>
                        {status === 'mastered' && <span className="text-sm">متقن</span>}
                        {status === 'in_progress' && <span className="text-sm">جاري</span>}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Exercise */}
            {viewState === "exercise" && exercise && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Progress */}
                <div className="mb-6">
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

                {/* Question */}
                <div className="mb-6">
                  <p className="text-lg font-medium whitespace-pre-line leading-relaxed">
                    {exercise.questions[currentQuestion].prompt}
                  </p>

                  {/* Audio simulation indicator */}
                  <div className="mt-3 p-3 bg-muted rounded-lg flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {exercise.questions[currentQuestion].audioDescription}
                    </span>
                  </div>

                  {/* Hint Button */}
                  {exercise.questions[currentQuestion].hint && !showResult && (
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="mt-3 text-sm text-yellow flex items-center gap-1 hover:underline"
                    >
                      <Lightbulb className="w-4 h-4" />
                      {showHint ? "إخفاء التلميح" : "عرض تلميح"}
                    </button>
                  )}

                  {showHint && exercise.questions[currentQuestion].hint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2 p-3 bg-yellow/10 border border-yellow/30 rounded-lg text-sm"
                    >
                      {exercise.questions[currentQuestion].hint}
                    </motion.div>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {exercise.questions[currentQuestion].options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrectOption = index === exercise.questions[currentQuestion].correctAnswer;

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
                        className={`w-full p-4 rounded-xl text-right font-medium border-2 transition-all ${buttonStyle}`}
                        whileHover={!showResult ? { scale: 1.01 } : {}}
                        whileTap={!showResult ? { scale: 0.99 } : {}}
                      >
                        <span className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-background/50 flex items-center justify-center text-sm shrink-0">
                            {String.fromCharCode(1571 + index)}
                          </span>
                          {showResult && isCorrectOption && (
                            <CheckCircle className="w-5 h-5 text-turquoise shrink-0" />
                          )}
                          {showResult && isSelected && !isCorrectOption && (
                            <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                          )}
                          <span className="flex-1">{option}</span>
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Smart Judge Result */}
                {showResult && judgeResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 space-y-3"
                  >
                    {/* Main feedback */}
                    <div className={`p-4 rounded-xl ${
                      judgeResult.isCorrect
                        ? "bg-turquoise/20 text-turquoise"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      <p className="font-bold">{judgeResult.feedback}</p>
                    </div>

                    {/* Confusion error warning */}
                    {judgeResult.isConfusionError && judgeResult.confusedWith && (
                      <div className="p-4 bg-yellow/10 border border-yellow/30 rounded-xl">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-yellow shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-yellow">
                              {judgeResult.detailedFeedback.explanation}
                            </p>
                            {judgeResult.detailedFeedback.tip && (
                              <p className="text-sm mt-1 text-muted-foreground">
                                {judgeResult.detailedFeedback.tip}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Review similar sounds button */}
                        <button
                          onClick={handleReviewSimilarSounds}
                          className="mt-3 text-sm text-yellow flex items-center gap-1 hover:underline"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          تدرب على التمييز بين الصوتين
                        </button>
                      </div>
                    )}

                    {/* Practice words suggestion */}
                    {judgeResult.detailedFeedback.practiceWords && judgeResult.detailedFeedback.practiceWords.length > 0 && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">كلمات للتدريب:</p>
                        <p className="font-medium">{judgeResult.detailedFeedback.practiceWords.join(' - ')}</p>
                      </div>
                    )}

                    {/* Explanation */}
                    {exercise.questions[currentQuestion].explanation && (
                      <div className="p-4 bg-muted rounded-xl">
                        <p className="text-sm font-medium mb-1">التفسير:</p>
                        <p className="text-sm text-muted-foreground">
                          {exercise.questions[currentQuestion].explanation}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={handleNext}
                      className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
                    >
                      {currentQuestion === exercise.questions.length - 1 ? "عرض النتيجة" : "السؤال التالي"}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Results */}
            {viewState === "results" && exercise && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                    score >= exercise.questions.length * 0.8
                      ? "bg-turquoise/20"
                      : score >= exercise.questions.length * 0.5
                      ? "bg-yellow/20"
                      : "bg-red-500/20"
                  }`}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {score >= exercise.questions.length * 0.8 ? (
                    <CheckCircle className="w-12 h-12 text-turquoise" />
                  ) : score >= exercise.questions.length * 0.5 ? (
                    <Star className="w-12 h-12 text-yellow" />
                  ) : (
                    <Target className="w-12 h-12 text-red-400" />
                  )}
                </motion.div>

                <h3 className="text-2xl font-bold mb-2">
                  {score >= exercise.questions.length * 0.8
                    ? "أحسنت!"
                    : score >= exercise.questions.length * 0.5
                    ? "جيد!"
                    : "حاول مرة أخرى"}
                </h3>

                <div className="bg-muted/50 rounded-xl p-6 mb-6">
                  <p className="text-4xl font-bold text-turquoise mb-2">
                    {score}/{exercise.questions.length}
                  </p>
                  <p className="text-muted-foreground">
                    {Math.round((score / exercise.questions.length) * 100)}% دقة
                  </p>
                </div>

                {/* Error summary */}
                {sessionErrors.length > 0 && (
                  <div className="mb-6 p-4 bg-muted rounded-xl text-right">
                    <h4 className="font-bold mb-2">نقاط تحتاج تعزيز:</h4>
                    {sessionErrors.map((error, i) => (
                      <p key={i} className="text-sm text-muted-foreground">
                        • {error.selectedSound
                          ? `خلط بين ${error.targetSound} و ${error.selectedSound}`
                          : `خطأ في صوت ${error.targetSound}`
                        }
                      </p>
                    ))}
                  </div>
                )}

                {/* Recommendations */}
                {selectedSoundId && getRecommendations(selectedSoundId).length > 0 && (
                  <div className="mb-6 p-4 bg-primary/10 rounded-xl text-right">
                    <h4 className="font-bold mb-2">اقتراحات:</h4>
                    {getRecommendations(selectedSoundId).slice(0, 2).map((rec, i) => (
                      <p key={i} className="text-sm text-muted-foreground">• {rec.message}</p>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <motion.button
                    onClick={handleRestart}
                    className="flex-1 py-3 bg-muted hover:bg-muted/80 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RotateCcw className="w-5 h-5" />
                    إعادة
                  </motion.button>
                  <motion.button
                    onClick={() => setViewState("select-level")}
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    مرحلة أخرى
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SoundExerciseModal;
