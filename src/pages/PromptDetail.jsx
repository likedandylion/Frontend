import React, { useState, useEffect } from "react";
import styled from "styled-components";
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
  { id: 1, author: "남하원", text: "유용한 프롬프트네요!", likes: 43 },
  { id: 2, author: "연주하", text: "실제로 써보니 정말 편리해요.", likes: 43 },
  { id: 3, author: "배주원", text: "블로그 글 쓸 때 도움 많이 됐어요.", likes: 43 },
  { id: 4, author: "박윤지", text: "좋은 프롬프트 공유해주셔서 감사해요!", likes: 43 },
];

export default function PromptDetail() {
  const [prompt, setPrompt] = useState(null);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState(initialComments);

  useEffect(() => {
    const data = {
      id: 1,
      title: "창의적인 블로그 글 주제 생성기",
      description:
        "AI를 활용하여 아이디어, 글, 분석 보고서를 자동으로 생성해주는 프롬프트입니다.",
      author: "이유준",
      createdAt: "2025-01-14T00:00:00.000Z",
      views: 1300,
      likes: 87,
      content:
        "주어진 키워드에 맞춰 흥미로운 블로그 글 초안을 생성하세요.\n\nAI가 주제를 분석하고 관련 문장을 자동으로 구성합니다.",
      categories: ["생성형 AI", "글쓰기"],
      isBookmarked: false,
    };
    setPrompt(data);
    setBookmarked(data.isBookmarked);
  }, []);

  const handleCopy = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleBookmark = () => setBookmarked(prev => !prev);
  const toggleLike = () => setLiked(prev => !prev);

  const handleCommentChange = e => setCommentInput(e.target.value);

  const handleCommentSubmit = () => {
    const text = commentInput.trim();
    if (!text) return;

    const newComment = {
      id: Date.now(),
      author: "나",
      text,
      likes: 0,
    };

    setComments(prev => [newComment, ...prev]);
    setCommentInput("");
  };

  if (!prompt) return null;

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
                <ActionButton type="button" onClick={handleCopy}>
                  <ButtonIcon src={scanIcon} alt="복사하기" />
                  <ButtonText>복사하기</ButtonText>
                </ActionButton>
                <ActionButton type="button">
                  <ButtonIcon src={shareIcon} alt="공유하기" />
                  <ButtonText>공유하기</ButtonText>
                </ActionButton>
              </ActionButtons>
            </PromptHeader>

            <PromptContent>{prompt.content}</PromptContent>

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

      <CommentsContainer>
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
                  <CommentText>{comment.text}</CommentText>
                </CommentTextBox>
              </CommentLeft>
              <CommentLike>
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
