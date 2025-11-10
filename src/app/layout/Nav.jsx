import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "@/features/auth/AuthProvider"; // ✅ 경로 통일
import HeaderSearch from "@/components/HeaderSearch";

const Header = styled.header`
  width: 100%;
  border-bottom: 1px solid #000;
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
  transform: translateY(2px);

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

const SearchWrapper = styled.div`
  margin-right: 70px;
`;

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handlePromptClick = (e) => {
    e.preventDefault();
    if (user?.isPremium) {
      navigate("/premium"); // ✅ 프리미엄 회원은 프리미엄 페이지로 이동
    } else {
      navigate("/prompts"); // ✅ 무료 회원은 일반 프롬프트 목록으로 이동
    }
  };

  return (
    <Header>
      <NavBar>
        <LeftGroup>
          <Logo to="/">prome</Logo>
          <MenuList>
            {/* ✅ 프리미엄 여부에 따라 전체 프롬프트 클릭 동작 분기 */}
            <a href="/prompts" onClick={handlePromptClick}>
              전체 프롬프트
            </a>

            <Link to="/bookmarks">북마크</Link>

            {/* ✅ 광고시청은 무료 회원만 표시 */}
            {!user?.isPremium && <Link to="/watch-ads">광고시청</Link>}

            <Link to="/mypage">마이페이지</Link>
            <Link to="/pricing">요금제</Link>
            <Link to="/search">검색</Link>
          </MenuList>
        </LeftGroup>

        <RightGroup>
          <SearchWrapper>
            <HeaderSearch />
          </SearchWrapper>

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
