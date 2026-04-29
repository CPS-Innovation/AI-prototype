module.exports = {

  // Materials card notification state: 'complete' | 'incomplete'
  'm-status': 'complete',

  // Whether new content has been added since last review: 'true' | 'false'
  'm-new': 'false',

  // ── Unmoderated testing ───────────────────────────────────────────────────

  // Set by the consent route — controls Clarity script injection
  'clarity-consented': 'false',

  // Set by the consent route — UUID to correlate Clarity sessions with responses
  'participant-id': '',

  // Task brief shown on the instructions page
  'testing-task': 'You have been given access to a case summary tool. Imagine you are a lawyer who has just been assigned to a case. Using this tool, find out as much as you can about the case — for example, the defendants, the charges, and the key events. Explore the tool as you normally would. When you are ready, click \'Finish task\'.',

  // Post-task questions (edit these before each research session)
  'testing-q1': 'How easy or difficult did you find it to understand the case using this tool?',
  'testing-q2': 'Was there anything that confused or frustrated you?',
  'testing-q3': 'Is there anything else you would like to tell us?'

}
