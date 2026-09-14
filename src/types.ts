export interface TORScoreCriteria {
  duration: number; // 1-10
  expertise: number; // 1-10
  scope: number; // 1-10
  technical: number; // 1-10
  price: number; // 1-10
  reasons: {
    duration: string;
    expertise: string;
    scope: string;
    technical: string;
    price: string;
  };
}

export interface HardwareSoftwareSpec {
  hardware: string[];
  software: string[];
  architecture: string;
  accuracy: string;
  storageAndNetwork: string;
}

export interface ProjectExpert {
  id?: string;
  role: string;
  name: string;
  experienceYears: number;
  certifications: string[];
  education?: string;
  responsibilities: string;
  isKeyPersonnel: boolean;
}

export interface VendorExpertiseProfile {
  companyTrackRecord: string;
  yearsInBusiness: number;
  similarProjectsCount: number;
  registeredCapital?: string;
  isoStandards: string[];
  experts: ProjectExpert[];
  expertEvaluationScore?: number;
  expertScoreReason?: string;
}

export interface TORDocument {
  id: string;
  code: string;
  title: string;
  vendor: string;
  duration: string;
  durationDays: number;
  scope: string;
  hardwareSoftware: HardwareSoftwareSpec;
  delivery: string;
  price: number;
  priceFormatted: string;
  expertise: string;
  expertProfile?: VendorExpertiseProfile;
  highlights: string[];
  drawbacks: string[];
  warrantyAndSla: string;
  scores: TORScoreCriteria;
  source: 'preset' | 'upload' | 'drive';
  badge: string;
  rawText?: string;
  fileName?: string;
  isSelectedForCompare?: boolean;
}

export interface TORComparisonDifference {
  dimension: string;
  icon: string;
  values: { [torId: string]: string };
  procurementNote: string;
}

export interface ProcurementRecommendation {
  category: string;
  suggestedTORId: string;
  suggestedTORTitle: string;
  rationale: string;
  riskFactors: string[];
  procurementChecklist: string[];
  legalReference: string;
}

export interface AIComparisonResult {
  generatedAt: string;
  comparisonTitle: string;
  commonPoints: string[];
  differences: TORComparisonDifference[];
  strengthsSummary: { [torId: string]: string[] };
  weaknessesSummary: { [torId: string]: string[] };
  recommendations: ProcurementRecommendation[];
  formalReportText: string;
}

export interface TORFilterState {
  searchTerm: string;
  priceRange: 'all' | 'under1m' | '1mTo3m' | 'above3m';
  architecture: 'all' | 'edge' | 'server' | 'cluster';
  durationLimit: 'all' | '60' | '90' | '120';
  warrantyYears: 'all' | '2' | '3' | '5';
  barrierGate: 'all' | 'withBarrier' | 'withoutBarrier';
  selectedIds: string[];
}

export interface ProposalFormData {
  title: string;
  code: string;
  vendor: string;
  price: number;
  durationDays: number;
  lanesCount: number;
  hasBarrierGate: boolean;
  hasVisitorSystem: boolean;
  architecture: string;
  cameraResolution: string;
  cameraCount: number;
  storageDays: number;
  upsMinutes: number;
  accuracyDay: number;
  accuracyNight: number;
  warrantyYears: number;
  slaCriticalMinutes: number;
  pmFrequency: string;
  installmentsCount: number;
  experienceYears: number;
  similarProjectsCount: number;
  notes: string;
  customExperts?: ProjectExpert[];
  isoStandards?: string[];
}

export interface RFPRequest {
  id: string;
  projectTitle: string;
  rfpCode: string;
  department: string;
  budget: number;
  budgetFormatted: string;
  submissionDeadline: string;
  targetCompletionDays: number;
  scopeSummary: string;
  criteriaWeight: {
    price: number;
    technical: number;
  };
  invitedVendors: string[];
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  status: 'draft' | 'published' | 'closed';
  createdAt: string;
  baseTorId?: string;
  requirements: string[];
}

