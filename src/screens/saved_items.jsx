import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SavedItems() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/items");
      if (!res.ok) throw new Error("GET /api/items failed: " + res.status);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e && e.message ? e.message : "Failed to load items");
    } finally {
      setLoading(false);
    }
  }

  async function saveItem(e) {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), notes: notes.trim() }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error("POST /api/items failed: " + res.status + " " + msg);
      }

      setTitle("");
      setNotes("");
      await loadItems();
    } catch (e) {
      setError(e && e.message ? e.message : "Failed to save item");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Saved Items</h1>
          <div className="text-sm opacity-70">Local MVP: JSON file DB</div>
        </div>

        <Link className="rounded-md border px-3 py-2 text-sm" to="/">
          Back
        </Link>
      </div>

      <form onSubmit={saveItem} className="grid gap-2">
        <input
          className="w-full rounded-md border px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (required)"
        />
        <textarea
          className="w-full rounded-md border px-3 py-2"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          rows={3}
        />
        <div className="flex gap-2">
          <button
            className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
            type="submit"
            disabled={saving || !title.trim()}
          >
            {saving ? "Saving…" : "Save"}
          </button>

          <button
            className="rounded-md border px-4 py-2 text-sm"
            type="button"
            onClick={loadItems}
          >
            Refresh
          </button>
        </div>
      </form>

      {error ? (
        <div className="mt-3 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6">
        {loading ? (
          <div className="text-sm opacity-70">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-sm opacity-70">No items yet.</div>
        ) : (
          <div className="grid gap-3">
            {items.map((it) => (
              <div key={it.id} className="rounded-lg border p-3">
                <div className="font-medium">{it.title}</div>
                {it.notes ? (
                  <div className="mt-1 text-sm opacity-80">{it.notes}</div>
                ) : null}
                <div className="mt-2 text-xs opacity-60">
                  {it.createdAt ? new Date(it.createdAt).toLocaleString() : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
