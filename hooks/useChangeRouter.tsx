import * as React from 'react';
import Router, { useRouter } from 'next/router';
import qs from 'qs';

import { QueryProps } from '../containers/display/interfaces';
import { ParsedUrlQueryInput } from 'querystring';
import { getChangedQueryParams } from '../containers/display/utils';
import { root_url_ } from '../config/config';

export const useChangeRouter = (
  params: ParsedUrlQueryInput,
  watchers: (string | number | undefined)[] = [],
  condition: boolean
) => {
  const router = useRouter();
  const query: QueryProps = router.query;
  const parameters = getChangedQueryParams(params, query);
  const queryString = qs.stringify(parameters, {});

  React.useEffect(() => {
    if (condition) {
      Router.push({
        pathname: '',
        query: parameters,
      },
      `${root_url_}?${queryString}`
      );
    }
  }, watchers);
};
