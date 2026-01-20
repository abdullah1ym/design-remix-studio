import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, Play } from "lucide-react";

const SimilarSoundsGrid = () => {
  const [selectedPair, setSelectedPair] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold">تمييز الأصوات المتشابهة</h2>
        <p className="text-sm text-muted-foreground">تدرب على التمييز بين الأصوات المتقاربة في النطق</p>
      </motion.div>

      {/* Content will be added here */}
      <div className="text-center text-muted-foreground py-12">
        سيتم إضافة المحتوى هنا
      </div>
    </div>
  );
};

export default SimilarSoundsGrid;
