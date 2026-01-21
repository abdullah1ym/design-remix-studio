import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Volume2,
  Play,
  Mic,
  CheckCircle,
  XCircle,
  RotateCcw
} from "lucide-react";

interface MakharijExerciseState {
  exercise: {
    id: string;
    type: 'isolation' | 'syllables' | 'words' | 'minimal-pairs' | 'sentences';
    title: string;
    instruction: string;
    items: string[];
    correctIndex?: number;
  };
  groupId: string;
  groupName: string;
  groupColor: string;
  letters: string[];
  subGroupName: string;
}

const colorClasses: Record<string, { bg: string; light: string; text: string }> = {
  jellyfish: { bg: 'bg-jellyfish', light: 'bg-jellyfish/10', text: 'text-jellyfish' },
  coral: { bg: 'bg-coral', light: 'bg-coral/10', text: 'text-coral' },
  primary: { bg: 'bg-primary', light: 'bg-primary/10', text: 'text-primary' },
  turquoise: { bg: 'bg-turquoise', light: 'bg-turquoise/10', text: 'text-turquoise' },
  mint: { bg: 'bg-mint', light: 'bg-mint/10', text: 'text-mint' },
};

const MakharijExercise = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as MakharijExerciseState | null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [practiceResult, setPracticeResult] = useState<Record<number, 'correct' | 'incorrect' | null>>({});
  const [practiceCompleted, setPracticeCompleted] = useState<Record<number, boolean>>({});
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // For minimal-pairs quiz
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  // Load voices
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

  if (!state) {
    navigate('/');
    return null;
  }

  const { exercise, groupName, groupColor, letters, subGroupName } = state;
  const colors = colorClasses[groupColor] || colorClasses.primary;
  const items = exercise.items;
  const currentItem = items[currentIndex];
  const isMinimalPairs = exercise.type === 'minimal-pairs';
  const progress = ((currentIndex + 1) / items.length) * 100;

  const handlePlayAudio = (text: string) => {
    if (isPlaying) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.5;
      utterance.pitch = 1;
      utterance.volume = 1;

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
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 50);
    }
  };

  const handleRecord = () => {
    setIsRecording(true);
    setPracticeResult(prev => ({ ...prev, [currentIndex]: null }));

    setTimeout(() => {
      setIsRecording(false);
      // 70% success rate for testing
      const isCorrect = Math.random() > 0.3;
      setPracticeResult(prev => ({ ...prev, [currentIndex]: isCorrect ? 'correct' : 'incorrect' }));
      if (isCorrect) {
        setPracticeCompleted(prev => ({ ...prev, [currentIndex]: true }));
      }
    }, 2000);
  };

  const handleSelectAnswer = (answerIndex: number) => {
    if (quizAnswers[currentIndex] !== undefined) return;

    setSelectedAnswer(answerIndex);
    setQuizAnswers(prev => ({ ...prev, [currentIndex]: answerIndex }));

    // For minimal pairs, correct answer is always 0 (first option)
    if (answerIndex === 0) {
      setPracticeCompleted(prev => ({ ...prev, [currentIndex]: true }));
      setPracticeResult(prev => ({ ...prev, [currentIndex]: 'correct' }));
    } else {
      setPracticeResult(prev => ({ ...prev, [currentIndex]: 'incorrect' }));
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(quizAnswers[currentIndex - 1] ?? null);
    }
  };

  const handleClose = () => {
    // Navigate back to main page with second tab (makharij) active and same group selected
    navigate('/', {
      state: {
        activeCategory: 'makharij',
        openMakharijGroup: state?.groupId
      }
    });
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setPracticeResult({});
    setPracticeCompleted({});
    setQuizAnswers({});
    setSelectedAnswer(null);
  };

  const completedCount = Object.keys(practiceCompleted).length;
  const isAllCompleted = completedCount === items.length;

  return (
    <div className="min-h-screen bg-background overflow-auto" style={{ paddingRight: '5rem' }}>
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
            <div className={`w-12 h-12 rounded-2xl ${colors.light} flex items-center justify-center flex-shrink-0`}>
              <span className={`text-xl font-bold ${colors.text}`}>{letters.join('')}</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold truncate">{exercise.title}</h1>
              <p className="text-xs text-muted-foreground truncate">
                {groupName} - {subGroupName}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 text-center min-w-[60px]">
            <p className="text-xs text-muted-foreground">التقدم</p>
            <p className="text-base font-bold">{currentIndex + 1}/{items.length}</p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${colors.bg} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Instruction */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-lg text-muted-foreground">{exercise.instruction}</p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          key={currentIndex}
          className="bg-card rounded-3xl p-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {isMinimalPairs ? (
            /* Minimal Pairs - Quiz Mode */
            <div className="space-y-6">
              {/* Play the first option audio */}
              <div className="flex justify-center mb-6">
                <motion.button
                  onClick={() => handlePlayAudio(currentItem.split(' / ')[0])}
                  className={`w-20 h-20 rounded-full ${colors.bg} text-white flex items-center justify-center shadow-lg`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {isPlaying ? (
                    <Volume2 className="w-9 h-9" />
                  ) : (
                    <Play className="w-9 h-9 mr-[-4px]" />
                  )}
                </motion.button>
              </div>

              <p className="text-center text-muted-foreground mb-4">اختر الصوت الذي سمعته</p>

              {/* Options */}
              <div className="grid grid-cols-2 gap-4">
                {currentItem.split(' / ').map((option, idx) => {
                  const isAnswered = quizAnswers[currentIndex] !== undefined;
                  const isSelected = quizAnswers[currentIndex] === idx;
                  const isCorrectOption = idx === 0;

                  let buttonStyle = `${colors.light} hover:opacity-80 border-transparent`;
                  if (isAnswered) {
                    if (isCorrectOption) buttonStyle = "bg-green-500/20 border-green-500 text-green-500";
                    else if (isSelected) buttonStyle = "bg-red-500/20 border-red-500 text-red-400";
                    else buttonStyle = "bg-muted/50 border-transparent opacity-50";
                  }

                  return (
                    <motion.button
                      key={idx}
                      onClick={() => handleSelectAnswer(idx)}
                      className={`p-6 rounded-2xl text-3xl font-bold border-2 transition-all ${buttonStyle}`}
                      whileHover={!isAnswered ? { scale: 1.02 } : {}}
                      whileTap={!isAnswered ? { scale: 0.98 } : {}}
                      disabled={isAnswered}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {isAnswered && isCorrectOption && <CheckCircle className="w-6 h-6 text-green-500" />}
                        {isAnswered && isSelected && !isCorrectOption && <XCircle className="w-6 h-6 text-red-400" />}
                        {option}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Feedback */}
              {practiceResult[currentIndex] && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl text-center ${
                    practiceResult[currentIndex] === 'correct'
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  <p className="font-bold text-lg">
                    {practiceResult[currentIndex] === 'correct' ? 'إجابة صحيحة!' : 'إجابة خاطئة'}
                  </p>
                </motion.div>
              )}
            </div>
          ) : (
            /* Pronunciation Practice Mode */
            <div className="text-center">
              {/* Big Item Display */}
              <div className={`${colors.light} rounded-2xl p-12 mb-8 inline-block`}>
                <p className={`text-5xl font-bold ${colors.text}`}>{currentItem}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-6 mb-6">
                {/* Play Button */}
                <motion.button
                  onClick={() => handlePlayAudio(currentItem)}
                  className={`w-20 h-20 rounded-full ${colors.bg} text-white flex items-center justify-center shadow-lg active:opacity-100 ${isPlaying ? 'animate-pulse' : ''}`}
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
                    practiceResult[currentIndex] === 'correct' ? 'bg-green-500 text-white' :
                    practiceResult[currentIndex] === 'incorrect' ? 'bg-red-500 text-white' :
                    'bg-muted text-foreground'
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {practiceResult[currentIndex] === 'correct' ? (
                    <CheckCircle className="w-9 h-9" />
                  ) : practiceResult[currentIndex] === 'incorrect' ? (
                    <XCircle className="w-9 h-9" />
                  ) : (
                    <Mic className="w-9 h-9" />
                  )}
                </motion.button>
              </div>

              {/* Feedback Message */}
              {practiceResult[currentIndex] === 'incorrect' ? (
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
                   practiceResult[currentIndex] === 'correct' ? 'أحسنت! انتقل للتالي' :
                   'اضغط على الصوت للاستماع ثم سجل صوتك'}
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <motion.button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl ${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'
            }`}
            whileHover={currentIndex > 0 ? { scale: 1.05 } : {}}
            whileTap={currentIndex > 0 ? { scale: 0.95 } : {}}
          >
            <ChevronRight className="w-5 h-5" />
            السابق
          </motion.button>

          <div className="flex gap-2">
            {items.map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full transition-colors ${
                  idx === currentIndex ? colors.bg :
                  practiceResult[idx] === 'correct' ? 'bg-green-500' :
                  practiceResult[idx] === 'incorrect' ? 'bg-red-500' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <motion.button
            onClick={currentIndex === items.length - 1 ? handleClose : handleNext}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl ${colors.bg} text-white font-semibold`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {currentIndex === items.length - 1 ? 'إنهاء' : 'التالي'}
            {currentIndex < items.length - 1 && <ChevronLeft className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Completion Summary */}
        {isAllCompleted && (
          <motion.div
            className="mt-6 bg-green-500/20 rounded-2xl p-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-green-600 mb-2">أحسنت!</h3>
            <p className="text-muted-foreground mb-4">أكملت التدريب بنجاح</p>
            <div className="flex gap-3 justify-center">
              <motion.button
                onClick={handleRestart}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-muted hover:bg-muted/80"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="w-5 h-5" />
                إعادة التدريب
              </motion.button>
              <motion.button
                onClick={handleClose}
                className={`px-6 py-3 rounded-xl ${colors.bg} text-white font-semibold`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                إنهاء
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MakharijExercise;
