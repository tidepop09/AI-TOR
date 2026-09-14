import React, { useState, useRef } from 'react';
import { TORDocument } from '../types';
import { getExpertProfile, evaluateExpertsSummary } from '../utils/expertUtils';
import {
  FileText,
  Printer,
  Download,
  Scale,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Award,
  RefreshCw,
  Users
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ProcurementMemoProps {
  tors: TORDocument[];
}

export const ProcurementMemo: React.FC<ProcurementMemoProps> = ({ tors }) => {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const memoRef = useRef<HTMLDivElement>(null);

  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleExportPDF = async () => {
    if (!memoRef.current) return;
    setIsExportingPDF(true);
    setExportProgress('กำลังเตรียมจัดหน้าเอกสาร PDF สำหรับคณะกรรมการ...');

    try {
      // Create high-res canvas of the memorandum report element
      const element = memoRef.current;
      
      setExportProgress('กำลังประมวลผลฟอนต์และตารางเปรียบเทียบ...');
      const canvas = await html2canvas(element, {
        scale: 2, // 2x for sharp printing & reading
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      setExportProgress('กำลังจัดรูปเล่มรายงานขนาด A4...');
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Subsequent pages if content overflows A4
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      setExportProgress('กำลังสร้างไฟล์รายงาน PDF...');
      const fileName = `รายงานผลการวิเคราะห์เปรียบเทียบ_TOR_คณะกรรมการตรวจรับพัสดุ_${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('PDF Export Error:', err);
      // Fallback to browser print which also saves as PDF
      window.print();
    } finally {
      setIsExportingPDF(false);
      setExportProgress('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 no-print">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-900" />
            <span>รายงานผลการวิเคราะห์เปรียบเทียบ TOR สำหรับเสนอคณะกรรมการตรวจรับพัสดุ</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            เอกสารจัดรูปแบบตามระเบียบสารบรรณภาครัฐ พร้อมตาราง ๘ ประเด็น คะแนน ๕ เกณฑ์ และช่องลงนามคณะกรรมการ
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="export-pdf-direct-btn"
            disabled={isExportingPDF}
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-bold shadow-xs transition-all disabled:opacity-50"
          >
            {isExportingPDF ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                <span>{exportProgress || 'กำลังดาวน์โหลด PDF...'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-amber-300" />
                <span>ดาวน์โหลดไฟล์ PDF พร้อมใช้งาน (.pdf)</span>
              </>
            )}
          </button>

          <button
            id="print-memo-btn"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-300 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>พิมพ์เอกสาร (Print)</span>
          </button>
        </div>
      </div>

      {/* Official Thai Government Memorandum Sheet */}
      <div
        ref={memoRef}
        id="official-procurement-memo"
        className="bg-white rounded-2xl border border-slate-300 p-8 sm:p-14 shadow-sm max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 print:m-0 text-slate-900 font-serif leading-relaxed"
      >
        {/* Emblem / Garuda Header representation */}
        <div className="text-center mb-6">
          <div className="inline-block p-2 rounded-full border border-slate-400 mb-2">
            <Scale className="w-10 h-10 text-slate-900 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
            บันทึกข้อความ
          </h2>
        </div>

        {/* Memo Meta Table */}
        <div className="border-b-2 border-slate-900 pb-3 mb-6 space-y-1.5 text-sm font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <span className="font-bold">ส่วนราชการ: </span>
              <span>กลุ่มงานพัสดุและบริหารทรัพย์สิน กองกลาง</span>
            </div>
            <div>
              <span className="font-bold">โทร: </span>
              <span>ภายใน ๒๓๔๐-๒</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <span className="font-bold">ที่: </span>
              <span>พส ๐๐๑/๒๕๖๙</span>
            </div>
            <div>
              <span className="font-bold">วันที่: </span>
              <span>{currentDate}</span>
            </div>
          </div>
          <div>
            <span className="font-bold">เรื่อง: </span>
            <span className="font-semibold">
              รายงานผลการวิเคราะห์และเปรียบเทียบข้อกำหนดของงาน (TOR) โครงการระบบตรวจจับป้ายทะเบียนรถยนต์อัตโนมัติ (LPR) เพื่อเสนอคณะกรรมการตรวจรับพัสดุ
            </span>
          </div>
        </div>

        {/* Salutation to Inspection Committee */}
        <div className="text-sm font-sans mb-5 font-bold text-slate-950 flex items-center gap-2">
          <span>เรียน</span>
          <span>ประธานกรรมการและคณะกรรมการตรวจรับพัสดุ</span>
        </div>

        {/* Section 1: Background & Objective */}
        <div className="space-y-4 text-xs sm:text-sm font-sans leading-relaxed text-slate-800 text-justify">
          <p className="indent-8">
            ตามคำสั่งแต่งตั้งคณะกรรมการตรวจรับพัสดุและเจ้าหน้าที่พัสดุ โครงการจัดหาระบบตรวจจับและอ่านป้ายทะเบียนรถยนต์อัตโนมัติ
            (License Plate Recognition : LPR) เพื่อยกระดับความมั่นคงปลอดภัยและบันทึกยานพาหนะเข้า-ออกอาคารสถานที่
            ฝ่ายพัสดุได้ดำเนินการรวบรวมข้อกำหนดและวิเคราะห์เปรียบเทียบเอกสารขอบเขตของงาน (TOR) และข้อเสนอทางเทคนิคที่ยื่นในระบบ
            จำนวน <strong>{tors.length} ฉบับ</strong> โดยได้ประเมินตามกรอบ พ.ร.บ. การจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. ๒๕๖๐
            มาตรา ๘ เพื่อให้เกิดความคุ้มค่า โปร่งใส มีประสิทธิภาพ และประสิทธิผลสูงสุดต่อทางราชการ ดังมีรายละเอียดเสนอต่อไปนี้
          </p>

          {/* Table: Overview & Radar Total Score */}
          <div className="my-5">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2 font-sans flex items-center gap-1.5">
              <span>ตารางที่ ๑ : สรุปภาพรวมการเปรียบเทียบข้อกำหนดและคะแนนประเมิน (เต็ม ๕๐ คะแนน)</span>
            </h4>
            <div className="overflow-x-auto border border-slate-400 rounded-xs">
              <table className="w-full text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 border-b border-slate-400">
                    <th className="p-2.5 border-r border-slate-300 text-center font-bold w-10">ที่</th>
                    <th className="p-2.5 border-r border-slate-300 text-left font-bold w-36">รหัส / ชื่อ TOR</th>
                    <th className="p-2.5 border-r border-slate-300 text-left font-bold">บริษัทผู้เสนอราคา</th>
                    <th className="p-2.5 border-r border-slate-300 text-right font-bold w-24">วงเงินที่เสนอ</th>
                    <th className="p-2.5 border-r border-slate-300 text-center font-bold w-18">ระยะเวลา</th>
                    <th className="p-2.5 border-r border-slate-300 text-center font-bold w-18">รับประกัน</th>
                    <th className="p-2.5 text-center font-bold w-20 bg-blue-50 text-blue-950">คะแนนรวม</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {tors.map((t, idx) => {
                    const totalScore =
                      t.scores.duration +
                      t.scores.expertise +
                      t.scores.scope +
                      t.scores.technical +
                      t.scores.price;
                    return (
                      <tr key={t.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="p-2.5 border-r border-slate-300 text-center font-bold">
                          {idx + 1}
                        </td>
                        <td className="p-2.5 border-r border-slate-300">
                          <div className="font-bold text-slate-900">{t.code}</div>
                          <div className="text-3xs text-slate-500 line-clamp-1">{t.badge}</div>
                        </td>
                        <td className="p-2.5 border-r border-slate-300">{t.vendor}</td>
                        <td className="p-2.5 border-r border-slate-300 text-right font-bold text-slate-900">
                          {t.priceFormatted}
                        </td>
                        <td className="p-2.5 border-r border-slate-300 text-center">{t.duration}</td>
                        <td className="p-2.5 border-r border-slate-300 text-center text-3xs">
                          {t.warrantyAndSla.split(',')[0]}
                        </td>
                        <td className="p-2.5 text-center font-extrabold text-blue-900 bg-blue-50/50 text-xs">
                          {totalScore.toFixed(1)} / ๕๐
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: 8 Dimensions Detailed Comparison Breakdown */}
          <div className="my-5">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2 font-sans">
              <span>ตารางที่ ๒ : รายละเอียดการวิเคราะห์เปรียบเทียบตาม ๘ มิติข้อกำหนดพัสดุ</span>
            </h4>
            <div className="overflow-x-auto border border-slate-400 rounded-xs">
              <table className="w-full text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 border-b border-slate-400">
                    <th className="p-2 border-r border-slate-300 text-left font-bold w-40">มิติการพิจารณา</th>
                    {tors.map((t) => (
                      <th key={t.id} className="p-2 border-r border-slate-300 text-left font-bold">
                        {t.code}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  <tr className="bg-white">
                    <td className="p-2 border-r border-slate-300 font-bold bg-slate-50">๑. ชื่อ TOR</td>
                    {tors.map((t) => (
                      <td key={t.id} className="p-2 border-r border-slate-300 align-top text-3xs">
                        {t.title}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-slate-50/30">
                    <td className="p-2 border-r border-slate-300 font-bold bg-slate-50">๒. บริษัทผู้ยื่น</td>
                    {tors.map((t) => (
                      <td key={t.id} className="p-2 border-r border-slate-300 align-top text-3xs">
                        {t.vendor}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-white">
                    <td className="p-2 border-r border-slate-300 font-bold bg-slate-50">๓. ระยะเวลา</td>
                    {tors.map((t) => (
                      <td key={t.id} className="p-2 border-r border-slate-300 align-top text-3xs font-semibold">
                        {t.duration} ({t.durationDays} วัน)
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-slate-50/30">
                    <td className="p-2 border-r border-slate-300 font-bold bg-slate-50">๔. ขอบเขตงาน</td>
                    {tors.map((t) => (
                      <td key={t.id} className="p-2 border-r border-slate-300 align-top text-3xs">
                        {t.scope}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-white">
                    <td className="p-2 border-r border-slate-300 font-bold bg-slate-50">๕. ซอฟต์แวร์/ฮาร์ดแวร์</td>
                    {tors.map((t) => (
                      <td key={t.id} className="p-2 border-r border-slate-300 align-top text-3xs">
                        <div className="font-semibold text-blue-900">{t.hardwareSoftware.architecture}</div>
                        <div className="mt-1 text-slate-600">
                          {t.hardwareSoftware.hardware.slice(0, 2).join(', ')}
                        </div>
                        <div className="mt-0.5 text-slate-500">เกณฑ์: {t.hardwareSoftware.accuracy}</div>
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-slate-50/30">
                    <td className="p-2 border-r border-slate-300 font-bold bg-slate-50">๖. การส่งมอบงาน</td>
                    {tors.map((t) => (
                      <td key={t.id} className="p-2 border-r border-slate-300 align-top text-3xs">
                        {t.delivery}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-white">
                    <td className="p-2 border-r border-slate-300 font-bold bg-slate-50">๗. ราคา/งบประมาณ</td>
                    {tors.map((t) => (
                      <td key={t.id} className="p-2 border-r border-slate-300 align-top text-3xs font-bold">
                        {t.priceFormatted}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-slate-50/30">
                    <td className="p-2 border-r border-slate-300 font-bold bg-slate-50">๘. ความเชี่ยวชาญและคณะผู้เชี่ยวชาญ</td>
                    {tors.map((t) => {
                      const profile = getExpertProfile(t);
                      const summary = evaluateExpertsSummary(profile.experts);
                      return (
                        <td key={t.id} className="p-2 border-r border-slate-300 align-top text-3xs space-y-1">
                          <div className="font-semibold text-slate-800">{t.expertise}</div>
                          <div className="bg-purple-50 p-1.5 rounded border border-purple-200 text-purple-900 space-y-0.5">
                            <div className="font-bold">
                              คณะผู้เชี่ยวชาญ {summary.totalPersonnelCount} ท่าน (หลัก {summary.keyPersonnelCount} ท่าน)
                            </div>
                            <div className="text-slate-600">
                              {summary.hasPmp ? '• มีผู้จัดการโครงการ (PMP) ' : ''}
                              {summary.hasAiExpert ? '• มีผู้เชี่ยวชาญ AI Vision ' : ''}
                              {summary.hasSecurityExpert ? '• มีผู้เชี่ยวชาญความมั่นคงไซเบอร์' : ''}
                            </div>
                            <div className="font-bold text-amber-800">
                              คะแนนเกณฑ์: {t.scores.expertise}/๑๐ (ประสบการณ์เฉลี่ย {summary.averageYears} ปี)
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Technical & Legal Considerations */}
          <div className="space-y-2 mt-4 font-sans">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
              ๑. ข้อวิเคราะห์ทางเทคนิคและความคุ้มค่าตามมาตรา ๘ แห่ง พ.ร.บ. การจัดซื้อจัดจ้างฯ พ.ศ. ๒๕๖๐:
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed indent-4">
              (๑) <strong>ความคุ้มค่าของสถาปัตยกรรม (Edge AI vs Server-centric):</strong> ฉบับที่มีสถาปัตยกรรมประมวลผลที่กล้อง
              (Edge AI) สั่งเปิดไม้กั้นโดยตรงผ่าน Relay Output จะมีความพร้อมใช้งานสูงกว่า ไม่เกิดปัญหารถติดสะสมเมื่อเครือข่ายส่วนกลางขัดข้อง
              และช่วยลดภาระค่าเครื่องแม่ข่ายราคาแพง จึงตอบสนองหลักความคุ้มค่าและมีประสิทธิภาพอย่างยิ่ง
            </p>
            <p className="text-xs text-slate-700 leading-relaxed indent-4">
              (๒) <strong>ความโปร่งใสและการเปิดกว้าง:</strong> ข้อกำหนดทางเทคนิคต้องไม่เจาะจงเฉพาะผลิตภัณฑ์หนึ่งผลิตภัณฑ์ใด
              รองรับโปรโตคอลมาตรฐานสากล (ONVIF Profile S/G/T, RTSP, REST API) เพื่อให้สามารถเชื่อมต่อกับระบบอื่นในอนาคตได้
            </p>
            <p className="text-xs text-slate-700 leading-relaxed indent-4">
              (๓) <strong>การปฏิบัติตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. ๒๕๖๒ (PDPA):</strong> เนื่องจากภาพป้ายทะเบียนถือเป็นข้อมูลส่วนบุคคล
              คณะกรรมการตรวจรับพัสดุต้องกำหนดให้ผู้รับจ้างส่งมอบระบบที่มีการเข้ารหัสข้อมูล (Encryption in Transit & at Rest),
              ระบบบันทึก Audit Log ของผู้เข้าถึงข้อมูล และนโยบายทำลายภาพตามระยะเวลาที่ทางราชการกำหนด (Data Retention Policy)
            </p>
            <p className="text-xs text-slate-700 leading-relaxed indent-4">
              (๔) <strong>การตรวจสอบคุณสมบัติคณะผู้เชี่ยวชาญประจำโครงการ:</strong> เพื่อให้การบริหารโครงการเป็นไปตามมาตรฐานวิชาชีพ
              คณะกรรมการตรวจรับพัสดุควรตรวจสอบสำเนาวุฒิบัตร (เช่น PMP, AI Deep Learning Certification, CompTIA Security+)
              และหนังสือรับรองผลงานเดิมที่ผู้เสนอราคานำส่งว่าตรงตามเกณฑ์ที่หน่วยงานกำหนดหรือไม่
            </p>
          </div>

          {/* Section 3: Committee Decision Recommendations */}
          <div className="space-y-2 mt-4 font-sans">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
              ๒. ข้อเสนอแนะของฝ่ายพัสดุเพื่อประกอบการตรวจรับและพิจารณาของคณะกรรมการ:
            </h4>
            <div className="bg-slate-50 border border-slate-300 p-3 rounded-lg text-xs space-y-1.5 text-slate-800">
              <p>
                <strong>ข้อเสนอแนะที่ ๑:</strong> ในขั้นตอนตรวจรับงวดงานที่ ๑ (อุปกรณ์ฮาร์ดแวร์) ให้ตรวจสอบหนังสือแต่งตั้งตัวแทนจำหน่าย (Authorized Distributor)
                และหนังสือรับรองการรับประกันจากผู้ผลิตต้นสังกัด เพื่อป้องกันการนำเข้าสินค้าปลอมแปลงหรือสินค้าเทียบเคียงที่ไม่มีศูนย์บริการในประเทศไทย
              </p>
              <p>
                <strong>ข้อเสนอแนะที่ ๒:</strong> ในการตรวจรับงวดสุดท้าย (User Acceptance Testing - UAT) ให้ทำการทดสอบความแม่นยำในการตรวจจับทะเบียนรถจริง
                ทั้งในเวลากลางวันและกลางคืน จำนวนไม่น้อยกว่า ๑๐๐ คัน เพื่อให้เป็นไปตามเกณฑ์ความแม่นยำที่กำหนดในสัญญา
              </p>
              <p>
                <strong>ข้อเสนอแนะที่ ๓:</strong> กำหนดให้ผู้รับจ้างวางหลักประกันสัญญา (Performance Bond) ร้อยละ ๕ และผูกมัดเงื่อนไขการรับประกันและ SLA
                อย่างเข้มงวดตลอดระยะเวลาการรับประกันตามสัญญา
              </p>
            </div>
          </div>

          {/* Sign-off section for Acceptance Inspection Committee */}
          <div className="mt-10 pt-6 border-t border-slate-400 font-sans">
            <p className="text-center font-bold text-xs sm:text-sm text-slate-900 mb-6">
              คณะกรรมการตรวจรับพัสดุ ได้พิจารณาผลการวิเคราะห์เปรียบเทียบตามรายงานฉบับนี้แล้ว
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
              {/* Chairman */}
              <div className="space-y-1">
                <div className="h-14 flex items-end justify-center">
                  <span className="border-b border-dotted border-slate-600 w-44 inline-block"></span>
                </div>
                <p className="font-bold mt-1">( ............................................................ )</p>
                <p className="text-slate-600">ประธานกรรมการตรวจรับพัสดุ</p>
              </div>

              {/* Member */}
              <div className="space-y-1">
                <div className="h-14 flex items-end justify-center">
                  <span className="border-b border-dotted border-slate-600 w-44 inline-block"></span>
                </div>
                <p className="font-bold mt-1">( ............................................................ )</p>
                <p className="text-slate-600">กรรมการตรวจรับพัสดุ</p>
              </div>

              {/* Secretary */}
              <div className="space-y-1">
                <div className="h-14 flex items-end justify-center">
                  <span className="border-b border-dotted border-slate-600 w-44 inline-block"></span>
                </div>
                <p className="font-bold mt-1">( ............................................................ )</p>
                <p className="text-slate-600">กรรมการและเลขานุการ / เจ้าหน้าที่พัสดุ</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-dotted border-slate-300 text-3xs text-center text-slate-500">
              เอกสารฉบับนี้ออกโดยระบบ AI สนับสนุนการวิเคราะห์และเปรียบเทียบ TOR ของสำนักงานพัสดุ • อ้างอิงข้อเท็จจริงในเอกสารที่กำหนดให้เท่านั้น
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
