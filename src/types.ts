export interface PassportDetails {
  passportNumber: string;
  issuingCountry: string;
  issueDate: string;
  expiryDate: string;
  placeOfIssue: string;
  visaStatus: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  passport?: PassportDetails;
  declaration?: string;
  email: string;
  phonePrefix: string;
  phone: string;
  website: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  aboutMe: string;
  avatarUrl: string;
  socials: { platform: string; link: string }[];
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  employer: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export interface Education {
  id: string;
  title: string;
  institution: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  eqfLevel: string;
  fieldOfStudy: string;
}

export interface Certification {
  id: string;
  title: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface LanguageSkill {
  id: string;
  language: string;
  isMotherTongue: boolean;
  listening: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  reading: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  spokenInteraction: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  spokenProduction: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  writing: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface CoverLetter {
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  city: string;
  country: string;
  date: string;
  subject: string;
  openingSalutation: string;
  bodyParagraphs: string;
  closingSalutation: string;
}

export interface EuropassCVData {
  lang: string;
  personal: PersonalInfo;
  workExperiences: WorkExperience[];
  educationList: Education[];
  certifications: Certification[];
  languages: LanguageSkill[];
  digitalSkills: string[];
  skillsList: string[];
  drivingLicences: string[];
  customSections: CustomSection[];
  coverLetter?: CoverLetter;
  templateId: 'standard' | 'modern' | 'compact' | 'classic' | 'sidebar' | 'minimalist' | 'creative' | 'corporate' | 'academic' | 'technical' | 'nordic' | 'elegant' | 'hybrid' | 'timeline' | 'industrial';
  primaryColor: string;
}
