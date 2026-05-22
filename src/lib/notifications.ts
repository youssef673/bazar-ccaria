type NotificationKind = "order" | "quote" | "review";

interface NotificationPayload {
  title: string;
  message: string;
  url?: string;
  metadata?: Record<string, unknown>;
}

export async function notifyAdmin(
  kind: NotificationKind,
  payload: NotificationPayload
) {
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

  if (!webhookUrl && !adminEmail) {
    return;
  }

  const body = {
    kind,
    to: adminEmail,
    store: process.env.NEXT_PUBLIC_STORE_NAME || "bazar di Zico",
    ...payload,
  };

  if (!webhookUrl) {
    console.info("Admin notification:", body);
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error("Notification webhook failed", error);
  }
}
