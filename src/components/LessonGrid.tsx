import { motion } from "framer-motion";
import { Play, Info } from "lucide-react";
import LessonCard from "./LessonCard";

interface LessonGridProps {
  category: string;
}

const LessonGrid = ({ category }: LessonGridProps) => {
  return (
    <div className="space-y-6">
      {/* Category Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div>
          <h2 className="text-2xl font-bold capitalize">{category.replace("-", " ")}</h2>
          <p className="text-sm text-muted-foreground">2/17 PATH COMPLETED</p>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button 
            className="flex items-center gap-2 px-4 py-2.5 bg-card rounded-xl text-sm font-semibold hover:bg-muted transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Info className="w-4 h-4" />
            View module info
          </motion.button>
          
          <motion.button 
            className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-4 h-4 fill-current" />
            Start lessons
          </motion.button>
        </div>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Primary Card */}
        <LessonCard
          title="Complete the Coral Reef Starting Path to unlock all paths"
          description="Starting paths help you understand the basis of each module topic. Core Knowledge Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          isPrimary
          gradient="gradient-turquoise"
          index={0}
        />

        {/* Secondary Card with visual */}
        <LessonCard
          title="Coral Reef Starting Path."
          subtitle="Coral Reefs"
          videoCount={4}
          gradient="gradient-coral"
          index={1}
        />

        {/* Locked Cards */}
        <LessonCard
          title="What is a coral reef? Where does it come from?"
          tag="Science of Reefs"
          lessonCount={5}
          isLocked
          gradient="bg-card"
          index={2}
        />

        <LessonCard
          title="What are the most common marine species?"
          tag="Marine Biology"
          lessonCount={5}
          isLocked
          gradient="bg-card"
          index={3}
        />
      </div>
    </div>
  );
};

export default LessonGrid;
