export type Language = 'en' | 'hi' | 'kn' | 'ta' | 'te';

export interface Translations {
  brand: {
    name: string;
    sub: string;
    liveFeed: string;
    feedPaused: string;
    pauseStream: string;
    resumeStream: string;
  };
  nav: {
    overview: string;
    collection: string;
    edgeSignals: string;
    vision: string;
    maintenance: string;
    downtime: string;
    traceability: string;
    production: string;
    optimization: string;
    smartKpi: string;
    assistant: string;
  };
  topbar: {
    nominal: string;
    alertsActive: string;
    switchTheme: string;
    execStatusHealthy: string;
    execStatusWarning: string;
    allGoodSummary: string;
    warningSummary: string;
  };
  overview: {
    title: string;
    desc: string;
    kpiOee: string;
    kpiOeeSub: string;
    kpiMachines: string;
    kpiMachinesSub: string;
    kpiAlerts: string;
    kpiAlertsSub: string;
    kpiParts: string;
    kpiPartsSub: string;
    pipelineTitle: string;
    howItWorks: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    cvFitTitle: string;
    cardQualityTitle: string;
    cardQualityDesc: string;
    cardMaintTitle: string;
    cardMaintDesc: string;
    cardSafetyTitle: string;
    cardSafetyDesc: string;
    demoNote: string;
  };
  collection: {
    title: string;
    desc: string;
    filterAll: string;
    filterAttention: string;
    runningGood: string;
    needsAttention: string;
    spindleSpeed: string;
    temperature: string;
    smoothness: string;
    cycleTime: string;
    tempNormal: string;
    tempHigh: string;
    vibSmooth: string;
    vibCheck: string;
    logTitle: string;
    liveBuffer: string;
  };
  vision: {
    title: string;
    desc: string;
    liveCamera: string;
    cameraSub: string;
    rollingSequence: string;
    pass: string;
    fail: string;
    qualityCardTitle: string;
    goodPartsPercent: string;
    defectPercent: string;
    safetyCardTitle: string;
    safeStatus: string;
    checkingStatus: string;
    zoneA: string;
    zoneB: string;
    zoneC: string;
    recentCaptures: string;
  };
  maintenance: {
    title: string;
    desc: string;
    serviceListTitle: string;
    healthyGaugeTitle: string;
    toolWearHealthy: string;
    toolWearCheck: string;
    moneySavedTitle: string;
    moneySavedDesc: string;
    serviceIn: string;
    daysRemaining: string;
    healthyStatus: string;
    attentionStatus: string;
    actionSchedule: string;
    spindleBearing: string;
    contactorRelay: string;
    coolantPump: string;
  };
  optimization: {
    title: string;
    desc: string;
    tipsTitle: string;
    savingsTitle: string;
    scrapRate: string;
    avgCycleTime: string;
    unplannedDowntime: string;
    beforeText: string;
    afterText: string;
    improvementBadge: string;
  };
  assistant: {
    title: string;
    desc: string;
    connectedStatus: string;
    clearChat: string;
    inputPlaceholder: string;
    send: string;
    suggestedChipsTitle: string;
    chips: string[];
    initialGreeting: string;
    clearedMessage: string;
  };
  categories: {
    operations: string;
    quality: string;
    maintenance: string;
    analytics: string;
    intelligence: string;
  };
  common: {
    searchPlaceholder: string;
    live: string;
    paused: string;
    running: string;
    idle: string;
    warning: string;
    inspect: string;
    viewAll: string;
    target: string;
    actual: string;
    ahead: string;
    behind: string;
    exportLog: string;
    quickPrompts: string;
    askAnythingTitle: string;
    askAnythingSub: string;
    timeRemaining: string;
    estCompletion: string;
    availability: string;
    performance: string;
    quality: string;
    hours: string;
    days: string;
    cadenceTitle: string;
    activeAlarmsTitle: string;
    shiftTargetTitle: string;
    oeeCompositionTitle: string;
    edgeConnectivityTitle: string;
    colMachine: string;
    colModelLine: string;
    colWorkpiece: string;
    colStatus: string;
    colSpeed: string;
    colTemp: string;
    colSmoothness: string;
    colOee: string;
    colAction: string;
    colAnomaly: string;
    colSeverity: string;
    colReported: string;
    testDefect: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    brand: {
      name: 'Foundry OS',
      sub: 'Smart Factory Assistant',
      liveFeed: 'Live plant connection',
      feedPaused: 'Plant stream paused',
      pauseStream: 'Pause Live Stream',
      resumeStream: 'Resume Live Stream',
    },
    nav: {
      overview: 'Factory Dashboard',
      collection: 'Machines Status',
      edgeSignals: 'Edge Signals Catalog',
      vision: 'Camera Quality Check',
      maintenance: 'Service & Repairs',
      downtime: 'Downtime & OEE',
      traceability: 'Material Traceability',
      production: 'Production',
      optimization: 'Savings & Efficiency',
      smartKpi: '4G & 5G KPIs',
      assistant: 'Ask Factory AI',
    },
    topbar: {
      nominal: 'All 11 Machines Running Good',
      alertsActive: '1 Machine Needs Check Soon',
      switchTheme: 'Change appearance (Dark / Light)',
      execStatusHealthy: 'Factory Operating Normally',
      execStatusWarning: 'Attention Needed on 1 Machine',
      allGoodSummary: 'All lines are active, parts are passing quality checks with 98.2% accuracy.',
      warningSummary: 'CNC-07 tool spindle has minor vibration. Routine maintenance recommended in 12 days.',
    },
    overview: {
      title: 'Simple Factory Overview',
      desc: 'Everything you need to know about your factory machines, quality checks, and production — without technical computer jargon.',
      kpiOee: 'Factory Efficiency',
      kpiOeeSub: 'Tracking near 90% target',
      kpiMachines: 'Active Machines',
      kpiMachinesSub: '11 of 12 running smoothly',
      kpiAlerts: 'Items to Check',
      kpiAlertsSub: '1 routine maintenance soon',
      kpiParts: 'Parts Made Today',
      kpiPartsSub: 'Live production count',
      pipelineTitle: 'How It Works (In 4 Easy Steps)',
      howItWorks: 'How smart monitoring protects your factory',
      step1Title: '1. Machines Send Data',
      step1Desc: 'Sensors on CNC & PLCs automatically measure speed and heat.',
      step2Title: '2. Smart Cameras Inspect',
      step2Desc: 'Cameras take photos of every part to catch defects instantly.',
      step3Title: '3. Early Warning Alerts',
      step3Desc: 'AI predicts wear days ahead so machines never break down unexpectedly.',
      step4Title: '4. Voice & Chat Help',
      step4Desc: 'Ask questions in everyday words in English, Hindi, Kannada, Tamil or Telugu.',
      cvFitTitle: '3 Ways Cameras Protect Your Work',
      cardQualityTitle: 'Zero Defect Shipping',
      cardQualityDesc: 'The smart camera verifies part dimensions within 0.05 seconds so bad parts are rejected immediately.',
      cardMaintTitle: 'Predict Before Breakage',
      cardMaintDesc: 'Catches cutting tool wear days before damage, saving lakhs in expensive repairs.',
      cardSafetyTitle: 'Worker Safety Watch',
      cardSafetyDesc: 'Ensures helmets and safety gear are worn around robot zones, automatically pausing machinery if unsafe.',
      demoNote: 'Live Interactive Demo: You can click, pause, and test every section directly in your browser.',
    },
    collection: {
      title: 'Machine Health & Status',
      desc: 'See at a glance which machines are working well, their temperatures, and whether any machine needs attention.',
      filterAll: 'All Machines',
      filterAttention: 'Needs Attention',
      runningGood: 'Working Well',
      needsAttention: 'Check Soon',
      spindleSpeed: 'Motor Speed',
      temperature: 'Temperature',
      smoothness: 'Smoothness',
      cycleTime: 'Speed / Cycle',
      tempNormal: 'Normal',
      tempHigh: 'Warm',
      vibSmooth: 'Very Smooth',
      vibCheck: 'Mild Vibration',
      logTitle: 'Live sensor heartbeat feed',
      liveBuffer: 'Live connected',
    },
    vision: {
      title: 'Instant Camera Quality Check',
      desc: 'Our smart camera inspects every single machined part the moment it is ready. Watch live inspections below.',
      liveCamera: 'INSPECTION CAMERA LIVE',
      cameraSub: 'Camera checks each part automatically in 0.04s',
      rollingSequence: 'Recent parts inspected (Green = Good · Red = Rejected)',
      pass: 'GOOD PART',
      fail: 'DEFECT CAUGHT',
      qualityCardTitle: 'Today’s Quality Score',
      goodPartsPercent: 'Good Parts Rate',
      defectPercent: 'Defect Rate',
      safetyCardTitle: 'Shop Floor Safety Status',
      safeStatus: 'Safe & Protected',
      checkingStatus: 'Verifying area',
      zoneA: 'CNC Machine Bay',
      zoneB: 'Loading & Dispatch Area',
      zoneC: 'Robot Arm Work Area',
      recentCaptures: 'Recent Optical Inspections',
    },
    maintenance: {
      title: 'Upcoming Service & Repairs',
      desc: 'Never suffer surprise breakdowns. See exact days remaining before any component needs routine servicing.',
      serviceListTitle: 'Upcoming Scheduled Service',
      healthyGaugeTitle: 'CNC-07 Tool Health',
      toolWearHealthy: 'Tool Condition: Good',
      toolWearCheck: 'Tool Condition: Service Soon',
      moneySavedTitle: 'Money Saved by Preventing Breakdowns',
      moneySavedDesc: '7 unexpected breakdowns prevented in past 30 days, saving an estimated ₹4.2 Lakhs.',
      serviceIn: 'Service in',
      daysRemaining: 'days',
      healthyStatus: 'Good Condition',
      attentionStatus: 'Schedule Routine Check',
      actionSchedule: 'Contact Technician',
      spindleBearing: 'Spindle Bearing',
      contactorRelay: 'Relay Switch',
      coolantPump: 'Cooling Pump',
    },
    optimization: {
      title: 'Easy Savings & Factory Improvements',
      desc: 'Simple adjustments discovered by AI that reduce electricity, lower scrap, and boost your profit.',
      tipsTitle: 'Top Money-Saving Tips',
      savingsTitle: 'Factory Results Before vs. After',
      scrapRate: 'Wasted Scrap Metal',
      avgCycleTime: 'Time Per Part',
      unplannedDowntime: 'Sudden Machine Stoppages',
      beforeText: 'Before (Old Way)',
      afterText: 'Now (Optimized)',
      improvementBadge: 'Improved',
    },
    assistant: {
      title: 'Ask Factory AI Copilot',
      desc: 'Have a question? No need to navigate complex menus. Simply tap any question below or speak naturally in your language.',
      connectedStatus: 'Connected to Factory Floor',
      clearChat: 'Clear chat',
      inputPlaceholder: 'Type or ask: Is any machine having problems? or How much did we make today?',
      send: 'Ask AI',
      suggestedChipsTitle: 'Popular 1-Tap Questions (Tap to ask)',
      chips: [
        'Is any machine having problems right now?',
        'How many parts did we make today?',
        'What is our factory efficiency score?',
        'When is the next machine service needed?',
        'Are all factory safety zones clear?',
      ],
      initialGreeting: 'Hello! I am your Factory AI Assistant. I monitor all your machines, cameras, and production live. Tap any question on the right or ask me anything in plain words.',
      clearedMessage: 'Chat cleared. I am ready to answer any factory question.',
    },
    categories: {
      operations: 'OPERATIONS',
      quality: 'QUALITY',
      maintenance: 'MAINTENANCE',
      analytics: 'ANALYTICS',
      intelligence: 'INTELLIGENCE',
    },
    common: {
      searchPlaceholder: 'Search machines, parameters, alarms...',
      live: 'Live Telemetry',
      paused: 'Stream Paused',
      running: 'Running',
      idle: 'Idle',
      warning: 'Attention',
      inspect: 'Inspect',
      viewAll: 'View All',
      target: 'Target',
      actual: 'Actual',
      ahead: 'ahead',
      behind: 'behind',
      exportLog: 'Telemetry Log ↓',
      quickPrompts: 'Quick Prompts:',
      askAnythingTitle: 'Ask Anything',
      askAnythingSub: 'Powered by RAG AI',
      timeRemaining: 'Remaining',
      estCompletion: 'Est. Completion',
      availability: 'Availability',
      performance: 'Performance',
      quality: 'Quality',
      hours: 'hrs',
      days: 'days',
      cadenceTitle: 'Shift Production Cadence (Units vs Target)',
      activeAlarmsTitle: 'Active Alarms & Telemetry Anomalies (3)',
      shiftTargetTitle: 'Shift Target Progress',
      oeeCompositionTitle: 'OEE Composition',
      edgeConnectivityTitle: 'Edge Connectivity & DAQ',
      colMachine: 'Machine',
      colModelLine: 'Model & Line',
      colWorkpiece: 'Workpiece & Batch',
      colStatus: 'Status',
      colSpeed: 'Speed (RPM)',
      colTemp: 'Temp (°C)',
      colSmoothness: 'Smoothness',
      colOee: 'OEE',
      colAction: 'Action',
      colAnomaly: 'Anomaly & Threshold',
      colSeverity: 'Severity',
      colReported: 'Reported',
      testDefect: '⚡ Test Defect',
    },
  },

  hi: {
    brand: {
      name: 'Foundry OS',
      sub: 'स्मार्ट फ़ैक्टरी असिस्टेंट',
      liveFeed: 'फ़ैक्टरी लाइव कनेक्टेड',
      feedPaused: 'फ़ीड रोकी गई है',
      pauseStream: 'लाइव रोकें',
      resumeStream: 'लाइव शुरू करें',
    },
    nav: {
      overview: 'कारखाना डैशबोर्ड',
      collection: 'मशीनों की स्थिति',
      edgeSignals: 'सेंसर व सिग्नल कैटलॉग',
      vision: 'कैमरा क्वालिटी चेक',
      maintenance: 'सर्विस और रिपेयर',
      downtime: 'डाउनटाइम और OEE',
      traceability: 'मटेरियल ट्रेसेबिलिटी',
      production: 'उत्पादन',
      optimization: 'बचत और सुधार',
      smartKpi: '4G और 5G KPIs',
      assistant: 'फ़ैक्टरी AI से पूछें',
    },
    topbar: {
      nominal: 'सभी 11 मशीनें बढ़िया चल रही हैं',
      alertsActive: '1 मशीन पर सर्विस की जरूरत',
      switchTheme: 'थीम बदलें (डार्क / लाइट)',
      execStatusHealthy: 'फ़ैक्टरी बिल्कुल सही चल रही है',
      execStatusWarning: '1 मशीन पर ध्यान देने की ज़रूरत',
      allGoodSummary: 'सभी मशीनें एक्टिव हैं और 98% से ज़्यादा पार्ट्स बिना किसी खराबी के पास हो रहे हैं।',
      warningSummary: 'CNC-07 के स्पिंडल में हल्का कंपन है। अगले 12 दिनों में साधारण सर्विस करवाने की सलाह है।',
    },
    overview: {
      title: 'आसान फ़ैक्टरी डैशबोर्ड',
      desc: 'अपनी मशीनों, क्वालिटी चेक और प्रोडक्शन की पूरी जानकारी बिना किसी मुश्किल कंप्यूटर शब्दों के आसान भाषा में देखें।',
      kpiOee: 'फ़ैक्टरी की कुल रफ़्तार',
      kpiOeeSub: '90% के लक्ष्य के करीब',
      kpiMachines: 'चल रही मशीनें',
      kpiMachinesSub: '12 में से 11 सही चल रही हैं',
      kpiAlerts: 'ध्यान देने योग्य',
      kpiAlertsSub: '1 मशीन की जल्द सर्विस होगी',
      kpiParts: 'आज बने कुल पार्ट्स',
      kpiPartsSub: 'लाइव गिनती जारी है',
      pipelineTitle: 'यह कैसे काम करता है (4 आसान स्टेप्स)',
      howItWorks: 'स्मार्ट सिस्टम आपके कारखाने की सुरक्षा कैसे करता है',
      step1Title: '1. मशीनें डेटा भेजती हैं',
      step1Desc: 'सेंसर अपने आप मोटर की स्पीड और तापमान नापते रहते हैं।',
      step2Title: '2. स्मार्ट कैमरा चेक करता है',
      step2Desc: 'हर पार्ट की फोटो लेकर तुरंत खराबी को अलग कर देता है।',
      step3Title: '3. पहले से चेतावनी',
      step3Desc: 'मशीन खराब होने से कई दिन पहले ही अलर्ट दे देता है ताकि काम न रुके।',
      step4Title: '4. बोलकर या पूछकर मदद लें',
      step4Desc: 'हिंदी, कन्नड़, तमिल, तेलुगु या अंग्रेज़ी में सीधे सवाल पूछें।',
      cvFitTitle: 'कैमरा आपकी कैसे मदद करता है',
      cardQualityTitle: 'बिना खराबी का माल',
      cardQualityDesc: 'कैमरा 0.05 सेकंड में पार्ट नाप लेता है, ताकि खराब पार्ट ग्राहक तक न पहुंचे।',
      cardMaintTitle: 'टूटने से पहले खबर',
      cardMaintDesc: 'टूल घिसने की जानकारी कई दिन पहले दे देता है, जिससे लाखों का नुकसान बचता है।',
      cardSafetyTitle: 'कामगारों की सुरक्षा',
      cardSafetyDesc: 'हेलमेट और सेफ्टी गियर की निगरानी रखता है, खतरा होने पर मशीन खुद रुक जाती है।',
      demoNote: 'लाइव डेमो: आप किसी भी बटन पर क्लिक करके इसे आसानी से टेस्ट कर सकते हैं।',
    },
    collection: {
      title: 'मशीनों की हालत और स्थिति',
      desc: 'एक नज़र में देखें कौनसी मशीन सही चल रही है, उसका तापमान कैसा है और किसको सर्विस चाहिए।',
      filterAll: 'सभी 12 मशीनें',
      filterAttention: 'ध्यान देने वाली',
      runningGood: 'बढ़िया चल रही है',
      needsAttention: 'जांच ज़रूरी है',
      spindleSpeed: 'मोटर स्पीड',
      temperature: 'तापमान',
      smoothness: 'स्मूथनेस',
      cycleTime: 'पार्ट बनने का समय',
      tempNormal: 'सामान्य (Normal)',
      tempHigh: 'थोड़ा गर्म',
      vibSmooth: 'बहुत स्मूथ',
      vibCheck: 'हल्का कंपन',
      logTitle: 'लाइव सेंसर गतिविधि',
      liveBuffer: 'लाइव चालू है',
    },
    vision: {
      title: 'कैमरे द्वारा तुरंत क्वालिटी चेक',
      desc: 'स्मार्ट कैमरा हर पार्ट को बनते ही चेक करता है। नीचे लाइव कैमरा और परिणाम देखें।',
      liveCamera: 'कैमरा लाइव जांच कर रहा है',
      cameraSub: 'हर पार्ट 0.04 सेकंड में चेक हो रहा है',
      rollingSequence: 'हाल ही में चेक हुए पार्ट्स (हरा = पास · लाल = खराब)',
      pass: 'सही पार्ट (PASS)',
      fail: 'खराबी पकड़ी गई',
      qualityCardTitle: 'आज का क्वालिटी स्कोर',
      goodPartsPercent: 'सही पार्ट्स का प्रतिशत',
      defectPercent: 'खराबी दर (Defect Rate)',
      safetyCardTitle: 'फ़्लोर सुरक्षा स्थिति',
      safeStatus: 'बिल्कुल सुरक्षित',
      checkingStatus: 'जांच जारी है',
      zoneA: 'CNC मशीन एरिया',
      zoneB: 'लोडिंग और डिस्पैच एरिया',
      zoneC: 'रोबोट काम करने की जगह',
      recentCaptures: 'हाल के ऑप्टिकल निरीक्षण',
    },
    maintenance: {
      title: 'आगामी सर्विस और रिपेयर',
      desc: 'अचानक मशीन बंद होने से बचें। देखें किस मशीन की सर्विस में कितने दिन बाकी हैं।',
      serviceListTitle: 'आगामी सर्विस शेड्यूल',
      healthyGaugeTitle: 'CNC-07 टूल की हालत',
      toolWearHealthy: 'टूल की स्थिति: बढ़िया',
      toolWearCheck: 'टूल की स्थिति: सर्विस जल्द करें',
      moneySavedTitle: 'खराबी रोककर बचाए गए पैसे',
      moneySavedDesc: 'पिछले 30 दिनों में 7 बड़ी खराबियाँ रोकी गईं, जिससे लगभग ₹4.2 लाख का नुकसान बचा।',
      serviceIn: 'सर्विस बाकी है',
      daysRemaining: 'दिन',
      healthyStatus: 'बढ़िया हालत में',
      attentionStatus: 'सर्विस बुक करें',
      actionSchedule: 'मैकेनिक को कॉल करें',
      spindleBearing: 'स्पिंडल बेयरिंग',
      contactorRelay: 'रिले स्विच',
      coolantPump: 'कूलिंग पंप',
    },
    optimization: {
      title: 'आसान बचत और फ़ायदे',
      desc: 'AI द्वारा सुझाए गए छोटे बदलाव जिनसे बिजली बचती है, वेस्टेज कम होती है और मुनाफा बढ़ता है।',
      tipsTitle: 'बचत के मुख्य सुझाव',
      savingsTitle: 'पहले और अब का अंतर',
      scrapRate: 'खराब हुआ वेस्ट माल',
      avgCycleTime: 'एक पार्ट बनने का समय',
      unplannedDowntime: 'अचानक मशीन बंद होना',
      beforeText: 'पहले (पुराना तरीका)',
      afterText: 'अब (नया तरीका)',
      improvementBadge: 'सुधार हुआ',
    },
    assistant: {
      title: 'फ़ैक्टरी AI साथी से पूछें',
      desc: 'कोई सवाल है? टाइप करने की भी ज़रूरत नहीं है — नीचे दिए गए किसी भी बटन को दबाएं।',
      connectedStatus: 'फ़ैक्टरी से सीधा जुड़ा हुआ है',
      clearChat: 'बातचीत साफ़ करें',
      inputPlaceholder: 'पूछें: क्या किसी मशीन में दिक्कत है? या आज कितना माल बना?',
      send: 'पूछें',
      suggestedChipsTitle: '1-क्लिक आसान सवाल (टैप करें):',
      chips: [
        'क्या अभी किसी मशीन में कोई दिक्कत है?',
        'आज कुल कितने पार्ट्स बने हैं?',
        'कारखाने की काम करने की रफ़्तार कैसी है?',
        'अगली मशीन की सर्विस कब करवानी है?',
        'क्या सभी सुरक्षा ज़ोन सुरक्षित हैं?',
      ],
      initialGreeting: 'नमस्ते! मैं आपका फ़ैक्टरी AI असिस्टेंट हूँ। मैं आपकी सभी मशीनों, कैमरों और काम पर नज़र रखता हूँ। दाईं तरफ़ के किसी भी सवाल पर टैप करें या कुछ भी आसान शब्दों में पूछें।',
      clearedMessage: 'चैट साफ़ हो गई है। आप कोई भी सवाल पूछ सकते हैं।',
    },
    categories: {
      operations: 'ऑपरेशन्स (संचालन)',
      quality: 'क्वालिटी (गुणवत्ता)',
      maintenance: 'मेंटेनेंस (रखरखाव)',
      analytics: 'एनालिटिक्स (विश्लेषण)',
      intelligence: 'इंटेलिजेंस (AI सहायक)',
    },
    common: {
      searchPlaceholder: 'मशीन, पार्ट, लाइन खोजें...',
      live: 'लाइव टेलीमेट्री',
      paused: 'स्ट्रीम रुकी है',
      running: 'चालू है',
      idle: 'खाली (Idle)',
      warning: 'ध्यान दें',
      inspect: 'जांचें (Inspect)',
      viewAll: 'सभी देखें',
      target: 'लक्ष्य (Target)',
      actual: 'वास्तविक (Actual)',
      ahead: 'आगे',
      behind: 'पीछे',
      exportLog: 'टेलीमेट्री लॉग ↓',
      quickPrompts: 'त्वरित सवाल:',
      askAnythingTitle: 'कुछ भी पूछें',
      askAnythingSub: 'RAG AI द्वारा संचालित',
      timeRemaining: 'बाकी पार्ट्स',
      estCompletion: 'अनुमानित समय',
      availability: 'उपलब्धता',
      performance: 'रफ्तार',
      quality: 'गुणवत्ता',
      hours: 'घंटे',
      days: 'दिन',
      cadenceTitle: 'शिफ्ट उत्पादन गति (लक्ष्य बनाम वास्तविक)',
      activeAlarmsTitle: 'सक्रिय अलार्म व खराबी चेतावनी (3)',
      shiftTargetTitle: 'शिफ्ट का उत्पादन लक्ष्य',
      oeeCompositionTitle: 'OEE का विवरण',
      edgeConnectivityTitle: 'एज कनेक्टिविटी और DAQ',
      colMachine: 'मशीन',
      colModelLine: 'मॉडल व लाइन',
      colWorkpiece: 'पार्ट व बैच',
      colStatus: 'स्थिति',
      colSpeed: 'मोटर स्पीड (RPM)',
      colTemp: 'तापमान (°C)',
      colSmoothness: 'स्मूथनेस',
      colOee: 'OEE',
      colAction: 'कार्रवाई',
      colAnomaly: 'खराबी व सीमा',
      colSeverity: 'गंभीरता',
      colReported: 'समय',
      testDefect: '⚡ डिफेक्ट टेस्ट करें',
    },
  },

  kn: {
    brand: {
      name: 'Foundry OS',
      sub: 'ಸ್ಮಾರ್ಟ್ ಫ್ಯಾಕ್ಟರಿ ಸಹಾಯಕ',
      liveFeed: 'ಲೈವ್ ಫ್ಯಾಕ್ಟರಿ ಸಂಪರ್ಕ',
      feedPaused: 'ಫೀಡ್ ನಿಲ್ಲಿಸಲಾಗಿದೆ',
      pauseStream: 'ವಿರಾಮಗೊಳಿಸಿ',
      resumeStream: 'ಮುಂದುವರಿಸಿ',
    },
    nav: {
      overview: 'ಕಾರ್ಖಾನೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      collection: 'ಯಂತ್ರಗಳ ಸ್ಥಿತಿ',
      edgeSignals: 'ಎಡ್ಜ್ ಸಿಗ್ನಲ್ಸ್ ಕ್ಯಾಟಲಾಗ್',
      vision: 'ಕ್ಯಾಮೆರಾ ತಪಾಸಣೆ',
      maintenance: 'ಸರ್ವೀಸ್ & ರಿಪೇರಿ',
      downtime: 'ಡೌನ್‌ಟೈಮ್ & OEE',
      traceability: 'ಮೆಟೀರಿಯಲ್ ಟ್ರೇಸಿಬಿಲಿಟಿ',
      production: 'ಉತ್ಪಾದನೆ',
      optimization: 'ಉಳಿತಾಯ & ಸುಧಾರಣೆ',
      smartKpi: '4G & 5G KPIs',
      assistant: 'ಫ್ಯಾಕ್ಟರಿ AI ಗೆ ಕೇಳಿ',
    },
    topbar: {
      nominal: 'ಎಲ್ಲಾ 11 ಯಂತ್ರಗಳು ಉತ್ತಮವಾಗಿವೆ',
      alertsActive: '1 ಯಂತ್ರಕ್ಕೆ ಶೀಘ್ರದಲ್ಲೇ ಸರ್ವೀಸ್ ಬೇಕು',
      switchTheme: 'ಬಣ್ಣ ಬದಲಾಯಿಸಿ (ಡಾರ್ಕ್ / ಲೈಟ್)',
      execStatusHealthy: 'ಕಾರ್ಖಾನೆ ಸಹಜವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ',
      execStatusWarning: '1 ಯಂತ್ರದ ಮೇಲೆ ಗಮನ ಅಗತ್ಯ',
      allGoodSummary: 'ಎಲ್ಲಾ ಯಂತ್ರಗಳು ಚಾಲನೆಯಲ್ಲಿವೆ, 98% ಭಾಗಗಳು ಉತ್ತಮ ಗುಣಮಟ್ಟದೊಂದಿಗೆ ಪಾಸ್ ಆಗಿವೆ.',
      warningSummary: 'CNC-07 ಯಂತ್ರದಲ್ಲಿ ಸ್ವಲ್ಪ ಕಂಪನವಿದೆ. ಮುಂದಿನ 12 ದಿನಗಳಲ್ಲಿ ಸಾಮಾನ್ಯ ಸರ್ವೀಸ್ ಮಾಡಿಸಿ.',
    },
    overview: {
      title: 'ಸುಲಭ ಕಾರ್ಖಾನೆ ಮಾಹಿತಿ',
      desc: 'ಯಾವುದೇ ಕಠಿಣ ಕಂಪ್ಯೂಟರ್ ಪದಗಳಿಲ್ಲದೆ ನಿಮ್ಮ ಯಂತ್ರಗಳು, ಗುಣಮಟ್ಟ ಮತ್ತು ಉತ್ಪಾದನೆಯ ವಿವರಗಳನ್ನು ಸುಲಭವಾಗಿ ನೋಡಿ.',
      kpiOee: 'ಕಾರ್ಖಾನೆಯ ಕಾರ್ಯಕ್ಷಮತೆ',
      kpiOeeSub: '90% ಗುರಿಗೆ ತಲುಪುತ್ತಿದೆ',
      kpiMachines: 'ಚಾಲನೆಯಲ್ಲಿರುವ ಯಂತ್ರಗಳು',
      kpiMachinesSub: '12 ರಲ್ಲಿ 11 ಚೆನ್ನಾಗಿ ಕೆಲಸ ಮಾಡುತ್ತಿವೆ',
      kpiAlerts: 'ಗಮನಿಸಬೇಕಾದ ಅಂಶಗಳು',
      kpiAlertsSub: '1 ಯಂತ್ರಕ್ಕೆ ಶೀಘ್ರದಲ್ಲೇ ಸರ್ವೀಸ್',
      kpiParts: 'ಇಂದು ತಯಾರಾದ ಭಾಗಗಳು',
      kpiPartsSub: 'ಲೈವ್ ಎಣಿಕೆ ಚಾಲ್ತಿಯಲ್ಲಿದೆ',
      pipelineTitle: 'ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ (4 ಹಂತಗಳು)',
      howItWorks: 'ಸ್ಮಾರ್ಟ್ ತಂತ್ರಜ್ಞಾನ ನಿಮ್ಮ ಕಾರ್ಖಾನೆಯನ್ನು ಹೇಗೆ ರಕ್ಷಿಸುತ್ತದೆ',
      step1Title: '1. ಯಂತ್ರಗಳ ಮಾಹಿತಿ',
      step1Desc: 'ಸೆನ್ಸರ್‌ಗಳು ತಾಪಮಾನ ಮತ್ತು ವೇಗವನ್ನು ನಿರಂತರವಾಗಿ ಅಳೆಯುತ್ತವೆ.',
      step2Title: '2. ಸ್ಮಾರ್ಟ್ ಕ್ಯಾಮೆರಾ ತಪಾಸಣೆ',
      step2Desc: 'ಕ್ಯಾಮೆರಾ ಪ್ರತಿ ಭಾಗದ ಫೋಟೋ ತೆಗೆದು ತಕ್ಷಣವೇ ದೋಷವನ್ನು ಗುರುತಿಸುತ್ತದೆ.',
      step3Title: '3. ಮುಂಚಿತ ಎಚ್ಚರಿಕೆ',
      step3Desc: 'ಯಂತ್ರ ಕೆಡುವ ಮುನ್ನವೇ ತಿಳಿಸುತ್ತದೆ, ಕೆಲಸ ನಿಲ್ಲುವುದಿಲ್ಲ.',
      step4Title: '4. ಮಾತನಾಡಿ ಮಾಹಿತಿ ಪಡೆಯಿರಿ',
      step4Desc: 'ಕನ್ನಡದಲ್ಲಿ ನೇರವಾಗಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ ಸುಲಭ ಉತ್ತರ ಪಡೆಯಿರಿ.',
      cvFitTitle: 'ಕ್ಯಾಮೆರಾ ಹೇಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ',
      cardQualityTitle: 'ದೋಷರಹಿತ ಸರಕು',
      cardQualityDesc: 'ಕ್ಯಾಮೆರಾ 0.05 ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಪರಿಶೀಲಿಸುತ್ತದೆ, ಕೆಟ್ಟ ಭಾಗ ಹೊರಹೋಗುವುದಿಲ್ಲ.',
      cardMaintTitle: 'ಹಾಳಾಗುವ ಮುನ್ನವೇ ಮಾಹಿತಿ',
      cardMaintDesc: 'ಉಪಕರಣ ಸವೆಯುವ ಮೊದಲೇ ತಿಳಿಸಿ ದುಬಾರಿ ರಿಪೇರಿ ವೆಚ್ಚವನ್ನು ಉಳಿಸುತ್ತದೆ.',
      cardSafetyTitle: 'ಕಾರ್ಮಿಕರ ರಕ್ಷಣೆ',
      cardSafetyDesc: 'ಹೆಲ್ಮೆಟ್ ಮತ್ತು ಸುರಕ್ಷತಾ ಉಡುಪುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಅಪಘಾತ ತಪ್ಪಿಸುತ್ತದೆ.',
      demoNote: 'ಲೈವ್ ಡೆಮೊ: ನೀವು ಯಾವುದೇ ಬಟನ್ ಒತ್ತಿ ಇದನ್ನು ಸುಲಭವಾಗಿ ಪರಿಶೀಲಿಸಬಹುದು.',
    },
    collection: {
      title: 'ಯಂತ್ರಗಳ ಆರೋಗ್ಯ ಮತ್ತು ಸ್ಥಿತಿ',
      desc: 'ಯಾವ ಯಂತ್ರ ಉತ್ತಮವಾಗಿದೆ, ತಾಪಮಾನ ಎಷ್ಟಿದೆ ಮತ್ತು ಯಾವುದಕ್ಕೆ ಸರ್ವೀಸ್ ಬೇಕು ಎಂದು ಸುಲಭವಾಗಿ ನೋಡಿ.',
      filterAll: 'ಎಲ್ಲಾ 12 ಯಂತ್ರಗಳು',
      filterAttention: 'ಗಮನಿಸಬೇಕಾದವು',
      runningGood: 'ಉತ್ತಮವಾಗಿದೆ',
      needsAttention: 'ಪರಿಶೀಲನೆ ಅಗತ್ಯ',
      spindleSpeed: 'ಮೋಟರ್ ವೇಗ',
      temperature: 'ತಾಪಮಾನ',
      smoothness: 'ಸುಗಮತೆ (Smoothness)',
      cycleTime: 'ತಯಾರಿಕೆಯ ಸಮಯ',
      tempNormal: 'ಸಾಮಾನ್ಯ (Normal)',
      tempHigh: 'ಸ್ವಲ್ಪ ಬಿಸಿ',
      vibSmooth: 'ತುಂಬಾ ಸ್ಮೂತ್',
      vibCheck: 'ಸ್ವಲ್ಪ ಕಂಪನವಿದೆ',
      logTitle: 'ಲೈವ್ ಸೆನ್ಸರ್ ಮಾಹಿತಿ',
      liveBuffer: 'ಲೈವ್ ಆಗಿದೆ',
    },
    vision: {
      title: 'ಕ್ಯಾಮೆರಾ ಮೂಲಕ ತಕ್ಷಣದ ಗುಣಮಟ್ಟ ತಪಾಸಣೆ',
      desc: 'ಭಾಗ ತಯಾರಾದ ತಕ್ಷಣ ಸ್ಮಾರ್ಟ್ ಕ್ಯಾಮೆರಾ ಪರಿಶೀಲಿಸುತ್ತದೆ. ಲೈವ್ ದೃಶ್ಯ ಕೆಳಗೆ ನೋಡಿ.',
      liveCamera: 'ಕ್ಯಾಮೆರಾ ಲೈವ್ ತಪಾಸಣೆ',
      cameraSub: 'ಪ್ರತಿ ಭಾಗವನ್ನು 0.04 ಸೆಕೆಂಡಿನಲ್ಲಿ ಪರಿಶೀಲಿಸುತ್ತದೆ',
      rollingSequence: 'ತಪಾಸಣೆಗೊಂಡ ಭಾಗಗಳು (ಹಸಿರು = ಪಾಸ್ · ಕೆಂಪು = ತಿರಸ್ಕೃತ)',
      pass: 'ಉತ್ತಮ ಭಾಗ (PASS)',
      fail: 'ದೋಷ ಪತ್ತೆಯಾಗಿದೆ',
      qualityCardTitle: 'ಇಂದಿನ ಗುಣಮಟ್ಟದ ಅಂಕಗಳು',
      goodPartsPercent: 'ಉತ್ತಮ ಭಾಗಗಳ ದರ',
      defectPercent: 'ದೋಷದ ಪ್ರಮಾಣ',
      safetyCardTitle: 'ಸುರಕ್ಷತಾ ಸ್ಥಿತಿ',
      safeStatus: 'ಸುರಕ್ಷಿತವಾಗಿದೆ',
      checkingStatus: 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ',
      zoneA: 'CNC ಯಂತ್ರಗಳ ವಲಯ',
      zoneB: 'ಲೋಡಿಂಗ್ ಜಾಗ',
      zoneC: 'ರೋಬೋಟ್ ಕೆಲಸದ ಸ್ಥಳ',
      recentCaptures: 'ಇತ್ತೀಚಿನ ಆಪ್ಟಿಕಲ್ ತಪಾಸಣೆಗಳು',
    },
    maintenance: {
      title: 'ಮುಂದಿನ ಸರ್ವೀಸ್ ಮತ್ತು ರಿಪೇರಿ',
      desc: 'ಯಂತ್ರಗಳು ಅನಿರೀಕ್ಷಿತವಾಗಿ ನಿಲ್ಲುವುದನ್ನು ತಪ್ಪಿಸಿ. ಯಾವ ಯಂತ್ರಕ್ಕೆ ಎಷ್ಟು ದಿನದಲ್ಲಿ ಸರ್ವೀಸ್ ಬೇಕು ಎಂದು ನೋಡಿ.',
      serviceListTitle: 'ನಿಗದಿತ ಸರ್ವೀಸ್ ಪಟ್ಟಿ',
      healthyGaugeTitle: 'CNC-07 ಟೂಲ್ ಆರೋಗ್ಯ',
      toolWearHealthy: 'ಟೂಲ್ ಸ್ಥಿತಿ: ಉತ್ತಮವಾಗಿದೆ',
      toolWearCheck: 'ಟೂಲ್ ಸ್ಥಿತಿ: ಶೀಘ್ರದಲ್ಲೇ ಸರ್ವೀಸ್ ಮಾಡಿ',
      moneySavedTitle: 'ಉಳಿಸಲಾದ ಹಣದ ಮೊತ್ತ',
      moneySavedDesc: 'ಕಳೆದ 30 ದಿನಗಳಲ್ಲಿ 7 ದೊಡ್ಡ ಯಂತ್ರ ಕೆಡುವಿಕೆಯನ್ನು ತಪ್ಪಿಸಿ, ಸುಮಾರು ₹4.2 ಲಕ್ಷ ಉಳಿಸಲಾಗಿದೆ.',
      serviceIn: 'ಸರ್ವೀಸ್‌ಗೆ ಬಾಕಿ',
      daysRemaining: 'ದಿನಗಳು',
      healthyStatus: 'ಉತ್ತಮ ಸ್ಥಿತಿ',
      attentionStatus: 'ಸರ್ವೀಸ್ ಬುಕ್ ಮಾಡಿ',
      actionSchedule: 'ಮೆಕ್ಯಾನಿಕ್ ಸಂಪರ್ಕಿಸಿ',
      spindleBearing: 'ಸ್ಪಿಂಡಲ್ ಬೇರಿಂಗ್',
      contactorRelay: 'ರಿಲೇ ಸ್ವಿಚ್',
      coolantPump: 'ಕೂಲಿಂಗ್ ಪಂಪ್',
    },
    optimization: {
      title: 'ಸುಲಭ ಉಳಿತಾಯ ಮತ್ತು ಸುಧಾರಣೆಗಳು',
      desc: 'ವಿದ್ಯುತ್ ಉಳಿಸುವ, ವೇಸ್ಟೇಜ್ ಕಡಿಮೆ ಮಾಡುವ ಮತ್ತು ಲಾಭ ಹೆಚ್ಚಿಸುವ ಸುಲಭ ಸಲಹೆಗಳು.',
      tipsTitle: 'ಹಣ ಉಳಿಸುವ ಮುಖ್ಯ ಸಲಹೆಗಳು',
      savingsTitle: 'ಮೊದಲು ಮತ್ತು ಈಗಿನ ವ್ಯತ್ಯಾಸ',
      scrapRate: 'ವೇಸ್ಟ್ ಆದ ಸಾಮಗ್ರಿ',
      avgCycleTime: 'ಒಂದು ಭಾಗಕ್ಕೆ ತಗಲುವ ಸಮಯ',
      unplannedDowntime: 'ಯಂತ್ರ ಅನಿರೀಕ್ಷಿತವಾಗಿ ನಿಲ್ಲುವುದು',
      beforeText: 'ಹಿಂದೆ (ಹಳೆಯ ವಿಧಾನ)',
      afterText: 'ಈಗ (ಹೊಸ ವಿಧಾನ)',
      improvementBadge: 'ಸುಧಾರಿಸಿದೆ',
    },
    assistant: {
      title: 'ಫ್ಯಾಕ್ಟರಿ AI ಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ',
      desc: 'ಯಾವುದಾದರೂ ಸಂದೇಹವಿದೆಯೇ? ಟೈಪ್ ಮಾಡುವ ಅಗತ್ಯವಿಲ್ಲ — ಕೆಳಗಿನ ಬಟನ್‌ಗಳನ್ನು ಒತ್ತಿ.',
      connectedStatus: 'ಕಾರ್ಖಾನೆಗೆ ನೇರವಾಗಿ ಸಂಪರ್ಕಗೊಂಡಿದೆ',
      clearChat: 'ಚಾಟ್ ಅಳಿಸಿ',
      inputPlaceholder: 'ಕೇಳಿ: ಯಾವುದಾದರೂ ಯಂತ್ರದಲ್ಲಿ ತೊಂದರೆ ಇದೆಯೇ? ಅಥವಾ ಇಂದು ಎಷ್ಟು ಭಾಗ ತಯಾರಾಗಿದೆ?',
      send: 'ಕೇಳಿ',
      suggestedChipsTitle: '1-ಟ್ಯಾಪ್ ಸುಲಭ ಪ್ರಶ್ನೆಗಳು (ಒತ್ತಿರಿ):',
      chips: [
        'ಈಗ ಯಾವುದಾದರೂ ಯಂತ್ರದಲ್ಲಿ ಸಮಸ್ಯೆ ಇದೆಯೇ?',
        'ಇಂದು ಒಟ್ಟು ಎಷ್ಟು ಭಾಗಗಳು ತಯಾರಾಗಿವೆ?',
        'ಕಾರ್ಖಾನೆಯ ದಕ್ಷತೆ ಮತ್ತು ವೇಗ ಹೇಗಿದೆ?',
        'ಮುಂದಿನ ಯಂತ್ರದ ಸರ್ವೀಸ್ ಯಾವಾಗ ಮಾಡಬೇಕು?',
        'ಎಲ್ಲಾ ಸುರಕ್ಷತಾ ವಲಯಗಳು ಸುರಕ್ಷಿತವಾಗಿದೆಯೇ?',
      ],
      initialGreeting: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಫ್ಯಾಕ್ಟರಿ AI ಸಹಾಯಕ. ನಿಮ್ಮ ಎಲ್ಲಾ ಯಂತ್ರಗಳು ಮತ್ತು ಗುಣಮಟ್ಟದ ಮೇಲೆ ನಾನು ನಿಗಾ ಇಡುತ್ತೇನೆ. ಬಲಗಡೆಯ ಬಟನ್ ಒತ್ತಿ ಅಥವಾ ಯಾವುದೇ ಪ್ರಶ್ನೆಯನ್ನು ಸುಲಭವಾಗಿ ಕೇಳಿ.',
      clearedMessage: 'ಚಾಟ್ ಇತಿಹಾಸ ತೆರವುಗೊಂಡಿದೆ. ನೀವು ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಬಹುದು.',
    },
    categories: {
      operations: 'ಕಾರ್ಯಾಚರಣೆಗಳು',
      quality: 'ಗುಣಮಟ್ಟ',
      maintenance: 'ನಿರ್ವಹಣೆ',
      analytics: 'ವಿಶ್ಲೇಷಣೆ',
      intelligence: 'ಬುದ್ಧಿವಂತಿಕೆ (AI)',
    },
    common: {
      searchPlaceholder: 'ಯಂತ್ರ, ಭಾಗ, ಲೈನ್ ಹುಡುಕಿ...',
      live: 'ಲೈವ್ ಟೆಲಿಮೆಟ್ರಿ',
      paused: 'ಸ್ಟ್ರೀಮ್ ನಿಲ್ಲಿಸಲಾಗಿದೆ',
      running: 'ಚಾಲನೆಯಲ್ಲಿದೆ',
      idle: 'ನಿಷ್ಕ್ರಿಯ',
      warning: 'ಗಮನಿಸಿ',
      inspect: 'ಪರಿಶೀಲಿಸಿ',
      viewAll: 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ',
      target: 'ಗುರಿ',
      actual: 'ವಾಸ್ತವ',
      ahead: 'ಮುಂದಿದೆ',
      behind: 'ಹಿಂದಿದೆ',
      exportLog: 'ಟೆಲಿಮೆಟ್ರಿ ಲಾಗ್ ↓',
      quickPrompts: 'ತ್ವರಿತ ಪ್ರಶ್ನೆಗಳು:',
      askAnythingTitle: 'ಏನನ್ನಾದರೂ ಕೇಳಿ',
      askAnythingSub: 'RAG AI ನಿಂದ ಚಾಲಿತವಾಗಿದೆ',
      timeRemaining: 'ಉಳಿದ ಭಾಗಗಳು',
      estCompletion: 'ಅಂದಾಜು ಮುಕ್ತಾಯ',
      availability: 'ಲಭ್ಯತೆ',
      performance: 'ಕಾರ್ಯಕ್ಷಮತೆ',
      quality: 'ಗುಣಮಟ್ಟ',
      hours: 'ಗಂಟೆಗಳು',
      days: 'ದಿನಗಳು',
      cadenceTitle: 'ಶಿಫ್ಟ್ ಉತ್ಪಾದನಾ ವೇಗ (ಗುರಿ ವಿರುದ್ಧ ವಾಸ್ತವ)',
      activeAlarmsTitle: 'ಸಕ್ರಿಯ ಅಲಾರಂಗಳು ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳು (3)',
      shiftTargetTitle: 'ಶಿಫ್ಟ್ ಉತ್ಪಾದನಾ ಗುರಿ',
      oeeCompositionTitle: 'OEE ವಿವರ',
      edgeConnectivityTitle: 'ಎಡ್ಜ್ ಕನೆಕ್ಟಿವಿಟಿ ಮತ್ತು DAQ',
      colMachine: 'ಯಂತ್ರ',
      colModelLine: 'ಮಾದರಿ ಮತ್ತು ಲೈನ್',
      colWorkpiece: 'ಭಾಗ ಮತ್ತು ಬ್ಯಾಚ್',
      colStatus: 'ಸ್ಥಿತಿ',
      colSpeed: 'ವೇಗ (RPM)',
      colTemp: 'ತಾಪಮಾನ (°C)',
      colSmoothness: 'ಸ್ಮೂತ್‌ನೆಸ್',
      colOee: 'OEE',
      colAction: 'ಕ್ರಮ',
      colAnomaly: 'ದೋಷ ಮತ್ತು ಮಿತಿ',
      colSeverity: 'ತೀವ್ರತೆ',
      colReported: 'ಸಮಯ',
      testDefect: '⚡ ದೋಷ ಪರೀಕ್ಷೆ',
    },
  },

  ta: {
    brand: {
      name: 'Foundry OS',
      sub: 'ஸ்மார்ட் தொழிற்சாலை உதவியாளர்',
      liveFeed: 'தொழிற்சாலை நேரலை இணைப்பு',
      feedPaused: 'இணைப்பு இடைநிறுத்தப்பட்டது',
      pauseStream: 'இடைநிறுத்து',
      resumeStream: 'தொடரவும்',
    },
    nav: {
      overview: 'தொழிற்சாலை முகப்பு',
      collection: 'இயந்திரங்களின் நிலை',
      edgeSignals: 'எட்ஜ் சிக்னல் அட்டவணை',
      vision: 'கேமரா தர ஆய்வு',
      maintenance: 'பராமரிப்பு & பழுது',
      downtime: 'செயலிழப்பு & OEE',
      traceability: 'பொருள் கண்டறிதல்',
      production: 'உற்பத்தி',
      optimization: 'சேமிப்பு & மேம்பாடு',
      smartKpi: '4G & 5G KPIs',
      assistant: 'தொழிற்சாலை AI உதவியாளர்',
    },
    topbar: {
      nominal: 'அனைத்து 11 இயந்திரங்களும் சிறப்பாக இயங்குகின்றன',
      alertsActive: '1 இயந்திரத்திற்கு விரைவில் பராமரிப்பு தேவை',
      switchTheme: 'வண்ண தீம் மாற்று',
      execStatusHealthy: 'தொழிற்சாலை சீராக இயங்குகிறது',
      execStatusWarning: '1 இயந்திரத்தை கவனிக்க வேண்டும்',
      allGoodSummary: 'அனைத்து இயந்திரங்களும் இயங்குகின்றன, 98% பாகங்கள் நல்ல தரத்துடன் தேர்ச்சி பெற்றுள்ளன.',
      warningSummary: 'CNC-07 சுழலில் லேசான அதிர்வு உள்ளது. அடுத்த 12 நாட்களில் வழக்கமான பராமரிப்பு செய்ய பரிந்துரைக்கப்படுகிறது.',
    },
    overview: {
      title: 'எளிய தொழிற்சாலை பார்வை',
      desc: 'கடினமான கணினி வார்த்தைகள் இல்லாமல் உங்கள் இயந்திரங்கள் மற்றும் உற்பத்தியை எளிதாக கண்காணிக்கலாம்.',
      kpiOee: 'தொழிற்சாலையின் வேகம்',
      kpiOeeSub: '90% இலக்கை நெருங்குகிறது',
      kpiMachines: 'இயங்கும் இயந்திரங்கள்',
      kpiMachinesSub: '12 இல் 11 நன்றாக இயங்குகின்றன',
      kpiAlerts: 'கவனிக்க வேண்டியவை',
      kpiAlertsSub: '1 இயந்திரத்திற்கு விரைவில் பராமரிப்பு',
      kpiParts: 'இன்று தயாரான பாகங்கள்',
      kpiPartsSub: 'நேரலை எண்ணிக்கை நடக்கிறது',
      pipelineTitle: 'இது எவ்வாறு செயல்படுகிறது (4 எளிய படிகள்)',
      howItWorks: 'ஸ்மார்ட் தொழில்நுட்பம் தொழிற்சாலையை எவ்வாறு பாதுகாக்கிறது',
      step1Title: '1. இயந்திரங்கள் தரவை அனுப்புகின்றன',
      step1Desc: 'சென்சார்கள் மோட்டார் வேகம் மற்றும் வெப்பநிலையை கண்காணிக்கின்றன.',
      step2Title: '2. ஸ்மார்ட் கேமரா ஆய்வு',
      step2Desc: 'கேமரா பாகங்களை படம் பிடித்து உடனுக்குடன் குறைபாடுகளை கண்டறியும்.',
      step3Title: '3. முன்கூட்டிய எச்சரிக்கை',
      step3Desc: 'இயந்திரம் பழுதடையும் முன்பே தெரிவிப்பதால் உற்பத்தி நிற்காது.',
      step4Title: '4. தமிழில் கேட்டு அறியலாம்',
      step4Desc: 'தமிழில் கேள்வி கேட்டு உடனுக்குடன் எளிய பதில்களைப் பெறலாம்.',
      cvFitTitle: 'கேமரா எவ்வாறு உதவுகிறது',
      cardQualityTitle: 'குறைபாடற்ற தயாரிப்பு',
      cardQualityDesc: 'கேமரா 0.05 வினாடிகளில் அளவிட்டு தரமற்ற பாகங்களை உடனே தடுத்துவிடும்.',
      cardMaintTitle: 'பழுதாகும் முன் தகவல்',
      cardMaintDesc: 'கருவி தேய்மானத்தை முன்கூட்டியே கூறி அதிகப்படியான செலவை குறைக்கிறது.',
      cardSafetyTitle: 'தொழிலாளர் பாதுகாப்பு',
      cardSafetyDesc: 'பாதுகாப்பு உடைகள் மற்றும் ஹெல்மெட்டுகளை கண்காணித்து விபத்துக்களை தடுக்கிறது.',
      demoNote: 'நேரலை மாதிரி: நீங்கள் எந்த பொத்தானையும் அழுத்தி எளிதாக சோதிக்கலாம்.',
    },
    collection: {
      title: 'இயந்திரங்களின் ஆரோக்கியம் & நிலை',
      desc: 'எந்த இயந்திரம் நன்றாக ஓடுகிறது, வெப்பநிலை எப்படி உள்ளது என்பதை எளிதாகப் பாருங்கள்.',
      filterAll: 'அனைத்து 12 இயந்திரங்கள்',
      filterAttention: 'கவனிக்க வேண்டியவை',
      runningGood: 'நன்றாக இயங்குகிறது',
      needsAttention: 'ஆய்வு தேவை',
      spindleSpeed: 'மோட்டார் வேகம்',
      temperature: 'வெப்பநிலை',
      smoothness: 'அதிர்வு நிலை',
      cycleTime: 'தயாரிப்பு நேரம்',
      tempNormal: 'இயல்பானது (Normal)',
      tempHigh: 'சற்று சூடாக உள்ளது',
      vibSmooth: 'மிகவும் சீரானது',
      vibCheck: 'லேசான அதிர்வு',
      logTitle: 'நேரலை சென்சார் விவரம்',
      liveBuffer: 'நேரலையில் உள்ளது',
    },
    vision: {
      title: 'கேமரா மூலம் உடனடி தர ஆய்வு',
      desc: 'பாகம் தயாரான உடனே ஸ்மார்ட் கேமரா ஆய்வு செய்கிறது. நேரலை காட்சியை கீழே பாருங்கள்.',
      liveCamera: 'கேமரா நேரலை ஆய்வு',
      cameraSub: 'ஒவ்வொரு பாகமும் 0.04 வினாடியில் ஆய்வு செய்யப்படுகிறது',
      rollingSequence: 'ஆய்வு செய்யப்பட்ட பாகங்கள் (பச்சை = தேர்ச்சி · சிவப்பு = நிராகரிப்பு)',
      pass: 'நல்ல பாகம் (PASS)',
      fail: 'குறைபாடு பிடிபட்டது',
      qualityCardTitle: 'இன்றைய தர மதிப்பீடு',
      goodPartsPercent: 'நல்ல பாகங்களின் விகிதம்',
      defectPercent: 'குறைபாடு விகிதம்',
      safetyCardTitle: 'பாதுகாப்பு நிலை',
      safeStatus: 'பாதுகாப்பானது',
      checkingStatus: 'சரிபார்க்கப்படுகிறது',
      zoneA: 'CNC இயந்திர பகுதி',
      zoneB: 'ஏற்றுமதி தளம்',
      zoneC: 'ரோபோ பணி பகுதி',
      recentCaptures: 'சமீபத்திய ஒளியியல் ஆய்வுகள்',
    },
    maintenance: {
      title: 'அடுத்த பராமரிப்பு மற்றும் பழுது',
      desc: 'இயந்திரங்கள் எதிர்பாராமல் நிற்பதை தவிர்க்கவும். எந்த இயந்திரத்திற்கு எத்தனை நாட்களில் பராமரிப்பு தேவை என்று பாருங்கள்.',
      serviceListTitle: 'திட்டமிடப்பட்ட பராமரிப்பு பட்டியல்',
      healthyGaugeTitle: 'CNC-07 கருவி நிலை',
      toolWearHealthy: 'கருவி நிலை: நன்று',
      toolWearCheck: 'கருவி நிலை: விரைவில் சரிசெய்யவும்',
      moneySavedTitle: 'சேமிக்கப்பட்ட பணம்',
      moneySavedDesc: 'கடந்த 30 நாட்களில் 7 பெரிய பழுதுகள் தடுக்கப்பட்டு, சுமார் ₹4.2 லட்சம் சேமிக்கப்பட்டது.',
      serviceIn: 'பராமரிப்புக்கு மீதம்',
      daysRemaining: 'நாட்கள்',
      healthyStatus: 'நல்ல நிலையில் உள்ளது',
      attentionStatus: 'பராமரிப்பை பதிவு செய்யவும்',
      actionSchedule: 'தொழில்நுட்ப வல்லுநரை அழைக்கவும்',
      spindleBearing: 'சுழல் தாங்கி (Bearing)',
      contactorRelay: 'ரிலே சுவிட்ச்',
      coolantPump: 'குளிர்விக்கும் பம்ப்',
    },
    optimization: {
      title: 'எளிய சேமிப்பு மற்றும் மேம்பாடுகள்',
      desc: 'மின்சாரத்தை மிச்சப்படுத்தவும், கழிவுகளை குறைக்கவும் AI கண்டறிந்த எளிய வழிகள்.',
      tipsTitle: 'முக்கிய சேமிப்பு குறிப்புகள்',
      savingsTitle: 'முன்பு மற்றும் இப்போது உள்ள வேறுபாடு',
      scrapRate: 'வீணான மூலப்பொருள்',
      avgCycleTime: 'ஒரு பாகத்திற்கு ஆகும் நேரம்',
      unplannedDowntime: 'திடீர் இயந்திர முடக்கம்',
      beforeText: 'முன்பு (பழைய வழி)',
      afterText: 'இப்போது (புதிய வழி)',
      improvementBadge: 'மேம்பட்டுள்ளது',
    },
    assistant: {
      title: 'தொழிற்சாலை AI இடம் கேளுங்கள்',
      desc: 'ஏதேனும் கேள்விகள் உள்ளதா? தட்டச்சு செய்ய வேண்டியதில்லை — கீழே உள்ள பொத்தான்களை அழுத்தவும்.',
      connectedStatus: 'தொழிற்சாலையுடன் நேரடியாக இணைக்கப்பட்டுள்ளது',
      clearChat: 'அரட்டையை அழிக்கவும்',
      inputPlaceholder: 'கேளுங்கள்: ஏதேனும் இயந்திரத்தில் பிரச்சனை உள்ளதா? அல்லது இன்று எவ்வளவு தயாரானது?',
      send: 'கேளுங்கள்',
      suggestedChipsTitle: '1-கிளிக் எளிய கேள்விகள் (அழுத்தவும்):',
      chips: [
        'இப்போது ஏதேனும் இயந்திரத்தில் பிரச்சனை உள்ளதா?',
        'இன்று மொத்தம் எத்தனை பாகங்கள் தயாராகின?',
        'தொழிற்சாலையின் செயல்திறன் எப்படி உள்ளது?',
        'அடுத்த இயந்திர பராமரிப்பு எப்போது செய்ய வேண்டும்?',
        'அனைத்து பாதுகாப்பு மண்டலங்களும் பாதுகாப்பாக உள்ளதா?',
      ],
      initialGreeting: 'வணக்கம்! நான் உங்கள் தொழிற்சாலை AI உதவியாளர். உங்கள் இயந்திரங்கள் மற்றும் உற்பத்தியை நான் கண்காணிக்கிறேன். வலதுபுறம் உள்ள கேள்விகளை தட்டவும் அல்லது எதையும் கேளுங்கள்.',
      clearedMessage: 'அரட்டை அழிக்கப்பட்டது. நீங்கள் எந்த கேள்வியையும் கேட்கலாம்.',
    },
    categories: {
      operations: 'செயல்பாடுகள்',
      quality: 'தரம்',
      maintenance: 'பராமரிப்பு',
      analytics: 'பகுப்பாய்வு',
      intelligence: 'நுண்ணறிவு (AI)',
    },
    common: {
      searchPlaceholder: 'இயந்திரம், பகுதி, லைன் தேடுங்கள்...',
      live: 'நேரலை டெலிமெட்ரி',
      paused: 'ஸ்ட்ரீம் நிறுத்தப்பட்டது',
      running: 'இயங்குகிறது',
      idle: 'செயலற்றது',
      warning: 'கவனம்',
      inspect: 'ஆய்வு செய்',
      viewAll: 'அனைத்தையும் காண்க',
      target: 'இலக்கு',
      actual: 'உண்மையான',
      ahead: 'முன்னால்',
      behind: 'பின்னடைவு',
      exportLog: 'டெலிமெட்ரி பதிவு ↓',
      quickPrompts: 'விரைவு வினாக்கள்:',
      askAnythingTitle: 'எதையும் கேளுங்கள்',
      askAnythingSub: 'RAG AI மூலம் இயங்குகிறது',
      timeRemaining: 'மீதமுள்ள பாகங்கள்',
      estCompletion: 'முடிவு நேரம்',
      availability: 'கிடைக்கும் தன்மை',
      performance: 'செயல்திறன்',
      quality: 'தரம்',
      hours: 'மணி',
      days: 'நாட்கள்',
      cadenceTitle: 'ஷிப்ட் உற்பத்தி வேகம் (இலக்கு vs உண்மை)',
      activeAlarmsTitle: 'செயலில் உள்ள அலாரங்கள் (3)',
      shiftTargetTitle: 'ஷிப்ட் உற்பத்தி இலக்கு',
      oeeCompositionTitle: 'OEE பகுப்பாய்வு',
      edgeConnectivityTitle: 'எட்ஜ் இணைப்பு மற்றும் DAQ',
      colMachine: 'இயந்திரம்',
      colModelLine: 'மாதிரி மற்றும் லைன்',
      colWorkpiece: 'பாகம் மற்றும் தொகுதி',
      colStatus: 'நிலை',
      colSpeed: 'வேகம் (RPM)',
      colTemp: 'வெப்பநிலை (°C)',
      colSmoothness: 'மென்மை',
      colOee: 'OEE',
      colAction: 'நடவடிக்கை',
      colAnomaly: 'சிக்கல் மற்றும் வரம்பு',
      colSeverity: 'தீவிரம்',
      colReported: 'நேரம்',
      testDefect: '⚡ குறைபாடு சோதனை',
    },
  },

  te: {
    brand: {
      name: 'Foundry OS',
      sub: 'స్మార్ట్ ఫ్యాక్టరీ అసిస్టెంట్',
      liveFeed: 'ఫ్యాక్టరీ లైవ్ కనెక్ట్ అయింది',
      feedPaused: 'ఫీడ్ పాజ్ చేయబడింది',
      pauseStream: 'పాజ్ చేయండి',
      resumeStream: 'కొనసాగించండి',
    },
    nav: {
      overview: 'ఫ్యాక్టరీ డ్యాష్‌బోర్డ్',
      collection: 'మెషిన్ల స్థితి',
      edgeSignals: 'ఎడ్జ్ సిగ్నల్స్ కేటలాగ్',
      vision: 'కెమెరా నాణ్యత తనిఖీ',
      maintenance: 'సర్వీస్ & రిపేర్లు',
      downtime: 'డౌన్‌టైమ్ & OEE',
      traceability: 'మెటీరియల్ ట్రేసిబిలిటీ',
      production: 'ఉత్పత్తి',
      optimization: 'పొదుపు & మెరుగుదల',
      smartKpi: '4G & 5G KPIs',
      assistant: 'ఫ్యాక్టరీ AI ని అడగండి',
    },
    topbar: {
      nominal: 'అన్ని 11 మెషిన్లు బాగున్నాయి',
      alertsActive: '1 మెషిన్‌కు త్వరలో సర్వీస్ అవసరం',
      switchTheme: 'రంగు మార్చండి (డార్క్ / లైట్)',
      execStatusHealthy: 'ఫ్యాక్టరీ సాధారణంగా నడుస్తోంది',
      execStatusWarning: '1 మెషిన్‌పై శ్రద్ధ అవసరం',
      allGoodSummary: 'అన్ని మెషిన్లు నడుస్తున్నాయి, 98% భాగాలు మంచి నాణ్యతతో పాస్ అయ్యాయి.',
      warningSummary: 'CNC-07 మెషిన్‌లో స్వల్ప కంపనం ఉంది. తదుపరి 12 రోజుల్లో సాధారణ సర్వీస్ చేయించండి.',
    },
    overview: {
      title: 'సరళమైన ఫ్యాక్టరీ అవలోకనం',
      desc: 'కష్టమైన కంప్యూటర్ పదాలు లేకుండా మీ మెషిన్లు, నాణ్యత మరియు ఉత్పత్తి వివరాలను సులభంగా చూడండి.',
      kpiOee: 'ఫ్యాక్టరీ పనితీరు',
      kpiOeeSub: '90% లక్ష్యానికి చేరువలో ఉంది',
      kpiMachines: 'నడుస్తున్న మెషిన్లు',
      kpiMachinesSub: '12 లో 11 బాగున్నాయి',
      kpiAlerts: 'గమనించాల్సిన అంశాలు',
      kpiAlertsSub: '1 మెషిన్‌కు త్వరలో సర్వీస్',
      kpiParts: 'ఈరోజు తయారైన భాగాలు',
      kpiPartsSub: 'లైవ్ కౌంట్ కొనసాగుతోంది',
      pipelineTitle: 'ఇది ఎలా పనిచేస్తుంది (4 సులభ దశలు)',
      howItWorks: 'స్మార్ట్ సిస్టమ్ మీ ఫ్యాక్టరీని ఎలా కాపాడుతుంది',
      step1Title: '1. మెషిన్ల సమాచారం',
      step1Desc: 'సెన్సార్లు వేగం మరియు ఉష్ణోగ్రతను స్వయంచాలకంగా లెక్కిస్తాయి.',
      step2Title: '2. స్మార్ట్ కెమెరా తనిఖీ',
      step2Desc: 'కెమెరా ప్రతి భాగాన్ని ఫోటో తీసి వెంటనే లోపాలను పసిగడుతుంది.',
      step3Title: '3. ముందస్తు హెచ్చరిక',
      step3Desc: 'మెషిన్ పాడవకముందే సమాచారం ఇస్తుంది, పని ఆగదు.',
      step4Title: '4. మాట్లాడి తెలుసుకోండి',
      step4Desc: 'తెలుగులో నేరుగా ప్రశ్నలు అడిగి సులభ సమాధానాలు పొందండి.',
      cvFitTitle: 'కెమెరా మీకు ఎలా సహాయపడుతుంది',
      cardQualityTitle: 'లోపాలు లేని సరుకు',
      cardQualityDesc: 'కెమెరా 0.05 సెకన్లలో తనిఖీ చేస్తుంది, చెడిపోయిన భాగం బయటకు వెళ్లదు.',
      cardMaintTitle: 'పాడవకముందే సమాచారం',
      cardMaintDesc: 'టూల్ అరిగిపోయే ముందే తెలిపి అధిక ఖర్చును నివారిస్తుంది.',
      cardSafetyTitle: 'కార్మికుల భద్రత',
      cardSafetyDesc: 'హెల్మెట్లు మరియు భద్రతా దుస్తులను పర్యవేక్షించి ప్రమాదాలను నివారిస్తుంది.',
      demoNote: 'లైవ్ డెమో: మీరు ఏ బటన్‌నైనా నొక్కి దీన్ని సులభంగా పరీక్షించవచ్చు.',
    },
    collection: {
      title: 'మెషిన్ల ఆరోగ్యం & స్థితి',
      desc: 'ఏ మెషిన్ బాగుంది, ఉష్ణోగ్రత ఎలా ఉంది మరియు దేనికి సర్వీస్ కావాలో సులభంగా చూడండి.',
      filterAll: 'అన్ని 12 మెషిన్లు',
      filterAttention: 'శ్రద్ధ వహించాల్సినవి',
      runningGood: 'బాగా నడుస్తోంది',
      needsAttention: 'తనిఖీ అవసరం',
      spindleSpeed: 'మోటార్ వేగం',
      temperature: 'ఉష్ణోగ్రత',
      smoothness: 'కంపనం స్థాయి',
      cycleTime: 'తయారీ సమయం',
      tempNormal: 'సాధారణం (Normal)',
      tempHigh: 'కాస్త వేడిగా ఉంది',
      vibSmooth: 'చాలా స్మూత్',
      vibCheck: 'తేలికపాటి కంపనం',
      logTitle: 'లైవ్ సెన్సార్ సమాచారం',
      liveBuffer: 'లైవ్ లో ఉంది',
    },
    vision: {
      title: 'కెమెరా ద్వారా తక్షణ నాణ్యత తనిఖీ',
      desc: 'భాగం తయారైన వెంటనే స్మార్ట్ కెమెరా తనిఖీ చేస్తుంది. లైవ్ దృశ్యాన్ని క్రింద చూడండి.',
      liveCamera: 'కెమెరా లైవ్ తనిఖీ చేస్తోంది',
      cameraSub: 'ప్రతి భాగం 0.04 సెకన్లలో తనిఖీ చేయబడుతుంది',
      rollingSequence: 'తనిఖీ చేసిన భాగాలు (ఆకుపచ్చ = పాస్ · ఎరుపు = తిరస్కరణ)',
      pass: 'మంచి భాగం (PASS)',
      fail: 'లోపం పట్టుబడింది',
      qualityCardTitle: 'నేటి నాణ్యత స్కోరు',
      goodPartsPercent: 'మంచి భాగాల శాతం',
      defectPercent: 'లోపాల శాతం',
      safetyCardTitle: 'రక్షణ స్థితి',
      safeStatus: 'సురక్షితంగా ఉంది',
      checkingStatus: 'పరిశీలిస్తున్నారు',
      zoneA: 'CNC మెషిన్ల ప్రాంతం',
      zoneB: 'లోడింగ్ ప్రాంతం',
      zoneC: 'రోబోట్ పనిచేసే స్థలం',
      recentCaptures: 'ఇటీవలి ఆప్టికల్ తనిఖీలు',
    },
    maintenance: {
      title: 'తదుపరి సర్వీస్ మరియు రిపేర్లు',
      desc: 'మెషిన్లు అకస్మాత్తుగా ఆగకుండా చూడండి. ఏ మెషిన్‌కు ఎన్ని రోజుల్లో సర్వీస్ కావాలో తెలుసుకోండి.',
      serviceListTitle: 'షెడ్యూల్ చేసిన సర్వీస్ జాబితా',
      healthyGaugeTitle: 'CNC-07 టూల్ ఆరోగ్యం',
      toolWearHealthy: 'టూల్ స్థితి: బాగుంది',
      toolWearCheck: 'టూల్ స్థితి: త్వరలో సర్వీస్ చేయండి',
      moneySavedTitle: 'ఆదా అయిన డబ్బు',
      moneySavedDesc: 'గత 30 రోజుల్లో 7 పెద్ద బ్రేక్‌డౌన్‌లను నివారించి, దాదాపు ₹4.2 లక్షలు ఆదా చేయబడింది.',
      serviceIn: 'సర్వీస్‌కు మిగిలిన సమయం',
      daysRemaining: 'రోజులు',
      healthyStatus: 'మంచి స్థితిలో ఉంది',
      attentionStatus: 'సర్వీస్ బుక్ చేయండి',
      actionSchedule: 'టెక్నీషియన్‌ను సంప్రదించండి',
      spindleBearing: 'స్పిండిల్ బేరింగ్',
      contactorRelay: 'రిలే స్విచ్',
      coolantPump: 'కూలింగ్ పంప్',
    },
    optimization: {
      title: 'సులభ పొదుపు మరియు మెరుగుదలలు',
      desc: 'కరెంట్ ఆదా చేయడానికి, వేస్టేజ్ తగ్గించడానికి AI కనుగొన్న సులభమైన మార్గాలు.',
      tipsTitle: 'ముఖ్యమైన పొదుపు చిట్కాలు',
      savingsTitle: 'ముందు మరియు ఇప్పటి తేడా',
      scrapRate: 'వృధా అయిన సరుకు',
      avgCycleTime: 'ఒక భాగానికి పట్టే సమయం',
      unplannedDowntime: 'అనుకోకుండా మెషిన్ ఆగడం',
      beforeText: 'గతంలో (పాత విధానం)',
      afterText: 'ఇప్పుడు (కొత్త విధానం)',
      improvementBadge: 'మెరుగైంది',
    },
    assistant: {
      title: 'ఫ్యాక్టరీ AI ని అడగండి',
      desc: 'ఏదైనా సందేహం ఉందా? టైప్ చేయాల్సిన అవసరం లేదు — క్రింది బటన్లను నొక్కండి.',
      connectedStatus: 'ఫ్యాక్టరీతో నేరుగా అనుసంధానించబడింది',
      clearChat: 'చాట్ క్లియర్ చేయండి',
      inputPlaceholder: 'అడగండి: ఏదైనా మెషిన్‌లో సమస్య ఉందా? లేదా ఈరోజు ఎంత తయారైంది?',
      send: 'అడగండి',
      suggestedChipsTitle: '1-ట్యాప్ సులభ ప్రశ్నలు (నొక్కండి):',
      chips: [
        'ప్రస్తుతం ఏదైనా మెషిన్‌లో సమస్య ఉందా?',
        'ఈరోజు మొత్తం ఎన్ని భాగాలు తయారయ్యాయి?',
        'ఫ్యాక్టరీ సామర్థ్యం మరియు వేగం ఎలా ఉంది?',
        'తదుపరి మెషిన్ సర్వీస్ ఎప్పుడు చేయాలి?',
        'అన్ని భద్రతా జోన్లు సురక్షితంగా ఉన్నాయా?',
      ],
      initialGreeting: 'నమస్కారం! నేను మీ ఫ్యాక్టరీ AI అసిస్టెంట్‌ని. మీ అన్ని మెషిన్లు మరియు నాణ్యతను నేను పర్యవేక్షిస్తాను. కుడివైపు ఉన్న బటన్ నొక్కండి లేదా ఏదైనా ప్రశ్నను సులభంగా అడగండి.',
      clearedMessage: 'చాట్ క్లియర్ చేయబడింది. మీరు ఏ ప్రశ్නයైనా అడగవచ్చు.',
    },
    categories: {
      operations: 'కార్యకలాపాలు',
      quality: 'నాణ్యత',
      maintenance: 'నిర్వహణ',
      analytics: 'విశ్లేషణలు',
      intelligence: 'ఇంటెలిజెన్స్ (AI)',
    },
    common: {
      searchPlaceholder: 'మెషిన్, భాగం, లైన్ శోధించండి...',
      live: 'లైవ్ టెలిమెట్రీ',
      paused: 'స్ట్రీమ్ ఆపబడింది',
      running: 'నడుస్తోంది',
      idle: 'ఖాళీగా ఉంది',
      warning: 'శ్రద్ధ వహించండి',
      inspect: 'పరిశీలించండి',
      viewAll: 'అన్నీ చూడండి',
      target: 'లక్ష్యం',
      actual: 'వాస్తవ',
      ahead: 'ముందుంది',
      behind: 'వెనుకబడి ఉంది',
      exportLog: 'టెలిమెట్రీ లాగ్ ↓',
      quickPrompts: 'త్వరిత ప్రశ్నలు:',
      askAnythingTitle: 'ఏదైనా అడగండి',
      askAnythingSub: 'RAG AI ద్వారా ఆధారితం',
      timeRemaining: 'మిగిలిన భాగాలు',
      estCompletion: 'పూర్తయ్యే సమయం',
      availability: 'లభ్యత',
      performance: 'పనితీరు',
      quality: 'నాణ్యత',
      hours: 'గంటలు',
      days: 'రోజులు',
      cadenceTitle: 'షిఫ్ట్ ఉత్పత్తి వేగం (లక్ష్యం vs వాస్తవం)',
      activeAlarmsTitle: 'యాక్టివ్ అలారాలు మరియు హెచ్చరికలు (3)',
      shiftTargetTitle: 'షిఫ్ట్ ఉత్పత్తి లక్ష్యం',
      oeeCompositionTitle: 'OEE వివరాలు',
      edgeConnectivityTitle: 'ఎడ్జ్ కనెక్టివిటీ మరియు DAQ',
      colMachine: 'మెషిన్',
      colModelLine: 'మోడల్ మరియు లైన్',
      colWorkpiece: 'భాగం మరియు బ్యాచ్',
      colStatus: 'స్థితి',
      colSpeed: 'స్పీడ్ (RPM)',
      colTemp: 'ఉష్ణోగ్రత (°C)',
      colSmoothness: 'స్మూత్‌నెస్',
      colOee: 'OEE',
      colAction: 'చర్య',
      colAnomaly: 'సమస్య మరియు పరిమితి',
      colSeverity: 'తీవ్రత',
      colReported: 'సమయం',
      testDefect: '⚡ లోపం పరీక్ష',
    },
  },
};
