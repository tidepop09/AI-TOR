import React, { useState } from 'react';
import { TORDocument } from '../types';
import { getExpertProfile, evaluateExpertsSummary } from '../utils/expertUtils';
import { ExpertDetailModal } from './ExpertDetailModal';
import {
  FileText,
  Building2,
  Clock,
  Crosshair,
  Cpu,
  CheckCircle2,
  Coins,
  Award,
  Search,
  Check,
  AlertTriangle,
  Sparkles,
  Layers,
  ShieldCheck,
  ArrowLeftRight,
  Users,
  Star,
  ExternalLink,
} from 'lucide-react';

interface ComparisonMatrixProps {
  tors: TORDocument[];
  onSelectTor?: (torId: string) => void;
  onNavigateToSelective?: () => void;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({ tors, onNavigateToSelective }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDimensionFilter, setActiveDimensionFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [expertModalTor, setExpertModalTor] = useState<TORDocument | null>(null);

  const dimensions = [
    {
      id: 'title',
      name: '1. ชื่อ TOR และรหัสเอกสาร',
      icon: FileText,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      getValue: (t: TORDocument) => (
        <div>
          <div className="font-bold text-slate-900 text-sm">{t.title}</div>
          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-medium">
              {t.code}
            </span>
            <span className="text-2xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
              {t.badge}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'vendor',
      name: '2. บริษัทหรือผู้ยื่น TOR',
      icon: Building2,
      color: 'text-indigo-700',
      bgColor: 'bg-indigo-50',
      getValue: (t: TORDocument) => (
        <div>
          <div className="font-medium text-slate-900 text-sm">{t.vendor}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>สถานะ: ผ่านคุณสมบัติเบื้องต้น</span>
          </div>
        </div>
      ),
    },
    {
      id: 'duration',
      name: '3. ระยะเวลาดำเนินงาน',
      icon: Clock,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      getValue: (t: TORDocument) => (
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 font-bold text-sm border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.duration}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">({t.durationDays} วันตามปฏิทิน)</p>
        </div>
      ),
    },
    {
      id: 'scope',
      name: '4. ขอบเขตการพัฒนาระบบ',
      icon: Crosshair,
      color: 'text-rose-700',
      bgColor: 'bg-rose-50',
      getValue: (t: TORDocument) => (
        <div className="space-y-2 text-xs text-slate-700">
          <p className="leading-relaxed">{t.scope}</p>
          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-500">
            <span className="font-semibold text-slate-600">สถาปัตยกรรม:</span>
            <span className="font-medium text-blue-800">{t.hardwareSoftware.architecture}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'hardwareSoftware',
      name: '5. ซอฟต์แวร์ ฮาร์ดแวร์ที่นำมาใช้',
      icon: Cpu,
      color: 'text-cyan-700',
      bgColor: 'bg-cyan-50',
      getValue: (t: TORDocument) => (
        <div className="space-y-2 text-xs">
          <div>
            <span className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600"></span>
              อุปกรณ์ฮาร์ดแวร์หลัก:
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              {t.hardwareSoftware.hardware.map((hw, idx) => (
                <li key={idx} className="leading-snug">
                  {hw}
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-2 border-t border-slate-100">
            <span className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              ฟังก์ชันซอฟต์แวร์และการเชื่อมต่อ:
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              {t.hardwareSoftware.software.map((sw, idx) => (
                <li key={idx} className="leading-snug">
                  {sw}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-50 p-2 rounded text-2xs text-slate-600">
            <span className="font-semibold text-slate-700">เกณฑ์ความแม่นยำ: </span>
            {t.hardwareSoftware.accuracy}
          </div>
        </div>
      ),
    },
    {
      id: 'delivery',
      name: '6. การส่งมอบงานและงวดงาน',
      icon: CheckCircle2,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      getValue: (t: TORDocument) => (
        <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
          <p>{t.delivery}</p>
          <div className="bg-emerald-50/70 border border-emerald-200/80 p-2 rounded text-2xs text-emerald-900">
            <span className="font-bold">การรับประกันและ SLA: </span>
            {t.warrantyAndSla}
          </div>
        </div>
      ),
    },
    {
      id: 'price',
      name: '7. ราคา / วงเงินงบประมาณ',
      icon: Coins,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      getValue: (t: TORDocument) => (
        <div>
          <div className="text-lg font-black text-slate-900 tracking-tight">
            {t.priceFormatted}
          </div>
          <span className="inline-block mt-1 text-2xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {t.price < 1000000
              ? 'ระดับงบประมาณต่ำ (ย่อมเยา)'
              : t.price < 3000000
              ? 'ระดับงบประมาณปานกลาง (บูรณาการ)'
              : 'ระดับงบประมาณความมั่นคงสูง'}
          </span>
        </div>
      ),
    },
    {
      id: 'expertise',
      name: '8. ความเชี่ยวชาญของบริษัทหรือผู้พัฒนา',
      icon: Award,
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      getValue: (t: TORDocument) => {
        const prof = getExpertProfile(t);
        const summ = evaluateExpertsSummary(prof.experts);
        return (
          <div className="text-xs text-slate-700 leading-relaxed space-y-2.5">
            <p className="line-clamp-3 text-slate-800">{t.expertise}</p>

            {/* Structured Specialists Snapshot */}
            <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-2.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-purple-950 text-2xs">
                  <Users className="w-3.5 h-3.5 text-purple-700" />
                  <span>คณะผู้เชี่ยวชาญประจำโครงการ ({summ.totalPersonnelCount} ท่าน)</span>
                </div>
                <div className="flex items-center gap-1 text-2xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>{t.scores.expertise}/10</span>
                </div>
              </div>

              {/* Badges of key roles / certs */}
              <div className="flex flex-wrap gap-1">
                {summ.hasPmp && (
                  <span className="text-3xs bg-white text-purple-800 border border-purple-200 px-1.5 py-0.5 rounded font-semibold">
                    🎓 PMP Project Manager
                  </span>
                )}
                {summ.hasAiExpert && (
                  <span className="text-3xs bg-white text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded font-semibold">
                    🤖 AI Vision Specialist
                  </span>
                )}
                {summ.hasSecurityExpert && (
                  <span className="text-3xs bg-white text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold">
                    🛡️ Security Specialist
                  </span>
                )}
                <span className="text-3xs bg-white text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded">
                  ประสบการณ์เฉลี่ย {summ.averageYears} ปี
                </span>
              </div>

              {/* View full experts roster button */}
              <button
                type="button"
                onClick={() => setExpertModalTor(t)}
                className="w-full mt-1.5 py-1.5 px-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-2xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-purple-200" />
                <span>ดูทำเนียบและใบรับรองผู้เชี่ยวชาญ ({prof.experts.length} ท่าน)</span>
                <ExternalLink className="w-3 h-3 text-purple-200" />
              </button>
            </div>
          </div>
        );
      },
    },
  ];

  // Filter dimensions
  const filteredDimensions = dimensions.filter((d) => {
    if (activeDimensionFilter !== 'all' && d.id !== activeDimensionFilter) {
      return false;
    }
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const matchesDimension = d.name.toLowerCase().includes(term);
    const matchesTorContent = tors.some((t) => {
      const textVal = JSON.stringify(t).toLowerCase();
      return textVal.includes(term);
    });
    return matchesDimension || matchesTorContent;
  });

  return (
    <div className="space-y-5">
      {/* Control bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="search-matrix"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาข้อกำหนด เช่น ไม้กั้น, Edge, 5MP, SLA, งวดงาน..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:bg-white"
              />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs text-slate-500 hover:text-slate-800 underline whitespace-nowrap"
              >
                ล้างคำค้น
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {onNavigateToSelective && (
              <button
                id="jump-to-selective-btn"
                onClick={onNavigateToSelective}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors shadow-2xs"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-blue-700" />
                <span>เลือกคู่เปรียบเทียบเอง (Head-to-Head)</span>
              </button>
            )}

            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md transition-all ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : ''
                }`}
              >
                แบบตารางเปรียบเทียบ
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded-md transition-all ${
                  viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : ''
                }`}
              >
                แบบแยกตาม TOR
              </button>
            </div>
          </div>
        </div>

        {/* Quick dimension filter pills */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 overflow-x-auto text-xs pb-1">
          <span className="text-slate-500 text-2xs mr-1 font-medium whitespace-nowrap">
            กรองประเด็น:
          </span>
          <button
            onClick={() => setActiveDimensionFilter('all')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
              activeDimensionFilter === 'all'
                ? 'bg-blue-800 text-white font-medium'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ทั้งหมด (8 มิติ)
          </button>
          {dimensions.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDimensionFilter(d.id)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                activeDimensionFilter === d.id
                  ? 'bg-blue-800 text-white font-medium'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d.name.split(' ')[1] || d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-900 text-white divide-x divide-slate-800">
                  <th className="p-4 text-xs font-bold uppercase tracking-wider w-64 sticky left-0 z-10 bg-slate-900">
                    ประเด็นการวิเคราะห์ (8 ประเด็น)
                  </th>
                  {tors.map((t) => (
                    <th key={t.id} className="p-4 text-xs font-bold w-72">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-amber-300 text-sm">{t.code}</span>
                        <span className="text-2xs font-normal px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {t.badge}
                        </span>
                      </div>
                      <div className="font-medium text-slate-200 text-xs mt-1 line-clamp-1">
                        {t.title}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {filteredDimensions.map((dim, idx) => {
                  const Icon = dim.icon;
                  return (
                    <tr
                      key={dim.id}
                      className={`divide-x divide-slate-200 hover:bg-slate-50/70 transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                      }`}
                    >
                      {/* Left sticky dimension column */}
                      <td className="p-4 sticky left-0 z-10 bg-white/95 backdrop-blur-xs font-semibold text-slate-900 border-r border-slate-200">
                        <div className="flex items-start gap-2.5">
                          <div className={`p-1.5 rounded-md ${dim.bgColor} ${dim.color} shrink-0`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              {dim.name}
                            </span>
                            <span className="text-2xs text-slate-400 block mt-0.5">
                              เกณฑ์มาตรฐานพัสดุ
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* TOR Value cells */}
                      {tors.map((t) => (
                        <td key={t.id} className="p-4 align-top">
                          {dim.getValue(t)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tors.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 hover:border-slate-300 transition-all"
            >
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
                  <div className="font-extrabold text-blue-900 text-sm">{t.priceFormatted}</div>
                  <div className="text-2xs text-slate-500">{t.duration}</div>
                </div>
              </div>

              <div className="space-y-3.5">
                {filteredDimensions.map((dim) => {
                  const Icon = dim.icon;
                  return (
                    <div key={dim.id} className="pt-2 border-t border-slate-100 first:border-0 first:pt-0">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1.5">
                        <Icon className={`w-3.5 h-3.5 ${dim.color}`} />
                        <span>{dim.name}</span>
                      </div>
                      <div className="pl-5">{dim.getValue(t)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
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
