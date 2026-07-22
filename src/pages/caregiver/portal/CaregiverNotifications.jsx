import {
  ArrowLeft,
  Bell,
  Building2,
  CheckCheck,
  Download,
  FileText,
  Image,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Send,
  Siren,
  UserRoundSearch,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const conversations = [
  {
    id: "admin",
    name: "Admin Office",
    initials: "AD",
    preview: "Please confirm Fatema's visit for tomorrow...",
    time: "10:32 AM",
    color: "bg-[#0748a8]",
    unread: true,
  },
  {
    id: "fatema",
    name: "Fatema Begum",
    initials: "FB",
    preview: "I need you to bring my BP medicine...",
    time: "09:15 AM",
    color: "bg-emerald-300 text-emerald-900",
    unread: true,
  },
  {
    id: "support",
    name: "Support Team",
    initials: "ST",
    preview: "Your weekly report has been reviewed.",
    time: "Yesterday",
    color: "bg-amber-700",
  },
  {
    id: "karim",
    name: "Abdul Karim",
    initials: "AK",
    preview: "Can we reschedule Thursday's visit?",
    time: "Yesterday",
    color: "bg-blue-100 text-[#0649ad]",
  },
];

const initialCalls = [
  { contact: "Fatema Begum", time: "Today, 10:00 AM", duration: "5:23 min", status: "Outgoing" },
  { contact: "Admin Office", time: "Today, 09:30 AM", duration: "3:10 min", status: "Incoming" },
  { contact: "Abdul Karim", time: "Yesterday, 04:15 PM", duration: "--", status: "Missed" },
];

const Avatar = ({ conversation, small = false }) => (
  <span
    className={`relative grid shrink-0 place-items-center rounded-full font-semibold ${small ? "size-8 text-xs" : "size-12"} ${conversation.color}`}
  >
    {conversation.initials}
    {!small && conversation.id !== "support" && (
      <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-emerald-500" />
    )}
  </span>
);

const CaregiverNotifications = () => {
  const [activeId, setActiveId] = useState("admin");
  const [tab, setTab] = useState("messages");
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [sent, setSent] = useState([]);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const activeConversation =
    conversations.find((conversation) => conversation.id === activeId) ??
    conversations[0];

  const sidebarCalls = useMemo(
    () =>
      initialCalls.filter((call) =>
        call.contact.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );
  const visibleConversations = useMemo(
    () =>
      conversations.filter((conversation) =>
        `${conversation.name} ${conversation.preview}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [search],
  );

  const sendMessage = (event) => {
    event.preventDefault();
    const message = text.trim();
    if (!message) return;
    setSent((current) => [...current, message]);
    setText("");
  };

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-5 sm:px-6 sm:py-6">
      <header className={`mb-5 sm:mb-6 ${mobileChatOpen ? "hidden lg:block" : ""}`}>
        <p className="text-sm text-[#4c5261] sm:text-base">
          Manage client messages, support conversations, and recent calls.
        </p>
      </header>
      <section className={`flex flex-col gap-3 rounded-xl border border-[#efb66f] bg-[#ffddb3] px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-6 ${mobileChatOpen ? "hidden lg:flex" : ""}`}>
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#fff1dc] text-amber-700">
          <Bell className="size-5" />
        </span>
        <p className="flex-1 text-sm sm:text-base">
          You have 1 new client request from Rabela Akter awaiting your response.
        </p>
        <Link
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#704000] px-6 py-3 text-sm font-semibold text-white sm:w-auto"
          to="/caregiver/requested-clients"
        >
          Review Request <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="mt-6 grid overflow-hidden rounded-xl border border-[#c5cad8] bg-white lg:grid-cols-[285px_1fr]">
        <aside className={`border-b border-[#c5cad8] lg:block lg:border-b-0 lg:border-r ${mobileChatOpen ? "hidden" : "block"}`}>
          <div className="grid grid-cols-2 border-b border-[#c5cad8]">
            {["messages", "calls"].map((item) => (
              <button
                className={`border-b-2 px-3 py-5 font-semibold capitalize ${
                  tab === item
                    ? "border-[#0649ad] text-[#0649ad]"
                    : "border-transparent text-[#4c5261]"
                }`}
                key={item}
                type="button"
                onClick={() => {
                  setTab(item);
                  setSearch("");
                  setMobileChatOpen(false);
                }}
              >
                {item === "calls" ? "Recent Calls" : "Messages"}
              </button>
            ))}
          </div>
          <label className="m-4 flex items-center gap-3 rounded-lg border border-[#c5cad8] bg-[#f8f9ff] px-3 py-3 text-[#707788]">
            <Search className="size-5" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              placeholder={tab === "messages" ? "Search conversations..." : "Search calls..."}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <div className="block">
            {tab === "messages"
              ? visibleConversations.map((conversation) => (
                  <button
                    className={`flex w-full min-w-0 items-center gap-3 border-t border-[#d7dbe7] px-4 py-4 text-left ${
                      activeId === conversation.id
                        ? "border-l-4 border-l-[#0649ad] bg-[#dce8ff]"
                        : "border-l-4 border-l-transparent hover:bg-[#f7f9ff]"
                    }`}
                    key={conversation.id}
                    type="button"
                    onClick={() => {
                      setActiveId(conversation.id);
                      setMobileChatOpen(true);
                    }}
                  >
                    <Avatar conversation={conversation} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <b className="truncate text-sm">{conversation.name}</b>
                        <small className="shrink-0 text-[10px] text-[#6d7482]">
                          {conversation.time}
                        </small>
                      </span>
                      <span className="mt-1 flex items-center gap-2">
                        <span className="line-clamp-2 text-sm text-[#4c5261]">
                          {conversation.preview}
                        </span>
                        {conversation.unread && (
                          <span className="size-2 shrink-0 rounded-full bg-[#0649ad]" />
                        )}
                      </span>
                    </span>
                  </button>
                ))
              : sidebarCalls.map((call) => (
                  <a
                    className="flex w-full min-w-0 items-center gap-3 border-t border-l-4 border-l-transparent border-[#d7dbe7] px-4 py-4 hover:border-l-[#0649ad] hover:bg-[#f7f9ff]"
                    href="tel:+8801700000000"
                    key={`${call.contact}-${call.time}-sidebar`}
                  >
                    <span
                      className={`grid size-10 shrink-0 place-items-center rounded-full ${
                        call.status === "Missed"
                          ? "bg-red-50 text-red-600"
                          : "bg-blue-50 text-[#0649ad]"
                      }`}
                    >
                      <Phone className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <b className="block truncate text-sm">{call.contact}</b>
                      <small className="block text-[#6d7482]">{call.time}</small>
                      <span
                        className={`text-xs font-semibold ${
                          call.status === "Missed"
                            ? "text-red-600"
                            : "text-emerald-700"
                        }`}
                      >
                        {call.status} · {call.duration}
                      </span>
                    </span>
                  </a>
                ))}
            {(tab === "messages"
              ? visibleConversations.length
              : sidebarCalls.length) === 0 && (
              <div className="w-full px-5 py-10 text-center text-sm text-[#707788]">
                No matching {tab === "messages" ? "conversations" : "calls"}.
              </div>
            )}
          </div>
        </aside>

        <div className={`h-[calc(100dvh-128px)] min-h-[520px] min-w-0 flex-col lg:flex lg:h-auto lg:min-h-[680px] ${mobileChatOpen ? "flex" : "hidden"}`}>
          <header className="flex items-center gap-2 border-b border-[#c5cad8] px-3 py-4 sm:gap-3 sm:px-5">
            <button
              className="grid size-10 shrink-0 place-items-center rounded-full hover:bg-[#eef3ff] lg:hidden"
              type="button"
              aria-label="Back to conversations"
              onClick={() => setMobileChatOpen(false)}
            >
              <ArrowLeft className="size-5" />
            </button>
            <Avatar conversation={activeConversation} />
            <div>
              <b className="block">{activeConversation.name}</b>
              <span className="text-sm text-emerald-600">Active now</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                className="grid size-10 place-items-center rounded-full border border-[#c5cad8]"
                type="button"
                aria-label="Search messages"
              >
                <Search className="size-5" />
              </button>
              <a
                className="hidden items-center gap-2 rounded-lg border border-[#0649ad] px-4 py-3 font-semibold text-[#0649ad] sm:flex"
                href="tel:+880123456789"
              >
                <Phone className="size-5" /> Call Now
              </a>
              <button className="p-2" type="button" aria-label="Conversation options">
                <MoreVertical className="size-5" />
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-5 overflow-y-auto bg-[#fcfdff] p-3 sm:p-6">
            <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-wide text-[#7b8291]">
              <span className="h-px flex-1 bg-[#dfe3ed]" />
              Today, Oct 24
              <span className="h-px flex-1 bg-[#dfe3ed]" />
            </div>

            <div className="flex items-start gap-3">
              <Avatar conversation={activeConversation} small />
              <div>
                <p className="max-w-md rounded-2xl rounded-tl-none border border-[#d4d8e4] bg-white px-5 py-4 shadow-sm">
                  Please confirm Fatema&apos;s visit for tomorrow and review the updated care plan.
                </p>
                <small className="mt-2 block text-[#7b8291]">10:32 AM</small>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Avatar conversation={activeConversation} small />
              <div>
                <div className="w-48 rounded-2xl rounded-tl-none border bg-white p-3 shadow-sm sm:w-[250px]">
                  <div className="grid h-32 place-items-center rounded-xl border border-dashed border-[#7b8aa6] bg-[#dce8ff] text-center">
                    <span>
                      <FileText className="mx-auto size-8 text-[#0649ad]" />
                      <b className="mt-2 block text-xs">Fatema_CarePlan_v2.pdf</b>
                    </span>
                  </div>
                  <div className="mt-3 flex justify-between text-xs">
                    <span className="text-[#747b8a]">2.4 MB</span>
                    <button className="flex items-center gap-1 font-semibold text-[#0649ad]" type="button">
                      Download <Download className="size-4" />
                    </button>
                  </div>
                </div>
                <small className="mt-2 block text-[#7b8291]">10:33 AM</small>
              </div>
            </div>

            <div className="ml-auto max-w-lg">
              <p className="rounded-2xl rounded-br-none bg-[#0649ad] px-5 py-4 text-white shadow">
                Understood, I&apos;ll take care of it. Thank you for the update!
              </p>
              <small className="mt-2 flex items-center justify-end gap-1 text-[#7b8291]">
                10:45 AM <CheckCheck className="size-4 text-emerald-600" />
              </small>
            </div>

            {sent.map((message, index) => (
              <div className="ml-auto max-w-lg" key={`${message}-${index}`}>
                <p className="rounded-2xl rounded-br-none bg-[#0649ad] px-5 py-4 text-white shadow">
                  {message}
                </p>
                <small className="mt-2 flex items-center justify-end gap-1 text-[#7b8291]">
                  Just now <CheckCheck className="size-4 text-emerald-600" />
                </small>
              </div>
            ))}
          </div>

          <form
            className="m-2 flex items-center gap-1 rounded-2xl border border-[#c5cad8] bg-[#eef3ff] p-2 sm:m-4 sm:gap-2 sm:p-3"
            onSubmit={sendMessage}
          >
            <button className="grid size-9 place-items-center rounded-full" type="button" aria-label="Add attachment">
              <Plus className="size-5" />
            </button>
            <button className="hidden size-9 place-items-center rounded-full min-[380px]:grid" type="button" aria-label="Add image">
              <Image className="size-5" />
            </button>
            <input
              className="min-w-0 flex-1 bg-transparent px-2 outline-none"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Type a message..."
            />
            <button
              className="grid size-11 place-items-center rounded-xl bg-[#0649ad] text-white"
              type="submit"
              aria-label="Send message"
            >
              <Send className="size-5" />
            </button>
          </form>
        </div>
      </section>

      <section className={`mt-8 sm:mt-12 ${mobileChatOpen ? "hidden lg:block" : ""}`}>
        <div className="mb-5">
          <h2 className="text-xl font-semibold">Quick Call Actions</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <QuickCall
            icon={UserRoundSearch}
            eyebrow="Call Client"
            name="Fatema Begum"
            href="tel:+8801700000001"
            button="Call Now"
            tone="blue"
          />
          <QuickCall
            icon={Building2}
            eyebrow="Call Admin"
            name="SwiftOps Admin"
            href="tel:+8801700000002"
            button="Call Office"
            tone="green"
          />
          <QuickCall
            icon={Siren}
            eyebrow="Emergency SOS"
            name="Karim (Fatema's son)"
            href="tel:+8801700000003"
            button="Emergency Call"
            tone="red"
          />
        </div>
      </section>

    </div>
  );
};

const QuickCall = ({ icon: Icon, eyebrow, name, href, button, tone }) => {
  const tones = {
    blue: {
      icon: "bg-blue-50 text-[#0649ad]",
      text: "text-[#0649ad]",
      button: "bg-[#0649ad]",
    },
    green: {
      icon: "bg-emerald-50 text-emerald-700",
      text: "text-emerald-700",
      button: "bg-emerald-700",
    },
    red: {
      icon: "bg-red-50 text-red-600",
      text: "text-red-600",
      button: "bg-red-600",
    },
  };
  const palette = tones[tone];

  return (
    <article className="rounded-xl border border-[#c5cad8] bg-white p-5 text-center sm:p-6">
      <span className={`mx-auto grid size-16 place-items-center rounded-full ${palette.icon}`}>
        <Icon className="size-7" />
      </span>
      <small className={`mt-5 block font-semibold uppercase tracking-wide ${palette.text}`}>
        {eyebrow}
      </small>
      <b className={`mt-1 block text-lg ${palette.text}`}>{name}</b>
      <a
        className={`mt-6 flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-semibold text-white ${palette.button}`}
        href={href}
      >
        <Phone className="size-5" /> {button}
      </a>
    </article>
  );
};

export default CaregiverNotifications;
