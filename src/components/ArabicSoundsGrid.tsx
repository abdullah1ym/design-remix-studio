import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SoundExerciseModal from "@/components/SoundExerciseModal";

const arabicLetters = [
  'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ',
  'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص',
  'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق',
  'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
];

const ArabicSoundsGrid = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [soundExerciseOpen, setSoundExerciseOpen] = useState(false);

  // Check if we should reopen the modal for a specific sound
  useEffect(() => {
    const state = location.state as { openSoundId?: string } | null;
    if (state?.openSoundId) {
      setSelectedLetter(state.openSoundId);
      setSoundExerciseOpen(true);
      // Clear the state so it doesn't reopen on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
    setSoundExerciseOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold">تدريب اصوات العربية</h2>
        <p className="text-sm text-muted-foreground">اختر حرفاً للتدريب على نطقه - 12 مرحلة تدريبية لكل صوت</p>
      </motion.div>

      {/* Letters Grid */}
      <div className="grid grid-cols-7 gap-3">
        {arabicLetters.map((letter, index) => (
          <motion.button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            className="aspect-square rounded-xl flex items-center justify-center text-3xl font-bold transition-all bg-card hover:bg-primary hover:text-primary-foreground"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {letter}
          </motion.button>
        ))}
      </div>

      {/* Sound Exercise Modal */}
      <SoundExerciseModal
        isOpen={soundExerciseOpen}
        onClose={() => setSoundExerciseOpen(false)}
        initialSoundId={selectedLetter || undefined}
      />
    </div>
  );
};

export default ArabicSoundsGrid;
