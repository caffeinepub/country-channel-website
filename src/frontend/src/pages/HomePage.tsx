import { useGetAllShows, useGetAllSchedules } from '../hooks/useQueries';
import ShowCard from '../components/ShowCard';
import ScheduleView from '../components/ScheduleView';
import RadioBanner from '../components/RadioBanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tv, Calendar, Radio, Music } from 'lucide-react';

export default function HomePage() {
  const { data: shows = [], isLoading: showsLoading } = useGetAllShows();
  const { data: schedules = [], isLoading: schedulesLoading } = useGetAllSchedules();

  return (
    <div className="min-h-screen">
      {/* Radio Banner */}
      <RadioBanner />

      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-r from-primary/20 to-accent/20 overflow-hidden">
        <img 
          src="/assets/generated/hero-banner.dim_1200x400.jpg" 
          alt="Country Channel Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="container relative h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Welcome to Country Channel
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Your home for the best country music, entertainment, and lifestyle programming
          </p>
        </div>
      </section>

      {/* Now Playing Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-12 border-y border-border">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Radio className="h-6 w-6 text-primary animate-pulse" />
                <h2 className="text-3xl font-bold text-foreground">On Air Now</h2>
              </div>
              <p className="text-muted-foreground">Listen live to Country Channel</p>
            </div>
            
            <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
              <div className="flex justify-center">
                <iframe 
                  width="450" 
                  height="316" 
                  frameBorder="0" 
                  src="https://live365.com/embeds/v1/player/a57949?s=md&m=dark&c=mp3"
                  className="w-full max-w-[450px] rounded-md"
                  title="Live365 Radio Player"
                  allow="autoplay"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Played Section */}
      <section className="bg-gradient-to-b from-background to-primary/5 py-12 border-b border-border">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Music className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Recently Played</h2>
              </div>
              <p className="text-muted-foreground">Check out what's been spinning on Country Channel</p>
            </div>
            
            <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
              <div className="flex justify-center">
                <iframe 
                  width="450" 
                  height="511" 
                  frameBorder="0" 
                  src="https://live365.com/embeds/v1/played/a57949?s=md&m=dark"
                  className="w-full max-w-[450px] rounded-md"
                  title="Live365 Recently Played"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-12">
        <Tabs defaultValue="shows" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="shows" className="gap-2">
              <Tv className="h-4 w-4" />
              Shows
            </TabsTrigger>
            <TabsTrigger value="schedule" className="gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shows" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Our Shows</h2>
              <p className="text-muted-foreground">Discover our lineup of amazing country programming</p>
            </div>

            {showsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : shows.length === 0 ? (
              <div className="text-center py-12">
                <Tv className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">No shows available yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shows.map((show) => (
                  <ShowCard key={show.id} show={show} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Weekly Schedule</h2>
              <p className="text-muted-foreground">Check out when your favorite shows are airing</p>
            </div>

            {schedulesLoading ? (
              <div className="h-96 bg-muted animate-pulse rounded-lg" />
            ) : (
              <ScheduleView schedules={schedules} shows={shows} />
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
