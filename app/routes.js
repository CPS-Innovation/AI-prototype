//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const crypto = require('crypto')

// ── Testing flow ──────────────────────────────────────────────────────────────

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

// POST /testing/submit — answers stored in session by autoStoreData; Clarity tags set on thank-you page
router.post('/testing/submit', function (req, res) {
  res.redirect('/testing/thank-you')
})

// GET /testing/thank-you
router.get('/testing/thank-you', function (req, res) {
  res.render('testing/thank-you')
})

// ── End testing flow ──────────────────────────────────────────────────────────
