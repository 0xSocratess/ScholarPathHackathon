import { Search, AlertCircle, FileQuestion } from 'lucide-react';

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-8 h-8 border-3 border-gray-200 border-t-[#13795B] rounded-full animate-spin mb-4" style={{ borderTopWidth: 3 }}></div>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

export function EmptyState({
  title = 'No results found',
  message = 'Try adjusting your search or filters to find more opportunities.',
  action,
}: {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <FileQuestion className="w-12 h-12 text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-[#14243A] mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md mb-4">{message}</p>
      {action}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle className="w-12 h-12 text-red-300 mb-4" />
      <h3 className="text-lg font-semibold text-[#14243A] mb-2">Something went wrong</h3>
      <p className="text-sm text-gray-500 max-w-md">{message}</p>
    </div>
  );
}

export function SearchEmptyState({
  query,
  onClear,
  onSearch,
}: {
  query: string;
  onClear: () => void;
  onSearch: (value: string) => void;
}) {
  const suggestions = query.trim().toLowerCase() === 'philosophy'
    ? ['Political Philosophy', 'Ethics', 'Philosophy of Science', 'Humanities', 'Social Sciences']
    : [];

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Search className="w-12 h-12 text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-[#14243A] mb-2">
        {query.trim() ? `No verified scholarships matching ${query}` : 'No matching scholarships'}
      </h3>
      <p className="text-sm text-gray-500 max-w-md mb-4">
        {query.trim()
          ? 'No matching opportunities are currently available in our active verified listings. Try a related subject, broaden your destination preferences, or check again as new opportunities are verified.'
          : 'Try different keywords, broaden your filters, or clear all filters to see active verified opportunities.'}
      </p>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-5 max-w-lg">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onSearch(suggestion)}
              className="px-3 py-1.5 text-xs font-medium text-[#13795B] bg-emerald-50 border border-emerald-200 rounded-full hover:bg-emerald-100"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={onClear}
        className="px-4 py-2 text-sm font-medium text-[#13795B] border border-[#13795B] rounded-md hover:bg-emerald-50 transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );
}
