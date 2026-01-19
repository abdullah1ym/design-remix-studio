import { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Headphones,
  BarChart3,
  Settings,
  HelpCircle,
  BookOpen,
  Award,
  Heart,
  Ear,
  Volume2,
  Map
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: "home", icon: Home, label: "الرئيسية", group: "الرئيسية" },
  { id: "exercises", icon: Headphones, label: "التمارين", group: "الرئيسية" },
];

const bottomItems = [
  { id: "progress", icon: BarChart3, label: "التقدم", group: "أخرى" },
  { id: "settings", icon: Settings, label: "الإعدادات", group: "أخرى" },
  { id: "help", icon: HelpCircle, label: "المساعدة", group: "أخرى" },
];

const guideItems = [
  { id: "lessons", icon: BookOpen, label: "الدروس", group: "التعلم" },
  { id: "skillmap", icon: Map, label: "خريطة المهارات", group: "التعلم" },
  { id: "achievements", icon: Award, label: "الإنجازات", group: "التعلم" },
  { id: "favorites", icon: Heart, label: "المفضلة", group: "التعلم" },
];

const resourceItems = [
  { id: "hearing", icon: Ear, label: "اختبار السمع", group: "الموارد" },
  { id: "sounds", icon: Volume2, label: "مكتبة الأصوات", group: "الموارد" },
];

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  return (
    <aside className="fixed right-0 top-0 h-screen w-20 bg-sidebar border-l border-sidebar-border flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <motion.div
        className="mb-8"
        whileHover={{ scale: 1.1, rotate: -10 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <div className="w-10 h-10 rounded-xl bg-yellow flex items-center justify-center shadow-lg">
          <Ear className="w-6 h-6 text-yellow-foreground" />
        </div>
      </motion.div>

      {/* Main Section */}
      <div className="flex flex-col items-center gap-1 mb-6">
        <span className="text-[10px] text-muted-foreground font-semibold tracking-wider mb-2">الرئيسية</span>
        {menuItems.map((item) => (
          <SidebarButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
          />
        ))}
      </div>

      {/* Learning Section */}
      <div className="flex flex-col items-center gap-1 mb-6">
        <span className="text-[10px] text-muted-foreground font-semibold tracking-wider mb-2">التعلم</span>
        {guideItems.map((item) => (
          <SidebarButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
          />
        ))}
      </div>

      {/* Resources Section */}
      <div className="flex flex-col items-center gap-1 mb-6">
        <span className="text-[10px] text-muted-foreground font-semibold tracking-wider mb-2">الموارد</span>
        {resourceItems.map((item) => (
          <SidebarButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
          />
        ))}
      </div>

      {/* Spacer to push bottom items down */}
      <div className="flex-1" />

      {/* Bottom Section - Progress, Settings, Help */}
      <div className="flex flex-col items-center gap-1 mb-4">
        {bottomItems.map((item) => (
          <SidebarButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
          />
        ))}
      </div>
    </aside>
  );
};

interface SidebarButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarButton = ({ icon: Icon, label, isActive, onClick }: SidebarButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group ${
        isActive 
          ? "bg-primary text-primary-foreground shadow-lg" 
          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="w-5 h-5" />
      
      {/* Tooltip */}
      <div className="absolute left-[-120px] px-3 py-1.5 bg-card rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-card z-50">
        {label}
      </div>
    </motion.button>
  );
};

export default Sidebar;
