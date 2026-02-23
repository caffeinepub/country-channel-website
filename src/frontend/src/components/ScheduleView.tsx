import type { Schedule, Show } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface ScheduleViewProps {
  schedules: Schedule[];
  shows: Show[];
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function formatTime(time: bigint): string {
  const hours = Number(time / 100n);
  const minutes = Number(time % 100n);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export default function ScheduleView({ schedules, shows }: ScheduleViewProps) {
  const getShowById = (showId: string) => shows.find(s => s.id === showId);

  const schedulesByDay = DAYS_OF_WEEK.map(day => ({
    day,
    items: schedules
      .filter(s => s.dayOfWeek === day)
      .sort((a, b) => Number(a.startTime - b.startTime))
  }));

  if (schedules.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-lg text-muted-foreground">No schedules available yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {schedulesByDay.map(({ day, items }) => (
        <Card key={day}>
          <CardHeader>
            <CardTitle className="text-lg">{day}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">No shows scheduled</p>
            ) : (
              items.map((schedule) => {
                const show = getShowById(schedule.showId);
                return (
                  <div key={schedule.id.toString()} className="border-l-2 border-primary pl-3 py-1">
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {show?.title || 'Unknown Show'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
