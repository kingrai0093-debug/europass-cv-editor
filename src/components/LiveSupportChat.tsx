import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Minimize2,
  Bot,
  User,
  Sparkles,
  BookOpen,
  Globe,
  Check,
  Settings,
  Zap,
  Key
} from 'lucide-react';
import { translateText } from '../utils/translator';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  suggestions?: string[];
  lang?: string;
  modelBadge?: string;
}

interface KnowledgeTopic {
  id: string;
  keywords: string[];
  title: string;
  response: string;
  suggestions: string[];
}

export const SUPPORT_CHAT_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ne', name: 'नेपाली', flag: '🇳🇵' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' }
];

const PRE_TRAINED_KNOWLEDGE_BASE: KnowledgeTopic[] = [
  {
    id: 'pdf_export',
    keywords: ['pdf', 'export', 'download', 'print', 'save', 'file', 'hardcopy', 'page', 'margins', 'ats'],
    title: 'PDF Export & Printing',
    response: `📄 **Official Europass PDF Export Instructions:**

1. Click the **"Export PDF"** button on the top-right toolbar.
2. In your browser's Print Dialog, set **Destination** to **"Save as PDF"**.
3. **Important:** Open *More Settings* and check **"Background graphics"** so the official Europass navy headers and icons render.
4. Set Paper size to **A4** (European Standard) and Margins to **Default**.
5. Click **Save** for an ATS-optimized, vector-sharp document!`,
    suggestions: ['How to customize cover letter?', 'Translate CV', 'ATS compatibility']
  },
  {
    id: 'translation_system',
    keywords: ['translate', 'translation', 'language', 'german', 'french', 'spanish', 'italian', 'dutch', 'polish', 'romanian', 'hindi', 'nepali', 'multilingual'],
    title: 'Multi-Language Translation Engine',
    response: `🌍 **Multi-Tier Europass Translation System:**

- **Full CV Translation:** Click **"🌐 Translate CV / Language"** in the top navigation or preview bar. Select any of the 25+ EU languages (e.g. Deutsch, Français, Español, Italiano, Nederlands).
- **Field-Level Translate:** Click the blue translate icon next to specific job descriptions or personal summaries to translate on the fly.
- **Engine Pipeline:** The engine uses Google Translate API with MyMemory fallback and local dictionaries for 100% offline reliability.`,
    suggestions: ['CEFR Language Levels', 'Export translated CV', 'Add new language']
  },
  {
    id: 'company_map_gathering',
    keywords: ['map', 'company', 'address', 'location', 'satellite', 'street view', 'employer', 'hotal', 'hotel', 'plus code', 'coordinates'],
    title: 'Company Map & Location Gathering',
    response: `🏢 **Company Location & Google Maps Gathering:**

- Switch to the **"Company Map & Street Search"** tab.
- Search for any target company (e.g., *Siemens Munich*, *VFS Global Brussels*, *Hari Hotel*).
- The system extracts:
  - Full Street Address, City, Country
  - GPS Coordinates (Latitude / Longitude)
  - Google Plus Codes (e.g. \`F6JP+GP\`)
  - 3D Satellite & Street Google Map views
- Click **"✅ Save & Apply to Europass Cover Letter"** to auto-fill the employer section!`,
    suggestions: ['Research company phone', 'Cover letter format', 'Export PDF']
  },
  {
    id: 'phone_research_osint',
    keywords: ['phone', 'mobile', 'research', 'osint', 'background', 'lookup', 'carrier', 'e164', 'facebook', 'instagram', 'truecaller', 'whatsapp', 'number'],
    title: 'Agent Mobile Data Research (OSINT)',
    response: `📱 **Agent Mobile Data Research Portal:**

- Open **"Agent Mobile Data Research"** tab.
- Enter any international number (e.g., \`+977 982-402-4789\`, \`+32 2 299 11 11\`).
- **Features Analyzed:**
  - Standard E.164 normalization & ITU-T validation
  - Country flag, Calling Code, and Carrier structure (e.g. Ncell, NTC, Smart)
  - Live Account queries on Facebook & Instagram (displaying real account UIDs, classifications, and sub-profiles in-app)
  - Direct public registry links (Google, WhatsApp, Truecaller, Numverify).`,
    suggestions: ['Company Map Search', 'Copy profile dossier', 'Translate CV']
  },
  {
    id: 'cefr_levels',
    keywords: ['cefr', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2', 'mother tongue', 'fluency', 'proficiency', 'listening', 'reading', 'speaking', 'writing'],
    title: 'CEFR Language Proficiency Grid',
    response: `⭐ **Common European Framework of Reference for Languages (CEFR):**

- **A1 (Beginner):** Understands basic daily phrases and simple introductions.
- **A2 (Elementary):** Communicates simple routine tasks and direct exchanges.
- **B1 (Intermediate):** Understands workplace topics, travels, and explains opinions.
- **B2 (Upper Intermediate):** Professional working fluency, complex technical texts.
- **C1 (Advanced):** Expresses ideas fluently without searching for expressions.
- **C2 (Mastery):** Native-level command of written and spoken language.

*Europass requires rating Listening, Reading, Spoken Interaction, and Writing separately.*`,
    suggestions: ['Translate CV', 'Add language section']
  },
  {
    id: 'cover_letter',
    keywords: ['cover letter', 'motivational letter', 'salutation', 'subject', 'receiver', 'dear sir', 'hiring manager', 'job application'],
    title: 'Europass Cover Letter Guide',
    response: `✉️ **European Standard Cover Letter Structure:**

1. **Header:** Your contact details & Date.
2. **Employer / Recipient:** Company name, address, and department (can be auto-filled via Company Map Search).
3. **Subject Line:** e.g., \`Application for Senior Software Engineer - Ref. #EU-2026\`.
4. **Salutation:** e.g., \`Dear Hiring Team\` or \`Dear Dr. Schmidt\`.
5. **Body Paragraphs:**
   - **Introduction:** Why you are applying and which position.
   - **Core Competencies:** Real achievements tailored to job requirements.
   - **Company Fit:** Why you want to work for this specific organization.
6. **Closing:** Call to interview & professional sign-off (\`Yours sincerely\`).`,
    suggestions: ['Auto-fill company address', 'Export Cover Letter to PDF']
  },
  {
    id: 'work_experience',
    keywords: ['experience', 'work', 'job', 'position', 'employment', 'history', 'role', 'achievements', 'responsibilities', 'bullet points'],
    title: 'Work Experience Best Practices',
    response: `💼 **Writing Impactful Work Experience:**

- **Order:** Always reverse-chronological (most recent job first).
- **Formula:** Start bullet points with strong action verbs (*Spearheaded, Engineered, Directed, Coordinated*).
- **Metrics:** Include quantifiable results (*"Increased throughput by 35% across 4 global sites"*).
- **Clarity:** List Employer Name, City, Country, and clear Month/Year date ranges.`,
    suggestions: ['Education guide', 'Digital skills', 'Export PDF']
  },
  {
    id: 'education_eqf',
    keywords: ['education', 'degree', 'eqf', 'bachelor', 'master', 'phd', 'diploma', 'high school', 'university', 'college', 'gpa'],
    title: 'Education & EQF Levels',
    response: `🎓 **Education & European Qualifications Framework (EQF):**

- **EQF Level 4:** Upper Secondary / High School Diploma
- **EQF Level 5:** Vocational / Technical Short-cycle Diploma
- **EQF Level 6:** Bachelor's Degree / Undergraduate (BA, BSc, BEng)
- **EQF Level 7:** Master's Degree / Postgraduate (MA, MSc, MBA)
- **EQF Level 8:** Doctoral Degree / PhD

*Fill in your Field of Study, Institution Name, City, and final grade/honors.*`,
    suggestions: ['Add work experience', 'Certifications', 'CEFR Levels']
  },
  {
    id: 'digital_skills',
    keywords: ['skills', 'digital', 'software', 'programming', 'tools', 'competences', 'leadership', 'communication', 'digcomp'],
    title: 'Digital & Organizational Skills',
    response: `💻 **Europass Skills & Competences:**

- **Digital Skills:** List programming languages, cloud tools (AWS, GCP, Azure), ERP systems, design tools, and office suites.
- **Communication Skills:** Multicultural teamwork, negotiation, client presentations.
- **Management / Leadership:** Agile/Scrum leadership, project budgeting, cross-functional mentoring.
- **Driving Licenses:** Specify categories (e.g. \`B\`, \`C1\`, \`A\`) for logistics or field roles.`,
    suggestions: ['Add custom sections', 'Export PDF']
  },
  {
    id: 'ats_optimization',
    keywords: ['ats', 'applicant tracking', 'screening', 'keywords', 'scanner', 'pass ats', 'resume score'],
    title: 'ATS (Applicant Tracking System) Compatibility',
    response: `🎯 **How Europass Maximizes ATS Score:**

- **Standard Typography:** Built with clean system & Google fonts parseable by all ATS engines (Workday, Taleo, Greenhouse, Lever).
- **Semantic Text Hierarchy:** Clean headings (\`Work Experience\`, \`Education\`, \`Languages\`) without nested decorative text boxes.
- **Keyword Matching:** Ensure your job description text mirrors key qualifications listed in the employer's job post.
- **Vector PDF Output:** Generates machine-readable text rather than rasterized images.`,
    suggestions: ['Export PDF', 'Translate CV']
  },
  {
    id: 'eures_visa_jobs',
    keywords: ['eures', 'visa', 'blue card', 'working in europe', 'germany', 'france', 'belgium', 'netherlands', 'relocation', 'sponsorship'],
    title: 'Working in the EU & EURES Integration',
    response: `🇪🇺 **EU Job Applications & EURES Guidelines:**

- **EURES Portal:** The official EU Job Mobility Portal where Europass CVs are standard.
- **EU Blue Card:** Requires a recognized university degree (EQF 6+) and a qualified job offer meeting salary thresholds.
- **Photo Requirement:** European countries (Germany, Austria, France, etc.) typically welcome professional headshots, whereas UK/US prefer photo-free CVs.`,
    suggestions: ['Company Map Search', 'Translate CV to German', 'Export PDF']
  },
  {
    id: 'photo_guidelines',
    keywords: ['photo', 'picture', 'headshot', 'avatar', 'image', 'face', 'profile photo', 'crop'],
    title: 'CV Profile Photo Guidelines',
    response: `📸 **Europass Profile Photo Recommendations:**

- **Framing:** Clear head-and-shoulders portrait with neutral or office background.
- **Lighting & Quality:** Good lighting with high contrast, smiling and professional attire.
- **Format:** JPG / PNG. The editor automatically crops and optimizes the photo into the official Europass frame.`,
    suggestions: ['Personal info tab', 'Export PDF']
  },
  {
    id: 'privacy_gdpr',
    keywords: ['privacy', 'gdpr', 'security', 'data', 'store', 'cloud', 'leak', 'cookies', 'safe'],
    title: 'Privacy & GDPR Compliance',
    response: `🔒 **Europass Privacy & Security Guarantee:**

- **Local Processing:** Your CV data is stored locally in your browser's memory and is never uploaded or sold to third parties.
- **GDPR Compliant:** You have 100% control to edit, reset, or export your personal data at any time.
- **No Account Required:** Create and export complete resumes without mandatory sign-ups.`,
    suggestions: ['Reset data', 'Export PDF']
  }
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    sender: 'agent',
    text: '👋 **Welcome to Europass Live Customer Support!**\n\nI speak all European & world languages. Choose your preferred language above or type in any language.\n\nHow can I help you today?',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestions: [
      '📄 Export to PDF guide',
      '🌍 Translate CV into German/French',
      '🏢 Company Map & Plus Codes',
      '📱 Phone OSINT Background Research',
      '⭐ CEFR Language Levels (A1-C2)',
      '🎯 ATS Compatibility Tips'
    ]
  }
];

export const LiveSupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [chatLang, setChatLang] = useState<string>('en');
  const [showLangMenu, setShowLangMenu] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  // Engine and OpenAI Settings
  const [engineMode, setEngineMode] = useState<'smart' | 'openai'>(() => {
    return (localStorage.getItem('europass_chat_engine') as 'smart' | 'openai') || 'smart';
  });
  const [openaiKey, setOpenaiKey] = useState<string>(() => {
    return localStorage.getItem('europass_openai_key') || '';
  });
  const [openaiModel, setOpenaiModel] = useState<string>(() => {
    return localStorage.getItem('europass_openai_model') || 'gpt-4o-mini';
  });

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  const saveSettings = (engine: 'smart' | 'openai', key: string, model: string) => {
    setEngineMode(engine);
    setOpenaiKey(key);
    setOpenaiModel(model);
    localStorage.setItem('europass_chat_engine', engine);
    localStorage.setItem('europass_openai_key', key);
    localStorage.setItem('europass_openai_model', model);
    setShowSettings(false);
  };

  const matchKnowledgeTopic = async (userQuery: string, targetLang: string): Promise<{ text: string; suggestions?: string[] }> => {
    const q = userQuery.toLowerCase().trim();

    // Check greeting
    if (/^(hi|hello|hey|good morning|good afternoon|good evening|howdy|hola|bonjour|namaste|hlo|guten tag|ciao|salut|hallo)\b/i.test(q)) {
      const baseGreeting = `👋 **Hello! How can I assist you with your Europass documents today?**\n\nYou can ask about:\n- 📄 Exporting vector PDF\n- 🌍 Translating across 25+ EU languages\n- 🏢 Finding employer addresses on Google Maps\n- 📱 Agent Phone Number Background Research\n- ⭐ CEFR Language proficiency levels\n- 💼 Work experience & Cover letter structure`;
      let translated = baseGreeting;
      if (targetLang !== 'en') {
        try {
          translated = await translateText(baseGreeting, 'en', targetLang);
        } catch {
          translated = baseGreeting;
        }
      }
      return {
        text: translated,
        suggestions: ['Export to PDF', 'Translate CV', 'Company Maps Search', 'Phone Number Research']
      };
    }

    // Score matching across knowledge base
    const queryTokens = q.split(/\s+/).filter((t) => t.length >= 2);
    let bestTopic: KnowledgeTopic | null = null;
    let highestScore = 0;

    for (const topic of PRE_TRAINED_KNOWLEDGE_BASE) {
      let score = 0;
      for (const kw of topic.keywords) {
        if (q.includes(kw)) {
          score += kw.length > 4 ? 4 : 2;
        }
        for (const token of queryTokens) {
          if (kw.includes(token) || token.includes(kw)) {
            score += 2;
          }
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestTopic = topic;
      }
    }

    let responseText = '';
    let suggestionsList = ['Export to PDF', 'Translate CV', 'Company Map Search', 'Phone Number Research', 'CEFR Levels'];

    if (bestTopic && highestScore >= 2) {
      responseText = bestTopic.response;
      suggestionsList = bestTopic.suggestions;
    } else {
      responseText = `🔍 **Europass Knowledge Assistant regarding: "${userQuery}"**\n\nI have pre-trained modules ready for all Europass tools. Which area would you like help with?\n\n1. **📄 CV & Cover Letter Creation:** Work experience, education, EQF levels, CEFR languages.\n2. **🌍 Translation:** Converting documents across 25+ EU languages.\n3. **🏢 Company Map Gathering:** Extracting official employer addresses and Plus Codes.\n4. **📱 Agent Mobile Data Research:** Deep phone number verification and profile extraction.\n5. **🖨️ PDF Vector Printing:** Margin & ATS compliance setup.`;
    }

    if (targetLang !== 'en') {
      try {
        responseText = await translateText(responseText, 'en', targetLang);
      } catch (err) {
        console.warn('Chat translation fallback', err);
      }
    }

    return {
      text: responseText,
      suggestions: suggestionsList
    };
  };

  const streamAgentMessage = (fullText: string, suggestions?: string[], badge?: string) => {
    const agentMsgId = String(Date.now() + 1);
    const words = fullText.split(' ');
    let currentText = '';

    const initialAgentMsg: ChatMessage = {
      id: agentMsgId,
      sender: 'agent',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: undefined,
      lang: chatLang,
      modelBadge: badge
    };

    setMessages((prev) => [...prev, initialAgentMsg]);
    setIsTyping(false);

    let index = 0;
    const streamInterval = setInterval(() => {
      if (index < words.length) {
        currentText += (index === 0 ? '' : ' ') + words[index];
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === agentMsgId ? { ...msg, text: currentText } : msg
          )
        );
        index++;
      } else {
        clearInterval(streamInterval);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === agentMsgId ? { ...msg, suggestions } : msg
          )
        );
      }
    }, 20);
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // If user configured OpenAI ChatGPT API mode and has an API Key
    if (engineMode === 'openai' && openaiKey.trim()) {
      try {
        const history = messages.slice(-5).map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }));
        history.push({ role: 'user', content: query });

        const res = await fetch('http://localhost:8787/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey: openaiKey.trim(),
            model: openaiModel,
            messages: history,
            systemPrompt: `You are the official Europass Customer Support AI Assistant. Answer in the user's selected language (${currentLangObj.name}). Guide on European CVs, Cover Letters, CEFR levels (A1-C2), EQF qualifications, Google Maps location gathering, and Agent Mobile OSINT research.`
          })
        });

        if (res.ok) {
          const data = await res.json();
          const replyText = data.choices?.[0]?.message?.content || 'No response received.';
          streamAgentMessage(replyText, ['Export to PDF', 'Translate CV', 'Company Map Search'], `ChatGPT (${openaiModel})`);
          return;
        }
      } catch (err) {
        console.warn('OpenAI backend call failed, falling back to smart local knowledge engine', err);
      }
    }

    // Default Smart Pre-Trained Engine fallback
    matchKnowledgeTopic(query, chatLang).then((resp) => {
      streamAgentMessage(resp.text, resp.suggestions, 'Pre-Trained Knowledge Engine');
    });
  };

  const currentLangObj = SUPPORT_CHAT_LANGUAGES.find((l) => l.code === chatLang) || SUPPORT_CHAT_LANGUAGES[0];

  return (
    <div className="no-print" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => { setIsOpen(true); setIsMinimized(false); }}
          style={{
            background: 'linear-gradient(135deg, #0e47a1 0%, #1e3a8a 100%)',
            color: '#ffffff',
            border: '2px solid #93c5fd',
            borderRadius: '50px',
            padding: '0.75rem 1.3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            boxShadow: '0 8px 24px rgba(14, 71, 161, 0.35)',
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: '0.9rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <MessageSquare size={20} color="#93c5fd" />
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', border: '1.5px solid #ffffff' }} />
          </div>
          <span>Live Support</span>
          <span style={{ fontSize: '0.7rem', background: '#22c55e', color: '#ffffff', padding: '0.1rem 0.45rem', borderRadius: '10px', fontWeight: 800 }}>
            {currentLangObj.flag} ONLINE
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          width: '420px',
          maxWidth: 'calc(100vw - 32px)',
          height: isMinimized ? '54px' : '580px',
          background: '#ffffff',
          borderRadius: '14px',
          boxShadow: '0 16px 36px rgba(15, 23, 42, 0.25)',
          border: '1.5px solid #bfdbfe',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'height 0.25s ease'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #0e47a1 0%, #1e3a8a 100%)',
            color: '#ffffff',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.15)',
            userSelect: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={19} color="#ffffff" />
                </div>
                <span style={{ position: 'absolute', bottom: '0', right: '0', width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', border: '1.5px solid #ffffff' }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', lineHeight: 1.2 }}>Europass Live Support</div>
                <div style={{ fontSize: '0.7rem', color: '#93c5fd', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span>🟢 {engineMode === 'openai' && openaiKey.trim() ? `ChatGPT (${openaiModel})` : 'Smart Engine'}</span> · <span>24/7 AI</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {/* Language Selector Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => { setShowLangMenu((v) => !v); setShowSettings(false); }}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    color: '#ffffff',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                  title="Change Support Chat Language"
                >
                  <Globe size={13} />
                  <span>{currentLangObj.flag}</span>
                </button>

                {showLangMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    width: '160px',
                    maxHeight: '220px',
                    overflowY: 'auto',
                    background: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    border: '1px solid #cbd5e1',
                    zIndex: 10000,
                    padding: '0.35rem 0'
                  }}>
                    {SUPPORT_CHAT_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setChatLang(lang.code);
                          setShowLangMenu(false);
                          const welcomeTexts: Record<string, string> = {
                            de: 'Hallo! Wie kann ich Ihnen heute bei Ihren Europass-Dokumenten helfen?',
                            fr: 'Bonjour! Comment puis-je vous aider aujourd’hui avec vos documents Europass?',
                            es: '¡Hola! ¿Cómo puedo ayudarte hoy con tus documentos Europass?',
                            it: 'Ciao! Come posso aiutarti oggi con i tuoi documenti Europass?',
                            hi: 'नमस्ते! आज मैं आपके यूरोपॉस दस्तावेज़ों में कैसे मदद कर सकता हूँ?',
                            ne: 'नमस्ते! म आज तपाईंको युरोपास कागजातहरूमा कसरी मद्दत गर्न सक्छु?',
                            en: 'Hello! How can I assist you with your Europass documents today?'
                          };
                          setMessages((prev) => [
                            ...prev,
                            {
                              id: String(Date.now()),
                              sender: 'agent',
                              text: welcomeTexts[lang.code] || `👋 Switched language to ${lang.name}. How can I assist you?`,
                              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                              lang: lang.code
                            }
                          ]);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.4rem 0.75rem',
                          fontSize: '0.78rem',
                          background: chatLang === lang.code ? '#eff6ff' : 'transparent',
                          color: chatLang === lang.code ? '#1d4ed8' : '#334155',
                          fontWeight: chatLang === lang.code ? 800 : 500,
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>{lang.flag} {lang.name}</span>
                        {chatLang === lang.code && <Check size={13} color="#1d4ed8" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* API Settings Gear Button */}
              <button
                type="button"
                onClick={() => { setShowSettings((v) => !v); setShowLangMenu(false); }}
                style={{
                  background: showSettings ? '#2563eb' : 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#ffffff',
                  padding: '0.25rem 0.45rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="AI Engine & API Settings"
              >
                <Settings size={14} />
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized((v) => !v)}
                style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center', borderRadius: '4px' }}
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                <Minimize2 size={16} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center', borderRadius: '4px' }}
                title="Close"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Settings Overlay Drawer */}
          {showSettings && !isMinimized && (
            <div style={{
              background: '#f8fafc',
              borderBottom: '2px solid #bfdbfe',
              padding: '0.85rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}>
              <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Settings size={14} color="#2563eb" /> AI Engine & Model Settings
              </div>

              {/* Mode Toggle */}
              <div style={{ display: 'flex', gap: '0.45rem' }}>
                <button
                  type="button"
                  onClick={() => setEngineMode('smart')}
                  style={{
                    flex: 1,
                    padding: '0.4rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    border: '1.5px solid',
                    borderColor: engineMode === 'smart' ? '#2563eb' : '#cbd5e1',
                    background: engineMode === 'smart' ? '#eff6ff' : '#ffffff',
                    color: engineMode === 'smart' ? '#1d4ed8' : '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <Zap size={13} color="#2563eb" /> Smart Engine (Offline)
                </button>
                <button
                  type="button"
                  onClick={() => setEngineMode('openai')}
                  style={{
                    flex: 1,
                    padding: '0.4rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    border: '1.5px solid',
                    borderColor: engineMode === 'openai' ? '#10b981' : '#cbd5e1',
                    background: engineMode === 'openai' ? '#ecfdf5' : '#ffffff',
                    color: engineMode === 'openai' ? '#047857' : '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <Bot size={13} color="#10b981" /> OpenAI ChatGPT
                </button>
              </div>

              {/* OpenAI Config Fields */}
              {engineMode === 'openai' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.2rem' }}>
                      <Key size={11} /> OpenAI API Key:
                    </label>
                    <input
                      type="password"
                      value={openaiKey}
                      onChange={(e) => setOpenaiKey(e.target.value)}
                      placeholder="sk-..."
                      style={{ width: '100%', padding: '0.35rem 0.55rem', fontSize: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '5px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#334155', marginBottom: '0.2rem', display: 'block' }}>
                      Model:
                    </label>
                    <select
                      value={openaiModel}
                      onChange={(e) => setOpenaiModel(e.target.value)}
                      style={{ width: '100%', padding: '0.35rem 0.55rem', fontSize: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '5px', outline: 'none', background: '#ffffff' }}
                    >
                      <option value="gpt-4o-mini">gpt-4o-mini (Fast & Recommended)</option>
                      <option value="gpt-4o">gpt-4o (High Intelligence)</option>
                      <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => saveSettings(engineMode, openaiKey, openaiModel)}
                style={{
                  background: '#0e47a1',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '0.2rem'
                }}
              >
                Save Settings
              </button>
            </div>
          )}

          {/* Body */}
          {!isMinimized && (
            <>
              {/* Message Feed */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {messages.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.45rem',
                      maxWidth: '90%',
                      flexDirection: m.sender === 'user' ? 'row-reverse' : 'row'
                    }}>
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: m.sender === 'user' ? '#0e47a1' : '#2563eb',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>
                        {m.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                      </div>

                      <div style={{
                        background: m.sender === 'user' ? '#0e47a1' : '#ffffff',
                        color: m.sender === 'user' ? '#ffffff' : '#1e293b',
                        padding: '0.7rem 0.9rem',
                        borderRadius: '10px',
                        border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
                        fontSize: '0.825rem',
                        lineHeight: 1.55,
                        whiteSpace: 'pre-wrap'
                      }}>
                        {m.text}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.2rem', padding: m.sender === 'user' ? '0 0.5rem 0 0' : '0 0 0 2rem', display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                      <span>{m.timestamp}</span>
                      {m.modelBadge && (
                        <span style={{ background: '#e2e8f0', color: '#475569', padding: '0.05rem 0.35rem', borderRadius: '4px', fontSize: '0.62rem', fontWeight: 600 }}>
                          {m.modelBadge}
                        </span>
                      )}
                    </div>

                    {/* Interactive suggestions */}
                    {m.suggestions && m.suggestions.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.45rem', paddingLeft: '2rem' }}>
                        {m.suggestions.map((s, si) => (
                          <button
                            key={si}
                            type="button"
                            onClick={() => handleSend(s)}
                            style={{
                              background: '#ffffff',
                              border: '1px solid #bfdbfe',
                              color: '#0e47a1',
                              padding: '0.25rem 0.55rem',
                              borderRadius: '14px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                            }}
                          >
                            <Sparkles size={11} color="#3b82f6" /> {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bot size={14} />
                    </div>
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '0.5rem 0.75rem', borderRadius: '10px', fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span>{engineMode === 'openai' && openaiKey.trim() ? `Connecting to ${openaiModel}` : `Smart Assistant answering in ${currentLangObj.name}`}</span>
                      <span style={{ display: 'inline-block', animation: 'pulse 1s infinite' }}>...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Topics Scroll */}
              <div style={{ background: '#f1f5f9', padding: '0.4rem 0.65rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.35rem', overflowX: 'auto' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem', paddingRight: '0.2rem' }}>
                  <BookOpen size={11} /> Topics:
                </span>
                {PRE_TRAINED_KNOWLEDGE_BASE.slice(0, 5).map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleSend(topic.title)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '0.2rem 0.5rem',
                      fontSize: '0.68rem',
                      color: '#0e47a1',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      cursor: 'pointer'
                    }}
                  >
                    {topic.title}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                style={{ padding: '0.65rem 0.85rem', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.45rem', alignItems: 'center' }}
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Ask in ${currentLangObj.name} (German, French, Hindi, etc.)...`}
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.84rem',
                    border: '1.5px solid #bfdbfe',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  style={{
                    background: inputText.trim() ? '#0e47a1' : '#cbd5e1',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.55rem 0.75rem',
                    cursor: inputText.trim() ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s ease'
                  }}
                >
                  <Send size={15} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveSupportChat;
