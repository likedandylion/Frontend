import React, { useState } from "react";
import * as S from "./promptnew.styles";
import api from "../../api/axiosInstance";

export default function PromptNew() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [gptPrompt, setGptPrompt] = useState("");
  const [geminiPrompt, setGeminiPrompt] = useState("");
  const [claudePrompt, setClaudePrompt] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const categories = ["#여행", "#블로그", "#업무", "#코딩", "#창작"];

  // ✅ 카테고리 선택
  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // ✅ 태그 추가
  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (!trimmed) return;
      if (tags.includes(trimmed)) return alert("이미 추가된 태그입니다.");
      setTags((prev) => [...prev, trimmed]);
      setTagInput("");
    }
  };

  // ✅ 태그 삭제
  const handleRemoveTag = (tagToRemove) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  // ✅ 디버깅용 프롬프트 등록 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");

    // ✅ 하드코딩된 테스트용 payload (영문 버전)
    const payload = {
      title: "Test Post",
      content: "Hello world! This is a test content.",
      category: "coding",
      tags: ["test", "debug"],
      prompts: {
        chatgpt: "test prompt for gpt",
        gemini: "test prompt for gemini",
        claude: "test prompt for claude",
      },
    };

    // ✅ form 입력 기반 payload로 돌리고 싶다면 아래 코드 사용
    /*
    if (!title.trim()) return alert("제목을 입력해주세요.");

    const prompts = {};
    if (gptPrompt.trim()) prompts.chatgpt = gptPrompt.trim();
    if (geminiPrompt.trim()) prompts.gemini = geminiPrompt.trim();
    if (claudePrompt.trim()) prompts.claude = claudePrompt.trim();

    if (Object.keys(prompts).length === 0) {
      alert("최소 하나 이상의 AI 프롬프트를 입력해주세요.");
      return;
    }

    const payload = {
      title,
      content: description,
      category: selectedCategories[0]?.replace("#", "") || "기타",
      tags: tags.map((t) => t.replace("#", "")),
      prompts,
    };
    */

    // ✅ 디버깅 로그 출력
    console.group("🚀 프롬프트 등록 요청 디버그 로그");
    console.log("🔑 AccessToken:", token ? "(토큰 존재)" : "(❌ 없음)");
    console.log("📦 요청 payload:", JSON.stringify(payload, null, 2));
    console.groupEnd();

    try {
      const { data, status } = await api.post("/api/v1/posts", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.group("✅ 서버 응답 디버그 로그");
      console.log("HTTP 상태 코드:", status);
      console.log("응답 데이터:", data);
      console.groupEnd();

      if (data.success) {
        alert("✅ 프롬프트가 성공적으로 등록되었습니다!");
      } else {
        alert(data.message || "⚠️ 서버에서 오류 응답을 보냈습니다.");
      }
    } catch (err) {
      console.group("❌ 서버 요청 실패 디버그 로그");
      console.error("Axios Error:", err);
      if (err.response) {
        console.log("📦 상태코드:", err.response.status);
        console.log("📦 응답데이터:", err.response.data);
      } else {
        console.log("📡 네트워크/요청 에러:", err.message);
      }
      console.groupEnd();

      alert(
        err.response?.data?.message ||
          "🚨 서버 내부 오류가 발생했습니다. 콘솔 로그를 확인하세요."
      );
    }
  };

  return (
    <S.Page role="main" aria-label="프롬프트 작성 페이지">
      <S.Container>
        <S.WindowHeader>
          <S.DotGroup>
            <S.Dot />
            <S.Dot />
            <S.Dot />
          </S.DotGroup>
          <S.HeaderRight>2025-11-12 · prompt.prome</S.HeaderRight>
        </S.WindowHeader>

        <S.Form onSubmit={handleSubmit}>
          <S.TitleInput
            type="text"
            placeholder="프롬프트 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <S.DescriptionInput
            type="text"
            placeholder="이 프롬프트에 대한 간단한 소개를 입력하세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <S.CategoryBox>
            <S.CategoryLabel>카테고리 선택</S.CategoryLabel>
            <S.CategoryList>
              {categories.map((cat) => (
                <S.CategoryTag
                  key={cat}
                  $active={selectedCategories.includes(cat)}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCategory(cat);
                  }}
                >
                  {cat}
                </S.CategoryTag>
              ))}
            </S.CategoryList>
          </S.CategoryBox>

          <S.TagBox>
            <S.CategoryLabel>태그 추가</S.CategoryLabel>
            <S.TagInput
              type="text"
              placeholder="태그 입력 후 Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
            <S.TagList>
              {tags.map((tag) => (
                <S.TagItem key={tag} onClick={() => handleRemoveTag(tag)}>
                  #{tag} ✕
                </S.TagItem>
              ))}
            </S.TagList>
          </S.TagBox>

          <S.PromptGroup>
            <S.PromptSection>
              <S.CategoryLabel>GPT 프롬프트</S.CategoryLabel>
              <S.ContentArea
                placeholder="ChatGPT용 프롬프트를 입력하세요"
                value={gptPrompt}
                onChange={(e) => setGptPrompt(e.target.value)}
              />
            </S.PromptSection>

            <S.PromptSection>
              <S.CategoryLabel>Gemini 프롬프트</S.CategoryLabel>
              <S.ContentArea
                placeholder="Gemini용 프롬프트를 입력하세요"
                value={geminiPrompt}
                onChange={(e) => setGeminiPrompt(e.target.value)}
              />
            </S.PromptSection>

            <S.PromptSection>
              <S.CategoryLabel>Claude 프롬프트</S.CategoryLabel>
              <S.ContentArea
                placeholder="Claude용 프롬프트를 입력하세요"
                value={claudePrompt}
                onChange={(e) => setClaudePrompt(e.target.value)}
              />
            </S.PromptSection>
          </S.PromptGroup>

          <S.SubmitButton type="submit">프롬프트 등록하기</S.SubmitButton>
        </S.Form>
      </S.Container>
    </S.Page>
  );
}
