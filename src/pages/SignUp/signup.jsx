// src/pages/SignUp/signup.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./signup.styles";

// 아이콘은 파일 URL로 임포트 (원하신 방식)
// 현재 파일이 src/pages/SignUp/signup.jsx 이고,
// 아이콘이 src/assets/kakao.svg 라면 상대경로는 아래가 맞습니다.
import KakaoIconSrc from "../../assets/kakao.svg";

export default function SignUp() {
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: 회원가입 처리
    navigate("/login");
  };

  const onKakaoLogin = () => {
    // TODO: 카카오 OAuth 시작
    // window.location.href = "/oauth2/authorization/kakao";
  };

  return (
    <S.Page role="main" aria-label="회원가입">
      <S.Container>
        <S.Title>회원가입</S.Title>
        <S.Desc>가입할 아이디와 비밀번호를 입력해 주세요.</S.Desc>

        <S.Form onSubmit={onSubmit}>
          <S.Input
            type="text"
            name="username"
            placeholder="아이디"
            autoComplete="username"
            required
          />
          <S.Input
            type="password"
            name="password"
            placeholder="비밀번호"
            autoComplete="new-password"
            required
          />
          <S.Input
            type="password"
            name="passwordConfirm"
            placeholder="비밀번호 재확인"
            autoComplete="new-password"
            required
          />

          <S.PrimaryButton type="submit">회원가입</S.PrimaryButton>

          <S.KakaoButton type="button" onClick={onKakaoLogin}>
            <S.KakaoIcon src={KakaoIconSrc} alt="" />
            카카오 로그인
          </S.KakaoButton>
        </S.Form>
      </S.Container>
    </S.Page>
  );
}
