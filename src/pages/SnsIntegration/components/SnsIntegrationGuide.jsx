import React from "react";

export function SnsIntegrationGuide() {
  return (
    <div className="mt-12">
      <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            SNS 계정 연동 방법
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
              1
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">플랫폼 선택</h4>
            <p className="text-sm text-gray-600">
              연동하려는 SNS 플랫폼의 "연동하기" 버튼을 클릭하세요
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
              2
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">계정 로그인</h4>
            <p className="text-sm text-gray-600">
              새 창에서 해당 SNS 계정으로 로그인하세요
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
              3
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">권한 승인</h4>
            <p className="text-sm text-gray-600">
              콘텐츠 업로드 및 관리를 위한 권한을 승인하세요
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
              ✓
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">연동 완료</h4>
            <p className="text-sm text-gray-600">
              이제 간편하게 SNS 마케팅을 할 수 있어요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
