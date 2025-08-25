/**
 * SNS 플랫폼 상수 정의
 */
export const SNS_TYPES = [
  {
    id: "youtube",
    name: "YouTube",
    icon: "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png",
    color: "bg-red-100 text-black",
    enabled: true,
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
    color: "bg-pink-100 text-black",
    enabled: false,
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
    color: "bg-blue-100 text-black",
    enabled: false,
  },
];

// 플랫폼 ID로 플랫폼 정보 찾기
export const getSnsTypeById = (id) => {
  return SNS_TYPES.find((snsType) => snsType.id === id);
};

// 사용 가능한 플랫폼만 필터링
export const getEnabledSnsTypes = () => {
  return SNS_TYPES.filter((snsType) => snsType.enabled);
};

// 사용 가능한 플랫폼 ID만 가져오기
export const getEnabledSnsTypeIds = () => {
  return SNS_TYPES.filter((snsType) => snsType.enabled).map((snsType) => snsType.id);
};
