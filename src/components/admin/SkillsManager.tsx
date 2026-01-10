import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, X, RotateCcw, Award, ChevronUp, ChevronDown } from "lucide-react";
import { useSkills, SkillNode } from "@/contexts/SkillsContext";
import * as LucideIcons from "lucide-react";

const iconOptions = [
  "Volume2", "Music", "Ear", "Type", "MessageCircle",
  "MessageSquare", "Users", "TreePine", "Radio", "Award", "Star"
];

const statusOptions = [
  { id: "completed", label: "مكتمل", color: "bg-turquoise" },
  { id: "current", label: "حالي", color: "bg-yellow" },
  { id: "available", label: "متاح", color: "bg-muted" },
  { id: "locked", label: "مقفل", color: "bg-muted/50" },
];

const colorOptions = ["turquoise", "yellow", "muted", "jellyfish", "coral"];
const sizeOptions = ["small", "medium", "large"];

const SkillsManager = () => {
  const { skills, addSkill, updateSkill, deleteSkill, reorderSkill } = useSkills();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const [form, setForm] = useState<Omit<SkillNode, "id">>({
    title: "",
    status: "locked",
    x: 50,
    y: 50,
    iconName: "Star",
    color: "muted",
    size: "medium",
    connections: [],
  });

  const handleEdit = (skill: SkillNode) => {
    setEditingId(skill.id);
    setIsAdding(false);
    setForm({
      title: skill.title,
      status: skill.status,
      x: skill.x,
      y: skill.y,
      iconName: skill.iconName,
      color: skill.color,
      size: skill.size,
      connections: [...skill.connections],
    });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setForm({
      title: "",
      status: "locked",
      x: 50,
      y: 50,
      iconName: "Star",
      color: "muted",
      size: "medium",
      connections: [],
    });
  };

  const handleSave = () => {
    if (!form.title.trim()) return;

    if (isAdding) {
      addSkill(form);
    } else if (editingId) {
      updateSkill(editingId, form);
    }
    setEditingId(null);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  const handleDelete = (id: number) => {
    deleteSkill(id);
    setConfirmDelete(null);
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const handleReset = () => {
    localStorage.removeItem("deepdive-skills");
    window.location.reload();
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find(s => s.id === status)?.color || "bg-muted";
  };

  const renderIcon = (iconName: string, className?: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className={className} /> : null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* List */}
      <div className="bg-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">المهارات</h2>
          <div className="flex items-center gap-2">
            {confirmReset ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg"
                >
                  تأكيد الإعادة
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 bg-muted text-sm rounded-lg"
                >
                  إلغاء
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="إعادة تعيين"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              إضافة مهارة
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                editingId === skill.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-8 h-8 rounded-lg ${getStatusColor(skill.status)} flex items-center justify-center`}>
                  {renderIcon(skill.iconName, "w-4 h-4")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">{skill.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {statusOptions.find(s => s.id === skill.status)?.label}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => reorderSkill(skill.id, "up")}
                  disabled={index === 0}
                  className="p-1.5 hover:bg-muted rounded-lg transition-colors disabled:opacity-30"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => reorderSkill(skill.id, "down")}
                  disabled={index === skills.length - 1}
                  className="p-1.5 hover:bg-muted rounded-lg transition-colors disabled:opacity-30"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(skill)}
                  className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {confirmDelete === skill.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg"
                    >
                      حذف
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="px-2 py-1 bg-muted text-xs rounded-lg"
                    >
                      لا
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(skill.id)}
                    className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="bg-card rounded-2xl p-6">
        {editingId || isAdding ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {isAdding ? "إضافة مهارة جديدة" : "تحرير المهارة"}
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
                  placeholder="اسم المهارة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الحالة</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as SkillNode["status"] }))}
                  className="w-full px-4 py-2 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {statusOptions.map((status) => (
                    <option key={status.id} value={status.id}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الموضع X ({form.x}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.x}
                    onChange={(e) => setForm(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                    className="w-full accent-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الموضع Y ({form.y}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.y}
                    onChange={(e) => setForm(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الأيقونة</label>
                <div className="grid grid-cols-6 gap-2">
                  {iconOptions.map((iconName) => (
                    <button
                      key={iconName}
                      onClick={() => setForm(prev => ({ ...prev, iconName }))}
                      className={`p-3 rounded-xl border-2 transition-colors ${
                        form.iconName === iconName
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      {renderIcon(iconName, "w-5 h-5 mx-auto")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">اللون</label>
                  <select
                    value={form.color}
                    onChange={(e) => setForm(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full px-4 py-2 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {colorOptions.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الحجم</label>
                  <select
                    value={form.size}
                    onChange={(e) => setForm(prev => ({ ...prev, size: e.target.value as SkillNode["size"] }))}
                    className="w-full px-4 py-2 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {sizeOptions.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الاتصالات (IDs مفصولة بفواصل)</label>
                <input
                  type="text"
                  value={form.connections.join(", ")}
                  onChange={(e) => {
                    const ids = e.target.value
                      .split(",")
                      .map(s => parseInt(s.trim()))
                      .filter(n => !isNaN(n));
                    setForm(prev => ({ ...prev, connections: ids }));
                  }}
                  className="w-full px-4 py-2 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="مثال: 2, 3, 4"
                />
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
              <Award className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">اختر مهارة للتحرير</h3>
            <p className="text-sm text-muted-foreground mb-4">
              أو اضغط على "إضافة مهارة" لإنشاء مهارة جديدة
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsManager;
