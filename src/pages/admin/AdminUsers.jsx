import { Grid2X2, UserPlus, UserRound, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { listAdministratorUsers } from "../../services/adminUserService";

const roleStyles = {
  "Super Admin": "bg-blue-100 text-blue-700",
  "Operations Manager": "bg-purple-100 text-purple-700",
  "Finance Officer": "bg-amber-100 text-amber-700",
  Analyst: "bg-slate-200 text-slate-700",
};

const AdminUsers = () => {
  const [usersList, setUsersList] = useState([]);
  const [tab, setTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listAdministratorUsers()
      .then(setUsersList)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-[1100px] p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-xl font-semibold">Admin Management</h1>
          <p className="mt-1 text-sm text-[#515867]">
            Configure operational access controls and manage internal system
            users.
          </p>
        </div>
        <button
          className="flex items-center justify-center gap-2 rounded-lg bg-[#0755d3] px-5 py-2.5 text-sm font-semibold text-white sm:ml-auto"
          type="button"
          title="Administrator invitations will be enabled with the role-management workflow."
        >
          <UserPlus className="size-4" /> Invite Admin User
        </button>
      </div>
      <div className="mt-6 flex gap-6 border-b border-[#c5cad8]">
        <button
          className={`flex items-center gap-2 border-b-2 px-1 py-3 font-semibold ${tab === "users" ? "border-[#0755d3] text-[#0649ad]" : "border-transparent text-[#515867]"}`}
          type="button"
          onClick={() => setTab("users")}
        >
          <Users className="size-5" /> Users
        </button>
        <button
          className={`flex items-center gap-2 border-b-2 px-1 py-3 ${tab === "permissions" ? "border-[#0755d3] font-semibold text-[#0649ad]" : "border-transparent text-[#515867]"}`}
          type="button"
          onClick={() => setTab("permissions")}
        >
          <Grid2X2 className="size-5" /> Permissions Matrix
        </button>
      </div>

      {tab === "users" ? (
        <>
          <section className="mt-6 hidden overflow-hidden rounded-xl border border-[#c5cad8] bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#c5cad8] bg-[#f0f2fa] uppercase text-[#737b8c]">
                <tr>
                  <th className="px-6 py-4">User & Contact</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Last Login</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((user) => (
                  <tr
                    className="border-b border-[#d7dbe7] last:border-0"
                    key={user.uid}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <AdminPhoto user={user} />
                        <span>
                          <b className="block">{user.name}</b>
                          <small className="text-[#737b8c]">{user.email}</small>
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Role role={formatRole(user.role)} />
                    </td>
                    <td className="px-5 py-4 text-[#737b8c]">
                      {formatLastLogin(user.lastLoginAt)}
                    </td>
                    <td className="px-5 py-4">
                      <Status active={user.active} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-right text-xs text-[#737b8c]">
                        Firebase account
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <div className="mt-5 grid gap-3 md:hidden">
            {usersList.map((user) => (
              <article
                className="rounded-xl border border-[#c5cad8] bg-white p-4"
                key={user.uid}
              >
                <div className="flex items-center gap-3">
                  <AdminPhoto user={user} large />
                  <div className="min-w-0 flex-1">
                    <b className="block">{user.name}</b>
                    <small className="block truncate text-[#737b8c]">
                      {user.email}
                    </small>
                  </div>
                  <Status active={user.active} />
                </div>
                <div className="mt-4 flex items-center border-t border-[#e1e4ec] pt-3">
                  <Role role={formatRole(user.role)} />
                  <small className="ml-auto text-[#737b8c]">
                    {formatLastLogin(user.lastLoginAt)}
                  </small>
                </div>
              </article>
            ))}
          </div>
          {!loading && !error && !usersList.length && (
            <p className="mt-6 rounded-xl border bg-white p-8 text-center text-sm text-[#606878]">
              No authorized Firebase administrators were found.
            </p>
          )}
          {loading && (
            <p className="mt-6 text-sm text-[#606878]">Loading authorized administrators…</p>
          )}
          {error && (
            <p className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </>
      ) : (
        <PermissionsMatrix />
      )}
    </div>
  );
};

const PermissionsMatrix = () => (
  <section className="mt-6 overflow-hidden rounded-xl border border-[#c5cad8] bg-white">
    <header className="border-b border-[#c5cad8] bg-[#f0f2fa] p-5">
      <h2 className="font-semibold">Role permissions</h2>
      <p className="mt-1 text-sm text-[#606878]">
        Preview of system access by administrative role.
      </p>
    </header>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead>
          <tr>
            <th className="px-5 py-4">Module</th>
            <th className="px-5 py-4">Super Admin</th>
            <th className="px-5 py-4">Operations</th>
            <th className="px-5 py-4">Finance</th>
            <th className="px-5 py-4">Analyst</th>
          </tr>
        </thead>
        <tbody>
          {[
            "Caregivers & Clients",
            "Verification",
            "Payments",
            "Reports",
            "Admin Users",
          ].map((module, index) => (
            <tr className="border-t border-[#d7dbe7]" key={module}>
              <td className="px-5 py-4 font-medium">{module}</td>
              <td className="px-5 py-4 text-emerald-700">Full access</td>
              <td className="px-5 py-4">{index === 2 ? "View" : "Manage"}</td>
              <td className="px-5 py-4">
                {index === 2 || index === 3 ? "Manage" : "View"}
              </td>
              <td className="px-5 py-4">View only</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
const Role = ({ role }) => (
  <span
    className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase ${roleStyles[role] || roleStyles.Analyst}`}
  >
    {role}
  </span>
);
const formatRole = (role) => String(role || "admin")
  .split("_")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");

const formatLastLogin = (value) => value
  ? new Date(value).toLocaleString()
  : "Never";

const AdminPhoto = ({ user, large = false }) => (
  <span className={`grid shrink-0 place-items-center overflow-hidden rounded-full bg-[#eef3fb] text-[#718096] ${large ? "size-12" : "size-10"}`}>
    {user.photoURL ? (
      <img className="size-full object-cover" src={user.photoURL} alt="" />
    ) : (
      <UserRound className="size-5" aria-hidden="true" />
    )}
  </span>
);

const Status = ({ active }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
    <span className={`size-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`} />
    {active ? "Active" : "Disabled"}
  </span>
);

export default AdminUsers;
