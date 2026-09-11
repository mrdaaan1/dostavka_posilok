import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { proposeMatchOnTrip } from "@/app/app/actions";

export default async function BrowseTripsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: trips }, { data: myRequests }] = await Promise.all([
    supabase
      .from("trips")
      .select("id, carrier_id, from_city, to_city, departure_date, capacity_kg, capacity_note")
      .eq("status", "open")
      .neq("carrier_id", user.id)
      .order("departure_date", { ascending: true }),
    supabase
      .from("requests")
      .select("id, from_city, to_city")
      .eq("sender_id", user.id)
      .eq("status", "open"),
  ]);

  const hasOwnRequests = Boolean(myRequests && myRequests.length > 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">
        Доступные поездки
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Найдите попутчика, который уже едет вашим маршрутом.
      </p>

      {!hasOwnRequests && (
        <p className="mt-6 rounded-xl border border-ink/10 bg-surface-tint p-4 text-sm text-ink-soft">
          Чтобы предложить сделку, сначала{" "}
          <Link href="/app/requests/new" className="text-ink underline">
            создайте заявку
          </Link>
          .
        </p>
      )}

      <div className="mt-6 space-y-4">
        {trips?.length === 0 && (
          <p className="text-sm text-ink-soft">Пока нет открытых поездок.</p>
        )}

        {trips?.map((trip) => (
          <div
            key={trip.id}
            className="rounded-2xl border border-ink/10 bg-surface-tint p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium text-ink">
                {trip.from_city} → {trip.to_city}
              </span>
              <span className="text-sm text-ink-faint">
                {new Date(trip.departure_date).toLocaleDateString("ru-RU")}
              </span>
            </div>
            {(trip.capacity_kg || trip.capacity_note) && (
              <p className="mt-2 text-sm text-ink-soft">
                {trip.capacity_kg && `До ${trip.capacity_kg} кг. `}
                {trip.capacity_note}
              </p>
            )}

            {hasOwnRequests && (
              <form action={proposeMatchOnTrip} className="mt-4 flex gap-2">
                <input type="hidden" name="trip_id" value={trip.id} />
                <select
                  name="request_id"
                  required
                  className="flex-1 rounded-xl border border-ink/10 bg-surface px-3 py-2 text-sm text-ink outline-none"
                >
                  {myRequests?.map((request) => (
                    <option key={request.id} value={request.id}>
                      Моя заявка: {request.from_city} → {request.to_city}
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
