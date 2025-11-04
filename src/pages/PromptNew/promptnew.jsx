import React, { useState } from "react";
import * as S from "./promptnew.styles";

export default function PromptNew() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const categories = ["#여행", "#블로그", "#업무", "#코딩", "#창작"];

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
        <S.Form>
          {/* 제목 */}
          <S.TitleInput
            type="text"
            placeholder="프롬프트 제목을 입력하세요"
            aria-label="프롬프트 제목 입력"
          />

          {/* 소개 */}
          <S.DescriptionInput
            type="text"
            placeholder="이 프롬프트에 대한 간단한 소개를 입력하세요"
            aria-label="프롬프트 소개 입력"
          />

          {/* 카테고리 선택 */}
          <S.CategoryBox>
            <S.CategoryLabel>카테고리 선택</S.CategoryLabel>
            <S.CategoryList>
              {categories.map((cat) => (
                <S.CategoryTag
                  key={cat}
                  $active={selectedCategory === cat}
                  onClick={() => setSelectedCategory(cat)}
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
          />

          {/* 버튼 */}
          <S.SubmitButton type="button">프롬프트 등록하기</S.SubmitButton>
        </S.Form>
      </S.Container>
    </S.Page>
  );
}
