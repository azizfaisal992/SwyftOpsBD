import {
  ArrowLeft,
  CheckCheck,
  LoaderCircle,
  MessageSquareText,
  Search,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { auth } from "../../lib/firebase";
import { listMyAssignments } from "../../services/assignmentService";
import {
  createAssignmentConversation,
  createSupportConversation,
  listConversationMessages,
  listConversations,
  markConversationRead,
  sendConversationMessage,
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

const otherParticipant = (conversation, uid) =>
  conversation?.participants?.find((participant) => participant.uid !== uid) ||
  conversation?.participants?.[0] ||
  { name: "Care participant", role: "user" };

const initials = (name) =>
  String(name || "SW")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const ConversationWorkspace = ({ title = "Secure Messages", description }) => {
  const uid = auth.currentUser?.uid;
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const loadConversations = useCallback(async ({ bootstrap = false } = {}) => {
    try {
      let records = await listConversations();
      if (bootstrap) {
        await createSupportConversation();
        const assignments = await listMyAssignments();
        await Promise.all(
          assignments
            .filter((assignment) =>
              !["cancelled", "rejected"].includes(assignment.status))
            .map((assignment) =>
              createAssignmentConversation(assignment.assignmentId)),
        );
        records = await listConversations();
      }
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
  }, []);

  const loadMessages = useCallback(async (conversationId) => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    try {
      const records = await listConversationMessages(conversationId);
      setMessages(records);
      await markConversationRead(conversationId);
      setConversations((current) =>
        current.map((conversation) =>
          conversation.conversationId === conversationId
            ? { ...conversation, unreadCount: 0 }
            : conversation));
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(
      () => loadConversations({ bootstrap: true }),
      0,
    );
    const timer = window.setInterval(() => loadConversations(), 8000);
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
  const counterpart = otherParticipant(active, uid);
  const visible = useMemo(
    () =>
      conversations.filter((conversation) => {
        const participant = otherParticipant(conversation, uid);
        return `${participant.name} ${conversation.subject} ${conversation.lastMessage?.body || ""}`
          .toLowerCase()
          .includes(query.toLowerCase());
      }),
    [conversations, query, uid],
  );

  const submit = async (event) => {
    event.preventDefault();
    const body = text.trim();
    if (!body || !activeId || sending) return;
    setSending(true);
    try {
      const message = await sendConversationMessage(activeId, body);
      setMessages((current) => [...current, message]);
      setText("");
      await loadConversations();
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1240px] px-3 py-4 sm:px-6 sm:py-6">
      <div className={mobileChatOpen ? "hidden lg:block" : ""}>
        <h1 className="text-2xl font-bold text-[#122033] sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-[#515867]">{description}</p>}
      </div>
      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <section className="mt-5 grid min-h-[650px] overflow-hidden rounded-xl border border-[#c5cad8] bg-white lg:grid-cols-[320px_1fr]">
        <aside className={`${mobileChatOpen ? "hidden lg:block" : "block"} border-r border-[#c5cad8]`}>
          <label className="m-4 flex items-center gap-2 rounded-lg border bg-[#f7f9fd] px-3 py-3">
            <Search className="size-5 text-[#687184]" />
            <input
              className="min-w-0 flex-1 bg-transparent outline-none"
              placeholder="Search conversations..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          {loading ? (
            <LoaderCircle className="mx-auto mt-12 size-7 animate-spin text-[#0755b7]" />
          ) : visible.length ? (
            visible.map((conversation) => {
              const participant = otherParticipant(conversation, uid);
              const selected = conversation.conversationId === activeId;
              return (
                <button
                  className={`flex w-full gap-3 border-l-4 border-t p-4 text-left ${selected ? "border-l-[#0755b7] bg-[#e4edff]" : "border-l-transparent hover:bg-slate-50"}`}
                  key={conversation.conversationId}
                  type="button"
                  onClick={() => {
                    setActiveId(conversation.conversationId);
                    setMobileChatOpen(true);
                  }}
                >
                  <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-[#0755b7] font-semibold text-white">
                    {participant.photoUrl ? (
                      <img className="size-full object-cover" src={participant.photoUrl} alt="" />
                    ) : initials(participant.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <b className="truncate">{participant.name}</b>
                      {conversation.unreadCount > 0 && (
                        <i className="ml-auto grid size-5 place-items-center rounded-full bg-[#0755b7] text-[10px] text-white not-italic">
                          {conversation.unreadCount}
                        </i>
                      )}
                    </span>
                    <small className="block truncate text-[#687184]">
                      {conversation.lastMessage?.body || conversation.subject}
                    </small>
                    <small className="text-[10px] text-[#8a91a0]">
                      {formatTime(conversation.lastMessageAt)}
                    </small>
                  </span>
                </button>
              );
            })
          ) : (
            <div className="px-5 py-12 text-center text-sm text-[#687184]">
              <MessageSquareText className="mx-auto mb-3 size-8" />
              No assignment conversation is available yet.
            </div>
          )}
        </aside>

        <main className={`${mobileChatOpen ? "flex" : "hidden lg:flex"} min-w-0 flex-col bg-[#f8faff]`}>
          {active ? (
            <>
              <header className="flex items-center gap-3 border-b bg-white p-4">
                <button className="lg:hidden" type="button" onClick={() => setMobileChatOpen(false)}>
                  <ArrowLeft className="size-5" />
                </button>
                <span className="grid size-10 place-items-center rounded-full bg-[#0755b7] text-sm font-semibold text-white">
                  {initials(counterpart.name)}
                </span>
                <span>
                  <b className="block">{counterpart.name}</b>
                  <small className="capitalize text-emerald-700">
                    {counterpart.role} · {active.subject}
                  </small>
                </span>
                <span className="ml-auto hidden items-center gap-1 text-xs text-[#687184] sm:flex">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  {active.type === "support"
                    ? "Private support thread"
                    : "Private to assigned participants"}
                </span>
              </header>
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
                {messages.length ? messages.map((message) => {
                  const mine = message.senderId === uid;
                  return (
                    <div className={`flex flex-col ${mine ? "items-end" : "items-start"}`} key={message.messageId}>
                      <small className="mb-1 px-2 text-[#687184]">{message.senderName}</small>
                      <p className={`max-w-[88%] rounded-2xl px-4 py-3 sm:max-w-[70%] ${mine ? "rounded-br-sm bg-[#0755b7] text-white" : "rounded-bl-sm border bg-white"}`}>
                        {message.body}
                      </p>
                      <small className="mt-1 flex items-center gap-1 px-2 text-[10px] text-[#8a91a0]">
                        {formatTime(message.createdAt)}
                        {mine && <CheckCheck className="size-3 text-emerald-600" />}
                      </small>
                    </div>
                  );
                }) : (
                  <p className="pt-16 text-center text-sm text-[#687184]">
                    Start the secure conversation about this care assignment.
                  </p>
                )}
              </div>
              <form className="m-3 flex gap-2 rounded-xl border bg-white p-3 shadow-sm sm:m-4" onSubmit={submit}>
                <input
                  className="min-w-0 flex-1 outline-none"
                  maxLength={4000}
                  placeholder="Type a secure message..."
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                />
                <button
                  className="grid size-11 place-items-center rounded-lg bg-[#0755b7] text-white disabled:opacity-50"
                  type="submit"
                  disabled={!text.trim() || sending}
                >
                  {sending ? <LoaderCircle className="size-5 animate-spin" /> : <Send className="size-5" />}
                </button>
              </form>
            </>
          ) : (
            <div className="grid flex-1 place-items-center p-8 text-center text-[#687184]">
              Select a conversation after an assignment is approved.
            </div>
          )}
        </main>
      </section>
    </div>
  );
};

export default ConversationWorkspace;
