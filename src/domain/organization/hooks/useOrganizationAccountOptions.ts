import { useOrganizationAccountsQuery } from '../../../generated/graphql';
import { OptionType } from '../../../types';
import getValue from '../../../utils/getValue';

export type UseOrganizationAccountOptionsProps = {
  organizationId: string;
};

type UseOrganizationAccountOptionsState = {
  loading: boolean;
  options: OptionType[];
};

const useOrganizationAccountOptions = ({
  organizationId,
}: UseOrganizationAccountOptionsProps): UseOrganizationAccountOptionsState => {
  const { loading, data } = useOrganizationAccountsQuery({
    skip: !organizationId,
    variables: { id: organizationId },
  });

  return {
    loading,
    options: getValue(
      data?.organizationAccounts?.map((a) => ({
        label: getValue(a.name, ''),
        value: getValue(a.id?.toString(), ''),
      })),
      []
    ),
  };
};

export default useOrganizationAccountOptions;
