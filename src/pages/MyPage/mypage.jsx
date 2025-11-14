import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./mypage.styles";
import AvatarIcon from "@/assets/avatar.svg";
import heartGreen from "@/assets/images/heart_green.svg";
import api from "@/api/axiosInstance";
import { useAuth } from "@/features/auth/useAuth";

export default function MyPage() {
  const navigate = useNavigate();
  const { subscription: globalSubscription, refreshSubscription } = useAuth();

  // ✅ 상태 정의
  const [userInfo, setUserInfo] = useState(null);
  const [subscription, setSubscription] = useState(null);

  // 전역 구독 정보와 로컬 구독 정보 병합 (전역 정보 우선)
  const displaySubscription = globalSubscription || subscription;
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [nicknameInput, setNicknameInput] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ 내 정보 조회 API 연동 (GET /api/v1/users/me)
  const fetchUserInfo = async () => {
    try {
      const { data } = await api.get("/api/v1/users/me");
      const userData = data.data || data;
      console.log("👤 사용자 정보:", userData);
      // API 스펙: UserMeResponse { nickname, profileImageUrl, blueTickets, greenTickets, isPremium }
      
      // ✅ 목데이터 티켓 정보 병합 (localStorage에 저장된 티켓 수 우선 사용)
      try {
        const savedTickets = localStorage.getItem("prome_tickets");
        if (savedTickets) {
          const ticketsData = JSON.parse(savedTickets);
          console.log("🎫 목데이터 티켓 정보:", ticketsData);
          
          // 목데이터 티켓 수로 병합 (목데이터 우선)
          userData.blueTickets = ticketsData.blue ?? userData.blueTickets ?? 0;
          userData.greenTickets = ticketsData.green ?? userData.greenTickets ?? 0;
          
          console.log("✅ 티켓 정보 병합 완료:", {
            blue: userData.blueTickets,
            green: userData.greenTickets,
          });
        }
      } catch (ticketError) {
        console.warn("⚠️ 목데이터 티켓 정보 로드 실패 (무시):", ticketError);
      }
      
      setUserInfo(userData);
      setNicknameInput(userData.nickname || "");
    } catch (err) {
      console.error("❌ 유저 정보 조회 실패:", err);
      
      // ✅ API 실패 시에도 목데이터로 표시
      try {
        const savedTickets = localStorage.getItem("prome_tickets");
        if (savedTickets) {
          const ticketsData = JSON.parse(savedTickets);
          const mockUserInfo = {
            email: "목데이터",
            nickname: "",
            blueTickets: ticketsData.blue ?? 0,
            greenTickets: ticketsData.green ?? 0,
            isPremium: false,
          };
          setUserInfo(mockUserInfo);
          console.log("✅ 목데이터로 사용자 정보 표시:", mockUserInfo);
        }
      } catch (ticketError) {
        console.warn("⚠️ 목데이터 사용자 정보 로드 실패:", ticketError);
      }
    }
  };

  // ✅ 구독 정보 조회 API 연동 (GET /api/v1/users/me/subscription)
  const fetchSubscription = async () => {
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
            console.log("📋 목데이터 구독 정보 사용:", mockData);
            setSubscription(mockData);
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
      console.log("📋 구독 정보:", subData);
      // API 스펙: SubscriptionStatusResponse { isPremium: boolean, subscriptionEndDate: string }
      setSubscription(subData);
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
      // 구독 정보 조회 실패 시 기본값 설정
      setSubscription({ isPremium: false, subscriptionEndDate: null });
    }
  };

  // ✅ 내가 쓴 게시글 API 연동
  const fetchPosts = async () => {
    try {
      const { data } = await api.get("/api/v1/users/me/posts");
      const postsData = data.data || data;
      if (Array.isArray(postsData)) {
        setPosts(postsData);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error("❌ 게시글 조회 실패:", err);
      setPosts([]);
    }
  };

  // ✅ 내가 단 댓글 API 연동
  const fetchComments = async () => {
    try {
      const { data } = await api.get("/api/v1/users/me/comments");
      const commentsData = data.data || data;
      if (Array.isArray(commentsData)) {
        setComments(commentsData);
      } else {
        setComments([]);
      }
    } catch (err) {
      console.error("❌ 댓글 조회 실패:", err);
      setComments([]);
    }
  };

  // ✅ 프로필 수정 API 연동
  const handleProfileSave = async () => {
    try {
      const { data } = await api.put("/api/v1/users/me/profile", {
        nickname: nicknameInput.trim(),
        profileImageUrl: userInfo?.profileImageUrl || "",
      });
      alert(data.message || "프로필이 수정되었습니다 ✅");
      fetchUserInfo();
    } catch (err) {
      console.error("❌ 프로필 수정 실패:", err);
      alert(
        err.response?.data?.message || "프로필 수정 중 오류가 발생했습니다."
      );
    }
  };

  // ✅ 비밀번호 변경 API 연동
  const handlePasswordChange = async () => {
    if (!currentPassword.trim() || !newPassword.trim())
      return alert("현재 비밀번호와 새 비밀번호를 모두 입력해주세요.");
    if (newPassword !== confirmPassword)
      return alert("비밀번호가 일치하지 않습니다.");

    try {
      const { data } = await api.put("/api/v1/users/me/password", {
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim(),
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

  // ✅ 게시글 삭제 API 연동
  const handleDeletePost = async (postId) => {
    if (!window.confirm("정말로 이 프롬프트를 삭제하시겠습니까?")) return;
    try {
      const { data } = await api.delete("/api/v1/users/me/posts", {
        data: { postIds: [postId] },
      });
      const response = data.data || data;
      alert(data.message || "게시글이 삭제되었습니다 ✅");
      fetchPosts();
    } catch (err) {
      console.error("❌ 게시글 삭제 실패:", err);
      alert(
        err.response?.data?.message || "게시글 삭제 중 오류가 발생했습니다."
      );
    }
  };

  // ✅ 댓글 삭제 API 연동 (배열 삭제)
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
      alert(err.response?.data?.message || "댓글 삭제 중 오류가 발생했습니다.");
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

  // ✅ 구독 취소 API 연동 (POST /api/v1/payments/cancel)
  const handleCancelSubscription = async () => {
    if (!displaySubscription?.isPremium) {
      alert("현재 활성화된 구독이 없습니다.");
      return;
    }

    if (
      !window.confirm(
        "정말로 구독을 취소하시겠습니까?\n취소 후 다음 결제일까지 프리미엄 혜택을 이용하실 수 있습니다."
      )
    ) {
      return;
    }

    try {
      // 목데이터 구독인지 확인
      const mockSubscription = localStorage.getItem("prome_subscription");
      const isMockSubscription = !!mockSubscription;

      if (isMockSubscription) {
        // 목데이터 구독 취소: 로컬스토리지에서 삭제
        localStorage.removeItem("prome_subscription");
        console.log("✅ 목데이터 구독 취소 완료");
        alert("구독이 취소되었습니다 ✅");

        // 구독 정보 다시 조회하여 UI 업데이트
        await fetchSubscription();
        // 전역 구독 정보도 새로고침
        if (refreshSubscription) {
          await refreshSubscription();
        }
        // 사용자 정보도 다시 조회 (isPremium 정보가 있을 수 있음)
        await fetchUserInfo();
        return;
      }

      // 실제 API 호출 (reason 필드 필수)
      console.log("📤 구독 취소 요청");
      const { data } = await api.post("/api/v1/payments/cancel", {
        reason: "사용자 요청에 의한 취소",
      });

      console.log("📥 구독 취소 응답:", data);
      alert(data.message || "구독이 취소되었습니다 ✅");

      // 구독 정보 다시 조회하여 UI 업데이트
      await fetchSubscription();
      // 전역 구독 정보도 새로고침
      if (refreshSubscription) {
        await refreshSubscription();
      }
      // 사용자 정보도 다시 조회 (isPremium 정보가 있을 수 있음)
      await fetchUserInfo();
    } catch (err) {
      console.error("❌ 구독 취소 실패:", err);
      console.error("❌ 응답 데이터:", err.response?.data);
      alert(err.response?.data?.message || "구독 취소 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchSubscription();
    fetchPosts();
    fetchComments();
    // 전역 구독 정보도 새로고침
    if (refreshSubscription) {
      refreshSubscription();
    }
  }, []);

  // ✅ 페이지 포커스 시 사용자 정보 다시 조회 (티켓 수 업데이트 반영)
  useEffect(() => {
    const handleFocus = () => {
      console.log("🔄 페이지 포커스 - 사용자 정보 재조회");
      fetchUserInfo();
    };
    
    // ✅ 티켓 업데이트 이벤트 리스너 추가
    const handleTicketsUpdated = (event) => {
      console.log("📢 티켓 업데이트 이벤트 수신:", event.detail);
      // 티켓이 업데이트되면 사용자 정보 다시 조회
      fetchUserInfo();
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("ticketsUpdated", handleTicketsUpdated);
    
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("ticketsUpdated", handleTicketsUpdated);
    };
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
                    <span>{userInfo.blueTickets ?? 0}</span>
                  </S.Ticket>
                  <S.Ticket>
                    <S.TicketIconGreen src={heartGreen} alt="그린 티켓" />
                    <span>{userInfo.greenTickets ?? 0}</span>
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
                {displaySubscription?.isPremium ? "PRO" : "FREE"}
              </S.ProBadge>
              {displaySubscription?.isPremium ? (
                <>
                  <S.SubscriptionText>
                    구독 만료일:{" "}
                    {displaySubscription?.subscriptionEndDate
                      ? new Date(
                          displaySubscription.subscriptionEndDate
                        ).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "-"}
                  </S.SubscriptionText>
                  <S.SubscriptionActions>
                    <S.CancelButton onClick={handleCancelSubscription}>
                      구독 취소
                    </S.CancelButton>
                  </S.SubscriptionActions>
                </>
              ) : (
                <>
                  <S.SubscriptionText>
                    프리미엄 플랜을 구독하여 모든 기능을 이용하세요.
                  </S.SubscriptionText>
                  <S.SubscriptionActions>
                    <S.SubscriptionButton
                      onClick={() => navigate("/pricing")}
                      style={{ backgroundColor: "#000", color: "#fff" }}
                    >
                      구독하기
                    </S.SubscriptionButton>
                  </S.SubscriptionActions>
                </>
              )}
            </S.SubscriptionBox>
          </S.FullSection>
        </S.Grid>
      </S.Container>
    </S.Page>
  );
}
