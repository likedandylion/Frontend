import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import searchIcon from "@/assets/images/search_image.svg";
import api from "@/api/axiosInstance";

/* ================================
   📦 목데이터 (서버 미연동 시용)
   ================================ */
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

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get("q") || "").trim(); // 검색어
  const displayQuery = q || "전체";

  const token = localStorage.getItem("accessToken");
  const authHeaders = token
    ? { Authorization: `Bearer ${token}` }
    : undefined;

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setPage(1);
  }, [q]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError("");

      // ✅ 검색 API 연동 (GET /api/v1/posts/search)
      try {
        // 검색어가 없으면 빈 결과 표시
        if (!q || !q.trim()) {
          setItems([]);
          setTotalItems(0);
          setTotalPages(1);
          setLoading(false);
          return;
        }

        const { data } = await api.get("/api/v1/posts/search", {
          params: {
            keyword: q.trim(), // keyword 파라미터 사용
            sort: "latest", // latest 정렬
            page: page - 1, // 0부터 시작
            size: ITEMS_PER_PAGE,
          },
        });

        console.log("📥 검색 API 응답:", data);

        const mapItem = (d) => ({
          id: d.postId,
          title: d.title || "(제목 없음)",
          description: d.description || d.content || "",
          createdAt: d.createdAt || new Date().toISOString(),
        });

        // 응답 형식 확인 (success 필드가 있는지, data가 배열인지 객체인지)
        if (data.success && data.data) {
          // 페이지네이션 형식인 경우
          if (data.data.content && Array.isArray(data.data.content)) {
            const list = data.data.content.map(mapItem);
            setItems(list);
            setTotalItems(data.data.totalElements || list.length);
            setTotalPages(data.data.totalPages || 1);
          }
          // 배열 형식인 경우
          else if (Array.isArray(data.data)) {
            const list = data.data.map(mapItem);
            setItems(list);
            setTotalItems(list.length);
            setTotalPages(1);
          }
          // 단일 객체 배열인 경우
          else if (Array.isArray(data)) {
            const list = data.map(mapItem);
            setItems(list);
            setTotalItems(list.length);
            setTotalPages(1);
          } else {
            setItems([]);
            setTotalItems(0);
            setTotalPages(1);
          }
        } else {
          setItems([]);
          setTotalItems(0);
          setTotalPages(1);
        }
      } catch (e) {
        console.error("검색 API 실패:", e);
        console.error("에러 응답:", e.response?.data);
        setError(e.response?.data?.message || "검색 결과를 불러오지 못했습니다.");
        setItems([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [q, page]);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (loading)
    return (
      <PageWrapper>
        <ContentContainer>
          <Header>
            <TitleWrapper>
              <Icon src={searchIcon} alt="검색 아이콘" />
              <Title>"{displayQuery}" 검색 중...</Title>
            </TitleWrapper>
          </Header>
        </ContentContainer>
      </PageWrapper>
    );

  if (error)
    return (
      <PageWrapper>
        <ContentContainer>
          <Header>
            <TitleWrapper>
              <Icon src={searchIcon} alt="검색 아이콘" />
              <Title>검색 오류 발생</Title>
            </TitleWrapper>
          </Header>
          <EmptyMessage>{error}</EmptyMessage>
        </ContentContainer>
      </PageWrapper>
    );

  return (
    <PageWrapper>
      <ContentContainer>
        <Header>
          <TitleWrapper>
            <Icon src={searchIcon} alt="검색 아이콘" />
            <Title>
              "{displayQuery}"에 대한 검색 결과 (총 {totalItems}개)
            </Title>
          </TitleWrapper>

          <AddButton to="/prompts/new">+ 프롬프트 등록</AddButton>
        </Header>

        {totalItems === 0 ? (
          <EmptyMessage>검색 결과가 없습니다.</EmptyMessage>
        ) : (
          <>
            <PromptGrid>
              {items.map((p) => (
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
          </>
        )}
      </ContentContainer>
    </PageWrapper>
  );
}

/* ========= styled-components 그대로 ========= */

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
  width: 25px;
  height: 25px;
  object-fit: contain;
  transform: translateY(2px);
  vertical-align: middle;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
`;

const AddButton = styled(Link)`
  padding: 8px 16px;
  border: 2px solid #000;
  background-color: #fff;
  color: #000;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 2px 2px 0 #000;
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

const EmptyMessage = styled.p`
  margin-top: 80px;
  text-align: center;
  font-size: 16px;
`;
