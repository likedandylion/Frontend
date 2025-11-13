import { createContext, useContext, useEffect, useState } from "react";
import api from "@/api/axiosInstance";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, name, premium }
  const [token, setToken] = useState(null);
  const [subscription, setSubscription] = useState(null); // 구독 정보 추가

  // ✅ 구독 정보 조회
  const fetchSubscription = async () => {
    const t = localStorage.getItem("accessToken");
    if (!t) {
      setSubscription(null);
      return;
    }

    try {
      // 먼저 목데이터 구독 정보 확인 (로컬스토리지)
      const mockSubscription = localStorage.getItem("prome_subscription");
      if (mockSubscription) {
        try {
          const mockData = JSON.parse(mockSubscription);
          // 만료일 체크
          if (
            mockData.subscriptionEndDate &&
            new Date(mockData.subscriptionEndDate) > new Date()
          ) {
            console.log("✅ 목데이터 구독 정보 사용:", mockData);
            setSubscription(mockData);

            // user 정보에도 isPremium 반영
            setUser((prevUser) => {
              if (prevUser) {
                const updatedUser = {
                  ...prevUser,
                  isPremium: true,
                };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                return updatedUser;
              }
              return prevUser;
            });
            return;
          } else {
            // 만료된 경우 목데이터 삭제
            localStorage.removeItem("prome_subscription");
          }
        } catch (e) {
          console.error("목데이터 구독 정보 파싱 실패:", e);
        }
      }

      // 목데이터가 없으면 실제 API로 조회
      const { data } = await api.get("/api/v1/users/me/subscription");
      const subData = data.data || data;
      setSubscription(subData);

      // user 정보에도 isPremium 반영
      setUser((prevUser) => {
        if (prevUser) {
          const updatedUser = {
            ...prevUser,
            isPremium: subData?.isPremium || false,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          return updatedUser;
        }
        return prevUser;
      });
    } catch (err) {
      console.error("❌ 구독 정보 조회 실패:", err);
      // 목데이터가 있으면 사용, 없으면 기본값
      const mockSubscription = localStorage.getItem("prome_subscription");
      if (mockSubscription) {
        try {
          const mockData = JSON.parse(mockSubscription);
          if (
            mockData.subscriptionEndDate &&
            new Date(mockData.subscriptionEndDate) > new Date()
          ) {
            setSubscription(mockData);
            return;
          }
        } catch (e) {
          // 무시
        }
      }
      setSubscription({ isPremium: false });
    }
  };

  useEffect(() => {
    const t = localStorage.getItem("accessToken");
    const u = localStorage.getItem("user");
    if (t && u) {
      setToken(t);
      const parsedUser = JSON.parse(u);
      setUser(parsedUser);
      // 구독 정보도 조회
      fetchSubscription();
    }
  }, []);

  const login = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem("accessToken", nextToken);
    localStorage.setItem("user", JSON.stringify(nextUser));
    // 로그인 후 구독 정보 조회
    fetchSubscription();
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setSubscription(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken"); // refreshToken도 삭제
    localStorage.removeItem("user");
  };

  // ✅ 구독 정보 새로고침 (구독 후 호출)
  const refreshSubscription = async () => {
    await fetchSubscription();
  };

  return (
    <AuthContext.Provider
      value={{ user, token, subscription, login, logout, refreshSubscription }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
