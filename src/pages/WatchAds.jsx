import React from "react";
import styled from "styled-components";
import tvIcon from "@/assets/images/tv_image.svg";
import coupangImg from "@/assets/images/coupang.png";
import heartGreen from "@/assets/images/heart_green.svg";

const dummyAds = [
  { id: 1, title: "쿠팡 로켓프레시", img: coupangImg, reward: 2, remaining: 2 },
  { id: 2, title: "쿠팡 로켓배송", img: coupangImg, reward: 2, remaining: 1 },
  { id: 3, title: "쿠팡 WOW 멤버십", img: coupangImg, reward: 2, remaining: 0 },
  { id: 4, title: "네이버 쇼핑", img: coupangImg, reward: 2, remaining: 2 },
  {
    id: 5,
    title: "지마켓 스마일클럽",
    img: coupangImg,
    reward: 2,
    remaining: 1,
  },
  { id: 6, title: "마켓컬리 멤버십", img: coupangImg, reward: 2, remaining: 0 },
];

export default function WatchAds() {
  return (
    <PageWrapper>
      <Header>
        <HeaderTop>
          <Icon src={tvIcon} alt="TV 아이콘" />
          <Title>광고시청 페이지</Title>
        </HeaderTop>
        <SubText>광고 시청하고, 더 많은 프롬프트 열어보자!</SubText>
      </Header>

      <AdGrid>
        {dummyAds.map((ad) => (
          <AdCard key={ad.id}>
            <AdImage src={ad.img} alt={ad.title} />
            <AdContent>
              <AdTitle>{ad.title}</AdTitle>
              <AdInfo>
                <Reward>
                  <HeartIcon src={heartGreen} alt="하트 아이콘" />X {ad.reward}
                </Reward>
                <Remain>남은 횟수: {ad.remaining}/2</Remain>
              </AdInfo>
              <WatchButton disabled={ad.remaining === 0}>
                광고 시청하기
              </WatchButton>
            </AdContent>
          </AdCard>
        ))}
      </AdGrid>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f6f7f8;
  padding: 40px 16px 60px;
`;

const Header = styled.div`
  max-width: 1280px;
  margin: 0 auto 40px;
  text-align: left;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Icon = styled.img`
  width: 28px;
  height: 28px;
  object-fit: contain;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
`;

const SubText = styled.p`
  font-size: 17px;
  color: #6b6b6b;
  font-weight: 500;
  margin-top: 4px;
`;

const AdGrid = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
`;

const AdCard = styled.div`
  border: 2px solid #000;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 4px 4px 0 #000;
  }
`;

const AdImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: contain;
  border-bottom: 1px solid #000;
`;

const AdContent = styled.div`
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const AdTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const AdInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Reward = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: #000;
  gap: 4px;
`;

const HeartIcon = styled.img`
  width: 18px;
  height: 18px;
  object-fit: contain;
`;

const Remain = styled.span`
  font-size: 14px;
  color: #333;
`;

const WatchButton = styled.button`
  width: 100%;
  padding: 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #000;
  background-color: #fff;
  border: 2px solid #000;
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover:enabled {
    transform: translate(-1px, -1px);
    box-shadow: 2px 2px 0 #000;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
