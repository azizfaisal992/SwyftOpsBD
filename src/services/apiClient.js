import { auth } from "../lib/firebase";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const API_PREFIX = "/api/v1";
const inFlightGetRequests = new Map();

export class ApiClientError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "ApiClientError";
    this.code = options.code || "API_ERROR";
    this.status = options.status || 0;
    this.fields = options.fields;
    this.details = options.details;
    this.requestId = options.requestId;
  }
}

const currentAuthenticatedUser = async () => {
  // Firebase restores persisted sessions asynchronously after a page load.
  // Waiting here prevents protected API calls from briefly treating a valid
  // returning user as signed out.
  if (typeof auth.authStateReady === "function") {
    await auth.authStateReady();
  }
  return auth.currentUser;
};

export const apiRequest = async (path, options = {}) => {
  const {
    authenticated = true,
    headers: suppliedHeaders,
    ...fetchOptions
  } = options;
  const user = authenticated ? await currentAuthenticatedUser() : null;
  if (authenticated && !user) {
    throw new ApiClientError("Sign in before accessing this feature.", {
      code: "UNAUTHENTICATED",
      status: 401,
    });
  }

  const method = String(fetchOptions.method || "GET").toUpperCase();
  const sendRequest = async (forceTokenRefresh = false) => {
    const headers = new Headers(suppliedHeaders);
    if (authenticated) {
      headers.set(
        "Authorization",
        `Bearer ${await user.getIdToken(forceTokenRefresh)}`,
      );
    }
    if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }
    return fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
      ...fetchOptions,
      cache: fetchOptions.cache ?? "no-store",
      headers,
    });
  };

  const executeRequest = async () => {
    let response = await sendRequest();
    if (authenticated && response.status === 401) {
      response = await sendRequest(true);
    }
    const payload = response.status === 204
      ? {}
      : await response.json().catch(() => ({}));

    if (!response.ok) {
      const apiError = payload.error;
      throw new ApiClientError(
        typeof apiError === "string"
          ? apiError
          : apiError?.message || "The API request could not be completed.",
        {
          code: apiError?.code,
          status: response.status,
          fields: apiError?.fields,
          details: apiError?.details,
          requestId:
            apiError?.requestId || response.headers.get("x-request-id"),
        },
      );
    }

    return payload.data;
  };

  // React Strict Mode intentionally repeats effects during development.
  // Share identical concurrent reads so Firestore/Supabase are queried once,
  // while keeping completed responses uncached for live operational data.
  if (method === "GET" && !fetchOptions.body && !fetchOptions.signal) {
    const requestKey = `${authenticated ? user.uid : "public"}:${path}`;
    const pendingRequest = inFlightGetRequests.get(requestKey);
    if (pendingRequest) return pendingRequest;

    const request = executeRequest().finally(() => {
      inFlightGetRequests.delete(requestKey);
    });
    inFlightGetRequests.set(requestKey, request);
    return request;
  }

  return executeRequest();
};

export const apiDownload = async (path) => {
  const user = await currentAuthenticatedUser();
  if (!user) {
    throw new ApiClientError("Sign in before downloading this file.", {
      code: "UNAUTHENTICATED",
      status: 401,
    });
  }
  const request = async (forceTokenRefresh = false) =>
    fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
      headers: {
        Authorization: `Bearer ${await user.getIdToken(forceTokenRefresh)}`,
      },
    });
  let response = await request();
  if (response.status === 401) response = await request(true);
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new ApiClientError(
      payload.error?.message || "The file could not be downloaded.",
      {
        code: payload.error?.code,
        status: response.status,
      },
    );
  }
  const disposition = response.headers.get("content-disposition") || "";
  const filename =
    disposition.match(/filename="([^"]+)"/)?.[1] || "SwiftOpsBD-Payslip.pdf";
  return { blob: await response.blob(), filename };
};
