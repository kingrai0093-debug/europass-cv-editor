import React from 'react';
import type { EuropassCVData } from '../types';
import { getTranslation } from '../data/translations';
import { User } from 'lucide-react';

interface PreviewCoverLetterProps {
  data: EuropassCVData;
}

export const PreviewCoverLetter: React.FC<PreviewCoverLetterProps> = ({ data }) => {
  const { personal, coverLetter, templateId, primaryColor, lang } = data;
  const t = getTranslation(lang || 'en');
  const styleVariable = { '--primary-theme': primaryColor } as React.CSSProperties;

  if (!coverLetter) return null;

  return (
    <div id="europass-cover-letter-document" className={`cv-paper template-${templateId}`} style={styleVariable}>

      <div className="europass-cv-header" style={{ position: 'relative', marginBottom: '1.25rem' }}>
        {lang !== 'ne' && (
          <img 
            src="/europass-logo.png" 
            alt="RBC Logo" 
            style={{ position: 'absolute', top: '-10px', right: '0', height: '80px' }}
          />
        )}
        <div style={{ marginTop: '25px', display: 'flex', width: '100%', gap: '1.5rem' }}>
          {personal.avatarUrl ? (
            <img src={personal.avatarUrl} alt="Passport Photo" className="europass-avatar" style={{ width: '80px', height: '95px' }} />
          ) : (
            <div className="europass-avatar" style={{ width: '80px', height: '95px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0' }}>
              <User size={36} color="#94a3b8" />
            </div>
          )}
          <div>
            <h2 className="europass-name" style={{ fontSize: '1.6rem' }}>{personal.firstName} {personal.lastName}</h2>
            <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.25rem' }}>
              {[personal.address, personal.city, personal.country].filter(Boolean).join(', ')} | {personal.email} | {personal.phonePrefix} {personal.phone}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '0.875rem', background: '#f8fafc', padding: '1rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
        <div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>{t.recipientInfo}:</span><br />
          {coverLetter.recipientName && <div><strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{coverLetter.recipientName}</strong></div>}
          {coverLetter.recipientTitle && <div>{coverLetter.recipientTitle}</div>}
          {coverLetter.companyName && <div style={{ color: primaryColor, fontWeight: 700 }}>{coverLetter.companyName}</div>}
          {coverLetter.companyAddress && <div>{coverLetter.companyAddress}</div>}
          {(coverLetter.city || coverLetter.country) && <div>{[coverLetter.city, coverLetter.country].filter(Boolean).join(', ')}</div>}
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>{t.submissionDate}:</span><br />
          <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{coverLetter.date || new Date().toISOString().split('T')[0]}</strong>
        </div>
      </div>

      {coverLetter.subject && (
        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: primaryColor, marginBottom: '1.5rem', borderBottom: '2px solid var(--primary-theme, #0e47a1)', paddingBottom: '0.5rem' }}>
          {t.subject}: {coverLetter.subject}
        </div>
      )}

      <div style={{ fontSize: '0.925rem', lineHeight: '1.75', color: '#1e293b', whiteSpace: 'pre-line' }}>
        {coverLetter.openingSalutation && <p style={{ fontWeight: 700, marginBottom: '1.25rem' }}>{coverLetter.openingSalutation}</p>}
        
        <p style={{ marginBottom: '1.75rem' }}>{coverLetter.bodyParagraphs}</p>
        
        {coverLetter.closingSalutation && <p style={{ fontWeight: 700, marginTop: '2rem' }}>{coverLetter.closingSalutation}</p>}
        
        <div style={{ marginTop: '2.5rem', fontWeight: 800, color: primaryColor, fontSize: '1rem' }}>
          {personal.firstName} {personal.lastName}
        </div>
      </div>
    </div>
  );
};
