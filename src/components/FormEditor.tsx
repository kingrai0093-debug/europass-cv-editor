import React from 'react';
import type { EuropassCVData, WorkExperience, Education, LanguageSkill, CustomSection, Certification } from '../types';
import { EXECUTIVE_SUMMARY_TEMPLATES } from '../data/profileTemplates';
import type { ProfileTemplate } from '../data/profileTemplates';
import { SUPPORTED_LANGUAGES } from '../data/translations';
import { FieldTranslateButton } from './FieldTranslateButton';
import { User, Briefcase, GraduationCap, Languages, Cpu, Plus, Trash2, Palette, Upload, Sparkles, Award, FileText, Globe } from 'lucide-react';

interface FormEditorProps {
  data: EuropassCVData;
  onChange: (newData: EuropassCVData) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMapPage?: () => void;
  onOpenTranslationModal?: () => void;
}

export const FormEditor: React.FC<FormEditorProps> = ({ data, onChange, activeTab, setActiveTab, onOpenMapPage, onOpenTranslationModal }) => {

  const applyProfileTemplate = (template: ProfileTemplate) => {
    const generatedCoverLetterBody = `I am writing to express my enthusiastic interest in the ${template.title} position at your organization. With extensive hands-on expertise in ${template.category.toLowerCase()}, I have built a proven track record of delivering operational excellence, maintaining strict compliance, and driving key outcomes.\n\nOver the course of my career, I have specialized in ${template.skillsList.slice(0, 3).join(', ')}, while leveraging modern technical tools including ${template.digitalSkills.slice(0, 3).join(', ')}. As highlighted in my executive summary, ${template.summary}\n\nI am confident that my practical skills, proactive work ethic, and dedication to European professional standards will make a valuable contribution to your team. I would welcome the opportunity to discuss how my qualifications align with your current requirements.`;

    onChange({
      ...data,
      personal: {
        ...data.personal,
        aboutMe: template.summary
      },
      digitalSkills: [...template.digitalSkills],
      skillsList: [...template.skillsList],
      coverLetter: {
        ...(data.coverLetter || {} as any),
        subject: `Application for ${template.title} Position`,
        bodyParagraphs: generatedCoverLetterBody
      }
    });
  };

  const updatePersonal = (field: string, value: any) => {
    onChange({
      ...data,
      personal: {
        ...data.personal,
        [field]: value
      }
    });
  };

  /* Work experience helper */
  const addWork = () => {
    const newWork: WorkExperience = {
      id: `work-${Date.now()}`,
      jobTitle: '',
      employer: '',
      city: '',
      country: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: ''
    };
    onChange({ ...data, workExperiences: [...data.workExperiences, newWork] });
  };

  const updateWork = (id: string, field: string, value: any) => {
    onChange({
      ...data,
      workExperiences: data.workExperiences.map(w => w.id === id ? { ...w, [field]: value } : w)
    });
  };

  const removeWork = (id: string) => {
    onChange({
      ...data,
      workExperiences: data.workExperiences.filter(w => w.id !== id)
    });
  };

  /* Education helper */
  const addEdu = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      title: '',
      institution: '',
      city: '',
      country: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      eqfLevel: 'EQF Level 6',
      fieldOfStudy: ''
    };
    onChange({ ...data, educationList: [...data.educationList, newEdu] });
  };

  const updateEdu = (id: string, field: string, value: any) => {
    onChange({
      ...data,
      educationList: data.educationList.map(e => e.id === id ? { ...e, [field]: value } : e)
    });
  };

  const removeEdu = (id: string) => {
    onChange({
      ...data,
      educationList: data.educationList.filter(e => e.id !== id)
    });
  };

  /* Language helper */
  const addLanguage = () => {
    const newLang: LanguageSkill = {
      id: `lang-${Date.now()}`,
      language: '',
      isMotherTongue: false,
      listening: 'B2',
      reading: 'B2',
      spokenInteraction: 'B2',
      spokenProduction: 'B2',
      writing: 'B2'
    };
    onChange({ ...data, languages: [...data.languages, newLang] });
  };

  const updateLanguage = (id: string, field: string, value: any) => {
    onChange({
      ...data,
      languages: data.languages.map(l => l.id === id ? { ...l, [field]: value } : l)
    });
  };

  const removeLanguage = (id: string) => {
    onChange({
      ...data,
      languages: data.languages.filter(l => l.id !== id)
    });
  };

  /* Custom Section helper */
  const addCustomSection = () => {
    const newSec: CustomSection = {
      id: `custom-${Date.now()}`,
      title: 'Projects',
      content: ''
    };
    onChange({ ...data, customSections: [...data.customSections, newSec] });
  };

  const updateCustomSection = (id: string, field: string, value: any) => {
    onChange({
      ...data,
      customSections: data.customSections.map(s => s.id === id ? { ...s, [field]: value } : s)
    });
  };

  const removeCustomSection = (id: string) => {
    onChange({
      ...data,
      customSections: data.customSections.filter(s => s.id !== id)
    });
  };

  /* Certification helper */
  const addCert = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      title: '',
      issuingOrganization: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: ''
    };
    onChange({ ...data, certifications: [...(data.certifications || []), newCert] });
  };

  const updateCert = (id: string, field: string, value: any) => {
    onChange({
      ...data,
      certifications: (data.certifications || []).map(c => c.id === id ? { ...c, [field]: value } : c)
    });
  };

  const removeCert = (id: string) => {
    onChange({
      ...data,
      certifications: (data.certifications || []).filter(c => c.id !== id)
    });
  };

  return (
    <div className="editor-panel">
      {/* Top Tab Switcher */}
      <div className="editor-tabs">
        <button className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`} onClick={() => setActiveTab('personal')}>
          <User size={16} /> Personal Info
        </button>
        <button className={`tab-btn ${activeTab === 'work' ? 'active' : ''}`} onClick={() => setActiveTab('work')}>
          <Briefcase size={16} /> Work ({data.workExperiences.length})
        </button>
        <button className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`} onClick={() => setActiveTab('education')}>
          <GraduationCap size={16} /> Education ({data.educationList.length})
        </button>
        <button className={`tab-btn ${activeTab === 'certifications' ? 'active' : ''}`} onClick={() => setActiveTab('certifications')}>
          <Award size={16} /> Certs ({(data.certifications || []).length})
        </button>
        <button className={`tab-btn ${activeTab === 'languages' ? 'active' : ''}`} onClick={() => setActiveTab('languages')}>
          <Languages size={16} /> Languages
        </button>
        <button className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>
          <Cpu size={16} /> Skills
        </button>
        <button className={`tab-btn ${activeTab === 'coverLetter' ? 'active' : ''}`} onClick={() => setActiveTab('coverLetter')}>
          <FileText size={16} /> Cover Letter
        </button>
        <button className={`tab-btn ${activeTab === 'template' ? 'active' : ''}`} onClick={() => setActiveTab('template')}>
          <Palette size={16} /> Design
        </button>
        <button className="tab-btn" style={{ background: '#0e47a1', color: '#ffffff', fontWeight: 700 }} onClick={() => onOpenMapPage && onOpenMapPage()}>
          📍 Company Location & Map
        </button>
      </div>

      <div className="editor-body">
        {/* TAB 1: PERSONAL INFO */}
        {activeTab === 'personal' && (
          <div>
            <div className="form-section-title">Personal Information</div>
            
            <div className="form-group">
              <label className="form-label">Profile Photo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {data.personal.avatarUrl ? (
                  <img
                    src={data.personal.avatarUrl}
                    alt="Profile Preview"
                    style={{ width: '60px', height: '70px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                ) : (
                  <div style={{ width: '60px', height: '70px', background: '#e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                    <User size={24} />
                  </div>
                )}
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <label className="btn-secondary" style={{ display: 'inline-flex', width: 'fit-content', padding: '0.4rem 0.8rem', fontSize: '0.825rem', cursor: 'pointer' }}>
                      <Upload size={14} /> Choose photo from device
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                updatePersonal('avatarUrl', event.target.result as string);
                              }
                            };
                            reader.readAsDataURL(e.target.files[0]);
                          }
                        }}
                      />
                    </label>

                    {data.personal.avatarUrl && (
                      <button
                        type="button"
                        className="btn-outline-danger"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.825rem' }}
                        onClick={() => updatePersonal('avatarUrl', '')}
                      >
                        <Trash2 size={14} /> Remove Photo
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    className="form-control"
                    style={{ fontSize: '0.8rem' }}
                    value={data.personal.avatarUrl}
                    onChange={(e) => updatePersonal('avatarUrl', e.target.value)}
                    placeholder="Or paste image URL (https://...)"
                  />
                </div>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={data.personal.firstName}
                  onChange={(e) => updatePersonal('firstName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={data.personal.lastName}
                  onChange={(e) => updatePersonal('lastName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-control"
                  value={data.personal.email}
                  onChange={(e) => updatePersonal('email', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-control"
                    style={{ width: '80px' }}
                    value={data.personal.phonePrefix}
                    onChange={(e) => updatePersonal('phonePrefix', e.target.value)}
                    placeholder="+44"
                  />
                  <input
                    type="text"
                    className="form-control"
                    value={data.personal.phone}
                    onChange={(e) => updatePersonal('phone', e.target.value)}
                    placeholder="123 456 789"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  value={data.personal.dateOfBirth}
                  onChange={(e) => updatePersonal('dateOfBirth', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nationality</label>
                <input
                  type="text"
                  className="form-control"
                  value={data.personal.nationality}
                  onChange={(e) => updatePersonal('nationality', e.target.value)}
                  placeholder="e.g. French, German, Nepalese"
                />
              </div>
            </div>

            {/* Comprehensive Passport & Travel Document Card */}
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0e47a1', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={16} /> Passport & Travel Document Details
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Passport / National ID No.</label>
                  <input
                    type="text"
                    className="form-control"
                    value={data.personal.passport?.passportNumber || ''}
                    onChange={(e) => updatePersonal('passport', { ...(data.personal.passport || {}), passportNumber: e.target.value })}
                    placeholder="e.g. SK9823410"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Issuing Country / Authority</label>
                  <input
                    type="text"
                    className="form-control"
                    value={data.personal.passport?.issuingCountry || ''}
                    onChange={(e) => updatePersonal('passport', { ...(data.personal.passport || {}), issuingCountry: e.target.value })}
                    placeholder="e.g. Slovakia (EU), Nepal"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Passport Issue Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={data.personal.passport?.issueDate || ''}
                    onChange={(e) => updatePersonal('passport', { ...(data.personal.passport || {}), issueDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Passport Expiry Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={data.personal.passport?.expiryDate || ''}
                    onChange={(e) => updatePersonal('passport', { ...(data.personal.passport || {}), expiryDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Place of Issue</label>
                  <input
                    type="text"
                    className="form-control"
                    value={data.personal.passport?.placeOfIssue || ''}
                    onChange={(e) => updatePersonal('passport', { ...(data.personal.passport || {}), placeOfIssue: e.target.value })}
                    placeholder="e.g. Bratislava / Kathmandu"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Work Permit / Visa Status</label>
                  <input
                    type="text"
                    className="form-control"
                    value={data.personal.passport?.visaStatus || ''}
                    onChange={(e) => updatePersonal('passport', { ...(data.personal.passport || {}), visaStatus: e.target.value })}
                    placeholder="e.g. EU Work Permit / Blue Card / Citizen"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                value={data.personal.address}
                onChange={(e) => updatePersonal('address', e.target.value)}
                placeholder="Street name, number"
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  value={data.personal.city}
                  onChange={(e) => updatePersonal('city', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-control"
                  value={data.personal.country}
                  onChange={(e) => updatePersonal('country', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ margin: 0 }}>About Me / Executive Summary</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FieldTranslateButton
                    value={data.personal.aboutMe}
                    fromLang={data.lang || 'en'}
                    onTranslated={(newVal) => updatePersonal('aboutMe', newVal)}
                    buttonLabel="Translate Summary"
                  />
                  <span style={{ fontSize: '0.75rem', color: '#0e47a1', fontWeight: 600 }}>
                    ⚡ Auto-fills Summary & Skills
                  </span>
                </div>
              </div>

              {/* Advanced Template Selector with Category Dropdown & Auto-Skills Configurator */}
              <div style={{ background: '#f0f4f9', padding: '0.8rem', borderRadius: '6px', border: '1px solid #d0e1ff', marginBottom: '0.8rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0e47a1', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={15} /> Select Role Template (100+ Profiles + Auto Skills):
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <select
                    className="form-control"
                    style={{ fontSize: '0.825rem' }}
                    onChange={(e) => {
                      const selectedCat = e.target.value;
                      const match = EXECUTIVE_SUMMARY_TEMPLATES.find(t => t.category === selectedCat);
                      if (match) {
                        applyProfileTemplate(match);
                      }
                    }}
                  >
                    <option value="">-- Quick Select Category --</option>
                    {Array.from(new Set(EXECUTIVE_SUMMARY_TEMPLATES.map(t => t.category))).map((cat, cIdx) => (
                      <option key={cIdx} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <select
                    className="form-control"
                    style={{ fontSize: '0.825rem', fontWeight: 600 }}
                    onChange={(e) => {
                      const templateId = e.target.value;
                      const match = EXECUTIVE_SUMMARY_TEMPLATES.find(t => t.id === templateId);
                      if (match) {
                        applyProfileTemplate(match);
                      }
                    }}
                  >
                    <option value="">-- Select Specific Job Role --</option>
                    {EXECUTIVE_SUMMARY_TEMPLATES.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick Pill Shortcuts */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {EXECUTIVE_SUMMARY_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      className="btn-secondary"
                      style={{ fontSize: '0.725rem', padding: '0.2rem 0.5rem', background: '#ffffff', borderColor: '#cbd5e1' }}
                      onClick={() => applyProfileTemplate(tpl)}
                      title={`Click to set summary + auto-setup ${tpl.digitalSkills.length} skills`}
                    >
                      + {tpl.title}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                className="form-control"
                rows={4}
                value={data.personal.aboutMe}
                onChange={(e) => updatePersonal('aboutMe', e.target.value)}
                placeholder="Brief summary of your background, career goals, and key competencies..."
              />
            </div>

            {/* Declaration Block */}
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Declaration / Certification Statement</label>
                <FieldTranslateButton 
                  value={data.personal.declaration || ''}
                  fromLang={data.lang || 'en'}
                  onTranslated={(translated) => updatePersonal('declaration', translated)}
                  buttonLabel="Translate"
                />
              </div>
              <textarea
                className="form-control"
                style={{ minHeight: '60px' }}
                placeholder="I hereby certify that the above information is true and correct to the best of my knowledge."
                value={data.personal.declaration || ''}
                onChange={(e) => updatePersonal('declaration', e.target.value)}
              />
              <p className="form-help-text" style={{ fontSize: '0.75rem', marginTop: '0.3rem', color: '#64748b' }}>This will appear at the very bottom of your CV.</p>
            </div>
          </div>
        )}

        {/* TAB 2: WORK EXPERIENCE */}
        {activeTab === 'work' && (
          <div>
            <div className="form-section-title">
              <span>Work Experience</span>
              <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={addWork}>
                <Plus size={14} /> Add Experience
              </button>
            </div>

            {data.workExperiences.map((work, idx) => (
              <div className="item-card" key={work.id}>
                <div className="item-card-header">
                  <span className="item-card-title">#{idx + 1} {work.jobTitle || 'New Position'}</span>
                  <button className="btn-outline-danger" onClick={() => removeWork(work.id)}>
                    <Trash2 size={14} /> Remove
                  </button>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Job Title / Position *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={work.jobTitle}
                      onChange={(e) => updateWork(work.id, 'jobTitle', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Employer / Organization *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={work.employer}
                      onChange={(e) => updateWork(work.id, 'employer', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                      type="month"
                      className="form-control"
                      value={work.startDate}
                      onChange={(e) => updateWork(work.id, 'startDate', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                      type="month"
                      className="form-control"
                      value={work.endDate}
                      disabled={work.isCurrent}
                      onChange={(e) => updateWork(work.id, 'endDate', e.target.value)}
                    />
                    <label style={{ fontSize: '0.8rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={work.isCurrent}
                        onChange={(e) => updateWork(work.id, 'isCurrent', e.target.checked)}
                      />
                      I currently work in this role
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={work.city}
                      onChange={(e) => updateWork(work.id, 'city', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      value={work.country}
                      onChange={(e) => updateWork(work.id, 'country', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <label className="form-label" style={{ margin: 0 }}>Main Activities and Responsibilities</label>
                    <FieldTranslateButton
                      value={work.description}
                      fromLang={data.lang || 'en'}
                      onTranslated={(newVal) => updateWork(work.id, 'description', newVal)}
                      buttonLabel="Translate Description"
                    />
                  </div>
                  <textarea
                    className="form-control"
                    value={work.description}
                    onChange={(e) => updateWork(work.id, 'description', e.target.value)}
                    placeholder="• Achieved key deliverables...&#10;• Managed team of developers..."
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: EDUCATION */}
        {activeTab === 'education' && (
          <div>
            <div className="form-section-title">
              <span>Education and Training</span>
              <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={addEdu}>
                <Plus size={14} /> Add Education
              </button>
            </div>

            {data.educationList.map((edu, idx) => (
              <div className="item-card" key={edu.id}>
                <div className="item-card-header">
                  <span className="item-card-title">#{idx + 1} {edu.title || 'New Qualification'}</span>
                  <button className="btn-outline-danger" onClick={() => removeEdu(edu.id)}>
                    <Trash2 size={14} /> Remove
                  </button>
                </div>

                <div className="form-grid">
                  <div className="form-group form-grid-full">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <label className="form-label" style={{ margin: 0 }}>Title of Qualification Awarded *</label>
                      <FieldTranslateButton
                        value={edu.title}
                        fromLang={data.lang || 'en'}
                        onTranslated={(newVal) => updateEdu(edu.id, 'title', newVal)}
                        buttonLabel="Translate Title"
                      />
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={edu.title}
                      onChange={(e) => updateEdu(edu.id, 'title', e.target.value)}
                      placeholder="e.g. Master of Science in Computer Science"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Organisation / Institution *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={edu.institution}
                      onChange={(e) => updateEdu(edu.id, 'institution', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">EQF Level</label>
                    <select
                      className="form-control"
                      value={edu.eqfLevel}
                      onChange={(e) => updateEdu(edu.id, 'eqfLevel', e.target.value)}
                    >
                      <option value="EQF Level 4">EQF Level 4 (High School / Certificate)</option>
                      <option value="EQF Level 5">EQF Level 5 (Diploma)</option>
                      <option value="EQF Level 6">EQF Level 6 (Bachelor's Degree)</option>
                      <option value="EQF Level 7">EQF Level 7 (Master's Degree)</option>
                      <option value="EQF Level 8">EQF Level 8 (Doctorate / PhD)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                      type="month"
                      className="form-control"
                      value={edu.startDate}
                      onChange={(e) => updateEdu(edu.id, 'startDate', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                      type="month"
                      className="form-control"
                      value={edu.endDate}
                      onChange={(e) => updateEdu(edu.id, 'endDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <label className="form-label" style={{ margin: 0 }}>Field of Study / Principal Subjects</label>
                    <FieldTranslateButton
                      value={edu.fieldOfStudy}
                      fromLang={data.lang || 'en'}
                      onTranslated={(newVal) => updateEdu(edu.id, 'fieldOfStudy', newVal)}
                      buttonLabel="Translate Subjects"
                    />
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    value={edu.fieldOfStudy}
                    onChange={(e) => updateEdu(edu.id, 'fieldOfStudy', e.target.value)}
                    placeholder="e.g. Software Systems, Artificial Intelligence"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: CERTIFICATIONS */}
        {activeTab === 'certifications' && (
          <div>
            <div className="form-section-title">
              <span>Certifications & Licenses</span>
              <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={addCert}>
                <Plus size={14} /> Add Certification
              </button>
            </div>

            {(data.certifications || []).map((cert, idx) => (
              <div className="item-card" key={cert.id}>
                <div className="item-card-header">
                  <span className="item-card-title">#{idx + 1} {cert.title || 'New Certification'}</span>
                  <button className="btn-outline-danger" onClick={() => removeCert(cert.id)}>
                    <Trash2 size={14} /> Remove
                  </button>
                </div>

                <div className="form-grid">
                  <div className="form-group form-grid-full">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <label className="form-label" style={{ margin: 0 }}>Certification Title *</label>
                      <FieldTranslateButton
                        value={cert.title}
                        fromLang={data.lang || 'en'}
                        onTranslated={(newVal) => updateCert(cert.id, 'title', newVal)}
                        buttonLabel="Translate Certification"
                      />
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={cert.title}
                      onChange={(e) => updateCert(cert.id, 'title', e.target.value)}
                      placeholder="e.g. AWS Certified Solutions Architect, OSCP, PMP"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Issuing Organization *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cert.issuingOrganization}
                      onChange={(e) => updateCert(cert.id, 'issuingOrganization', e.target.value)}
                      placeholder="e.g. Amazon Web Services, Offensive Security, PMI"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Credential ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cert.credentialId || ''}
                      onChange={(e) => updateCert(cert.id, 'credentialId', e.target.value)}
                      placeholder="e.g. AWS-123456"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Issue Date</label>
                    <input
                      type="month"
                      className="form-control"
                      value={cert.issueDate}
                      onChange={(e) => updateCert(cert.id, 'issueDate', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Expiration Date (If applicable)</label>
                    <input
                      type="month"
                      className="form-control"
                      value={cert.expiryDate || ''}
                      onChange={(e) => updateCert(cert.id, 'expiryDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Credential Verification URL</label>
                  <input
                    type="url"
                    className="form-control"
                    value={cert.credentialUrl || ''}
                    onChange={(e) => updateCert(cert.id, 'credentialUrl', e.target.value)}
                    placeholder="https://www.credly.com/badges/..."
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: LANGUAGES */}
        {activeTab === 'languages' && (
          <div>
            {/* Dedicated Document Language & Translation Hub */}
            <div style={{ background: '#eef4ff', border: '1.5px solid #bfdbfe', padding: '1.1rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0e47a1', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <Globe size={20} /> Europass CV Document Output Language
                  </div>
                  <p style={{ fontSize: '0.825rem', color: '#475569', margin: 0, maxWidth: '480px' }}>
                    Sets the document language for all official Europass headings, CEFR tables, and localized labels.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <select
                    className="form-control"
                    style={{ width: '200px', fontWeight: 700, borderColor: '#0e47a1', background: '#ffffff' }}
                    value={data.lang || 'en'}
                    onChange={(e) => onChange({ ...data, lang: e.target.value })}
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name} ({lang.nativeName})
                      </option>
                    ))}
                  </select>

                  {onOpenTranslationModal && (
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ padding: '0.45rem 0.9rem', fontSize: '0.825rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#0e47a1' }}
                      onClick={onOpenTranslationModal}
                      title="Translate entire CV with AI / Dictionary engine"
                    >
                      <Sparkles size={15} /> Translate Entire CV
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="form-section-title">
              <span>Your Spoken & Written Languages</span>
              <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={addLanguage}>
                <Plus size={14} /> Add Language
              </button>
            </div>

            {data.languages.map((lang) => (
              <div className="item-card" key={lang.id}>
                <div className="item-card-header">
                  <span className="item-card-title">{lang.language || 'Language'} {lang.isMotherTongue && '(Mother Tongue)'}</span>
                  <button className="btn-outline-danger" onClick={() => removeLanguage(lang.id)}>
                    <Trash2 size={14} /> Remove
                  </button>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Language Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={lang.language}
                      onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                      placeholder="e.g. Spanish, German, French"
                    />
                  </div>

                  <div className="form-group" style={{ justifyContent: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                      <input
                        type="checkbox"
                        checked={lang.isMotherTongue}
                        onChange={(e) => updateLanguage(lang.id, 'isMotherTongue', e.target.checked)}
                      />
                      This is my Mother Tongue
                    </label>
                  </div>
                </div>

                {!lang.isMotherTongue && (
                  <div style={{ background: '#ffffff', padding: '0.8rem', borderRadius: '6px', border: '1px solid #e2e8f0', marginTop: '0.5rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0e47a1', marginBottom: '0.5rem' }}>
                      CEFR Self-Assessment Grid (A1 - C2)
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Listening</label>
                        <select className="form-control" value={lang.listening} onChange={(e) => updateLanguage(lang.id, 'listening', e.target.value)}>
                          {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Reading</label>
                        <select className="form-control" value={lang.reading} onChange={(e) => updateLanguage(lang.id, 'reading', e.target.value)}>
                          {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Spoken Interaction</label>
                        <select className="form-control" value={lang.spokenInteraction} onChange={(e) => updateLanguage(lang.id, 'spokenInteraction', e.target.value)}>
                          {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Spoken Production</label>
                        <select className="form-control" value={lang.spokenProduction} onChange={(e) => updateLanguage(lang.id, 'spokenProduction', e.target.value)}>
                          {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                        </select>
                      </div>
                      <div className="form-group form-grid-full">
                        <label className="form-label">Writing</label>
                        <select className="form-control" value={lang.writing} onChange={(e) => updateLanguage(lang.id, 'writing', e.target.value)}>
                          {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: DIGITAL & CUSTOM SKILLS */}
        {activeTab === 'skills' && (
          <div>
            <div className="form-section-title">Digital & Professional Competencies</div>
            
            {/* 1. Digital Skills */}
            <div className="form-group" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ fontWeight: 700, color: '#0e47a1' }}>Digital Skills (Edit, Add or Delete Tags)</label>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                {data.digitalSkills.map((skill, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: '#eef4ff',
                      color: '#0e47a1',
                      border: '1px solid #bfdbfe',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '16px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => {
                        const updated = [...data.digitalSkills];
                        updated[index] = e.target.value;
                        onChange({ ...data, digitalSkills: updated });
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: 'inherit',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        outline: 'none',
                        width: `${Math.max(skill.length, 3)}ch`
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = data.digitalSkills.filter((_, i) => i !== index);
                        onChange({ ...data, digitalSkills: updated });
                      }}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', padding: 0 }}
                      title="Delete Skill"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  id="new-digital-skill-input"
                  className="form-control"
                  style={{ fontSize: '0.85rem' }}
                  placeholder="Type new digital skill (e.g. Python, Docker, React) & click Add"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) {
                        onChange({ ...data, digitalSkills: [...data.digitalSkills, val] });
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn-primary"
                  style={{ whiteSpace: 'nowrap', padding: '0.4rem 0.8rem', fontSize: '0.825rem' }}
                  onClick={() => {
                    const input = document.getElementById('new-digital-skill-input') as HTMLInputElement;
                    if (input && input.value.trim()) {
                      onChange({ ...data, digitalSkills: [...data.digitalSkills, input.value.trim()] });
                      input.value = '';
                    }
                  }}
                >
                  <Plus size={14} /> Add Skill
                </button>
              </div>
            </div>

            {/* 2. Management / Interpersonal Skills */}
            <div className="form-group" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ fontWeight: 700, color: '#0e47a1' }}>Management & Interpersonal Skills (Edit, Add or Delete Tags)</label>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                {data.skillsList.map((skill, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: '#f1f5f9',
                      color: '#1e293b',
                      border: '1px solid #cbd5e1',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '16px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => {
                        const updated = [...data.skillsList];
                        updated[index] = e.target.value;
                        onChange({ ...data, skillsList: updated });
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: 'inherit',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        outline: 'none',
                        width: `${Math.max(skill.length, 3)}ch`
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = data.skillsList.filter((_, i) => i !== index);
                        onChange({ ...data, skillsList: updated });
                      }}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', padding: 0 }}
                      title="Delete Skill"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  id="new-mgmt-skill-input"
                  className="form-control"
                  style={{ fontSize: '0.85rem' }}
                  placeholder="Type new management skill (e.g. Leadership, Risk Assessment) & click Add"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) {
                        onChange({ ...data, skillsList: [...data.skillsList, val] });
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn-primary"
                  style={{ whiteSpace: 'nowrap', padding: '0.4rem 0.8rem', fontSize: '0.825rem' }}
                  onClick={() => {
                    const input = document.getElementById('new-mgmt-skill-input') as HTMLInputElement;
                    if (input && input.value.trim()) {
                      onChange({ ...data, skillsList: [...data.skillsList, input.value.trim()] });
                      input.value = '';
                    }
                  }}
                >
                  <Plus size={14} /> Add Skill
                </button>
              </div>
            </div>

            {/* 3. Driving Licences */}
            <div className="form-group" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <label className="form-label" style={{ fontWeight: 700, color: '#0e47a1' }}>Driving Licence Categories</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                {['AM', 'A1', 'A2', 'A', 'B', 'BE', 'C1', 'C1E', 'C', 'CE', 'D1', 'D1E', 'D', 'DE'].map((cat) => {
                  const hasCategory = data.drivingLicences.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        if (hasCategory) {
                          onChange({ ...data, drivingLicences: data.drivingLicences.filter(c => c !== cat) });
                        } else {
                          onChange({ ...data, drivingLicences: [...data.drivingLicences, cat] });
                        }
                      }}
                      style={{
                        padding: '0.3rem 0.6rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        border: hasCategory ? '2px solid #0e47a1' : '1px solid #cbd5e1',
                        background: hasCategory ? '#0e47a1' : '#ffffff',
                        color: hasCategory ? '#ffffff' : '#475569'
                      }}
                    >
                      {hasCategory ? `✓ Licence ${cat}` : `+ ${cat}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Custom Sections */}
            <div className="form-section-title" style={{ marginTop: '2rem' }}>
              <span>Custom Sections (References, Projects)</span>
              <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={addCustomSection}>
                <Plus size={14} /> Add Section
              </button>
            </div>

            {data.customSections.map((sec) => (
              <div className="item-card" key={sec.id}>
                <div className="item-card-header">
                  <input
                    type="text"
                    className="form-control"
                    style={{ fontWeight: 700, width: '70%' }}
                    value={sec.title}
                    onChange={(e) => updateCustomSection(sec.id, 'title', e.target.value)}
                  />
                  <button className="btn-outline-danger" onClick={() => removeCustomSection(sec.id)}>
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.3rem' }}>
                  <FieldTranslateButton
                    value={sec.content}
                    fromLang={data.lang || 'en'}
                    onTranslated={(newVal) => updateCustomSection(sec.id, 'content', newVal)}
                    buttonLabel="Translate Section Content"
                  />
                </div>
                <textarea
                  className="form-control"
                  value={sec.content}
                  onChange={(e) => updateCustomSection(sec.id, 'content', e.target.value)}
                  placeholder="Details..."
                />
              </div>
            ))}
          </div>
        )}

        {/* TAB: COVER LETTER */}
        {activeTab === 'coverLetter' && (
          <div>
            <div className="form-section-title">Official Europass Cover Letter</div>

            {/* COVER LETTER ROLE PRESET PICKER */}
            <div className="form-group" style={{ background: '#eef4ff', padding: '1rem', borderRadius: '8px', border: '1px solid #bfdbfe', marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ color: '#0e47a1', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
                <Sparkles size={16} color="#0e47a1" /> Auto-Set Cover Letter Body Paragraphs (100+ Role Presets)
              </label>
              <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0.2rem 0 0.6rem 0' }}>
                Select your job role to auto-generate a professional, high-impact Europass Cover Letter body:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <select
                  className="form-control"
                  style={{ fontSize: '0.825rem' }}
                  onChange={(e) => {
                    const selectedCat = e.target.value;
                    const match = EXECUTIVE_SUMMARY_TEMPLATES.find(t => t.category === selectedCat);
                    if (match) {
                      applyProfileTemplate(match);
                    }
                  }}
                >
                  <option value="">-- Quick Select Category --</option>
                  {Array.from(new Set(EXECUTIVE_SUMMARY_TEMPLATES.map(t => t.category))).map((cat, cIdx) => (
                    <option key={cIdx} value={cat}>{cat}</option>
                  ))}
                </select>

                <select
                  className="form-control"
                  style={{ fontSize: '0.825rem', fontWeight: 600 }}
                  onChange={(e) => {
                    const templateId = e.target.value;
                    const match = EXECUTIVE_SUMMARY_TEMPLATES.find(t => t.id === templateId);
                    if (match) {
                      applyProfileTemplate(match);
                    }
                  }}
                >
                  <option value="">-- Select Specific Job Role --</option>
                  {EXECUTIVE_SUMMARY_TEMPLATES.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Recipient Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={data.coverLetter?.recipientName || ''}
                  onChange={(e) => onChange({
                    ...data,
                    coverLetter: { ...(data.coverLetter || {} as any), recipientName: e.target.value }
                  })}
                  placeholder="e.g. Dr. Jean Dupont / Hiring Committee"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Recipient Title / Department</label>
                <input
                  type="text"
                  className="form-control"
                  value={data.coverLetter?.recipientTitle || ''}
                  onChange={(e) => onChange({
                    ...data,
                    coverLetter: { ...(data.coverLetter || {} as any), recipientTitle: e.target.value }
                  })}
                  placeholder="e.g. Head of Talent Acquisition & HR"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Company / Institution</label>
                <input
                  type="text"
                  className="form-control"
                  value={data.coverLetter?.companyName || ''}
                  onChange={(e) => onChange({
                    ...data,
                    coverLetter: { ...(data.coverLetter || {} as any), companyName: e.target.value }
                  })}
                  placeholder="e.g. European Research Agency S.A."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={data.coverLetter?.companyAddress || ''}
                  onChange={(e) => onChange({
                    ...data,
                    coverLetter: { ...(data.coverLetter || {} as any), companyAddress: e.target.value }
                  })}
                  placeholder="e.g. Rue de la Loi 200"
                />
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  value={data.coverLetter?.city || ''}
                  onChange={(e) => onChange({
                    ...data,
                    coverLetter: { ...(data.coverLetter || {} as any), city: e.target.value }
                  })}
                  placeholder="e.g. Brussels"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-control"
                  value={data.coverLetter?.country || ''}
                  onChange={(e) => onChange({
                    ...data,
                    coverLetter: { ...(data.coverLetter || {} as any), country: e.target.value }
                  })}
                  placeholder="e.g. Belgium"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date of Letter</label>
                <input
                  type="date"
                  className="form-control"
                  value={data.coverLetter?.date || ''}
                  onChange={(e) => onChange({
                    ...data,
                    coverLetter: { ...(data.coverLetter || {} as any), date: e.target.value }
                  })}
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Subject Line</label>
                <FieldTranslateButton
                  value={data.coverLetter?.subject || ''}
                  fromLang={data.lang || 'en'}
                  onTranslated={(newVal) => onChange({
                    ...data,
                    coverLetter: { ...(data.coverLetter || {} as any), subject: newVal }
                  })}
                  buttonLabel="Translate Subject"
                />
              </div>
              <input
                type="text"
                className="form-control"
                value={data.coverLetter?.subject || ''}
                onChange={(e) => onChange({
                  ...data,
                  coverLetter: { ...(data.coverLetter || {} as any), subject: e.target.value }
                })}
                placeholder="e.g. Application for Senior Cloud Architect"
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Opening Salutation</label>
                <FieldTranslateButton
                  value={data.coverLetter?.openingSalutation || ''}
                  fromLang={data.lang || 'en'}
                  onTranslated={(newVal) => onChange({
                    ...data,
                    coverLetter: { ...(data.coverLetter || {} as any), openingSalutation: newVal }
                  })}
                  buttonLabel="Translate Salutation"
                />
              </div>
              <input
                type="text"
                className="form-control"
                value={data.coverLetter?.openingSalutation || ''}
                onChange={(e) => onChange({
                  ...data,
                  coverLetter: { ...(data.coverLetter || {} as any), openingSalutation: e.target.value }
                })}
                placeholder="Dear Hiring Committee,"
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Main Letter Body Paragraphs</label>
                <FieldTranslateButton
                  value={data.coverLetter?.bodyParagraphs || ''}
                  fromLang={data.lang || 'en'}
                  onTranslated={(newVal) => onChange({
                    ...data,
                    coverLetter: { ...(data.coverLetter || {} as any), bodyParagraphs: newVal }
                  })}
                  buttonLabel="Translate Letter Body"
                />
              </div>
              <textarea
                className="form-control"
                rows={9}
                value={data.coverLetter?.bodyParagraphs || ''}
                onChange={(e) => onChange({
                  ...data,
                  coverLetter: { ...(data.coverLetter || {} as any), bodyParagraphs: e.target.value }
                })}
                placeholder="Write your motivations, key accomplishments, and value proposition..."
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Closing Salutation</label>
                <FieldTranslateButton
                  value={data.coverLetter?.closingSalutation || ''}
                  fromLang={data.lang || 'en'}
                  onTranslated={(newVal) => onChange({
                    ...data,
                    coverLetter: { ...(data.coverLetter || {} as any), closingSalutation: newVal }
                  })}
                  buttonLabel="Translate Salutation"
                />
              </div>
              <input
                type="text"
                className="form-control"
                value={data.coverLetter?.closingSalutation || ''}
                onChange={(e) => onChange({
                  ...data,
                  coverLetter: { ...(data.coverLetter || {} as any), closingSalutation: e.target.value }
                })}
                placeholder="Sincerely,"
              />
            </div>
          </div>
        )}

        {/* TAB 6: DESIGN & TEMPLATES */}
        {activeTab === 'template' && (
          <div>
            <div className="form-section-title">Europass Template Customization</div>

            <div className="form-group">
              <label className="form-label">Select Color Theme</label>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.4rem' }}>
                {[
                  { name: 'Official EU Blue', hex: '#0e47a1' },
                  { name: 'Emerald Green', hex: '#00796b' },
                  { name: 'Classic Navy', hex: '#1a237e' },
                  { name: 'Burgundy', hex: '#880e4f' },
                  { name: 'Dark Slate', hex: '#263238' }
                ].map((c) => (
                  <button
                    key={c.hex}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: c.hex,
                      border: data.primaryColor === c.hex ? '3px solid #000' : '2px solid #fff',
                      cursor: 'pointer',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}
                    title={c.name}
                    onClick={() => onChange({ ...data, primaryColor: c.hex })}
                  />
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="form-label">Layout Template Style (15 Advanced Themes)</label>
              <div className="form-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {[
                  { id: 'standard', name: 'Official Europass Standard', desc: 'Compliant with official EU commission guidelines & e-portfolio rules' },
                  { id: 'modern', name: 'Modern Executive', desc: 'Sleek spacing, left-bordered headers & subtle background highlights' },
                  { id: 'compact', name: 'Dense Compact', desc: 'Condensed font & narrow grid margins to fit extensive info onto 1-2 pages' },
                  { id: 'classic', name: 'Classic Formal', desc: 'Traditional serif typography with centered header alignment for legal & academia' },
                  { id: 'minimalist', name: 'European Minimalist', desc: 'Clean, borderless layout with accent underline bars for creative roles' },
                  { id: 'sidebar', name: 'Split Sidebar Column', desc: 'Modern 2-column layout putting contact & skills in left sidebar column' },
                  { id: 'creative', name: 'Creative Bold Gradient', desc: 'Vibrant header gradient & dashed accents for design & media portfolios' },
                  { id: 'corporate', name: 'Corporate Enterprise', desc: 'Solid left border stripe & boxed header card for corporate management' },
                  { id: 'academic', name: 'Academic Research CV', desc: 'Formal Times serif typography with high line spacing & clear research sections' },
                  { id: 'technical', name: 'Technical / Developer Code', desc: 'Monospace terminal typography & dark skill pills for software engineers' },
                  { id: 'nordic', name: 'Nordic Clean Minimal', desc: 'Scandinavia-inspired minimalist layout with crisp typography and deep slate accents' },
                  { id: 'elegant', name: 'Luxury Elegant Serif', desc: 'Refined Garamond typography with gold-accented section rules for executive roles' },
                  { id: 'hybrid', name: 'Hybrid Top-Border Box', desc: 'Thick header accent band with clear structured card containers' },
                  { id: 'timeline', name: 'Timeline Visual Trail', desc: 'Vertical connected timeline nodes highlighting career chronology' },
                  { id: 'industrial', name: 'Heavy Industrial & Logistics', desc: 'High-contrast boxed headers designed for heavy machinery & skilled trades' }
                ].map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() => onChange({ ...data, templateId: tpl.id as any })}
                    style={{
                      border: data.templateId === tpl.id ? '2px solid #0e47a1' : '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '0.85rem',
                      cursor: 'pointer',
                      background: data.templateId === tpl.id ? '#eef4ff' : '#ffffff',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0e47a1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{tpl.name}</span>
                      {data.templateId === tpl.id && <span style={{ fontSize: '0.75rem', background: '#0e47a1', color: '#fff', padding: '1px 6px', borderRadius: '4px' }}>Active</span>}
                    </div>
                    <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '0.3rem', lineHeight: '1.3' }}>{tpl.desc}</div>
                  </div>
                ))}
              </div>
            </div>


          </div>
        )}
        
      </div>
    </div>
  );
};
