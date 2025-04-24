// Webflow Integration für das Accessibility Widget (React Version)
(function() {
  // ===== KONFIGURATION =====
  // URL zum gehosteten Widget (ANPASSEN!)
  const widgetUrl = 'https://ihr-host.com/widget/';  // Pfad zu Ihrem gehosteten Widget
  
  // Widget-Höhe und -Breite
  const buttonSize = '60px';         // Größe des geschlossenen Widgets (Button)
  const expandedWidth = '360px';     // Breite des geöffneten Widgets
  const expandedHeight = '600px';    // Höhe des geöffneten Widgets
  
  // Position auf der Webseite
  const position = {
    bottom: '20px',
    right: '20px'
  };
  
  // ===== WIDGET-ERSTELLUNG =====
  // iframe-Container erstellen
  const container = document.createElement('div');
  container.id = 'accessibility-widget-container';
  Object.assign(container.style, {
    position: 'fixed',
    bottom: position.bottom,
    right: position.right,
    zIndex: '999999',
    width: 'auto',
    height: 'auto',
    overflow: 'visible'
  });
  
  // iframe erstellen
  const iframe = document.createElement('iframe');
  iframe.title = 'Barrierefreiheits-Widget';
  iframe.src = widgetUrl;
  Object.assign(iframe.style, {
    border: 'none',
    width: buttonSize,
    height: buttonSize,
    borderRadius: '50%',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#2563eb'  // Primärfarbe
  });
  
  // Widget-Zustand
  let isExpanded = false;
  
  // ===== HILFSFUNKTIONEN =====
  // Widget erweitern/verkleinern
  function toggleWidget() {
    isExpanded = !isExpanded;
    
    if (isExpanded) {
      Object.assign(iframe.style, {
        width: expandedWidth,
        height: expandedHeight,
        borderRadius: '12px'
      });
    } else {
      Object.assign(iframe.style, {
        width: buttonSize,
        height: buttonSize,
        borderRadius: '50%'
      });
    }
  }
  
  // CSS für die Accessibility-Klassen erstellen
  function createAccessibilityStyles() {
    const styleElement = document.createElement('style');
    styleElement.id = 'accessibility-styles';
    styleElement.textContent = `
      /* Accessibility Classes - Applied to the main page */
      .a11y-dark-contrast {
        filter: invert(1) hue-rotate(180deg);
      }
      
      .a11y-light-contrast {
        background-color: white !important;
        color: black !important;
      }
      
      .a11y-light-contrast * {
        background-color: white !important;
        color: black !important;
      }
      
      .a11y-monochrome {
        filter: grayscale(1);
      }
      
      .a11y-high-saturation {
        filter: saturate(200%);
      }
      
      .a11y-font-sm * {
        font-size: 0.9em !important;
      }
      
      .a11y-font-md * {
        font-size: 1.1em !important;
      }
      
      .a11y-font-lg * {
        font-size: 1.3em !important;
      }
      
      .a11y-font-xl * {
        font-size: 1.5em !important;
      }
      
      .a11y-line-spacing-sm * {
        line-height: 1.2 !important;
      }
      
      .a11y-line-spacing-md * {
        line-height: 1.6 !important;
      }
      
      .a11y-line-spacing-lg * {
        line-height: 2 !important;
      }
      
      .a11y-letter-spacing-sm * {
        letter-spacing: 0.5px !important;
      }
      
      .a11y-letter-spacing-md * {
        letter-spacing: 1px !important;
      }
      
      .a11y-letter-spacing-lg * {
        letter-spacing: 2px !important;
      }
    `;
    document.head.appendChild(styleElement);
  }
  
  // Hilfsfunktionen für die Lesehilfe
  let readingGuideElement = null;
  
  function createReadingGuide() {
    if (!readingGuideElement) {
      readingGuideElement = document.createElement('div');
      readingGuideElement.className = 'a11y-reading-guide';
      readingGuideElement.style.position = 'fixed';
      readingGuideElement.style.left = '0';
      readingGuideElement.style.width = '100%';
      readingGuideElement.style.height = '20px';
      readingGuideElement.style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
      readingGuideElement.style.borderTop = '1px solid rgba(255, 255, 0, 0.5)';
      readingGuideElement.style.borderBottom = '1px solid rgba(255, 255, 0, 0.5)';
      readingGuideElement.style.pointerEvents = 'none';
      readingGuideElement.style.zIndex = '999950';
      document.body.appendChild(readingGuideElement);
      
      document.addEventListener('mousemove', handleReadingGuideMouseMove);
    }
    readingGuideElement.style.display = 'block';
  }
  
  function removeReadingGuide() {
    document.removeEventListener('mousemove', handleReadingGuideMouseMove);
    if (readingGuideElement) {
      readingGuideElement.style.display = 'none';
    }
  }
  
  function handleReadingGuideMouseMove(e) {
    if (readingGuideElement) {
      readingGuideElement.style.top = `${e.clientY}px`;
    }
  }
  
  // Hilfsfunktionen für die Lesemaske
  let maskElement = null;
  let holeElement = null;
  
  function createReadingMask() {
    if (!maskElement) {
      // Overlay erstellen
      maskElement = document.createElement('div');
      maskElement.className = 'reading-mask-overlay';
      maskElement.style.position = 'fixed';
      maskElement.style.top = '0';
      maskElement.style.left = '0';
      maskElement.style.width = '100%';
      maskElement.style.height = '100%';
      maskElement.style.backgroundColor = 'transparent';
      maskElement.style.zIndex = '999940';
      maskElement.style.pointerEvents = 'none';
      document.body.appendChild(maskElement);
      
      // Transparentes Loch erstellen
      holeElement = document.createElement('div');
      holeElement.className = 'reading-mask-hole';
      holeElement.style.width = '300px';
      holeElement.style.height = '150px';
      holeElement.style.position = 'fixed';
      holeElement.style.backgroundColor = 'transparent';
      holeElement.style.borderRadius = '20px';
      holeElement.style.pointerEvents = 'none';
      holeElement.style.zIndex = '999945';
      holeElement.style.border = '2px solid rgba(255, 255, 255, 0.3)';
      holeElement.style.boxShadow = '0 0 0 2000px rgba(0, 0, 0, 0.75)';
      document.body.appendChild(holeElement);
      
      // Initial positionieren
      const rect = document.body.getBoundingClientRect();
      holeElement.style.top = `${rect.height / 2 - 75}px`;
      holeElement.style.left = `${rect.width / 2 - 150}px`;
      
      // Event-Listener hinzufügen
      document.addEventListener('mousemove', handleReadingMaskMouseMove);
    } else {
      maskElement.style.display = 'block';
      holeElement.style.display = 'block';
      document.addEventListener('mousemove', handleReadingMaskMouseMove);
    }
  }
  
  function removeReadingMask() {
    document.removeEventListener('mousemove', handleReadingMaskMouseMove);
    if (maskElement) maskElement.style.display = 'none';
    if (holeElement) holeElement.style.display = 'none';
  }
  
  function handleReadingMaskMouseMove(e) {
    if (holeElement) {
      holeElement.style.top = `${e.clientY - 75}px`;
      holeElement.style.left = `${e.clientX - 150}px`;
    }
  }
  
  // Funktion zum Anwenden von Accessibility-Einstellungen
  function applySettings(settings) {
    const body = document.body;
    
    // Alle Klassen zurücksetzen
    body.classList.remove(
      'a11y-dark-contrast',
      'a11y-light-contrast',
      'a11y-monochrome',
      'a11y-high-saturation',
      'a11y-font-sm',
      'a11y-font-md',
      'a11y-font-lg',
      'a11y-font-xl',
      'a11y-line-spacing-sm',
      'a11y-line-spacing-md',
      'a11y-line-spacing-lg',
      'a11y-letter-spacing-sm',
      'a11y-letter-spacing-md',
      'a11y-letter-spacing-lg'
    );
    
    // Klassen basierend auf den Einstellungen anwenden
    if (settings.darkContrast) body.classList.add('a11y-dark-contrast');
    if (settings.lightContrast) body.classList.add('a11y-light-contrast');
    if (settings.monochrome) body.classList.add('a11y-monochrome');
    if (settings.highSaturation) body.classList.add('a11y-high-saturation');
    
    // Schriftgröße
    if (settings.fontSize === 'small') body.classList.add('a11y-font-sm');
    if (settings.fontSize === 'medium') body.classList.add('a11y-font-md');
    if (settings.fontSize === 'large') body.classList.add('a11y-font-lg');
    if (settings.fontSize === 'x-large') body.classList.add('a11y-font-xl');
    
    // Zeilenabstand
    if (settings.lineSpacing === 'small') body.classList.add('a11y-line-spacing-sm');
    if (settings.lineSpacing === 'medium') body.classList.add('a11y-line-spacing-md');
    if (settings.lineSpacing === 'large') body.classList.add('a11y-line-spacing-lg');
    
    // Buchstabenabstand
    if (settings.letterSpacing === 'small') body.classList.add('a11y-letter-spacing-sm');
    if (settings.letterSpacing === 'medium') body.classList.add('a11y-letter-spacing-md');
    if (settings.letterSpacing === 'large') body.classList.add('a11y-letter-spacing-lg');
    
    // Großer Cursor
    if (settings.largeCursor) {
      body.style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'34\' height=\'34\' viewBox=\'0 0 24 24\' fill=\'black\' stroke=\'white\' stroke-width=\'2\'><path d=\'M6 6l12 12M6 18L18 6\'/></svg>") 12 12, auto';
    } else {
      body.style.cursor = '';
    }
    
    // Lesehilfe
    if (settings.readingGuide) {
      createReadingGuide();
    } else {
      removeReadingGuide();
    }
    
    // Lesemaske
    if (settings.readingMask) {
      createReadingMask();
    } else {
      removeReadingMask();
    }
    
    // Einstellungen im localStorage speichern
    try {
      localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving accessibility settings', error);
    }
  }
  
  // ===== EVENT-LISTENER =====
  // Nachrichten vom iframe überwachen
  window.addEventListener('message', function(event) {
    // In Produktion den Ursprung überprüfen
    // if (event.origin !== widgetUrlOrigin) return;
    
    const data = event.data;
    
    if (data.type === 'WIDGET_LOADED') {
      console.log('Accessibility Widget loaded');
      
      // Gespeicherte Einstellungen laden und an das Widget senden
      try {
        const savedSettings = localStorage.getItem('accessibilitySettings');
        if (savedSettings) {
          iframe.contentWindow.postMessage({
            type: 'LOAD_SETTINGS',
            settings: JSON.parse(savedSettings)
          }, '*');
        }
      } catch (error) {
        console.error('Error loading saved settings', error);
      }
    } else if (data.type === 'TOGGLE_WIDGET') {
      // Widget ein-/ausklappen
      toggleWidget();
    } else if (data.type === 'APPLY_SETTINGS') {
      // Barrierefreiheitseinstellungen anwenden
      applySettings(data.settings);
    }
  });
  
  // ===== INITIALISIERUNG =====
  function initWidget() {
    // Styles erstellen
    createAccessibilityStyles();
    
    // Container und iframe anhängen
    container.appendChild(iframe);
    document.body.appendChild(container);
    
    // Wenn der Widget-Button geklickt wird, Widget automatisch ein-/ausklappen
    container.addEventListener('click', function(e) {
      if (!isExpanded) {
        toggleWidget();
      }
    });
  }
  
  // Widget initialisieren, wenn das DOM geladen ist
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();