import { useMemo } from 'react';

import { MAX_PAGE_SIZE } from '../../../constants';
import {
  OrganizationFieldsFragment,
  useOrganizationsQuery,
} from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import { organizationsPathBuilder } from '../../organization/utils';

type ImageOrganizationAncestorsState = {
  loading: boolean;
  organizationAncestors: OrganizationFieldsFragment[];
};

const useImageOrganizationAncestors = (
  publisher: string
): ImageOrganizationAncestorsState => {
  const { data, loading } = useOrganizationsQuery({
    skip: !publisher,
    variables: {
      child: publisher as string,
      createPath: getPathBuilder(organizationsPathBuilder),
      pageSize: MAX_PAGE_SIZE,
    },
  });

  const organizationAncestors = useMemo(() => {
    return (data?.organizations.data as OrganizationFieldsFragment[]) || [];
  }, [data]);

  return {
    loading,
    organizationAncestors,
  };
};

export default useImageOrganizationAncestors;
