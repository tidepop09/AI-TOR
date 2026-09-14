import React, { useState } from 'react';
import { Sparkles, Send, Bot, ShieldCheck, RefreshCw, HelpCircle, CheckCircle, FileText } from 'lucide-react';
import { TORDocument } from '../types';

interface AIQueryPanelProps {
  tors: TORDocument[];
  onTriggerAIAnalyze: (customPrompt: string) => void;
  isAnalyzing: boolean;
}

export const AIQueryPanel: React.FC<AIQueryPanelProps> = ({
  tors,
  onTriggerAIAnalyze,
  isAnalyzing,
}) => {
  const [query, setQuery] = useState('');
  const [aiAnswers, setAiAnswers] = useState<
    { question: string; answer: string; timestamp: string }[]
  >([
    {
      question: 'เปรียบเทียบความคุ้มค่าและความเสี่ยงของสถาปัตยกรรม Edge AI กับ Server-centric',
      answer: `เรียน คณะกรรมการจัดซื้อจัดจ้างและตรวจรับพัสดุ จากการตรวจสอบเอกสารที่กำหนดให้ มีข้อวิเคราะห์เปรียบเทียบดังนี้:

๑. สถาปัตยกรรม Edge AI Processing (อ้างอิง SPEC-EDGE-AI-04 และ TOR-02):
- มีชิปประมวลผล Deep Learning ฝังในกล้อง และมีพอร์ต Relay Output สั่งเปิดไม้กั้นโดยตรง
- ความเสถียร: สูงมาก ไม้กั้นเปิดได้ต่อเนื่องแม้เครือข่ายส่วนกลางหรือ Server ขัดข้อง โดยมี SD Card 256GB สำรองในกล้อง
- ความคุ้มค่า: ประหยัดค่าเครื่องแม่ข่ายส่วนกลาง ไม่ต้องใช้เซิร์ฟเวอร์สเปกสูงเพื่อประมวลผลวิดีโอหลายสตรีมพร้อมกัน

๒. สถาปัตยกรรม Server-centric (อ้างอิง MOCK-TOR-LPR-01):
- ตัวกล้อง 2MP ส่งสตรีมภาพกลับมาประมวลผลที่เครื่องบันทึก/เซิร์ฟเวอร์ส่วนกลาง
- ความเสี่ยง: มี Single Point of Failure หากเซิร์ฟเวอร์หรือเน็ตเวิร์กล่ม การตรวจจับและเปิดไม้กั้นจะหยุดชะงักทั้งหมด
- ความเหมาะสม: เหมาะเฉพาะจุดตรวจขนาดเล็ก ๑ ประตูที่ไม่วิกฤติต่อการจราจรติดขัดสะสม`,
      timestamp: 'ประมวลผลล่าสุด',
    },
  ]);

  const presetQuestions = [
    'วิเคราะห์ความสอดคล้องตามมาตรา ๘ แห่ง พ.ร.บ. การจัดซื้อจัดจ้างฯ พ.ศ. ๒๕๖๐',
    'เปรียบเทียบเงื่อนไขการรับประกันและข้อตกลงระดับบริการ (SLA) ทุกฉบับ',
    'ประเมินความพร้อมด้านการคุ้มครองข้อมูลส่วนบุคคล (PDPA) และความมั่นคงปลอดภัยไซเบอร์',
    'สรุปเหตุผลความเหมาะสมหากหน่วยงานมีงบประมาณไม่เกิน ๒,๐๐๐,๐๐๐ บาท',
  ];

  const handleSend = async (questionText?: string) => {
    const q = questionText || query;
    if (!q.trim() || isAnalyzing) return;

    try {
      // Send to server
      const res = await fetch('/api/analyze-tor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents: tors,
          customPrompt: q,
        }),
      });

      const data = await res.json();
      const responseText =
        data.analysis?.formalReportText ||
        (typeof data.analysis === 'string'
          ? data.analysis
          : JSON.stringify(data.analysis, null, 2));

      setAiAnswers((prev) => [
        {
          question: q,
          answer: responseText,
          timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev,
      ]);
      setQuery('');
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-900 text-amber-400 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <span>ผู้ช่วย AI วิเคราะห์เจาะลึกเฉพาะเอกสาร TOR (Official Procurement Q&A)</span>
            </h3>
            <span className="text-2xs text-slate-500">
              อิงข้อมูลจากเอกสาร TOR {tors.length} ฉบับที่กำหนดให้เท่านั้น • สำนวนภาษาราชการทางการ
            </span>
          </div>
        </div>
        <span className="text-3xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          <span>Grounded in TOR</span>
        </span>
      </div>

      {/* Preset Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-2xs text-slate-400 whitespace-nowrap">ประเด็นสอบถามด่วน:</span>
        {presetQuestions.map((pq, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(pq)}
            disabled={isAnalyzing}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-full whitespace-nowrap transition-colors text-2xs font-medium"
          >
            {pq}
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="พิมพ์คำถามหรือประเด็นที่ต้องการให้ AI วิเคราะห์เปรียบเทียบเพิ่มเติม..."
            className="w-full pl-4 pr-10 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-800 focus:bg-white"
          />
          <button
            onClick={() => handleSend()}
            disabled={!query.trim() || isAnalyzing}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-800 disabled:opacity-40 p-1 rounded-md hover:bg-blue-50"
          >
            {isAnalyzing ? (
              <RefreshCw className="w-4 h-4 animate-spin text-blue-800" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Q&A History */}
      <div className="space-y-3 pt-2">
        {aiAnswers.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2"
          >
            <div className="flex items-center justify-between text-slate-500 text-2xs border-b border-slate-200/60 pb-1.5">
              <span className="font-bold text-blue-900 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-blue-700" />
                <span>ข้อหารือ: {item.question}</span>
              </span>
              <span>{item.timestamp}</span>
            </div>
            <div className="text-slate-800 leading-relaxed whitespace-pre-line font-sans pl-1">
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
