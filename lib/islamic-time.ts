/**
 * Islamic Prayer Times and Hijri Calendar Calculation Engine
 * Tuned for Al Jamia Tul Bukhari (Shahganj, Agra, India - 27.18° N, 78.01° E, UTC+5:30)
 * Uses Hanafi Asr calculation and standard University of Islamic Sciences / MWL solar method.
 */

export interface PrayerTimeSlot {
  name: string;
  timeStr: string;
  hours: number;
}

export interface IslamicLiveInfo {
  liveTime: string;
  currentPrayer: string;
  nextPrayer: string;
  nextPrayerTime: string;
  prayerDisplayText: string;
  hijriDate: string;
  gregorianDate: string;
  prayers: Record<string, PrayerTimeSlot>;
}

function getSunPosition(jd: number) {
  const d = jd - 2451545.0;
  const q = (280.459 + 0.98564736 * d) % 360;
  const g = ((357.529 + 0.98560028 * d) % 360) * Math.PI / 180;
  const L = (q + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) % 360;
  const e = (23.439 - 0.00000036 * d) * Math.PI / 180;

  const Lrad = L * Math.PI / 180;
  const sinDec = Math.sin(e) * Math.sin(Lrad);
  const dec = Math.asin(sinDec);

  let RA = Math.atan2(Math.cos(e) * Math.sin(Lrad), Math.cos(Lrad)) * 180 / Math.PI;
  RA = (RA + 360) % 360;

  let qNorm = (q + 360) % 360;
  let eqt = qNorm - RA;
  if (eqt > 180) eqt -= 360;
  if (eqt < -180) eqt += 360;
  eqt = eqt * 4;

  return { dec: dec * 180 / Math.PI, eqt };
}

export function calculatePrayerTimes(date: Date = new Date(), lat = 27.18, lng = 78.01, tz = 5.5) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  const jd =
    367 * y -
    Math.floor((7 * (y + Math.floor((m + 9) / 12))) / 4) +
    Math.floor((275 * m) / 9) +
    d +
    1721013.5;

  const { dec, eqt } = getSunPosition(jd);
  const solarNoon = 12 + tz - lng / 15 - eqt / 60;

  const latRad = lat * Math.PI / 180;
  const decRad = dec * Math.PI / 180;

  function getHA(altitude: number) {
    const altRad = altitude * Math.PI / 180;
    const cosHA =
      (Math.sin(altRad) - Math.sin(latRad) * Math.sin(decRad)) /
      (Math.cos(latRad) * Math.cos(decRad));
    if (cosHA > 1 || cosHA < -1) return 0;
    return Math.acos(cosHA) * 180 / Math.PI / 15;
  }

  const fajrHA = getHA(-18);
  const sunriseHA = getHA(-0.833);
  const asrHanafiAlt = Math.atan(1 / (2 + Math.tan(Math.abs(latRad - decRad)))) * 180 / Math.PI;
  const asrHA = getHA(asrHanafiAlt);
  const ishaHA = getHA(-18);

  function fmt(hours: number) {
    let totalMinutes = Math.round(hours * 60);
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    let h = Math.floor(totalMinutes / 60) % 24;
    let min = totalMinutes % 60;
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(min).padStart(2, "0")} ${ampm}`;
  }

  return {
    fajr: { name: "Fajr", timeStr: fmt(solarNoon - fajrHA), hours: solarNoon - fajrHA },
    sunrise: { name: "Sunrise", timeStr: fmt(solarNoon - sunriseHA), hours: solarNoon - sunriseHA },
    dhuhr: { name: "Dhuhr", timeStr: fmt(solarNoon), hours: solarNoon },
    asr: { name: "Asr", timeStr: fmt(solarNoon + asrHA), hours: solarNoon + asrHA },
    maghrib: { name: "Maghrib", timeStr: fmt(solarNoon + sunriseHA), hours: solarNoon + sunriseHA },
    isha: { name: "Isha", timeStr: fmt(solarNoon + ishaHA), hours: solarNoon + ishaHA },
  };
}

export function getLiveIslamicInfo(date: Date = new Date()): IslamicLiveInfo {
  const prayers = calculatePrayerTimes(date);
  const curHours = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;

  // In Islam, day changes at Maghrib sunset
  const isAfterMaghrib = curHours >= prayers.maghrib.hours;

  let currentPrayer = "Isha";
  let nextPrayer = "Fajr";
  let nextPrayerTime = prayers.fajr.timeStr;

  if (curHours >= prayers.fajr.hours && curHours < prayers.sunrise.hours) {
    currentPrayer = "Fajr";
    nextPrayer = "Sunrise";
    nextPrayerTime = prayers.sunrise.timeStr;
  } else if (curHours >= prayers.sunrise.hours && curHours < prayers.dhuhr.hours) {
    currentPrayer = "Ishraq";
    nextPrayer = "Dhuhr";
    nextPrayerTime = prayers.dhuhr.timeStr;
  } else if (curHours >= prayers.dhuhr.hours && curHours < prayers.asr.hours) {
    currentPrayer = "Dhuhr";
    nextPrayer = "Asr";
    nextPrayerTime = prayers.asr.timeStr;
  } else if (curHours >= prayers.asr.hours && curHours < prayers.maghrib.hours) {
    currentPrayer = "Asr";
    nextPrayer = "Maghrib";
    nextPrayerTime = prayers.maghrib.timeStr;
  } else if (curHours >= prayers.maghrib.hours && curHours < prayers.isha.hours) {
    currentPrayer = "Maghrib";
    nextPrayer = "Isha";
    nextPrayerTime = prayers.isha.timeStr;
  } else {
    currentPrayer = "Isha";
    nextPrayer = "Fajr";
    nextPrayerTime = prayers.fajr.timeStr;
  }

  // Calculate dynamic Hijri date
  const targetDate = new Date(date);
  if (isAfterMaghrib) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  let hijriDate = "";
  try {
    const formatter = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const parts = formatter.formatToParts(targetDate);
    let day = "", month = "", year = "", era = "AH";
    for (const part of parts) {
      if (part.type === "day") day = part.value;
      if (part.type === "month") month = part.value;
      if (part.type === "year") year = part.value;
      if (part.type === "era") era = part.value;
    }

    const monthNames: Record<string, string> = {
      Muharram: "Muharram",
      Safar: "Safar",
      "Rabiʻ I": "Rabi al-Awwal",
      "Rabiʻ II": "Rabi al-Thani",
      "Jumada I": "Jumada al-Ula",
      "Jumada II": "Jumada al-Thani",
      Rajab: "Rajab",
      "Shaʻban": "Shaban",
      Ramadan: "Ramadan",
      Shawwal: "Shawwal",
      "Dhuʻl-Qiʻdah": "Dhul Qadah",
      "Dhuʻl-Hijjah": "Dhul Hijjah",
    };

    hijriDate = `${day} ${monthNames[month] || month} ${year} ${era}`;
  } catch {
    hijriDate = "3 Jumada al-Ula 1448 AH";
  }

  const liveTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const gregorianDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const prayerDisplayText =
    currentPrayer === "Ishraq"
      ? `Ishraq • Next: ${nextPrayer} ${nextPrayerTime}`
      : `${currentPrayer} Waqt (Next: ${nextPrayer} ${nextPrayerTime})`;

  return {
    liveTime,
    currentPrayer,
    nextPrayer,
    nextPrayerTime,
    prayerDisplayText,
    hijriDate,
    gregorianDate,
    prayers,
  };
}
