// ============================================
// تمارين السمع المحسنة - 12 مرحلة تدريبية
// Enhanced Auditory Exercises - 12 Training Levels
// Based on: كتاب تدريبات الأصوات العربية
// ============================================

import {
  AuditoryQuestion,
  AuditoryExercise,
  TrainingLevel,
  SoundPosition,
  SyllableCount,
  TRAINING_LEVEL_NAMES
} from "@/types/arabic-sounds";
import { arabicSounds, getSoundById, getSimilarSounds } from "./arabic-sounds";

// ============================================
// مولد الأسئلة حسب المرحلة
// ============================================

// Helper to get similar sound letters
const getSimilarSoundLetters = (soundId: string): string[] => {
  return getSimilarSounds(soundId).map(s => s.letter);
};

// توليد أسئلة مرحلة الصوت المعزول
const generateIsolationQuestions = (soundId: string): AuditoryQuestion[] => {
  const sound = getSoundById(soundId);
  if (!sound) return [];

  const similarSoundLetters = getSimilarSoundLetters(soundId);
  const questions: AuditoryQuestion[] = [];

  // سؤال: تمييز الصوت المعزول
  questions.push({
    id: `${soundId}-isolation-1`,
    targetSound: sound.letter,
    level: 'isolation',
    prompt: `استمع للصوت وحدد الحرف الصحيح`,
    audioDescription: `صوت الحرف ${sound.letter} معزولاً`,
    options: [sound.letter, ...similarSoundLetters.slice(0, 3)].sort(() => Math.random() - 0.5),
    correctAnswer: 0,
    distractorSounds: similarSoundLetters.slice(0, 3),
    hint: sound.trainingTip,
    explanation: `هذا صوت ${sound.name}، مخرجه: ${sound.articulationDescription}`
  });

  // إعادة ترتيب الخيارات وتحديد الإجابة الصحيحة
  const options = questions[0].options;
  questions[0].correctAnswer = options.indexOf(sound.letter);

  // سؤال: هل سمعت الصوت؟
  questions.push({
    id: `${soundId}-isolation-2`,
    targetSound: sound.letter,
    level: 'isolation',
    prompt: `هل الصوت الذي سمعته هو صوت ${sound.letter}؟`,
    audioDescription: `صوت الحرف ${sound.letter}`,
    options: ['نعم', 'لا'],
    correctAnswer: 0,
    hint: `ركز على مخرج الصوت: ${sound.articulationDescription}`,
    explanation: `صحيح! هذا صوت ${sound.name}`
  });

  // سؤال: تمييز بين صوتين متشابهين
  if (similarSoundLetters.length > 0) {
    questions.push({
      id: `${soundId}-isolation-3`,
      targetSound: sound.letter,
      level: 'isolation',
      prompt: `ما الفرق بين صوت ${sound.letter} وصوت ${similarSoundLetters[0]}؟`,
      audioDescription: `مقارنة بين ${sound.letter} و ${similarSoundLetters[0]}`,
      options: [
        `${sound.letter} من ${sound.articulationDescription}`,
        `${sound.letter} و ${similarSoundLetters[0]} متطابقان`,
        `لا يوجد فرق`,
        `${similarSoundLetters[0]} أقوى`
      ],
      correctAnswer: 0,
      distractorSounds: [similarSoundLetters[0]],
      hint: 'ركز على مخرج كل صوت',
      explanation: `${sound.letter} مخرجه ${sound.articulationDescription}`
    });
  }

  return questions;
};

// توليد أسئلة مرحلة CV (صوت + مد)
const generateCVQuestions = (soundId: string): AuditoryQuestion[] => {
  const sound = getSoundById(soundId);
  if (!sound) return [];

  const questions: AuditoryQuestion[] = [];
  const cvExamples = sound.examples.cv; // مثل: با، بي، بو
  const similarSoundLetters = getSimilarSoundLetters(soundId);

  cvExamples.forEach((cv, index) => {
    const distractors = similarSoundLetters.slice(0, 2).map(s => {
      const vowel = cv.slice(-1); // الحركة
      return s + vowel;
    });

    questions.push({
      id: `${soundId}-cv-${index + 1}`,
      targetSound: sound.letter,
      level: 'cv',
      prompt: `استمع واختر المقطع الصحيح`,
      audioDescription: `المقطع ${cv}`,
      options: [cv, ...distractors, cvExamples[(index + 1) % cvExamples.length]].slice(0, 4),
      correctAnswer: 0,
      distractorSounds: similarSoundLetters.slice(0, 2),
      hint: `المقطع يبدأ بصوت ${sound.letter}`,
      explanation: `المقطع ${cv} يتكون من ${sound.letter} مع مد`
    });

    // إعادة ترتيب وتحديد الإجابة
    const opts = questions[questions.length - 1].options.sort(() => Math.random() - 0.5);
    questions[questions.length - 1].options = opts;
    questions[questions.length - 1].correctAnswer = opts.indexOf(cv);
  });

  return questions;
};

// توليد أسئلة مرحلة VC (مد + صوت)
const generateVCQuestions = (soundId: string): AuditoryQuestion[] => {
  const sound = getSoundById(soundId);
  if (!sound) return [];

  const questions: AuditoryQuestion[] = [];
  const vcExamples = sound.examples.vc; // مثل: آب، إيب، أوب
  const similarSoundLetters = getSimilarSoundLetters(soundId);

  vcExamples.forEach((vc, index) => {
    const distractors = similarSoundLetters.slice(0, 2).map(s => {
      const vowel = vc.slice(0, -1); // المد
      return vowel + s;
    });

    questions.push({
      id: `${soundId}-vc-${index + 1}`,
      targetSound: sound.letter,
      level: 'vc',
      prompt: `استمع واختر المقطع الصحيح`,
      audioDescription: `المقطع ${vc}`,
      options: [vc, ...distractors].slice(0, 4),
      correctAnswer: 0,
      distractorSounds: similarSoundLetters.slice(0, 2),
      hint: `المقطع ينتهي بصوت ${sound.letter}`,
      explanation: `المقطع ${vc} ينتهي بصوت ${sound.name}`
    });

    const opts = questions[questions.length - 1].options.sort(() => Math.random() - 0.5);
    questions[questions.length - 1].options = opts;
    questions[questions.length - 1].correctAnswer = opts.indexOf(vc);
  });

  return questions;
};

// توليد أسئلة مرحلة VCV
const generateVCVQuestions = (soundId: string): AuditoryQuestion[] => {
  const sound = getSoundById(soundId);
  if (!sound) return [];

  const questions: AuditoryQuestion[] = [];
  const vcvExamples = sound.examples.vcv.flat().slice(0, 6);

  vcvExamples.forEach((vcv, index) => {
    questions.push({
      id: `${soundId}-vcv-${index + 1}`,
      targetSound: sound.letter,
      level: 'vcv',
      prompt: `استمع واختر المقطع الصحيح`,
      audioDescription: `المقطع ${vcv}`,
      options: [vcv, ...vcvExamples.filter(v => v !== vcv).slice(0, 3)],
      correctAnswer: 0,
      hint: `المقطع يحتوي على صوت ${sound.letter} في الوسط`,
      explanation: `المقطع ${vcv} يحتوي على ${sound.name} بين مدين`
    });

    const opts = questions[questions.length - 1].options.sort(() => Math.random() - 0.5);
    questions[questions.length - 1].options = opts;
    questions[questions.length - 1].correctAnswer = opts.indexOf(vcv);
  });

  return questions;
};

// توليد أسئلة الكلمات غير المفهومة
const generateNonsenseWordsQuestions = (soundId: string): AuditoryQuestion[] => {
  const sound = getSoundById(soundId);
  if (!sound) return [];

  const questions: AuditoryQuestion[] = [];
  const nonsenseWords = sound.examples.nonsenseWords;
  const similarSoundLetters = getSimilarSoundLetters(soundId);

  nonsenseWords.forEach((word, index) => {
    const distractors = nonsenseWords.filter(w => w !== word).slice(0, 2);

    questions.push({
      id: `${soundId}-nonsense-${index + 1}`,
      targetSound: sound.letter,
      level: 'nonsense_words',
      prompt: `استمع واختر الكلمة الصحيحة`,
      audioDescription: `الكلمة ${word}`,
      options: [word, ...distractors, similarSoundLetters[0] ? word.replace(sound.letter, similarSoundLetters[0]) : word + 'ا'].slice(0, 4),
      correctAnswer: 0,
      distractorSounds: similarSoundLetters.slice(0, 1),
      hint: `الكلمة تحتوي على صوت ${sound.letter}`,
      explanation: `الكلمة ${word} تحتوي على صوت ${sound.name}`
    });

    const opts = questions[questions.length - 1].options.sort(() => Math.random() - 0.5);
    questions[questions.length - 1].options = opts;
    questions[questions.length - 1].correctAnswer = opts.indexOf(word);
  });

  return questions;
};

// توليد أسئلة الكلمات الحقيقية
const generateRealWordsQuestions = (soundId: string): AuditoryQuestion[] => {
  const sound = getSoundById(soundId);
  if (!sound) return [];

  const questions: AuditoryQuestion[] = [];
  const positions: SoundPosition[] = ['initial', 'medial', 'final'];
  const syllableCounts: SyllableCount[] = ['mono', 'bi', 'multi'];

  positions.forEach(position => {
    syllableCounts.forEach(syllable => {
      const words = sound.examples.realWords[position][syllable];
      if (words.length === 0) return;

      words.slice(0, 2).forEach((word, index) => {
        const otherWords = [
          ...sound.examples.realWords[position].mono,
          ...sound.examples.realWords[position].bi,
          ...sound.examples.realWords[position].multi
        ].filter(w => w !== word);

        questions.push({
          id: `${soundId}-real-${position}-${syllable}-${index + 1}`,
          targetSound: sound.letter,
          level: 'real_words',
          soundPosition: position,
          syllableCount: syllable,
          prompt: `استمع واختر الكلمة الصحيحة`,
          audioDescription: `الكلمة ${word}`,
          options: [word, ...otherWords.slice(0, 3)],
          correctAnswer: 0,
          hint: `الكلمة تحتوي على صوت ${sound.letter} في ${position === 'initial' ? 'البداية' : position === 'medial' ? 'الوسط' : 'النهاية'}`,
          explanation: `الكلمة ${word} - صوت ${sound.name} في ${position === 'initial' ? 'بداية' : position === 'medial' ? 'وسط' : 'نهاية'} الكلمة`
        });

        const opts = questions[questions.length - 1].options.sort(() => Math.random() - 0.5);
        questions[questions.length - 1].options = opts;
        questions[questions.length - 1].correctAnswer = opts.indexOf(word);
      });
    });
  });

  return questions;
};

// توليد أسئلة العبارات
const generatePhrasesQuestions = (soundId: string): AuditoryQuestion[] => {
  const sound = getSoundById(soundId);
  if (!sound) return [];

  const questions: AuditoryQuestion[] = [];
  const phrases = sound.examples.phrases;

  phrases.slice(0, 4).forEach((phrase, index) => {
    questions.push({
      id: `${soundId}-phrase-${index + 1}`,
      targetSound: sound.letter,
      level: 'phrases',
      prompt: `استمع واختر العبارة الصحيحة`,
      audioDescription: `العبارة: ${phrase}`,
      options: [phrase, ...phrases.filter(p => p !== phrase).slice(0, 3)],
      correctAnswer: 0,
      hint: `العبارة تحتوي على كلمات بها صوت ${sound.letter}`,
      explanation: `العبارة الصحيحة: ${phrase}`
    });

    const opts = questions[questions.length - 1].options.sort(() => Math.random() - 0.5);
    questions[questions.length - 1].options = opts;
    questions[questions.length - 1].correctAnswer = opts.indexOf(phrase);
  });

  // سؤال: كم مرة سمعت الصوت
  if (phrases.length > 0) {
    const targetPhrase = phrases[0];
    const count = (targetPhrase.match(new RegExp(sound.letter, 'g')) || []).length;

    questions.push({
      id: `${soundId}-phrase-count`,
      targetSound: sound.letter,
      level: 'phrases',
      prompt: `كم مرة سمعت صوت ${sound.letter} في العبارة؟`,
      audioDescription: `العبارة: ${targetPhrase}`,
      options: [`${count} مرات`, `${count + 1} مرات`, `${count - 1 > 0 ? count - 1 : 1} مرة`, `${count + 2} مرات`],
      correctAnswer: 0,
      hint: `استمع بتركيز لكل كلمة`,
      explanation: `صوت ${sound.letter} يظهر ${count} مرات في العبارة`
    });
  }

  return questions;
};

// توليد أسئلة الجمل
const generateSentencesQuestions = (soundId: string): AuditoryQuestion[] => {
  const sound = getSoundById(soundId);
  if (!sound) return [];

  const questions: AuditoryQuestion[] = [];
  const sentences = sound.examples.sentences;

  sentences.slice(0, 4).forEach((sentence, index) => {
    questions.push({
      id: `${soundId}-sentence-${index + 1}`,
      targetSound: sound.letter,
      level: 'sentences',
      prompt: `استمع واختر الجملة الصحيحة`,
      audioDescription: `الجملة: ${sentence}`,
      options: [sentence, ...sentences.filter(s => s !== sentence).slice(0, 3)],
      correctAnswer: 0,
      hint: `الجملة تحتوي على عدة كلمات بها صوت ${sound.letter}`,
      explanation: `الجملة الصحيحة: ${sentence}`
    });

    const opts = questions[questions.length - 1].options.sort(() => Math.random() - 0.5);
    questions[questions.length - 1].options = opts;
    questions[questions.length - 1].correctAnswer = opts.indexOf(sentence);
  });

  return questions;
};

// توليد أسئلة إعادة سرد القصة
const generateStoryRetellingQuestions = (soundId: string): AuditoryQuestion[] => {
  const sound = getSoundById(soundId);
  if (!sound) return [];

  const questions: AuditoryQuestion[] = [];
  const story = sound.examples.storyRetelling;
  const similarSoundLetters = getSimilarSoundLetters(soundId);

  // استخراج كلمات تحتوي على الصوت المستهدف
  const words = story.split(/\s+/).filter(w => w.includes(sound.letter));

  if (words.length >= 2) {
    questions.push({
      id: `${soundId}-story-retelling-1`,
      targetSound: sound.letter,
      level: 'story_retelling',
      prompt: `استمع للقصة ثم اختر الكلمة التي سمعتها`,
      audioDescription: `القصة: ${story}`,
      options: [words[0], words[0].replace(sound.letter, similarSoundLetters[0] || 'ا'), 'لم أسمعها', 'غير متأكد'],
      correctAnswer: 0,
      hint: `ركز على الكلمات التي تحتوي على صوت ${sound.letter}`,
      explanation: `الكلمة ${words[0]} وردت في القصة`
    });
  }

  questions.push({
    id: `${soundId}-story-retelling-2`,
    targetSound: sound.letter,
    level: 'story_retelling',
    prompt: `ما الصوت الذي تكرر كثيراً في القصة؟`,
    audioDescription: `القصة: ${story}`,
    options: [sound.letter, ...similarSoundLetters.slice(0, 3)],
    correctAnswer: 0,
    hint: `استمع للصوت المتكرر`,
    explanation: `صوت ${sound.name} هو الصوت المستهدف في هذه القصة`
  });

  return questions;
};

// توليد أسئلة سرد القصص
const generateStoryTellingQuestions = (soundId: string): AuditoryQuestion[] => {
  const sound = getSoundById(soundId);
  if (!sound) return [];

  const questions: AuditoryQuestion[] = [];
  const prompt = sound.examples.storyTellingPrompt;

  questions.push({
    id: `${soundId}-story-telling-1`,
    targetSound: sound.letter,
    level: 'story_telling',
    prompt: `اسرد قصة قصيرة تحتوي على كلمات بها صوت ${sound.letter}`,
    audioDescription: `موضوع القصة: ${prompt}`,
    options: ['أكملت السرد بنجاح', 'أحتاج المزيد من الوقت', 'أريد موضوعاً آخر', 'لم أستطع'],
    correctAnswer: 0,
    hint: `استخدم كلمات مثل: ${sound.examples.realWords.initial.bi.slice(0, 3).join('، ')}`,
    explanation: `أحسنت! حاول استخدام المزيد من الكلمات التي تحتوي على ${sound.letter}`
  });

  return questions;
};

// توليد أسئلة الإجابة على الأسئلة
const generateQuestionsQuestions = (soundId: string): AuditoryQuestion[] => {
  const sound = getSoundById(soundId);
  if (!sound) return [];

  const questions: AuditoryQuestion[] = [];
  const qaItems = sound.examples.questions;

  qaItems.forEach((qa, index) => {
    questions.push({
      id: `${soundId}-questions-${index + 1}`,
      targetSound: sound.letter,
      level: 'questions',
      prompt: qa.question,
      audioDescription: `سؤال: ${qa.question}`,
      options: [qa.answer, 'لا أعرف', 'أحتاج تكرار السؤال', 'السؤال غير واضح'],
      correctAnswer: 0,
      hint: `الإجابة تحتوي على صوت ${sound.letter}`,
      explanation: `الإجابة الصحيحة: ${qa.answer}`
    });
  });

  return questions;
};

// توليد أسئلة الكلام المسترسل
const generateSpontaneousQuestions = (soundId: string): AuditoryQuestion[] => {
  const sound = getSoundById(soundId);
  if (!sound) return [];

  const questions: AuditoryQuestion[] = [];
  const prompt = sound.examples.spontaneousPrompt;

  questions.push({
    id: `${soundId}-spontaneous-1`,
    targetSound: sound.letter,
    level: 'spontaneous',
    prompt: prompt,
    audioDescription: `موضوع المحادثة: ${prompt}`,
    options: ['تحدثت بطلاقة', 'واجهت بعض الصعوبات', 'أحتاج المزيد من التدريب', 'لم أستطع'],
    correctAnswer: 0,
    hint: `حاول استخدام كلمات متنوعة تحتوي على صوت ${sound.letter}`,
    explanation: `استمر في التدريب! كل محادثة تساعدك على التحسن`
  });

  return questions;
};

// ============================================
// توليد الأسئلة حسب المرحلة
// ============================================

export const generateQuestionsForLevel = (
  soundId: string,
  level: TrainingLevel
): AuditoryQuestion[] => {
  switch (level) {
    case 'isolation':
      return generateIsolationQuestions(soundId);
    case 'cv':
      return generateCVQuestions(soundId);
    case 'vc':
      return generateVCQuestions(soundId);
    case 'vcv':
      return generateVCVQuestions(soundId);
    case 'nonsense_words':
      return generateNonsenseWordsQuestions(soundId);
    case 'real_words':
      return generateRealWordsQuestions(soundId);
    case 'phrases':
      return generatePhrasesQuestions(soundId);
    case 'sentences':
      return generateSentencesQuestions(soundId);
    case 'story_retelling':
      return generateStoryRetellingQuestions(soundId);
    case 'story_telling':
      return generateStoryTellingQuestions(soundId);
    case 'questions':
      return generateQuestionsQuestions(soundId);
    case 'spontaneous':
      return generateSpontaneousQuestions(soundId);
    default:
      return [];
  }
};

// ============================================
// توليد تمرين كامل
// ============================================

export const generateExercise = (
  soundId: string,
  level: TrainingLevel,
  questionCount: number = 5
): AuditoryExercise | null => {
  const sound = getSoundById(soundId);
  if (!sound) return null;

  const allQuestions = generateQuestionsForLevel(soundId, level);
  const selectedQuestions = allQuestions
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(questionCount, allQuestions.length));

  if (selectedQuestions.length === 0) return null;

  return {
    id: `exercise-${soundId}-${level}-${Date.now()}`,
    title: `تدريب صوت ${sound.letter} - ${TRAINING_LEVEL_NAMES[level]}`,
    description: `تدريبات على صوت ${sound.name} في مرحلة ${TRAINING_LEVEL_NAMES[level]}`,
    targetSound: sound.letter,
    level,
    difficulty: ['isolation', 'cv', 'vc', 'vcv'].includes(level)
      ? 'beginner'
      : ['nonsense_words', 'real_words', 'phrases'].includes(level)
        ? 'intermediate'
        : 'advanced',
    questions: selectedQuestions,
    estimatedDuration: `${selectedQuestions.length * 30} ثانية`
  };
};

// ============================================
// توليد تمارين لجميع الأصوات
// ============================================

export const generateAllExercisesForSound = (soundId: string): AuditoryExercise[] => {
  const exercises: AuditoryExercise[] = [];
  const levels: TrainingLevel[] = [
    'isolation', 'cv', 'vc', 'vcv', 'nonsense_words',
    'real_words', 'phrases', 'sentences', 'story_retelling',
    'story_telling', 'questions', 'spontaneous'
  ];

  levels.forEach(level => {
    const exercise = generateExercise(soundId, level);
    if (exercise) {
      exercises.push(exercise);
    }
  });

  return exercises;
};

// ============================================
// الحصول على تمرين مخصص
// ============================================

export const getCustomExercise = (
  soundId: string,
  level: TrainingLevel,
  position?: SoundPosition,
  questionCount: number = 5
): AuditoryExercise | null => {
  const sound = getSoundById(soundId);
  if (!sound) return null;

  let questions = generateQuestionsForLevel(soundId, level);

  // تصفية حسب الموقع إذا كان محدداً
  if (position && level === 'real_words') {
    questions = questions.filter(q => q.soundPosition === position);
  }

  const selectedQuestions = questions
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(questionCount, questions.length));

  if (selectedQuestions.length === 0) return null;

  const positionName = position
    ? ` - ${position === 'initial' ? 'بداية الكلمة' : position === 'medial' ? 'وسط الكلمة' : 'نهاية الكلمة'}`
    : '';

  return {
    id: `custom-${soundId}-${level}-${position || 'all'}-${Date.now()}`,
    title: `تدريب صوت ${sound.letter} - ${TRAINING_LEVEL_NAMES[level]}${positionName}`,
    description: `تدريبات مخصصة على صوت ${sound.name}`,
    targetSound: sound.letter,
    level,
    difficulty: ['isolation', 'cv', 'vc', 'vcv'].includes(level)
      ? 'beginner'
      : ['nonsense_words', 'real_words', 'phrases'].includes(level)
        ? 'intermediate'
        : 'advanced',
    questions: selectedQuestions,
    estimatedDuration: `${selectedQuestions.length * 30} ثانية`
  };
};

// ============================================
// قائمة الأصوات المتاحة للتدريب
// ============================================

export const getAvailableSounds = () => {
  return arabicSounds.map(sound => ({
    id: sound.id,
    letter: sound.letter,
    name: sound.name,
    articulationPoint: sound.articulationPoint,
    articulationDescription: sound.articulationDescription
  }));
};

// ============================================
// توليد تمرين مراجعة للأصوات المتشابهة
// ============================================

export const generateSimilarSoundsReview = (
  sound1: string,
  sound2: string,
  questionCount: number = 6
): AuditoryExercise | null => {
  const soundData1 = arabicSounds.find(s => s.letter === sound1);
  const soundData2 = arabicSounds.find(s => s.letter === sound2);

  if (!soundData1 || !soundData2) return null;

  const questions: AuditoryQuestion[] = [];

  // أسئلة مقارنة
  [soundData1, soundData2].forEach((sound, idx) => {
    questions.push({
      id: `compare-${sound.letter}-${idx}`,
      targetSound: sound.letter,
      level: 'isolation',
      prompt: `استمع وحدد: هل هذا صوت ${sound1} أم ${sound2}؟`,
      audioDescription: `صوت ${sound.letter}`,
      options: [sound1, sound2],
      correctAnswer: idx,
      hint: `${sound.letter} مخرجه ${sound.articulationDescription}`,
      explanation: `هذا صوت ${sound.name}، مخرجه: ${sound.articulationDescription}`
    });
  });

  // أسئلة كلمات
  const words1 = soundData1.examples.realWords.initial.bi.slice(0, 2);
  const words2 = soundData2.examples.realWords.initial.bi.slice(0, 2);

  [...words1, ...words2].forEach((word, idx) => {
    const isFromSound1 = idx < words1.length;
    questions.push({
      id: `word-compare-${idx}`,
      targetSound: isFromSound1 ? sound1 : sound2,
      level: 'real_words',
      prompt: `الكلمة التي سمعتها تحتوي على صوت:`,
      audioDescription: `الكلمة: ${word}`,
      options: [sound1, sound2, 'كلاهما', 'لا أحد منهما'],
      correctAnswer: isFromSound1 ? 0 : 1,
      hint: 'ركز على الصوت في بداية الكلمة',
      explanation: `الكلمة ${word} تحتوي على صوت ${isFromSound1 ? soundData1.name : soundData2.name}`
    });
  });

  const selectedQuestions = questions
    .sort(() => Math.random() - 0.5)
    .slice(0, questionCount);

  return {
    id: `review-${sound1}-${sound2}-${Date.now()}`,
    title: `مراجعة الفرق بين ${sound1} و ${sound2}`,
    description: `تدريبات للتمييز بين صوت ${soundData1.name} وصوت ${soundData2.name}`,
    targetSound: `${sound1}-${sound2}`,
    level: 'isolation',
    difficulty: 'intermediate',
    questions: selectedQuestions,
    estimatedDuration: `${selectedQuestions.length * 30} ثانية`
  };
};
