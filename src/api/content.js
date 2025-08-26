import api from "./axios";

export const contentApi = {
  // 콘텐츠 목록 조회
  getContents: (params) =>
    api.get("/contents", {
      params,
      storeId: true,
    }),

  // 콘텐츠 업로드 (multipart/form-data)
  uploadContent: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post("/contents", formData, {
      storeId: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // 콘텐츠 상세 조회
  getContent: (contentId) =>
    api.get(`/contents/${contentId}`, {
      storeId: true,
    }),

  // 콘텐츠 제목 수정 (PATCH, API 명세서에 맞게 수정)
  updateContentTitle: (contentId, title) =>
    api.patch(`/contents/${contentId}`, { title }, {
      storeId: true,
    }),

  // 콘텐츠 삭제
  deleteContent: (contentId) =>
    api.delete(`/contents/${contentId}`, {
      storeId: true,
    }),
};
