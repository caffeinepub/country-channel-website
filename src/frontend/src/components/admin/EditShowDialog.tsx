import { useState, useEffect } from 'react';
import { useEditShow } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';
import type { Show } from '../../backend';

interface EditShowDialogProps {
  show: Show;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditShowDialog({ show, open, onOpenChange }: EditShowDialogProps) {
  const [title, setTitle] = useState(show.title);
  const [description, setDescription] = useState(show.description);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const editShow = useEditShow();

  useEffect(() => {
    setTitle(show.title);
    setDescription(show.description);
    setImageFile(null);
    setUploadProgress(0);
  }, [show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      let imageBlob = show.image;

      if (imageFile) {
        const imageBytes = new Uint8Array(await imageFile.arrayBuffer());
        imageBlob = ExternalBlob.fromBytes(imageBytes).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      await editShow.mutateAsync({
        id: show.id,
        title: title.trim(),
        description: description.trim(),
        image: imageBlob,
      });

      toast.success('Show updated successfully!');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update show');
      console.error(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setImageFile(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Show</DialogTitle>
          <DialogDescription>
            Update show information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Show title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Show description"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Show Image (optional - leave empty to keep current)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {imageFile && (
              <span className="text-sm text-muted-foreground">{imageFile.name}</span>
            )}
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={editShow.isPending} className="flex-1">
              {editShow.isPending ? 'Updating...' : 'Update Show'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
