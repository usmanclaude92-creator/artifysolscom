import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient, ApiClientError } from '../../lib/apiClient';
import { Building, ShieldCheck, CheckCircle2, AlertCircle, Save, KeyRound, LogOut } from 'lucide-react';

export const PortalSettings: React.FC<{ theme?: 'dark' | 'light' }> = ({ theme = 'dark' }) => {
  const isLight = theme === 'light';
  const { user, updateProfile, logout } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [title, setTitle] = useState(user?.jobTitle || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      await updateProfile({ firstName, lastName, title: title || undefined, phone: phone || undefined });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err instanceof ApiClientError ? err.message : 'Could not update profile.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordMsg(null);
    try {
      await apiClient.post('/auth/change-password', { currentPassword, newPassword });
      setPasswordMsg({ type: 'success', text: 'Password changed. Your other sessions have been signed out.' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err instanceof ApiClientError ? err.message : 'Could not change password.' });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSignOutOtherSessions = async () => {
    try {
      await apiClient.post('/auth/logout-all');
      logout();
    } catch {
      // If this fails, the user is still signed in locally — no fabricated success message.
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
      <div>
        <h1 className={`text-2xl sm:text-3xl font-bold font-display tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Account Settings
        </h1>
        <p className={`text-xs sm:text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
          Manage your profile and account security.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className={`p-6 rounded-2xl border space-y-6 shadow-sm ${isLight ? 'bg-white border-slate-200' : 'bg-[#0c0c14] border-white/[0.08] shadow-xl'}`}>
        <h2 className={`text-sm font-bold font-display flex items-center gap-2 pb-3 border-b ${isLight ? 'text-slate-900 border-slate-100' : 'text-white border-white/[0.06]'}`}>
          <Building className={`w-4 h-4 ${isLight ? 'text-violet-600' : 'text-violet-400'}`} />
          <span>Profile</span>
        </h2>

        {profileMsg && (
          <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            profileMsg.type === 'success'
              ? isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : isLight ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}>
            {profileMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{profileMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className={`block font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className={`w-full border rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-violet-500 ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#12121e] border-white/[0.1] text-white'}`}
            />
          </div>
          <div>
            <label className={`block font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className={`w-full border rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-violet-500 ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#12121e] border-white/[0.1] text-white'}`}
            />
          </div>

          <div>
            <label className={`block font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Work Email</label>
            <input
              type="email"
              disabled
              value={user.email}
              className={`w-full border rounded-xl px-3.5 py-2.5 font-mono-code cursor-not-allowed ${isLight ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-black/40 border-white/[0.06] text-zinc-400'}`}
            />
          </div>

          <div>
            <label className={`block font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Company / Organization</label>
            <input
              type="text"
              disabled
              value={user.company}
              className={`w-full border rounded-xl px-3.5 py-2.5 cursor-not-allowed ${isLight ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-black/40 border-white/[0.06] text-zinc-400'}`}
            />
          </div>

          <div>
            <label className={`block font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Role / Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full border rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-violet-500 ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#12121e] border-white/[0.1] text-white'}`}
            />
          </div>

          <div>
            <label className={`block font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Phone</label>
            <input
              type="tel"
              value={phone}
              placeholder="+1 (555) 000-0000"
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full border rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-violet-500 ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#12121e] border-white/[0.1] text-white'}`}
            />
          </div>
        </div>

        <div className={`flex justify-end pt-4 border-t ${isLight ? 'border-slate-100' : 'border-white/[0.06]'}`}>
          <button
            type="submit"
            disabled={savingProfile}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-xs font-semibold shadow-lg shadow-violet-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{savingProfile ? 'Saving…' : 'Save Changes'}</span>
          </button>
        </div>
      </form>

      <form onSubmit={handleChangePassword} className={`p-6 rounded-2xl border space-y-5 shadow-sm ${isLight ? 'bg-white border-slate-200' : 'bg-[#0c0c14] border-white/[0.08]'}`}>
        <h2 className={`text-sm font-bold font-display flex items-center gap-2 pb-3 border-b ${isLight ? 'text-slate-900 border-slate-100' : 'text-white border-white/[0.06]'}`}>
          <KeyRound className={`w-4 h-4 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
          <span>Change Password</span>
        </h2>

        {passwordMsg && (
          <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            passwordMsg.type === 'success'
              ? isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : isLight ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}>
            {passwordMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className={`block font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className={`w-full border rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-violet-500 ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#12121e] border-white/[0.1] text-white'}`}
            />
          </div>
          <div>
            <label className={`block font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={10}
              required
              className={`w-full border rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-violet-500 ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#12121e] border-white/[0.1] text-white'}`}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingPassword}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-xs font-semibold shadow-lg shadow-violet-600/30 transition-all"
          >
            <span>{savingPassword ? 'Changing…' : 'Change Password'}</span>
          </button>
        </div>
      </form>

      <div className={`p-6 rounded-2xl border space-y-4 shadow-sm ${isLight ? 'bg-white border-slate-200' : 'bg-[#0c0c14] border-white/[0.08]'}`}>
        <h2 className={`text-sm font-bold font-display flex items-center gap-2 pb-3 border-b ${isLight ? 'text-slate-900 border-slate-100' : 'text-white border-white/[0.06]'}`}>
          <ShieldCheck className={`w-4 h-4 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
          <span>Sessions</span>
        </h2>
        <div className={`flex items-center justify-between p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/[0.06]'}`}>
          <div>
            <div className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Sign out of all other sessions</div>
            <div className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
              Revokes every active session for your account, including this one.
            </div>
          </div>
          <button
            onClick={() => void handleSignOutOtherSessions()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
              isLight ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700' : 'bg-rose-950/40 hover:bg-rose-900/60 border-rose-500/30 text-rose-300'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Everywhere</span>
          </button>
        </div>
      </div>
    </div>
  );
};
