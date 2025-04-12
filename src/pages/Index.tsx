
import { Toaster } from "@/components/ui/sonner";
import { PlayerProvider } from "@/context/PlayerContext";
import Player from "@/components/Player";

const Index = () => {
  return (
    <PlayerProvider>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'rgba(0,0,0,0.8)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)'
          },
          duration: 1000  // Reduce duration for less intrusive notifications
        }}
      />
      <Player />
    </PlayerProvider>
  );
};

export default Index;
