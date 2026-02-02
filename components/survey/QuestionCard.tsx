interface QuestionCardProps {
  children: React.ReactNode;
  title: string;
  required?: boolean;
  icon?: string;
  description?: string;
}

export default function QuestionCard({ children, title, required = false, icon, description }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 mb-6 border-l-4 border-blue-600">
      <div className="flex items-start mb-4">
        {icon && <span className="text-3xl mr-3">{icon}</span>}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {title}
            {required && <span className="text-red-500 ml-1">*</span>}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
      </div>
      <div className="pl-0 md:pl-12">{children}</div>
    </div>
  );
}
