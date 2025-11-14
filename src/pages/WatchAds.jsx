import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import tvIcon from "@/assets/images/tv_image.svg";
import coupangImg from "@/assets/images/coupang.png";
import heartGreen from "@/assets/images/heart_green.svg";
import heartBlue from "@/assets/images/blue_heart.svg";
import api from "@/api/axiosInstance";

// [신규] 유튜브 URL을 embed URL로 변환하는 헬퍼 함수
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
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`; // 자동 재생
    }
    return null;
  } catch (e) {
    console.error("Invalid video URL:", e);
    return null;
  }
};

/* =========================
   📦 목데이터
   ========================= */
const dummyAds = [
  {
    id: 1,
    title: "쿠팡 로켓프레시",
    img: coupangImg,
    reward: 2,
    remaining: 2,
    rewardType: "BLUE",
  }, // ★ 추가
  {
    id: 2,
    title: "쿠팡 로켓배송",
    img: coupangImg,
    reward: 2,
    remaining: 1,
    rewardType: "GREEN",
  }, // ★ 추가
  {
    id: 3,
    title: "쿠팡 WOW 멤버십",
    img: coupangImg,
    reward: 2,
    remaining: 0,
    rewardType: "GREEN",
  }, // ★ 추가
  {
    id: 4,
    title: "네이버 쇼핑",
    img: coupangImg,
    reward: 2,
    remaining: 2,
    rewardType: "BLUE",
  }, // ★ 추가
  {
    id: 5,
    title: "지마켓 스마일클럽",
    img: coupangImg,
    reward: 2,
    remaining: 1,
    rewardType: "GREEN",
  }, // ★ 추가
  {
    id: 6,
    title: "마켓컬리 멤버십",
    img: coupangImg,
    reward: 2,
    remaining: 0,
    rewardType: "BLUE",
  }, // ★ 추가
];

/* =========================
   🎫 로컬 티켓 유틸 (목데이터용)
   - 그린/블루 모두 처리
   - 키: "prome_tickets"
   ========================= */
const TICKET_LS_KEY = "prome_tickets";
const loadTicketsLS = () => {
  try {
    const saved = localStorage.getItem(TICKET_LS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { blue: 20, green: 5 };
};
const saveTicketsLS = (t) => {
  try {
    localStorage.setItem(TICKET_LS_KEY, JSON.stringify(t));
  } catch {}
};

export default function WatchAds() {
  const token = localStorage.getItem("accessToken");
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  // [신규] 모달 및 타이머 상태
  const [selectedAd, setSelectedAd] = useState(null); // 현재 시청 중인 광고
  const [timer, setTimer] = useState(0); // 타이머 (초)
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isRewardClaimable, setIsRewardClaimable] = useState(false);
  const timerRef = useRef(null); // 타이머 interval 참조

  // [신규] 30초 타이머 로직
  useEffect(() => {
    if (isTimerRunning) {
      // 타이머 시작
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
    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  // ✅ 광고 목록 조회 API 연동
  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        // API 문서에 광고 엔드포인트가 없어서 목데이터 사용
        // 실제 API 연동 시: const { data } = await api.get("/api/v1/ads");
        const { data } = await api
          .get("/api/v1/ads")
          .catch(() => ({ data: null }));

        // ✅ API 문서 기반: GET /api/v1/ads
        // 응답 형식: ApiResponseListAdListResponse { data: AdListResponse[] }
        // AdListResponse { adId, title, thumbnailUrl, videoUrl, blueTicketReward, greenTicketReward }
        if (data && Array.isArray(data.data || data)) {
          const adsData = data.data || data;
          setAds(
            adsData.map((a) => {
              // ✅ 백엔드에서 blueTicketReward와 greenTicketReward를 구분해서 보내줌
              // blueTicketReward > 0이면 BLUE, greenTicketReward > 0이면 GREEN
              const isBlue = (a.blueTicketReward ?? 0) > 0;
              const isGreen = (a.greenTicketReward ?? 0) > 0;
              
              // 우선순위: BLUE > GREEN
              const rewardType = isBlue ? "BLUE" : isGreen ? "GREEN" : "GREEN";
              const reward = isBlue ? a.blueTicketReward : isGreen ? a.greenTicketReward : 0;
              
              return {
                id: a.adId || a.id,
                title: a.title,
                img: a.thumbnailUrl || a.imageUrl || coupangImg,
                videoUrl: a.videoUrl,
                reward: reward,
                remaining: a.remaining ?? 2,
                rewardType: rewardType,
              };
            })
          );
        } else {
          // API 없으면 목데이터 사용
          setAds(dummyAds);
        }
      } catch (e) {
        console.error("광고 목록 조회 실패:", e);
        // 실패 시 목데이터 fallback
        setAds(dummyAds);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  // [개발 모드] 광고 시청 제한 우회 플래그 (개발/테스트용)
  const isDevMode = import.meta.env.DEV || window.location.hostname === "localhost";
  const bypassLimit = localStorage.getItem("bypassAdLimit") === "true";

  // [수정] '광고 시청하기' 버튼 클릭 핸들러
  // (API 호출이 아닌, 모달 열기)
  const handleWatchClick = (ad) => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    
    // [개발 모드] 제한 우회 옵션 (개발/테스트용)
    // 우회 활성화 시 remaining 체크 완전히 스킵
    if (!(isDevMode && bypassLimit)) {
      // [요구사항 5] 이미 횟수를 다 썼는지 클라이언트단에서 먼저 확인
      if (ad.remaining === 0) {
        alert("오늘의 보상 횟수를 모두 소진하셨습니다.");
        return;
      }
    } else {
      console.log("🔓 개발 모드: 제한 우회 활성화 - remaining 체크 스킵");
    }

    if (!ad.videoUrl || !getEmbedUrl(ad.videoUrl)) {
      alert("광고 영상을 불러올 수 없습니다.");
      return;
    }

    setSelectedAd(ad); // 모달 열기
    setIsTimerRunning(true); // 타이머 시작
  };

  // [신규] 모달 닫기 핸들러 (요구사항 1: 이탈 방지)
  const handleCloseModal = () => {
    // 30초가 안됐고, 타이머가 돌고 있었다면
    if (isTimerRunning && timer < 30) {
      if (
        !window.confirm(
          "보상 지급 요건이 충족되지 않았습니다. 정말 나가시겠습니까?"
        )
      ) {
        return; // 나가지 않음
      }
    }
    // 30초가 지났거나, 나간다고 확인했거나, 이미 보상을 받은 경우
    setIsTimerRunning(false); // 타이머 중지
    setSelectedAd(null); // 모달 닫기
    setIsRewardClaimable(false); // 보상 버튼 초기화
    setTimer(0);
  };

  // [신규] '보상 받기' 버튼 클릭 핸들러
  // (실제 API 호출 + 티켓 연동)
  const handleClaimReward = async () => {
    if (!selectedAd) return;

    try {
      // ✅ API 문서 기반: POST /api/v1/ads/{adId}/watch
      console.log("🎬 광고 시청 API 호출:", {
        adId: selectedAd.id,
        bypassLimit: isDevMode && bypassLimit,
      });
      
      const { data } = await api.post(`/api/v1/ads/${selectedAd.id}/watch`);

      if (data && data.data) {
        const watchData = data.data; // AdWatchResponse
        const isBlue = selectedAd.rewardType === "BLUE";
        showToast(
          data.message ||
            `${isBlue ? "블루" : "그린"} 티켓 +${selectedAd.reward} 지급!`
        );

        const dailyLimit = 2; // 백엔드 로직과 일치
        const watchedToday = watchData.adsWatchedToday;

        // [요구사항 3] 광고 횟수 UI 갱신
        // [개발 모드] 우회 활성화 시 remaining을 강제로 2로 설정
        setAds((prev) =>
          prev.map((x) => ({
            ...x,
            remaining: isDevMode && bypassLimit 
              ? 2  // 개발 모드 우회 시 항상 2로 표시
              : Math.max(0, dailyLimit - watchedToday),
          }))
        );

        // ✅ 티켓 정보 갱신 (서버에서 관리하는 티켓 수 조회)
        try {
          const { data: userData } = await api.get("/api/v1/users/me");
          const latestUserInfo = userData.data || userData;
          
          // ✅ 티켓 업데이트 이벤트 발생 (다른 페이지에서도 티켓 수 갱신)
          if (
            typeof latestUserInfo.blueTickets === "number" ||
            typeof latestUserInfo.greenTickets === "number"
          ) {
            const updatedTickets = {
              blue: latestUserInfo.blueTickets ?? 0,
              green: latestUserInfo.greenTickets ?? 0,
            };
            
            // ✅ 티켓 업데이트 이벤트 발생하여 마이페이지 등 다른 페이지에도 알림
            window.dispatchEvent(
              new CustomEvent("ticketsUpdated", {
                detail: updatedTickets,
              })
            );
            console.log("📢 티켓 업데이트 이벤트 발생:", updatedTickets);
          }
        } catch (refreshError) {
          console.warn("⚠️ 티켓 수 재조회 실패 (무시):", refreshError);
        }
        
        // 보상 받은 후 모달 닫기
        handleCloseModal();

      } else {
        throw new Error("API 응답 형식이 올바르지 않습니다.");
      }
    } catch (e) {
      console.error("❌ 광고 시청 실패:", e);
      console.error("❌ 에러 상세:", {
        status: e.response?.status,
        message: e.response?.data?.message,
        data: e.response?.data,
      });
      
      // [개발 모드] 백엔드 제한 에러도 상세히 표시
      const errorMessage = e.response?.data?.message || "보상 지급 중 오류가 발생했습니다.";
      if (isDevMode && bypassLimit) {
        alert(`⚠️ 개발 모드: 백엔드에서도 제한이 걸렸습니다.\n\n에러: ${errorMessage}\n\n백엔드에서 개발 모드 제한을 해제해야 합니다.`);
      } else {
        alert(errorMessage);
      }
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
        {/* [개발 모드] 제한 우회 버튼 */}
        {isDevMode && (
          <DevModeNotice>
            💡 개발 모드: 광고 시청 제한 우회
            <BypassButton
              onClick={() => {
                if (bypassLimit) {
                  localStorage.removeItem('bypassAdLimit');
                  alert('제한 우회가 해제되었습니다. 페이지를 새로고침하세요.');
                } else {
                  localStorage.setItem('bypassAdLimit', 'true');
                  alert('제한 우회가 활성화되었습니다! 이제 광고를 시청할 수 있습니다.');
                }
                window.location.reload();
              }}
            >
              {bypassLimit ? '✅ 제한 우회 해제' : '🔓 제한 우회 활성화'}
            </BypassButton>
          </DevModeNotice>
        )}
      </Header>

      <AdGrid>
        {ads.map((ad) => (
          <AdCard key={ad.id}>
            <AdImage src={ad.img} alt={ad.title} />
            <AdContent>
              <AdTitle>{ad.title}</AdTitle>
              <AdInfo>
                <Reward>
                  <HeartIcon
                    src={ad.rewardType === "BLUE" ? heartBlue : heartGreen} // ★ 변경
                    alt="하트 아이콘"
                  />
                  X {ad.reward}
                </Reward>
                <Remain>남은 횟수: {ad.remaining}/2</Remain>
              </AdInfo>
              {/* [수정] onClick 핸들러 변경 */}
              {/* [개발 모드] 우회 활성화 시 버튼 비활성화 해제 */}
              <WatchButton
                disabled={ad.remaining === 0 && !(isDevMode && bypassLimit)}
                onClick={() => handleWatchClick(ad)} 
              >
                광고 시청하기
              </WatchButton>
            </AdContent>
          </AdCard>
        ))}
      </AdGrid>

      {toast && <Toast>{toast}</Toast>}

      {/* [신규] 광고 시청 모달 */}
      {selectedAd && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{selectedAd.title}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>×</CloseButton>
            </ModalHeader>
            <VideoWrapper>
              <iframe
                src={getEmbedUrl(selectedAd.videoUrl)}
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
              {/* [요구사항 2] 30초 후 활성화되는 보상 받기 버튼 */}
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
   💅 스타일 (그대로 사용)
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

const DevModeNotice = styled.div`
  margin-top: 12px;
  padding: 10px 14px;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 6px;
  font-size: 13px;
  color: #856404;
  line-height: 1.5;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BypassButton = styled.button`
  padding: 6px 12px;
  background-color: #ffc107;
  border: 1px solid #ff9800;
  border-radius: 4px;
  color: #856404;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #ff9800;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
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

/* =========================
   [신규] 🎬 모달 스타일
   ========================= */
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
