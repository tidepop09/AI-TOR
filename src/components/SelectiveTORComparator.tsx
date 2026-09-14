import React, { useState, useMemo } from 'react';
import { TORDocument } from '../types';
import { getExpertProfile, evaluateExpertsSummary } from '../utils/expertUtils';
import { ExpertDetailModal } from './ExpertDetailModal';
import {
  ArrowLeftRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Scale,
  Award,
  Clock,
  Coins,
  ShieldCheck,
  Cpu,
  Layers,
  Copy,
  Printer,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  FileText,
  Building,
  HelpCircle,
  SlidersHorizontal,
  BookmarkPlus,
  Users,
  ExternalLink,
  Star,
} from 'lucide-react';

interface SelectiveTORComparatorProps {
  tors: TORDocument[];
  onSelectForFormalMemo?: (torId: string) => void;
}

export const SelectiveTORComparator: React.FC<SelectiveTORComparatorProps> = ({
  tors,
  onSelectForFormalMemo,
}) => {
  // Mode: 'duel' (2 TORs head-to-head) or 'triple' (3 TORs) or 'custom'
  const [compareMode, setCompareMode] = useState<'duel' | 'triple' | 'custom'>('duel');
  const [expertModalTor, setExpertModalTor] = useState<TORDocument | null>(null);

  // Selected TOR IDs for Head-to-Head
  const [torAId, setTorAId] = useState<string>(tors[0]?.id || '');
  const [torBId, setTorBId] = useState<string>(tors[1]?.id || (tors[0]?.id || ''));
  const [torCId, setTorCId] = useState<string>(tors[2]?.id || (tors[1]?.id || ''));

  // Custom multi-select ids
  const [customSelectedIds, setCustomSelectedIds] = useState<string[]>(
    tors.slice(0, 3).map((t) => t.id)
  );

  const [copied, setCopied] = useState(false);
  const [activeDimension, setActiveDimension] = useState<string>('all');

  // Resolved TOR objects
  const torA = useMemo(() => tors.find((t) => t.id === torAId) || tors[0], [tors, torAId]);
  const torB = useMemo(() => tors.find((t) => t.id === torBId) || tors[1] || tors[0], [tors, torBId]);
  const torC = useMemo(() => tors.find((t) => t.id === torCId) || tors[2] || tors[0], [tors, torCId]);

  // Swap TOR A & B
  const handleSwap = () => {
    const temp = torAId;
    setTorAId(torBId);
    setTorBId(temp);
  };

  // Preset pairings
  const handleSelectPreset = (idA: string, idB: string, idC?: string) => {
    setTorAId(idA);
    setTorBId(idB);
    if (idC) {
      setTorCId(idC);
      setCompareMode('triple');
    } else {
      setCompareMode('duel');
    }
  };

  // Deltas calculation between A and B
  const deltas = useMemo(() => {
    if (!torA || !torB) return null;

    const priceDiff = torA.price - torB.price;
    const pricePercentDiff = torB.price > 0 ? (priceDiff / torB.price) * 100 : 0;
    const durationDiff = torA.durationDays - torB.durationDays;

    const totalScoreA =
      torA.scores.technical +
      torA.scores.scope +
      torA.scores.price +
      torA.scores.duration +
      torA.scores.expertise;

    const totalScoreB =
      torB.scores.technical +
      torB.scores.scope +
      torB.scores.price +
      torB.scores.duration +
      torB.scores.expertise;

    const scoreDiff = totalScoreA - totalScoreB;

    return {
      priceDiff,
      pricePercentDiff,
      durationDiff,
      totalScoreA,
      totalScoreB,
      scoreDiff,
    };
  }, [torA, torB]);

  // Dimension comparison list
  const dimensions = [
    {
      id: 'scope',
      name: '๑. ขอบเขตงานและจำนวนช่องทาง (Scope & Lanes)',
      icon: Layers,
      valA: torA?.scope,
      valB: torB?.scope,
      valC: torC?.scope,
      getAdvantage: () => {
        const aLanes = torA?.scope.includes('4') ? 4 : 2;
        const bLanes = torB?.scope.includes('4') ? 4 : 2;
        const aBarrier = torA?.scope.includes('ไม้กั้น');
        const bBarrier = torB?.scope.includes('ไม้กั้น');
        if (aBarrier && !bBarrier) return { winner: 'A', text: `${torA?.code} ได้เปรียบ รวมไม้กั้นอัตโนมัติ` };
        if (bBarrier && !aBarrier) return { winner: 'B', text: `${torB?.code} ได้เปรียบ รวมไม้กั้นอัตโนมัติ` };
        if (aLanes > bLanes) return { winner: 'A', text: `${torA?.code} ครอบคลุม 4 ช่องทาง` };
        if (bLanes > aLanes) return { winner: 'B', text: `${torB?.code} ครอบคลุม 4 ช่องทาง` };
        return { winner: 'TIE', text: 'ขอบเขตงานใกล้เคียงกัน' };
      },
    },
    {
      id: 'hardware',
      name: '๒. ครุภัณฑ์ฮาร์ดแวร์และความละเอียดกล้อง (Hardware Specs)',
      icon: Cpu,
      valA: torA ? (
        <ul className="list-disc pl-4 space-y-1 text-xs">
          {torA.hardwareSoftware.hardware.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      ) : null,
      valB: torB ? (
        <ul className="list-disc pl-4 space-y-1 text-xs">
          {torB.hardwareSoftware.hardware.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      ) : null,
      valC: torC ? (
        <ul className="list-disc pl-4 space-y-1 text-xs">
          {torC.hardwareSoftware.hardware.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      ) : null,
      getAdvantage: () => {
        const aScore = torA?.scores.technical || 0;
        const bScore = torB?.scores.technical || 0;
        if (aScore > bScore + 0.5) return { winner: 'A', text: `${torA?.code} สเปกกล้อง/อุปกรณ์สูงกว่า (คะแนน ${aScore} vs ${bScore})` };
        if (bScore > aScore + 0.5) return { winner: 'B', text: `${torB?.code} สเปกกล้อง/อุปกรณ์สูงกว่า (คะแนน ${bScore} vs ${aScore})` };
        return { winner: 'TIE', text: 'คุณสมบัติทางเทคนิคใกล้เคียงกัน' };
      },
    },
    {
      id: 'software',
      name: '๓. สถาปัตยกรรมและซอฟต์แวร์ AI (Architecture & Accuracy)',
      icon: Sparkles,
      valA: (
        <div className="space-y-1 text-xs">
          <p className="font-semibold text-blue-900">{torA?.hardwareSoftware.architecture}</p>
          <p className="text-slate-600">{torA?.hardwareSoftware.accuracy}</p>
          <p className="text-slate-500">{torA?.hardwareSoftware.storageAndNetwork}</p>
        </div>
      ),
      valB: (
        <div className="space-y-1 text-xs">
          <p className="font-semibold text-blue-900">{torB?.hardwareSoftware.architecture}</p>
          <p className="text-slate-600">{torB?.hardwareSoftware.accuracy}</p>
          <p className="text-slate-500">{torB?.hardwareSoftware.storageAndNetwork}</p>
        </div>
      ),
      valC: (
        <div className="space-y-1 text-xs">
          <p className="font-semibold text-blue-900">{torC?.hardwareSoftware.architecture}</p>
          <p className="text-slate-600">{torC?.hardwareSoftware.accuracy}</p>
          <p className="text-slate-500">{torC?.hardwareSoftware.storageAndNetwork}</p>
        </div>
      ),
      getAdvantage: () => {
        const isEdgeA = torA?.hardwareSoftware.architecture.includes('Edge');
        const isEdgeB = torB?.hardwareSoftware.architecture.includes('Edge');
        if (isEdgeA && !isEdgeB) return { winner: 'A', text: `${torA?.code} ใช้ Edge AI ประมวลผลที่กล้อง ไม่หน่วงเน็ตเวิร์ก` };
        if (isEdgeB && !isEdgeA) return { winner: 'B', text: `${torB?.code} ใช้ Edge AI ประมวลผลที่กล้อง ไม่หน่วงเน็ตเวิร์ก` };
        return { winner: 'TIE', text: 'ความสามารถซอฟต์แวร์และ AI อยู่ในระดับมาตรฐาน' };
      },
    },
    {
      id: 'price',
      name: '๔. ราคาและความคุ้มค่าต่องบประมาณ (Price & Value)',
      icon: Coins,
      valA: (
        <div>
          <div className="text-base font-bold text-slate-900">{torA?.priceFormatted}</div>
          <div className="text-2xs text-slate-500 mt-0.5">คะแนนความคุ้มค่า: {torA?.scores.price}/10</div>
          <div className="text-xs text-slate-600 mt-1">{torA?.scores.reasons.price}</div>
        </div>
      ),
      valB: (
        <div>
          <div className="text-base font-bold text-slate-900">{torB?.priceFormatted}</div>
          <div className="text-2xs text-slate-500 mt-0.5">คะแนนความคุ้มค่า: {torB?.scores.price}/10</div>
          <div className="text-xs text-slate-600 mt-1">{torB?.scores.reasons.price}</div>
        </div>
      ),
      valC: (
        <div>
          <div className="text-base font-bold text-slate-900">{torC?.priceFormatted}</div>
          <div className="text-2xs text-slate-500 mt-0.5">คะแนนความคุ้มค่า: {torC?.scores.price}/10</div>
          <div className="text-xs text-slate-600 mt-1">{torC?.scores.reasons.price}</div>
        </div>
      ),
      getAdvantage: () => {
        if (!torA || !torB) return { winner: 'TIE', text: '-' };
        if (torA.price < torB.price) {
          const saving = torB.price - torA.price;
          return { winner: 'A', text: `${torA.code} ถูกกว่า ฿${saving.toLocaleString()} (ประหยัดงบประมาณ)` };
        } else if (torB.price < torA.price) {
          const saving = torA.price - torB.price;
          return { winner: 'B', text: `${torB.code} ถูกกว่า ฿${saving.toLocaleString()} (ประหยัดงบประมาณ)` };
        }
        return { winner: 'TIE', text: 'ราคาเท่ากัน' };
      },
    },
    {
      id: 'duration',
      name: '๕. ระยะเวลาส่งมอบและงวดงาน (Timeline & Milestones)',
      icon: Clock,
      valA: (
        <div className="text-xs space-y-1">
          <div className="font-bold text-slate-800">{torA?.duration}</div>
          <div className="text-slate-600">{torA?.delivery}</div>
        </div>
      ),
      valB: (
        <div className="text-xs space-y-1">
          <div className="font-bold text-slate-800">{torB?.duration}</div>
          <div className="text-slate-600">{torB?.delivery}</div>
        </div>
      ),
      valC: (
        <div className="text-xs space-y-1">
          <div className="font-bold text-slate-800">{torC?.duration}</div>
          <div className="text-slate-600">{torC?.delivery}</div>
        </div>
      ),
      getAdvantage: () => {
        if (!torA || !torB) return { winner: 'TIE', text: '-' };
        if (torA.durationDays < torB.durationDays) {
          return { winner: 'A', text: `${torA.code} ส่งมอบเร็วกว่า ${torB.durationDays - torA.durationDays} วัน` };
        } else if (torB.durationDays < torA.durationDays) {
          return { winner: 'B', text: `${torB.code} ส่งมอบเร็วกว่า ${torA.durationDays - torB.durationDays} วัน` };
        }
        return { winner: 'TIE', text: `ระยะเวลาเท่ากัน (${torA.durationDays} วัน)` };
      },
    },
    {
      id: 'warranty',
      name: '๖. การรับประกันและ SLA บำรุงรักษา (Warranty & Service)',
      icon: ShieldCheck,
      valA: <div className="text-xs text-slate-700">{torA?.warrantyAndSla}</div>,
      valB: <div className="text-xs text-slate-700">{torB?.warrantyAndSla}</div>,
      valC: <div className="text-xs text-slate-700">{torC?.warrantyAndSla}</div>,
      getAdvantage: () => {
        const getYears = (str?: string) => {
          if (!str) return 2;
          if (str.includes('5 ปี')) return 5;
          if (str.includes('3 ปี')) return 3;
          if (str.includes('2 ปี')) return 2;
          return 1;
        };
        const yA = getYears(torA?.warrantyAndSla);
        const yB = getYears(torB?.warrantyAndSla);
        if (yA > yB) return { winner: 'A', text: `${torA?.code} รับประกันยาวนานกว่า (${yA} ปี vs ${yB} ปี)` };
        if (yB > yA) return { winner: 'B', text: `${torB?.code} รับประกันยาวนานกว่า (${yB} ปี vs ${yA} ปี)` };
        return { winner: 'TIE', text: `ระยะเวลารับประกันเท่ากัน (${yA} ปี)` };
      },
    },
    {
      id: 'expertise',
      name: '๗. คณะผู้เชี่ยวชาญและคุณสมบัติผู้ยื่น (Vendor & Expert Team)',
      icon: Users,
      valA: torA ? (() => {
        const profA = getExpertProfile(torA);
        const summA = evaluateExpertsSummary(profA.experts);
        return (
          <div className="text-xs space-y-2">
            <div>
              <div className="font-bold text-slate-900">{torA.vendor}</div>
              <div className="text-slate-600 line-clamp-2 mt-0.5">{torA.expertise}</div>
            </div>
            <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-2.5 space-y-1.5">
              <div className="flex items-center justify-between text-2xs">
                <span className="font-bold text-purple-950 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-purple-700" />
                  คณะผู้เชี่ยวชาญ: {summA.totalPersonnelCount} ท่าน
                </span>
                <span className="font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded">
                  {torA.scores.expertise}/10
                </span>
              </div>
              <div className="text-3xs text-slate-600 space-y-0.5">
                <div>บุคลากรหลัก: <strong>{summA.keyPersonnelCount} ท่าน</strong> (เฉลี่ย {summA.averageYears} ปี)</div>
                <div className="text-purple-800 line-clamp-1">
                  {summA.hasPmp ? '✓ PMP ' : ''}{summA.hasAiExpert ? '✓ AI Vision ' : ''}{summA.hasSecurityExpert ? '✓ CISSP/Security' : ''}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setExpertModalTor(torA)}
                className="w-full mt-1 py-1 px-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-3xs font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <span>ดูประวัติและวุฒิบัตร ({profA.experts.length} ท่าน)</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        );
      })() : null,
      valB: torB ? (() => {
        const profB = getExpertProfile(torB);
        const summB = evaluateExpertsSummary(profB.experts);
        return (
          <div className="text-xs space-y-2">
            <div>
              <div className="font-bold text-slate-900">{torB.vendor}</div>
              <div className="text-slate-600 line-clamp-2 mt-0.5">{torB.expertise}</div>
            </div>
            <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-2.5 space-y-1.5">
              <div className="flex items-center justify-between text-2xs">
                <span className="font-bold text-purple-950 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-purple-700" />
                  คณะผู้เชี่ยวชาญ: {summB.totalPersonnelCount} ท่าน
                </span>
                <span className="font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded">
                  {torB.scores.expertise}/10
                </span>
              </div>
              <div className="text-3xs text-slate-600 space-y-0.5">
                <div>บุคลากรหลัก: <strong>{summB.keyPersonnelCount} ท่าน</strong> (เฉลี่ย {summB.averageYears} ปี)</div>
                <div className="text-purple-800 line-clamp-1">
                  {summB.hasPmp ? '✓ PMP ' : ''}{summB.hasAiExpert ? '✓ AI Vision ' : ''}{summB.hasSecurityExpert ? '✓ CISSP/Security' : ''}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setExpertModalTor(torB)}
                className="w-full mt-1 py-1 px-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-3xs font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <span>ดูประวัติและวุฒิบัตร ({profB.experts.length} ท่าน)</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        );
      })() : null,
      valC: torC ? (() => {
        const profC = getExpertProfile(torC);
        const summC = evaluateExpertsSummary(profC.experts);
        return (
          <div className="text-xs space-y-2">
            <div>
              <div className="font-bold text-slate-900">{torC.vendor}</div>
              <div className="text-slate-600 line-clamp-2 mt-0.5">{torC.expertise}</div>
            </div>
            <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-2.5 space-y-1.5">
              <div className="flex items-center justify-between text-2xs">
                <span className="font-bold text-purple-950 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-purple-700" />
                  คณะผู้เชี่ยวชาญ: {summC.totalPersonnelCount} ท่าน
                </span>
                <span className="font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded">
                  {torC.scores.expertise}/10
                </span>
              </div>
              <div className="text-3xs text-slate-600 space-y-0.5">
                <div>บุคลากรหลัก: <strong>{summC.keyPersonnelCount} ท่าน</strong> (เฉลี่ย {summC.averageYears} ปี)</div>
                <div className="text-purple-800 line-clamp-1">
                  {summC.hasPmp ? '✓ PMP ' : ''}{summC.hasAiExpert ? '✓ AI Vision ' : ''}{summC.hasSecurityExpert ? '✓ CISSP/Security' : ''}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setExpertModalTor(torC)}
                className="w-full mt-1 py-1 px-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-3xs font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <span>ดูประวัติและวุฒิบัตร ({profC.experts.length} ท่าน)</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        );
      })() : null,
      getAdvantage: () => {
        if (!torA || !torB) return { winner: 'TIE', text: '-' };
        const eA = torA.scores.expertise || 0;
        const eB = torB.scores.expertise || 0;
        if (eA > eB + 0.3) {
          return { winner: 'A', text: `${torA.code} คณะผู้เชี่ยวชาญและใบรับรองวิชาชีพมีความพร้อมสูงกว่า (${eA} vs ${eB})` };
        }
        if (eB > eA + 0.3) {
          return { winner: 'B', text: `${torB.code} คณะผู้เชี่ยวชาญและใบรับรองวิชาชีพมีความพร้อมสูงกว่า (${eB} vs ${eA})` };
        }
        return { winner: 'TIE', text: 'คณะผู้เชี่ยวชาญและคุณสมบัติผู้ยื่นผ่านเกณฑ์มาตรฐานทัดเทียมกัน' };
      },
    },
    {
      id: 'highlights',
      name: '๘. จุดเด่นและข้อควรระวัง (Highlights & Trade-offs)',
      icon: Award,
      valA: (
        <div className="space-y-2 text-xs">
          <div>
            <span className="font-semibold text-emerald-800 block mb-1">จุดเด่น:</span>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
              {torA?.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="font-semibold text-rose-800 block mb-1">ข้อพึงระวัง:</span>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
              {torA?.drawbacks.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      ),
      valB: (
        <div className="space-y-2 text-xs">
          <div>
            <span className="font-semibold text-emerald-800 block mb-1">จุดเด่น:</span>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
              {torB?.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="font-semibold text-rose-800 block mb-1">ข้อพึงระวัง:</span>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
              {torB?.drawbacks.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      ),
      valC: (
        <div className="space-y-2 text-xs">
          <div>
            <span className="font-semibold text-emerald-800 block mb-1">จุดเด่น:</span>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
              {torC?.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="font-semibold text-rose-800 block mb-1">ข้อพึงระวัง:</span>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
              {torC?.drawbacks.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      ),
      getAdvantage: () => ({ winner: 'TIE', text: 'โปรดพิจารณาความคุ้มค่าตามวัตถุประสงค์การใช้งานจริง' }),
    },
  ];

  // Copy Pairwise Summary
  const handleCopySummary = () => {
    if (!torA || !torB || !deltas) return;
    const summary = `=== สรุปผลการเปรียบเทียบคู่เทียบ TOR เฉพาะฉบับ (Head-to-Head) ===
ฉบับที่ ๑: [${torA.code}] ${torA.title}
- ผู้ยื่น: ${torA.vendor}
- ราคา: ${torA.priceFormatted} (ระยะเวลา ${torA.durationDays} วัน)
- คะแนนรวมเรดาร์: ${deltas.totalScoreA.toFixed(1)} / 50 คะแนน
- สถาปัตยกรรม: ${torA.hardwareSoftware.architecture}

ฉบับที่ ๒: [${torB.code}] ${torB.title}
- ผู้ยื่น: ${torB.vendor}
- ราคา: ${torB.priceFormatted} (ระยะเวลา ${torB.durationDays} วัน)
- คะแนนรวมเรดาร์: ${deltas.totalScoreB.toFixed(1)} / 50 คะแนน
- สถาปัตยกรรม: ${torB.hardwareSoftware.architecture}

--- ผลต่างเปรียบเทียบ (Deltas) ---
• ผลต่างราคา: ${deltas.priceDiff < 0 ? `${torA.code} ถูกกว่า ${Math.abs(deltas.priceDiff).toLocaleString()} บาท` : `${torB.code} ถูกกว่า ${deltas.priceDiff.toLocaleString()} บาท`}
• ผลต่างระยะเวลา: ${deltas.durationDiff < 0 ? `${torA.code} เร็วกว่า ${Math.abs(deltas.durationDiff)} วัน` : `${torB.code} เร็วกว่า ${deltas.durationDiff} วัน`}
• ผลต่างคะแนนรวม: ${deltas.scoreDiff > 0 ? `${torA.code} นำอยู่ +${deltas.scoreDiff.toFixed(1)} คะแนน` : `${torB.code} นำอยู่ +${Math.abs(deltas.scoreDiff).toFixed(1)} คะแนน`}

--- ความเห็นฝ่ายพัสดุสำหรับเสนอคณะกรรมการ ---
หากหน่วยงานเน้นความคุ้มค่าสูงสุดในงบประมาณจำกัด พิจารณาเลือก ${torA.price < torB.price ? torA.code : torB.code}
หากหน่วยงานต้องการความสมบูรณ์ของระบบ กล้องความละเอียดสูง และไม้กั้นอัตโนมัติ พิจารณาเลือก ${deltas.totalScoreA > deltas.totalScoreB ? torA.code : torB.code}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrintPair = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Selector & Control Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 no-print">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                <ArrowLeftRight className="w-4 h-4 text-blue-800" />
              </div>
              <h2 className="text-base font-bold text-slate-900">
                เลือกคู่เปรียบเทียบ TOR ด้วยตนเอง (Custom TOR Comparator)
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              เลือกจับคู่ฉบับที่ต้องการนำมาประชันตัวต่อตัว (Head-to-Head) หรือเปรียบเทียบ ๓ ฝ่าย เพื่อวิเคราะห์ส่วนต่างเดลต้าและหาข้อสรุปเสนอคณะกรรมการ
            </p>
          </div>

          {/* Mode switch */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg self-start md:self-auto">
            <button
              id="compare-mode-duel"
              onClick={() => setCompareMode('duel')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                compareMode === 'duel'
                  ? 'bg-white text-blue-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ประชัน ๒ ฉบับ (Head-to-Head)
            </button>
            <button
              id="compare-mode-triple"
              onClick={() => setCompareMode('triple')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                compareMode === 'triple'
                  ? 'bg-white text-blue-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              เทียบ ๓ ฉบับ (3-Way)
            </button>
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <BookmarkPlus className="w-3.5 h-3.5" /> คู่เทียบแนะนำ:
          </span>
          {tors.length >= 2 && (
            <button
              id="preset-01-02"
              onClick={() => handleSelectPreset(tors[0]?.id, tors[1]?.id)}
              className="text-2xs font-medium px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-colors"
            >
              ⚡ พื้นฐาน vs บูรณาการ ({tors[0]?.code} vs {tors[1]?.code})
            </button>
          )}
          {tors.length >= 3 && (
            <button
              id="preset-02-03"
              onClick={() => handleSelectPreset(tors[1]?.id, tors[2]?.id)}
              className="text-2xs font-medium px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 transition-colors"
            >
              ⚡ Server AI vs Edge AI ({tors[1]?.code} vs {tors[2]?.code})
            </button>
          )}
          {tors.length >= 3 && (
            <button
              id="preset-triple-all"
              onClick={() => handleSelectPreset(tors[0]?.id, tors[1]?.id, tors[2]?.id)}
              className="text-2xs font-medium px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors"
            >
              ⚡ รวม ๓ ฉบับมาตรฐาน (A, B, C)
            </button>
          )}
        </div>

        {/* Selectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-2">
          {/* Side A Selector */}
          <div className={`${compareMode === 'triple' ? 'md:col-span-4' : 'md:col-span-5'} space-y-1.5`}>
            <label className="text-xs font-bold text-blue-900 flex items-center justify-between">
              <span>ฝ่ายที่ ๑ (TOR ก - ฉบับตั้งต้น)</span>
              <span className="text-2xs font-normal text-slate-500 font-mono">{torA?.code}</span>
            </label>
            <select
              id="select-tor-a"
              value={torAId}
              onChange={(e) => setTorAId(e.target.value)}
              className="w-full text-xs font-semibold bg-blue-50/50 border border-blue-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
            >
              {tors.map((t) => (
                <option key={t.id} value={t.id} disabled={t.id === torBId || (compareMode === 'triple' && t.id === torCId)}>
                  {t.code} : {t.title.slice(0, 45)}... ({t.priceFormatted})
                </option>
              ))}
            </select>
          </div>

          {/* Swap or VS badge */}
          {compareMode === 'duel' && (
            <div className="md:col-span-2 flex justify-center items-center py-1">
              <button
                id="swap-tor-btn"
                onClick={handleSwap}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors shadow-2xs"
                title="สลับฝั่งคู่เทียบ ก ⇄ ข"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-blue-700" />
                <span>สลับฝั่ง</span>
              </button>
            </div>
          )}

          {/* Side B Selector */}
          <div className={`${compareMode === 'triple' ? 'md:col-span-4' : 'md:col-span-5'} space-y-1.5`}>
            <label className="text-xs font-bold text-indigo-900 flex items-center justify-between">
              <span>ฝ่ายที่ ๒ (TOR ข - ฉบับคู่เทียบ)</span>
              <span className="text-2xs font-normal text-slate-500 font-mono">{torB?.code}</span>
            </label>
            <select
              id="select-tor-b"
              value={torBId}
              onChange={(e) => setTorBId(e.target.value)}
              className="w-full text-xs font-semibold bg-indigo-50/50 border border-indigo-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
            >
              {tors.map((t) => (
                <option key={t.id} value={t.id} disabled={t.id === torAId || (compareMode === 'triple' && t.id === torCId)}>
                  {t.code} : {t.title.slice(0, 45)}... ({t.priceFormatted})
                </option>
              ))}
            </select>
          </div>

          {/* Optional Side C Selector */}
          {compareMode === 'triple' && (
            <div className="md:col-span-4 space-y-1.5">
              <label className="text-xs font-bold text-amber-900 flex items-center justify-between">
                <span>ฝ่ายที่ ๓ (TOR ค - ฉบับร่วมเทียบ)</span>
                <span className="text-2xs font-normal text-slate-500 font-mono">{torC?.code}</span>
              </label>
              <select
                id="select-tor-c"
                value={torCId}
                onChange={(e) => setTorCId(e.target.value)}
                className="w-full text-xs font-semibold bg-amber-50/50 border border-amber-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-amber-800"
              >
                {tors.map((t) => (
                  <option key={t.id} value={t.id} disabled={t.id === torAId || t.id === torBId}>
                    {t.code} : {t.title.slice(0, 45)}... ({t.priceFormatted})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Head-to-Head Deltas & Scoreboard (for 2 TORs) */}
      {compareMode === 'duel' && deltas && torA && torB && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-slate-800 to-indigo-900 text-white p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <span className="text-2xs font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-400 text-blue-950">
                  Head-to-Head Matchup
                </span>
                <h3 className="text-base font-bold mt-1.5">
                  การประชันข้อกำหนด: {torA.code} ปะทะ {torB.code}
                </h3>
                <p className="text-xs text-slate-300">
                  เปรียบเทียบเชิงลึกเพื่อการตัดสินใจของคณะกรรมการตรวจรับพัสดุ
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกข้อสรุปคู่นี้'}</span>
                </button>
                <button
                  onClick={handlePrintPair}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>พิมพ์คู่เทียบ</span>
                </button>
              </div>
            </div>

            {/* Delta Highlights Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/10">
              {/* Price Delta */}
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-xs">
                <span className="text-2xs text-slate-300 block font-medium">ผลต่างด้านราคา (Price Delta)</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-sm font-bold text-white">
                    {deltas.priceDiff === 0
                      ? 'ราคาเท่ากัน'
                      : deltas.priceDiff < 0
                      ? `${torA.code} ถูกกว่า`
                      : `${torB.code} ถูกกว่า`}
                  </span>
                </div>
                <div className="text-xs font-medium text-amber-300 mt-0.5">
                  {deltas.priceDiff !== 0 && `฿${Math.abs(deltas.priceDiff).toLocaleString()} (${Math.abs(deltas.pricePercentDiff).toFixed(1)}%)`}
                </div>
              </div>

              {/* Duration Delta */}
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-xs">
                <span className="text-2xs text-slate-300 block font-medium">ผลต่างระยะเวลา (Timeline Delta)</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-sm font-bold text-white">
                    {deltas.durationDiff === 0
                      ? 'ระยะเวลาเท่ากัน'
                      : deltas.durationDiff < 0
                      ? `${torA.code} เร็วกว่า`
                      : `${torB.code} เร็วกว่า`}
                  </span>
                </div>
                <div className="text-xs font-medium text-emerald-300 mt-0.5">
                  {deltas.durationDiff !== 0 && `${Math.abs(deltas.durationDiff)} วันทำการ`}
                </div>
              </div>

              {/* Radar Score Delta */}
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-xs">
                <span className="text-2xs text-slate-300 block font-medium">ผลต่างคะแนนเรดาร์ (Score Delta)</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-sm font-bold text-white">
                    {deltas.scoreDiff === 0
                      ? 'คะแนนเท่ากัน'
                      : deltas.scoreDiff > 0
                      ? `${torA.code} นำอยู่`
                      : `${torB.code} นำอยู่`}
                  </span>
                </div>
                <div className="text-xs font-medium text-cyan-300 mt-0.5">
                  {deltas.scoreDiff !== 0 && `${Math.abs(deltas.scoreDiff).toFixed(1)} คะแนน (เต็ม 50)`}
                </div>
              </div>

              {/* Architecture Diff */}
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-xs">
                <span className="text-2xs text-slate-300 block font-medium">สถาปัตยกรรมระบบ (Architecture)</span>
                <div className="text-xs font-bold text-white mt-1 line-clamp-1">
                  {torA.hardwareSoftware.architecture.includes('Edge') ? 'Edge AI' : 'Server AI'} vs{' '}
                  {torB.hardwareSoftware.architecture.includes('Edge') ? 'Edge AI' : 'Server AI'}
                </div>
                <div className="text-2xs text-slate-300 mt-0.5">
                  ประมวลผลที่กล้อง vs แม่ข่าย
                </div>
              </div>
            </div>
          </div>

          {/* Quick Side-by-Side Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 p-5 bg-slate-50/50">
            {/* TOR A Card */}
            <div className="space-y-3 md:pr-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-2xs font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono">
                    {torA.code}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{torA.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{torA.vendor}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-bold text-blue-900 block">{torA.priceFormatted}</span>
                  <span className="text-2xs text-slate-500 font-medium">{torA.duration}</span>
                </div>
              </div>

              {/* 5 Radar Criteria Scores for A */}
              <div className="bg-white rounded-lg p-3 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-2xs font-bold text-slate-700">
                  <span>คะแนนรวม ๕ เกณฑ์ (เรดาร์)</span>
                  <span className="text-blue-900 font-bold text-xs">{deltas.totalScoreA.toFixed(1)} / 50</span>
                </div>
                <div className="grid grid-cols-5 gap-1 pt-1 text-center">
                  <div className="bg-slate-50 p-1 rounded border border-slate-100">
                    <span className="text-3xs text-slate-500 block">เทคนิค</span>
                    <span className="text-xs font-bold text-slate-800">{torA.scores.technical}</span>
                  </div>
                  <div className="bg-slate-50 p-1 rounded border border-slate-100">
                    <span className="text-3xs text-slate-500 block">ขอบเขต</span>
                    <span className="text-xs font-bold text-slate-800">{torA.scores.scope}</span>
                  </div>
                  <div className="bg-slate-50 p-1 rounded border border-slate-100">
                    <span className="text-3xs text-slate-500 block">ราคา</span>
                    <span className="text-xs font-bold text-slate-800">{torA.scores.price}</span>
                  </div>
                  <div className="bg-slate-50 p-1 rounded border border-slate-100">
                    <span className="text-3xs text-slate-500 block">ระยะเวลา</span>
                    <span className="text-xs font-bold text-slate-800">{torA.scores.duration}</span>
                  </div>
                  <div className="bg-slate-50 p-1 rounded border border-slate-100">
                    <span className="text-3xs text-slate-500 block">ผู้ยื่น</span>
                    <span className="text-xs font-bold text-slate-800">{torA.scores.expertise}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TOR B Card */}
            <div className="space-y-3 md:pl-4 pt-4 md:pt-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-2xs font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-mono">
                    {torB.code}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{torB.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{torB.vendor}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-bold text-indigo-900 block">{torB.priceFormatted}</span>
                  <span className="text-2xs text-slate-500 font-medium">{torB.duration}</span>
                </div>
              </div>

              {/* 5 Radar Criteria Scores for B */}
              <div className="bg-white rounded-lg p-3 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-2xs font-bold text-slate-700">
                  <span>คะแนนรวม ๕ เกณฑ์ (เรดาร์)</span>
                  <span className="text-indigo-900 font-bold text-xs">{deltas.totalScoreB.toFixed(1)} / 50</span>
                </div>
                <div className="grid grid-cols-5 gap-1 pt-1 text-center">
                  <div className="bg-slate-50 p-1 rounded border border-slate-100">
                    <span className="text-3xs text-slate-500 block">เทคนิค</span>
                    <span className="text-xs font-bold text-slate-800">{torB.scores.technical}</span>
                  </div>
                  <div className="bg-slate-50 p-1 rounded border border-slate-100">
                    <span className="text-3xs text-slate-500 block">ขอบเขต</span>
                    <span className="text-xs font-bold text-slate-800">{torB.scores.scope}</span>
                  </div>
                  <div className="bg-slate-50 p-1 rounded border border-slate-100">
                    <span className="text-3xs text-slate-500 block">ราคา</span>
                    <span className="text-xs font-bold text-slate-800">{torB.scores.price}</span>
                  </div>
                  <div className="bg-slate-50 p-1 rounded border border-slate-100">
                    <span className="text-3xs text-slate-500 block">ระยะเวลา</span>
                    <span className="text-xs font-bold text-slate-800">{torB.scores.duration}</span>
                  </div>
                  <div className="bg-slate-50 p-1 rounded border border-slate-100">
                    <span className="text-3xs text-slate-500 block">ผู้ยื่น</span>
                    <span className="text-xs font-bold text-slate-800">{torB.scores.expertise}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deep 8 Dimensions Head-to-Head Comparison Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-slate-50/70">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              ตารางเปรียบเทียบเจาะลึก ๘ มิติข้อกำหนด (Selective Comparison Matrix)
            </h3>
            <p className="text-2xs text-slate-600">
              แสดงข้อกำหนดเปรียบเทียบเคียงข้าง พร้อมระบบชี้ผลได้เปรียบ-เสียเปรียบ (Advantage Tagging)
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-2xs text-slate-500 font-medium">กรองมิติ:</span>
            <select
              value={activeDimension}
              onChange={(e) => setActiveDimension(e.target.value)}
              className="text-xs border border-slate-300 rounded-md px-2 py-1 bg-white text-slate-800"
            >
              <option value="all">แสดงทั้งหมด ๘ มิติ</option>
              <option value="scope">๑. ขอบเขตและช่องทาง</option>
              <option value="hardware">๒. ครุภัณฑ์ฮาร์ดแวร์</option>
              <option value="software">๓. ซอฟต์แวร์และ AI</option>
              <option value="price">๔. ราคาและความคุ้มค่า</option>
              <option value="duration">๕. ระยะเวลาและงวดงาน</option>
              <option value="warranty">๖. การรับประกันและ SLA</option>
              <option value="expertise">๗. คุณสมบัติผู้ยื่น</option>
              <option value="highlights">๘. จุดเด่น/ข้อพึงระวัง</option>
            </select>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs font-bold border-b border-slate-200">
                <th className="p-3.5 w-1/4">ประเด็นข้อกำหนดพัสดุ</th>
                <th className="p-3.5 w-3/8 bg-blue-50/50 text-blue-900 border-x border-slate-200">
                  ฝ่ายที่ ๑ : {torA?.code}
                </th>
                <th className="p-3.5 w-3/8 bg-indigo-50/50 text-indigo-900">
                  ฝ่ายที่ ๒ : {torB?.code}
                </th>
                {compareMode === 'triple' && (
                  <th className="p-3.5 w-1/4 bg-amber-50/50 text-amber-900 border-l border-slate-200">
                    ฝ่ายที่ ๓ : {torC?.code}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {dimensions
                .filter((dim) => activeDimension === 'all' || activeDimension === dim.id)
                .map((dim) => {
                  const advantage = dim.getAdvantage();
                  const Icon = dim.icon;
                  return (
                    <tr key={dim.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Dimension name + advantage tag */}
                      <td className="p-3.5 align-top bg-slate-50/30">
                        <div className="flex items-center gap-2 font-bold text-slate-800">
                          <Icon className="w-4 h-4 text-blue-800 shrink-0" />
                          <span>{dim.name}</span>
                        </div>

                        {/* Advantage badge for Head-to-Head */}
                        {compareMode === 'duel' && advantage && advantage.winner !== 'TIE' && (
                          <div
                            className={`mt-2 p-1.5 rounded text-2xs font-semibold flex items-center gap-1 ${
                              advantage.winner === 'A'
                                ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                            }`}
                          >
                            <Award className="w-3 h-3 shrink-0" />
                            <span>{advantage.text}</span>
                          </div>
                        )}
                        {compareMode === 'duel' && advantage && advantage.winner === 'TIE' && (
                          <div className="mt-2 text-2xs text-slate-500 font-medium">
                            ⚖️ {advantage.text}
                          </div>
                        )}
                      </td>

                      {/* Value A */}
                      <td className="p-3.5 align-top border-x border-slate-200 bg-white">
                        {dim.valA}
                      </td>

                      {/* Value B */}
                      <td className="p-3.5 align-top bg-white">{dim.valB}</td>

                      {/* Optional Value C */}
                      {compareMode === 'triple' && (
                        <td className="p-3.5 align-top border-l border-slate-200 bg-white">
                          {dim.valC}
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Procurement Decision Verdict for this specific pair */}
      {compareMode === 'duel' && torA && torB && (
        <div className="bg-gradient-to-br from-amber-50/60 to-blue-50/40 rounded-xl border border-amber-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-blue-950 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5 text-blue-900" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                บทสรุปข้อเสนอแนะฝ่ายพัสดุสำหรับคู่เทียบนี้ (Pairwise Strategic Procurement Verdict)
              </h3>
              <p className="text-2xs text-slate-600">
                วิเคราะห์ความสอดคล้องตามระเบียบกระทรวงการคลังฯ และ พ.ร.บ. การจัดซื้อจัดจ้างฯ พ.ศ. ๒๕๖๐ มาตรา ๘
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Context for TOR A */}
            <div className="bg-white rounded-lg p-3.5 border border-blue-200 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-blue-700" />
                <span>กรณีที่ควรพิจารณาเลือก {torA.code}:</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {torA.price < torB.price
                  ? `เหมาะสมในกรณีที่หน่วยงานมีกรอบงบประมาณจำกัด (ประหยัดได้ ฿${Math.abs(
                      torB.price - torA.price
                    ).toLocaleString()}) หรือต้องการใช้งานเฉพาะจุดตรวจหลักเพื่อบันทึกประวัติการผ่านเข้า-ออก โดยยังไม่มีความจำเป็นต้องใช้ระบบไม้กั้นหรือการวิเคราะห์ปัญญาประดิษฐ์ระดับแม่ข่ายศูนย์กลาง`
                  : `เหมาะสมในกรณีที่หน่วยงานต้องการข้อกำหนดและสเปกของ ${torA.code} ที่มีจุดเด่นเฉพาะตัว และยอมรับราคาที่สูงกว่าได้โดยมีเหตุผลความคุ้มค่ารองรับ`}
              </p>
            </div>

            {/* Context for TOR B */}
            <div className="bg-white rounded-lg p-3.5 border border-indigo-200 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-indigo-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-indigo-700" />
                <span>กรณีที่ควรพิจารณาเลือก {torB.code}:</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {torB.price < torA.price
                  ? `เหมาะสมเนื่องจากเสนอราคาที่ประหยัดกว่า (ถูกกว่า ฿${Math.abs(
                      torA.price - torB.price
                    ).toLocaleString()}) ช่วยประหยัดงบประมาณแผ่นดินและมีระยะเวลาส่งมอบที่ยอมรับได้`
                  : `เหมาะสมในกรณีที่หน่วยงานต้องการระบบบูรณาการครบวงจร มีอุปกรณ์ไม้กั้นอัตโนมัติ ระบบลงทะเบียนผู้มาติดต่อ (Visitor QR) และระยะเวลารับประกันที่ยาวนานกว่าเพื่อลดภาระค่าใช้จ่ายในการซ่อมบำรุงในอนาคต`}
              </p>
            </div>
          </div>

          {/* Action note */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs border-t border-amber-200/70">
            <span className="text-slate-600">
              💡 หมายเหตุ: คณะกรรมการสามารถคัดลอกข้อสรุปคู่นี้ไปจัดพิมพ์หรือแนบเป็นเอกสารประกอบการประชุมพิจารณาผลได้ทันที
            </span>
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors shadow-2xs shrink-0"
            >
              <Copy className="w-3.5 h-3.5 text-blue-800" />
              <span>{copied ? 'คัดลอกลง Clipboard แล้ว' : 'คัดลอกบทสรุป'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Expert Detail Modal */}
      {expertModalTor && (
        <ExpertDetailModal
          isOpen={!!expertModalTor}
          onClose={() => setExpertModalTor(null)}
          tor={expertModalTor}
          allTors={tors}
          onSelectTor={(t) => setExpertModalTor(t)}
        />
      )}
    </div>
  );
};
