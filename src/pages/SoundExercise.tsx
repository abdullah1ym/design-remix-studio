import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Volume2,
  Play,
  Mic,
  CheckCircle,
  XCircle,
  RotateCcw,
  Zap,
  Lock,
  AlertCircle,
  Lightbulb
} from "lucide-react";
import { useSoundProgress } from "@/contexts/SoundProgressContext";
import { smartJudge, JudgeOutput } from "@/services/smart-judge";
import {
  generateExercise,
  generateSimilarSoundsReview
} from "@/data/auditory-exercises";
import { getSoundById } from "@/data/arabic-sounds";
import {
  AuditoryExercise,
  AuditoryQuestion,
  TrainingLevel,
  TRAINING_LEVEL_NAMES
} from "@/types/arabic-sounds";

const SoundExercise = () => {
  const { soundId, level } = useParams<{ soundId: string; level: string }>();
  const navigate = useNavigate();
  const {
    recordAnswer,
    getSoundProgress,
    getRecommendations
  } = useSoundProgress();

  const [exercise, setExercise] = useState<AuditoryExercise | null>(null);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [judgeResults, setJudgeResults] = useState<Record<number, JudgeOutput>>({});
  const [revealedCount, setRevealedCount] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [showHints, setShowHints] = useState<Record<number, boolean>>({});
  const [sessionErrors, setSessionErrors] = useState<Array<{
    targetSound: string;
    selectedSound?: string;
    question: AuditoryQuestion;
  }>>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingQuestionIndex, setPlayingQuestionIndex] = useState<number | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Pronunciation practice state (for isolation level)
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [practiceCompleted, setPracticeCompleted] = useState<Record<number, boolean>>({});
  const [practiceResult, setPracticeResult] = useState<Record<number, 'correct' | 'incorrect' | null>>({});

  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pageRef = useRef<HTMLDivElement>(null);

  // Load exercise on mount
  useEffect(() => {
    if (soundId && level) {
      const ex = generateExercise(soundId, level as TrainingLevel);
      if (ex) {
        setExercise(ex);
      } else {
        // If exercise generation fails, go back
        navigate(-1);
      }
    }
  }, [soundId, level, navigate]);

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

  const sound = soundId ? getSoundById(soundId) : null;

  // For isolation level, use pronunciation practice items
  const isIsolationLevel = level === 'isolation';

  // Helper to add fatha vowel to single consonants for clearer TTS pronunciation
  const getAudioText = (text: string) => {
    // If it's a single letter without vowel marks, add fatha for clearer pronunciation
    if (text.length === 1 && !/[\u064B-\u0652]/.test(text)) {
      return text + '\u064E'; // Add fatha (ـَ)
    }
    return text;
  };

  const practiceItems = sound ? [
    sound.letter,
    ...(sound.examples.cv || [])
  ] : [];

  const handlePlayPracticeAudio = (text: string) => {
    if (isPlaying) return;

    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Chrome workaround: resume if paused
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
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
    }
  };

  const handleRecord = () => {
    setIsRecording(true);
    // Clear previous result for this index
    setPracticeResult(prev => ({ ...prev, [currentPracticeIndex]: null }));

    // Simulate recording for 2 seconds
    setTimeout(() => {
      setIsRecording(false);

      // Simulate random success/failure for testing (70% success rate)
      const isCorrect = Math.random() > 0.3;

      setPracticeResult(prev => ({ ...prev, [currentPracticeIndex]: isCorrect ? 'correct' : 'incorrect' }));

      if (isCorrect) {
        setPracticeCompleted(prev => ({ ...prev, [currentPracticeIndex]: true }));
      }
    }, 2000);
  };

  const handleNextPractice = () => {
    if (currentPracticeIndex < practiceItems.length - 1) {
      setCurrentPracticeIndex(currentPracticeIndex + 1);
    }
  };

  const handlePrevPractice = () => {
    if (currentPracticeIndex > 0) {
      setCurrentPracticeIndex(currentPracticeIndex - 1);
    }
  };

  const practiceProgress = Object.keys(practiceCompleted).length;
  const isPracticeComplete = practiceProgress === practiceItems.length;

  const handlePlayAudio = (text: string, questionIndex: number) => {
    if (isPlaying) return;

    if (!text) {
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

      const utterance = new SpeechSynthesisUtterance(text);
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
      setPlayingQuestionIndex(questionIndex);

      utterance.onend = () => {
        setIsPlaying(false);
        setPlayingQuestionIndex(null);
      };

      utterance.onerror = (e) => {
        console.error("Speech error:", e);
        setIsPlaying(false);
        setPlayingQuestionIndex(null);
      };

      // Small delay to ensure speech synthesis is ready
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 50);
    } else {
      console.warn("Speech synthesis not supported");
      setIsPlaying(true);
      setPlayingQuestionIndex(questionIndex);
      setTimeout(() => {
        setIsPlaying(false);
        setPlayingQuestionIndex(null);
      }, 1000);
    }
  };

  if (!exercise || !sound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const questions = exercise.questions;
  const answeredCount = Object.values(answers).filter(a => a !== null).length;
  const score = Object.entries(answers).reduce((acc, [qIndex, answerIndex]) => {
    const question = questions[parseInt(qIndex)];
    if (!question || answerIndex === null) return acc;
    if (answerIndex === question.correctAnswer) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const handleSelectAnswer = (qIndex: number, answerIndex: number) => {
    if (answers[qIndex] !== undefined) return;

    const question = questions[qIndex];
    setAnswers(prev => ({ ...prev, [qIndex]: answerIndex }));

    // Use smart judge
    const result = smartJudge({
      targetSound: question.targetSound,
      selectedAnswer: answerIndex,
      correctAnswer: question.correctAnswer,
      options: question.options,
      level: exercise.level,
      position: question.soundPosition
    });

    setJudgeResults(prev => ({ ...prev, [qIndex]: result }));

    if (!result.isCorrect) {
      setSessionErrors(prev => [...prev, {
        targetSound: question.targetSound,
        selectedSound: result.selectedSound || undefined,
        question
      }]);
    }

    // Record in progress context
    if (soundId) {
      recordAnswer(
        soundId,
        exercise.level,
        result.isCorrect,
        question.soundPosition,
        result.confusedWith
      );
    }

    // Reveal next question
    if (qIndex + 1 < questions.length && qIndex + 1 >= revealedCount) {
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
    if (pageRef.current) {
      pageRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRestart = () => {
    // Regenerate exercise with new random questions
    if (soundId && level) {
      const ex = generateExercise(soundId, level as TrainingLevel);
      if (ex) {
        setExercise(ex);
        setAnswers({});
        setJudgeResults({});
        setRevealedCount(1);
        setCompleted(false);
        setShowHints({});
        setSessionErrors([]);
      }
    }
  };

  const handleClose = () => {
    // Navigate back to main page and reopen the 12 stages modal for the same letter
    navigate('/', { state: { openSoundId: soundId } });
  };

  const handleReviewSimilarSounds = (confusedWith: string) => {
    const reviewExercise = generateSimilarSoundsReview(
      sound.letter,
      confusedWith
    );

    if (reviewExercise) {
      setExercise(reviewExercise);
      setAnswers({});
      setJudgeResults({});
      setRevealedCount(1);
      setCompleted(false);
      setShowHints({});
      setSessionErrors([]);
    }
  };

  const xpEarned = completed ? (score * 10) + 25 : 0;

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-background overflow-auto"
      style={{ paddingRight: '5rem' }}
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
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold">{sound.letter}</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold truncate">{exercise.title}</h1>
              <p className="text-xs text-muted-foreground truncate">
                {TRAINING_LEVEL_NAMES[exercise.level]} - {sound.name}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 text-center min-w-[60px]">
            <p className="text-xs text-muted-foreground">التقدم</p>
            <p className="text-base font-bold">
              {isIsolationLevel ? `${currentPracticeIndex + 1}/${practiceItems.length}` : `${answeredCount}/${questions.length}`}
            </p>
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
              animate={{ width: `${isIsolationLevel
                ? ((currentPracticeIndex + 1) / practiceItems.length) * 100
                : (answeredCount / questions.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* ========== ISOLATION LEVEL: Pronunciation Practice ========== */}
        {isIsolationLevel ? (
          <div className="space-y-6">
            {/* Instruction */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-lg text-muted-foreground">استمع للصوت ثم ردده</p>
            </motion.div>

            {/* Current Practice Item */}
            <motion.div
              key={currentPracticeIndex}
              className="bg-card rounded-3xl p-8 text-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Big Letter Display */}
              <div className="bg-primary/10 rounded-2xl p-12 mb-8 inline-block">
                <p className="text-7xl font-bold text-primary">{practiceItems[currentPracticeIndex]}</p>
              </div>

              {/* Sound Description */}
              <p className="text-muted-foreground mb-6">
                {currentPracticeIndex === 0
                  ? `صوت ${sound.name} معزولاً`
                  : `صوت ${sound.name} مع حركة`}
              </p>

              {/* Action Buttons */}
              <div className="flex justify-center gap-6 mb-6">
                {/* Play Button */}
                <motion.button
                  onClick={() => handlePlayPracticeAudio(getAudioText(practiceItems[currentPracticeIndex]))}
                  className={`w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center shadow-lg active:bg-primary ${isPlaying ? 'animate-pulse' : ''}`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {isPlaying ? (
                    <Volume2 className="w-9 h-9" />
                  ) : (
                    <Play className="w-9 h-9 mr-[-4px]" />
                  )}
                </motion.button>

                {/* Record Button */}
                <motion.button
                  onClick={handleRecord}
                  className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg active:opacity-100 ${
                    isRecording ? 'bg-red-500 text-white animate-pulse' :
                    practiceResult[currentPracticeIndex] === 'correct' ? 'bg-green-500 text-white' :
                    practiceResult[currentPracticeIndex] === 'incorrect' ? 'bg-red-500 text-white' :
                    'bg-muted text-foreground'
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {practiceResult[currentPracticeIndex] === 'correct' ? (
                    <CheckCircle className="w-9 h-9" />
                  ) : practiceResult[currentPracticeIndex] === 'incorrect' ? (
                    <XCircle className="w-9 h-9" />
                  ) : (
                    <Mic className="w-9 h-9" />
                  )}
                </motion.button>
              </div>

              {/* Feedback Message */}
              {practiceResult[currentPracticeIndex] === 'incorrect' ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <p className="text-red-500 font-semibold mb-2">حاول مرة أخرى</p>
                  <p className="text-sm text-muted-foreground">استمع للصوت جيداً ثم أعد المحاولة</p>
                </motion.div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {isRecording ? 'جاري التسجيل...' :
                   practiceResult[currentPracticeIndex] === 'correct' ? 'أحسنت! انتقل للتالي' :
                   'اضغط على الصوت للاستماع ثم سجل صوتك'}
                </p>
              )}
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <motion.button
                onClick={handlePrevPractice}
                disabled={currentPracticeIndex === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl ${
                  currentPracticeIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'
                }`}
                whileHover={currentPracticeIndex > 0 ? { scale: 1.05 } : {}}
                whileTap={currentPracticeIndex > 0 ? { scale: 0.95 } : {}}
              >
                <ChevronRight className="w-5 h-5" />
                السابق
              </motion.button>

              <div className="flex gap-2">
                {practiceItems.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      idx === currentPracticeIndex ? 'bg-primary' :
                      practiceResult[idx] === 'correct' ? 'bg-green-500' :
                      practiceResult[idx] === 'incorrect' ? 'bg-red-500' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              <motion.button
                onClick={currentPracticeIndex === practiceItems.length - 1 ? handleClose : handleNextPractice}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentPracticeIndex === practiceItems.length - 1 ? 'إنهاء' : 'التالي'}
                {currentPracticeIndex < practiceItems.length - 1 && <ChevronLeft className="w-5 h-5" />}
              </motion.button>
            </div>

            {/* Completion Summary */}
            {isPracticeComplete && (
              <motion.div
                className="bg-green-500/20 rounded-2xl p-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-green-600 mb-2">أحسنت!</h3>
                <p className="text-muted-foreground">أكملت تدريب الصوت المفرد</p>
              </motion.div>
            )}
          </div>
        ) : (
          <>
        {/* ========== OTHER LEVELS: Quiz Mode ========== */}
        {/* Results Banner */}
        {completed && (() => {
          const percentage = (score / questions.length) * 100;
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
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">النتيجة</h2>
                  <p className={`text-4xl font-bold ${textClass}`}>{score}/{questions.length}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {score === questions.length
                      ? "ممتاز! إجابات صحيحة بالكامل"
                      : score >= questions.length / 2
                      ? "جيد جداً! استمر في التدريب"
                      : "حاول مرة أخرى للتحسن"}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-yellow/20 px-4 py-2 rounded-2xl">
                  <Zap className="w-6 h-6 text-yellow" />
                  <span className="text-xl font-bold text-yellow">+{xpEarned} XP</span>
                </div>
              </div>

              {/* Error summary */}
              {sessionErrors.length > 0 && (
                <div className="mb-4 p-4 bg-background/50 rounded-2xl text-right">
                  <h4 className="font-bold mb-2">نقاط تحتاج تعزيز:</h4>
                  {sessionErrors.map((error, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      {error.selectedSound
                        ? `خلط بين ${error.targetSound} و ${error.selectedSound}`
                        : `خطأ في صوت ${error.targetSound}`
                      }
                    </p>
                  ))}
                </div>
              )}

              {/* Recommendations */}
              {soundId && getRecommendations(soundId).length > 0 && (
                <div className="mb-4 p-4 bg-primary/10 rounded-2xl text-right">
                  <h4 className="font-bold mb-2">اقتراحات:</h4>
                  {getRecommendations(soundId).slice(0, 2).map((rec, i) => (
                    <p key={i} className="text-sm text-muted-foreground">{rec.message}</p>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  onClick={handleRestart}
                  className="flex-1 py-4 bg-white/20 hover:bg-white/30 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RotateCcw className="w-5 h-5" />
                  إعادة التمرين
                </motion.button>
                <motion.button
                  onClick={handleClose}
                  className="flex-1 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  إنهاء
                </motion.button>
              </div>
            </motion.div>
          );
        })()}

        {/* Questions - Progressive Mode */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {questions.map((question, qIndex) => {
              const selectedAnswer = answers[qIndex];
              const isRevealed = qIndex < revealedCount || completed;
              const isAnswered = selectedAnswer !== undefined && selectedAnswer !== null;
              const isCorrect = selectedAnswer === question.correctAnswer;
              const isLatest = qIndex === revealedCount - 1 && !completed;
              const judgeResult = judgeResults[qIndex];

              if (!isRevealed) return null;

              return (
                <motion.div
                  key={qIndex}
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
                      <div className="flex-1">
                        <p className="text-xl font-medium pt-2 whitespace-pre-line leading-relaxed">
                          {question.prompt}
                        </p>
                      </div>
                    </div>

                    {/* Audio Player */}
                    <div className="flex justify-center mb-6">
                      <motion.button
                        onClick={() => {
                          // For yes/no questions or descriptive answers, play the target sound
                          // Otherwise play the correct answer (actual syllable/word)
                          const correctOption = question.options[question.correctAnswer];
                          const isYesNoOrDescriptive = correctOption === 'نعم' || correctOption === 'لا' || correctOption.length > 15;
                          const textToPlay = isYesNoOrDescriptive ? question.targetSound : correctOption;
                          handlePlayAudio(textToPlay, qIndex);
                        }}
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                          playingQuestionIndex === qIndex ? "bg-primary/80" : "bg-primary hover:bg-primary/80"
                        }`}
                        animate={playingQuestionIndex === qIndex ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.5, repeat: playingQuestionIndex === qIndex ? Infinity : 0 }}
                      >
                        {playingQuestionIndex === qIndex ? (
                          <Volume2 className="w-7 h-7 text-primary-foreground" />
                        ) : (
                          <Play className="w-7 h-7 text-primary-foreground mr-[-2px]" />
                        )}
                      </motion.button>
                    </div>

                    {/* Audio description text */}
                    <div className="mb-4 p-3 bg-muted rounded-lg flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {question.audioDescription}
                      </span>
                    </div>

                    {/* Hint Button */}
                    {question.hint && !isAnswered && (
                      <div className="mb-4">
                        <button
                          onClick={() => setShowHints(prev => ({ ...prev, [qIndex]: !prev[qIndex] }))}
                          className="text-sm text-yellow flex items-center gap-1 hover:underline"
                        >
                          <Lightbulb className="w-4 h-4" />
                          {showHints[qIndex] ? "إخفاء التلميح" : "عرض تلميح"}
                        </button>

                        {showHints[qIndex] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-2 p-3 bg-yellow/10 border border-yellow/30 rounded-lg text-sm"
                          >
                            {question.hint}
                          </motion.div>
                        )}
                      </div>
                    )}

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
                        className="mt-6 space-y-3"
                      >
                        {/* Main feedback */}
                        <div className={`p-4 rounded-2xl text-center ${
                          isCorrect ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-400"
                        }`}>
                          <p className="font-bold text-lg">
                            {judgeResult?.feedback || (isCorrect ? "إجابة صحيحة!" : "إجابة خاطئة")}
                          </p>
                        </div>

                        {/* Confusion Warning */}
                        {judgeResult?.isConfusionError && judgeResult?.confusedWith && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl text-right"
                          >
                            <div className="flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium text-yellow-500">
                                  {judgeResult.detailedFeedback.explanation}
                                </p>
                                {judgeResult.detailedFeedback.tip && (
                                  <p className="text-sm mt-1 text-muted-foreground">
                                    {judgeResult.detailedFeedback.tip}
                                  </p>
                                )}
                                {judgeResult.detailedFeedback.practiceWords &&
                                 judgeResult.detailedFeedback.practiceWords.length > 0 && (
                                  <p className="text-sm mt-2 text-muted-foreground">
                                    كلمات للتدريب: {judgeResult.detailedFeedback.practiceWords.join(' - ')}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Review similar sounds button */}
                            <button
                              onClick={() => handleReviewSimilarSounds(judgeResult.confusedWith!)}
                              className="mt-3 text-sm text-yellow-500 flex items-center gap-1 hover:underline"
                            >
                              <ChevronRight className="w-4 h-4 rotate-180" />
                              تدرب على التمييز بين الصوتين
                            </button>
                          </motion.div>
                        )}

                        {/* Explanation */}
                        {question.explanation && (
                          <div className="p-4 bg-muted rounded-2xl text-right">
                            <p className="text-sm font-medium mb-1">التفسير:</p>
                            <p className="text-sm text-muted-foreground">
                              {question.explanation}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {!completed && revealedCount < questions.length && (
            <motion.div className="flex items-center justify-center gap-3 py-8 text-muted-foreground">
              <Lock className="w-5 h-5" />
              <span>{questions.length - revealedCount} أسئلة متبقية</span>
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
              disabled={answeredCount < questions.length}
              className={`w-full py-4 rounded-3xl font-bold text-lg shadow-lg transition-all ${
                answeredCount === questions.length
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
              whileHover={answeredCount === questions.length ? { scale: 1.02 } : {}}
              whileTap={answeredCount === questions.length ? { scale: 0.98 } : {}}
            >
              {answeredCount === questions.length
                ? "تسليم الإجابات"
                : `أجب على جميع الأسئلة (${answeredCount}/${questions.length})`}
            </motion.button>
          </motion.div>
        )}
        </>
        )}
      </div>
    </div>
  );
};

export default SoundExercise;
