# Google Play Store Background Location & Foreground Service Justification

This document provides the exact text, disclosure specifications, and reviewer demonstration requirements required for Google Play Console submission under **Sensitive App Permissions: Location in the background (`ACCESS_BACKGROUND_LOCATION`)** and **Foreground Service: Location (`FOREGROUND_SERVICE_LOCATION`)**.

---

## 1. Google Play Console Form Answers

### Question 1: What is the core feature of your app that requires access to location in the background?
> **Answer**:
> The core feature is **Field Workforce Shift Attendance & Real-Time Route Verification**. HRMS Attendance is an enterprise human resource and workforce management application used by distributed field technicians, sales representatives, and security personnel. The application records location breadcrumbs strictly during an active, on-duty work shift (between check-in and check-out) to calculate accurate mileage reimbursement, verify presence at assigned client worksites, and ensure lone-worker physical safety. 

### Question 2: Why can’t the feature be delivered while the app is in the foreground or using a one-time location request?
> **Answer**:
> Field employees routinely perform tasks while their mobile devices are locked in their pockets or running navigation/work-order tools in the foreground. If location access were restricted to foreground only, route tracking and work-hour verification would stop as soon as the screen turns off or the worker switches apps. This would result in incomplete shift logs, inaccurate travel expense reimbursements, and an inability to dispatch emergency assistance if a lone field worker encounters an incident.

### Question 3: How does the user know that location is being tracked in the background?
> **Answer**:
> 1. **Prominent In-App Disclosure**: Before requesting any background permission, the app presents a full-screen disclosure explaining why background tracking is required, when it runs, and how to control it.
> 2. **Persistent Foreground Notification**: On Android, whenever a shift is active, an ongoing, non-dismissible foreground service notification is prominently visible with the title *"HRMS Live Tracking Active"* and subtitle *"Recording location for active on-duty work shift."*
> 3. **Strict On-Duty Boundary**: The service and background tracking terminate unconditionally the moment the employee taps "Check-Out" or when their shift ends. No tracking occurs off-duty.

---

## 2. Prominent In-App Disclosure Copy

*Displayed on a dedicated screen prior to invoking the Android runtime permission request:*

```text
Title: Background Location Access Required for Shift Tracking

HRMS Attendance collects location data to enable:
• Automated presence verification at assigned office and client facilities.
• Route tracking and mileage calculation for travel reimbursements.
• Lone-worker safety monitoring during active field assignments.

This tracking occurs EVEN WHEN THE APP IS CLOSED OR NOT IN USE, but ONLY while you are actively clocked in on duty.

Privacy Guarantees:
✓ Tracking starts only after you tap "Check-In".
✓ Tracking stops immediately and completely when you tap "Check-Out".
✓ An ongoing notification will always be visible while tracking is active.
✓ Your location is NEVER accessed while you are off duty or on personal time.
```

---

## 3. Video Demonstration Script for Google Play Reviewer

Google Play requires a public YouTube or Google Drive link demonstrating the feature on a real or simulated Android device.

### Demonstration Checklist:
1. **Login & Disclosure**: Open HRMS Attendance. Navigate to attendance tab. The app displays the prominent disclosure modal before requesting permission.
2. **Permission Grant**: The app requests "Allow all the time" (background permission) only after foreground location permission has already been granted.
3. **Shift Start (Check-In)**: Tap "Check-In". Show that the Android Notification Drawer immediately displays the persistent notification:
   - *Title*: `HRMS Live Tracking Active`
   - *Body*: `Recording location for active on-duty work shift.`
   - *Icon*: Monochrome location icon.
4. **App Backgrounding**: Press the Home button and lock the screen. Walk or simulate movement (using mock location or emulator routes). Show that the foreground notification remains active and updates continue.
5. **App Relaunch**: Re-open the app. Show the active tracking banner reflecting updated points and distance.
6. **Shift End (Check-Out)**: Tap "Check-Out". Show that the persistent foreground service notification disappears immediately from the notification drawer, and all location tracking stops completely.

---

## 4. Sensitive Permission & Manifest Compliance Checklist

- [x] Declared in AndroidManifest via `app.config.ts`:
  - `android.permission.ACCESS_FINE_LOCATION`
  - `android.permission.ACCESS_BACKGROUND_LOCATION`
  - `android.permission.FOREGROUND_SERVICE`
  - `android.permission.FOREGROUND_SERVICE_LOCATION`
- [x] Notification icon provided as monochrome PNG: `androidForegroundServiceIcon: './assets/images/android-icon-monochrome.png'`.
- [x] Two-step permission flow: Foreground permission is requested and verified before background permission is ever requested.
- [x] Target SDK: Android 14+ (API 34) compliant with explicit foreground service type `location`.
