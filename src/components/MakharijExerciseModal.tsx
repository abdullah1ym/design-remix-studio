import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, Mic, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface Exercise {
  id: string;
  type: 'isolation' | 'syllables' | 'words' | 'minimal-pairs' | 'sentences';
  title: string;
  instruction: string;
  items: string[];
  correctIndex?: number;
}

interface MakharijExerciseModalProps {
  open: boolean;
  onClose: () => void;
  exercise: Exercise | null;
  groupName: string;
  groupColor: string;
  letters: string[];
}

const colorClasses: Record<string, { bg: string; light: string; text: string }> = {
  jellyfish: { bg: 'bg-jellyfish', light: 'bg-jellyfish/10', text: 'text-jellyfish' },
  coral: { bg: 'bg-coral', light: 'bg-coral/10', text: 'text-coral' },
  primary: { bg: 'bg-primary', light: 'bg-primary/10', text: 'text-primary' },
  turquoise: { bg: 'bg-turquoise', light: 'bg-turquoise/10', text: 'text-turquoise' },
  mint: { bg: 'bg-mint', light: 'bg-mint/10', text: 'text-mint' },
};

const MakharijExerciseModal = ({ open, onClose, exercise, groupName, groupColor, letters }: MakharijExerciseModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const colors = colorClasses[groupColor] || colorClasses.primary;

  const handlePlaySound = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 1000);
  };

  const handleRecord = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setShowSuccess(true);
    }, 2000);
  };

  const handleNext = () => {
    if (exercise && currentIndex < exercise.items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowSuccess(false);
      setSelectedAnswer(null);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowSuccess(false);
      setSelectedAnswer(null);
    }
  };

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowSuccess(true);
  };

  const handleClose = () => {
    setCurrentIndex(0);
    setShowSuccess(false);
    setSelectedAnswer(null);
    setIsPlaying(false);
    setIsRecording(false);
    onClose();
  };

  if (!exercise) return null;

  const currentItem = exercise.items[currentIndex];
  const isLastItem = currentIndex === exercise.items.length - 1;
  const progress = ((currentIndex + 1) / exercise.items.length) * 100;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-card rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
          >
            {/* Header */}
            <div className={`${colors.bg} text-white p-4`}>
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="text-center">
                  <h3 className="font-bold">{exercise.title}</h3>
                  <p className="text-xs opacity-90">{groupName}</p>
                </div>
                <div className="text-sm font-bold">{currentIndex + 1}/{exercise.items.length}</div>
              </div>
              {/* Progress bar */}
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Instruction */}
              <p className="text-center text-muted-foreground mb-6">{exercise.instruction}</p>

              {/* Main Content Area */}
              {!showSuccess ? (
                <div className="space-y-6">
                  {/* Current Item Display */}
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-center"
                  >
                    {exercise.type === 'minimal-pairs' ? (
                      // Minimal pairs - show as options
                      <div className="space-y-3">
                        {currentItem.split(' / ').map((pair, idx) => (
                          <motion.button
                            key={idx}
                            onClick={() => handleSelectAnswer(idx)}
                            className={`w-full p-4 rounded-xl border-2 text-2xl font-bold transition-all ${
                              selectedAnswer === idx
                                ? `${colors.bg} text-white border-transparent`
                                : 'border-muted hover:border-primary'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {pair}
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      // Regular display for other types
                      <>
                        <div className={`${colors.light} rounded-2xl p-8 mb-6`}>
                          <p className="text-4xl font-bold">{currentItem}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-4">
                          {/* Play Button */}
                          <motion.button
                            onClick={handlePlaySound}
                            className={`w-16 h-16 rounded-full ${colors.bg} text-white flex items-center justify-center`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
                            transition={isPlaying ? { repeat: Infinity, duration: 0.3 } : {}}
                          >
                            <Volume2 className="w-7 h-7" />
                          </motion.button>

                          {/* Record Button */}
                          <motion.button
                            onClick={handleRecord}
                            className={`w-16 h-16 rounded-full ${isRecording ? 'bg-red-500' : 'bg-muted'} text-foreground flex items-center justify-center`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                            transition={isRecording ? { repeat: Infinity, duration: 0.5 } : {}}
                          >
                            <Mic className={`w-7 h-7 ${isRecording ? 'text-white' : ''}`} />
                          </motion.button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3">
                          {isRecording ? 'جاري التسجيل...' : 'اضغط للاستماع ثم سجل صوتك'}
                        </p>
                      </>
                    )}
                  </motion.div>
                </div>
              ) : (
                // Success State
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h4 className="text-xl font-bold text-green-600 mb-2">أحسنت!</h4>
                  <p className="text-muted-foreground">
                    {isLastItem ? 'أكملت التدريب!' : 'انتقل للعنصر التالي'}
                  </p>
                </motion.div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <motion.button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                    currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'
                  }`}
                  whileHover={currentIndex > 0 ? { scale: 1.05 } : {}}
                  whileTap={currentIndex > 0 ? { scale: 0.95 } : {}}
                >
                  <ChevronRight className="w-5 h-5" />
                  السابق
                </motion.button>

                <motion.button
                  onClick={handleNext}
                  className={`flex items-center gap-2 px-6 py-2 rounded-xl ${colors.bg} text-white font-semibold`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLastItem ? 'إنهاء' : 'التالي'}
                  {!isLastItem && <ChevronLeft className="w-5 h-5" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MakharijExerciseModal;
