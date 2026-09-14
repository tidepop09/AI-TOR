import React, { useState } from 'react';
import {
  X,
  Send,
  FileText,
  Building,
  Calendar,
  DollarSign,
  CheckCircle2,
  Copy,
  Printer,
  Sparkles,
  Layers,
  Scale,
  Clock,
  ShieldCheck,
  UserCheck,
  ChevronRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { TORDocument, RFPRequest } from '../types';

interface RequestProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  tors: TORDocument[];
  onSaveRFP: (rfp: RFPRequest) => void;
  rfpList: RFPRequest[];
  onOpenSubmitForRFP?: (rfp: RFPRequest) => void;
}

export const RequestProposalModal: React.FC<RequestProposalModalProps> = ({
  isOpen,
  onClose,
  tors,
  onSaveRFP,
  rfpList,
  onOpenSubmitForRFP,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [selectedBaseTorId, setSelectedBaseTorId] = useState<string>(tors[0]?.id || '');
  
  // Form State
  const [projectTitle, setProjectTitle] = useState('โครงการจัดหาระบบตรวจจับป้ายทะเบียนยานพาหนะอัตโนมัติ (LPR) และระบบบริหารลานจอด');
  const [rfpCode, setRfpCode] = useState(`RFP-GOV-${new Date().getFullYear() + 543}-${Math.floor(100 + Math.random() * 900)}`);
  const [department, setDepartment] = useState('กองพัสดุและบริหารสินทรัพย์ ฝ่ายเทคโนโลยีสารสนเทศ');
  const [budget, setBudget] = useState(2500000);
  const [submissionDeadline, setSubmissionDeadline] = useState(
    new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
  );
  const [targetCompletionDays, setTargetCompletionDays] = useState(90);
  const [priceWeight, setPriceWeight] = useState(30);
  const [technicalWeight, setTechnicalWeight] = useState(70);
  const [contactPerson, setContactPerson] = useState('นายพิเชษฐ์ เกียรติวรชัย (นักวิชาการพัสดุชำนาญการ)');
  const [contactEmail, setContactEmail] = useState('procurement.it@agency.go.th');
  const [contactPhone, setContactPhone] = useState('02-123-4567 ต่อ 8901');
  const [invitedVendorsText, setInvitedVendorsText] = useState(
    'บริษัท สมาร์ท วิสัยทัศน์ จำกัด\nบริษัท ซีเคียวริตี้ ซิสเต็มส์ เอ็นจิเนียริ่ง จำกัด\nบริษัท ดิจิทัล อินโนเวชั่น ซัพพลาย จำกัด'
  );
  const [scopeSummary, setScopeSummary] = useState(
    'จัดหาและติดตั้งระบบกล้องตรวจจับป้ายทะเบียนรถยนต์ความละเอียดไม่ต่ำกว่า 4MP พร้อมระบบ AI อ่านป้ายทะเบียนไทยความแม่นยำไม่น้อยกว่า 95% เชื่อมต่อระบบไม้กั้นอัตโนมัติ 4 ช่องทาง พร้อมระบบ Visitor QR Code และการรับประกัน On-site Service 3 ปี'
  );

  const [copied, setCopied] = useState(false);
  const [justPublishedRfp, setJustPublishedRfp] = useState<RFPRequest | null>(null);

  if (!isOpen) return null;

  // Handle Base TOR change
  const handleBaseTorChange = (torId: string) => {
    setSelectedBaseTorId(torId);
    const found = tors.find((t) => t.id === torId);
    if (found) {
      setProjectTitle(`หนังสือขอข้อเสนอโครงการ: ${found.title}`);
      setBudget(found.price || 2000000);
      setTargetCompletionDays(found.durationDays || 90);
      setScopeSummary(
        `อ้างอิงกรอบขอบเขตงาน (${found.code}): ${found.scope.slice(0, 300)}... ครุภัณฑ์ประกอบด้วย ${found.hardwareSoftware.hardware.slice(0, 3).join(', ')} สถาปัตยกรรม ${found.hardwareSoftware.architecture}`
      );
    }
  };

  // Generate Official Invitation Memo Text
  const generateOfficialNoticeText = () => {
    const vendors = invitedVendorsText
      .split('\n')
      .map((v) => v.trim())
      .filter(Boolean);

    return `บันทึกข้อความ / หนังสือเชิญชวนยื่นข้อเสนอราคาและข้อกำหนดทางเทคนิค (RFP)
เลขที่หนังสือ: ${rfpCode}
หน่วยงาน: ${department}
วันที่: ${new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
เรื่อง: ขอเชิญยื่นข้อเสนอโครงการ "${projectTitle}"
เรียน: กรรมการผู้จัดการ / ผู้มีอำนาจลงนาม
      ${vendors.join(', ')}

ด้วย ${department} มีความประสงค์จะดำเนินการจัดหาโครงการ "${projectTitle}"
เพื่อเพิ่มประสิทธิภาพการรักษาความปลอดภัย การตรวจสอบยานพาหนะเข้า-ออก และการบริหารจัดการพื้นที่ส่วนราชการ

ในการนี้ จึงขอเรียนเชิญท่านยื่นข้อเสนอทางเทคนิคและข้อเสนอด้านราคา โดยมีรายละเอียดเบื้องต้นดังนี้:
๑. วงเงินงบประมาณราคากลาง: ฿${budget.toLocaleString()} บาท (${numberToThaiBaht(budget)})
๒. ระยะเวลาดำเนินการส่งมอบ: ภายใน ${targetCompletionDays} วัน นับถัดจากวันลงนามในสัญญา
๓. ขอบเขตและคุณลักษณะขั้นต่ำ (Minimum Scope & Technical Specifications):
   ${scopeSummary}
๔. เกณฑ์การพิจารณาคัดเลือก (Evaluation Criteria):
   - เกณฑ์ด้านราคาและความคุ้มค่า: ร้อยละ ${priceWeight} (${priceWeight} คะแนน)
   - เกณฑ์ด้านเทคนิค สเปก และประสบการณ์: ร้อยละ ${technicalWeight} (${technicalWeight} คะแนน)
๕. กำหนดยื่นข้อเสนอ: ภายในวันที่ ${new Date(submissionDeadline).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })} เวลา ๑๖.๓๐ น.
๖. ข้อมูลการติดต่อประสานงาน:
   ผู้ประสานงาน: ${contactPerson}
   โทรศัพท์: ${contactPhone}
   อีเมล: ${contactEmail}

จึงเรียนมาเพื่อโปรดพิจารณาจัดทำและยื่นข้อเสนอตามวันและเวลาดังกล่าว

(ลงนาม)....................................................
(${contactPerson})
ประธานคณะกรรมการจัดทำร่างขอบเขตงานและกำหนดราคากลาง`;
  };

  const handleCopyNotice = () => {
    navigator.clipboard.writeText(generateOfficialNoticeText());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrintNotice = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${rfpCode} - หนังสือขอข้อเสนอราคา</title>
          <style>
            body { font-family: 'Sarabun', 'TH Sarabun New', sans-serif; padding: 40px; line-height: 1.6; color: #000; }
            pre { font-family: inherit; white-space: pre-wrap; font-size: 14pt; }
            .header { text-align: center; font-weight: bold; font-size: 16pt; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">ครุฑ (ตราสัญลักษณ์ส่วนราชการ)<br>หนังสือเชิญชวนยื่นข้อเสนอโครงการ (RFP)</div>
          <pre>${generateOfficialNoticeText()}</pre>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const handlePublishRFP = (e: React.FormEvent) => {
    e.preventDefault();
    const vendors = invitedVendorsText
      .split('\n')
      .map((v) => v.trim())
      .filter(Boolean);

    const newRfp: RFPRequest = {
      id: 'rfp-' + Date.now(),
      projectTitle,
      rfpCode,
      department,
      budget,
      budgetFormatted: `฿${budget.toLocaleString()} บาท`,
      submissionDeadline,
      targetCompletionDays,
      scopeSummary,
      criteriaWeight: {
        price: priceWeight,
        technical: technicalWeight,
      },
      invitedVendors: vendors.length > 0 ? vendors : ['ผู้ประกอบการทั่วไปที่สนใจยื่นข้อเสนอ'],
      contactPerson,
      contactEmail,
      contactPhone,
      status: 'published',
      createdAt: new Date().toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      baseTorId: selectedBaseTorId,
      requirements: [
        `ความละเอียดกล้องไม่ต่ำกว่า 4MP ตรวจจับป้ายทะเบียนไทย`,
        `ระยะเวลาส่งมอบไม่เกิน ${targetCompletionDays} วัน`,
        `การรับประกัน On-site Service ไม่น้อยกว่า 2 ปี`,
      ],
    };

    onSaveRFP(newRfp);
    setJustPublishedRfp(newRfp);
    setActiveTab('history');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center shadow-xs shrink-0">
              <Send className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">
                  ขอข้อเสนอราคาและหนังสือเชิญชวน (Request for Proposal - RFP)
                </h3>
                <span className="text-2xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                  พ.ร.บ. พัสดุฯ ม.๘
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                สร้างประกาศเชิญชวนยื่นข้อเสนอ กำหนดสัดส่วนคะแนน และส่งคำขอข้อเสนอไปยังผู้ประกอบการ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Header */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-200 bg-white">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'create'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📝 ร่างหนังสือขอข้อเสนอใหม่ (Create RFP)
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>📋 รายการขอข้อเสนอที่ประกาศแล้ว</span>
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 text-3xs font-bold flex items-center justify-center">
              {rfpList.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {activeTab === 'create' && (
            <form onSubmit={handlePublishRFP} className="space-y-5">
              {/* Preset Base TOR Selector */}
              <div className="bg-blue-50/60 rounded-xl p-3.5 border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-700" />
                    <span>เลือก TOR ต้นแบบเพื่อตั้งต้นข้อมูล (Optional Base TOR Template):</span>
                  </label>
                  <span className="text-2xs text-blue-700">ดึงสเปกและราคาอัตโนมัติ</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {tors.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleBaseTorChange(t.id)}
                      className={`text-left p-2 rounded-lg border text-xs transition-all ${
                        selectedBaseTorId === t.id
                          ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>{t.code}</span>
                        <span className={`text-2xs ${selectedBaseTorId === t.id ? 'text-blue-200' : 'text-slate-500'}`}>
                          {t.durationDays} วัน
                        </span>
                      </div>
                      <div className="text-2xs truncate mt-0.5">{t.title}</div>
                      <div className={`font-semibold text-2xs mt-1 ${selectedBaseTorId === t.id ? 'text-amber-300' : 'text-blue-800'}`}>
                        {t.priceFormatted}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    ชื่อโครงการขอข้อเสนอ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    required
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-800 focus:outline-none"
                    placeholder="ระบุชื่อโครงการ..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    รหัสประกาศ / เลขที่หนังสือ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={rfpCode}
                    onChange={(e) => setRfpCode(e.target.value)}
                    required
                    className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    หน่วยงานเจ้าของโครงการ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    วงเงินงบประมาณราคากลาง (บาท) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    min={100000}
                    step={50000}
                    required
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-800 focus:outline-none font-bold text-blue-950"
                  />
                  <span className="text-2xs text-slate-500">
                    {budget.toLocaleString()} บาท ({numberToThaiBaht(budget)})
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    กำหนดยื่นข้อเสนอวันสุดท้าย <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={submissionDeadline}
                    onChange={(e) => setSubmissionDeadline(e.target.value)}
                    required
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    เป้าหมายระยะเวลาส่งมอบ (วันทำการ)
                  </label>
                  <input
                    type="number"
                    value={targetCompletionDays}
                    onChange={(e) => setTargetCompletionDays(Number(e.target.value))}
                    min={15}
                    max={365}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  />
                </div>

                {/* Criteria Weights */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>สัดส่วนเกณฑ์การประเมิน (พ.ร.บ. พัสดุฯ ม.๘)</span>
                    <span className="text-2xs text-blue-800 font-bold">
                      {priceWeight}% ราคา : {technicalWeight}% คุณภาพ
                    </span>
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-2xs text-slate-500">ราคา {priceWeight}%</span>
                    <input
                      type="range"
                      min={10}
                      max={90}
                      step={5}
                      value={priceWeight}
                      onChange={(e) => {
                        const p = Number(e.target.value);
                        setPriceWeight(p);
                        setTechnicalWeight(100 - p);
                      }}
                      className="w-full accent-blue-900 cursor-pointer"
                    />
                    <span className="text-2xs text-slate-500">คุณภาพ {technicalWeight}%</span>
                  </div>
                </div>
              </div>

              {/* Minimum Scope & Spec Summary */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">
                  ขอบเขตและข้อกำหนดทางเทคนิคขั้นต่ำ (Minimum Scope & Technical Specifications)
                </label>
                <textarea
                  rows={3}
                  value={scopeSummary}
                  onChange={(e) => setScopeSummary(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  placeholder="ระบุข้อกำหนดขั้นต่ำที่ต้องการให้ผู้เสนอราคาตอบสนอง..."
                />
              </div>

              {/* Vendors List & Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    รายชื่อบริษัทผู้ยื่นข้อเสนอที่เชิญชวน (1 รายการต่อ 1 บรรทัด)
                  </label>
                  <textarea
                    rows={3}
                    value={invitedVendorsText}
                    onChange={(e) => setInvitedVendorsText(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-800 focus:outline-none"
                    placeholder="บริษัท ก จำกัด&#10;บริษัท ข จำกัด"
                  />
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-bold text-slate-800">ผู้ประสานงานจัดซื้อจัดจ้าง</label>
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-800 focus:outline-none mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-2xs font-medium text-slate-600">อีเมล</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full text-xs border border-slate-300 rounded-lg p-1.5 focus:ring-2 focus:ring-blue-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-2xs font-medium text-slate-600">โทรศัพท์</label>
                      <input
                        type="text"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full text-xs border border-slate-300 rounded-lg p-1.5 focus:ring-2 focus:ring-blue-800 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Notice Live Preview */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-800" />
                    <span>ตัวอย่างหนังสือเชิญชวนทางการ (Official Memo Preview):</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleCopyNotice}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-2xs font-bold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกร่าง'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handlePrintNotice}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-2xs font-bold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
                    >
                      <Printer className="w-3 h-3" />
                      <span>พิมพ์หนังสือ</span>
                    </button>
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-2xs text-slate-700 font-mono max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {generateOfficialNoticeText()}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-950 rounded-lg transition-colors shadow-xs"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>บันทึกและประกาศขอข้อเสนอ (Publish RFP)</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    รายการหนังสือขอข้อเสนอราคาที่ประกาศแล้ว (Active RFP Notices)
                  </h4>
                  <p className="text-2xs text-slate-500">
                    ติดตามสถานะการขอข้อเสนอ และเปิดรับการยื่นข้อเสนอจากผู้ประกอบการ
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('create')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <span>+ ออกหนังสือขอข้อเสนอใหม่</span>
                </button>
              </div>

              {rfpList.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl space-y-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center mx-auto">
                    <Send className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    ยังไม่มีรายการขอข้อเสนอราคาในระบบ
                  </div>
                  <p className="text-2xs text-slate-500 max-w-sm mx-auto">
                    คลิกแท็บ "ร่างหนังสือขอข้อเสนอใหม่" เพื่อสร้างหนังสือเชิญชวนยื่นข้อเสนอโครงการตามระเบียบพัสดุฯ
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rfpList.map((rfp) => (
                    <div
                      key={rfp.id}
                      className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-blue-300 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                              {rfp.rfpCode}
                            </span>
                            <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              เปิดรับข้อเสนอ
                            </span>
                            <span className="text-2xs text-slate-400">ประกาศเมื่อ: {rfp.createdAt}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">
                            {rfp.projectTitle}
                          </h4>
                          <p className="text-2xs text-slate-500">{rfp.department}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-bold text-blue-900 block">
                            {rfp.budgetFormatted}
                          </span>
                          <span className="text-2xs text-slate-500">
                            ครบกำหนด: {new Date(rfp.submissionDeadline).toLocaleDateString('th-TH')}
                          </span>
                        </div>
                      </div>

                      {/* Details row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-2xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                        <div>
                          <span className="font-bold text-slate-800 block">สัดส่วนเกณฑ์ประเมิน:</span>
                          <span>ราคา {rfp.criteriaWeight.price}% : คุณภาพ {rfp.criteriaWeight.technical}%</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block">ระยะเวลาดำเนินการ:</span>
                          <span>{rfp.targetCompletionDays} วันทำการ</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block">ผู้ประกอบการที่เชิญ:</span>
                          <span className="truncate block">{rfp.invitedVendors.join(', ')}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="text-2xs text-slate-500 flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-blue-700" />
                          <span>ผู้ประสานงาน: {rfp.contactPerson} ({rfp.contactPhone})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `รหัสประกาศ: ${rfp.rfpCode}\nโครงการ: ${rfp.projectTitle}\nราคากลาง: ${rfp.budgetFormatted}\nกำหนดยื่น: ${rfp.submissionDeadline}\nรายละเอียด: ${rfp.scopeSummary}`
                              );
                              alert('คัดลอกรายละเอียดประกาศขอข้อเสนอแล้ว');
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-2xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            <span>คัดลอก</span>
                          </button>
                          {onOpenSubmitForRFP && (
                            <button
                              onClick={() => {
                                onOpenSubmitForRFP(rfp);
                                onClose();
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 text-2xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded hover:bg-emerald-100 transition-colors"
                            >
                              <span>ยื่นข้อเสนอสำหรับโครงการนี้ ➔</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper for Thai Baht Currency Word
function numberToThaiBaht(num: number): string {
  if (num === 2500000) return 'สองล้านห้าแสนบาทถ้วน';
  if (num === 2000000) return 'สองล้านบาทถ้วน';
  if (num === 1850000) return 'หนึ่งล้านแปดแสนห้าหมื่นบาทถ้วน';
  if (num === 3500000) return 'สามล้านห้าแสนบาทถ้วน';
  if (num === 650000) return 'หกแสนห้าหมื่นบาทถ้วน';
  return `${num.toLocaleString()} บาทถ้วน`;
}
