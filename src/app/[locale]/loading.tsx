interface LoadingProps {
  opacity?: string;
  bg?: string;
}

export default function Loading({ opacity, bg = 'background' }: LoadingProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-${bg} ${opacity || ''}`}
    >
      <div className="relative h-[80px] w-[80p] animate-fade-in">
        <svg className="h-full w-full animate-rotate" viewBox="25 25 50 50">
          <circle
            className="path animate-dash"
            cx="50"
            cy="50"
            r="20"
            fill="none"
            strokeWidth="2"
            strokeMiterlimit="10"
          />
        </svg>
      </div>
    </div>
  );
}
