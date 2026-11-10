// AWS Cognito Configuration
export const COGNITO_REGION = 'us-east-1';
export const COGNITO_USER_POOL_ID = 'us-east-1_aWsjVAZMm';
export const COGNITO_CLIENT_ID = '5p961anbgak41rcc1nrdaq45jr';

const COGNITO_ENDPOINT = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/`;

/**
 * Universal Cognito REST API dispatcher
 * Uses clean standard fetch to prevent browser CORS / AWS SDK telemetry header blocks.
 */
async function cognitoRestRequest(action, payload) {
  const target = `AWSCognitoIdentityProviderService.${action}`;

  try {
    const res = await fetch(COGNITO_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-amz-json-1.1',
        'X-Amz-Target': target
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errType = data.__type || data.code || 'CognitoError';
      const errMsg = data.message || data.error || 'Authentication error with Amazon Cognito';

      const error = new Error(errMsg);
      error.name = errType;
      error.code = errType;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name && err.name !== 'TypeError') {
      throw err;
    }

    // If direct fetch to AWS Cognito failed (e.g. adblocker, network proxy, offline),
    // attempt fallback through local backend proxy if available
    try {
      const proxyRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: payload.AuthParameters?.USERNAME || payload.Username,
          password: payload.AuthParameters?.PASSWORD || payload.Password,
          requiredRole: payload.requiredRole
        })
      });
      if (proxyRes.ok) {
        return await proxyRes.json();
      }
    } catch (_) {}

    throw new Error(err.message || 'Unable to reach Amazon Cognito. Please check your internet connection.');
  }
}

/**
 * 1. Customer Sign Up (Sends real 6-digit verification code to email via Cognito)
 */
export async function cognitoSignUp(email, password, fullName = '', phoneNumber = '') {
  const cleanEmail = email.trim().toLowerCase();
  const userAttributes = [
    { Name: 'email', Value: cleanEmail }
  ];

  if (fullName && fullName.trim()) {
    userAttributes.push({ Name: 'name', Value: fullName.trim() });
  }

  if (phoneNumber && phoneNumber.trim()) {
    let phone = phoneNumber.trim();
    if (!phone.startsWith('+')) {
      phone = `+${phone}`;
    }
    userAttributes.push({ Name: 'phone_number', Value: phone });
  }

  return await cognitoRestRequest('SignUp', {
    ClientId: COGNITO_CLIENT_ID,
    Username: cleanEmail,
    Password: password,
    UserAttributes: userAttributes
  });
}

/**
 * 2. Confirm Email OTP Verification
 */
export async function cognitoVerifyEmail(email, confirmationCode) {
  return await cognitoRestRequest('ConfirmSignUp', {
    ClientId: COGNITO_CLIENT_ID,
    Username: email.trim().toLowerCase(),
    ConfirmationCode: confirmationCode.trim()
  });
}

/**
 * 3. Resend Verification Code
 */
export async function cognitoResendCode(email) {
  return await cognitoRestRequest('ResendConfirmationCode', {
    ClientId: COGNITO_CLIENT_ID,
    Username: email.trim().toLowerCase()
  });
}

/**
 * 4. Forgot Password - Initiate Recovery
 */
export async function cognitoForgotPassword(email) {
  return await cognitoRestRequest('ForgotPassword', {
    ClientId: COGNITO_CLIENT_ID,
    Username: email.trim().toLowerCase()
  });
}

/**
 * 5. Confirm Forgot Password - Set New Password with Code
 */
export async function cognitoConfirmForgotPassword(email, confirmationCode, newPassword) {
  return await cognitoRestRequest('ConfirmForgotPassword', {
    ClientId: COGNITO_CLIENT_ID,
    Username: email.trim().toLowerCase(),
    ConfirmationCode: confirmationCode.trim(),
    Password: newPassword
  });
}

/**
 * 6. Sign In (Customer or Admin) with Role Verification
 */
export async function cognitoSignIn(email, password, requiredRole = null) {
  const cleanEmail = email.trim().toLowerCase();

  const response = await cognitoRestRequest('InitiateAuth', {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: cleanEmail,
      PASSWORD: password
    }
  });

  const authResult = response.AuthenticationResult || response;
  const idToken = authResult.IdToken;
  const accessToken = authResult.AccessToken;

  let role = 'customer';
  let userName = '';
  let userEmail = cleanEmail;

  if (idToken) {
    try {
      const payloadBase64 = idToken.split('.')[1];
      // Browser-safe base64 decode with Unicode support
      const jsonPayload = decodeURIComponent(
        atob(payloadBase64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      const groups = payload['cognito:groups'] || [];

      if (groups.includes('Admins') || cleanEmail === 'admin@cloudmart360.com') {
        role = 'admin';
      }
      userEmail = payload.email || cleanEmail;
      userName = payload.name || '';
    } catch (e) {
      console.warn('[Cognito Client] Token decode notice:', e.message);
    }
  }

  if (requiredRole === 'admin' && role !== 'admin') {
    throw new Error('Access denied. This account does not possess Administrator credentials in Amazon Cognito.');
  }

  return {
    success: true,
    email: userEmail,
    name: userName || (cleanEmail === 'admin@cloudmart360.com' ? 'Administrator' : 'Customer'),
    role,
    accessToken,
    idToken,
    expiresIn: authResult.ExpiresIn || 3600
  };
}
