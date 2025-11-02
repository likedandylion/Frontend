import { Routes, Route } from "react-router-dom";
import AppLayout from "@/app/layout/AppLayout";
import { AuthProvider } from "@/features/auth/AuthProvider.jsx";

// ⬇️ 추가
import RequireAuth from "@/app/guards/RequireAuth.jsx";
import RequirePremium from "@/app/guards/RequirePremium.jsx";

import Home from "@/pages/Home";
import SignUp from "@/pages/SignUp";
import Login from "@/pages/Login";
import Prompts from "@/pages/Prompts";
import PromptDetail from "@/pages/PromptDetail";
import PromptNew from "@/pages/PromptNew";
import Bookmarks from "@/pages/Bookmarks";
import MyPage from "@/pages/MyPage";
import WatchAds from "@/pages/WatchAds";
import SearchResults from "@/pages/SearchResults";
import PremiumOnly from "@/pages/PremiumOnly";
import Pricing from "@/pages/Pricing";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
          <Route path="prompts" element={<Prompts />} />
          {/* ⬇️ 로그인 필요 */}
          <Route
            path="prompts/new"
            element={
              <RequireAuth>
                <PromptNew />
              </RequireAuth>
            }
          />
          <Route path="prompts/:id" element={<PromptDetail />} />
          {/* ⬇️ 로그인 필요 */}
          <Route
            path="bookmarks"
            element={
              <RequireAuth>
                <Bookmarks />
              </RequireAuth>
            }
          />
          {/* ⬇️ 로그인 필요 */}
          <Route
            path="me"
            element={
              <RequireAuth>
                <MyPage />
              </RequireAuth>
            }
          />
          <Route path="watch-ads" element={<WatchAds />} />
          <Route path="search" element={<SearchResults />} />
          {/* ⬇️ 프리미엄 전용(비로그인→/login, 일반회원→/pricing) */}
          <Route
            path="premium"
            element={
              <RequirePremium>
                <PremiumOnly />
              </RequirePremium>
            }
          />
          <Route path="pricing" element={<Pricing />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
