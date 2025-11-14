import styled from "styled-components";
import { Link } from "react-router-dom";

export const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
`;

export const ContentContainer = styled.main`
  max-width: 1280px;
  margin: 40px auto 60px;
  padding: 0 16px;
  box-sizing: border-box;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Icon = styled.img`
  width: 30px;
  height: 30px;
  object-fit: contain;
  transform: translateY(2px);
  vertical-align: middle;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
`;

export const NewButton = styled(Link)`
  padding: 8px 16px;
  border: 1.5px solid #000000;
  background-color: #ffffff;
  font-size: 14px;
  text-decoration: none;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 2px 2px 0px #000;
  }
`;

export const PromptGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px 28px;
  margin-bottom: 40px;
`;

export const PromptCard = styled.article`
  border: 2px solid #000000;
  background-color: #ffffff;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 4px 4px 0 #000;
  }
`;

export const CardTopBar = styled.div`
  height: 32px;
  background-color: #000000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  box-sizing: border-box;
`;

export const CardDots = styled.div`
  display: flex;
  gap: 6px;
`;

export const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background-color: ${({ $color }) => $color || "#555555"};
`;

export const CardMeta = styled.div`
  font-size: 12px;
  color: #ffffff;
`;

export const CardBody = styled.div`
  padding: 18px 20px 18px;
  display: flex;
  flex-direction: column;
  min-height: 150px;
`;

export const CardTitle = styled.h2`
  font-size: 19px;
  font-weight: 700;
  margin-bottom: 10px;
`;

export const CardDescription = styled.p`
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
  flex: 1;
`;

export const ButtonRow = styled.div`
  display: flex;
  align-items: flex-end;
`;

export const ViewButton = styled(Link)`
  padding: 8px 16px;
  border: 1.5px solid #000000;
  background-color: #ffffff;
  font-size: 14px;
  text-decoration: none;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 2px 2px 0px #000;
  }
`;

export const Pagination = styled.nav`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
`;

export const PageButton = styled.button`
  border: none;
  background: transparent;
  font-size: 18px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  text-decoration: ${({ $active }) => ($active ? "underline" : "none")};
  cursor: pointer;
  padding: 4px 8px;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.15);
  }
`;
