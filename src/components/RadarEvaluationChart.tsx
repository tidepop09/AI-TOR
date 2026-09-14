import React, { useState } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { TORDocument } from '../types';
import { Award, Clock, Users, Layers, Cpu, Coins, CheckCircle, Info } from 'lucide-react';

interface RadarEvaluationChartProps {
  tors: TORDocument[];
  onSelectTor?: (torId: string) => void;
}

const COLORS = [
  { stroke: '#2563eb', fill: '#3b82f6', fillOpacity: 0.25, name: 'น้ำเงิน' },
  { stroke: '#059669', fill: '#10b981', fillOpacity: 0.25, name: 'เขียว' },
  { stroke: '#d97706', fill: '#f59e0b', fillOpacity: 0.25, name: 'ส้ม' },
  { stroke: '#7c3aed', fill: '#8b5cf6', fillOpacity: 0.25, name: 'ม่วง' },
  { stroke: '#dc2626', fill: '#ef4444', fillOpacity: 0.25, name: 'แดง' },
];

export const RadarEvaluationChart: React.FC<RadarEvaluationChartProps> = ({ tors }) => {
  const [selectedTorId, setSelectedTorId] = useState<string>(tors[0]?.id || '');
  const [visibleTors, setVisibleTors] = useState<{ [id: string]: boolean }>(() => {
    const initial: { [id: string]: boolean } = {};
    tors.forEach((t) => (initial[t.id] = true));
    return initial;
  });

  const toggleTorVisibility = (id: string) => {
    setVisibleTors((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Prepare radar data across 5 required criteria
  const radarData = [
    {
      subject: 'ระยะเวลา (Duration)',
      fullMark: 10,
      icon: Clock,
      ...tors.reduce((acc, t) => {
        acc[t.id] = t.scores.duration;
        return acc;
      }, {} as any),
    },
    {
      subject: 'ความเชี่ยวชาญ (Expertise)',
      fullMark: 10,
      icon: Users,
      ...tors.reduce((acc, t) => {
        acc[t.id] = t.scores.expertise;
        return acc;
      }, {} as any),
    },
    {
      subject: 'ขอบเขต (Scope)',
      fullMark: 10,
      icon: Layers,
      ...tors.reduce((acc, t) => {
        acc[t.id] = t.scores.scope;
        return acc;
      }, {} as any),
    },
    {
      subject: 'เทคนิคที่นำมาใช้ (Technical)',
      fullMark: 10,
      icon: Cpu,
      ...tors.reduce((acc, t) => {
        acc[t.id] = t.scores.technical;
        return acc;
      }, {} as any),
    },
    {
      subject: 'ราคา (Price)',
      fullMark: 10,
      icon: Coins,
      ...tors.reduce((acc, t) => {
        acc[t.id] = t.scores.price;
        return acc;
      }, {} as any),
    },
  ];

  // Calculate total scores
  const scoreRankings = tors
    .map((t) => {
      const total =
        t.scores.duration +
        t.scores.expertise +
        t.scores.scope +
        t.scores.technical +
        t.scores.price;
      const average = total / 5;
      return {
        ...t,
        totalScore: total,
        avgScore: average,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);

  const activeTor = tors.find((t) => t.id === selectedTorId) || tors[0];

  return (
    <div className="space-y-6">
      {/* Top Banner explaining the 10-point 5 criteria evaluation */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900">
                การประเมินคะแนน TOR รูปแบบกราฟเรดาร์ (Radar Chart)
              </h2>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              ประเมินข้อละ 10 คะแนน รวม 5 เกณฑ์หลักตามที่กำหนด: ระยะเวลา • ความเชี่ยวชาญของบริษัทหรือทีมงาน • ขอบเขต • เทคนิคที่นำมาใช้ • ราคา
            </p>
          </div>

          {/* Visibility toggle pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500 mr-1">เลือกแสดงบนกราฟ:</span>
            {tors.map((t, idx) => {
              const color = COLORS[idx % COLORS.length];
              const isVisible = visibleTors[t.id] !== false;
              return (
                <button
                  key={t.id}
                  onClick={() => toggleTorVisibility(t.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                    isVisible
                      ? 'bg-slate-100 text-slate-800 border-slate-300'
                      : 'bg-white text-slate-400 border-slate-200 opacity-60'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: color.stroke }}
                  />
                  <span>{t.code}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Radar Chart + Score Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart Container */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                <span>แผนภาพเรดาร์เปรียบเทียบคะแนน (เต็ม 10 คะแนนต่อเกณฑ์)</span>
              </h3>
              <span className="text-xs text-slate-500">Scale: 0 - 10</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              คลิกที่จุดหรือเส้นบนแผนภูมิ หรือกดแท็บด้านขวาเพื่อดูคำอธิบายเหตุผลการให้คะแนนอย่างเป็นทางการ
            </p>
          </div>

          <div className="w-full h-84 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#334155', fontSize: 12, fontWeight: 500 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#94a3b8" />
                <Tooltip
                  formatter={(value: any, name: any) => {
                    const tor = tors.find((t) => t.id === name);
                    return [`${value} / 10 คะแนน`, tor ? `${tor.code} (${tor.badge})` : name];
                  }}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    borderColor: '#cbd5e1',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend
                  formatter={(value) => {
                    const tor = tors.find((t) => t.id === value);
                    return tor ? `${tor.code}` : value;
                  }}
                />
                {tors.map((t, idx) => {
                  if (visibleTors[t.id] === false) return null;
                  const color = COLORS[idx % COLORS.length];
                  return (
                    <Radar
                      key={t.id}
                      name={t.id}
                      dataKey={t.id}
                      stroke={color.stroke}
                      fill={color.fill}
                      fillOpacity={color.fillOpacity}
                      strokeWidth={2}
                    />
                  );
                })}
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
            <span>เกณฑ์ประเมินอิงข้อเท็จจริงในเอกสารเท่านั้น</span>
            <span>เกณฑ์ราคาคำนวณจากความสมเหตุสมผลของงบประมาณและขอบเขตงาน</span>
          </div>
        </div>

        {/* Score Rankings and Scorecards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="font-semibold text-slate-900 text-base mb-3 flex items-center justify-between">
              <span>สรุปอันดับคะแนนรวม (เต็ม 50 คะแนน)</span>
              <span className="text-xs font-normal text-slate-500">5 เกณฑ์ x 10 คะแนน</span>
            </h3>

            <div className="space-y-3">
              {scoreRankings.map((t, index) => {
                const isSelected = t.id === selectedTorId;
                const torIndex = tors.findIndex((item) => item.id === t.id);
                const color = COLORS[torIndex % COLORS.length];

                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTorId(t.id)}
                    className={`cursor-pointer p-3.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-blue-700 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0
                              ? 'bg-amber-100 text-amber-800'
                              : index === 1
                              ? 'bg-slate-200 text-slate-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {index + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block"
                              style={{ backgroundColor: color.stroke }}
                            />
                            <span className="font-bold text-slate-900 text-sm">{t.code}</span>
                            <span className="text-xs text-slate-500">({t.badge})</span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{t.title}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-extrabold text-blue-900">
                          {t.totalScore.toFixed(1)}{' '}
                          <span className="text-xs font-normal text-slate-500">/ 50</span>
                        </div>
                        <div className="text-xs text-slate-500">เฉลี่ย {t.avgScore.toFixed(1)} / 10</div>
                      </div>
                    </div>

                    {/* Progress Bar of Score */}
                    <div className="mt-2.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${(t.totalScore / 50) * 100}%`,
                          backgroundColor: color.stroke,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected TOR Detailed Score Breakdown & Grounded Reasons */}
      {activeTor && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {activeTor.code}
                </span>
                <h3 className="font-bold text-slate-900 text-base">{activeTor.title}</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                ผู้ยื่น: {activeTor.vendor} • วงเงิน: {activeTor.priceFormatted} • ระยะเวลา: {activeTor.duration}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">เลือกดูรายละเอียดฉบับอื่น:</span>
              <select
                value={activeTor.id}
                onChange={(e) => setSelectedTorId(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
              >
                {tors.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.code} - {t.badge}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-5">
            {/* 1. ระยะเวลา */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    1. ระยะเวลา
                  </span>
                  <span className="font-bold text-sm text-blue-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {activeTor.scores.duration} / 10
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-2.5 leading-relaxed">
                  {activeTor.scores.reasons.duration}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/60 text-2xs text-slate-500 font-medium">
                กำหนด: {activeTor.duration}
              </div>
            </div>

            {/* 2. ความเชี่ยวชาญ */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    2. ความเชี่ยวชาญ
                  </span>
                  <span className="font-bold text-sm text-emerald-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {activeTor.scores.expertise} / 10
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-2.5 leading-relaxed">
                  {activeTor.scores.reasons.expertise}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/60 text-2xs text-slate-500 font-medium">
                เกณฑ์ผลงาน & บุคลากร
              </div>
            </div>

            {/* 3. ขอบเขต */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                    3. ขอบเขต
                  </span>
                  <span className="font-bold text-sm text-amber-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {activeTor.scores.scope} / 10
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-2.5 leading-relaxed">
                  {activeTor.scores.reasons.scope}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/60 text-2xs text-slate-500 font-medium">
                ความสมบูรณ์ของจุดตรวจ & ฟังก์ชัน
              </div>
            </div>

            {/* 4. เทคนิค */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-purple-600" />
                    4. เทคนิคที่ใช้
                  </span>
                  <span className="font-bold text-sm text-purple-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {activeTor.scores.technical} / 10
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-2.5 leading-relaxed">
                  {activeTor.scores.reasons.technical}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/60 text-2xs text-slate-500 font-medium">
                สถาปัตยกรรม & ความแม่นยำ AI
              </div>
            </div>

            {/* 5. ราคา */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-indigo-600" />
                    5. ราคา
                  </span>
                  <span className="font-bold text-sm text-indigo-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {activeTor.scores.price} / 10
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-2.5 leading-relaxed">
                  {activeTor.scores.reasons.price}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/60 text-2xs text-slate-500 font-medium">
                งบประมาณ: {activeTor.priceFormatted}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
