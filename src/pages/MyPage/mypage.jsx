import React from "react";
import * as S from "./mypage.styles";
import AvatarIcon from "@/assets/avatar.svg"; // ✅ 기존 방식으로 import (요금제 구매 코드 방식 동일)

export default function MyPage() {
  const myCreatedPosts = [
    { date: "2025.07.18", title: "AI 프롬프트 작성법 공유" },
    { date: "2025.07.19", title: "ChatGPT 활용 팁" },
  ];

  const myComments = [
    { date: "2025.07.20", content: "이 프롬프트 정말 유용하네요!" },
    { date: "2025.07.21", content: "예시가 추가되면 더 좋을 것 같아요!" },
  ];

  return (
    <S.Page>
      <S.Container>
        <S.Header>
          <S.Title>마이페이지</S.Title>
        </S.Header>

        <S.Grid>
          {/* 🔹 프로필 정보 */}
          <S.ProfileSection>
            <S.SectionTitle>프로필 정보</S.SectionTitle>
            <S.ProfileRow>
              <S.ProfileAvatarWrapper>
                <img src={AvatarIcon} alt="프로필 아이콘" />
              </S.ProfileAvatarWrapper>

              <S.ProfileInfo>
                <S.InfoLabel>이메일</S.InfoLabel>
                <S.Text>user@email.com</S.Text>
                <S.InfoLabel>가입일</S.InfoLabel>
                <S.Text>2024.03.12</S.Text>
              </S.ProfileInfo>
            </S.ProfileRow>
          </S.ProfileSection>

          {/* 🔹 계정 설정 */}
          <S.AccountSection>
            <S.SectionTitle>계정 설정</S.SectionTitle>

            <S.FormGroup>
              <S.FormRow>
                <S.InfoLabel>아이디</S.InfoLabel>
                <S.Input type="text" defaultValue="user123" />
                <S.DuplicateButton>중복 확인</S.DuplicateButton>
              </S.FormRow>

              <S.FormRow>
                <S.InfoLabel>닉네임</S.InfoLabel>
                <S.Input type="text" defaultValue="동재" />
                <S.DuplicateButton>중복 확인</S.DuplicateButton>
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

          {/* 🔹 내가 작성한 게시글 */}
          <S.PostsSection>
            <S.SectionTitle>내가 작성한 게시글</S.SectionTitle>
            <S.Table>
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>제목</th>
                  <th>수정</th>
                  <th>보기</th>
                </tr>
              </thead>
              <tbody>
                {myCreatedPosts.map((post, i) => (
                  <tr key={i}>
                    <td>{post.date}</td>
                    <td>{post.title}</td>
                    <td>
                      <S.ActionButton>수정</S.ActionButton>
                    </td>
                    <td>
                      <S.ActionButton>보기</S.ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </S.Table>
          </S.PostsSection>

          {/* 🔹 내가 단 댓글 */}
          <S.CommentsSection>
            <S.SectionTitle>내가 단 댓글</S.SectionTitle>
            <S.Table>
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>내용</th>
                  <th>수정</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {myComments.map((comment, i) => (
                  <tr key={i}>
                    <td>{comment.date}</td>
                    <td>{comment.content}</td>
                    <td>
                      <S.ActionButton>수정</S.ActionButton>
                    </td>
                    <td>
                      <S.ActionButton>삭제</S.ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </S.Table>
          </S.CommentsSection>

          {/* 🔹 구독 관리 */}
          <S.FullSection>
            <S.SectionTitle>구독 관리</S.SectionTitle>
            <S.SubscriptionBox>
              <S.ProBadge>PRO</S.ProBadge>
              <S.SubscriptionText>상태: 활성</S.SubscriptionText>
              <S.SubscriptionText>다음 결제일: 2025.04.11</S.SubscriptionText>
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
