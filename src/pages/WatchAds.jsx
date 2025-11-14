import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import tvIcon from "@/assets/images/tv_image.svg";
import coupangImg from "@/assets/images/coupang.png"; // Fallback 이미지
import heartGreen from "@/assets/images/heart_green.svg";
import heartBlue from "@/assets/images/blue_heart.svg";
import api from "@/api/axiosInstance";

// 유튜브 URL을 embed(삽입형) URL로 변환하는 헬퍼 함수
const getEmbedUrl = (url) => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    let videoId = null;
    if (urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.split("/")[1];
    } else if (
      urlObj.hostname === "www.youtube.com" &&
      urlObj.pathname === "/watch"
    ) {
      videoId = urlObj.searchParams.get("v");
    }

    if (videoId) {
      // 자동 재생 및 음소거
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
    }
    return null;
  } catch (e) {
    console.error("Invalid video URL:", e);
    return null;
  }
};

export default function WatchAds() {
  const token = localStorage.getItem("accessToken");
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  // 모달 및 타이머 상태
  const [selectedAd, setSelectedAd] = useState(null); // 현재 시청 중인 광고
  const [timer, setTimer] = useState(0); // 타이머 (초)
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isRewardClaimable, setIsRewardClaimable] = useState(false);
  const timerRef = useRef(null); // 타이머 interval 참조

  // 30초 타이머 로직
  useEffect(() => {
    if (isTimerRunning) {
      setTimer(0);
      setIsRewardClaimable(false);

      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev + 1;
          if (newTime >= 30) {
            clearInterval(timerRef.current); // 30초 도달
            setIsTimerRunning(false);
            setIsRewardClaimable(true); // 보상 받기 버튼 활성화
          }
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current); // 타이머 중지
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  // ✅ 광고 목록 조회 (API 연동)
  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/api/v1/ads");

        // [수정] 백엔드 AdListResponse DTO와 정확하게 매핑합니다.
        if (data && Array.isArray(data.data)) {
          const adsData = data.data.map((a) => {
            // 1. 보상 타입 결정 (블루 티켓이 0보다 크면 블루)
            const isBlue = a.blueTicketReward > 0;

            return {
              id: a.adId,
              title: a.title,
              img: a.thumbnailUrl || coupangImg,
              videoUrl: a.videoUrl, // 백엔드에서 videoUrl을 가져옴

              // 2. 보상 수량 결정
              reward: isBlue ? a.blueTicketReward : a.greenTicketReward,

              remaining: a.remaining ?? 2, // 백엔드 스펙에 remaining이 없으면 2로 고정

              // 3. 보상 타입(아이콘 색상) 결정
              rewardType: isBlue ? "BLUE" : "GREEN",
            };
          });
          setAds(adsData);
        } else {
          setAds([]); // dummyAds 대신 빈 배열
        }
      } catch (e) {
        console.error("광고 목록 조회 실패:", e);
        setAds([]); // dummyAds 대신 빈 배열
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  // 모달 열기 (API 호출 X)
  const handleWatchClick = (ad) => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    // [수정] remaining이 0이면 "소진" 알림
    if (ad.remaining === 0) {
      alert("오늘의 보상 횟수를 모두 소진하셨습니다.");
      return;
    }

    const embedUrl = getEmbedUrl(ad.videoUrl);
    if (!ad.videoUrl || !embedUrl) {
      alert("광고 영상을 불러올 수 없습니다.");
      return;
    }

    // videoUrl을 embedUrl로 변환하여 모달에 전달
    setSelectedAd({ ...ad, embedUrl: embedUrl });
    setIsTimerRunning(true); // 타이머 시작
  };

  // 모달 닫기 (이탈 방지)
  const handleCloseModal = () => {
    if (isTimerRunning && timer < 30) {
      if (
        !window.confirm(
          "보상 지급 요건이 충족되지 않았습니다. 정말 나가시겠습니까?"
        )
      ) {
        return;
      }
    }
    setIsTimerRunning(false);
    setSelectedAd(null);
    setIsRewardClaimable(false);
    setTimer(0);
  };

  // '보상 받기' 버튼 (실제 API 호출)
  const handleClaimReward = async () => {
    if (!selectedAd) return;

    try {
      // 백엔드의 보상 지급 API 호출
      const { data } = await api.post(`/api/v1/ads/${selectedAd.id}/watch`);

      if (data && data.data) {
        const watchData = data.data;
        const isBlue = selectedAd.rewardType === "BLUE";
        showToast(
          data.message ||
            `${isBlue ? "블루" : "그린"} 티켓 +${selectedAd.reward} 지급!`
        );

        // [수정] 백엔드에서 설정한 횟수(999)를 가져오거나, 프론트에서 임시로 999로 설정
        const dailyLimit = 999; // ⬅️ 테스트용 횟수 (나중에 2로 변경)
        const watchedToday = watchData.adsWatchedToday;

        // UI 갱신 (남은 횟수 차감)
        setAds((prev) =>
          prev.map((x) => ({
            ...x,
            // (참고) 이 로직은 백엔드가 "오늘 총 시청 횟수"를 반환한다는 가정 하에,
            // 모든 광고 카드의 남은 횟수를 동일하게 갱신합니다.
            remaining: Math.max(0, dailyLimit - watchedToday),
          }))
        );

        handleCloseModal(); // 보상 후 모달 닫기
      } else {
        throw new Error("API 응답 형식이 올바르지 않습니다.");
      }
    } catch (e) {
      console.error("광고 시청 실패:", e);
      alert(e.response?.data?.message || "보상 지급 중 오류가 발생했습니다.");
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  };

  if (loading) return <div style={{ padding: 24 }}>로딩 중...</div>;

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
        {ads.map((ad) => (
          <AdCard key={ad.id}>
            <AdImage src={ad.img} alt={ad.title} />
            <AdContent>
              <AdTitle>{ad.title}</AdTitle>
              <AdInfo>
                <Reward>
                  {/* [수정] ad.rewardType에 따라 올바른 아이콘 표시 */}
                  <HeartIcon
                    src={ad.rewardType === "BLUE" ? heartBlue : heartGreen}
                    alt={ad.rewardType === "BLUE" ? "블루 티켓" : "그린 티켓"}
                  />
                  {/* [수정] ad.reward에 따라 올바른 수량 표시 */}X {ad.reward}
                </Reward>
                {/* [수정] 남은 횟수 (테스트용 999) */}
                <Remain>남은 횟수: {ad.remaining}/999</Remain>
              </AdInfo>
              <WatchButton
                disabled={ad.remaining === 0}
                onClick={() => handleWatchClick(ad)}
              >
                광고 시청하기
              </WatchButton>
            </AdContent>
          </AdCard>
        ))}
      </AdGrid>

      {toast && <Toast>{toast}</Toast>}

      {/* 광고 시청 모달 */}
      {selectedAd && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{selectedAd.title}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>×</CloseButton>
            </ModalHeader>
            <VideoWrapper>
              <iframe
                src={selectedAd.embedUrl} // 변환된 embedUrl 사용
                title={selectedAd.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </VideoWrapper>
            <ModalFooter>
              <TimerText>
                {isRewardClaimable
                  ? "시청 완료! 보상을 받아주세요."
                  : isTimerRunning
                  ? `보상까지 ${30 - timer}초 남았습니다...`
                  : "시청이 중지되었습니다."}
              </TimerText>
              <RewardButton
                disabled={!isRewardClaimable}
                onClick={handleClaimReward}
              >
                보상 받기
              </RewardButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
}

/* =========================
   💅 스타일 (모달 스타일 포함)
   ========================= */
const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
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
  border: 1.5px solid #000;
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

const Toast = styled.div`
  position: fixed;
  left: 50%;
  bottom: 36px;
  transform: translateX(-50%);
  padding: 10px 16px;
  background: #000;
  color: #fff;
  border-radius: 6px;
  font-size: 14px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 90vw;
  max-width: 800px;
  background-color: #fff;
  border: 2px solid #000;
  box-shadow: 4px 4px 0 #000;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #ddd;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #888;
  &:hover {
    color: #000;
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
  overflow: hidden;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-top: 1px solid #ddd;
`;

const TimerText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const RewardButton = styled.button`
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  background-color: #000;
  border: 1.5px solid #000;
  cursor: pointer;
  transition: all 0.15s ease;

  &:disabled {
    background-color: #aaa;
    border-color: #aaa;
    cursor: not-allowed;
  }

  &:hover:enabled {
    transform: translate(-1px, -1px);
    box-shadow: 2px 2px 0 #000;
  }
`;
