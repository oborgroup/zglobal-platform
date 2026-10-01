"use server";

import { createAdminSupabase } from "@/lib/supabaseAdmin";

export type ContactInput = {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
};

export type ContactResult = { ok: true } | { ok: false; error: string };

export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (!name || !email || !message) return { ok: false, error: "Please fill in your name, email and message." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Please enter a valid email address." };
  if (message.length > 5000) return { ok: false, error: "Message is too long." };

  const admin = createAdminSupabase();
  const { error } = await admin.from("contact_messages").insert({
    name,
    email,
    company: input.company.trim() || null,
    subject: input.subject.trim() || null,
    message,
  });
  if (error) return { ok: false, error: "Sorry, we couldn't send your message. Please email us directly." };
  return { ok: true };
}
