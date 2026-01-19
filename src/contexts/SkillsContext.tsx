import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface SkillNode {
  id: number;
  title: string;
  status: "completed" | "current" | "available" | "locked";
  x: number;
  y: number;
  iconName: string;
  color: string;
  size: "small" | "medium" | "large";
  connections: number[];
}

interface SkillsContextType {
  skills: SkillNode[];
  addSkill: (skill: Omit<SkillNode, "id">) => void;
  updateSkill: (id: number, skill: Partial<SkillNode>) => void;
  deleteSkill: (id: number) => void;
  reorderSkill: (id: number, direction: "up" | "down") => void;
}

const defaultSkills: SkillNode[] = [
  // المستوى التأسيسي - الأصوات الأساسية
  { id: 1, title: "الأصوات الأساسية", status: "completed", x: 50, y: 5, iconName: "Volume2", color: "turquoise", size: "large", connections: [2, 3] },

  // المستوى الأول - حروف الجوف والشفتين (الأسهل)
  { id: 2, title: "الجوف: حروف المد", status: "completed", x: 25, y: 15, iconName: "Wind", color: "turquoise", size: "medium", connections: [4, 5] },
  { id: 3, title: "الشفتان: ف، ب، م، و", status: "completed", x: 75, y: 15, iconName: "Smile", color: "turquoise", size: "medium", connections: [5, 6] },

  // المستوى الثاني - الحلق (3 مناطق)
  { id: 4, title: "أقصى الحلق: ء، هـ", status: "current", x: 15, y: 30, iconName: "CircleDot", color: "yellow", size: "medium", connections: [7] },
  { id: 5, title: "وسط الحلق: ع، ح", status: "available", x: 50, y: 30, iconName: "Circle", color: "muted", size: "large", connections: [7, 8] },
  { id: 6, title: "أدنى الحلق: غ، خ", status: "available", x: 85, y: 30, iconName: "CircleDotDashed", color: "muted", size: "medium", connections: [8] },

  // المستوى الثالث - اللسان (عدة مناطق)
  { id: 7, title: "أقصى اللسان: ق، ك", status: "locked", x: 20, y: 45, iconName: "Languages", color: "muted", size: "medium", connections: [10, 11] },
  { id: 8, title: "وسط اللسان: ج، ش، ي", status: "locked", x: 50, y: 45, iconName: "Mic", color: "muted", size: "medium", connections: [11, 12] },
  { id: 9, title: "طرف اللسان: ت، د، ط", status: "locked", x: 80, y: 45, iconName: "Type", color: "muted", size: "medium", connections: [12] },

  // المستوى الرابع - حروف متقدمة
  { id: 10, title: "حروف الصفير: ص، س، ز", status: "locked", x: 15, y: 60, iconName: "Waves", color: "muted", size: "medium", connections: [13] },
  { id: 11, title: "حروف اللثة: ث، ذ، ظ", status: "locked", x: 50, y: 60, iconName: "Ear", color: "muted", size: "medium", connections: [13, 14] },
  { id: 12, title: "الضاد والأصوات الخاصة", status: "locked", x: 85, y: 60, iconName: "Star", color: "muted", size: "medium", connections: [14] },

  // المستوى الخامس - الأزواج الدنيا وتمارين CI
  { id: 13, title: "الأزواج الدنيا", status: "locked", x: 30, y: 75, iconName: "GitCompare", color: "muted", size: "medium", connections: [15] },
  { id: 14, title: "المجهور والمهموس", status: "locked", x: 70, y: 75, iconName: "AudioWaveform", color: "muted", size: "medium", connections: [15] },

  // المستوى السادس - التكامل
  { id: 15, title: "الكلمات والجمل", status: "locked", x: 50, y: 85, iconName: "MessageSquare", color: "muted", size: "large", connections: [16] },

  // الإتقان
  { id: 16, title: "الإتقان", status: "locked", x: 50, y: 95, iconName: "Award", color: "jellyfish", size: "large", connections: [] },
];

const STORAGE_KEY = "deepdive-skills-v4";

const SkillsContext = createContext<SkillsContextType | undefined>(undefined);

export const SkillsProvider = ({ children }: { children: ReactNode }) => {
  const [skills, setSkills] = useState<SkillNode[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultSkills;
      }
    }
    return defaultSkills;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
  }, [skills]);

  const addSkill = (skill: Omit<SkillNode, "id">) => {
    const newId = Math.max(...skills.map(s => s.id), 0) + 1;
    setSkills(prev => [...prev, { ...skill, id: newId }]);
  };

  const updateSkill = (id: number, updates: Partial<SkillNode>) => {
    setSkills(prev => prev.map(skill =>
      skill.id === id ? { ...skill, ...updates } : skill
    ));
  };

  const deleteSkill = (id: number) => {
    setSkills(prev => {
      // Remove the skill and remove it from all connections
      return prev
        .filter(skill => skill.id !== id)
        .map(skill => ({
          ...skill,
          connections: skill.connections.filter(connId => connId !== id)
        }));
    });
  };

  const reorderSkill = (id: number, direction: "up" | "down") => {
    setSkills(prev => {
      const index = prev.findIndex(s => s.id === id);
      if (index === -1) return prev;
      if (direction === "up" && index === 0) return prev;
      if (direction === "down" && index === prev.length - 1) return prev;

      const newSkills = [...prev];
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      [newSkills[index], newSkills[swapIndex]] = [newSkills[swapIndex], newSkills[index]];
      return newSkills;
    });
  };

  return (
    <SkillsContext.Provider value={{ skills, addSkill, updateSkill, deleteSkill, reorderSkill }}>
      {children}
    </SkillsContext.Provider>
  );
};

export const useSkills = () => {
  const context = useContext(SkillsContext);
  if (!context) {
    throw new Error("useSkills must be used within a SkillsProvider");
  }
  return context;
};
