using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HijriCalender
{
    class Program
    {
        static void Main(string[] args)
        {
            Hijri a = new Hijri();
            string hdateNow = a.HDateNow("dd MM yyyy");
            string gDateNow = a.GDateNow("dd MM yyyy");

            Console.Write(gDateNow);
            Console.ReadKey();
        }
    }
}
