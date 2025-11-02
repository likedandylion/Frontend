import { useAuth } from "@/features/auth/useAuth";
export default function MyPage() {
  const { user } = useAuth();
  return (
    <>
      <h1>마이페이지</h1>
      {user ? (
        <div>
          <div>이름: {user.name}</div>
          <div>프리미엄: {user.premium ? "예" : "아니오"}</div>
        </div>
      ) : (
        "정보 없음"
      )}
    </>
  );
}
