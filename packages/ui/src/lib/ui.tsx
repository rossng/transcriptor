import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface UiProps {}

const StyledUi = styled.div`
  color: pink;
`;

export function Ui(props: UiProps) {
  return (
    <StyledUi>
      <h1>Welcome to ui!</h1>
    </StyledUi>
  );
}

export default Ui;
