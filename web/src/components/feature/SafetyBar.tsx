interface SafetyBarProps {
  onReport: () => void;
  onBlock: () => void;
}

export default function SafetyBar({ onReport, onBlock }: SafetyBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white px-4 py-3 md:hidden">
      <div className="mx-auto flex max-w-md gap-2">
        <button
          type="button"
          onClick={onReport}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100"
        >
          <i className="ri-alarm-warning-line text-base" />
          通報
        </button>
        <button
          type="button"
          onClick={onBlock}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
        >
          <i className="ri-forbid-line text-base" />
          ブロック
        </button>
      </div>
    </div>
  );
}
