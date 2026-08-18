import { apiRequest } from "./apiClient";

export const listConversations = () =>
  apiRequest("/communications/conversations");

export const createAssignmentConversation = (assignmentId) =>
  apiRequest("/communications/conversations", {
    method: "POST",
    body: JSON.stringify({ assignmentId }),
  });

export const createSupportConversation = () =>
  apiRequest("/communications/support-conversation", {
    method: "POST",
    body: JSON.stringify({}),
  });

export const listConversationMessages = (conversationId) =>
  apiRequest(
    `/communications/conversations/${encodeURIComponent(conversationId)}/messages`,
  );

export const sendConversationMessage = (conversationId, body) =>
  apiRequest(
    `/communications/conversations/${encodeURIComponent(conversationId)}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ body }),
    },
  );

export const markConversationRead = (conversationId) =>
  apiRequest(
    `/communications/conversations/${encodeURIComponent(conversationId)}/read`,
    { method: "PATCH" },
  );

export const listNotifications = ({ unread = false } = {}) =>
  apiRequest(`/communications/notifications${unread ? "?unread=true" : ""}`);

export const markNotificationRead = (notificationId) =>
  apiRequest(
    `/communications/notifications/${encodeURIComponent(notificationId)}/read`,
    { method: "PATCH" },
  );

export const markAllNotificationsRead = () =>
  apiRequest("/communications/notifications/read-all", { method: "PATCH" });

export const listAdminConversations = ({ flagged = false } = {}) =>
  apiRequest(
    `/admin/communications/conversations${flagged ? "?flagged=true" : ""}`,
  );

export const listAdminConversationMessages = (conversationId) =>
  apiRequest(
    `/admin/communications/conversations/${encodeURIComponent(conversationId)}/messages`,
  );

export const sendAdminSupportMessage = (conversationId, body) =>
  apiRequest(
    `/admin/communications/conversations/${encodeURIComponent(conversationId)}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ body }),
    },
  );

export const flagAdminConversation = (conversationId, flagged, reason = "") =>
  apiRequest(
    `/admin/communications/conversations/${encodeURIComponent(conversationId)}/flag`,
    {
      method: "PATCH",
      body: JSON.stringify({ flagged, reason }),
    },
  );

export const assignAdminConversation = (conversationId) =>
  apiRequest(
    `/admin/communications/conversations/${encodeURIComponent(conversationId)}/support`,
    { method: "PATCH", body: JSON.stringify({}) },
  );
