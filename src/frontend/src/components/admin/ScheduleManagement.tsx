import type { Schedule, Show } from '../../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Clock } from 'lucide-react';
import { useState } from 'react';
import { useDeleteSchedule } from '../../hooks/useQueries';
import { toast } from 'sonner';
import EditScheduleDialog from './EditScheduleDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ScheduleManagementProps {
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

export default function ScheduleManagement({ schedules, shows }: ScheduleManagementProps) {
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [deletingSchedule, setDeletingSchedule] = useState<Schedule | null>(null);
  const deleteSchedule = useDeleteSchedule();

  const getShowById = (showId: string) => shows.find(s => s.id === showId);

  const handleDelete = async () => {
    if (!deletingSchedule) return;

    try {
      await deleteSchedule.mutateAsync(deletingSchedule.id);
      toast.success('Schedule deleted successfully');
      setDeletingSchedule(null);
    } catch (error) {
      toast.error('Failed to delete schedule');
      console.error(error);
    }
  };

  const schedulesByDay = DAYS_OF_WEEK.map(day => ({
    day,
    items: schedules
      .filter(s => s.dayOfWeek === day)
      .sort((a, b) => Number(a.startTime - b.startTime))
  }));

  if (schedules.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
        <p className="text-muted-foreground">No schedules yet. Add your first schedule to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {schedulesByDay.map(({ day, items }) => (
          <Card key={day}>
            <CardHeader>
              <CardTitle className="text-lg">{day}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground">No schedules</p>
              ) : (
                items.map((schedule) => {
                  const show = getShowById(schedule.showId);
                  return (
                    <div key={schedule.id.toString()} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">
                            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {show?.title || 'Unknown Show'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => setEditingSchedule(schedule)}
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button 
                          onClick={() => setDeletingSchedule(schedule)}
                          variant="destructive" 
                          size="sm" 
                          className="flex-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {editingSchedule && (
        <EditScheduleDialog 
          schedule={editingSchedule}
          shows={shows}
          open={!!editingSchedule}
          onOpenChange={(open) => !open && setEditingSchedule(null)}
        />
      )}

      <AlertDialog open={!!deletingSchedule} onOpenChange={(open) => !open && setDeletingSchedule(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this schedule? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteSchedule.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
