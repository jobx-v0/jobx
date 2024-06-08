import Nav from "../components/core/Nav";
import { Settings2, SearchCheck, ChevronUpCircleIcon } from "lucide-react";
import { Sidebar, SidebarItem } from "../components/core/Sidebar";
import { useState } from "react";
import {
  ConfigurationsMain,
} from "../components/core/SidebarMainArea";
import InterviewQuestionsMain from "../components/core/InterviewQuestionsMain";
import JobsMain from "../components/core/JobsMain";

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState("Configurations");
  return (
    <>
      <Nav />
      <div className="flex">
        <Sidebar>
          <SidebarItem
            icon={<Settings2 />}
            text="Configurations"
            active={activeSection === "Configurations"}
            onClick={() => setActiveSection("Configurations")}
          />
          <SidebarItem
            icon={<SearchCheck />}
            text="Jobs"
            active={activeSection === "Jobs"}
            onClick={() => setActiveSection("Jobs")}
          />
          <SidebarItem
            icon={<ChevronUpCircleIcon />}
            text="Interview Questions"
            active={activeSection === "Interview Questions"}
            onClick={() => setActiveSection("Interview Questions")}
          />
          {/* Add more SidebarItem components as needed */}
        </Sidebar>
        <main className="flex-1">
          {activeSection === "Configurations" && <ConfigurationsMain />}
          {activeSection === "Jobs" && <JobsMain />}
          {activeSection === "Interview Questions" && <InterviewQuestionsMain />}
          {/* Add more main areas for other sections */}
        </main> 
      </div>

      {/* <Nav />
      <div className="flex justify-center items-center h-screen">
        <Switch size="lg">
            ChatGPT Evaluation
        </Switch>
      </div> */}
    </>
  );
}
