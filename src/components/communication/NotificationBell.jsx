import { Bell, CheckCheck, LoaderCircle, MessageSquareText } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../services/communicationService";

const NotificationBell = ({ messagePath }) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      setItems(await listNotifications());
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(load, 0);
    const timer = window.setInterval(load, 15000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, [load]);

  const unread = items.filter((item) => !item.read).length;
  const openItem = async (notification) => {
    if (!notification.read) {
      await markNotificationRead(notification.notificationId);
    }
    setOpen(false);
    await load();
    if (notification.type === "message") navigate(messagePath);
  };

  const readAll = async () => {
    await markAllNotificationsRead();
    await load();
  };

  return (
    <div className="relative">
      <button className="relative grid size-9 place-items-center rounded-lg hover:bg-slate-100" type="button" aria-label={`${unread} unread notifications`} onClick={() => setOpen((current) => !current)}>
        <Bell className="size-5" />
        {unread > 0 && <span className="absolute -right-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">{unread > 9 ? "9+" : unread}</span>}
      </button>
      {open && <>
        <button className="fixed inset-0 z-40 cursor-default" type="button" aria-label="Close notifications" onClick={() => setOpen(false)} />
        <section className="absolute right-0 top-11 z-50 w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-xl border bg-white text-[#111c2c] shadow-2xl">
          <header className="flex items-center border-b px-4 py-3">
            <b>Notifications</b>
            {unread > 0 && <button className="ml-auto flex items-center gap-1 text-xs font-semibold text-[#0755b7]" type="button" onClick={readAll}><CheckCheck className="size-4" />Mark all read</button>}
          </header>
          <div className="max-h-96 overflow-y-auto">
            {loading ? <LoaderCircle className="mx-auto my-8 size-6 animate-spin text-[#0755b7]" /> : items.length ? items.slice(0, 20).map((notification) => (
              <button className={`flex w-full gap-3 border-b p-4 text-left hover:bg-slate-50 ${notification.read ? "" : "bg-blue-50"}`} key={notification.notificationId} type="button" onClick={() => openItem(notification)}>
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-blue-100 text-[#0755b7]"><MessageSquareText className="size-4" /></span>
                <span className="min-w-0"><b className="block truncate text-sm">{notification.title}</b><span className="mt-1 block line-clamp-2 text-xs text-[#687184]">{notification.body}</span></span>
                {!notification.read && <i className="mt-2 size-2 shrink-0 rounded-full bg-[#0755b7]" />}
              </button>
            )) : <p className="px-5 py-10 text-center text-sm text-[#687184]">No notifications yet.</p>}
          </div>
        </section>
      </>}
    </div>
  );
};

export default NotificationBell;
