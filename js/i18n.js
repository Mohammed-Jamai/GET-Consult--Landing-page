(function () {
  'use strict';

  const T = {
    en: {
      meta: {
        title: 'GET Consult | Strategic Consulting & Engineering — Morocco & Africa',
        description: 'GET Consult delivers strategic consulting in engineering, finance, energy and digital transformation for industrial groups, investors and institutions across Morocco and Africa.',
        keywords: 'GET Consult, strategic consulting, engineering consulting, digital transformation, energy consulting, Morocco, Africa, Casablanca, Fès, industrial consulting',
        ogLocale: 'en_US',
      },
      nav: { about: 'About', expertise: 'Expertise', methodology: 'Methodology', contact: 'Contact', cta: 'Start a Conversation', menu: 'Menu', close: 'Close menu' },
      theme: { toggle: 'Toggle color theme' },
      hero: {
        label: 'Strategic Consulting & Engineering',
        line1: 'Transforming Industry.',
        line2: 'Accelerating Growth.',
        value: 'Strategic consulting at the intersection of engineering, finance, energy and digital — for organizations ready to transform.',
        tags: 'Industrial · Digital · Energy',
        ctaPrimary: 'Start a Conversation',
        ctaCalendly: 'Book a Quick Call',
      },
      sectors: ['Manufacturing', 'Energy', 'Infrastructure', 'Investment', 'Public Sector'],
      about: {
        number: '01 — Who We Are',
        line1: 'A Partner for',
        line2: 'Transformation.',
        body: 'GET Consult supports industries, organizations and investors through strategic transformation projects — combining engineering, finance, digital innovation and sustainability into a single, integrated practice.',
        serve: 'Serving industrial groups, investors and public institutions across Morocco and MENA.',
        engagementsLabel: 'Selected Engagements',
        e1sector: 'Industrial Manufacturing',
        e1desc: 'Operational audit & performance optimization across production lines.',
        e2sector: 'Renewable Energy',
        e2desc: 'Feasibility study & investment readiness for solar infrastructure.',
        e3sector: 'Public Infrastructure',
        e3desc: 'Digital transformation roadmap & smart systems integration.',
      },
      vision: {
        number: '02 — Vision',
        line1: "Building Tomorrow's",
        line2: 'Industry.',
        body: 'We believe the future belongs to organizations capable of combining operational excellence, technological innovation and sustainable growth.',
      },
      mission: {
        number: '03 — Mission',
        line1: 'Turning Challenges',
        line2: 'into Opportunities.',
        m1: 'Operational\nPerformance',
        m2: 'Energy\nEfficiency',
        m3: 'Digital\nTransformation',
        m4: 'Investment\nReadiness',
        m5: 'Sustainable\nGrowth',
      },
      expertise: {
        number: '04 — Expertise',
        line1: 'Four Disciplines.',
        line2: 'One Practice.',
        e1title: 'Digital\nTransformation',
        e1desc: 'ERP & CRM integration, process automation, data architecture.',
        e2title: 'Financial\nEngineering',
        e2desc: 'Investment advisory, capital structuring, financial modelling.',
        e3title: 'Energy &\nSustainability',
        e3desc: 'Renewable studies, efficiency audits, transition roadmaps.',
        e4title: 'Smart Industry\n& IoT',
        e4desc: 'Industrial IoT, control systems, intelligent manufacturing.',
        cta: 'Discuss Your Project',
      },
      methodology: {
        number: '05 — Methodology',
        line1: 'From Vision to Execution.',
        s1: 'Discover', s2: 'Analyze', s3: 'Design', s4: 'Implement', s5: 'Optimize',
      },
      why: {
        number: '06 — Why GET Consult',
        line1: 'A Multidisciplinary',
        line2: 'Approach.',
        body: 'Like the Ikigai, our value emerges where four disciplines intersect — engineering, finance, energy and digital. Together they turn complexity into coherent transformation.',
        center: 'Transformation',
        p1title: 'Engineering',
        p1desc: 'Industrial expertise, technical rigor, operational performance.',
        p2title: 'Finance',
        p2desc: 'Investment readiness, financial structuring, value creation.',
        p3title: 'Energy',
        p3desc: 'Sustainability, efficiency, renewable transition.',
        p4title: 'Digital',
        p4desc: 'Data intelligence, automation, smart systems.',
      },
      reach: {
        number: '08 — Regional Reach',
        line1: 'Grounded in Morocco.',
        line2: 'Active Across Africa.',
        body: 'From our base in Morocco, we deliver strategic consulting and engineering engagements across Africa — supporting industrial groups, investors and public institutions in seven markets.',
        m1label: 'Countries',
        m2label: 'Projects Delivered',
        m3value: 'Africa',
        m3label: 'Continent',
        countriesLabel: 'Countries We Operate In',
        mapLabel: 'Map of Africa highlighting Morocco, Côte d\'Ivoire, Senegal, Benin, Togo, Ghana and Mali.',
      },
      countryCodes: ['MA', 'CI', 'SN', 'BJ', 'TG', 'GH', 'ML'],
      countries: ['Morocco', 'Côte d\'Ivoire', 'Senegal', 'Benin', 'Togo', 'Ghana', 'Mali'],
      impact: {
        number: '09 — Impact',
        m1label: 'Years in Operation',
        m2label: 'Industry Sectors',
        m3label: 'Core Disciplines',
        w1: 'Performance.',
        w2: 'Innovation.',
        w3: 'Sustainability.',
        w4: 'Growth.',
      },
      contact: {
        line1: 'Simplifying Growth.',
        location: 'Fès · Casablanca · Morocco',
        label: 'Start a Conversation',
        response: 'We respond within 48 hours.',
        name: 'Name',
        company: 'Company',
        email: 'Email',
        message: 'Message',
        placeholder: 'Tell us about your project or inquiry.',
        submit: 'Send Inquiry',
        sending: 'Sending…',
        sent: 'Message sent',
        error: 'Could not send. Please email contact@get-consult.com directly.',
        calendly: 'Book a 20-Minute Call',
        whatsapp: 'Message on WhatsApp',
        or: 'Or reach us directly',
      },
      booking: {
        eyebrow: 'Quick call',
        title: 'Book a 20-Minute Call',
        subtitle: 'Pick a date and time. We will confirm your slot by email.',
        stepDate: 'Date',
        stepTime: 'Time',
        stepDetails: 'Details',
        timezoneNote: 'Times shown in Morocco (GMT+1). Weekdays only.',
        selectTime: 'Select a time for your 20-minute call.',
        noSlots: 'No times available this day. Please choose another date.',
        yourSlot: 'Your requested slot',
        minutes: 'min',
        timezoneLabel: 'Morocco time',
        name: 'Name',
        company: 'Company',
        email: 'Email',
        topic: 'Meeting topic',
        topicPlaceholder: 'e.g. Project feasibility, partnership',
        notes: 'Additional details',
        notesPlaceholder: 'Share context for the call (optional).',
        back: 'Back',
        next: 'Next',
        continue: 'Continue',
        submit: 'Send Request',
        sending: 'Sending…',
        sent: 'Request sent — we will confirm by email',
        error: 'Could not send. Please email contact@get-consult.com directly.',
        close: 'Close booking',
      },
      footer: { legal: '© GET Consult. All rights reserved.' },
    },
    fr: {
      meta: {
        title: 'GET Consult | Conseil Stratégique & Ingénierie — Maroc & Afrique',
        description: 'GET Consult accompagne groupes industriels, investisseurs et institutions en conseil stratégique, ingénierie, finance, énergie et transformation digitale au Maroc et en Afrique.',
        keywords: 'GET Consult, conseil stratégique, ingénierie, transformation digitale, énergie, Maroc, Afrique, Casablanca, Fès, conseil industriel',
        ogLocale: 'fr_FR',
      },
      nav: { about: 'À propos', expertise: 'Expertise', methodology: 'Méthodologie', contact: 'Contact', cta: 'Entamer un échange', menu: 'Menu', close: 'Fermer le menu' },
      theme: { toggle: 'Changer le thème de couleur' },
      hero: {
        label: 'Conseil Stratégique & Ingénierie',
        line1: 'Transformer l\'Industrie.',
        line2: 'Accélérer la Croissance.',
        value: 'Conseil stratégique à l\'intersection de l\'ingénierie, de la finance, de l\'énergie et du digital — pour les organisations prêtes à se transformer.',
        tags: 'Industriel · Digital · Énergie',
        ctaPrimary: 'Entamer un échange',
        ctaCalendly: 'Réserver un appel rapide',
      },
      sectors: ['Manufacturing', 'Énergie', 'Infrastructure', 'Investissement', 'Secteur Public'],
      about: {
        number: '01 — Qui sommes-nous',
        line1: 'Un partenaire de',
        line2: 'Transformation.',
        body: 'GET Consult accompagne les industries, organisations et investisseurs dans des projets de transformation stratégique — combinant ingénierie, finance, innovation digitale et durabilité en une pratique intégrée.',
        serve: 'Au service des groupes industriels, investisseurs et institutions publiques au Maroc et en MENA.',
        engagementsLabel: 'Engagements sélectionnés',
        e1sector: 'Industrie Manufacturière',
        e1desc: 'Audit opérationnel et optimisation de la performance sur les lignes de production.',
        e2sector: 'Énergie Renouvelable',
        e2desc: 'Étude de faisabilité et préparation à l\'investissement pour l\'infrastructure solaire.',
        e3sector: 'Infrastructure Publique',
        e3desc: 'Feuille de route de transformation digitale et intégration de systèmes intelligents.',
      },
      vision: {
        number: '02 — Vision',
        line1: "Construire l'Industrie",
        line2: 'de Demain.',
        body: 'Nous croyons que l\'avenir appartient aux organisations capables de combiner excellence opérationnelle, innovation technologique et croissance durable.',
      },
      mission: {
        number: '03 — Mission',
        line1: 'Transformer les Défis',
        line2: 'en Opportunités.',
        m1: 'Performance\nOpérationnelle',
        m2: 'Efficacité\nÉnergétique',
        m3: 'Transformation\nDigitale',
        m4: 'Préparation à\nl\'Investissement',
        m5: 'Croissance\nDurable',
      },
      expertise: {
        number: '04 — Expertise',
        line1: 'Quatre Disciplines.',
        line2: 'Une Pratique.',
        e1title: 'Transformation\nDigitale',
        e1desc: 'Intégration ERP & CRM, automatisation des processus, architecture de données.',
        e2title: 'Ingénierie\nFinancière',
        e2desc: 'Conseil en investissement, structuration de capital, modélisation financière.',
        e3title: 'Énergie &\nDurabilité',
        e3desc: 'Études renouvelables, audits d\'efficacité, feuilles de route de transition.',
        e4title: 'Industrie Intelligente\n& IoT',
        e4desc: 'IoT industriel, systèmes de contrôle, manufacturing intelligent.',
        cta: 'Discuter de votre projet',
      },
      methodology: {
        number: '05 — Méthodologie',
        line1: 'De la Vision à l\'Exécution.',
        s1: 'Découvrir', s2: 'Analyser', s3: 'Concevoir', s4: 'Implémenter', s5: 'Optimiser',
      },
      why: {
        number: '06 — Pourquoi GET Consult',
        line1: 'Une Approche',
        line2: 'Multidisciplinaire.',
        body: 'Comme l\'Ikigai, notre valeur émerge à l\'intersection de quatre disciplines — ingénierie, finance, énergie et digital. Ensemble, elles transforment la complexité en transformation cohérente.',
        center: 'Transformation',
        p1title: 'Ingénierie',
        p1desc: 'Expertise industrielle, rigueur technique, performance opérationnelle.',
        p2title: 'Finance',
        p2desc: 'Préparation à l\'investissement, structuration financière, création de valeur.',
        p3title: 'Énergie',
        p3desc: 'Durabilité, efficacité, transition renouvelable.',
        p4title: 'Digital',
        p4desc: 'Intelligence des données, automatisation, systèmes intelligents.',
      },
      reach: {
        number: '08 — Présence Régionale',
        line1: 'Ancrés au Maroc.',
        line2: 'Actifs à travers l\'Afrique.',
        body: 'Depuis notre base au Maroc, nous menons des missions de conseil stratégique et d\'ingénierie à travers l\'Afrique — au service des groupes industriels, investisseurs et institutions publiques dans sept marchés.',
        m1label: 'Pays',
        m2label: 'Projets Livrés',
        m3value: 'Afrique',
        m3label: 'Continent',
        countriesLabel: 'Pays d\'Intervention',
        mapLabel: 'Carte de l\'Afrique mettant en évidence le Maroc, la Côte d\'Ivoire, le Sénégal, le Bénin, le Togo, le Ghana et le Mali.',
      },
      countryCodes: ['MA', 'CI', 'SN', 'BJ', 'TG', 'GH', 'ML'],
      countries: ['Maroc', 'Côte d\'Ivoire', 'Sénégal', 'Bénin', 'Togo', 'Ghana', 'Mali'],
      impact: {
        number: '09 — Impact',
        m1label: 'Années d\'Activité',
        m2label: 'Secteurs Industriels',
        m3label: 'Disciplines Clés',
        w1: 'Performance.',
        w2: 'Innovation.',
        w3: 'Durabilité.',
        w4: 'Croissance.',
      },
      contact: {
        line1: 'Simplifier la Croissance.',
        location: 'Fès · Casablanca · Maroc',
        label: 'Entamer un échange',
        response: 'Nous répondons sous 48 heures.',
        name: 'Nom',
        company: 'Entreprise',
        email: 'E-mail',
        message: 'Message',
        placeholder: 'Parlez-nous de votre projet ou demande.',
        submit: 'Envoyer',
        sending: 'Envoi…',
        sent: 'Message envoyé',
        error: 'Échec de l\'envoi. Écrivez-nous à contact@get-consult.com.',
        calendly: 'Réserver un appel de 20 min',
        whatsapp: 'Écrire sur WhatsApp',
        or: 'Ou contactez-nous directement',
      },
      booking: {
        eyebrow: 'Appel rapide',
        title: 'Réserver un appel de 20 minutes',
        subtitle: 'Choisissez une date et une heure. Nous confirmerons votre créneau par e-mail.',
        stepDate: 'Date',
        stepTime: 'Heure',
        stepDetails: 'Détails',
        timezoneNote: 'Heures affichées au Maroc (GMT+1). Jours ouvrables uniquement.',
        selectTime: 'Choisissez l\'heure de votre appel de 20 minutes.',
        noSlots: 'Aucun créneau disponible ce jour. Choisissez une autre date.',
        yourSlot: 'Créneau demandé',
        minutes: 'min',
        timezoneLabel: 'Heure du Maroc',
        name: 'Nom',
        company: 'Entreprise',
        email: 'E-mail',
        topic: 'Sujet de l\'appel',
        topicPlaceholder: 'ex. Faisabilité projet, partenariat',
        notes: 'Détails complémentaires',
        notesPlaceholder: 'Contexte pour l\'appel (optionnel).',
        back: 'Retour',
        next: 'Suivant',
        continue: 'Continuer',
        submit: 'Envoyer la demande',
        sending: 'Envoi…',
        sent: 'Demande envoyée — confirmation par e-mail',
        error: 'Échec de l\'envoi. Écrivez-nous à contact@get-consult.com.',
        close: 'Fermer la réservation',
      },
      footer: { legal: '© GET Consult. Tous droits réservés.' },
    },
  };

  function nl2br(str) {
    return str.replace(/\n/g, '<br>');
  }

  function get(obj, path) {
    return path.split('.').reduce((o, k) => o?.[k], obj);
  }

  function applyLanguage(lang) {
    const dict = T[lang] || T.en;
    document.documentElement.lang = lang;
    document.title = dict.meta.title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = dict.meta.description;

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && dict.meta.keywords) metaKeywords.content = dict.meta.keywords;

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = dict.meta.title;

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = dict.meta.description;

    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale && dict.meta.ogLocale) ogLocale.content = dict.meta.ogLocale;

    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.content = dict.meta.title;

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.content = dict.meta.description;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      const val = get(dict, key);
      if (val != null) el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.dataset.i18nHtml;
      const val = get(dict, key);
      if (val != null) el.innerHTML = nl2br(val);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      const val = get(dict, key);
      if (val != null) el.placeholder = val;
    });

    const sectorsEl = document.getElementById('sectors-list');
    if (sectorsEl && dict.sectors) {
      sectorsEl.innerHTML = dict.sectors.map((s, i) => {
        const dot = i < dict.sectors.length - 1 ? '<span class="sectors-dot" aria-hidden="true"></span>' : '';
        return `<span>${s}</span>${dot}`;
      }).join('');
    }

    const countriesEl = document.getElementById('countries-list');
    if (countriesEl && dict.countries && dict.countryCodes) {
      countriesEl.innerHTML = dict.countries.map((c, i) => {
        const code = dict.countryCodes[i] || '';
        return `<li><button type="button" class="reach-legend-item" data-country="${code}">${c}</button></li>`;
      }).join('');
      window.dispatchEvent(new CustomEvent('get-countries-updated'));
    }

    document.querySelectorAll('.lang-toggle button').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
      btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false');
    });

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle && dict.theme?.toggle) {
      themeToggle.setAttribute('aria-label', dict.theme.toggle);
    }

    const menuClose = document.getElementById('menu-close');
    if (menuClose && dict.nav?.close) {
      menuClose.setAttribute('aria-label', dict.nav.close);
    }

    const bookingClose = document.querySelector('.booking-close');
    if (bookingClose && dict.booking?.close) {
      bookingClose.setAttribute('aria-label', dict.booking.close);
    }

    localStorage.setItem('get-lang', lang);
    window.GET_LANG = lang;
    window.dispatchEvent(new CustomEvent('get-lang-changed', { detail: { lang } }));
  }

  function initI18n() {
    const cfg = window.GET_CONFIG || {};
    const stored = localStorage.getItem('get-lang');
    const browserFr = navigator.language?.startsWith('fr');
    const lang = stored || (browserFr ? 'fr' : cfg.defaultLang || 'en');
    applyLanguage(lang in T ? lang : 'en');

    document.querySelectorAll('.lang-toggle button').forEach((btn) => {
      btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
    });
  }

  window.GET_I18N = { applyLanguage, initI18n, T };
})();
