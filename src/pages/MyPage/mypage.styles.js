import styled from "styled-components";

export const Page = styled.main`
  width: 100%;
  background: #ffffff;
  padding: 60px 0 100px;
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 36px;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111;
`;

export const Section = styled.section`
  border: 1.5px solid #000;
  border-radius: 0;
  background: #fff;
  padding: 28px 32px;
  margin-bottom: 36px;
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 3px 3px 0px #000;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
`;

export const ProfileRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
`;

export const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  background: #f4f4f4;
  border: 1px solid #000;
  border-radius: 0;
  object-fit: cover;
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const InfoLabel = styled.label`
  font-size: 14px;
  color: #333;
`;

export const NicknameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const NicknameInput = styled.input`
  width: 220px;
  padding: 8px 10px;
  border: 1px solid #000;
  background: #fff;
  border-radius: 0;
  font-size: 14px;
`;

export const DuplicateButton = styled.button`
  border: 1px solid #000;
  background: #fff;
  color: #000;
  font-weight: 600;
  font-size: 13px;
  padding: 9px 14px;
  border-radius: 0;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: #000;
    color: #fff;
  }
`;

export const SaveButton = styled(DuplicateButton)`
  font-weight: 600;
`;

export const SubscriptionBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ProBadge = styled.span`
  background: #000;
  color: #fff;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
  border-radius: 0;
  width: fit-content;
`;

export const SubscriptionText = styled.p`
  font-size: 14px;
  color: #111;
`;

export const SubscriptionActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 14px;
`;

export const SubscriptionButton = styled.button`
  flex: 1;
  border: 1px solid #000;
  background: #fff;
  border-radius: 0;
  padding: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: #000;
    color: #fff;
  }
`;

export const CancelButton = styled(SubscriptionButton)`
  color: #ff4b4b;
  border-color: #ff4b4b;

  &:hover {
    background: #ff4b4b;
    color: #fff;
  }
`;

export const SecurityButtons = styled.div`
  display: flex;
  gap: 12px;
`;

export const SecurityButton = styled.button`
  flex: 1;
  border: 1px solid #000;
  border-radius: 0;
  background: #fff;
  padding: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: #000;
    color: #fff;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  color: #111;

  th {
    text-align: left;
    padding: 10px 0;
    border-bottom: 1.5px solid #000;
    font-weight: 700;
  }

  td {
    padding: 12px 0;
    border-bottom: 1px solid #000;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

export const ViewButton = styled.button`
  border: 1px solid #000;
  background: #fff;
  color: #000;
  font-weight: 600;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 0;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: #000;
    color: #fff;
  }
`;
