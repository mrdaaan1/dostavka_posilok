import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  confirmMatch,
  declineMatch,
  cancelRequest,
  cancelTrip,
} from "@/app/app/actions";
import RevealContactButton from "@/components/app/RevealContactButton";

const statusLabels: Record<string, string> = {
  open: "Открыта",
  matched: "Есть сделка",
  in_transit: "В пути",
  delivered: "Доставлено",
  cancelled: "Отменена",
  completed: "Завершена",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "sender";

  const myItems =
    role === "sender"
      ? (
          await supabase
            .from("requests")
            .select("id, from_city, to_city, status, created_at")
            .eq("sender_id", user.id)
            .order("created_at", { ascending: false })
        ).data ?? []
      : (
          await supabase
            .from("trips")
            .select("id, from_city, to_city, status, departure_date, created_at")
            .eq("carrier_id", user.id)
            .order("created_at", { ascending: false })
        ).data ?? [];

  const myItemIds = myItems.map((item) => item.id);

  const { data: matches } =
    myItemIds.length === 0
      ? { data: [] }
      : role === "sender"
        ? await supabase
            .from("matches")
            .select("id, trip_id, request_id, status, confirmed_by_sender, confirmed_by_carrier")
            .in("request_id", myItemIds)
            .neq("status", "cancelled")
        : await supabase
            .from("matches")
            .select("id, trip_id, request_id, status, confirmed_by_sender, confirmed_by_carrier")
            .in("trip_id", myItemIds)
            .neq("status", "cancelled");

  const matchDetails = await Promise.all(
    (matches ?? []).map(async (match) => {
      const [{ data: request }, { data: trip }] = await Promise.all([
        supabase
          .from("requests")
          .select("from_city, to_city, sender_id")
          .eq("id", match.request_id)
          .single(),
        supabase
          .from("trips")
          .select("from_city, to_city, carrier_id, departure_date")
          .eq("id", match.trip_id)
          .single(),
      ]);

      const counterpartId = role === "sender" ? trip?.carrier_id : request?.sender_id;
      const { data: counterpart } = counterpartId
        ? await supabase
            .from("profiles")
            .select("name")
            .eq("id", counterpartId)
            .single()
        : { data: null };

      return { match, request, trip, counterpart };
    }),
  );

  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-ink">
            {role === "sender" ? "Мои заявки" : "Мои поездки"}
          </h1>
          <Link
            href={role === "sender" ? "/app/requests/new" : "/app/trips/new"}
            className="rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-105"
          >
            {role === "sender" ? "Создать заявку" : "Создать поездку"}
          </Link>
        </div>

        <div className="mt-6 space-y-3">
          {myItems.length === 0 && (
            <p className="text-sm text-ink-soft">Пока пусто.</p>
          )}
          {myItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-ink/10 bg-surface-tint px-5 py-4"
            >
              <span className="font-medium text-ink">
                {item.from_city} → {item.to_city}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-ink-faint">
                  {statusLabels[item.status] ?? item.status}
                </span>
                {item.status === "open" && (
                  <form action={role === "sender" ? cancelRequest : cancelTrip}>
                    <input
                      type="hidden"
                      name={role === "sender" ? "request_id" : "trip_id"}
                      value={item.id}
                    />
                    <button
                      type="submit"
                      className="text-sm text-ink-faint underline transition hover:text-pink-dark"
                    >
                      Отменить
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold text-ink">
          Мои сделки
        </h2>

        <div className="mt-6 space-y-3">
          {matchDetails.length === 0 && (
            <p className="text-sm text-ink-soft">
              Пока нет предложенных сделок.
            </p>
          )}

          {matchDetails.map(({ match, request, trip, counterpart }) => {
            const iConfirmed =
              role === "sender" ? match.confirmed_by_sender : match.confirmed_by_carrier;
            const isConfirmed = match.status === "confirmed";

            return (
              <div
                key={match.id}
                className="rounded-xl border border-ink/10 bg-surface-tint px-5 py-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-ink">
                    {request?.from_city} → {request?.to_city}
                  </span>
                  <span className="text-sm text-ink-faint">
                    {counterpart?.name ?? "Без имени"}
                  </span>
                </div>

                <div className="mt-3">
                  {isConfirmed ? (
                    <RevealContactButton matchId={match.id} />
                  ) : iConfirmed ? (
                    <p className="text-sm text-ink-soft">
                      Ждём подтверждения от контрагента
                    </p>
                  ) : (
                    <div className="flex items-center gap-3">
                      <form action={confirmMatch}>
                        <input type="hidden" name="match_id" value={match.id} />
                        <button
                          type="submit"
                          className="rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-105"
                        >
                          Подтвердить сделку
                        </button>
                      </form>
                      <form action={declineMatch}>
                        <input type="hidden" name="match_id" value={match.id} />
                        <button
                          type="submit"
                          className="text-sm text-ink-faint underline transition hover:text-pink-dark"
                        >
                          Отклонить
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
