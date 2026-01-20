// ============================================
// الحكم الذكي - Smart Judge
// تقييم الإجابات مع الوعي الصوتي
// ============================================

import {
  TrainingLevel,
  SoundPosition,
  SmartEvaluationResult,
  ArticulationPoint
} from "@/types/arabic-sounds";
import { arabicSounds, getSoundByLetter, getSimilarSounds } from "@/data/arabic-sounds";

// ============================================
// خريطة التشابه الصوتي
// ============================================

// أصوات متشابهة في المخرج
const ARTICULATION_GROUPS: Record<ArticulationPoint, string[]> = {
  throat_deep: ['ء', 'ه'],
  throat_middle: ['ح', 'ع'],
  throat_shallow: ['غ', 'خ'],
  tongue_back: ['ق', 'ك'],
  tongue_middle: ['ج', 'ش', 'ي'],
  tongue_edge: ['ض'],
  tongue_tip_upper: ['ت', 'د', 'ط'],
  tongue_tip_teeth: ['ث', 'ذ', 'ظ'],
  tongue_tip_gum: ['ن', 'ر', 'ل'],
  lips: ['ب', 'م', 'و'],
  lip_teeth: ['ف'],
  nasal: ['ن', 'م']
};

// أزواج الأصوات المجهورة والمهموسة
const VOICED_VOICELESS_PAIRS: [string, string][] = [
  ['ب', 'ف'],
  ['د', 'ت'],
  ['ذ', 'ث'],
  ['ز', 'س'],
  ['ج', 'ش'],
  ['ظ', 'ث'],
  ['ض', 'ص'],
  ['غ', 'خ']
];

// أزواج الأصوات المفخمة والمرققة
const EMPHATIC_PAIRS: [string, string][] = [
  ['ط', 'ت'],
  ['ظ', 'ذ'],
  ['ص', 'س'],
  ['ض', 'د'],
  ['ق', 'ك']
];

// ============================================
// دوال المساعدة
// ============================================

// التحقق من أن صوتين من نفس المخرج
const areSameArticulationPoint = (sound1: string, sound2: string): boolean => {
  const s1 = getSoundByLetter(sound1);
  const s2 = getSoundByLetter(sound2);
  return s1?.articulationPoint === s2?.articulationPoint;
};

// التحقق من أن صوتين زوج مجهور/مهموس
const areVoicedVoicelessPair = (sound1: string, sound2: string): boolean => {
  return VOICED_VOICELESS_PAIRS.some(
    ([a, b]) => (a === sound1 && b === sound2) || (a === sound2 && b === sound1)
  );
};

// التحقق من أن صوتين زوج مفخم/مرقق
const areEmphaticPair = (sound1: string, sound2: string): boolean => {
  return EMPHATIC_PAIRS.some(
    ([a, b]) => (a === sound1 && b === sound2) || (a === sound2 && b === sound1)
  );
};

// استخراج الصوت الرئيسي من خيار
const extractMainSound = (option: string, targetSound: string): string | null => {
  // إذا كان الخيار هو الحرف نفسه
  if (option.length === 1) return option;

  // البحث عن أصوات متشابهة في الخيار
  const similarSounds = getSimilarSounds(targetSound);

  // التحقق من وجود الصوت المستهدف
  if (option.includes(targetSound)) return targetSound;

  // التحقق من وجود أصوات متشابهة
  for (const similar of similarSounds) {
    if (option.includes(similar)) return similar;
  }

  // البحث عن أي حرف عربي في الخيار
  const arabicLetters = option.match(/[\u0621-\u064A]/g);
  if (arabicLetters && arabicLetters.length > 0) {
    return arabicLetters[0];
  }

  return null;
};

// حساب درجة التشابه بين صوتين
const calculateSimilarityScore = (sound1: string, sound2: string): number => {
  if (sound1 === sound2) return 1.0;

  let score = 0;

  // نفس المخرج
  if (areSameArticulationPoint(sound1, sound2)) {
    score += 0.4;
  }

  // زوج مجهور/مهموس
  if (areVoicedVoicelessPair(sound1, sound2)) {
    score += 0.3;
  }

  // زوج مفخم/مرقق
  if (areEmphaticPair(sound1, sound2)) {
    score += 0.3;
  }

  // من قائمة الأصوات المتشابهة
  const similarSounds = getSimilarSounds(sound1);
  if (similarSounds.includes(sound2)) {
    score += 0.2;
  }

  return Math.min(score, 0.9);
};

// ============================================
// توليد التغذية الراجعة المفصلة
// ============================================

interface DetailedFeedback {
  message: string;
  explanation?: string;
  tip?: string;
  practiceWords?: string[];
}

const generateDetailedFeedback = (
  isCorrect: boolean,
  targetSound: string,
  selectedSound: string | null,
  level: TrainingLevel,
  position?: SoundPosition
): DetailedFeedback => {
  const sound = getSoundByLetter(targetSound);

  if (isCorrect) {
    const positiveMessages = [
      'أحسنت! إجابة صحيحة',
      'ممتاز! استمر في التقدم',
      'رائع! أداء متميز',
      'صحيح! عمل جيد',
      'بارك الله فيك! إجابة موفقة'
    ];

    return {
      message: positiveMessages[Math.floor(Math.random() * positiveMessages.length)],
      tip: level === 'isolation' && sound
        ? `تذكر: ${sound.letter} مخرجه ${sound.articulationDescription}`
        : undefined
    };
  }

  // خطأ - تحليل نوع الخطأ
  if (!selectedSound || !sound) {
    return {
      message: 'إجابة خاطئة',
      explanation: `الإجابة الصحيحة تحتوي على صوت ${targetSound}`,
      tip: sound ? `ركز على: ${sound.trainingTip}` : undefined
    };
  }

  const selectedSoundData = getSoundByLetter(selectedSound);
  const similarity = calculateSimilarityScore(targetSound, selectedSound);

  // خطأ خلط بين أصوات متشابهة جداً
  if (similarity >= 0.5) {
    let explanation = `خلطت بين صوت ${targetSound} وصوت ${selectedSound}`;
    let tip = '';

    if (areSameArticulationPoint(targetSound, selectedSound)) {
      explanation += ' - كلاهما من نفس المخرج';
      tip = `الفرق: ${sound.trainingTip}`;
    } else if (areVoicedVoicelessPair(targetSound, selectedSound)) {
      explanation += ' - أحدهما مجهور والآخر مهموس';
      tip = `${targetSound} ${sound.characteristics.includes('voiced') ? 'مجهور' : 'مهموس'}، بينما ${selectedSound} ${selectedSoundData?.characteristics.includes('voiced') ? 'مجهور' : 'مهموس'}`;
    } else if (areEmphaticPair(targetSound, selectedSound)) {
      explanation += ' - أحدهما مفخم والآخر مرقق';
      tip = `${targetSound} ${sound.characteristics.includes('emphatic') ? 'مفخم' : 'مرقق'}، لاحظ ضخامة الصوت`;
    }

    return {
      message: 'إجابة خاطئة - خلط بين أصوات متشابهة',
      explanation,
      tip,
      practiceWords: sound.examples.realWords.initial.bi.slice(0, 3)
    };
  }

  // خطأ عام
  return {
    message: 'إجابة خاطئة',
    explanation: `الصوت الصحيح هو ${targetSound} (${sound.name})`,
    tip: `مخرج صوت ${targetSound}: ${sound.articulationDescription}`,
    practiceWords: sound.examples.realWords.initial.mono.slice(0, 2)
  };
};

// ============================================
// الحكم الذكي الرئيسي
// ============================================

export interface JudgeInput {
  targetSound: string;
  selectedAnswer: number;
  correctAnswer: number;
  options: string[];
  level: TrainingLevel;
  position?: SoundPosition;
}

export interface JudgeOutput extends SmartEvaluationResult {
  similarityScore: number;
  confusionType?: 'articulation' | 'voicing' | 'emphasis' | 'other';
  detailedFeedback: DetailedFeedback;
  shouldRepeat: boolean;
  nextAction: 'continue' | 'review' | 'practice_similar' | 'repeat';
}

export const smartJudge = (input: JudgeInput): JudgeOutput => {
  const {
    targetSound,
    selectedAnswer,
    correctAnswer,
    options,
    level,
    position
  } = input;

  const isCorrect = selectedAnswer === correctAnswer;
  const selectedOption = options[selectedAnswer];
  const selectedSound = extractMainSound(selectedOption, targetSound);

  // تحليل الخطأ
  let isConfusionError = false;
  let confusedWith: string | undefined;
  let confusionType: 'articulation' | 'voicing' | 'emphasis' | 'other' | undefined;
  let similarityScore = 0;

  if (!isCorrect && selectedSound && selectedSound !== targetSound) {
    similarityScore = calculateSimilarityScore(targetSound, selectedSound);

    if (similarityScore >= 0.3) {
      isConfusionError = true;
      confusedWith = selectedSound;

      // تحديد نوع الخلط
      if (areSameArticulationPoint(targetSound, selectedSound)) {
        confusionType = 'articulation';
      } else if (areVoicedVoicelessPair(targetSound, selectedSound)) {
        confusionType = 'voicing';
      } else if (areEmphaticPair(targetSound, selectedSound)) {
        confusionType = 'emphasis';
      } else {
        confusionType = 'other';
      }
    }
  }

  // توليد التغذية الراجعة
  const detailedFeedback = generateDetailedFeedback(
    isCorrect,
    targetSound,
    selectedSound,
    level,
    position
  );

  // تحديد الإجراء التالي
  let nextAction: 'continue' | 'review' | 'practice_similar' | 'repeat' = 'continue';
  let shouldRepeat = false;

  if (!isCorrect) {
    if (isConfusionError && similarityScore >= 0.5) {
      nextAction = 'practice_similar';
      shouldRepeat = true;
    } else if (level === 'isolation' || level === 'cv' || level === 'vc') {
      nextAction = 'review';
      shouldRepeat = true;
    } else {
      nextAction = 'repeat';
    }
  }

  return {
    isCorrect,
    targetSound,
    selectedSound: isCorrect ? undefined : selectedOption,
    isConfusionError,
    confusedWith,
    positionStruggle: !isCorrect ? position : undefined,
    feedback: detailedFeedback.message,
    suggestion: detailedFeedback.tip,
    similarityScore,
    confusionType,
    detailedFeedback,
    shouldRepeat,
    nextAction
  };
};

// ============================================
// تحليل نمط الأخطاء
// ============================================

export interface ErrorPattern {
  type: 'confusion' | 'position' | 'level' | 'random';
  description: string;
  frequency: number;
  recommendation: string;
}

export const analyzeErrorPatterns = (
  errors: Array<{
    targetSound: string;
    selectedSound?: string;
    position?: SoundPosition;
    level: TrainingLevel;
  }>
): ErrorPattern[] => {
  const patterns: ErrorPattern[] = [];
  const confusionCounts: Record<string, number> = {};
  const positionCounts: Record<SoundPosition, number> = {
    initial: 0,
    medial: 0,
    final: 0
  };

  errors.forEach(error => {
    // تتبع الخلط
    if (error.selectedSound) {
      const key = [error.targetSound, error.selectedSound].sort().join('-');
      confusionCounts[key] = (confusionCounts[key] || 0) + 1;
    }

    // تتبع المواقع
    if (error.position) {
      positionCounts[error.position]++;
    }
  });

  // تحليل أنماط الخلط
  Object.entries(confusionCounts).forEach(([pair, count]) => {
    if (count >= 2) {
      const [s1, s2] = pair.split('-');
      patterns.push({
        type: 'confusion',
        description: `خلط متكرر بين ${s1} و ${s2}`,
        frequency: count,
        recommendation: `تدرب على التمييز بين صوت ${s1} وصوت ${s2}`
      });
    }
  });

  // تحليل أنماط المواقع
  const maxPosition = Object.entries(positionCounts)
    .sort((a, b) => b[1] - a[1])[0];

  if (maxPosition && maxPosition[1] >= 3) {
    const positionNames: Record<SoundPosition, string> = {
      initial: 'بداية الكلمة',
      medial: 'وسط الكلمة',
      final: 'نهاية الكلمة'
    };

    patterns.push({
      type: 'position',
      description: `صعوبة في موقع ${positionNames[maxPosition[0] as SoundPosition]}`,
      frequency: maxPosition[1],
      recommendation: `ركز على تدريبات الأصوات في ${positionNames[maxPosition[0] as SoundPosition]}`
    });
  }

  return patterns.sort((a, b) => b.frequency - a.frequency);
};

// ============================================
// اقتراح التمرين التالي
// ============================================

export interface NextExerciseSuggestion {
  soundId: string;
  level: TrainingLevel;
  position?: SoundPosition;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export const suggestNextExercise = (
  currentSound: string,
  recentResults: Array<{ isCorrect: boolean; level: TrainingLevel; position?: SoundPosition }>,
  confusionMatrix: Record<string, number>
): NextExerciseSuggestion => {
  const sound = getSoundByLetter(currentSound);
  if (!sound) {
    return {
      soundId: 'hamza',
      level: 'isolation',
      reason: 'ابدأ من البداية',
      priority: 'medium'
    };
  }

  // حساب نسبة النجاح الأخيرة
  const recentCorrect = recentResults.filter(r => r.isCorrect).length;
  const recentAccuracy = recentResults.length > 0
    ? (recentCorrect / recentResults.length) * 100
    : 0;

  // إذا كانت الدقة منخفضة جداً
  if (recentAccuracy < 40) {
    return {
      soundId: sound.id,
      level: 'isolation',
      reason: 'تحتاج مراجعة أساسيات الصوت',
      priority: 'high'
    };
  }

  // التحقق من وجود خلط متكرر
  const confusedPairs = Object.entries(confusionMatrix)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1]);

  if (confusedPairs.length > 0) {
    return {
      soundId: sound.id,
      level: 'isolation',
      reason: `تدرب على التمييز بين ${currentSound} و ${confusedPairs[0][0]}`,
      priority: 'high'
    };
  }

  // تحديد الموقع الضعيف
  const positionErrors: Record<SoundPosition, number> = {
    initial: 0,
    medial: 0,
    final: 0
  };

  recentResults.forEach(r => {
    if (!r.isCorrect && r.position) {
      positionErrors[r.position]++;
    }
  });

  const weakPosition = Object.entries(positionErrors)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])[0];

  if (weakPosition) {
    return {
      soundId: sound.id,
      level: 'real_words',
      position: weakPosition[0] as SoundPosition,
      reason: `تعزيز الصوت في ${weakPosition[0] === 'initial' ? 'بداية' : weakPosition[0] === 'medial' ? 'وسط' : 'نهاية'} الكلمة`,
      priority: 'medium'
    };
  }

  // الانتقال للمستوى التالي
  const currentLevel = recentResults[recentResults.length - 1]?.level || 'isolation';
  const levels: TrainingLevel[] = [
    'isolation', 'cv', 'vc', 'vcv', 'nonsense_words',
    'real_words', 'phrases', 'sentences'
  ];
  const currentIndex = levels.indexOf(currentLevel);
  const nextLevel = levels[Math.min(currentIndex + 1, levels.length - 1)];

  return {
    soundId: sound.id,
    level: nextLevel,
    reason: recentAccuracy >= 80 ? 'أداء ممتاز! انتقل للمستوى التالي' : 'استمر في التدريب',
    priority: 'low'
  };
};
