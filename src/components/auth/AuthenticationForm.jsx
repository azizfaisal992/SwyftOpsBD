import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
  requestPasswordReset,
} from "../../services/authService";

const getAuthErrorMessage = (error) => {
  const messages = {
    "auth/email-already-in-use": "An account already exists with this email.",
    "auth/invalid-credential": "The email or password is incorrect.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/internal-error": "Google sign-in could not start. Add localhost (or your current website domain) under Firebase Authentication → Settings → Authorized domains, then restart the app.",
    "auth/popup-blocked": "Allow popups in your browser to sign in with Google.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/unauthorized-domain": "This website domain is not authorized in Firebase Authentication settings.",
    "auth/weak-password": "Use a stronger password with at least 8 characters.",
  };

  return messages[error?.code] || error?.message || "Authentication failed. Please try again.";
};

const AuthenticationForm = ({ mode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const accountType = searchParams.get("type");
  const isRegister = mode === "register";
  const roleLabel = accountType === "professional" ? "care professional" : "family";
  const destination = accountType === "professional" ? "/caregiver/profile-setup" : "/";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setNotice("");

    const formData = new FormData(event.currentTarget);

    try {
      if (isRegister) {
        await registerWithEmail({
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
        });
      } else {
        await loginWithEmail({
          email: formData.get("email"),
          password: formData.get("password"),
        });
      }
      navigate(destination);
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage("");
    setNotice("");

    try {
      await loginWithGoogle();
      navigate(destination);
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setErrorMessage("");
    setNotice("");

    if (!email) {
      setErrorMessage("Enter your email address first.");
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(email);
      setNotice("Password reset email sent. Check your inbox.");
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md rounded-2xl border border-[#c3c6d6] bg-white p-6 shadow-xl shadow-[#003d9b]/5 sm:p-8">
      <div className="text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-[#f0f3ff] text-xl text-[#003d9b]" aria-hidden="true">
          {isRegister ? "✦" : "↪"}
        </span>
        <h1 className="mt-4 text-3xl font-semibold">{isRegister ? "Create your account" : "Welcome back"}</h1>
        <p className="mt-2 text-sm leading-6 text-[#434654]">
          {isRegister ? `Join SwiftOpsBD as a ${roleLabel}.` : "Log in to continue to your SwiftOpsBD account."}
        </p>
      </div>

      <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
        {isRegister && (
          <div>
            <label className="auth-label" htmlFor="full-name">Full name</label>
            <input className="auth-input" id="full-name" name="name" placeholder="Enter your full name" autoComplete="name" required />
          </div>
        )}
        <div>
          <label className="auth-label" htmlFor="email">Email address</label>
          <input className="auth-input" id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="auth-label" htmlFor="password">Password</label>
            {!isRegister && <button className="text-xs font-semibold text-[#003d9b]" type="button" onClick={handlePasswordReset}>Forgot password?</button>}
          </div>
          <div className="relative">
            <input
              className="auth-input pr-16"
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={isRegister ? "Create a password" : "Enter your password"}
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength="8"
              required
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#003d9b]" type="button" onClick={() => setShowPassword((value) => !value)}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {isRegister && (
          <label className="flex items-start gap-3 text-xs leading-5 text-[#434654]">
            <input className="mt-1 accent-[#003d9b]" type="checkbox" required />
            <span>I agree to the Terms of Service and Privacy Policy.</span>
          </label>
        )}

        {errorMessage && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{errorMessage}</p>}
        {notice && <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">{notice}</p>}

        <button className="w-full rounded-lg bg-[#003d9b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#002f78] disabled:cursor-wait disabled:opacity-60" type="submit" disabled={loading}>
          {loading ? "Please wait..." : isRegister ? "Create account" : "Log in"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-[#6b7280]">
        <span className="h-px flex-1 bg-[#c3c6d6]" />or continue with<span className="h-px flex-1 bg-[#c3c6d6]" />
      </div>
      <button className="google-auth-button disabled:cursor-wait disabled:opacity-60" type="button" onClick={handleGoogleSignIn} disabled={loading}>
        <svg className="size-7 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M21.35 12.21c0-.71-.06-1.4-.18-2.06H12v3.9h5.24a4.48 4.48 0 0 1-1.94 2.94v2.53h3.15c1.85-1.7 2.9-4.21 2.9-7.31Z" />
          <path fill="#34A853" d="M12 21.72c2.63 0 4.84-.87 6.45-2.2l-3.15-2.53c-.87.59-1.99.94-3.3.94-2.54 0-4.69-1.72-5.46-4.02H3.28v2.61A9.74 9.74 0 0 0 12 21.72Z" />
          <path fill="#FBBC05" d="M6.54 13.91A5.85 5.85 0 0 1 6.23 12c0-.66.11-1.3.31-1.91V7.48H3.28A9.72 9.72 0 0 0 2.26 12c0 1.63.39 3.17 1.02 4.52l3.26-2.61Z" />
          <path fill="#EA4335" d="M12 6.07c1.43 0 2.71.49 3.72 1.45l2.79-2.79A9.36 9.36 0 0 0 12 2.28a9.74 9.74 0 0 0-8.72 5.2l3.26 2.61c.77-2.3 2.92-4.02 5.46-4.02Z" />
        </svg>
        <span>Log In with Google</span>
      </button>

      <p className="mt-7 text-center text-sm text-[#434654]">
        {isRegister ? "Already have an account?" : "New to SwiftOpsBD?"}{" "}
        <Link className="font-semibold text-[#003d9b]" to={isRegister ? "/login" : "/join"}>
          {isRegister ? "Log in" : "Join now"}
        </Link>
      </p>
    </section>
  );
};

export default AuthenticationForm;
