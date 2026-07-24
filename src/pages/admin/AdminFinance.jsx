import {
  ArrowDownToLine,
  ArrowLeftRight,
  Banknote,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Download,
  FileText,
  Filter,
  Plus,
  ReceiptText,
  RefreshCw,
  Search,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import bkashLogo from "../../assets/bkash-logo.svg";
import caregiverSarah from "../../assets/caregiver-sarah.jpg";
import findCareKelly from "../../assets/find-care-kelly.jpg";
import findCareSarah from "../../assets/find-care-sarah.jpg";

const clientInvoices = [
  {
    id: "TRX-98231",
    name: "Mariam Begum",
    personId: "CL-2204",
    image: findCareSarah,
    service: "Post-Op Nursing (12h)",
    date: "Oct 24, 2026 · 14:20",
    amount: 4500,
    method: "bKash",
    status: "Successful",
  },
  {
    id: "TRX-98245",
    name: "Ahmed Sharif",
    personId: "CL-2209",
    image: findCareKelly,
    service: "Physiotherapy Session",
    date: "Oct 24, 2026 · 15:45",
    amount: 2200,
    method: "Card",
    status: "Pending",
  },
  {
    id: "TRX-98250",
    name: "Nasrin Sultana",
    personId: "CL-2180",
    image: caregiverSarah,
    service: "Elderly Companion Care",
    date: "Oct 23, 2026 · 11:10",
    amount: 12800,
    method: "Visa",
    status: "Failed",
  },
  {
    id: "TRX-98264",
    name: "Abdul Karim",
    personId: "CL-90234",
    image: findCareKelly,
    service: "Monthly Home Care",
    date: "Oct 22, 2026 · 09:30",
    amount: 18500,
    method: "bKash",
    status: "Successful",
  },
];

const caregiverPayouts = [
  {
    id: "PAY-74018",
    name: "Rahima Khatun",
    personId: "CR-88294",
    image: caregiverSarah,
    service: "12 completed visits",
    date: "Oct 25, 2026 · Due",
    amount: 9600,
    method: "bKash",
    status: "Pending",
  },
  {
    id: "PAY-74012",
    name: "Farhana Akhter",
    personId: "CR-77120",
    image: findCareSarah,
    service: "Weekly payout · 8 visits",
    date: "Oct 23, 2026 · 17:30",
    amount: 7200,
    method: "Bank",
    status: "Successful",
  },
  {
    id: "PAY-73998",
    name: "Arifur Rahman",
    personId: "CR-77412",
    image: findCareKelly,
    service: "Payout review · 3 visits",
    date: "Oct 22, 2026 · 12:05",
    amount: 2850,
    method: "bKash",
    status: "On Hold",
  },
  {
    id: "PAY-73974",
    name: "Fatema Begum",
    personId: "CR-66421",
    image: caregiverSarah,
    service: "Weekly payout · 10 visits",
    date: "Oct 20, 2026 · 16:15",
    amount: 8500,
    method: "Bank",
    status: "Successful",
  },
];

const metrics = [
  {
    label: "Gross Client Billing",
    value: "৳2,845,000",
    change: "+12.5% MTD",
    icon: WalletCards,
    tone: "blue",
  },
  {
    label: "Caregiver Payouts",
    value: "৳1,987,000",
    change: "+8.2% MTD",
    icon: Banknote,
    tone: "green",
  },
  {
    label: "Platform Net Revenue",
    value: "৳858,000",
    change: "+15.1% MTD",
    icon: ArrowLeftRight,
    tone: "slate",
  },
  {
    label: "Pending Payouts",
    value: "৳198,300",
    change: "12 active batches",
    icon: ReceiptText,
    tone: "amber",
  },
];

const toneClasses = {
  blue: "bg-blue-100 text-[#0755d3]",
  green: "bg-emerald-100 text-emerald-700",
  slate: "bg-slate-100 text-slate-700",
  amber: "bg-amber-100 text-amber-700",
};

const statusClasses = {
  Successful: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Failed: "bg-red-100 text-red-700",
  "On Hold": "bg-slate-200 text-slate-700",
};

const formatMoney = (amount) => `৳${amount.toLocaleString("en-US")}`;

const AdminFinance = () => {
  const [tab, setTab] = useState("clients");
  const [status, setStatus] = useState("All");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const source = tab === "clients" ? clientInvoices : caregiverPayouts;
  const rows = useMemo(
    () =>
      source.filter((item) => {
        const matchesStatus = status === "All" || item.status === status;
        const searchText =
          `${item.id} ${item.name} ${item.service}`.toLowerCase();
        return matchesStatus && searchText.includes(query.toLowerCase());
      }),
    [query, source, status],
  );

  const flash = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  return (
    <div className="mx-auto max-w-[1380px] p-4 sm:p-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">
            Payments & Finance
          </h1>
          <p className="mt-1 text-sm text-[#555d6d]">
            Manage client billing, caregiver payouts, and platform revenue
            tracking.
          </p>
        </div>
        <div className="flex gap-2 lg:ml-auto">
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#aeb7c8] bg-white px-4 py-2.5 text-sm font-semibold text-[#0649ad] sm:flex-none"
            type="button"
            onClick={() =>
              flash("Finance report export is ready for backend integration.")
            }
          >
            <Download className="size-4" /> Export Report
          </button>
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0755b7] px-4 py-2.5 text-sm font-semibold text-white sm:flex-none"
            type="button"
            onClick={() => setInvoiceOpen(true)}
          >
            <Plus className="size-4" /> Create Invoice
          </button>
        </div>
      </header>

      {notice && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <Check className="size-4" />
          {notice}
        </div>
      )}

      <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {metrics.map(({ label, value, change, icon: Icon, tone }) => (
          <article
            className="rounded-xl border-2 border-[#d0d6e2] bg-white p-4 shadow-sm sm:p-5"
            key={label}
          >
            <div className="flex items-start justify-between gap-2">
              <span
                className={`grid size-9 place-items-center rounded-lg ${toneClasses[tone]}`}
              >
                <Icon className="size-5" />
              </span>
              <b
                className={`text-[10px] uppercase sm:text-xs ${tone === "amber" ? "text-amber-700" : "text-[#111c2c]"}`}
              >
                {change}
              </b>
            </div>
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#606878] sm:text-xs">
              {label}
            </p>
            <b
              className={`mt-1 block text-xl sm:text-2xl ${tone === "green" ? "text-emerald-700" : tone === "amber" ? "text-amber-700" : tone === "blue" ? "text-[#0649ad]" : ""}`}
            >
              {value}
            </b>
          </article>
        ))}
      </section>

      <ReconciliationChart />

      <section className="mt-6 overflow-hidden rounded-xl border border-[#c8cfde] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#c8cfde] p-4 sm:flex-row sm:items-center sm:px-6">
          <div className="flex gap-6">
            <TabButton
              active={tab === "clients"}
              onClick={() => {
                setTab("clients");
                setStatus("All");
              }}
            >
              Client Invoices
            </TabButton>
            <TabButton
              active={tab === "caregivers"}
              onClick={() => {
                setTab("caregivers");
                setStatus("All");
              }}
            >
              Caregiver Payouts
            </TabButton>
          </div>
          <div className="flex gap-2 sm:ml-auto">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-[#c8cfde] bg-[#f8f9fd] px-3 py-2 sm:w-64">
              <Search className="size-4 text-[#687184]" />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search transactions..."
              />
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-[#c8cfde] px-3 text-sm">
              <Filter className="size-4" />
              <select
                className="bg-transparent outline-none"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option>All</option>
                <option>Successful</option>
                <option>Pending</option>
                <option>Failed</option>
                <option>On Hold</option>
              </select>
            </label>
          </div>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-[#f0f3fb] text-[11px] uppercase tracking-[0.06em] text-[#606878]">
              <tr>
                <th className="px-6 py-4">Transaction</th>
                <th className="px-4 py-4">
                  {tab === "clients" ? "Client" : "Caregiver"}
                </th>
                <th className="px-4 py-4">Description</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Method</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <FinanceRow item={item} key={item.id} flash={flash} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-[#d7dce7] md:hidden">
          {rows.map((item) => (
            <FinanceCard item={item} key={item.id} flash={flash} />
          ))}
        </div>
        {!rows.length && (
          <div className="p-10 text-center text-sm text-[#606878]">
            No finance records match these filters.
          </div>
        )}

        <footer className="flex items-center border-t border-[#c8cfde] bg-[#f8f9fd] px-4 py-3 text-xs text-[#606878] sm:px-6">
          Showing {rows.length} of {source.length} records
          <div className="ml-auto flex items-center gap-1">
            <button className="rounded border bg-white p-1.5" type="button">
              <ChevronLeft className="size-4" />
            </button>
            <span className="grid size-8 place-items-center rounded bg-[#0755b7] text-white">
              1
            </span>
            <button className="rounded border bg-white p-1.5" type="button">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </footer>
      </section>

      {invoiceOpen && (
        <InvoiceModal
          onClose={() => setInvoiceOpen(false)}
          onCreated={() => {
            setInvoiceOpen(false);
            flash(
              "Draft invoice created locally. It is ready to connect to the billing API.",
            );
          }}
        />
      )}
    </div>
  );
};

const ReconciliationChart = () => {
  const billing = [58, 68, 62, 76, 81, 77, 86, 91, 96, 93, 101];
  const payouts = [39, 46, 41, 55, 61, 57, 66, 73, 78, 75, 83];
  const margin = billing.map((value, index) => value - payouts[index]);
  return (
    <section className="mt-6 rounded-xl border border-[#c8cfde] bg-white p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-lg font-semibold">Revenue Reconciliation</h2>
          <p className="text-xs text-[#606878]">
            Billing, payouts, and platform margins for the last 12 months.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-[11px] sm:ml-auto">
          <Legend color="bg-[#0755b7]">Client Billing</Legend>
          <Legend color="bg-emerald-500">Caregiver Payout</Legend>
          <Legend color="bg-[#0b1e31]">Platform Margin</Legend>
        </div>
      </div>
      <div className="mt-6 flex h-52 items-end gap-2 border-b border-[#c8cfde] sm:h-64 sm:gap-4">
        {billing.map((value, index) => (
          <div
            className="group relative flex h-full flex-1 items-end"
            key={value}
          >
            <span
              className="absolute bottom-0 w-full rounded-t bg-[#0755b7]/70"
              style={{ height: `${value}%` }}
            />
            <span
              className="absolute bottom-0 w-full rounded-t bg-emerald-500/80"
              style={{ height: `${payouts[index]}%` }}
            />
            <span
              className="absolute bottom-0 w-full rounded-t bg-[#0b1e31]"
              style={{ height: `${margin[index] * 1.8}%` }}
            />
            <span className="invisible absolute -top-1 left-1/2 z-10 -translate-x-1/2 rounded bg-slate-900 px-2 py-1 text-[9px] whitespace-nowrap text-white group-hover:visible">
              Billing ৳{value}0k
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[9px] uppercase text-[#606878] sm:text-[10px]">
        <span>Nov 25</span>
        <span>Jan 26</span>
        <span>Mar 26</span>
        <span>May 26</span>
        <span>Jul 26</span>
      </div>
    </section>
  );
};

const Legend = ({ color, children }) => (
  <span className="flex items-center gap-1.5">
    <i className={`size-2.5 rounded-full ${color}`} />
    {children}
  </span>
);
const TabButton = ({ active, children, onClick }) => (
  <button
    className={`border-b-2 pb-3 text-sm font-semibold ${active ? "border-[#0755d3] text-[#0649ad]" : "border-transparent text-[#515867]"}`}
    type="button"
    onClick={onClick}
  >
    {children}
  </button>
);

const Person = ({ item }) => (
  <div className="flex items-center gap-3">
    <img
      className="size-10 rounded-full object-cover"
      src={item.image}
      alt=""
    />
    <span>
      <b className="block">{item.name}</b>
      <small className="text-[#606878]">{item.personId}</small>
    </span>
  </div>
);
const Method = ({ method }) =>
  method === "bKash" ? (
    <span className="flex items-center gap-1.5">
      <img
        className="size-5 rounded object-cover"
        src={bkashLogo}
        alt="bKash"
      />
      bKash
    </span>
  ) : (
    method
  );

const FinanceRow = ({ item, flash }) => (
  <tr className="border-t border-[#d7dce7] hover:bg-[#f9fbff]">
    <td className="px-6 py-4 font-semibold text-[#0755b7]">#{item.id}</td>
    <td className="px-4 py-4">
      <Person item={item} />
    </td>
    <td className="px-4 py-4">{item.service}</td>
    <td className="px-4 py-4 text-[#515867]">{item.date}</td>
    <td className="px-4 py-4 font-semibold">{formatMoney(item.amount)}</td>
    <td className="px-4 py-4">
      <Method method={item.method} />
    </td>
    <td className="px-4 py-4">
      <span
        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${statusClasses[item.status]}`}
      >
        {item.status}
      </span>
    </td>
    <td className="px-4 py-4">
      <div className="flex justify-end gap-1">
        <Action
          icon={FileText}
          label="View record"
          onClick={() => flash(`${item.id} opened for review.`)}
        />
        <Action
          icon={item.status === "Failed" ? RefreshCw : ArrowDownToLine}
          label={item.status === "Failed" ? "Retry" : "Download"}
          onClick={() =>
            flash(`${item.id}: action is ready for backend processing.`)
          }
        />
        <Action
          icon={CircleAlert}
          label="Flag"
          danger
          onClick={() => flash(`${item.id} marked for finance review.`)}
        />
      </div>
    </td>
  </tr>
);

const FinanceCard = ({ item, flash }) => (
  <article className="p-4">
    <div className="flex items-start justify-between gap-3">
      <Person item={item} />
      <span
        className={`rounded-full px-2 py-1 text-[9px] font-semibold uppercase ${statusClasses[item.status]}`}
      >
        {item.status}
      </span>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-[#f4f7fc] p-3 text-xs">
      <span>
        <small className="block text-[#687184]">Record</small>
        <b className="text-[#0755b7]">#{item.id}</b>
      </span>
      <span>
        <small className="block text-[#687184]">Amount</small>
        <b>{formatMoney(item.amount)}</b>
      </span>
      <span>
        <small className="block text-[#687184]">Description</small>
        {item.service}
      </span>
      <span>
        <small className="block text-[#687184]">Method</small>
        <Method method={item.method} />
      </span>
    </div>
    <div className="mt-3 flex items-center">
      <small className="text-[#687184]">{item.date}</small>
      <button
        className="ml-auto rounded-lg border px-3 py-2 text-xs font-semibold text-[#0649ad]"
        type="button"
        onClick={() => flash(`${item.id} opened for review.`)}
      >
        View details
      </button>
    </div>
  </article>
);

const Action = ({ danger, icon: Icon, label, onClick }) => (
  <button
    className={`grid size-8 place-items-center rounded hover:bg-slate-100 ${danger ? "text-red-600" : "text-[#0755b7]"}`}
    type="button"
    aria-label={label}
    title={label}
    onClick={onClick}
  >
    <Icon className="size-4" />
  </button>
);

const InvoiceModal = ({ onClose, onCreated }) => (
  <div
    className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/50 p-4"
    role="dialog"
    aria-modal="true"
  >
    <form
      className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      onSubmit={(event) => {
        event.preventDefault();
        onCreated();
      }}
    >
      <div className="flex items-center">
        <div>
          <h2 className="text-xl font-semibold">Create Client Invoice</h2>
          <p className="text-sm text-[#606878]">
            Prepare a billing record for completed care.
          </p>
        </div>
        <button
          className="ml-auto p-2"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="size-5" />
        </button>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Client">
          <select required>
            <option value="">Select client</option>
            <option>Mariam Begum</option>
            <option>Ahmed Sharif</option>
          </select>
        </Field>
        <Field label="Service">
          <select required>
            <option value="">Select service</option>
            <option>Post-Op Nursing</option>
            <option>Physiotherapy</option>
            <option>Companion Care</option>
          </select>
        </Field>
        <Field label="Amount (BDT)">
          <input required min="1" type="number" placeholder="0.00" />
        </Field>
        <Field label="Due date">
          <input required type="date" />
        </Field>
      </div>
      <Field label="Billing note">
        <textarea
          className="min-h-24"
          placeholder="Optional note for the client"
        />
      </Field>
      <div className="mt-5 flex justify-end gap-2">
        <button
          className="rounded-lg border px-4 py-2.5 text-sm font-semibold"
          type="button"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="rounded-lg bg-[#0755b7] px-4 py-2.5 text-sm font-semibold text-white"
          type="submit"
        >
          Create Draft Invoice
        </button>
      </div>
    </form>
  </div>
);

const Field = ({ children, label }) => (
  <label className="mt-4 block text-sm font-semibold">
    {label}
    <span className="mt-1 block [&>*]:w-full [&>*]:rounded-lg [&>*]:border [&>*]:border-[#c8cfde] [&>*]:bg-white [&>*]:px-3 [&>*]:py-2.5 [&>*]:font-normal [&>*]:outline-none focus-within:[&>*]:border-[#0755d3]">
      {children}
    </span>
  </label>
);

export default AdminFinance;
