import { useRef } from 'react'
import { FileText, AlertCircle, RefreshCw } from 'lucide-react'

interface ResumeUploadZoneProps {
  onUpload: (file: File) => void
  isUploading: boolean
  uploadError: string | null
}

export default function ResumeUploadZone({
  onUpload,
  isUploading,
  uploadError,
}: ResumeUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 shrink-0">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onUpload(e.target.files[0])
          }
        }}
        accept=".pdf,.docx,.txt"
        className="hidden"
      />

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onUpload(e.dataTransfer.files[0])
          }
        }}
        onClick={() => fileInputRef.current?.click()}
        className="p-3 rounded-2xl border-2 border-dashed border-sky-200 dark:border-slate-700 bg-sky-50/40 dark:bg-slate-800/40 hover:bg-sky-50 dark:hover:bg-slate-800/70 transition-all cursor-pointer flex items-center justify-between text-xs"
      >
        <div className="flex items-center gap-2.5">
          <FileText size={16} className="text-[#0B4F9C] shrink-0" />
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              Upload Resume for Instant Calibration
            </span>
            <span className="text-[10px] text-slate-400">
              PDF, DOCX, or TXT (Max 5MB)
            </span>
          </div>
        </div>
        <span className="text-[11px] font-bold text-[#0B4F9C] dark:text-sky-400 underline shrink-0 flex items-center gap-1">
          {isUploading ? (
            <>
              <RefreshCw size={12} className="animate-spin" />
              <span>Parsing...</span>
            </>
          ) : (
            'Upload File'
          )}
        </span>
      </div>

      {uploadError && (
        <div className="mt-2 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
          <AlertCircle size={13} className="shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  )
}
