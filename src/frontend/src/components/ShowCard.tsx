import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Show } from '../backend';
import { useState, useEffect } from 'react';

interface ShowCardProps {
  show: Show;
}

export default function ShowCard({ show }: ShowCardProps) {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const url = show.image.getDirectURL();
    setImageUrl(url);
  }, [show.image]);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img 
          src={imageUrl || '/assets/generated/show-placeholder.dim_400x300.jpg'} 
          alt={show.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>{show.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-3">{show.description}</CardDescription>
      </CardContent>
    </Card>
  );
}
