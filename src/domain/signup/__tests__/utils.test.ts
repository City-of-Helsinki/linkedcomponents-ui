import { SignupQueryVariables } from '../../../generated/graphql';
import { signupPathBuilder } from '../../signupGroup/utils';

describe('signupPathBuilder function', () => {
  const cases: [SignupQueryVariables, string][] = [
    [{ id: 'hel:123' }, `/signup/hel:123/`],
  ];

  it.each(cases)('should build correct path', (variables, expectedPath) =>
    expect(signupPathBuilder({ args: variables })).toBe(expectedPath)
  );
});
