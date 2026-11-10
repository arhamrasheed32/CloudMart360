import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  GetUserCommand,
  AdminAddUserToGroupCommand
} from '@aws-sdk/client-cognito-identity-provider';

const REGION = process.env.AWS_REGION || 'us-east-1';
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || 'us-east-1_aWsjVAZMm';
const CLIENT_ID = process.env.COGNITO_CLIENT_ID || '5p961anbgak41rcc1nrdaq45jr';

const cognitoClient = new CognitoIdentityProviderClient({ region: REGION });

/**
 * 1. Customer Sign Up (Triggers 6-digit confirmation code to their email)
 */
export async function customerSignUp(email, password, fullName = '') {
  const userAttributes = [
    { Name: 'email', Value: email }
  ];
  if (fullName) {
    userAttributes.push({ Name: 'name', Value: fullName });
  }

  const command = new SignUpCommand({
    ClientId: CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: userAttributes
  });

  return await cognitoClient.send(command);
}

/**
 * 2. Confirm Email Verification with 6-digit code
 */
export async function verifyEmailCode(email, confirmationCode) {
  const command = new ConfirmSignUpCommand({
    ClientId: CLIENT_ID,
    Username: email,
    ConfirmationCode: confirmationCode
  });

  const res = await cognitoClient.send(command);

  // Auto-assign to Customers group upon verification
  try {
    await cognitoClient.send(
      new AdminAddUserToGroupCommand({
        UserPoolId: USER_POOL_ID,
        Username: email,
        GroupName: 'Customers'
      })
    );
  } catch (err) {
    console.warn('[Cognito] Group assignment note:', err.message);
  }

  return res;
}

/**
 * 3. Sign In (for both Customers and Admins)
 */
export async function authenticateUser(email, password) {
  const command = new InitiateAuthCommand({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password
    }
  });

  const response = await cognitoClient.send(command);
  const idToken = response.AuthenticationResult?.IdToken;
  const accessToken = response.AuthenticationResult?.AccessToken;

  // Decode JWT payload to get role (Admin vs Customer)
  let role = 'customer';
  let userEmail = email;
  if (idToken) {
    try {
      const payloadBase64 = idToken.split('.')[1];
      const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
      const groups = payload['cognito:groups'] || [];
      if (groups.includes('Admins') || email.toLowerCase() === 'admin@cloudmart360.com') {
        role = 'admin';
      }
      userEmail = payload.email || email;
    } catch (e) {
      console.warn('Token decode error:', e);
    }
  }

  return {
    success: true,
    email: userEmail,
    role,
    accessToken,
    idToken,
    expiresIn: response.AuthenticationResult?.ExpiresIn
  };
}
