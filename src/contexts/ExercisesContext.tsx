import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Question {
  id: string;
  prompt: string;
  audioPlaceholder: string;
  options: string[];
  correctAnswer: number;
}

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

interface ExercisesContextType {
  exercises: Exercise[];
  addExercise: (exercise: Omit<Exercise, "id">) => void;
  updateExercise: (id: string, exercise: Partial<Exercise>) => void;
  deleteExercise: (id: string) => void;
  getExercisesByCategory: (category: string) => Exercise[];
  getExerciseById: (id: string) => Exercise | undefined;
  resetToDefaults: () => void;
}

const defaultExercises: Exercise[] = [
  // === الحروف الجوفية (ا، و، ي) ===
  {
    id: "jawfiya-1",
    title: "الحروف الجوفية",
    description: "تدرب على التمييز بين حروف المد: الألف والواو والياء",
    category: "tones",
    difficulty: "beginner",
    type: "tone",
    duration: "٥ دقائق",
    questions: [
      { id: "jf1", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "آ آ آ", options: ["ا", "و", "ي"], correctAnswer: 0 },
      { id: "jf2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "أُو أُو أُو", options: ["ا", "و", "ي"], correctAnswer: 1 },
      { id: "jf3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "إِي إِي إِي", options: ["ا", "و", "ي"], correctAnswer: 2 },
      { id: "jf4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "آ آ آ", options: ["ا", "و", "ي"], correctAnswer: 0 },
      { id: "jf5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "إِي إِي إِي", options: ["ا", "و", "ي"], correctAnswer: 2 },
      { id: "jf6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "أُو أُو أُو", options: ["ا", "و", "ي"], correctAnswer: 1 },
      { id: "jf7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "إِي إِي إِي", options: ["ا", "و", "ي"], correctAnswer: 2 },
      { id: "jf8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "آ آ آ", options: ["ا", "و", "ي"], correctAnswer: 0 },
      { id: "jf9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "أُو أُو أُو", options: ["ا", "و", "ي"], correctAnswer: 1 },
      { id: "jf10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "آ آ آ", options: ["ا", "و", "ي"], correctAnswer: 0 },
      { id: "jf11", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "إِي إِي إِي", options: ["ا", "و", "ي"], correctAnswer: 2 },
      { id: "jf12", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "أُو أُو أُو", options: ["ا", "و", "ي"], correctAnswer: 1 },
    ],
  },
  {
    id: "jawfiya-2",
    title: "كلمات بالحروف الجوفية",
    description: "تدرب على سماع كلمات تحتوي على حروف المد",
    category: "words",
    difficulty: "beginner",
    type: "word",
    duration: "٦ دقائق",
    questions: [
      { id: "jfw1", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "باب", options: ["باب", "بوب", "بيب"], correctAnswer: 0 },
      { id: "jfw2", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "نور", options: ["نار", "نور", "نير"], correctAnswer: 1 },
      { id: "jfw3", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "بيت", options: ["بات", "بوت", "بيت"], correctAnswer: 2 },
      { id: "jfw4", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "قال", options: ["قال", "قول", "قيل"], correctAnswer: 0 },
      { id: "jfw5", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "يوم", options: ["يام", "يوم", "ييم"], correctAnswer: 1 },
      { id: "jfw6", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "عين", options: ["عان", "عون", "عين"], correctAnswer: 2 },
      { id: "jfw7", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "مال", options: ["مال", "مول", "ميل"], correctAnswer: 0 },
      { id: "jfw8", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "روح", options: ["راح", "روح", "ريح"], correctAnswer: 1 },
      { id: "jfw9", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "ليل", options: ["لال", "لول", "ليل"], correctAnswer: 2 },
      { id: "jfw10", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "سار", options: ["سار", "سور", "سير"], correctAnswer: 0 },
    ],
  },
  // === تمارين التمييز بين الحروف المتشابهة ===
  {
    id: "letters-1",
    title: "التمييز بين ب و ت",
    description: "تدرب على التفريق بين صوت حرف الباء وحرف التاء",
    category: "tones",
    difficulty: "beginner",
    type: "tone",
    duration: "٥ دقائق",
    questions: [
      { id: "bt1", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "بَ بَ بَ", options: ["ب", "ت"], correctAnswer: 0 },
      { id: "bt2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "تَ تَ تَ", options: ["ب", "ت"], correctAnswer: 1 },
      { id: "bt3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "بَ بَ بَ", options: ["ب", "ت"], correctAnswer: 0 },
      { id: "bt4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "تَ تَ تَ", options: ["ب", "ت"], correctAnswer: 1 },
      { id: "bt5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "تَ تَ تَ", options: ["ب", "ت"], correctAnswer: 1 },
      { id: "bt6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "بَ بَ بَ", options: ["ب", "ت"], correctAnswer: 0 },
      { id: "bt7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "تَ تَ تَ", options: ["ب", "ت"], correctAnswer: 1 },
      { id: "bt8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "بَ بَ بَ", options: ["ب", "ت"], correctAnswer: 0 },
      { id: "bt9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "بَ بَ بَ", options: ["ب", "ت"], correctAnswer: 0 },
      { id: "bt10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "تَ تَ تَ", options: ["ب", "ت"], correctAnswer: 1 },
    ],
  },
  {
    id: "letters-2",
    title: "التمييز بين س و ش",
    description: "تدرب على التفريق بين صوت حرف السين وحرف الشين",
    category: "tones",
    difficulty: "beginner",
    type: "tone",
    duration: "٥ دقائق",
    questions: [
      { id: "ss1", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "سَ سَ سَ", options: ["س", "ش"], correctAnswer: 0 },
      { id: "ss2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "شَ شَ شَ", options: ["س", "ش"], correctAnswer: 1 },
      { id: "ss3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "شَ شَ شَ", options: ["س", "ش"], correctAnswer: 1 },
      { id: "ss4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "سَ سَ سَ", options: ["س", "ش"], correctAnswer: 0 },
      { id: "ss5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "سَ سَ سَ", options: ["س", "ش"], correctAnswer: 0 },
      { id: "ss6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "شَ شَ شَ", options: ["س", "ش"], correctAnswer: 1 },
      { id: "ss7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "شَ شَ شَ", options: ["س", "ش"], correctAnswer: 1 },
      { id: "ss8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "سَ سَ سَ", options: ["س", "ش"], correctAnswer: 0 },
      { id: "ss9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "شَ شَ شَ", options: ["س", "ش"], correctAnswer: 1 },
      { id: "ss10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "سَ سَ سَ", options: ["س", "ش"], correctAnswer: 0 },
    ],
  },
  {
    id: "letters-3",
    title: "التمييز بين د و ذ",
    description: "تدرب على التفريق بين صوت حرف الدال وحرف الذال",
    category: "tones",
    difficulty: "beginner",
    type: "tone",
    duration: "٥ دقائق",
    questions: [
      { id: "dd1", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "دَ دَ دَ", options: ["د", "ذ"], correctAnswer: 0 },
      { id: "dd2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ذَ ذَ ذَ", options: ["د", "ذ"], correctAnswer: 1 },
      { id: "dd3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "دَ دَ دَ", options: ["د", "ذ"], correctAnswer: 0 },
      { id: "dd4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ذَ ذَ ذَ", options: ["د", "ذ"], correctAnswer: 1 },
      { id: "dd5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ذَ ذَ ذَ", options: ["د", "ذ"], correctAnswer: 1 },
      { id: "dd6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "دَ دَ دَ", options: ["د", "ذ"], correctAnswer: 0 },
      { id: "dd7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ذَ ذَ ذَ", options: ["د", "ذ"], correctAnswer: 1 },
      { id: "dd8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "دَ دَ دَ", options: ["د", "ذ"], correctAnswer: 0 },
      { id: "dd9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "دَ دَ دَ", options: ["د", "ذ"], correctAnswer: 0 },
      { id: "dd10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ذَ ذَ ذَ", options: ["د", "ذ"], correctAnswer: 1 },
    ],
  },
  {
    id: "letters-4",
    title: "التمييز بين ح و خ",
    description: "تدرب على التفريق بين صوت حرف الحاء وحرف الخاء",
    category: "tones",
    difficulty: "intermediate",
    type: "tone",
    duration: "٥ دقائق",
    questions: [
      { id: "hk1", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "حَ حَ حَ", options: ["ح", "خ"], correctAnswer: 0 },
      { id: "hk2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "خَ خَ خَ", options: ["ح", "خ"], correctAnswer: 1 },
      { id: "hk3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "خَ خَ خَ", options: ["ح", "خ"], correctAnswer: 1 },
      { id: "hk4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "حَ حَ حَ", options: ["ح", "خ"], correctAnswer: 0 },
      { id: "hk5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "حَ حَ حَ", options: ["ح", "خ"], correctAnswer: 0 },
      { id: "hk6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "خَ خَ خَ", options: ["ح", "خ"], correctAnswer: 1 },
      { id: "hk7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "خَ خَ خَ", options: ["ح", "خ"], correctAnswer: 1 },
      { id: "hk8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "حَ حَ حَ", options: ["ح", "خ"], correctAnswer: 0 },
      { id: "hk9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "حَ حَ حَ", options: ["ح", "خ"], correctAnswer: 0 },
      { id: "hk10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "خَ خَ خَ", options: ["ح", "خ"], correctAnswer: 1 },
    ],
  },
  {
    id: "letters-5",
    title: "التمييز بين ع و غ",
    description: "تدرب على التفريق بين صوت حرف العين وحرف الغين",
    category: "tones",
    difficulty: "intermediate",
    type: "tone",
    duration: "٥ دقائق",
    questions: [
      { id: "ag1", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "عَ عَ عَ", options: ["ع", "غ"], correctAnswer: 0 },
      { id: "ag2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "غَ غَ غَ", options: ["ع", "غ"], correctAnswer: 1 },
      { id: "ag3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "عَ عَ عَ", options: ["ع", "غ"], correctAnswer: 0 },
      { id: "ag4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "غَ غَ غَ", options: ["ع", "غ"], correctAnswer: 1 },
      { id: "ag5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "غَ غَ غَ", options: ["ع", "غ"], correctAnswer: 1 },
      { id: "ag6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "عَ عَ عَ", options: ["ع", "غ"], correctAnswer: 0 },
      { id: "ag7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "عَ عَ عَ", options: ["ع", "غ"], correctAnswer: 0 },
      { id: "ag8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "غَ غَ غَ", options: ["ع", "غ"], correctAnswer: 1 },
      { id: "ag9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "غَ غَ غَ", options: ["ع", "غ"], correctAnswer: 1 },
      { id: "ag10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "عَ عَ عَ", options: ["ع", "غ"], correctAnswer: 0 },
    ],
  },
  {
    id: "letters-6",
    title: "التمييز بين ص و ض",
    description: "تدرب على التفريق بين صوت حرف الصاد وحرف الضاد",
    category: "tones",
    difficulty: "intermediate",
    type: "tone",
    duration: "٥ دقائق",
    questions: [
      { id: "sd1", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "صَ صَ صَ", options: ["ص", "ض"], correctAnswer: 0 },
      { id: "sd2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ضَ ضَ ضَ", options: ["ص", "ض"], correctAnswer: 1 },
      { id: "sd3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "صَ صَ صَ", options: ["ص", "ض"], correctAnswer: 0 },
      { id: "sd4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ضَ ضَ ضَ", options: ["ص", "ض"], correctAnswer: 1 },
      { id: "sd5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ضَ ضَ ضَ", options: ["ص", "ض"], correctAnswer: 1 },
      { id: "sd6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "صَ صَ صَ", options: ["ص", "ض"], correctAnswer: 0 },
      { id: "sd7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "صَ صَ صَ", options: ["ص", "ض"], correctAnswer: 0 },
      { id: "sd8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ضَ ضَ ضَ", options: ["ص", "ض"], correctAnswer: 1 },
      { id: "sd9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ضَ ضَ ضَ", options: ["ص", "ض"], correctAnswer: 1 },
      { id: "sd10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "صَ صَ صَ", options: ["ص", "ض"], correctAnswer: 0 },
    ],
  },
  {
    id: "letters-7",
    title: "التمييز بين ط و ظ",
    description: "تدرب على التفريق بين صوت حرف الطاء وحرف الظاء",
    category: "tones",
    difficulty: "advanced",
    type: "tone",
    duration: "٥ دقائق",
    questions: [
      { id: "tz1", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "طَ طَ طَ", options: ["ط", "ظ"], correctAnswer: 0 },
      { id: "tz2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ظَ ظَ ظَ", options: ["ط", "ظ"], correctAnswer: 1 },
      { id: "tz3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "طَ طَ طَ", options: ["ط", "ظ"], correctAnswer: 0 },
      { id: "tz4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ظَ ظَ ظَ", options: ["ط", "ظ"], correctAnswer: 1 },
      { id: "tz5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ظَ ظَ ظَ", options: ["ط", "ظ"], correctAnswer: 1 },
      { id: "tz6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "طَ طَ طَ", options: ["ط", "ظ"], correctAnswer: 0 },
      { id: "tz7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "طَ طَ طَ", options: ["ط", "ظ"], correctAnswer: 0 },
      { id: "tz8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ظَ ظَ ظَ", options: ["ط", "ظ"], correctAnswer: 1 },
      { id: "tz9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ظَ ظَ ظَ", options: ["ط", "ظ"], correctAnswer: 1 },
      { id: "tz10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "طَ طَ طَ", options: ["ط", "ظ"], correctAnswer: 0 },
    ],
  },
  {
    id: "letters-8",
    title: "التمييز بين ك و ق",
    description: "تدرب على التفريق بين صوت حرف الكاف وحرف القاف",
    category: "tones",
    difficulty: "advanced",
    type: "tone",
    duration: "٥ دقائق",
    questions: [
      { id: "kq1", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "كَ كَ كَ", options: ["ك", "ق"], correctAnswer: 0 },
      { id: "kq2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "قَ قَ قَ", options: ["ك", "ق"], correctAnswer: 1 },
      { id: "kq3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "كَ كَ كَ", options: ["ك", "ق"], correctAnswer: 0 },
      { id: "kq4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "قَ قَ قَ", options: ["ك", "ق"], correctAnswer: 1 },
      { id: "kq5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "قَ قَ قَ", options: ["ك", "ق"], correctAnswer: 1 },
      { id: "kq6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "كَ كَ كَ", options: ["ك", "ق"], correctAnswer: 0 },
      { id: "kq7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "كَ كَ كَ", options: ["ك", "ق"], correctAnswer: 0 },
      { id: "kq8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "قَ قَ قَ", options: ["ك", "ق"], correctAnswer: 1 },
      { id: "kq9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "قَ قَ قَ", options: ["ك", "ق"], correctAnswer: 1 },
      { id: "kq10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "كَ كَ كَ", options: ["ك", "ق"], correctAnswer: 0 },
    ],
  },
  // === تمارين الكلمات المتشابهة ===
  {
    id: "words-1",
    title: "كلمات بحرف ب و ت",
    description: "تدرب على التفريق بين كلمات تبدأ بحرف الباء أو التاء",
    category: "words",
    difficulty: "beginner",
    type: "word",
    duration: "٦ دقائق",
    questions: [
      { id: "wbt1", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "باب", options: ["باب", "تاب"], correctAnswer: 0 },
      { id: "wbt2", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "تين", options: ["بين", "تين"], correctAnswer: 1 },
      { id: "wbt3", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "بيت", options: ["بيت", "تيت"], correctAnswer: 0 },
      { id: "wbt4", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "تمر", options: ["بمر", "تمر"], correctAnswer: 1 },
      { id: "wbt5", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "بحر", options: ["بحر", "تحر"], correctAnswer: 0 },
      { id: "wbt6", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "تراب", options: ["براب", "تراب"], correctAnswer: 1 },
      { id: "wbt7", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "بنت", options: ["بنت", "تنت"], correctAnswer: 0 },
      { id: "wbt8", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "تفاح", options: ["بفاح", "تفاح"], correctAnswer: 1 },
      { id: "wbt9", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "بقرة", options: ["بقرة", "تقرة"], correctAnswer: 0 },
      { id: "wbt10", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "توت", options: ["بوت", "توت"], correctAnswer: 1 },
    ],
  },
  {
    id: "words-2",
    title: "كلمات بحرف س و ش",
    description: "تدرب على التفريق بين كلمات تحتوي على السين أو الشين",
    category: "words",
    difficulty: "beginner",
    type: "word",
    duration: "٦ دقائق",
    questions: [
      { id: "wss1", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "سمس", options: ["سمس", "شمس"], correctAnswer: 0 },
      { id: "wss2", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "شجرة", options: ["سجرة", "شجرة"], correctAnswer: 1 },
      { id: "wss3", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "سيارة", options: ["سيارة", "شيارة"], correctAnswer: 0 },
      { id: "wss4", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "شاي", options: ["ساي", "شاي"], correctAnswer: 1 },
      { id: "wss5", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "سمك", options: ["سمك", "شمك"], correctAnswer: 0 },
      { id: "wss6", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "شباك", options: ["سباك", "شباك"], correctAnswer: 1 },
      { id: "wss7", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "سرير", options: ["سرير", "شرير"], correctAnswer: 0 },
      { id: "wss8", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "شمعة", options: ["سمعة", "شمعة"], correctAnswer: 1 },
      { id: "wss9", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "سكين", options: ["سكين", "شكين"], correctAnswer: 0 },
      { id: "wss10", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "شارع", options: ["سارع", "شارع"], correctAnswer: 1 },
    ],
  },
  {
    id: "words-3",
    title: "كلمات بحرف ح و خ",
    description: "تدرب على التفريق بين كلمات تحتوي على الحاء أو الخاء",
    category: "words",
    difficulty: "intermediate",
    type: "word",
    duration: "٦ دقائق",
    questions: [
      { id: "whk1", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "حبر", options: ["حبر", "خبر"], correctAnswer: 0 },
      { id: "whk2", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "خبز", options: ["حبز", "خبز"], correctAnswer: 1 },
      { id: "whk3", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "حليب", options: ["حليب", "خليب"], correctAnswer: 0 },
      { id: "whk4", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "خيمة", options: ["حيمة", "خيمة"], correctAnswer: 1 },
      { id: "whk5", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "حصان", options: ["حصان", "خصان"], correctAnswer: 0 },
      { id: "whk6", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "خروف", options: ["حروف", "خروف"], correctAnswer: 1 },
      { id: "whk7", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "حديقة", options: ["حديقة", "خديقة"], correctAnswer: 0 },
      { id: "whk8", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "خضار", options: ["حضار", "خضار"], correctAnswer: 1 },
      { id: "whk9", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "حمام", options: ["حمام", "خمام"], correctAnswer: 0 },
      { id: "whk10", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "خاتم", options: ["حاتم", "خاتم"], correctAnswer: 1 },
    ],
  },
  // === تمارين الجمل ===
  {
    id: "sentences-1",
    title: "جمل قصيرة",
    description: "استمع للجملة واختر الجملة الصحيحة",
    category: "sentences",
    difficulty: "intermediate",
    type: "sentence",
    duration: "٧ دقائق",
    questions: [
      { id: "s1", prompt: "ما الجملة التي سمعتها؟", audioPlaceholder: "الباب مفتوح", options: ["الباب مفتوح", "التاب مفتوح"], correctAnswer: 0 },
      { id: "s2", prompt: "ما الجملة التي سمعتها؟", audioPlaceholder: "الشمس ساطعة", options: ["السمس ساطعة", "الشمس ساطعة"], correctAnswer: 1 },
      { id: "s3", prompt: "ما الجملة التي سمعتها؟", audioPlaceholder: "الحليب بارد", options: ["الحليب بارد", "الخليب بارد"], correctAnswer: 0 },
      { id: "s4", prompt: "ما الجملة التي سمعتها؟", audioPlaceholder: "الخبز طازج", options: ["الحبز طازج", "الخبز طازج"], correctAnswer: 1 },
      { id: "s5", prompt: "ما الجملة التي سمعتها؟", audioPlaceholder: "البيت كبير", options: ["البيت كبير", "التيت كبير"], correctAnswer: 0 },
      { id: "s6", prompt: "ما الجملة التي سمعتها؟", audioPlaceholder: "الشارع طويل", options: ["السارع طويل", "الشارع طويل"], correctAnswer: 1 },
      { id: "s7", prompt: "ما الجملة التي سمعتها؟", audioPlaceholder: "السيارة سريعة", options: ["السيارة سريعة", "الشيارة سريعة"], correctAnswer: 0 },
      { id: "s8", prompt: "ما الجملة التي سمعتها؟", audioPlaceholder: "الطفل نائم", options: ["الظفل نائم", "الطفل نائم"], correctAnswer: 1 },
    ],
  },
  // === تمارين أصوات البيئة ===
  {
    id: "env-1",
    title: "أصوات المنزل",
    description: "تعرف على الأصوات اليومية في المنزل",
    category: "environment",
    difficulty: "beginner",
    type: "environment",
    duration: "٤ دقائق",
    questions: [
      { id: "e1", prompt: "ما الصوت الذي سمعته؟", audioPlaceholder: "جرس الباب", options: ["جرس الباب", "رنين الهاتف"], correctAnswer: 0 },
      { id: "e2", prompt: "ما الصوت الذي سمعته؟", audioPlaceholder: "رنين الهاتف", options: ["جرس الباب", "رنين الهاتف"], correctAnswer: 1 },
      { id: "e3", prompt: "ما الصوت الذي سمعته؟", audioPlaceholder: "صوت الماء", options: ["صوت الماء", "صوت المطر"], correctAnswer: 0 },
      { id: "e4", prompt: "ما الصوت الذي سمعته؟", audioPlaceholder: "المنبه", options: ["التلفاز", "المنبه"], correctAnswer: 1 },
      { id: "e5", prompt: "ما الصوت الذي سمعته؟", audioPlaceholder: "الغسالة", options: ["الغسالة", "المكيف"], correctAnswer: 0 },
      { id: "e6", prompt: "ما الصوت الذي سمعته؟", audioPlaceholder: "الميكروويف", options: ["الفرن", "الميكروويف"], correctAnswer: 1 },
      { id: "e7", prompt: "ما الصوت الذي سمعته؟", audioPlaceholder: "طرق الباب", options: ["طرق الباب", "إغلاق النافذة"], correctAnswer: 0 },
      { id: "e8", prompt: "ما الصوت الذي سمعته؟", audioPlaceholder: "صوت المكنسة", options: ["الغسالة", "صوت المكنسة"], correctAnswer: 1 },
    ],
  },
];

const STORAGE_KEY = "deepdive-exercises-v4";

const ExercisesContext = createContext<ExercisesContextType | undefined>(undefined);

export const ExercisesProvider = ({ children }: { children: ReactNode }) => {
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultExercises;
      }
    }
    return defaultExercises;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
  }, [exercises]);

  const addExercise = (exercise: Omit<Exercise, "id">) => {
    const categoryPrefix = exercise.category.substring(0, 3);
    const categoryExercises = exercises.filter(e => e.category === exercise.category);
    const newId = `${categoryPrefix}-${categoryExercises.length + 1}`;
    setExercises(prev => [...prev, { ...exercise, id: newId }]);
  };

  const updateExercise = (id: string, updates: Partial<Exercise>) => {
    setExercises(prev => prev.map(exercise =>
      exercise.id === id ? { ...exercise, ...updates } : exercise
    ));
  };

  const deleteExercise = (id: string) => {
    setExercises(prev => prev.filter(exercise => exercise.id !== id));
  };

  const getExercisesByCategory = (category: string) => {
    return exercises.filter(e => e.category === category);
  };

  const getExerciseById = (id: string) => {
    return exercises.find(e => e.id === id);
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setExercises(defaultExercises);
  };

  return (
    <ExercisesContext.Provider value={{
      exercises,
      addExercise,
      updateExercise,
      deleteExercise,
      getExercisesByCategory,
      getExerciseById,
      resetToDefaults,
    }}>
      {children}
    </ExercisesContext.Provider>
  );
};

export const useExercises = () => {
  const context = useContext(ExercisesContext);
  if (!context) {
    throw new Error("useExercises must be used within an ExercisesProvider");
  }
  return context;
};
