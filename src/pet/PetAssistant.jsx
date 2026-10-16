import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PetScene from './PetScene.jsx';
import { fetchPetProgress, recordPetEvent as savePetEvent, sendPetChat } from './api.js';

const POSITION_KEY = 'mindsprint-companion-position';
const PET_ID_KEY = 'mindsprint-companion-id';
const TTS_KEY = 'mindsprint-companion-tts';
const DEFAULT_PROGRESS = { level: 1, xp: 0, affection: 0, mood: 'neutral', interactionCount: 0, saved: false };
const MOOD_LABEL = { neutral: 'Bình yên', happy: 'Vui vẻ', sad: 'Cần được vỗ về' };
const ACTIONS = [
  { id: 'wave', label: 'Vẫy tay', icon: '✧' },
  { id: 'jump', label: 'Nhảy lên', icon: '↟' },
  { id: 'happy', label: 'Vui vẻ', icon: '☺' },
  { id: 'sad', label: 'Buồn', icon: '☁' },
];

function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
    const random = Math.random() * 16 | 0;
    return (char === 'x' ? random : (random & 0x3) | 0x8).toString(16);
  });
}

function getPetId() {
  try {
    const existing = localStorage.getItem(PET_ID_KEY);
    if (existing) return existing;
    const id = createId();
    localStorage.setItem(PET_ID_KEY, id);
    return id;
  } catch {
    return createId();
  }
}

function clampPosition(x, y) {
  const width = 104;
  const height = 128;
  const dockSafe = window.innerWidth <= 760 ? 88 : 8;
  const maxY = Math.max(72, window.innerHeight - height - dockSafe);
  return {
    x: Math.max(8, Math.min(Number(x) || 0, Math.max(8, window.innerWidth - width - 8))),
    y: Math.max(72, Math.min(Number(y) || 0, maxY)),
  };
}

function loadPosition() {
  const dockSafe = window.innerWidth <= 760 ? 88 : 8;
  const fallback = { x: Math.max(8, window.innerWidth - 122), y: Math.max(76, window.innerHeight - 128 - dockSafe) };
  try {
    const saved = JSON.parse(localStorage.getItem(POSITION_KEY) || 'null');
    if (Number.isFinite(saved?.x) && Number.isFinite(saved?.y)) return clampPosition(saved.x, saved.y);
  } catch { /* use a safe default */ }
  return clampPosition(fallback.x, fallback.y);
}

function Icon({ name, size = 17 }) {
  const paths = {
    close: <path d="m6 6 12 12M18 6 6 18" />,
    send: <path d="m4 12 16-8-5 16-3-7-8-1Zm8 1 4-5" />,
    speaker: <><path d="M4 10v4h4l5 4V6l-5 4H4Z" /><path d="M16 9a4 4 0 0 1 0 6m2-9a8 8 0 0 1 0 12" /></>,
    speakerOff: <><path d="M4 10v4h4l5 4V6l-5 4H4Z" /><path d="m17 9 5 6m0-6-5 6" /></>,
    heart: <path d="M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8a4.4 4.4 0 0 1 8.8-1.3 4.4 4.4 0 0 1 8.8 1.3Z" />,
    retry: <><path d="M20 7v5h-5" /><path d="M19 12a7 7 0 1 0 1.2 4" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function PetAssistant() {
  const petId = useMemo(getPetId, []);
  const widgetRef = useRef(null);
  const dragRef = useRef(null);
  const suppressWidgetClick = useRef(false);
  const animationTimer = useRef(null);
  const messageEndRef = useRef(null);
  const lastPetEvent = useRef(0);
  const retryRef = useRef(null);
  const speechToken = useRef(0);
  const positionRef = useRef(null);
  const [position, setPosition] = useState(loadPosition);
  const [isOpen, setIsOpen] = useState(false);
  const [isRoaming, setIsRoaming] = useState(false);
  const [walkDuration, setWalkDuration] = useState(4200);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false);
  const [animation, setAnimation] = useState('idle');
  const [target, setTarget] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(() => {
    try { return localStorage.getItem(TTS_KEY) !== 'off'; } catch { return true; }
  });
  const [ttsSupported, setTtsSupported] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window);
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [progressStatus, setProgressStatus] = useState('loading');
  const [mood, setMood] = useState('neutral');
  const [toast, setToast] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [chatError, setChatError] = useState('');
  const [requestNotice, setRequestNotice] = useState('');

  positionRef.current = position;

  const updatePosition = useCallback((x, y, persist = false) => {
    const next = clampPosition(x, y);
    positionRef.current = next;
    setPosition(next);
    if (persist) {
      try { localStorage.setItem(POSITION_KEY, JSON.stringify(next)); } catch { /* storage is optional */ }
    }
    return next;
  }, []);

  const announce = useCallback((text) => {
    setToast(text);
    window.clearTimeout(announce.timer);
    announce.timer = window.setTimeout(() => setToast(''), 2600);
  }, []);

  useEffect(() => {
    let active = true;
    fetchPetProgress(petId).then(result => {
      if (!active) return;
      setProgress({ ...DEFAULT_PROGRESS, ...(result.progress || {}) });
      setProgressStatus('saved');
    }).catch(() => {
      if (!active) return;
      setProgressStatus('offline');
    });
    return () => { active = false; };
  }, [petId]);

  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return undefined;
    const update = () => setReducedMotion(query.matches);
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    const onResize = () => {
      const current = positionRef.current || loadPosition();
      updatePosition(current.x, current.y, true);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [updatePosition]);

  useEffect(() => {
    if (isOpen || isDragging || isHovered || reducedMotion || document.hidden) return undefined;
    let cancelled = false;
    let waitTimer;
    let walkTimer;

    const planNextWalk = delay => {
      window.clearTimeout(waitTimer);
      waitTimer = window.setTimeout(walkToNextPoint, delay);
    };
    const walkToNextPoint = () => {
      if (cancelled || document.hidden) return;
      const current = positionRef.current || loadPosition();
      const width = 104;
      const height = 128;
      const margin = 12;
      const minX = margin;
      const maxX = Math.max(minX, window.innerWidth - width - margin);
      const minY = Math.min(78, Math.max(margin, window.innerHeight - height - margin));
      const dockSafe = window.innerWidth <= 760 ? 88 : margin;
      const maxY = Math.max(minY, window.innerHeight - height - dockSafe);
      let next = current;
      let distance = 0;
      for (let attempt = 0; attempt < 12; attempt += 1) {
        next = { x: minX + Math.random() * (maxX - minX), y: minY + Math.random() * (maxY - minY) };
        distance = Math.hypot(next.x - current.x, next.y - current.y);
        if (distance > 150) break;
      }
      if (distance < 55) { planNextWalk(900); return; }
      const duration = Math.max(2300, Math.min(7600, Math.round(distance * 3.8)));
      setWalkDuration(duration);
      setIsRoaming(true);
      updatePosition(next.x, next.y, false);
      walkTimer = window.setTimeout(() => {
        if (cancelled) return;
        setIsRoaming(false);
        const finalPosition = positionRef.current || next;
        try { localStorage.setItem(POSITION_KEY, JSON.stringify(finalPosition)); } catch { /* storage is optional */ }
        planNextWalk(1300 + Math.random() * 1900);
      }, duration + 80);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        window.clearTimeout(waitTimer);
        window.clearTimeout(walkTimer);
        setIsRoaming(false);
      } else if (!isOpen && !isDragging && !isHovered && !reducedMotion) {
        planNextWalk(900);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    planNextWalk(2000);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.clearTimeout(waitTimer);
      window.clearTimeout(walkTimer);
      setIsRoaming(false);
    };
  }, [isOpen, isDragging, isHovered, reducedMotion, updatePosition]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = event => { if (event.key === 'Escape') closeAssistant(); };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'end' });
  }, [messages, pending, chatError, reducedMotion]);

  useEffect(() => () => {
    window.clearTimeout(animationTimer.current);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  const trackEvent = useCallback(async (event, nextMood = 'neutral') => {
    const now = Date.now();
    if (event === 'pet' && now - lastPetEvent.current < 2200) return;
    if (event === 'pet') lastPetEvent.current = now;
    try {
      const result = await savePetEvent(petId, event, nextMood);
      setProgress({ ...DEFAULT_PROGRESS, ...(result.progress || {}) });
      setProgressStatus('saved');
    } catch {
      setProgressStatus('offline');
    }
  }, [petId]);

  const playAnimation = useCallback((name, duration = 1450) => {
    window.clearTimeout(animationTimer.current);
    setAnimation(name);
    animationTimer.current = window.setTimeout(() => setAnimation(current => current === name ? 'idle' : current), duration);
  }, []);

  const handlePet = useCallback(() => {
    setMood('happy');
    playAnimation('happy', 1600);
    void trackEvent('pet', 'happy');
    announce('Mầm thích được vuốt ve lắm!');
  }, [announce, playAnimation, trackEvent]);

  const handleMove = useCallback(point => {
    window.clearTimeout(animationTimer.current);
    setTarget(point);
    setAnimation('walk');
  }, []);

  const handleArrive = useCallback(() => {
    setAnimation(current => current === 'walk' ? 'idle' : current);
    setMood('neutral');
    void trackEvent('walk', 'neutral');
  }, [trackEvent]);

  const handleAction = useCallback(action => {
    const nextMood = action === 'happy' ? 'happy' : action === 'sad' ? 'sad' : 'neutral';
    setMood(nextMood);
    playAnimation(action, action === 'sad' ? 1900 : 1450);
    void trackEvent(action, nextMood);
  }, [playAnimation, trackEvent]);

  const speakText = useCallback(text => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setTtsSupported(false);
      announce('Trình duyệt này chưa hỗ trợ đọc văn bản.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.96;
    utterance.pitch = 1.08;
    const voices = window.speechSynthesis.getVoices();
    const vietnameseVoice = voices.find(voice => /^vi(-|$)/i.test(voice.lang));
    if (vietnameseVoice) utterance.voice = vietnameseVoice;
    else announce('Giọng đọc tiếng Việt tùy thiết bị; Mầm vẫn đang thử phát câu này.');
    const token = ++speechToken.current;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => { if (speechToken.current === token) setSpeaking(false); };
    utterance.onerror = () => { if (speechToken.current === token) setSpeaking(false); };
    window.speechSynthesis.speak(utterance);
  }, [announce]);

  const toggleAutoSpeak = useCallback(() => {
    setAutoSpeak(current => {
      const next = !current;
      try { localStorage.setItem(TTS_KEY, next ? 'on' : 'off'); } catch { /* storage is optional */ }
      if (!next && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
      }
      return next;
    });
  }, []);

  const openAssistant = useCallback(() => {
    setIsOpen(true);
    setIsRoaming(false);
    playAnimation('wave', 1250);
  }, [playAnimation]);

  const closeAssistant = useCallback(() => {
    setIsOpen(false);
    setSpeaking(false);
    speechToken.current += 1;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  const handleWidgetPointerDown = event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    const current = positionRef.current || loadPosition();
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, left: current.x, top: current.y, moved: false };
    setIsDragging(true);
    setIsRoaming(false);
    try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* optional */ }
  };

  const handleWidgetPointerMove = event => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    drag.moved = true;
    updatePosition(drag.left + dx, drag.top + dy, false);
  };

  const handleWidgetPointerUp = event => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setIsDragging(false);
    const current = positionRef.current || loadPosition();
    updatePosition(current.x, current.y, true);
    if (!drag.moved) openAssistant();
    else {
      suppressWidgetClick.current = true;
      window.setTimeout(() => { suppressWidgetClick.current = false; }, 180);
    }
  };

  const handleWidgetKeyDown = event => {
    const step = 28;
    const moves = { ArrowUp: [0, -step], ArrowDown: [0, step], ArrowLeft: [-step, 0], ArrowRight: [step, 0] };
    if (moves[event.key]) {
      event.preventDefault();
      const current = positionRef.current || loadPosition();
      updatePosition(current.x + moves[event.key][0], current.y + moves[event.key][1], true);
      setIsRoaming(false);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openAssistant();
    }
  };

  const submitMessage = useCallback(async (rawText, retry = false) => {
    const text = String(rawText || '').trim();
    if ((!retry && !text) || pending) return;
    let pendingRequest = retry ? retryRef.current : null;
    let conversation;
    if (pendingRequest) {
      conversation = pendingRequest.messages;
    } else {
      const nextMessages = [...messages, { id: createId(), role: 'user', content: text }].slice(-24);
      setMessages(nextMessages);
      conversation = nextMessages;
      pendingRequest = {
        messages: nextMessages.slice(-12).map(message => ({ role: message.role, content: message.content })),
        requestId: createId(),
      };
      retryRef.current = pendingRequest;
    }
    setInput('');
    setPending(true);
    setChatError('');
    setRequestNotice('');
    try {
      const result = await sendPetChat(petId, pendingRequest.messages, pendingRequest.requestId);
      const responseMessage = { id: createId(), role: 'assistant', content: result.reply, mood: result.mood || 'neutral' };
      setMessages(current => [...current, responseMessage].slice(-24));
      retryRef.current = null;
      setMood(responseMessage.mood);
      playAnimation(responseMessage.mood === 'neutral' ? 'wave' : responseMessage.mood, 1700);
      if (result.progress) {
        setProgress({ ...DEFAULT_PROGRESS, ...result.progress });
        setProgressStatus('saved');
      } else {
        setProgressStatus('offline');
      }
      if (!result.progressSaved) setRequestNotice('Mầm đã trả lời, nhưng tiến trình chưa đồng bộ được.');
      if (autoSpeak) speakText(result.reply);
    } catch (error) {
      setChatError(error.message || 'Mầm chưa kết nối được. Anh thử lại nhé.');
      setRequestNotice('Lịch sử trò chuyện chỉ nằm trong phiên này; Mầm không lưu nội dung chat vào cơ sở dữ liệu.');
    } finally {
      setPending(false);
    }
  }, [autoSpeak, messages, pending, petId, playAnimation, speakText]);

  const handleSubmit = event => {
    event.preventDefault();
    if (chatError) return;
    const text = input.trim();
    if (!text) return;
    void submitMessage(text);
  };

  const retryMessage = () => {
    if (retryRef.current) void submitMessage('', true);
  };

  const onWidgetPointerEnter = event => {
    if (event.pointerType === 'touch') return;
    setIsHovered(true);
    setIsRoaming(false);
  };
  const onWidgetPointerLeave = event => {
    if (event.pointerType === 'touch') return;
    setIsHovered(false);
  };

  const xpProgress = Math.max(0, Math.min(100, Math.round((progress.xp % 80) / 80 * 100)));
  const progressLabel = progressStatus === 'saved' ? 'Đã đồng bộ' : progressStatus === 'loading' ? 'Đang tải' : 'Chưa kết nối';
  const moodLabel = MOOD_LABEL[mood] || MOOD_LABEL.neutral;
  const visibleMessages = messages.length ? messages : [];

  return (
    <>
      {!isOpen && (
        <div
          ref={widgetRef}
          className={`companion-widget${isRoaming ? ' is-roaming' : ''}${isDragging ? ' is-dragging' : ''}${isHovered ? ' is-hovered' : ''}`}
          style={{ left: `${position.x}px`, top: `${position.y}px`, transition: isRoaming && !reducedMotion ? `left ${walkDuration}ms cubic-bezier(.2,.75,.28,1), top ${walkDuration}ms cubic-bezier(.2,.75,.28,1)` : 'none' }}
          role="button"
          tabIndex={0}
          aria-label="Mầm, pet 3D đồng hành. Kéo để di chuyển, nhấn để mở trò chuyện."
          title="Kéo Mầm đi quanh màn hình hoặc nhấn để trò chuyện"
          onPointerDown={handleWidgetPointerDown}
          onPointerMove={handleWidgetPointerMove}
          onPointerUp={handleWidgetPointerUp}
          onPointerCancel={handleWidgetPointerUp}
          onPointerEnter={onWidgetPointerEnter}
          onPointerLeave={onWidgetPointerLeave}
          onClick={() => {
            if (suppressWidgetClick.current) { suppressWidgetClick.current = false; return; }
            if (!isOpen) openAssistant();
          }}
          onKeyDown={handleWidgetKeyDown}
        >
          <div className="companion-widget-scene"><PetScene mode="mini" animation={isRoaming && !reducedMotion ? 'walk' : 'idle'} /></div>
          <span className="companion-widget-tag">Mầm</span>
          <span className="companion-widget-spark" aria-hidden="true">✦</span>
        </div>
      )}

      {isOpen && (
        <div className="companion-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) closeAssistant(); }}>
          <section className="companion-window" role="dialog" aria-modal="true" aria-label="Pet đồng hành Mầm">
            <header className="companion-header">
              <div className="companion-brand">
                <span className="companion-brand-mark" aria-hidden="true">✦</span>
                <div><strong>Góc của Mầm</strong><small>Pet học tập đồng hành cùng anh</small></div>
              </div>
              <div className="companion-header-meta">
                <span className={`companion-sync ${progressStatus}`}><i />{progressLabel}</span>
                <button className="companion-icon-btn" type="button" aria-label="Đóng" onClick={closeAssistant}><Icon name="close" size={19} /></button>
              </div>
            </header>

            <div className="companion-layout">
              <section className="companion-stage-column" aria-label="Pet 3D và hoạt động">
                <div className="companion-stage">
                  <div className="companion-stage-copy"><span className="companion-eyebrow">NGƯỜI BẠN HỌC TẬP</span><h1>Chào anh, Mầm đây!</h1><p>Bấm xuống sàn để Mầm đi tới chỗ anh muốn.</p></div>
                  <div className="companion-stage-mood"><span className={`companion-mood-dot ${mood}`} />{moodLabel}</div>
                  <div className="companion-canvas"><PetScene mode="full" animation={animation} target={target} speaking={speaking} onMove={handleMove} onArrive={handleArrive} onPet={handlePet} /></div>
                  <div className="companion-stage-hint"><span className="companion-pointer-dot" /> Kéo hoặc chạm Mầm để vuốt ve</div>
                </div>
                <div className="companion-action-row" aria-label="Hành động với Mầm">
                  {ACTIONS.map(action => (
                    <button key={action.id} type="button" className={`companion-action ${animation === action.id ? 'active' : ''}`} onClick={() => handleAction(action.id)}>
                      <span aria-hidden="true">{action.icon}</span>{action.label}
                    </button>
                  ))}
                </div>
                <section className="companion-progress" aria-label="Tiến trình của Mầm">
                  <div className="companion-progress-top"><div><strong>Cấp {progress.level}</strong><span> · Mầm đang lớn lên</span></div><span>{progress.xp % 80}/80 XP</span></div>
                  <div className="companion-progress-track"><span style={{ width: `${xpProgress}%` }} /></div>
                  <div className="companion-stats">
                    <div><span>Thân thiết</span><strong><Icon name="heart" size={15} /> {progress.affection}/1000</strong></div>
                    <div><span>Lần đồng hành</span><strong>{progress.interactionCount}</strong></div>
                    <div><span>Trạng thái</span><strong>{moodLabel}</strong></div>
                  </div>
                </section>
              </section>

              <section className="companion-chat" aria-label="Trò chuyện với Mầm">
                <div className="companion-chat-head">
                  <div><span className="companion-eyebrow">TRÒ CHUYỆN</span><h2>Nói với Mầm nhé</h2><p>Mầm có thể cùng anh gỡ một bài học nhỏ.</p></div>
                  <button type="button" className={`companion-tts-toggle ${autoSpeak ? 'on' : ''}`} aria-pressed={autoSpeak} disabled={!ttsSupported} onClick={toggleAutoSpeak} title="Bật hoặc tắt đọc câu trả lời bằng giọng trình duyệt">
                    <Icon name={autoSpeak ? 'speaker' : 'speakerOff'} size={16} /><span>{autoSpeak ? 'Đọc bật' : 'Đọc tắt'}</span>
                  </button>
                </div>
                <div className="companion-message-list" aria-live="polite" aria-relevant="additions text">
                  {!visibleMessages.length && (
                    <div className="companion-welcome-message"><span className="companion-message-avatar">✦</span><div><strong>Mầm</strong><p>Anh muốn học gì hôm nay? Mình bắt đầu thật nhẹ nhàng nhé.</p></div></div>
                  )}
                  {visibleMessages.map(message => (
                    <article key={message.id} className={`companion-message ${message.role}`}>
                      {message.role === 'assistant' && <span className="companion-message-avatar">✦</span>}
                      <div className="companion-message-body">
                        {message.role === 'assistant' && <div className="companion-message-meta"><strong>Mầm</strong><button type="button" className="companion-speak-btn" disabled={!ttsSupported} onClick={() => speakText(message.content)} aria-label="Nghe câu trả lời"><Icon name="speaker" size={14} /> Nghe</button></div>}
                        <p>{message.content}</p>
                      </div>
                    </article>
                  ))}
                  {pending && <div className="companion-typing"><span className="companion-message-avatar">✦</span><div><strong>Mầm đang nghĩ</strong><i /><i /><i /></div></div>}
                  {chatError && <div className="companion-chat-error" role="alert"><span>{chatError}</span><div><button type="button" onClick={retryMessage} disabled={pending}><Icon name="retry" size={14} /> Thử lại</button><button type="button" onClick={() => { retryRef.current = null; setChatError(''); setRequestNotice(''); }}>Bỏ qua</button></div></div>}
                  <div ref={messageEndRef} />
                </div>
                {!messages.length && (
                  <div className="companion-suggestions" aria-label="Gợi ý câu hỏi">
                    <button type="button" onClick={() => submitMessage('Mình học gì hôm nay?')}>Mình học gì hôm nay?</button>
                    <button type="button" onClick={() => submitMessage('Kể mình nghe một câu động viên nhé.')}>Động viên mình nhé</button>
                  </div>
                )}
                <form className="companion-compose" onSubmit={handleSubmit}>
                  <label className="sr-only" htmlFor="companionInput">Tin nhắn cho Mầm</label>
                  <textarea id="companionInput" rows="2" maxLength="1200" value={input} onChange={event => setInput(event.target.value)} placeholder="Nhắn một câu cho Mầm..." disabled={pending} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); handleSubmit(event); } }} />
                  <button type="submit" className="companion-send-btn" disabled={!input.trim() || pending || Boolean(chatError)} aria-label="Gửi tin nhắn"><Icon name="send" size={18} /></button>
                </form>
                <div className="companion-disclosure">
                  <span>AI dùng dịch vụ Manus; tin nhắn chỉ giữ trong phiên và không ghi vào database. Tiến trình pet được lưu riêng.</span>
                  {requestNotice && <small>{requestNotice}</small>}
                </div>
              </section>
            </div>
          </section>
        </div>
      )}

      {toast && <div className="companion-toast" role="status">{toast}</div>}
    </>
  );
}
