import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight, Camera, Check, Copy, GraduationCap, Sparkles } from 'lucide-react'
import { Link, useNavigate } from '@/lib/router-compat'
import { useAuth } from '../context/AuthContext'
import { findFormula } from '../services/groq'
import heroImage from '@/assets/hero-light.jpg'
import teachersImage from '@/assets/teachers-light.jpg'
import studentsImage from '@/assets/students-light.jpg'

const FREE_USES_KEY = 'fx_free_uses'
const MAX_FREE_USES = 3

function readFreeUses() {
  if (typeof window === 'undefined') return 0
  return parseInt(window.localStorage.getItem(FREE_USES_KEY) || '0', 10) || 0
}
function bumpFreeUses() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(FREE_USES_KEY, String(readFreeUses() + 1))
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

async function searchTopicFormulas(topic, cls) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_API_KEY}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a formula reference for Indian students. Given a topic, return ALL formulas from the ${cls} NCERT/CBSE/NEET/JEE syllabus as a JSON array. Each item: { name, formula (with variables defined), unit (or null), description (one line) }. Return ONLY a valid JSON array, no markdown.`,
        },
        { role: 'user', content: `All formulas for topic: "${topic}" at ${cls} level.` },
      ],
      temperature: 0.2,
      max_tokens: 1500,
    }),
  })
  const data = await res.json()
  const text = data.choices?.[0]?.message?.content || '[]'
  try {
    return JSON.parse(text)
  } catch {
    const m = text.match(/\[[\s\S]*\]/)
    return m ? JSON.parse(m[0]) : []
  }
}

/* ------------------------------------------------------------------ */

function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function FormulaChip({ label, value }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 1400)
      }}
      className="group flex w-full items-center justify-between gap-4 rounded-xl border border-[#E4E0D8] bg-white px-4 py-3 text-left transition-all hover:border-[#0E7C8B]/45 hover:shadow-[0_10px_30px_-22px_rgba(14,124,139,0.9)]"
    >
      <span className="text-[13px] text-[#5B6670]">{label}</span>
      <span className="flex items-center gap-2">
        <code className="font-mono text-[13px] text-[#0E7C8B]">{value}</code>
        {copied ? (
          <Check size={13} className="text-[#0E7C8B]" />
        ) : (
          <Copy size={13} className="text-[#B4AFA4] group-hover:text-[#5B6670]" />
        )}
      </span>
    </button>
  )
}

/* ------------------------------------------------------------------ */

function Hero({ isSignedIn }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])

  const words = ['Find', 'the', 'formula.', 'Not', 'the', 'answer.']

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#FBFAF7] pt-32 pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-32 h-[520px] w-[520px] rounded-full bg-[#0E7C8B]/10 blur-[120px]"
      />
      <div className="relative mx-auto grid max-w-[1240px] items-center gap-14 px-6 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0E7C8B]/25 bg-[#0E7C8B]/8 px-4 py-1.5 text-[11px] font-medium tracking-[0.18em] text-[#0E7C8B] uppercase"
          >
            <Sparkles size={12} /> Class 9–12 · NEET · JEE
          </motion.p>

          <h1 className="font-[Outfit] text-[44px] leading-[1.02] font-extrabold tracking-[-0.04em] text-[#141A1F] md:text-[64px]">
            {words.map((w, i) => (
              <motion.span
                key={`${w}-${i}`}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className={`mr-[0.26em] inline-block ${i > 2 ? 'text-[#0E7C8B]' : ''}`}
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 max-w-[48ch] text-[16px] leading-relaxed text-[#5B6670] md:text-[17px]"
          >
            Paste a question or upload a photo of it. FormulaX names every formula the question needs
            and lays out the approach step by step — it never hands you the final answer, so the
            solving stays yours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.72 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              to={isSignedIn ? '/dashboard/approach' : '/login'}
              className="group inline-flex items-center gap-2 rounded-full bg-[#0E7C8B] px-7 py-3.5 text-[14px] font-semibold text-white transition-all hover:bg-[#0B6675]"
            >
              {isSignedIn ? 'Open dashboard' : 'Start free'}
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#finder-free"
              className="rounded-full border border-[#DCD7CD] bg-white px-7 py-3.5 text-[14px] font-medium text-[#141A1F] transition-colors hover:border-[#0E7C8B]/50"
            >
              Try it without signing in
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#E7E3DB] pt-7 text-[13px] text-[#5B6670]"
          >
            {['3 free tries, no account', 'Photo or typed questions', 'Class 9–12, NEET & JEE syllabus'].map(
              (t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check size={14} className="text-[#0E7C8B]" /> {t}
                </li>
              ),
            )}
          </motion.ul>
        </div>

        <motion.div style={{ y }} className="relative">
          <motion.img
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            src={heroImage}
            alt="Notebook of physics formulas beside a phone showing the FormulaX app"
            width={1600}
            height={1200}
            className="w-full rounded-[28px] border border-[#E7E3DB] object-cover shadow-[0_40px_80px_-50px_rgba(20,26,31,0.5)]"
          />
        </motion.div>
      </div>

      <a
        href="#finder-free"
        aria-label="Scroll to the free formula finder"
        className="mt-16 flex flex-col items-center gap-2 text-[#8C8579] transition-colors hover:text-[#0E7C8B]"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <span className="relative flex h-9 w-[22px] justify-center rounded-full border border-[#D6D0C5]">
          <span
            className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#0E7C8B]"
            style={{ animation: 'fx-scroll-cue 1.7s ease-in-out infinite' }}
          />
        </span>
        <ArrowDown size={14} style={{ animation: 'fx-float 2.4s ease-in-out infinite' }} />
      </a>
    </section>
  )
}

/* ------------------------------------------------------------------ */

function FreeFinder({ isSignedIn }) {
  const navigate = useNavigate()
  const [question, setQuestion] = useState('')
  const [image, setImage] = useState(null)
  const [imageBase64, setImageBase64] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [usesLeft, setUsesLeft] = useState(MAX_FREE_USES)
  const [showWall, setShowWall] = useState(false)

  useEffect(() => {
    setUsesLeft(MAX_FREE_USES - readFreeUses())
  }, [])

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(URL.createObjectURL(file))
    const reader = new FileReader()
    reader.onloadend = () => setImageBase64(String(reader.result).split(',')[1])
    reader.readAsDataURL(file)
  }

  const handleFind = async () => {
    if (!question.trim() && !imageBase64) return
    if (!isSignedIn && readFreeUses() >= MAX_FREE_USES) {
      setShowWall(true)
      return
    }
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await findFormula(question, imageBase64)
      setResult(res)
      bumpFreeUses()
      setUsesLeft(MAX_FREE_USES - readFreeUses())
      if (!isSignedIn && readFreeUses() >= MAX_FREE_USES) setShowWall(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="finder-free" className="border-t border-[#EAE6DE] bg-white px-6 py-24">
      <div className="mx-auto max-w-[880px]">
        <Reveal>
          <p className="text-[11px] tracking-[0.28em] text-[#0E7C8B] uppercase">Free · no login</p>
          <h2 className="mt-4 font-[Outfit] text-[32px] leading-[1.06] font-bold tracking-[-0.03em] text-[#141A1F] md:text-[44px]">
            Stuck on a question? Start here.
          </h2>
          <p className="mt-4 max-w-[54ch] text-[15px] text-[#5B6670]">
            {isSignedIn
              ? 'Unlimited on your account — this is the same engine as the dashboard.'
              : `${Math.max(usesLeft, 0)} free ${usesLeft === 1 ? 'try' : 'tries'} left on this device, then sign in to keep going.`}
          </p>
        </Reveal>

        <Reveal delay={0.08} className="relative mt-9">
          <div
            className={`rounded-3xl border border-[#E7E3DB] bg-[#FBFAF7] p-5 md:p-7 ${showWall ? 'pointer-events-none' : ''}`}
          >
            <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-[#D6D0C5] bg-white p-6 transition-colors hover:border-[#0E7C8B]/50">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              {image ? (
                <img src={image} alt="Uploaded question" className="max-h-44 rounded-xl object-contain" />
              ) : (
                <span className="flex items-center gap-3 text-[13px] text-[#5B6670]">
                  <Camera size={16} className="text-[#0E7C8B]" />
                  Upload or take a photo of the question
                </span>
              )}
            </label>
            {image && (
              <button
                onClick={() => {
                  setImage(null)
                  setImageBase64(null)
                }}
                className="mt-2 text-[12px] text-[#8C8579] transition-colors hover:text-[#141A1F]"
              >
                Remove image
              </button>
            )}

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
              placeholder="e.g. A ball is thrown upward at 20 m/s — find the maximum height."
              className="mt-4 w-full resize-none rounded-2xl border border-[#E0DBD1] bg-white p-5 text-[14px] text-[#141A1F] placeholder-[#A9A296] outline-none transition-colors focus:border-[#0E7C8B]"
            />

            <button
              onClick={handleFind}
              disabled={loading || (!question.trim() && !imageBase64)}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0E7C8B] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#0B6675] disabled:cursor-not-allowed disabled:opacity-35"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Reading the question…
                </>
              ) : (
                'Find the formulas'
              )}
            </button>

            {error && (
              <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-700">
                {error}
              </p>
            )}

            {result && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-7">
                <p className="mb-3 text-[11px] tracking-[0.22em] text-[#8C8579] uppercase">Formulas to use</p>
                <div className="space-y-3">
                  {result.formulas?.map((f, i) => (
                    <div key={i} className="rounded-2xl border border-[#E7E3DB] bg-white p-5">
                      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <p className="text-[14px] font-semibold text-[#141A1F]">{f.name}</p>
                        <code className="rounded-lg bg-[#0E7C8B]/8 px-3 py-1 font-mono text-[12.5px] text-[#0E7C8B]">
                          {f.formula}
                        </code>
                      </div>
                      <p className="text-[13px] leading-relaxed text-[#5B6670]">{f.why}</p>
                    </div>
                  ))}
                </div>
                {result.approach && (
                  <div className="mt-3 rounded-2xl border border-[#E7E3DB] bg-white p-5">
                    <p className="mb-3 text-[11px] tracking-[0.22em] text-[#8C8579] uppercase">Approach</p>
                    <ol className="space-y-2">
                      {result.approach.map((step, i) => (
                        <li key={i} className="flex gap-3 text-[13px] text-[#3C464E]">
                          <span className="font-mono text-[#0E7C8B]">{String(i + 1).padStart(2, '0')}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {showWall && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-white/95 p-8 text-center backdrop-blur-sm"
            >
              <h3 className="font-[Outfit] text-[22px] font-bold text-[#141A1F]">That's your three free tries</h3>
              <p className="mt-2 max-w-[38ch] text-[14px] text-[#5B6670]">
                Sign in to keep finding formulas, save them, build chapter sheets and join your class group.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="mt-6 rounded-full bg-[#0E7C8B] px-8 py-3.5 text-[14px] font-semibold text-white"
              >
                Continue with Google — free
              </button>
            </motion.div>
          )}
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

function TopicSearch() {
  const [topic, setTopic] = useState('')
  const [cls, setCls] = useState('Class 12')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const classes = ['Class 9', 'Class 10', 'Class 11', 'Class 12', 'NEET', 'JEE']

  const handleSearch = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setResults(null)
    setError(null)
    try {
      setResults(await searchTopicFormulas(topic.trim(), cls))
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="library" className="border-t border-[#EAE6DE] bg-[#FBFAF7] px-6 py-24">
      <div className="mx-auto max-w-[1000px]">
        <Reveal>
          <p className="text-[11px] tracking-[0.28em] text-[#0E7C8B] uppercase">Formula library</p>
          <h2 className="mt-4 font-[Outfit] text-[32px] leading-[1.06] font-bold tracking-[-0.03em] text-[#141A1F] md:text-[44px]">
            Type a topic. Get every formula.
          </h2>
        </Reveal>

        <Reveal delay={0.06} className="mt-8 flex flex-wrap gap-2">
          {classes.map((c) => (
            <button
              key={c}
              onClick={() => setCls(c)}
              className={`rounded-full px-4 py-1.5 text-[12.5px] transition-all ${
                cls === c
                  ? 'bg-[#0E7C8B] font-semibold text-white'
                  : 'border border-[#DCD7CD] bg-white text-[#5B6670] hover:border-[#0E7C8B]/50 hover:text-[#141A1F]'
              }`}
            >
              {c}
            </button>
          ))}
        </Reveal>

        <Reveal delay={0.1} className="mt-5 flex gap-3">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="magnetic force, refraction, ideal gas…"
            className="flex-1 rounded-full border border-[#E0DBD1] bg-white px-6 py-3.5 text-[14px] text-[#141A1F] placeholder-[#A9A296] outline-none transition-colors focus:border-[#0E7C8B]"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !topic.trim()}
            className="rounded-full bg-[#141A1F] px-7 py-3.5 text-[14px] font-semibold text-white transition-opacity disabled:opacity-25"
          >
            {loading ? '…' : 'Search'}
          </button>
        </Reveal>

        {error && <p className="mt-6 text-[13px] text-red-600">{error}</p>}

        {results && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 grid gap-3 md:grid-cols-2"
          >
            {results.map((f, i) => (
              <div key={i} className="rounded-2xl border border-[#E7E3DB] bg-white p-5">
                <p className="text-[14px] font-semibold text-[#141A1F]">{f.name}</p>
                <code className="mt-2 block font-mono text-[13px] break-words text-[#0E7C8B]">{f.formula}</code>
                <p className="mt-2 text-[12.5px] text-[#5B6670]">{f.description}</p>
              </div>
            ))}
          </motion.div>
        )}

        {results && results.length === 0 && (
          <p className="mt-8 text-[14px] text-[#5B6670]">No formulas found. Try another topic.</p>
        )}

        {!results && (
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <FormulaChip label="Kinetic energy" value="K = ½mv²" />
            <FormulaChip label="Coulomb's law" value="F = kq₁q₂/r²" />
            <FormulaChip label="Ideal gas" value="PV = nRT" />
            <FormulaChip label="Lens formula" value="1/v − 1/u = 1/f" />
          </div>
        )}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

const STUDENT_FEATURES = [
  {
    title: 'Approach engine',
    body: 'Question in — every formula it needs, plus a short step-by-step approach. The final number stays yours to work out.',
  },
  {
    title: 'Chapter formula sheets',
    body: 'Browse any chapter of Class 9–12, NEET or JEE and get a clean sheet you can revise from and save.',
  },
  {
    title: 'Saved formulas & history',
    body: 'Everything you look up is kept, so you can come back to a formula the night before the exam.',
  },
  {
    title: 'Doubts, follows & DMs',
    body: 'Post a doubt, share a file, follow classmates and message the people you follow directly.',
  },
]

function ForStudents() {
  return (
    <section id="features" className="border-t border-[#EAE6DE] bg-white px-6 py-24">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <Reveal>
              <p className="text-[11px] tracking-[0.28em] text-[#0E7C8B] uppercase">For students</p>
              <h2 className="mt-4 max-w-[20ch] font-[Outfit] text-[32px] leading-[1.06] font-bold tracking-[-0.03em] text-[#141A1F] md:text-[44px]">
                Everything between a doubt and a solved paper.
              </h2>
            </Reveal>
            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {STUDENT_FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.05}>
                  <div className="h-full rounded-2xl border border-[#E7E3DB] bg-[#FBFAF7] p-6 transition-colors hover:border-[#0E7C8B]/40">
                    <span className="font-mono text-[12px] text-[#0E7C8B]">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="mt-3 font-[Outfit] text-[18px] font-semibold text-[#141A1F]">{f.title}</h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-[#5B6670]">{f.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={0.1}>
            <img
              src={studentsImage}
              alt="Two students studying together with notebooks and a laptop"
              width={1200}
              height={912}
              loading="lazy"
              className="w-full rounded-[28px] border border-[#E7E3DB] object-cover"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

const TEACHER_FEATURES = [
  'Create a class group and share one join code with your students.',
  'Post announcements, notes and files that everyone in the group sees instantly.',
  'Publish a test with your own questions and a deadline.',
  'See who joined, who attempted and each student’s score in one list.',
]

function ForTeachers({ isSignedIn }) {
  return (
    <section id="teachers" className="border-t border-[#EAE6DE] bg-[#FBFAF7] px-6 py-24">
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-[0.9fr_1fr]">
        <Reveal>
          <img
            src={teachersImage}
            alt="A teacher explaining projectile motion at a whiteboard to her class"
            width={1200}
            height={912}
            loading="lazy"
            className="w-full rounded-[28px] border border-[#E7E3DB] object-cover"
          />
        </Reveal>
        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2 text-[11px] tracking-[0.28em] text-[#0E7C8B] uppercase">
              <GraduationCap size={13} /> For teachers
            </p>
            <h2 className="mt-4 max-w-[20ch] font-[Outfit] text-[32px] leading-[1.06] font-bold tracking-[-0.03em] text-[#141A1F] md:text-[44px]">
              Run your class without another app.
            </h2>
            <p className="mt-4 max-w-[50ch] text-[15px] text-[#5B6670]">
              A teacher account turns FormulaX into your classroom: groups, announcements, files and
              tests, all in the same place your students already look up formulas.
            </p>
          </Reveal>
          <ul className="mt-7 space-y-3">
            {TEACHER_FEATURES.map((t, i) => (
              <Reveal key={t} delay={i * 0.05}>
                <li className="flex gap-3 rounded-2xl border border-[#E7E3DB] bg-white p-4 text-[14px] text-[#3C464E]">
                  <Check size={16} className="mt-[2px] shrink-0 text-[#0E7C8B]" />
                  {t}
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.24}>
            <Link
              to={isSignedIn ? '/dashboard/teacher' : '/login'}
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#0E7C8B] px-7 py-3.5 text-[14px] font-semibold text-[#0E7C8B] transition-colors hover:bg-[#0E7C8B] hover:text-white"
            >
              {isSignedIn ? 'Open teacher tools' : 'Set up a class group'} <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { t: 'Bring the question', d: 'Type it out or upload a photo straight from your book or phone camera.' },
    { t: 'Get formulas + approach', d: 'Each formula is named, written with its variables, and tied to why it applies here.' },
    { t: 'Solve it yourself', d: 'Save the formula, mark the chapter, and move to the next question.' },
  ]
  return (
    <section className="border-t border-[#EAE6DE] bg-white px-6 py-24">
      <div className="mx-auto max-w-[1240px]">
        <Reveal>
          <h2 className="font-[Outfit] text-[32px] font-bold tracking-[-0.03em] text-[#141A1F] md:text-[44px]">
            How it works
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.07}>
              <div className="h-full rounded-2xl border border-[#E7E3DB] bg-[#FBFAF7] p-7">
                <span className="font-[Outfit] text-[34px] font-bold text-[#0E7C8B]/25">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 font-[Outfit] text-[19px] font-semibold text-[#141A1F]">{s.t}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[#5B6670]">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

export default function Landing() {
  const { user } = useAuth()
  const isSignedIn = Boolean(user)

  return (
    <div className="min-h-screen bg-[#FBFAF7] font-[Inter] text-[#141A1F] antialiased">
      <nav className="fixed top-0 right-0 left-0 z-30 border-b border-[#EAE6DE] bg-[#FBFAF7]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-4">
          <Link to="/" className="font-[Outfit] text-[16px] font-bold tracking-tight text-[#141A1F]">
            Formula<span className="text-[#0E7C8B]">X</span>
          </Link>
          <div className="hidden gap-8 text-[13px] text-[#5B6670] md:flex">
            <a href="#finder-free" className="transition-colors hover:text-[#141A1F]">Finder</a>
            <a href="#library" className="transition-colors hover:text-[#141A1F]">Library</a>
            <a href="#features" className="transition-colors hover:text-[#141A1F]">Students</a>
            <a href="#teachers" className="transition-colors hover:text-[#141A1F]">Teachers</a>
            <Link to="/pricing" className="transition-colors hover:text-[#141A1F]">Pricing</Link>
          </div>
          <Link
            to={isSignedIn ? '/dashboard/explorer' : '/login'}
            className="rounded-full bg-[#0E7C8B] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#0B6675]"
          >
            {isSignedIn ? 'Dashboard' : 'Get started'}
          </Link>
        </div>
      </nav>

      <main>
        <Hero isSignedIn={isSignedIn} />
        <FreeFinder isSignedIn={isSignedIn} />
        <TopicSearch />
        <ForStudents />
        <ForTeachers isSignedIn={isSignedIn} />
        <HowItWorks />

        <section className="border-t border-[#EAE6DE] bg-[#FBFAF7] px-6 py-24">
          <div className="mx-auto max-w-[1240px] rounded-[32px] border border-[#0E7C8B]/25 bg-[#0E7C8B]/[0.06] p-12 text-center">
            <h2 className="font-[Outfit] text-[30px] font-bold tracking-[-0.03em] text-[#141A1F] md:text-[42px]">
              Build the instinct, not the shortcut.
            </h2>
            <p className="mx-auto mt-4 max-w-[48ch] text-[15px] text-[#5B6670]">
              Free to start — three tries without an account, then sign in with Google. No card needed.
            </p>
            <Link
              to={isSignedIn ? '/dashboard/explorer' : '/login'}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0E7C8B] px-8 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#0B6675]"
            >
              {isSignedIn ? 'Go to dashboard' : 'Start free'} <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#EAE6DE] bg-white px-6 py-12">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-4 text-[12.5px] text-[#8C8579] md:flex-row">
          <p>© {new Date().getFullYear()} FormulaX</p>
          <div className="flex gap-6">
            <Link to="/pricing" className="hover:text-[#141A1F]">Pricing</Link>
            <Link to="/terms" className="hover:text-[#141A1F]">Terms</Link>
            <Link to="/privacy" className="hover:text-[#141A1F]">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
