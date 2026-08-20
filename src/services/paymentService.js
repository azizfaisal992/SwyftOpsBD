import { apiDownload, apiRequest } from "./apiClient";

export const getPaymentSummary = () => apiRequest("/payments/summary");

export const listMyInvoices = () => apiRequest("/payments/invoices");

export const listMyPaymentTransactions = () =>
  apiRequest("/payments/transactions");

export const listMyBillingAgreements = () =>
  apiRequest("/payments/billing");

export const createCarePlanBilling = (carePlanId) =>
  apiRequest(
    `/payments/care-plans/${encodeURIComponent(carePlanId)}/billing`,
    {
      method: "POST",
      body: JSON.stringify({}),
    },
  );

export const createCheckoutSession = (invoiceId, provider) =>
  apiRequest(`/payments/invoices/${encodeURIComponent(invoiceId)}/checkout`, {
    method: "POST",
    body: JSON.stringify({ provider }),
  });

export const getPaymentSession = (sessionId) =>
  apiRequest(`/payments/sessions/${encodeURIComponent(sessionId)}`);

export const simulateCheckout = (
  sessionId,
  outcome = "successful",
  phone = "",
) =>
  apiRequest(`/payments/sessions/${encodeURIComponent(sessionId)}/simulate`, {
    method: "POST",
    body: JSON.stringify({ outcome, phone }),
  });

export const downloadPaymentPayslip = async (recordType, recordId) => {
  const { blob, filename } = await apiDownload(
    `/payments/payslips/${encodeURIComponent(recordType)}/${encodeURIComponent(recordId)}`,
  );
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

export const downloadSwiftOpsInvoice = async (invoiceId) => {
  const { blob, filename } = await apiDownload(
    `/payments/invoices/${encodeURIComponent(invoiceId)}/swiftopsbd-invoice`,
  );
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

export const requestWithdrawal = (amount, method = "bkash") =>
  apiRequest("/payments/withdrawals", {
    method: "POST",
    body: JSON.stringify({ amount, method }),
  });

export const getAdminFinanceOverview = () =>
  apiRequest("/admin/payments/overview");

export const createAdminInvoice = (invoice) =>
  apiRequest("/admin/payments/invoices", {
    method: "POST",
    body: JSON.stringify(invoice),
  });

export const listAdminAssignmentPayoutQuotes = () =>
  apiRequest("/admin/payments/assignment-payout-quotes");

export const createAdminAssignmentPayout = (payment) =>
  apiRequest("/admin/payments/assignment-payouts", {
    method: "POST",
    body: JSON.stringify(payment),
  });

export const updateAdminPayout = (payoutId, status) =>
  apiRequest(`/admin/payments/payouts/${encodeURIComponent(payoutId)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
