import {
  ArrowRight,
  CircleAlert,
  CreditCard,
  Download,
  LoaderCircle,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PortalCard from "../../../components/client/portal/PortalCard";
import { submitCarePlan } from "../../../services/careRequestService";
import {
  createCheckoutSession,
  downloadPaymentPayslip,
  downloadSwiftOpsInvoice,
  getPaymentSummary,
  getPaymentSession,
  simulateCheckout,
} from "../../../services/paymentService";

const money = (value, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const publishPaidCareRequests = async (summary) => {
  const paidPlans = (summary.agreements || [])
    .filter(
      (agreement) =>
        agreement.depositStatus === "paid" && agreement.carePlanId,
    )
    .map((agreement) => agreement.carePlanId);
  await Promise.allSettled([...new Set(paidPlans)].map(submitCarePlan));
};

const ClientPayments = () => {
  const [searchParams] = useSearchParams();
  const [summary, setSummary] = useState({
    outstanding: 0,
    paid: 0,
    invoices: [],
    transactions: [],
    agreements: [],
  });
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const paymentResult = searchParams.get("payment");
  const paymentSessionId = searchParams.get("payment_session");
  const callbackNotice =
    paymentResult === "success"
      ? "Stripe checkout completed. The signed webhook is confirming your payment."
      : "";
  const callbackError =
    paymentResult === "cancel"
      ? "Stripe checkout was cancelled."
      : paymentResult === "failed"
        ? "Stripe could not validate the payment."
        : "";

  const load = async () => {
    try {
      const data = await getPaymentSummary();
      await publishPaidCareRequests(data);
      setSummary(data);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    getPaymentSummary()
      .then(async (data) => {
        await publishPaidCareRequests(data);
        if (active) setSummary(data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (paymentResult !== "success" || !paymentSessionId) return;
    let active = true;
    let attempts = 0;
    const confirmPayment = async () => {
      try {
        const session = await getPaymentSession(paymentSessionId);
        if (!active) return;
        if (session.status === "paid") {
          await load();
          if (active) setNotice("Stripe verified the payment successfully.");
          return;
        }
        attempts += 1;
        if (attempts < 15) {
          window.setTimeout(confirmPayment, 1000);
        } else {
          setError(
            "Stripe returned successfully, but webhook confirmation is still pending.",
          );
        }
      } catch (confirmationError) {
        if (active) setError(confirmationError.message);
      }
    };
    confirmPayment();
    return () => {
      active = false;
    };
  }, [paymentResult, paymentSessionId]);

  const records = useMemo(
    () => [
      ...summary.invoices.map((invoice) => ({
        id: invoice.invoiceId,
        description: invoice.description,
        date: invoice.createdAt,
        amount: invoice.total,
        status: invoice.status,
        invoice,
        payslip:
          invoice.status === "paid" && invoice.transactionId
            ? { type: "transaction", id: invoice.transactionId }
            : null,
      })),
      ...summary.transactions
        .filter((transaction) =>
          !summary.invoices.some(
            (invoice) => invoice.transactionId === transaction.transactionId,
          ),
        )
        .map((transaction) => ({
          id: transaction.transactionId,
          description: transaction.description,
          date: transaction.createdAt,
          amount: transaction.amount,
          status: transaction.status,
          payslip:
            transaction.status === "successful"
              ? { type: "transaction", id: transaction.transactionId }
              : null,
        })),
    ].sort((a, b) => String(b.date).localeCompare(String(a.date))),
    [summary],
  );

  const payableInvoices = summary.invoices.filter((invoice) =>
    ["pending", "failed"].includes(invoice.status));
  const lockedInvoices = summary.invoices.filter(
    (invoice) => invoice.status === "locked",
  );
  const payable = payableInvoices[0];
  const activeAgreement = summary.agreements?.find(
    (agreement) => agreement.status !== "settled",
  ) || summary.agreements?.[0];
  const currency =
    activeAgreement?.pricing?.currency ||
    summary.invoices?.[0]?.currency ||
    summary.transactions?.[0]?.currency ||
    "USD";

  const payInvoice = async (invoice) => {
    if (!invoice || paying) return;
    setPaying(invoice.invoiceId);
    setError("");
    setNotice("Opening secure Stripe test checkout...");
    try {
      const session = await createCheckoutSession(
        invoice.invoiceId,
        "stripe",
      );
      if (session.nextAction === "redirect" && session.gatewayUrl) {
        window.location.assign(session.gatewayUrl);
        return;
      }
      await simulateCheckout(session.sessionId, "successful");
      if (invoice.stage === "deposit" && invoice.carePlanId) {
        await submitCarePlan(invoice.carePlanId);
      }
      setNotice(
        "Test payment completed. No real money was charged in local mode.",
      );
      await load();
    } catch (requestError) {
      setError(requestError.message);
      setNotice("");
    } finally {
      setPaying("");
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-[55vh] place-items-center">
        <LoaderCircle className="size-9 animate-spin text-[#0649ad]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1030px] p-5 sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <header>
          <h1 className="text-3xl font-semibold tracking-[-0.03em]">
            Payments Management
          </h1>
          <p className="mt-2 max-w-xl text-[#4c5261]">
            Real invoices and payment records linked to your authenticated
            client account.
          </p>
        </header>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-[#c5cad8] bg-white px-5 py-3" type="button">
            <Download className="size-4" /> Statement
          </button>
          <button
            className="flex items-center gap-3 rounded-lg bg-[#0649ad] px-6 py-3 text-white disabled:opacity-50"
            type="button"
            disabled={!payable || Boolean(paying)}
            onClick={() => payInvoice(payable)}
          >
            {paying ? "Processing..." : "Pay Now"} <ArrowRight className="size-4" />
          </button>
        </div>
      </div>

      {(notice || error || callbackNotice || callbackError) && (
        <div className={`mt-5 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${error || callbackError ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
          <CircleAlert className="size-4" />{" "}
          {error || callbackError || notice || callbackNotice}
        </div>
      )}

      {activeAgreement && (
        <section className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#0649ad]">
                Staged care-plan billing
              </p>
              <h2 className="mt-1 text-lg font-semibold">
                {activeAgreement.careType}
              </h2>
              <p className="text-sm text-[#4c5261]">
                Deposit: {activeAgreement.depositStatus} · Service:{" "}
                {activeAgreement.serviceStatus} · Balance:{" "}
                {activeAgreement.balanceStatus}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:ml-auto">
              <StageAmount label="Total" value={activeAgreement.pricing?.total} currency={currency} />
              <StageAmount label="Paid first" value={activeAgreement.pricing?.depositAmount} currency={currency} />
              <StageAmount label="After care" value={activeAgreement.pricing?.balanceAmount} currency={currency} />
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
            <span
              className="block h-full bg-[#0755b7] transition-all"
              style={{
                width:
                  activeAgreement.balanceStatus === "paid" ||
                  activeAgreement.status === "settled"
                    ? "100%"
                    : activeAgreement.depositStatus === "paid"
                      ? "35%"
                      : "0%",
              }}
            />
          </div>
        </section>
      )}

      <div className="mt-7 grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl bg-gradient-to-br from-[#0649ad] to-[#2861b3] p-6 text-white">
          <p className="uppercase tracking-[0.08em] text-[#c9d9ff]">
            Total Outstanding
          </p>
          <strong className="mt-2 block text-4xl">
            {money(summary.outstanding, currency)}
          </strong>
          <span className="mt-4 inline-block rounded-full bg-white/20 px-3 py-1 text-xs">
            {payableInvoices.length
              ? `${payableInvoices.length} invoice(s) due now`
              : lockedInvoices.length
                ? "Remaining balance unlocks after care"
                : "Nothing due"}
          </span>
          <p className="mt-12 text-xs text-[#c9d9ff]">Paid to date</p>
          <p>{money(summary.paid, currency)}</p>
        </section>
        <PortalCard className="p-6">
          <div className="flex justify-between">
            <span className="grid size-12 place-items-center rounded bg-pink-100 text-sm font-bold text-pink-600">bKash</span>
            <ShieldCheck className="size-6 fill-emerald-400 text-emerald-500" />
          </div>
          <h2 className="mt-5 font-semibold">Mobile Wallet</h2>
          <p className="text-[#4c5261]">Available after gateway activation</p>
        </PortalCard>
        <PortalCard className="p-6">
          <span className="grid size-12 place-items-center rounded bg-[#e7efff]">
            <CreditCard className="size-6 text-[#0649ad]" />
          </span>
          <h2 className="mt-5 font-semibold">Secure card checkout</h2>
          <p className="text-[#4c5261]">Stripe-hosted test Checkout</p>
        </PortalCard>
      </div>

      <PortalCard className="mt-5 overflow-hidden">
        <div className="border-b border-[#c5cad8] px-6 py-5">
          <h2 className="text-xl font-semibold">Invoices & Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-[#eef2ff] text-sm text-[#4c5261]">
              <tr>
                {["Record ID", "Service/Description", "Date", "Amount", "Status", "Actions"].map((heading) => (
                  <th className="px-6 py-4" key={heading}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr className="border-b border-[#c5cad8]" key={record.id}>
                  <td className="px-6 py-5">#{record.id.slice(0, 10)}</td>
                  <td className="px-6 py-5 font-medium">
                    {record.description}
                    {record.invoice?.stage && (
                      <small className="mt-1 block uppercase text-[#687184]">
                        {record.invoice.stage} stage
                      </small>
                    )}
                  </td>
                  <td className="px-6 py-5 text-[#4c5261]">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5">{money(record.amount, record.invoice?.currency || currency)}</td>
                  <td className="px-6 py-5">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase ${record.status === "paid" || record.status === "successful" ? "bg-[#9df2c8] text-emerald-700" : record.status === "failed" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {record.invoice && ["pending", "failed"].includes(record.status) ? (
                      <button className="font-semibold text-[#0649ad]" type="button" onClick={() => payInvoice(record.invoice)}>
                        {paying === record.id ? "Processing..." : "Pay Now"}
                      </button>
                    ) : record.invoice?.status === "paid" ? (
                      <div className="flex flex-col items-start gap-2">
                        <button
                          className="inline-flex items-center gap-2 font-semibold text-[#0649ad]"
                          type="button"
                          onClick={() =>
                            downloadSwiftOpsInvoice(record.invoice.invoiceId)
                              .catch((downloadError) =>
                                setError(downloadError.message))
                          }
                        >
                          <Download className="size-4" /> SwiftOpsBD Invoice
                        </button>
                        {record.invoice.stripeInvoiceUrl && (
                          <a
                            className="inline-flex items-center gap-2 font-semibold text-violet-700"
                            href={record.invoice.stripeInvoiceUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <CreditCard className="size-4" /> Stripe Invoice
                          </a>
                        )}
                      </div>
                    ) : record.payslip ? (
                      <button
                        className="inline-flex items-center gap-2 font-semibold text-[#0649ad]"
                        type="button"
                        onClick={() =>
                          downloadPaymentPayslip(
                            record.payslip.type,
                            record.payslip.id,
                          ).catch((downloadError) =>
                            setError(downloadError.message),
                          )
                        }
                      >
                        <Download className="size-4" /> SwiftOpsBD Receipt
                      </button>
                    ) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!records.length && (
          <p className="p-10 text-center text-sm text-[#667085]">
            No invoices have been created for your account.
          </p>
        )}
      </PortalCard>

      <section className="mt-7 flex flex-col gap-6 overflow-hidden rounded-3xl bg-[#005b4c] p-8 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Secure healthcare payments</h2>
          <p className="mt-3 max-w-xl text-[#b5e8db]">
            Production charging remains disabled until verified gateway
            credentials and callbacks are configured.
          </p>
        </div>
        <WalletCards className="size-28 shrink-0 text-[#9ce1d1]" />
      </section>
    </div>
  );
};

export default ClientPayments;

const StageAmount = ({ label, value, currency }) => (
  <span className="rounded-lg bg-white px-3 py-2 text-center shadow-sm">
    <small className="block text-[10px] uppercase text-[#687184]">{label}</small>
    <b className="text-sm">{money(value, currency)}</b>
  </span>
);
