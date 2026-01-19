import { motion } from "framer-motion";
import { Music, Volume2, MessageCircle, Award } from "lucide-react";

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "tones", label: "تمييز النغمات", icon: Music, color: "coral" },
  { id: "words", label: "الكلمات والمقاطع", icon: Volume2, color: "yellow" },
  { id: "sentences", label: "الجمل والحوارات", icon: MessageCircle, color: "turquoise" },
  { id: "advanced", label: "التدريب المتقدم", icon: Award, color: "jellyfish" },
];

const CategoryTabs = ({ activeCategory, onCategoryChange }: CategoryTabsProps) => {
  return (
    <motion.div 
      className="flex items-center gap-3 overflow-x-auto pb-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {categories.map((category, index) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.id;
        
        const gradientClasses: Record<string, string> = {
          coral: "gradient-coral text-coral-foreground",
          yellow: "gradient-yellow text-yellow-foreground",
          turquoise: "gradient-turquoise text-turquoise-foreground",
          jellyfish: "gradient-jellyfish text-jellyfish-foreground",
        };

        const iconBgClasses: Record<string, string> = {
          coral: "bg-coral/20",
          yellow: "bg-yellow/20",
          turquoise: "bg-turquoise/20",
          jellyfish: "bg-jellyfish/20",
        };
        
        return (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
              isActive 
                ? `${gradientClasses[category.color]} shadow-lg` 
                : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isActive ? "bg-foreground/20" : iconBgClasses[category.color]
            }`}>
              <Icon className="w-4 h-4" />
            </div>
            {category.label}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default CategoryTabs;
