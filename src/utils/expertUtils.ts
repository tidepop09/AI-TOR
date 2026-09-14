import { ProjectExpert, TORDocument, VendorExpertiseProfile } from '../types';

export const COMMON_CERTIFICATIONS = [
  'PMP (Project Management Professional)',
  'PRINCE2 Practitioner',
  'CISSP (Certified Information Systems Security Professional)',
  'CISM (Certified Information Security Manager)',
  'CompTIA Security+',
  'NVIDIA Deep Learning Institute (DLI) Certified',
  'CCNP Enterprise / CCNA',
  'AWS Certified Solutions Architect',
  'Red Hat Certified System Administrator (RHCSA)',
  'ITIL v4 Managing Professional',
  'ISO 27001 Lead Auditor / Implementer',
  'CCTV & Electronic Security Certified Technician',
];

export const ROLE_OPTIONS = [
  'ผู้จัดการโครงการ (Project Manager)',
  'วิศวกร AI และ Computer Vision (AI Specialist)',
  'ผู้เชี่ยวชาญความมั่นคงปลอดภัยไซเบอร์ (Cybersecurity Specialist)',
  'วิศวกรระบบเครือข่ายและฮาร์ดแวร์ (System & Network Engineer)',
  'วิศวกรสถาปัตยกรรมคลาวด์และฐานข้อมูล (Cloud & DB Architect)',
  'หัวหน้าช่างเทคนิคและงานติดตั้งระบบ (Field Deployment Lead)',
  'วิศวกรบริการหลังการขายและ SLA (SLA & Maintenance Engineer)',
];

export function getExpertProfile(tor: TORDocument): VendorExpertiseProfile {
  if (tor.expertProfile && tor.expertProfile.experts.length > 0) {
    return tor.expertProfile;
  }

  const isBasic = tor.id === 'tor-01' || tor.price < 1000000;
  const isHA = tor.id === 'tor-03' || tor.price > 4000000;
  const isEdge = tor.id === 'tor-04' || tor.hardwareSoftware.architecture.toLowerCase().includes('edge');

  if (isHA) {
    return {
      companyTrackRecord: 'ผลงานติดตั้งระบบความมั่นคงสูง คลัสเตอร์กล้อง และศูนย์ SOC รวมกว่า 12 โครงการภาครัฐ วงเงินรวมกว่า 120 ล้านบาท',
      yearsInBusiness: 12,
      similarProjectsCount: 8,
      registeredCapital: '50,000,000 บาท',
      isoStandards: ['ISO 9001:2015', 'ISO 27001:2022', 'CMMI Level 3', 'ISO 20000-1'],
      expertEvaluationScore: 9.8,
      expertScoreReason: 'คณะผู้เชี่ยวชาญสมบูรณ์แบบสูงสุด มีผู้จัดการโครงการ PMP, วิศวกรความมั่นคงไซเบอร์ CISSP/CISM, นักวิทยาศาสตร์ AI ระดับดุษฎีบัณฑิต และวิศวกรเครือข่าย CCNP',
      experts: [
        {
          role: 'ผู้อำนวยการและผู้จัดการโครงการ (Project Director & PM)',
          name: 'นายธนกร สิทธิประเสริฐ',
          experienceYears: 15,
          certifications: ['PMP (Project Management Professional)', 'PRINCE2 Practitioner'],
          education: 'วศ.ม. การจัดการวิศวกรรม จุฬาฯ',
          responsibilities: 'บริหารจัดการโครงการ ควบคุมแผนดำเนินงาน กำกับดูแลความเสี่ยง และรายงานคณะกรรมการตรวจรับ',
          isKeyPersonnel: true,
        },
        {
          role: 'หัวหน้าวิศวกร AI และ Computer Vision (Chief AI Scientist)',
          name: 'ดร.วรภัทร ชาญวิทย์',
          experienceYears: 12,
          certifications: ['NVIDIA Deep Learning Institute (DLI) Certified', 'Ph.D. Computer Engineering'],
          education: 'ปร.ด. วิศวกรรมคอมพิวเตอร์ (วิจัย LPR ภาษาไทย)',
          responsibilities: 'ควบคุมโมเดล Deep Learning LPR, การจูนความแม่นยำสภาพแสงกลางคืน และการประมวลผล Multi-lane',
          isKeyPersonnel: true,
        },
        {
          role: 'ผู้เชี่ยวชาญความมั่นคงปลอดภัยไซเบอร์ (Chief Information Security Lead)',
          name: 'นายปิยะพงษ์ ทัศนีย์',
          experienceYears: 11,
          certifications: ['CISSP', 'CISM', 'CompTIA Security+'],
          education: 'วศ.บ. วิศวกรรมความมั่นคงปลอดภัยไซเบอร์',
          responsibilities: 'กำกับดูแลการเข้ารหัส Snapshot Hash, RBAC, MFA, การเชื่อมโยง SIEM และการทำ Vulnerability Assessment (VA)',
          isKeyPersonnel: true,
        },
        {
          role: 'วิศวกรคลัสเตอร์ระบบเครือข่ายและความพร้อมใช้งานสูง (HA & Network Architect)',
          name: 'นายชัชวาล วัฒนกุล',
          experienceYears: 10,
          certifications: ['CCNP Enterprise', 'Red Hat Certified Architect (RHCA)'],
          education: 'วศ.บ. วิศวกรรมโทรคมนาคมและเครือข่าย',
          responsibilities: 'ออกแบบและติดตั้ง Central Cluster Failover, Store-and-Forward และระบบ Edge Offline Autonomous',
          isKeyPersonnel: true,
        },
        {
          role: 'หัวหน้าทีมสนับสนุนบริการหลังการขายและ SLA (SLA Operations Lead)',
          name: 'นายสุรเชษฐ์ นพรัตน์',
          experienceYears: 8,
          certifications: ['ITIL v4 Managing Professional', 'CCTV Advanced Specialist'],
          education: 'อส.บ. อิเล็กทรอนิกส์และระบบควบคุม',
          responsibilities: 'รับผิดชอบศูนย์ Helpdesk 24/7, การันตีตอบสนอง P1 ภายใน 15 นาที และการบำรุงรักษาเชิงป้องกัน PM ทุกไตรมาส',
          isKeyPersonnel: false,
        },
      ],
    };
  }

  if (isEdge) {
    return {
      companyTrackRecord: 'ความเชี่ยวชาญเฉพาะทางด้านสถาปัตยกรรม Edge AI, กล้อง Deep Learning ฝังตัว และระบบควบคุมประตูอัจฉริยะ',
      yearsInBusiness: 9,
      similarProjectsCount: 6,
      registeredCapital: '30,000,000 บาท',
      isoStandards: ['ISO 9001:2015', 'CE/FCC Hardware Compliance'],
      expertEvaluationScore: 9.0,
      expertScoreReason: 'มีวิศวกรผู้เชี่ยวชาญด้าน Embedded Deep Learning และการเชื่อมต่อ Hardware Relay ควบคุมไม้กั้นตรงจากกล้อง',
      experts: [
        {
          role: 'ผู้จัดการโครงการ (Project Manager)',
          name: 'นายกิตติศักดิ์ เจริญพร',
          experienceYears: 10,
          certifications: ['PMP (Project Management Professional)'],
          education: 'วศ.บ. วิศวกรรมคอมพิวเตอร์',
          responsibilities: 'วางแผนงานติดตั้ง ประสานงานจุดติดตั้งเสาและกล้อง และจัดทำเอกสารส่งมอบงาน',
          isKeyPersonnel: true,
        },
        {
          role: 'ผู้เชี่ยวชาญระบบประมวลผลที่ขอบเครือข่าย (Embedded Edge AI Specialist)',
          name: 'ดร.สิทธิชัย ลิ้มศิริ',
          experienceYears: 9,
          certifications: ['NVIDIA Deep Learning Institute (DLI) Certified', 'Embedded Vision Specialist'],
          education: 'ปร.ด. วิศวกรรมสมองกลฝังตัว',
          responsibilities: 'ปรับแต่งอัลกอริทึม LPR ให้รันบนชิปตัวกล้อง 5MP ความแม่นยำ 98% และตั้งค่า Relay Output สั่งเปิดไม้กั้นโดยตรง',
          isKeyPersonnel: true,
        },
        {
          role: 'วิศวกรบูรณาการระบบและ API (API & Systems Integration Lead)',
          name: 'นายมนัสวี เด่นดวง',
          experienceYears: 8,
          certifications: ['AWS Certified Solutions Architect', 'OpenAPI Architect'],
          education: 'วท.บ. วิทยาการคอมพิวเตอร์',
          responsibilities: 'เชื่อมต่อ Push Webhook, REST API และพัฒนา Web Management Console ให้รองรับการทำงานแบบ Client-less',
          isKeyPersonnel: true,
        },
        {
          role: 'วิศวกรซ่อมบำรุงภาคสนาม On-site NBD (Hardware & Field Engineer)',
          name: 'นายกานต์ วรพจน์',
          experienceYears: 6,
          certifications: ['CompTIA Security+', 'CCTV Certified Technician'],
          education: 'อส.บ. เทคโนโลยีคอมพิวเตอร์อุตสาหกรรม',
          responsibilities: 'ดูแลการเปลี่ยนอะไหล่ On-site วันทำการถัดไป (NBD) และการตรวจสอบ PM ปีละ 2 ครั้ง รวม 10 ครั้งตลอด 5 ปี',
          isKeyPersonnel: false,
        },
      ],
    };
  }

  if (isBasic) {
    return {
      companyTrackRecord: 'ผลงานติดตั้งระบบกล้องวงจรปิด CCTV และบันทึกข้อมูลทั่วไปกับหน่วยงานเอกชนและท้องถิ่น 3 โครงการ',
      yearsInBusiness: 4,
      similarProjectsCount: 2,
      registeredCapital: '5,000,000 บาท',
      isoStandards: ['ISO 9001:2015'],
      expertEvaluationScore: 7.0,
      expertScoreReason: 'มีบุคลากรช่างเทคนิคและช่างติดตั้งพื้นฐานครบถ้วน แต่ไม่มีบุคลากรที่ได้รับใบรับรอง PMP หรือผู้เชี่ยวชาญ AI เฉพาะทาง',
      experts: [
        {
          role: 'ผู้ควบคุมงานและประสานงานโครงการ (Project Coordinator)',
          name: 'นายประวิทย์ มั่นคง',
          experienceYears: 5,
          certifications: ['CCTV & Electronic Security Certified Technician'],
          education: 'ปวส. ช่างอิเล็กทรอนิกส์และโทรคมนาคม',
          responsibilities: 'ควบคุมช่างติดตั้ง เดินสายสัญญาณ LAN/Fiber และประสานงานส่งมอบอุปกรณ์',
          isKeyPersonnel: true,
        },
        {
          role: 'ช่างเทคนิคระบบเครือข่ายและเซิร์ฟเวอร์ (Network & Server Technician)',
          name: 'นายอนุชา พลแสน',
          experienceYears: 4,
          certifications: ['CompTIA A+', 'CCNA Network Associate'],
          education: 'ปวส. คอมพิวเตอร์ธุรกิจและเครือข่าย',
          responsibilities: 'ติดตั้งเครื่องบันทึก NVR/เซิร์ฟเวอร์ และเซ็ตอัประบบเครือข่ายกล้อง 2 ชุด',
          isKeyPersonnel: true,
        },
      ],
    };
  }

  // Standard / Integrated AI (TOR-02 or others)
  return {
    companyTrackRecord: 'ผลงานติดตั้งระบบรักษาความปลอดภัยและ Access Control อัจฉริยะ 5 สัญญา วงเงินรวมกว่า 35 ล้านบาท ภายใน 3 ปี',
    yearsInBusiness: 8,
    similarProjectsCount: 5,
    registeredCapital: '20,000,000 บาท',
    isoStandards: ['ISO 9001:2015', 'ISO/IEC 29110'],
    expertEvaluationScore: 8.8,
    expertScoreReason: 'มีทีมวิศวกรครบทุกสาขาหลัก ทั้งผู้จัดการโครงการ PMP, วิศวกร AI Computer Vision, วิศวกรระบบไม้กั้น และช่างบริการ SLA',
    experts: [
      {
        role: 'ผู้จัดการโครงการ (Project Manager)',
        name: 'นายธีรเดช เจริญสุข',
        experienceYears: 9,
        certifications: ['PMP (Project Management Professional)'],
        education: 'วศ.บ. วิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยเกษตรศาสตร์',
        responsibilities: 'บริหารจัดการโครงการ ควบคุมงวดงาน 5 ช่วงเวลา และประสานงานตรวจรับ UAT 8 รายการ',
        isKeyPersonnel: true,
      },
      {
        role: 'วิศวกร AI และระบบวิเคราะห์ภาพ (AI Computer Vision Specialist)',
        name: 'ดร.กฤษดา เมธาวี',
        experienceYears: 8,
        certifications: ['NVIDIA Deep Learning Institute (DLI) Certified'],
        education: 'วศ.ม. ปัญญาประดิษฐ์ สถาบันเทคโนโลยีพระจอมเกล้าฯ',
        responsibilities: 'ปรับแต่งระบบอ่านป้ายทะเบียนไทย ตรวจจับประเภทรถยนต์และสีรถยนต์ และพัฒนาฟังก์ชัน Human Override',
        isKeyPersonnel: true,
      },
      {
        role: 'วิศวกรระบบและไม้กั้นอัตโนมัติ (Barrier Gate & Integration Engineer)',
        name: 'น.ส.พัชราภรณ์ มงคล',
        experienceYears: 7,
        certifications: ['CompTIA Security+', 'Automation Safety Specialist'],
        education: 'วศ.บ. วิศวกรรมระบบควบคุมและเครื่องมือวัด',
        responsibilities: 'ควบคุมระบบไม้กั้น Safety Sensor ป้องกันไม้ตีรถ และบูรณาการระบบ Visitor QR Code',
        isKeyPersonnel: true,
      },
      {
        role: 'วิศวกรงานบริการหลังการขายและ SLA (SLA & Field Engineer)',
        name: 'นายวรวุฒิ บุญญา',
        experienceYears: 5,
        certifications: ['CCTV Advanced Specialist', 'ITIL Foundation'],
        education: 'อส.บ. เทคโนโลยีคอมพิวเตอร์',
        responsibilities: 'ดูแลการตอบสนองแก้ไขปัญหาภายใน 2 ชั่วโมง และการทำ PM ตรวจสอบระบบทุก 3 เดือน',
        isKeyPersonnel: false,
      },
    ],
  };
}

export function evaluateExpertsSummary(experts: ProjectExpert[]): {
  score: number;
  keyPersonnelCount: number;
  totalPersonnelCount: number;
  averageYears: number;
  hasPmp: boolean;
  hasAiExpert: boolean;
  hasSecurityExpert: boolean;
  certificationsList: string[];
} {
  const total = experts.length;
  if (total === 0) {
    return {
      score: 5.0,
      keyPersonnelCount: 0,
      totalPersonnelCount: 0,
      averageYears: 0,
      hasPmp: false,
      hasAiExpert: false,
      hasSecurityExpert: false,
      certificationsList: [],
    };
  }

  const keyCount = experts.filter((e) => e.isKeyPersonnel).length;
  const totalYears = experts.reduce((acc, e) => acc + (e.experienceYears || 0), 0);
  const avgYears = Math.round((totalYears / total) * 10) / 10;

  const allCerts = Array.from(
    new Set(experts.flatMap((e) => e.certifications || []).filter(Boolean))
  );

  const hasPmp = allCerts.some((c) => c.toLowerCase().includes('pmp') || c.toLowerCase().includes('prince2'));
  const hasAiExpert = experts.some(
    (e) =>
      e.role.toLowerCase().includes('ai') ||
      e.role.toLowerCase().includes('vision') ||
      (e.certifications && e.certifications.some((c) => c.toLowerCase().includes('deep learning') || c.toLowerCase().includes('nvidia')))
  );
  const hasSecurityExpert = experts.some(
    (e) =>
      e.role.toLowerCase().includes('security') ||
      e.role.toLowerCase().includes('มั่นคง') ||
      (e.certifications && e.certifications.some((c) => c.toLowerCase().includes('cissp') || c.toLowerCase().includes('security+')))
  );

  let score = 7.0;
  if (total >= 4) score += 0.8;
  if (hasPmp) score += 0.8;
  if (hasAiExpert) score += 0.8;
  if (hasSecurityExpert) score += 0.6;
  if (avgYears >= 8) score += 0.5;

  score = Math.min(10, Math.round(score * 10) / 10);

  return {
    score,
    keyPersonnelCount: keyCount,
    totalPersonnelCount: total,
    averageYears: avgYears,
    hasPmp,
    hasAiExpert,
    hasSecurityExpert,
    certificationsList: allCerts,
  };
}
