import { useState, useRef } from "react";
import { Download, Upload, RotateCcw, Check, AlertCircle } from "lucide-react";
import { useExercises } from "@/contexts/ExercisesContext";
import { useLessons } from "@/contexts/LessonsContext";
import { useSkills } from "@/contexts/SkillsContext";

const DataExport = () => {
  const { exercises, resetToDefaults: resetExercises } = useExercises();
  const { lessons, resetToDefaults: resetLessons } = useLessons();
  const { skills } = useSkills();

  const [showDropdown, setShowDropdown] = useState(false);
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");
  const [confirmReset, setConfirmReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = {
      version: 1,
      exportDate: new Date().toISOString(),
      exercises,
      lessons,
      skills,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deepdive-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowDropdown(false);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);

        // Validate the data structure
        if (!data.exercises || !data.lessons || !data.skills) {
          throw new Error("Invalid backup file structure");
        }

        // Import to localStorage (use correct versioned keys)
        localStorage.setItem("deepdive-exercises-v11", JSON.stringify(data.exercises));
        localStorage.setItem("deepdive-lessons-v2", JSON.stringify(data.lessons));
        localStorage.setItem("deepdive-skills", JSON.stringify(data.skills));

        setImportStatus("success");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error("Import error:", error);
        setImportStatus("error");
        setTimeout(() => setImportStatus("idle"), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleResetAll = () => {
    localStorage.removeItem("deepdive-exercises-v11");
    localStorage.removeItem("deepdive-lessons-v2");
    localStorage.removeItem("deepdive-skills");
    window.location.reload();
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center gap-2">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-turquoise text-turquoise-foreground rounded-xl text-sm font-medium hover:bg-turquoise/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          تصدير
        </button>

        <button
          onClick={handleImport}
          className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl text-sm font-medium transition-colors"
        >
          {importStatus === "success" ? (
            <>
              <Check className="w-4 h-4 text-mint" />
              تم الاستيراد
            </>
          ) : importStatus === "error" ? (
            <>
              <AlertCircle className="w-4 h-4 text-red-500" />
              خطأ
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              استيراد
            </>
          )}
        </button>

        {confirmReset ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetAll}
              className="px-3 py-2 bg-red-500 text-white text-sm rounded-xl"
            >
              تأكيد الإعادة
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="px-3 py-2 bg-muted text-sm rounded-xl"
            >
              إلغاء
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-red-500/10 hover:text-red-500 rounded-xl text-sm font-medium transition-colors"
            title="إعادة تعيين الكل"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DataExport;
