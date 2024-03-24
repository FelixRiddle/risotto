/**
 * Check if email is disabled
 * 
 * That is the application will not send any email.
 */
export function isEmailDisabled() {
    return !process.env.DISABLE_EMAIL || process.env.DISABLE_EMAIL.toLowerCase() === "false";
}
