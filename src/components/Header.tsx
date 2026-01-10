import { Search, Star, MoreVertical, Fish } from "lucide-react";
import { motion } from "framer-motion";

interface HeaderProps {
  onManageGuide?: () => void;
}

const Header = ({ onManageGuide }: HeaderProps) => {
  return (
    <header className="h-16 bg-card/50 backdrop-blur-md border-b border-border flex items-center justify-between px-6">
      {/* Left - Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Fish className="w-4 h-4 text-turquoise" />
        <span className="text-muted-foreground">Guide</span>
        <span className="text-muted-foreground">/</span>
        <span className="font-semibold">Lesson</span>
      </div>

      {/* Center - Search */}
      <motion.div 
        className="flex-1 max-w-md mx-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search a lesson"
            className="w-full h-10 pl-11 pr-4 bg-muted rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </motion.div>

      {/* Right - Actions */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Star className="w-4 h-4" />
          <span>Your favorite lessons</span>
        </button>
        
        <button
          onClick={onManageGuide}
          className="px-4 py-2 bg-turquoise text-turquoise-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Manage Guide
        </button>
        
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <motion.div 
          className="w-9 h-9 rounded-full gradient-coral flex items-center justify-center text-sm font-bold cursor-pointer"
          whileHover={{ scale: 1.1 }}
        >
          M
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
