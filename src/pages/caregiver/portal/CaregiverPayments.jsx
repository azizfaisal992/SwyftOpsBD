import {
  ArrowUp,
  Banknote,
  Building2,
  CircleCheck,
  Download,
  FileText,
  FolderArchive,
  Plus,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { useState } from "react";
import bkashLogo from "../../../assets/bkash-logo.svg";

const transactions = [
  {
    title: "Shift Payment - Mrs. Rahman",
    date: "Today, 10:38 AM",
    amount: "+ ৳800",
    type: "income",
  },
  {
    title: "Withdrawal to bKash",
    date: "Oct 24, 2023",
    amount: "- ৳5,000",
    type: "withdrawal",
  },
  {
    title: "Shift Payment - Mr. Khan",
    date: "Oct 23, 2023",
    amount: "+ ৳1,200",
    type: "income",
  },
  {
    title: "Shift Payment - Mrs. Ahmed",
    date: "Oct 22, 2023",
    amount: "+ ৳950",
    type: "income",
  },
  {
    title: "Shift Payment - Mr. Karim",
    date: "Oct 20, 2023",
    amount: "+ ৳1,050",
    type: "income",
  },
];

const financialDocuments = [
  {
    name: "October 2026 Payslip",
    category: "Payslips",
    period: "October 2026",
    created: "Nov 01, 2026",
    size: "184 KB",
  },
  {
    name: "September 2026 Payslip",
    category: "Payslips",
    period: "September 2026",
    created: "Oct 01, 2026",
    size: "179 KB",
  },
  {
    name: "Q3 Earnings Statement",
    category: "Statements",
    period: "Jul - Sep 2026",
    created: "Oct 05, 2026",
    size: "326 KB",
  },
  {
    name: "Annual Tax Summary",
    category: "Tax Documents",
    period: "Tax Year 2025",
    created: "Jan 15, 2026",
    size: "412 KB",
  },
];

const CaregiverPayments = () => {
  const [showAll, setShowAll] = useState(false);
  const [notice, setNotice] = useState("");
  const [documentCategory, setDocumentCategory] = useState("All Documents");
  const visibleTransactions = showAll ? transactions : transactions.slice(0, 4);
  const visibleDocuments =
    documentCategory === "All Documents"
      ? financialDocuments
      : financialDocuments.filter(
          (document) => document.category === documentCategory,
        );

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  };

  return (
    <div className="mx-auto max-w-[1020px] px-5 py-8 sm:px-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Payments &amp; Wallet
        </h1>
        <p className="mt-1 text-[#4c5261]">
          Manage your earnings, withdrawals, and financial documents.
        </p>
      </header>

      {notice && (
        <div className="mt-5 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CircleCheck className="size-5 shrink-0" /> {notice}
        </div>
      )}

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <article className="rounded-xl bg-gradient-to-br from-[#1261da] to-[#0649ad] p-6 text-white shadow-lg shadow-blue-900/10">
          <p className="text-sm uppercase tracking-[0.12em] text-blue-100">
            Available Balance
          </p>
          <b className="mt-2 block text-4xl sm:text-5xl">৳8,200</b>
          <button
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 font-semibold text-[#0649ad] shadow-sm transition hover:bg-blue-50"
            type="button"
            onClick={() => showNotice("Withdrawal request opened. Backend processing will be connected later.")}
          >
            <WalletCards className="size-5" /> Withdraw Earnings
          </button>
        </article>

        <SummaryCard
          label="Weekly Earnings"
          value="৳4,500"
          icon={Banknote}
          footer={<span className="rounded-full bg-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800">↗ +12% vs last week</span>}
        />
        <SummaryCard
          label="Monthly Projection"
          value="৳18,000"
          icon={TrendingUp}
          footer={<span className="text-xs italic text-[#4c5261]">Based on current schedule</span>}
        />
      </section>

      <section className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_294px]">
        <article className="overflow-hidden rounded-xl border border-[#c5cad8] bg-white">
          <header className="flex items-center border-b border-[#c5cad8] bg-[#edf3ff] px-6 py-5">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <button
              className="ml-auto text-xs font-semibold text-[#0649ad]"
              type="button"
              onClick={() => setShowAll((current) => !current)}
            >
              {showAll ? "Show Less" : "View All"}
            </button>
          </header>
          <div>
            {visibleTransactions.map((transaction) => (
              <div
                className="flex items-center gap-4 border-b border-[#d7dbe7] px-6 py-5 last:border-b-0"
                key={`${transaction.title}-${transaction.date}`}
              >
                <span
                  className={`grid size-12 shrink-0 place-items-center rounded-full ${
                    transaction.type === "withdrawal"
                      ? "bg-red-100 text-red-600"
                      : "bg-blue-100 text-[#0649ad]"
                  }`}
                >
                  {transaction.type === "withdrawal" ? (
                    <ArrowUp className="size-5" />
                  ) : (
                    <Plus className="size-5" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <b className="block truncate">{transaction.title}</b>
                  <small className="text-[#4c5261]">{transaction.date}</small>
                </div>
                <div className="shrink-0 text-right">
                  <span className={transaction.type === "withdrawal" ? "text-[#101c2d]" : "text-emerald-700"}>
                    {transaction.amount}
                  </span>
                  <small className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                    Completed
                  </small>
                </div>
              </div>
            ))}
          </div>
        </article>

        <aside>
          <article className="overflow-hidden rounded-xl border border-[#c5cad8] bg-white">
            <h2 className="border-b border-[#c5cad8] bg-[#edf3ff] px-6 py-5 text-xl font-semibold">
              Payment Methods
            </h2>
            <div className="space-y-4 p-6">
              <button
                className="flex w-full items-center gap-4 rounded-xl border-2 border-[#0649ad] p-4 text-left"
                type="button"
                onClick={() => showNotice("bKash account **** 4321 is your primary payout method.")}
              >
                <img className="size-11 rounded-lg object-cover" src={bkashLogo} alt="bKash" />
                <span className="min-w-0 flex-1">
                  <b className="block">bKash Account</b>
                  <small className="text-[#4c5261]">**** 4321</small>
                </span>
                <CircleCheck className="size-5 shrink-0 fill-emerald-700 text-white" />
              </button>

              <button
                className="flex w-full items-center gap-4 rounded-xl border border-[#c5cad8] p-4 text-left"
                type="button"
                onClick={() => showNotice("BRAC Bank account **** 9012 selected.")}
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-blue-100 text-[#17365f]">
                  <Building2 className="size-6" />
                </span>
                <span>
                  <b className="block">Bank Transfer</b>
                  <small className="text-[#4c5261]">BRAC Bank **** 9012</small>
                </span>
              </button>

              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#c5cad8] px-4 py-3 font-semibold text-[#4c5261] hover:bg-[#f7f9ff]"
                type="button"
                onClick={() => showNotice("Payment-method setup will be connected to the backend later.")}
              >
                <Plus className="size-5" /> Add Method
              </button>
            </div>
          </article>

        </aside>
      </section>

      <section className="mt-8 overflow-hidden rounded-xl border border-[#c5cad8] bg-white">
        <header className="flex flex-col gap-4 border-b border-[#c5cad8] bg-[#edf3ff] px-6 py-5 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-lg bg-white text-[#0649ad] shadow-sm">
              <FolderArchive className="size-6" />
            </span>
            <div>
              <h2 className="text-xl font-semibold">Financial Documents</h2>
              <p className="text-sm text-[#4c5261]">
                Payslips, earning statements, and tax records in one place.
              </p>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto md:ml-auto">
            {["All Documents", "Payslips", "Statements", "Tax Documents"].map(
              (category) => (
                <button
                  className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${
                    documentCategory === category
                      ? "bg-[#0649ad] text-white"
                      : "border border-[#c5cad8] bg-white text-[#4c5261]"
                  }`}
                  key={category}
                  type="button"
                  onClick={() => setDocumentCategory(category)}
                >
                  {category}
                </button>
              ),
            )}
          </div>
        </header>

        <div className="grid gap-4 p-6 md:grid-cols-2">
          {visibleDocuments.map((document) => (
            <article
              className="flex items-center gap-4 rounded-xl border border-[#d7dbe7] p-4 transition hover:border-[#8aaee8] hover:bg-[#f9fbff]"
              key={document.name}
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-blue-100 text-[#0649ad]">
                <FileText className="size-6" />
              </span>
              <div className="min-w-0 flex-1">
                <b className="block truncate">{document.name}</b>
                <p className="mt-1 text-xs text-[#4c5261]">
                  {document.period} · {document.size}
                </p>
                <small className="text-[#7b8291]">
                  Issued {document.created}
                </small>
              </div>
              <button
                className="grid size-10 shrink-0 place-items-center rounded-lg border border-[#c5cad8] text-[#0649ad] hover:bg-blue-50"
                type="button"
                aria-label={`Download ${document.name}`}
                onClick={() =>
                  showNotice(
                    `${document.name} download will be provided by the backend.`,
                  )
                }
              >
                <Download className="size-5" />
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

const SummaryCard = ({ label, value, icon: Icon, footer }) => (
  <article className="rounded-xl border border-[#c5cad8] bg-white p-6">
    <div className="flex items-start justify-between">
      <p className="text-sm uppercase tracking-[0.1em] text-[#4c5261]">{label}</p>
      <span className="grid size-9 place-items-center rounded-lg bg-blue-100 text-[#0649ad]">
        <Icon className="size-5" />
      </span>
    </div>
    <b className="mt-5 block text-4xl font-medium">{value}</b>
    <div className="mt-5">{footer}</div>
  </article>
);

export default CaregiverPayments;
