/**
 * SNS 플랫폼 상수 정의
 */
export const SNS_TYPES = [
  {
    id: "youtube",
    name: "YouTube",
    icon: "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png",
    color: "bg-red-100 text-black",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
    color: "bg-pink-100 text-black",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
    color: "bg-blue-100 text-black",
  },
];

// 플랫폼 ID로 플랫폼 정보 찾기
export const getSnsTypeById = (id) => {
  return SNS_TYPES.find((snsType) => snsType.id === id);
};
