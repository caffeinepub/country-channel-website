import type { Show } from '../../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDeleteShow } from '../../hooks/useQueries';
import { toast } from 'sonner';
import EditShowDialog from './EditShowDialog';
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

interface ShowManagementProps {
  shows: Show[];
}

export default function ShowManagement({ shows }: ShowManagementProps) {
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [deletingShow, setDeletingShow] = useState<Show | null>(null);
  const deleteShow = useDeleteShow();

  const handleDelete = async () => {
    if (!deletingShow) return;

    try {
      await deleteShow.mutateAsync(deletingShow.id);
      toast.success('Show deleted successfully');
      setDeletingShow(null);
    } catch (error) {
      toast.error('Failed to delete show');
      console.error(error);
    }
  };

  if (shows.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
        <p className="text-muted-foreground">No shows yet. Add your first show to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shows.map((show) => (
          <ShowManagementCard 
            key={show.id} 
            show={show}
            onEdit={() => setEditingShow(show)}
            onDelete={() => setDeletingShow(show)}
          />
        ))}
      </div>

      {editingShow && (
        <EditShowDialog 
          show={editingShow}
          open={!!editingShow}
          onOpenChange={(open) => !open && setEditingShow(null)}
        />
      )}

      <AlertDialog open={!!deletingShow} onOpenChange={(open) => !open && setDeletingShow(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Show</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingShow?.title}"? This action cannot be undone and will also remove all associated schedules.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteShow.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ShowManagementCard({ show, onEdit, onDelete }: { show: Show; onEdit: () => void; onDelete: () => void }) {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const url = show.image.getDirectURL();
    setImageUrl(url);
  }, [show.image]);

  return (
    <Card>
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img 
          src={imageUrl || '/assets/generated/show-placeholder.dim_400x300.jpg'} 
          alt={show.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{show.title}</CardTitle>
        <CardDescription className="line-clamp-2">{show.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button onClick={onEdit} variant="outline" size="sm" className="flex-1 gap-2">
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
        <Button onClick={onDelete} variant="destructive" size="sm" className="flex-1 gap-2">
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}
