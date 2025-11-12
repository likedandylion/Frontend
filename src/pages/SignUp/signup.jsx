import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./signup.styles";
import KakaoIconSrc from "../../assets/kakao.svg";
import api from "../../api/axiosInstance"; // ✅ axios 인스턴스 import

export default function SignUp() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isIdChecked, setIsIdChecked] = useState(false);

  // ✅ 회원가입 요청 (POST /api/v1/auth/signup)
  const handleSignup = async () => {
    try {
      const { data } = await api.post("/api/v1/auth/signup", {
        loginId: username, // ✅ Swagger 기준
        nickname,
        password,
        passwordConfirm,
      });

      console.log("📩 회원가입 응답:", data);

      if (data.success) {
        alert("회원가입이 완료되었습니다 🎉");
        navigate("/login");
      } else {
        alert(data.message || "회원가입 실패");
      }
    } catch (err) {
      console.error("❌ 회원가입 오류:", err);
      alert(
        err.response?.data?.message || "회원가입 요청 중 오류가 발생했습니다."
      );
    }
  };

  // ✅ 닉네임 중복 확인 (GET /api/v1/auth/check-nickname?nickname=xxx)
  const checkNicknameDuplicate = async () => {
    if (!nickname.trim()) return alert("닉네임을 입력해주세요.");
    try {
      const { data } = await api.get(
        `/api/v1/auth/check-nickname?nickname=${encodeURIComponent(nickname)}`
      );

      console.log("📩 닉네임 중복 확인 응답:", data);

      if (data.data.available) {
        alert("✅ 사용 가능한 닉네임입니다.");
        setIsNicknameChecked(true);
      } else {
        alert("❌ 이미 사용 중인 닉네임입니다.");
      }
    } catch (err) {
      console.error("❌ 닉네임 중복 확인 오류:", err);
      alert(
        err.response?.data?.message ||
          "닉네임 중복 확인 중 오류가 발생했습니다."
      );
    }
  };

  // ✅ 아이디 중복 확인 (GET /api/v1/auth/check-id?loginId=xxx)
  const checkIdDuplicate = async () => {
    if (!username.trim()) return alert("아이디를 입력해주세요.");
    try {
      const { data } = await api.get(
        `/api/v1/auth/check-id?loginId=${encodeURIComponent(username)}`
      );

      console.log("📩 아이디 중복 확인 응답:", data);

      if (data.data.available) {
        alert("✅ 사용 가능한 아이디입니다.");
        setIsIdChecked(true);
      } else {
        alert("❌ 이미 사용 중인 아이디입니다.");
      }
    } catch (err) {
      console.error("❌ 아이디 중복 확인 오류:", err);
      alert(
        err.response?.data?.message ||
          "아이디 중복 확인 중 오류가 발생했습니다."
      );
    }
  };

  // ✅ 폼 제출
  const onSubmit = (e) => {
    e.preventDefault();
    if (!isNicknameChecked || !isIdChecked)
      return alert("닉네임과 아이디 중복 확인을 완료해주세요.");
    if (password !== passwordConfirm)
      return alert("비밀번호가 일치하지 않습니다.");
    handleSignup();
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
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setIsNicknameChecked(false);
              }}
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
              placeholder="아이디"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setIsIdChecked(false);
              }}
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
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </S.InputGroup>

          {/* 비밀번호 재확인 */}
          <S.InputGroup>
            <S.Input
              type="password"
              placeholder="비밀번호 재확인"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
          </S.InputGroup>

          <S.PrimaryButton type="submit">회원가입</S.PrimaryButton>

          <S.KakaoButton type="button">
            <S.KakaoIcon src={KakaoIconSrc} alt="" />
            카카오 로그인
          </S.KakaoButton>
        </S.Form>
      </S.Container>
    </S.Page>
  );
}
