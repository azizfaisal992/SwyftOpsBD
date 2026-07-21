import { CheckCircle2, UploadCloud } from "lucide-react";

const ClientFileUpload = ({ title, description, value, multiple = false, accept, accent = "blue", onChange }) => {
  const selectedNames = multiple
    ? (value || []).map((file) => file.name)
    : value?.name ? [value.name] : [];

  return (
    <section className="rounded-lg border border-[#c5cad8] bg-white p-5 sm:p-6">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-[#4c5261]">{description}</p>
      </div>
      <label className="mt-3 flex min-h-30 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[#c5cad8] px-4 py-5 text-center">
        {selectedNames.length ? <CheckCircle2 className="size-8 text-emerald-600" /> : <UploadCloud className="size-9 text-[#bcc3d5]" />}
        <span className={`mt-1 text-sm font-semibold ${accent === "green" ? "text-emerald-700" : "text-[#0047a8]"}`}>
          {selectedNames.length ? selectedNames.join(", ") : multiple ? "Add Documents" : "Click to upload"}
        </span>
        <span className="mt-1 text-xs text-[#4c5261]">{multiple ? "PDF, DOCX, JPG supported." : "or drag and drop SVG, PNG, JPG (max. 5MB)"}</span>
        <input className="sr-only" type="file" multiple={multiple} accept={accept} onChange={onChange} />
      </label>
    </section>
  );
};

export default ClientFileUpload;
