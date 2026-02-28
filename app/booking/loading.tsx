
'use client'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <svg
          className="w-16 h-16 text-primary"
          viewBox="0 0 50 50"
          aria-hidden="true"
        >
          <circle
            className="opacity-20"
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M25 5a20 20 0 0116 32.4l-6.6-4A14 14 0 0025 11V5z"
            style={{ transformOrigin: "25px 25px", animation: "spin 1s linear infinite" }}
          />
        </svg>

        {/* Message + animated dots */}
        <div className="flex items-center gap-4 text-center">
          <div>
            <p className="font-medium text-lg text-foreground">Processing your booking</p>
            <div className="flex items-center justify-center mt-2 space-x-2">
              <span
                className="w-2.5 h-2.5 bg-primary rounded-full"
                style={{ animation: "bounce 0.9s infinite ease-in-out", animationDelay: "0s" }}
              />
              <span
                className="w-2.5 h-2.5 bg-primary rounded-full"
                style={{ animation: "bounce 0.9s infinite ease-in-out", animationDelay: "0.15s" }}
              />
              <span
                className="w-2.5 h-2.5 bg-primary rounded-full"
                style={{ animation: "bounce 0.9s infinite ease-in-out", animationDelay: "0.3s" }}
              />
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }
            40% { transform: translateY(-6px); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  )
}