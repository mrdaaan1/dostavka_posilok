"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function toNumberOrNull(value: FormDataEntryValue | null) {
  if (!value) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function toStringOrNull(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str ? str : null;
}

export async function createRequest(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const fromCity = String(formData.get("from_city") || "").trim();
  const toCity = String(formData.get("to_city") || "").trim();
  if (!fromCity || !toCity) return;

  await supabase.from("requests").insert({
    sender_id: user.id,
    from_city: fromCity,
    to_city: toCity,
    weight_kg: toNumberOrNull(formData.get("weight_kg")),
    length_cm: toNumberOrNull(formData.get("length_cm")),
    width_cm: toNumberOrNull(formData.get("width_cm")),
    height_cm: toNumberOrNull(formData.get("height_cm")),
    ready_date: toStringOrNull(formData.get("ready_date")),
    deadline_date: toStringOrNull(formData.get("deadline_date")),
    description: toStringOrNull(formData.get("description")),
  });

  revalidatePath("/app");
  redirect("/app");
}

export async function createTrip(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const fromCity = String(formData.get("from_city") || "").trim();
  const toCity = String(formData.get("to_city") || "").trim();
  const departureDate = String(formData.get("departure_date") || "").trim();
  if (!fromCity || !toCity || !departureDate) return;

  await supabase.from("trips").insert({
    carrier_id: user.id,
    from_city: fromCity,
    to_city: toCity,
    departure_date: departureDate,
    capacity_kg: toNumberOrNull(formData.get("capacity_kg")),
    capacity_note: toStringOrNull(formData.get("capacity_note")),
  });

  revalidatePath("/app");
  redirect("/app");
}

export async function proposeMatchOnTrip(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const tripId = String(formData.get("trip_id") || "");
  const requestId = String(formData.get("request_id") || "");
  if (!tripId || !requestId) return;

  await supabase.from("matches").insert({
    request_id: requestId,
    trip_id: tripId,
    confirmed_by_sender: true,
    confirmed_by_carrier: false,
  });

  revalidatePath("/app");
  revalidatePath("/app/trips");
}

export async function proposeMatchOnRequest(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const requestId = String(formData.get("request_id") || "");
  const tripId = String(formData.get("trip_id") || "");
  if (!requestId || !tripId) return;

  await supabase.from("matches").insert({
    request_id: requestId,
    trip_id: tripId,
    confirmed_by_sender: false,
    confirmed_by_carrier: true,
  });

  revalidatePath("/app");
  revalidatePath("/app/requests");
}

export async function confirmMatch(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const matchId = String(formData.get("match_id") || "");
  if (!matchId) return;

  const { data: match } = await supabase
    .from("matches")
    .select("id, request_id, trip_id, confirmed_by_sender, confirmed_by_carrier")
    .eq("id", matchId)
    .single();

  if (!match) return;

  const [{ data: requestRow }, { data: tripRow }] = await Promise.all([
    supabase
      .from("requests")
      .select("sender_id")
      .eq("id", match.request_id)
      .single(),
    supabase.from("trips").select("carrier_id").eq("id", match.trip_id).single(),
  ]);

  const isSender = requestRow?.sender_id === user.id;
  const isCarrier = tripRow?.carrier_id === user.id;
  if (!isSender && !isCarrier) return;

  const confirmedBySender = isSender ? true : match.confirmed_by_sender;
  const confirmedByCarrier = isCarrier ? true : match.confirmed_by_carrier;
  const bothConfirmed = confirmedBySender && confirmedByCarrier;

  await supabase
    .from("matches")
    .update({
      confirmed_by_sender: confirmedBySender,
      confirmed_by_carrier: confirmedByCarrier,
      status: bothConfirmed ? "confirmed" : "pending",
    })
    .eq("id", matchId);

  if (bothConfirmed) {
    await supabase
      .from("requests")
      .update({ status: "matched" })
      .eq("id", match.request_id);
    await supabase
      .from("trips")
      .update({ status: "matched" })
      .eq("id", match.trip_id);
  }

  revalidatePath("/app");
}
