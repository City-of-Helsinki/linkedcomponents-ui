import { useOrganizationMerchantsQuery } from '../../../generated/graphql';
import { OptionType } from '../../../types';
import getValue from '../../../utils/getValue';

export type UseOrganizationMerchantOptionsProps = {
  organizationId: string;
};

type UseOrganizationMerchantOptionsState = {
  loading: boolean;
  options: OptionType[];
};

const useOrganizationMerchantOptions = ({
  organizationId,
}: UseOrganizationMerchantOptionsProps): UseOrganizationMerchantOptionsState => {
  const { loading, data } = useOrganizationMerchantsQuery({
    skip: !organizationId,
    variables: { id: organizationId },
  });

  return {
    loading,
    options: getValue(
      data?.organizationMerchants?.map((m) => ({
        label: getValue(m.name, ''),
        value: getValue(m.id?.toString(), ''),
      })),
      []
    ),
  };
};

export default useOrganizationMerchantOptions;
