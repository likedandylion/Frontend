import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider"; // ✅ 추가
import * as S from "./premiumonly.styles";
import promptIcon from "@/assets/images/prompt_image.svg";
import api from "@/api/axiosInstance";

// 한국 시간 기준 날짜 포맷팅 함수 (YYYY-MM-DD)
const formatDateKST = (dateString) => {
  if (!dateString) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  // 한국 시간대(Asia/Seoul) 기준으로 날짜 포맷팅
  const date = new Date(dateString);
  // 한국 시간대의 로컬 날짜 사용
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// ✅ 목데이터 프롬프트 (ID 1~18)
const PREMIUM_PROMPT_IDS = Array.from({ length: 18 }, (_, i) => i + 1);
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

const dummyPrompts = PREMIUM_PROMPT_TITLES.map((title, i) => ({
  id: i + 1,
  title: title,
  description:
    "AI를 활용하여 아이디어, 글, 분석 보고서를 자동으로 생성해주는 프리미엄 전용 프롬프트입니다.",
  createdAt: "2025-01-14T00:00:00.000Z",
  isMock: true, // 목데이터 표시
}));

const ITEMS_PER_PAGE = 10;

export default function PremiumOnly() {
  const [page, setPage] = useState(1);
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, subscription } = useAuth();
  const navigate = useNavigate();

  // ✅ 구독 상태 확인
  const isPremium = subscription?.isPremium || user?.isPremium || false;

  // ✅ 권한 체크 (무료 회원 접근 시 redirect)
  useEffect(() => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    if (!isPremium) {
      alert("프리미엄 전용 콘텐츠입니다. 요금제를 구매해주세요.");
      navigate("/pricing");
    }
  }, [user, isPremium, navigate]);

  // ✅ 프리미엄 프롬프트 목록 조회 (목데이터 + 실제 프롬프트)
  useEffect(() => {
    if (!isPremium || !user) return; // user 추가

    const fetchPrompts = async () => {
      try {
        setLoading(true);
        // 실제 API에서 프롬프트 목록 가져오기
        const { data } = await api.get("/api/v1/posts", {
          params: {
            sort: "latest",
            page: 0,
            size: 100, // 충분히 많이 가져오기
          },
        });

        const mapItem = (item) => ({
          id: item.postId,
          postId: item.postId,
          title: item.title || "(제목 없음)",
          description:
            item.description ||
            item.content ||
            "AI를 활용하여 아이디어, 글, 분석 보고서를 자동으로 생성해주는 프롬프트입니다.",
          createdAt: item.createdAt || new Date().toISOString(),
          isMock: false, // 실제 프롬프트
        });

        let apiPrompts = [];
        if (data.success && data.data) {
          if (data.data.content && Array.isArray(data.data.content)) {
            apiPrompts = data.data.content.map(mapItem);
          } else if (Array.isArray(data.data)) {
            apiPrompts = data.data.map(mapItem);
          } else if (Array.isArray(data)) {
            apiPrompts = data.map(mapItem);
          }
        }

        // 목데이터와 실제 프롬프트 병합 (목데이터가 먼저, 그 다음 실제 프롬프트)
        // 실제 프롬프트 중 ID가 1~18인 것은 제외 (목데이터와 중복 방지)
        const filteredApiPrompts = apiPrompts.filter(
          (p) => !PREMIUM_PROMPT_IDS.includes(parseInt(p.id))
        );

        // 목데이터 + 실제 프롬프트 병합
        const mergedPrompts = [...dummyPrompts, ...filteredApiPrompts];

        // 최신순 정렬 (createdAt 기준)
        mergedPrompts.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        });

        setPrompts(mergedPrompts);
      } catch (error) {
        console.error("❌ 프리미엄 프롬프트 목록 조회 실패:", error);
        // API 실패 시 목데이터만 표시
        setPrompts(dummyPrompts);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, [isPremium, user]);

  const totalItems = prompts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = prompts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <S.PageWrapper>
      <S.ContentContainer>
        <S.Header>
          <S.TitleWrapper>
            <S.Icon src={promptIcon} alt="프롬프트 아이콘" />
            <S.Title>프리미엄 전용 프롬프트</S.Title>
          </S.TitleWrapper>

          <S.NewButton to="/prompts/new">프롬프트 등록</S.NewButton>
        </S.Header>

        {loading ? (
          <div style={{ padding: 24, textAlign: "center" }}>로딩 중…</div>
        ) : (
          <S.PromptGrid>
            {currentItems.map((p) => (
              <S.PromptCard key={`${p.isMock ? "mock" : "api"}-${p.id}`}>
              <S.CardTopBar>
                <S.CardDots>
                  <S.Dot $color="#ff5f57" />
                  <S.Dot $color="#ffbd2e" />
                  <S.Dot $color="#28c940" />
                </S.CardDots>
                <S.CardMeta>
                  {formatDateKST(p.createdAt)} - prompt.prome
                </S.CardMeta>
              </S.CardTopBar>

              <S.CardBody>
                <S.CardTitle>{p.title}</S.CardTitle>
                <S.CardDescription>{p.description}</S.CardDescription>

                <S.ButtonRow>
                  <S.ViewButton to={`/prompts/${p.id}`}>
                    프롬프트 보기
                  </S.ViewButton>
                </S.ButtonRow>
              </S.CardBody>
              </S.PromptCard>
            ))}
          </S.PromptGrid>
        )}

        {!loading && totalPages > 1 && (
          <S.Pagination>
            {pages.map((pNum) => (
              <S.PageButton
                key={pNum}
                type="button"
                onClick={() => setPage(pNum)}
                $active={pNum === page}
              >
                {pNum}
              </S.PageButton>
            ))}
          </S.Pagination>
        )}
      </S.ContentContainer>
    </S.PageWrapper>
  );
}
