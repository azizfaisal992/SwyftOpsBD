import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CircleHelp,
  CreditCard,
  Headphones,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import bkashLogo from "../assets/bkash-logo.svg";
import useCmsContent from "../hooks/useCmsContent";
import { submitCarePlan } from "../services/careRequestService";
import {
  createCarePlanBilling,
  createCheckoutSession,
  downloadSwiftOpsInvoice,
  getPaymentSession,
  simulateCheckout,
} from "../services/paymentService";

const CareCheckout = () => {
  const { publishedContent } = useCmsContent();
  const cms = publishedContent["care-checkout"];
  const [params] = useSearchParams();
  const savedPlan = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("swiftopsbd-care-plan"));
    } catch {
      return null;
    }
  })();
  const caregiver = savedPlan?.selectedCaregiver || {
    id: params.get("caregiver") || "",
    name: "Selected caregiver",
    role: "Verified caregiver",
    rate: 0,
    image: "",
  };
  const estimate = savedPlan?.estimate || {
    careHours: caregiver.rate * 20 * 4,
    medicalPremium: 5000,
    platformFee: 2500,
    total: caregiver.rate * 20 * 4 + 7500,
  };
  const [method, setMethod] = useState("card");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [billing, setBilling] = useState(null);
  const [bkashPhone, setBkashPhone] = useState("");
  const callbackHandled = useRef(false);
  const planId = params.get("plan") || savedPlan?.carePlanId;
  const paymentResult = params.get("payment");
  const paymentSessionId = params.get("payment_session");
  const callbackError =
    paymentResult === "cancel"
      ? "Stripe checkout was cancelled. You can try again."
      : paymentResult === "failed"
        ? "Stripe could not validate the payment."
        : "";
  const pricing = billing?.agreement?.pricing;
  const displayEstimate = pricing
    ? {
        careHours: pricing.serviceSubtotal,
        medicalPremium: pricing.medicalPremium,
        platformFee: pricing.platformFee,
        total: pricing.total,
      }
    : estimate;
  const depositAmount =
    pricing?.depositAmount ?? Math.round(displayEstimate.total * 35) / 100;
  const balanceAmount =
    pricing?.balanceAmount ?? displayEstimate.total - depositAmount;
  const paidDepositInvoice = billing?.invoices?.find(
    (invoice) => invoice.stage === "deposit" && invoice.status === "paid",
  );
  const currency = pricing?.currency || "USD";
  const money = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(Number(value || 0));

  useEffect(() => {
    if (!planId) return;
    createCarePlanBilling(planId)
      .then(setBilling)
      .catch((billingError) => setError(billingError.message));
  }, [planId]);

  useEffect(() => {
    if (paymentResult !== "success" || !paymentSessionId || !planId) return;
    let active = true;
    let attempts = 0;
    const confirmPayment = async () => {
      try {
        const session = await getPaymentSession(paymentSessionId);
        if (!active) return;
        if (session.status === "paid") {
          const updatedBilling = await createCarePlanBilling(planId);
          if (active) {
            setBilling(updatedBilling);
            setNotice("Stripe verified the payment successfully.");
          }
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
  }, [paymentResult, paymentSessionId, planId]);

  useEffect(() => {
    if (
      paymentResult !== "success" ||
      billing?.agreement?.depositStatus !== "paid" ||
      !planId ||
      callbackHandled.current
    ) {
      return;
    }
    callbackHandled.current = true;
    submitCarePlan(planId)
      .then((request) => {
        setRequestId(request.requestId);
        setNotice(
          "Stripe verified the 35% deposit and your care request is published.",
        );
        sessionStorage.removeItem("swiftopsbd-care-plan");
      })
      .catch((requestError) => setError(requestError.message));
  }, [billing, paymentResult, planId]);

  const pay = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!planId) {
      setError("No saved care plan was found. Return to the plan builder.");
      return;
    }
    if (method === "bkash" && !/^01\d{9}$/.test(bkashPhone)) {
      setError("Enter a valid 11-digit Bangladeshi bKash number.");
      return;
    }
    setSubmitting(true);
    try {
      const currentBilling = billing || await createCarePlanBilling(planId);
      setBilling(currentBilling);
      const depositInvoice = currentBilling.invoices.find(
        (invoice) => invoice.stage === "deposit",
      );
      if (!depositInvoice) {
        throw new Error("The booking deposit invoice could not be created.");
      }
      if (depositInvoice.status !== "paid") {
        const session = await createCheckoutSession(
          depositInvoice.invoiceId,
          method === "bkash" ? "bkash" : "stripe",
        );
        if (session.nextAction === "redirect" && session.gatewayUrl) {
          window.location.assign(session.gatewayUrl);
          return;
        }
        await simulateCheckout(
          session.sessionId,
          "successful",
          method === "bkash" ? bkashPhone : "",
        );
      }
      const request = await submitCarePlan(planId);
      setRequestId(request.requestId);
      setNotice(
        "The 35% test booking deposit is recorded and your care request is published. The remaining 65% becomes payable after service completion.",
      );
      sessionStorage.removeItem("swiftopsbd-care-plan");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center px-6">
          <Link className="font-semibold text-[#0649ad]" to="/">
            SwiftOpsBD
          </Link>
          <span className="mx-6 h-8 w-px bg-[#c5cad8]" />
          <span className="flex gap-2">
            <LockKeyhole className="text-emerald-600" />
            Secure Checkout
          </span>
          <span className="ml-auto hidden items-center gap-2 sm:flex">
            <CircleHelp />
            Need help?
          </span>
          <Link
            className="ml-5 flex gap-2 rounded bg-[#eef2ff] px-5 py-3 text-[#0649ad]"
            to="/client/dashboard"
          >
            <ArrowLeft />
            Back to Dashboard
          </Link>
        </div>
      </header>
      <main className="mx-auto grid max-w-7xl gap-8 p-6 lg:grid-cols-[1fr_390px]">
        <form className="rounded-xl border bg-white p-6" onSubmit={pay}>
          <h1 className="text-lg">{cms.headline}</h1>
          <p className="mt-1 text-sm text-[#4c5261]">{cms.subheadline}</p>
          <div className="mt-6 rounded border bg-[#eef2ff] p-4 font-semibold text-[#0649ad]">
            Primary Secure Gateway
          </div>
          <label
            className={`mt-6 block rounded-xl border p-5 ${method === "card" ? "border-[#0755d3] bg-[#eef2ff]" : ""}`}
          >
            <span className="flex items-center gap-3 text-lg">
              <input
                type="radio"
                checked={method === "card"}
                onChange={() => setMethod("card")}
              />
              <CreditCard />
              Stripe - Credit / Debit Card
            </span>
            <p className="ml-9 text-[#4c5261]">
              Payment processed securely through Stripe test Checkout
            </p>
            {method === "card" && (
              <div className="mt-6 rounded-lg border-t bg-white/70 p-4 text-sm text-[#4c5261]">
                Test payments redirect to the Stripe-hosted
                checkout. SwiftOpsBD never collects or stores card numbers or
                CVV values.
              </div>
            )}
          </label>
          <label
            className={`mt-4 block rounded-xl border p-5 ${method === "bkash" ? "border-[#0755d3] bg-[#fff0f5]" : ""}`}
          >
            <span className="flex items-center gap-4">
              <input
                type="radio"
                checked={method === "bkash"}
                onChange={() => setMethod("bkash")}
              />
              <img
                className="size-11 rounded-lg"
                src={bkashLogo}
                alt="bKash"
              />
              <span>
                <b>bKash Mobile Wallet</b>
                <small className="block">
                  Simple demo checkout for local testing
                </small>
              </span>
            </span>
            {method === "bkash" && (
              <div className="mt-5 border-t border-pink-200 pt-4">
                <label className="text-sm font-semibold" htmlFor="bkash-phone">
                  bKash account number
                </label>
                <input
                  className="mt-2 w-full rounded-lg border border-pink-200 bg-white px-4 py-3 outline-none focus:border-pink-500"
                  id="bkash-phone"
                  inputMode="numeric"
                  maxLength={11}
                  value={bkashPhone}
                  onChange={(event) =>
                    setBkashPhone(event.target.value.replace(/\D/g, ""))
                  }
                  placeholder="01XXXXXXXXX"
                />
                <p className="mt-2 text-xs text-pink-700">
                  Demo only: no PIN or OTP is collected and no wallet is
                  charged.
                </p>
              </div>
            )}
          </label>
          {notice && (
            <p className="mt-5 rounded bg-emerald-50 p-4 text-sm text-emerald-700">
              {notice}
            </p>
          )}
          {(error || callbackError) && (
            <p className="mt-5 rounded bg-red-50 p-4 text-sm text-red-700" role="alert">
              {error || callbackError}
            </p>
          )}
          <div className="mt-10 flex flex-wrap justify-around gap-4 text-sm uppercase tracking-[.12em] text-[#747b8a]">
            <span>
              <ShieldCheck className="inline" /> SSL Secured
            </span>
            <span>PCI DSS Compliant</span>
            <span>256-bit Encryption</span>
          </div>
        </form>
        <aside className="space-y-4">
          <section className="rounded-xl border bg-white p-6">
            <h2 className="text-lg">Summary</h2>
            <div className="mt-5 flex gap-4 bg-[#f5f6f8] p-4">
              {caregiver.image ? (
                <img
                  className="size-16 rounded-xl object-cover"
                  src={caregiver.image}
                  alt={caregiver.name}
                />
              ) : (
                <span className="grid size-16 place-items-center rounded-xl bg-blue-100 font-semibold text-[#0649ad]">
                  CG
                </span>
              )}
              <div>
                <b>{caregiver.name}</b>
                <p>{caregiver.role}</p>
                <small className="text-emerald-700">
                  <BadgeCheck className="inline size-3" /> Highly Recommended
                </small>
              </div>
            </div>
            <dl className="mt-6 space-y-5">
              {(savedPlan?.serviceStartDate || pricing?.serviceStartDate) && (
                <div className="rounded-lg bg-[#f5f7ff] p-3 text-sm">
                  <dt className="text-[#606878]">Service period</dt>
                  <dd className="mt-1 font-semibold">
                    {pricing?.serviceStartDate || savedPlan.serviceStartDate}
                    {" → "}
                    {pricing?.serviceEndDate || savedPlan.serviceEndDate}
                  </dd>
                </div>
              )}
              {[
                ["Care Services", displayEstimate.careHours],
                ["Medical Premium", displayEstimate.medicalPremium],
                ["Service & Platform Fee", displayEstimate.platformFee],
              ].map(([label, value]) => (
                <div className="flex justify-between" key={label}>
                  <dt>{label}</dt>
                  <dd>{money(value)}</dd>
                </div>
              ))}
              <div className="flex justify-between border-t pt-5">
                <dt>Total Amount</dt>
                <dd className="text-xl font-semibold text-[#0649ad]">
                  {money(displayEstimate.total)}
                </dd>
              </div>
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex justify-between font-semibold text-[#0649ad]">
                  <dt>Due now — 35% deposit</dt>
                  <dd>{money(depositAmount)}</dd>
                </div>
                <div className="mt-2 flex justify-between text-sm text-[#4c5261]">
                  <dt>After service — 65%</dt>
                  <dd>{money(balanceAmount)}</dd>
                </div>
              </div>
            </dl>
            <button
              className="mt-6 flex w-full justify-center gap-2 rounded-lg bg-[#0649ad] py-4 text-white"
              type="submit"
              onClick={pay}
              disabled={submitting || Boolean(requestId)}
            >
              <LockKeyhole />
              {submitting
                ? "Processing deposit..."
                : requestId
                  ? "Request submitted"
                  : `Pay deposit & submit — ${money(depositAmount)}`}{" "}
              <ArrowRight />
            </button>
            <p className="mt-3 text-center text-xs leading-5 text-[#687083]">
              Stripe test mode uses dummy card data and never moves real money.
            </p>
            {paidDepositInvoice && (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button
                  className="rounded-lg border border-[#0649ad] px-3 py-2 text-sm font-semibold text-[#0649ad]"
                  type="button"
                  onClick={() => downloadSwiftOpsInvoice(
                    paidDepositInvoice.invoiceId,
                  ).catch((downloadError) => setError(downloadError.message))}
                >
                  SwiftOpsBD Invoice
                </button>
                {paidDepositInvoice.stripeInvoiceUrl && (
                  <a
                    className="rounded-lg border border-violet-500 px-3 py-2 text-center text-sm font-semibold text-violet-700"
                    href={paidDepositInvoice.stripeInvoiceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Stripe Invoice
                  </a>
                )}
              </div>
            )}
            {requestId && (
              <Link
                className="mt-4 block text-center text-sm font-semibold text-[#0649ad]"
                to="/client/dashboard"
              >
                Return to dashboard
              </Link>
            )}
          </section>
          <section className="rounded-xl border border-emerald-700 bg-[#9df2c8] p-6 text-emerald-800">
            <h2 className="flex gap-2 text-lg font-semibold">
              <Headphones />
              Payment Assistance
            </h2>
            <p className="mt-2">Our Dhaka support team is available 24/7.</p>
            <b className="mt-4 block underline">+880 1234-56789</b>
          </section>
        </aside>
      </main>
    </div>
  );
};
export default CareCheckout;
