import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import promptIcon from "@/assets/images/prompt_image.svg";
import api from "@/api/axiosInstance"; // ✅ axiosInstance 사용

const ITEMS_PER_PAGE = 10;

export default function Prompts() {
  const [prompts, setPrompts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ 게시글 전체 조회 API 연동
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const { data } = await api.get("/api/v1/posts", {
          params: {
            page: page - 1, // 백엔드는 0부터 시작
            size: ITEMS_PER_PAGE,
            sort: "createdAt,desc", // ✅ 수정됨
          },
        });

        console.log("📦 응답 데이터:", data); // ✅ 추가

        if (data.success && data.data?.content) {
          const normalized = data.data.content.map((item) => ({
            id: item.postId,
            title: item.title,
            description:
              item.content ?? // ✅ content로 변경
              "AI를 활용하여 아이디어, 글, 분석 보고서를 자동으로 생성해주는 프롬프트입니다.",
            createdAt: item.createdAt ?? new Date().toISOString(),
          }));

          setPrompts(normalized);
          setTotalPages(data.data.totalPages || 1);
        } else {
          console.warn("⚠️ 빈 데이터 또는 형식 오류:", data);
          setPrompts([]);
        }
      } catch (error) {
        console.error("❌ 프롬프트 목록 조회 실패:", error);
        setPrompts([]);
      }
    };

    fetchPrompts();
  }, [page]);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <PageWrapper>
      <ContentContainer>
        <Header>
          <TitleWrapper>
            <Icon src={promptIcon} alt="프롬프트 아이콘" />
            <Title>전체 프롬프트</Title>
          </TitleWrapper>

          <NewButton to="/prompts/new">프롬프트 등록</NewButton>
        </Header>

        <PromptGrid>
          {prompts.map((p) => (
            <PromptCard key={p.id}>
              <CardTopBar>
                <CardDots>
                  <Dot />
                  <Dot />
                  <Dot />
                </CardDots>
                <CardMeta>
                  {new Date(p.createdAt).toISOString().slice(0, 10)} -
                  prompt.prome
                </CardMeta>
              </CardTopBar>

              <CardBody>
                <CardTitle>{p.title}</CardTitle>
                <CardDescription>{p.description}</CardDescription>

                <ButtonRow>
                  <ViewButton to={`/prompts/${p.id}`}>프롬프트 보기</ViewButton>
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
  align-items: flex-end;
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
