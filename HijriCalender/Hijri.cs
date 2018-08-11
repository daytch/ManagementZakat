using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Globalization;
using System.Web;

namespace HijriCalender
{
    public class Hijri
    {
        private HttpContext cur;
        private const int startGreg = 1900;
        private const int endGreg = 2100;
        private string[] allFormats ={"yyyy/MM/dd","yyyy/M/d",
                "dd/MM/yyyy","d/M/yyyy",
                "dd/M/yyyy","d/MM/yyyy","yyyy-MM-dd",
                "yyyy-M-d","dd-MM-yyyy","d-M-yyyy",
                "dd-M-yyyy","d-MM-yyyy","yyyy MM dd",
                "yyyy M d","dd MM yyyy","d M yyyy",
                "dd M yyyy","d MM yyyy"};

        private CultureInfo arCul;
        private CultureInfo enCul;
        private HijriCalendar h;
        private GregorianCalendar g;

        public Hijri()
        {
            cur = HttpContext.Current;
            arCul = new CultureInfo("ar-SA");
            enCul = new CultureInfo("tr-TR");

            h = new HijriCalendar();
            g = new GregorianCalendar(GregorianCalendarTypes.USEnglish);

            arCul.DateTimeFormat.Calendar = h;
        }

        ///
        /// Check if string is hijri date and then return true
        ///
        ///
        ///
        public bool IsHijri(string hijri)
        {
            if (hijri.Length <= 0)
            {
                cur.Trace.Warn("IsHijri Error: Date String is Empty");
                return false;
            }
            try
            {
                DateTime tempDate = DateTime.ParseExact(hijri, allFormats,
                arCul.DateTimeFormat, DateTimeStyles.AllowWhiteSpaces);
                if (tempDate.Year >= startGreg && tempDate.Year <= endGreg)
                    return true;
                else
                    return false;

            }
            catch (Exception ex)
            {
                cur.Trace.Warn("IsHijri Error :" + hijri.ToString() + "\n" + ex.Message);
                return false;
            }
        }

        ///
        /// Check if string is Gregorian date and then return true
        ///
        ///
        ///
        public bool IsGreg(string greg)
        {
            if (greg.Length <= 0)
            {
                cur.Trace.Warn("IsGreg :Date String is Empty");
                return false;
            }
            try
            {
                DateTime tempDate = DateTime.ParseExact(greg, allFormats,
                enCul.DateTimeFormat, DateTimeStyles.AllowWhiteSpaces);
                if (tempDate.Year >= startGreg && tempDate.Year <= endGreg)
                    return true;
                else
                    return false;
            }
            catch (Exception ex)
            {
                cur.Trace.Warn("IsGreg Error :" + greg.ToString() + "\n" + ex.Message);
                return false;
            }
        }

        ///
        /// Return Formatted Hijri date string
        ///
        ///
        ///
        ///
        public string FormatHijri(string date, string format)
        {
            if (date.Length <= 0)
            {
                cur.Trace.Warn("Format :Date String is Empty");
                return "";
            }
            try
            {
                DateTime tempDate = DateTime.ParseExact(date,
                allFormats, arCul.DateTimeFormat, DateTimeStyles.AllowWhiteSpaces);
                return tempDate.ToString(format, arCul.DateTimeFormat);
            }
            catch (Exception ex)
            {
                cur.Trace.Warn("Date :\n" + ex.Message);
                return "";
            }
        }

        ///
        /// Returned Formatted Gregorian date string
        ///
        ///
        ///
        ///
        public string FormatGreg(string date, string format)
        {
            if (date.Length <= 0)
            {
                cur.Trace.Warn("Format :Date String is Empty");
                return "";
            }
            try
            {
                DateTime tempDate = DateTime.ParseExact(date, allFormats,
                enCul.DateTimeFormat, DateTimeStyles.AllowWhiteSpaces);
                return tempDate.ToString(format, enCul.DateTimeFormat);
            }
            catch (Exception ex)
            {
                cur.Trace.Warn("Date :\n" + ex.Message);
                return "";
            }
        }

        ///
        /// Return Today Gregorian date and return it in yyyy/MM/dd format
        ///
        ///

        public string GDateNow()
        {
            try
            {
                return DateTime.Now.ToString("yyyy/MM/dd", enCul.DateTimeFormat);
            }
            catch (Exception ex)
            {
                cur.Trace.Warn("GDateNow :\n" + ex.Message);
                return "";
            }
        }

        ///
        /// Return formatted today Gregorian date based on your format
        ///
        ///
        ///
        public string GDateNow(string format)
        {
            try
            {
                return DateTime.Now.ToString(format, enCul.DateTimeFormat);
            }
            catch (Exception ex)
            {
                cur.Trace.Warn("GDateNow :\n" + ex.Message);
                return "";
            }

        }

        ///
        /// Return Today Hijri date and return it in yyyy/MM/dd format
        ///
        ///
        public string HDateNow()
        {
            try
            {
                return DateTime.Now.ToString("yyyy/MM/dd", arCul.DateTimeFormat);
            }
            catch (Exception ex)
            {
                cur.Trace.Warn("HDateNow :\n" + ex.Message);
                return "";
            }
        }

        ///
        /// Return formatted today hijri date based on your format
        ///
        ///
        ///
        public string HDateNow(string format)
        {
            try
            {
                return DateTime.Now.ToString(format, arCul.DateTimeFormat);
            }
            catch (Exception ex)
            {
                cur.Trace.Warn("HDateNow :\n" + ex.Message);
                return "";
            }
        }

        ///
        /// Convert Hijri Date to it's equivalent Gregorian Date
        ///
        ///
        ///
        public string HijriToGreg(string hijri)
        {
            if (hijri.Length <= 0)
            {
                cur.Trace.Warn("HijriToGreg :Date String is Empty");
                return "";
            }
            try
            {
                DateTime tempDate = DateTime.ParseExact(hijri, allFormats,
                arCul.DateTimeFormat, DateTimeStyles.AllowWhiteSpaces);
                return tempDate.ToString("yyyy/MM/dd", enCul.DateTimeFormat);
            }
            catch (Exception ex)
            {
                cur.Trace.Warn("HijriToGreg :" + hijri.ToString() + "\n" + ex.Message);
                return "";
            }
        }

        ///
        /// Convert Hijri Date to it's equivalent Gregorian Date
        /// and return it in specified format
        ///
        ///
        ///
        ///
        public string HijriToGreg(string hijri, string format)
        {
            if (hijri.Length <= 0)
            {
                cur.Trace.Warn("HijriToGreg :Date String is Empty");
                return "";
            }
            try
            {
                DateTime tempDate = DateTime.ParseExact(hijri,
                allFormats, arCul.DateTimeFormat, DateTimeStyles.AllowWhiteSpaces);
                return tempDate.ToString(format, enCul.DateTimeFormat);
            }
            catch (Exception ex)
            {
                cur.Trace.Warn("HijriToGreg :" + hijri.ToString() + "\n" + ex.Message);
                return "";
            }
        }

        ///
        /// Convert Gregoian Date to it's equivalent Hijir Date
        ///
        ///
        ///
        public string GregToHijri(string greg)
        {
            if (greg.Length <= 0)
            {
                cur.Trace.Warn("GregToHijri :Date String is Empty");
                return "";
            }
            try
            {
                DateTime tempDate = DateTime.ParseExact(greg, allFormats,
                enCul.DateTimeFormat, DateTimeStyles.AllowWhiteSpaces);
                return tempDate.ToString("yyyy/MM/dd", arCul.DateTimeFormat);
            }
            catch (Exception ex)
            {
                cur.Trace.Warn("GregToHijri :" + greg.ToString() + "\n" + ex.Message);
                return "";
            }
        }

        ///
        /// Convert Hijri Date to it's equivalent Gregorian Date and
        /// return it in specified format
        ///
        ///
        ///
        ///
        public string GregToHijri(string greg, string format)
        {
            if (greg.Length <= 0)
            {
                cur.Trace.Warn("GregToHijri :Date String is Empty");
                return "";
            }
            try
            {
                DateTime tempDate = DateTime.ParseExact(greg, allFormats,
                enCul.DateTimeFormat, DateTimeStyles.AllowWhiteSpaces);
                return tempDate.ToString(format, arCul.DateTimeFormat);
            }
            catch (Exception ex)
            {
                cur.Trace.Warn("GregToHijri :" + greg.ToString() + "\n" + ex.Message);
                return "";
            }
        }

        ///
        /// Return Gregrian Date Time as digit stamp
        ///
        ///
        public string GTimeStamp()
        {
            return GDateNow("yyyyMMddHHmmss");
        }

        ///
        /// Return Hijri Date Time as digit stamp
        ///
        ///
        public string HTimeStamp()
        {
            return HDateNow("yyyyMMddHHmmss");
        }

        ///
        /// Compare two instaces of string date
        /// and return indication of thier values
        ///
        ///
        ///
        /// positive d1 is greater than d2,
        /// negative d1 is smaller than d2, 0 both are equal
        public int Compare(string d1, string d2)
        {
            try
            {
                DateTime date1 = DateTime.ParseExact(d1, allFormats,
                arCul.DateTimeFormat, DateTimeStyles.AllowWhiteSpaces);
                DateTime date2 = DateTime.ParseExact(d2, allFormats,
                arCul.DateTimeFormat, DateTimeStyles.AllowWhiteSpaces);
                return DateTime.Compare(date1, date2);
            }
            catch (Exception ex)
            {
                cur.Trace.Warn("Compare :" + "\n" + ex.Message);
                return -1;
            }
        }

        public string ConvertToBrowserForm_Date(string date)
        {
            DateTime time = DateTime.Parse(date);
            int month = time.Month;
            int year = time.Year;
            int day = time.Day;
            return day.ToString() + "_" + month.ToString() + "_" + year.ToString();
        }

        public string ConvertToNormalForm_Date(string date)
        {
            string[] split = date.Split('_');
            string month = split[1];
            string year = split[2];
            string day = split[0];

            DateTime time = new DateTime(Convert.ToInt32(year), Convert.ToInt32(month), Convert.ToInt32(day));
            return time.ToLongDateString();
        }
    }
}

