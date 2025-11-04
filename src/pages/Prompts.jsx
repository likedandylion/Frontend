// src/pages/Prompts.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import promptIcon from "@/assets/images/prompt_image.png";

// UI 확인용 더미 데이터 (15개 넣어둠 → 페이지네이션 테스트 용)
const dummyPrompts = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  title: [
    "블로그 포스팅을 위한 매력적인 도입부",
    "여행 일정 완벽 계획 생성기",
    "업무 보고서 자동 작성",
    "SNS 콘텐츠 아이디어 생성기",
    "이메일 마케팅 템플릿 제작",
    "창의적인 스토리텔링 도구",
    "데이터 분석 보고서 생성",
    "프레젠테이션 스크립트 작성",
    "고객 서비스 답변 템플릿",
    "창의적인 제목 생성기",
    "뉴스레터 콘텐츠 추천",
    "코딩 학습 플랜 생성",
    "투자 아이디어 브레인스토밍",
    "면접 대비 질문 리스트",
    "스터디 플래너 자동 생성",
  ][i],
  description:
    "예산과 선호도를 고려한 맞춤형 여행 일정을 생성합니다. 숙소, 식당, 관광지까지 모든 것을 포함한 상세한 계획을 제공합니다.",
  createdAt: "2025-01-14T00:00:00.000Z",
}));

const ITEMS_PER_PAGE = 10;

export default function Prompts() {
  const [page, setPage] = useState(1);

  const totalItems = dummyPrompts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = dummyPrompts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <PageWrapper>
      <ContentContainer>
        <Header>
          <TitleWrapper>
            <Icon src={promptIcon} alt="프롬프트 아이콘" />
            <Title>프롬프트 탐색</Title>
          </TitleWrapper>
          <NewButton to="/prompts/new">+ 프롬프트 등록</NewButton>
        </Header>

        <PromptGrid>
          {currentItems.map((p) => (
            <PromptCard key={p.id}>
              <CardTopBar>
                <CardDots>
                  <Dot />
                  <Dot />
                  <Dot />
                </CardDots>
                <CardMeta>
                  {new Date(p.createdAt).toISOString().slice(0, 10)}
                  -prompt.prome
                </CardMeta>
              </CardTopBar>

              <CardBody>
                <CardTitle>{p.title}</CardTitle>
                <CardDescription>{p.description}</CardDescription>

                <ButtonRow>
                  {/* 👉 프롬프트 디테일 페이지로 이동 */}
                  <ViewButton to={`/prompts/${p.id}`}>
                    프롬프트 보기
                  </ViewButton>
                </ButtonRow>
              </CardBody>
            </PromptCard>
          ))}
        </PromptGrid>

        {totalPages > 1 && (
          <Pagination>
            {pages.map((pNum) => (
              <PageButton
                key={pNum}
                type="button"
                onClick={() => setPage(pNum)}
                $active={pNum === page}
              >
                {pNum}
              </PageButton>
            ))}
          </Pagination>
        )}
      </ContentContainer>
    </PageWrapper>
  );
}

/* ========= styled-components ========= */

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #ffffff; /* 회색 배경 제거 → 흰색 */
`;

const ContentContainer = styled.main`
  max-width: 1280px; 
  margin: 40px auto 60px;
  padding: 0 16px; 
  box-sizing: border-box;
`;

/* --- 기존 코드 중 Header 부분만 교체 --- */

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center; /* 세로축 중앙 정렬 */
  gap: 10px;
`;

const Icon = styled.img`
  width: 28px;
  height: 28px;
  object-fit: contain;
  transform: translateY(2px); /* 살짝 내려서 글씨랑 딱 맞춤 */
  vertical-align: middle; /* 텍스트 기준 중앙 정렬 */
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
`;

const NewButton = styled(Link)`
  padding: 8px 16px;
  background-color: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  color: #000;
  transition: 0.1s;
  &:hover {
    transform: translate(-1px, -1px);
  }
`;


const PromptGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px 28px; /* ✅ 세로/가로 간격 조금 넓게 */
  margin-bottom: 40px;
`;

const PromptCard = styled.article`
  border: 2px solid #000000;
  background-color: #ffffff;
  box-sizing: border-box;
`;

const CardTopBar = styled.div`
  height: 32px;
  background-color: #000000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  box-sizing: border-box;
`;

const CardDots = styled.div`
  display: flex;
  gap: 6px;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background-color: #555555;
`;

const CardMeta = styled.div`
  font-size: 12px;
  color: #ffffff;
`;

const CardBody = styled.div`
  padding: 18px 20px 18px;
  display: flex;
  flex-direction: column;
  min-height: 150px;
`;

const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const CardDescription = styled.p`
  font-size: 13px;
  line-height: 1.6;
  margin-bottom: 16px;
  flex: 1;
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: flex-end;
`;

const ViewButton = styled(Link)`
  padding: 10px 18px; /* ✅ 7px → 10px / 15px → 18px */
  border: 2px solid #000000;
  background-color: #ffffff;
  font-size: 15px; /* ✅ 14px → 15px */
  text-decoration: none;
  color: #000;
  font-weight: 600; /* ✅ 500 → 600 살짝 더 두껍게 */
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 2px 2px 0px #000;
  }
`;

const Pagination = styled.nav`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
`;

const PageButton = styled.button`
  border: none;
  background: transparent;
  font-size: 18px; /* ✅ 14 → 18으로 키움 */
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  text-decoration: ${({ $active }) => ($active ? "underline" : "none")};
  cursor: pointer;
  padding: 4px 8px;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;
