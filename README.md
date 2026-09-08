# SAHAAY AI — Android App

SAHAAY AI is an Android wellbeing and early-support companion focused on detecting meaningful change, explaining likely contributing factors, reducing repeated retelling, and connecting users to appropriate support.

## Current Android features

- First-run onboarding with name, email, date of birth, preferred language, and reason for using the app
- Permission/connect screens for voice check-ins and Health Connect sleep data
- Adaptive wellbeing check-ins using mood, sleep, social connection, and text tone
- Explainable/root-cause-style factor breakdowns instead of a single unexplained score
- Local trajectory/history and personalized insights
- Tell Once / local context memory so users do not have to repeat the same profile details
- Voice-to-text check-ins through the Android speech recognizer
- Optional Android Health Connect sleep reading on supported devices
- SOS support that opens the emergency dialer (112) only after user action
- Trusted-person message sharing and counsellor/care workflow demo
- On-device/local-storage-first prototype data handling
- Automatic APK builds with GitHub Actions

## Build

Every push to `main` triggers `.github/workflows/build-apk.yml` and uploads a debug APK artifact named `SAHAAY-AI-v10-apk`.

> SAHAAY AI is a support and early-warning prototype, not a medical diagnosis or substitute for emergency or professional services.
