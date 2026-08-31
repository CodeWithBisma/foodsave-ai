'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, ArrowRight, CheckCircle2, ChevronDown, Leaf, RotateCcw, ShieldCheck, Sparkles, Thermometer, UtensilsCrossed } from 'lucide-react'

const foodOptions = ['Fruit', 'Vegetables', 'Dairy', 'Meat & seafood', 'Grains & bakery']
const storageOptions = ['Refrigerator', 'Freezer', 'Pantry', 'Countertop']

type FormState = {
  food: string
  quantity: string
  days: string
  storage: string
  temperature: string
  household: string
  wasteRate: string
}

const initialForm: FormState = {
  food: 'Fruit', quantity: '2.0', days: '4', storage: 'Refrigerator', temperature: '7', household: '3', wasteRate: '20',
}

function calculateRisk(form: FormState) {
  const quantity = Number(form.quantity) || 0
  const days = Number(form.days) || 0
  const temp = Number(form.temperature) || 0
  const household = Math.max(Number(form.household) || 1, 1)
  const waste = Number(form.wasteRate) || 0
  const perPerson = quantity / household
  const storagePenalty = form.storage === 'Countertop' ? 12 : form.storage === 'Pantry' ? 5 : form.storage === 'Freezer' ? -18 : 0
  return Math.min(99, Math.max(3, Math.round(19 + days * 8 + temp * 1.5 + perPerson * 7 + waste * 0.45 + storagePenalty)))
}

export default function Page() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const risk = useMemo(() => calculateRisk(form), [form])
  const level = risk >= 65 ? 'High' : risk >= 38 ? 'Medium' : 'Low'
  const tone = level === 'High' ? 'high' : level === 'Medium' ? 'medium' : 'low'

  function update(key: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"><Leaf aria-hidden="true" /></div>
            <div><p className="font-semibold tracking-tight">FoodSave AI</p><p className="text-xs text-muted-foreground">Smarter choices. Less waste.</p></div>
          </div>
          <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex"><ShieldCheck className="size-4 text-primary" aria-hidden="true" /> Research prototype</div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-12 pt-12 lg:px-8 lg:pt-16">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-medium text-primary"><Sparkles className="size-3.5" aria-hidden="true" /> Predict before it spoils</div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">Give every ingredient a better chance.</h1>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">FoodSave AI estimates household food-waste risk from everyday signals and turns the result into a simple next step.</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8" aria-labelledby="details-heading">
            <div className="mb-7 flex items-start justify-between gap-4"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">01 / Details</p><h2 id="details-heading" className="mt-2 text-xl font-semibold">Tell us about your food</h2></div><UtensilsCrossed className="size-5 text-muted-foreground" aria-hidden="true" /></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Food type" value={form.food} options={foodOptions} onChange={(v) => update('food', v)} />
              <Field label="Storage method" value={form.storage} options={storageOptions} onChange={(v) => update('storage', v)} />
              <NumberField label="Quantity (kg)" value={form.quantity} onChange={(v) => update('quantity', v)} min="0.1" step="0.1" />
              <NumberField label="Days since purchase" value={form.days} onChange={(v) => update('days', v)} min="0" />
              <NumberField label="Temperature (°C)" value={form.temperature} onChange={(v) => update('temperature', v)} min="-20" />
              <NumberField label="Household size" value={form.household} onChange={(v) => update('household', v)} min="1" />
              <div className="sm:col-span-2"><NumberField label="Previous waste rate (%)" value={form.wasteRate} onChange={(v) => update('wasteRate', v)} min="0" max="100" /></div>
            </div>
            <button type="button" onClick={() => setSubmitted(true)} className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">Predict waste risk <ArrowRight className="size-4" aria-hidden="true" /></button>
            <p className="mt-4 text-center text-xs text-muted-foreground">Uses synthetic data for demonstration purposes.</p>
          </section>

          <section className={`rounded-2xl border p-6 shadow-sm transition-colors sm:p-8 ${submitted ? `risk-${tone}` : 'border-border bg-muted/30'}`} aria-live="polite" aria-labelledby="result-heading">
            {!submitted ? <div className="flex min-h-[420px] flex-col items-center justify-center text-center"><div className="mb-5 flex size-16 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm"><Leaf className="size-7" aria-hidden="true" /></div><p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">02 / Your result</p><h2 id="result-heading" className="mt-3 text-2xl font-semibold">Ready when you are</h2><p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">Fill in the details to see a personalized estimate and recommendation.</p></div> : <Result risk={risk} level={level} onReset={() => { setForm(initialForm); setSubmitted(false) }} />}
          </section>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3"><InfoItem icon={<Thermometer />} title="Temperature-aware" text="Accounts for the environment your food is kept in." /><InfoItem icon={<UtensilsCrossed />} title="Actionable" text="Every prediction comes with a practical next step." /><InfoItem icon={<ShieldCheck />} title="Transparent" text="A research prototype, clearly labeled and honest." /></div>
      </section>
    </main>
  )
}

function Field({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) { return <label className="relative flex flex-col gap-2 text-sm font-medium">{label}<span className="relative"><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-2.5 pr-9 font-normal outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20">{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /></span></label> }
function NumberField({ label, value, onChange, ...props }: { label: string; value: string; onChange: (v: string) => void; min?: string; max?: string; step?: string }) { return <label className="flex flex-col gap-2 text-sm font-medium">{label}<input type="number" value={value} onChange={(e) => onChange(e.target.value)} {...props} className="rounded-lg border border-input bg-background px-3 py-2.5 font-normal outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20" /></label> }
function Result({ risk, level, onReset }: { risk: number; level: string; onReset: () => void }) { const tone = level === 'High' ? 'text-destructive' : level === 'Medium' ? 'text-amber-700' : 'text-primary'; return <div className="flex min-h-[420px] flex-col"><div className="flex items-center justify-between"><p className="text-xs font-medium uppercase tracking-[0.18em] opacity-70">02 / Your result</p><button type="button" onClick={onReset} className="inline-flex items-center gap-1.5 text-xs font-medium opacity-70 transition hover:opacity-100"><RotateCcw className="size-3.5" aria-hidden="true" /> Edit details</button></div><div className="mt-10 text-center"><div className={`text-8xl font-semibold tracking-[-0.08em] ${tone}`}>{risk}</div><div className="mt-1 text-sm font-medium opacity-70">out of 100</div><div className={`mt-6 inline-flex items-center gap-2 rounded-full bg-card/70 px-4 py-2 text-sm font-bold uppercase tracking-[0.14em] ${tone}`}>{level === 'High' ? <AlertTriangle className="size-4" aria-hidden="true" /> : <CheckCircle2 className="size-4" aria-hidden="true" />}{level} risk</div></div><div className="mt-auto rounded-xl bg-card/75 p-5"><p className="text-xs font-medium uppercase tracking-[0.16em] opacity-60">Recommended action</p><p className="mt-2 text-lg font-semibold">{level === 'High' ? 'Use soon or freeze immediately.' : level === 'Medium' ? 'Plan this food into your next meal.' : 'Continue appropriate storage and monitor freshness.'}</p><p className="mt-2 text-sm leading-6 opacity-70">Based on days since purchase, storage conditions, quantity per person, and your previous waste rate.</p></div></div> }
function InfoItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <div className="flex gap-3 rounded-xl border border-border bg-card p-4"><div className="mt-0.5 text-primary">{icon}</div><div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p></div></div> }
