import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./mypage.styles";
import AvatarIcon from "@/assets/avatar.svg";
import heartGreen from "@/assets/images/heart_green.svg";

export default function MyPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [usernameInput, setUsernameInput] = useState("");
  const [nicknameInput, setNicknameInput] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // ✅ 더미 데이터 (서버 꺼져 있을 때 fallback)
  const dummyUser = {
    email: "user@email.com",
    username: "user123",
    nickname: "동재",
    createdAt: "2024-03-12T00:00:00.000Z",
    blueTickets: 12,
    greenTickets: 8,
  };

  const dummySubscription = {
    planName: "PRO",
    status: "활성",
    nextBillingDate: "2025-04-11",
  };

  const dummyPosts = [
    {
      id: 1,
      title: "AI 프롬프트 작성법 공유",
      createdAt: "2025-07-18T00:00:00.000Z",
    },
    { id: 2, title: "ChatGPT 활용 팁", createdAt: "2025-07-19T00:00:00.000Z" },
  ];

  const dummyComments = [
    {
      id: 1,
      content: "이 프롬프트 정말 유용하네요!",
      createdAt: "2025-07-20T00:00:00.000Z",
      postId: 1, // ✅ 댓글이 속한 게시글 ID
    },
    {
      id: 2,
      content: "예시가 추가되면 더 좋을 것 같아요!",
      createdAt: "2025-07-21T00:00:00.000Z",
      postId: 2,
    },
  ];

  // ✅ fetch 실패 시 fallback
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch("/api/v1/users/me", { headers: authHeaders });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUserInfo(data);
        setUsernameInput(data.username);
        setNicknameInput(data.nickname);
      } catch {
        setUserInfo(dummyUser);
        setUsernameInput(dummyUser.username);
        setNicknameInput(dummyUser.nickname);
      }
    };

    const fetchSubscription = async () => {
      try {
        const res = await fetch("/api/v1/users/me/subscription", {
          headers: authHeaders,
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setSubscription(data);
      } catch {
        setSubscription(dummySubscription);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/v1/users/me/posts", {
          headers: authHeaders,
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setPosts(data);
      } catch {
        setPosts(dummyPosts);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch("/api/v1/users/me/comments", {
          headers: authHeaders,
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setComments(data);
      } catch {
        setComments(dummyComments);
      }
    };

    fetchUserInfo();
    fetchSubscription();
    fetchPosts();
    fetchComments();
  }, []);

  // ✅ 아이디 중복 확인
  const handleCheckId = async () => {
    if (!usernameInput.trim()) return alert("아이디를 입력해주세요.");
    try {
      const res = await fetch(
        `/api/v1/auth/check-id?username=${encodeURIComponent(usernameInput)}`,
        { method: "GET" }
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      alert(
        data.isAvailable
          ? "✅ 사용 가능한 아이디입니다."
          : "❌ 이미 사용 중인 아이디입니다."
      );
    } catch {
      alert("✅ (테스트) 사용 가능한 아이디입니다.");
    }
  };

  // ✅ 닉네임 중복 확인
  const handleCheckNickname = async () => {
    if (!nicknameInput.trim()) return alert("닉네임을 입력해주세요.");
    try {
      const res = await fetch(
        `/api/v1/auth/check-nickname?nickname=${encodeURIComponent(
          nicknameInput
        )}`,
        { method: "GET" }
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      alert(
        data.isAvailable
          ? "✅ 사용 가능한 닉네임입니다."
          : "❌ 이미 사용 중인 닉네임입니다."
      );
    } catch {
      alert("✅ (테스트) 사용 가능한 닉네임입니다.");
    }
  };

  // ✅ 게시글 삭제
  const handleDeletePost = async (postId) => {
    if (!window.confirm("정말로 이 프롬프트를 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/v1/posts/${postId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (!res.ok) throw new Error();
      alert("✅ 프롬프트가 삭제되었습니다.");
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch {
      alert("✅ (테스트) 프롬프트가 삭제되었습니다.");
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    }
  };

  // ✅ 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/v1/comments/${commentId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (!res.ok) throw new Error();
      alert("✅ 댓글이 삭제되었습니다.");
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      alert("✅ (테스트) 댓글이 삭제되었습니다.");
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  };

  // ✅ 게시글 보기 → 상세 페이지 이동
  const handleViewPost = (postId) => {
    navigate(`/prompts/${postId}`);
  };

  // ✅ 댓글 보기 → 상세 페이지 이동 + 댓글 섹션으로 스크롤
  const handleViewComment = (postId) => {
    navigate(`/prompts/${postId}#comments`);
  };

  if (!userInfo) return <div>로딩 중...</div>;

  return (
    <S.Page>
      <S.Container>
        <S.Header>
          <S.Title>마이페이지</S.Title>
        </S.Header>

        <S.Grid>
          {/* 프로필 */}
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

          {/* 계정 설정 */}
          <S.AccountSection>
            <S.SectionTitle>계정 설정</S.SectionTitle>
            <S.FormGroup>
              <S.FormRow>
                <S.InfoLabel>아이디</S.InfoLabel>
                <S.Input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                />
                <S.DuplicateButton onClick={handleCheckId}>
                  중복 확인
                </S.DuplicateButton>
              </S.FormRow>
              <S.FormRow>
                <S.InfoLabel>닉네임</S.InfoLabel>
                <S.Input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                />
                <S.DuplicateButton onClick={handleCheckNickname}>
                  중복 확인
                </S.DuplicateButton>
              </S.FormRow>
              <S.FormRow>
                <S.InfoLabel>새 비밀번호</S.InfoLabel>
                <S.Input type="password" placeholder="새 비밀번호" />
              </S.FormRow>
              <S.FormRow>
                <S.InfoLabel>비밀번호 확인</S.InfoLabel>
                <S.Input type="password" placeholder="비밀번호 재입력" />
              </S.FormRow>
              <S.ActionButtons>
                <S.SaveButton>저장</S.SaveButton>
              </S.ActionButtons>
            </S.FormGroup>
          </S.AccountSection>

          {/* 내가 작성한 게시글 */}
          <S.PostsSection>
            <S.SectionTitle>내가 작성한 게시글</S.SectionTitle>
            <S.Table>
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>제목</th>
                  <th>수정</th>
                  <th>보기</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td>{post.createdAt?.slice(0, 10)}</td>
                    <td>{post.title}</td>
                    <td>
                      <S.ActionButton>수정</S.ActionButton>
                    </td>
                    <td>
                      <S.ActionButton onClick={() => handleViewPost(post.id)}>
                        보기
                      </S.ActionButton>
                    </td>
                    <td>
                      <S.DeleteButton onClick={() => handleDeletePost(post.id)}>
                        삭제
                      </S.DeleteButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </S.Table>
          </S.PostsSection>

          {/* 내가 단 댓글 */}
          <S.CommentsSection>
            <S.SectionTitle>내가 단 댓글</S.SectionTitle>
            <S.Table>
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>내용</th>
                  <th>수정</th>
                  <th>보기</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment.id}>
                    <td>{comment.createdAt?.slice(0, 10)}</td>
                    <td>{comment.content}</td>
                    <td>
                      <S.ActionButton>수정</S.ActionButton>
                    </td>
                    <td>
                      <S.ActionButton
                        onClick={() => handleViewComment(comment.postId)}
                      >
                        보기
                      </S.ActionButton>
                    </td>
                    <td>
                      <S.DeleteButton
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        삭제
                      </S.DeleteButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </S.Table>
          </S.CommentsSection>

          {/* 구독 관리 */}
          <S.FullSection>
            <S.SectionTitle>구독 관리</S.SectionTitle>
            <S.SubscriptionBox>
              <S.ProBadge>{subscription.planName}</S.ProBadge>
              <S.SubscriptionText>
                상태: {subscription.status}
              </S.SubscriptionText>
              <S.SubscriptionText>
                다음 결제일: {subscription.nextBillingDate}
              </S.SubscriptionText>
              <S.SubscriptionActions>
                <S.SubscriptionButton>상세 보기</S.SubscriptionButton>
                <S.CancelButton>구독 취소</S.CancelButton>
              </S.SubscriptionActions>
            </S.SubscriptionBox>
          </S.FullSection>
        </S.Grid>
      </S.Container>
    </S.Page>
  );
}
