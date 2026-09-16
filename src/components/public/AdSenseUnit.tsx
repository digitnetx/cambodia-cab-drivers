import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** Responsive Google AdSense unit. The AdSense loader is included once in index.html. */
export const AdSenseUnit: React.FC = () => {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      // The ad remains blank when an ad blocker is active or AdSense is not ready.
      console.debug('AdSense unit was not initialized.', error);
    }
  }, []);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6" aria-label="Advertisement">
      <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Advertisement</p>
      <ins
        className="adsbygoogle block min-h-[90px] overflow-hidden rounded-xl bg-slate-100/70"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2755256424218854"
        data-ad-slot="4462334582"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </section>
  );
};
