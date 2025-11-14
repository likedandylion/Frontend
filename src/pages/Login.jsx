import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import api from "@/api/axiosInstance"; // ✅ axios instance (baseURL 세팅된 파일)
import { useAuth } from "@/features/auth/useAuth";
import KakaoIconSrc from "../assets/kakao.svg";

export default function Login() {
  const [f, setF] = useState({ userId: "", password: "" });
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [searchParams] = useSearchParams();

  // ✅ 카카오 로그인 콜백 처리
  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const message = searchParams.get("message");

    // 에러가 있으면 에러 페이지로 이동
    if (error || message) {
      const errorMessage = message || error || "카카오 로그인에 실패했습니다.";
      console.error("카카오 로그인 에러:", errorMessage);
      nav(
        `/error?error=${encodeURIComponent(error)}&message=${encodeURIComponent(
          errorMessage
        )}`,
        { replace: true }
      );
      return;
    }

    // 토큰이 있으면 로그인 처리
    if (accessToken && refreshToken) {
      try {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        login(accessToken, { loginId: "kakao_user" });
        alert("카카오 로그인 성공!");
        nav("/", { replace: true });
      } catch (err) {
        console.error("카카오 로그인 처리 오류:", err);
        nav("/error?message=로그인 처리 중 오류가 발생했습니다.", {
          replace: true,
        });
      }
    } else if (token) {
      // 백엔드에서 token 하나만 전달하는 경우
      try {
        localStorage.setItem("accessToken", token);
        login(token, { loginId: "kakao_user" });
        alert("카카오 로그인 성공!");
        nav("/", { replace: true });
      } catch (err) {
        console.error("카카오 로그인 처리 오류:", err);
        nav("/error?message=로그인 처리 중 오류가 발생했습니다.", {
          replace: true,
        });
      }
    }
  }, [searchParams, login, nav]);

  // ✅ 실제 로그인 연동
  const submit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/api/v1/auth/login", {
        loginId: f.userId, // 스웨거에서 loginId 필드 사용 중
        password: f.password,
      });

      console.log("✅ 로그인 응답:", data);

      if (data?.success && data.data?.accessToken) {
        const accessToken = data.data.accessToken;
        const refreshToken = data.data.refreshToken;

        // 토큰 저장 (로컬 스토리지)
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // 전역 AuthContext에 로그인 상태 업데이트
        login(accessToken, { loginId: f.userId });

        alert("로그인 성공!");
        nav(loc.state?.from?.pathname || "/", { replace: true });
      } else {
        alert(
          data?.message || "로그인 실패. 아이디 또는 비밀번호를 확인해주세요."
        );
      }
    } catch (error) {
      console.error("❌ 로그인 오류:", error);
      const msg =
        error.response?.data?.message || "로그인 중 오류가 발생했습니다.";
      alert(msg);
    }
  };

  const onKakaoLogin = () => {
    // 카카오 OAuth 인증 페이지로 리다이렉트
    window.location.href =
      "https://prome.lion.it.kr/oauth2/authorization/kakao";
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

/* ========= styled-components ========= */

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
  border-radius: 0;
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
  background: #000000;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  border: 0;
  border-radius: 0;
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
  border-radius: 0;
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
