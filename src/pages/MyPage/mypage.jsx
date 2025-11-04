import React from "react";
import * as S from "./mypage.styles";

export default function MyPage() {
  const myPosts = [
    { date: "2023.07.18", title: "글 제목 예시입니다" },
    { date: "2023.07.18", title: "또 다른 글 제목 예시" },
  ];

  return (
    <S.Page role="main" aria-label="마이페이지">
      <S.Container>
        <S.Title>마이페이지</S.Title>

        {/* 프로필 */}
        <S.ProfileBox>
          <S.ProfileImage src="/profile.png" alt="프로필 이미지" />
          <S.ProfileInfo>
            <S.Name>동재</S.Name>
            <S.NicknameInput type="text" defaultValue="동재" />
          </S.ProfileInfo>
          <S.SaveButton type="button">저장</S.SaveButton>
        </S.ProfileBox>

        {/* 구독 관리 */}
        <S.Section>
          <S.SectionTitle>구독 관리</S.SectionTitle>
          <S.SubscriptionBox>
            <S.ProBadge>PRO</S.ProBadge>
            <S.SubscriptionText>상태: 활성</S.SubscriptionText>
            <S.SubscriptionText>다음 결제일: 2024.04.11</S.SubscriptionText>
            <S.SubscriptionActions>
              <S.SubscriptionButton>구독 상태 조회</S.SubscriptionButton>
              <S.CancelButton>구독 취소</S.CancelButton>
            </S.SubscriptionActions>
          </S.SubscriptionBox>
        </S.Section>

        {/* 계정 보안 */}
        <S.Section>
          <S.SectionTitle>계정 보안</S.SectionTitle>
          <S.SecurityButtons>
            <S.SecurityButton>닉네임 수정</S.SecurityButton>
            <S.SecurityButton>비밀번호 변경</S.SecurityButton>
          </S.SecurityButtons>
        </S.Section>

        {/* 내가 쓴 글 */}
        <S.Section>
          <S.SectionTitle>내가 쓴 글</S.SectionTitle>
          <S.Table>
            <thead>
              <tr>
                <th>날짜</th>
                <th>제목</th>
                <th>보기</th>
              </tr>
            </thead>
            <tbody>
              {myPosts.map((post, index) => (
                <tr key={index}>
                  <td>{post.date}</td>
                  <td>{post.title}</td>
                  <td>
                    <S.ViewButton>보기</S.ViewButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </S.Table>
        </S.Section>
      </S.Container>
    </S.Page>
  );
}
