import styled from "styled-components";

export const Page = styled.main`
  width: 100%;
  background-color: #fff;
  padding: 60px 0;
`;

export const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 0 20px 80px;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  padding: 40px 0 30px;
  border-bottom: 2px solid #000;
  margin-bottom: 40px;
`;

export const ProfileBox = styled.section`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 0;
  padding: 24px;
  margin-bottom: 40px;
  gap: 16px;
`;

export const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 0;
  object-fit: cover;
  background: #f5f5f5;
`;

export const ProfileInfo = styled.div`
  flex: 1;
`;

export const Name = styled.p`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
`;

export const NicknameInput = styled.input`
  width: 220px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 0;
  font-size: 14px;
`;

export const SaveButton = styled.button`
  background: #111;
  color: #fff;
  border: none;
  border-radius: 0;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    opacity: 0.9;
  }
`;

export const Section = styled.section`
  border: 1px solid #ddd;
  border-radius: 0;
  padding: 28px 24px;
  margin-bottom: 40px;
`;

export const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
`;

export const SubscriptionBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ProBadge = styled.div`
  display: inline-block;
  background: #0070f3;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 0;
  width: fit-content;
`;

export const SubscriptionText = styled.p`
  font-size: 14px;
  margin: 2px 0;
`;

export const SubscriptionActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 12px;
`;

export const SubscriptionButton = styled.button`
  flex: 1;
  border: 1px solid #111;
  border-radius: 0;
  padding: 10px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background: #f5f5f5;
  }
`;

export const CancelButton = styled(SubscriptionButton)`
  color: #ff4b4b;
  border-color: #ff4b4b;

  &:hover {
    background: #fff1f1;
  }
`;

export const SecurityButtons = styled.div`
  display: flex;
  gap: 12px;
`;

export const SecurityButton = styled.button`
  flex: 1;
  border: 1px solid #111;
  border-radius: 0;
  background: #fff;
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background: #f4f4f4;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th {
    text-align: left;
    padding: 10px 0;
    border-bottom: 2px solid #000;
  }

  td {
    padding: 12px 0;
    border-bottom: 1px solid #ddd;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

export const ViewButton = styled.button`
  background: #111;
  color: #fff;
  border: none;
  border-radius: 0;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
