import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Bot,
  ArrowLeftRight,
  Briefcase,
  ShieldCheck,
  Settings,
  ExternalLink,
  Zap,
  BellDot,
  HeartPulse,
  FileBarChart,
  Sun,
  Moon,
} from 'lucide-react';
import { clsx } from 'clsx';
import { WalletConnection } from './WalletConnection.js';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/agents', icon: Bot, label: 'Agents' },
  { to: '/payments', icon: ArrowLeftRight, label: 'Payments' },
  { to: '/reports', icon: FileBarChart, label: 'Reports' },
  { to: '/jobs', icon: Briefcase, label: 'Escrow Jobs' },
  { to: '/alerts', icon: BellDot, label: 'Alerts' },
  { to: '/health', icon: HeartPulse, label: 'Health' },
  { to: '/limits', icon: ShieldCheck, label: 'Rate Limits' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'sa-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.classList.toggle('light', theme === 'light');
  root.dataset.theme = theme;
}

export function Sidebar() {
  const { config } = useDashboard();
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e: MediaQueryListEvent) => {
      if (!window.localStorage.getItem(THEME_STORAGE_KEY)) {
        setTheme(e.matches ? 'light' : 'dark');
      }
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <aside className="w-60 shrink-0 flex flex-col bg-sa-surface border-r border-sa-border h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sa-border">
        <div className="w-8 h-8 rounded-lg bg-sa-accent/20 border border-sa-accent/30 flex items-center justify-center">
          <Zap size={16} className="text-sa-accent" />
        </div>
        <div>
          <p className="font-display font-semibold text-sm text-sa-text">StellarAgent</p>
          <p className="text-[10px] text-sa-text-dim font-mono">
            v0.1.0 · {config.mode === 'mock' ? 'demo' : config.network}
          </p>
        </div>
      </div>

      {/* Theme toggle */}
      <div className="px-3 pt-3">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle color theme"
          aria-pressed={theme === 'dark'}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sa-text-dim hover:text-sa-text hover:bg-sa-bg/60 transition-all duration-150"
        >
          {theme === 'dark' ? <Sun size={16} className="text-sa-muted" /> : <Moon size={16} className="text-sa-muted" />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3">
        <p className="label px-2 mb-2">Navigation</p>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-sa-accent/10 text-sa-accent border border-sa-accent/20'
                      : 'text-sa-text-dim hover:text-sa-text hover:bg-sa-bg/60',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={16}
                      className={isActive ? 'text-sa-accent' : 'text-sa-muted'}
                    />
                    {label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-sa-accent"
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Wallet Connection */}
      <div className="p-4 border-t border-sa-border">
        <WalletConnection />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sa-border space-y-2">
        <a
          href="https://github.com/yourusername/stellaragent"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-sa-text-dim hover:text-sa-text transition-colors px-2 py-1.5 rounded"
        >
          <ExternalLink size={12} />
          GitHub · Contribute
        </a>
        <a
          href="https://developers.stellar.org"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-sa-text-dim hover:text-sa-text transition-colors px-2 py-1.5 rounded"
        >
          <ExternalLink size={12} />
          Stellar Docs
        </a>
      </div>
    </aside>
  );
}
