
import { PlayerProvider } from "@/context/PlayerContext";
import Player from "@/components/Player";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  useEffect(() => {
    // Set page title
    document.title = "Serene Sound Player";
    
    // Make sure React is properly initialized before rendering dialogs
    document.body.className = document.body.className;
  }, []);

  return (
    <>
      <PlayerProvider>
        <Player />
      </PlayerProvider>
      <Toaster />
    </>
  );
};

export default Index;
