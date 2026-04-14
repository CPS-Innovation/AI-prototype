
// AI disclaimer banner session-based dismissal
document.addEventListener('DOMContentLoaded', function() {
  var banner = document.getElementById('ai-disclaimer-banner');
  var btn = document.getElementById('ai-disclaimer-acknowledge');
  if (banner && btn) {
    if (window.sessionStorage.getItem('aiDisclaimerAcknowledged')) {
      banner.style.display = 'none';
    }
    btn.addEventListener('click', function() {
      window.sessionStorage.setItem('aiDisclaimerAcknowledged', 'yes');
      banner.style.display = 'none';
    });
  }
});
//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {
  // Add JavaScript here
})
