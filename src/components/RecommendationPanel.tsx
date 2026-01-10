import { Sparkles, Map } from "lucide-react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import ProgressMap from "./ProgressMap";

const RecommendationPanel = () => {
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <>
      <motion.div
        className="bg-card rounded-2xl p-6 relative overflow-hidden"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Decorative icon */}
        <motion.div
          className="absolute -top-2 -left-2"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="w-16 h-16 bg-yellow rounded-2xl flex items-center justify-center -rotate-12 shadow-lg">
            <Sparkles className="w-8 h-8 text-yellow-foreground" />
          </div>
        </motion.div>

        {/* Content */}
        <div className="pl-12">
          <h3 className="text-lg font-bold mb-2">
            بناءً على مستواك، ننصحك بالبدء بتمارين الأصوات الأساسية.
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            في هذه الوحدة ستتعلم <span className="text-coral font-semibold">تمييز النغمات</span> والأصوات الأساسية للتدريب السمعي.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-between py-4 border-t border-border">
          <div>
            <p className="font-semibold text-sm">تفعيل دليل التدريب</p>
            <p className="text-xs text-muted-foreground">يعرض النصائح ومتتبع التقدم</p>
          </div>
          <Switch defaultChecked className="data-[state=checked]:bg-turquoise" />
        </div>

        {/* Map Section */}
        <div className="mt-4">
          <h4 className="font-semibold mb-2">تابع تقدمك في خريطة المهارات</h4>
          <p className="text-xs text-muted-foreground mb-4">
            الخريطة متزامنة مع تقدمك في التمارين.
          </p>

          <motion.div
            className="relative h-24 rounded-xl overflow-hidden bg-gradient-to-l from-primary/30 via-turquoise/20 to-jellyfish/30 flex items-center justify-center cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            onClick={() => setMapOpen(true)}
          >
            {/* Decorative dots */}
            <div className="absolute inset-0 flex items-center justify-around px-4">
              <div className="w-3 h-3 rounded-full bg-coral" />
              <div className="w-2 h-2 rounded-full bg-yellow" />
              <div className="w-3 h-3 rounded-full bg-turquoise" />
              <div className="w-2 h-2 rounded-full bg-mint" />
              <div className="w-3 h-3 rounded-full bg-jellyfish" />
            </div>

            {/* Connecting line */}
            <svg className="absolute inset-0 w-full h-full">
              <path
                d="M 30 48 Q 100 30, 170 48 T 310 48 T 450 48"
                stroke="white"
                strokeOpacity="0.3"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
              />
            </svg>

            <button className="flex items-center gap-2 px-4 py-2 bg-foreground/10 backdrop-blur-sm rounded-full text-sm font-semibold group-hover:bg-foreground/20 transition-colors z-10">
              <Map className="w-4 h-4" />
              عرض الخريطة
            </button>
          </motion.div>
        </div>
      </motion.div>

      <ProgressMap open={mapOpen} onOpenChange={setMapOpen} />
    </>
  );
};

export default RecommendationPanel;
