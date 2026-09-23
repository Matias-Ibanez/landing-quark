"use client";

import {
  CalendarBlank,
  InstagramLogo,
  TwitterLogo,
  VideoCamera,
  PencilSimpleLine,
} from "@phosphor-icons/react";

// ---------------------------------------------------------------------------
// ContentCalendar — monthly grid view of scheduled marketing content.
// Dynamically calculates current month layout. Shows a list view on mobile.
// ---------------------------------------------------------------------------

interface CalendarEvent {
  readonly day: number;
  readonly type: "Instagram Reel" | "Instagram Post" | "Twitter Thread" | "Blog Post" | "Video";
  readonly title: string;
  readonly status: "Programado" | "Borrador" | "Publicado";
}

const MOCK_EVENTS: readonly CalendarEvent[] = [
  { day: 3, type: "Instagram Post", title: "Tip de la semana", status: "Publicado" },
  { day: 7, type: "Twitter Thread", title: "Hilo sobre branding", status: "Publicado" },
  { day: 10, type: "Instagram Reel", title: "Detrás de escena", status: "Publicado" },
  { day: 15, type: "Blog Post", title: "Guía de marketing Q4", status: "Programado" },
  { day: 18, type: "Video", title: "Tutorial QUARK", status: "Borrador" },
  { day: 22, type: "Instagram Reel", title: "Promo 2×1 fin de semana", status: "Programado" },
  { day: 25, type: "Twitter Thread", title: "Case study cliente", status: "Borrador" },
  { day: 28, type: "Instagram Post", title: "Recap del mes", status: "Programado" },
] as const;

const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] as const;

const STATUS_COLORS: Record<CalendarEvent["status"], string> = {
  Publicado: "bg-emerald-500",
  Programado: "bg-violet-500",
  Borrador: "bg-amber-500",
};

const TYPE_ICONS: Record<CalendarEvent["type"], typeof InstagramLogo> = {
  "Instagram Reel": VideoCamera,
  "Instagram Post": InstagramLogo,
  "Twitter Thread": TwitterLogo,
  Blog: PencilSimpleLine,
  "Blog Post": PencilSimpleLine,
  Video: VideoCamera,
} as unknown as Record<CalendarEvent["type"], typeof InstagramLogo>;

function getMonthData() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthName = now.toLocaleDateString("es-AR", { month: "long" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // getDay() returns 0=Sun, we need 0=Mon
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  return { year, monthName, daysInMonth, firstWeekday };
}

function getEventsForDay(day: number): readonly CalendarEvent[] {
  return MOCK_EVENTS.filter((e) => e.day === day);
}

// ── Desktop grid ──
function CalendarGrid() {
  const { monthName, year, daysInMonth, firstWeekday } = getMonthData();
  const totalCells = firstWeekday + daysInMonth;
  const rows = Math.ceil(totalCells / 7);

  return (
    <div>
      {/* month title */}
      <p className="mb-4 text-center font-mono text-sm font-semibold uppercase tracking-widest text-zinc-400">
        {monthName} {year}
      </p>

      {/* day-name headers */}
      <div className="grid grid-cols-7 border-b border-zinc-800">
        {DAY_NAMES.map((d) => (
          <div
            key={d}
            className="py-2 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-600"
          >
            {d}
          </div>
        ))}
      </div>

      {/* cells */}
      <div className="grid grid-cols-7">
        {Array.from({ length: rows * 7 }, (_, i) => {
          const day = i - firstWeekday + 1;
          const isValid = day >= 1 && day <= daysInMonth;
          const events = isValid ? getEventsForDay(day) : [];
          const isToday = isValid && day === new Date().getDate();

          return (
            <div
              key={i}
              className={`min-h-[120px] border-b border-r border-zinc-800/60 p-2 transition-colors ${
                isValid ? "hover:bg-zinc-900/50" : "bg-zinc-950/30"
              } ${i % 7 === 0 ? "border-l border-zinc-800/60" : ""}`}
            >
              {isValid && (
                <>
                  <span
                    className={`inline-flex size-7 items-center justify-center rounded-full text-xs font-medium ${
                      isToday
                        ? "bg-violet-600 text-white"
                        : "text-zinc-500"
                    }`}
                  >
                    {day}
                  </span>

                  <div className="mt-1 flex flex-col gap-1">
                    {events.map((ev) => {
                      const Icon = TYPE_ICONS[ev.type] ?? CalendarBlank;
                      return (
                        <div
                          key={ev.title}
                          className="group/card flex items-start gap-1.5 rounded-md bg-zinc-800/80 p-1.5 transition-colors hover:bg-zinc-800"
                        >
                          <span
                            className={`mt-0.5 inline-block size-1.5 shrink-0 rounded-full ${STATUS_COLORS[ev.status]}`}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[11px] font-medium text-zinc-300">
                              {ev.title}
                            </p>
                            <p className="flex items-center gap-1 text-[10px] text-zinc-600">
                              <Icon size={10} aria-hidden="true" />
                              {ev.type}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Mobile list ──
function CalendarList() {
  const { monthName, year } = getMonthData();
  const eventsWithDay = MOCK_EVENTS.map((ev) => ({ ...ev }));

  return (
    <div>
      <p className="mb-4 text-center font-mono text-sm font-semibold uppercase tracking-widest text-zinc-400">
        {monthName} {year}
      </p>

      <div className="space-y-2">
        {eventsWithDay.map((ev) => {
          const Icon = TYPE_ICONS[ev.type] ?? CalendarBlank;
          return (
            <div
              key={`${ev.day}-${ev.title}`}
              className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 transition-colors hover:bg-zinc-900"
            >
              {/* day badge */}
              <div className="flex size-10 shrink-0 flex-col items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">
                <span className="text-sm font-bold leading-none">{ev.day}</span>
                <span className="text-[9px] uppercase text-zinc-500">
                  {monthName.slice(0, 3)}
                </span>
              </div>

              {/* info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-200">{ev.title}</p>
                <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Icon size={12} aria-hidden="true" />
                  {ev.type}
                </p>
              </div>

              {/* status */}
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-block size-2 rounded-full ${STATUS_COLORS[ev.status]}`}
                />
                <span className="text-[11px] text-zinc-500">{ev.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Exported wrapper ──
export function ContentCalendar() {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* legend */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex size-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80">
            <CalendarBlank size={20} weight="duotone" className="text-violet-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-medium text-zinc-50">Planificador de Contenidos</h2>
            <p className="text-sm text-zinc-500">Calendario editorial del mes</p>
          </div>

          {/* status legend */}
          <div className="flex items-center gap-4 text-[11px]">
            {(Object.entries(STATUS_COLORS) as [CalendarEvent["status"], string][]).map(
              ([label, color]) => (
                <span key={label} className="flex items-center gap-1.5 text-zinc-500">
                  <span className={`inline-block size-2 rounded-full ${color}`} />
                  {label}
                </span>
              )
            )}
          </div>
        </div>

        {/* desktop: grid  ·  mobile: list */}
        <div className="hidden md:block">
          <CalendarGrid />
        </div>
        <div className="md:hidden">
          <CalendarList />
        </div>
      </div>
    </div>
  );
}
