import React, { useState } from "react";
import * as S from "./promptnew.styles";

export default function PromptNew() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]); // ✅ 다중 선택
  const categories = ["#여행", "#블로그", "#업무", "#코딩", "#창작"];

  // ✅ 카테고리 토글 (복수 선택 가능)
  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // ✅ POST /api/v1/posts 연동
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("/api/v1/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          content,
          categories: selectedCategories,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "프롬프트 등록 실패");
      }

      alert("프롬프트가 성공적으로 등록되었습니다 🎉");
      // navigate("/prompts"); 등 이동 추가 가능
    } catch (error) {
      console.error("프롬프트 등록 오류:", error);
      alert(error.message || "프롬프트 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <S.Page role="main" aria-label="프롬프트 작성 페이지">
      <S.Container>
        {/* 상단 브라우저 창 헤더 */}
        <S.WindowHeader>
          <S.DotGroup>
            <S.Dot />
            <S.Dot />
            <S.Dot />
          </S.DotGroup>
          <S.HeaderRight>2025-01-15 · prompt.prome</S.HeaderRight>
        </S.WindowHeader>

        {/* 작성 영역 */}
        <S.Form
          onSubmit={(e) => {
            e.preventDefault(); // ✅ 폼 기본 동작 방지
            handleSubmit();
          }}
        >
          {/* 제목 */}
          <S.TitleInput
            type="text"
            placeholder="프롬프트 제목을 입력하세요"
            aria-label="프롬프트 제목 입력"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* 소개 */}
          <S.DescriptionInput
            type="text"
            placeholder="이 프롬프트에 대한 간단한 소개를 입력하세요"
            aria-label="프롬프트 소개 입력"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* 카테고리 선택 */}
          <S.CategoryBox>
            <S.CategoryLabel>카테고리 선택</S.CategoryLabel>
            <S.CategoryList>
              {categories.map((cat) => (
                <S.CategoryTag
                  key={cat}
                  $active={selectedCategories.includes(cat)}
                  onClick={(e) => {
                    e.preventDefault(); // ✅ 새로고침 방지
                    toggleCategory(cat);
                  }}
                >
                  {cat}
                </S.CategoryTag>
              ))}
            </S.CategoryList>
          </S.CategoryBox>

          {/* 내용 작성 */}
          <S.ContentArea
            placeholder={`프롬프트 내용을 입력하세요. 
예시: 
- "당신은 여행 블로거입니다. 파리 여행기를 1000자 내외로 작성하세요."
- "업무 효율을 높이기 위한 이메일 템플릿을 작성하세요."`}
            aria-label="프롬프트 내용 입력"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* 버튼 */}
          <S.SubmitButton type="submit">프롬프트 등록하기</S.SubmitButton>
        </S.Form>
      </S.Container>
    </S.Page>
  );
}
