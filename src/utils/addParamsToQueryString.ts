export default function addParamsToQueryString<
  U extends Record<string, unknown>
>(
  queryString: string,
  queryParams: Partial<U>,
  getParamValue?: (o: { param: keyof U; value: string }) => string
): string {
  const searchParams = new URLSearchParams(queryString);
  Object.entries(queryParams).forEach(([key, values]) => {
    const param = key;

    /* istanbul ignore else */
    if (Array.isArray(values)) {
      values.forEach((value) =>
        searchParams.append(
          param,
          getParamValue ? getParamValue({ param, value }) : value
        )
      );
    } else if (values) {
      searchParams.append(
        param,
        getParamValue
          ? getParamValue({ param, value: values.toString() })
          : values.toString()
      );
    }
  });

  return searchParams.toString() ? `?${searchParams.toString()}` : '';
}
