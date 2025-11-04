import React from "react";
import * as S from "./pricing.styles";
import CheckIcon from "@/assets/Check.svg";
import XIcon from "@/assets/X.svg";

export default function Pricing() {
  return (
    <S.PageWrapper>
      <S.Container>
        <S.Title>요금제</S.Title>
        <S.Subtitle>당신의 필요에 맞는 플랜을 선택하세요</S.Subtitle>

        <S.PlanWrapper>
          {/* 무료 플랜 */}
          <S.PlanCard>
            <S.PlanHeader>무료</S.PlanHeader>
            <S.Price>
              ₩0<span>/월</span>
            </S.Price>
            <S.FeatureList>
              <S.Feature>
                <S.Icon src={CheckIcon} /> 기본 프롬프트 100개 이용
              </S.Feature>
              <S.Feature>
                <S.Icon src={CheckIcon} /> 카테고리별 검색
              </S.Feature>
              <S.Feature>
                <S.Icon src={CheckIcon} /> 커뮤니티 접근
              </S.Feature>
              <S.Feature>
                <S.Icon src={XIcon} /> 프리미엄 프롬프트
              </S.Feature>
              <S.Feature>
                <S.Icon src={XIcon} /> 개인 라이브러리
              </S.Feature>
            </S.FeatureList>
            <S.Button>시작하기</S.Button>
          </S.PlanCard>

          {/* 프로 플랜 */}
          <S.PlanCard $highlight>
            <S.Badge>인기</S.Badge>
            <S.PlanHeader>프로</S.PlanHeader>
            <S.Price>
              ₩19,000<span>/월</span>
            </S.Price>
            <S.FeatureList>
              <S.Feature>
                <S.Icon src={CheckIcon} /> 모든 프롬프트 무제한 이용
              </S.Feature>
              <S.Feature>
                <S.Icon src={CheckIcon} /> 프리미엄 프롬프트 접근
              </S.Feature>
              <S.Feature>
                <S.Icon src={CheckIcon} /> 개인 라이브러리 생성
              </S.Feature>
              <S.Feature>
                <S.Icon src={CheckIcon} /> 우선 고객 지원
              </S.Feature>
              <S.Feature>
                <S.Icon src={CheckIcon} /> 새 프롬프트 우선 공개
              </S.Feature>
            </S.FeatureList>
            <S.HighlightButton>시작하기</S.HighlightButton>
          </S.PlanCard>

          {/* 팀 플랜 */}
          <S.PlanCard>
            <S.PlanHeader>팀</S.PlanHeader>
            <S.Price>
              ₩49,000<span>/월</span>
            </S.Price>
            <S.FeatureList>
              <S.Feature>
                <S.Icon src={CheckIcon} /> 프로 플랜의 모든 기능
              </S.Feature>
              <S.Feature>
                <S.Icon src={CheckIcon} /> 팀 멤버 5명까지
              </S.Feature>
              <S.Feature>
                <S.Icon src={CheckIcon} /> 팀 라이브러리 공유
              </S.Feature>
              <S.Feature>
                <S.Icon src={CheckIcon} /> 사용 통계 및 분석
              </S.Feature>
              <S.Feature>
                <S.Icon src={CheckIcon} /> 전용 계정 매니저
              </S.Feature>
            </S.FeatureList>
            <S.Button>시작하기</S.Button>
          </S.PlanCard>
        </S.PlanWrapper>
      </S.Container>
    </S.PageWrapper>
  );
}
