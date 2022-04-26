import { OrganizationClassesQueryVariables } from '../../generated/graphql';
import { PathBuilderProps } from '../../types';
import queryBuilder from '../../utils/queryBuilder';

export const organizationClassesPathBuilder = ({
  args,
}: PathBuilderProps<OrganizationClassesQueryVariables>): string => {
  const { page, pageSize } = args;

  const variableToKeyItems = [
    { key: 'page', value: page },
    { key: 'page_size', value: pageSize },
  ];

  const query = queryBuilder(variableToKeyItems);

  return `/organization_class/${query}`;
};
