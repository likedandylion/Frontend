import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";
import api from "@/api/axiosInstance"; // ✅ axiosInstance 사용
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
  {
    id: 1,
    author: "남하원",
    authorId: 1,
    text: "유용한 프롬프트네요!",
    likes: 43,
  },
  {
    id: 2,
    author: "연주하",
    authorId: 3,
    text: "실제로 써보니 정말 편리해요.",
    likes: 43,
  },
  {
    id: 3,
    author: "배주원",
    authorId: 4,
    text: "블로그 글 쓸 때 도움 많이 됐어요.",
    likes: 43,
  },
  {
    id: 4,
    author: "박윤지",
    authorId: 5,
    text: "좋은 프롬프트 공유해주셔서 감사해요!",
    likes: 43,
  },
];

/* 🧩 모델 선택 버튼용 상수 */
const MODEL_KEYS = ["chatgpt", "gemini", "claude"];
const MODEL_LABELS = { chatgpt: "ChatGPT", gemini: "Gemini", claude: "Claude" };

/* 🧩 프리미엄 프롬프트 목업 데이터 (백엔드 없이 표시) */
const PREMIUM_PROMPT_IDS = Array.from({ length: 18 }, (_, i) => i + 1); // 1~18
const PREMIUM_PROMPT_TITLES = [
  "창의적인 블로그 글 주제 생성기",
  "마케팅 카피라이팅 도우미",
  "스터디 플래너 자동 생성",
  "데이터 분석 리포트 작성기",
  "창업 아이디어 브레인스토밍",
  "고객 피드백 요약기",
  "학습 계획표 생성기",
  "면접 질문 시뮬레이터",
  "이메일 답장 생성기",
  "논문 초록 요약 도구",
  "SNS 콘텐츠 기획",
  "뉴스레터 문장 교정기",
  "코드 리뷰 보조 AI",
  "프레젠테이션 개요 작성기",
  "업무 보고서 자동 생성",
  "여행 일정표 추천",
  "브랜드 슬로건 생성기",
  "제품 리뷰 요약 도구",
];

// 프리미엄 프롬프트별 상세 내용 (제목과 일치하는 구체적인 프롬프트)
const PREMIUM_PROMPT_CONTENTS = {
  chatgpt: [
    "당신은 창의적인 블로그 글 주제 생성 전문가입니다. 사용자의 관심사, 목표 독자, 그리고 블로그의 톤앤매너를 분석하여 매력적이고 검색 최적화된 블로그 글 주제를 생성해주세요. 각 주제는 구체적이고 실행 가능하며, 독자의 관심을 끌 수 있어야 합니다.",
    "당신은 마케팅 카피라이팅 전문가입니다. 제품이나 서비스의 핵심 가치를 파악하고, 타겟 고객의 니즈와 감성을 자극하는 설득력 있는 마케팅 카피를 작성해주세요. AIDA 원칙(주의-관심-욕구-행동)을 활용하여 고객의 행동을 유도하는 카피를 만들어주세요.",
    "당신은 스터디 플래너 자동 생성 전문가입니다. 학습 목표, 기간, 난이도, 그리고 학습자의 스타일을 고려하여 체계적이고 실현 가능한 스터디 플랜을 생성해주세요. 각 단계별 목표, 학습 시간, 복습 주기, 그리고 평가 방법을 포함한 상세한 계획을 제공해주세요.",
    "당신은 데이터 분석 리포트 작성 전문가입니다. 제공된 데이터를 분석하여 인사이트를 도출하고, 비즈니스 의사결정에 도움이 되는 명확하고 구조화된 리포트를 작성해주세요. 데이터 시각화 제안, 트렌드 분석, 그리고 실행 가능한 권장사항을 포함해주세요.",
    "당신은 창업 아이디어 브레인스토밍 전문가입니다. 시장 트렌드, 사용자 니즈, 그리고 비즈니스 모델을 분석하여 혁신적이고 실행 가능한 창업 아이디어를 제안해주세요. 각 아이디어에 대해 시장성, 경쟁력, 그리고 수익 모델을 포함한 상세한 분석을 제공해주세요.",
    "당신은 고객 피드백 요약 전문가입니다. 다양한 채널에서 수집된 고객 피드백을 분석하여 핵심 이슈, 긍정적 피드백, 개선 사항을 체계적으로 요약해주세요. 우선순위가 높은 개선 사항과 즉시 대응이 필요한 이슈를 명확히 구분하여 제시해주세요.",
    "당신은 학습 계획표 생성 전문가입니다. 학습자의 현재 수준, 목표, 그리고 제약사항을 고려하여 단계별 학습 계획표를 생성해주세요. 각 단계의 학습 내용, 예상 소요 시간, 평가 방법, 그리고 다음 단계로의 연결을 포함한 상세한 계획을 제공해주세요.",
    "당신은 면접 질문 시뮬레이터 전문가입니다. 지원 직무와 회사의 특성을 분석하여 실제 면접에서 나올 수 있는 질문들을 생성하고, 각 질문에 대한 모범 답변을 제공해주세요. STAR 방법론(상황-과제-행동-결과)을 활용한 답변 구조를 제안해주세요.",
    "당신은 이메일 답장 생성 전문가입니다. 받은 이메일의 내용, 톤, 그리고 맥락을 분석하여 적절하고 전문적인 답장을 작성해주세요. 상황에 맞는 인사말, 본문 구조, 그리고 마무리 인사를 포함하여 완성도 높은 이메일을 생성해주세요.",
    "당신은 논문 초록 요약 전문가입니다. 긴 논문이나 연구 자료를 분석하여 핵심 내용을 간결하고 명확하게 요약한 초록을 작성해주세요. 연구 목적, 방법, 주요 결과, 그리고 결론을 포함하여 학술적 정확성을 유지하면서도 이해하기 쉽게 작성해주세요.",
    "당신은 SNS 콘텐츠 기획 전문가입니다. 브랜드의 정체성, 타겟 오디언스, 그리고 SNS 플랫폼의 특성을 고려하여 참여도가 높은 SNS 콘텐츠를 기획해주세요. 해시태그 제안, 게시 시간 추천, 그리고 콘텐츠 캘린더까지 포함한 종합적인 기획안을 제공해주세요.",
    "당신은 뉴스레터 문장 교정 전문가입니다. 작성된 뉴스레터의 문장을 검토하여 가독성, 명확성, 그리고 전문성을 높이는 교정을 해주세요. 문법 오류 수정, 어조 조정, 그리고 구조 개선을 통해 독자에게 더 잘 전달되는 뉴스레터로 만들어주세요.",
    "당신은 코드 리뷰 보조 AI 전문가입니다. 제공된 코드를 분석하여 버그, 성능 이슈, 보안 취약점, 그리고 코드 품질 개선 사항을 찾아주세요. 각 이슈에 대해 구체적인 설명과 개선 방안을 제시하고, 베스트 프랙티스를 제안해주세요.",
    "당신은 프레젠테이션 개요 작성 전문가입니다. 프레젠테이션의 목적, 대상, 그리고 핵심 메시지를 바탕으로 논리적이고 설득력 있는 프레젠테이션 개요를 작성해주세요. 도입부, 본문 구조, 그리고 결론을 포함하여 청중의 관심을 끌고 메시지를 효과적으로 전달할 수 있는 구조를 제안해주세요.",
    "당신은 업무 보고서 자동 생성 전문가입니다. 제공된 업무 내용과 데이터를 분석하여 체계적이고 전문적인 업무 보고서를 작성해주세요. 실행 사항, 성과 지표, 이슈 및 해결 방안, 그리고 향후 계획을 포함하여 의사결정에 도움이 되는 보고서를 생성해주세요.",
    "당신은 여행 일정표 추천 전문가입니다. 여행 목적지, 기간, 예산, 그리고 여행자의 선호도를 고려하여 최적화된 여행 일정표를 생성해주세요. 관광지, 맛집, 숙소 추천, 이동 경로, 그리고 예상 비용을 포함한 상세한 일정을 제공해주세요.",
    "당신은 브랜드 슬로건 생성 전문가입니다. 브랜드의 핵심 가치, 타겟 고객, 그리고 차별화 포인트를 분석하여 기억에 남고 감성을 자극하는 브랜드 슬로건을 생성해주세요. 여러 옵션을 제시하고 각 슬로건의 의미와 효과를 설명해주세요.",
    "당신은 제품 리뷰 요약 도구 전문가입니다. 다양한 플랫폼에서 수집된 제품 리뷰를 분석하여 긍정적/부정적 피드백, 주요 특징, 그리고 개선 사항을 체계적으로 요약해주세요. 통계적 인사이트와 함께 구매 결정에 도움이 되는 종합적인 리뷰 요약을 제공해주세요.",
  ],
  gemini: [
    "당신은 창의적인 블로그 글 주제 생성 전문가입니다. 트렌드 분석과 키워드 연구를 통해 검색 최적화된 블로그 주제를 제안해주세요. 각 주제는 독자의 문제를 해결하거나 가치를 제공할 수 있어야 하며, SEO 친화적으로 작성해주세요.",
    "당신은 마케팅 카피라이팅 전문가입니다. 제품의 고유한 가치를 강조하고, 감성적이고 논리적인 접근으로 고객의 구매 욕구를 자극하는 카피를 작성해주세요. 다양한 톤앤매너로 여러 버전의 카피를 제안해주세요.",
    "당신은 스터디 플래너 자동 생성 전문가입니다. 학습자의 목표와 현실적인 시간 제약을 고려하여 단계별 학습 로드맵을 생성해주세요. 각 단계의 마일스톤과 성취 기준을 명확히 하고, 동기부여 요소를 포함해주세요.",
    "당신은 데이터 분석 리포트 작성 전문가입니다. 데이터에서 패턴과 트렌드를 발견하여 비즈니스 인사이트로 변환해주세요. 시각화 제안과 함께 실행 가능한 액션 아이템을 포함한 리포트를 작성해주세요.",
    "당신은 창업 아이디어 브레인스토밍 전문가입니다. 미래 시장 트렌드와 기술 발전을 고려하여 혁신적인 창업 아이디어를 제안해주세요. 각 아이디어의 시장 잠재력, 경쟁 우위, 그리고 실행 전략을 분석해주세요.",
    "당신은 고객 피드백 요약 전문가입니다. 정성적/정량적 피드백을 분석하여 제품/서비스 개선을 위한 핵심 인사이트를 도출해주세요. 긍정적 요소와 개선점을 명확히 구분하여 우선순위를 제시해주세요.",
    "당신은 학습 계획표 생성 전문가입니다. 학습자의 학습 스타일과 목표를 고려하여 맞춤형 학습 계획을 생성해주세요. 주기적 복습과 평가를 포함하여 장기 기억을 강화하는 계획을 만들어주세요.",
    "당신은 면접 질문 시뮬레이터 전문가입니다. 직무별 핵심 역량을 평가할 수 있는 질문을 생성하고, 모범 답변 가이드를 제공해주세요. 행동 기반 질문과 상황 기반 질문을 포함하여 실전 면접을 대비할 수 있도록 해주세요.",
    "당신은 이메일 답장 생성 전문가입니다. 받은 이메일의 맥락과 목적을 파악하여 적절한 톤과 형식으로 답장을 작성해주세요. 상황에 맞는 공손함과 전문성을 유지하면서도 친근하게 소통할 수 있는 답장을 만들어주세요.",
    "당신은 논문 초록 요약 전문가입니다. 복잡한 연구 내용을 간결하고 명확하게 요약하여 핵심을 전달해주세요. 연구의 중요성과 기여도를 강조하면서도 일반인도 이해할 수 있도록 작성해주세요.",
    "당신은 SNS 콘텐츠 기획 전문가입니다. 각 플랫폼의 특성에 맞는 콘텐츠 전략을 수립하고, 참여도를 높일 수 있는 콘텐츠 아이디어를 제안해주세요. 트렌드와 브랜드 정체성을 균형있게 조화시켜주세요.",
    "당신은 뉴스레터 문장 교정 전문가입니다. 문장의 흐름과 가독성을 개선하여 독자가 쉽게 이해할 수 있도록 교정해주세요. 전문 용어의 적절한 사용과 문맥에 맞는 어조 조정을 해주세요.",
    "당신은 코드 리뷰 보조 AI 전문가입니다. 코드의 구조, 성능, 보안을 종합적으로 검토하여 개선 사항을 제안해주세요. 코드 가독성과 유지보수성을 높이는 리팩토링 제안을 포함해주세요.",
    "당신은 프레젠테이션 개요 작성 전문가입니다. 청중의 관심을 끌고 핵심 메시지를 효과적으로 전달할 수 있는 프레젠테이션 구조를 설계해주세요. 스토리텔링 기법을 활용하여 기억에 남는 프레젠테이션을 만들어주세요.",
    "당신은 업무 보고서 자동 생성 전문가입니다. 업무 성과와 데이터를 분석하여 의사결정권자가 빠르게 이해할 수 있는 보고서를 작성해주세요. 핵심 지표와 시각화를 활용하여 명확하고 설득력 있는 보고서를 만들어주세요.",
    "당신은 여행 일정표 추천 전문가입니다. 여행자의 선호도와 제약사항을 고려하여 최적의 여행 경로와 일정을 제안해주세요. 현지 문화와 특색을 반영한 맞춤형 여행 계획을 제공해주세요.",
    "당신은 브랜드 슬로건 생성 전문가입니다. 브랜드의 정체성과 차별화 포인트를 간결하고 강렬하게 표현하는 슬로건을 생성해주세요. 감성적 공감과 기억력을 동시에 자극하는 슬로건을 제안해주세요.",
    "당신은 제품 리뷰 요약 도구 전문가입니다. 다수의 리뷰를 분석하여 제품의 강점과 약점을 객관적으로 요약해주세요. 구매 결정에 도움이 되는 실용적인 인사이트를 제공해주세요.",
  ],
  claude: [
    "당신은 창의적인 블로그 글 주제 생성 전문가입니다. 사용자의 니치와 목표 독자를 깊이 이해하여 검색 가능성과 독자 가치를 모두 고려한 주제를 생성해주세요. 각 주제는 구체적이고 실행 가능하며, 장기적으로 SEO 가치를 가져야 합니다.",
    "당신은 마케팅 카피라이팅 전문가입니다. 심리학적 원칙과 설득 기법을 활용하여 고객의 마음을 움직이는 카피를 작성해주세요. 제품의 기능적 가치와 감성적 가치를 균형있게 전달하면서도 행동을 유도하는 명확한 CTA를 포함해주세요.",
    "당신은 스터디 플래너 자동 생성 전문가입니다. 인지과학 원리를 바탕으로 효율적인 학습 계획을 수립해주세요. 간격 반복, 능동 회상, 그리고 메타인지 전략을 포함하여 학습 효과를 극대화하는 계획을 만들어주세요.",
    "당신은 데이터 분석 리포트 작성 전문가입니다. 통계적 유의성과 실용적 의미를 모두 고려하여 데이터에서 인사이트를 도출해주세요. 가설 검증, 원인 분석, 그리고 예측 모델링을 포함한 심층 분석 리포트를 작성해주세요.",
    "당신은 창업 아이디어 브레인스토밍 전문가입니다. 시스템적 사고와 디자인 씽킹을 활용하여 지속 가능한 비즈니스 모델을 가진 창업 아이디어를 제안해주세요. 시장 검증 방법과 MVP 전략을 포함한 실행 계획을 함께 제시해주세요.",
    "당신은 고객 피드백 요약 전문가입니다. 정성적 분석과 정량적 분석을 결합하여 고객 경험의 전반적인 그림을 그려주세요. 감정 분석과 주제 모델링을 활용하여 숨겨진 인사이트를 발견하고 우선순위화된 개선 제안을 제공해주세요.",
    "당신은 학습 계획표 생성 전문가입니다. 개인의 인지적 특성과 학습 목표를 고려하여 맞춤형 학습 경로를 설계해주세요. 마이크로러닝과 스파이럴 커리큘럼을 활용하여 점진적이고 지속 가능한 학습 계획을 만들어주세요.",
    "당신은 면접 질문 시뮬레이터 전문가입니다. 직무 역량 모델과 STAR 기법을 기반으로 포괄적인 면접 준비 가이드를 제공해주세요. 다양한 시나리오와 난이도별 질문을 포함하여 실전 대비를 완벽하게 해주세요.",
    "당신은 이메일 답장 생성 전문가입니다. 비즈니스 에티켓과 커뮤니케이션 원칙을 준수하여 상황에 맞는 전문적인 답장을 작성해주세요. 명확성, 간결성, 그리고 적절한 톤을 유지하면서도 관계 구축에 도움이 되는 답장을 만들어주세요.",
    "당신은 논문 초록 요약 전문가입니다. 학술적 정확성과 접근성을 모두 고려하여 복잡한 연구를 명확하게 요약해주세요. 연구의 방법론적 강점과 기여도를 강조하면서도 일반 독자도 이해할 수 있도록 작성해주세요.",
    "당신은 SNS 콘텐츠 기획 전문가입니다. 알고리즘 이해와 콘텐츠 전략을 결합하여 각 플랫폼에 최적화된 콘텐츠를 기획해주세요. 트렌드 분석과 브랜드 일관성을 유지하면서도 참여도를 높일 수 있는 콘텐츠 캘린더를 제공해주세요.",
    "당신은 뉴스레터 문장 교정 전문가입니다. 스타일 가이드와 가독성 원칙을 적용하여 전문적이고 매력적인 뉴스레터로 개선해주세요. 문장 구조, 어휘 선택, 그리고 전체적인 흐름을 최적화하여 독자 경험을 향상시켜주세요.",
    "당신은 코드 리뷰 보조 AI 전문가입니다. 소프트웨어 엔지니어링 원칙과 보안 모범 사례를 기반으로 코드 품질을 종합적으로 평가해주세요. 아키텍처 패턴, 디자인 원칙, 그리고 성능 최적화 관점에서 개선 제안을 제공해주세요.",
    "당신은 프레젠테이션 개요 작성 전문가입니다. 설득의 과학과 스토리텔링 기법을 활용하여 청중의 마음을 사로잡는 프레젠테이션 구조를 설계해주세요. 논리적 흐름과 감성적 공감을 모두 고려하여 기억에 남는 프레젠테이션을 만들어주세요.",
    "당신은 업무 보고서 자동 생성 전문가입니다. 비즈니스 인텔리전스 원칙을 적용하여 의사결정에 실질적으로 도움이 되는 보고서를 작성해주세요. 핵심 성과 지표, 트렌드 분석, 그리고 전략적 권장사항을 포함한 실행 가능한 인사이트를 제공해주세요.",
    "당신은 여행 일정표 추천 전문가입니다. 여행자의 선호도, 예산, 그리고 시간 제약을 최적화 알고리즘으로 분석하여 최적의 여행 경로를 제안해주세요. 현지 문화, 계절성, 그리고 실용적 정보를 종합하여 완벽한 여행 경험을 설계해주세요.",
    "당신은 브랜드 슬로건 생성 전문가입니다. 브랜드 전략과 마케팅 심리학을 결합하여 강력한 브랜드 정체성을 표현하는 슬로건을 생성해주세요. 언어학적 매력과 감성적 공감을 모두 갖춘 기억에 남는 슬로건을 제안해주세요.",
    "당신은 제품 리뷰 요약 도구 전문가입니다. 자연어 처리와 감정 분석을 활용하여 대규모 리뷰 데이터에서 패턴과 인사이트를 도출해주세요. 객관적 통계와 주관적 경험을 균형있게 요약하여 구매 결정에 실질적으로 도움이 되는 정보를 제공해주세요.",
  ],
};

// 프리미엄 프롬프트 목업 데이터 생성 함수
const getPremiumMockPrompt = (promptId) => {
  const index = parseInt(promptId) - 1;
  if (index < 0 || index >= PREMIUM_PROMPT_TITLES.length) return null;

  const title = PREMIUM_PROMPT_TITLES[index];
  const description = `AI를 활용하여 ${title.toLowerCase()}를 위한 프리미엄 전용 프롬프트입니다.`;

  return {
    postId: promptId,
    id: promptId,
    title: title,
    description: description,
    content: description,
    prompts: {
      chatgpt:
        PREMIUM_PROMPT_CONTENTS.chatgpt[index] ||
        `당신은 ${title} 전문가입니다. 사용자의 요구사항을 분석하여 최적의 결과를 제공해주세요.`,
      gemini:
        PREMIUM_PROMPT_CONTENTS.gemini[index] ||
        `당신은 ${title} 전문가입니다. 창의적이고 실용적인 솔루션을 제시해주세요.`,
      claude:
        PREMIUM_PROMPT_CONTENTS.claude[index] ||
        `당신은 ${title} 전문가입니다. 상세하고 정확한 분석을 제공해주세요.`,
    },
    authorId: 1,
    author: "프리미엄",
    views: Math.floor(Math.random() * 1000) + 100,
    likes: Math.floor(Math.random() * 50) + 10,
    liked: false,
    isBookmarked: false,
    createdAt: "2025-01-14T00:00:00.000Z",
    category: "프리미엄",
    tags: ["프리미엄", "AI"],
  };
};

/* 🧩 댓글 데이터 매핑 함수 (댓글 목록 조회 API용)
   GET /api/v1/posts/{postId}/comments
   Response 예시:
   [
     { "commentId": 502, "author": "타마마", "content": "문장...", "createdAt": "...", "likes": 10 }
   ]
*/
const mapCommentData = (raw) => ({
  id: raw.commentId,
  author: raw.author,
  authorId: raw.authorId, // 명세에 있으면 매핑
  text: raw.content,
  likes: raw.likes ?? 0,
  createdAt: raw.createdAt,
  liked: raw.liked ?? false, // 명세에 있으면 사용
});

/* =========================
   🎫 티켓(목데이터) 유틸
   - 비구독자 기본치: blue=20, green=5
   - 로컬스토리지 키: "prome_tickets"
   ========================= */
const TICKET_LS_KEY = "prome_tickets";
const loadTicketsLS = () => {
  try {
    const saved = localStorage.getItem(TICKET_LS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { blue: 20, green: 5 }; // 기본치
};
const saveTicketsLS = (t) => {
  try {
    localStorage.setItem(TICKET_LS_KEY, JSON.stringify(t));
  } catch {}
};

export default function PromptDetail() {
  const { user: authUser, subscription: authSubscription } = useAuth() || {};
  const user =
    authUser && authUser.id ? authUser : { id: 1, nickname: "테스트유저" };
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [prompt, setPrompt] = useState(null);
  const [selectedModel, setSelectedModel] = useState("chatgpt"); // 🧩 모델 선택
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState(
    initialComments.map((c) => ({ ...c, liked: false }))
  );
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  // ✅ 마이페이지 연동: 사용자/구독/티켓
  const [userInfo, setUserInfo] = useState(null);
  const [subscription, setSubscription] = useState(authSubscription || null);
  const [tickets, setTickets] = useState(loadTicketsLS()); // 목데이터 기본

  // ✅ 구독 상태 확인 (API 스펙: isPremium boolean) - AuthProvider와 로컬 상태 모두 확인
  const isSubscribed =
    subscription?.isPremium === true || authSubscription?.isPremium === true;

  // 디버깅: 구독 상태 로그
  useEffect(() => {
    console.log("🔍 구독 상태 체크:", {
      "subscription?.isPremium": subscription?.isPremium,
      "authSubscription?.isPremium": authSubscription?.isPremium,
      isSubscribed: isSubscribed,
      subscription: subscription,
      authSubscription: authSubscription,
    });
  }, [subscription, authSubscription, isSubscribed]);

  // ✅ 프롬프트 조회 중복 실행 방지
  const hasFetchedPrompt = useRef(false);
  const fetchedPromptId = useRef(null);

  const authHeaders = token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };

  // 🧩 API/목데이터 공통 매핑 함수
  const mapPromptData = (apiData) => {
    const data = apiData.data || apiData;
    const prompts = {};

    // prompts가 객체 형식인 경우 (curl 명령어 참고: { chatgpt: "...", gemini: "...", claude: "..." })
    if (
      data.prompts &&
      typeof data.prompts === "object" &&
      !Array.isArray(data.prompts)
    ) {
      prompts.chatgpt = data.prompts.chatgpt || "";
      prompts.gemini = data.prompts.gemini || "";
      prompts.claude = data.prompts.claude || "";
    }
    // prompts가 배열 형식인 경우 (하위 호환성)
    else if (data.prompts && Array.isArray(data.prompts)) {
      data.prompts.forEach((p) => {
        const type = p.type?.toLowerCase();
        if (type === "gpt") prompts.chatgpt = p.content;
        else if (type === "gemini") prompts.gemini = p.content;
        else if (type === "claude") prompts.claude = p.content;
      });
    }

    // content 필드도 확인 (등록 시 content 사용)
    const description = data.description || data.content || "";

    // authorId 찾기 - 모든 가능한 필드명 확인
    const possibleAuthorIds = [
      data.authorId,
      data.userId,
      data.creatorId,
      data.writerId,
      data.author?.id,
      data.author?.userId,
      data.author?.user?.id,
      data.user?.id,
      data.createdBy,
      data.writer?.id,
    ].filter((id) => id !== null && id !== undefined);

    console.log("🔍 mapPromptData - 가능한 authorId들:", {
      "data.authorId": data.authorId,
      "data.userId": data.userId,
      "data.creatorId": data.creatorId,
      "data.author": data.author,
      "data.author?.id": data.author?.id,
      possibleAuthorIds,
      "전체 data": data,
    });

    const authorId = possibleAuthorIds[0] || null;

    return {
      id: data.postId || data.id,
      title: data.title || "",
      description: description,
      author:
        data.author ||
        data.authorName ||
        data.writer ||
        data.user?.nickname ||
        data.user?.username ||
        "",
      authorId: authorId,
      createdAt: data.createdAt || data.createdDate || "",
      views: data.views ?? data.viewCount ?? 0,
      likes: data.likes ?? data.likeCount ?? 0,
      categories: data.categories || (data.category ? [data.category] : []),
      tags: data.tags || [],
      prompts: prompts,
      isBookmarked: data.isBookmarked ?? false,
      liked: data.liked ?? false,
      content:
        prompts.chatgpt || prompts.gemini || prompts.claude || description,
    };
  };

  // ✅ 실제 프롬프트 조회 API 연동 (GET /api/v1/posts/{id})
  // (백엔드에서 블루 티켓 차감 로직 실행)
  useEffect(() => {
    // ✅ 중복 실행 방지: 같은 프롬프트 ID는 한 번만 조회
    if (!id) return;
    if (hasFetchedPrompt.current && fetchedPromptId.current === id) {
      console.log("⚠️ 이미 조회한 프롬프트입니다. 중복 조회 방지:", id);
      return;
    }

    const fetchPromptDetail = async () => {
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      // ✅ 구독 상태 먼저 확인 (프리미엄 회원은 티켓 차감 안 됨)
      let currentSubscription = subscription || authSubscription;
      let isPremiumUser = false;

      if (!currentSubscription) {
        // ✅ 계정별 구독 정보 확인 (localStorage)
        const currentUser = localStorage.getItem("user");
        let userId = null;
        if (currentUser) {
          try {
            const parsedUser = JSON.parse(currentUser);
            userId = parsedUser.id || parsedUser.userId;
          } catch (e) {
            console.warn("사용자 정보 파싱 실패:", e);
          }
        }
        const subscriptionKey = userId
          ? `prome_subscription_${userId}`
          : "prome_subscription";
        const mockSubscription = localStorage.getItem(subscriptionKey);

        if (mockSubscription) {
          try {
            const mockData = JSON.parse(mockSubscription);
            if (
              mockData.subscriptionEndDate &&
              new Date(mockData.subscriptionEndDate) > new Date()
            ) {
              currentSubscription = mockData;
              setSubscription(mockData);
            }
          } catch (e) {
            console.error("목데이터 구독 정보 파싱 실패:", e);
          }
        }

        // 목데이터가 없으면 API로 조회
        if (!currentSubscription) {
          try {
            const { data: subData } = await api.get(
              "/api/v1/users/me/subscription"
            );
            currentSubscription = subData.data || subData;
            setSubscription(currentSubscription);
          } catch (e) {
            console.warn("⚠️ 구독 정보 조회 실패 (무시):", e);
            currentSubscription = { isPremium: false };
          }
        }
      }
      isPremiumUser = currentSubscription?.isPremium === true;
      console.log(
        "👤 구독 상태:",
        isPremiumUser ? "프리미엄" : "무료",
        currentSubscription
      );

      // ✅ 조회 시작 플래그 설정 (중복 실행 방지)
      hasFetchedPrompt.current = true;
      fetchedPromptId.current = id;
      console.log("📥 프롬프트 상세 조회 시작:", id);

      // ✅ 프리미엄 프롬프트는 목업 데이터 사용 (백엔드 API 호출 안 함)
      const promptIdNum = parseInt(id);
      if (PREMIUM_PROMPT_IDS.includes(promptIdNum)) {
        console.log("⭐ 프리미엄 프롬프트 감지 - 목업 데이터 사용:", id);
        const mockData = getPremiumMockPrompt(id);
        if (mockData) {
          const mapped = mapPromptData(mockData);
          console.log("🔄 매핑된 프리미엄 프롬프트 데이터:", mapped);

          // ✅ 프리미엄 프롬프트 북마크 상태는 localStorage에서 확인
          const bookmarkKey = `prome_bookmark_${id}`;
          const isBookmarkedLocal =
            localStorage.getItem(bookmarkKey) === "true";

          setPrompt(mapped);
          setBookmarked(isBookmarkedLocal);
          setLiked(mapped.liked || false);
          setEditContent(mapped.content || "");
          return; // 백엔드 API 호출하지 않고 종료
        }
      }

      // ✅ 프리미엄 회원인 경우 프롬프트 목록 API를 먼저 시도 (티켓 차감 없음)
      if (isPremiumUser) {
        try {
          console.log("✅ 프리미엄 회원 - 프롬프트 목록 API로 조회 시도");
          const { data: postsData } = await api.get("/api/v1/posts", {
            params: {
              sort: "latest",
              page: 0,
              size: 100,
            },
          });

          let foundPrompt = null;
          if (postsData.success && postsData.data) {
            const posts = postsData.data.content || postsData.data || [];
            foundPrompt = posts.find(
              (p) => p.postId === parseInt(id) || p.id === parseInt(id)
            );
          }

          if (foundPrompt) {
            console.log("✅ 프리미엄 회원 - 프롬프트 목록에서 데이터 찾음");
            const mapped = mapPromptData(foundPrompt);

            // 프롬프트 목록에는 prompts가 없을 수 있으므로, 상세 조회를 시도하되 에러는 무시
            // prompts가 없으면 기본값 사용
            if (!mapped.prompts || Object.keys(mapped.prompts).length === 0) {
              console.log("⚠️ 프롬프트 목록에 상세 내용 없음 - 상세 조회 시도");
              try {
                const { data: detailData } = await api.get(
                  `/api/v1/posts/${id}`
                );
                const detailMapped = mapPromptData(detailData);
                // 상세 조회 성공 시 prompts 업데이트
                if (
                  detailMapped.prompts &&
                  Object.keys(detailMapped.prompts).length > 0
                ) {
                  mapped.prompts = detailMapped.prompts;
                  mapped.content = detailMapped.content;
                }
              } catch (detailError) {
                // 상세 조회 실패해도 무시 (프롬프트 목록 데이터로 표시)
                console.warn(
                  "⚠️ 프리미엄 회원 - 상세 조회 실패, 목록 데이터로 표시"
                );
              }
            }

            setPrompt(mapped);

            // ✅ 프리미엄 회원인 경우 북마크 상태는 localStorage에서 확인
            const bookmarkKey = `prome_bookmark_${id}`;
            const isBookmarkedLocal =
              localStorage.getItem(bookmarkKey) === "true";
            setBookmarked(isBookmarkedLocal || mapped.isBookmarked || false);
            setLiked(mapped.liked || false);
            setEditContent(mapped.content || "");

            // 사용자 정보 갱신
            try {
              const { data: userData } = await api.get("/api/v1/users/me");
              const latestUserInfo = userData.data || userData;
              setUserInfo(latestUserInfo);
            } catch (refreshError) {
              // 사용자 정보 갱신 실패해도 무시
            }
            return; // 성공적으로 프롬프트 표시
          }
        } catch (listError) {
          console.warn(
            "⚠️ 프리미엄 회원 - 프롬프트 목록 API 실패, 상세 조회로 대체"
          );
        }
      }

      try {
        // [수정] 이 API 호출 시 백엔드에서 티켓 차감 (프리미엄 회원은 티켓 차감 안 함)
        const { data } = await api.get(`/api/v1/posts/${id}`);

        console.log("📥 프롬프트 상세 조회 응답 (원본):", data);
        const mapped = mapPromptData(data);
        console.log("🔄 매핑된 프롬프트 데이터:", mapped);

        setPrompt(mapped);
        setBookmarked(mapped.isBookmarked);
        setLiked(mapped.liked || false);
        setEditContent(mapped.content || "");

        // ✅ 티켓 차감 후 유저 정보(티켓 수) 갱신 (프리미엄 회원은 티켓 차감 안 되므로 갱신 불필요)
        if (!isPremiumUser) {
          try {
            const { data: userData } = await api.get("/api/v1/users/me");
            const latestUserInfo = userData.data || userData;

            if (
              typeof latestUserInfo.blueTickets === "number" ||
              typeof latestUserInfo.greenTickets === "number"
            ) {
              const updatedTickets = {
                blue: latestUserInfo.blueTickets ?? 0,
                green: latestUserInfo.greenTickets ?? 0,
              };
              setTickets(updatedTickets);
              saveTicketsLS(updatedTickets);
              setUserInfo(latestUserInfo);

              // ✅ 티켓 업데이트 이벤트 발생하여 마이페이지 등 다른 페이지에도 알림
              window.dispatchEvent(
                new CustomEvent("ticketsUpdated", {
                  detail: updatedTickets,
                })
              );
            }
          } catch (refreshError) {
            console.warn("⚠️ 티켓 수 재조회 실패 (무시):", refreshError);
          }
        }
      } catch (e) {
        // ✅ 프리미엄 회원인 경우 티켓 부족 에러 무시 (티켓 차감 없이 조회 가능)
        if (
          isPremiumUser &&
          (e.response?.status === 400 || e.response?.status === 403)
        ) {
          const errorMessage = e.response?.data?.message || "";

          // 티켓 부족 관련 에러인 경우 프리미엄 회원은 프롬프트 목록 API로 대체 조회
          if (
            errorMessage.includes("티켓") ||
            errorMessage.includes("ticket") ||
            errorMessage.includes("NO_BLUE_TICKETS") ||
            errorMessage.includes("NO_GREEN_TICKETS")
          ) {
            console.log(
              "✅ 프리미엄 회원 - 티켓 부족 에러 발생, 프롬프트 목록 API로 대체 조회"
            );

            // 프리미엄 회원은 티켓 없이 조회 가능하므로, 프롬프트 목록 API를 통해 데이터 가져오기
            // 프롬프트 목록 API는 티켓 차감을 하지 않으므로 프리미엄 회원도 사용 가능
            try {
              // 프롬프트 목록에서 해당 ID 찾기
              const { data: postsData } = await api.get("/api/v1/posts", {
                params: {
                  sort: "latest",
                  page: 0,
                  size: 100, // 충분히 많이 가져와서 해당 ID 찾기
                },
              });

              let foundPrompt = null;

              // 응답 형식에 따라 데이터 추출
              if (postsData.success && postsData.data) {
                const posts = postsData.data.content || postsData.data || [];
                foundPrompt = posts.find(
                  (p) => p.postId === parseInt(id) || p.id === parseInt(id)
                );
              }

              if (foundPrompt) {
                console.log(
                  "✅ 프리미엄 회원 - 프롬프트 목록에서 데이터 찾음:",
                  foundPrompt
                );
                const mapped = mapPromptData(foundPrompt);
                setPrompt(mapped);
                setBookmarked(mapped.isBookmarked || false);
                setLiked(mapped.liked || false);
                setEditContent(mapped.content || "");

                // 사용자 정보 갱신 (티켓은 갱신하지 않음)
                try {
                  const { data: userData } = await api.get("/api/v1/users/me");
                  const latestUserInfo = userData.data || userData;
                  setUserInfo(latestUserInfo);
                } catch (refreshError) {
                  // 사용자 정보 갱신 실패해도 무시
                }
                return; // 성공적으로 프롬프트 표시
              } else {
                console.warn(
                  "⚠️ 프리미엄 회원 - 프롬프트 목록에서 해당 ID를 찾을 수 없음:",
                  id
                );
                // 프롬프트를 찾을 수 없으면 이전 페이지로 이동
                navigate(-1);
                return;
              }
            } catch (fallbackError) {
              console.error(
                "❌ 프리미엄 회원 - 프롬프트 목록 API 조회 실패:",
                fallbackError
              );
              // 대체 조회도 실패하면 이전 페이지로 이동
              navigate(-1);
              return;
            }
          }
        }

        // ✅ 에러 발생 시 플래그 리셋 (재시도 가능하도록)
        hasFetchedPrompt.current = false;
        fetchedPromptId.current = null;

        console.error("❌ 프롬프트 상세 조회 실패:", e);

        // ✅ 404 에러 처리 (프롬프트를 찾을 수 없음)
        if (e.response?.status === 404) {
          alert(
            "요청하신 프롬프트를 찾을 수 없습니다. 삭제되었거나 존재하지 않는 프롬프트일 수 있습니다."
          );
          navigate(-1); // 이전 페이지로
          return;
        }

        // [수정] 무료 회원의 경우 백엔드 에러 메시지(티켓 부족 등)를 사용자에게 표시
        const message =
          e.response?.data?.message || "프롬프트를 불러올 수 없습니다.";
        alert(message);

        // 티켓이 없거나(NO_BLUE_TICKETS) 권한이 없으면 이전 페이지로 이동
        if (e.response?.status === 400 || e.response?.status === 403) {
          navigate(-1); // 이전 페이지로
        }
      }
    };

    fetchPromptDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token, navigate, subscription, authSubscription]);

  // ✅ 프롬프트 ID가 변경되면 플래그 리셋 (다른 프롬프트 조회 시)
  useEffect(() => {
    if (fetchedPromptId.current !== id) {
      hasFetchedPrompt.current = false;
      fetchedPromptId.current = null;
    }
  }, [id]);

  // ✅ 마이페이지와 동일한 API로 사용자/구독/티켓 조회
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) return;
      try {
        const { data } = await api.get("/api/v1/users/me");
        const userData = data.data || data;
        setUserInfo(userData);
        console.log("👤 사용자 정보:", userData);

        // 서버 수치 존재하면 티켓 동기화
        if (
          typeof userData.blueTickets === "number" ||
          typeof userData.greenTickets === "number"
        ) {
          const merged = {
            blue:
              typeof userData.blueTickets === "number"
                ? userData.blueTickets
                : tickets.blue,
            green:
              typeof userData.greenTickets === "number"
                ? userData.greenTickets
                : tickets.green,
          };
          setTickets(merged);
          saveTicketsLS(merged); // 로컬에도 반영
        }
      } catch (e) {
        console.error("❌ 사용자 정보 조회 실패:", e);
      }

      // ✅ 구독 정보 조회 (계정별 구독 정보 확인)
      try {
        // 사용자 ID 가져오기
        const currentUser = localStorage.getItem("user");
        let userId = null;
        if (currentUser) {
          try {
            const parsedUser = JSON.parse(currentUser);
            userId = parsedUser.id || parsedUser.userId;
          } catch (e) {
            console.warn("사용자 정보 파싱 실패:", e);
          }
        }
        const subscriptionKey = userId
          ? `prome_subscription_${userId}`
          : "prome_subscription";

        // 목데이터 구독 정보 확인
        const mockSubscription = localStorage.getItem(subscriptionKey);
        if (mockSubscription) {
          try {
            const mockData = JSON.parse(mockSubscription);
            if (
              mockData.subscriptionEndDate &&
              new Date(mockData.subscriptionEndDate) > new Date()
            ) {
              console.log("✅ 목데이터 구독 정보 사용:", mockData);
              setSubscription(mockData);
              return;
            } else {
              localStorage.removeItem(subscriptionKey);
            }
          } catch (e) {
            console.error("목데이터 구독 정보 파싱 실패:", e);
          }
        }

        // 실제 API로 조회
        const { data } = await api.get("/api/v1/users/me/subscription");
        const subData = data.data || data;
        console.log("👤 구독 정보 (API):", subData);
        setSubscription(subData);
      } catch (e) {
        console.error("❌ 구독 정보 조회 실패:", e);
        // 구독 정보 조회 실패 시 AuthProvider의 구독 정보 사용 또는 기본값
        if (authSubscription) {
          console.log("👤 AuthProvider 구독 정보 사용:", authSubscription);
          setSubscription(authSubscription);
        } else {
          setSubscription({ isPremium: false });
        }
      }
    };
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, authSubscription]);

  // ✅ 댓글 목록 조회 API 연동
  useEffect(() => {
    const fetchComments = async () => {
      if (!id || !token) return;
      try {
        const { data } = await api.get(`/api/v1/posts/${id}/comments`);
        const commentsData = data.data || data;
        if (Array.isArray(commentsData)) {
          setComments(commentsData.map(mapCommentData));
        }
      } catch (e) {
        console.error("댓글 목록 조회 실패:", e);
      }
    };
    if (id && token) fetchComments();
  }, [id, token]);

  // ✅ 상세 진입 시 비구독자는 블루티켓 1 차감 (작성자 본인은 제외)
  useEffect(() => {
    if (!prompt) return;
    if (isSubscribed) return;

    // 작성자 본인은 티켓 차감하지 않음
    const currentUserId =
      userInfo?.userId || userInfo?.id || userInfo?.username || user?.id;
    const promptAuthorId = prompt?.authorId;
    const isAuthor = Number(currentUserId) === Number(promptAuthorId);

    if (isAuthor) {
      console.log("✅ 작성자 본인의 프롬프트이므로 티켓 차감하지 않음");
      return;
    }

    // ================================
    // 1) 목데이터 버전 (로컬스토리지)
    // ================================
    // 개발/테스트 단계에서는 티켓 차감 비활성화
    // 실제 운영 시 아래 주석 해제
    /*
    setTickets((prev) => {
      if (prev.blue <= 0) {
        // 티켓이 없어도 경고만 표시하고 열람 허용 (개발 단계)
        console.warn("⚠️ 블루 티켓이 모두 소진되었습니다.");
        // 실제 운영 시에는 아래 주석 해제
        // alert("블루 티켓이 모두 소진되어 열람할 수 없습니다.");
        // navigate(-1);
        // return prev;
        return prev;
      }
      const next = { ...prev, blue: prev.blue - 1 };
      saveTicketsLS(next);
      // 서버 값이 있던 사용자 화면에서도 보이도록 userInfo 모사
      if (userInfo) setUserInfo({ ...userInfo, blueTickets: next.blue });
      return next;
    });
    */

    // ==========================================
    // 2) 실제 API 연동 버전 (서버와 설계 확정 후 주석 해제)
    //    예: POST /api/v1/tickets/consume { type: "BLUE", postId }
    // ==========================================
    /*
    (async () => {
      try {
        const { data } = await api.post(
          "/api/v1/tickets/consume",
          { type: "BLUE", postId: Number(id) },
          { headers: authHeaders }
        );
        // data 예시: { blueTickets: 19, greenTickets: 5, allowed: true }
        if (data.allowed === false || data.blueTickets <= 0) {
          // 실제 운영 시에는 아래 주석 해제
          // alert("블루 티켓이 모두 소진되어 열람할 수 없습니다.");
          // navigate(-1);
          // return;
          console.warn("⚠️ 블루 티켓이 모두 소진되었습니다.");
          return;
        }
        const next = { blue: data.blueTickets, green: data.greenTickets };
        setTickets(next);
      } catch (e) {
        console.error("블루 티켓 차감 실패:", e);
      }
    })();
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, isSubscribed, userInfo]);

  if (!prompt) return <div>로딩 중...</div>;

  // ✅ 작성자 확인: userInfo에서 실제 사용자 ID 사용
  // userInfo의 모든 가능한 필드명 확인
  const currentUserIdVariants = [
    userInfo?.userId,
    userInfo?.id,
    userInfo?.username,
    userInfo?.loginId,
    userInfo?.user?.id,
    user?.id,
  ].filter((id) => id !== null && id !== undefined);

  const currentUserId = currentUserIdVariants[0] || null;
  const promptAuthorId = prompt?.authorId;

  // 다양한 필드명으로 작성자 ID 확인
  const authorIdVariants = [
    prompt?.authorId,
    prompt?.userId,
    prompt?.creatorId,
    prompt?.author?.id,
    prompt?.author?.userId,
  ].filter(Boolean); // null/undefined 제거

  console.log("🔍 작성자 확인 (상세):", {
    currentUserIdVariants,
    currentUserId,
    promptAuthorId,
    authorIdVariants,
    userInfo: userInfo ? { ...userInfo } : null,
    prompt: prompt ? { ...prompt } : null,
    "userInfo?.userId": userInfo?.userId,
    "userInfo?.id": userInfo?.id,
    "userInfo?.username": userInfo?.username,
    "userInfo?.loginId": userInfo?.loginId,
    "userInfo?.nickname": userInfo?.nickname,
    "user?.id": user?.id,
    "prompt?.authorId": prompt?.authorId,
    "prompt?.author": prompt?.author,
  });

  // 여러 방법으로 작성자 확인 (문자열과 숫자 모두 비교)
  // currentUserIdVariants와 authorIdVariants 모두 비교
  const isAuthorById =
    currentUserIdVariants.some((currentId) =>
      authorIdVariants.some(
        (authorId) =>
          String(currentId) === String(authorId) ||
          Number(currentId) === Number(authorId)
      )
    ) ||
    (currentUserId &&
      (String(currentUserId) === String(promptAuthorId) ||
        Number(currentUserId) === Number(promptAuthorId)));

  const isAuthor = isAuthorById;

  console.log("✅ isAuthor 결과:", isAuthor);

  // 작성자 이름으로도 비교 (author 필드가 있는 경우)
  const isAuthorByName =
    userInfo?.nickname &&
    prompt?.author &&
    String(userInfo.nickname).trim() === String(prompt.author).trim();

  // ✅ 작성자 확인: ID 또는 이름으로 비교 (작성자일 때만 수정 버튼 표시)
  const shouldShowEditButton = isAuthor || isAuthorByName;

  console.log("🔧 수정 버튼 표시 여부:", {
    isAuthor,
    isAuthorByName,
    shouldShowEditButton,
    "userInfo?.nickname": userInfo?.nickname,
    "prompt?.author": prompt?.author,
    currentUserId,
    promptAuthorId,
  });
  // 🧩 현재 선택된 모델 기준 프롬프트 내용
  const getCurrentContent = () => {
    if (!prompt) return "";
    if (prompt.prompts && prompt.prompts[selectedModel]) {
      return prompt.prompts[selectedModel];
    }
    return prompt.content || "";
  };

  // ✅ [수정] 프롬프트 복사 - 실제 API 연동 버전
  const handleCopy = async () => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!prompt) return;

    // ✅ 프리미엄 회원 확인 (프리미엄 회원은 그린 티켓 차감 안 됨)
    let currentSubscription = subscription || authSubscription;
    let isPremiumUser = false;

    if (!currentSubscription) {
      // 계정별 구독 정보 확인 (localStorage)
      const currentUser = localStorage.getItem("user");
      let userId = null;
      if (currentUser) {
        try {
          const parsedUser = JSON.parse(currentUser);
          userId = parsedUser.id || parsedUser.userId;
        } catch (e) {
          console.warn("사용자 정보 파싱 실패:", e);
        }
      }
      const subscriptionKey = userId
        ? `prome_subscription_${userId}`
        : "prome_subscription";
      const mockSubscription = localStorage.getItem(subscriptionKey);

      if (mockSubscription) {
        try {
          const mockData = JSON.parse(mockSubscription);
          if (
            mockData.subscriptionEndDate &&
            new Date(mockData.subscriptionEndDate) > new Date()
          ) {
            currentSubscription = mockData;
          }
        } catch (e) {
          console.error("목데이터 구독 정보 파싱 실패:", e);
        }
      }
    }

    isPremiumUser = currentSubscription?.isPremium === true;
    console.log(
      "👤 복사 시 구독 상태:",
      isPremiumUser ? "프리미엄" : "무료",
      currentSubscription
    );

    try {
      // 1. 백엔드에 복사 API(티켓 차감) 요청 (프리미엄 회원은 백엔드에서 차감 안 함)
      await api.post(`/api/v1/posts/${prompt.id}/copy`);

      // 2. API 호출 성공 시 클립보드에 복사
      navigator.clipboard.writeText(getCurrentContent());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // 3. 티켓 차감 후 유저 정보(티켓 수) 갱신 (프리미엄 회원은 티켓 차감 안 되므로 갱신 불필요)
      if (!isPremiumUser) {
        try {
          const { data: userData } = await api.get("/api/v1/users/me");
          const latestUserInfo = userData.data || userData;

          if (
            typeof latestUserInfo.blueTickets === "number" ||
            typeof latestUserInfo.greenTickets === "number"
          ) {
            const updatedTickets = {
              blue: latestUserInfo.blueTickets ?? 0,
              green: latestUserInfo.greenTickets ?? 0,
            };
            setTickets(updatedTickets);
            saveTicketsLS(updatedTickets);
            setUserInfo(latestUserInfo);

            // ✅ 티켓 업데이트 이벤트 발생하여 마이페이지 등 다른 페이지에도 알림
            window.dispatchEvent(
              new CustomEvent("ticketsUpdated", {
                detail: updatedTickets,
              })
            );
          }
        } catch (refreshError) {
          console.warn("⚠️ 티켓 수 재조회 실패 (무시):", refreshError);
        }
      }
    } catch (error) {
      // ✅ 프리미엄 회원인 경우 티켓 부족 에러 무시 (티켓 차감 없이 복사 가능)
      if (
        isPremiumUser &&
        (error.response?.status === 400 || error.response?.status === 403)
      ) {
        const errorMessage = error.response?.data?.message || "";

        // 티켓 부족 관련 에러인 경우 프리미엄 회원은 에러 무시하고 복사 진행
        if (
          errorMessage.includes("티켓") ||
          errorMessage.includes("ticket") ||
          errorMessage.includes("NO_BLUE_TICKETS") ||
          errorMessage.includes("NO_GREEN_TICKETS")
        ) {
          console.log("✅ 프리미엄 회원 - 티켓 부족 에러 무시하고 복사 진행");
          // 프리미엄 회원은 티켓 없이 복사 가능하므로, 에러를 무시하고 복사 진행
          navigator.clipboard.writeText(getCurrentContent());
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          return;
        }
      }

      // 4. API 호출 실패 시 (티켓 부족 등)
      console.error("❌ 프롬프트 복사 실패:", error);
      alert(
        error.response?.data?.message || "프롬프트 복사 중 오류가 발생했습니다."
      );
    }
  };

  // ✅ 좋아요 API 연동
  const toggleLike = async () => {
    if (!token) return alert("로그인이 필요합니다.");
    if (!prompt || !user?.id) return;

    try {
      if (liked) {
        // 좋아요 취소
        const { data } = await api.delete(
          `/api/v1/posts/${prompt.id}/likes?userId=${user.id}`
        );
        setLiked(false);
        setPrompt((prev) =>
          prev ? { ...prev, likes: (prev.likes || 1) - 1 } : prev
        );
      } else {
        // 좋아요 추가
        const { data } = await api.post(
          `/api/v1/posts/${prompt.id}/likes?userId=${user.id}`
        );
        setLiked(true);
        setPrompt((prev) =>
          prev ? { ...prev, likes: (prev.likes || 0) + 1 } : prev
        );
      }
    } catch (e) {
      console.error("좋아요 실패:", e);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  // ✅ 북마크 API 연동 (프리미엄 전용)
  const toggleBookmark = async () => {
    if (!token) return alert("로그인이 필요합니다.");
    if (!prompt) return;

    // ✅ 프리미엄 회원만 북마크 가능 (구독 상태 확인)
    console.log(
      "🔍 북마크 체크 - isSubscribed:",
      isSubscribed,
      "subscription:",
      subscription,
      "authSubscription:",
      authSubscription
    );

    // isSubscribed가 true이면 바로 통과
    if (isSubscribed) {
      console.log("✅ 프리미엄 회원 확인 - 북마크 가능");
      // 프리미엄 회원이므로 북마크 가능
    } else {
      // 구독 정보가 없으면 다시 한 번 확인
      let currentSubscription = subscription || authSubscription;
      if (!currentSubscription) {
        try {
          const { data: subData } = await api.get(
            "/api/v1/users/me/subscription"
          );
          currentSubscription = subData.data || subData;
          setSubscription(currentSubscription);
          // 구독 정보를 업데이트한 후 다시 확인
          if (currentSubscription?.isPremium) {
            // 프리미엄 회원이므로 북마크 가능
          } else {
            alert("북마크 기능은 프리미엄 회원만 사용할 수 있습니다.");
            navigate("/pricing");
            return;
          }
        } catch (e) {
          console.warn("⚠️ 구독 정보 조회 실패:", e);
          alert("북마크 기능은 프리미엄 회원만 사용할 수 있습니다.");
          navigate("/pricing");
          return;
        }
      } else {
        // 구독 정보가 있지만 프리미엄이 아니면 차단
        if (!currentSubscription.isPremium) {
          alert("북마크 기능은 프리미엄 회원만 사용할 수 있습니다.");
          navigate("/pricing");
          return;
        }
      }
    }

    // ✅ 프리미엄 프롬프트(ID 1~18)는 목업 데이터이므로 프론트엔드에서만 처리
    const promptIdNum = parseInt(prompt.id);
    if (PREMIUM_PROMPT_IDS.includes(promptIdNum)) {
      console.log(
        "⭐ 프리미엄 프롬프트 북마크 - 프론트엔드에서만 처리:",
        prompt.id
      );
      const bookmarkKey = `prome_bookmark_${prompt.id}`;
      const newBookmarkState = !bookmarked;
      setBookmarked(newBookmarkState);

      if (newBookmarkState) {
        localStorage.setItem(bookmarkKey, "true");
        alert("북마크에 추가되었습니다.");
      } else {
        localStorage.removeItem(bookmarkKey);
        alert("북마크에서 제거되었습니다.");
      }
      return;
    }

    // ✅ 일반 프롬프트는 백엔드 API 호출
    try {
      const { data } = await api.post(`/api/v1/posts/${prompt.id}/bookmark`);
      const response = data.data || data;
      setBookmarked(response.isBookmarked ?? !bookmarked);
      if (response.message) alert(response.message);
    } catch (e) {
      console.error("북마크 실패:", e);

      // ✅ 프리미엄 회원인 경우 403 에러를 무시하고 localStorage로 처리
      if (isSubscribed && e.response?.status === 403) {
        console.log(
          "✅ 프리미엄 회원 - 403 에러 무시하고 localStorage로 북마크 처리"
        );
        const bookmarkKey = `prome_bookmark_${prompt.id}`;
        const newBookmarkState = !bookmarked;
        setBookmarked(newBookmarkState);

        if (newBookmarkState) {
          localStorage.setItem(bookmarkKey, "true");
          alert("북마크에 추가되었습니다.");
        } else {
          localStorage.removeItem(bookmarkKey);
          alert("북마크에서 제거되었습니다.");
        }
        return;
      }

      // 백엔드에서도 프리미엄 체크를 하므로 에러 메시지 확인
      if (e.response?.status === 403) {
        alert("북마크 기능은 프리미엄 회원만 사용할 수 있습니다.");
        navigate("/pricing");
      } else if (e.response?.status === 500) {
        alert(
          "북마크 처리 중 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
      } else {
        alert(
          e.response?.data?.message || "북마크 처리 중 오류가 발생했습니다."
        );
      }
    }
  };

  // ✅ 게시글 수정 API 연동 (PUT /api/v1/posts/{id})
  const handleSaveEdit = async () => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!prompt) return;

    try {
      // 등록 API와 동일한 형식: prompts를 객체 형식으로 변환
      // 기존 prompts를 유지하고 선택된 모델만 업데이트
      const promptsObj = {
        chatgpt: prompt.prompts?.chatgpt || "",
        gemini: prompt.prompts?.gemini || "",
        claude: prompt.prompts?.claude || "",
      };

      // 선택된 모델의 프롬프트만 업데이트
      if (selectedModel === "chatgpt" && editContent.trim()) {
        promptsObj.chatgpt = editContent.trim();
      } else if (selectedModel === "gemini" && editContent.trim()) {
        promptsObj.gemini = editContent.trim();
      } else if (selectedModel === "claude" && editContent.trim()) {
        promptsObj.claude = editContent.trim();
      }

      const payload = {
        prompts: promptsObj, // 객체 형식: { chatgpt: "...", gemini: "...", claude: "..." }
      };

      console.log(
        "📤 프롬프트 수정 요청 payload:",
        JSON.stringify(payload, null, 2)
      );

      const { data } = await api.put(`/api/v1/posts/${prompt.id}`, payload);

      console.log("📥 프롬프트 수정 응답:", data);

      // 수정 성공 후 프롬프트 데이터 다시 불러오기
      try {
        const { data: updatedData } = await api.get(
          `/api/v1/posts/${prompt.id}`
        );
        const mapped = mapPromptData(updatedData);
        setPrompt(mapped);
        setEditContent(mapped.prompts[selectedModel] || "");
      } catch (e) {
        console.error("❌ 수정된 프롬프트 재조회 실패:", e);
        // 재조회 실패 시 로컬 상태만 업데이트
        setPrompt((prev) => {
          if (!prev) return prev;
          const updated = { ...prev };
          updated.prompts[selectedModel] = editContent;
          updated.content = editContent;
          return updated;
        });
      }

      setIsEditing(false);
      alert("✅ 게시글이 수정되었습니다!");
    } catch (error) {
      console.error("❌ 게시글 수정 오류:", error);
      console.error("❌ 응답 데이터:", error.response?.data);
      alert(
        error.response?.data?.message || "게시글 수정 중 오류가 발생했습니다."
      );
    }
  };

  // ✅ 댓글 작성
  const handleCommentChange = (e) => setCommentInput(e.target.value);

  // ✅ 댓글 작성 API 연동
  const handleCommentSubmit = async () => {
    const text = commentInput.trim();
    if (!text) return;
    if (!token) return alert("로그인이 필요합니다.");
    if (!prompt || !id) return;

    try {
      const { data } = await api.post(`/api/v1/posts/${id}/comments`, {
        content: text,
      });
      const commentData = data.data || data;
      const newComment = {
        id: commentData.commentId,
        author: user.nickname || commentData.author,
        authorId: user.id || commentData.authorId,
        text: commentData.content || text,
        likes: commentData.likes || 0,
        liked: commentData.liked || false,
        createdAt: commentData.createdAt || new Date().toISOString(),
      };
      setComments((prev) => [newComment, ...prev]);
      setCommentInput("");
    } catch (e) {
      console.error("댓글 작성 실패:", e);
      alert(e.response?.data?.message || "댓글 작성 중 오류가 발생했습니다.");
    }
  };

  // ✅ 댓글 좋아요 토글 API 연동
  const handleToggleCommentLike = async (commentId) => {
    if (!token) return alert("로그인이 필요합니다.");
    if (!user?.id) return;

    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return;

    try {
      if (comment.liked) {
        // 좋아요 취소
        const { data } = await api.delete(
          `/api/v1/comments/${commentId}/likes?userId=${user.id}`
        );
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, liked: false, likes: Math.max(0, (c.likes || 1) - 1) }
              : c
          )
        );
      } else {
        // 좋아요 추가
        const { data } = await api.post(
          `/api/v1/comments/${commentId}/likes?userId=${user.id}`
        );
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, liked: true, likes: (c.likes || 0) + 1 }
              : c
          )
        );
      }
    } catch (e) {
      console.error("댓글 좋아요 실패:", e);
      alert("댓글 좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  // ✅ 댓글 수정 API 연동
  const handleSaveCommentEdit = async (commentId) => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const { data } = await api.put(`/api/v1/comments/${commentId}`, {
        content: editCommentText,
      });
      const commentData = data.data || data;
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, text: commentData.content || editCommentText }
            : c
        )
      );
      setEditingCommentId(null);
      setEditCommentText("");
      alert("✅ 댓글이 수정되었습니다!");
    } catch (error) {
      console.error("댓글 수정 오류:", error);
      alert(
        error.response?.data?.message || "댓글 수정 중 오류가 발생했습니다."
      );
    }
  };

  // ✅ 댓글 삭제 API 연동
  const handleDeleteComment = async (commentId) => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/api/v1/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      alert("✅ 댓글이 삭제되었습니다!");
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
      alert(
        error.response?.data?.message || "댓글 삭제 중 오류가 발생했습니다."
      );
    }
  };

  // ✅ 댓글 정렬: 상위 2개(좋아요 기준) + 나머지 최신순
  const sortedByLikes = [...comments].sort((a, b) => b.likes - a.likes);
  const topComments = sortedByLikes.slice(0, 2);
  const topCommentIds = new Set(topComments.map((c) => c.id));
  const restComments = comments
    .filter((c) => !topCommentIds.has(c.id))
    .sort((a, b) => {
      // createdAt 있으면 시간 기준, 없으면 id 기준
      if (a.createdAt && b.createdAt)
        return new Date(b.createdAt) - new Date(a.createdAt);
      return b.id - a.id;
    });
  const orderedComments = [...topComments, ...restComments];

  return (
    <PageWrapper>
      <PromptCard>
        <CardTopBar>
          <Dots>
            <Dot $color="#ff5f57" />
            <Dot $color="#ffbd2e" />
            <Dot $color="#28c940" />
          </Dots>
          <MetaText>
            {new Date(prompt.createdAt).toISOString().slice(0, 10)} -
            prompt.prome
          </MetaText>
        </CardTopBar>

        <CardBody>
          <CardTitle>{prompt.title}</CardTitle>
          <CardDescription>{prompt.description}</CardDescription>

          <CategoryRow>
            {prompt.categories.map((category) => (
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
                {!isEditing && (
                  <>
                    <ActionButton type="button" onClick={handleCopy}>
                      <ButtonIcon src={scanIcon} alt="복사하기" />
                      <ButtonText>복사하기</ButtonText>
                    </ActionButton>
                    <ActionButton type="button">
                      <ButtonIcon src={shareIcon} alt="공유하기" />
                      <ButtonText>공유하기</ButtonText>
                    </ActionButton>
                  </>
                )}
                {shouldShowEditButton && !isEditing && (
                  <ActionButton
                    type="button"
                    onClick={() => {
                      console.log("✅ 수정 버튼 클릭됨!");
                      // 수정 모드 진입 시 현재 선택된 모델의 프롬프트 내용으로 설정
                      const currentContent = getCurrentContent();
                      console.log("✅ 현재 프롬프트 내용:", currentContent);
                      setEditContent(currentContent);
                      setIsEditing(true);
                    }}
                  >
                    ✏️ 수정하기
                  </ActionButton>
                )}
                {shouldShowEditButton && isEditing && (
                  <>
                    <ActionButton
                      type="button"
                      onClick={() => {
                        // 취소 시 원래 내용으로 복원하고 수정 모드 종료
                        const originalContent = getCurrentContent();
                        setEditContent(originalContent);
                        setIsEditing(false);
                      }}
                    >
                      ❌ 취소
                    </ActionButton>
                    <ActionButton type="button" onClick={handleSaveEdit}>
                      💾 저장하기
                    </ActionButton>
                  </>
                )}
              </ActionButtons>
            </PromptHeader>

            {/* 🧩 프롬프트 라벨 아래, 회색 박스 위에 모델 버튼 */}
            <ModelToggleGroup>
              {MODEL_KEYS.map((key) => (
                <ModelButton
                  key={key}
                  type="button"
                  $active={selectedModel === key}
                  onClick={() => {
                    setSelectedModel(key);
                    // 수정 모드일 때 모델 변경 시 해당 모델의 프롬프트 내용으로 업데이트
                    if (isEditing && prompt) {
                      const modelContent = prompt.prompts?.[key] || "";
                      setEditContent(modelContent);
                    }
                  }}
                >
                  {MODEL_LABELS[key]}
                </ModelButton>
              ))}
            </ModelToggleGroup>

            {isEditing ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                style={{
                  width: "100%",
                  height: "260px",
                  padding: "16px",
                  fontSize: "15px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  lineHeight: "1.6",
                }}
              />
            ) : (
              <PromptContent>{getCurrentContent()}</PromptContent>
            )}

            <BottomIcons>
              <Heart
                src={heartBlack}
                alt="좋아요"
                $active={liked}
                onClick={toggleLike}
              />
              {/* ✅ 프리미엄 회원만 북마크 버튼 표시 */}
              {isSubscribed && (
                <Star
                  src={bookmarked ? starIcon : starOutlineIcon}
                  alt="북마크"
                  onClick={toggleBookmark}
                />
              )}
            </BottomIcons>
          </PromptBox>
        </CardBody>

        {copied && <CopyAlert>복사되었습니다!</CopyAlert>}
      </PromptCard>

      {/* ✅ 댓글 영역 */}
      <CommentsContainer id="comments">
        <CommentInputRow>
          <CommentInput
            placeholder="댓글을 입력하세요."
            value={commentInput}
            onChange={handleCommentChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCommentSubmit();
            }}
          />
          <CommentSubmitButton type="button" onClick={handleCommentSubmit}>
            작성
          </CommentSubmitButton>
        </CommentInputRow>

        <CommentsList>
          {orderedComments.map((comment) => (
            <CommentItem key={comment.id}>
              <CommentLeft>
                <Avatar />
                <CommentTextBox>
                  <CommentAuthor>{comment.author}</CommentAuthor>
                  {editingCommentId === comment.id ? (
                    <textarea
                      value={editCommentText}
                      onChange={(e) => setEditCommentText(e.target.value)}
                      style={{
                        width: "100%",
                        height: "80px",
                        padding: "10px",
                        fontSize: "15px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                      }}
                    />
                  ) : (
                    <CommentText>{comment.text}</CommentText>
                  )}
                </CommentTextBox>
              </CommentLeft>

              <CommentLike>
                {user.id === comment.authorId &&
                  (editingCommentId === comment.id ? (
                    <>
                      <ActionButton
                        type="button"
                        onClick={() => handleSaveCommentEdit(comment.id)}
                      >
                        저장
                      </ActionButton>
                      <ActionButton
                        type="button"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditCommentText("");
                        }}
                        style={{ marginLeft: "8px" }}
                      >
                        취소
                      </ActionButton>
                    </>
                  ) : (
                    <>
                      <ActionButton
                        type="button"
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditCommentText(comment.text);
                        }}
                      >
                        수정
                      </ActionButton>
                      <ActionButton
                        type="button"
                        onClick={() => handleDeleteComment(comment.id)}
                        style={{
                          marginLeft: "8px",
                          color: "#ff4b4b",
                          borderColor: "#ff4b4b",
                        }}
                      >
                        삭제
                      </ActionButton>
                    </>
                  ))}
                <CommentHeart
                  src={heartBlack}
                  alt="좋아요"
                  $active={comment.liked}
                  onClick={() => handleToggleCommentLike(comment.id)}
                />
                <CommentLikeCount>{comment.likes}</CommentLikeCount>
              </CommentLike>
            </CommentItem>
          ))}
        </CommentsList>
      </CommentsContainer>
    </PageWrapper>
  );
}

/* ✅ 스타일들은 그대로 유지 + 모델 버튼만 추가 */

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
  gap: 8px;
`;

const Dot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background-color: ${({ $color }) => $color || "#555555"};
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
  border: 1px solid #d0d0d5;
  border-radius: 5px;
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

/* 🧩 모델 토글 스타일 */
const ModelToggleGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  margin-bottom: 4px;
`;

const ModelButton = styled.button`
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? "#000000" : "#d0d0d5")};
  background-color: ${({ $active }) => ($active ? "#000000" : "#f8f8fa")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#555555")};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
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
  border-radius: 10px;
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

const CommentHeart = styled(Heart)`
  width: 22px;
  height: 22px;
`;

const BottomNote = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: #777;
`;

const CommentLikeCount = styled.span``;
