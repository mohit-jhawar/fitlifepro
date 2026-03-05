import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Eye, EyeOff, ChevronDown, Check, AlertCircle, User, Scale, Lock, Shield, Pencil, Zap, Target, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// ─────────────────────────────────────────────────────────────
// Image Crop Modal — fixed circle frame, drag image underneath
// ─────────────────────────────────────────────────────────────
const CROP_SIZE = 300; // diameter of the circular preview (px)

const ImageCropModal = ({ imageSrc, onSave, onCancel }) => {
  const imgEl = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [natW, setNatW] = useState(1);
  const [natH, setNatH] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef(null);

  // Scale so image always fills the crop circle at zoom = 1
  const baseScale = imgLoaded ? Math.max(CROP_SIZE / natW, CROP_SIZE / natH) : 1;
  const scale = baseScale * zoom;
  const imgW = natW * scale;
  const imgH = natH * scale;

  const clamp = useCallback((ox, oy, iw, ih) => ({
    x: Math.min(0, Math.max(ox, CROP_SIZE - iw)),
    y: Math.min(0, Math.max(oy, CROP_SIZE - ih)),
  }), []);

  // Re-clamp whenever zoom changes
  useEffect(() => {
    if (!imgLoaded) return;
    const iw = natW * baseScale * zoom;
    const ih = natH * baseScale * zoom;
    setOffset(prev => clamp(prev.x, prev.y, iw, ih));
  }, [zoom, imgLoaded, natW, natH, baseScale, clamp]);

  const getClient = (e) => e.touches
    ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
    : { x: e.clientX, y: e.clientY };

  const onDown = (e) => {
    e.preventDefault();
    const { x, y } = getClient(e);
    drag.current = { sx: x, sy: y, ox: offset.x, oy: offset.y };
  };
  const onMove = (e) => {
    if (!drag.current) return;
    e.preventDefault();
    const { x, y } = getClient(e);
    setOffset(clamp(
      drag.current.ox + x - drag.current.sx,
      drag.current.oy + y - drag.current.sy,
      imgW, imgH
    ));
  };
  const onUp = () => { drag.current = null; };

  const handleSave = () => {
    const img = new window.Image();
    img.onload = () => {
      // Region of the natural image that falls inside the circle
      const srcX = (-offset.x) / scale;
      const srcY = (-offset.y) / scale;
      const srcSize = CROP_SIZE / scale;

      const out = document.createElement('canvas');
      out.width = 400; out.height = 400;
      const ctx = out.getContext('2d');
      ctx.beginPath();
      ctx.arc(200, 200, 200, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, 400, 400);
      onSave(out.toDataURL('image/jpeg', 0.92));
    };
    img.src = imageSrc;
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-[#0d0f18] border border-purple-500/20 rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-white/8 text-center">
          <h3 className="text-white font-black text-xl tracking-tight">Crop Profile Photo</h3>
          <p className="text-white/35 text-xs mt-1">Drag to reposition · Zoom to fit</p>
        </div>

        {/* Crop stage */}
        <div className="flex flex-col items-center py-8 bg-black/60 gap-4">
          {/* The circular viewport */}
          <div
            className="relative overflow-hidden select-none"
            style={{
              width: CROP_SIZE,
              height: CROP_SIZE,
              borderRadius: '50%',
              boxShadow: '0 0 0 3px #7c3aed, 0 0 0 8px rgba(124,58,237,0.18), 0 0 60px rgba(124,58,237,0.25)',
              cursor: 'grab',
              background: '#111',
            }}
            onMouseDown={onDown}
            onMouseMove={onMove}
            onMouseUp={onUp}
            onMouseLeave={onUp}
            onTouchStart={onDown}
            onTouchMove={onMove}
            onTouchEnd={onUp}
          >
            {/* Image */}
            <img
              ref={imgEl}
              src={imageSrc}
              alt="crop preview"
              draggable={false}
              onLoad={(e) => {
                setNatW(e.target.naturalWidth);
                setNatH(e.target.naturalHeight);
                setImgLoaded(true);
              }}
              style={{
                position: 'absolute',
                left: offset.x,
                top: offset.y,
                width: imgW,
                height: imgH,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />
            {/* Subtle rule-of-thirds overlay */}
            {imgLoaded && (
              <div className="absolute inset-0 pointer-events-none">
                {[33.3, 66.6].map(p => (
                  <React.Fragment key={p}>
                    <div style={{ position: 'absolute', left: `${p}%`, top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.07)' }} />
                    <div style={{ position: 'absolute', top: `${p}%`, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                  </React.Fragment>
                ))}
              </div>
            )}
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm">Loading…</div>
            )}
          </div>

          {/* Zoom slider */}
          <div className="flex items-center gap-3 w-[CROP_SIZE_px] px-2" style={{ width: CROP_SIZE }}>
            <span className="text-white/25 text-base">−</span>
            <input
              type="range" min="1" max="4" step="0.02"
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="flex-1 accent-purple-500 cursor-pointer h-1.5"
            />
            <span className="text-white/25 text-base">+</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-5 py-5 border-t border-white/5">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl text-sm font-bold text-white/40 hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!imgLoaded}
            className="flex-1 py-3 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-2 disabled:opacity-40 transition-all hover:brightness-110 active:scale-95"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed,#9333ea)' }}
          >
            <Check className="w-4 h-4" /> Apply
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
const GENDER_OPTIONS = [
  { value: '', label: 'Prefer not to say' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const getPasswordStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: 'Weak', color: '#ef4444' };
  if (score === 2) return { score, label: 'Fair', color: '#f97316' };
  if (score === 3) return { score, label: 'Good', color: '#eab308' };
  return { score, label: 'Strong', color: '#10b981' };
};

const Field = ({ label, children }) => (
  <div className="group">
    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-purple-400 transition-colors">
      {label}
    </label>
    {children}
  </div>
);

const inputCls = "w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/20 transition-all font-medium text-sm backdrop-blur-sm";

const SectionCard = ({ children, className = '' }) => (
  <div className={`glass-panel rounded-[1.75rem] overflow-hidden ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ icon: Icon, label, accent }) => (
  <div className="px-6 pt-6 pb-4 flex items-center gap-3 border-b border-white/5">
    <div className="p-2.5 rounded-xl border" style={{ backgroundColor: `${accent}15`, borderColor: `${accent}30` }}>
      <Icon className="w-4 h-4" style={{ color: accent }} />
    </div>
    <span className="text-sm font-bold text-gray-200 tracking-wide">{label}</span>
  </div>
);

const ProfileSettingsView = ({ onBack }) => {
  const { user, updateProfile, changePassword } = useAuth();
  const fileInputRef = useRef(null);

  const getInitialDob = () => {
    if (!user?.date_of_birth) return '';
    try { return new Date(user.date_of_birth).toISOString().slice(0, 10); } catch { return ''; }
  };

  const [name, setName] = useState(user?.name || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [dob, setDob] = useState(getInitialDob());
  const [profilePicture, setProfilePicture] = useState(user?.profile_picture_url || '');
  const [cropSrc, setCropSrc] = useState(null);
  const [units, setUnits] = useState(user?.units || 'kg');
  const [currentWeight, setCurrentWeight] = useState(user?.weight || '');
  const [height, setHeight] = useState(user?.height || '');
  const [targetWeight, setTargetWeight] = useState(user?.target_weight || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [saving, setSaving] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('error', 'Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => { setCropSrc(ev.target.result); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) { showToast('error', 'Name cannot be empty'); return; }
    setSaving('profile');
    const payload = {
      name: name.trim(),
      gender: gender || null,
      dateOfBirth: dob || null,
      profilePictureUrl: profilePicture || null,
      targetWeight: targetWeight !== '' ? parseFloat(targetWeight) : null,
      units,
    };
    if (currentWeight !== '') payload.weight = parseFloat(currentWeight);
    if (height !== '') payload.height = parseFloat(height);
    const result = await updateProfile(payload);
    setSaving('');
    if (result.success) showToast('success', 'Profile saved!');
    else showToast('error', result.message || 'Failed to save');
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) { showToast('error', 'Fill all password fields'); return; }
    if (newPassword.length < 8) { showToast('error', 'Password must be at least 8 characters'); return; }
    if (newPassword !== confirmPassword) { showToast('error', 'Passwords do not match'); return; }
    setSaving('password');
    const result = await changePassword({ currentPassword, newPassword });
    setSaving('');
    if (result.success) {
      showToast('success', 'Password updated!');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } else {
      showToast('error', result.message || 'Failed to update password');
    }
  };

  const isLocalUser = !user?.auth_provider || user.auth_provider === 'local';
  const pwStrength = getPasswordStrength(newPassword);
  const getInitials = (n) => n ? n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="min-h-screen bg-[#080910] pt-16 pb-20">

      {/* ── Crop Modal ── */}
      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          onSave={(cropped) => {
            setProfilePicture(cropped);
            setCropSrc(null);
            showToast('success', 'Photo cropped! Hit Save Profile to keep it.');
          }}
          onCancel={() => setCropSrc(null)}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl text-sm font-semibold whitespace-nowrap animate-in fade-in slide-in-from-top-3 duration-300 ${toast.type === 'success'
          ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300'
          : 'bg-red-950/90 border-red-500/40 text-red-300'
          }`}>
          {toast.type === 'success'
            ? <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            : <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />}
          {toast.message}
        </div>
      )}

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden">
        {/* Subtle ambient glow only */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(139,92,246,0.15),transparent)]" />
        {/* Floating orbs */}
        <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-purple-600/8 blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-48 h-48 rounded-full bg-indigo-600/8 blur-3xl pointer-events-none" />

        <div className="relative px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          <div className="max-w-3xl mx-auto">

            {/* Avatar + identity */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-8">
              {/* Avatar */}
              <div className="relative shrink-0">
                {/* Glow ring */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500 opacity-50 blur-lg" />
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500 opacity-70" />
                {/* Avatar box */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 flex items-center justify-center">
                      <span className="text-white font-black text-4xl tracking-tight">{getInitials(name)}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-3 -right-3 p-2.5 bg-purple-600 hover:bg-purple-500 active:scale-95 rounded-2xl border-2 border-slate-900 transition-all shadow-lg shadow-purple-900/60"
                  title="Change photo"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>

              {/* Name / email / actions */}
              <div className="text-center sm:text-left flex-1 pb-2">
                <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full mb-3">
                  <Zap className="w-3 h-3 text-purple-400" />
                  <span className="text-purple-300 text-[11px] font-black uppercase tracking-widest">FitLife Pro Member</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-indigo-200 tracking-tight leading-none mb-2">
                  {name || 'Your Name'}
                </h1>
                <p className="text-gray-400 text-sm font-medium mb-4">{user?.email}</p>
                <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 text-xs font-bold text-purple-300 hover:text-purple-200 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 hover:border-purple-500/50 px-4 py-2 rounded-xl transition-all"
                  >
                    <Pencil className="w-3 h-3" /> Change Photo
                  </button>
                  {profilePicture && (
                    <button
                      onClick={() => setProfilePicture('')}
                      className="text-xs font-semibold text-gray-500 hover:text-gray-300 transition-colors bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-xl"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {memberSince && (
                  <p className="text-[11px] text-gray-600 mt-4 font-bold uppercase tracking-widest">
                    Member since {memberSince}
                  </p>
                )}
              </div>
            </div>

            {/* Stats Preview Row */}
            <div className="grid grid-cols-3 gap-3 mt-10">
              {[
                { label: 'Current Weight', value: currentWeight || '—', unit: units, color: '#10b981', icon: Scale },
                { label: 'Height', value: height || '—', unit: 'cm', color: '#38bdf8', icon: Activity },
                { label: 'Goal Weight', value: targetWeight || '—', unit: units, color: '#a855f7', icon: Target },
              ].map(({ label, value, unit, color, icon: Icon }) => (
                <div
                  key={label}
                  className="relative overflow-hidden rounded-2xl border backdrop-blur-md p-4 text-center"
                  style={{ backgroundColor: `${color}08`, borderColor: `${color}20` }}
                >
                  <div className="absolute top-2 right-2 opacity-20">
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: `${color}99` }}>{label}</p>
                  <p className="text-2xl font-black text-white">{value}</p>
                  <p className="text-[11px] font-bold" style={{ color: `${color}70` }}>{unit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="px-4 sm:px-6 lg:px-8 mt-2">
        <div className="max-w-3xl mx-auto space-y-4">

          {/* ── Personal Info Card ── */}
          <SectionCard>
            <SectionHeader icon={User} label="Personal Info" accent="#8b5cf6" />
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Full Name">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className={inputCls}
                  />
                </Field>
                <Field label="Gender">
                  <div className="relative">
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className={`${inputCls} appearance-none cursor-pointer pr-10`}
                    >
                      {GENDER_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-[#13151f] text-gray-100">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </Field>
              </div>
              <Field label="Date of Birth">
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  max={new Date().toISOString().slice(0, 10)}
                  className={`${inputCls} [color-scheme:dark] max-w-xs`}
                />
              </Field>
            </div>
          </SectionCard>

          {/* ── Body Stats Card ── */}
          <SectionCard>
            <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                  <Scale className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-sm font-bold text-gray-200 tracking-wide">Body Stats</span>
              </div>
              {/* Units toggle */}
              <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
                {['kg', 'lb'].map(u => (
                  <button
                    key={u}
                    onClick={() => setUnits(u)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-black tracking-widest uppercase transition-all duration-200 ${units === u
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
                      : 'text-gray-500 hover:text-gray-300'
                      }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Current Weight', value: currentWeight, set: setCurrentWeight, min: 1, max: 500, unit: units, color: '#10b981', placeholder: '—' },
                  { label: 'Height', value: height, set: setHeight, min: 50, max: 300, unit: 'cm', color: '#38bdf8', placeholder: '—' },
                  { label: 'Goal Weight', value: targetWeight, set: setTargetWeight, min: 1, max: 500, unit: units, color: '#a855f7', placeholder: '—' },
                ].map(({ label, value, set, min, max, unit, color, placeholder }) => (
                  <div
                    key={label}
                    className="group rounded-2xl p-4 transition-all cursor-text border"
                    style={{ backgroundColor: `${color}06`, borderColor: `${color}15` }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = `${color}40`}
                    onMouseLeave={e => e.currentTarget.style.borderColor = `${color}15`}
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: `${color}80` }}>
                      {label}
                    </p>
                    <div className="flex items-end gap-1.5">
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => set(e.target.value)}
                        placeholder={placeholder}
                        min={min} max={max} step="0.1"
                        className="w-full bg-transparent text-2xl font-black text-white placeholder-gray-700 focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        style={{ caretColor: color }}
                      />
                      <span className="text-sm font-bold mb-0.5 shrink-0" style={{ color: `${color}60` }}>{unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* ── Save Profile Button ── */}
          <button
            onClick={handleSaveProfile}
            disabled={saving === 'profile'}
            className="relative w-full py-4 rounded-2xl font-black text-sm tracking-wide text-white overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative flex items-center justify-center gap-2">
              {saving === 'profile' ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save Profile Changes
                </>
              )}
            </span>
          </button>

          {/* ── Change Password ── */}
          {isLocalUser && (
            <SectionCard>
              <SectionHeader icon={Lock} label="Change Password" accent="#f43f5e" />
              <div className="p-6 space-y-4">

                <Field label="Current Password">
                  <div className="relative">
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className={`${inputCls} pr-12`}
                    />
                    <button
                      onClick={() => setShowCurrentPw(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
                    >
                      {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>

                <Field label="New Password">
                  <div className="relative">
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className={`${inputCls} pr-12`}
                    />
                    <button
                      onClick={() => setShowNewPw(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
                    >
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {newPassword && (
                    <div className="mt-3">
                      <div className="flex gap-1.5 mb-1.5">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{ backgroundColor: i <= pwStrength.score ? pwStrength.color : 'rgba(255,255,255,0.08)' }}
                          />
                        ))}
                      </div>
                      <p className="text-[11px] font-bold" style={{ color: pwStrength.color }}>
                        {pwStrength.label}
                      </p>
                    </div>
                  )}
                </Field>

                <Field label="Confirm New Password">
                  <div className="relative">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className={`${inputCls} ${confirmPassword && confirmPassword !== newPassword ? 'border-red-500/50 focus:border-red-500/70' : confirmPassword && confirmPassword === newPassword ? 'border-emerald-500/50 focus:border-emerald-500/70' : ''}`}
                    />
                    {confirmPassword && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {confirmPassword === newPassword
                          ? <Check className="w-4 h-4 text-emerald-400" />
                          : <AlertCircle className="w-4 h-4 text-red-400" />}
                      </div>
                    )}
                  </div>
                </Field>

                <button
                  onClick={handleChangePassword}
                  disabled={saving === 'password'}
                  className="w-full py-3.5 mt-1 bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 hover:border-rose-500/40 text-rose-300 hover:text-rose-200 font-bold rounded-xl transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {saving === 'password' ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Updating…
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Update Password
                    </>
                  )}
                </button>

              </div>
            </SectionCard>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsView;
