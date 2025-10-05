'use client';
import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

export default function Home() {
  const [message, setMessage] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  async function fetchMessages() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/messages`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`GET /messages -> ${res.status}`);
      setItems(await res.json());
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchMessages(); }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      setPosting(true);
      setError('');
      const res = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error(`POST /messages -> ${res.status}`);
      setMessage('');
      await fetchMessages();
    } catch (e) {
      alert(`送信に失敗しました: ${e}`);
      setError(String(e));
    } finally {
      setPosting(false);
    }
  }

  // ★更新（PUT）
  async function onUpdate(id) {
    const text = prompt('新しいメッセージを入力してください');
    if (!text || !text.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) {
        if (res.status === 404) return alert('対象のメッセージが見つかりません（404）');
        throw new Error(`PUT /messages/${id} -> ${res.status}`);
      }
      await fetchMessages();
    } catch (e) {
      alert(`更新に失敗しました: ${e}`);
    }
  }

  // ★削除（DELETE）
  async function onDelete(id) {
    if (!confirm(`id=${id} を削除しますか？`)) return;
    try {
      const res = await fetch(`${API_BASE}/messages/${id}`, { method: 'DELETE' });
      // 204 が正（No Content）。404 は「既に無い」想定の可能性もあるので別メッセージ
      if (!(res.ok || res.status === 204)) {
        if (res.status === 404) return alert('対象のメッセージが見つかりません（404）');
        throw new Error(`DELETE /messages/${id} -> ${res.status}`);
      }
      await fetchMessages();
    } catch (e) {
      alert(`削除に失敗しました: ${e}`);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Messages Demo (Next.js → Spring Boot → PostgreSQL)</h1>

      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, margin: '16px 0' }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="メッセージを入力"
          style={{ flex: 1, padding: 10, border: '1px solid #ccc', borderRadius: 10 }}
        />
        <button type="submit" disabled={posting} style={{ padding: '10px 16px', borderRadius: 10 }}>
          {posting ? '送信中…' : '送信'}
        </button>
      </form>

      {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}

      <section>
        <h2>一覧</h2>
        {loading ? (
          <p>読み込み中…</p>
        ) : items.length === 0 ? (
          <p>データがありません</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {items.map((it) => (
              <li key={it.id} style={{ padding: 8, borderBottom: '1px solid #eee', display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <code style={{ opacity: 0.6 }}>#{it.id}</code> {it.message}
                </div>
                <button onClick={() => onUpdate(it.id)}>編集</button>
                <button onClick={() => onDelete(it.id)} style={{ color: 'white', background: '#c0392b' }}>削除</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
