import http from "@/shared/api/http";
import { useAuth } from "@/features/auth/useAuth";
export default function Pricing() {
  const { user } = useAuth();
  const buy = async (planId) => {
    await http.post("/api/purchase", { planId });
    alert("구매 완료(예시)");
  };
  return (
    <>
      <h1>요금제 구매</h1>
      <p>현재 상태: {user?.premium ? "프리미엄" : "일반"}</p>
      <button onClick={() => buy("premium-monthly")}>프리미엄(월)</button>
    </>
  );
}
