import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";
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
  {
    id: 1,
    author: "남하원",
    authorId: 1,
    text: "유용한 프롬프트네요!",
    likes: 43,
  },
  {
    id: 2,
    author: "연주하",
    authorId: 3,
    text: "실제로 써보니 정말 편리해요.",
    likes: 43,
  },
  {
    id: 3,
    author: "배주원",
    authorId: 4,
    text: "블로그 글 쓸 때 도움 많이 됐어요.",
    likes: 43,
  },
  {
    id: 4,
    author: "박윤지",
    authorId: 5,
    text: "좋은 프롬프트 공유해주셔서 감사해요!",
    likes: 43,
  },
];

/* 🧩 모델 선택 버튼용 상수 */
const MODEL_KEYS = ["chatgpt", "gemini", "claude"];
const MODEL_LABELS = {
  chatgpt: "챗지피티",
  gemini: "제미나이",
  claude: "클로드",
};

export default function PromptDetail() {
  const { user: authUser } = useAuth() || {};
  const user = authUser || { id: 1, nickname: "테스트유저" };
  const { id } = useParams();
  const token = localStorage.getItem("accessToken");

  const [prompt, setPrompt] = useState(null);
  const [selectedModel, setSelectedModel] = useState("chatgpt"); // 🧩 추가: 모델 선택
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState(initialComments);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

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

  // ✅ 더미 데이터 (서버 없이 미리 표시)
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
      // 🧩 각 모델별 프롬프트 목데이터
      prompts: {
        chatgpt:
          "주어진 키워드에 맞춰 흥미로운 블로그 글 초안을 생성하세요.\n\nAI가 주제를 분석하고 관련 문장을 자동으로 구성합니다.",
        gemini: "Generate a creative blog outline based on given keywords.",
        claude: "키워드 기반으로 블로그 포스트의 서론을 작성해줘.",
      },
      // content는 chatgpt 기준 기본값
      content:
        "주어진 키워드에 맞춰 흥미로운 블로그 글 초안을 생성하세요.\n\nAI가 주제를 분석하고 관련 문장을 자동으로 구성합니다.",
    };

    const mapped = mapPromptData(data);
    setPrompt(mapped);
    setBookmarked(mapped.isBookmarked);
    setEditContent(mapped.content);
  }, [id]);

  // 🧩 실제 API 연동 버전 (👉 서버 열리면 이걸로 교체)
  /*
  useEffect(() => {
    const fetchPromptDetail = async () => {
      try {
        const res = await fetch(`/api/v1/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        const mapped = mapPromptData(data);

        setPrompt(mapped);
        setBookmarked(mapped.isBookmarked);
        setEditContent(mapped.content);
      } catch (error) {
        console.error("프롬프트 상세 조회 실패:", error);
      }
    };

    if (id) fetchPromptDetail();
  }, [id, token]);
  */

  // ✅ 해시(#comments) 이동 시 부드러운 스크롤
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#comments") {
      setTimeout(() => {
        const el = document.getElementById("comments");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, []);

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

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleBookmark = () => setBookmarked(prev => !prev);
  const toggleLike = () => setLiked(prev => !prev);

  // ✅ 게시글 수정 연동
  const handleSaveEdit = async () => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch(`/api/v1/posts/${prompt.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editContent }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null; // 서버에서 204 No Content일 경우 대비
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
  const handleCommentSubmit = () => {
    const text = commentInput.trim();
    if (!text) return;
    const newComment = {
      id: Date.now(),
      author: user.nickname,
      authorId: user.id,
      text,
      likes: 0,
    };
    setComments(prev => [newComment, ...prev]);
    setCommentInput("");
  };

  // ✅ 댓글 수정 연동
  const handleSaveCommentEdit = async commentId => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch(`/api/v1/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
        prev.map(c =>
          c.id === commentId ? { ...c, text: data?.text || editCommentText } : c
        )
      );
      setEditingCommentId(null);
      alert("✅ 댓글이 수정되었습니다!");
    } catch (error) {
      console.error("댓글 수정 오류:", error);
      alert("⚠️ 댓글 수정 중 오류가 발생했습니다.");
    }
  };

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
            {new Date(prompt.createdAt).toISOString().slice(0, 10)} -
            prompt.prome
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

            {/* 🧩 여기! 프롬프트 라벨 아래, 회색 박스 위에 모델 버튼 */}
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

      {/* ✅ 댓글 영역 복원 */}
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
          {comments.map(comment => (
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
                <CommentHeart src={heartSmall} alt="좋아요" />
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

const CommentHeart = styled.img`
  width: 18px;
  height: 18px;
`;

const CommentLikeCount = styled.span``;
