import { generateAgentId } from './campaignHandler.js'     // function that builds <INITIALS>-<last4>
import { sendEmail } from './email.js'                      // your existing email util

export async function sendAgentIdEmail(fullName, email, userId) {
  const agentId = generateAgentId(fullName, userId)     // e.g. "UBG-4f9c"
  const html = `
    <h1>Welcome to Brownie City!</h1>
    <p>Your Agent ID is: <strong>${agentId}</strong></p>
    <p>Use this ID and your email to enter the campaign dashboard.</p>
  `
  await sendEmail(email, 'Your Brownie City Agent ID', html)
  return agentId
}
