import type { EuropassCVData } from '../types';

export interface TranslationOptions {
  translateAboutMe: boolean;
  translateWork: boolean;
  translateEducation: boolean;
  translateCertifications: boolean;
  translateSkills: boolean;
  translateCustomSections: boolean;
  translateCoverLetter: boolean;
}

export const defaultTranslationOptions: TranslationOptions = {
  translateAboutMe: true,
  translateWork: true,
  translateEducation: true,
  translateCertifications: true,
  translateSkills: true,
  translateCustomSections: true,
  translateCoverLetter: true
};

// In-memory cache for translations during session
const translationCache = new Map<string, string>();

/**
 * Translate a single piece of text using MyMemory API with caching and fallback.
 */
export async function translateText(
  text: string,
  fromLang: string = 'en',
  toLang: string = 'de'
): Promise<string> {
  const trimmed = (text || '').trim();
  if (!trimmed) return text;
  if (fromLang.toLowerCase() === toLang.toLowerCase()) return text;

  // Numbers, URLs or pure symbols don't need translation
  if (/^[\d\s+\-.,:;/#%@()]+$/.test(trimmed) || /^https?:\/\//.test(trimmed)) {
    return text;
  }

  const cacheKey = `${fromLang}|${toLang}|${trimmed}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    // Break large text into paragraphs/chunks if needed (MyMemory allows up to 500 chars per query)
    if (trimmed.length > 450) {
      const paragraphs = trimmed.split('\n');
      const translatedParagraphs: string[] = [];
      for (const p of paragraphs) {
        if (p.trim()) {
          const transP = await translateChunk(p.trim(), fromLang, toLang);
          translatedParagraphs.push(transP);
        } else {
          translatedParagraphs.push('');
        }
      }
      const finalResult = translatedParagraphs.join('\n');
      translationCache.set(cacheKey, finalResult);
      return finalResult;
    }

    const res = await translateChunk(trimmed, fromLang, toLang);
    translationCache.set(cacheKey, res);
    return res;
  } catch (err) {
    console.warn(`Translation fallback triggered for: "${trimmed.substring(0, 30)}..."`, err);
    return fallbackGlossaryTranslate(trimmed, toLang);
  }
}

async function translateChunk(chunk: string, fromLang: string, toLang: string): Promise<string> {
  // Try Provider 1: Google Translate public single client (Fast, reliable, accurate)
  try {
    const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(fromLang)}&tl=${encodeURIComponent(toLang)}&dt=t&q=${encodeURIComponent(chunk)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const resp = await fetch(gUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const textParts = data[0].map((item: any) => (item && item[0]) ? item[0] : '').filter(Boolean);
        const translated = textParts.join('');
        if (translated && translated.trim()) {
          return decodeHTMLEntities(translated);
        }
      }
    }
  } catch (err) {
    console.debug('Google translate API attempt failed, falling back to MyMemory...', err);
  }

  // Try Provider 2: MyMemory Translated API
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${encodeURIComponent(fromLang)}|${encodeURIComponent(toLang)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    clearTimeout(timeoutId);

    if (resp.ok) {
      const data = await resp.json();
      if (data && data.responseData && typeof data.responseData.translatedText === 'string') {
        let result = data.responseData.translatedText;
        result = decodeHTMLEntities(result);
        if (!result.includes('MYMEMORY WARNING:') && result.trim()) {
          return result;
        }
      }
    }
  } catch (err) {
    console.debug('MyMemory translation fallback failed...', err);
  }

  // Provider 3: Fallback Glossary
  return fallbackGlossaryTranslate(chunk, toLang);
}

function decodeHTMLEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

/**
 * Basic offline fallback dictionary for common words and phrases
 */
const COMMON_FALLBACKS: Record<string, Record<string, string>> = {
  de: {
    'Present': 'Heute',
    'Ongoing': 'Laufend',
    'Dear Hiring Committee,': 'Sehr geehrte Damen und Herren,',
    'Sincerely,': 'Mit freundlichen Grüßen,',
    'Application for': 'Bewerbung als'
  },
  fr: {
    'Present': 'Présent',
    'Ongoing': 'En cours',
    'Dear Hiring Committee,': 'Madame, Monsieur,',
    'Sincerely,': 'Veuillez agréer mes salutations distinguées,',
    'Application for': 'Candidature pour'
  },
  es: {
    'Present': 'Presente',
    'Ongoing': 'En curso',
    'Dear Hiring Committee,': 'Estimado comité de selección,',
    'Sincerely,': 'Atentamente,',
    'Application for': 'Solicitud para'
  },
  it: {
    'Present': 'Attuale',
    'Ongoing': 'In corso',
    'Dear Hiring Committee,': 'Gentile Commissione Selezionatrice,',
    'Sincerely,': 'Cordiali saluti,',
    'Application for': 'Candidatura per'
  },
  sk: {
    'Present': 'Súčasnosť',
    'Ongoing': 'Prebiehajúce',
    'Dear Hiring Committee,': 'Vážená výberová komisia,',
    'Sincerely,': 'S pozdravom,',
    'Application for': 'Žiadosť o pozíciu'
  },
  cs: {
    'Present': 'Dosud',
    'Ongoing': 'Probíhající',
    'Dear Hiring Committee,': 'Vážená výběrová komise,',
    'Sincerely,': 'S pozdravem,',
    'Application for': 'Žádost o pozici'
  }
};

function fallbackGlossaryTranslate(text: string, toLang: string): string {
  const langDict = COMMON_FALLBACKS[toLang.toLowerCase()];
  if (langDict && langDict[text]) {
    return langDict[text];
  }
  return text;
}

/**
 * Translate entire CV and Cover Letter document into target language
 */
export async function translateCVData(
  data: EuropassCVData,
  targetLang: string,
  options: TranslationOptions = defaultTranslationOptions,
  onProgress?: (message: string, percent: number) => void
): Promise<EuropassCVData> {
  const fromLang = data.lang || 'en';
  if (fromLang.toLowerCase() === targetLang.toLowerCase()) {
    return { ...data, lang: targetLang };
  }

  const updated: EuropassCVData = JSON.parse(JSON.stringify(data));
  updated.lang = targetLang;

  const tasks: Array<{ task: () => Promise<void>; label: string }> = [];

  // 1. Personal Info (Names, About Me & Declaration)
  if (options.translateAboutMe) {
    if (updated.personal.firstName) {
      tasks.push({
        label: 'Translating First Name...',
        task: async () => {
          updated.personal.firstName = await translateText(updated.personal.firstName, fromLang, targetLang);
        }
      });
    }
    if (updated.personal.lastName) {
      tasks.push({
        label: 'Translating Last Name...',
        task: async () => {
          updated.personal.lastName = await translateText(updated.personal.lastName, fromLang, targetLang);
        }
      });
    }
    if (updated.personal.aboutMe) {
      tasks.push({
        label: 'Translating Personal Summary (About Me)...',
        task: async () => {
          updated.personal.aboutMe = await translateText(updated.personal.aboutMe!, fromLang, targetLang);
        }
      });
    }
    if (updated.personal.declaration) {
      tasks.push({
        label: 'Translating Declaration Statement...',
        task: async () => {
          updated.personal.declaration = await translateText(updated.personal.declaration!, fromLang, targetLang);
        }
      });
    }
  }

  // 2. Work Experiences
  if (options.translateWork && updated.workExperiences && updated.workExperiences.length > 0) {
    for (let i = 0; i < updated.workExperiences.length; i++) {
      const exp = updated.workExperiences[i];
      tasks.push({
        label: `Translating Work Experience #${i + 1} (${exp.jobTitle || 'Role'})...`,
        task: async () => {
          if (exp.jobTitle) {
            exp.jobTitle = await translateText(exp.jobTitle, fromLang, targetLang);
          }
          if (exp.description) {
            exp.description = await translateText(exp.description, fromLang, targetLang);
          }
        }
      });
    }
  }

  // 3. Education
  if (options.translateEducation && updated.educationList && updated.educationList.length > 0) {
    for (let i = 0; i < updated.educationList.length; i++) {
      const edu = updated.educationList[i];
      tasks.push({
        label: `Translating Education Degree #${i + 1}...`,
        task: async () => {
          if (edu.title) {
            edu.title = await translateText(edu.title, fromLang, targetLang);
          }
          if (edu.fieldOfStudy) {
            edu.fieldOfStudy = await translateText(edu.fieldOfStudy, fromLang, targetLang);
          }
        }
      });
    }
  }

  // 4. Certifications
  if (options.translateCertifications && updated.certifications && updated.certifications.length > 0) {
    for (let i = 0; i < updated.certifications.length; i++) {
      const cert = updated.certifications[i];
      tasks.push({
        label: `Translating Certification #${i + 1}...`,
        task: async () => {
          if (cert.title) {
            cert.title = await translateText(cert.title, fromLang, targetLang);
          }
        }
      });
    }
  }

  // 5. Skills
  if (options.translateSkills) {
    if (updated.skillsList && updated.skillsList.length > 0) {
      tasks.push({
        label: 'Translating Interpersonal & Management Skills...',
        task: async () => {
          const translatedSkills: string[] = [];
          for (const s of updated.skillsList) {
            translatedSkills.push(await translateText(s, fromLang, targetLang));
          }
          updated.skillsList = translatedSkills;
        }
      });
    }

    if (updated.digitalSkills && updated.digitalSkills.length > 0) {
      tasks.push({
        label: 'Translating Digital Skills...',
        task: async () => {
          const translatedDigital: string[] = [];
          for (const ds of updated.digitalSkills) {
            translatedDigital.push(await translateText(ds, fromLang, targetLang));
          }
          updated.digitalSkills = translatedDigital;
        }
      });
    }
  }

  // 6. Custom Sections
  if (options.translateCustomSections && updated.customSections && updated.customSections.length > 0) {
    for (let i = 0; i < updated.customSections.length; i++) {
      const sec = updated.customSections[i];
      tasks.push({
        label: `Translating Custom Section: ${sec.title}...`,
        task: async () => {
          if (sec.title) sec.title = await translateText(sec.title, fromLang, targetLang);
          if (sec.content) sec.content = await translateText(sec.content, fromLang, targetLang);
        }
      });
    }
  }

  // 7. Cover Letter
  if (options.translateCoverLetter && updated.coverLetter) {
    tasks.push({
      label: 'Translating Cover Letter...',
      task: async () => {
        const cl = updated.coverLetter!;
        if (cl.subject) cl.subject = await translateText(cl.subject, fromLang, targetLang);
        if (cl.openingSalutation) cl.openingSalutation = await translateText(cl.openingSalutation, fromLang, targetLang);
        if (cl.bodyParagraphs) cl.bodyParagraphs = await translateText(cl.bodyParagraphs, fromLang, targetLang);
        if (cl.closingSalutation) cl.closingSalutation = await translateText(cl.closingSalutation, fromLang, targetLang);
      }
    });
  }

  const totalTasks = tasks.length;
  if (totalTasks === 0) {
    if (onProgress) onProgress('Completed', 100);
    return updated;
  }

  for (let idx = 0; idx < totalTasks; idx++) {
    const item = tasks[idx];
    const percent = Math.round(((idx) / totalTasks) * 100);
    if (onProgress) onProgress(item.label, percent);
    try {
      await item.task();
    } catch (e) {
      console.error('Task error during batch translation', e);
    }
  }

  if (onProgress) onProgress('Translation complete!', 100);
  return updated;
}
