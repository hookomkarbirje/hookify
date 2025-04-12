import React from "react";
import { usePlayer } from "@/context/PlayerContext";
import { Slider } from "@/components/ui/slider";
import { Sound } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "@/components/Icon";
const MixPanel = () => {
  const {
    state,
    updateSoundVolume
  } = usePlayer();
  if (!state.isMixMode || state.activeSounds.length === 0) {
    return null;
  }
  return;
};
export default MixPanel;