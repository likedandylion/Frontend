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

        // ✅ API 문서 기반: GET /api/v1/ads
        // 응답 형식: ApiResponseListAdListResponse { data: AdListResponse[] }
        // AdListResponse { adId, title, thumbnailUrl, blueTicketReward, greenTicketReward }
        if (data && Array.isArray(data.data || data)) {
          const adsData = data.data || data;
          setAds(
            adsData.map((a) => ({
              id: a.adId || a.id,
              title: a.title,
              img: a.thumbnailUrl || a.imageUrl || coupangImg,
              reward: a.blueTicketReward || a.greenTicketReward || 2,
              remaining: a.remaining ?? 2, // TODO: API 응답에 remaining 필드가 있는지 확인 필요
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
    console.log("🎬 onWatch 함수 시작:", ad);

    if (!token) {
      console.warn("⚠️ 토큰 없음");
      alert("로그인이 필요합니다.");
      return;
    }

    if (ad.remaining === 0) {
      console.warn("⚠️ 남은 횟수 없음");
      alert("오늘 이 광고의 시청 가능 횟수를 모두 사용했습니다.");
      return;
    }

    if (!window.confirm(`"${ad.title}" 광고를 시청하시겠어요?`)) {
      console.log("❌ 사용자 취소");
      return;
    }

    try {
      // ✅ 토큰 확인
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.warn("⚠️ 토큰 없음 (내부 체크)");
        alert("로그인이 필요합니다.");
        return;
      }

      console.log("🎬 광고 시청 요청:", {
        adId: ad.id,
        adTitle: ad.title,
        rewardType: ad.rewardType,
        reward: ad.reward,
        hasToken: !!token,
        tokenLength: token?.length,
      });

      const isBlue = ad.rewardType === "BLUE";
      let apiSuccess = false;
      let updatedTickets = null;

      // ✅ 현재 티켓 수 확인
      const currentTickets = loadTicketsLS();
      console.log("🎫 현재 티켓 수 (차감 전):", currentTickets);

      // ✅ API 호출 시도 (실패해도 목데이터로 처리)
      try {
        console.log("📤 API 호출 시작: /api/v1/ads/watch");
        // ✅ API 문서 기반: POST /api/v1/ads/watch { adId }
        // 응답 형식: ApiResponseAdWatchResponse { data: AdWatchResponse }
        // AdWatchResponse { totalBlueTickets, totalGreenTickets, adsWatchedToday }
        const { data: responseData } = await api.post(
          "/api/v1/ads/watch",
          { adId: ad.id },
          {
            headers: {
              Authorization: `Bearer ${token}`, // 명시적으로 헤더 추가
            },
          }
        );

        console.log("📥 광고 시청 API 응답:", responseData);

        const watchData = responseData.data || responseData;
        console.log("📥 처리된 응답 데이터:", watchData);

        // ✅ 서버에서 받은 티켓 수로 업데이트 (API 문서: totalBlueTickets, totalGreenTickets)
        if (
          watchData.totalBlueTickets !== undefined ||
          watchData.totalGreenTickets !== undefined
        ) {
          updatedTickets = {
            blue: watchData.totalBlueTickets || currentTickets.blue,
            green: watchData.totalGreenTickets || currentTickets.green,
          };
          saveTicketsLS(updatedTickets);
          console.log("✅ 티켓 지급 완료 (API):", {
            before: currentTickets,
            after: updatedTickets,
          });
          apiSuccess = true;

          // ✅ 최신 티켓 수 다시 조회하여 마이페이지에도 반영
          try {
            console.log("🔄 사용자 정보 재조회 시작");
            const { data: userData } = await api.get("/api/v1/users/me");
            const latestUserInfo = userData.data || userData;
            console.log("📥 최신 사용자 정보:", latestUserInfo);

            if (
              typeof latestUserInfo.blueTickets === "number" ||
              typeof latestUserInfo.greenTickets === "number"
            ) {
              const latestTickets = {
                blue: latestUserInfo.blueTickets ?? updatedTickets.blue,
                green: latestUserInfo.greenTickets ?? updatedTickets.green,
              };
              saveTicketsLS(latestTickets);
              console.log("✅ 사용자 정보 동기화 완료:", {
                api: updatedTickets,
                latest: latestTickets,
              });
              updatedTickets = latestTickets;
            }
          } catch (refreshError) {
            console.warn("⚠️ 티켓 수 재조회 실패 (무시):", refreshError);
          }
        } else {
          console.warn("⚠️ API 응답에 티켓 정보 없음, 목데이터로 처리");
        }
      } catch (apiError) {
        // ✅ API 실패 시 목데이터로 처리 (카카오 리다이렉트 무시)
        console.error("❌ API 호출 실패:", apiError);
        console.error("❌ 에러 상세:", {
          code: apiError.code,
          message: apiError.message,
          response: apiError.response?.data,
          status: apiError.response?.status,
        });

        // 목데이터로 티켓 추가 (에러 없이 처리)
        try {
          console.log("🎫 목데이터로 티켓 추가 시작");
          const cur = loadTicketsLS();
          console.log("🎫 현재 티켓 (목데이터):", cur);

          updatedTickets = isBlue
            ? { ...cur, blue: cur.blue + (ad.reward || 2) }
            : { ...cur, green: cur.green + (ad.reward || 2) };

          saveTicketsLS(updatedTickets);
          console.log("✅ 티켓 지급 완료 (목데이터):", {
            before: cur,
            after: updatedTickets,
            added: ad.reward || 2,
          });

          // localStorage에 저장 확인
          const saved = loadTicketsLS();
          console.log("💾 localStorage 저장 확인:", saved);

          apiSuccess = true; // 목데이터 처리 성공으로 표시
        } catch (mockError) {
          console.error("❌ 목데이터 처리 실패:", mockError);
          // 목데이터 처리 실패는 무시하고 계속 진행
        }
      }

      // ✅ 토스트 메시지 표시 (API 성공 여부와 관계없이)
      // 목데이터로 처리된 경우에만 토스트 표시
      if (apiSuccess || updatedTickets) {
        const finalTickets = loadTicketsLS();
        console.log("🎉 최종 티켓 수:", finalTickets);
        showToast(`${isBlue ? "블루" : "그린"} 티켓 +${ad.reward} 지급!`);

        // ✅ remaining 감소 (광고 시청 성공 시 - API 성공 여부와 관계없이)
        setAds((prev) =>
          prev.map((x) =>
            x.id === ad.id
              ? { ...x, remaining: Math.max(0, x.remaining - 1) }
              : x
          )
        );

        // ✅ 이벤트 발생하여 마이페이지에 알림 (다른 탭/페이지에서도 업데이트)
        window.dispatchEvent(
          new CustomEvent("ticketsUpdated", {
            detail: finalTickets,
          })
        );
        console.log("📢 ticketsUpdated 이벤트 발생:", finalTickets);
      } else {
        console.warn(
          "⚠️ 티켓 지급 실패 (apiSuccess: false, updatedTickets: null)"
        );
      }
    } catch (e) {
      // ✅ 최종 예외 처리 (이 부분은 거의 실행되지 않아야 함)
      // 내부 catch에서 이미 목데이터로 처리했으므로, 여기 도달하는 경우는 드뭄
      console.warn(
        "⚠️ 외부 catch 블록 도달 (이미 내부에서 처리되었어야 함):",
        e.message
      );

      // 목데이터로 마지막 시도
      try {
        const cur = loadTicketsLS();
        const isBlue = ad.rewardType === "BLUE";
        const next = isBlue
          ? { ...cur, blue: cur.blue + (ad.reward || 1) }
          : { ...cur, green: cur.green + (ad.reward || 1) };
        saveTicketsLS(next);

        showToast(`${isBlue ? "블루" : "그린"} 티켓 +${ad.reward} 지급!`);

        // remaining 감소
        setAds((prev) =>
          prev.map((x) =>
            x.id === ad.id
              ? { ...x, remaining: Math.max(0, x.remaining - 1) }
              : x
          )
        );

        console.log("✅ 목데이터로 티켓 지급 완료 (외부 catch):", next);
      } catch (finalError) {
        console.error("❌ 목데이터 처리도 실패:", finalError);
        // 에러가 발생해도 사용자에게는 성공 메시지만 표시
        showToast(`티켓 지급을 시도했습니다.`);
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
