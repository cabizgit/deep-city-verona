/* ============================================================
   DEEP CITY VERONA — JavaScript
   Tutte le funzionalità interattive del sito
   Vanilla JS, zero dipendenze esterne
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ========================================================
     1. NAVBAR — Sticky con cambio stile allo scroll
     ======================================================== */
  const navbar = document.getElementById('navbar');
  const heroSection = document.getElementById('hero');

  // Soglia: quando l'utente scorre oltre 80px, la navbar diventa opaca
  const onScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // stato iniziale

  /* ========================================================
     2. HAMBURGER MENU — Apertura/chiusura menu mobile
     ======================================================== */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    // Blocca lo scroll del body quando il menu è aperto
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Chiudi il menu quando si clicca su un link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ========================================================
     3. SMOOTH SCROLL — Scorrimento fluido per anchor link
     ======================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    });
  });

  /* ========================================================
     4. SCROLL REVEAL — Animazioni al comparire delle sezioni
     Usa Intersection Observer API (nessuna libreria esterna)
     ======================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // Anima solo una volta
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ========================================================
     5. CONTATORI NUMERICI — Animazione incremento numeri
     ======================================================== */
  const counterElements = document.querySelectorAll('.numeri__value');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;
    countersAnimated = true;

    counterElements.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      const duration = 2000; // Durata in ms
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing: ease-out cubico per un effetto naturale
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * easeOut);

        counter.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  // Osserva la sezione numeri per triggerare l'animazione
  const numeriSection = document.getElementById('numeri');
  if (numeriSection) {
    const numeriObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          numeriObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    numeriObserver.observe(numeriSection);
  }

  /* ========================================================
     6. FILTRO ESPERIENZE — Filtraggio cards per categoria
     ======================================================== */
  const filterButtons = document.querySelectorAll('.filtro');
  const expCards = document.querySelectorAll('.exp-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Aggiorna stato attivo dei bottoni
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;

      // Filtra le cards con transizione
      expCards.forEach(card => {
        if (filter === 'tutti' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.classList.add('hidden');
          card.style.animation = '';
        }
      });
    });
  });

  /* ========================================================
     7. LIGHTBOX GALLERIA — Visualizzatore immagini a schermo intero
     ======================================================== */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox__img');
  const lightboxCaption = lightbox.querySelector('.lightbox__caption');
  const lightboxClose = lightbox.querySelector('.lightbox__close');
  const lightboxPrev = lightbox.querySelector('.lightbox__prev');
  const lightboxNext = lightbox.querySelector('.lightbox__next');
  const galleryItems = document.querySelectorAll('.galleria__item');
  let currentImageIndex = 0;

  // Costruisci array di immagini dalla galleria
  const galleryImages = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src,
    alt: item.querySelector('img').alt,
    caption: item.dataset.caption || ''
  }));

  // Apri lightbox al click su un'immagine della galleria
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentImageIndex = index;
      openLightbox();
    });
  });

  const openLightbox = () => {
    const img = galleryImages[currentImageIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.caption;
    lightbox.hidden = false;
    // Forza reflow per attivare la transizione
    requestAnimationFrame(() => {
      lightbox.classList.add('active');
    });
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    setTimeout(() => {
      lightbox.hidden = true;
    }, 300);
    document.body.style.overflow = '';
  };

  const showPrevImage = () => {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
  };

  const showNextImage = () => {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxImage();
  };

  const updateLightboxImage = () => {
    const img = galleryImages[currentImageIndex];
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = img.caption;
      lightboxImg.style.opacity = '1';
    }, 200);
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrevImage);
  lightboxNext.addEventListener('click', showNextImage);

  // Chiudi con tasto Escape, naviga con frecce
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'ArrowRight') showNextImage();
  });

  // Chiudi cliccando fuori dall'immagine
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  /* ========================================================
     8. VALIDAZIONE FORM — Controllo lato client
     ======================================================== */
  const form = document.getElementById('bookingForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Reset errori precedenti
      form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      form.querySelectorAll('.form__error').forEach(el => el.textContent = '');

      let isValid = true;

      // Validazione nome
      const nome = form.querySelector('#formNome');
      if (!nome.value.trim()) {
        showFieldError(nome, 'Inserisci il tuo nome');
        isValid = false;
      }

      // Validazione email
      const email = form.querySelector('#formEmail');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim()) {
        showFieldError(email, 'Inserisci la tua email');
        isValid = false;
      } else if (!emailRegex.test(email.value)) {
        showFieldError(email, 'Inserisci un\'email valida');
        isValid = false;
      }

      // Validazione esperienza
      const esperienza = form.querySelector('#formEsperienza');
      if (!esperienza.value) {
        showFieldError(esperienza, 'Seleziona un\'esperienza');
        isValid = false;
      }

      // Validazione data
      const data = form.querySelector('#formData');
      if (!data.value) {
        showFieldError(data, 'Seleziona una data');
        isValid = false;
      } else {
        // Controlla che la data sia nel futuro
        const selectedDate = new Date(data.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          showFieldError(data, 'Seleziona una data futura');
          isValid = false;
        }
      }

      // Validazione numero persone
      const persone = form.querySelector('#formPersone');
      if (!persone.value || persone.value < 1) {
        showFieldError(persone, 'Inserisci il numero di persone');
        isValid = false;
      } else if (persone.value > 20) {
        showFieldError(persone, 'Massimo 20 persone');
        isValid = false;
      }

      // Se tutto è valido, invia tramite mailto
      if (isValid) {
        const nomeVal = nome.value.trim();
        const emailVal = email.value.trim();
        const telefonoVal = form.querySelector('#formTelefono').value.trim();
        const esperienzaVal = esperienza.options[esperienza.selectedIndex].text;
        const dataVal = data.value;
        const personeVal = persone.value;
        const noteVal = form.querySelector('#formNote').value.trim();

        // Costruisci il corpo dell'email con tutte le specifiche
        const subject = encodeURIComponent('Nuova prenotazione Deep City Verona — ' + esperienzaVal);
        const body = encodeURIComponent(
          'NUOVA RICHIESTA DI PRENOTAZIONE\n' +
          '================================\n\n' +
          'Nome: ' + nomeVal + '\n' +
          'Email: ' + emailVal + '\n' +
          'Telefono: ' + (telefonoVal || 'Non specificato') + '\n' +
          'Esperienza: ' + esperienzaVal + '\n' +
          'Data preferita: ' + dataVal + '\n' +
          'Numero persone: ' + personeVal + '\n' +
          'Note speciali: ' + (noteVal || 'Nessuna') + '\n\n' +
          '================================\n' +
          'Inviato dal sito Deep City Verona'
        );

        window.location.href = 'mailto:cabiancapietro06@gmail.com?subject=' + subject + '&body=' + body;

        // Mostra conferma dopo un breve ritardo
        setTimeout(() => {
          form.style.opacity = '0';
          form.style.transform = 'translateY(-10px)';
          setTimeout(() => {
            form.style.display = 'none';
            formSuccess.hidden = false;
            formSuccess.style.animation = 'fadeInUp 0.6s ease forwards';
          }, 300);
        }, 500);
      }
    });

    // Rimuovi errore in tempo reale quando l'utente corregge
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('error');
        const errorSpan = field.parentElement.querySelector('.form__error');
        if (errorSpan) errorSpan.textContent = '';
      });
    });
  }

  // Funzione helper per mostrare errori sui campi
  const showFieldError = (field, message) => {
    field.classList.add('error');
    const errorSpan = field.parentElement.querySelector('.form__error');
    if (errorSpan) errorSpan.textContent = message;
  };

  /* ========================================================
     9. TOGGLE DARK/LIGHT MODE
     ======================================================== */
  const btnTheme = document.getElementById('btnTheme');

  // Controlla preferenza salvata o di sistema
  const getPreferredTheme = () => {
    const saved = localStorage.getItem('dcv-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('dcv-theme', theme);
  };

  // Applica tema iniziale
  applyTheme(getPreferredTheme());

  btnTheme.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');
    applyTheme(isDark ? 'light' : 'dark');
  });

  /* ========================================================
     10. TOGGLE LINGUA IT/EN
     ======================================================== */
  const btnLang = document.getElementById('btnLang');
  const langLabel = document.getElementById('langLabel');
  let currentLang = localStorage.getItem('dcv-lang') || 'it';

  // Dizionario traduzioni (navbar, hero e sezioni principali)
  const translations = {
    en: {
      // Navbar
      nav_esperienze: 'Experiences',
      nav_chi_siamo: 'About Us',
      nav_bespoke: 'Bespoke',
      nav_galleria: 'Gallery',
      nav_contatto: 'Book Now',

      // Hero
      hero_pretitle: 'Deep City Verona presents',
      hero_title_1: 'Verona',
      hero_title_2: 'Deep City',
      hero_subtitle: 'Experiences that bite.',
      hero_cta_1: 'Discover Experiences',
      hero_cta_2: 'Request Your Experience',

      // Numeri
      num_clienti: 'Satisfied clients',
      num_esperienze: 'Unique experiences',
      num_anni: 'Years of passion',
      num_rating: 'Clients recommend us',

      // Esperienze
      exp_label: 'Our offerings',
      exp_title: 'Experiences',
      exp_desc: 'Each experience is a journey into the secrets of Verona. Choose the one that resonates with your soul.',
      filter_all: 'All',
      filter_romantic: 'Romantic',
      filter_historic: 'Historic',
      filter_gastro: 'Gastronomic',
      filter_vip: 'VIP Exclusive',

      // Chi Siamo
      about_label: 'Our story',
      about_title: 'About Us',
      about_lead: 'We are not tour guides. We are Veronese who turned our obsession with this city into a craft.',
      about_p1: 'Deep City Verona was born from the idea that Verona deserves to be discovered as a whispered secret, not shouted through a megaphone. Every experience we create is designed as a story: with a beginning, a tension, a climax, and a memory that never fades.',
      about_p2: 'Our guides are historians, sommeliers, chefs, and artists — all born and raised within these walls. They know the alleys Shakespeare never reached, the cellars where silence tastes like Amarone, the rooftops where sunsets become private.',
      val_1_title: 'Authenticity',
      val_1_desc: 'Only real experiences, never touristy.',
      val_2_title: 'Exclusivity',
      val_2_desc: 'Small groups, big emotions.',
      val_3_title: 'Attention to detail',
      val_3_desc: 'Every minute is designed for you.',

      // Bespoke
      bespoke_label: 'Tailor-made',
      bespoke_title: 'Your Verona, as no one has ever lived it.',
      bespoke_text: 'Have an impossible idea? An anniversary to make unforgettable? A marriage proposal that must be perfect? Tell us your dream. We\'ll transform it into an experience that exists only for you, in a city that seems made for dreams.',
      bespoke_tagline: 'No catalogue. No compromise. Only your desire, fulfilled.',
      bespoke_cta: 'Create your experience',

      // Recensioni
      rev_label: 'Traveler voices',
      rev_title: 'What they say',

      // Galleria
      gal_label: 'Fragments of Verona',
      gal_title: 'Gallery',

      // Contatto
      contact_label: 'Begin the journey',
      contact_title: 'Book your experience',
      contact_desc: 'Fill in the form and you\'ll receive a personal response within 24 hours. Or write us directly on WhatsApp for an immediate reply.',
      form_name: 'Full name *',
      form_email: 'Email *',
      form_phone: 'Phone (optional)',
      form_experience: 'Experience of interest *',
      form_select_default: 'Select an experience',
      form_select_bespoke: 'Custom Experience',
      form_date: 'Preferred date *',
      form_people: 'Number of people *',
      form_notes: 'Special notes',
      form_submit: 'Send Request',
      form_success_title: 'Request sent!',
      form_success_desc: 'Thank you for contacting us. You\'ll receive a personal response within 24 hours. The adventure is about to begin.',

      // FAQ
      faq_label: 'Have questions?',
      faq_title: 'Frequently Asked Questions',
      faq_q1: 'In which languages are the experiences available?',
      faq_a1: 'Our experiences are available in Italian, English, French, German, and Spanish. For other languages, contact us and we\'ll do our best.',
      faq_q2: 'How do I book an experience?',
      faq_a2: 'You can book by filling out the contact form on this website, writing us on WhatsApp, or sending an email to info@deepcityverona.it. You\'ll receive confirmation within 24 hours.',
      faq_q3: 'What is the cancellation policy?',
      faq_a3: 'Free cancellation up to 48 hours before the experience. Between 48 and 24 hours, 50% is retained. Less than 24 hours: no refund. In case of bad weather, we reschedule for free.',
      faq_q4: 'What is the minimum number of participants?',
      faq_a4: 'Most of our experiences start from 2 people. For private experiences or solo travelers, contact us for a personalized quote.',
      faq_q5: 'Are the experiences available all year round?',
      faq_a5: 'Yes, we operate year-round. Some seasonal experiences (like "Arena at Sunset") have limited availability in winter months. We recommend booking at least one week in advance.',
      faq_q6: 'Can I customize an existing experience?',
      faq_a6: 'Absolutely. Every experience can be adapted to your needs: duration, stops, dietary requirements, accessibility. Just indicate it in the notes when booking or choose the "Bespoke" option.'
    },
    it: {
      // Valori di default — riportati qui per poter switchare avanti e indietro
      nav_esperienze: 'Esperienze',
      nav_chi_siamo: 'Chi Siamo',
      nav_bespoke: 'Bespoke',
      nav_galleria: 'Galleria',
      nav_contatto: 'Prenota',

      hero_pretitle: 'Deep City Verona presenta',
      hero_title_1: 'Verona',
      hero_title_2: 'Deep City',
      hero_subtitle: 'Esperienze che lasciano il segno.',
      hero_cta_1: 'Scopri le Esperienze',
      hero_cta_2: 'Richiedi la tua Esperienza',

      num_clienti: 'Clienti soddisfatti',
      num_esperienze: 'Esperienze uniche',
      num_anni: 'Anni di passione',
      num_rating: 'Clienti ci raccomandano',

      exp_label: 'Le nostre proposte',
      exp_title: 'Esperienze',
      exp_desc: 'Ogni esperienza è un viaggio nei segreti di Verona. Scegli quella che risuona con la tua anima.',
      filter_all: 'Tutti',
      filter_romantic: 'Romantico',
      filter_historic: 'Storico',
      filter_gastro: 'Gastronomico',
      filter_vip: 'Esclusivo VIP',

      about_label: 'La nostra storia',
      about_title: 'Chi Siamo',
      about_lead: 'Non siamo guide turistiche. Siamo veronesi che hanno trasformato la propria ossessione per questa città in un mestiere.',
      about_p1: 'Deep City Verona nasce dall\'idea che Verona meriti di essere scoperta come un segreto sussurrato, non urlato da un megafono. Ogni nostra esperienza è progettata come un racconto: ha un inizio, una tensione, un culmine e un ricordo che non si cancella.',
      about_p2: 'Le nostre guide sono storici, sommelier, chef e artisti — tutti nati e cresciuti tra queste mura. Conoscono i vicoli dove Shakespeare non è mai arrivato, le cantine dove il silenzio ha il sapore dell\'Amarone, i tetti dove il tramonto diventa privato.',
      val_1_title: 'Autenticità',
      val_1_desc: 'Solo esperienze vere, mai turistiche.',
      val_2_title: 'Esclusività',
      val_2_desc: 'Piccoli gruppi, grandi emozioni.',
      val_3_title: 'Cura del dettaglio',
      val_3_desc: 'Ogni minuto è pensato per te.',

      bespoke_label: 'Su misura',
      bespoke_title: 'La tua Verona, come nessun altro l\'ha mai vissuta.',
      bespoke_text: 'Hai un\'idea impossibile? Un anniversario da rendere indimenticabile? Una proposta di matrimonio che deve essere perfetta? Raccontaci il tuo sogno. Noi lo trasformeremo in un\'esperienza che esiste solo per te, in una città che sembra fatta apposta per i sogni.',
      bespoke_tagline: 'Nessun catalogo. Nessun compromesso. Solo il tuo desiderio, realizzato.',
      bespoke_cta: 'Crea la tua esperienza',

      rev_label: 'Voci dei viaggiatori',
      rev_title: 'Dicono di noi',

      gal_label: 'Frammenti di Verona',
      gal_title: 'Galleria',

      contact_label: 'Inizia il viaggio',
      contact_title: 'Prenota la tua esperienza',
      contact_desc: 'Compila il modulo e riceverai una risposta personale entro 24 ore. Oppure scrivici direttamente su WhatsApp per una risposta immediata.',
      form_name: 'Nome completo *',
      form_email: 'Email *',
      form_phone: 'Telefono (opzionale)',
      form_experience: 'Esperienza di interesse *',
      form_select_default: 'Seleziona un\'esperienza',
      form_select_bespoke: 'Esperienza Personalizzata',
      form_date: 'Data preferita *',
      form_people: 'Numero persone *',
      form_notes: 'Note speciali',
      form_submit: 'Invia Richiesta',
      form_success_title: 'Richiesta inviata!',
      form_success_desc: 'Grazie per averci contattato. Riceverai una risposta personale entro 24 ore. L\'avventura sta per iniziare.',

      faq_label: 'Hai domande?',
      faq_title: 'Domande Frequenti',
      faq_q1: 'In quali lingue sono disponibili le esperienze?',
      faq_a1: 'Le nostre esperienze sono disponibili in italiano, inglese, francese, tedesco e spagnolo. Per altre lingue, contattateci e faremo il possibile per accontentarvi.',
      faq_q2: 'Come posso prenotare un\'esperienza?',
      faq_a2: 'Puoi prenotare compilando il modulo di contatto su questo sito, scrivendoci su WhatsApp o inviando un\'email a info@deepcityverona.it. Riceverai conferma entro 24 ore.',
      faq_q3: 'Qual è la politica di cancellazione?',
      faq_a3: 'Cancellazione gratuita fino a 48 ore prima dell\'esperienza. Tra 48 e 24 ore, viene trattenuto il 50%. Meno di 24 ore: nessun rimborso. In caso di maltempo, riprogrammiamo gratuitamente.',
      faq_q4: 'Qual è il numero minimo di partecipanti?',
      faq_a4: 'La maggior parte delle nostre esperienze parte da 2 persone. Per esperienze private o per singoli viaggiatori, contattateci per un preventivo personalizzato.',
      faq_q5: 'Le esperienze sono disponibili tutto l\'anno?',
      faq_a5: 'Sì, operiamo tutto l\'anno. Alcune esperienze stagionali (come "Arena al Tramonto") hanno disponibilità limitata nei mesi invernali. Consigliamo di prenotare con almeno una settimana di anticipo.',
      faq_q6: 'Posso personalizzare un\'esperienza esistente?',
      faq_a6: 'Assolutamente. Ogni esperienza può essere adattata alle vostre esigenze: durata, tappe, esigenze alimentari, accessibilità. Basta indicarlo nelle note al momento della prenotazione o scegliere l\'opzione "Bespoke".'
    }
  };

  // Applica la lingua corrente
  const applyLanguage = (lang) => {
    currentLang = lang;
    const dict = translations[lang];
    if (!dict) return;

    // Aggiorna tutti gli elementi con attributo data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    // Aggiorna label del bottone (mostra la lingua alternativa)
    langLabel.textContent = lang === 'it' ? 'EN' : 'IT';
    document.documentElement.lang = lang;
    localStorage.setItem('dcv-lang', lang);
  };

  // Applica lingua salvata
  applyLanguage(currentLang);

  btnLang.addEventListener('click', () => {
    applyLanguage(currentLang === 'it' ? 'en' : 'it');
  });

  /* ========================================================
     11. ACTIVE NAV LINK — Evidenzia link attivo allo scroll
     ======================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.navbar__links a');

  const updateActiveNav = () => {
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinksAll.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });

});
