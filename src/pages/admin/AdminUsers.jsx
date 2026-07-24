import { Grid2X2, History, Pencil, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { adminUsers } from "../../data/adminPortalData";

const roleStyles = {
  "Super Admin": "bg-blue-100 text-blue-700",
  "Operations Manager": "bg-purple-100 text-purple-700",
  "Finance Officer": "bg-amber-100 text-amber-700",
  Analyst: "bg-slate-200 text-slate-700",
};

const AdminUsers = () => {
  const [usersList, setUsersList] = useState(adminUsers);
  const [tab, setTab] = useState("users");
  const toggle = (id) =>
    setUsersList((items) =>
      items.map((user) =>
        user.id === id ? { ...user, active: !user.active } : user,
      ),
    );

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
                    key={user.id}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          className="size-10 rounded-full object-cover"
                          src={user.image}
                          alt=""
                        />
                        <span>
                          <b className="block">{user.name}</b>
                          <small className="text-[#737b8c]">{user.email}</small>
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Role role={user.role} />
                    </td>
                    <td className="px-5 py-4 text-[#737b8c]">
                      {user.lastLogin}
                    </td>
                    <td className="px-5 py-4">
                      <Toggle
                        active={user.active}
                        onClick={() => toggle(user.id)}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-5">
                        <button
                          className="text-[#0755d3]"
                          type="button"
                          aria-label={`Edit ${user.name}`}
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          className="text-amber-700"
                          type="button"
                          aria-label={`View ${user.name} history`}
                        >
                          <History className="size-4" />
                        </button>
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
                key={user.id}
              >
                <div className="flex items-center gap-3">
                  <img
                    className="size-12 rounded-full object-cover"
                    src={user.image}
                    alt=""
                  />
                  <div className="min-w-0 flex-1">
                    <b className="block">{user.name}</b>
                    <small className="block truncate text-[#737b8c]">
                      {user.email}
                    </small>
                  </div>
                  <Toggle
                    active={user.active}
                    onClick={() => toggle(user.id)}
                  />
                </div>
                <div className="mt-4 flex items-center border-t border-[#e1e4ec] pt-3">
                  <Role role={user.role} />
                  <small className="ml-auto text-[#737b8c]">
                    {user.lastLogin}
                  </small>
                </div>
              </article>
            ))}
          </div>
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
    className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase ${roleStyles[role]}`}
  >
    {role}
  </span>
);
const Toggle = ({ active, onClick }) => (
  <button
    className={`relative h-6 w-11 rounded-full ${active ? "bg-[#0764b7]" : "bg-slate-300"}`}
    type="button"
    onClick={onClick}
    aria-label="Toggle admin status"
  >
    <span
      className={`absolute top-1 size-4 rounded-full bg-white transition ${active ? "left-6" : "left-1"}`}
    />
  </button>
);

export default AdminUsers;
