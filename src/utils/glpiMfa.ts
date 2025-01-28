interface GlpiMfaResponse {
  success: boolean;
  message: string;
}

export const verifyGlpiMfa = async (
  code: string
): Promise<GlpiMfaResponse> => {
  try {
    const response = await fetch('http://glpi.ngageapp.com:81/marketplace/mfa/front/verify.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      return {
        success: true,
        message: 'Code verified successfully',
      };
    }
    
    throw new Error(data.message || 'Verification failed');
  } catch (error) {
    console.error('Failed to verify code:', error);
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