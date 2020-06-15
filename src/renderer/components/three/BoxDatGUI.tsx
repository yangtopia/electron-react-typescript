import React from 'react';
import DatGui, {
  DatBoolean,
  DatString,
  DatNumber,
  DatFolder,
} from 'react-dat-gui';
import styled from 'styled-components';

const StyledGUI = styled(DatGui)`
  position: fixed;
  z-index: 1;
  top: 0;
  right: 0;
`;

export interface BoxMeshConfig {
  name: string;
  isRotation: boolean;
  scaleX: number;
}

interface Props {
  data: BoxMeshConfig;
  onUpdate: (config: BoxMeshConfig) => void;
}

const BoxDatGUI: React.FC<Props> = ({ data, onUpdate }) => {
  return (
    <>
      <StyledGUI data={data} onUpdate={onUpdate}>
        <DatString path="name" label="name" />
        <DatBoolean path="isRotation" />
        <DatNumber path="scaleX" min={1} max={5} step={0.1} />
      </StyledGUI>
    </>
  );
};

export default BoxDatGUI;
