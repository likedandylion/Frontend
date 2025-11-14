import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "@/app/layout/AppLayout";
import { AuthProvider } from "@/features/auth/AuthProvider.jsx";
import SplashScreen from "@/components/SplashScreen";

// Pages
import Home from "@/pages/Home/home.jsx";
import SignUp from "@/pages/SignUp/signup.jsx";
import Login from "@/pages/Login";
import LoginSuccess from "@/pages/LoginSuccess";
import KakaoLoginSuccess from "@/pages/KakaoLoginSuccess";
import Prompts from "@/pages/Prompts";
import PromptDetail from "@/pages/PromptDetail";
import PromptNew from "@/pages/PromptNew/promptnew.jsx";
import Bookmarks from "@/pages/Bookmarks";
import MyPage from "@/pages/MyPage/mypage.jsx";
import WatchAds from "@/pages/WatchAds";
import SearchResults from "@/pages/SearchResults";
import PremiumOnly from "@/pages/PremiumOnly/premiumonly.jsx";
import Pricing from "@/pages/Pricing/pricing.jsx";
import NotFound from "@/pages/NotFound";
import Error from "@/pages/Error";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AuthProvider>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <Routes>
        <Route path="/" element={<AppLayout />}>
          {/* 메인 페이지 */}
          <Route index element={<Home />} />

          {/* 로그인 / 회원가입 */}
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
          <Route path="login/success" element={<LoginSuccess />} />
          <Route path="login/oauth/code/kakao" element={<LoginSuccess />} />
          <Route path="login/oauth2/code/kakao" element={<LoginSuccess />} />
          <Route path="oauth/kakao/success" element={<KakaoLoginSuccess />} />
          <Route path="oauth/kakao/callback" element={<LoginSuccess />} />
          <Route path="oauth2/kakao/callback" element={<LoginSuccess />} />

          {/* 프롬프트 관련 */}
          <Route path="prompts" element={<Prompts />} />
          <Route path="prompts/new" element={<PromptNew />} />
          <Route path="prompts/:id" element={<PromptDetail />} />

          {/* 북마크 */}
          <Route path="bookmarks" element={<Bookmarks />} />

          {/* 마이페이지 */}
          <Route path="mypage" element={<MyPage />} />

          {/* 기타 페이지 */}
          <Route path="watch-ads" element={<WatchAds />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="premium" element={<PremiumOnly />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="error" element={<Error />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
