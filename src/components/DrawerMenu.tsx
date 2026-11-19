import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  Smartphone,
  Cpu,
  Globe,
  BookOpen,
  Info,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Server,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Settings,
  Key,
  Cloud,
  Palette,
  UserCheck,
  Trash2,
  Plus,
  Play,
  FileCode2,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { EngineType } from '../types';
import {
  getApiBaseUrl,
  getCustomServerUrl,
  getSavedServerHistory,
  saveCustomServerUrl,
  removeServerFromHistory,
  clearCustomServerUrl,
  testBackendServerUrl,
  isMobileOrApk,
  SavedServerEntry,
} from '../utils/apiConfig';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  engine: EngineType;
  onChangeEngine: (engine: EngineType) => void;
  onOpenEditor?: () => void;
  onRunCode?: () => void;
  onOpenPip: () => void;
  onOpenApk: () => void;
  onOpenSamples: () => void;
  onOpenSyntaxColor: () => void;
  onOpenApiKeySettings?: () => void;
  onOpenGoogleWorkspace?: () => void;
  onSwitchGoogleAccount?: () => void;
  googleUser?: User | null;
  hasGoogleToken?: boolean;
  onServerUrlChanged?: () => void;
  fontSize: number;
  onChangeFontSize: (delta: number) => void;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  isOpen,
  onClose,
  engine,
  onChangeEngine,
  onOpenEditor,
  onRunCode,
  onOpenPip,
  onOpenApk,
  onOpenSamples,
  onOpenSyntaxColor,
  onOpenApiKeySettings,
  onOpenGoogleWorkspace,
  onSwitchGoogleAccount,
  googleUser,
  hasGoogleToken = false,
  onServerUrlChanged,
  fontSize,
  onChangeFontSize,
}) => {
  const [testingServer, setTestingServer] = useState(false);
  const [serverStatus, setServerStatus] = useState<{
    tested: boolean;
    online: boolean;
    message?: string;
  } | null>(null);
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [activeCustomUrl, setActiveCustomUrl] = useState<string>(() => getCustomServerUrl());
  const [serverInputUrl, setServerInputUrl] = useState<string>(() => getCustomServerUrl());
  const [serverInputLabel, setServerInputLabel] = useState<string>('');
  const [serverHistory, setServerHistory] = useState<SavedServerEntry[]>(() => getSavedServerHistory());

  useEffect(() => {
    if (!isOpen) return;
    const current = getCustomServerUrl();
    setActiveCustomUrl(current);
    setServerInputUrl(current);
    setServerHistory(getSavedServerHistory());
  }, [isOpen]);

  const handleTestConnection = async (targetUrl?: string) => {
    setTestingServer(true);
    setServerStatus({
      tested: false,
      online: false,
      message: 'Đang kết nối tới máy chủ...',
    });
    const urlToTest = (targetUrl ?? activeCustomUrl) || getApiBaseUrl() || window.location.origin;

    try {
      const check = await testBackendServerUrl(urlToTest, 60000, (msg) => {
        setServerStatus({
          tested: false,
          online: false,
          message: msg,
        });
      });
      if (check.ok) {
        setServerStatus({
          tested: true,
          online: true,
          message: check.geminiAvailable
            ? `${check.message} Gemini AI đã sẵn sàng.`
            : `${check.message} Hãy nhập Khóa Gemini API nếu máy chủ chưa cấu hình sẵn.`,
        });
      } else {
        setServerStatus({
          tested: true,
          online: false,
          message: check.message,
        });
      }
    } finally {
      setTestingServer(false);
    }
  };

  const handleSaveCustomServer = async () => {
    const saved = saveCustomServerUrl(serverInputUrl, serverInputLabel);
    if (saved.ok === false) {
      setServerStatus({
        tested: true,
        online: false,
        message: saved.error,
      });
      return;
    }

    setActiveCustomUrl(saved.url);
    setServerInputUrl(saved.url);
    setServerInputLabel('');
    setServerHistory(getSavedServerHistory());
    onServerUrlChanged?.();
    await handleTestConnection(saved.url);
  };

  const handleSelectSavedServer = async (entry: SavedServerEntry) => {
    const saved = saveCustomServerUrl(entry.url, entry.label);
    if (saved.ok) {
      setActiveCustomUrl(saved.url);
      setServerInputUrl(saved.url);
      setServerHistory(getSavedServerHistory());
      onServerUrlChanged?.();
      await handleTestConnection(saved.url);
    }
  };

  const handleRemoveSavedServer = (url: string) => {
    const updated = removeServerFromHistory(url);
    setServerHistory(updated);
    const remainingActive = getCustomServerUrl();
    setActiveCustomUrl(remainingActive);
    if (!remainingActive) {
      setServerInputUrl('');
      onServerUrlChanged?.();
    }
  };

  const handleUseDefaultOffline = () => {
    clearCustomServerUrl();
    setActiveCustomUrl('');
    setServerInputUrl('');
    setServerStatus({
      tested: false,
      online: false,
      message: 'Đã chuyển về chế độ mặc định (Pyodide Offline trên APK / Server nội bộ trên Web).',
    });
    onServerUrlChanged?.();
  };

  if (!isOpen) return null;

  const isGoogleConnected = !!(googleUser && hasGoogleToken);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-start animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-[332px] max-w-[88vw] h-full bg-[#070b14] border-r border-cyan-500/25 shadow-[8px_0_40px_rgba(0,0,0,0.85)] flex flex-col pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] select-none relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Dark Premium atmospheric glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-65"
          style={{
            background:
              'radial-gradient(circle at 12% 6%, rgba(6, 182, 212, 0.16) 0%, transparent 42%), radial-gradient(circle at 92% 16%, rgba(225, 29, 72, 0.14) 0%, transparent 38%), radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.10) 0%, transparent 45%)',
          }}
        />

        <div className="relative z-10 flex-1 flex flex-col overflow-y-auto no-scrollbar">
          {/* Dark Premium Drawer Header */}
          <div className="px-4 py-4 bg-gradient-to-r from-[#0c162b] via-[#091122] to-[#111226] border-b border-cyan-500/25 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3.5 min-w-0">
              <div className="w-13 h-13 rounded-2xl p-[1.5px] bg-gradient-to-br from-cyan-400/80 via-sky-500/40 to-amber-400/75 shadow-[0_0_20px_rgba(34,211,238,0.28)] shrink-0">
                <img
                  src="/app-icon.jpg"
                  alt="Pydroid 3 Web"
                  className="w-full h-full rounded-[14px] object-cover bg-[#060911]"
                />
              </div>
              <div className="min-w-0">
                <h2 className="font-extrabold text-[17px] tracking-tight text-white flex items-center space-x-1.5 leading-tight">
                  <span>Pydroid 3</span>
                  <span className="text-amber-400">Web</span>
                </h2>
                <p className="text-[11px] text-slate-300/85 mt-0.5 truncate">
                  IDE Python &amp; AI Android
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-[#0e192f] hover:bg-[#162748] border border-cyan-500/25 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition shrink-0"
              aria-label="Đóng menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-3 space-y-3.5 flex-1">
            {/* Primary Quick Cards (Matching Reference UI) */}
            <div className="space-y-2">
              {onOpenEditor && (
                <button
                  onClick={() => {
                    onOpenEditor();
                    onClose();
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-2xl bg-gradient-to-r from-[#0e1e36] via-[#0a1426] to-[#080d18] border border-cyan-500/35 hover:border-cyan-400/70 shadow-[0_4px_18px_rgba(6,182,212,0.12)] flex items-center justify-between gap-2.5 transition active:scale-[0.99]"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/25 to-cyan-500/10 border border-cyan-400/50 shadow-[0_0_14px_rgba(34,211,238,0.25)] flex items-center justify-center shrink-0">
                      <FileCode2 className="w-5 h-5 text-cyan-300" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-bold text-slate-50 truncate">
                        Trình soạn thảo
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        Viết và chỉnh sửa mã Python
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
                </button>
              )}

              {onRunCode && (
                <button
                  onClick={() => {
                    onRunCode();
                    onClose();
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-2xl bg-gradient-to-r from-[#092324] via-[#091524] to-[#080d18] border border-emerald-500/35 hover:border-emerald-400/70 shadow-[0_4px_18px_rgba(16,185,129,0.10)] flex items-center justify-between gap-2.5 transition active:scale-[0.99]"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/25 to-cyan-500/10 border border-emerald-400/50 shadow-[0_0_14px_rgba(16,185,129,0.25)] flex items-center justify-center shrink-0">
                      <Play className="w-5 h-5 text-emerald-300 fill-emerald-300/20" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-bold text-slate-50 truncate">
                        Chạy mã Python
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        Thực thi chương trình
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
                </button>
              )}
            </div>

            {/* Section: Featured Tools (Dark Premium Cards — Purple, Amber Gold, Cyan) */}
            <div className="space-y-2">
              <div className="text-[10.5px] font-bold text-cyan-300/75 uppercase tracking-wider px-1.5">
                Tính Năng Nổi Bật
              </div>

              <button
                onClick={() => {
                  onOpenPip();
                  onClose();
                }}
                className="w-full text-left px-3 py-2.5 rounded-2xl bg-gradient-to-r from-[#1b1230] via-[#0c1324] to-[#080d18] border border-purple-500/35 hover:border-purple-400/70 shadow-[0_4px_18px_rgba(168,85,247,0.10)] flex items-center justify-between gap-2.5 transition active:scale-[0.99]"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/25 to-fuchsia-500/10 border border-purple-400/50 shadow-[0_0_14px_rgba(168,85,247,0.28)] flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-purple-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-bold text-slate-50 truncate">
                      Quản lý thư viện Pip
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      Cài đặt và quản lý thư viện
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
              </button>

              <button
                onClick={() => {
                  onOpenApk();
                  onClose();
                }}
                className="w-full text-left px-3 py-2.5 rounded-2xl bg-gradient-to-r from-[#241a0b] via-[#0d1424] to-[#080d18] border border-amber-500/40 hover:border-amber-400/75 shadow-[0_4px_18px_rgba(245,158,11,0.12)] flex items-center justify-between gap-2.5 transition active:scale-[0.99]"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/25 to-orange-500/10 border border-amber-400/55 shadow-[0_0_14px_rgba(245,158,11,0.30)] flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5 text-amber-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-bold text-slate-50 truncate">
                      Đóng gói Android APK
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      Biến Python thành ứng dụng
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
              </button>

              <button
                onClick={() => {
                  onOpenSamples();
                  onClose();
                }}
                className="w-full text-left px-3 py-2.5 rounded-2xl bg-gradient-to-r from-[#0b232a] via-[#0b1424] to-[#080d18] border border-teal-500/35 hover:border-cyan-400/70 shadow-[0_4px_18px_rgba(20,184,166,0.10)] flex items-center justify-between gap-2.5 transition active:scale-[0.99]"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400/25 to-cyan-500/10 border border-teal-400/50 shadow-[0_0_14px_rgba(20,184,166,0.26)] flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-teal-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-bold text-slate-50 truncate">
                      Kho mã mẫu có sẵn
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      Các ví dụ và mẫu code
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
              </button>
            </div>

            {/* Google Account & Drive Sync Card */}
            {onOpenGoogleWorkspace && (
              <button
                onClick={() => {
                  onOpenGoogleWorkspace();
                  onClose();
                }}
                className="w-full text-left px-3 py-2.5 rounded-2xl bg-gradient-to-r from-[#0d213a] via-[#0a1426] to-[#080d18] border border-cyan-500/40 hover:border-cyan-400/75 shadow-[0_4px_18px_rgba(56,189,248,0.14)] flex items-center justify-between gap-2.5 transition active:scale-[0.99]"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  {googleUser?.photoURL ? (
                    <img
                      src={googleUser.photoURL}
                      alt="Google"
                      className="w-10 h-10 rounded-xl object-cover border border-cyan-400/60 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/25 to-blue-600/15 border border-sky-400/50 shadow-[0_0_14px_rgba(56,189,248,0.28)] flex items-center justify-center shrink-0">
                      <Cloud className="w-5 h-5 text-sky-300" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-slate-50 truncate">
                      {googleUser
                        ? googleUser.displayName || googleUser.email || 'Tài khoản Google'
                        : 'Đăng nhập Google'}
                    </div>
                    <div className="text-[11px] text-cyan-300/90 truncate">
                      {isGoogleConnected
                        ? googleUser?.email || 'Đã kết nối Drive & Đồng bộ'
                        : 'Google Drive, Ghi chú & Đồng bộ APK'}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
              </button>
            )}

            {/* Section: Dual Engine */}
            <div>
              <div className="text-[10.5px] font-bold text-cyan-300/75 uppercase tracking-wider px-1.5 mb-1.5 flex items-center justify-between">
                <span>Động Cơ Chạy Mã (Dual Engine)</span>
                {engine === 'pyodide' ? (
                  <span className="text-[10px] text-amber-400 font-bold">
                    Python 3.11 • Offline
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-400 font-bold">
                    CPython 3.10
                  </span>
                )}
              </div>
              <div className="space-y-1.5 bg-gradient-to-b from-[#0b1324] to-[#080d18] p-2 rounded-2xl border border-cyan-500/25 text-xs">
                <button
                  onClick={() => onChangeEngine('pyodide')}
                  className={`w-full text-left p-2.5 rounded-xl flex items-start space-x-2.5 transition ${
                    engine === 'pyodide'
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/15 text-cyan-100 font-semibold border border-cyan-400/55 shadow-[0_0_16px_rgba(34,211,238,0.14)]'
                      : 'text-slate-300 hover:bg-[#111c33] border border-transparent'
                  }`}
                >
                  <Globe className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs">2. Pyodide WASM (Client)</span>
                      <span className="text-[10px] text-amber-400 font-semibold shrink-0">Khuyên dùng APK</span>
                    </div>
                    <div className="text-[10.5px] text-slate-400 font-normal mt-0.5 leading-snug">
                      Chạy Python 3.11 trực tiếp trên điện thoại, không cần mạng hay máy chủ.
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => onChangeEngine('cpython')}
                  className={`w-full text-left p-2.5 rounded-xl flex items-start space-x-2.5 transition ${
                    engine === 'cpython'
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-600/15 text-emerald-100 font-semibold border border-emerald-400/55 shadow-[0_0_16px_rgba(16,185,129,0.14)]'
                      : 'text-slate-300 hover:bg-[#111c33] border border-transparent'
                  }`}
                >
                  <Cpu className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs">1. CPython Native (Server)</span>
                      <span className="text-[10px] text-amber-400 font-normal shrink-0">Cần Máy Chủ</span>
                    </div>
                    <div className="text-[10.5px] text-slate-400 font-normal mt-0.5 leading-snug">
                      Linux Python 3.10 trên máy chủ backend (Web Studio hoặc Server riêng).
                    </div>
                  </div>
                </button>

                {engine === 'cpython' && !activeCustomUrl && isMobileOrApk() && (
                  <div className="p-2.5 rounded-xl bg-amber-950/35 border border-amber-500/45 text-[11px] text-amber-200 space-y-1.5">
                    <div className="flex items-center space-x-1.5 font-semibold text-amber-300">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Lưu ý trên APK di động:</span>
                    </div>
                    <p className="text-[10.5px] text-slate-300 leading-snug">
                      Chưa đặt URL Server riêng. Chuyển sang <strong>Pyodide WASM</strong> để chạy Offline tức thì.
                    </p>
                    <button
                      onClick={() => onChangeEngine('pyodide')}
                      className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white font-bold text-[11px] flex items-center justify-center space-x-1.5 transition"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Chuyển sang Pyodide WASM</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Section: Custom Server & Google Account Switcher */}
            <div>
              <div className="text-[10.5px] font-bold text-cyan-300/75 uppercase tracking-wider px-1.5 mb-1.5 flex items-center justify-between">
                <span>Máy Chủ Tùy Chỉnh &amp; Google</span>
                <button
                  onClick={() => setShowServerConfig((v) => !v)}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-semibold py-0.5"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{showServerConfig ? 'Thu gọn' : 'Đổi máy chủ'}</span>
                </button>
              </div>

              <div className="p-2.5 bg-gradient-to-b from-[#0b1324] to-[#080d18] rounded-2xl border border-cyan-500/25 text-xs space-y-2.5">
                <div className="flex items-start space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center shrink-0">
                    <Server className="w-4 h-4 text-cyan-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-slate-100 font-semibold text-[11.5px]">
                      {activeCustomUrl
                        ? 'Máy chủ đang chọn (Tùy chỉnh)'
                        : isMobileOrApk()
                        ? 'Chưa chọn máy chủ riêng (APK)'
                        : 'Máy chủ Web (Nội bộ)'}
                    </div>
                    <div className="text-[10px] text-cyan-300/75 break-all font-mono mt-0.5">
                      {activeCustomUrl || getApiBaseUrl() || 'Kết nối trực tiếp cùng tên miền'}
                    </div>
                  </div>
                </div>

                {serverStatus && (
                  <div
                    className={`p-2 rounded-xl text-[11px] flex items-start space-x-1.5 border ${
                      serverStatus.online
                        ? 'bg-emerald-950/40 border-emerald-500/45 text-emerald-200'
                        : 'bg-cyan-950/40 border-cyan-500/45 text-cyan-200'
                    }`}
                  >
                    {serverStatus.online ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-snug">{serverStatus.message}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => handleTestConnection()}
                    disabled={testingServer}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-950/70 to-blue-950/60 hover:from-cyan-900/70 hover:to-blue-900/60 border border-cyan-500/45 text-cyan-200 font-semibold text-[11.5px] flex items-center justify-center space-x-2 active:scale-[0.98] transition disabled:opacity-60"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-cyan-300 ${testingServer ? 'animate-spin' : ''}`} />
                    <span>{testingServer ? 'Đang kiểm tra (tối đa 25s)...' : 'Kiểm tra kết nối máy chủ'}</span>
                  </button>

                  {onSwitchGoogleAccount && (
                    <button
                      onClick={() => {
                        onSwitchGoogleAccount();
                        onClose();
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-950/60 to-teal-950/50 hover:from-emerald-900/60 hover:to-teal-900/50 border border-emerald-500/40 text-emerald-200 font-semibold text-[11.5px] flex items-center justify-center space-x-2 active:scale-[0.98] transition"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
                      <span>
                        {googleUser
                          ? 'Đăng nhập tài khoản Google khác'
                          : 'Đăng nhập tài khoản Google tùy chọn'}
                      </span>
                    </button>
                  )}

                  {onOpenApiKeySettings && (
                    <button
                      onClick={() => {
                        onOpenApiKeySettings();
                        onClose();
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#1c160d] to-[#121626] hover:from-[#292011] hover:to-[#181e33] border border-amber-500/40 text-amber-200 font-semibold text-[11.5px] flex items-center justify-center space-x-2 active:scale-[0.98] transition"
                    >
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      <span>Khóa Gemini API (Tùy chọn)</span>
                    </button>
                  )}
                </div>

                {showServerConfig && (
                  <div className="pt-2.5 border-t border-cyan-950/70 space-y-2.5 animate-in fade-in duration-150">
                    {serverHistory.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                          Danh sách máy chủ đã lưu (Chạm để đổi nhanh):
                        </div>
                        <div className="space-y-1 max-h-36 overflow-y-auto">
                          {serverHistory.map((entry) => {
                            const isCurrent = activeCustomUrl === entry.url;
                            return (
                              <div
                                key={entry.url}
                                className={`flex items-center justify-between gap-1.5 p-2 rounded-xl border text-[11px] ${
                                  isCurrent
                                    ? 'bg-cyan-950/50 border-cyan-500/60 text-cyan-200'
                                    : 'bg-[#090e1a] border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <button
                                  onClick={() => handleSelectSavedServer(entry)}
                                  className="flex-1 min-w-0 text-left"
                                >
                                  <div className="font-semibold truncate flex items-center space-x-1.5">
                                    <span>{entry.label}</span>
                                    {isCurrent && (
                                      <span className="text-[9px] text-emerald-400">✓ Đang dùng</span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-mono truncate">
                                    {entry.url}
                                  </div>
                                </button>
                                <button
                                  onClick={() => handleRemoveSavedServer(entry.url)}
                                  className="p-1.5 rounded-lg hover:bg-rose-950/50 text-slate-500 hover:text-rose-400 shrink-0"
                                  title="Xóa máy chủ khỏi danh sách"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 block font-medium">
                        Thêm hoặc thay đổi URL Máy chủ (Render, Cloud Run, Wi-Fi LAN):
                      </label>
                      <input
                        type="text"
                        value={serverInputLabel}
                        onChange={(e) => setServerInputLabel(e.target.value)}
                        placeholder="Tên gợi nhớ (VD: Server Render chính)"
                        className="w-full bg-[#070b14] border border-slate-700 rounded-xl px-2.5 py-2 text-[11px] text-slate-100 focus:outline-none focus:border-cyan-400"
                      />
                      <input
                        type="text"
                        value={serverInputUrl}
                        onChange={(e) => setServerInputUrl(e.target.value)}
                        placeholder="https://my-pydroid-server.onrender.com"
                        className="w-full bg-[#070b14] border border-slate-700 rounded-xl px-2.5 py-2 text-[11px] text-slate-100 font-mono focus:outline-none focus:border-cyan-400"
                      />
                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={handleUseDefaultOffline}
                          className="px-2 py-1.5 text-[11px] text-slate-400 hover:text-white"
                        >
                          Mặc định (Offline)
                        </button>
                        <button
                          onClick={handleSaveCustomServer}
                          disabled={testingServer}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white font-semibold text-[11px] flex items-center space-x-1 disabled:opacity-50"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Lưu &amp; Kết nối</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section: Editor Font Size + Syntax Color Designer */}
            <div>
              <div className="text-[10.5px] font-bold text-cyan-300/75 uppercase tracking-wider px-1.5 mb-1.5">
                Cỡ Chữ &amp; Cài Đặt Trình Soạn Thảo
              </div>
              <div className="p-2.5 bg-gradient-to-b from-[#0b1324] to-[#080d18] rounded-2xl border border-cyan-500/25 space-y-2.5 text-xs">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <div className="text-slate-100 font-semibold text-[12.5px]">Cỡ chữ trình soạn thảo</div>
                    <div className="text-[10.5px] text-slate-400">Hiện tại: {fontSize}px</div>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => onChangeFontSize(-1)}
                      className="w-9 h-9 rounded-xl bg-[#0e192f] hover:bg-[#162748] border border-slate-700 text-slate-200 flex items-center justify-center transition"
                      aria-label="Giảm cỡ chữ"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onChangeFontSize(1)}
                      className="w-9 h-9 rounded-xl bg-[#0e192f] hover:bg-[#162748] border border-slate-700 text-slate-200 flex items-center justify-center transition"
                      aria-label="Tăng cỡ chữ"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onOpenSyntaxColor();
                    onClose();
                  }}
                  className="w-full px-3 py-2.5 rounded-2xl bg-gradient-to-r from-[#231910] via-[#131428] to-[#0a0f1c] border border-amber-500/40 hover:border-amber-400/70 text-slate-100 font-semibold text-xs flex items-center justify-between gap-2.5 transition active:scale-[0.99]"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400/25 to-purple-500/15 border border-amber-400/50 flex items-center justify-center shrink-0">
                      <Palette className="w-4.5 h-4.5 text-amber-300" />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-[13px] font-bold text-slate-100 truncate">
                        Tô Màu Văn Bản (Designer)
                      </div>
                      <div className="text-[10.5px] text-slate-400 truncate">
                        Tùy chỉnh bảng màu cú pháp Python
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
                </button>
              </div>
            </div>
          </div>

          {/* Dark Premium Drawer Footer */}
          <div className="px-4 py-3 bg-[#060911] border-t border-cyan-950/70 flex items-center justify-between text-[10.5px] text-slate-400">
            <span className="font-semibold text-slate-300">
              {engine === 'pyodide' ? 'Python 3.11 • Offline' : 'CPython 3.10 • Server'}
            </span>
            <span className="text-cyan-400/80 font-mono truncate max-w-[145px]">
              {activeCustomUrl ? 'Server: Custom' : 'Local / Studio'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
