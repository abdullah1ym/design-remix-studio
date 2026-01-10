import { motion } from "framer-motion";
import { Map } from "lucide-react";
import ProgressMap from "../ProgressMap";
import { useState } from "react";

const SkillMapView = () => {
  const [mapOpen, setMapOpen] = useState(true);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">خريطة المهارات</h1>
        <p className="text-muted-foreground">تابع تقدمك في مسار التدريب السمعي</p>
      </motion.div>

      <motion.div
        className="bg-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Map className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold">مسار التعلم</h2>
            <p className="text-sm text-muted-foreground">اضغط على الزر لعرض الخريطة الكاملة</p>
          </div>
        </div>

        <motion.button
          className="w-full py-4 bg-gradient-to-br from-primary/20 to-turquoise/20 rounded-xl font-semibold hover:from-primary/30 hover:to-turquoise/30 transition-all"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setMapOpen(true)}
        >
          <div className="flex items-center justify-center gap-2">
            <Map className="w-5 h-5" />
            عرض خريطة المهارات
          </div>
        </motion.button>
      </motion.div>

      <ProgressMap open={mapOpen} onOpenChange={setMapOpen} />
    </div>
  );
};

export default SkillMapView;
