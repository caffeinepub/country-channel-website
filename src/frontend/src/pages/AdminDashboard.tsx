import { useState } from 'react';
import { useGetAllShows, useGetAllSchedules } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ShowManagement from '../components/admin/ShowManagement';
import ScheduleManagement from '../components/admin/ScheduleManagement';
import AddShowDialog from '../components/admin/AddShowDialog';
import AddScheduleDialog from '../components/admin/AddScheduleDialog';

export default function AdminDashboard() {
  const { data: shows = [] } = useGetAllShows();
  const { data: schedules = [] } = useGetAllSchedules();
  const [showAddShowDialog, setShowAddShowDialog] = useState(false);
  const [showAddScheduleDialog, setShowAddScheduleDialog] = useState(false);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage shows and schedules for Country Channel</p>
      </div>

      <Tabs defaultValue="shows" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="shows">Shows</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
        </TabsList>

        <TabsContent value="shows" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Manage Shows</h2>
              <p className="text-sm text-muted-foreground">Add, edit, or remove shows</p>
            </div>
            <Button onClick={() => setShowAddShowDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Show
            </Button>
          </div>

          <ShowManagement shows={shows} />
        </TabsContent>

        <TabsContent value="schedules" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Manage Schedules</h2>
              <p className="text-sm text-muted-foreground">Add, edit, or remove show schedules</p>
            </div>
            <Button onClick={() => setShowAddScheduleDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Schedule
            </Button>
          </div>

          <ScheduleManagement schedules={schedules} shows={shows} />
        </TabsContent>
      </Tabs>

      <AddShowDialog open={showAddShowDialog} onOpenChange={setShowAddShowDialog} />
      <AddScheduleDialog open={showAddScheduleDialog} onOpenChange={setShowAddScheduleDialog} shows={shows} />
    </div>
  );
}
