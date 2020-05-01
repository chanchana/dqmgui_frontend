import React, { useState } from 'react';
import { Select } from 'antd';
import _ from 'lodash';

import { StyledSelect } from '../../viewDetailsMenu/styledComponents';
import { StyledOptionContent } from '../../styledComponents';
const { Option } = Select;

interface PartsBrowserProps {
  setGroupBy(groupBy: string): void;
  setName(name: string): void;
  resultsNames: any;
  restParts: string[];
  part: string;
  name: string | undefined;
  setSelectedParts(selectedPart: any): void;
  selectedParts: any;
  selectedName: string;
}

export const PartsBrowser = ({
  setName,
  setGroupBy,
  resultsNames,
  restParts,
  part,
  name,
  setSelectedParts,
  selectedParts,
  selectedName,
}: PartsBrowserProps) => {

  const [value, setValue] = useState(name)
  return (
    <StyledSelect
      dropdownMatchSelectWidth={false}
      defaultValue={name}
      selected={selectedName === value ? 'selected' : ''}
      onChange={(value: any) => {
        selectedParts[part] = value
        setSelectedParts(selectedParts)
        setGroupBy(part);
        setValue(value)
        setName(value);
      }}>
      {
        resultsNames.map((result: string) => (
          <Option
            value={result}
            key={result}
          >
            <StyledOptionContent
              availability="available"
            >{result}</StyledOptionContent>
          </Option>
        ))
      }
      {
        restParts.map((result: string) => (
          <Option
            key={result}
            value={result}>
            <StyledOptionContent>{result}</StyledOptionContent>
          </Option>
        ))
      }
    </StyledSelect >
  );
};
