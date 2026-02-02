import SurveyHeader from "@/components/survey/SurveyHeader";
import Section3Form from "@/components/survey/Section3Form";

export default function Section3Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <SurveyHeader />
        <div className="mt-8">
          <Section3Form />
        </div>
      </div>
    </div>
  );
}
