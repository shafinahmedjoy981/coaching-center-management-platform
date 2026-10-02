import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { translations, toBnNum } from '../translations';
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  History,
  Search,
  Users,
  X
} from 'lucide-react';
import { Student, Batch, Language } from '../types';

// TODO: Backend Security Enforcement - All search queries must be validated,
// sanitized for XSS/SQLi on the API gateway, and scoped by JWT claims (tenantId, role, parentId).
const sanitizeQuery = (raw: string): string => {
  return raw.replace(/[<>]/g, '').slice(0, 60);
};

// Convert Bangla digits '০'-'৯' to English digits '0'-'9'
const bnToEnDigits: Record<string, string> = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
};

const normalizeSearchTerm = (str: string): string => {
  const converted = str.replace(/[০-৯]/g, (d) => bnToEnDigits[d] || d);
  return converted.trim().toLowerCase();
};

interface HighlightMatchProps {
  text: string;
  query: string;
}

const HighlightMatch: React.FC<HighlightMatchProps> = ({ text, query }) => {
  if (!query || !text) return <>{text}</>;

  const normalizedQ = normalizeSearchTerm(query);
  if (!normalizedQ) return <>{text}</>;

  // Escape special regex characters in query
  const escaped = normalizedQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-[#E0FF4F] text-[#00272B] font-extrabold px-0.5 rounded-xs not-italic"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

export const GlobalSearch: React.FC = () => {
  const {
    students,
    batches,
    invoices,
    settings,
    language,
    role,
    selectedChildId,
    setSelectedStudentProfileId,
    setActiveTutorTab,
    setExpandedBatchId,
    setSearchViewQuery
  } = useApp();

  const t = translations[language];
  const isAssistant = settings.userRole === 'Assistant';

  const [inputVal, setInputVal] = useState('');
  const [debouncedVal, setDebouncedVal] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileOverlayOpen, setMobileOverlayOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [srAnnouncement, setSrAnnouncement] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Recent searches stored in localStorage (max 5 items, no full phone numbers)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tutorloop_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveRecentSearch = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    // Security / Privacy: Do not store full phone numbers (11 digits) in recent searches
    const cleanDigits = trimmed.replace(/[^0-9]/g, '');
    if (cleanDigits.length >= 10) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('tutorloop_recent_searches', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('tutorloop_recent_searches');
    } catch {}
  };

  // Keyboard shortcut '/' to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isOpen && !mobileOverlayOpen) {
        const target = e.target as HTMLElement;
        const isInput =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable;
        if (!isInput) {
          e.preventDefault();
          if (window.innerWidth < 768) {
            setMobileOverlayOpen(true);
          } else {
            inputRef.current?.focus();
            setIsOpen(true);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, mobileOverlayOpen]);

  // Click outside to close desktop dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 150ms debounce and 100ms loading skeleton simulation
  useEffect(() => {
    const sanitized = sanitizeQuery(inputVal);
    if (!sanitized) {
      setDebouncedVal('');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const handler = setTimeout(() => {
      setDebouncedVal(sanitized);
      // Brief skeleton under 200ms
      const loadTimer = setTimeout(() => {
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(loadTimer);
    }, 150);

    return () => clearTimeout(handler);
  }, [inputVal]);

  // Filter students & batches based on Role isolation rules
  // Parent view is strictly limited to that parent's own child and their batch only
  const visibleStudents = useMemo(() => {
    if (role === 'parent') {
      return students.filter((s) => s.id === selectedChildId || s.parentPhone === '01711223344');
    }
    return students;
  }, [students, role, selectedChildId]);

  const visibleBatches = useMemo(() => {
    if (role === 'parent') {
      return batches.filter((b) => visibleStudents.some((s) => s.batchId === b.id));
    }
    return batches;
  }, [batches, role, visibleStudents]);

  // Search Results Computation
  const searchResults = useMemo(() => {
    const q = normalizeSearchTerm(debouncedVal);
    if (!q) return { students: [], batches: [], parents: [], totalCount: 0 };

    // 1. Students match
    const matchedStudents = visibleStudents.filter((st) => {
      const nameEn = st.name.toLowerCase().includes(q);
      const nameBn = st.nameBn ? st.nameBn.includes(debouncedVal.trim()) : false;
      const idMatch = st.id.toLowerCase().includes(q);
      const classMatch = st.classLevel.toLowerCase().includes(q);
      const schoolMatch = st.schoolName.toLowerCase().includes(q);
      return nameEn || nameBn || idMatch || classMatch || schoolMatch;
    });

    // 2. Batches match
    const matchedBatches = visibleBatches.filter((b) => {
      const nameMatch = b.name.toLowerCase().includes(q);
      const subjectMatch = b.subject.toLowerCase().includes(q);
      const classMatch = b.classLevel.toLowerCase().includes(q);
      const codeMatch = b.code ? b.code.toLowerCase().includes(q) : false;
      const daysMatch = b.scheduleDays.some((d) => d.toLowerCase().includes(q));
      return nameMatch || subjectMatch || classMatch || codeMatch || daysMatch;
    });

    // 3. Parents match
    const parentMap = new Map<string, { parentName: string; parentPhone: string; student: Student }>();
    visibleStudents.forEach((st) => {
      const key = `${st.parentPhone}_${st.parentName}`;
      if (!parentMap.has(key)) {
        parentMap.set(key, { parentName: st.parentName, parentPhone: st.parentPhone, student: st });
      }
    });

    const matchedParents = Array.from(parentMap.values()).filter((p) => {
      const nameMatch = p.parentName.toLowerCase().includes(q);
      const cleanPhone = p.parentPhone.replace(/[^0-9]/g, '');
      const phoneMatch =
        cleanPhone.includes(q) ||
        cleanPhone.replace(/^0/, '').includes(q) ||
        cleanPhone.endsWith(q);
      const studentNameMatch =
        p.student.name.toLowerCase().includes(q) ||
        (p.student.nameBn && p.student.nameBn.includes(debouncedVal.trim()));
      return nameMatch || phoneMatch || studentNameMatch;
    });

    const totalCount = matchedStudents.length + matchedBatches.length + matchedParents.length;

    return {
      students: matchedStudents.slice(0, 5),
      batches: matchedBatches.slice(0, 5),
      parents: matchedParents.slice(0, 5),
      allStudentsCount: matchedStudents.length,
      allBatchesCount: matchedBatches.length,
      allParentsCount: matchedParents.length,
      totalCount
    };
  }, [debouncedVal, visibleStudents, visibleBatches]);

  // Announce results to screen readers
  useEffect(() => {
    if (debouncedVal && !isLoading) {
      const count = searchResults.totalCount;
      const msg =
        language === 'bn'
          ? `${toBnNum(count, language, settings.useBanglaDigits)} টি ফলাফল পাওয়া গেছে`
          : `${count} results found`;
      setSrAnnouncement(msg);
    }
  }, [debouncedVal, isLoading, searchResults.totalCount, language, settings.useBanglaDigits]);

  // Flat list of selectable results for keyboard navigation
  const flatItems = useMemo(() => {
    const items: Array<{
      type: 'student' | 'batch' | 'parent';
      id: string;
      data: any;
    }> = [];

    searchResults.students.forEach((s) => items.push({ type: 'student', id: `st-${s.id}`, data: s }));
    searchResults.batches.forEach((b) => items.push({ type: 'batch', id: `bt-${b.id}`, data: b }));
    searchResults.parents.forEach((p, idx) => items.push({ type: 'parent', id: `pt-${idx}`, data: p }));

    return items;
  }, [searchResults]);

  // Reset activeIndex when query changes
  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedVal]);

  const handleSelectStudent = (st: Student) => {
    saveRecentSearch(st.name);
    setSelectedStudentProfileId(st.id);
    closeSearch();
  };

  const handleSelectBatch = (b: Batch) => {
    saveRecentSearch(b.name);
    setExpandedBatchId(b.id);
    setActiveTutorTab('classes');
    closeSearch();
  };

  const handleSelectParent = (p: { student: Student }) => {
    saveRecentSearch(p.student.name);
    setSelectedStudentProfileId(p.student.id);
    closeSearch();
  };

  const handleSeeAll = () => {
    saveRecentSearch(debouncedVal);
    setSearchViewQuery(debouncedVal);
    closeSearch();
  };

  const closeSearch = () => {
    setIsOpen(false);
    setMobileOverlayOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen && inputVal) setIsOpen(true);
      setActiveIndex((prev) => (prev < flatItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : flatItems.length - 1));
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeSearch();
      inputRef.current?.blur();
      mobileInputRef.current?.blur();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      // If a specific row is highlighted
      if (activeIndex >= 0 && flatItems[activeIndex]) {
        const item = flatItems[activeIndex];
        if (item.type === 'student') handleSelectStudent(item.data);
        else if (item.type === 'batch') handleSelectBatch(item.data);
        else if (item.type === 'parent') handleSelectParent(item.data);
        return;
      }

      // Requirement 3: If a query matches exactly one student (like "Farhan Kabir"), Enter opens that profile directly.
      if (searchResults.allStudentsCount === 1) {
        handleSelectStudent(searchResults.students[0]);
        return;
      }

      // If multiple students matching or multiple results, open the "All results" list page
      if (searchResults.totalCount > 1) {
        handleSeeAll();
        return;
      }

      // If exactly 1 batch or parent
      if (searchResults.totalCount === 1) {
        const first = flatItems[0];
        if (first) {
          if (first.type === 'student') handleSelectStudent(first.data);
          else if (first.type === 'batch') handleSelectBatch(first.data);
          else if (first.type === 'parent') handleSelectParent(first.data);
        }
      }
    }
  };

  const quickSuggestions = [
    { label: t.suggestionOverdueFees, query: language === 'bn' ? 'বকেয়া' : 'Overdue' },
    { label: t.suggestionAbsentToday, query: language === 'bn' ? 'অনুপস্থিত' : 'Absent' },
    { label: t.suggestionTodayClasses, query: language === 'bn' ? 'Physics' : 'Physics' }
  ];

  return (
    <>
      {/* Screen Reader Announcement Live Region */}
      <div className="sr-only" role="status" aria-live="polite">
        {srAnnouncement}
      </div>

      {/* Desktop Search Bar (md and up) */}
      <div ref={containerRef} className="relative w-full max-w-xs md:max-w-md hidden sm:block">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-white/50 absolute left-3 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-controls="global-search-dropdown"
            aria-activedescendant={activeIndex >= 0 && flatItems[activeIndex] ? flatItems[activeIndex].id : undefined}
            aria-autocomplete="list"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={t.searchPlaceholder}
            className="w-full h-9 sm:h-10 pl-9 pr-8 text-xs sm:text-sm bg-white/10 text-white placeholder-white/50 rounded-full border border-white/15 focus:outline-none focus:border-[#E0FF4F] focus:ring-2 focus:ring-[#E0FF4F]/50 transition-all"
          />

          {inputVal ? (
            <button
              type="button"
              onClick={() => {
                setInputVal('');
                setDebouncedVal('');
                inputRef.current?.focus();
              }}
              className="absolute right-2.5 p-1 text-white/60 hover:text-white rounded-full"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden lg:inline-flex items-center absolute right-3 text-[10px] font-mono text-white/40 bg-white/10 px-1.5 py-0.5 rounded border border-white/10 pointer-events-none select-none">
              /
            </kbd>
          )}
        </div>

        {/* Live Results Dropdown (Desktop) */}
        {isOpen && (
          <div
            id="global-search-dropdown"
            role="listbox"
            className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-[#00272B]/15 overflow-hidden z-50 text-[#00272B] max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-100"
          >
            {renderDropdownBody({
              debouncedVal,
              isLoading,
              searchResults,
              recentSearches,
              quickSuggestions,
              activeIndex,
              flatItems,
              isAssistant,
              language,
              t,
              settings,
              invoices,
              batches,
              onSelectStudent: handleSelectStudent,
              onSelectBatch: handleSelectBatch,
              onSelectParent: handleSelectParent,
              onSeeAll: handleSeeAll,
              onSelectSuggestion: (q: string) => {
                setInputVal(q);
                setDebouncedVal(q);
              },
              onClearRecent: clearRecentSearches,
              onClearInput: () => {
                setInputVal('');
                setDebouncedVal('');
                inputRef.current?.focus();
              }
            })}
          </div>
        )}
      </div>

      {/* Mobile Search Button in Top Bar (triggers full-width overlay) */}
      <div className="sm:hidden flex items-center">
        <button
          type="button"
          onClick={() => {
            setMobileOverlayOpen(true);
            setTimeout(() => mobileInputRef.current?.focus(), 50);
          }}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          aria-label="Open search"
        >
          <Search className="w-4 h-4 text-[#E0FF4F]" />
        </button>
      </div>

      {/* Mobile Full-Screen Overlay */}
      {mobileOverlayOpen && (
        <div className="fixed inset-0 z-50 bg-[#00272B] flex flex-col animate-in fade-in duration-150 sm:hidden">
          {/* Mobile Search Header */}
          <div className="p-3 border-b border-white/10 flex items-center gap-2 bg-[#00272B]">
            <button
              type="button"
              onClick={() => {
                setMobileOverlayOpen(false);
                setInputVal('');
                setDebouncedVal('');
              }}
              className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0 active:scale-95"
              aria-label="Close search"
            >
              <ArrowLeft className="w-5 h-5 text-[#E0FF4F]" />
            </button>

            <div className="flex-1 relative flex items-center">
              <Search className="w-4 h-4 text-white/50 absolute left-3 pointer-events-none" />
              <input
                ref={mobileInputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.searchPlaceholder}
                className="w-full h-11 pl-9 pr-9 text-sm bg-white/10 text-white placeholder-white/50 rounded-xl border border-white/20 focus:outline-none focus:border-[#E0FF4F] focus:ring-1 focus:ring-[#E0FF4F]"
              />
              {inputVal && (
                <button
                  type="button"
                  onClick={() => {
                    setInputVal('');
                    setDebouncedVal('');
                    mobileInputRef.current?.focus();
                  }}
                  className="absolute right-2 p-1.5 text-white/70 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Results Container */}
          <div className="flex-1 bg-white overflow-y-auto">
            {renderDropdownBody({
              debouncedVal,
              isLoading,
              searchResults,
              recentSearches,
              quickSuggestions,
              activeIndex,
              flatItems,
              isAssistant,
              language,
              t,
              settings,
              invoices,
              batches,
              isMobile: true,
              onSelectStudent: handleSelectStudent,
              onSelectBatch: handleSelectBatch,
              onSelectParent: handleSelectParent,
              onSeeAll: handleSeeAll,
              onSelectSuggestion: (q: string) => {
                setInputVal(q);
                setDebouncedVal(q);
              },
              onClearRecent: clearRecentSearches,
              onClearInput: () => {
                setInputVal('');
                setDebouncedVal('');
                mobileInputRef.current?.focus();
              }
            })}
          </div>
        </div>
      )}
    </>
  );
};

// Sub-renderer for results list (shared between desktop and mobile)
interface DropdownBodyParams {
  debouncedVal: string;
  isLoading: boolean;
  searchResults: any;
  recentSearches: string[];
  quickSuggestions: Array<{ label: string; query: string }>;
  activeIndex: number;
  flatItems: any[];
  isAssistant: boolean;
  language: Language;
  t: any;
  settings: any;
  invoices: any[];
  batches: any[];
  isMobile?: boolean;
  onSelectStudent: (s: Student) => void;
  onSelectBatch: (b: Batch) => void;
  onSelectParent: (p: any) => void;
  onSeeAll: () => void;
  onSelectSuggestion: (q: string) => void;
  onClearRecent: () => void;
  onClearInput: () => void;
}

function renderDropdownBody({
  debouncedVal,
  isLoading,
  searchResults,
  recentSearches,
  quickSuggestions,
  activeIndex,
  flatItems,
  isAssistant,
  language,
  t,
  settings,
  invoices,
  batches,
  isMobile = false,
  onSelectStudent,
  onSelectBatch,
  onSelectParent,
  onSeeAll,
  onSelectSuggestion,
  onClearRecent,
  onClearInput
}: DropdownBodyParams) {
  // Empty & Focused state: Show Recent Searches & Quick Suggestions
  if (!debouncedVal.trim()) {
    return (
      <div className="p-4 space-y-4">
        {/* Quick Suggestions */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-[#00272B]/60 uppercase tracking-wider block">
            {t.quickSuggestions}
          </span>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectSuggestion(item.query)}
                className="px-3 py-1.5 rounded-xl bg-[#F6F8EE] hover:bg-[#E0FF4F]/40 border border-[#00272B]/10 text-xs font-semibold text-[#00272B] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="pt-2 border-t border-[#00272B]/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#00272B]/60 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#00272B]/60" />
                <span>{t.recentSearches}</span>
              </span>
              <button
                type="button"
                onClick={onClearRecent}
                className="text-[11px] font-semibold text-[#00272B]/60 hover:text-[#00272B] underline"
              >
                {t.clearRecent}
              </button>
            </div>
            <div className="space-y-1">
              {recentSearches.map((rec, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectSuggestion(rec)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F6F8EE] text-xs font-medium text-[#00272B] flex items-center gap-2 transition-colors min-h-[44px]"
                >
                  <Search className="w-3.5 h-3.5 text-[#00272B]/40 shrink-0" />
                  <span className="truncate">{rec}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Loading skeleton state (under 200ms)
  if (isLoading) {
    return (
      <div className="p-4 space-y-3 animate-pulse">
        <div className="h-3 w-28 bg-[#00272B]/10 rounded" />
        <div className="space-y-2">
          <div className="h-10 bg-[#00272B]/5 rounded-xl" />
          <div className="h-10 bg-[#00272B]/5 rounded-xl" />
          <div className="h-10 bg-[#00272B]/5 rounded-xl" />
        </div>
      </div>
    );
  }

  // Empty Search State
  if (searchResults.totalCount === 0) {
    return (
      <div className="p-6 text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-[#F6F8EE] flex items-center justify-center mx-auto text-[#00272B]/40">
          <Search className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#00272B]">
            {t.noResultsFor} "{debouncedVal}"
          </p>
          <p className="text-xs text-[#00272B]/60 mt-0.5">
            {t.searchEmptyHint}
          </p>
        </div>
        <button
          type="button"
          onClick={onClearInput}
          className="px-4 py-1.5 rounded-xl bg-[#00272B] text-[#E0FF4F] font-bold text-xs hover:bg-black transition-colors"
        >
          {t.clear}
        </button>
      </div>
    );
  }

  // Grouped Results
  let globalItemIndex = 0;

  return (
    <div className="divide-y divide-[#00272B]/10 overflow-y-auto">
      {/* Group: Students */}
      {searchResults.students.length > 0 && (
        <div className="p-2 sm:p-3">
          <div className="px-2 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#00272B]/60">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#00272B]" />
              <span>{t.searchGroupStudents}</span>
            </span>
            <span>({searchResults.allStudentsCount})</span>
          </div>

          <div className="mt-1 space-y-1">
            {searchResults.students.map((st: Student) => {
              const currentItemIdx = globalItemIndex++;
              const isSelected = activeIndex === currentItemIdx;
              const batch = batches.find((b) => b.id === st.batchId);
              const invoice = invoices.find(
                (inv) => inv.studentId === st.id && inv.month.includes('October')
              );
              const status = invoice?.status || 'due';

              return (
                <div
                  key={st.id}
                  id={`st-${st.id}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onSelectStudent(st)}
                  className={`w-full px-3 py-2.5 rounded-xl text-left flex items-center justify-between gap-3 cursor-pointer transition-colors min-h-[44px] ${
                    isSelected
                      ? 'bg-[#00272B] text-white ring-1 ring-[#E0FF4F]'
                      : 'hover:bg-[#F6F8EE] text-[#00272B]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-[#E0FF4F] text-[#00272B]'
                          : 'bg-[#00272B] text-[#E0FF4F]'
                      }`}
                    >
                      {st.avatarInitials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold truncate leading-tight">
                        <HighlightMatch text={st.name} query={debouncedVal} />
                        {st.nameBn && (
                          <span className={`text-xs ml-1.5 font-normal ${isSelected ? 'text-white/70' : 'text-[#00272B]/60'}`}>
                            (<HighlightMatch text={st.nameBn} query={debouncedVal} />)
                          </span>
                        )}
                      </p>
                      <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-white/70' : 'text-[#00272B]/60'}`}>
                        <HighlightMatch text={st.classLevel} query={debouncedVal} /> · {batch?.name}
                      </p>
                    </div>
                  </div>

                  {/* Fee status chip (Hidden for Assistant role) */}
                  {!isAssistant && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1 shrink-0 ${
                        isSelected
                          ? 'bg-white/20 text-[#E0FF4F]'
                          : status === 'paid'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : status === 'overdue'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {status === 'paid' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : status === 'overdue' ? (
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                      ) : (
                        <Clock className="w-3 h-3 text-amber-600" />
                      )}
                      <span>
                        {status === 'paid'
                          ? language === 'bn' ? 'পরিশোধিত' : 'Paid'
                          : status === 'overdue'
                          ? language === 'bn' ? 'মেয়াদোত্তীর্ণ' : 'Overdue'
                          : language === 'bn' ? 'বকেয়া' : 'Due'}
                      </span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Group: Batches */}
      {searchResults.batches.length > 0 && (
        <div className="p-2 sm:p-3">
          <div className="px-2 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#00272B]/60">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-[#00272B]" />
              <span>{t.searchGroupBatches}</span>
            </span>
            <span>({searchResults.allBatchesCount})</span>
          </div>

          <div className="mt-1 space-y-1">
            {searchResults.batches.map((b: Batch) => {
              const currentItemIdx = globalItemIndex++;
              const isSelected = activeIndex === currentItemIdx;

              return (
                <div
                  key={b.id}
                  id={`bt-${b.id}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onSelectBatch(b)}
                  className={`w-full px-3 py-2.5 rounded-xl text-left flex items-center justify-between gap-3 cursor-pointer transition-colors min-h-[44px] ${
                    isSelected
                      ? 'bg-[#00272B] text-white ring-1 ring-[#E0FF4F]'
                      : 'hover:bg-[#F6F8EE] text-[#00272B]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[11px] font-mono font-black px-1.5 py-0.5 rounded bg-[#E0FF4F] text-[#00272B] shrink-0 border border-[#00272B]/20">
                      <HighlightMatch text={b.code} query={debouncedVal} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold truncate leading-tight">
                        <HighlightMatch text={b.name} query={debouncedVal} />
                      </p>
                      <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-white/70' : 'text-[#00272B]/60'}`}>
                        {b.scheduleDays.join(' · ')} · {b.scheduleTime}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-semibold shrink-0 ${isSelected ? 'text-white/80' : 'text-[#00272B]/70'}`}>
                    {b.studentIds.length} {language === 'bn' ? 'শিক্ষার্থী' : 'students'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Group: Parents */}
      {searchResults.parents.length > 0 && (
        <div className="p-2 sm:p-3">
          <div className="px-2 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#00272B]/60">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#00272B]" />
              <span>{t.searchGroupParents}</span>
            </span>
            <span>({searchResults.allParentsCount})</span>
          </div>

          <div className="mt-1 space-y-1">
            {searchResults.parents.map((p: any, idx: number) => {
              const currentItemIdx = globalItemIndex++;
              const isSelected = activeIndex === currentItemIdx;

              return (
                <div
                  key={idx}
                  id={`pt-${idx}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onSelectParent(p)}
                  className={`w-full px-3 py-2.5 rounded-xl text-left flex items-center justify-between gap-3 cursor-pointer transition-colors min-h-[44px] ${
                    isSelected
                      ? 'bg-[#00272B] text-white ring-1 ring-[#E0FF4F]'
                      : 'hover:bg-[#F6F8EE] text-[#00272B]'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold truncate leading-tight">
                      <HighlightMatch text={p.parentName} query={debouncedVal} />
                    </p>
                    <p className={`text-[11px] font-mono mt-0.5 truncate ${isSelected ? 'text-white/70' : 'text-[#00272B]/60'}`}>
                      <HighlightMatch text={p.parentPhone} query={debouncedVal} />
                    </p>
                  </div>

                  <span className={`text-[11px] truncate shrink-0 ${isSelected ? 'text-white/80' : 'text-[#00272B]/70'}`}>
                    {language === 'bn' ? 'অভিভাবক:' : 'Child:'}{' '}
                    <strong>{language === 'bn' && p.student.nameBn ? p.student.nameBn : p.student.name}</strong>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* "See all results" Link Footer */}
      {searchResults.totalCount > 0 && (
        <div className="p-3 bg-[#F6F8EE] flex items-center justify-between">
          <span className="text-xs text-[#00272B]/70 font-medium">
            {toBnNum(searchResults.totalCount, language, settings.useBanglaDigits)} {t.resultsFound}
          </span>
          <button
            type="button"
            onClick={onSeeAll}
            className="text-xs font-bold text-[#00272B] hover:underline flex items-center gap-1"
          >
            <span>{t.seeAllResults}</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
}
