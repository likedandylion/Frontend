import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./home.styles";
import Pricing from "@/pages/Pricing/pricing.jsx";
import promptIcon from "@/assets/images/prompt_image.svg";
import api from "@/api/axiosInstance";

export default function Home() {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ 홈 화면 프롬프트 목록 조회 (최신 6개)
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const { data } = await api.get("/api/v1/posts", {
          params: {
            sort: "latest",
            page: 0,
            size: 6, // 홈 화면은 6개만 표시
          },
        });

        const mapItem = (item) => ({
          id: item.postId,
          title: item.title || "(제목 없음)",
          description:
            item.description || item.content ||
            "AI를 활용하여 아이디어, 글, 분석 보고서를 자동으로 생성해주는 프롬프트입니다.",
          createdAt: item.createdAt || new Date().toISOString(),
        });

        if (data.success && data.data) {
          if (data.data.content && Array.isArray(data.data.content)) {
            setPrompts(data.data.content.map(mapItem));
          } else if (Array.isArray(data.data)) {
            setPrompts(data.data.map(mapItem));
          } else if (Array.isArray(data)) {
            setPrompts(data.map(mapItem));
          }
        }
      } catch (error) {
        console.error("홈 화면 프롬프트 조회 실패:", error);
        // 실패해도 빈 배열 유지
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  const goToPrompts = () => navigate("/prompts");
  const goToPricing = () => navigate("/pricing");
  const goToSignup = () => navigate("/signup");

  return (
    <S.Page role="main" aria-label="홈">
      {/* ---------- Hero Section ---------- */}
      <S.HeroSection>
        <S.Container>
          <S.Heading>AI, 이제 클릭 한 번으로 전문가처럼.</S.Heading>
          <S.Subtitle>
            전문가들이 검증한 명령어를 복사해서 붙여넣기만 하세요. <br />
            보고서 작성부터 여행 계획까지, 당신의 AI가 놀랍도록 똑똑해집니다.
          </S.Subtitle>
          <S.Actions>
            <S.OutlineButton onClick={goToPrompts}>
              10초만에 무료로 시작하기
            </S.OutlineButton>
          </S.Actions>
        </S.Container>
      </S.HeroSection>

      {/* ---------- Category Section ---------- */}
      <S.CategorySection>
        <S.Container>
          <S.CategoryGrid>
            {["#이미지 생성", "#여행", "#업무", "#블로그"].map((cat, i) => (
              <S.CategoryCard key={i}>
                {cat} <span>→</span>
              </S.CategoryCard>
            ))}
          </S.CategoryGrid>
        </S.Container>
      </S.CategorySection>

      {/* ---------- Prompt Section ---------- */}
      <S.PromptSection>
        <S.PromptHeader>
          <S.PromptTitle>
            <S.Icon src={promptIcon} alt="프롬프트 아이콘" /> 프롬프트 탐색
          </S.PromptTitle>
          <S.RegisterButton onClick={() => navigate("/prompts/new")}>
            + 프롬프트 등록
          </S.RegisterButton>
        </S.PromptHeader>

        <S.PromptGrid>
          {loading ? (
            <div>로딩 중...</div>
          ) : prompts.length > 0 ? (
            prompts.map((p) => (
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
                  <S.PromptTitleText>{p.title}</S.PromptTitleText>
                  <S.PromptDescription>{p.description}</S.PromptDescription>
                  <S.PromptActions>
                    <S.ViewButton onClick={() => navigate(`/prompts/${p.id}`)}>
                      프롬프트 보기
                    </S.ViewButton>
                  </S.PromptActions>
                </S.CardBody>
              </S.PromptCard>
            ))
          ) : (
            <div>프롬프트가 없습니다.</div>
          )}
        </S.PromptGrid>

        <S.MorePromptsButton onClick={goToPrompts}>
          더보기 →
        </S.MorePromptsButton>
      </S.PromptSection>

      {/* ---------- Pricing Section (홈 미리보기) ---------- */}
      <S.PricingSection onClick={goToPricing} style={{ cursor: "pointer" }}>
        {/* ✅ 섹션 전체 클릭 시 /pricing 이동 */}
        <div>
          <Pricing />
        </div>
      </S.PricingSection>

      {/* ---------- HowTo Section ---------- */}
      <S.HowToSection>
        <S.HowToTitle>prome 사용법</S.HowToTitle>
        <S.HowToSubtitle>
          3단계만 따라하면 당신의 AI가 전문가 수준으로 업그레이드됩니다.
        </S.HowToSubtitle>

        <S.HowToSteps>
          <S.Step>
            <S.StepCircle>1</S.StepCircle>
            <S.StepTitle>원하는 프롬프트 찾기</S.StepTitle>
            <S.StepText>
              카테고리별 정리된 수천 개의 검증된 프롬프트 중에서 당신의 목적에
              맞는 것을 선택하세요. 전문가들이 직접 제작한 고퀄리티 프롬프트만을
              제공합니다.
            </S.StepText>
          </S.Step>

          <S.Step>
            <S.StepCircle>2</S.StepCircle>
            <S.StepTitle>복사해서 붙여넣기</S.StepTitle>
            <S.StepText>
              선택한 프롬프트를 한 번의 복사로 붙이세요. 당신이 사용하는 AI 도구
              어디서나 작동합니다. 필요한 부분만 수정하면 바로 실행할 수 있도록
              친절한 가이드도 함께 제공합니다.
            </S.StepText>
          </S.Step>

          <S.Step>
            <S.StepCircle>3</S.StepCircle>
            <S.StepTitle>놀라운 결과 확인</S.StepTitle>
            <S.StepText>
              같은 AI라도 프롬프트에 따라 결과가 완전히 달라집니다. 전문가
              수준의 품질을 얻고, 시간을 절약하며, 더 나은 성과를 경험해보세요.
            </S.StepText>
          </S.Step>
        </S.HowToSteps>
      </S.HowToSection>

      {/* ---------- Start Section ---------- */}
      <S.StartSection>
        <S.StartTitle>지금 시작해보세요</S.StartTitle>
        <S.StartSubtitle>
          수천 명의 사용자가 이미 prome으로 더 나은 AI 결과를 얻고 있습니다.{" "}
          <br />
          당신도 10초만에 무료로 시작해보세요.
        </S.StartSubtitle>
        <S.StartButtons>
          <S.StartBlackButton onClick={goToSignup}>
            무료로 시작하기
          </S.StartBlackButton>
          <S.StartOutlineButton>더 알아보기</S.StartOutlineButton>
        </S.StartButtons>
      </S.StartSection>
    </S.Page>
  );
}
