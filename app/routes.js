//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

// ── Testing flow ──────────────────────────────────────────────────────────────

// In-memory store — persists for the lifetime of the Heroku dyno
const testingResponses = []

// Also persist to file for local dev
const RESPONSES_FILE = path.join(__dirname, 'data', 'responses.json')

function saveResponseToFile (entry) {
  try {
    let existing = []
    if (fs.existsSync(RESPONSES_FILE)) {
      existing = JSON.parse(fs.readFileSync(RESPONSES_FILE, 'utf8'))
    }
    existing.push(entry)
    fs.writeFileSync(RESPONSES_FILE, JSON.stringify(existing, null, 2), 'utf8')
  } catch (e) {
    // Silently skip on Heroku ephemeral filesystem
  }
}

// GET /testing/consent
router.get('/testing/consent', function (req, res) {
  res.render('testing/consent')
})

// POST /testing/consent — validate checkbox, set session flags
router.post('/testing/consent', function (req, res) {
  const consentValue = req.session.data['consent']
  const consentGiven = [].concat(consentValue || []).includes('yes')

  if (!consentGiven) {
    req.session.data.errors = [{ field: 'consent', message: 'You must tick the box to continue' }]
    return res.render('testing/consent', { errors: req.session.data.errors })
  }
  req.session.data['clarity-consented'] = 'true'
  req.session.data['participant-id'] = crypto.randomUUID()
  req.session.data['consent'] = null
  req.session.data.errors = []
  res.redirect('/testing/instructions')
})

// GET /testing/instructions
router.get('/testing/instructions', function (req, res) {
  if (req.session.data['clarity-consented'] !== 'true') {
    return res.redirect('/testing/consent')
  }
  res.render('testing/instructions')
})

// POST /testing/start — begin the prototype task
router.post('/testing/start', function (req, res) {
  res.redirect('/case-graph/unmoderated/overview')
})

// GET /testing/questions
router.get('/testing/questions', function (req, res) {
  if (req.session.data['clarity-consented'] !== 'true') {
    return res.redirect('/testing/consent')
  }
  // Clear any previously stored answers so the form is always blank
  req.session.data['q1'] = ''
  req.session.data['q2'] = ''
  req.session.data['q3'] = ''
  res.render('testing/questions')
})

// POST /testing/submit — save to in-memory store and file, then redirect
router.post('/testing/submit', function (req, res) {
  const entry = {
    participantId: req.session.data['participant-id'] || 'unknown',
    timestamp: new Date().toISOString(),
    q1: req.session.data['q1'] || '',
    q2: req.session.data['q2'] || '',
    q3: req.session.data['q3'] || ''
  }
  testingResponses.push(entry)
  saveResponseToFile(entry)
  res.redirect('/testing/thank-you')
})

// GET /testing/dashboard — password protected summary of all responses
router.get('/testing/dashboard', function (req, res) {
  if (req.query.key !== process.env.DASHBOARD_KEY && req.query.key !== 'research') {
    return res.status(401).send('<h1>Unauthorised</h1><p>Add ?key=research to the URL.</p>')
  }

  // Merge in-memory responses with any saved in the file
  let fileResponses = []
  try {
    if (fs.existsSync(RESPONSES_FILE)) {
      fileResponses = JSON.parse(fs.readFileSync(RESPONSES_FILE, 'utf8'))
    }
  } catch (e) {}

  // Deduplicate by participantId, preferring in-memory entries
  const seen = new Set()
  const allResponses = [...testingResponses, ...fileResponses].filter(function (r) {
    if (seen.has(r.participantId)) return false
    seen.add(r.participantId)
    return true
  })

  res.render('testing/dashboard', { responses: allResponses })
})

// GET /testing/thank-you
router.get('/testing/thank-you', function (req, res) {
  res.render('testing/thank-you')
})

// ── End testing flow ──────────────────────────────────────────────────────────
