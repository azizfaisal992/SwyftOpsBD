import { BadgeCheck, CalendarClock, Check, ExternalLink, FileBadge, IdCard, Info, RefreshCw, SearchCheck, ShieldCheck } from "lucide-react";
import PortalCard from "../../../components/client/portal/PortalCard";
import { connectedCaregiver } from "../../../data/clientPortalData";

const ClientCaregiverVerification = () => (
  <div className="mx-auto max-w-[1050px] p-5 sm:p-7">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="flex items-center gap-3 text-3xl font-semibold"><ShieldCheck className="size-7 text-[#0649ad]" /> Caregiver Verification</h1>
      <button className="flex items-center justify-center gap-2 rounded-xl bg-[#dce8ff] px-5 py-3 text-sm font-semibold text-[#0649ad]" type="button"><RefreshCw className="size-5" /> Request Re-verification</button>
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-[310px_1fr]">
      <div className="space-y-6">
        <PortalCard className="p-6 text-center">
          <div className="relative mx-auto w-fit"><img className="size-32 rounded-xl border-4 border-emerald-400 object-cover" src={connectedCaregiver.image} alt={connectedCaregiver.name} /><span className="absolute bottom-1 right-1 grid size-7 place-items-center rounded-full border-2 border-white bg-emerald-500 text-white"><Check className="size-4" /></span></div>
          <h2 className="mt-5 text-2xl font-semibold">{connectedCaregiver.name}</h2><p className="font-semibold text-[#4c5261]">{connectedCaregiver.role}</p>
          <dl className="mt-7 space-y-4 text-sm">{[["Caregiver ID", `#${connectedCaregiver.id}`],["Verified Since",connectedCaregiver.verifiedSince],["Trust Score",`${connectedCaregiver.trustScore}%`]].map(([term,value]) => <div className="flex justify-between border-b border-[#d8dce7] pb-3" key={term}><dt className="font-semibold text-[#747b8a]">{term}</dt><dd className={`font-bold ${term === "Trust Score" ? "text-emerald-700" : ""}`}>{value}</dd></div>)}</dl>
        </PortalCard>
        <PortalCard className="p-6"><h2 className="font-semibold">Public Records &amp; Links</h2><div className="mt-4 space-y-3">{["Nursing License (NPI)","BLS Certification","Insurance Certificate"].map((label) => <a className="flex items-center gap-3 rounded border border-[#c5cad8] p-3 text-sm font-semibold" href="#record" key={label}><ShieldCheck className="size-5 text-[#0649ad]" /><span className="flex-1">{label}</span><ExternalLink className="size-4 text-[#747b8a]" /></a>)}</div></PortalCard>
      </div>
      <div className="space-y-6">
        <PortalCard className="p-6">
          <div className="flex items-start gap-4"><span className="grid size-12 place-items-center rounded-xl bg-[#9df2c8]"><SearchCheck className="size-7 text-emerald-800" /></span><div className="flex-1"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-semibold">Background Check</h2><span className="flex items-center gap-2 rounded-full bg-[#9df2c8] px-4 py-2 text-sm font-bold text-emerald-800"><BadgeCheck className="size-4" /> CLEAR</span></div><p className="font-semibold text-[#4c5261]">Annual comprehensive criminal history screening.</p></div></div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2"><VerificationBox title="Federal Screening" status="Passed" detail="Verified via Checkr Inc." /><VerificationBox title="Sex Offender Registry" status="No records found" detail="Verified via National Registry" /></div>
          <p className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#747b8a]"><Info className="size-4" /> Last updated on September 15, 2024. Next scheduled check: September 15, 2025.</p>
        </PortalCard>
        <div className="grid gap-6 sm:grid-cols-2">
          <PortalCard className="p-6"><div className="flex justify-between"><IdCard className="size-6 text-[#0649ad]" /><span className="rounded-full bg-[#9df2c8] px-3 py-1 text-[9px] font-semibold text-emerald-700">VERIFIED</span></div><h2 className="mt-5 text-lg font-semibold">Identity Verification</h2><p className="mt-3 font-semibold leading-6 text-[#4c5261]">State ID and facial recognition match confirmed during onboarding.</p><p className="mt-4 text-xs font-semibold text-emerald-700">✓ Biometric scan successful</p></PortalCard>
          <PortalCard className="p-6"><div className="flex justify-between"><FileBadge className="size-6 text-[#0649ad]" /><span className="rounded-full bg-amber-100 px-3 py-1 text-[9px] font-semibold text-amber-600">RE-CERTIFY SOON</span></div><h2 className="mt-5 text-lg font-semibold">Credentials &amp; Certs</h2><p className="mt-3 font-semibold leading-6 text-[#4c5261]">Validation of CNA license and healthcare compliance training.</p><p className="mt-4 flex items-center gap-2 text-xs font-semibold text-amber-600"><CalendarClock className="size-4" /> CNA License expires in 45 days</p></PortalCard>
        </div>
        <PortalCard className="p-6"><h2 className="text-2xl font-semibold">Verification History</h2><ol className="mt-6 space-y-6 border-l-2 border-[#dce8ff] pl-8">{[["Annual Background Check Completed","Sep 15, 2024 • No adverse findings recorded."],["HIPAA Compliance Training","Jan 12, 2024 • Re-certification module finished."],["Initial Identity Verification","Oct 02, 2022 • ID Verification and Facial Recognition."]].map(([title,detail],index) => <li className="relative" key={title}><span className={`absolute -left-[41px] top-1 size-4 rounded-full border-4 border-white ${index === 0 ? "bg-emerald-500" : "bg-[#6c7891]"}`} /><h3 className="font-semibold">{title}</h3><p className="mt-1 font-semibold text-[#4c5261]">{detail}</p></li>)}</ol></PortalCard>
      </div>
    </div>
  </div>
);

const VerificationBox = ({ title, status, detail }) => <div className="rounded border border-[#c5cad8] bg-[#f7f8fb] p-4"><h3 className="font-semibold uppercase tracking-[0.05em] text-[#747b8a]">{title}</h3><p className="mt-2 font-semibold">Status: {status}</p><p className="mt-3 font-semibold text-[#4c5261]">{detail}</p></div>;

export default ClientCaregiverVerification;
