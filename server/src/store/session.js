// In-memory session store.
// v1 keeps everything in memory (per the plan); data resets on server restart.
import { nanoid } from "nanoid";

const sessions = new Map();

export function createSession() {
  const session = {
    id: nanoid(12),
    profile: null, // { monthlyIncome, monthlyExpenses, savingsGoal, notes }
    messages: [], // { role: 'user'|'assistant', content }
    createdAt: Date.now(),
  };
  sessions.set(session.id, session);
  return session;
}

export function getSession(id) {
  if (!id) return null;
  return sessions.get(id) || null;
}

export function getOrCreateSession(id) {
  const existing = getSession(id);
  if (existing) return existing;
  return createSession();
}

export function setProfile(session, profile) {
  session.profile = profile;
  return session.profile;
}

export function addMessage(session, role, content) {
  const msg = { role, content, at: Date.now() };
  session.messages.push(msg);
  // Keep the last ~20 messages to bound the prompt size.
  if (session.messages.length > 20) {
    session.messages = session.messages.slice(-20);
  }
  return msg;
}

export function clearSession(id) {
  sessions.delete(id);
}

// Export for diagnostics/testing.
export function countSessions() {
  return sessions.size;
}
