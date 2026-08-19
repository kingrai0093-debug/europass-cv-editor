import React, { useState } from 'react';
import type { EuropassCVData } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/translations';
import { translateCVData, type TranslationOptions, defaultTranslationOptions } from '../utils/translator';
import { Globe, Check, Loader2, Sparkles, X, ArrowRight, RotateCcw, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: EuropassCVData;
  onApplyTranslation: (newData: EuropassCVData) => void;
}

export const TranslationModal: React.FC<TranslationModalProps> = ({
  isOpen,
  onClose,
  data,
  onApplyTranslation
}) => {
  const [targetLang, setTargetLang] = useState<string>('de');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [options, setOptions] = useState<TranslationOptions>(defaultTranslationOptions);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [progressLabel, setProgressLabel] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [backupData, setBackupData] = useState<EuropassCVData | null>(null);
  const [lastTranslatedLang, setLastTranslatedLang] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentLangCode = data.lang || 'en';
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLangCode) || {
    code: currentLangCode,
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧'
  };

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularLanguages = ['de', 'fr', 'es', 'it', 'nl', 'pl', 'sk', 'cs', 'ro', 'sv'];

  const handleStartTranslation = async () => {
    if (targetLang === currentLangCode) {
      alert('Selected target language is already the current document language.');
      return;
    }

    setIsTranslating(true);
    setErrorMsg(null);
    setProgressPercent(5);
    setProgressLabel('Initializing translation engine...');

    // Save backup before transforming
    setBackupData(JSON.parse(JSON.stringify(data)));

    try {
      const translatedResult = await translateCVData(
        data,
        targetLang,
        options,
        (msg, pct) => {
          setProgressLabel(msg);
          setProgressPercent(pct);
        }
      );

      onApplyTranslation(translatedResult);
      setLastTranslatedLang(targetLang);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 }
      });
    } catch (err: any) {
      console.error('Translation failed:', err);
      setErrorMsg('Translation process encountered an issue. Partial or offline dictionary translations were applied.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleUndo = () => {
    if (backupData) {
      onApplyTranslation(backupData);
      setBackupData(null);
      setLastTranslatedLang(null);
      alert('Document reverted to previous state before translation.');
    }
  };

  return (
    <div className="modal-backdrop" style={{ zIndex: 9999 }}>
      <div className="modal-container" style={{ maxWidth: '680px', width: '92%' }}>
        {/* Modal Header */}
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: '#e0edff', color: '#0e47a1', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
              <Globe size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0e47a1' }}>
                Translate CV & Cover Letter
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                Official Europass Multi-language Translation Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isTranslating}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.2rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '1.25rem', maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Current vs Target Selector Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc',
            border: '1.5px solid #d0e1ff',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.25rem'
          }}>
            {/* From */}
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.2rem' }}>
                Current Document
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <span>{currentLangObj.flag}</span>
                <span>{currentLangObj.name} ({currentLangObj.code.toUpperCase()})</span>
              </div>
            </div>

            {/* Arrow */}
            <div style={{ padding: '0 0.75rem', color: '#0e47a1', display: 'flex', alignItems: 'center' }}>
              <ArrowRight size={22} />
            </div>

            {/* To */}
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.2rem' }}>
                Target Language
              </div>
              {(() => {
                const targetObj = SUPPORTED_LANGUAGES.find(l => l.code === targetLang);
                return (
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0e47a1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <span>{targetObj?.flag}</span>
                    <span>{targetObj?.name} ({targetLang.toUpperCase()})</span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Quick European Presets */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.4rem' }}>
              Popular European Languages:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {popularLanguages.map(code => {
                const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
                if (!lang) return null;
                const isSelected = targetLang === code;
                return (
                  <button
                    key={code}
                    type="button"
                    disabled={isTranslating}
                    onClick={() => setTargetLang(code)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.825rem',
                      fontWeight: isSelected ? 700 : 500,
                      border: isSelected ? '1.5px solid #0e47a1' : '1px solid #cbd5e1',
                      background: isSelected ? '#0e47a1' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#1e293b',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* All Languages Dropdown & Search */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.4rem' }}>
              Choose from all 25+ Supported Languages:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search language (e.g. Spanish, German, French, Slovak)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                disabled={isTranslating}
                style={{ flex: 1 }}
              />
              <select
                className="form-control"
                value={targetLang}
                onChange={e => setTargetLang(e.target.value)}
                disabled={isTranslating}
                style={{ width: '220px', fontWeight: 600 }}
              >
                {filteredLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Translation Scope Checkboxes */}
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0e47a1', marginBottom: '0.6rem' }}>
              Select Sections to Translate:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={options.translateAboutMe}
                  disabled={isTranslating}
                  onChange={e => setOptions({ ...options, translateAboutMe: e.target.checked })}
                />
                Personal Summary / About Me
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={options.translateWork}
                  disabled={isTranslating}
                  onChange={e => setOptions({ ...options, translateWork: e.target.checked })}
                />
                Work Experience (Titles & Descriptions)
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={options.translateEducation}
                  disabled={isTranslating}
                  onChange={e => setOptions({ ...options, translateEducation: e.target.checked })}
                />
                Education (Degrees & Studies)
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={options.translateSkills}
                  disabled={isTranslating}
                  onChange={e => setOptions({ ...options, translateSkills: e.target.checked })}
                />
                Skills & Competencies
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={options.translateCertifications}
                  disabled={isTranslating}
                  onChange={e => setOptions({ ...options, translateCertifications: e.target.checked })}
                />
                Certificates & Licences
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={options.translateCoverLetter}
                  disabled={isTranslating}
                  onChange={e => setOptions({ ...options, translateCoverLetter: e.target.checked })}
                />
                Cover Letter (Subject & Body)
              </label>
            </div>
          </div>

          {/* Progress / Status Display */}
          {isTranslating && (
            <div style={{ background: '#eef4ff', padding: '1rem', borderRadius: '8px', border: '1px solid #bfdbfe', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: '#0e47a1', marginBottom: '0.4rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Loader2 size={16} className="spin-animate" /> {progressLabel}
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#dbeafe', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #0e47a1, #2563eb)',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          )}

          {errorMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#fef2f2', color: '#991b1b', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {lastTranslatedLang && !isTranslating && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.85rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#166534', fontSize: '0.875rem', fontWeight: 700 }}>
                <Check size={18} />
                <span>Successfully translated document to {SUPPORTED_LANGUAGES.find(l => l.code === lastTranslatedLang)?.name}!</span>
              </div>
              {backupData && (
                <button
                  onClick={handleUndo}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <RotateCcw size={14} /> Revert Changes
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', padding: '0.85rem 1.25rem', background: '#f8fafc' }}>
          <div>
            {backupData && !isTranslating && (
              <button
                type="button"
                className="btn-secondary"
                onClick={handleUndo}
                style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <RotateCcw size={14} /> Undo Translation
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isTranslating}
            >
              Close
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleStartTranslation}
              disabled={isTranslating || targetLang === currentLangCode}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#0e47a1', padding: '0.5rem 1.2rem', fontWeight: 700 }}
            >
              {isTranslating ? (
                <>
                  <Loader2 size={16} className="spin-animate" /> Translating...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Translate Document
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
