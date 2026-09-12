import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/app/app/actions";

const roleLabels: Record<string, string> = {
  sender: "Отправитель",
  carrier: "Перевозчик",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: contact }] = await Promise.all([
    supabase
      .from("profiles")
      .select("role, name, bio")
      .eq("id", user.id)
      .single(),
    supabase.rpc("get_own_contact"),
  ]);

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-2xl font-bold text-ink">Профиль</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {user.email} · {roleLabels[profile?.role ?? "sender"]}
      </p>

      <form action={updateProfile} className="mt-8 space-y-4">
        <input
          type="text"
          name="name"
          defaultValue={profile?.name ?? ""}
          placeholder="Имя"
          className="w-full rounded-xl border border-ink/10 bg-surface-tint px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint"
        />
        <textarea
          name="bio"
          defaultValue={profile?.bio ?? ""}
          placeholder="О себе"
          rows={3}
          className="w-full rounded-xl border border-ink/10 bg-surface-tint px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint"
        />
        <div>
          <input
            type="text"
            name="contact"
            defaultValue={contact ?? ""}
            placeholder="Telegram или телефон"
            className="w-full rounded-xl border border-ink/10 bg-surface-tint px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint"
          />
          <p className="mt-1.5 text-xs text-ink-faint">
            Виден только тому, с кем вы подтвердили сделку.
          </p>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-ink transition hover:brightness-105"
        >
          Сохранить
        </button>
      </form>
    </div>
  );
}
