import { useState, useEffect } from 'react';
import type { EuropassCVData } from './types';
import { sampleCVData } from './initialData';
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { FormEditor } from './components/FormEditor';
import { PreviewCV } from './components/PreviewCV';
import { PreviewCoverLetter } from './components/PreviewCoverLetter';
import { CompanyMapPage } from './components/CompanyMapPage';
import { NumberResearchPage } from './components/NumberResearchPage';
import { TranslationModal } from './components/TranslationModal';
import { LiveSupportChat } from './components/LiveSupportChat';
import { Download, RotateCcw, Globe, Menu, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

const FIREBASE_DB_URL = 'https://cv-and-cover-default-rtdb.firebaseio.com/adminConfig.json';

export function App() {
  const [cvData, setCvData] = useState<EuropassCVData>(sampleCVData);
  const [activeTab, setActiveTab] = useState<string>('personal');
  const isExporting = false;
  const [step, setStep] = useState<number>(2); // Step 2: Fill in information
  const [viewPage, setViewPage] = useState<'editor' | 'mapPage' | 'numberResearch'>('editor');
  const [docMode, setDocMode] = useState<'cv' | 'coverLetter'>('cv');
  const [isTranslationModalOpen, setIsTranslationModalOpen] = useState<boolean>(false);
  const [researchTargetNumber, setResearchTargetNumber] = useState<string>('');
  const [autoRunResearch, setAutoRunResearch] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Setup AdMob
  useEffect(() => {
    const setupAds = async () => {
      try {
        await AdMob.initialize();

        // App Open Ad (Cold Start)
        try {
          await AdMob.loadAppOpen({
            adId: 'ca-app-pub-1962939232909247/1178991890'
          });
          await AdMob.showAppOpen();
        } catch (e) {
          console.error("App Open Ad failed:", e);
        }

        // Bottom Banner Ad
        await AdMob.showBanner({
          adId: 'ca-app-pub-1962939232909247/2605266971', // Production ID
          adSize: BannerAdSize.BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          isTesting: false
        });
      } catch (error) {
        console.error("AdMob init failed:", error);
      }
    };

    setupAds();

    return () => {
      AdMob.hideBanner().catch(console.error);
    };
  }, []);


  // Admin Config State (Local Fallback)
  const [adminConfig, setAdminConfig] = useState(() => {
    const saved = localStorage.getItem('adminConfig');
    return saved ? JSON.parse(saved) : { paymentAmount: 100, esewaNumber: '9824024789' };
  });

  // Global Sync using Firebase REST API (Server-Sent Events)
  useEffect(() => {
    const source = new EventSource(FIREBASE_DB_URL);
    
    source.addEventListener('put', (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload.data && payload.data.paymentAmount) {
          setAdminConfig(payload.data);
          localStorage.setItem('adminConfig', JSON.stringify(payload.data));
        } else if (payload.data === null) {
          // Database might be empty initially
        }
      } catch (err) {
        console.error("Firebase SSE parse error:", err);
      }
    });

    return () => source.close();
  }, []);

  // Update Local Storage as fallback
  useEffect(() => {
    localStorage.setItem('adminConfig', JSON.stringify(adminConfig));
  }, [adminConfig]);

  // Keep <html lang> in sync so print CSS can target the Nepali watermark
  useEffect(() => {
    document.documentElement.lang = cvData.lang || 'en';
  }, [cvData.lang]);



  /* Export CV or Cover Letter to PDF using html2pdf and native save.
     For the Nepali CV, export with a Nepal-flag watermark centered on EVERY page. */
  const exportNepaliPdf = async (element: HTMLElement, filename: string) => {
    const wm = document.querySelector<HTMLElement>('.nepal-watermark');
    if (wm) wm.style.display = 'none';
    await new Promise(r => setTimeout(r, 80));
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });

      const flag = new Image();
      flag.src = `${import.meta.env.BASE_URL}nepal.png`;
      await new Promise(res => { flag.onload = () => res(undefined); flag.onerror = () => res(undefined); });

      if (flag.naturalWidth > 0) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const pageH = Math.round(canvas.width * (297 / 210));
          const wmW = canvas.width * 0.53;
          const wmH = (wmW * flag.naturalHeight) / flag.naturalWidth;
          ctx.globalAlpha = 0.14;
          for (let y = 0; y < canvas.height; y += pageH) {
            ctx.drawImage(flag, (canvas.width - wmW) / 2, y + (pageH - wmH) / 2, wmW, wmH);
          }
          ctx.globalAlpha = 1;
        }
      }

      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const totalH = pdfW * (canvas.height / canvas.width);
      let remaining = totalH;
      let yOff = 0;
      let first = true;
      while (remaining > 0) {
        const sliceH = Math.min(remaining, pdfH);
        const srcY = Math.round((yOff / totalH) * canvas.height);
        const srcH = Math.round((sliceH / totalH) * canvas.height);
        const slice = document.createElement('canvas');
        slice.width = canvas.width;
        slice.height = srcH;
        const sliceCtx = slice.getContext('2d');
        if (sliceCtx) {
          sliceCtx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
        }
        if (!first) pdf.addPage();
        pdf.addImage(slice, 'JPEG', 0, 0, pdfW, sliceH, undefined, 'FAST');
        remaining -= sliceH;
        yOff += sliceH;
        first = false;
      }

      if ((window as any).AndroidPrinter) {
        const base64Data = pdf.output('datauristring').split(',')[1];
        (window as any).AndroidPrinter.savePdfToDownloads(base64Data, filename);
      } else {
        pdf.save(filename);
      }
    } finally {
      if (wm) wm.style.display = '';
    }
  };

  const executeDownload = (mode: 'cv' | 'coverLetter') => {
    const docName = mode === 'coverLetter' ? 'Cover_Letter' : 'CV';
    const filename = `Europass_${docName}_${cvData.personal.firstName}_${cvData.personal.lastName}.pdf`;
    
    const element = document.getElementById(mode === 'coverLetter' ? 'europass-cover-letter-document' : 'europass-cv-document');
    if (!element) {
      alert(mode === 'coverLetter' ? 'No cover letter found. Please write a cover letter first.' : 'CV preview not found. Please try again.');
      return;
    }

    if (mode === 'cv' && cvData.lang === 'ne') {
      exportNepaliPdf(element, filename);
      return;
    }

    // html2pdf options
    const opt = {
      margin:       0,
      filename:     filename,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    if ((window as any).AndroidPrinter) {
      // Running in Android APK -> Auto Save to Storage
      html2pdf().set(opt).from(element).outputPdf('datauristring').then((pdfBase64: string) => {
        // Remove the data URI prefix
        const base64Data = pdfBase64.split(',')[1];
        (window as any).AndroidPrinter.savePdfToDownloads(base64Data, filename);
      });
    } else {
      // Desktop Browser -> Normal Download
      html2pdf().set(opt).from(element).save();
    }
  };

  const handleExportPDF = () => {
    executeDownload(docMode);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  /* const executeBothDownloads = () => {
    // 1. Switch to CV and Print synchronously
    flushSync(() => {
      setDocMode('cv');
    });
    
    setTimeout(() => {
      executeDownload('cv');
      
      // 2. Switch to Cover Letter and Print synchronously
      flushSync(() => {
        setDocMode('coverLetter');
      });
      
      setTimeout(() => {
        executeDownload('coverLetter');
        
        // 3. Switch back to CV and celebrate
        flushSync(() => {
          setDocMode('cv');
        });
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      }, 1000); // Give 1s for DOM to paint Cover Letter before printing
    }, 1000); // Give 1s for DOM to paint CV before printing
  }; */




  /* Reset to Sample Data */
  const handleResetData = () => {
    if (confirm('Are you sure you want to reset to default sample data? All unsaved changes will be lost.')) {
      setCvData(sampleCVData);
    }
  };

  return (
    <div className="app-container">
      {/* Official Europass EU Header */}
      <header className="eu-header">
        <div className="eu-header-top">
          <a href="#" className="eu-logo-area">
            <div className="eu-stars-badge">🇪🇺 ★★★</div>
            <div className="eu-logo-text">
              <span className="eu-logo-title">RBC</span>
              <span className="eu-logo-subtitle">CV-COVERLETTER AND COMPANY INFORMATION GATHERING</span>
            </div>
          </a>

          <button 
            className="mobile-menu-toggle" 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={28} />
          </button>

          <div className={`eu-header-actions ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <button 
              className="mobile-menu-close" 
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close Menu"
            >
              <X size={28} />
            </button>

            <button
              className="btn-secondary"
              style={{
                background: viewPage === 'editor' ? '#0e47a1' : '#ffffff',
                color: viewPage === 'editor' ? '#ffffff' : '#0e47a1',
                fontWeight: 700,
                border: '1.5px solid #0e47a1',
                padding: '0.45rem 0.9rem',
                borderRadius: '6px'
              }}
              onClick={() => { setViewPage('editor'); setIsMobileMenuOpen(false); }}
            >
              📝 Europass CV & Cover Letter
            </button>

            <button
              className="btn-secondary"
              style={{
                background: viewPage === 'mapPage' ? '#0e47a1' : '#ffffff',
                color: viewPage === 'mapPage' ? '#ffffff' : '#0e47a1',
                fontWeight: 700,
                border: '1.5px solid #0e47a1',
                padding: '0.45rem 0.9rem',
                borderRadius: '6px'
              }}
              onClick={() => { setViewPage('mapPage'); setIsMobileMenuOpen(false); }}
            >
              🗺️ Company Location & Google Maps Gathering
            </button>

            <button
              className="btn-secondary"
              style={{
                background: viewPage === 'numberResearch' ? '#0e47a1' : '#ffffff',
                color: viewPage === 'numberResearch' ? '#ffffff' : '#0e47a1',
                fontWeight: 700,
                border: '1.5px solid #0e47a1',
                padding: '0.45rem 0.9rem',
                borderRadius: '6px'
              }}
              onClick={() => { setViewPage('numberResearch'); setIsMobileMenuOpen(false); }}
            >
              📱 Agent Mobile Data Research
            </button>

            <a
              href="https://chat.whatsapp.com/JQ7fMgqjIHm9OHZrXkZcAN"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#25D366',
                color: '#ffffff',
                fontWeight: 700,
                border: '1.5px solid #25D366',
                padding: '0.45rem 0.9rem',
                borderRadius: '6px',
                textDecoration: 'none'
              }}
            >
              💬 WhatsApp Group
            </a>

            <button
              className="btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#ffffff',
                color: '#0e47a1',
                fontWeight: 700,
                border: '1.5px solid #0e47a1',
                padding: '0.45rem 0.9rem',
                borderRadius: '6px'
              }}
              onClick={() => { setIsTranslationModalOpen(true); setIsMobileMenuOpen(false); }}
              title="Translate entire CV & Cover Letter"
            >
              <Globe size={16} /> 🌐 Translate ({cvData.lang?.toUpperCase() || 'EN'})
            </button>



            <button className="btn-primary" onClick={() => { handleExportPDF(); setIsMobileMenuOpen(false); }} disabled={isExporting}>
              <Download size={16} /> {isExporting ? 'Generating PDF...' : 'Download (PDF)'}
            </button>
          </div>
        </div>
      </header>

      {/* VIEW PAGE 1: EDITORS */}
      {viewPage === 'editor' ? (
        <>
          {/* Stepper Progress Header */}
          <div className="eu-stepper-bar">
            <div className="eu-stepper-inner">
              <div className={`stepper-item ${step === 1 ? 'active' : 'completed'}`} onClick={() => { setStep(1); setActiveTab('template'); }}>
                <div className="stepper-number">1</div>
                <span className="stepper-label">Select Template</span>
              </div>

              <div className="stepper-divider"></div>

              <div className={`stepper-item ${step >= 2 ? 'active' : ''}`} onClick={() => setStep(2)}>
                <div className="stepper-number">2</div>
                <span className="stepper-label">Fill in Information</span>
              </div>

              <div className="stepper-divider"></div>

              <div className={`stepper-item ${step === 3 ? 'active' : ''}`} onClick={() => setStep(3)}>
                <div className="stepper-number">3</div>
                <span className="stepper-label">Download & Share</span>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="main-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <FormEditor
                data={cvData}
                onChange={setCvData}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onOpenMapPage={() => setViewPage('mapPage')}
                onOpenTranslationModal={() => setIsTranslationModalOpen(true)}
              />
            </div>

            {/* Right Live Europass Preview */}
            <div className="preview-panel">
              <div className="preview-toolbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button
                    className={`btn-secondary ${docMode === 'cv' ? 'active' : ''}`}
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: docMode === 'cv' ? '#0e47a1' : '#ffffff', color: docMode === 'cv' ? '#ffffff' : '#0e47a1' }}
                    onClick={() => setDocMode('cv')}
                  >
                    📄 Curriculum Vitae (CV)
                  </button>
                  <button
                    className={`btn-secondary ${docMode === 'coverLetter' ? 'active' : ''}`}
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: docMode === 'coverLetter' ? '#0e47a1' : '#ffffff', color: docMode === 'coverLetter' ? '#ffffff' : '#0e47a1' }}
                    onClick={() => setDocMode('coverLetter')}
                  >
                    ✉️ Cover Letter
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    className="btn-secondary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#0e47a1' }}
                    onClick={() => setIsTranslationModalOpen(true)}
                    title="Translate entire document"
                  >
                    <Globe size={14} /> Translate
                  </button>
                  <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={handleResetData}>
                    <RotateCcw size={14} /> Reset
                  </button>
                  <button className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={handleExportPDF}>
                    <Download size={14} /> {docMode === 'coverLetter' ? 'Export Cover Letter' : 'Export CV'}
                  </button>
                </div>
              </div>

              {/* Render active document sheet */}
              {docMode === 'cv' ? (
                <PreviewCV data={cvData} />
              ) : (
                <PreviewCoverLetter data={cvData} />
              )}
            </div>
          </main>
        </>
      ) : viewPage === 'mapPage' ? (
        /* VIEW PAGE 2: COMPANY LOCATION & INSTANT GOOGLE MAPS GATHERING PAGE */
        <CompanyMapPage
          onApplyCompanyDetails={(name, address, city, country) => {
            setCvData({
              ...cvData,
              coverLetter: {
                ...(cvData.coverLetter || {} as any),
                companyName: name,
                companyAddress: address,
                city: city,
                country: country
              }
            });
            setViewPage('editor');
            setActiveTab('coverLetter');
            setDocMode('coverLetter');
          }}
          onOpenNumberResearch={(phoneNumber) => {
            setResearchTargetNumber(phoneNumber);
            setAutoRunResearch(true);
            setViewPage('numberResearch');
          }}
        />
      ) : (
        /* VIEW PAGE 3: AGENT MOBILE DATA RESEARCH PAGE */
        <NumberResearchPage
          initialNumber={researchTargetNumber}
          autoRun={autoRunResearch}
        />
      )}

      {/* Official Europass Language Translation Modal */}
      <TranslationModal
        isOpen={isTranslationModalOpen}
        onClose={() => setIsTranslationModalOpen(false)}
        data={cvData}
        onApplyTranslation={(newData) => setCvData(newData)}
      />



      {/* Live Customer Support Chat Assistant */}
      <LiveSupportChat />
    </div>
  );
}

export default App;
