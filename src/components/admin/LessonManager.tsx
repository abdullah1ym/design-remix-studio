import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, X, BookOpen } from "lucide-react";
import { useLessons, Lesson } from "@/contexts/LessonsContext";

const LessonManager = () => {
  const { lessons, addLesson, updateLesson, deleteLesson } = useLessons();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const [form, setForm] = useState<Omit<Lesson, "id">>({
    title: "",
    description: "",
    duration: "١٠ دقائق",
    progress: 0,
    completed: false,
  });

  const handleEdit = (lesson: Lesson) => {
    setEditingId(lesson.id);
    setIsAdding(false);
    setForm({
      title: lesson.title,
      description: lesson.description,
      duration: lesson.duration,
      progress: lesson.progress,
      completed: lesson.completed,
    });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      duration: "١٠ دقائق",
      progress: 0,
      completed: false,
    });
  };

  const handleSave = () => {
    if (!form.title.trim()) return;

    if (isAdding) {
      addLesson(form);
    } else if (editingId) {
      updateLesson(editingId, form);
    }
    setEditingId(null);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  const handleDelete = (id: number) => {
    deleteLesson(id);
    setConfirmDelete(null);
    if (editingId === id) {
      setEditingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* List */}
      <div className="bg-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">الدروس</h2>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            إضافة درس
          </button>
        </div>

        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                editingId === lesson.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  lesson.completed ? "bg-mint" : lesson.progress > 0 ? "bg-yellow" : "bg-muted"
                }`}>
                  <BookOpen className={`w-5 h-5 ${
                    lesson.completed ? "text-mint-foreground" : lesson.progress > 0 ? "text-yellow-foreground" : "text-muted-foreground"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{lesson.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{lesson.duration}</span>
                    {lesson.completed ? (
                      <span className="text-mint">مكتمل</span>
                    ) : lesson.progress > 0 ? (
                      <span className="text-yellow">{lesson.progress}%</span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 mr-2">
                <button
                  onClick={() => handleEdit(lesson)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {confirmDelete === lesson.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(lesson.id)}
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
                    onClick={() => setConfirmDelete(lesson.id)}
                    className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}

          {lessons.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">لا توجد دروس</p>
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="bg-card rounded-2xl p-6">
        {editingId || isAdding ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {isAdding ? "إضافة درس جديد" : "تحرير الدرس"}
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
                  placeholder="عنوان الدرس"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الوصف</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  rows={3}
                  placeholder="وصف الدرس"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">المدة</label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) => setForm(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-4 py-2 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="مثال: ١٠ دقائق"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">نسبة الإكمال ({form.progress}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={form.progress}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    progress: parseInt(e.target.value),
                    completed: parseInt(e.target.value) === 100,
                  }))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="completed"
                  checked={form.completed}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    completed: e.target.checked,
                    progress: e.target.checked ? 100 : prev.progress,
                  }))}
                  className="w-4 h-4 accent-primary"
                />
                <label htmlFor="completed" className="text-sm font-medium">مكتمل</label>
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
            <h3 className="text-lg font-bold mb-2">اختر درساً للتحرير</h3>
            <p className="text-sm text-muted-foreground mb-4">
              أو اضغط على "إضافة درس" لإنشاء درس جديد
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonManager;
