import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  Flag,
  Info,
  LoaderCircle,
  Search,
  Send,
  ShieldCheck,
  UserPlus,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  assignAdminConversation,
  flagAdminConversation,
  listAdminConversationMessages,
  listAdminConversations,
  sendAdminSupportMessage,
} from "../../services/communicationService";

const formatTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
};

const supportUser = (conversation) =>
  conversation?.participants?.find((participant) =>
    ["client", "caregiver"].includes(participant.role)) ||
  { name: "Portal user", role: "user" };

const initials = (name) =>
  String(name || "SW").split(/\s+/).slice(0, 2)
    .map((part) => part[0]).join("").toUpperCase();

const AdminMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reply, setReply] = useState("");
  const [mobilePanel, setMobilePanel] = useState("list");

  const loadConversations = useCallback(async () => {
    try {
      const records = await listAdminConversations({
        flagged: filter === "flagged",
      });
      setConversations(records);
      setActiveId((current) =>
        records.some((record) => record.conversationId === current)
          ? current
          : records[0]?.conversationId || "");
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const loadMessages = useCallback(async (conversationId) => {
    if (!conversationId) return setMessages([]);
    try {
      setMessages(await listAdminConversationMessages(conversationId));
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(loadConversations, 0);
    const timer = window.setInterval(loadConversations, 8000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, [loadConversations]);

  useEffect(() => {
    if (!activeId) return undefined;
    const initial = window.setTimeout(() => loadMessages(activeId), 0);
    const timer = window.setInterval(() => loadMessages(activeId), 8000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, [activeId, loadMessages]);

  const active = conversations.find(
    (conversation) => conversation.conversationId === activeId,
  );
  const activeUser = supportUser(active);
  const visible = useMemo(
    () =>
      conversations.filter((conversation) =>
        `${supportUser(conversation).name} ${conversation.subject} ${conversation.lastMessage?.body || ""}`
          .toLowerCase().includes(query.toLowerCase())),
    [conversations, query],
  );

  const updateConversation = async (operation, successMessage) => {
    if (!active || working) return;
    setWorking(true);
    try {
      await operation();
      await loadConversations();
      setNotice(successMessage);
      window.setTimeout(() => setNotice(""), 2500);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setWorking(false);
    }
  };

  const sendReply = async (event) => {
    event.preventDefault();
    const body = reply.trim();
    if (!active || !body || working) return;
    setWorking(true);
    try {
      const message = await sendAdminSupportMessage(
        active.conversationId,
        body,
      );
      setMessages((current) => [...current, message]);
      setReply("");
      await loadConversations();
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="relative h-[calc(100vh-64px)] min-h-[600px] overflow-hidden bg-white lg:h-screen">
      {notice && (
        <p className="absolute left-1/2 top-3 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm text-white shadow-xl">
          <CheckCircle2 className="size-4" />{notice}
        </p>
      )}
      <header className="hidden h-16 items-center border-b px-6 lg:flex">
        <h1 className="text-xl font-semibold">Messages & Calls Oversight</h1>
        <span className="ml-3 rounded-full bg-slate-100 px-3 py-1 text-xs text-[#687184]">
          Read-only audit workspace
        </span>
      </header>
      {error && (
        <p className="absolute left-1/2 top-3 z-40 -translate-x-1/2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid h-full lg:h-[calc(100%-64px)] lg:grid-cols-[300px_minmax(0,1fr)_290px]">
        <aside className={`${mobilePanel === "list" ? "flex" : "hidden"} min-h-0 flex-col border-r bg-white lg:flex`}>
          <div className="space-y-3 p-4">
            <label className="flex items-center gap-2 rounded-lg border bg-[#f8f9ff] px-3 py-3">
              <Search className="size-4 text-[#687184]" />
              <input className="min-w-0 flex-1 bg-transparent outline-none" placeholder="Search conversations..." value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
            <div className="flex gap-2">
              {["all", "flagged"].map((item) => (
                <button className={`rounded-full px-4 py-2 text-xs font-semibold capitalize ${filter === item ? "bg-[#0755b7] text-white" : "bg-slate-100"}`} key={item} type="button" onClick={() => setFilter(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto border-t">
            {loading ? <LoaderCircle className="mx-auto mt-12 size-7 animate-spin text-[#0755b7]" /> : visible.map((conversation) => {
              const itemUser = supportUser(conversation);
              return (
                <button className={`flex w-full gap-3 border-b border-l-4 p-4 text-left ${activeId === conversation.conversationId ? "border-l-[#0755b7] bg-[#e7efff]" : "border-l-transparent hover:bg-slate-50"}`} key={conversation.conversationId} type="button" onClick={() => { setActiveId(conversation.conversationId); setMobilePanel("chat"); }}>
                  <span className="relative h-11 w-12 shrink-0">
                    <i className="absolute left-0 top-0 grid size-9 place-items-center rounded-full border-2 border-white bg-blue-100 text-xs font-semibold text-[#0755b7] not-italic">{initials(itemUser.name)}</i>
                    <i className="absolute bottom-0 right-0 grid size-8 place-items-center rounded-full border-2 border-white bg-emerald-100 text-[10px] font-semibold text-emerald-700 not-italic">SW</i>
                  </span>
                  <span className="min-w-0 flex-1">
                    <b className="block truncate text-sm">{itemUser.name} ↔ Admin Support</b>
                    <small className="block truncate text-[#687184]">{conversation.lastMessage?.body || conversation.subject}</small>
                    <small className="text-[10px] text-[#8a91a0]">{formatTime(conversation.lastMessageAt)}</small>
                  </span>
                  {conversation.flagged && <Flag className="size-4 fill-red-600 text-red-600" />}
                </button>
              );
            })}
            {!loading && !visible.length && <p className="p-8 text-center text-sm text-[#687184]">No real conversations yet.</p>}
          </div>
        </aside>

        <main className={`${mobilePanel === "chat" ? "flex" : "hidden"} min-h-0 min-w-0 flex-col bg-[#f5f7fc] lg:flex`}>
          {active ? <>
            <header className="flex min-h-16 items-center gap-3 border-b bg-white px-4">
              <button className="lg:hidden" type="button" onClick={() => setMobilePanel("list")}><ArrowLeft className="size-5" /></button>
              <span className="min-w-0"><b className="block truncate">{activeUser.name} ↔ Admin Support</b><small className="capitalize text-[#687184]">{activeUser.role} support conversation</small></span>
              <span className="ml-auto hidden items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2 text-[10px] font-semibold uppercase text-[#687184] sm:flex"><Eye className="size-4" />Explicit support thread</span>
              <button className="grid size-9 place-items-center rounded-lg border lg:hidden" type="button" onClick={() => setMobilePanel("details")}><Info className="size-5" /></button>
            </header>
            <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="mx-auto max-w-2xl space-y-5">
                {messages.map((message) => {
                  const adminMessage = message.senderRole === "admin";
                  return (
                    <div className={`flex flex-col ${adminMessage ? "items-end" : "items-start"}`} key={message.messageId}>
                      <small className="mb-1 px-2 font-semibold text-[#687184]">{message.senderName} ({message.senderRole})</small>
                      <p className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm sm:max-w-[72%] ${adminMessage ? "rounded-br-sm bg-[#1265c4] text-white" : "rounded-bl-sm border bg-white"}`}>{message.body}</p>
                      <small className="mt-1 px-2 text-[10px] text-[#8a91a0]">{formatTime(message.createdAt)}</small>
                    </div>
                  );
                })}
                {!messages.length && <p className="pt-16 text-center text-sm text-[#687184]">No messages have been sent in this assignment.</p>}
              </div>
            </div>
            <footer className="border-t bg-white p-3">
              <form className="flex gap-2 rounded-xl border bg-[#f8faff] p-2" onSubmit={sendReply}>
                <input className="min-w-0 flex-1 bg-transparent px-2 outline-none" maxLength={4000} placeholder={`Reply to ${activeUser.name}...`} value={reply} onChange={(event) => setReply(event.target.value)} />
                <button className="grid size-10 place-items-center rounded-lg bg-[#0755b7] text-white disabled:opacity-50" disabled={!reply.trim() || working} type="submit">{working ? <LoaderCircle className="size-5 animate-spin" /> : <Send className="size-5" />}</button>
              </form>
            </footer>
          </> : <div className="grid flex-1 place-items-center text-[#687184]">Select a real assignment conversation.</div>}
        </main>

        <aside className={`${mobilePanel === "details" ? "flex" : "hidden"} min-h-0 flex-col border-l bg-white lg:flex`}>
          <header className="flex items-center border-b p-4 lg:hidden"><b>Conversation details</b><button className="ml-auto" type="button" onClick={() => setMobilePanel("chat")}><X className="size-5" /></button></header>
          {active && <div className="space-y-5 p-5">
            <section><small className="font-semibold uppercase tracking-wide text-[#687184]">Support case</small><div className="mt-2 rounded-xl border bg-[#f8faff] p-4"><b className="text-[#0755b7]">#{active.conversationId}</b><p className="mt-2">{active.subject}</p></div></section>
            <section><small className="font-semibold uppercase tracking-wide text-[#687184]">Participant</small><Participant participant={activeUser} /></section>
            <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><ShieldCheck className="mb-2 size-5" />This user explicitly opened a conversation with SwiftOpsBD Support. Private client–caregiver conversations are not available here.</section>
            <button className={`flex w-full items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 font-semibold ${active.flagged ? "border-red-600 bg-red-50 text-red-700" : "border-slate-300"}`} disabled={working} type="button" onClick={() => updateConversation(() => flagAdminConversation(active.conversationId, !active.flagged, active.flagged ? "" : "Support follow-up required"), active.flagged ? "Flag removed." : "Support conversation flagged.")}><Flag className="size-4" />{active.flagged ? "Remove Flag" : "Flag for Follow-up"}</button>
            <button className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold text-white ${active.supportStatus === "assigned" ? "bg-emerald-700" : "bg-[#0755b7]"}`} disabled={working} type="button" onClick={() => updateConversation(() => assignAdminConversation(active.conversationId), "Assigned to support.")}><UserPlus className="size-4" />{active.supportStatus === "assigned" ? "Assigned to Support" : "Assign Support Agent"}</button>
          </div>}
        </aside>
      </div>
    </div>
  );
};

const Participant = ({ participant }) => (
  <div className="mt-3 flex items-center gap-3">
    <span className="grid size-10 place-items-center rounded-full bg-blue-100 text-sm font-semibold text-[#0755b7]">{initials(participant.name)}</span>
    <span><b className="block text-sm">{participant.name}</b><small className="capitalize text-[#687184]">{participant.role}</small></span>
  </div>
);

export default AdminMessages;
