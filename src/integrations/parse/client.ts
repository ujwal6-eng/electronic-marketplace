// Parse SDK Client Configuration
import Parse from 'parse';

// Initialize Parse with your server configuration
const PARSE_SERVER_URL = 'http://localhost:1339/parse';
const PARSE_APP_ID = 'gameAppId';
const PARSE_JAVASCRIPT_KEY = ''; // Optional: JavaScript Key if configured

// Initialize Parse SDK
Parse.initialize(PARSE_APP_ID, PARSE_JAVASCRIPT_KEY);
(Parse as any).serverURL = PARSE_SERVER_URL;

// Enable local datastore for offline capability (optional)
// Parse.enableLocalDatastore();

export { Parse };
export default Parse;

// Helper to get current user
export const getCurrentUser = (): Parse.User | null => {
  return Parse.User.current() || null;
};

// Helper to check if user is logged in
export const isAuthenticated = (): boolean => {
  return !!Parse.User.current();
};
