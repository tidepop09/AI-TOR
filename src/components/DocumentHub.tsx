import React, { useState } from 'react';
import {
  Folder,
  FileText,
  Upload,
  HardDrive,
  Send,
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  Download,
  Copy,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowUpDown,
  Building,
  Calendar,
  DollarSign,
  ShieldCheck,
  Cpu,
  X,
  FileSpreadsheet,
  Link,
  ChevronRight
} from 'lucide-react';
import { TORDocument, RFPRequest } from '../types';

interface DocumentHubProps {
  tors: TORDocument[];
  onOpenUpload: () => void;
  onOpenDriveModal: () => void;
  onOpenProposalForm: () => void;
  onOpenRFPModal: (baseTorId?: string) => void;
  onDeleteTOR: (torId: string) => void;
  onSelectForCompare: (torId: string) => void;
  rfpList: RFPRequest[];
}

export const DocumentHub: React.FC<DocumentHubProps> = ({
  tors,
  onOpenUpload,
  onOpenDriveModal,
  onOpenProposalForm,
  onOpenRFPModal,
  onDeleteTOR,
  onSelectForCompare,
  rfpList,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'preset' | 'upload' | 'drive'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priceAsc' | 'priceDesc' | 'score'>('date');
  const [selectedDocForInspect, setSelectedDocForInspect] = useState<TORDocument | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter & Search Logic
  const filteredDocs = tors.filter((doc) => {
    if (sourceFilter !== 'all' && doc.source !== sourceFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchCode = doc.code.toLowerCase().includes(q);
      const matchVendor = doc.vendor.toLowerCase().includes(q);
      const matchScope = doc.scope.toLowerCase().includes(q);
      const matchArch = doc.hardwareSoftware.architecture.toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchVendor && !matchScope && !matchArch) {
        return false;
      }
    }
    return true;
  });

  // Sort
  const sortedDocs = [...filteredDocs].sort((a, b) => {
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    if (sortBy === 'score') {
      const scoreA =
        a.scores.duration + a.scores.expertise + a.scores.scope + a.scores.technical + a.scores.price;
      const scoreB =
        b.scores.duration + b.scores.expertise + b.scores.scope + b.scores.technical + b.scores.price;
      return scoreB - scoreA;
    }
    return 0; // default order
  });

  // Counts
  const driveCount = tors.filter((t) => t.source === 'drive').length;
  const uploadCount = tors.filter((t) => t.source === 'upload').length;
  const presetCount = tors.filter((t) => t.source === 'preset').length;

  const handleDownloadDoc = (doc: TORDocument) => {
    const content = `ข้อกำหนดโครงการและคุณลักษณะเฉพาะ (TOR)
รหัส: ${doc.code}
ชื่อโครงการ: ${doc.title}
ผู้เสนอราคา/ผู้ยื่น: ${doc.vendor}
วงเงินงบประมาณ: ${doc.priceFormatted}
ระยะเวลาดำเนินการ: ${doc.duration} (${doc.durationDays} วัน)
แหล่งที่มา: ${doc.source === 'drive' ? 'Google Drive' : doc.source === 'upload' ? 'อัปโหลดจากไฟล์' : 'มาตรฐานระบบ'}

1. ขอบเขตงาน (Scope of Work):
${doc.scope}

2. รายการครุภัณฑ์ฮาร์ดแวร์ (Hardware):
${doc.hardwareSoftware.hardware.map((h, i) => `  ${i + 1}. ${h}`).join('\n')}

3. รายการซอฟต์แวร์และใบอนุญาต (Software):
${doc.hardwareSoftware.software.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}

4. สถาปัตยกรรมระบบ (Architecture):
${doc.hardwareSoftware.architecture}
ความแม่นยำในการตรวจจับ: ${doc.hardwareSoftware.accuracy}
การจัดเก็บข้อมูล: ${doc.hardwareSoftware.storageAndNetwork}

5. การรับประกันและ SLA:
${doc.warrantyAndSla}

6. การส่งมอบงานและงวดงาน:
${doc.delivery}

7. คะแนนประเมินเรดาร์:
- ความคุ้มค่าราคา: ${doc.scores.price}/10 (${doc.scores.reasons.price})
- คุณลักษณะเทคนิค: ${doc.scores.technical}/10 (${doc.scores.reasons.technical})
- ขอบเขตงาน: ${doc.scores.scope}/10 (${doc.scores.reasons.scope})
- ระยะเวลาดำเนินการ: ${doc.scores.duration}/10 (${doc.scores.reasons.duration})
- คุณสมบัติผู้ยื่น: ${doc.scores.expertise}/10 (${doc.scores.reasons.expertise})
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.code}_Specification_Summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyRaw = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shadow-xs">
                <Folder className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>คลังเอกสารข้อกำหนดทั้งหมด (Document Hub & Drive)</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold">
                    {tors.length} ฉบับในระบบ
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  ศูนย์รวมเอกสาร TOR, ดึงไฟล์จาก Google Drive, อัปโหลดเอกสารใหม่, และออกหนังสือขอข้อเสนอโครงการ (RFP)
                </p>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="hub-upload-btn"
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-950 rounded-lg shadow-xs transition-colors"
            >
              <Upload className="w-4 h-4 text-amber-400" />
              <span>อัปโหลดเอกสารเพิ่ม</span>
            </button>

            <button
              id="hub-drive-btn"
              onClick={onOpenDriveModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors shadow-2xs"
            >
              <HardDrive className="w-4 h-4 text-emerald-700" />
              <span>ดึงจาก Google Drive</span>
            </button>

            <button
              id="hub-rfp-btn"
              onClick={() => onOpenRFPModal()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors shadow-2xs"
            >
              <Send className="w-4 h-4 text-amber-700" />
              <span>ขอข้อเสนอราคา (RFP)</span>
            </button>

            <button
              id="hub-proposal-form-btn"
              onClick={onOpenProposalForm}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 text-slate-600" />
              <span>กรอกข้อเสนอเอง</span>
            </button>
          </div>
        </div>

        {/* Source Breakdown Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div
            onClick={() => setSourceFilter('all')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              sourceFilter === 'all'
                ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-400'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="text-2xs font-medium text-slate-500">เอกสารทั้งหมด</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{tors.length} ฉบับ</div>
            <div className="text-3xs text-blue-700 font-semibold mt-1">พร้อมเปรียบเทียบในระบบ</div>
          </div>

          <div
            onClick={() => setSourceFilter('drive')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              sourceFilter === 'drive'
                ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="text-2xs font-medium text-slate-500 flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
              <span>จาก Google Drive</span>
            </div>
            <div className="text-xl font-bold text-emerald-900 mt-0.5">{driveCount} ฉบับ</div>
            <div className="text-3xs text-emerald-700 font-semibold mt-1">คลาวด์ไดร์ฟทางการ</div>
          </div>

          <div
            onClick={() => setSourceFilter('upload')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              sourceFilter === 'upload'
                ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-400'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="text-2xs font-medium text-slate-500 flex items-center gap-1">
              <Upload className="w-3.5 h-3.5 text-indigo-600" />
              <span>จากไฟล์ที่อัปโหลด</span>
            </div>
            <div className="text-xl font-bold text-indigo-900 mt-0.5">{uploadCount} ฉบับ</div>
            <div className="text-3xs text-indigo-700 font-semibold mt-1">สกัดด้วย AI (.docx / .pdf)</div>
          </div>

          <div
            onClick={() => onOpenRFPModal()}
            className="p-3 rounded-xl border bg-amber-50/40 border-amber-200 hover:bg-amber-50 cursor-pointer transition-all"
          >
            <div className="text-2xs font-medium text-amber-800 flex items-center gap-1">
              <Send className="w-3.5 h-3.5 text-amber-600" />
              <span>ประกาศขอข้อเสนอ (RFP)</span>
            </div>
            <div className="text-xl font-bold text-amber-950 mt-0.5">{rfpList.length} โครงการ</div>
            <div className="text-3xs text-amber-700 font-semibold mt-1">คลิกเพื่อดูหรือออกเพิ่ม</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อเอกสาร, รหัส, บริษัท, สเปก..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
          />
        </div>

        {/* Source Pills & Sort */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-2xs font-semibold text-slate-600">
            <button
              onClick={() => setSourceFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                sourceFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              ทั้งหมด ({tors.length})
            </button>
            <button
              onClick={() => setSourceFilter('drive')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                sourceFilter === 'drive' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Drive ({driveCount})
            </button>
            <button
              onClick={() => setSourceFilter('upload')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                sourceFilter === 'upload' ? 'bg-white text-indigo-800 shadow-2xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              ไฟล์อัปโหลด ({uploadCount})
            </button>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-2xs text-slate-500">เรียงตาม:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="text-2xs font-semibold border border-slate-300 rounded-lg p-1 bg-white text-slate-800 focus:outline-none"
            >
              <option value="date">ลำดับในระบบ</option>
              <option value="priceAsc">ราคา (น้อย ➔ มาก)</option>
              <option value="priceDesc">ราคา (มาก ➔ น้อย)</option>
              <option value="score">คะแนนประเมินรวม</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid List */}
      {sortedDocs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
          <Folder className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">ไม่พบเอกสารที่ตรงกับเงื่อนไขค้นหา</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            ลองปรับเปลี่ยนคำค้นหา หรือคลิก "อัปโหลดเอกสารเพิ่ม" หรือ "ดึงจาก Google Drive" เพื่อนำเอกสารเข้าสู่ระบบ
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedDocs.map((doc) => {
            const totalScore = (
              doc.scores.duration +
              doc.scores.expertise +
              doc.scores.scope +
              doc.scores.technical +
              doc.scores.price
            ).toFixed(1);

            return (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-3"
              >
                {/* Header info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                        {doc.code}
                      </span>
                      {doc.source === 'drive' && (
                        <span className="text-3xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <HardDrive className="w-2.5 h-2.5" />
                          <span>Google Drive</span>
                        </span>
                      )}
                      {doc.source === 'upload' && (
                        <span className="text-3xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 flex items-center gap-1">
                          <Upload className="w-2.5 h-2.5" />
                          <span>ไฟล์อัปโหลด</span>
                        </span>
                      )}
                      {doc.source === 'preset' && (
                        <span className="text-3xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          ต้นแบบระบบ
                        </span>
                      )}
                    </div>
                    <span className="text-2xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      ★ {totalScore} / 50
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {doc.title}
                  </h3>

                  <p className="text-2xs text-slate-500 line-clamp-1">
                    ผู้ยื่น: <span className="text-slate-700 font-semibold">{doc.vendor}</span>
                  </p>
                </div>

                {/* Scope snippet */}
                <p className="text-2xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg leading-relaxed">
                  {doc.scope}
                </p>

                {/* Quick specs pills */}
                <div className="grid grid-cols-2 gap-2 text-2xs py-1 border-t border-b border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-3xs">วงเงินงบประมาณ</span>
                    <span className="font-bold text-blue-900">{doc.priceFormatted}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-3xs">ระยะเวลาส่งมอบ</span>
                    <span className="font-bold text-slate-800">{doc.duration}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-3xs">สถาปัตยกรรม</span>
                    <span className="font-semibold text-slate-700 truncate block">
                      {doc.hardwareSoftware.architecture.split(' ')[0]}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-3xs">การรับประกัน</span>
                    <span className="font-semibold text-slate-700 truncate block">
                      {doc.warrantyAndSla.split(',')[0]}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1 gap-1.5">
                  <button
                    onClick={() => setSelectedDocForInspect(doc)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-2xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-700" />
                    <span>ดูสเปกเต็ม</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      title="ใช้เอกสารนี้เป็นฐานขอข้อเสนอราคา (RFP)"
                      onClick={() => onOpenRFPModal(doc.id)}
                      className="inline-flex items-center gap-1 px-2 py-1.5 text-2xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                    >
                      <Send className="w-3.5 h-3.5 text-amber-700" />
                      <span>ขอข้อเสนอ</span>
                    </button>

                    <button
                      title="ดาวน์โหลดสรุปข้อกำหนด"
                      onClick={() => handleDownloadDoc(doc)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete button (with confirmation) */}
                    {deleteConfirmId === doc.id ? (
                      <button
                        onClick={() => {
                          onDeleteTOR(doc.id);
                          setDeleteConfirmId(null);
                        }}
                        className="px-2 py-1 text-3xs font-bold bg-rose-600 text-white rounded hover:bg-rose-700 animate-pulse"
                      >
                        ยืนยันลบ
                      </button>
                    ) : (
                      <button
                        title="ลบเอกสารฉบับนี้"
                        onClick={() => setDeleteConfirmId(doc.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Document Inspector Modal */}
      {selectedDocForInspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-900 text-white flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                      {selectedDocForInspect.code}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm truncate max-w-md">
                      {selectedDocForInspect.title}
                    </h3>
                  </div>
                  <p className="text-2xs text-slate-500">
                    ผู้ยื่น: {selectedDocForInspect.vendor} | งบประมาณ:{' '}
                    {selectedDocForInspect.priceFormatted}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDocForInspect(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* Scope */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-800" />
                  <span>ขอบเขตงาน (Scope of Work):</span>
                </h4>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedDocForInspect.scope}
                </div>
              </div>

              {/* Hardware & Software Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-indigo-700" />
                    <span>รายการครุภัณฑ์ฮาร์ดแวร์ (Hardware):</span>
                  </h4>
                  <ul className="space-y-1 text-slate-700">
                    {selectedDocForInspect.hardwareSoftware.hardware.map((h, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-2xs">
                        <span className="text-blue-700 font-bold">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                    <span>รายการซอฟต์แวร์และสิทธิการใช้งาน:</span>
                  </h4>
                  <ul className="space-y-1 text-slate-700">
                    {selectedDocForInspect.hardwareSoftware.software.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-2xs">
                        <span className="text-emerald-700 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Architecture & Delivery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 bg-blue-50/50 p-3 rounded-xl border border-blue-200">
                  <span className="font-bold text-blue-900 block text-2xs">
                    สถาปัตยกรรมและเทคโนโลยี
                  </span>
                  <p className="text-2xs text-slate-700">
                    {selectedDocForInspect.hardwareSoftware.architecture}
                  </p>
                  <p className="text-3xs text-blue-800 font-semibold mt-1">
                    ความแม่นยำ: {selectedDocForInspect.hardwareSoftware.accuracy}
                  </p>
                </div>

                <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block text-2xs">
                    การส่งมอบและงวดงาน
                  </span>
                  <p className="text-2xs text-slate-700">{selectedDocForInspect.delivery}</p>
                  <p className="text-3xs text-slate-500 mt-1">
                    ระยะเวลา: {selectedDocForInspect.duration}
                  </p>
                </div>
              </div>

              {/* Warranty and SLA */}
              <div className="space-y-1 bg-emerald-50/50 p-3 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-2xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>การรับประกันและ SLA (Service Level Agreement):</span>
                </span>
                <p className="text-2xs text-slate-700">{selectedDocForInspect.warrantyAndSla}</p>
              </div>

              {/* Raw text if available */}
              {selectedDocForInspect.rawText && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-2xs">
                      ข้อความต้นฉบับที่สกัดจากเอกสาร / Google Drive:
                    </span>
                    <button
                      onClick={() => handleCopyRaw(selectedDocForInspect.rawText || '')}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-3xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedText ? 'คัดลอกแล้ว' : 'คัดลอกข้อความ'}</span>
                    </button>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 max-h-36 overflow-y-auto text-3xs font-mono text-slate-600 whitespace-pre-wrap leading-relaxed">
                    {selectedDocForInspect.rawText}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => handleDownloadDoc(selectedDocForInspect)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>ดาวน์โหลดข้อกำหนดสรุป (.txt)</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onOpenRFPModal(selectedDocForInspect.id);
                    setSelectedDocForInspect(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-amber-700" />
                  <span>ใช้เป็นฐานขอข้อเสนอ (RFP)</span>
                </button>

                <button
                  onClick={() => setSelectedDocForInspect(null)}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-950 rounded-lg transition-colors"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
