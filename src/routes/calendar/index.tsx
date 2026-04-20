import { createFileRoute, useNavigate } from '@tanstack/react-router'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import { useCalendarEvents } from '@/hooks/useCalendarEvents'
import { useAppStore } from '@/store/app.store'
import { useStays } from '@/hooks/useStays'
import { PageShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'
import { Link } from '@tanstack/react-router'
import { dogsOnDate } from '@/lib/utils'
import csLocale from '@fullcalendar/core/locales/cs'

export const Route = createFileRoute('/calendar/')({
  component: CalendarPage,
})

function CalendarPage() {
  const navigate = useNavigate()
  const { events, fetchEvents } = useCalendarEvents()
  const { stays } = useStays()
  const maxCapacity = useAppStore((s) => s.maxCapacity)

  return (
    <PageShell>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Kalendář</h1>
          <Link to="/stays/new">
            <Button size="sm">+ Přidat termín</Button>
          </Link>
        </div>
        <div className="rounded-[--radius-card] border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 overflow-hidden">
          <FullCalendar
            plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={csLocale}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,listYear',
            }}
            buttonText={{ today: 'Dnes', month: 'Měsíc', listYear: 'Seznam' }}
            events={events}
            eventClick={({ event }) => {
              navigate({ to: '/stays/$stayId', params: { stayId: event.extendedProps.stayId } })
            }}
            datesSet={({ start, end }) => {
              fetchEvents(start, end)
            }}
            dayCellContent={(arg) => {
              const count = dogsOnDate(stays, arg.dateStr)
              const over = count > maxCapacity
              return (
                <div className="flex items-center justify-end gap-1 w-full">
                  {count > 0 && (
                    <span
                      className={`text-xs font-medium px-1 rounded ${
                        over
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400'
                      }`}
                    >
                      {count}/{maxCapacity}
                    </span>
                  )}
                  <span>{arg.dayNumberText}</span>
                </div>
              )
            }}
            height="auto"
            eventDisplay="block"
          />
        </div>
      </div>
    </PageShell>
  )
}
