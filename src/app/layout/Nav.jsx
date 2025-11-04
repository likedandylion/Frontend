import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "@/features/auth/useAuth";

const Header = styled.header`
  width: 100%;
  border-bottom: 2px solid #000;
  background: #fff;
`;

const NavBar = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const Logo = styled(Link)`
  font-weight: 700;
  font-size: 18px;
  color: #111;
  text-decoration: none;
  display: flex;
  align-items: center;
  line-height: 1;
`;

const MenuList = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  transform: translateY(2px); /* ✅ 메뉴 전체를 살짝 아래로 내려 시각적 정렬 */

  a {
    font-size: 15px;
    color: #111;
    text-decoration: none;
    padding-bottom: 2px;
    line-height: 1;

    &:hover {
      border-bottom: 1px solid #111;
    }
  }
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  a,
  button {
    font-size: 14px;
    background: none;
    border: none;
    cursor: pointer;
    color: #111;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function Nav() {
  const { user, logout } = useAuth();

  return (
    <Header>
      <NavBar>
        {/* 왼쪽: 로고 + 메뉴 */}
        <LeftGroup>
          <Logo to="/">prome</Logo>
          <MenuList>
            <Link to="/prompts">전체 프롬프트</Link>
            <Link to="/search">검색</Link>
            <Link to="/watch-ads">광고시청</Link>
            <Link to="/bookmarks">북마크</Link>
            <Link to="/mypage">마이페이지</Link>
            <Link to="/pricing">요금제</Link>
            {user?.isPremium && <Link to="/premium">프리미엄</Link>}
          </MenuList>
        </LeftGroup>

        {/* 오른쪽: 로그인 / 회원가입 or 로그아웃 */}
        <RightGroup>
          {user ? (
            <button onClick={logout}>로그아웃</button>
          ) : (
            <>
              <Link to="/login">로그인</Link>
              <Link to="/signup">회원가입</Link>
            </>
          )}
        </RightGroup>
      </NavBar>
    </Header>
  );
}
