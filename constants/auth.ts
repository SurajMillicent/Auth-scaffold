/** localStorage / cookie key names. */
export const TOKEN_KEY = "auth_access_token";
export const REFRESH_TOKEN_KEY = "auth_refresh_token";
export const USER_KEY = "auth_user";

/** How many ms before expiry we proactively refresh the token. */
export const REFRESH_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes
