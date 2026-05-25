import { getEnvValue } from '../common/utils/envUtils';

/**
 * Check is the code run in test environment
 */
export default getEnvValue('NODE_ENV') === 'test';
