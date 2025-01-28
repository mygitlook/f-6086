interface GlpiMfaResponse {
  success: boolean;
  message: string;
}

export const verifyGlpiMfa = async (otp: string): Promise<GlpiMfaResponse> => {
  try {
    // This is a placeholder for the actual GLPI MFA verification
    // You would need to replace this with your actual GLPI API endpoint
    const response = await fetch('http://glpi.ngageapp.com:81/marketplace/mfa/front/verify.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp }),
    });

    const data = await response.json();
    return {
      success: data.success,
      message: data.message || 'Verification completed',
    };
  } catch (error) {
    console.error('GLPI MFA verification error:', error);
    return {
      success: false,
      message: 'Failed to verify code. Please try again.',
    };
  }
};