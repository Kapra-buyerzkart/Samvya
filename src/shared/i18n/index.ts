import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

export const defaultNS = 'translation';

export const resources = {
  en: {
    translation: {
      common: {
        appName: 'HRMS Attendance',
        retry: 'Retry',
        cancel: 'Cancel',
        confirm: 'Confirm',
        submit: 'Submit',
        save: 'Save',
        loading: 'Loading...',
        offline: 'Offline',
        synced: 'Synced',
        pendingSync: 'Pending Sync',
      },
      auth: {
        loginTitle: 'Employee Sign In',
        email: 'Work Email',
        password: 'Password',
        signIn: 'Sign In',
        signOut: 'Sign Out',
        consentTitle: 'Biometric & Location Consent',
        consentNotice:
          'Under the Digital Personal Data Protection Act (DPDP), HRMS processes face geometry solely for identity verification during active check-in/out. Facial images are processed in volatile memory and not retained. Location is tracked exclusively between check-in and check-out.',
        consentAccept: 'I Agree & Continue',
        consentDecline: 'Decline',
      },
      attendance: {
        checkIn: 'Check In',
        checkOut: 'Check Out',
        onDuty: 'On Duty',
        offDuty: 'Off Duty',
        activeShift: 'Active Shift',
        shiftStarted: 'Shift started at',
        geofenceValid: 'Within Office Site',
        geofenceInvalid: 'Outside Office Site',
        history: 'Attendance History',
      },
      face: {
        title: 'Face Verification',
        alignFace: 'Align your face inside the circle',
        holdStill: 'Hold still...',
        blinkPrompt: 'Please blink your eyes',
        turnHeadLeft: 'Turn your head slightly to the left',
        turnHeadRight: 'Turn your head slightly to the right',
        verifying: 'Verifying liveness...',
        verified: 'Face verified',
        failed: 'Verification failed. Please retry.',
        maxRetriesExceeded: 'Maximum retries exceeded. Please submit manual entry for supervisor approval.',
      },
      location: {
        trackingActive: 'Live GPS Tracking Active',
        offDuty: 'Tracking inactive while off duty',
        accuracy: 'Accuracy',
        meters: 'm',
        speed: 'Speed',
        permissionDenied: 'Location permission is required for attendance.',
        openSettings: 'Open Settings',
        mockDetected: 'Simulated location provider detected.',
      },
      manual: {
        title: 'Manual GPS Entry',
        subtitle: 'Audited fallback when GPS is unavailable',
        latitude: 'Latitude',
        longitude: 'Longitude',
        reason: 'Reason for manual submission',
        reasonPlaceholder: 'e.g. GPS signal blocked inside underground facility',
        photoOptional: 'Optional site photo',
        pendingApproval: 'Pending Supervisor Approval',
        approved: 'Approved',
        rejected: 'Rejected',
      },
    },
  },
  hi: {
    translation: {
      common: {
        appName: 'एचआरएमएस उपस्थिति',
        retry: 'पुनः प्रयास करें',
        cancel: 'रद्द करें',
        confirm: 'पुष्टि करें',
        submit: 'जमा करें',
        save: 'सहेजें',
        loading: 'लोड हो रहा है...',
        offline: 'ऑफ़लाइन',
        synced: 'सिंक हो गया',
        pendingSync: 'सिंक बाकी है',
      },
      auth: {
        loginTitle: 'कर्मचारी साइन इन',
        email: 'कार्य ईमेल',
        password: 'पासवर्ड',
        signIn: 'साइन इन',
        signOut: 'साइन आउट',
        consentTitle: 'बायोमेट्रिक और स्थान सहमति',
        consentNotice:
          'डीपीडीपी अधिनियम के तहत, एचआरएमएस केवल सक्रिय चेक-इन के दौरान पहचान सत्यापन के लिए चेहरे का उपयोग करता है।',
        consentAccept: 'मैं सहमत हूँ',
        consentDecline: 'अस्वीकार करें',
      },
      attendance: {
        checkIn: 'चेक इन',
        checkOut: 'चेक आउट',
        onDuty: 'ड्यूटी पर',
        offDuty: 'ड्यूटी समाप्त',
        activeShift: 'सक्रिय शिफ्ट',
        shiftStarted: 'शिफ्ट शुरू हुई',
        geofenceValid: 'कार्यालय परिसर के अंदर',
        geofenceInvalid: 'कार्यालय परिसर के बाहर',
        history: 'उपस्थिति इतिहास',
      },
      face: {
        title: 'चेहरा सत्यापन',
        alignFace: 'अपना चेहरा घेरे में रखें',
        holdStill: 'स्थिर रहें...',
        blinkPrompt: 'कृपया अपनी आँखें झपकाएं',
        turnHeadLeft: 'अपना सिर थोड़ा बाईं ओर घुमाएं',
        turnHeadRight: 'अपना सिर थोड़ा दाईं ओर घुमाएं',
        verifying: 'सत्यापन हो रहा है...',
        verified: 'चेहरा सत्यापित हुआ',
        failed: 'सत्यापन विफल। पुनः प्रयास करें।',
        maxRetriesExceeded: 'अधिकतम प्रयास समाप्त। सुपरवाइजर अनुमोदन के लिए मैनुअल प्रविष्टि भेजें।',
      },
      location: {
        trackingActive: 'लाइव जीपीएस ट्रैकिंग चालू है',
        offDuty: 'ड्यूटी के बाहर ट्रैकिंग बंद है',
        accuracy: 'सटीकता',
        meters: 'मी',
        speed: 'गति',
        permissionDenied: 'स्थान अनुमति आवश्यक है।',
        openSettings: 'सेटिंग्स खोलें',
        mockDetected: 'नकली स्थान का पता चला।',
      },
      manual: {
        title: 'मैनुअल जीपीएस प्रविष्टि',
        subtitle: 'जीपीएस अनुपलब्ध होने पर ऑडिटेड विकल्प',
        latitude: 'अक्षांश',
        longitude: 'देशांतर',
        reason: 'मैनुअल सबमिशन का कारण',
        reasonPlaceholder: 'उदा. बेसमेंट में जीपीएस सिग्नल नहीं था',
        photoOptional: 'वैकल्पिक साइट फोटो',
        pendingApproval: 'सुपरवाइजर अनुमोदन लंबित',
        approved: 'स्वीकृत',
        rejected: 'अस्वीकृत',
      },
    },
  },
} as const;

const deviceLanguage = getLocales()[0]?.languageCode ?? 'en';
const supportedLang = deviceLanguage === 'hi' ? 'hi' : 'en';

// eslint-disable-next-line import/no-named-as-default-member
void i18n.use(initReactI18next).init({
  resources,
  lng: supportedLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
