import React, { useState } from 'react';
import { TORDocument, TORComparisonDifference } from '../types';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  ArrowRightLeft,
  ShieldAlert,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Info
} from 'lucide-react';
import { DEFAULT_COMPARISON_DIFFERENCES } from '../data/defaultTors';

interface AnalysisHighlightsProps {
  tors: TORDocument[];
  customDifferences?: TORComparisonDifference[];
}

export const AnalysisHighlights: React.FC<AnalysisHighlightsProps> = ({
  tors,
  customDifferences,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'comparison' | 'strengths' | 'common'>('comparison');

  const differences = customDifferences && customDifferences.length > 0
    ? customDifferences
    : DEFAULT_COMPARISON_DIFFERENCES;

  // Key commonalities found across the provided TOR documents
  const commonalities = [
    {
      title: 'เทคโนโลยีตรวจจับป้ายทะเบียนภาษาไทย (Thai License Plate Recognition)',
      detail: 'ทุกฉบับกำหนดให้รองรับการอ่านหมวดอักษร ตัวเลข และหมวดจังหวัดของประเทศไทยอย่างถูกต้อง โดยมีความแม่นยำขั้นต่ำในเวลากลางวันไม่น้อยกว่าร้อยละ 90-98',
    },
    {
      title: 'การจัดเก็บบันทึกข้อมูลภาพและประวัติ (Logging & Evidence Trail)',
      detail: 'ทุกฉบับมีข้อกำหนดในการจัดเก็บภาพถ่ายตัวรถ ภาพป้ายทะเบียน วันที่ เวลา ช่องทางเข้า-ออก และประวัติการสืบค้นย้อนหลังลงในฐานข้อมูล',
    },
    {
      title: 'การบริหารจัดการบัญชีรายชื่อ (Whitelist / Watchlist / Blacklist)',
      detail: 'ทุกฉบับรองรับการสร้างบัญชีทะเบียนรถที่ได้รับอนุญาต และทะเบียนรถเฝ้าระวัง พร้อมการแจ้งเตือนเจ้าหน้าที่เมื่อตรวจพบรถในกลุ่มเป้าหมาย',
    },
    {
      title: 'การเชื่อมต่อข้อมูลผ่านระบบเปิด (Open API / REST API)',
      detail: 'ทุกฉบับกำหนดให้มี API เพื่อส่งออกหรือเชื่อมโยงข้อมูลกับระบบภายนอก เช่น ระบบบริหารงานบุคคล (HRIS) หรือระบบ Visitor',
    },
    {
      title: 'การควบคุมความปลอดภัยของข้อมูลและระบบ (Security & Audit Trail)',
      detail: 'ทุกฉบับกำหนดให้มีระบบสิทธิการใช้งาน (Role-Based Access), การบันทึก Audit Log และการป้องกันเครือข่ายกล้องแยกจากระบบทั่วไป',
    },
    {
      title: 'คุณสมบัติขั้นพื้นฐานของผู้เสนอราคาตามระเบียบพัสดุ',
      detail: 'ต้องเป็นนิติบุคคลไทย ไม่เป็นผู้ทิ้งงานของทางราชการ มีทีมงานหรือช่างติดตั้งระบบเพียงพอ และมีสิทธิ์การใช้งานซอฟต์แวร์ถูกต้องตามกฎหมาย',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Sub tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-blue-700" />
            <span>วิเคราะห์ความเหมือน ความต่าง จุดเด่น และจุดด้อย</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            สังเคราะห์ข้อมูลเปรียบเทียบจากเอกสาร TOR ที่กำหนดให้เท่านั้น เพื่อสนับสนุนการตัดสินใจของเจ้าหน้าที่พัสดุ
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-700">
          <button
            onClick={() => setActiveSubTab('comparison')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeSubTab === 'comparison'
                ? 'bg-white text-blue-900 shadow-2xs font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            ⚡ วิเคราะห์ความต่าง (Differences)
          </button>
          <button
            onClick={() => setActiveSubTab('strengths')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeSubTab === 'strengths'
                ? 'bg-white text-blue-900 shadow-2xs font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            ⭐ จุดเด่น - จุดด้อยรายฉบับ
          </button>
          <button
            onClick={() => setActiveSubTab('common')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeSubTab === 'common'
                ? 'bg-white text-blue-900 shadow-2xs font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            🔗 ความเหมือนร่วมกัน
          </button>
        </div>
      </div>

      {/* SubTab 1: Differences with highlighted comparison cards */}
      {activeSubTab === 'comparison' && (
        <div className="space-y-4">
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-xs text-blue-950 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm mb-0.5">
                ข้อสังเกตหลักสำหรับเจ้าหน้าที่พัสดุ (Key Architectural Differences):
              </span>
              <p className="leading-relaxed">
                ข้อแตกต่างเชิงสถาปัตยกรรมสำคัญคือการเลือกระหว่าง{' '}
                <strong className="text-blue-900">
                  สถาปัตยกรรมแบบประมวลผลที่กล้อง (Edge AI Processing)
                </strong>{' '}
                ซึ่งเปิดไม้กั้นได้รวดเร็วและทำงานต่อเนื่องแม้ระบบแม่ข่ายขัดข้อง กับ{' '}
                <strong className="text-blue-900">สถาปัตยกรรมแบบเซิร์ฟเวอร์ส่วนกลาง (Server-centric)</strong>{' '}
                ที่ประหยัดต้นทุนอุปกรณ์กล้อง แต่เสี่ยงต่อจุดขัดข้องเดี่ยว (Single Point of Failure)
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {differences.map((diff, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-mono">
                      {index + 1}
                    </span>
                    <span>{diff.dimension}</span>
                  </h3>
                  <span className="text-2xs bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                    ข้อพิจารณาความแตกต่าง
                  </span>
                </div>

                {/* Per TOR value comparison boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                  {tors.map((t) => {
                    const value = diff.values[t.id] || diff.values[t.code] || 'ระบุตามข้อกำหนด';
                    return (
                      <div
                        key={t.id}
                        className="bg-slate-50/70 border border-slate-200/80 rounded-lg p-3 text-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono font-bold text-blue-900">{t.code}</span>
                            <span className="text-3xs text-slate-500 font-medium">{t.badge}</span>
                          </div>
                          <p className="text-slate-700 leading-relaxed font-medium">{value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Procurement note */}
                <div className="bg-amber-50/50 border-t border-amber-200/60 -mx-5 -mb-5 p-3.5 px-5 rounded-b-xl text-xs text-amber-950 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900">ข้อคิดเห็นทางพัสดุ: </span>
                    <span className="leading-relaxed">{diff.procurementNote}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 2: Strengths & Weaknesses per TOR */}
      {activeSubTab === 'strengths' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tors.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-blue-100 text-blue-800">
                        {t.code}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">({t.badge})</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{t.title}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-blue-900 block">
                      {t.priceFormatted}
                    </span>
                    <span className="text-2xs text-slate-500">{t.duration}</span>
                  </div>
                </div>

                {/* Highlights / Strengths */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <ThumbsUp className="w-4 h-4 text-emerald-600" />
                    <span>จุดเด่นสำคัญ (Key Highlights & Strengths)</span>
                  </div>
                  <div className="space-y-1.5 pl-1">
                    {t.highlights.map((h, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs text-slate-700 bg-emerald-50/50 p-2 rounded-md border border-emerald-100"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Drawbacks / Limitations */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                    <ThumbsDown className="w-4 h-4 text-rose-600" />
                    <span>จุดด้อยและข้อพิจารณาจำกัด (Limitations & Gaps)</span>
                  </div>
                  <div className="space-y-1.5 pl-1">
                    {t.drawbacks.map((d, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs text-slate-700 bg-rose-50/50 p-2 rounded-md border border-rose-100"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom warranty snapshot */}
              <div className="pt-3 border-t border-slate-100 text-2xs text-slate-600 flex items-center justify-between">
                <span>เงื่อนไขรับประกัน:</span>
                <span className="font-semibold text-slate-900">{t.warrantyAndSla.split(',')[0]}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SubTab 3: Commonalities */}
      {activeSubTab === 'common' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>ความเหมือนและมาตรฐานร่วมกันของทุก TOR (Common Standards)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              จุดร่วมขั้นพื้นฐานที่ปรากฏในเอกสาร TOR ทุกฉบับ ซึ่งถือเป็นเกณฑ์มาตรฐานขั้นต่ำที่หน่วยงานต้องการ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commonalities.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-100 rounded-lg p-4 text-xs text-slate-700 leading-relaxed">
            <strong className="text-slate-900 block mb-1">
              บทสรุปเปรียบเทียบในภาพรวมของเจ้าหน้าที่พัสดุ:
            </strong>
            เอกสาร TOR ทุกฉบับมีความสอดคล้องในมิติการระบุป้ายทะเบียนไทยและการจัดเก็บประวัติภาพ
            แต่มีความแตกต่างกันอย่างมีนัยสำคัญใน{' '}
            <strong className="text-slate-900">ขอบเขตงาน (มีไม้กั้น vs ไม่มีไม้กั้น)</strong>,{' '}
            <strong className="text-slate-900">ระดับความมั่นคงของสถาปัตยกรรม (Edge AI vs Central Cluster)</strong>,{' '}
            และ <strong className="text-slate-900">ระยะเวลารับประกัน (2 ปี vs 3 ปี vs 5 ปี)</strong>{' '}
            ซึ่งคณะกรรมการจัดซื้อจัดจ้างต้องนำไปประกอบการพิจารณาตามกรอบวงเงินงบประมาณที่ได้รับจัดสรร
          </div>
        </div>
      )}
    </div>
  );
};
