import { useState, useEffect } from "react"
import { STORES } from "../stores"
import { addTimelineEntry, onTimelineChange } from "../firebase"

const G = "#4d8c00"
const TODAY = new Date().toISOString().slice(0, 10)

const STORE_NAMES = STORES.map(s => s.name).sort()

export default function StaffTimeline() {
  const [subject, setSubject] = useState("")
  const [author, setAuthor] = useState("")
  const [selectedStores, setSelectedStores] = useState([])
  const [content, setContent] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [entries, setEntries] = useState([])
  const [viewDate, setViewDate] = useState(TODAY)
  const [showStoreSelect, setShowStoreSelect] = useState(false)

  useEffect(() => {
    const unsub = onTimelineChange(viewDate, (data) => {
      const arr = Object.entries(data).map(([id, v]) => ({ id, ...v }))
      setEntries(arr.sort((a, b) => (b.at || 0) - (a.at || 0)))
    })
    return () => unsub()
  }, [viewDate])

  const handleSubmit = async () => {
    if (!subject.trim() || !author.trim() || !content.trim()) return
    setSending(true)
    await addTimelineEntry(TODAY, {
      subject: subject.trim(),
      author: author.trim(),
      stores: selectedStores,
      content: content.trim(),
      at: Date.now(),
    })
    setSending(false)
    setSent(true)
    setSubject("")
    setContent("")
    setSelectedStores([])
    setTimeout(() => setSent(false), 2000)
  }

  const toggleStore = (name) => {
    setSelectedStores(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    )
  }

  // 日付ナビ
  const changeDate = (offset) => {
    const d = new Date(viewDate)
    d.setDate(d.getDate() + offset)
    setViewDate(d.toISOString().slice(0, 10))
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" })
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f5", fontFamily: "'Noto Sans JP', sans-serif" }}>
      <header style={{ background: G, padding: "12px 16px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", textAlign: "center" }}>タイムライン</div>
      </header>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "16px" }}>
        {/* 投稿フォーム */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "16px", marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12 }}>新規投稿</div>

          <div style={{ marginBottom: 10 }}>
            <input type="text" placeholder="件名" value={subject} onChange={e => setSubject(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #d1d5db", fontSize: 14, boxSizing: "border-box" }} />
          </div>

          <div style={{ marginBottom: 10 }}>
            <input type="text" placeholder="名前" value={author} onChange={e => setAuthor(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #d1d5db", fontSize: 14, boxSizing: "border-box" }} />
          </div>

          <div style={{ marginBottom: 10 }}>
            <div onClick={() => setShowStoreSelect(!showStoreSelect)}
              style={{ padding: "10px 12px", borderRadius: 8, border: "1.5px solid #d1d5db", fontSize: 14, cursor: "pointer", color: selectedStores.length > 0 ? "#1a1a1a" : "#94a3b8", background: "#fff" }}>
              {selectedStores.length > 0 ? selectedStores.join(", ") : "店舗を選択（複数可）"}
            </div>
            {showStoreSelect && (
              <div style={{ background: "#fff", border: "1.5px solid #d1d5db", borderRadius: 8, marginTop: 4, maxHeight: 200, overflowY: "auto", padding: "4px 0" }}>
                {STORE_NAMES.map(name => (
                  <div key={name} onClick={() => toggleStore(name)}
                    style={{ padding: "8px 12px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, background: selectedStores.includes(name) ? "#f0fdf4" : "#fff" }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${selectedStores.includes(name) ? G : "#d1d5db"}`, background: selectedStores.includes(name) ? G : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {selectedStores.includes(name) && <span style={{ color: "#fff", fontSize: 12, fontWeight: 900 }}>✓</span>}
                    </div>
                    {name}
                  </div>
                ))}
                <div onClick={() => setShowStoreSelect(false)} style={{ padding: "8px 12px", textAlign: "center", fontSize: 12, fontWeight: 700, color: G, cursor: "pointer", borderTop: "1px solid #e5e7eb" }}>閉じる</div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: 12 }}>
            <textarea placeholder="情報を入力..." rows={4} value={content} onChange={e => setContent(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #d1d5db", fontSize: 14, resize: "vertical", boxSizing: "border-box" }} />
          </div>

          <button onClick={handleSubmit} disabled={sending || !subject.trim() || !author.trim() || !content.trim()}
            style={{ width: "100%", padding: "12px", borderRadius: 8, background: sending ? "#94a3b8" : G, color: "#fff", border: "none", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
            {sent ? "投稿しました!" : sending ? "送信中..." : "投稿する"}
          </button>
        </div>

        {/* 日付ナビ */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <button onClick={() => changeDate(-1)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", padding: "4px 8px" }}>←</button>
          <div style={{ fontSize: 14, fontWeight: 800 }}>{formatDate(viewDate)}{viewDate === TODAY && <span style={{ fontSize: 11, color: G, marginLeft: 6 }}>今日</span>}</div>
          <button onClick={() => changeDate(1)} disabled={viewDate >= TODAY} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", padding: "4px 8px", opacity: viewDate >= TODAY ? 0.3 : 1 }}>→</button>
        </div>

        {/* タイムライン一覧 */}
        {entries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8", fontSize: 13 }}>この日の投稿はありません</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {entries.map((entry) => (
              <div key={entry.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#1a1a1a" }}>{entry.subject}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>{entry.at ? new Date(entry.at).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }) : ""}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: G, background: "#f0fdf4", padding: "1px 6px", borderRadius: 4 }}>{entry.author}</span>
                  {entry.stores && entry.stores.length > 0 && (
                    <span style={{ fontSize: 10, color: "#64748b" }}>{entry.stores.join(" / ")}</span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{entry.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
