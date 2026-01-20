import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  TrainingLevel,
  SoundPosition,
  SoundProgress,
  SoundLevelProgress,
  SoundRecommendation,
  SoundStatistics,
  SmartEvaluationResult,
  TRAINING_LEVEL_ORDER,
  MasteryStatus
} from "@/types/arabic-sounds";
import { arabicSounds, getSoundByLetter, getSimilarSounds, getNextLevel } from "@/data/arabic-sounds";

// ============================================
// واجهة السياق
// ============================================

interface SoundProgressContextType {
  // تقدم الأصوات
  soundProgress: Record<string, SoundProgress>;
  getSoundProgress: (soundId: string) => SoundProgress | undefined;

  // تسجيل الإجابات
  recordAnswer: (
    soundId: string,
    level: TrainingLevel,
    isCorrect: boolean,
    position?: SoundPosition,
    selectedSound?: string
  ) => SmartEvaluationResult;

  // التقييم الذكي
  evaluateAnswer: (
    targetSound: string,
    selectedAnswer: number,
    correctAnswer: number,
    options: string[],
    level: TrainingLevel,
    position?: SoundPosition
  ) => SmartEvaluationResult;

  // الاقتراحات
  getRecommendations: (soundId?: string) => SoundRecommendation[];
  getNextExercise: (soundId: string) => { level: TrainingLevel; position?: SoundPosition } | null;

  // الإحصائيات
  getStatistics: () => SoundStatistics;
  getSoundMasteryStatus: (soundId: string, level: TrainingLevel) => MasteryStatus;

  // إعادة التعيين
  resetSoundProgress: (soundId: string) => void;
  resetAllProgress: () => void;
}

const STORAGE_KEY = "divedive-sound-progress";
const MASTERY_THRESHOLD = 80; // نسبة الإتقان المطلوبة
const MIN_QUESTIONS_FOR_MASTERY = 5; // الحد الأدنى من الأسئلة للإتقان

// ============================================
// السياق
// ============================================

const SoundProgressContext = createContext<SoundProgressContextType | undefined>(undefined);

// ============================================
// تهيئة تقدم الصوت
// ============================================

// Set to true to unlock all levels for testing
const TESTING_MODE = true;

const initializeSoundProgress = (soundId: string): SoundProgress => {
  const sound = arabicSounds.find(s => s.id === soundId);
  const levels: Record<TrainingLevel, SoundLevelProgress> = {} as Record<TrainingLevel, SoundLevelProgress>;

  TRAINING_LEVEL_ORDER.forEach((level, index) => {
    levels[level] = {
      level,
      questionsAttempted: 0,
      questionsCorrect: 0,
      accuracy: 0,
      status: TESTING_MODE ? 'available' : (index === 0 ? 'available' : 'locked')
    };
  });

  return {
    soundId,
    letter: sound?.letter || '',
    levels,
    overallAccuracy: 0,
    currentLevel: 'isolation',
    confusionMatrix: {},
    strongPositions: [],
    weakPositions: []
  };
};

// ============================================
// حساب الدقة
// ============================================

const calculateAccuracy = (correct: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};

// ============================================
// تحديد حالة الإتقان
// ============================================

const determineMasteryStatus = (levelProgress: SoundLevelProgress): MasteryStatus => {
  if (levelProgress.questionsAttempted === 0) {
    return levelProgress.status === 'locked' ? 'locked' : 'available';
  }

  if (levelProgress.questionsAttempted < MIN_QUESTIONS_FOR_MASTERY) {
    return 'in_progress';
  }

  if (levelProgress.accuracy >= MASTERY_THRESHOLD) {
    return 'mastered';
  }

  return 'in_progress';
};

// ============================================
// توليد التغذية الراجعة
// ============================================

const generateFeedback = (
  isCorrect: boolean,
  targetSound: string,
  isConfusionError: boolean,
  confusedWith?: string
): { feedback: string; suggestion?: string } => {
  if (isCorrect) {
    const positiveMessages = [
      "أحسنت! إجابة صحيحة",
      "ممتاز! استمر",
      "رائع! أداء متميز",
      "صحيح! عمل جيد"
    ];
    return {
      feedback: positiveMessages[Math.floor(Math.random() * positiveMessages.length)]
    };
  }

  if (isConfusionError && confusedWith) {
    const sound = getSoundByLetter(targetSound);
    const confusedSound = getSoundByLetter(confusedWith);

    return {
      feedback: `خلطت بين صوت ${targetSound} وصوت ${confusedWith}`,
      suggestion: sound && confusedSound
        ? `تذكر: ${targetSound} مخرجه ${sound.articulationDescription}، بينما ${confusedWith} مخرجه ${confusedSound.articulationDescription}`
        : `ركز على الفرق بين صوت ${targetSound} وصوت ${confusedWith}`
    };
  }

  return {
    feedback: "إجابة خاطئة، حاول مرة أخرى",
    suggestion: `ركز على صوت ${targetSound} وتدرب على تمييزه`
  };
};

// ============================================
// المزود
// ============================================

export const SoundProgressProvider = ({ children }: { children: ReactNode }) => {
  const [soundProgress, setSoundProgress] = useState<Record<string, SoundProgress>>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return {};
      }
    }
    return {};
  });

  // حفظ التقدم في التخزين المحلي
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(soundProgress));
  }, [soundProgress]);

  // الحصول على تقدم صوت معين
  const getSoundProgress = (soundId: string): SoundProgress | undefined => {
    return soundProgress[soundId];
  };

  // التقييم الذكي للإجابة
  const evaluateAnswer = (
    targetSound: string,
    selectedAnswer: number,
    correctAnswer: number,
    options: string[],
    level: TrainingLevel,
    position?: SoundPosition
  ): SmartEvaluationResult => {
    const isCorrect = selectedAnswer === correctAnswer;
    const selectedOption = options[selectedAnswer];

    // التحقق من خطأ الخلط
    let isConfusionError = false;
    let confusedWith: string | undefined;

    if (!isCorrect) {
      const similarSounds = getSimilarSounds(targetSound);

      // استخراج الصوت من الخيار المحدد
      for (const similar of similarSounds) {
        if (selectedOption?.includes(similar)) {
          isConfusionError = true;
          confusedWith = similar;
          break;
        }
      }
    }

    const { feedback, suggestion } = generateFeedback(
      isCorrect,
      targetSound,
      isConfusionError,
      confusedWith
    );

    return {
      isCorrect,
      targetSound,
      selectedSound: isCorrect ? undefined : selectedOption,
      isConfusionError,
      confusedWith,
      positionStruggle: !isCorrect ? position : undefined,
      feedback,
      suggestion
    };
  };

  // تسجيل الإجابة وتحديث التقدم
  const recordAnswer = (
    soundId: string,
    level: TrainingLevel,
    isCorrect: boolean,
    position?: SoundPosition,
    selectedSound?: string
  ): SmartEvaluationResult => {
    const sound = arabicSounds.find(s => s.id === soundId);
    const targetSound = sound?.letter || '';

    // التحقق من خطأ الخلط
    let isConfusionError = false;
    let confusedWith: string | undefined;

    if (!isCorrect && selectedSound) {
      const similarSounds = getSimilarSounds(targetSound);
      if (similarSounds.includes(selectedSound)) {
        isConfusionError = true;
        confusedWith = selectedSound;
      }
    }

    setSoundProgress(prev => {
      const current = prev[soundId] || initializeSoundProgress(soundId);
      const levelProgress = { ...current.levels[level] };

      // تحديث إحصائيات المستوى
      levelProgress.questionsAttempted += 1;
      if (isCorrect) {
        levelProgress.questionsCorrect += 1;
      }
      levelProgress.accuracy = calculateAccuracy(
        levelProgress.questionsCorrect,
        levelProgress.questionsAttempted
      );
      levelProgress.lastAttemptAt = new Date().toISOString();
      levelProgress.status = determineMasteryStatus(levelProgress);

      if (levelProgress.status === 'mastered' && !levelProgress.masteredAt) {
        levelProgress.masteredAt = new Date().toISOString();
      }

      // تحديث مصفوفة الخلط
      const confusionMatrix = { ...current.confusionMatrix };
      if (isConfusionError && confusedWith) {
        confusionMatrix[confusedWith] = (confusionMatrix[confusedWith] || 0) + 1;
      }

      // تحديث المواقع القوية والضعيفة
      const positionStats: Record<SoundPosition, { correct: number; total: number }> = {
        initial: { correct: 0, total: 0 },
        medial: { correct: 0, total: 0 },
        final: { correct: 0, total: 0 }
      };

      // إذا كان هناك موقع محدد
      if (position) {
        // نحتاج لتتبع هذا بشكل منفصل - للتبسيط نستخدم التقدم الحالي
        positionStats[position].total += 1;
        if (isCorrect) {
          positionStats[position].correct += 1;
        }
      }

      // تحديد المواقع القوية والضعيفة
      const strongPositions: SoundPosition[] = [];
      const weakPositions: SoundPosition[] = [];

      (Object.keys(positionStats) as SoundPosition[]).forEach(pos => {
        const stats = positionStats[pos];
        if (stats.total >= 3) {
          const accuracy = calculateAccuracy(stats.correct, stats.total);
          if (accuracy >= 80) {
            strongPositions.push(pos);
          } else if (accuracy < 50) {
            weakPositions.push(pos);
          }
        }
      });

      // حساب الدقة الإجمالية
      const allLevels = { ...current.levels, [level]: levelProgress };
      let totalCorrect = 0;
      let totalAttempted = 0;

      Object.values(allLevels).forEach(lp => {
        totalCorrect += lp.questionsCorrect;
        totalAttempted += lp.questionsAttempted;
      });

      const overallAccuracy = calculateAccuracy(totalCorrect, totalAttempted);

      // تحديد المستوى الحالي
      let currentLevel = current.currentLevel;
      if (levelProgress.status === 'mastered') {
        const nextLevel = getNextLevel(level);
        if (nextLevel && allLevels[nextLevel].status === 'locked') {
          allLevels[nextLevel] = { ...allLevels[nextLevel], status: 'available' };
        }
        if (nextLevel) {
          currentLevel = nextLevel;
        }
      }

      return {
        ...prev,
        [soundId]: {
          ...current,
          levels: allLevels,
          overallAccuracy,
          currentLevel,
          confusionMatrix,
          strongPositions: [...new Set([...current.strongPositions, ...strongPositions])],
          weakPositions: weakPositions.length > 0 ? weakPositions : current.weakPositions
        }
      };
    });

    const { feedback, suggestion } = generateFeedback(
      isCorrect,
      targetSound,
      isConfusionError,
      confusedWith
    );

    return {
      isCorrect,
      targetSound,
      selectedSound: isCorrect ? undefined : selectedSound,
      isConfusionError,
      confusedWith,
      positionStruggle: !isCorrect ? position : undefined,
      feedback,
      suggestion
    };
  };

  // الحصول على الاقتراحات
  const getRecommendations = (soundId?: string): SoundRecommendation[] => {
    const recommendations: SoundRecommendation[] = [];

    const progressToAnalyze = soundId
      ? { [soundId]: soundProgress[soundId] }
      : soundProgress;

    Object.entries(progressToAnalyze).forEach(([id, progress]) => {
      if (!progress) return;

      const sound = arabicSounds.find(s => s.id === id);
      if (!sound) return;

      // اقتراح مراجعة مخرج الصوت إذا كانت الدقة منخفضة
      if (progress.overallAccuracy < 50 && progress.levels[progress.currentLevel].questionsAttempted >= 3) {
        recommendations.push({
          type: 'review_articulation',
          soundId: id,
          message: `راجع مخرج صوت ${sound.letter}`,
          reason: `دقتك ${progress.overallAccuracy}% - مراجعة المخرج ستساعدك`,
          priority: 1
        });
      }

      // اقتراح التدرب على موقع ضعيف
      if (progress.weakPositions.length > 0) {
        const positionNames: Record<SoundPosition, string> = {
          initial: 'بداية الكلمة',
          medial: 'وسط الكلمة',
          final: 'نهاية الكلمة'
        };

        recommendations.push({
          type: 'practice_position',
          soundId: id,
          position: progress.weakPositions[0],
          message: `تدرب على ${sound.letter} في ${positionNames[progress.weakPositions[0]]}`,
          reason: 'موقع ضعيف يحتاج تعزيز',
          priority: 2
        });
      }

      // اقتراح مراجعة الأصوات المتشابهة
      const confusedSounds = Object.entries(progress.confusionMatrix)
        .filter(([, count]) => count >= 2)
        .sort((a, b) => b[1] - a[1]);

      if (confusedSounds.length > 0) {
        recommendations.push({
          type: 'review_similar_sounds',
          soundId: id,
          message: `راجع الفرق بين ${sound.letter} و ${confusedSounds[0][0]}`,
          reason: `خلطت بينهما ${confusedSounds[0][1]} مرات`,
          priority: 2
        });
      }

      // اقتراح الانتقال للمستوى التالي
      const currentLevelProgress = progress.levels[progress.currentLevel];
      if (currentLevelProgress.status === 'mastered') {
        const nextLevel = getNextLevel(progress.currentLevel);
        if (nextLevel) {
          recommendations.push({
            type: 'advance_level',
            soundId: id,
            level: nextLevel,
            message: `انتقل للمستوى التالي: ${nextLevel}`,
            reason: `أتقنت المستوى الحالي بدقة ${currentLevelProgress.accuracy}%`,
            priority: 3
          });
        }
      }
    });

    return recommendations.sort((a, b) => a.priority - b.priority);
  };

  // الحصول على التمرين التالي المقترح
  const getNextExercise = (soundId: string): { level: TrainingLevel; position?: SoundPosition } | null => {
    const progress = soundProgress[soundId];

    if (!progress) {
      return { level: 'isolation' };
    }

    // إذا كان هناك موقع ضعيف، اقترح التدرب عليه
    if (progress.weakPositions.length > 0 &&
        ['real_words', 'phrases', 'sentences'].includes(progress.currentLevel)) {
      return {
        level: progress.currentLevel,
        position: progress.weakPositions[0]
      };
    }

    // اقترح المستوى الحالي أو التالي
    const currentLevelProgress = progress.levels[progress.currentLevel];
    if (currentLevelProgress.status === 'mastered') {
      const nextLevel = getNextLevel(progress.currentLevel);
      if (nextLevel) {
        return { level: nextLevel };
      }
    }

    return { level: progress.currentLevel };
  };

  // الحصول على حالة إتقان صوت في مستوى معين
  const getSoundMasteryStatus = (soundId: string, level: TrainingLevel): MasteryStatus => {
    const progress = soundProgress[soundId];
    if (!progress) {
      return TESTING_MODE ? 'available' : (level === 'isolation' ? 'available' : 'locked');
    }
    return progress.levels[level].status;
  };

  // الحصول على الإحصائيات العامة
  const getStatistics = (): SoundStatistics => {
    const allProgress = Object.values(soundProgress);

    // حساب الأصوات المتقنة
    const masteredSounds = allProgress.filter(p => {
      const masteredLevels = Object.values(p.levels).filter(l => l.status === 'mastered').length;
      return masteredLevels >= 6; // نعتبر الصوت متقناً إذا أتقن 6 مستويات على الأقل
    }).length;

    // الأصوات قيد التقدم
    const inProgressSounds = allProgress.filter(p => {
      const hasProgress = Object.values(p.levels).some(l => l.questionsAttempted > 0);
      const masteredLevels = Object.values(p.levels).filter(l => l.status === 'mastered').length;
      return hasProgress && masteredLevels < 6;
    }).length;

    // متوسط الدقة
    const accuracies = allProgress.map(p => p.overallAccuracy).filter(a => a > 0);
    const averageAccuracy = accuracies.length > 0
      ? Math.round(accuracies.reduce((a, b) => a + b, 0) / accuracies.length)
      : 0;

    // أقوى الأصوات
    const sortedByAccuracy = [...allProgress]
      .filter(p => p.overallAccuracy > 0)
      .sort((a, b) => b.overallAccuracy - a.overallAccuracy);

    const strongestSounds = sortedByAccuracy.slice(0, 3).map(p => p.letter);
    const weakestSounds = sortedByAccuracy.slice(-3).reverse().map(p => p.letter);

    // أكثر الأصوات خلطاً
    const confusionPairs: Map<string, number> = new Map();
    allProgress.forEach(p => {
      Object.entries(p.confusionMatrix).forEach(([confused, count]) => {
        const pair = [p.letter, confused].sort().join('-');
        confusionPairs.set(pair, (confusionPairs.get(pair) || 0) + count);
      });
    });

    const mostConfusedPairs = Array.from(confusionPairs.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([pair]) => pair.split('-') as [string, string]);

    // الأصوات التي يجب التركيز عليها
    const currentFocus = allProgress
      .filter(p => p.overallAccuracy < 60 && p.overallAccuracy > 0)
      .sort((a, b) => a.overallAccuracy - b.overallAccuracy)
      .slice(0, 3)
      .map(p => p.letter);

    return {
      totalSounds: arabicSounds.length,
      masteredSounds,
      inProgressSounds,
      averageAccuracy,
      strongestSounds,
      weakestSounds,
      mostConfusedPairs,
      currentFocus
    };
  };

  // إعادة تعيين تقدم صوت معين
  const resetSoundProgress = (soundId: string) => {
    setSoundProgress(prev => {
      const { [soundId]: _, ...rest } = prev;
      return rest;
    });
  };

  // إعادة تعيين كل التقدم
  const resetAllProgress = () => {
    setSoundProgress({});
  };

  return (
    <SoundProgressContext.Provider value={{
      soundProgress,
      getSoundProgress,
      recordAnswer,
      evaluateAnswer,
      getRecommendations,
      getNextExercise,
      getStatistics,
      getSoundMasteryStatus,
      resetSoundProgress,
      resetAllProgress
    }}>
      {children}
    </SoundProgressContext.Provider>
  );
};

// ============================================
// Hook للاستخدام
// ============================================

export const useSoundProgress = () => {
  const context = useContext(SoundProgressContext);
  if (!context) {
    throw new Error("useSoundProgress must be used within a SoundProgressProvider");
  }
  return context;
};
