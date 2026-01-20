import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, X } from "lucide-react";
import { useExercises, Exercise, Question } from "@/contexts/ExercisesContext";
import QuestionEditor from "./QuestionEditor";

const categories = [
  { id: "similar-sounds", label: "تمييز الأصوات المتشابهة" },
  { id: "words", label: "الكلمات والمقاطع" },
  { id: "sentences", label: "الجمل والحوارات" },
  { id: "tones", label: "تمييز النغمات" },
];

const difficulties = [
  { id: "beginner", label: "مبتدئ" },
  { id: "intermediate", label: "متوسط" },
  { id: "advanced", label: "متقدم" },
];

const types = [
  { id: "tone", label: "نغمات" },
  { id: "word", label: "كلمات" },
  { id: "sentence", label: "جمل" },
  { id: "environment", label: "بيئة" },
];

const ExerciseManager = () => {
  const { exercises, addExercise, updateExercise, deleteExercise, resetToDefaults } = useExercises();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("similar-sounds");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const [form, setForm] = useState<Omit<Exercise, "id">>({
    title: "",
    description: "",
    category: "similar-sounds",
    difficulty: "beginner",
    type: "tone",
    duration: "٥ دقائق",
    questions: [],
  });

  const handleEdit = (exercise: Exercise) => {
    setEditingId(exercise.id);
    setIsAdding(false);
    setForm({
      title: exercise.title,
      description: exercise.description,
      category: exercise.category,
      difficulty: exercise.difficulty,
      type: exercise.type,
      duration: exercise.duration,
      questions: [...exercise.questions],
    });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      category: "similar-sounds",
      difficulty: "beginner",
      type: "tone",
      duration: "٥ دقائق",
      questions: [],
    });
  };

  const handleSave = () => {
    if (!form.title.trim()) return;

    if (isAdding) {
      addExercise(form);
    } else if (editingId) {
      updateExercise(editingId, form);
    }
    setEditingId(null);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    deleteExercise(id);
    setConfirmDelete(null);
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `q${form.questions.length + 1}`,
      prompt: "",
      audioPlaceholder: "",
      options: ["", ""],
      correctAnswer: 0,
    };
    setForm(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }));
  };

  const handleUpdateQuestion = (index: number, question: Question) => {
    const newQuestions = [...form.questions];
    newQuestions[index] = question;
    setForm(prev => ({ ...prev, questions: newQuestions }));
  };

  const handleDeleteQuestion = (index: number) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const groupedExercises = categories.map(cat => ({
    ...cat,
    exercises: exercises.filter(e => e.category === cat.id),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* List */}
      <div className="bg-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">التمارين</h2>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            إضافة تمرين
          </button>
        </div>

        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {groupedExercises.map((category) => (
            <div key={category.id} className="border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{category.label}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {category.exercises.length}
                  </span>
                </div>
                {expandedCategory === category.id ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {expandedCategory === category.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-2 pt-0 space-y-1">
                      {category.exercises.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          لا توجد تمارين في هذه الفئة
                        </p>
                      ) : (
                        category.exercises.map((exercise) => (
                          <div
                            key={exercise.id}
                            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                              editingId === exercise.id ? "bg-primary/10" : "hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{exercise.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {exercise.questions.length} أسئلة • {exercise.duration}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 mr-2">
                              <button
                                onClick={() => handleEdit(exercise)}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              {confirmDelete === exercise.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleDelete(exercise.id)}
                                    className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg"
                                  >
                                    تأكيد
                                  </button>
                                  <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="px-2 py-1 bg-muted text-xs rounded-lg"
                                  >
                                    إلغاء
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setConfirmDelete(exercise.id)}
                                  className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="bg-card rounded-2xl p-6">
        {editingId || isAdding ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {isAdding ? "إضافة تمرين جديد" : "تحرير التمرين"}
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">العنوان</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="عنوان التمرين"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الوصف</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  rows={2}
                  placeholder="وصف التمرين"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الفئة</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">الصعوبة</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) => setForm(prev => ({ ...prev, difficulty: e.target.value as Exercise["difficulty"] }))}
                    className="w-full px-4 py-2 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {difficulties.map((diff) => (
                      <option key={diff.id} value={diff.id}>{diff.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">النوع</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value as Exercise["type"] }))}
                    className="w-full px-4 py-2 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {types.map((type) => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">المدة</label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => setForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-2 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="مثال: ٥ دقائق"
                  />
                </div>
              </div>

              {/* Questions */}
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">الأسئلة ({form.questions.length})</h3>
                  <button
                    onClick={handleAddQuestion}
                    className="flex items-center gap-1 px-3 py-1.5 bg-turquoise text-turquoise-foreground rounded-lg text-sm font-medium hover:bg-turquoise/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة سؤال
                  </button>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {form.questions.map((question, index) => (
                    <QuestionEditor
                      key={question.id}
                      question={question}
                      index={index}
                      onUpdate={(q) => handleUpdateQuestion(index, q)}
                      onDelete={() => handleDeleteQuestion(index)}
                    />
                  ))}
                  {form.questions.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      لا توجد أسئلة. اضغط على "إضافة سؤال" لإضافة سؤال جديد.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <button
                onClick={handleSave}
                disabled={!form.title.trim()}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                حفظ
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl font-medium transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Edit2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">اختر تمريناً للتحرير</h3>
            <p className="text-sm text-muted-foreground mb-4">
              أو اضغط على "إضافة تمرين" لإنشاء تمرين جديد
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseManager;
