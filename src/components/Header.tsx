import React from 'react';
import { Shield, FileCheck2, Printer, Sparkles, FolderUp, RefreshCw, Scale, PlusCircle, Download, Folder, Send, HardDrive } from 'lucide-react';

interface HeaderProps {
  onOpenUpload: () => void;
  onOpenProposalForm: () => void;
  onOpenRFPModal: () => void;
  onPrint: () => void;
  onExportPDF: () => void;
  onTriggerAIAnalyze: () => void;
  isAnalyzing: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCount: number;
  totalDocsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenUpload,
  onOpenProposalForm,
  onOpenRFPModal,
  onPrint,
  onExportPDF,
  onTriggerAIAnalyze,
  isAnalyzing,
  activeTab,
  setActiveTab,
  selectedCount,
  totalDocsCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top bar with government emblem tone */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium">ระบบงานพัสดุภาครัฐ (e-Procurement AI Assistant)</span>
            <span className="text-slate-400 hidden md:inline">| อ้างอิงระเบียบกระทรวงการคลัง พ.ศ. 2560</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <span className="text-xs bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">
              วิเคราะห์เฉพาะข้อมูลในเอกสาร (Grounding Only)
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-blue-900 text-white flex items-center justify-center shadow-xs shrink-0">
              <Scale className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                  ระบบ AI วิเคราะห์และเปรียบเทียบ TOR
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                  ระบบตรวจจับทะเบียนรถ (LPR)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                เปรียบเทียบคุณลักษณะเฉพาะ 8 ประเด็น • ประเมินคะแนนกราฟเรดาร์ • จัดทำข้อเสนอแนะทางการ
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 no-print">
            <button
              id="request-proposal-header-btn"
              onClick={onOpenRFPModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors shadow-2xs"
              title="สร้างและออกหนังสือเชิญชวนยื่นข้อเสนอโครงการ (RFP)"
            >
              <Send className="w-4 h-4 text-amber-700" />
              <span>ขอข้อเสนอราคา (RFP)</span>
            </button>

            <button
              id="upload-btn"
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <FolderUp className="w-4 h-4 text-blue-700" />
              <span>นำเข้าไฟล์ / Drive</span>
            </button>

            <button
              id="proposal-form-btn"
              onClick={onOpenProposalForm}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors shadow-2xs"
            >
              <PlusCircle className="w-4 h-4 text-emerald-700" />
              <span>ยื่นข้อเสนอผ่านหน้าจอ</span>
            </button>

            <button
              id="reanalyze-btn"
              onClick={onTriggerAIAnalyze}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 active:bg-blue-950 disabled:opacity-50 rounded-lg transition-colors shadow-xs"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>AI กำลังวิเคราะห์...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>วิเคราะห์ด้วย AI</span>
                </>
              )}
            </button>

            <button
              id="export-pdf-header-btn"
              onClick={onExportPDF}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-xs"
              title="ส่งออกรายงานผลการวิเคราะห์เปรียบเทียบ TOR เป็นไฟล์ PDF สำหรับคณะกรรมการตรวจรับพัสดุ"
            >
              <Download className="w-4 h-4 text-slate-900" />
              <span>ส่งออก PDF คณะกรรมการ</span>
            </button>

            <button
              id="print-btn"
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="พิมพ์เอกสารราชการ"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">พิมพ์</span>
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1.5 mt-3 border-b border-slate-200 overflow-x-auto no-print">
          <button
            id="tab-overview"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-800 text-blue-900 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            📊 ภาพรวมและกราฟเรดาร์ (Radar Score)
          </button>
          <button
            id="tab-dochub"
            onClick={() => setActiveTab('dochub')}
            className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-1 ${
              activeTab === 'dochub'
                ? 'border-blue-800 text-blue-900 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <span>📁 คลังเอกสารทั้งหมดและไดร์ฟ</span>
            <span className={`px-1.5 py-0.2 rounded-full text-3xs font-bold ${
              activeTab === 'dochub' ? 'bg-blue-200 text-blue-950' : 'bg-slate-200 text-slate-700'
            }`}>
              {totalDocsCount}
            </span>
          </button>
          <button
            id="tab-selective"
            onClick={() => setActiveTab('selective')}
            className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'selective'
                ? 'border-blue-800 text-blue-900 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            ⚖️ เปรียบเทียบเฉพาะฉบับ (เลือกคู่เทียบเอง)
          </button>
          <button
            id="tab-matrix"
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'matrix'
                ? 'border-blue-800 text-blue-900 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            📋 ตารางเปรียบเทียบ 8 มิติ ({selectedCount} ฉบับ)
          </button>
          <button
            id="tab-highlights"
            onClick={() => setActiveTab('highlights')}
            className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'highlights'
                ? 'border-blue-800 text-blue-900 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            🔍 ความเหมือน-ต่าง จุดเด่น-ด้อย
          </button>
          <button
            id="tab-memo"
            onClick={() => setActiveTab('memo')}
            className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'memo'
                ? 'border-blue-800 text-blue-900 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            📑 บันทึกข้อความเสนอคณะกรรมการตรวจรับพัสดุ
          </button>
        </div>
      </div>
    </header>
  );
};

