import { useState, useEffect, useRef, useMemo, Fragment } from 'react'
import { Link, useParams } from 'react-router-dom'
import HanziWriter from 'hanzi-writer'
import { UNIT1, TEXT_TYPES } from '../ib/unit1.js'
import CHAR_INFO from '../ib/charInfo.json'
import { speakChinese, isSpeechSupported } from '../utils/speech.js'
import './Ib.css'

// ---------------------------------------------------------------- course map
// Mirrors the iChinese 3 contents: 2 themes x 5 units. Only Unit 1 is built so far.
const COURSE = [
  { no: 1, zh: '身份认同', en: 'Identities', units: [
    { no: 1, zh: '生活方式', en: 'Lifestyle', data: UNIT1 },
    { no: 2, zh: '健康和幸福', en: 'Health and Well-being' },
    { no: 3, zh: '信念和价值观', en: 'Beliefs and Values' },
    { no: 4, zh: '次文化', en: 'Subcultures' },
    { no: 5, zh: '语言与身份认同', en: 'Language and Identity' }
  ] },
  { no: 2, zh: '体验', en: 'Experiences', units: [
    { no: 1, zh: '休闲活动', en: 'Leisure Activities' },
    { no: 2, zh: '假日和旅行', en: 'Holidays and Travel' },
    { no: 3, zh: '生活故事', en: 'Life Stories' },
    { no: 4, zh: '风俗与传统', en: 'Customs and Traditions' },
    { no: 5, zh: '迁移', en: 'Migration' }
  ] }
]
const UNITS = { u1: UNIT1 }
const CIRCLED = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩']

// ---------------------------------------------------------------- progress (saved in this browser)
const PKEY = 'mandalink_ib_progress'
const loadProgress = () => { try { return JSON.parse(localStorage.getItem(PKEY)) || {} } catch { return {} } }
const saveProgress = (unitId, sectionId, score, total) => {
  const p = loadProgress(); p[`${unitId}/${sectionId}`] = { score, total, at: Date.now() }
  try { localStorage.setItem(PKEY, JSON.stringify(p)) } catch {}
}

// ---------------------------------------------------------------- answer checking
const norm = s => (s || '').toLowerCase().replace(/[\s，。、！？；：,.!?;:"'“”‘’（）()《》「」\-—…·]/g, '')
const matches = (answer, accept) => {
  const a = norm(answer)
  return a.length > 0 && (accept || []).some(k => a.includes(norm(k)))
}

// ================================================================= /ib
export function IbHome() {
  const progress = loadProgress()
  const doneIn = (unit) => unit.sections.filter(s => progress[`${unit.id}/${s.id}`]).length
  return (
    <div className="page ib-page">
      <div className="ib-hero card">
        <div className="ib-hero-tag">IB Chinese B · SL / HL</div>
        <h2 className="page-h">IB 中文 B 课程</h2>
        <p className="helper">
          A structured course following the IB Chinese B themes. Each unit has reading texts, exam-style reading with
          line references, structured listening, essay writing with text-type guides, and new characters with radicals
          and stroke order.
        </p>
        <div className="ib-hero-note">IGCSE Chinese is coming in a later phase.</div>
      </div>
      {COURSE.map(theme => (
        <section key={theme.no} className="ib-theme">
          <h3 className="ib-theme-h"><span>THEME {theme.no}</span> {theme.zh} <em>{theme.en}</em></h3>
          <div className="ib-unit-grid">
            {theme.units.map(u => u.data ? (
              <Link key={u.no} to={`/ib/${u.data.id}`} className="card ib-unit-card">
                <div className="ib-unit-no">Unit {u.no}</div>
                <div className="ib-unit-zh">{u.zh}</div>
                <div className="ib-unit-en">{u.en}</div>
                <div className="ib-unit-prog">{doneIn(u.data)} / {u.data.sections.length} sections done</div>
              </Link>
            ) : (
              <div key={u.no} className="card ib-unit-card locked">
                <div className="ib-unit-no">Unit {u.no}</div>
                <div className="ib-unit-zh">{u.zh}</div>
                <div className="ib-unit-en">{u.en}</div>
                <div className="ib-unit-prog">Coming soon</div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

// ================================================================= /ib/:unitId
const KIND_ICON = { text: '课', listening: '听', exam: '读', writing: '写', characters: '字' }

export function IbUnit() {
  const { unitId } = useParams()
  const unit = UNITS[unitId]
  const [level, setLevel] = useState('ALL')
  if (!unit) return <div className="page"><p className="helper">Unit not found. <Link to="/ib">Back to IB</Link></p></div>
  const progress = loadProgress()
  const shown = unit.sections.filter(s => level === 'ALL' || s.level.includes(level))
  return (
    <div className="page ib-page">
      <div className="ib-crumbs"><Link to="/ib">IB</Link> › Theme {unit.themeNo} {unit.themeZh} › Unit {unit.no}</div>
      <h2 className="page-h">{unit.zh} <span className="ib-sub">{unit.en}</span></h2>
      <p className="helper">{unit.intro}</p>
      <div className="ib-level-toggle">
        {['ALL', 'SL', 'HL'].map(l => (
          <button key={l} className={level === l ? 'on' : ''} onClick={() => setLevel(l)}>{l === 'ALL' ? 'All' : l}</button>
        ))}
      </div>
      <div className="ib-section-list">
        {shown.map(s => {
          const p = progress[`${unit.id}/${s.id}`]
          return (
            <Link key={s.id} to={`/ib/${unit.id}/${s.id}`} className="card ib-section-row">
              <div className={`ib-kind k-${s.kind}`}>{KIND_ICON[s.kind]}</div>
              <div className="ib-section-main">
                <div className="ib-section-label">{s.label} <span>{s.labelEn}</span> <b className={`lvl ${s.level === 'HL' ? 'hl' : ''}`}>{s.level}</b></div>
                <div className="ib-section-title">{s.title}{s.textType && <em> · {s.textType}</em>}</div>
              </div>
              <div className="ib-section-done">{p ? (p.total ? `${p.score}/${p.total}` : '✓') : ''}</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// ================================================================= /ib/:unitId/:sectionId
export function IbSection() {
  const { unitId, sectionId } = useParams()
  const unit = UNITS[unitId]
  const section = unit && unit.sections.find(s => s.id === sectionId)
  if (!section) return <div className="page"><p className="helper">Section not found. <Link to="/ib">Back to IB</Link></p></div>
  const idx = unit.sections.indexOf(section)
  const next = unit.sections[idx + 1]
  return (
    <div className="page ib-page">
      <div className="ib-crumbs"><Link to="/ib">IB</Link> › <Link to={`/ib/${unit.id}`}>Unit {unit.no} {unit.zh}</Link> › {section.labelEn}</div>
      <div className="ib-section-head">
        <span className={`ib-kind k-${section.kind}`}>{KIND_ICON[section.kind]}</span>
        <div>
          <div className="ib-section-label">{section.label} <span>{section.labelEn}</span> <b className={`lvl ${section.level === 'HL' ? 'hl' : ''}`}>{section.level}</b></div>
          <h2 className="page-h ib-title">{section.title}</h2>
        </div>
      </div>
      {section.kind === 'text' && <TextLesson unit={unit} s={section} />}
      {section.kind === 'listening' && <Listening unit={unit} s={section} />}
      {section.kind === 'exam' && <ExamReading unit={unit} s={section} />}
      {section.kind === 'writing' && <Writing unit={unit} s={section} />}
      {section.kind === 'characters' && <Characters unit={unit} />}
      {next && <div className="ib-next"><Link className="btn primary" to={`/ib/${unit.id}/${next.id}`}>Next: {next.labelEn} →</Link></div>}
    </div>
  )
}

// ---------------------------------------------------------------- shared: questions
function useAnswers() {
  const [answers, setAnswers] = useState({})
  const set = (key, val) => setAnswers(a => ({ ...a, [key]: val }))
  return [answers, set]
}

// Scores every question. Short answers that don't match a keyword go to self-review
// (the student compares with the model answer and marks themselves).
function scoreAll(groups, answers, review) {
  let score = 0, total = 0
  const result = {}
  groups.forEach(g => g.questions.forEach(q => {
    if (q.type === 'gap') q.gaps.forEach(gp => { total++; const ok = (answers[`${q.id}-${gp.n}`] || '').trim() === gp.answer; result[`${q.id}-${gp.n}`] = ok ? 'right' : 'wrong'; if (ok) score++ })
    else if (q.type === 'match') q.items.forEach(it => { total++; const ok = (answers[`${q.id}-${it.n}`] || '') === it.answer; result[`${q.id}-${it.n}`] = ok ? 'right' : 'wrong'; if (ok) score++ })
    else if (q.type === 'tf') q.items.forEach(it => {
      total++; const k = `${q.id}-${it.n}`
      const tfOk = answers[`${k}-tf`] === (it.answer ? 'T' : 'F')
      const reasonOk = matches(answers[`${k}-why`], it.accept)
      let st = !tfOk ? 'wrong' : reasonOk ? 'right' : (review[k] || 'review')
      result[k] = st; if (st === 'right') score++
    })
    else {
      const parts = q.type === 'table' ? q.rows.map((r, i) => ({ ...r, key: `${q.id}-${i}` })) : (q.parts ? q.parts.map((p, i) => ({ ...p, key: `${q.id}-${i}` })) : [{ ...q, key: q.id }])
      parts.forEach(p => { total++; const ok = matches(answers[p.key], p.accept); const st = ok ? 'right' : (answers[p.key] ? (review[p.key] || 'review') : 'wrong'); result[p.key] = st; if (st === 'right') score++ })
    }
  }))
  return { score, total, result }
}

function Mark({ st, model, onSelf }) {
  if (!st) return null
  return (
    <div className={`ib-mark ${st}`}>
      <span className="ib-mark-badge">{st === 'right' ? '✓ 正确' : st === 'wrong' ? '✗' : '? 请对照参考答案'}</span>
      {model && st !== 'right' && <span className="ib-model">参考答案：{model}</span>}
      {st === 'review' && onSelf && (
        <span className="ib-self">
          <button onClick={() => onSelf('right')}>我答对了</button>
          <button onClick={() => onSelf('wrong')}>我答错了</button>
        </span>
      )}
    </div>
  )
}

function QuestionBlock({ unit, s }) {
  const [answers, setA] = useAnswers()
  const [checked, setChecked] = useState(false)
  const [review, setReview] = useState({})
  const [activeGap, setActiveGap] = useState(null)
  const { score, total, result } = useMemo(() => scoreAll(s.groups, answers, review), [s, answers, review])
  const st = key => (checked ? result[key] : null)
  const self = key => v => setReview(r => ({ ...r, [key]: v }))

  useEffect(() => { if (checked) saveProgress(unit.id, s.id, score, total) }, [checked, score, total])

  return (
    <div className="ib-questions">
      <div className="ib-q-head"><h3>阅读理解 <span>Comprehension</span></h3></div>
      {s.groups.map((g, gi) => (
        <div key={gi} className="card ib-group">
          <div className="ib-instr">{g.instr} <span>{g.instrEn}</span></div>
          {g.questions.map(q => (
            <div key={q.id} className="ib-q">
              {q.type === 'short' && !q.parts && (
                <>
                  <div className="ib-q-text">{q.q}</div>
                  <input className="ib-input" value={answers[q.id] || ''} onChange={e => setA(q.id, e.target.value)} placeholder="用中文回答…" />
                  <Mark st={st(q.id)} model={q.model} onSelf={self(q.id)} />
                </>
              )}
              {q.type === 'short' && q.parts && (
                <>
                  <div className="ib-q-text">{q.q}</div>
                  {q.parts.map((p, i) => (
                    <div key={i} className="ib-part">
                      <span className="ib-part-label">{p.label}</span>
                      <input className="ib-input" value={answers[`${q.id}-${i}`] || ''} onChange={e => setA(`${q.id}-${i}`, e.target.value)} />
                      <Mark st={st(`${q.id}-${i}`)} model={p.model} onSelf={self(`${q.id}-${i}`)} />
                    </div>
                  ))}
                </>
              )}
              {q.type === 'table' && (
                <table className="ib-table"><tbody>
                  {q.rows.map((r, i) => (
                    <tr key={i}>
                      <th>{r.label}</th>
                      <td>
                        <input className="ib-input" value={answers[`${q.id}-${i}`] || ''} onChange={e => setA(`${q.id}-${i}`, e.target.value)} />
                        <Mark st={st(`${q.id}-${i}`)} model={r.model} onSelf={self(`${q.id}-${i}`)} />
                      </td>
                    </tr>
                  ))}
                </tbody></table>
              )}
              {q.type === 'gap' && (
                <>
                  <div className="ib-bank">{q.bank.map(w => (
                    <button key={w} className="ib-chip" onClick={() => activeGap && setA(`${q.id}-${activeGap}`, w)}>{w}</button>
                  ))}</div>
                  <div className="ib-hint">先点一个空格，再点上面的词。 Tap a gap, then a word.</div>
                  <div className="ib-gap-grid">
                    {q.gaps.map(gp => (
                      <div key={gp.n} className="ib-gap-row">
                        <span>【-{gp.n}-】</span>
                        <input className={`ib-input ${activeGap === gp.n ? 'active' : ''}`} value={answers[`${q.id}-${gp.n}`] || ''}
                          onFocus={() => setActiveGap(gp.n)} onChange={e => setA(`${q.id}-${gp.n}`, e.target.value)} />
                        <Mark st={st(`${q.id}-${gp.n}`)} model={gp.answer} />
                      </div>
                    ))}
                  </div>
                </>
              )}
              {q.type === 'match' && (
                <div className="ib-match">
                  <div>{q.items.map(it => (
                    <div key={it.n} className="ib-match-row">
                      <span className="ib-match-stem">{it.n}. {it.stem}</span>
                      <select value={answers[`${q.id}-${it.n}`] || ''} onChange={e => setA(`${q.id}-${it.n}`, e.target.value)}>
                        <option value="">—</option>
                        {Object.keys(q.options).map(k => <option key={k} value={k}>{k}</option>)}
                      </select>
                      <Mark st={st(`${q.id}-${it.n}`)} model={checked && result[`${q.id}-${it.n}`] !== 'right' ? `${it.answer}` : null} />
                    </div>
                  ))}</div>
                  <ul className="ib-options">{Object.entries(q.options).map(([k, v]) => <li key={k}><b>{k}</b> {v}</li>)}</ul>
                </div>
              )}
              {q.type === 'tf' && q.items.map(it => {
                const k = `${q.id}-${it.n}`
                return (
                  <div key={it.n} className="ib-tf">
                    <div className="ib-tf-top">
                      <span className="ib-q-text">{it.n}. {it.stem}</span>
                      <span className="ib-tf-btns">
                        {[['T', '对'], ['F', '错']].map(([v, l]) => (
                          <button key={v} className={answers[`${k}-tf`] === v ? 'on' : ''} onClick={() => setA(`${k}-tf`, v)}>{l}</button>
                        ))}
                      </span>
                    </div>
                    <input className="ib-input" placeholder="理由：从文章中找出依据" value={answers[`${k}-why`] || ''} onChange={e => setA(`${k}-why`, e.target.value)} />
                    <Mark st={st(k)} model={`${it.answer ? '对' : '错'} —— ${it.model}`} onSelf={self(k)} />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      ))}
      <div className="ib-check-bar">
        <button className="btn primary" onClick={() => setChecked(true)}>检查答案 Check answers</button>
        {checked && <span className="ib-score">{score} / {total}</span>}
        {checked && <button className="btn" onClick={() => { setChecked(false); setReview({}) }}>继续修改 Keep editing</button>}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- Text lesson (课文)
function renderGaps(text) {
  return text.split(/(\{\{\d+\}\})/).map((part, i) => {
    const m = part.match(/\{\{(\d+)\}\}/)
    return m ? <span key={i} className="ib-gap-mark">【-{m[1]}-】</span> : <Fragment key={i}>{part}</Fragment>
  })
}

function TextLesson({ unit, s }) {
  const [showPost, setShowPost] = useState(false)
  return (
    <>
      <div className="ib-type-chip">{s.textType}</div>
      <article className="card ib-passage">
        {s.meta && <div className="ib-meta">{s.meta.map(([k, v]) => <div key={k}><b>{k}：</b>{v}</div>)}</div>}
        {s.paragraphs.map((p, i) => (
          <p key={i}><span className="ib-pnum">{CIRCLED[i]}</span>{renderGaps(p)}</p>
        ))}
        {isSpeechSupported() && <button className="btn ib-listen-btn" onClick={() => speakChinese(s.paragraphs.join('').replace(/\{\{\d+\}\}/g, '…'))}>🔊 朗读全文</button>}
      </article>
      <WordList words={s.words} />
      <QuestionBlock unit={unit} s={s} />
      {s.post && (
        <div className="card ib-group">
          <div className="ib-instr">{s.post.title} <span>{s.post.titleEn}</span> — {s.post.task}</div>
          <table className="ib-table"><tbody>
            {s.post.items.map(([zh, en], i) => <tr key={i}><th>{zh}</th><td>{showPost ? en : <input className="ib-input" placeholder="English meaning" />}</td></tr>)}
          </tbody></table>
          <button className="btn" onClick={() => setShowPost(v => !v)}>{showPost ? 'Hide' : 'Show'} suggested translations</button>
        </div>
      )}
    </>
  )
}

function WordList({ words }) {
  if (!words) return null
  return (
    <div className="card ib-words">
      <div className="ib-instr">生词 <span>New words</span></div>
      <div className="ib-word-grid">
        {words.map(([w, py, en]) => (
          <button key={w} className="ib-word" onClick={() => speakChinese(w)} title="Hear it">
            <b>{w}</b><span>{py}</span><em>{en}</em>
          </button>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- Listening (听力)
// Plays the script with the browser's Chinese voice, one line at a time so long
// passages aren't cut off. Each speaker gets a different pitch.
function Listening({ unit, s }) {
  const [playing, setPlaying] = useState(false)
  const [rate, setRate] = useState(0.9)
  const [line, setLine] = useState(-1)
  const [showScript, setShowScript] = useState(false)
  const stopRef = useRef(false)

  const voice = () => {
    const vs = window.speechSynthesis.getVoices()
    return vs.find(v => v.lang === 'zh-CN') || vs.find(v => (v.lang || '').startsWith('zh')) || null
  }
  const play = (from = 0) => {
    if (!isSpeechSupported()) return
    window.speechSynthesis.cancel(); stopRef.current = false; setPlaying(true)
    const speakLine = i => {
      if (stopRef.current || i >= s.script.length) { setPlaying(false); setLine(-1); return }
      const [who, text] = s.script[i]
      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'zh-CN'; u.rate = rate; u.pitch = (s.speakers[who] || {}).pitch || 1
      const v = voice(); if (v) u.voice = v
      u.onend = () => setTimeout(() => speakLine(i + 1), 450)
      setLine(i); window.speechSynthesis.speak(u)
    }
    speakLine(from)
  }
  const stop = () => { stopRef.current = true; window.speechSynthesis.cancel(); setPlaying(false); setLine(-1) }
  useEffect(() => () => { stopRef.current = true; if (isSpeechSupported()) window.speechSynthesis.cancel() }, [])

  return (
    <>
      <div className="ib-type-chip">{s.textType}</div>
      <div className="card ib-player">
        <p className="ib-listen-instr">{s.instructions}</p>
        {isSpeechSupported() ? (
          <div className="ib-player-row">
            {!playing
              ? <button className="btn primary" onClick={() => play(0)}>▶ 播放 Play</button>
              : <button className="btn" onClick={stop}>■ 停止 Stop</button>}
            <label className="ib-rate">速度
              <select value={rate} onChange={e => setRate(Number(e.target.value))}>
                <option value={0.75}>0.75×</option><option value={0.9}>0.9×</option><option value={1}>1×</option>
              </select>
            </label>
            {playing && <span className="ib-playing">正在播放… {line + 1}/{s.script.length}</span>}
          </div>
        ) : (
          <p className="helper">Your browser has no speech voice. Try Chrome, Edge or Safari, or read the transcript.</p>
        )}
        <button className="ib-linkbtn" onClick={() => setShowScript(v => !v)}>{showScript ? '隐藏' : '显示'}听力原文 Transcript</button>
        {showScript && <div className="ib-script">{s.script.map(([who, t], i) => <p key={i} className={i === line ? 'now' : ''}><b>{who}：</b>{t}</p>)}</div>}
      </div>
      <QuestionBlock unit={unit} s={s} />
    </>
  )
}

// ---------------------------------------------------------------- Exam reading (Paper 2 style, numbered lines)
function ExamReading({ unit, s }) {
  return (
    <>
      <div className="ib-type-chip">{s.textType}</div>
      <article className="card ib-exam">
        {s.lines.map((l, i) => (
          <div key={i} className="ib-line"><span className="ib-lno">{(i + 1) % 5 === 0 || i === 0 ? i + 1 : ''}</span><span>{l}</span></div>
        ))}
      </article>
      <QuestionBlock unit={unit} s={s} />
    </>
  )
}

// ---------------------------------------------------------------- Writing (写作)
const hanCount = t => (t.match(/\p{Script=Han}/gu) || []).length

function Writing({ unit, s }) {
  const [lvl, setLvl] = useState('sl')
  const cfg = s[lvl]
  const [promptId, setPromptId] = useState(cfg.prompts[0].id)
  const prompt = cfg.prompts.find(p => p.id === promptId) || cfg.prompts[0]
  const [ttype, setTtype] = useState(prompt.types[0])
  const key = `mandalink_ib_essay_${unit.id}_${prompt.id}`
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => { setPromptId(s[lvl].prompts[0].id) }, [lvl])
  useEffect(() => {
    try { const d = JSON.parse(localStorage.getItem(key)); setText(d ? d.text : ''); setTtype(d && prompt.types.includes(d.type) ? d.type : prompt.types[0]) } catch { setText('') }
  }, [key])
  useEffect(() => {
    const t = setTimeout(() => { try { localStorage.setItem(key, JSON.stringify({ text, type: ttype, at: Date.now() })); setSaved(true); if (text) saveProgress(unit.id, s.id, 0, 0) } catch {} }, 600)
    setSaved(false); return () => clearTimeout(t)
  }, [text, ttype, key])

  const n = hanCount(text)
  const [lo, hi] = cfg.range
  const state = n < lo ? 'under' : n > hi ? 'over' : 'ok'
  const download = () => {
    const blob = new Blob([`${prompt.text}\n文本类型：${ttype}\n字数：${n}\n\n${text}`], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `IB-${unit.zh}-${ttype}.txt`; a.click()
  }
  const guide = TEXT_TYPES[ttype]

  return (
    <>
      <div className="ib-level-toggle">
        <button className={lvl === 'sl' ? 'on' : ''} onClick={() => setLvl('sl')}>SL · 300–480字</button>
        <button className={lvl === 'hl' ? 'on' : ''} onClick={() => setLvl('hl')}>HL · 540–720字</button>
      </div>
      <p className="helper">{cfg.instr}</p>
      <div className="ib-prompts">
        {cfg.prompts.map((p, i) => (
          <button key={p.id} className={`card ib-prompt ${p.id === prompt.id ? 'on' : ''}`} onClick={() => setPromptId(p.id)}>
            <b>{i + 1}.</b> {p.text}
            <span className="ib-prompt-types">{p.types.map(t => <i key={t}>◆ {t}</i>)}</span>
          </button>
        ))}
      </div>
      <div className="ib-write-grid">
        <div className="card ib-editor">
          <div className="ib-editor-top">
            <label>文本类型
              <select value={ttype} onChange={e => setTtype(e.target.value)}>
                {prompt.types.map(t => <option key={t} value={t}>{t} {TEXT_TYPES[t] ? TEXT_TYPES[t].en : ''}</option>)}
              </select>
            </label>
            <span className={`ib-count ${state}`}>{n} 字 <small>（{lo}–{hi}）</small></span>
          </div>
          <div className="ib-meter"><div className={state} style={{ width: `${Math.min(100, (n / hi) * 100)}%` }} /></div>
          <textarea className="ib-textarea" value={text} onChange={e => setText(e.target.value)} placeholder="在这里写你的文章……（自动保存在这个浏览器里）" />
          <div className="ib-editor-foot">
            <span className="ib-saved">{text ? (saved ? '✓ 已保存 Saved' : '保存中…') : ''}</span>
            <button className="btn" onClick={() => navigator.clipboard && navigator.clipboard.writeText(text)} disabled={!text}>复制 Copy</button>
            <button className="btn" onClick={download} disabled={!text}>下载 Download</button>
          </div>
        </div>
        {guide && (
          <aside className="card ib-guide">
            <div className="ib-instr">{ttype} 格式要点 <span>{guide.en} checklist</span></div>
            <ul>{guide.tips.map(t => <li key={t}>{t}</li>)}</ul>
          </aside>
        )}
      </div>
    </>
  )
}

// ---------------------------------------------------------------- New characters (生字)
function CharCard({ ch }) {
  const info = CHAR_INFO[ch] || {}
  const ref = useRef(null)
  const writer = useRef(null)
  const [mode, setMode] = useState('idle')
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    ref.current.innerHTML = ''
    writer.current = HanziWriter.create(ref.current, ch, {
      width: 132, height: 132, padding: 6, showOutline: true,
      strokeColor: getComputedStyle(document.documentElement).getPropertyValue('--text-hi').trim() || '#242424',
      radicalColor: getComputedStyle(document.documentElement).getPropertyValue('--blue').trim() || '#0f6cbd',
      outlineColor: '#e4ddd0', strokeAnimationSpeed: 1.2, delayBetweenStrokes: 180,
      charDataLoader: (c, done) => {
        fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodeURIComponent(c)}.json`)
          .then(r => { if (!r.ok) throw new Error(); return r.json() }).then(done).catch(() => setMissing(true))
      }
    })
  }, [ch])

  const animate = () => { if (writer.current) { setMode('anim'); writer.current.animateCharacter({ onComplete: () => setMode('idle') }) } }
  const practice = () => { if (writer.current) { setMode('quiz'); writer.current.quiz({ onComplete: () => setMode('done') }) } }

  return (
    <div className="card ib-char">
      <div className="ib-char-canvas" ref={ref} />
      {missing && <div className="ib-char-fallback">{ch}</div>}
      <div className="ib-char-info">
        <div className="ib-char-py">{(info.pinyin || []).join(', ')} <button className="ib-linkbtn" onClick={() => speakChinese(ch)}>🔊</button></div>
        <div className="ib-char-def">{info.definition || ''}</div>
        {info.radical && (
          <div className="ib-radical">
            <span className="ib-radical-ch">{info.radical}</span>
            <span>部首 radical{info.radicalMeaning ? `: ${info.radicalMeaning}` : ''}{info.radicalPinyin ? ` (${info.radicalPinyin})` : ''}</span>
          </div>
        )}
        {info.decomposition && <div className="ib-decomp">结构 {info.decomposition}</div>}
        <div className="ib-char-btns">
          <button className="btn" onClick={animate}>笔顺 Stroke order</button>
          <button className="btn" onClick={practice}>{mode === 'done' ? '✓ 再写一次' : '练写 Practice'}</button>
        </div>
        {mode === 'quiz' && <div className="ib-hint">在方框里按笔顺写出这个字。 Trace it in stroke order.</div>}
      </div>
    </div>
  )
}

function Characters({ unit }) {
  const lessons = unit.sections.filter(s => s.words)
  const [lessonId, setLessonId] = useState(lessons[0].id)
  const lesson = lessons.find(l => l.id === lessonId)
  const chars = useMemo(() => [...new Set(lesson.words.map(w => w[0]).join('').split(''))].filter(c => /\p{Script=Han}/u.test(c)), [lesson])
  useEffect(() => { saveProgress(unit.id, 'characters', 0, 0) }, [])
  return (
    <>
      <p className="helper">每个生字都标出了部首（彩色笔画）和它的意思。点"笔顺"看动画，点"练写"自己写。 Radical strokes are highlighted in colour.</p>
      <div className="ib-level-toggle">
        {lessons.map(l => <button key={l.id} className={l.id === lessonId ? 'on' : ''} onClick={() => setLessonId(l.id)}>{l.labelEn}</button>)}
      </div>
      <WordList words={lesson.words} />
      <div className="ib-char-grid">{chars.map(c => <CharCard key={`${lessonId}-${c}`} ch={c} />)}</div>
    </>
  )
}
