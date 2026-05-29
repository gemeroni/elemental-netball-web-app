import { MotionConfig } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ElementalNetball } from "@/components/ElementalNetball";

function App() {
  return (
    // reducedMotion="user" makes every Framer Motion animation honour the
    // device's "reduce motion" accessibility setting automatically — calmer
    // for motion-sensitive / attention-difference users, in one line.
    <MotionConfig reducedMotion="user">
      <TooltipProvider>
        <ElementalNetball />
        <Toaster />
      </TooltipProvider>
    </MotionConfig>
  );
}

export default App;
