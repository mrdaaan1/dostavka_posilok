"use client";

import { useState } from "react";
import CityCombobox from "@/components/ui/CityCombobox";
import { createTrip } from "@/app/app/actions";

export default function NewTripPage() {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-2xl font-bold text-ink">
        Новая поездка
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Укажите маршрут и сколько места у вас есть для чужой посылки.
      </p>

      <form action={createTrip} className="mt-8 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <CityCombobox
            name="from_city"
            required
            value={fromCity}
            onChange={setFromCity}
            placeholder="Откуда"
          />
          <span className="hidden self-center text-ink-faint sm:block">
            →
          </span>
          <CityCombobox
            name="to_city"
            required
            value={toCity}
            onChange={setToCity}
            placeholder="Куда"
          />
        </div>

        <label className="block text-xs text-ink-faint">
          Дата поездки
          <input
            type="date"
            name="departure_date"
            required
            className="mt-1 w-full rounded-xl border border-ink/10 bg-surface-tint px-4 py-3 text-sm text-ink outline-none"
          />
        </label>

        <input
          type="number"
          step="0.1"
          name="capacity_kg"
          placeholder="Сколько кг можете взять"
          className="w-full rounded-xl border border-ink/10 bg-surface-tint px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint"
        />

        <textarea
          name="capacity_note"
          placeholder="Комментарий: что именно можете взять (необязательно)"
          rows={3}
          className="w-full rounded-xl border border-ink/10 bg-surface-tint px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-ink transition hover:brightness-105"
        >
          Создать поездку
        </button>
      </form>
    </div>
  );
}
