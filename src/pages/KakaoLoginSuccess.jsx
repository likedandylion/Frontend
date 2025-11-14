import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";
import styled from "styled-components";

/**
 * 카카오 로그인 성공 페이지
 * 백엔드가 /oauth/kakao/success?accessToken=...&refreshToken=...로 리다이렉트
 */
export default function KakaoLoginSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    // 무한 리디렉션 방지: 이미 처리된 경우 return
    const processed = sessionStorage.getItem("loginSuccessProcessed");
    if (processed === "true") {
      console.log("⚠️ 이미 처리된 로그인 요청입니다. 무한 리디렉션 방지.");
      return;
    }

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    console.log("🔍 KakaoLoginSuccess - URL 파라미터 확인:", {
      accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : null,
      refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : null,
      fullUrl: window.location.href,
      hostname: window.location.hostname,
    });

    // 프론트엔드 도메인인지 확인 (백엔드 도메인에서 리다이렉트된 경우)
    if (window.location.hostname === "prome.lion.it.kr") {
      console.error("❌ 백엔드 도메인에서 접근했습니다. 백엔드가 프론트엔드 도메인으로 리다이렉트해야 합니다.");
      console.error("현재 URL:", window.location.href);
      alert("백엔드가 프론트엔드 도메인으로 리다이렉트하도록 설정해야 합니다.");
      return;
    }

    if (accessToken && refreshToken) {
      try {
        // 처리 중 플래그 설정 (무한 리디렉션 방지)
        sessionStorage.setItem("loginSuccessProcessed", "true");

        // ✅ 1. 토큰을 LocalStorage에 저장 (백엔드 요구사항: 안전한 저장소)
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // ✅ 2. 저장 확인
        const savedAccessToken = localStorage.getItem("accessToken");
        const savedRefreshToken = localStorage.getItem("refreshToken");
        
        if (!savedAccessToken || savedAccessToken !== accessToken) {
          throw new Error("AccessToken 저장 실패");
        }
        if (!savedRefreshToken || savedRefreshToken !== refreshToken) {
          throw new Error("RefreshToken 저장 실패");
        }

        console.log("✅ 토큰 LocalStorage 저장 및 확인 완료");

        // ✅ 3. AuthContext에 로그인 상태 업데이트
        login(accessToken, { loginId: "kakao_user" });

        console.log("✅ AuthContext 업데이트 완료");

        // ✅ 4. URL 파라미터 제거하고 홈으로 이동
        // 완전한 페이지 새로고침으로 이동 (무한 리디렉션 방지)
        // 페이지 새로고침 시 AuthProvider가 localStorage에서 토큰을 읽어서 자동으로 상태 복원
        setTimeout(() => {
          sessionStorage.removeItem("loginSuccessProcessed"); // 플래그 제거
          window.location.replace("/");
        }, 100);
      } catch (err) {
        console.error("❌ 로그인 처리 오류:", err);
        sessionStorage.removeItem("loginSuccessProcessed"); // 에러 시 플래그 제거
        navigate("/error?message=로그인 처리 중 오류가 발생했습니다.", {
          replace: true,
        });
      }
    } else {
      // 토큰이 없으면 에러 페이지로 이동
      console.error("❌ 토큰이 전달되지 않았습니다.");
      console.error("전체 URL:", window.location.href);
      console.error("모든 URL 파라미터:", Object.fromEntries(searchParams.entries()));
      navigate("/error?message=로그인 토큰을 받지 못했습니다.", {
        replace: true,
      });
    }
  }, [searchParams, login, navigate]);

  return (
    <Page>
      <Container>
        <Message>로그인 처리 중...</Message>
        <Desc>잠시만 기다려주세요.</Desc>
      </Container>
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  text-align: center;
`;

const Message = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
`;

const Desc = styled.p`
  font-size: 14px;
  color: #999;
`;

