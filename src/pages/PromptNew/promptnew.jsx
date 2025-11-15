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

  // ✅ 프롬프트 작성 API 연동
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!description.trim()) {
      alert("설명을 입력해주세요.");
      return;
    }

    // prompts 객체 형식으로 변환 (curl 명령어 참고)
    const promptsObj = {};
    if (gptPrompt.trim()) {
      promptsObj.chatgpt = gptPrompt.trim();
    }
    if (geminiPrompt.trim()) {
      promptsObj.gemini = geminiPrompt.trim();
    }
    if (claudePrompt.trim()) {
      promptsObj.claude = claudePrompt.trim();
    }

    // 최소 하나 이상의 프롬프트 확인
    if (Object.keys(promptsObj).length === 0) {
      alert("최소 하나 이상의 AI 프롬프트를 입력해주세요.");
      return;
    }

    // category는 첫 번째 선택된 카테고리 사용 (없으면 기본값)
    const category =
      selectedCategories.length > 0
        ? selectedCategories[0].replace("#", "") // # 제거
        : "기타";

    // tags는 # 제거하고 배열로
    const tagsArray = tags.map((tag) => tag.replace("#", ""));

    // curl 명령어 형식에 맞게 payload 구성
    const payload = {
      title: title.trim(),
      content: description.trim(), // content 필드 사용
      category: category,
      tags: tagsArray,
      prompts: promptsObj, // 객체 형식: { chatgpt: "...", gemini: "...", claude: "..." }
    };

    console.log(
      "📤 프롬프트 등록 요청 payload:",
      JSON.stringify(payload, null, 2)
    );

    try {
      const { data } = await api.post("/api/v1/posts", payload);

      console.log("📥 프롬프트 등록 응답:", data);

      if (data.success) {
        alert("✅ 프롬프트가 성공적으로 등록되었습니다!");
        // 성공 시 상세 페이지로 이동
        if (data.data?.postId) {
          window.location.href = `/prompts/${data.data.postId}`;
        } else {
          window.location.href = "/prompts";
        }
      } else {
        alert(data.message || "⚠️ 서버에서 오류 응답을 보냈습니다.");
      }
    } catch (err) {
      console.error("❌ 프롬프트 등록 오류:", err);
      console.error("❌ 응답 데이터:", err.response?.data);

      // 400 에러인 경우 상세한 에러 메시지 표시
      const errorMessage =
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? JSON.stringify(err.response.data.errors)
          : "🚨 프롬프트 등록 중 오류가 발생했습니다.");

      alert(`오류: ${errorMessage}`);
    }
  };

  return (
    <S.Page role="main" aria-label="프롬프트 작성 페이지">
      <S.Container>
        <S.WindowHeader>
          <S.DotGroup>
            <S.Dot $color="#ff5f57" />
            <S.Dot $color="#ffbd2e" />
            <S.Dot $color="#28c940" />
          </S.DotGroup>
          <S.HeaderRight>
            {new Date().toISOString().slice(0, 10)} · prompt.prome
          </S.HeaderRight>
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
