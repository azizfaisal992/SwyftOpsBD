import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  hasAdminAccess,
  loginAdmin,
  loginAdminWithGoogle,
  resetAdminPassword,
} from "../../services/adminAuthService";

const getAdminLoginError = (error) => {
  const messages = {
    "auth/admin-access-required":
      "This Firebase account is signed in but does not have administrator access.",
    "auth/invalid-credential":
      "The email or password is incorrect. Reset the Firebase Authentication password if you do not know it.",
    "auth/invalid-email": "Enter a valid administrator email address.",
    "auth/user-disabled":
      "This administrator account is disabled in Firebase Authentication.",
    "auth/too-many-requests":
      "Firebase temporarily blocked login attempts. Wait a few minutes or reset the password.",
    "auth/network-request-failed":
      "Firebase could not be reached. Check your internet connection and try again.",
    "auth/unauthorized-domain":
      "This website domain is not authorized in Firebase Authentication.",
    "auth/operation-not-allowed":
      "Email/Password sign-in is not enabled in Firebase Authentication.",
    "auth/invalid-api-key":
      "The frontend Firebase API key is missing or invalid.",
    "auth/popup-blocked":
      "The browser blocked the Google sign-in window. Allow pop-ups and try again.",
    "auth/popup-closed-by-user":
      "Google sign-in was cancelled before it finished.",
  };

  return (
    messages[error?.code] ||
    "Admin sign-in failed. Check the Firebase Authentication account and try again."
  );
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { claims, loading, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(location.state?.error || "");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  if (!loading && user && hasAdminAccess(claims)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your administrator email and password.");
      return;
    }

    setSubmitting(true);
    setError("");
    setNotice("");
    try {
      await loginAdmin({ email, password });
      navigate(location.state?.from || "/admin/dashboard", { replace: true });
    } catch (loginError) {
      setError(getAdminLoginError(loginError));
    } finally {
      setSubmitting(false);
    }
  };

  const sendReset = async () => {
    if (!email.trim()) {
      setError("Enter the administrator email before requesting a password reset.");
      return;
    }

    setSendingReset(true);
    setError("");
    setNotice("");
    try {
      await resetAdminPassword(email);
      setNotice(
        "If this Firebase account can receive password resets, an email has been sent.",
      );
    } catch (resetError) {
      setError(getAdminLoginError(resetError));
    } finally {
      setSendingReset(false);
    }
  };

  const signInWithGoogle = async () => {
    setGoogleSubmitting(true);
    setError("");
    setNotice("");
    try {
      await loginAdminWithGoogle();
      navigate(location.state?.from || "/admin/dashboard", { replace: true });
    } catch (loginError) {
      setError(getAdminLoginError(loginError));
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-[#f4f7fc] lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-[#071b2c] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 -top-32 size-96 rounded-full bg-blue-500/15" />
        <div className="absolute -bottom-44 -left-24 size-[28rem] rounded-full bg-emerald-400/10" />
        <div className="relative flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-[#1974d2] text-xl font-bold">
            S
          </span>
          <div>
            <b className="block text-xl">SwiftOpsBD</b>
            <small className="uppercase tracking-[0.18em] text-slate-400">
              Operational Control
            </small>
          </div>
        </div>
        <div className="relative max-w-xl">
          <span className="grid size-16 place-items-center rounded-2xl bg-blue-500/15">
            <ShieldCheck className="size-8 text-blue-300" />
          </span>
          <h1 className="mt-8 text-4xl font-bold leading-tight">
            Secure administration for safer home care.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-300">
            Manage caregivers, clients, verification, live operations, and
            financial controls from one protected workspace.
          </p>
        </div>
        <p className="relative text-sm text-slate-500">
          © 2026 SwiftOpsBD Dhaka. Authorized personnel only.
        </p>
      </section>

      <main className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid size-11 place-items-center rounded-xl bg-[#1974d2] font-bold text-white">
              S
            </span>
            <b className="text-xl text-[#071b2c]">SwiftOpsBD Admin</b>
          </div>
          <span className="grid size-12 place-items-center rounded-xl bg-[#e6f0ff] text-[#0755d3]">
            <LockKeyhole className="size-6" />
          </span>
          <h1 className="mt-6 text-3xl font-bold">Admin sign in</h1>
          <p className="mt-2 text-[#606878]">
            Enter your authorized administrator credentials.
          </p>

          <form className="mt-8 space-y-5" onSubmit={submit}>
            <button
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#c9cfdd] bg-white px-5 py-3.5 font-semibold text-[#182235] hover:border-[#0755d3] hover:bg-blue-50"
              type="button"
              disabled={googleSubmitting}
              onClick={signInWithGoogle}
            >
              <span className="text-xl font-bold text-[#4285f4]">G</span>
              {googleSubmitting
                ? "Verifying Google account..."
                : "Continue with Google"}
            </button>
            <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-[#7b8494]">
              <span className="h-px flex-1 bg-[#d9deea]" />
              or use email and password
              <span className="h-px flex-1 bg-[#d9deea]" />
            </div>
            <label className="block text-sm font-semibold">
              Admin email
              <input
                className="mt-2 block w-full rounded-xl border border-[#c9cfdd] bg-white px-4 py-3.5 font-normal outline-none focus:border-[#0755d3] focus:ring-2 focus:ring-blue-100"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold">
              Password
              <span className="relative mt-2 block">
                <input
                  className="block w-full rounded-xl border border-[#c9cfdd] bg-white px-4 py-3.5 pr-12 font-normal outline-none focus:border-[#0755d3] focus:ring-2 focus:ring-blue-100"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#606878]"
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </span>
            </label>
            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}
            {notice && (
              <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {notice}
              </p>
            )}
            <button
              className="text-sm font-semibold text-[#0755d3] hover:text-[#0649ad]"
              type="button"
              disabled={sendingReset}
              onClick={sendReset}
            >
              {sendingReset
                ? "Sending password reset..."
                : "Forgot password? Send reset email"}
            </button>
            <button
              className="w-full rounded-xl bg-[#0755d3] px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-900/15 hover:bg-[#0649ad]"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Verifying access..." : "Enter Admin Panel"}
            </button>
          </form>
          <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-800">
            Only Firebase users with a protected administrator custom claim can
            enter this workspace. Public admin registration is disabled.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
