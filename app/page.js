'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

export default function Page() {
  // フォーム
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // 一覧
  const [items, setItems] = useState([]);
  // 状態
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  // 検索
  const [q, setQ] = useState('');

  // 一覧取得
  async function fetchNotes(query) {
    try {
      setLoading(true);
      setError('');
      const url = query && query.trim()
        ? `${API}/notes?q=${encodeURIComponent(query.trim())}`
        : `${API}/notes`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`GET /notes -> ${res.status}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotes('');
  }, []);

  // 追加
  async function onCreate(e) {
    e.preventDefault();
    if (!title.trim()) {
      alert('タイトルは必須です');
      return;
    }
    try {
      setPosting(true);
      setError('');
      const res = await fetch(`${API}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) throw new Error(`POST /notes -> ${res.status}`);
      setTitle('');
      setContent('');
      await fetchNotes(q);
    } catch (e) {
      alert(`作成に失敗しました: ${e}`);
      setError(String(e));
    } finally {
      setPosting(false);
    }
  }

  // 更新（promptで簡易編集）
  async function onEdit(item) {
    const newTitle = prompt('タイトルを入力', item.title ?? '');
    if (newTitle == null) return; // キャンセル
    if (!newTitle.trim()) return alert('タイトルは必須です');
    const newContent = prompt('本文を入力（空でも可）', item.content ?? '');
    try {
      const res = await fetch(`${API}/notes/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, content: newContent ?? '' }),
      });
      if (!res.ok) {
        if (res.status === 404) return alert('対象が見つかりません（404）');
        throw new Error(`PUT /notes/${item.id} -> ${res.status}`);
      }
      await fetchNotes(q);
    } catch (e) {
      alert(`更新に失敗しました: ${e}`);
    }
  }

  // 削除
  async function onDelete(id) {
    if (!confirm(`id=${id} を削除しますか？`)) return;
    try {
      const res = await fetch(`${API}/notes/${id}`, { method: 'DELETE' });
      if (!(res.ok || res.status === 204)) {
        if (res.status === 404) return alert('対象が見つかりません（404）');
        throw new Error(`DELETE /notes/${id} -> ${res.status}`);
      }
      await fetchNotes(q);
    } catch (e) {
      alert(`削除に失敗しました: ${e}`);
    }
  }

  // 時刻表示ユーティリティ
  function fmt(dt) {
    if (!dt) return '';
    try {
      return new Date(dt).toLocaleString();
    } catch {
      return String(dt);
    }
  }

  return (
    <main style={{ maxWidth: 860, margin: '40px auto', padding: 16, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Notes App (Next.js → Spring Boot → PostgreSQL)</h1>
      <p style={{ opacity: 0.7, marginBottom: 16 }}>
        API: <code>{API}</code>
      </p>

      {/* 検索 */}
      <form
        onSubmit={(e) => { e.preventDefault(); fetchNotes(q); }}
        style={{ display: 'flex', gap: 8, margin: '12px 0 20px' }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="タイトルで検索（部分一致）"
          style={{ flex: 1, padding: 10, border: '1px solid #ccc', borderRadius: 10 }}
        />
        <button type="submit" style={{ padding: '10px 16px', borderRadius: 10 }}>検索</button>
        <button type="button" onClick={() => { setQ(''); fetchNotes(''); }} style={{ padding: '10px 16px', borderRadius: 10 }}>
          クリア
        </button>
      </form>

      {/* 作成フォーム */}
      <section style={{ border: '1px solid #eee', borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>新規ノート</h2>
        <form onSubmit={onCreate} style={{ display: 'grid', gap: 8 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトル（必須）"
            style={{ padding: 10, border: '1px solid #ccc', borderRadius: 10 }}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="本文（任意）"
            rows={4}
            style={{ padding: 10, border: '1px solid #ccc', borderRadius: 10 }}
          />
          <div>
            <button type="submit" disabled={posting} style={{ padding: '10px 16px', borderRadius: 10 }}>
              {posting ? '送信中…' : '作成'}
            </button>
          </div>
        </form>
      </section>

      {/* エラー表示 */}
      {error && <p style={{ color: 'crimson', marginBottom: 8 }}>Error: {error}</p>}

      {/* 一覧 */}
      <section>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>ノート一覧</h2>
        {loading ? (
          <p>読み込み中…</p>
        ) : items.length === 0 ? (
          <p>データがありません</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {items.map((it) => (
              <li key={it.id} style={{ padding: 12, borderBottom: '1px solid #eee', display: 'grid', gap: 6 }}>
                <div style={{ fontWeight: 600 }}>
                  <code style={{ opacity: 0.6, marginRight: 6 }}>#{it.id}</code>
                  {it.title}
                </div>
                {it.content && <div style={{ whiteSpace: 'pre-wrap' }}>{it.content}</div>}
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  作成: {fmt(it.createdAt)}　更新: {fmt(it.updatedAt)}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => onEdit(it)} style={{ padding: '6px 12px', borderRadius: 10 }}>
                    編集
                  </button>
                  <button onClick={() => onDelete(it.id)} style={{ padding: '6px 12px', borderRadius: 10 }}>
                    削除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
