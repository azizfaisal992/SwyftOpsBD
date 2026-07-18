import { CheckCircle2, UploadCloud, X } from "lucide-react";

const FileUpload = ({
  title,
  detail,
  required = false,
  compact = false,
  multiple = false,
  accept,
  files = [],
  onChange,
  onClear,
}) => (
  <section className="rounded-lg border border-[#c3c6d6] bg-white p-5 shadow-sm sm:p-6">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-xs text-[#434654]">{detail}</p>
      </div>
      {required && <span className="rounded-sm bg-[#ffdad6] px-2 py-1 text-[10px] font-bold text-[#93000a]">REQUIRED</span>}
    </div>
    {compact ? (
      <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded border border-[#737685] px-4 py-3 text-sm font-semibold text-[#003d9b]">
        <UploadCloud className="size-5" /> Upload Document
        <input className="sr-only" type="file" accept={accept} onChange={onChange} />
      </label>
    ) : (
      <label className="mt-5 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-[#c3c6d6] bg-[#f4f5f7]/50 p-6 text-center">
        <UploadCloud className="size-8 text-[#737685]" />
        <span className="mt-2 text-sm text-[#434654]">{multiple ? "Upload front and back files" : "Click or drag and drop to upload"}</span>
        <input className="sr-only" type="file" multiple={multiple} accept={accept} onChange={onChange} />
      </label>
    )}
    {files.length > 0 && (
      <div className="mt-4 space-y-2">
        {files.map((file) => (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800" key={`${file.name}-${file.lastModified || 0}`}>
            <CheckCircle2 className="size-4 shrink-0" />
            <span className="min-w-0 flex-1 truncate">{file.name}</span>
            {onClear && <button className="rounded p-1 hover:bg-emerald-100" type="button" aria-label={`Remove ${file.name}`} onClick={() => onClear(file)}><X className="size-4" /></button>}
          </div>
        ))}
      </div>
    )}
  </section>
);

export default FileUpload;
