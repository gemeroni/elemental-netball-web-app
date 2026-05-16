import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ElementalNetball } from "@/components/ElementalNetball";

function App() {
  return (
    <TooltipProvider>
      <ElementalNetball />
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
