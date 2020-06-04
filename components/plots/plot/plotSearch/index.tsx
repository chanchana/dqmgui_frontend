import * as React from 'react'
import Form from 'antd/lib/form/Form'
import { Input } from 'antd';

import { useRouter } from 'next/router';
import { StyledFormItem } from '../../../styledComponents';
import { QueryProps } from '../../../../containers/display/interfaces';
import { getChangedQueryParams, changeRouter } from '../../../../containers/display/utils';

const { Search } = Input;

interface PlotSearchProps {
  isLoadingFolders: boolean
}

export const PlotSearch = ({ isLoadingFolders }: PlotSearchProps) => {
  const router = useRouter();
  const query: QueryProps = router.query;
  const [plotName, setPlotName] = React.useState<string | undefined>(query.plot_search)

  React.useEffect(() => {
    const params = getChangedQueryParams({ plot_search: plotName }, query)
    changeRouter(params)
  }, [plotName])

  return React.useMemo(() => {
    return (
      <Form
        onChange={(e: any) => setPlotName(e.target.value)}>
        <StyledFormItem>
          <Search
            defaultValue={query.plot_search}
            loading={isLoadingFolders}
            id="plot_search"
            placeholder="Enter plot name"
          />
        </StyledFormItem>
      </Form>
    )
  }, [plotName])
}