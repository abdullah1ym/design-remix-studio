import { Play, Volume2 } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-row-reverse">
        {/* Content */}
        <div className="flex-1 p-8 z-10">
          <motion.span
            className="inline-block px-3 py-1 bg-yellow text-yellow-foreground rounded-full text-xs font-semibold mb-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            ابدأ من هنا
          </motion.span>

          <motion.h1
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            مقدمة في التدريب السمعي
          </motion.h1>

          <motion.p
            className="text-muted-foreground mb-4 max-w-md leading-relaxed"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            هذا التمرين يقدم لك نظرة عامة على برنامج التدريب السمعي لمستخدمي زراعة القوقعة. نبدأ بالأساسيات ونتدرج للمستويات المتقدمة.
          </motion.p>

          <motion.div
            className="flex items-center gap-2 text-sm text-muted-foreground mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span>٥ دقائق</span>
            <span>•</span>
            <span>تمهيدي</span>
            <span>•</span>
            <span>نظرة عامة</span>
          </motion.div>

          {/* Tags */}
          <motion.div
            className="flex items-center gap-2 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="px-3 py-1 bg-turquoise text-turquoise-foreground rounded-full text-xs font-semibold">
              المستوى الأول
            </span>
            <span className="px-3 py-1 bg-coral text-coral-foreground rounded-full text-xs font-semibold">
              أساسيات السمع
            </span>
            <span className="px-3 py-1 bg-muted text-foreground rounded-full text-xs font-semibold">
              ١ من ٤
            </span>
          </motion.div>

          {/* Start Button */}
          <motion.button
            className="flex items-center gap-3 px-6 py-3 bg-yellow text-yellow-foreground rounded-xl font-semibold hover:brightness-110 transition-all shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Play className="w-5 h-5 fill-current" />
            ابدأ التمرين
          </motion.button>
        </div>

        {/* Audio Preview */}
        <motion.div
          className="relative w-[400px] h-[320px]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-secondary/80 z-10" />
          <div className="w-full h-full bg-gradient-to-br from-primary/40 to-turquoise/30 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                className="w-20 h-20 mx-auto mb-4 rounded-full gradient-turquoise flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Volume2 className="w-8 h-8 text-turquoise-foreground" />
              </motion.div>
              <p className="text-sm text-muted-foreground">معاينة صوتية</p>
            </div>
          </div>

          {/* Decorative sound waves */}
          <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-foreground/20 animate-float" />
          <div className="absolute top-12 left-12 w-2 h-2 rounded-full bg-foreground/15 animate-float" style={{ animationDelay: "0.5s" }} />
          <div className="absolute bottom-8 left-8 w-4 h-4 rounded-full bg-foreground/10 animate-float" style={{ animationDelay: "1s" }} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
