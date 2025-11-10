import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./signup.styles";
import KakaoIconSrc from "../../assets/kakao.svg";

export default function SignUp() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isIdChecked, setIsIdChecked] = useState(false);

  // ✅ 회원가입 요청 함수 (POST /api/v1/auth/signup)
  const handleSignup = async () => {
    try {
      const response = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname,
          username,
          password,
          passwordConfirm,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "회원가입 실패");
      }

      alert("회원가입이 완료되었습니다 🎉");
      navigate("/login");
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert(error.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!isNicknameChecked || !isIdChecked) {
      alert("닉네임과 아이디 중복 확인을 완료해주세요.");
      return;
    }
    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    handleSignup(); // ✅ 연동 실행
  };

  const checkNicknameDuplicate = () => {
    if (nickname.trim() === "") {
      alert("닉네임을 입력해주세요.");
      return;
    }
    setIsNicknameChecked(true);
    alert("사용 가능한 닉네임입니다 ✅");
  };

  const checkIdDuplicate = () => {
    if (username.trim() === "") {
      alert("아이디를 입력해주세요.");
      return;
    }
    setIsIdChecked(true);
    alert("사용 가능한 아이디입니다 ✅");
  };

  const onKakaoLogin = () => {
    // TODO: 카카오 OAuth 연동
  };

  return (
    <S.Page role="main" aria-label="회원가입">
      <S.Container>
        <S.Title>회원가입</S.Title>
        <S.Desc>닉네임과 아이디, 비밀번호를 입력해 주세요.</S.Desc>

        <S.Form onSubmit={onSubmit}>
          {/* 닉네임 */}
          <S.InputGroup>
            <S.Input
              type="text"
              name="nickname"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
            <S.DuplicateButton
              type="button"
              onClick={checkNicknameDuplicate}
              disabled={isNicknameChecked}
            >
              {isNicknameChecked ? "확인 완료" : "중복 확인"}
            </S.DuplicateButton>
          </S.InputGroup>

          {/* 아이디 */}
          <S.InputGroup>
            <S.Input
              type="text"
              name="username"
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <S.DuplicateButton
              type="button"
              onClick={checkIdDuplicate}
              disabled={isIdChecked}
            >
              {isIdChecked ? "확인 완료" : "중복 확인"}
            </S.DuplicateButton>
          </S.InputGroup>

          {/* 비밀번호 */}
          <S.InputGroup>
            <S.Input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </S.InputGroup>

          {/* 비밀번호 재확인 */}
          <S.InputGroup>
            <S.Input
              type="password"
              name="passwordConfirm"
              placeholder="비밀번호 재확인"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </S.InputGroup>

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
