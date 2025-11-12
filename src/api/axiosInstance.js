import axios from "axios";

// ✅ Axios 인스턴스 생성
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/", // 환경변수 기반 서버 주소
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키/세션 필요 시 true 유지
});

// ✅ 요청 인터셉터 (자동으로 accessToken 헤더에 추가)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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

    // accessToken 만료 (401 Unauthorized) 시
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token found");

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
        console.error("🔒 토큰 재발급 실패:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // 로그인 페이지로 이동
      }
    }

    return Promise.reject(error);
  }
);

export default api;
