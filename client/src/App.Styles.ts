import styled from "styled-components";

export const StyledBtn = styled.button`
  background: var(--primary);
  color: var(--bg-left);
  padding: 0.5em 1em;
  border-radius: 1em;
  cursor: pointer;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  gap: 3em;
`;

export const StyledBox = styled.div`
  font-weight: bold;
  max-width: 650px;
  width: 100%;
  padding: 0.4em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const StyledInput = styled.input`
  padding: 5px 20px;
  box-sizing: border-box;
  font-family: "Nunito";
  background: var(--bg-glass);
  border: 1px solid var(--primary);
  color: var(--bg-glass);
  border-radius: 20px;
  width: 100%;
  text-align: center;
  padding: 10px;

  & focus {
    outline: 1px solid var(--primary);
    background: var(--bg-glass);
  }
`;
