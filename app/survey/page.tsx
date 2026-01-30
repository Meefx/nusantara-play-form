import SurveyHeader from "@/components/survey/SurveyHeader";
import Section1Form from "@/components/survey/Section1Form";

export default function SurveyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-red-50 to-orange-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <SurveyHeader />
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <Section1Form />
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">© 2026 Pemetaan Permainan Rakyat dan Olahraga Tradisional</p>
        </div>
      </div>
    </div>
  );
}
