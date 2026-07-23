import { CloudUpload, FileImage, FileText, History, Info, NotebookPen, Smartphone } from "lucide-react";
import { useState } from "react";
import PortalCard from "../../../components/client/portal/PortalCard";

const recentUploads = [
  { name: "Medication_Schedule_Oct.pdf", date: "Oct 12, 2026", status: "Verified", icon: FileText },
  { name: "NewPrescription_Scan.jpg", date: "Today, 2:45 PM", status: "Pending", icon: FileImage },
  { name: "Lab_Results_Serum.pdf", date: "Oct 05, 2026", status: "Verified", icon: FileText },
];

const ClientMedicationUpload = () => {
  const [files, setFiles] = useState([]);
  const [notes, setNotes] = useState("");
  const [notice, setNotice] = useState("");

  return (
    <div className="mx-auto max-w-[980px] p-5 sm:p-8">
      <header><h1 className="text-3xl font-semibold tracking-[-0.03em]">Upload Medication File</h1><p className="mt-1 text-[#4c5261]">Manage prescription documents and medical reports for your care plan.</p></header>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_295px]">
        <div className="space-y-6">
          <PortalCard className="p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase text-[#0649ad]"><FileUpIcon /> File Drop Zone</h2>
            <label className="mt-4 flex min-h-64 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[#c5cad8] p-6 text-center">
              <span className="grid size-14 place-items-center rounded-xl bg-[#eef2ff]"><CloudUpload className="size-8 text-[#0649ad]" /></span>
              <strong className="mt-3 text-2xl">Drag &amp; drop prescription files</strong>
              <span className="mt-2 text-[#4c5261]">PDF, JPG or PNG up to 10MB</span>
              <span className="mt-6 rounded bg-[#0649ad] px-6 py-3 text-sm font-semibold text-white">Select from Computer</span>
              <input className="sr-only" type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setFiles(Array.from(event.target.files))} />
            </label>
            {files.length > 0 && <p className="mt-3 rounded bg-emerald-50 p-3 text-sm text-emerald-700">{files.map((file) => file.name).join(", ")} selected</p>}
          </PortalCard>
          <PortalCard className="p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase text-[#0649ad]"><NotebookPen className="size-5" /> Caregiver Notes</h2>
            <textarea className="mt-4 min-h-32 w-full resize-y rounded border border-[#c5cad8] bg-[#f7f8fb] p-4 outline-none focus:border-[#0649ad]" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Add specific instructions for the caregiver about this medication (e.g., 'Take with food', 'Verify blood pressure before administering')..." />
            <button className="mt-4 block rounded bg-emerald-700 px-6 py-3 text-sm font-semibold text-white sm:ml-auto" type="button" onClick={() => setNotice("Instructions saved locally for the future API connection.")}>Save Instructions</button>
            {notice && <p className="mt-3 text-sm text-emerald-700">{notice}</p>}
          </PortalCard>
        </div>
        <PortalCard className="h-fit p-5">
          <div className="flex items-center justify-between"><h2 className="flex items-center gap-2 text-sm font-semibold uppercase text-[#0649ad]"><History className="size-5" /> Recent Uploads</h2><span className="text-xs">Last 30 Days</span></div>
          <div className="mt-5 space-y-3">
            {recentUploads.map(({ name, date, status, icon: Icon }) => <article className="flex items-center gap-3 rounded-lg border border-[#c5cad8] bg-[#f9f9ff] p-3" key={name}><span className="grid size-12 shrink-0 place-items-center bg-[#a7ead4]"><Icon className="size-5 text-emerald-800" /></span><div className="min-w-0"><h3 className="break-all text-sm font-semibold">{name}</h3><div className="mt-1 flex items-center gap-2"><span className={`px-2 py-1 text-[9px] font-semibold uppercase ${status === "Verified" ? "bg-[#9df2c8] text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{status}</span><span className="text-xs text-[#4c5261]">{date}</span></div></div></article>)}
          </div>
          <p className="mt-6 flex gap-2 rounded-lg bg-[#eef2ff] p-3 text-xs text-[#4c5261]"><Info className="size-5 shrink-0 text-[#0649ad]" />Our clinical team reviews all medical files within 4 hours during business days.</p>
        </PortalCard>
      </div>
      <section className="mt-8 flex flex-col gap-5 rounded-2xl bg-[#263449] p-6 text-white sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-semibold">Need help with document digitization?</h2><p className="mt-2 max-w-xl text-[#c7cfdd]">Use our mobile app to scan prescriptions directly. Smart OCR will extract medication names and dosages.</p></div><button className="flex shrink-0 items-center gap-2 rounded-xl bg-[#dce4ff] px-5 py-3 font-semibold text-[#111c2c]" type="button"><Smartphone className="size-5" /> Get App</button></section>
    </div>
  );
};

const FileUpIcon = () => <span className="grid size-5 place-items-center border border-[#0649ad] text-xs">↥</span>;

export default ClientMedicationUpload;
