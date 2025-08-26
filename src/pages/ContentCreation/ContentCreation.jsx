import React from "react";
import { useSelector } from "react-redux";
import { ErrorPage } from "../../components";
import { ShortsWorkflow } from "./components";

export function ContentCreation() {
  const selectedStoreId = useSelector((state) => state.auth.selectedStoreId);

  if (!selectedStoreId) {
    return (
      <ErrorPage
        title="매장이 선택되지 않음"
        message="먼저 매장을 선택해주세요."
      />
    );
  }

  return (
    <div className="flex-1 w-full">
      <h1 className="text-2xl font-bold mb-6">콘텐츠 제작</h1>
      <ShortsWorkflow />
    </div>
  );
}
