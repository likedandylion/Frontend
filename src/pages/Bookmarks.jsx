import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import starIcon from "@/assets/images/star_image.png";

const dummyPrompts = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  title: [
    "창의적인 블로그 글 주제 생성기",
    "마케팅 카피라이팅 도우미",
    "스터디 플래너 자동 생성",
    "데이터 분석 리포트 작성기",
    "창업 아이디어 브레인스토밍",
    "고객 피드백 요약기",
    "학습 계획표 생성기",
    "면접 질문 시뮬레이터",
    "이메일 답장 생성기",
    "논문 초록 요약 도구",
    "SNS 콘텐츠 기획",
    "뉴스레터 문장 교정기",
    "코드 리뷰 보조 AI",
    "프레젠테이션 개요 작성기",
    "업무 보고서 자동 생성",
    "여행 일정표 추천",
    "브랜드 슬로건 생성기",
    "제품 리뷰 요약 도구",
  ][i],
    description:
    "AI를 활용하여 아이디어, 글, 분석 보고서를 자동으로 생성해주는 프롬프트입니다.",
  createdAt: "2025-01-14T00:00:00.000Z",
}));

const ITEMS_PER_PAGE = 10;

export default function Bookmark() {
  const [page, setPage] = useState(1);
  const [bookmarks, setBookmarks] = useState(dummyPrompts);

  const totalItems = bookmarks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = bookmarks.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleUnbookmark = (id) => {
    setBookmarks((prev) => {
      const next = prev.filter((item) => item.id !== id);
      const nextTotalPages = Math.max(1, Math.ceil(next.length / ITEMS_PER_PAGE));
      if (page > nextTotalPages) {
        setPage(nextTotalPages);
      }
      return next;
    });
  };

  return (
    <PageWrapper>
      <ContentContainer>
        <Header>
          <TitleWrapper>
            <Icon src={starIcon} alt="북마크 아이콘" />
            <Title>북마크</Title>
          </TitleWrapper>
          <NewButton to="/prompts/new">프롬프트 등록</NewButton>
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
                  {new Date(p.createdAt).toISOString().slice(0, 10)} - prompt.prome
                </CardMeta>
              </CardTopBar>

              <CardBody>
                <CardTitle>{p.title}</CardTitle>
                <CardDescription>{p.description}</CardDescription>

                <ButtonRow>
                  <ViewButton to={`/prompts/${p.id}`}>프롬프트 보기</ViewButton>
                  <StarButton type="button" onClick={() => handleUnbookmark(p.id)}>
                    <StarIcon src={starIcon} alt="북마크 취소" />
                  </StarButton>
                </ButtonRow>
              </CardBody>
            </PromptCard>
          ))}
        </PromptGrid>

        {totalPages > 1 && totalItems > 0 && (
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

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
`;

const ContentContainer = styled.main`
  max-width: 1280px;
  margin: 40px auto 60px;
  padding: 0 16px;
  box-sizing: border-box;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Icon = styled.img`
  width: 30px;
  height: 30px;
  object-fit: contain;
  transform: translateY(2px);
  vertical-align: middle;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
`;

const NewButton = styled(Link)`
  padding: 8px 16px;
  border: 2px solid #000000;
  background-color: #ffffff;
  font-size: 14px;
  text-decoration: none;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 2px 2px 0px #000;
  }
`;

const PromptGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px 28px;
  margin-bottom: 40px;
`;

const PromptCard = styled.article`
  border: 2px solid #000000;
  background-color: #ffffff;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 4px 4px 0 #000;
  }
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
  font-size: 19px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const CardDescription = styled.p`
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
  flex: 1;
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ViewButton = styled(Link)`
  padding: 8px 16px;
  border: 2px solid #000000;
  background-color: #ffffff;
  font-size: 14px;
  text-decoration: none;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 2px 2px 0px #000;
  }
`;

const StarButton = styled.button`
  border: none;
  background: transparent;
  padding: 4px;
  cursor: pointer;
`;

const StarIcon = styled.img`
  width: 25px;
  height: 25px;
  object-fit: contain;
`;

const Pagination = styled.nav`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
`;

const PageButton = styled.button`
  border: none;
  background: transparent;
  font-size: 18px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  text-decoration: ${({ $active }) => ($active ? "underline" : "none")};
  cursor: pointer;
  padding: 4px 8px;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.15);
  }
`;
