import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Clock, Target, Award } from "lucide-react";

const ProgressView = () => {
  const stats = [
    { label: "التمارين المكتملة", value: "١٢", icon: Target, color: "text-turquoise" },
    { label: "الوقت الكلي", value: "٤٥ د", icon: Clock, color: "text-yellow" },
    { label: "نسبة النجاح", value: "٨٥٪", icon: TrendingUp, color: "text-mint" },
    { label: "الإنجازات", value: "٣", icon: Award, color: "text-coral" },
  ];

  const weeklyProgress = [
    { day: "السبت", value: 80 },
    { day: "الأحد", value: 65 },
    { day: "الاثنين", value: 90 },
    { day: "الثلاثاء", value: 45 },
    { day: "الأربعاء", value: 70 },
    { day: "الخميس", value: 85 },
    { day: "الجمعة", value: 60 },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">التقدم</h1>
        <p className="text-muted-foreground">تابع تقدمك في التدريب السمعي</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-card rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
            <p className="text-3xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Weekly Progress */}
      <motion.div
        className="bg-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">التقدم الأسبوعي</h2>
        </div>

        <div className="flex items-end justify-between gap-2 h-48">
          {weeklyProgress.map((day, index) => (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                className="w-full bg-primary/20 rounded-t-lg relative overflow-hidden"
                style={{ height: `${day.value}%` }}
                initial={{ height: 0 }}
                animate={{ height: `${day.value}%` }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-primary opacity-60" />
              </motion.div>
              <span className="text-xs text-muted-foreground">{day.day}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        className="bg-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-xl font-bold mb-4">النشاط الأخير</h2>
        <div className="space-y-3">
          {[
            { title: "التمييز بين النغمات", score: "٩٠٪", time: "منذ ساعة" },
            { title: "الكلمات البسيطة", score: "٧٥٪", time: "منذ ٣ ساعات" },
            { title: "أصوات المنزل", score: "١٠٠٪", time: "أمس" },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-xl"
            >
              <div>
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
              <span className="text-turquoise font-bold">{activity.score}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressView;
