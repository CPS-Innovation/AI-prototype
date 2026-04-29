//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// ── Testing flow ──────────────────────────────────────────────────────────────

const RESPONSES_FILE = path.join(__dirname, 'data', 'responses.json')

function loadResponses () {
  try {
    return JSON.parse(fs.readFileSync(RESPONSES_FILE, 'utf8'))
  } catch (e) {
    return []
  }
}

function saveResponses (responses) {
  fs.writeFileSync(RESPONSES_FILE, JSON.stringify(responses, null, 2), 'utf8')
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
  res.render('testing/questions')
})

// POST /testing/submit — save responses and redirect to thank-you
router.post('/testing/submit', function (req, res) {
  const responses = loadResponses()
  responses.push({
    participantId: req.session.data['participant-id'] || 'unknown',
    timestamp: new Date().toISOString(),
    q1: req.body.q1 || '',
    q2: req.body.q2 || '',
    q3: req.body.q3 || ''
  })
  saveResponses(responses)
  res.redirect('/testing/thank-you')
})

// GET /testing/thank-you
router.get('/testing/thank-you', function (req, res) {
  res.render('testing/thank-you')
})

// ── End testing flow ──────────────────────────────────────────────────────────
