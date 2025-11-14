import axios from "axios";

// ✅ Axios 인스턴스 생성
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/", // 환경변수 기반 서버 주소
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // 쿠키/세션 필요 시 true 유지
});

// ✅ 요청 인터셉터 (자동으로 accessToken 헤더에 추가)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // ✅ 백엔드 요구사항: Authorization: Bearer [저장된 Access Token]
      config.headers.Authorization = `Bearer ${token}`;
      // 디버깅: Authorization 헤더가 포함되었는지 확인
      if (config.url?.startsWith("/api/v1")) {
        console.log("🔐 Authorization 헤더 추가:", config.url, "토큰:", token.substring(0, 20) + "...");
      }
    } else {
      // 토큰이 없는 경우도 로그 (인증 불필요 API인지 확인)
      if (config.url?.startsWith("/api/v1")) {
        console.warn("⚠️ 토큰 없이 인증 필요 API 호출:", config.url);
      }
    }
    // Content-Type 명시적으로 설정 (JSON 요청의 경우)
    if (config.data && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터 (토큰 만료 시 자동 갱신)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // accessToken 만료 또는 토큰 없음 (401 Unauthorized) 시
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      
      // refreshToken이 있으면 토큰 재발급 시도
      if (refreshToken) {
        try {
          // 새 accessToken 요청
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
            { refreshToken },
            { headers: { "Content-Type": "application/json" } }
          );

          const newAccessToken = data.data?.accessToken;
          if (!newAccessToken)
            throw new Error("No access token in refresh response");

          // 새 토큰 저장 및 요청 재시도
          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return api(originalRequest); // 요청 다시 보내기
        } catch (refreshError) {
          // 토큰 재발급 실패 시 에러만 반환 (로그 출력 최소화)
          // (무한 리디렉션 방지)
        }
      }
      
      // 401 에러는 조용히 반환 (페이지에서 처리)
      // 카카오 OAuth 리다이렉트 URL이 콘솔에 출력되지 않도록 로그 제거
    }

    return Promise.reject(error);
  }
);

export default api;
