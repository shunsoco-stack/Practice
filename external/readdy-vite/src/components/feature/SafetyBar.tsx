interface SafetyBarProps {
  onReport: () => void;
  onBlock: () => void;
}

export default function SafetyBar({ onReport, onBlock }: SafetyBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-40 md:hidden">
      <div className="flex gap-2 max-w-md mx-auto">
        <button
          onClick={onReport}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer whitespace-nowrap text-sm font-medium"
        >
          <i className="ri-alarm-warning-line text-base"></i>
          通報
        </button>
        <button
          onClick={onBlock}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors cursor-pointer whitespace-nowrap text-sm font-medium"
        >
          <i className="ri-forbid-line text-base"></i>
          ブロック
        </button>
      </div>
    </div>
  );
}