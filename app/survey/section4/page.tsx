import SurveyHeader from "@/components/survey/SurveyHeader";
import Section4Form from "@/components/survey/Section4Form";

export default function Section4Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <SurveyHeader />
        <div className="mt-8">
          <Section4Form />
        </div>
      </div>
    </div>
  );
}
