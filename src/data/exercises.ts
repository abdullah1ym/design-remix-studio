export interface Exercise {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  type: "tone" | "word" | "sentence" | "environment";
  duration: string;
  questions: Question[];
}

export interface Question {
  id: string;
  prompt: string;
  audioPlaceholder: string;
  options: string[];
  correctAnswer: number;
}

export const exercises: Exercise[] = [
  // Tone Recognition Exercises
  {
    id: "tone-1",
    title: "التمييز بين النغمات العالية والمنخفضة",
    description: "استمع للصوت وحدد إذا كانت النغمة عالية أم منخفضة",
    category: "tones",
    difficulty: "beginner",
    type: "tone",
    duration: "٣ دقائق",
    questions: [
      {
        id: "q1",
        prompt: "استمع للنغمة التالية:",
        audioPlaceholder: "نغمة عالية (1000 Hz)",
        options: ["نغمة عالية", "نغمة منخفضة"],
        correctAnswer: 0,
      },
      {
        id: "q2",
        prompt: "استمع للنغمة التالية:",
        audioPlaceholder: "نغمة منخفضة (250 Hz)",
        options: ["نغمة عالية", "نغمة منخفضة"],
        correctAnswer: 1,
      },
      {
        id: "q3",
        prompt: "استمع للنغمة التالية:",
        audioPlaceholder: "نغمة متوسطة-عالية (750 Hz)",
        options: ["نغمة عالية", "نغمة منخفضة"],
        correctAnswer: 0,
      },
    ],
  },
  // Similar Sounds Exercises - تمييز الأصوات المتشابهة
  {
    id: "similar-1",
    title: "كلمات بحروف متشابهة",
    description: "استمع للكلمة واختر الكلمة الصحيحة",
    category: "similar-sounds",
    difficulty: "intermediate",
    type: "word",
    duration: "٦ دقائق",
    questions: [
      {
        id: "q1",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: باب",
        options: ["باب", "بيت", "بنت", "بحر"],
        correctAnswer: 0,
      },
      {
        id: "q2",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: شمس",
        options: ["قمر", "شمس", "نجم", "سماء"],
        correctAnswer: 1,
      },
      {
        id: "q3",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: ماء",
        options: ["ماء", "هواء", "نار", "أرض"],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: "similar-2",
    title: "كلمات ت و د و ط",
    description: "استمع للكلمة واختر الكلمة الصحيحة",
    category: "similar-sounds",
    difficulty: "intermediate",
    type: "word",
    duration: "٦ دقائق",
    questions: [
      {
        id: "q1",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: تمر",
        options: ["تمر", "دمع", "طبل", "تين"],
        correctAnswer: 0,
      },
      {
        id: "q2",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: دار",
        options: ["تار", "دار", "طار", "دين"],
        correctAnswer: 1,
      },
      {
        id: "q3",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: طبيب",
        options: ["طبيب", "تلميذ", "دبدوب", "طالب"],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: "similar-3",
    title: "كلمات ث و ذ و ظ",
    description: "استمع للكلمة واختر الكلمة الصحيحة",
    category: "similar-sounds",
    difficulty: "intermediate",
    type: "word",
    duration: "٦ دقائق",
    questions: [
      {
        id: "q1",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: ثعلب",
        options: ["ثعلب", "ذهب", "ظرف", "ثوب"],
        correctAnswer: 0,
      },
      {
        id: "q2",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: ذرة",
        options: ["ثمرة", "ذرة", "ظلمة", "ذيل"],
        correctAnswer: 1,
      },
      {
        id: "q3",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: ظل",
        options: ["ظل", "ثوب", "ذيل", "ظهر"],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: "similar-4",
    title: "كلمات ح و ع و هـ",
    description: "استمع للكلمة واختر الكلمة الصحيحة",
    category: "similar-sounds",
    difficulty: "intermediate",
    type: "word",
    duration: "٦ دقائق",
    questions: [
      {
        id: "q1",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: حصان",
        options: ["حصان", "عصفور", "هدهد", "حليب"],
        correctAnswer: 0,
      },
      {
        id: "q2",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: عنب",
        options: ["حليب", "عنب", "هواء", "عين"],
        correctAnswer: 1,
      },
      {
        id: "q3",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: هرم",
        options: ["هرم", "حرم", "عرس", "هواء"],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: "similar-5",
    title: "كلمات غ و خ",
    description: "استمع للكلمة واختر الكلمة الصحيحة",
    category: "similar-sounds",
    difficulty: "intermediate",
    type: "word",
    duration: "٦ دقائق",
    questions: [
      {
        id: "q1",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: غراب",
        options: ["غراب", "خروف", "غابة", "خبز"],
        correctAnswer: 0,
      },
      {
        id: "q2",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: خبز",
        options: ["غرفة", "خبز", "غسالة", "خاتم"],
        correctAnswer: 1,
      },
      {
        id: "q3",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: غابة",
        options: ["غابة", "خيمة", "غروب", "خزانة"],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: "similar-6",
    title: "كلمات س و ص",
    description: "استمع للكلمة واختر الكلمة الصحيحة",
    category: "similar-sounds",
    difficulty: "intermediate",
    type: "word",
    duration: "٦ دقائق",
    questions: [
      {
        id: "q1",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: سمكة",
        options: ["سمكة", "صحن", "سيارة", "صقر"],
        correctAnswer: 0,
      },
      {
        id: "q2",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: صباح",
        options: ["سباح", "صباح", "سكر", "صقر"],
        correctAnswer: 1,
      },
      {
        id: "q3",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: سيارة",
        options: ["سيارة", "صاروخ", "سلحفاة", "صندوق"],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: "similar-7",
    title: "كلمات ض و ظ",
    description: "استمع للكلمة واختر الكلمة الصحيحة",
    category: "similar-sounds",
    difficulty: "intermediate",
    type: "word",
    duration: "٦ دقائق",
    questions: [
      {
        id: "q1",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: ضفدع",
        options: ["ضفدع", "ظرف", "ضابط", "ظل"],
        correctAnswer: 0,
      },
      {
        id: "q2",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: ظهر",
        options: ["ضرب", "ظهر", "ضوء", "ظل"],
        correctAnswer: 1,
      },
      {
        id: "q3",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: ضابط",
        options: ["ضابط", "ظالم", "ضيف", "ظبي"],
        correctAnswer: 0,
      },
    ],
  },
  // Word Recognition Exercises
  {
    id: "word-2",
    title: "الكلمات البسيطة",
    description: "استمع للكلمة واختر الكلمة الصحيحة",
    category: "words",
    difficulty: "intermediate",
    type: "word",
    duration: "٦ دقائق",
    questions: [
      {
        id: "q1",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: باب",
        options: ["باب", "بيت", "بنت", "بحر"],
        correctAnswer: 0,
      },
      {
        id: "q2",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: شمس",
        options: ["قمر", "شمس", "نجم", "سماء"],
        correctAnswer: 1,
      },
      {
        id: "q3",
        prompt: "ما الكلمة التي سمعتها؟",
        audioPlaceholder: "صوت كلمة: ماء",
        options: ["ماء", "هواء", "نار", "أرض"],
        correctAnswer: 0,
      },
    ],
  },
  // Sentence Recognition Exercises
  {
    id: "sentence-1",
    title: "الجمل القصيرة",
    description: "استمع للجملة واختر الجملة الصحيحة",
    category: "sentences",
    difficulty: "intermediate",
    type: "sentence",
    duration: "٧ دقائق",
    questions: [
      {
        id: "q1",
        prompt: "ما الجملة التي سمعتها؟",
        audioPlaceholder: "صوت جملة: السلام عليكم",
        options: ["السلام عليكم", "صباح الخير", "مساء الخير", "مع السلامة"],
        correctAnswer: 0,
      },
      {
        id: "q2",
        prompt: "ما الجملة التي سمعتها؟",
        audioPlaceholder: "صوت جملة: كيف حالك",
        options: ["ما اسمك", "كيف حالك", "أين تسكن", "ماذا تعمل"],
        correctAnswer: 1,
      },
    ],
  },
  // Environmental Sounds
  {
    id: "env-1",
    title: "أصوات المنزل",
    description: "تعرف على الأصوات اليومية في المنزل",
    category: "environment",
    difficulty: "beginner",
    type: "environment",
    duration: "٤ دقائق",
    questions: [
      {
        id: "q1",
        prompt: "ما الصوت الذي سمعته؟",
        audioPlaceholder: "صوت: جرس الباب",
        options: ["جرس الباب", "رنين الهاتف", "صوت التلفاز", "صوت الماء"],
        correctAnswer: 0,
      },
      {
        id: "q2",
        prompt: "ما الصوت الذي سمعته؟",
        audioPlaceholder: "صوت: رنين الهاتف",
        options: ["جرس الباب", "رنين الهاتف", "المنبه", "الميكروويف"],
        correctAnswer: 1,
      },
      {
        id: "q3",
        prompt: "ما الصوت الذي سمعته؟",
        audioPlaceholder: "صوت: صوت الماء الجاري",
        options: ["المطر", "صوت الماء", "الغسالة", "المكيف"],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "env-2",
    title: "أصوات الشارع",
    description: "تعرف على الأصوات في الخارج",
    category: "environment",
    difficulty: "intermediate",
    type: "environment",
    duration: "٥ دقائق",
    questions: [
      {
        id: "q1",
        prompt: "ما الصوت الذي سمعته؟",
        audioPlaceholder: "صوت: سيارة إسعاف",
        options: ["سيارة إسعاف", "سيارة شرطة", "سيارة إطفاء", "دراجة نارية"],
        correctAnswer: 0,
      },
      {
        id: "q2",
        prompt: "ما الصوت الذي سمعته؟",
        audioPlaceholder: "صوت: طيور تغرد",
        options: ["كلب ينبح", "قطة تموء", "طيور تغرد", "ديك يصيح"],
        correctAnswer: 2,
      },
    ],
  },
];

export const getExercisesByCategory = (category: string): Exercise[] => {
  return exercises.filter((e) => e.category === category);
};

export const getExerciseById = (id: string): Exercise | undefined => {
  return exercises.find((e) => e.id === id);
};
