import { useState, useEffect } from 'react';
import { useEditSchedule } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { Show, Schedule } from '../../backend';

interface EditScheduleDialogProps {
  schedule: Schedule;
  shows: Show[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function EditScheduleDialog({ schedule, shows, open, onOpenChange }: EditScheduleDialogProps) {
  const [showId, setShowId] = useState(schedule.showId);
  const [dayOfWeek, setDayOfWeek] = useState(schedule.dayOfWeek);
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');
  const editSchedule = useEditSchedule();

  useEffect(() => {
    setShowId(schedule.showId);
    setDayOfWeek(schedule.dayOfWeek);
    
    const startH = Number(schedule.startTime / 100n);
    const startM = Number(schedule.startTime % 100n);
    setStartHour(startH.toString().padStart(2, '0'));
    setStartMinute(startM.toString().padStart(2, '0'));
    
    const endH = Number(schedule.endTime / 100n);
    const endM = Number(schedule.endTime % 100n);
    setEndHour(endH.toString().padStart(2, '0'));
    setEndMinute(endM.toString().padStart(2, '0'));
  }, [schedule]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!showId || !dayOfWeek || !startHour || !endHour) {
      toast.error('Please fill in all fields');
      return;
    }

    const startTime = BigInt(parseInt(startHour) * 100 + parseInt(startMinute));
    const endTime = BigInt(parseInt(endHour) * 100 + parseInt(endMinute));

    if (startTime >= endTime) {
      toast.error('End time must be after start time');
      return;
    }

    try {
      await editSchedule.mutateAsync({
        id: schedule.id,
        showId,
        startTime,
        endTime,
        dayOfWeek,
      });

      toast.success('Schedule updated successfully!');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update schedule');
      console.error(error);
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Schedule</DialogTitle>
          <DialogDescription>
            Update schedule information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Show</Label>
            <Select value={showId} onValueChange={setShowId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a show" />
              </SelectTrigger>
              <SelectContent>
                {shows.map((show) => (
                  <SelectItem key={show.id} value={show.id}>
                    {show.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Day of Week</Label>
            <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
              <SelectTrigger>
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <div className="flex gap-2">
                <Select value={startHour} onValueChange={setStartHour}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="HH" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((h) => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={startMinute} onValueChange={setStartMinute}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>End Time</Label>
              <div className="flex gap-2">
                <Select value={endHour} onValueChange={setEndHour}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="HH" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((h) => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={endMinute} onValueChange={setEndMinute}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={editSchedule.isPending} className="flex-1">
              {editSchedule.isPending ? 'Updating...' : 'Update Schedule'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
