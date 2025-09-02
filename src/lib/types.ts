// Survey Data Types for Manam Islanders Resettlement Program

export interface HouseholdMember {
  id: string;
  fullName: string;
  sex: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  age: number;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Separated';
  relationshipToHead: string;
  educationLevel: 'None' | 'Primary' | 'Secondary' | 'Tertiary' | 'Vocational';
  occupation: string;
  skills: string[];
  disabilityStatus: string;
  // Add biometric data
  biometricData?: BiometricData;
}

export interface BiometricData {
  photoUrl?: string;
  photoBlob?: string; // Base64 encoded photo
  fingerprints?: FingerprintData[];
  biometricId?: string; // Unique biometric identifier
  capturedAt?: string;
  capturedBy?: string; // Name of person who captured the data
  verificationStatus?: 'pending' | 'verified' | 'failed';
}

export interface FingerprintData {
  finger: 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';
  hand: 'left' | 'right';
  template?: string; // Fingerprint template data
  image?: string; // Base64 encoded fingerprint image
  quality?: number; // Quality score 0-100
  capturedAt?: string;
}

export interface BiometricsInformation {
  householdId: string;
  memberBiometrics: Array<{
    memberId: string;
    memberName: string;
    biometricData: BiometricData;
  }>;
  captureDevice?: string;
  captureLocation?: string;
  capturedBy: string; // Survey enumerator name
  captureDate: string;
  notes?: string;
}

export interface DemographicInformation {
  householdId: string;
  familyId: string;
  members: HouseholdMember[];
}

export interface HouseholdStructure {
  householdHead: string;
  householdSize: number;
  familyClanAffiliation: string;
  chiefLeaderLink: string;
  dependents: {
    childrenUnder18: number;
    elderlyAbove60: number;
    widows: number;
    orphans: number;
  };
}

export interface CulturalIdentity {
  clanName: string;
  subClanLineage: string;
  traditionalChief: string;
  culturalGroups: string[];
  culturalRestrictions: string;
}

export interface CurrentLocation {
  campVillageName: string;
  gpsCoordinates: {
    latitude: number;
    longitude: number;
  };
  yearMoved: number;
  previousLocations: string[];
  shelterType: 'Temporary hut' | 'Permanent house' | 'Semi-permanent' | 'Other';
  shelterDescription: string;
}

export interface ResettlementNeeds {
  willingnessToRelocate: boolean;
  preferredLandSize: {
    perHousehold: number;
    perClan: number;
  };
  housingNeeds: {
    numberOfRooms: number;
    houseType: string;
  };
  agriculturalLandRequirement: {
    subsistenceFarming: number;
    cashCrop: number;
    livestock: number;
  };
  communalFacilitiesNeeded: string[];
  skillsToContribute: string[];
}

export interface LivelihoodIncome {
  mainIncomeSource: 'Fishing' | 'Farming' | 'Remittances' | 'Government aid' | 'Informal business' | 'Other';
  secondaryIncomeSources: string[];
  foodSecurityStatus: 'Self-sufficient' | 'Dependent on aid' | 'Mixed';
  assetsOwned: string[];
}

export interface HealthSocialServices {
  accessToHealthServices: {
    nearestClinic: string;
    distanceToClinic: number;
    accessToHospital: boolean;
    traditionalHealer: boolean;
  };
  healthStatus: {
    chronicIllness: string[];
    maternalHealth: string;
    childHealth: string;
  };
  immunizationStatus: {
    childrenImmunized: boolean;
    details: string;
  };
  waterAccess: {
    hasCleanWater: boolean;
    sourceType: 'River' | 'Well' | 'Borehole' | 'Piped' | 'Other';
  };
  sanitation: {
    toiletAvailable: boolean;
    toiletType: string;
  };
}

export interface EducationYouth {
  schoolAttendance: {
    childrenInSchool: number;
    totalSchoolAgeChildren: number;
  };
  distanceToSchool: number;
  literacyLevel: {
    adultLiteracy: boolean;
    details: string;
  };
  vocationalTraining: string[];
}

export interface LandResourceOwnership {
  landOwnershipStatus: 'Own land' | 'Government land' | 'Private land' | 'Disputed';
  landDisputes: string;
  accessToResources: {
    fishingGrounds: boolean;
    gardens: boolean;
    forests: boolean;
  };
  communalResourceRights: string;
}

export interface GovernanceSecurity {
  traditionalLeadership: {
    chiefCouncilStructure: string;
    campLeadershipInvolvement: boolean;
  };
  conflictIssues: string[];
  lawOrderConcerns: string[];
}

export interface VulnerabilityNeeds {
  femaleHeadedHouseholds: boolean;
  orphansPresent: boolean;
  elderlyWithoutSupport: boolean;
  personsWithDisabilities: string[];
  dependentOnSupport: boolean;
}

export interface FutureAspirations {
  educationAspirations: string[];
  skillsTrainingNeeds: string[];
  preferredLivelihood: string[];
  expectationsFromGovernment: string[];
}

export interface SurveyData {
  id: string;
  createdAt: string;
  updatedAt: string;
  demographicInfo: DemographicInformation;
  householdStructure: HouseholdStructure;
  culturalIdentity: CulturalIdentity;
  currentLocation: CurrentLocation;
  resettlementNeeds: ResettlementNeeds;
  livelihoodIncome: LivelihoodIncome;
  healthSocialServices: HealthSocialServices;
  educationYouth: EducationYouth;
  landResourceOwnership: LandResourceOwnership;
  governanceSecurity: GovernanceSecurity;
  vulnerabilityNeeds: VulnerabilityNeeds;
  futureAspirations: FutureAspirations;
  biometricsInfo: BiometricsInformation;
}

export type SurveyStep =
  | 'demographic'
  | 'household'
  | 'cultural'
  | 'biometrics'
  | 'location'
  | 'resettlement'
  | 'livelihood'
  | 'health'
  | 'education'
  | 'land'
  | 'governance'
  | 'vulnerability'
  | 'aspirations';

export interface SurveyFormData extends Partial<SurveyData> {
  currentStep: SurveyStep;
}
