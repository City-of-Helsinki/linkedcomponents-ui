import {
  useOrganizationMerchantsQuery,
  WebStoreMerchantFieldsFragment,
} from '../../../generated/graphql';

export type UseOrganizationAccountByIdProps = {
  id: string;
  organizationId: string;
};

const useOrganizationMerchantById = ({
  id,
  organizationId,
}: UseOrganizationAccountByIdProps):
  | WebStoreMerchantFieldsFragment
  | undefined => {
  const { data } = useOrganizationMerchantsQuery({
    skip: !organizationId,
    variables: { id: organizationId },
  });

  return data?.organizationMerchants?.find((a) => a.id?.toString() === id);
};

export default useOrganizationMerchantById;
