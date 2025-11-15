import React, { useEffect, useState, useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import styled from "styled-components";
import starIcon from "@/assets/images/star_image.svg";
import api from "@/api/axiosInstance";

/* ================================
   📦 목데이터 (서버 없을 때만 사용)
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

export default function Bookmark() {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPremium, setIsPremium] = useState(null); // null: 확인 중, true: 프리미엄, false: 무료
  const isCheckingPremiumRef = useRef(false); // 중복 체크 방지

  // ✅ 프리미엄 체크 (먼저 실행)
  useEffect(() => {
    // 중복 실행 방지 (React Strict Mode 대응)
    if (isCheckingPremiumRef.current) return;

    const checkPremium = async () => {
      if (!token) {
        setIsPremium(false);
        return;
      }

      isCheckingPremiumRef.current = true;

      try {
        console.log("🔍 북마크 페이지: 구독 정보 조회 시작");

        // ✅ 사용자 ID 가져오기 (계정별 구독 정보 분리)
        const currentUser = localStorage.getItem("user");
        let userId = null;
        if (currentUser) {
          try {
            const parsedUser = JSON.parse(currentUser);
            userId = parsedUser.id || parsedUser.userId;
          } catch (e) {
            console.warn("사용자 정보 파싱 실패:", e);
          }
        }
        const subscriptionKey = userId
          ? `prome_subscription_${userId}`
          : "prome_subscription";

        // ✅ 목데이터 구독 정보 먼저 확인 (로컬스토리지)
        const mockSubscription = localStorage.getItem(subscriptionKey);
        if (mockSubscription) {
          try {
            const mockData = JSON.parse(mockSubscription);
            // 만료일 체크
            if (
              mockData.subscriptionEndDate &&
              new Date(mockData.subscriptionEndDate) > new Date()
            ) {
              console.log(
                "✅ 북마크 페이지: 목데이터 구독 정보 사용:",
                mockData
              );
              setIsPremium(true);
              isCheckingPremiumRef.current = false;
              return;
            } else {
              // 만료된 경우 목데이터 삭제
              localStorage.removeItem(subscriptionKey);
            }
          } catch (e) {
            console.error("목데이터 구독 정보 파싱 실패:", e);
          }
        }

        // 목데이터가 없으면 실제 API로 조회
        const { data: subData } = await api.get(
          "/api/v1/users/me/subscription"
        );
        console.log("🔍 북마크 페이지: 구독 정보 응답 (원본):", subData);

        const currentSubscription = subData.data || subData;
        console.log("🔍 북마크 페이지: 파싱된 구독 정보:", currentSubscription);
        console.log(
          "🔍 북마크 페이지: isPremium 값:",
          currentSubscription?.isPremium
        );

        if (!currentSubscription?.isPremium) {
          console.log("❌ 북마크 페이지: 무료 회원으로 확인");
          setIsPremium(false);
        } else {
          console.log("✅ 북마크 페이지: 프리미엄 회원으로 확인");
          setIsPremium(true);
        }
      } catch (e) {
        console.error("❌ 북마크 페이지: 구독 정보 조회 실패:", e);
        console.error("❌ 에러 상세:", {
          status: e.response?.status,
          statusText: e.response?.statusText,
          data: e.response?.data,
          message: e.message,
        });
        // 구독 정보 조회 실패 시에도 프리미엄이 아니라고 간주
        setIsPremium(false);
      } finally {
        isCheckingPremiumRef.current = false;
      }
    };

    checkPremium();
  }, [token]);

  // ✅ 무료 회원 알람 및 리다이렉트
  useEffect(() => {
    if (isPremium === false) {
      alert("북마크 기능은 프리미엄 회원만 사용할 수 있습니다.");
      navigate("/pricing", { replace: true });
    }
  }, [isPremium, navigate]);

  // ✅ 북마크 목록 조회 (프리미엄 회원만)
  useEffect(() => {
    if (isPremium !== true) return; // 프리미엄 회원이 아니면 조회하지 않음

    const fetchBookmarks = async () => {
      setLoading(true);
      setError("");

      try {
        // ✅ 목데이터 구독 정보를 사용하는 경우, localStorage에서 북마크 목록 가져오기
        const currentUser = localStorage.getItem("user");
        let userId = null;
        if (currentUser) {
          try {
            const parsedUser = JSON.parse(currentUser);
            userId = parsedUser.id || parsedUser.userId;
          } catch (e) {
            console.warn("사용자 정보 파싱 실패:", e);
          }
        }
        const subscriptionKey = userId
          ? `prome_subscription_${userId}`
          : "prome_subscription";
        const mockSubscription = localStorage.getItem(subscriptionKey);

        if (mockSubscription) {
          console.log(
            "⭐ 목데이터 구독 정보 사용 - 목데이터 프롬프트 북마크는 localStorage, 실제 프롬프트는 API"
          );

          // ✅ 먼저 API에서 실제 북마크 목록 가져오기
          let apiBookmarks = [];
          try {
            const { data: apiData } = await api.get(
              "/api/v1/users/me/bookmarks"
            );
            const bookmarksData = apiData.data || apiData;
            if (Array.isArray(bookmarksData)) {
              // 북마크 API는 description이 없으므로 각 프롬프트의 상세 조회로 description 가져오기
              apiBookmarks = await Promise.all(
                bookmarksData.map(async (d) => {
                  let description = "";
                  try {
                    // 프롬프트 상세 조회로 description 가져오기
                    const { data: detailData } = await api.get(
                      `/api/v1/posts/${d.postId}`
                    );
                    const detail = detailData.data || detailData;
                    description = detail.description || detail.content || "";
                  } catch (detailError) {
                    console.log(
                      `⚠️ 프롬프트 ${d.postId} 상세 조회 실패:`,
                      detailError
                    );
                  }
                  return {
                    id: d.postId,
                    title: d.title || "(제목 없음)",
                    description: description,
                    createdAt: d.createdAt || new Date().toISOString(),
                  };
                })
              );
            }
          } catch (apiError) {
            console.warn("⚠️ API 북마크 조회 실패 (무시):", apiError);
          }

          // ✅ localStorage에서 모든 북마크 가져오기 (목데이터 + 실제 프롬프트)
          const bookmarkKeys = Object.keys(localStorage).filter((key) =>
            key.startsWith("prome_bookmark_")
          );
          const localBookmarks = [];
          const PREMIUM_PROMPT_TITLES = [
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
          ];

          // ✅ 목데이터 프롬프트(ID 1~18) 북마크 처리
          const mockBookmarkIds = [];
          bookmarkKeys.forEach((key) => {
            const promptId = key.replace("prome_bookmark_", "");
            const promptIdNum = parseInt(promptId);
            if (!isNaN(promptIdNum) && promptIdNum >= 1 && promptIdNum <= 18) {
              const index = promptIdNum - 1;
              if (index >= 0 && index < PREMIUM_PROMPT_TITLES.length) {
                localBookmarks.push({
                  id: promptIdNum,
                  postId: promptIdNum,
                  title: PREMIUM_PROMPT_TITLES[index],
                  description:
                    "AI를 활용하여 아이디어, 글, 분석 보고서를 자동으로 생성해주는 프리미엄 전용 프롬프트입니다.",
                  createdAt: "2025-01-14T00:00:00.000Z",
                });
                mockBookmarkIds.push(promptIdNum);
              }
            }
          });

          // ✅ localStorage에 저장된 실제 프롬프트(ID 19 이상) 북마크 처리
          const actualBookmarkIds = bookmarkKeys
            .map((key) => parseInt(key.replace("prome_bookmark_", "")))
            .filter(
              (id) => !isNaN(id) && id >= 19 && !mockBookmarkIds.includes(id)
            );

          if (actualBookmarkIds.length > 0) {
            console.log(
              "✅ localStorage에 저장된 실제 프롬프트 북마크:",
              actualBookmarkIds
            );
            try {
              // 프롬프트 목록 API로 기본 정보 가져오기
              const { data: postsData } = await api.get("/api/v1/posts", {
                params: {
                  sort: "latest",
                  page: 0,
                  size: 100,
                },
              });

              const posts =
                postsData.success && postsData.data
                  ? postsData.data.content || postsData.data || []
                  : [];

              // localStorage 북마크와 매칭되는 프롬프트 찾기
              const localActualBookmarks = await Promise.all(
                actualBookmarkIds.map(async (bookmarkId) => {
                  const found = posts.find(
                    (p) => p.postId === bookmarkId || p.id === bookmarkId
                  );
                  if (found) {
                    let description = found.description || found.content || "";
                    // 상세 조회 시도 (에러는 무시)
                    try {
                      const { data: detailData } = await api.get(
                        `/api/v1/posts/${bookmarkId}`
                      );
                      const detail = detailData.data || detailData;
                      description =
                        detail.description || detail.content || description;
                    } catch (detailError) {
                      // 상세 조회 실패해도 기본 정보로 표시
                    }
                    return {
                      id: found.postId || found.id,
                      title: found.title || "(제목 없음)",
                      description: description,
                      createdAt: found.createdAt || new Date().toISOString(),
                    };
                  }
                  return null;
                })
              );

              // null 제거 후 localBookmarks에 추가
              localActualBookmarks
                .filter((b) => b !== null)
                .forEach((b) => localBookmarks.push(b));
            } catch (localError) {
              console.warn(
                "⚠️ localStorage 실제 프롬프트 북마크 조회 실패:",
                localError
              );
            }
          }

          // ✅ API 북마크와 로컬 북마크 병합 (중복 제거)
          const allBookmarks = [...localBookmarks, ...apiBookmarks];
          const uniqueBookmarks = allBookmarks.filter(
            (bookmark, index, self) =>
              index === self.findIndex((b) => b.id === bookmark.id)
          );

          // 최신순 정렬
          uniqueBookmarks.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
          });

          setBookmarks(uniqueBookmarks);
          setLoading(false);
          return;
        }

        // 목데이터 구독 정보가 없으면 백엔드 API 호출
        const { data } = await api.get("/api/v1/users/me/bookmarks");
        const bookmarksData = data.data || data;
        const arr = Array.isArray(bookmarksData) ? bookmarksData : [];

        // 북마크 API는 description이 없으므로 각 프롬프트의 상세 조회로 description 가져오기
        let mapped = [];
        if (arr.length > 0) {
          mapped = await Promise.all(
            arr.map(async (d) => {
              let description = "";
              try {
                // 프롬프트 상세 조회로 description 가져오기
                const { data: detailData } = await api.get(
                  `/api/v1/posts/${d.postId}`
                );
                const detail = detailData.data || detailData;
                description = detail.description || detail.content || "";
              } catch (detailError) {
                console.log(
                  `⚠️ 프롬프트 ${d.postId} 상세 조회 실패:`,
                  detailError
                );
              }
              return {
                id: d.postId,
                title: d.title || "(제목 없음)",
                description: description,
                createdAt: d.createdAt || new Date().toISOString(),
              };
            })
          );
        }

        setBookmarks(mapped);
      } catch (e) {
        console.error("북마크 조회 실패:", e);
        setError("북마크 목록을 불러오지 못했습니다.");
        setBookmarks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [isPremium, navigate]);

  const totalItems = bookmarks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = bookmarks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // ✅ 북마크 해제 API 연동 (토글)
  const handleUnbookmark = async (id) => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    // ✅ UI 즉시 업데이트 (낙관적 업데이트)
    const prev = bookmarks;
    const next = prev.filter((item) => item.id !== id);
    setBookmarks(next);

    // 페이지 보정
    const nextTotalPages = Math.max(1, Math.ceil(next.length / ITEMS_PER_PAGE));
    if (page > nextTotalPages) setPage(nextTotalPages);

    // ✅ 모든 북마크를 localStorage에서 처리
    const bookmarkKey = `prome_bookmark_${id}`;
    localStorage.removeItem(bookmarkKey);

    // ✅ 백엔드 API 호출 시도 (에러는 무시)
    try {
      await api.post(`/api/v1/posts/${id}/bookmark`);
      console.log("✅ 북마크 해제 API 호출 성공");
    } catch (e) {
      console.log("⚠️ 북마크 해제 API 호출 실패:", e);
    }

    alert("북마크에서 제거되었습니다.");
  };

  // ✅ 로그인 체크
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ 프리미엄 체크 중 (최대 5초 대기)
  if (isPremium === null) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <div>로딩 중…</div>
        <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
          구독 정보를 확인하는 중입니다.
        </div>
      </div>
    );
  }

  // ✅ 무료 회원이면 리다이렉트 (알람은 useEffect에서 처리)
  if (isPremium === false) {
    return null; // useEffect에서 알람과 리다이렉트 처리
  }

  if (loading) return <div style={{ padding: 24 }}>로딩 중…</div>;
  if (error) return <div style={{ padding: 24 }}>{error}</div>;

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
                  {new Date(p.createdAt).toISOString().slice(0, 10)} -
                  prompt.prome
                </CardMeta>
              </CardTopBar>

              <CardBody>
                <CardTitle>{p.title}</CardTitle>
                <CardDescription>{p.description}</CardDescription>

                <ButtonRow>
                  <ViewButton to={`/prompts/${p.id}`}>프롬프트 보기</ViewButton>
                  <StarButton
                    type="button"
                    onClick={() => handleUnbookmark(p.id)}
                  >
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

/* ====== 아래 스타일은 네 코드 그대로 유지 ====== */

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
  border: 1.5px solid #000000;
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
  border: 1.5px solid #000000;
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
