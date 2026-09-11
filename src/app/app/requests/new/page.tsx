"use client";

import { useState } from "react";
import CityCombobox from "@/components/ui/CityCombobox";
import { createRequest } from "@/app/app/actions";

export default function NewRequestPage() {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-2xl font-bold text-ink">
        Новая заявка
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Опишите, что и куда нужно отправить.
      </p>

      <form action={createRequest} className="mt-8 space-y-4">
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

        <div className="grid grid-cols-4 gap-2">
          <input
            type="number"
            step="0.1"
            name="weight_kg"
            placeholder="Вес, кг"
            className="col-span-4 rounded-xl border border-ink/10 bg-surface-tint px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint sm:col-span-1"
          />
          <input
            type="number"
            step="0.1"
            name="length_cm"
            placeholder="Длина, см"
            className="rounded-xl border border-ink/10 bg-surface-tint px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint"
          />
          <input
            type="number"
            step="0.1"
            name="width_cm"
            placeholder="Ширина, см"
            className="rounded-xl border border-ink/10 bg-surface-tint px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint"
          />
          <input
            type="number"
            step="0.1"
            name="height_cm"
            placeholder="Высота, см"
            className="rounded-xl border border-ink/10 bg-surface-tint px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint"
          />
        </div>

        <div className="flex gap-2">
          <label className="flex-1 text-xs text-ink-faint">
            Готово к отправке
            <input
              type="date"
              name="ready_date"
              className="mt-1 w-full rounded-xl border border-ink/10 bg-surface-tint px-4 py-3 text-sm text-ink outline-none"
            />
          </label>
          <label className="flex-1 text-xs text-ink-faint">
            Нужно доставить до
            <input
              type="date"
              name="deadline_date"
              className="mt-1 w-full rounded-xl border border-ink/10 bg-surface-tint px-4 py-3 text-sm text-ink outline-none"
            />
          </label>
        </div>

        <textarea
          name="description"
          placeholder="Описание посылки (необязательно)"
          rows={3}
          className="w-full rounded-xl border border-ink/10 bg-surface-tint px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-ink transition hover:brightness-105"
        >
          Создать заявку
        </button>
      </form>
    </div>
  );
}
