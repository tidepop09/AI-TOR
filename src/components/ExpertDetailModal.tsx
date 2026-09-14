import React, { useState } from 'react';
import { TORDocument, ProjectExpert } from '../types';
import { getExpertProfile, evaluateExpertsSummary } from '../utils/expertUtils';
import {
  X,
  Award,
  Users,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Star,
  FileCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface ExpertDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tor: TORDocument | null;
  allTors?: TORDocument[];
  onSelectTor?: (tor: TORDocument) => void;
}

export const ExpertDetailModal: React.FC<ExpertDetailModalProps> = ({
  isOpen,
  onClose,
  tor,
  allTors = [],
  onSelectTor,
}) => {
  const [selectedExpertIndex, setSelectedExpertIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'experts' | 'company' | 'allComparison'>('experts');

  if (!isOpen || !tor) return null;

  const profile = getExpertProfile(tor);
  const summary = evaluateExpertsSummary(profile.experts);
  const currentExpert: ProjectExpert | undefined = profile.experts[selectedExpertIndex] || profile.experts[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-900 via-slate-900 to-indigo-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 border border-blue-400/30 rounded-xl">
              <Users className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-800 text-amber-300 text-xs font-bold font-mono">
                  {tor.code}
                </span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  {tor.badge}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                คณะผู้เชี่ยวชาญและวิศวกรประจำโครงการ (Project Key Specialists)
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                ผู้ยื่น: <span className="font-semibold text-white">{tor.vendor}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TOR Switcher if multiple available */}
        {allTors.length > 1 && onSelectTor && (
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="font-semibold text-slate-500 whitespace-nowrap">สลับดู TOR อื่น:</span>
            {allTors.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  onSelectTor(t);
                  setSelectedExpertIndex(0);
                }}
                className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  t.id === tor.id
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                <span>{t.code}</span>
                <span className="text-2xs opacity-80">({t.scores.expertise}/10)</span>
              </button>
            ))}
          </div>
        )}

        {/* Quick Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-slate-100/70 border-b border-slate-200 text-xs">
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-2xs text-slate-500 font-semibold block">จำนวนผู้เชี่ยวชาญ</span>
            <div className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
              <span>{summary.totalPersonnelCount} ท่าน</span>
              <span className="text-2xs px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded font-normal">
                (หลัก {summary.keyPersonnelCount})
              </span>
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-2xs text-slate-500 font-semibold block">ประสบการณ์เฉลี่ย</span>
            <div className="text-base font-bold text-emerald-700 mt-0.5">
              {summary.averageYears} ปี
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-2xs text-slate-500 font-semibold block">ใบรับรองวิชาชีพหลัก</span>
            <div className="text-xs font-bold text-indigo-900 mt-0.5 line-clamp-1">
              {summary.certificationsList.length} ใบรับรอง
              {summary.hasPmp && <span className="text-amber-600 ml-1">· PMP</span>}
              {summary.hasAiExpert && <span className="text-blue-600 ml-1">· AI</span>}
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-2xs text-slate-500 font-semibold block">คะแนนความพร้อมทีมงาน</span>
            <div className="text-base font-extrabold text-blue-900 mt-0.5 flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{tor.scores.expertise.toFixed(1)} / 10</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-5 gap-4 text-xs font-semibold bg-white">
          <button
            onClick={() => setActiveTab('experts')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'experts'
                ? 'border-blue-900 text-blue-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>ทำเนียบคณะผู้เชี่ยวชาญ ({profile.experts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('company')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'company'
                ? 'border-blue-900 text-blue-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>ประวัติบริษัทและมาตรฐาน ISO</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 bg-slate-50">
          {activeTab === 'experts' ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Expert List Sidebar */}
              <div className="md:col-span-5 space-y-2">
                <div className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>เลือกผู้เชี่ยวชาญเพื่อดูประวัติ:</span>
                  <span className="text-slate-400 text-2xs">{profile.experts.length} รายชื่อ</span>
                </div>
                {profile.experts.map((exp, idx) => {
                  const isSelected = idx === selectedExpertIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedExpertIndex(idx)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between ${
                        isSelected
                          ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <div className="space-y-1 pr-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-xs font-bold ${
                              isSelected ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {exp.name}
                          </span>
                          {exp.isKeyPersonnel && (
                            <span
                              className={`text-3xs px-1.5 py-0.5 rounded font-bold ${
                                isSelected
                                  ? 'bg-amber-400 text-slate-900'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              บุคลากรหลัก
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-2xs leading-snug line-clamp-1 ${
                            isSelected ? 'text-blue-100' : 'text-slate-600 font-medium'
                          }`}
                        >
                          {exp.role}
                        </p>
                        <div
                          className={`text-3xs flex items-center gap-2 ${
                            isSelected ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          <span>ประสบการณ์ {exp.experienceYears} ปี</span>
                          <span>·</span>
                          <span>{exp.certifications.length} Certs</span>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 mt-1 shrink-0 ${
                          isSelected ? 'text-amber-400' : 'text-slate-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Expert Full Detail Card */}
              <div className="md:col-span-7">
                {currentExpert && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                    <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900">
                            {currentExpert.name}
                          </h4>
                          {currentExpert.isKeyPersonnel && (
                            <span className="text-2xs bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Star className="w-3 h-3 fill-white" />
                              บุคลากรหลักโครงการ
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-blue-900 mt-1">
                          {currentExpert.role}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xs text-slate-400 block">ประสบการณ์ทำงาน</span>
                        <span className="text-lg font-black text-slate-900">
                          {currentExpert.experienceYears}{' '}
                          <span className="text-xs font-normal text-slate-500">ปี</span>
                        </span>
                      </div>
                    </div>

                    {/* Education */}
                    {currentExpert.education && (
                      <div className="space-y-1">
                        <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
                          วุฒิการศึกษา
                        </span>
                        <p className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          {currentExpert.education}
                        </p>
                      </div>
                    )}

                    {/* Certifications */}
                    <div className="space-y-1.5">
                      <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        ใบรับรองคุณวุฒิวิชาชีพ (Certificates & Credentials)
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentExpert.certifications && currentExpert.certifications.length > 0 ? (
                          currentExpert.certifications.map((cert, cIdx) => (
                            <span
                              key={cIdx}
                              className="text-xs bg-amber-50 text-amber-900 border border-amber-300 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                              {cert}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500">ไม่มีใบรับรองเฉพาะทาง</span>
                        )}
                      </div>
                    </div>

                    {/* Responsibilities */}
                    <div className="space-y-1">
                      <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-700" />
                        หน้าที่และความรับผิดชอบหลักในโครงการ
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                        {currentExpert.responsibilities}
                      </p>
                    </div>

                    {/* Compliance Note */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-2xs text-emerald-900 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">การตรวจสอบคุณสมบัติพัสดุ: </span>
                        ผู้ยื่นได้แนบสำเนาบัตรประจำตัว หนังสือรับรองการจ้างงาน และสำเนาประกาศนียบัตรวิชาชีพตรงตามเงื่อนไขที่กำหนดใน TOR
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Company & Standards Tab */
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-900" />
                  <span>ข้อมูลองค์กรและผลงานในอดีต (Track Record)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-2xs text-slate-500 block">ประสบการณ์ดำเนินกิจการ</span>
                    <span className="text-base font-bold text-slate-900 mt-1 block">
                      {profile.yearsInBusiness} ปี
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-2xs text-slate-500 block">โครงการที่แล้วเสร็จลักษณะใกล้เคียง</span>
                    <span className="text-base font-bold text-emerald-700 mt-1 block">
                      {profile.similarProjectsCount} โครงการ
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-2xs text-slate-500 block">ทุนจดทะเบียน</span>
                    <span className="text-base font-bold text-blue-900 mt-1 block">
                      {profile.registeredCapital || '10,000,000 บาท'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1">
                    รายละเอียดผลงานและโครงการอ้างอิง:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {profile.companyTrackRecord}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-purple-700" />
                    มาตรฐานสากลที่องค์กรได้รับการรับรอง (ISO Standards):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {profile.isoStandards.map((std, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-xs bg-purple-50 text-purple-900 border border-purple-200 px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                        {std}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-blue-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-700" />
                    ข้อวิเคราะห์ของ AI ด้านความเชี่ยวชาญของบริษัท:
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {profile.expertScoreReason || tor.scores.reasons.expertise}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="text-2xs text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-blue-800" />
            <span>ใช้ประกอบการพิจารณาคะแนนด้านเทคนิคและบุคลากร ตามระเบียบพัสดุฯ</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
