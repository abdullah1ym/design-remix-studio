// ============================================
// أنواع تدريبات الأصوات العربية
// Arabic Sounds Training Types
// Based on: كتاب تدريبات الأصوات العربية
// ============================================

// المراحل التدريبية الاثني عشر - The 12 Training Levels
export type TrainingLevel =
  | 'isolation'        // مستوى الصوت معزول
  | 'cv'               // مستوى الصوت مع مد بعدي (Consonant-Vowel)
  | 'vc'               // مستوى الصوت مع مد قبلي (Vowel-Consonant)
  | 'vcv'              // مستوى الصوت مع مد قبلي و بعدي
  | 'nonsense_words'   // مستوى الكلمات الغير مفهومة (CV.CV)
  | 'real_words'       // مستوى الكلمات الحقيقية
  | 'phrases'          // مستوى العبارات
  | 'sentences'        // مستوى الجمل
  | 'story_retelling'  // مستوى إعادة سرد القصص
  | 'story_telling'    // مستوى سرد القصص
  | 'questions'        // مستوى الإجابة على الأسئلة
  | 'spontaneous';     // مستوى الكلام المسترسل

// ترتيب المراحل للتقدم
export const TRAINING_LEVEL_ORDER: TrainingLevel[] = [
  'isolation',
  'cv',
  'vc',
  'vcv',
  'nonsense_words',
  'real_words',
  'phrases',
  'sentences',
  'story_retelling',
  'story_telling',
  'questions',
  'spontaneous'
];

// أسماء المراحل بالعربية
export const TRAINING_LEVEL_NAMES: Record<TrainingLevel, string> = {
  isolation: 'الصوت معزول',
  cv: 'الصوت مع مد بعدي',
  vc: 'الصوت مع مد قبلي',
  vcv: 'الصوت مع مد قبلي وبعدي',
  nonsense_words: 'الكلمات الغير مفهومة',
  real_words: 'الكلمات الحقيقية',
  phrases: 'العبارات',
  sentences: 'الجمل',
  story_retelling: 'إعادة سرد القصص',
  story_telling: 'سرد القصص',
  questions: 'الإجابة على الأسئلة',
  spontaneous: 'الكلام المسترسل'
};

// موقع الصوت في الكلمة
export type SoundPosition = 'initial' | 'medial' | 'final';

// عدد المقاطع
export type SyllableCount = 'mono' | 'bi' | 'multi';

// مخارج الأصوات - Articulation Points
export type ArticulationPoint =
  | 'throat_deep'      // أقصى الحلق (الهمزة، الهاء)
  | 'throat_middle'    // وسط الحلق (الحاء، العين)
  | 'throat_shallow'   // أدنى الحلق (الغين، الخاء)
  | 'tongue_back'      // أقصى اللسان (القاف، الكاف)
  | 'tongue_middle'    // وسط اللسان (الجيم، الشين، الياء)
  | 'tongue_edge'      // حافة اللسان (الضاد)
  | 'tongue_tip_upper' // طرف اللسان مع أصول الثنايا (التاء، الدال، الطاء)
  | 'tongue_tip_teeth' // طرف اللسان مع الأسنان (الثاء، الذال، الظاء)
  | 'tongue_tip_gum'   // طرف اللسان مع اللثة (النون، الراء، اللام)
  | 'lips'             // الشفتان (الباء، الميم، الواو)
  | 'lip_teeth'        // الشفة السفلى مع الأسنان (الفاء)
  | 'nasal';           // الخيشوم (النون، الميم)

// صفات الأصوات
export type SoundCharacteristic =
  | 'voiced'           // مجهور
  | 'voiceless'        // مهموس
  | 'emphatic'         // مفخم
  | 'non_emphatic'     // مرقق
  | 'stop'             // انفجاري/شديد
  | 'fricative'        // احتكاكي/رخو
  | 'nasal'            // أنفي
  | 'lateral'          // جانبي
  | 'trill';           // تكراري

// حالة الإتقان
export type MasteryStatus = 'locked' | 'available' | 'in_progress' | 'mastered';

// ============================================
// بيانات الصوت العربي
// ============================================

export interface ArabicSound {
  id: string;                          // معرف الصوت
  letter: string;                      // الحرف
  name: string;                        // اسم الحرف
  articulationPoint: ArticulationPoint;
  articulationDescription: string;     // وصف مخرج الصوت
  trainingTip: string;                 // نصيحة التدريب
  characteristics: SoundCharacteristic[];
  similarSounds: string[];             // أصوات مشابهة قد تسبب خلط

  // أمثلة التدريب لكل مرحلة
  examples: {
    isolation: string;
    cv: string[];                      // با، بي، بو
    vc: string[];                      // آب، إيب، أوب
    vcv: string[][];                   // آبا، آبي، آبو...
    nonsenseWords: string[];
    realWords: {
      initial: { mono: string[]; bi: string[]; multi: string[] };
      medial: { mono: string[]; bi: string[]; multi: string[] };
      final: { mono: string[]; bi: string[]; multi: string[] };
    };
    phrases: string[];
    sentences: string[];
    storyRetelling: string;
    storyTellingPrompt: string;
    questions: { question: string; answer: string }[];
    spontaneousPrompt: string;
  };
}

// ============================================
// سؤال تدريب الأصوات
// ============================================

export interface AuditoryQuestion {
  id: string;
  targetSound: string;                 // الصوت المستهدف (e.g., 'ب')
  level: TrainingLevel;                // المرحلة التدريبية
  soundPosition?: SoundPosition;       // موقع الصوت في الكلمة
  syllableCount?: SyllableCount;       // عدد المقاطع

  prompt: string;                      // نص السؤال
  audioDescription: string;            // وصف الصوت (للمحاكاة)
  options: string[];                   // الخيارات
  correctAnswer: number;               // فهرس الإجابة الصحيحة

  distractorSounds?: string[];         // الأصوات المشتتة المستخدمة
  hint?: string;
  explanation?: string;
}

// ============================================
// تقدم الصوت
// ============================================

export interface SoundLevelProgress {
  level: TrainingLevel;
  questionsAttempted: number;
  questionsCorrect: number;
  accuracy: number;
  status: MasteryStatus;
  lastAttemptAt?: string;
  masteredAt?: string;
}

export interface SoundProgress {
  soundId: string;
  letter: string;
  levels: Record<TrainingLevel, SoundLevelProgress>;
  overallAccuracy: number;
  currentLevel: TrainingLevel;
  confusionMatrix: Record<string, number>;  // أصوات يتم الخلط بينها
  strongPositions: SoundPosition[];         // مواقع قوية
  weakPositions: SoundPosition[];           // مواقع ضعيفة
}

// ============================================
// تمرين الأصوات
// ============================================

export interface AuditoryExercise {
  id: string;
  title: string;
  description: string;
  targetSound: string;
  level: TrainingLevel;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions: AuditoryQuestion[];
  estimatedDuration: string;
}

// ============================================
// نتيجة التقييم الذكي
// ============================================

export interface SmartEvaluationResult {
  isCorrect: boolean;
  targetSound: string;
  selectedSound?: string;               // الصوت الذي اختاره المستخدم (إذا كان خطأ)
  isConfusionError: boolean;            // هل هو خطأ خلط بين أصوات متشابهة
  confusedWith?: string;                // الصوت الذي تم الخلط معه
  positionStruggle?: SoundPosition;     // موقع الضعف إذا وجد

  feedback: string;                     // تغذية راجعة مخصصة
  suggestion?: string;                  // اقتراح للتحسين
}

// ============================================
// اقتراحات تدريب الأصوات
// ============================================

export type SoundRecommendationType =
  | 'practice_sound'          // تدرب على صوت معين
  | 'review_articulation'     // راجع مخرج الصوت
  | 'practice_position'       // تدرب على موقع معين
  | 'advance_level'           // انتقل للمستوى التالي
  | 'review_similar_sounds'   // راجع الأصوات المتشابهة
  | 'repeat_level';           // أعد المستوى الحالي

export interface SoundRecommendation {
  type: SoundRecommendationType;
  soundId: string;
  level?: TrainingLevel;
  position?: SoundPosition;
  message: string;
  reason: string;
  priority: number;
}

// ============================================
// إحصائيات الأصوات
// ============================================

export interface SoundStatistics {
  totalSounds: number;
  masteredSounds: number;
  inProgressSounds: number;
  averageAccuracy: number;
  strongestSounds: string[];
  weakestSounds: string[];
  mostConfusedPairs: [string, string][];
  currentFocus: string[];               // الأصوات التي يجب التركيز عليها
}
