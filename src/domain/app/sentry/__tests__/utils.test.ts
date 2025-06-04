import {
  beforeSend,
  beforeSendTransaction,
  cleanSensitiveData,
} from '../utils';

const sensitive = 'sensitive';
const safe = 'safe';

const originalData = {
  a: safe,
  access_code: sensitive,
  accessCode: sensitive,
  city: sensitive,
  dateOfBirth: sensitive,
  email: sensitive,
  extraInfo: sensitive,
  firstName: sensitive,
  lastName: sensitive,
  membershipNumber: sensitive,
  nativeLanguage: sensitive,
  phoneNumber: sensitive,
  postalCode: sensitive,
  serviceLanguage: sensitive,
  session: sensitive,
  streetAddress: sensitive,
  userEmail: sensitive,
  userName: sensitive,
  userPhoneNumber: sensitive,
  zipcode: sensitive,
  arrayOfObjects: [
    { a: safe, accessCode: sensitive },
    { b: safe, accessCode: sensitive },
  ],
  arrayOfStrings: [safe],
  object: { c: safe, userEmail: sensitive, userName: sensitive },
  referenceObject: {},
};

const cleanedData = {
  a: safe,
  arrayOfObjects: [{ a: safe }, { b: safe }],
  arrayOfStrings: [safe],
  object: { c: safe },
  referenceObject: {},
};

describe('beforeSend', () => {
  it('should clear sensitive data', () => {
    expect(
      beforeSend({ extra: { data: originalData }, type: undefined })
    ).toEqual({ extra: { data: cleanedData } });
  });
});

describe('beforeSendTransaction', () => {
  it('should clear sensitive data', () => {
    expect(
      beforeSendTransaction({
        extra: { data: originalData },
        type: 'transaction',
      })
    ).toEqual({ extra: { data: cleanedData }, type: 'transaction' });
  });
});

describe('cleanSensitiveData', () => {
  it('should clear sensitive data', () => {
    expect(cleanSensitiveData(originalData)).toEqual(cleanedData);
  });

  it('should handle circular references without throwing an error', () => {
    originalData['referenceObject'] = originalData;
    cleanedData['referenceObject'] = cleanedData;
    expect(cleanSensitiveData(originalData)).toEqual(cleanedData);
  });
});
