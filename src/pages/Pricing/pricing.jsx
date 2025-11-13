import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./pricing.styles";
import CheckIcon from "@/assets/Check.svg";
import XIcon from "@/assets/X.svg";
import api from "@/api/axiosInstance";
import { useAuth } from "@/features/auth/useAuth";

export default function Pricing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [paymentStep, setPaymentStep] = useState("info"); // "info", "processing", "complete"
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const navigate = useNavigate();
  const { refreshSubscription } = useAuth();
  const token = localStorage.getItem("accessToken");

  // ✅ 기본 더미 데이터 (서버 미동작 시 fallback)
  const fallbackProducts = [
    {
      id: 1,
      name: "무료",
      price: 0,
      features: [
        "기본 프롬프트 100개 이용",
        "카테고리별 검색",
        "커뮤니티 접근",
      ],
      limitations: ["프리미엄 프롬프트", "개인 라이브러리"],
    },
    {
      id: 2,
      name: "프로",
      price: 19000,
      highlight: true,
      features: [
        "모든 프롬프트 무제한 이용",
        "프리미엄 프롬프트 접근",
        "개인 라이브러리 생성",
        "우선 고객 지원",
        "새 프롬프트 우선 공개",
      ],
    },
    {
      id: 3,
      name: "팀",
      price: 49000,
      features: [
        "프로 플랜의 모든 기능",
        "팀 멤버 5명까지",
        "팀 라이브러리 공유",
        "사용 통계 및 분석",
        "전용 계정 매니저",
      ],
    },
  ];

  // ✅ 상품 목록 조회 (목데이터만 사용)
  // 실제 결제는 사업자등록증 없으면 불가하므로 목데이터로 처리
  useEffect(() => {
    setLoading(true);
    // 목데이터 사용 (실제 API 호출 없음)
    setTimeout(() => {
      setProducts(fallbackProducts);
      setLoading(false);
    }, 500); // 로딩 시뮬레이션
  }, []);

  // ✅ 결제 모달 열기
  const handleSubscribeClick = (product) => {
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (product.id === 1) {
      // 무료 플랜은 바로 처리
      handleSubscribe(product.id, product.name);
      return;
    }

    setSelectedProduct(product);
    setShowPaymentModal(true);
    setPaymentStep("info");
    setCardInfo({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
    });
  };

  // ✅ 카드 번호 포맷팅 (4자리마다 공백)
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.substring(0, 19); // 최대 16자리 + 공백 3개
  };

  // ✅ 만료일 포맷팅 (MM/YY)
  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  // ✅ 카드 정보 입력 핸들러
  const handleCardInfoChange = (field, value) => {
    if (field === "cardNumber") {
      setCardInfo({ ...cardInfo, [field]: formatCardNumber(value) });
    } else if (field === "expiryDate") {
      setCardInfo({ ...cardInfo, [field]: formatExpiryDate(value) });
    } else if (field === "cvv") {
      setCardInfo({
        ...cardInfo,
        [field]: value.replace(/\D/g, "").substring(0, 3),
      });
    } else {
      setCardInfo({ ...cardInfo, [field]: value });
    }
  };

  // ✅ 결제 진행
  const handlePayment = async () => {
    // 간단한 유효성 검사
    if (
      !cardInfo.cardNumber ||
      cardInfo.cardNumber.replace(/\s/g, "").length < 16
    ) {
      alert("카드 번호를 올바르게 입력해주세요.");
      return;
    }
    if (!cardInfo.expiryDate || cardInfo.expiryDate.length < 5) {
      alert("만료일을 올바르게 입력해주세요.");
      return;
    }
    if (!cardInfo.cvv || cardInfo.cvv.length < 3) {
      alert("CVV를 올바르게 입력해주세요.");
      return;
    }
    if (!cardInfo.cardholderName) {
      alert("카드 소유자 이름을 입력해주세요.");
      return;
    }

    setPaymentStep("processing");

    // 결제 진행 시뮬레이션 (2초 대기)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 결제 완료 처리
    await handleSubscribe(selectedProduct.id, selectedProduct.name);

    setPaymentStep("complete");

    // 2초 후 모달 닫기
    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentStep("info");
    }, 2000);
  };

  // ✅ 구독 결제 시뮬레이션 (목데이터)
  // 실제 결제는 사업자등록증 없으면 불가하므로 목데이터로 처리
  const handleSubscribe = async (productId, productName) => {
    try {
      console.log("📤 구독 시뮬레이션:", { productId, productName });

      // 목데이터로 구독 정보 생성 (프로 이상 플랜만)
      const isPremiumPlan = productId !== 1; // 1번은 무료 플랜

      if (isPremiumPlan) {
        // 목데이터 구독 정보 생성 (30일 후 만료)
        const subscriptionEndDate = new Date();
        subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);

        const mockSubscription = {
          isPremium: true,
          subscriptionEndDate: subscriptionEndDate.toISOString(),
        };

        // 로컬스토리지에 구독 정보 저장
        localStorage.setItem(
          "prome_subscription",
          JSON.stringify(mockSubscription)
        );

        console.log("✅ 목데이터 구독 정보 저장:", mockSubscription);
      }

      // 구독 정보 새로고침 (목데이터 반영)
      if (refreshSubscription) {
        await refreshSubscription();
      }

      // 완료 단계에서는 마이페이지로 이동하지 않고 모달에서 처리
      if (paymentStep !== "complete") {
        alert(
          `✅ '${productName}' 플랜 구독이 완료되었습니다!\n\n※ 현재는 목데이터로 시뮬레이션되었습니다.`
        );
        navigate("/mypage");
      }
    } catch (error) {
      console.error("❌ 구독 시뮬레이션 오류:", error);
      alert("구독 처리 중 오류가 발생했습니다.");
      setPaymentStep("info");
    }
  };

  const list = products.length ? products : fallbackProducts;

  // ✅ 로딩 중에도 더미 먼저 표시
  if (loading && products.length === 0) {
    return (
      <S.PageWrapper>
        <S.Container>
          <S.Title>요금제</S.Title>
          <S.Subtitle>당신의 필요에 맞는 플랜을 선택하세요</S.Subtitle>
          <S.PlanWrapper>
            {fallbackProducts.map((p) => (
              <S.PlanCard key={p.id} $highlight={p.highlight}>
                {p.highlight && <S.Badge>인기</S.Badge>}
                <S.PlanHeader>{p.name}</S.PlanHeader>
                <S.Price>
                  ₩{p.price.toLocaleString()}
                  <span>/월</span>
                </S.Price>
                <S.FeatureList>
                  {p.features.map((f, i) => (
                    <S.Feature key={`f-${i}`}>
                      <S.Icon src={CheckIcon} /> {f}
                    </S.Feature>
                  ))}
                  {p.limitations?.map((l, i) => (
                    <S.Feature key={`l-${i}`}>
                      <S.Icon src={XIcon} /> {l}
                    </S.Feature>
                  ))}
                </S.FeatureList>
                {p.highlight ? (
                  <S.HighlightButton onClick={() => handleSubscribeClick(p)}>
                    시작하기
                  </S.HighlightButton>
                ) : (
                  <S.Button onClick={() => handleSubscribeClick(p)}>
                    시작하기
                  </S.Button>
                )}
              </S.PlanCard>
            ))}
          </S.PlanWrapper>
        </S.Container>
      </S.PageWrapper>
    );
  }

  // ✅ 실제 데이터 or fallback 표시
  return (
    <S.PageWrapper>
      <S.Container>
        <S.Title>요금제</S.Title>
        <S.Subtitle>당신의 필요에 맞는 플랜을 선택하세요</S.Subtitle>

        <S.PlanWrapper>
          {list.map((p) => (
            <S.PlanCard key={p.id} $highlight={p.highlight}>
              {p.highlight && <S.Badge>인기</S.Badge>}
              <S.PlanHeader>{p.name}</S.PlanHeader>

              <S.Price>
                ₩{p.price.toLocaleString()}
                <span>/월</span>
              </S.Price>

              <S.FeatureList>
                {p.features?.map((f, i) => (
                  <S.Feature key={`f-${i}`}>
                    <S.Icon src={CheckIcon} /> {f}
                  </S.Feature>
                ))}
                {p.limitations?.map((l, i) => (
                  <S.Feature key={`l-${i}`}>
                    <S.Icon src={XIcon} /> {l}
                  </S.Feature>
                ))}
              </S.FeatureList>

              {p.highlight ? (
                <S.HighlightButton onClick={() => handleSubscribeClick(p)}>
                  시작하기
                </S.HighlightButton>
              ) : (
                <S.Button onClick={() => handleSubscribeClick(p)}>
                  시작하기
                </S.Button>
              )}
            </S.PlanCard>
          ))}
        </S.PlanWrapper>
      </S.Container>

      {/* 결제 시뮬레이션 모달 */}
      {showPaymentModal && selectedProduct && (
        <S.ModalOverlay
          onClick={() =>
            paymentStep !== "processing" && setShowPaymentModal(false)
          }
        >
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            {paymentStep === "info" && (
              <>
                <S.ModalHeader>
                  <S.ModalTitle>결제 정보</S.ModalTitle>
                  <S.CloseButton onClick={() => setShowPaymentModal(false)}>
                    ✕
                  </S.CloseButton>
                </S.ModalHeader>

                <S.PaymentInfo>
                  <S.PlanInfo>
                    <S.PlanName>{selectedProduct.name} 플랜</S.PlanName>
                    <S.PlanPrice>
                      ₩{selectedProduct.price.toLocaleString()}
                      <span>/월</span>
                    </S.PlanPrice>
                  </S.PlanInfo>
                </S.PaymentInfo>

                <S.CardForm>
                  <S.FormLabel>카드 번호</S.FormLabel>
                  <S.CardInput
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardInfo.cardNumber}
                    onChange={(e) =>
                      handleCardInfoChange("cardNumber", e.target.value)
                    }
                    maxLength={19}
                  />

                  <S.FormRow>
                    <S.FormGroup>
                      <S.FormLabel>만료일</S.FormLabel>
                      <S.CardInput
                        type="text"
                        placeholder="MM/YY"
                        value={cardInfo.expiryDate}
                        onChange={(e) =>
                          handleCardInfoChange("expiryDate", e.target.value)
                        }
                        maxLength={5}
                      />
                    </S.FormGroup>
                    <S.FormGroup>
                      <S.FormLabel>CVV</S.FormLabel>
                      <S.CardInput
                        type="text"
                        placeholder="123"
                        value={cardInfo.cvv}
                        onChange={(e) =>
                          handleCardInfoChange("cvv", e.target.value)
                        }
                        maxLength={3}
                      />
                    </S.FormGroup>
                  </S.FormRow>

                  <S.FormLabel>카드 소유자 이름</S.FormLabel>
                  <S.CardInput
                    type="text"
                    placeholder="홍길동"
                    value={cardInfo.cardholderName}
                    onChange={(e) =>
                      handleCardInfoChange("cardholderName", e.target.value)
                    }
                  />
                </S.CardForm>

                <S.ModalNote>
                  ※ 현재는 목데이터로 시뮬레이션됩니다. 실제 결제는 처리되지
                  않습니다.
                </S.ModalNote>

                <S.PaymentButton onClick={handlePayment}>
                  ₩{selectedProduct.price.toLocaleString()} 결제하기
                </S.PaymentButton>
              </>
            )}

            {paymentStep === "processing" && (
              <>
                <S.ProcessingContainer>
                  <S.Spinner />
                  <S.ProcessingText>결제 처리 중...</S.ProcessingText>
                  <S.ProcessingSubtext>잠시만 기다려주세요</S.ProcessingSubtext>
                </S.ProcessingContainer>
              </>
            )}

            {paymentStep === "complete" && (
              <>
                <S.CompleteContainer>
                  <S.CheckIcon>✓</S.CheckIcon>
                  <S.CompleteTitle>결제 완료!</S.CompleteTitle>
                  <S.CompleteText>
                    {selectedProduct.name} 플랜 구독이 완료되었습니다.
                  </S.CompleteText>
                  <S.CompleteSubtext>
                    마이페이지에서 구독 정보를 확인하실 수 있습니다.
                  </S.CompleteSubtext>
                </S.CompleteContainer>
              </>
            )}
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </S.PageWrapper>
  );
}
