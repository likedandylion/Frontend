import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider"; // ✅ 추가
import * as S from "./premiumonly.styles";
import promptIcon from "@/assets/images/prompt_image.svg";

// ✅ 더미 데이터
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
    "AI를 활용하여 아이디어, 글, 분석 보고서를 자동으로 생성해주는 프리미엄 전용 프롬프트입니다.",
  createdAt: "2025-01-14T00:00:00.000Z",
}));

const ITEMS_PER_PAGE = 10;

export default function PremiumOnly() {
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ 권한 체크 (무료 회원 접근 시 redirect)
  useEffect(() => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    if (!user.isPremium) {
      alert("프리미엄 전용 콘텐츠입니다. 요금제를 구매해주세요.");
      navigate("/pricing");
    }
  }, [user, navigate]);

  const totalItems = dummyPrompts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = dummyPrompts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
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

        <S.PromptGrid>
          {currentItems.map((p) => (
            <S.PromptCard key={p.id}>
              <S.CardTopBar>
                <S.CardDots>
                  <S.Dot />
                  <S.Dot />
                  <S.Dot />
                </S.CardDots>
                <S.CardMeta>
                  {new Date(p.createdAt).toISOString().slice(0, 10)} -
                  prompt.prome
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

        {totalPages > 1 && (
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
