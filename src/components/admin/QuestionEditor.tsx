import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Trash2, Plus, X, Check } from "lucide-react";
import { Question } from "@/contexts/ExercisesContext";

interface QuestionEditorProps {
  question: Question;
  index: number;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
}

const QuestionEditor = ({ question, index, onUpdate, onDelete }: QuestionEditorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleAddOption = () => {
    if (question.options.length >= 6) return;
    onUpdate({
      ...question,
      options: [...question.options, ""],
    });
  };

  const handleRemoveOption = (optionIndex: number) => {
    if (question.options.length <= 2) return;
    const newOptions = question.options.filter((_, i) => i !== optionIndex);
    let newCorrectAnswer = question.correctAnswer;
    if (optionIndex === question.correctAnswer) {
      newCorrectAnswer = 0;
    } else if (optionIndex < question.correctAnswer) {
      newCorrectAnswer = question.correctAnswer - 1;
    }
    onUpdate({
      ...question,
      options: newOptions,
      correctAnswer: newCorrectAnswer,
    });
  };

  const handleOptionChange = (optionIndex: number, value: string) => {
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    onUpdate({
      ...question,
      options: newOptions,
    });
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <span className="text-sm font-medium truncate max-w-[200px]">
            {question.prompt || "سؤال جديد"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {question.options.length} خيارات
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">نص السؤال</label>
                <input
                  type="text"
                  value={question.prompt}
                  onChange={(e) => onUpdate({ ...question, prompt: e.target.value })}
                  className="w-full px-3 py-2 bg-muted rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="مثال: استمع للنغمة التالية:"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">وصف الصوت (للتطوير)</label>
                <input
                  type="text"
                  value={question.audioPlaceholder}
                  onChange={(e) => onUpdate({ ...question, audioPlaceholder: e.target.value })}
                  className="w-full px-3 py-2 bg-muted rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="مثال: نغمة عالية (1000 Hz)"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-muted-foreground">الخيارات</label>
                  <button
                    onClick={handleAddOption}
                    disabled={question.options.length >= 6}
                    className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3 h-3" />
                    إضافة خيار
                  </button>
                </div>

                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdate({ ...question, correctAnswer: optionIndex })}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          question.correctAnswer === optionIndex
                            ? "border-turquoise bg-turquoise text-turquoise-foreground"
                            : "border-muted-foreground/30 hover:border-muted-foreground"
                        }`}
                      >
                        {question.correctAnswer === optionIndex && <Check className="w-3 h-3" />}
                      </button>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-muted rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder={`الخيار ${optionIndex + 1}`}
                      />
                      {question.options.length > 2 && (
                        <button
                          onClick={() => handleRemoveOption(optionIndex)}
                          className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  اضغط على الدائرة لتحديد الإجابة الصحيحة
                </p>
              </div>

              <div className="pt-2 border-t border-border">
                {confirmDelete ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-red-500">حذف هذا السؤال؟</span>
                    <button
                      onClick={onDelete}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg"
                    >
                      تأكيد
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="px-3 py-1 bg-muted text-sm rounded-lg"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    حذف السؤال
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestionEditor;
