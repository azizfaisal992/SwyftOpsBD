import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileText,
  HeartPulse,
  MapPin,
  Pill,
  Search,
  Upload,
  UserPlus,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import mapImage from "../../assets/find-care-map.jpg";
import { adminClients } from "../../data/adminPortalData";

const AdminClients = () => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [nidStatus, setNidStatus] = useState("All");
  const filtered = useMemo(
    () =>
      adminClients.filter((client) => {
        const searchable =
          `${client.name} ${client.phone} ${client.id} ${client.address}`.toLowerCase();
        return (
          searchable.includes(query.toLowerCase()) &&
          (nidStatus === "All" || client.nid === nidStatus)
        );
      }),
    [query, nidStatus],
  );

  return (
    <div className="mx-auto max-w-[1280px] p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-xl font-semibold">Clients (2,847)</h1>
          <p className="mt-1 text-sm text-[#515867]">
            Manage client information, care plans, and medical records.
          </p>
        </div>
        <button
          className="flex items-center justify-center gap-2 rounded-lg bg-[#0755d3] px-4 py-2.5 text-sm font-semibold text-white sm:ml-auto"
          type="button"
        >
          <UserPlus className="size-4" /> Add Client
        </button>
      </div>

      <section className="mt-5 grid gap-3 rounded-xl border border-[#c5cad8] bg-white p-4 sm:grid-cols-2 lg:grid-cols-[1fr_160px_180px_180px]">
        <label className="flex items-center gap-2 rounded-lg border border-[#c5cad8] bg-[#f8f9ff] px-3">
          <Search className="size-4" />
          <input
            className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, phone, NID, address..."
          />
        </label>
        <select className="rounded-lg border border-[#c5cad8] bg-[#f8f9ff] px-3 py-2.5 text-sm outline-none">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <select
          className="rounded-lg border border-[#c5cad8] bg-[#f8f9ff] px-3 py-2.5 text-sm outline-none"
          value={nidStatus}
          onChange={(event) => setNidStatus(event.target.value)}
        >
          <option>All</option>
          <option>Verified</option>
          <option>Pending</option>
        </select>
        <select className="rounded-lg border border-[#c5cad8] bg-[#f8f9ff] px-3 py-2.5 text-sm outline-none">
          <option>All Zones</option>
          <option>Dhaka North</option>
          <option>Dhaka South</option>
        </select>
      </section>

      <section className="mt-5 hidden overflow-hidden rounded-xl border border-[#c5cad8] bg-white md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b border-[#c5cad8] bg-[#f0f2fa] text-[#515867]">
              <tr>
                <th className="px-5 py-4">Client Name</th>
                <th className="px-5 py-4">Demographics</th>
                <th className="px-5 py-4">Contact</th>
                <th className="px-5 py-4">Address</th>
                <th className="px-5 py-4">NID</th>
                <th className="px-5 py-4">Care Plan</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr
                  className="border-b border-[#d7dbe7] last:border-0"
                  key={client.id}
                >
                  <td className="px-5 py-4">
                    <button
                      className="flex items-center gap-3 text-left"
                      type="button"
                      onClick={() => setSelected(client)}
                    >
                      <img
                        className="size-10 rounded-full object-cover"
                        src={client.image}
                        alt=""
                      />
                      <span>
                        <b className="block">{client.name}</b>
                        <small className="text-[#606878]">
                          ID: {client.id.toUpperCase()}
                        </small>
                      </span>
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    {client.age} yrs
                    <small className="block text-[#606878]">
                      {client.gender}
                    </small>
                  </td>
                  <td className="px-5 py-4">{client.phone}</td>
                  <td className="max-w-52 px-5 py-4 text-[#515867]">
                    {client.address}
                  </td>
                  <td className="px-5 py-4">
                    <Status value={client.nid} />
                  </td>
                  <td className="px-5 py-4">{client.carePlan}</td>
                  <td className="px-5 py-4">
                    <button
                      className="font-semibold text-[#0649ad]"
                      type="button"
                      onClick={() => setSelected(client)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-[#c5cad8] bg-[#f7f8fd] px-5 py-4 text-sm text-[#515867]">
          Showing 1–{filtered.length} of 2,847 results
        </div>
      </section>

      <div className="mt-5 grid gap-3 md:hidden">
        {filtered.map((client) => (
          <article
            className="rounded-xl border border-[#c5cad8] bg-white p-4"
            key={client.id}
          >
            <div className="flex items-center gap-3">
              <img
                className="size-12 rounded-full object-cover"
                src={client.image}
                alt=""
              />
              <div className="min-w-0 flex-1">
                <b>{client.name}</b>
                <small className="block text-[#606878]">
                  {client.age} yrs • {client.gender}
                </small>
              </div>
              <Status value={client.nid} />
            </div>
            <div className="mt-4 space-y-2 border-t border-[#e1e4ec] pt-3 text-sm">
              <p>{client.phone}</p>
              <p className="flex gap-2 text-[#515867]">
                <MapPin className="size-4 shrink-0 text-[#0755d3]" />{" "}
                {client.address}
              </p>
              <p>
                <b>Care:</b> {client.carePlan}
              </p>
            </div>
            <button
              className="mt-4 w-full rounded-lg bg-[#0755d3] py-2.5 text-sm font-semibold text-white"
              type="button"
              onClick={() => setSelected(client)}
            >
              View Client Profile
            </button>
          </article>
        ))}
      </div>

      {selected && (
        <ClientDrawer client={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

const clientTabs = ["Profile", "Medical", "Care Plan", "Payments", "Docs"];

const ClientDrawer = ({ client, onClose }) => {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
  <>
    <button
      className="fixed inset-0 z-40 bg-slate-950/45"
      type="button"
      onClick={onClose}
      aria-label="Close client profile"
    />
    <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col bg-white shadow-2xl">
      <header className="flex items-center gap-4 border-b border-[#c5cad8] p-5">
        <img
          className="size-14 rounded-lg object-cover"
          src={client.image}
          alt=""
        />
        <div>
          <b className="block">{client.name}</b>
          <span className="flex items-center gap-2">
            <Status value="Verified" />
            <small>{client.id.toUpperCase()}</small>
          </span>
        </div>
        <button className="ml-auto" type="button" onClick={onClose}>
          <X className="size-6" />
        </button>
      </header>
      <nav className="hide-scrollbar flex overflow-x-auto border-b border-[#c5cad8] px-4">
        {clientTabs.map((tab) => (
          <button
            className={`whitespace-nowrap border-b-2 px-3 py-4 text-sm transition duration-200 hover:scale-105 hover:font-semibold hover:text-[#0755d3] ${activeTab === tab ? "border-[#0755d3] font-semibold text-[#0649ad]" : "border-transparent text-[#515867]"}`}
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "Profile" && <>
        <dl className="grid grid-cols-2 gap-6">
          <ProfileField label="Date of Birth" value="15 May, 1952" />
          <ProfileField label="Gender" value={client.gender} />
          <ProfileField label="Blood Group" value={client.bloodGroup} danger />
          <ProfileField label="Language" value={client.language} />
        </dl>
        <section className="mt-7 rounded-lg border border-[#c5cad8] bg-[#f1f3fa] p-4">
          <small className="font-semibold uppercase text-[#515867]">
            Emergency Contact
          </small>
          <div className="mt-4 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-red-100 font-semibold text-red-600">
              RK
            </span>
            <p>
              <b className="block">Rahim Karim</b>
              <span className="text-[#515867]">Son • +880 1700 112233</span>
            </p>
          </div>
        </section>
        <section className="mt-7">
          <small className="font-semibold uppercase text-[#515867]">
            Primary Address
          </small>
          <p className="mt-3 leading-6">
            {client.address}, Dhaka 1205, Bangladesh
          </p>
          <div className="mt-3 h-56 overflow-hidden rounded-xl">
            <img
              className="h-full w-full object-cover"
              src={mapImage}
              alt={`Map of ${client.address}`}
            />
          </div>
        </section>
        </>}
        {activeTab === "Medical" && <MedicalPanel client={client} />}
        {activeTab === "Care Plan" && <CarePlanPanel client={client} />}
        {activeTab === "Payments" && <PaymentsPanel />}
        {activeTab === "Docs" && <DocumentsPanel />}
      </div>
      <footer className="grid grid-cols-2 gap-3 border-t border-[#c5cad8] bg-[#f7f8fd] p-5">
        <button
          className="rounded-lg border border-[#8c93a2] py-3 font-semibold"
          type="button"
        >
          Assign Caregiver
        </button>
        <button
          className="rounded-lg bg-[#0755d3] py-3 font-semibold text-white"
          type="button"
        >
          Edit Details
        </button>
      </footer>
    </aside>
  </>
  );
};

const MedicalPanel = ({ client }) => (
  <div className="space-y-5">
    <section className="rounded-xl border border-[#c5cad8] bg-[#f8faff] p-4">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-red-100 text-red-600"><HeartPulse className="size-5" /></span>
        <div><small className="uppercase text-[#606878]">Primary Condition</small><b className="block">Post-operative recovery</b></div>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-4">
        <ProfileField label="Blood Group" value={client.bloodGroup} danger />
        <ProfileField label="Allergies" value="Penicillin" danger />
        <ProfileField label="Mobility" value="Assisted" />
        <ProfileField label="Risk Level" value="Moderate" />
      </dl>
    </section>
    <section>
      <h3 className="font-semibold">Current Medications</h3>
      <Medication name="Amlodipine" detail="5mg • Once daily after breakfast" />
      <Medication name="Metformin" detail="500mg • Twice daily with meals" />
    </section>
    <section className="rounded-xl border border-blue-200 bg-blue-50 p-4">
      <small className="font-semibold uppercase text-blue-700">Clinical Note</small>
      <p className="mt-2 text-sm leading-6 text-[#515867]">Monitor blood pressure before medication and record mobility progress after every visit.</p>
    </section>
  </div>
);

const CarePlanPanel = ({ client }) => (
  <div className="space-y-5">
    <section className="rounded-xl bg-[#0755d3] p-5 text-white">
      <small className="uppercase text-blue-100">Active Care Plan</small>
      <h3 className="mt-2 text-xl font-semibold">{client.carePlan}</h3>
      <div className="mt-4 flex items-center gap-2 text-sm"><CheckCircle2 className="size-4" /> Active since Oct 12, 2026</div>
    </section>
    <section className="rounded-xl border border-[#c5cad8] p-4">
      <h3 className="font-semibold">Assigned Caregiver</h3>
      <div className="mt-4 flex items-center gap-3"><img className="size-11 rounded-full object-cover" src={client.image} alt="" /><div><b className="block">Rahima Khatun</b><small className="text-[#606878]">Senior Caregiver • 4.9 rating</small></div></div>
    </section>
    <section className="rounded-xl border border-[#c5cad8] p-4">
      <h3 className="flex items-center gap-2 font-semibold"><CalendarDays className="size-5 text-[#0755d3]" /> Weekly Schedule</h3>
      <div className="mt-4 grid grid-cols-3 gap-2">{["Mon", "Wed", "Fri"].map((day) => <span className="rounded-lg bg-[#e5efff] px-3 py-2 text-center text-sm font-semibold text-[#0649ad]" key={day}>{day}</span>)}</div>
      <p className="mt-4 text-sm text-[#515867]">09:00 AM – 12:00 PM • 3 visits weekly</p>
    </section>
    <section><h3 className="font-semibold">Included Services</h3><ul className="mt-3 space-y-2 text-sm text-[#515867]">{["Medication reminders", "Mobility assistance", "Meal preparation", "Vitals monitoring"].map((service) => <li className="flex items-center gap-2" key={service}><CheckCircle2 className="size-4 text-emerald-600" /> {service}</li>)}</ul></section>
  </div>
);

const PaymentsPanel = () => (
  <div className="space-y-5">
    <section className="rounded-xl bg-[#0755d3] p-5 text-white">
      <div className="flex items-start"><div><small className="uppercase text-blue-100">Current Balance</small><b className="mt-2 block text-3xl">৳12,450</b></div><WalletCards className="ml-auto size-8 text-blue-200" /></div>
      <p className="mt-5 text-sm text-blue-100">Next invoice due Jul 28, 2026</p>
    </section>
    <div className="grid grid-cols-2 gap-3"><PaymentMetric label="Paid to date" value="৳45,500" /><PaymentMetric label="Monthly plan" value="৳18,000" /></div>
    <section><h3 className="font-semibold">Recent Transactions</h3><Transaction title="Weekly Home Care" date="Jul 20, 2026" amount="৳4,500" status="Paid" /><Transaction title="Medical Premium" date="Jul 13, 2026" amount="৳2,900" status="Paid" /><Transaction title="Upcoming Invoice" date="Jul 28, 2026" amount="৳5,050" status="Pending" /></section>
    <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#0755d3] py-3 font-semibold text-[#0649ad]" type="button"><CreditCard className="size-5" /> Manage Payment Method</button>
  </div>
);

const DocumentsPanel = () => (
  <div>
    <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#9eb2d3] bg-[#f8faff] px-4 py-6 font-semibold text-[#0649ad]" type="button"><Upload className="size-5" /> Upload New Document</button>
    <h3 className="mt-7 font-semibold">Client Documents</h3>
    <div className="mt-3 space-y-3">
      <Document name="National ID - Front.pdf" meta="Verified • 1.8 MB" status="Verified" />
      <Document name="Medical_Report_July.pdf" meta="Jul 18, 2026 • 2.4 MB" status="Reviewed" />
      <Document name="Care_Agreement.pdf" meta="Signed Jul 12, 2026 • 860 KB" status="Signed" />
      <Document name="Prescription_Scan.jpg" meta="Jul 10, 2026 • 1.2 MB" status="Pending" />
    </div>
  </div>
);

const Medication = ({ name, detail }) => <article className="mt-3 flex items-center gap-3 rounded-xl border border-[#c5cad8] p-4"><span className="grid size-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><Pill className="size-5" /></span><p><b className="block">{name}</b><small className="text-[#606878]">{detail}</small></p></article>;
const PaymentMetric = ({ label, value }) => <article className="rounded-xl border border-[#c5cad8] bg-[#f8faff] p-4"><small className="uppercase text-[#606878]">{label}</small><b className="mt-2 block text-lg">{value}</b></article>;
const Transaction = ({ title, date, amount, status }) => <article className="mt-3 flex items-center gap-3 border-b border-[#e1e4ec] py-3 last:border-0"><span className="grid size-9 place-items-center rounded-lg bg-blue-100 text-[#0755d3]"><CreditCard className="size-4" /></span><div className="min-w-0 flex-1"><b className="block text-sm">{title}</b><small className="text-[#606878]">{date}</small></div><div className="text-right"><b className="block text-sm">{amount}</b><small className={status === "Pending" ? "text-amber-700" : "text-emerald-700"}>{status}</small></div></article>;
const Document = ({ name, meta, status }) => <article className="flex items-center gap-3 rounded-xl border border-[#c5cad8] p-4"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-100 text-[#0755d3]"><FileText className="size-5" /></span><div className="min-w-0 flex-1"><b className="block truncate text-sm">{name}</b><small className="text-[#606878]">{meta}</small></div><Status value={status} /></article>;

const Status = ({ value }) => (
  <span
    className={`rounded-full px-2 py-1 text-[9px] font-semibold uppercase ${value === "Pending" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}
  >
    {value}
  </span>
);
const ProfileField = ({ label, value, danger = false }) => (
  <div>
    <dt className="text-[10px] font-semibold uppercase text-[#515867]">
      {label}
    </dt>
    <dd className={`mt-2 ${danger ? "font-semibold text-red-600" : ""}`}>
      {value}
    </dd>
  </div>
);

export default AdminClients;
