import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Edit2, ChevronUp, ChevronDown, Save, RotateCcw } from "lucide-react";
import { useSkills, SkillNode } from "@/contexts/SkillsContext";

interface AdminPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const iconOptions = ["Anchor", "Fish", "Waves", "Shell", "Zap", "Star", "Compass", "Globe"];
const statusOptions: SkillNode["status"][] = ["completed", "current", "available", "locked"];
const sizeOptions: SkillNode["size"][] = ["small", "medium", "large"];
const colorOptions = ["turquoise", "yellow", "muted", "jellyfish", "coral"];

const emptySkill: Omit<SkillNode, "id"> = {
  title: "",
  status: "locked",
  x: 50,
  y: 50,
  iconName: "Star",
  color: "muted",
  size: "medium",
  connections: [],
};

const AdminPanel = ({ open, onOpenChange }: AdminPanelProps) => {
  const { skills, addSkill, updateSkill, deleteSkill } = useSkills();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<SkillNode, "id">>(emptySkill);
  const [isAdding, setIsAdding] = useState(false);
  const [connectionInput, setConnectionInput] = useState("");

  const handleEdit = (skill: SkillNode) => {
    setEditingId(skill.id);
    setFormData({
      title: skill.title,
      status: skill.status,
      x: skill.x,
      y: skill.y,
      iconName: skill.iconName,
      color: skill.color,
      size: skill.size,
      connections: skill.connections,
    });
    setConnectionInput(skill.connections.join(", "));
    setIsAdding(false);
  };

  const handleSave = () => {
    const connections = connectionInput
      .split(",")
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n) && n > 0);

    if (editingId !== null) {
      updateSkill(editingId, { ...formData, connections });
      setEditingId(null);
    } else if (isAdding) {
      addSkill({ ...formData, connections });
      setIsAdding(false);
    }
    setFormData(emptySkill);
    setConnectionInput("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData(emptySkill);
    setConnectionInput("");
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData(emptySkill);
    setConnectionInput("");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      deleteSkill(id);
      if (editingId === id) {
        handleCancel();
      }
    }
  };

  const resetToDefaults = () => {
    if (confirm("Reset all skills to default? This will remove any custom skills.")) {
      localStorage.removeItem("design-remix-skills");
      window.location.reload();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Manage Skills</h1>
                <p className="text-sm text-muted-foreground">Add, edit, or remove skills from the skill tree</p>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={resetToDefaults}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </motion.button>
                <motion.button
                  onClick={() => onOpenChange(false)}
                  className="p-2 rounded-full bg-card hover:bg-muted transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Skills List */}
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Skills ({skills.length})</h2>
                  <motion.button
                    onClick={handleAddNew}
                    className="flex items-center gap-1 px-3 py-1.5 bg-turquoise text-turquoise-foreground rounded-lg text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Skill
                  </motion.button>
                </div>

                <div className="space-y-2 max-h-[500px] overflow-auto">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        editingId === skill.id
                          ? "bg-turquoise/10 border-turquoise"
                          : "bg-muted/30 border-transparent hover:border-border"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-6">#{skill.id}</span>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            skill.status === "completed" ? "bg-turquoise" :
                            skill.status === "current" ? "bg-yellow" :
                            skill.status === "available" ? "bg-muted" : "bg-muted/40"
                          }`}
                        />
                        <span className="font-medium">{skill.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="p-1.5 hover:bg-background rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="p-1.5 hover:bg-background rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Edit Form */}
              <div className="bg-card rounded-xl p-4 border border-border">
                <h2 className="font-semibold mb-4">
                  {isAdding ? "Add New Skill" : editingId !== null ? `Edit Skill #${editingId}` : "Select a skill to edit"}
                </h2>

                {(isAdding || editingId !== null) ? (
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/50"
                        placeholder="Skill title"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as SkillNode["status"] })}
                        className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/50"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>

                    {/* Position */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">X Position (%)</label>
                        <input
                          type="number"
                          value={formData.x}
                          onChange={(e) => setFormData({ ...formData, x: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/50"
                          min={0}
                          max={100}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Y Position (%)</label>
                        <input
                          type="number"
                          value={formData.y}
                          onChange={(e) => setFormData({ ...formData, y: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/50"
                          min={0}
                          max={100}
                        />
                      </div>
                    </div>

                    {/* Icon & Size */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Icon</label>
                        <select
                          value={formData.iconName}
                          onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                          className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/50"
                        >
                          {iconOptions.map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Size</label>
                        <select
                          value={formData.size}
                          onChange={(e) => setFormData({ ...formData, size: e.target.value as SkillNode["size"] })}
                          className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/50"
                        >
                          {sizeOptions.map(size => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Color */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Color</label>
                      <select
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/50"
                      >
                        {colorOptions.map(color => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>
                    </div>

                    {/* Connections */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Connections (comma-separated IDs)</label>
                      <input
                        type="text"
                        value={connectionInput}
                        onChange={(e) => setConnectionInput(e.target.value)}
                        className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/50"
                        placeholder="e.g., 2, 3, 4"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Enter the IDs of skills this connects to</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <motion.button
                        onClick={handleSave}
                        disabled={!formData.title.trim()}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-turquoise text-turquoise-foreground rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Save className="w-4 h-4" />
                        {isAdding ? "Add Skill" : "Save Changes"}
                      </motion.button>
                      <motion.button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <Edit2 className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">Click edit on a skill or add a new one</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminPanel;
