import React, { useEffect, useState } from "react";
import styled from "styled-components";
import tvIcon from "@/assets/images/tv_image.svg";
import coupangImg from "@/assets/images/coupang.png";
import heartGreen from "@/assets/images/heart_green.svg";
import heartBlue from "@/assets/images/blue_heart.svg";
import api from "@/api/axiosInstance";

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

        if (data && Array.isArray(data.data || data)) {
          const adsData = data.data || data;
          setAds(
            adsData.map((a) => ({
              id: a.adId || a.id,
              title: a.title,
              img: a.thumbnailUrl || a.imageUrl || coupangImg,
              reward:
                a.blueTicketReward || a.greenTicketReward || a.reward || 2,
              remaining: a.remaining ?? 2,
              rewardType: a.blueTicketReward
                ? "BLUE"
                : a.greenTicketReward
                ? "GREEN"
                : "GREEN",
            }))
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

  // ✅ 광고 시청 API 연동
  const onWatch = async (ad) => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (ad.remaining === 0) {
      alert("오늘 이 광고의 시청 가능 횟수를 모두 사용했습니다.");
      return;
    }

    if (!window.confirm(`"${ad.title}" 광고를 시청하시겠어요?`)) return;

    try {
      // API 문서에 광고 시청 엔드포인트가 없어서 목데이터로 처리
      // 실제 API 연동 시: const { data } = await api.post("/api/v1/ads/watch", { adId: ad.id });
      const response = await api
        .post("/api/v1/ads/watch", { adId: ad.id })
        .catch(() => null);

      if (response && response.data) {
        const watchData = response.data.data || response.data;
        const isBlue = ad.rewardType === "BLUE";
        showToast(
          watchData.message ||
            `${isBlue ? "블루" : "그린"} 티켓 +${ad.reward} 지급!`
        );
        // 서버에서 티켓 수량 업데이트
        if (
          watchData.totalBlueTickets !== undefined ||
          watchData.totalGreenTickets !== undefined
        ) {
          // 티켓 정보 업데이트 (마이페이지에서 다시 조회)
        }
      } else {
        // 목데이터 처리
        const cur = loadTicketsLS();
        const isBlue = ad.rewardType === "BLUE";
        const next = isBlue
          ? { ...cur, blue: cur.blue + (ad.reward || 1) }
          : { ...cur, green: cur.green + (ad.reward || 1) };
        saveTicketsLS(next);
        showToast(`${isBlue ? "블루" : "그린"} 티켓 +${ad.reward} 지급!`);
      }

      // remaining 감소
      setAds((prev) =>
        prev.map((x) =>
          x.id === ad.id ? { ...x, remaining: Math.max(0, x.remaining - 1) } : x
        )
      );
    } catch (e) {
      console.error("광고 시청 실패:", e);
      alert("보상 지급 중 오류가 발생했습니다.");
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
                  <HeartIcon
                    src={ad.rewardType === "BLUE" ? heartBlue : heartGreen} // ★ 변경
                    alt="하트 아이콘"
                  />
                  X {ad.reward}
                </Reward>
                <Remain>남은 횟수: {ad.remaining}/2</Remain>
              </AdInfo>
              <WatchButton
                disabled={ad.remaining === 0}
                onClick={() => onWatch(ad)}
              >
                광고 시청하기
              </WatchButton>
            </AdContent>
          </AdCard>
        ))}
      </AdGrid>

      {toast && <Toast>{toast}</Toast>}
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
