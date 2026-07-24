import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
  Filter,
  MapPin,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Star,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { adminCaregivers } from "../../data/adminPortalData";

const AdminCaregivers = () => {
  const [caregivers, setCaregivers] = useState(adminCaregivers);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(
    () =>
      caregivers.filter((caregiver) => {
        const matchesQuery = `${caregiver.name} ${caregiver.phone}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesStatus =
          status === "all" ||
          (status === "active" ? caregiver.active : !caregiver.active);
        return matchesQuery && matchesStatus;
      }),
    [caregivers, query, status],
  );

  const toggleStatus = (id) =>
    setCaregivers((items) =>
      items.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item,
      ),
    );

  return (
    <div className="mx-auto max-w-[1280px] p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-xl font-semibold">Caregivers (1,203)</h1>
          <p className="mt-1 text-sm text-[#515867]">
            Manage, verify, and monitor your caregiver workforce across
            Bangladesh.
          </p>
        </div>
        <div className="flex gap-2 sm:ml-auto">
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#0755d3] bg-white px-4 py-2.5 text-sm font-semibold text-[#0649ad]"
            type="button"
          >
            <Download className="size-4" /> Export CSV
          </button>
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0755d3] px-4 py-2.5 text-sm font-semibold text-white"
            type="button"
          >
            <Plus className="size-4" /> Add Caregiver
          </button>
        </div>
      </div>

      <section className="mt-5 grid gap-3 rounded-xl border border-[#c5cad8] bg-white p-4 sm:grid-cols-2 lg:grid-cols-[1fr_180px_180px_auto] lg:items-end">
        <label className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#606878] lg:hidden">
          Search
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#c5cad8] bg-[#f8f9ff] px-3">
            <Search className="size-4" />
            <input
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name or phone"
            />
          </div>
        </label>
        <label className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#606878]">
          Status
          <select
            className="mt-2 block w-full rounded-lg border border-[#c5cad8] bg-[#f8f9ff] px-3 py-2.5 text-sm font-normal normal-case outline-none"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
        <label className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#606878]">
          Verification
          <select className="mt-2 block w-full rounded-lg border border-[#c5cad8] bg-[#f8f9ff] px-3 py-2.5 text-sm font-normal normal-case outline-none">
            <option>All</option>
            <option>Clear</option>
            <option>Pending</option>
            <option>Flagged</option>
          </select>
        </label>
        <label className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#606878]">
          Service Zone
          <select className="mt-2 block w-full rounded-lg border border-[#c5cad8] bg-[#f8f9ff] px-3 py-2.5 text-sm font-normal normal-case outline-none">
            <option>All Zones</option>
            <option>Dhaka North</option>
            <option>Dhaka South</option>
          </select>
        </label>
        <button
          className="flex items-center justify-center gap-2 py-2.5 text-sm text-[#515867]"
          type="button"
        >
          <Filter className="size-4" /> Advanced Filters
        </button>
      </section>

      <section className="mt-5 hidden overflow-hidden rounded-xl border border-[#c5cad8] bg-white md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-[#c5cad8] bg-[#f0f2fa] text-[#606878]">
              <tr>
                <th className="px-5 py-4">Caregiver</th>
                <th className="px-4 py-4">Phone Number</th>
                <th className="px-4 py-4">NID Status</th>
                <th className="px-4 py-4">Verification</th>
                <th className="px-4 py-4">Trust Score</th>
                <th className="px-4 py-4">Clients</th>
                <th className="px-4 py-4">Rating</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((caregiver) => (
                <CaregiverRow
                  caregiver={caregiver}
                  key={caregiver.id}
                  onOpen={() => setSelected(caregiver)}
                  onToggle={() => toggleStatus(caregiver.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center border-t border-[#c5cad8] bg-[#f7f8fd] px-5 py-4 text-sm text-[#515867]">
          <span>Showing 1–{filtered.length} of 1,203 caregivers</span>
          <div className="ml-auto flex gap-2">
            <button
              className="grid size-8 place-items-center rounded bg-[#0755d3] text-white"
              type="button"
            >
              1
            </button>
            <button className="size-8" type="button">
              2
            </button>
            <button className="size-8" type="button">
              3
            </button>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-3 md:hidden">
        {filtered.map((caregiver) => (
          <CaregiverMobileCard
            caregiver={caregiver}
            key={caregiver.id}
            onOpen={() => setSelected(caregiver)}
            onToggle={() => toggleStatus(caregiver.id)}
          />
        ))}
      </div>

      <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Summary
          label="Highly Rated"
          value="842"
          note="↑ 4.2% from last month"
        />
        <Summary label="Active Now" value="156" note="Live service sessions" />
        <Summary
          label="Pending Verification"
          value="48"
          note="Awaiting NID approval"
        />
        <Summary
          label="Service Alerts"
          value="03"
          note="Immediate attention required"
          danger
        />
      </section>

      {selected && (
        <VerificationDrawer
          caregiver={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

const CaregiverRow = ({ caregiver, onOpen, onToggle }) => (
  <tr className="border-b border-[#d7dbe7] last:border-0">
    <td className="px-5 py-4">
      <button
        className="flex items-center gap-3 text-left"
        type="button"
        onClick={onOpen}
      >
        <img
          className="size-10 rounded-full object-cover"
          src={caregiver.image}
          alt=""
        />
        <span>
          <b className="block">{caregiver.name}</b>
          <small className="text-[#606878]">Professional Caregiver</small>
        </span>
      </button>
    </td>
    <td className="px-4 py-4">{caregiver.phone}</td>
    <td className="px-4 py-4">
      <StatusBadge value={caregiver.nid} />
    </td>
    <td className="px-4 py-4">
      <StatusBadge value={caregiver.verification} />
    </td>
    <td className="px-4 py-4">
      <b>{caregiver.trust}%</b>
      <span className="mt-2 block h-1.5 w-20 rounded bg-[#eef0f7]">
        <span
          className={`block h-full rounded ${caregiver.trust > 70 ? "bg-[#0755d3]" : caregiver.trust > 30 ? "bg-amber-500" : "bg-red-500"}`}
          style={{ width: `${caregiver.trust}%` }}
        />
      </span>
    </td>
    <td className="px-4 py-4 font-semibold">{caregiver.clients}</td>
    <td className="px-4 py-4">
      <Star className="mr-1 inline size-4 fill-amber-400 text-amber-400" />
      {caregiver.rating}
    </td>
    <td className="px-4 py-4">
      <Toggle active={caregiver.active} onClick={onToggle} />
    </td>
    <td className="px-4 py-4">
      <button
        className="font-semibold text-[#0649ad]"
        type="button"
        onClick={onOpen}
      >
        Review
      </button>
    </td>
  </tr>
);

const CaregiverMobileCard = ({ caregiver, onOpen, onToggle }) => (
  <article className="rounded-xl border border-[#c5cad8] bg-white p-4">
    <div className="flex items-start gap-3">
      <img
        className="size-12 rounded-full object-cover"
        src={caregiver.image}
        alt=""
      />
      <div className="min-w-0 flex-1">
        <b className="block">{caregiver.name}</b>
        <p className="text-xs text-[#606878]">{caregiver.phone}</p>
      </div>
      <Toggle active={caregiver.active} onClick={onToggle} />
    </div>
    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
      <Metric label="Trust" value={`${caregiver.trust}%`} />
      <Metric label="Clients" value={caregiver.clients} />
      <Metric label="Rating" value={`★ ${caregiver.rating}`} />
    </div>
    <div className="mt-4 flex items-center gap-2">
      <StatusBadge value={caregiver.verification} />
      <button
        className="ml-auto rounded-lg bg-[#0755d3] px-4 py-2 text-xs font-semibold text-white"
        type="button"
        onClick={onOpen}
      >
        Review
      </button>
    </div>
  </article>
);

const caregiverTabs = ["Profile", "Verification", "Assignments", "Payments"];

const VerificationDrawer = ({ caregiver, onClose }) => {
  const [activeTab, setActiveTab] = useState("Verification");

  return (
  <>
    <button
      className="fixed inset-0 z-40 bg-slate-950/45"
      type="button"
      onClick={onClose}
      aria-label="Close caregiver verification"
    />
    <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[430px] flex-col bg-[#f7f8fd] shadow-2xl">
      <header className="flex items-start gap-4 border-b border-[#c5cad8] bg-white p-5">
        <img
          className="size-16 rounded-xl object-cover ring-2 ring-[#0755d3]"
          src={caregiver.image}
          alt=""
        />
        <div className="min-w-0">
          <b className="block text-lg">{caregiver.name}</b>
          <p className="text-sm text-[#515867]">
            Professional Caregiver • #{caregiver.id.toUpperCase()}
          </p>
          <div className="mt-2 flex gap-2">
            <StatusBadge value="Verified since Oct 2022" />
            <b className="text-xs text-[#0649ad]">
              {caregiver.trust}% Trust Score
            </b>
          </div>
        </div>
        <button className="ml-auto" type="button" onClick={onClose}>
          <X className="size-6" />
        </button>
      </header>
      <nav className="hide-scrollbar flex gap-2 overflow-x-auto border-b border-[#c5cad8] bg-white px-5">
        {caregiverTabs.map((tab) => (
          <button
            className={`whitespace-nowrap border-b-2 px-2 py-4 text-sm transition duration-200 hover:scale-105 hover:font-semibold hover:text-[#0755d3] ${activeTab === tab ? "border-[#0755d3] font-semibold text-[#0649ad]" : "border-transparent text-[#515867]"}`}
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {activeTab === "Verification" && <>
        <VerificationCard
          title="Background Check"
          status="Clear"
          detail="Federal Screening Passed"
          sub="Sex Offender Registry clear • Source: Checkr Inc."
        />
        <VerificationCard
          title="Identity Verification"
          status="Verified"
          detail="Biometric scan successful"
          sub="NID & Face Match Confirmed"
        />
        <VerificationCard
          title="Credentials & Certs"
          status="Re-certify soon"
          detail="CNA License expires in 45 days"
          sub="License #CNA-99283-BD"
        />
        <h3 className="pt-3 uppercase text-[#737b8c]">Verification History</h3>
        <p className="border-l-2 border-emerald-300 pl-4">
          <b>Oct 12: NID Verified</b>
          <small className="block text-[#606878]">
            Automated biometric verification successful.
          </small>
        </p>
        <p className="border-l-2 border-blue-300 pl-4">
          <b>Oct 10: Background Check Initiated</b>
          <small className="block text-[#606878]">
            Request sent to verification API.
          </small>
        </p>
        </>}
        {activeTab === "Profile" && <CaregiverProfilePanel caregiver={caregiver} />}
        {activeTab === "Assignments" && <CaregiverAssignmentsPanel caregiver={caregiver} />}
        {activeTab === "Payments" && <CaregiverPaymentsPanel />}
      </div>
      <CaregiverDrawerFooter activeTab={activeTab} />
    </aside>
  </>
  );
};

const CaregiverProfilePanel = ({ caregiver }) => (
  <div className="space-y-5">
    <section className="rounded-xl border border-[#c5cad8] bg-white p-4">
      <h3 className="flex items-center gap-2 font-semibold"><UserRound className="size-5 text-[#0755d3]" /> Professional Profile</h3>
      <dl className="mt-5 grid grid-cols-2 gap-5"><ProfileMetric label="Experience" value="8 Years" /><ProfileMetric label="Care Level" value="Senior" /><ProfileMetric label="Language" value="Bengali, English" /><ProfileMetric label="Availability" value="Full-time" /></dl>
    </section>
    <section className="rounded-xl border border-[#c5cad8] bg-white p-4">
      <h3 className="font-semibold">Contact & Service Zone</h3>
      <p className="mt-4 flex items-center gap-3 text-sm"><Phone className="size-4 text-[#0755d3]" /> {caregiver.phone}</p>
      <p className="mt-3 flex items-center gap-3 text-sm"><MapPin className="size-4 text-[#0755d3]" /> Dhaka North • Gulshan, Banani</p>
    </section>
    <section className="rounded-xl border border-[#c5cad8] bg-white p-4"><h3 className="font-semibold">Specializations</h3><div className="mt-4 flex flex-wrap gap-2">{["Post-Op Care", "Elder Care", "Medication", "Mobility"].map((item) => <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-[#0649ad]" key={item}>{item}</span>)}</div></section>
    <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"><div className="flex items-center gap-3"><ShieldCheck className="size-6 text-emerald-700" /><div><b className="block">Account in good standing</b><small className="text-emerald-800">No active complaints or compliance actions.</small></div></div></section>
  </div>
);

const CaregiverAssignmentsPanel = ({ caregiver }) => (
  <div className="space-y-5">
    <div className="grid grid-cols-2 gap-3"><AssignmentMetric label="Active Clients" value={caregiver.clients} /><AssignmentMetric label="Visits This Month" value="42" /></div>
    <section><div className="flex items-center"><h3 className="font-semibold">Current Assignments</h3><button className="ml-auto text-xs font-semibold text-[#0649ad]" type="button">View Schedule</button></div><Assignment name="Abdul Karim" care="Post-Op Recovery" schedule="Mon, Wed, Fri • 09:00 AM" status="On duty" /><Assignment name="Nasrin Begum" care="Dementia Care" schedule="Tue, Thu • 02:30 PM" status="Confirmed" /><Assignment name="Jahanara Begum" care="Medication Support" schedule="Daily • 06:00 PM" status="Confirmed" /></section>
    <section className="rounded-xl border border-amber-200 bg-amber-50 p-4"><div className="flex gap-3"><CalendarDays className="size-5 shrink-0 text-amber-700" /><p><b className="block">Schedule capacity</b><small className="text-amber-800">Available for one additional weekly assignment.</small></p></div></section>
  </div>
);

const CaregiverPaymentsPanel = () => (
  <div className="space-y-5">
    <section className="rounded-xl bg-[#0755d3] p-5 text-white"><div className="flex items-start"><div><small className="uppercase text-blue-100">Available Earnings</small><b className="mt-2 block text-3xl">৳8,200</b></div><WalletCards className="ml-auto size-8 text-blue-200" /></div><button className="mt-5 w-full rounded-lg bg-white py-2.5 font-semibold text-[#0649ad]" type="button">Process Payout</button></section>
    <div className="grid grid-cols-2 gap-3"><AssignmentMetric label="This Month" value="৳18,000" /><AssignmentMetric label="Lifetime" value="৳45,500" /></div>
    <section><h3 className="font-semibold">Recent Payments</h3><CaregiverTransaction title="Shift Payment - Abdul" date="Jul 20, 2026" amount="+ ৳800" /><CaregiverTransaction title="Withdrawal to bKash" date="Jul 18, 2026" amount="- ৳5,000" /><CaregiverTransaction title="Shift Payment - Nasrin" date="Jul 17, 2026" amount="+ ৳1,200" /></section>
    <section className="rounded-xl border border-[#c5cad8] bg-white p-4"><h3 className="font-semibold">Payment Method</h3><div className="mt-4 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-pink-600 text-xs font-bold text-white">bK</span><div><b className="block">bKash Account</b><small className="text-[#606878]">**** 4321 • Verified</small></div><CheckCircle2 className="ml-auto size-5 text-emerald-600" /></div></section>
  </div>
);

const CaregiverDrawerFooter = ({ activeTab }) => {
  const actions = activeTab === "Verification" ? ["Approve", "Reject", "Request Resubmission", "Add Note"] : activeTab === "Profile" ? ["Edit Profile", "Suspend Account"] : activeTab === "Assignments" ? ["Assign Client", "Open Schedule"] : ["Process Payout", "Payment History"];
  return <footer className="grid grid-cols-2 gap-3 border-t border-[#c5cad8] bg-white p-5">{actions.map((action, index) => <button className={`rounded-lg py-3 font-semibold ${activeTab === "Verification" && index === 0 ? "bg-emerald-600 text-white" : activeTab === "Verification" && index === 1 ? "bg-red-600 text-white" : index === 0 ? "bg-[#0755d3] text-white" : "border border-[#8c93a2]"}`} type="button" key={action}>{action}</button>)}</footer>;
};

const ProfileMetric = ({ label, value }) => <div><dt className="text-[10px] font-semibold uppercase text-[#606878]">{label}</dt><dd className="mt-2 font-medium">{value}</dd></div>;
const AssignmentMetric = ({ label, value }) => <article className="rounded-xl border border-[#c5cad8] bg-white p-4"><small className="uppercase text-[#606878]">{label}</small><b className="mt-2 block text-xl text-[#0649ad]">{value}</b></article>;
const Assignment = ({ name, care, schedule, status }) => <article className="mt-3 rounded-xl border border-[#c5cad8] bg-white p-4"><div className="flex items-center"><span className="grid size-10 place-items-center rounded-full bg-blue-100 font-semibold text-[#0649ad]">{name.slice(0, 1)}</span><div className="ml-3"><b className="block">{name}</b><small className="text-[#606878]">{care}</small></div><span className="ml-auto"><StatusBadge value={status} /></span></div><p className="mt-4 flex items-center gap-2 border-t border-[#e1e4ec] pt-3 text-xs text-[#515867]"><CalendarDays className="size-4" /> {schedule}</p></article>;
const CaregiverTransaction = ({ title, date, amount }) => <article className="mt-3 flex items-center gap-3 border-b border-[#e1e4ec] py-3 last:border-0"><span className="grid size-9 place-items-center rounded-lg bg-blue-100 text-[#0755d3]"><CreditCard className="size-4" /></span><div className="min-w-0 flex-1"><b className="block text-sm">{title}</b><small className="text-[#606878]">{date}</small></div><b className={`text-sm ${amount.startsWith("+") ? "text-emerald-700" : ""}`}>{amount}</b></article>;

const StatusBadge = ({ value }) => {
  const normalized = value.toLowerCase();
  const style = normalized.includes("flag")
    ? "bg-red-100 text-red-700"
    : normalized.includes("pending") || normalized.includes("certify")
      ? "bg-amber-100 text-amber-700"
      : "bg-emerald-100 text-emerald-700";
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-[9px] font-semibold uppercase ${style}`}
    >
      {value}
    </span>
  );
};
const Toggle = ({ active, onClick }) => (
  <button
    className={`relative h-6 w-11 rounded-full transition ${active ? "bg-emerald-500" : "bg-slate-300"}`}
    type="button"
    onClick={onClick}
    aria-label="Toggle caregiver status"
  >
    <span
      className={`absolute top-1 size-4 rounded-full bg-white transition ${active ? "left-6" : "left-1"}`}
    />
  </button>
);
const Metric = ({ label, value }) => (
  <div className="rounded-lg bg-[#f1f3fa] p-2">
    <small className="block text-[9px] uppercase text-[#606878]">{label}</small>
    <b className="text-sm">{value}</b>
  </div>
);
const Summary = ({ label, value, note, danger = false }) => (
  <article className="rounded-xl border border-[#c5cad8] bg-white p-4">
    <p className="text-xs uppercase text-[#737b8c]">{label}</p>
    <b className="mt-2 block text-xl">{value}</b>
    <small className={danger ? "text-red-600" : "text-[#606878]"}>{note}</small>
  </article>
);
const VerificationCard = ({ title, status, detail, sub }) => (
  <article className="rounded-xl border border-[#c5cad8] bg-white p-4">
    <div className="flex items-center">
      <p className="uppercase text-[#737b8c]">{title}</p>
      <span className="ml-auto">
        <StatusBadge value={status} />
      </span>
    </div>
    <b className="mt-3 block">{detail}</b>
    <small className="text-[#606878]">{sub}</small>
  </article>
);

export default AdminCaregivers;
