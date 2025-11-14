import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

export default function Error() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");

  useEffect(() => {
    // 에러가 있으면 3초 후 로그인 페이지로 이동
    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Page>
      <Container>
        <Title>오류가 발생했습니다</Title>
        <Message>
          {message || error || "서버에서 예기치 않은 오류가 발생했습니다."}
        </Message>
        <Desc>잠시 후 로그인 페이지로 이동합니다.</Desc>
        <Button onClick={() => navigate("/login", { replace: true })}>
          로그인 페이지로 이동
        </Button>
      </Container>
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #111;
  margin-bottom: 16px;
`;

const Message = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 12px;
`;

const Desc = styled.p`
  font-size: 14px;
  color: #999;
  margin-bottom: 24px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: #333;
  }
`;

