import { Routes, Route } from "react-router-dom";
import AppLayout from "@/app/layout/AppLayout";
import { AuthProvider } from "@/features/auth/AuthProvider.jsx";

// Pages
import Home from "@/pages/Home/home.jsx";
import SignUp from "@/pages/SignUp/signup.jsx";
import Login from "@/pages/Login";
import Prompts from "@/pages/Prompts";
import PromptDetail from "@/pages/PromptDetail";
import PromptNew from "@/pages/PromptNew/promptnew.jsx";
import Bookmarks from "@/pages/Bookmarks";
import MyPage from "@/pages/MyPage/mypage.jsx";
import WatchAds from "@/pages/WatchAds";
import SearchResults from "@/pages/SearchResults";
import PremiumOnly from "@/pages/PremiumOnly/premiumOnly.jsx";
import Pricing from "@/pages/Pricing";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          {/* 메인 페이지 */}
          <Route index element={<Home />} />

          {/* 로그인 / 회원가입 */}
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />

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
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
