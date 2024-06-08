import { useState } from "react";
import { Switch } from "@nextui-org/react";

const API_URL = "http://localhost:3004/api/";

// Edit Configurations Main Area
export function ConfigurationsMain() {
  const [chatGPTEnabled, setChatGPTEnabled] = useState(true);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-black mb-4">Configurations</h1>
      <Switch
        checked={chatGPTEnabled}
        onChange={(val) => setChatGPTEnabled(val)}
        size="small"
        className="mb-4"
      >
        ChatGPT Evaluation
      </Switch>
      {/* Add more configuration options here */}
    </div>
  );
}

