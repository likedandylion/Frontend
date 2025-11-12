import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import http from "@/shared/api/http"; // 🔹 나중에 API 연동할 때 쓸 친구
import { useAuth } from "@/features/auth/useAuth";
import KakaoIconSrc from "../assets/kakao.svg";

export default function Login() {
  const [f, setF] = useState({ userId: "", password: "" });
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  // ================================
  // 1) 지금 사용하는 목데이터 버전
  // ================================
  const submit = async (e) => {
    e.preventDefault();

    // 🔹 서버 연동 전까지는 무조건 성공하는 임시 로그인
    const mockUser = {
      nickname: "테스트유저",
      profileImageUrl: "https://example.com/default_profile.png",
      userId: f.userId,
    };

    const mockResponse = {
      accessToken: "mock_access_token_12345",
      user: mockUser,
    };

    login(mockResponse.accessToken, mockResponse.user);
    alert("임시 로그인 완료! (목데이터)");
    nav(loc.state?.from?.pathname || "/", { replace: true });
  };

  // ==========================================
  // 2) 실제 API 연동 버전 (👉 나중에 이걸로 교체)
  // ==========================================
  /*
  const submit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await http.post("/api/v1/auth/login", {
        userId: f.userId,
        password: f.password,
      });

      // data 예시:
      // {
      //   accessToken: "eyJhbGciOi...",
      //   user: {
      //     nickname: "케로로",
      //     profileImageUrl: "default_image_url"
      //   }
      // }

      login(data.accessToken, data.user);
      nav(loc.state?.from?.pathname || "/", { replace: true });
    } catch (error) {
      console.error("로그인 API 실패:", error);
      alert("로그인 실패. 아이디 또는 비밀번호를 확인해주세요.");
    }
  };
  */

  const onKakaoLogin = () => {
    // TODO: 카카오 OAuth 연동
  };

  return (
    <Page role="main" aria-label="로그인">
      <Container>
        <Title>로그인</Title>
        <Desc>가입하신 아이디와 비밀번호로 로그인하세요.</Desc>

        <Form onSubmit={submit}>
          <Input
            placeholder="아이디"
            value={f.userId}
            onChange={(e) => setF({ ...f, userId: e.target.value })}
            autoComplete="username"
            required
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={f.password}
            onChange={(e) => setF({ ...f, password: e.target.value })}
            autoComplete="current-password"
            required
          />
          <PrimaryButton type="submit">로그인</PrimaryButton>

          <KakaoButton type="button" onClick={onKakaoLogin}>
            <KakaoIcon src={KakaoIconSrc} alt="" />
            카카오 로그인
          </KakaoButton>

          <LinkButton type="button" onClick={() => nav("/signup")}>
            회원가입
          </LinkButton>
        </Form>
      </Container>
    </Page>
  );
}

/* ========= styled-components (UI 그대로) ========= */

const Page = styled.div`
  min-height: 100svh;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: 440px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: #0b1220;
  margin: 0 0 10px;
`;

const Desc = styled.p`
  margin: 0 0 26px;
  color: #6b7280;
  font-size: 15px;
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Input = styled.input`
  height: 48px;
  padding: 0 14px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  border-radius: 6px;
  font-size: 15px;

  &:focus {
    outline: none;
    border-color: #111827;
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.12);
  }
`;

const PrimaryButton = styled.button`
  height: 50px;
  margin-top: 10px;
  background: #ff8a00;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
  transition: filter 120ms ease, transform 120ms ease;

  &:hover {
    filter: brightness(0.95);
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 138, 0, 0.35);
  }
`;

const KakaoButton = styled.button`
  height: 50px;
  background: #fee500;
  color: #000000;
  font-size: 16px;
  font-weight: 700;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 12px;
  transition: filter 120ms ease, transform 120ms ease;

  &:hover {
    filter: brightness(0.98);
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(254, 229, 0, 0.35);
  }
`;

const KakaoIcon = styled.img`
  width: 20px;
  height: 20px;
  display: inline-block;
`;

const LinkButton = styled.button`
  margin-top: 18px;
  background: none;
  border: none;
  color: #0b1220;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  align-self: center;
`;
