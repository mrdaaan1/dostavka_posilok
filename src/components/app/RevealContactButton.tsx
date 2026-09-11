"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RevealContactButton({ matchId }: { matchId: string }) {
  const [contact, setContact] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleReveal() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc(
      "get_counterpart_contact",
      { p_match_id: matchId },
    );
    setLoading(false);

    if (rpcError) {
      setError("Не удалось получить контакт");
      return;
    }
    setContact(data || "Контакт пока не заполнен");
  }

  if (contact) {
    return <p className="text-sm font-medium text-ink">Контакт: {contact}</p>;
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleReveal}
        disabled={loading}
        className="rounded-xl border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-surface-tint disabled:opacity-50"
      >
        {loading ? "Загружаем…" : "Показать контакт"}
      </button>
      {error && <p className="mt-1 text-xs text-pink-dark">{error}</p>}
    </div>
  );
}
