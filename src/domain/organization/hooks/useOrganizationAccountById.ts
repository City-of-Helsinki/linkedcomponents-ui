import {
  useOrganizationAccountsQuery,
  WebStoreAccountFieldsFragment,
} from '../../../generated/graphql';

export type UseOrganizationAccountByIdProps = {
  id: string;
  organizationId: string;
};

const useOrganizationAccountById = ({
  id,
  organizationId,
}: UseOrganizationAccountByIdProps):
  | WebStoreAccountFieldsFragment
  | undefined => {
  const { data } = useOrganizationAccountsQuery({
    skip: !organizationId,
    variables: { id: organizationId },
  });

  return data?.organizationAccounts?.find((a) => a.id?.toString() === id);
};

export default useOrganizationAccountById;
