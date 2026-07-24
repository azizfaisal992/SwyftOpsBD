import {
  Archive,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  File,
  FileImage,
  FileText,
  Filter,
  Folder,
  FolderOpen,
  HardDrive,
  MoreHorizontal,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UploadCloud,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { adminAccount } from "../../data/adminPortalData";

const folders = [
  { name: "All Documents", count: 288 },
  { name: "Caregiver IDs", count: 142 },
  { name: "Client Contracts", count: 89 },
  { name: "Incident Reports", count: 34 },
  { name: "Compliance", count: 51 },
  { name: "Tax Documents", count: 12 },
];

const initialDocuments = [
  { id: 1, name: "NID_Front_Rahima_Khatun.pdf", owner: "Rahima Khatun", ownerId: "CR-88294", folder: "Caregiver IDs", type: "PDF", size: "1.4 MB", uploaded: "Oct 22, 2026", status: "Verified", sensitive: true },
  { id: 2, name: "Service_Agreement_Abdul_Karim.docx", owner: "Abdul Karim", ownerId: "CL-90234", folder: "Client Contracts", type: "WORD", size: "420 KB", uploaded: "Oct 21, 2026", status: "Pending", sensitive: false },
  { id: 3, name: "Incident_Photo_VS-88219.jpg", owner: "System Admin", ownerId: "VS-88219", folder: "Incident Reports", type: "IMAGE", size: "3.1 MB", uploaded: "Oct 20, 2026", status: "Rejected", sensitive: true },
  { id: 4, name: "Annual_Tax_Summary_2025.pdf", owner: "Finance Office", ownerId: "FIN-2025", folder: "Tax Documents", type: "PDF", size: "850 KB", uploaded: "Oct 18, 2026", status: "Verified", sensitive: true },
  { id: 5, name: "BLS_Certification_Farhana.pdf", owner: "Farhana Akhter", ownerId: "CR-77120", folder: "Compliance", type: "PDF", size: "980 KB", uploaded: "Oct 16, 2026", status: "Expiring", sensitive: false },
  { id: 6, name: "Home_Care_Consent_Nasrin.pdf", owner: "Nasrin Sultana", ownerId: "CL-2180", folder: "Client Contracts", type: "PDF", size: "1.1 MB", uploaded: "Oct 15, 2026", status: "Verified", sensitive: true },
];

const statusStyles = {
  Verified: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Rejected: "bg-red-100 text-red-700",
  Expiring: "bg-orange-100 text-orange-700",
};

const AdminDocuments = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [folder, setFolder] = useState("All Documents");
  const [status, setStatus] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest");
  const [selected, setSelected] = useState(new Set());
  const [preview, setPreview] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const visibleDocuments = useMemo(() => {
    const result = documents.filter((document) => {
      const matchesFolder = folder === "All Documents" || document.folder === folder;
      const matchesStatus = status === "All" || document.status === status;
      const text = `${document.name} ${document.owner} ${document.ownerId}`.toLowerCase();
      return matchesFolder && matchesStatus && text.includes(query.toLowerCase());
    });
    return [...result].sort((a, b) => sort === "Name" ? a.name.localeCompare(b.name) : sort === "Largest" ? parseFloat(b.size) - parseFloat(a.size) : b.id - a.id);
  }, [documents, folder, query, sort, status]);

  const flash = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const toggleDocument = (id) => setSelected((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const toggleAll = () => setSelected((current) => current.size === visibleDocuments.length ? new Set() : new Set(visibleDocuments.map((item) => item.id)));

  const archiveSelected = () => {
    setDocuments((current) => current.filter((document) => !selected.has(document.id)));
    flash(`${selected.size} document${selected.size === 1 ? "" : "s"} archived from this view.`);
    setSelected(new Set());
  };

  const addDocument = (document) => {
    setDocuments((current) => [{ ...document, id: Date.now(), uploaded: "Today", status: "Pending" }, ...current]);
    setUploadOpen(false);
    setFolder("All Documents");
    flash("Document added to the pending verification queue.");
  };

  return (
    <div className="relative h-[calc(100vh-64px)] min-h-[560px] overflow-hidden bg-[#f4f7fc] lg:h-screen lg:min-h-[620px]">
      {notice && <div className="absolute left-1/2 top-3 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm whitespace-nowrap text-white shadow-xl"><Check className="size-4" />{notice}</div>}

      <header className="hidden h-16 items-center border-b border-[#c9cfdd] bg-white px-6 lg:flex">
        <h1 className="text-xl font-semibold">Documents Management</h1>
        <label className="ml-auto flex w-64 items-center gap-2 rounded-xl border border-[#c5cad8] bg-[#f7f8fc] px-3 py-2.5 text-[#687184]"><Search className="size-4" /><input className="min-w-0 flex-1 bg-transparent text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search everywhere..." /></label>
        <button className="relative ml-5 p-2" type="button" onClick={() => flash("No new document alerts.")} aria-label="Notifications"><ShieldCheck className="size-5" /><span className="absolute right-1 top-1 size-2 rounded-full bg-emerald-500" /></button>
        <div className="ml-3 flex items-center gap-2 border-l border-[#c9cfdd] pl-4"><span><b className="block text-sm">Admin User</b><small className="text-[#687184]">Document Control</small></span><img className="size-9 rounded-full object-cover" src={adminAccount.image} alt="" /></div>
      </header>

      <div className="flex h-full min-w-0 flex-col lg:h-[calc(100%-64px)]">
        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="border-b border-[#c9cfdd] bg-white p-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.12em] text-[#687184]">Folders</p>
            <div className="hide-scrollbar mb-4 flex w-full gap-2 overflow-x-auto pb-1">
              {folders.map((item) => (
                <button
                  className={`flex min-w-[165px] flex-1 shrink-0 items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-xs font-semibold xl:min-w-0 ${folder === item.name ? "border-[#0755b7] bg-[#eaf2ff] text-[#0755b7]" : "border-[#d1d7e2] bg-white text-[#515867] hover:bg-[#f7f9fc]"}`}
                  type="button"
                  key={item.name}
                  onClick={() => {
                    setFolder(item.name);
                    setSelected(new Set());
                  }}
                >
                  <Folder className="size-4 shrink-0" />
                  <span className="flex-1">{item.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] ${folder === item.name ? "bg-[#0755b7] text-white" : "bg-[#e8eaf0]"}`}>
                    {item.count}
                  </span>
                </button>
              ))}
              <div className="flex min-w-[180px] flex-1 shrink-0 items-center gap-3 rounded-lg border border-[#d1d7e2] bg-[#f4f6fb] px-3 py-2.5 xl:min-w-0">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-100 text-[#0755b7]"><HardDrive className="size-4" /></span>
                <span className="min-w-0 flex-1"><span className="flex text-[9px] font-semibold uppercase"><span>Storage</span><b className="ml-auto text-[#0755b7]">65%</b></span><span className="mt-1.5 block h-1 rounded bg-[#c9cfdd]"><i className="block h-full w-[65%] rounded bg-[#0755b7]" /></span></span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="flex min-w-[200px] flex-1 items-center gap-2 rounded-lg border border-[#c5cad8] bg-[#f8f9fd] px-3 py-2.5 text-[#687184]"><Search className="size-4" /><input className="min-w-0 flex-1 bg-transparent text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by filename or owner..." /></label>
              <label className="flex items-center gap-2 rounded-lg border border-[#c5cad8] bg-white px-3 text-sm"><SlidersHorizontal className="size-4" /><select className="bg-transparent py-2.5 outline-none" value={sort} onChange={(event) => setSort(event.target.value)}><option>Newest</option><option>Name</option><option>Largest</option></select><ChevronDown className="size-3" /></label>
              <label className="flex items-center gap-2 rounded-lg border border-[#c5cad8] bg-white px-3 text-sm"><Filter className="size-4" /><select className="bg-transparent py-2.5 outline-none" value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option><option>Verified</option><option>Pending</option><option>Rejected</option><option>Expiring</option></select></label>
              <button className="flex items-center justify-center gap-2 rounded-lg bg-[#1265c4] px-5 py-2.5 text-sm font-semibold text-white shadow" type="button" onClick={() => setUploadOpen(true)}><UploadCloud className="size-4" />Upload File</button>
            </div>
            {selected.size > 0 && <div className="mt-3 flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-[#0755b7]"><b>{selected.size} selected</b><button className="ml-auto flex items-center gap-1 font-semibold text-red-700" type="button" onClick={archiveSelected}><Archive className="size-4" />Archive</button></div>}
          </div>

          <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <section className="hidden overflow-hidden rounded-xl border border-[#c5cad8] bg-white md:block">
              <table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-[#f0f2f9] text-[10px] uppercase tracking-[.08em] text-[#515867]"><tr><th className="w-12 px-4 py-4"><input type="checkbox" checked={visibleDocuments.length > 0 && selected.size === visibleDocuments.length} onChange={toggleAll} /></th><th className="px-3 py-4">Name</th><th className="px-3 py-4">Owner</th><th className="px-3 py-4">Folder</th><th className="px-3 py-4">Type</th><th className="px-3 py-4">Size</th><th className="px-3 py-4">Uploaded</th><th className="px-3 py-4">Status</th><th className="px-4 py-4 text-right">Actions</th></tr></thead><tbody>{visibleDocuments.map((document) => <DocumentRow document={document} checked={selected.has(document.id)} key={document.id} onCheck={() => toggleDocument(document.id)} onPreview={() => setPreview(document)} onAction={flash} />)}</tbody></table>
              <Pagination count={visibleDocuments.length} />
            </section>

            <section className="grid gap-3 md:hidden">{visibleDocuments.map((document) => <DocumentCard document={document} checked={selected.has(document.id)} key={document.id} onCheck={() => toggleDocument(document.id)} onPreview={() => setPreview(document)} />)}<Pagination count={visibleDocuments.length} /></section>
            {!visibleDocuments.length && <div className="rounded-xl border border-dashed bg-white p-12 text-center"><FolderOpen className="mx-auto size-10 text-[#8b93a3]" /><b className="mt-3 block">No documents found</b><p className="text-sm text-[#687184]">Try changing the folder, status, or search terms.</p></div>}
          </div>
        </main>
      </div>

      {preview && <PreviewDrawer document={preview} onClose={() => setPreview(null)} onAction={flash} />}
      {uploadOpen && <UploadModal defaultFolder={folder} onClose={() => setUploadOpen(false)} onUpload={addDocument} />}
    </div>
  );
};

const DocumentIcon = ({ type }) => { const Icon = type === "IMAGE" ? FileImage : type === "WORD" ? FileText : File; const color = type === "IMAGE" ? "text-purple-600 bg-purple-50" : type === "WORD" ? "text-blue-600 bg-blue-50" : "text-red-600 bg-red-50"; return <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${color}`}><Icon className="size-5" /></span>; };

const DocumentRow = ({ checked, document, onAction, onCheck, onPreview }) => <tr className="border-t border-[#dde1ea] hover:bg-[#fafbfe]"><td className="px-4 py-4"><input type="checkbox" checked={checked} onChange={onCheck} /></td><td className="px-3 py-4"><div className="flex items-center gap-3"><DocumentIcon type={document.type} /><button className="max-w-[260px] truncate font-medium hover:text-[#0755b7]" type="button" onClick={onPreview}>{document.name}</button>{document.sensitive && <ShieldCheck className="size-3.5 text-emerald-600" />}</div></td><td className="px-3 py-4"><b className="block text-xs">{document.owner}</b><small className="text-[#687184]">{document.ownerId}</small></td><td className="px-3 py-4 text-xs">{document.folder}</td><td className="px-3 py-4"><span className="rounded bg-[#e8eaf0] px-2 py-1 text-[9px] font-semibold">{document.type}</span></td><td className="px-3 py-4 text-[#515867]">{document.size}</td><td className="px-3 py-4 text-[#515867]">{document.uploaded}</td><td className="px-3 py-4"><Status status={document.status} /></td><td className="px-4 py-4"><div className="flex justify-end gap-1"><IconButton icon={Eye} label="Preview" onClick={onPreview} /><IconButton icon={Download} label="Download" onClick={() => onAction(`${document.name} download is ready for backend storage integration.`)} /><IconButton icon={MoreHorizontal} label="More" onClick={() => onAction(`More actions opened for ${document.name}.`)} /></div></td></tr>;

const DocumentCard = ({ checked, document, onCheck, onPreview }) => <article className="rounded-xl border border-[#c5cad8] bg-white p-4"><div className="flex items-start gap-3"><input className="mt-3" type="checkbox" checked={checked} onChange={onCheck} /><DocumentIcon type={document.type} /><div className="min-w-0 flex-1"><button className="block max-w-full truncate text-left text-sm font-semibold text-[#0755b7]" type="button" onClick={onPreview}>{document.name}</button><small className="text-[#687184]">{document.owner} · {document.ownerId}</small></div><Status status={document.status} /></div><div className="mt-4 grid grid-cols-3 rounded-lg bg-[#f4f6fb] p-3 text-xs"><span><small className="block text-[#687184]">Folder</small>{document.folder}</span><span><small className="block text-[#687184]">Type / Size</small>{document.type} · {document.size}</span><span><small className="block text-[#687184]">Uploaded</small>{document.uploaded}</span></div></article>;

const Status = ({ status }) => <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-semibold ${statusStyles[status]}`}><i className="size-1.5 rounded-full bg-current" />{status}</span>;
const IconButton = ({ icon: Icon, label, onClick }) => <button className="grid size-8 place-items-center rounded text-[#0755b7] hover:bg-blue-50" type="button" title={label} aria-label={label} onClick={onClick}><Icon className="size-4" /></button>;
const Pagination = ({ count }) => <footer className="flex items-center border-t border-[#c5cad8] bg-[#f4f6fb] px-4 py-3 text-xs text-[#515867] md:col-span-full"><span>Showing {count} of 288 documents</span><div className="ml-auto flex items-center gap-1"><button type="button"><ChevronLeft className="size-4" /></button><b className="grid size-7 place-items-center rounded bg-[#0755b7] text-white">1</b><button className="grid size-7 place-items-center" type="button">2</button><button className="grid size-7 place-items-center" type="button">3</button><button type="button"><ChevronRight className="size-4" /></button></div></footer>;

const PreviewDrawer = ({ document, onAction, onClose }) => <div className="fixed inset-0 z-[70] bg-slate-950/35" onClick={onClose}><aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}><header className="flex items-center border-b p-5"><div><h2 className="font-semibold">Document Details</h2><p className="text-xs text-[#687184]">Secure metadata and verification</p></div><button className="ml-auto" type="button" onClick={onClose}><X className="size-5" /></button></header><div className="flex-1 space-y-5 overflow-y-auto p-5"><section className="grid min-h-52 place-items-center rounded-xl border border-dashed bg-[#f4f6fb]"><div className="text-center"><DocumentIcon type={document.type} /><b className="mt-3 block max-w-xs break-all text-sm">{document.name}</b><small className="text-[#687184]">Preview provided by secure storage</small></div></section><dl className="grid grid-cols-2 gap-4 rounded-xl border p-4 text-sm"><Meta label="Owner" value={`${document.owner} (${document.ownerId})`} /><Meta label="Folder" value={document.folder} /><Meta label="Type" value={document.type} /><Meta label="Size" value={document.size} /><Meta label="Uploaded" value={document.uploaded} /><Meta label="Status" value={document.status} /></dl><section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"><b className="flex items-center gap-2 text-sm text-emerald-800"><ShieldCheck className="size-5" />Security & retention</b><p className="mt-2 text-xs leading-5 text-emerald-800">Encrypted document. Access is logged and restricted by administrative role. Retention review is due in 24 months.</p></section></div><footer className="grid grid-cols-2 gap-2 border-t p-4"><button className="rounded-lg border px-4 py-3 text-sm font-semibold" type="button" onClick={() => onAction(`${document.name} sent to verification review.`)}>Send to Review</button><button className="flex items-center justify-center gap-2 rounded-lg bg-[#0755b7] px-4 py-3 text-sm font-semibold text-white" type="button" onClick={() => onAction(`${document.name} download is ready for backend integration.`)}><Download className="size-4" />Download</button></footer></aside></div>;

const Meta = ({ label, value }) => <div><dt className="text-[10px] font-semibold uppercase text-[#687184]">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>;

const UploadModal = ({ defaultFolder, onClose, onUpload }) => {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [owner, setOwner] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [folder, setFolder] = useState(defaultFolder === "All Documents" ? "Caregiver IDs" : defaultFolder);
  const submit = (event) => { event.preventDefault(); if (!file) return; const extension = file.name.split(".").pop()?.toUpperCase(); onUpload({ name: file.name, owner, ownerId, folder, type: ["JPG", "JPEG", "PNG"].includes(extension) ? "IMAGE" : extension === "DOCX" ? "WORD" : "PDF", size: file.size > 1048576 ? `${(file.size / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`, sensitive: true }); };
  return <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/50 p-4"><form className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6" onSubmit={submit}><header className="flex"><div><h2 className="text-xl font-semibold">Upload Document</h2><p className="text-sm text-[#687184]">PDF, DOCX, JPG or PNG · maximum 10 MB</p></div><button className="ml-auto" type="button" onClick={onClose}><X className="size-5" /></button></header><button className="mt-5 grid min-h-36 w-full place-items-center rounded-xl border-2 border-dashed border-[#aeb8ca] bg-[#f8faff] p-4 text-center" type="button" onClick={() => inputRef.current?.click()}><span><UploadCloud className="mx-auto size-8 text-[#0755b7]" /><b className="mt-2 block text-sm">{file ? file.name : "Choose a document to upload"}</b><small className="text-[#687184]">Files are scanned before entering verification</small></span></button><input className="hidden" ref={inputRef} type="file" accept=".pdf,.docx,.jpg,.jpeg,.png" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /><div className="mt-4 grid gap-3 sm:grid-cols-2"><Field label="Owner name"><input required value={owner} onChange={(event) => setOwner(event.target.value)} placeholder="Document owner" /></Field><Field label="Owner ID"><input required value={ownerId} onChange={(event) => setOwnerId(event.target.value)} placeholder="CR- or CL- number" /></Field><Field label="Folder"><select value={folder} onChange={(event) => setFolder(event.target.value)}>{folders.slice(1).map((item) => <option key={item.name}>{item.name}</option>)}</select></Field><Field label="Access classification"><select><option>Restricted</option><option>Internal</option><option>Finance only</option></select></Field></div><footer className="mt-5 flex justify-end gap-2"><button className="rounded-lg border px-4 py-2.5 text-sm font-semibold" type="button" onClick={onClose}>Cancel</button><button className="rounded-lg bg-[#0755b7] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50" type="submit" disabled={!file}>Upload for Review</button></footer></form></div>;
};

const Field = ({ children, label }) => <label className="text-sm font-semibold">{label}<span className="mt-1 block [&>*]:w-full [&>*]:rounded-lg [&>*]:border [&>*]:border-[#c5cad8] [&>*]:px-3 [&>*]:py-2.5 [&>*]:font-normal [&>*]:outline-none">{children}</span></label>;

export default AdminDocuments;
