import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { LightCurveUpload } from "@/components/light-curve-upload";
import { DetectionPipeline } from "@/components/detection-pipeline";
import { DashboardPreview } from "@/components/dashboard-preview";
import { ExplainableAI } from "@/components/explainable-ai";
import { CandidateRanking } from "@/components/candidate-ranking";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col">
        <Hero />
        <LightCurveUpload />
        <DetectionPipeline />
        <DashboardPreview />
        <ExplainableAI />
        <CandidateRanking />
      </main>
      <Footer />
    </>
  );
}
