/**
 * Environment variable validator
 * Ensures all required environment variables are present before starting the application
 */

/**
 * Validates required environment variables (private function)
 * @param {Array<string>} requiredVars - Array of required environment variable names
 * @throws {Error} If any required variable is missing
 */
const validateEnv = (requiredVars) => {
  const missing = [];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  console.log('✅ All required environment variables are present');
};

/**
 * Validates all application environment variables
 * This is the main validation function to be called at server startup
 * @throws {Error} If any required variable is missing
 */
export const validateAppEnv = () => {
  // Application environment variables
  const requiredVars = [
    // Server configuration
    'PORT',
    
    // Better Auth configuration
    'AUTH_SECRET',
    'BASE_URL',
    'DATABASE_URL',
    
    // Email service configuration
    'RESEND_API_KEY',
    'FROM_EMAIL',
    
    // Frontend configuration
    'FE_URL'
  ];
  
  validateEnv(requiredVars);
};