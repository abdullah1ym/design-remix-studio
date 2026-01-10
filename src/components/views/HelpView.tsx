import { motion } from "framer-motion";
import { HelpCircle, MessageCircle, BookOpen, Mail, ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "كيف أبدأ التدريب السمعي؟",
    answer: "ابدأ من قسم التمارين واختر الفئة المناسبة لمستواك. ننصح بالبدء من تمارين تمييز النغمات ثم الانتقال للكلمات والجمل."
  },
  {
    question: "كم مرة يجب أن أتدرب؟",
    answer: "ننصح بالتدريب لمدة ١٥-٣٠ دقيقة يومياً للحصول على أفضل النتائج. الاستمرارية أهم من مدة الجلسة الواحدة."
  },
  {
    question: "ماذا أفعل إذا كان التمرين صعباً؟",
    answer: "يمكنك إعادة الاستماع للصوت عدة مرات. إذا استمرت الصعوبة، جرب تمريناً أسهل وارجع لاحقاً."
  },
  {
    question: "هل يمكنني استخدام التطبيق بدون سماعات؟",
    answer: "نعم، لكن ننصح باستخدام سماعات أو مكبرات صوت جيدة للحصول على أفضل تجربة تدريبية."
  },
  {
    question: "كيف أتابع تقدمي؟",
    answer: "اذهب لقسم التقدم من القائمة الجانبية لرؤية إحصائياتك ونسب نجاحك في التمارين المختلفة."
  },
];

const HelpView = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">المساعدة</h1>
        <p className="text-muted-foreground">إجابات على الأسئلة الشائعة</p>
      </motion.div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: BookOpen, label: "دليل الاستخدام", color: "text-primary" },
          { icon: MessageCircle, label: "تواصل معنا", color: "text-turquoise" },
          { icon: Mail, label: "الدعم الفني", color: "text-yellow" },
        ].map((item, index) => (
          <motion.button
            key={item.label}
            className="bg-card rounded-2xl p-6 text-center hover:bg-muted/50 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <item.icon className={`w-8 h-8 ${item.color} mx-auto mb-3`} />
            <p className="font-medium">{item.label}</p>
          </motion.button>
        ))}
      </div>

      {/* FAQs */}
      <motion.div
        className="bg-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">الأسئلة الشائعة</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="border border-border rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-4 flex items-center justify-between text-right hover:bg-muted/30 transition-colors"
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    openFaq === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4"
                >
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contact */}
      <motion.div
        className="bg-gradient-to-br from-primary/20 to-turquoise/20 rounded-2xl p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-xl font-bold mb-2">لم تجد إجابة لسؤالك؟</h3>
        <p className="text-muted-foreground mb-4">تواصل معنا وسنرد عليك في أقرب وقت</p>
        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors">
          تواصل معنا
        </button>
      </motion.div>
    </div>
  );
};

export default HelpView;
