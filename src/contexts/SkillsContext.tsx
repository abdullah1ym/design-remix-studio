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
  { id: 1, title: "الأصوات الأساسية", status: "completed", x: 50, y: 10, iconName: "Volume2", color: "turquoise", size: "large", connections: [2, 3] },
  { id: 2, title: "النغمات العالية والمنخفضة", status: "completed", x: 30, y: 28, iconName: "Music", color: "turquoise", size: "medium", connections: [4, 5] },
  { id: 3, title: "التمييز بين الأصوات", status: "completed", x: 70, y: 28, iconName: "Ear", color: "turquoise", size: "medium", connections: [5, 6] },
  { id: 4, title: "الحروف العربية", status: "current", x: 15, y: 48, iconName: "Type", color: "yellow", size: "medium", connections: [7] },
  { id: 5, title: "الكلمات البسيطة", status: "available", x: 50, y: 48, iconName: "MessageCircle", color: "muted", size: "large", connections: [7, 8, 9] },
  { id: 6, title: "الجمل القصيرة", status: "available", x: 85, y: 48, iconName: "MessageSquare", color: "muted", size: "medium", connections: [9] },
  { id: 7, title: "المحادثات", status: "locked", x: 25, y: 68, iconName: "Users", color: "muted", size: "medium", connections: [10] },
  { id: 8, title: "الأصوات اليومية", status: "locked", x: 50, y: 75, iconName: "TreePine", color: "muted", size: "small", connections: [10] },
  { id: 9, title: "البيئة المعقدة", status: "locked", x: 75, y: 68, iconName: "Radio", color: "muted", size: "medium", connections: [10] },
  { id: 10, title: "الإتقان", status: "locked", x: 50, y: 90, iconName: "Award", color: "jellyfish", size: "large", connections: [] },
];

const STORAGE_KEY = "deepdive-skills-v3";

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
