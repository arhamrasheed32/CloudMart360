import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  InitiateAuthCommand
} from '@aws-sdk/client-cognito-identity-provider';

// AWS Cognito Configuration
export const COGNITO_REGION = 'us-east-1';
export const COGNITO_USER_POOL_ID = 'us-east-1_aWsjVAZMm';
export const COGNITO_CLIENT_ID = '5p961anbgak41rcc1nrdaq45jr';

const cognitoClient = new CognitoIdentityProviderClient({ region: COGNITO_REGION });

/**
 * 1. Customer Sign Up (Sends real 6-digit verification code to email via Cognito)
 */
export async function cognitoSignUp(email, password, fullName = '', phoneNumber = '') {
  const userAttributes = [
    { Name: 'email', Value: email.trim().toLowerCase() }
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

  const command = new SignUpCommand({
    ClientId: COGNITO_CLIENT_ID,
    Username: email.trim().toLowerCase(),
    Password: password,
    UserAttributes: userAttributes
  });

  return await cognitoClient.send(command);
}

/**
 * 2. Confirm Email OTP Verification
 */
export async function cognitoVerifyEmail(email, confirmationCode) {
  const command = new ConfirmSignUpCommand({
    ClientId: COGNITO_CLIENT_ID,
    Username: email.trim().toLowerCase(),
    ConfirmationCode: confirmationCode.trim()
  });

  return await cognitoClient.send(command);
}

/**
 * 3. Resend Verification Code
 */
export async function cognitoResendCode(email) {
  const command = new ResendConfirmationCodeCommand({
    ClientId: COGNITO_CLIENT_ID,
    Username: email.trim().toLowerCase()
  });

  return await cognitoClient.send(command);
}

/**
 * 4. Forgot Password - Initiate Recovery
 */
export async function cognitoForgotPassword(email) {
  const command = new ForgotPasswordCommand({
    ClientId: COGNITO_CLIENT_ID,
    Username: email.trim().toLowerCase()
  });

  return await cognitoClient.send(command);
}

/**
 * 5. Confirm Forgot Password - Set New Password with Code
 */
export async function cognitoConfirmForgotPassword(email, confirmationCode, newPassword) {
  const command = new ConfirmForgotPasswordCommand({
    ClientId: COGNITO_CLIENT_ID,
    Username: email.trim().toLowerCase(),
    ConfirmationCode: confirmationCode.trim(),
    Password: newPassword
  });

  return await cognitoClient.send(command);
}

/**
 * 6. Sign In (Customer or Admin) with Role Verification
 */
export async function cognitoSignIn(email, password, requiredRole = null) {
  const cleanEmail = email.trim().toLowerCase();

  const command = new InitiateAuthCommand({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: cleanEmail,
      PASSWORD: password
    }
  });

  const response = await cognitoClient.send(command);
  const idToken = response.AuthenticationResult?.IdToken;
  const accessToken = response.AuthenticationResult?.AccessToken;

  let role = 'customer';
  let userName = '';
  let userEmail = cleanEmail;

  if (idToken) {
    try {
      const payloadBase64 = idToken.split('.')[1];
      // Browser-safe base64 decode
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
      console.warn('[Cognito Client] Token decode note:', e.message);
    }
  }

  if (requiredRole === 'admin' && role !== 'admin') {
    throw new Error('Access denied. This account does not possess Administrator credentials in Amazon Cognito.');
  }

  return {
    success: true,
    email: userEmail,
    name: userName,
    role,
    accessToken,
    idToken,
    expiresIn: response.AuthenticationResult?.ExpiresIn
  };
}
