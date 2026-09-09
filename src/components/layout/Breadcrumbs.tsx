import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  customItems?: { label: string; href?: string }[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ customItems }) => {
  const { currentPath, navigate } = useApp();

  if (currentPath === '/') return null;

  const pathSegments = currentPath.split('/').filter(Boolean);

  const items = customItems || pathSegments.map((segment, index) => {
    const url = '/' + pathSegments.slice(0, index + 1).join('/');
    const formattedLabel = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
    return {
      label: formattedLabel,
      href: index < pathSegments.length - 1 ? url : undefined,
    };
  });

  return (
    <nav className="flex items-center text-xs sm:text-sm text-slate-500 py-3" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 sm:space-x-2">
        <li className="inline-flex items-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-slate-500 hover:text-slate-900 transition cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 mr-1" />
            Home
          </button>
        </li>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 mx-1 shrink-0" />
            {item.href ? (
              <button
                onClick={() => navigate(item.href!)}
                className="text-slate-500 hover:text-slate-900 transition cursor-pointer"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-red-600 font-semibold truncate max-w-[150px] sm:max-w-xs">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
