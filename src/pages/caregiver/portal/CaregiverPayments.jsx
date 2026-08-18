import {
  ArrowUp,
  Banknote,
  CircleCheck,
  Download,
  FileText,
  FolderArchive,
  Plus,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  downloadPaymentPayslip,
  getPaymentSummary,
  requestWithdrawal,
} from "../../../services/paymentService";

const CaregiverPayments = () => {
  const [showAll, setShowAll] = useState(false);
  const [notice, setNotice] = useState("");
  const [documentCategory, setDocumentCategory] = useState("All Documents");
  const [wallet, setWallet] = useState({
    availableBalance: 0,
    completedEarnings: 0,
    weeklyEarnings: 0,
    pendingEarnings: 0,
    monthlyProjection: 0,
    ledger: [],
    payouts: [],
    agreements: [],
  });
  const loadWallet = async () => {
    try {
      setWallet(await getPaymentSummary());
    } catch (error) {
      setNotice(error.message);
    }
  };
  useEffect(() => {
    let active = true;
    getPaymentSummary()
      .then((data) => {
        if (active) setWallet(data);
      })
      .catch((error) => {
        if (active) setNotice(error.message);
      });
    return () => {
      active = false;
    };
  }, []);
  const currency =
    wallet.agreements?.find((agreement) => agreement.pricing?.currency)
      ?.pricing?.currency ||
    wallet.ledger?.find((entry) => entry.currency)?.currency ||
    wallet.payouts?.find((payout) => payout.currency)?.currency ||
    "USD";
  const money = (value) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
  const transactions = [
    ...wallet.ledger
      .filter((entry) => !entry.payoutId)
      .map((entry) => ({
      id: entry.ledgerId,
      title: entry.description || "Caregiver earning",
      date: new Date(entry.createdAt).toLocaleString(),
      timestamp: new Date(entry.createdAt).getTime(),
      amount: `${entry.type === "withdrawal" ? "-" : "+"} ${money(entry.amount)}`,
      type: entry.type === "withdrawal" ? "withdrawal" : "income",
      status: entry.status,
      payslip:
        entry.status === "completed"
          ? { type: "earning", id: entry.ledgerId }
          : null,
    })),
    ...wallet.payouts.map((payout) => ({
      id: payout.payoutId,
      title:
        payout.source === "admin_assignment_payout"
          ? `${payout.clientName || "Client"} · ${payout.careType || "Care service"} payment`
          : `Withdrawal to ${payout.method || "wallet"}`,
      date: new Date(payout.requestedAt).toLocaleString(),
      timestamp: new Date(payout.requestedAt).getTime(),
      amount:
        payout.source === "admin_assignment_payout"
          ? `+ ${money(payout.amount)}`
          : `- ${money(payout.amount)}`,
      type:
        payout.source === "admin_assignment_payout"
          ? "income"
          : "withdrawal",
      status: payout.status,
      payslip:
        payout.status === "paid"
          ? { type: "payout", id: payout.payoutId }
          : null,
    })),
  ].sort((left, right) => right.timestamp - left.timestamp);
  const visibleTransactions = showAll ? transactions : transactions.slice(0, 4);
  const generatedDocuments = transactions
    .filter((transaction) => transaction.payslip)
    .map((transaction) => ({
      name: `${transaction.title} Payslip`,
      category: "Payslips",
      period: transaction.date,
      created: transaction.date,
      size: "PDF",
      payslip: transaction.payslip,
    }));
  const documents = generatedDocuments;
  const visibleDocuments =
    documentCategory === "All Documents"
      ? documents
      : documents.filter(
          (document) => document.category === documentCategory,
        );

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  };

  const withdraw = async () => {
    const requested = window.prompt(
      `Available balance: ${money(wallet.availableBalance)}. Enter withdrawal amount (minimum ${money(500)}):`,
    );
    if (!requested) return;
    try {
      await requestWithdrawal(Number(requested), "bkash");
      showNotice("Withdrawal request submitted for administrator processing.");
      await loadWallet();
    } catch (error) {
      showNotice(error.message);
    }
  };

  return (
    <div className="mx-auto max-w-[1020px] px-4 py-6 sm:px-8 sm:py-8">
      <header>
        <p className="text-[#4c5261]">
          Manage your earnings, withdrawals, and financial documents.
        </p>
      </header>

      {notice && (
        <div className="mt-5 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CircleCheck className="size-5 shrink-0" /> {notice}
        </div>
      )}

      <section className="mt-6 grid grid-cols-3 gap-2 md:mt-8 md:gap-5">
        <article className="min-w-0 rounded-xl bg-gradient-to-br from-[#1261da] to-[#0649ad] p-2.5 text-white shadow-lg shadow-blue-900/10 min-[380px]:p-3 md:p-6">
          <p className="text-[9px] uppercase leading-3 tracking-[0.06em] text-blue-100 min-[380px]:text-[10px] md:text-sm md:tracking-[0.12em]">
            Available Balance
          </p>
          <b className="mt-2 block text-lg leading-tight min-[380px]:text-xl md:text-5xl">{money(wallet.availableBalance)}</b>
          <button
            className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg bg-white px-1 py-2 text-[10px] font-semibold text-[#0649ad] shadow-sm transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 min-[380px]:text-xs md:mt-6 md:gap-2 md:py-3 md:text-base"
            type="button"
            onClick={withdraw}
            disabled={Number(wallet.availableBalance || 0) < 500}
          >
            <WalletCards className="hidden size-4 min-[420px]:block md:size-5" />
            <span className="md:hidden">Withdraw</span>
            <span className="hidden md:inline">Withdraw Earnings</span>
          </button>
        </article>

        <SummaryCard
          label="Weekly Earnings"
          value={money(wallet.weeklyEarnings)}
          icon={Banknote}
          footer={<span className="text-[8px] text-[#4c5261] min-[380px]:text-[9px] md:text-xs">{wallet.weeklyEarnings > 0 ? "Completed in the last 7 days" : "No completed earnings yet"}</span>}
        />
        <SummaryCard
          label="Monthly Projection"
          value={money(wallet.monthlyProjection ?? wallet.pendingEarnings ?? 0)}
          icon={TrendingUp}
          footer={<span className="text-[8px] italic leading-3 text-[#4c5261] min-[380px]:text-[9px] md:text-xs"><span className="md:hidden">Pending</span><span className="hidden md:inline">Releases after service and final payment</span></span>}
        />
      </section>

      <section className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_294px]">
        <article className="overflow-hidden rounded-xl border border-[#c5cad8] bg-white">
          <header className="flex items-center border-b border-[#c5cad8] bg-[#edf3ff] px-4 py-4 sm:px-6 sm:py-5">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <button
              className="ml-auto text-xs font-semibold text-[#0649ad] disabled:cursor-not-allowed disabled:opacity-40"
              type="button"
              onClick={() => setShowAll((current) => !current)}
              disabled={transactions.length === 0}
            >
              {showAll ? "Show Less" : "View All"}
            </button>
          </header>
          <div>
            {visibleTransactions.length === 0 && (
              <EmptyState
                icon={Banknote}
                title="No transactions yet"
                description="Earnings will appear here after an assigned care service is completed and recorded."
              />
            )}
            {visibleTransactions.map((transaction) => (
              <div
                className="flex items-center gap-3 border-b border-[#d7dbe7] px-4 py-4 last:border-b-0 sm:gap-4 sm:px-6 sm:py-5"
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
                  <b className="block text-sm sm:truncate sm:text-base">{transaction.title}</b>
                  <small className="text-[#4c5261]">{transaction.date}</small>
                </div>
                <div className="shrink-0 text-right text-sm sm:text-base">
                  <span className={transaction.type === "withdrawal" ? "text-[#101c2d]" : "text-emerald-700"}>
                    {transaction.amount}
                  </span>
                  <small className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                    {transaction.status}
                  </small>
                  {transaction.payslip && (
                    <button
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#0649ad]"
                      type="button"
                      onClick={() =>
                        downloadPaymentPayslip(
                          transaction.payslip.type,
                          transaction.payslip.id,
                        ).catch((error) => showNotice(error.message))
                      }
                    >
                      <Download className="size-3.5" /> SwiftOpsBD Payslip
                    </button>
                  )}
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
              <EmptyState
                compact
                icon={WalletCards}
                title="No payout method"
                description="Add a verified payout method before requesting a withdrawal."
              />
              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#c5cad8] px-4 py-3 font-semibold text-[#4c5261] hover:bg-[#f7f9ff]"
                type="button"
                onClick={() => showNotice("Payout-method setup is not available yet.")}
              >
                <Plus className="size-5" /> Add Method
              </button>
            </div>
          </article>

        </aside>
      </section>

      <section className="mt-8 overflow-hidden rounded-xl border border-[#c5cad8] bg-white">
        <header className="flex flex-col gap-4 border-b border-[#c5cad8] bg-[#edf3ff] px-4 py-5 sm:px-6 md:flex-row md:items-center">
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

        <div className="grid gap-4 p-4 sm:p-6 md:grid-cols-2">
          {visibleDocuments.length === 0 && (
            <div className="md:col-span-2">
              <EmptyState
                icon={FileText}
                title="No financial documents yet"
                description="SwiftOpsBD payslips will be generated after a completed earning or paid payout."
              />
            </div>
          )}
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
                  downloadPaymentPayslip(
                    document.payslip.type,
                    document.payslip.id,
                  ).catch((error) => showNotice(error.message))
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
  <article className="min-w-0 rounded-xl border border-[#c5cad8] bg-white p-2.5 min-[380px]:p-3 md:p-6">
    <div className="flex items-start justify-between">
      <p className="text-[9px] uppercase leading-3 tracking-[0.04em] text-[#4c5261] min-[380px]:text-[10px] md:text-sm md:tracking-[0.1em]">{label}</p>
      <span className="hidden size-8 shrink-0 place-items-center rounded-lg bg-blue-100 text-[#0649ad] min-[380px]:grid md:size-9">
        <Icon className="size-4 md:size-5" />
      </span>
    </div>
    <b className="mt-3 block break-words text-lg font-medium leading-tight min-[380px]:text-xl md:mt-5 md:text-4xl">{value}</b>
    <div className="mt-3 md:mt-5">{footer}</div>
  </article>
);

const EmptyState = ({ icon: Icon, title, description, compact = false }) => (
  <div className={`text-center ${compact ? "py-2" : "px-5 py-10"}`}>
    <span className="mx-auto grid size-11 place-items-center rounded-full bg-blue-50 text-[#0649ad]">
      <Icon className="size-5" />
    </span>
    <b className="mt-3 block text-sm">{title}</b>
    <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-[#667085]">
      {description}
    </p>
  </div>
);

export default CaregiverPayments;
