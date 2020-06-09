import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.input.attrs({
  type: 'file',
})`
  position: fixed;
  top: 20px;
  right: 20px;
`;

interface Props {
  onChangeFile: (e: any) => void;
}

const FileUploadButton: React.FC<Props> = ({ onChangeFile }) => {
  return <StyledButton onChange={onChangeFile} />;
};

export default FileUploadButton;
