using System.Web;
using System.Web.Optimization;

namespace SMZ.PRESENTATION
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap/bootstrap.js",
                      "~/Scripts/bootstrap/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",
                      "~/Content/print.css"));

            bundles.Add(new StyleBundle("~/Content/jquery-ui").Include(
                      "~/Content/jquery-ui.min.css"));

            bundles.Add(new ScriptBundle("~/bundles/datatable").Include(
                      "~/Scripts/dataTable/dataTables.bootstrap.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jquery.datatable").Include(
                      "~/Scripts/dataTable/jquery.dataTables.min.js"));

            bundles.Add(new StyleBundle("~/Content/datatable").Include(
                      "~/Content/dataTables.bootstrap.min.css"));

            bundles.Add(new ScriptBundle("~/bundles/constant").Include(
                    "~/Scripts/default/constant.js"));

            bundles.Add(new StyleBundle("~/Content/sweetalert2").Include(
                      "~/Content/sweetalert2.min.css"));

            bundles.Add(new ScriptBundle("~/bundles/sweetalert2").Include(
                    "~/Scripts/sweetalert2.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/hijri").Include(
                    "~/Scripts/hijricalendar.js"));

            bundles.Add(new ScriptBundle("~/bundles/moment").Include(
                    "~/Scripts/moment/moment-with-locales.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/typeahead").Include(
                    "~/Scripts/typeahead/typeahead.bundle.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/common").Include(
                    "~/Scripts/default/common.js"));

            bundles.Add(new ScriptBundle("~/bundles/jquery-ui").Include(
                    "~/Scripts/jquery/jquery-ui.min.js"));
        }
    }
}
