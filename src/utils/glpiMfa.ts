interface GlpiMfaResponse {
  success: boolean;
  message: string;
}

export const verifyGlpiMfa = async (
  otp: string,
  senderEmail: string,
  receiverEmail: string
): Promise<GlpiMfaResponse> => {
  try {
    // This is a placeholder for the actual GLPI MFA verification
    const response = await fetch('http://glpi.ngageapp.com:81/marketplace/mfa/front/verify.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        otp,
        senderEmail,
        receiverEmail 
      }),
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

export const getDefaultMfaConfig = async (): Promise<{
  defaultSenderEmail: string;
  defaultReceiverEmail: string;
}> => {
  try {
    const response = await fetch('http://glpi.ngageapp.com:81/marketplace/mfa/front/config.php');
    const data = await response.json();
    return {
      defaultSenderEmail: data.defaultSenderEmail || '',
      defaultReceiverEmail: data.defaultReceiverEmail || '',
    };
  } catch (error) {
    console.error('Failed to fetch MFA configuration:', error);
    return {
      defaultSenderEmail: '',
      defaultReceiverEmail: '',
    };
  }
};