'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Faq() {
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: 'Apakah semua course di MentorIT berbayar?',
      answer: 'Benar semua course di MentorIT berbayar karena course yang dihadirkan pun tidak kaleng-kaleng dan mempunyai mentor yang hebat. Jadi, semua kelas di MentorIT berbayar dan sangat worth it untuk diikuti.',
    },
    {
      id: 2,
      question: 'Bagaimana cara mendaftar course di MentorIT?',
      answer: 'Untuk mendaftar course di MentorIT, kamu bisa langsung klik tombol "Daftar Course" pada halaman utama, pilih course yang diinginkan, lakukan pembayaran, dan langsung bisa mengakses materi pembelajaran.',
    },
    {
      id: 3,
      question: 'Berapa lama durasi course di MentorIT?',
      answer: 'Durasi course bervariasi tergantung jenis course yang dipilih. Course basic biasanya 4-6 minggu, intermediate 8-10 minggu, dan advanced 12-16 minggu. Semua dilengkapi dengan project praktis.',
    },
    {
      id: 4,
      question: 'Apakah ada sertifikat setelah menyelesaikan course?',
      answer: 'Ya, setiap peserta yang menyelesaikan course akan mendapatkan sertifikat digital yang bisa digunakan untuk portfolio dan CV. Sertifikat akan diberikan setelah menyelesaikan semua tugas dan project akhir.',
    },
    {
      id: 5,
      question: 'Bagaimana sistem mentoring di MentorIT?',
      answer: 'Sistem mentoring di MentorIT sangat personal. Setiap peserta akan mendapat mentor dedicated yang akan membantu sepanjang pembelajaran, memberikan feedback untuk project, dan career guidance.',
    },
  ];

  const toggleFaq = (faqId: number) => {
    setOpenFaqId(openFaqId === faqId ? null : faqId);
  };

  return (
    <section className="py-16 pb-64" style={{ backgroundColor: '#f5f4fe' }}>
      <div className="container mx-auto px-6 sm:px-8 lg:px-16">
        {/* Horizontal Layout - Typography Left, FAQ Cards Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Side - Typography */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:sticky lg:top-8"
          >
            <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm border border-[var(--color-primary)] rounded-full text-sm font-medium mb-4">
              <span className="text-[var(--color-primary)]">#Faq</span>
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-dark-primary)] mb-4">
              FAQ
            </h2>
            <p className="text-lg text-[var(--color-text-dark-secondary)]">
              Bergabung dengan course untuk ciptakan portofolio yang berdampak
            </p>
          </motion.div>

          {/* Right Side - FAQ Items */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-0"
          >
            {faqs.map((faq, index) => (
              <motion.div 
                key={faq.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
                viewport={{ once: true, margin: "-50px" }}
                className="border-b border-gray-200 last:border-b-0"
              >
                {/* FAQ Question Button */}
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between py-6 text-left group hover:bg-white/30 transition-colors duration-200 rounded-lg px-2"
                >
                  <h3 className="text-lg font-semibold text-[var(--color-text-dark-primary)] pr-4 group-hover:text-[var(--color-primary)] transition-colors duration-200">
                    {faq.question}
                  </h3>
                  
                  {/* Plus/Minus Icon */}
                  <div className="flex-shrink-0 w-8 h-8 bg-[var(--color-text-dark-primary)] rounded-full flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors duration-200">
                    <svg 
                      className={`w-4 h-4 text-white transition-transform duration-200 ${
                        openFaqId === faq.id ? 'rotate-45' : 'rotate-0'
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 4v16m8-8H4" 
                      />
                    </svg>
                  </div>
                </button>

                {/* FAQ Answer - Expandable */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openFaqId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="pb-6 pr-12 pl-2">
                    <p className="text-[var(--color-text-dark-secondary)] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}