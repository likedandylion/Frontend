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

  // ✅ 프롬프트 등록
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return alert("제목을 입력해주세요.");

    // ✅ prompts 객체를 swagger 명세에 맞게 구성
    const prompts = {};
    if (gptPrompt.trim()) prompts.chatgpt = gptPrompt;
    if (geminiPrompt.trim()) prompts.gemini = geminiPrompt;
    if (claudePrompt.trim()) prompts.claude = claudePrompt;

    if (Object.keys(prompts).length === 0) {
      alert("최소 하나 이상의 AI 프롬프트를 입력해주세요.");
      return;
    }

    const token = localStorage.getItem("accessToken");

    const payload = {
      title,
      category: selectedCategories[0]?.replace("#", "") || "기타",
      tags: tags.map((t) => t.replace("#", "")),
      prompts,
    };

    try {
      const { data } = await api.post("/api/v1/posts", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ 서버 응답:", data);

      if (data.success) {
        alert("✅ 프롬프트가 성공적으로 등록되었습니다!");
        // navigate("/prompts"); // 페이지 이동 원하면 추가
      } else {
        alert(data.message || "프롬프트 등록 실패");
      }
    } catch (err) {
      console.error("❌ 프롬프트 등록 오류:", err);
      console.log("📦 서버 응답:", err.response?.data);
      alert(
        err.response?.data?.message || "요청 형식이 서버 요구사항과 다릅니다."
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

          {/* ✅ 카테고리 선택 */}
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

          {/* ✅ 태그 입력 */}
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

          {/* ✅ AI 프롬프트 입력 */}
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
