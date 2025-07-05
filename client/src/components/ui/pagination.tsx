import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          borderColor: 'var(--color-light-gray)',
          color: 'var(--color-charcoal)',
          backgroundColor: 'transparent'
        }}
        onMouseEnter={(e) => {
          if (!e.currentTarget.disabled) {
            e.currentTarget.style.backgroundColor = 'var(--color-soft-beige)';
            e.currentTarget.style.borderColor = 'var(--color-mid-gray)';
          }
        }}
        onMouseLeave={(e) => {
          if (!e.currentTarget.disabled) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'var(--color-light-gray)';
          }
        }}
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Previous</span>
      </button>

      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-sm" style={{ color: 'var(--color-mid-gray)' }}>
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`px-3 py-2 text-sm rounded-lg border transition-all duration-300 ${
                  currentPage === page ? 'font-medium' : ''
                }`}
                style={{
                  borderColor: currentPage === page ? 'var(--color-charcoal)' : 'var(--color-light-gray)',
                  color: currentPage === page ? 'var(--color-warm-white)' : 'var(--color-charcoal)',
                  backgroundColor: currentPage === page ? 'var(--color-charcoal)' : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.backgroundColor = 'var(--color-soft-beige)';
                    e.currentTarget.style.borderColor = 'var(--color-mid-gray)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--color-light-gray)';
                  }
                }}
              >
                {page}
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          borderColor: 'var(--color-light-gray)',
          color: 'var(--color-charcoal)',
          backgroundColor: 'transparent'
        }}
        onMouseEnter={(e) => {
          if (!e.currentTarget.disabled) {
            e.currentTarget.style.backgroundColor = 'var(--color-soft-beige)';
            e.currentTarget.style.borderColor = 'var(--color-mid-gray)';
          }
        }}
        onMouseLeave={(e) => {
          if (!e.currentTarget.disabled) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'var(--color-light-gray)';
          }
        }}
      >
        <span>Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}