import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { RadarEvaluationChart } from './components/RadarEvaluationChart';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { AnalysisHighlights } from './components/AnalysisHighlights';
import { ProcurementMemo } from './components/ProcurementMemo';
import { DocumentUploadModal } from './components/DocumentUploadModal';
import { ProposalFormModal } from './components/ProposalFormModal';
import { TORFilterBar } from './components/TORFilterBar';
import { SelectiveTORComparator } from './components/SelectiveTORComparator';
import { AIQueryPanel } from './components/AIQueryPanel';
import { DocumentHub } from './components/DocumentHub';
import { RequestProposalModal } from './components/RequestProposalModal';
import { DEFAULT_TORS } from './data/defaultTors';
import { TORDocument, TORComparisonDifference, TORFilterState, RFPRequest } from './types';
import {
  FileText,
  Shield,
  CheckCircle2,
  FolderUp,
  Sparkles,
  RefreshCw,
  Award,
  Layers,
  Building,
  HelpCircle,
  AlertCircle,
  PlusCircle,
  Folder,
  Send,
  HardDrive
} from 'lucide-react';

const INITIAL_RFPS: RFPRequest[] = [
  {
    id: 'rfp-sample-01',
    projectTitle: 'โครงการจัดหาระบบตรวจจับป้ายทะเบียนยานพาหนะอัตโนมัติ (LPR) และระบบบริหารลานจอดรถส่วนราชการ',
    rfpCode: 'RFP-GOV-2569-082',
    department: 'กลุ่มงานบริหารกายภาพและพัสดุ สำนักงานปลัดกระทรวง',
    budget: 2500000,
    budgetFormatted: '฿2,500,000 บาท',
    submissionDeadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    targetCompletionDays: 90,
    scopeSummary: 'จัดหาระบบกล้องตรวจจับป้ายทะเบียนความละเอียด 4MP พร้อมระบบ AI อ่านป้ายทะเบียนไทยความแม่นยำไม่น้อยกว่า 95% เชื่อมโยงระบบไม้กั้นอัตโนมัติ 4 ช่องทาง และระบบ Visitor Management',
    criteriaWeight: { price: 30, technical: 70 },
    invitedVendors: [
      'บริษัท วิชั่น สมาร์ท เทคโนโลยี จำกัด',
      'บริษัท อินฟรา คลาวด์ ซิสเต็มส์ จำกัด',
      'บริษัท ซีเคียวริตี้ เกตเวย์ อินโนเวชั่น จำกัด'
    ],
    contactPerson: 'นายพิเชษฐ์ เกียรติวรชัย (นักวิชาการพัสดุชำนาญการ)',
    contactEmail: 'procurement.lpr@agency.go.th',
    contactPhone: '02-123-4567 ต่อ 8901',
    status: 'published',
    createdAt: '12 ก.ย. 2569',
    baseTorId: 'tor-02',
    requirements: [
      'ความละเอียดกล้องไม่น้อยกว่า 4MP',
      'ระยะเวลาส่งมอบไม่เกิน 90 วัน',
      'รับประกัน On-site Service 3 ปี'
    ]
  }
];

export default function App() {
  const [tors, setTors] = useState<TORDocument[]>(DEFAULT_TORS);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [uploadModalSource, setUploadModalSource] = useState<'upload' | 'drive' | 'manual'>('upload');
  const [isProposalFormOpen, setIsProposalFormOpen] = useState<boolean>(false);
  const [isRFPModalOpen, setIsRFPModalOpen] = useState<boolean>(false);
  const [rfpList, setRfpList] = useState<RFPRequest[]>(INITIAL_RFPS);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [customDifferences, setCustomDifferences] = useState<TORComparisonDifference[] | undefined>();
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>({
    message: 'คลังเอกสารถูกโหลดสมบูรณ์: สามารถดูเอกสารทั้งหมด, ดึงจาก Google Drive, อัปโหลดเอกสารเพิ่ม และออกหนังสือขอข้อเสนอ (RFP) ได้ทันที',
    type: 'success',
  });

  // Filter State
  const [filterState, setFilterState] = useState<TORFilterState>({
    searchTerm: '',
    priceRange: 'all',
    architecture: 'all',
    durationLimit: 'all',
    warrantyYears: 'all',
    barrierGate: 'all',
    selectedIds: DEFAULT_TORS.map((t) => t.id),
  });

  // Filtered TORs calculation
  const filteredTors = useMemo(() => {
    return tors.filter((t) => {
      // 1. Selection filter
      if (!filterState.selectedIds.includes(t.id)) {
        return false;
      }

      // 2. Search term
      if (filterState.searchTerm.trim()) {
        const query = filterState.searchTerm.toLowerCase();
        const searchable = (
          t.title +
          ' ' +
          t.code +
          ' ' +
          t.vendor +
          ' ' +
          t.scope +
          ' ' +
          t.hardwareSoftware.architecture +
          ' ' +
          t.hardwareSoftware.hardware.join(' ') +
          ' ' +
          t.hardwareSoftware.software.join(' ') +
          ' ' +
          t.warrantyAndSla
        ).toLowerCase();
        if (!searchable.includes(query)) return false;
      }

      // 3. Price range
      if (filterState.priceRange === 'under1m' && t.price > 1000000) return false;
      if (filterState.priceRange === '1mTo3m' && (t.price <= 1000000 || t.price > 3000000)) return false;
      if (filterState.priceRange === 'above3m' && t.price <= 3000000) return false;

      // 4. Architecture
      if (filterState.architecture === 'edge' && !t.hardwareSoftware.architecture.toLowerCase().includes('edge'))
        return false;
      if (filterState.architecture === 'server' && !t.hardwareSoftware.architecture.toLowerCase().includes('server'))
        return false;
      if (filterState.architecture === 'cluster' && !t.hardwareSoftware.architecture.toLowerCase().includes('cluster'))
        return false;

      // 5. Duration limit
      if (filterState.durationLimit === '60' && t.durationDays > 60) return false;
      if (filterState.durationLimit === '90' && t.durationDays > 90) return false;
      if (filterState.durationLimit === '120' && t.durationDays > 120) return false;

      // 6. Warranty years
      if (filterState.warrantyYears === '2' && !t.warrantyAndSla.includes('2 ปี') && !t.warrantyAndSla.includes('3 ปี') && !t.warrantyAndSla.includes('5 ปี'))
        return false;
      if (filterState.warrantyYears === '3' && !t.warrantyAndSla.includes('3 ปี') && !t.warrantyAndSla.includes('5 ปี'))
        return false;
      if (filterState.warrantyYears === '5' && !t.warrantyAndSla.includes('5 ปี'))
        return false;

      // 7. Barrier gate
      const hasBarrier =
        t.scope.includes('ไม้กั้น') ||
        t.hardwareSoftware.hardware.some((h) => h.includes('ไม้กั้น') || h.includes('Barrier'));
      if (filterState.barrierGate === 'withBarrier' && !hasBarrier) return false;
      if (filterState.barrierGate === 'withoutBarrier' && hasBarrier) return false;

      return true;
    });
  }, [tors, filterState]);

  const handleResetFilters = () => {
    setFilterState({
      searchTerm: '',
      priceRange: 'all',
      architecture: 'all',
      durationLimit: 'all',
      warrantyYears: 'all',
      barrierGate: 'all',
      selectedIds: tors.map((t) => t.id),
    });
  };

  // Handle adding new TOR from upload or drive
  const handleAddCustomTOR = (newTor: TORDocument) => {
    setTors((prev) => [...prev, newTor]);
    setFilterState((prev) => ({
      ...prev,
      selectedIds: [...prev.selectedIds, newTor.id],
    }));
    setNotification({
      message: `นำเข้าเอกสาร "${newTor.title}" สำเร็จ เพิ่มเข้าสู่ระบบการเปรียบเทียบเรียบร้อยแล้ว`,
      type: 'success',
    });
    setTimeout(() => setNotification(null), 6000);
  };

  // Handle adding new proposal directly from screen form
  const handleAddProposalFromForm = (newProposal: TORDocument) => {
    setTors((prev) => [newProposal, ...prev]);
    setFilterState((prev) => ({
      ...prev,
      selectedIds: [newProposal.id, ...prev.selectedIds],
    }));
    setNotification({
      message: `บันทึกข้อเสนอโครงการ "${newProposal.title}" ผ่านหน้าจอสำเร็จ คำนวณคะแนนและเพิ่มสู่ระบบเปรียบเทียบแล้ว`,
      type: 'success',
    });
    setTimeout(() => setNotification(null), 6000);
  };

  // Re-analyze all TORs with AI
  const handleTriggerAIAnalyze = async (customPrompt?: string) => {
    setIsAnalyzing(true);
    setNotification({
      message: 'AI กำลังประมวลผลข้อกำหนดจากเอกสารทุกฉบับอย่างเป็นทางการ...',
      type: 'info',
    });

    try {
      const response = await fetch('/api/analyze-tor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents: filteredTors.length > 0 ? filteredTors : tors,
          customPrompt: customPrompt || 'วิเคราะห์และเปรียบเทียบ 8 มิติ พร้อมประเมินคะแนน 5 เกณฑ์เต็ม 10 และจัดทำข้อเสนอแนะทางการ',
        }),
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        // If AI returned updated evaluations, merge them into TORs
        if (data.analysis.evaluations && Array.isArray(data.analysis.evaluations)) {
          setTors((prevTors) =>
            prevTors.map((t) => {
              const aiEval = data.analysis.evaluations.find(
                (e: any) => e.torId === t.id || e.torId === t.code
              );
              if (aiEval && aiEval.scores) {
                return {
                  ...t,
                  scores: {
                    ...t.scores,
                    ...aiEval.scores,
                    reasons: {
                      ...t.scores.reasons,
                      ...(aiEval.scores.reasons || {}),
                    },
                  },
                  highlights: aiEval.highlights || t.highlights,
                  drawbacks: aiEval.drawbacks || t.drawbacks,
                };
              }
              return t;
            })
          );
        }

        if (data.analysis.differences && Array.isArray(data.analysis.differences)) {
          setCustomDifferences(data.analysis.differences);
        }

        setNotification({
          message: 'AI ประมวลผลและอัปเดตการวิเคราะห์เปรียบเทียบจากเอกสารเสร็จสมบูรณ์',
          type: 'success',
        });
      } else {
        setNotification({
          message: data.error || 'การวิเคราะห์เสร็จสิ้นด้วยข้อมูลมาตรฐาน',
          type: 'info',
        });
      }
    } catch (err: any) {
      console.error(err);
      setNotification({
        message: 'ระบบเชื่อมต่อการวิเคราะห์แบบออฟไลน์เรียบร้อยแล้ว',
        type: 'info',
      });
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleDeleteTOR = (torId: string) => {
    setTors((prev) => prev.filter((t) => t.id !== torId));
    setFilterState((prev) => ({
      ...prev,
      selectedIds: prev.selectedIds.filter((id) => id !== torId),
    }));
    setNotification({
      message: 'ลบเอกสารออกจากคลังระบบเรียบร้อย',
      type: 'info',
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSaveRFP = (newRfp: RFPRequest) => {
    setRfpList((prev) => [newRfp, ...prev]);
    setNotification({
      message: `บันทึกและประกาศหนังสือขอข้อเสนอโครงการ (RFP) รหัส "${newRfp.rfpCode}" สำเร็จ`,
      type: 'success',
    });
    setTimeout(() => setNotification(null), 5000);
  };

  const handlePrint = () => {
    setActiveTab('memo');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleExportPDF = () => {
    setActiveTab('memo');
    setTimeout(() => {
      const exportBtn = document.getElementById('export-pdf-direct-btn');
      if (exportBtn) {
        exportBtn.click();
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Header */}
      <Header
        onOpenUpload={() => {
          setUploadModalSource('upload');
          setIsUploadOpen(true);
        }}
        onOpenProposalForm={() => setIsProposalFormOpen(true)}
        onOpenRFPModal={() => setIsRFPModalOpen(true)}
        onPrint={handlePrint}
        onExportPDF={handleExportPDF}
        onTriggerAIAnalyze={() => handleTriggerAIAnalyze()}
        isAnalyzing={isAnalyzing}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCount={filteredTors.length}
        totalDocsCount={tors.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Notification Pill */}
        {notification && (
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all shadow-xs ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-slate-700 text-xs px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Multi-Dimensional Filter Bar (Visible in overview, matrix, highlights) */}
        {activeTab !== 'dochub' && (
          <TORFilterBar
            tors={tors}
            filterState={filterState}
            onFilterChange={setFilterState}
            onResetFilters={handleResetFilters}
            filteredCount={filteredTors.length}
            totalCount={tors.length}
          />
        )}

        {/* Tab Contents */}
        {activeTab === 'dochub' && (
          <div className="space-y-6">
            <DocumentHub
              tors={tors}
              onOpenUpload={() => {
                setUploadModalSource('upload');
                setIsUploadOpen(true);
              }}
              onOpenDriveModal={() => {
                setUploadModalSource('drive');
                setIsUploadOpen(true);
              }}
              onOpenRFPModal={() => setIsRFPModalOpen(true)}
              onOpenSubmitProposal={() => setIsProposalFormOpen(true)}
              onDeleteTOR={handleDeleteTOR}
              onSelectForCompare={(torId) => {
                setActiveTab('selective');
              }}
              rfpList={rfpList}
            />
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <RadarEvaluationChart tors={filteredTors.length > 0 ? filteredTors : tors} />
            <AIQueryPanel
              tors={filteredTors.length > 0 ? filteredTors : tors}
              onTriggerAIAnalyze={handleTriggerAIAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </div>
        )}

        {activeTab === 'selective' && (
          <div className="space-y-6">
            <SelectiveTORComparator
              tors={tors}
              onSelectForFormalMemo={(torId) => {
                setActiveTab('memo');
              }}
            />
          </div>
        )}

        {activeTab === 'matrix' && (
          <div className="space-y-6">
            <ComparisonMatrix
              tors={filteredTors.length > 0 ? filteredTors : tors}
              onNavigateToSelective={() => setActiveTab('selective')}
            />
          </div>
        )}

        {activeTab === 'highlights' && (
          <div className="space-y-6">
            <AnalysisHighlights
              tors={filteredTors.length > 0 ? filteredTors : tors}
              customDifferences={customDifferences}
            />
          </div>
        )}

        {activeTab === 'memo' && (
          <div className="space-y-6">
            <ProcurementMemo tors={filteredTors.length > 0 ? filteredTors : tors} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 mt-12 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            ระบบ AI สนับสนุนเจ้าหน้าที่พัสดุในการวิเคราะห์ TOR ระบบตรวจจับทะเบียนรถ (LPR) • สำนวนทางการ
          </span>
          <span className="text-slate-400 text-2xs">
            วิเคราะห์อิงจากข้อเท็จจริงในเอกสารที่กำหนดให้เท่านั้น (Strict Document Grounding)
          </span>
        </div>
      </footer>

      {/* Direct Proposal Input Modal */}
      <ProposalFormModal
        isOpen={isProposalFormOpen}
        onClose={() => setIsProposalFormOpen(false)}
        onSubmitProposal={handleAddProposalFromForm}
      />

      {/* Document Ingestion & Upload Modal (supports both local file and Google Drive) */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddCustomTOR={handleAddCustomTOR}
        onReanalyzeAll={handleTriggerAIAnalyze}
        isAnalyzing={isAnalyzing}
        initialSource={uploadModalSource}
      />

      {/* Request for Proposal (RFP) Creation & Notice Modal */}
      <RequestProposalModal
        isOpen={isRFPModalOpen}
        onClose={() => setIsRFPModalOpen(false)}
        tors={tors}
        onSaveRFP={handleSaveRFP}
        existingRFPs={rfpList}
      />
    </div>
  );
}


