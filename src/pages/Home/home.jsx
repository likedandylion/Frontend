import React from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./home.styles";
import Pricing from "@/pages/Pricing/pricing.jsx";
import promptIcon from "@/assets/images/prompt_image.svg";

// ✅ 더미 프롬프트 데이터
const dummyPrompts = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: [
    "창의적인 블로그 글 주제 생성기",
    "여행 일정 완벽 계획 생성기",
    "데이터 분석 리포트 자동화",
    "SNS 콘텐츠 아이디어 생성기",
    "프레젠테이션 스크립트 도우미",
    "제품 리뷰 요약 도구",
  ][i],
  description:
    "AI를 활용하여 아이디어, 글, 분석 보고서를 자동으로 생성해주는 프롬프트입니다.",
  createdAt: "2025-01-14T00:00:00.000Z",
}));

export default function Home() {
  const navigate = useNavigate();

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
          {dummyPrompts.map((p) => (
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
          ))}
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
