// Correspondence Drafter - Prototype Version
// This version simulates saving but doesn't persist changes on refresh
(function() {
  'use strict';
  
  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Correspondence drafter initialized');
    
    // Get elements
    let saveTimeout;
    const letterContent = document.getElementById('letter-content');
    const saveIndicator = document.getElementById('save-indicator');
    
    // Function to update save indicator
    function updateSaveIndicator() {
      if (!saveIndicator) return;
      
      const now = new Date();
      const timeString = now.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      saveIndicator.textContent = 'Last saved on ' + timeString;
    }
    
    // Function to update character count
    function updateCharacterCount() {
      const charCountElement = document.getElementById('char-count');
      const wordCountElement = document.getElementById('word-count');
      
      if (letterContent && charCountElement && wordCountElement) {
        const text = letterContent.innerText || letterContent.textContent;
        const charCount = text.length;
        const wordCount = text.trim().split(/\s+/).filter(function(word) {
          return word.length > 0;
        }).length;
        
        charCountElement.textContent = charCount;
        wordCountElement.textContent = wordCount;
      }
    }
    
    // Initialize save indicator on page load
    if (saveIndicator) {
      updateSaveIndicator();
    }
    
    // Set up letter editing
    if (letterContent) {
      // Initial character count
      updateCharacterCount();
      
      // Listen for input changes
      letterContent.addEventListener('input', function() {
        clearTimeout(saveTimeout);
        
        if (saveIndicator) {
          saveIndicator.textContent = 'Editing...';
        }
        
        // Simulate auto-save after 2 seconds
        saveTimeout = setTimeout(function() {
          updateSaveIndicator();
          console.log('Simulated save (not actually saved)');
        }, 2000);
        
        updateCharacterCount();
      });
    }
    
    // MOJ Sub-navigation tab switching
    const subNavLinks = document.querySelectorAll('.moj-sub-navigation__link');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    subNavLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const panelId = this.getAttribute('data-panel');
        
        // Remove aria-current from all links
        subNavLinks.forEach(function(navLink) {
          navLink.removeAttribute('aria-current');
        });
        
        // Add aria-current to clicked link
        this.setAttribute('aria-current', 'page');
        
        // Hide all panels
        tabPanels.forEach(function(panel) {
          panel.style.display = 'none';
        });
        
        // Show selected panel
        const selectedPanel = document.getElementById(panelId + '-panel');
        if (selectedPanel) {
          selectedPanel.style.display = 'block';
        }
      });
    });
    
    // Manual save button
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', function(e) {
        e.preventDefault();
        updateSaveIndicator();
        alert('Letter saved successfully (prototype - not actually saved)');
      });
    }
    
    // Delete button
    const deleteBtn = document.getElementById('delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this letter?')) {
          alert('Letter deleted (prototype - page will refresh to show original)');
          location.reload();
        }
      });
    }
    
    // Request review button
    const reviewBtn = document.getElementById('review-btn');
    if (reviewBtn) {
      reviewBtn.addEventListener('click', function(e) {
        e.preventDefault();
        updateSaveIndicator();
        alert('Review request submitted (prototype)');
      });
    }
    
    // Send to CMS button
    const cmsBtn = document.getElementById('cms-btn');
    if (cmsBtn) {
      cmsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Send this letter to CMS?')) {
          updateSaveIndicator();
          alert('Letter sent to CMS successfully (prototype)');
        }
      });
    }
    
  }); // End DOMContentLoaded
  
})();