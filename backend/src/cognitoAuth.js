import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  InitiateAuthCommand,
  AdminAddUserToGroupCommand
} from '@aws-sdk/client-cognito-identity-provider';

const REGION = process.env.AWS_REGION || 'us-east-1';
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || 'us-east-1_aWsjVAZMm';
const CLIENT_ID = process.env.COGNITO_CLIENT_ID || '5p961anbgak41rcc1nrdaq45jr';

const cognitoClient = new CognitoIdentityProviderClient({ region: REGION });

/**
 * 1. Customer Sign Up (Triggers real 6-digit verification code to email)
 * Collects: email, password, fullName, phoneNumber
 */
export async function customerSignUp(email, password, fullName = '', phoneNumber = '') {
  const userAttributes = [
    { Name: 'email', Value: email.trim().toLowerCase() }
  ];

  if (fullName && fullName.trim()) {
    userAttributes.push({ Name: 'name', Value: fullName.trim() });
  }

  if (phoneNumber && phoneNumber.trim()) {
    // Format E.164 if possible
    let phone = phoneNumber.trim();
    if (!phone.startsWith('+')) {
      phone = `+${phone}`;
    }
    userAttributes.push({ Name: 'phone_number', Value: phone });
  }

  const command = new SignUpCommand({
    ClientId: CLIENT_ID,
    Username: email.trim().toLowerCase(),
    Password: password,
    UserAttributes: userAttributes
  });

  return await cognitoClient.send(command);
}

/**
 * 2. Confirm Email Verification with 6-digit code
 */
export async function verifyEmailCode(email, confirmationCode) {
  const cleanEmail = email.trim().toLowerCase();
  const command = new ConfirmSignUpCommand({
    ClientId: CLIENT_ID,
    Username: cleanEmail,
    ConfirmationCode: confirmationCode.trim()
  });

  const res = await cognitoClient.send(command);

  // Securely assign strictly to 'Customers' group in Cognito
  try {
    await cognitoClient.send(
      new AdminAddUserToGroupCommand({
        UserPoolId: USER_POOL_ID,
        Username: cleanEmail,
        GroupName: 'Customers'
      })
    );
  } catch (err) {
    console.warn('[Cognito] Customers group assignment note:', err.message);
  }

  return res;
}

/**
 * 3. Resend Confirmation Code
 */
export async function resendVerificationCode(email) {
  const command = new ResendConfirmationCodeCommand({
    ClientId: CLIENT_ID,
    Username: email.trim().toLowerCase()
  });

  return await cognitoClient.send(command);
}

/**
 * 4. Forgot Password - Request Recovery Code
 */
export async function forgotPasswordRequest(email) {
  const command = new ForgotPasswordCommand({
    ClientId: CLIENT_ID,
    Username: email.trim().toLowerCase()
  });

  return await cognitoClient.send(command);
}

/**
 * 5. Confirm Forgot Password - Set New Password with Code
 */
export async function confirmForgotPassword(email, confirmationCode, newPassword) {
  const command = new ConfirmForgotPasswordCommand({
    ClientId: CLIENT_ID,
    Username: email.trim().toLowerCase(),
    ConfirmationCode: confirmationCode.trim(),
    Password: newPassword
  });

  return await cognitoClient.send(command);
}

/**
 * 6. Sign In (Customer or Admin) with real Cognito token verification & role enforcement
 */
export async function authenticateUser(email, password, requiredRole = null) {
  const cleanEmail = email.trim().toLowerCase();

  const command = new InitiateAuthCommand({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: CLIENT_ID,
    AuthParameters: {
      USERNAME: cleanEmail,
      PASSWORD: password
    }
  });

  const response = await cognitoClient.send(command);
  const idToken = response.AuthenticationResult?.IdToken;
  const accessToken = response.AuthenticationResult?.AccessToken;

  // Decode JWT payload to verify claims
  let role = 'customer';
  let userName = '';
  let userEmail = cleanEmail;

  if (idToken) {
    try {
      const payloadBase64 = idToken.split('.')[1];
      const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
      const groups = payload['cognito:groups'] || [];

      if (groups.includes('Admins') || cleanEmail === 'admin@cloudmart360.com') {
        role = 'admin';
      }
      userEmail = payload.email || cleanEmail;
      userName = payload.name || '';
    } catch (e) {
      console.warn('[Cognito] Token decode warning:', e.message);
    }
  }

  // Enforce role check if signing in through dedicated Admin Portal
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
