import AuthenticationForm from "../components/auth/AuthenticationForm";
import AuthShell from "../components/auth/AuthShell";

const Authentication = ({ mode = "login" }) => (
  <AuthShell>
    <AuthenticationForm mode={mode} />
  </AuthShell>
);

export default Authentication;
