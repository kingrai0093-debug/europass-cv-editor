import React from 'react';
import type { EuropassCVData } from '../types';
import { getTranslation, SUPPORTED_LANGUAGES } from '../data/translations';
import { Mail, Phone, MapPin, Globe, Calendar, User } from 'lucide-react';

interface PreviewProps {
  data: EuropassCVData;
}

export const PreviewCV: React.FC<PreviewProps> = ({ data }) => {
  const { personal, workExperiences, educationList, languages, digitalSkills, skillsList, drivingLicences, customSections, templateId, primaryColor, lang } = data;
  const t = getTranslation(lang || 'en');

  const styleVariable = { '--primary-theme': primaryColor } as React.CSSProperties;

  if (templateId === 'sidebar') {
    return (
      <div id="europass-cv-document" className="cv-paper template-sidebar" style={styleVariable}>

        {/* Left Column Sidebar */}
        <div className="sidebar-left-col">
          {personal.avatarUrl ? (
            <img src={personal.avatarUrl} alt="Passport Photo" className="europass-avatar" style={{ width: '100%', height: '180px', marginBottom: '1rem' }} />
          ) : (
            <div className="europass-avatar" style={{ width: '100%', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0', marginBottom: '1rem' }}>
              <User size={48} color="#94a3b8" />
            </div>
          )}

          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: primaryColor, marginBottom: '0.8rem' }}>{t.contactInfo}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem', marginBottom: '1.5rem' }}>
            {personal.email && <div className="europass-meta-item"><Mail size={14} color={primaryColor} /> <span>{personal.email}</span></div>}
            {personal.phone && <div className="europass-meta-item"><Phone size={14} color={primaryColor} /> <span>{personal.phonePrefix} {personal.phone}</span></div>}
            {(personal.address || personal.city) && <div className="europass-meta-item"><MapPin size={14} color={primaryColor} /> <span>{[personal.address, personal.city, personal.country].filter(Boolean).join(', ')}</span></div>}
            {personal.website && <div className="europass-meta-item"><Globe size={14} color={primaryColor} /> <span>{personal.website}</span></div>}
            {personal.dateOfBirth && <div className="europass-meta-item"><Calendar size={14} color={primaryColor} /> <span>{t.dateOfBirth}: {personal.dateOfBirth}</span></div>}
            {personal.nationality && <div className="europass-meta-item"><User size={14} color={primaryColor} /> <span>{t.nationality}: {personal.nationality}</span></div>}
          </div>

          {/* Digital Skills */}
          {digitalSkills.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: primaryColor, marginBottom: '0.5rem', borderBottom: '1px solid #cbd5e1' }}>{t.digitalSkills}</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {digitalSkills.map((skill, idx) => (
                  <span className="skill-chip" key={idx} style={{ fontSize: '0.725rem', padding: '0.15rem 0.45rem' }}>{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: primaryColor, marginBottom: '0.5rem', borderBottom: '1px solid #cbd5e1' }}>{t.languageSkills}</h2>
              {languages.map(l => (
                <div key={l.id} style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                  <strong>{l.language}</strong>: {l.isMotherTongue ? t.native : l.listening}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Main Column */}
        <div className="main-right-col">
          {lang !== 'ne' && (
            <img
              src={`${import.meta.env.BASE_URL}europass-logo.png`}
              alt="RBC Logo"
              style={{ height: '70px', display: 'block', marginLeft: 'auto', marginBottom: '0.5rem' }}
            />
          )}
          <h1 className="europass-name" style={{ fontSize: '2rem' }}>{personal.firstName} {personal.lastName}</h1>
          {personal.aboutMe && <p style={{ fontStyle: 'italic', color: '#475569', marginBottom: '1.25rem' }}>"{personal.aboutMe}"</p>}

          {/* Passport */}
          {personal.passport?.passportNumber && (
            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d0e1ff', marginBottom: '1.25rem', fontSize: '0.825rem' }}>
              <div style={{ fontWeight: 700, color: primaryColor, marginBottom: '0.3rem' }}>{t.passportDetails}</div>
              <div>{t.passportNo}: <strong>{personal.passport.passportNumber}</strong> | {t.expiryDate}: {personal.passport.expiryDate}</div>
              {personal.passport.visaStatus && <div>{t.visaStatus}: <strong>{personal.passport.visaStatus}</strong></div>}
            </div>
          )}

          {/* Work */}
          {workExperiences.length > 0 && (
            <section style={{ marginBottom: '1rem' }}>
              <h2 className="europass-section-header">{t.workExperience}</h2>
              {workExperiences.map(work => (
                <div key={work.id} style={{ marginBottom: '1rem' }}>
                  <div className="europass-title">{work.jobTitle}</div>
                  <div className="europass-subtitle">{work.employer} ({work.startDate} – {work.isCurrent ? t.present : work.endDate})</div>
                  <p style={{ whiteSpace: 'pre-line', fontSize: '0.85rem' }}>{work.description}</p>
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {educationList.length > 0 && (
            <section style={{ marginBottom: '1rem' }}>
              <h2 className="europass-section-header">{t.educationTraining}</h2>
              {educationList.map(edu => (
                <div key={edu.id} style={{ marginBottom: '0.85rem' }}>
                  <div className="europass-title">{edu.title}</div>
                  <div className="europass-subtitle">{edu.institution} ({edu.startDate} – {edu.isCurrent ? t.ongoing : edu.endDate})</div>
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <section style={{ marginBottom: '1rem' }}>
              <h2 className="europass-section-header">{t.certifications}</h2>
              {data.certifications.map(cert => (
                <div key={cert.id} style={{ marginBottom: '0.85rem' }}>
                  <div className="europass-title">{cert.title}</div>
                  <div className="europass-subtitle">{cert.issuingOrganization}</div>
                  {cert.credentialId && <div style={{ fontSize: '0.8rem', color: '#475569' }}>{t.credentialId}: {cert.credentialId}</div>}
                </div>
              ))}
            </section>
          )}

          {/* Management & Interpersonal Skills */}
          {skillsList.length > 0 && (
            <section style={{ marginBottom: '1rem' }}>
              <h2 className="europass-section-header">{t.managementSkills}</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {skillsList.map((skill, idx) => (
                  <span className="skill-chip" key={idx} style={{ background: '#f1f5f9', color: '#1e293b', borderColor: '#cbd5e1' }}>{skill}</span>
                ))}
              </div>
            </section>
          )}

          {/* Driving Licences */}
          {drivingLicences.length > 0 && (
            <section style={{ marginBottom: '1rem' }}>
              <h2 className="europass-section-header">{t.drivingLicence}</h2>
              <p style={{ fontWeight: 600, color: '#334155', fontSize: '0.875rem' }}>
                {t.drivingLicenceCategory}: {drivingLicences.join(', ')}
              </p>
            </section>
          )}

          {/* Custom Sections */}
          {customSections.map(sec => (
            <section key={sec.id} style={{ marginBottom: '1.25rem' }}>
              <h2 className="europass-section-header">{sec.title}</h2>
              <p style={{ whiteSpace: 'pre-line', fontSize: '0.85rem', color: '#334155' }}>{sec.content}</p>
            </section>
          ))}

          {/* Declaration / Certification */}
          {personal.declaration && personal.declaration.trim() !== '' && (
            <section style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #cbd5e1' }}>
              <h2 className="europass-section-header" style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>{t.declaration || 'Declaration'}</h2>
              <p style={{ fontStyle: 'italic', color: '#475569', fontSize: '0.85rem', lineHeight: '1.5' }}>
                {personal.declaration}
              </p>
              <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ borderBottom: '1px solid #94a3b8', width: '150px', marginBottom: '0.5rem' }}></div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.dateLocation || 'Date / Location'}</span>
                </div>
                <div>
                  <div style={{ borderBottom: '1px solid #94a3b8', width: '180px', marginBottom: '0.5rem' }}></div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.signature || 'Signature'}</span>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="europass-cv-document" className={`cv-paper template-${templateId}`} style={styleVariable}>

      {/* Header Section — Official Europass style (sample: centered name + contacts, photo & logo top-right) */}
      <div className="europass-cv-header europass-official-header">
        <div className="europass-official-main">
          <h1 className="europass-name europass-official-name">
            {personal.firstName} {personal.lastName}
          </h1>

          {(personal.nationality || personal.dateOfBirth || personal.gender) && (
            <div className="europass-official-idline">
              {personal.nationality && <span><strong>{t.nationality}:</strong> {personal.nationality}</span>}
              {personal.dateOfBirth && <span><strong>{t.dateOfBirth}:</strong> {personal.dateOfBirth}</span>}
              {personal.gender && <span><strong>{t.gender || 'Gender'}:</strong> {personal.gender}</span>}
            </div>
          )}

          <div className="europass-official-contacts">
            {personal.phone && (
              <div className="europass-meta-item">
                <Phone size={14} color={primaryColor} />
                <span><strong>{t.phoneNumber || 'Phone number'}:</strong> {personal.phonePrefix} {personal.phone}</span>
              </div>
            )}
            {personal.email && (
              <div className="europass-meta-item">
                <Mail size={14} color={primaryColor} />
                <span><strong>{t.emailAddress || 'Email address'}:</strong> {personal.email}</span>
              </div>
            )}
            {(personal.address || personal.city) && (
              <div className="europass-meta-item">
                <MapPin size={14} color={primaryColor} />
                <span><strong>{t.home || 'Home'}:</strong> {[personal.address, personal.postalCode, personal.city, personal.country].filter(Boolean).join(', ')}</span>
              </div>
            )}
            {personal.website && (
              <div className="europass-meta-item">
                <Globe size={14} color={primaryColor} />
                <span><strong>{t.website || 'Website'}:</strong> {personal.website}</span>
              </div>
            )}
            {personal.socials && personal.socials.filter(s => s.platform && s.link).map((s, i) => (
              <div className="europass-meta-item" key={i}>
                <Globe size={14} color={primaryColor} />
                <span><strong>{s.platform}:</strong> {s.link}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="europass-official-corner">
          {personal.avatarUrl && (
            <img src={personal.avatarUrl} alt="Passport Photo" className="europass-avatar" />
          )}
          {lang !== 'ne' && (
            <img
              src={`${import.meta.env.BASE_URL}europass-logo.png`}
              alt="Europass logo"
              className="europass-logo-official"
            />
          )}
        </div>
      </div>

      {/* Official Europass body: full-width uppercase section titles (sample format) */}
      <div className="europass-sections">
        {personal.aboutMe && (
          <section>
            <h2 className="europass-section-header">{t.aboutMe || 'About Me'}</h2>
            <p className="europass-entry-desc">{personal.aboutMe}</p>
          </section>
        )}

        {personal.passport?.passportNumber && (
          <section>
            <h2 className="europass-section-header">{t.passportDetails}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.3rem 1.5rem', fontSize: '0.85rem' }}>
              <div><span style={{ color: '#64748b', fontWeight: 600 }}>{t.passportNo}:</span> <strong style={{ color: '#0f172a' }}>{personal.passport.passportNumber}</strong></div>
              <div><span style={{ color: '#64748b', fontWeight: 600 }}>{t.issuingAuthority}:</span> <strong style={{ color: '#0f172a' }}>{personal.passport.issuingCountry || 'N/A'}</strong></div>
              {personal.passport.issueDate && <div><span style={{ color: '#64748b', fontWeight: 600 }}>{t.issueDate}:</span> <span>{personal.passport.issueDate}</span></div>}
              {personal.passport.expiryDate && <div><span style={{ color: '#64748b', fontWeight: 600 }}>{t.expiryDate}:</span> <span style={{ color: '#c2410c', fontWeight: 700 }}>{personal.passport.expiryDate}</span></div>}
              {personal.passport.placeOfIssue && <div><span style={{ color: '#64748b', fontWeight: 600 }}>{t.placeOfIssue}:</span> <span>{personal.passport.placeOfIssue}</span></div>}
              {personal.passport.visaStatus && <div><span style={{ color: '#64748b', fontWeight: 600 }}>{t.visaStatus}:</span> <span style={{ color: '#047857', fontWeight: 700 }}>{personal.passport.visaStatus}</span></div>}
            </div>
          </section>
        )}

        {workExperiences.length > 0 && (
          <section>
            <h2 className="europass-section-header">{t.workExperience}</h2>
            {workExperiences.map((work) => (
              <div className="europass-entry" key={work.id}>
                <div className="europass-entry-title">{work.jobTitle}</div>
                <div className="europass-entry-sub">
                  {work.employer}
                  {work.startDate && ` [ ${work.startDate} – ${work.isCurrent ? t.present : work.endDate} ]`}
                </div>
                {work.city && <div className="europass-entry-line">City: {work.city}</div>}
                {work.country && <div className="europass-entry-line">Country: {work.country}</div>}
                {work.description && <p className="europass-entry-desc">{work.description}</p>}
              </div>
            ))}
          </section>
        )}

        {educationList.length > 0 && (
          <section>
            <h2 className="europass-section-header">{t.educationTraining}</h2>
            {educationList.map((edu) => (
              <div className="europass-entry" key={edu.id}>
                <div className="europass-entry-title">{edu.title}</div>
                <div className="europass-entry-sub">
                  {edu.institution}
                  {edu.startDate && ` [ ${edu.startDate} – ${edu.isCurrent ? t.ongoing : edu.endDate} ]`}
                </div>
                {edu.city && <div className="europass-entry-line">City: {edu.city}</div>}
                {edu.country && <div className="europass-entry-line">Country: {edu.country}</div>}
                {edu.eqfLevel && <div className="europass-entry-line">{edu.eqfLevel}</div>}
                {edu.fieldOfStudy && <div className="europass-entry-line">{t.fieldOfStudy}: {edu.fieldOfStudy}</div>}
              </div>
            ))}
          </section>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <section>
            <h2 className="europass-section-header">{t.certifications}</h2>
            {data.certifications.map((cert) => (
              <div className="europass-entry" key={cert.id}>
                <div className="europass-entry-title">{cert.title}</div>
                <div className="europass-entry-sub">
                  {cert.issuingOrganization}
                  {cert.issueDate && ` [ ${cert.issueDate}${cert.expiryDate ? ` – ${cert.expiryDate}` : ''} ]`}
                </div>
                {cert.credentialId && <div className="europass-entry-line">{t.credentialId}: <strong>{cert.credentialId}</strong></div>}
                {cert.credentialUrl && <a href={cert.credentialUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.775rem', color: primaryColor, textDecoration: 'underline' }}>{t.verifyCredential}</a>}
              </div>
            ))}
          </section>
        )}

        {languages.length > 0 && (
          <section>
            <h2 className="europass-section-header">{t.languageSkills}</h2>
            {languages.filter(l => l.isMotherTongue).length > 0 && (
              <div style={{ marginBottom: '0.6rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.motherTongue}: </span>
                <span style={{ fontWeight: 600, color: primaryColor }}>{languages.filter(l => l.isMotherTongue).map(l => l.language).join(', ')}</span>
              </div>
            )}

            {languages.filter(l => !l.isMotherTongue).length > 0 && (
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>{t.otherLanguages}:</div>
                <table className="cefr-table">
                  <thead>
                    <tr>
                      <th rowSpan={2} style={{ textAlign: 'left', width: '22%' }}>{SUPPORTED_LANGUAGES.find(l => l.code === lang)?.name || 'Language'}</th>
                      <th colSpan={2}>{t.understanding}</th>
                      <th colSpan={2}>{t.speaking}</th>
                      <th>{t.writing}</th>
                    </tr>
                    <tr>
                      <th>{t.listening}</th>
                      <th>{t.reading}</th>
                      <th>{t.spokenInteraction}</th>
                      <th>{t.spokenProduction}</th>
                      <th>{t.writing}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {languages.filter(l => !l.isMotherTongue).map((langItem) => (
                      <tr key={langItem.id}>
                        <td style={{ textAlign: 'left', fontWeight: 700 }}>{langItem.language}</td>
                        <td><span className="cefr-badge">{langItem.listening}</span></td>
                        <td><span className="cefr-badge">{langItem.reading}</span></td>
                        <td><span className="cefr-badge">{langItem.spokenInteraction}</span></td>
                        <td><span className="cefr-badge">{langItem.spokenProduction}</span></td>
                        <td><span className="cefr-badge">{langItem.writing}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '0.3rem', fontStyle: 'italic' }}>{t.cefrNote}</div>
              </div>
            )}
          </section>
        )}

        {digitalSkills.length > 0 && (
          <section>
            <h2 className="europass-section-header">{t.digitalSkills}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {digitalSkills.map((skill, idx) => <span className="skill-chip" key={idx}>{skill}</span>)}
            </div>
          </section>
        )}

        {skillsList.length > 0 && (
          <section>
            <h2 className="europass-section-header">{t.managementSkills}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {skillsList.map((skill, idx) => <span className="skill-chip" key={idx} style={{ background: '#f1f5f9', color: '#1e293b', borderColor: '#cbd5e1' }}>{skill}</span>)}
            </div>
          </section>
        )}

        {drivingLicences.length > 0 && (
          <section>
            <h2 className="europass-section-header">{t.drivingLicence}</h2>
            <p className="europass-entry-line" style={{ fontWeight: 600 }}>{t.drivingLicenceCategory}: {drivingLicences.join(', ')}</p>
          </section>
        )}

        {customSections.map((sec) => (
          <section key={sec.id}>
            <h2 className="europass-section-header">{sec.title}</h2>
            <p className="europass-entry-desc">{sec.content}</p>
          </section>
        ))}

        {personal.declaration && personal.declaration.trim() !== '' && (
          <section>
            <h2 className="europass-section-header">{t.declaration || 'Declaration'}</h2>
            <p style={{ fontStyle: 'italic', color: '#475569', fontSize: '0.85rem', lineHeight: '1.5' }}>{personal.declaration}</p>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ borderBottom: '1px solid #94a3b8', width: '150px', marginBottom: '0.5rem' }}></div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.dateLocation || 'Date / Location'}</span>
              </div>
              <div>
                <div style={{ borderBottom: '1px solid #94a3b8', width: '180px', marginBottom: '0.5rem' }}></div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.signature || 'Signature'}</span>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
