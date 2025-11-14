import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";
import styled from "styled-components";

/**
 * 로그인 성공 페이지
 * 백엔드가 /login/success?accessToken=...&refreshToken=...로 리다이렉트
 */
export default function LoginSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  // 컴포넌트 렌더링 즉시 로그 출력 (useEffect 전에 실행)
  // 강제로 콘솔 로그 출력 (브라우저 필터 확인)
  // alert도 추가하여 컴포넌트 렌더링 확인
  if (typeof console !== 'undefined') {
    console.log("🚀 LoginSuccess 컴포넌트 렌더링됨 (최상위)");
    console.log("📍 현재 URL:", window.location.href);
    console.log("📍 현재 도메인:", window.location.hostname);
    console.log("📍 현재 경로:", window.location.pathname);
    console.log("📍 전체 쿼리 스트링:", window.location.search);
    console.warn("⚠️ 이 로그가 보이면 컴포넌트가 렌더링된 것입니다.");
    
    // 디버깅: 컴포넌트가 렌더링되었는지 확인
    if (!sessionStorage.getItem("loginSuccessAlertShown")) {
      sessionStorage.setItem("loginSuccessAlertShown", "true");
      setTimeout(() => {
        alert("🔍 LoginSuccess 컴포넌트 렌더링됨!\nURL: " + window.location.href + "\n쿼리: " + window.location.search);
      }, 100);
    }
  }

  useEffect(() => {
    // 즉시 로그 출력 (컴포넌트가 렌더링되었는지 확인)
    console.log("🚀 LoginSuccess useEffect 실행됨");
    console.log("📍 현재 URL:", window.location.href);
    console.log("📍 현재 도메인:", window.location.hostname);
    console.log("📍 현재 경로:", window.location.pathname);
    console.log("📍 모든 URL 파라미터:", Object.fromEntries(searchParams.entries()));

    // 무한 리디렉션 방지: 이미 처리된 경우 return
    const processed = sessionStorage.getItem("loginSuccessProcessed");
    if (processed === "true") {
      console.log("⚠️ 이미 처리된 로그인 요청입니다. 무한 리디렉션 방지.");
      // 플래그가 있으면 홈으로 이동하고 플래그 제거
      setTimeout(() => {
        sessionStorage.removeItem("loginSuccessProcessed");
        navigate("/", { replace: true });
      }, 100);
      return;
    }

    // 최대 1회만 처리하도록 플래그 설정
    sessionStorage.setItem("loginSuccessProcessed", "true");

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    console.log("🔍 LoginSuccess - URL 파라미터 확인:", {
      accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : null,
      refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : null,
      fullUrl: window.location.href,
      hostname: window.location.hostname,
    });

    // 프론트엔드 도메인인지 확인 (백엔드 도메인에서 리다이렉트된 경우)
    if (window.location.hostname === "prome.lion.it.kr") {
      console.error("❌ 백엔드 도메인에서 접근했습니다. 백엔드가 프론트엔드 도메인으로 리다이렉트해야 합니다.");
      console.error("현재 URL:", window.location.href);
      alert("❌ 백엔드가 프론트엔드 도메인으로 리다이렉트하도록 설정해야 합니다.\n현재 URL: " + window.location.href);
      return;
    }

    if (accessToken && refreshToken) {
      try {
        // ✅ 1. 토큰을 LocalStorage에 저장 (백엔드 요구사항: 안전한 저장소)
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        console.log("✅ 토큰 LocalStorage 저장 완료");

        // ✅ 2. 저장 확인
        const savedAccessToken = localStorage.getItem("accessToken");
        const savedRefreshToken = localStorage.getItem("refreshToken");
        
        if (!savedAccessToken || savedAccessToken !== accessToken) {
          throw new Error("AccessToken 저장 실패");
        }
        if (!savedRefreshToken || savedRefreshToken !== refreshToken) {
          throw new Error("RefreshToken 저장 실패");
        }

        console.log("✅ 토큰 저장 확인 완료");

        // ✅ 3. AuthContext에 로그인 상태 업데이트
        // user 정보는 나중에 API로 가져오기 위해 최소한의 정보만 저장
        // 임시 user 정보를 설정하여 인증 상태를 즉시 반영
        const tempUser = { loginId: "kakao_user", id: "temp" };
        login(accessToken, tempUser);

        console.log("✅ AuthContext 업데이트 완료");

        // ✅ 4. Authorization 헤더가 포함되는지 테스트
        const testToken = localStorage.getItem("accessToken");
        console.log("🔐 저장된 토큰 확인:", testToken ? "토큰 있음" : "토큰 없음");

        // ✅ 5. URL 파라미터 제거하고 홈으로 이동
        // 완전한 페이지 새로고침으로 이동 (무한 리디렉션 방지)
        // navigate 대신 window.location.replace 사용하여 완전히 새로운 페이지 로드
        setTimeout(() => {
          sessionStorage.removeItem("loginSuccessProcessed"); // 플래그 제거
          window.location.href = "/"; // 완전한 페이지 새로고침
        }, 1000); // 상태 업데이트 보장을 위한 딜레이
      } catch (err) {
        console.error("❌ 로그인 처리 오류:", err);
        sessionStorage.removeItem("loginSuccessProcessed"); // 에러 시 플래그 제거
        navigate("/error?message=로그인 처리 중 오류가 발생했습니다.", {
          replace: true,
        });
      }
    } else {
      // 토큰이 없으면 콘솔에 상세 정보 출력하고 에러 페이지로 이동하지 않음
      // 무한 리디렉션 방지를 위해 에러 페이지로 이동하지 않음
      console.error("❌ 토큰이 전달되지 않았습니다.");
      console.error("전체 URL:", window.location.href);
      console.error("모든 URL 파라미터:", Object.fromEntries(searchParams.entries()));
      console.error("accessToken:", searchParams.get("accessToken"));
      console.error("refreshToken:", searchParams.get("refreshToken"));
      console.error("모든 searchParams:", Array.from(searchParams.keys()));
      
      // 백엔드 확인 요청 메시지 표시
      alert("❌ 토큰이 URL에 포함되지 않았습니다.\n\n백엔드가 토큰을 URL 파라미터로 전달하는지 확인해주세요.\n\n현재 URL: " + window.location.href);
      
      // 무한 리디렉션 방지를 위해 홈으로 이동 (에러 페이지로 이동하지 않음)
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
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

