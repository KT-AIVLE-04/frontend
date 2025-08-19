// src/pages/SnsPostService/SnsPostService.jsx
import React, { useState } from "react";
import { Sparkles, Hash, Copy, RefreshCw } from "lucide-react";
import { Container } from "../../components/Container";
import { PostGeneratorForm, HashtagGeneratorForm } from "./components";
import { snsApi } from "../../api/sns";

export function SnsPostService() {
  const [activeTab, setActiveTab] = useState("post"); // 'post' | 'hashtag'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGeneratePost = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await snsApi.generatePost(formData);
      setResult(response.data);
    } catch (error) {
      console.error("게시글 생성 실패:", error);
      setError("게시글 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateHashtags = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await snsApi.generateHashtags(formData);
      setResult(response.data);
    } catch (error) {
      console.error("해시태그 생성 실패:", error);
      setError("해시태그 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("클립보드에 복사되었습니다!");
    });
  };

  const resetForm = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="flex-1 w-full">
      <h1 className="text-2xl font-bold mb-6">AI SNS 게시물 생성</h1>

      {/* 탭 메뉴 */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => {
                setActiveTab("post");
                resetForm();
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "post"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Sparkles size={16} className="inline mr-2" />
              게시글 생성
            </button>
            <button
              onClick={() => {
                setActiveTab("hashtag");
                resetForm();
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "hashtag"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Hash size={16} className="inline mr-2" />
              해시태그 생성
            </button>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 입력 폼 */}
        <Container className="p-6">
          {activeTab === "post" ? (
            <PostGeneratorForm
              onSubmit={handleGeneratePost}
              loading={loading}
            />
          ) : (
            <HashtagGeneratorForm
              onSubmit={handleGenerateHashtags}
              loading={loading}
            />
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </Container>

        {/* 결과 표시 */}
        <Container className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">생성 결과</h3>
            {result && (
              <button
                onClick={resetForm}
                className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                <RefreshCw size={16} className="mr-1" />
                초기화
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Sparkles
                size={48}
                className="text-purple-600 mx-auto mb-4 animate-pulse"
              />
              <p className="text-gray-600">
                AI가 콘텐츠를 생성하고 있습니다...
              </p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {activeTab === "post" && (
                <>
                  {result.title && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800">제목</h4>
                        <button
                          onClick={() => copyToClipboard(result.title)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                      <p className="text-gray-700">{result.title}</p>
                    </div>
                  )}

                  {result.content && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800">본문</h4>
                        <button
                          onClick={() => copyToClipboard(result.content)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {result.content}
                      </p>
                    </div>
                  )}

                  {result.hashtags && result.hashtags.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800">해시태그</h4>
                        <button
                          onClick={() =>
                            copyToClipboard(result.hashtags.join(" "))
                          }
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.hashtags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === "hashtag" && result.hashtags && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">
                      생성된 해시태그
                    </h4>
                    <button
                      onClick={() => copyToClipboard(result.hashtags.join(" "))}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.hashtags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
              <p>좌측 폼을 작성하고 생성 버튼을 눌러주세요</p>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
}
