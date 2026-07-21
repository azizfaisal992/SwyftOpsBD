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
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { caregivers } from "../data/findCareData";

const CareCheckout = () => {
  const [params] = useSearchParams();
  const caregiver =
    caregivers.find((item) => item.id === Number(params.get("caregiver"))) ||
    caregivers[0];
  const savedPlan = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("swiftopsbd-care-plan"));
    } catch {
      return null;
    }
  })();
  const estimate = savedPlan?.estimate || {
    careHours: caregiver.rate * 20 * 4,
    medicalPremium: 5000,
    platformFee: 2500,
    total: caregiver.rate * 20 * 4 + 7500,
  };
  const [method, setMethod] = useState("card");
  const [notice, setNotice] = useState("");

  const pay = (event) => {
    event.preventDefault();
    setNotice(
      "Payment details are ready. Real SSLCommerz processing will be connected through the backend later.",
    );
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
          <h1 className="text-lg">Select Payment Method</h1>
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
              SSLCommerz - Credit / Debit Card
            </span>
            <p className="ml-9 text-[#4c5261]">
              Payment processed securely via SSLCommerz
            </p>
            {method === "card" && (
              <div className="mt-6 grid gap-4 border-t pt-6 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  Cardholder Name
                  <input
                    className="client-input mt-2"
                    placeholder="John Doe"
                    required
                  />
                </label>
                <label className="sm:col-span-2">
                  Card Number
                  <input
                    className="client-input mt-2"
                    placeholder="XXXX XXXX XXXX XXXX"
                    inputMode="numeric"
                    required
                  />
                </label>
                <label>
                  Expiry Date
                  <input
                    className="client-input mt-2"
                    placeholder="MM / YY"
                    required
                  />
                </label>
                <label>
                  CVV
                  <input
                    className="client-input mt-2"
                    placeholder="***"
                    required
                  />
                </label>
              </div>
            )}
          </label>
          <label
            className={`mt-4 flex items-center gap-4 rounded-xl border p-5 ${method === "bkash" ? "border-[#0755d3] bg-[#eef2ff]" : ""}`}
          >
            <input
              type="radio"
              checked={method === "bkash"}
              onChange={() => setMethod("bkash")}
            />
            <span>
              <b>bKash Mobile Wallet</b>
              <small className="block">
                Pay directly via your bKash account
              </small>
            </span>
          </label>
          {notice && (
            <p className="mt-5 rounded bg-emerald-50 p-4 text-sm text-emerald-700">
              {notice}
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
              <img
                className="size-16 rounded-xl object-cover"
                src={caregiver.image}
                alt=""
              />
              <div>
                <b>{caregiver.name}</b>
                <p>{caregiver.role}</p>
                <small className="text-emerald-700">
                  <BadgeCheck className="inline size-3" /> Highly Recommended
                </small>
              </div>
            </div>
            <dl className="mt-6 space-y-5">
              {[
                ["Care Services", estimate.careHours],
                ["Medical Premium", estimate.medicalPremium],
                ["Service & Platform Fee", estimate.platformFee],
              ].map(([label, value]) => (
                <div className="flex justify-between" key={label}>
                  <dt>{label}</dt>
                  <dd>৳{value.toLocaleString()}</dd>
                </div>
              ))}
              <div className="flex justify-between border-t pt-5">
                <dt>Total Amount</dt>
                <dd className="text-xl font-semibold text-[#0649ad]">
                  ৳{estimate.total.toLocaleString()}
                </dd>
              </div>
            </dl>
            <button
              className="mt-6 flex w-full justify-center gap-2 rounded-lg bg-[#0649ad] py-4 text-white"
              type="submit"
              onClick={pay}
            >
              <LockKeyhole />
              Pay ৳{estimate.total.toLocaleString()} Securely <ArrowRight />
            </button>
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
