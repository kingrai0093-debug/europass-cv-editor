import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES } from '../data/translations';
import { translateText } from '../utils/translator';
import { Sparkles, Loader2 } from 'lucide-react';

interface FieldTranslateButtonProps {
  value: string;
  onTranslated: (newValue: string) => void;
  fromLang?: string;
  buttonLabel?: string;
}

export const FieldTranslateButton: React.FC<FieldTranslateButtonProps> = ({
  value,
  onTranslated,
  fromLang = 'en',
  buttonLabel = 'Translate'
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleTranslateTo = async (targetLang: string) => {
    if (!value || !value.trim()) return;
    setLoading(true);
    setIsOpen(false);
    try {
      const res = await translateText(value, fromLang, targetLang);
      onTranslated(res);
    } catch (e) {
      console.error('Failed to translate field', e);
    } finally {
      setLoading(false);
    }
  };

  const quickLangs = [
    { code: 'en', label: '🇬🇧 EN' },
    { code: 'de', label: '🇩🇪 DE' },
    { code: 'fr', label: '🇫🇷 FR' },
    { code: 'es', label: '🇪🇸 ES' },
    { code: 'it', label: '🇮🇹 IT' },
    { code: 'sk', label: '🇸🇰 SK' },
    { code: 'cs', label: '🇨🇿 CS' },
    { code: 'pl', label: '🇵🇱 PL' },
    { code: 'ro', label: '🇷🇴 RO' },
    { code: 'nl', label: '🇳🇱 NL' }
  ];

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        disabled={loading || !value.trim()}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontSize: '0.725rem',
          padding: '0.2rem 0.5rem',
          borderRadius: '4px',
          border: '1px solid #cbd5e1',
          background: '#f8fafc',
          color: '#0e47a1',
          fontWeight: 600,
          cursor: value.trim() ? 'pointer' : 'not-allowed',
          opacity: value.trim() ? 1 : 0.6
        }}
        title="Translate this text to another language"
      >
        {loading ? (
          <>
            <Loader2 size={12} className="spin-animate" /> Translating...
          </>
        ) : (
          <>
            <Sparkles size={12} /> {buttonLabel}
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 999 }}
            onClick={() => setIsOpen(false)}
          />
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              marginTop: '4px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
              zIndex: 1000,
              padding: '0.5rem',
              width: '200px'
            }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Translate to:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.3rem', marginBottom: '0.5rem' }}>
              {quickLangs.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleTranslateTo(lang.code)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    padding: '0.25rem 0.4rem',
                    fontSize: '0.75rem',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.4rem' }}>
              <select
                className="form-control"
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.4rem' }}
                onChange={e => {
                  if (e.target.value) handleTranslateTo(e.target.value);
                }}
                defaultValue=""
              >
                <option value="" disabled>More languages...</option>
                {SUPPORTED_LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
