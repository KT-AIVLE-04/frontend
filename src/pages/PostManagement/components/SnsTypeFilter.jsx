import { SNS_TYPES } from "../../../const/snsTypes";
import { Card } from "../../../components";

export const SnsTypeFilter = ({ selectedSnsTypes, onSnsTypeChange }) => {
  const handleTogglePlatform = (platformId) => {
    if (selectedSnsTypes.includes(platformId)) {
      onSnsTypeChange(selectedSnsTypes.filter((p) => p !== platformId));
    } else {
      onSnsTypeChange([...selectedSnsTypes, platformId]);
    }
  };

  return (
    <Card className="p-4 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between h-[56px] gap-2">
        <h3 className="text-sm font-medium text-gray-700 whitespace-nowrap">
          플랫폼 :
        </h3>

        <div className="flex flex-wrap gap-2">
          {SNS_TYPES.map((snsType) => {
            const isSelected = selectedSnsTypes.includes(snsType.id);

            return (
              <button
                key={snsType.id}
                onClick={() => handleTogglePlatform(snsType.id)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium 
                  transition-all duration-200 border
                  ${
                    isSelected
                      ? `${snsType.color} border-transparent`
                      : "bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }
                `}
              >
                <img
                  src={snsType.icon}
                  alt={snsType.name}
                  className="w-4 h-4"
                />
                <span>{snsType.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
