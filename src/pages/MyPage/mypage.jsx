import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./mypage.styles";
import AvatarIcon from "@/assets/avatar.svg";
import heartGreen from "@/assets/images/heart_green.svg";
import api from "@/api/axiosInstance";

export default function MyPage() {
  const navigate = useNavigate();

  // ✅ 상태 정의
  const [userInfo, setUserInfo] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [nicknameInput, setNicknameInput] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ 내 정보 조회
  const fetchUserInfo = async () => {
    try {
      const { data } = await api.get("/api/v1/users/me");
      setUserInfo(data.data);
      setNicknameInput(data.data.nickname);
    } catch (err) {
      console.error("❌ 유저 정보 조회 실패:", err);
    }
  };

  // ✅ 구독 정보 조회
  const fetchSubscription = async () => {
    try {
      const { data } = await api.get("/api/v1/users/me/subscription");
      setSubscription(data.data);
    } catch (err) {
      console.error("❌ 구독 정보 조회 실패:", err);
    }
  };

  // ✅ 내가 쓴 게시글
  const fetchPosts = async () => {
    try {
      const { data } = await api.get("/api/v1/users/me/posts");
      setPosts(data.data || []);
    } catch (err) {
      console.error("❌ 게시글 조회 실패:", err);
    }
  };

  // ✅ 내가 단 댓글
  const fetchComments = async () => {
    try {
      const { data } = await api.get("/api/v1/users/me/comments");
      setComments(data.data || []);
    } catch (err) {
      console.error("❌ 댓글 조회 실패:", err);
    }
  };

  // ✅ 프로필 수정
  const handleProfileSave = async () => {
    try {
      const { data } = await api.put("/api/v1/users/me/profile", {
        nickname: nicknameInput,
        profileImageUrl: userInfo?.profileImageUrl || "",
      });
      alert(data.message || "프로필이 수정되었습니다 ✅");
      fetchUserInfo();
    } catch (err) {
      console.error("❌ 프로필 수정 실패:", err);
      alert("프로필 수정 중 오류가 발생했습니다.");
    }
  };

  // ✅ 비밀번호 변경
  const handlePasswordChange = async () => {
    if (!currentPassword.trim() || !newPassword.trim())
      return alert("현재 비밀번호와 새 비밀번호를 모두 입력해주세요.");
    if (newPassword !== confirmPassword)
      return alert("비밀번호가 일치하지 않습니다.");

    try {
      const { data } = await api.put("/api/v1/users/me/password", {
        currentPassword,
        newPassword,
      });
      alert(data.message || "비밀번호가 변경되었습니다 ✅");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("❌ 비밀번호 변경 실패:", err);
      alert(
        err.response?.data?.message || "비밀번호 변경 중 오류가 발생했습니다."
      );
    }
  };

  // ✅ 게시글 삭제
  const handleDeletePost = async (postId) => {
    if (!window.confirm("정말로 이 프롬프트를 삭제하시겠습니까?")) return;
    try {
      const { data } = await api.delete("/api/v1/users/me/posts", {
        data: { postIds: [postId] },
      });
      alert(data.message || "게시글이 삭제되었습니다 ✅");
      fetchPosts();
    } catch (err) {
      console.error("❌ 게시글 삭제 실패:", err);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  // ✅ 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;
    try {
      const { data } = await api.delete("/api/v1/users/me/comments", {
        data: { commentIds: [commentId] },
      });
      alert(data.message || "댓글이 삭제되었습니다 ✅");
      fetchComments();
    } catch (err) {
      console.error("❌ 댓글 삭제 실패:", err);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  // ✅ 단일 댓글 삭제
  const handleDeleteSingleComment = async (commentId) => {
    if (!window.confirm("이 댓글을 정말 삭제할까요?")) return;
    try {
      const { data } = await api.delete(`/api/v1/comments/${commentId}`);
      alert(data.message || "댓글이 삭제되었습니다 ✅");
      fetchComments();
    } catch (err) {
      console.error("❌ 댓글 단일 삭제 실패:", err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchSubscription();
    fetchPosts();
    fetchComments();
  }, []);

  if (!userInfo) return <div>로딩 중...</div>;

  return (
    <S.Page>
      <S.Container>
        <S.Header>
          <S.Title>마이페이지</S.Title>
        </S.Header>

        <S.Grid>
          {/* ✅ 프로필 정보 */}
          <S.ProfileSection>
            <S.SectionTitle>프로필 정보</S.SectionTitle>
            <S.ProfileRow>
              <S.ProfileAvatarWrapper>
                <img src={AvatarIcon} alt="프로필 아이콘" />
              </S.ProfileAvatarWrapper>
              <S.ProfileInfo>
                <S.ProfileInfoRow>
                  <S.InfoGroup>
                    <S.InfoLabel>이메일</S.InfoLabel>
                    <S.Text>{userInfo.email}</S.Text>
                  </S.InfoGroup>
                  <S.InfoGroup>
                    <S.InfoLabel>가입일</S.InfoLabel>
                    <S.Text>{userInfo.createdAt?.slice(0, 10)}</S.Text>
                  </S.InfoGroup>
                </S.ProfileInfoRow>
                <S.TicketRow>
                  <S.Ticket>
                    <S.TicketIconBlue src={heartGreen} alt="블루 티켓" />
                    <span>{userInfo.blueTickets}</span>
                  </S.Ticket>
                  <S.Ticket>
                    <S.TicketIconGreen src={heartGreen} alt="그린 티켓" />
                    <span>{userInfo.greenTickets}</span>
                  </S.Ticket>
                </S.TicketRow>
              </S.ProfileInfo>
            </S.ProfileRow>
          </S.ProfileSection>

          {/* ✅ 계정 설정 */}
          <S.AccountSection>
            <S.SectionTitle>계정 설정</S.SectionTitle>
            <S.FormGroup>
              <S.FormRow>
                <S.InfoLabel>닉네임</S.InfoLabel>
                <S.Input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                />
              </S.FormRow>
              <S.FormRow>
                <S.InfoLabel>현재 비밀번호</S.InfoLabel>
                <S.Input
                  type="password"
                  placeholder="현재 비밀번호"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </S.FormRow>
              <S.FormRow>
                <S.InfoLabel>새 비밀번호</S.InfoLabel>
                <S.Input
                  type="password"
                  placeholder="새 비밀번호"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </S.FormRow>
              <S.FormRow>
                <S.InfoLabel>비밀번호 확인</S.InfoLabel>
                <S.Input
                  type="password"
                  placeholder="비밀번호 재입력"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </S.FormRow>
              <S.ActionButtons>
                <S.SaveButton onClick={handleProfileSave}>
                  프로필 저장
                </S.SaveButton>
                <S.SaveButton onClick={handlePasswordChange}>
                  비밀번호 변경
                </S.SaveButton>
              </S.ActionButtons>
            </S.FormGroup>
          </S.AccountSection>

          {/* ✅ 내가 작성한 게시글 */}
          <S.PostsSection>
            <S.SectionTitle>내가 작성한 게시글</S.SectionTitle>
            <S.Table>
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>제목</th>
                  <th>보기</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.postId}>
                    <td>{post.createdAt?.slice(0, 10)}</td>
                    <td>{post.title}</td>
                    <td>
                      <S.ActionButton
                        onClick={() => navigate(`/prompts/${post.postId}`)}
                      >
                        보기
                      </S.ActionButton>
                    </td>
                    <td>
                      <S.DeleteButton
                        onClick={() => handleDeletePost(post.postId)}
                      >
                        삭제
                      </S.DeleteButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </S.Table>
          </S.PostsSection>

          {/* ✅ 내가 단 댓글 */}
          <S.CommentsSection>
            <S.SectionTitle>내가 단 댓글</S.SectionTitle>
            <S.Table>
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>내용</th>
                  <th>보기</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment.commentId}>
                    <td>{comment.createdAt?.slice(0, 10)}</td>
                    <td>{comment.content}</td>
                    <td>
                      <S.ActionButton
                        onClick={() =>
                          navigate(`/prompts/${comment.postId}#comments`)
                        }
                      >
                        보기
                      </S.ActionButton>
                    </td>
                    <td>
                      <S.DeleteButton
                        onClick={() => handleDeleteComment(comment.commentId)}
                      >
                        삭제
                      </S.DeleteButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </S.Table>
          </S.CommentsSection>

          {/* ✅ 구독 관리 */}
          <S.FullSection>
            <S.SectionTitle>구독 관리</S.SectionTitle>
            <S.SubscriptionBox>
              <S.ProBadge>
                {subscription?.isPremium ? "PRO" : "FREE"}
              </S.ProBadge>
              <S.SubscriptionText>
                다음 결제일:{" "}
                {subscription?.subscriptionEndDate?.slice(0, 10) || "-"}
              </S.SubscriptionText>
            </S.SubscriptionBox>
          </S.FullSection>
        </S.Grid>
      </S.Container>
    </S.Page>
  );
}
