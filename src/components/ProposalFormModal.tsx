import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  FileText,
  Building2,
  Coins,
  Clock,
  Cpu,
  ShieldCheck,
  Award,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  Users,
  Plus,
  Trash2,
  GraduationCap,
} from 'lucide-react';
import { TORDocument, ProposalFormData, ProjectExpert } from '../types';
import { COMMON_CERTIFICATIONS, ROLE_OPTIONS, evaluateExpertsSummary } from '../utils/expertUtils';

interface ProposalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitProposal: (tor: TORDocument) => void;
}

const DEFAULT_EXPERTS: ProjectExpert[] = [
  {
    role: 'ผู้จัดการโครงการ (Project Manager)',
    name: 'นายกิตติศักดิ์ พัฒนกิจ',
    experienceYears: 8,
    certifications: ['PMP (Project Management Professional)'],
    education: 'วศ.บ. วิศวกรรมคอมพิวเตอร์',
    responsibilities: 'ควบคุมงวดงาน ส่งมอบระบบ และรายงานคณะกรรมการตรวจรับ',
    isKeyPersonnel: true,
  },
  {
    role: 'วิศวกร AI และ Computer Vision (AI Specialist)',
    name: 'ดร.ชาญชัย วงศ์สุวรรณ',
    experienceYears: 7,
    certifications: ['NVIDIA Deep Learning Institute (DLI) Certified'],
    education: 'ปร.ด. ปัญญาประดิษฐ์และวิทยาการข้อมูล',
    responsibilities: 'พัฒนาและปรับจูนโมเดล LPR ตรวจจับป้ายทะเบียนภาษาไทย',
    isKeyPersonnel: true,
  },
  {
    role: 'วิศวกรความมั่นคงปลอดภัยไซเบอร์ (Cybersecurity Specialist)',
    name: 'นายวัชระ ประเสริฐสิน',
    experienceYears: 6,
    certifications: ['CISSP (Certified Information Systems Security Professional)', 'CompTIA Security+'],
    education: 'วศ.บ. วิศวกรรมสารสนเทศและเครือข่าย',
    responsibilities: 'วางระบบความปลอดภัยเครือข่าย ป้องกันการเข้าถึง และจัดเก็บบันทึก Log ตาม พ.ร.บ. ไซเบอร์',
    isKeyPersonnel: true,
  },
];

const INITIAL_FORM: ProposalFormData = {
  title: 'โครงการจัดหาและติดตั้งระบบ AI ตรวจจับทะเบียนรถยนต์อัจฉริยะ',
  code: 'PROPOSAL-LPR-2026-01',
  vendor: 'บริษัท นวัตกรรมความปลอดภัยและเทคโนโลยี จำกัด',
  price: 2450000,
  durationDays: 90,
  lanesCount: 4,
  hasBarrierGate: true,
  hasVisitorSystem: true,
  architecture: 'Edge AI Camera + Central Server',
  cameraResolution: '4 Megapixel CMOS',
  cameraCount: 4,
  storageDays: 180,
  upsMinutes: 30,
  accuracyDay: 96,
  accuracyNight: 91,
  warrantyYears: 3,
  slaCriticalMinutes: 30,
  pmFrequency: 'ทุก 6 เดือน (ปีละ 2 ครั้ง)',
  installmentsCount: 3,
  experienceYears: 5,
  similarProjectsCount: 3,
  notes: 'แถมระบบแจ้งเตือนผ่าน Line Notify / Webhook สำหรับรถ VIP และบัญชี Blacklist',
};

export const ProposalFormModal: React.FC<ProposalFormModalProps> = ({
  isOpen,
  onClose,
  onSubmitProposal,
}) => {
  const [formData, setFormData] = useState<ProposalFormData>(INITIAL_FORM);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [validationError, setValidationError] = useState<string>('');
  const [experts, setExperts] = useState<ProjectExpert[]>(DEFAULT_EXPERTS);
  const [isoStandards, setIsoStandards] = useState<string[]>([
    'ISO 9001:2015',
    'ISO 27001 (ความมั่นคงปลอดภัยสารสนเทศ)',
  ]);

  if (!isOpen) return null;

  const handleApplyPreset = (type: 'sme' | 'enterprise') => {
    if (type === 'sme') {
      setFormData({
        title: 'โครงการติดตั้งระบบตรวจจับทะเบียนและระบบสแกนยานพาหนะเข้า-ออก',
        code: 'PROP-COMPACT-01',
        vendor: 'บริษัท สมาร์ท วิชั่น แอนด์ ซีเคียวริตี้ จำกัด',
        price: 980000,
        durationDays: 60,
        lanesCount: 2,
        hasBarrierGate: true,
        hasVisitorSystem: false,
        architecture: 'Server-centric with AI Accelerator',
        cameraResolution: '3 Megapixel WDR',
        cameraCount: 2,
        storageDays: 90,
        upsMinutes: 20,
        accuracyDay: 93,
        accuracyNight: 87,
        warrantyYears: 2,
        slaCriticalMinutes: 60,
        pmFrequency: 'ทุก 6 เดือน',
        installmentsCount: 3,
        experienceYears: 3,
        similarProjectsCount: 2,
        notes: 'รวมงานติดตั้งไม้กั้น 2 ช่องทางและกล้องอ่านป้ายทะเบียนความเร็วสูง',
      });
      setExperts([
        {
          role: 'ผู้จัดการโครงการและหัวหน้าช่าง (Project Lead)',
          name: 'นายสมพร จิตดี',
          experienceYears: 5,
          certifications: ['CCTV & Electronic Security Certified Technician'],
          education: 'อส.บ. เทคโนโลยีคอมพิวเตอร์',
          responsibilities: 'ควบคุมการเดินสาย ติดตั้งกล้อง และประสานงานตรวจรับ',
          isKeyPersonnel: true,
        },
        {
          role: 'ช่างเทคนิคระบบเครือข่าย (Network Technician)',
          name: 'นายมนัส ผลงาน',
          experienceYears: 4,
          certifications: ['CompTIA Network+ / A+'],
          education: 'ปวส. ช่างอิเล็กทรอนิกส์',
          responsibilities: 'เซ็ตอัปเครื่องบันทึกและระบบเครือข่าย',
          isKeyPersonnel: true,
        },
      ]);
      setIsoStandards(['ISO 9001:2015']);
    } else {
      setFormData({
        title: 'โครงการพัฒนาระบบตรวจจับป้ายทะเบียนและศูนย์เฝ้าระวังความมั่นคงสูง (Smart Gate Enterprise)',
        code: 'PROP-ENT-02',
        vendor: 'กลุ่มร่วมทำงาน สยาม ดิจิทัล ซิเคียว คอนซอร์เตียม',
        price: 3950000,
        durationDays: 120,
        lanesCount: 6,
        hasBarrierGate: true,
        hasVisitorSystem: true,
        architecture: 'Edge AI Deep Learning + HA High Availability Cluster',
        cameraResolution: '5 Megapixel CMOS Starlight',
        cameraCount: 6,
        storageDays: 365,
        upsMinutes: 60,
        accuracyDay: 98,
        accuracyNight: 94,
        warrantyYears: 4,
        slaCriticalMinutes: 15,
        pmFrequency: 'ทุกไตรมาส (ปีละ 4 ครั้ง)',
        installmentsCount: 4,
        experienceYears: 8,
        similarProjectsCount: 6,
        notes: 'มีระบบจำแนกยี่ห้อ สี ประเภทรถ พร้อมเข้ารหัส Snapshot Hash และระบบ Failover',
      });
      setExperts([
        {
          role: 'ผู้อำนวยการโครงการ (Project Director)',
          name: 'นายธีรเดช เจริญสุข',
          experienceYears: 12,
          certifications: ['PMP (Project Management Professional)', 'PRINCE2 Practitioner'],
          education: 'วศ.ม. การจัดการวิศวกรรม',
          responsibilities: 'กำกับดูแลภาพรวมโครงการ ควบคุมระยะเวลาและรายงานกรรมการตรวจรับ',
          isKeyPersonnel: true,
        },
        {
          role: 'วิศวกร AI และ Computer Vision (Chief AI Scientist)',
          name: 'ดร.กฤษดา เมธาวี',
          experienceYears: 9,
          certifications: ['NVIDIA Deep Learning Institute (DLI) Certified'],
          education: 'ปร.ด. ปัญญาประดิษฐ์',
          responsibilities: 'ปรับแต่งอัลกอริทึม Deep Learning LPR และ Multi-lane Recognition',
          isKeyPersonnel: true,
        },
        {
          role: 'ผู้เชี่ยวชาญความมั่นคงปลอดภัยไซเบอร์ (Cybersecurity Lead)',
          name: 'นายปิยะพงษ์ ทัศนีย์',
          experienceYears: 8,
          certifications: ['CISSP', 'CISM', 'CompTIA Security+'],
          education: 'วศ.บ. วิศวกรรมคอมพิวเตอร์และความมั่นคง',
          responsibilities: 'ดูแลการเข้ารหัส Snapshot Hash, MFA, SIEM Log และ VA Assessment',
          isKeyPersonnel: true,
        },
        {
          role: 'วิศวกรคลัสเตอร์ระบบและความพร้อมใช้งานสูง (HA System Architect)',
          name: 'นายชัชวาล วัฒนกุล',
          experienceYears: 7,
          certifications: ['CCNP Enterprise', 'Red Hat Certified'],
          education: 'วศ.บ. วิศวกรรมโทรคมนาคม',
          responsibilities: 'ออกแบบและติดตั้ง Central Cluster Failover และ Edge Store-and-Forward',
          isKeyPersonnel: true,
        },
      ]);
      setIsoStandards(['ISO 9001:2015', 'ISO 27001 (ความมั่นคงปลอดภัยสารสนเทศ)', 'CMMI Level 3']);
    }
  };

  const handleAddExpert = () => {
    const newExpert: ProjectExpert = {
      role: 'วิศวกรผู้เชี่ยวชาญเฉพาะทาง (Specialist Engineer)',
      name: `ผู้เชี่ยวชาญท่านที่ ${experts.length + 1}`,
      experienceYears: 5,
      certifications: ['CompTIA Security+'],
      education: 'วศ.บ. วิศวกรรมคอมพิวเตอร์',
      responsibilities: 'ดูแลการติดตั้งระบบและการตรวจสอบ UAT',
      isKeyPersonnel: false,
    };
    setExperts([...experts, newExpert]);
  };

  const handleRemoveExpert = (index: number) => {
    setExperts(experts.filter((_, idx) => idx !== index));
  };

  const handleUpdateExpert = (index: number, updated: Partial<ProjectExpert>) => {
    const next = [...experts];
    next[index] = { ...next[index], ...updated };
    setExperts(next);
  };

  const calculateScores = () => {
    // 1. Duration score (60d=9.5, 90d=8.8, 120d=8.0)
    let durationScore = 8.5;
    if (formData.durationDays <= 60) durationScore = 9.5;
    else if (formData.durationDays <= 90) durationScore = 8.8;
    else durationScore = 8.0;

    // 2. Expertise score incorporating specialists summary
    const expSummary = evaluateExpertsSummary(experts);
    let expertiseScore = expSummary.score;
    if (formData.experienceYears >= 7) expertiseScore = Math.min(10, expertiseScore + 0.4);
    if (isoStandards.length >= 2) expertiseScore = Math.min(10, expertiseScore + 0.3);

    // 3. Scope score
    let scopeScore = 7.0;
    if (formData.hasBarrierGate) scopeScore += 1.2;
    if (formData.hasVisitorSystem) scopeScore += 0.8;
    if (formData.lanesCount >= 4) scopeScore += 0.5;
    scopeScore = Math.min(10, scopeScore);

    // 4. Technical score
    let technicalScore = 7.5;
    if (formData.architecture.toLowerCase().includes('edge')) technicalScore += 1.0;
    if (formData.accuracyDay >= 95) technicalScore += 0.8;
    if (formData.cameraResolution.includes('5') || formData.cameraResolution.includes('4'))
      technicalScore += 0.5;
    technicalScore = Math.min(10, technicalScore);

    // 5. Price score
    let priceScore = 8.0;
    if (formData.price < 1500000) priceScore = 9.2;
    else if (formData.price < 3000000) priceScore = 8.5;
    else priceScore = 7.5;

    return {
      duration: Number(durationScore.toFixed(1)),
      expertise: Number(expertiseScore.toFixed(1)),
      scope: Number(scopeScore.toFixed(1)),
      technical: Number(technicalScore.toFixed(1)),
      price: Number(priceScore.toFixed(1)),
      reasons: {
        duration: `ระยะเวลา ${formData.durationDays} วัน สอดคล้องกับขนาดงาน ${formData.lanesCount} ช่องทาง`,
        expertise: `ผู้ยื่นมีประสบการณ์ ${formData.experienceYears} ปี และมีคณะผู้เชี่ยวชาญ ${experts.length} ท่าน (บุคลากรหลัก ${experts.filter((e) => e.isKeyPersonnel).length} ท่าน, ใบรับรองวิชาชีพ ${expSummary.certificationsList.length} ใบ)`,
        scope: `ครอบคลุม ${formData.lanesCount} ช่องทาง ${formData.hasBarrierGate ? 'รวมไม้กั้นอัตโนมัติ' : 'ไม่รวมไม้กั้น'} ${formData.hasVisitorSystem ? 'และระบบผู้มาติดต่อ' : ''}`,
        technical: `สถาปัตยกรรม ${formData.architecture} ความละเอียด ${formData.cameraResolution} ความแม่นยำกลางวัน ${formData.accuracyDay}% กลางคืน ${formData.accuracyNight}%`,
        price: `วงเงินที่เสนอ ${formData.price.toLocaleString()} บาท สมเหตุสมผลต่อสเปกและอุปกรณ์ที่ระบุ`,
      },
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.vendor.trim()) {
      setValidationError('กรุณากรอกชื่อโครงการและชื่อบริษัทผู้เสนอราคา');
      return;
    }
    if (formData.price <= 0) {
      setValidationError('กรุณากรอกวงเงินราคาที่เสนอให้ถูกต้อง');
      return;
    }

    const calculated = calculateScores();

    const newTor: TORDocument = {
      id: 'tor-proposal-' + Date.now(),
      code: formData.code || 'PROPOSAL-' + Math.floor(100 + Math.random() * 900),
      title: formData.title,
      vendor: formData.vendor,
      duration: `${formData.durationDays} วันนับถัดจากวันลงนามในสัญญา`,
      durationDays: formData.durationDays,
      scope: `ติดตั้งระบบตรวจจับทะเบียนรถและบริหารจุดเข้า-ออก จำนวน ${formData.lanesCount} ช่องทาง ${formData.hasBarrierGate ? 'พร้อมติดตั้งไม้กั้นอัตโนมัติ' : ''} ${formData.hasVisitorSystem ? 'ระบบบริหารจัดการผู้มาติดต่อ (Visitor)' : ''} จัดเก็บข้อมูลย้อนหลัง ${formData.storageDays} วัน`,
      hardwareSoftware: {
        hardware: [
          `กล้อง LPR ความละเอียด ${formData.cameraResolution} จำนวน ${formData.cameraCount} ชุด`,
          formData.hasBarrierGate
            ? `ไม้กั้นอัตโนมัติ (Barrier Gate) พร้อม Safety Sensor จำนวน ${Math.ceil(formData.lanesCount / 2)} ชุด`
            : 'ไม่รวมไม้กั้นในสัญญา',
          `เครื่องแม่ข่ายและระบบจัดเก็บข้อมูลย้อนหลัง ${formData.storageDays} วัน`,
          `เครื่องสำรองไฟฟ้า (UPS) สำรองไฟไม่น้อยกว่า ${formData.upsMinutes} นาที`,
          'อุปกรณ์เน็ตเวิร์กสวิตช์ PoE และตู้ควบคุมภายนอกอาคาร',
        ],
        software: [
          `ระบบอ่านป้ายทะเบียนไทย AI ความแม่นยำ ${formData.accuracyDay}%`,
          'ระบบจัดการสิทธิเข้า-ออก Whitelist / Watchlist / Blacklist',
          formData.hasVisitorSystem
            ? 'ระบบลงทะเบียนผู้มาติดต่อ (Visitor Access) ผ่าน QR Code'
            : 'ระบบบันทึกและสืบค้นประวัติย้อนหลัง',
          'REST API และ Webhook สำหรับเชื่อมต่อระบบเดิม',
          'ระบบความมั่นคงปลอดภัยและการเก็บบันทึก Audit Log',
        ],
        architecture: formData.architecture,
        accuracy: `กลางวัน >= ${formData.accuracyDay}%, กลางคืน >= ${formData.accuracyNight}%`,
        storageAndNetwork: `เก็บบันทึกข้อมูลย้อนหลัง ${formData.storageDays} วัน และมีแผนสำรองข้อมูล`,
      },
      delivery: `แบ่งจ่ายเงิน ${formData.installmentsCount} งวดงาน ดำเนินการและทดสอบระบบให้แล้วเสร็จภายใน ${formData.durationDays} วัน พร้อมจัดฝึกอบรมและเอกสารส่งมอบครบถ้วน`,
      price: formData.price,
      priceFormatted: `${formData.price.toLocaleString()} บาท`,
      expertise: `เป็นนิติบุคคลไทย ประสบการณ์ ${formData.experienceYears} ปี มีผลงานระบบกล้อง/LPR ที่แล้วเสร็จ ${formData.similarProjectsCount} สัญญา คณะผู้เชี่ยวชาญ ${experts.length} ท่าน พร้อมใบรับรองวิชาชีพมาตรฐานสากล`,
      expertProfile: {
        companyTrackRecord: `ผลงานติดตั้งระบบคอมพิวเตอร์และกล้อง ${formData.similarProjectsCount} สัญญา โดยบริษัทที่มีประสบการณ์ดำเนินกิจการ ${formData.experienceYears} ปี`,
        yearsInBusiness: formData.experienceYears,
        similarProjectsCount: formData.similarProjectsCount,
        registeredCapital: formData.price > 3000000 ? '30,000,000 บาท' : '10,000,000 บาท',
        isoStandards,
        experts,
        expertEvaluationScore: calculated.expertise,
        expertScoreReason: `ผู้ยื่นมีบุคลากรผู้เชี่ยวชาญ ${experts.length} ท่าน (บุคลากรหลัก ${experts.filter((e) => e.isKeyPersonnel).length} ท่าน) โดยมีใบรับรองวิชาชีพหลักและมาตรฐานสากลครบถ้วน`,
      },
      highlights: [
        `ราคาที่เสนอ ${formData.price.toLocaleString()} บาท สอดคล้องกับกรอบงบประมาณ`,
        formData.hasBarrierGate
          ? 'รวมระบบไม้กั้นอัตโนมัติพร้อม Safety Sensor ครบชุด'
          : 'ส่งมอบระบบอ่านทะเบียนและบันทึกประวัติรวดเร็ว',
        `คณะผู้เชี่ยวชาญประจำโครงการ ${experts.length} ท่าน (บุคลากรหลัก ${experts.filter((e) => e.isKeyPersonnel).length} ท่าน)`,
        `การรับประกันยาวนาน ${formData.warrantyYears} ปี พร้อม SLA รองรับเหตุวิกฤตใน ${formData.slaCriticalMinutes} นาที`,
        formData.notes ? formData.notes : 'มีแผนการบำรุงรักษาเชิงป้องกันอย่างต่อเนื่อง',
      ],
      drawbacks: [
        formData.durationDays > 90
          ? 'ระยะเวลาดำเนินการค่อนข้างยาวนาน ต้องควบคุมแผนงานใกล้ชิด'
          : 'ควรตรวจสอบสเปกอุปกรณ์หน้างานเทียบเคียงก่อนลงนาม',
      ],
      warrantyAndSla: `รับประกัน ${formData.warrantyYears} ปี, ตอบสนองเหตุวิกฤตภายใน ${formData.slaCriticalMinutes} นาที, บำรุงรักษา PM ${formData.pmFrequency}`,
      scores: calculated,
      source: 'upload',
      badge: 'ข้อเสนอผ่านหน้าจอ (New Proposal)',
      rawText: JSON.stringify(formData, null, 2),
    };

    onSubmitProposal(newTor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <PlusCircle className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                บันทึกรับข้อเสนอโครงการผ่านหน้าจอ (Proposal Submission Form)
              </h3>
              <p className="text-xs text-slate-500">
                กรอกข้อกำหนดของข้อเสนอเพื่อประเมินคะแนนเรดาร์และเปรียบเทียบในระบบทันที
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset shortcut bar */}
        <div className="px-6 py-2.5 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between gap-3 text-xs">
          <span className="text-blue-900 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-700" />
            <span>กรอกข้อมูลตัวอย่างด่วน (Quick Presets):</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleApplyPreset('sme')}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-md text-2xs font-semibold shadow-2xs"
            >
              พรีเซ็ต: รุ่นย่อมเยา (9.8 แสน)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('enterprise')}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-md text-2xs font-semibold shadow-2xs"
            >
              พรีเซ็ต: รุ่นความมั่นคงสูง (3.95 ล้าน)
            </button>
          </div>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Section 1: Project & Vendor */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
              <Building2 className="w-4 h-4 text-blue-800" />
              <span>๑. ข้อมูลโครงการและผู้ยื่นข้อเสนอ</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  ชื่อโครงการ / ชื่อข้อเสนอ TOR <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  รหัสเอกสารข้อเสนอ (Reference Code)
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  บริษัทหรือผู้ยื่นข้อเสนอราคา <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Budget & Duration */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
              <Coins className="w-4 h-4 text-amber-700" />
              <span>๒. ราคาที่เสนอและระยะเวลาดำเนินงาน</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  ราคาที่เสนอ (บาท) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold"
                />
                <span className="text-2xs text-slate-500 mt-0.5 block">
                  {formData.price.toLocaleString()} บาท
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  ระยะเวลาส่งมอบ (วัน)
                </label>
                <input
                  type="number"
                  min={15}
                  max={365}
                  value={formData.durationDays}
                  onChange={(e) =>
                    setFormData({ ...formData, durationDays: Number(e.target.value) })
                  }
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  การแบ่งงวดงานส่งมอบ
                </label>
                <select
                  value={formData.installmentsCount}
                  onChange={(e) =>
                    setFormData({ ...formData, installmentsCount: Number(e.target.value) })
                  }
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value={1}>งวดเดียว (ส่งมอบครบ 100%)</option>
                  <option value={2}>แบ่ง 2 งวดงาน</option>
                  <option value={3}>แบ่ง 3 งวดงาน (30/40/30%)</option>
                  <option value={4}>แบ่ง 4 งวดงาน</option>
                  <option value={5}>แบ่ง 5 งวดงาน</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Scope & Hardware */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
              <Cpu className="w-4 h-4 text-purple-700" />
              <span>๓. สถาปัตยกรรม ขอบเขต และอุปกรณ์ฮาร์ดแวร์</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  สถาปัตยกรรมระบบ
                </label>
                <select
                  value={formData.architecture}
                  onChange={(e) => setFormData({ ...formData, architecture: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="Edge AI Camera + Central Server">
                    Edge AI Camera (ประมวลผลที่กล้อง)
                  </option>
                  <option value="Server-centric with AI Accelerator">
                    Server-centric (ประมวลผลที่แม่ข่าย)
                  </option>
                  <option value="Edge AI Deep Learning + HA High Availability Cluster">
                    Enterprise HA Cluster + Multi-Gate
                  </option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  จำนวนช่องทางรถ (Lanes)
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={formData.lanesCount}
                  onChange={(e) => setFormData({ ...formData, lanesCount: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  ความละเอียดกล้อง LPR
                </label>
                <select
                  value={formData.cameraResolution}
                  onChange={(e) =>
                    setFormData({ ...formData, cameraResolution: e.target.value })
                  }
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="2 Megapixel CMOS">2 Megapixel</option>
                  <option value="3 Megapixel WDR">3 Megapixel</option>
                  <option value="4 Megapixel CMOS">4 Megapixel</option>
                  <option value="5 Megapixel CMOS Starlight">5 Megapixel Starlight</option>
                  <option value="8 Megapixel 4K">8 Megapixel 4K</option>
                </select>
              </div>
            </div>

            {/* Checkbox Options */}
            <div className="flex flex-wrap items-center gap-6 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasBarrierGate}
                  onChange={(e) =>
                    setFormData({ ...formData, hasBarrierGate: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-blue-800"
                />
                <span className="font-semibold text-slate-800">
                  รวมไม้กั้นอัตโนมัติ (Barrier Gate) พร้อม Safety Sensor
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasVisitorSystem}
                  onChange={(e) =>
                    setFormData({ ...formData, hasVisitorSystem: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-blue-800"
                />
                <span className="font-semibold text-slate-800">
                  มีระบบจัดการผู้มาติดต่อ (Visitor QR Code / Booking)
                </span>
              </label>
            </div>
          </div>

          {/* Section 4: Accuracy, Warranty & SLA */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>๔. ความแม่นยำ AI การรับประกัน และ SLA</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  ความแม่นยำกลางวัน (%)
                </label>
                <input
                  type="number"
                  min={80}
                  max={100}
                  value={formData.accuracyDay}
                  onChange={(e) =>
                    setFormData({ ...formData, accuracyDay: Number(e.target.value) })
                  }
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  ระยะเวลารับประกัน (ปี)
                </label>
                <select
                  value={formData.warrantyYears}
                  onChange={(e) =>
                    setFormData({ ...formData, warrantyYears: Number(e.target.value) })
                  }
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value={1}>1 ปี</option>
                  <option value={2}>2 ปี</option>
                  <option value={3}>3 ปี (มาตรฐานราชการ)</option>
                  <option value={4}>4 ปี</option>
                  <option value={5}>5 ปี (Comprehensive Warranty)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  SLA ตอบสนองเหตุวิกฤต (นาที)
                </label>
                <input
                  type="number"
                  min={5}
                  max={240}
                  value={formData.slaCriticalMinutes}
                  onChange={(e) =>
                    setFormData({ ...formData, slaCriticalMinutes: Number(e.target.value) })
                  }
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>

            {/* Section 5: Key Experts and Personnel */}
            <div className="bg-purple-50/50 border border-purple-200/90 rounded-xl p-3.5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-purple-200/70 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-700 text-white flex items-center justify-center font-bold text-xs">
                    ๕
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-purple-700" />
                      คณะผู้เชี่ยวชาญและบุคลากรหลักประจำโครงการ
                    </h3>
                    <p className="text-3xs text-purple-800">
                      ระบุรายชื่อ วุฒิการศึกษา ประสบการณ์ และใบรับรองวิชาชีพสากล (ใช้คำนวณคะแนนเกณฑ์ความเชี่ยวชาญ)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="text-3xs px-2 py-0.5 bg-purple-100 text-purple-800 font-bold rounded-full border border-purple-300">
                    บุคลากร {experts.length} ท่าน (หลัก {experts.filter((e) => e.isKeyPersonnel).length} ท่าน)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddExpert}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-3xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-md transition-colors shadow-2xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>เพิ่มผู้เชี่ยวชาญ</span>
                  </button>
                </div>
              </div>

              {/* Experts list */}
              <div className="space-y-2.5">
                {experts.map((exp, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg p-3 border border-purple-200 shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2">
                        {/* Role */}
                        <div className="sm:col-span-5">
                          <label className="text-3xs font-semibold text-slate-600 block mb-0.5">
                            บทบาท/ตำแหน่ง
                          </label>
                          <select
                            value={exp.role}
                            onChange={(e) => handleUpdateExpert(idx, { role: e.target.value })}
                            className="w-full text-xs p-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900"
                          >
                            {ROLE_OPTIONS.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Name */}
                        <div className="sm:col-span-4">
                          <label className="text-3xs font-semibold text-slate-600 block mb-0.5">
                            ชื่อ-นามสกุล / วุฒิ
                          </label>
                          <input
                            type="text"
                            value={exp.name}
                            onChange={(e) => handleUpdateExpert(idx, { name: e.target.value })}
                            placeholder="เช่น นายสมชาย วิศวกรรม"
                            className="w-full text-xs p-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900"
                          />
                        </div>

                        {/* Exp Years */}
                        <div className="sm:col-span-3">
                          <label className="text-3xs font-semibold text-slate-600 block mb-0.5">
                            ประสบการณ์ (ปี)
                          </label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min={1}
                              max={40}
                              value={exp.experienceYears}
                              onChange={(e) =>
                                handleUpdateExpert(idx, { experienceYears: Number(e.target.value) })
                              }
                              className="w-full text-xs p-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveExpert(idx)}
                              title="ลบรายการนี้"
                              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Certifications and Key Personnel Checkbox */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-3xs">
                      <div className="flex flex-wrap items-center gap-1 text-slate-600">
                        <span className="font-semibold text-slate-700">วุฒิบัตร/ใบรับรอง:</span>
                        {COMMON_CERTIFICATIONS.slice(0, 5).map((cert) => {
                          const isSelected = exp.certifications.includes(cert);
                          return (
                            <button
                              key={cert}
                              type="button"
                              onClick={() => {
                                const newCerts = isSelected
                                  ? exp.certifications.filter((c) => c !== cert)
                                  : [...exp.certifications, cert];
                                handleUpdateExpert(idx, { certifications: newCerts });
                              }}
                              className={`px-1.5 py-0.5 rounded text-3xs font-medium border transition-colors ${
                                isSelected
                                  ? 'bg-purple-100 text-purple-900 border-purple-400 font-bold'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {isSelected ? '✓ ' : '+ '}
                              {cert.split(' ')[0]}
                            </button>
                          );
                        })}
                      </div>

                      <label className="flex items-center gap-1.5 text-purple-900 font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exp.isKeyPersonnel}
                          onChange={(e) =>
                            handleUpdateExpert(idx, { isKeyPersonnel: e.target.checked })
                          }
                          className="rounded text-purple-700 focus:ring-purple-500 w-3.5 h-3.5"
                        />
                        <span>บุคลากรหลักตามสัญญา (Key Personnel)</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* ISO Standards */}
              <div className="pt-2 border-t border-purple-200/70">
                <label className="text-3xs font-semibold text-purple-900 block mb-1">
                  มาตรฐานการรับรองขององค์กร (ISO Standards & Quality Frameworks):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'ISO 9001:2015',
                    'ISO 27001 (ความมั่นคงปลอดภัยสารสนเทศ)',
                    'ISO 20000 (IT Service Management)',
                    'CMMI Level 3',
                  ].map((iso) => {
                    const hasIso = isoStandards.includes(iso);
                    return (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => {
                          if (hasIso) {
                            setIsoStandards(isoStandards.filter((i) => i !== iso));
                          } else {
                            setIsoStandards([...isoStandards, iso]);
                          }
                        }}
                        className={`text-3xs px-2 py-1 rounded-md border font-medium transition-colors ${
                          hasIso
                            ? 'bg-purple-700 text-white border-purple-800 font-bold'
                            : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {hasIso ? '✓ ' : '+ '}
                        {iso}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                จุดเด่นหรือข้อเสนอพิเศษเพิ่มเติม
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="ระบุข้อเสนอพิเศษ เช่น สิทธิ์ใช้งานซอฟต์แวร์ถาวร, การเชื่อมต่อระบบเดิม, การฝึกอบรม ฯลฯ"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <span className="text-2xs text-slate-500">
            ระบบจะคำนวณคะแนนเรดาร์ ๕ เกณฑ์ (เต็ม ๕๐ คะแนน) และเพิ่มเข้าสู่การเปรียบเทียบอัตโนมัติ
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>บันทึกข้อเสนอและประเมินผลทันที</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
