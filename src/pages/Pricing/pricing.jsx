import React, { useEffect, useState } from "react";
import * as S from "./pricing.styles";
import CheckIcon from "@/assets/Check.svg";
import XIcon from "@/assets/X.svg";

export default function Pricing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // ✅ 상품 목록 조회
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/v1/payments/products", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        let data = null;
        try {
          data = await res.json();
        } catch {
          data = null;
        }

        if (!res.ok || !Array.isArray(data)) {
          throw new Error("상품 정보가 올바르지 않습니다.");
        }

        setProducts(data);
      } catch (error) {
        console.warn("⚠️ 서버 미응답 - 더미 데이터 표시:", error);
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ 구독 결제 시뮬레이션
  const handleSubscribe = async (productId, productName) => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!window.confirm(`'${productName}' 플랜으로 구독하시겠습니까?`)) return;

    try {
      const res = await fetch("/api/v1/payments/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        const message = data?.message || "구독 결제 실패";
        alert(`❌ ${message}`);
        return;
      }

      alert(`✅ '${productName}' 플랜 결제가 완료되었습니다!`);
    } catch (error) {
      console.error("결제 시뮬레이션 오류:", error);
      alert(`✅ (테스트) '${productName}' 구독이 완료되었습니다.`);
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
                  <S.HighlightButton
                    onClick={() => handleSubscribe(p.id, p.name)}
                  >
                    시작하기
                  </S.HighlightButton>
                ) : (
                  <S.Button onClick={() => handleSubscribe(p.id, p.name)}>
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
                <S.HighlightButton
                  onClick={() => handleSubscribe(p.id, p.name)}
                >
                  시작하기
                </S.HighlightButton>
              ) : (
                <S.Button onClick={() => handleSubscribe(p.id, p.name)}>
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
