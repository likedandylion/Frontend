import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "@/features/auth/useAuth";

const Bar = styled.nav`
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
`;
export default function Nav() {
  const { user, logout } = useAuth();
  return (
    <Bar>
      <Link to="/">prome</Link>
      <Link to="/prompts">전체 프롬프트</Link>
      <Link to="/search">검색</Link>
      <Link to="/bookmarks">북마크</Link>
      <Link to="/premium">프리미엄</Link>
      <Link to="/pricing">요금제</Link>
      <Link to="/watch-ads">광고시청</Link>
      {user ? (
        <>
          <Link to="/me">마이페이지</Link>
          <button onClick={logout}>로그아웃</button>
        </>
      ) : (
        <>
          <Link to="/login">로그인</Link>
          <Link to="/signup">회원가입</Link>
        </>
      )}
    </Bar>
  );
}
