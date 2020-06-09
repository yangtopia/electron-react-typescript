import React, { SyntheticEvent, ChangeEvent } from 'react';
import styled from 'styled-components';

const StyledInputFile = styled.input.attrs({
  type: 'file',
})`
  position: fixed;
  top: 20px;
  right: 20px;
`;

interface Props {
  onChangeFile: (e: ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadButton: React.FC<Props> = ({ onChangeFile }) => {
  return <StyledInputFile onChange={onChangeFile} />;
};

export default FileUploadButton;
