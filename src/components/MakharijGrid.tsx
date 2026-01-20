import { useState } from "react";
import { motion } from "framer-motion";
import MakharijExerciseModal from "./MakharijExerciseModal";
import { Exercise as GlobalExercise } from "@/contexts/ExercisesContext";

interface LocalExercise {
  id: string;
  type: 'isolation' | 'syllables' | 'words' | 'minimal-pairs' | 'sentences';
  title: string;
  instruction: string;
  items: string[];
  correctIndex?: number;
}

interface MakharijGridProps {
  onExerciseClick?: (exercise: GlobalExercise) => void;
}

// Convert local exercise format to global Exercise format
const convertToGlobalExercise = (
  exercise: LocalExercise,
  groupName: string,
  subGroupName: string,
  letters: string[]
): GlobalExercise => {
  const typeLabels: Record<string, string> = {
    'isolation': 'صوت مفرد',
    'syllables': 'مقاطع',
    'words': 'كلمات',
    'minimal-pairs': 'أزواج متشابهة',
    'sentences': 'جمل',
  };

  // Create questions from items
  const questions = exercise.items.map((item, index) => ({
    id: `${exercise.id}-q${index}`,
    prompt: exercise.type === 'minimal-pairs'
      ? `استمع وحدد الصوت الصحيح: ${item.split(' / ')[0]}`
      : `استمع وردد: ${item}`,
    audioPlaceholder: item.split(' / ')[0],
    options: exercise.type === 'minimal-pairs'
      ? item.split(' / ')
      : [item, ...exercise.items.filter((_, i) => i !== index).slice(0, 3)],
    correctAnswer: 0,
  }));

  return {
    id: exercise.id,
    title: `${exercise.title} - ${letters.join(' ')}`,
    description: `${exercise.instruction} | ${groupName} - ${subGroupName}`,
    category: 'makharij',
    difficulty: exercise.type === 'isolation' ? 'beginner' : exercise.type === 'sentences' ? 'advanced' : 'intermediate',
    type: 'word',
    duration: `${(Math.max(2, exercise.items.length))} دقائق`,
    questions,
  };
};

interface SubGroup {
  id: string;
  name: string;
  letters: string[];
  description?: string;
  exercises: LocalExercise[];
}

interface ArticulationGroup {
  id: string;
  name: string;
  arabicName: string;
  color: string;
  description: string;
  subGroups: SubGroup[];
}

const articulationGroups: ArticulationGroup[] = [
  {
    id: 'jawf',
    name: 'الجوف',
    arabicName: 'الحروف الجوفية',
    color: 'jellyfish',
    description: 'تخرج من الجوف (الخلاء الداخل في الفم والحلق)',
    subGroups: [
      {
        id: 'jawf-madd',
        name: 'حروف المد',
        letters: ['ا', 'و', 'ي'],
        exercises: [
          { id: 'jawf-1', type: 'isolation', title: 'الصوت المفرد', instruction: 'استمع وردد الصوت', items: ['آ', 'أُو', 'إِي'] },
          { id: 'jawf-2', type: 'syllables', title: 'مقاطع', instruction: 'ردد المقاطع', items: ['بَا', 'بُو', 'بِي', 'مَا', 'مُو', 'مِي'] },
          { id: 'jawf-3', type: 'words', title: 'كلمات', instruction: 'ردد الكلمات', items: ['قَال', 'يَقُول', 'قِيل', 'نَام', 'يَنُوم', 'نِيم'] },
          { id: 'jawf-4', type: 'minimal-pairs', title: 'أزواج', instruction: 'ميّز بين الصوتين', items: ['قَال / قُول', 'بَاب / بُوب', 'سَار / سِير'] },
        ]
      },
    ],
  },
  {
    id: 'throat',
    name: 'الحلق',
    arabicName: 'الحروف الحلقية',
    color: 'coral',
    description: 'تخرج من الحلق بمواضعه الثلاثة',
    subGroups: [
      {
        id: 'throat-deep',
        name: 'أقصى الحلق',
        letters: ['ء', 'ه'],
        description: 'أبعد نقطة في الحلق',
        exercises: [
          { id: 'th-d-1', type: 'isolation', title: 'الصوت المفرد', instruction: 'استمع وردد', items: ['أَ', 'إِ', 'أُ', 'هَ', 'هِ', 'هُ'] },
          { id: 'th-d-2', type: 'syllables', title: 'مقاطع', instruction: 'ردد المقاطع', items: ['أَب', 'هَب', 'أَم', 'هَم'] },
          { id: 'th-d-3', type: 'words', title: 'كلمات', instruction: 'ردد الكلمات', items: ['أَكَلَ', 'هَرَبَ', 'سَأَلَ', 'نَهَرَ'] },
          { id: 'th-d-4', type: 'minimal-pairs', title: 'تمييز ء/ه', instruction: 'ميّز بين الهمزة والهاء', items: ['أَمَل / هَمَل', 'سَأَل / سَهَل', 'أَل / هَل'], correctIndex: 0 },
        ]
      },
      {
        id: 'throat-mid',
        name: 'وسط الحلق',
        letters: ['ع', 'ح'],
        description: 'منتصف الحلق',
        exercises: [
          { id: 'th-m-1', type: 'isolation', title: 'الصوت المفرد', instruction: 'استمع وردد', items: ['عَ', 'عِ', 'عُ', 'حَ', 'حِ', 'حُ'] },
          { id: 'th-m-2', type: 'syllables', title: 'مقاطع', instruction: 'ردد المقاطع', items: ['عَب', 'حَب', 'عَم', 'حَم', 'بَع', 'بَح'] },
          { id: 'th-m-3', type: 'words', title: 'كلمات', instruction: 'ردد الكلمات', items: ['عَمِلَ', 'حَمَلَ', 'عَلِمَ', 'حَلِمَ'] },
          { id: 'th-m-4', type: 'minimal-pairs', title: 'تمييز ع/ح', instruction: 'ميّز بين العين والحاء', items: ['عَمَل / حَمَل', 'عَال / حَال', 'عَرَم / حَرَم'], correctIndex: 0 },
        ]
      },
      {
        id: 'throat-near',
        name: 'أدنى الحلق',
        letters: ['غ', 'خ'],
        description: 'أقرب نقطة للفم',
        exercises: [
          { id: 'th-n-1', type: 'isolation', title: 'الصوت المفرد', instruction: 'استمع وردد', items: ['غَ', 'غِ', 'غُ', 'خَ', 'خِ', 'خُ'] },
          { id: 'th-n-2', type: 'syllables', title: 'مقاطع', instruction: 'ردد المقاطع', items: ['غَب', 'خَب', 'غَم', 'خَم'] },
          { id: 'th-n-3', type: 'words', title: 'كلمات', instruction: 'ردد الكلمات', items: ['غَسَلَ', 'خَرَجَ', 'غَضِبَ', 'خَسِرَ'] },
          { id: 'th-n-4', type: 'minimal-pairs', title: 'تمييز غ/خ', instruction: 'ميّز بين الغين والخاء', items: ['غَال / خَال', 'غَرَق / خَرَق', 'غَلَب / خَلَب'], correctIndex: 0 },
        ]
      },
    ],
  },
  {
    id: 'tongue',
    name: 'اللسان',
    arabicName: 'الحروف اللسانية',
    color: 'primary',
    description: 'تخرج من اللسان بمواضعه المختلفة',
    subGroups: [
      {
        id: 'tongue-back',
        name: 'أقصى اللسان',
        letters: ['ق', 'ك'],
        description: 'مؤخرة اللسان مع الحنك',
        exercises: [
          { id: 'tg-b-1', type: 'isolation', title: 'الصوت المفرد', instruction: 'استمع وردد', items: ['قَ', 'قِ', 'قُ', 'كَ', 'كِ', 'كُ'] },
          { id: 'tg-b-2', type: 'syllables', title: 'مقاطع', instruction: 'ردد المقاطع', items: ['قَب', 'كَب', 'قَم', 'كَم'] },
          { id: 'tg-b-3', type: 'words', title: 'كلمات', instruction: 'ردد الكلمات', items: ['قَلَم', 'كَتَبَ', 'قَرَأ', 'كَسَرَ'] },
          { id: 'tg-b-4', type: 'minimal-pairs', title: 'تمييز ق/ك', instruction: 'ميّز بين القاف والكاف', items: ['قَلب / كَلب', 'قَال / كَال', 'قَتَل / كَتَل'], correctIndex: 0 },
        ]
      },
      {
        id: 'tongue-mid',
        name: 'وسط اللسان',
        letters: ['ج', 'ش', 'ي'],
        description: 'وسط اللسان مع الحنك',
        exercises: [
          { id: 'tg-m-1', type: 'isolation', title: 'الصوت المفرد', instruction: 'استمع وردد', items: ['جَ', 'جِ', 'جُ', 'شَ', 'شِ', 'شُ'] },
          { id: 'tg-m-2', type: 'syllables', title: 'مقاطع', instruction: 'ردد المقاطع', items: ['جَب', 'شَب', 'جَم', 'شَم'] },
          { id: 'tg-m-3', type: 'words', title: 'كلمات', instruction: 'ردد الكلمات', items: ['جَلَسَ', 'شَرِبَ', 'جَمَعَ', 'شَكَرَ'] },
          { id: 'tg-m-4', type: 'minimal-pairs', title: 'تمييز ج/ش', instruction: 'ميّز بين الجيم والشين', items: ['جَار / شَار', 'جَرَح / شَرَح', 'جَكّ / شَكّ'], correctIndex: 0 },
        ]
      },
      {
        id: 'tongue-edge',
        name: 'حافة اللسان',
        letters: ['ض'],
        description: 'حافة اللسان مع الأضراس',
        exercises: [
          { id: 'tg-e-1', type: 'isolation', title: 'الصوت المفرد', instruction: 'استمع وردد', items: ['ضَ', 'ضِ', 'ضُ'] },
          { id: 'tg-e-2', type: 'syllables', title: 'مقاطع', instruction: 'ردد المقاطع', items: ['ضَب', 'ضَم', 'ضَر', 'بَض', 'مَض'] },
          { id: 'tg-e-3', type: 'words', title: 'كلمات', instruction: 'ردد الكلمات', items: ['ضَرَبَ', 'ضَحِكَ', 'أَرض', 'مَرَض'] },
          { id: 'tg-e-4', type: 'minimal-pairs', title: 'تمييز ض/د', instruction: 'ميّز بين الضاد والدال', items: ['ضَرَب / دَرَب', 'ضَلّ / دَلّ', 'ضَار / دَار'], correctIndex: 0 },
        ]
      },
      {
        id: 'tongue-tip-gum',
        name: 'طرف اللسان مع اللثة',
        letters: ['ل', 'ن', 'ر'],
        description: 'طرف اللسان مع لثة الأسنان العليا',
        exercises: [
          { id: 'tg-tg-1', type: 'isolation', title: 'الصوت المفرد', instruction: 'استمع وردد', items: ['لَ', 'لِ', 'لُ', 'نَ', 'نِ', 'نُ', 'رَ', 'رِ', 'رُ'] },
          { id: 'tg-tg-2', type: 'syllables', title: 'مقاطع', instruction: 'ردد المقاطع', items: ['لَب', 'نَب', 'رَب', 'بَل', 'بَن', 'بَر'] },
          { id: 'tg-tg-3', type: 'words', title: 'كلمات', instruction: 'ردد الكلمات', items: ['لَعِبَ', 'نَظَرَ', 'رَجَعَ', 'جَمَل', 'حَسَن', 'قَمَر'] },
          { id: 'tg-tg-4', type: 'minimal-pairs', title: 'تمييز ل/ن/ر', instruction: 'ميّز بين الأصوات', items: ['لَام / نَام / رَام', 'لَمَس / نَمَس', 'جَلَد / جَرَد'], correctIndex: 0 },
        ]
      },
      {
        id: 'tongue-tip-teeth-back',
        name: 'طرف اللسان مع أصول الثنايا',
        letters: ['ت', 'د', 'ط'],
        description: 'طرف اللسان مع أصول الأسنان العليا',
        exercises: [
          { id: 'tg-tb-1', type: 'isolation', title: 'الصوت المفرد', instruction: 'استمع وردد', items: ['تَ', 'تِ', 'تُ', 'دَ', 'دِ', 'دُ', 'طَ', 'طِ', 'طُ'] },
          { id: 'tg-tb-2', type: 'syllables', title: 'مقاطع', instruction: 'ردد المقاطع', items: ['تَب', 'دَب', 'طَب', 'بَت', 'بَد', 'بَط'] },
          { id: 'tg-tb-3', type: 'words', title: 'كلمات', instruction: 'ردد الكلمات', items: ['تَمَر', 'دَرَس', 'طَبَخ', 'بَيت', 'وَلَد', 'خَيط'] },
          { id: 'tg-tb-4', type: 'minimal-pairs', title: 'تمييز ت/د/ط', instruction: 'ميّز بين الأصوات', items: ['تَاب / دَاب / طَاب', 'تَلّ / دَلّ / طَلّ', 'تِين / دِين / طِين'], correctIndex: 0 },
        ]
      },
      {
        id: 'tongue-tip-teeth',
        name: 'طرف اللسان مع الثنايا',
        letters: ['ث', 'ذ', 'ظ'],
        description: 'طرف اللسان مع أطراف الأسنان العليا',
        exercises: [
          { id: 'tg-tt-1', type: 'isolation', title: 'الصوت المفرد', instruction: 'استمع وردد', items: ['ثَ', 'ثِ', 'ثُ', 'ذَ', 'ذِ', 'ذُ', 'ظَ', 'ظِ', 'ظُ'] },
          { id: 'tg-tt-2', type: 'syllables', title: 'مقاطع', instruction: 'ردد المقاطع', items: ['ثَب', 'ذَب', 'ظَب', 'بَث', 'بَذ', 'بَظ'] },
          { id: 'tg-tt-3', type: 'words', title: 'كلمات', instruction: 'ردد الكلمات', items: ['ثَوب', 'ذَهَب', 'ظَهَر', 'ثَلاثَة', 'أَذان', 'نَظَر'] },
          { id: 'tg-tt-4', type: 'minimal-pairs', title: 'تمييز ث/ذ/ظ', instruction: 'ميّز بين الأصوات', items: ['ثَلّ / ذَلّ / ظَلّ', 'ثَرّ / ذَرّ / ظَرّ'], correctIndex: 0 },
        ]
      },
      {
        id: 'tongue-whistle',
        name: 'حروف الصفير',
        letters: ['س', 'ز', 'ص'],
        description: 'طرف اللسان مع الثنايا السفلى',
        exercises: [
          { id: 'tg-w-1', type: 'isolation', title: 'الصوت المفرد', instruction: 'استمع وردد', items: ['سَ', 'سِ', 'سُ', 'زَ', 'زِ', 'زُ', 'صَ', 'صِ', 'صُ'] },
          { id: 'tg-w-2', type: 'syllables', title: 'مقاطع', instruction: 'ردد المقاطع', items: ['سَب', 'زَب', 'صَب', 'بَس', 'بَز', 'بَص'] },
          { id: 'tg-w-3', type: 'words', title: 'كلمات', instruction: 'ردد الكلمات', items: ['سَمَك', 'زَرَع', 'صَبَر', 'دَرس', 'خُبز', 'رَقص'] },
          { id: 'tg-w-4', type: 'minimal-pairs', title: 'تمييز س/ز/ص', instruction: 'ميّز بين الأصوات', items: ['سَار / زَار / صَار', 'سَام / زَام / صَام', 'سَبَر / زَبَر / صَبَر'], correctIndex: 0 },
        ]
      },
    ],
  },
  {
    id: 'lips',
    name: 'الشفتان',
    arabicName: 'الحروف الشفوية',
    color: 'turquoise',
    description: 'تخرج من الشفتين',
    subGroups: [
      {
        id: 'lips-both',
        name: 'الشفتان معاً',
        letters: ['ب', 'م', 'و'],
        description: 'انطباق أو انضمام الشفتين',
        exercises: [
          { id: 'lp-b-1', type: 'isolation', title: 'الصوت المفرد', instruction: 'استمع وردد', items: ['بَ', 'بِ', 'بُ', 'مَ', 'مِ', 'مُ'] },
          { id: 'lp-b-2', type: 'syllables', title: 'مقاطع', instruction: 'ردد المقاطع', items: ['بَا', 'مَا', 'وَا', 'أَب', 'أَم'] },
          { id: 'lp-b-3', type: 'words', title: 'كلمات', instruction: 'ردد الكلمات', items: ['بَاب', 'مَاء', 'وَلَد', 'كِتَاب', 'قَلَم'] },
          { id: 'lp-b-4', type: 'minimal-pairs', title: 'تمييز ب/م', instruction: 'ميّز بين الباء والميم', items: ['بَال / مَال', 'بَر / مَر', 'بَات / مَات'], correctIndex: 0 },
        ]
      },
      {
        id: 'lips-lower',
        name: 'الشفة السفلى مع الأسنان',
        letters: ['ف'],
        description: 'الشفة السفلى مع الأسنان العليا',
        exercises: [
          { id: 'lp-l-1', type: 'isolation', title: 'الصوت المفرد', instruction: 'استمع وردد', items: ['فَ', 'فِ', 'فُ'] },
          { id: 'lp-l-2', type: 'syllables', title: 'مقاطع', instruction: 'ردد المقاطع', items: ['فَب', 'فَم', 'فَر', 'بَف', 'مَف'] },
          { id: 'lp-l-3', type: 'words', title: 'كلمات', instruction: 'ردد الكلمات', items: ['فَتَح', 'فَهِم', 'صَف', 'كَهف'] },
          { id: 'lp-l-4', type: 'minimal-pairs', title: 'تمييز ف/ب', instruction: 'ميّز بين الفاء والباء', items: ['فَار / بَار', 'فَاز / بَاز', 'فَرَح / بَرَح'], correctIndex: 0 },
        ]
      },
    ],
  },
  {
    id: 'nasal',
    name: 'الخيشوم',
    arabicName: 'الغنة',
    color: 'mint',
    description: 'تخرج من الخيشوم (أقصى الأنف)',
    subGroups: [
      {
        id: 'nasal-ghunna',
        name: 'الغنة',
        letters: ['ن', 'م'],
        description: 'صوت يخرج من الخيشوم مع النون والميم المشددتين',
        exercises: [
          { id: 'ns-1', type: 'isolation', title: 'الغنة المشددة', instruction: 'استمع وردد مع الغنة', items: ['نَّ', 'مَّ', 'إِنَّ', 'ثُمَّ'] },
          { id: 'ns-2', type: 'words', title: 'كلمات بالغنة', instruction: 'ردد مع إظهار الغنة', items: ['إِنَّما', 'أَنَّ', 'ثُمَّ', 'لَمَّا'] },
          { id: 'ns-3', type: 'sentences', title: 'جمل', instruction: 'ردد الجملة مع الغنة', items: ['إِنَّ اللهَ غَفور', 'ثُمَّ رَجَعوا'] },
        ]
      },
    ],
  },
];

const colorClasses: Record<string, { bg: string; border: string; text: string; light: string }> = {
  jellyfish: { bg: 'bg-jellyfish', border: 'border-jellyfish', text: 'text-jellyfish', light: 'bg-jellyfish/10' },
  coral: { bg: 'bg-coral', border: 'border-coral', text: 'text-coral', light: 'bg-coral/10' },
  primary: { bg: 'bg-primary', border: 'border-primary', text: 'text-primary', light: 'bg-primary/10' },
  turquoise: { bg: 'bg-turquoise', border: 'border-turquoise', text: 'text-turquoise', light: 'bg-turquoise/10' },
  mint: { bg: 'bg-mint', border: 'border-mint', text: 'text-mint', light: 'bg-mint/10' },
};

// Helper to get all letters from subgroups
const getAllLetters = (group: ArticulationGroup): string[] => {
  return group.subGroups.flatMap(sg => sg.letters);
};

const MakharijGrid = ({ onExerciseClick }: MakharijGridProps) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<LocalExercise | null>(null);
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);

  const activeGroup = articulationGroups.find(g => g.id === selectedGroup);

  const handleStartExercise = (e: React.MouseEvent, exercise: LocalExercise, subGroup: SubGroup) => {
    e.stopPropagation();

    // For الحلق (throat), use the full-page exercise modal
    if (activeGroup?.id === 'throat' && onExerciseClick) {
      const globalExercise = convertToGlobalExercise(
        exercise,
        activeGroup.arabicName,
        subGroup.name,
        subGroup.letters
      );
      onExerciseClick(globalExercise);
    } else {
      // For other groups, use the local modal
      setSelectedExercise(exercise);
      setExerciseModalOpen(true);
    }
  };

  const handleCloseExercise = () => {
    setExerciseModalOpen(false);
    setSelectedExercise(null);
  };

  return (
    <div className="flex gap-6 min-h-[600px]" dir="rtl">
      {/* Right Sidebar - Navigation */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-64 shrink-0 space-y-3"
      >
        {/* Progress Card */}
        <div className="bg-gradient-to-bl from-primary/20 to-mint/20 rounded-2xl p-4 border border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground">التقدم الكلي</span>
            <span className="text-lg font-bold text-primary">0%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-0 bg-gradient-to-l from-primary to-mint rounded-full" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">0 من {articulationGroups.reduce((acc, g) => acc + g.subGroups.reduce((a, s) => a + s.exercises.length, 0), 0)} تمرين</p>
        </div>

        {/* Group Navigation */}
        <div className="bg-card rounded-2xl border overflow-hidden">
          <div className="p-3 border-b bg-muted/50">
            <h3 className="font-semibold text-sm">المخارج</h3>
          </div>
          <div className="p-2 space-y-1">
            {articulationGroups.map((group, index) => {
              const colors = colorClasses[group.color];
              const isSelected = selectedGroup === group.id;
              const arabicNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
              return (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroup(isSelected ? null : group.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-right transition-all ${
                    isSelected ? `${colors.light} ${colors.text}` : 'hover:bg-muted'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg ${colors.bg} text-white flex items-center justify-center text-lg font-bold`}>
                    {arabicNumbers[index]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${isSelected ? colors.text : ''}`}>{group.name}</p>
                    <p className="text-xs text-muted-foreground">{(getAllLetters(group).length)} حرف</p>
                  </div>
                  {isSelected && (
                    <div className={`w-2 h-2 rounded-full ${colors.bg}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 min-w-0"
      >
        {!activeGroup ? (
          /* Welcome State */
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-bl from-primary to-mint mx-auto mb-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">شرح مخارج الحروف</h2>
              <p className="text-muted-foreground">اختر مخرجاً من القائمة للبدء في التعلم والتدرب على النطق الصحيح</p>
            </div>
          </div>
        ) : (
          /* Active Group Content */
          <div className="space-y-4">
            {/* Group Header */}
            <div className={`${colorClasses[activeGroup.color].bg} rounded-2xl p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{activeGroup.arabicName}</h2>
                  <p className="text-white/80 mt-1">{activeGroup.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-end max-w-md">
                  {getAllLetters(activeGroup).map((letter) => (
                    <span key={letter} className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl font-bold">
                      {letter}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* SubGroups */}
            <div className="grid gap-4">
              {activeGroup.subGroups.map((subGroup, subIndex) => (
                <motion.div
                  key={subGroup.id}
                  className="bg-card rounded-2xl border overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: subIndex * 0.05 }}
                >
                  {/* SubGroup Header */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`${colorClasses[activeGroup.color].light} px-3 py-1 rounded-lg`}>
                        <span className={`font-bold ${colorClasses[activeGroup.color].text}`}>
                          {subGroup.letters.join(' ')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold">{subGroup.name}</h3>
                        {subGroup.description && (
                          <p className="text-xs text-muted-foreground">{subGroup.description}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                      {(subGroup.exercises.length)} تمارين
                    </span>
                  </div>

                  {/* Exercises */}
                  <div className="p-4">
                    {activeGroup.id === 'jawf' ? (
                      /* Old pill-button style for الجوف */
                      <div className="flex flex-wrap gap-2">
                        {subGroup.exercises.map((exercise, exIndex) => (
                          <motion.button
                            key={exercise.id}
                            onClick={(e) => handleStartExercise(e, exercise, subGroup)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${colorClasses[activeGroup.color].border} ${colorClasses[activeGroup.color].light} hover:scale-[1.02] transition-all`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: subIndex * 0.05 + exIndex * 0.02 }}
                          >
                            <div className={`w-6 h-6 rounded-md ${colorClasses[activeGroup.color].bg} text-white flex items-center justify-center text-xs font-bold`}>
                              {exercise.type === 'isolation' && '1'}
                              {exercise.type === 'syllables' && '2'}
                              {exercise.type === 'words' && '3'}
                              {exercise.type === 'minimal-pairs' && '4'}
                              {exercise.type === 'sentences' && '5'}
                            </div>
                            <span className={`font-semibold text-sm ${colorClasses[activeGroup.color].text}`}>{exercise.title}</span>
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      /* New card style for other groups */
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {subGroup.exercises.map((exercise, exIndex) => {
                          const typeLabels: Record<string, string> = {
                            'isolation': 'صوت مفرد',
                            'syllables': 'مقاطع',
                            'words': 'كلمات',
                            'minimal-pairs': 'أزواج',
                            'sentences': 'جمل',
                          };
                          return (
                            <motion.div
                              key={exercise.id}
                              onClick={(e) => handleStartExercise(e, exercise, subGroup)}
                              className="bg-card rounded-2xl p-5 cursor-pointer group hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/30"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: subIndex * 0.05 + exIndex * 0.03 }}
                              whileHover={{ scale: 1.02, y: -4 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {/* Header */}
                              <div className="flex items-start justify-between mb-3">
                                <div className={`w-10 h-10 rounded-xl ${colorClasses[activeGroup.color].light} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${colorClasses[activeGroup.color].text}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                                  </svg>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${colorClasses[activeGroup.color].light} ${colorClasses[activeGroup.color].text}`}>
                                  {typeLabels[exercise.type]}
                                </span>
                              </div>

                              {/* Content */}
                              <h4 className="font-bold text-base mb-1">{exercise.title}</h4>
                              <p className="text-sm text-muted-foreground mb-3">{exercise.instruction}</p>

                              {/* Footer */}
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>{(exercise.items.length)} عناصر</span>
                              </div>

                              {/* Play Overlay */}
                              <div className="mt-3 pt-3 border-t border-border">
                                <div className={`flex items-center justify-center gap-2 ${colorClasses[activeGroup.color].text} font-semibold`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="5 3 19 12 5 21 5 3"/>
                                  </svg>
                                  <span>ابدأ التمرين</span>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Exercise Modal */}
      <MakharijExerciseModal
        open={exerciseModalOpen}
        onClose={handleCloseExercise}
        exercise={selectedExercise}
        groupName={activeGroup?.arabicName || ''}
        groupColor={activeGroup?.color || 'primary'}
        letters={activeGroup ? getAllLetters(activeGroup) : []}
      />
    </div>
  );
};

export default MakharijGrid;
