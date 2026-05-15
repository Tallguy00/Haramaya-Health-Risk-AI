import { Activity, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { isUsingLiveApi } from "@/lib/api";

export function Header() {
  return (
    <header className="bg-gradient-hero text-white">
      <div className="container py-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
              <Activity className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Haramaya Health Risk AI</h1>
              <p className="text-sm text-white/70">Community health risk prediction & mapping · Haramaya University</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <span className={`size-1.5 rounded-full mr-1.5 ${isUsingLiveApi ? "bg-[hsl(var(--success))]" : "bg-[hsl(var(--warning))]"}`} />
              {isUsingLiveApi ? "Live API" : "Sample data"}
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              <Github className="size-3 mr-1.5" /> Python backend
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
