import type { EuropassCVData } from './types';

export const sampleCVData: EuropassCVData = {
  lang: 'en',
  personal: {
    firstName: 'Alexander',
    lastName: 'Novak',
    dateOfBirth: '1992-05-14',
    gender: 'Male',
    nationality: 'Slovak / European',
    passport: {
      passportNumber: 'SK9823410',
      issuingCountry: 'Slovakia (EU)',
      issueDate: '2020-08-15',
      expiryDate: '2030-08-15',
      placeOfIssue: 'Bratislava',
      visaStatus: 'EU Citizen / Unlimited Work Authorization'
    },
    declaration: 'I hereby declare that the information provided above is true and correct to the best of my knowledge and belief.',
    email: 'alexander.novak@europa.eu',
    phonePrefix: '+421',
    phone: '908 123 456',
    website: '',
    address: 'Avenue de Cortenbergh 100',
    postalCode: '1000',
    city: 'Brussels',
    country: 'Belgium',
    aboutMe: 'Experienced Senior Software Architect and European Project Specialist with over 8 years in designing scalable cloud platforms, managing cross-border engineering teams, and standardizing digital interoperability protocols for public and enterprise platforms across the European Union.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    socials: [
      { platform: 'LinkedIn', link: 'https://linkedin.com/in/alexandernovak' },
      { platform: 'GitHub', link: 'https://github.com/alexnovak-eu' },
      { platform: 'Facebook', link: 'https://facebook.com/alexandernovak' }
    ]
  },
  workExperiences: [
    {
      id: 'work-1',
      jobTitle: 'Lead Software Architect & Technical Project Lead',
      employer: 'European Digital Solutions Consortium',
      city: 'Brussels',
      country: 'Belgium',
      startDate: '2021-03',
      endDate: 'Present',
      isCurrent: true,
      description: '• Directed architecture for EU-wide digital credential validation portal serving 4M+ users.\n• Implemented microservices security standards aligning with eIDAS 2.0 regulations.\n• Led an international team of 14 engineers across 4 European countries.'
    },
    {
      id: 'work-2',
      jobTitle: 'Senior Full Stack Systems Developer',
      employer: 'TechInnovate Europe S.A.',
      city: 'Bratislava',
      country: 'Slovakia',
      startDate: '2017-09',
      endDate: '2021-02',
      isCurrent: false,
      description: '• Engineered high-performance REST and GraphQL APIs using Node.js, Typescript and Rust.\n• Reduced application response latency by 45% through aggressive caching and database optimization.\n• Championed CI/CD automation pipelines reducing deployment cycles from weeks to minutes.'
    }
  ],
  educationList: [
    {
      id: 'edu-1',
      title: 'Master of Science in Computer Engineering & Intelligent Systems',
      institution: 'Slovak University of Technology in Bratislava',
      city: 'Bratislava',
      country: 'Slovakia',
      startDate: '2014-09',
      endDate: '2016-06',
      isCurrent: false,
      eqfLevel: 'EQF Level 7',
      fieldOfStudy: 'Information Technology and Computer Science'
    },
    {
      id: 'edu-2',
      title: 'Bachelor of Science in Software Engineering',
      institution: 'Slovak University of Technology',
      city: 'Bratislava',
      country: 'Slovakia',
      startDate: '2011-09',
      endDate: '2014-06',
      isCurrent: false,
      eqfLevel: 'EQF Level 6',
      fieldOfStudy: 'Computer Software Engineering'
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      title: 'AWS Certified Solutions Architect – Professional',
      issuingOrganization: 'Amazon Web Services (AWS)',
      issueDate: '2022-04',
      expiryDate: '2025-04',
      credentialId: 'AWS-PSA-908123',
      credentialUrl: 'https://aws.amazon.com/verification'
    },
    {
      id: 'cert-2',
      title: 'Certified Information Systems Security Professional (CISSP)',
      issuingOrganization: '(ISC)²',
      issueDate: '2021-11',
      expiryDate: '2024-11',
      credentialId: 'CISSP-554190'
    }
  ],
  languages: [
    {
      id: 'lang-1',
      language: 'Slovak',
      isMotherTongue: true,
      listening: 'C2',
      reading: 'C2',
      spokenInteraction: 'C2',
      spokenProduction: 'C2',
      writing: 'C2'
    },
    {
      id: 'lang-2',
      language: 'English',
      isMotherTongue: false,
      listening: 'C2',
      reading: 'C2',
      spokenInteraction: 'C1',
      spokenProduction: 'C1',
      writing: 'C2'
    },
    {
      id: 'lang-3',
      language: 'German',
      isMotherTongue: false,
      listening: 'B2',
      reading: 'B2',
      spokenInteraction: 'B1',
      spokenProduction: 'B1',
      writing: 'B2'
    }
  ],
  digitalSkills: [
    'Frontend: React, TypeScript, Vue.js, Tailwind CSS, Next.js',
    'Backend & APIs: Node.js, Express, Python, Rust, PostgreSQL, Redis',
    'DevOps & Cloud: Docker, Kubernetes, AWS, CI/CD Pipelines, Git',
    'Standards & Security: eIDAS, OAuth2, OpenID Connect, REST, CyberSecurity'
  ],
  skillsList: [
    'Cross-functional Team Leadership',
    'Agile Scrum & Kanban Mastery',
    'International Communication',
    'Strategic Technical Planning',
    'Problem Solving & Critical Thinking'
  ],
  drivingLicences: ['B', 'A'],
  customSections: [
    {
      id: 'custom-2',
      title: 'References',
      content: 'Available upon request.'
    }
  ],
  coverLetter: {
    recipientName: 'Hiring Committee',
    recipientTitle: 'Head of Engineering & Talent Acquisition',
    companyName: 'European Digital Innovation Consortium',
    companyAddress: 'Rue de la Loi 200',
    city: 'Brussels',
    country: 'Belgium',
    date: '2026-08-10',
    subject: 'Application for Lead Software Architect Position',
    openingSalutation: 'Dear Hiring Committee,',
    bodyParagraphs: 'I am writing to express my strong interest in the Lead Software Architect position at European Digital Innovation Consortium. With over 8 years of experience in designing scalable distributed architectures, implementing eIDAS security protocols, and leading cross-border technical teams across Europe, I am eager to contribute to your digital transformation initiatives.\n\nIn my recent role at European Digital Solutions Consortium, I directed the architectural framework for an EU-wide digital credential validation portal serving over 4 million active users while ensuring strict compliance with eIDAS 2.0 and GDPR regulations. My technical leadership resulted in a 45% reduction in API response latency and streamlined deployment cycles across four international squads.\n\nI would welcome the opportunity to discuss how my technical expertise and passion for European digital interoperability align with your strategic goals.',
    closingSalutation: 'Sincerely,'
  },
  templateId: 'modern',
  primaryColor: '#0e47a1'
};
