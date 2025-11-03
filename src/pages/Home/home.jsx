// src/pages/Home/home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./home.styles";

export default function Home() {
  const navigate = useNavigate();
  const handleStart = () => navigate("/prompts");

  return (
    <S.Page role="main" aria-label="홈">
      <S.HeroSection aria-labelledby="home-hero-heading">
        <S.Container>
          <S.Heading id="home-hero-heading">
            AI, 이제 클릭 한 번으로 전문가처럼.
          </S.Heading>

          <S.Subtitle>
            매일 쓰는 AI, 아직도 아쉽지 않으신가요? 전문가들이 검증한 만능
            명령어를 복사해서 붙여넣기만 하세요. <br />
            보고서 작성부터 여행 계획까지, 당신의 AI가 놀랍도록 똑똑해집니다.
          </S.Subtitle>

          <S.Actions>
            <S.OutlineButton type="button" onClick={handleStart}>
              10초만에 무료로 시작하기
            </S.OutlineButton>
          </S.Actions>
        </S.Container>
      </S.HeroSection>
    </S.Page>
  );
}
