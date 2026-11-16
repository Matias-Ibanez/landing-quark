"use client";

import { useEffect, useState } from "react";
import { ArrowClockwise, ChartBar, Cpu, FilmStrip, Wallet } from "@phosphor-icons/react";
import { api, stateLabel, type CostSummary } from "./api";

const count = new Intl.NumberFormat("es-AR");
const shortDate = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short", timeZone: "UTC" });
const activityDate = new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short", timeZone: "UTC" });
const panel = "rounded-2xl border border-zinc-700/55 bg-[#18181c]";

function money(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency", currency: "USD", currencyDisplay: "code", maximumFractionDigits: 8,
  }).format(amount);
}

function Metric({ icon: Icon, label, value, detail }: {
  icon: typeof Wallet; label: string; value: string; detail: string;
}) {
  return <div className={`${panel} min-w-0 p-4 sm:p-5`}>
    <dt className="flex items-center gap-2 text-sm text-zinc-400">
      <Icon size={18} className="shrink-0 text-violet-300" aria-hidden="true" />{label}
    </dt>
    <dd className="mt-3 break-words text-xl font-medium tracking-tight tabular-nums sm:text-2xl">{value}</dd>
    <dd className="mt-1 text-xs leading-5 text-zinc-400">{detail}</dd>
  </div>;
}

function SpendChart({ dailySpend }: { dailySpend: CostSummary["dailySpend"] }) {
  const peak = dailySpend.reduce((highest, day) => day.estimatedUsd > highest.estimatedUsd ? day : highest);
  return <section aria-labelledby="daily-spend-title" className={`${panel} p-4 sm:p-6`}>
    <h2 id="daily-spend-title" className="text-base font-medium">Gasto por día</h2>
    <p className="mt-1 text-sm text-zinc-400">Estimaciones en USD · Fechas en UTC</p>
    {peak.estimatedUsd > 0 ? (
      <figure className="mt-5">
        <figcaption className="mb-2 text-xs tabular-nums text-zinc-400">Máximo diario {money(peak.estimatedUsd)}</figcaption>
        <ol className="flex h-32 items-end gap-px border-b border-t border-zinc-700/60 sm:gap-1">
          {dailySpend.map(day => {
            const label = `${shortDate.format(new Date(day.date))} · ${money(day.estimatedUsd)}`;
            return <li key={day.date} title={label} className="flex h-full min-w-0 flex-1 items-end">
              <span className="sr-only">{label}</span>
              <span aria-hidden="true" className="w-full rounded-t-sm bg-violet-400/75" style={{ height: `${day.estimatedUsd / peak.estimatedUsd * 100}%` }} />
            </li>;
          })}
        </ol>
        <div aria-hidden="true" className="mt-2 flex justify-between text-xs text-zinc-400">
          <span>{shortDate.format(new Date(dailySpend[0].date))}</span>
          <span>{shortDate.format(new Date(dailySpend.at(-1)!.date))}</span>
        </div>
      </figure>
    ) : <p className="mt-5 text-sm text-zinc-400">Todavía no hay gastos estimados para graficar en este período.</p>}
  </section>;
}

function RecentRuns({ runs, total }: { runs: CostSummary["runs"]; total: number }) {
  return <section aria-labelledby="recent-runs-title" className={`${panel} p-4 sm:p-6`}>
    <h2 id="recent-runs-title" className="text-base font-medium">Actividad reciente</h2>
    {runs.length === 0 ? <p className="mt-2 text-sm text-zinc-400">No hay ejecuciones del agente en este período.</p> : <>
      <p className="mt-1 text-sm text-zinc-400">
        {count.format(runs.length)} de {count.format(total)} ejecuciones del agente · Horarios en UTC
      </p>
      <div className="mt-4 overflow-x-auto" tabIndex={0} role="region" aria-label="Detalle de ejecuciones">
        <table className="w-full min-w-md text-left text-sm">
          <thead className="border-b border-zinc-700/60 text-zinc-400">
            <tr>
              <th scope="col" className="py-3 pr-3 font-medium">Fecha</th>
              <th scope="col" className="px-3 font-medium">Actividad</th>
              <th scope="col" className="px-3 text-right font-medium">Tokens</th>
              <th scope="col" className="pl-3 text-right font-medium">Gasto estimado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-700/40">
            {runs.map((run, index) => {
              const tokens = run.inputTokens === null && run.outputTokens === null
                ? "Sin datos" : count.format((run.inputTokens ?? 0) + (run.outputTokens ?? 0));
              const activity = run.mediaKind === "image" ? "Imagen" : run.mediaKind === "video" ? "Video" : "Chat";
              return <tr key={run.runId ?? `${run.createdAt}-${index}`}>
                <td className="whitespace-nowrap py-3 pr-3 text-zinc-300">
                  <time dateTime={run.createdAt}>{activityDate.format(new Date(run.createdAt))}</time>
                </td>
                <td className="px-3">{activity}<span className="block text-xs text-zinc-400">{stateLabel[run.status] ?? run.status}</span></td>
                <td className="whitespace-nowrap px-3 text-right tabular-nums text-zinc-300">{tokens}</td>
                <td className="whitespace-nowrap pl-3 text-right tabular-nums">{run.estimatedUsd === null ? "Sin estimación" : money(run.estimatedUsd)}</td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
    </>}
  </section>;
}

export function UsageDashboard() {
  const [days, setDays] = useState(30);
  const [revision, setRevision] = useState(0);
  const request = `${days}:${revision}`;
  const [result, setResult] = useState<{ request: string; data?: CostSummary }>();
  useEffect(() => {
    let active = true;
    api<CostSummary>(`/costs?days=${days}`).then(
      data => { if (active) setResult({ request, data }); },
      () => { if (active) setResult({ request }); },
    );
    return () => { active = false; };
  }, [days, request]);
  const usage = result?.request === request ? result : undefined;
  const data = usage?.data?.dailySpend?.length ? usage.data : undefined;
  const incomplete = data?.incompleteCostOperations ?? 0;

  return <section aria-labelledby="usage-title" className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:px-9">
    <div className="mx-auto max-w-6xl space-y-5 pb-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 id="usage-title" className="text-2xl font-medium tracking-tight sm:text-3xl">Consumo y gastos</h1>
          <p className="mt-1.5 text-sm text-zinc-400">Actividad del espacio de trabajo compartido.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Período" className="flex gap-1 rounded-full bg-zinc-900/80 p-1">
            {[7, 30].map(period => <button key={period} type="button" aria-pressed={days === period} onClick={() => setDays(period)}
              className={`min-h-9 rounded-full px-3 text-sm ${days === period ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"}`}>
              {period} días
            </button>)}
          </div>
          <button type="button" onClick={() => setRevision(value => value + 1)} className="resource-action text-sm">
            <ArrowClockwise size={16} aria-hidden="true" />Actualizar
          </button>
        </div>
      </div>

      {!usage && <p role="status" className={`${panel} p-5 text-sm text-zinc-400`}>Cargando estadísticas…</p>}
      {usage && !data && <p role="alert" className={`${panel} p-5 text-sm text-rose-300`}>No pudimos cargar las estadísticas. Podés reintentar con Actualizar.</p>}
      {data && <>
        <dl className="grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 xl:grid-cols-4">
          <Metric icon={Wallet} label="Gasto estimado" value={data.totalOperations > data.unpricedRuns ? money(data.estimatedSpendUsd) : "—"}
            detail={incomplete ? `Costos faltantes en ${count.format(incomplete)} ${incomplete === 1 ? "operación" : "operaciones"}` : "Consumo de IA y producción"} />
          <Metric icon={Cpu} label="Tokens registrados" value={data.meteredOperations ? count.format(data.inputTokens + data.outputTokens) : "—"}
            detail={data.meteredOperations ? `${count.format(data.inputTokens)} entrada · ${count.format(data.outputTokens)} salida` : "Sin datos de tokens en el período"} />
          <Metric icon={ChartBar} label="Ejecuciones del agente" value={count.format(data.agentRuns)} detail="Incluye ejecuciones con error" />
          <Metric icon={FilmStrip} label="Piezas generadas" value={count.format(data.generatedImages + data.generatedVideos)}
            detail={`${count.format(data.generatedImages)} imágenes · ${count.format(data.generatedVideos)} videos`} />
        </dl>
        {data.totalOperations === 0 && <p role="status" className="text-sm text-zinc-400">Todavía no hay actividad registrada en este período.</p>}
        <SpendChart dailySpend={data.dailySpend} />
        <p className="text-xs leading-5 text-zinc-400">El gasto suma el consumo de IA registrado y el costo de servidor configurado por pieza generada.</p>
        <RecentRuns runs={data.runs} total={data.agentRuns} />
      </>}
    </div>
  </section>;
}
