import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Question {
  id: string;
  prompt: string;
  audioPlaceholder: string;
  options: string[];
  correctAnswer: number;
  // For randomized questions: audio is randomly selected from options
  isRandomized?: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  type: "tone" | "word" | "sentence";
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
  // ═══════════════════════════════════════════════════════════════════════════
  // المخرج الأول: الجوف (Cavity) - حروف المد: ا، و، ي
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "jawfiya-1",
    title: "الحروف الجوفية",
    description: "تدرب على التمييز بين حروف المد: الألف والواو والياء - تخرج من الجوف (تجويف الفم والحلق)",
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

  // ═══════════════════════════════════════════════════════════════════════════
  // المخرج الثاني: الحلق (Throat) - ثلاث مناطق
  // ═══════════════════════════════════════════════════════════════════════════

  // --- أقصى الحلق (أبعد نقطة): الهمزة والهاء ---
  {
    id: "halq-aqsa-1",
    title: "أقصى الحلق: الهمزة والهاء",
    description: "حروف تخرج من أبعد نقطة في الحلق - مهمة جداً لمستخدمي زراعة القوقعة",
    category: "tones",
    difficulty: "beginner",
    type: "tone",
    duration: "٥ دقائق",
    questions: [
      { id: "ha1", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "أَ أَ أَ", options: ["ء", "هـ"], correctAnswer: 0 },
      { id: "ha2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "هَ هَ هَ", options: ["ء", "هـ"], correctAnswer: 1 },
      { id: "ha3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "أَ أَ أَ", options: ["ء", "هـ"], correctAnswer: 0 },
      { id: "ha4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "هَ هَ هَ", options: ["ء", "هـ"], correctAnswer: 1 },
      { id: "ha5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "هَ هَ هَ", options: ["ء", "هـ"], correctAnswer: 1 },
      { id: "ha6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "أَ أَ أَ", options: ["ء", "هـ"], correctAnswer: 0 },
      { id: "ha7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "أَ أَ أَ", options: ["ء", "هـ"], correctAnswer: 0 },
      { id: "ha8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "هَ هَ هَ", options: ["ء", "هـ"], correctAnswer: 1 },
      { id: "ha9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "هَ هَ هَ", options: ["ء", "هـ"], correctAnswer: 1 },
      { id: "ha10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "أَ أَ أَ", options: ["ء", "هـ"], correctAnswer: 0 },
    ],
  },
  {
    id: "halq-aqsa-words",
    title: "كلمات بالهمزة والهاء",
    description: "تدرب على التفريق بين كلمات تحتوي على الهمزة والهاء",
    category: "words",
    difficulty: "beginner",
    type: "word",
    duration: "٦ دقائق",
    questions: [
      { id: "haw1", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "أمل", options: ["أمل", "همل"], correctAnswer: 0 },
      { id: "haw2", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "هدى", options: ["أدى", "هدى"], correctAnswer: 1 },
      { id: "haw3", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "أرض", options: ["أرض", "هرض"], correctAnswer: 0 },
      { id: "haw4", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "هواء", options: ["أواء", "هواء"], correctAnswer: 1 },
      { id: "haw5", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "أب", options: ["أب", "هب"], correctAnswer: 0 },
      { id: "haw6", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "هلال", options: ["ألال", "هلال"], correctAnswer: 1 },
      { id: "haw7", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "أسد", options: ["أسد", "هسد"], correctAnswer: 0 },
      { id: "haw8", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "هدية", options: ["أدية", "هدية"], correctAnswer: 1 },
      { id: "haw9", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "إبرة", options: ["إبرة", "هبرة"], correctAnswer: 0 },
      { id: "haw10", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "هرم", options: ["أرم", "هرم"], correctAnswer: 1 },
    ],
  },

  // --- وسط الحلق: العين والحاء ---
  {
    id: "halq-wasat-1",
    title: "وسط الحلق: العين والحاء",
    description: "حروف تخرج من منتصف الحلق - صعبة على مستخدمي زراعة القوقعة",
    category: "tones",
    difficulty: "intermediate",
    type: "tone",
    duration: "٥ دقائق",
    questions: [
      { id: "hw1", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "عَ عَ عَ", options: ["ع", "ح"], correctAnswer: 0 },
      { id: "hw2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "حَ حَ حَ", options: ["ع", "ح"], correctAnswer: 1 },
      { id: "hw3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "عَ عَ عَ", options: ["ع", "ح"], correctAnswer: 0 },
      { id: "hw4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "حَ حَ حَ", options: ["ع", "ح"], correctAnswer: 1 },
      { id: "hw5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "حَ حَ حَ", options: ["ع", "ح"], correctAnswer: 1 },
      { id: "hw6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "عَ عَ عَ", options: ["ع", "ح"], correctAnswer: 0 },
      { id: "hw7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "عَ عَ عَ", options: ["ع", "ح"], correctAnswer: 0 },
      { id: "hw8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "حَ حَ حَ", options: ["ع", "ح"], correctAnswer: 1 },
      { id: "hw9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "حَ حَ حَ", options: ["ع", "ح"], correctAnswer: 1 },
      { id: "hw10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "عَ عَ عَ", options: ["ع", "ح"], correctAnswer: 0 },
    ],
  },
  {
    id: "halq-wasat-words",
    title: "كلمات بالعين والحاء",
    description: "تدرب على التفريق بين كلمات تحتوي على العين والحاء",
    category: "words",
    difficulty: "intermediate",
    type: "word",
    duration: "٦ دقائق",
    questions: [
      { id: "hww1", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "عسل", options: ["عسل", "حسل"], correctAnswer: 0 },
      { id: "hww2", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "حلم", options: ["علم", "حلم"], correctAnswer: 1 },
      { id: "hww3", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "عين", options: ["عين", "حين"], correctAnswer: 0 },
      { id: "hww4", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "حب", options: ["عب", "حب"], correctAnswer: 1 },
      { id: "hww5", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "عرب", options: ["عرب", "حرب"], correctAnswer: 0 },
      { id: "hww6", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "حرير", options: ["عرير", "حرير"], correctAnswer: 1 },
      { id: "hww7", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "عود", options: ["عود", "حود"], correctAnswer: 0 },
      { id: "hww8", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "حوت", options: ["عوت", "حوت"], correctAnswer: 1 },
      { id: "hww9", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "عيد", options: ["عيد", "حيد"], correctAnswer: 0 },
      { id: "hww10", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "حمام", options: ["عمام", "حمام"], correctAnswer: 1 },
    ],
  },

  // --- أدنى الحلق (أقرب للفم): الغين والخاء ---
  {
    id: "halq-adna-1",
    title: "أدنى الحلق: الغين والخاء",
    description: "حروف تخرج من أقرب نقطة في الحلق للفم",
    category: "tones",
    difficulty: "intermediate",
    type: "tone",
    duration: "٥ دقائق",
    questions: [
      { id: "had1", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "غَ غَ غَ", options: ["غ", "خ"], correctAnswer: 0 },
      { id: "had2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "خَ خَ خَ", options: ["غ", "خ"], correctAnswer: 1 },
      { id: "had3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "غَ غَ غَ", options: ["غ", "خ"], correctAnswer: 0 },
      { id: "had4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "خَ خَ خَ", options: ["غ", "خ"], correctAnswer: 1 },
      { id: "had5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "خَ خَ خَ", options: ["غ", "خ"], correctAnswer: 1 },
      { id: "had6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "غَ غَ غَ", options: ["غ", "خ"], correctAnswer: 0 },
      { id: "had7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "غَ غَ غَ", options: ["غ", "خ"], correctAnswer: 0 },
      { id: "had8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "خَ خَ خَ", options: ["غ", "خ"], correctAnswer: 1 },
      { id: "had9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "خَ خَ خَ", options: ["غ", "خ"], correctAnswer: 1 },
      { id: "had10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "غَ غَ غَ", options: ["غ", "خ"], correctAnswer: 0 },
    ],
  },
  {
    id: "halq-adna-words",
    title: "كلمات بالغين والخاء",
    description: "تدرب على التفريق بين كلمات تحتوي على الغين والخاء",
    category: "words",
    difficulty: "intermediate",
    type: "word",
    duration: "٦ دقائق",
    questions: [
      { id: "hadw1", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "غراب", options: ["غراب", "خراب"], correctAnswer: 0 },
      { id: "hadw2", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "خيار", options: ["غيار", "خيار"], correctAnswer: 1 },
      { id: "hadw3", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "غابة", options: ["غابة", "خابة"], correctAnswer: 0 },
      { id: "hadw4", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "خاتم", options: ["غاتم", "خاتم"], correctAnswer: 1 },
      { id: "hadw5", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "غداء", options: ["غداء", "خداء"], correctAnswer: 0 },
      { id: "hadw6", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "خبز", options: ["غبز", "خبز"], correctAnswer: 1 },
      { id: "hadw7", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "غيمة", options: ["غيمة", "خيمة"], correctAnswer: 0 },
      { id: "hadw8", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "خروف", options: ["غروف", "خروف"], correctAnswer: 1 },
      { id: "hadw9", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "غسيل", options: ["غسيل", "خسيل"], correctAnswer: 0 },
      { id: "hadw10", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "خضار", options: ["غضار", "خضار"], correctAnswer: 1 },
    ],
  },

  // --- تمرين شامل لجميع حروف الحلق ---
  {
    id: "halq-all",
    title: "جميع حروف الحلق",
    description: "تدرب على التمييز بين جميع حروف الحلق الستة: ء، هـ، ع، ح، غ، خ",
    category: "tones",
    difficulty: "advanced",
    type: "tone",
    duration: "٨ دقائق",
    questions: [
      { id: "hall1", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "أَ أَ أَ", options: ["ء", "هـ", "ع", "ح"], correctAnswer: 0 },
      { id: "hall2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "هَ هَ هَ", options: ["ء", "هـ", "ع", "ح"], correctAnswer: 1 },
      { id: "hall3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "عَ عَ عَ", options: ["ء", "هـ", "ع", "ح"], correctAnswer: 2 },
      { id: "hall4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "حَ حَ حَ", options: ["ء", "هـ", "ع", "ح"], correctAnswer: 3 },
      { id: "hall5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "غَ غَ غَ", options: ["ع", "ح", "غ", "خ"], correctAnswer: 2 },
      { id: "hall6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "خَ خَ خَ", options: ["ع", "ح", "غ", "خ"], correctAnswer: 3 },
      { id: "hall7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "عَ عَ عَ", options: ["ع", "ح", "غ", "خ"], correctAnswer: 0 },
      { id: "hall8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "حَ حَ حَ", options: ["ع", "ح", "غ", "خ"], correctAnswer: 1 },
      { id: "hall9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "أَ أَ أَ", options: ["ء", "ع", "غ", "خ"], correctAnswer: 0 },
      { id: "hall10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "هَ هَ هَ", options: ["هـ", "ح", "غ", "خ"], correctAnswer: 0 },
      { id: "hall11", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "غَ غَ غَ", options: ["ء", "هـ", "غ", "خ"], correctAnswer: 2 },
      { id: "hall12", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "خَ خَ خَ", options: ["ء", "هـ", "غ", "خ"], correctAnswer: 3 },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // المخرج الثالث: اللسان (Tongue) - عدة مناطق
  // ═══════════════════════════════════════════════════════════════════════════

  // --- أقصى اللسان (مؤخرة اللسان): القاف والكاف ---
  {
    id: "lisan-aqsa-1",
    title: "أقصى اللسان: القاف والكاف",
    description: "حروف تخرج من مؤخرة اللسان مع الحنك - القاف أعمق من الكاف",
    category: "tones",
    difficulty: "intermediate",
    type: "tone",
    duration: "٥ دقائق",
    questions: [
      { id: "la1", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "قَ قَ قَ", options: ["ق", "ك"], correctAnswer: 0 },
      { id: "la2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "كَ كَ كَ", options: ["ق", "ك"], correctAnswer: 1 },
      { id: "la3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "قَ قَ قَ", options: ["ق", "ك"], correctAnswer: 0 },
      { id: "la4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "كَ كَ كَ", options: ["ق", "ك"], correctAnswer: 1 },
      { id: "la5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "كَ كَ كَ", options: ["ق", "ك"], correctAnswer: 1 },
      { id: "la6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "قَ قَ قَ", options: ["ق", "ك"], correctAnswer: 0 },
      { id: "la7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "قَ قَ قَ", options: ["ق", "ك"], correctAnswer: 0 },
      { id: "la8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "كَ كَ كَ", options: ["ق", "ك"], correctAnswer: 1 },
      { id: "la9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "كَ كَ كَ", options: ["ق", "ك"], correctAnswer: 1 },
      { id: "la10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "قَ قَ قَ", options: ["ق", "ك"], correctAnswer: 0 },
    ],
  },
  {
    id: "lisan-aqsa-words",
    title: "كلمات بالقاف والكاف",
    description: "تدرب على التفريق بين كلمات تحتوي على القاف والكاف",
    category: "words",
    difficulty: "intermediate",
    type: "word",
    duration: "٦ دقائق",
    questions: [
      { id: "law1", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "قلب", options: ["قلب", "كلب"], correctAnswer: 0 },
      { id: "law2", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "كتاب", options: ["قتاب", "كتاب"], correctAnswer: 1 },
      { id: "law3", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "قمر", options: ["قمر", "كمر"], correctAnswer: 0 },
      { id: "law4", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "كرسي", options: ["قرسي", "كرسي"], correctAnswer: 1 },
      { id: "law5", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "قلم", options: ["قلم", "كلم"], correctAnswer: 0 },
      { id: "law6", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "كوب", options: ["قوب", "كوب"], correctAnswer: 1 },
      { id: "law7", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "قهوة", options: ["قهوة", "كهوة"], correctAnswer: 0 },
      { id: "law8", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "كعكة", options: ["قعقة", "كعكة"], correctAnswer: 1 },
      { id: "law9", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "قطة", options: ["قطة", "كطة"], correctAnswer: 0 },
      { id: "law10", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "كنز", options: ["قنز", "كنز"], correctAnswer: 1 },
    ],
  },

  // --- وسط اللسان: الجيم والشين والياء غير المدية ---
  {
    id: "lisan-wasat-1",
    title: "وسط اللسان: الجيم والشين والياء",
    description: "حروف تخرج من وسط اللسان مع الحنك الأعلى",
    category: "tones",
    difficulty: "intermediate",
    type: "tone",
    duration: "٦ دقائق",
    questions: [
      { id: "lw1", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "جَ جَ جَ", options: ["ج", "ش", "ي"], correctAnswer: 0 },
      { id: "lw2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "شَ شَ شَ", options: ["ج", "ش", "ي"], correctAnswer: 1 },
      { id: "lw3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "يَ يَ يَ", options: ["ج", "ش", "ي"], correctAnswer: 2 },
      { id: "lw4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "جَ جَ جَ", options: ["ج", "ش", "ي"], correctAnswer: 0 },
      { id: "lw5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "شَ شَ شَ", options: ["ج", "ش", "ي"], correctAnswer: 1 },
      { id: "lw6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "يَ يَ يَ", options: ["ج", "ش", "ي"], correctAnswer: 2 },
      { id: "lw7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "شَ شَ شَ", options: ["ج", "ش", "ي"], correctAnswer: 1 },
      { id: "lw8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "جَ جَ جَ", options: ["ج", "ش", "ي"], correctAnswer: 0 },
      { id: "lw9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "يَ يَ يَ", options: ["ج", "ش", "ي"], correctAnswer: 2 },
      { id: "lw10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "جَ جَ جَ", options: ["ج", "ش", "ي"], correctAnswer: 0 },
    ],
  },

  // --- حافة اللسان: الضاد (حرف فريد في العربية) ---
  {
    id: "lisan-hafa-dad",
    title: "حافة اللسان: الضاد",
    description: "الضاد - الحرف الفريد الذي تسمى به اللغة العربية (لغة الضاد)",
    category: "tones",
    difficulty: "advanced",
    type: "tone",
    duration: "٥ دقائق",
    questions: [
      { id: "ld1", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ضَ ضَ ضَ", options: ["ض", "د", "ط", "ظ"], correctAnswer: 0 },
      { id: "ld2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "دَ دَ دَ", options: ["ض", "د", "ط", "ظ"], correctAnswer: 1 },
      { id: "ld3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "طَ طَ طَ", options: ["ض", "د", "ط", "ظ"], correctAnswer: 2 },
      { id: "ld4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ظَ ظَ ظَ", options: ["ض", "د", "ط", "ظ"], correctAnswer: 3 },
      { id: "ld5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ضَ ضَ ضَ", options: ["ض", "د", "ط", "ظ"], correctAnswer: 0 },
      { id: "ld6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "دَ دَ دَ", options: ["ض", "د", "ط", "ظ"], correctAnswer: 1 },
      { id: "ld7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ظَ ظَ ظَ", options: ["ض", "د", "ط", "ظ"], correctAnswer: 3 },
      { id: "ld8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "طَ طَ طَ", options: ["ض", "د", "ط", "ظ"], correctAnswer: 2 },
      { id: "ld9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ضَ ضَ ضَ", options: ["ض", "د", "ط", "ظ"], correctAnswer: 0 },
      { id: "ld10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ظَ ظَ ظَ", options: ["ض", "د", "ط", "ظ"], correctAnswer: 3 },
    ],
  },

  // --- طرف اللسان: حروف النطع (ت، د، ط) ---
  {
    id: "lisan-taraf-nat",
    title: "طرف اللسان - النِطع: التاء والدال والطاء",
    description: "حروف تخرج من طرف اللسان مع أصول الثنايا العليا (اللثة)",
    category: "tones",
    difficulty: "beginner",
    type: "tone",
    duration: "٦ دقائق",
    questions: [
      { id: "ln1", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "تَ تَ تَ", options: ["ت", "د", "ط"], correctAnswer: 0 },
      { id: "ln2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "دَ دَ دَ", options: ["ت", "د", "ط"], correctAnswer: 1 },
      { id: "ln3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "طَ طَ طَ", options: ["ت", "د", "ط"], correctAnswer: 2 },
      { id: "ln4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "تَ تَ تَ", options: ["ت", "د", "ط"], correctAnswer: 0 },
      { id: "ln5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "دَ دَ دَ", options: ["ت", "د", "ط"], correctAnswer: 1 },
      { id: "ln6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "طَ طَ طَ", options: ["ت", "د", "ط"], correctAnswer: 2 },
      { id: "ln7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "دَ دَ دَ", options: ["ت", "د", "ط"], correctAnswer: 1 },
      { id: "ln8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "تَ تَ تَ", options: ["ت", "د", "ط"], correctAnswer: 0 },
      { id: "ln9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "طَ طَ طَ", options: ["ت", "د", "ط"], correctAnswer: 2 },
      { id: "ln10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "تَ تَ تَ", options: ["ت", "د", "ط"], correctAnswer: 0 },
    ],
  },

  // --- طرف اللسان: حروف اللثة (ث، ذ، ظ) ---
  {
    id: "lisan-taraf-litha",
    title: "طرف اللسان - اللثة: الثاء والذال والظاء",
    description: "حروف تخرج من طرف اللسان مع أطراف الثنايا العليا",
    category: "tones",
    difficulty: "intermediate",
    type: "tone",
    duration: "٦ دقائق",
    questions: [
      { id: "ll1", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ثَ ثَ ثَ", options: ["ث", "ذ", "ظ"], correctAnswer: 0 },
      { id: "ll2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ذَ ذَ ذَ", options: ["ث", "ذ", "ظ"], correctAnswer: 1 },
      { id: "ll3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ظَ ظَ ظَ", options: ["ث", "ذ", "ظ"], correctAnswer: 2 },
      { id: "ll4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ثَ ثَ ثَ", options: ["ث", "ذ", "ظ"], correctAnswer: 0 },
      { id: "ll5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ذَ ذَ ذَ", options: ["ث", "ذ", "ظ"], correctAnswer: 1 },
      { id: "ll6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ظَ ظَ ظَ", options: ["ث", "ذ", "ظ"], correctAnswer: 2 },
      { id: "ll7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ذَ ذَ ذَ", options: ["ث", "ذ", "ظ"], correctAnswer: 1 },
      { id: "ll8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ثَ ثَ ثَ", options: ["ث", "ذ", "ظ"], correctAnswer: 0 },
      { id: "ll9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ظَ ظَ ظَ", options: ["ث", "ذ", "ظ"], correctAnswer: 2 },
      { id: "ll10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ثَ ثَ ثَ", options: ["ث", "ذ", "ظ"], correctAnswer: 0 },
    ],
  },

  // --- طرف اللسان: حروف الصفير (ص، س، ز) ---
  {
    id: "lisan-taraf-safir",
    title: "طرف اللسان - الصفير: الصاد والسين والزاي",
    description: "حروف الصفير - تخرج مع صوت يشبه الصفير - مهمة لزراعة القوقعة",
    category: "tones",
    difficulty: "intermediate",
    type: "tone",
    duration: "٦ دقائق",
    questions: [
      { id: "ls1", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "صَ صَ صَ", options: ["ص", "س", "ز"], correctAnswer: 0 },
      { id: "ls2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "سَ سَ سَ", options: ["ص", "س", "ز"], correctAnswer: 1 },
      { id: "ls3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "زَ زَ زَ", options: ["ص", "س", "ز"], correctAnswer: 2 },
      { id: "ls4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "صَ صَ صَ", options: ["ص", "س", "ز"], correctAnswer: 0 },
      { id: "ls5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "سَ سَ سَ", options: ["ص", "س", "ز"], correctAnswer: 1 },
      { id: "ls6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "زَ زَ زَ", options: ["ص", "س", "ز"], correctAnswer: 2 },
      { id: "ls7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "سَ سَ سَ", options: ["ص", "س", "ز"], correctAnswer: 1 },
      { id: "ls8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "صَ صَ صَ", options: ["ص", "س", "ز"], correctAnswer: 0 },
      { id: "ls9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "زَ زَ زَ", options: ["ص", "س", "ز"], correctAnswer: 2 },
      { id: "ls10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "صَ صَ صَ", options: ["ص", "س", "ز"], correctAnswer: 0 },
    ],
  },
  {
    id: "lisan-safir-words",
    title: "كلمات بحروف الصفير",
    description: "تدرب على كلمات تحتوي على حروف الصفير: ص، س، ز",
    category: "words",
    difficulty: "intermediate",
    type: "word",
    duration: "٦ دقائق",
    questions: [
      { id: "lsw1", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "صوت", options: ["صوت", "سوت", "زوت"], correctAnswer: 0 },
      { id: "lsw2", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "سمك", options: ["صمك", "سمك", "زمك"], correctAnswer: 1 },
      { id: "lsw3", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "زهرة", options: ["صهرة", "سهرة", "زهرة"], correctAnswer: 2 },
      { id: "lsw4", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "صباح", options: ["صباح", "سباح", "زباح"], correctAnswer: 0 },
      { id: "lsw5", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "سيارة", options: ["صيارة", "سيارة", "زيارة"], correctAnswer: 1 },
      { id: "lsw6", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "زيت", options: ["صيت", "سيت", "زيت"], correctAnswer: 2 },
      { id: "lsw7", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "صندوق", options: ["صندوق", "سندوق", "زندوق"], correctAnswer: 0 },
      { id: "lsw8", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "سلم", options: ["صلم", "سلم", "زلم"], correctAnswer: 1 },
      { id: "lsw9", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "زرافة", options: ["صرافة", "سرافة", "زرافة"], correctAnswer: 2 },
      { id: "lsw10", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "صورة", options: ["صورة", "سورة", "زورة"], correctAnswer: 0 },
    ],
  },

  // --- طرف اللسان: اللام والنون والراء ---
  {
    id: "lisan-taraf-lnr",
    title: "طرف اللسان: اللام والنون والراء",
    description: "حروف تخرج من طرف اللسان - مهمة جداً في النطق اليومي",
    category: "tones",
    difficulty: "beginner",
    type: "tone",
    duration: "٦ دقائق",
    questions: [
      { id: "lnr1", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "لَ لَ لَ", options: ["ل", "ن", "ر"], correctAnswer: 0 },
      { id: "lnr2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "نَ نَ نَ", options: ["ل", "ن", "ر"], correctAnswer: 1 },
      { id: "lnr3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "رَ رَ رَ", options: ["ل", "ن", "ر"], correctAnswer: 2 },
      { id: "lnr4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "لَ لَ لَ", options: ["ل", "ن", "ر"], correctAnswer: 0 },
      { id: "lnr5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "نَ نَ نَ", options: ["ل", "ن", "ر"], correctAnswer: 1 },
      { id: "lnr6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "رَ رَ رَ", options: ["ل", "ن", "ر"], correctAnswer: 2 },
      { id: "lnr7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "نَ نَ نَ", options: ["ل", "ن", "ر"], correctAnswer: 1 },
      { id: "lnr8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "لَ لَ لَ", options: ["ل", "ن", "ر"], correctAnswer: 0 },
      { id: "lnr9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "رَ رَ رَ", options: ["ل", "ن", "ر"], correctAnswer: 2 },
      { id: "lnr10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "لَ لَ لَ", options: ["ل", "ن", "ر"], correctAnswer: 0 },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // المخرج الرابع: الشفتان (Lips) - ف، و، ب، م
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "shafatan-1",
    title: "حروف الشفتين",
    description: "حروف تخرج من الشفتين: الفاء والواو والباء والميم",
    category: "tones",
    difficulty: "beginner",
    type: "tone",
    duration: "٦ دقائق",
    questions: [
      { id: "sh1", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "فَ فَ فَ", options: ["ف", "و", "ب", "م"], correctAnswer: 0 },
      { id: "sh2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "وَ وَ وَ", options: ["ف", "و", "ب", "م"], correctAnswer: 1 },
      { id: "sh3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "بَ بَ بَ", options: ["ف", "و", "ب", "م"], correctAnswer: 2 },
      { id: "sh4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "مَ مَ مَ", options: ["ف", "و", "ب", "م"], correctAnswer: 3 },
      { id: "sh5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "فَ فَ فَ", options: ["ف", "و", "ب", "م"], correctAnswer: 0 },
      { id: "sh6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "بَ بَ بَ", options: ["ف", "و", "ب", "م"], correctAnswer: 2 },
      { id: "sh7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "مَ مَ مَ", options: ["ف", "و", "ب", "م"], correctAnswer: 3 },
      { id: "sh8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "وَ وَ وَ", options: ["ف", "و", "ب", "م"], correctAnswer: 1 },
      { id: "sh9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "بَ بَ بَ", options: ["ف", "و", "ب", "م"], correctAnswer: 2 },
      { id: "sh10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "فَ فَ فَ", options: ["ف", "و", "ب", "م"], correctAnswer: 0 },
    ],
  },
  {
    id: "shafatan-fb",
    title: "التمييز بين الفاء والباء",
    description: "الفاء من الشفة السفلى والأسنان العليا، والباء من الشفتين معاً",
    category: "similar-sounds",
    difficulty: "beginner",
    type: "tone",
    duration: "٥ دقائق",
    questions: [
      { id: "fb1", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "فَ فَ فَ", options: ["ف", "ب"], correctAnswer: 0 },
      { id: "fb2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "بَ بَ بَ", options: ["ف", "ب"], correctAnswer: 1 },
      { id: "fb3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "فَ فَ فَ", options: ["ف", "ب"], correctAnswer: 0 },
      { id: "fb4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "بَ بَ بَ", options: ["ف", "ب"], correctAnswer: 1 },
      { id: "fb5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "بَ بَ بَ", options: ["ف", "ب"], correctAnswer: 1 },
      { id: "fb6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "فَ فَ فَ", options: ["ف", "ب"], correctAnswer: 0 },
      { id: "fb7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "فَ فَ فَ", options: ["ف", "ب"], correctAnswer: 0 },
      { id: "fb8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "بَ بَ بَ", options: ["ف", "ب"], correctAnswer: 1 },
      { id: "fb9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "بَ بَ بَ", options: ["ف", "ب"], correctAnswer: 1 },
      { id: "fb10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "فَ فَ فَ", options: ["ف", "ب"], correctAnswer: 0 },
    ],
  },
  {
    id: "shafatan-words",
    title: "كلمات بحروف الشفتين",
    description: "تدرب على كلمات تحتوي على حروف الشفتين",
    category: "words",
    difficulty: "beginner",
    type: "word",
    duration: "٦ دقائق",
    questions: [
      { id: "shw1", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "فيل", options: ["فيل", "بيل", "ميل"], correctAnswer: 0 },
      { id: "shw2", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "باب", options: ["فاب", "باب", "ماب"], correctAnswer: 1 },
      { id: "shw3", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "موز", options: ["فوز", "بوز", "موز"], correctAnswer: 2 },
      { id: "shw4", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "فراشة", options: ["فراشة", "براشة", "مراشة"], correctAnswer: 0 },
      { id: "shw5", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "بقرة", options: ["فقرة", "بقرة", "مقرة"], correctAnswer: 1 },
      { id: "shw6", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "مدرسة", options: ["فدرسة", "بدرسة", "مدرسة"], correctAnswer: 2 },
      { id: "shw7", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "فستان", options: ["فستان", "بستان", "مستان"], correctAnswer: 0 },
      { id: "shw8", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "برتقال", options: ["فرتقال", "برتقال", "مرتقال"], correctAnswer: 1 },
      { id: "shw9", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "مفتاح", options: ["ففتاح", "بفتاح", "مفتاح"], correctAnswer: 2 },
      { id: "shw10", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "فأر", options: ["فأر", "بأر", "مأر"], correctAnswer: 0 },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // المخرج الخامس: الخيشوم (Nasal) - الغنة
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "khayshum-1",
    title: "الخيشوم: الأصوات الأنفية",
    description: "الغنة - صوت يخرج من الأنف مع الميم والنون المشددتين",
    category: "tones",
    difficulty: "intermediate",
    type: "tone",
    duration: "٥ دقائق",
    questions: [
      { id: "kh1", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "مّ مّ مّ", options: ["م", "ن"], correctAnswer: 0 },
      { id: "kh2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "نّ نّ نّ", options: ["م", "ن"], correctAnswer: 1 },
      { id: "kh3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "مّ مّ مّ", options: ["م", "ن"], correctAnswer: 0 },
      { id: "kh4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "نّ نّ نّ", options: ["م", "ن"], correctAnswer: 1 },
      { id: "kh5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "نّ نّ نّ", options: ["م", "ن"], correctAnswer: 1 },
      { id: "kh6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "مّ مّ مّ", options: ["م", "ن"], correctAnswer: 0 },
      { id: "kh7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "مّ مّ مّ", options: ["م", "ن"], correctAnswer: 0 },
      { id: "kh8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "نّ نّ نّ", options: ["م", "ن"], correctAnswer: 1 },
      { id: "kh9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "نّ نّ نّ", options: ["م", "ن"], correctAnswer: 1 },
      { id: "kh10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "مّ مّ مّ", options: ["م", "ن"], correctAnswer: 0 },
    ],
  },
  {
    id: "khayshum-words",
    title: "كلمات بالأصوات الأنفية",
    description: "تدرب على كلمات فيها غنة (م أو ن مشددة)",
    category: "words",
    difficulty: "intermediate",
    type: "word",
    duration: "٦ دقائق",
    questions: [
      { id: "khw1", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "أمّي", options: ["أمّي", "أنّي"], correctAnswer: 0 },
      { id: "khw2", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "إنّ", options: ["إمّ", "إنّ"], correctAnswer: 1 },
      { id: "khw3", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "همّ", options: ["همّ", "هنّ"], correctAnswer: 0 },
      { id: "khw4", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "جنّة", options: ["جمّة", "جنّة"], correctAnswer: 1 },
      { id: "khw5", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "سمّاء", options: ["سمّاء", "سنّاء"], correctAnswer: 0 },
      { id: "khw6", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "منّ", options: ["ممّ", "منّ"], correctAnswer: 1 },
      { id: "khw7", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "ثمّ", options: ["ثمّ", "ثنّ"], correctAnswer: 0 },
      { id: "khw8", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "عنّب", options: ["عمّب", "عنّب"], correctAnswer: 1 },
      { id: "khw9", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "حمّام", options: ["حمّام", "حنّام"], correctAnswer: 0 },
      { id: "khw10", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "فنّان", options: ["فمّان", "فنّان"], correctAnswer: 1 },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // تمارين خاصة لمستخدمي زراعة القوقعة (CI-Specific)
  // ═══════════════════════════════════════════════════════════════════════════

  // --- الأزواج الدنيا (Minimal Pairs) - كلمات تختلف بصوت واحد فقط ---
  {
    id: "ci-minimal-pairs-1",
    title: "الأزواج الدنيا: المستوى الأول",
    description: "كلمات تختلف بحرف واحد فقط - تمرين أساسي لتدريب السمع",
    category: "words",
    difficulty: "beginner",
    type: "word",
    duration: "٧ دقائق",
    questions: [
      { id: "mp1", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "باب", options: ["باب", "تاب"], correctAnswer: 0 },
      { id: "mp2", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "نار", options: ["نار", "دار"], correctAnswer: 0 },
      { id: "mp3", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "كلب", options: ["قلب", "كلب"], correctAnswer: 1 },
      { id: "mp4", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "سار", options: ["سار", "صار"], correctAnswer: 0 },
      { id: "mp5", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "حال", options: ["حال", "خال"], correctAnswer: 0 },
      { id: "mp6", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "عين", options: ["عين", "غين"], correctAnswer: 0 },
      { id: "mp7", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "طين", options: ["دين", "طين"], correctAnswer: 1 },
      { id: "mp8", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "ضرب", options: ["ضرب", "درب"], correctAnswer: 0 },
      { id: "mp9", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "فار", options: ["فار", "بار"], correctAnswer: 0 },
      { id: "mp10", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "مال", options: ["نال", "مال"], correctAnswer: 1 },
    ],
  },
  {
    id: "ci-minimal-pairs-2",
    title: "الأزواج الدنيا: المستوى الثاني",
    description: "أزواج دنيا أكثر تعقيداً للتمييز الدقيق",
    category: "words",
    difficulty: "intermediate",
    type: "word",
    duration: "٧ دقائق",
    questions: [
      { id: "mp2-1", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "ظل", options: ["ضل", "ظل"], correctAnswer: 1 },
      { id: "mp2-2", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "ذهب", options: ["ذهب", "زهب"], correctAnswer: 0 },
      { id: "mp2-3", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "ثوب", options: ["ثوب", "سوب"], correctAnswer: 0 },
      { id: "mp2-4", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "شمس", options: ["سمس", "شمس"], correctAnswer: 1 },
      { id: "mp2-5", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "حرب", options: ["عرب", "حرب"], correctAnswer: 1 },
      { id: "mp2-6", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "غرب", options: ["غرب", "خرب"], correctAnswer: 0 },
      { id: "mp2-7", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "هدى", options: ["هدى", "أدى"], correctAnswer: 0 },
      { id: "mp2-8", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "قال", options: ["قال", "كال"], correctAnswer: 0 },
      { id: "mp2-9", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "رمل", options: ["رمل", "لمل"], correctAnswer: 0 },
      { id: "mp2-10", prompt: "ما الكلمة التي سمعتها؟", audioPlaceholder: "جمل", options: ["حمل", "جمل"], correctAnswer: 1 },
    ],
  },

  // --- التمييز بين المجهور والمهموس (Voiced vs Voiceless) ---
  {
    id: "ci-voiced-voiceless",
    title: "المجهور والمهموس",
    description: "تمييز بين الحروف المجهورة (مع اهتزاز الحبال الصوتية) والمهموسة",
    category: "tones",
    difficulty: "advanced",
    type: "tone",
    duration: "٦ دقائق",
    questions: [
      { id: "vv1", prompt: "ما الحرف الذي سمعته؟ (مجهور أم مهموس)", audioPlaceholder: "بَ بَ بَ", options: ["ب (مجهور)", "ت (مهموس)"], correctAnswer: 0 },
      { id: "vv2", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "تَ تَ تَ", options: ["د (مجهور)", "ت (مهموس)"], correctAnswer: 1 },
      { id: "vv3", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "دَ دَ دَ", options: ["د (مجهور)", "ت (مهموس)"], correctAnswer: 0 },
      { id: "vv4", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "سَ سَ سَ", options: ["ز (مجهور)", "س (مهموس)"], correctAnswer: 1 },
      { id: "vv5", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "زَ زَ زَ", options: ["ز (مجهور)", "س (مهموس)"], correctAnswer: 0 },
      { id: "vv6", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "كَ كَ كَ", options: ["غ (مجهور)", "ك (مهموس)"], correctAnswer: 1 },
      { id: "vv7", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "غَ غَ غَ", options: ["غ (مجهور)", "خ (مهموس)"], correctAnswer: 0 },
      { id: "vv8", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "خَ خَ خَ", options: ["غ (مجهور)", "خ (مهموس)"], correctAnswer: 1 },
      { id: "vv9", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ظَ ظَ ظَ", options: ["ظ (مجهور)", "ث (مهموس)"], correctAnswer: 0 },
      { id: "vv10", prompt: "ما الحرف الذي سمعته؟", audioPlaceholder: "ثَ ثَ ثَ", options: ["ذ (مجهور)", "ث (مهموس)"], correctAnswer: 1 },
    ],
  },

  // --- التمييز الترددي (تردد عالي مقابل منخفض) ---
  {
    id: "ci-frequency",
    title: "التمييز الترددي",
    description: "تمييز بين الأصوات عالية التردد (س، ش، ف) والأصوات منخفضة التردد (م، ن، و)",
    category: "tones",
    difficulty: "intermediate",
    type: "tone",
    duration: "٦ دقائق",
    questions: [
      { id: "fr1", prompt: "هل الصوت عالي أم منخفض التردد؟", audioPlaceholder: "سَ سَ سَ", options: ["عالي التردد", "منخفض التردد"], correctAnswer: 0 },
      { id: "fr2", prompt: "هل الصوت عالي أم منخفض التردد؟", audioPlaceholder: "مَ مَ مَ", options: ["عالي التردد", "منخفض التردد"], correctAnswer: 1 },
      { id: "fr3", prompt: "هل الصوت عالي أم منخفض التردد؟", audioPlaceholder: "شَ شَ شَ", options: ["عالي التردد", "منخفض التردد"], correctAnswer: 0 },
      { id: "fr4", prompt: "هل الصوت عالي أم منخفض التردد؟", audioPlaceholder: "نَ نَ نَ", options: ["عالي التردد", "منخفض التردد"], correctAnswer: 1 },
      { id: "fr5", prompt: "هل الصوت عالي أم منخفض التردد؟", audioPlaceholder: "فَ فَ فَ", options: ["عالي التردد", "منخفض التردد"], correctAnswer: 0 },
      { id: "fr6", prompt: "هل الصوت عالي أم منخفض التردد؟", audioPlaceholder: "وَ وَ وَ", options: ["عالي التردد", "منخفض التردد"], correctAnswer: 1 },
      { id: "fr7", prompt: "هل الصوت عالي أم منخفض التردد؟", audioPlaceholder: "ثَ ثَ ثَ", options: ["عالي التردد", "منخفض التردد"], correctAnswer: 0 },
      { id: "fr8", prompt: "هل الصوت عالي أم منخفض التردد؟", audioPlaceholder: "غَ غَ غَ", options: ["عالي التردد", "منخفض التردد"], correctAnswer: 1 },
      { id: "fr9", prompt: "هل الصوت عالي أم منخفض التردد؟", audioPlaceholder: "صَ صَ صَ", options: ["عالي التردد", "منخفض التردد"], correctAnswer: 0 },
      { id: "fr10", prompt: "هل الصوت عالي أم منخفض التردد؟", audioPlaceholder: "بَ بَ بَ", options: ["عالي التردد", "منخفض التردد"], correctAnswer: 1 },
    ],
  },

  // --- تمارين الحروف المتشابهة الموجودة سابقاً (محدثة) ---
  // === تمارين التمييز بين الحروف المتشابهة ===
  {
    id: "letters-1",
    title: "التمييز بين ب و ت",
    description: "تدرب على التفريق بين صوت حرف الباء وحرف التاء",
    category: "similar-sounds",
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
    category: "similar-sounds",
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
    category: "similar-sounds",
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
    category: "similar-sounds",
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
    category: "similar-sounds",
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
    category: "similar-sounds",
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
    category: "similar-sounds",
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
    category: "similar-sounds",
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
];

const STORAGE_KEY = "deepdive-exercises-v8";

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
    const filtered = exercises.filter(e => e.category === category);

    // Sort by difficulty for all categories except arabic-sounds and makharij
    if (category !== "arabic-sounds" && category !== "makharij") {
      const difficultyOrder: Record<string, number> = {
        beginner: 1,
        intermediate: 2,
        advanced: 3
      };
      return filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    }

    return filtered;
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
