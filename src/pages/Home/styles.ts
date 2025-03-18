import styled from 'styled-components';

export const HomeContainer = styled.div`
  width: 400px;
  height: 500px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
`;

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 1rem;
  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
`;

export const Title = styled.h1`
  font-size: 1.2rem;
  margin: 0;
  color: #343a40;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #ced4da;
  padding: 0.5rem;
  gap: 8px;
  color: #6c757d;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #4dabf7;
    box-shadow: 0 0 0 3px rgba(77, 171, 247, 0.25);
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.9rem;
  color: #495057;
  background: transparent;
  &::placeholder {
    color: #adb5bd;
  }
`;

export const ClipboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  overflow-y: auto;
  padding-right: 0.2rem;
  flex: 1;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f3f5;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ced4da;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #adb5bd;
  }
`;

export const ClipboardItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 0.5rem;

  span {
    font-size: 0.7rem;
    text-transform: uppercase;
    font-weight: 600;
    color: #6c757d;
    letter-spacing: 0.5px;
  }

  div {
    display: flex;
    gap: 4px;
  }
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 4px;
  padding: 4px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e9ecef;
    color: #343a40;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ClipboardDataSpan = styled.div`
  padding: 0.8rem;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 0.9rem;
  text-align: left;
  line-height: 1.4;
  transition: all 0.2s ease;
  word-break: break-word;

  &:hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  }

  img {
    max-width: 100%;
    border-radius: 4px;
    display: block;
    margin: 0 auto;
  }

  .content {
    max-height: 150px;
    overflow-y: auto;
    color: #495057;

    /* Custom scrollbar for content */
    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f3f5;
    }

    &::-webkit-scrollbar-thumb {
      background: #ced4da;
    }
  }
`;

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #adb5bd;
  font-size: 0.9rem;
  text-align: center;
  padding: 1rem;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  margin: 2rem 0;
`;

export const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100%;

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(0, 123, 255, 0.2);
    border-radius: 50%;
    border-top-color: #007bff;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const RefreshButton = styled.button<{ isRefreshing?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 4px;
  padding: 6px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e9ecef;
    color: #343a40;
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    animation: ${(props) =>
      props.isRefreshing ? 'spin 1s linear infinite' : 'none'};
  }
`;

export const UpdateMessage = styled.div`
  background-color: #fff3cd;
  color: #856404;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;

  strong {
    font-weight: 600;
  }
`;
