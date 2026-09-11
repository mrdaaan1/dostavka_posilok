import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { proposeMatchOnRequest } from "@/app/app/actions";

export default async function BrowseRequestsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: requests }, { data: myTrips }] = await Promise.all([
    supabase
      .from("requests")
      .select("id, sender_id, from_city, to_city, weight_kg, ready_date, deadline_date, description")
      .eq("status", "open")
      .neq("sender_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("trips")
      .select("id, from_city, to_city")
      .eq("carrier_id", user.id)
      .eq("status", "open"),
  ]);

  const hasOwnTrips = Boolean(myTrips && myTrips.length > 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">
        Доступные заявки
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Возьмите посылку по пути и получите за это вознаграждение.
      </p>

      {!hasOwnTrips && (
        <p className="mt-6 rounded-xl border border-ink/10 bg-surface-tint p-4 text-sm text-ink-soft">
          Чтобы предложить сделку, сначала{" "}
          <Link href="/app/trips/new" className="text-ink underline">
            создайте поездку
          </Link>
          .
        </p>
      )}

      <div className="mt-6 space-y-4">
        {requests?.length === 0 && (
          <p className="text-sm text-ink-soft">Пока нет открытых заявок.</p>
        )}

        {requests?.map((request) => (
          <div
            key={request.id}
            className="rounded-2xl border border-ink/10 bg-surface-tint p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium text-ink">
                {request.from_city} → {request.to_city}
              </span>
              {request.weight_kg && (
                <span className="text-sm text-ink-faint">
                  ~{request.weight_kg} кг
                </span>
              )}
            </div>
            {request.description && (
              <p className="mt-2 text-sm text-ink-soft">
                {request.description}
              </p>
            )}

            {hasOwnTrips && (
              <form action={proposeMatchOnRequest} className="mt-4 flex gap-2">
                <input type="hidden" name="request_id" value={request.id} />
                <select
                  name="trip_id"
                  required
                  className="flex-1 rounded-xl border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none"
                >
                  {myTrips?.map((trip) => (
                    <option key={trip.id} value={trip.id}>
                      Моя поездка: {trip.from_city} → {trip.to_city}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-105"
                >
                  Предложить
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
