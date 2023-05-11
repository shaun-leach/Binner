﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Binner.Data.Migrations.Postgresql.Migrations
{
    /// <inheritdoc />
    public partial class AddLabelTemplateLabelCount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LabelCount",
                schema: "dbo",
                table: "LabelTemplates",
                type: "integer",
                nullable: false,
                defaultValue: 0);

                        migrationBuilder.Sql(@"
INSERT INTO dbo.""LabelTemplates"" (""Name"", ""Description"", ""DriverName"", ""DriverWidth"", ""DriverHeight"", ""ExtraData"", ""Width"", Height"", ""LabelCount"", ""Margin"", ""Dpi"", ""LabelPaperSource"", ""OrganizationId"", ""UserId"") VALUES('30277', 'File Folder (2 up, 3 7/16 in x 9/16 in)', 'w82h248', 82, 248, '', '3.4375', '0.5625', 2, '0', '300', 0, 1, 1);
INSERT INTO dbo.""LabelTemplates"" (""Name"", ""Description"", ""DriverName"", ""DriverWidth"", ""DriverHeight"", ""ExtraData"", ""Width"", Height"", ""LabelCount"", ""Margin"", ""Dpi"", ""LabelPaperSource"", ""OrganizationId"", ""UserId"") VALUES('30346', '1/2 in x 1-7/8 in', 'w36h136', 36, 136, '', '1.875', '0.5', 1, '0', '300', 0, 1, 1);
INSERT INTO dbo.""LabelTemplates"" (""Name"", ""Description"", ""DriverName"", ""DriverWidth"", ""DriverHeight"", ""ExtraData"", ""Width"", Height"", ""LabelCount"", ""Margin"", ""Dpi"", ""LabelPaperSource"", ""OrganizationId"", ""UserId"") VALUES('30347', '1 in x 1-1/2 in', 'w72h108', 72, 108, '', '1.5', '1.0', 1, '0', '300', 0, 1, 1);
INSERT INTO dbo.""LabelTemplates"" (""Name"", ""Description"", ""DriverName"", ""DriverWidth"", ""DriverHeight"", ""ExtraData"", ""Width"", Height"", ""LabelCount"", ""Margin"", ""Dpi"", ""LabelPaperSource"", ""OrganizationId"", ""UserId"") VALUES('30348', '9/10 in x 1 1/4 in', 'w65h90', 65, 90, '', '1.25', '0.9', 1, '0', '300', 0, 1, 1);
INSERT INTO dbo.""LabelTemplates"" (""Name"", ""Description"", ""DriverName"", ""DriverWidth"", ""DriverHeight"", ""ExtraData"", ""Width"", Height"", ""LabelCount"", ""Margin"", ""Dpi"", ""LabelPaperSource"", ""OrganizationId"", ""UserId"") VALUES('30327', 'File Folder (3 7/16 in x 9/16 in)', 'w57h248', 57, 248, '', '3.4375', '0.5625', 1, '0', '300', 0, 1, 1);
INSERT INTO dbo.""LabelTemplates"" (""Name"", ""Description"", ""DriverName"", ""DriverWidth"", ""DriverHeight"", ""ExtraData"", ""Width"", Height"", ""LabelCount"", ""Margin"", ""Dpi"", ""LabelPaperSource"", ""OrganizationId"", ""UserId"") VALUES('30252', 'Address (1-1/8 in x 3 1/2 in)', 'w79h252', 79, 252, '', '3.5', '1.125', 1, '0', '300', 0, 1, 1);
INSERT INTO dbo.""LabelTemplates"" (""Name"", ""Description"", ""DriverName"", ""DriverWidth"", ""DriverHeight"", ""ExtraData"", ""Width"", Height"", ""LabelCount"", ""Margin"", ""Dpi"", ""LabelPaperSource"", ""OrganizationId"", ""UserId"") VALUES('30299', 'Jewelry (3/8 in x 3/4 in)', 'w154h64.1', 154, 64, '', '0.75', '0.375', 1, '0', '300', 0, 1, 1);
INSERT INTO dbo.""LabelTemplates"" (""Name"", ""Description"", ""DriverName"", ""DriverWidth"", ""DriverHeight"", ""ExtraData"", ""Width"", Height"", ""LabelCount"", ""Margin"", ""Dpi"", ""LabelPaperSource"", ""OrganizationId"", ""UserId"") VALUES('30333', 'Multipurpose (2 up, 1/2 in x 1 in)', 'w72h72.2', 72, 72, '', '1.0', '0.5', 2, '0', '300', 0, 1, 1);
INSERT INTO dbo.""LabelTemplates"" (""Name"", ""Description"", ""DriverName"", ""DriverWidth"", ""DriverHeight"", ""ExtraData"", ""Width"", Height"", ""LabelCount"", ""Margin"", ""Dpi"", ""LabelPaperSource"", ""OrganizationId"", ""UserId"") VALUES('30336', 'Multipurpose (1 in x 2 1/8 in)', 'w72h154.1', 72, 154, '', '2.125', '1.0', 1, '0', '300', 0, 1, 1);
INSERT INTO dbo.""LabelTemplates"" (""Name"", ""Description"", ""DriverName"", ""DriverWidth"", ""DriverHeight"", ""ExtraData"", ""Width"", Height"", ""LabelCount"", ""Margin"", ""Dpi"", ""LabelPaperSource"", ""OrganizationId"", ""UserId"") VALUES('30345', 'Multipurpose (3/4 in x 2 1/2 in)', 'w54h180', 54, 180, '', '2.5', '0.75', 1, '0', '300', 0, 1, 1);
");
                        migrationBuilder.Sql(@"
INSERT INTO dbo.""Labels"" (""Name"", ""LabelTemplateId"", ""IsPartLabelTemplate"", ""UserId"", ""OrganizationId"", ""Template"") VALUES('Parts Label Small', 2, 1, 1, 1, '{""boxes"":[{""name"":""dataMatrix2d"",""acceptsValue"":true,""displayValue"":false,""id"":""1-dataMatrix2d"",""left"":0,""top"":0,""width"":36,""height"":36,""resize"":""both"",""properties"":{""name"":""dataMatrix2d"",""font"":""Segoe UI"",""align"":0,""fontSize"":2,""fontWeight"":0,""color"":0,""rotate"":0,""value"":""""}},{""name"":""partNumber"",""acceptsValue"":false,""displayValue"":false,""id"":""2-partNumber"",""left"":36,""top"":0,""width"":112,""height"":11,""resize"":""horizontal"",""properties"":{""name"":""partNumber"",""font"":""Segoe UI"",""align"":0,""fontSize"":2,""fontWeight"":1,""color"":0,""rotate"":0,""value"":""""}},{""name"":""binNumber"",""acceptsValue"":false,""displayValue"":false,""id"":""3-binNumber"",""left"":36,""top"":13,""width"":55,""height"":10,""resize"":""horizontal"",""properties"":{""name"":""binNumber"",""font"":""Segoe UI"",""align"":1,""fontSize"":1,""fontWeight"":0,""color"":0,""rotate"":0,""value"":""""}},{""name"":""binNumber2"",""acceptsValue"":false,""displayValue"":false,""id"":""4-binNumber2"",""left"":92,""top"":14,""width"":55,""height"":10,""resize"":""horizontal"",""properties"":{""name"":""binNumber2"",""font"":""Segoe UI"",""align"":2,""fontSize"":1,""fontWeight"":0,""color"":0,""rotate"":0,""value"":""""}},{""name"":""description"",""acceptsValue"":false,""displayValue"":false,""id"":""5-description"",""left"":37,""top"":25,""width"":115,""height"":17,""resize"":""both"",""properties"":{""name"":""description"",""font"":""Segoe UI"",""align"":0,""fontSize"":0,""fontWeight"":0,""color"":0,""rotate"":0,""value"":""""}}],""label"":{""width"":1.875,""height"":0.5,""labelTemplateId"":2,""name"":""30346"",""dpi"":300,""margin"":""0"",""showBoundaries"":false}}');
INSERT INTO dbo.""Labels"" (""Name"", ""LabelTemplateId"", ""IsPartLabelTemplate"", ""UserId"", ""OrganizationId"", ""Template"") VALUES('Parts Label Wide', 1, 0, 1, 1, '{""boxes"":[{""name"":""partNumber"",""acceptsValue"":false,""displayValue"":false,""id"":""1-partNumber"",""left"":100,""top"":0,""width"":140,""height"":14,""resize"":""horizontal"",""properties"":{""name"":""partNumber"",""font"":""Segoe UI"",""align"":0,""fontSize"":3,""fontWeight"":1,""color"":0,""rotate"":0,""value"":""""}},{""name"":""dataMatrix2d"",""acceptsValue"":true,""displayValue"":false,""id"":""2-dataMatrix2d"",""left"":0,""top"":0,""width"":46,""height"":44,""resize"":""both"",""properties"":{""name"":""dataMatrix2d"",""font"":""Segoe UI"",""align"":0,""fontSize"":2,""fontWeight"":0,""color"":0,""rotate"":0,""value"":""""}},{""name"":""description"",""acceptsValue"":false,""displayValue"":false,""id"":""3-description"",""left"":47,""top"":30,""width"":250,""height"":8,""resize"":""both"",""properties"":{""name"":""description"",""font"":""Source Code Pro Light"",""align"":0,""fontSize"":0,""fontWeight"":0,""color"":0,""rotate"":0,""value"":""""}},{""name"":""binNumber"",""acceptsValue"":false,""displayValue"":false,""id"":""4-binNumber"",""left"":49,""top"":0,""width"":49,""height"":10,""resize"":""horizontal"",""properties"":{""name"":""binNumber"",""font"":""Segoe UI"",""align"":1,""fontSize"":1,""fontWeight"":0,""color"":0,""rotate"":0,""value"":""""}},{""name"":""binNumber2"",""acceptsValue"":false,""displayValue"":false,""id"":""5-binNumber2"",""left"":241,""top"":0,""width"":46,""height"":10,""resize"":""horizontal"",""properties"":{""name"":""binNumber2"",""font"":""Segoe UI"",""align"":2,""fontSize"":1,""fontWeight"":0,""color"":0,""rotate"":0,""value"":""""}},{""name"":""partType"",""acceptsValue"":false,""displayValue"":false,""id"":""6-partType"",""left"":131,""top"":20,""width"":67,""height"":10,""resize"":""horizontal"",""properties"":{""name"":""partType"",""font"":""Staatliches"",""align"":0,""fontSize"":1,""fontWeight"":1,""color"":0,""rotate"":0,""value"":""""}}],""label"":{""width"":3.4375,""height"":0.5625,""labelTemplateId"":1,""name"":""30277"",""dpi"":300,""margin"":""0"",""showBoundaries"":false}}');
INSERT INTO dbo.""Labels"" (""Name"", ""LabelTemplateId"", ""IsPartLabelTemplate"", ""UserId"", ""OrganizationId"", ""Template"") VALUES('Parts Label Large Square', 3, 0, 1, 1, '{""boxes"":[{""name"":""dataMatrix2d"",""acceptsValue"":true,""displayValue"":false,""id"":""1-dataMatrix2d"",""left"":42,""top"":2,""width"":60,""height"":60,""resize"":""both"",""properties"":{""name"":""dataMatrix2d"",""font"":""Segoe UI"",""align"":0,""fontSize"":2,""fontWeight"":0,""color"":0,""rotate"":0,""value"":""""}},{""name"":""partNumber"",""acceptsValue"":false,""displayValue"":false,""id"":""2-partNumber"",""left"":8,""top"":62,""width"":127,""height"":14,""resize"":""horizontal"",""properties"":{""name"":""partNumber"",""font"":""Segoe UI"",""align"":0,""fontSize"":3,""fontWeight"":1,""color"":0,""rotate"":0,""value"":""""}},{""name"":""binNumber"",""acceptsValue"":false,""displayValue"":false,""id"":""3-binNumber"",""left"":2,""top"":81,""width"":62,""height"":9,""resize"":""horizontal"",""properties"":{""name"":""binNumber"",""font"":""Segoe UI"",""align"":1,""fontSize"":0,""fontWeight"":0,""color"":6,""rotate"":0,""value"":""""}},{""name"":""binNumber2"",""acceptsValue"":false,""displayValue"":false,""id"":""4-binNumber2"",""left"":77,""top"":81,""width"":62,""height"":9,""resize"":""horizontal"",""properties"":{""name"":""binNumber2"",""font"":""Segoe UI"",""align"":2,""fontSize"":0,""fontWeight"":0,""color"":6,""rotate"":0,""value"":""""}}],""label"":{""width"":1.5,""height"":1.0,""labelTemplateId"":3,""name"":""30347"",""dpi"":300,""margin"":""0"",""showBoundaries"":false}}');
INSERT INTO dbo.""Labels"" (""Name"", ""LabelTemplateId"", ""IsPartLabelTemplate"", ""UserId"", ""OrganizationId"", ""Template"") VALUES('Parts Label Tiny', 7, 0, 1, 1, '{""boxes"":[{""name"":""partNumber"",""acceptsValue"":false,""displayValue"":false,""id"":""1-partNumber"",""left"":3,""top"":12,""width"":66,""height"":11,""resize"":""horizontal"",""properties"":{""name"":""partNumber"",""font"":""Segoe UI"",""align"":0,""fontSize"":2,""fontWeight"":0,""color"":0,""rotate"":0,""value"":""""}}],""label"":{""width"":0.75,""height"":0.375,""labelTemplateId"":7,""name"":""30299"",""dpi"":300,""margin"":""0"",""showBoundaries"":false}}');
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LabelCount",
                schema: "dbo",
                table: "LabelTemplates");
        }
    }
}