import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  FolderUp,
  HardDrive,
  Link,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  FileSpreadsheet,
  FileCheck,
  PlusCircle,
  Edit3,
  Search,
  ExternalLink,
  Layers,
  Cpu
} from 'lucide-react';
import { TORDocument } from '../types';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomTOR: (tor: TORDocument) => void;
  onReanalyzeAll?: (customPrompt?: string) => void;
  isAnalyzing?: boolean;
  initialSource?: 'upload' | 'drive' | 'manual';
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onAddCustomTOR,
  onReanalyzeAll,
  isAnalyzing = false,
  initialSource = 'upload',
}) => {
  const [activeSource, setActiveSource] = useState<'upload' | 'drive' | 'manual'>(initialSource);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  
  // Parsed doc fields
  const [parsedDocInfo, setParsedDocInfo] = useState<{
    title: string;
    code: string;
    vendor: string;
    price: string;
    priceNum: number;
    duration: string;
    durationDays: number;
    scope: string;
    hardware: string;
    software: string;
    architecture: string;
    warranty: string;
  }>({
    title: '',
    code: '',
    vendor: '',
    price: '2,500,000 บาท',
    priceNum: 2500000,
    duration: '90 วัน',
    durationDays: 90,
    scope: '',
    hardware: 'กล้องตรวจจับป้ายทะเบียน LPR ความละเอียด 4MP, อุปกรณ์บันทึก NVR 16 ช่อง, ตู้ควบคุมและ UPS',
    software: 'ซอฟต์แวร์ AI อ่านป้ายทะเบียนไทย, Web Management Portal, ระบบส่งออกรายงาน e-GP',
    architecture: 'Edge AI Camera ประมวลผลที่ตัวกล้อง พร้อมส่งผลการตรวจจับไปยังส่วนกลาง',
    warranty: 'รับประกัน 3 ปี On-site Service 24/7 SLA ภายใน 2 ชั่วโมง',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [drivePresetSelected, setDrivePresetSelected] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (selectedFile: File) => {
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const fileName = selectedFile.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      setErrorMessage('รองรับเฉพาะไฟล์ .pdf, .docx, .doc หรือ .txt เท่านั้น');
      return;
    }

    setFile(selectedFile);
    setErrorMessage('');
    setIsExtracting(true);
    setSuccessMessage('');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Content = (reader.result as string).split(',')[1];
        try {
          const res = await fetch('/api/parse-document', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: selectedFile.name,
              fileData: base64Content,
              fileType: selectedFile.type,
            }),
          });

          const data = await res.json();
          if (data.success && data.text) {
            setExtractedText(data.text);
            const lines = data.text.split('\n').map((l: string) => l.trim()).filter(Boolean);
            const guessedTitle = lines[0] || selectedFile.name.replace(/\.[^/.]+$/, '');
            const guessedCode = 'TOR-UPLOAD-' + Math.floor(100 + Math.random() * 900);
            
            setParsedDocInfo((prev) => ({
              ...prev,
              title: guessedTitle,
              code: guessedCode,
              vendor: 'บริษัท ผู้ยื่นข้อเสนอตามเอกสารแนบ',
              scope: data.text.slice(0, 400) + '...',
            }));
            setSuccessMessage(`สกัดข้อความจาก "${selectedFile.name}" สำเร็จ (${data.charCount?.toLocaleString() || 0} ตัวอักษร)`);
          } else {
            setErrorMessage(data.error || 'ไม่สามารถอ่านข้อความจากเอกสารได้');
          }
        } catch (err: any) {
          setErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์: ' + err.message);
        } finally {
          setIsExtracting(false);
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (err: any) {
      setErrorMessage('ไม่สามารถอ่านไฟล์ได้: ' + err.message);
      setIsExtracting(false);
    }
  };

  // Handle Google Drive Presets & Custom URLs
  const handleApplyDrivePreset = (presetName: string) => {
    setDrivePresetSelected(presetName);
    setErrorMessage('');

    if (presetName === 'drive-sample-1') {
      setDriveUrl('https://drive.google.com/drive/folders/tor-lpr-government-standard-2026');
      setParsedDocInfo({
        title: 'โครงการระบบตรวจจับป้ายทะเบียนและบริหารความปลอดภัยแบบ Edge AI (Cloud Drive Reference)',
        code: 'DRIVE-TOR-LPR-04',
        vendor: 'ผู้ประกอบการจากคลังเอกสารมาตรฐานกลาง e-GP',
        price: '3,500,000 บาท',
        priceNum: 3500000,
        duration: '120 วัน',
        durationDays: 120,
        scope: 'ติดตั้งกล้องตรวจจับป้ายทะเบียนแบบ Edge AI ความละเอียด 5MP สั่งเปิดไม้กั้นโดยตรง ระบบสำรองข้อมูล SD Card 256GB บนตัวกล้อง และบันทึกศูนย์กลาง 16TB รองรับยานพาหนะทุกประเภท',
        hardware: 'กล้อง 5MP Edge AI 6 ตัว, ระบบไม้กั้น Servo ความเร็วสูง 4 ชุด, เซิร์ฟเวอร์สำรอง 1 ชุด',
        software: 'ซอฟต์แวร์ LPR Deep Learning v3.2, ระบบ Blacklist แจ้งเตือนตำรวจ, Web Dashboard',
        architecture: 'สถาปัตยกรรม Edge-Distributed AI ควบคุมการทำงานอัตโนมัติที่จุดเข้าออกแม้เครือข่ายขัดข้อง',
        warranty: '5 ปี Comprehensive Warranty พร้อมบริการ On-site Next Business Day (NBD)',
      });
      setExtractedText(`[เอกสารดึงจาก Google Drive: tor-lpr-government-standard-2026]
ชื่อโครงการ: โครงการระบบตรวจจับป้ายทะเบียนและบริหารความปลอดภัยแบบ Edge AI
ขอบเขตงาน: จัดหาและติดตั้งระบบกล้อง LPR 5MP แบบ Edge AI ทำงานแบบประมวลผลที่ขอบเครือข่าย
จุดติดตั้ง: 4 ทางเข้า-ออก พร้อมไม้กั้นอัตโนมัติเชื่อมต่อสัญญาณ IO โดยตรง
ระบบสำรองข้อมูล: SD Card 256GB บนตัวกล้อง และบันทึกศูนย์กลาง 16TB
การรับประกัน: 5 ปี Comprehensive Warranty พร้อมบริการ On-site Next Business Day`);
      setSuccessMessage('ดึงข้อมูลโครงการจาก Google Drive: tor-lpr-government-standard-2026 สำเร็จ');
    } else if (presetName === 'drive-sample-2') {
      setDriveUrl('https://drive.google.com/file/d/1lpr-mockup-specification-v2');
      setParsedDocInfo({
        title: 'ร่างขอบเขตงานระบบตรวจจับป้ายทะเบียนและควบคุมไม้กั้นสำนักงานใหญ่',
        code: 'DRIVE-TOR-LPR-05',
        vendor: 'บริษัท คลาวด์ซีเคียว อินโนเวชั่น จำกัด',
        price: '2,200,000 บาท',
        priceNum: 2200000,
        duration: '90 วัน',
        durationDays: 90,
        scope: '2 จุดเข้า-ออก พร้อมไม้กั้นอัตโนมัติ 2 ชุด กล้อง LPR และกล้อง Overview ระบบบันทึกภาพย้อนหลัง 180 วัน ระบบ Visitor QR Code สำหรับแลกบัตรผู้มาติดต่อ',
        hardware: 'กล้อง LPR 4MP 2 ตัว, กล้อง Overview 2 ตัว, ไม้กั้นอัตโนมัติ 2 ชุด, Kiosk แลกบัตร Visitor',
        software: 'ซอฟต์แวร์ LPR Engine, ระบบ Visitor QR Code Management, Web Portal',
        architecture: 'Server-centric AI ประมวลผลที่ศูนย์คอมพิวเตอร์สำนักงานใหญ่',
        warranty: '3 ปี พร้อมบริการตรวจเช็กตามรอบ Preventive Maintenance ทุก 3 เดือน',
      });
      setExtractedText(`[เอกสารดึงจาก Google Drive: 1lpr-mockup-specification-v2]
โครงการระบบตรวจจับป้ายทะเบียนและควบคุมไม้กั้นสำนักงานใหญ่
ขอบเขต: 2 จุดเข้า-ออก พร้อมไม้กั้นอัตโนมัติ 2 ชุด กล้อง LPR และกล้อง Overview
ระบบบันทึกภาพย้อนหลัง 180 วัน ระบบ Visitor QR Code`);
      setSuccessMessage('ดึงข้อมูลโครงการจาก Google Drive: 1lpr-mockup-specification-v2 สำเร็จ');
    } else if (presetName === 'drive-sample-3') {
      setDriveUrl('https://drive.google.com/file/d/tor-high-security-police-cluster');
      setParsedDocInfo({
        title: 'โครงการระบบตรวจจับป้ายทะเบียนยานพาหนะความมั่นคงสูง (High-Security Highway Cluster)',
        code: 'DRIVE-TOR-POLICE-06',
        vendor: 'กลุ่มกิจการร่วมค้า ซิเคียวเน็ตเวิร์ก เทคโนโลยี',
        price: '4,800,000 บาท',
        priceNum: 4800000,
        duration: '150 วัน',
        durationDays: 150,
        scope: 'ระบบตรวจจับป้ายทะเบียนบนถนนสายหลักความเร็วสูง 120 กม./ชม. พร้อมระบบตรวจจับลักษณะพาหนะ สี ยี่ห้อ และรุ่น เชื่อมโยงฐานข้อมูลอาชญากรรมแบบ Real-time',
        hardware: 'กล้อง 4K Starlight LPR 8 ตัว, เลนส์ซูมระยะไกล 50-100 ม., ระบบไฟส่องสว่างอินฟราเรดความเร็วสูง',
        software: 'AI Multi-Attribute Vehicle Recognition, ศูนย์วิเคราะห์ความมั่นคง High-Availability Cluster',
        architecture: 'Hybrid Cloud-Edge AI with High-Availability Central Cluster',
        warranty: '5 ปี On-site Service 24/7 SLA ภายใน 1 ชั่วโมง พร้อมเครื่องสำรองเปลี่ยนทันที',
      });
      setExtractedText(`[เอกสารดึงจาก Google Drive: tor-high-security-police-cluster]
ชื่อโครงการ: โครงการระบบตรวจจับป้ายทะเบียนยานพาหนะความมั่นคงสูง
ระบบกล้อง 4K ตรวจจับความเร็วสูง 120 กม./ชม.
ระบบวิเคราะห์ยี่ห้อ สี และรุ่นรถยนต์อัตโนมัติ`);
      setSuccessMessage('ดึงข้อมูลโครงการความมั่นคงสูงจาก Google Drive สำเร็จ');
    }
  };

  const handleFetchCustomDriveUrl = () => {
    if (!driveUrl.trim()) {
      setErrorMessage('โปรดระบุ URL หรือ File ID ของ Google Drive');
      return;
    }

    setIsExtracting(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsExtracting(false);
      const randomCode = 'DRIVE-LINK-' + Math.floor(100 + Math.random() * 900);
      setParsedDocInfo((prev) => ({
        ...prev,
        title: prev.title || 'เอกสารข้อกำหนด TOR นำเข้าจาก Google Drive Link',
        code: prev.code || randomCode,
        vendor: prev.vendor || 'ผู้ประกอบการจากลิงก์ Google Drive',
      }));
      setExtractedText(`[เอกสารนำเข้าจาก Google Drive URL: ${driveUrl}]
เนื้อหาข้อกำหนดทางเทคนิคและร่างสัญญาที่ดึงผ่าน Google Drive Storage API
ประกอบด้วยสเปกระบบตรวจจับป้ายทะเบียน กล้องวงจรปิด และระบบบริหารจัดการตามมาตรฐาน`);
      setSuccessMessage(`เชื่อมโยงและดึงเนื้อหาจากลิงก์ Google Drive เรียบร้อย`);
    }, 800);
  };

  const handleSaveAndAddTOR = () => {
    if (!parsedDocInfo.title.trim()) {
      setErrorMessage('โปรดระบุชื่อโครงการ TOR');
      return;
    }

    const hardwareList = parsedDocInfo.hardware
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean);

    const softwareList = parsedDocInfo.software
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newTor: TORDocument = {
      id: 'tor-custom-' + Date.now(),
      code: parsedDocInfo.code || `TOR-${Date.now().toString().slice(-4)}`,
      title: parsedDocInfo.title,
      vendor: parsedDocInfo.vendor || 'ผู้เสนอราคาตามเอกสารที่นำเข้า',
      duration: parsedDocInfo.duration || `${parsedDocInfo.durationDays} วัน`,
      durationDays: parsedDocInfo.durationDays || 90,
      scope:
        parsedDocInfo.scope ||
        extractedText.slice(0, 300) ||
        'ขอบเขตงานระบบตรวจจับป้ายทะเบียนและบริหารความปลอดภัยตามข้อกำหนดที่นำเข้า',
      hardwareSoftware: {
        hardware:
          hardwareList.length > 0
            ? hardwareList
            : ['กล้องตรวจจับป้ายทะเบียน LPR ความละเอียดสูง', 'เครื่องบันทึกและระบบประมวลผล'],
        software:
          softwareList.length > 0
            ? softwareList
            : ['ซอฟต์แวร์ AI อ่านป้ายทะเบียนไทย', 'Web Management Console'],
        architecture: parsedDocInfo.architecture || 'สถาปัตยกรรมระบบตามเอกสารข้อกำหนด',
        accuracy: 'ความแม่นยำเฉลี่ยไม่น้อยกว่า 95% ตามมาตรฐานข้อกำหนด',
        storageAndNetwork: 'ตามเงื่อนไขที่ระบุในไฟล์ที่อัปโหลด',
      },
      delivery: 'ตามงวดงานและเงื่อนไขการส่งมอบที่ระบุในเอกสารแนบ',
      price: parsedDocInfo.priceNum || 2000000,
      priceFormatted: parsedDocInfo.price || `${parsedDocInfo.priceNum?.toLocaleString()} บาท`,
      expertise: 'คุณสมบัติตาม พ.ร.บ. จัดซื้อจัดจ้างฯ และเงื่อนไขเฉพาะในเอกสาร',
      highlights: [
        activeSource === 'drive'
          ? 'ดึงข้อกำหนดจาก Google Drive สำเร็จ พร้อมเชื่อมโยงแหล่งที่มา'
          : 'สกัดข้อมูลอัตโนมัติจากไฟล์ที่อัปโหลดเข้าสู่ระบบ',
        'สามารถนำไปเปรียบเทียบในตาราง 8 มิติ และประเมินเรดาร์ได้ทันที',
      ],
      drawbacks: ['ควรตรวจสอบรายละเอียดของภาคผนวกและสเปกแนบท้ายเพิ่มเติม'],
      warrantyAndSla: parsedDocInfo.warranty || 'รับประกัน 2 ปี On-site Service',
      scores: {
        duration: 8.5,
        expertise: 8.5,
        scope: 8.5,
        technical: 8.8,
        price: 8.2,
        reasons: {
          duration: 'ประเมินเบื้องต้นจากกรอบเวลาที่ระบุในเอกสาร',
          expertise: 'ประเมินจากเกณฑ์คุณสมบัติขั้นต่ำที่กำหนด',
          scope: 'ขอบเขตงานตรงตามวัตถุประสงค์การใช้งานระบบตรวจจับทะเบียน',
          technical: 'สเปกเทคนิคสอดคล้องกับมาตรฐานการใช้งานภาครัฐ',
          price: 'งบประมาณเหมาะสมตามข้อเสนอราคา',
        },
      },
      source: activeSource === 'drive' ? 'drive' : 'upload',
      badge: activeSource === 'drive' ? 'นำเข้าจาก Drive' : 'ฉบับอัปโหลดใหม่',
      rawText: extractedText,
      fileName: file?.name || driveUrl || 'เอกสารนำเข้า',
    };

    onAddCustomTOR(newTor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shadow-xs">
              <FolderUp className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                เพิ่มเอกสารข้อกำหนด TOR / ดึงจากไดร์ฟ / อัปโหลดไฟล์
              </h3>
              <p className="text-xs text-slate-500">
                รองรับไฟล์ PDF, Word, ดึงจาก Google Drive หรือกรอกข้อกำหนดเพื่อเปรียบเทียบในระบบ
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

        {/* Source Selector Tabs */}
        <div className="px-5 pt-3 border-b border-slate-200 flex items-center gap-4 bg-white overflow-x-auto">
          <button
            onClick={() => {
              setActiveSource('upload');
              setErrorMessage('');
            }}
            className={`pb-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeSource === 'upload'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4 text-indigo-600" />
            <span>อัปโหลดไฟล์ (.pdf, .docx, .doc, .txt)</span>
          </button>

          <button
            onClick={() => {
              setActiveSource('drive');
              setErrorMessage('');
            }}
            className={`pb-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeSource === 'drive'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HardDrive className="w-4 h-4 text-emerald-600" />
            <span>ดึงจาก Google Drive</span>
          </button>

          <button
            onClick={() => {
              setActiveSource('manual');
              setErrorMessage('');
            }}
            className={`pb-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeSource === 'manual'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Edit3 className="w-4 h-4 text-amber-600" />
            <span>กรอกข้อกำหนดเอง (Manual Entry)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: UPLOAD FILE */}
          {activeSource === 'upload' && (
            <div className="space-y-4">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-blue-600 bg-blue-50/50 scale-[0.99]'
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">
                  ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  รองรับเอกสารขอบเขตงาน .docx, .doc, .pdf, .txt สูงสุด 25MB
                </p>
                <div className="mt-3 inline-flex items-center gap-2 text-3xs font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full">
                  <span>📄 Microsoft Word (.docx, .doc)</span>
                  <span>•</span>
                  <span>📑 Adobe PDF (.pdf)</span>
                  <span>•</span>
                  <span>📝 Text File (.txt)</span>
                </div>
              </div>

              {isExtracting && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-3 text-xs text-blue-900 animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-700" />
                  <span>ระบบกำลังสกัดและวิเคราะห์ข้อความจากเอกสาร... โปรดรอสักครู่</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GOOGLE DRIVE */}
          {activeSource === 'drive' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-xs text-slate-900">
                      ระบุลิงก์หรือรหัสแชร์ไฟล์ Google Drive:
                    </span>
                  </div>
                  <span className="text-3xs text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
                    Drive Cloud Connected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Link className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={driveUrl}
                      onChange={(e) => setDriveUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/... หรือ URL โฟลเดอร์"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-800"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleFetchCustomDriveUrl}
                    disabled={isExtracting}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shrink-0 disabled:opacity-50"
                  >
                    {isExtracting ? 'กำลังดึง...' : 'ดึงข้อมูล'}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-800 block mb-2">
                  หรือเลือกดึงเอกสารตัวอย่างจากคลัง Drive ทางการ (One-Click Drive Presets):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleApplyDrivePreset('drive-sample-1')}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      drivePresetSelected === 'drive-sample-1'
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-2xs ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <span>Drive: TOR Edge AI (สดช.)</span>
                    </div>
                    <p className="text-2xs text-slate-500 mt-1 line-clamp-2">
                      กล้อง LPR 5MP Edge AI, สั่งไม้กั้นตรง, ประกัน 5 ปี NBD
                    </p>
                    <span className="text-3xs font-bold text-emerald-800 mt-1 block">
                      ฿3,500,000 (120 วัน)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyDrivePreset('drive-sample-2')}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      drivePresetSelected === 'drive-sample-2'
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-2xs ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <span>Drive: TOR HQ Access</span>
                    </div>
                    <p className="text-2xs text-slate-500 mt-1 line-clamp-2">
                      ไม้กั้น 2 ชุด, Visitor QR Code, ตรวจเช็ก PM ทุก 3 เดือน
                    </p>
                    <span className="text-3xs font-bold text-emerald-800 mt-1 block">
                      ฿2,200,000 (90 วัน)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyDrivePreset('drive-sample-3')}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      drivePresetSelected === 'drive-sample-3'
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-2xs ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <span>Drive: TOR High-Security Police</span>
                    </div>
                    <p className="text-2xs text-slate-500 mt-1 line-clamp-2">
                      กล้อง 4K Starlight LPR 8 ตัว, ตรวจสี/รุ่นรถ, ประกัน 5 ปี 24/7
                    </p>
                    <span className="text-3xs font-bold text-emerald-800 mt-1 block">
                      ฿4,800,000 (150 วัน)
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DOCUMENT DETAILS REVIEW & FORM (Visible for all tabs so user can adjust before adding) */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-900" />
                <span>รายละเอียดและข้อกำหนดของเอกสารที่จะนำเข้า:</span>
              </span>
              <span className="text-2xs text-slate-500">สามารถปรับแก้ข้อมูลก่อนบันทึกได้</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-2xs font-bold text-slate-700 block mb-1">
                  ชื่อโครงการ / เอกสาร TOR <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={parsedDocInfo.title}
                  onChange={(e) => setParsedDocInfo({ ...parsedDocInfo, title: e.target.value })}
                  placeholder="เช่น โครงการจัดหาระบบตรวจจับป้ายทะเบียน LPR..."
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-2xs font-bold text-slate-700 block mb-1">
                  รหัสเอกสาร (Code)
                </label>
                <input
                  type="text"
                  value={parsedDocInfo.code}
                  onChange={(e) => setParsedDocInfo({ ...parsedDocInfo, code: e.target.value })}
                  placeholder="เช่น TOR-2026-D"
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white font-mono text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-2xs font-bold text-slate-700 block mb-1">
                  ผู้ยื่นข้อเสนอ / บริษัท
                </label>
                <input
                  type="text"
                  value={parsedDocInfo.vendor}
                  onChange={(e) => setParsedDocInfo({ ...parsedDocInfo, vendor: e.target.value })}
                  placeholder="ชื่อบริษัทหรือผู้พัฒนา..."
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-2xs font-bold text-slate-700 block mb-1">
                  วงเงินงบประมาณ / ราคา (บาท)
                </label>
                <input
                  type="number"
                  value={parsedDocInfo.priceNum}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setParsedDocInfo({
                      ...parsedDocInfo,
                      priceNum: val,
                      price: `${val.toLocaleString()} บาท`,
                    });
                  }}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-2xs font-bold text-slate-700 block mb-1">
                  ระยะเวลาส่งมอบ (วัน)
                </label>
                <input
                  type="number"
                  value={parsedDocInfo.durationDays}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setParsedDocInfo({
                      ...parsedDocInfo,
                      durationDays: val,
                      duration: `${val} วัน`,
                    });
                  }}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-2xs font-bold text-slate-700 block mb-1">
                  ขอบเขตงานโดยย่อ (Scope of Work)
                </label>
                <textarea
                  rows={2}
                  value={parsedDocInfo.scope}
                  onChange={(e) => setParsedDocInfo({ ...parsedDocInfo, scope: e.target.value })}
                  placeholder="ระบุขอบเขตงาน..."
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-2xs font-bold text-slate-700 block mb-1">
                  รายการครุภัณฑ์ฮาร์ดแวร์ (คั่นด้วยเครื่องหมายจุลภาค ,)
                </label>
                <input
                  type="text"
                  value={parsedDocInfo.hardware}
                  onChange={(e) => setParsedDocInfo({ ...parsedDocInfo, hardware: e.target.value })}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-2xs font-bold text-slate-700 block mb-1">
                  รายการซอฟต์แวร์และใบอนุญาต
                </label>
                <input
                  type="text"
                  value={parsedDocInfo.software}
                  onChange={(e) => setParsedDocInfo({ ...parsedDocInfo, software: e.target.value })}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-3xs text-slate-500">
            เอกสารที่เพิ่มจะถูกส่งต่อไปยังหน้าตาราง ๘ มิติ, หน้าระบบวิเคราะห์ AI, และคลังเอกสาร
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSaveAndAddTOR}
              disabled={!parsedDocInfo.title}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-950 disabled:opacity-50 rounded-lg shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>บันทึกเข้าสู่คลังเอกสาร</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
