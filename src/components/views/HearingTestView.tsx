import { motion } from "framer-motion";
import { Ear, Volume2, Play, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";

const HearingTestView = () => {
  const [testStarted, setTestStarted] = useState(false);
  const [lastTestDate] = useState("منذ أسبوع");

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">اختبار السمع</h1>
        <p className="text-muted-foreground">تقييم سريع لقدراتك السمعية الحالية</p>
      </motion.div>

      {/* Last Test Info */}
      <motion.div
        className="bg-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-turquoise flex items-center justify-center">
            <Ear className="w-7 h-7 text-turquoise-foreground" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">آخر اختبار</p>
            <p className="font-bold text-lg">{lastTestDate}</p>
          </div>
        </div>
      </motion.div>

      {/* Test Description */}
      <motion.div
        className="bg-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold mb-4">عن الاختبار</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            هذا الاختبار يساعدك على تقييم قدراتك السمعية الحالية ومتابعة تقدمك مع الوقت.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-mint" />
              <span>يستغرق حوالي ٥ دقائق</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-mint" />
              <span>يتضمن أصوات بترددات مختلفة</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-mint" />
              <span>يقدم نتائج فورية</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        className="bg-yellow/10 border border-yellow/30 rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow mt-0.5" />
          <div>
            <h3 className="font-bold mb-2">قبل البدء</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• تأكد من أنك في مكان هادئ</li>
              <li>• استخدم سماعات الرأس إن أمكن</li>
              <li>• اضبط مستوى الصوت على مستوى مريح</li>
              <li>• تأكد من أن جهاز زراعة القوقعة يعمل بشكل صحيح</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Start Test Button */}
      <motion.div
        className="bg-gradient-to-br from-primary/20 to-turquoise/20 rounded-2xl p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
          <Volume2 className="w-10 h-10 text-primary" />
        </div>

        <h3 className="text-xl font-bold mb-2">جاهز للاختبار؟</h3>
        <p className="text-muted-foreground mb-6">
          اضغط على الزر أدناه لبدء اختبار السمع
        </p>

        <motion.button
          className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold mx-auto hover:brightness-110 transition-all shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setTestStarted(true)}
        >
          <Play className="w-5 h-5 fill-current" />
          ابدأ الاختبار
        </motion.button>
      </motion.div>

      {/* Previous Results */}
      <motion.div
        className="bg-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-4">النتائج السابقة</h2>
        <div className="space-y-3">
          {[
            { date: "منذ أسبوع", score: "٨٥٪" },
            { date: "منذ أسبوعين", score: "٨٢٪" },
            { date: "منذ شهر", score: "٧٨٪" },
          ].map((result, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-xl"
            >
              <span className="text-muted-foreground">{result.date}</span>
              <span className="font-bold text-turquoise">{result.score}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HearingTestView;
