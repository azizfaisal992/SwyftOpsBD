import { CheckCircle2, FileImage, FileText, MoreVertical, Paperclip, Phone, Search, Send, Smile, Video } from "lucide-react";
import { useState } from "react";
import { portalCaregivers } from "../../../data/clientPortalData";

const conversations = [
  { name: "SwiftOpsBD Support", preview: "Verification update complete.", time: "10:24 AM", support: true },
  { name: "Dr. Aris Thorne", preview: "I will be there at 9:00 AM.", time: "Yesterday", image: portalCaregivers.marcus.image },
  { name: "Sarah Jenkins, RN", preview: "Sent a care plan update.", time: "Monday", image: portalCaregivers.linda.image },
  { name: "Medication Dept.", preview: "Refill approved for Patient ID #882.", time: "Oct 12", support: true },
];

const ClientMessages = () => {
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState([]);

  const sendMessage = (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    setSentMessages((current) => [...current, message.trim()]);
    setMessage("");
  };

  return (
    <div className="grid min-h-[calc(100vh-112px)] lg:grid-cols-[320px_1fr]">
      <aside className="border-r border-[#c5cad8] bg-white">
        <label className="relative m-5 block"><Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#747b8a]" /><input className="w-full rounded-lg border border-[#c5cad8] bg-[#f7f8fb] py-3 pl-10 pr-3 outline-none" placeholder="Search conversations..." /></label>
        <div>{conversations.map((conversation, index) => <button className={`flex w-full items-center gap-3 border-l-4 p-4 text-left ${index === 0 ? "border-[#0649ad] bg-[#dce8ff]" : "border-transparent hover:bg-[#f7f8fb]"}`} type="button" key={conversation.name}>{conversation.image ? <img className="size-12 rounded-xl object-cover" src={conversation.image} alt="" /> : <span className="grid size-12 place-items-center rounded-xl bg-[#0753c8] text-white">♙</span>}<span className="min-w-0 flex-1"><strong className="block truncate text-sm">{conversation.name}</strong><span className={`block truncate text-xs ${index === 0 ? "font-semibold text-[#0649ad]" : "text-[#4c5261]"}`}>{conversation.preview}</span></span><span className="text-[10px] text-[#747b8a]">{conversation.time}</span></button>)}</div>
      </aside>
      <section className="flex min-h-[700px] flex-col bg-[#f8f9ff]">
        <header className="flex items-center justify-between border-b border-[#c5cad8] bg-white p-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#0753c8] text-white">♙</span><div><h1 className="font-semibold">CareConnect Support</h1><p className="text-xs text-emerald-600">● Usually responds in 5 mins</p></div></div><div className="flex gap-5"><Phone className="size-5" /><Video className="size-5" /><MoreVertical className="size-5" /></div></header>
        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <p className="text-center"><span className="rounded-full bg-[#e5eaf6] px-4 py-1 text-[10px] font-semibold text-[#747b8a]">TODAY</span></p>
          <Incoming> Hello! I&apos;m reviewing your recent caregiver verification request. We&apos;ve noticed that the ID document was slightly blurred. Could you please re-upload a clearer photo?</Incoming>
          <Outgoing>Sure thing, let me get that for you right now. I&apos;ll attach it below.</Outgoing>
          <Incoming>Perfect. Once I receive that, I can finalize the background check instantly.</Incoming>
          <div className="ml-auto w-fit rounded-2xl bg-[#a8c9f6] p-2"><div className="flex items-center gap-3 rounded-lg bg-white p-3"><FileImage className="size-6 text-[#0649ad]" /><div><b className="block text-sm">Verification_ID_v2.jpg</b><span className="text-[10px] text-[#747b8a]">2.4 MB</span></div><CheckCircle2 className="size-5 text-emerald-500" /></div></div>
          {sentMessages.map((sent, index) => <Outgoing key={`${sent}-${index}`}>{sent}</Outgoing>)}
        </div>
        <form className="m-5 rounded-xl border border-[#c5cad8] bg-white p-4 shadow-lg" onSubmit={sendMessage}><input className="w-full border-b border-[#e1e4ec] px-2 pb-4 outline-none" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Type a secure message..." /><div className="mt-3 flex items-center gap-5"><button className="flex items-center gap-1 text-xs" type="button"><Paperclip className="size-4" /> Attach</button><Smile className="size-5" /><FileText className="size-5" /><button className="ml-auto flex items-center gap-2 rounded-lg bg-[#0649ad] px-6 py-3 text-sm font-semibold text-white" type="submit">Send <Send className="size-4" /></button></div></form>
        <p className="pb-4 text-center text-[10px] text-[#747b8a]">🔒 This conversation is end-to-end encrypted by CareConnect Shield.</p>
      </section>
    </div>
  );
};

const Incoming = ({ children }) => <div className="max-w-xl rounded-r-2xl rounded-bl-2xl border border-[#c5cad8] bg-white p-4 leading-6">{children}</div>;
const Outgoing = ({ children }) => <div className="ml-auto max-w-xl rounded-l-2xl rounded-br-2xl bg-[#0649ad] p-4 leading-6 text-white">{children}</div>;

export default ClientMessages;
