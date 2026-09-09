import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { HomepageSectionConfig } from '../../types';
import { Layers, Eye, EyeOff, Save, Sparkles, GripVertical, CheckCircle2, HelpCircle, Info, Timer } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Detailed descriptions of what each homepage section controls on the public website
const SECTION_DESCRIPTIONS: Record<string, { summary: string; publicImpact: string }> = {
  hero: {
    summary: 'Main visual header & conversion greeting.',
    publicImpact: 'Controls the top high-impact headline, background backdrop image, trust badges, direct WhatsApp contact link, and instant booking introduction.',
  },
  booking_widget: {
    summary: 'Instant ride calculation & reservation module.',
    publicImpact: 'Controls the interactive booking card where visitors pick origin, destination, vehicle category, travel date/time, and submit direct bookings.',
  },
  trust_bar: {
    summary: 'Key trust signals & reassurance markers.',
    publicImpact: 'Displays verified driver license credentials, 5.0 Google review ratings, fixed pricing guarantee badges, and English-speaking assurances right below the hero.',
  },
  services: {
    summary: 'Core transportation service categories.',
    publicImpact: 'Displays the 4 main services (Airport Transfers, City Taxi, Overland Intercity, and Private Tour Driver) with starting prices and detail links.',
  },
  airport_transfers: {
    summary: 'Dedicated airport pickup cards (PNH & SAI).',
    publicImpact: 'Features cards for Phnom Penh (PNH) and Siem Reap Angkor (SAI) airports with flight delay tracking, meet & greet name sign service, and terminal guides.',
  },
  popular_routes: {
    summary: 'Intercity route rates & pricing table.',
    publicImpact: 'Presents fixed rates for popular transfers like Phnom Penh ↔ Siem Reap, Sihanoukville, Kampot, and Battambang with sedan, SUV, and van price comparison.',
  },
  vehicles: {
    summary: 'Vehicle fleet specifications & capacities.',
    publicImpact: 'Showcases Comfort Sedans, Luxury SUVs, and Executive Minivans along with passenger counts, luggage limits, and AC/refreshment amenities.',
  },
  tours: {
    summary: 'Custom private day tours & sightseeing.',
    publicImpact: 'Renders curated tour packages like Phnom Penh City Highlights, Angkor Wat Sunrise Temple Tour, and Kampot Pepper & Kep Crab day trips.',
  },
  destinations: {
    summary: 'Cambodia destination travel guides.',
    publicImpact: 'Highlights popular travel hubs (Phnom Penh, Siem Reap, Kampot/Kep, Sihanoukville/Koh Rong) with travel tips, local attractions, and taxi booking buttons.',
  },
  driver_profile: {
    summary: 'Driver biography, license & background.',
    publicImpact: 'Displays team photo, verified tourist driver license, 10+ years safe driving record, fluent English proficiency, and personal greeting.',
  },
  why_choose_us: {
    summary: 'Direct booking advantages & benefits grid.',
    publicImpact: 'Explains why travelers should book direct (zero platform commissions, 100% fixed transparent rates, direct WhatsApp replies, and flexible itinerary stops).',
  },
  reviews: {
    summary: 'Google traveler reviews & testimonials.',
    publicImpact: 'Displays real 5-star customer testimonials with traveler countries, star ratings, and Google review badges to establish high credibility.',
  },
  faq: {
    summary: 'Interactive FAQ accordion.',
    publicImpact: 'Provides answers to common tourist questions regarding airport meet & greet, payment currency (USD/KHR), tolls, flight delays, and luggage capacities.',
  },
  driver_cta: {
    summary: 'Bottom conversion call-to-action banner.',
    publicImpact: 'Displays a high-contrast pre-footer banner urging travelers with upcoming flights to reserve their private driver in advance.',
  },
  whatsapp_cta: {
    summary: 'Floating 1-click WhatsApp button.',
    publicImpact: 'Controls the persistent floating WhatsApp chat button in the bottom-right corner of the screen across the website.',
  },
};

interface SortableSectionItemProps {
  section: HomepageSectionConfig;
  index: number;
  onToggle: (id: string) => void;
}

const SortableSectionItem: React.FC<SortableSectionItemProps> = ({ section, index, onToggle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const [showTooltip, setShowTooltip] = useState(false);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const sectionInfo = SECTION_DESCRIPTIONS[section.key] || {
    summary: section.subtitle || 'Homepage section module',
    publicImpact: `Controls the public layout and content for the ${section.title} section on the visitor-facing website.`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`py-3 px-3.5 flex items-center justify-between gap-4 rounded-xl border transition select-none ${
        isDragging
          ? 'bg-white border-red-500 shadow-2xl ring-2 ring-red-500/40 opacity-95'
          : 'bg-[#FAF9F6] border-slate-200 hover:bg-white hover:border-red-400'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Drag handle */}
        <button
          type="button"
          {...attributes}
          {...(listeners ?? {})}
          className="p-1.5 text-slate-400 hover:text-red-600 active:text-red-700 cursor-grab active:cursor-grabbing rounded-lg hover:bg-slate-100 transition shrink-0"
          title="Click and drag to reorder"
          aria-label={`Drag to reorder section ${section.title}`}
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-mono font-bold flex items-center justify-center text-[11px] shrink-0 border border-slate-200">
          {index + 1}
        </div>

        <div className="min-w-0">
          <div className="font-bold text-slate-900 text-xs flex items-center gap-2 flex-wrap">
            <span>{section.title}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              {section.key}
            </span>

            {/* Tooltip trigger icon */}
            <div className="relative inline-flex items-center">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip((prev) => !prev);
                }}
                className="p-0.5 text-slate-400 hover:text-red-600 focus:text-red-700 rounded-full transition cursor-pointer"
                aria-label={`About ${section.title} section`}
                title="Click for section details"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>

              {/* Hover / Tap Tooltip Popover */}
              {showTooltip && (
                <div 
                  className="absolute left-0 top-full mt-2 w-72 sm:w-80 p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 text-left pointer-events-auto ring-1 ring-slate-200"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs pb-1.5 border-b border-slate-100">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>Controls on Public Website:</span>
                  </div>
                  <p className="text-[11px] text-slate-900 font-medium mt-1.5 leading-snug">
                    {sectionInfo.summary}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {sectionInfo.publicImpact}
                  </p>
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Key: <code className="text-red-600">{section.key}</code></span>
                    <span className={section.is_enabled ? 'text-emerald-600 font-semibold' : 'text-slate-400 font-semibold'}>
                      {section.is_enabled ? '● Currently Active' : '○ Currently Hidden'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 truncate">{section.subtitle}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Toggle Enable/Disable */}
        <button
          type="button"
          onClick={() => onToggle(section.id)}
          className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
            section.is_enabled
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
          }`}
        >
          {section.is_enabled ? (
            <>
              <Eye className="w-3.5 h-3.5 text-emerald-600" /> Visible
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5" /> Hidden
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export const AdminHomepage: React.FC = () => {
  const { homepageSettings, updateHomepageSettings } = useApp();
  
  const [heroForm, setHeroForm] = useState(homepageSettings.hero);
  const [sections, setSections] = useState<HomepageSectionConfig[]>(homepageSettings.sections);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setHeroForm(homepageSettings.hero);
    setSections(homepageSettings.sections);
  }, [homepageSettings]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateHomepageSettings({ hero: heroForm, sections });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleToggleSection = (id: string) => {
    const updated = sections.map(s => s.id === id ? { ...s, is_enabled: !s.is_enabled } : s);
    setSections(updated);
    updateHomepageSettings({ hero: heroForm, sections: updated });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSections((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return prev;
        
        const moved = arrayMove<HomepageSectionConfig>(prev, oldIndex, newIndex);
        const reordered: HomepageSectionConfig[] = moved.map((sec: HomepageSectionConfig, idx: number) => ({
          id: sec.id,
          key: sec.key,
          title: sec.title,
          subtitle: sec.subtitle,
          is_enabled: sec.is_enabled,
          display_order: idx + 1,
        }));
        updateHomepageSettings({ hero: heroForm, sections: reordered });
        return reordered;
      });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans text-slate-800">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-red-600" /> Homepage Manager
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Customize hero texts, conversion copy, and drag &amp; drop to reorder homepage sections.
          </p>
        </div>

        <button
          onClick={handleHeroSubmit}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-red-600/20 self-start sm:self-auto cursor-pointer"
        >
          {saveSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" /> Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Homepage Settings
            </>
          )}
        </button>
      </div>

      {/* Hero Configuration Form */}
      <form onSubmit={handleHeroSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6 text-xs shadow-xs">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-600" /> Hero Section Content &amp; Conversion Copy
          </h2>
          <p className="text-slate-600 text-xs mt-0.5">
            This controls what visitors see immediately when landing on the website.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Hero Top Badge Text</label>
            <input
              type="text"
              value={heroForm.badge || ''}
              onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Hero Subtitle / Service Highlights</label>
            <input
              type="text"
              value={heroForm.subtitle || ''}
              onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Main H1 Hero Title</label>
          <input
            type="text"
            value={heroForm.title || ''}
            onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold text-sm focus:border-red-500 focus:bg-white focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Hero Supporting Description</label>
          <textarea
            rows={2}
            value={heroForm.description || ''}
            onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Hero Background Image URL</label>
            <input
              type="url"
              value={heroForm.background_image || ''}
              onChange={(e) => setHeroForm({ ...heroForm, background_image: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-red-600" />
                Sliding Background Transition Speed (Seconds)
              </span>
              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {heroForm.slide_interval_seconds || 5}s interval
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                min={2}
                max={60}
                step={1}
                value={heroForm.slide_interval_seconds ?? 5}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setHeroForm({
                    ...heroForm,
                    slide_interval_seconds: isNaN(val) ? 5 : Math.max(1, Math.min(60, val)),
                  });
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                placeholder="5"
              />
              <span className="absolute right-3 top-2.5 text-slate-400 font-medium text-xs pointer-events-none">
                seconds
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Controls how many seconds each background image is shown before sliding to the next photo (recommended: 4–8s).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">WhatsApp Button Text</label>
            <input
              type="text"
              value={heroForm.whatsapp_btn_text || ''}
              onChange={(e) => setHeroForm({ ...heroForm, whatsapp_btn_text: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Price Guarantee Badge Text</label>
            <input
              type="text"
              value={heroForm.price_guarantee_text || ''}
              onChange={(e) => setHeroForm({ ...heroForm, price_guarantee_text: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Rating Display Text</label>
            <input
              type="text"
              value={heroForm.rating_text || ''}
              onChange={(e) => setHeroForm({ ...heroForm, rating_text: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Experience Guarantee Text</label>
            <input
              type="text"
              value={heroForm.experience_text || ''}
              onChange={(e) => setHeroForm({ ...heroForm, experience_text: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition shadow-md shadow-red-600/20 cursor-pointer"
          >
            Update Hero Content
          </button>
        </div>
      </form>

      {/* Sections Visibility & Drag-and-Drop Ordering Manager */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-xs shadow-xs">
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-600" /> Homepage Sections Display &amp; Drag Reordering
            </h2>
            <p className="text-slate-600 text-xs mt-0.5">
              Drag items using the grip handle <GripVertical className="w-3.5 h-3.5 inline text-slate-400" /> to easily reorder sections, or toggle visibility.
            </p>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium self-start sm:self-auto">
            Drag &amp; Drop Active
          </span>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2.5">
              {sections.map((sec, index) => (
                <SortableSectionItem
                  key={sec.id}
                  section={sec}
                  index={index}
                  onToggle={handleToggleSection}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

    </div>
  );
};

