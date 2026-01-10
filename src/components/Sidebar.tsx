import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Compass, 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Map, 
  Heart, 
  Anchor,
  Fish,
  Shell
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: "explore", icon: Compass, label: "Explore", group: "DISCOVERY" },
  { id: "community", icon: Users, label: "Community", group: "DISCOVERY" },
  { id: "schedule", icon: Calendar, label: "Schedule", group: "DISCOVERY" },
  { id: "notes", icon: FileText, label: "Notes", group: "DISCOVERY" },
  { id: "chat", icon: MessageSquare, label: "Chat", group: "DISCOVERY" },
];

const guideItems = [
  { id: "map", icon: Map, label: "Ocean Map", group: "GUIDE" },
  { id: "creatures", icon: Fish, label: "Creatures", group: "GUIDE" },
  { id: "favorites", icon: Heart, label: "Favorites", group: "GUIDE" },
];

const resourceItems = [
  { id: "anchor", icon: Anchor, label: "Deep Dive", group: "RESOURCE" },
  { id: "shells", icon: Shell, label: "Collection", group: "RESOURCE" },
];

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <motion.div 
        className="mb-8"
        whileHover={{ scale: 1.1, rotate: 10 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <div className="w-10 h-10 rounded-xl bg-yellow flex items-center justify-center shadow-lg">
          <Shell className="w-6 h-6 text-yellow-foreground" />
        </div>
      </motion.div>

      {/* Discovery Section */}
      <div className="flex flex-col items-center gap-1 mb-6">
        <span className="text-[10px] text-muted-foreground font-semibold tracking-wider mb-2">DISCOVERY</span>
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

      {/* Guide Section */}
      <div className="flex flex-col items-center gap-1 mb-6">
        <span className="text-[10px] text-muted-foreground font-semibold tracking-wider mb-2">GUIDE</span>
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

      {/* Resource Section */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-muted-foreground font-semibold tracking-wider mb-2">RESOURCE</span>
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
      <div className="absolute left-14 px-3 py-1.5 bg-card rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-card z-50">
        {label}
      </div>
    </motion.button>
  );
};

export default Sidebar;
