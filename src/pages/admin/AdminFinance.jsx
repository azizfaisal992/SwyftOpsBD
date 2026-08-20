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
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import bkashLogo from "../../assets/bkash-logo.svg";
import caregiverSarah from "../../assets/caregiver-sarah.jpg";
import findCareKelly from "../../assets/find-care-kelly.jpg";
import findCareSarah from "../../assets/find-care-sarah.jpg";
import { getVerifiedClients } from "../../services/adminDirectoryService";
import {
  createAdminAssignmentPayout,
  createAdminInvoice,
  downloadPaymentPayslip,
  downloadSwiftOpsInvoice,
  getAdminFinanceOverview,
  listAdminAssignmentPayoutQuotes,
  updateAdminPayout,
} from "../../services/paymentService";

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
    value: "$2,845,000",
    change: "+12.5% MTD",
    icon: WalletCards,
    tone: "blue",
  },
  {
    label: "Caregiver Payouts",
    value: "$1,987,000",
    change: "+8.2% MTD",
    icon: Banknote,
    tone: "green",
  },
  {
    label: "Platform Net Revenue",
    value: "$858,000",
    change: "+15.1% MTD",
    icon: ArrowLeftRight,
    tone: "slate",
  },
  {
    label: "Pending Payouts",
    value: "$198,300",
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

const formatMoney = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

const AdminFinance = () => {
  const [tab, setTab] = useState("clients");
  const [status, setStatus] = useState("All");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [finance, setFinance] = useState({
    grossBilling: 0,
    caregiverPayouts: 0,
    platformNetRevenue: 0,
    pendingPayouts: 0,
    pendingPayoutCount: 0,
    caregiverLiability: 0,
    invoices: [],
    payouts: [],
    agreements: [],
    platformRevenue: [],
    caregiverLedger: [],
    monthlyReconciliation: [],
    currency: "USD",
  });
  const [clients, setClients] = useState([]);
  const [payoutQuotes, setPayoutQuotes] = useState([]);
  useEffect(() => {
    Promise.all([
      getAdminFinanceOverview(),
      getVerifiedClients(),
      listAdminAssignmentPayoutQuotes(),
    ])
      .then(([overview, records, quotes]) => {
        setFinance(overview);
        setClients(records);
        setPayoutQuotes(quotes);
      })
      .catch((error) => setNotice(error.message));
  }, []);
  const liveInvoices = useMemo(
    () => finance.invoices.map((invoice) => ({
      id: invoice.invoiceId,
      name: invoice.clientName || "Client",
      personId: invoice.clientId,
      image: invoice.clientPhotoURL || "",
      service: invoice.description,
      date: new Date(invoice.createdAt).toLocaleString(),
      amount: invoice.total,
      currency: invoice.currency || finance.currency,
      method: invoice.gateway || "Not selected",
      kind: "invoice",
      swiftopsInvoiceId:
        invoice.status === "paid" ? invoice.invoiceId : null,
      stripeInvoiceUrl: invoice.stripeInvoiceUrl || null,
      payslip: null,
      status:
        invoice.status === "paid"
          ? "Successful"
          : invoice.status === "failed"
            ? "Failed"
            : "Pending",
    })),
    [finance.currency, finance.invoices],
  );
  const livePayouts = useMemo(
    () => [
      ...finance.payouts.map((payout) => ({
      id: payout.payoutId,
      name: payout.caregiverName || "Caregiver",
      personId: payout.caregiverId,
      image: caregiverSarah,
      service: "Caregiver withdrawal",
      date: new Date(payout.requestedAt).toLocaleString(),
      amount: payout.amount,
      currency: payout.currency || finance.currency,
      method: payout.method || "bKash",
      kind: "payout",
      payslip:
        payout.status === "paid"
          ? { type: "payout", id: payout.payoutId }
          : null,
      status:
        payout.status === "paid"
          ? "Successful"
          : payout.status === "failed"
            ? "Failed"
            : payout.status === "processing"
              ? "On Hold"
              : "Pending",
      })),
      ...(finance.caregiverLedger || [])
        .filter((entry) => entry.paymentStatus === "paid")
        .map((entry) => ({
          id: entry.ledgerId,
          name: entry.caregiverName || "Caregiver",
          personId: entry.caregiverId,
          image: caregiverSarah,
          service:
            entry.description ||
            `Care payment for ${entry.clientName || "client"}`,
          date: new Date(entry.paidAt || entry.createdAt).toLocaleString(),
          amount: entry.amount,
          currency: entry.currency || finance.currency,
          method: entry.paymentMethod || "Manual",
          kind: "earning",
          payslip: { type: "earning", id: entry.ledgerId },
          status: "Successful",
        })),
    ],
    [finance.caregiverLedger, finance.currency, finance.payouts],
  );
  const source = useMemo(
    () => tab === "clients"
      ? [...liveInvoices, ...clientInvoices.slice(0, 0)]
      : [...livePayouts, ...caregiverPayouts.slice(0, 0)],
    [liveInvoices, livePayouts, tab],
  );
  const dashboardMetrics = metrics.map((metric) => ({
    ...metric,
    value: formatMoney({
      "Gross Client Billing": finance.grossBilling,
      "Caregiver Payouts": finance.caregiverPayouts,
      "Platform Net Revenue": finance.platformNetRevenue,
      "Pending Payouts": finance.pendingPayouts,
    }[metric.label] || 0, finance.currency),
    change:
      ({
        "Gross Client Billing": "Successful client payments",
        "Caregiver Payouts": "Completed caregiver payouts",
        "Platform Net Revenue": "Accrued platform share",
        "Pending Payouts":
          `${finance.pendingPayoutCount || 0} unpaid earnings`,
      })[metric.label],
  }));
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

  const processPayout = async (item) => {
    if (
      !window.confirm(
        `Confirm ${formatMoney(item.amount, item.currency || finance.currency)} payout to ${item.name} by ${item.method}?`,
      )
    ) {
      return;
    }
    try {
      await updateAdminPayout(item.id, "paid");
      setFinance(await getAdminFinanceOverview());
      flash(`Payout ${item.id} was marked paid and its payslip is ready.`);
    } catch (error) {
      flash(error.message);
    }
  };

  const downloadPayslip = (item) => {
    if (!item.payslip) {
      flash("The payslip becomes available after payment completes.");
      return;
    }
    downloadPaymentPayslip(item.payslip.type, item.payslip.id)
      .catch((error) => flash(error.message));
  };

  const downloadInvoice = (item) => {
    if (!item.swiftopsInvoiceId) {
      flash("The SwiftOpsBD invoice is available after client payment.");
      return;
    }
    downloadSwiftOpsInvoice(item.swiftopsInvoiceId)
      .catch((error) => flash(error.message));
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
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white sm:flex-none"
            type="button"
            onClick={() => setPayoutOpen(true)}
          >
            <Banknote className="size-4" /> Pay Caregiver
          </button>
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
        {dashboardMetrics.map(({ label, value, change, icon: Icon, tone }) => (
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

      <section className="mt-4 grid gap-3 rounded-xl border border-[#c8cfde] bg-[#eef3ff] p-4 sm:grid-cols-4">
        <SettlementStat
          label="Deposits received"
          value={finance.agreements.filter(
            (item) => item.depositStatus === "paid",
          ).length}
        />
        <SettlementStat
          label="Balances due"
          value={finance.agreements.filter(
            (item) => item.balanceStatus === "pending",
          ).length}
        />
        <SettlementStat
          label="Settled plans"
          value={finance.agreements.filter(
            (item) => item.settlementStatus === "completed",
          ).length}
        />
        <SettlementStat
          label="Caregiver liability"
          value={formatMoney(finance.caregiverLiability || 0, finance.currency)}
        />
      </section>

      <ReconciliationChart data={finance.monthlyReconciliation || []} currency={finance.currency} />

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
                <FinanceRow
                  item={item}
                  key={item.id}
                  flash={flash}
                  onPay={processPayout}
                  onDownload={downloadPayslip}
                  onDownloadInvoice={downloadInvoice}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-[#d7dce7] md:hidden">
          {rows.map((item) => (
            <FinanceCard
              item={item}
              key={item.id}
              flash={flash}
              onPay={processPayout}
              onDownload={downloadPayslip}
              onDownloadInvoice={downloadInvoice}
            />
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
          clients={clients}
          onClose={() => setInvoiceOpen(false)}
          onCreated={async (invoice) => {
            try {
              await createAdminInvoice(invoice);
              setFinance(await getAdminFinanceOverview());
              setInvoiceOpen(false);
              flash("Client invoice created and published to their wallet.");
            } catch (error) {
              flash(error.message);
            }
          }}
        />
      )}
      {payoutOpen && (
        <CaregiverPaymentModal
          quotes={payoutQuotes}
          onClose={() => setPayoutOpen(false)}
          onPaid={async (payment) => {
            try {
              await createAdminAssignmentPayout(payment);
              const [overview, quotes] = await Promise.all([
                getAdminFinanceOverview(),
                listAdminAssignmentPayoutQuotes(),
              ]);
              setFinance(overview);
              setPayoutQuotes(quotes);
              setPayoutOpen(false);
              setTab("caregivers");
              flash(
                "Caregiver payment recorded. It is now visible in their wallet with a downloadable payslip.",
              );
            } catch (error) {
              flash(error.message);
            }
          }}
        />
      )}
    </div>
  );
};

const ReconciliationChart = ({ data, currency }) => {
  const maximum = Math.max(
    1,
    ...data.flatMap((item) => [
      Number(item.clientBilling || 0),
      Number(item.caregiverPayout || 0),
      Number(item.platformMargin || 0),
    ]),
  );
  const barHeight = (value) =>
    value > 0 ? Math.max(4, (Number(value) / maximum) * 100) : 0;
  const compactMoney = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(Number(value || 0));
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
      <div className="mt-6 overflow-x-auto pb-6">
        <div className="flex h-52 min-w-[720px] items-end gap-3 border-b border-[#c8cfde] sm:h-64">
          {data.map((item) => (
          <div
            className="group relative flex h-full min-w-12 flex-1 items-end justify-center gap-1"
            key={item.month}
          >
            <span
              className="w-2.5 rounded-t bg-[#0755b7] sm:w-4"
              style={{ height: `${barHeight(item.clientBilling)}%` }}
            />
            <span
              className="w-2.5 rounded-t bg-emerald-500 sm:w-4"
              style={{ height: `${barHeight(item.caregiverPayout)}%` }}
            />
            <span
              className="w-2.5 rounded-t bg-[#0b1e31] sm:w-4"
              style={{ height: `${barHeight(item.platformMargin)}%` }}
            />
            <span className="invisible absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded bg-slate-900 px-3 py-2 text-[9px] leading-4 whitespace-nowrap text-white shadow-xl group-hover:visible">
              <b className="block">{item.label}</b>
              Client billing: {compactMoney(item.clientBilling)}
              <br />
              Caregiver payout: {compactMoney(item.caregiverPayout)}
              <br />
              Platform margin: {compactMoney(item.platformMargin)}
            </span>
            <small className="absolute top-full mt-2 text-[9px] whitespace-nowrap text-[#606878]">
              {item.label}
            </small>
          </div>
          ))}
        </div>
      </div>
      {!data.length && (
        <p className="py-10 text-center text-sm text-[#606878]">
          Monthly finance data will appear after the first completed payment.
        </p>
      )}
    </section>
  );
};

const Legend = ({ color, children }) => (
  <span className="flex items-center gap-1.5">
    <i className={`size-2.5 rounded-full ${color}`} />
    {children}
  </span>
);
const SettlementStat = ({ label, value }) => (
  <span className="rounded-lg bg-white px-4 py-3 shadow-sm">
    <small className="block text-[10px] font-semibold uppercase tracking-wide text-[#687184]">
      {label}
    </small>
    <b className="mt-1 block text-lg text-[#0649ad]">{value}</b>
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

const PersonPhoto = ({ item }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <span className="relative inline-grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[#eef3fb] text-[#91a0b8]">
      {!loaded && <UserRound className="size-5" aria-hidden="true" />}
      {item.image && (
        <img
          className={`absolute inset-0 size-full object-cover transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`}
          src={item.image}
          alt=""
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
        />
      )}
    </span>
  );
};

const Person = ({ item }) => (
  <div className="flex items-center gap-3">
    <PersonPhoto item={item} />
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

const FinanceRow = ({
  item,
  flash,
  onPay,
  onDownload,
  onDownloadInvoice,
}) => (
  <tr className="border-t border-[#d7dce7] hover:bg-[#f9fbff]">
    <td className="px-6 py-4 font-semibold text-[#0755b7]">#{item.id}</td>
    <td className="px-4 py-4">
      <Person item={item} />
    </td>
    <td className="px-4 py-4">{item.service}</td>
    <td className="px-4 py-4 text-[#515867]">{item.date}</td>
    <td className="px-4 py-4 font-semibold">{formatMoney(item.amount, item.currency)}</td>
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
          label={item.stripeInvoiceUrl ? "View Stripe invoice" : "View record"}
          onClick={() => item.stripeInvoiceUrl
            ? window.open(item.stripeInvoiceUrl, "_blank", "noopener,noreferrer")
            : flash(`${item.id} opened for review.`)}
        />
        <Action
          icon={
            item.kind === "payout" && item.status === "Pending"
              ? Banknote
              : item.status === "Failed"
                ? RefreshCw
                : ArrowDownToLine
          }
          label={
            item.kind === "payout" && item.status === "Pending"
              ? "Pay caregiver"
              : item.status === "Failed"
                ? "Retry"
                : item.swiftopsInvoiceId
                  ? "Download SwiftOpsBD invoice"
                  : "Download payslip"
          }
          onClick={() => item.kind === "payout" && item.status === "Pending"
            ? onPay(item)
            : item.swiftopsInvoiceId
              ? onDownloadInvoice(item)
              : onDownload(item)}
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

const FinanceCard = ({
  item,
  flash,
  onPay,
  onDownload,
  onDownloadInvoice,
}) => (
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
        <b>{formatMoney(item.amount, item.currency)}</b>
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
      <div className="ml-auto flex gap-2">
        {item.kind === "payout" && item.status === "Pending" && (
          <button
            className="rounded-lg bg-[#0755b7] px-3 py-2 text-xs font-semibold text-white"
            type="button"
            onClick={() => onPay(item)}
          >
            Pay now
          </button>
        )}
        {item.payslip && (
          <button
            className="rounded-lg border px-3 py-2 text-xs font-semibold text-[#0649ad]"
            type="button"
            onClick={() => onDownload(item)}
          >
            Payslip
          </button>
        )}
        {item.swiftopsInvoiceId && (
          <button
            className="rounded-lg border px-3 py-2 text-xs font-semibold text-[#0649ad]"
            type="button"
            onClick={() => onDownloadInvoice(item)}
          >
            SwiftOpsBD Invoice
          </button>
        )}
        {item.stripeInvoiceUrl && (
          <a
            className="rounded-lg border px-3 py-2 text-xs font-semibold text-violet-700"
            href={item.stripeInvoiceUrl}
            target="_blank"
            rel="noreferrer"
          >
            Stripe Invoice
          </a>
        )}
        <button
          className="rounded-lg border px-3 py-2 text-xs font-semibold text-[#0649ad]"
          type="button"
          onClick={() => flash(`${item.id} opened for review.`)}
        >
          Details
        </button>
      </div>
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

const CaregiverPaymentModal = ({ quotes, onClose, onPaid }) => {
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const selectedQuote = quotes.find(
    (quote) => quote.assignmentId === selectedAssignmentId,
  );

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="caregiver-payment-title"
    >
      <form
        className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          const values = new FormData(event.currentTarget);
          if (!selectedQuote?.ready) return;
          onPaid({
            assignmentId: selectedQuote.assignmentId,
            paymentMethod: values.get("paymentMethod"),
            paymentReference: values.get("paymentReference"),
          });
        }}
      >
        <div className="flex items-start gap-3">
          <div>
            <h2 id="caregiver-payment-title" className="text-xl font-semibold">
              Record Caregiver Payment
            </h2>
            <p className="mt-1 text-sm text-[#606878]">
              The payable amount comes from the client’s locked care plan.
              Administrators cannot override the caregiver or platform share.
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

        <Field label="Caregiver and client assignment">
          <select
            name="assignmentId"
            required
            value={selectedAssignmentId}
            onChange={(event) => setSelectedAssignmentId(event.target.value)}
          >
            <option value="">Select assignment</option>
            {quotes.map((quote) => (
              <option
                value={quote.assignmentId}
                key={quote.agreementId}
              >
                {quote.caregiverName || "Caregiver"} →{" "}
                {quote.clientName || "Client"} ·{" "}
                {quote.careType || "Care service"}
                {quote.ready ? "" : " · Not ready"}
              </option>
            ))}
          </select>
        </Field>

        {selectedQuote && (
          <section className="mt-4 rounded-xl border border-[#c8cfde] bg-[#f4f7fc] p-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <PaymentQuoteValue
                label="Client plan total"
                value={formatMoney(selectedQuote.clientTotal, selectedQuote.currency)}
              />
              <PaymentQuoteValue
                label={`Caregiver share (${selectedQuote.caregiverSharePercent}%)`}
                value={formatMoney(selectedQuote.caregiverAmount, selectedQuote.currency)}
                tone="green"
              />
              <PaymentQuoteValue
                label="Site retained amount"
                value={formatMoney(selectedQuote.siteRetainedAmount, selectedQuote.currency)}
                tone="blue"
              />
              <PaymentQuoteValue
                label="Already paid"
                value={formatMoney(selectedQuote.paidAmount, selectedQuote.currency)}
              />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-[#c8cfde] pt-4">
              <span className="text-sm font-semibold">
                Pay caregiver now
              </span>
              <strong className="text-xl text-emerald-700">
                {formatMoney(selectedQuote.payableAmount, selectedQuote.currency)}
              </strong>
            </div>
            {!selectedQuote.ready && (
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                {selectedQuote.blockedReason}
              </p>
            )}
          </section>
        )}

        <div className="grid gap-x-4 sm:grid-cols-2">
          <Field label="Payment method">
            <select name="paymentMethod" required defaultValue="manual">
              <option value="manual">Manual payment record</option>
              <option value="bkash">bKash</option>
              <option value="bank_transfer">Bank transfer</option>
              <option value="cash">Cash</option>
            </select>
          </Field>
        </div>

        <Field label="Payment reference">
          <input
            name="paymentReference"
            maxLength="120"
            placeholder="Optional transaction or receipt number"
          />
        </Field>

        {!quotes.length && (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            No priced caregiver/client assignments are available yet.
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            className="rounded-lg border px-4 py-2.5 text-sm font-semibold"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            type="submit"
            disabled={!selectedQuote?.ready}
          >
            Confirm {selectedQuote?.ready
              ? `${formatMoney(selectedQuote.payableAmount, selectedQuote.currency)} Paid`
              : "Payment"}
          </button>
        </div>
      </form>
    </div>
  );
};

const PaymentQuoteValue = ({ label, value, tone = "slate" }) => (
  <span>
    <small className="block text-[10px] font-semibold uppercase tracking-wide text-[#687184]">
      {label}
    </small>
    <b
      className={`mt-1 block ${
        tone === "green"
          ? "text-emerald-700"
          : tone === "blue"
            ? "text-[#0755b7]"
            : "text-[#101c2d]"
      }`}
    >
      {value}
    </b>
  </span>
);

const InvoiceModal = ({ clients, onClose, onCreated }) => (
  <div
    className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/50 p-4"
    role="dialog"
    aria-modal="true"
  >
    <form
      className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      onSubmit={(event) => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        onCreated({
          clientId: values.get("clientId"),
          description: values.get("description"),
          subtotal: Number(values.get("subtotal")),
          dueAt: values.get("dueAt"),
          note: values.get("note"),
        });
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
          <select name="clientId" required>
            <option value="">Select client</option>
            {clients.map((client) => (
              <option value={client.clientId} key={client.clientId}>
                {client.profile?.fullName || client.account?.email || client.clientId}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Service">
          <select name="description" required>
            <option value="">Select service</option>
            <option>Post-Op Nursing</option>
            <option>Physiotherapy</option>
            <option>Companion Care</option>
          </select>
        </Field>
        <Field label="Amount (BDT)">
          <input name="subtotal" required min="1" type="number" placeholder="0.00" />
        </Field>
        <Field label="Due date">
          <input name="dueAt" required type="date" />
        </Field>
      </div>
      <Field label="Billing note">
        <textarea
          name="note"
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
