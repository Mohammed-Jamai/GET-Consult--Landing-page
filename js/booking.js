(function () {
  const siteCfg = window.GET_CONFIG || {};
  const bookingCfg = siteCfg.booking || {};

  const SLOT_MINUTES = bookingCfg.slotMinutes || 20;
  const TIMEZONE = bookingCfg.timezone || 'Africa/Casablanca';
  const WORK_DAYS = bookingCfg.workDays || [1, 2, 3, 4, 5];
  const WORK_START = bookingCfg.workStart ?? 9;
  const WORK_END = bookingCfg.workEnd ?? 17;
  const ADVANCE_DAYS = bookingCfg.advanceDays || 21;
  const MIN_NOTICE_HOURS = bookingCfg.minNoticeHours ?? 24;

  const dialog = document.getElementById('booking-dialog');
  if (!dialog) return;

  const backdrop = dialog.querySelector('.booking-backdrop');
  const closeBtn = dialog.querySelector('.booking-close');
  const stepLabel = dialog.querySelector('.booking-step-label');
  const stepDate = document.getElementById('booking-step-date');
  const stepTime = document.getElementById('booking-step-time');
  const stepDetails = document.getElementById('booking-step-details');
  const calendarGrid = document.getElementById('booking-calendar-grid');
  const calendarMonth = document.getElementById('booking-calendar-month');
  const calendarPrev = document.getElementById('booking-calendar-prev');
  const calendarNext = document.getElementById('booking-calendar-next');
  const timeSlotsEl = document.getElementById('booking-time-slots');
  const selectedSummary = document.getElementById('booking-selected-summary');
  const bookingForm = document.getElementById('booking-form');
  const backBtn = document.getElementById('booking-back');
  const nextBtn = document.getElementById('booking-next');

  const state = {
    step: 1,
    viewMonth: startOfMonth(new Date()),
    selectedDate: null,
    selectedTime: null,
  };

  function t(key) {
    const lang = window.GET_LANG || siteCfg.defaultLang || 'en';
    return window.GET_I18N?.T[lang]?.booking?.[key] || '';
  }

  function locale() {
    return (window.GET_LANG || 'en') === 'fr' ? 'fr-FR' : 'en-US';
  }

  function zonedParts(date, tz) {
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      weekday: 'short',
    });
    const parts = {};
    fmt.formatToParts(date).forEach((p) => {
      if (p.type !== 'literal') parts[p.type] = p.value;
    });
    return parts;
  }

  function dateKey(y, m, d) {
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  function todayKey() {
    const p = zonedParts(new Date(), TIMEZONE);
    return dateKey(p.year, p.month, p.day);
  }

  function maxDateKey() {
    const now = new Date();
    const end = new Date(now.getTime() + ADVANCE_DAYS * 86400000);
    const p = zonedParts(end, TIMEZONE);
    return dateKey(p.year, p.month, p.day);
  }

  function parseDateKey(key) {
    const [y, m, d] = key.split('-').map(Number);
    return { year: y, month: m, day: d };
  }

  function startOfMonth(date) {
    const p = zonedParts(date, TIMEZONE);
    return new Date(Date.UTC(Number(p.year), Number(p.month) - 1, 1));
  }

  function dayOfWeekFromKey(key) {
    const { year, month, day } = parseDateKey(key);
    return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  }

  function isBookableDate(key) {
    if (key < todayKey() || key > maxDateKey()) return false;
    const dow = dayOfWeekFromKey(key);
    return WORK_DAYS.includes(dow);
  }

  function formatDisplayDate(key) {
    const { year, month, day } = parseDateKey(key);
    const dt = new Date(Date.UTC(year, month - 1, day, 12));
    return new Intl.DateTimeFormat(locale(), {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(dt);
  }

  function formatDisplayTime(time) {
    const [h, m] = time.split(':').map(Number);
    const dt = new Date(Date.UTC(2000, 0, 1, h, m));
    return new Intl.DateTimeFormat(locale(), {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    }).format(dt);
  }

  function moroccoNowMinutes() {
    const p = zonedParts(new Date(), TIMEZONE);
    return Number(p.hour) * 60 + Number(p.minute);
  }

  function getSlotsForDate(key) {
    const slots = [];
    for (let h = WORK_START; h < WORK_END; h++) {
      for (let m = 0; m < 60; m += SLOT_MINUTES) {
        const endMin = h * 60 + m + SLOT_MINUTES;
        if (endMin > WORK_END * 60) break;
        const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        if (key === todayKey()) {
          const slotStart = h * 60 + m;
          const minAllowed = moroccoNowMinutes() + MIN_NOTICE_HOURS * 60;
          if (slotStart < minAllowed) continue;
        }
        slots.push(time);
      }
    }
    return slots;
  }

  function setStep(step) {
    state.step = step;
    stepDate.hidden = step !== 1;
    stepTime.hidden = step !== 2;
    stepDetails.hidden = step !== 3;
    stepDate.classList.toggle('is-active', step === 1);
    stepTime.classList.toggle('is-active', step === 2);
    stepDetails.classList.toggle('is-active', step === 3);
    if (stepLabel) stepLabel.textContent = `${step} / 3`;
    if (backBtn) backBtn.hidden = step === 1;
    if (nextBtn) {
      nextBtn.hidden = step === 3;
      nextBtn.disabled = (step === 1 && !state.selectedDate) || (step === 2 && !state.selectedTime);
      nextBtn.textContent = step === 2 ? (t('continue') || 'Continue') : (t('next') || 'Next');
    }
    if (step === 2) renderTimeSlots();
    if (step === 3) updateSummary();
  }

  function renderCalendar() {
    const view = state.viewMonth;
    const p = zonedParts(view, TIMEZONE);
    const year = Number(p.year);
    const month = Number(p.month);

    if (calendarMonth) {
      calendarMonth.textContent = new Intl.DateTimeFormat(locale(), {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(Date.UTC(year, month - 1, 1)));
    }

    if (!calendarGrid) return;
    calendarGrid.innerHTML = '';

    const weekdays = (window.GET_LANG === 'fr')
      ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    weekdays.forEach((wd) => {
      const head = document.createElement('div');
      head.className = 'booking-cal-weekday';
      head.textContent = wd;
      calendarGrid.appendChild(head);
    });

    const firstDow = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
    const offset = firstDow === 0 ? 6 : firstDow - 1;
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

    for (let i = 0; i < offset; i++) {
      const pad = document.createElement('div');
      pad.className = 'booking-cal-day is-empty';
      calendarGrid.appendChild(pad);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const key = dateKey(year, month, day);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'booking-cal-day';
      btn.textContent = String(day);
      btn.dataset.date = key;

      const bookable = isBookableDate(key);
      if (!bookable) btn.classList.add('is-disabled');
      if (state.selectedDate === key) btn.classList.add('is-selected');
      if (key === todayKey()) btn.classList.add('is-today');

      if (bookable) {
        btn.addEventListener('click', () => {
          state.selectedDate = key;
          state.selectedTime = null;
          renderCalendar();
          if (nextBtn) nextBtn.disabled = false;
        });
      } else {
        btn.disabled = true;
      }

      calendarGrid.appendChild(btn);
    }
  }

  function renderTimeSlots() {
    if (!timeSlotsEl || !state.selectedDate) return;
    timeSlotsEl.innerHTML = '';
    const slots = getSlotsForDate(state.selectedDate);

    if (!slots.length) {
      const empty = document.createElement('p');
      empty.className = 'booking-time-empty';
      empty.textContent = t('noSlots') || 'No times available this day. Please choose another date.';
      timeSlotsEl.appendChild(empty);
      return;
    }

    slots.forEach((time) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'booking-time-slot';
      if (state.selectedTime === time) btn.classList.add('is-selected');
      btn.textContent = formatDisplayTime(time);
      btn.dataset.time = time;
      btn.addEventListener('click', () => {
        state.selectedTime = time;
        renderTimeSlots();
        if (nextBtn) nextBtn.disabled = false;
      });
      timeSlotsEl.appendChild(btn);
    });
  }

  function updateSummary() {
    if (!selectedSummary || !state.selectedDate || !state.selectedTime) return;
    selectedSummary.innerHTML = `
      <span class="booking-summary-label">${t('yourSlot') || 'Your requested slot'}</span>
      <strong>${formatDisplayDate(state.selectedDate)}</strong>
      <span>${formatDisplayTime(state.selectedTime)} · ${SLOT_MINUTES} ${t('minutes') || 'min'} · ${t('timezoneLabel') || TIMEZONE}</span>
    `;
  }

  function openDialog() {
    state.step = 1;
    state.selectedDate = null;
    state.selectedTime = null;
    state.viewMonth = startOfMonth(new Date());
    bookingForm?.reset();
    dialog.hidden = false;
    document.body.classList.add('booking-open');
    setStep(1);
    renderCalendar();
    closeBtn?.focus();
  }

  function closeDialog() {
    dialog.hidden = true;
    document.body.classList.remove('booking-open');
  }

  async function sendBooking(payload) {
    const api = bookingCfg.api || '/api/booking.php';
    try {
      const res = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) return true;
    } catch (_) { /* fallback */ }

    if (siteCfg.formspree) {
      const res = await fetch(`https://formspree.io/f/${siteCfg.formspree}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...payload,
          _subject: `GET Consult — Call Request: ${payload.date} ${payload.time}`,
        }),
      });
      if (res.ok) return true;
    }

    const to = siteCfg.email || 'contact@get-consult.com';
    const message = [
      `Date: ${payload.date}`,
      `Time: ${payload.time}`,
      `Duration: ${payload.duration} minutes`,
      `Timezone: ${payload.timezone}`,
      payload.topic ? `Topic: ${payload.topic}` : '',
      '',
      payload.notes || '',
    ].filter(Boolean).join('\n');

    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        company: payload.company,
        message,
        _subject: `GET Consult — Call Request: ${payload.date} at ${payload.time}`,
        _template: 'table',
        _captcha: 'false',
      }),
    });
    return res.ok;
  }

  ['hero-calendly', 'contact-calendly'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.removeAttribute('target');
    el.removeAttribute('rel');
    el.href = '#';
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openDialog();
    });
  });

  backdrop?.addEventListener('click', closeDialog);
  closeBtn?.addEventListener('click', closeDialog);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !dialog.hidden) closeDialog();
  });

  calendarPrev?.addEventListener('click', () => {
    const p = zonedParts(state.viewMonth, TIMEZONE);
    state.viewMonth = new Date(Date.UTC(Number(p.year), Number(p.month) - 2, 1));
    renderCalendar();
  });

  calendarNext?.addEventListener('click', () => {
    const p = zonedParts(state.viewMonth, TIMEZONE);
    state.viewMonth = new Date(Date.UTC(Number(p.year), Number(p.month), 1));
    renderCalendar();
  });

  backBtn?.addEventListener('click', () => {
    if (state.step > 1) setStep(state.step - 1);
  });

  nextBtn?.addEventListener('click', () => {
    if (state.step === 1 && state.selectedDate) setStep(2);
    else if (state.step === 2 && state.selectedTime) setStep(3);
  });

  bookingForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!state.selectedDate || !state.selectedTime) return;

    const submitBtn = bookingForm.querySelector('.booking-submit');
    const defaultLabel = t('submit') || 'Send Request';
    const name = document.getElementById('booking-name')?.value.trim();
    const company = document.getElementById('booking-company')?.value.trim();
    const email = document.getElementById('booking-email')?.value.trim();
    const topic = document.getElementById('booking-topic')?.value.trim();
    const notes = document.getElementById('booking-notes')?.value.trim();

    if (!name || !email) return;

    submitBtn.disabled = true;
    submitBtn.textContent = t('sending') || 'Sending…';

    const payload = {
      name,
      company,
      email,
      topic,
      notes,
      date: state.selectedDate,
      time: state.selectedTime,
      timezone: TIMEZONE,
      duration: SLOT_MINUTES,
    };

    try {
      const ok = await sendBooking(payload);
      if (ok) {
        submitBtn.textContent = t('sent') || 'Request sent';
        setTimeout(() => {
          closeDialog();
          submitBtn.textContent = defaultLabel;
          submitBtn.disabled = false;
        }, 2200);
        return;
      }
    } catch (_) { /* error state */ }

    submitBtn.textContent = t('error') || 'Could not send';
    setTimeout(() => {
      submitBtn.textContent = defaultLabel;
      submitBtn.disabled = false;
    }, 4000);
  });

  window.addEventListener('get-lang-changed', () => {
    if (!dialog.hidden) {
      renderCalendar();
      if (state.step >= 2) renderTimeSlots();
      if (state.step === 3) updateSummary();
      if (nextBtn && state.step < 3) {
        nextBtn.textContent = state.step === 2 ? (t('continue') || 'Continue') : (t('next') || 'Next');
      }
    }
  });

  setStep(1);
})();
