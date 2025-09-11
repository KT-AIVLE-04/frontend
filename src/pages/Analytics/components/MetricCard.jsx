import { Eye, Heart, MessageCircle, Share2 } from "lucide-react";
import React from "react";

export function MetricCard({
                             title,
                             value,
                             comparisonValue,
                           }) {
  // title에 따라 icon과 color 결정
  const getIconAndColor = (title) => {
    switch (title) {
      case "조회수":
        return { icon: Eye, color: "green" };
      case "좋아요":
        return { icon: Heart, color: "red" };
      case "댓글":
        return { icon: MessageCircle, color: "purple" };
      case "공유":
        return { icon: Share2, color: "orange" };
      default:
        return { icon: Eye, color: "blue" };
    }
  };

  const { icon: Icon, color } = getIconAndColor(title);
  const colorClasses = {
    green: {
      bg: "from-green-50 to-green-100",
      text: "text-green-600",
      value: "text-green-800",
      icon: "text-green-500",
      comparison: "text-green-600",
    },
    red: {
      bg: "from-red-50 to-red-100",
      text: "text-red-600",
      value: "text-red-800",
      icon: "text-red-500",
      comparison: "text-red-600",
    },
    purple: {
      bg: "from-purple-50 to-purple-100",
      text: "text-purple-600",
      value: "text-purple-800",
      icon: "text-purple-500",
      comparison: "text-purple-600",
    },
    orange: {
      bg: "from-orange-50 to-orange-100",
      text: "text-orange-600",
      value: "text-orange-800",
      icon: "text-orange-500",
      comparison: "text-orange-600",
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`bg-gradient-to-br ${colors.bg} rounded-lg p-4`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${colors.text} font-medium`}>{title}</p>
          <p className={`text-2xl font-bold ${colors.value}`}>
            {value?.toLocaleString() || "0"}
          </p>
        </div>
        <div className={colors.icon}>
          <Icon size={24}/>
        </div>
      </div>
      {comparisonValue && (
        <p className={`text-xs ${colors.comparison} mt-1`}>
          비교: {comparisonValue.toLocaleString()}
        </p>
      )}
    </div>
  );
}
