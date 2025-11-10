import styled from "styled-components";

export const Page = styled.main`
  width: 100%;
  background: #fff;
  padding: 60px 0 100px;
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 36px;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-areas:
    "profile account"
    "posts posts"
    "comments comments"
    "subscribe subscribe";
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-areas:
      "profile"
      "account"
      "posts"
      "comments"
      "subscribe";
    grid-template-columns: 1fr;
  }
`;

export const BaseSection = styled.section`
  border: 1.5px solid #000;
  background: #fff;
  padding: 24px 28px;
  transition: 0.2s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 3px 3px 0 #000;
  }
`;

/* =========================================================
   🔹 프로필 카드
   ========================================================= */
export const ProfileSection = styled(BaseSection)`
  grid-area: profile;
`;

export const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 50px;
`;

export const ProfileAvatarWrapper = styled.div`
  width: 100px;
  height: 100px;
  // border: 1.5px solid #000;
  background: #ffffffff;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const InfoLabel = styled.label`
  font-size: 14px;
  color: #555;
`;

export const Text = styled.p`
  font-size: 15px;
  color: #111;
  font-weight: 500;
`;

/* =========================================================
   🔹 계정 설정
   ========================================================= */
export const AccountSection = styled(BaseSection)`
  grid-area: account;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const FormRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Input = styled.input`
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #000;
  background: #fff;
  border-radius: 0;
  font-size: 14px;
`;

export const DuplicateButton = styled.button`
  border: 1px solid #000;
  background: #fff;
  color: #000;
  font-weight: 600;
  font-size: 13px;
  padding: 8px 14px;
  cursor: pointer;
  transition: 0.15s;
  &:hover {
    background: #000;
    color: #fff;
  }
`;

export const SaveButton = styled(DuplicateButton)`
  font-weight: 700;
`;

export const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;

/* =========================================================
   🔹 게시글 & 댓글 테이블
   ========================================================= */
export const PostsSection = styled(BaseSection)`
  grid-area: posts;
`;

export const CommentsSection = styled(BaseSection)`
  grid-area: comments;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  color: #111;
  table-layout: fixed;

  th {
    text-align: left;
    padding: 10px 0;
    border-bottom: 1.5px solid #000;
    font-weight: 700;
  }

  td {
    padding: 12px 0;
    border-bottom: 1px solid #000;
    vertical-align: middle;
  }

  td:nth-child(2) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

export const ActionButton = styled.button`
  border: 1px solid #000;
  background: #fff;
  color: #000;
  font-weight: 600;
  font-size: 13px;
  padding: 6px 14px;
  line-height: 1;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.15s;
  vertical-align: middle;

  &:hover {
    background: #000;
    color: #fff;
  }
`;

/* =========================================================
   🔹 구독 관리
   ========================================================= */
export const FullSection = styled(BaseSection)`
  grid-area: subscribe;
`;

export const SubscriptionBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ProBadge = styled.span`
  background: #000;
  color: #fff;
  font-weight: 700;
  font-size: 12px;
  padding: 4px 10px;
  width: fit-content;
`;

export const SubscriptionText = styled.p`
  font-size: 14px;
  color: #111;
`;

export const SubscriptionActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

export const SubscriptionButton = styled.button`
  flex: 1;
  border: 1px solid #000;
  background: #fff;
  border-radius: 0;
  padding: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.15s;
  &:hover {
    background: #000;
    color: #fff;
  }
`;

export const CancelButton = styled(SubscriptionButton)`
  color: #ff4b4b;
  border-color: #ff4b4b;
  &:hover {
    background: #ff4b4b;
    color: #fff;
  }
`;

/* =========================================================
   🔹 공통 제목 스타일
   ========================================================= */
export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
`;
