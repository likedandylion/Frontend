import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";
import http from "@/shared/api/http"; // 🔹 나중에 API 연동할 때 쓸 친구
import heartBlack from "@/assets/images/heart_black.svg";
import heartSmall from "@/assets/images/heart_small.svg";
import personIcon from "@/assets/images/person.svg";
import eyeIcon from "@/assets/images/eye.svg";
import calenderIcon from "@/assets/images/calender.svg";
import starIcon from "@/assets/images/star_image.svg";
import starOutlineIcon from "@/assets/images/Star.svg";
import scanIcon from "@/assets/images/scan.svg";
import shareIcon from "@/assets/images/share.svg";

const initialComments = [
  { id: 1, author: "남하원", authorId: 1, text: "유용한 프롬프트네요!", likes: 43 },
  { id: 2, author: "연주하", authorId: 3, text: "실제로 써보니 정말 편리해요.", likes: 43 },
  { id: 3, author: "배주원", authorId: 4, text: "블로그 글 쓸 때 도움 많이 됐어요.", likes: 43 },
  { id: 4, author: "박윤지", authorId: 5, text: "좋은 프롬프트 공유해주셔서 감사해요!", likes: 43 },
];

/* 🧩 모델 선택 버튼용 상수 */
const MODEL_KEYS = ["chatgpt", "gemini", "claude"];
const MODEL_LABELS = { chatgpt: "ChatGPT", gemini: "Gemini", claude: "Claude" };


/* 🧩 댓글 데이터 매핑 함수 (댓글 목록 조회 API용)
   GET /api/v1/posts/{postId}/comments
   Response 예시:
   [
     { "commentId": 502, "author": "타마마", "content": "문장...", "createdAt": "...", "likes": 10 }
   ]
*/
const mapCommentData = raw => ({
  id: raw.commentId,
  author: raw.author,
  authorId: raw.authorId, // 명세에 있으면 매핑
  text: raw.content,
  likes: raw.likes ?? 0,
  createdAt: raw.createdAt,
  liked: raw.liked ?? false, // 명세에 있으면 사용
});

/* =========================
   🎫 티켓(목데이터) 유틸
   - 비구독자 기본치: blue=20, green=5
   - 로컬스토리지 키: "prome_tickets"
   ========================= */
const TICKET_LS_KEY = "prome_tickets";
const loadTicketsLS = () => {
  try {
    const saved = localStorage.getItem(TICKET_LS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { blue: 20, green: 5 }; // 기본치
};
const saveTicketsLS = t => {
  try {
    localStorage.setItem(TICKET_LS_KEY, JSON.stringify(t));
  } catch {}
};

export default function PromptDetail() {
  const { user: authUser } = useAuth() || {};
  const user = authUser || { id: 1, nickname: "테스트유저" };
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [prompt, setPrompt] = useState(null);
  const [selectedModel, setSelectedModel] = useState("chatgpt"); // 🧩 모델 선택
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState(
    initialComments.map(c => ({ ...c, liked: false }))
  );
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  // ✅ 마이페이지 연동: 사용자/구독/티켓
  const [userInfo, setUserInfo] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [tickets, setTickets] = useState(loadTicketsLS()); // 목데이터 기본

  const isSubscribed = !!subscription && subscription.status === "활성" && subscription.planName !== "FREE";

  const authHeaders = token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };

  // 🧩 API/목데이터 공통 매핑 함수
  const mapPromptData = data => ({
    id: data.id || data.postId,
    title: data.title,
    description: data.description || "",
    author: data.author,
    authorId: data.authorId,
    createdAt: data.createdAt,
    views: data.views ?? 0,
    likes: data.likes ?? 0,
    categories: data.categories || [],
    prompts: data.prompts || {}, // { chatgpt, gemini, claude }
    isBookmarked: data.isBookmarked ?? false,
    content:
      (data.prompts && data.prompts.chatgpt) ||
      data.content ||
      "",
  });

  // ✅ 더미 프롬프트
  useEffect(() => {
    const data = {
      id: Number(id) || 1,
      title: "창의적인 블로그 글 주제 생성기",
      description:
        "AI를 활용하여 아이디어, 글, 보고서를 자동 생성하는 프롬프트입니다.",
      author: "이유준",
      authorId: 1,
      createdAt: "2025-01-14T00:00:00.000Z",
      views: 1300,
      likes: 87,
      categories: ["생성형 AI", "글쓰기"],
      isBookmarked: false,
      prompts: {
        chatgpt:
          "주어진 키워드에 맞춰 흥미로운 블로그 글 초안을 생성하세요.\n\nAI가 주제를 분석하고 관련 문장을 자동으로 구성합니다.",
        gemini: "Generate a creative blog outline based on given keywords.",
        claude: "키워드 기반으로 블로그 포스트의 서론을 작성해줘.",
      },
      content:
        "주어진 키워드에 맞춰 흥미로운 블로그 글 초안을 생성하세요.\n\nAI가 주제를 분석하고 관련 문장을 자동으로 구성합니다.",
    };

    const mapped = mapPromptData(data);
    setPrompt(mapped);
    setBookmarked(mapped.isBookmarked);
    setEditContent(mapped.content);
  }, [id]);

  // 🧩 실제 프롬프트 조회 (서버 열리면 이걸로 교체)
  /*
  useEffect(() => {
    const fetchPromptDetail = async () => {
      try {
        const { data } = await http.get(`/api/v1/posts/${id}`, { headers: authHeaders });
        const mapped = mapPromptData(data);
        setPrompt(mapped);
        setBookmarked(mapped.isBookmarked);
        setEditContent(mapped.content);
      } catch (e) {
        console.error("프롬프트 상세 조회 실패:", e);
      }
    };
    if (id) fetchPromptDetail();
  }, [id, token]);
  */

  // ✅ 마이페이지와 동일한 API로 사용자/구독/티켓 조회
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const u = await fetch("/api/v1/users/me", { headers: authHeaders }).then(r => r.ok ? r.json() : null);
        if (u) {
          setUserInfo(u);
          // 서버 수치 존재하면 티켓 동기화
          if (typeof u.blueTickets === "number" || typeof u.greenTickets === "number") {
            const merged = {
              blue: typeof u.blueTickets === "number" ? u.blueTickets : tickets.blue,
              green: typeof u.greenTickets === "number" ? u.greenTickets : tickets.green,
            };
            setTickets(merged);
            saveTicketsLS(merged); // 로컬에도 반영
          }
        }
      } catch {}
      try {
        const s = await fetch("/api/v1/users/me/subscription", { headers: authHeaders }).then(r => r.ok ? r.json() : null);
        if (s) setSubscription(s);
      } catch {}
    };
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ✅ 댓글 목록 조회 (목데이터 유지)
  // 실제 API 연동 버전 ↓
  /*
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await http.get(`/api/v1/posts/${id}/comments`, { headers: authHeaders });
        setComments(data.map(mapCommentData));
      } catch (e) {
        console.error("댓글 목록 조회 실패:", e);
      }
    };
    if (id) fetchComments();
  }, [id, token]);
  */

  // ✅ 상세 진입 시 비구독자는 블루티켓 1 차감 (없으면 열람 차단)
  useEffect(() => {
    if (!prompt) return;
    if (isSubscribed) return;

    // ================================
    // 1) 목데이터 버전 (로컬스토리지)
    // ================================
    setTickets(prev => {
      if (prev.blue <= 0) {
        alert("블루 티켓이 모두 소진되어 열람할 수 없습니다.");
        navigate(-1);
        return prev;
      }
      const next = { ...prev, blue: prev.blue - 1 };
      saveTicketsLS(next);
      // 서버 값이 있던 사용자 화면에서도 보이도록 userInfo 모사
      if (userInfo) setUserInfo({ ...userInfo, blueTickets: next.blue });
      return next;
    });

    // ==========================================
    // 2) 실제 API 연동 버전 (서버와 설계 확정 후 주석 해제)
    //    예: POST /api/v1/tickets/consume { type: "BLUE", postId }
    // ==========================================
    /*
    (async () => {
      try {
        const { data } = await http.post(
          "/api/v1/tickets/consume",
          { type: "BLUE", postId: Number(id) },
          { headers: authHeaders }
        );
        // data 예시: { blueTickets: 19, greenTickets: 5, allowed: true }
        if (data.allowed === false || data.blueTickets <= 0) {
          alert("블루 티켓이 모두 소진되어 열람할 수 없습니다.");
          navigate(-1);
          return;
        }
        const next = { blue: data.blueTickets, green: data.greenTickets };
        setTickets(next);
      } catch (e) {
        console.error("블루 티켓 차감 실패:", e);
      }
    })();
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, isSubscribed]);

  if (!prompt) return <div>로딩 중...</div>;

  const isAuthor = user?.id === prompt.authorId;

  // 🧩 현재 선택된 모델 기준 프롬프트 내용
  const getCurrentContent = () => {
    if (!prompt) return "";
    if (prompt.prompts && prompt.prompts[selectedModel]) {
      return prompt.prompts[selectedModel];
    }
    return prompt.content || "";
  };

  // ================================
  // 1) 프롬프트 복사 - 목데이터 버전
  // ================================
  const handleCopy = () => {
    // 비구독자는 그린 티켓 필요
    if (!isSubscribed) {
      if (tickets.green <= 0) {
        alert("그린 티켓이 모두 소진되어 복사할 수 없습니다.");
        return;
      }
      const next = { ...tickets, green: tickets.green - 1 };
      setTickets(next);
      saveTicketsLS(next);
      if (userInfo) setUserInfo({ ...userInfo, greenTickets: next.green });
    }

    navigator.clipboard.writeText(getCurrentContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ==========================================
  // 2) 프롬프트 복사 - 실제 API 연동 버전
  //    (👉 서버 열리면 위 함수 대신 이걸로 교체)
  // ==========================================
  /*
  const handleCopy = async () => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 비구독자는 그린 티켓 차감
    try {
      if (!isSubscribed) {
        const { data: t } = await http.post(
          "/api/v1/tickets/consume",
          { type: "GREEN", postId: Number(id) },
          { headers: authHeaders }
        );
        if (t.allowed === false || t.greenTickets <= 0) {
          alert("그린 티켓이 모두 소진되어 복사할 수 없습니다.");
          return;
        }
        setTickets({ blue: t.blueTickets, green: t.greenTickets });
      }

      // 복사 기록/티켓 차감과 별도로, 실제 복사 API가 있으면 호출
      await http.post(`/api/v1/posts/${prompt.id}/copy`, null, { headers: authHeaders });

      navigator.clipboard.writeText(getCurrentContent());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("프롬프트 복사 실패:", error);
      alert("프롬프트 복사 중 오류가 발생했습니다.");
    }
  };
  */

  // ================================
  // 1) 좋아요 - 목데이터 버전 (포스트)
  // ================================
  const toggleLike = () => setLiked(prev => !prev);

  // ==========================================
  // 2) 좋아요 - 실제 API 연동 버전 (포스트)
  // ==========================================
  /*
  const toggleLike = async () => {
    if (!token) return alert("로그인이 필요합니다.");
    try {
      const { data } = await http.post(
        `/api/v1/posts/${prompt.id}/reaction`,
        null,
        { headers: authHeaders }
      );
      setLiked(data.liked);
      setPrompt(prev => (prev ? { ...prev, likes: data.likes } : prev));
    } catch (e) {
      console.error("좋아요 실패:", e);
    }
  };
  */

  // ================================
  // 1) 북마크 - 목데이터 버전
  // ================================
  const toggleBookmark = () => setBookmarked(prev => !prev);

  // ==========================================
  // 2) 북마크 - 실제 API 연동 버전
  // ==========================================
  /*
  const toggleBookmark = async () => {
    if (!token) return alert("로그인이 필요합니다.");
    try {
      const { data } = await http.post(
        `/api/v1/posts/${prompt.id}/bookmark`,
        null,
        { headers: authHeaders }
      );
      setBookmarked(data.isBookmarked);
    } catch (e) {
      console.error("북마크 실패:", e);
    }
  };
  */

  // ✅ 게시글 수정 연동 (기존 코드 유지)
  const handleSaveEdit = async () => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch(`/api/v1/posts/${prompt.id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ content: editContent }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null; // 204 No Content 대비
      }

      if (!res.ok) {
        const message = data?.message || "게시글 수정 실패";
        alert(`❌ ${message}`);
        return;
      }

      setPrompt(prev => ({ ...prev, content: data?.content || editContent }));
      setIsEditing(false);
      alert("✅ 게시글이 수정되었습니다!");
    } catch (error) {
      console.error("게시글 수정 오류:", error);
      alert("⚠️ 게시글 수정 중 오류가 발생했습니다.");
    }
  };

  // ✅ 댓글 작성
  const handleCommentChange = e => setCommentInput(e.target.value);

  // ================================
  // 1) 댓글 작성 - 목데이터 버전
  // ================================
  const handleCommentSubmit = () => {
    const text = commentInput.trim();
    if (!text) return;

    const newComment = {
      id: Date.now(),
      author: user.nickname,
      authorId: user.id,
      text,
      likes: 0,
      liked: false,
      createdAt: new Date().toISOString(),
    };

    setComments(prev => [newComment, ...prev]);
    setCommentInput("");
  };

  // ==========================================
  // 2) 댓글 작성 - 실제 API 연동 버전
  // ==========================================
  /*
  const handleCommentSubmit = async () => {
    const text = commentInput.trim();
    if (!text) return;
    if (!token) return alert("로그인이 필요합니다.");

    try {
      const { data } = await http.post(
        `/api/v1/posts/${prompt.id}/comments`,
        { content: text },
        { headers: authHeaders }
      );
      const newComment = {
        id: data.commentId,
        author: user.nickname,
        authorId: user.id,
        text,
        likes: 0,
        liked: false,
        createdAt: new Date().toISOString(),
      };
      setComments(prev => [newComment, ...prev]);
      setCommentInput("");
    } catch (e) {
      console.error("댓글 작성 실패:", e);
      alert("댓글 작성 중 오류가 발생했습니다.");
    }
  };
  */

  // ================================
  // 1) 댓글 좋아요 토글 - 목데이터 버전
  // ================================
  const handleToggleCommentLike = commentId => {
    setComments(prev =>
      prev.map(c =>
        c.id === commentId
          ? { ...c, liked: !c.liked, likes: c.likes + (c.liked ? -1 : 1) }
          : c
      )
    );
  };

  // ==========================================
  // 2) 댓글 좋아요 토글 - 실제 API 연동 버전
  //    POST /api/v1/comments/{commentId}/like
  // ==========================================
  /*
  const handleToggleCommentLike = async commentId => {
    if (!token) return alert("로그인이 필요합니다.");
    try {
      const { data } = await http.post(
        `/api/v1/comments/${commentId}/like`,
        null,
        { headers: authHeaders }
      );
      // data 예시: { liked: true, likes: 11 }
      setComments(prev =>
        prev.map(c => (c.id === commentId ? { ...c, liked: data.liked, likes: data.likes } : c))
      );
    } catch (e) {
      console.error("댓글 좋아요 실패:", e);
      alert("댓글 좋아요 처리 중 오류가 발생했습니다.");
    }
  };
  */

  // ✅ 댓글 수정 연동 (기존 코드 유지)
  const handleSaveCommentEdit = async commentId => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch(`/api/v1/comments/${commentId}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ text: editCommentText }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        const message = data?.message || "댓글 수정 실패";
        alert(`❌ ${message}`);
        return;
      }

      setComments(prev =>
        prev.map(c => (c.id === commentId ? { ...c, text: data?.text || editCommentText } : c))
      );
      setEditingCommentId(null);
      alert("✅ 댓글이 수정되었습니다!");
    } catch (error) {
      console.error("댓글 수정 오류:", error);
      alert("⚠️ 댓글 수정 중 오류가 발생했습니다.");
    }
  };

  // ✅ 댓글 정렬: 상위 2개(좋아요 기준) + 나머지 최신순
  const sortedByLikes = [...comments].sort((a, b) => b.likes - a.likes);
  const topComments = sortedByLikes.slice(0, 2);
  const topCommentIds = new Set(topComments.map(c => c.id));
  const restComments = comments
    .filter(c => !topCommentIds.has(c.id))
    .sort((a, b) => {
      // createdAt 있으면 시간 기준, 없으면 id 기준
      if (a.createdAt && b.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
      return b.id - a.id;
    });
  const orderedComments = [...topComments, ...restComments];

  return (
    <PageWrapper>
      <PromptCard>
        <CardTopBar>
          <Dots>
            <Dot />
            <Dot />
            <Dot />
          </Dots>
          <MetaText>
            {new Date(prompt.createdAt).toISOString().slice(0, 10)} - prompt.prome
          </MetaText>
        </CardTopBar>

        <CardBody>
          <CardTitle>{prompt.title}</CardTitle>
          <CardDescription>{prompt.description}</CardDescription>

          <CategoryRow>
            {prompt.categories.map(category => (
              <CategoryPill key={category}>{category}</CategoryPill>
            ))}
          </CategoryRow>

          <InfoBar>
            <MetaItem>
              <SmallIcon src={personIcon} alt="작성자" />
              {prompt.author}
            </MetaItem>
            <MetaItem>
              <SmallIcon src={calenderIcon} alt="작성일" />
              {new Date(prompt.createdAt).toLocaleDateString("ko-KR")}
            </MetaItem>
            <MetaItem>
              <SmallIcon src={eyeIcon} alt="조회수" />
              {prompt.views.toLocaleString("ko-KR")}
            </MetaItem>
            <MetaItem>
              <SmallIcon src={heartSmall} alt="좋아요 수" />
              {prompt.likes}
            </MetaItem>
          </InfoBar>

          <PromptBox>
            <PromptHeader>
              <PromptLabel>프롬프트</PromptLabel>

              <ActionButtons>
                {!isEditing && (
                  <>
                    <ActionButton type="button" onClick={handleCopy}>
                      <ButtonIcon src={scanIcon} alt="복사하기" />
                      <ButtonText>복사하기</ButtonText>
                    </ActionButton>
                    <ActionButton type="button">
                      <ButtonIcon src={shareIcon} alt="공유하기" />
                      <ButtonText>공유하기</ButtonText>
                    </ActionButton>
                  </>
                )}
                {isAuthor && !isEditing && (
                  <ActionButton type="button" onClick={() => setIsEditing(true)}>
                    ✏️ 수정하기
                  </ActionButton>
                )}
                {isAuthor && isEditing && (
                  <ActionButton type="button" onClick={handleSaveEdit}>
                    💾 저장하기
                  </ActionButton>
                )}
              </ActionButtons>
            </PromptHeader>

            {/* 🧩 프롬프트 라벨 아래, 회색 박스 위에 모델 버튼 */}
            <ModelToggleGroup>
              {MODEL_KEYS.map(key => (
                <ModelButton
                  key={key}
                  type="button"
                  $active={selectedModel === key}
                  onClick={() => setSelectedModel(key)}
                >
                  {MODEL_LABELS[key]}
                </ModelButton>
              ))}
            </ModelToggleGroup>

            {isEditing ? (
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                style={{
                  width: "100%",
                  height: "260px",
                  padding: "16px",
                  fontSize: "15px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  lineHeight: "1.6",
                }}
              />
            ) : (
              <PromptContent>{getCurrentContent()}</PromptContent>
            )}



            <BottomIcons>
              <Heart
                src={heartBlack}
                alt="좋아요"
                $active={liked}
                onClick={toggleLike}
              />
              <Star
                src={bookmarked ? starIcon : starOutlineIcon}
                alt="북마크"
                onClick={toggleBookmark}
              />
            </BottomIcons>
          </PromptBox>
        </CardBody>

        {copied && <CopyAlert>복사되었습니다!</CopyAlert>}
      </PromptCard>

      {/* ✅ 댓글 영역 */}
      <CommentsContainer id="comments">
        <CommentInputRow>
          <CommentInput
            placeholder="댓글을 입력하세요."
            value={commentInput}
            onChange={handleCommentChange}
            onKeyDown={e => {
              if (e.key === "Enter") handleCommentSubmit();
            }}
          />
          <CommentSubmitButton type="button" onClick={handleCommentSubmit}>
            작성
          </CommentSubmitButton>
        </CommentInputRow>

        <CommentsList>
          {orderedComments.map(comment => (
            <CommentItem key={comment.id}>
              <CommentLeft>
                <Avatar />
                <CommentTextBox>
                  <CommentAuthor>{comment.author}</CommentAuthor>
                  {editingCommentId === comment.id ? (
                    <textarea
                      value={editCommentText}
                      onChange={e => setEditCommentText(e.target.value)}
                      style={{
                        width: "100%",
                        height: "80px",
                        padding: "10px",
                        fontSize: "15px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                      }}
                    />
                  ) : (
                    <CommentText>{comment.text}</CommentText>
                  )}
                </CommentTextBox>
              </CommentLeft>

              <CommentLike>
                {user.id === comment.authorId &&
                  (editingCommentId === comment.id ? (
                    <ActionButton
                      type="button"
                      onClick={() => handleSaveCommentEdit(comment.id)}
                    >
                      저장
                    </ActionButton>
                  ) : (
                    <ActionButton
                      type="button"
                      onClick={() => {
                        setEditingCommentId(comment.id);
                        setEditCommentText(comment.text);
                      }}
                    >
                      수정
                    </ActionButton>
                  ))}
                <CommentHeart
                  src={heartBlack}
                  alt="좋아요"
                  $active={comment.liked}
                  onClick={() => handleToggleCommentLike(comment.id)}
                />
                <CommentLikeCount>{comment.likes}</CommentLikeCount>
              </CommentLike>
            </CommentItem>
          ))}
        </CommentsList>
      </CommentsContainer>
    </PageWrapper>
  );
}



/* ✅ 스타일들은 그대로 유지 + 모델 버튼만 추가 */

const PageWrapper = styled.div`
  min-height: 80vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 0 90px;
  gap: 36px;
`;

const PromptCard = styled.article`
  border: 2px solid #000000;
  background-color: #ffffff;
  width: 840px;
  max-width: 100%;
  box-sizing: border-box;
`;

const CardTopBar = styled.div`
  height: 36px;
  background-color: #000000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
`;

const Dots = styled.div`
  display: flex;
  gap: 6px;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background-color: #555555;
`;

const MetaText = styled.div`
  font-size: 12px;
  color: #ffffff;
`;

const CardBody = styled.div`
  padding: 36px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CardTitle = styled.h1`
  font-size: 26px;
  font-weight: 700;
`;

const CardDescription = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #333;
`;

const CategoryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 4px;
`;

const CategoryPill = styled.span`
  padding: 8px 14px;
  border-radius: 6px;
  background-color: #f1f1f3;
  font-size: 14px;
  color: #333333; // ← 더 진하게
  font-weight: 600;
  border: 1px solid #d0d0d5;
`;

const InfoBar = styled.div`
  margin-top: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  background-color: #f7f7f9;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #777;
`;

const SmallIcon = styled.img`
  width: 18px;
  height: 18px;
`;

const PromptBox = styled.div`
  border: 2px solid #000;
  background-color: #fff;
  padding: 28px 24px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
`;

const PromptHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PromptLabel = styled.h2`
  font-size: 19px;
  font-weight: 700;
`;

/* 🧩 모델 토글 스타일 */
const ModelToggleGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  margin-bottom: 4px;
`;

const ModelButton = styled.button`
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? "#000000" : "#d0d0d5")};
  background-color: ${({ $active }) => ($active ? "#000000" : "#f8f8fa")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#555555")};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid #d0d0d5;
  background-color: #f8f8fa;
  font-size: 13px;
  cursor: pointer;
  outline: none;
  transition: background-color 0.15s ease, transform 0.15s ease;

  &:hover {
    background-color: #f0f0f4;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ButtonIcon = styled.img`
  width: 15px;
  height: 15px;
`;

const ButtonText = styled.span`
  line-height: 1;
`;

const PromptContent = styled.div`
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 24px;
  font-size: 16px;
  color: #333;
  line-height: 1.8;
  white-space: pre-line;
  margin: 20px 0;
  min-height: 230px;
`;

const BottomIcons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 18px;
`;

const Star = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: transform 0.25s ease;
  &:hover {
    transform: scale(1.08);
  }
`;

const Heart = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
  filter: ${({ $active }) =>
    $active
      ? "invert(19%) sepia(100%) saturate(7486%) hue-rotate(355deg) brightness(96%) contrast(105%)"
      : "invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)"};
  transition: all 0.25s ease;
`;

const CopyAlert = styled.div`
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #000;
  color: #fff;
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  animation: fadeInOut 2s forwards;

  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translateX(-50%) translateY(10px);
    }
    10% {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    90% {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateX(-50%) translateY(10px);
    }
  }
`;

const CommentsContainer = styled.section`
  width: 840px;
  max-width: 100%;
  background-color: #f7f7f9;
  border-radius: 14px;
  padding: 26px 28px 34px;
  box-sizing: border-box;
`;

const CommentInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const CommentInput = styled.input`
  flex: 1;
  height: 52px;
  border-radius: 8px;
  border: 1px solid #dedee2;
  padding: 0 16px;
  font-size: 16px;
  box-sizing: border-box;

  &::placeholder {
    color: #aaa;
  }
`;

const CommentSubmitButton = styled.button`
  padding: 0 20px;
  height: 52px;
  border-radius: 8px;
  border: none;
  background-color: #000;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.15s ease;

  &:hover {
    background-color: #333;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 43px;
`;

const CommentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CommentLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const Avatar = styled.div`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background-color: #d9d9de;
`;

const CommentTextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CommentAuthor = styled.div`
  font-size: 17px;
  font-weight: 600;
  color: #222;
`;

const CommentText = styled.div`
  font-size: 16px;
  color: #555;
`;

const CommentLike = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 20px;
  color: #444;
`;

const CommentHeart = styled(Heart)`
  width: 22px;
  height: 22px;
`;

const BottomNote = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: #777;
`;


const CommentLikeCount = styled.span``;
